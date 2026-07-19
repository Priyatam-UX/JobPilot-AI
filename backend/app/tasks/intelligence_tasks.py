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
