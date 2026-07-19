import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '../services/jobs';
import { applicationService } from '../services/applications';
import {
  Search,
  MapPin,
  DollarSign,
  Bookmark,
  Sparkles,
  Link as LinkIcon,
  Loader2,
  CheckCircle,
} from 'lucide-react';

export function JobDiscovery() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const { data: jobs, isLoading } = useQuery<any[]>({
    queryKey: ['jobs', searchTerm],
    queryFn: async () => {
      const data = searchTerm ? await jobService.search(searchTerm) : await jobService.list();
      return data as any[];
    },
    initialData: [
      { id: '1', title: 'Senior React Developer', companyName: 'Stripe', location: 'San Francisco, CA', salary: '$160k - $210k', matchScore: 94, sourcePortal: 'LinkedIn', url: '#' },
      { id: '2', title: 'Backend Staff Engineer (Python)', companyName: 'OpenAI', location: 'San Francisco, CA', salary: '$220k - $300k', matchScore: 91, sourcePortal: 'Greenhouse', url: '#' },
      { id: '3', title: 'Staff Frontend Engineer', companyName: 'Vercel', location: 'Remote (US)', salary: '$180k - $230k', matchScore: 89, sourcePortal: 'LinkedIn', url: '#' },
      { id: '4', title: 'Backend Software Engineer', companyName: 'Linear', location: 'Remote (Global)', salary: '$140k - $190k', matchScore: 86, sourcePortal: 'Lever', url: '#' },
    ] as any[],
  });

  const bookmarkMutation = useMutation({
    mutationFn: (jobId: string) => applicationService.create({ job_id: jobId }),
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: ['applicationCounts'] });
      setBookmarkedIds((prev) => [...prev, jobId]);
    },
  });

  const handleBookmark = (id: string) => {
    bookmarkMutation.mutate(id);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Search Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-8 shadow-xl">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-violet-500/5 to-transparent blur-xl pointer-events-none"></div>
        <div className="max-w-2xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-white mb-4">Semantic Job Matcher</h2>
          <div className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500"><Search className="w-5 h-5" /></span>
              <input
                type="text"
                placeholder="Search job title or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none text-slate-100 text-sm transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-2 text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mx-auto" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <p className="text-slate-400">No jobs found matching search criteria.</p>
          </div>
        ) : (
          jobs.map((job) => {
            const isBookmarked = bookmarkedIds.includes(job.id);
            // Calculate a mock score if matching is not there
            const score = job.matchScore || 85;
            return (
              <div
                key={job.id}
                className="glass rounded-3xl p-6 shadow-md border border-slate-800/80 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/10">
                        {job.companyName || 'Unknown Company'}
                      </span>
                      <h3 className="text-lg font-bold text-white tracking-tight mt-2">{job.title}</h3>
                    </div>
                    {/* Match Badge */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      {score}% Match
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      {job.location || 'Remote'}
                    </p>
                    {job.salary && (
                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-slate-500" />
                        {job.salary}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-900/60">
                  <button
                    onClick={() => handleBookmark(job.id)}
                    disabled={isBookmarked}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                      isBookmarked
                        ? 'bg-slate-900 text-emerald-400 border border-slate-800'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 hover:scale-[1.01]'
                    }`}
                  >
                    {isBookmarked ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Bookmarked
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4" />
                        Bookmark & Track
                      </>
                    )}
                  </button>
                  <a
                    href={job.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-xl transition-all duration-300"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
