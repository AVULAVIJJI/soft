// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Client Portal Projects Page
// File: frontend/apps/client/app/projects/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  progress_percent: number;
  start_date: string;
  end_date?: string;
  budget: number;
  spent_amount: number;
  currency: string;
}

export default function ClientProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/my-projects`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setProjects(data.items || []);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig: Record<string, { label: string; className: string }> = {
    planning: { label: 'Planning', className: 'bg-purple-100 text-purple-800' },
    active: { label: 'Active', className: 'bg-green-100 text-green-800' },
    on_hold: { label: 'On Hold', className: 'bg-yellow-100 text-yellow-800' },
    completed: { label: 'Completed', className: 'bg-blue-100 text-blue-800' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
  };

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.status === filter);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
            <p className="text-slate-500 text-sm mt-1">Track all your ongoing and completed projects</p>
          </div>
          <Link href="/support" className="text-sm text-blue-600 font-medium hover:text-blue-800">
            Raise Support Ticket
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'planning', 'active', 'on_hold', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
              }`}
            >
              {status === 'all' ? 'All Projects' : status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
            <div className="text-5xl mb-4">📁</div>
            <p className="text-slate-500">No projects found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((project) => {
              const statusInfo = statusConfig[project.status] || {
                label: project.status,
                className: 'bg-gray-100 text-gray-800',
              };
              const budgetUsedPercent = project.budget > 0
                ? Math.round((project.spent_amount / project.budget) * 100)
                : 0;

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{project.name}</h3>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ml-2 flex-shrink-0 ${statusInfo.className}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {project.description && (
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">{project.description}</p>
                  )}

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-slate-500 font-medium">Progress</span>
                      <span className="text-xs font-bold text-slate-700">{project.progress_percent}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${project.progress_percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-slate-500 font-medium">Budget Used</span>
                      <span className="text-xs font-bold text-slate-700">{budgetUsedPercent}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          budgetUsedPercent > 90 ? 'bg-red-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(budgetUsedPercent, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-slate-400">{formatCurrency(project.spent_amount)} spent</span>
                      <span className="text-xs text-slate-400">{formatCurrency(project.budget)} budget</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>
                      Start:{' '}
                      {new Date(project.start_date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    {project.end_date && (
                      <span>
                        End:{' '}
                        {new Date(project.end_date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
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
