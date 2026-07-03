import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KNOWLEDGE_DIR = os.path.join(BASE_DIR, "knowledge")

# Cache variable for context to prevent reading files on every query
_cached_context = None

class Document:
    """Mock Document class for backwards compatibility with any code expecting LangChain Document objects."""
    def __init__(self, page_content: str, metadata: dict = None):
        self.page_content = page_content
        self.metadata = metadata or {}

def get_complete_context() -> str:
    """Loads all knowledge files from KNOWLEDGE_DIR and formats them into a single Markdown block."""
    global _cached_context
    if _cached_context is not None:
        return _cached_context

    context_parts = []

    # 1. Load About
    about_path = os.path.join(KNOWLEDGE_DIR, "about.txt")
    if os.path.exists(about_path):
        with open(about_path, "r", encoding="utf-8") as f:
            context_parts.append("# ABOUT MUTHU NAVEEN N\n" + f.read())

    # 2. Load Resume
    resume_path = os.path.join(KNOWLEDGE_DIR, "resume.pdf")
    if os.path.exists(resume_path):
        try:
            with open(resume_path, "r", encoding="utf-8", errors="ignore") as f:
                context_parts.append("# RESUME TEXT\n" + f.read())
        except Exception as e:
            print(f"Error reading resume.pdf as fallback text: {e}")

    # 3. Load Projects
    projects_path = os.path.join(KNOWLEDGE_DIR, "projects.json")
    if os.path.exists(projects_path):
        try:
            with open(projects_path, "r", encoding="utf-8") as f:
                projects = json.load(f)
            proj_str = "# RECENT PROJECTS\n"
            for p in projects:
                techs = ", ".join(p.get("technologies", []))
                highlights = "\n".join([f"  - {h}" for h in p.get("highlights", [])])
                proj_str += (
                    f"## Project: {p.get('name')}\n"
                    f"- Role: {p.get('role')}\n"
                    f"- Technologies: {techs}\n"
                    f"- GitHub: {p.get('github_url')}\n"
                    f"- Description: {p.get('description')}\n"
                    f"- Highlights:\n{highlights}\n\n"
                )
            context_parts.append(proj_str)
        except Exception as e:
            print(f"Error parsing projects.json: {e}")

    # 4. Load Skills
    skills_path = os.path.join(KNOWLEDGE_DIR, "skills.json")
    if os.path.exists(skills_path):
        try:
            with open(skills_path, "r", encoding="utf-8") as f:
                skills_data = json.load(f)
            
            skills_str = "# TECHNICAL SKILLS & TECH STACK\n"
            
            # Languages
            skills_str += "## Programming Languages:\n"
            for item in skills_data.get("languages", []):
                skills_str += f"- {item['name']}: {item['proficiency']} Proficiency ({item['level']} Level)\n"
            
            # Backend & DevOps
            skills_str += "\n## Backend & DevOps:\n"
            for item in skills_data.get("backend_and_devops", []):
                skills_str += f"- {item['name']}: {item['proficiency']} Proficiency ({item['level']} Level)\n"
                
            # AI/ML & Core CS
            skills_str += "\n## AI/ML & Core Computer Science:\n"
            for item in skills_data.get("ai_ml_core_cs", []):
                skills_str += f"- {item['name']}: {item['proficiency']} Proficiency ({item['level']} Level)\n"
                
            # Areas of interest
            skills_str += "\n## Primary Areas of Interest:\n"
            for interest in skills_data.get("areas_of_interest", []):
                skills_str += f"- {interest}\n"
                
            context_parts.append(skills_str)
        except Exception as e:
            print(f"Error parsing skills.json: {e}")

    # 5. Load Experience
    exp_path = os.path.join(KNOWLEDGE_DIR, "experience.json")
    if os.path.exists(exp_path):
        try:
            with open(exp_path, "r", encoding="utf-8") as f:
                experiences = json.load(f)
            exp_str = "# PROFESSIONAL EXPERIENCE / SIMULATIONS\n"
            for exp in experiences:
                highlights = "\n".join([f"  - {h}" for h in exp.get("highlights", [])])
                exp_str += (
                    f"## Role: {exp.get('role')} at {exp.get('company')}\n"
                    f"- Period: {exp.get('period')}\n"
                    f"- Description: {exp.get('description')}\n"
                    f"- Highlights:\n{highlights}\n\n"
                )
            context_parts.append(exp_str)
        except Exception as e:
            print(f"Error parsing experience.json: {e}")

    # 6. Load Education
    edu_path = os.path.join(KNOWLEDGE_DIR, "education.json")
    if os.path.exists(edu_path):
        try:
            with open(edu_path, "r", encoding="utf-8") as f:
                education = json.load(f)
            edu_str = "# ACADEMIC JOURNEY\n"
            for edu in education:
                edu_str += (
                    f"## {edu.get('degree')}\n"
                    f"- Institution: {edu.get('institution')}\n"
                    f"- Score/CGPA: {edu.get('score')}\n"
                    f"- Status: {edu.get('status')}\n\n"
                )
            context_parts.append(edu_str)
        except Exception as e:
            print(f"Error parsing education.json: {e}")

    # 7. Load Achievements
    ach_path = os.path.join(KNOWLEDGE_DIR, "achievements.json")
    if os.path.exists(ach_path):
        try:
            with open(ach_path, "r", encoding="utf-8") as f:
                achievements = json.load(f)
            ach_str = "# ACHIEVEMENTS & COMPETE CREDENTIALS\n"
            for ach in achievements:
                ach_str += (
                    f"## {ach.get('title')}\n"
                    f"- Event: {ach.get('event')}\n"
                    f"- Organization: {ach.get('organization')}\n"
                    f"- Description: {ach.get('description')}\n"
                    f"- Verification: {ach.get('verification_url')}\n\n"
                )
            context_parts.append(ach_str)
        except Exception as e:
            print(f"Error parsing achievements.json: {e}")

    # 8. Load Certifications
    certs_path = os.path.join(KNOWLEDGE_DIR, "certifications.json")
    if os.path.exists(certs_path):
        try:
            with open(certs_path, "r", encoding="utf-8") as f:
                certs = json.load(f)
            certs_str = "# CERTIFICATIONS & PROFESSIONAL CREDENTIALS\n"
            for cert in certs:
                certs_str += (
                    f"## {cert.get('name')}\n"
                    f"- Issuer: {cert.get('issuer')}\n"
                    f"- Description: {cert.get('description')}\n"
                    f"- Verification Link: {cert.get('verification_url')}\n\n"
                )
            context_parts.append(certs_str)
        except Exception as e:
            print(f"Error parsing certifications.json: {e}")

    _cached_context = "\n\n".join(context_parts)
    return _cached_context

def initialize_vector_db(force_rebuild=False):
    """Placeholder initialization for backwards compatibility. Returns True directly."""
    print("Direct memory context database loaded. Skipping local embedding setup.")
    return True

def query_db(query, k=5):
    """Mock query_db for compatibility, returning the entire context as a single Document list."""
    return [Document(page_content=get_complete_context(), metadata={"source": "portfolio_static_context"})]
