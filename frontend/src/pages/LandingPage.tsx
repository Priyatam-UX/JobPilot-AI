import { Link } from 'react-router-dom';
import { 
  Command, 
  ArrowRight, 
  FileText,
  Briefcase,
  Target,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.15 }
};

export function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#fdfdfc] text-slate-900 font-sans flex flex-col relative overflow-hidden selection:bg-blue-500/20">
      
      {/* Exquisite Light Theme Ambient Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#fce7f3]/60 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-[#e0f2fe]/60 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] mix-blend-overlay pointer-events-none" />

      {/* --- TOP NAVBAR --- */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="h-[80px] w-full border-b border-slate-200/60 bg-[#fdfdfc]/80 backdrop-blur-xl flex items-center justify-between px-8 md:px-16 z-50 fixed top-0"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-md">
            <Command className="w-4 h-4" />
          </div>
          <span className="font-bold text-[16px] tracking-tight text-slate-900">JobPilot AI</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-[14px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Platform</a>
          <a href="#testimonials" className="text-[14px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Customers</a>
          <a href="#pricing" className="text-[14px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="text-[14px] font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
          >
            Sign in
          </Link>
          <Link 
            to="/register" 
            className="group flex items-center gap-2 text-[14px] font-medium text-white px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)]"
          >
            Get started
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </motion.nav>

      {/* --- HERO SECTION --- */}
      <main className="flex-1 flex flex-col items-center pt-40 pb-24 px-6 relative z-10 w-full max-w-7xl mx-auto">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="whileInView"
          className="flex flex-col lg:flex-row items-center gap-16 w-full"
        >
          {/* Hero Content */}
          <div className="flex-1 flex flex-col items-start text-left">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-[13px] font-medium text-blue-700 mb-8 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Introducing JobPilot AI 2.0
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-[80px] font-bold tracking-tight text-slate-900 mb-6 leading-[1.05]">
              Hire smarter, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">scale faster.</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl leading-relaxed">
              JobPilot AI automates the heavy lifting of recruitment. Screen, interview, and hire top-tier talent with unprecedented precision using our next-generation AI platform.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4">
              <Link 
                to="/register" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-blue-600 text-white font-semibold text-[15px] hover:bg-blue-700 transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_28px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 duration-200"
              >
                Start free trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold text-[15px] hover:bg-slate-50 transition-colors shadow-sm"
              >
                Contact sales
              </Link>
            </motion.div>
          </div>

          {/* Hero Image / Illustration */}
          <motion.div variants={fadeInUp} className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-fuchsia-500/10 rounded-[40px] blur-3xl transform -rotate-6 scale-105" />
            <div className="relative bg-white p-2 rounded-[32px] border border-slate-200/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
              <img 
                src="/hero-illustration.jpg" 
                alt="JobPilot AI Dashboard Abstract Representation" 
                className="w-full h-auto rounded-[24px] object-cover aspect-video"
              />
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* --- BENTO BOX FEATURES --- */}
      <section id="features" className="py-32 bg-white relative z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-24 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">A complete intelligence suite.</h2>
            <p className="text-slate-600 text-xl leading-relaxed">Everything you need to source, track, and close the best candidates in the market, beautifully integrated into one platform.</p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            
            {/* Bento Item 1 - Large */}
            <motion.div variants={fadeInUp} className="md:col-span-2 p-10 rounded-[32px] bg-slate-50 border border-slate-200 hover:border-blue-200 transition-colors group relative overflow-hidden flex flex-col justify-end min-h-[360px]">
              <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-blue-100/50 to-transparent pointer-events-none" />
              <div className="relative z-10 w-full md:w-3/5">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">AI Resume Screening</h3>
                <p className="text-lg text-slate-600 leading-relaxed">Automatically extract skills, score experience, and rank hundreds of resumes in seconds with human-level accuracy.</p>
              </div>
            </motion.div>

            {/* Bento Item 2 - Small */}
            <motion.div variants={fadeInUp} className="md:col-span-1 p-10 rounded-[32px] bg-slate-50 border border-slate-200 hover:border-blue-200 transition-colors group flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform duration-300">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Role Discovery</h3>
              <p className="text-lg text-slate-600 leading-relaxed">Identify niche talent pools and match candidates to internal roles automatically.</p>
            </motion.div>

            {/* Bento Item 3 - Small */}
            <motion.div variants={fadeInUp} className="md:col-span-1 p-10 rounded-[32px] bg-slate-50 border border-slate-200 hover:border-blue-200 transition-colors group flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform duration-300">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Pipeline Tracker</h3>
              <p className="text-lg text-slate-600 leading-relaxed">A pristine, visual overview of your entire hiring funnel from source to offer.</p>
            </motion.div>

            {/* Bento Item 4 - Large */}
            <motion.div variants={fadeInUp} className="md:col-span-2 p-10 rounded-[32px] bg-slate-900 text-white border border-slate-800 hover:border-slate-700 transition-colors group relative overflow-hidden flex flex-col justify-end min-h-[360px]">
              <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[80%] bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />
              <div className="relative z-10 w-full md:w-3/5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-6 backdrop-blur-md group-hover:scale-105 transition-transform duration-300">
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Conversational AI Co-Pilot</h3>
                <p className="text-lg text-slate-300 leading-relaxed">Conduct initial screening interviews automatically with our specialized conversational AI, capable of deep technical qualification.</p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-16 border-t border-slate-200 bg-[#fdfdfc] text-center relative z-10">
        <p className="text-[14px] text-slate-500 font-medium">© 2026 JobPilot AI Inc. Built with unprecedented precision.</p>
      </footer>
    </div>
  );
}
