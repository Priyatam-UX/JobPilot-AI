import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, computed_field


class JobCreate(BaseModel):
    title: str
    company_name: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    salary: Optional[str] = None  # Free-form salary string e.g. "$160k – $210k"
    job_type: Optional[str] = None
    remote: bool = False
    source_url: Optional[str] = None
    source_portal: Optional[str] = None
    external_id: Optional[str] = None
    match_score: Optional[int] = None


class JobResponse(BaseModel):
    id: uuid.UUID
    title: str
    company_name: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    salary: Optional[str] = None  # Pre-formatted salary range string
    job_type: Optional[str] = None
    remote: bool
    source_url: Optional[str] = None
    url: Optional[str] = None  # Alias for source_url used by frontend
    source_portal: Optional[str] = None
    match_score: Optional[int] = None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}

    @classmethod
    def model_validate(cls, obj, **kwargs):
        """Override to map source_url → url for frontend compatibility."""
        instance = super().model_validate(obj, **kwargs)
        if instance.url is None and instance.source_url:
            instance.url = instance.source_url
        return instance


class JobSearchRequest(BaseModel):
    query: str
    location: Optional[str] = None
    remote: Optional[bool] = None
    limit: int = 20
