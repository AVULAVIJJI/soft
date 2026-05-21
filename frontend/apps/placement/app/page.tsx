export default function PlacementHome() {
  const stats = [
    { num: '500+', label: 'Placements Made' },
    { num: '120+', label: 'Partner Companies' },
    { num: '95%', label: 'Placement Rate' },
    { num: '24+', label: 'Years Experience' },
  ];
  return (
    <main style={{minHeight:'100vh',background:'#050c1a',color:'white'}}>
      <header style={{borderBottom:'1px solid #1a2740',padding:'16px 48px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontWeight:800,fontSize:'16px',letterSpacing:'2px'}}>SOFTMASTER</div>
          <div style={{color:'#6b7fa3',fontSize:'11px',letterSpacing:'1px'}}>PLACEMENT PORTAL</div>
        </div>
        <a href="/login" style={{background:'#0066ff',color:'white',padding:'8px 20px',borderRadius:'8px',textDecoration:'none',fontSize:'14px',fontWeight:600}}>Sign In</a>
      </header>
      <section style={{padding:'100px 48px',textAlign:'center'}}>
        <h1 style={{fontSize:'clamp(2rem,4vw,4rem)',fontWeight:900,marginBottom:'24px'}}>
          Launch Your <span style={{background:'linear-gradient(135deg,#0066ff,#00c2ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Tech Career</span>
        </h1>
        <p style={{color:'#6b7fa3',fontSize:'18px',lineHeight:1.8,maxWidth:'600px',margin:'0 auto 48px'}}>Softmaster's placement team connects top technology talent with leading companies across India and beyond.</p>
        <div style={{display:'flex',gap:'40px',justifyContent:'center',flexWrap:'wrap',marginBottom:'48px'}}>
          {stats.map((s) => (
            <div key={s.label} style={{textAlign:'center'}}>
              <div style={{fontSize:'2.5rem',fontWeight:900,color:'white'}}>{s.num}</div>
              <div style={{color:'#6b7fa3',fontSize:'13px',marginTop:'4px'}}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
          <a href="/register" style={{background:'#0066ff',color:'white',padding:'16px 36px',borderRadius:'10px',textDecoration:'none',fontSize:'15px',fontWeight:700}}>Register as Student</a>
          <a href="/companies" style={{border:'1px solid #1a2740',color:'white',padding:'16px 36px',borderRadius:'10px',textDecoration:'none',fontSize:'15px',fontWeight:600}}>Partner Company</a>
        </div>
      </section>
    </main>
  );
}
