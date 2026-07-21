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
from app.tasks.intelligence_tasks import run_auto_apply_pipeline
from app.models.resume import Resume
from fastapi import HTTPException

class AutomateRequest(BaseModel):
    job_id: str
    job_url: str
    job_description: str

@router.post("/auto-apply")
async def trigger_automation(
    payload: AutomateRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Trigger the full AI Auto-Apply pipeline (Tailor -> Automate).
    """
    # Fetch user's latest resume
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.created_at.desc())
        .first()
    )
    
    if not resume:
        raise HTTPException(status_code=400, detail="No resume uploaded. Please upload a resume first.")
        
    user_data = {
        "first_name": current_user.full_name.split()[0] if current_user.full_name else "Applicant",
        "last_name": current_user.full_name.split()[-1] if current_user.full_name and " " in current_user.full_name else "",
        "email": current_user.email,
        "phone": "555-0199"
    }
    
    # Create the application record in the database first
    from app.services.application_service import ApplicationService
    service = ApplicationService(db)
    
    # Check if application already exists
    import uuid as py_uuid
    from app.models.application import Application
    app_record = db.query(Application).filter(
        Application.user_id == current_user.id, 
        Application.job_id == py_uuid.UUID(payload.job_id)
    ).first()
    
    if not app_record:
        # Get the latest resume version for this resume
        from app.models.resume import ResumeVersion
        latest_version = db.query(ResumeVersion).filter(
            ResumeVersion.resume_id == resume.id
        ).order_by(ResumeVersion.version_number.desc()).first()
        
        # Create a new application with status 'applying'
        app_data = ApplicationCreate(
            job_id=py_uuid.UUID(payload.job_id),
            resume_version_id=latest_version.id if latest_version else None
        )
        app_record = service.create_application(current_user.id, app_data)
        app_record.status = "applying"
        db.commit()
    else:
        app_record.status = "applying"
        db.commit()
        
    # Run in background
    background_tasks.add_task(
        run_auto_apply_pipeline,
        str(current_user.id),
        payload.job_id,
        payload.job_url,
        payload.job_description,
        resume.raw_text,
        user_data,
        resume.file_path
    )
    
    return {"status": "accepted", "message": "Auto-apply pipeline started in background"}
