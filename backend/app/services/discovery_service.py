"""
Job Discovery Service — searches jobs in the database using true semantic similarity 
via pgvector and OpenAI embeddings against the user's resume.
"""
import logging
import uuid
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.job import Job
from app.models.resume import Resume
from app.services.ats_service import score_keyword_match
import httpx
from bs4 import BeautifulSoup
import re

logger = logging.getLogger(__name__)

JOBICY_URL = "https://jobicy.com/api/v2/remote-jobs"

def clean_html(raw_html: str) -> str:
    """Strip HTML tags from job descriptions for better analysis."""
    if not raw_html:
        return ""
    soup = BeautifulSoup(raw_html, "html.parser")
    text_content = soup.get_text(separator=" ")
    return re.sub(r'\s+', ' ', text_content).strip()

async def fetch_jobs_from_api(limit: int = 20, search_query: str = "") -> List[Dict[str, Any]]:
    """Fetch live jobs from Jobicy API (used by background ingest task)."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            url = f"{JOBICY_URL}?count={limit}"
            if search_query:
                import urllib.parse
                url += f"&tag={urllib.parse.quote(search_query)}"
            else:
                url += "&industry=engineering"
                
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            jobs = data.get("jobs", [])[:limit]
            
            mapped_jobs = []
            for j in jobs:
                description = clean_html(j.get("jobDescription", ""))
                
                # Format salary if available
                salary_str = "Competitive"
                if j.get("salaryMin") and j.get("salaryMax"):
                    salary_str = f"{j.get('salaryCurrency', '$')}{j.get('salaryMin')} - {j.get('salaryMax')} {j.get('salaryPeriod', 'yearly')}"
                
                mapped_jobs.append({
                    "title": j.get("jobTitle", ""),
                    "company_name": j.get("companyName", ""),
                    "location": j.get("jobGeo", "Remote"),
                    "salary": salary_str,
                    "description": description,
                    "url": j.get("url", ""),
                    "source_portal": "Jobicy",
                })
            return mapped_jobs
    except Exception as e:
        logger.error(f"Failed to fetch jobs from Remotive API: {e}")
        return []

def discover_and_match_jobs(
    db: Session,
    user_id: uuid.UUID,
    limit: int = 100,
    search_query: str = "",
) -> List[Dict[str, Any]]:
    """
    Finds the most semantically relevant jobs for the user using pgvector 
    cosine similarity against their most recently uploaded resume.
    """
    # 1. Get user's active resume and its embedding
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == user_id)
        .order_by(Resume.created_at.desc())
        .first()
    )
    
    resume_text = resume.raw_text if resume else ""
    vector = resume.embedding if resume else None

    # 2. Semantic Search or Keyword Search
    scored_jobs = []
    
    if search_query:
        # Explicit keyword search: bypass semantic vector requirement to include live jobs
        # that were just ingested but don't have embeddings (OpenAI disabled).
        query_obj = db.query(Job)
        words = [w.strip() for w in search_query.split() if w.strip()]
        for word in words:
            query_obj = query_obj.filter(
                (Job.title.ilike(f"%{word}%")) | 
                (Job.description.ilike(f"%{word}%"))
            )
            
        results = query_obj.limit(limit).all()
        
        for job_obj in results:
            _, matched, missing = score_keyword_match(resume_text, job_obj.description or "")
            match_score = min(100, len(matched) * 10 + 30) if matched else 10
            
            job_data = {
                "id": str(job_obj.id),
                "title": job_obj.title,
                "company_name": job_obj.company_name,
                "location": job_obj.location,
                "salary": job_obj.salary,
                "description": job_obj.description,
                "url": job_obj.source_url,
                "source_portal": job_obj.source_portal,
                "match_score": match_score,
                "matched_keywords": matched[:5],
                "missing_keywords": missing[:5],
            }
            scored_jobs.append(job_data)
            
    elif vector:
        # We use <-> for L2 distance or <=> for Cosine distance
        # 1 - cosine_distance = cosine similarity
        results = (
            db.query(Job, Job.embedding.cosine_distance(vector).label('distance'))
            .filter(Job.embedding.isnot(None))
            .order_by(Job.embedding.cosine_distance(vector))
            .limit(limit)
            .all()
        )
        
        for job_obj, distance in results:
            # Distance is 0 for exact match, up to 2 for opposite.
            # Similarity = 1 - distance. Convert to percentage 0-100.
            similarity = max(0.0, 1.0 - distance)
            match_score = int(similarity * 100)
            
            # We can still extract keywords for UI flair
            _, matched, missing = score_keyword_match(resume_text, job_obj.description or "")
            
            job_data = {
                "id": str(job_obj.id),
                "title": job_obj.title,
                "company_name": job_obj.company_name,
                "location": job_obj.location,
                "salary": job_obj.salary,
                "description": job_obj.description,
                "url": job_obj.source_url,
                "source_portal": job_obj.source_portal,
                "match_score": match_score,
                "matched_keywords": matched[:5],
                "missing_keywords": missing[:5],
            }
            scored_jobs.append(job_data)
            
    else:
        # Fallback to random/latest jobs if no resume is embedded yet
        fallback_jobs = db.query(Job).limit(limit).all()
        for j in fallback_jobs:
            job_data = {
                "id": str(j.id),
                "title": j.title,
                "company_name": j.company_name,
                "location": j.location,
                "salary": j.salary,
                "description": j.description,
                "url": j.source_url,
                "source_portal": j.source_portal,
                "match_score": 0,
                "matched_keywords": [],
                "missing_keywords": [],
            }
            scored_jobs.append(job_data)

    return scored_jobs
