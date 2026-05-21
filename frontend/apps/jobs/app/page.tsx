export default function JobsHome() {
  const featuredJobs = [
    { title: 'Full Stack Developer', company: 'Softmaster Technology Solutions', location: 'Hyderabad', type: 'Full Time', salary: 'INR 150,000 - 250,000' },
    { title: 'Python Backend Developer', company: 'Softmaster Technology Solutions', location: 'Remote / Hyderabad', type: 'Full Time', salary: 'INR 120,000 - 200,000' },
    { title: 'UI/UX Designer', company: 'Softmaster Technology Solutions', location: 'Hyderabad', type: 'Full Time', salary: 'INR 80,000 - 140,000' },
    { title: 'DevOps Engineer', company: 'Softmaster Technology Solutions', location: 'Remote', type: 'Contract', salary: 'INR 200,000 - 350,000' },
  ];
  return (
    <main style={{minHeight:'100vh',background:'#050c1a',color:'white'}}>
      <header style={{borderBottom:'1px solid #1a2740',padding:'16px 48px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(5,12,26,0.95)'}}>
        <div>
          <div style={{fontWeight:800,fontSize:'16px',letterSpacing:'2px',color:'white'}}>SOFTMASTER</div>
          <div style={{color:'#6b7fa3',fontSize:'11px',letterSpacing:'1px'}}>JOBS PORTAL</div>
        </div>
        <div style={{display:'flex',gap:'16px'}}>
          <a href="/recruiters" style={{color:'#9ca3af',textDecoration:'none',fontSize:'14px'}}>For Recruiters</a>
          <a href="/login" style={{background:'#0066ff',color:'white',padding:'8px 20px',borderRadius:'8px',textDecoration:'none',fontSize:'14px',fontWeight:600}}>Sign In</a>
        </div>
      </header>
      <section style={{padding:'80px 48px 40px',textAlign:'center'}}>
        <h1 style={{fontSize:'clamp(2rem,4vw,3.5rem)',fontWeight:900,marginBottom:'16px'}}>
          Find Your <span style={{background:'linear-gradient(135deg,#0066ff,#00c2ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Dream Job</span>
        </h1>
        <p style={{color:'#6b7fa3',fontSize:'16px',marginBottom:'32px'}}>Discover opportunities at Softmaster and our network of partner companies.</p>
        <div style={{display:'flex',gap:'12px',maxWidth:'700px',margin:'0 auto',flexWrap:'wrap',justifyContent:'center'}}>
          <input placeholder="Job title or keyword" style={{flex:1,minWidth:'200px',background:'#0d1730',border:'1px solid #1a2740',borderRadius:'8px',padding:'14px 16px',color:'white',fontSize:'14px',outline:'none'}} />
          <input placeholder="Location" style={{flex:1,minWidth:'160px',background:'#0d1730',border:'1px solid #1a2740',borderRadius:'8px',padding:'14px 16px',color:'white',fontSize:'14px',outline:'none'}} />
          <button style={{background:'#0066ff',color:'white',border:'none',borderRadius:'8px',padding:'14px 24px',fontSize:'14px',fontWeight:700,cursor:'pointer'}}>Search Jobs</button>
        </div>
      </section>
      <section style={{padding:'40px 48px',maxWidth:'900px',margin:'0 auto'}}>
        <h2 style={{fontSize:'22px',fontWeight:700,color:'white',marginBottom:'24px'}}>Featured Openings</h2>
        <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          {featuredJobs.map((job) => (
            <div key={job.title} style={{background:'#0d1730',border:'1px solid #1a2740',borderRadius:'12px',padding:'24px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'16px'}}>
              <div>
                <div style={{color:'white',fontWeight:700,fontSize:'16px',marginBottom:'4px'}}>{job.title}</div>
                <div style={{color:'#60a5fa',fontSize:'13px',marginBottom:'8px'}}>{job.company}</div>
                <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
                  <span style={{color:'#6b7fa3',fontSize:'13px'}}>{job.location}</span>
                  <span style={{background:'rgba(0,102,255,0.15)',color:'#60a5fa',padding:'2px 10px',borderRadius:'20px',fontSize:'12px',fontWeight:600}}>{job.type}</span>
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{color:'#fbbf24',fontSize:'14px',fontWeight:600,marginBottom:'12px'}}>{job.salary}</div>
                <a href={`/jobs/${job.title.toLowerCase().replace(/\s+/g,'-')}`} style={{background:'#0066ff',color:'white',padding:'8px 20px',borderRadius:'8px',textDecoration:'none',fontSize:'13px',fontWeight:600}}>Apply Now</a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
