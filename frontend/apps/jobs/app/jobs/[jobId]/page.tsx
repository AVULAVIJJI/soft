"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
const API = process.env.NEXT_PUBLIC_API_URL || "https://api.softmastertech.com";

export default function JobDetailPage() {
  const { jobId } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/jobs/${jobId}`).then(r => r.json()).then(d => { setJob(d); setLoading(false); }).catch(() => setLoading(false));
  }, [jobId]);

  const handleApply = async () => {
    setApplying(true);
    const token = localStorage.getItem("access_token");
    if (!token) { router.push("/login"); return; }
    const res = await fetch(`${API}/api/jobs/${jobId}/apply`, {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ cover_letter: "" })
    }).catch(() => null);
    if (res?.ok) setApplied(true);
    setApplying(false);
  };

  if (loading) return <div style={{ padding: "4rem", textAlign: "center", color: "#6b7280", background: "#0a0a0f", minHeight: "100vh" }}>Loading job details...</div>;
  if (!job) return <div style={{ padding: "4rem", textAlign: "center", color: "#6b7280", background: "#0a0a0f", minHeight: "100vh" }}>Job not found.</div>;

  return (
    <div style={{ padding: "2rem", background: "#0a0a0f", minHeight: "100vh", color: "#fff", maxWidth: 860, margin: "0 auto" }}>
      <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer", marginBottom: "1.5rem", fontSize: "0.9rem" }}>← Back to Jobs</button>

      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "2rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 900, marginBottom: "0.25rem" }}>{job.title}</h1>
            <div style={{ color: "#9ca3af", fontSize: "0.95rem" }}>{job.company} • {job.location || "Hyderabad"}</div>
          </div>
          {applied ? (
            <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: "0.75rem 1.5rem", color: "#34d399", fontWeight: 700 }}>Applied ✓</div>
          ) : (
            <button onClick={handleApply} disabled={applying} style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#fff", border: "none", padding: "0.85rem 2rem", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: "1rem" }}>
              {applying ? "Applying..." : "Apply Now"}
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
          {[
            { label: job.job_type?.replace("_", " ") || "Full Time" },
            { label: job.is_remote ? "Remote" : "On-site" },
            { label: job.experience_years ? `${job.experience_years}+ years` : "Any experience" },
            { label: job.salary_min && job.salary_max ? `INR ${(job.salary_min/100000).toFixed(1)}L - ${(job.salary_max/100000).toFixed(1)}L` : "Salary negotiable" },
          ].map((tag, i) => (
            <span key={i} style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa", padding: "0.35rem 0.9rem", borderRadius: 8, fontSize: "0.8rem", fontWeight: 600, textTransform: "capitalize" }}>{tag.label}</span>
          ))}
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "2rem", marginBottom: "1.5rem" }}>
        <h2 style={{ fontWeight: 700, marginBottom: "1rem" }}>Job Description</h2>
        <p style={{ color: "#d1d5db", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{job.description}</p>
      </div>

      {job.requirements && (
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "2rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontWeight: 700, marginBottom: "1rem" }}>Requirements</h2>
          <p style={{ color: "#d1d5db", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{job.requirements}</p>
        </div>
      )}

      {job.skills_required?.length > 0 && (
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "2rem" }}>
          <h2 style={{ fontWeight: 700, marginBottom: "1rem" }}>Required Skills</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {job.skills_required.map((skill: string, i: number) => (
              <span key={i} style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "#a78bfa", padding: "0.3rem 0.8rem", borderRadius: 6, fontSize: "0.85rem" }}>{skill}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
