from pydantic import BaseModel, Field
from typing import List, Optional
from app.agents.base import BaseAgent

class CoverLetterSchema(BaseModel):
    title: str = Field(description="Title of the cover letter.")
    content: str = Field(description="The full cover letter body, formatted professionally.")
    matched_criteria: List[str] = Field(description="Checklist of specific criteria from the job description matched in the letter.")

class CoverLetterAgent(BaseAgent):
    """Cover Letter Agent generating personalized, company-specific letters."""
    
    def generate_cover_letter(
        self,
        profile_summary: str,
        job_title: str,
        company_name: str,
        job_description: str,
        hiring_manager: Optional[str] = None
    ) -> CoverLetterSchema:
        if self.is_mock:
            manager = hiring_manager or "Hiring Team"
            return CoverLetterSchema(
                title=f"Cover Letter - {job_title} at {company_name}",
                content=(
                    f"Dear {manager},\n\n"
                    f"I am writing to express my strong interest in the {job_title} position at {company_name}. "
                    f"With my experience outlined in my profile: '{profile_summary[:60]}...', I am excited to contribute. "
                    f"I admire {company_name}'s focus on innovation and scalability."
                ),
                matched_criteria=[f"Matched experience to {job_title}", "Addressed company mission statements"]
            )

        manager_str = f"Hiring Manager: {hiring_manager}" if hiring_manager else "Hiring Manager: Unknown"
        prompt = (
            f"Generate a personalized cover letter for the following role.\n\n"
            f"Company: {company_name}\n"
            f"Job Title: {job_title}\n"
            f"{manager_str}\n\n"
            f"--- Job Description ---\n{job_description}\n\n"
            f"--- User Profile Summary ---\n{profile_summary}\n"
        )

        response = self.client.chat.completions.create(
            model=self.model,
            response_model=CoverLetterSchema,
            messages=[
                {"role": "system", "content": "You are a professional executive recruiter. You write high-impact cover letters without filler text."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        return response
