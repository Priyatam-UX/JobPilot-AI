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
  Briefcase,
  Filter
} from 'lucide-react';
import { 
  XAxis, YAxis, ResponsiveContainer, 
  PieChart, Pie, Cell, 
  BarChart, Bar, Tooltip, Area, AreaChart, CartesianGrid
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
  { name: 'LinkedIn', value: 42, color: '#2563eb' }, // blue-600
  { name: 'Direct', value: 28, color: '#0284c7' },   // sky-600
  { name: 'Agencies', value: 18, color: '#64748b' }, // slate-500
  { name: 'Others', value: 12, color: '#94a3b8' },   // slate-400
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
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 font-sans flex relative overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-[260px] h-screen border-r border-slate-200 bg-white flex flex-col pt-6 pb-6 px-4 relative z-20 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Command className="w-4 h-4" />
          </div>
          <span className="font-bold text-[15px] text-slate-900 tracking-tight">Acme Corp</span>
        </div>

        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Navigation</p>
        <nav className="space-y-1 mb-10">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-blue-50 text-blue-700 font-medium text-[13px] border border-blue-100">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </a>
          <a href="#" className="group flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors font-medium text-[13px]">
            <Users className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            Candidates
          </a>
          <a href="#" className="group flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors font-medium text-[13px]">
            <Calendar className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            Interviews
          </a>
          <a href="#" className="group flex items-center justify-between px-3 py-2.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors font-medium text-[13px]">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              Analytics
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </a>
        </nav>

        {/* Sidebar Metrics */}
        <div className="space-y-2 flex-1 overflow-y-auto scrollbar-hide">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Pulse</p>
          
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors">
            <p className="text-[12px] text-slate-500 font-medium mb-1">Total Active Jobs</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-slate-900">45</p>
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors">
            <p className="text-[12px] text-slate-500 font-medium mb-1">New Applicants</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-slate-900">138</p>
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col h-screen min-w-0 bg-transparent relative z-10">
        
        {/* Header */}
        <header className="h-[64px] border-b border-slate-200 flex items-center justify-between px-8 bg-white shrink-0">
          <div className="w-[380px]">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search candidates, roles... (Press ⌘K)" 
                className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 pl-9 pr-4 text-[13px] text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-slate-200 mx-2" />
            <div className="flex items-center gap-2.5 cursor-pointer p-1.5 pr-3 rounded-md hover:bg-slate-50 transition-colors">
              <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden shrink-0">
                <img src="https://i.pravatar.cc/100?img=11" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <span className="text-[13px] font-medium text-slate-700">Alex Chen</span>
            </div>
          </div>
        </header>

        {/* Dashboard Grid Container */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Page Title & Controls */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  Dashboard <Sparkles className="w-4 h-4 text-blue-600" />
                </h1>
                <p className="text-[13px] text-slate-500 mt-1">Real-time overview of your hiring pipeline and team performance.</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
                  <Filter className="w-4 h-4 text-slate-400" /> Filters
                </button>
                <div className="flex items-center bg-slate-100 rounded-md p-1 border border-slate-200 shadow-inner">
                  <button className="px-3 py-1.5 rounded bg-white text-[13px] font-medium text-slate-900 shadow-sm border border-slate-200">12 Months</button>
                  <button className="px-3 py-1.5 rounded text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">30 Days</button>
                  <button className="px-3 py-1.5 rounded text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">7 Days</button>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[13px] font-medium transition-colors shadow-sm ml-2">
                  Generate Report
                </button>
              </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-min pb-12">
              
              {/* Pipeline Funnel Card */}
              <div className="lg:col-span-1 lg:row-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-[14px] font-semibold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" /> Talent Pipeline
                  </h3>
                  <button className="p-1 hover:bg-slate-100 rounded">
                    <MoreVertical className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </button>
                </div>
                
                <div className="flex-1 flex flex-col justify-center gap-5">
                  {[
                    { label: 'Applications', value: '1,450', percent: '100%', width: '100%', color: 'bg-blue-600' },
                    { label: 'Screened', value: '810', percent: '56%', width: '56%', color: 'bg-blue-500' },
                    { label: 'Interviewed', value: '320', percent: '22%', width: '22%', color: 'bg-blue-400' },
                    { label: 'Offers', value: '145', percent: '10%', width: '10%', color: 'bg-sky-400' },
                    { label: 'Hired', value: '67', percent: '4.6%', width: '4.6%', color: 'bg-emerald-500' },
                  ].map((stage, i) => (
                    <div key={i} className="flex flex-col gap-1.5 group cursor-pointer">
                      <div className="flex justify-between items-end">
                        <span className="text-[13px] font-medium text-slate-600 group-hover:text-blue-600 transition-colors">{stage.label}</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[15px] font-semibold text-slate-900">{stage.value}</span>
                          <span className="text-[11px] text-slate-500 w-8 text-right font-medium">{stage.percent}</span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${stage.color} transition-all duration-500`}
                          style={{ width: stage.width }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Area Chart Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:col-span-2 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[14px] font-semibold text-slate-900">Hiring Velocity</h3>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
                      <div className="w-2.5 h-2.5 rounded-sm bg-blue-600" /> Applications
                    </span>
                    <span className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
                      <div className="w-2.5 h-2.5 rounded-sm bg-slate-400" /> Hires
                    </span>
                  </div>
                </div>
                <div className="flex-1 w-full min-h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAppsLight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorHiresLight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', padding: '10px 14px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: '#0f172a', fontWeight: 500 }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="applications" 
                        stroke="#2563eb" 
                        fillOpacity={1} 
                        fill="url(#colorAppsLight)"
                        strokeWidth={2} 
                        activeDot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="hires" 
                        stroke="#94a3b8" 
                        fillOpacity={1} 
                        fill="url(#colorHiresLight)"
                        strokeWidth={2} 
                        activeDot={{ r: 5, fill: '#94a3b8', stroke: '#fff', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Source Pie Chart Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:col-span-1 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[14px] font-semibold text-slate-900">Source Breakdown</h3>
                  <button className="p-1 hover:bg-slate-100 rounded">
                    <MoreVertical className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </button>
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div className="w-[120px] h-[120px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={45}
                          outerRadius={60}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                          itemStyle={{ color: '#0f172a' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {pieData.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} /> 
                        {item.name} <span className="text-slate-900 font-semibold ml-auto">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Team Output Bar Chart */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:col-span-1 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[14px] font-semibold text-slate-900">Team Output</h3>
                  <button className="p-1 hover:bg-slate-100 rounded">
                    <MoreVertical className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </button>
                </div>
                <div className="flex-1 w-full min-h-[140px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={8} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }}
                      />
                      <Bar dataKey="performance" fill="#3b82f6" radius={[2, 2, 0, 0]} maxBarSize={28} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Data Table: Recent Candidates */}
              <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col mt-2">
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                  <h3 className="text-[15px] font-semibold text-slate-900">Recent Candidates</h3>
                  <button className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    View Directory &rarr;
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Candidate Name</th>
                        <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Role Applied</th>
                        <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-right">Match Score</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { name: 'Alice Wong', role: 'Frontend Developer', img: '5', status: 'Interviewing', score: '98', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
                        { name: 'Michael Chen', role: 'Data Scientist', img: '11', status: 'Screening', score: '92', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
                        { name: 'David Lee', role: 'Backend Engineer', img: '33', status: 'Hired', score: '88', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
                        { name: 'Sarah Miller', role: 'Product Manager', img: '47', status: 'Offer Sent', score: '95', badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
                      ].map((candidate, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
                                <img src={`https://i.pravatar.cc/100?img=${candidate.img}`} alt={candidate.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-[13px] font-medium text-slate-900">{candidate.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-[13px] text-slate-600">
                            {candidate.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${candidate.badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${candidate.dot}`}></span>
                              {candidate.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-[14px] font-semibold text-slate-900">{candidate.score}</span>
                            <span className="text-[11px] text-slate-500 ml-1">/ 100</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-[13px] font-medium">
                            <button className="text-slate-400 hover:text-blue-600 transition-colors">Review</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
