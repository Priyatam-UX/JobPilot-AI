import { useNavigate, Link } from 'react-router-dom';
import { 
  Bot, 
  FileText, 
  MousePointerClick, 
  ArrowRight, 
  CheckCircle2, 
  Shield,
  Target
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { ParticleBackground } from '../components/ParticleBackground';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030303] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white flex flex-col relative overflow-x-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        <ParticleBackground particleCount={100} speed={0.2} opacity={0.4} />
      </div>
      
      {/* Ambient Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="relative z-50 w-full border-b border-white/[0.04] bg-black/40 backdrop-blur-xl py-4 px-6 md:px-12 flex justify-between items-center sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 p-[1px]">
            <div className="w-full h-full bg-black/80 rounded-[11px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-300" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Jobspilot AI
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/register')}
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-white text-black hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            Get Started Free
          </motion.button>
        </div>
      </nav>

      <main className="relative z-10 flex-grow flex flex-col items-center w-full">
        {/* Massive Centered Hero Section */}
        <section className="w-full max-w-[1400px] mx-auto px-6 pt-24 md:pt-32 pb-20 flex flex-col items-center text-center relative">
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center relative z-20 w-full"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-sm font-bold text-indigo-300 tracking-wide uppercase">AI Analytics Hub is Live</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[1.1] text-white max-w-5xl mx-auto drop-shadow-2xl">
              The Future of your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">Job Search.</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed font-light drop-shadow-lg">
              An enterprise-grade autonomous agent that optimizes your resume, scrapes hidden jobs, and applies on your behalf while you sleep.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 w-full justify-center mb-20">
              <button
                onClick={() => navigate('/register')}
                className="px-10 py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg transition-all hover:scale-105 shadow-[0_0_40px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2 border border-white/20"
              >
                Launch Your Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>

          {/* Massive Glowing Dashboard Image */}
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="w-full relative z-30 perspective-1000 mt-[-2rem] md:mt-[-4rem]"
          >
            {/* Massive Ambient Backlight */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-600/40 via-purple-600/20 to-transparent blur-[120px] scale-110 pointer-events-none" />
            
            {/* The Image Container */}
            <div className="relative w-full max-w-[1200px] mx-auto rounded-3xl border border-white/10 p-1 md:p-3 bg-white/[0.02] backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden transform-gpu hover:scale-[1.01] transition-transform duration-700">
              <img 
                src="/hero-dashboard-final.png" 
                alt="AI Analytics Hub Dashboard" 
                className="w-full h-auto rounded-2xl object-cover shadow-inner"
              />
              
              {/* Glass Reflection Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.08] via-transparent to-white/[0.02] pointer-events-none rounded-2xl" />
            </div>
          </motion.div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="w-full max-w-[1400px] mx-auto px-6 py-32 border-t border-white/[0.04]">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">Enterprise-grade tools for candidates.</h2>
            <p className="text-slate-400 text-lg md:text-xl font-light">We stripped away the noise and built the most powerful, precision-engineered job search platform available.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-10 rounded-[2rem] border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent hover:border-indigo-500/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <MousePointerClick className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Headless Auto-Apply</h3>
              <p className="text-base text-slate-400 leading-relaxed font-light">
                Our autonomous Playwright agents navigate complex ATS portals (Workday, Greenhouse) to submit your applications silently in the background.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-10 rounded-[2rem] border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent hover:border-violet-500/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Dynamic Resume Tailoring</h3>
              <p className="text-base text-slate-400 leading-relaxed font-light">
                Instantly rewrite your bullet points to match the semantic embedding of any job description, guaranteeing top-tier ATS match scores.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-10 rounded-[2rem] border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent hover:border-blue-500/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Privacy & Precision</h3>
              <p className="text-base text-slate-400 leading-relaxed font-light">
                Your data never trains our models. We use strict pgvector similarity search to only surface jobs that mathematically align with your profile.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full mt-10 mb-24 px-6">
          <div className="max-w-[1200px] mx-auto rounded-[3rem] p-12 md:p-24 border border-indigo-500/20 bg-gradient-to-b from-indigo-900/20 to-black relative overflow-hidden flex flex-col items-center text-center shadow-[0_0_100px_rgba(79,70,229,0.15)]">
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-60 mix-blend-screen pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 backdrop-blur-md">
                <Target className="w-10 h-10 text-indigo-400" />
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">Ready to automate your search?</h2>
              <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-2xl font-light">
                Stop filling out forms and start interviewing. Create your free account and deploy your first agent today.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="px-10 py-5 rounded-2xl bg-white text-black font-bold text-lg transition-all hover:bg-indigo-50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:-translate-y-1"
              >
                Create Your Free Account
              </button>
              <p className="mt-8 text-sm text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No credit card required. Free forever.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.04] bg-black py-12 px-6 relative z-20">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
              <Bot className="w-5 h-5 text-black" />
            </div>
            <span className="font-semibold text-base text-white">Jobspilot AI</span>
          </div>
          
          <div className="flex gap-8 text-sm font-medium">
            <a href="https://jobspilotai.space/" className="text-slate-500 hover:text-white transition-colors">Platform</a>
            <Link to="/login" className="text-slate-500 hover:text-white transition-colors">Sign In</Link>
            <a href="https://www.linkedin.com/in/priyatam-chinnari/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
              Developed by Priyatam
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
