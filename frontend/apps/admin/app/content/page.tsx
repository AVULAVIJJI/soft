"use client";
import { useState, useEffect, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.softmastertech.com";

const s = {
  input: { width: "100%", padding: "0.7rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", fontSize: "0.9rem", boxSizing: "border-box" as const, fontFamily: "inherit" },
  label: { fontSize: "0.8rem", fontWeight: 600 as const, color: "#9ca3af", display: "block" as const, marginBottom: "0.3rem" },
  btn: { background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", color: "#fff", border: "none", padding: "0.7rem 1.5rem", borderRadius: 8, fontWeight: 700 as const, cursor: "pointer" as const, fontSize: "0.9rem" },
  btnSm: { background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#60a5fa", padding: "0.35rem 0.8rem", borderRadius: 6, cursor: "pointer" as const, fontSize: "0.8rem", fontWeight: 600 as const },
  btnDel: { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "0.35rem 0.8rem", borderRadius: 6, cursor: "pointer" as const, fontSize: "0.8rem", fontWeight: 600 as const },
  card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.5rem", marginBottom: "1rem" },
  row: { display: "grid" as const, gap: "1rem", marginBottom: "1rem" },
};

type Tab = "jobs" | "courses" | "blog" | "settings" | "testimonials" | "clients" | "services" | "faqs";

const TABS: { key: Tab; icon: string; label: string }[] = [
  { key: "jobs", icon: "💼", label: "Jobs" },
  { key: "courses", icon: "📚", label: "Courses" },
  { key: "blog", icon: "✍️", label: "Blog" },
  { key: "testimonials", icon: "💬", label: "Testimonials" },
  { key: "clients", icon: "🏢", label: "Clients" },
  { key: "services", icon: "⚙️", label: "Services" },
  { key: "faqs", icon: "❓", label: "FAQs" },
  { key: "settings", icon: "🏠", label: "Site Settings" },
];

function Toast({ msg, onClose }: { msg: { text: string; ok: boolean }; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", bottom: "2rem", right: "2rem", background: msg.ok ? "#064e3b" : "#7f1d1d", border: `1px solid ${msg.ok ? "#10b981" : "#ef4444"}`, borderRadius: 10, padding: "1rem 1.5rem", color: "#fff", zIndex: 9999, display: "flex", gap: "1rem", alignItems: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", maxWidth: 420 }}>
      <span style={{ fontSize: "1.1rem" }}>{msg.ok ? "✅" : "❌"}</span>
      <span style={{ flex: 1, fontSize: "0.9rem" }}>{msg.text}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "1rem" }}>✕</button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={s.label}>{label}</label>{children}</div>;
}

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : "";
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

// ─── JOBS TAB ─────────────────────────────────────────────────────────────────
function JobsTab({ toast }: { toast: (t: string, ok: boolean) => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", job_type: "full_time", location: "Hyderabad", salary_min: "", salary_max: "", experience_years: "", skills_required: "", category: "", requirements: "" });
  const f = (k: string) => (e: any) => setForm(p => ({ ...p, [k]: e.target.value }));

  const load = async () => {
    const r = await fetch(`${API}/api/jobs/?limit=100`, { headers: authHeaders() }).catch(() => null);
    const d = await r?.json().catch(() => ({}));
    setItems(d?.jobs || []);
  };

  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, salary_min: Number(form.salary_min) || 0, salary_max: Number(form.salary_max) || 0, experience_years: Number(form.experience_years) || 0, skills_required: form.skills_required.split(",").map((x: string) => x.trim()).filter(Boolean) };
    const r = await fetch(`${API}/api/jobs/`, { method: "POST", headers: authHeaders(), body: JSON.stringify(payload) }).catch(() => null);
    if (r?.ok) { toast("Job posted! It appears on the Jobs portal immediately.", true); setShow(false); load(); setForm({ title: "", description: "", job_type: "full_time", location: "Hyderabad", salary_min: "", salary_max: "", experience_years: "", skills_required: "", category: "", requirements: "" }); }
    else toast("Failed to post job", false);
  };

  const del = async (id: number) => {
    if (!confirm("Delete this job?")) return;
    const r = await fetch(`${API}/api/jobs/${id}`, { method: "DELETE", headers: authHeaders() }).catch(() => null);
    if (r?.ok) { toast("Job deleted", true); load(); } else toast("Failed", false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>Job Postings</div>
          <div style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.2rem" }}>Post here → appears on jobs.softmastertech.com automatically</div>
        </div>
        <button onClick={() => setShow(!show)} style={s.btn}>{show ? "Cancel" : "+ Post New Job"}</button>
      </div>

      {show && (
        <div style={{ ...s.card, border: "1px solid rgba(59,130,246,0.3)" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>New Job Posting</h3>
          <form onSubmit={save}>
            <div style={{ ...s.row, gridTemplateColumns: "1fr 1fr" }}>
              <Field label="Job Title *"><input style={s.input} value={form.title} onChange={f("title")} required placeholder="e.g. React Developer" /></Field>
              <Field label="Job Type"><select style={s.input} value={form.job_type} onChange={f("job_type")}><option value="full_time">Full Time</option><option value="part_time">Part Time</option><option value="contract">Contract</option><option value="internship">Internship</option><option value="remote">Remote</option></select></Field>
              <Field label="Location"><input style={s.input} value={form.location} onChange={f("location")} placeholder="Hyderabad" /></Field>
              <Field label="Category"><input style={s.input} value={form.category} onChange={f("category")} placeholder="e.g. Engineering" /></Field>
              <Field label="Min Salary (INR)"><input style={s.input} type="number" value={form.salary_min} onChange={f("salary_min")} placeholder="400000" /></Field>
              <Field label="Max Salary (INR)"><input style={s.input} type="number" value={form.salary_max} onChange={f("salary_max")} placeholder="800000" /></Field>
              <Field label="Experience (years)"><input style={s.input} type="number" value={form.experience_years} onChange={f("experience_years")} placeholder="2" /></Field>
              <Field label="Skills Required (comma separated)"><input style={s.input} value={form.skills_required} onChange={f("skills_required")} placeholder="React, Node.js, SQL" /></Field>
            </div>
            <Field label="Job Description *"><textarea style={{ ...s.input, minHeight: 120, resize: "vertical" as const }} value={form.description} onChange={f("description")} required /></Field>
            <div style={{ marginTop: "0.75rem" }}><Field label="Requirements"><textarea style={{ ...s.input, minHeight: 80, resize: "vertical" as const }} value={form.requirements} onChange={f("requirements")} /></Field></div>
            <button type="submit" style={{ ...s.btn, marginTop: "1rem" }}>Post Job</button>
          </form>
        </div>
      )}

      {items.length === 0 ? <div style={{ ...s.card, textAlign: "center", color: "#6b7280", padding: "3rem" }}>No jobs posted yet.</div> :
        items.map(job => (
          <div key={job.id} style={{ ...s.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700 }}>{job.title}</div>
              <div style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.25rem" }}>{job.location} · {(job.job_type || "").replace("_", " ")} · {job.applications_count || 0} applications</div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ background: job.status === "open" ? "rgba(16,185,129,0.15)" : "rgba(107,114,128,0.15)", color: job.status === "open" ? "#34d399" : "#9ca3af", padding: "0.2rem 0.6rem", borderRadius: 6, fontSize: "0.75rem", fontWeight: 700 }}>{job.status}</span>
              <button style={s.btnDel} onClick={() => del(job.id)}>Delete</button>
            </div>
          </div>
        ))
      }
    </div>
  );
}

// ─── COURSES TAB ──────────────────────────────────────────────────────────────
function CoursesTab({ toast }: { toast: (t: string, ok: boolean) => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", level: "beginner", price: "0", category: "", duration_hours: "", thumbnail_url: "", status: "draft" });
  const f = (k: string) => (e: any) => setForm(p => ({ ...p, [k]: e.target.value }));

  const load = async () => {
    const r = await fetch(`${API}/api/courses/?limit=100`, { headers: authHeaders() }).catch(() => null);
    const d = await r?.json().catch(() => ({}));
    setItems(d?.courses || []);
  };
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) || 0, duration_hours: Number(form.duration_hours) || null };
    const r = await fetch(`${API}/api/courses/`, { method: "POST", headers: authHeaders(), body: JSON.stringify(payload) }).catch(() => null);
    if (r?.ok) { toast("Course created! It appears on the Academy portal when published.", true); setShow(false); load(); }
    else toast("Failed to create course", false);
  };

  const updateStatus = async (id: number, status: string) => {
    const r = await fetch(`${API}/api/courses/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ status }) }).catch(() => null);
    if (r?.ok) { toast(`Course ${status}!`, true); load(); } else toast("Failed", false);
  };

  const del = async (id: number) => {
    if (!confirm("Delete this course?")) return;
    const r = await fetch(`${API}/api/courses/${id}`, { method: "DELETE", headers: authHeaders() }).catch(() => null);
    if (r?.ok) { toast("Course deleted", true); load(); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>Courses</div>
          <div style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.2rem" }}>Create here → appears on academy.softmastertech.com when published</div>
        </div>
        <button onClick={() => setShow(!show)} style={s.btn}>{show ? "Cancel" : "+ New Course"}</button>
      </div>

      {show && (
        <div style={{ ...s.card, border: "1px solid rgba(59,130,246,0.3)" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>New Course</h3>
          <form onSubmit={save}>
            <div style={{ ...s.row, gridTemplateColumns: "1fr 1fr" }}>
              <Field label="Course Title *"><input style={s.input} value={form.title} onChange={f("title")} required placeholder="e.g. Python for Beginners" /></Field>
              <Field label="Category"><input style={s.input} value={form.category} onChange={f("category")} placeholder="Programming" /></Field>
              <Field label="Level"><select style={s.input} value={form.level} onChange={f("level")}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></Field>
              <Field label="Price (INR, 0 = Free)"><input style={s.input} type="number" value={form.price} onChange={f("price")} /></Field>
              <Field label="Duration (hours)"><input style={s.input} type="number" value={form.duration_hours} onChange={f("duration_hours")} /></Field>
              <Field label="Publish Status"><select style={s.input} value={form.status} onChange={f("status")}><option value="draft">Save as Draft</option><option value="published">Publish Now</option></select></Field>
            </div>
            <Field label="Thumbnail URL"><input style={s.input} value={form.thumbnail_url} onChange={f("thumbnail_url")} placeholder="https://..." /></Field>
            <div style={{ marginTop: "0.75rem" }}><Field label="Description *"><textarea style={{ ...s.input, minHeight: 120, resize: "vertical" as const }} value={form.description} onChange={f("description")} required /></Field></div>
            <button type="submit" style={{ ...s.btn, marginTop: "1rem" }}>Save Course</button>
          </form>
        </div>
      )}

      {items.length === 0 ? <div style={{ ...s.card, textAlign: "center", color: "#6b7280", padding: "3rem" }}>No courses yet.</div> :
        items.map(c => (
          <div key={c.id} style={{ ...s.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700 }}>{c.title}</div>
              <div style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.25rem" }}>{c.category || "Uncategorized"} · {c.level} · {c.price === 0 ? "Free" : `INR ${c.price}`} · {c.enrolled_count || 0} enrolled</div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              {c.status === "draft" && <button style={s.btnSm} onClick={() => updateStatus(c.id, "published")}>Publish</button>}
              {c.status === "published" && <button style={s.btnSm} onClick={() => updateStatus(c.id, "draft")}>Unpublish</button>}
              <span style={{ background: c.status === "published" ? "rgba(16,185,129,0.15)" : "rgba(107,114,128,0.15)", color: c.status === "published" ? "#34d399" : "#9ca3af", padding: "0.2rem 0.6rem", borderRadius: 6, fontSize: "0.75rem", fontWeight: 700 }}>{c.status}</span>
              <button style={s.btnDel} onClick={() => del(c.id)}>Delete</button>
            </div>
          </div>
        ))
      }
    </div>
  );
}

// ─── BLOG TAB ─────────────────────────────────────────────────────────────────
function BlogTab({ toast }: { toast: (t: string, ok: boolean) => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", category: "", tags: "", thumbnail_url: "", is_featured: false, status: "draft" });
  const f = (k: string) => (e: any) => setForm(p => ({ ...p, [k]: k === "is_featured" ? e.target.checked : e.target.value }));

  const load = async () => {
    const r = await fetch(`${API}/api/blog/?limit=100&status=all`, { headers: authHeaders() }).catch(() => null);
    const d = await r?.json().catch(() => ({}));
    setItems(d?.posts || []);
  };
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch(`${API}/api/blog/`, { method: "POST", headers: authHeaders(), body: JSON.stringify(form) }).catch(() => null);
    if (r?.ok) { toast("Blog post saved! Published posts appear on softmastertech.com immediately.", true); setShow(false); load(); }
    else toast("Failed to save post", false);
  };

  const updateStatus = async (id: number, status: string) => {
    const r = await fetch(`${API}/api/blog/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ status }) }).catch(() => null);
    if (r?.ok) { toast(`Post ${status}!`, true); load(); }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    const r = await fetch(`${API}/api/blog/${id}`, { method: "DELETE", headers: authHeaders() }).catch(() => null);
    if (r?.ok) { toast("Post deleted", true); load(); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>Blog Posts</div>
          <div style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.2rem" }}>Write here → published posts appear on softmastertech.com/blog instantly</div>
        </div>
        <button onClick={() => setShow(!show)} style={s.btn}>{show ? "Cancel" : "+ Write Post"}</button>
      </div>

      {show && (
        <div style={{ ...s.card, border: "1px solid rgba(59,130,246,0.3)" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>New Blog Post</h3>
          <form onSubmit={save}>
            <div style={{ marginBottom: "0.75rem" }}><Field label="Post Title *"><input style={s.input} value={form.title} onChange={f("title")} required placeholder="e.g. How ERP Improves Business Efficiency" /></Field></div>
            <div style={{ ...s.row, gridTemplateColumns: "1fr 1fr", marginBottom: "0.75rem" }}>
              <Field label="Category"><input style={s.input} value={form.category} onChange={f("category")} placeholder="Technology / Training / Business" /></Field>
              <Field label="Tags (comma separated)"><input style={s.input} value={form.tags} onChange={f("tags")} placeholder="ERP, software, Hyderabad" /></Field>
              <Field label="Thumbnail Image URL"><input style={s.input} value={form.thumbnail_url} onChange={f("thumbnail_url")} placeholder="https://..." /></Field>
              <Field label="Publish Status"><select style={s.input} value={form.status} onChange={f("status")}><option value="draft">Save as Draft</option><option value="published">Publish Now</option></select></Field>
            </div>
            <div style={{ marginBottom: "0.75rem" }}><Field label="Short Excerpt (optional)"><input style={s.input} value={form.excerpt} onChange={f("excerpt")} placeholder="Brief summary shown in listings (auto-generated if empty)" /></Field></div>
            <Field label="Post Content *"><textarea style={{ ...s.input, minHeight: 240, resize: "vertical" as const }} value={form.content} onChange={f("content")} required placeholder="Write your full blog post content here. Supports plain text." /></Field>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem" }}>
              <input type="checkbox" id="featured" checked={form.is_featured} onChange={f("is_featured")} />
              <label htmlFor="featured" style={{ ...s.label, marginBottom: 0 }}>Feature this post on homepage</label>
            </div>
            <button type="submit" style={{ ...s.btn, marginTop: "1rem" }}>Save Post</button>
          </form>
        </div>
      )}

      {items.length === 0 ? <div style={{ ...s.card, textAlign: "center", color: "#6b7280", padding: "3rem" }}>No blog posts yet.</div> :
        items.map(p => (
          <div key={p.id} style={{ ...s.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ flex: 1, marginRight: "1rem" }}>
              <div style={{ fontWeight: 700 }}>{p.title} {p.is_featured && <span style={{ background: "rgba(245,158,11,0.15)", color: "#fbbf24", fontSize: "0.7rem", padding: "0.1rem 0.5rem", borderRadius: 4, marginLeft: "0.5rem" }}>Featured</span>}</div>
              <div style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.25rem" }}>{p.category || "General"} · {p.read_time_minutes} min read · {p.views || 0} views</div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexShrink: 0 }}>
              {p.status === "draft" && <button style={s.btnSm} onClick={() => updateStatus(p.id, "published")}>Publish</button>}
              {p.status === "published" && <button style={s.btnSm} onClick={() => updateStatus(p.id, "draft")}>Unpublish</button>}
              <span style={{ background: p.status === "published" ? "rgba(16,185,129,0.15)" : "rgba(107,114,128,0.15)", color: p.status === "published" ? "#34d399" : "#9ca3af", padding: "0.2rem 0.6rem", borderRadius: 6, fontSize: "0.75rem", fontWeight: 700 }}>{p.status}</span>
              <button style={s.btnDel} onClick={() => del(p.id)}>Delete</button>
            </div>
          </div>
        ))
      }
    </div>
  );
}

// ─── TESTIMONIALS TAB ─────────────────────────────────────────────────────────
function TestimonialsTab({ toast }: { toast: (t: string, ok: boolean) => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", company: "", content: "", rating: "5" });
  const f = (k: string) => (e: any) => setForm(p => ({ ...p, [k]: e.target.value }));

  const load = async () => {
    const r = await fetch(`${API}/api/cms/testimonials`).catch(() => null);
    const d = await r?.json().catch(() => ({}));
    setItems(d?.testimonials || []);
  };
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch(`${API}/api/cms/testimonials`, { method: "POST", headers: authHeaders(), body: JSON.stringify({ ...form, rating: Number(form.rating) }) }).catch(() => null);
    if (r?.ok) { toast("Testimonial added — appears on website immediately.", true); setShow(false); load(); setForm({ name: "", role: "", company: "", content: "", rating: "5" }); }
    else toast("Failed", false);
  };

  const del = async (id: number) => {
    if (!confirm("Delete?")) return;
    await fetch(`${API}/api/cms/testimonials/${id}`, { method: "DELETE", headers: authHeaders() });
    toast("Deleted", true); load();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>Client Testimonials</div>
          <div style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.2rem" }}>Add here → appears on website homepage automatically</div>
        </div>
        <button onClick={() => setShow(!show)} style={s.btn}>{show ? "Cancel" : "+ Add Testimonial"}</button>
      </div>
      {show && (
        <div style={{ ...s.card, border: "1px solid rgba(59,130,246,0.3)" }}>
          <form onSubmit={save}>
            <div style={{ ...s.row, gridTemplateColumns: "1fr 1fr" }}>
              <Field label="Client Name *"><input style={s.input} value={form.name} onChange={f("name")} required /></Field>
              <Field label="Rating (1-5)"><input style={s.input} type="number" min={1} max={5} value={form.rating} onChange={f("rating")} /></Field>
              <Field label="Designation / Role"><input style={s.input} value={form.role} onChange={f("role")} placeholder="CEO, Manager..." /></Field>
              <Field label="Company Name"><input style={s.input} value={form.company} onChange={f("company")} /></Field>
            </div>
            <Field label="Testimonial Text *"><textarea style={{ ...s.input, minHeight: 100, resize: "vertical" as const }} value={form.content} onChange={f("content")} required /></Field>
            <button type="submit" style={{ ...s.btn, marginTop: "1rem" }}>Add Testimonial</button>
          </form>
        </div>
      )}
      {items.map(t => (
        <div key={t.id} style={{ ...s.card, display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 700 }}>{t.name} <span style={{ color: "#fbbf24" }}>{"★".repeat(t.rating)}</span></div>
            <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>{t.role} {t.company ? `— ${t.company}` : ""}</div>
            <div style={{ color: "#d1d5db", fontSize: "0.85rem", marginTop: "0.5rem", maxWidth: 500 }}>"{t.content.slice(0, 120)}{t.content.length > 120 ? "..." : ""}"</div>
          </div>
          <button style={{ ...s.btnDel, alignSelf: "flex-start", flexShrink: 0 }} onClick={() => del(t.id)}>Delete</button>
        </div>
      ))}
      {items.length === 0 && <div style={{ ...s.card, textAlign: "center", color: "#6b7280", padding: "3rem" }}>No testimonials yet.</div>}
    </div>
  );
}

// ─── CLIENTS TAB ──────────────────────────────────────────────────────────────
function ClientsTab({ toast }: { toast: (t: string, ok: boolean) => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: "", sector: "", location: "Hyderabad", product_used: "", is_featured: false });
  const f = (k: string) => (e: any) => setForm(p => ({ ...p, [k]: k === "is_featured" ? e.target.checked : e.target.value }));

  const load = async () => {
    const r = await fetch(`${API}/api/cms/clients`).catch(() => null);
    const d = await r?.json().catch(() => ({}));
    setItems(d?.clients || []);
  };
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch(`${API}/api/cms/clients`, { method: "POST", headers: authHeaders(), body: JSON.stringify(form) }).catch(() => null);
    if (r?.ok) { toast("Client added — appears on website clients page immediately.", true); setShow(false); load(); setForm({ name: "", sector: "", location: "Hyderabad", product_used: "", is_featured: false }); }
    else toast("Failed", false);
  };

  const del = async (id: number) => {
    if (!confirm("Delete?")) return;
    await fetch(`${API}/api/cms/clients/${id}`, { method: "DELETE", headers: authHeaders() });
    toast("Deleted", true); load();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>Client Companies</div>
          <div style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.2rem" }}>Add here → appears on website clients page automatically</div>
        </div>
        <button onClick={() => setShow(!show)} style={s.btn}>{show ? "Cancel" : "+ Add Client"}</button>
      </div>
      {show && (
        <div style={{ ...s.card, border: "1px solid rgba(59,130,246,0.3)" }}>
          <form onSubmit={save}>
            <div style={{ ...s.row, gridTemplateColumns: "1fr 1fr" }}>
              <Field label="Company Name *"><input style={s.input} value={form.name} onChange={f("name")} required /></Field>
              <Field label="Sector"><input style={s.input} value={form.sector} onChange={f("sector")} placeholder="Healthcare / Education / Retail..." /></Field>
              <Field label="Location"><input style={s.input} value={form.location} onChange={f("location")} /></Field>
              <Field label="Product / Service Used"><input style={s.input} value={form.product_used} onChange={f("product_used")} placeholder="ERP / HMS / SMS..." /></Field>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
              <input type="checkbox" id="feat" checked={form.is_featured} onChange={f("is_featured")} />
              <label htmlFor="feat" style={{ ...s.label, marginBottom: 0 }}>Show as Featured Client</label>
            </div>
            <button type="submit" style={{ ...s.btn, marginTop: "1rem" }}>Add Client</button>
          </form>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        {items.map(c => (
          <div key={c.id} style={{ ...s.card, marginBottom: 0, display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 700 }}>{c.name} {c.is_featured && <span style={{ background: "rgba(245,158,11,0.15)", color: "#fbbf24", fontSize: "0.7rem", padding: "0.1rem 0.4rem", borderRadius: 4 }}>Featured</span>}</div>
              <div style={{ color: "#6b7280", fontSize: "0.8rem", marginTop: "0.2rem" }}>{c.sector} · {c.location}</div>
              <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>{c.product_used}</div>
            </div>
            <button style={{ ...s.btnDel, alignSelf: "flex-start" }} onClick={() => del(c.id)}>✕</button>
          </div>
        ))}
      </div>
      {items.length === 0 && <div style={{ ...s.card, textAlign: "center", color: "#6b7280", padding: "3rem" }}>No clients added yet.</div>}
    </div>
  );
}

// ─── SERVICES TAB ─────────────────────────────────────────────────────────────
function ServicesTab({ toast }: { toast: (t: string, ok: boolean) => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", icon: "💻", category: "" });
  const f = (k: string) => (e: any) => setForm(p => ({ ...p, [k]: e.target.value }));

  const load = async () => {
    const r = await fetch(`${API}/api/cms/services-list`).catch(() => null);
    const d = await r?.json().catch(() => ({}));
    setItems(d?.services || []);
  };
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch(`${API}/api/cms/services-list`, { method: "POST", headers: authHeaders(), body: JSON.stringify(form) }).catch(() => null);
    if (r?.ok) { toast("Service added — appears on website services page immediately.", true); setShow(false); load(); setForm({ title: "", description: "", icon: "💻", category: "" }); }
    else toast("Failed", false);
  };

  const del = async (id: number) => {
    if (!confirm("Delete?")) return;
    await fetch(`${API}/api/cms/services-list/${id}`, { method: "DELETE", headers: authHeaders() });
    toast("Deleted", true); load();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>Services</div>
          <div style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.2rem" }}>Add / edit here → appears on website services page automatically</div>
        </div>
        <button onClick={() => setShow(!show)} style={s.btn}>{show ? "Cancel" : "+ Add Service"}</button>
      </div>
      {show && (
        <div style={{ ...s.card, border: "1px solid rgba(59,130,246,0.3)" }}>
          <form onSubmit={save}>
            <div style={{ ...s.row, gridTemplateColumns: "1fr 1fr" }}>
              <Field label="Service Title *"><input style={s.input} value={form.title} onChange={f("title")} required /></Field>
              <Field label="Icon (emoji)"><input style={s.input} value={form.icon} onChange={f("icon")} placeholder="💻" /></Field>
              <Field label="Category"><input style={s.input} value={form.category} onChange={f("category")} /></Field>
            </div>
            <Field label="Description *"><textarea style={{ ...s.input, minHeight: 100, resize: "vertical" as const }} value={form.description} onChange={f("description")} required /></Field>
            <button type="submit" style={{ ...s.btn, marginTop: "1rem" }}>Add Service</button>
          </form>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        {items.map(sv => (
          <div key={sv.id} style={{ ...s.card, marginBottom: 0, display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 700 }}>{sv.icon} {sv.title}</div>
              <div style={{ color: "#6b7280", fontSize: "0.8rem", marginTop: "0.25rem" }}>{sv.description?.slice(0, 80)}{sv.description?.length > 80 ? "..." : ""}</div>
            </div>
            <button style={{ ...s.btnDel, alignSelf: "flex-start", flexShrink: 0 }} onClick={() => del(sv.id)}>✕</button>
          </div>
        ))}
      </div>
      {items.length === 0 && <div style={{ ...s.card, textAlign: "center", color: "#6b7280", padding: "3rem" }}>No services added yet.</div>}
    </div>
  );
}

// ─── FAQ TAB ──────────────────────────────────────────────────────────────────
function FaqsTab({ toast }: { toast: (t: string, ok: boolean) => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ question: "", answer: "", category: "general" });
  const f = (k: string) => (e: any) => setForm(p => ({ ...p, [k]: e.target.value }));

  const load = async () => {
    const r = await fetch(`${API}/api/cms/faqs`).catch(() => null);
    const d = await r?.json().catch(() => ({}));
    setItems(d?.faqs || []);
  };
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch(`${API}/api/cms/faqs`, { method: "POST", headers: authHeaders(), body: JSON.stringify(form) }).catch(() => null);
    if (r?.ok) { toast("FAQ added — appears on website FAQ section immediately.", true); setShow(false); load(); setForm({ question: "", answer: "", category: "general" }); }
    else toast("Failed", false);
  };

  const del = async (id: number) => {
    if (!confirm("Delete?")) return;
    await fetch(`${API}/api/cms/faqs/${id}`, { method: "DELETE", headers: authHeaders() });
    toast("Deleted", true); load();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>FAQ Items</div>
          <div style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.2rem" }}>Add here → appears on website FAQ section automatically</div>
        </div>
        <button onClick={() => setShow(!show)} style={s.btn}>{show ? "Cancel" : "+ Add FAQ"}</button>
      </div>
      {show && (
        <div style={{ ...s.card, border: "1px solid rgba(59,130,246,0.3)" }}>
          <form onSubmit={save}>
            <Field label="Question *"><input style={s.input} value={form.question} onChange={f("question")} required /></Field>
            <div style={{ marginTop: "0.75rem" }}><Field label="Category"><input style={s.input} value={form.category} onChange={f("category")} placeholder="general / academy / pricing..." /></Field></div>
            <div style={{ marginTop: "0.75rem" }}><Field label="Answer *"><textarea style={{ ...s.input, minHeight: 120, resize: "vertical" as const }} value={form.answer} onChange={f("answer")} required /></Field></div>
            <button type="submit" style={{ ...s.btn, marginTop: "1rem" }}>Add FAQ</button>
          </form>
        </div>
      )}
      {items.map(faq => (
        <div key={faq.id} style={{ ...s.card, display: "flex", justifyContent: "space-between" }}>
          <div style={{ flex: 1, marginRight: "1rem" }}>
            <div style={{ fontWeight: 700 }}>Q: {faq.question}</div>
            <div style={{ color: "#9ca3af", fontSize: "0.85rem", marginTop: "0.4rem" }}>A: {faq.answer.slice(0, 120)}{faq.answer.length > 120 ? "..." : ""}</div>
          </div>
          <button style={{ ...s.btnDel, alignSelf: "flex-start", flexShrink: 0 }} onClick={() => del(faq.id)}>Delete</button>
        </div>
      ))}
      {items.length === 0 && <div style={{ ...s.card, textAlign: "center", color: "#6b7280", padding: "3rem" }}>No FAQs added yet.</div>}
    </div>
  );
}

// ─── SITE SETTINGS TAB ────────────────────────────────────────────────────────
function SiteSettingsTab({ toast }: { toast: (t: string, ok: boolean) => void }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const r = await fetch(`${API}/api/cms/settings`).catch(() => null);
    const d = await r?.json().catch(() => ({}));
    setSettings(d || {}); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const r = await fetch(`${API}/api/cms/settings`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(settings) }).catch(() => null);
    if (r?.ok) toast("Settings saved — all portals and website updated immediately!", true);
    else toast("Failed to save settings", false);
    setSaving(false);
  };

  const upd = (key: string) => (e: any) => setSettings(p => ({ ...p, [key]: e.target.value }));

  const groups = [
    { title: "Company Information", desc: "Updates everywhere — website, all portals, footer, contact page", fields: [
      { key: "company_name", label: "Company Full Name" },
      { key: "company_address", label: "Full Address" },
      { key: "company_phone", label: "Phone Number" },
      { key: "company_email", label: "Email Address" },
      { key: "company_website", label: "Website Domain" },
      { key: "company_cin", label: "CIN Number" },
      { key: "company_founded", label: "Founded Year" },
      { key: "office_hours", label: "Office Hours" },
    ]},
    { title: "Homepage Content", desc: "Updates website homepage instantly", fields: [
      { key: "hero_tagline", label: "Hero Tagline (main heading)" },
      { key: "hero_subtitle", label: "Hero Subtitle" },
      { key: "total_clients", label: "Total Clients Count" },
      { key: "total_years", label: "Years of Experience" },
      { key: "total_products", label: "Number of Products" },
      { key: "placement_rate", label: "Placement Rate (%)" },
    ]},
    { title: "Company About Text", desc: "Shown on about page and homepage", fields: [
      { key: "company_about", label: "About the Company", multiline: true },
    ]},
    { title: "Social Media Links", desc: "Shown in footer across all pages", fields: [
      { key: "facebook_url", label: "Facebook URL" },
      { key: "linkedin_url", label: "LinkedIn URL" },
      { key: "twitter_url", label: "Twitter / X URL" },
      { key: "instagram_url", label: "Instagram URL" },
      { key: "youtube_url", label: "YouTube URL" },
    ]},
    { title: "Google Maps", desc: "Map shown on contact page", fields: [
      { key: "maps_embed_url", label: "Google Maps Embed URL" },
    ]},
    { title: "SEO & Meta", desc: "Affects search engine rankings", fields: [
      { key: "meta_description", label: "Meta Description", multiline: true },
      { key: "meta_keywords", label: "Meta Keywords (comma separated)" },
    ]},
  ] as const;

  if (loading) return <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>Loading settings...</div>;

  return (
    <form onSubmit={handleSave}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>Site Settings</div>
          <div style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.2rem" }}>Change here once → updates automatically across website and all portals</div>
        </div>
        <button type="submit" disabled={saving} style={s.btn}>{saving ? "Saving..." : "Save All Settings"}</button>
      </div>

      {groups.map(group => (
        <div key={group.title} style={s.card}>
          <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{group.title}</div>
          <div style={{ color: "#6b7280", fontSize: "0.8rem", marginBottom: "1.25rem" }}>{group.desc}</div>
          <div style={{ display: "grid", gridTemplateColumns: group.fields.length > 1 ? "1fr 1fr" : "1fr", gap: "0.75rem" }}>
            {group.fields.map((field: any) => (
              <div key={field.key} style={field.multiline ? { gridColumn: "1 / -1" } : {}}>
                <label style={s.label}>{field.label}</label>
                {field.multiline
                  ? <textarea style={{ ...s.input, minHeight: 100, resize: "vertical" as const }} value={settings[field.key] || ""} onChange={upd(field.key)} />
                  : <input style={s.input} value={settings[field.key] || ""} onChange={upd(field.key)} />
                }
              </div>
            ))}
          </div>
        </div>
      ))}

      <button type="submit" disabled={saving} style={{ ...s.btn, width: "100%", padding: "1rem", fontSize: "1rem" }}>{saving ? "Saving..." : "Save All Settings"}</button>
    </form>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ContentManagerPage() {
  const [tab, setTab] = useState<Tab>("jobs");
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

  const showToast = (text: string, ok: boolean) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <div style={{ padding: "2rem", background: "#0a0a0f", minHeight: "100vh", color: "#fff" }}>
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: "0.25rem" }}>Content Manager</h1>
        <p style={{ color: "#6b7280" }}>One place to manage everything — changes appear across all portals and website automatically. No code needed.</p>
      </div>

      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "2rem", flexWrap: "wrap", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "0" }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding: "0.6rem 1.1rem", background: "none", border: "none", color: tab === t.key ? "#3b82f6" : "#6b7280", fontWeight: tab === t.key ? 700 : 400, cursor: "pointer", fontSize: "0.9rem", borderBottom: tab === t.key ? "2px solid #3b82f6" : "2px solid transparent", marginBottom: -1, whiteSpace: "nowrap" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === "jobs" && <JobsTab toast={showToast} />}
      {tab === "courses" && <CoursesTab toast={showToast} />}
      {tab === "blog" && <BlogTab toast={showToast} />}
      {tab === "testimonials" && <TestimonialsTab toast={showToast} />}
      {tab === "clients" && <ClientsTab toast={showToast} />}
      {tab === "services" && <ServicesTab toast={showToast} />}
      {tab === "faqs" && <FaqsTab toast={showToast} />}
      {tab === "settings" && <SiteSettingsTab toast={showToast} />}
    </div>
  );
}
