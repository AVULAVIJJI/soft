// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Jobs Apply Page
// File: frontend/apps/jobs/app/apply/[jobId]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Job { id: string; title: string; company_name: string; location: string; job_type: string; experience_min: number; experience_max: number; salary_min?: number; salary_max?: number; description: string; requirements: string[]; skills_required: string[]; application_deadline?: string; }

export default function ApplyJobPage({ params }: { params: { jobId: string } }) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ cover_letter: '', resume_url: '' });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${params.jobId}`)
      .then((r) => r.json())
      .then((d) => { setJob(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    const token = localStorage.getItem('access_token');
    if (!token) { router.push('/login'); return; }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${params.jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || 'Application failed'); }
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!job) return <div className="min-h-screen flex items-center justify-center text-slate-500">Job not found. <Link href="/browse" className="ml-2 text-blue-600">Browse Jobs</Link></div>;

  if (success) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-10 text-center max-w-md w-full shadow-sm border border-slate-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
        <p className="text-slate-600 mb-6">Your application for <strong>{job.title}</strong> at <strong>{job.company_name}</strong> has been submitted successfully. You will be notified of any updates.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700">View Dashboard</Link>
          <Link href="/browse" className="border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50">Browse More Jobs</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/browse" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Jobs
        </Link>

        {/* Job Summary */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
          <h1 className="text-xl font-bold text-slate-900">{job.title}</h1>
          <p className="text-slate-500 mt-1">{job.company_name} &bull; {job.location}</p>
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium capitalize">{job.job_type?.replace('_', ' ')}</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">{job.experience_min}-{job.experience_max} yrs exp</span>
            {job.salary_min && job.salary_max && <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">{job.salary_min/100000}-{job.salary_max/100000} INR</span>}
          </div>
          {job.skills_required?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {job.skills_required.map((s) => <span key={s} className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg">{s}</span>)}
            </div>
          )}
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 text-lg mb-5">Submit Application</h2>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Resume URL *</label>
              <input type="url" value={form.resume_url} onChange={(e) => setForm((p) => ({ ...p, resume_url: e.target.value }))} required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="https://drive.google.com/your-resume or hosted resume URL" />
              <p className="text-xs text-slate-400 mt-1.5">Upload your resume to Google Drive, Dropbox or any host and paste the link here.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Cover Letter</label>
              <textarea value={form.cover_letter} onChange={(e) => setForm((p) => ({ ...p, cover_letter: e.target.value }))} rows={6}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                placeholder={`Dear Hiring Manager,\n\nI am excited to apply for the ${job.title} position at ${job.company_name}...`} />
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors">
              {submitting ? 'Submitting Application...' : 'Submit Application'}
            </button>
            <p className="text-xs text-slate-400 text-center">By applying, you agree to our terms. Your information will be shared with {job.company_name}.</p>
          </form>
        </div>
      </div>
    </div>
  );
}
