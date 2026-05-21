// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Admin Settings Page
// File: frontend/apps/admin/app/settings/page.tsx

'use client';

import { useState } from 'react';

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');
  const [settings, setSettings] = useState({
    site_name: 'Softmaster Technology Solutions',
    site_email: 'admin@softmastertech.com',
    support_email: 'support@softmastertech.com',
    billing_email: 'billing@softmastertech.com',
    phone: '+91-9000000000',
    address: '12-18, Indira Nagar Colony, Peerzadiguda, Hyderabad, Telangana - 500039',
    gst_number: '',
    razorpay_mode: 'test',
    email_notifications: true,
    maintenance_mode: false,
    registration_open: true,
    max_login_attempts: '5',
    session_timeout_hours: '24',
    default_course_currency: 'INR',
    placement_fee_percent: '15',
  });

  const handleSave = async (section: string) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ section, settings }),
      });
      setSaved(section);
      setTimeout(() => setSaved(''), 3000);
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const Section = ({ title, id, children }: { title: string; id: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-slate-900">{title}</h2>
        <button onClick={() => handleSave(id)} disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors">
          {saving ? 'Saving...' : saved === id ? '✓ Saved' : 'Save'}
        </button>
      </div>
      {children}
    </div>
  );

  const Field = ({ label, name, type = 'text', disabled = false }: { label: string; name: keyof typeof settings; type?: string; disabled?: boolean }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {type === 'checkbox' ? (
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={settings[name] as boolean} onChange={(e) => setSettings((p) => ({ ...p, [name]: e.target.checked }))} className="w-4 h-4 text-blue-600 rounded" />
          <span className="text-sm text-slate-600">{settings[name] ? 'Enabled' : 'Disabled'}</span>
        </label>
      ) : (
        <input type={type} value={settings[name] as string} onChange={(e) => setSettings((p) => ({ ...p, [name]: e.target.value }))} disabled={disabled}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:bg-slate-50 disabled:text-slate-500" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Platform Settings</h1>

        <Section title="Company Information" id="company">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Company Name" name="site_name" />
            <Field label="Admin Email" name="site_email" type="email" />
            <Field label="Support Email" name="support_email" type="email" />
            <Field label="Billing Email" name="billing_email" type="email" />
            <Field label="Phone Number" name="phone" />
            <Field label="GST Number" name="gst_number" />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Registered Address</label>
            <textarea value={settings.address} onChange={(e) => setSettings((p) => ({ ...p, address: e.target.value }))} rows={2}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none" />
          </div>
        </Section>

        <Section title="Payment Settings" id="payment">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Razorpay Mode</label>
              <select value={settings.razorpay_mode} onChange={(e) => setSettings((p) => ({ ...p, razorpay_mode: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                <option value="test">Test Mode</option>
                <option value="live">Live Mode</option>
              </select>
            </div>
            <Field label="Default Currency" name="default_course_currency" />
            <Field label="Placement Fee (%)" name="placement_fee_percent" type="number" />
          </div>
        </Section>

        <Section title="Security Settings" id="security">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Max Login Attempts" name="max_login_attempts" type="number" />
            <Field label="Session Timeout (hours)" name="session_timeout_hours" type="number" />
          </div>
        </Section>

        <Section title="Platform Controls" id="platform">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <p className="font-medium text-slate-900 text-sm">Email Notifications</p>
                <p className="text-xs text-slate-500">Send automated email alerts for registrations, enrollments, and updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.email_notifications} onChange={(e) => setSettings((p) => ({ ...p, email_notifications: e.target.checked }))} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </label>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <p className="font-medium text-slate-900 text-sm">Open Registration</p>
                <p className="text-xs text-slate-500">Allow new users to register on all portals</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.registration_open} onChange={(e) => setSettings((p) => ({ ...p, registration_open: e.target.checked }))} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </label>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-red-700 text-sm">Maintenance Mode</p>
                <p className="text-xs text-slate-500">Enable to take all portals offline for maintenance</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.maintenance_mode} onChange={(e) => setSettings((p) => ({ ...p, maintenance_mode: e.target.checked }))} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-red-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </label>
            </div>
          </div>
        </Section>

        {/* Company Info Box */}
        <div className="bg-slate-100 rounded-xl p-4 text-xs text-slate-500">
          <strong>Softmaster Technology Solutions Private Limited</strong><br />
          Reg: PVT-20000-LK | Incorporated: November 27, 2024<br />
          12-18, Indira Nagar Colony, Peerzadiguda, Hyderabad, Telangana - 500039
        </div>
      </div>
    </div>
  );
}
