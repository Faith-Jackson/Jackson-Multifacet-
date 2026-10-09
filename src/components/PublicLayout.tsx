import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MessageSquare, 
  Bot, 
  X, 
  Send,
  Zap,
  Sparkles,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Phone,
  Mail,
  Menu
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useToast } from './Toast';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const testimonials = [
  { name: "Olumide Adebayo", company: "Lagos Tech Hub", text: "Jackson Multifacet transformed our digital infrastructure. Their architectural precision is unmatched in Nigeria." },
  { name: "Chidi Okafor", company: "Enugu Logistics", text: "The branding they created for us gave us the professional edge we needed to scale across the border." },
  { name: "Amina Bello", company: "Kano FinTech", text: "Strategic intelligence at its best. Their AI roadmap saved us months of trial and error." },
  { name: "Funke Akindele", company: "Abuja Creatives", text: "Extraordinary solutions. They don't just build websites; they build digital legacies." },
  { name: "Emeka Nwosu", company: "Port Harcourt Energy", text: "The portal makes working together seamless. Great communication and even better results." }
];

const RollingTestimonials = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="w-full overflow-hidden bg-black/40 border-y border-white/5 py-16 relative">
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee-400 mb-2 block">Our Clients</span>
        <h3 className="text-3xl font-bold text-white font-display">Regional Impact</h3>
      </div>
      
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#050507] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#050507] to-transparent z-10 pointer-events-none" />
      
      <div className="flex gap-4 md:gap-8 px-4 md:px-8">
        <motion.div 
          animate={expanded === null ? { x: [0, -1000] } : {}}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-4 md:gap-8"
        >
          {[...testimonials, ...testimonials, ...testimonials].map((t, idx) => (
            <motion.div 
              key={idx}
              onMouseEnter={() => setExpanded(idx)}
              onMouseLeave={() => setExpanded(null)}
              onClick={() => setExpanded(expanded === idx ? null : idx)}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`flex-shrink-0 bg-white/5 border border-white/10 p-6 md:p-8 rounded-[2rem] backdrop-blur-md transition-all duration-500 cursor-pointer group shadow-2xl ${
                expanded === idx ? 'w-[calc(100vw-48px)] sm:w-[450px] border-coffee-500/50 bg-white/[0.08]' : 'w-[280px] sm:w-[350px] border-white/10 text-xs sm:text-base'
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-coffee-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-lg">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="text-white font-bold">{t.name}</h4>
                  <p className="text-[9px] font-black uppercase tracking-widest text-coffee-400">{t.company}</p>
                </div>
              </div>
              <p className={`text-white/60 leading-relaxed transition-all duration-500 ${
                expanded === idx ? 'text-base opacity-100' : 'text-sm line-clamp-3 opacity-60'
              }`}>
                "{t.text}"
              </p>
              {expanded === idx && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 pt-6 border-t border-white/10 flex items-center gap-2"
                >
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => <Sparkles key={s} className="w-3 h-3 text-coffee-400" />)}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/20">Verified Partner</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { error } = useToast();
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    setFormStatus('submitting');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setFormStatus('success');
        setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        throw new Error('Failed to send');
      }
    } catch (err) {
      console.error(err);
      setFormStatus('idle');
      error('Transmission failed. Direct signal integration recommended.');
    }
  };

  const handleAIChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'ai', text: data.text }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'ai', text: "Signal interrupted. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#e0e0e6] font-sans selection:bg-coffee-500 selection:text-white selection:bg-opacity-30 flex flex-col relative overflow-x-hidden">
      {/* Noise Texture Overlay */}
      <div className="noise-overlay" />

      {/* Background Blurry Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] md:w-[700px] md:h-[700px] bg-coffee-500/35 rounded-full blur-[80px] sm:blur-[120px] md:blur-[140px] animate-blob" />
        <div className="absolute bottom-[10%] left-[-5%] w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] bg-purple-500/30 rounded-full blur-[60px] sm:blur-[100px] md:blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[20%] w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[500px] md:h-[500px] bg-emerald-500/20 rounded-full blur-[50px] sm:blur-[80px] md:blur-[100px] animate-blob animation-delay-4000" />
      </div>

      {/* Floating Interactive Elements */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] flex flex-col gap-4">
        {/* Contact Popup */}
        {showContactPopup && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute bottom-16 right-0 w-[calc(100vw-48px)] sm:w-[400px] bg-zinc-900 border border-white/10 backdrop-blur-2xl rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl z-[110]"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400 mb-1 block">Inquiry System</span>
              <h3 className="text-xl font-bold text-white font-display">Send a Message</h3>
            </div>
            <button 
              onClick={() => setShowContactPopup(false)}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/40" />
            </button>
          </div>

            {formStatus === 'success' ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-8 h-8 text-emerald-500" />
                </div>
                <h4 className="text-white font-bold">Message Sent</h4>
                <p className="text-white/40 text-xs">We have received your inquiry and will respond shortly.</p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleContactSubmit}>
                <input 
                  required
                  name="name"
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
                <input 
                  required
                  name="email"
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
                <textarea 
                  required
                  name="message"
                  rows={4}
                  placeholder="How can we help?" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                ></textarea>
                <button 
                  disabled={formStatus === 'submitting'}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        )}

        {/* AI Chat Window */}
        {showAIChat && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute bottom-16 right-0 w-[calc(100vw-48px)] sm:w-[350px] h-[500px] max-h-[60vh] sm:max-h-[70vh] bg-zinc-900 border border-white/10 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl z-[110]"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-coffee-500/20 rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-coffee-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Assistant</h4>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowAIChat(false)}
                className="text-white/20 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {chatMessages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 space-y-3">
                  <span className="text-coffee-400"><Sparkles className="w-8 h-8 mx-auto" /></span>
                  <p className="text-xs font-medium">How can we help <br/>your business today?</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl text-xs leading-relaxed overflow-x-auto ${
                    msg.role === 'user' 
                      ? 'bg-coffee-600 text-white rounded-br-none' 
                      : 'bg-white/5 text-white/70 border border-white/10 rounded-bl-none'
                  }`}>
                    <div className="markdown-body">
                      {msg.role === 'user' ? (
                        msg.text
                      ) : (
                        <ReactMarkdown
                          components={{
                            img: ({node, ...props}) => <img {...props} referrerPolicy="no-referrer" className="max-w-full rounded-lg my-2" />
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-3xl rounded-bl-none border border-white/10">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-coffee-400/40 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-coffee-400/40 rounded-full animate-bounce delay-100" />
                      <div className="w-1.5 h-1.5 bg-coffee-400/40 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleAIChat} className="p-4 bg-white/5 border-t border-white/5">
              <div className="relative">
                <input 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pr-12 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-coffee-500/50"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-coffee-600 text-white rounded-xl flex items-center justify-center hover:bg-coffee-500 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <motion.button
          onClick={() => {
            setShowContactPopup(!showContactPopup);
            setShowAIChat(false);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-[45px] h-[45px] bg-coffee-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-coffee-500/40 border border-coffee-500/50 backdrop-blur-md group relative"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="absolute right-full mr-4 px-3 py-1.5 bg-black/80 text-[10px] font-black uppercase tracking-widest text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
            Contact
          </span>
        </motion.button>
        
        <motion.button
          onClick={() => {
            setShowAIChat(!showAIChat);
            setShowContactPopup(false);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-[45px] h-[45px] bg-white/5 text-coffee-400 rounded-full flex items-center justify-center shadow-lg border border-white/10 backdrop-blur-md group relative shadow-[0_0_20px_rgba(172,145,121,0.2)]"
        >
          <Bot className="w-5 h-5 animate-pulse" />
          <span className="absolute right-full mr-4 px-3 py-1.5 bg-black/80 text-[10px] font-black uppercase tracking-widest text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
            Assistant
          </span>
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 border-b border-white/5 bg-black/40 backdrop-blur-xl transition-all duration-300 ${showMobileMenu ? 'z-[120]' : 'z-[60]'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-[125]">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity z-[70]">
            <div className="w-9 h-9 bg-gradient-to-br from-coffee-500 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(172,145,121,0.4)]">
              <Building2 className="text-white w-5 h-5" />
            </div>
            <span className="text-[14px] font-bold tracking-tight text-white font-display uppercase">JACKSON <span className="text-coffee-400">MULTIFACET</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <Link 
                key={item.label} 
                to={item.href} 
                className={`text-xs font-bold uppercase tracking-widest transition-all relative ${
                  location.pathname === item.href ? 'text-coffee-400' : 'text-white/40 hover:text-white'
                }`}
              >
                {item.label}
                {location.pathname === item.href && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-coffee-500 rounded-full"
                  />
                )}
              </Link>
            ))}
            <Link to="/portal" className="bg-white/5 border border-white/10 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Portal Access</Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="md:hidden flex items-center gap-3">
            <Link to="/portal" className="bg-white/10 border border-white/20 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all z-[130] relative shadow-lg">Portal</Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all z-[130]"
              aria-label="Toggle Menu"
            >
              <div className="relative w-6 h-6">
                <motion.span
                  animate={{ rotate: showMobileMenu ? 45 : 0, y: showMobileMenu ? 0 : -6 }}
                  transition={{ duration: 0.2 }}
                  style={{ originX: 0.5, originY: 0.5 }}
                  className="absolute left-0 right-0 h-0.5 bg-white rounded-full top-[11px] block"
                />
                <motion.span
                  animate={{ opacity: showMobileMenu ? 0 : 1, x: showMobileMenu ? 10 : 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 w-4 h-0.5 bg-coffee-400 rounded-full top-[11px] block"
                />
                <motion.span
                  animate={{ rotate: showMobileMenu ? -45 : 0, y: showMobileMenu ? 0 : 6 }}
                  transition={{ duration: 0.2 }}
                  style={{ originX: 0.5, originY: 0.5 }}
                  className="absolute left-0 right-0 h-0.5 bg-white rounded-full top-[11px] block"
                />
              </div>
            </button>
          </div>
        </div>

      {/* Mobile Navigation Menu - Enhanced Full-Screen Overlay */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 h-[100dvh] w-full z-[110] md:hidden bg-[#09090d]/98 backdrop-blur-3xl flex flex-col justify-between p-4 sm:p-6 pt-20 overflow-y-auto"
            >
              {/* Creative Ambient BG Blobs */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] right-[-10%] w-[350px] h-[350px] bg-coffee-500/10 rounded-full blur-[90px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px]" />
                <div className="noise-overlay opacity-15" />
              </div>

              {/* Navigation Links - Centered/Oversized Editorial Style */}
              <div className="flex flex-col gap-3 my-auto relative z-10 py-4 text-left">
                <div className="border-l-2 border-coffee-500 pl-3 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-coffee-400 block">Main Menu</span>
                  <span className="text-white/40 text-[10px] font-medium block">Select a page to explore</span>
                </div>

                <div className="space-y-1.5">
                  {navItems.map((item, i) => {
                    const isActive = location.pathname === item.href;
                    const navDescriptions: Record<string, string> = {
                      '/': 'Welcome to Jackson Multifacet',
                      '/about': 'Who We Are, Our Story & Mission',
                      '/services': 'Digital Products, Branding & Business Solutions',
                      '/portfolio': 'Our Work & Success Stories',
                      '/pricing': 'Simple & Transparent Packages',
                      '/blog': 'Articles, Updates & Industry Insights',
                      '/contact': 'Get in Touch With Our Team',
                    };

                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ delay: 0.03 + i * 0.03 }}
                      >
                        <Link 
                          to={item.href} 
                          onClick={() => setShowMobileMenu(false)}
                          className="group flex flex-col py-1 border-b border-white/[0.015] active:bg-white/[0.02] rounded-lg transition-colors px-1"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-coffee-500/40 text-[9px] font-mono font-bold tracking-widest mt-0.5">0{i + 1}.</span>
                            <span className={`text-[12px] font-bold uppercase tracking-wider font-display transition-all duration-300 ${
                              isActive 
                                ? 'text-coffee-400 translate-x-1' 
                                : 'text-white/70 hover:text-white'
                            }`}>
                              {item.label}
                            </span>
                            {isActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-coffee-400 shadow-[0_0_8px_rgba(172,145,121,0.8)] ml-1.5" />
                            )}
                          </div>
                          <p className="text-[9px] text-white/30 font-medium pl-5 leading-relaxed">
                            {navDescriptions[item.href] || 'View resource page'}
                          </p>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Bento Grid Action shortcuts */}
              <div className="grid grid-cols-2 gap-2 relative z-10 my-3">
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowAIChat(true);
                  }}
                  className="flex flex-col items-start text-left p-3 rounded-xl bg-gradient-to-br from-zinc-900/60 to-black/80 border border-white/5 active:border-coffee-500/30 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-2 w-full">
                    <Bot className="w-4 h-4 text-coffee-400 group-hover:animate-pulse" />
                    <span className="text-[8px] text-white/30 uppercase font-black tracking-widest leading-none">Assistant</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-auto" />
                  </div>
                  <p className="text-xs font-bold text-white mb-0.5">Meet AI Expert</p>
                  <p className="text-[8px] text-white/40 leading-normal line-clamp-2">Query our intelligence console for private solutions.</p>
                </button>

                <Link
                  to="/portal"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex flex-col items-start text-left p-3 rounded-xl bg-gradient-to-br from-coffee-950/20 to-zinc-950/90 border border-coffee-500/20 active:border-coffee-500/50 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-coffee-400" />
                    <span className="text-[8px] text-coffee-400 uppercase font-black tracking-widest leading-none">VIP Access</span>
                  </div>
                  <p className="text-xs font-bold text-white mb-0.5">Client Portal</p>
                  <p className="text-[8px] text-white/40 leading-normal line-clamp-2">Access private documents, chat vaults and contracts.</p>
                </Link>
              </div>

              {/* Footer Panel */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ delay: 0.25 }}
                className="mt-auto pt-4 border-t border-white/5 relative z-10"
              >
                <div className="flex justify-between items-center px-1">
                  <div className="space-y-0.5 text-left">
                    <p className="text-[8px] font-black uppercase tracking-widest text-[#8a7f75]">Secure Private Node</p>
                    <p className="text-[10px] font-mono text-white/50">ops@jacksonmultifacet.com</p>
                  </div>
                  <div className="flex gap-3">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 active:text-white active:bg-white/10 transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 active:text-white active:bg-white/10 transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 active:text-white active:bg-white/10 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Rolling Testimonials */}
      <RollingTestimonials />

      {/* CTA Footer */}
      <footer className="py-16 md:py-20 px-4 md:px-6 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-6">Let's build your <br className="hidden md:block"/>business presence.</h2>
            <p className="text-white/40 mb-10 leading-relaxed italic text-sm md:text-base">
              Our project queue is carefully managed to ensure professional quality. <br className="hidden md:block"/>Strategic alignment is prioritized for all new partnerships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="relative bg-coffee-600 hover:bg-coffee-500 text-white px-8 py-4 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-coffee-600/20 border border-white/20 overflow-hidden group active:scale-95">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <span className="relative z-10">Start Your Project</span>
              </Link>
              <Link to="/portal" className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95">Portal Access</Link>
            </div>
          </div>

          <div className="pt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left border-t border-white/5">
            <div className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-coffee-400" />
                <span className="font-bold text-white font-display uppercase tracking-widest text-sm">Jackson Multifacet</span>
              </div>
              <p className="text-xs text-white/30 leading-relaxed max-w-xs">Providing professional digital solutions and business growth support.</p>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Navigation</h4>
              <nav className="flex flex-col gap-3">
                {navItems.map(item => <Link key={item.label} to={item.href} className="text-[10px] md:text-xs text-white/40 hover:text-coffee-400 transition-colors uppercase tracking-widest font-bold">{item.label}</Link>)}
              </nav>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Get Support</h4>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-xs text-white/40 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-coffee-500" />
                  <span>+234 Operational Support</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/40 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-coffee-500" />
                  <span>ops@jacksonmultifacet.com</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Follow Our Work</h4>
              <div className="flex gap-4">
                {[Instagram, Linkedin, Twitter, Facebook].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-coffee-500/20 hover:border-coffee-500/50 transition-all group">
                    <Icon className="w-4 h-4 text-white/40 group-hover:text-coffee-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-20 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10">© 2026 Jackson Multifacet • Real Value & Stakes Ltd.</p>
            <div className="flex gap-8">
              <button className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors">Terms of Service</button>
              <button className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors">Privacy Policy</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
