"use client";
import { useState, useEffect } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const FALLBACK = [
  { id: 1, name: "Ramesh Babu", role: "Managing Director", company: "JST Enterprises", content: "Softmaster's ERP transformed our entire operation. Inventory, billing, and reports all in one place. Efficiency improved by 60% in the first 3 months.", rating: 5 },
  { id: 2, name: "Dr. Srinivas Reddy", role: "Director", company: "City Hospital Hyderabad", content: "The Hospital Management System is outstanding. Patient records, billing, pharmacy — all seamlessly connected. Highly recommend.", rating: 5 },
  { id: 3, name: "Anitha Sharma", role: "Principal", company: "Royal Institute of Technology", content: "School management has never been easier. Fee collection, attendance, results — all automated. Parents love the transparency.", rating: 5 },
];

export default function Testimonials() {
  const [items, setItems] = useState(FALLBACK);

  useEffect(() => {
    fetch(`${API}/api/cms/testimonials`).then(r => r.json()).then(d => {
      if (d.testimonials?.length > 0) setItems(d.testimonials);
    }).catch(() => null);
  }, []);

  return (
    <section style={{ padding: "5rem 2rem", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: "#0f172a", marginBottom: "0.75rem" }}>What Our Clients Say</h2>
          <p style={{ color: "#64748b", maxWidth: 500, margin: "0 auto" }}>Trusted by 1700+ businesses across India for 24+ years.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {items.map((t, i) => (
            <div key={t.id || i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "2rem", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", gap: "0.2rem", marginBottom: "1rem" }}>
                {"★★★★★".split("").slice(0, t.rating).map((_, j) => <span key={j} style={{ color: "#f59e0b" }}>★</span>)}
              </div>
              <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1.5rem", fontStyle: "italic", fontSize: "0.95rem" }}>"{t.content}"</p>
              <div style={{ fontWeight: 700, color: "#0f172a" }}>{t.name}</div>
              <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "0.2rem" }}>{t.role}{t.company ? ` — ${t.company}` : ""}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

