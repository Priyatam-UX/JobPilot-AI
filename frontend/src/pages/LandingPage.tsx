import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ParticleBackground } from '../components/ParticleBackground';
import { BrainCircuit, Sparkles, Zap, Shield, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030303] text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Background layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ParticleBackground particleCount={80} speed={0.2} opacity={0.3} />
        {/* Subtle radial gradients for depth */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 lg:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BrainCircuit className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">Copilot</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Sign in
          </button>
          <button onClick={() => navigate('/register')} className="text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-md transition-all flex items-center gap-2 group">
            Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-24 pb-32 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8"
        >
          <Sparkles className="w-3 h-3" />
          Introducing Copilot 2.0
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-8 max-w-4xl"
        >
          The AI Operating System <br className="hidden md:block" /> for Recruitment.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed"
        >
          Automate sourcing, screen candidates with superhuman precision, and hire top talent 10x faster. Everything you need in one beautiful dashboard.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-24"
        >
          <button onClick={() => navigate('/register')} className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
            Start free trial
          </button>
          <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2 backdrop-blur-md group">
            Book a demo <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </button>
        </motion.div>

        {/* Hero Image Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, type: 'spring', bounce: 0.4 }}
          className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(79,70,229,0.15)] ring-1 ring-white/5"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent z-10" />
          <img 
            src="/hero-dashboard-final.png" 
            alt="Product Dashboard" 
            className="w-full h-auto object-cover rounded-xl border border-white/5"
          />
        </motion.div>
      </main>

      {/* Bento Box Features */}
      <section className="relative z-10 py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/5">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Built for modern hiring teams</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Powerful features wrapped in an intuitive interface that your team will actually love using.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 (Large) */}
          <div className="md:col-span-2 rounded-3xl bg-white/[0.02] border border-white/5 p-8 hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full group-hover:bg-indigo-500/20 transition-colors" />
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20">
              <Zap className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Lightning Fast Sourcing</h3>
            <p className="text-slate-400 mb-8 max-w-md">Our AI scans millions of profiles across the web and instantly surfaces the top 1% of candidates matching your exact criteria.</p>
            <ul className="space-y-3">
              {['Automated outreach', 'Passive candidate discovery', 'Smart filtering'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="rounded-3xl bg-white/[0.02] border border-white/5 p-8 hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 blur-[100px] rounded-full group-hover:bg-fuchsia-500/20 transition-colors" />
            <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 flex items-center justify-center mb-6 border border-fuchsia-500/20">
              <BrainCircuit className="w-6 h-6 text-fuchsia-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Predictive Analytics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Stop guessing. Get AI-driven insights on candidate retention probability and performance forecasts before making an offer.</p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-3xl bg-white/[0.02] border border-white/5 p-8 hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Enterprise Security</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Bank-grade encryption and SOC2 compliance out of the box. Your data is strictly segregated and never used to train global models.</p>
          </div>
          
           {/* Feature 4 (Medium) */}
           <div className="md:col-span-2 rounded-3xl bg-white/[0.02] border border-white/5 p-8 hover:bg-white/[0.04] transition-colors relative overflow-hidden flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-3 text-white">Ready to transform your hiring?</h3>
            <p className="text-slate-400 mb-6 max-w-md">Join thousands of forward-thinking companies building their dream teams with Copilot.</p>
            <div>
              <button onClick={() => navigate('/register')} className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors">
                Get started today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6 lg:px-12 text-center">
        <p className="text-slate-500 text-sm">© 2026 Job Copilot Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
