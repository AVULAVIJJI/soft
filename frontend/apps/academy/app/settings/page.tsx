"use client";
import { useState, useEffect } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "https://api.softmastertech.com";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [passwords, setPasswords] = useState({ current: "", new_pass: "", confirm: "" });
  const [notifications, setNotifications] = useState({ email_course: true, email_assignments: true, email_results: false, sms_live: true });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch(`${API}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setUser(d)).catch(() => null);
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new_pass !== passwords.confirm) { setMsg("New passwords do not match"); return; }
    setSaving(true);
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API}/api/auth/change-password`, {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ current_password: passwords.current, new_password: passwords.new_pass })
    }).catch(() => null);
    setMsg(res?.ok ? "Password changed successfully" : "Failed to change password");
    setSaving(false);
    if (res?.ok) setPasswords({ current: "", new_pass: "", confirm: "" });
  };

  const inputStyle = { width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: "0.9rem", boxSizing: "border-box" as const };
  const labelStyle = { fontSize: "0.85rem", fontWeight: 600, color: "#9ca3af", display: "block" as const, marginBottom: "0.4rem" };
  const sectionStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.75rem", marginBottom: "1.5rem" };

  return (
    <div style={{ padding: "2rem", background: "#0a0a0f", minHeight: "100vh", color: "#fff", maxWidth: 720 }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: "0.25rem" }}>Settings</h1>
      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>Manage your account preferences</p>

      {msg && <div style={{ background: msg.includes("success") ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${msg.includes("success") ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`, borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1.5rem", color: msg.includes("success") ? "#34d399" : "#f87171" }}>{msg}</div>}

      <div style={sectionStyle}>
        <h2 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>Account Info</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div><label style={labelStyle}>Full Name</label><div style={{ ...inputStyle, opacity: 0.6 }}>{user?.full_name || "..."}</div></div>
          <div><label style={labelStyle}>Email</label><div style={{ ...inputStyle, opacity: 0.6 }}>{user?.email || "..."}</div></div>
          <div><label style={labelStyle}>Role</label><div style={{ ...inputStyle, opacity: 0.6, textTransform: "capitalize" }}>{user?.role || "..."}</div></div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          <div style={{ marginBottom: "1rem" }}><label style={labelStyle}>Current Password</label><input type="password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} style={inputStyle} required /></div>
          <div style={{ marginBottom: "1rem" }}><label style={labelStyle}>New Password</label><input type="password" value={passwords.new_pass} onChange={e => setPasswords(p => ({ ...p, new_pass: e.target.value }))} style={inputStyle} required /></div>
          <div style={{ marginBottom: "1.25rem" }}><label style={labelStyle}>Confirm New Password</label><input type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} style={inputStyle} required /></div>
          <button type="submit" disabled={saving} style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#fff", border: "none", padding: "0.75rem 2rem", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>{saving ? "Saving..." : "Update Password"}</button>
        </form>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>Notification Preferences</h2>
        {Object.entries({ email_course: "Email: Course updates", email_assignments: "Email: Assignment reminders", email_results: "Email: Quiz results", sms_live: "SMS: Live class alerts" }).map(([key, label]) => (
          <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", padding: "0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
            <span style={{ fontSize: "0.9rem" }}>{label}</span>
            <div onClick={() => setNotifications(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
              style={{ width: 44, height: 24, borderRadius: 12, background: notifications[key as keyof typeof notifications] ? "#3b82f6" : "rgba(255,255,255,0.1)", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: notifications[key as keyof typeof notifications] ? 23 : 3, transition: "left 0.2s" }} />
            </div>
          </div>
        ))}
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontWeight: 700, marginBottom: "0.5rem", color: "#ef4444" }}>Danger Zone</h2>
        <p style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "1rem" }}>These actions are irreversible. Proceed with caution.</p>
        <button style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "0.6rem 1.25rem", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>Delete My Account</button>
      </div>
    </div>
  );
}
