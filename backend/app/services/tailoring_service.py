import logging
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings
from app.services.ai_extractor import ExperienceSchema

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an elite Tech Recruiter and AI Resume Writer.
Your task is to take a candidate's base resume and a specific job description, and output a highly tailored, professional cover letter that strongly highlights the candidate's matching skills.

Follow these rules:
1. The cover letter should be concise (3-4 paragraphs max).
2. Do not hallucinate skills the candidate does not have.
3. Focus heavily on how the candidate's existing experience translates directly to the job requirements.
4. Keep the tone professional, confident, and modern.
5. Output ONLY the raw text of the cover letter. Do not include markdown formatting like ```text.
"""

def generate_tailored_cover_letter(resume_text: str, job_description: str) -> str:
    """
    Generate a tailored cover letter using OpenAI based on the user's resume and a job description.
    """
    if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY == "mock-key":
        logger.warning("OPENAI_API_KEY not configured. Falling back to mock cover letter.")
        return (
            "Dear Hiring Manager,\n\n"
            "I am writing to express my strong interest in the open position at your company. "
            "Based on the job description, I believe my skills and background make me a great fit. "
            "I look forward to discussing how I can contribute to your team.\n\n"
            "Sincerely,\n[Your Name]"
        )

    try:
        llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.7,
            api_key=settings.OPENAI_API_KEY
        )

        prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("user", "Here is my resume:\n\n{resume}\n\nHere is the job description:\n\n{job_description}\n\nPlease write the cover letter.")
        ])

        chain = prompt | llm
        
        response = chain.invoke({
            "resume": resume_text,
            "job_description": job_description
        })
        
        return response.content

    except Exception as e:
        logger.error(f"Error generating cover letter: {e}")
        return "Error: Could not generate cover letter due to an AI service interruption."


class OptimizedResumeSchema(BaseModel):
    optimized_summary: str = Field(description="A highly targeted 2-3 sentence professional summary optimized for the job description.")
    optimized_experience: List[ExperienceSchema] = Field(description="The updated work experience with bullet points rewritten to strongly align with the target job's keywords and requirements while remaining truthful.")
    added_keywords: List[str] = Field(description="A list of important ATS keywords that were naturally woven into the rewritten bullets/summary.")


def optimize_resume_bullets(resume_text: str, job_description: str) -> dict:
    """
    Rewrites the professional summary and bullet points of a resume to better match a JD.
    Returns a structured dictionary with the optimized content.
    """
    if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY == "mock-key":
        raise ValueError("OPENAI_API_KEY not configured.")

    try:
        llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.4,
            api_key=settings.OPENAI_API_KEY
        )

        structured_llm = llm.with_structured_output(OptimizedResumeSchema)
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an elite ATS Optimization AI. Your job is to rewrite a candidate's resume (specifically the Summary and Experience bullet points) so that it ranks perfectly for a provided Job Description. You MUST NOT hallucinate jobs or degrees the candidate doesn't have. You MUST rewrite the bullet points using strong action verbs, quantifiable metrics, and exact keywords from the JD where contextually accurate."),
            ("human", "Candidate Resume:\n\n{resume}\n\n---\n\nTarget Job Description:\n\n{job_description}")
        ])

        chain = prompt | structured_llm
        
        result: OptimizedResumeSchema = chain.invoke({
            "resume": resume_text,
            "job_description": job_description
        })
        
        return result.model_dump()

    except Exception as e:
        logger.error(f"Error optimizing resume: {e}")
        raise e
