import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, Query, BackgroundTasks
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.core.websockets import manager
from app.models.user import User
from app.schemas.application import (
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationResponse,
)
from app.services.application_service import ApplicationService

router = APIRouter(prefix="/applications", tags=["Applications"])

async def notify_user(user_id: str, event_type: str, data: dict):
    await manager.send_personal_message({"type": event_type, "data": data}, user_id)

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
async def create_application(
    data: ApplicationCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Bookmark or track a new job application."""
    service = ApplicationService(db)
    app = service.create_application(current_user.id, data)
    background_tasks.add_task(notify_user, str(current_user.id), "APPLICATION_CREATED", {"id": str(app.id)})
    return app


@router.patch("/{application_id}", response_model=ApplicationResponse)
async def update_application(
    application_id: uuid.UUID,
    data: ApplicationUpdate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update application status or notes (Kanban drag-and-drop support)."""
    service = ApplicationService(db)
    app = service.update_application(application_id, current_user.id, data)
    background_tasks.add_task(notify_user, str(current_user.id), "APPLICATION_UPDATED", {"id": str(app.id), "status": app.status})
    return app


@router.delete("/{application_id}", status_code=204)
async def delete_application(
    application_id: uuid.UUID,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove an application from the tracker."""
    service = ApplicationService(db)
    service.delete_application(application_id, current_user.id)
    background_tasks.add_task(notify_user, str(current_user.id), "APPLICATION_DELETED", {"id": str(application_id)})


@router.get("/analytics/status-counts")
def get_status_counts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return application counts grouped by status for the analytics dashboard."""
    service = ApplicationService(db)
    return service.get_status_counts(current_user.id)

from pydantic import BaseModel
from app.services.automation_service import automate_job_application

class AutomateRequest(BaseModel):
    job_url: str
    resume_path: str

@router.post("/automate")
async def trigger_automation(
    payload: AutomateRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Experimental: Trigger a Playwright headless browser to auto-fill a job application.
    """
    # In production, we'd fetch the user's saved profile data (name, email, phone, etc.)
    user_data = {
        "first_name": "Test",
        "last_name": "User",
        "email": current_user.email,
        "phone": "555-0199"
    }
    
    result = await automate_job_application(payload.job_url, user_data, payload.resume_path)
    return result
