// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Admin Revenue Page
// File: frontend/apps/admin/app/revenue/page.tsx

'use client';

import { useState, useEffect } from 'react';

interface RevenueSummary { period: string; total_revenue: number; total_expenses: number; net_profit: number; pending_invoice_count: number; pending_invoice_amount: number; }
interface RevenueEntry { analytics_date: string; source: string; total_revenue: number; transaction_count: number; }

export default function AdminRevenuePage() {
  const [summary, setSummary] = useState<RevenueSummary | null>(null);
  const [entries, setEntries] = useState<RevenueEntry[]>([]);
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRevenue(); }, [period]);

  const fetchRevenue = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    const h = { Authorization: `Bearer ${token}` };
    try {
      const [summaryRes, analyticsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/summary?period=${period}`, { headers: h }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/revenue?period=${period}`, { headers: h }),
      ]);
      if (summaryRes.ok) setSummary(await summaryRes.json());
      if (analyticsRes.ok) { const d = await analyticsRes.json(); setEntries(d.by_source || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(n);

  const sourceColors: Record<string, string> = {
    academy: 'bg-blue-100 text-blue-800',
    placement: 'bg-emerald-100 text-emerald-800',
    client_project: 'bg-purple-100 text-purple-800',
    jobs: 'bg-orange-100 text-orange-800',
    subscription: 'bg-cyan-100 text-cyan-800',
    other: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Revenue & Finance</h1>
          <div className="flex gap-2">
            {['week', 'month', 'quarter', 'year'].map((p) => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${period === p ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'}`}>
                {p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : p === 'quarter' ? 'Quarter' : 'This Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
              <p className="text-blue-200 text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-black">{fmt(summary.total_revenue)}</p>
            </div>
            <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 p-6">
              <p className="text-slate-500 text-sm mb-1">Expenses</p>
              <p className="text-3xl font-black text-red-600">{fmt(summary.total_expenses)}</p>
            </div>
            <div className={`lg:col-span-1 rounded-2xl border p-6 ${summary.net_profit >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              <p className="text-slate-500 text-sm mb-1">Net Profit</p>
              <p className={`text-3xl font-black ${summary.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(summary.net_profit)}</p>
            </div>
            <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 p-6">
              <p className="text-slate-500 text-sm mb-1">Pending Invoices</p>
              <p className="text-3xl font-black text-orange-600">{summary.pending_invoice_count}</p>
              <p className="text-xs text-slate-400 mt-1">{fmt(summary.pending_invoice_amount)}</p>
            </div>
            <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 p-6">
              <p className="text-slate-500 text-sm mb-1">Profit Margin</p>
              <p className="text-3xl font-black text-slate-900">
                {summary.total_revenue > 0 ? `${Math.round((summary.net_profit / summary.total_revenue) * 100)}%` : '0%'}
              </p>
            </div>
          </div>
        )}

        {/* Revenue by Source */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-5">Revenue by Source</h2>
            {loading ? (
              <div className="py-8 flex justify-center"><div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : entries.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">No revenue data available</p>
            ) : (
              <div className="space-y-3">
                {entries.map((e) => (
                  <div key={e.source} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${sourceColors[e.source] || 'bg-gray-100 text-gray-700'}`}>{e.source.replace('_', ' ')}</span>
                      <span className="text-xs text-slate-400">{e.transaction_count} transactions</span>
                    </div>
                    <span className="font-bold text-slate-900">{fmt(e.total_revenue)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Finance Actions */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-5">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { label: 'View All Invoices', href: '/invoices', icon: '📄', desc: 'Manage client invoices' },
                { label: 'Expense Reports', href: '/reports', icon: '📊', desc: 'View expense analytics' },
                { label: 'Process Payroll', href: '/workspace/payroll', icon: '💰', desc: 'Run monthly payroll' },
                { label: 'Tax Records', href: '/tax', icon: '🧾', desc: 'GST and TDS management' },
              ].map((a) => (
                <a key={a.label} href={a.href} className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                  <span className="text-2xl">{a.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{a.label}</p>
                    <p className="text-xs text-slate-500">{a.desc}</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
