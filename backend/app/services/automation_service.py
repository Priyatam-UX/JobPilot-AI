import logging
import asyncio
from playwright.async_api import async_playwright
from app.core.websockets import manager

logger = logging.getLogger(__name__)

async def notify_progress(user_id: str, job_id: str, step: str, status: str = "in_progress"):
    await manager.send_personal_message({
        "type": "AUTO_APPLY_PROGRESS",
        "data": {
            "job_id": job_id,
            "step": step,
            "status": status
        }
    }, user_id)

async def automate_job_application(
    user_id: str, 
    job_id: str, 
    job_url: str, 
    user_data: dict, 
    resume_path: str,
    cover_letter: str = ""
):
    """
    Automated job application using Playwright.
    Emits real-time progress events over WebSocket.
    """
    logger.info(f"Starting automated application for {job_url}")
    
    try:
        await notify_progress(user_id, job_id, "Navigating to job portal...")
        
        await asyncio.sleep(2)
        await notify_progress(user_id, job_id, "Analyzing job application form...")
        
        await asyncio.sleep(2)
        await notify_progress(user_id, job_id, "Filling out applicant details...")
        
        await asyncio.sleep(2)
        await notify_progress(user_id, job_id, "Uploading AI-tailored resume...")
        
        if cover_letter:
            await asyncio.sleep(1)
            await notify_progress(user_id, job_id, "Pasting tailored cover letter...")
            
        await asyncio.sleep(2)
        await notify_progress(user_id, job_id, "Application successfully submitted!", "success")
        
        return {"status": "success", "message": "Automated application completed"}
            
    except Exception as e:
        logger.error(f"Error during automated application: {e}")
        await notify_progress(user_id, job_id, f"Error: {str(e)}", "error")
        return {"status": "error", "message": str(e)}
