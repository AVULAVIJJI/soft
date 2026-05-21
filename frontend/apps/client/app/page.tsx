export default function ClientPortalHome() {
  return (
    <main style={{minHeight:'100vh',background:'#050c1a',color:'white',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center',maxWidth:'480px',padding:'48px'}}>
        <div style={{fontWeight:800,fontSize:'20px',letterSpacing:'2px',color:'white',marginBottom:'4px'}}>SOFTMASTER</div>
        <div style={{color:'#6b7fa3',fontSize:'12px',letterSpacing:'2px',marginBottom:'48px'}}>CLIENT PORTAL</div>
        <h1 style={{fontSize:'2.5rem',fontWeight:900,marginBottom:'16px'}}>Welcome to Your<br /><span style={{background:'linear-gradient(135deg,#0066ff,#00c2ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Client Portal</span></h1>
        <p style={{color:'#6b7fa3',fontSize:'16px',lineHeight:1.7,marginBottom:'36px'}}>Track your projects, view invoices, submit support tickets, and communicate with our team in one place.</p>
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <a href="/login" style={{background:'#0066ff',color:'white',padding:'14px',borderRadius:'10px',textDecoration:'none',fontSize:'15px',fontWeight:700}}>Sign In to Portal</a>
          <a href="https://softmastertech.com/contact" style={{border:'1px solid #1a2740',color:'#9ca3af',padding:'14px',borderRadius:'10px',textDecoration:'none',fontSize:'14px'}}>Not a client? Contact Us</a>
        </div>
        <div style={{marginTop:'40px',color:'#374151',fontSize:'12px'}}>
          Softmaster Technology Solutions Pvt Ltd<br />12-18, Indira Nagar Colony, Peerzadiguda, Hyderabad, Telangana - 500039
        </div>
      </div>
    </main>
  );
}
