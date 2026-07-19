import { useQuery } from '@tanstack/react-query';
import { applicationService } from '../services/applications';
import {
  Trello,
  CheckCircle,
  Clock,
  Award,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  FileText,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { data: counts } = useQuery({
    queryKey: ['applicationCounts'],
    queryFn: applicationService.getStatusCounts,
    initialData: { bookmarked: 2, applying: 1, applied: 4, screening: 1, interview: 2, offer: 1, rejected: 1, withdrawn: 0 },
  });

  const totalApplied = counts.applied + counts.screening + counts.interview + counts.offer + counts.rejected;
  const successRate = totalApplied > 0 ? Math.round((counts.offer / totalApplied) * 100) : 0;
  const interviewRate = totalApplied > 0 ? Math.round((counts.interview / totalApplied) * 100) : 0;

  const stats = [
    { name: 'Active Interviews', value: counts.interview, icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { name: 'Total Applications', value: totalApplied, icon: Trello, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { name: 'Offers Received', value: counts.offer, icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { name: 'Success Rate', value: `${successRate}%`, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  const suggestions = [
    { title: 'Tailor resume for Apple iOS Role', desc: 'Missing core swift UI keywords in your latest resume upload.', action: 'Tailor Now', link: '/resumes' },
    { title: 'Interview prep for Stripe interview', desc: 'STAR generator ready with 5 behavioral stripe-specific questions.', action: 'Prep Interview', link: '/interview' },
    { title: '14 New Match suggestions', desc: 'Semantic search returned 14 matches exceeding your 85% score threshold.', action: 'Explore Jobs', link: '/jobs' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-950 border border-slate-800 p-8 shadow-xl">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-violet-500/5 to-transparent blur-xl pointer-events-none"></div>
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 rounded-full text-xs font-semibold text-indigo-400 border border-indigo-500/20 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            AI Suggestions Active
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">Hello, welcome back!</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Your Copilot has scraped 82 jobs today, updated the keyword models for 3 portals, and matched 4 high-value matches. Ready to apply?
          </p>
          <div className="flex gap-4">
            <Link
              to="/jobs"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/10 transition-all duration-300 flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Discover Matches
            </Link>
            <Link
              to="/resumes"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Optimize Resume
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass rounded-2xl p-6 shadow-md transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.name}</span>
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-white">{stat.value}</h3>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                Updated just now
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Suggestions & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Copilot Suggestions Panel */}
        <div className="glass rounded-3xl p-6 shadow-md lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Copilot Recommendations
            </h3>
            <span className="text-xs text-slate-500">3 tasks require review</span>
          </div>

          <div className="space-y-4 flex-1">
            {suggestions.map((sug, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-900 hover:border-slate-800 transition-all duration-300 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-white">{sug.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{sug.desc}</p>
                </div>
                <Link
                  to={sug.link}
                  className="shrink-0 flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 py-1.5 px-3 bg-indigo-500/5 hover:bg-indigo-500/10 rounded-lg border border-indigo-500/10 transition-all duration-300"
                >
                  {sug.action}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Card */}
        <div className="glass rounded-3xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-white mb-6">Application Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1.5">
                  <span>Interview Rate</span>
                  <span>{interviewRate}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${interviewRate}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1.5">
                  <span>Offer Rate</span>
                  <span>{successRate}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${successRate}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-900/60 text-center">
            <p className="text-xs text-slate-500">
              Copilot analysis shows tailoring resumes with ATS optimizer increases interviews by <span className="text-indigo-400 font-semibold">27%</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
