import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq

app = FastAPI(title="Softmaster Recommendation Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))


@app.post("/courses")
async def recommend_courses(data: dict):
    user_profile = data.get("user_profile", {})
    available_courses = data.get("available_courses", [])
    prompt = f"""Based on this learner profile, recommend the best courses from the list.

Profile: {json.dumps(user_profile)}
Available Courses: {json.dumps(available_courses[:20])}

Return JSON: {{"recommendations": [{{"course_id": 1, "reason": "why", "priority": "high/medium/low"}}]}}
Return ONLY JSON."""

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=600,
        temperature=0.4
    )
    try:
        return json.loads(response.choices[0].message.content)
    except:
        return {"recommendations": []}


@app.post("/jobs")
async def recommend_jobs(data: dict):
    candidate_profile = data.get("candidate_profile", {})
    available_jobs = data.get("available_jobs", [])
    prompt = f"""Match this candidate to the best jobs.

Candidate: {json.dumps(candidate_profile)}
Jobs: {json.dumps(available_jobs[:20])}

Return JSON: {{"matches": [{{"job_id": 1, "match_score": 85, "reason": "why matched"}}]}}
Return ONLY JSON."""

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=600,
        temperature=0.4
    )
    try:
        return json.loads(response.choices[0].message.content)
    except:
        return {"matches": []}


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "recommendation-engine"}
