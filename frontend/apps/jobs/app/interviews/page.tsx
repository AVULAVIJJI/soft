// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Jobs Portal - Interviews Page
// File: frontend/apps/jobs/app/interviews/page.tsx

'use client';

import { useState, useEffect } from 'react';

interface Interview { id: string; job_title: string; company_name: string; interview_type: string; scheduled_at: string; location?: string; meeting_link?: string; status: string; notes?: string; interviewer_name?: string; }

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => { fetchInterviews(); }, [filter]);

  const fetchInterviews = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/my-interviews?status=${filter}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setInterviews(d.items || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const typeConfig: Record<string, { icon: string; color: string }> = {
    phone_screening: { icon: '📞', color: 'bg-blue-100 text-blue-800' },
    video_call: { icon: '🎥', color: 'bg-purple-100 text-purple-800' },
    technical: { icon: '💻', color: 'bg-green-100 text-green-800' },
    hr_round: { icon: '🤝', color: 'bg-yellow-100 text-yellow-800' },
    final_round: { icon: '⭐', color: 'bg-orange-100 text-orange-800' },
    onsite: { icon: '🏢', color: 'bg-slate-100 text-slate-800' },
  };

  const statusColor: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    rescheduled: 'bg-yellow-100 text-yellow-800',
    no_show: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">My Interviews</h1>

        <div className="flex gap-2 mb-6">
          {['upcoming', 'completed', 'cancelled', 'all'].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === s ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{s}</button>
          ))}
        </div>

        {loading ? (
          <div className="py-16 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : interviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
            <div className="text-5xl mb-4">📅</div>
            <p className="text-slate-600 font-medium mb-1">No {filter} interviews</p>
            <p className="text-slate-400 text-sm">Apply to jobs to schedule interviews.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => {
              const tc = typeConfig[interview.interview_type] || { icon: '🗓', color: 'bg-gray-100 text-gray-700' };
              const interviewDate = new Date(interview.scheduled_at);
              const isUpcoming = interviewDate > new Date();
              const timeUntil = isUpcoming ? Math.round((interviewDate.getTime() - Date.now()) / (1000 * 60 * 60)) : 0;
              return (
                <div key={interview.id} className={`bg-white rounded-2xl border p-6 ${isUpcoming && interview.status === 'scheduled' ? 'border-blue-200' : 'border-slate-100'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl flex-shrink-0">{tc.icon}</div>
                      <div>
                        <h3 className="font-bold text-slate-900">{interview.job_title}</h3>
                        <p className="text-slate-500 text-sm">{interview.company_name}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tc.color}`}>{interview.interview_type?.replace('_', ' ')}</span>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[interview.status]}`}>{interview.status}</span>
                        </div>
                        <div className="mt-3 space-y-1 text-sm text-slate-600">
                          <p>📅 {interviewDate.toLocaleString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                          {isUpcoming && interview.status === 'scheduled' && <p className="text-blue-600 text-xs font-semibold">⏰ In {timeUntil > 24 ? `${Math.round(timeUntil / 24)} days` : `${timeUntil} hours`}</p>}
                          {interview.location && <p>📍 {interview.location}</p>}
                          {interview.interviewer_name && <p>👤 {interview.interviewer_name}</p>}
                          {interview.notes && <p className="text-slate-400 italic mt-1">{interview.notes}</p>}
                        </div>
                      </div>
                    </div>
                    {interview.meeting_link && interview.status === 'scheduled' && (
                      <a href={interview.meeting_link} target="_blank" rel="noopener noreferrer"
                        className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                        Join Meeting
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
