import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ResumeVersionSummary(BaseModel):
    id: uuid.UUID
    version_number: int
    title: str
    file_path: Optional[str] = None

    model_config = {"from_attributes": True}


class CoverLetterSummary(BaseModel):
    id: uuid.UUID
    title: str
    content: str

    model_config = {"from_attributes": True}


class ApplicationCreate(BaseModel):
    job_id: uuid.UUID
    resume_version_id: Optional[uuid.UUID] = None
    cover_letter_id: Optional[uuid.UUID] = None
    notes: Optional[str] = None


class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    resume_version_id: Optional[uuid.UUID] = None
    cover_letter_id: Optional[uuid.UUID] = None


class JobSummary(BaseModel):
    """Embedded job details returned with each application."""
    id: uuid.UUID
    title: str
    company_name: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[str] = None
    source_portal: Optional[str] = None
    url: Optional[str] = None

    model_config = {"from_attributes": True}

    @classmethod
    def model_validate(cls, obj, **kwargs):
        instance = super().model_validate(obj, **kwargs)
        # Map source_url → url for frontend compatibility
        if instance.url is None and hasattr(obj, "source_url"):
            instance.url = obj.source_url
        return instance


class ApplicationResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    job_id: uuid.UUID
    status: str
    applied_at: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    # Embedded job details so frontend can display title + company without extra calls
    job: Optional[JobSummary] = None
    resume_version: Optional[ResumeVersionSummary] = None
    cover_letter: Optional[CoverLetterSummary] = None

    model_config = {"from_attributes": True}


class ApplicationStatusCount(BaseModel):
    bookmarked: int = 0
    applying: int = 0
    applied: int = 0
    screening: int = 0
    interview: int = 0
    offer: int = 0
    rejected: int = 0
    withdrawn: int = 0
