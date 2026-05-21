"use client";
import { useState, useEffect } from "react";

export default function PayslipsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState<any>(null);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : "";
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  useEffect(() => { fetchPayslips(); }, []);

  const fetchPayslips = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/payroll/?limit=50`, { headers });
      if (res.ok) { const d = await res.json(); setRecords(d.records || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const viewSlip = async (payrollId: number) => {
    try {
      const res = await fetch(`${API}/api/v1/payroll/${payrollId}/slip`, { headers });
      if (res.ok) { const d = await res.json(); setSelectedSlip(d.payslip); }
    } catch (e) { console.error(e); }
  };

  const fmt = (n: number) => `₹${(n || 0).toLocaleString("en-IN")}`;

  if (loading) return <div style={{padding:40,textAlign:"center",color:"#94a3b8"}}>Loading...</div>;

  return (
    <div style={{maxWidth:1000,margin:"0 auto"}}>
      <h1 style={{fontSize:24,fontWeight:700,color:"white",marginBottom:8}}>My Payslips</h1>
      <p style={{color:"#94a3b8",fontSize:14,marginBottom:24}}>View and download your salary slips</p>

      {records.length === 0 ? (
        <div style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:16,padding:60,textAlign:"center",color:"#64748b"}}>
          No payslips generated yet. Contact HR for salary processing.
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
          {records.map((r: any) => (
            <div key={r.id} style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:16,padding:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div>
                  <div style={{fontSize:18,fontWeight:700,color:"white"}}>{months[r.month]} {r.year}</div>
                  <div style={{fontSize:12,color:"#64748b",marginTop:2}}>Salary Slip</div>
                </div>
                <span style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,
                  background:r.status==="paid"?"rgba(34,197,94,0.15)":"rgba(234,179,8,0.15)",
                  color:r.status==="paid"?"#4ade80":"#facc15",textTransform:"capitalize"
                }}>{r.status}</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
                  <span style={{color:"#64748b"}}>Basic Salary</span>
                  <span style={{color:"#94a3b8"}}>{fmt(r.basic_salary)}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
                  <span style={{color:"#64748b"}}>Allowances</span>
                  <span style={{color:"#4ade80"}}>+{fmt(r.allowances)}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
                  <span style={{color:"#64748b"}}>Deductions</span>
                  <span style={{color:"#f87171"}}>-{fmt(r.deductions)}</span>
                </div>
                <div style={{borderTop:"1px solid #1a2740",paddingTop:8,display:"flex",justifyContent:"space-between",fontSize:15}}>
                  <span style={{color:"white",fontWeight:700}}>Net Salary</span>
                  <span style={{color:"#4ade80",fontWeight:700}}>{fmt(r.net_salary)}</span>
                </div>
              </div>
              <button onClick={() => viewSlip(r.id)}
                style={{width:"100%",padding:"10px",background:"rgba(37,99,235,0.15)",color:"#60a5fa",border:"1px solid rgba(37,99,235,0.3)",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer"}}>
                View Full Payslip
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Payslip Detail Modal */}
      {selectedSlip && (
        <div onClick={()=>setSelectedSlip(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#1e293b",borderRadius:16,padding:32,width:480,maxWidth:"90%",border:"1px solid #334155"}}>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:16,fontWeight:800,letterSpacing:2,color:"white"}}>SOFTMASTER</div>
              <div style={{fontSize:11,color:"#64748b"}}>Softmaster Technology Solutions Pvt Ltd</div>
              <div style={{fontSize:18,fontWeight:700,color:"white",marginTop:12}}>Payslip — {months[selectedSlip.month]} {selectedSlip.year}</div>
            </div>
            <div style={{background:"#0f172a",borderRadius:10,padding:16,marginBottom:16}}>
              <div style={{fontSize:14,fontWeight:600,color:"white"}}>{selectedSlip.employee_name}</div>
              <div style={{fontSize:12,color:"#64748b"}}>{selectedSlip.employee_email}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[
                ["Basic Salary", fmt(selectedSlip.basic_salary), "white"],
                ["Allowances", `+${fmt(selectedSlip.allowances)}`, "#4ade80"],
                ["Bonus", `+${fmt(selectedSlip.bonus)}`, "#4ade80"],
                ["Gross Salary", fmt(selectedSlip.gross_salary), "white"],
                ["Deductions", `-${fmt(selectedSlip.deductions)}`, "#f87171"],
                ["Tax", `-${fmt(selectedSlip.tax_amount)}`, "#f87171"],
              ].map(([label, val, color]) => (
                <div key={label as string} style={{display:"flex",justifyContent:"space-between",fontSize:14}}>
                  <span style={{color:"#94a3b8"}}>{label}</span>
                  <span style={{color:color as string,fontWeight:600}}>{val}</span>
                </div>
              ))}
              <div style={{borderTop:"1px solid #334155",paddingTop:10,display:"flex",justifyContent:"space-between",fontSize:18}}>
                <span style={{color:"white",fontWeight:800}}>Net Salary</span>
                <span style={{color:"#4ade80",fontWeight:800}}>{fmt(selectedSlip.net_salary)}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:12,marginTop:20}}>
              <button onClick={()=>{
                const w = window.open("","","width=800,height=600");
                if(!w) return;
                w.document.write(`<html><head><title>Payslip - ${months[selectedSlip.month]} ${selectedSlip.year}</title>
                  <style>body{font-family:system-ui;padding:40px;color:#111}table{width:100%;border-collapse:collapse;margin:20px 0}td{padding:8px 12px;border-bottom:1px solid #eee}
                  .right{text-align:right}.head{text-align:center;margin-bottom:30px}.total td{border-top:2px solid #111;font-weight:800;font-size:18px}
                  @media print{button{display:none}}</style></head><body>
                  <div class="head"><h2>SOFTMASTER</h2><p>Softmaster Technology Solutions Pvt Ltd</p><p>Hyderabad, Telangana - 500039</p>
                  <h3>Payslip — ${months[selectedSlip.month]} ${selectedSlip.year}</h3></div>
                  <p><b>Employee:</b> ${selectedSlip.employee_name}<br/><b>Email:</b> ${selectedSlip.employee_email}</p>
                  <table><tr><td>Basic Salary</td><td class="right">₹${(selectedSlip.basic_salary||0).toLocaleString("en-IN")}</td></tr>
                  <tr><td>Allowances</td><td class="right">₹${(selectedSlip.allowances||0).toLocaleString("en-IN")}</td></tr>
                  <tr><td>Bonus</td><td class="right">₹${(selectedSlip.bonus||0).toLocaleString("en-IN")}</td></tr>
                  <tr><td><b>Gross Salary</b></td><td class="right"><b>₹${(selectedSlip.gross_salary||0).toLocaleString("en-IN")}</b></td></tr>
                  <tr><td>Deductions</td><td class="right" style="color:red">-₹${(selectedSlip.deductions||0).toLocaleString("en-IN")}</td></tr>
                  <tr><td>Tax</td><td class="right" style="color:red">-₹${(selectedSlip.tax_amount||0).toLocaleString("en-IN")}</td></tr>
                  <tr class="total"><td>Net Salary</td><td class="right" style="color:green">₹${(selectedSlip.net_salary||0).toLocaleString("en-IN")}</td></tr></table>
                  <p style="margin-top:40px;color:#666;font-size:12px">This is a computer generated payslip. No signature required.</p>
                  <button onclick="window.print()">Print / Save as PDF</button></body></html>`);
                w.document.close();
              }} style={{flex:1,padding:"10px",background:"#2563eb",color:"white",border:"none",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer"}}>
                📥 Download PDF
              </button>
              <button onClick={()=>setSelectedSlip(null)}
                style={{flex:1,padding:"10px",background:"#334155",color:"#94a3b8",border:"none",borderRadius:8,fontSize:14,cursor:"pointer"}}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}