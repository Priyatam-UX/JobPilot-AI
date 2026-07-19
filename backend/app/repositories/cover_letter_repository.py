import uuid
from typing import List
from sqlalchemy.orm import Session
from app.models.cover_letter import CoverLetter
from app.repositories.base import BaseRepository


class CoverLetterRepository(BaseRepository[CoverLetter]):
    """Repository for CoverLetter model."""

    def __init__(self, db: Session):
        super().__init__(CoverLetter, db)

    def get_user_cover_letters(
        self, user_id: uuid.UUID, skip: int = 0, limit: int = 50
    ) -> List[CoverLetter]:
        return (
            self.db.query(CoverLetter)
            .filter(CoverLetter.user_id == user_id)
            .order_by(CoverLetter.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
