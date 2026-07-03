# Muthu Naveen N - Portfolio AI Chatbot Backend

A Python FastAPI application that serves as the AI assistant representing Muthu Naveen N. It utilizes Retrieval-Augmented Generation (RAG) through LangChain, ChromaDB, and Sentence Transformers to answer user questions using specific portfolio details instead of generic LLM training data.

## Features

- **RAG Architecture**: Automatically embeds and indexes text and JSON files from the `knowledge/` directory into ChromaDB.
- **Google Gemini API**: Uses `gemini-1.5-flash` model for intelligent, contextual conversation.
- **Streaming Response**: Supports Server-Sent Events (SSE) for real-time text rendering.
- **Intent Recognition (Actions)**: Intercepts custom commands (e.g. "download resume", "open LinkedIn") and returns structured action JSON instead of conversational text.
- **CORS Enabled**: Configured to work smoothly when queried by frontend sites hosted on GitHub Pages or Netlify.
- **Chat Memory**: Remembers previous turns to contextually handle follow-up questions.

---

## Local Setup

### 1. Prerequisites

Make sure you have Python 3.9 or higher installed.

### 2. Install Dependencies

In your terminal, navigate to the `backend/` directory and install the packages:

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file in the `backend/` directory (or workspace root) based on `.env.example`:

```env
GEMINI_API_KEY=AIzaSy...your_gemini_api_key...
PORT=8000
```

### 4. Run the Server

Start the local development server:

```bash
python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
```

The API documentation will be available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

---

## API Reference

### 1. Chat Response (Standard JSON)
- **URL**: `/chat`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Payload**:
  ```json
  {
    "question": "What are your core projects?",
    "session_id": "optional-custom-session-id"
  }
  ```
- **Response**:
  ```json
  {
    "answer": "..."
  }
  ```

### 2. Chat Response (SSE Streaming)
- **URL**: `/chat/stream`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Payload**:
  ```json
  {
    "question": "What is your academic score?",
    "session_id": "optional-custom-session-id"
  }
  ```
- **Response**: Streams chunks of type `text/event-stream` formatted as: `data: {"chunk": "text...", "done": false}`.

### 3. Clear History
- **URL**: `/clear`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "session_id": "default"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Chat history for session 'default' has been cleared."
  }
  ```

---

## Deployment to Render

To deploy this backend on [Render](https://render.com/):

1. **Push to GitHub**: Push your portfolio code (with the `backend/` and `knowledge/` directories) to your GitHub repository.
2. **Create a Render Web Service**:
   - Log in to Render.
   - Click **New** -> **Web Service**.
   - Connect your GitHub repository.
3. **Configure Service Details**:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `python -m uvicorn backend.app:app --host 0.0.0.0 --port $PORT`
4. **Environment Variables**:
   - Go to the **Environment** tab in your Render service dashboard.
   - Add `GEMINI_API_KEY` and paste your Google Gemini API key.
   - Add `PYTHONPATH` with value `.` (or Render will pick it up automatically from the root folder if uvicorn is launched from the workspace root).
5. **Deploy**: Render will build the image, run the startup handler (which will automatically initialize your RAG database from the `knowledge/` directory), and make the backend live under a custom URL (e.g. `https://your-app-name.onrender.com`). Update the API URL in your frontend's `script.js` to match this URL!
