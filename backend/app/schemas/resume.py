import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ResumeCreate(BaseModel):
    title: str


class ResumeUpdate(BaseModel):
    title: Optional[str] = None


class ResumeResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    file_path: Optional[str] = None
    
    # Missing AI & ATS Fields
    experience_years: Optional[float] = 0.0
    all_skills_flat: Optional[list] = []
    ats_score: Optional[float] = 0.0
    ats_grade: Optional[str] = None
    ats_suggestions: Optional[list] = []

    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ResumeVersionResponse(BaseModel):
    id: uuid.UUID
    resume_id: uuid.UUID
    version_number: int
    title: str
    file_path: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
