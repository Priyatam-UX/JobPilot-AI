from pydantic import BaseModel, Field
from typing import List, Optional
from app.agents.base import BaseAgent

class InterviewQuestionDetail(BaseModel):
    category: str = Field(description="Type of question: behavioral, technical, hr.")
    question: str = Field(description="The interview question text.")
    sample_answer: str = Field(description="An optimal target answer using executive communication style.")
    difficulty: str = Field(description="easy, medium, hard.")

class GeneratedQuestionsSchema(BaseModel):
    questions: List[InterviewQuestionDetail] = Field(description="List of company-specific generated interview questions.")

class STARFeedbackSchema(BaseModel):
    score: float = Field(description="Overall response assessment score (0-100).", ge=0, le=100)
    situation_feedback: str = Field(description="Feedback on context presentation (S).")
    task_feedback: str = Field(description="Feedback on task clarity (T).")
    action_feedback: str = Field(description="Feedback on concrete actions taken (A).")
    result_feedback: str = Field(description="Feedback on measurable results quantified (R).")
    suggestions: List[str] = Field(description="Actionable pointers to improve the response.")

class InterviewAgent(BaseAgent):
    """Interview Agent generating mock questions and auditing candidate responses using STAR."""
    
    def generate_mock_interview(self, company: str, job_title: str, job_description: str) -> GeneratedQuestionsSchema:
        if self.is_mock:
            return GeneratedQuestionsSchema(
                questions=[
                    InterviewQuestionDetail(
                        category="behavioral",
                        question=f"Tell me about a time in your past role where you implemented system architectures similar to {job_title} duties.",
                        sample_answer="In my previous position, I scaled API controllers by implementing cache layers...",
                        difficulty="medium"
                    ),
                    InterviewQuestionDetail(
                        category="technical",
                        question=f"How would you optimize transaction concurrency on PostgreSQL at {company}?",
                        sample_answer="I would isolate locks by utilizing selective indexes and read-replicas...",
                        difficulty="hard"
                    )
                ]
            )

        prompt = (
            f"Generate 3 highly realistic interview questions (behavioral, technical, hr) for a candidate applying to: \n"
            f"Company: {company}\n"
            f"Role: {job_title}\n\n"
            f"--- Job Description ---\n{job_description}\n"
        )

        response = self.client.chat.completions.create(
            model=self.model,
            response_model=GeneratedQuestionsSchema,
            messages=[
                {"role": "system", "content": "You are a lead engineering hiring loop manager at a tech firm. You generate sharp, realistic, company-specific questions."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4
        )
        return response

    def evaluate_response(self, question: str, user_answer: str) -> STARFeedbackSchema:
        if self.is_mock:
            return STARFeedbackSchema(
                score=85.0,
                situation_feedback="Good context outlining database lockups.",
                task_feedback="Task was clear: identify locks and prevent api failures.",
                action_feedback="Describe the actions: what raw sql commands or optimization scripts did you run?",
                result_feedback="Measurable result was detailed: transaction processing delay reduced by 40%.",
                suggestions=["Add communication updates: how did you alert customers of transaction delays?"]
            )

        prompt = (
            f"Audit the candidate response using the STAR format.\n\n"
            f"Question Asked: {question}\n"
            f"Candidate Answer: {user_answer}\n"
        )

        response = self.client.chat.completions.create(
            model=self.model,
            response_model=STARFeedbackSchema,
            messages=[
                {"role": "system", "content": "You are an executive communication coach. Analyze answers using S.T.A.R rules and score from 0-100."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )
        return response
