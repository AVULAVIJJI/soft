"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Briefcase, FileText, Bell, LogOut, CheckCircle, Clock, XCircle, Upload } from "lucide-react";

export default function JobsDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);

  const applications = [
    { id: 1, company: "Softmaster Technology Solutions", role: "Full Stack Developer", applied: "2026-05-01", status: "Interview Scheduled", interview_date: "2026-05-10" },
    { id: 2, company: "Analytics Hub", role: "Data Analyst", applied: "2026-05-03", status: "Under Review", interview_date: null },
    { id: 3, company: "Creative Studio", role: "UI/UX Designer", applied: "2026-04-25", status: "Rejected", interview_date: null },
  ];

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.replace("/login"); return; }
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, [router]);

  const statusIcon = (status: string) => {
    if (status.includes("Scheduled")) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === "Rejected") return <XCircle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const statusBadge = (status: string) => {
    if (status.includes("Scheduled")) return "badge-success";
    if (status === "Rejected") return "badge-error";
    return "badge-warning";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Briefcase className="w-6 h-6 text-green-600" />
          <p className="font-bold text-gray-900">Softmaster Jobs</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/browse" className="btn-primary text-sm">Browse Jobs</Link>
          <button onClick={() => { localStorage.clear(); router.replace("/login"); }} className="text-gray-400">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h1>

        <div className="grid grid-cols-3 gap-5 mb-8">
          <div className="card text-center">
            <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Applied</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-green-600">1</p>
            <p className="text-sm text-gray-500 mt-1">Interviews</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-yellow-500">1</p>
            <p className="text-sm text-gray-500 mt-1">Under Review</p>
          </div>
        </div>

        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Application History</h2>
            <div className="flex items-center gap-2 text-sm text-green-600 cursor-pointer hover:underline">
              <Upload className="w-4 h-4" /> Update Resume
            </div>
          </div>
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                {statusIcon(app.status)}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{app.role}</p>
                  <p className="text-sm text-gray-500">{app.company}</p>
                  {app.interview_date && (
                    <p className="text-xs text-green-600 mt-0.5">Interview: {new Date(app.interview_date).toLocaleDateString("en-IN")}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className={statusBadge(app.status)}>{app.status}</span>
                  <p className="text-xs text-gray-400 mt-1">Applied {new Date(app.applied).toLocaleDateString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Recommended Jobs</h2>
          <div className="text-center py-6 text-gray-400">
            <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Complete your profile to get personalized recommendations</p>
            <Link href="/profile" className="text-green-600 text-sm hover:underline mt-2 inline-block">Complete Profile</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
