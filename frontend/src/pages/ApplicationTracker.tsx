import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '../services/applications';
import { X } from 'lucide-react';

interface KanbanColumn {
  id: string;
  name: string;
  color: string;
  bg: string;
}

export function ApplicationTracker() {
  const queryClient = useQueryClient();
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [notes, setNotes] = useState('');

  const columns: KanbanColumn[] = [
    { id: 'bookmarked', name: 'Bookmarked', color: 'text-indigo-400 border-indigo-500/20', bg: 'bg-indigo-500/5' },
    { id: 'applying', name: 'Applying', color: 'text-amber-400 border-amber-500/20', bg: 'bg-amber-500/5' },
    { id: 'applied', name: 'Applied', color: 'text-sky-400 border-sky-500/20', bg: 'bg-sky-500/5' },
    { id: 'interview', name: 'Interviews', color: 'text-purple-400 border-purple-500/20', bg: 'bg-purple-500/5' },
    { id: 'offer', name: 'Offers', color: 'text-emerald-400 border-emerald-500/20', bg: 'bg-emerald-500/5' },
    { id: 'rejected', name: 'Rejected', color: 'text-red-400 border-red-500/20', bg: 'bg-red-500/5' },
  ];

  // Fetch list of applications and cast as any[] to handle title/companyName UI fields
  const { data: applications } = useQuery<any[]>({
    queryKey: ['applications'],
    queryFn: async () => {
      const data = await applicationService.list();
      return data as any[];
    },
    initialData: [
      { id: 'app1', job_id: '1', title: 'Senior React Developer', companyName: 'Stripe', status: 'bookmarked', notes: 'Prepare referral' },
      { id: 'app2', job_id: '2', title: 'Backend Staff Engineer (Python)', companyName: 'OpenAI', status: 'interview', notes: 'STAR method coding interview on Friday' },
      { id: 'app3', job_id: '3', title: 'Staff Frontend Engineer', companyName: 'Vercel', status: 'applied', notes: 'Applied via Greenhouse' },
      { id: 'app4', job_id: '4', title: 'Backend Software Engineer', companyName: 'Linear', status: 'offer', notes: 'Offer letter received' },
    ] as any[],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => applicationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['applicationCounts'] });
    },
  });

  // Drag and Drop implementation
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('applicationId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('applicationId');
    if (id) {
      updateMutation.mutate({ id, data: { status: targetStatus } });
    }
  };

  const handleCardClick = (app: any) => {
    setSelectedApp(app);
    setNotes(app.notes || '');
  };

  const handleSaveNotes = () => {
    if (selectedApp) {
      updateMutation.mutate({ id: selectedApp.id, data: { notes } });
      setSelectedApp((prev: any) => ({ ...prev, notes }));
    }
  };

  return (
    <div className="h-full flex flex-col min-h-0 animate-fadeIn">
      {/* Kanban Board Container */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-stretch min-h-0 select-none">
        {columns.map((col) => {
          const colApps = applications.filter((app) => app.status === col.id);
          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="w-72 shrink-0 rounded-2xl border border-slate-900 bg-slate-950/40 p-4 flex flex-col h-full min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-900">
                <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                  {col.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-semibold">
                  {colApps.length}
                </span>
              </div>

              {/* Cards wrapper */}
              <div className="flex-1 space-y-3 overflow-y-auto min-h-0 pr-1">
                {colApps.map((app) => (
                  <div
                    key={app.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, app.id)}
                    onClick={() => handleCardClick(app)}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-900 hover:border-slate-800 hover:bg-slate-900 cursor-grab active:cursor-grabbing transition-all duration-300 shadow-md group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <h4 className="text-xs font-semibold text-indigo-400 tracking-wider uppercase mb-1">
                      {app.companyName || 'Stripe'}
                    </h4>
                    <p className="text-sm font-bold text-white tracking-tight leading-snug group-hover:text-indigo-200 transition-colors duration-300">
                      {app.title}
                    </p>
                    {app.notes && (
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-2.5 bg-slate-950/40 px-2 py-1 rounded">
                        {app.notes}
                      </p>
                    )}
                  </div>
                ))}
                {colApps.length === 0 && (
                  <div className="h-full border border-dashed border-slate-900 rounded-xl flex items-center justify-center py-12 text-xs text-slate-600">
                    Drop cards here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Slide-out Overlay Panel */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg h-full bg-slate-950 border-l border-slate-900 p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-900">
                <h3 className="text-lg font-extrabold text-white">Application Detail</h3>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-xs font-semibold text-indigo-400 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/10">
                    {selectedApp.companyName}
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-white mt-3">
                    {selectedApp.title}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-900">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Status</p>
                    <p className="text-sm text-slate-300 font-medium capitalize">{selectedApp.status}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Active Portal</p>
                    <p className="text-sm text-slate-300 font-medium">LinkedIn</p>
                  </div>
                </div>

                {/* Notes Editor */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Application Notes</label>
                  <textarea
                    rows={6}
                    placeholder="Add follow-up dates, interviewer names, or prep tasks..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none text-slate-100 text-sm transition-all duration-300"
                  />
                  <button
                    onClick={handleSaveNotes}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all duration-300 shadow-md shadow-indigo-600/10"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>

            {/* Slideout footer actions */}
            <div className="pt-6 border-t border-slate-900 mt-8 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2.5 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-semibold transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
