import { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, Globe, Zap, Send } from 'lucide-react';
import { useToast } from '../../components/Toast';

export default function ContactView() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const { error } = useToast();

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

  return (
    <section className="py-16 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee-400 mb-4 block">Get In Touch</span>
            <h2 className="text-4xl md:text-6xl font-bold text-white font-display mb-8 md:mb-12">Send an <br className="hidden md:block"/>Inquiry.</h2>
            <div className="space-y-8 md:space-y-12">
               <div className="flex gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0">
                     <Phone className="w-5 h-5 md:w-6 md:h-6 text-coffee-400" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Phone Support</h4>
                    <p className="text-lg md:text-xl font-bold text-white">+234 Operational Support</p>
                  </div>
               </div>
               <div className="flex gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0">
                     <Mail className="w-5 h-5 md:w-6 md:h-6 text-coffee-400" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Email Address</h4>
                    <p className="text-lg md:text-xl font-bold text-white">ops@jacksonmultifacet.com</p>
                  </div>
               </div>
               <div className="flex gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0">
                     <Globe className="w-5 h-5 md:w-6 md:h-6 text-coffee-400" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Offices</h4>
                    <p className="text-lg md:text-xl font-bold text-white">Lagos • Abuja • International</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-coffee-500/5 blur-[100px] pointer-events-none" />
            
            {formStatus === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                 <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center animate-bounce">
                    <Zap className="w-10 h-10 text-emerald-500" />
                 </div>
                 <h3 className="text-3xl font-bold text-white font-display">Message Received</h3>
                 <p className="text-white/40 max-w-xs">Thank you for reaching out. A client representative will contact you shortly to discuss your requirements.</p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Name</label>
                    <input name="name" required type="text" placeholder="Full Name" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-coffee-500/50 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Email</label>
                    <input name="email" required type="email" placeholder="Email Address" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-coffee-500/50 transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Describe Your Needs</label>
                  <textarea name="message" required rows={6} placeholder="How can we help your business today?" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-coffee-500/50 transition-colors resize-none"></textarea>
                </div>
                <button 
                  disabled={formStatus === 'submitting'}
                  className="w-full bg-coffee-600 hover:bg-coffee-500 text-white font-bold py-4 rounded-full transition-all shadow-lg shadow-coffee-600/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 border border-white/5 text-sm uppercase tracking-widest"
                >
                  {formStatus === 'submitting' ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
