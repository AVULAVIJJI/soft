"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EmployeeShell from "../../components/EmployeeShell";

export default function EmployeeDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [today, setToday] = useState<any>(null);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [payroll, setPayroll] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : "";
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [todayRes, leavesRes, payrollRes] = await Promise.all([
        fetch(`${API}/api/v1/attendance/today-summary`, { headers }),
        fetch(`${API}/api/v1/attendance/leaves`, { headers }),
        fetch(`${API}/api/v1/payroll/?limit=3`, { headers }),
      ]);
      if (todayRes.ok) setToday(await todayRes.json());
      if (leavesRes.ok) { const d = await leavesRes.json(); setLeaves(d.leaves || []); }
      if (payrollRes.ok) { const d = await payrollRes.json(); setPayroll(d.records || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleCheckIn = async () => {
    try {
      const res = await fetch(`${API}/api/v1/attendance/check-in`, { method: "POST", headers });
      const d = await res.json();
      if (!res.ok) throw new Error(d.detail || "Failed");
      alert("Check-in successful!");
      fetchAll();
    } catch (e: any) { alert(e.message); }
  };

  const handleCheckOut = async () => {
    try {
      const res = await fetch(`${API}/api/v1/attendance/check-out`, { method: "POST", headers });
      const d = await res.json();
      if (!res.ok) throw new Error(d.detail || "Failed");
      alert(`Check-out successful! Hours: ${d.total_hours}`);
      fetchAll();
    } catch (e: any) { alert(e.message); }
  };

  const formatTime = (t: string | null) => {
    if (!t) return "--:--";
    try { return new Date(t).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }); } catch { return t; }
  };

  const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const pendingLeaves = leaves.filter(l => l.status?.includes("pending")).length;
  const approvedLeaves = leaves.filter(l => l.status?.includes("approved")).length;
  const latestPay = payroll.length > 0 ? payroll[0] : null;

  if (loading) return <EmployeeShell><div style={{padding:40,textAlign:"center",color:"#94a3b8"}}>Loading dashboard...</div></EmployeeShell>;

  return (
    <EmployeeShell>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div style={{marginBottom:24}}>
          <h1 style={{fontSize:26,fontWeight:700,color:"white",margin:0}}>Welcome, {user?.full_name || "Employee"} 👋</h1>
          <p style={{color:"#94a3b8",fontSize:14,marginTop:4}}>
            {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}
          </p>
        </div>

        <div style={{background:"linear-gradient(135deg,#0d1730,#1e293b)",border:"1px solid #1a2740",borderRadius:16,padding:24,marginBottom:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
            <div>
              <div style={{color:"#64748b",fontSize:13,marginBottom:4}}>Today&apos;s Attendance</div>
              <div style={{display:"flex",gap:24,alignItems:"center"}}>
                <div>
                  <span style={{color:"#94a3b8",fontSize:12}}>In: </span>
                  <span style={{color:"white",fontSize:18,fontWeight:700}}>{formatTime(today?.check_in)}</span>
                </div>
                <div>
                  <span style={{color:"#94a3b8",fontSize:12}}>Out: </span>
                  <span style={{color:"white",fontSize:18,fontWeight:700}}>{formatTime(today?.check_out)}</span>
                </div>
                {today?.total_hours && (
                  <div>
                    <span style={{color:"#94a3b8",fontSize:12}}>Hours: </span>
                    <span style={{color:"#4ade80",fontSize:18,fontWeight:700}}>{today.total_hours}h</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              {!today?.checked_in ? (
                <button onClick={handleCheckIn} style={{padding:"12px 28px",background:"#16a34a",color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer"}}>
                  ☀️ Check In
                </button>
              ) : !today?.checked_out ? (
                <button onClick={handleCheckOut} style={{padding:"12px 28px",background:"#dc2626",color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer"}}>
                  🌙 Check Out
                </button>
              ) : (
                <span style={{padding:"12px 28px",background:"rgba(34,197,94,0.15)",color:"#4ade80",borderRadius:10,fontSize:14,fontWeight:700}}>✅ Completed</span>
              )}
            </div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16,marginBottom:24}}>
          {[
            { label: "Pending Leaves", value: pendingLeaves, icon: "⏳", color: "#facc15", link: "/leaves" },
            { label: "Approved Leaves", value: approvedLeaves, icon: "✅", color: "#4ade80", link: "/leaves" },
            { label: "Total Leaves", value: leaves.length, icon: "🌴", color: "#60a5fa", link: "/leaves" },
            { label: "Last Salary", value: latestPay ? `₹${(latestPay.net_salary||0).toLocaleString("en-IN")}` : "N/A", icon: "💰", color: "#a78bfa", link: "/payslips" },
          ].map(c => (
            <Link key={c.label} href={c.link} style={{textDecoration:"none"}}>
              <div style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:14,padding:20,cursor:"pointer"}}
                onMouseEnter={e=>(e.currentTarget.style.borderColor="#334155")} onMouseLeave={e=>(e.currentTarget.style.borderColor="#1a2740")}>
                <div style={{fontSize:24,marginBottom:8}}>{c.icon}</div>
                <div style={{fontSize:22,fontWeight:800,color:c.color}}>{c.value}</div>
                <div style={{fontSize:12,color:"#64748b",marginTop:4}}>{c.label}</div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:16,padding:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h3 style={{fontSize:15,fontWeight:600,color:"white",margin:0}}>Recent Leaves</h3>
              <Link href="/leaves" style={{color:"#60a5fa",fontSize:12,textDecoration:"none"}}>View All →</Link>
            </div>
            {leaves.length === 0 ? (
              <div style={{color:"#64748b",fontSize:13,padding:16,textAlign:"center"}}>No leave records</div>
            ) : (
              leaves.slice(0,3).map(l => (
                <div key={l.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1a2740",fontSize:13}}>
                  <span style={{color:"white",textTransform:"capitalize"}}>{(l.leave_type||"").replace("LeaveType.","")}</span>
                  <span style={{color:l.status?.includes("approved")?"#4ade80":l.status?.includes("rejected")?"#f87171":"#facc15",fontSize:12,fontWeight:600,textTransform:"capitalize"}}>
                    {(l.status||"").replace("LeaveStatus.","")}
                  </span>
                </div>
              ))
            )}
          </div>

          <div style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:16,padding:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h3 style={{fontSize:15,fontWeight:600,color:"white",margin:0}}>Recent Payslips</h3>
              <Link href="/payslips" style={{color:"#60a5fa",fontSize:12,textDecoration:"none"}}>View All →</Link>
            </div>
            {payroll.length === 0 ? (
              <div style={{color:"#64748b",fontSize:13,padding:16,textAlign:"center"}}>No payslips yet</div>
            ) : (
              payroll.slice(0,3).map(p => (
                <div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1a2740",fontSize:13}}>
                  <span style={{color:"white"}}>{months[p.month]} {p.year}</span>
                  <span style={{color:"#4ade80",fontWeight:600}}>₹{(p.net_salary||0).toLocaleString("en-IN")}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </EmployeeShell>
  );
}