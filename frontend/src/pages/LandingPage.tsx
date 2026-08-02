import { Link } from 'react-router-dom';
import { 
  Command, 
  ArrowRight, 
  FileText,
  Briefcase,
  MessageSquare,
  Sparkles,
  BarChart2
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
          <a href="#testimonials" className="text-[13px] font-medium text-[#888888] hover:text-white transition-colors">Customers</a>
          <a href="#pricing" className="text-[13px] font-medium text-[#888888] hover:text-white transition-colors">Pricing</a>
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

      {/* --- TESTIMONIALS SECTION --- */}
      <section id="testimonials" className="py-32 bg-[#030303] relative z-10 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div 
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-left mb-20 max-w-3xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6">Trusted by developers at leading companies.</h2>
            <p className="text-[#888888] text-xl leading-relaxed font-light">See how JobPilot AI helps engineers navigate their careers and land dream offers.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeUp} className="p-8 rounded-[24px] bg-[#0a0a0a] border border-white/5 flex flex-col justify-between">
              <p className="text-slate-300 text-base leading-relaxed font-light mb-8">
                "JobPilot AI completely transformed my job search. The resume optimization was so precise that I started getting callbacks from Tier-1 tech companies within 3 days."
              </p>
              <div>
                <h4 className="text-sm font-bold text-white">Sarah Jenkins</h4>
                <p className="text-xs text-slate-500 mt-1">Software Engineer, Vercel</p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="p-8 rounded-[24px] bg-[#0a0a0a] border border-white/5 flex flex-col justify-between">
              <p className="text-slate-300 text-base leading-relaxed font-light mb-8">
                "The mock interviews with the Conversational AI Coach felt incredibly realistic. It helped me structure my STAR answers and walk into the loop with total confidence."
              </p>
              <div>
                <h4 className="text-sm font-bold text-white">David Chen</h4>
                <p className="text-xs text-slate-500 mt-1">Senior Frontend Lead, Stripe</p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="p-8 rounded-[24px] bg-[#0a0a0a] border border-white/5 flex flex-col justify-between">
              <p className="text-slate-300 text-base leading-relaxed font-light mb-8">
                "I tracked over 50 applications using the pipeline tracker. The AI auto-discovery found hidden listings that fit my background that I hadn't seen anywhere else."
              </p>
              <div>
                <h4 className="text-sm font-bold text-white">Marcus Vance</h4>
                <p className="text-xs text-slate-500 mt-1">Product Engineer, Supabase</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-32 bg-[#030303] relative z-10 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div 
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-left mb-20 max-w-3xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6">Simple, transparent pricing.</h2>
            <p className="text-[#888888] text-xl leading-relaxed font-light">Start boosting your applications for free, and unlock powerful AI features when you're ready to accelerate.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
          >
            {/* Free Plan */}
            <motion.div variants={fadeUp} className="p-10 rounded-[32px] bg-[#0a0a0a] border border-white/5 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Developer</h3>
                <p className="text-sm text-slate-500 font-light mb-6">For developers starting their search.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-bold text-white">$0</span>
                  <span className="text-sm text-slate-500">/mo</span>
                </div>
                <ul className="space-y-4 text-sm text-slate-400 font-light mb-8">
                  <li className="flex items-center gap-2">✓ Track up to 20 applications</li>
                  <li className="flex items-center gap-2">✓ Basic resume formatting</li>
                  <li className="flex items-center gap-2">✓ Job board discovery</li>
                </ul>
              </div>
              <Link to="/register" className="w-full text-center py-3 bg-[#111111] hover:bg-[#1a1a1a] border border-white/10 text-white rounded font-medium text-sm transition-colors block">
                Start Free
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div variants={fadeUp} className="p-10 rounded-[32px] bg-[#0c0c0c] border border-white/20 flex flex-col justify-between h-full relative shadow-[0_0_50px_rgba(255,255,255,0.02)]">
              <div className="absolute -top-4 left-10 px-3 py-1 bg-white text-black text-[10px] uppercase font-bold tracking-widest rounded">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Professional</h3>
                <p className="text-sm text-slate-500 font-light mb-6">Complete suite for active job seekers.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-bold text-white">$19</span>
                  <span className="text-sm text-slate-500">/mo</span>
                </div>
                <ul className="space-y-4 text-sm text-slate-300 font-light mb-8">
                  <li className="flex items-center gap-2">✓ Unlimited application tracking</li>
                  <li className="flex items-center gap-2">✓ AI ATS optimization & scoring</li>
                  <li className="flex items-center gap-2">✓ Unlimited AI Career Coach credits</li>
                  <li className="flex items-center gap-2">✓ Direct referral opportunities</li>
                </ul>
              </div>
              <Link to="/register" className="w-full text-center py-3 bg-white hover:bg-slate-200 text-black rounded font-medium text-sm transition-colors block">
                Upgrade to Pro
              </Link>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div variants={fadeUp} className="p-10 rounded-[32px] bg-[#0a0a0a] border border-white/5 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Enterprise</h3>
                <p className="text-sm text-slate-500 font-light mb-6">For hiring teams and boutique agencies.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-bold text-white">Custom</span>
                </div>
                <ul className="space-y-4 text-sm text-slate-400 font-light mb-8">
                  <li className="flex items-center gap-2">✓ Multi-seat team dashboard</li>
                  <li className="flex items-center gap-2">✓ Dedicated account manager</li>
                  <li className="flex items-center gap-2">✓ Tailored AI scoring models</li>
                  <li className="flex items-center gap-2">✓ API custom integrations</li>
                </ul>
              </div>
              <Link to="/login" className="w-full text-center py-3 bg-[#111111] hover:bg-[#1a1a1a] border border-white/10 text-white rounded font-medium text-sm transition-colors block">
                Contact Sales
              </Link>
            </motion.div>
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
