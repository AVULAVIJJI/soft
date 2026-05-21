"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/hrms", icon: "👥", label: "HRMS" },
  { href: "/attendance", icon: "⏰", label: "Attendance" },
  { href: "/leaves", icon: "🌴", label: "Leaves" },
  { href: "/payroll", icon: "💰", label: "Payroll" },
  { href: "/tasks", icon: "✅", label: "Tasks" },
  { href: "/finance", icon: "💳", label: "Finance" },
  { href: "/reports", icon: "📋", label: "Reports" },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.replace("/login"); return; }
    try { const u = localStorage.getItem("user"); if (u) setUser(JSON.parse(u)); } catch {}
  }, [router]);

  const logout = () => { localStorage.clear(); router.replace("/login"); };

  return (
    <div className="min-h-screen flex bg-gray-950 text-white">
      <aside className="w-[260px] bg-[#0a0f1e] border-r border-[#1a2740] flex flex-col fixed top-0 bottom-0 left-0 z-50">
        <div className="p-5 border-b border-[#1a2740]">
          <div className="text-base font-extrabold tracking-[2px]">SOFTMASTER</div>
          <div className="text-[#6b7fa3] text-xs mt-0.5">ERP Workspace</div>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          {navItems.map(({ href, icon, label }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link key={href} href={href} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg mb-0.5 text-sm no-underline transition-colors ${
                active ? "bg-blue-600/15 text-blue-400 font-semibold" : "text-gray-400 hover:bg-white/5"
              }`}>
                <span className="text-base w-5 text-center">{icon}</span> {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#1a2740]">
          <div className="text-sm font-semibold">{user?.full_name || "Manager"}</div>
          <div className="text-xs text-[#6b7fa3] mb-3">{user?.email}</div>
          <button onClick={logout} className="w-full py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg cursor-pointer text-sm hover:bg-red-500/20 transition-colors">
            Sign Out
          </button>
        </div>
      </aside>
      <div className="flex-1 ml-[260px]">
        <main className="p-8 max-w-[1400px]">{children}</main>
      </div>
    </div>
  );
}
