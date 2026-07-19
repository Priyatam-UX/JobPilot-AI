from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "job_copilot_tasks",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.update(
    task_always_eager=True,
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
)

# Auto-discover tasks in packages
celery_app.autodiscover_tasks(["app.tasks"])
