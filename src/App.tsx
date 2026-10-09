import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  LineChart, 
  Bell, 
  Settings, 
  ChevronRight,
  LogOut,
  User as UserIcon,
  Search,
  Menu,
  X,
  Sparkles,
  Shield
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { User, Project } from './types';

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { supabase } from './supabase';

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  message?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    // Defaulting to a logged-in dev user for seamless access during development if not set
    return saved ? JSON.parse(saved) : null;
  });
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      if (!user) setUser({ id: 'dev-1', name: 'Dev User', email: 'dev@jacksonmultifacet.com', role: 'admin' });
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Mock user metadata based on email for roles
        let role = 'client';
        if (session.user.email?.includes('admin')) role = 'admin';
        else if (session.user.email?.includes('staff')) role = 'staff';
        else if (session.user.email?.includes('candidate')) role = 'candidate';
        
        const userData: User = { 
          id: session.user.id, 
          email: session.user.email || '', 
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          role: role as any
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string) => {
    setMessage('');
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || email.endsWith('@jacksonmultifacet.com')) {
        // Fallback for dev without supabase or for quick mock logins
        let role = 'client';
        if (email.includes('admin')) role = 'admin';
        else if (email.includes('candidate')) role = 'candidate';
        else if (email.includes('staff')) role = 'staff';
        
        const userData: User = { id: 'dev-1', name: email.split('@')[0], email, role: role as any };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      }

      // Try magic link with Supabase
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin }
      });
      if (error) throw error;
      setMessage('A secure login link has been sent to your email.');
      return true;
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Login failed');
    }
    return false;
  };

  const logout = async () => {
    if (import.meta.env.VITE_SUPABASE_URL) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, message }}>
      {children}
    </AuthContext.Provider>
  );
}

// --- Generic UI Components ---
const Card = ({ children, className }: { children: ReactNode, className?: string }) => (
  <div className={cn("bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm", className)}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className }: { children: ReactNode, onClick?: () => void, variant?: 'primary' | 'secondary' | 'ghost', className?: string }) => {
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)]",
    secondary: "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10",
    ghost: "bg-transparent text-white/40 hover:text-white hover:bg-white/5"
  };
  return (
    <button onClick={onClick} className={cn("px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm", variants[variant], className)}>
      {children}
    </button>
  );
};

// --- Views ---
function LoginView() {
  const [email, setEmail] = useState('dev@jacksonmultifacet.com');
  const [loading, setLoading] = useState(false);
  const { login, message } = useAuth();
  const navigate = Navigate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.02] mix-blend-overlay pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center gap-5 mb-10">
          <div className="relative w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.2)] backdrop-blur-2xl">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 animate-pulse"></div>
            <Building2 className="text-white w-10 h-10 relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white font-display text-center">
            JACKSON <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">MULTIFACET</span>
          </h1>
        </div>
        
        <Card className="p-8 md:p-10 border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
             <Shield className="w-32 h-32" />
          </div>

          <div className="relative z-10">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold text-white mb-3 font-display">Client Portal</h2>
              <p className="text-white/40 text-sm">Sign in to manage your account and files.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold px-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                     <UserIcon className="h-4 w-4 text-indigo-400" />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/10 transition-all font-mono text-sm shadow-inner"
                    required
                  />
                </div>
              </div>
              
              {message && (
                <div className={cn("p-4 rounded-xl border text-xs font-medium", message.includes('failed') ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400")}>
                  {message}
                </div>
              )}
              
              <Button className="w-full justify-center py-4 rounded-xl text-sm uppercase tracking-widest font-black shadow-[0_0_20px_rgba(79,70,229,0.4)] group">
                {loading ? 'Signing in...' : 'Sign In'}
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3 text-center">Test Accounts (Development)</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setEmail('admin@jacksonmultifacet.com')} className="text-xs bg-white/5 hover:bg-white/10 text-white/70 py-2 rounded-lg transition-colors border border-white/5">Admin</button>
                <button onClick={() => setEmail('client@jacksonmultifacet.com')} className="text-xs bg-white/5 hover:bg-white/10 text-white/70 py-2 rounded-lg transition-colors border border-white/5">Client</button>
                <button onClick={() => setEmail('candidate@jacksonmultifacet.com')} className="text-xs bg-white/5 hover:bg-white/10 text-white/70 py-2 rounded-lg transition-colors border border-white/5">Candidate</button>
                <button onClick={() => setEmail('staff@jacksonmultifacet.com')} className="text-xs bg-white/5 hover:bg-white/10 text-white/70 py-2 rounded-lg transition-colors border border-white/5">Staff</button>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                 <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">Test Accounts (Development)</span>
              </div>
            </div>
          </div>
        </Card>
        
        <p className="text-center mt-12 text-[10px] uppercase tracking-[0.2em] text-white/20 font-black">
           Powered by Jackson Multifacet
        </p>
      </div>
    </div>
  );
}

function DashboardView() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        // Fallback dummy data if no supabase
        try {
          const res = await fetch('/api/projects');
          const data = await res.json();
          setProjects(data);
        } catch(e) {}
        setLoading(false);
        return;
      }

      // Fetch from Supabase
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setProjects(data.map(p => ({
          id: p.id,
          name: p.name,
          clientId: p.client_id,
          status: p.status,
          description: p.description,
          progress: p.progress
        })));
      }
      setLoading(false);
    }
    loadProjects();
  }, []);

  return (
    <div className="space-y-10 animate-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2 font-display">Central Operations</h1>
          <p className="text-white/40 text-sm">Monitoring activity across <span className="text-indigo-400 font-bold">14 Active Projects</span></p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-3">
          <Button variant="primary" className="w-full sm:w-auto justify-center">New Proposal</Button>
          <Button variant="secondary" className="w-full sm:w-auto justify-center">Export Analytics</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Project Health', value: '98.4%', change: '↑', icon: Briefcase, color: 'text-indigo-400' },
          { label: 'Monthly Retention', value: '12.5%', change: '↑', icon: Users, color: 'text-emerald-400' },
          { label: 'Active Stakeholders', value: '42', change: '+4', icon: Users, color: 'text-purple-400' },
          { label: 'Business Runway', value: '22 Mo.', change: '∞', icon: LineChart, color: 'text-pink-400' },
        ].map((stat, i) => (
          <Card key={i} className="p-6 group relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{stat.label}</div>
              <span className={cn("text-xs font-bold", stat.color)}>
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-4">{stat.value}</div>
            
            {stat.label === 'Project Health' && (
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[98%] shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
              </div>
            )}
            
            {stat.label === 'Active Stakeholders' && (
              <div className="flex -space-x-2 mt-2">
                {[1, 2, 3].map(j => (
                  <div key={j} className="w-6 h-6 rounded-full border border-black bg-white/10" />
                ))}
                <div className="w-6 h-6 rounded-full border border-black bg-zinc-800 flex items-center justify-center text-[8px] font-bold">+39</div>
              </div>
            )}

            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <stat.icon className="w-12 h-12" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Critical Path Timeline</h3>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <div className="w-2 h-2 rounded-full bg-white/10" />
            </div>
          </div>
          <Card className="flex flex-col">
            <div className="divide-y divide-white/5">
              {projects.map(project => (
                <div key={project.id} className="p-4 sm:p-6 md:p-8 hover:bg-white/[0.02] transition-colors relative pl-8 sm:pl-12 md:pl-12 border-l-2 border-white/5 mt-4 first:mt-0">
                  <div className="absolute -left-[9px] top-6 md:top-10 w-4 h-4 rounded-full bg-[#050507] border-2 border-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4 sm:gap-0">
                    <div>
                      <h4 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{project.name}</h4>
                      <p className="text-xs text-white/40 mt-1 uppercase tracking-widest font-bold">{project.description}</p>
                    </div>
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded uppercase border border-indigo-500/20 whitespace-nowrap">
                      Designing
                    </span>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-4 sm:gap-8">
                      <div>
                        <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Velocity</p>
                        <p className="text-sm font-bold text-white">{project.progress}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Priority</p>
                        <p className="text-sm font-bold text-rose-400">High Impact</p>
                      </div>
                    </div>
                    <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 text-center">Secure Vault Activity</h3>
          <Card className="p-6 space-y-6 flex flex-col h-full">
            <div className="space-y-6">
              {[
                { name: 'MSA_Final_v12.pdf', user: 'Jackson Multifacet', time: '2m ago', type: 'contract' },
                { name: 'Marketing Assets 2024', user: 'Creative Team', time: '1h ago', type: 'folder' },
                { name: 'UX Audit Report.pdf', user: 'Sarah D.', time: '3h ago', type: 'report' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/30 transition-colors">
                    {item.type === 'contract' ? <FileText className="w-5 h-5 text-rose-400" /> : <Briefcase className="w-5 h-5 text-indigo-400" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold white truncate">{item.name}</p>
                    <p className="text-[10px] text-white/30 mt-1">Uploaded by <b className="text-white/60">{item.user}</b> • {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-white/5 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 mt-4">
               <FileText className="w-8 h-8 text-white/10" />
               <span className="text-[10px] text-white/20 uppercase font-black tracking-[0.2em]">Secure Drop Zone</span>
            </div>

            <div className="mt-auto pt-6">
              <Button variant="secondary" className="w-full justify-center py-3 uppercase tracking-widest text-[10px] font-black">Open Client Portal</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

import AIStrategyView from './views/AIStrategyView';

// --- Layout Wrapper ---
function MainLayout({ children }: { children: ReactNode }) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Portal', icon: FileText, path: '/portal' },
    { label: 'Projects', icon: Briefcase, path: '/projects' },
    { label: 'AI Strategy', icon: Sparkles, path: '/ai-strategy' },
    { label: 'Analytics', icon: LineChart, path: '/analytics' },
    { label: 'Network', icon: Users, path: '/network' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#050507] text-[#e0e0e6] flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-20 hover:w-72 transition-all duration-300 ease-in-out group border-r border-white/10 bg-black/40 backdrop-blur-xl flex-col sticky top-0 h-screen z-50 overflow-hidden shrink-0">
        <div className="p-4 group-hover:p-8 transition-all duration-300">
          <div className="flex items-center gap-3 mb-10 overflow-hidden">
            <div className="w-9 h-9 shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <Building2 className="text-white w-5 h-5" />
            </div>
            <div className="leading-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              <p className="text-lg font-bold tracking-tight text-white font-display uppercase">JACKSON <span className="text-indigo-400">MULTIFACET</span></p>
            </div>
          </div>

          <nav className="space-y-1">
            <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Management</div>
            {navItems.slice(0, 4).map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all border border-transparent whitespace-nowrap overflow-hidden relative",
                  location.pathname === item.path 
                    ? "bg-white/5 border-white/10 text-white shadow-inner" 
                    : "text-white/60 hover:bg-white/5"
                )}
                title={item.label}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-1">{item.label}</span>
              </Link>
            ))}
            <div className="pt-6 text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Operations</div>
            {navItems.slice(4).map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all border border-transparent whitespace-nowrap overflow-hidden relative",
                  location.pathname === item.path 
                    ? "bg-white/5 border-white/10 text-white shadow-inner" 
                    : "text-white/60 hover:bg-white/5"
                )}
                title={item.label}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-1">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 group-hover:p-8 transition-all duration-300 space-y-4">
          <div className="p-2 group-hover:p-4 transition-all duration-300 bg-indigo-500/10 border border-indigo-500/30 rounded-xl overflow-hidden mt-4">
            <div className="flex items-center gap-3 mb-4 text-center group-hover:text-left justify-center group-hover:justify-start">
              <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 border border-white/20 flex items-center justify-center overflow-hidden">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
              <div className="leading-tight overflow-hidden opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto transition-all duration-300 whitespace-nowrap">
                <p className="text-sm font-bold truncate text-white">{user?.name}</p>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{user?.role}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors w-full justify-center group-hover:justify-start whitespace-nowrap overflow-hidden"
              title="Terminate Session"
            >
              <LogOut className="w-4 h-4 shrink-0" /> 
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-1">Terminate Session</span>
            </button>
          </div>
          <p className="text-[10px] text-white/10 text-center uppercase tracking-[0.2em] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Jackson Multifacet Systems</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 bg-gradient-to-br from-[#0c0c14] to-[#050507] overflow-y-auto">
        {/* Mobile Header */}
        <header className={`lg:hidden h-20 px-4 md:px-6 border-b border-white/10 flex justify-between items-center transition-all duration-300 bg-[#07070c] sticky top-0 ${mobileMenuOpen ? 'z-[125]' : 'z-[60]'}`}>
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <Building2 className="text-white w-5 h-5" />
            </div>
            <span className="font-bold tracking-tight text-white uppercase text-sm">JACKSON <span className="text-indigo-400">MULTIFACET</span></span>
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all z-[130]"
          >
            <div className="relative w-6 h-6">
              <motion.span
                animate={{ 
                  rotate: mobileMenuOpen ? 45 : 0, 
                  y: mobileMenuOpen ? 0 : -6 
                }}
                transition={{ duration: 0.2 }}
                style={{ originX: 0.5, originY: 0.5 }}
                className="absolute left-0 right-0 h-0.5 bg-white rounded-full top-[11px] block"
              />
              <motion.span
                animate={{ 
                  opacity: mobileMenuOpen ? 0 : 1,
                  x: mobileMenuOpen ? 10 : 0 
                }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 w-4 h-0.5 bg-indigo-400 rounded-full top-[11px] block"
              />
              <motion.span
                animate={{ 
                  rotate: mobileMenuOpen ? -45 : 0, 
                  y: mobileMenuOpen ? 0 : 6 
                }}
                transition={{ duration: 0.2 }}
                style={{ originX: 0.5, originY: 0.5 }}
                className="absolute left-0 right-0 h-0.5 bg-white rounded-full top-[11px] block"
              />
            </div>
          </button>
        </header>

        {/* Top Desktop Bar */}
        <div className="hidden lg:flex h-16 border-b border-white/5 items-center justify-between px-10 bg-black/20 sticky top-0 z-40 backdrop-blur-md">
           <div className="flex items-center gap-4 w-1/3">
            <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10 w-full flex items-center gap-3 text-xs text-white/40">
              <Search className="w-4 h-4" />
              Search projects, vault or talent...
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest text-center">Live Operational Stream</span>
            </div>
            <div className="flex gap-2">
               <button className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                  <Bell className="w-4 h-4 text-white/60" />
               </button>
               <button className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                  <Settings className="w-4 h-4 text-white/60" />
               </button>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Nav Overlay - Enhanced Premium Full-Screen Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 h-[100dvh] w-full z-[110] lg:hidden bg-[#050508]/98 backdrop-blur-3xl flex flex-col justify-between p-4 sm:p-6 pt-20 overflow-y-auto"
          >
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
               <div className="absolute top-[15%] left-[-10%] w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[90px]" />
               <div className="absolute bottom-[13%] right-[-10%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px]" />
               <div className="noise-overlay opacity-15" />
            </div>

            {/* Title / Indicator */}
            <div className="relative z-10 border-l-2 border-indigo-500 pl-3 mb-4 text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400 block">Jackson Control Matrix</span>
              <span className="text-white/30 text-[9px] font-mono block">SECURE_OPERATIONAL_TRANSMISSION</span>
            </div>

            {/* Nav links list with editorial micro descriptions */}
            <nav className="flex-1 relative z-10 py-1 my-auto flex flex-col justify-center text-left space-y-1.5">
              {navItems.map((item, i) => {
                const isActive = location.pathname === item.path;
                const dbDescriptions: Record<string, string> = {
                  '/dashboard': 'Live operations dashboard & stream analytics',
                  '/portal': 'Secure encrypted document vault & project logs',
                  '/projects': 'Client assignment pipelines & milestones',
                  '/ai-strategy': 'Consult, integrate & manage Gemini pipelines',
                  '/analytics': 'Performance audits & statistics',
                  '/network': 'Stakeholder roster & candidates list',
                  '/settings': 'Configure credentials & platform preferences',
                };

                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ delay: 0.03 + i * 0.03 }}
                  >
                    <Link 
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex flex-col p-1.5 border-b border-white/[0.01] rounded-lg transition-all",
                        isActive ? "bg-white/[0.03] border-white/10" : "hover:bg-white/[0.005]"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          "w-7 h-7 rounded-md flex items-center justify-center transition-colors shrink-0",
                          isActive ? "bg-indigo-500/20 text-indigo-400 font-bold" : "bg-white/5 text-white/30"
                        )}>
                          <item.icon className="w-3.5 h-3.5" />
                        </div>
                        <span className={cn(
                          "text-[11px] font-bold tracking-wider uppercase",
                          isActive ? "text-white" : "text-white/60"
                        )}>
                          {item.label}
                        </span>
                        {isActive && (
                           <div className="ml-auto w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                        )}
                      </div>
                      <p className="text-[9px] text-white/30 pl-9.5 truncate mt-0.5 font-medium leading-none">
                        {dbDescriptions[item.path] || 'Manage console node'}
                      </p>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom Profile and Action Console */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ delay: 0.3 }}
              className="mt-auto space-y-3 relative z-10 pt-3 border-t border-white/5"
            >
              <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 border border-white/20 flex items-center justify-center shrink-0">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-sm font-bold text-white truncate leading-tight">{user?.name}</p>
                  <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest leading-none mt-0.5">{user?.role}</p>
                </div>
              </div>
              <Button 
                className="w-full justify-center text-[9px] py-4 rounded-xl uppercase tracking-widest font-black bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 transition-all text-rose-400 border border-rose-500/20 flex items-center gap-2" 
                onClick={logout}
              >
                <LogOut className="w-3.5 h-3.5" /> Terminate Session
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import ProjectsView from './views/ProjectsView';
import AnalyticsView from './views/AnalyticsView';
import PortalView from './views/PortalView';
import HomeView from './views/public/HomeView';
import ServicesView from './views/public/ServicesView';
import PortfolioView from './views/public/PortfolioView';
import PricingView from './views/public/PricingView';
import BlogView from './views/public/BlogView';
import AboutView from './views/public/AboutView';
import ContactView from './views/public/ContactView';
import PublicLayout from './components/PublicLayout';
import { useRealTime } from './hooks/useRealTime';

// --- Views (Inline for ones not yet in separate files) ---
function NetworkView() {
  return (
    <div className="space-y-8 animate-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Network & Talent</h1>
        <p className="text-zinc-500">Manage candidates, contractors, and internal stakeholders.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Alex Rivera', role: 'Staff Designer', status: 'Available', tags: ['Figma', 'UI/UX'] },
          { name: 'Jordan Smith', role: 'Candidate', status: 'Interviewing', tags: ['Fullstack', 'Node.js'] },
          { name: 'Casey Lee', role: 'Contractor', status: 'Busy', tags: ['Marketing', 'Copywriting'] },
          { name: 'Taylor Quinn', role: 'Admin', status: 'Available', tags: ['Strategy', 'Growth'] },
        ].map((person, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-lg">
                {person.name[0]}
              </div>
              <div>
                <h4 className="font-bold text-white">{person.name}</h4>
                <p className="text-xs text-zinc-500">{person.role}</p>
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              {person.tags.map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 bg-zinc-800 rounded text-zinc-400">{tag}</span>
              ))}
            </div>
            <div className="flex justify-between items-center py-4 border-t border-zinc-800">
               <span className={cn(
                 "text-[10px] uppercase font-bold tracking-widest",
                 person.status === 'Available' ? 'text-emerald-400' : 
                 person.status === 'Interviewing' ? 'text-amber-400' : 'text-zinc-500'
               )}>{person.status}</span>
               <Button variant="ghost" className="text-xs py-1 px-3">Profile</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-8 animate-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Platform Settings</h1>
        <p className="text-zinc-500">Configure your personal and organization preferences.</p>
      </header>
      <div className="max-w-2xl space-y-6">
        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Profile Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-600">First Name</label>
                <input className="w-full bg-black border border-zinc-800 p-2 rounded text-sm" defaultValue="Jackson" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-600">Last Name</label>
                <input className="w-full bg-black border border-zinc-800 p-2 rounded text-sm" defaultValue="Admin" />
              </div>
            </div>
          </div>
          <div className="space-y-4 pt-6 border-t border-zinc-800">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Preferences</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-white">Email Notifications</p>
                <p className="text-xs text-zinc-500">Receive weekly updates and alerts.</p>
              </div>
              <div className="w-12 h-6 bg-white rounded-full p-1 cursor-pointer">
                <div className="w-4 h-4 bg-black rounded-full ml-auto" />
              </div>
            </div>
          </div>
          <Button className="w-full justify-center py-3">Save Changes</Button>
        </Card>
      </div>
    </div>
  );
}

// --- Protected Route (Modified to include WS) ---
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { status, sendMessage } = useRealTime();

  useEffect(() => {
    if (user && status === 'open') {
      sendMessage({ type: 'user_active', userId: user.id });
    }
  }, [user, status, sendMessage]);

  if (!user) return <LoginView />;
  return (
    <MainLayout>
      {children}
      <div className="fixed bottom-6 right-6 z-50">
         <div className={cn(
           "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-500",
           status === 'open' ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" : 
           status === 'connecting' ? "bg-amber-400/10 text-amber-400 border-amber-400/20" : 
           "bg-rose-400/10 text-rose-400 border-rose-400/20"
         )}>
           {status}
         </div>
      </div>
    </MainLayout>
  );
}

// --- App Root ---
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PublicLayout><HomeView /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><ServicesView /></PublicLayout>} />
          <Route path="/portfolio" element={<PublicLayout><PortfolioView /></PublicLayout>} />
          <Route path="/pricing" element={<PublicLayout><PricingView /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><BlogView /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutView /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactView /></PublicLayout>} />
          
          <Route path="/dashboard" element={<ProtectedRoute><DashboardView /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><ProjectsView /></ProtectedRoute>} />
          <Route path="/portal" element={<ProtectedRoute><PortalView /></ProtectedRoute>} />
          <Route path="/ai-strategy" element={<ProtectedRoute><AIStrategyView /></ProtectedRoute>} />
          <Route path="/network" element={<ProtectedRoute><NetworkView /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsView /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsView /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
