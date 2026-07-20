import logging
import asyncio
from sqlalchemy.orm import Session
from app.core.websockets import manager
from app.services.ai_extractor import extract_resume_data_with_ai
from app.services.embedding_service import get_embedding
from app.models.resume import Resume

logger = logging.getLogger(__name__)

async def run_resume_analysis_background(db: Session, user_id: str, resume_id: str, raw_text: str):
    """
    Run heavy NLP extraction and OpenAI embedding in the background.
    """
    try:
        # Extract skills and structure via OpenAI
        analysis = extract_resume_data_with_ai(raw_text)
        exp_years = analysis["experience_years"]
        skills = analysis["all_skills_flat"]
        
        # Generate 1536-dimensional semantic embedding based on skills + summary
        summary = analysis.get("summary") or ""
        embedding_text = f"Skills: {', '.join(skills)}. Summary: {summary}. Text: {raw_text[:1000]}"
        vector = get_embedding(embedding_text)
        
        resume = db.query(Resume).filter(Resume.id == resume_id).first()
        if resume:
            resume.experience_years = exp_years
            resume.all_skills_flat = skills
            resume.embedding = vector
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
