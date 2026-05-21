"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/courses", label: "Courses" },
  { href: "/placements", label: "Placements" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid #e2e8f0", padding: "0"
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 36, height: 36, background: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
            borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 800, fontSize: "1.1rem", fontFamily: "Syne,sans-serif"
          }}>S</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a", lineHeight: 1.2 }}>Softmaster</div>
            <div style={{ fontSize: "0.65rem", color: "#64748b", letterSpacing: "0.05em" }}>Technology Solutions</div>
          </div>
        </Link>
        <ul style={{ display: "flex", gap: 28, listStyle: "none", margin: 0, padding: 0, alignItems: "center" }}
          className="desktop-nav">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link href={link.href} style={{ color: "#334155", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#1d4ed8")}
                onMouseLeave={e => (e.currentTarget.style.color = "#334155")}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="https://academy.smtssc.com" className="btn-primary" style={{ fontSize: "0.85rem", padding: "9px 20px" }}>
            Join Academy
          </Link>
        </div>
      </div>
    </nav>
  );
}

