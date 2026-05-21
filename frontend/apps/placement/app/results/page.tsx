"use client";
import { useState } from "react";

const results = [
  { name: "Rahul Sharma", company: "TCS Digital", role: "Software Engineer", package: "8 LPA", batch: "2025", status: "Placed" },
  { name: "Priya Reddy", company: "Infosys", role: "Systems Engineer", package: "6.5 LPA", batch: "2025", status: "Placed" },
  { name: "Anil Kumar", company: "Wipro", role: "Project Engineer", package: "7 LPA", batch: "2024", status: "Placed" },
  { name: "Sneha Patel", company: "HCL Technologies", role: "Graduate Engineer", package: "5.5 LPA", batch: "2025", status: "Placed" },
  { name: "Rajesh Rao", company: "Tech Mahindra", role: "Associate", package: "6 LPA", batch: "2024", status: "Placed" },
  { name: "Divya Singh", company: "Cognizant", role: "Programmer Analyst", package: "7.5 LPA", batch: "2025", status: "Placed" },
];

export default function PlacementResultsPage() {
  const [search, setSearch] = useState("");
  const [batch, setBatch] = useState("all");
  const filtered = results.filter(r => (batch === "all" || r.batch === batch) && (r.name.toLowerCase().includes(search.toLowerCase()) || r.company.toLowerCase().includes(search.toLowerCase())));

  return (
    <div style={{ padding: "2rem", background: "#0a0a0f", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: "0.25rem" }}>Placement Results</h1>
      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>All placement records</p>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or company..." style={{ flex: 1, minWidth: 200, padding: "0.7rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: "0.9rem" }} />
        <select value={batch} onChange={e => setBatch(e.target.value)} style={{ padding: "0.7rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff" }}>
          <option value="all">All Batches</option>
          <option value="2025">Batch 2025</option>
          <option value="2024">Batch 2024</option>
        </select>
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.06)" }}>
              {["Student Name", "Company", "Role", "Package", "Batch", "Status"].map(h => (
                <th key={h} style={{ padding: "1rem", textAlign: "left", color: "#6b7280", fontSize: "0.8rem", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <td style={{ padding: "1rem", fontWeight: 600 }}>{r.name}</td>
                <td style={{ padding: "1rem", color: "#9ca3af" }}>{r.company}</td>
                <td style={{ padding: "1rem", color: "#9ca3af" }}>{r.role}</td>
                <td style={{ padding: "1rem", color: "#34d399", fontWeight: 700 }}>{r.package}</td>
                <td style={{ padding: "1rem", color: "#9ca3af" }}>{r.batch}</td>
                <td style={{ padding: "1rem" }}><span style={{ background: "rgba(16,185,129,0.1)", color: "#34d399", padding: "0.2rem 0.6rem", borderRadius: 6, fontSize: "0.75rem", fontWeight: 700 }}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>No results found.</div>}
      </div>
    </div>
  );
}
