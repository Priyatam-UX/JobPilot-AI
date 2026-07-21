import os
import logging
from typing import Optional
from app.core.celery_app import celery_app
from app.core.database import SessionLocal
from app.repositories.application_repository import ApplicationRepository
from app.models.application import ApplicationStatus
from app.models.user import User
from app.services.email_service import _send_email_sync
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
            
            # Send Success Email
            try:
                user = db.query(User).filter(User.id == application.user_id).first()
                if user and user.email:
                    subject = "🚀 Application Submitted Successfully!"
                    html_content = f"""
                    <html>
                      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background-color: #6366f1; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                            <h1 style="color: white; margin: 0;">JobPilot AI</h1>
                        </div>
                        <div style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; padding: 30px;">
                            <h2 style="color: #4f46e5; margin-top: 0;">Application Successful! 🎉</h2>
                            <p>Great news! Your AI Copilot has successfully tailored your resume, written a cover letter, and submitted your application.</p>
                            
                            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                                <p style="margin: 0;"><strong>Job URL:</strong> <a href="{job_url}" style="color: #4f46e5;">View Listing</a></p>
                                <p style="margin: 5px 0 0 0;"><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">Applied</span></p>
                            </div>
                            
                            <p>Your Kanban board has been automatically updated.</p>
                            <p>Fingers crossed for an interview!</p>
                            
                            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                            <p style="font-size: 12px; color: #6b7280; text-align: center;">
                                Sent by JobPilot AI Automation 🤖<br>
                                You're receiving this because you enabled Auto-Apply notifications.
                            </p>
                        </div>
                      </body>
                    </html>
                    """
                    _send_email_sync(user.email, subject, html_content)
                    logger.info(f"Triggered success email to {user.email}")
            except Exception as email_err:
                logger.error(f"Failed to send success email: {email_err}")
                
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
