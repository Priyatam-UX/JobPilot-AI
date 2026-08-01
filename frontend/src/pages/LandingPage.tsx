import { 
  Search, 
  Bell, 
  Settings, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BarChart3,
  MoreVertical,
  ChevronDown,
  ArrowUpRight
} from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';
import { 
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, 
  PieChart, Pie, Cell, 
  BarChart, Bar, Tooltip
} from 'recharts';

const lineData = [
  { name: 'Jan', applications: 250, hires: 50 },
  { name: 'Feb', applications: 500, hires: 100 },
  { name: 'Mar', applications: 400, hires: 80 },
  { name: 'Apr', applications: 750, hires: 180 },
  { name: 'May', applications: 600, hires: 140 },
  { name: 'Jun', applications: 950, hires: 250 },
  { name: 'Jul', applications: 850, hires: 210 },
];

const pieData = [
  { name: 'LinkedIn', value: 42, color: '#6366f1' },
  { name: 'Direct', value: 28, color: '#3b82f6' },
  { name: 'Agencies', value: 18, color: '#8b5cf6' },
  { name: 'Others', value: 12, color: '#1e293b' },
];

const barData = [
  { name: 'Jan', performance: 15 },
  { name: 'Feb', performance: 20 },
  { name: 'Mar', performance: 10 },
  { name: 'Apr', performance: 25 },
  { name: 'May', performance: 18 },
  { name: 'Jun', performance: 12 },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-slate-200 font-sans relative overflow-hidden flex items-center justify-center selection:bg-indigo-500/30">
      
      {/* Subtle Cosmic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ParticleBackground particleCount={150} speed={0.2} opacity={0.4} />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      {/* Main App Frame (Sleek, Restrained) */}
      <div className="relative z-10 w-[96vw] max-w-[1440px] h-[92vh] min-h-[800px] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-white/[0.08] bg-[#0a0a0a]/85 backdrop-blur-3xl ring-1 ring-white/[0.02]">
        
        {/* Subtle top glare */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-50 pointer-events-none" />

        <div className="flex h-full w-full relative z-10">
          
          {/* Sidebar */}
          <aside className="w-[260px] border-r border-white/[0.06] bg-transparent flex flex-col pt-8 pb-6 px-4">
            <div className="flex items-center gap-3 px-2 mb-10">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-sm shadow-indigo-500/20">
                <div className="w-3 h-3 bg-white rounded-sm" />
              </div>
              <span className="font-semibold text-[13px] tracking-widest text-slate-100 uppercase">Copilot OS</span>
            </div>

            <nav className="space-y-1 mb-10">
              <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.06] text-white font-medium text-[13px] transition-colors border border-white/[0.04]">
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                Dashboard
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] transition-colors font-medium text-[13px]">
                <Users className="w-4 h-4" />
                Candidates
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] transition-colors font-medium text-[13px]">
                <Calendar className="w-4 h-4" />
                Interviews
              </a>
              <a href="#" className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] transition-colors font-medium text-[13px]">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </div>
                <ChevronDown className="w-4 h-4 opacity-50" />
              </a>
            </nav>

            {/* Clean Sidebar Metrics */}
            <div className="space-y-3 flex-1 overflow-y-auto px-1 scrollbar-hide mt-4">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Live Metrics</p>
              
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors group cursor-pointer">
                <p className="text-[11px] text-slate-400 font-medium mb-1">Total Active Jobs</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-semibold text-white tracking-tight">45</p>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>
              
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors group cursor-pointer">
                <p className="text-[11px] text-slate-400 font-medium mb-1">New Applicants</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-semibold text-white tracking-tight">138</p>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors group cursor-pointer">
                <p className="text-[11px] text-slate-400 font-medium mb-1">Avg Time-to-Hire</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-semibold text-white tracking-tight">18d</p>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Dashboard Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#000000]/20">
            
            {/* Header */}
            <header className="h-[72px] border-b border-white/[0.06] flex items-center justify-between px-8 bg-transparent">
              <div className="w-[380px]">
                <div className="relative group">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search candidates or roles..." 
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg py-2 pl-10 pr-4 text-[13px] text-slate-200 focus:outline-none focus:bg-white/[0.05] focus:border-indigo-500/50 transition-all font-medium placeholder:text-slate-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.06]">
                  <Bell className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.06]">
                  <Settings className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-white/10 mx-2" />
                <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                  <div className="text-right hidden sm:block">
                    <p className="text-[12px] font-medium text-slate-200">Alex Chen</p>
                    <p className="text-[10px] text-slate-500">Recruiting Lead</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 overflow-hidden group-hover:border-white/30 transition-colors">
                    <img src="https://i.pravatar.cc/100?img=11" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </header>

            {/* Dashboard Content */}
            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h1 className="text-[22px] font-semibold tracking-tight text-white mb-1">Overview</h1>
                  <p className="text-[13px] text-slate-400">Track your hiring pipeline and recruiter performance.</p>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-lg p-1">
                  <button className="px-3 py-1.5 rounded-md bg-white/[0.08] text-[12px] font-medium text-white shadow-sm border border-white/[0.04]">Year</button>
                  <button className="px-3 py-1.5 rounded-md text-[12px] font-medium text-slate-400 hover:text-slate-200 transition-colors">Month</button>
                  <button className="px-3 py-1.5 rounded-md text-[12px] font-medium text-slate-400 hover:text-slate-200 transition-colors">Week</button>
                </div>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 auto-rows-min pb-8">
                
                {/* Minimal Pipeline Funnel (Spans 2 Rows) */}
                <div className="xl:col-span-1 xl:row-span-2 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-[13px] font-medium text-slate-200">Talent Pipeline</h3>
                    <MoreVertical className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-300" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center gap-4">
                    {[
                      { label: 'Applications', value: '1,450', percent: '100%', color: 'bg-indigo-500' },
                      { label: 'Screened', value: '810', percent: '56%', color: 'bg-indigo-500/80' },
                      { label: 'Interviewed', value: '320', percent: '22%', color: 'bg-indigo-500/60' },
                      { label: 'Offers', value: '145', percent: '10%', color: 'bg-indigo-500/40' },
                      { label: 'Hired', value: '67', percent: '4.6%', color: 'bg-indigo-500/20' },
                    ].map((stage, i) => (
                      <div key={i} className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-end">
                          <span className="text-[12px] font-medium text-slate-300">{stage.label}</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-semibold text-white">{stage.value}</span>
                            <span className="text-[10px] text-slate-500 w-8 text-right">{stage.percent}</span>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${stage.color}`} style={{ width: stage.percent }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sleek Line Chart */}
                <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 flex flex-col xl:col-span-2">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[13px] font-medium text-slate-200">Hiring Activity</h3>
                    <div className="flex gap-4">
                      <span className="flex items-center gap-2 text-[11px] font-medium text-slate-400"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Applications</span>
                      <span className="flex items-center gap-2 text-[11px] font-medium text-slate-400"><div className="w-2 h-2 rounded-full bg-fuchsia-500" /> Hires</span>
                    </div>
                  </div>
                  <div className="flex-1 w-full min-h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                          itemStyle={{ color: '#e2e8f0' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="applications" 
                          stroke="#6366f1" 
                          strokeWidth={2} 
                          dot={false}
                          activeDot={{ r: 4, fill: '#6366f1', stroke: '#0f172a', strokeWidth: 2 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="hires" 
                          stroke="#d946ef" 
                          strokeWidth={2} 
                          dot={false}
                          activeDot={{ r: 4, fill: '#d946ef', stroke: '#0f172a', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Candidate Source Donut */}
                <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 flex flex-col xl:col-span-1">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[13px] font-medium text-slate-200">Candidate Source</h3>
                    <MoreVertical className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-300" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div className="w-[120px] h-[120px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            innerRadius={45}
                            outerRadius={60}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={2}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-3">
                      {pieData.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} /> 
                          {item.name} <span className="text-slate-200 ml-auto">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recruiter Performance Bar Chart */}
                <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 flex flex-col xl:col-span-1">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[13px] font-medium text-slate-200">Recruiter Output</h3>
                    <MoreVertical className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-300" />
                  </div>
                  <div className="flex-1 w-full min-h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={8} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                        />
                        <Bar dataKey="performance" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Candidates (Spans full width) */}
                <div className="xl:col-span-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 flex flex-col mt-2">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[13px] font-medium text-slate-200">Recent Candidates</h3>
                    <button className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors">View All Directory &rarr;</button>
                  </div>
                  
                  {/* Clean List Layout */}
                  <div className="flex flex-col gap-2">
                    {/* Header Row */}
                    <div className="grid grid-cols-4 px-4 py-2 border-b border-white/[0.04] text-[11px] font-medium text-slate-500 mb-2">
                      <div className="col-span-2">Candidate</div>
                      <div>Status</div>
                      <div className="text-right">Match Score</div>
                    </div>

                    {[
                      { name: 'Alice Wong', role: 'Frontend Developer', img: '5', status: 'Interviewing', score: '98', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
                      { name: 'Michael Chen', role: 'Data Scientist', img: '11', status: 'Screening', score: '92', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                      { name: 'David Lee', role: 'Backend Engineer', img: '33', status: 'Hired', score: '88', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                    ].map((candidate, i) => (
                      <div key={i} className="grid grid-cols-4 items-center px-4 py-3 rounded-xl hover:bg-white/[0.02] transition-colors cursor-pointer group">
                        <div className="col-span-2 flex items-center gap-3">
                          <img src={`https://i.pravatar.cc/100?img=${candidate.img}`} alt={candidate.name} className="w-8 h-8 rounded-full bg-white/10" />
                          <div>
                            <p className="text-[13px] font-medium text-slate-200 group-hover:text-white transition-colors">{candidate.name}</p>
                            <p className="text-[11px] text-slate-500">{candidate.role}</p>
                          </div>
                        </div>
                        <div>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${candidate.color}`}>
                            {candidate.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[13px] font-semibold text-slate-300">{candidate.score}</span>
                          <span className="text-[10px] text-slate-500 ml-1">/ 100</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
