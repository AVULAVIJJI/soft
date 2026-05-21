// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Client Portal - Files Page
// File: frontend/apps/client/app/files/page.tsx

'use client';

import { useState, useEffect } from 'react';

interface ClientFile { id: string; file_name: string; file_type: string; file_size: number; category: string; description?: string; uploaded_by_name: string; file_url: string; created_at: string; }

export default function ClientFilesPage() {
  const [files, setFiles] = useState<ClientFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => { fetchFiles(); }, [category]);

  const fetchFiles = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/clients/my-files`;
    if (category !== 'all') url += `?category=${category}`;
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setFiles(d.items || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fmtSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const fileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('video')) return '🎬';
    if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) return '📊';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('zip') || type.includes('archive')) return '🗜️';
    return '📁';
  };

  const categories = ['all', 'contract', 'invoice', 'proposal', 'report', 'design', 'source_code', 'documentation', 'other'];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Project Files</h1>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${category === c ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'}`}>
              {c.replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-16 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : files.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
            <div className="text-5xl mb-4">📁</div>
            <p className="text-slate-600 font-medium mb-1">No files found</p>
            <p className="text-slate-400 text-sm">Files shared by the Softmaster team will appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <div className="col-span-5">File Name</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Uploaded By</div>
              <div className="col-span-1">Size</div>
              <div className="col-span-1">Date</div>
              <div className="col-span-1">Download</div>
            </div>
            <div className="divide-y divide-slate-50">
              {files.map((f) => (
                <div key={f.id} className="px-5 py-3.5 grid grid-cols-12 gap-4 items-center hover:bg-slate-50">
                  <div className="col-span-5 flex items-center gap-3">
                    <span className="text-xl flex-shrink-0">{fileIcon(f.file_type)}</span>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 text-sm truncate">{f.file_name}</p>
                      {f.description && <p className="text-xs text-slate-400 truncate">{f.description}</p>}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full capitalize">{f.category?.replace('_', ' ')}</span>
                  </div>
                  <div className="col-span-2 text-sm text-slate-600 truncate">{f.uploaded_by_name}</div>
                  <div className="col-span-1 text-xs text-slate-500">{fmtSize(f.file_size)}</div>
                  <div className="col-span-1 text-xs text-slate-500">{new Date(f.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
                  <div className="col-span-1">
                    <a href={f.file_url} target="_blank" rel="noopener noreferrer" download className="text-blue-600 hover:text-blue-800 text-xs font-semibold">
                      ↓ Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
