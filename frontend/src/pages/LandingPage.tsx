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
  Command
} from 'lucide-react';
import { motion } from 'framer-motion';
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
  { name: 'LinkedIn', value: 42, color: '#e2e8f0' },
  { name: 'Direct', value: 28, color: '#94a3b8' },
  { name: 'Agencies', value: 18, color: '#475569' },
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
    <div className="min-h-screen w-full bg-[#030303] text-slate-200 font-sans flex selection:bg-white/20 relative overflow-hidden">
      
      {/* High-Class Subtle Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-slate-500/10 rounded-full blur-[120px] mix-blend-screen" />
        {/* Noise overlay for premium texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
      </div>

      {/* --- SIDEBAR --- */}
      <motion.aside 
        variants={sidebarVariants}
        initial="hidden"
        animate="show"
        className="w-[280px] h-screen border-r border-white/[0.08] bg-[#050505]/80 backdrop-blur-3xl flex flex-col pt-8 pb-6 px-5 relative z-20 shrink-0"
      >
        <div className="flex items-center gap-3 px-2 mb-12">
          <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)]">
            <Command className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm tracking-wide text-white">Acme Corp</span>
        </div>

        <nav className="space-y-1.5 mb-10">
          <a href="#" className="group flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.08] text-white font-medium text-[13px] transition-all border border-white/[0.08] shadow-sm">
            <LayoutDashboard className="w-4 h-4 text-white" />
            Dashboard
          </a>
          <a href="#" className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all font-medium text-[13px]">
            <Users className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            Candidates
          </a>
          <a href="#" className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all font-medium text-[13px]">
            <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            Interviews
          </a>
          <a href="#" className="group flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all font-medium text-[13px]">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              Analytics
            </div>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </a>
        </nav>

        {/* Animated Sidebar Metrics */}
        <div className="space-y-3 flex-1 overflow-y-auto px-1 scrollbar-hide">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-4">Real-time Pulse</p>
          
          <motion.div whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.06)' }} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] transition-colors cursor-pointer group">
            <p className="text-[12px] text-slate-400 font-medium mb-1">Total Active Jobs</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white tracking-tight">45</p>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.06)' }} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] transition-colors cursor-pointer group">
            <p className="text-[12px] text-slate-400 font-medium mb-1">New Applicants</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white tracking-tight">138</p>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.06)' }} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] transition-colors cursor-pointer group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-full blur-xl group-hover:bg-white/[0.05] transition-colors" />
            <p className="text-[12px] text-slate-400 font-medium mb-1 relative z-10">Avg Time-to-Hire</p>
            <div className="flex items-center justify-between relative z-10">
              <p className="text-2xl font-bold text-white tracking-tight">18d</p>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
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
          className="h-[80px] border-b border-white/[0.06] flex items-center justify-between px-10 bg-[#050505]/50 backdrop-blur-xl shrink-0"
        >
          <div className="w-[420px]">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" />
              <input 
                type="text" 
                placeholder="Search candidates, roles, or commands... (Press ⌘K)" 
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-2.5 pl-11 pr-4 text-[13px] text-slate-200 focus:outline-none focus:bg-white/[0.08] focus:border-white/20 focus:ring-4 focus:ring-white/[0.03] transition-all font-medium placeholder:text-slate-500 shadow-inner"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2.5 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-white/[0.08] border border-transparent hover:border-white/[0.05]">
              <Bell className="w-4 h-4" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2.5 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-white/[0.08] border border-transparent hover:border-white/[0.05]">
              <Settings className="w-4 h-4" />
            </motion.button>
            <div className="w-px h-5 bg-white/10 mx-3" />
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3 pl-2 cursor-pointer group bg-white/[0.02] pr-4 py-1.5 rounded-full border border-white/[0.05] hover:bg-white/[0.06] transition-colors">
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
                  Overview <Sparkles className="w-5 h-5 text-slate-400" />
                </h1>
                <p className="text-[14px] text-slate-400 font-medium">Your hiring pipeline and team performance at a glance.</p>
              </div>
              <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 shadow-sm">
                <button className="px-4 py-2 rounded-lg bg-white/[0.1] text-[13px] font-medium text-white shadow-sm border border-white/[0.05] transition-colors">12 Months</button>
                <button className="px-4 py-2 rounded-lg text-[13px] font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors">30 Days</button>
                <button className="px-4 py-2 rounded-lg text-[13px] font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors">7 Days</button>
              </div>
            </motion.div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-min pb-12">
              
              {/* Pipeline Funnel Card */}
              <motion.div variants={itemVariants} className="lg:col-span-1 lg:row-span-2 rounded-[24px] bg-[#080808] border border-white/[0.08] p-7 flex flex-col shadow-2xl shadow-black/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
                <div className="flex justify-between items-center mb-10 relative z-10">
                  <h3 className="text-[14px] font-medium text-white">Talent Pipeline</h3>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <MoreVertical className="w-5 h-5 text-slate-500 hover:text-white transition-colors" />
                  </motion.button>
                </div>
                
                <div className="flex-1 flex flex-col justify-center gap-6 relative z-10">
                  {[
                    { label: 'Applications', value: '1,450', percent: '100%', color: 'bg-white' },
                    { label: 'Screened', value: '810', percent: '56%', color: 'bg-slate-300' },
                    { label: 'Interviewed', value: '320', percent: '22%', color: 'bg-slate-500' },
                    { label: 'Offers', value: '145', percent: '10%', color: 'bg-slate-600' },
                    { label: 'Hired', value: '67', percent: '4.6%', color: 'bg-slate-700' },
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
                      <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: stage.percent }}
                          transition={{ duration: 1, delay: 0.2 + (i * 0.1), type: 'spring' }}
                          className={`h-full rounded-full ${stage.color}`} 
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Line Chart Card */}
              <motion.div variants={itemVariants} className="rounded-[24px] bg-[#080808] border border-white/[0.08] p-7 flex flex-col lg:col-span-2 shadow-2xl shadow-black/50">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-[14px] font-medium text-white">Hiring Velocity</h3>
                  <div className="flex gap-5">
                    <span className="flex items-center gap-2 text-[12px] font-medium text-slate-400"><div className="w-2.5 h-2.5 rounded-full bg-white" /> Applications</span>
                    <span className="flex items-center gap-2 text-[12px] font-medium text-slate-400"><div className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Hires</span>
                  </div>
                </div>
                <div className="flex-1 w-full min-h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                        contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '13px', padding: '12px 16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: '#fff', fontWeight: 500 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="applications" 
                        stroke="#fff" 
                        strokeWidth={2} 
                        dot={false}
                        activeDot={{ r: 5, fill: '#fff', stroke: '#000', strokeWidth: 2 }}
                        animationDuration={1500}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="hires" 
                        stroke="#475569" 
                        strokeWidth={2} 
                        dot={false}
                        activeDot={{ r: 5, fill: '#475569', stroke: '#000', strokeWidth: 2 }}
                        animationDuration={1500}
                        animationBegin={300}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Source Pie Chart Card */}
              <motion.div variants={itemVariants} className="rounded-[24px] bg-[#080808] border border-white/[0.08] p-7 flex flex-col lg:col-span-1 shadow-2xl shadow-black/50">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[14px] font-medium text-white">Source Breakdown</h3>
                  <MoreVertical className="w-5 h-5 text-slate-500 cursor-pointer hover:text-white" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div className="w-[140px] h-[140px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={50}
                          outerRadius={65}
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
                          contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '13px' }}
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
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} /> 
                        {item.name} <span className="text-white ml-auto">{item.value}%</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Recruiter Performance Bar Chart */}
              <motion.div variants={itemVariants} className="rounded-[24px] bg-[#080808] border border-white/[0.08] p-7 flex flex-col lg:col-span-1 shadow-2xl shadow-black/50">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[14px] font-medium text-white">Team Output</h3>
                  <MoreVertical className="w-5 h-5 text-slate-500 cursor-pointer hover:text-white" />
                </div>
                <div className="flex-1 w-full min-h-[140px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={8} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                        contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '13px' }}
                      />
                      <Bar dataKey="performance" fill="#fff" radius={[4, 4, 0, 0]} maxBarSize={24} animationDuration={1000} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Recent Candidates List */}
              <motion.div variants={itemVariants} className="lg:col-span-3 rounded-[24px] bg-[#080808] border border-white/[0.08] p-7 flex flex-col mt-4 shadow-2xl shadow-black/50">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-[15px] font-medium text-white">Recent Candidates</h3>
                  <motion.button whileHover={{ x: 2 }} className="text-[13px] font-medium text-slate-400 hover:text-white transition-colors">
                    View Directory &rarr;
                  </motion.button>
                </div>
                
                <div className="flex flex-col">
                  {/* List Header */}
                  <div className="grid grid-cols-12 px-5 py-3 border-b border-white/[0.06] text-[12px] font-semibold text-slate-500 mb-3 uppercase tracking-wider">
                    <div className="col-span-4">Candidate Profile</div>
                    <div className="col-span-3">Role Applied</div>
                    <div className="col-span-3">Status</div>
                    <div className="col-span-2 text-right">Match Score</div>
                  </div>

                  {/* Rows */}
                  {[
                    { name: 'Alice Wong', role: 'Frontend Developer', img: '5', status: 'Interviewing', score: '98', color: 'text-white bg-white/[0.1] border-white/20' },
                    { name: 'Michael Chen', role: 'Data Scientist', img: '11', status: 'Screening', score: '92', color: 'text-slate-300 bg-slate-500/[0.15] border-slate-500/20' },
                    { name: 'David Lee', role: 'Backend Engineer', img: '33', status: 'Hired', score: '88', color: 'text-emerald-400 bg-emerald-500/[0.15] border-emerald-500/20' },
                  ].map((candidate, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.03)' }}
                      className="grid grid-cols-12 items-center px-5 py-4 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-white/[0.04]"
                    >
                      <div className="col-span-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
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
