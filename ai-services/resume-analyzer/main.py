import os
import json
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import PyPDF2
import io

app = FastAPI(title="Softmaster Resume Analyzer AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))


def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text


@app.post("/analyze")
async def analyze_resume(file: UploadFile = File(...), job_description: str = "General IT position"):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    content = await file.read()
    resume_text = extract_text_from_pdf(content)
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")
    prompt = f"""Analyze this resume for the following job: {job_description}

Resume Content:
{resume_text[:3000]}

Provide a JSON response with these fields:
- overall_score (0-100)
- skills_match (list of matched skills)
- missing_skills (list of missing skills for the job)
- strengths (list of resume strengths)
- improvements (list of improvement suggestions)
- summary (brief overall assessment)
- recommendation (hire/maybe/reject)

Return ONLY valid JSON, no extra text."""

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000,
        temperature=0.3
    )
    result_text = response.choices[0].message.content
    try:
        result = json.loads(result_text)
    except json.JSONDecodeError:
        result = {
            "overall_score": 70,
            "skills_match": [],
            "missing_skills": [],
            "strengths": ["Resume analyzed"],
            "improvements": ["Unable to fully parse resume"],
            "summary": result_text[:500],
            "recommendation": "maybe"
        }
    return {"analysis": result, "resume_length": len(resume_text)}


@app.post("/score-text")
async def score_resume_text(data: dict):
    resume_text = data.get("text", "")
    job_description = data.get("job_description", "General position")
    if not resume_text:
        raise HTTPException(status_code=400, detail="Resume text is required")
    prompt = f"""Rate this resume for: {job_description}

Resume: {resume_text[:2000]}

Return JSON: {{"score": 0-100, "feedback": "brief feedback", "top_skills": [], "recommendation": "hire/maybe/reject"}}"""

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500,
        temperature=0.3
    )
    try:
        return {"result": json.loads(response.choices[0].message.content)}
    except:
        return {"result": {"score": 65, "feedback": response.choices[0].message.content[:200], "top_skills": [], "recommendation": "maybe"}}


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "resume-analyzer"}
