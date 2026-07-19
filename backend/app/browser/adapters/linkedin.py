import logging
from typing import Optional
from app.browser.adapters.base import BasePortalAdapter
from app.browser.automation import BrowserAutomation

logger = logging.getLogger("LinkedInAdapter")

class LinkedInAdapter(BasePortalAdapter):
    """LinkedIn job portal adapter utilizing cookies to perform 'Easy Apply' sequences."""

    def login(self, cookies: dict) -> bool:
        if not cookies:
            logger.warning("LinkedIn login failed: no cookies provided.")
            return False
        # Inject cookies
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
            raise RuntimeError("LinkedIn application blocked: CAPTCHA detected.")

        easy_apply_selector = "button.jobs-apply-button"
        if self.page.locator(easy_apply_selector).count() == 0:
            logger.warning("LinkedIn 'Easy Apply' button not found on this job URL.")
            return False

        # Click Easy Apply
        BrowserAutomation.human_click(self.page, easy_apply_selector)
        self.page.wait_for_load_state("networkidle")

        # Multi-page wizard loop
        max_steps = 10
        for _ in range(max_steps):
            # Check for next page button
            next_button = "button[aria-label*='next'], button[aria-label*='Next']"
            submit_button = "button[aria-label*='Submit'], button[aria-label*='submit']"

            if self.page.locator(submit_button).count() > 0:
                BrowserAutomation.human_click(self.page, submit_button)
                self.page.wait_for_load_state("networkidle")
                return True

            if self.page.locator(next_button).count() > 0:
                # Handle resume upload if visible on this page
                resume_upload = "input[type='file'][id*='resume']"
                if self.page.locator(resume_upload).count() > 0:
                    self.page.locator(resume_upload).set_input_files(resume_path)
                
                BrowserAutomation.human_click(self.page, next_button)
                self.page.wait_for_load_state("networkidle")
            else:
                break

        return "application submitted" in self.page.content().lower()
