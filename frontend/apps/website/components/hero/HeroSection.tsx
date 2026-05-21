"use client";
export default function HeroSection() {
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", color: "#fff", padding: "6rem 2rem 4rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-block", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 100, padding: "0.4rem 1.2rem", fontSize: "0.8rem", fontWeight: 700, color: "#60a5fa", marginBottom: "1.5rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Trusted Since 2000 — Hyderabad, India
          </div>
          <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.25rem" }}>
            India's Premier<br />
            <span style={{ background: "linear-gradient(90deg, #3b82f6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>IT Solutions</span> Company
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.1rem", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 480 }}>
            Softmaster Technology Solutions Pvt Ltd delivers custom ERP, hospital, school, and hotel management systems trusted by 1,700+ businesses across India for 24+ years.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="/services" style={{ background: "linear-gradient(135deg, #3b82f6, #7c3aed)", color: "#fff", padding: "0.9rem 2rem", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: "1rem" }}>Our Services</a>
            <a href="/contact" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "0.9rem 2rem", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: "1rem" }}>Get in Touch</a>
          </div>
          <div style={{ marginTop: "2.5rem", display: "flex", gap: "2rem" }}>
            {[["1700+", "Clients"], ["24+", "Years"], ["10+", "Products"]].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#60a5fa" }}>{num}</div>
                <div style={{ color: "#64748b", fontSize: "0.85rem" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "2rem" }}>
          <div style={{ fontWeight: 700, marginBottom: "1.25rem", color: "#94a3b8", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Contact Us</div>
          {[
            { icon: "📍", text: "12-18, Indira Nagar Colony, Peerzadiguda, Hyderabad, Telangana - 500039" },
            { icon: "📞", text: "+91 8500910044" },
            { icon: "📧", text: "contact@softmastertech.com" },
            { icon: "🌐", text: "softmastertech.com" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1rem" }}>{item.icon}</span>
              <span style={{ color: "#cbd5e1", fontSize: "0.9rem", lineHeight: 1.5 }}>{item.text}</span>
            </div>
          ))}
          <a href="/contact" style={{ display: "block", marginTop: "1.5rem", background: "linear-gradient(135deg, #3b82f6, #7c3aed)", color: "#fff", padding: "0.85rem", borderRadius: 10, textDecoration: "none", fontWeight: 700, textAlign: "center", fontSize: "0.95rem" }}>
            Start Your Project
          </a>
        </div>
      </div>
    </section>
  );
}

