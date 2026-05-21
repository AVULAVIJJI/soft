"use client";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.softmastertech.com";

export default function ClientDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    Promise.all([
      fetch(`${API_URL}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => null),
      fetch(`${API_URL}/api/projects/`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => ({ projects: [] })),
      fetch(`${API_URL}/api/projects/tickets/list`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => ({ tickets: [] })),
      fetch(`${API_URL}/api/projects/invoices/list`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => ({ invoices: [] }))
    ]).then(([u, p, t, inv]) => {
      setUser(u);
      setProjects(p.projects || []);
      setTickets(t.tickets || []);
      setInvoices(inv.invoices || []);
      setLoading(false);
    });
  }, []);

  const statusColors: Record<string, string> = {
    active: "#10b981", completed: "#3b82f6", planning: "#f59e0b",
    on_hold: "#ef4444", open: "#f59e0b", resolved: "#10b981",
    paid: "#10b981", overdue: "#ef4444", sent: "#3b82f6"
  };

  return (
    <div style={{ padding: "2rem", background: "#0a0a0f", minHeight: "100vh", color: "#fff" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 900 }}>Client Portal</h1>
        <p style={{ color: "#6b7280" }}>Welcome, {user?.full_name || "Client"}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Active Projects", value: projects.filter(p => p.status === "active").length, icon: "🚀", color: "#3b82f6" },
          { label: "Open Tickets", value: tickets.filter(t => t.status === "open").length, icon: "🎫", color: "#f59e0b" },
          { label: "Pending Invoices", value: invoices.filter(i => i.status === "sent").length, icon: "📄", color: "#8b5cf6" },
          { label: "Total Projects", value: projects.length, icon: "📁", color: "#10b981" },
        ].map((card, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${card.color}30`, borderRadius: 14, padding: "1.25rem", borderTop: `3px solid ${card.color}` }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{card.icon}</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 900, color: card.color }}>{loading ? "..." : card.value}</div>
            <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>{card.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Projects */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontWeight: 700 }}>My Projects</h2>
            <a href="/projects" style={{ color: "#60a5fa", fontSize: "0.8rem", textDecoration: "none" }}>View All</a>
          </div>
          {loading ? <div style={{ color: "#6b7280" }}>Loading...</div> :
            projects.length === 0 ? <div style={{ color: "#6b7280", textAlign: "center", padding: "1.5rem" }}>No projects yet</div> :
            projects.slice(0, 4).map((p, i) => (
              <div key={i} style={{ marginBottom: "0.75rem", padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{p.title}</div>
                  <span style={{ background: `${statusColors[p.status] || "#6b7280"}20`, color: statusColors[p.status] || "#6b7280", padding: "0.15rem 0.5rem", borderRadius: 6, fontSize: "0.7rem", fontWeight: 600 }}>{p.status}</span>
                </div>
                <div style={{ marginTop: "0.5rem" }}>
                  <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 100, height: 4 }}>
                    <div style={{ background: "#3b82f6", height: 4, borderRadius: 100, width: `${p.progress_percent || 0}%` }} />
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>{p.progress_percent || 0}% complete</div>
                </div>
              </div>
            ))
          }
        </div>

        {/* Tickets */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontWeight: 700 }}>Support Tickets</h2>
            <a href="/support" style={{ color: "#60a5fa", fontSize: "0.8rem", textDecoration: "none" }}>View All</a>
          </div>
          {loading ? <div style={{ color: "#6b7280" }}>Loading...</div> :
            tickets.length === 0 ? <div style={{ color: "#6b7280", textAlign: "center", padding: "1.5rem" }}>No tickets</div> :
            tickets.slice(0, 4).map((t, i) => (
              <div key={i} style={{ marginBottom: "0.75rem", padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{t.subject}</div>
                  <div style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: "0.2rem" }}>{t.ticket_number}</div>
                </div>
                <span style={{ background: `${statusColors[t.status] || "#6b7280"}20`, color: statusColors[t.status] || "#6b7280", padding: "0.15rem 0.5rem", borderRadius: 6, fontSize: "0.7rem", fontWeight: 600 }}>{t.status}</span>
              </div>
            ))
          }
          <button onClick={() => window.location.href="/support"} style={{ width: "100%", marginTop: "0.5rem", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", color: "#60a5fa", padding: "0.6rem", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
            New Support Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
