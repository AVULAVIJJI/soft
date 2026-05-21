"use client";
import { useState } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export default function ForgotPassword() {
  const [email, setEmail] = useState(""); const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false); const [error, setError] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const r = await fetch(`${API}/api/v1/auth/forgot-password`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({email, portal:"placement"}) });
      if (r.ok) setSent(true); else { const d=await r.json(); setError(d.detail||"Failed"); }
    } catch { setError("Network error"); } finally { setLoading(false); }
  };
  const S: Record<string,React.CSSProperties> = {
    wrap:{minHeight:"100vh",background:"#050c1a",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"},
    card:{background:"#0d1730",border:"1px solid #1a2740",borderRadius:"16px",padding:"48px",width:"420px",maxWidth:"100%"},
    brand:{fontWeight:900,fontSize:"18px",letterSpacing:"2px",color:"white",textAlign:"center",marginBottom:"4px"},
    sub:{color:"#6b7fa3",fontSize:"11px",letterSpacing:"2px",textAlign:"center",marginBottom:"32px"},
    label:{display:"block",color:"#94a3b8",fontSize:"13px",fontWeight:600,marginBottom:"8px"},
    input:{width:"100%",background:"#050c1a",border:"1px solid #1a2740",borderRadius:"8px",padding:"12px 16px",color:"white",fontSize:"14px",outline:"none",boxSizing:"border-box",marginBottom:"20px"},
    btn:{width:"100%",background:"#0066ff",color:"white",border:"none",borderRadius:"8px",padding:"14px",fontSize:"15px",fontWeight:700,cursor:"pointer"},
    error:{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:"8px",padding:"12px",color:"#DC2626",fontSize:"13px",marginBottom:"16px"},
    success:{textAlign:"center"},
    footer:{textAlign:"center",marginTop:"28px",paddingTop:"20px",borderTop:"1px solid #1a2740",color:"#374151",fontSize:"11px"},
  };
  return (
    <div style={S.wrap}><div style={S.card}>
      <div style={S.brand as React.CSSProperties}>SOFTMASTER</div>
      <div style={S.sub as React.CSSProperties}>PLACEMENT PORTAL</div>
      {sent ? (
        <div style={S.success as React.CSSProperties}>
          <div style={{fontSize:"48px",marginBottom:"16px"}}>✅</div>
          <h2 style={{color:"white",fontSize:"20px",fontWeight:700,marginBottom:"12px"}}>Check Your Email</h2>
          <p style={{color:"#6b7fa3",fontSize:"14px",lineHeight:1.7,marginBottom:"24px"}}>A password reset link has been sent if this email is registered. Check inbox and spam.</p>
          <p style={{color:"#94a3b8",fontSize:"12px",marginBottom:"24px"}}>Link expires in 1 hour.</p>
          <a href="/login" style={{display:"block",background:"#0066ff",color:"white",padding:"12px",borderRadius:"8px",textDecoration:"none",fontSize:"14px",fontWeight:600}}>Back to Sign In</a>
        </div>
      ) : (
        <>
          <h2 style={{color:"white",fontSize:"20px",fontWeight:700,marginBottom:"8px"}}>Forgot Password?</h2>
          <p style={{color:"#6b7fa3",fontSize:"14px",lineHeight:1.6,marginBottom:"24px"}}>Enter your email and we will send a reset link.</p>
          {error && <div style={S.error}>{error}</div>}
          <form onSubmit={submit}>
            <label style={S.label}>Email Address</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={S.input} required />
            <button type="submit" disabled={loading} style={{...S.btn,opacity:loading?0.7:1,cursor:loading?"not-allowed":"pointer"}}>{loading?"Sending...":"Send Reset Link"}</button>
          </form>
          <p style={{textAlign:"center",marginTop:"20px",color:"#6b7fa3",fontSize:"13px"}}>Remember? <a href="/login" style={{color:"#0066ff",fontWeight:600,textDecoration:"none"}}>Sign In</a></p>
        </>
      )}
      <div style={S.footer as React.CSSProperties}>Softmaster Technology Solutions Pvt Ltd<br/>12-18, Indira Nagar Colony, Peerzadiguda, Hyderabad, Telangana - 500039</div>
    </div></div>
  );
}
