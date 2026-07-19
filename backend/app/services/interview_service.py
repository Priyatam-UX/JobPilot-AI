"""
Interview Service — curated question bank, STAR analysis, and feedback.
No external AI API required.
"""
import re
from typing import Dict, List, Any, Optional

# ─────────────────────────────────────────────
# Interview Question Bank
# ─────────────────────────────────────────────
QUESTION_BANK: List[Dict[str, Any]] = [
    # BEHAVIORAL
    {"id": "b1", "category": "behavioral", "difficulty": "medium", "tags": ["conflict", "teamwork"],
     "question": "Tell me about a time you had a significant conflict with a team member. How did you resolve it?"},
    {"id": "b2", "category": "behavioral", "difficulty": "medium", "tags": ["failure", "learning"],
     "question": "Describe a project you failed at. What did you learn and what would you do differently?"},
    {"id": "b3", "category": "behavioral", "difficulty": "medium", "tags": ["leadership", "influence"],
     "question": "Tell me about a time you had to influence a decision without having direct authority."},
    {"id": "b4", "category": "behavioral", "difficulty": "easy", "tags": ["pressure", "deadline"],
     "question": "Describe a situation where you had to deliver a major project under extreme time pressure."},
    {"id": "b5", "category": "behavioral", "difficulty": "medium", "tags": ["ambiguity", "decision"],
     "question": "Tell me about a time you had to make a critical decision with incomplete information."},
    {"id": "b6", "category": "behavioral", "difficulty": "hard", "tags": ["leadership", "mentoring"],
     "question": "Describe a situation where you mentored a struggling team member. What was your approach and the outcome?"},
    {"id": "b7", "category": "behavioral", "difficulty": "medium", "tags": ["stakeholders", "communication"],
     "question": "Tell me about a time you had to communicate complex technical concepts to non-technical stakeholders."},
    {"id": "b8", "category": "behavioral", "difficulty": "hard", "tags": ["ownership", "initiative"],
     "question": "Give an example of a time you identified a significant problem that wasn't in your job description and drove a solution."},
    {"id": "b9", "category": "behavioral", "difficulty": "easy", "tags": ["collaboration", "cross-functional"],
     "question": "Describe a successful cross-functional collaboration. What made it work?"},
    {"id": "b10", "category": "behavioral", "difficulty": "hard", "tags": ["strategy", "impact"],
     "question": "Tell me about the most impactful thing you've ever built or shipped. How did you measure its success?"},

    # TECHNICAL
    {"id": "t1", "category": "technical", "difficulty": "hard", "tags": ["system design", "scalability"],
     "question": "How would you design a URL shortener like bit.ly that handles 100 million URLs and 10 billion reads per day?"},
    {"id": "t2", "category": "technical", "difficulty": "hard", "tags": ["distributed systems", "consistency"],
     "question": "Explain the CAP theorem and give a real-world example of how you'd make a trade-off in a distributed database."},
    {"id": "t3", "category": "technical", "difficulty": "medium", "tags": ["database", "optimization"],
     "question": "Walk me through how you would identify and resolve a slow database query in a production system under load."},
    {"id": "t4", "category": "technical", "difficulty": "hard", "tags": ["architecture", "microservices"],
     "question": "How would you decompose a monolithic e-commerce application into microservices? What challenges would you anticipate?"},
    {"id": "t5", "category": "technical", "difficulty": "medium", "tags": ["api design", "rest"],
     "question": "Design a RESTful API for a real-time chat application. Cover authentication, message delivery, and read receipts."},
    {"id": "t6", "category": "technical", "difficulty": "hard", "tags": ["caching", "performance"],
     "question": "Explain different caching strategies (write-through, write-back, cache-aside) and when you'd use each."},
    {"id": "t7", "category": "technical", "difficulty": "medium", "tags": ["security", "auth"],
     "question": "How would you implement a secure authentication system? Cover JWT, refresh tokens, and common attack vectors."},
    {"id": "t8", "category": "technical", "difficulty": "hard", "tags": ["rate limiting", "system design"],
     "question": "Design a rate limiter that works across multiple distributed API servers. What algorithm would you use?"},
    {"id": "t9", "category": "technical", "difficulty": "medium", "tags": ["debugging", "production"],
     "question": "Walk me through how you would debug a memory leak in a production Node.js/Python service."},
    {"id": "t10", "category": "technical", "difficulty": "medium", "tags": ["data structures", "algorithms"],
     "question": "Explain how a hash table works internally, including collision resolution strategies."},
    {"id": "t11", "category": "technical", "difficulty": "hard", "tags": ["concurrency", "threading"],
     "question": "Explain the difference between parallelism and concurrency. How do you handle race conditions in a multi-threaded service?"},
    {"id": "t12", "category": "technical", "difficulty": "medium", "tags": ["ci/cd", "devops"],
     "question": "Walk me through an ideal CI/CD pipeline for a microservices application deployed to Kubernetes."},

    # HR
    {"id": "h1", "category": "hr", "difficulty": "easy", "tags": ["motivation", "culture"],
     "question": "Why do you want to work at this company specifically? What excites you most about this role?"},
    {"id": "h2", "category": "hr", "difficulty": "easy", "tags": ["growth", "goals"],
     "question": "Where do you see yourself professionally in 3-5 years? How does this role fit into that vision?"},
    {"id": "h3", "category": "hr", "difficulty": "medium", "tags": ["weakness", "self-awareness"],
     "question": "What's your most significant professional weakness, and what are you actively doing to address it?"},
    {"id": "h4", "category": "hr", "difficulty": "easy", "tags": ["strengths", "value"],
     "question": "What unique value do you bring to this team that other candidates might not?"},
    {"id": "h5", "category": "hr", "difficulty": "easy", "tags": ["leaving", "motivation"],
     "question": "Why are you leaving your current role? What are you looking for that you're not getting there?"},
    {"id": "h6", "category": "hr", "difficulty": "medium", "tags": ["salary", "expectations"],
     "question": "What are your salary expectations and what's driving that number?"},
    {"id": "h7", "category": "hr", "difficulty": "easy", "tags": ["work style", "preferences"],
     "question": "Describe your ideal work environment and how you like to collaborate with your team."},
    {"id": "h8", "category": "hr", "difficulty": "medium", "tags": ["availability", "timeline"],
     "question": "When can you start, and do you have any competing offers we should be aware of?"},
    {"id": "h9", "category": "hr", "difficulty": "easy", "tags": ["questions", "engagement"],
     "question": "What questions do you have for us about the team, culture, or the challenges this role will face?"},
    {"id": "h10", "category": "hr", "difficulty": "medium", "tags": ["remote", "async"],
     "question": "How do you stay productive and maintain work-life balance in a remote or hybrid environment?"},
]


def get_questions(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    tags: Optional[List[str]] = None,
    limit: int = 10,
) -> List[Dict[str, Any]]:
    """Filter and return interview questions."""
    questions = QUESTION_BANK

    if category:
        questions = [q for q in questions if q["category"] == category]

    if difficulty:
        questions = [q for q in questions if q["difficulty"] == difficulty]

    if tags:
        tags_lower = [t.lower() for t in tags]
        questions = [
            q for q in questions
            if any(tag in tags_lower for tag in q.get("tags", []))
        ]

    return questions[:limit]


from pydantic import BaseModel
import instructor
from openai import OpenAI
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class STARAnalysis(BaseModel):
    situation: str
    task: str
    action: str
    result: str

class FeedbackResult(BaseModel):
    score: int
    star_analysis: STARAnalysis
    strengths: List[str]
    improvements: List[str]
    keywords_used: List[str]
    quantification_count: int

def analyze_star_response(question: str, answer: str) -> Dict[str, Any]:
    """
    Analyze a STAR method response and provide structured feedback using OpenAI + Instructor.
    Falls back to a rule-based engine if the API key is not configured.
    """
    word_count = len(answer.split())
    
    if not answer or word_count < 20:
        return {
            "score": 0,
            "star_analysis": {
                "situation": "No answer provided or answer too short.",
                "task": "Please provide a complete answer.",
                "action": "Use the STAR method: Situation → Task → Action → Result.",
                "result": "Always end with a measurable outcome.",
            },
            "strengths": [],
            "improvements": ["Provide a complete answer using the STAR method (at least 50 words)."],
            "keywords_used": [],
            "word_count": word_count,
            "quantification_count": 0,
        }

    # If no key, run a simple fallback (just to prevent crashing, but warn the user)
    if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY == "mock-key":
        return {
            "score": 50,
            "star_analysis": {
                "situation": "⚠️ OpenAI API Key Not Configured.",
                "task": "To get true AI STAR grading, add your OPENAI_API_KEY to the .env file.",
                "action": "Currently running the mock fallback analyzer.",
                "result": "Real AI analysis requires the API key.",
            },
            "strengths": ["You provided an answer."],
            "improvements": ["Add OPENAI_API_KEY to .env to enable the true AI Coach."],
            "keywords_used": ["mock", "fallback"],
            "word_count": word_count,
            "quantification_count": 0,
        }

    try:
        # Enable instructor on the OpenAI client
        client = instructor.patch(OpenAI(api_key=settings.OPENAI_API_KEY))

        prompt = f"""
        You are an elite Tech Recruiter and Interview Coach.
        Evaluate this candidate's interview answer to the following question.
        
        Question: {question}
        Answer: {answer}

        Task:
        1. Break the answer down into the STAR method (Situation, Task, Action, Result).
        2. Score the answer out of 100 based on clarity, impact, use of 'I' vs 'we', strong action verbs, and quantification.
        3. Identify 2-3 specific strengths.
        4. Identify 2-3 specific improvements.
        5. Extract any strong action verbs or technical keywords they used.
        6. Count how many times they quantified their results (used numbers, percentages, dollar amounts, timeframes).
        """

        # Instructor automatically validates and structures the output based on the Pydantic model
        feedback: FeedbackResult = client.chat.completions.create(
            model="gpt-4o-mini",
            response_model=FeedbackResult,
            temperature=0.2,
            messages=[
                {"role": "system", "content": "You are a strict, highly analytical interview grader."},
                {"role": "user", "content": prompt},
            ]
        )

        return {
            "score": feedback.score,
            "star_analysis": feedback.star_analysis.model_dump(),
            "strengths": feedback.strengths,
            "improvements": feedback.improvements,
            "keywords_used": feedback.keywords_used,
            "word_count": word_count,
            "quantification_count": feedback.quantification_count,
        }

    except Exception as e:
        logger.error(f"Error calling OpenAI API in Interview Coach: {e}")
        return {
            "score": 0,
            "star_analysis": {
                "situation": "Error connecting to AI.",
                "task": "Error connecting to AI.",
                "action": "Error connecting to AI.",
                "result": "Error connecting to AI.",
            },
            "strengths": [],
            "improvements": ["Check your OpenAI API key and connection status."],
            "keywords_used": [],
            "word_count": word_count,
            "quantification_count": 0,
        }
