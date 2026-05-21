// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Academy Assignments Page
// File: frontend/apps/academy/app/assignments/page.tsx

'use client';

import { useState, useEffect } from 'react';

interface Assignment { id: string; title: string; description: string; course_name: string; due_date: string; max_marks: number; submitted: boolean; submission_date?: string; marks_obtained?: number; feedback?: string; status: string; }

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [submitUrl, setSubmitUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchAssignments(); }, [filter]);

  const fetchAssignments = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/courses/my-assignments`;
    if (filter !== 'all') url += `?status=${filter}`;
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setAssignments(d.items || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSubmit = async (assignmentId: string) => {
    setSubmitting(true);
    const token = localStorage.getItem('access_token');
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ submission_url: submitUrl }),
      });
      setSuccess('Assignment submitted successfully!');
      setSelected(null);
      setSubmitUrl('');
      fetchAssignments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  };

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date();

  const statusConfig: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    submitted: 'bg-blue-100 text-blue-800',
    graded: 'bg-green-100 text-green-800',
    late: 'bg-red-100 text-red-800',
    overdue: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Assignments</h1>
        {success && <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 mb-5 text-sm">{success}</div>}

        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'submitted', 'graded'].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === s ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{s}</button>
          ))}
        </div>

        {loading ? (
          <div className="py-16 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : assignments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-slate-500">No assignments found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((a) => {
              const overdue = !a.submitted && isOverdue(a.due_date);
              return (
                <div key={a.id} className={`bg-white rounded-2xl border p-6 ${overdue ? 'border-red-200 bg-red-50/30' : 'border-slate-100'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-slate-900">{a.title}</h3>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig[a.status] || 'bg-gray-100 text-gray-700'}`}>{a.status}</span>
                        {overdue && <span className="text-xs font-semibold bg-red-100 text-red-800 px-2.5 py-1 rounded-full">Overdue</span>}
                      </div>
                      <p className="text-sm text-blue-600 mb-2">{a.course_name}</p>
                      <p className="text-sm text-slate-600 leading-relaxed mb-3">{a.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                        <span className={overdue ? 'text-red-500 font-semibold' : ''}>📅 Due: {new Date(a.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        <span>📊 Max Marks: {a.max_marks}</span>
                        {a.marks_obtained !== undefined && <span className="text-green-600 font-semibold">✓ Score: {a.marks_obtained}/{a.max_marks}</span>}
                        {a.submission_date && <span>📤 Submitted: {new Date(a.submission_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>}
                      </div>
                      {a.feedback && <div className="mt-3 bg-green-50 border border-green-100 rounded-xl p-3 text-sm text-green-800"><strong>Feedback:</strong> {a.feedback}</div>}
                    </div>
                    {!a.submitted && (
                      <button onClick={() => setSelected(selected?.id === a.id ? null : a)} className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                        {selected?.id === a.id ? 'Cancel' : 'Submit'}
                      </button>
                    )}
                  </div>

                  {/* Submission Form */}
                  {selected?.id === a.id && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Submission URL *</label>
                      <div className="flex gap-3">
                        <input type="url" value={submitUrl} onChange={(e) => setSubmitUrl(e.target.value)} placeholder="https://github.com/your-repo or Google Drive link"
                          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                        <button onClick={() => handleSubmit(a.id)} disabled={submitting || !submitUrl} className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
                          {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
