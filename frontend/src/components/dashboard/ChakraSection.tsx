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
  element: string;
  sense: string;
  location: string;
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
    element: 'Earth',
    sense: 'Smell',
    location: 'Base of spine',
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
    element: 'Water',
    sense: 'Taste',
    location: 'Lower abdomen',
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
    element: 'Fire',
    sense: 'Sight',
    location: 'Upper abdomen',
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
    element: 'Air',
    sense: 'Touch',
    location: 'Center of chest',
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
    element: 'Ether',
    sense: 'Hearing',
    location: 'Throat',
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
    element: 'Light',
    sense: 'Sixth Sense',
    location: 'Forehead',
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
    element: 'Cosmic Energy',
    sense: 'Beyond',
    location: 'Top of head',
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
    <section id="chakra-section" className="min-h-screen flex flex-col justify-center py-16 md:py-20 bg-[#EAF7EF] relative overflow-hidden">
      
      {/* Background Sanskrit & Geometric Shapes in light green transparency */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large Lotus - Top Left */}
        <svg className="absolute -left-20 -top-20 w-[600px] h-[600px] text-[#16A34A] opacity-[0.06] transform -rotate-12" viewBox="0 0 100 100">
          <path d="M50 10 C40 40 40 80 50 90 C60 80 60 40 50 10 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
          <path d="M50 90 C30 80 10 60 20 30 C30 50 45 65 50 90 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
          <path d="M50 90 C70 80 90 60 80 30 C70 50 55 65 50 90 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
          <path d="M50 90 C20 90 5 70 5 50 C20 70 35 80 50 90 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
          <path d="M50 90 C80 90 95 70 95 50 C80 70 65 80 50 90 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
        </svg>

        {/* Giant Om Symbol - Bottom Right */}
        <svg className="absolute -right-10 -bottom-32 w-[700px] h-[700px] text-[#16A34A] opacity-[0.04] transform rotate-12" viewBox="0 0 100 100">
          <text x="50" y="75" fontFamily="'Cinzel', serif" fontSize="70" textAnchor="middle" fill="currentColor">ॐ</text>
        </svg>

        {/* Seed of Life - Top Right/Center */}
        <svg className="absolute right-[20%] top-[10%] w-[400px] h-[400px] text-[#16A34A] opacity-[0.05]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1"/>
          <circle cx="50" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="1"/>
          <circle cx="50" cy="70" r="20" fill="none" stroke="currentColor" strokeWidth="1"/>
          <circle cx="32.68" cy="40" r="20" fill="none" stroke="currentColor" strokeWidth="1"/>
          <circle cx="67.32" cy="40" r="20" fill="none" stroke="currentColor" strokeWidth="1"/>
          <circle cx="32.68" cy="60" r="20" fill="none" stroke="currentColor" strokeWidth="1"/>
          <circle cx="67.32" cy="60" r="20" fill="none" stroke="currentColor" strokeWidth="1"/>
        </svg>
      </div>

      {/* Soft deep green radial glow behind the path */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[600px] rounded-[100%] pointer-events-none blur-[120px]"
        style={{ background: 'radial-gradient(ellipse, rgba(0,255,156,0.15), transparent 70%)' }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#1A5D47]/30"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `-20px`,
            }}
            animate={{
              y: [0, -1000],
              x: Math.sin(i) * 50,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10 w-full">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#00FF9C]/10 text-[#00FF9C]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="6" y2="12" />
                  <line x1="18" y1="12" x2="22" y2="12" />
                </svg>
              </span>
              <span className="text-[#00FF9C] font-bold tracking-widest text-[10px] uppercase underline underline-offset-4 decoration-1">
                Energy Centers
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-[#0D1B2A] tracking-tight mb-2"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              7 Chakras
            </h2>
            <p className="text-[#1A5D47] text-base font-medium tracking-tight">
              A journey from Crown to Root. Swipe horizontally to explore.
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
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0D1B2A]/5 hover:bg-[#0D1B2A]/10 text-[#0D1B2A] text-sm font-medium transition-colors border border-[#0D1B2A]/10"
              >
                Clear Selection
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Horizontal Zigzag Journey Container */}
        <div className="relative w-full max-w-[1400px] mx-auto h-[600px] overflow-x-auto overflow-y-hidden snap-x snap-mandatory hide-scrollbar">
          
          <div className="relative w-[1200px] md:w-full min-w-[1000px] h-full mx-auto flex items-center">
            
            {/* SVG Zigzag Path */}
            <svg 
              className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[400px] pointer-events-none drop-shadow-[0_0_8px_rgba(0,255,156,0.5)]" 
              viewBox="0 0 1000 400" 
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="roadmapGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="10%" stopColor="#7C3AED" /> {/* Violet (Crown) */}
                  <stop offset="23%" stopColor="#4F46E5" /> {/* Indigo (Third Eye) */}
                  <stop offset="36%" stopColor="#2563EB" /> {/* Blue (Throat) */}
                  <stop offset="50%" stopColor="#16A34A" /> {/* Green (Heart) */}
                  <stop offset="64%" stopColor="#CA8A04" /> {/* Yellow (Solar Plexus) */}
                  <stop offset="77%" stopColor="#EA580C" /> {/* Orange (Sacral) */}
                  <stop offset="90%" stopColor="#DC2626" /> {/* Red (Root) */}
                </linearGradient>
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <motion.path
                d="M 100 200 C 165 200, 165 50, 230 50 C 295 50, 295 350, 360 350 C 425 350, 425 200, 500 200 C 575 200, 575 50, 640 50 C 705 50, 705 350, 770 350 C 835 350, 835 200, 900 200"
                fill="none"
                stroke="url(#roadmapGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#neonGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
            </svg>

            {/* Nodes will be added here in Phase 2 */}
            {CHAKRAS.map((chakra) => {
              const isSelected = activeChakra === chakra.id;
              const hasSelection = activeChakra !== null;
              const opacityClass = hasSelection && !isSelected ? 'opacity-50' : 'opacity-100';
              
              // X positions mapping (10% to 90%)
              // 7 Crown, 6 Third Eye, 5 Throat, 4 Heart, 3 Solar, 2 Sacral, 1 Root
              let leftPercent = 0;
              let topPercent = 0;
              let labelSide: 'above' | 'below' = 'above';
              
              switch(chakra.id) {
                case 7: leftPercent = 10; topPercent = 50; labelSide = 'above'; break;  // Crown (Center)
                case 6: leftPercent = 23; topPercent = 12.5; labelSide = 'below'; break;  // Third Eye (Top) -> (12.5% of 100% height is equivalent to 50px of 400px centered in 600px)
                case 5: leftPercent = 36; topPercent = 87.5; labelSide = 'above'; break;  // Throat (Bottom) -> 87.5%
                case 4: leftPercent = 50; topPercent = 50; labelSide = 'below'; break;  // Heart (Center)
                case 3: leftPercent = 64; topPercent = 12.5; labelSide = 'below'; break;  // Solar (Top)
                case 2: leftPercent = 77; topPercent = 87.5; labelSide = 'above'; break;  // Sacral (Bottom)
                case 1: leftPercent = 90; topPercent = 50; labelSide = 'above'; break;  // Root (Center)
              }

              // Adjust percentages so they perfectly match the SVG path coordinates visually
              // The SVG is 400px tall, centered in the 600px container.
              // Center = 300px (50%).
              // Top = 150px (25%).
              // Bottom = 450px (75%).
              switch(chakra.id) {
                case 7: leftPercent = 10; topPercent = 50; labelSide = 'above'; break;  // Crown (Center)
                case 6: leftPercent = 23; topPercent = 25; labelSide = 'below'; break;  // Third Eye (Top)
                case 5: leftPercent = 36; topPercent = 75; labelSide = 'above'; break;  // Throat (Bottom)
                case 4: leftPercent = 50; topPercent = 50; labelSide = 'below'; break;  // Heart (Center)
                case 3: leftPercent = 64; topPercent = 25; labelSide = 'below'; break;  // Solar (Top)
                case 2: leftPercent = 77; topPercent = 75; labelSide = 'above'; break;  // Sacral (Bottom)
                case 1: leftPercent = 90; topPercent = 50; labelSide = 'above'; break;  // Root (Center)
              }

              return (
                <div 
                  key={chakra.id} 
                  className={`absolute snap-center transition-opacity duration-300 ${opacityClass}`} 
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%`, transform: 'translate(-50%, -50%)' }}
                >
                  


                  {/* Chakra Orb (Node) */}
                  <motion.div 
                    className="relative z-40 cursor-pointer group"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChakraClick(chakra)}
                  >
                    {/* Hover Tooltip (Small Info Popup Box) */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                      <div className="bg-[#0D1B2A] border border-[#00FF9C]/40 rounded-xl p-2.5 text-center shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                        <p className="text-[11px] font-medium text-white/90 leading-snug">
                          {chakra.description}
                        </p>
                      </div>
                      {/* Triangle pointer */}
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#00FF9C]/40 mx-auto"></div>
                    </div>

                    {/* Outer 80px circle */}
                    <div 
                      className="relative w-[80px] h-[80px] flex items-center justify-center rounded-full transition-all duration-300"
                      style={{ 
                        boxShadow: isSelected ? `0 0 25px ${chakra.color}, inset 0 0 15px ${chakra.color}` : `0 0 10px ${chakra.color}40`,
                        background: 'rgba(13, 27, 42, 0.5)',
                        backdropFilter: 'blur(4px)'
                      }}
                    >
                      {/* Inner 56px dark bg */}
                      <div className="absolute w-[56px] h-[56px] rounded-full bg-[#0D1B2A] border border-[#00FF9C]/20 flex items-center justify-center overflow-hidden">
                        
                        {/* Faint geometry behind orb */}
                        <div 
                          className="absolute inset-0 opacity-20 pointer-events-none"
                          style={{ backgroundColor: chakra.color }}
                        />

                        {/* Inner Pulse on Hover */}
                        <motion.div
                          className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-100"
                          style={{ background: chakra.color }}
                          animate={{ scale: [1, 1.2, 1], opacity: [0, 0.6, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        
                        {/* Rotating Symbol */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                          className="relative z-10 w-10 h-10"
                        >
                          <ChakraSymbol chakra={chakra} size={40} />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Chakra Name Underneath */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 flex flex-col items-center whitespace-nowrap pointer-events-none">
                    <span className="text-[#1A5D47] font-bold text-[10px] tracking-widest uppercase">{chakra.sanskrit}</span>
                    <span className="text-[#0D1B2A] font-extrabold text-[15px] tracking-wide mt-0.5">{chakra.name}</span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* View More button */}
        <motion.div
          id="begin-journey-anchor"
          className="flex justify-center mt-12 relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => navigate('/chakra-experience')}
            className="group flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300
                       bg-[#00FF9C]/10 text-[#00FF9C] hover:bg-[#00FF9C]/20 border border-[#00FF9C]/30 shadow-[0_0_15px_rgba(0,255,156,0.1)]"
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>View More</span>
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
