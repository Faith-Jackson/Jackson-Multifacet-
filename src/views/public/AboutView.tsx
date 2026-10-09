import { motion } from 'motion/react';
import { Target, Rocket, Zap, Globe } from 'lucide-react';

export default function AboutView() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee-400 mb-4 block">About Jackson Multifacet</span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white font-display mb-6">Simply Extraordinary</h2>
          <div className="h-1.5 w-24 bg-coffee-500 mx-auto rounded-full mb-8" />
          <p className="text-lg md:text-xl text-white/40 max-w-3xl mx-auto leading-relaxed">
            Jackson Multifacet is a modern digital solutions and business support company committed to helping businesses, startups, professionals, and organizations build, grow, and thrive in an increasingly digital world.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 mb-20 md:mb-32 items-center">
          <div className="space-y-6">
            <p className="text-base md:text-lg text-white/60 leading-relaxed">
              Founded on the 3rd of March, 2023, Jackson Multifacet operates under Real Value & Stakes Limited, a registered company in the business and human resource industry. Through innovation, creativity, technology, and strategic support, we provide solutions that empower brands to operate smarter, scale faster, and compete confidently in modern markets.
            </p>
            <p className="text-base md:text-lg text-white/60 leading-relaxed">
              At Jackson Multifacet, we understand that businesses today need more than just isolated services. They need a reliable ecosystem that combines technology, branding, growth strategy, operational support, and talent solutions in one place. That understanding is what drives our multifaceted approach.
            </p>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/5 border border-white/10 p-6 sm:p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-black/50"
          >
            <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-1000 pointer-events-none">
              <img referrerPolicy="no-referrer" src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover md:mix-blend-overlay" alt="Modern African Workspace" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/40 to-transparent" />
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-coffee-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-coffee-500/20 transition-all duration-700" />
            <p className="text-white/60 leading-relaxed mb-6 italic text-base md:text-lg relative z-10">
              Starting from Nigeria, expanding across Africa, and positioning for global impact, Jackson Multifacet is building a future where businesses of all sizes can access innovative, professional, and scalable digital solutions without unnecessary complexity.
            </p>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-1 bg-coffee-500 rounded-full" />
              <span className="text-xs font-bold uppercase tracking-widest text-coffee-400">Our Reach</span>
            </div>
          </motion.div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-coffee-500/10 to-transparent border border-white/10 p-6 sm:p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] space-y-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none group-hover:opacity-50 transition-opacity duration-700">
               <img referrerPolicy="no-referrer" src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover md:mix-blend-overlay" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </div>
            <div className="w-14 h-14 bg-coffee-500 rounded-2xl flex items-center justify-center shadow-lg shadow-coffee-500/40 relative z-10">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white font-display relative z-10">Our Mission</h3>
            <p className="text-white/40 leading-relaxed text-base md:text-lg relative z-10">
              To empower businesses and professionals across Africa with multifaceted digital solutions and growth assets, enabling them to build credibility and compete effectively.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500/10 to-transparent border border-white/10 p-6 sm:p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] space-y-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none group-hover:opacity-50 transition-opacity duration-700">
               <img referrerPolicy="no-referrer" src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover md:mix-blend-overlay" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </div>
            <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] relative z-10">
              <Rocket className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white font-display relative z-10">Our Vision</h3>
            <p className="text-white/40 leading-relaxed text-base md:text-lg relative z-10">
              To be the leading indigenous ecosystem for digital product development and business growth in Africa, recognized for excellence, innovation, and integrity.
            </p>
          </motion.div>
        </div>


        {/* Global Strategy */}
        <div className="space-y-12">
           <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-1 bg-white/10 rounded-full" />
              <h3 className="text-2xl font-bold text-white font-display uppercase tracking-widest">Core Values</h3>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                { title: 'Innovation', icon: Zap, color: 'text-coffee-400' },
                { title: 'Integrity', icon: Target, color: 'text-purple-400' },
                { title: 'Excellence', icon: Globe, color: 'text-emerald-400' },
                { title: 'Scalability', icon: Rocket, color: 'text-rose-400' },
              ].map((val, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-[2rem] text-center space-y-4 hover:bg-white/10 transition-all group">
                   <div className={`w-12 h-12 mx-auto rounded-xl bg-white/5 flex items-center justify-center ${val.color} group-hover:scale-110 transition-transform`}>
                      <val.icon className="w-6 h-6" />
                   </div>
                   <h4 className="font-bold text-white uppercase text-sm tracking-widest">{val.title}</h4>
                </div>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
}
