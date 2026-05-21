"use client";
import { useState, useEffect } from "react";

export default function WorkspaceLeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : "";
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => { fetchLeaves(); }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/attendance/leaves`, { headers });
      if (res.ok) { const d = await res.json(); setLeaves(d.leaves || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const updateStatus = async (leaveId: number, status: string) => {
    try {
      const res = await fetch(`${API}/api/v1/attendance/leaves/${leaveId}/update`, {
        method: "POST", headers, body: JSON.stringify({ status }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.detail || "Failed");
      alert(`Leave ${status}!`);
      fetchLeaves();
    } catch (e: any) { alert(e.message); }
  };

  const filtered = filter === "all" ? leaves : leaves.filter(l => l.status === filter);
  const pending = leaves.filter(l => l.status === "pending").length;
  const approved = leaves.filter(l => l.status === "approved").length;
  const rejected = leaves.filter(l => l.status === "rejected").length;

  if (loading) return <div style={{padding:40,textAlign:"center",color:"#94a3b8"}}>Loading...</div>;

  return (
    <div style={{maxWidth:1200,margin:"0 auto"}}>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:24,fontWeight:700,color:"white",margin:0}}>Leave Management</h1>
        <p style={{color:"#94a3b8",fontSize:14,marginTop:4}}>Approve or reject employee leave requests</p>
      </div>

      {/* Summary */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:24}}>
        {[
          { label: "Total Requests", value: leaves.length, color: "#60a5fa", icon: "📋" },
          { label: "Pending", value: pending, color: "#facc15", icon: "⏳" },
          { label: "Approved", value: approved, color: "#4ade80", icon: "✅" },
          { label: "Rejected", value: rejected, color: "#f87171", icon: "❌" },
        ].map(c => (
          <div key={c.label} style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:12,padding:16,textAlign:"center"}}>
            <div style={{fontSize:20,marginBottom:4}}>{c.icon}</div>
            <div style={{fontSize:28,fontWeight:800,color:c.color}}>{c.value}</div>
            <div style={{fontSize:11,color:"#64748b",marginTop:4}}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {["all","pending","approved","rejected"].map(f => (
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:"8px 16px",borderRadius:8,border:"none",fontSize:13,fontWeight:600,cursor:"pointer",textTransform:"capitalize",
            background:filter===f?"#2563eb":"#1e293b",color:filter===f?"white":"#94a3b8"
          }}>{f === "all" ? "All" : f}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:16,overflow:"hidden"}}>
        {filtered.length === 0 ? (
          <div style={{padding:40,textAlign:"center",color:"#64748b"}}>No leave requests found</div>
        ) : (
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{borderBottom:"1px solid #1a2740"}}>
                {["Employee","Type","From","To","Days","Reason","Status","Actions"].map(h => (
                  <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:600,color:"#64748b",textTransform:"uppercase"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => {
                const isPending = l.status === "pending";
                return (
                  <tr key={l.id} style={{borderBottom:"1px solid #0f1d32"}}>
                    <td style={{padding:"12px 16px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:12,fontWeight:700}}>
                          {(l.employee_name||"?").charAt(0)}
                        </div>
                        <div>
                          <div style={{fontWeight:600,color:"white",fontSize:13}}>{l.employee_name}</div>
                          <div style={{fontSize:11,color:"#64748b"}}>ID: {l.employee_id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{padding:"12px 16px",color:"white",fontSize:13,textTransform:"capitalize"}}>{(l.leave_type||"").replace("_"," ")}</td>
                    <td style={{padding:"12px 16px",color:"#94a3b8",fontSize:13}}>
                      {new Date(l.start_date).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}
                    </td>
                    <td style={{padding:"12px 16px",color:"#94a3b8",fontSize:13}}>
                      {new Date(l.end_date).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}
                    </td>
                    <td style={{padding:"12px 16px",color:"white",fontSize:13,fontWeight:600}}>{l.total_days}</td>
                    <td style={{padding:"12px 16px",color:"#94a3b8",fontSize:12,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.reason || "-"}</td>
                    <td style={{padding:"12px 16px"}}>
                      <span style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,textTransform:"capitalize",
                        background:l.status==="approved"?"rgba(34,197,94,0.15)":l.status==="rejected"?"rgba(239,68,68,0.15)":"rgba(234,179,8,0.15)",
                        color:l.status==="approved"?"#4ade80":l.status==="rejected"?"#f87171":"#facc15"
                      }}>{l.status}</span>
                    </td>
                    <td style={{padding:"12px 16px"}}>
                      {isPending ? (
                        <div style={{display:"flex",gap:6}}>
                          <button onClick={()=>updateStatus(l.id,"approved")}
                            style={{padding:"5px 12px",background:"rgba(34,197,94,0.15)",color:"#4ade80",border:"1px solid rgba(34,197,94,0.3)",borderRadius:6,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                            Approve
                          </button>
                          <button onClick={()=>updateStatus(l.id,"rejected")}
                            style={{padding:"5px 12px",background:"rgba(239,68,68,0.15)",color:"#f87171",border:"1px solid rgba(239,68,68,0.3)",borderRadius:6,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{color:"#64748b",fontSize:12}}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}