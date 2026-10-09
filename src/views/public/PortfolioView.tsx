import { motion } from 'motion/react';

export default function PortfolioView() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee-400 mb-4 block">Our Work</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white font-display mb-6">Recent <br className="hidden md:block"/>Projects.</h2>
          <div className="h-1.5 w-24 bg-coffee-500 mx-auto rounded-full mb-8" />
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed">
            Explore our latest creative designs and business systems. We help companies establish professional digital presences.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Global Marketplace Architecture", label: "Project 01", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" },
            { title: "Sustainable Brand Ecosystems", label: "Project 02", img: "https://images.unsplash.com/photo-1518655061710-5ccf392c275a?auto=format&fit=crop&q=80&w=800" },
            { title: "FinTech Mobile Solutions", label: "Project 03", img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800" }
          ].map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              key={item.label} 
              className="min-h-[300px] md:h-96 relative rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 flex flex-col justify-end group overflow-hidden border border-white/10 active:scale-[0.98] transition-transform"
            >
              <div className="absolute inset-0 z-0">
                <img referrerPolicy="no-referrer" src={item.img} alt={item.title} className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-1000 opacity-80 md:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/60 md:via-[#050507]/40 to-transparent" />
              </div>
              <div className="relative z-10 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-xs font-bold uppercase tracking-widest text-coffee-400 mb-2 block">{item.label}</span>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-coffee-100 transition-colors">{item.title}</h3>
                <p className="text-sm text-white/50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100">Developing initial concepts and strategic deployment plans.</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
