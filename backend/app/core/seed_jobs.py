"""
Seed the database with 20 realistic job listings.
Run via: python -m app.core.seed_jobs
"""
import uuid
import sys
import os

# Allow running as: python -m app.core.seed_jobs
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import engine
from app.models.job import Job

SAMPLE_JOBS = [
    {
        "title": "Senior React Developer",
        "company_name": "Stripe",
        "location": "San Francisco, CA",
        "salary": "$160k – $210k",
        "description": "Build world-class payment UIs using React 19 and TypeScript. Work on high-traffic financial systems serving millions of merchants globally.",
        "source_url": "https://stripe.com/jobs",
        "source_portal": "LinkedIn",
        "match_score": 94,
    },
    {
        "title": "Backend Staff Engineer (Python)",
        "company_name": "OpenAI",
        "location": "San Francisco, CA",
        "salary": "$220k – $300k",
        "description": "Design and own core infrastructure powering large-scale AI APIs. Experience with FastAPI, distributed systems, and cloud architecture required.",
        "source_url": "https://openai.com/careers",
        "source_portal": "Greenhouse",
        "match_score": 91,
    },
    {
        "title": "Staff Frontend Engineer",
        "company_name": "Vercel",
        "location": "Remote (US)",
        "salary": "$180k – $230k",
        "description": "Shape developer experience at Vercel. Lead frontend architecture for the dashboard, work closely with Next.js team.",
        "source_url": "https://vercel.com/careers",
        "source_portal": "LinkedIn",
        "match_score": 89,
    },
    {
        "title": "Backend Software Engineer",
        "company_name": "Linear",
        "location": "Remote (Global)",
        "salary": "$140k – $190k",
        "description": "Build fast, delightful project management software. TypeScript Node.js backend with PostgreSQL. Small, senior team.",
        "source_url": "https://linear.app/careers",
        "source_portal": "Lever",
        "match_score": 86,
    },
    {
        "title": "Full Stack Engineer",
        "company_name": "Figma",
        "location": "New York, NY",
        "salary": "$170k – $220k",
        "description": "Work on collaborative design tools used by millions. React, TypeScript, WebSockets and C++ WebAssembly experience preferred.",
        "source_url": "https://figma.com/careers",
        "source_portal": "Greenhouse",
        "match_score": 85,
    },
    {
        "title": "Senior Software Engineer – Platform",
        "company_name": "Notion",
        "location": "Remote (US)",
        "salary": "$165k – $215k",
        "description": "Build the core platform powering Notion's 20M+ users. Work on real-time sync, block storage, and API infrastructure.",
        "source_url": "https://notion.so/careers",
        "source_portal": "LinkedIn",
        "match_score": 83,
    },
    {
        "title": "Senior Backend Engineer",
        "company_name": "Airbnb",
        "location": "San Francisco, CA",
        "salary": "$175k – $240k",
        "description": "Design and maintain the systems that power global travel experiences. Expertise in Java or Kotlin, distributed systems and high availability.",
        "source_url": "https://airbnb.com/careers",
        "source_portal": "LinkedIn",
        "match_score": 80,
    },
    {
        "title": "Frontend Engineer – Design Systems",
        "company_name": "Shopify",
        "location": "Remote (Global)",
        "salary": "$145k – $195k",
        "description": "Build and maintain Shopify's Polaris design system. React, TypeScript, Storybook, and deep accessibility knowledge required.",
        "source_url": "https://shopify.com/careers",
        "source_portal": "Greenhouse",
        "match_score": 79,
    },
    {
        "title": "Senior Machine Learning Engineer",
        "company_name": "Anthropic",
        "location": "San Francisco, CA",
        "salary": "$250k – $350k",
        "description": "Work on safety-critical ML systems powering Claude. Python, PyTorch, distributed training experience essential.",
        "source_url": "https://anthropic.com/careers",
        "source_portal": "LinkedIn",
        "match_score": 78,
    },
    {
        "title": "Platform Engineer – Kubernetes",
        "company_name": "Datadog",
        "location": "New York, NY",
        "salary": "$160k – $205k",
        "description": "Manage cloud-native infrastructure for Datadog's global monitoring platform. Kubernetes, Terraform, Go and observability expertise.",
        "source_url": "https://datadoghq.com/careers",
        "source_portal": "Lever",
        "match_score": 77,
    },
    {
        "title": "Product Engineer – Growth",
        "company_name": "Loom",
        "location": "Remote (US)",
        "salary": "$150k – $200k",
        "description": "Drive user activation and retention through data-driven product experiments. Full stack with React and Node.js.",
        "source_url": "https://loom.com/careers",
        "source_portal": "LinkedIn",
        "match_score": 75,
    },
    {
        "title": "Senior iOS Engineer",
        "company_name": "Duolingo",
        "location": "Pittsburgh, PA",
        "salary": "$155k – $210k",
        "description": "Build engaging language learning experiences for 40M+ daily active users. Swift, SwiftUI, Objective-C proficiency required.",
        "source_url": "https://duolingo.com/careers",
        "source_portal": "Greenhouse",
        "match_score": 74,
    },
    {
        "title": "Data Engineer",
        "company_name": "Instacart",
        "location": "San Francisco, CA",
        "salary": "$145k – $190k",
        "description": "Design data pipelines powering real-time grocery delivery analytics. Experience with Spark, dbt, Snowflake required.",
        "source_url": "https://instacart.com/careers",
        "source_portal": "LinkedIn",
        "match_score": 72,
    },
    {
        "title": "Senior Software Engineer – API",
        "company_name": "Twilio",
        "location": "Remote (US)",
        "salary": "$155k – $205k",
        "description": "Build and maintain scalable communication APIs used by 300k+ companies. Distributed systems, REST API design, Go or Java.",
        "source_url": "https://twilio.com/careers",
        "source_portal": "Lever",
        "match_score": 71,
    },
    {
        "title": "Software Engineer – Infrastructure",
        "company_name": "Cloudflare",
        "location": "Austin, TX",
        "salary": "$150k – $200k",
        "description": "Build systems powering Cloudflare's global edge network serving 50M+ requests/second. Go, Rust, and networking protocols.",
        "source_url": "https://cloudflare.com/careers",
        "source_portal": "Greenhouse",
        "match_score": 70,
    },
    {
        "title": "Engineering Manager – Backend",
        "company_name": "Intercom",
        "location": "Dublin, Ireland / Remote",
        "salary": "$170k – $230k",
        "description": "Lead a team of 6-8 engineers building Intercom's messaging and AI platform. Strong technical leadership and Ruby on Rails background.",
        "source_url": "https://intercom.com/careers",
        "source_portal": "LinkedIn",
        "match_score": 69,
    },
    {
        "title": "Founding Engineer",
        "company_name": "Cursor AI",
        "location": "San Francisco, CA",
        "salary": "$200k – $280k + equity",
        "description": "Join as a founding engineer to build the future of AI-native code editors. Extreme ownership, TypeScript, Electron, LSP experience.",
        "source_url": "https://cursor.so/careers",
        "source_portal": "LinkedIn",
        "match_score": 68,
    },
    {
        "title": "Senior Android Engineer",
        "company_name": "Uber",
        "location": "San Francisco, CA",
        "salary": "$165k – $225k",
        "description": "Engineer core ride and delivery features for the Uber Driver and Rider apps. Kotlin, Jetpack Compose, and large-scale Android architecture.",
        "source_url": "https://uber.com/careers",
        "source_portal": "Greenhouse",
        "match_score": 67,
    },
    {
        "title": "Software Engineer – Search",
        "company_name": "Pinterest",
        "location": "San Francisco, CA",
        "salary": "$155k – $210k",
        "description": "Build and improve Pinterest's visual search systems. Experience with Elasticsearch, ML ranking models, and large-scale data systems.",
        "source_url": "https://pinterest.com/careers",
        "source_portal": "LinkedIn",
        "match_score": 65,
    },
    {
        "title": "Software Engineer – Fintech",
        "company_name": "Brex",
        "location": "Remote (US)",
        "salary": "$150k – $200k",
        "description": "Build financial products serving fast-growing startups. Elixir, TypeScript, PostgreSQL and regulatory compliance experience a plus.",
        "source_url": "https://brex.com/careers",
        "source_portal": "Lever",
        "match_score": 63,
    },
]


def seed_jobs():
    with Session(engine) as db:
        # Idempotent: skip if jobs already exist
        count = db.execute(text("SELECT COUNT(*) FROM jobs")).scalar()
        if count and count > 0:
            print(f"[OK] Jobs table already has {count} rows. Skipping seed.")
            return

        jobs_to_insert = []
        for job_data in SAMPLE_JOBS:
            job = Job(
                id=uuid.uuid4(),
                title=job_data["title"],
                company_name=job_data["company_name"],
                location=job_data["location"],
                salary=job_data.get("salary"),
                description=job_data.get("description", ""),
                source_url=job_data.get("source_url", ""),
                source_portal=job_data.get("source_portal", "LinkedIn"),
                match_score=job_data.get("match_score", 75),
                requirements={},
            )
            jobs_to_insert.append(job)

        db.add_all(jobs_to_insert)
        db.commit()
        print(f"[OK] Seeded {len(jobs_to_insert)} job listings into the database.")


if __name__ == "__main__":
    seed_jobs()
