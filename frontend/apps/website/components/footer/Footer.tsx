export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "#0f172a", color: "#94a3b8", padding: "4rem 2rem 2rem", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "3rem" }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: "1.2rem", color: "#fff", marginBottom: "0.75rem" }}>Softmaster Technology Solutions</div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.7, marginBottom: "1rem" }}>
              India's trusted enterprise software partner since 2000. Delivering ERP, hospital, school, hotel management and IT training solutions to 1,700+ businesses.
            </p>
            <div style={{ fontSize: "0.85rem" }}>
              <div style={{ marginBottom: "0.4rem" }}>📍 12-18, Indira Nagar Colony, Peerzadiguda</div>
              <div style={{ marginBottom: "0.4rem" }}>Hyderabad, Telangana - 500039</div>
              <div style={{ marginBottom: "0.4rem" }}>📞 +91 8500910044</div>
              <div>📧 contact@softmastertech.com</div>
            </div>
          </div>
          {[
            { title: "Services", links: [
                { label: "Custom Software", href: "/services" },
                { label: "Hospital System", href: "/services" },
                { label: "School System", href: "/services" },
                { label: "ERP Solutions", href: "/services" },
                { label: "IT Training", href: "http://localhost:3001" },
            ]},
            { title: "Portals", links: [
                { label: "Academy", href: "http://localhost:3001" },
{ label: "Jobs Portal", href: "http://localhost:3002" },
{ label: "Client Portal", href: "http://localhost:3003" },
{ label: "ERP Workspace", href: "http://localhost:3004" },
{ label: "Admin Panel", href: "http://localhost:3006" },
            ]},
            { title: "Company", links: [
                { label: "About Us", href: "/about" },
                { label: "Careers", href: "/careers" },
                { label: "Blog", href: "/blog" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms", href: "/terms" },
            ]},
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: "1rem", fontSize: "0.9rem" }}>{col.title}</div>
              {col.links.map(link => (
                <a key={link.label} href={link.href} style={{ display: "block", color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem", marginBottom: "0.5rem" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}
                >{link.label}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontSize: "0.8rem" }}>Copyright {year} Softmaster Technology Solutions Pvt Ltd. All rights reserved.</span>
          <span style={{ fontSize: "0.8rem" }}>CIN: U78100TS2024PTC191444 | Hyderabad, Telangana, India</span>
        </div>
      </div>
    </footer>
  );
}

