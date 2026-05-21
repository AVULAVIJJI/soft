"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export default function ResetPassword() {
  const router = useRouter();
  const [token, setToken] = useState(""); const [pw, setPw] = useState(""); const [cpw, setCpw] = useState("");
  const [show, setShow] = useState(false); const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false); const [error, setError] = useState("");
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    if (!t) setError("Invalid reset link. Please request a new one."); else setToken(t);
  }, []);
  const rules = [
    { label: "At least 8 characters", ok: pw.length >= 8 },
    { label: "Contains a number", ok: /\d/.test(pw) },
    { label: "Passwords match", ok: pw.length > 0 && pw === cpw },
  ];
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw !== cpw) { setError("Passwords do not match"); return; }
    if (pw.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true); setError("");
    try {
      const r = await fetch(`${API}/api/v1/auth/reset-password`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ token, new_password: pw }),
      });
      const d = await r.json();
      if (r.ok) { setDone(true); setTimeout(()=>router.push("/login"), 3000); }
      else setError(d.detail || "Reset failed. Link may have expired.");
    } catch { setError("Network error"); } finally { setLoading(false); }
  };
  const S: Record<string,React.CSSProperties> = {
    wrap:{minHeight:"100vh",background:"#050c1a",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"},
    card:{background:"#0d1730",border:"1px solid #1a2740",borderRadius:"16px",padding:"48px",width:"440px",maxWidth:"100%"},
    input:{width:"100%",background:"#050c1a",border:"1px solid #1a2740",borderRadius:"8px",padding:"12px 16px",color:"white",fontSize:"14px",outline:"none",boxSizing:"border-box"},
    btn:{width:"100%",background:"#0066ff",color:"white",border:"none",borderRadius:"8px",padding:"14px",fontSize:"15px",fontWeight:700,cursor:"pointer"},
    error:{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:"8px",padding:"12px",color:"#DC2626",fontSize:"13px",marginBottom:"16px"},
  };
  return (
    <div style={S.wrap}><div style={S.card}>
      <div style={{textAlign:"center",marginBottom:"32px"}}>
        <div style={{fontWeight:900,fontSize:"18px",letterSpacing:"2px",color:"white"}}>SOFTMASTER</div>
        <div style={{color:"#6b7fa3",fontSize:"11px",letterSpacing:"2px"}}>CLIENT PORTAL</div>
      </div>
      {done ? (
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:"48px",marginBottom:"16px"}}>✅</div>
          <h2 style={{color:"white",fontSize:"20px",fontWeight:700,marginBottom:"12px"}}>Password Reset!</h2>
          <p style={{color:"#6b7fa3",fontSize:"14px",marginBottom:"8px"}}>Your password has been changed successfully.</p>
          <p style={{color:"#94a3b8",fontSize:"13px"}}>Redirecting to sign in...</p>
        </div>
      ) : (
        <>
          <h2 style={{color:"white",fontSize:"20px",fontWeight:700,marginBottom:"8px"}}>Set New Password</h2>
          <p style={{color:"#6b7fa3",fontSize:"14px",marginBottom:"24px"}}>Choose a strong password for your account.</p>
          {error && <div style={S.error}>{error}</div>}
          <form onSubmit={submit}>
            <div style={{marginBottom:"16px"}}>
              <label style={{display:"block",color:"#94a3b8",fontSize:"13px",fontWeight:600,marginBottom:"8px"}}>New Password</label>
              <div style={{position:"relative"}}>
                <input type={show?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)}
                  placeholder="Enter new password" style={{...S.input,paddingRight:"56px"}} required />
                <button type="button" onClick={()=>setShow(!show)}
                  style={{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#0066ff",cursor:"pointer",fontSize:"13px",fontWeight:600}}>
                  {show?"Hide":"Show"}
                </button>
              </div>
            </div>
            <div style={{marginBottom:"16px"}}>
              <label style={{display:"block",color:"#94a3b8",fontSize:"13px",fontWeight:600,marginBottom:"8px"}}>Confirm Password</label>
              <input type={show?"text":"password"} value={cpw} onChange={e=>setCpw(e.target.value)}
                placeholder="Confirm new password" style={S.input} required />
            </div>
            {pw && (
              <div style={{marginBottom:"20px",padding:"12px",background:"#050c1a",borderRadius:"8px"}}>
                {rules.map((r,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px"}}>
                    <span style={{color:r.ok?"#22C55E":"#6b7fa3",fontSize:"13px"}}>{r.ok?"✓":"○"}</span>
                    <span style={{color:r.ok?"#22C55E":"#6b7fa3",fontSize:"13px"}}>{r.label}</span>
                  </div>
                ))}
              </div>
            )}
            <button type="submit" disabled={loading||!token}
              style={{...S.btn,opacity:loading?0.7:1,cursor:loading?"not-allowed":"pointer"}}>
              {loading?"Resetting...":"Reset Password"}
            </button>
          </form>
        </>
      )}
    </div></div>
  );
}
