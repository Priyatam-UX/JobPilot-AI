import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeService } from '../services/resumes';
import {
  Upload,
  FileText,
  Trash2,
  Sparkles,
  Calendar,
  Layers,
  CheckCircle,
  Loader2,
  FileUp,
} from 'lucide-react';

export function ResumeLibrary() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeTitle, setResumeTitle] = useState('');
  const [error, setError] = useState('');

  const { data: resumes } = useQuery({
    queryKey: ['resumes'],
    queryFn: resumeService.list,
    initialData: [],
  });

  const uploadMutation = useMutation({
    mutationFn: ({ title, file }: { title: string; file: File }) => resumeService.upload(title, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      setSelectedFile(null);
      setResumeTitle('');
      setUploading(false);
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to upload resume');
      setUploading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: resumeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Pre-fill title if empty
      if (!resumeTitle) {
        setResumeTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !resumeTitle) return;
    setUploading(true);
    setError('');
    uploadMutation.mutate({ title: resumeTitle, file: selectedFile });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Upper Grid: Upload Box + Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Container */}
        <div className="glass rounded-3xl p-6 shadow-md lg:col-span-2">
          <h3 className="text-lg font-bold tracking-tight text-white mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-400" />
            Upload Master Resume
          </h3>

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-400 rounded-xl text-xs">
                {error}
              </div>
            )}

            <div className="border border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-950/35 hover:bg-slate-950/50 hover:border-slate-700 transition-all duration-300 relative group">
              <input
                type="file"
                required
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileUp className="w-10 h-10 text-indigo-500/80 mb-3 group-hover:scale-110 transition-transform duration-300" />
              <p className="text-sm font-semibold text-white">
                {selectedFile ? selectedFile.name : 'Select PDF or DOCX file'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Drag and drop file here, or browse files</p>
            </div>

            {selectedFile && (
              <div className="flex gap-4">
                <input
                  type="text"
                  required
                  placeholder="Resume Title (e.g. Senior Backend Dev)"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none text-slate-100 text-sm"
                />
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload'}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Guidance Card */}
        <div className="glass rounded-3xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="inline-flex p-2.5 bg-indigo-500/10 rounded-xl mb-4">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-md font-bold tracking-tight text-white mb-2">Resume Optimization</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              When applying to a job, the Copilot creates a version-snapshot of your master resume and injects matched keywords dynamically.
            </p>
          </div>
          <div className="text-xs text-slate-500 mt-4">
            Supports PDF parser via <code>pdfplumber</code> and Word doc parsing.
          </div>
        </div>
      </div>

      {/* Resumes List */}
      <div className="glass rounded-3xl p-6 shadow-md">
        <h3 className="text-lg font-bold tracking-tight text-white mb-6 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          Master Resumes ({resumes.length})
        </h3>

        {resumes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No resumes uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-900 hover:border-slate-800 transition-all duration-300 flex justify-between items-start gap-4"
              >
                <div className="flex gap-4">
                  <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                    <FileText className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1.5">{resume.title}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Uploaded {new Date(resume.created_at).toLocaleDateString()}
                    </p>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" />
                      Version 1 (Active)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(resume.id)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded-xl transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
