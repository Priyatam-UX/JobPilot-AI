import { useNavigate } from 'react-router-dom';
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
  { name: 'Jan', applications: 200, hires: 50 },
  { name: 'Feb', applications: 450, hires: 120 },
  { name: 'Mar', applications: 350, hires: 90 },
  { name: 'Apr', applications: 600, hires: 180 },
  { name: 'May', applications: 450, hires: 140 },
  { name: 'Jun', applications: 800, hires: 250 },
  { name: 'Jul', applications: 750, hires: 220 },
];

const pieData = [
  { name: 'LinkedIn', value: 42, color: '#6366f1' },
  { name: 'Direct', value: 28, color: '#3b82f6' },
  { name: 'Agencies', value: 18, color: '#d946ef' },
];

const barData = [
  { name: 'Jan', performance: 60 },
  { name: 'Feb', performance: 80 },
  { name: 'Mar', performance: 45 },
  { name: 'Apr', performance: 95 },
  { name: 'May', performance: 75 },
  { name: 'Jun', performance: 55 },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#02010a] text-slate-100 font-sans relative overflow-hidden flex items-center justify-center p-4 md:p-8 lg:p-12">
      {/* SVG Filters for Glowing Charts */}
      <svg className="hidden">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>

      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        <ParticleBackground particleCount={150} speed={0.3} opacity={0.6} />
      </div>
      
      {/* Heavy Space Gradients (Nebula effect) */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-fuchsia-600/20 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen" />
      <div className="fixed top-[40%] left-[30%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />

      {/* Main Dashboard Container */}
      <main className="relative z-10 w-full max-w-[1600px] h-[90vh] min-h-[800px] bg-[#090b14]/70 backdrop-blur-3xl rounded-3xl border border-white/5 shadow-[0_0_100px_rgba(79,70,229,0.15)] flex overflow-hidden ring-1 ring-white/10">
        
        {/* Glow inner border */}
        <div className="absolute inset-0 rounded-3xl border border-transparent bg-gradient-to-br from-indigo-500/10 via-transparent to-fuchsia-500/10 pointer-events-none" style={{ WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />

        {/* Sidebar */}
        <aside className="w-[280px] border-r border-white/5 flex flex-col p-6 relative z-10 bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-fuchsia-500 p-[1px]">
              <div className="w-full h-full bg-[#090b14] rounded-[7px] flex items-center justify-center">
                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
              </div>
            </div>
            <span className="font-bold text-sm tracking-widest text-white drop-shadow-md">AI ANALYTICS HUB</span>
          </div>

          <nav className="space-y-2 mb-10">
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium text-sm shadow-[0_0_15px_rgba(99,102,241,0.1)] transition-all">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors font-medium text-sm">
              <Users className="w-4 h-4" />
              Sczenda
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors font-medium text-sm">
              <Calendar className="w-4 h-4" />
              Recruitment
            </a>
            <a href="#" className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors font-medium text-sm">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </div>
              <ChevronDown className="w-4 h-4" />
            </a>
          </nav>

          {/* Glowing Stats Cards in Sidebar */}
          <div className="space-y-4 flex-grow overflow-y-auto pr-2 scrollbar-hide">
            {/* Stat 1 */}
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.05)] relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/20 blur-2xl rounded-full" />
              <p className="text-[11px] text-indigo-200/70 uppercase tracking-wider font-semibold mb-1">Total Active Jobs</p>
              <p className="text-3xl font-bold text-white tracking-tight">45</p>
            </div>
            {/* Stat 2 */}
            <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.05)] relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/20 blur-2xl rounded-full" />
              <p className="text-[11px] text-blue-200/70 uppercase tracking-wider font-semibold mb-1">New Applicants Today</p>
              <p className="text-3xl font-bold text-white tracking-tight">138</p>
            </div>
            {/* Stat 3 */}
            <div className="p-4 rounded-2xl bg-fuchsia-950/20 border border-fuchsia-500/20 shadow-[0_0_20px_rgba(217,70,239,0.05)] relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-fuchsia-500/20 blur-2xl rounded-full" />
              <p className="text-[11px] text-fuchsia-200/70 uppercase tracking-wider font-semibold mb-1">Avg Time-to-Hire</p>
              <p className="text-3xl font-bold text-white tracking-tight">18 Days</p>
            </div>
            {/* Stat 4 */}
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.05)] relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/20 blur-2xl rounded-full" />
              <p className="text-[11px] text-cyan-200/70 uppercase tracking-wider font-semibold mb-1">Offer Acceptance</p>
              <p className="text-3xl font-bold text-white tracking-tight">89%</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative z-10 overflow-hidden bg-black/20">
          
          {/* Header */}
          <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-4 w-[400px]">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search candidates, jobs..." 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/login')} className="text-sm font-medium text-slate-300 hover:text-white mr-2 transition-colors">
                Sign In
              </button>
              <button onClick={() => navigate('/register')} className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all transform hover:-translate-y-0.5">
                Get Started
              </button>
              <div className="w-px h-6 bg-white/10 mx-2" />
              <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_5px_rgba(236,72,153,0.8)]" />
              </button>
              <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-slate-800 ml-2 overflow-hidden border border-white/20 shadow-md">
                <img src="https://i.pravatar.cc/100?img=11" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </header>

          {/* Dashboard Grid */}
          <div className="p-8 flex-1 overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-end mb-8">
              <h1 className="text-xl font-bold tracking-widest text-white drop-shadow-md">JOB APPLICATION PIPELINE</h1>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300 hover:bg-white/10 cursor-pointer transition-colors">
                Year analytics <ChevronDown className="w-3 h-3 ml-1" />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100%-4rem)]">
              
              {/* Funnel Chart (Left column, spanning 2 rows) */}
              <div className="xl:col-span-1 xl:row-span-2 rounded-2xl bg-black/40 border border-white/[0.08] p-6 relative flex flex-col shadow-xl backdrop-blur-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Talent Pipeline Overview</h3>
                  <MoreVertical className="w-4 h-4 text-slate-500" />
                </div>
                
                {/* Visual Funnel Representation */}
                <div className="flex-1 relative flex flex-col items-center justify-center gap-3">
                  {/* Funnel Background SVG */}
                  <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-20">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-4/5 h-[90%] text-indigo-500 filter drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                      <path d="M0,0 L100,0 L65,100 L35,100 Z" fill="currentColor" opacity="0.3" />
                      <path d="M0,0 L100,0 L65,100 L35,100 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </div>
                  
                  {/* Funnel Stages */}
                  {[
                    { label: 'Applications', value: '1,450', color: 'from-blue-500 to-indigo-500', width: 'w-[90%]' },
                    { label: 'Screened', value: '810', color: 'from-indigo-500 to-violet-500', width: 'w-[75%]' },
                    { label: 'Interviewed', value: '320', color: 'from-violet-500 to-fuchsia-500', width: 'w-[60%]' },
                    { label: 'Offers', value: '145', color: 'from-fuchsia-500 to-pink-500', width: 'w-[45%]' },
                    { label: 'Hired', value: '67', color: 'from-cyan-500 to-blue-500', width: 'w-[35%]' },
                  ].map((stage, i) => (
                    <div key={i} className={`${stage.width} p-[1px] rounded-xl bg-gradient-to-r ${stage.color} relative shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 hover:scale-105 transition-transform cursor-default group`}>
                      <div className="w-full bg-[#0a0a10]/90 backdrop-blur-md rounded-[11px] p-2.5 flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] text-slate-300 font-medium mb-0.5 uppercase tracking-wide group-hover:text-white transition-colors">{stage.label}</span>
                        <span className="text-xl font-bold text-white drop-shadow-md">{stage.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Line Chart (Middle column, top) */}
              <div className="rounded-2xl bg-black/40 border border-white/[0.08] p-6 relative flex flex-col shadow-xl backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Hiring Activity Trend</h3>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1.5 text-[10px] uppercase font-semibold text-slate-400"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6]" /> Applications</span>
                    <span className="flex items-center gap-1.5 text-[10px] uppercase font-semibold text-slate-400"><div className="w-2 h-2 rounded-full bg-fuchsia-500 shadow-[0_0_5px_#d946ef]" /> Hires</span>
                  </div>
                </div>
                
                {/* Recharts Line Chart */}
                <div className="flex-1 w-full min-h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <Line 
                        type="monotone" 
                        dataKey="applications" 
                        stroke="#3b82f6" 
                        strokeWidth={3} 
                        dot={false} 
                        activeDot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                        style={{ filter: 'url(#glow)' }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="hires" 
                        stroke="#d946ef" 
                        strokeWidth={3} 
                        dot={false} 
                        activeDot={{ r: 4, fill: '#d946ef', stroke: '#fff', strokeWidth: 2 }}
                        style={{ filter: 'url(#glow)' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Right Card (Total Active Jobs glowing card) */}
              <div className="rounded-2xl bg-gradient-to-br from-indigo-900/50 to-fuchsia-900/30 border border-fuchsia-500/30 p-6 relative overflow-hidden shadow-[0_0_30px_rgba(217,70,239,0.15)] backdrop-blur-md">
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-fuchsia-500/20 blur-3xl rounded-full" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-fuchsia-500/10 to-transparent" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xs font-bold text-indigo-200 tracking-wider uppercase">Total Active Jobs</h3>
                    <MoreVertical className="w-4 h-4 text-indigo-300" />
                  </div>
                  <p className="text-5xl font-black text-white mb-6 drop-shadow-lg tracking-tight">45</p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-3xl font-bold text-white drop-shadow-md tracking-tight">138</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded flex items-center gap-1 border border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                      ↑ 12%
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-indigo-200/70 border-t border-white/10 pt-4 uppercase tracking-wider font-semibold">
                    <div className="flex flex-col gap-1"><span className="text-white drop-shadow">Applications</span><span>Hires</span></div>
                    <div className="flex flex-col gap-1"><span className="text-white drop-shadow">Average</span><span>Time-to</span></div>
                    <div className="flex flex-col gap-1"><span className="text-white drop-shadow">98%</span><span>Others</span></div>
                  </div>
                </div>
              </div>

              {/* Candidate Source Donut (Middle row, left/middle) */}
              <div className="rounded-2xl bg-black/40 border border-white/[0.08] p-6 flex flex-col shadow-xl backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Candidate Source</h3>
                  <MoreVertical className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 flex items-center justify-center gap-8">
                  
                  {/* Recharts Pie Chart */}
                  <div className="w-[120px] h-[120px] relative">
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(99,102,241,0.2)] pointer-events-none" />
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={45}
                          outerRadius={55}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: 'url(#glow)' }} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex flex-col gap-3">
                    {pieData.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] font-medium text-slate-300">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 5px ${item.color}` }} /> 
                        {item.name} <span className="text-white font-bold">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recruiter Performance Bar Chart (Middle row, right) */}
              <div className="rounded-2xl bg-black/40 border border-white/[0.08] p-6 flex flex-col shadow-xl backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Recruiter Performance</h3>
                  <MoreVertical className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 w-full min-h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={5} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <Bar dataKey="performance" fill="#0ea5e9" radius={[4, 4, 0, 0]}>
                        {barData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill="url(#colorUv)" style={{ filter: 'drop-shadow(0 0 4px rgba(14,165,233,0.5))' }} />
                        ))}
                      </Bar>
                      <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Candidates (Bottom row, spanning 3 columns) */}
              <div className="xl:col-span-3 rounded-2xl bg-black/40 border border-white/[0.08] p-6 flex flex-col shadow-xl backdrop-blur-sm">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-xs font-bold text-slate-300 tracking-widest uppercase">RECENT CANDIDATES</h3>
                  <span className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer tracking-wider uppercase transition-colors">CANDIDATE INSIGHTS</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Candidate 1 */}
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-4 flex items-center justify-between hover:bg-white/[0.05] transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-br from-indigo-500 to-fuchsia-500">
                        <img src="https://i.pravatar.cc/100?img=5" alt="Alice" className="w-full h-full rounded-full object-cover border-2 border-black" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors">Alice Wong</p>
                        <p className="text-[11px] font-medium text-slate-400 mb-1.5">Frontend Developer</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full border border-yellow-500/20 shadow-[0_0_5px_rgba(234,179,8,0.2)]">Interviewing</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">Score <span className="text-emerald-300 text-[10px]">98</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-[3px] border-indigo-500 flex items-center justify-center text-base font-black text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                      90
                    </div>
                  </div>
                  {/* Candidate 2 */}
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-4 flex items-center justify-between hover:bg-white/[0.05] transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-br from-blue-500 to-cyan-500">
                        <img src="https://i.pravatar.cc/100?img=11" alt="Michael" className="w-full h-full rounded-full object-cover border-2 border-black" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors">Michael Chen</p>
                        <p className="text-[11px] font-medium text-slate-400 mb-1.5">Data Scientist</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 shadow-[0_0_5px_rgba(59,130,246,0.2)]">Interviewing</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">Score <span className="text-emerald-300 text-[10px]">92</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-[3px] border-fuchsia-500 flex items-center justify-center text-base font-black text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]">
                      90
                    </div>
                  </div>
                  {/* Candidate 3 */}
                  <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 p-4 flex items-center justify-between hover:from-emerald-500/20 transition-colors group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full" />
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-br from-emerald-400 to-teal-500">
                        <img src="https://i.pravatar.cc/100?img=33" alt="David" className="w-full h-full rounded-full object-cover border-2 border-black" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-emerald-200 transition-colors">David Lee</p>
                        <p className="text-[11px] font-medium text-slate-400 mb-1.5">Backend Engineer</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 shadow-[0_0_5px_rgba(16,185,129,0.3)]">Hired</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">Score <span className="text-emerald-300 text-[10px]">88</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-[3px] border-emerald-500 flex items-center justify-center text-base font-black text-white shadow-[0_0_15px_rgba(16,185,129,0.6)] relative z-10 bg-emerald-500/10">
                      70
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
