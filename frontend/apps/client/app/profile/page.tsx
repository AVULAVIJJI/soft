"use client";
import { useState, useEffect } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "https://api.softmastertech.com";

export default function ClientProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ full_name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch(`${API}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setUser(d); setForm({ full_name: d.full_name || "", phone: d.phone || "" }); }).catch(() => null);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API}/api/users/${user?.id}`, { method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(form) }).catch(() => null);
    setMsg(res?.ok ? "Profile updated successfully" : "Failed to update");
    setSaving(false);
  };

  const inputStyle = { width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: "0.9rem", boxSizing: "border-box" as const };
  const labelStyle = { fontSize: "0.85rem", fontWeight: 600, color: "#9ca3af", display: "block" as const, marginBottom: "0.4rem" };

  return (
    <div style={{ padding: "2rem", background: "#0a0a0f", minHeight: "100vh", color: "#fff", maxWidth: 600 }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: "2rem" }}>My Profile</h1>
      {msg && <div style={{ background: msg.includes("success") ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${msg.includes("success") ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`, borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1.5rem", color: msg.includes("success") ? "#34d399" : "#f87171" }}>{msg}</div>}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "2rem" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: 900, marginBottom: "1.5rem" }}>
          {user?.full_name?.[0] || "C"}
        </div>
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: "1rem" }}><label style={labelStyle}>Full Name</label><input style={inputStyle} value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} /></div>
          <div style={{ marginBottom: "1rem" }}><label style={labelStyle}>Email</label><input style={{ ...inputStyle, opacity: 0.6 }} value={user?.email || ""} disabled /></div>
          <div style={{ marginBottom: "1.5rem" }}><label style={labelStyle}>Phone</label><input style={inputStyle} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" /></div>
          <div style={{ marginBottom: "1rem" }}><label style={labelStyle}>Role</label><input style={{ ...inputStyle, opacity: 0.6, textTransform: "capitalize" }} value={user?.role || ""} disabled /></div>
          <button type="submit" disabled={saving} style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#fff", border: "none", padding: "0.75rem 2rem", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>{saving ? "Saving..." : "Save Changes"}</button>
        </form>
      </div>
    </div>
  );
}
