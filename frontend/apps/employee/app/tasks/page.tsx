"use client";
import { useState, useEffect } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "https://api.softmastertech.com";

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch(`${API}/api/workspace/tasks`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setTasks(d.tasks || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const priorityColor: Record<string, string> = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };

  return (
    <div style={{ padding: "2rem", background: "#0a0a0f", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: "0.25rem" }}>My Tasks</h1>
      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>Tasks assigned to you</p>
      <div style={{ display: "grid", gap: "1rem" }}>
        {loading ? <div style={{ color: "#6b7280", textAlign: "center", padding: "3rem" }}>Loading tasks...</div> :
         tasks.length === 0 ? (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "3rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <div style={{ color: "#6b7280" }}>No tasks assigned yet. Check back later.</div>
          </div>
         ) :
         tasks.map((task, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{task.title}</div>
              {task.description && <div style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "0.25rem" }}>{task.description}</div>}
              {task.due_date && <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>Due: {task.due_date}</div>}
            </div>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexShrink: 0 }}>
              <span style={{ background: `${priorityColor[task.priority] || "#6b7280"}20`, color: priorityColor[task.priority] || "#6b7280", padding: "0.2rem 0.6rem", borderRadius: 6, fontSize: "0.75rem", fontWeight: 600, textTransform: "capitalize" }}>{task.priority}</span>
              <span style={{ background: task.status === "completed" ? "rgba(16,185,129,0.15)" : "rgba(59,130,246,0.15)", color: task.status === "completed" ? "#34d399" : "#60a5fa", padding: "0.2rem 0.6rem", borderRadius: 6, fontSize: "0.75rem", fontWeight: 600, textTransform: "capitalize" }}>{task.status}</span>
            </div>
          </div>
         ))
        }
      </div>
    </div>
  );
}
