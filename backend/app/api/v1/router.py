from fastapi import APIRouter

from app.api.v1.endpoints import auth, resumes, applications, jobs, cover_letters, dashboard, interview, coach

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(resumes.router)
api_router.include_router(applications.router)
api_router.include_router(jobs.router)
api_router.include_router(cover_letters.router)
api_router.include_router(dashboard.router)
api_router.include_router(interview.router)
api_router.include_router(coach.router)
