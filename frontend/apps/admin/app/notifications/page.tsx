// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Admin Notifications Page
// File: frontend/apps/admin/app/notifications/page.tsx

'use client';

import { useState, useEffect } from 'react';

interface Notification { id: string; title: string; message: string; type: string; is_read: boolean; target_role?: string; created_at: string; sent_count?: number; }

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'info', target_role: 'all' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/?is_admin=true`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setNotifications(d.items || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const token = localStorage.getItem('access_token');
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      setSuccess('Notification sent successfully!');
      setForm({ title: '', message: '', type: 'info', target_role: 'all' });
      setShowForm(false);
      fetchNotifications();
      setTimeout(() => setSuccess(''), 4000);
    } catch (e) { console.error(e); } finally { setSending(false); }
  };

  const typeConfig: Record<string, { color: string; icon: string; badge: string }> = {
    info: { color: 'border-l-blue-500', icon: 'ℹ️', badge: 'bg-blue-100 text-blue-800' },
    success: { color: 'border-l-green-500', icon: '✅', badge: 'bg-green-100 text-green-800' },
    warning: { color: 'border-l-yellow-500', icon: '⚠️', badge: 'bg-yellow-100 text-yellow-800' },
    error: { color: 'border-l-red-500', icon: '🔴', badge: 'bg-red-100 text-red-800' },
    announcement: { color: 'border-l-purple-500', icon: '📢', badge: 'bg-purple-100 text-purple-800' },
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            {showForm ? 'Cancel' : '+ Broadcast Notification'}
          </button>
        </div>

        {success && <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 mb-5 text-sm font-medium">{success}</div>}

        {/* Broadcast Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
            <h2 className="font-bold text-slate-900 mb-4">Send Platform-wide Notification</h2>
            <form onSubmit={sendNotification} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Title *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Notification title" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
                  <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                    {['info', 'success', 'warning', 'error', 'announcement'].map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Target Audience</label>
                <select value={form.target_role} onChange={(e) => setForm((p) => ({ ...p, target_role: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                  <option value="all">All Users</option>
                  <option value="student">Students (Academy)</option>
                  <option value="employee">Employees</option>
                  <option value="client">Clients</option>
                  <option value="recruiter">Recruiters</option>
                  <option value="trainer">Trainers</option>
                  <option value="placement_officer">Placement Officers</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Message *</label>
                <textarea value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} required rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none" placeholder="Notification message..." />
              </div>
              <button type="submit" disabled={sending} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-colors">
                {sending ? 'Sending...' : 'Send Notification'}
              </button>
            </form>
          </div>
        )}

        {/* Notifications List */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Sent Notifications</h2>
            <span className="text-sm text-slate-500">{notifications.length} total</span>
          </div>
          {loading ? (
            <div className="py-16 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-500">No notifications sent yet.</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {notifications.map((n) => {
                const tc = typeConfig[n.type] || typeConfig.info;
                return (
                  <div key={n.id} className={`px-6 py-4 border-l-4 ${tc.color}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="text-xl mt-0.5">{tc.icon}</span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-slate-900 text-sm">{n.title}</p>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tc.badge}`}>{n.type}</span>
                            {n.target_role && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">→ {n.target_role}</span>}
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{n.message}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <p className="text-xs text-slate-400">{new Date(n.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                            {n.sent_count !== undefined && <p className="text-xs text-slate-400">Sent to {n.sent_count} users</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
