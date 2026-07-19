import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class ProfileCreate(BaseModel):
    summary: Optional[str] = None
    skills: List[str] = []
    experience_years: float = 0.0
    desired_roles: List[str] = []
    location: Optional[str] = None


class ProfileUpdate(ProfileCreate):
    pass


class ProfileResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    summary: Optional[str] = None
    skills: List[str]
    experience_years: float
    desired_roles: List[str]
    location: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
