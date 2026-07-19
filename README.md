# AI Job Copilot

An enterprise-grade, production-ready AI-powered Job Copilot that automates job discovery, description scraping, resume tailoring, cover letter generation, ATS score analysis, job tracking, and auto-applying via Playwright.

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite, TailwindCSS, ShadCN UI, Zustand, TanStack Query, React Router.
- **Backend:** FastAPI, SQLAlchemy 2.0, PostgreSQL (with pgvector), Alembic, Redis, Celery.
- **AI:** OpenAI GPT series, LangGraph, Instructor, Pydantic.
- **Automation:** Playwright (Chromium, anti-detection, session/cookie storage).
- **DevOps:** Docker, Docker Compose, GitHub Actions.

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (v20+)
- Python (v3.11+)

### Development Setup

1. Clone the repository and navigate into it.
2. Set up environment variables in a `.env` file at the root.
3. Start dependencies and services:
   ```bash
   docker-compose up --build
   ```
4. Verify backend endpoints at `http://localhost:8000/docs`.
5. Verify frontend at `http://localhost:5173`.
