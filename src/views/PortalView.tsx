import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Share2, MessageSquare, Send, User, ChevronRight, Upload, ShieldCheck, Lock, Clock, FileKey, Briefcase, Users, LayoutDashboard, Settings, PlusCircle, Rocket, CheckCircle } from 'lucide-react';
import { useAuth } from '../App';
import { supabase, hasSupabase } from '../supabase';
import { useToast } from '../components/Toast';
import CurrencyInput from '../components/CurrencyInput';

import CandidateRegistrationForm from '../components/CandidateRegistrationForm';

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

interface Message {
  id: string;
  sender: 'client' | 'agency' | 'candidate';
  text: string;
  time: string;
}

interface VaultFile {
  name: string;
  size: string;
  date: string;
  color: string;
  category: string;
}

function CandidatePortal() {
  const [activeTab, setActiveTab] = useState<'onboarding' | 'messages' | 'registration'>('onboarding');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!hasSupabase) {
      fetch('/api/messages').then(r=>r.json()).then(data => { if (data?.length) setMessages(data) }).catch(()=>{});
      return;
    }
    
    // Fetch initial messages
    supabase.from('messages').select('*').order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setMessages(data.map((m: any) => ({
            id: m.id,
            sender: m.sender_role as any,
            text: m.text,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })));
        }
      });
      
    // Subscribe
    const sub = supabase.channel('candidate_messages_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        const m = payload.new;
        setMessages(prev => [...prev, {
          id: m.id,
          sender: m.sender_role as any,
          text: m.text,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }).subscribe();
      
    return () => {
      supabase.removeChannel(sub);
    };
  }, []);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Upload Resume/CV', status: 'completed' },
    { id: 2, title: 'Complete Skills Assessment', status: 'pending' },
    { id: 3, title: 'Candidate Registration Form', status: 'pending' },
    { id: 4, title: 'Sign NDA', status: 'pending' },
    { id: 5, title: 'Schedule Setup Call', status: 'locked' }
  ]);

  const toggleTask = (id: number) => {
    if (id === 3 && tasks.find(t => t.id === 3)?.status === 'pending') {
       setActiveTab('registration');
       return;
    }
    setTasks(tasks.map(t => {
      if (t.id === id && t.status !== 'locked') {
        const newStatus = t.status === 'completed' ? 'pending' : 'completed';
        
        // If we completed the NDA, unlock the setup call
        if (id === 4 && newStatus === 'completed') {
           setTimeout(() => {
             setTasks(current => current.map(ct => ct.id === 5 ? { ...ct, status: 'pending' } : ct));
           }, 500);
        }
        
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const handleRegistrationComplete = () => {
     setTasks(tasks.map(t => t.id === 3 ? { ...t, status: 'completed' } : t));
     setActiveTab('onboarding');
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { if (activeTab === 'messages') scrollToBottom(); }, [messages, activeTab]);

  return (
    <div className="space-y-6 md:space-y-10 animate-in h-max flex flex-col pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" /> Secure Connection
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white font-display">
            Candidate <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Portal</span>
          </h1>
          <p className="text-sm md:text-base text-white/40 max-w-xl leading-relaxed">
            Complete your onboarding tasks, submit required documents, and message your placement director.
          </p>
        </div>
        
        <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10 backdrop-blur-xl w-full md:w-auto shadow-2xl custom-scrollbar relative z-20 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('onboarding')}
            className={`group flex-none p-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center whitespace-nowrap overflow-hidden min-w-[3rem] w-auto lg:w-12 lg:hover:w-44 gap-2 lg:hover:gap-2 px-4 lg:px-3 ${activeTab === 'onboarding' ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] lg:gap-2' : 'bg-transparent text-white/40 hover:text-white hover:bg-white/5 lg:gap-0'}`}
          >
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span className={`transition-all duration-300 lg:group-hover:opacity-100 lg:group-hover:max-w-xs ${activeTab === 'onboarding' ? 'opacity-100 max-w-xs lg:max-w-xs' : 'opacity-100 max-w-xs lg:opacity-0 lg:max-w-0'}`}>Onboarding</span>
          </button>
          <button 
            onClick={() => setActiveTab('registration')}
            className={`group flex-none p-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center whitespace-nowrap overflow-hidden min-w-[3rem] w-auto lg:w-12 lg:hover:w-44 gap-2 lg:hover:gap-2 px-4 lg:px-3 ${activeTab === 'registration' ? 'bg-teal-600 text-white shadow-[0_0_20px_rgba(13,148,136,0.3)] lg:gap-2' : 'bg-transparent text-white/40 hover:text-white hover:bg-white/5 lg:gap-0'}`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span className={`transition-all duration-300 lg:group-hover:opacity-100 lg:group-hover:max-w-xs ${activeTab === 'registration' ? 'opacity-100 max-w-xs lg:max-w-xs' : 'opacity-100 max-w-xs lg:opacity-0 lg:max-w-0'}`}>Registration</span>
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`group flex-none p-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center whitespace-nowrap overflow-hidden min-w-[3rem] w-auto lg:w-12 lg:hover:w-44 gap-2 lg:hover:gap-2 px-4 lg:px-3 ${activeTab === 'messages' ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] lg:gap-2' : 'bg-transparent text-white/40 hover:text-white hover:bg-white/5 lg:gap-0'}`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span className={`transition-all duration-300 lg:group-hover:opacity-100 lg:group-hover:max-w-xs ${activeTab === 'messages' ? 'opacity-100 max-w-xs lg:max-w-xs' : 'opacity-100 max-w-xs lg:opacity-0 lg:max-w-0'}`}>Messages</span>
          </button>
        </div>
      </header>

      {activeTab === 'registration' ? (
        <CandidateRegistrationForm onComplete={handleRegistrationComplete} />
      ) : activeTab === 'onboarding' ? (
        <div className="flex-1 min-h-[500px] md:min-h-[700px] bg-black/40 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl p-4 sm:p-6 md:p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Onboarding Tasks</h3>
          <p className="text-xs text-white/40 mb-6">Click on a pending task to complete it.</p>
          <div className="space-y-4">
            {tasks.map((task) => (
               <div 
                 key={task.id} 
                 onClick={() => toggleTask(task.id)}
                 className={cn(
                   "border p-5 rounded-2xl flex items-center justify-between transition-all",
                   task.status === 'locked' ? 'opacity-50 cursor-not-allowed bg-black/20 border-white/5' : 'bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer',
                   task.status === 'completed' && 'bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20'
                 )}
               >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      task.status === 'completed' ? 'border-emerald-500 bg-emerald-500' : 'border-white/20'
                    )}>
                       {task.status === 'completed' && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className={cn("font-medium", task.status === 'completed' ? 'text-emerald-400' : 'text-white')}>{task.title}</span>
                  </div>
                  <span className={cn(
                    "text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full",
                    task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    task.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-white/40'
                  )}>{task.status}</span>
               </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-[500px] md:min-h-[700px] bg-black/40 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative z-10">
          <div className="p-6 md:p-8 border-b border-white/5 bg-black/20 flex justify-between items-center shrink-0">
             <div className="flex items-center gap-4">
               <div className="relative">
                 <div className="w-12 h-12 rounded-full border border-white/10 bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <ShieldCheck className="w-6 h-6 text-white" />
                 </div>
                 <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-black animate-pulse"></div>
               </div>
               <div>
                 <h3 className="text-lg font-bold text-white font-display">Placement Director</h3>
                 <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-0.5">Online • Encrypted</p>
               </div>
             </div>
          </div>
          
          <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 flex flex-col">
            <div className="text-center my-4">
              <span className="px-4 py-1.5 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">Today</span>
            </div>
            
            {messages.map(msg => (
               <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.sender === 'agency' ? 'self-start' : 'self-end'}`}>
                 <div className={`p-5 rounded-2xl ${msg.sender === 'agency' ? 'bg-white/5 border border-white/10 rounded-tl-sm' : 'bg-emerald-600 text-white rounded-tr-sm shadow-[0_5_20px_rgba(16,185,129,0.2)]'}`}>
                   <p className="text-sm md:text-base leading-relaxed font-medium">{msg.text}</p>
                 </div>
                 <span className={`text-[10px] font-bold uppercase tracking-widest text-white/30 mt-2 ${msg.sender === 'agency' ? 'ml-1' : 'mr-1 self-end'}`}>{msg.time}</span>
               </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-6 border-t border-white/5 bg-black/40 shrink-0">
            <form onSubmit={async (e) => { 
              e.preventDefault(); 
              if (newMessage) {
                if (!hasSupabase) {
                  try {
                    const res = await fetch('/api/messages', {
                      method: 'POST',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify({ sender: 'candidate', text: newMessage })
                    });
                    const created = await res.json();
                    setMessages([...messages, created]);
                  } catch(err) {}
                } else {
                  await supabase.from('messages').insert([{
                    sender_role: 'candidate',
                    text: newMessage
                  }]);
                }
                setNewMessage('');
              }
            }} className="relative flex items-center gap-3">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a secure message..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-6 py-4 md:py-5 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white/10 transition-all font-medium text-xs md:text-sm shadow-inner"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="p-4 md:p-5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group flex-shrink-0"
              >
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function AdminPortal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === 'admin';
  const [desk, setDesk] = useState<'agency' | 'talent' | 'messages' | 'system' | 'finances'>('agency');
  const [allPayments, setAllPayments] = useState<any[]>([]);

  const [reqs, setReqs] = useState([
    { id: 1, n: 'Senior React Developer (Req. by Beta Tech)', cand: 'Sarah J. (Vetting)', status: 'action_required' },
    { id: 2, n: 'UX Director (Req. by Alpha Corp)', cand: 'Michael C. (Offer Sent)', status: 'processing' },
    { id: 3, n: 'DevOps Engineer (Req. by Gamma Inc)', cand: 'Searching...', status: 'sourcing' }
  ]);

  const handleReqClick = (id: number) => {
    setReqs(reqs.map(r => {
      if (r.id === id && r.status === 'action_required') {
        return { ...r, status: 'processing', cand: r.cand.replace('(Vetting)', '(Approved)') };
      }
      return r;
    }));
  };

  const [projects, setProjects] = useState<any[]>([
    { id: 1, name: 'Alpha Corp - Infrastructure Migration', status: 'mock', progress: 72 },
    { id: 2, name: 'Beta Technologies - Rebranding', status: 'mock', progress: 45 },
    { id: 3, name: 'Gamma Inc - Custom Portal', status: 'mock', progress: 90 }
  ]);

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [updatingCandidateId, setUpdatingCandidateId] = useState<string | null>(null);

  const handleUpdateCandidateStatus = async (candId: string, newStatus: string) => {
    setUpdatingCandidateId(candId);
    try {
      if (hasSupabase) {
        await supabase.from('candidates').update({ status: newStatus }).eq('id', candId);
      }
      setCandidates(prev => prev.map(c => c.id === candId ? { ...c, status: newStatus } : c));
      setSelectedCandidate(prev => prev && prev.id === candId ? { ...prev, status: newStatus } : prev);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingCandidateId(null);
    }
  };

  useEffect(() => {
    if (!hasSupabase) {
      fetch('/api/projects').then(r=>r.json()).then(data => { if(data?.length) setProjects(data); }).catch(()=>{});
      fetch('/api/messages').then(r=>r.json()).then(data => { if(data?.length) setMessages(data); }).catch(()=>{});
      fetch('/api/candidates').then(r=>r.json()).then(data => { if(data?.length) setCandidates(data); }).catch(()=>{});
      return;
    }

    // Fetch candidates
    supabase.from('candidates').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setCandidates(data);
      });

    // Fetch projects
    supabase.from('projects').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setProjects(data);
      });

    // Fetch initial messages
    supabase.from('messages').select('*').order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
           setMessages(data.map((m: any) => ({
             id: m.id,
             sender: m.sender_role,
             text: m.text,
             time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
           })));
        }
      });
      
    // Fetch all payments
    supabase.from('payments').select('*, user:user_id(email)').order('created_at', { ascending: false })
      .then(({data}) => {
         if(data && data.length > 0) setAllPayments(data);
      });
      
    const sub = supabase.channel('admin_messages_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        const m = payload.new;
        setMessages(prev => [...prev, {
          id: m.id,
          sender: m.sender_role,
          text: m.text,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'projects' }, payload => {
        setProjects(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'projects' }, payload => {
        setProjects(prev => [payload.new, ...prev]);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'candidates' }, payload => {
        setCandidates(prev => [payload.new, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'candidates' }, payload => {
        setCandidates(prev => prev.map(c => c.id === payload.new.id ? payload.new : c));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'payments' }, payload => {
        setAllPayments(prev => [payload.new, ...prev]);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(sub);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (desk === 'messages') {
      scrollToBottom();
    }
  }, [messages, desk]);

  const advanceProject = async (id: any) => {
    if (hasSupabase && typeof id !== 'number') {
      const p = projects.find(pr => pr.id === id);
      if (p) {
        const newProgress = Math.min(100, (p.progress || 0) + 10);
        let status = p.status;
        if (newProgress >= 100) status = 'completed';
        else if (newProgress > 0) status = 'in_progress';
        
        await supabase.from('projects').update({ progress: newProgress, status }).eq('id', id);
      }
    } else {
      setProjects(projects.map(p => {
         if (p.id === id) {
           const newHr = Math.min(100, (p.progress || 0) + 10);
           return { ...p, progress: newHr };
         }
         return p;
      }));
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim()) return;
    
    if (hasSupabase && user) {
      await supabase.from('messages').insert([{
        text: newMessage,
        sender_id: user.id,
        sender_role: 'agency'
      }]);
      setNewMessage('');
    } else {
      try {
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ sender: 'agency', text: newMessage })
        });
        const created = await res.json();
        setMessages([...messages, created]);
      } catch (err) {}
      setNewMessage('');
    }
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in h-max flex flex-col pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
            <Lock className="w-3 h-3" /> Secure Connection
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white font-display">
            {isAdmin ? 'Admin' : 'Staff'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Dashboard</span>
          </h1>
          <p className="text-sm md:text-base text-white/40 max-w-xl leading-relaxed">
            Switch between agency projects and recruitment to manage client accounts.
          </p>
        </div>
        
        <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10 backdrop-blur-xl w-full md:w-auto shadow-2xl custom-scrollbar relative z-20 overflow-x-auto">
          <button 
            onClick={() => setDesk('agency')}
            className={`group flex-none p-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center whitespace-nowrap overflow-hidden min-w-[3rem] w-auto lg:w-12 lg:hover:w-44 gap-2 lg:hover:gap-2 px-4 lg:px-3 ${desk === 'agency' ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] lg:gap-2' : 'bg-transparent text-white/40 hover:text-white hover:bg-white/5 lg:gap-0'}`}
          >
            <Briefcase className="w-4 h-4 shrink-0" />
            <span className={`transition-all duration-300 lg:group-hover:opacity-100 lg:group-hover:max-w-xs ${desk === 'agency' ? 'opacity-100 max-w-xs lg:max-w-xs' : 'opacity-100 max-w-xs lg:opacity-0 lg:max-w-0'}`}>Agency Projects</span>
          </button>
          <button 
            onClick={() => setDesk('talent')}
            className={`group flex-none p-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center whitespace-nowrap overflow-hidden min-w-[3rem] w-auto lg:w-12 lg:hover:w-44 gap-2 lg:hover:gap-2 px-4 lg:px-3 ${desk === 'talent' ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] lg:gap-2' : 'bg-transparent text-white/40 hover:text-white hover:bg-white/5 lg:gap-0'}`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span className={`transition-all duration-300 lg:group-hover:opacity-100 lg:group-hover:max-w-xs ${desk === 'talent' ? 'opacity-100 max-w-xs lg:max-w-xs' : 'opacity-100 max-w-xs lg:opacity-0 lg:max-w-0'}`}>Recruitment</span>
          </button>
          <button 
            onClick={() => setDesk('messages')}
            className={`group flex-none p-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center whitespace-nowrap overflow-hidden min-w-[3rem] w-auto lg:w-12 lg:hover:w-44 gap-2 lg:hover:gap-2 px-4 lg:px-3 ${desk === 'messages' ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] lg:gap-2' : 'bg-transparent text-white/40 hover:text-white hover:bg-white/5 lg:gap-0'}`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span className={`transition-all duration-300 lg:group-hover:opacity-100 lg:group-hover:max-w-xs ${desk === 'messages' ? 'opacity-100 max-w-xs lg:max-w-xs' : 'opacity-100 max-w-xs lg:opacity-0 lg:max-w-0'}`}>Messages</span>
          </button>
          {isAdmin && (
            <>
              <button 
                onClick={() => setDesk('finances')}
                className={`group flex-none p-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center whitespace-nowrap overflow-hidden min-w-[3rem] w-auto lg:w-12 lg:hover:w-44 gap-2 lg:hover:gap-2 px-4 lg:px-3 ${desk === 'finances' ? 'bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] lg:gap-2' : 'bg-transparent text-white/40 hover:text-white hover:bg-white/5 lg:gap-0'}`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span className={`transition-all duration-300 lg:group-hover:opacity-100 lg:group-hover:max-w-xs ${desk === 'finances' ? 'opacity-100 max-w-xs lg:max-w-xs' : 'opacity-100 max-w-xs lg:opacity-0 lg:max-w-0'}`}>Finances</span>
              </button>
              <button 
                onClick={() => setDesk('system')}
                className={`group flex-none p-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center whitespace-nowrap overflow-hidden min-w-[3rem] w-auto lg:w-12 lg:hover:w-44 gap-2 lg:hover:gap-2 px-4 lg:px-3 ${desk === 'system' ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] lg:gap-2' : 'bg-transparent text-white/40 hover:text-white hover:bg-white/5 lg:gap-0'}`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span className={`transition-all duration-300 lg:group-hover:opacity-100 lg:group-hover:max-w-xs ${desk === 'system' ? 'opacity-100 max-w-xs lg:max-w-xs' : 'opacity-100 max-w-xs lg:opacity-0 lg:max-w-0'}`}>System Admin</span>
              </button>
            </>
          )}
        </div>
      </header>

      {desk === 'agency' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 flex flex-col md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Briefcase className="w-5 h-5 text-rose-400" /> Active Client Projects</h3>
            <p className="text-xs text-white/40 mb-4 -mt-2">Click project to log progress.</p>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px]">
               {projects.map(client => (
                 <div key={client.id} onClick={() => advanceProject(client.id)} className="p-5 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                   <div>
                     <span className="text-sm font-bold text-white block mb-1">{client.name}</span>
                     <span className="text-[10px] text-white/40 uppercase tracking-widest font-black">{client.status}</span>
                   </div>
                   <div className="flex items-center gap-4">
                     <div className="text-right hidden sm:block w-12">
                       <span className="text-sm font-black text-rose-400 block">{client.progress || 0}%</span>
                     </div>
                     <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                   </div>
                 </div>
               ))}
            </div>
          </div>
          
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-[2rem] p-6 md:p-8 flex flex-col">
            <h3 className="text-xl font-bold text-rose-400 mb-2">{isAdmin ? 'Agency Overview' : 'My Assignments'}</h3>
            <p className="text-xs text-white/40 mb-8 border-b border-rose-500/20 pb-4">{isAdmin ? 'Current operations status' : 'Your active workflow'}</p>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-rose-400 uppercase tracking-widest font-black mb-1">{isAdmin ? 'Active Projects' : 'Projects Assigned'}</p>
                <p className="text-3xl font-black text-white font-display">{isAdmin ? projects.length : Math.max(1, projects.length - 1)}</p>
              </div>
              <div>
                <p className="text-[10px] text-rose-400 uppercase tracking-widest font-black mb-1">Unread Messages</p>
                <p className="text-3xl font-black text-white font-display">{messages.filter(m => m.sender !== 'agency').length}</p>
              </div>
              <button 
                onClick={() => toast("Downloading secure operational report...", 'info')}
                className="w-full py-4 mt-auto border border-rose-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-400 hover:bg-rose-500/20 transition-all"
              >
                {isAdmin ? 'Download Report' : 'Submit Timesheet'}
              </button>
            </div>
          </div>
        </div>
      ) : desk === 'talent' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-[2rem] p-6 md:p-8 flex flex-col md:col-span-1">
            <h3 className="text-xl font-bold text-orange-400 mb-2">Talent Network</h3>
            <p className="text-xs text-white/40 mb-8 border-b border-orange-500/20 pb-4">Recruitment activities overview</p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-[10px] text-orange-400 uppercase tracking-widest font-black mb-1">Available Candidates</p>
                <p className="text-3xl font-black text-white font-display">{isAdmin ? candidates.length + 28 : Math.max(0, candidates.length + 10)}</p>
              </div>
              <div>
                <p className="text-[10px] text-orange-400 uppercase tracking-widest font-black mb-1">Open Roles</p>
                <p className="text-3xl font-black text-white font-display">6</p>
              </div>
            </div>

            {candidates.length > 0 && (
              <div className="flex-1 overflow-y-auto max-h-[350px] space-y-3 mb-6 pr-2 custom-scrollbar">
                 <p className="text-[10px] text-orange-400 uppercase tracking-widest font-black mb-2">Recent Registrations</p>
                 {candidates.map(c => (
                   <div 
                     key={c.id} 
                     onClick={() => setSelectedCandidate(c)} 
                     className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-orange-500/10 hover:border-orange-500/30 transition-all cursor-pointer group text-left"
                   >
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-bold text-white block truncate">
                          {c.full_name || `Candidate ${c.id.substring(0, 5)}`}
                        </span>
                        <span className="text-[10px] text-white/40 block truncate">
                          {c.role || 'No specific role'} • <span className={cn(
                            c.status === 'approved' ? 'text-emerald-400' :
                            c.status === 'declined' ? 'text-rose-400' : 'text-amber-400'
                          )}>{c.status}</span>
                        </span>
                      </div>
                      <span className="px-3 py-1.5 rounded-full bg-orange-500/20 text-orange-400 text-[9px] font-black uppercase tracking-widest text-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors ml-2">
                        Review
                      </span>
                   </div>
                 ))}
              </div>
            )}
            
            <button 
              onClick={() => toast(isAdmin ? "Accessing extended talent pool..." : "Reviewing shortlisted candidates...", 'info')}
              className="w-full py-4 mt-auto border border-orange-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-orange-400 hover:bg-orange-500/20 transition-all"
            >
              {isAdmin ? 'Manage Requisitions' : 'Vet Candidates'}
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 flex flex-col md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Users className="w-5 h-5 text-orange-400" /> Recruitment Progress</h3>
            <div className="space-y-3 flex-1">
               {reqs.map(req => (
                 <div key={req.id} onClick={() => handleReqClick(req.id)} className="p-5 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                   <div>
                     <span className="text-sm font-bold text-white block mb-1">{req.n}</span>
                     <span className="text-[10px] font-mono text-white/40">{req.cand}</span>
                   </div>
                   <div className="flex items-center gap-4">
                     {req.status === 'action_required' && <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-[9px] font-black uppercase tracking-widest">Review Match</span>}
                     {req.status === 'processing' && <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[9px] font-black uppercase tracking-widest">Approved</span>}
                     {req.status === 'sourcing' && <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest">Sourcing</span>}
                     <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      ) : desk === 'finances' && isAdmin ? (
        <div className="flex-1 flex flex-col h-full bg-black/40 border border-white/10 rounded-[2rem] relative z-10 animate-in fade-in zoom-in-95 duration-300 p-6 md:p-10">
          <h3 className="text-2xl md:text-3xl font-black text-white font-display mb-2 flex items-center gap-3">
             <ShieldCheck className="w-8 h-8 text-amber-500" />
             Financial Controller
          </h3>
          <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-8">All System Payments (Client & Candidate Fees)</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/60 border border-amber-500/20 rounded-2xl p-6">
              <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Total Revenue Run</h4>
              <p className="text-3xl font-black text-white">₦{allPayments.reduce((acc, pay) => acc + (pay.amount || 0), 0).toLocaleString()}</p>
            </div>
            <div className="bg-black/60 border border-amber-500/20 rounded-2xl p-6">
              <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Transactions</h4>
              <p className="text-3xl font-black text-white">{allPayments.length}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
             {allPayments.length > 0 ? (
                allPayments.map((pay: any, idx: number) => (
                   <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-amber-500/30 transition-colors">
                     <div>
                       <h4 className="text-white font-bold text-sm flex items-center gap-2">
                         {pay.purpose || 'Custom Payment'}
                         {!pay.user_id && <span className="bg-blue-500/20 text-blue-400 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">Candidate Fee</span>}
                         {pay.user_id && <span className="bg-rose-500/20 text-rose-400 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">Client Payment</span>}
                       </h4>
                       <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Ref: {pay.reference} | User: {pay.user?.email || 'N/A'}</p>
                       <p className="text-xs text-white/40 mt-1">{new Date(pay.created_at).toLocaleString()}</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className="text-amber-400 font-bold bg-amber-500/10 px-4 py-2 rounded-xl text-sm">₦{(pay.amount || 0).toLocaleString()}</span>
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" title="Successful"></span>
                     </div>
                   </div>
                ))
             ) : (
                <div className="text-center py-12">
                   <p className="text-white/40 text-sm">No payment history found.</p>
                </div>
             )}
          </div>
        </div>
      ) : desk === 'system' && isAdmin ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] p-6 md:p-8 flex flex-col md:col-span-3">
             <h3 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2"><Settings className="w-5 h-5 text-emerald-400" /> System Configuration</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/40 border border-emerald-500/20 rounded-2xl p-6 hover:bg-black/60 transition-colors">
                  <h4 className="text-white font-bold mb-2">Platform Metrics</h4>
                  <p className="text-xs text-white/40 mb-4">Total active users and system load.</p>
                  <p className="text-3xl font-black text-white font-display">99.9%</p>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-2">Uptime Core</p>
                </div>
                <div className="bg-black/40 border border-emerald-500/20 rounded-2xl p-6 hover:bg-black/60 transition-colors">
                  <h4 className="text-white font-bold mb-2">Access Control</h4>
                  <p className="text-xs text-white/40 mb-4">Manage permissions, clients, and staff roles.</p>
                  <button className="px-4 py-3 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500/30 transition-all w-full mt-2 border border-emerald-500/30">Manage Roles</button>
                </div>
                <div className="bg-black/40 border border-emerald-500/20 rounded-2xl p-6 hover:bg-black/60 transition-colors">
                  <h4 className="text-white font-bold mb-2">Audit & Security</h4>
                  <p className="text-xs text-white/40 mb-4">Review system activity and security events logs.</p>
                   <button className="px-4 py-3 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500/30 transition-all w-full mt-2 border border-emerald-500/30">View Logs</button>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col h-full bg-white/5 border border-white/10 rounded-[2rem] relative z-10 animate-in fade-in zoom-in-95 duration-300">
          <div className="p-6 md:p-8 border-b border-white/5 bg-black/20 flex justify-between items-center shrink-0">
             <div className="flex items-center gap-4">
               <div className="relative">
                 <div className="w-12 h-12 rounded-[1rem] border border-white/10 bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <MessageSquare className="w-5 h-5 text-white" />
                 </div>
                 <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full animate-pulse" />
               </div>
               <div>
                 <h3 className="text-sm font-bold text-white font-display">Client Messages Inbox</h3>
                 <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-0.5">Global Chat • Agency View</p>
               </div>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 md:space-y-10 min-h-[400px] scroll-smooth">
             {messages.map((msg) => (
               <div key={msg.id} className={`flex gap-4 md:gap-6 ${msg.sender === 'agency' ? 'flex-row-reverse text-right' : ''}`}>
                 <div className={cn(
                   "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 border",
                   msg.sender === 'agency' ? 'bg-gradient-to-br from-indigo-600 to-purple-600 border-indigo-400/30 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-black/50 border-white/10 shadow-inner'
                 )}>
                    {msg.sender === 'agency' ? <ShieldCheck className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-indigo-400" />}
                 </div>
                 <div className={`space-y-2 max-w-[85%] md:max-w-[70%] ${msg.sender === 'agency' ? 'items-end flex flex-col' : 'items-start flex flex-col'}`}>
                    <div className={cn(
                      "p-5 md:p-6",
                      msg.sender === 'agency' ? 'bg-indigo-600/20 border border-indigo-500/20 rounded-[2rem] rounded-tr-lg backdrop-blur-md' : 'bg-white/5 border border-white/10 rounded-[2rem] rounded-tl-lg backdrop-blur-md'
                    )}>
                      <p className={cn("text-xs md:text-sm leading-relaxed font-medium", msg.sender === 'agency' ? 'text-white' : 'text-white/80')}>
                        {msg.text}
                      </p>
                    </div>
                    <span className={cn(
                      "text-[9px] text-white/30 font-black uppercase tracking-widest block",
                      msg.sender === 'agency' ? 'mr-2' : 'ml-2'
                    )}>
                      {msg.sender === 'agency' ? 'You (Agency)' : `Client`} • {msg.time}
                    </span>
                 </div>
               </div>
             ))}
             <div ref={messagesEndRef} />
          </div>
          <div className="p-6 md:p-8 bg-black/40 border-t border-white/5 backdrop-blur-xl shrink-0 rounded-b-[2rem]">
            <form onSubmit={handleSendMessage} className="relative flex gap-3">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Message all clients..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-12 py-4 md:py-6 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/10 transition-all font-medium text-xs md:text-sm shadow-inner"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-[#121212] border border-white/10 rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-6 md:space-y-8 relative text-left">
            <button 
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 text-white/40 hover:text-white transition-all"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
              <div className="space-y-1">
                <span className="text-[10px] bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full uppercase font-bold tracking-widest">
                  Candidate Profile
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-white font-display mt-2">
                  {selectedCandidate.full_name || `Candidate ${selectedCandidate.id.substring(0, 5)}`}
                </h3>
                <p className="text-xs text-white/40 font-mono">Registered {new Date(selectedCandidate.created_at).toLocaleDateString()} • ID: {selectedCandidate.id}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button 
                  disabled={updatingCandidateId === selectedCandidate.id}
                  onClick={() => handleUpdateCandidateStatus(selectedCandidate.id, 'approved')}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    selectedCandidate.status === 'approved' ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-white/5 text-white/60 hover:bg-white/10'
                  )}
                >
                  Approve
                </button>
                <button 
                  disabled={updatingCandidateId === selectedCandidate.id}
                  onClick={() => handleUpdateCandidateStatus(selectedCandidate.id, 'declined')}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    selectedCandidate.status === 'declined' ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'bg-white/5 text-white/60 hover:bg-white/10'
                  )}
                >
                  Decline
                </button>
                <button 
                  disabled={updatingCandidateId === selectedCandidate.id}
                  onClick={() => handleUpdateCandidateStatus(selectedCandidate.id, 'pending_review')}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    selectedCandidate.status === 'pending_review' ? 'bg-amber-600 text-white shadow-[0_0_20px_rgba(217,119,6,0.3)]' : 'bg-white/5 text-white/60 hover:bg-white/10'
                  )}
                >
                  Reset Status
                </button>
              </div>
            </div>

            {selectedCandidate.raw_data && typeof selectedCandidate.raw_data === 'object' ? (
              <div className="space-y-8 divide-y divide-white/5">
                {/* Personal Bio */}
                <div className="space-y-4 pt-4 first:pt-0">
                  <h4 className="text-sm font-black uppercase text-orange-400 tracking-wider">Personal BioData</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                    <div>
                      <span className="text-white/40 block text-xs">Surname</span>
                      <span className="text-white font-medium">{selectedCandidate.raw_data.surname || '-'}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-xs">First Name</span>
                      <span className="text-white font-medium">{selectedCandidate.raw_data.firstName || '-'}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-xs">Other Name</span>
                      <span className="text-white font-medium">{selectedCandidate.raw_data.otherName || '-'}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-xs">Email Address</span>
                      <span className="text-white font-medium truncate block">{selectedCandidate.raw_data.email || '-'}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-xs">Telephone Number</span>
                      <span className="text-white font-medium">{selectedCandidate.raw_data.telephone || '-'}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-xs">WhatsApp Number</span>
                      <span className="text-white font-medium">{selectedCandidate.raw_data.whatsApp || '-'}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-xs">Date of Birth</span>
                      <span className="text-white font-medium">{selectedCandidate.raw_data.dob || '-'}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-xs">Gender</span>
                      <span className="text-white font-medium">{selectedCandidate.raw_data.sex === 'M' ? 'Male' : selectedCandidate.raw_data.sex === 'F' ? 'Female' : selectedCandidate.raw_data.sex || '-'}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-xs">Nationality</span>
                      <span className="text-white font-medium">{selectedCandidate.raw_data.nationality || '-'}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-xs">State / LGA</span>
                      <span className="text-white font-medium">{selectedCandidate.raw_data.stateOfOrigin || '-'} / {selectedCandidate.raw_data.lga || '-'}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-xs">Religion</span>
                      <span className="text-white font-medium">{selectedCandidate.raw_data.religion || '-'}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-xs">Marital Status</span>
                      <span className="text-white font-medium">{selectedCandidate.raw_data.maritalStatus || '-'}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-xs">Handicapped Status</span>
                      <span className="text-white font-medium">
                        {selectedCandidate.raw_data.handicap === 'YES' ? `Yes - ${selectedCandidate.raw_data.handicapChallenge || 'No challenge stated'}` : 'No'}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-xs">ID Verification</span>
                      <span className="text-white font-medium">{selectedCandidate.raw_data.idType || 'ID'} : {selectedCandidate.raw_data.validIdNumber || '-'}</span>
                    </div>
                    <div className="sm:col-span-2 md:col-span-3">
                      <span className="text-white/40 block text-xs">Home Address</span>
                      <span className="text-white font-medium">{selectedCandidate.raw_data.address || '-'}</span>
                    </div>
                  </div>
                  {selectedCandidate.raw_data.passportUrl && (
                    <div className="pt-3">
                      <span className="text-white/40 block text-xs mb-2">Passport Photograph</span>
                      <img src={selectedCandidate.raw_data.passportUrl} alt="Candidate Portrait" className="w-24 h-24 rounded-2xl object-cover border border-white/10" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>

                {/* Next of Kin */}
                <div className="space-y-4 pt-6">
                  <h4 className="text-sm font-black uppercase text-orange-400 tracking-wider">Next of Kin Contact Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                    <div>
                      <span className="text-white/40 block text-xs">Full Name</span>
                      <span className="text-white font-medium">{selectedCandidate.raw_data.nokFirstName || ''} {selectedCandidate.raw_data.nokSurname || '-'}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-xs">Relationship</span>
                      <span className="text-white font-medium">{selectedCandidate.raw_data.nokRelationship || '-'}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-xs">Telephone</span>
                      <span className="text-white font-medium">{selectedCandidate.raw_data.nokTelephone || '-'}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-xs">WhatsApp</span>
                      <span className="text-white font-medium">{selectedCandidate.raw_data.nokWhatsApp || '-'}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-xs">Email</span>
                      <span className="text-white font-medium truncate block">{selectedCandidate.raw_data.nokEmail || '-'}</span>
                    </div>
                    <div className="sm:col-span-2 md:col-span-3">
                      <span className="text-white/40 block text-xs">Address</span>
                      <span className="text-white font-medium">{selectedCandidate.raw_data.nokAddress || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Employment details */}
                <div className="space-y-4 pt-6">
                  <h4 className="text-sm font-black uppercase text-orange-400 tracking-wider">Desired Placement Preferences</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <div>
                      <span className="text-white/40 block text-xs mb-1">Target Positions</span>
                      <ul className="text-white font-medium space-y-1 list-inside list-decimal text-xs">
                        {selectedCandidate.raw_data.desiredPosition1 && <li>{selectedCandidate.raw_data.desiredPosition1}</li>}
                        {selectedCandidate.raw_data.desiredPosition2 && <li>{selectedCandidate.raw_data.desiredPosition2}</li>}
                        {selectedCandidate.raw_data.desiredPosition3 && <li>{selectedCandidate.raw_data.desiredPosition3}</li>}
                      </ul>
                    </div>
                    <div>
                      <span className="text-white/40 block text-xs mb-1">Target Job Locations</span>
                      <ul className="text-white font-medium space-y-1 list-inside list-decimal text-xs">
                        {selectedCandidate.raw_data.jobLocation1 && <li>{selectedCandidate.raw_data.jobLocation1}</li>}
                        {selectedCandidate.raw_data.jobLocation2 && <li>{selectedCandidate.raw_data.jobLocation2}</li>}
                        {selectedCandidate.raw_data.jobLocation3 && <li>{selectedCandidate.raw_data.jobLocation3}</li>}
                      </ul>
                    </div>
                    <div>
                      <span className="text-white/40 block text-xs">Work Mode Preference</span>
                      <span className="text-white font-medium">{selectedCandidate.raw_data.jobMode || '-'}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-xs">Years of Experience</span>
                      <span className="text-white font-medium">{selectedCandidate.raw_data.yearsOfExperience || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Guarantor Details */}
                <div className="space-y-4 pt-6">
                  <h4 className="text-sm font-black uppercase text-orange-400 tracking-wider">Guarantor Verification Logs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-4 text-xs">
                      <h5 className="font-bold text-white uppercase tracking-wider">Guarantor One</h5>
                      <div className="space-y-2">
                        <p><span className="text-white/40">Name:</span> {selectedCandidate.raw_data.g1FirstName} {selectedCandidate.raw_data.g1Surname}</p>
                        <p><span className="text-white/40">Occupation:</span> {selectedCandidate.raw_data.g1Occupation}</p>
                        <p><span className="text-white/40">Relationship:</span> {selectedCandidate.raw_data.g1Relationship}</p>
                        <p><span className="text-white/40">Address:</span> {selectedCandidate.raw_data.g1Address}</p>
                        <p><span className="text-white/40">Work Address:</span> {selectedCandidate.raw_data.g1WorkAddress}</p>
                        <p><span className="text-white/40">Tel / WA:</span> {selectedCandidate.raw_data.g1Telephone} {selectedCandidate.raw_data.g1WhatsApp ? `/ ${selectedCandidate.raw_data.g1WhatsApp}` : ''}</p>
                        <p><span className="text-white/40">Known candidate:</span> {selectedCandidate.raw_data.g1KnownDuration}</p>
                      </div>
                      {selectedCandidate.raw_data.g1FileUrl && (
                        <a href={selectedCandidate.raw_data.g1FileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-orange-400 border border-orange-400/20 px-3 py-1.5 rounded-lg font-bold hover:bg-orange-400/10 transition-all text-[9px] mt-2 uppercase tracking-widest">
                          <Download className="w-3.5 h-3.5" /> View Guarantor 1 Papers
                        </a>
                      )}
                    </div>
                    
                    <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-4 text-xs">
                      <h5 className="font-bold text-white uppercase tracking-wider">Guarantor Two</h5>
                      <div className="space-y-2">
                        <p><span className="text-white/40">Name:</span> {selectedCandidate.raw_data.g2FirstName} {selectedCandidate.raw_data.g2Surname}</p>
                        <p><span className="text-white/40">Occupation:</span> {selectedCandidate.raw_data.g2Occupation}</p>
                        <p><span className="text-white/40">Relationship:</span> {selectedCandidate.raw_data.g2Relationship}</p>
                        <p><span className="text-white/40">Address:</span> {selectedCandidate.raw_data.g2Address}</p>
                        <p><span className="text-white/40">Work Address:</span> {selectedCandidate.raw_data.g2WorkAddress}</p>
                        <p><span className="text-white/40">Tel / WA:</span> {selectedCandidate.raw_data.g2Telephone} {selectedCandidate.raw_data.g2WhatsApp ? `/ ${selectedCandidate.raw_data.g2WhatsApp}` : ''}</p>
                        <p><span className="text-white/40">Known candidate:</span> {selectedCandidate.raw_data.g2KnownDuration}</p>
                      </div>
                      {selectedCandidate.raw_data.g2FileUrl && (
                        <a href={selectedCandidate.raw_data.g2FileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-orange-400 border border-orange-400/20 px-3 py-1.5 rounded-lg font-bold hover:bg-orange-400/10 transition-all text-[9px] mt-2 uppercase tracking-widest">
                          <Download className="w-3.5 h-3.5" /> View Guarantor 2 Papers
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* 10 Acquaintance bio reference */}
                {selectedCandidate.raw_data.acquaintances && (
                  <div className="space-y-4 pt-6">
                    <h4 className="text-sm font-black uppercase text-orange-400 tracking-wider">Bio Data References (10 Acquaintances)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                      {selectedCandidate.raw_data.acquaintances.map((acq: any, index: number) => (
                        <div key={index} className="p-3 bg-white/5 rounded-xl border border-white/5 flex gap-3 items-center">
                          <span className="w-5 h-5 rounded-full bg-white/5 text-[9px] flex items-center justify-center font-bold text-white/30">{index + 1}</span>
                          <p className="text-white">{acq.surname} {acq.firstName || ''} {acq.otherName || ''}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <p className="text-sm text-white/60 font-medium">This candidate record has no structured form bio metadata uploaded.</p>
                <p className="text-xs text-white/40 max-w-sm mx-auto leading-relaxed">Vetting registrations submitted by actual users through the Candidate Registration Form will automatically populate extensive profile summaries, guarantor files and 10 acquaintance verification lists.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { usePaystackPayment } from 'react-paystack';

function ClientPortal() {
  const { user } = useAuth();
  const { toast, success } = useToast();
  const [activeTab, setActiveTab] = useState<'documents' | 'talent' | 'messages' | 'projects' | 'payments'>('projects');
  const [projectBrief, setProjectBrief] = useState('');
  const [projectBudget, setProjectBudget] = useState('');
  const [currency, setCurrency] = useState<'NGN' | 'USD' | 'EUR' | 'GBP'>('NGN');
  const [projectRequested, setProjectRequested] = useState(false);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentPurpose, setPaymentPurpose] = useState('');
  const [paymentsList, setPaymentsList] = useState<any[]>([]);

  // config for paystack
  const paymentConfig = {
    reference: `client_${new Date().getTime().toString()}`,
    email: user?.email || 'client@jackson.com',
    amount: (parseFloat(paymentAmount.replace(/,/g, '')) || 0) * 100, // 100 kobo = 1 naira
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_dummy_key',
    channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
  };
  const initializePayment = usePaystackPayment(paymentConfig);

  const handleCustomPayment = () => {
    const rawVal = paymentAmount.replace(/,/g, '');
    if(!rawVal || isNaN(Number(rawVal)) || Number(rawVal) <= 0) return;
    initializePayment({
       onSuccess: async (ref: any) => {
          if (hasSupabase && user) {
             const newPayment = {
                user_id: user.id,
                amount: parseFloat(rawVal),
                reference: ref.reference || paymentConfig.reference,
                purpose: paymentPurpose || 'Custom Payment',
                status: 'success'
             };
             const {data} = await supabase.from('payments').insert([newPayment]).select();
             if(data && data.length) setPaymentsList(prev => [data[0], ...prev]);
          }
          success("Payment successfully completed!");
          setPaymentAmount('');
          setPaymentPurpose('');
       },
       onClose: () => {
          toast("Payment cancelled.", 'info');
       }
    })
  }

  useEffect(() => {
    if (!hasSupabase) {
      if (user) {
        fetch('/api/messages').then(r=>r.json()).then(data => { if (data?.length) setMessages(data) }).catch(()=>{});
      }
      return;
    }
    if (!user) return;
    
    // Fetch initial messages
    supabase.from('messages').select('*').order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setMessages(data.map((m: any) => ({
            id: m.id,
            sender: m.sender_role as any,
            text: m.text,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })));
        }
      });
      
    // Fetch payments
    supabase.from('payments').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({data}) => {
         if(data && data.length > 0) setPaymentsList(data);
      });
      
    // Subscribe to new messages
    const sub = supabase.channel('messages_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        const m = payload.new;
        setMessages(prev => [...prev, {
          id: m.id,
          sender: m.sender_role as any,
          text: m.text,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }).subscribe();
      
    return () => {
      supabase.removeChannel(sub);
    };
  }, [user]);

  const [files, setFiles] = useState<VaultFile[]>([
    { name: 'Master_Service_Agreement_v2.pdf', size: '2.4 MB', date: '2 days ago', color: 'text-rose-400', category: 'Legal' },
    { name: 'Scope_of_Work_Q4_Final.pdf', size: '1.1 MB', date: '5 days ago', color: 'text-indigo-400', category: 'Proposals' },
    { name: 'Executive_Summary_Report.pdf', size: '4.8 MB', date: '1 week ago', color: 'text-emerald-400', category: 'Finance' },
    { name: 'Brand_Identity_Guidelines.pdf', size: '15.2 MB', date: '2 weeks ago', color: 'text-amber-400', category: 'Creative' },
  ]);

  const [candidates, setCandidates] = useState([
    { id: 1, role: 'Senior UX Designer', reqId: 'REQ-001', match: '95%', name: 'Elena R.', status: 'Ready for Interview' },
    { id: 2, role: 'Lead DevOps Engineer', reqId: 'REQ-002', match: '88%', name: 'James T.', status: 'Review Output' },
  ]);

  const scheduleInterview = (id: number) => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, status: 'Interview Scheduled' } : c));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'messages') {
      scrollToBottom();
    }
  }, [messages, activeTab]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim()) return;
    
    if (hasSupabase && user) {
      // Send to supabase
      await supabase.from('messages').insert([{
        text: newMessage,
        sender_id: user.id,
        sender_role: 'client'
      }]);
      setNewMessage('');
    } else {
      try {
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ sender: 'client', text: newMessage })
        });
        const created = await res.json();
        setMessages([...messages, created]);
      } catch (err) {}
      setNewMessage('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles([
        { 
          name: file.name, 
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`, 
          date: 'Just now', 
          color: 'text-indigo-400', 
          category: 'Uploads' 
        },
        ...files
      ]);
    }
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in h-max flex flex-col pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
            <Lock className="w-3 h-3" /> Secure Connection
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white font-display">
            Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Portal</span>
          </h1>
          <p className="text-sm md:text-base text-white/40 max-w-xl leading-relaxed">
            Your central hub for managing project files, exploring candidates, and messaging your team.
          </p>
        </div>
        
        <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10 backdrop-blur-xl w-full md:w-auto shadow-2xl custom-scrollbar relative z-20">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`group flex-none p-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center whitespace-nowrap overflow-hidden w-12 hover:w-36 hover:gap-2 px-3 ${activeTab === 'projects' ? 'bg-amber-600 text-white shadow-[0_0_20px_rgba(217,119,6,0.3)]' : 'bg-transparent text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <Rocket className="w-4 h-4 shrink-0" />
            <span className={`transition-all duration-300 opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs`}>Start Project</span>
          </button>
          <button 
            onClick={() => setActiveTab('documents')}
            className={`group flex-none p-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center whitespace-nowrap overflow-hidden w-12 hover:w-44 hover:gap-2 px-3 ${activeTab === 'documents' ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'bg-transparent text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <FileKey className="w-4 h-4 shrink-0" />
            <span className={`transition-all duration-300 opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs`}>Files & Documents</span>
          </button>
          <button 
            onClick={() => setActiveTab('talent')}
            className={`group flex-none p-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center whitespace-nowrap overflow-hidden w-12 hover:w-40 hover:gap-2 px-3 ${activeTab === 'talent' ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(5,150,105,0.3)]' : 'bg-transparent text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span className={`transition-all duration-300 opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs`}>Talent Matches</span>
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`group flex-none p-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center whitespace-nowrap overflow-hidden w-12 hover:w-32 hover:gap-2 px-3 ${activeTab === 'messages' ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'bg-transparent text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span className={`transition-all duration-300 opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs`}>Messages</span>
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            className={`group flex-none p-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center whitespace-nowrap overflow-hidden w-12 hover:w-32 hover:gap-2 px-3 ${activeTab === 'payments' ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.3)]' : 'bg-transparent text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className={`transition-all duration-300 opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs`}>Payments</span>
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-[500px] md:min-h-[700px] bg-black/40 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row backdrop-blur-2xl shadow-2xl relative">
        
        {/* Background glow for portal container */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        {activeTab === 'projects' && (
          <div className="flex-1 flex flex-col h-full bg-white/5 relative z-10 p-6 md:p-10 overflow-y-auto">
             <div className="max-w-3xl mx-auto w-full">
               <div className="mb-10 text-center">
                 <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
                    <Rocket className="w-8 h-8 text-amber-500" />
                 </div>
                 <h3 className="text-2xl md:text-4xl font-black text-white font-display mb-4">Start a New Project</h3>
                 <p className="text-sm text-white/50">Submit your project details and requirements. Our team will review your brief and prepare a proposal.</p>
               </div>
               
               {projectRequested ? (
                 <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-10 text-center animate-in fade-in zoom-in slide-in-bottom-4 duration-500">
                    <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
                    <h4 className="text-2xl font-bold text-white mb-2">Project Request Submitted</h4>
                    <p className="text-emerald-200/60 mb-8">Your brief has been securely transmitted. A director will be in touch within 24 hours.</p>
                    <button 
                      onClick={() => setProjectRequested(false)}
                      className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                      Submit Another Request
                    </button>
                 </div>
               ) : (
                 <div className="bg-black/40 border border-white/10 rounded-3xl p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
                   <div>
                     <label className="block text-[10px] uppercase font-bold tracking-widest text-white/40 mb-3">Project Brief & Objectives</label>
                     <textarea 
                       value={projectBrief}
                       onChange={(e) => setProjectBrief(e.target.value)}
                       placeholder="Describe what you want to build, your goals, and timeline..."
                       className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white/10 transition-all min-h-[160px] resize-y"
                     />
                   </div>
                   
                   <div>
                     <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-3">
                       <label className="block text-[10px] uppercase font-bold tracking-widest text-white/40">Estimated Budget</label>
                       <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/10 w-max">
                          {(['NGN', 'USD', 'GBP', 'EUR'] as const).map(curr => (
                            <button
                              key={curr}
                              onClick={() => setCurrency(curr)}
                              className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${currency === curr ? 'bg-amber-500/20 text-amber-500 shadow-[0_0_10px_rgba(217,119,6,0.2)]' : 'text-white/40 hover:text-white'}`}
                            >
                              {curr}
                            </button>
                          ))}
                       </div>
                     </div>
                     <CurrencyInput 
                       value={projectBudget}
                       onChange={setProjectBudget}
                       prefix={currency === 'NGN' ? '₦' : currency === 'USD' ? '$' : currency === 'GBP' ? '£' : '€'}
                       placeholder="Enter your budget amount..." 
                       className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-6 py-4 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white/10 transition-all font-medium text-sm shadow-inner"
                     />
                   </div>
                   
                   <div className="pt-6 border-t border-white/10">
                     <button 
                       onClick={async () => {
                         if(projectBrief) {
                           if (hasSupabase && user) {
                             await supabase.from('projects').insert([{
                               name: 'New Client Project',
                               description: projectBrief,
                               client_id: user.id
                             }]);
                           }
                           setProjectRequested(true);
                         }
                       }}
                       disabled={!projectBrief}
                       className="w-full py-5 rounded-xl bg-amber-600 border border-amber-500 text-white text-xs font-bold uppercase tracking-widest hover:bg-amber-500 transition-all shadow-[0_0_30px_rgba(217,119,6,0.2)] hover:shadow-[0_0_40px_rgba(217,119,6,0.4)] disabled:opacity-50 disabled:cursor-not-allowed group flex justify-center items-center gap-3"
                     >
                       Submit Brief to Agency <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </button>
                   </div>
                 </div>
               )}
             </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="flex-1 flex flex-col lg:flex-row h-full relative z-10">
            <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-white/5 p-6 md:p-8 space-y-6 md:space-y-8 bg-white/5 overflow-x-auto lg:overflow-x-visible">
              <div className="flex items-center gap-3 text-white/80">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] font-display">Folders</h3>
              </div>
              <nav className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">
                {['All Files', 'Contracts & Legal', 'Creative Files', 'Financials', 'Proposals'].map((cat, idx) => (
                  <button key={cat} className={`whitespace-nowrap md:w-full text-left px-5 py-3 rounded-xl text-[10px] font-bold transition-all flex justify-between items-center group uppercase tracking-widest border ${idx === 0 ? 'bg-white/10 text-white border-white/10' : 'text-white/40 hover:bg-white/5 hover:text-white border-transparent'}`}>
                    {cat}
                    <ChevronRight className={`w-3 h-3 hidden lg:block transition-all ${idx === 0 ? 'opacity-100 text-indigo-400' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
                  </button>
                ))}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-white/5 hidden lg:block">
                 <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-5">
                    <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-2">Storage Usage</p>
                    <div className="flex items-end gap-2 mb-3">
                      <span className="text-2xl font-black text-white font-display">23.5</span>
                      <span className="text-xs text-white/40 font-bold mb-1">GB used</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                       <div className="w-[45%] h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                    </div>
                 </div>
              </div>
            </aside>
            <div className="flex-1 p-6 md:p-10 overflow-y-auto">
               <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-10 gap-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white font-display mb-2">Project Files</h3>
                  <p className="text-xs text-white/40 uppercase tracking-widest font-bold"><Clock className="w-3 h-3 inline mr-1 -mt-0.5" /> Last updated 2 hours ago</p>
                </div>
                <div className="flex items-center gap-3">
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                  <button onClick={() => fileInputRef.current?.click()} className="px-5 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-xl">
                    <Upload className="w-4 h-4" /> Upload File
                  </button>
                </div>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                 {files.map((doc, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, scale: 0.95, y: 10 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     transition={{ delay: i * 0.05 }}
                     className="bg-white/5 border border-white/10 p-6 rounded-[2rem] group hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:shadow-[0_0_30px_rgba(79,70,229,0.1)] transition-all relative overflow-hidden flex flex-col h-full"
                   >
                     <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="w-14 h-14 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                          <FileText className={cn("w-6 h-6", doc.color)} />
                        </div>
                        <button className="p-3 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/10"><Download className="w-5 h-5" /></button>
                     </div>
                     <div className="mt-auto relative z-10">
                       <h4 className="font-bold text-white mb-3 line-clamp-2 text-sm leading-relaxed">{doc.name}</h4>
                       <div className="flex items-center gap-3 text-[10px] uppercase font-black tracking-widest">
                          <span className="text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded-md">{doc.category}</span>
                          <span className="text-white/20">{doc.size}</span>
                          <span className="text-white/20 ml-auto">{doc.date}</span>
                       </div>
                     </div>
                   </motion.div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="flex-1 flex flex-col h-full bg-white/5 relative z-10">
            <div className="p-6 md:p-8 border-b border-white/5 bg-black/20 flex justify-between items-center shrink-0">
               <div className="flex items-center gap-4">
                 <div className="relative">
                   <div className="w-12 h-12 rounded-full border border-white/10 bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <User className="w-5 h-5 text-white" />
                   </div>
                   <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full animate-pulse" />
                 </div>
                 <div>
                   <h3 className="text-sm font-bold text-white font-display">Dedicated Account Team</h3>
                   <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-0.5">Online • Typical response time: &lt; 15m</p>
                 </div>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 md:space-y-10 min-h-[300px] scroll-smooth">
               {messages.map((msg) => (
                 <div key={msg.id} className={`flex gap-4 md:gap-6 ${msg.sender === 'client' ? 'flex-row-reverse text-right' : ''}`}>
                   <div className={cn(
                     "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 border",
                     msg.sender === 'client' ? 'bg-gradient-to-br from-indigo-600 to-purple-600 border-indigo-400/30 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-black/50 border-white/10 shadow-inner'
                   )}>
                      {msg.sender === 'client' ? <User className="w-5 h-5 text-white" /> : <ShieldCheck className="w-5 h-5 text-indigo-400" />}
                   </div>
                   <div className={`space-y-2 max-w-[85%] md:max-w-[70%] ${msg.sender === 'client' ? 'items-end flex flex-col' : ''}`}>
                      <div className={cn(
                        "p-5 md:p-6",
                        msg.sender === 'client' ? 'bg-indigo-600/20 border border-indigo-500/20 rounded-[2rem] rounded-tr-lg backdrop-blur-md' : 'bg-white/5 border border-white/10 rounded-[2rem] rounded-tl-lg backdrop-blur-md'
                      )}>
                        <p className={cn("text-xs md:text-sm leading-relaxed font-medium", msg.sender === 'client' ? 'text-white' : 'text-white/80')}>
                          {msg.text}
                        </p>
                      </div>
                      <span className={cn(
                        "text-[9px] text-white/30 font-black uppercase tracking-widest block",
                        msg.sender === 'client' ? 'mr-2' : 'ml-2'
                      )}>
                        {msg.sender === 'client' ? 'You' : 'Jackson Multifacet Team'} • {msg.time}
                      </span>
                   </div>
                 </div>
               ))}
               <div ref={messagesEndRef} />
            </div>
            <div className="p-6 md:p-8 bg-black/40 border-t border-white/5 backdrop-blur-xl shrink-0">
              <form onSubmit={handleSendMessage} className="relative group flex gap-4">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message to your team..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-6 py-4 md:py-5 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/10 transition-all font-medium text-xs md:text-sm shadow-inner"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-white text-black px-6 md:px-8 rounded-2xl hover:bg-gray-200 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group-focus-within:bg-indigo-600 group-focus-within:text-white"
                >
                  <Send className="w-4 h-4" /> <span className="hidden sm:inline">Send</span>
                </button>
              </form>
              <div className="mt-4 flex items-center justify-center gap-2">
                 <Lock className="w-3 h-3 text-white/20" />
                 <p className="text-[9px] uppercase tracking-widest text-white/20 font-black">Messages are private and secure</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'talent' && (
          <div className="flex-1 flex flex-col h-full bg-white/5 relative z-10 p-6 md:p-10 overflow-y-auto">
             <div className="mb-10">
               <h3 className="text-2xl md:text-3xl font-black text-white font-display mb-2">Candidate Matches</h3>
               <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Candidates reviewed and selected for your open roles</p>
             </div>
             
             <div className="space-y-6">
                {candidates.map((cand) => (
                  <div key={cand.id} className="bg-black/40 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg">
                         {cand.match}
                       </div>
                       <div>
                         <div className="flex items-center gap-3 mb-1">
                           <h4 className="text-lg font-bold text-white">{cand.name}</h4>
                           <span className={cn(
                             "px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest",
                             cand.status === 'Interview Scheduled' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'
                           )}>{cand.status}</span>
                         </div>
                         <p className="text-sm text-white/60 font-medium mb-1">{cand.role}</p>
                         <p className="text-[10px] text-white/30 uppercase font-mono tracking-widest">{cand.reqId}</p>
                       </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                       <button className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex justify-center items-center gap-2">
                         <FileText className="w-4 h-4" /> View Resume
                       </button>
                       <button 
                         onClick={() => scheduleInterview(cand.id)}
                         disabled={cand.status === 'Interview Scheduled'}
                         className={cn(
                           "px-5 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(5,150,105,0.2)]",
                           cand.status === 'Interview Scheduled' ? 'bg-indigo-600/50 border-indigo-500/50 text-white/50 cursor-not-allowed shadow-none' : 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500'
                         )}
                       >
                         {cand.status === 'Interview Scheduled' ? 'Scheduled' : 'Schedule Interview'}
                       </button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="flex-1 flex flex-col h-full relative z-10 overflow-hidden bg-white/5">
            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 md:space-y-10">
               <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white font-display mb-2">Make a Resource Payment</h3>
                  <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Invoices and direct payments for projects and talent</p>
               </div>

               <div className="bg-black/40 border border-rose-500/20 rounded-[2rem] p-6 max-w-xl shadow-[0_0_50px_rgba(225,29,72,0.05)]">
                 <div className="space-y-4">
                   <div>
                     <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 block mb-2">Payment Purpose</label>
                     <input 
                       value={paymentPurpose}
                       onChange={(e) => setPaymentPurpose(e.target.value)}
                       placeholder="e.g. Invoice #1204 - Project Retainer"
                       className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
                     />
                   </div>
                   <div>
                     <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 block mb-2">Amount (NGN)</label>
                     <CurrencyInput 
                       value={paymentAmount}
                       onChange={setPaymentAmount}
                       prefix="₦"
                       placeholder="100000"
                       className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 p-4 text-white font-bold text-lg focus:outline-none focus:border-rose-500 transition-colors"
                     />
                   </div>
                   <button 
                     onClick={handleCustomPayment}
                     disabled={!paymentAmount || isNaN(Number(paymentAmount.replace(/,/g, ''))) || Number(paymentAmount.replace(/,/g, '')) <= 0}
                     className="w-full mt-4 bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(225,29,72,0.3)] group flex justify-center items-center gap-2"
                   >
                     <ShieldCheck className="w-5 h-5 hidden group-hover:block transition-all" /> Secure Checkout
                   </button>
                 </div>
               </div>

               <div>
                 <h3 className="text-sm font-black text-white font-display uppercase tracking-widest mb-4">Financial History</h3>
                 {paymentsList.length > 0 ? (
                    <div className="space-y-3">
                      {paymentsList.map((pay: any, idx: number) => (
                         <div key={idx} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                           <div>
                             <h4 className="text-white font-bold text-sm">{pay.purpose || 'Custom Payment'}</h4>
                             <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Ref: {pay.reference} • {new Date(pay.created_at).toLocaleDateString()}</p>
                           </div>
                           <div className="flex items-center gap-4">
                              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full text-xs">₦{(pay.amount || 0).toLocaleString()}</span>
                              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" title="Successful"></span>
                           </div>
                         </div>
                      ))}
                    </div>
                 ) : (
                    <p className="text-xs text-white/40">No past financial history available yet.</p>
                 )}
               </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function PortalView() {
  const { user } = useAuth();
  
  if (user?.role === 'admin' || user?.role === 'staff') {
    return <AdminPortal />;
  } else if (user?.role === 'candidate') {
    return <CandidatePortal />;
  } else {
    return <ClientPortal />;
  }
}

