"use client";
import { useState, useEffect } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "https://api.softmastertech.com";

const sampleAnnouncements = [
  { id: 1, title: "Office Holiday - Diwali", content: "The office will be closed on November 1st for Diwali. Wishing everyone a Happy Diwali!", date: "2026-10-28", type: "holiday", author: "HR Team" },
  { id: 2, title: "New Health Insurance Policy", content: "We are upgrading our health insurance coverage. Details will be shared in the next team meeting. Please check your email for the updated policy document.", date: "2026-05-05", type: "policy", author: "Admin" },
  { id: 3, title: "Monthly Team Meeting - May", content: "Our monthly all-hands meeting is scheduled for May 15th at 10:00 AM in the conference room. Attendance is mandatory.", date: "2026-05-03", type: "meeting", author: "Management" },
  { id: 4, title: "Congratulations to Q1 Top Performers", content: "We are proud to recognize our Q1 top performers. Great work team! Keep it up. Awards will be distributed at the next meeting.", date: "2026-04-30", type: "achievement", author: "CEO" },
];

const typeColors: Record<string, { bg: string; color: string }> = {
  holiday: { bg: "rgba(16,185,129,0.1)", color: "#34d399" },
  policy: { bg: "rgba(59,130,246,0.1)", color: "#60a5fa" },
  meeting: { bg: "rgba(245,158,11,0.1)", color: "#fbbf24" },
  achievement: { bg: "rgba(139,92,246,0.1)", color: "#a78bfa" },
};

export default function AnnouncementsPage() {
  return (
    <div style={{ padding: "2rem", background: "#0a0a0f", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: "0.25rem" }}>Announcements</h1>
      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>Company news and updates</p>
      <div style={{ display: "grid", gap: "1.25rem" }}>
        {sampleAnnouncements.map(ann => {
          const style = typeColors[ann.type] || { bg: "rgba(107,114,128,0.1)", color: "#9ca3af" };
          return (
            <div key={ann.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <h3 style={{ fontWeight: 700, fontSize: "1.05rem" }}>{ann.title}</h3>
                <span style={{ background: style.bg, color: style.color, padding: "0.2rem 0.6rem", borderRadius: 6, fontSize: "0.75rem", fontWeight: 700, textTransform: "capitalize", flexShrink: 0, marginLeft: "1rem" }}>{ann.type}</span>
              </div>
              <p style={{ color: "#d1d5db", lineHeight: 1.7, marginBottom: "1rem", fontSize: "0.9rem" }}>{ann.content}</p>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#6b7280", fontSize: "0.8rem" }}>
                <span>By {ann.author}</span>
                <span>{new Date(ann.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
