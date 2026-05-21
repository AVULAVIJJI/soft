// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Lesson Player Page
// File: frontend/apps/academy/app/lessons/[lessonId]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  video_url: string;
  duration_minutes: number;
  description: string;
  is_completed: boolean;
  content?: string;
  course_id: string;
  course_title: string;
  next_lesson_id?: string;
  prev_lesson_id?: string;
  position: number;
  total_lessons: number;
}

export default function LessonPlayerPage({ params }: { params: { lessonId: string } }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'resources'>('overview');

  useEffect(() => {
    fetchLesson();
  }, [params.lessonId]);

  const fetchLesson = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses/lessons/${params.lessonId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setLesson(data);
        setCompleted(data.is_completed);
      }
    } catch (error) {
      console.error('Failed to load lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async () => {
    if (completed) return;
    try {
      const token = localStorage.getItem('access_token');
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses/lessons/${params.lessonId}/complete`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCompleted(true);
    } catch (error) {
      console.error('Failed to mark complete:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-center">
        <div>
          <p className="text-white text-xl mb-4">Lesson not found</p>
          <Link href="/courses" className="text-blue-400 hover:text-blue-300">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <p className="text-xs text-slate-500">{lesson.course_title}</p>
            <p className="text-sm font-medium text-white">{lesson.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500">
            {lesson.position} / {lesson.total_lessons}
          </span>
          {!completed && (
            <button
              onClick={markComplete}
              className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Mark Complete
            </button>
          )}
          {completed && (
            <div className="flex items-center gap-2 text-green-400 text-xs font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Completed
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Video Player */}
        <div className="flex-1">
          <div className="bg-black aspect-video w-full relative">
            {lesson.video_url ? (
              <iframe
                src={lesson.video_url}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-slate-500">Video content will be available soon</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
            {lesson.prev_lesson_id ? (
              <Link
                href={`/lessons/${lesson.prev_lesson_id}`}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous Lesson
              </Link>
            ) : (
              <div />
            )}
            {lesson.next_lesson_id ? (
              <Link
                href={`/lessons/${lesson.next_lesson_id}`}
                className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors"
              >
                Next Lesson
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <Link
                href={`/courses/${lesson.course_id}`}
                className="text-sm bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition-colors"
              >
                Complete Course
              </Link>
            )}
          </div>

          {/* Tabs */}
          <div className="px-6 pt-6">
            <div className="flex gap-6 border-b border-slate-800 mb-6">
              {(['overview', 'notes', 'resources'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="pb-8">
                <h2 className="text-xl font-bold mb-3">{lesson.title}</h2>
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                  <span>{lesson.duration_minutes} minutes</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{lesson.description}</p>
                {lesson.content && (
                  <div
                    className="mt-6 text-slate-300 leading-relaxed prose prose-invert"
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                  />
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="pb-8">
                <textarea
                  className="w-full h-48 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-300 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Take notes while watching the lesson... Your notes are saved locally."
                  onChange={(e) =>
                    localStorage.setItem(`notes_${params.lessonId}`, e.target.value)
                  }
                  defaultValue={
                    typeof window !== 'undefined'
                      ? localStorage.getItem(`notes_${params.lessonId}`) || ''
                      : ''
                  }
                />
                <p className="text-xs text-slate-600 mt-2">Notes are saved in your browser.</p>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="pb-8">
                <p className="text-slate-500 text-sm">
                  No additional resources available for this lesson.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
