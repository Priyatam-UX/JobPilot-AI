import io
import uuid
from typing import List

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.models.resume import Resume, ResumeVersion
from app.repositories.resume_repository import ResumeRepository, ResumeVersionRepository


class ResumeService:
    """Service for resume management, upload, and text extraction."""

    def __init__(self, db: Session):
        self.resume_repo = ResumeRepository(db)
        self.version_repo = ResumeVersionRepository(db)

    def get_user_resumes(self, user_id: uuid.UUID) -> List[Resume]:
        return self.resume_repo.get_user_resumes(user_id)

    def create_resume(self, user_id: uuid.UUID, title: str) -> Resume:
        return self.resume_repo.create({"user_id": user_id, "title": title})

    def upload_resume(self, user_id: uuid.UUID, title: str, file: UploadFile) -> Resume:
        content = file.file.read()
        raw_text = self._extract_text(file.filename or "", content)
        file_path = f"resumes/{user_id}/{file.filename}"

        resume = self.resume_repo.create(
            {
                "user_id": user_id,
                "title": title,
                "raw_text": raw_text,
                "file_path": file_path,
            }
        )
        # Create initial version snapshot
        self.version_repo.create(
            {
                "resume_id": resume.id,
                "version_number": 1,
                "title": title,
                "raw_text": raw_text,
                "file_path": file_path,
                "metadata_changes": {"action": "initial_upload"},
            }
        )
        return resume

    def get_resume(self, resume_id: uuid.UUID, user_id: uuid.UUID) -> Resume:
        resume = self.resume_repo.get(resume_id)
        if not resume or resume.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found"
            )
        return resume

    def get_versions(
        self, resume_id: uuid.UUID, user_id: uuid.UUID
    ) -> List[ResumeVersion]:
        self.get_resume(resume_id, user_id)
        return self.version_repo.get_versions_for_resume(resume_id)

    def delete_resume(self, resume_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        self.get_resume(resume_id, user_id)
        return self.resume_repo.delete(resume_id)

    @staticmethod
    def _extract_text(filename: str, content: bytes) -> str:
        if filename.endswith(".pdf"):
            try:
                import pdfplumber

                with pdfplumber.open(io.BytesIO(content)) as pdf:
                    return "\n".join([page.extract_text() or "" for page in pdf.pages])
            except Exception:
                return ""
        elif filename.endswith(".docx"):
            try:
                import docx

                doc = docx.Document(io.BytesIO(content))
                return "\n".join([para.text for para in doc.paragraphs])
            except Exception:
                return ""
        return ""
