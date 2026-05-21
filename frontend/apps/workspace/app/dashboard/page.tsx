"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardShell from "../../components/DashboardShell";

export default function WorkspaceDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ users: 0, present: 0, pending_leaves: 0, payroll: 0 });
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem("access_token");
    const h = { Authorization: `Bearer ${token}` };
    try {
      const [usersRes, attRes, leavesRes, payRes] = await Promise.all([
        fetch(`${API}/api/v1/users/?limit=1`, { headers: h }),
        fetch(`${API}/api/v1/attendance/all-today`, { headers: h }),
        fetch(`${API}/api/v1/attendance/leaves`, { headers: h }),
        fetch(`${API}/api/v1/payroll/?limit=1`, { headers: h }),
      ]);
      const users = usersRes.ok ? await usersRes.json() : { total: 0 };
      const att = attRes.ok ? await attRes.json() : { total: 0 };
      const leaves = leavesRes.ok ? await leavesRes.json() : { leaves: [] };
      const pay = payRes.ok ? await payRes.json() : { total: 0 };
      const pending = (leaves.leaves || []).filter((l: any) => l.status === "pending").length;
      setStats({ users: users.total || 0, present: att.total || 0, pending_leaves: pending, payroll: pay.total || 0 });
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const quickLinks = [
    { label: "HRMS", href: "/hrms", icon: "👥", desc: "Manage employees" },
    { label: "Attendance", href: "/attendance", icon: "⏰", desc: "View all attendance" },
    { label: "Leaves", href: "/leaves", icon: "🌴", desc: "Approve/reject leaves" },
    { label: "Payroll", href: "/payroll", icon: "💰", desc: "Generate salaries" },
    { label: "Tasks", href: "/tasks", icon: "✅", desc: "Assign & track tasks" },
    { label: "Reports", href: "/reports", icon: "📋", desc: "View reports" },
  ];

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">ERP Workspace</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome, {user?.full_name || "Manager"} — {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Employees", value: stats.users, color: "text-blue-600", bg: "bg-blue-50", icon: "👥" },
                { label: "Present Today", value: stats.present, color: "text-green-600", bg: "bg-green-50", icon: "✅" },
                { label: "Pending Leaves", value: stats.pending_leaves, color: "text-yellow-600", bg: "bg-yellow-50", icon: "⏳" },
                { label: "Payroll Records", value: stats.payroll, color: "text-purple-600", bg: "bg-purple-50", icon: "💰" },
              ].map(c => (
                <div key={c.label} className={`${c.bg} rounded-xl p-5 border`}>
                  <div className="text-2xl mb-2">{c.icon}</div>
                  <div className={`text-3xl font-bold ${c.color}`}>{c.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{c.label}</div>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {quickLinks.map(q => (
                <Link key={q.href} href={q.href} className="bg-white rounded-xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all no-underline">
                  <div className="text-2xl mb-3">{q.icon}</div>
                  <div className="font-semibold text-slate-800 text-sm">{q.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{q.desc}</div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}