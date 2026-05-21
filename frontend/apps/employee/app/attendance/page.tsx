"use client";
import { useState, useEffect } from "react";

export default function AttendancePage() {
  const [todaySummary, setTodaySummary] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : "";
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [summaryRes, recordsRes] = await Promise.all([
        fetch(`${API}/api/v1/attendance/today-summary`, { headers }),
        fetch(`${API}/api/v1/attendance/?limit=30`, { headers }),
      ]);
      if (summaryRes.ok) setTodaySummary(await summaryRes.json());
      if (recordsRes.ok) { const d = await recordsRes.json(); setRecords(d.records || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/attendance/check-in`, { method: "POST", headers });
      const d = await res.json();
      if (!res.ok) throw new Error(d.detail || "Failed");
      alert("Check-in successful!");
      fetchData();
    } catch (e: any) { alert(e.message); } finally { setActionLoading(false); }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/attendance/check-out`, { method: "POST", headers });
      const d = await res.json();
      if (!res.ok) throw new Error(d.detail || "Failed");
      alert(`Check-out successful! Total hours: ${d.total_hours}`);
      fetchData();
    } catch (e: any) { alert(e.message); } finally { setActionLoading(false); }
  };

  const formatTime = (t: string | null) => {
    if (!t) return "-";
    try { return new Date(t).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }); } catch { return t; }
  };

  if (loading) return <div style={{padding:40,textAlign:"center",color:"#94a3b8"}}>Loading...</div>;

  return (
    <div style={{maxWidth:1000,margin:"0 auto"}}>
      <h1 style={{fontSize:24,fontWeight:700,color:"white",marginBottom:24}}>My Attendance</h1>

      {/* Today's Status */}
      <div style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:16,padding:24,marginBottom:24}}>
        <h2 style={{fontSize:16,fontWeight:600,color:"#94a3b8",marginBottom:16}}>Today — {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}</h2>
        <div style={{display:"flex",gap:16,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{flex:1,minWidth:150,background:"#1e293b",borderRadius:12,padding:16,textAlign:"center"}}>
            <div style={{color:"#64748b",fontSize:12,marginBottom:4}}>Check In</div>
            <div style={{color:"white",fontSize:20,fontWeight:700}}>{formatTime(todaySummary?.check_in)}</div>
          </div>
          <div style={{flex:1,minWidth:150,background:"#1e293b",borderRadius:12,padding:16,textAlign:"center"}}>
            <div style={{color:"#64748b",fontSize:12,marginBottom:4}}>Check Out</div>
            <div style={{color:"white",fontSize:20,fontWeight:700}}>{formatTime(todaySummary?.check_out)}</div>
          </div>
          <div style={{flex:1,minWidth:150,background:"#1e293b",borderRadius:12,padding:16,textAlign:"center"}}>
            <div style={{color:"#64748b",fontSize:12,marginBottom:4}}>Total Hours</div>
            <div style={{color:"white",fontSize:20,fontWeight:700}}>{todaySummary?.total_hours ? `${todaySummary.total_hours}h` : "-"}</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {!todaySummary?.checked_in ? (
              <button onClick={handleCheckIn} disabled={actionLoading}
                style={{padding:"12px 24px",background:"#16a34a",color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>
                {actionLoading ? "..." : "☀️ Check In"}
              </button>
            ) : !todaySummary?.checked_out ? (
              <button onClick={handleCheckOut} disabled={actionLoading}
                style={{padding:"12px 24px",background:"#dc2626",color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>
                {actionLoading ? "..." : "🌙 Check Out"}
              </button>
            ) : (
              <div style={{padding:"12px 24px",background:"rgba(34,197,94,0.15)",color:"#4ade80",borderRadius:10,fontSize:14,fontWeight:600}}>
                ✅ Day Complete
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History */}
      <div style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:16,overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid #1a2740"}}>
          <h2 style={{fontSize:16,fontWeight:600,color:"white",margin:0}}>Attendance History</h2>
        </div>
        {records.length === 0 ? (
          <div style={{padding:40,textAlign:"center",color:"#64748b"}}>No attendance records yet. Click Check In to start!</div>
        ) : (
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{borderBottom:"1px solid #1a2740"}}>
                {["Date","Check In","Check Out","Hours","Status"].map(h => (
                  <th key={h} style={{padding:"12px 20px",textAlign:"left",fontSize:11,fontWeight:600,color:"#64748b",textTransform:"uppercase"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r: any) => (
                <tr key={r.id} style={{borderBottom:"1px solid #0f1d32"}}>
                  <td style={{padding:"12px 20px",color:"white",fontSize:14}}>
                    {new Date(r.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
                  </td>
                  <td style={{padding:"12px 20px",color:"#94a3b8",fontSize:14}}>{formatTime(r.check_in)}</td>
                  <td style={{padding:"12px 20px",color:"#94a3b8",fontSize:14}}>{formatTime(r.check_out)}</td>
                  <td style={{padding:"12px 20px",color:"#94a3b8",fontSize:14}}>{r.total_hours ? `${r.total_hours}h` : "-"}</td>
                  <td style={{padding:"12px 20px"}}>
                    <span style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,
                      background: r.status==="present"?"rgba(34,197,94,0.15)":r.status==="late"?"rgba(234,179,8,0.15)":r.status==="absent"?"rgba(239,68,68,0.15)":"rgba(59,130,246,0.15)",
                      color: r.status==="present"?"#4ade80":r.status==="late"?"#facc15":r.status==="absent"?"#f87171":"#60a5fa"
                    }}>{(r.status || "present").replace("AttendanceStatus.","")}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}