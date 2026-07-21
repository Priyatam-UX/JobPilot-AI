import logging
from typing import Dict, Any, List
from pydantic import BaseModel, Field
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from app.core.config import settings

logger = logging.getLogger(__name__)

class OptimizedResumeSchema(BaseModel):
    optimized_summary: str = Field(description="A rewritten professional summary highlighting skills relevant to the JD.")
    optimized_experience: List[Dict[str, Any]] = Field(description="A list of experience dictionaries with 'role', 'company', 'duration', and 'bullets' (list of rewritten strings).")
    added_keywords: List[str] = Field(description="List of ATS keywords successfully injected from the JD.")

def optimize_resume_bullets(resume_text: str, job_description: str) -> dict:
    """
    Uses Groq to rewrite the resume summary and bullet points 
    to maximize ATS keyword density for a specific job description.
    """
    if not settings.GROQ_API_KEY or settings.GROQ_API_KEY == "mock-key":
        logger.warning("GROQ_API_KEY not set. Returning original resume data.")
        return {"message": "API key not configured."}
        
    try:
        llm = ChatGroq(
            model="llama-3.1-8b-instant",
            temperature=0.7,
            groq_api_key=settings.GROQ_API_KEY
        )
        
        structured_llm = llm.with_structured_output(OptimizedResumeSchema)
        
        prompt = PromptTemplate.from_template(
            """You are an elite executive resume writer.
            Rewrite the provided resume's professional summary and experience bullet points
            to align perfectly with the target Job Description. 
            Inject the exact keywords and phrases from the JD where contextually accurate, 
            without fabricating experience.
            Ensure strong action verbs and quantified metrics are preserved or enhanced.
            
            Target Job Description:
            {jd}
            
            Original Resume:
            {resume}
            """
        )
        
        chain = prompt | structured_llm
        result: OptimizedResumeSchema = chain.invoke({"jd": job_description, "resume": resume_text})
        
        return result.model_dump()
        
    except Exception as e:
        logger.error(f"Tailoring failed: {e}")
        return {"message": f"Tailoring failed: {e}"}

def generate_tailored_cover_letter(resume_text: str, job_description: str) -> str:
    """Generates a concise, impactful cover letter."""
    if not settings.GROQ_API_KEY or settings.GROQ_API_KEY == "mock-key":
        logger.warning("GROQ_API_KEY not set or invalid. Returning fallback cover letter.")
        return "Cover letter generation requires a valid API key. This is a placeholder cover letter."
        
    try:
        llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.7, groq_api_key=settings.GROQ_API_KEY)
        
        prompt = PromptTemplate.from_template(
            """You are an elite Tech Recruiter and AI Resume Writer.
            Your task is to take a candidate's base resume and a specific job description, and output a highly tailored, professional cover letter that strongly highlights the candidate's matching skills.

            Follow these rules:
            1. The cover letter should be concise (3-4 paragraphs max).
            2. Do not hallucinate skills the candidate does not have.
            3. Focus heavily on how the candidate's existing experience translates directly to the job requirements.
            4. Keep the tone professional, confident, and modern.
            5. Output ONLY the raw text of the cover letter.

            Resume:
            {resume}

            Job Description:
            {jd}
            """
        )
        
        chain = prompt | llm
        response = chain.invoke({"resume": resume_text, "jd": job_description})
        
        return response.content
    except Exception as e:
        logger.error(f"Cover letter generation failed: {e}")
        return "Dear Hiring Manager,\n\nI am writing to express my strong interest in this position. My enclosed resume details my professional background and how my skills align with your requirements. I would welcome the opportunity to discuss how I can contribute to your team.\n\nSincerely,\n[Your Name]"
