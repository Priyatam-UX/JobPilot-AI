import { Link } from 'react-router-dom';
import { 
  Command, 
  ArrowRight, 
  Sparkles,
  FileText,
  Briefcase,
  Target,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

export function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#050505] text-slate-200 font-sans flex flex-col relative overflow-hidden selection:bg-indigo-500/30">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

      {/* --- TOP NAVBAR --- */}
      <nav className="h-[80px] w-full border-b border-white/[0.05] bg-[#0a0a0c]/50 backdrop-blur-md flex items-center justify-between px-8 md:px-16 z-50 fixed top-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-fuchsia-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <Command className="w-4 h-4" />
          </div>
          <span className="font-bold text-[16px] tracking-tight text-white">JobPilot AI</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-[14px] font-medium text-slate-400 hover:text-white transition-colors">Features</a>
          <a href="#testimonials" className="text-[14px] font-medium text-slate-400 hover:text-white transition-colors">Testimonials</a>
          <a href="#pricing" className="text-[14px] font-medium text-slate-400 hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="text-[14px] font-medium text-slate-300 hover:text-white transition-colors px-4 py-2"
          >
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="group relative inline-flex items-center justify-center gap-2 text-[14px] font-medium text-white px-5 py-2.5 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all overflow-hidden"
          >
            <span className="relative z-10">Get Started</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-[12px] font-medium text-slate-300 mb-8 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>JobPilot AI 2.0 is now live</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-6 leading-tight">
            Your Ultimate AI-Powered <br className="hidden md:block" /> Career Advantage.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
            Stop guessing and start landing offers. JobPilot AI optimizes your resume, discovers hidden roles, and preps you for interviews with pinpoint accuracy.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-[15px] hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              Start For Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/[0.05] border border-white/10 text-white font-semibold text-[15px] hover:bg-white/[0.1] transition-colors"
            >
              Sign In to Account
            </Link>
          </div>
        </motion.div>
      </main>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 bg-[#0a0a0c] border-t border-white/[0.05] relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Everything you need to get hired.</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Powerful tools designed to automate the heavy lifting of your job search, giving you back time to focus on what matters.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-8 rounded-[24px] bg-[#0f0f11] border border-white/[0.05] hover:border-indigo-500/30 transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Resume Library</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Instantly tailor your resumes to match specific job descriptions using our advanced AI analysis.</p>
            </div>

            <div className="p-8 rounded-[24px] bg-[#0f0f11] border border-white/[0.05] hover:border-fuchsia-500/30 transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6 text-fuchsia-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Job Discovery</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Our AI scans thousands of job boards daily to find roles perfectly suited to your unique skillset.</p>
            </div>

            <div className="p-8 rounded-[24px] bg-[#0f0f11] border border-white/[0.05] hover:border-blue-500/30 transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Application Tracker</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Keep a detailed log of every application, interview stage, and offer in one beautiful dashboard.</p>
            </div>

            <div className="p-8 rounded-[24px] bg-[#0f0f11] border border-white/[0.05] hover:border-emerald-500/30 transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Career Coach</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Practice your interview skills with real-time feedback from our specialized conversational AI coach.</p>
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 border-t border-white/[0.05] bg-[#050505] text-center relative z-10">
        <p className="text-sm text-slate-500">© 2026 JobPilot AI Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
