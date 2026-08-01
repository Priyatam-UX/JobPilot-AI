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

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#02010a] text-slate-100 font-sans relative overflow-hidden flex items-center justify-center p-4 md:p-8 lg:p-12">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        <ParticleBackground particleCount={150} speed={0.3} opacity={0.6} />
      </div>
      
      {/* Heavy Space Gradients (Nebula effect from the image) */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-fuchsia-600/20 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen" />
      <div className="fixed top-[40%] left-[30%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />

      {/* Main Dashboard Container */}
      <main className="relative z-10 w-full max-w-[1600px] h-[90vh] min-h-[800px] bg-[#090b14]/80 backdrop-blur-2xl rounded-3xl border border-indigo-500/20 shadow-[0_0_100px_rgba(79,70,229,0.15)] flex overflow-hidden">
        
        {/* Glow inner border */}
        <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-br from-indigo-500/20 via-transparent to-fuchsia-500/20 pointer-events-none" style={{ WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />

        {/* Sidebar */}
        <aside className="w-[280px] border-r border-white/5 flex flex-col p-6 relative z-10 bg-black/20">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center">
              <div className="w-6 h-6 bg-[#090b14] rounded-md flex items-center justify-center">
                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse" />
              </div>
            </div>
            <span className="font-bold text-sm tracking-widest text-white">AI ANALYTICS HUB</span>
          </div>

          <nav className="space-y-2 mb-10">
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium text-sm shadow-[0_0_15px_rgba(99,102,241,0.2)]">
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
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-400/30 shadow-[0_0_20px_rgba(99,102,241,0.15)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/20 blur-xl rounded-full" />
              <p className="text-xs text-indigo-200 font-medium mb-1">Total Active Jobs</p>
              <p className="text-3xl font-bold text-white">45</p>
            </div>
            {/* Stat 2 */}
            <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/20 blur-xl rounded-full" />
              <p className="text-xs text-blue-200 font-medium mb-1">New Applicants Today</p>
              <p className="text-3xl font-bold text-white">138</p>
            </div>
            {/* Stat 3 */}
            <div className="p-4 rounded-2xl bg-fuchsia-950/30 border border-fuchsia-400/30 shadow-[0_0_20px_rgba(217,70,239,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-fuchsia-500/20 blur-xl rounded-full" />
              <p className="text-xs text-fuchsia-200 font-medium mb-1">Average Time-to-Hire</p>
              <p className="text-3xl font-bold text-white">18 Days</p>
            </div>
            {/* Stat 4 */}
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/20 blur-xl rounded-full" />
              <p className="text-xs text-cyan-200 font-medium mb-1">Offer Acceptance Rate</p>
              <p className="text-3xl font-bold text-white">89%</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
          
          {/* Header */}
          <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/10">
            <div className="flex items-center gap-4 w-96">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/login')} className="text-sm font-medium text-slate-300 hover:text-white mr-2">
                Sign In
              </button>
              <button onClick={() => navigate('/register')} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all">
                Get Started
              </button>
              <div className="w-px h-6 bg-white/10 mx-2" />
              <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full border border-[#090b14]" />
              </button>
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-9 h-9 rounded-full bg-slate-700 ml-2 overflow-hidden border border-white/20">
                <img src="https://i.pravatar.cc/100?img=11" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </header>

          {/* Dashboard Grid */}
          <div className="p-8 flex-1 overflow-y-auto">
            <div className="flex justify-between items-end mb-6">
              <h1 className="text-xl font-bold tracking-wider text-white">JOB APPLICATION PIPELINE</h1>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300 cursor-pointer">
                Year analytics <ChevronDown className="w-3 h-3 ml-1" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              
              {/* Funnel Chart (Left column, spanning 2 rows) */}
              <div className="lg:col-span-1 lg:row-span-2 rounded-2xl bg-black/40 border border-white/5 p-6 relative overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-sm font-semibold text-slate-200">TALENT PIPELINE OVERVIEW</h3>
                  <MoreVertical className="w-4 h-4 text-slate-500" />
                </div>
                
                {/* Visual Funnel Representation */}
                <div className="flex-1 relative flex flex-col items-center justify-center gap-4">
                  {/* Funnel Background Shape */}
                  <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-20">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-3/4 h-full text-indigo-500">
                      <path d="M0,0 L100,0 L70,100 L30,100 Z" fill="currentColor" />
                    </svg>
                  </div>
                  
                  {/* Funnel Stages */}
                  {[
                    { label: 'Applications', value: '1,450', color: 'from-blue-500 to-indigo-500', width: 'w-full', delay: 0 },
                    { label: 'Screened', value: '810', color: 'from-indigo-500 to-purple-500', width: 'w-4/5', delay: 0.1 },
                    { label: 'Interviewed', value: '320', color: 'from-purple-500 to-fuchsia-500', width: 'w-3/5', delay: 0.2 },
                    { label: 'Offers', value: '145', color: 'from-fuchsia-500 to-pink-500', width: 'w-2/5', delay: 0.3 },
                    { label: 'Hired', value: '67', color: 'from-cyan-500 to-blue-500', width: 'w-1/3', delay: 0.4 },
                  ].map((stage, i) => (
                    <div key={i} className={`${stage.width} p-3 rounded-xl bg-gradient-to-r ${stage.color} p-[1px] relative shadow-[0_0_20px_rgba(0,0,0,0.5)] z-10`}>
                      <div className="w-full h-full bg-black/60 backdrop-blur-md rounded-[11px] p-2 flex flex-col items-center justify-center text-center">
                        <span className="text-xs text-white/70 font-medium mb-1">{stage.label}</span>
                        <span className="text-xl font-bold text-white">{stage.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Line Chart (Middle column, top) */}
              <div className="rounded-2xl bg-black/40 border border-white/5 p-6 relative overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-semibold text-slate-200">Hiring Activity Trend</h3>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1.5 text-xs text-slate-400"><div className="w-2 h-2 rounded-full bg-blue-500" /> Applications</span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400"><div className="w-2 h-2 rounded-full bg-fuchsia-500" /> Hires</span>
                  </div>
                </div>
                {/* CSS Line Chart Mockup */}
                <div className="flex-1 relative w-full h-32 flex items-end border-l border-b border-white/10 pb-2 pl-2">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,80 L20,40 L40,60 L60,20 L80,30 L100,10" fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ filter: 'drop-shadow(0px 4px 6px rgba(59,130,246,0.5))' }} />
                    <path d="M0,90 L20,70 L40,80 L60,50 L80,60 L100,40" fill="none" stroke="#d946ef" strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ filter: 'drop-shadow(0px 4px 6px rgba(217,70,239,0.5))' }} />
                  </svg>
                  {/* Axis labels */}
                  <div className="absolute -bottom-6 w-full flex justify-between text-[8px] text-slate-500 pr-2">
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
                  </div>
                  <div className="absolute -left-6 h-full flex flex-col justify-between text-[8px] text-slate-500 pb-2">
                    <span>1000</span><span>500</span><span>250</span><span>0</span>
                  </div>
                </div>
              </div>

              {/* Top Right Card (Total Active Jobs glowing card) */}
              <div className="rounded-2xl bg-gradient-to-br from-indigo-900/40 to-fuchsia-900/40 border border-fuchsia-500/30 p-6 relative overflow-hidden shadow-[0_0_30px_rgba(217,70,239,0.2)]">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-fuchsia-500/30 blur-3xl rounded-full" />
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-semibold text-indigo-100">Total Active Jobs</h3>
                  <MoreVertical className="w-4 h-4 text-indigo-300" />
                </div>
                <p className="text-4xl font-bold text-white mb-6">45</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-white">138</span>
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                    ↑ 12%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-indigo-200/70 border-t border-white/10 pt-4">
                  <div className="flex flex-col"><span className="font-semibold text-white">Applications</span><span>Hires</span></div>
                  <div className="flex flex-col"><span className="font-semibold text-white">Average</span><span>Time-to</span></div>
                  <div className="flex flex-col"><span className="font-semibold text-white">98%</span><span>Others</span></div>
                </div>
              </div>

              {/* Candidate Source Donut (Middle row, left/middle) */}
              <div className="rounded-2xl bg-black/40 border border-white/5 p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-slate-200">Candidate Source Distribution</h3>
                  <MoreVertical className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 flex items-center justify-center gap-8">
                  {/* CSS Donut Chart */}
                  <div className="relative w-32 h-32 rounded-full border-[12px] border-slate-800 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <div className="absolute inset-[-12px] rounded-full border-[12px] border-transparent border-t-indigo-500 border-r-indigo-500 rotate-45" />
                    <div className="absolute inset-[-12px] rounded-full border-[12px] border-transparent border-b-fuchsia-500 -rotate-45" />
                    <div className="absolute inset-[-12px] rounded-full border-[12px] border-transparent border-l-blue-500 rotate-180" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xs text-slate-300"><div className="w-2 h-2 rounded-full bg-indigo-500" /> LinkedIn 42%</div>
                    <div className="flex items-center gap-2 text-xs text-slate-300"><div className="w-2 h-2 rounded-full bg-blue-500" /> Direct 28%</div>
                    <div className="flex items-center gap-2 text-xs text-slate-300"><div className="w-2 h-2 rounded-full bg-fuchsia-500" /> Agencies 18%</div>
                  </div>
                </div>
              </div>

              {/* Recruiter Performance Bar Chart (Middle row, right) */}
              <div className="rounded-2xl bg-black/40 border border-white/5 p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-semibold text-slate-200">Recruiter Performance</h3>
                  <MoreVertical className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 flex items-end justify-between border-b border-l border-white/10 pb-2 pl-2 px-2 gap-4 h-32 relative">
                  {[60, 80, 40, 90, 70, 50].map((h, i) => (
                    <div key={i} className="w-6 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-sm shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ height: `${h}%` }} />
                  ))}
                   {/* Axis labels */}
                   <div className="absolute -bottom-6 w-full flex justify-between text-[8px] text-slate-500 pr-2">
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                  </div>
                </div>
              </div>

              {/* Recent Candidates (Bottom row, spanning 3 columns) */}
              <div className="lg:col-span-3 rounded-2xl bg-black/40 border border-white/5 p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-slate-200 tracking-wider">RECENT CANDIDATES</h3>
                  <span className="text-xs font-semibold text-indigo-400 cursor-pointer">CANDIDATE INSIGHTS</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Candidate 1 */}
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src="https://i.pravatar.cc/100?img=5" alt="Alice" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-white">Alice Wong</p>
                        <p className="text-xs text-slate-400">Frontend Developer</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/30">Interviewing</span>
                          <span className="text-[10px] text-emerald-400 font-medium">Score 98</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-indigo-500 flex items-center justify-center text-sm font-bold text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                      90
                    </div>
                  </div>
                  {/* Candidate 2 */}
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src="https://i.pravatar.cc/100?img=11" alt="Michael" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-white">Michael Chen</p>
                        <p className="text-xs text-slate-400">Data Scientist</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">Interviewing</span>
                          <span className="text-[10px] text-emerald-400 font-medium">Score 92</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-fuchsia-500 flex items-center justify-center text-sm font-bold text-white shadow-[0_0_10px_rgba(217,70,239,0.5)]">
                      90
                    </div>
                  </div>
                  {/* Candidate 3 */}
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex items-center justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none" />
                    <div className="flex items-center gap-3 relative z-10">
                      <img src="https://i.pravatar.cc/100?img=33" alt="Michael" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-white">David Lee</p>
                        <p className="text-xs text-slate-400">Backend Engineer</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">Hired</span>
                          <span className="text-[10px] text-emerald-400 font-medium">Score 88</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center text-sm font-bold text-white shadow-[0_0_10px_rgba(16,185,129,0.5)] relative z-10">
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
