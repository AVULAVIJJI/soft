"use client";
import { useState, useEffect } from "react";

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ leave_type: "casual", start_date: "", end_date: "", reason: "" });

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

  const applyLeave = async () => {
    if (!form.start_date || !form.end_date || !form.reason) return alert("Please fill all fields");
    if (form.end_date < form.start_date) return alert("End date must be after start date");
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/v1/attendance/leaves`, {
        method: "POST", headers, body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.detail || "Failed");
      alert(`Leave applied! ${d.total_days} day(s)`);
      setShowModal(false);
      setForm({ leave_type: "casual", start_date: "", end_date: "", reason: "" });
      fetchLeaves();
    } catch (e: any) { alert(e.message); } finally { setSaving(false); }
  };

  const statusColor = (s: string) => {
    const st = s.replace("LeaveStatus.", "");
    if (st === "approved") return { bg: "rgba(34,197,94,0.15)", color: "#4ade80" };
    if (st === "rejected") return { bg: "rgba(239,68,68,0.15)", color: "#f87171" };
    if (st === "cancelled") return { bg: "rgba(107,114,128,0.15)", color: "#9ca3af" };
    return { bg: "rgba(234,179,8,0.15)", color: "#facc15" };
  };

  if (loading) return <div style={{padding:40,textAlign:"center",color:"#94a3b8"}}>Loading...</div>;

  return (
    <div style={{maxWidth:1000,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div>
          <h1 style={{fontSize:24,fontWeight:700,color:"white",margin:0}}>Leave Management</h1>
          <p style={{color:"#94a3b8",fontSize:14,marginTop:4}}>Apply and track your leaves</p>
        </div>
        <button onClick={() => setShowModal(true)}
          style={{padding:"10px 20px",background:"#2563eb",color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>
          + Apply Leave
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:12,marginBottom:24}}>
        {[
          { label: "Total Applied", value: leaves.length, color: "#60a5fa" },
          { label: "Approved", value: leaves.filter(l => l.status?.includes("approved")).length, color: "#4ade80" },
          { label: "Pending", value: leaves.filter(l => l.status?.includes("pending")).length, color: "#facc15" },
          { label: "Rejected", value: leaves.filter(l => l.status?.includes("rejected")).length, color: "#f87171" },
        ].map(c => (
          <div key={c.label} style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:12,padding:16,textAlign:"center"}}>
            <div style={{fontSize:28,fontWeight:800,color:c.color}}>{c.value}</div>
            <div style={{fontSize:12,color:"#64748b",marginTop:4}}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Leave History */}
      <div style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:16,overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid #1a2740"}}>
          <h2 style={{fontSize:16,fontWeight:600,color:"white",margin:0}}>Leave History</h2>
        </div>
        {leaves.length === 0 ? (
          <div style={{padding:40,textAlign:"center",color:"#64748b"}}>No leave records. Click "Apply Leave" to submit one.</div>
        ) : (
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{borderBottom:"1px solid #1a2740"}}>
                {["Type","From","To","Days","Reason","Status"].map(h => (
                  <th key={h} style={{padding:"12px 20px",textAlign:"left",fontSize:11,fontWeight:600,color:"#64748b",textTransform:"uppercase"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaves.map((l: any) => {
                const sc = statusColor(l.status || "pending");
                return (
                  <tr key={l.id} style={{borderBottom:"1px solid #0f1d32"}}>
                    <td style={{padding:"12px 20px",color:"white",fontSize:14,fontWeight:600,textTransform:"capitalize"}}>
                      {(l.leave_type || "").replace("LeaveType.","").replace("_"," ")}
                    </td>
                    <td style={{padding:"12px 20px",color:"#94a3b8",fontSize:14}}>
                      {new Date(l.start_date).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}
                    </td>
                    <td style={{padding:"12px 20px",color:"#94a3b8",fontSize:14}}>
                      {new Date(l.end_date).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}
                    </td>
                    <td style={{padding:"12px 20px",color:"white",fontSize:14,fontWeight:600}}>{l.total_days || "-"}</td>
                    <td style={{padding:"12px 20px",color:"#94a3b8",fontSize:13}}>{l.reason || "-"}</td>
                    <td style={{padding:"12px 20px"}}>
                      <span style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,background:sc.bg,color:sc.color,textTransform:"capitalize"}}>
                        {(l.status || "pending").replace("LeaveStatus.","")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Apply Leave Modal */}
      {showModal && (
        <div onClick={()=>setShowModal(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#1e293b",borderRadius:16,padding:32,width:440,maxWidth:"90%",border:"1px solid #334155"}}>
            <h2 style={{fontSize:18,fontWeight:700,color:"white",marginBottom:20}}>Apply Leave</h2>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <label style={{display:"block",fontSize:12,color:"#94a3b8",marginBottom:4,fontWeight:600}}>Leave Type</label>
                <select value={form.leave_type} onChange={e=>setForm({...form,leave_type:e.target.value})}
                  style={{width:"100%",padding:"10px 14px",border:"1px solid #334155",borderRadius:8,fontSize:14,color:"white",background:"#0f172a",outline:"none",boxSizing:"border-box"}}>
                  {["casual","sick","annual","maternity","paternity","unpaid"].map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)} Leave</option>
                  ))}
                </select>
              </div>
              <div style={{display:"flex",gap:12}}>
                <div style={{flex:1}}>
                  <label style={{display:"block",fontSize:12,color:"#94a3b8",marginBottom:4,fontWeight:600}}>From Date</label>
                  <input type="date" value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})}
                    style={{width:"100%",padding:"10px 14px",border:"1px solid #334155",borderRadius:8,fontSize:14,color:"white",background:"#0f172a",outline:"none",boxSizing:"border-box"}} />
                </div>
                <div style={{flex:1}}>
                  <label style={{display:"block",fontSize:12,color:"#94a3b8",marginBottom:4,fontWeight:600}}>To Date</label>
                  <input type="date" value={form.end_date} onChange={e=>setForm({...form,end_date:e.target.value})}
                    style={{width:"100%",padding:"10px 14px",border:"1px solid #334155",borderRadius:8,fontSize:14,color:"white",background:"#0f172a",outline:"none",boxSizing:"border-box"}} />
                </div>
              </div>
              <div>
                <label style={{display:"block",fontSize:12,color:"#94a3b8",marginBottom:4,fontWeight:600}}>Reason</label>
                <textarea value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} rows={3}
                  style={{width:"100%",padding:"10px 14px",border:"1px solid #334155",borderRadius:8,fontSize:14,color:"white",background:"#0f172a",outline:"none",boxSizing:"border-box",resize:"vertical"}} />
              </div>
            </div>
            <div style={{display:"flex",gap:12,marginTop:24,justifyContent:"flex-end"}}>
              <button onClick={()=>setShowModal(false)} style={{padding:"10px 20px",border:"1px solid #334155",borderRadius:8,fontSize:14,cursor:"pointer",color:"#94a3b8",background:"transparent"}}>Cancel</button>
              <button onClick={applyLeave} disabled={saving} style={{padding:"10px 20px",background:"#2563eb",color:"white",border:"none",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer"}}>
                {saving ? "Submitting..." : "Submit Leave"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}