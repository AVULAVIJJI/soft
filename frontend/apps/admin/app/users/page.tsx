'use client';
import { useState, useEffect } from 'react';

interface User { id: string; email: string; full_name: string; role: string; is_active: boolean; is_verified: boolean; phone?: string; created_at: string; }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', password: 'Welcome@2024', phone: '', role: 'employee' });
  const [saving, setSaving] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => { fetchUsers(); }, [page, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    let url = `${API}/api/v1/users/?skip=${(page-1)*20}&limit=20`;
    if (roleFilter !== 'all') url += `&role=${roleFilter}`;
    if (search) url += `&search=${search}`;
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setUsers(d.users || []); setTotal(d.total || 0); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const createUser = async () => {
    if (!form.full_name || !form.email) return alert('Name and Email required');
    setSaving(true);
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`${API}/api/v1/users/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.detail || 'Failed');
      alert('User created!');
      setShowModal(false);
      setForm({ full_name: '', email: '', password: 'Welcome@2024', phone: '', role: 'employee' });
      fetchUsers();
    } catch (e: any) { alert(e.message); } finally { setSaving(false); }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    const token = localStorage.getItem('access_token');
    await fetch(`${API}/api/v1/users/${userId}/${currentStatus ? 'deactivate' : 'activate'}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    fetchUsers();
  };

  return (
    <div style={{maxWidth:1200,margin:'0 auto'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <div>
          <h1 style={{fontSize:24,fontWeight:700,color:'white',margin:0}}>User Management</h1>
          <p style={{color:'#94a3b8',fontSize:14,marginTop:4}}>{total} total users across all portals</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{background:'#2563eb',color:'white',padding:'10px 20px',borderRadius:10,border:'none',fontSize:14,fontWeight:600,cursor:'pointer'}}>
          + Add User
        </button>
      </div>

      <div style={{display:'flex',gap:12,marginBottom:24}}>
        <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
          style={{flex:1,padding:'10px 16px',background:'#1e293b',border:'1px solid #334155',borderRadius:10,color:'white',fontSize:14,outline:'none'}} />
        <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          style={{padding:'10px 16px',background:'#1e293b',border:'1px solid #334155',borderRadius:10,color:'white',fontSize:14,outline:'none'}}>
          <option value="all">All Roles</option>
          {['super_admin','admin','hr','trainer','student','employee','client','recruiter'].map(r => (
            <option key={r} value={r}>{r.replace('_',' ').toUpperCase()}</option>
          ))}
        </select>
      </div>

      <div style={{background:'#1e293b',borderRadius:16,border:'1px solid #334155',overflow:'hidden'}}>
        {loading ? (
          <div style={{padding:60,textAlign:'center',color:'#94a3b8'}}>Loading...</div>
        ) : users.length === 0 ? (
          <div style={{padding:60,textAlign:'center',color:'#94a3b8'}}>No users found</div>
        ) : (
          <>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{borderBottom:'1px solid #334155'}}>
                  {['User','Role','Phone','Status','Joined','Actions'].map(h => (
                    <th key={h} style={{padding:'12px 20px',textAlign:'left',fontSize:11,fontWeight:600,color:'#64748b',textTransform:'uppercase',letterSpacing:1}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{borderBottom:'1px solid #293548'}}>
                    <td style={{padding:'12px 20px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#3b82f6,#1d4ed8)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:13,fontWeight:700}}>
                          {(u.full_name || '?').charAt(0)}
                        </div>
                        <div>
                          <div style={{fontWeight:600,color:'white',fontSize:14}}>{u.full_name}</div>
                          <div style={{fontSize:12,color:'#64748b'}}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{padding:'12px 20px'}}>
                      <span style={{fontSize:11,fontWeight:600,padding:'4px 10px',borderRadius:20,background:'rgba(59,130,246,0.15)',color:'#60a5fa'}}>
                        {String(u.role).replace('UserRole.','').replace('_',' ')}
                      </span>
                    </td>
                    <td style={{padding:'12px 20px',fontSize:13,color:'#94a3b8'}}>{u.phone || '-'}</td>
                    <td style={{padding:'12px 20px'}}>
                      <span style={{fontSize:11,fontWeight:600,padding:'4px 10px',borderRadius:20,background:u.is_active?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)',color:u.is_active?'#4ade80':'#f87171'}}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{padding:'12px 20px',fontSize:12,color:'#64748b'}}>{new Date(u.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</td>
                    <td style={{padding:'12px 20px'}}>
                      <button onClick={() => toggleUserStatus(u.id, u.is_active)}
                        style={{fontSize:12,fontWeight:600,padding:'6px 12px',borderRadius:8,border:'none',cursor:'pointer',background:u.is_active?'rgba(239,68,68,0.1)':'rgba(34,197,94,0.1)',color:u.is_active?'#f87171':'#4ade80'}}>
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{padding:'12px 20px',borderTop:'1px solid #334155',display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:13,color:'#64748b'}}>
              <span>Showing {(page-1)*20+1} - {Math.min(page*20, total)} of {total}</span>
              <div style={{display:'flex',gap:8}}>
                <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} style={{padding:'6px 14px',border:'1px solid #334155',borderRadius:8,background:'transparent',color:'#94a3b8',cursor:'pointer',opacity:page===1?0.4:1}}>Prev</button>
                <button onClick={() => setPage(p => p+1)} disabled={page*20>=total} style={{padding:'6px 14px',border:'1px solid #334155',borderRadius:8,background:'transparent',color:'#94a3b8',cursor:'pointer',opacity:page*20>=total?0.4:1}}>Next</button>
              </div>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div onClick={()=>setShowModal(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}}>
          <div onClick={e=>e.stopPropagation()} style={{background:'#1e293b',borderRadius:16,padding:32,width:440,maxWidth:'90%',border:'1px solid #334155'}}>
            <h2 style={{fontSize:18,fontWeight:700,marginBottom:20,color:'white'}}>Add New User</h2>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div>
                <label style={{display:'block',fontSize:12,color:'#94a3b8',marginBottom:4,fontWeight:600}}>Full Name</label>
                <input value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})}
                  style={{width:'100%',padding:'10px 14px',border:'1px solid #334155',borderRadius:8,fontSize:14,color:'white',background:'#0f172a',outline:'none',boxSizing:'border-box'}} />
              </div>
              <div>
                <label style={{display:'block',fontSize:12,color:'#94a3b8',marginBottom:4,fontWeight:600}}>Email</label>
                <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                  style={{width:'100%',padding:'10px 14px',border:'1px solid #334155',borderRadius:8,fontSize:14,color:'white',background:'#0f172a',outline:'none',boxSizing:'border-box'}} />
              </div>
              <div>
                <label style={{display:'block',fontSize:12,color:'#94a3b8',marginBottom:4,fontWeight:600}}>Password</label>
                <input value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
                  style={{width:'100%',padding:'10px 14px',border:'1px solid #334155',borderRadius:8,fontSize:14,color:'white',background:'#0f172a',outline:'none',boxSizing:'border-box'}} />
              </div>
              <div>
                <label style={{display:'block',fontSize:12,color:'#94a3b8',marginBottom:4,fontWeight:600}}>Phone</label>
                <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}
                  style={{width:'100%',padding:'10px 14px',border:'1px solid #334155',borderRadius:8,fontSize:14,color:'white',background:'#0f172a',outline:'none',boxSizing:'border-box'}} />
              </div>
              <div>
                <label style={{display:'block',fontSize:12,color:'#94a3b8',marginBottom:4,fontWeight:600}}>Role</label>
                <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}
                  style={{width:'100%',padding:'10px 14px',border:'1px solid #334155',borderRadius:8,fontSize:14,color:'white',background:'#0f172a',outline:'none',boxSizing:'border-box'}}>
                  {['employee','hr','trainer','student','client','recruiter','admin'].map(r => (
                    <option key={r} value={r}>{r.replace('_',' ').toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{display:'flex',gap:12,marginTop:24,justifyContent:'flex-end'}}>
              <button onClick={()=>setShowModal(false)} style={{padding:'10px 20px',border:'1px solid #334155',borderRadius:8,fontSize:14,cursor:'pointer',color:'#94a3b8',background:'transparent'}}>Cancel</button>
              <button onClick={createUser} disabled={saving} style={{padding:'10px 20px',background:'#2563eb',color:'white',border:'none',borderRadius:8,fontSize:14,fontWeight:600,cursor:'pointer'}}>
                {saving ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}