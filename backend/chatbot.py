import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from backend.rag import get_complete_context
from backend.tools import detect_direct_action

# Load environment variables
load_dotenv()



# Load complete static context once at startup
context_str = get_complete_context()

SYSTEM_PROMPT = """You are the AI assistant representing Muthu Naveen N, the owner of this portfolio website.
Answer only using the provided knowledge retrieved from his portfolio, projects, skills, education, and credentials.
Never hallucinate or make up facts.
If information is not available in the provided context, politely state that it is not available.
Be concise but informative.
Respond professionally because recruiters and hiring managers may use this assistant.

CRITICAL INSTRUCTIONS FOR ACTIONS:
If the user explicitly asks to download the resume, output exactly: {"action": "download_resume"}
If the user asks to see, open, or view GitHub, output exactly: {"action": "open_github"}
If the user asks to see, open, or view LinkedIn, output exactly: {"action": "open_linkedin"}
If the user asks to contact Muthu Naveen N, output exactly: {"action": "scroll_contact"}
If the user asks to see or view his projects, output exactly: {"action": "scroll_projects"}

Do not wrap these actions in markdown code blocks or add any conversational text if returning them. Output the JSON object directly.
"""

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    system_instruction=f"{SYSTEM_PROMPT}\n\n--- PROVIDED KNOWLEDGE ---\n{context_str}\n--------------------------",
    generation_config={"temperature": 0.2}
)

# In-memory session history mapping: session_id -> list of native message dicts
session_histories = {}

def get_history(session_id: str):
    if session_id not in session_histories:
        session_histories[session_id] = []
    # Keep only the last 10 messages (5 turns)
    return session_histories[session_id][-10:]

def save_message(session_id: str, role: str, text: str):
    if session_id not in session_histories:
        session_histories[session_id] = []
    session_histories[session_id].append({"role": role, "parts": [text]})

def clear_history(session_id: str):
    if session_id in session_histories:
        session_histories[session_id] = []

def generate_chatbot_response(question: str, session_id: str = "default"):
    # 1. Direct command interception
    direct_action = detect_direct_action(question)
    if direct_action:
        return {"answer": json.dumps({"action": direct_action})}

    # 2. Build conversation history and context
    history_messages = get_history(session_id)
    contents = history_messages + [{"role": "user", "parts": [question]}]

    # 3. Call native Gemini API
    try:
        response = model.generate_content(contents)
        answer = response.text.strip()
        
        # Save exchange in history if it's not a custom action
        if not answer.startswith('{"action":'):
            save_message(session_id, "user", question)
            save_message(session_id, "model", answer)
            
        return {"answer": answer}
    except Exception as e:
        print(f"Error in Gemini API invocation: {e}")
        return {"answer": "Error: Failed to fetch response from the AI model."}

async def generate_chatbot_stream(question: str, session_id: str = "default"):
    """
    Streams response token by token in SSE format.
    """
    # 1. Direct action check
    direct_action = detect_direct_action(question)
    if direct_action:
        action_json = json.dumps({"action": direct_action})
        yield f"data: {json.dumps({'chunk': action_json, 'done': True})}\n\n"
        return

    # 2. Build history
    history_messages = get_history(session_id)
    contents = history_messages + [{"role": "user", "parts": [question]}]

    # 3. Stream native response
    try:
        response = model.generate_content(contents, stream=True)
        full_response = ""
        for chunk in response:
            content = chunk.text
            full_response += content
            yield f"data: {json.dumps({'chunk': content, 'done': False})}\n\n"

        # Save exchange if not custom action
        if not full_response.strip().startswith('{"action":'):
            save_message(session_id, "user", question)
            save_message(session_id, "model", full_response)
            
        yield f"data: {json.dumps({'chunk': '', 'done': True})}\n\n"
    except Exception as e:
        print(f"Error in Gemini API stream: {e}")
        yield f"data: {json.dumps({'chunk': 'Error: Failed to connect to Gemini API stream.', 'done': True})}\n\n"
