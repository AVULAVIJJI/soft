"use client";
import { useState } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch(`${API}/api/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }).catch(() => null);
    setSuccess(true);
    setLoading(false);
  };

  if (success) return (
    <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "2rem", textAlign: "center" }}>
      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✅</div>
      <div style={{ fontWeight: 700, color: "#15803d" }}>Thank you! We will get back to you within 1 business day.</div>
    </div>
  );

  const inputStyle = { width: "100%", padding: "0.75rem 1rem", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.9rem", boxSizing: "border-box" as const };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <input style={inputStyle} placeholder="Your Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
        <input style={inputStyle} type="email" placeholder="Email Address *" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
      </div>
      <input style={{ ...inputStyle, marginBottom: "1rem" }} placeholder="Phone Number" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
      <textarea style={{ ...inputStyle, minHeight: 120, resize: "vertical", fontFamily: "inherit", marginBottom: "1rem" }} placeholder="Your Message *" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required />
      <button type="submit" disabled={loading} style={{ width: "100%", background: "linear-gradient(135deg, #2563eb, #7c3aed)", color: "#fff", border: "none", padding: "1rem", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: "1rem" }}>{loading ? "Sending..." : "Send Message"}</button>
    </form>
  );
}

