import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class CoverLetterCreate(BaseModel):
    title: str
    content: str
    job_id: Optional[uuid.UUID] = None


class CoverLetterUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class CoverLetterResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    content: str
    job_id: Optional[uuid.UUID] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
