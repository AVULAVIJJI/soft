"use client";
import { useState, useEffect } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "https://api.softmastertech.com";

export default function JobsAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch(`${API}/api/analytics/jobs`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setStats(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: "Total Jobs", value: stats.total_jobs, icon: "💼", color: "#3b82f6" },
    { label: "Open Jobs", value: stats.open_jobs, icon: "🟢", color: "#10b981" },
    { label: "Closed Jobs", value: stats.closed_jobs, icon: "🔴", color: "#ef4444" },
    { label: "Total Applications", value: stats.total_applications, icon: "📋", color: "#8b5cf6" },
    { label: "Hired", value: stats.hired_count, icon: "✅", color: "#f59e0b" },
    { label: "Placement Rate", value: stats.total_applications > 0 ? `${((stats.hired_count / stats.total_applications) * 100).toFixed(1)}%` : "0%", icon: "📈", color: "#06b6d4" },
  ] : [];

  return (
    <div style={{ padding: "2rem", background: "#0a0a0f", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: "0.25rem" }}>Jobs Analytics</h1>
      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>Recruitment performance overview</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1.25rem" }}>
        {loading ? <div style={{ color: "#6b7280", gridColumn: "1/-1", textAlign: "center", padding: "3rem" }}>Loading analytics...</div> :
          cards.map((c, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${c.color}30`, borderRadius: 14, padding: "1.5rem", borderTop: `3px solid ${c.color}` }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{c.icon}</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: c.color }}>{c.value}</div>
              <div style={{ color: "#6b7280", fontSize: "0.8rem", marginTop: "0.25rem" }}>{c.label}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
