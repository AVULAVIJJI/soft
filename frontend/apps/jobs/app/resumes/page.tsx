// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Jobs Portal - Resumes Page
// File: frontend/apps/jobs/app/resumes/page.tsx

'use client';

import { useState, useEffect } from 'react';

interface Resume { id: string; title: string; headline?: string; total_experience_years?: number; current_location?: string; skills?: string[]; is_active: boolean; resume_url?: string; created_at: string; updated_at: string; }

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', headline: '', total_experience_years: 0, current_location: '', skills: '', resume_url: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/my-resumes`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setResumes(await res.json() || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    const token = localStorage.getItem('access_token');
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/resumes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, skills: form.skills.split(',').map((s) => s.trim()), total_experience_years: Number(form.total_experience_years) }),
      });
      setSuccess('Resume saved successfully!');
      setShowForm(false);
      setForm({ title: '', headline: '', total_experience_years: 0, current_location: '', skills: '', resume_url: '' });
      fetchResumes();
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  };

  const toggleActive = async (resumeId: string, current: boolean) => {
    const token = localStorage.getItem('access_token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/resumes/${resumeId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ is_active: !current }),
    });
    fetchResumes();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">My Resumes</h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            {showForm ? 'Cancel' : '+ Add Resume'}
          </button>
        </div>

        {success && <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 mb-5 text-sm">{success}</div>}

        {/* Add Resume Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
            <h2 className="font-bold text-slate-900 mb-4">Add Resume Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Resume Title *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g., Full Stack Developer Resume" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Professional Headline</label>
                  <input type="text" value={form.headline} onChange={(e) => setForm((p) => ({ ...p, headline: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g., React Developer with 2 years experience" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Total Experience (years)</label>
                  <input type="number" min="0" step="0.5" value={form.total_experience_years} onChange={(e) => setForm((p) => ({ ...p, total_experience_years: Number(e.target.value) }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Location</label>
                  <input type="text" value={form.current_location} onChange={(e) => setForm((p) => ({ ...p, current_location: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g., Hyderabad, Telangana" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Skills (comma-separated)</label>
                <input type="text" value={form.skills} onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="React, Node.js, Python, SQL, Git" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Resume File URL</label>
                <input type="url" value={form.resume_url} onChange={(e) => setForm((p) => ({ ...p, resume_url: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="https://drive.google.com/..." />
                <p className="text-xs text-slate-400 mt-1.5">Link to your resume PDF hosted on Google Drive, Dropbox, etc.</p>
              </div>
              <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-xl text-sm">{submitting ? 'Saving...' : 'Save Resume'}</button>
            </form>
          </div>
        )}

        {/* Resumes List */}
        {loading ? (
          <div className="py-16 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : resumes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center">
            <div className="text-5xl mb-3">📄</div>
            <p className="text-slate-600 font-medium mb-1">No resumes yet</p>
            <p className="text-slate-400 text-sm">Add your resume to start applying for jobs easily.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map((r) => (
              <div key={r.id} className={`bg-white rounded-2xl border p-6 ${r.is_active ? 'border-blue-200' : 'border-slate-100'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900">{r.title}</h3>
                      {r.is_active && <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">Active</span>}
                    </div>
                    {r.headline && <p className="text-sm text-slate-500 mb-3">{r.headline}</p>}
                    <div className="flex flex-wrap gap-3 text-xs text-slate-400 mb-3">
                      {r.total_experience_years !== undefined && <span>💼 {r.total_experience_years} yrs exp</span>}
                      {r.current_location && <span>📍 {r.current_location}</span>}
                      <span>Updated {new Date(r.updated_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                    {r.skills && r.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {r.skills.map((s) => <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">{s}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {r.resume_url && <a href={r.resume_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 font-medium text-center">View PDF</a>}
                    <button onClick={() => toggleActive(r.id, r.is_active)} className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${r.is_active ? 'text-slate-600 border-slate-200 hover:bg-slate-50' : 'text-blue-600 border-blue-200 hover:bg-blue-50'}`}>
                      {r.is_active ? 'Deactivate' : 'Set Active'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
