"""
Interview Service — curated question bank, STAR analysis, and feedback.
No external AI API required.
"""
import re
from typing import Dict, List, Any, Optional

# ─────────────────────────────────────────────
# Interview Question Bank
# ─────────────────────────────────────────────
QUESTION_BANK: List[Dict[str, Any]] = [
    # BEHAVIORAL
    {"id": "b1", "category": "behavioral", "difficulty": "medium", "tags": ["conflict", "teamwork"],
     "question": "Tell me about a time you had a significant conflict with a team member. How did you resolve it?"},
    {"id": "b2", "category": "behavioral", "difficulty": "medium", "tags": ["failure", "learning"],
     "question": "Describe a project you failed at. What did you learn and what would you do differently?"},
    {"id": "b3", "category": "behavioral", "difficulty": "medium", "tags": ["leadership", "influence"],
     "question": "Tell me about a time you had to influence a decision without having direct authority."},
    {"id": "b4", "category": "behavioral", "difficulty": "easy", "tags": ["pressure", "deadline"],
     "question": "Describe a situation where you had to deliver a major project under extreme time pressure."},
    {"id": "b5", "category": "behavioral", "difficulty": "medium", "tags": ["ambiguity", "decision"],
     "question": "Tell me about a time you had to make a critical decision with incomplete information."},
    {"id": "b6", "category": "behavioral", "difficulty": "hard", "tags": ["leadership", "mentoring"],
     "question": "Describe a situation where you mentored a struggling team member. What was your approach and the outcome?"},
    {"id": "b7", "category": "behavioral", "difficulty": "medium", "tags": ["stakeholders", "communication"],
     "question": "Tell me about a time you had to communicate complex technical concepts to non-technical stakeholders."},
    {"id": "b8", "category": "behavioral", "difficulty": "hard", "tags": ["ownership", "initiative"],
     "question": "Give an example of a time you identified a significant problem that wasn't in your job description and drove a solution."},
    {"id": "b9", "category": "behavioral", "difficulty": "easy", "tags": ["collaboration", "cross-functional"],
     "question": "Describe a successful cross-functional collaboration. What made it work?"},
    {"id": "b10", "category": "behavioral", "difficulty": "hard", "tags": ["strategy", "impact"],
     "question": "Tell me about the most impactful thing you've ever built or shipped. How did you measure its success?"},

    # TECHNICAL
    {"id": "t1", "category": "technical", "difficulty": "hard", "tags": ["system design", "scalability"],
     "question": "How would you design a URL shortener like bit.ly that handles 100 million URLs and 10 billion reads per day?"},
    {"id": "t2", "category": "technical", "difficulty": "hard", "tags": ["distributed systems", "consistency"],
     "question": "Explain the CAP theorem and give a real-world example of how you'd make a trade-off in a distributed database."},
    {"id": "t3", "category": "technical", "difficulty": "medium", "tags": ["database", "optimization"],
     "question": "Walk me through how you would identify and resolve a slow database query in a production system under load."},
    {"id": "t4", "category": "technical", "difficulty": "hard", "tags": ["architecture", "microservices"],
     "question": "How would you decompose a monolithic e-commerce application into microservices? What challenges would you anticipate?"},
    {"id": "t5", "category": "technical", "difficulty": "medium", "tags": ["api design", "rest"],
     "question": "Design a RESTful API for a real-time chat application. Cover authentication, message delivery, and read receipts."},
    {"id": "t6", "category": "technical", "difficulty": "hard", "tags": ["caching", "performance"],
     "question": "Explain different caching strategies (write-through, write-back, cache-aside) and when you'd use each."},
    {"id": "t7", "category": "technical", "difficulty": "medium", "tags": ["security", "auth"],
     "question": "How would you implement a secure authentication system? Cover JWT, refresh tokens, and common attack vectors."},
    {"id": "t8", "category": "technical", "difficulty": "hard", "tags": ["rate limiting", "system design"],
     "question": "Design a rate limiter that works across multiple distributed API servers. What algorithm would you use?"},
    {"id": "t9", "category": "technical", "difficulty": "medium", "tags": ["debugging", "production"],
     "question": "Walk me through how you would debug a memory leak in a production Node.js/Python service."},
    {"id": "t10", "category": "technical", "difficulty": "medium", "tags": ["data structures", "algorithms"],
     "question": "Explain how a hash table works internally, including collision resolution strategies."},
    {"id": "t11", "category": "technical", "difficulty": "hard", "tags": ["concurrency", "threading"],
     "question": "Explain the difference between parallelism and concurrency. How do you handle race conditions in a multi-threaded service?"},
    {"id": "t12", "category": "technical", "difficulty": "medium", "tags": ["ci/cd", "devops"],
     "question": "Walk me through an ideal CI/CD pipeline for a microservices application deployed to Kubernetes."},

    # HR
    {"id": "h1", "category": "hr", "difficulty": "easy", "tags": ["motivation", "culture"],
     "question": "Why do you want to work at this company specifically? What excites you most about this role?"},
    {"id": "h2", "category": "hr", "difficulty": "easy", "tags": ["growth", "goals"],
     "question": "Where do you see yourself professionally in 3-5 years? How does this role fit into that vision?"},
    {"id": "h3", "category": "hr", "difficulty": "medium", "tags": ["weakness", "self-awareness"],
     "question": "What's your most significant professional weakness, and what are you actively doing to address it?"},
    {"id": "h4", "category": "hr", "difficulty": "easy", "tags": ["strengths", "value"],
     "question": "What unique value do you bring to this team that other candidates might not?"},
    {"id": "h5", "category": "hr", "difficulty": "easy", "tags": ["leaving", "motivation"],
     "question": "Why are you leaving your current role? What are you looking for that you're not getting there?"},
    {"id": "h6", "category": "hr", "difficulty": "medium", "tags": ["salary", "expectations"],
     "question": "What are your salary expectations and what's driving that number?"},
    {"id": "h7", "category": "hr", "difficulty": "easy", "tags": ["work style", "preferences"],
     "question": "Describe your ideal work environment and how you like to collaborate with your team."},
    {"id": "h8", "category": "hr", "difficulty": "medium", "tags": ["availability", "timeline"],
     "question": "When can you start, and do you have any competing offers we should be aware of?"},
    {"id": "h9", "category": "hr", "difficulty": "easy", "tags": ["questions", "engagement"],
     "question": "What questions do you have for us about the team, culture, or the challenges this role will face?"},
    {"id": "h10", "category": "hr", "difficulty": "medium", "tags": ["remote", "async"],
     "question": "How do you stay productive and maintain work-life balance in a remote or hybrid environment?"},
]


def get_questions(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    tags: Optional[List[str]] = None,
    limit: int = 10,
) -> List[Dict[str, Any]]:
    """Filter and return interview questions."""
    questions = QUESTION_BANK

    if category:
        questions = [q for q in questions if q["category"] == category]

    if difficulty:
        questions = [q for q in questions if q["difficulty"] == difficulty]

    if tags:
        tags_lower = [t.lower() for t in tags]
        questions = [
            q for q in questions
            if any(tag in tags_lower for tag in q.get("tags", []))
        ]

    return questions[:limit]


def analyze_star_response(question: str, answer: str) -> Dict[str, Any]:
    """
    Analyze a STAR method response and provide structured feedback.
    Rule-based analysis — no OpenAI needed.
    """
    if not answer or len(answer.split()) < 20:
        return {
            "score": 0,
            "star_analysis": {
                "situation": "No answer provided or answer too short.",
                "task": "Please provide a complete answer.",
                "action": "Use the STAR method: Situation → Task → Action → Result.",
                "result": "Always end with a measurable outcome.",
            },
            "strengths": [],
            "improvements": ["Provide a complete answer using the STAR method."],
            "keywords_used": [],
        }

    answer_lower = answer.lower()
    word_count = len(answer.split())

    # ── STAR Detection ──────────────────────────────────────────────
    situation_indicators = ["when", "at", "during", "we were", "our team", "the company", "i was working", "in my", "at my"]
    task_indicators = ["responsible", "my role", "i needed", "i was asked", "tasked", "my job", "i had to", "goal was"]
    action_indicators = ["i", "i did", "i built", "i implemented", "i created", "i designed", "i led", "i managed", "i wrote", "i optimized", "i worked"]
    result_indicators = ["result", "outcome", "achieved", "improved", "increased", "reduced", "saved", "led to", "which resulted", "ultimately", "%", "x", "users", "revenue", "time", "performance"]

    situation_score = min(100, sum(10 for ind in situation_indicators if ind in answer_lower))
    task_score = min(100, sum(15 for ind in task_indicators if ind in answer_lower))
    action_score = min(100, sum(3 for ind in action_indicators if re.search(r"\b" + re.escape(ind) + r"\b", answer_lower)))
    result_score = min(100, sum(15 for ind in result_indicators if ind in answer_lower))

    # Bonus for quantified results
    numbers = re.findall(r"\b\d+[\.,]?\d*\s*(%|x|times?|k\b|\$|ms|seconds?|users?|customers?)\b", answer_lower)
    quantification_bonus = min(30, len(numbers) * 10)

    # Bonus for specific action verbs
    from app.services.ats_service import ACTION_VERBS
    action_verb_count = sum(1 for verb in ACTION_VERBS if re.search(r"\b" + verb + r"\b", answer_lower))
    verb_bonus = min(20, action_verb_count * 5)

    # ── Overall Score ──────────────────────────────────────────────
    raw_score = (situation_score * 0.20 + task_score * 0.20 + action_score * 0.30 + result_score * 0.30)
    raw_score = min(100, raw_score + quantification_bonus * 0.5 + verb_bonus * 0.5)

    # ── STAR Feedback ──────────────────────────────────────────────
    star_analysis = {}

    # Situation feedback
    if situation_score >= 50:
        star_analysis["situation"] = "✅ Good context setting. You clearly established the background."
    else:
        star_analysis["situation"] = "⚠️ Add more context: Where were you? What was the business situation?"

    # Task feedback
    if task_score >= 50:
        star_analysis["task"] = "✅ Clear task ownership. Your specific responsibility is evident."
    else:
        star_analysis["task"] = "⚠️ Be more specific about YOUR role. What exactly were you responsible for?"

    # Action feedback
    if action_score >= 30:
        star_analysis["action"] = f"✅ Strong actions described using {'good' if action_verb_count >= 3 else 'some'} action verbs."
    else:
        star_analysis["action"] = "⚠️ Be more specific about what YOU did (use 'I', not 'we'). Detail each step you took."

    # Result feedback
    if result_score >= 50:
        if numbers:
            star_analysis["result"] = f"✅ Excellent! You quantified the result ({len(numbers)} data point{'s' if len(numbers) > 1 else ''})."
        else:
            star_analysis["result"] = "✅ Result mentioned. Try adding specific numbers (%, time saved, revenue impact)."
    else:
        star_analysis["result"] = "⚠️ Always end with a measurable result. What changed because of your actions?"

    # ── Strengths ──────────────────────────────────────────────────
    strengths = []
    if word_count >= 100:
        strengths.append("Comprehensive answer with good depth.")
    if numbers:
        strengths.append(f"Quantified impact ({len(numbers)} metric{'s' if len(numbers) > 1 else ''}).")
    if action_verb_count >= 3:
        strengths.append("Strong use of action verbs demonstrating ownership.")
    if "i" in answer_lower and "we" not in answer_lower[:100]:
        strengths.append("Clear personal ownership using 'I' statements.")

    # ── Improvements ──────────────────────────────────────────────
    improvements = []
    if word_count < 80:
        improvements.append("Expand your answer — aim for 150-250 words for a strong STAR response.")
    if not numbers:
        improvements.append("Add at least one quantified result (e.g., '40% faster', 'saved 20 hours/week', '$2M impact').")
    if action_verb_count < 2:
        improvements.append("Start action sentences with strong verbs: 'built', 'led', 'optimized', 'reduced'.")
    if "we" in answer_lower[:200] and action_score < 40:
        improvements.append("Replace 'we' with 'I' in your key action sentences — interviewers want to know YOUR contribution.")
    if result_score < 30:
        improvements.append("Add a clear Result section: What was the final impact of your actions?")

    return {
        "score": round(raw_score),
        "star_analysis": star_analysis,
        "strengths": strengths[:3],
        "improvements": improvements[:3],
        "keywords_used": [v for v in ACTION_VERBS if re.search(r"\b" + v + r"\b", answer_lower)][:8],
        "word_count": word_count,
        "quantification_count": len(numbers),
    }
