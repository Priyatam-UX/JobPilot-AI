import logging
import os
import uuid
from typing import Dict, Any
from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
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
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7, openai_api_key=settings.OPENAI_API_KEY)
    
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
    return chain.invoke({"resume": resume_text, "jd": job_description})

def create_docx_cv(user_data: Dict[str, Any], tailored_content: TailoredCV, original_resume_text: str) -> str:
    """Generates a clean, ATS-friendly DOCX file."""
    doc = Document()
    
    # Styling
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Arial'
    font.size = Pt(11)
    
    # Header
    name_para = doc.add_paragraph()
    name_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    name_run = name_para.add_run(f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}")
    name_run.bold = True
    name_run.font.size = Pt(16)
    
    contact_para = doc.add_paragraph()
    contact_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    contact_para.add_run(f"{user_data.get('email', '')} | {user_data.get('phone', '')}")
    
    # Summary
    doc.add_heading('Professional Summary', level=1)
    doc.add_paragraph(tailored_content.summary)
    
    # Skills
    doc.add_heading('Core Competencies', level=1)
    doc.add_paragraph(" • ".join(tailored_content.skills))
    
    # Experience (We just list the tailored bullets under a generic 'Professional Experience' for the MVP, 
    # ideally we would structure it by job, but this ensures ATS readability of the keywords)
    doc.add_heading('Professional Experience & Highlights', level=1)
    for bullet in tailored_content.experience_bullets:
        doc.add_paragraph(bullet, style='List Bullet')
        
    # Education / Other (Fallback to original text extraction if needed, but we'll skip for MVP to keep it clean)
    
    # Save
    os.makedirs("generated_cvs", exist_ok=True)
    filename = f"generated_cvs/Tailored_CV_{uuid.uuid4().hex[:8]}.docx"
    filepath = os.path.abspath(filename)
    doc.save(filepath)
    
    return filepath

async def generate_tailored_cv(user_data: dict, resume_text: str, job_description: str) -> str:
    """Main entrypoint for CV generation."""
    logger.info("Generating tailored CV via AI...")
    tailored_content = generate_tailored_content(resume_text, job_description)
    logger.info("Creating DOCX file...")
    filepath = create_docx_cv(user_data, tailored_content, resume_text)
    return filepath
