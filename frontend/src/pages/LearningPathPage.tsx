import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  ChevronLeft, BookOpen, Clock, CheckCircle2, Lock, ChevronDown,
  Sparkles, Brain, Heart, Users, Zap, Award, Quote,
  PlayCircle, PenLine, Trophy, ArrowRight, Star,
  Headphones, Leaf, Target,
} from 'lucide-react';
import learningPathsData from '../data/learningPaths.json';

const { learningPaths } = learningPathsData;

/* ─────────────────── constants ─────────────────── */

const PATH_ICONS: Record<string, React.ReactNode> = {
  'emotional-awareness-foundations':    <Brain className="w-7 h-7" />,
  'conscious-communication':            <Users className="w-7 h-7" />,
  'inner-balance-emotional-stability':  <Heart className="w-7 h-7" />,
  'reflective-thinking-self-awareness': <Sparkles className="w-7 h-7" />,
  'mindful-digital-living':             <Zap className="w-7 h-7" />,
  'emotional-intelligence-for-students':<Star className="w-7 h-7" />,
  'workplace-emotional-intelligence':   <BookOpen className="w-7 h-7" />,
  'calm-leadership-presence':           <Sparkles className="w-7 h-7" />,
  'reflection-journaling-mastery':      <PenLine className="w-7 h-7" />,
  'relationships-emotional-connection': <Heart className="w-7 h-7" />,
  'ai-reflection-companion-mastery':    <Brain className="w-7 h-7" />,
  'conscious-growth-journey':           <Star className="w-7 h-7" />,
};

const MODULE_NAMES: Record<string, string[]> = {
  'emotional-awareness-foundations':    ['Emotional Awareness', 'Self Observation', 'Emotional Patterns', 'Reflective Practices'],
  'conscious-communication':            ['Foundations of Dialogue', 'Empathic Listening', 'Conflict Navigation', 'Authentic Expression'],
  'inner-balance-emotional-stability':  ['Grounding Techniques', 'Resilience Building', 'Stability Practices', 'Integration'],
  'reflective-thinking-self-awareness': ['Metacognition', 'Values Mapping', 'Narrative Therapy', 'Conscious Decisions'],
  'mindful-digital-living':             ['Digital Audit', 'Intentional Use', 'Tech-Free Rituals', 'Sustainable Balance'],
  'reflection-journaling-mastery':      ['The Writing Mind', 'Structured Prompts', 'Pattern Recognition', 'Narrative Mastery'],
};

const UNIT_TYPE_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  reading:     { icon: <BookOpen className="w-3.5 h-3.5" />,   label: 'Reading',         color: '#60a5fa', bg: 'rgba(96,165,250,0.12)'  },
  reflection:  { icon: <PenLine className="w-3.5 h-3.5" />,    label: 'Reflection',      color: '#c084fc', bg: 'rgba(192,132,252,0.12)' },
  activity:    { icon: <Headphones className="w-3.5 h-3.5" />, label: 'Audio Session',   color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
  quiz:        { icon: <Target className="w-3.5 h-3.5" />,     label: 'Assessment',      color: '#fbbf24', bg: 'rgba(251,191,36,0.12)'  },
  mindfulness: { icon: <Leaf className="w-3.5 h-3.5" />,       label: 'Mindfulness',     color: '#86efac', bg: 'rgba(134,239,172,0.12)' },
};

const DEFAULT_MODULES = [
  {
    id: 'mod-1', title: 'Module 1: Foundations',
    description: 'Build a strong conceptual base and develop situational awareness.',
    units: [
      { id: 'u1',  title: 'Introduction & Core Concepts',    type: 'reading',     xp: 50,  locked: false },
      { id: 'u2',  title: 'Reflective Exercise: First Look', type: 'reflection',  xp: 75,  locked: false },
      { id: 'u3',  title: 'Guided Mindfulness Practice',     type: 'mindfulness', xp: 100, locked: false },
      { id: 'u4',  title: 'Foundations Assessment',          type: 'quiz',        xp: 50,  locked: false },
    ],
  },
  {
    id: 'mod-2', title: 'Module 2: Deep Dive',
    description: 'Explore intermediate concepts and strengthen your practice.',
    units: [
      { id: 'u5',  title: 'Advanced Patterns & Signals',     type: 'reading',     xp: 75,  locked: false },
      { id: 'u6',  title: 'Immersive Audio Session',         type: 'activity',    xp: 125, locked: false },
      { id: 'u7',  title: 'Journaling Prompt: Go Deeper',   type: 'reflection',  xp: 100, locked: true  },
      { id: 'u8',  title: 'Module Assessment',              type: 'quiz',        xp: 75,  locked: true  },
    ],
  },
  {
    id: 'mod-3', title: 'Module 3: Applied Practice',
    description: 'Apply your learning in real-world contexts and build lasting habits.',
    units: [
      { id: 'u9',  title: 'Real-World Application Guide',   type: 'reading',     xp: 100, locked: true },
      { id: 'u10', title: 'Deep Mindfulness Practice',      type: 'mindfulness', xp: 150, locked: true },
      { id: 'u11', title: 'Reflection: What Has Changed?',  type: 'reflection',  xp: 125, locked: true },
      { id: 'u12', title: 'Final Knowledge Check',          type: 'quiz',        xp: 100, locked: true },
    ],
  },
  {
    id: 'mod-4', title: 'Module 4: Integration & Certification',
    description: 'Bring it all together and earn your Nirvaha certificate.',
    units: [
      { id: 'u13', title: 'Synthesis: Your Growth Story',  type: 'reading',     xp: 150, locked: true },
      { id: 'u14', title: 'Capstone Audio Reflection',     type: 'activity',    xp: 200, locked: true },
      { id: 'u15', title: 'Certification Assessment',      type: 'quiz',        xp: 300, locked: true },
    ],
  },
];

const REFLECTION_QUOTES: Record<string, { text: string; author: string }> = {
  'emotional-awareness-foundations': {
    text: 'Between stimulus and response there is a space. In that space is our power to choose our response. In our response lies our growth and our freedom.',
    author: 'Viktor E. Frankl',
  },
  'conscious-communication': {
    text: 'The biggest communication problem is we do not listen to understand. We listen to reply.',
    author: 'Stephen R. Covey',
  },
  'inner-balance-emotional-stability': {
    text: 'You don\'t have to control your thoughts. You just have to stop letting them control you.',
    author: 'Dan Millman',
  },
  default: {
    text: 'The quieter you become, the more you are able to hear. Stillness is where creativity and solutions to problems are found.',
    author: 'Rumi',
  },
};

const OUTCOMES: Record<string, string[]> = {
  'emotional-awareness-foundations': [
    'Identify and name your emotional states with clarity',
    'Understand the neurological basis of emotions',
    'Develop daily self-observation habits',
    'Map personal emotional patterns and triggers',
  ],
  'conscious-communication': [
    'Practice empathic, non-reactive listening',
    'Express emotions clearly and constructively',
    'De-escalate conflict with calm dialogue',
    'Build trust through authentic presence',
  ],
  'inner-balance-emotional-stability': [
    'Use breathwork for real-time grounding',
    'Build emotional resilience under stress',
    'Establish sustainable stability habits',
    'Recover faster from emotional disruptions',
  ],
  'reflective-thinking-self-awareness': [
    'Develop metacognitive observation skills',
    'Map personal values and blind spots',
    'Use narrative therapy for self-understanding',
    'Make more conscious, deliberate decisions',
  ],
  'mindful-digital-living': [
    'Audit and redesign screen-time patterns',
    'Create tech-free rituals for mental clarity',
    'Reduce digital overstimulation and anxiety',
    'Build a healthier relationship with technology',
  ],
  'emotional-intelligence-for-students': [
    'Develop focus and emotional regulation for study',
    'Build confidence and peer communication skills',
    'Manage academic stress with proven techniques',
    'Cultivate a growth mindset for lifelong learning',
  ],
  'workplace-emotional-intelligence': [
    'Navigate workplace dynamics with emotional skill',
    'Lead teams with empathy and calm authority',
    'Prevent burnout with sustainable work practices',
    'Build a psychologically safe team culture',
  ],
  'calm-leadership-presence': [
    'Lead from a place of centeredness and vision',
    'Develop a non-reactive leadership presence',
    'Make high-stakes decisions with equanimity',
    'Inspire loyalty through compassionate authority',
  ],
  'reflection-journaling-mastery': [
    'Build a consistent, transformative journaling practice',
    'Use structured prompts for emotional insight',
    'Extract patterns and meaning from your writing',
    'Deepen self-knowledge through narrative reflection',
  ],
  'relationships-emotional-connection': [
    'Understand and work with attachment styles',
    'Practice deep listening in intimate relationships',
    'Set healthy emotional boundaries with compassion',
    'Cultivate shared growth in partnerships',
  ],
  'ai-reflection-companion-mastery': [
    'Use AI-guided prompts for emotional reflection',
    'Track emotional growth patterns over time',
    'Combine human intuition with AI insights',
    'Build a personalized AI wellness practice',
  ],
  'conscious-growth-journey': [
    'Clarify personal identity and core values',
    'Align daily life with deeper purpose',
    'Navigate major life transitions with awareness',
    'Design a sustainable personal transformation plan',
  ],
};

/* ─────────────────── Mandala Illustration ─────────────────── */
const EmotionalMandala: React.FC = () => (
  <div className="relative w-full min-h-[500px] flex items-center justify-center select-none">

    {/* Outermost soft glow */}
    <div className="absolute w-[500px] h-[500px] rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(15,122,85,0.06) 0%, transparent 70%)' }} />

    {/* Ring 1 – slow clockwise */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
      className="absolute rounded-full"
      style={{ width: 440, height: 440, border: '1px dashed rgba(15,122,85,0.2)' }}
    />

    {/* Ring 2 – counter-clockwise, with orbital dots */}
    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      className="absolute rounded-full"
      style={{ width: 330, height: 330, border: '1px solid rgba(15,122,85,0.15)' }}
    >
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: 8, height: 8,
            background: '#0f7a55',
            boxShadow: '0 0 10px rgba(15,122,85,1)',
            top: '50%', left: '50%',
            transform: `rotate(${deg}deg) translateX(165px) translateY(-4px)`,
          }} />
      ))}
    </motion.div>

    {/* Ring 3 – dotted, slow */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      className="absolute rounded-full"
      style={{ width: 230, height: 230, border: '1px dotted rgba(15,122,85,0.25)' }}
    >
      {[0, 120, 240].map((deg, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: 6, height: 6,
            background: '#34d399',
            boxShadow: '0 0 8px rgba(52,211,153,0.9)',
            top: '50%', left: '50%',
            transform: `rotate(${deg}deg) translateX(115px) translateY(-3px)`,
          }} />
      ))}
    </motion.div>

    {/* Inner glow core */}
    <motion.div
      animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute rounded-full flex items-center justify-center"
      style={{
        width: 130, height: 130,
        background: 'radial-gradient(circle, rgba(15,122,85,0.45) 0%, rgba(15,122,85,0.1) 60%, transparent 100%)',
        boxShadow: '0 0 50px rgba(15,122,85,0.4), 0 0 100px rgba(15,122,85,0.15)',
      }}
    >
      <Brain className="w-12 h-12" style={{ color: '#0f7a55' }} />
    </motion.div>

    {/* Floating concept chips */}
    {[
      { label: '🧠 Awareness', style: { top: '10%',  left: '58%'  }, delay: 0   },
      { label: '🌊 Clarity',   style: { top: '76%',  left: '62%'  }, delay: 1   },
      { label: '🌿 Growth',    style: { top: '68%',  left: '6%'   }, delay: 2   },
      { label: '✨ Peace',     style: { top: '12%',  left: '10%'  }, delay: 1.5 },
    ].map(({ label, style, delay }) => (
      <motion.div
        key={label}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
        className="absolute px-3 py-1.5 rounded-full text-xs font-semibold"
        style={{
          ...style,
          background: 'rgba(255,255,255,0.75)',
          border: '1px solid rgba(15,122,85,0.3)',
          color: '#2d6a4f',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          letterSpacing: '0.03em',
        }}
      >
        {label}
      </motion.div>
    ))}

    {/* Connecting SVG lines */}
    <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.12 }}>
      <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="#0f7a55" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="#0f7a55" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="#0f7a55" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="#0f7a55" strokeWidth="1" strokeDasharray="4 4" />
    </svg>
  </div>
);

/* ─────────────────── GLASS styles ─────────────────── */
const glass = {
  background: 'rgba(255,255,255,0.7)',
  border: '1px solid rgba(16,185,129,0.15)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.75)',
} as React.CSSProperties;

const glassAccent = {
  background: 'rgba(15,122,85,0.06)',
  border: '1px solid rgba(15,122,85,0.2)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
} as React.CSSProperties;

/* ─────────────────── Main Component ─────────────────── */
const LearningPathPage: React.FC = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openModules, setOpenModules] = useState<Set<string>>(new Set(['mod-1']));
  const [completedUnits, setCompletedUnits] = useState<Set<string>>(new Set());

  const currentStreak = user?.stats?.streak ?? 0;

  const getWeeklyActivity = () => {
    const activityLog = user?.stats?.activityLog || [];
    // Get start of the current week (Monday)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, ...
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMonday);
    
    // Generate date strings for Monday to Sunday
    const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    return daysOfWeek.map((dayName, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      const dateStr = d.toISOString().split('T')[0];
      const isCompleted = activityLog.includes(dateStr);
      return {
        dayName,
        isCompleted,
      };
    });
  };

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const path = learningPaths.find((p) => p.id === pathId);

  if (!path) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: '#f0fdf8', color: '#0a1a12' }}>
        <div className="text-center">
          <p className="mb-4" style={{ color: '#1a4a2e' }}>Learning path not found.</p>
          <button onClick={() => navigate('/learn')}
            className="font-semibold hover:underline" style={{ color: '#0f7a55' }}>
            ← Back to catalog
          </button>
        </div>
      </div>
    );
  }

  const icon         = PATH_ICONS[path.id] ?? <BookOpen className="w-7 h-7" />;
  const modules      = DEFAULT_MODULES;
  const moduleNames  = MODULE_NAMES[path.id] ?? [];
  const outcomes     = OUTCOMES[path.id] ?? [];
  const quote        = REFLECTION_QUOTES[path.id] ?? REFLECTION_QUOTES.default;
  const totalXP      = modules.flatMap(m => m.units).reduce((s, u) => s + u.xp, 0);
  const totalUnits   = modules.flatMap(m => m.units).length;
  const earnedXP     = modules.flatMap(m => m.units).filter(u => completedUnits.has(u.id)).reduce((s, u) => s + u.xp, 0);
  const progressPct  = totalUnits > 0 ? Math.round((completedUnits.size / totalUnits) * 100) : 0;

  const toggleModule = (id: string) => {
    setOpenModules(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleUnit = (id: string) => {
    setCompletedUnits(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const circumference = 2 * Math.PI * 52;

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: 'linear-gradient(135deg, #f0fdf8 0%, #ecfdf5 50%, #f7fffe 100%)', fontFamily: "'Inter', 'Poppins', sans-serif", color: '#0a1a12' }}
    >
      {/* ── Ambient background orbs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-60 -left-40 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(15,122,85,0.07) 0%, transparent 65%)' }} />
        <div className="absolute top-1/2 -right-20 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(15,122,85,0.04) 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 65%)' }} />
        {/* Floating micro-particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div key={i}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 5 + i * 1.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
            className="absolute rounded-full"
            style={{
              width: 3 + (i % 3), height: 3 + (i % 3),
              background: '#0f7a55',
              boxShadow: '0 0 6px rgba(15,122,85,0.8)',
              left: `${10 + i * 11}%`,
              top: `${15 + (i % 5) * 16}%`,
            }} />
        ))}
      </div>

      {/* ── Back button ── */}
      <motion.button
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
        onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate('/learn'); }}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full group transition-all"
        style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}
      >
        <ChevronLeft className="w-4 h-4 text-[#6b9e7a] group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#2d6a4f' }}>All Paths</span>
      </motion.button>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">

        {/* ══════════════════════════════ HERO ══════════════════════════════ */}
        <section className="min-h-screen flex items-center pt-24 pb-16">
          <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-16 items-center">

            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs mb-8 tracking-wide" style={{ color: '#2e5040' }}>
                <span>Nirvaha Academy</span>
                <span className="opacity-40">/</span>
                <span style={{ color: '#0f7a55' }}>Learning Paths</span>
                <span className="opacity-40">/</span>
                <span className="truncate max-w-[200px]" style={{ color: '#1a4a2e' }}>{path.title}</span>
              </div>

              {/* Badge row */}
              <div className="flex flex-wrap items-center gap-3 mb-10">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>
                  {path.skillLevel}
                </span>
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(255,255,255,0.75)', color: '#2d6a4f', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <Clock className="w-3 h-3" /> {path.duration}
                </span>
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(255,255,255,0.75)', color: '#2d6a4f', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <Sparkles className="w-3 h-3" /> {totalXP} XP
                </span>
              </div>

              {/* Main headline */}
              <div className="mb-8">
                {path.title.split(' ').map((word, i, arr) => (
                  <motion.div
                    key={word + i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 + i * 0.08 }}
                  >
                    <span
                      className="block font-black leading-[0.95] tracking-tight"
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 'clamp(2.8rem, 5.5vw, 5.2rem)',
                        color: i >= arr.length - 1 ? '#0f7a55' : '#0a1a12',
                        textShadow: 'none',
                      }}
                    >
                      {word}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}
                className="text-base leading-[1.9] mb-10 max-w-[500px]"
                style={{ color: '#5c7868' }}
              >
                {path.description}
              </motion.p>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75, duration: 0.8 }}
                className="flex flex-wrap gap-8 mb-12"
              >
                {[
                  { icon: <BookOpen className="w-4 h-4" />, label: `${modules.length} Modules` },
                  { icon: <PlayCircle className="w-4 h-4" />, label: `${totalUnits} Units` },
                  { icon: <Award className="w-4 h-4" />, label: 'Certificate' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2 text-sm font-medium" style={{ color: '#1a4a2e' }}>
                    <span style={{ color: '#0f7a55' }}>{s.icon}</span>
                    {s.label}
                  </div>
                ))}
              </motion.div>

              {/* CTA button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }}
              >
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/learn/${pathId}/play`)}
                  className="flex items-center gap-3 px-9 py-4 rounded-full font-bold text-sm tracking-wider"
                  style={{
                    background: 'linear-gradient(135deg, #0f7a55 0%, #1a9c6d 100%)',
                    color: '#fff',
                    boxShadow: '0 0 30px rgba(15,122,85,0.55), 0 0 70px rgba(15,122,85,0.15)',
                    letterSpacing: '0.06em',
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Begin Your Journey
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right: Mandala illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="hidden lg:block"
            >
              <EmotionalMandala />
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════ PROGRESS CARDS ══════════════════════════════ */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1 – Circular Progress */}
            <motion.div
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="rounded-[28px] p-8 flex flex-col items-center" style={glass}
            >
              <p className="text-xs font-bold tracking-widest uppercase mb-6" style={{ color: '#2e5040' }}>
                Journey Progress
              </p>
              <div className="relative w-36 h-36 mb-5">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="8" />
                  <motion.circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke="url(#grad1)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset: circumference * (1 - progressPct / 100) }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    style={{ filter: 'drop-shadow(0 0 8px rgba(15,122,85,0.7))' }}
                  />
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0f7a55" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black" style={{ color: '#0a1a12' }}>{progressPct}%</span>
                  <span className="text-xs font-medium mt-0.5" style={{ color: '#2e5040' }}>complete</span>
                </div>
              </div>
              <p className="text-sm font-semibold mb-4" style={{ color: '#1a4a2e' }}>
                {completedUnits.size} / {totalUnits} units done
              </p>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.6)' }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #0f7a55, #34d399)', boxShadow: '0 0 10px rgba(15,122,85,0.6)' }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </div>
            </motion.div>

            {/* Card 2 – XP */}
            <motion.div
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }}
              className="rounded-[28px] p-8" style={glass}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(15,122,85,0.15)', border: '1px solid rgba(15,122,85,0.3)' }}>
                  <Sparkles className="w-5 h-5" style={{ color: '#0f7a55' }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#2e5040' }}>XP Earned</p>
                  <p className="font-black text-2xl" style={{ color: '#0a1a12' }}>
                    {earnedXP}
                    <span className="text-sm font-medium ml-1" style={{ color: '#2e5040' }}>/ {totalXP}</span>
                  </p>
                </div>
              </div>

              <div className="w-full h-2.5 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.6)' }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #0f7a55, #34d399)', boxShadow: '0 0 12px rgba(15,122,85,0.6)' }}
                  animate={{ width: `${totalXP > 0 ? (earnedXP / totalXP) * 100 : 0}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs mb-6" style={{ color: '#2e5040' }}>{totalXP - earnedXP} XP remaining</p>

              <div className="space-y-3.5">
                {[
                  { label: 'Duration', value: path.duration },
                  { label: 'Level',    value: path.skillLevel },
                  { label: 'Modules', value: `${modules.length} total` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-xs font-medium" style={{ color: '#2e5040' }}>{label}</span>
                    <span className="text-xs font-bold" style={{ color: '#2d6a4f' }}>{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 flex items-center gap-2 text-xs border-t"
                style={{ borderColor: 'rgba(255,255,255,0.6)', color: '#2e5040' }}>
                <Trophy className="w-3.5 h-3.5" style={{ color: '#0f7a55' }} />
                Certificate on completion
              </div>
            </motion.div>

            {/* Card 3 – Streak */}
            <motion.div
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
              className="rounded-[28px] p-8 relative overflow-hidden" style={glass}
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)' }} />

              <div className="flex items-center gap-3 mb-6">
                <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <span className="text-4xl">🔥</span>
                </motion.span>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#2e5040' }}>
                    Learning Streak
                  </p>
                  <p className="font-black text-3xl" style={{ color: '#0a1a12' }}>
                    {currentStreak} <span className="text-sm font-medium" style={{ color: '#2e5040' }}>days</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-1.5 mb-6">
                {getWeeklyActivity().map((dayInfo, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                      style={{
                        background: dayInfo.isCompleted ? 'rgba(15,122,85,0.15)' : 'rgba(255,255,255,0.7)',
                        border: `1px solid ${dayInfo.isCompleted ? 'rgba(15,122,85,0.4)' : 'rgba(255,255,255,0.06)'}`,
                        color: dayInfo.isCompleted ? '#0f7a55' : '#233528',
                        boxShadow: dayInfo.isCompleted ? '0 0 8px rgba(15,122,85,0.2)' : 'none',
                        fontSize: '10px',
                      }}>
                      {dayInfo.isCompleted ? '✓' : dayInfo.dayName}
                    </div>
                    <span style={{ color: '#0a1a12', fontSize: '9px' }}>{dayInfo.dayName}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-[14px] p-3" style={{ background: 'rgba(15,122,85,0.06)', border: '1px solid rgba(15,122,85,0.12)' }}>
                <p className="text-xs leading-relaxed" style={{ color: '#1a4a2e' }}>
                  Keep going! You're on a <span style={{ color: '#0f7a55', fontWeight: 700 }}>{currentStreak}-day streak</span> 🌿 One more day to unlock a new badge.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════ REFLECTION QUOTE ══════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9 }}
          className="mb-16 rounded-[32px] px-10 py-14 relative overflow-hidden"
          style={glassAccent}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(15,122,85,0.08) 0%, transparent 65%)' }} />
          <div className="absolute top-8 left-10 opacity-[0.07]">
            <Quote className="w-20 h-20" style={{ color: '#0f7a55' }} />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <p className="text-xs font-bold tracking-widest uppercase mb-6" style={{ color: '#2e5040' }}>
              Daily Reflection
            </p>
            <p className="text-xl md:text-2xl font-light leading-[1.8] mb-8 italic"
              style={{ color: '#0a1a12', fontFamily: "'Georgia', serif" }}>
              "{quote.text}"
            </p>
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: '#2e5040' }}>
              — {quote.author}
            </p>
          </div>
        </motion.section>

        {/* ══════════════════════════════ WHAT YOU'LL CULTIVATE ══════════════════════════════ */}
        {outcomes.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="mb-16 rounded-[32px] p-8 lg:p-12" style={glass}
          >
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3" style={{ color: '#0a1a12', fontFamily: "'Poppins', sans-serif" }}>
              <Sparkles className="w-6 h-6" style={{ color: '#0f7a55' }} />
              What you'll cultivate
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {outcomes.map((o, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="flex items-start gap-3 p-4 rounded-[16px] transition-all"
                  style={{ background: 'rgba(15,122,85,0.05)', border: '1px solid rgba(15,122,85,0.1)' }}
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(15,122,85,0.2)', boxShadow: '0 0 8px rgba(15,122,85,0.3)' }}>
                    <CheckCircle2 className="w-3 h-3" style={{ color: '#0f7a55' }} />
                  </div>
                  <span className="text-sm leading-relaxed" style={{ color: '#2e5040' }}>{o}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ══════════════════════════════ TIMELINE COURSE STRUCTURE ══════════════════════════════ */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-black mb-2" style={{ color: '#0a1a12', fontFamily: "'Poppins', sans-serif" }}>
              Your Learning Path
            </h2>
            <p className="text-sm" style={{ color: '#2e5040' }}>
              {modules.length} modules · {totalUnits} units · {totalXP} total XP
            </p>
          </motion.div>

          <div className="relative">
            {/* Vertical timeline connector */}
            <div className="absolute left-[23px] top-6 bottom-6 w-px hidden md:block"
              style={{ background: 'linear-gradient(to bottom, rgba(15,122,85,0.5) 0%, rgba(15,122,85,0.05) 100%)' }} />

            <div className="space-y-5">
              {modules.map((mod, mIdx) => {
                const isOpen     = openModules.has(mod.id);
                const modDone    = mod.units.filter(u => completedUnits.has(u.id)).length;
                const modName    = moduleNames[mIdx] ?? mod.title;
                const isComplete = modDone === mod.units.length && mod.units.length > 0;
                const isActive   = mIdx === 0 || modules.slice(0, mIdx).some(() => true); // always clickable

                return (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.65, delay: mIdx * 0.1 }}
                    className="flex gap-5 md:gap-8"
                  >
                    {/* Timeline node */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.95 }}
                        onClick={() => toggleModule(mod.id)}
                        className="relative w-12 h-12 rounded-full flex items-center justify-center font-black text-sm z-10 transition-all"
                        style={{
                          background: isComplete
                            ? 'linear-gradient(135deg, #0f7a55, #34d399)'
                            : isActive
                              ? 'rgba(15,122,85,0.18)'
                              : 'rgba(255,255,255,0.75)',
                          border: isComplete
                            ? 'none'
                            : `1px solid ${isActive ? 'rgba(15,122,85,0.5)' : 'rgba(16,185,129,0.15)'}`,
                          color: isComplete ? '#fff' : isActive ? '#0f7a55' : '#233528',
                          boxShadow: isActive || isComplete
                            ? '0 0 20px rgba(15,122,85,0.35), 0 0 40px rgba(15,122,85,0.1)'
                            : 'none',
                        }}
                      >
                        {isComplete ? <CheckCircle2 className="w-5 h-5" /> : mIdx + 1}
                      </motion.button>
                    </div>

                    {/* Module glass card */}
                    <div className="flex-1 min-w-0 pb-2">
                      <motion.div
                        className="rounded-[24px] overflow-hidden transition-all duration-300"
                        style={{
                          ...glass,
                          border: `1px solid ${isActive ? 'rgba(15,122,85,0.22)' : 'rgba(255,255,255,0.06)'}`,
                          boxShadow: isActive
                            ? '0 20px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.75), 0 0 0 1px rgba(15,122,85,0.08)'
                            : '0 10px 30px rgba(0,0,0,0.3)',
                        }}
                      >
                        {/* Module header */}
                        <button
                          onClick={() => toggleModule(mod.id)}
                          className="w-full flex items-center gap-4 px-6 py-5 text-left transition-all hover:bg-white/[0.02]"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2.5 mb-2">
                              <span className="text-[10px] font-bold tracking-widest uppercase"
                                style={{ color: '#2e5040' }}>
                                Module {mIdx + 1}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                style={{ background: 'rgba(15,122,85,0.1)', color: '#0f7a55', border: '1px solid rgba(15,122,85,0.15)' }}>
                                {modDone}/{mod.units.length} units
                              </span>
                              {isComplete && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                                  style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>
                                  ✓ Complete
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-black mb-1 tracking-tight" style={{ color: '#0a1a12', fontFamily: "'Poppins', sans-serif" }}>
                              {modName}
                            </h3>
                            <p className="text-xs leading-relaxed" style={{ color: '#2e5040' }}>
                              {mod.description}
                            </p>
                          </div>
                          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                            <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: '#2e5040' }} />
                          </motion.div>
                        </button>

                        {/* Units list */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6 border-t space-y-2"
                                style={{ borderColor: 'rgba(255,255,255,0.6)', paddingTop: '20px' }}>
                                {mod.units.map((unit, uIdx) => {
                                  const tc   = UNIT_TYPE_CONFIG[unit.type] ?? UNIT_TYPE_CONFIG.reading;
                                  const done = completedUnits.has(unit.id);

                                  return (
                                    <motion.div
                                      key={unit.id}
                                      initial={{ opacity: 0, x: -8 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.3, delay: uIdx * 0.05 }}
                                      onClick={() => !unit.locked && toggleUnit(unit.id)}
                                      className="flex items-center gap-3.5 px-4 py-3 rounded-[14px] transition-all group"
                                      style={{
                                        background: done
                                          ? 'rgba(15,122,85,0.08)'
                                          : unit.locked
                                            ? 'rgba(255,255,255,0.01)'
                                            : 'rgba(255,255,255,0.025)',
                                        border: `1px solid ${done ? 'rgba(15,122,85,0.2)' : unit.locked ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.6)'}`,
                                        opacity: unit.locked && !done ? 0.38 : 1,
                                        cursor: unit.locked ? 'not-allowed' : 'pointer',
                                      }}
                                    >
                                      {/* Status indicator */}
                                      {done
                                        ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#0f7a55' }} />
                                        : unit.locked
                                          ? <Lock className="w-4 h-4 flex-shrink-0" style={{ color: '#1e3028' }} />
                                          : <div className="w-4 h-4 rounded-full border flex-shrink-0 group-hover:border-[#0f7a55] transition-colors"
                                              style={{ borderColor: 'rgba(255,255,255,0.12)' }} />
                                      }

                                      {/* Type pill */}
                                      <span className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full flex-shrink-0 font-bold tracking-wide"
                                        style={{ background: tc.bg, color: tc.color }}>
                                        {tc.icon}
                                        {tc.label}
                                      </span>

                                      {/* Title */}
                                      <span className="text-sm flex-1 min-w-0 truncate transition-colors"
                                        style={{
                                          color: done ? '#5c7868' : '#0a1a12',
                                          textDecoration: done ? 'line-through' : 'none',
                                        }}>
                                        {unit.title}
                                      </span>

                                      {/* XP */}
                                      <span className="flex items-center gap-1 text-xs flex-shrink-0 font-semibold"
                                        style={{ color: '#2e5040' }}>
                                        <Sparkles className="w-3 h-3" style={{ color: '#0f7a55' }} />
                                        {unit.xp} XP
                                      </span>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════ BOTTOM CTA ══════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9 }}
          className="mb-24 rounded-[36px] p-12 lg:p-16 text-center relative overflow-hidden"
          style={glassAccent}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(15,122,85,0.12) 0%, transparent 60%)' }} />
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
            <Trophy className="w-14 h-14 mx-auto mb-6" style={{ color: '#0f7a55', opacity: 0.85 }} />
          </motion.div>
          <h3 className="text-4xl font-black mb-4 tracking-tight"
            style={{ color: '#0a1a12', fontFamily: "'Poppins', sans-serif" }}>
            Ready to Begin?
          </h3>
          <p className="mb-10 max-w-md mx-auto text-base leading-relaxed" style={{ color: '#0f7a55' }}>
            Complete all modules, earn your XP, and receive a Nirvaha certificate on this path.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/learn/${pathId}/play`)}
              className="flex items-center gap-2.5 px-9 py-4 rounded-full font-bold text-sm tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #0f7a55, #1a9c6d)',
                color: '#fff',
                boxShadow: '0 0 30px rgba(15,122,85,0.45)',
                letterSpacing: '0.05em',
              }}
            >
              <PlayCircle className="w-4 h-4" />
              Start Learning
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate('/learn'); }}
              className="flex items-center gap-2.5 px-9 py-4 rounded-full font-bold text-sm"
              style={{
                background: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#1a4a2e',
              }}
            >
              <ArrowRight className="w-4 h-4" />
              Browse Other Paths
            </motion.button>
          </div>
        </motion.section>

      </div>
    </div>
  );
};

export default LearningPathPage;
