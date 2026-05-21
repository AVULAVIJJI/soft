// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Client Invoices Page
// File: frontend/apps/client/app/invoices/page.tsx

'use client';

import { useState, useEffect } from 'react';

interface Invoice { id: string; invoice_number: string; invoice_date: string; due_date: string; subtotal: number; tax_amount: number; total_amount: number; paid_amount: number; balance_due: number; status: string; currency: string; }

export default function ClientInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clients/my-invoices`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setInvoices(d.items || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(n);

  const statusConfig: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    partial: 'bg-yellow-100 text-yellow-800',
    overdue: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-500',
  };

  const filtered = filter === 'all' ? invoices : invoices.filter((i) => i.status === filter);
  const totalOutstanding = invoices.filter((i) => ['sent', 'overdue', 'partial'].includes(i.status)).reduce((s, i) => s + i.balance_due, 0);
  const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.total_amount, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Invoices</h1>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <p className="text-sm text-slate-500 mb-1">Outstanding Amount</p>
            <p className="text-2xl font-bold text-orange-600">{fmt(totalOutstanding)}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <p className="text-sm text-slate-500 mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-green-600">{fmt(totalPaid)}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <p className="text-sm text-slate-500 mb-1">Total Invoices</p>
            <p className="text-2xl font-bold text-slate-900">{invoices.length}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {['all', 'sent', 'paid', 'overdue', 'partial'].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === s ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{s}</button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="py-16 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-500">No invoices found.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Invoice #', 'Date', 'Due Date', 'Amount', 'Paid', 'Balance', 'Status'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-mono text-sm font-semibold text-blue-600">{inv.invoice_number}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{new Date(inv.invoice_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{new Date(inv.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-900">{fmt(inv.total_amount)}</td>
                    <td className="px-5 py-4 text-sm text-green-600">{fmt(inv.paid_amount)}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-orange-600">{fmt(inv.balance_due)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusConfig[inv.status]}`}>{inv.status}</span>
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
