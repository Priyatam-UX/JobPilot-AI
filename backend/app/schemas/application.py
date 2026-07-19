import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


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


class ApplicationResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    job_id: uuid.UUID
    status: str
    applied_at: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

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
