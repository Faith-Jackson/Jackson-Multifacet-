import { motion } from 'motion/react';

export default function BlogView() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee-400 mb-4 block">Knowledge Base</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-display mb-6">Company <br className="hidden md:block"/>Updates.</h2>
          <div className="h-1.5 w-24 bg-coffee-500 mx-auto rounded-full mb-8" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: "Architecting Scalable Cloud Systems for 2026.", tag: "Engineering", img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800" },
            { title: "Strategic Interface Design for High-Growth Startups.", tag: "Design Strategy", img: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800" }
          ].map((post, idx) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              key={idx} 
              className="bg-white/5 border border-white/10 rounded-[2rem] sm:rounded-[3rem] flex flex-col group hover:bg-white/10 transition-all cursor-pointer overflow-hidden"
            >
              <div className="h-48 sm:h-64 overflow-hidden relative border-b border-white/5">
                 <img referrerPolicy="no-referrer" src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-8 sm:p-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-coffee-400 mb-4 block">{post.tag}</span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-coffee-400 transition-colors">{post.title}</h3>
                <p className="text-white/40 leading-relaxed mb-6 text-sm">A deep dive into our methodology for building modern digital products that scale seamlessly.</p>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/60">
                  Read Transmission <span className="text-coffee-500 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
