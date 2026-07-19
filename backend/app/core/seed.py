import logging
import uuid
from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models.user import User
from app.models.profile import Profile
from app.models.company import Company
from app.models.job import Job

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("DatabaseSeeder")

def seed_database():
    logger.info("Initializing database schema...")
    from sqlalchemy import text
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        conn.commit()
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if default user already exists
        default_email = "admin@example.com"
        user = db.query(User).filter(User.email == default_email).first()
        if not user:
            logger.info("Creating default demo user...")
            hashed_pw = get_password_hash("adminpassword123")
            user = User(
                email=default_email,
                hashed_password=hashed_pw,
                full_name="Demo Administrator",
                is_active=True,
                is_superuser=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            # Create default profile
            profile = Profile(
                user_id=user.id,
                summary="Lead software architect focused on distributed backends, Python, and frontend React architectures.",
                skills=["React 19", "FastAPI", "TypeScript", "SQLAlchemy 2.0", "PostgreSQL", "Docker"],
                experience_years=8.5,
                desired_roles=["Staff Backend Engineer", "Lead Developer"],
                location="San Francisco, CA (Hybrid)"
            )
            db.add(profile)
            db.commit()
            logger.info("Demo user and profile created successfully.")
        else:
            logger.info("Demo user already exists, skipping user seed.")

        # Seed Companies
        stripe = db.query(Company).filter(Company.name == "Stripe").first()
        if not stripe:
            logger.info("Seeding companies and jobs...")
            stripe = Company(
                name="Stripe",
                website="https://stripe.com",
                industry="Financial Technology",
                size="5000-10000 employees",
                description="Global payments infrastructure developer APIs."
            )
            db.add(stripe)
            
            openai_co = Company(
                name="OpenAI",
                website="https://openai.com",
                industry="Artificial Intelligence",
                size="1000-5000 employees",
                description="AI research and deployment company."
            )
            db.add(openai_co)
            db.commit()
            db.refresh(stripe)
            db.refresh(openai_co)

            # Seed Jobs
            job1 = Job(
                company_id=stripe.id,
                title="Senior React Developer",
                description="Build next-generation dashboard billing platforms using React 19, TypeScript, and tailwind layouts.",
                requirements=["React", "TypeScript", "REST APIs"],
                location="San Francisco, CA",
                salary_min=160000.0,
                salary_max=210000.0,
                job_type="Full-time",
                remote=False,
                source_portal="LinkedIn",
                source_url="https://linkedin.com/jobs/stripe-react-dev",
                external_id="stripe-react-991"
            )
            db.add(job1)

            job2 = Job(
                company_id=openai_co.id,
                title="Backend Staff Engineer (Python)",
                description="Scale microservice infrastructure using FastAPI, asyncio, Redis queues, and PostgreSQL vector matching layers.",
                requirements=["FastAPI", "PostgreSQL", "Redis", "Distributed Systems"],
                location="San Francisco, CA",
                salary_min=220000.0,
                salary_max=300000.0,
                job_type="Full-time",
                remote=False,
                source_portal="Greenhouse",
                source_url="https://openai.com/careers/backend-staff",
                external_id="openai-back-332"
            )
            db.add(job2)
            db.commit()
            logger.info("Companies and jobs seeded successfully.")
        else:
            logger.info("Data already seeded, skipping.")

    except Exception as e:
        logger.error(f"Error seeding database: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
