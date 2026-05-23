import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useState, useRef, useCallback, useEffect, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  playSound,
  stopSound,
  getPlayingState,
  subscribe,
  CHAKRA_SOUNDS,
} from '../components/dashboard/chakraSoundEngine';

import chakraRoot    from '../assets/chakras/root.png';
import chakraSacral  from '../assets/chakras/sacral.png';
import chakraSolar   from '../assets/chakras/solar.png';
import chakraHeart   from '../assets/chakras/heart.png';
import chakraThroat  from '../assets/chakras/throat.png';
import chakraThirdEye from '../assets/chakras/thirdeye.png';
import chakraCrown   from '../assets/chakras/crown.png';

/* ─── Data ────────────────────────────────────────────────────────────── */

const CHAKRAS = [
  {
    id: 1,
    name: 'Root',
    sanskrit: 'Muladhara',
    mantra: 'LAM',
    element: 'Earth',
    color: '#DC2626',
    softColor: '#FEF2F2',
    glowColor: 'rgba(220,38,38,0.4)',
    borderColor: 'rgba(220,38,38,0.3)',
    frequency: 396,
    image: chakraRoot,
    meaning: 'The foundation of your entire energy system. Located at the base of the spine, Muladhara anchors you to the physical world, providing the stability and security needed for growth.',
    benefits: [
      'Deep sense of safety and security',
      'Groundedness in daily life',
      'Physical vitality and strength',
      'Ability to face challenges calmly',
      'Financial stability and material balance',
    ],
    healing: 'When balanced, you feel at home in your body and in the world. You walk through life with confidence, knowing you are supported by the earth beneath your feet.',
    meditation: 'Sit firmly on the ground. Close your eyes. Breathe deeply and feel the earth supporting you. Visualize a deep red lotus with four petals glowing at the base of your spine. With each exhale, release fear. With each inhale, draw in stability and strength.',
    breathPattern: { inhale: 4, hold: 4, exhale: 6 },
    gradient: 'from-red-950 via-red-900 to-stone-900',
    accentGrad: 'from-red-600/20 to-red-800/5',
  },
  {
    id: 2,
    name: 'Sacral',
    sanskrit: 'Svadhishthana',
    mantra: 'VAM',
    element: 'Water',
    color: '#EA580C',
    softColor: '#FFF7ED',
    glowColor: 'rgba(234,88,12,0.4)',
    borderColor: 'rgba(234,88,12,0.3)',
    frequency: 417,
    image: chakraSacral,
    meaning: 'The seat of creativity, pleasure, and emotional depth. Located below the navel, Svadhishthana governs your capacity to feel, create, and connect with others on an intimate level.',
    benefits: [
      'Creative inspiration and flow',
      'Healthy emotional expression',
      'Joyful sensory experience',
      'Passionate relationships',
      'Adaptability and flexibility',
    ],
    healing: 'When balanced, life flows like water — you move gracefully through emotions, embrace pleasure without guilt, and create beauty in everything you do.',
    meditation: 'Soften your belly. Breathe into your lower abdomen, just below the navel. Visualize a warm orange lotus with six petals, glowing like sunset over water. Feel creative energy rising within you like a gentle river. Let your emotions flow freely without judgment.',
    breathPattern: { inhale: 4, hold: 2, exhale: 6 },
    gradient: 'from-orange-950 via-orange-900 to-stone-900',
    accentGrad: 'from-orange-500/20 to-orange-800/5',
  },
  {
    id: 3,
    name: 'Solar Plexus',
    sanskrit: 'Manipura',
    mantra: 'RAM',
    element: 'Fire',
    color: '#D97706',
    softColor: '#FFFBEB',
    glowColor: 'rgba(217,119,6,0.4)',
    borderColor: 'rgba(217,119,6,0.3)',
    frequency: 528,
    image: chakraSolar,
    meaning: 'The center of personal power and transformation. Located above the navel, Manipura is the inner fire that fuels your will, confidence, and sense of self.',
    benefits: [
      'Unshakeable self-confidence',
      'Clear personal boundaries',
      'Decisive leadership',
      'Healthy digestive energy',
      'Inner discipline and motivation',
    ],
    healing: 'When balanced, you radiate warmth and authority. You take bold action aligned with your values and trust your instincts completely.',
    meditation: 'Breathe fire into your solar plexus. Visualize a blazing yellow lotus with ten petals, bright as the midday sun. Feel your personal power ignite with each breath. Let any doubt or shame dissolve in this sacred inner flame.',
    breathPattern: { inhale: 4, hold: 4, exhale: 4 },
    gradient: 'from-yellow-950 via-amber-900 to-stone-900',
    accentGrad: 'from-yellow-500/20 to-amber-800/5',
  },
  {
    id: 4,
    name: 'Heart',
    sanskrit: 'Anahata',
    mantra: 'YAM',
    element: 'Air',
    color: '#16A34A',
    softColor: '#F0FDF4',
    glowColor: 'rgba(22,163,74,0.4)',
    borderColor: 'rgba(22,163,74,0.3)',
    frequency: 639,
    image: chakraHeart,
    meaning: 'The bridge between earth and heaven. Located at the center of the chest, Anahata is where your capacity for love, compassion, and forgiveness lives — connecting physical and spiritual realms.',
    benefits: [
      'Unconditional love and compassion',
      'Deep emotional healing',
      'Ability to forgive and release',
      'Harmonious relationships',
      'Inner peace and equanimity',
    ],
    healing: 'When balanced, love flows effortlessly — for yourself and others. You give without depletion and receive without resistance. The world feels safe and beautiful.',
    meditation: 'Place your hands gently on your heart. Breathe deeply into this sacred space. Visualize a radiant green lotus with twelve petals blossoming at your chest. With each breath, let love expand — first for yourself, then radiating outward to all beings.',
    breathPattern: { inhale: 5, hold: 2, exhale: 7 },
    gradient: 'from-green-950 via-green-900 to-stone-900',
    accentGrad: 'from-green-600/20 to-green-800/5',
  },
  {
    id: 5,
    name: 'Throat',
    sanskrit: 'Vishuddha',
    mantra: 'HAM',
    element: 'Ether',
    color: '#2563EB',
    softColor: '#EFF6FF',
    glowColor: 'rgba(37,99,235,0.4)',
    borderColor: 'rgba(37,99,235,0.3)',
    frequency: 741,
    image: chakraThroat,
    meaning: 'The gateway of authentic expression. Located at the throat, Vishuddha governs your ability to speak truth, listen deeply, and communicate with clarity and integrity.',
    benefits: [
      'Authentic self-expression',
      'Clear and confident communication',
      'Creative voice and artistry',
      'Ability to speak your truth',
      'Deep and attentive listening',
    ],
    healing: 'When balanced, your words carry wisdom and healing power. You express yourself authentically without fear, and your voice becomes an instrument of truth.',
    meditation: 'Gently hum with your lips closed. Feel the vibration in your throat. Visualize a luminous blue lotus with sixteen petals glowing at your throat center. Imagine your words as pure light — truthful, kind, and powerful. Release the fear of being heard.',
    breathPattern: { inhale: 4, hold: 2, exhale: 8 },
    gradient: 'from-blue-950 via-blue-900 to-stone-900',
    accentGrad: 'from-blue-600/20 to-blue-800/5',
  },
  {
    id: 6,
    name: 'Third Eye',
    sanskrit: 'Ajna',
    mantra: 'OM',
    element: 'Light',
    color: '#4F46E5',
    softColor: '#EEF2FF',
    glowColor: 'rgba(79,70,229,0.4)',
    borderColor: 'rgba(79,70,229,0.3)',
    frequency: 852,
    image: chakraThirdEye,
    meaning: 'The seat of inner wisdom and perception. Located between the eyebrows, Ajna is the center of intuition, spiritual insight, and the ability to see beyond the physical world.',
    benefits: [
      'Enhanced intuition and insight',
      'Clarity of thought and vision',
      'Vivid and meaningful dreams',
      'Spiritual perception and awareness',
      'Mental focus and concentration',
    ],
    healing: 'When balanced, you trust your inner knowing completely. Your mind is clear, your visions are vivid, and you perceive the subtle energies that connect all of life.',
    meditation: 'Gently close your eyes and focus your attention at the point between your eyebrows. Breathe softly. Visualize a deep indigo lotus with two petals — the left and right hemispheres of mind unifying. Let images arise and pass like clouds. Trust what you see.',
    breathPattern: { inhale: 4, hold: 6, exhale: 6 },
    gradient: 'from-indigo-950 via-indigo-900 to-stone-900',
    accentGrad: 'from-indigo-500/20 to-indigo-800/5',
  },
  {
    id: 7,
    name: 'Crown',
    sanskrit: 'Sahasrara',
    mantra: 'AUM',
    element: 'Consciousness',
    color: '#7C3AED',
    softColor: '#F5F3FF',
    glowColor: 'rgba(124,58,237,0.4)',
    borderColor: 'rgba(124,58,237,0.3)',
    frequency: 963,
    image: chakraCrown,
    meaning: 'The thousand-petaled lotus of divine union. Located at the crown of the head, Sahasrara is where individual consciousness merges with universal awareness — the source of all existence.',
    benefits: [
      'Profound spiritual connection',
      'Sense of oneness with all life',
      'Access to higher wisdom',
      'Transcendence of ego and fear',
      'Deep inner peace and bliss',
    ],
    healing: 'When balanced, you experience reality as sacred. Life becomes a spiritual journey. You feel connected to something far greater than yourself — and in that connection, you find perfect peace.',
    meditation: 'Sit tall. Imagine a stream of pure violet-white light pouring down from the cosmos through the crown of your head. Breathe in this divine light. Feel it dissolving every boundary between yourself and the infinite. You are the universe experiencing itself.',
    breathPattern: { inhale: 6, hold: 6, exhale: 8 },
    gradient: 'from-violet-950 via-purple-900 to-stone-900',
    accentGrad: 'from-violet-500/20 to-purple-800/5',
  },
];

const IMAGES: Record<number, string> = {
  1: chakraRoot, 2: chakraSacral, 3: chakraSolar, 4: chakraHeart,
  5: chakraThroat, 6: chakraThirdEye, 7: chakraCrown,
};

/* ─── Hooks ───────────────────────────────────────────────────────────── */

function usePlayingState() {
  return useSyncExternalStore(subscribe, getPlayingState, getPlayingState);
}

/* ─── Animated breathing circle ──────────────────────────────────────── */

function BreathingCircle({ color, pattern }: {
  color: string;
  pattern: { inhale: number; hold: number; exhale: number };
}) {
  const total = pattern.inhale + pattern.hold + pattern.exhale;
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(pattern.inhale);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current = (current + 1) % total;
      if (current < pattern.inhale) {
        setPhase('inhale');
        setCount(pattern.inhale - current);
      } else if (current < pattern.inhale + pattern.hold) {
        setPhase('hold');
        setCount(pattern.inhale + pattern.hold - current);
      } else {
        setPhase('exhale');
        setCount(total - current);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [pattern, total]);

  const phaseLabels = { inhale: 'Inhale', hold: 'Hold', exhale: 'Exhale' };
  const scales = { inhale: 1.35, hold: 1.35, exhale: 0.85 };
  const durations = { inhale: pattern.inhale, hold: 0.1, exhale: pattern.exhale };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative flex items-center justify-center w-40 h-40">
        {/* Outer pulse rings */}
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border"
            style={{ borderColor: color + '30', width: `${100 + i * 40}%`, height: `${100 + i * 40}%` }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
        {/* Main circle */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: `radial-gradient(circle, ${color}30, ${color}10)`, border: `2px solid ${color}50` }}
          animate={{ scale: scales[phase] }}
          transition={{ duration: durations[phase], ease: 'easeInOut' }}
        />
        {/* Center text */}
        <div className="relative z-10 text-center">
          <div className="text-3xl font-bold text-white">{count}</div>
          <div className="text-xs font-semibold tracking-widest uppercase mt-1" style={{ color }}>
            {phaseLabels[phase]}
          </div>
        </div>
      </div>
      <p className="text-sm text-white/40 tracking-widest">
        {pattern.inhale}s · {pattern.hold}s · {pattern.exhale}s
      </p>
    </div>
  );
}

/* ─── Equalizer bars ──────────────────────────────────────────────────── */

function EqBars({ color }: { color: string }) {
  return (
    <div className="flex items-end gap-[2px] h-3">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i} className="w-[3px] rounded-full"
          style={{ backgroundColor: color }}
          animate={{ height: ['4px', '12px', '6px', '12px', '4px'] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ─── Sound button ────────────────────────────────────────────────────── */

interface ExperienceSoundInfo {
  label: string;
  icon: string;
}

const EXPERIENCE_CHAKRA_SOUNDS: Record<number, ExperienceSoundInfo[]> = {
  1: [
    { label: 'LAM Bija Chant', icon: '🕉️' },
    { label: 'Tibetan Low Hum', icon: '🔔' },
    { label: 'Earthy Bass Vibration', icon: '🌍' },
  ],
  2: [
    { label: 'VAM Bija Chant', icon: '🕉️' },
    { label: 'Feminine Spiritual Chant', icon: '✨' },
    { label: 'Water Flow Mantra', icon: '💧' },
  ],
  3: [
    { label: 'RAM Bija Chant', icon: '🕉️' },
    { label: 'Energetic Fire Mantra', icon: '🔥' },
    { label: 'Warrior Monk Meditation', icon: '⚔️' },
  ],
  4: [
    { label: 'YAM Bija Chant', icon: '🕉️' },
    { label: 'Heart Choir Resonance', icon: '🎶' },
    { label: 'Healing Compassion Chorus', icon: '💚' },
  ],
  5: [
    { label: 'HAM Bija Chant', icon: '🕉️' },
    { label: 'Throat Echo Resonance', icon: '🔮' },
    { label: 'Ether Spiritual Chant', icon: '🌬️' },
  ],
  6: [
    { label: 'OM Sacred Mantra', icon: '🕉️' },
    { label: 'Third Eye Theta Pulse', icon: '👁️' },
    { label: 'Mystical Deep Humming', icon: '🌌' },
  ],
  7: [
    { label: 'AUM Sacred Meditation', icon: '🕉️' },
    { label: 'Angelic Choir EE-AH', icon: '👑' },
    { label: 'Cosmic Divine Hum', icon: '🌟' },
  ],
};

/* ─── Sound button ────────────────────────────────────────────────────── */

function SoundBtn({ info, color, glowColor, isPlaying, onClick }: {
  info: ExperienceSoundInfo; color: string; glowColor: string;
  isPlaying: boolean; onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="relative flex items-center gap-3 w-full rounded-xl px-4 py-3 border cursor-pointer text-left overflow-hidden"
      style={{
        background: isPlaying ? `${color}12` : 'rgba(255,255,255,0.04)',
        borderColor: isPlaying ? color + '50' : 'rgba(255,255,255,0.08)',
        boxShadow: isPlaying ? `0 0 20px ${glowColor}` : 'none',
      }}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.97 }}
    >
      {isPlaying && (
        <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{ opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ background: color }}
        />
      )}
      <span className="text-lg flex-shrink-0">{info.icon}</span>
      <span className="text-sm font-medium flex-1 truncate" style={{ color: isPlaying ? color : 'rgba(255,255,255,0.7)' }}>
        {info.label}
      </span>
      <div className="flex-shrink-0">
        {isPlaying ? <EqBars color={color} /> : (
          <svg className="w-4 h-4 opacity-30" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </div>
    </motion.button>
  );
}

/* ─── Single chakra section ───────────────────────────────────────────── */

function ChakraCard({ chakra, index }: { chakra: typeof CHAKRAS[0]; index: number }) {
  const playing = usePlayingState();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const [showBreath, setShowBreath] = useState(false);

  const handleSound = useCallback((idx: number) => {
    playSound(chakra.id, idx);
  }, [chakra.id]);

  const isEven = index % 2 === 0;

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: `linear-gradient(160deg, #0a0f0d 0%, #0f1410 60%, #060a07 100%)` }}
    >
      {/* Ambient orb */}
      <motion.div
        className="absolute rounded-full blur-[120px] pointer-events-none"
        style={{
          width: 600, height: 600,
          background: chakra.glowColor,
          [isEven ? 'right' : 'left']: '-150px',
          top: '50%', translateY: '-50%',
          opacity: 0.15,
          y,
        }}
      />

      {/* Subtle dot grid */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle, ${chakra.color} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}
      />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-16 py-24">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center ${!isEven ? 'lg:[&>*:first-child]:order-2' : ''}`}>

          {/* ── LEFT / RIGHT: Symbol + Breathing ── */}
          <motion.div
            className="flex flex-col items-center gap-12"
            initial={{ opacity: 0, x: isEven ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Symbol */}
            <div className="relative">
              {/* Multi-ring glow */}
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full blur-xl pointer-events-none"
                  style={{
                    width: `${100 + i * 50}%`, height: `${100 + i * 50}%`,
                    background: chakra.glowColor,
                    top: '50%', left: '50%',
                    translateX: '-50%', translateY: '-50%',
                    opacity: 0.15 / i,
                  }}
                  animate={{ scale: [1, 1.1 + i * 0.05, 1] }}
                  transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
                />
              ))}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="relative z-10"
              >
                <img
                  src={IMAGES[chakra.id]}
                  alt={chakra.sanskrit}
                  width={220}
                  height={220}
                  className="block object-contain drop-shadow-2xl"
                  style={{ filter: `drop-shadow(0 0 40px ${chakra.color}60)`, mixBlendMode: 'screen', background: 'transparent', borderRadius: '50%' }}
                  draggable={false}
                />
              </motion.div>

              {/* Mantra badge */}
              {/* mantra pill removed per request */}
            </div>

            {/* Breathing UI removed per design request */}
          </motion.div>

          {/* ── RIGHT / LEFT: Content ── */}
          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, x: isEven ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
          >
            {/* Header */}
            <div>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-tight"
                style={{ color: chakra.color, fontFamily: "'Cinzel', serif" }}
              >
                {chakra.sanskrit}
              </h2>
              <p className="text-white/40 text-lg font-bold mt-1">{chakra.name} Chakra</p>
            </div>

            {/* Meaning */}
              <div className="rounded-2xl p-6 border" style={{ background: `${chakra.color}08`, borderColor: chakra.borderColor }}>
              <p className="text-white/80 leading-relaxed text-base font-bold">{chakra.meaning}</p>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/30 mb-4">Healing Benefits</h3>
              <ul className="space-y-2.5">
                {chakra.benefits.map((b, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3 text-sm text-white/80 font-semibold"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: chakra.color }} />
                    {b}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Meditation */}
            <div className="rounded-2xl p-6 border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: chakra.color }}>
                Meditation Guidance
              </h3>
              <p className="text-white/70 text-sm leading-relaxed font-semibold">{chakra.meditation}</p>
            </div>

            {/* Soundboard */}
            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/30 mb-4">Mantra Playlist</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(EXPERIENCE_CHAKRA_SOUNDS[chakra.id] ?? []).map((info, idx) => {
                  const isThisPlaying =
                    playing?.chakraId === chakra.id && playing?.soundIndex === idx;
                  return (
                    <SoundBtn
                      key={idx}
                      info={info}
                      color={chakra.color}
                      glowColor={chakra.glowColor}
                      isPlaying={isThisPlaying}
                      onClick={() => handleSound(idx)}
                    />
                  );
                })}
              </div>
              <AnimatePresence>
                {playing?.chakraId === chakra.id && (
                  <motion.div
                    className="mt-3 flex items-center gap-2 text-xs font-medium"
                    style={{ color: chakra.color }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: chakra.color }}
                      animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                    Now playing · {EXPERIENCE_CHAKRA_SOUNDS[chakra.id]?.[playing.soundIndex]?.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient divider */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #080c09)' }}
      />
    </section>
  );
}

/* ─── Sidebar nav dots ────────────────────────────────────────────────── */

function SideNav({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {CHAKRAS.map((c, i) => (
        <motion.button
          key={c.id}
          onClick={() => onSelect(i)}
          className="relative flex items-center justify-end gap-2 group"
          whileHover={{ x: -4 }}
        >
          <AnimatePresence>
            {active === i && (
              <motion.span
                className="text-[10px] font-bold tracking-wider whitespace-nowrap"
                style={{ color: c.color }}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                {c.sanskrit}
              </motion.span>
            )}
          </AnimatePresence>
          <motion.div
            className="rounded-full border-2 transition-all duration-300"
            style={{
              width: active === i ? 14 : 8,
              height: active === i ? 14 : 8,
              borderColor: active === i ? c.color : 'rgba(255,255,255,0.2)',
              background: active === i ? c.color : 'transparent',
              boxShadow: active === i ? `0 0 10px ${c.glowColor}` : 'none',
            }}
          />
        </motion.button>
      ))}
    </div>
  );
}

/* ─── Main page ───────────────────────────────────────────────────────── */

export default function ChakraExperiencePage() {
  const navigate = useNavigate();
  const [activeChakra, setActiveChakra] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Track which chakra is in view
  useEffect(() => {
    const observers = CHAKRAS.map((_, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveChakra(i); },
        { threshold: 0.4 }
      );
      if (sectionRefs.current[i]) obs.observe(sectionRefs.current[i]!);
      return obs;
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToChakra = useCallback((i: number) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Stop audio on unmount
  useEffect(() => () => stopSound(), []);

  // Scroll to top on mount to ensure page starts at the very top (Hero section)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative bg-[#080c09]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Back button */}
      <motion.button
        onClick={() => { stopSound(); navigate('/dashboard/overview?scrollTo=chakra-section'); }}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white/70 border border-white/10 hover:border-white/20 hover:text-white transition-all"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)' }}
        whileHover={{ scale: 1.04, x: -2 }}
        whileTap={{ scale: 0.96 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </motion.button>

      {/* Nirvaha logo */}
      <motion.div
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-full"
        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-white/80 text-sm font-bold tracking-[0.15em]" style={{ fontFamily: "'Cinzel', serif" }}>
          NIRVAHA · 7 CHAKRAS
        </span>
      </motion.div>

      {/* Side nav */}
      <SideNav active={activeChakra} onSelect={scrollToChakra} />

      {/* Hero intro */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #060a07, #0d1410, #08090a)' }}>
        {/* Ambient chakra orbs */}
        {CHAKRAS.map((c, i) => (
          <motion.div
            key={c.id}
            className="absolute rounded-full blur-3xl pointer-events-none"
            style={{
              width: 200, height: 200,
              background: c.glowColor,
              left: `${8 + i * 12.5}%`,
              top: '50%',
              translateY: '-50%',
              opacity: 0.07,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.05, 0.12, 0.05] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        <motion.div
          className="relative z-10 flex flex-col items-center text-center px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Rainbow chakra strip */}
          <div className="flex items-center gap-2 mb-8">
            {CHAKRAS.map((c) => (
              <motion.button
                key={c.id}
                onClick={() => scrollToChakra(c.id - 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: c.color + '20', border: `1.5px solid ${c.color}40` }}
                whileHover={{ scale: 1.2, boxShadow: `0 0 16px ${c.glowColor}` }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
              </motion.button>
            ))}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6"
            style={{ fontFamily: "'Cinzel', serif" }}>
            7 Chakras
            <br />
            <span className="bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Experience
            </span>
          </h1>
          <p className="text-white/40 text-lg max-w-xl leading-relaxed mb-10">
            Journey through the seven sacred energy centers. Explore their wisdom,
            heal through sound, and awaken your highest self.
          </p>

          <motion.button
            onClick={() => scrollToChakra(0)}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #DC2626, #7C3AED)', boxShadow: '0 8px 32px rgba(124,58,237,0.3)' }}
            whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(124,58,237,0.4)' }}
            whileTap={{ scale: 0.96 }}
          >
            Begin Journey
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #080c09)' }}
        />
      </section>

      {/* Chakra sections */}
      {CHAKRAS.map((chakra, i) => (
        <div key={chakra.id} ref={(el) => { sectionRefs.current[i] = el as HTMLElement | null; }}>
          <ChakraCard chakra={chakra} index={i} />
        </div>
      ))}

      {/* Closing section */}
      <section className="relative py-32 flex flex-col items-center text-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #080c09, #0a0f0d)' }}>
        <motion.div
          className="absolute rounded-full blur-[160px] pointer-events-none"
          style={{ width: 600, height: 600, background: 'rgba(124,58,237,0.1)', top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="relative z-10 max-w-2xl mx-auto px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
            Your Journey Continues
          </h2>
          <p className="text-white/40 leading-relaxed mb-10">
            The chakras are not a destination but a living map of your inner world.
            Return often. Listen deeply. Let the healing unfold.
          </p>
          <motion.button
            onClick={() => { stopSound(); navigate('/dashboard/overview?scrollTo=chakra-section'); }}
            className="px-8 py-3.5 rounded-full font-semibold text-sm border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-all"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Return to Dashboard
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
