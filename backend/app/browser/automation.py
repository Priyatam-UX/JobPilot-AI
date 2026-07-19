import os
import time
import random
import logging
from typing import Optional, Dict, List
from playwright.sync_api import sync_playwright, Page, Browser, BrowserContext

logger = logging.getLogger("BrowserAutomation")

class BrowserAutomation:
    """Manages Playwright lifecycles, session cookies, stealth flags, and human-like typing."""
    
    def __init__(self, headless: bool = True):
        self.headless = headless
        self.playwright = None
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None

    def start(self) -> Page:
        self.playwright = sync_playwright().start()
        
        # Anti-detection arguments matching puppeteer stealth behaviors
        args = [
            "--disable-blink-features=AutomationControlled",
            "--no-sandbox",
            "--disable-infobars",
            "--window-size=1280,800",
        ]
        
        self.browser = self.playwright.chromium.launch(
            headless=self.headless,
            args=args
        )
        
        self.context = self.browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
            ignore_https_errors=True
        )
        
        # Extra script tag to mock webGL/plugins properties and bypass simple stealth scanners
        self.context.add_init_script(
            "const newProto = Navigator.prototype;"
            "delete newProto.webdriver;"
            "Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => undefined });"
        )
        
        page = self.context.new_page()
        page.set_default_timeout(30000) # 30s timeout
        return page

    def stop(self):
        if self.context:
            self.context.close()
        if self.browser:
            self.browser.close()
        if self.playwright:
            self.playwright.stop()

    def load_session(self, cookies: List[Dict]) -> None:
        """Injects saved cookies into the current context."""
        if self.context and cookies:
            self.context.add_cookies(cookies)

    def save_session(self) -> List[Dict]:
        """Extract cookies from current context for storage."""
        if self.context:
            return self.context.cookies()
        return []

    @staticmethod
    def human_type(page: Page, selector: str, text: str):
        """Type characters with randomized intervals to replicate human key presses."""
        page.wait_for_selector(selector)
        page.click(selector)
        # Select all current text in field
        page.press(selector, "Control+A")
        page.press(selector, "Backspace")
        
        for char in text:
            page.type(selector, char)
            time.sleep(random.uniform(0.05, 0.18))
        time.sleep(random.uniform(0.3, 0.6))

    @staticmethod
    def human_click(page: Page, selector: str):
        """Hover and click with minor delay buffer."""
        page.wait_for_selector(selector)
        page.hover(selector)
        time.sleep(random.uniform(0.2, 0.4))
        page.click(selector)

    @staticmethod
    def detect_captcha(page: Page) -> bool:
        """Check for active CAPTCHA elements (reCAPTCHA, hCaptcha, Cloudflare challenge pages)."""
        captcha_indicators = [
            "iframe[src*='recaptcha']",
            "iframe[src*='hcaptcha']",
            "div#cf-turnstile",
            ".g-recaptcha",
        ]
        for indicator in captcha_indicators:
            try:
                if page.locator(indicator).count() > 0:
                    logger.warning(f"CAPTCHA block detected via indicator: {indicator}")
                    return True
            except Exception:
                pass
        return False

    @staticmethod
    def capture_failure_screenshot(page: Page, filepath: str) -> None:
        """Saves a screenshot on exception to allow developer audit."""
        try:
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            page.screenshot(path=filepath, full_page=True)
            logger.info(f"Saved failure screenshot to: {filepath}")
        except Exception as e:
            logger.error(f"Failed to capture failure screenshot: {str(e)}")
