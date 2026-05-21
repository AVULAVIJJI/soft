"use client";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const contactInfo = [
  { icon: "📍", label: "Address", value: "12-18, Indira Nagar Colony, Peerzadiguda, Hyderabad, Telangana - 500039" },
  { icon: "📞", label: "Phone", value: "+91 8500910044" },
  { icon: "📧", label: "Email", value: "contact@softmastertech.com" },
  { icon: "🌐", label: "Website", value: "softmastertech.com" },
  { icon: "🕒", label: "Hours", value: "Mon - Sat: 9:00 AM - 6:00 PM" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", inquiry_type: "general" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/v1/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", email: "", phone: "", subject: "", message: "", inquiry_type: "general" });
      } else {
        throw new Error("Failed");
      }
    } catch {
      setError("Failed to send. Please email us at contact@softmastertech.com or call +91 8500910044");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <section style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)", padding: "6rem 2rem 4rem", textAlign: "center", color: "#fff" }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, marginBottom: "1rem" }}>Contact Us</h1>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem", maxWidth: 500, margin: "0 auto" }}>
          Talk to our team. We are ready to help with software projects, training enrollment, and support.
        </p>
      </section>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem", display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "3rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem", color: "#0f172a" }}>Get in Touch</h2>
          {contactInfo.map((info, i) => (
            <div key={i} style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem", alignItems: "flex-start" }}>
              <div style={{ width: 44, height: 44, background: "#eff6ff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>{info.icon}</div>
              <div>
                <div style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.9rem" }}>{info.label}</div>
                <div style={{ color: "#475569", fontSize: "0.9rem", marginTop: "0.2rem" }}>{info.value}</div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: "2rem", borderRadius: 14, overflow: "hidden", border: "1px solid #e2e8f0" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.4327!2d78.5797!3d17.4274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9c7f3e4a5a5a%3A0xabcdef1234567890!2sPerezadiguda%2C%20Hyderabad%2C%20Telangana%20500039!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="220"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div style={{ marginTop: "1.5rem", padding: "1.25rem", background: "#eff6ff", borderRadius: 12 }}>
            <div style={{ fontWeight: 700, color: "#1e40af", marginBottom: "0.75rem" }}>Quick Links</div>
            {[
              { label: "Enroll in Academy", href: "http://localhost:3001" },
{ label: "Browse Jobs", href: "http://localhost:3002" },
{ label: "Client Portal Login", href: "http://localhost:3003" },
            ].map(link => (
              <a key={link.label} href={link.href} style={{ display: "block", color: "#2563eb", fontSize: "0.9rem", marginBottom: "0.4rem", textDecoration: "none", fontWeight: 500 }}>
                {"> " + link.label}
              </a>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: "2.5rem", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem", color: "#0f172a" }}>Send a Message</h2>

          {success ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
              <h3 style={{ fontWeight: 700, color: "#15803d", marginBottom: "0.5rem" }}>Message Sent!</h3>
              <p style={{ color: "#475569" }}>Our team will respond within 1 business day.</p>
              <button onClick={() => setSuccess(false)} style={{ marginTop: "1.5rem", background: "#2563eb", color: "#fff", border: "none", padding: "0.75rem 2rem", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "0.75rem 1rem", color: "#dc2626", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</div>}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.4rem" }}>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.9rem", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.4rem" }}>Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.9rem", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.4rem" }}>Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.9rem", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.4rem" }}>Inquiry Type</label>
                  <select name="inquiry_type" value={form.inquiry_type} onChange={handleChange} style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.9rem", background: "#fff", boxSizing: "border-box" }}>
                    <option value="general">General Inquiry</option>
                    <option value="software">Software Project</option>
                    <option value="academy">Academy Enrollment</option>
                    <option value="support">Technical Support</option>
                    <option value="erp">ERP / Products</option>
                    <option value="jobs">Jobs / Recruitment</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.4rem" }}>Subject *</label>
                <input name="subject" value={form.subject} onChange={handleChange} required placeholder="What is this about?" style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.9rem", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.4rem" }}>Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Describe your requirement in detail..." style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.9rem", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
              <button type="submit" disabled={loading} style={{ width: "100%", background: loading ? "#93c5fd" : "linear-gradient(135deg, #2563eb, #7c3aed)", color: "#fff", border: "none", padding: "1rem", borderRadius: 10, fontSize: "1rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

