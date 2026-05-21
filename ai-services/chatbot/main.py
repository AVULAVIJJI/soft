"""
Softmaster AI Chatbot
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import httpx, os

app = FastAPI(title="Softmaster AI Chatbot")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
SYSTEM_PROMPT = "You are Softmaster virtual assistant for Softmaster Technology Solutions Pvt Ltd, Kandy, Sri Lanka. Founded 2000. 1700+ clients. Be professional."

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

@app.post("/chat")
async def chat(request: ChatRequest):
    if not GROQ_API_KEY:
        return {"response": "Contact: info@softmastergroup.com | +94 81 220 4130"}
    msgs = [{"role": "system", "content": SYSTEM_PROMPT}] + [{"role": m.role, "content": m.content} for m in request.messages[-10:]]
    async with httpx.AsyncClient() as client:
        resp = await client.post("https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
            json={"model": "llama3-8b-8192", "messages": msgs, "max_tokens": 500}, timeout=30)
        if resp.status_code != 200:
            raise HTTPException(status_code=500, detail="AI unavailable")
        return {"response": resp.json()["choices"][0]["message"]["content"]}

@app.get("/health")
async def health():
    return {"status": "online", "service": "Softmaster AI Chatbot"}
