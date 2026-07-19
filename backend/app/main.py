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
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount versioned API router
app.include_router(api_router)


@app.get("/health", tags=["System"])
def health_check():
    """System liveness probe endpoint."""
    return {"status": "healthy", "service": "AI Job Copilot API", "version": "1.0.0"}
