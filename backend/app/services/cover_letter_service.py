import uuid
from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.cover_letter import CoverLetter
from app.repositories.cover_letter_repository import CoverLetterRepository
from app.schemas.cover_letter import CoverLetterCreate, CoverLetterUpdate


class CoverLetterService:
    """Service for cover letter CRUD operations."""

    def __init__(self, db: Session):
        self.repo = CoverLetterRepository(db)

    def get_user_cover_letters(self, user_id: uuid.UUID) -> List[CoverLetter]:
        return self.repo.get_user_cover_letters(user_id)

    def create_cover_letter(
        self, user_id: uuid.UUID, data: CoverLetterCreate
    ) -> CoverLetter:
        return self.repo.create(
            {
                "user_id": user_id,
                "title": data.title,
                "content": data.content,
                "job_id": data.job_id,
            }
        )

    def get_cover_letter(
        self, cover_letter_id: uuid.UUID, user_id: uuid.UUID
    ) -> CoverLetter:
        cl = self.repo.get(cover_letter_id)
        if not cl or cl.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cover letter not found",
            )
        return cl

    def update_cover_letter(
        self,
        cover_letter_id: uuid.UUID,
        user_id: uuid.UUID,
        data: CoverLetterUpdate,
    ) -> CoverLetter:
        cl = self.get_cover_letter(cover_letter_id, user_id)
        return self.repo.update(cl, data.model_dump(exclude_none=True))

    def delete_cover_letter(
        self, cover_letter_id: uuid.UUID, user_id: uuid.UUID
    ) -> bool:
        self.get_cover_letter(cover_letter_id, user_id)
        return self.repo.delete(cover_letter_id)
