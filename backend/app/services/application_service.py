import uuid
from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.application import Application, ApplicationStatus
from app.repositories.application_repository import ApplicationRepository
from app.schemas.application import ApplicationCreate, ApplicationUpdate


class ApplicationService:
    """Service for full application lifecycle management."""

    def __init__(self, db: Session):
        self.repo = ApplicationRepository(db)

    def get_user_applications(
        self, user_id: uuid.UUID, app_status: Optional[str] = None
    ) -> List[Application]:
        return self.repo.get_user_applications(user_id, app_status)

    def create_application(
        self, user_id: uuid.UUID, data: ApplicationCreate
    ) -> Application:
        return self.repo.create(
            {
                "user_id": user_id,
                "job_id": data.job_id,
                "resume_version_id": data.resume_version_id,
                "cover_letter_id": data.cover_letter_id,
                "notes": data.notes,
                "status": ApplicationStatus.BOOKMARKED.value,
            }
        )

    def update_application(
        self,
        application_id: uuid.UUID,
        user_id: uuid.UUID,
        data: ApplicationUpdate,
    ) -> Application:
        app = self.repo.get(application_id)
        if not app or app.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found",
            )
        update_data = data.model_dump(exclude_none=True)
        return self.repo.update(app, update_data)

    def delete_application(
        self, application_id: uuid.UUID, user_id: uuid.UUID
    ) -> bool:
        app = self.repo.get(application_id)
        if not app or app.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found",
            )
        return self.repo.delete(application_id)

    def get_status_counts(self, user_id: uuid.UUID) -> dict:
        return self.repo.get_status_counts(user_id)
