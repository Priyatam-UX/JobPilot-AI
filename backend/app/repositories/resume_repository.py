import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.resume import Resume, ResumeVersion
from app.repositories.base import BaseRepository


class ResumeRepository(BaseRepository[Resume]):
    """Repository for Resume model."""

    def __init__(self, db: Session):
        super().__init__(Resume, db)

    def get_user_resumes(
        self, user_id: uuid.UUID, skip: int = 0, limit: int = 50
    ) -> List[Resume]:
        return (
            self.db.query(Resume)
            .filter(Resume.user_id == user_id)
            .order_by(Resume.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )


class ResumeVersionRepository(BaseRepository[ResumeVersion]):
    """Repository for ResumeVersion model."""

    def __init__(self, db: Session):
        super().__init__(ResumeVersion, db)

    def get_versions_for_resume(self, resume_id: uuid.UUID) -> List[ResumeVersion]:
        return (
            self.db.query(ResumeVersion)
            .filter(ResumeVersion.resume_id == resume_id)
            .order_by(ResumeVersion.version_number.desc())
            .all()
        )

    def get_latest_version(self, resume_id: uuid.UUID) -> Optional[ResumeVersion]:
        return (
            self.db.query(ResumeVersion)
            .filter(ResumeVersion.resume_id == resume_id)
            .order_by(ResumeVersion.version_number.desc())
            .first()
        )
