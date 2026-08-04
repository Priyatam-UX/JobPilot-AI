import { Link } from 'react-router-dom';
import { 
  Command, 
  ArrowRight, 
  FileText,
  Briefcase,
  MessageSquare,
  Sparkles,
  BarChart2,
  Code2,
  Cpu,
  Database,
  Layers
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const abstractCardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const } }
};

export function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-[#030303] text-slate-300 font-sans flex flex-col relative overflow-hidden selection:bg-white/20">
      
      {/* Background Noise & Subtle Glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] mix-blend-overlay pointer-events-none" />

      {/* --- TOP NAVBAR --- */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="h-[80px] w-full border-b border-white/5 bg-[#030303]/70 backdrop-blur-xl flex items-center justify-between px-8 md:px-16 z-50 fixed top-0"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-white text-black">
            <Command className="w-4 h-4" />
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-white">Priyatam's JobPilot AI</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-[13px] font-medium text-[#888888] hover:text-white transition-colors">Platform</a>
          <a href="#tech-stack" className="text-[13px] font-medium text-[#888888] hover:text-white transition-colors">Technology</a>
          <a href="#architecture" className="text-[13px] font-medium text-[#888888] hover:text-white transition-colors">Architecture</a>
        </div>

        <div className="flex items-center gap-6">
          <Link 
            to="/login" 
            className="text-[13px] font-medium text-[#888888] hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link 
            to="/register" 
            className="group flex items-center gap-2 text-[13px] font-medium text-black px-5 py-2 rounded bg-white hover:bg-slate-200 transition-colors"
          >
            Get started
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </motion.nav>

      {/* --- HERO SECTION --- */}
      <main className="flex-1 flex flex-col justify-center pt-48 pb-32 px-6 relative z-10 w-full max-w-[1400px] mx-auto">
        <motion.div 
          style={{ y: yParallax, opacity: opacityFade }}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row items-center gap-20 w-full"
        >
          {/* Hero Content (Left) */}
          <div className="flex-1 flex flex-col items-start text-left z-20">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-white/10 bg-white/[0.02] backdrop-blur-sm text-[12px] font-medium text-[#888888] mb-8">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>JobPilot AI 2.0 Engine</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-6xl md:text-[88px] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-[#555555] mb-8 leading-[1.05]">
              Recruitment, <br />
              engineered.
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-[#888888] mb-12 max-w-xl leading-relaxed font-light">
              A meticulously crafted intelligence layer for your hiring pipeline. Screen, rank, and interview with algorithmic precision. No guesswork, just pure performance.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-5">
              <Link 
                to="/register" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded bg-white text-black font-medium text-[14px] hover:bg-slate-200 hover:scale-[1.02] transition-all duration-300"
              >
                Deploy Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded bg-transparent border border-white/10 text-white font-medium text-[14px] hover:bg-white/[0.03] transition-colors"
              >
                Access Console
              </Link>
            </motion.div>
          </div>

          {/* Abstract Code-Driven UI Illustration (Right) */}
          <motion.div variants={fadeUp} className="flex-1 w-full relative h-[500px] flex items-center justify-center pointer-events-none">
            {/* Base Glass Pane */}
            <motion.div 
              initial={{ rotateX: 20, rotateY: -10, opacity: 0 }}
              animate={{ rotateX: 0, rotateY: 0, opacity: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="absolute w-full max-w-[500px] aspect-square rounded-[32px] border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-2xl shadow-[0_0_100px_rgba(255,255,255,0.03)] flex flex-col p-6 overflow-hidden"
            >
              {/* Animated Inner Mock UI Elements */}
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <div className="w-32 h-4 rounded bg-white/10 animate-pulse" />
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                </div>
              </div>

              {/* Staggered Rows */}
              <div className="flex flex-col gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div 
                    key={i}
                    custom={i}
                    variants={abstractCardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    className="w-full h-16 rounded-xl border border-white/5 bg-white/[0.02] flex items-center px-4 gap-4"
                  >
                    <div className="w-8 h-8 rounded bg-white/10" />
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="w-1/3 h-2 rounded bg-white/20" />
                      <div className="w-1/4 h-2 rounded bg-white/5" />
                    </div>
                    <div className="w-16 h-4 rounded bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <div className="w-8 h-1 rounded bg-emerald-500/50" />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Glowing Orb Overlay */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-white blur-[100px]"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      {/* --- BENTO BOX FEATURES --- */}
      <section id="features" className="py-32 bg-[#030303] relative z-10 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div 
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-left mb-20 max-w-3xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6">A complete intelligence suite.</h2>
            <p className="text-[#888888] text-xl leading-relaxed font-light">Everything you need to source, track, and close the best candidates in the market, beautifully integrated into one uncompromising platform.</p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            
            {/* Bento Item 1 - Large */}
            <motion.div variants={fadeUp} className="md:col-span-2 p-10 rounded-[32px] bg-[#0a0a0a] border border-white/5 hover:border-white/10 hover:bg-[#0c0c0c] transition-colors group relative overflow-hidden flex flex-col justify-end min-h-[400px]">
              <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none" />
              <div className="relative z-10 w-full md:w-3/5">
                <div className="w-12 h-12 rounded border border-white/10 flex items-center justify-center mb-8 bg-white/5 group-hover:bg-white/10 transition-colors">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Algorithmic Resume Screening</h3>
                <p className="text-[15px] text-[#888888] leading-relaxed font-light">Automatically extract skills, score experience, and rank hundreds of resumes in seconds with human-level accuracy.</p>
              </div>
            </motion.div>

            {/* Bento Item 2 - Small */}
            <motion.div variants={fadeUp} className="md:col-span-1 p-10 rounded-[32px] bg-[#0a0a0a] border border-white/5 hover:border-white/10 hover:bg-[#0c0c0c] transition-colors group flex flex-col">
              <div className="w-12 h-12 rounded border border-white/10 flex items-center justify-center mb-8 bg-white/5 group-hover:bg-white/10 transition-colors">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Role Discovery</h3>
              <p className="text-[15px] text-[#888888] leading-relaxed font-light">Identify niche talent pools and match candidates to internal roles automatically.</p>
            </motion.div>

            {/* Bento Item 3 - Small */}
            <motion.div variants={fadeUp} className="md:col-span-1 p-10 rounded-[32px] bg-[#0a0a0a] border border-white/5 hover:border-white/10 hover:bg-[#0c0c0c] transition-colors group flex flex-col">
              <div className="w-12 h-12 rounded border border-white/10 flex items-center justify-center mb-8 bg-white/5 group-hover:bg-white/10 transition-colors">
                <BarChart2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Pipeline Tracker</h3>
              <p className="text-[15px] text-[#888888] leading-relaxed font-light">A pristine, visual overview of your entire hiring funnel from source to offer.</p>
            </motion.div>

            {/* Bento Item 4 - Large */}
            <motion.div variants={fadeUp} className="md:col-span-2 p-10 rounded-[32px] bg-[#050505] border border-white/5 hover:border-white/10 transition-colors group relative overflow-hidden flex flex-col justify-end min-h-[400px]">
              <div className="absolute top-[20%] right-[-10%] w-[50%] h-[80%] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="relative z-10 w-full md:w-3/5">
                <div className="w-12 h-12 rounded border border-white/10 flex items-center justify-center mb-8 bg-white/5 group-hover:bg-white/10 transition-colors backdrop-blur-md">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Conversational AI Co-Pilot</h3>
                <p className="text-[15px] text-[#888888] leading-relaxed font-light">Conduct initial screening interviews automatically with our specialized conversational AI, capable of deep technical qualification.</p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* --- TECHNOLOGY SECTION --- */}
      <section id="tech-stack" className="py-32 bg-[#030303] relative z-10 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div 
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-left mb-20 max-w-3xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6">Built with industry standard tech.</h2>
            <p className="text-[#888888] text-xl leading-relaxed font-light">A robust, modern development stack selected for speed, security, and machine learning performance.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <motion.div variants={fadeUp} className="p-8 rounded-[24px] bg-[#0a0a0a] border border-white/5 hover:bg-[#0c0c0c] transition-colors group">
              <div className="w-10 h-10 rounded border border-white/10 flex items-center justify-center mb-6 bg-white/5 group-hover:bg-white/10 transition-colors">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 tracking-tight">React & TypeScript</h3>
              <p className="text-sm text-[#888888] leading-relaxed font-light">Type-safe components, custom hooks, and Tailwind CSS templates providing a modern SPA interface.</p>
            </motion.div>

            <motion.div variants={fadeUp} className="p-8 rounded-[24px] bg-[#0a0a0a] border border-white/5 hover:bg-[#0c0c0c] transition-colors group">
              <div className="w-10 h-10 rounded border border-white/10 flex items-center justify-center mb-6 bg-white/5 group-hover:bg-white/10 transition-colors">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 tracking-tight">FastAPI</h3>
              <p className="text-sm text-[#888888] leading-relaxed font-light">Asynchronous Python routing, request validations, and real-time state synchronization using WebSockets.</p>
            </motion.div>

            <motion.div variants={fadeUp} className="p-8 rounded-[24px] bg-[#0a0a0a] border border-white/5 hover:bg-[#0c0c0c] transition-colors group">
              <div className="w-10 h-10 rounded border border-white/10 flex items-center justify-center mb-6 bg-white/5 group-hover:bg-white/10 transition-colors">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 tracking-tight">OpenAI Engine</h3>
              <p className="text-sm text-[#888888] leading-relaxed font-light">Advanced language models parsing skills, evaluating resumes, and scoring behavioral answers in real-time.</p>
            </motion.div>

            <motion.div variants={fadeUp} className="p-8 rounded-[24px] bg-[#0a0a0a] border border-white/5 hover:bg-[#0c0c0c] transition-colors group">
              <div className="w-10 h-10 rounded border border-white/10 flex items-center justify-center mb-6 bg-white/5 group-hover:bg-white/10 transition-colors">
                <Database className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 tracking-tight">PostgreSQL & JWT</h3>
              <p className="text-sm text-[#888888] leading-relaxed font-light">Supabase database hosting containing relational user profiles, analytics triggers, and secure auth tokens.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- SYSTEM ARCHITECTURE SECTION --- */}
      <section id="architecture" className="py-32 bg-[#030303] relative z-10 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div 
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-left mb-20 max-w-3xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6">Robust architecture design.</h2>
            <p className="text-[#888888] text-xl leading-relaxed font-light">A clean, decoupled architecture separating presentation, business logic execution, and database hosting layers.</p>
          </motion.div>

          <motion.div 
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col md:flex-row items-stretch justify-between gap-8 p-10 rounded-[32px] bg-[#0a0a0a] border border-white/5 relative overflow-hidden"
          >
            {/* Front Card */}
            <div className="flex-1 p-6 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col justify-between text-left">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Tier 1 • Client</div>
                <h4 className="text-xl font-bold text-white mb-3">Single Page Application</h4>
                <p className="text-sm text-slate-400 font-light leading-relaxed mb-6">React frontend managing local storage, state cycles (Zustand), and socket streams. Displays charts, pipeline tracking cards, and the coach console.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white">Vite / TS</span>
                <span className="text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white">Tailwind CSS</span>
                <span className="text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white">Zustand</span>
              </div>
            </div>

            {/* Middle Card */}
            <div className="flex-1 p-6 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col justify-between text-left">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Tier 2 • Services</div>
                <h4 className="text-xl font-bold text-white mb-3">FastAPI Middleware</h4>
                <p className="text-sm text-slate-400 font-light leading-relaxed mb-6">Asynchronous core handles data requests, user authentication, and serves WebSocket triggers. Orchestrates requests between the storage engine and OpenAI.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white">Uvicorn / FastAPI</span>
                <span className="text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white">Python API</span>
                <span className="text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white">WebSockets</span>
              </div>
            </div>

            {/* Back Card */}
            <div className="flex-1 p-6 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col justify-between text-left">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Tier 3 • Platform</div>
                <h4 className="text-xl font-bold text-white mb-3">Storage & Intelligence</h4>
                <p className="text-sm text-slate-400 font-light leading-relaxed mb-6">Supabase host stores relational user tables, tracked applications, and system logs. Generative AI processes candidate resume checkers and interview coaching mocks.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white">PostgreSQL</span>
                <span className="text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white">Supabase</span>
                <span className="text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white">OpenAI API</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-16 border-t border-white/5 bg-[#030303] text-left px-6 relative z-10">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <p className="text-[13px] text-[#555555] font-medium tracking-wide">© 2026 PRIYATAM'S JOBPILOT AI. ENGINEERED WITH PRECISION.</p>
          <p className="text-[13px] text-[#555555] font-medium tracking-wide">Created by Priyatam</p>
        </div>
      </footer>
    </div>
  );
}
