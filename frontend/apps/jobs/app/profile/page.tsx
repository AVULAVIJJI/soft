// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Jobs Portal - Profile Page
// File: frontend/apps/jobs/app/profile/page.tsx

'use client';

import { useState, useEffect } from 'react';

interface Profile { first_name: string; last_name: string; email: string; phone?: string; headline?: string; location?: string; total_experience?: number; skills?: string[]; linkedin_url?: string; github_url?: string; portfolio_url?: string; }

export default function JobsProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ phone: '', headline: '', location: '', total_experience: 0, skills: '', linkedin_url: '', github_url: '', portfolio_url: '' });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then((d) => {
        setProfile(d);
        setForm({ phone: d.phone || '', headline: d.headline || '', location: d.location || '', total_experience: d.total_experience || 0, skills: (d.skills || []).join(', '), linkedin_url: d.linkedin_url || '', github_url: d.github_url || '', portfolio_url: d.portfolio_url || '' });
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('access_token');
    try {
      const payload = { ...form, skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean), total_experience: Number(form.total_experience) };
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      setProfile((p) => p ? { ...p, ...payload } : p);
      setEditing(false);
      setSuccess('Profile updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center">Profile not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">My Profile</h1>
        {success && <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 mb-5 text-sm">{success}</div>}

        <div className="bg-white rounded-2xl border border-slate-100 p-8 mb-5">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-18 h-18 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-black">
              {profile.first_name.charAt(0)}{profile.last_name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{profile.first_name} {profile.last_name}</h2>
              <p className="text-slate-500 text-sm">{editing ? form.headline : profile.headline || 'Add a professional headline'}</p>
              <p className="text-slate-400 text-xs">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800">Professional Info</h3>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="text-blue-600 text-sm font-semibold border border-blue-200 px-4 py-1.5 rounded-lg hover:bg-blue-50">Edit</button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="text-slate-500 text-sm px-4 py-1.5 rounded-lg hover:bg-slate-100">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white text-sm font-semibold px-5 py-1.5 rounded-lg disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'phone', label: 'Phone', type: 'tel' },
              { key: 'headline', label: 'Professional Headline', type: 'text' },
              { key: 'location', label: 'Location', type: 'text' },
              { key: 'total_experience', label: 'Experience (years)', type: 'number' },
              { key: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
              { key: 'github_url', label: 'GitHub URL', type: 'url' },
              { key: 'portfolio_url', label: 'Portfolio URL', type: 'url' },
            ].map((f) => (
              <div key={f.key} className={f.key === 'linkedin_url' || f.key === 'github_url' || f.key === 'portfolio_url' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{f.label}</label>
                <input type={f.type} value={(form as any)[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} disabled={!editing}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:bg-slate-50 disabled:text-slate-500" />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Skills (comma-separated)</label>
              <input type="text" value={form.skills} onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))} disabled={!editing}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:bg-slate-50 disabled:text-slate-500" placeholder="React, Node.js, Python, SQL" />
            </div>
          </div>

          {!editing && form.skills && (
            <div className="mt-5">
              <p className="text-sm font-medium text-slate-700 mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {form.skills.split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                  <span key={s} className="text-sm bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-lg">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
