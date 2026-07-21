import logging
import asyncio
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.job import Job
from app.services.discovery_service import fetch_jobs_from_api
from app.services.embedding_service import get_embeddings
import httpx
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

async def run_job_ingestion(db: Session, limit: int = 20, search_query: str = ""):
    """
    Background task to fetch live jobs from Jobicy API, 
    generate OpenAI embeddings for them, and save them to the database.
    """
    logger.info(f"Starting background job ingestion... (query: {search_query})")
    
    try:
        # 1. Fetch live jobs
        jobs_data = await fetch_jobs_from_api(limit=limit, search_query=search_query)
        if not jobs_data:
            logger.warning("No jobs fetched from API.")
            return

        # Filter out jobs already in DB (by title + company) to avoid unnecessary embedding cost
        new_jobs = []
        for jd in jobs_data:
            existing = db.query(Job).filter(
                Job.title == jd["title"], 
                Job.company_name == jd["company_name"]
            ).first()
            if not existing:
                new_jobs.append(jd)
                
        if not new_jobs:
            logger.info("No new jobs to ingest.")
            return
            
        logger.info(f"Ingesting {len(new_jobs)} new jobs and generating embeddings...")

        # 2. Prepare texts for embedding
        # We embed title + description + skills for maximum semantic meaning
        texts_to_embed = []
        for jd in new_jobs:
            text = f"Title: {jd['title']}. Location: {jd['location']}. Description: {jd['description']}"
            # Truncate if too long to prevent token limits
            texts_to_embed.append(text[:6000])

        # 3. Generate Embeddings in batch
        embeddings = get_embeddings(texts_to_embed)

        # 4. Save to DB
        for jd, emb in zip(new_jobs, embeddings):
            job = Job(
                title=jd["title"],
                company_name=jd["company_name"],
                location=jd["location"],
                salary=jd["salary"],
                description=jd["description"],
                source_url=jd["url"],
                source_portal=jd["source_portal"],
                embedding=emb,
                status="active"
            )
            db.add(job)
        
        db.commit()
        logger.info(f"Successfully ingested and embedded {len(new_jobs)} jobs.")
    except Exception as e:
        logger.error(f"Error during job ingestion: {e}")
        db.rollback()
