"use client";
import { useState, useEffect } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const FALLBACK = [
  { id:1, icon:"💻", title:"Custom Software Development", description:"Bespoke enterprise solutions built for your unique business processes.", category:"Software" },
  { id:2, icon:"🏥", title:"Hospital Management System", description:"Complete HMS covering patient records, billing, pharmacy, lab and ward management.", category:"Healthcare" },
  { id:3, icon:"🏫", title:"School Management System", description:"End-to-end academic management from admissions to results and fee management.", category:"Education" },
  { id:4, icon:"🏨", title:"Hotel Management System", description:"Reservations, housekeeping, billing and guest management all in one platform.", category:"Hospitality" },
  { id:5, icon:"📊", title:"ERP Solutions", description:"ELEACC ERP integrating HR, finance, inventory, sales and supply chain.", category:"Enterprise" },
  { id:6, icon:"🎓", title:"IT Training Academy", description:"Professional IT courses with placements. 24+ years of industry-aligned curriculum.", category:"Training" },
  { id:7, icon:"🔧", title:"IT Support & Maintenance", description:"24/7 technical support, network management and system maintenance services.", category:"Support" },
  { id:8, icon:"🌐", title:"Web & Mobile Apps", description:"Responsive web applications and cross-platform mobile apps for all industries.", category:"Software" },
  { id:9, icon:"☁️", title:"Cloud & Hosting Solutions", description:"Secure cloud migrations, server setup and managed hosting with 99.9% uptime.", category:"Infrastructure" },
];

export default function ServicesPage() {
  const [services, setServices] = useState(FALLBACK);

  useEffect(() => {
    fetch(`${API}/api/cms/services-list`).then(r => r.json()).then(d => {
      if (d.services?.length > 0) setServices(d.services);
    }).catch(() => null);
  }, []);

  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <section style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)", padding: "6rem 2rem 4rem", textAlign: "center", color: "#fff" }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, marginBottom: "1rem" }}>Our Services</h1>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem", maxWidth: 550, margin: "0 auto" }}>Comprehensive technology solutions for every industry. Trusted by 1700+ businesses in India.</p>
      </section>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
          {services.map((sv, i) => (
            <div key={sv.id || i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "2rem", boxShadow: "0 4px 16px rgba(0,0,0,0.04)", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.04)"; }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{sv.icon || "⚙️"}</div>
              <h3 style={{ fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem", fontSize: "1.1rem" }}>{sv.title}</h3>
              <p style={{ color: "#475569", lineHeight: 1.7, fontSize: "0.9rem" }}>{sv.description}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#0f172a", marginBottom: "0.75rem" }}>Need a Custom Solution?</h2>
          <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>Contact our team for a free consultation and project estimate.</p>
          <a href="/contact" style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", color: "#fff", padding: "0.9rem 2.5rem", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>Get Free Consultation</a>
        </div>
      </div>
    </main>
  );
}

