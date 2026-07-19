import logging
import asyncio
from sqlalchemy.orm import Session
from app.core.websockets import manager
from app.services.skill_extractor import extract_skills
from app.models.resume import Resume

logger = logging.getLogger(__name__)

async def run_resume_analysis_background(db: Session, user_id: str, resume_id: str, raw_text: str):
    """
    Run heavy NLP/regex extraction in the background and notify the client via WebSockets.
    """
    try:
        # Simulate network/processing delay if this was a massive LLM task
        # await asyncio.sleep(2)
        
        skills, exp_years = extract_skills(raw_text)
        
        # We need to grab a fresh instance since this is running in background thread
        # It's better to instantiate a new session or be careful with thread-local sessions
        resume = db.query(Resume).filter(Resume.id == resume_id).first()
        if resume:
            resume.experience_years = exp_years
            resume.all_skills_flat = list(skills)
            db.commit()
            
            logger.info(f"Background analysis completed for resume {resume_id}")
            
            # Emit WebSocket event
            await manager.send_personal_message({
                "type": "RESUME_ANALYZED",
                "data": {
                    "resume_id": str(resume_id),
                    "experience_years": exp_years,
                    "skills_count": len(skills)
                }
            }, user_id)
            
    except Exception as e:
        logger.error(f"Error in background resume analysis: {e}")

from app.services.tailoring_service import generate_tailored_cover_letter
from app.services.automation_service import automate_job_application

async def run_auto_apply_pipeline(
    user_id: str, 
    job_id: str, 
    job_url: str, 
    job_description: str,
    resume_text: str,
    user_data: dict,
    resume_path: str
):
    """
    Background pipeline for auto-apply:
    1. Tailor cover letter via LLM
    2. Pass to Playwright automation script
    """
    logger.info(f"Starting auto-apply pipeline for job {job_id}")
    
    try:
        # Step 1: Tailor cover letter
        await manager.send_personal_message({
            "type": "AUTO_APPLY_PROGRESS",
            "data": {"job_id": job_id, "step": "AI is writing tailored cover letter...", "status": "in_progress"}
        }, user_id)
        
        # Run sync block in thread pool to not block asyncio
        cover_letter = await asyncio.to_thread(
            generate_tailored_cover_letter,
            resume_text,
            job_description
        )
        
        # Step 2: Execute automation
        await automate_job_application(
            user_id=user_id,
            job_id=job_id,
            job_url=job_url,
            user_data=user_data,
            resume_path=resume_path,
            cover_letter=cover_letter
        )
        
    except Exception as e:
        logger.error(f"Auto-apply pipeline failed: {e}")
        await manager.send_personal_message({
            "type": "AUTO_APPLY_PROGRESS",
            "data": {"job_id": job_id, "step": f"Pipeline failed: {str(e)}", "status": "error"}
        }, user_id)
