// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Placement Portal - Companies Page
// File: frontend/apps/placement/app/companies/page.tsx

'use client';

import { useState, useEffect } from 'react';

interface Company { company_name: string; placements: number; avg_package: number; drives?: number; }
interface DriveCompany { id: string; company_name: string; drive_title: string; status: string; drive_date: string; salary_package_lpa: number; total_registrations: number; total_selected: number; }

export default function PlacementCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [recentDrives, setRecentDrives] = useState<DriveCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ company_name: '', industry: '', hr_contact_name: '', hr_contact_email: '', hr_contact_phone: '', website: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const h = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/placements/companies`, { headers: h }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/placements/drives?size=10`, { headers: h }),
    ]).then(async ([cRes, dRes]) => {
      if (cRes.ok) setCompanies(await cRes.json());
      if (dRes.ok) { const d = await dRes.json(); setRecentDrives(d.items || []); }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    const token = localStorage.getItem('access_token');
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/placements/hiring-companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      setShowAddForm(false);
      setForm({ company_name: '', industry: '', hr_contact_name: '', hr_contact_email: '', hr_contact_phone: '', website: '' });
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  };

  const fmt = (n: number) => new Intl.NumberFormat('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Hiring Companies</h1>
          <button onClick={() => setShowAddForm(!showAddForm)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            {showAddForm ? 'Cancel' : '+ Add Company'}
          </button>
        </div>

        {/* Add Company Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
            <h2 className="font-bold text-slate-900 mb-4">Add Hiring Company</h2>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'company_name', label: 'Company Name', required: true },
                { key: 'industry', label: 'Industry', required: false },
                { key: 'hr_contact_name', label: 'HR Contact Name', required: false },
                { key: 'hr_contact_email', label: 'HR Email', required: false },
                { key: 'hr_contact_phone', label: 'HR Phone', required: false },
                { key: 'website', label: 'Company Website', required: false },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{f.label} {f.required && '*'}</label>
                  <input type="text" value={(form as any)[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} required={f.required}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
              ))}
              <div className="md:col-span-2">
                <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-xl text-sm">
                  {submitting ? 'Adding...' : 'Add Company'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Companies List */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-4">Companies by Placements</h2>
            {companies.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">No placement data available yet.</p>
            ) : (
              <div className="space-y-3">
                {companies.map((c, i) => (
                  <div key={c.company_name} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">{c.company_name}</p>
                      <p className="text-xs text-slate-500">{c.placements} students placed</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600 text-sm">{fmt(c.avg_package)} INR</p>
                      <p className="text-xs text-slate-400">avg pkg</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Drives */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-4">Recent Placement Drives</h2>
            {recentDrives.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">No drives recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {recentDrives.map((d) => (
                  <div key={d.id} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {d.company_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">{d.company_name}</p>
                      <p className="text-xs text-slate-500">{new Date(d.drive_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} &bull; {d.salary_package_lpa} INR</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 text-sm">{d.total_selected}/{d.total_registrations}</p>
                      <p className="text-xs text-slate-400">selected</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
