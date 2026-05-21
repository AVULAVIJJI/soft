// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Academy Payments Page
// File: frontend/apps/academy/app/payments/page.tsx

'use client';

import { useState, useEffect } from 'react';

interface Payment { id: string; amount: number; currency: string; payment_date: string; payment_method: string; status: string; course_name: string; razorpay_order_id?: string; razorpay_payment_id?: string; receipt_url?: string; }

export default function AcademyPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/my-payments`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then((d) => { setPayments(d.items || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(n);

  const statusColor: Record<string, string> = {
    success: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-blue-100 text-blue-800',
  };

  const methodIcon: Record<string, string> = {
    upi: '📱',
    card: '💳',
    netbanking: '🏦',
    wallet: '👛',
    emi: '📅',
  };

  const totalSpent = payments.filter((p) => p.status === 'success').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Payment History</h1>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white">
            <p className="text-blue-200 text-sm mb-1">Total Invested</p>
            <p className="text-3xl font-black">{fmt(totalSpent)}</p>
            <p className="text-blue-300 text-xs mt-1">In your education</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <p className="text-slate-500 text-sm mb-1">Total Transactions</p>
            <p className="text-3xl font-black text-slate-900">{payments.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <p className="text-slate-500 text-sm mb-1">Courses Enrolled</p>
            <p className="text-3xl font-black text-slate-900">{new Set(payments.filter((p) => p.status === 'success').map((p) => p.course_name)).size}</p>
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="py-16 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : payments.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-5xl mb-4">💳</div>
              <p className="text-slate-600 font-medium">No payments yet</p>
              <p className="text-slate-400 text-sm mt-1">Enroll in a course to see payment history.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {payments.map((p) => (
                <div key={p.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      {methodIcon[p.payment_method] || '💳'}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{p.course_name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(p.payment_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                        {p.razorpay_payment_id && ` • ${p.razorpay_payment_id}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-black text-slate-900">{fmt(p.amount)}</p>
                      <p className="text-xs text-slate-400 capitalize">{p.payment_method?.replace('_', ' ')}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[p.status]}`}>{p.status}</span>
                    {p.receipt_url && (
                      <a href={p.receipt_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs font-medium hover:text-blue-800">Receipt</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* GST Note */}
        <p className="text-xs text-slate-400 text-center mt-5">
          All payments include 18% GST. For billing queries contact billing@softmastertech.com<br />
          Softmaster Technology Solutions Pvt Ltd | Reg: PVT-20000-LK
        </p>
      </div>
    </div>
  );
}
