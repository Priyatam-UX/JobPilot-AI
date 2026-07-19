"""
Interview endpoints — question bank, STAR feedback, and session management.
"""
from fastapi import APIRouter, Depends, Query
from typing import Optional, List
from pydantic import BaseModel
from app.api.dependencies import get_current_user
from app.models.user import User
from app.services.interview_service import get_questions, analyze_star_response

router = APIRouter(prefix="/interview", tags=["Interview"])


class FeedbackRequest(BaseModel):
    question: str
    answer: str


@router.get("/questions")
def list_questions(
    category: Optional[str] = Query(None, description="behavioral | technical | hr"),
    difficulty: Optional[str] = Query(None, description="easy | medium | hard"),
    tags: Optional[str] = Query(None, description="Comma-separated tags to filter"),
    limit: int = Query(10, le=30),
    current_user: User = Depends(get_current_user),
):
    """
    Return interview questions from the curated question bank.
    Filter by category, difficulty, or tags.
    """
    tags_list = [t.strip() for t in tags.split(",")] if tags else None
    return get_questions(
        category=category,
        difficulty=difficulty,
        tags=tags_list,
        limit=limit,
    )


@router.post("/feedback")
def analyze_answer(
    payload: FeedbackRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Analyze a STAR method answer and return structured AI feedback.
    Evaluates Situation, Task, Action, Result components, quantification,
    action verbs usage, and provides specific improvement suggestions.
    """
    return analyze_star_response(payload.question, payload.answer)
