import smtplib
import logging
import asyncio
from email.message import EmailMessage
from app.core.config import settings

logger = logging.getLogger(__name__)

def _send_email_sync(recipient_email: str, subject: str, html_content: str):
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning("SMTP credentials not configured. Skipping email notification.")
        return

    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = f"JobPilot AI <{settings.SMTP_USER}>"
    msg['To'] = recipient_email
    msg.set_content("Please enable HTML to view this email.")
    msg.add_alternative(html_content, subtype='html')

    try:
        # Use SSL (port 465)
        with smtplib.SMTP_SSL(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
            logger.info(f"Successfully sent email to {recipient_email}")
    except Exception as e:
        logger.error(f"Failed to send email to {recipient_email}: {e}")

async def send_application_success_email(recipient_email: str, job_id: str, job_url: str):
    """
    Sends a beautifully formatted HTML email notifying the user that the 
    bot successfully applied to a job.
    """
    subject = f"🚀 Application Submitted Successfully!"
    
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
    
    # Run the synchronous SMTP call in a thread pool to avoid blocking the event loop
    await asyncio.to_thread(_send_email_sync, recipient_email, subject, html_content)
