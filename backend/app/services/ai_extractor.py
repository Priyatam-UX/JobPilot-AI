import logging
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings

logger = logging.getLogger(__name__)

# Pydantic schema for strict OpenAI structured output
class EducationSchema(BaseModel):
    degree: str = Field(description="The degree or certification obtained (e.g. B.S. Computer Science)")
    institution: str = Field(description="The university or institution name")
    year: Optional[str] = Field(description="Year of graduation if present", default=None)

class ExperienceSchema(BaseModel):
    role: str = Field(description="The job title")
    company: str = Field(description="The company name")
    duration: str = Field(description="The duration of employment (e.g. Jan 2020 - Present)")
    bullets: List[str] = Field(description="List of bullet points describing the work")

class ContactSchema(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None

class ResumeExtractionSchema(BaseModel):
    skills: Dict[str, List[str]] = Field(description="Skills categorized by 'languages', 'frontend', 'backend', 'databases', 'cloud_devops', 'ai_ml', 'tools', 'soft_skills'")
    experience_years: float = Field(description="Estimated total years of professional experience as a float")
    contact: ContactSchema = Field(description="Contact information extracted")
    education: List[EducationSchema] = Field(description="List of education entries")
    experience: List[ExperienceSchema] = Field(description="List of work experience entries")
    sections_detected: Dict[str, bool] = Field(description="Boolean flags if these sections exist: 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements'")
    summary: Optional[str] = Field(description="Professional summary if present", default=None)


def extract_resume_data_with_ai(raw_text: str) -> dict:
    """
    Uses OpenAI gpt-4o-mini to extract highly structured data from raw resume text.
    Returns a dictionary mapping exactly to ResumeExtractionSchema.
    """
    if not settings.OPENAI_API_KEY:
        logger.warning("OPENAI_API_KEY not set. Falling back to empty extraction.")
        return get_fallback_extraction()
        
    try:
        llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0,
            openai_api_key=settings.OPENAI_API_KEY
        )
        
        structured_llm = llm.with_structured_output(ResumeExtractionSchema)
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an expert technical recruiter and resume parser. Extract the structured information accurately from the provided raw resume text. Ensure skills are properly categorized. If a field is not found, leave it empty or false."),
            ("human", "Resume Text:\n\n{text}")
        ])
        
        chain = prompt | structured_llm
        
        # Invoke the chain
        result: ResumeExtractionSchema = chain.invoke({"text": raw_text})
        
        # Flatten skills
        all_skills_flat = []
        for cat_skills in result.skills.values():
            all_skills_flat.extend(cat_skills)
            
        # Return dict matching what the rest of the app expects
        return {
            "skills": result.skills,
            "all_skills_flat": list(set(all_skills_flat)),
            "contact": result.contact.model_dump(),
            "sections": result.sections_detected,
            "education": [e.model_dump() for e in result.education],
            "experience": [e.model_dump() for e in result.experience],
            "experience_years": result.experience_years,
            "word_count": len(raw_text.split()) if raw_text else 0,
            "summary": result.summary
        }
        
    except Exception as e:
        logger.error(f"AI Extraction failed: {e}")
        return get_fallback_extraction()


def get_fallback_extraction():
    return {
        "skills": {},
        "all_skills_flat": [],
        "contact": {},
        "sections": {},
        "education": [],
        "experience": [],
        "experience_years": 0.0,
        "word_count": 0,
        "summary": None
    }
