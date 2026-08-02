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

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1 }
};

export function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#000000] text-slate-300 font-sans flex flex-col relative overflow-hidden selection:bg-white/20">
      
      {/* Refined Ambient Glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-white/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay pointer-events-none" />

      {/* --- TOP NAVBAR --- */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="h-[80px] w-full border-b border-white/5 bg-[#000000]/50 backdrop-blur-xl flex items-center justify-between px-8 md:px-16 z-50 fixed top-0"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center">
            <Command className="w-4 h-4" />
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-white">JobPilot AI</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-[13px] font-medium text-[#888888] hover:text-white transition-colors">Features</a>
          <a href="#testimonials" className="text-[13px] font-medium text-[#888888] hover:text-white transition-colors">Testimonials</a>
          <a href="#pricing" className="text-[13px] font-medium text-[#888888] hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="text-[13px] font-medium text-[#888888] hover:text-white transition-colors px-4 py-2"
          >
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="group flex items-center gap-2 text-[13px] font-medium text-black px-5 py-2.5 rounded bg-white hover:bg-slate-200 transition-colors"
          >
            Get Started
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </motion.nav>

      {/* --- HERO SECTION --- */}
      <main className="flex-1 flex flex-col items-center justify-center pt-40 pb-24 px-6 relative z-10 text-center">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="whileInView"
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[12px] font-medium text-[#888888] mb-8 backdrop-blur-sm hover:bg-white/[0.05] transition-colors cursor-pointer">
            <Sparkles className="w-3.5 h-3.5 text-slate-400" />
            <span>JobPilot AI 2.0 is now live</span>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-[#666666] mb-6 leading-[1.1]">
            The definitive platform <br className="hidden md:block" /> for your career growth.
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-[#888888] mb-12 max-w-2xl leading-relaxed font-light">
            Stop guessing and start landing offers. JobPilot AI optimizes your resume, discovers hidden roles, and preps you for interviews with pinpoint accuracy.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded bg-white text-black font-medium text-[14px] hover:bg-slate-200 transition-colors"
            >
              Start For Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded bg-transparent border border-white/10 text-white font-medium text-[14px] hover:bg-white/[0.03] transition-colors"
            >
              Sign In to Account
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-32 bg-[#000000] border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">Everything you need.</h2>
            <p className="text-[#888888] max-w-xl mx-auto font-light text-lg">Powerful tools designed to automate the heavy lifting of your job search.</p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            
            <motion.div variants={fadeInUp} className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-[15px] font-medium text-white mb-2 tracking-tight">Smart Resume Library</h3>
              <p className="text-[14px] text-[#888888] leading-relaxed font-light">Instantly tailor your resumes to match specific job descriptions using our advanced AI analysis.</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-[15px] font-medium text-white mb-2 tracking-tight">Job Discovery</h3>
              <p className="text-[14px] text-[#888888] leading-relaxed font-light">Our AI scans thousands of job boards daily to find roles perfectly suited to your unique skillset.</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-[15px] font-medium text-white mb-2 tracking-tight">Application Tracker</h3>
              <p className="text-[14px] text-[#888888] leading-relaxed font-light">Keep a detailed log of every application, interview stage, and offer in one beautiful dashboard.</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-[15px] font-medium text-white mb-2 tracking-tight">AI Career Coach</h3>
              <p className="text-[14px] text-[#888888] leading-relaxed font-light">Practice your interview skills with real-time feedback from our specialized conversational AI coach.</p>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-white/5 bg-[#000000] text-center relative z-10">
        <p className="text-[13px] text-[#666666]">© 2026 JobPilot AI Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
