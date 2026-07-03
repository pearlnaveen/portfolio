import re

def detect_direct_action(question: str) -> str:
    """
    Scans the user query for direct command words to open links, download the resume,
    or scroll to sections on the portfolio. Returns the action string if found, otherwise None.
    """
    q = question.lower().strip()
    
    # Clean string from punctuation
    q_clean = re.sub(r'[^\w\s]', '', q)
    
    # 1. Download Resume
    resume_patterns = [
        r'\bdownload\s+resume\b',
        r'\bget\s+resume\b',
        r'\bdownload\s+cv\b',
        r'\bget\s+cv\b',
        r'\bsave\s+resume\b',
        r'\bsave\s+cv\b',
        r'^download\s+my\s+resume$'
    ]
    for pattern in resume_patterns:
        if re.search(pattern, q_clean):
            return "download_resume"
            
    # 2. Open GitHub
    github_patterns = [
        r'\bshow\s+github\b',
        r'\bopen\s+github\b',
        r'\bview\s+github\b',
        r'\bgithub\s+link\b',
        r'\bgithub\s+profile\b'
    ]
    for pattern in github_patterns:
        if re.search(pattern, q_clean):
            return "open_github"
            
    # 3. Open LinkedIn
    linkedin_patterns = [
        r'\bopen\s+linkedin\b',
        r'\bshow\s+linkedin\b',
        r'\bview\s+linkedin\b',
        r'\blinkedin\s+link\b',
        r'\blinkedin\s+profile\b'
    ]
    for pattern in linkedin_patterns:
        if re.search(pattern, q_clean):
            return "open_linkedin"
            
    # 4. Contact / Scroll Contact
    contact_patterns = [
        r'^contact$',
        r'\bcontact\s+you\b',
        r'\bscroll\s+to\s+contact\b',
        r'\bgo\s+to\s+contact\b',
        r'\bhow\s+to\s+contact\b',
        r'\bget\s+in\s+touch\b',
        r'\breach\s+out\b'
    ]
    for pattern in contact_patterns:
        if re.search(pattern, q_clean):
            return "scroll_contact"
            
    # 5. Show Projects (Direct navigation commands, rather than general queries)
    project_scroll_patterns = [
        r'\bshow\s+projects\b',
        r'\bscroll\s+to\s+projects\b',
        r'\bgo\s+to\s+projects\b',
        r'\bview\s+projects\b'
    ]
    for pattern in project_scroll_patterns:
        if re.search(pattern, q_clean):
            return "scroll_projects"
            
    return None
