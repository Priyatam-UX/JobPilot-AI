import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth';
import { useAuthStore } from '../store/authStore';
import { Sparkles, Mail, Lock, User, Loader2 } from 'lucide-react';
import { TiltCard } from '../components/TiltCard';
import { ParticleBackground } from '../components/ParticleBackground';

export function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.register({ email, password, full_name: fullName });
      // Log in immediately
      const tokens = await authService.login({ email, password });
      localStorage.setItem('token', tokens.access_token);
      const user = await authService.getMe();
      setAuth(tokens.access_token, tokens.refresh_token, user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#030303] text-slate-100 p-4 font-sans relative overflow-hidden">
      
      {/* Interactive Particle Background */}
      <ParticleBackground particleCount={80} speed={0.4} />

      <div className="w-full max-w-md relative z-10 pointer-events-none">
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>

        <TiltCard className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-visible pointer-events-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white text-center">Jobspilot AI</h2>
            <p className="text-sm text-slate-400 mt-1">Create an account on your personal AI copilot</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500"><User className="w-4 h-4" /></span>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#0a0a0a] border border-white/5 rounded-xl focus:border-white/20 focus:ring-1 focus:ring-white/10 outline-none text-slate-100 text-sm transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500"><Mail className="w-4 h-4" /></span>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#0a0a0a] border border-white/5 rounded-xl focus:border-white/20 focus:ring-1 focus:ring-white/10 outline-none text-slate-100 text-sm transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500"><Lock className="w-4 h-4" /></span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#0a0a0a] border border-white/5 rounded-xl focus:border-white/20 focus:ring-1 focus:ring-white/10 outline-none text-slate-100 text-sm transition-all duration-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black hover:bg-slate-200 rounded-xl font-medium text-sm transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)] flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get Started'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:text-slate-300 font-medium">
              Sign in
            </Link>
          </p>
        </TiltCard>
      </div>
    </div>
  );
}
