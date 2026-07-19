from pydantic import BaseModel, Field
from typing import List
from app.agents.base import BaseAgent

class ATSAnalysisSchema(BaseModel):
    overall_score: float = Field(description="Overall ATS compatibility score (0-100).", ge=0, le=100)
    keyword_score: float = Field(description="Keyword relevance score (0-100).", ge=0, le=100)
    format_score: float = Field(description="Formatting compatibility score (0-100).", ge=0, le=100)
    missing_keywords: List[str] = Field(description="Keywords present in the Job Description but missing from the resume.")
    matched_keywords: List[str] = Field(description="Matched keywords between the resume and JD.")
    formatting_issues: List[str] = Field(description="ATS parser problems detected in layout (e.g. multi-column table issues, unreadable font, image labels).")
    suggestions: List[str] = Field(description="Actionable checklist to optimize the score.")

class ATSAgent(BaseAgent):
    """ATS Agent analyzing resumes against JDs and estimating compatibility scores."""
    
    def analyze_resume(self, resume_text: str, job_description: str) -> ATSAnalysisSchema:
        if self.is_mock:
            return ATSAnalysisSchema(
                overall_score=78.5,
                keyword_score=72.0,
                format_score=85.0,
                missing_keywords=["Distributed Cache", "Redis Task queue", "pgvector indexing"],
                matched_keywords=["FastAPI", "SQLAlchemy 2.0", "PostgreSQL"],
                formatting_issues=["Ensure email header is single line to allow easy contact parser scanning."],
                suggestions=["Integrate missing Redis task queue keyword into experience bullets."]
            )

        prompt = (
            f"Perform an ATS parser compatibility audit on the following resume against the job description.\n\n"
            f"--- Job Description ---\n{job_description}\n\n"
            f"--- Resume Text ---\n{resume_text}\n"
        )

        response = self.client.chat.completions.create(
            model=self.model,
            response_model=ATSAnalysisSchema,
            messages=[
                {"role": "system", "content": "You are a professional ATS scanner algorithm simulator that evaluates keyword density and formatting readability."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1
        )
        return response
