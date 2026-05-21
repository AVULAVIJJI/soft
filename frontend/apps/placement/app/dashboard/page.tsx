"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users, Building2, Target, TrendingUp, Award, Bell, LogOut,
  Briefcase, CheckCircle, Clock, MapPin, Star
} from "lucide-react";

interface PlacementStats {
  total_students: number;
  placed_students: number;
  active_drives: number;
  partner_companies: number;
  avg_package: number;
  highest_package: number;
}

export default function PlacementDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [stats, setStats] = useState<PlacementStats>({
    total_students: 284,
    placed_students: 219,
    active_drives: 8,
    partner_companies: 45,
    avg_package: 480000,
    highest_package: 1800000,
  });

  const upcomingDrives = [
    { id: 1, company: "TCS Digital", date: "2026-05-15", role: "Software Engineer", package: "7-12 LPA", slots: 20, location: "Hyderabad" },
    { id: 2, company: "Infosys", date: "2026-05-18", role: "System Engineer", package: "4-6 INR", slots: 35, location: "Bangalore" },
    { id: 3, company: "Wipro", date: "2026-05-22", role: "Project Engineer", package: "5-8 LPA", slots: 15, location: "Hyderabad" },
  ];

  const recentPlacements = [
    { name: "Ravi Kumar", company: "Amazon", role: "SDE-1", package: "18 INR", batch: "2025" },
    { name: "Priya Reddy", company: "Microsoft", role: "Software Engineer", package: "24 INR", batch: "2025" },
    { name: "Arun Sharma", company: "Deloitte", role: "Analyst", package: "8 INR", batch: "2025" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.replace("/login"); return; }
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, [router]);

  const placementRate = Math.round((stats.placed_students / stats.total_students) * 100);

  const statCards = [
    { label: "Total Students", value: stats.total_students, icon: Users, color: "orange" },
    { label: "Placed Students", value: stats.placed_students, icon: CheckCircle, color: "green" },
    { label: "Active Drives", value: stats.active_drives, icon: Target, color: "blue" },
    { label: "Partner Companies", value: stats.partner_companies, icon: Building2, color: "purple" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Placement Portal</p>
            <p className="text-xs text-gray-500">Softmaster Technology Solutions</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-500"><Bell className="w-5 h-5" /></button>
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-bold text-sm">
            {user?.name?.[0]?.toUpperCase() || "P"}
          </div>
          <button onClick={() => { localStorage.clear(); router.replace("/login"); }} className="text-gray-400 hover:text-red-500">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Placement Rate Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold">Placement Dashboard</h1>
              <p className="text-orange-100 mt-1">Batch 2025-26 Placement Season</p>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold">{placementRate}%</p>
                <p className="text-orange-100 text-sm">Placement Rate</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold">₹{(stats.avg_package / 100000).toFixed(1)}L</p>
                <p className="text-orange-100 text-sm">Avg Package</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold">₹{(stats.highest_package / 100000).toFixed(0)}L</p>
                <p className="text-orange-100 text-sm">Highest Package</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 bg-${color}-100 rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${color}-500`} />
                </div>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Drives */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Upcoming Campus Drives</h2>
              <button className="text-sm text-orange-600 hover:underline">View all</button>
            </div>
            <div className="space-y-4">
              {upcomingDrives.map(drive => (
                <div key={drive.id} className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{drive.company}</p>
                      <p className="text-sm text-gray-600">{drive.role}</p>
                    </div>
                    <span className="badge-warning">{drive.slots} slots</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(drive.date).toLocaleDateString("en-IN")}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{drive.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{drive.package}</span>
                  </div>
                  <button className="mt-3 w-full py-1.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700">
                    Register Students
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Placements */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Recent Placements</h2>
              <button className="text-sm text-orange-600 hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {recentPlacements.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                  <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold text-sm">
                    {p.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.role} at {p.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-700 text-sm">{p.package}</p>
                    <p className="text-xs text-gray-400">Batch {p.batch}</p>
                  </div>
                  <Award className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-xl text-center">
              <p className="text-sm text-gray-600">219 students placed in top companies</p>
              <p className="text-xs text-gray-400 mt-0.5">TCS, Infosys, Wipro, Amazon, Microsoft & more</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
