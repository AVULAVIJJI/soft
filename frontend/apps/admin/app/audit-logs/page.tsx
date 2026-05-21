// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Admin Audit Logs Page
// File: frontend/apps/admin/app/audit-logs/page.tsx

'use client';

import { useState, useEffect } from 'react';

interface AuditLog { id: string; user_id?: string; user_email?: string; action: string; resource_type: string; resource_id?: string; ip_address?: string; method: string; path: string; status_code: number; response_time_ms?: number; created_at: string; }

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => { fetchLogs(); }, [page]);

  const fetchLogs = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/audit-logs?page=${page}&size=30`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setLogs(d.items || []); setTotal(d.total || 0); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const methodColor: Record<string, string> = {
    GET: 'bg-blue-100 text-blue-800',
    POST: 'bg-green-100 text-green-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    PATCH: 'bg-orange-100 text-orange-800',
    DELETE: 'bg-red-100 text-red-800',
  };

  const statusColor = (code: number) => code < 300 ? 'text-green-600' : code < 400 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
          <span className="text-sm text-slate-500">{total.toLocaleString()} total events</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="py-16 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['Time', 'User', 'Method', 'Endpoint', 'Status', 'Response Time', 'IP'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-mono text-xs">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="px-4 py-2.5 text-slate-700 max-w-[150px] truncate">{log.user_email || 'Anonymous'}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${methodColor[log.method] || 'bg-gray-100 text-gray-700'}`}>{log.method}</span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 max-w-[250px] truncate">{log.path}</td>
                      <td className={`px-4 py-2.5 font-bold ${statusColor(log.status_code)}`}>{log.status_code}</td>
                      <td className="px-4 py-2.5 text-slate-500">{log.response_time_ms ? `${log.response_time_ms}ms` : '-'}</td>
                      <td className="px-4 py-2.5 text-slate-400">{log.ip_address || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                <span>Page {page} of {Math.ceil(total / 30)}</span>
                <div className="flex gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50">Prev</button>
                  <button onClick={() => setPage((p) => p + 1)} disabled={page * 30 >= total} className="px-3 py-1.5 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50">Next</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
