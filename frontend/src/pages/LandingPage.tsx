import { 
  Search, 
  Bell, 
  Settings, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BarChart3,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';
import { 
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, 
  PieChart, Pie, Cell, 
  BarChart, Bar
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
  { name: 'Agencies', value: 18, color: '#d946ef' },
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
    <div className="min-h-screen bg-[#02010a] text-slate-100 font-sans relative overflow-hidden flex items-center justify-center selection:bg-indigo-500/30">
      {/* SVG Filters for Intense Glow */}
      <svg className="hidden">
        <defs>
          <filter id="intenseGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Cosmic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ParticleBackground particleCount={250} speed={0.4} opacity={0.7} />
        {/* Intense Nebula Gradients */}
        <div className="absolute top-[-10%] left-[0%] w-[50%] h-[50%] bg-fuchsia-600/30 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[0%] w-[50%] h-[50%] bg-blue-600/30 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      {/* Floating Dashboard Frame (The "Laptop/Screen" Wrapper) */}
      <div className="relative z-10 w-[95vw] max-w-[1500px] h-[90vh] min-h-[800px] flex flex-col rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(99,102,241,0.25)] border border-white/10 bg-[#090b14]/60 backdrop-blur-3xl ring-1 ring-white/5">
        
        {/* Inner glow line at top */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent z-50" />

        <div className="flex h-full w-full relative z-10">
          
          {/* Elegant Sidebar */}
          <aside className="w-[260px] border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col p-6 relative">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-[1px] shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                <div className="w-full h-full bg-[#0a0a10] rounded-[11px] flex items-center justify-center">
                  <div className="w-4 h-4 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_12px_#818cf8]" />
                </div>
              </div>
              <span className="font-bold text-sm tracking-[0.2em] text-white drop-shadow-md">AI ANALYTICS HUB</span>
            </div>

            <nav className="space-y-1 mb-8">
              <a href="#" className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500/15 to-transparent text-indigo-300 border-l-2 border-indigo-500 font-semibold text-sm shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors font-medium text-sm">
                <Users className="w-4 h-4" />
                Sczenda
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors font-medium text-sm">
                <Calendar className="w-4 h-4" />
                Recruitment
              </a>
              <a href="#" className="flex items-center justify-between px-4 py-3.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors font-medium text-sm">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </div>
                <ChevronDown className="w-4 h-4" />
              </a>
            </nav>

            {/* Neon Floating Stats */}
            <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-hide">
              <div className="p-5 rounded-2xl bg-[#090b14]/50 border border-blue-500/30 shadow-[0_0_25px_rgba(59,130,246,0.15)] relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/30 blur-2xl rounded-full" />
                <p className="text-[10px] text-blue-200/80 font-bold tracking-widest uppercase mb-1">Total Active Jobs</p>
                <p className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">45</p>
              </div>
              
              <div className="p-5 rounded-2xl bg-[#090b14]/50 border border-indigo-500/30 shadow-[0_0_25px_rgba(99,102,241,0.15)] relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/30 blur-2xl rounded-full" />
                <p className="text-[10px] text-indigo-200/80 font-bold tracking-widest uppercase mb-1">New Applicants</p>
                <p className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">138</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#090b14]/50 border border-fuchsia-500/30 shadow-[0_0_25px_rgba(217,70,239,0.15)] relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-fuchsia-500/30 blur-2xl rounded-full" />
                <p className="text-[10px] text-fuchsia-200/80 font-bold tracking-widest uppercase mb-1">Avg Time-to-Hire</p>
                <p className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">18 <span className="text-xl font-bold text-white/70">Days</span></p>
              </div>
              
              <div className="p-5 rounded-2xl bg-[#090b14]/50 border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)] relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/30 blur-2xl rounded-full" />
                <p className="text-[10px] text-cyan-200/80 font-bold tracking-widest uppercase mb-1">Offer Acceptance</p>
                <p className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">89%</p>
              </div>
            </div>
          </aside>

          {/* Main Dashboard Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-black/10">
            
            {/* Minimal Header */}
            <header className="h-[88px] border-b border-white/5 flex items-center justify-between px-8 bg-black/30 backdrop-blur-md">
              <div className="w-[480px]">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search candidates, roles, or analytics..." 
                    className="w-full bg-white/[0.03] border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm text-slate-200 focus:outline-none focus:bg-white/[0.06] focus:border-indigo-500/50 transition-all font-medium placeholder:text-slate-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-semibold border border-white/10 transition-colors">
                  <LayoutDashboard className="w-4 h-4 inline-block mr-2" />
                  Dashboard
                </button>
                <div className="w-px h-6 bg-white/10 mx-2" />
                <button className="relative p-2.5 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.9)]" />
                </button>
                <button className="p-2.5 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                  <Settings className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full bg-slate-800 ml-3 border-[2px] border-indigo-500/30 overflow-hidden cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                  <img src="https://i.pravatar.cc/100?img=11" alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
            </header>

            {/* Dashboard Content */}
            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl font-bold tracking-[0.15em] text-white drop-shadow-md uppercase">JOB APPLICATION PIPELINE</h1>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors shadow-sm">
                  Year analytics <ChevronDown className="w-3 h-3 ml-1 text-slate-400" />
                </button>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 auto-rows-min h-full pb-8">
                
                {/* Stunning Pipeline Funnel (Spans 2 Rows) */}
                <div className="xl:col-span-1 xl:row-span-2 rounded-[24px] bg-[#090b14]/60 border border-white/10 p-7 flex flex-col relative shadow-[0_15px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl group">
                  <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
                  <div className="flex justify-between items-center mb-8 relative z-10">
                    <h3 className="text-[11px] font-bold text-slate-300 tracking-widest uppercase">Talent Pipeline Overview</h3>
                    <MoreVertical className="w-4 h-4 text-slate-500 cursor-pointer hover:text-white" />
                  </div>
                  
                  <div className="flex-1 relative flex flex-col items-center justify-center gap-4 z-10">
                    {/* Glowing SVG Background Funnel */}
                    <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-[85%] h-[95%] text-indigo-500/20 filter drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                        <path d="M0,0 L100,0 L65,100 L35,100 Z" fill="currentColor" />
                        <path d="M0,0 L100,0 L65,100 L35,100 Z" fill="none" stroke="rgba(99,102,241,0.5)" strokeWidth="1" />
                      </svg>
                    </div>
                    
                    {[
                      { label: 'Applications', value: '1,450', color: 'from-blue-500 to-indigo-500', width: 'w-[95%]' },
                      { label: 'Screened', value: '810', color: 'from-indigo-500 to-violet-500', width: 'w-[80%]' },
                      { label: 'Interviewed', value: '320', color: 'from-violet-500 to-fuchsia-500', width: 'w-[65%]' },
                      { label: 'Offers', value: '145', color: 'from-fuchsia-500 to-pink-500', width: 'w-[50%]' },
                      { label: 'Hired', value: '67', color: 'from-cyan-500 to-blue-500', width: 'w-[35%]' },
                    ].map((stage, i) => (
                      <div key={i} className={`${stage.width} p-[1.5px] rounded-2xl bg-gradient-to-r ${stage.color} relative shadow-[0_10px_30px_rgba(0,0,0,0.6)] cursor-default transition-all duration-300 hover:scale-105 hover:z-20`}>
                        <div className="w-full bg-[#0a0a10]/95 backdrop-blur-2xl rounded-[15px] py-3 flex flex-col items-center justify-center text-center">
                          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mb-1">{stage.label}</span>
                          <span className="text-2xl font-black text-white drop-shadow-lg">{stage.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Intense Glowing Line Chart */}
                <div className="rounded-[24px] bg-[#090b14]/60 border border-white/10 p-7 flex flex-col relative shadow-[0_15px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl xl:col-span-1">
                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <h3 className="text-[11px] font-bold text-slate-300 tracking-widest uppercase">Hiring Activity Trend</h3>
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" /> Applications</span>
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider"><div className="w-2 h-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_#d946ef]" /> Hires</span>
                    </div>
                  </div>
                  <div className="flex-1 w-full min-h-[160px] relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                        <Line 
                          type="monotone" 
                          dataKey="applications" 
                          stroke="#3b82f6" 
                          strokeWidth={4} 
                          dot={false}
                          activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                          style={{ filter: 'url(#intenseGlow)' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="hires" 
                          stroke="#d946ef" 
                          strokeWidth={4} 
                          dot={false}
                          activeDot={{ r: 6, fill: '#d946ef', stroke: '#fff', strokeWidth: 2 }}
                          style={{ filter: 'url(#intenseGlow)' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Floating Glassmorphism Hero Card */}
                <div className="rounded-[24px] bg-gradient-to-br from-indigo-900/60 to-fuchsia-900/40 border border-fuchsia-500/40 p-7 relative overflow-hidden shadow-[0_20px_60px_rgba(217,70,239,0.25)] backdrop-blur-2xl xl:col-span-1">
                  <div className="absolute -top-32 -right-32 w-80 h-80 bg-fuchsia-500/30 blur-[80px] rounded-full pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-fuchsia-500/20 to-transparent pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-[11px] font-bold text-fuchsia-100 tracking-widest uppercase">Total Active Jobs</h3>
                      <MoreVertical className="w-5 h-5 text-fuchsia-300 cursor-pointer" />
                    </div>
                    <p className="text-6xl font-black text-white mb-8 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] tracking-tighter">45</p>
                    <div className="flex items-center gap-3 mb-auto">
                      <span className="text-3xl font-extrabold text-white drop-shadow-md tracking-tight">138</span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/30 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                        ↑ 12%
                      </span>
                    </div>
                    
                    <div className="flex justify-between border-t border-white/20 pt-5 mt-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-fuchsia-200/80 uppercase font-bold tracking-wider">Applications</span>
                        <span className="text-sm font-bold text-white">Hires</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-fuchsia-200/80 uppercase font-bold tracking-wider">Average</span>
                        <span className="text-sm font-bold text-white">Time-to</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-fuchsia-200/80 uppercase font-bold tracking-wider">Others</span>
                        <span className="text-sm font-bold text-white">98%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Candidate Source Donut */}
                <div className="rounded-[24px] bg-[#090b14]/60 border border-white/10 p-7 flex flex-col relative shadow-[0_15px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[11px] font-bold text-slate-300 tracking-widest uppercase">Candidate Source</h3>
                    <MoreVertical className="w-4 h-4 text-slate-500 cursor-pointer" />
                  </div>
                  <div className="flex-1 flex items-center justify-between px-4">
                    <div className="w-[140px] h-[140px] relative">
                      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(99,102,241,0.25)] pointer-events-none" />
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            innerRadius={50}
                            outerRadius={65}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={4}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: 'url(#intenseGlow)' }} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-4">
                      {pieData.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                          <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: item.color, color: item.color }} /> 
                          {item.name} <span className="text-white ml-2">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recruiter Performance Bar Chart */}
                <div className="rounded-[24px] bg-[#090b14]/60 border border-white/10 p-7 flex flex-col relative shadow-[0_15px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[11px] font-bold text-slate-300 tracking-widest uppercase">Recruiter Performance</h3>
                    <MoreVertical className="w-4 h-4 text-slate-500 cursor-pointer" />
                  </div>
                  <div className="flex-1 w-full min-h-[140px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={8} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                        <Bar dataKey="performance" radius={[6, 6, 0, 0]} maxBarSize={16}>
                          {barData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill="url(#barGradient)" style={{ filter: 'drop-shadow(0 0 8px rgba(14,165,233,0.6))' }} />
                          ))}
                        </Bar>
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#818cf8" stopOpacity={1}/>
                            <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.8}/>
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Candidates (Bottom Row) */}
                <div className="xl:col-span-3 rounded-[24px] bg-[#090b14]/60 border border-white/10 p-7 flex flex-col shadow-[0_15px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[11px] font-bold text-slate-300 tracking-[0.2em] uppercase">RECENT CANDIDATES</h3>
                    <span className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer tracking-widest uppercase transition-colors">CANDIDATE INSIGHTS</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Candidate 1 */}
                    <div className="rounded-[16px] bg-white/[0.02] border border-white/[0.05] p-5 flex items-center justify-between hover:bg-white/[0.04] transition-colors cursor-pointer group shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                          <img src="https://i.pravatar.cc/100?img=5" alt="Alice" className="w-full h-full rounded-full object-cover border-2 border-[#090b14]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">Alice Wong</p>
                          <p className="text-[11px] font-semibold text-slate-400 mb-2">Frontend Developer</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded border border-yellow-500/20 shadow-[0_0_8px_rgba(234,179,8,0.2)]">Interviewing</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">Score <span className="text-emerald-300">98</span></span>
                          </div>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full border-[3px] border-indigo-500 flex items-center justify-center text-sm font-black text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] bg-indigo-500/10">
                        90
                      </div>
                    </div>

                    {/* Candidate 2 */}
                    <div className="rounded-[16px] bg-white/[0.02] border border-white/[0.05] p-5 flex items-center justify-between hover:bg-white/[0.04] transition-colors cursor-pointer group shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-br from-blue-500 to-cyan-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                          <img src="https://i.pravatar.cc/100?img=11" alt="Michael" className="w-full h-full rounded-full object-cover border-2 border-[#090b14]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">Michael Chen</p>
                          <p className="text-[11px] font-semibold text-slate-400 mb-2">Data Scientist</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0.2)]">Interviewing</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">Score <span className="text-emerald-300">92</span></span>
                          </div>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full border-[3px] border-fuchsia-500 flex items-center justify-center text-sm font-black text-white shadow-[0_0_20px_rgba(217,70,239,0.4)] bg-fuchsia-500/10">
                        90
                      </div>
                    </div>

                    {/* Candidate 3 */}
                    <div className="rounded-[16px] bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 p-5 flex items-center justify-between hover:from-emerald-500/15 transition-colors cursor-pointer group shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[40px] rounded-full pointer-events-none" />
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-br from-emerald-400 to-teal-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                          <img src="https://i.pravatar.cc/100?img=33" alt="David" className="w-full h-full rounded-full object-cover border-2 border-[#090b14]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">David Lee</p>
                          <p className="text-[11px] font-semibold text-slate-400 mb-2">Backend Engineer</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.3)]">Hired</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">Score <span className="text-emerald-300">88</span></span>
                          </div>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full border-[3px] border-emerald-500 flex items-center justify-center text-sm font-black text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] bg-emerald-500/20 relative z-10">
                        70
                      </div>
                    </div>

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
