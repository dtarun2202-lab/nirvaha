import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/meditation-poses.css';

interface MeditationPose {
  id: number;
  name: string;
  image: string;
  description: string;
}

const meditationPoses: MeditationPose[] = [
  {
    id: 1,
    name: 'Easy Pose',
    image: '/poses for medittaion/easy 1.jpg',
    description: 'Comfortable seated position for beginners',
  },
  {
    id: 2,
    name: 'Cosmic Stillness',
    image: '/poses for medittaion/cosmic 2.png',
    description: 'A transcendent posture connecting body and cosmos',
  },
  {
    id: 3,
    name: 'Thunderbolt Pose',
    image: '/poses for medittaion/thunder 3.png',
    description: 'Upright kneeling posture for stillness and focus',
  },
  {
    id: 4,
    name: 'Lotus Pose',
    image: '/poses for medittaion/lotus 4.png',
    description: 'Classic seated meditation position for deep focus',
  },
  {
    id: 5,
    name: 'Corpse Pose',
    image: '/poses for medittaion/corpus 5.png',
    description: 'Deeply restorative lying posture for full relaxation',
  },
  {
    id: 6,
    name: 'Zen Awareness',
    image: '/poses for medittaion/zen 6.png',
    description: 'Mindful seated posture cultivating pure awareness',
  },
  {
    id: 7,
    name: 'Tree Pose',
    image: '/poses for medittaion/tree 7.png',
    description: 'Balancing posture for grounding and mental clarity',
  },
  {
    id: 8,
    name: 'Deep Dhyana',
    image: '/poses for medittaion/deep 8.png',
    description: 'Advanced meditative posture for profound inner stillness',
  },
];

/** Stable offsets for brief light particles (px from card center). */
const PARTICLE_OFFSETS = [
  { dx: -26, dy: -32 },
  { dx: 18, dy: -38 },
  { dx: 32, dy: -12 },
  { dx: -34, dy: 8 },
  { dx: 8, dy: 28 },
  { dx: -12, dy: 22 },
  { dx: 28, dy: 18 },
  { dx: -4, dy: -42 },
];

const CLICK_FX_MS = 1400;

const MeditationPosesCircle: React.FC = () => {
  const [dimensions, setDimensions] = useState({
    radius: 180,
    centerSize: 120,
  });
  const [selectedPose, setSelectedPose] = useState<MeditationPose | null>(null);
  const [clickFxPoseId, setClickFxPoseId] = useState<number | null>(null);
  const [rippleByPose, setRippleByPose] = useState<
    Record<number, { x: number; y: number; key: number } | undefined>
  >({});
  const clearFxTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      const isMobile = window.innerWidth < 768;
      setDimensions({
        radius: isMobile ? 130 : 170,
        centerSize: isMobile ? 100 : 140,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (clickFxPoseId == null) return;
    if (clearFxTimer.current) clearTimeout(clearFxTimer.current);
    clearFxTimer.current = setTimeout(() => {
      setClickFxPoseId(null);
      clearFxTimer.current = null;
    }, CLICK_FX_MS);
    return () => {
      if (clearFxTimer.current) clearTimeout(clearFxTimer.current);
    };
  }, [clickFxPoseId]);

  const activatePose = useCallback((pose: MeditationPose, clientX: number, clientY: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const x = clientX - r.left;
    const y = clientY - r.top;
    setRippleByPose((prev) => ({
      ...prev,
      [pose.id]: { x, y, key: Date.now() },
    }));
    setClickFxPoseId(pose.id);
    setSelectedPose(pose);
    window.setTimeout(() => {
      setRippleByPose((prev) => {
        const next = { ...prev };
        delete next[pose.id];
        return next;
      });
    }, 950);
  }, []);

  const handlePosePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, pose: MeditationPose) => {
      activatePose(pose, e.clientX, e.clientY, e.currentTarget);
    },
    [activatePose]
  );

  const { radius, centerSize } = dimensions;

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/leaves.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-green-800/30 to-emerald-900/40" />
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 md:w-2 md:h-2 bg-green-300/60 rounded-full float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              x: [-5, 5, -5],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-20 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4 drop-shadow-lg">
            Meditation Poses
          </h2>
          <p className="text-lg text-green-100 max-w-2xl mx-auto drop-shadow-md">
            Discover effective postures that promote relaxation, focus, and mental well-being
          </p>
        </motion.div>

        <div className="relative flex items-center justify-center min-h-[600px] md:min-h-[700px] meditation-circle-container">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-80 h-80 md:w-96 md:h-96 border border-green-300/60 rounded-full pulse-ring"
              animate={{ rotate: 360 }}
              transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute w-64 h-64 md:w-80 md:h-80 border border-emerald-300/50 rounded-full pulse-ring"
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute w-48 h-48 md:w-64 md:h-64 border border-green-200/40 rounded-full pulse-ring"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <motion.div className="relative z-10 flex items-center justify-center breathe-animation">
            <div
              className="bg-gradient-to-br from-green-50 via-green-100 to-green-200 rounded-full meditation-glow flex items-center justify-center border-4 border-green-200/80 shadow-2xl"
              style={{ width: `${centerSize}px`, height: `${centerSize}px` }}
            >
              <motion.span
                className="text-green-800/90 select-none tracking-[0.2em] font-light"
                style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.75rem, 5vw, 3.25rem)' }}
                animate={{ rotate: [0, 2, -2, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              >
                Om
              </motion.span>
            </div>
            <div className="absolute inset-0 bg-gradient-radial from-green-400/40 via-emerald-300/30 to-transparent rounded-full blur-2xl" />
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center">
            {meditationPoses.map((pose, index) => {
              const angle = (index * 360) / meditationPoses.length;
              const ripple = rippleByPose[pose.id];
              const isClickFx = clickFxPoseId === pose.id;

              return (
                <motion.div
                  key={pose.id}
                  className="absolute"
                  style={{ left: '50%', top: '50%' }}
                  animate={{
                    x: [
                      Math.cos(((angle + 0) * Math.PI) / 180) * radius,
                      Math.cos(((angle + 90) * Math.PI) / 180) * radius,
                      Math.cos(((angle + 180) * Math.PI) / 180) * radius,
                      Math.cos(((angle + 270) * Math.PI) / 180) * radius,
                      Math.cos(((angle + 360) * Math.PI) / 180) * radius,
                    ],
                    y: [
                      Math.sin(((angle + 0) * Math.PI) / 180) * radius,
                      Math.sin(((angle + 90) * Math.PI) / 180) * radius,
                      Math.sin(((angle + 180) * Math.PI) / 180) * radius,
                      Math.sin(((angle + 270) * Math.PI) / 180) * radius,
                      Math.sin(((angle + 360) * Math.PI) / 180) * radius,
                    ],
                  }}
                  transition={{
                    duration: 120,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <div
                    className="pose-card-perspective"
                    style={{ transform: 'translate(-50%, -50%)' }}
                  >
                    <motion.div
                      className={`pose-card-root group cursor-pointer touch-manipulation ${
                        isClickFx ? 'pose-click-fx' : ''
                      }`}
                      style={{ zIndex: isClickFx ? 50 : undefined }}
                      onPointerDown={(e) => handlePosePointerDown(e, pose)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          const el = e.currentTarget;
                          const r = el.getBoundingClientRect();
                          activatePose(pose, r.left + r.width / 2, r.top + r.height / 2, el);
                        }
                      }}
                      animate={{
                        y: [0, -8, 0],
                        rotateX: isClickFx ? 5 : 0,
                        rotateY: isClickFx ? -4 : 0,
                        rotateZ: isClickFx ? 2 : 0,
                        scale: isClickFx ? 1.07 : 1,
                        z: isClickFx ? 48 : 0,
                      }}
                      transition={{
                        y: {
                          duration: 3 + index * 0.2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        },
                        rotateX: { type: 'spring', stiffness: 260, damping: 22 },
                        rotateY: { type: 'spring', stiffness: 260, damping: 22 },
                        rotateZ: { type: 'spring', stiffness: 280, damping: 24 },
                        scale: { type: 'spring', stiffness: 220, damping: 18 },
                        z: { duration: 0.35 },
                      }}
                      whileHover={isClickFx ? { scale: 1.07 } : { scale: 1.08 }}
                    >
                    <div className="pose-breath-aura" aria-hidden />
                    <div className="pose-border-glow-track" aria-hidden />

                    <div className="w-28 h-28 md:w-36 md:h-36 relative rounded-full">
                      <div className="pose-card-body meditation-card w-full h-full bg-emerald-50/35 backdrop-blur-xl rounded-full border border-white/25 flex flex-col items-center justify-center p-1.5 shadow-xl ring-1 ring-white/15">
                        {ripple && (
                          <span
                            key={ripple.key}
                            className="pose-water-ripple"
                            style={{ left: ripple.x, top: ripple.y }}
                          />
                        )}
                        <div className="w-full h-full rounded-full overflow-hidden relative">
                          <img
                            src={pose.image}
                            alt={pose.name}
                            className="pose-liquid-media w-full h-full object-cover object-center"
                            draggable={false}
                          />
                          <div className="pose-glass-shimmer" aria-hidden />
                        </div>
                      </div>
                    </div>

                    {isClickFx && (
                      <div className="pose-particle-layer" aria-hidden>
                        {PARTICLE_OFFSETS.map((p, i) => (
                          <span
                            key={`${pose.id}-${i}`}
                            className="pose-light-particle"
                            style={
                              {
                                left: '50%',
                                top: '50%',
                                '--dx': `${p.dx}px`,
                                '--dy': `${p.dy}px`,
                              } as React.CSSProperties
                            }
                          />
                        ))}
                      </div>
                    )}

                    <motion.div
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                    >
                      <div className="bg-emerald-50/75 backdrop-blur-md px-3 py-1 rounded-full shadow-lg border border-white/25">
                        <p className="text-xs font-medium text-emerald-950 whitespace-nowrap">
                          {pose.name}
                        </p>
                      </div>
                    </motion.div>

                    <div className="absolute inset-0 rounded-full bg-gradient-radial from-emerald-200/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md pointer-events-none" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-green-100 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Each pose represents a pathway to better mental health. Allow the gentle movement to
            guide your focus as you explore these positions that have been proven effective for
            cultivating inner peace and reducing stress.
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedPose && (
          <motion.div
            key="pose-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 pose-modal-backdrop z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPose(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="pose-modal-glass relative rounded-[1.75rem] p-8 md:p-10 max-w-md w-full text-emerald-950"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="pose-modal-close-btn pose-modal-close-btn--floating"
                onClick={() => setSelectedPose(null)}
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
                </svg>
              </button>
              <div className="pose-modal-aura" aria-hidden />
              <div className="relative z-[1] text-center">
                <div className="relative mx-auto mb-6 w-32 h-32 md:w-36 md:h-36">
                  <div
                    className="absolute inset-0 rounded-full opacity-80 blur-xl scale-110"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(167,243,208,0.45) 0%, rgba(52,211,153,0.15) 50%, transparent 70%)',
                    }}
                    aria-hidden
                  />
                  <div className="relative w-full h-full rounded-full overflow-hidden border border-white/30 shadow-[0_12px_40px_rgba(6,78,59,0.25)] ring-1 ring-emerald-100/40">
                    <img
                      src={selectedPose.image}
                      alt={selectedPose.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
                <h3
                  className="text-2xl md:text-3xl font-light mb-3 text-emerald-950 tracking-wide"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {selectedPose.name}
                </h3>
                <p className="text-emerald-900/85 text-sm md:text-base leading-relaxed mb-2 font-light">
                  {selectedPose.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MeditationPosesCircle;
