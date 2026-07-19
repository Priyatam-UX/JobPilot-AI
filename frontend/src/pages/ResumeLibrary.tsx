import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeService, ATSCheckResult } from '../services/resumes';
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
  Activity,
  Award,
  AlertCircle,
  XCircle,
  Briefcase
} from 'lucide-react';

export function ResumeLibrary() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeTitle, setResumeTitle] = useState('');
  const [error, setError] = useState('');
  
  const [atsJobDesc, setAtsJobDesc] = useState('');
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [atsResult, setAtsResult] = useState<ATSCheckResult | null>(null);

  const { data: resumes = [], isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: resumeService.list,
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
      setAtsResult(null);
      setActiveResumeId(null);
    },
  });

  const atsMutation = useMutation({
    mutationFn: ({ id, jd }: { id: string; jd: string }) => resumeService.atsCheck(id, jd),
    onSuccess: (data) => setAtsResult(data),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!resumeTitle) setResumeTitle(file.name.replace(/\.[^/.]+$/, ""));
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

  const SCORE_COLOR = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
    return 'text-red-400 border-red-500/20 bg-red-500/10';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Upload & ATS Check Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Container */}
        <div className="glass rounded-3xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-white mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-400" />
              Upload Master Resume
            </h3>

            <form onSubmit={handleUploadSubmit} className="space-y-4 mb-4">
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
                <FileUp className="w-8 h-8 text-indigo-500/80 mb-3 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-sm font-semibold text-white text-center px-4">
                  {selectedFile ? selectedFile.name : 'Select PDF or DOCX file'}
                </p>
              </div>

              {selectedFile && (
                <div className="flex gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Resume Title"
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
          <div className="text-xs text-slate-500 border-t border-slate-900/60 pt-4">
            Upload automatically extracts text, skills, years of experience, and computes a baseline ATS score.
          </div>
        </div>

        {/* ATS Checker Panel */}
        <div className="glass rounded-3xl p-6 shadow-md flex flex-col">
          <h3 className="text-lg font-bold tracking-tight text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            Live ATS Match Check
          </h3>

          <div className="space-y-4 flex-1">
            <select
              value={activeResumeId || ''}
              onChange={(e) => { setActiveResumeId(e.target.value); setAtsResult(null); }}
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl focus:border-indigo-500 outline-none text-slate-100 text-sm"
            >
              <option value="" disabled>Select a resume to check...</option>
              {resumes.map(r => (
                <option key={r.id} value={r.id}>{r.title}</option>
              ))}
            </select>

            <textarea
              rows={4}
              placeholder="Paste Job Description here to calculate keyword match and ATS score..."
              value={atsJobDesc}
              onChange={(e) => setAtsJobDesc(e.target.value)}
              className="w-full p-4 bg-slate-950/60 border border-slate-800 rounded-xl focus:border-indigo-500 outline-none text-slate-100 text-sm transition-all resize-none"
            />

            <button
              onClick={() => activeResumeId && atsMutation.mutate({ id: activeResumeId, jd: atsJobDesc })}
              disabled={atsMutation.isPending || !activeResumeId || !atsJobDesc.trim()}
              className="w-full py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {atsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Run ATS Analysis
            </button>
          </div>
        </div>
      </div>

      {/* ATS Results View */}
      {atsResult && (
        <div className="glass rounded-3xl p-6 shadow-md border border-indigo-500/20 bg-indigo-950/10 animate-fadeIn space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-indigo-500/10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" /> ATS Match Report
            </h3>
            <div className={`px-4 py-1.5 rounded-full border flex items-center gap-2 font-bold ${SCORE_COLOR(atsResult.overall_score)}`}>
              Score: {atsResult.overall_score}/100 (Grade {atsResult.grade})
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 col-span-2">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Top Suggestions</h4>
                <ul className="space-y-2">
                  {atsResult.suggestions.map((sug, i) => (
                    <li key={i} className="flex gap-2 text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      {sug}
                    </li>
                  ))}
                </ul>
              </div>

              {atsResult.missing_keywords.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" /> Missing Job Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {atsResult.missing_keywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded border border-red-500/20 bg-red-500/10 text-red-300 text-[10px] capitalize">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {atsResult.matched_keywords.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Matched Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {atsResult.matched_keywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 text-[10px] capitalize">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 border-l border-slate-900/60 pl-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Metrics Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Keyword Match</span>
                  <span className="font-semibold text-slate-200">{atsResult.keyword_match_score}%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Section Completeness</span>
                  <span className="font-semibold text-slate-200">{atsResult.section_score}%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Action Verbs</span>
                  <span className="font-semibold text-slate-200">{atsResult.action_verb_score}%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Quantification</span>
                  <span className="font-semibold text-slate-200">{atsResult.quantification_score}%</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-900/60">
                  <span className="text-slate-400">Word Count</span>
                  <span className={`font-semibold ${atsResult.word_count < 400 || atsResult.word_count > 800 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {atsResult.word_count}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resumes List */}
      <div className="glass rounded-3xl p-6 shadow-md">
        <h3 className="text-lg font-bold tracking-tight text-white mb-6 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          Master Resumes ({resumes.length})
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-950/30">
            <FileText className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No resumes uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-900 hover:border-slate-800 transition-all duration-300 flex flex-col md:flex-row justify-between items-start gap-4"
              >
                <div className="flex gap-4 w-full">
                  <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 h-min">
                    <FileText className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="text-md font-semibold text-white">{resume.title}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Uploaded {new Date(resume.created_at).toLocaleDateString()}
                        {resume.experience_years !== undefined && resume.experience_years > 0 && (
                          <>
                            <span className="text-slate-700 mx-1">•</span>
                            <Briefcase className="w-3.5 h-3.5" />
                            {resume.experience_years} years exp
                          </>
                        )}
                        {resume.word_count !== undefined && (
                          <>
                            <span className="text-slate-700 mx-1">•</span>
                            {resume.word_count} words
                          </>
                        )}
                      </p>
                    </div>

                    {resume.all_skills_flat && resume.all_skills_flat.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {resume.all_skills_flat.slice(0, 8).map((skill, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                            {skill}
                          </span>
                        ))}
                        {resume.all_skills_flat.length > 8 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/50 border border-slate-800/50 text-slate-500">
                            +{resume.all_skills_flat.length - 8} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto h-full gap-2">
                  {resume.ats_score !== undefined && resume.ats_score > 0 ? (
                    <div className={`px-3 py-1.5 rounded-lg border flex flex-col items-center ${SCORE_COLOR(resume.ats_score)}`}>
                      <span className="text-[10px] uppercase font-bold tracking-wider">Baseline ATS</span>
                      <span className="text-lg font-black">{resume.ats_score}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveResumeId(resume.id)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs border border-slate-800 transition-colors"
                    >
                      Run ATS Check
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded-xl transition-all duration-300"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
