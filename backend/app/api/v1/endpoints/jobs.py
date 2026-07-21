import uuid
from typing import List, Dict, Any, Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.job import Job
from app.repositories.job_repository import JobRepository
from app.schemas.job import JobCreate, JobResponse
from app.services.discovery_service import discover_and_match_jobs

router = APIRouter(prefix="/jobs", tags=["Jobs"])


class DiscoveredJobResponse(BaseModel):
    id: str
    title: str
    company_name: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    source_portal: Optional[str] = None
    match_score: int = 0
    matched_keywords: List[str] = []
    missing_keywords: List[str] = []


@router.get("/discover", response_model=List[DiscoveredJobResponse])
async def discover_jobs(
    limit: int = Query(15, le=50),
    query: Optional[str] = Query(None, description="Search term for global job search"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Fetch live jobs from external APIs (Remotive), match them against the user's
    active resume, calculate scores, and return them sorted by match score.
    """
    if query:
        from app.tasks.job_scraper_tasks import run_job_ingestion
        await run_job_ingestion(db, limit=20, search_query=query)
        
    return discover_and_match_jobs(db, current_user.id, limit=limit, search_query=query or "")


@router.get("/", response_model=List[JobResponse])
def list_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all saved/discovered jobs in the local database."""
    repo = JobRepository(db)
    return repo.get_all(skip=skip, limit=limit)


@router.post("/", response_model=JobResponse, status_code=201)
def create_job(
    job_in: JobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new job in the database. Useful for saving jobs fetched from external APIs
    before creating an application/bookmark.
    """
    repo = JobRepository(db)
    # Avoid duplicates by title + company
    existing = (
        db.query(Job)
        .filter(Job.title == job_in.title, Job.company_name == job_in.company_name)
        .first()
    )
    if existing:
        return existing
        
    return repo.create(job_in)


@router.get("/search", response_model=List[JobResponse])
def search_jobs(
    q: str = Query(..., description="Search term for job title"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Full-text search jobs by title in local db."""
    repo = JobRepository(db)
    return repo.search_by_title(q)


@router.get("/{job_id}", response_model=JobResponse)
def get_job(
    job_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a single job description by ID."""
    repo = JobRepository(db)
    job = repo.get(job_id)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job
