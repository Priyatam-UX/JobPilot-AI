"""
Career Coach Service — intelligent context-aware career guidance responses.
Uses pattern matching and a rich knowledge base. No OpenAI API required.
"""
import re
from typing import Dict, List, Tuple, Optional


# ─────────────────────────────────────────────
# Knowledge base: topic → response templates
# ─────────────────────────────────────────────
RESPONSES: Dict[str, Dict] = {
    "salary_negotiation": {
        "triggers": ["salary", "negotiate", "negotiation", "compensation", "pay", "raise", "offer", "counter offer", "ctc", "package"],
        "response": """Here's your **Salary Negotiation Strategy**:

**Before the conversation:**
- Research market rates on Glassdoor, Levels.fyi, LinkedIn Salary, and Blind for your exact role + location + level.
- Know your BATNA (Best Alternative to Negotiated Agreement) — having another offer dramatically increases leverage.
- Never give the first number. If asked for a range, ask "Could you share the budgeted range for this role?"

**The negotiation script:**
> "Thank you for the offer — I'm genuinely excited about this role and the team. Based on my {X} years of experience in {your field} and market research for this level in {location}, I was expecting base compensation closer to **${target}**. If we can align on that, I'm ready to move forward immediately."

**Tactics that work:**
- Negotiate base salary first, then equity separately.
- If base is fixed, negotiate: signing bonus, equity refresh, remote work, extra PTO, learning budget.
- Always get everything in writing before giving notice.
- Silence after stating your number is your friend — let them respond first.

**Common mistakes to avoid:**
- Accepting the first offer (85% of offers have room to negotiate).
- Sharing your current salary (illegal to ask in many US states).
- Apologizing for negotiating — it's expected and respected.

What's the role, company, and current offer? I can help you build a specific counter-offer script.""",
    },
    "skill_gap": {
        "triggers": ["skill gap", "skills gap", "missing skill", "improve skills", "upskill", "learn", "skill analysis", "what skills"],
        "response": """Here's how to identify and close your **Skill Gap**:

**Step 1 — Benchmark against job descriptions:**
- Collect 10-15 job postings for your target role on LinkedIn.
- Extract recurring technical requirements (copy into a spreadsheet).
- Compare against your current skills and mark gaps.

**Step 2 — Categorize gaps by priority:**
- 🔴 **Critical gaps** (mentioned in 80%+ of JDs): Address immediately.
- 🟡 **Important gaps** (mentioned in 40-60%): Build in parallel.
- 🟢 **Nice-to-haves** (mentioned in <30%): Long-term roadmap.

**Step 3 — Learning resources by type:**
| Skill Type | Best Resources |
|---|---|
| Frontend | Frontend Masters, The Odin Project, Josh W Comeau |
| Backend | Boot.dev, roadmap.sh, FastAPI docs |
| Data/ML | Fast.ai, Kaggle, Andrej Karpathy's YouTube |
| System Design | Alex Xu's books, Neetcode, ByteByteGo |
| Cloud/DevOps | A Cloud Guru, KodeKloud, official AWS/GCP docs |

**Fastest way to close gaps:**
1. Build a project that uses the missing skill.
2. Contribute to an open-source project that uses it.
3. Get certified (AWS, GCP, Kubernetes — all highly recognized).

Tell me your **target role** and **current stack** and I'll map out your specific gap analysis.""",
    },
    "roadmap": {
        "triggers": ["roadmap", "learning path", "plan", "how to become", "get into", "transition to", "career path", "pathway"],
        "response": """Here's how to build your personalized **Learning Roadmap**:

**Phase 1: Foundation (Month 1-2)**
- Master core CS fundamentals for your target domain.
- Complete 1 structured course (Udemy, Coursera, or official docs).
- Build a simple end-to-end project that works.

**Phase 2: Depth (Month 2-4)**
- Learn system design patterns for your domain.
- Build a real project with a proper tech stack (no tutorials).
- Contribute to 2-3 open source issues on GitHub.

**Phase 3: Production Readiness (Month 4-6)**
- Add observability (logging, monitoring, testing) to your projects.
- Get 1 relevant certification (proves the skill credibly).
- Write a technical blog post about what you built.

**Phase 4: Job Search (Month 5-6)**
- Optimize resume with new skills and project achievements.
- Apply to 10-15 target companies per week.
- Do mock interviews (Pramp, interviewing.io, LeetCode mocks).

**Recommended starting points by role:**
- **Backend Engineer**: Python/FastAPI + PostgreSQL + Docker + AWS
- **Frontend Engineer**: React 19 + TypeScript + Testing + Vite
- **Full Stack**: Next.js + Prisma + Vercel/Railway
- **ML Engineer**: Python + PyTorch + scikit-learn + Hugging Face
- **DevOps/SRE**: Linux + Docker + Kubernetes + Terraform + AWS

What's your **target role** and **current experience level**? I'll give you a week-by-week plan.""",
    },
    "resume_review": {
        "triggers": ["resume", "cv", "review my resume", "resume feedback", "improve resume", "resume tips"],
        "response": """Here's what makes a **top 5% resume**:

**Critical Structure:**
1. **Contact header** — Name, email, LinkedIn, GitHub, portfolio URL.
2. **Professional summary** — 2-3 sentences: who you are + your strongest skill + your impact.
3. **Experience** — Reverse chronological, 3-5 bullets per role, each starting with an action verb.
4. **Skills** — Organized by category (Languages, Frameworks, Cloud, Tools).
5. **Projects** — 2-3 projects with GitHub links and real impact metrics.
6. **Education** — Degree, school, graduation year.

**Every bullet should follow this formula:**
> [Action Verb] [What you did] [Result/Impact with a number]

✅ "Optimized PostgreSQL queries reducing average response time by **47%**, handling 2M+ daily requests."
❌ "Responsible for database work and improvements."

**ATS Optimization:**
- Use exact keywords from the job description.
- Avoid tables, columns, images, or headers/footers (ATS can't parse them).
- Save as PDF with a simple, clean format.
- Match your job title to the one in the JD.

**Length:**
- 0-5 years experience: 1 page strictly.
- 5-15 years: 1-2 pages.
- 15+ years: Max 2 pages.

Upload your resume and I'll give you specific feedback on your actual content!""",
    },
    "interview_prep": {
        "triggers": ["interview", "prep", "prepare", "behavioral", "technical interview", "system design", "coding interview", "star method"],
        "response": """Here's your **Interview Preparation Playbook**:

**The STAR Method for Behavioral Questions:**
- **S**ituation: Set the scene briefly (1-2 sentences).
- **T**ask: What was your specific responsibility?
- **A**ction: What exactly did YOU do? (Use "I", not "we")
- **R**esult: Quantify the outcome. Always end with a number.

**Top 10 questions you MUST prepare:**
1. Tell me about yourself. (2-min career story)
2. Why do you want to work here?
3. Tell me about a time you failed.
4. What's your greatest technical achievement?
5. Tell me about a conflict with a colleague.
6. Why are you leaving your current role?
7. Where do you see yourself in 5 years?
8. Tell me about a time you had to learn something quickly.
9. What's the hardest technical problem you've solved?
10. Do you have any questions for us? (Have 5 ready)

**System Design Framework:**
1. Clarify requirements (functional + non-functional).
2. Estimate scale (users, requests/sec, data size).
3. High-level design (components + data flow).
4. Deep dive on critical components.
5. Address bottlenecks + trade-offs.

**Resources:**
- Behavioral: "Cracking the PM Interview", STAR stories bank.
- Coding: NeetCode 150, LeetCode company-tagged questions.
- System Design: Alex Xu "System Design Interview" books.
- Mock Interviews: Pramp (free), interviewing.io, Exponent.

Tell me the **company and role** you're interviewing for and I'll generate tailored questions!""",
    },
    "career_transition": {
        "triggers": ["career change", "career transition", "switch career", "change field", "pivot", "new career", "moving into"],
        "response": """Here's your **Career Transition Roadmap**:

**Reality check first:**
- Most successful transitions take 6-18 months depending on distance.
- The closer your current skills are to the target field, the faster you can move.
- Your transferable skills (communication, problem solving, domain knowledge) are valuable — don't ignore them.

**The fastest transition paths:**
| From | To | Fastest Path |
|---|---|---|
| Any field | Software Engineer | Bootcamp or self-taught portfolio (6-12 months) |
| Developer | Data Scientist | ML courses + Kaggle competitions (4-8 months) |
| Developer | Product Manager | Internal transfer + APM programs |
| Business | Analyst/PM | SQL + Excel + side projects (3-6 months) |
| Engineer | DevOps/SRE | Cloud certs + containers (3-6 months) |

**Transition strategy:**
1. **Skills bridge**: Identify 3-5 skills from your current role that transfer directly.
2. **Portfolio**: Build 2-3 projects in the target field. This is non-negotiable.
3. **Network**: 70% of jobs are filled through referrals. Connect with 5 people in your target role on LinkedIn per week.
4. **Internal move**: Always try an internal transfer first — you already have credibility.
5. **Adjacent roles**: A lateral move into an adjacent role is often easier than a direct jump.

**Most underrated strategy:**
Find companies where your *current* domain expertise is valuable *and* they need your target role. A backend developer who understands healthcare transitioning to a healthcare tech company is 5x more hireable.

Tell me your **current role** and **target role** and I'll build a specific transition plan!""",
    },
    "linkedin": {
        "triggers": ["linkedin", "profile", "linkedin optimization", "linkedin tips", "optimize profile"],
        "response": """Here's how to build a **top-performing LinkedIn profile**:

**Headline (most important field):**
Don't just list your title. Formula: `[Title] | [Specialty] | [Value Proposition]`
✅ "Senior Backend Engineer | Python & FastAPI | Building Scalable APIs for 10M+ Users"
❌ "Software Engineer at Company X"

**Banner**: Use a tool like Canva to create a professional banner with your tech stack.

**About section** (2,600 chars max):
- Hook: Start with a strong first line (shown without "See more" click).
- Story: Why you do what you do.
- Proof: 2-3 specific achievements with numbers.
- Call to action: "Open to opportunities" or "Let's connect".

**Experience section:**
Same as resume bullets — action verbs + quantified impact.

**Skills section:**
Add 50 skills. LinkedIn's algorithm weights profiles with more skills in search results.

**Featured section:**
Pin your best content: GitHub projects, articles, portfolio, case studies.

**Activity signals that boost recruiter visibility:**
- Post 1-2x/week about things you've learned or built.
- Comment thoughtfully on 5 posts/day.
- Connect with 10 people in your target field per week.

**Recruiter magnets:**
- "Open to Work" green frame (if comfortable).
- Set job preferences in settings for recruiter InMail.
- Use the exact keywords from your target job titles.

Want me to review your headline or About section? Paste it here!""",
    },
    "default": {
        "triggers": [],
        "response": """I'm your **Career Coach AI** — here to help you at every stage of your career journey.

I can help you with:
- 📊 **Skill Gap Analysis** — compare your skills against target roles
- 🗺️ **Learning Roadmap** — personalized week-by-week learning plans
- 💰 **Salary Negotiation** — scripts, tactics, and market insights
- 📄 **Resume Review** — specific feedback to get to the top 5%
- 🎤 **Interview Prep** — STAR stories, behavioral & technical questions
- 🔄 **Career Transition** — step-by-step plans to pivot roles
- 💼 **LinkedIn Optimization** — make recruiters come to you
- 🏆 **Promotion Roadmap** — how to make the case for your next level

**Just ask me anything about your career** — be specific for the best advice!

Examples:
- _"I'm a backend developer with 3 years in Python. How do I transition to ML?"_
- _"I have a FAANG interview next week for a senior SWE role. Help me prep."_
- _"I have an offer for $150k but I think I'm worth $175k. How do I negotiate?"_""",
    },
}


def get_career_response(
    message: str,
    history: Optional[List[Dict]] = None,
    resume_skills: Optional[List[str]] = None,
    desired_role: Optional[str] = None,
) -> str:
    """
    Generate a context-aware career coaching response.
    Matches message intent against the knowledge base.
    """
    if not message:
        return RESPONSES["default"]["response"]

    message_lower = message.lower()

    # Find the best matching topic
    best_match = None
    best_score = 0

    for topic, data in RESPONSES.items():
        if topic == "default":
            continue
        score = sum(1 for trigger in data["triggers"] if trigger in message_lower)
        if score > best_score:
            best_score = score
            best_match = topic

    if best_match and best_score > 0:
        response = RESPONSES[best_match]["response"]

        # Personalize with resume skills if available
        if resume_skills and "{skills}" in response:
            skills_str = ", ".join(resume_skills[:8])
            response = response.replace("{skills}", skills_str)

        # Personalize with desired role if available
        if desired_role and "{role}" in response:
            response = response.replace("{role}", desired_role)

        return response

    # Context-aware fallback: check if previous messages give context
    if history:
        recent = " ".join([m.get("content", "") for m in history[-3:] if m.get("role") == "user"]).lower()
        for topic, data in RESPONSES.items():
            if topic == "default":
                continue
            if any(trigger in recent for trigger in data["triggers"]):
                return f"Building on our discussion:\n\n" + RESPONSES[topic]["response"]

    return RESPONSES["default"]["response"]
