import os
import openai
import instructor
from app.core.config import settings

def get_instructor_client():
    """Returns a client wrapped with Instructor for structured data extraction."""
    # If the key is a mock, we use a dummy client that will be bypassed in mock mode
    api_key = settings.OPENAI_API_KEY
    if api_key == "mock-key" or not api_key:
        # Dummy mock key for local compilation/testing
        return instructor.patch(openai.OpenAI(api_key="sk-mockkeyvalue"))
    return instructor.patch(openai.OpenAI(api_key=api_key))

class BaseAgent:
    """Base AI Agent setting up OpenAI and Instructor connections."""
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.is_mock = self.api_key == "mock-key" or not self.api_key
        self.client = get_instructor_client()
        # Default model
        self.model = "gpt-4o-mini"  # Or standard gpt-4o
