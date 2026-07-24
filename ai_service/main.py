from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="CivicHub AI Service", version="1.0.0")

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    language: str = "en"

class ChatResponse(BaseModel):
    reply: str
    suggested_actions: List[str] = []

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5

class SearchResponse(BaseModel):
    results: List[dict]

@app.post("/api/ai/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Mock chat endpoint for the AI assistant."""
    # In a real scenario, this would call LangGraph/OpenAI
    reply = f"Mock response to: {request.message}. I can help you with government services, complaints, and applications."
    return ChatResponse(
        reply=reply,
        suggested_actions=["Track Application", "File a Complaint"]
    )

@app.post("/api/ai/search", response_model=SearchResponse)
async def search_endpoint(request: SearchRequest):
    """Mock semantic search endpoint for services."""
    return SearchResponse(
        results=[
            {
                "title": "Birth Certificate Application",
                "description": "Apply for a new birth certificate online.",
                "url": "/services/birth-certificate",
                "score": 0.95
            },
            {
                "title": "Property Tax Payment",
                "description": "Pay your municipal property tax online.",
                "url": "/payments/property-tax",
                "score": 0.88
            }
        ]
    )

@app.get("/health")
async def health_check():
    return {"status": "ok"}
