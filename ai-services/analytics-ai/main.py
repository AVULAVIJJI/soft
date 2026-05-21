import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq

app = FastAPI(title="Softmaster Analytics AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))


@app.post("/insights")
async def generate_insights(data: dict):
    metrics = data.get("metrics", {})
    period = data.get("period", "this month")
    prompt = f"""Analyze these business metrics for {period} and provide insights.

Metrics: {json.dumps(metrics)}

Return JSON: {{"insights": ["insight1", "insight2"], "alerts": ["alert1"], "recommendations": ["rec1"], "trend": "positive/neutral/negative"}}
Return ONLY JSON."""

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=700,
        temperature=0.5
    )
    try:
        return json.loads(response.choices[0].message.content)
    except:
        return {"insights": ["Analytics generated"], "alerts": [], "recommendations": [], "trend": "neutral"}


@app.post("/forecast")
async def forecast(data: dict):
    historical_data = data.get("historical_data", [])
    metric = data.get("metric", "revenue")
    prompt = f"""Forecast {metric} for next 3 months based on this data: {json.dumps(historical_data)}

Return JSON: {{"forecast": [{{"month": "Month Year", "predicted_value": 0, "confidence": 0-100}}], "factors": []}}"""

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500,
        temperature=0.3
    )
    try:
        return json.loads(response.choices[0].message.content)
    except:
        return {"forecast": [], "factors": []}


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "analytics-ai"}
