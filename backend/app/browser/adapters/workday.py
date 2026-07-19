from typing import Optional
import logging
from app.browser.adapters.base import BasePortalAdapter
from app.browser.automation import BrowserAutomation

logger = logging.getLogger("WorkdayAdapter")

class WorkdayAdapter(BasePortalAdapter):
    """Workday job portal adapter handling multi-step application wizard flows."""

    def login(self, cookies: dict) -> bool:
        # In workday, we inject session cookies if present
        if cookies:
            logger.info("Injecting Workday session cookies...")
            return True
        return False

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
            raise RuntimeError("Workday application blocked: CAPTCHA detected.")

        answers = custom_answers or {}

        # 1. Sign In or Create Account if prompted
        if self.page.locator("[data-automation-id='signin_button']").count() > 0:
            logger.info("Workday authentication screen encountered.")
            # If username/password is present in custom answers, sign in
            username = answers.get("workday_username")
            password = answers.get("workday_password")
            if username and password:
                BrowserAutomation.human_type(self.page, "[data-automation-id='username']", username)
                BrowserAutomation.human_type(self.page, "[data-automation-id='password']", password)
                BrowserAutomation.human_click(self.page, "[data-automation-id='signin_button']")
                self.page.wait_for_load_state("networkidle")
            else:
                logger.warning("Workday credentials missing. Manual verification required.")
                return False

        # 2. Upload resume
        if self.page.locator("[data-automation-id='file-upload-drop-zone']").count() > 0:
            self.page.locator("input[type='file']").set_input_files(resume_path)
            self.page.wait_for_timeout(3000)
            BrowserAutomation.human_click(self.page, "[data-automation-id='bottomNavigation-nextButton']")
            self.page.wait_for_load_state("networkidle")

        # 3. Contact Information step
        if self.page.locator("[data-automation-id='addressSection_firstName']").count() > 0:
            first_name = answers.get("first_name", "Job")
            last_name = answers.get("last_name", "Applicant")
            BrowserAutomation.human_type(self.page, "[data-automation-id='addressSection_firstName']", first_name)
            BrowserAutomation.human_type(self.page, "[data-automation-id='addressSection_lastName']", last_name)
            BrowserAutomation.human_click(self.page, "[data-automation-id='bottomNavigation-nextButton']")
            self.page.wait_for_load_state("networkidle")

        # 4. Final steps loop (Workday wizards loop next until submitButton is active)
        max_steps = 6
        for _ in range(max_steps):
            if self.page.locator("[data-automation-id='bottomNavigation-submitButton']").count() > 0:
                BrowserAutomation.human_click(self.page, "[data-automation-id='bottomNavigation-submitButton']")
                self.page.wait_for_load_state("networkidle")
                return True
            
            if self.page.locator("[data-automation-id='bottomNavigation-nextButton']").count() > 0:
                BrowserAutomation.human_click(self.page, "[data-automation-id='bottomNavigation-nextButton']")
                self.page.wait_for_load_state("networkidle")
            else:
                break

        return "submitted" in self.page.content().lower() or "confirmation" in self.page.url
