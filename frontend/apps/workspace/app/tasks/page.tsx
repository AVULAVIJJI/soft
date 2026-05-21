'use client';
import { useState, useEffect } from 'react';
import DashboardShell from '../../components/DashboardShell';

export default function WorkspaceTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', due_date: '', assigned_to: '' });
  const [submitting, setSubmitting] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
  const headers: any = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => { fetchTasks(); fetchUsers(); }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/projects/tasks?limit=50`, { headers });
      if (res.ok) { const d = await res.json(); setTasks(d.tasks || d.items || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/api/v1/users/?limit=100`, { headers });
      if (res.ok) { const d = await res.json(); setUsers(d.users || []); }
    } catch (e) {}
  };

  const createTask = async () => {
    if (!form.title) return alert('Title required');
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/v1/projects/tasks`, {
        method: 'POST', headers, body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.detail || 'Failed');
      alert('Task created!');
      setShowForm(false);
      setForm({ title: '', description: '', priority: 'medium', due_date: '', assigned_to: '' });
      fetchTasks();
    } catch (e: any) { alert(e.message); } finally { setSubmitting(false); }
  };

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
  const priorityColors: Record<string, string> = { high: 'bg-red-100 text-red-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-green-100 text-green-700' };
  const statusColors: Record<string, string> = { todo: 'bg-slate-100 text-slate-700', in_progress: 'bg-blue-100 text-blue-700', done: 'bg-green-100 text-green-700' };

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Task Management</h1>
            <p className="text-slate-500 text-sm mt-1">{tasks.length} total tasks</p>
          </div>
          <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
            + Assign Task
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {['all', 'todo', 'in_progress', 'done'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize ${filter === f ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
              {f === 'all' ? 'All' : f.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-500">No tasks found. Click "Assign Task" to create one.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Task', 'Assigned To', 'Priority', 'Due Date', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-900 text-sm">{t.title}</div>
                      {t.description && <div className="text-xs text-slate-400 mt-1">{t.description.slice(0, 60)}...</div>}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{t.assigned_to_name || `User ${t.assigned_to}` || '-'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${priorityColors[t.priority] || 'bg-gray-100 text-gray-700'}`}>{t.priority}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{t.due_date ? new Date(t.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '-'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[t.status] || 'bg-gray-100 text-gray-700'}`}>{(t.status || '').replace('_', ' ')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showForm && (
        <div onClick={() => setShowForm(false)} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl p-8 w-[480px] max-w-[90%]">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Assign New Task</h2>
            <div className="flex flex-col gap-3">
              <input placeholder="Task title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" />
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="input-field" />
              <select value={form.assigned_to} onChange={e => setForm({...form, assigned_to: e.target.value})} className="input-field">
                <option value="">Select Employee</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>)}
              </select>
              <div className="flex gap-3">
                <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="input-field flex-1">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <input type="date" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} className="input-field flex-1" />
              </div>
            </div>
            <div className="flex gap-3 mt-5 justify-end">
              <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button onClick={createTask} disabled={submitting} className="btn-primary">{submitting ? 'Creating...' : 'Create Task'}</button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}