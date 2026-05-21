"use client";
import { useState, useEffect } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const FALLBACK = [
  { id:1, name:"JST Enterprises", sector:"Retail", location:"Hyderabad", product_used:"ERP / POS" },
  { id:2, name:"Crown Royal Hotel", sector:"Hospitality", location:"Hyderabad", product_used:"Hotel Management" },
  { id:3, name:"Apollo Hospitals", sector:"Healthcare", location:"Hyderabad", product_used:"Hospital Management" },
  { id:4, name:"Royal Institute of Technology", sector:"Education", location:"Hyderabad", product_used:"School Management" },
  { id:5, name:"District Collectorate", sector:"Government", location:"Hyderabad", product_used:"Office Management" },
  { id:6, name:"TravelStar India", sector:"Travel", location:"Hyderabad", product_used:"Travel Management" },
];

export default function ClientsPage() {
  const [clients, setClients] = useState(FALLBACK);

  useEffect(() => {
    fetch(`${API}/api/cms/clients`).then(r => r.json()).then(d => {
      if (d.clients?.length > 0) setClients(d.clients);
    }).catch(() => null);
  }, []);

  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <section style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)", padding: "6rem 2rem 4rem", textAlign: "center", color: "#fff" }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, marginBottom: "1rem" }}>Our Clients</h1>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem", maxWidth: 500, margin: "0 auto" }}>1700+ businesses across India trust Softmaster for reliable, scalable software.</p>
      </section>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {clients.map((c, i) => (
            <div key={c.id || i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ width: 48, height: 48, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: "1.2rem", marginBottom: "1rem" }}>{c.name[0]}</div>
              <h3 style={{ fontWeight: 700, color: "#0f172a", marginBottom: "0.25rem" }}>{c.name}</h3>
              <div style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{c.sector} · {c.location}</div>
              <span style={{ background: "#eff6ff", color: "#2563eb", padding: "0.2rem 0.6rem", borderRadius: 6, fontSize: "0.75rem", fontWeight: 600 }}>{c.product_used}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "4rem", background: "linear-gradient(135deg, #1e3a5f, #0f172a)", borderRadius: 20, padding: "3rem 2rem", textAlign: "center", color: "#fff" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: "0.75rem" }}>Ready to Join Our Client Family?</h2>
          <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>Get a free consultation from our team.</p>
          <a href="/contact" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#fff", padding: "0.9rem 2.5rem", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>Talk to Us</a>
        </div>
      </div>
    </main>
  );
}

