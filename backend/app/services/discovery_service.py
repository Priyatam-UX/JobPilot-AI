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
import asyncio
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

def get_resume_search_query(resume: Resume) -> str:
    """Helper to extract a highly suitable job search query from user skills."""
    if not resume:
        return "software engineer"
    skills = resume.all_skills_flat or []
    if isinstance(skills, list) and len(skills) > 0:
        # Take first 2 skills that are descriptive (e.g. React, Python)
        filtered_skills = [s for s in skills[:2] if s and len(s) < 20]
        if filtered_skills:
            return " ".join(filtered_skills)
    return "software engineer"

async def fetch_linkedin_jobs(limit: int = 20, search_query: str = "") -> List[Dict[str, Any]]:
    """Fetch live jobs from LinkedIn's public guest search API."""
    try:
        import urllib.parse
        query = search_query or "software engineer"
        url = f"https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords={urllib.parse.quote(query)}&location=Remote&start=0"
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, headers=headers)
            if response.status_code != 200:
                logger.warning(f"LinkedIn search returned status code {response.status_code}")
                return []
                
            soup = BeautifulSoup(response.text, "html.parser")
            job_cards = soup.find_all("li")
            
            jobs = []
            for card in job_cards[:limit]:
                title_elem = card.find("h3", class_="base-search-card__title")
                company_elem = card.find("h4", class_="base-search-card__subtitle")
                location_elem = card.find("span", class_="job-search-card__location")
                link_elem = card.find("a", class_="base-card__full-link")
                
                if not title_elem:
                    title_elem = card.find("span", class_="screen-reader-text")
                    
                if title_elem and link_elem:
                    title = title_elem.text.strip()
                    company = company_elem.text.strip() if company_elem else "Unknown Company"
                    loc = location_elem.text.strip() if location_elem else "Remote"
                    job_url = link_elem["href"].split("?")[0] if link_elem.has_attr("href") else ""
                    
                    # Extract Job ID
                    job_id_match = re.search(r'/view/(?:.*-)?(\d+)', job_url)
                    job_id = job_id_match.group(1) if job_id_match else None
                    
                    jobs.append({
                        "title": title,
                        "company_name": company,
                        "location": loc,
                        "salary": "Competitive",
                        "url": job_url,
                        "source_portal": "LinkedIn",
                        "job_id": job_id,
                        "description": ""
                    })
                    
            if not jobs:
                return []

            # Fetch descriptions in parallel
            async def fetch_desc(job_dict):
                if not job_dict["job_id"]:
                    job_dict["description"] = f"A premium {job_dict['title']} role at {job_dict['company_name']} located in {job_dict['location']}."
                    return
                desc_url = f"https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/{job_dict['job_id']}"
                try:
                    res = await client.get(desc_url, headers=headers)
                    if res.status_code == 200:
                        desc_soup = BeautifulSoup(res.text, "html.parser")
                        desc_elem = desc_soup.find("div", class_="description__text")
                        if not desc_elem:
                            desc_elem = desc_soup.find("div", class_="show-more-less-html")
                        if desc_elem:
                            job_dict["description"] = clean_html(desc_elem.text.strip())
                            return
                except Exception as ex:
                    logger.warning(f"Failed to fetch desc for LinkedIn job {job_dict['job_id']}: {ex}")
                job_dict["description"] = f"A premium {job_dict['title']} role at {job_dict['company_name']} located in {job_dict['location']}."

            # Limit description scraping to avoid aggressive rate limits
            await asyncio.gather(*(fetch_desc(j) for j in jobs[:12]))
            return [j for j in jobs if j["description"]]
            
    except Exception as e:
        logger.error(f"Failed to fetch jobs from LinkedIn: {e}")
        return []

async def fetch_jobs_from_api(limit: int = 20, search_query: str = "") -> List[Dict[str, Any]]:
    """Fetch live jobs from LinkedIn (primary source) or Jobicy API (fallback)."""
    logger.info(f"Attempting to fetch jobs from LinkedIn for query: {search_query}")
    linkedin_jobs = await fetch_linkedin_jobs(limit=limit, search_query=search_query)
    if linkedin_jobs:
        logger.info(f"Successfully scraped {len(linkedin_jobs)} jobs from LinkedIn.")
        return linkedin_jobs
        
    logger.warning("LinkedIn fetch returned zero results or was rate limited. Falling back to Jobicy API.")
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
        logger.error(f"Failed to fetch jobs from Jobicy API: {e}")
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
            
            # Check if user already applied/bookmarked this job
            from app.models.application import Application
            app = db.query(Application).filter(
                Application.user_id == user_id,
                Application.job_id == job_obj.id
            ).first()
            app_status = app.status if app else None
            
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
                "application_status": app_status,
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
            
            # Check if user already applied/bookmarked this job
            from app.models.application import Application
            app = db.query(Application).filter(
                Application.user_id == user_id,
                Application.job_id == job_obj.id
            ).first()
            app_status = app.status if app else None
            
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
                "application_status": app_status,
            }
            scored_jobs.append(job_data)
            
    else:
        # Fallback to random/latest jobs if no resume is embedded yet (default setup).
        # We calculate match score using keyword similarity so matches are realistic.
        fallback_jobs = db.query(Job).limit(limit).all()
        for j in fallback_jobs:
            # Check if user already applied/bookmarked this job
            from app.models.application import Application
            app = db.query(Application).filter(
                Application.user_id == user_id,
                Application.job_id == j.id
            ).first()
            app_status = app.status if app else None
            
            # Compute keyword score
            if resume_text:
                _, matched, missing = score_keyword_match(resume_text, j.description or "")
                match_score = min(100, len(matched) * 10 + 30) if matched else 10
            else:
                matched, missing = [], []
                match_score = 0
            
            job_data = {
                "id": str(j.id),
                "title": j.title,
                "company_name": j.company_name,
                "location": j.location,
                "salary": j.salary,
                "description": j.description,
                "url": j.source_url,
                "source_portal": j.source_portal,
                "match_score": match_score,
                "matched_keywords": matched[:5],
                "missing_keywords": missing[:5],
                "application_status": app_status,
            }
            scored_jobs.append(job_data)

    # Sort all discovered jobs by match_score descending
    scored_jobs.sort(key=lambda x: x["match_score"], reverse=True)
    return scored_jobs
