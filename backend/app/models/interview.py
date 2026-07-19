import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    job_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("jobs.id", ondelete="CASCADE"), nullable=True
    )
    # behavioral, technical, hr
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    question: Mapped[str] = mapped_column(Text, nullable=False)
    sample_answer: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    star_situation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    star_task: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    star_action: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    star_result: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    # easy, medium, hard
    difficulty: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # Relationships
    job = relationship("Job", back_populates="interview_questions")
