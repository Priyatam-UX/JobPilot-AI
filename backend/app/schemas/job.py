import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class JobCreate(BaseModel):
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    job_type: Optional[str] = None
    remote: bool = False
    source_url: Optional[str] = None
    source_portal: Optional[str] = None
    external_id: Optional[str] = None


class JobResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    job_type: Optional[str] = None
    remote: bool
    source_url: Optional[str] = None
    source_portal: Optional[str] = None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class JobSearchRequest(BaseModel):
    query: str
    location: Optional[str] = None
    remote: Optional[bool] = None
    limit: int = 20
