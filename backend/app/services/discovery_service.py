"""
Job Discovery Service — fetches live jobs from Remotive API (no auth required)
and matches them against the user's resume using skill keyword extraction.
"""
import httpx
from typing import List, Dict, Any
from bs4 import BeautifulSoup
from sqlalchemy.orm import Session
from app.models.job import Job
from app.models.resume import Resume
from app.services.skill_extractor import extract_skills
from app.services.ats_service import score_keyword_match
import logging
import uuid
import re

logger = logging.getLogger(__name__)

REMOTIVE_URL = "https://remotive.com/api/remote-jobs"


def clean_html(raw_html: str) -> str:
    """Strip HTML tags from job descriptions for better analysis."""
    if not raw_html:
        return ""
    soup = BeautifulSoup(raw_html, "html.parser")
    text = soup.get_text(separator=" ")
    return re.sub(r'\s+', ' ', text).strip()


async def fetch_jobs_from_api(limit: int = 20, search_query: str = "") -> List[Dict[str, Any]]:
    """Fetch live jobs from Remotive API."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            url = f"{REMOTIVE_URL}?search={search_query}&limit={limit}" if search_query else f"{REMOTIVE_URL}?category=software-dev&limit={limit}"
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            jobs = data.get("jobs", [])[:limit]
            
            # Map to our standard format
            mapped_jobs = []
            for j in jobs:
                description = clean_html(j.get("description", ""))
                mapped_jobs.append({
                    "title": j.get("title", ""),
                    "company_name": j.get("company_name", ""),
                    "location": j.get("candidate_required_location", "Remote"),
                    "salary": j.get("salary") or "Competitive",
                    "description": description,
                    "url": j.get("url", ""),
                    "source_portal": "Remotive",
                })
            return mapped_jobs
    except Exception as e:
        logger.error(f"Failed to fetch jobs from Remotive API: {e}")
        return []


def discover_and_match_jobs(
    db: Session,
    user_id: uuid.UUID,
    limit: int = 15,
    search_query: str = "",
) -> List[Dict[str, Any]]:
    """
    Fetch live jobs, check against the user's most recent resume,
    calculate a match score, and return sorted by match score.
    Uses cached jobs from the DB if they exist, otherwise fetches new ones.
    """
    import asyncio
    
    # 1. Get user's active resume for keyword matching
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == user_id)
        .order_by(Resume.created_at.desc())
        .first()
    )
    
    resume_text = resume.raw_text if resume else ""
    
    # 2. Try to get existing unbookmarked jobs from DB first (so we don't spam API)
    # Actually, let's just fetch from API to ensure they are live, 
    # but we won't save them to DB until the user bookmarks them.
    # To avoid API rate limits, we could cache them, but for now fetching live is fine.
    
    # Run async fetch synchronously in this thread (since FastAPI endpoints might be def)
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
    if loop.is_running():
        # If we're already in an async context, this might fail, but since our endpoint is sync:
        import nest_asyncio
        nest_asyncio.apply()
        
    live_jobs = loop.run_until_complete(fetch_jobs_from_api(limit=30, search_query=search_query))
    
    # If API failed, fallback to whatever is in the DB
    if not live_jobs:
        existing_jobs = db.query(Job).limit(20).all()
        live_jobs = [
            {
                "id": str(j.id),
                "title": j.title,
                "company_name": j.company_name,
                "location": j.location,
                "salary": j.salary,
                "description": j.description,
                "url": j.source_url,
                "source_portal": j.source_portal,
            }
            for j in existing_jobs
        ]

    scored_jobs = []
    for job in live_jobs:
        match_score = 0
        matched_kws = []
        missing_kws = []
        
        if resume_text and job.get("description"):
            # Calculate match score based on ATS keywords
            score, matched, missing = score_keyword_match(resume_text, job["description"])
            match_score = int(score)
            matched_kws = matched
            missing_kws = missing
        
        # Add to list
        job_data = {
            **job,
            "id": job.get("id") or str(uuid.uuid4()), # Assign temp ID if not from DB
            "match_score": match_score,
            "matched_keywords": matched_kws[:5], # Send top 5
            "missing_keywords": missing_kws[:5], # Send top 5
        }
        scored_jobs.append(job_data)

    # 3. Sort by match score descending
    scored_jobs.sort(key=lambda x: x["match_score"], reverse=True)
    
    return scored_jobs[:limit]
