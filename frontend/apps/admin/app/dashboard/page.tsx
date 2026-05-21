"use client";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.softmastertech.com";

interface Stats {
  total_users: number;
  total_students: number;
  total_courses: number;
  total_jobs: number;
  total_enrollments: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ total_users: 0, total_students: 0, total_courses: 0, total_jobs: 0, total_enrollments: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    Promise.all([
      fetch(`${API_URL}/api/v1/analytics/dashboard`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => ({ summary: {} })),
      fetch(`${API_URL}/api/v1/users/?limit=5`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => ({ users: [] }))
    ]).then(([analytics, usersData]) => {
      if (analytics.summary) setStats({ ...analytics.summary });
      if (usersData.users) setUsers(usersData.users);
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.total_users, color: "#3b82f6", icon: "👥" },
    { label: "Students", value: stats.total_students, color: "#8b5cf6", icon: "🎓" },
    { label: "Courses", value: stats.total_courses, color: "#10b981", icon: "📚" },
    { label: "Open Jobs", value: stats.total_jobs, color: "#f59e0b", icon: "💼" },
    { label: "Enrollments", value: stats.total_enrollments, color: "#ef4444", icon: "📝" },
    { label: "Revenue", value: "INR 0", color: "#06b6d4", icon: "💰" },
  ];

  return (
    <div style={{ padding: "2rem", background: "#0a0a0f", minHeight: "100vh", color: "#fff" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: "0.25rem" }}>Admin Dashboard</h1>
        <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Softmaster Technology Solutions — Platform Overview</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        {statCards.map((card, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${card.color}30`, borderRadius: 14, padding: "1.5rem", borderTop: `3px solid ${card.color}` }}>
            <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{card.icon}</div>
            <div style={{ fontSize: loading ? "1rem" : "1.8rem", fontWeight: 900, color: card.color }}>{loading ? "..." : card.value}</div>
            <div style={{ color: "#6b7280", fontSize: "0.8rem", marginTop: "0.25rem" }}>{card.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        {/* Recent Users */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.5rem" }}>
          <h2 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>Recent Users</h2>
          {loading ? (
            <div style={{ color: "#6b7280" }}>Loading...</div>
          ) : users.length === 0 ? (
            <div style={{ color: "#6b7280", textAlign: "center", padding: "2rem" }}>No users found</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {["Name", "Email", "Role", "Status"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "#6b7280", fontSize: "0.8rem", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user: any, i: number) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "0.75rem", fontSize: "0.9rem" }}>{user.full_name}</td>
                    <td style={{ padding: "0.75rem", fontSize: "0.85rem", color: "#9ca3af" }}>{user.email}</td>
                    <td style={{ padding: "0.75rem" }}>
                      <span style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa", padding: "0.2rem 0.6rem", borderRadius: 6, fontSize: "0.75rem", fontWeight: 600 }}>{user.role}</span>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <span style={{ background: user.is_active ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: user.is_active ? "#34d399" : "#f87171", padding: "0.2rem 0.6rem", borderRadius: 6, fontSize: "0.75rem" }}>{user.is_active ? "Active" : "Inactive"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.5rem" }}>
          <h2 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>Quick Actions</h2>
          {[
            { label: "Manage Users", href: "/users", icon: "👥", color: "#3b82f6" },
            { label: "View Analytics", href: "/analytics", icon: "📊", color: "#8b5cf6" },
            { label: "Revenue Reports", href: "/revenue", icon: "💰", color: "#10b981" },
            { label: "Audit Logs", href: "/audit-logs", icon: "📋", color: "#f59e0b" },
            { label: "Notifications", href: "/notifications", icon: "🔔", color: "#ef4444" },
            { label: "Settings", href: "/settings", icon: "⚙️", color: "#6b7280" },
          ].map((action, i) => (
            <a key={i} href={action.href} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", borderRadius: 10, textDecoration: "none", color: "#fff", marginBottom: "0.5rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = `${action.color}15`; e.currentTarget.style.borderColor = `${action.color}40`; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
            >
              <span style={{ fontSize: "1.1rem" }}>{action.icon}</span>
              <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{action.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
