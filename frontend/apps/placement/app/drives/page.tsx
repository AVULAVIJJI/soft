// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Placement Portal - Drives Management Page
// File: frontend/apps/placement/app/drives/page.tsx

'use client';

import { useState, useEffect } from 'react';

interface Drive { id: string; company_name: string; drive_title: string; salary_package_lpa: number; eligibility_criteria: string; drive_date: string; registration_deadline: string; venue: string; status: string; total_registrations: number; total_selected: number; roles_offered: string[]; }

export default function PlacementDrivesPage() {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company_name: '', drive_title: '', salary_package_lpa: '', eligibility_criteria: '', drive_date: '', registration_deadline: '', venue: '', roles_offered: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchDrives(); }, [filter]);

  const fetchDrives = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/placements/drives`;
    if (filter !== 'all') url += `?status=${filter}`;
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setDrives(d.items || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('access_token');
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/placements/drives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, roles_offered: form.roles_offered.split(',').map((r) => r.trim()), salary_package_lpa: Number(form.salary_package_lpa) }),
      });
      setShowForm(false);
      setForm({ company_name: '', drive_title: '', salary_package_lpa: '', eligibility_criteria: '', drive_date: '', registration_deadline: '', venue: '', roles_offered: '' });
      fetchDrives();
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    upcoming: { label: 'Upcoming', color: 'bg-blue-100 text-blue-800' },
    registration_open: { label: 'Open', color: 'bg-green-100 text-green-800' },
    in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
    completed: { label: 'Completed', color: 'bg-gray-100 text-gray-800' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Placement Drives</h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            {showForm ? 'Cancel' : 'Schedule Drive'}
          </button>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'upcoming', 'registration_open', 'in_progress', 'completed'].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === s ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* New Drive Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
            <h2 className="font-bold text-slate-900 mb-5">Schedule New Placement Drive</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'company_name', label: 'Company Name', type: 'text', required: true },
                { key: 'drive_title', label: 'Drive Title', type: 'text', required: true },
                { key: 'salary_package_lpa', label: 'Package (INR)', type: 'number', required: true },
                { key: 'venue', label: 'Venue', type: 'text', required: true },
                { key: 'drive_date', label: 'Drive Date', type: 'date', required: true },
                { key: 'registration_deadline', label: 'Registration Deadline', type: 'date', required: true },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{f.label} {f.required && '*'}</label>
                  <input type={f.type} value={(form as any)[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} required={f.required}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Roles Offered (comma-separated) *</label>
                <input type="text" value={form.roles_offered} onChange={(e) => setForm((p) => ({ ...p, roles_offered: e.target.value }))} required placeholder="Software Developer, Data Analyst, DevOps Engineer"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Eligibility Criteria</label>
                <textarea value={form.eligibility_criteria} onChange={(e) => setForm((p) => ({ ...p, eligibility_criteria: e.target.value }))} rows={2}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none" placeholder="e.g., 60% throughout academics, No backlogs, 2023/2024 batch" />
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-colors">
                  {submitting ? 'Scheduling...' : 'Schedule Drive'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Drives Grid */}
        {loading ? (
          <div className="py-16 flex justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : drives.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
            <div className="text-5xl mb-4">🎯</div>
            <p className="text-slate-500">No placement drives found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {drives.map((d) => {
              const sc = statusConfig[d.status] || { label: d.status, color: 'bg-gray-100 text-gray-800' };
              return (
                <div key={d.id} className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                      {d.company_name.charAt(0)}
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${sc.color}`}>{sc.label}</span>
                  </div>
                  <h3 className="font-bold text-slate-900">{d.company_name}</h3>
                  <p className="text-sm text-slate-500 mt-0.5 mb-3">{d.drive_title}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Package</span>
                      <span className="font-semibold text-green-600">{d.salary_package_lpa} INR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Drive Date</span>
                      <span className="font-medium text-slate-800">{new Date(d.drive_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Registered</span>
                      <span className="font-medium text-slate-800">{d.total_registrations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Selected</span>
                      <span className="font-medium text-green-600">{d.total_selected}</span>
                    </div>
                  </div>
                  {d.roles_offered?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {d.roles_offered.slice(0, 2).map((r) => (
                        <span key={r} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{r}</span>
                      ))}
                      {d.roles_offered.length > 2 && <span className="text-xs text-slate-400">+{d.roles_offered.length - 2} more</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
