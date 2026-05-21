// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Academy Quizzes Page
// File: frontend/apps/academy/app/quizzes/page.tsx

'use client';

import { useState, useEffect } from 'react';

interface Quiz { id: string; title: string; description?: string; course_name: string; time_limit_minutes: number; total_questions: number; pass_percentage: number; attempts_allowed: number; attempts_used: number; best_score?: number; status: string; }

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState<{ id: string; questions: any[]; } | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizResult, setQuizResult] = useState<{ score: number; pass: boolean; } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchQuizzes(); }, []);

  useEffect(() => {
    if (activeQuiz && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((t) => { if (t <= 1) { submitQuiz(); return 0; } return t - 1; }), 1000);
      return () => clearInterval(timer);
    }
  }, [activeQuiz, timeLeft]);

  const fetchQuizzes = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/my-quizzes`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setQuizzes(d.items || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const startQuiz = async (quizId: string, timeLimitMinutes: number) => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/quizzes/${quizId}/start`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setActiveQuiz({ id: quizId, questions: data.questions || [] });
        setTimeLeft(timeLimitMinutes * 60);
        setAnswers({});
        setQuizResult(null);
      }
    } catch (e) { console.error(e); }
  };

  const submitQuiz = async () => {
    if (!activeQuiz || submitting) return;
    setSubmitting(true);
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/quizzes/${activeQuiz.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ answers }),
      });
      if (res.ok) {
        const result = await res.json();
        setQuizResult(result);
        setActiveQuiz(null);
        fetchQuizzes();
      }
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  };

  const formatTime = (secs: number) => `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;

  if (activeQuiz) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold">Quiz in Progress</h2>
            <div className={`text-2xl font-black ${timeLeft < 120 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{formatTime(timeLeft)}</div>
          </div>
          <div className="space-y-5">
            {activeQuiz.questions.map((q: any, qi: number) => (
              <div key={q.id} className="bg-white rounded-2xl p-6">
                <p className="font-bold text-slate-900 mb-4">Q{qi + 1}. {q.question_text}</p>
                <div className="space-y-2">
                  {q.options.map((opt: string, oi: number) => (
                    <label key={oi} className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer border transition-colors ${answers[q.id] === oi ? 'bg-blue-50 border-blue-400' : 'border-slate-200 hover:border-blue-200'}`}>
                      <input type="radio" name={q.id} checked={answers[q.id] === oi} onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: oi }))} className="text-blue-600" />
                      <span className="text-sm text-slate-800">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3 justify-center">
            <button onClick={submitQuiz} disabled={submitting} className="bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold px-10 py-3.5 rounded-xl text-lg transition-colors">
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Quizzes</h1>

        {quizResult && (
          <div className={`rounded-2xl p-6 mb-6 text-center ${quizResult.pass ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="text-4xl mb-2">{quizResult.pass ? '🎉' : '😔'}</div>
            <h2 className={`text-2xl font-black ${quizResult.pass ? 'text-green-800' : 'text-red-800'}`}>{quizResult.pass ? 'Congratulations! You Passed!' : 'Better luck next time!'}</h2>
            <p className={`text-lg font-bold mt-1 ${quizResult.pass ? 'text-green-600' : 'text-red-600'}`}>Score: {quizResult.score}%</p>
          </div>
        )}

        {loading ? (
          <div className="py-16 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : quizzes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center">
            <div className="text-5xl mb-4">🧠</div>
            <p className="text-slate-500">No quizzes available for your enrolled courses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {quizzes.map((q) => {
              const canAttempt = q.attempts_used < q.attempts_allowed;
              return (
                <div key={q.id} className="bg-white rounded-2xl border border-slate-100 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">{q.course_name}</span>
                    {q.best_score !== undefined && (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${q.best_score >= q.pass_percentage ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        Best: {q.best_score}%
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{q.title}</h3>
                  {q.description && <p className="text-sm text-slate-500 mb-3">{q.description}</p>}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-4">
                    <span>⏱ {q.time_limit_minutes} minutes</span>
                    <span>❓ {q.total_questions} questions</span>
                    <span>✅ Pass: {q.pass_percentage}%</span>
                    <span>🔄 Attempts: {q.attempts_used}/{q.attempts_allowed}</span>
                  </div>
                  <button
                    onClick={() => canAttempt && startQuiz(q.id, q.time_limit_minutes)}
                    disabled={!canAttempt}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors ${canAttempt ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                  >
                    {!canAttempt ? 'No Attempts Remaining' : q.attempts_used > 0 ? 'Retake Quiz' : 'Start Quiz'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
