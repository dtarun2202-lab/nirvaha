import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const CosmicBackground: React.FC = () => {
  // Generate random stars
  const stars = useMemo(() => {
    return [...Array(100)].map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5
    }));
  }, []);

  // Generate random dust particles
  const particles = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 2,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 10
    }));
  }, []);

  return (
    <div className="cosmic-bg-container">
      {/* Deep Space Base */}
      <div className="space-base" />

      {/* Breathing Nebulas */}
      <motion.div 
        className="nebula nebula-1"
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      <motion.div 
        className="nebula nebula-2"
        animate={{ 
          opacity: [0.2, 0.4, 0.2],
          scale: [1.1, 1, 1.1],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />

      {/* Twinkling Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="star"
          style={{
            width: star.size,
            height: star.size,
            top: star.top,
            left: star.left,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating Dust Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="dust-particle"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, 50, 0],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Rare Shooting Star */}
      <motion.div
        className="shooting-star"
        initial={{ top: "-10%", left: "110%", opacity: 0 }}
        animate={{
          top: ["-10%", "110%"],
          left: ["110%", "-10%"],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 8,
          ease: "easeOut",
        }}
      />

      <style>{`
        .cosmic-bg-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
          background: #0B1F1A;
        }

        .space-base {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, #1F3D2B 0%, #0B1F1A 100%);
        }

        .nebula {
          position: absolute;
          width: 80%;
          height: 80%;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }

        .nebula-1 {
          background: radial-gradient(circle, rgba(31, 61, 43, 0.4) 0%, transparent 70%);
          top: -10%;
          left: -10%;
        }

        .nebula-2 {
          background: radial-gradient(circle, rgba(46, 139, 87, 0.2) 0%, transparent 70%);
          bottom: -20%;
          right: -10%;
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 5px white;
        }

        .dust-particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          filter: blur(1px);
        }

        .shooting-star {
          position: absolute;
          width: 150px;
          height: 2px;
          background: linear-gradient(90deg, transparent, white, transparent);
          transform: rotate(-45deg);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default CosmicBackground;
