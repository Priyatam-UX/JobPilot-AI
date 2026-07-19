import uuid
from typing import List

from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.resume import ResumeResponse, ResumeVersionResponse
from app.services.resume_service import ResumeService

router = APIRouter(prefix="/resumes", tags=["Resumes"])


@router.get("/", response_model=List[ResumeResponse])
def list_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all resumes for the authenticated user."""
    service = ResumeService(db)
    return service.get_user_resumes(current_user.id)


@router.post("/upload", response_model=ResumeResponse, status_code=201)
def upload_resume(
    title: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Upload a PDF or DOCX resume file. Text is extracted automatically."""
    service = ResumeService(db)
    return service.upload_resume(current_user.id, title, file)


@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(
    resume_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve a single resume by ID."""
    service = ResumeService(db)
    return service.get_resume(resume_id, current_user.id)


@router.delete("/{resume_id}", status_code=204)
def delete_resume(
    resume_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a resume and all its versions."""
    service = ResumeService(db)
    service.delete_resume(resume_id, current_user.id)


@router.get("/{resume_id}/versions", response_model=List[ResumeVersionResponse])
def list_resume_versions(
    resume_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all tailored versions of a resume."""
    service = ResumeService(db)
    return service.get_versions(resume_id, current_user.id)
