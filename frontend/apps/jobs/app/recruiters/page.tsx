"use client";
import { useState, useEffect } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "https://api.softmastertech.com";

export default function RecruitersPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", job_type: "full_time", location: "Hyderabad", salary_min: "", salary_max: "", experience_years: "", skills_required: "" });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch(`${API}/api/jobs/?limit=50`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setJobs(d.jobs || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    const payload = { ...form, salary_min: Number(form.salary_min), salary_max: Number(form.salary_max), experience_years: Number(form.experience_years), skills_required: form.skills_required.split(",").map(s => s.trim()).filter(Boolean) };
    const res = await fetch(`${API}/api/jobs/`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch(() => null);
    if (res?.ok) { setShowForm(false); window.location.reload(); }
  };

  const inputStyle = { width: "100%", padding: "0.7rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: "0.9rem", boxSizing: "border-box" as const };
  const labelStyle = { fontSize: "0.8rem", fontWeight: 600, color: "#9ca3af", display: "block" as const, marginBottom: "0.3rem" };

  return (
    <div style={{ padding: "2rem", background: "#0a0a0f", minHeight: "100vh", color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div><h1 style={{ fontSize: "1.8rem", fontWeight: 900 }}>Recruiter Panel</h1><p style={{ color: "#6b7280" }}>Manage job postings</p></div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#fff", border: "none", padding: "0.75rem 1.5rem", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>+ Post New Job</button>
      </div>

      {showForm && (
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 14, padding: "2rem", marginBottom: "2rem" }}>
          <h2 style={{ fontWeight: 700, marginBottom: "1.5rem" }}>Post a New Job</h2>
          <form onSubmit={handlePost}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div><label style={labelStyle}>Job Title *</label><input style={inputStyle} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required placeholder="e.g. Full Stack Developer" /></div>
              <div><label style={labelStyle}>Job Type</label>
                <select style={inputStyle} value={form.job_type} onChange={e => setForm(p => ({ ...p, job_type: e.target.value }))}>
                  <option value="full_time">Full Time</option><option value="part_time">Part Time</option><option value="contract">Contract</option><option value="internship">Internship</option><option value="remote">Remote</option>
                </select>
              </div>
              <div><label style={labelStyle}>Location</label><input style={inputStyle} value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} /></div>
              <div><label style={labelStyle}>Experience (years)</label><input type="number" style={inputStyle} value={form.experience_years} onChange={e => setForm(p => ({ ...p, experience_years: e.target.value }))} /></div>
              <div><label style={labelStyle}>Min Salary (INR)</label><input type="number" style={inputStyle} value={form.salary_min} onChange={e => setForm(p => ({ ...p, salary_min: e.target.value }))} /></div>
              <div><label style={labelStyle}>Max Salary (INR)</label><input type="number" style={inputStyle} value={form.salary_max} onChange={e => setForm(p => ({ ...p, salary_max: e.target.value }))} /></div>
            </div>
            <div style={{ marginBottom: "1rem" }}><label style={labelStyle}>Skills Required (comma separated)</label><input style={inputStyle} value={form.skills_required} onChange={e => setForm(p => ({ ...p, skills_required: e.target.value }))} placeholder="React, Node.js, PostgreSQL" /></div>
            <div style={{ marginBottom: "1.25rem" }}><label style={labelStyle}>Job Description *</label><textarea style={{ ...inputStyle, minHeight: 120, resize: "vertical", fontFamily: "inherit" }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required /></div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#fff", border: "none", padding: "0.75rem 2rem", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Post Job</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "none", padding: "0.75rem 1.5rem", borderRadius: 8, cursor: "pointer" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: "grid", gap: "1rem" }}>
        {loading ? <div style={{ color: "#6b7280", textAlign: "center", padding: "3rem" }}>Loading...</div> :
          jobs.length === 0 ? <div style={{ color: "#6b7280", textAlign: "center", padding: "3rem" }}>No jobs posted yet.</div> :
          jobs.map((job, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{job.title}</div>
                <div style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.25rem" }}>{job.location} • {job.job_type?.replace("_", " ")} • {job.applications_count || 0} applications</div>
              </div>
              <span style={{ background: job.status === "open" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: job.status === "open" ? "#34d399" : "#f87171", padding: "0.2rem 0.6rem", borderRadius: 6, fontSize: "0.75rem", fontWeight: 700, textTransform: "capitalize" }}>{job.status}</span>
            </div>
          ))
        }
      </div>
    </div>
  );
}
