'use client';
import { useState, useEffect } from 'react';
import DashboardShell from '../../components/DashboardShell';

export default function WorkspaceReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
  const headers: any = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [usersRes, attRes, leavesRes, payRes] = await Promise.all([
        fetch(`${API}/api/v1/users/?limit=100`, { headers }),
        fetch(`${API}/api/v1/attendance/?limit=100`, { headers }),
        fetch(`${API}/api/v1/attendance/leaves`, { headers }),
        fetch(`${API}/api/v1/payroll/?limit=100`, { headers }),
      ]);
      const users = usersRes.ok ? await usersRes.json() : { users: [], total: 0 };
      const att = attRes.ok ? await attRes.json() : { records: [] };
      const leaves = leavesRes.ok ? await leavesRes.json() : { leaves: [] };
      const pay = payRes.ok ? await payRes.json() : { records: [] };

      const totalSalary = (pay.records || []).reduce((s: number, r: any) => s + (r.net_salary || 0), 0);
      const avgHours = (att.records || []).length > 0
        ? ((att.records || []).reduce((s: number, r: any) => s + (r.total_hours || 0), 0) / att.records.length).toFixed(1)
        : '0';

      setStats({
        total_employees: users.total || 0,
        total_attendance: (att.records || []).length,
        avg_hours: avgHours,
        total_leaves: (leaves.leaves || []).length,
        pending_leaves: (leaves.leaves || []).filter((l: any) => l.status === 'pending').length,
        approved_leaves: (leaves.leaves || []).filter((l: any) => l.status === 'approved').length,
        total_payroll: (pay.records || []).length,
        total_salary: totalSalary,
        paid_salary: (pay.records || []).filter((r: any) => r.status === 'paid').reduce((s: number, r: any) => s + (r.net_salary || 0), 0),
      });
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fmt = (n: number) => `₹${(n || 0).toLocaleString('en-IN')}`;

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Reports & Analytics</h1>

        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : !stats ? (
          <div className="text-center text-slate-500 py-12">Unable to load reports</div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Employee Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Employees', value: stats.total_employees, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Attendance Records', value: stats.total_attendance, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Avg Hours/Day', value: `${stats.avg_hours}h`, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'Total Leaves', value: stats.total_leaves, color: 'text-yellow-600', bg: 'bg-yellow-50' },
              ].map(c => (
                <div key={c.label} className={`${c.bg} rounded-xl p-5 border`}>
                  <div className={`text-3xl font-bold ${c.color}`}>{c.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{c.label}</div>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-semibold text-slate-800 mb-4">Leave Summary</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Pending', value: stats.pending_leaves, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                { label: 'Approved', value: stats.approved_leaves, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Total', value: stats.total_leaves, color: 'text-blue-600', bg: 'bg-blue-50' },
              ].map(c => (
                <div key={c.label} className={`${c.bg} rounded-xl p-5 border text-center`}>
                  <div className={`text-3xl font-bold ${c.color}`}>{c.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{c.label}</div>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-semibold text-slate-800 mb-4">Payroll Summary</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Records', value: stats.total_payroll, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Total Salary', value: fmt(stats.total_salary), color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'Paid Out', value: fmt(stats.paid_salary), color: 'text-green-600', bg: 'bg-green-50' },
              ].map(c => (
                <div key={c.label} className={`${c.bg} rounded-xl p-5 border text-center`}>
                  <div className={`text-2xl font-bold ${c.color}`}>{c.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{c.label}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}