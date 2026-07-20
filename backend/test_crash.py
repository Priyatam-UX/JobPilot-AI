import asyncio
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import get_db, engine, Base
from app.models.user import User
from app.models.resume import Resume
from app.core.security import create_access_token

Base.metadata.create_all(bind=engine)

def test_automate_endpoint():
    with TestClient(app) as client:
        db = next(get_db())
        
        # Create test user
        user = db.query(User).filter(User.email == "test_crash@example.com").first()
        if not user:
            user = User(email="test_crash@example.com", hashed_password="fake", full_name="Test User")
            db.add(user)
            db.commit()
            db.refresh(user)
            
        # Create test resume
        resume = db.query(Resume).filter(Resume.user_id == user.id).first()
        if not resume:
            resume = Resume(
                user_id=user.id,
                file_path="mock/path.pdf",
                raw_text="Mock resume content with Python and React skills."
            )
            db.add(resume)
            db.commit()
            db.refresh(resume)
            
        # Get token
        token = create_access_token(user.id)
        
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "job_id": "test-job-123",
            "job_url": "https://example.com/job",
            "job_description": "We need a Python and React developer."
        }
        
        print("Sending request to /api/v1/applications/automate...")
        response = client.post("/api/v1/applications/automate", json=payload, headers=headers)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")

if __name__ == "__main__":
    test_automate_endpoint()
