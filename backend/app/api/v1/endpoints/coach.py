"""
Career Coach endpoints — intelligent context-aware career guidance.
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict
from app.api.dependencies import get_current_user
from app.models.user import User
from app.services.coach_service import get_career_response

router = APIRouter(prefix="/coach", tags=["Career Coach"])


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class CoachChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    resume_skills: Optional[List[str]] = []
    desired_role: Optional[str] = None


@router.post("/chat")
def coach_chat(
    payload: CoachChatRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Send a message to the AI Career Coach and receive a detailed, contextual response.
    Maintains conversation context via history. Uses the user's resume skills and
    desired role to personalize advice.
    """
    history = [{"role": m.role, "content": m.content} for m in (payload.history or [])]

    response = get_career_response(
        message=payload.message,
        history=history,
        resume_skills=payload.resume_skills or [],
        desired_role=payload.desired_role,
    )

    return {
        "role": "assistant",
        "content": response,
    }
