import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.application import (
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationResponse,
)
from app.services.application_service import ApplicationService

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.get("/", response_model=List[ApplicationResponse])
def list_applications(
    status: Optional[str] = Query(None, description="Filter by application status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all applications for the current user, with optional status filter."""
    service = ApplicationService(db)
    return service.get_user_applications(current_user.id, status)


@router.post("/", response_model=ApplicationResponse, status_code=201)
def create_application(
    data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Bookmark or track a new job application."""
    service = ApplicationService(db)
    return service.create_application(current_user.id, data)


@router.patch("/{application_id}", response_model=ApplicationResponse)
def update_application(
    application_id: uuid.UUID,
    data: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update application status or notes (Kanban drag-and-drop support)."""
    service = ApplicationService(db)
    return service.update_application(application_id, current_user.id, data)


@router.delete("/{application_id}", status_code=204)
def delete_application(
    application_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove an application from the tracker."""
    service = ApplicationService(db)
    service.delete_application(application_id, current_user.id)


@router.get("/analytics/status-counts")
def get_status_counts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return application counts grouped by status for the analytics dashboard."""
    service = ApplicationService(db)
    return service.get_status_counts(current_user.id)
