"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill all fields"); return; }
    setLoading(true); setError("");
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API}/api/v1/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");
      const role = String(data.user?.role || "").replace("UserRole.", "");
      if (!["super_admin", "admin", "hr", "manager"].includes(role)) {
        throw new Error("Access denied. Only HR/Admin/Manager can access ERP Workspace.");
      }
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#030712 0%,#0f172a 50%,#030712 100%)"}}>
      <div style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:20,padding:"48px 40px",width:420,maxWidth:"90%",boxShadow:"0 25px 60px rgba(0,0,0,0.5)"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:64,height:64,background:"linear-gradient(135deg,#10b981,#059669)",borderRadius:16,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
            <span style={{fontSize:32}}>🏢</span>
          </div>
          <div style={{fontSize:22,fontWeight:800,color:"white",letterSpacing:3}}>SOFTMASTER</div>
          <div style={{color:"#6b7fa3",fontSize:13,marginTop:6}}>ERP Workspace</div>
        </div>
        {error && <div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:10,padding:"12px 16px",marginBottom:20,color:"#f87171",fontSize:13,textAlign:"center"}}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",color:"#94a3b8",fontSize:12,fontWeight:600,marginBottom:8}}>EMAIL ADDRESS</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@softmastertech.com"
              style={{width:"100%",background:"#050c1a",border:"1px solid #1a2740",borderRadius:10,padding:"14px 16px",color:"white",fontSize:14,outline:"none",boxSizing:"border-box"}} />
          </div>
          <div style={{marginBottom:10}}>
            <label style={{display:"block",color:"#94a3b8",fontSize:12,fontWeight:600,marginBottom:8}}>PASSWORD</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password"
              style={{width:"100%",background:"#050c1a",border:"1px solid #1a2740",borderRadius:10,padding:"14px 16px",color:"white",fontSize:14,outline:"none",boxSizing:"border-box"}} />
          </div>
          <div style={{textAlign:"right",marginBottom:24}}>
            <a href="/forgot-password" style={{color:"#10b981",fontSize:12,textDecoration:"none"}}>Forgot password?</a>
          </div>
          <button type="submit" disabled={loading}
            style={{width:"100%",background:loading?"#065f46":"linear-gradient(135deg,#10b981,#059669)",color:"white",border:"none",borderRadius:10,padding:"14px",fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer"}}>
            {loading ? "Signing in..." : "Sign In to ERP Workspace"}
          </button>
        </form>
        <div style={{textAlign:"center",marginTop:28,paddingTop:20,borderTop:"1px solid #1a2740"}}>
          <div style={{color:"#4b5563",fontSize:11}}>Softmaster Technology Solutions Pvt Ltd</div>
          <div style={{color:"#374151",fontSize:10,marginTop:4}}>Only HR, Admin & Manager access</div>
        </div>
      </div>
    </div>
  );
}