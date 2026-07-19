from typing import Optional
from app.browser.adapters.base import BasePortalAdapter
from app.browser.automation import BrowserAutomation

class SmartRecruitersAdapter(BasePortalAdapter):
    """SmartRecruiters job portal adapter."""

    def login(self, cookies: dict) -> bool:
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
        if BrowserAutomation.detect_captcha(self.page):
            raise RuntimeError("SmartRecruiters application blocked: CAPTCHA detected.")

        # Fill details
        answers = custom_answers or {}
        first_name = answers.get("first_name", "Job")
        last_name = answers.get("last_name", "Applicant")
        email = answers.get("email", "applicant@example.com")

        BrowserAutomation.human_type(self.page, "input[name='firstName']", first_name)
        BrowserAutomation.human_type(self.page, "input[name='lastName']", last_name)
        BrowserAutomation.human_type(self.page, "input[name='email']", email)

        # File upload
        self.page.locator("input[type='file']").set_input_files(resume_path)

        # Submit
        BrowserAutomation.human_click(self.page, "button[type='submit']")
        self.page.wait_for_load_state("networkidle")
        return "success" in self.page.url or "thank you" in self.page.content().lower()


class AshbyAdapter(BasePortalAdapter):
    """Ashby job portal adapter."""

    def login(self, cookies: dict) -> bool:
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
        if BrowserAutomation.detect_captcha(self.page):
            raise RuntimeError("Ashby application blocked: CAPTCHA detected.")

        answers = custom_answers or {}
        first_name = answers.get("first_name", "Job")
        last_name = answers.get("last_name", "Applicant")
        email = answers.get("email", "applicant@example.com")

        BrowserAutomation.human_type(self.page, "input[name='first_name']", first_name)
        BrowserAutomation.human_type(self.page, "input[name='last_name']", last_name)
        BrowserAutomation.human_type(self.page, "input[name='email']", email)

        self.page.locator("input[type='file']").set_input_files(resume_path)

        BrowserAutomation.human_click(self.page, "button[type='submit']")
        self.page.wait_for_load_state("networkidle")
        return "success" in self.page.url or "submitted" in self.page.content().lower()


class WellfoundAdapter(BasePortalAdapter):
    """Wellfound (formerly AngelList) job portal adapter."""

    def login(self, cookies: dict) -> bool:
        if cookies:
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
        if BrowserAutomation.detect_captcha(self.page):
            raise RuntimeError("Wellfound application blocked: CAPTCHA detected.")

        # Clicks matching apply button
        apply_btn = "button.wellfound-apply-button"
        if self.page.locator(apply_btn).count() > 0:
            BrowserAutomation.human_click(self.page, apply_btn)
            self.page.wait_for_load_state("networkidle")
            # Complete details and submit
            submit_btn = "button[type='submit']"
            if self.page.locator(submit_btn).count() > 0:
                BrowserAutomation.human_click(self.page, submit_btn)
                return True
        return False


class YCJobsAdapter(BasePortalAdapter):
    """Work at a Startup / YC Jobs portal adapter."""

    def login(self, cookies: dict) -> bool:
        if cookies:
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
        if BrowserAutomation.detect_captcha(self.page):
            raise RuntimeError("YC Jobs application blocked: CAPTCHA detected.")

        apply_btn = "a[href*='/apply'], button.apply-btn"
        if self.page.locator(apply_btn).count() > 0:
            BrowserAutomation.human_click(self.page, apply_btn)
            self.page.wait_for_load_state("networkidle")
            submit_btn = "input[type='submit'], button[type='submit']"
            if self.page.locator(submit_btn).count() > 0:
                BrowserAutomation.human_click(self.page, submit_btn)
                return True
        return False


class NaukriAdapter(BasePortalAdapter):
    """Naukri job portal adapter."""

    def login(self, cookies: dict) -> bool:
        if cookies:
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
        if BrowserAutomation.detect_captcha(self.page):
            raise RuntimeError("Naukri application blocked: CAPTCHA detected.")

        apply_btn = "button.apply-button"
        if self.page.locator(apply_btn).count() > 0:
            BrowserAutomation.human_click(self.page, apply_btn)
            self.page.wait_for_load_state("networkidle")
            return True
        return False


class IndeedAdapter(BasePortalAdapter):
    """Indeed job portal adapter."""

    def login(self, cookies: dict) -> bool:
        if cookies:
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
        if BrowserAutomation.detect_captcha(self.page):
            raise RuntimeError("Indeed application blocked: CAPTCHA detected.")

        apply_btn = "button.indeed-apply-button"
        if self.page.locator(apply_btn).count() > 0:
            BrowserAutomation.human_click(self.page, apply_btn)
            self.page.wait_for_load_state("networkidle")
            return True
        return False


class RemoteOKAdapter(BasePortalAdapter):
    """RemoteOK job portal adapter."""

    def login(self, cookies: dict) -> bool:
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
        if BrowserAutomation.detect_captcha(self.page):
            raise RuntimeError("RemoteOK application blocked: CAPTCHA detected.")

        # RemoteOK generally redirects directly to company application url or Greenhouse/Lever
        logger.info(f"Navigated to RemoteOK job redirect. Target page url: {self.page.url}")
        return True
