"use client";
import { useState, useEffect } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "https://api.softmastertech.com";

export default function PlacementAnalyticsPage() {
  const stats = [
    { label: "Total Students", value: "248", icon: "👨‍🎓", color: "#3b82f6" },
    { label: "Placed Students", value: "186", icon: "✅", color: "#10b981" },
    { label: "Placement Rate", value: "75%", icon: "📈", color: "#8b5cf6" },
    { label: "Avg Package", value: "7.2 LPA", icon: "💰", color: "#f59e0b" },
    { label: "Companies Visited", value: "42", icon: "🏢", color: "#ef4444" },
    { label: "Drives This Year", value: "18", icon: "📅", color: "#06b6d4" },
  ];
  const topCompanies = [
    { name: "TCS Digital", placed: 28, avg_package: "8 LPA" },
    { name: "Infosys", placed: 22, avg_package: "6.5 LPA" },
    { name: "Wipro", placed: 18, avg_package: "7 LPA" },
    { name: "HCL Technologies", placed: 15, avg_package: "5.5 LPA" },
    { name: "Tech Mahindra", placed: 12, avg_package: "6 LPA" },
  ];

  return (
    <div style={{ padding: "2rem", background: "#0a0a0f", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: "0.25rem" }}>Placement Analytics</h1>
      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>Placement performance overview</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}30`, borderRadius: 14, padding: "1.5rem", borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{s.icon}</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ color: "#6b7280", fontSize: "0.8rem", marginTop: "0.25rem" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.5rem" }}>
        <h2 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>Top Recruiting Companies</h2>
        {topCompanies.map((c, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem", background: "rgba(255,255,255,0.03)", borderRadius: 10, marginBottom: "0.5rem" }}>
            <div style={{ fontWeight: 600 }}>{c.name}</div>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <span style={{ color: "#60a5fa", fontSize: "0.85rem" }}>{c.placed} placed</span>
              <span style={{ color: "#34d399", fontSize: "0.85rem", fontWeight: 700 }}>{c.avg_package}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
