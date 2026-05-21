"use client";
import { useState, useEffect } from "react";

const PORTALS = [
  { icon: "🎓", title: "Academy", desc: "Professional IT courses, live classes & certifications", href: "http://localhost:3001", color: "#3b82f6", badge: "Learn" },
  { icon: "🏢", title: "Admin Panel", desc: "Platform management, analytics & user control", href: "http://localhost:3002", color: "#8b5cf6", badge: "Admin" },
  { icon: "👤", title: "Client Portal", desc: "Track projects, invoices & support tickets", href: "http://localhost:3003", color: "#06b6d4", badge: "Client" },
  { icon: "🖥️", title: "ERP Workspace", desc: "HR, payroll, attendance & task management", href: "http://localhost:3004", color: "#10b981", badge: "ERP" },
  { icon: "👨‍💼", title: "Employee Portal", desc: "Attendance, leaves, payslips & profile", href: "http://localhost:3005", color: "#f59e0b", badge: "Employee" },
  { icon: "💼", title: "Jobs Portal", desc: "Job listings, applications & recruitment", href: "http://localhost:3006", color: "#ef4444", badge: "Jobs" },
  { icon: "🎯", title: "Placement Portal", desc: "Campus placements & career opportunities", href: "http://localhost:3007", color: "#ec4899", badge: "Placement" },
];

export default function HomePage() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);

  useEffect(() => {
    const animate = (target: number, setter: (v: number) => void, duration: number) => {
      let start = 0;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { setter(target); clearInterval(timer); }
        else setter(Math.floor(start));
      }, 16);
    };
    animate(1700, setCount1, 1500);
    animate(24, setCount2, 1200);
    animate(9, setCount3, 1000);
  }, []);

  const services = [
    { icon: "💻", title: "Custom Software Development", desc: "Bespoke enterprise solutions built for your unique business processes and workflows." },
    { icon: "🏥", title: "Hospital Management System", desc: "Complete HMS covering patient records, billing, pharmacy, lab and ward management." },
    { icon: "🏫", title: "School Management System", desc: "End-to-end academic management from admissions to results and fee management." },
    { icon: "🏨", title: "Hotel Management System", desc: "Reservations, housekeeping, billing and guest management all in one platform." },
    { icon: "📊", title: "ERP Solutions", desc: "ELEACC ERP integrating HR, finance, inventory, sales and supply chain." },
    { icon: "🎓", title: "IT Training Academy", desc: "Professional IT courses with placements. 24+ years of industry-aligned curriculum." },
    { icon: "🔧", title: "IT Support & Maintenance", desc: "24/7 technical support, network management and system maintenance services." },
    { icon: "🌐", title: "Web & Mobile Apps", desc: "Responsive web applications and cross-platform mobile apps for all industries." },
    { icon: "☁️", title: "Cloud & Hosting Solutions", desc: "Secure cloud migrations, server setup and managed hosting with 99.9% uptime." },
  ];

  const clients = [
    "JST Enterprises", "TravelStar India", "Crown Royal Hotel", "District Collectorate Hyderabad", "Apollo Hospitals",
    "City Hospital Hyderabad", "Royal Institute of Technology", "Softlogic Infotech", "Andhra Pradesh Tourism"
  ];

  const testimonials = [
    { name: "Pradeep Jayasinghe", role: "CEO, JST Group", text: "Softmaster transformed our operations. The ERP system reduced our manual work by 70% and improved accuracy significantly." },
    { name: "Dilrukshi Perera", role: "Manager, Travel Star", text: "Their hotel management system is exceptional. Real-time reports and seamless booking management helped us scale efficiently." },
    { name: "Dr. Kumara Silva", role: "Director, Apollo Hospitals Hyderabad", text: "The HMS implementation was professional and smooth. Staff adapted quickly and patient records management improved dramatically." },
  ];

  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif", background: "#0a0a0f", color: "#fff", overflowX: "hidden" }}>

      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(10,10,15,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14 }}>SM</div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>Softmaster</span>
        </div>
        <div style={{ display: "flex", gap: "2rem", fontSize: "0.9rem" }}>
          {["About", "Services", "Courses", "Placements", "Contact"].map(item => (
            <a key={item} href={`/${item.toLowerCase()}`} style={{ color: "#9ca3af", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
            >{item}</a>
          ))}
        </div>
        <a href="/contact" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#fff", padding: "0.6rem 1.4rem", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}>Get Started</a>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "8rem 2rem 4rem", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 30%, rgba(59,130,246,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, position: "relative" }}>
          <div style={{ display: "inline-block", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 100, padding: "0.4rem 1.2rem", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em", color: "#60a5fa", marginBottom: "1.5rem", textTransform: "uppercase" }}>
            Trusted Since 2000 — 24+ Years of Excellence
          </div>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.5rem", fontFamily: "'Syne', sans-serif" }}>
            Enterprise Software <span style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Solutions</span> for India
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#9ca3af", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: 650, margin: "0 auto 2.5rem" }}>
            Softmaster Technology Solutions Pvt Ltd delivers reliable, custom-built software driving efficiency and growth for 1,700+ businesses across India.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/services" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#fff", padding: "1rem 2rem", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: "1rem", boxShadow: "0 0 30px rgba(59,130,246,0.4)" }}>Explore Services</a>
            <a href="/contact" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "1rem 2rem", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: "1rem" }}>Contact Us</a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "4rem 2rem", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", textAlign: "center" }}>
          {[{ value: `${count1}+`, label: "Clients Served" }, { value: `${count2}+`, label: "Years of Experience" }, { value: `${count3}`, label: "Core Products" }].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Syne', sans-serif" }}>{stat.value}</div>
              <div style={{ color: "#6b7280", fontSize: "0.95rem", marginTop: "0.5rem" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PORTAL HUB - NEW SECTION ── */}
      <section style={{ padding: "6rem 2rem", background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 100, padding: "0.4rem 1.2rem", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em", color: "#34d399", marginBottom: "1rem", textTransform: "uppercase" }}>
              Our Platforms
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, fontFamily: "'Syne', sans-serif", marginBottom: "1rem" }}>
              Access Your <span style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Portal</span>
            </h2>
            <p style={{ color: "#9ca3af", maxWidth: 500, margin: "0 auto" }}>All Softmaster platforms in one place. Click to open your portal.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
            {PORTALS.map((portal, i) => (
              <a
                key={i}
                href={portal.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", background: "rgba(255,255,255,0.03)", border: `1px solid ${portal.color}25`, borderRadius: 16, padding: "1.75rem", textDecoration: "none", color: "#fff", transition: "all 0.25s", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${portal.color}12`;
                  e.currentTarget.style.borderColor = `${portal.color}60`;
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 12px 40px ${portal.color}20`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.borderColor = `${portal.color}25`;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${portal.color}, ${portal.color}80)` }} />
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div style={{ fontSize: "2.2rem" }}>{portal.icon}</div>
                  <span style={{ background: `${portal.color}20`, color: portal.color, padding: "0.25rem 0.75rem", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700 }}>{portal.badge}</span>
                </div>
                <h3 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "0.5rem" }}>{portal.title}</h3>
                <p style={{ color: "#9ca3af", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>{portal.desc}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: portal.color, fontSize: "0.85rem", fontWeight: 600 }}>
                  Open Portal <span>→</span>
                </div>
              </a>
            ))}
          </div>
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "0.75rem 1.5rem", color: "#9ca3af", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              🔌 Backend API Docs — localhost:8000/docs
            </a>
          </div>
        </div>
      </section>
      {/* ── END PORTAL HUB ── */}

      {/* Services */}
      <section style={{ padding: "6rem 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, fontFamily: "'Syne', sans-serif", marginBottom: "1rem" }}>Our Services</h2>
            <p style={{ color: "#9ca3af", maxWidth: 500, margin: "0 auto" }}>Comprehensive technology solutions tailored for every industry across India.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
            {services.map((service, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "2rem", transition: "all 0.3s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)"; e.currentTarget.style.background = "rgba(59,130,246,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{service.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: "0.75rem", fontSize: "1.05rem" }}>{service.title}</h3>
                <p style={{ color: "#9ca3af", lineHeight: 1.6, fontSize: "0.9rem" }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section style={{ padding: "4rem 2rem", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem", color: "#9ca3af" }}>Trusted by Leading Organizations</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            {clients.map((client, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "0.75rem 1.5rem", fontSize: "0.9rem", fontWeight: 500, color: "#d1d5db" }}>{client}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "6rem 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, fontFamily: "'Syne', sans-serif", marginBottom: "3rem" }}>What Our Clients Say</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "2rem" }}>
                <p style={{ color: "#d1d5db", lineHeight: 1.7, marginBottom: "1.5rem", fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ fontWeight: 700 }}>{t.name}</div>
                <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "6rem 2rem", textAlign: "center", background: "radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.1) 0%, transparent 70%)" }}>
        <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, fontFamily: "'Syne', sans-serif", marginBottom: "1rem" }}>Ready to Transform Your Business?</h2>
        <p style={{ color: "#9ca3af", marginBottom: "2rem" }}>Join 1,700+ businesses powered by Softmaster Technology Solutions.</p>
        <a href="/contact" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#fff", padding: "1rem 2.5rem", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: "1.1rem", boxShadow: "0 0 40px rgba(59,130,246,0.4)" }}>Start Your Project</a>
      </section>

      {/* Footer */}
      <footer style={{ padding: "3rem 2rem", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "2rem" }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "0.75rem" }}>Softmaster</div>
            <p style={{ color: "#6b7280", fontSize: "0.85rem", lineHeight: 1.6 }}>No.07, George E De Silva Mawatha, 12-18, Indira Nagar Colony, Peerzadiguda, Hyderabad, Telangana - 500039</p>
            <p style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.5rem" }}>+94 81 220 4130</p>
          </div>
          {[
            { title: "Services", links: ["Custom Software", "HMS", "SMS", "ERP Solutions"] },
            { title: "Company", links: ["About Us", "Careers", "Blog", "Contact"] },
            { title: "Portals", links: ["Academy", "Jobs Portal", "Client Portal", "Employee Portal"] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontWeight: 700, marginBottom: "0.75rem", fontSize: "0.9rem" }}>{col.title}</div>
              {col.links.map(link => (
                <div key={link} style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "0.4rem" }}>{link}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", color: "#4b5563", fontSize: "0.8rem", marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          Copyright {new Date().getFullYear()} Softmaster Technology Solutions Pvt Ltd. All rights reserved.
        </div>
      </footer>
    </main>
  );
}