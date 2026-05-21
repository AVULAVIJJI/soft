"use client";

import { useEffect, useState } from "react";
import {
  Users, BookOpen, Briefcase, DollarSign, TrendingUp,
  Activity, AlertCircle, CheckCircle
} from "lucide-react";

interface AdminStats {
  total_users: number;
  total_students: number;
  total_courses: number;
  active_jobs: number;
  total_revenue: number;
  monthly_revenue: number;
  total_placements: number;
  active_projects: number;
  open_tickets: number;
  pending_applications: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${API}/api/v1/analytics/admin-dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setStats(await res.json());
      } catch {
        // Use empty state
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Users", value: stats?.total_users || 0, icon: Users, color: "blue", change: "+12%" },
    { label: "Total Students", value: stats?.total_students || 0, icon: BookOpen, color: "purple", change: "+8%" },
    { label: "Active Jobs", value: stats?.active_jobs || 0, icon: Briefcase, color: "green", change: "+5%" },
    { label: "Monthly Revenue", value: `INR ${(stats?.monthly_revenue || 0).toLocaleString("en-IN")}`, icon: DollarSign, color: "yellow", change: "+15%" },
    { label: "Total Placements", value: stats?.total_placements || 0, icon: TrendingUp, color: "cyan", change: "+20%" },
    { label: "Active Projects", value: stats?.active_projects || 0, icon: Activity, color: "indigo", change: "+3%" },
    { label: "Open Tickets", value: stats?.open_tickets || 0, icon: AlertCircle, color: "red", change: "-5%" },
    { label: "Pending Applications", value: stats?.pending_applications || 0, icon: CheckCircle, color: "orange", change: "+10%" },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    green: "bg-green-50 text-green-600 border-green-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-200",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
    red: "bg-red-50 text-red-600 border-red-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Softmaster Technology Solutions Pvt Ltd - Platform Overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            {loading ? (
              <div className="animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-lg mb-3" />
                <div className="h-6 bg-gray-200 rounded mb-2 w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ) : (
              <>
                <div className={`inline-flex p-2 rounded-lg border ${colorMap[card.color]} mb-3`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-500">{card.label}</span>
                  <span className={`text-xs font-medium ${card.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>{card.change}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Manage Users", href: "/users" },
              { label: "View Enrollments", href: "/enrollments" },
              { label: "Notifications", href: "/notifications" },
              { label: "Revenue", href: "/revenue" },
              { label: "View Audit Logs", href: "/audit-logs" },
            ].map((action) => (
              <a key={action.label} href={action.href} className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">{action.label}</a>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <p className="text-xs text-yellow-800">5 support tickets pending review</p>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <p className="text-xs text-blue-800">3 new job applications received</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Info</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>CIN:</strong> U78100TS2024PTC191444</p>
            <p><strong>Address:</strong> 12-18, Indira Nagar Colony, Peerzadiguda, Hyderabad, Telangana - 500039</p>
            <p><strong>State:</strong> Telangana</p>
            <p><strong>Incorporated:</strong> November 27, 2024</p>
            <p><strong>Directors:</strong> Sravani Bikkasani, Chittiboina Omkar</p>
          </div>
        </div>
      </div>
    </div>
  );
}