"use client";
import { useState, useEffect } from "react";

export default function HRMSPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : "";
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => { fetchEmployees(); }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/users/?limit=100`, { headers });
      if (res.ok) { const d = await res.json(); setEmployees(d.users || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  if (loading) return <div style={{padding:40,textAlign:"center",color:"#94a3b8"}}>Loading employees...</div>;

  return (
    <div style={{maxWidth:1200,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div>
          <h1 style={{fontSize:24,fontWeight:700,color:"white",margin:0}}>HRMS — Employee Directory</h1>
          <p style={{color:"#94a3b8",fontSize:14,marginTop:4}}>{employees.length} employees</p>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12,marginBottom:24}}>
        {[
          { label: "Total", value: employees.length, color: "#60a5fa" },
          { label: "Active", value: employees.filter(e => e.is_active).length, color: "#4ade80" },
          { label: "Employees", value: employees.filter(e => e.role?.includes("employee")).length, color: "#facc15" },
          { label: "HR", value: employees.filter(e => e.role?.includes("hr")).length, color: "#a78bfa" },
          { label: "Trainers", value: employees.filter(e => e.role?.includes("trainer")).length, color: "#f97316" },
        ].map(c => (
          <div key={c.label} style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:12,padding:16,textAlign:"center"}}>
            <div style={{fontSize:24,fontWeight:800,color:c.color}}>{c.value}</div>
            <div style={{fontSize:11,color:"#64748b",marginTop:4}}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:16,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{borderBottom:"1px solid #1a2740"}}>
              {["Employee","Role","Status","Joined","Actions"].map(h => (
                <th key={h} style={{padding:"12px 20px",textAlign:"left",fontSize:11,fontWeight:600,color:"#64748b",textTransform:"uppercase"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map(e => (
              <tr key={e.id} style={{borderBottom:"1px solid #0f1d32"}}>
                <td style={{padding:"12px 20px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:13,fontWeight:700}}>
                      {(e.full_name||"?").charAt(0)}
                    </div>
                    <div>
                      <div style={{fontWeight:600,color:"white",fontSize:14}}>{e.full_name}</div>
                      <div style={{fontSize:12,color:"#64748b"}}>{e.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{padding:"12px 20px"}}>
                  <span style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,background:"rgba(59,130,246,0.15)",color:"#60a5fa",textTransform:"capitalize"}}>
                    {String(e.role||"").replace("UserRole.","").replace("_"," ")}
                  </span>
                </td>
                <td style={{padding:"12px 20px"}}>
                  <span style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,
                    background:e.is_active?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.15)",
                    color:e.is_active?"#4ade80":"#f87171"
                  }}>{e.is_active?"Active":"Inactive"}</span>
                </td>
                <td style={{padding:"12px 20px",fontSize:12,color:"#64748b"}}>
                  {e.created_at ? new Date(e.created_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "-"}
                </td>
                <td style={{padding:"12px 20px"}}>
                  <button style={{fontSize:12,padding:"6px 12px",borderRadius:8,border:"1px solid #334155",background:"transparent",color:"#60a5fa",cursor:"pointer"}}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}