import React from 'react';
import { motion } from 'framer-motion';
import DecorativeShapes from './DecorativeShapes';

const partners = [
  { image: "/feat/f1.jpeg", name: "Global Wellness" },
  { image: "/colab/c1.jpeg", name: "Mindful Space" },
  { image: "/supp/s1.jpg", name: "Innovation Hub" },
  { image: "/colab/c2.jpeg", name: "Serenity Studio" },
  { image: "/feat/f2.jpeg", name: "Core Health" },
  { image: "/colab/c3.jpeg", name: "Zen Masters" },
  { image: "/supp/s2.png", name: "Future Tech" },
  { image: "/colab/c4.jpeg", name: "Peace Path" },
  { image: "/feat/f3.png", name: "Wellness Wave" },
  { image: "/colab/c5.jpeg", name: "Spirit Soul" },
  { image: "/feat/f4.png", name: "Impact Lab" },
  { image: "/colab/c6.jpeg", name: "Inner Light" },
  { image: "/feat/f1.jpeg", name: "Strategic Ally" },
  { image: "/colab/c1.jpeg", name: "Healing Touch" },
];

const CollaboratorsSection: React.FC = () => {
  // Duplicate partners array to create seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-[#f0fdf4]/30 relative overflow-hidden">
      <DecorativeShapes variant={4} />
      
      <div className="max-w-[1400px] mx-auto px-4 relative z-10 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F131A] tracking-tight mb-4"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Collaborators & <span className="text-[#1a5d47] relative inline-block whitespace-nowrap">
              Partners
              <svg className="absolute -bottom-2 left-0 w-full h-[6px] text-[#1a5d47]/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
            </span>
          </h2>
          <p className="text-[#4a5568] text-lg max-w-2xl mx-auto font-medium tracking-wide">
            Trusted by Leading Organizations & Startup Ecosystems
          </p>
        </motion.div>
      </div>

      {/* Infinite Logo Marquee */}
      <div className="relative w-full overflow-hidden py-12 bg-white/40 backdrop-blur-md border-y border-[#1a5d47]/5 shadow-[0_0_50px_-12px_rgba(26,93,71,0.05)]">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 40,
            repeat: Infinity,
          }}
          className="flex gap-6 md:gap-8 flex-nowrap w-max px-4"
        >
          {duplicatedPartners.map((partner, index) => (
            <motion.div
              key={index}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                boxShadow: "0 20px 40px -10px rgba(26, 93, 71, 0.15)",
                borderColor: "rgba(26, 93, 71, 0.3)"
              }}
              className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl w-[200px] h-[120px] md:w-[240px] md:h-[130px] flex items-center justify-center p-6 transition-all duration-300 shadow-sm relative overflow-hidden group shrink-0"
            >
              {/* Subtle gradient hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a5d47]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <img
                src={partner.image}
                alt={partner.name}
                className="w-full h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 relative z-10 mix-blend-multiply"
                onError={(e) => { 
                  (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${partner.name}&background=ffffff&color=1a5d47&bold=true`; 
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Fade Out Edges for Marquee */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-none z-20" />
      </div>
    </section>
  );
};

export default CollaboratorsSection;
