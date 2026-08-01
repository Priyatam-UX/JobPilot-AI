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
  ArrowUpRight,
  Sparkles,
  Command,
  Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  XAxis, YAxis, ResponsiveContainer, 
  PieChart, Pie, Cell, 
  BarChart, Bar, Tooltip, Area, AreaChart
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
  { name: 'Direct', value: 28, color: '#8b5cf6' },
  { name: 'Agencies', value: 18, color: '#d946ef' },
  { name: 'Others', value: 12, color: '#334155' },
];

const barData = [
  { name: 'Jan', performance: 15 },
  { name: 'Feb', performance: 20 },
  { name: 'Mar', performance: 10 },
  { name: 'Apr', performance: 25 },
  { name: 'May', performance: 18 },
  { name: 'Jun', performance: 12 },
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 400, damping: 30 }
  }
};

const sidebarVariants = {
  hidden: { x: -30, opacity: 0 },
  show: { 
    x: 0, 
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 30, delay: 0.1 }
  }
};

const headerVariants = {
  hidden: { y: -20, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 30 }
  }
};

export function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#050505] text-slate-200 font-sans flex selection:bg-indigo-500/30 relative overflow-hidden">
      
      {/* Premium Dark Background with ultra-subtle ambient glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/5 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* --- SIDEBAR --- */}
      <motion.aside 
        variants={sidebarVariants}
        initial="hidden"
        animate="show"
        className="w-[280px] h-screen border-r border-white/[0.05] bg-[#0a0a0c]/80 backdrop-blur-2xl flex flex-col pt-8 pb-6 px-5 relative z-20 shrink-0"
      >
        <div className="flex items-center gap-3 px-2 mb-12">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <Command className="w-4 h-4" />
          </div>
          <span className="font-semibold text-[15px] tracking-wide text-white">Acme Corp</span>
        </div>

        <nav className="space-y-1.5 mb-10">
          <a href="#" className="group flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-500/[0.08] text-indigo-400 font-medium text-[13px] transition-all border border-indigo-500/20 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-r-full" />
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </a>
          <a href="#" className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] transition-all font-medium text-[13px]">
            <Users className="w-4 h-4 group-hover:text-fuchsia-400 transition-colors" />
            Candidates
          </a>
          <a href="#" className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] transition-all font-medium text-[13px]">
            <Calendar className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
            Interviews
          </a>
          <a href="#" className="group flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] transition-all font-medium text-[13px]">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4 group-hover:text-emerald-400 transition-colors" />
              Analytics
            </div>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </a>
        </nav>

        {/* Animated Sidebar Metrics */}
        <div className="space-y-3 flex-1 overflow-y-auto px-1 scrollbar-hide">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-4">Real-time Pulse</p>
          
          <motion.div whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.04)' }} className="p-4 rounded-2xl bg-[#0f0f11] border border-white/[0.04] transition-all cursor-pointer group shadow-sm hover:border-indigo-500/30">
            <p className="text-[12px] text-slate-400 font-medium mb-1">Total Active Jobs</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white tracking-tight">45</p>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            </div>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.04)' }} className="p-4 rounded-2xl bg-[#0f0f11] border border-white/[0.04] transition-all cursor-pointer group shadow-sm hover:border-fuchsia-500/30">
            <p className="text-[12px] text-slate-400 font-medium mb-1">New Applicants</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white tracking-tight">138</p>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-fuchsia-400 transition-colors" />
            </div>
          </motion.div>
        </div>
      </motion.aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col h-screen min-w-0 bg-transparent relative z-10">
        
        {/* Animated Header */}
        <motion.header 
          variants={headerVariants}
          initial="hidden"
          animate="show"
          className="h-[80px] border-b border-white/[0.05] flex items-center justify-between px-10 bg-[#0a0a0c]/50 backdrop-blur-md shrink-0"
        >
          <div className="w-[420px]">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search candidates, roles, or commands... (Press ⌘K)" 
                className="w-full bg-[#0f0f11] border border-white/[0.06] rounded-xl py-2.5 pl-11 pr-4 text-[13px] text-slate-200 focus:outline-none focus:bg-[#131316] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-slate-500 shadow-inner"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2.5 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-white/[0.06] border border-transparent">
              <Bell className="w-4 h-4" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2.5 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-white/[0.06] border border-transparent">
              <Settings className="w-4 h-4" />
            </motion.button>
            <div className="w-px h-5 bg-white/10 mx-3" />
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3 pl-2 cursor-pointer group bg-[#0f0f11] pr-4 py-1.5 rounded-full border border-white/[0.05] hover:border-white/10 transition-all shadow-sm">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/20 overflow-hidden shrink-0">
                <img src="https://i.pravatar.cc/100?img=11" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <p className="text-[13px] font-medium text-slate-200">Alex Chen</p>
            </motion.div>
          </div>
        </motion.header>

        {/* Dashboard Grid Container */}
        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-7xl mx-auto"
          >
            {/* Page Title */}
            <motion.div variants={itemVariants} className="flex items-end justify-between mb-10">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white mb-2 flex items-center gap-3">
                  Overview <Sparkles className="w-5 h-5 text-indigo-400" />
                </h1>
                <p className="text-[14px] text-slate-400 font-medium">Your hiring pipeline and team performance at a glance.</p>
              </div>
              <div className="flex items-center gap-1 bg-[#0f0f11] border border-white/[0.06] rounded-xl p-1 shadow-sm">
                <button className="px-4 py-2 rounded-lg bg-white/[0.06] text-[13px] font-medium text-white shadow-sm border border-white/[0.04] transition-colors">12 Months</button>
                <button className="px-4 py-2 rounded-lg text-[13px] font-medium text-slate-400 hover:text-white hover:bg-white/[0.03] transition-colors">30 Days</button>
                <button className="px-4 py-2 rounded-lg text-[13px] font-medium text-slate-400 hover:text-white hover:bg-white/[0.03] transition-colors">7 Days</button>
              </div>
            </motion.div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-min pb-12">
              
              {/* Pipeline Funnel Card */}
              <motion.div variants={itemVariants} className="lg:col-span-1 lg:row-span-2 rounded-[24px] bg-gradient-to-b from-[#0f0f11] to-[#0a0a0c] border border-white/[0.06] p-7 flex flex-col shadow-xl relative overflow-hidden group">
                <div className="flex justify-between items-center mb-10 relative z-10">
                  <h3 className="text-[14px] font-medium text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-400" /> Talent Pipeline
                  </h3>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <MoreVertical className="w-5 h-5 text-slate-500 hover:text-white transition-colors" />
                  </motion.button>
                </div>
                
                <div className="flex-1 flex flex-col justify-center gap-6 relative z-10">
                  {[
                    { label: 'Applications', value: '1,450', percent: '100%', color: 'bg-indigo-500' },
                    { label: 'Screened', value: '810', percent: '56%', color: 'bg-indigo-400' },
                    { label: 'Interviewed', value: '320', percent: '22%', color: 'bg-fuchsia-500' },
                    { label: 'Offers', value: '145', percent: '10%', color: 'bg-fuchsia-400' },
                    { label: 'Hired', value: '67', percent: '4.6%', color: 'bg-emerald-400' },
                  ].map((stage, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 4 }}
                      className="flex flex-col gap-2 cursor-pointer"
                    >
                      <div className="flex justify-between items-end">
                        <span className="text-[13px] font-medium text-slate-300">{stage.label}</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-semibold text-white">{stage.value}</span>
                          <span className="text-[11px] text-slate-500 w-8 text-right font-medium">{stage.percent}</span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-[#1a1a1f] rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: stage.percent }}
                          transition={{ duration: 1, delay: 0.2 + (i * 0.1), type: 'spring' }}
                          className={`h-full rounded-full ${stage.color} shadow-[0_0_10px_currentColor] opacity-90`} 
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Area Chart Card */}
              <motion.div variants={itemVariants} className="rounded-[24px] bg-gradient-to-b from-[#0f0f11] to-[#0a0a0c] border border-white/[0.06] p-7 flex flex-col lg:col-span-2 shadow-xl">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-[14px] font-medium text-white">Hiring Velocity</h3>
                  <div className="flex gap-5">
                    <span className="flex items-center gap-2 text-[12px] font-medium text-slate-300"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" /> Applications</span>
                    <span className="flex items-center gap-2 text-[12px] font-medium text-slate-300"><div className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.6)]" /> Hires</span>
                  </div>
                </div>
                <div className="flex-1 w-full min-h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                        contentStyle={{ backgroundColor: '#0f0f11', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '13px', padding: '12px 16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: '#fff', fontWeight: 500 }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="applications" 
                        stroke="#6366f1" 
                        fillOpacity={1} 
                        fill="url(#colorApps)"
                        strokeWidth={2} 
                        activeDot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                        animationDuration={1500}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="hires" 
                        stroke="#d946ef" 
                        fillOpacity={1} 
                        fill="url(#colorHires)"
                        strokeWidth={2} 
                        activeDot={{ r: 5, fill: '#d946ef', stroke: '#fff', strokeWidth: 2 }}
                        animationDuration={1500}
                        animationBegin={300}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Source Pie Chart Card */}
              <motion.div variants={itemVariants} className="rounded-[24px] bg-gradient-to-b from-[#0f0f11] to-[#0a0a0c] border border-white/[0.06] p-7 flex flex-col lg:col-span-1 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[14px] font-medium text-white">Source Breakdown</h3>
                  <MoreVertical className="w-5 h-5 text-slate-500 cursor-pointer hover:text-white" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div className="w-[140px] h-[140px] relative">
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-2xl font-bold text-white tracking-tighter">42%</span>
                      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Top Source</span>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={55}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                          cornerRadius={4}
                          animationDuration={1000}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f0f11', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '13px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-3">
                    {pieData.map((item, i) => (
                      <motion.div 
                        whileHover={{ x: 3 }}
                        key={i} 
                        className="flex items-center gap-3 text-[12px] font-medium text-slate-400 cursor-pointer"
                      >
                        <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: item.color, color: item.color }} /> 
                        {item.name} <span className="text-white ml-auto">{item.value}%</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Recruiter Performance Bar Chart */}
              <motion.div variants={itemVariants} className="rounded-[24px] bg-gradient-to-b from-[#0f0f11] to-[#0a0a0c] border border-white/[0.06] p-7 flex flex-col lg:col-span-1 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[14px] font-medium text-white">Team Output</h3>
                  <MoreVertical className="w-5 h-5 text-slate-500 cursor-pointer hover:text-white" />
                </div>
                <div className="flex-1 w-full min-h-[140px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1"/>
                          <stop offset="100%" stopColor="#3b82f6"/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={8} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                        contentStyle={{ backgroundColor: '#0f0f11', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '13px' }}
                      />
                      <Bar dataKey="performance" fill="url(#barGradient)" radius={[4, 4, 0, 0]} maxBarSize={24} animationDuration={1000} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Recent Candidates List */}
              <motion.div variants={itemVariants} className="lg:col-span-3 rounded-[24px] bg-gradient-to-b from-[#0f0f11] to-[#0a0a0c] border border-white/[0.06] p-7 flex flex-col mt-4 shadow-xl">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-[15px] font-medium text-white">Recent Candidates</h3>
                  <motion.button whileHover={{ x: 2 }} className="text-[13px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    View Directory &rarr;
                  </motion.button>
                </div>
                
                <div className="flex flex-col">
                  {/* List Header */}
                  <div className="grid grid-cols-12 px-5 py-3 border-b border-white/[0.04] text-[12px] font-semibold text-slate-500 mb-3 uppercase tracking-wider">
                    <div className="col-span-4">Candidate Profile</div>
                    <div className="col-span-3">Role Applied</div>
                    <div className="col-span-3">Status</div>
                    <div className="col-span-2 text-right">Match Score</div>
                  </div>

                  {/* Rows */}
                  {[
                    { name: 'Alice Wong', role: 'Frontend Developer', img: '5', status: 'Interviewing', score: '98', color: 'text-indigo-400 bg-indigo-500/[0.1] border-indigo-500/20' },
                    { name: 'Michael Chen', role: 'Data Scientist', img: '11', status: 'Screening', score: '92', color: 'text-fuchsia-400 bg-fuchsia-500/[0.1] border-fuchsia-500/20' },
                    { name: 'David Lee', role: 'Backend Engineer', img: '33', status: 'Hired', score: '88', color: 'text-emerald-400 bg-emerald-500/[0.1] border-emerald-500/20' },
                  ].map((candidate, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.02)' }}
                      className="grid grid-cols-12 items-center px-5 py-4 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-white/[0.04] hover:shadow-lg"
                    >
                      <div className="col-span-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0 shadow-sm">
                          <img src={`https://i.pravatar.cc/100?img=${candidate.img}`} alt={candidate.name} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[14px] font-medium text-slate-200">{candidate.name}</p>
                      </div>
                      <div className="col-span-3">
                        <p className="text-[13px] font-medium text-slate-400">{candidate.role}</p>
                      </div>
                      <div className="col-span-3">
                        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-md border ${candidate.color}`}>
                          {candidate.status}
                        </span>
                      </div>
                      <div className="col-span-2 text-right">
                        <span className="text-[15px] font-semibold text-white">{candidate.score}</span>
                        <span className="text-[11px] text-slate-500 ml-1">/ 100</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
