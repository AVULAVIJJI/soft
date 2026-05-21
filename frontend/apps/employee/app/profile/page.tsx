"use client";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ full_name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : "";
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API}/api/v1/users/me`, { headers });
      if (res.ok) {
        const d = await res.json();
        setUser(d);
        setForm({ full_name: d.full_name || "", phone: d.phone || "" });
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const updateProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/v1/users/${user.id}`, {
        method: "PUT", headers, body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.detail || "Failed");
      alert("Profile updated!");
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        u.full_name = form.full_name;
        u.phone = form.phone;
        localStorage.setItem("user", JSON.stringify(u));
      }
      fetchProfile();
    } catch (e: any) { alert(e.message); } finally { setSaving(false); }
  };

  if (loading) return <div style={{padding:40,textAlign:"center",color:"#94a3b8"}}>Loading...</div>;

  return (
    <div style={{maxWidth:600,margin:"0 auto"}}>
      <h1 style={{fontSize:24,fontWeight:700,color:"white",marginBottom:24}}>My Profile</h1>

      <div style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:16,padding:24,marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:24,fontWeight:700}}>
            {(user?.full_name || "?").charAt(0)}
          </div>
          <div>
            <div style={{fontSize:18,fontWeight:700,color:"white"}}>{user?.full_name}</div>
            <div style={{fontSize:13,color:"#64748b"}}>{user?.email}</div>
            <span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,background:"rgba(59,130,246,0.15)",color:"#60a5fa",marginTop:4,display:"inline-block",textTransform:"capitalize"}}>
              {String(user?.role || "").replace("UserRole.","").replace("_"," ")}
            </span>
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <label style={{display:"block",fontSize:12,color:"#94a3b8",marginBottom:4,fontWeight:600}}>Full Name</label>
            <input value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})}
              style={{width:"100%",padding:"10px 14px",border:"1px solid #334155",borderRadius:8,fontSize:14,color:"white",background:"#0f172a",outline:"none",boxSizing:"border-box"}} />
          </div>
          <div>
            <label style={{display:"block",fontSize:12,color:"#94a3b8",marginBottom:4,fontWeight:600}}>Email</label>
            <input value={user?.email || ""} disabled
              style={{width:"100%",padding:"10px 14px",border:"1px solid #334155",borderRadius:8,fontSize:14,color:"#64748b",background:"#0a0f1a",outline:"none",boxSizing:"border-box"}} />
          </div>
          <div>
            <label style={{display:"block",fontSize:12,color:"#94a3b8",marginBottom:4,fontWeight:600}}>Phone</label>
            <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Enter phone number"
              style={{width:"100%",padding:"10px 14px",border:"1px solid #334155",borderRadius:8,fontSize:14,color:"white",background:"#0f172a",outline:"none",boxSizing:"border-box"}} />
          </div>
          <div>
            <label style={{display:"block",fontSize:12,color:"#94a3b8",marginBottom:4,fontWeight:600}}>Status</label>
            <div style={{padding:"10px 14px",border:"1px solid #334155",borderRadius:8,fontSize:14,color:user?.is_active?"#4ade80":"#f87171",background:"#0a0f1a"}}>
              {user?.is_active ? "✅ Active" : "❌ Inactive"}
            </div>
          </div>
        </div>

        <button onClick={updateProfile} disabled={saving}
          style={{width:"100%",marginTop:20,padding:"12px",background:"#2563eb",color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </div>

      {/* Account Info */}
      <div style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:16,padding:24}}>
        <h3 style={{fontSize:15,fontWeight:600,color:"white",marginBottom:16}}>Account Information</h3>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
            <span style={{color:"#64748b"}}>User ID</span>
            <span style={{color:"#94a3b8"}}>{user?.id}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
            <span style={{color:"#64748b"}}>Verified</span>
            <span style={{color:user?.is_verified?"#4ade80":"#f87171"}}>{user?.is_verified ? "Yes" : "No"}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
            <span style={{color:"#64748b"}}>Role</span>
            <span style={{color:"#94a3b8",textTransform:"capitalize"}}>{String(user?.role||"").replace("UserRole.","").replace("_"," ")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}