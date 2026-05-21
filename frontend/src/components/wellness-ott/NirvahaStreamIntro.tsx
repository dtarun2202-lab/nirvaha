import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';

export default function NirvahaStreamIntro() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const seriesId = searchParams.get('seriesId');

  useEffect(() => {
    // Auto-navigate to OTT after intro animation (3.5 seconds)
    const timer = setTimeout(() => {
      if (seriesId) {
        navigate(`/wellness-ott/series/${seriesId}`, { replace: true });
      } else {
        navigate('/wellness-ott', { replace: true });
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate, seriesId]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden flex items-center justify-center">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f1419] to-black" />

      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(46, 216, 153, 0.1) 0%, transparent 50%), 
                           radial-gradient(circle at 80% 80%, rgba(30, 58, 138, 0.1) 0%, transparent 50%)`,
          backgroundSize: '200% 200%',
        }}
      />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-6">
        {/* Nirvaha Logo / Icon */}
        <motion.div
          className="w-32 h-32 rounded-full bg-gradient-to-br from-[#2ed899] to-[#1ab87e] flex items-center justify-center shadow-2xl"
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
            delay: 0.2,
          }}
        >
          <motion.div
            className="text-5xl font-black text-black"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop',
            }}
          >
            ॐ
          </motion.div>
        </motion.div>

        {/* Main Title */}
        <div className="text-center">
          {/* NIRVAHA */}
          <motion.h1
            className="text-6xl md:text-7xl font-black text-white mb-2 tracking-widest"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              ease: 'easeOut',
            }}
          >
            NIRVAHA
          </motion.h1>

          {/* STREAM */}
          <motion.div
            className="flex items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.9,
              ease: 'easeOut',
            }}
          >
            {/* Animated underline */}
            <motion.div
              className="h-1 bg-gradient-to-r from-[#2ed899] to-transparent"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{
                duration: 0.8,
                delay: 1.2,
              }}
            />
            <h2 className="text-5xl md:text-6xl font-black text-[#2ed899] tracking-widest">
              STREAM
            </h2>
            <motion.div
              className="h-1 bg-gradient-to-l from-[#2ed899] to-transparent"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{
                duration: 0.8,
                delay: 1.2,
              }}
            />
          </motion.div>
        </div>

        {/* Tagline */}
        <motion.p
          className="text-white/70 text-lg md:text-xl tracking-widest uppercase font-semibold mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 1.5,
          }}
        >
          Your Journey to Wellness Awaits
        </motion.p>

        {/* Animated dots */}
        <motion.div
          className="flex gap-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 1.8,
          }}
        >
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-[#2ed899]"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Scan lines effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1),
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px,
            transparent 2px
          )`,
        }}
        animate={{
          backgroundPosition: ['0px 0px', '0px 4px'],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
        }}
      />

      {/* Glow effect that expands */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{
          duration: 3.5,
          ease: 'easeInOut',
        }}
        style={{
          background: `radial-gradient(circle at center, rgba(46, 216, 153, 0.2) 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}
