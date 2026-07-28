import { useNavigate, Link } from 'react-router-dom';
import { Bot, Briefcase, FileText, MousePointerClick, MessageSquare, ArrowRight, Sparkles, Zap, CheckCircle2 } from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';
import { motion, Variants } from 'framer-motion';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
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
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans">
      {/* Deep Space Background */}
      <div className="fixed inset-0 z-0">
        <ParticleBackground />
      </div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background z-0" />

      {/* Floating Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[128px] translate-x-1/3 translate-y-1/3" />

      {/* Navbar */}
      <nav className="relative z-50 w-full border-b border-white/5 glass py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
            <Bot className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
            JobsPilot AI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] border border-indigo-400/20"
          >
            Get Started
          </motion.button>
        </div>
      </nav>

      <main className="relative z-10 flex-grow flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-6 pt-32 pb-24 flex flex-col items-center text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span className="text-sm font-medium text-indigo-200">Job Hunting, Fully Automated</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Your Autonomous <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
                AI Career Copilot
              </span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
              Upload your resume and let our intelligent agents take over. From scraping hidden LinkedIn roles to automatically tailoring your resume to beat the ATS.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/register')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-lg transition-all shadow-[0_0_40px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2 group border border-white/10"
              >
                Launch Your Search
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-xl bg-white/5 text-white font-semibold text-lg border border-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                Explore Features
              </motion.button>
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={fadeInUp} className="mt-20 pt-8 border-t border-white/10 flex flex-col items-center gap-4">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Trusted by candidates landing offers at</p>
              <div className="flex gap-8 opacity-50 grayscale mix-blend-screen">
                {/* Abstract geometric placeholders for logos */}
                <div className="text-xl font-bold font-serif italic tracking-tighter">Acme Corp</div>
                <div className="text-xl font-bold tracking-widest">GLOBAL</div>
                <div className="text-xl font-bold font-mono">/TECH</div>
                <div className="text-xl font-bold opacity-80">NEXUS</div>
              </div>
            </motion.div>

          </motion.div>
        </section>

        {/* Bento Box Features Section */}
        <section id="features" className="w-full max-w-7xl mx-auto px-6 py-32">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">The Ultimate Arsenal</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Stop applying manually. Our AI toolkit gives you an unfair advantage in the modern job market.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,_auto)]">
            
            {/* Bento Item 1: Wide */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="md:col-span-2 glass rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden group hover:border-indigo-500/50 transition-colors"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-0" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30 text-indigo-400">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Live LinkedIn Scraping</h3>
                  <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                    Our agent connects directly to LinkedIn to discover hidden, high-converting roles in real-time. It analyzes millions of jobs and surfaces exactly what matches your unique skill profile using deep semantic search.
                  </p>
                </div>
                <div className="mt-8 flex gap-2 flex-wrap">
                  {['React', 'Node.js', 'Python', 'AWS'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-indigo-200">
                      {skill} matched
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Bento Item 2: Tall/Square */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="glass rounded-3xl p-8 border border-white/5 relative overflow-hidden group hover:border-pink-500/50 transition-colors flex flex-col"
            >
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-pink-500/20 rounded-full blur-[80px] -mr-24 -mb-24 transition-opacity group-hover:opacity-100 opacity-0" />
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6 border border-pink-500/30 text-pink-400">
                <MousePointerClick className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">One-Click Auto-Apply</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Why fill out forms? Let our headless browser agent navigate ATS portals, answer screening questions, and submit applications while you sleep.
              </p>
              <div className="mt-auto p-4 bg-black/40 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm text-slate-300 font-medium">Agent is applying...</span>
                </div>
              </div>
            </motion.div>

            {/* Bento Item 3: Square */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="glass rounded-3xl p-8 border border-white/5 relative overflow-hidden group hover:border-violet-500/50 transition-colors"
            >
              <div className="absolute top-0 left-0 w-48 h-48 bg-violet-500/20 rounded-full blur-[80px] -ml-24 -mt-24 transition-opacity group-hover:opacity-100 opacity-0" />
              <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center mb-6 border border-violet-500/30 text-violet-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">ATS Optimization</h3>
              <p className="text-slate-400 leading-relaxed">
                We instantly rewrite your bullet points using the exact keywords from the job description to guarantee a 95%+ ATS match score.
              </p>
            </motion.div>

            {/* Bento Item 4: Wide */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="md:col-span-2 glass rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden group hover:border-blue-500/50 transition-colors flex flex-col md:flex-row gap-8 items-center"
            >
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] transition-opacity group-hover:opacity-100 opacity-0" />
              <div className="flex-1">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 border border-blue-500/30 text-blue-400">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">AI Interview Prep</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Practice with an AI interviewer trained on the exact company and role you applied for. Receive real-time feedback on your tone, clarity, and STAR method structure.
                </p>
              </div>
              <div className="w-full md:w-1/3 bg-black/40 rounded-2xl p-6 border border-white/5 shrink-0">
                <div className="flex flex-col gap-4">
                  <div className="bg-indigo-500/20 p-3 rounded-lg border border-indigo-500/30 text-sm text-indigo-100 self-start">
                    Tell me about a time you scaled a system.
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg border border-white/10 text-sm text-slate-300 self-end">
                    At Acme, I used Redis...
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full max-w-5xl mx-auto px-6 py-32 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass p-12 md:p-20 rounded-[3rem] border border-indigo-500/30 bg-gradient-to-b from-indigo-900/30 to-background relative overflow-hidden shadow-2xl"
          >
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-50 mix-blend-overlay" />
            
            <div className="relative z-10">
              <Zap className="w-12 h-12 text-indigo-400 mx-auto mb-6" />
              <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-white">Your Next Move Awaits</h2>
              <p className="text-indigo-200 text-xl mb-10 max-w-2xl mx-auto">
                Join thousands of candidates who are automating their job search and landing interviews 10x faster.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="px-10 py-5 rounded-2xl bg-white text-indigo-950 font-black text-xl hover:bg-indigo-50 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 mx-auto group"
              >
                Create Your Free Account
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform text-indigo-600" />
              </motion.button>
              <p className="mt-6 text-sm text-slate-400 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No credit card required. Free forever plan available.
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full border-t border-white/5 bg-black/50 py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <Bot className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <span className="font-bold text-lg text-white block">JobsPilot AI</span>
              <span className="text-sm text-slate-500">&copy; {new Date().getFullYear()} All rights reserved.</span>
            </div>
          </div>
          
          <div className="flex gap-8 text-sm font-medium">
            <a href="https://jobspilotai.space/" className="text-slate-400 hover:text-white transition-colors">Platform</a>
            <Link to="/login" className="text-slate-400 hover:text-white transition-colors">Sign In</Link>
            <a href="https://www.linkedin.com/in/priyatam-chinnari/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1">
              Developed by Priyatam
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
