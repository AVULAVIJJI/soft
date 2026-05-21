'use client';
import { useState, useEffect } from 'react';

interface AttendanceRecord {
  id: number; employee_id: number; employee_name: string;
  check_in?: string; check_out?: string; status: string; total_hours?: number;
}

export default function WorkspaceAttendancePage() {
  const [todayRecords, setTodayRecords] = useState<AttendanceRecord[]>([]);
  const [allRecords, setAllRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'today' | 'history'>('today');
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
  const headers: any = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [todayRes, allRes] = await Promise.all([
        fetch(`${API}/api/v1/attendance/all-today`, { headers }),
        fetch(`${API}/api/v1/attendance/?limit=100`, { headers }),
      ]);
      if (todayRes.ok) { const d = await todayRes.json(); setTodayRecords(d.records || []); }
      if (allRes.ok) { const d = await allRes.json(); setAllRecords(d.records || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const formatTime = (t?: string) => {
    if (!t) return '-';
    try { return new Date(t).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); } catch { return t; }
  };

  const present = todayRecords.filter(r => r.check_in).length;
  const absent = todayRecords.filter(r => !r.check_in).length;
  const late = todayRecords.filter(r => r.status === 'late').length;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Attendance Management</h1>
            <p className="text-slate-500 text-sm mt-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('today')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${view === 'today' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>Today</button>
            <button onClick={() => setView('history')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${view === 'history' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>History</button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Checked In', value: present, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Absent', value: absent, color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Late', value: late, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Total', value: todayRecords.length, color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map(c => (
            <div key={c.label} className={`${c.bg} rounded-xl p-5 text-center border`}>
              <div className={`text-3xl font-bold ${c.color}`}>{c.value}</div>
              <div className="text-xs text-slate-500 mt-1">{c.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : view === 'today' ? (
            todayRecords.length === 0 ? (
              <div className="py-16 text-center text-slate-500">No attendance records for today</div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['Employee', 'Check In', 'Check Out', 'Hours', 'Status'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {todayRecords.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold">
                            {(r.employee_name || '?').charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 text-sm">{r.employee_name}</div>
                            <div className="text-xs text-slate-400">ID: {r.employee_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{formatTime(r.check_in)}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{formatTime(r.check_out)}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600 font-semibold">{r.total_hours ? `${r.total_hours}h` : '-'}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                          r.status === 'present' ? 'bg-green-100 text-green-700' :
                          r.status === 'late' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            allRecords.length === 0 ? (
              <div className="py-16 text-center text-slate-500">No attendance history</div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['Date', 'Employee ID', 'Check In', 'Check Out', 'Hours', 'Status'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {allRecords.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3.5 text-sm text-slate-800 font-medium">{new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">EMP{String(r.employee_id).padStart(3, '0')}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{formatTime(r.check_in)}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{formatTime(r.check_out)}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600 font-semibold">{r.total_hours ? `${r.total_hours}h` : '-'}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                          r.status === 'present' ? 'bg-green-100 text-green-700' :
                          r.status === 'late' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>
    </div>
  );
}
