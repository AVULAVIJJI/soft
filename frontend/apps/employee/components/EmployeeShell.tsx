"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", icon: "🏠", label: "Dashboard" },
  { href: "/attendance", icon: "⏰", label: "Attendance" },
  { href: "/leaves", icon: "🌴", label: "Leaves" },
  { href: "/payslips", icon: "💰", label: "Payslips" },
  { href: "/tasks", icon: "✅", label: "Tasks" },
  { href: "/announcements", icon: "📢", label: "Announcements" },
  { href: "/profile", icon: "👤", label: "Profile" },
];

export default function EmployeeShell({ children }: { children: React.ReactNode }) {
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
    <div style={{ minHeight: "100vh", display: "flex", background: "#030712", color: "#fff" }}>
      <aside style={{ width: 260, background: "#0d1730", borderRight: "1px solid #1a2740", display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 50 }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #1a2740" }}>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 2 }}>SOFTMASTER</div>
          <div style={{ color: "#6b7fa3", fontSize: 11, marginTop: 2 }}>Employee Portal</div>
        </div>
        <nav style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
          {navItems.map(({ href, icon, label }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link key={href} href={href} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 10,
                marginBottom: 2, textDecoration: "none", fontSize: 14, fontWeight: active ? 600 : 400,
                background: active ? "rgba(0,102,255,0.15)" : "transparent",
                color: active ? "#60a5fa" : "#9ca3af",
              }}>
                <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{icon}</span> {label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid #1a2740" }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.full_name || "Employee"}</div>
          <div style={{ fontSize: 11, color: "#6b7fa3", marginBottom: 12 }}>{user?.email}</div>
          <button onClick={logout} style={{
            width: "100%", padding: "8px", background: "rgba(239,68,68,0.1)", color: "#f87171",
            border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, cursor: "pointer", fontSize: 13
          }}>Sign Out</button>
        </div>
      </aside>
      <div style={{ flex: 1, marginLeft: 260 }}>
        <main style={{ padding: "2rem", maxWidth: 1400 }}>{children}</main>
      </div>
    </div>
  );
}