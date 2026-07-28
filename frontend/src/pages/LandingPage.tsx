
import { useNavigate, Link } from 'react-router-dom';
import { Bot, Briefcase, FileText, MousePointerClick, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <ParticleBackground />
      </div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background z-0" />

      {/* Navbar */}
      <nav className="relative z-50 w-full border-b border-white/5 glass py-4 px-6 md:px-12 flex justify-between items-center sticky top-0">
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
            Login
          </Link>
          <button
            onClick={() => navigate('/register')}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] border border-indigo-400/20"
          >
            Get Started
          </button>
        </div>
      </nav>

      <main className="relative z-10 flex-grow flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8 backdrop-blur-sm animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-200">The Future of Job Hunting</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Your Autonomous AI <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Job Search Copilot
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Upload your resume and let AI take the wheel. Discover live LinkedIn jobs, automatically tailor your CV to beat the ATS, and apply to roles instantly. Prep for interviews and navigate your career path with a dedicated AI coach.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-lg hover:from-indigo-500 hover:to-violet-500 transition-all shadow-[0_0_30px_rgba(79,70,229,0.4)] flex items-center gap-2 group"
            >
              Start Searching Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-lg border border-white/10 transition-all flex items-center gap-2"
            >
              Sign In
            </button>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Supercharge Your Search</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to land your dream job, powered by advanced artificial intelligence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="glass p-8 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50" />
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20 text-indigo-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Live Job Discovery</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Scrapes live jobs from LinkedIn and matches them to your exact skill set using intelligent keyword analysis and relevance scoring.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass p-8 rounded-2xl border border-white/5 hover:border-violet-500/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50" />
              <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center mb-6 border border-violet-500/20 text-violet-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">ATS Optimization</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                AI analyzes job descriptions and instantly tailors your resume and cover letter to bypass ATS filters with maximum match scores.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass p-8 rounded-2xl border border-white/5 hover:border-pink-500/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50" />
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6 border border-pink-500/20 text-pink-400">
                <MousePointerClick className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">One-Click Auto-Apply</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Connect your LinkedIn and let our automated browser agent apply to dozens of highly suitable roles in the background while you sleep.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50" />
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20 text-blue-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Interview Prep</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Generate tailored interview questions based on the exact job description and practice your answers with real-time AI feedback.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="w-full max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="glass p-12 rounded-3xl border border-indigo-500/20 bg-gradient-to-b from-indigo-900/20 to-transparent relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to accelerate your career?</h2>
              <p className="text-indigo-200 text-lg mb-8 max-w-2xl mx-auto">
                Join JobsPilot AI today and experience the most advanced, autonomous job search platform ever built.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 rounded-xl bg-white text-indigo-950 font-bold text-lg hover:bg-slate-100 transition-all shadow-xl flex items-center gap-2 mx-auto group"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-indigo-600" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full border-t border-white/5 glass py-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            <span className="font-semibold text-slate-300">JobsPilot AI</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="https://jobspilotai.space/" className="hover:text-white transition-colors">Home</a>
            <a href="https://www.linkedin.com/in/priyatam-chinnari/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
              Developed by Priyatam
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
