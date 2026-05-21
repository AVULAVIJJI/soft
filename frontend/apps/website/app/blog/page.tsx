"use client";
import { useState, useEffect } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async (q = "") => {
    setLoading(true);
    const url = `${API}/api/blog/?limit=20&status=published${q ? `&search=${encodeURIComponent(q)}` : ""}`;
    const r = await fetch(url).catch(() => null);
    const d = await r?.json().catch(() => ({}));
    setPosts(d?.posts || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { const t = setTimeout(() => load(search), 400); return () => clearTimeout(t); }, [search]);

  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <section style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)", padding: "6rem 2rem 4rem", textAlign: "center", color: "#fff" }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, marginBottom: "1rem" }}>Blog</h1>
        <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>Technology insights, industry news, and company updates.</p>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..." style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "0.75rem 1.5rem", color: "#fff", fontSize: "1rem", width: "100%", maxWidth: 400, outline: "none" }} />
      </section>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem" }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "#64748b", padding: "4rem" }}>Loading posts...</div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: "center", color: "#64748b", padding: "4rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✍️</div>
            <p>No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {posts.map((p, i) => (
              <a key={p.id || i} href={`/blog/${p.slug}`} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", textDecoration: "none", color: "inherit", display: "block", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}>
                {p.thumbnail_url && <img src={p.thumbnail_url} alt={p.title} style={{ width: "100%", height: 180, objectFit: "cover" }} />}
                {!p.thumbnail_url && <div style={{ width: "100%", height: 120, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>✍️</div>}
                <div style={{ padding: "1.5rem" }}>
                  {p.category && <span style={{ background: "#eff6ff", color: "#2563eb", padding: "0.2rem 0.6rem", borderRadius: 6, fontSize: "0.75rem", fontWeight: 600 }}>{p.category}</span>}
                  <h3 style={{ fontWeight: 700, color: "#0f172a", margin: "0.75rem 0 0.5rem", fontSize: "1.05rem", lineHeight: 1.4 }}>{p.title}</h3>
                  <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "1rem" }}>{p.excerpt?.slice(0, 120)}{p.excerpt?.length > 120 ? "..." : ""}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "0.75rem" }}>
                    <span>{p.read_time_minutes} min read</span>
                    <span>{p.published_at ? new Date(p.published_at).toLocaleDateString("en-IN") : ""}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

