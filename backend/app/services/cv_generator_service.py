import logging
import os
import uuid
from typing import Dict, Any
from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from pydantic import BaseModel, Field
from app.core.config import settings
from app.services.ai_extractor import extract_resume_data_with_ai

logger = logging.getLogger(__name__)

class TailoredCV(BaseModel):
    summary: str = Field(description="ATS optimized professional summary tailored to the JD.")
    experience_bullets: list[str] = Field(description="Tailored experience bullets highlighting matched skills.")
    skills: list[str] = Field(description="List of skills relevant to the job description.")

def generate_tailored_content(resume_text: str, job_description: str) -> TailoredCV:
    """Uses LLM to rewrite the resume summary and bullets specifically for the JD."""
    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.7, groq_api_key=settings.GROQ_API_KEY)
    
    prompt = PromptTemplate.from_template(
        """You are an elite executive recruiter. 
        I will give you a candidate's resume and a target Job Description (JD).
        Your goal is to extract and rewrite the candidate's summary and experience bullets 
        to perfectly align with the ATS keywords in the JD, WITHOUT hallucinating fake experience.
        
        Resume:
        {resume}
        
        Job Description:
        {jd}
        """
    )
    
    chain = prompt | llm.with_structured_output(TailoredCV)
    try:
        return chain.invoke({"resume": resume_text, "jd": job_description})
    except Exception as e:
        logger.warning(f"OpenAI tailoring failed (likely quota limit). Falling back to original resume: {e}")
        return TailoredCV(
            summary=resume_text[:200] + "...", 
            experience_bullets=[resume_text[:100], "Fallback experience bullet due to API limits."],
            skills=["Fallback", "Skill"]
        )

def create_docx_cv(user_data: Dict[str, Any], tailored_content: TailoredCV, original_resume_text: str) -> str:
    """Generates a clean, ATS-friendly DOCX file based on the user's template structure."""
    doc = Document()
    
    # Styling
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Arial'
    font.size = Pt(10)
    
    # --- HEADER ---
    name_para = doc.add_paragraph()
    name_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    name_run = name_para.add_run(f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}")
    name_run.bold = True
    name_run.font.size = Pt(16)
    
    contact_para = doc.add_paragraph()
    contact_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    contact_str = f"{user_data.get('phone', 'Phone')} | {user_data.get('email', 'Email')} | LinkedIn | GitHub"
    contact_para.add_run(contact_str)
    
    # --- EDUCATION ---
    # In a fully fleshed out version, we'd extract this dynamically, 
    # but to match the template structure, we add the heading.
    doc.add_heading('Education', level=1)
    
    # --- EXPERIENCE ---
    doc.add_heading('Experience', level=1)
    # We list the tailored bullets under a generic professional experience section to guarantee ATS keyword matches.
    for bullet in tailored_content.experience_bullets:
        doc.add_paragraph(bullet, style='List Bullet')
        
    # --- PROJECTS ---
    doc.add_heading('Projects', level=1)
    
    # --- TECHNICAL SKILLS ---
    doc.add_heading('Technical Skills', level=1)
    doc.add_paragraph(" • ".join(tailored_content.skills))
    
    # --- CERTIFICATIONS ---
    doc.add_heading('Certifications', level=1)
    
    # --- RESPONSIBILITY ---
    doc.add_heading('Responsibility', level=1)
    
    # --- ACHIEVEMENTS ---
    doc.add_heading('Achievements', level=1)
    
    # Save
    os.makedirs("generated_cvs", exist_ok=True)
    filename = f"generated_cvs/Tailored_CV_{uuid.uuid4().hex[:8]}.docx"
    filepath = os.path.abspath(filename)
    doc.save(filepath)
    
    return filepath

def generate_tailored_cv_sync(user_data: dict, resume_text: str, job_description: str) -> str:
    """Main entrypoint for CV generation (synchronous to avoid event loop blocking)."""
    logger.info("Generating tailored CV via AI...")
    tailored_content = generate_tailored_content(resume_text, job_description)
    logger.info("Creating DOCX file...")
    filepath = create_docx_cv(user_data, tailored_content, resume_text)
    return filepath
