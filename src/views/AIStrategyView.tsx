import { useState } from 'react';
import { Sparkles, Send, Brain, Target, Zap, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AIStrategyView() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generateStrategy = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      setResult(data.text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in pb-20">
      <header>
        <div className="flex items-center gap-3 md:gap-4 mb-3">
          <div className="p-2 md:p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <Sparkles className="text-white w-4 h-4 md:w-5 md:h-5" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display">Intelligence Lab</h1>
        </div>
        <p className="text-sm md:text-base text-white/40">Leverage advanced neural models for rapid digital roadmap synthesis and market ideation.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="space-y-8">
          <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[2rem] space-y-8 backdrop-blur-sm">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 flex items-center gap-3">
              <Brain className="w-4 h-4" /> Neural Parameters
            </h3>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Define current objectives... E.g., 'Develop a 3-month growth strategy for a fintech startup...'"
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 h-56 text-white placeholder-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm leading-relaxed font-medium"
            />
            <button 
              onClick={generateStrategy}
              disabled={loading || !prompt.trim()}
              className="w-full bg-indigo-600 text-white py-4 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-indigo-600/20 border border-white/5 uppercase tracking-widest text-[10px]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 group-hover:fill-current" />}
              {loading ? 'Synthesizing...' : 'Generate Roadmap'}
            </button>
          </div>

             <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 px-2">Prompt Library</h3>
              {[
                'Digital product pivot',
                'Community growth',
                'Brand identity',
              ].map((p, i) => (
                <button 
                 key={i} 
                 onClick={() => setPrompt(p)}
                 className="w-full text-left px-5 py-3.5 bg-white/5 border border-white/5 rounded-full text-[10px] text-white/30 hover:border-white/20 hover:text-white transition-all font-bold uppercase tracking-widest"
                >
                  {p}
                </button>
              ))}
           </div>
        </div>

        <div className="lg:col-span-2">
           {result ? (
             <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] space-y-8 animate-in backdrop-blur-xl shadow-2xl">
                <div className="flex justify-between items-center pb-8 border-b border-white/5">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3 font-display">
                    <Target className="w-6 h-6 text-indigo-400" /> Strategic Synthesis
                  </h3>
                  <button className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400/50 hover:text-indigo-400 bg-indigo-400/5 px-4 py-2 rounded-full border border-indigo-400/10 transition-colors uppercase tracking-widest">Export Report</button>
                </div>
                <div className="prose prose-invert prose-indigo max-w-none text-white/60 leading-relaxed overflow-y-auto max-h-[700px] pr-6 scrollbar-thin scrollbar-thumb-white/5 prose-headings:font-display prose-headings:text-white prose-strong:text-indigo-400">
                  <ReactMarkdown
                    components={{
                      img: ({node, ...props}) => <img {...props} referrerPolicy="no-referrer" className="max-w-full rounded-lg my-4 shadow-xl" />
                    }}
                  >
                    {result}
                  </ReactMarkdown>
                </div>
             </div>
           ) : (
             <div className="h-full min-h-[500px] border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center bg-white/[0.02]">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/5 rotate-3 hover:rotate-0 transition-transform duration-500">
                  <Brain className="w-10 h-10 text-white/10" />
                </div>
                <h3 className="text-2xl font-bold text-white/20 mb-3 font-display">Neural Link Idle</h3>
                <p className="text-white/10 max-w-xs text-sm font-medium">Input your strategic parameters to generate an AI-powered roadmap for system deployment.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
