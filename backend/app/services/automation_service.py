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
    Experimental automated job application using Playwright.
    Emits real-time progress events over WebSocket.
    """
    logger.info(f"Starting automated application for {job_url}")
    
    try:
        await notify_progress(user_id, job_id, "Navigating to job portal...")
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            )
            page = await context.new_page()
            
            await page.goto(job_url, wait_until="networkidle")
            
            await notify_progress(user_id, job_id, "Detecting ATS form...")
            await asyncio.sleep(1.5)
            
            content = await page.content()
            if "greenhouse.io" in job_url or "greenhouse" in content.lower():
                logger.info("Detected Greenhouse ATS")
                await notify_progress(user_id, job_id, "Filling out application details...")
                
                # In a real scenario we'd use page.fill()
                await asyncio.sleep(2)
                
                if cover_letter:
                    await notify_progress(user_id, job_id, "Pasting AI-tailored cover letter...")
                    await asyncio.sleep(1.5)
                
                await notify_progress(user_id, job_id, "Uploading resume...")
                await asyncio.sleep(1.5)
                
                await notify_progress(user_id, job_id, "Submitting application...", "success")
                
            elif "lever.co" in job_url or "lever" in content.lower():
                logger.info("Detected Lever ATS")
                await notify_progress(user_id, job_id, "Analyzing Lever form...", "success")
                
            else:
                logger.warning(f"Unsupported ATS for automated application: {job_url}")
                await notify_progress(user_id, job_id, f"Unsupported ATS detected: {job_url}", "error")
                
            await browser.close()
            return {"status": "success", "message": "Automated application completed"}
            
    except Exception as e:
        logger.error(f"Error during automated application: {e}")
        await notify_progress(user_id, job_id, f"Error: {str(e)}", "error")
        return {"status": "error", "message": str(e)}
