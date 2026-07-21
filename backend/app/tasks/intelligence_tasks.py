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
from app.services.cv_generator_service import generate_tailored_cv_sync
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
        
        tailored_cv_path = await asyncio.to_thread(
            generate_tailored_cv_sync,
            user_data, resume_text, job_description
        )
        
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
        
        # Step 4: Save Tailored Cover Letter to DB
        from app.models.cover_letter import CoverLetter as DB_CoverLetter
        db_cover_letter = DB_CoverLetter(
            user_id=py_uuid.UUID(user_id),
            job_id=py_uuid.UUID(job_id),
            title=f"Cover Letter for Job {job_id[:8]}",
            content=cover_letter
        )
        db.add(db_cover_letter)
        db.commit()

        # Step 5: Save Tailored CV as a new ResumeVersion
        from app.models.resume import ResumeVersion, Resume
        import os
        # Find user's active resume ID
        resume_record = db.query(Resume).filter(
            Resume.user_id == py_uuid.UUID(user_id)
        ).order_by(Resume.created_at.desc()).first()
        
        db_resume_version = None
        if resume_record:
            latest_version = db.query(ResumeVersion).filter(
                ResumeVersion.resume_id == resume_record.id
            ).order_by(ResumeVersion.version_number.desc()).first()
            next_ver = (latest_version.version_number + 1) if latest_version else 1
            
            db_resume_version = ResumeVersion(
                resume_id=resume_record.id,
                version_number=next_ver,
                title=f"Tailored CV for Job {job_id[:8]}",
                raw_text=resume_text,
                file_path=f"/api/v1/generated_cvs/{os.path.basename(tailored_cv_path)}"
            )
            db.add(db_resume_version)
            db.commit()

        # Step 6: Update application status in DB to "applied" and link documents
        app = db.query(Application).filter(
            Application.user_id == py_uuid.UUID(user_id), 
            Application.job_id == py_uuid.UUID(job_id)
        ).first()
        if app:
            app.status = "applied"
            app.cover_letter_id = db_cover_letter.id
            if db_resume_version:
                app.resume_version_id = db_resume_version.id
            db.commit()
            
            # Notify frontend of DB change
            await manager.send_personal_message({
                "type": "APPLICATION_UPDATED",
                "data": {"id": str(app.id), "status": "applied"}
            }, user_id)
            
            # Send Email Notification
            from app.services.email_service import send_application_success_email
            if "email" in user_data and user_data["email"]:
                try:
                    await send_application_success_email(user_data["email"], job_id, job_url)
                except Exception as email_err:
                    logger.error(f"Failed to send success email: {email_err}")
            
            # Send final success event to modal
            await manager.send_personal_message({
                "type": "AUTO_APPLY_PROGRESS",
                "data": {"job_id": job_id, "step": "Successfully applied! Check your email/dashboard.", "status": "success"}
            }, user_id)
            
    except Exception as e:
        logger.error(f"Auto-apply pipeline failed: {e}")
        await manager.send_personal_message({
            "type": "AUTO_APPLY_PROGRESS",
            "data": {"job_id": job_id, "step": f"Pipeline failed: {str(e)}", "status": "error"}
        }, user_id)
    finally:
        db.close()
