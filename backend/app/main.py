from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.logging import setup_logging

# Set up structured logging
setup_logging()

app = FastAPI(
    title="AI Job Copilot API",
    description=(
        "Enterprise-grade AI-powered job search, application tailoring, "
        "browser automation, and career coaching platform."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app|http://localhost:.*",
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount versioned API router
app.include_router(api_router)

import traceback
from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    tbl = traceback.format_exc()
    origin = request.headers.get("origin", "*")
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error:\n{tbl}"},
        headers={
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*"
        }
    )

# Mount static files directory for generated tailored CVs
from fastapi.staticfiles import StaticFiles
import os
os.makedirs("generated_cvs", exist_ok=True)
app.mount("/api/v1/generated_cvs", StaticFiles(directory="generated_cvs"), name="generated_cvs")


@app.on_event("startup")
async def on_startup():
    """Run DB migrations, seed data, and start background tasks on startup."""
    import logging
    logger = logging.getLogger(__name__)

    try:
        from app.core.database import engine, Base
        # Import ALL models so SQLAlchemy knows about them before create_all
        import app.models  # noqa: F401

        # Create any brand-new tables FIRST
        Base.metadata.create_all(bind=engine)
        logger.info("[OK] Database schema ready.")

        # Add new columns to existing tables safely (idempotent via try/except per column)
        from sqlalchemy import text, inspect
        with engine.connect() as conn:
            inspector = inspect(engine)
            
            # Job Table Columns
            existing_job_cols = [c["name"] for c in inspector.get_columns("jobs")]
            new_job_cols = {
                "company_name": "VARCHAR(255)",
                "salary": "VARCHAR(255)",
                "match_score": "INTEGER",
            }
            for col_name, col_type in new_job_cols.items():
                if col_name not in existing_job_cols:
                    try:
                        conn.execute(text(f"ALTER TABLE jobs ADD COLUMN {col_name} {col_type}"))
                        conn.commit()
                        logger.info(f"[OK] Added column jobs.{col_name}")
                    except Exception as e:
                        conn.rollback()
                        logger.warning(f"[WARN] Could not add column jobs.{col_name}: {e}")
            
            # Resume Table Columns (Missing AI & ATS Fields)
            existing_resume_cols = [c["name"] for c in inspector.get_columns("resumes")]
            new_resume_cols = {
                "experience_years": "FLOAT",
                "all_skills_flat": "JSON",
                "ats_score": "FLOAT",
                "ats_grade": "VARCHAR(10)",
                "ats_suggestions": "JSON",
            }
            for col_name, col_type in new_resume_cols.items():
                if col_name not in existing_resume_cols:
                    try:
                        conn.execute(text(f"ALTER TABLE resumes ADD COLUMN {col_name} {col_type}"))
                        conn.commit()
                        logger.info(f"[OK] Added column resumes.{col_name}")
                    except Exception as e:
                        conn.rollback()
                        logger.warning(f"[WARN] Could not add column resumes.{col_name}: {e}")

    except Exception as e:
        logger.error(f"[ERROR] DB startup error: {e}")

    # Auto-seed jobs if table is empty
    try:
        from app.core.seed_jobs import seed_jobs
        seed_jobs()
    except Exception as e:
        logger.warning(f"[WARN] Job seed skipped: {e}")

    # Kick off background job ingestion
    import asyncio
    from app.core.database import SessionLocal
    from app.tasks.job_scraper_tasks import run_job_ingestion

    db = SessionLocal()
    asyncio.create_task(run_job_ingestion(db, limit=20))


@app.get("/health", tags=["System"])
def health_check():
    """System liveness probe endpoint."""
    return {"status": "healthy", "service": "AI Job Copilot API", "version": "1.0.0"}
