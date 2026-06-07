import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BACKEND_CONFIG from "../../config/backend";

const CommunityHero = () => {
  const navigate = useNavigate();

  const [phraseIndex, setPhraseIndex] = useState(0);
  const phrases = ["PEACE", "SOLUTION", "REASON"];

  // Dynamic CMS States
  const [heroData, setHeroData] = useState({
    title: "FIND YOUR",
    subtitle: "Experience the convergence of ancient wisdom and modern technology for your complete holistic healing journey.",
    buttonText: "Start Your Journey",
    imageUrl: "/LP.png"
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/content/landing_hero`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.value) {
            const parsed = JSON.parse(data.value);
            setHeroData({
              title: parsed.title || "FIND YOUR",
              subtitle: parsed.subtitle || "Experience the convergence of ancient wisdom and modern technology for your complete holistic healing journey.",
              buttonText: parsed.buttonText || "Start Your Journey",
              imageUrl: parsed.imageUrl || "/LP.png"
            });
            return;
          }
        }

        // Fallback to old landing endpoint
        const fallbackRes = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/landing`);
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          if (data && data.hero) {
            setHeroData({
              title: data.hero.title || "FIND YOUR",
              subtitle: data.hero.subtitle || "Experience the convergence of ancient wisdom and modern technology for your complete holistic healing journey.",
              buttonText: data.hero.buttonText || "Start Your Journey",
              imageUrl: data.hero.imageUrl || "/LP.png"
            });
          }
        }
      } catch (err) {
        console.warn("Failed to fetch landing hero content from backend", err);
      }
    };
    fetchHeroData();
  }, []);

  // Split subtitle dynamically for exact 2-line structure
  const subtitleText = heroData.subtitle || "";
  let subLine1 = subtitleText;
  let subLine2 = "";

  const splitPhrase = "modern technology";
  const splitIndex = subtitleText.toLowerCase().indexOf(splitPhrase);
  if (splitIndex !== -1) {
    subLine1 = subtitleText.substring(0, splitIndex + splitPhrase.length);
    subLine2 = subtitleText.substring(splitIndex + splitPhrase.length).trim();
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#f4fbf7]">
      {/* 1. Breathing Image Background - Light theme */}
      <motion.div 
        className="absolute inset-0 w-full h-full bg-[length:auto_85%] lg:bg-[length:auto_90%] bg-bottom lg:bg-right-bottom bg-no-repeat"
        style={{ 
          backgroundImage: `url('${heroData.imageUrl}')`,
          transformOrigin: "bottom"
        }}
        animate={{ 
          scale: [1, 1.02, 1],
          opacity: [0.85, 0.9, 0.85]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* 2. Drifting Mist Layer (Soft Light green) */}
      <motion.div 
        className="absolute inset-0 opacity-15 z-[2] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(165,243,207,0.3) 0%, transparent 60%)',
          backgroundSize: '200% 200%'
        }}
        animate={{
          x: ['-10%', '10%'],
          y: ['-5%', '5%']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
      />

      {/* 3. Floating Particles Layer (Soft green) */}
      <div className="absolute inset-0 z-[3] overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-emerald-400 blur-[1px]"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: '100%',
              opacity: Math.random() * 0.4 + 0.1
            }}
            animate={{
              y: ['0vh', '-100vh'],
              x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100],
              opacity: [0, Math.random() * 0.4 + 0.2, 0]
            }}
            transition={{
              duration: Math.random() * 12 + 12,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>

      {/* 4. Central Expanding Aura */}
      <motion.div
        className="absolute z-[4] w-[50vw] h-[50vw] rounded-full border border-emerald-500/10 pointer-events-none"
        animate={{
          scale: [0.8, 1.5],
          opacity: [0.3, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
      <motion.div
        className="absolute z-[4] w-[35vw] h-[35vw] rounded-full border border-emerald-400/15 pointer-events-none"
        animate={{
          scale: [0.8, 1.8],
          opacity: [0.4, 0]
        }}
        transition={{
          duration: 10,
          delay: 2,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />

      {/* 5. Falling Leaves Effect (More visible and leaf-like) */}
      <div className="absolute inset-0 z-[4] overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`leaf-${i}`}
            className="absolute rounded-tl-full rounded-br-full rounded-tr-sm rounded-bl-sm shadow-sm"
            style={{
              width: Math.random() * 15 + 15 + 'px',
              height: Math.random() * 15 + 15 + 'px',
              left: Math.random() * 100 + '%',
              top: '-10%',
              background: `linear-gradient(135deg, #4ade80, #22c55e)`,
              opacity: Math.random() * 0.4 + 0.6, // More visible
            }}
            animate={{
              y: ['0vh', '120vh'],
              x: [
                '0px',
                `${(Math.random() - 0.5) * 200 + 50}px`,
                `${(Math.random() - 0.5) * 200 - 50}px`,
                `${(Math.random() - 0.5) * 250}px`
              ],
              rotate: [0, 180, 360, 540],
              opacity: [0, Math.random() * 0.4 + 0.6, Math.random() * 0.4 + 0.6, 0]
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>

      {/* 6. Atmosphere Overlay - Light/Soft vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/60 z-[5]" />

      {/* 7. Hero Content - Center-aligned layout */}
      <div className="relative z-[20] w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center min-h-screen pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="w-full flex flex-col items-center justify-center max-w-5xl"
        >
          <h1 
            className="text-3xl sm:text-[4.5vw] md:text-[5vw] lg:text-[5.2vw] xl:text-[5.5vw] font-black text-[#123c24] drop-shadow-[0_2px_10px_rgba(18,60,36,0.12)] tracking-tighter leading-tight w-full text-center uppercase whitespace-nowrap select-none flex flex-nowrap items-center justify-center gap-x-2 sm:gap-x-4"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            <span>{heroData.title || "FIND YOUR"}</span>
            <span className="text-[#123c24] inline-block relative">
              <AnimatePresence mode="wait">
                <motion.span
                  key={phraseIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="inline-block whitespace-nowrap"
                >
                  {phrases[phraseIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="mt-8 text-lg md:text-xl lg:text-2xl text-[#123c24] opacity-90 max-w-4xl leading-snug font-medium italic text-center w-full"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {subLine2 ? (
              <>
                {subLine1}
                <br />
                {subLine2}
              </>
            ) : (
              subtitleText
            )}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1.5 }}
            className="mt-12"
          >
            <button
              onClick={() => navigate('/signup')}
              className="px-14 py-5 rounded-full bg-[#2dc68f] text-emerald-950 font-extrabold text-lg hover:bg-[#22af7d] transition-all duration-300 shadow-xl shadow-emerald-500/20 hover:scale-105"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {heroData.buttonText}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunityHero;
