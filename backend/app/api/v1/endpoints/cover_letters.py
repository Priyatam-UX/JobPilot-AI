import uuid
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.cover_letter import (
    CoverLetterCreate,
    CoverLetterUpdate,
    CoverLetterResponse,
)
from app.services.cover_letter_service import CoverLetterService

router = APIRouter(prefix="/cover-letters", tags=["Cover Letters"])


@router.get("/", response_model=List[CoverLetterResponse])
def list_cover_letters(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all cover letters for the current user."""
    service = CoverLetterService(db)
    return service.get_user_cover_letters(current_user.id)


@router.post("/", response_model=CoverLetterResponse, status_code=201)
def create_cover_letter(
    data: CoverLetterCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new cover letter."""
    service = CoverLetterService(db)
    return service.create_cover_letter(current_user.id, data)


@router.get("/{cover_letter_id}", response_model=CoverLetterResponse)
def get_cover_letter(
    cover_letter_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific cover letter by ID."""
    service = CoverLetterService(db)
    return service.get_cover_letter(cover_letter_id, current_user.id)


@router.patch("/{cover_letter_id}", response_model=CoverLetterResponse)
def update_cover_letter(
    cover_letter_id: uuid.UUID,
    data: CoverLetterUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a cover letter's content or title."""
    service = CoverLetterService(db)
    return service.update_cover_letter(cover_letter_id, current_user.id, data)


@router.delete("/{cover_letter_id}", status_code=204)
def delete_cover_letter(
    cover_letter_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a cover letter."""
    service = CoverLetterService(db)
    service.delete_cover_letter(cover_letter_id, current_user.id)
