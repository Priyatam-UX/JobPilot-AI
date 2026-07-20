import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard,
  FileText,
  Search,
  Trello,
  FileQuestion,
  UserCheck,
  LogOut,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { ChatBot } from './ChatBot';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Resume Library', path: '/resumes', icon: FileText },
    { name: 'Job Discovery', path: '/jobs', icon: Search },
    { name: 'Application Tracker', path: '/tracker', icon: Trello },
    { name: 'Interview Prep', path: '/interview', icon: FileQuestion },
    { name: 'Career Coach', path: '/coach', icon: UserCheck },
  ];

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar with Glassmorphism */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-800 bg-slate-950/95 backdrop-blur-xl flex flex-col h-full transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-900 gap-2">
          <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-200 via-slate-100 to-indigo-400 bg-clip-text text-transparent">
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-200 via-slate-100 to-indigo-400 bg-clip-text text-transparent">
            Job Copilot AI
          </span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden ml-auto p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Summary */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-md">
              {user?.full_name?.charAt(0) || user?.email.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{user?.full_name || 'Job Applicant'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-800 hover:border-red-900/50 hover:bg-red-950/20 text-slate-400 hover:text-red-400 transition-all duration-300 text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <p className="mt-3 text-center text-[11px] text-slate-700 select-none">
            © 2025 <span className="text-slate-600 font-semibold">Priyatam</span>. All rights reserved.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-900 bg-slate-950/40 backdrop-blur-md flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-white">
              {navItems.find((item) => item.path === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              System Online
            </span>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </main>
      </div>

      {/* Global AI Assistant Widget */}
      <ChatBot />
    </div>
  );
}
