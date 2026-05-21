'use client';
import { useState, useEffect } from 'react';

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => { fetchEnrollments(); }, []);

  const fetchEnrollments = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`${API}/api/v1/courses/enrollments/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { const d = await res.json(); setEnrollments(d.enrollments || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const filtered = search
    ? enrollments.filter(e =>
        e.student_name.toLowerCase().includes(search.toLowerCase()) ||
        e.student_email.toLowerCase().includes(search.toLowerCase()) ||
        e.course_title.toLowerCase().includes(search.toLowerCase())
      )
    : enrollments;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Student Enrollments</h1>
            <p className="text-slate-500 text-sm mt-1">{enrollments.length} total enrollments</p>
          </div>
        </div>

        <input type="text" placeholder="Search by student name, email or course..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm mb-6 outline-none focus:ring-2 focus:ring-blue-500 bg-white" />

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-500">No enrollments found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Student', 'Email', 'Course', 'Enrolled On', 'Progress', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(e => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                          {(e.student_name || '?').charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900 text-sm">{e.student_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{e.student_email}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-800 font-medium">{e.course_title}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">
                      {new Date(e.enrolled_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${e.progress || 0}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{e.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        e.status === 'completed' ? 'bg-green-100 text-green-700' :
                        e.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>{e.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}