"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      let url = `${API}/api/v1/courses/?limit=50`;
      if (search) url += `&search=${search}`;
      if (level !== "all") url += `&level=${level}`;
      const res = await fetch(url);
      const d = await res.json();
      setCourses(d.courses || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleEnroll = async (courseId: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.push("/login"); return; }
    try {
      const res = await fetch(`${API}/api/v1/courses/${courseId}/enroll`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` },
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.detail || "Failed");
      alert("Enrolled successfully!");
    } catch (e: any) { alert(e.message); }
  };

  const catIcons: Record<string, string> = {
    web_development: "🌐", data_science: "📊", mobile_development: "📱",
    devops: "⚙️", design: "🎨", database: "🗄️", security: "🔐",
  };

  return (
    <div style={{minHeight:"100vh",background:"#030712",color:"white",fontFamily:"system-ui,sans-serif"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"40px 24px"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <h1 style={{fontSize:32,fontWeight:800,marginBottom:8}}>Our Courses</h1>
          <p style={{color:"#94a3b8",fontSize:15}}>Industry-relevant courses with real-world projects and certificates</p>
        </div>
        <div style={{display:"flex",gap:12,marginBottom:32,flexWrap:"wrap"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchCourses()} placeholder="Search courses..."
            style={{flex:1,minWidth:200,padding:"12px 16px",background:"#1e293b",border:"1px solid #334155",borderRadius:10,color:"white",fontSize:14,outline:"none"}} />
          <select value={level} onChange={e=>{setLevel(e.target.value);fetchCourses()}}
            style={{padding:"12px 16px",background:"#1e293b",border:"1px solid #334155",borderRadius:10,color:"white",fontSize:14,outline:"none"}}>
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        {loading ? (
          <div style={{textAlign:"center",padding:60,color:"#94a3b8"}}>Loading courses...</div>
        ) : courses.length === 0 ? (
          <div style={{textAlign:"center",padding:60,color:"#94a3b8"}}>No courses found</div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20}}>
            {courses.map((c: any) => (
              <div key={c.id} style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:16,padding:20}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:20}}>{catIcons[c.category] || "📚"}</span>
                    <span style={{color:"#6b7fa3",fontSize:12}}>{(c.category || "").replace("_"," ")}</span>
                  </div>
                  <span style={{fontSize:11,padding:"4px 10px",borderRadius:20,background:"rgba(59,130,246,0.15)",color:"#60a5fa",fontWeight:600}}>{c.level}</span>
                </div>
                <h3 style={{color:"white",fontSize:16,fontWeight:700,marginBottom:8}}>{c.title}</h3>
                <p style={{color:"#6b7fa3",fontSize:13,lineHeight:1.6,marginBottom:16}}>{(c.description || "").slice(0,120)}...</p>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,fontSize:12,color:"#94a3b8"}}>
                  <span>⭐ {c.rating || "4.8"}</span>
                  <span>👥 {c.enrolled_count || 0} enrolled</span>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>router.push(`/courses/${c.id}`)} style={{flex:1,padding:"10px",borderRadius:8,border:"1px solid #334155",background:"transparent",color:"#94a3b8",fontSize:13,fontWeight:600,cursor:"pointer"}}>
                    View Details
                  </button>
                  <button onClick={()=>handleEnroll(c.id)} style={{flex:1,padding:"10px",borderRadius:8,border:"none",background:"#2563eb",color:"white",fontSize:13,fontWeight:600,cursor:"pointer"}}>
                    Enroll Free
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}