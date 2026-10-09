import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';
import { catalogIntro, catalogCategories } from '../../catalogData';

export default function ServicesView() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-12 md:mb-20 gap-12">
          <div className="max-w-2xl">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee-400 mb-4 block">Comprehensive Solutions</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-display mb-6 md:mb-8">Simply Extraordinary Solutions for <br className="hidden lg:block"/>Modern Businesses.</h2>
            <div className="space-y-6">
              <p className="text-lg md:text-xl font-medium text-coffee-400/90">{catalogIntro.subtitle}</p>
              <p className="text-[10px] font-bold leading-loose text-white/50 uppercase tracking-widest bg-white/5 p-4 rounded-2xl border border-white/5">
                {catalogIntro.servicesList}
              </p>
              {catalogIntro.paragraphs.map((p, i) => (
                <p key={i} className="text-white/70 leading-relaxed text-xs md:text-sm max-w-xl">{p}</p>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 p-6 bg-white/5 border border-white/10 rounded-3xl shrink-0 self-start lg:self-end">
            <BookOpen className="w-6 h-6 text-coffee-400" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/40 block mb-1">Our Approach</span>
              <p className="text-white/70 text-xs md:text-sm max-w-[200px] leading-relaxed">We operate at the intersection of technology, creativity, strategy, and operational support.</p>
            </div>
          </div>
        </div>

        <div className="space-y-8 md:space-y-12">
          <h3 className="text-xl md:text-2xl font-bold text-white font-display mb-6 md:mb-8">OUR CORE SERVICES</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {catalogCategories.map((category, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                key={idx} 
                className="bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 hover:border-coffee-500/30 transition-all group flex flex-col h-full relative overflow-hidden"
              >
                <div className="absolute inset-0 z-0">
                  <img referrerPolicy="no-referrer" src={category.img} className="w-full h-full object-cover opacity-40 md:opacity-20 group-hover:opacity-50 transition-opacity duration-700" alt="" aria-hidden="true" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/20 to-transparent" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-coffee-500/10 flex items-center justify-center text-coffee-400 font-bold text-2xl shrink-0 group-hover:scale-110 group-hover:bg-coffee-500/20 transition-all">
                    {idx + 1}
                  </div>
                  <h4 className="text-2xl md:text-3xl font-bold text-white font-display leading-[1.2]">{category.title}</h4>
                </div>
                <div className="space-y-8 flex-1 flex flex-col relative z-10">
                  <div className="space-y-4">
                    {category.desc.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="text-white/60 text-sm leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                  <div className="mt-auto pt-8 border-t border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-coffee-400/80 mb-4">Services Include:</p>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((item, i) => (
                        <span key={i} className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white/80 shrink-0 hover:bg-white/10 hover:text-white transition-colors cursor-default">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
