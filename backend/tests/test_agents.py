import pytest
from app.agents.resume_agent import ResumeAgent
from app.agents.cover_letter_agent import CoverLetterAgent
from app.agents.ats_agent import ATSAgent
from app.agents.job_matching_agent import JobMatchingAgent
from app.agents.interview_agent import InterviewAgent
from app.agents.career_coach_agent import CareerCoachAgent


def test_resume_agent_tailor():
    agent = ResumeAgent()
    result = agent.tailor_resume(
        raw_resume="Experienced React engineer with 4 years experience.",
        job_description="Looking for React 19 Developer with FastAPI knowledge.",
    )
    assert "Optimized Resume" in result.tailored_text
    assert len(result.added_keywords) > 0
    assert len(result.suggested_formatting_improvements) > 0


def test_cover_letter_agent():
    agent = CoverLetterAgent()
    result = agent.generate_cover_letter(
        profile_summary="Senior Dev proficient in Go and Postgres.",
        job_title="Lead Go Architect",
        company_name="Stripe",
        job_description="Scale ledger APIs using Go.",
    )
    assert "Stripe" in result.title
    assert "Lead Go Architect" in result.content
    assert len(result.matched_criteria) > 0


def test_ats_agent():
    agent = ATSAgent()
    result = agent.analyze_resume(
        resume_text="Senior React Engineer",
        job_description="FastAPI + Postgres dev",
    )
    assert result.overall_score > 0
    assert len(result.missing_keywords) > 0
    assert len(result.matched_keywords) > 0


def test_job_matching_agent():
    agent = JobMatchingAgent()
    result = agent.match_job(
        profile_summary="Frontend dev",
        profile_skills=["React", "TypeScript"],
        job_description="Staff React Architect",
    )
    assert result.match_score > 0
    assert result.estimated_salary_min > 0
    assert len(result.matched_skills) > 0


def test_interview_agent():
    agent = InterviewAgent()
    mock_loop = agent.generate_mock_interview(
        company="Apple",
        job_title="Senior Dev",
        job_description="Core frameworks",
    )
    assert len(mock_loop.questions) > 0

    feedback = agent.evaluate_response(
        question="Tell me about a bug you fixed.",
        user_answer="I identified database index locks and improved delay rate by 40%.",
    )
    assert feedback.score > 0
    assert len(feedback.suggestions) > 0


def test_career_coach_agent():
    agent = CareerCoachAgent()
    result = agent.generate_coach_report(
        profile_skills=["Go", "SQL"],
        desired_roles=["Staff Backend Engineer"],
    )
    assert len(result.skill_gaps) > 0
    assert len(result.roadmap) > 0
    assert "Roadmap" in result.roadmap[0].phase
