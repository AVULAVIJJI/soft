// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Client Portal - Meetings Page
// File: frontend/apps/client/app/meetings/page.tsx

'use client';

import { useState, useEffect } from 'react';

interface Meeting { id: string; title: string; description?: string; meeting_date: string; duration_minutes: number; meeting_type: string; status: string; meeting_link?: string; organizer_name: string; agenda?: string; minutes?: string; }

export default function ClientMeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');
  const [selected, setSelected] = useState<Meeting | null>(null);

  useEffect(() => { fetchMeetings(); }, [filter]);

  const fetchMeetings = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clients/my-meetings?status=${filter}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setMeetings(d.items || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const typeConfig: Record<string, string> = {
    project_kickoff: '🚀',
    status_update: '📊',
    review: '🔍',
    demo: '🎯',
    requirement_gathering: '📝',
    support: '🛠',
    billing: '💰',
    other: '📅',
  };

  const statusColor: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    rescheduled: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Meetings</h1>

        <div className="flex gap-2 mb-6">
          {['upcoming', 'completed', 'all'].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === s ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{s}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Meetings List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="py-16 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : meetings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center">
                <div className="text-4xl mb-3">📅</div>
                <p className="text-slate-500">No {filter} meetings scheduled.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {meetings.map((m) => {
                  const meetDate = new Date(m.meeting_date);
                  const isToday = meetDate.toDateString() === new Date().toDateString();
                  return (
                    <div key={m.id} onClick={() => setSelected(m)} className={`bg-white rounded-2xl border p-5 cursor-pointer hover:shadow-md transition-all ${selected?.id === m.id ? 'border-blue-400' : 'border-slate-100'} ${isToday ? 'ring-2 ring-blue-100' : ''}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{typeConfig[m.meeting_type] || '📅'}</span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-slate-900 text-sm">{m.title}</h3>
                              {isToday && <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2 py-0.5 rounded-full">Today</span>}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {meetDate.toLocaleString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              {' '}&bull; {m.duration_minutes} min
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">Organizer: {m.organizer_name}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[m.status]}`}>{m.status}</span>
                          {m.meeting_link && m.status === 'scheduled' && (
                            <a href={m.meeting_link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-700">Join</a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Meeting Detail */}
          <div className="lg:col-span-1">
            {selected ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-5 sticky top-6">
                <h2 className="font-bold text-slate-900 mb-4">{selected.title}</h2>
                <div className="space-y-3 text-sm">
                  <div><span className="text-slate-500">Date & Time</span><p className="font-medium text-slate-800 mt-0.5">{new Date(selected.meeting_date).toLocaleString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p></div>
                  <div><span className="text-slate-500">Duration</span><p className="font-medium text-slate-800 mt-0.5">{selected.duration_minutes} minutes</p></div>
                  <div><span className="text-slate-500">Type</span><p className="font-medium text-slate-800 mt-0.5 capitalize">{selected.meeting_type?.replace('_', ' ')}</p></div>
                  <div><span className="text-slate-500">Organizer</span><p className="font-medium text-slate-800 mt-0.5">{selected.organizer_name}</p></div>
                  {selected.description && <div><span className="text-slate-500">Description</span><p className="text-slate-700 mt-0.5 text-xs leading-relaxed">{selected.description}</p></div>}
                  {selected.agenda && <div><span className="text-slate-500">Agenda</span><p className="text-slate-700 mt-0.5 text-xs leading-relaxed whitespace-pre-line">{selected.agenda}</p></div>}
                  {selected.minutes && <div><span className="text-slate-500">Meeting Minutes</span><p className="text-slate-700 mt-0.5 text-xs leading-relaxed whitespace-pre-line">{selected.minutes}</p></div>}
                  {selected.meeting_link && selected.status === 'scheduled' && (
                    <a href={selected.meeting_link} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors mt-2">Join Meeting</a>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 h-40 flex items-center justify-center text-slate-400 text-sm">
                Click a meeting to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
