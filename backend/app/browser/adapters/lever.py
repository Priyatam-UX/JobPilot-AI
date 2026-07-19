from typing import Optional
from app.browser.adapters.base import BasePortalAdapter
from app.browser.automation import BrowserAutomation

class LeverAdapter(BasePortalAdapter):
    """Lever job portal adapter filling jobs.lever.co board applications."""

    def login(self, cookies: dict) -> bool:
        # Lever board applications generally do not require login credentials
        return True

    def fill_and_submit(
        self,
        job_url: str,
        resume_path: str,
        cover_letter_path: Optional[str] = None,
        custom_answers: Optional[dict] = None
    ) -> bool:
        # Navigate directly to the application form page
        form_url = job_url.rstrip("/") + "/apply" if not job_url.endswith("/apply") else job_url
        self.page.goto(form_url)
        self.page.wait_for_load_state("networkidle")
        
        # Check for CAPTCHA blockers first
        if BrowserAutomation.detect_captcha(self.page):
            raise RuntimeError("Application blocked: Captcha detected. Solve manually.")

        # Upload resume first as Lever auto-fills fields from it
        self.page.locator("input[type='file'][name='resume']").set_input_files(resume_path)
        self.page.wait_for_timeout(2000) # Give parser moment to complete auto-fill

        answers = custom_answers or {}
        full_name = answers.get("full_name", "Job Applicant")
        email = answers.get("email", "applicant@example.com")
        phone = answers.get("phone", "+1234567890")

        # Fill text inputs
        BrowserAutomation.human_type(self.page, "input[name='name']", full_name)
        BrowserAutomation.human_type(self.page, "input[name='email']", email)
        BrowserAutomation.human_type(self.page, "input[name='phone']", phone)

        # Upload cover letter if specified
        if cover_letter_path and self.page.locator("input[type='file'][name='cover_letter']").count() > 0:
            self.page.locator("input[type='file'][name='cover_letter']").set_input_files(cover_letter_path)

        # Submit
        BrowserAutomation.human_click(self.page, "button[id='btn-submit']")
        self.page.wait_for_load_state("networkidle")
        return "success" in self.page.url or "thank you" in self.page.content().lower()
