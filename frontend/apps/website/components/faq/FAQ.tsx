"use client";
import { useState, useEffect } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const FALLBACK = [
  { id: 1, question: "What types of software does Softmaster build?", answer: "We build custom ERP, Hospital Management, School Management, Hotel Management, POS software, mobile apps, and full enterprise web platforms." },
  { id: 2, question: "How long does project delivery take?", answer: "A basic system takes 4-8 weeks. An enterprise ERP takes 3-6 months. We provide a detailed timeline after consultation." },
  { id: 3, question: "Do you provide post-delivery support?", answer: "Yes. All projects include 3-12 months of free support. We also offer annual maintenance contracts (AMC)." },
  { id: 4, question: "How do I get started?", answer: "Contact us at contact@softmastertech.com or call +91 8500910044. We will schedule a free consultation and proposal." },
];

export default function FAQ() {
  const [items, setItems] = useState(FALLBACK);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API}/api/cms/faqs`).then(r => r.json()).then(d => {
      if (d.faqs?.length > 0) setItems(d.faqs);
    }).catch(() => null);
  }, []);

  return (
    <section style={{ padding: "5rem 2rem", background: "#fff" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: "#0f172a", marginBottom: "0.75rem" }}>Frequently Asked Questions</h2>
          <p style={{ color: "#64748b" }}>Quick answers to common questions about our services.</p>
        </div>
        {items.map((faq, i) => (
          <div key={faq.id || i} style={{ border: "1px solid #e2e8f0", borderRadius: 12, marginBottom: "0.75rem", overflow: "hidden" }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", padding: "1.25rem 1.5rem", background: open === i ? "#eff6ff" : "#fff", border: "none", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>{faq.question}</span>
              <span style={{ color: "#3b82f6", fontSize: "1.2rem", flexShrink: 0, fontWeight: 900 }}>{open === i ? "−" : "+"}</span>
            </button>
            {open === i && <div style={{ padding: "0 1.5rem 1.25rem", color: "#475569", lineHeight: 1.7, fontSize: "0.9rem" }}>{faq.answer}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

