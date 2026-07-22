import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../services/api';
import {
  Trello,
  CheckCircle,
  Clock,
  Award,
  ArrowUpRight,
  Sparkles,
  FileText,
  Zap,
  Briefcase,
  Activity,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { TiltCard } from '../components/TiltCard';

interface DashboardSummary {
  applications: Record<string, number>;
  resumes: { total: number };
  jobs: { total: number };
  rates: { interview_rate: number; offer_rate: number };
  recent_activity: Array<{
    id: string;
    type: string;
    status: string;
    company: string;
    role: string;
    timestamp: string;
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  bookmarked: 'text-indigo-400',
  applying: 'text-amber-400',
  applied: 'text-sky-400',
  interview: 'text-purple-400',
  offer: 'text-emerald-400',
  rejected: 'text-red-400',
};

export function Dashboard() {
  // ── Live dashboard data from backend — auto-refresh every 60s ──
  const { data: summary, isLoading } = useQuery<DashboardSummary>({
    queryKey: ['dashboardSummary'],
    queryFn: () => apiRequest<DashboardSummary>('/dashboard/summary'),
    initialData: {
      applications: { total: 0, bookmarked: 0, applying: 0, applied: 0, screening: 0, interview: 0, offer: 0, rejected: 0, withdrawn: 0 },
      resumes: { total: 0 },
      jobs: { total: 0 },
      rates: { interview_rate: 0, offer_rate: 0 },
      recent_activity: [],
    },
  });

  const apps = summary.applications;
  const totalApplied = (apps.applied || 0) + (apps.screening || 0) + (apps.interview || 0) + (apps.offer || 0) + (apps.rejected || 0);
  const interviewRate = summary.rates.interview_rate;
  const offerRate = summary.rates.offer_rate;

  const stats = [
    { name: 'Active Interviews', value: apps.interview || 0, icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { name: 'Total Applied', value: totalApplied, icon: Trello, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { name: 'Offers Received', value: apps.offer || 0, icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { name: 'Resumes Uploaded', value: summary.resumes.total, icon: FileText, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  // Dynamic recommendations based on live data
  const suggestions = [];
  if (summary.resumes.total === 0) {
    suggestions.push({ title: 'Upload Your Resume', desc: 'Upload your resume to unlock ATS scoring, skill extraction, and job matching.', action: 'Upload Now', link: '/resumes' });
  } else {
    suggestions.push({ title: 'Run ATS Analysis', desc: `Your resume is uploaded. Run an ATS check against a job to see your match score and missing keywords.`, action: 'Check ATS', link: '/resumes' });
  }
  if (apps.bookmarked && apps.bookmarked > 0) {
    suggestions.push({ title: `${apps.bookmarked} Job${apps.bookmarked > 1 ? 's' : ''} Bookmarked`, desc: 'You have bookmarked jobs waiting. Move them to "Applying" when ready.', action: 'View Tracker', link: '/tracker' });
  }
  if (totalApplied === 0) {
    suggestions.push({ title: 'Discover Matching Jobs', desc: `${summary.jobs.total} live job opportunities are available. Find roles that match your skills.`, action: 'Explore Jobs', link: '/jobs' });
  }
  if (suggestions.length < 3) {
    suggestions.push({ title: 'Prepare for Interviews', desc: 'Practice behavioral and technical questions with AI-powered STAR method feedback.', action: 'Start Prep', link: '/interview' });
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Banner */}
      <TiltCard variants={itemVariants} className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-950 border border-slate-800 p-8 shadow-xl">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-violet-500/5 to-transparent blur-xl pointer-events-none" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 rounded-full text-xs font-semibold text-indigo-400 border border-indigo-500/20 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {isLoading ? 'Loading your data...' : 'Live WebSocket Connection Active'}
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Welcome back to Jobspilot AI
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {summary.jobs.total > 0
              ? `${summary.jobs.total} live job opportunities available. ${apps.bookmarked || 0} bookmarked, ${totalApplied} applications in progress.`
              : 'Your AI-powered job search copilot is ready. Start by uploading your resume and discovering matching jobs.'}
          </p>
          <div className="flex gap-4">
            <Link to="/jobs" className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/10 transition-all duration-300 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Discover Matches
            </Link>
            <Link to="/resumes" className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Optimize Resume
            </Link>
          </div>
        </div>
      </TiltCard>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <TiltCard variants={itemVariants} key={i} className="glass rounded-2xl p-6 shadow-md transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.name}</span>
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-white">
                {isLoading ? '—' : stat.value}
              </h3>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                Live from database
              </p>
            </TiltCard>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Copilot Suggestions Panel */}
        <TiltCard variants={itemVariants} className="glass rounded-3xl p-6 shadow-md lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Copilot Recommendations
            </h3>
            <span className="text-xs text-slate-500">{suggestions.length} actions available</span>
          </div>

          <div className="space-y-4 flex-1">
            {suggestions.map((sug, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-900 hover:border-slate-800 transition-all duration-300 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-white">{sug.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{sug.desc}</p>
                </div>
                <Link to={sug.link} className="shrink-0 flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 py-1.5 px-3 bg-indigo-500/5 hover:bg-indigo-500/10 rounded-lg border border-indigo-500/10 transition-all duration-300">
                  {sug.action}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          {summary.recent_activity.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-900/60">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5" /> Recent Activity
              </h4>
              <div className="space-y-2">
                {summary.recent_activity.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 text-xs text-slate-400">
                    <Briefcase className="w-3.5 h-3.5 shrink-0 text-slate-600" />
                    <span className="flex-1">
                      <span className="text-white font-medium">{activity.role}</span> at {activity.company}
                    </span>
                    <span className={`capitalize font-semibold ${STATUS_COLORS[activity.status] || 'text-slate-400'}`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TiltCard>

        {/* Analytics Card */}
        <TiltCard variants={itemVariants} className="glass rounded-3xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-white mb-6">Application Metrics</h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1.5">
                  <span>Interview Rate</span>
                  <span>{interviewRate}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${Math.min(interviewRate, 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1.5">
                  <span>Offer Rate</span>
                  <span>{offerRate}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${Math.min(offerRate, 100)}%` }} />
                </div>
              </div>

              {/* Pipeline overview */}
              <div className="pt-2 space-y-2">
                {(['bookmarked','applying','applied','interview','offer','rejected'] as const).map((s) => (
                  apps[s] > 0 && (
                    <div key={s} className="flex justify-between text-xs">
                      <span className={`capitalize ${STATUS_COLORS[s] || 'text-slate-400'}`}>{s}</span>
                      <span className="font-semibold text-slate-300">{apps[s]}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-900/60 text-center">
            <p className="text-xs text-slate-500">
              {totalApplied > 0
                ? `${totalApplied} total applications tracked in your pipeline.`
                : 'Start applying to jobs to see your analytics here.'}
            </p>
          </div>
        </TiltCard>
      </div>
    </motion.div>
  );
}
