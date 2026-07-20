"""
ATS (Applicant Tracking System) Scoring Service.
Computes keyword match scores, missing skills, section completeness,
formatting quality, and actionable improvement suggestions.
No external AI API required.
"""
import re
from typing import Dict, List, Any, Tuple
from app.services.skill_extractor import extract_skills, detect_sections, count_words, ALL_SKILLS


# ─────────────────────────────────────────────
# ATS penalty / bonus rules
# ─────────────────────────────────────────────
REQUIRED_SECTIONS = ["experience", "education", "skills"]
OPTIONAL_SECTIONS = ["summary", "projects", "certifications", "achievements"]

IDEAL_WORD_COUNT_MIN = 400
IDEAL_WORD_COUNT_MAX = 800

# Power action verbs for bullet points
ACTION_VERBS = [
    "achieved", "accelerated", "architected", "automated", "built", "collaborated",
    "created", "delivered", "deployed", "designed", "developed", "drove", "enabled",
    "engineered", "established", "executed", "generated", "grew", "implemented",
    "improved", "increased", "launched", "led", "managed", "mentored", "migrated",
    "optimized", "owned", "reduced", "refactored", "resolved", "scaled", "shipped",
    "streamlined", "transformed", "upgraded",
]

# Red flags in resumes
RED_FLAGS = [
    r"\bresponsible for\b",
    r"\bhelped\b",
    r"\bworked on\b",
    r"\bassisted\b",
    r"\bduties included\b",
    r"\btried to\b",
]

# Quantification patterns (shows impact with numbers)
QUANTIFICATION_PATTERN = re.compile(
    r"\b(\d+[\.,]?\d*)\s*(%|x|times?|users?|customers?|clients?|k\b|\$|million|billion|ms|seconds?|hours?|days?|weeks?|months?)",
    re.IGNORECASE
)


def extract_keywords_from_jd(job_description: str) -> List[str]:
    """Extract skill keywords from a job description."""
    if not job_description:
        return []

    jd_lower = job_description.lower()
    found_skills = []

    for skill_lower, (skill_original, _) in ALL_SKILLS.items():
        pattern = r"\b" + re.escape(skill_lower) + r"\b"
        if re.search(pattern, jd_lower):
            found_skills.append(skill_original)

    # Also extract words that appear to be technical requirements
    requirement_pattern = re.compile(
        r"(?:required?|must\s+have|experience\s+(?:with|in)|proficient\s+in|knowledge\s+of)\s+([A-Za-z][A-Za-z0-9\s\+\#\.]{2,30}?)(?:[,\.\n]|$)",
        re.IGNORECASE
    )
    for match in requirement_pattern.finditer(job_description):
        term = match.group(1).strip()
        if term and term not in found_skills:
            found_skills.append(term)

    return list(set(found_skills))


def score_keyword_match(resume_text: str, job_description: str) -> Tuple[float, List[str], List[str]]:
    """
    Calculate keyword match score between resume and job description.
    Returns (score_0_to_100, matched_keywords, missing_keywords).
    """
    if not resume_text or not job_description:
        return 0.0, [], []

    jd_keywords = extract_keywords_from_jd(job_description)
    if not jd_keywords:
        return 75.0, [], []  # Can't score without JD keywords

    resume_lower = resume_text.lower()
    matched = []
    missing = []

    for kw in jd_keywords:
        pattern = r"\b" + re.escape(kw.lower()) + r"\b"
        if re.search(pattern, resume_lower):
            matched.append(kw)
        else:
            missing.append(kw)

    score = (len(matched) / len(jd_keywords)) * 100 if jd_keywords else 75.0
    return round(score, 1), matched, missing


def score_sections(sections: Dict[str, bool]) -> Tuple[float, List[str]]:
    """Score section completeness and return missing critical sections."""
    score = 0.0
    missing = []

    # Required sections worth 60 points
    per_required = 60.0 / len(REQUIRED_SECTIONS) if REQUIRED_SECTIONS else 0
    for section in REQUIRED_SECTIONS:
        if sections.get(section):
            score += per_required
        else:
            missing.append(section.capitalize())

    # Optional sections worth 40 points
    per_optional = 40.0 / len(OPTIONAL_SECTIONS) if OPTIONAL_SECTIONS else 0
    for section in OPTIONAL_SECTIONS:
        if sections.get(section):
            score += per_optional

    return round(score, 1), missing


def score_word_count(word_count: int) -> float:
    """Score based on resume word count (ideal: 400-800 words)."""
    if word_count < 100:
        return 10.0
    elif word_count < IDEAL_WORD_COUNT_MIN:
        return 50.0 + (word_count / IDEAL_WORD_COUNT_MIN) * 30
    elif word_count <= IDEAL_WORD_COUNT_MAX:
        return 100.0
    elif word_count <= 1200:
        return 80.0
    else:
        return 60.0  # Too long


def score_action_verbs(text: str) -> Tuple[float, int]:
    """Score how well the resume uses strong action verbs."""
    text_lower = text.lower()
    count = sum(1 for verb in ACTION_VERBS if re.search(r"\b" + verb + r"\b", text_lower))
    score = min(100.0, (count / 8) * 100)  # 8+ action verbs = perfect score
    return round(score, 1), count


def score_quantification(text: str) -> Tuple[float, int]:
    """Score how well the resume quantifies impact with numbers."""
    matches = QUANTIFICATION_PATTERN.findall(text)
    count = len(matches)
    score = min(100.0, (count / 5) * 100)  # 5+ quantified achievements = perfect
    return round(score, 1), count


def detect_red_flags(text: str) -> List[str]:
    """Detect passive/weak language patterns in resume."""
    text_lower = text.lower()
    found = []
    for pattern in RED_FLAGS:
        if re.search(pattern, text_lower):
            found.append(re.sub(r"\\b", "", pattern.replace(r"\b", "")).strip())
    return found


def generate_suggestions(
    sections: Dict[str, bool],
    word_count: int,
    action_verb_count: int,
    quantification_count: int,
    missing_keywords: List[str],
    red_flags: List[str],
    missing_sections: List[str],
) -> List[str]:
    """Generate actionable ATS improvement suggestions."""
    suggestions = []

    # Section suggestions
    if missing_sections:
        suggestions.append(
            f"Add missing sections: {', '.join(missing_sections)}. ATS systems heavily weight structured sections."
        )

    # Word count suggestions
    if word_count < 400:
        suggestions.append(
            f"Your resume has {word_count} words. Expand to 400–700 words to give ATS systems enough content to parse."
        )
    elif word_count > 900:
        suggestions.append(
            f"Your resume has {word_count} words. Consider trimming to under 800 words for better readability."
        )

    # Action verbs
    if action_verb_count < 5:
        suggestions.append(
            "Use more strong action verbs (e.g., 'architected', 'optimized', 'scaled', 'delivered') to start bullet points."
        )

    # Quantification
    if quantification_count < 3:
        suggestions.append(
            "Add quantified achievements (e.g., 'reduced latency by 40%', 'grew user base by 2x'). Numbers strongly improve ATS ranking."
        )

    # Red flags
    if red_flags:
        suggestions.append(
            f"Replace weak phrases like '{red_flags[0]}' with strong action verbs that demonstrate ownership."
        )

    # Missing keywords
    if missing_keywords:
        top_missing = missing_keywords[:5]
        suggestions.append(
            f"Add these keywords from the job description: {', '.join(top_missing)}."
        )

    # Skills section
    if not sections.get("skills"):
        suggestions.append(
            "Add a dedicated 'Skills' section. Many ATS systems specifically parse this section for keyword matching."
        )

    # Summary
    if not sections.get("summary"):
        suggestions.append(
            "Add a professional summary at the top. A 2-3 sentence summary with key skills boosts ATS scores by ~15%."
        )

    return suggestions[:8]  # Return top 8 suggestions


def compute_ats_score(
    resume_text: str,
    job_description: str = "",
) -> Dict[str, Any]:
    """
    Compute a comprehensive ATS score for a resume against an optional job description.
    Returns a full analysis report.
    """
    from app.services.ai_extractor import extract_resume_data_with_ai

    analysis = extract_resume_data_with_ai(resume_text)
    sections = analysis["sections"]
    word_count = analysis["word_count"]

    # Score individual components
    section_score, missing_sections = score_sections(sections)
    word_score = score_word_count(word_count)
    action_score, action_count = score_action_verbs(resume_text)
    quant_score, quant_count = score_quantification(resume_text)
    red_flags = detect_red_flags(resume_text)

    # Keyword match against JD
    keyword_score = 75.0
    matched_keywords: List[str] = []
    missing_keywords: List[str] = []

    if job_description:
        keyword_score, matched_keywords, missing_keywords = score_keyword_match(
            resume_text, job_description
        )

    # Weighted composite score
    if job_description:
        composite = (
            keyword_score * 0.40 +
            section_score * 0.25 +
            action_score * 0.15 +
            quant_score * 0.12 +
            word_score * 0.08
        )
    else:
        composite = (
            section_score * 0.40 +
            action_score * 0.25 +
            quant_score * 0.20 +
            word_score * 0.15
        )

    composite = round(min(composite, 100.0), 1)

    # Grade
    if composite >= 85:
        grade = "A"
    elif composite >= 70:
        grade = "B"
    elif composite >= 55:
        grade = "C"
    elif composite >= 40:
        grade = "D"
    else:
        grade = "F"

    suggestions = generate_suggestions(
        sections, word_count, action_count, quant_count,
        missing_keywords, red_flags, missing_sections
    )

    return {
        "overall_score": composite,
        "grade": grade,
        "keyword_match_score": round(keyword_score, 1),
        "section_score": round(section_score, 1),
        "action_verb_score": round(action_score, 1),
        "quantification_score": round(quant_score, 1),
        "word_count": word_count,
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords[:15],  # Top 15 missing
        "detected_sections": sections,
        "missing_sections": missing_sections,
        "red_flags": red_flags,
        "skills_found": analysis["all_skills_flat"],
        "suggestions": suggestions,
    }
