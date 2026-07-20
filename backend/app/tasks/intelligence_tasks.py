import logging
import asyncio
from sqlalchemy.orm import Session
from app.core.websockets import manager
from app.services.ai_extractor import extract_resume_data_with_ai
from app.services.embedding_service import get_embedding
from app.models.resume import Resume

logger = logging.getLogger(__name__)

from app.services.ats_service import compute_ats_score

async def run_resume_analysis_background(db: Session, user_id: str, resume_id: str, raw_text: str):
    """
    Run heavy NLP extraction, ATS scoring, and OpenAI embedding in the background.
    """
    try:
        # Extract skills and structure via OpenAI
        analysis = extract_resume_data_with_ai(raw_text)
        exp_years = analysis["experience_years"]
        skills = analysis["all_skills_flat"]
        
        # Compute baseline ATS score
        ats_report = compute_ats_score(raw_text)
        
        # Generate 1536-dimensional semantic embedding based on skills + summary
        summary = analysis.get("summary") or ""
        embedding_text = f"Skills: {', '.join(skills)}. Summary: {summary}. Text: {raw_text[:1000]}"
        vector = get_embedding(embedding_text)
        
        resume = db.query(Resume).filter(Resume.id == resume_id).first()
        if resume:
            resume.experience_years = exp_years
            resume.all_skills_flat = skills
            resume.embedding = vector
            resume.ats_score = ats_report["overall_score"]
            resume.ats_grade = ats_report["grade"]
            resume.ats_suggestions = ats_report["suggestions"]
            db.commit()
            
            logger.info(f"Background analysis completed for resume {resume_id}")
            
            # Emit WebSocket event
            await manager.send_personal_message({
                "type": "RESUME_ANALYZED",
                "data": {
                    "resume_id": str(resume_id),
                    "experience_years": exp_years,
                    "skills_count": len(skills),
                    "ats_score": ats_report["overall_score"]
                }
            }, user_id)
            
    except Exception as e:
        logger.error(f"Error in background resume analysis: {e}")

from app.services.tailoring_service import generate_tailored_cover_letter
from app.services.cv_generator_service import generate_tailored_cv
from app.services.automation_service import automate_job_application
from app.core.database import SessionLocal
from app.models.application import Application

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
    1. Tailor CV and cover letter via LLM
    2. Pass to Playwright automation script
    3. Update DB application status
    """
    logger.info(f"Starting auto-apply pipeline for job {job_id}")
    db = SessionLocal()
    
    try:
        # Step 1: Tailor CV
        await manager.send_personal_message({
            "type": "AUTO_APPLY_PROGRESS",
            "data": {"job_id": job_id, "step": "AI is generating ATS-friendly tailored CV...", "status": "in_progress"}
        }, user_id)
        
        tailored_cv_path = await generate_tailored_cv(user_data, resume_text, job_description)
        
        # Step 2: Tailor cover letter
        await manager.send_personal_message({
            "type": "AUTO_APPLY_PROGRESS",
            "data": {"job_id": job_id, "step": "AI is writing tailored cover letter...", "status": "in_progress"}
        }, user_id)
        
        cover_letter = await asyncio.to_thread(
            generate_tailored_cover_letter,
            resume_text,
            job_description
        )
        
        # Step 3: Execute automation
        await automate_job_application(
            user_id=user_id,
            job_id=job_id,
            job_url=job_url,
            user_data=user_data,
            resume_path=tailored_cv_path, # Use the freshly generated CV!
            cover_letter=cover_letter
        )
        
        # Step 4: Update application status in DB to "applied"
        app = db.query(Application).filter(Application.user_id == user_id, Application.job_id == job_id).first()
        if app:
            app.status = "applied"
            db.commit()
            
            # Notify frontend of DB change
            await manager.send_personal_message({
                "type": "APPLICATION_UPDATED",
                "data": {"id": str(app.id), "status": "applied"}
            }, user_id)
            
    except Exception as e:
        logger.error(f"Auto-apply pipeline failed: {e}")
        await manager.send_personal_message({
            "type": "AUTO_APPLY_PROGRESS",
            "data": {"job_id": job_id, "step": f"Pipeline failed: {str(e)}", "status": "error"}
        }, user_id)
    finally:
        db.close()
