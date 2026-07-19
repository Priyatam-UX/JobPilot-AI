import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.resume import ResumeResponse, ResumeVersionResponse
from app.services.resume_service import ResumeService
from app.services.ats_service import compute_ats_score
from app.services.skill_extractor import extract_all

router = APIRouter(prefix="/resumes", tags=["Resumes"])


class ATSCheckRequest(BaseModel):
    job_description: Optional[str] = ""


@router.get("/", response_model=List[ResumeResponse])
def list_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all resumes for the authenticated user."""
    service = ResumeService(db)
    return service.get_user_resumes(current_user.id)


@router.post("/upload", status_code=201)
def upload_resume(
    title: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Upload a PDF or DOCX resume file.
    Automatically extracts text, skills, contact info, and computes ATS score.
    """
    service = ResumeService(db)
    resume = service.upload_resume(current_user.id, title, file)

    # Run automatic skill extraction and ATS scoring
    analysis = {}
    ats_report = {}
    if resume.raw_text:
        analysis = extract_all(resume.raw_text)
        ats_report = compute_ats_score(resume.raw_text)

    return {
        "id": str(resume.id),
        "user_id": str(resume.user_id),
        "title": resume.title,
        "file_path": resume.file_path,
        "created_at": resume.created_at.isoformat(),
        "updated_at": resume.updated_at.isoformat(),
        "word_count": analysis.get("word_count", 0),
        "skills": analysis.get("skills", {}),
        "all_skills_flat": analysis.get("all_skills_flat", []),
        "experience_years": analysis.get("experience_years", 0),
        "contact": analysis.get("contact", {}),
        "sections": analysis.get("sections", {}),
        "ats_score": ats_report.get("overall_score", 0),
        "ats_grade": ats_report.get("grade", "N/A"),
        "ats_suggestions": ats_report.get("suggestions", []),
    }


@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(
    resume_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve a single resume by ID."""
    service = ResumeService(db)
    return service.get_resume(resume_id, current_user.id)


@router.get("/{resume_id}/analyze")
def analyze_resume(
    resume_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Re-run full skill extraction and ATS analysis on an existing resume.
    Returns extracted skills, contact info, sections detected, and baseline ATS score.
    """
    service = ResumeService(db)
    resume = service.get_resume(resume_id, current_user.id)

    if not resume.raw_text:
        return {
            "message": "No text extracted from this resume. Try re-uploading the file.",
            "skills": {},
            "ats_score": 0,
        }

    analysis = extract_all(resume.raw_text)
    ats_report = compute_ats_score(resume.raw_text)

    return {
        "resume_id": str(resume.id),
        "title": resume.title,
        "word_count": analysis["word_count"],
        "experience_years": analysis["experience_years"],
        "contact": analysis["contact"],
        "skills": analysis["skills"],
        "all_skills_flat": analysis["all_skills_flat"],
        "sections_detected": analysis["sections"],
        "education": analysis["education"],
        "ats": ats_report,
    }


@router.post("/{resume_id}/ats-check")
def ats_check_against_job(
    resume_id: uuid.UUID,
    payload: ATSCheckRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Run ATS compatibility check between a resume and a specific job description.
    Returns keyword match score, missing keywords, matched keywords, and improvement suggestions.
    """
    service = ResumeService(db)
    resume = service.get_resume(resume_id, current_user.id)

    if not resume.raw_text:
        return {"message": "No resume text found. Please re-upload your resume.", "score": 0}

    report = compute_ats_score(resume.raw_text, payload.job_description or "")
    return report


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
