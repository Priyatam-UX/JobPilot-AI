import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService, JobResponse } from '../services/jobs';
import { applicationService } from '../services/applications';
import { useWebSocket } from '../context/WebSocketContext';
import { AutoApplyModal } from '../components/AutoApplyModal';
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
  Rocket
} from 'lucide-react';

export function JobDiscovery() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeJob, setActiveJob] = useState<JobResponse | null>(null);
  
  // Auto Apply State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoApplyStatus, setAutoApplyStatus] = useState<'idle' | 'in_progress' | 'success' | 'error'>('idle');
  const [autoApplyStep, setAutoApplyStep] = useState('');
  const { lastMessage } = useWebSocket();

  // Listen to WebSocket events for Auto Apply progress
  useEffect(() => {
    if (lastMessage?.type === 'AUTO_APPLY_PROGRESS' && activeJob?.id === lastMessage.data.job_id) {
      setAutoApplyStep(lastMessage.data.step);
      setAutoApplyStatus(lastMessage.data.status);
    }
  }, [lastMessage, activeJob]);

  // Fetch live jobs from backend (which fetches from Remotive + scores against resume)
  const { data: jobs = [], isLoading, refetch, isRefetching } = useQuery<JobResponse[]>({
    queryKey: ['discoverJobs'],
    queryFn: jobService.discover,
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
      setAutoApplyStep(error.response?.data?.detail || 'Failed to start pipeline');
    }
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

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.company_name && job.company_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time remote software jobs, scored against your active resume.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Search by role or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-11 pr-4 outline-none text-sm text-slate-100 transition-colors shadow-sm"
            />
          </div>
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
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        {/* Jobs List */}
        <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2 pb-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-4" />
              <p className="text-sm">Fetching and scoring live jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No jobs found. Try adjusting your search.
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setActiveJob(job)}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                  activeJob?.id === job.id
                    ? 'bg-indigo-950/20 border-indigo-500/40 shadow-md shadow-indigo-500/5'
                    : 'bg-slate-950/60 border-slate-900 hover:border-slate-800 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
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
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Resume Match
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
              </div>
            ))
          )}
        </div>

        {/* Job Details Panel */}
        <div className="lg:col-span-2 h-full hidden lg:block">
          {activeJob ? (
            <div className="glass rounded-3xl p-8 shadow-md h-full flex flex-col overflow-y-auto animate-fadeIn relative">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-900/60">
                <div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug mb-2">
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
                  <button
                    onClick={handleAutoApply}
                    disabled={autoApplyMutation.isPending}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
                  >
                    <Rocket className="w-4 h-4" />
                    Auto Apply
                  </button>
                  {activeJob.url && (
                    <a
                      href={activeJob.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 transition-all flex items-center gap-2"
                    >
                      Apply <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Match Insights */}
              <div className="mb-8 p-5 rounded-2xl bg-indigo-950/10 border border-indigo-500/20">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4" /> AI Resume Match Analysis
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
            </div>
          ) : (
            <div className="glass rounded-3xl p-8 shadow-md h-full flex flex-col items-center justify-center text-center">
              <Zap className="w-16 h-16 text-slate-800 mb-6" />
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
