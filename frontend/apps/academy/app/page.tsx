export default function AcademyHome() {
  return (
    <main style={{minHeight:'100vh',background:'#050c1a',color:'white'}}>
      <header style={{borderBottom:'1px solid #1a2740',padding:'16px 48px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(5,12,26,0.95)'}}>
        <div>
          <div style={{fontWeight:800,fontSize:'16px',letterSpacing:'2px',color:'white'}}>SOFTMASTER</div>
          <div style={{color:'#6b7fa3',fontSize:'11px',letterSpacing:'1px'}}>ACADEMY</div>
        </div>
        <div style={{display:'flex',gap:'16px'}}>
          <a href="/courses" style={{color:'#9ca3af',textDecoration:'none',fontSize:'14px'}}>Courses</a>
          <a href="/login" style={{background:'#0066ff',color:'white',padding:'8px 20px',borderRadius:'8px',textDecoration:'none',fontSize:'14px',fontWeight:600}}>Sign In</a>
        </div>
      </header>
      <section style={{padding:'120px 48px',textAlign:'center',maxWidth:'900px',margin:'0 auto'}}>
        <div style={{fontSize:'13px',fontWeight:700,letterSpacing:'4px',color:'#60a5fa',textTransform:'uppercase',marginBottom:'16px'}}>Softmaster Academy</div>
        <h1 style={{fontSize:'clamp(2.5rem,5vw,4.5rem)',fontWeight:900,lineHeight:1.1,marginBottom:'24px'}}>
          Learn from<br /><span style={{background:'linear-gradient(135deg,#0066ff,#00c2ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Industry Experts</span>
        </h1>
        <p style={{color:'#6b7fa3',fontSize:'18px',lineHeight:1.8,marginBottom:'48px',maxWidth:'600px',margin:'0 auto 48px'}}>
          Access professional courses, live classes, and certifications to advance your technology career.
        </p>
        <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
          <a href="/register" style={{background:'#0066ff',color:'white',padding:'16px 36px',borderRadius:'10px',textDecoration:'none',fontSize:'16px',fontWeight:700,boxShadow:'0 8px 30px rgba(0,102,255,0.4)'}}>Start Learning Free</a>
          <a href="/courses" style={{border:'1px solid #1a2740',color:'white',padding:'16px 36px',borderRadius:'10px',textDecoration:'none',fontSize:'16px',fontWeight:600}}>Browse Courses</a>
        </div>
      </section>
    </main>
  );
}
