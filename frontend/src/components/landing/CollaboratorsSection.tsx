import React from 'react';
import { motion } from 'framer-motion';
import DecorativeShapes from './DecorativeShapes';

const mentors = [
  { image: "/colab/collaborations/ANGEL.png", name: "Angel" },
  { image: "/colab/collaborations/ART.png", name: "Art" },
  { image: "/colab/collaborations/BAJAJ.png", name: "Bajaj" },
  { image: "/colab/collaborations/DELOITTE.png", name: "Deloitte" },
  { image: "/colab/collaborations/IBM.png", name: "IBM" },
  { image: "/colab/collaborations/INFOSYS.png", name: "Infosys" },
  { image: "/colab/collaborations/ISHA.png", name: "Isha" },
  { image: "/colab/collaborations/LIC.jpg", name: "LIC" },
  { image: "/colab/collaborations/OPTUM.png", name: "Optum" },
  { image: "/colab/collaborations/TCS.png", name: "TCS" },
];

const institutions = [
  { image: "/colab/collaborations/IIMB.png", name: "IIMB" },
  { image: "/colab/collaborations/ISB.png", name: "ISB" },
  { image: "/colab/collaborations/STANDFORD.png", name: "Stanford" },
  { image: "/colab/collaborations/WHARTON.jpg", name: "Wharton" },
  { image: "/colab/collaborations/anurag.png", name: "Anurag" },
  { image: "/colab/collaborations/bitsp.jpg", name: "BITS Pilani" },
  { image: "/colab/collaborations/cbit.jpg", name: "CBIT" },
  { image: "/colab/collaborations/cmr.jpg", name: "CMR" },
  { image: "/colab/collaborations/griet.png", name: "GRIET" },
  { image: "/colab/collaborations/iimk.jpg", name: "IIMK" },
  { image: "/colab/collaborations/iitb.png", name: "IITB" },
  { image: "/colab/collaborations/iitd.jpg", name: "IITD" },
  { image: "/colab/collaborations/iith.png", name: "IITH" },
  { image: "/colab/collaborations/iitk.jpg", name: "IITK" },
  { image: "/colab/collaborations/iitm.png", name: "IITM" },
  { image: "/colab/collaborations/mlru.jpg", name: "MLRU" },
  { image: "/colab/collaborations/srm.png", name: "SRM" },
  { image: "/colab/collaborations/vishnu.jpg", name: "Vishnu" },
  { image: "/colab/collaborations/vjim.jpg", name: "VJIM" },
  { image: "/colab/collaborations/woxsen.png", name: "Woxsen" },
];

const CollaboratorsSection: React.FC = () => {
  // Duplicate arrays to create seamless infinite scroll
  const duplicatedMentors = [...mentors, ...mentors];
  const duplicatedInstitutions = [...institutions, ...institutions];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-[#f0fdf4]/30 relative overflow-hidden">
      <DecorativeShapes variant={4} />
      
      {/* Mentors Header */}
      <div className="max-w-[1400px] mx-auto px-4 relative z-10 mb-12">
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
            Featured <span className="text-[#1a5d47] relative inline-block whitespace-nowrap">
              Mentors
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

      {/* Infinite Logo Marquee - Mentors */}
      <div className="relative w-full overflow-hidden py-12 bg-white/40 backdrop-blur-md border-y border-[#1a5d47]/5 shadow-[0_0_50px_-12px_rgba(26,93,71,0.05)] mb-16">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 40,
            repeat: Infinity,
          }}
          className="flex gap-6 md:gap-8 flex-nowrap w-max px-4"
        >
          {duplicatedMentors.map((partner, index) => (
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
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a5d47]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={partner.image}
                alt={partner.name}
                className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-all duration-500 relative z-10 mix-blend-multiply"
                onError={(e) => { 
                  (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${partner.name}&background=ffffff&color=1a5d47&bold=true`; 
                }}
              />
            </motion.div>
          ))}
        </motion.div>
        <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-none z-20" />
      </div>

      {/* Institutions Header */}
      <div className="max-w-[1400px] mx-auto px-4 relative z-10 mb-12 mt-12">
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
            Featured <span className="text-[#1a5d47] relative inline-block whitespace-nowrap">
              Institutions
              <svg className="absolute -bottom-2 left-0 w-full h-[6px] text-[#1a5d47]/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
            </span>
          </h2>
          <p className="text-[#4a5568] text-lg max-w-2xl mx-auto font-medium tracking-wide">
            Our esteemed academic partners
          </p>
        </motion.div>
      </div>

      {/* Infinite Logo Marquee - Institutions */}
      <div className="relative w-full overflow-hidden py-12 bg-white/40 backdrop-blur-md border-y border-[#1a5d47]/5 shadow-[0_0_50px_-12px_rgba(26,93,71,0.05)]">
        <motion.div
          animate={{ x: ["-50%", "0%"] }}
          transition={{
            ease: "linear",
            duration: 60,
            repeat: Infinity,
          }}
          className="flex gap-6 md:gap-8 flex-nowrap w-max px-4"
        >
          {duplicatedInstitutions.map((partner, index) => (
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
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a5d47]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={partner.image}
                alt={partner.name}
                className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-all duration-500 relative z-10 mix-blend-multiply"
                onError={(e) => { 
                  (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${partner.name}&background=ffffff&color=1a5d47&bold=true`; 
                }}
              />
            </motion.div>
          ))}
        </motion.div>
        <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-none z-20" />
      </div>

    </section>
  );
};

export default CollaboratorsSection;
