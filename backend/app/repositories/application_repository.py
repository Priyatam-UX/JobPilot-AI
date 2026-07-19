import uuid
from typing import List, Optional
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from app.models.application import Application
from app.repositories.base import BaseRepository


class ApplicationRepository(BaseRepository[Application]):
    """Repository for Application model — Kanban and analytics queries."""

    def __init__(self, db: Session):
        super().__init__(Application, db)

    def get_user_applications(
        self,
        user_id: uuid.UUID,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Application]:
        q = (
            self.db.query(Application)
            .options(joinedload(Application.job), joinedload(Application.cover_letter))
            .filter(Application.user_id == user_id)
        )
        if status:
            q = q.filter(Application.status == status)
        return q.order_by(Application.created_at.desc()).offset(skip).limit(limit).all()

    def get_status_counts(self, user_id: uuid.UUID) -> dict:
        rows = (
            self.db.query(Application.status, func.count(Application.id))
            .filter(Application.user_id == user_id)
            .group_by(Application.status)
            .all()
        )
        return {status: count for status, count in rows}
