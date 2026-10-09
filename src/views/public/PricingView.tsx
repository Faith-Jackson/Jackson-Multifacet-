import { pricingCategories, additionalServices } from '../../pricingData';

export default function PricingView() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee-400 mb-4 block">Service Packages</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-display mb-6">Clear & Accessible <br className="hidden md:block"/>Project Pricing.</h2>
          <div className="h-1.5 w-24 bg-coffee-500 mx-auto rounded-full mb-8" />
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed">
            Our pricing is designed to provide maximum value at various stages of business growth. Contact us for a custom quote tailored to your specific needs.
          </p>
        </div>
        
        <div className="space-y-20 md:space-y-32">
          {pricingCategories.map((category, catIdx) => (
            <div key={catIdx}>
              <div className="mb-8 md:mb-12 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-white font-display uppercase tracking-wider">{category.title}</h3>
                {category.subtitle && <p className="text-sm text-coffee-400 mt-2">{category.subtitle}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch justify-center">
                {category.packages.map((pkg, idx) => {
                  const isPopular = category.packages.length > 1 && idx === 1;
                  return (
                    <div key={pkg.name} className={`bg-white/5 border ${isPopular ? 'border-coffee-500/50 scale-100 lg:scale-105 shadow-[0_0_30px_rgba(172,145,121,0.15)] z-10' : 'border-white/10'} p-8 sm:p-10 rounded-[2.5rem] md:rounded-[3rem] relative flex flex-col`}>
                      {isPopular && <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-coffee-500 text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full">Recommended</span>}
                      <h4 className="text-xl font-bold text-white mb-2">{pkg.name}</h4>
                      <div className="text-2xl font-display font-bold text-white mb-8 border-b border-white/10 pb-6">
                        {pkg.price}
                      </div>
                      <ul className="space-y-4 mb-8 flex-1">
                        {pkg.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-3 text-sm text-white/60">
                            <div className="w-1.5 h-1.5 rounded-full bg-coffee-500/50 mt-1.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button className={`w-full text-center py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${isPopular ? 'bg-coffee-600 hover:bg-coffee-500 text-white shadow-lg shadow-coffee-600/20 border border-white/5' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}>
                        Request Package
                      </button>
                    </div>
                  );
                })}
              </div>
              {category.note && (
                <p className="text-white/40 text-sm text-center mt-8 italic">{category.note}</p>
              )}
            </div>
          ))}

          {/* Additional Services */}
          <div>
             <div className="mb-12 text-center">
                <h3 className="text-2xl font-bold text-white font-display uppercase tracking-wider">Additional Services</h3>
              </div>
              <div className="flex flex-wrap gap-4 justify-center max-w-4xl mx-auto">
                {additionalServices.map((service, idx) => (
                  <span key={idx} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/70">
                    {service}
                  </span>
                ))}
              </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
