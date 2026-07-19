import uuid
from typing import List
from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.repositories.base import BaseRepository


class NotificationRepository(BaseRepository[Notification]):
    """Repository for Notification model."""

    def __init__(self, db: Session):
        super().__init__(Notification, db)

    def get_user_notifications(
        self,
        user_id: uuid.UUID,
        unread_only: bool = False,
        skip: int = 0,
        limit: int = 50,
    ) -> List[Notification]:
        q = self.db.query(Notification).filter(Notification.user_id == user_id)
        if unread_only:
            q = q.filter(Notification.is_read == False)  # noqa: E712
        return q.order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()

    def mark_all_read(self, user_id: uuid.UUID) -> int:
        updated = (
            self.db.query(Notification)
            .filter(
                Notification.user_id == user_id,
                Notification.is_read == False,  # noqa: E712
            )
            .update({"is_read": True})
        )
        self.db.commit()
        return updated
