"use client";
import { useState, useEffect } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "https://api.softmastertech.com";

export default function LiveClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch(`${API}/api/courses/live-classes`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).catch(() => ({ classes: [] }))
      .then(d => { setClasses(d.classes || []); setLoading(false); });
  }, []);

  const upcoming = [
    { id: 1, title: "React Advanced Patterns", instructor: "Ravi Kumar", date: "2026-05-12", time: "10:00 AM", duration: "2 hrs", platform: "Zoom", status: "upcoming" },
    { id: 2, title: "Python Data Structures", instructor: "Priya Sharma", date: "2026-05-13", time: "2:00 PM", duration: "1.5 hrs", platform: "Google Meet", status: "upcoming" },
    { id: 3, title: "AWS Cloud Fundamentals", instructor: "Suresh Reddy", date: "2026-05-10", time: "11:00 AM", duration: "2 hrs", platform: "Zoom", status: "live" },
    { id: 4, title: "SQL for Beginners", instructor: "Meena Rao", date: "2026-05-08", time: "3:00 PM", duration: "1 hr", platform: "Google Meet", status: "completed" },
  ];

  const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
    live: { bg: "rgba(239,68,68,0.15)", color: "#f87171", label: "LIVE NOW" },
    upcoming: { bg: "rgba(59,130,246,0.15)", color: "#60a5fa", label: "Upcoming" },
    completed: { bg: "rgba(107,114,128,0.15)", color: "#9ca3af", label: "Completed" },
  };

  return (
    <div style={{ padding: "2rem", background: "#0a0a0f", minHeight: "100vh", color: "#fff" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 900 }}>Live Classes</h1>
        <p style={{ color: "#6b7280" }}>Attend live sessions with your instructors</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.25rem" }}>
        {upcoming.map(cls => {
          const st = statusStyle[cls.status];
          return (
            <div key={cls.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <h3 style={{ fontWeight: 700, fontSize: "1rem", flex: 1, marginRight: "0.5rem" }}>{cls.title}</h3>
                <span style={{ background: st.bg, color: st.color, padding: "0.2rem 0.6rem", borderRadius: 6, fontSize: "0.7rem", fontWeight: 700, flexShrink: 0 }}>{st.label}</span>
              </div>
              <div style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "0.4rem" }}>👨‍🏫 {cls.instructor}</div>
              <div style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "0.4rem" }}>📅 {cls.date} at {cls.time}</div>
              <div style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "0.4rem" }}>⏱ Duration: {cls.duration}</div>
              <div style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "1.25rem" }}>🎥 Platform: {cls.platform}</div>
              <button
                disabled={cls.status === "completed"}
                style={{ width: "100%", padding: "0.7rem", borderRadius: 8, border: "none", fontWeight: 700, cursor: cls.status === "completed" ? "not-allowed" : "pointer", background: cls.status === "live" ? "#ef4444" : cls.status === "upcoming" ? "#3b82f6" : "rgba(255,255,255,0.1)", color: cls.status === "completed" ? "#6b7280" : "#fff" }}>
                {cls.status === "live" ? "Join Now" : cls.status === "upcoming" ? "Set Reminder" : "View Recording"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
