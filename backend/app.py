import os
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager
from backend.rag import initialize_vector_db
from backend.chatbot import generate_chatbot_response, generate_chatbot_stream, clear_history

# Pydantic schemas
class ChatRequest(BaseModel):
    question: str = Field(..., description="The user's message/question for the chatbot")
    session_id: str = Field("default", description="Session identifier for tracking chat history")

class ClearRequest(BaseModel):
    session_id: str = Field("default", description="Session identifier to clear")

# Lifespan events
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("FastAPI starting up...")
    print("Initializing RAG vector database...")
    try:
        initialize_vector_db()
    except Exception as e:
        print(f"Error initializing vector db on startup: {e}")
    yield
    print("FastAPI shutting down...")

app = FastAPI(
    title="Portfolio AI Chatbot Backend",
    description="A FastAPI backend with RAG and Google Gemini API to power Muthu Naveen N's portfolio chatbot.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend hosting
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (GitHub Pages, Netlify, localhost, etc.)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.post("/chat")
def chat(request: ChatRequest):
    """
    Standard HTTP POST endpoint.
    Expects JSON: { "question": "..." }
    Returns JSON: { "answer": "..." }
    """
    if not request.question.strip():
        return JSONResponse(status_code=400, content={"error": "Question cannot be empty"})
    
    response_data = generate_chatbot_response(request.question, request.session_id)
    return response_data

@app.post("/chat/stream")
def chat_stream(request: ChatRequest):
    """
    Server-Sent Events (SSE) streaming endpoint.
    Yields chunks of text in real-time as the model generates them.
    """
    if not request.question.strip():
        return JSONResponse(status_code=400, content={"error": "Question cannot be empty"})
    
    return StreamingResponse(
        generate_chatbot_stream(request.question, request.session_id),
        media_type="text/event-stream"
    )

@app.post("/clear")
def clear_chat(request: ClearRequest):
    """
    Clears the history memory for the specified session_id.
    """
    clear_history(request.session_id)
    return {"status": "success", "message": f"Chat history for session '{request.session_id}' has been cleared."}

@app.get("/health")
def health_check():
    """
    Basic health check endpoint.
    """
    return {"status": "healthy", "service": "portfolio-chatbot-backend"}

if __name__ == "__main__":
    import uvicorn
    # Use port 8000 by default
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.app:app", host="0.0.0.0", port=port, reload=True)
