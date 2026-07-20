import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeService, ResumeResponse } from '../services/resumes';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Sparkles,
  CheckCircle,
  AlertCircle,
  FileUp,
  Award,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  Briefcase,
  Wand2
} from 'lucide-react';

export function ResumeLibrary() {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeTitle, setResumeTitle] = useState('');
  const [error, setError] = useState('');
  
  // Scanning State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanText, setScanText] = useState('Initializing scan...');
  
  // Result State
  const [activeResume, setActiveResume] = useState<ResumeResponse | null>(null);
  
  // Optimization State
  const [jobDescription, setJobDescription] = useState('');
  const [optimizedData, setOptimizedData] = useState<any>(null);
  
  // UI State
  const [showHistory, setShowHistory] = useState(false);

  const { data: resumes = [] } = useQuery({
    queryKey: ['resumes'],
    queryFn: resumeService.list,
  });

  const uploadMutation = useMutation({
    mutationFn: ({ title, file }: { title: string; file: File }) => resumeService.upload(title, file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      
      setTimeout(async () => {
        try {
          const updatedResume = await resumeService.get(data.id);
          setActiveResume(updatedResume);
        } catch (e) {
          setActiveResume(data); // fallback
        }
        setIsScanning(false);
        setSelectedFile(null);
        setResumeTitle('');
        setOptimizedData(null);
        setJobDescription('');
      }, 4500); 
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to upload resume');
      setIsScanning(false);
    },
  });

  const optimizeMutation = useMutation({
    mutationFn: ({ id, jd }: { id: string, jd: string }) => resumeService.optimize(id, jd),
    onSuccess: (data) => {
      setOptimizedData(data);
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to optimize resume');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: resumeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      if (resumes.length <= 1) setActiveResume(null);
    },
  });

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setResumeTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setResumeTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleScan = () => {
    if (!selectedFile || !resumeTitle) return;
    setIsScanning(true);
    setScanProgress(0);
    setError('');
    
    uploadMutation.mutate({ title: resumeTitle, file: selectedFile });
  };

  const handleOptimize = () => {
    if (!activeResume || !jobDescription) return;
    optimizeMutation.mutate({ id: activeResume.id, jd: jobDescription });
  };

  useEffect(() => {
    if (!isScanning) return;
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        const next = prev + Math.random() * 15;
        if (next > 95) return 95; 
        return next;
      });
    }, 500);

    const textSequence = [
      { t: 0, text: 'Extracting text layer via AI...' },
      { t: 1000, text: 'Mapping semantic experience blocks...' },
      { t: 2000, text: 'Checking for ATS keywords...' },
      { t: 3000, text: 'Calculating baseline score...' },
    ];

    const timeouts = textSequence.map(({ t, text }) => 
      setTimeout(() => setScanText(text), t)
    );

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, [isScanning]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this resume?')) {
      deleteMutation.mutate(id);
    }
  };

  const SCORE_COLOR = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10 shadow-emerald-500/20';
    if (score >= 60) return 'text-amber-400 border-amber-500/20 bg-amber-500/10 shadow-amber-500/20';
    return 'text-red-400 border-red-500/20 bg-red-500/10 shadow-red-500/20';
  };
  
  const RING_COLOR = (score: number) => {
    if (score >= 80) return '#34d399'; 
    if (score >= 60) return '#fbbf24'; 
    return '#f87171'; 
  };

  return (
    <div className="h-full flex flex-col items-center justify-start py-8 px-4 max-w-5xl mx-auto w-full animate-fadeIn relative z-10 space-y-8 overflow-y-auto">
      
      {/* Header */}
      <div className="text-center mb-4 shrink-0">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          Resume Checker & Optimizer
        </h1>
        <p className="text-lg text-indigo-300/80 italic font-medium">
          Upload your resume and let AI tailor it to your dream job.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isScanning && !activeResume && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full glass rounded-3xl p-8 md:p-12 shadow-2xl text-center shrink-0"
          >
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-indigo-500/30 bg-slate-900/50 hover:bg-slate-900/80 hover:border-indigo-500/60 rounded-3xl p-12 transition-all duration-300 relative group cursor-pointer"
            >
              <input
                type="file"
                required
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
              />
              
              <div className="pointer-events-none flex flex-col items-center justify-center">
                <FileUp className="w-20 h-20 text-indigo-500/80 mb-6 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]" />
                
                {selectedFile ? (
                  <div className="space-y-4 w-full max-w-sm pointer-events-auto z-20">
                    <p className="text-xl font-bold text-white">{selectedFile.name}</p>
                    <input
                      type="text"
                      placeholder="Name this resume (e.g. Software Engineer)..."
                      value={resumeTitle}
                      onChange={(e) => setResumeTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl focus:border-indigo-500 outline-none text-white text-center shadow-inner"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleScan(); }}
                      disabled={!resumeTitle}
                      className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all transform hover:-translate-y-1 text-lg disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      Scan & Extract with AI
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-white mb-2">Drag & Drop</p>
                    <p className="text-slate-400">or click to upload PDF/DOCX</p>
                  </>
                )}
              </div>
            </div>

            {error && (
              <p className="text-red-400 mt-4 text-sm bg-red-950/30 py-2 rounded-lg border border-red-500/20">{error}</p>
            )}
          </motion.div>
        )}

        {isScanning && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl glass rounded-3xl p-12 shadow-2xl text-center flex flex-col items-center justify-center min-h-[400px] shrink-0"
          >
            <div className="relative w-40 h-40 mb-8">
              <svg className="animate-spin-slow w-full h-full text-indigo-500/20 absolute inset-0" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" strokeWidth="4" stroke="currentColor" strokeDasharray="60 40" />
              </svg>
              <svg className="animate-spin w-full h-full text-violet-500/40 absolute inset-0 rotate-180" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="35" fill="none" strokeWidth="3" stroke="currentColor" strokeDasharray="30 70" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-indigo-400 animate-pulse-glow" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">{scanText}</h3>
            
            <div className="w-full max-w-md h-2 bg-slate-900 rounded-full mt-6 overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </motion.div>
        )}

        {!isScanning && activeResume && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full glass rounded-3xl p-6 md:p-10 shadow-2xl shrink-0 space-y-10"
          >
            {/* Top Baseline Score Section */}
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-900/60 pb-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                    <Award className="w-8 h-8 text-indigo-400" /> Baseline Scan Results
                  </h2>
                  <p className="text-slate-400 mt-1 font-semibold text-lg">{activeResume.title}</p>
                </div>
                <button
                  onClick={() => { setActiveResume(null); setSelectedFile(null); setOptimizedData(null); }}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm"
                >
                  <RefreshCcw className="w-4 h-4" /> Scan Another
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 flex flex-col items-center justify-center p-6 bg-slate-950/40 rounded-2xl border border-slate-800/60 shadow-inner">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Overall ATS Score</h3>
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-xl">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(30,41,59,0.5)" strokeWidth="8" />
                      <motion.circle 
                        cx="50" cy="50" r="45" fill="none" 
                        stroke={RING_COLOR(activeResume.ats_score || 0)} 
                        strokeWidth="8" 
                        strokeLinecap="round"
                        strokeDasharray="282.7"
                        initial={{ strokeDashoffset: 282.7 }}
                        animate={{ strokeDashoffset: 282.7 - (282.7 * (activeResume.ats_score || 0)) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-black text-white">{activeResume.ats_score || 0}</span>
                      <span className={`text-sm font-bold mt-1 ${
                        (activeResume.ats_score || 0) >= 80 ? 'text-emerald-400' : (activeResume.ats_score || 0) >= 60 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        Grade {activeResume.ats_grade || 'C'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> AI Extraction Success
                    </h3>
                    <div className="space-y-3">
                      {activeResume.experience_years !== undefined && (
                        <div className="flex gap-3 text-slate-300 text-sm">
                          <Briefcase className="w-5 h-5 text-emerald-500/70 shrink-0" />
                          <p>Successfully extracted <strong>{activeResume.experience_years} years</strong> of professional experience using semantic AI parsing.</p>
                        </div>
                      )}
                      {activeResume.all_skills_flat && activeResume.all_skills_flat.length > 0 && (
                        <div className="flex gap-3 text-slate-300 text-sm">
                          <Sparkles className="w-5 h-5 text-emerald-500/70 shrink-0" />
                          <div>
                            <p className="mb-2">Parsed <strong>{activeResume.all_skills_flat.length} industry skills</strong> including:</p>
                            <div className="flex flex-wrap gap-1.5">
                              {activeResume.all_skills_flat.slice(0, 8).map((skill, i) => (
                                <span key={i} className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-300 text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-amber-950/10 border border-amber-500/20 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Areas for Optimization
                    </h3>
                    {activeResume.ats_suggestions && activeResume.ats_suggestions.length > 0 ? (
                      <ul className="space-y-3">
                        {activeResume.ats_suggestions.map((sug, i) => (
                          <li key={i} className="flex gap-3 text-slate-300 text-sm bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-xs font-bold">{i+1}</span>
                            <span className="leading-relaxed">{sug}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-400 text-sm">Your resume structure looks solid.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Optimizer Section */}
            <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <Wand2 className="w-6 h-6 text-indigo-400" /> AI Resume Optimizer
                </h3>
                <p className="text-slate-300 mb-6 max-w-3xl">
                  Paste a target Job Description below. Our AI will semantically analyze the requirements and dynamically rewrite your professional summary and experience bullet points to maximize your ATS match score for this specific role.
                </p>

                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target Job Description here..."
                  className="w-full h-40 px-4 py-3 bg-slate-950/60 border border-slate-700 rounded-xl focus:border-indigo-500 outline-none text-slate-200 shadow-inner resize-none mb-6 font-mono text-sm"
                />

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleOptimize}
                    disabled={!jobDescription || optimizeMutation.isPending}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-2"
                  >
                    {optimizeMutation.isPending ? (
                      <>
                        <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" fill="none" strokeWidth="4" stroke="currentColor" strokeDasharray="40 20" />
                        </svg>
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" /> Rewrite Bullet Points
                      </>
                    )}
                  </button>
                </div>

                {/* Optimized Results Display */}
                {optimizedData && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 pt-8 border-t border-slate-800"
                  >
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Keywords Injected
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {optimizedData.added_keywords?.map((kw: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-emerald-300 text-xs font-semibold">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Optimized Summary</h4>
                        <p className="text-slate-200 text-sm leading-relaxed">{optimizedData.optimized_summary}</p>
                      </div>

                      {optimizedData.optimized_experience?.map((exp: any, i: number) => (
                        <div key={i} className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-white font-bold">{exp.role}</h4>
                              <p className="text-indigo-400 text-sm">{exp.company}</p>
                            </div>
                            <span className="text-slate-500 text-xs font-medium">{exp.duration}</span>
                          </div>
                          <ul className="space-y-2">
                            {exp.bullets.map((bullet: string, j: number) => (
                              <li key={j} className="flex gap-3 text-slate-300 text-sm">
                                <span className="text-indigo-500 mt-1 shrink-0">•</span>
                                <span className="leading-relaxed">{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* History Toggle */}
      {!isScanning && (
        <div className="w-full mt-auto pt-8 shrink-0 pb-12">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="mx-auto flex items-center gap-2 text-slate-400 hover:text-indigo-400 font-semibold transition-colors"
          >
            {showHistory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            {showHistory ? 'Hide Past Scans' : 'View Past Scans'}
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-6"
              >
                <div className="glass rounded-3xl p-6 shadow-md border border-slate-800/50">
                  <h3 className="text-lg font-bold text-white mb-4">Past Resume Scans</h3>
                  {resumes.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4">No past scans found.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {resumes.map(resume => (
                        <div key={resume.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors flex justify-between items-center group cursor-pointer" onClick={() => setActiveResume(resume)}>
                          <div>
                            <p className="text-sm font-bold text-white truncate max-w-[150px]">{resume.title}</p>
                            <p className="text-xs text-slate-500 mt-1">{new Date(resume.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-black px-2 py-1 rounded-md border ${SCORE_COLOR(resume.ats_score || 0)}`}>
                              {resume.ats_score || 0}
                            </span>
                            <button
                              onClick={(e) => handleDelete(e, resume.id)}
                              className="text-slate-600 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
}
