import os
import logging
from typing import Optional
from app.core.celery_app import celery_app
from app.core.database import SessionLocal
from app.repositories.application_repository import ApplicationRepository
from app.models.application import ApplicationStatus
from app.browser.automation import BrowserAutomation
from app.browser.adapters import (
    LinkedInAdapter,
    GreenhouseAdapter,
    LeverAdapter,
    WorkdayAdapter,
    SmartRecruitersAdapter,
    AshbyAdapter,
    WellfoundAdapter,
    YCJobsAdapter,
    NaukriAdapter,
    IndeedAdapter,
    RemoteOKAdapter,
)

logger = logging.getLogger("AutoApplyTask")

@celery_app.task(bind=True, max_retries=3)
def run_auto_apply(
    self,
    application_id: str,
    job_url: str,
    resume_path: str,
    cover_letter_path: Optional[str] = None,
    custom_answers: Optional[dict] = None,
    portal_name: str = "greenhouse"
) -> bool:
    """Celery background task performing automated application submissions."""
    logger.info(f"Starting auto apply task for application: {application_id} on {portal_name}")
    
    db = SessionLocal()
    app_repo = ApplicationRepository(db)
    application = app_repo.get(application_id)
    if not application:
        logger.error(f"Application {application_id} not found in database.")
        db.close()
        return False

    # Update status to APPLYING
    app_repo.update(application, {"status": ApplicationStatus.APPLYING.value})
    
    # Initialize Browser
    automation = BrowserAutomation(headless=True)
    page = None
    success = False
    
    try:
        page = automation.start()
        
        # Select adapter based on portal
        portal = portal_name.lower()
        if portal == "greenhouse":
            adapter = GreenhouseAdapter(page)
        elif portal == "lever":
            adapter = LeverAdapter(page)
        elif portal == "workday":
            adapter = WorkdayAdapter(page)
        elif portal == "linkedin":
            adapter = LinkedInAdapter(page)
        elif portal == "smartrecruiters":
            adapter = SmartRecruitersAdapter(page)
        elif portal == "ashby":
            adapter = AshbyAdapter(page)
        elif portal == "wellfound":
            adapter = WellfoundAdapter(page)
        elif portal == "yc_jobs" or portal == "yc":
            adapter = YCJobsAdapter(page)
        elif portal == "naukri":
            adapter = NaukriAdapter(page)
        elif portal == "indeed":
            adapter = IndeedAdapter(page)
        elif portal == "remoteok":
            adapter = RemoteOKAdapter(page)
        else:
            raise ValueError(f"Unsupported portal adapter: {portal_name}")

        # Run application filling
        success = adapter.fill_and_submit(
            job_url=job_url,
            resume_path=resume_path,
            cover_letter_path=cover_letter_path,
            custom_answers=custom_answers
        )

        if success:
            app_repo.update(
                application,
                {
                    "status": ApplicationStatus.APPLIED.value,
                    "notes": f"Automated submission completed successfully on {portal_name}."
                }
            )
        else:
            raise RuntimeError("Submission failed: Form did not confirm completion.")

    except Exception as e:
        logger.error(f"Error during auto-apply sequence: {str(e)}")
        # Take error screenshot
        screenshot_path = f"app/browser/screenshots/fail_{application_id}.png"
        if page:
            BrowserAutomation.capture_failure_screenshot(page, screenshot_path)
            
        app_repo.update(
            application,
            {
                "status": ApplicationStatus.BOOKMARKED.value,
                "notes": f"Auto-apply failed: {str(e)}. Screenshot logged."
            }
        )
        # Retry logic if transient
        raise self.retry(exc=e, countdown=60)
        
    finally:
        automation.stop()
        db.close()
        
    return success
