import React, { useState } from 'react';
import { motion } from 'motion/react';

interface SplitDoorAnimationProps {
  onDoorOpen?: () => void;
  isOpen?: boolean;
}

const SplitDoorAnimation: React.FC<SplitDoorAnimationProps> = ({ onDoorOpen, isOpen: controlledOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : isOpen;

  const handleDoorClick = () => {
    if (!open) {
      setIsOpen(true);
      onDoorOpen?.();
    }
  };

  return (
    <motion.div 
      className="absolute inset-0 z-30 flex items-center justify-center overflow-hidden cursor-pointer"
      animate={{ 
        backgroundColor: open ? "rgba(234, 245, 239, 0)" : "rgba(234, 245, 239, 1)",
        pointerEvents: open ? "none" : "auto" 
      }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      onClick={handleDoorClick}
    >
      {/* 1. Animated Atmospheric Background - "Light Wisdom Void" */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {/* Volumetric Light Shafts (Corners) - Soft Warm Glow */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[70%] bg-[radial-gradient(circle_at_top_left,rgba(255,215,0,0.1)_0%,transparent_70%)] blur-3xl rotate-[-15deg]" />
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[70%] bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08)_0%,transparent_70%)] blur-3xl rotate-[15deg]" />
        </div>

        {/* Wisdom Streams (Vertical Script) - Dark variants */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`stream-${i}`}
            className="absolute top-0 w-10 text-[12px] text-slate-900/10 font-serif select-none whitespace-nowrap"
            style={{ 
              left: `${10 + i * 11.5}%`,
              writingMode: 'vertical-rl'
            }}
            animate={{ 
              opacity: [0.03, 0.15, 0.03],
              y: ["-30%", "30%"]
            }}
            transition={{ 
              duration: 10 + i * 2, 
              repeat: Infinity, 
              ease: "linear",
              delay: i * 1.5 
            }}
          >
            नमस्ते सर्वे भवन्तु सुखिनः 🕉️ BALANCE ENERGY GROWTH SCIENCE AI HYBRID HOLISTIC HEALING
          </motion.div>
        ))}

        {/* User-Provided Line Art Ornaments */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          animate={{ opacity: open ? 0 : 1 }}
          transition={{ duration: 1.2 }}
        >
          {/* Left Side: Ancient Wisdom Symbols */}
          <div className="absolute left-[5%] top-1/2 -translate-y-1/2 w-[30%] h-[60%] flex flex-col items-center justify-center gap-8 opacity-40">
            <motion.img 
              src="/lotus.jpg" 
              className="w-48 h-48 object-contain mix-blend-multiply"
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.img 
              src="/leaf.jpg" 
              className="w-40 h-40 object-contain mix-blend-multiply"
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Right Side: Modern Harmony Symbols */}
          <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[30%] h-[60%] flex flex-col items-center justify-center gap-8 opacity-40">
            <motion.img 
              src="/yoga.jpg" 
              className="w-48 h-48 object-contain mix-blend-multiply"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.img 
              src="/water.jpg" 
              className="w-40 h-40 object-contain mix-blend-multiply"
              animate={{ x: [-3, 3, -3] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Subtle Background Accent */}
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-full flex justify-between px-20 opacity-20 hover:opacity-30 transition-opacity">
            <img src="/leaves.jpg" className="w-32 h-32 object-contain mix-blend-multiply" />
            <img src="/leaves.jpg" className="w-32 h-32 object-contain mix-blend-multiply scale-x-[-1]" />
          </div>
        </motion.div>

        {/* Stars/Particles - Dark Emerald */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute bg-emerald-500 rounded-full"
            style={{
              width: Math.random() < 0.2 ? "3px" : "1px",
              height: Math.random() < 0.2 ? "3px" : "1px",
              boxShadow: Math.random() < 0.2 ? "0 0 8px rgba(16,185,129,0.2)" : "none",
            }}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.4 + 0.1
            }}
            animate={{ 
              y: ["-30px", "30px"],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{ 
              duration: 4 + Math.random() * 6, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
        {/* Subtle radial glow to enhance atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_80%)]" />
      </motion.div>

      <div 
        className="relative w-full h-full flex justify-between z-10" 
        style={{ 
          perspective: '2000px'
        }}
      >
        {/* Left Door Leaf (Ancient Wood) */}
        <motion.div
          className="relative h-full overflow-hidden"
          style={{ 
            width: 'calc(50% - 60px)',
            transformOrigin: 'left center',
            boxShadow: 'inset -20px 0 50px rgba(0,0,0,0.1)',
            zIndex: 40
          }}
          initial={{ rotateY: 0 }}
          animate={open ? { 
            rotateY: -110, 
            x: '-10%',
            opacity: 0,
            scale: 1.05
          } : { 
            rotateY: 0, 
            x: '0%',
            opacity: 1,
            scale: 1
          }}
          transition={{ 
            duration: 2.2, 
            ease: [0.4, 0, 0.2, 1],
            opacity: { duration: 1.8, delay: 0.4 }
          }}
        >
          <div 
            className="absolute top-0 left-0 h-full"
            style={{ width: 'calc(200% + 120px)' }}
          >
            <img 
              src="/split-door.jpeg" 
              alt="Ancient Left Door" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </motion.div>

        {/* Center Gap Background (Visible before opening) */}
        {!open && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-full bg-[#eaf5ef] z-30" />
        )}

        {/* Right Door Leaf (Modern Tech) */}
        <motion.div
          className="relative h-full overflow-hidden"
          style={{ 
            width: 'calc(50% - 60px)',
            transformOrigin: 'right center',
            boxShadow: 'inset 20px 0 50px rgba(0,0,0,0.1)',
            zIndex: 40
          }}
          initial={{ rotateY: 0 }}
          animate={open ? { 
            rotateY: 110, 
            x: '10%',
            opacity: 0,
            scale: 1.05
          } : { 
            rotateY: 0, 
            x: '0%',
            opacity: 1,
            scale: 1
          }}
          transition={{ 
            duration: 2.2, 
            ease: [0.4, 0, 0.2, 1],
            opacity: { duration: 1.8, delay: 0.4 }
          }}
        >
          <div 
            className="absolute top-0 right-0 h-full"
            style={{ width: 'calc(200% + 120px)' }}
          >
            <img 
              src="/split-door.jpeg" 
              alt="Tech Right Door" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </motion.div>

        {/* Center Light Glow Line (Visible before opening) */}
        {!open && (
          <motion.div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-transparent via-emerald-400/50 to-transparent z-40 pointer-events-none"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      {/* Click To Reveal Image */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none flex items-center justify-center"
        animate={open ? { opacity: 0, scale: 0.8 } : { opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 2, repeat: open ? 0 : Infinity, ease: "easeInOut" }}
      >
        <img 
          src="/image copy 2.png" 
          alt="Click to Reveal" 
          className="w-32 h-32 sm:w-48 sm:h-48 object-contain drop-shadow-2xl" 
        />
      </motion.div>
    </motion.div>
  );
};

export default SplitDoorAnimation;
