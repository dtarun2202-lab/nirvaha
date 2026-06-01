import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import {
  playSound,
  stopSound,
  getPlayingState,
  subscribe,
  CHAKRA_SOUNDS,
} from './chakraSoundEngine';

/* ─── types (kept local — mirrors ChakraSection's Chakra) ─── */
interface Chakra {
  id: number;
  name: string;
  sanskrit: string;
  frequency: number;
  color: string;
  glowColor: string;
  bgGradient: string;
  description: string;
  element: string;
  sense: string;
  location: string;
}

/* ─── long descriptions per chakra ─── */
const DESCRIPTIONS: Record<number, string> = {
  1: 'The Root Chakra is your foundation of stability. Located at the base of the spine, it governs your sense of security, grounding, and connection to the earth. When balanced, you feel safe, calm, and deeply rooted.',
  2: 'The Sacral Chakra is the center of creativity and emotional flow. Located below the navel, it governs passion, pleasure, and the ability to embrace change. When balanced, you feel joyful and creatively inspired.',
  3: 'The Solar Plexus Chakra radiates personal power and confidence. Located above the navel, it governs willpower, self-esteem, and inner fire. When balanced, you feel empowered, decisive, and full of energy.',
  4: 'The Heart Chakra is the bridge between body and spirit. Located at the center of the chest, it governs love, compassion, and emotional healing. When balanced, you feel open, loving, and deeply connected.',
  5: 'The Throat Chakra is your center of authentic expression. Located at the throat, it governs communication, truth, and creative self-expression. When balanced, you speak your truth with clarity and confidence.',
  6: 'The Third Eye Chakra awakens inner wisdom and intuition. Located between the eyebrows, it governs perception, insight, and spiritual awareness. When balanced, you experience clarity of thought and deep inner knowing.',
  7: 'The Crown Chakra connects you to universal consciousness. Located at the top of the head, it governs enlightenment, divine peace, and cosmic unity. When balanced, you experience transcendence and spiritual bliss.',
};

/* ─── hook for reactive playing state ─── */
function usePlayingState() {
  return useSyncExternalStore(subscribe, getPlayingState, getPlayingState);
}

/* ─── Animated equalizer bars ─── */
function EqBars({ color }: { color: string }) {
  return (
    <div className="flex items-end gap-[2px] h-3">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            height: ['4px', '12px', '6px', '12px', '4px'],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Sound button ─── */
function SoundButton({
  chakra,
  soundIndex,
  isPlaying,
  onClick,
}: {
  chakra: Chakra;
  soundIndex: number;
  isPlaying: boolean;
  onClick: () => void;
}) {
  const info = CHAKRA_SOUNDS[chakra.id]?.[soundIndex];
  if (!info) return null;

  return (
    <motion.button
      onClick={onClick}
      className="relative flex items-center gap-3 w-full rounded-xl px-4 py-3.5 border transition-all duration-300 cursor-pointer text-left overflow-hidden"
      style={{
        background: isPlaying
          ? `linear-gradient(135deg, ${chakra.color}20, ${chakra.color}10)`
          : 'rgba(255, 255, 255, 0.05)',
        borderColor: isPlaying ? chakra.color : 'rgba(0,255,156,0.2)',
        boxShadow: isPlaying
          ? `0 0 20px ${chakra.glowColor}, 0 4px 12px rgba(0,0,0,0.2)`
          : '0 2px 8px rgba(0,0,0,0.1)',
      }}
      whileHover={{
        y: -2,
        scale: 1.02,
        background: 'rgba(255, 255, 255, 0.1)',
        boxShadow: isPlaying
          ? `0 0 28px ${chakra.glowColor}, 0 8px 20px rgba(0,0,0,0.3)`
          : `0 4px 16px rgba(0,0,0,0.2)`,
      }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Glow backdrop when playing */}
      {isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ background: chakra.color }}
        />
      )}

      {/* Icon */}
      <span className="text-xl relative z-10 flex-shrink-0" style={{ color: isPlaying ? chakra.color : '#00FF9C' }}>{info.icon}</span>

      {/* Label */}
      <span
        className="text-sm font-medium relative z-10 flex-1 truncate"
        style={{ color: isPlaying ? chakra.color : 'white' }}
      >
        {info.label}
      </span>

      {/* Play indicator or play icon */}
      <div className="relative z-10 flex-shrink-0">
        {isPlaying ? (
          <EqBars color={chakra.color} />
        ) : (
          <svg
            className="w-4 h-4 text-[#00FF9C]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </div>
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Main Modal
   ═══════════════════════════════════════════════════════════════════════ */

interface Props {
  chakra: Chakra | null;
  chakraImage: string | null;
  onClose: () => void;
}

export function ChakraSoundboardModal({ chakra, chakraImage, onClose }: Props) {
  const playing = usePlayingState();
  const [, setTick] = useState(0);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Stop sound when modal closes
  useEffect(() => {
    if (!chakra) stopSound();
  }, [chakra]);

  const handleSoundClick = useCallback(
    (soundIndex: number) => {
      if (!chakra) return;
      playSound(chakra.id, soundIndex);
      setTick((t) => t + 1);
    },
    [chakra],
  );

  const handleClose = useCallback(() => {
    stopSound();
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {chakra && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'rgba(10, 25, 18, 0.65)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal card */}
          <motion.div
            className="relative w-full max-w-lg rounded-3xl overflow-hidden"
            style={{
              background: '#0D1B2A',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid #00FF9C',
              boxShadow: `0 32px 64px rgba(0,0,0,0.5), 0 0 20px rgba(0,255,156,0.15)`,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1.0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Decorative top glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ background: chakra.color }}
            />

            {/* Close button */}
            <motion.button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-5 h-5 text-[#00FF9C]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>

            {/* Content */}
            <div className="relative z-10 px-7 pt-8 pb-7">
              {/* Header: symbol + name */}
              <motion.div
                className="flex flex-col items-center mb-6"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Glowing chakra symbol */}
                <div className="relative mb-4">
                  <motion.div
                    className="absolute inset-0 rounded-full blur-xl"
                    style={{ background: chakra.glowColor }}
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="relative z-10"
                  >
                    {chakraImage && (
                      <img
                        src={chakraImage}
                        alt={`${chakra.sanskrit} Chakra`}
                        width={88}
                        height={88}
                        className="block rounded-full object-contain"
                        draggable={false}
                      />
                    )}
                  </motion.div>
                </div>

                {/* Sanskrit Name */}
                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-[#00FF9C] mb-1">
                  {chakra.sanskrit}
                </h3>

                {/* Chakra Name */}
                <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
                  {chakra.name} Chakra
                </h2>

                {/* Chips Row: Color, Element, Sense */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <div className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: chakra.color, color: chakra.color }}></div>
                    <span className="text-xs font-medium text-gray-300">Color</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300">
                    <span>{chakra.element}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300">
                    <span>{chakra.sense}</span>
                  </div>
                </div>

                {/* Body Location */}
                <p className="text-xs text-gray-400 mb-6">
                  Located at: {chakra.location}
                </p>
              </motion.div>

              {/* Description (2-3 lines of meaning/benefits) */}
              <motion.p
                className="text-sm text-gray-300 font-medium text-center leading-relaxed mb-8 max-w-sm mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {DESCRIPTIONS[chakra.id]}
              </motion.p>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-[#00FF9C]/20" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#00FF9C]">
                  Sacred Sounds
                </span>
                <div className="flex-1 h-px bg-[#00FF9C]/20" />
              </div>

              {/* Sound buttons grid */}
              <motion.div
                className="flex justify-center w-full max-w-sm mx-auto"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.06 } },
                }}
              >
                {(CHAKRA_SOUNDS[chakra.id] ?? []).map((_, idx) => {
                  const isThisPlaying =
                    playing !== null &&
                    playing.chakraId === chakra.id &&
                    playing.soundIndex === idx;

                  return (
                    <motion.div
                      key={idx}
                      className="w-full"
                      variants={{
                        hidden: { opacity: 0, y: 12 },
                        show: { opacity: 1, y: 0 },
                      }}
                    >
                      <SoundButton
                        chakra={chakra}
                        soundIndex={idx}
                        isPlaying={isThisPlaying}
                        onClick={() => handleSoundClick(idx)}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Now playing indicator */}
              <AnimatePresence>
                {playing && playing.chakraId === chakra.id && (
                  <motion.div
                    className="mt-5 flex items-center justify-center gap-2 text-xs font-medium"
                    style={{ color: chakra.color }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{ background: chakra.color }}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    Now playing ·{' '}
                    {CHAKRA_SOUNDS[chakra.id]?.[playing.soundIndex]?.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
