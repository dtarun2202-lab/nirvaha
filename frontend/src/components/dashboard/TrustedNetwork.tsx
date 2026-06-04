import React from 'react';
import { motion } from 'framer-motion';

const ADS_DATA = [
  {
    id: 1,
    image: "/about/ADS/vedic chants.png",
    link: "https://www.jiosaavn.com/album/powerful-vedic-chants/A3owXFDaI4Q_",
    alt: "Vedic Chants",
    description: "Experience the ancient resonance of powerful chants for deep healing.",
    delay: 0
  },
  {
    id: 2,
    image: "/about/ADS/med spotify.png",
    link: "https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u",
    alt: "Spotify Meditation",
    description: "Curated frequencies and guided journeys for your daily practice.",
    delay: 1.5
  }
];

export const TrustedNetwork = () => {
  return (
    <section className="relative w-full bg-gradient-to-br from-[#1A2F24] to-[#0A1410] py-24 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7A9384] rounded-full mix-blend-screen filter blur-[128px] opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#4A6155] rounded-full mix-blend-screen filter blur-[128px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-['Cinzel'] text-[#FAFAF8] mb-4 tracking-wide">
            Trusted Network
          </h2>
          <div className="w-16 h-1 bg-[#7A9384] mx-auto rounded-full mb-6 opacity-50"></div>
          <p className="text-[#A8C7B4] max-w-2xl mx-auto text-lg font-light">
            Discover premium offerings and experiences from our trusted partners.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
          {ADS_DATA.map((ad) => (
            <motion.div
              key={ad.id}
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: ad.delay,
              }}
              className="w-full max-w-md"
            >
              <a 
                href={ad.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative group rounded-[2rem] overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-4 transition-all duration-500 hover:bg-white/10 hover:border-white/20 shadow-2xl hover:shadow-[0_0_40px_rgba(122,147,132,0.3)]"
              >
                {/* Image Container */}
                <div className="relative w-full rounded-2xl overflow-hidden aspect-[1.4/1]">
                  <img 
                    src={ad.image} 
                    alt={ad.alt} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                </div>

                <div className="mt-6 mb-2 flex items-center justify-between px-4 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[#FAFAF8] font-['Cinzel'] text-xl tracking-wide mb-1">
                      {ad.alt}
                    </span>
                    <span className="text-[#A8C7B4] font-sans text-sm font-light leading-relaxed">
                      {ad.description}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#7A9384] transition-colors duration-300">
                    <svg className="w-5 h-5 text-white transform group-hover:-rotate-45 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
