import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.core.database import Base, get_db
from app.core.config import settings
# Force mock keys during tests to prevent external API calls and quota limit errors
settings.OPENAI_API_KEY = "mock-key"
settings.GROQ_API_KEY = "mock-key"
from app.main import app

# Use a test database name for PostgreSQL to avoid overwriting development data
TEST_DATABASE_URL = settings.DATABASE_URL.replace("job_copilot", "job_copilot_test")

connect_args = {}
if TEST_DATABASE_URL.startswith("postgresql"):
    connect_args["options"] = "-c search_path=test_schema,public"

engine = create_engine(TEST_DATABASE_URL, connect_args=connect_args)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    # Recreate the test schema to ensure absolute isolation
    if TEST_DATABASE_URL.startswith("postgresql"):
        temp_engine = create_engine(TEST_DATABASE_URL)
        with temp_engine.connect().execution_options(isolation_level="AUTOCOMMIT") as conn:
            from sqlalchemy import text
            conn.execute(text("CREATE SCHEMA IF NOT EXISTS test_schema;"))
        temp_engine.dispose()

    # Make sure test database is prepared
    # (Since pgvector is used, the pgvector extension must exist on the Postgres host)
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
            conn.commit()
    except Exception:
        # If not permissions or SQLite fallback, we pass
        pass

    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
