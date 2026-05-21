"use client";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.softmastertech.com";

export default function AcademyDashboard() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    Promise.all([
      fetch(`${API_URL}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => null),
      fetch(`${API_URL}/api/courses/my-courses`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => ({ enrollments: [] }))
    ]).then(([userData, courseData]) => {
      if (userData) setUser(userData);
      if (courseData.enrollments) setEnrollments(courseData.enrollments);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ padding: "2rem", background: "#0a0a0f", minHeight: "100vh", color: "#fff" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 900 }}>Welcome back{user ? `, ${user.full_name.split(" ")[0]}` : ""}!</h1>
        <p style={{ color: "#6b7280" }}>Continue your learning journey</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Enrolled Courses", value: enrollments.length, icon: "📚", color: "#3b82f6" },
          { label: "Completed", value: enrollments.filter(e => e.status === "completed").length, icon: "✅", color: "#10b981" },
          { label: "In Progress", value: enrollments.filter(e => e.status === "active").length, icon: "⏳", color: "#f59e0b" },
          { label: "Certificates", value: 0, icon: "🏆", color: "#8b5cf6" },
        ].map((card, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${card.color}30`, borderRadius: 14, padding: "1.25rem", borderTop: `3px solid ${card.color}` }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{card.icon}</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 900, color: card.color }}>{loading ? "..." : card.value}</div>
            <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>{card.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontWeight: 700 }}>My Courses</h2>
          <a href="/courses" style={{ color: "#60a5fa", fontSize: "0.85rem", textDecoration: "none" }}>Browse All Courses</a>
        </div>
        {loading ? (
          <div style={{ color: "#6b7280", textAlign: "center", padding: "2rem" }}>Loading your courses...</div>
        ) : enrollments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
            <p style={{ color: "#6b7280", marginBottom: "1rem" }}>You are not enrolled in any courses yet.</p>
            <a href="/courses" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#fff", padding: "0.75rem 1.5rem", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>Explore Courses</a>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {enrollments.map((e, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{e.course_title}</div>
                  <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>Enrolled: {e.enrolled_at ? new Date(e.enrolled_at).toLocaleDateString() : "N/A"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 100, height: 6, width: 120 }}>
                      <div style={{ background: "linear-gradient(90deg, #3b82f6, #8b5cf6)", height: 6, borderRadius: 100, width: `${e.progress_percent || 0}%` }} />
                    </div>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#60a5fa" }}>{e.progress_percent || 0}% complete</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
