"use client";
import { useState, useEffect } from "react";

export default function PayrollPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ employee_id: "", month: new Date().getMonth() + 1, year: new Date().getFullYear(), basic_salary: 30000, allowances: 5000, deductions: 2000, bonus: 0 });

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : "";
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [payRes, empRes] = await Promise.all([
        fetch(`${API}/api/v1/payroll/?limit=100`, { headers }),
        fetch(`${API}/api/v1/users/?limit=100`, { headers }),
      ]);
      if (payRes.ok) { const d = await payRes.json(); setRecords(d.records || []); }
      if (empRes.ok) { const d = await empRes.json(); setEmployees(d.users || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const generatePayroll = async () => {
    if (!form.employee_id) return alert("Select an employee");
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/v1/payroll/generate`, {
        method: "POST", headers, body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.detail || "Failed");
      alert(`Payroll generated! Net salary: ₹${d.net_salary?.toLocaleString("en-IN")}`);
      setShowModal(false);
      fetchData();
    } catch (e: any) { alert(e.message); } finally { setSaving(false); }
  };

  const markPaid = async (payrollId: number) => {
    try {
      const res = await fetch(`${API}/api/v1/payroll/${payrollId}/pay`, {
        method: "PUT", headers,
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.detail || "Failed");
      alert("Marked as paid!");
      fetchData();
    } catch (e: any) { alert(e.message); }
  };

  const fmt = (n: number) => `₹${(n || 0).toLocaleString("en-IN")}`;
  const totalPaid = records.filter(r => r.status === "paid").reduce((s, r) => s + (r.net_salary || 0), 0);
  const totalPending = records.filter(r => r.status !== "paid").reduce((s, r) => s + (r.net_salary || 0), 0);

  if (loading) return <div style={{padding:40,textAlign:"center",color:"#94a3b8"}}>Loading...</div>;

  return (
    <div style={{maxWidth:1200,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div>
          <h1 style={{fontSize:24,fontWeight:700,color:"white",margin:0}}>Payroll Management</h1>
          <p style={{color:"#94a3b8",fontSize:14,marginTop:4}}>Generate and manage employee salaries</p>
        </div>
        <button onClick={()=>setShowModal(true)} style={{padding:"10px 20px",background:"#2563eb",color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>
          + Generate Payroll
        </button>
      </div>

      {/* Summary */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12,marginBottom:24}}>
        {[
          { label: "Total Records", value: records.length, color: "#60a5fa", icon: "📋" },
          { label: "Total Paid", value: fmt(totalPaid), color: "#4ade80", icon: "✅" },
          { label: "Pending Payment", value: fmt(totalPending), color: "#facc15", icon: "⏳" },
          { label: "Employees", value: employees.length, color: "#a78bfa", icon: "👥" },
        ].map(c => (
          <div key={c.label} style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:12,padding:16,textAlign:"center"}}>
            <div style={{fontSize:20,marginBottom:4}}>{c.icon}</div>
            <div style={{fontSize:22,fontWeight:800,color:c.color}}>{c.value}</div>
            <div style={{fontSize:11,color:"#64748b",marginTop:4}}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:16,overflow:"hidden"}}>
        {records.length === 0 ? (
          <div style={{padding:40,textAlign:"center",color:"#64748b"}}>No payroll records. Click "Generate Payroll" to create one.</div>
        ) : (
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{borderBottom:"1px solid #1a2740"}}>
                {["Employee","Period","Basic","Allowances","Deductions","Net Salary","Status","Actions"].map(h => (
                  <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:600,color:"#64748b",textTransform:"uppercase"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map(r => {
                const emp = employees.find(e => e.id === r.employee_id);
                return (
                  <tr key={r.id} style={{borderBottom:"1px solid #0f1d32"}}>
                    <td style={{padding:"12px 16px"}}>
                      <div style={{fontWeight:600,color:"white",fontSize:13}}>{emp?.full_name || `EMP${r.employee_id}`}</div>
                      <div style={{fontSize:11,color:"#64748b"}}>{emp?.email || ""}</div>
                    </td>
                    <td style={{padding:"12px 16px",color:"white",fontSize:13}}>{months[r.month]} {r.year}</td>
                    <td style={{padding:"12px 16px",color:"#94a3b8",fontSize:13}}>{fmt(r.basic_salary)}</td>
                    <td style={{padding:"12px 16px",color:"#4ade80",fontSize:13}}>+{fmt(r.allowances)}</td>
                    <td style={{padding:"12px 16px",color:"#f87171",fontSize:13}}>-{fmt(r.deductions)}</td>
                    <td style={{padding:"12px 16px",color:"#4ade80",fontSize:15,fontWeight:700}}>{fmt(r.net_salary)}</td>
                    <td style={{padding:"12px 16px"}}>
                      <span style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,textTransform:"capitalize",
                        background:r.status==="paid"?"rgba(34,197,94,0.15)":"rgba(234,179,8,0.15)",
                        color:r.status==="paid"?"#4ade80":"#facc15"
                      }}>{r.status}</span>
                    </td>
                    <td style={{padding:"12px 16px"}}>
                      {r.status !== "paid" && (
                        <button onClick={()=>markPaid(r.id)} style={{padding:"5px 12px",background:"rgba(34,197,94,0.15)",color:"#4ade80",border:"1px solid rgba(34,197,94,0.3)",borderRadius:6,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Generate Payroll Modal */}
      {showModal && (
        <div onClick={()=>setShowModal(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#1e293b",borderRadius:16,padding:32,width:480,maxWidth:"90%",border:"1px solid #334155"}}>
            <h2 style={{fontSize:18,fontWeight:700,color:"white",marginBottom:20}}>Generate Payroll</h2>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <label style={{display:"block",fontSize:12,color:"#94a3b8",marginBottom:4,fontWeight:600}}>Employee</label>
                <select value={form.employee_id} onChange={e=>setForm({...form,employee_id:e.target.value})}
                  style={{width:"100%",padding:"10px 14px",border:"1px solid #334155",borderRadius:8,fontSize:14,color:"white",background:"#0f172a",outline:"none",boxSizing:"border-box"}}>
                  <option value="">Select Employee</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.full_name} ({e.email})</option>
                  ))}
                </select>
              </div>
              <div style={{display:"flex",gap:12}}>
                <div style={{flex:1}}>
                  <label style={{display:"block",fontSize:12,color:"#94a3b8",marginBottom:4,fontWeight:600}}>Month</label>
                  <select value={form.month} onChange={e=>setForm({...form,month:parseInt(e.target.value)})}
                    style={{width:"100%",padding:"10px 14px",border:"1px solid #334155",borderRadius:8,fontSize:14,color:"white",background:"#0f172a",outline:"none",boxSizing:"border-box"}}>
                    {months.slice(1).map((m,i) => <option key={i+1} value={i+1}>{m}</option>)}
                  </select>
                </div>
                <div style={{flex:1}}>
                  <label style={{display:"block",fontSize:12,color:"#94a3b8",marginBottom:4,fontWeight:600}}>Year</label>
                  <input type="number" value={form.year} onChange={e=>setForm({...form,year:parseInt(e.target.value)})}
                    style={{width:"100%",padding:"10px 14px",border:"1px solid #334155",borderRadius:8,fontSize:14,color:"white",background:"#0f172a",outline:"none",boxSizing:"border-box"}} />
                </div>
              </div>
              <div style={{display:"flex",gap:12}}>
                <div style={{flex:1}}>
                  <label style={{display:"block",fontSize:12,color:"#94a3b8",marginBottom:4,fontWeight:600}}>Basic Salary</label>
                  <input type="number" value={form.basic_salary} onChange={e=>setForm({...form,basic_salary:parseInt(e.target.value)})}
                    style={{width:"100%",padding:"10px 14px",border:"1px solid #334155",borderRadius:8,fontSize:14,color:"white",background:"#0f172a",outline:"none",boxSizing:"border-box"}} />
                </div>
                <div style={{flex:1}}>
                  <label style={{display:"block",fontSize:12,color:"#94a3b8",marginBottom:4,fontWeight:600}}>Allowances</label>
                  <input type="number" value={form.allowances} onChange={e=>setForm({...form,allowances:parseInt(e.target.value)})}
                    style={{width:"100%",padding:"10px 14px",border:"1px solid #334155",borderRadius:8,fontSize:14,color:"white",background:"#0f172a",outline:"none",boxSizing:"border-box"}} />
                </div>
              </div>
              <div style={{display:"flex",gap:12}}>
                <div style={{flex:1}}>
                  <label style={{display:"block",fontSize:12,color:"#94a3b8",marginBottom:4,fontWeight:600}}>Deductions</label>
                  <input type="number" value={form.deductions} onChange={e=>setForm({...form,deductions:parseInt(e.target.value)})}
                    style={{width:"100%",padding:"10px 14px",border:"1px solid #334155",borderRadius:8,fontSize:14,color:"white",background:"#0f172a",outline:"none",boxSizing:"border-box"}} />
                </div>
                <div style={{flex:1}}>
                  <label style={{display:"block",fontSize:12,color:"#94a3b8",marginBottom:4,fontWeight:600}}>Bonus</label>
                  <input type="number" value={form.bonus} onChange={e=>setForm({...form,bonus:parseInt(e.target.value)})}
                    style={{width:"100%",padding:"10px 14px",border:"1px solid #334155",borderRadius:8,fontSize:14,color:"white",background:"#0f172a",outline:"none",boxSizing:"border-box"}} />
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:12,marginTop:24,justifyContent:"flex-end"}}>
              <button onClick={()=>setShowModal(false)} style={{padding:"10px 20px",border:"1px solid #334155",borderRadius:8,fontSize:14,cursor:"pointer",color:"#94a3b8",background:"transparent"}}>Cancel</button>
              <button onClick={generatePayroll} disabled={saving} style={{padding:"10px 20px",background:"#2563eb",color:"white",border:"none",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer"}}>
                {saving ? "Generating..." : "Generate Payroll"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}