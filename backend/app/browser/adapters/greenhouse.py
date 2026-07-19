from typing import Optional
from app.browser.adapters.base import BasePortalAdapter
from app.browser.automation import BrowserAutomation

class GreenhouseAdapter(BasePortalAdapter):
    """Greenhouse job portal adapter filling greenhouse.io board applications."""

    def login(self, cookies: dict) -> bool:
        # Greenhouse board applications generally do not require login credentials
        return True

    def fill_and_submit(
        self,
        job_url: str,
        resume_path: str,
        cover_letter_path: Optional[str] = None,
        custom_answers: Optional[dict] = None
    ) -> bool:
        self.page.goto(job_url)
        self.page.wait_for_load_state("networkidle")
        
        # Check for CAPTCHA blockers first
        if BrowserAutomation.detect_captcha(self.page):
            raise RuntimeError("Application blocked: Captcha detected. Solve manually.")

        # Fill standard personal details
        answers = custom_answers or {}
        first_name = answers.get("first_name", "Job")
        last_name = answers.get("last_name", "Applicant")
        email = answers.get("email", "applicant@example.com")
        phone = answers.get("phone", "+1234567890")

        BrowserAutomation.human_type(self.page, "#first_name", first_name)
        BrowserAutomation.human_type(self.page, "#last_name", last_name)
        BrowserAutomation.human_type(self.page, "#email", email)
        BrowserAutomation.human_type(self.page, "#phone", phone)

        # Upload resume file
        self.page.locator("input[type='file'][id='resume_file']").set_input_files(resume_path)

        # Upload cover letter if specified
        if cover_letter_path:
            self.page.locator("input[type='file'][id='cover_letter_file']").set_input_files(cover_letter_path)

        # Handle screen questions if they exist
        if self.page.locator("#linkedin_question").count() > 0:
            linkedin_url = answers.get("linkedin_url", "https://linkedin.com/in/mock")
            BrowserAutomation.human_type(self.page, "#linkedin_question", linkedin_url)

        # Submit
        BrowserAutomation.human_click(self.page, "#submit_app")
        self.page.wait_for_load_state("networkidle")
        return "thank you" in self.page.content().lower() or "submitted" in self.page.content().lower()
