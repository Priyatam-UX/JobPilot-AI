import pytest
from unittest.mock import MagicMock
from app.browser.automation import BrowserAutomation
from app.browser.adapters.greenhouse import GreenhouseAdapter
from app.browser.adapters.lever import LeverAdapter
from app.browser.adapters.workday import WorkdayAdapter
from app.browser.adapters.linkedin import LinkedInAdapter
from app.tasks.auto_apply import run_auto_apply


def test_browser_automation_initialization():
    driver = BrowserAutomation(headless=True)
    assert driver.headless is True
    assert driver.browser is None
    assert driver.context is None


def test_adapters_instantiation():
    mock_page = MagicMock()
    
    greenhouse = GreenhouseAdapter(mock_page)
    assert greenhouse.login({}) is True
    
    lever = LeverAdapter(mock_page)
    assert lever.login({}) is True
    
    workday = WorkdayAdapter(mock_page)
    assert workday.login({}) is True
    
    linkedin = LinkedInAdapter(mock_page)
    assert linkedin.login({}) is True


def test_celery_task_signature():
    assert run_auto_apply.name == "app.tasks.auto_apply.run_auto_apply"
