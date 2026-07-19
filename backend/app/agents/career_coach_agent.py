from pydantic import BaseModel, Field
from typing import List
from app.agents.base import BaseAgent

class RoadmapStep(BaseModel):
    phase: str = Field(description="Step title or milestone (e.g. Phase 1: Concurrency patterns).")
    duration: str = Field(description="Timeline duration (e.g. 1 week).")
    topics: List[str] = Field(description="List of specific technologies and architectures to master.")
    action_items: List[str] = Field(description="Concrete projects or exercises to validate progress.")

class SkillGapDetail(BaseModel):
    skill: str = Field(description="The missing skill or tool.")
    priority: str = Field(description="Importance level (high, medium, low).")
    recommendation: str = Field(description="Action item to close this gap.")

class CareerCoachReportSchema(BaseModel):
    skill_gaps: List[SkillGapDetail] = Field(description="Comprehensive list of analyzed technical and domain competencies gaps.")
    roadmap: List[RoadmapStep] = Field(description="Step-by-step custom learning milestones.")
    negotiation_script: str = Field(description="High-impact salary negotiation script tailored to the benchmark.")

class CareerCoachAgent(BaseAgent):
    """Career Coach Agent generating learning roadmaps, gap audits, and negotiation scripts."""
    
    def generate_coach_report(self, profile_skills: List[str], desired_roles: List[str]) -> CareerCoachReportSchema:
        if self.is_mock:
            return CareerCoachReportSchema(
                skill_gaps=[
                    SkillGapDetail(
                        skill="Golang Distributed Primitives",
                        priority="high",
                        recommendation="Build a distributed cache server using channels and sync.Mutex."
                    )
                ],
                roadmap=[
                    RoadmapStep(
                        phase="Milestone 1: Golang Concurrency Patterns",
                        duration="2 weeks",
                        topics=["goroutines", "select multiplexers", "channel safety"],
                        action_items=["Complete tour of Go concurrency and write a clean workers pool helper."]
                    )
                ],
                negotiation_script="Dear Recruiter,\n\nI am thrilled about the offer..."
            )

        prompt = (
            f"Build a career coaching learning roadmap and negotiation plan.\n\n"
            f"Current Skills: {', '.join(profile_skills)}\n"
            f"Desired Target Roles: {', '.join(desired_roles)}\n"
        )

        response = self.client.chat.completions.create(
            model=self.model,
            response_model=CareerCoachReportSchema,
            messages=[
                {"role": "system", "content": "You are an executive career coach advising top-tier software engineers on leveling up."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        return response
