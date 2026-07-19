import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.job import Job
from app.repositories.base import BaseRepository


class JobRepository(BaseRepository[Job]):
    """Repository for Job model with full-text and semantic search support."""

    def __init__(self, db: Session):
        super().__init__(Job, db)

    def search_by_title(self, query: str, skip: int = 0, limit: int = 50) -> List[Job]:
        return (
            self.db.query(Job)
            .filter(Job.title.ilike(f"%{query}%"))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_portal_and_external_id(
        self, portal: str, external_id: str
    ) -> Optional[Job]:
        return (
            self.db.query(Job)
            .filter(Job.source_portal == portal, Job.external_id == external_id)
            .first()
        )

    def semantic_search(self, embedding: list, limit: int = 20) -> List[Job]:
        """Find semantically similar jobs using pgvector cosine distance."""
        return (
            self.db.query(Job)
            .filter(Job.embedding.isnot(None))
            .order_by(Job.embedding.cosine_distance(embedding))
            .limit(limit)
            .all()
        )
