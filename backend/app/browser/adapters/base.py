import abc
from typing import Optional
from playwright.sync_api import Page

class BasePortalAdapter(abc.ABC):
    """Abstract base class for all portal job-apply adapters."""
    
    def __init__(self, page: Page):
        self.page = page

    @abc.abstractmethod
    def login(self, cookies: dict) -> bool:
        """Inject cookies and verify authentication state."""
        pass

    @abc.abstractmethod
    def fill_and_submit(
        self,
        job_url: str,
        resume_path: str,
        cover_letter_path: Optional[str] = None,
        custom_answers: Optional[dict] = None
    ) -> bool:
        """Navigate to application, fill forms, upload files, and submit."""
        pass
