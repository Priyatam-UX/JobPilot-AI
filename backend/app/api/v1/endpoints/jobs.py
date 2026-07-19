import uuid
from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.repositories.job_repository import JobRepository
from app.schemas.job import JobCreate, JobResponse, JobSearchRequest

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("/", response_model=List[JobResponse])
def list_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all discovered jobs."""
    repo = JobRepository(db)
    return repo.get_all(skip=skip, limit=limit)


@router.get("/search", response_model=List[JobResponse])
def search_jobs(
    q: str = Query(..., description="Search term for job title"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Full-text search jobs by title."""
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
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job
