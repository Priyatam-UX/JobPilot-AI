import logging
from typing import Dict, Any, Optional
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings

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
