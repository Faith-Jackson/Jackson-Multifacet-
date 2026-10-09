import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { 
  ArrowRight, 
  Zap, 
  Target, 
  Palette, 
  BarChart3, 
  Users, 
  ExternalLink,
  Sparkles,
  Globe,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const featuredProjects = [
  {
    title: "Global Marketplace Architecture",
    category: "Digital Product",
    desc: "Scalable e-commerce and multi-vendor systems built for high-concurrency cross-border trade.",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    tags: ["E-Commerce", "API Architecture", "Cloud"]
  },
  {
    title: "Sustainable Brand Ecosystems",
    category: "Branding & Identity",
    desc: "Complete visual identity, style guides, and executive stationery for enterprise credibility.",
    img: "https://images.unsplash.com/photo-1518655061710-5ccf392c275a?auto=format&fit=crop&q=80&w=800",
    tags: ["Brand Identity", "Design System", "Packaging"]
  },
  {
    title: "FinTech Mobile Solutions",
    category: "Mobile & Platforms",
    desc: "Secure customer mobile portals with friction-free payments and instant account dashboards.",
    img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
    tags: ["Mobile Apps", "FinTech", "UI/UX"]
  }
];

const serviceHighlights = [
  {
    title: "Digital Product Development",
    desc: "Custom web applications, corporate websites, e-commerce, and business automation platforms.",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    badge: "Engineering"
  },
  {
    title: "Branding & Creative Design",
    desc: "Memorable logos, company profiles, pitch decks, and cohesive corporate visual guidelines.",
    img: "https://images.unsplash.com/photo-1572044162444-ad60f128bde2?auto=format&fit=crop&q=80&w=800",
    badge: "Identity"
  },
  {
    title: "Marketing & Growth",
    desc: "Campaign assets, conversion landing pages, targeted social media creatives, and visibility strategies.",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    badge: "Visibility"
  },
  {
    title: "Business Startup Support",
    desc: "Business documentation, pitch decks, company portfolios, and professional setup guidance.",
    img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800",
    badge: "Foundations"
  }
];

const blogHighlights = [
  {
    title: "Architecting Scalable Cloud Systems for 2026.",
    tag: "Engineering",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    desc: "A deep dive into our methodology for building modern digital products that scale smoothly."
  },
  {
    title: "Strategic Interface Design for High-Growth Startups.",
    tag: "Design Strategy",
    img: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800",
    desc: "How intentional aesthetic choices build customer trust and accelerate business conversions."
  }
];

export default function HomeView() {
  return (
    <div className="space-y-16 sm:space-y-24 md:space-y-32 pb-20 md:pb-32">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 md:pt-20 pb-12 sm:pb-20 md:pb-32 px-4 sm:px-6 overflow-hidden min-h-[75vh] md:min-h-[85vh] flex items-center">
        {/* Pulsing Ambient Glows */}
        <div className="absolute top-[5%] left-1/4 w-[300px] h-[300px] md:w-[700px] md:h-[700px] bg-coffee-500/25 blur-[90px] md:blur-[160px] rounded-full pointer-events-none -z-10 animate-blob" />
        <div className="absolute bottom-[5%] right-1/4 w-[280px] h-[280px] md:w-[600px] md:h-[600px] bg-purple-500/20 blur-[80px] md:blur-[140px] rounded-full pointer-events-none -z-10 animate-blob animation-delay-2000" />
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 w-full">
          {/* Hero Copy */}
          <div className="flex-1 text-center lg:text-left z-10 w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-coffee-500/10 border border-coffee-500/20 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-coffee-400 mb-6 md:mb-8"
            >
              <Zap className="w-3 h-3 fill-current animate-pulse text-coffee-400" /> Growth & Digital Excellence
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-white mb-5 md:mb-8 font-display leading-[1.1]"
            >
              Building the Future of <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-coffee-400 via-coffee-300 to-purple-400">
                Professional Brands
              </span>.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="text-sm sm:text-base md:text-lg text-white/50 max-w-2xl mx-auto lg:mx-0 mb-8 sm:mb-10 md:mb-12 leading-relaxed"
            >
              Jackson Multifacet provides high-impact digital products, strategic branding, 
              and business growth systems designed to help organizations build credibility and scale confidently.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 justify-center lg:justify-start w-full sm:w-auto"
            >
              <Link 
                to="/contact" 
                className="w-full sm:w-auto relative bg-coffee-600 hover:bg-coffee-500 text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg transition-all shadow-xl shadow-coffee-600/30 flex items-center justify-center gap-3 active:scale-95 group border border-white/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                  Start Your Project <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link 
                to="/services" 
                className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg hover:bg-white/10 transition-all backdrop-blur-sm flex justify-center items-center active:scale-95"
              >
                Our Solutions
              </Link>
            </motion.div>
          </div>

          {/* Hero Hero Image - Guaranteed full visibility across Mobile & Desktop */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
             className="flex-1 w-full relative block mt-4 lg:mt-0 z-10"
          >
             <div className="absolute inset-0 bg-coffee-500/20 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none scale-125 sm:scale-150 animate-blob" />
             
             <div className="relative rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-coffee-500/20 bg-zinc-900">
               <img 
                 referrerPolicy="no-referrer"
                 src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200" 
                 alt="Jackson Multifacet Innovation Team" 
                 loading="eager"
                 className="w-full h-[240px] sm:h-[320px] md:h-[400px] lg:h-[450px] object-cover hover:scale-105 transition-transform duration-1000 block" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
               
               {/* Mobile-Friendly Floating Badge */}
               <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 bg-black/60 backdrop-blur-md px-3.5 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl border border-white/15 flex flex-col gap-0.5 sm:gap-1 z-10 shadow-xl">
                 <div className="flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-coffee-400 animate-pulse" />
                   <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-coffee-400 font-bold">Innovation & Strategy</span>
                 </div>
                 <span className="text-white text-xs sm:text-sm font-bold font-display">Creative Engineering Team</span>
               </div>

               {/* Right Corner Accent */}
               <div className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-white/10 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/15 text-[9px] sm:text-[10px] font-semibold text-white/90">
                 Nigeria • Africa • Global
               </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Showcase with Pictures */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee-400 mb-2 block">Our Work</span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white font-display">Featured Projects</h2>
            </div>
            <Link 
              to="/portfolio" 
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-coffee-400 hover:text-white transition-colors group self-start sm:self-auto"
            >
              Explore Full Portfolio <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProjects.map((project, idx) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-coffee-500/40 transition-all duration-300 group flex flex-col shadow-xl"
              >
                {/* Project Image Container */}
                <div className="relative h-48 sm:h-56 md:h-60 overflow-hidden bg-zinc-900">
                  <img 
                    referrerPolicy="no-referrer"
                    src={project.img} 
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 block"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[9px] font-bold uppercase tracking-widest text-coffee-400">
                    {project.category}
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-coffee-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-white/50 text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {project.desc}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/5">
                    {project.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-white/5 rounded-md text-[10px] text-white/60 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Solutions with Picture Cards */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee-400 mb-2 block">Our Capabilities</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white font-display mb-4">
              Comprehensive Business Solutions
            </h2>
            <p className="text-sm sm:text-base text-white/50 leading-relaxed">
              We combine modern technology, creative branding, and hands-on operational support to help businesses thrive.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {serviceHighlights.map((srv, idx) => (
              <motion.div
                key={srv.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-coffee-500/30 transition-all group flex flex-col shadow-xl"
              >
                {/* Visual Picture Header */}
                <div className="relative h-40 sm:h-44 overflow-hidden bg-zinc-900">
                  <img 
                    referrerPolicy="no-referrer"
                    src={srv.img} 
                    alt={srv.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 block"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[9px] font-black uppercase tracking-widest text-coffee-400 bg-black/60 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-sm">
                    {srv.badge}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-coffee-300 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                  <Link 
                    to="/services" 
                    className="mt-4 pt-3 border-t border-white/5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-coffee-400/90 group-hover:text-white transition-colors"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Company Spotlight: About & Roots */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center bg-white/[0.03] border border-white/10 p-6 sm:p-10 md:p-14 rounded-2xl sm:rounded-3xl lg:rounded-[3rem] relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-coffee-500/15 blur-3xl rounded-full pointer-events-none" />

            <div className="space-y-6 z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee-400 block">About Jackson Multifacet</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-display leading-[1.2]">
                Simply Extraordinary Solutions for Modern Enterprises.
              </h2>
              <p className="text-sm sm:text-base text-white/60 leading-relaxed">
                Founded on the 3rd of March, 2023, Jackson Multifacet operates under Real Value & Stakes Limited. Starting from Nigeria, expanding across Africa, and positioning for global impact, we empower brands to operate smarter and compete with distinction.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="text-coffee-400 font-display font-bold text-xl sm:text-2xl">March 2023</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/40 mt-1">Founded & Operating</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="text-purple-400 font-display font-bold text-xl sm:text-2xl">Multifaceted</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/40 mt-1">Tech • Brand • Growth</div>
                </div>
              </div>

              <div className="pt-2">
                <Link 
                  to="/about" 
                  className="inline-flex items-center gap-2 bg-coffee-600/90 hover:bg-coffee-500 text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all"
                >
                  Our Full Story <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Workplace Picture - Crisp & Mobile Responsive */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900 z-10">
              <img 
                referrerPolicy="no-referrer"
                src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=800" 
                alt="Modern African Workspace" 
                loading="lazy"
                className="w-full h-[240px] sm:h-[300px] md:h-[360px] object-cover hover:scale-105 transition-transform duration-700 block"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
                <span className="text-[9px] uppercase tracking-widest text-coffee-400 font-bold block">Innovation Hub</span>
                <span className="text-white text-xs sm:text-sm font-bold">Collaborative Workspace</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Pillars (Icon Cards) */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee-400 mb-2 block">Our Pillars</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-display">How We Help You Grow</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <FeatureCard 
              icon={Target} 
              title="Digital Presence" 
              desc="Building professional websites and platforms that communicate credibility."
              color="coffee"
            />
            <FeatureCard 
              icon={Palette} 
              title="Brand Development" 
              desc="Creating memorable identities that resonate with your target market."
              color="purple"
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Growth Strategy" 
              desc="Practical marketing and promotional solutions to increase visibility."
              color="emerald"
            />
            <FeatureCard 
              icon={Users} 
              title="Business Support" 
              desc="Guidance and tools to streamline your daily business operations."
              color="rose"
            />
          </div>
        </div>
      </section>

      {/* Latest Articles / Knowledge Base with Pictures */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee-400 mb-2 block">Insights</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white font-display">From Our Knowledge Base</h2>
            </div>
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-coffee-400 hover:text-white transition-colors group self-start sm:self-auto"
            >
              Read All Articles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {blogHighlights.map((post, idx) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-coffee-500/30 transition-all group flex flex-col sm:flex-row shadow-xl"
              >
                <div className="sm:w-2/5 h-44 sm:h-auto relative bg-zinc-900 shrink-0">
                  <img 
                    referrerPolicy="no-referrer"
                    src={post.img} 
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 block"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                </div>
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-coffee-400 mb-2 block">{post.tag}</span>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-coffee-300 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-white/50 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed">
                      {post.desc}
                    </p>
                  </div>
                  <Link 
                    to="/blog" 
                    className="text-[11px] font-bold uppercase tracking-wider text-white/70 group-hover:text-white inline-flex items-center gap-1.5 pt-2"
                  >
                    Read More <ArrowRight className="w-3.5 h-3.5 text-coffee-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Quote Section */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 md:py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
           <h2 className="text-xl sm:text-3xl md:text-5xl font-bold text-white font-display leading-[1.25]">
              "We provide the <span className="text-coffee-400">tools</span> and <span className="text-purple-400">creativity</span> businesses need to build a lasting professional legacy."
           </h2>
           <div>
             <Link 
               to="/contact" 
               className="inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-coffee-400 hover:text-white transition-colors group bg-white/5 border border-white/10 px-6 py-3 rounded-full hover:border-coffee-500/50"
             >
                Start Your Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </Link>
           </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable dynamic mouse tracking on small screens for performance and smoothness
    if (!cardRef.current || window.innerWidth < 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const colors: Record<string, { text: string, border: string, glow: string, bg: string }> = {
    coffee: { 
      text: 'text-coffee-400', 
      border: 'group-hover:border-coffee-500/50', 
      glow: 'rgba(172, 145, 121, 0.3)',
      bg: 'bg-coffee-500/20'
    },
    purple: { 
      text: 'text-purple-400', 
      border: 'group-hover:border-purple-500/50', 
      glow: 'rgba(168, 85, 247, 0.3)',
      bg: 'bg-purple-500/20'
    },
    emerald: { 
      text: 'text-emerald-400', 
      border: 'group-hover:border-emerald-500/50', 
      glow: 'rgba(16, 185, 129, 0.3)',
      bg: 'bg-emerald-500/20'
    },
    rose: { 
      text: 'text-rose-400', 
      border: 'group-hover:border-rose-500/50', 
      glow: 'rgba(244, 63, 94, 0.3)',
      bg: 'bg-rose-500/20'
    }
  };

  const theme = colors[color] || colors.coffee;

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-white/5 border border-white/10 p-6 sm:p-7 rounded-2xl sm:rounded-3xl hover:bg-white/[0.08] transition-all duration-300 group relative overflow-hidden ${theme.border}`}
    >
      {/* Dynamic Mouse Glow - Hidden on mobile */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${smoothX}px ${smoothY}px, ${theme.glow}, transparent 40%)`
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center ${theme.text} mb-5 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300 relative z-10`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      
      <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-white transition-colors relative z-10">{title}</h3>
      <p className="text-white/45 text-xs sm:text-sm leading-relaxed group-hover:text-white/60 transition-colors relative z-10">{desc}</p>
      
      {/* Decorative Corner Glow */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 ${theme.bg} blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
    </div>
  );
}
