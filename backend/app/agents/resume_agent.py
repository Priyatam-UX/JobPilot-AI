from pydantic import BaseModel, Field
from typing import List
from app.agents.base import BaseAgent

class TailoredResumeSchema(BaseModel):
    tailored_text: str = Field(description="The full optimized resume text incorporating job description matching.")
    added_keywords: List[str] = Field(description="List of keywords injected into the resume.")
    suggested_formatting_improvements: List[str] = Field(description="List of specific section improvements and formatting suggestions.")

class ResumeAgent(BaseAgent):
    """Resume Agent tailoring raw resume text to a specific Job Description."""
    
    def tailor_resume(self, raw_resume: str, job_description: str) -> TailoredResumeSchema:
        if self.is_mock:
            return TailoredResumeSchema(
                tailored_text=(
                    f"Optimized Resume\n\nObjective: Aligning backend scaling goals with requirements.\n\n"
                    f"Experience:\n- Integrated distributed lock structures matching JD requirements.\n- Raw: {raw_resume[:100]}..."
                ),
                added_keywords=["Distributed Lock", "FastAPI", "PostgreSQL", "pgvector"],
                suggested_formatting_improvements=["Expand bullet points on scalability benchmarks in current role."]
            )

        prompt = (
            f"Tailor the following raw resume to match this Job Description.\n\n"
            f"--- Job Description ---\n{job_description}\n\n"
            f"--- Master Resume ---\n{raw_resume}\n"
        )

        response = self.client.chat.completions.create(
            model=self.model,
            response_model=TailoredResumeSchema,
            messages=[
                {"role": "system", "content": "You are a professional technical resume writer specializing in ATS optimization."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )
        return response
