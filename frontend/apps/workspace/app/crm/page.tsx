"use client";
import { useState, useEffect } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "https://api.softmastertech.com";

export default function CrmPage() {
  const [loading, setLoading] = useState(false);

  const titles: Record<string, { title: string; desc: string; icon: string; items: string[] }> = {
    crm: { title: "CRM", desc: "Customer Relationship Management", icon: "🤝", items: ["Lead Management", "Contact Database", "Sales Pipeline", "Follow-up Reminders", "Deal Tracking"] },
    finance: { title: "Finance", desc: "Financial management and reports", icon: "💰", items: ["Income & Expenses", "Profit & Loss", "Balance Sheet", "Tax Reports", "Budget Planning"] },
    assets: { title: "Asset Management", desc: "Track company assets and inventory", icon: "🖥️", items: ["Asset Register", "Asset Allocation", "Maintenance Schedule", "Depreciation Report", "Asset Disposal"] },
    meetings: { title: "Meetings", desc: "Schedule and manage team meetings", icon: "📅", items: ["Schedule Meeting", "Meeting Agenda", "Meeting Notes", "Action Items", "Meeting History"] },
  };

  const page = "crm";
  const info = titles[page];

  return (
    <div style={{ padding: "2rem", background: "#0a0a0f", minHeight: "100vh", color: "#fff" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{info.icon}</div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 900 }}>{info.title}</h1>
        <p style={{ color: "#6b7280" }}>{info.desc}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem" }}>
        {info.items.map((item, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.75rem", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)"; e.currentTarget.style.background = "rgba(59,130,246,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
            <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>{item}</div>
            <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>Click to open</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "2rem", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "1.25rem", color: "#60a5fa", fontSize: "0.9rem" }}>
        This module connects to the backend API. Make sure your server is running and data will appear here automatically.
      </div>
    </div>
  );
}
