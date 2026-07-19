from pydantic import BaseModel, Field
from typing import List, Optional
from app.agents.base import BaseAgent

class JobMatchSchema(BaseModel):
    match_score: float = Field(description="Percentage score representing alignment between applicant profile and job description (0-100).")
    estimated_salary_min: Optional[float] = Field(description="Estimated lower bound salary if not listed in JD.")
    estimated_salary_max: Optional[float] = Field(description="Estimated upper bound salary if not listed in JD.")
    matched_skills: List[str] = Field(description="Core technologies and skills required by the JD that the applicant possesses.")
    missing_skills: List[str] = Field(description="Required technologies and skills listed in the JD that are not evident in the applicant profile.")
    explanation: str = Field(description="Structured explanation of the compatibility ranking.")

class JobMatchingAgent(BaseAgent):
    """Job Matching Agent analyzing profile-to-job descriptions and generating embeddings."""
    
    def match_job(self, profile_summary: str, profile_skills: List[str], job_description: str) -> JobMatchSchema:
        if self.is_mock:
            return JobMatchSchema(
                match_score=87.5,
                estimated_salary_min=135000.0,
                estimated_salary_max=175000.0,
                matched_skills=["React 19", "FastAPI", "TypeScript"],
                missing_skills=["Kubernetes orchestration", "AWS CloudFormation"],
                explanation="Highly aligned frontend core with slight gap in DevOps orchestrations."
            )

        prompt = (
            f"Compare the user profile with the job description and output compatibility scores.\n\n"
            f"Applicant Skills: {', '.join(profile_skills)}\n"
            f"Applicant Summary: {profile_summary}\n\n"
            f"--- Job Description ---\n{job_description}\n"
        )

        response = self.client.chat.completions.create(
            model=self.model,
            response_model=JobMatchSchema,
            messages=[
                {"role": "system", "content": "You are an AI recruiting consultant matching candidate competencies to corporate requirements."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )
        return response

    def get_embeddings(self, text: str) -> List[float]:
        """Generate text embeddings (1536 dimensions) for semantic/vector indexing."""
        if self.is_mock:
            # Return dummy 1536 float values for testing/local compilation
            return [0.01536] * 1536

        # Standard OpenAI client embeddings call
        try:
            # We fetch direct openai client from settings
            import openai
            from app.core.config import settings
            client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
            response = client.embeddings.create(
                input=[text.replace("\n", " ")],
                model="text-embedding-3-small" # 1536 dimensional embedding
            )
            return response.data[0].embedding
        except Exception:
            return [0.0] * 1536
