"""
Skill Extractor — extracts skills, technologies, experience, and education
from raw resume text using pattern matching and a curated tech dictionary.
No external AI API required.
"""
import re
from typing import Dict, List, Any

# ─────────────────────────────────────────────
# Curated skill dictionaries by category
# ─────────────────────────────────────────────
SKILLS_DB: Dict[str, List[str]] = {
    "languages": [
        "Python", "JavaScript", "TypeScript", "Java", "Kotlin", "Go", "Golang",
        "Rust", "C++", "C#", "C", "Swift", "Objective-C", "Ruby", "PHP",
        "Scala", "Elixir", "Dart", "R", "MATLAB", "Bash", "Shell", "PowerShell",
        "Perl", "Haskell", "Lua", "Assembly", "COBOL", "Fortran",
    ],
    "frontend": [
        "React", "React.js", "Next.js", "Vue", "Vue.js", "Angular", "Svelte",
        "HTML", "HTML5", "CSS", "CSS3", "SASS", "SCSS", "Less", "Tailwind",
        "TailwindCSS", "Bootstrap", "Material UI", "Chakra UI", "Ant Design",
        "Redux", "Zustand", "MobX", "Recoil", "Context API", "GraphQL",
        "Apollo", "React Query", "TanStack Query", "Vite", "Webpack", "Rollup",
        "Parcel", "Babel", "ESLint", "Prettier", "Jest", "Cypress", "Playwright",
        "Storybook", "Figma", "Framer Motion", "Three.js", "D3.js", "WebSockets",
        "WebRTC", "PWA", "SPA", "SSR", "SSG", "React Native", "Flutter",
        "Ionic", "Expo",
    ],
    "backend": [
        "Node.js", "Express", "Express.js", "FastAPI", "Django", "Flask",
        "Spring", "Spring Boot", "Rails", "Ruby on Rails", "Laravel", "NestJS",
        "Hapi", "Koa", "Gin", "Echo", "Fiber", "gRPC", "REST", "RESTful",
        "GraphQL", "WebSockets", "Microservices", "Serverless", "Lambda",
        "API Gateway", "JWT", "OAuth", "OAuth2", "OpenID", "SAML", "Celery",
        "RabbitMQ", "Kafka", "Redis", "Sidekiq", "BullMQ",
    ],
    "databases": [
        "PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis", "Cassandra",
        "DynamoDB", "Elasticsearch", "Solr", "Neo4j", "CouchDB", "InfluxDB",
        "Snowflake", "BigQuery", "Redshift", "Supabase", "Firebase", "PlanetScale",
        "Neon", "Cockroach", "CockroachDB", "Prisma", "SQLAlchemy", "Sequelize",
        "Mongoose", "TypeORM", "Drizzle", "pgvector",
    ],
    "cloud_devops": [
        "AWS", "GCP", "Azure", "Google Cloud", "Heroku", "Vercel", "Netlify",
        "Docker", "Kubernetes", "Terraform", "Ansible", "Helm", "Jenkins",
        "GitHub Actions", "CircleCI", "Travis CI", "GitLab CI", "ArgoCD",
        "Prometheus", "Grafana", "Datadog", "New Relic", "CloudWatch",
        "S3", "EC2", "RDS", "ECS", "EKS", "Lambda", "CloudFront", "Route53",
        "Nginx", "Apache", "Traefik", "Istio", "Linux", "Ubuntu", "CI/CD",
        "DevOps", "SRE", "IaC", "CDN",
    ],
    "ai_ml": [
        "Machine Learning", "Deep Learning", "Neural Networks", "NLP",
        "Computer Vision", "PyTorch", "TensorFlow", "Keras", "scikit-learn",
        "Pandas", "NumPy", "SciPy", "Matplotlib", "Seaborn", "OpenCV",
        "Hugging Face", "Transformers", "BERT", "GPT", "LLM", "RAG",
        "LangChain", "LangGraph", "OpenAI", "Anthropic", "Claude",
        "Stable Diffusion", "YOLO", "XGBoost", "LightGBM", "CatBoost",
        "MLflow", "DVC", "Airflow", "Spark", "Hadoop", "Databricks",
        "Vector Database", "Embedding", "Fine-tuning", "RLHF", "Prompt Engineering",
    ],
    "tools": [
        "Git", "GitHub", "GitLab", "Bitbucket", "Jira", "Confluence",
        "Slack", "Notion", "Figma", "Postman", "Insomnia", "Swagger",
        "OpenAPI", "VS Code", "IntelliJ", "PyCharm", "Vim", "Linux",
        "macOS", "Windows", "Agile", "Scrum", "Kanban", "TDD", "BDD",
        "Code Review", "Pair Programming",
    ],
    "soft_skills": [
        "Leadership", "Communication", "Problem Solving", "Team Player",
        "Mentoring", "Technical Writing", "Project Management", "Cross-functional",
        "Stakeholder Management", "Agile", "Sprint Planning", "System Design",
        "Architecture", "Code Review",
    ],
}

# Flat skill list for fast lookup
ALL_SKILLS = {skill.lower(): (skill, category)
              for category, skills in SKILLS_DB.items()
              for skill in skills}

# Section headers for section detection
SECTION_PATTERNS = {
    "experience": r"(work\s*experience|professional\s*experience|employment|experience|work\s*history)",
    "education": r"(education|academic|qualifications|degrees?|university|college)",
    "skills": r"(skills?|technical\s*skills?|competencies|technologies|proficiencies)",
    "projects": r"(projects?|personal\s*projects?|side\s*projects?|portfolio)",
    "certifications": r"(certifications?|certificates?|credentials?|licenses?|courses?)",
    "summary": r"(summary|objective|profile|about\s*me|overview|professional\s*summary)",
    "achievements": r"(achievements?|accomplishments?|awards?|honors?|recognition)",
}

# Patterns for contact info
EMAIL_PATTERN = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
PHONE_PATTERN = re.compile(r"(\+\d{1,3}[\s.-]?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}")
LINKEDIN_PATTERN = re.compile(r"linkedin\.com/in/([a-zA-Z0-9\-]+)")
GITHUB_PATTERN = re.compile(r"github\.com/([a-zA-Z0-9\-]+)")
URL_PATTERN = re.compile(r"https?://[^\s]+")

# Patterns for experience years
YEARS_PATTERN = re.compile(
    r"(\d+)\+?\s*years?\s*(of\s*)?(professional\s*)?(experience|working)",
    re.IGNORECASE
)
DATE_RANGE_PATTERN = re.compile(
    r"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December)?\s*(\d{4})\s*[-–—]\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Present|Current|Now|Today)?",
    re.IGNORECASE
)


def extract_skills(text: str) -> Dict[str, List[str]]:
    """Extract skills from resume text, grouped by category."""
    text_lower = text.lower()
    found: Dict[str, List[str]] = {cat: [] for cat in SKILLS_DB.keys()}

    for skill_lower, (skill_original, category) in ALL_SKILLS.items():
        # Use word boundary matching to avoid partial matches
        pattern = r"\b" + re.escape(skill_lower) + r"\b"
        if re.search(pattern, text_lower):
            if skill_original not in found[category]:
                found[category].append(skill_original)

    # Remove empty categories
    return {k: sorted(v) for k, v in found.items() if v}


def extract_contact_info(text: str) -> Dict[str, Any]:
    """Extract contact information from resume text."""
    info = {}

    email_match = EMAIL_PATTERN.search(text)
    if email_match:
        info["email"] = email_match.group()

    phone_match = PHONE_PATTERN.search(text)
    if phone_match:
        info["phone"] = phone_match.group().strip()

    linkedin_match = LINKEDIN_PATTERN.search(text)
    if linkedin_match:
        info["linkedin"] = f"https://linkedin.com/in/{linkedin_match.group(1)}"

    github_match = GITHUB_PATTERN.search(text)
    if github_match:
        info["github"] = f"https://github.com/{github_match.group(1)}"

    return info


def detect_sections(text: str) -> Dict[str, bool]:
    """Detect which resume sections are present."""
    text_lower = text.lower()
    detected = {}
    for section, pattern in SECTION_PATTERNS.items():
        detected[section] = bool(re.search(pattern, text_lower))
    return detected


def estimate_experience_years(text: str) -> float:
    """Estimate total years of experience from resume text."""
    # Try explicit mention first
    explicit = YEARS_PATTERN.search(text)
    if explicit:
        return float(explicit.group(1))

    # Count date ranges as a proxy
    current_year = 2025
    date_ranges = DATE_RANGE_PATTERN.findall(text)
    years = set()
    for match in date_ranges:
        # match is a tuple from the capturing groups
        for part in match:
            if part and part.isdigit() and 1990 <= int(part) <= current_year:
                years.add(int(part))

    if years:
        span = max(years) - min(years)
        return float(min(span, 30))  # Cap at 30 years

    return 0.0


def extract_education(text: str) -> List[Dict[str, str]]:
    """Extract education entries from resume text."""
    degrees = []
    degree_patterns = [
        r"(Ph\.?D|Doctor of Philosophy|Doctorate)",
        r"(M\.?S\.?|Master(?:s)? of Science|Master(?:s)? of Arts|M\.?A\.?|M\.?B\.?A\.?|Master(?:s)?)",
        r"(B\.?S\.?|B\.?E\.?|B\.?Tech|Bachelor(?:s)? of Science|Bachelor(?:s)? of Arts|B\.?A\.?|B\.?Com|Bachelor(?:s)?)",
        r"(Associate(?:s)?|A\.?S\.?|A\.?A\.?)",
        r"(High School|Secondary School|GED|Diploma)",
    ]
    for pattern in degree_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            degrees.append({"degree": matches[0] if isinstance(matches[0], str) else matches[0][0]})

    return degrees[:3]  # Max 3 education entries


def count_words(text: str) -> int:
    """Count words in resume text."""
    return len(text.split()) if text else 0


def extract_all(text: str) -> Dict[str, Any]:
    """Run all extractors and return a unified analysis result."""
    if not text:
        return {
            "skills": {},
            "all_skills_flat": [],
            "contact": {},
            "sections": {},
            "education": [],
            "experience_years": 0.0,
            "word_count": 0,
        }

    skills = extract_skills(text)
    all_skills_flat = [s for skills_list in skills.values() for s in skills_list]

    return {
        "skills": skills,
        "all_skills_flat": all_skills_flat,
        "contact": extract_contact_info(text),
        "sections": detect_sections(text),
        "education": extract_education(text),
        "experience_years": estimate_experience_years(text),
        "word_count": count_words(text),
    }
