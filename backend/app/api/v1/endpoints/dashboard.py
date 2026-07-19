"""
Analytics & Dashboard endpoints — live statistics for the authenticated user.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.application import Application
from app.models.resume import Resume
from app.models.job import Job

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return comprehensive live dashboard statistics for the authenticated user."""
    user_id = current_user.id

    # ── Application stats ──────────────────────────────────────────
    status_rows = (
        db.query(Application.status, func.count(Application.id))
        .filter(Application.user_id == user_id)
        .group_by(Application.status)
        .all()
    )
    status_counts = {row[0]: row[1] for row in status_rows}
    total_applications = sum(status_counts.values())

    # ── Resume stats ───────────────────────────────────────────────
    resume_count = db.query(func.count(Resume.id)).filter(Resume.user_id == user_id).scalar() or 0

    # ── Job discovery stats ────────────────────────────────────────
    total_jobs = db.query(func.count(Job.id)).scalar() or 0

    # ── Rates ─────────────────────────────────────────────────────
    applied_total = (
        status_counts.get("applied", 0)
        + status_counts.get("screening", 0)
        + status_counts.get("interview", 0)
        + status_counts.get("offer", 0)
        + status_counts.get("rejected", 0)
    )

    interview_rate = (
        round((status_counts.get("interview", 0) / applied_total) * 100)
        if applied_total > 0 else 0
    )
    offer_rate = (
        round((status_counts.get("offer", 0) / applied_total) * 100)
        if applied_total > 0 else 0
    )

    # ── Recent applications (last 5) ───────────────────────────────
    from app.models.job import Job as JobModel
    from sqlalchemy.orm import joinedload

    recent_apps = (
        db.query(Application)
        .options(joinedload(Application.job))
        .filter(Application.user_id == user_id)
        .order_by(Application.created_at.desc())
        .limit(5)
        .all()
    )

    recent_activity = []
    for app in recent_apps:
        job = app.job
        recent_activity.append({
            "id": str(app.id),
            "type": "application",
            "status": app.status,
            "company": job.company_name if job else "Unknown",
            "role": job.title if job else "Unknown Role",
            "timestamp": app.created_at.isoformat(),
        })

    return {
        "applications": {
            "total": total_applications,
            "bookmarked": status_counts.get("bookmarked", 0),
            "applying": status_counts.get("applying", 0),
            "applied": status_counts.get("applied", 0),
            "screening": status_counts.get("screening", 0),
            "interview": status_counts.get("interview", 0),
            "offer": status_counts.get("offer", 0),
            "rejected": status_counts.get("rejected", 0),
            "withdrawn": status_counts.get("withdrawn", 0),
        },
        "resumes": {
            "total": resume_count,
        },
        "jobs": {
            "total": total_jobs,
        },
        "rates": {
            "interview_rate": interview_rate,
            "offer_rate": offer_rate,
        },
        "recent_activity": recent_activity,
    }
