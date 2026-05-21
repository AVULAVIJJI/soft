"use client";
import { useState, useEffect } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "https://api.softmastertech.com";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch(`${API}/api/projects/tickets/list`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setTickets(d.tickets || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? tickets : tickets.filter(t => t.status === filter);
  const statusColor: Record<string, string> = { open: "#f59e0b", in_progress: "#3b82f6", resolved: "#10b981", closed: "#6b7280" };
  const priorityColor: Record<string, string> = { critical: "#ef4444", high: "#f59e0b", medium: "#3b82f6", low: "#6b7280" };

  return (
    <div style={{ padding: "2rem", background: "#0a0a0f", minHeight: "100vh", color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div><h1 style={{ fontSize: "1.8rem", fontWeight: 900 }}>Support Tickets</h1><p style={{ color: "#6b7280" }}>All client support requests</p></div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["all", "open", "in_progress", "resolved", "closed"].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: "0.5rem 1rem", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem", textTransform: "capitalize", background: filter === s ? "#3b82f6" : "rgba(255,255,255,0.08)", color: filter === s ? "#fff" : "#9ca3af" }}>{s.replace("_", " ")}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gap: "1rem" }}>
        {loading ? <div style={{ color: "#6b7280", textAlign: "center", padding: "3rem" }}>Loading tickets...</div> :
         filtered.length === 0 ? <div style={{ color: "#6b7280", textAlign: "center", padding: "3rem" }}>No tickets found.</div> :
         filtered.map((t, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: 700 }}>{t.subject}</span>
                  <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>#{t.ticket_number}</span>
                </div>
                <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>{new Date(t.created_at).toLocaleDateString("en-IN")}</div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                <span style={{ background: `${priorityColor[t.priority] || "#6b7280"}20`, color: priorityColor[t.priority] || "#6b7280", padding: "0.2rem 0.6rem", borderRadius: 6, fontSize: "0.7rem", fontWeight: 700, textTransform: "capitalize" }}>{t.priority}</span>
                <span style={{ background: `${statusColor[t.status] || "#6b7280"}20`, color: statusColor[t.status] || "#6b7280", padding: "0.2rem 0.6rem", borderRadius: 6, fontSize: "0.7rem", fontWeight: 700, textTransform: "capitalize" }}>{t.status?.replace("_", " ")}</span>
              </div>
            </div>
          </div>
         ))
        }
      </div>
    </div>
  );
}
