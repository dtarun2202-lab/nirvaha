import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const CommunityHero = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const phrases = ["INNER HARMONY", "PURPOSE OF LIFE", "PEACE WITHIN"];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6;
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);


  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#eaf5ef]">
      {/* 1. Breathing Image Background */}
      <motion.div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/landing-page.jpeg')` }}
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.85, 1, 0.85]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* 2. Drifting Mist Layer */}
      <motion.div 
        className="absolute inset-0 opacity-30 z-[2] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 50%)',
          backgroundSize: '200% 200%'
        }}
        animate={{
          x: ['-20%', '20%'],
          y: ['-10%', '10%']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
      />

      {/* 3. Floating Particles Layer */}
      <div className="absolute inset-0 z-[3] overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white blur-[1px]"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: '100%',
              opacity: Math.random() * 0.5 + 0.3
            }}
            animate={{
              y: ['0vh', '-100vh'],
              x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100],
              opacity: [0, Math.random() * 0.8 + 0.2, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>

      {/* 4. Central Expanding Aura */}
      <motion.div
        className="absolute z-[4] w-[40vw] h-[40vw] rounded-full border border-emerald-300/20 mix-blend-screen pointer-events-none"
        animate={{
          scale: [0.8, 1.5],
          opacity: [0.6, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
      <motion.div
        className="absolute z-[4] w-[30vw] h-[30vw] rounded-full border border-emerald-200/30 mix-blend-screen pointer-events-none"
        animate={{
          scale: [0.8, 1.8],
          opacity: [0.8, 0]
        }}
        transition={{
          duration: 8,
          delay: 2,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />

      {/* 5. Falling Leaves Effect */}
      <div className="absolute inset-0 z-[4] overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`leaf-${i}`}
            className="absolute rounded-tl-full rounded-br-full rounded-tr-sm rounded-bl-sm bg-[#bbf7d0] mix-blend-screen opacity-40 blur-[0.5px]"
            style={{
              width: Math.random() * 20 + 20 + 'px',
              height: Math.random() * 20 + 20 + 'px',
              left: Math.random() * 100 + '%',
              top: '-10%',
            }}
            animate={{
              y: ['0vh', '120vh'], // Falls downward past screen
              x: [
                '0px', // start
                `${(Math.random() - 0.5) * 150 + 50}px`, // sway right/left
                `${(Math.random() - 0.5) * 150 - 50}px`, // sway opposite
                `${(Math.random() - 0.5) * 200}px` // end sway
              ],
              rotate: [0, 180, 360, 540], // Natural tumbling effect
              opacity: [0, 0.6, 0.6, 0] // Fade in and out
            }}
            transition={{
              duration: Math.random() * 12 + 14, // Slow overall speed
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 12,
            }}
          />
        ))}
      </div>

      {/* 6. Atmosphere Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#103a22]/20 to-[#0a2313]/60 z-[5]" />

      {/* 7. Hero Content */}
      <div className="relative z-[20] w-full max-w-5xl mx-auto px-4 text-center mt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-black text-emerald-950 drop-shadow-[0_4px_20px_rgba(255,255,255,0.8)] tracking-tighter leading-tight"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            FIND YOUR{' '}
            <span className="text-emerald-800">
              <AnimatePresence mode="wait">
                <motion.span
                  key={phraseIndex}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block"
                >
                  {phrases[phraseIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="mt-6 text-xl md:text-2xl text-emerald-950/80 max-w-3xl mx-auto leading-relaxed font-medium italic drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Experience the convergence of ancient wisdom and modern technology for your complete holistic healing journey.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1.5 }}
            className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <button
              onClick={() => navigate('/signup')}
              className="px-12 py-5 rounded-full bg-emerald-400 text-black font-bold text-lg hover:bg-emerald-300 transition-colors duration-300 shadow-2xl"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Start Your Journey
            </button>
          </motion.div>
        </motion.div>
      </div>


    </section>
  );
};

export default CommunityHero;
