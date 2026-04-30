import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const CompanionTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [textIndex, setTextIndex] = useState(0);
  const messages = [
    "Finding your guide...",
    "Aligning you with the right energy...",
    "Entering the sacred space..."
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500); // 3.5 seconds total duration

    const textTimer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % messages.length);
    }, 1200);

    return () => {
      clearTimeout(timer);
      clearInterval(textTimer);
    };
  }, [onComplete]);

  // Generate particles
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    angle: (i / 40) * Math.PI * 2,
    distance: Math.random() * 400 + 200,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 1.5 + 2,
    delay: Math.random() * 1
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#050805]"
      style={{
        background: 'radial-gradient(circle at center, #0a1f1a 0%, #050805 100%)'
      }}
    >
      {/* Subtle Background Stars */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2}px`,
              height: `${Math.random() * 2}px`,
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.5)'
            }}
          />
        ))}
      </div>

      {/* Glowing Portal */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.7, 0.9, 0.7],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center"
      >
        {/* Portal Glow Layers */}
        <div className="absolute inset-0 rounded-full bg-teal-500/20 blur-3xl animate-pulse" />
        <div className="absolute inset-4 rounded-full border border-teal-500/30 blur-sm" />
        <div className="absolute inset-8 rounded-full border border-emerald-500/20" />
        
        {/* Core Portal Gradient */}
        <div 
          className="absolute inset-12 rounded-full shadow-[0_0_50px_rgba(20,184,166,0.3)]"
          style={{
            background: 'radial-gradient(circle, rgba(20,184,166,0.4) 0%, rgba(16,185,129,0.1) 70%, transparent 100%)'
          }}
        />

        {/* Floating Gold Accents */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-t border-b border-gold-500/20"
        />
      </motion.div>

      {/* Inward Moving Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ 
              x: Math.cos(p.angle) * p.distance,
              y: Math.sin(p.angle) * p.distance,
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              x: 0,
              y: 0,
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0.2]
            }}
            transition={{ 
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeIn"
            }}
            className="absolute left-1/2 top-1/2 w-1 h-1 bg-teal-200 rounded-full shadow-[0_0_8px_rgba(153,246,228,0.8)]"
            style={{ width: p.size, height: p.size }}
          />
        ))}
      </div>

      {/* Energy Waves / Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.circle
            key={i}
            cx="50%"
            cy="50%"
            r="0"
            fill="none"
            stroke="url(#waveGradient)"
            strokeWidth="1"
            animate={{
              r: ["0%", "40%"],
              opacity: [0, 1, 0],
              strokeWidth: [4, 1, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut"
            }}
          />
        ))}
        <defs>
          <radialGradient id="waveGradient">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#10b981" />
          </radialGradient>
        </defs>
      </svg>

      {/* Centered Text Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-center max-w-2xl"
        >
          {/* Main Text */}
          <h2 
            className="text-white text-4xl md:text-6xl font-bold tracking-widest mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            FINDING YOUR GUIDE...
          </h2>

          {/* Sub Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.2 }}
            className="text-teal-100 text-lg md:text-2xl font-medium mb-10 drop-shadow-md"
          >
            Matching you with the right companion for your journey
          </motion.p>

          {/* Mini Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="flex items-center justify-center gap-6 text-sm md:text-base uppercase tracking-[0.4em] text-teal-300 font-bold"
          >
            <span>1-on-1 sessions</span>
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span>Verified guides</span>
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span>24/7 support</span>
          </motion.div>

          {/* 3 Dots Animation */}
          <div className="mt-16 flex justify-center gap-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                className="w-3 h-3 rounded-full bg-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.8)]"
              />
            ))}
          </div>
        </motion.div>
      </div>


      {/* Overall Soft Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-[1px] pointer-events-none" />
    </motion.div>
  );
};


export default CompanionTransition;
