"use client";
import { useState } from "react";

const roles = [
  { name: "super_admin", label: "Super Admin", color: "#ef4444", permissions: ["all"] },
  { name: "admin", label: "Admin", color: "#f59e0b", permissions: ["users", "courses", "jobs", "analytics", "settings"] },
  { name: "hr", label: "HR Manager", color: "#8b5cf6", permissions: ["users", "attendance", "payroll", "leaves"] },
  { name: "trainer", label: "Trainer", color: "#3b82f6", permissions: ["courses", "lessons", "quizzes", "assignments"] },
  { name: "recruiter", label: "Recruiter", color: "#10b981", permissions: ["jobs", "applications", "interviews"] },
  { name: "student", label: "Student", color: "#06b6d4", permissions: ["courses_view", "assignments_submit", "certificates"] },
  { name: "client", label: "Client", color: "#6b7280", permissions: ["projects_view", "tickets", "invoices_view"] },
  { name: "employee", label: "Employee", color: "#84cc16", permissions: ["attendance_self", "leaves_self", "payslips_self"] },
];

const allPermissions = ["users", "courses", "courses_view", "lessons", "quizzes", "assignments", "assignments_submit", "jobs", "applications", "interviews", "analytics", "settings", "attendance", "attendance_self", "payroll", "leaves", "leaves_self", "payslips_self", "projects_view", "tickets", "invoices_view", "certificates", "all"];

export default function PermissionsPage() {
  const [selected, setSelected] = useState("admin");
  const role = roles.find(r => r.name === selected)!;

  return (
    <div style={{ padding: "2rem", background: "#0a0a0f", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: "0.25rem" }}>Role Permissions</h1>
      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>Manage what each role can access</p>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "1.5rem" }}>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1rem", height: "fit-content" }}>
          <div style={{ fontWeight: 700, marginBottom: "1rem", color: "#9ca3af", fontSize: "0.8rem", textTransform: "uppercase" }}>Roles</div>
          {roles.map(r => (
            <div key={r.name} onClick={() => setSelected(r.name)}
              style={{ padding: "0.85rem 1rem", borderRadius: 10, cursor: "pointer", marginBottom: "0.5rem", background: selected === r.name ? `${r.color}15` : "transparent", border: selected === r.name ? `1px solid ${r.color}40` : "1px solid transparent", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
              <span style={{ fontWeight: selected === r.name ? 700 : 400 }}>{r.label}</span>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: role.color }} />
            <h2 style={{ fontWeight: 700 }}>{role.label} Permissions</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
            {allPermissions.map(perm => {
              const hasIt = role.permissions.includes(perm) || role.permissions.includes("all");
              return (
                <div key={perm} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.03)", borderRadius: 8, opacity: hasIt ? 1 : 0.4 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, background: hasIt ? role.color : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {hasIt && <span style={{ color: "#fff", fontSize: "10px", fontWeight: 900 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: "0.85rem", textTransform: "capitalize" }}>{perm.replace(/_/g, " ")}</span>
                </div>
              );
            })}
          </div>
          {role.name !== "super_admin" && (
            <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 8, color: "#60a5fa", fontSize: "0.85rem" }}>
              Permission changes are applied instantly. Contact Super Admin to modify role permissions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
