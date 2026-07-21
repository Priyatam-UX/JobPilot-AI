import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService, JobResponse } from '../services/jobs';
import { applicationService } from '../services/applications';
import { useWebSocket } from '../context/WebSocketContext';
import { AutoApplyModal } from '../components/AutoApplyModal';
import { interviewService, GeneratedQuestion } from '../services/interview';
import { motion } from 'framer-motion';
import { TiltCard } from '../components/TiltCard';
import {
  Search,
  Filter,
  Bookmark,
  ExternalLink,
  MapPin,
  DollarSign,
  Sparkles,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Rocket,
  ArrowLeft,
  BrainCircuit,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

export function JobDiscovery() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [apiSearchQuery, setApiSearchQuery] = useState('');
  const [activeJob, setActiveJob] = useState<JobResponse | null>(null);
  
  // Auto Apply State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoApplyStatus, setAutoApplyStatus] = useState<'idle' | 'in_progress' | 'success' | 'error'>('idle');
  const [autoApplyStep, setAutoApplyStep] = useState('');
  const [autoApplyJobId, setAutoApplyJobId] = useState<string | null>(null);
  const { lastMessage, isConnected } = useWebSocket();

  // Listen to WebSocket events for Auto Apply progress
  useEffect(() => {
    if (lastMessage?.type === 'AUTO_APPLY_PROGRESS' && autoApplyJobId === lastMessage.data.job_id) {
      setAutoApplyStep(lastMessage.data.step);
      setAutoApplyStatus(lastMessage.data.status);
    }
  }, [lastMessage, autoApplyJobId]);

  // Keep activeJob in sync with updated query data (for real-time application_status updates)
  useEffect(() => {
    if (activeJob && jobs.length > 0) {
      const updatedJob = jobs.find((j) => j.id === activeJob.id);
      if (updatedJob && JSON.stringify(updatedJob) !== JSON.stringify(activeJob)) {
        setActiveJob(updatedJob);
      }
    }
  }, [jobs, activeJob]);

  // Fetch live jobs from backend (which fetches from Remotive + scores against resume)
  const { data: jobs = [], isLoading, isError, error, refetch, isRefetching } = useQuery<JobResponse[]>({
    queryKey: ['discoverJobs', apiSearchQuery],
    queryFn: () => jobService.discover(apiSearchQuery),
    refetchOnWindowFocus: false, // Don't spam the API
  });

  const saveJobMutation = useMutation({
    mutationFn: (job: JobResponse) => jobService.create(job),
  });

  const bookmarkMutation = useMutation({
    mutationFn: async (job: JobResponse) => {
      // 1. Ensure job exists in DB
      const savedJob = await saveJobMutation.mutateAsync(job);
      // 2. Create bookmark application
      return applicationService.create({
        job_id: savedJob.id,
        status: 'bookmarked',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['applicationCounts'] });
    },
  });

  const autoApplyMutation = useMutation({
    mutationFn: async (job: JobResponse) => {
      // 1. Ensure job exists in DB
      const savedJob = await saveJobMutation.mutateAsync(job);
      
      // Set the true DB UUID for WebSocket tracking
      setAutoApplyJobId(savedJob.id);
      
      // 2. Trigger the pipeline
      return applicationService.automate({
        job_id: savedJob.id,
        job_url: job.url || '',
        job_description: job.description || '',
      });
    },
    onSuccess: () => {
      // Modal handles the live WS updates
    },
    onError: (error: any) => {
      setAutoApplyStatus('error');
      const errorMessage = error?.message || String(error);
      if (errorMessage.includes('Failed to fetch')) {
        setAutoApplyStep('Network Error: Could not connect to backend. Are you sure the backend is running?');
      } else {
        setAutoApplyStep(errorMessage);
      }
    }
  });

  const generateQuestionsMutation = useMutation({
    mutationFn: (job: JobResponse) => interviewService.generateQuestions(job.description || ''),
  });

  const handleBookmark = (e: React.MouseEvent, job: JobResponse) => {
    e.stopPropagation();
    bookmarkMutation.mutate(job);
  };
  
  const handleAutoApply = () => {
    if (!activeJob) return;
    setIsModalOpen(true);
    setAutoApplyStatus('in_progress');
    setAutoApplyStep('Initializing Auto Apply pipeline...');
    autoApplyMutation.mutate(activeJob);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setApiSearchQuery(searchQuery);
  };

  return (
    <div className="h-full flex flex-col min-h-0 animate-fadeIn relative space-y-6">
      <AutoApplyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobTitle={activeJob?.title || ''}
        progressStep={autoApplyStep}
        status={autoApplyStatus}
      />

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Zap className="w-6 h-6 text-indigo-400" /> Live Job Discovery
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              isConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse'
            }`}>
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time remote software jobs, scored against your active resume.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative flex-1 md:w-80 group">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Search global jobs (e.g. Data Scientist)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-11 pr-4 outline-none text-sm text-slate-100 transition-colors shadow-sm"
            />
          </form>
          <button className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 rounded-xl text-slate-300 transition-all shadow-sm">
            <Filter className="w-4 h-4" />
          </button>
          <button 
            onClick={() => refetch()}
            disabled={isRefetching}
            className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 rounded-xl text-indigo-400 transition-all shadow-sm flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0 relative">
        {/* Jobs List (Hidden on mobile if a job is selected) */}
        <div className={`lg:col-span-1 space-y-4 overflow-y-auto pr-2 pb-4 ${activeJob ? 'hidden lg:block' : 'block'}`}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-4" />
              <p className="text-sm">Fetching and scoring live jobs...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4 bg-red-950/10 rounded-2xl border border-red-900/20">
              <AlertCircle className="w-10 h-10 text-red-500/80 mb-4" />
              <h3 className="text-red-400 font-bold mb-2">Failed to load jobs</h3>
              <p className="text-red-300/80 text-sm mb-4 max-w-xs">{error instanceof Error ? error.message : 'An unexpected error occurred.'}</p>
              <button 
                onClick={() => refetch()}
                className="px-4 py-2 bg-red-900/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No jobs found. Try adjusting your search.
            </div>
          ) : (
            jobs.map((job, index) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
                key={job.id}
                style={{ perspective: 1000 }}
              >
                <TiltCard
                  onClick={() => setActiveJob(job)}
                  className={`p-5 rounded-2xl cursor-pointer border ${
                    activeJob?.id === job.id
                      ? 'border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.15)]'
                      : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm leading-snug truncate pr-2">
                      {job.title}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-400 mt-1">
                      {job.company_name}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleBookmark(e, job)}
                    disabled={bookmarkMutation.isPending}
                    className="p-2 bg-slate-900 hover:bg-indigo-600 hover:text-white border border-slate-800 hover:border-indigo-500 text-slate-400 rounded-lg transition-all duration-300 shadow-sm shrink-0 disabled:opacity-50"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 text-[10px] font-semibold mb-4">
                  {job.location && (
                    <span className="flex items-center gap-1 text-slate-400 bg-slate-900/50 px-2 py-1 rounded-md border border-slate-800">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </span>
                  )}
                  {job.salary && (
                    <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/20 px-2 py-1 rounded-md border border-emerald-900/30">
                      <DollarSign className="w-3 h-3" />
                      {job.salary}
                    </span>
                  )}
                </div>

                {/* Match Score Bar */}
                <div className="mt-4 pt-4 border-t border-slate-800/50">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Semantic Match
                    </span>
                    <span className={job.match_score && job.match_score >= 80 ? 'text-emerald-400' : 'text-amber-400'}>
                      {job.match_score || 0}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        job.match_score && job.match_score >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${job.match_score || 0}%` }}
                    />
                  </div>
                </div>
              </TiltCard>
            </motion.div>
            ))
          )}
        </div>

        {/* Job Details Panel */}
        <div className={`lg:col-span-2 h-full ${activeJob ? 'block' : 'hidden lg:block'}`}>
          {activeJob ? (
            <div className="glass rounded-3xl p-6 lg:p-8 shadow-md h-full flex flex-col overflow-y-auto animate-fadeIn relative">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-900/60 flex-col lg:flex-row gap-4">
                <div>
                  <button 
                    onClick={() => setActiveJob(null)}
                    className="lg:hidden mb-4 flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-semibold"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Jobs
                  </button>
                  <h2 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight leading-snug mb-2">
                    {activeJob.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm font-semibold">
                    <span className="text-indigo-400">{activeJob.company_name}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">{activeJob.location}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={(e) => handleBookmark(e, activeJob)}
                    disabled={bookmarkMutation.isPending}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                  >
                    <Bookmark className="w-4 h-4" />
                    Save
                  </button>
                  {activeJob.application_status === 'applied' ? (
                    <button
                      disabled
                      className="px-4 py-2 bg-slate-800 text-slate-500 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Applied
                    </button>
                  ) : activeJob.application_status === 'applying' ? (
                    <button
                      disabled
                      className="px-4 py-2 bg-slate-800 text-slate-500 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                      Applying...
                    </button>
                  ) : (
                    <button
                      onClick={handleAutoApply}
                      disabled={autoApplyMutation.isPending}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 hover:-translate-y-0.5 animate-pulse-glow"
                    >
                      <Rocket className="w-4 h-4" />
                      Auto Apply
                    </button>
                  )}
                  {activeJob.url && (
                    <a
                      href={activeJob.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-600 to-violet-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 transition-all flex items-center gap-2"
                    >
                      Apply <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Match Insights */}
              <div className="mb-8 p-5 rounded-2xl bg-indigo-950/10 border border-indigo-500/20">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4" /> AI Semantic Match Analysis
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Matched Keywords */}
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Matched Skills
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {activeJob.matched_keywords && activeJob.matched_keywords.length > 0 ? (
                        activeJob.matched_keywords.map((kw, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold capitalize shadow-sm">
                            {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">No matching keywords found.</span>
                      )}
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Missing Skills
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {activeJob.missing_keywords && activeJob.missing_keywords.length > 0 ? (
                        activeJob.missing_keywords.map((kw, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold capitalize shadow-sm">
                            {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">You hit all the keywords!</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Job Description</h3>
                <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">
                  {activeJob.description ? (
                    <div dangerouslySetInnerHTML={{ __html: activeJob.description }} />
                  ) : (
                    <p>No description provided.</p>
                  )}
                </div>
              </div>

              {/* AI Interview Questions Generator */}
              <div className="mt-8 pt-8 border-t border-slate-800/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4 text-indigo-400" /> Interview Questions Prep
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Generate highly tailored questions probing the gaps between your resume and this job.
                    </p>
                  </div>
                  <button
                    onClick={() => generateQuestionsMutation.mutate(activeJob)}
                    disabled={generateQuestionsMutation.isPending}
                    className="px-4 py-2 bg-slate-900 border border-slate-700 hover:border-indigo-500 hover:bg-slate-800 text-indigo-300 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {generateQuestionsMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MessageSquare className="w-4 h-4" />
                    )}
                    {generateQuestionsMutation.data ? 'Regenerate Questions' : 'Generate AI Questions'}
                  </button>
                </div>

                {generateQuestionsMutation.isError && (
                  <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-xl text-red-400 text-sm mb-6">
                    {generateQuestionsMutation.error.message}
                  </div>
                )}

                {generateQuestionsMutation.data?.questions && generateQuestionsMutation.data.questions.length > 0 && (
                  <div className="space-y-4">
                    {generateQuestionsMutation.data.questions.map((q: GeneratedQuestion, i: number) => (
                      <div key={i} className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-1 h-full ${
                          q.category === 'technical' ? 'bg-indigo-500' :
                          q.category === 'behavioral' ? 'bg-emerald-500' :
                          q.category === 'error' ? 'bg-red-500' : 'bg-amber-500'
                        }`} />
                        <div className="flex gap-2 items-start mb-2">
                          <HelpCircle className="w-4 h-4 text-slate-400 mt-0.5" />
                          <h4 className="font-bold text-slate-200 text-sm">{q.question}</h4>
                        </div>
                        <div className="pl-6 text-xs text-slate-400">
                          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] mr-2">Why they'll ask this:</span>
                          {q.reason}
                        </div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="px-2 py-1 bg-slate-800 rounded text-[10px] uppercase font-bold text-slate-400">
                            {q.difficulty}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass rounded-3xl p-8 shadow-md h-full flex flex-col items-center justify-center text-center">
              <Zap className="w-16 h-16 text-slate-800 mb-6 animate-float" />
              <h3 className="text-xl font-bold text-white mb-2">Select a Job</h3>
              <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                Choose a job from the list to view its full description, analyze how well your resume matches the requirements, and identify missing keywords.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
