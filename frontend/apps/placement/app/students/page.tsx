// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Placement Portal - Students Page
// File: frontend/apps/placement/app/students/page.tsx

'use client';

import { useState, useEffect } from 'react';

interface Student { id: string; first_name: string; last_name: string; email: string; phone?: string; course_name?: string; graduation_year?: number; gpa?: number; skills?: string[]; placement_status: string; resume_url?: string; }

export default function PlacementStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => { fetchStudents(); }, [page, statusFilter]);

  const fetchStudents = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/placements/students?page=${page}&size=20`;
    if (statusFilter !== 'all') url += `&placement_status=${statusFilter}`;
    if (search) url += `&search=${search}`;
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setStudents(d.items || []); setTotal(d.total || 0); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const statusConfig: Record<string, string> = {
    eligible: 'bg-blue-100 text-blue-800',
    registered: 'bg-yellow-100 text-yellow-800',
    placed: 'bg-green-100 text-green-800',
    not_eligible: 'bg-red-100 text-red-800',
    opted_out: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Students</h1>
            <p className="text-slate-500 text-sm mt-1">{total} students in placement pool</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">Export CSV</button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search by name, email..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchStudents()}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="all">All Students</option>
            {['eligible', 'registered', 'placed', 'not_eligible', 'opted_out'].map((s) => <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>)}
          </select>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="py-16 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : students.length === 0 ? (
            <div className="py-16 text-center text-slate-500">No students found.</div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['Student', 'Course', 'Graduation', 'Skills', 'Status', 'Resume'].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {s.first_name.charAt(0)}{s.last_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{s.first_name} {s.last_name}</p>
                            <p className="text-xs text-slate-400">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{s.course_name || '-'}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{s.graduation_year || '-'}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {(s.skills || []).slice(0, 2).map((skill) => (
                            <span key={skill} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{skill}</span>
                          ))}
                          {(s.skills || []).length > 2 && <span className="text-xs text-slate-400">+{(s.skills || []).length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusConfig[s.placement_status] || 'bg-gray-100 text-gray-600'}`}>
                          {s.placement_status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {s.resume_url ? (
                          <a href={s.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs font-semibold">View Resume</a>
                        ) : <span className="text-slate-400 text-xs">Not uploaded</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                <span>{(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}</span>
                <div className="flex gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border border-slate-200 rounded-lg disabled:opacity-40">Prev</button>
                  <button onClick={() => setPage((p) => p + 1)} disabled={page * 20 >= total} className="px-3 py-1.5 border border-slate-200 rounded-lg disabled:opacity-40">Next</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
