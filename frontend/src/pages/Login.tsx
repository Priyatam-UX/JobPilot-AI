import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth';
import { Sparkles, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const tokens = await authService.login({ email, password });
      // Get user profile info
      localStorage.setItem('token', tokens.access_token);
      const user = await authService.getMe();
      setAuth(tokens.access_token, tokens.refresh_token, user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setError('');
    const client = (window as any).google?.accounts?.oauth2?.initTokenClient({
      client_id: '904539444238-3vpogti4428sojsabo8cpto44a7j7a6e.apps.googleusercontent.com',
      scope: 'email profile openid',
      callback: async (response: any) => {
        if (response.error) {
          setError('Google sign-in was cancelled or failed.');
          setLoading(false);
          return;
        }
        try {
          const tokens = await authService.oauthLogin('google', response.access_token);
          localStorage.setItem('token', tokens.access_token);
          const user = await authService.getMe();
          setAuth(tokens.access_token, tokens.refresh_token, user);
          navigate('/');
        } catch (err: any) {
          setError(err.message || 'Failed to sign in with Google');
        } finally {
          setLoading(false);
        }
      },
    });
    if (client) {
      client.requestAccessToken();
    } else {
      setError('Google Sign-In is not available. Please try again.');
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 p-4 font-sans">
      <div className="w-full max-w-md relative">
        {/* Glow Effects */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl"></div>

        {/* Card Panel */}
        <div className="glass rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 mb-3">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Welcome back</h2>
            <p className="text-sm text-slate-400 mt-1">Accelerate your career search with AI</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none text-slate-100 text-sm transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500"><Lock className="w-4 h-4" /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none text-slate-100 text-sm transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-medium text-sm transition-all duration-300 shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center justify-center gap-3">
            <div className="h-[1px] flex-1 bg-slate-800"></div>
            <span className="text-xs text-slate-500 uppercase tracking-widest">Or continue with</span>
            <div className="h-[1px] flex-1 bg-slate-800"></div>
          </div>

          {/* Social Sign-in */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex items-center justify-center gap-2.5 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 rounded-xl text-slate-300 text-sm transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.25.61 4.45 1.614l2.45-2.45A10.96 10.96 0 0012.24 1C6.046 1 1 6.046 1 12.24s5.046 11.24 11.24 11.24c6.45 0 10.74-4.53 10.74-10.914 0-.74-.08-1.3-.2-1.84H12.24z"/>
              </svg>
              Google
            </button>
            <button
              onClick={() => handleOAuth('github')}
              disabled={loading}
              className="flex items-center justify-center gap-2.5 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 rounded-xl text-slate-300 text-sm transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              GitHub
            </button>
          </div>

          <p className="text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
