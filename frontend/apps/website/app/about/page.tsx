import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'About Us - Softmaster Technology Solutions' };

const MILESTONES = [
  { year:"2000", title:"Founded", desc:"Softmaster Technology Solutions established in Hyderabad, Telangana, India, India with a mission to deliver world-class software." },
  { year:"2005", title:"1st ERP Launched", desc:"ELEACC ERP system launched, now trusted by 100+ dealers across India." },
  { year:"2010", title:"500 Clients", desc:"Crossed 500 active clients across retail, healthcare, and education sectors." },
  { year:"2015", title:"Hospital & School Systems", desc:"Launched hospital management and school management systems now used island-wide." },
  { year:"2019", title:"Mobile Apps", desc:"Expanded into mobile app development for iOS and Android platforms." },
  { year:"2022", title:"1700+ Clients", desc:"Reached 1700+ clients served across all industries in India." },
  { year:"2024", title:"Enterprise SaaS Platform", desc:"Launched full enterprise SaaS platform with Academy, Jobs, ERP, and AI services." },
];

const VALUES = [
  { icon:"🎯", title:"Client-First", desc:"Every solution is built around our clients' real needs, not generic templates." },
  { icon:"🔒", title:"Reliability", desc:"24+ years of delivering systems that businesses depend on every single day." },
  { icon:"💡", title:"Innovation", desc:"Continuously adopting the latest technologies to keep clients competitive." },
  { icon:"🤝", title:"Partnership", desc:"We do not just deliver software — we become long-term technology partners." },
  { icon:"📈", title:"Growth", desc:"Our systems are designed to scale with your business from startup to enterprise." },
  { icon:"🌐", title:"Excellence", desc:"Professional standards in every line of code, every design, every interaction." },
];

const TEAM_STATS = [
  { num:"24+", label:"Years in Business" },
  { num:"1700+", label:"Clients Served" },
  { num:"8+", label:"Industry Sectors" },
  { num:"100%", label:"Client Retention Rate" },
  { num:"50+", label:"Team Members" },
  { num:"10+", label:"Software Products" },
];

const INDUSTRIES = [
  { icon:"🏥", name:"Healthcare", desc:"Hospital management, clinic billing, patient records" },
  { icon:"🏫", name:"Education", desc:"School management, fee collection, student tracking" },
  { icon:"🏨", name:"Hospitality", desc:"Hotel management, reservations, billing" },
  { icon:"🛒", name:"Retail & FMCG", desc:"POS systems, inventory, supply chain" },
  { icon:"🏭", name:"Manufacturing", desc:"Production tracking, ERP, quality management" },
  { icon:"✈️", name:"Travel & Tours", desc:"Booking systems, itinerary management" },
  { icon:"💰", name:"Finance", desc:"Hire-purchase, loan management, ELEACC ERP" },
  { icon:"🚗", name:"Automotive", desc:"Dealership management, service tracking" },
];

export default function AboutPage() {
  return (
    <main style={{background:"#050c1a",color:"white",minHeight:"100vh"}}>
      {/* Hero */}
      <section style={{padding:"120px 48px 80px",textAlign:"center",background:"linear-gradient(180deg,#0d1f4a 0%,#050c1a 100%)"}}>
        <div style={{maxWidth:"900px",margin:"0 auto"}}>
          <div style={{display:"inline-block",background:"rgba(0,102,255,0.1)",border:"1px solid rgba(0,102,255,0.3)",borderRadius:"20px",padding:"6px 18px",fontSize:"12px",fontWeight:700,letterSpacing:"3px",color:"#60a5fa",marginBottom:"24px",textTransform:"uppercase"}}>
            About Softmaster
          </div>
          <h1 style={{fontSize:"clamp(2rem,5vw,4rem)",fontWeight:900,lineHeight:1.15,marginBottom:"24px"}}>
            24 Years of Trusted<br/>
            <span style={{background:"linear-gradient(135deg,#0066ff,#00c2ff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Technology Excellence</span>
          </h1>
          <p style={{color:"#9ca3af",fontSize:"18px",lineHeight:1.8,maxWidth:"700px",margin:"0 auto 48px"}}>
            Founded in 2000, Softmaster Technology Solutions Pvt Ltd has been India's most trusted software company for over two decades — delivering reliable, scalable, and innovative technology solutions to 1700+ businesses.
          </p>
          <div style={{display:"flex",gap:"32px",justifyContent:"center",flexWrap:"wrap"}}>
            {TEAM_STATS.map(s=>(
              <div key={s.label} style={{textAlign:"center",padding:"20px 24px",background:"rgba(13,31,74,0.8)",border:"1px solid #1a2740",borderRadius:"12px",minWidth:"120px"}}>
                <div style={{fontSize:"2rem",fontWeight:900,color:"white",marginBottom:"4px"}}>{s.num}</div>
                <div style={{color:"#6b7fa3",fontSize:"12px"}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section style={{padding:"80px 48px",maxWidth:"1100px",margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"64px",alignItems:"center"}}>
          <div>
            <h2 style={{fontSize:"clamp(1.5rem,3vw,2.5rem)",fontWeight:900,marginBottom:"24px"}}>Our Story</h2>
            <p style={{color:"#9ca3af",fontSize:"15px",lineHeight:1.9,marginBottom:"20px"}}>
              Softmaster Technology Solutions Pvt Ltd was founded in 2000 in Hyderabad, Telangana, India, with a simple but powerful vision: to make enterprise-grade software accessible to every Indian business, regardless of size.
            </p>
            <p style={{color:"#9ca3af",fontSize:"15px",lineHeight:1.9,marginBottom:"20px"}}>
              Over 24 years, we have grown from a small software development team into a full-service technology company serving retail chains, hospitals, schools, hotels, manufacturing companies, and government institutions across the entire island.
            </p>
            <p style={{color:"#9ca3af",fontSize:"15px",lineHeight:1.9}}>
              Our flagship product ELEACC ERP is trusted by over 100+ dealers. Our hospital, school, and hotel management systems are deployed at leading institutions island-wide. Every product we build is based on a deep understanding of India's diverse business environment.
            </p>
          </div>
          <div>
            <div style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:"16px",padding:"32px"}}>
              <h3 style={{color:"white",fontSize:"18px",fontWeight:700,marginBottom:"24px"}}>Company Details</h3>
              {[
                ["Company", "Softmaster Technology Solutions Pvt Ltd"],
                ["Founded", "Year 2000"],
                ["Headquarters", "No:07, George E De Silva Mawatha"],
                ["City", "12-18, Indira Nagar Colony, Peerzadiguda, Hyderabad, Telangana - 500039"],
                ["Phone", "+94 81 220 4130 | +94 76 593 3568"],
                ["Email", "contact@softmastertech.com"],
                ["Clients", "1700+ across India"],
                ["Experience", "24+ Years"],
              ].map(([label, value])=>(
                <div key={label} style={{display:"flex",gap:"16px",paddingBottom:"12px",marginBottom:"12px",borderBottom:"1px solid #1a2740"}}>
                  <span style={{color:"#6b7fa3",fontSize:"13px",minWidth:"120px"}}>{label}</span>
                  <span style={{color:"white",fontSize:"13px",fontWeight:600}}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{padding:"80px 48px",background:"rgba(13,23,48,0.5)"}}>
        <div style={{maxWidth:"900px",margin:"0 auto"}}>
          <h2 style={{fontSize:"clamp(1.5rem,3vw,2.5rem)",fontWeight:900,textAlign:"center",marginBottom:"56px"}}>Our Journey</h2>
          <div style={{position:"relative",paddingLeft:"32px",borderLeft:"2px solid #1a2740"}}>
            {MILESTONES.map((m,i)=>(
              <div key={i} style={{position:"relative",marginBottom:"40px"}}>
                <div style={{position:"absolute",left:"-41px",width:"18px",height:"18px",background:"#0066ff",borderRadius:"50%",top:"4px",border:"3px solid #050c1a"}}/>
                <div style={{display:"inline-block",background:"rgba(0,102,255,0.15)",border:"1px solid rgba(0,102,255,0.3)",borderRadius:"20px",padding:"4px 12px",fontSize:"12px",fontWeight:800,color:"#60a5fa",marginBottom:"8px"}}>{m.year}</div>
                <h3 style={{color:"white",fontSize:"17px",fontWeight:700,marginBottom:"6px"}}>{m.title}</h3>
                <p style={{color:"#9ca3af",fontSize:"14px",lineHeight:1.7,margin:0}}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{padding:"80px 48px",maxWidth:"1100px",margin:"0 auto"}}>
        <h2 style={{fontSize:"clamp(1.5rem,3vw,2.5rem)",fontWeight:900,textAlign:"center",marginBottom:"48px"}}>Our Values</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"24px"}}>
          {VALUES.map(v=>(
            <div key={v.title} style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:"16px",padding:"28px"}}>
              <div style={{fontSize:"32px",marginBottom:"16px"}}>{v.icon}</div>
              <h3 style={{color:"white",fontSize:"17px",fontWeight:700,marginBottom:"10px"}}>{v.title}</h3>
              <p style={{color:"#6b7fa3",fontSize:"14px",lineHeight:1.7,margin:0}}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Industries */}
      <section style={{padding:"80px 48px",background:"rgba(13,23,48,0.5)"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <h2 style={{fontSize:"clamp(1.5rem,3vw,2.5rem)",fontWeight:900,textAlign:"center",marginBottom:"48px"}}>Industries We Serve</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"20px"}}>
            {INDUSTRIES.map(ind=>(
              <div key={ind.name} style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:"12px",padding:"24px",textAlign:"center"}}>
                <div style={{fontSize:"36px",marginBottom:"12px"}}>{ind.icon}</div>
                <h3 style={{color:"white",fontSize:"15px",fontWeight:700,marginBottom:"8px"}}>{ind.name}</h3>
                <p style={{color:"#6b7fa3",fontSize:"13px",lineHeight:1.6,margin:0}}>{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"80px 48px",textAlign:"center"}}>
        <div style={{maxWidth:"600px",margin:"0 auto"}}>
          <h2 style={{fontSize:"2.5rem",fontWeight:900,marginBottom:"16px"}}>Let's Build Together</h2>
          <p style={{color:"#9ca3af",fontSize:"16px",marginBottom:"32px",lineHeight:1.7}}>Ready to take your business to the next level with technology that actually works?</p>
          <div style={{display:"flex",gap:"16px",justifyContent:"center",flexWrap:"wrap"}}>
            <a href="/contact" style={{background:"#0066ff",color:"white",padding:"16px 36px",borderRadius:"10px",textDecoration:"none",fontSize:"15px",fontWeight:700}}>Contact Us Today</a>
            <a href="/services" style={{border:"1px solid #1a2740",color:"white",padding:"16px 36px",borderRadius:"10px",textDecoration:"none",fontSize:"15px"}}>View Our Services</a>
          </div>
        </div>
      </section>
    </main>
  );
}

