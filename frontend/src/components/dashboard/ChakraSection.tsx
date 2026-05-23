import { motion, AnimatePresence } from 'motion/react';
import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChakraSoundboardModal } from './ChakraSoundboardModal';

import chakraRoot from '../../assets/chakras/root.png';
import chakraSacral from '../../assets/chakras/sacral.png';
import chakraSolar from '../../assets/chakras/solar.png';
import chakraHeart from '../../assets/chakras/heart.png';
import chakraThroat from '../../assets/chakras/throat.png';
import chakraThirdEye from '../../assets/chakras/thirdeye.png';
import chakraCrown from '../../assets/chakras/crown.png';

/* ─── Chakra data with Solfeggio frequencies ─── */
interface Chakra {
  id: number;
  name: string;
  sanskrit: string;
  frequency: number;   // Hz (Solfeggio)
  color: string;        // primary
  glowColor: string;    // glow / ring
  bgGradient: string;   // card background
  pastelBg: string;     // light pastel card fill
  description: string;
}

const CHAKRAS: Chakra[] = [
  {
    id: 1,
    name: 'Root',
    sanskrit: 'Muladhara',
    frequency: 396,
    color: '#DC2626',
    glowColor: 'rgba(220,38,38,0.55)',
    bgGradient: 'linear-gradient(135deg, rgba(220,38,38,0.12) 0%, rgba(220,38,38,0.04) 100%)',
    pastelBg: 'linear-gradient(145deg, #FEF2F2, #FEE2E2, #FFF5F5)',
    description: 'Grounding & stability',
  },
  {
    id: 2,
    name: 'Sacral',
    sanskrit: 'Svadhishthana',
    frequency: 417,
    color: '#EA580C',
    glowColor: 'rgba(234,88,12,0.55)',
    bgGradient: 'linear-gradient(135deg, rgba(234,88,12,0.12) 0%, rgba(234,88,12,0.04) 100%)',
    pastelBg: 'linear-gradient(145deg, #FFF7ED, #FFEDD5, #FFFBF5)',
    description: 'Creativity & emotion',
  },
  {
    id: 3,
    name: 'Solar Plexus',
    sanskrit: 'Manipura',
    frequency: 528,
    color: '#CA8A04',
    glowColor: 'rgba(202,138,4,0.55)',
    bgGradient: 'linear-gradient(135deg, rgba(202,138,4,0.12) 0%, rgba(202,138,4,0.04) 100%)',
    pastelBg: 'linear-gradient(145deg, #FEFCE8, #FEF9C3, #FFFEF5)',
    description: 'Confidence & power',
  },
  {
    id: 4,
    name: 'Heart',
    sanskrit: 'Anahata',
    frequency: 639,
    color: '#16A34A',
    glowColor: 'rgba(22,163,74,0.55)',
    bgGradient: 'linear-gradient(135deg, rgba(22,163,74,0.12) 0%, rgba(22,163,74,0.04) 100%)',
    pastelBg: 'linear-gradient(145deg, #F0FDF4, #DCFCE7, #F5FFF8)',
    description: 'Love & compassion',
  },
  {
    id: 5,
    name: 'Throat',
    sanskrit: 'Vishuddha',
    frequency: 741,
    color: '#2563EB',
    glowColor: 'rgba(37,99,235,0.55)',
    bgGradient: 'linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0.04) 100%)',
    pastelBg: 'linear-gradient(145deg, #EFF6FF, #DBEAFE, #F5F9FF)',
    description: 'Expression & truth',
  },
  {
    id: 6,
    name: 'Third Eye',
    sanskrit: 'Ajna',
    frequency: 852,
    color: '#4F46E5',
    glowColor: 'rgba(79,70,229,0.55)',
    bgGradient: 'linear-gradient(135deg, rgba(79,70,229,0.12) 0%, rgba(79,70,229,0.04) 100%)',
    pastelBg: 'linear-gradient(145deg, #EEF2FF, #E0E7FF, #F5F3FF)',
    description: 'Intuition & clarity',
  },
  {
    id: 7,
    name: 'Crown',
    sanskrit: 'Sahasrara',
    frequency: 963,
    color: '#7C3AED',
    glowColor: 'rgba(124,58,237,0.55)',
    bgGradient: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(124,58,237,0.04) 100%)',
    pastelBg: 'linear-gradient(145deg, #F5F3FF, #EDE9FE, #FAF5FF)',
    description: 'Spiritual connection',
  },
];

/* ─── Chakra symbol images ─── */

const CHAKRA_IMAGES: Record<number, string> = {
  1: chakraRoot,
  2: chakraSacral,
  3: chakraSolar,
  4: chakraHeart,
  5: chakraThroat,
  6: chakraThirdEye,
  7: chakraCrown,
};

/* ─── Image-based chakra symbol ─── */
function ChakraSymbol({ chakra, size = 64 }: { chakra: Chakra; size?: number }) {
  const imgSrc = CHAKRA_IMAGES[chakra.id];

  return (
    <img
      src={imgSrc}
      alt={`${chakra.name} Chakra - ${chakra.sanskrit}`}
      width={size}
      height={size}
      className="block rounded-full object-contain"
      draggable={false}
    />
  );
}

/* ─── Main component ─── */
export function ChakraSection() {
  const navigate = useNavigate();
  const [activeChakra, setActiveChakra] = useState<number | null>(null);
  const [rippleKey, setRippleKey] = useState(0);
  const [selectedChakra, setSelectedChakra] = useState<Chakra | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleChakraClick = useCallback((chakra: Chakra) => {
    setActiveChakra((prev) => (prev === chakra.id ? null : chakra.id));
    setRippleKey((k) => k + 1);
    setSelectedChakra(chakra);
  }, []);

  const handleStopAll = useCallback(() => {
    setActiveChakra(null);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedChakra(null);
  }, []);

  return (
    <section id="chakra-section" className="py-16 md:py-20 bg-[#EEF7F1] relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #1a5d47 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1a5d47]/10 text-[#1a5d47]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="6" y2="12" />
                  <line x1="18" y1="12" x2="22" y2="12" />
                </svg>
              </span>
              <span className="text-[#1a5d47] font-bold tracking-widest text-[10px] uppercase underline underline-offset-4 decoration-1">
                Energy Centers
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-[#0F131A] tracking-tight mb-2"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              7 Chakras
            </h2>
            <p className="text-gray-500 text-base font-medium tracking-tight">
              Tap a chakra to explore.
            </p>
          </div>

          {/* Stop all button */}
          <AnimatePresence>
            {activeChakra !== null && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleStopAll}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F131A]/5 hover:bg-[#0F131A]/10 text-[#0F131A]/70 text-sm font-medium transition-colors"
              >
                Clear Selection
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Chakra strip */}
        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-5">
          {CHAKRAS.map((chakra, idx) => {
            const isActive = activeChakra === chakra.id;

            return (
              <motion.div
                key={chakra.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
              >
                <motion.button
                  onClick={() => handleChakraClick(chakra)}
                  className="group relative w-full flex flex-col items-center rounded-2xl border border-white/60 backdrop-blur-sm p-5 md:p-6 cursor-pointer transition-all duration-300 overflow-hidden"
                  style={{ background: chakra.pastelBg }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  animate={isActive ? {
                    scale: 1.04,
                    y: [ -6, -12, -6 ],
                    boxShadow: [
                      `0 0 4px ${chakra.glowColor}`,
                      `0 12px 32px ${chakra.glowColor}`,
                      `0 4px 16px ${chakra.glowColor}`,
                    ],
                  } : { scale: 1, y: 0, boxShadow: `0 2px 12px rgba(0,0,0,0.04)` }}
                  transition={isActive ? {
                    y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                    boxShadow: { duration: 4, repeat: Infinity, repeatType: 'reverse' },
                    scale: { duration: 0.4 },
                  } : { duration: 0.4 }}
                >
                  {/* Ripple on click */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        key={`ripple-${rippleKey}`}
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        initial={{ opacity: 0.5, scale: 0.5 }}
                        animate={{ opacity: 0, scale: 2.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        style={{
                          background: `radial-gradient(circle, ${chakra.glowColor} 0%, transparent 70%)`,
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Chakra symbol */}
                  <div className="relative mb-4">
                    {/* Glow ring behind symbol when active */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full blur-xl"
                        style={{ background: chakra.glowColor }}
                        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    <motion.div
                      animate={isActive ? { rotate: [0, 360] } : { rotate: 0 }}
                      transition={isActive ? { duration: 12, repeat: Infinity, ease: 'linear' } : { duration: 0.5 }}
                      className="relative z-10"
                    >
                      <ChakraSymbol chakra={chakra} size={64} />
                    </motion.div>
                  </div>

                  {/* Sanskrit name as main bold title */}
                  <h3
                    className="text-base md:text-lg font-bold tracking-tight mb-2 transition-colors duration-300"
                    style={{ color: isActive ? chakra.color : '#0F131A' }}
                  >
                    {chakra.sanskrit}
                  </h3>

                  {/* Description on hover */}
                  <p className="text-[10px] text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                    {chakra.description}
                  </p>
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* View More button */}
        <motion.div
          id="begin-journey-anchor"
          className="flex justify-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => navigate('/chakra-experience')}
            className="group flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300
                       bg-[#1a5d47] text-white hover:bg-[#113d2f] shadow-lg shadow-[#1a5d47]/20 hover:shadow-xl hover:shadow-[#1a5d47]/30"
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>View More</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </motion.div>
      </div>

      {/* Soundboard Modal */}
      <ChakraSoundboardModal
        chakra={selectedChakra}
        chakraImage={selectedChakra ? CHAKRA_IMAGES[selectedChakra.id] : null}
        onClose={handleCloseModal}
      />
    </section>
  );
}
