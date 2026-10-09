import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Plus, MoreVertical, ExternalLink } from 'lucide-react';
import { Project } from '../types';
import { supabase, hasSupabase } from '../supabase';

export default function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      if (!hasSupabase) {
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

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-10 animate-in pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 font-display">Projects</h1>
          <p className="text-sm md:text-base text-white/40">Track and manage active engagements across the agency.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 border border-white/10">
          <Plus className="w-4 h-4" /> Initialize Project
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            type="text" 
            placeholder="Search projects by name, client, or status..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium"
          />
        </div>
        <button className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {filteredProjects.map((project, i) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group bg-white/5 border border-white/10 rounded-[2rem] md:rounded-3xl p-6 md:p-8 hover:border-indigo-500/50 transition-all cursor-pointer relative overflow-hidden backdrop-blur-sm shadow-xl"
          >
             <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="w-5 h-5 text-white/40" />
            </div>

            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/20 mb-2 block">Project #ID_{project.id}</span>
                <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors font-display line-clamp-1">{project.name}</h3>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                project.status === 'active' ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" : "bg-white/5 text-white/40 border-white/10"
              )}>
                {project.status}
              </span>
            </div>

            <p className="text-white/40 text-sm mb-8 line-clamp-2 leading-relaxed h-11">
              {project.description}
            </p>

            <div className="space-y-3">
              <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest mb-1">
                <span className="text-white/20">Operational Progress</span>
                <span className="text-white font-bold">{project.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  className="h-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                />
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050507] bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                       {i === 1 ? 'JD' : i === 2 ? 'SL' : 'AR'}
                    </div>
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-[#050507] bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/20">
                  +4
                </div>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white flex items-center gap-2 transition-all group/btn">
                Operations Board <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
