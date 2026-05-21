"use client";
import { useState } from "react";

const TABS = ["Overview","Curriculum","Resources","Practice","Interview Prep","Scenarios"];

const CURRICULUM = [
  { section:"Module 1: Foundations", lessons:[
    { id:1, title:"Introduction & Environment Setup", duration:"45 min", type:"video", free:true },
    { id:2, title:"Core Concepts & Architecture", duration:"60 min", type:"video", free:true },
    { id:3, title:"Your First Project", duration:"90 min", type:"hands-on", free:false },
  ]},
  { section:"Module 2: Core Skills", lessons:[
    { id:4, title:"Advanced Patterns", duration:"75 min", type:"video", free:false },
    { id:5, title:"Database Integration", duration:"90 min", type:"video", free:false },
    { id:6, title:"Authentication & Security", duration:"60 min", type:"video", free:false },
    { id:7, title:"Lab: Build a Feature", duration:"120 min", type:"hands-on", free:false },
  ]},
  { section:"Module 3: Real Project", lessons:[
    { id:8, title:"Project Architecture Planning", duration:"45 min", type:"video", free:false },
    { id:9, title:"Building the Backend", duration:"180 min", type:"hands-on", free:false },
    { id:10, title:"Building the Frontend", duration:"180 min", type:"hands-on", free:false },
    { id:11, title:"Deployment & DevOps", duration:"90 min", type:"video", free:false },
    { id:12, title:"Final Project Review & Certificate", duration:"30 min", type:"assessment", free:false },
  ]},
];

const RESOURCES = [
  { title:"Complete Course PDF Notes", type:"pdf", size:"2.4 MB", free:true, icon:"📄" },
  { title:"Module 1 Cheat Sheet", type:"pdf", size:"450 KB", free:true, icon:"📋" },
  { title:"Database Schema Templates", type:"code", size:"85 KB", free:false, icon:"🗄️" },
  { title:"Project Starter Template", type:"code", size:"1.2 MB", free:false, icon:"💻" },
  { title:"API Reference Guide", type:"pdf", size:"890 KB", free:false, icon:"📚" },
  { title:"Deployment Checklist", type:"pdf", size:"320 KB", free:true, icon:"✅" },
];

const PRACTICE_QUESTIONS = [
  {
    category:"Concept", difficulty:"easy", type:"mcq",
    question:"What is the primary purpose of an API in a web application?",
    options:["Style the frontend","Enable communication between frontend and backend","Store data permanently","Manage user authentication only"],
    correct:1,
    explanation:"An API (Application Programming Interface) acts as a bridge enabling the frontend to communicate with the backend, send requests, and receive data in a structured format like JSON.",
  },
  {
    category:"Concept", difficulty:"medium", type:"mcq",
    question:"Which HTTP method is most appropriate for updating a specific resource?",
    options:["GET","POST","PUT/PATCH","DELETE"],
    correct:2,
    explanation:"PUT replaces an entire resource while PATCH partially updates it. Both are used for updates, with PATCH being preferred for partial updates to avoid sending unnecessary data.",
  },
  {
    category:"Coding", difficulty:"medium", type:"coding",
    question:"Write a function that validates an email address using a regular expression.",
    code_template:"def validate_email(email: str) -> bool:\n    # Your code here\n    pass",
    expected_output:"validate_email('test@example.com') -> True\nvalidate_email('invalid-email') -> False",
    explanation:"Use re.match() with pattern r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' to validate emails.",
  },
  {
    category:"Scenario", difficulty:"hard", type:"scenario",
    question:"A hospital management system has 10,000 patient records. The search by name takes 8 seconds. How would you optimize this?",
    context:"Real-world scenario at a busy hospital clinic",
    options:["Add an index on the name column","Cache results in Redis","Both indexing and caching","Upgrade the server"],
    correct:2,
    explanation:"Database indexing dramatically reduces search time for frequent queries. Redis caching stores results of common searches in memory (very fast). Combined, search time drops from 8 seconds to under 100ms.",
    real_world:"At a real hospital with 50,000 patients, Softmaster implemented both techniques and reduced patient lookup time from 12 seconds to 80ms.",
  },
];

const INTERVIEW_PREP = [
  {
    category:"Technical",
    title:"REST API Design Questions",
    questions:[
      "Explain the difference between PUT and PATCH HTTP methods.",
      "What are HTTP status codes 200, 201, 400, 401, 403, 404, 500? When is each used?",
      "How do you handle authentication in a REST API? Compare JWT vs session-based auth.",
      "What is CORS and how do you configure it securely?",
      "Explain database indexing and when you would and would not use it.",
      "How do you handle database transactions to ensure data consistency?",
    ],
    tips:"Focus on real examples from projects. Mention trade-offs in your answers. Companies want to see you understand why, not just what.",
  },
  {
    category:"System Design",
    title:"Architecture & Scalability",
    questions:[
      "How would you design a URL shortener like bit.ly?",
      "Design a notification system that sends 1 million emails per day.",
      "How do you ensure 99.9% uptime for a web application?",
      "Explain horizontal vs vertical scaling with real examples.",
      "How would you handle 100,000 concurrent users on your API?",
    ],
    tips:"Draw diagrams when explaining. Talk through your thought process aloud. Start simple then add complexity.",
  },
  {
    category:"HR / Behavioral",
    title:"Behavioral Interview Questions",
    questions:[
      "Tell me about a time you had to debug a critical production issue under pressure.",
      "Describe a project where you had to learn a new technology quickly.",
      "How do you handle disagreements with team members on technical decisions?",
      "Tell me about a time a project failed and what you learned from it.",
      "Why do you want to work in software development?",
    ],
    tips:"Use the STAR method: Situation, Task, Action, Result. Keep answers under 3 minutes. Be honest and show growth mindset.",
  },
];

const SCENARIOS = [
  {
    industry:"Healthcare - Hospital Management",
    title:"Patient Billing System Optimization",
    problem:"The hospital billing department processes 500 invoices daily. Manual data entry causes 15% error rate and takes 3 hours per day.",
    solution:"Build an automated billing system with: (1) Patient-linked invoice generation, (2) Real-time service cost calculation, (3) Insurance claim integration, (4) Email invoice delivery, (5) Payment tracking dashboard.",
    tools:"FastAPI, PostgreSQL, React, Brevo Email API, Razorpay",
    code_snippet:`# Auto-generate invoice when treatment is marked complete
@router.post("/treatments/{id}/complete")
async def complete_treatment(id: int, db: Session = Depends(get_db)):
    treatment = db.query(Treatment).filter(Treatment.id == id).first()
    invoice = create_invoice(treatment)
    send_invoice_email(treatment.patient.email, invoice)
    return {"invoice_id": invoice.id, "amount": invoice.total}`,
    learnings:"How to reduce manual work with automation, integrate payment gateways, and send automated emails in a real healthcare context.",
  },
  {
    industry:"Retail - ERP & POS",
    title:"Real-Time Inventory Management",
    problem:"A retail chain with 5 branches has inventory mismatches between stores. Stock-outs happen because managers cannot see inventory in real-time.",
    solution:"Centralized inventory API with: (1) Real-time stock levels per branch, (2) Automatic reorder alerts when stock < threshold, (3) Transfer requests between branches, (4) Sales reconciliation reports.",
    tools:"FastAPI WebSockets, PostgreSQL, Redis, React Dashboard, Celery for background tasks",
    code_snippet:`# WebSocket for real-time inventory updates
@app.websocket("/ws/inventory/{branch_id}")
async def inventory_ws(ws: WebSocket, branch_id: int):
    await manager.connect(ws, branch_id)
    while True:
        stock = get_branch_stock(branch_id)  # Checks Redis cache
        await ws.send_json({"stock": stock, "alerts": get_low_stock(stock)})
        await asyncio.sleep(30)  # Update every 30 seconds`,
    learnings:"WebSockets for real-time data, Redis caching for performance, background tasks for alerts.",
  },
];

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [expandedSection, setExpandedSection] = useState<number|null>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Record<number,number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number,boolean>>({});
  const [expandedInterview, setExpandedInterview] = useState<number|null>(null);

  return (
    <main style={{minHeight:"100vh",background:"#050c1a",color:"white"}}>
      {/* Course Header */}
      <div style={{background:"linear-gradient(135deg,#0d1f4a,#050c1a)",borderBottom:"1px solid #1a2740",padding:"40px 40px 32px"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <div style={{color:"#6b7fa3",fontSize:"13px",marginBottom:"12px"}}>
            <a href="/courses" style={{color:"#60a5fa",textDecoration:"none"}}>Courses</a> / Full Stack Web Development
          </div>
          <h1 style={{fontSize:"clamp(1.5rem,3vw,2.5rem)",fontWeight:900,marginBottom:"16px",lineHeight:1.3}}>
            Full Stack Web Development with React & FastAPI
          </h1>
          <p style={{color:"#9ca3af",fontSize:"15px",maxWidth:"700px",lineHeight:1.7,marginBottom:"24px"}}>
            Build complete, production-ready web applications. Covers React, Next.js, FastAPI, PostgreSQL, Docker, and real-world deployment with industry-standard practices.
          </p>
          <div style={{display:"flex",gap:"24px",flexWrap:"wrap",marginBottom:"24px"}}>
            {[["★ 4.8","Rating"],["342 students","Enrolled"],["80 hours","Content"],["12 lessons","Curriculum"],["Free","Price"]].map(([v,l])=>(
              <div key={l} style={{textAlign:"center"}}>
                <div style={{color:"white",fontWeight:800,fontSize:"16px"}}>{v}</div>
                <div style={{color:"#6b7fa3",fontSize:"11px"}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
            <button style={{background:"#0066ff",color:"white",border:"none",borderRadius:"10px",padding:"14px 32px",fontSize:"15px",fontWeight:700,cursor:"pointer",boxShadow:"0 4px 20px rgba(0,102,255,0.4)"}}>
              Enroll Free — Start Learning
            </button>
            <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
              <span style={{background:"rgba(251,191,36,0.15)",border:"1px solid rgba(251,191,36,0.4)",borderRadius:"20px",padding:"4px 12px",fontSize:"12px",color:"#fbbf24",fontWeight:700}}>🏆 Certificate</span>
              <span style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.3)",borderRadius:"20px",padding:"4px 12px",fontSize:"12px",color:"#4ade80"}}>✓ Interview Prep</span>
              <span style={{background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.3)",borderRadius:"20px",padding:"4px 12px",fontSize:"12px",color:"#a78bfa"}}>✓ Real Scenarios</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:"1100px",margin:"0 auto",padding:"32px 24px"}}>
        {/* Tabs */}
        <div style={{display:"flex",gap:"4px",borderBottom:"1px solid #1a2740",marginBottom:"32px",overflowX:"auto"}}>
          {TABS.map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)}
              style={{padding:"12px 20px",background:"none",border:"none",borderBottom:`2px solid ${activeTab===tab?"#0066ff":"transparent"}`,color:activeTab===tab?"#60a5fa":"#6b7fa3",fontSize:"14px",fontWeight:activeTab===tab?700:500,cursor:"pointer",whiteSpace:"nowrap",marginBottom:"-1px"}}>
              {tab}
            </button>
          ))}
        </div>

        {/* TAB: Overview */}
        {activeTab === "Overview" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:"32px"}}>
            <div>
              <h2 style={{color:"white",fontSize:"20px",fontWeight:700,marginBottom:"16px"}}>What You Will Learn</h2>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"32px"}}>
                {["Build REST APIs with FastAPI and Python","Create dynamic frontends with React & Next.js","Design and query PostgreSQL databases","Implement JWT authentication & authorization","Deploy with Docker & Nginx on a VPS","Write clean, production-ready code","Real-world project: Complete web app","Prepare for technical job interviews"].map(item=>(
                  <div key={item} style={{display:"flex",gap:"10px",alignItems:"flex-start"}}>
                    <span style={{color:"#22c55e",flexShrink:0,fontWeight:700}}>✓</span>
                    <span style={{color:"#9ca3af",fontSize:"14px",lineHeight:1.5}}>{item}</span>
                  </div>
                ))}
              </div>
              <h2 style={{color:"white",fontSize:"20px",fontWeight:700,marginBottom:"16px"}}>Requirements</h2>
              <ul style={{color:"#9ca3af",fontSize:"14px",paddingLeft:"20px",lineHeight:2}}>
                <li>Basic understanding of HTML and CSS</li>
                <li>Any prior programming experience (any language)</li>
                <li>Computer with at least 4GB RAM and internet connection</li>
              </ul>
            </div>
            <div style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:"12px",padding:"24px",height:"fit-content"}}>
              <div style={{fontSize:"28px",fontWeight:900,color:"#22c55e",marginBottom:"4px"}}>FREE</div>
              <div style={{color:"#6b7fa3",fontSize:"13px",marginBottom:"20px"}}>Full access included</div>
              <button style={{width:"100%",background:"#0066ff",color:"white",border:"none",borderRadius:"8px",padding:"14px",fontSize:"15px",fontWeight:700,cursor:"pointer",marginBottom:"12px"}}>
                Enroll Now — Free
              </button>
              <div style={{borderTop:"1px solid #1a2740",paddingTop:"16px",marginTop:"8px"}}>
                {[["⏱","80 hours of content"],["📹","12 video lessons"],["📄","PDF notes & cheat sheets"],["💻","6 hands-on projects"],["🏆","Completion certificate"],["🔒","Lifetime access"],["📱","Mobile friendly"]].map(([icon,text])=>(
                  <div key={text} style={{display:"flex",gap:"10px",marginBottom:"10px",alignItems:"center"}}>
                    <span style={{fontSize:"16px"}}>{icon}</span>
                    <span style={{color:"#9ca3af",fontSize:"13px"}}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Curriculum */}
        {activeTab === "Curriculum" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px"}}>
              <h2 style={{color:"white",fontSize:"20px",fontWeight:700}}>Course Curriculum</h2>
              <span style={{color:"#6b7fa3",fontSize:"14px"}}>12 lessons · 80 hours total</span>
            </div>
            {CURRICULUM.map((sec,si)=>(
              <div key={si} style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:"12px",marginBottom:"12px",overflow:"hidden"}}>
                <button onClick={()=>setExpandedSection(expandedSection===si?null:si)}
                  style={{width:"100%",background:"none",border:"none",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",color:"white"}}>
                  <span style={{fontWeight:700,fontSize:"15px"}}>{sec.section}</span>
                  <span style={{color:"#6b7fa3",fontSize:"13px"}}>{expandedSection===si?"▲":"▼"} {sec.lessons.length} lessons</span>
                </button>
                {expandedSection === si && (
                  <div style={{borderTop:"1px solid #1a2740"}}>
                    {sec.lessons.map(lesson=>(
                      <div key={lesson.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",borderBottom:"1px solid #1a2740",gap:"12px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                          <span style={{fontSize:"16px"}}>{lesson.type==="video"?"▶":lesson.type==="hands-on"?"🛠":"📝"}</span>
                          <span style={{color:lesson.free?"#60a5fa":"#9ca3af",fontSize:"14px"}}>{lesson.title}</span>
                          {lesson.free && <span style={{background:"rgba(34,197,94,0.1)",color:"#4ade80",fontSize:"11px",padding:"2px 8px",borderRadius:"4px",fontWeight:600}}>FREE</span>}
                        </div>
                        <span style={{color:"#6b7fa3",fontSize:"13px",flexShrink:0}}>{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB: Resources */}
        {activeTab === "Resources" && (
          <div>
            <div style={{marginBottom:"24px"}}>
              <h2 style={{color:"white",fontSize:"20px",fontWeight:700,marginBottom:"8px"}}>Course Resources</h2>
              <p style={{color:"#6b7fa3",fontSize:"14px"}}>Download PDF notes, cheat sheets, code templates, and reference guides.</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"16px"}}>
              {RESOURCES.map((res,i)=>(
                <div key={i} style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:"12px",padding:"20px",display:"flex",gap:"16px",alignItems:"flex-start"}}>
                  <div style={{fontSize:"28px",flexShrink:0}}>{res.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{color:"white",fontSize:"14px",fontWeight:600,marginBottom:"4px"}}>{res.title}</div>
                    <div style={{color:"#6b7fa3",fontSize:"12px",marginBottom:"12px"}}>{res.type.toUpperCase()} · {res.size}</div>
                    {res.free ? (
                      <button style={{background:"#0066ff",color:"white",border:"none",borderRadius:"6px",padding:"6px 14px",fontSize:"12px",fontWeight:700,cursor:"pointer"}}>Download Free</button>
                    ) : (
                      <button style={{background:"none",border:"1px solid #1a2740",color:"#6b7fa3",borderRadius:"6px",padding:"6px 14px",fontSize:"12px",cursor:"pointer"}}>🔒 Enroll to Download</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: Practice Questions */}
        {activeTab === "Practice" && (
          <div>
            <div style={{marginBottom:"24px"}}>
              <h2 style={{color:"white",fontSize:"20px",fontWeight:700,marginBottom:"8px"}}>Practice Questions</h2>
              <p style={{color:"#6b7fa3",fontSize:"14px"}}>MCQ, coding challenges, and real-world scenario questions to test your understanding.</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
              {PRACTICE_QUESTIONS.map((q,qi)=>(
                <div key={qi} style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:"12px",padding:"24px"}}>
                  <div style={{display:"flex",gap:"8px",marginBottom:"16px",flexWrap:"wrap"}}>
                    <span style={{background:"rgba(0,102,255,0.15)",color:"#60a5fa",padding:"4px 10px",borderRadius:"4px",fontSize:"12px",fontWeight:600}}>{q.category}</span>
                    <span style={{background:q.difficulty==="easy"?"rgba(34,197,94,0.1)":q.difficulty==="hard"?"rgba(239,68,68,0.1)":"rgba(245,158,11,0.1)",color:q.difficulty==="easy"?"#4ade80":q.difficulty==="hard"?"#f87171":"#fbbf24",padding:"4px 10px",borderRadius:"4px",fontSize:"12px",fontWeight:600}}>
                      {q.difficulty.toUpperCase()}
                    </span>
                    <span style={{background:"rgba(167,139,250,0.1)",color:"#a78bfa",padding:"4px 10px",borderRadius:"4px",fontSize:"12px"}}>{q.type}</span>
                  </div>

                  <p style={{color:"white",fontSize:"15px",fontWeight:600,marginBottom:"16px",lineHeight:1.5}}>{q.question}</p>

                  {q.context && <div style={{background:"rgba(0,102,255,0.08)",border:"1px solid rgba(0,102,255,0.2)",borderRadius:"8px",padding:"12px",marginBottom:"16px",color:"#93c5fd",fontSize:"13px"}}>📍 Context: {q.context}</div>}

                  {q.type === "coding" ? (
                    <div>
                      <div style={{background:"#050c1a",borderRadius:"8px",padding:"16px",fontFamily:"monospace",fontSize:"13px",color:"#a3e635",marginBottom:"12px",whiteSpace:"pre-wrap"}}>{q.code_template}</div>
                      <div style={{color:"#6b7fa3",fontSize:"13px"}}>Expected output:<br/><code style={{color:"#4ade80"}}>{q.expected_output}</code></div>
                    </div>
                  ) : (
                    <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"16px"}}>
                      {q.options?.map((opt,oi)=>(
                        <button key={oi} onClick={()=>setSelectedAnswer({...selectedAnswer,[qi]:oi})}
                          style={{background:selectedAnswer[qi]===oi?(oi===q.correct?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.15)"):"rgba(255,255,255,0.02)",
                            border:`1px solid ${selectedAnswer[qi]===oi?(oi===q.correct?"#22c55e":"#ef4444"):"#1a2740"}`,
                            borderRadius:"8px",padding:"12px 16px",color:selectedAnswer[qi]===oi?(oi===q.correct?"#4ade80":"#f87171"):"#9ca3af",
                            fontSize:"14px",textAlign:"left",cursor:"pointer",transition:"all 0.2s"}}>
                          <strong style={{marginRight:"8px"}}>{String.fromCharCode(65+oi)}.</strong>{opt}
                          {selectedAnswer[qi]!==undefined && oi===q.correct && " ✓"}
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedAnswer[qi] !== undefined && (
                    <button onClick={()=>setShowExplanation({...showExplanation,[qi]:!showExplanation[qi]})}
                      style={{background:"none",border:"1px solid #1a2740",color:"#60a5fa",borderRadius:"6px",padding:"8px 16px",fontSize:"13px",cursor:"pointer",marginBottom:"12px"}}>
                      {showExplanation[qi]?"Hide":"Show"} Explanation
                    </button>
                  )}
                  {showExplanation[qi] && (
                    <div style={{background:"rgba(0,102,255,0.06)",border:"1px solid rgba(0,102,255,0.2)",borderRadius:"8px",padding:"16px"}}>
                      <p style={{color:"#93c5fd",fontSize:"14px",lineHeight:1.7,margin:0}}><strong>Explanation:</strong> {q.explanation}</p>
                      {q.real_world && <p style={{color:"#6b7fa3",fontSize:"13px",marginTop:"10px",borderTop:"1px solid rgba(0,102,255,0.2)",paddingTop:"10px"}}>🏢 <strong>Real world:</strong> {q.real_world}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: Interview Prep */}
        {activeTab === "Interview Prep" && (
          <div>
            <div style={{marginBottom:"24px"}}>
              <h2 style={{color:"white",fontSize:"20px",fontWeight:700,marginBottom:"8px"}}>Interview Preparation Guide</h2>
              <p style={{color:"#6b7fa3",fontSize:"14px"}}>Comprehensive question bank and tips to crack technical and HR interviews at top companies.</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
              {INTERVIEW_PREP.map((section,si)=>(
                <div key={si} style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:"12px",overflow:"hidden"}}>
                  <button onClick={()=>setExpandedInterview(expandedInterview===si?null:si)}
                    style={{width:"100%",background:"none",border:"none",padding:"20px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",color:"white"}}>
                    <div style={{textAlign:"left"}}>
                      <span style={{background:"rgba(0,102,255,0.15)",color:"#60a5fa",padding:"3px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:700,marginRight:"12px"}}>{section.category}</span>
                      <span style={{fontWeight:700,fontSize:"15px"}}>{section.title}</span>
                    </div>
                    <span style={{color:"#6b7fa3",fontSize:"18px"}}>{expandedInterview===si?"▲":"▼"}</span>
                  </button>
                  {expandedInterview === si && (
                    <div style={{borderTop:"1px solid #1a2740",padding:"20px"}}>
                      <div style={{marginBottom:"20px"}}>
                        {section.questions.map((q,qi)=>(
                          <div key={qi} style={{display:"flex",gap:"12px",marginBottom:"12px",alignItems:"flex-start"}}>
                            <span style={{color:"#0066ff",fontWeight:800,fontSize:"14px",flexShrink:0,width:"20px"}}>{qi+1}.</span>
                            <span style={{color:"#e2e8f0",fontSize:"14px",lineHeight:1.6}}>{q}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:"8px",padding:"16px"}}>
                        <span style={{color:"#fbbf24",fontWeight:700,fontSize:"13px"}}>💡 Pro Tip: </span>
                        <span style={{color:"#d1b854",fontSize:"13px",lineHeight:1.7}}>{section.tips}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: Real-World Scenarios */}
        {activeTab === "Scenarios" && (
          <div>
            <div style={{marginBottom:"24px"}}>
              <h2 style={{color:"white",fontSize:"20px",fontWeight:700,marginBottom:"8px"}}>Real-World Industry Scenarios</h2>
              <p style={{color:"#6b7fa3",fontSize:"14px"}}>Based on actual projects delivered by Softmaster Technology Solutions for 1700+ clients across India.</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"24px"}}>
              {SCENARIOS.map((s,si)=>(
                <div key={si} style={{background:"#0d1730",border:"1px solid #1a2740",borderRadius:"16px",padding:"28px"}}>
                  <div style={{display:"flex",gap:"12px",flexWrap:"wrap",marginBottom:"16px",alignItems:"center"}}>
                    <span style={{background:"rgba(0,102,255,0.15)",color:"#60a5fa",padding:"4px 12px",borderRadius:"20px",fontSize:"12px",fontWeight:700}}>🏭 {s.industry}</span>
                  </div>
                  <h3 style={{color:"white",fontSize:"18px",fontWeight:700,marginBottom:"16px"}}>{s.title}</h3>

                  <div style={{marginBottom:"16px"}}>
                    <div style={{color:"#ef4444",fontSize:"13px",fontWeight:700,letterSpacing:"1px",marginBottom:"8px"}}>THE PROBLEM</div>
                    <p style={{color:"#e2e8f0",fontSize:"14px",lineHeight:1.7,margin:0}}>{s.problem}</p>
                  </div>

                  <div style={{marginBottom:"16px"}}>
                    <div style={{color:"#22c55e",fontSize:"13px",fontWeight:700,letterSpacing:"1px",marginBottom:"8px"}}>THE SOLUTION</div>
                    <p style={{color:"#e2e8f0",fontSize:"14px",lineHeight:1.7,margin:0}}>{s.solution}</p>
                  </div>

                  <div style={{background:"#050c1a",borderRadius:"8px",padding:"16px",marginBottom:"16px"}}>
                    <div style={{color:"#6b7fa3",fontSize:"12px",marginBottom:"8px",letterSpacing:"1px"}}>CODE EXAMPLE</div>
                    <pre style={{color:"#a3e635",fontSize:"13px",fontFamily:"monospace",margin:0,overflow:"auto",whiteSpace:"pre-wrap"}}>{s.code_snippet}</pre>
                  </div>

                  <div style={{display:"flex",gap:"16px",flexWrap:"wrap"}}>
                    <div style={{flex:1,minWidth:"200px"}}>
                      <div style={{color:"#6b7fa3",fontSize:"12px",marginBottom:"8px",fontWeight:700}}>TOOLS USED</div>
                      <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                        {s.tools.split(", ").map(tool=>(
                          <span key={tool} style={{background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:"4px",padding:"2px 8px",fontSize:"12px",color:"#a78bfa"}}>{tool}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{flex:1,minWidth:"200px"}}>
                      <div style={{color:"#6b7fa3",fontSize:"12px",marginBottom:"8px",fontWeight:700}}>KEY LEARNINGS</div>
                      <p style={{color:"#9ca3af",fontSize:"13px",lineHeight:1.6,margin:0}}>{s.learnings}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
