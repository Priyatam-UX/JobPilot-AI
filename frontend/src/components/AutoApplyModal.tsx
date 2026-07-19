import React from 'react';
import { X, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface AutoApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  progressStep: string;
  status: 'idle' | 'in_progress' | 'success' | 'error';
}

export function AutoApplyModal({ isOpen, onClose, jobTitle, progressStep, status }: AutoApplyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-xl">⚡</span> Auto Apply Pipeline
          </h3>
          {status !== 'in_progress' && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center justify-center text-center space-y-6">
          <div className="text-slate-300">
            Applying for <span className="font-semibold text-white">{jobTitle}</span>
          </div>

          {/* Status Icon */}
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-slate-800/50 border border-slate-700">
            {status === 'in_progress' && (
              <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            )}
            {status === 'error' && (
              <AlertCircle className="w-12 h-12 text-red-400" />
            )}
            {status === 'idle' && (
              <span className="text-3xl">🤖</span>
            )}
          </div>

          {/* Progress Message */}
          <div className="space-y-2">
            <p className={`text-lg font-medium ${
              status === 'error' ? 'text-red-400' : 
              status === 'success' ? 'text-emerald-400' : 'text-indigo-300'
            }`}>
              {progressStep || 'Initializing...'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            disabled={status === 'in_progress'}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              status === 'in_progress' 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'
            }`}
          >
            {status === 'success' ? 'Done' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
