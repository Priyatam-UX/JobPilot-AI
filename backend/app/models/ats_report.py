import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, DateTime, Float, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class ATSReport(Base):
    __tablename__ = "ats_reports"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    resume_version_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("resume_versions.id", ondelete="CASCADE"), nullable=False
    )
    job_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("jobs.id", ondelete="SET NULL"), nullable=True
    )
    overall_score: Mapped[float] = mapped_column(Float, nullable=False)
    keyword_score: Mapped[float] = mapped_column(Float, nullable=False)
    format_score: Mapped[float] = mapped_column(Float, nullable=False)
    missing_keywords: Mapped[dict] = mapped_column(JSON, default=list, nullable=False)
    matched_keywords: Mapped[dict] = mapped_column(JSON, default=list, nullable=False)
    formatting_issues: Mapped[dict] = mapped_column(JSON, default=list, nullable=False)
    suggestions: Mapped[dict] = mapped_column(JSON, default=list, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # Relationships
    resume_version = relationship("ResumeVersion", back_populates="ats_reports")
