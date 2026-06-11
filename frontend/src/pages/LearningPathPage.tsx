import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useEnrollment } from '../hooks/useEnrollment';
import {
  ChevronLeft, BookOpen, Clock, CheckCircle2, Lock, ChevronDown,
  Sparkles, Brain, Heart, Users, Zap, Award, Quote,
  PlayCircle, PenLine, Trophy, ArrowRight, Star,
  Headphones, Leaf, Target,
} from 'lucide-react';
import learningPathsData from '../data/learningPaths.json';
import { CertificateModal } from '../components/CertificateModal';
import { EnrollmentFormModal } from '../components/EnrollmentFormModal';

const { learningPaths } = learningPathsData;

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const PATH_ICONS: Record<string, React.ReactNode> = {
  'foundations-of-clear-communication':        <Users className="w-7 h-7" />,
  'decision-clarity-strategic-thinking':       <Brain className="w-7 h-7" />,
  'digital-mindfulness-modern-life-balance':   <Leaf className="w-7 h-7" />,
};

const PATH_CERTIFICATES: Record<string, string> = {
  'foundations-of-clear-communication':        '/CERTIFICATE1.png',
  'decision-clarity-strategic-thinking':       '/CERTIFICATE2.png',
  'digital-mindfulness-modern-life-balance':   '/CERTIFICATE3.png',
};

const UNIT_TYPE_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  reading:     { icon: <BookOpen className="w-3.5 h-3.5" />,   label: 'Reading',         color: '#60a5fa', bg: 'rgba(96,165,250,0.12)'  },
  reflection:  { icon: <PenLine className="w-3.5 h-3.5" />,    label: 'Reflection',      color: '#c084fc', bg: 'rgba(192,132,252,0.12)' },
  activity:    { icon: <Headphones className="w-3.5 h-3.5" />, label: 'Activity',        color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
  quiz:        { icon: <Target className="w-3.5 h-3.5" />,     label: 'Assessment',      color: '#fbbf24', bg: 'rgba(251,191,36,0.12)'  },
  mindfulness: { icon: <Leaf className="w-3.5 h-3.5" />,       label: 'Mindfulness',     color: '#86efac', bg: 'rgba(134,239,172,0.12)' },
};

const REFLECTION_QUOTES: Record<string, { text: string; author: string }> = {
  'foundations-of-clear-communication': {
    text: 'The biggest communication problem is we do not listen to understand. We listen to reply.',
    author: 'Stephen R. Covey',
  },
  'decision-clarity-strategic-thinking': {
    text: 'In any moment of decision, the best thing you can do is the right thing. The worst thing you can do is nothing.',
    author: 'Theodore Roosevelt',
  },
  'digital-mindfulness-modern-life-balance': {
    text: 'Almost everything will work again if you unplug it for a few minutes â€” including you.',
    author: 'Anne Lamott',
  },
  default: {
    text: 'The quieter you become, the more you are able to hear.',
    author: 'Rumi',
  },
};

const OUTCOMES: Record<string, string[]> = {
  'foundations-of-clear-communication': [
    'Communicate ideas clearly and confidently',
    'Apply active listening in every conversation',
    'Write professional emails and lead meetings',
    'Structure and deliver compelling presentations',
  ],
  'decision-clarity-strategic-thinking': [
    'Distinguish reactive impulse from clear thinking',
    'Apply decision-making frameworks to real situations',
    'Think strategically with long-term perspective',
    'Break down complex problems into actionable steps',
  ],
  'digital-mindfulness-modern-life-balance': [
    'Identify and reduce digital distraction patterns',
    'Build intentional screen-time boundaries',
    'Recover deep focus and rebuild concentration',
    'Create a sustainable balanced digital lifestyle',
  ],
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Mandala Illustration â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const EmotionalMandala: React.FC = () => (
  <div className="relative w-full min-h-[500px] flex items-center justify-center select-none">

    {/* Outermost soft glow */}
    <div className="absolute w-[500px] h-[500px] rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(15,122,85,0.06) 0%, transparent 70%)' }} />

    {/* Ring 1 â€“ slow clockwise */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
      className="absolute rounded-full"
      style={{ width: 440, height: 440, border: '1px dashed rgba(15,122,85,0.2)' }}
    />

    {/* Ring 2 â€“ counter-clockwise, with orbital dots */}
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

    {/* Ring 3 â€“ dotted, slow */}
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
      { label: 'ðŸ’¬ Clarity',   style: { top: '10%',  left: '58%'  }, delay: 0   },
      { label: 'ðŸŽ¯ Focus',     style: { top: '76%',  left: '62%'  }, delay: 1   },
      { label: 'ðŸŒ¿ Balance',   style: { top: '68%',  left: '6%'   }, delay: 2   },
      { label: 'âœ¨ Growth',    style: { top: '12%',  left: '10%'  }, delay: 1.5 },
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

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ GLASS styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const LearningPathPage: React.FC = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enroll, isEnrolled } = useEnrollment();
  const [enrolling, setEnrolling] = useState(false);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const enrolled = isEnrolled(pathId || '');
  const isLoggedIn = !!user;

  const [openModules, setOpenModules] = useState<Set<string>>(new Set());
  const [completedUnits, setCompletedUnits] = useState<Set<string>>(new Set());
  const [certModalOpen, setCertModalOpen] = useState(false);

  const currentStreak = user?.stats?.streak ?? 0;

  const getWeeklyActivity = () => {
    const activityLog = user?.stats?.activityLog || [];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMonday);
    const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    return daysOfWeek.map((dayName, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      const dateStr = d.toISOString().split('T')[0];
      const isCompleted = activityLog.includes(dateStr);
      return { dayName, isCompleted };
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
            â† Back to catalog
          </button>
        </div>
      </div>
    );
  }

  // Open first module by default on first load
  const modules = path.modules as Array<{
    id: string;
    title: string;
    description: string;
    units: Array<{ id: string; title: string; type: string; xp: number; locked: boolean }>;
  }>;

  // Set first module open initially
  useEffect(() => {
    if (modules.length > 0) {
      setOpenModules(new Set([modules[0].id]));
    }
  }, [pathId]);

  const icon       = PATH_ICONS[path.id] ?? <BookOpen className="w-7 h-7" />;
  const outcomes   = OUTCOMES[path.id] ?? [];
  const quote      = REFLECTION_QUOTES[path.id] ?? REFLECTION_QUOTES.default;

  const allUnits   = modules.flatMap(m => m.units);
  const totalXP    = allUnits.reduce((s, u) => s + u.xp, 0);
  const totalUnits = allUnits.length;
  const earnedXP   = allUnits.filter(u => completedUnits.has(u.id)).reduce((s, u) => s + u.xp, 0);
  const progressPct = totalUnits > 0 ? Math.round((completedUnits.size / totalUnits) * 100) : 0;

  const toggleModule = (id: string) => {
    setOpenModules(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const handleEnrollClick = () => {
    setEnrollModalOpen(true);
  };

  const toggleUnit = (id: string) => {
    if (!enrolled) {
      handleEnrollClick();
      return;
    }
    setCompletedUnits(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      
      const isNowAllComplete = allUnits.every(u => n.has(u.id));
      if (isNowAllComplete) {
        setTimeout(() => setCertModalOpen(true), 500);
      }
      return n;
    });
  };

  const circumference = 2 * Math.PI * 52;

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: 'linear-gradient(135deg, #f0fdf8 0%, #ecfdf5 50%, #f7fffe 100%)', fontFamily: "'Inter', 'Poppins', sans-serif", color: '#0a1a12' }}
    >
      {/* â”€â”€ Ambient background orbs â”€â”€ */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-60 -left-40 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(15,122,85,0.07) 0%, transparent 65%)' }} />
        <div className="absolute top-1/2 -right-20 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(15,122,85,0.04) 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 65%)' }} />
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

      {/* â”€â”€ Back button â”€â”€ */}
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

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• HERO â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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
                style={{ color: '#1a4a2e' }}
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
                {enrolled ? (
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
                    Continue Learning
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    onClick={handleEnrollClick}
                    className="flex items-center gap-3 px-9 py-4 rounded-full font-bold text-sm tracking-wider"
                    style={{
                      background: 'linear-gradient(135deg, #0f7a55 0%, #1a9c6d 100%)',
                      color: '#fff',
                      boxShadow: '0 0 30px rgba(15,122,85,0.55), 0 0 70px rgba(15,122,85,0.15)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Enroll Now
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}
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

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• PROGRESS CARDS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1 â€“ Circular Progress */}
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

            {/* Card 2 â€“ XP */}
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
                {(path as any).certificate ?? 'Certificate on completion'}
              </div>
            </motion.div>

            {/* Card 3 â€“ Streak */}
            <motion.div
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
              className="rounded-[28px] p-8 relative overflow-hidden" style={glass}
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)' }} />

              <div className="flex items-center gap-3 mb-6">
                <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <span className="text-4xl">ðŸ”¥</span>
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
                      {dayInfo.isCompleted ? 'âœ“' : dayInfo.dayName}
                    </div>
                    <span style={{ color: '#0a1a12', fontSize: '9px' }}>{dayInfo.dayName}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-[14px] p-3" style={{ background: 'rgba(15,122,85,0.06)', border: '1px solid rgba(15,122,85,0.12)' }}>
                <p className="text-xs leading-relaxed" style={{ color: '#1a4a2e' }}>
                  Keep going! You're on a <span style={{ color: '#0f7a55', fontWeight: 700 }}>{currentStreak}-day streak</span> ðŸŒ¿ One more day to unlock a new badge.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• REFLECTION QUOTE â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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
              â€” {quote.author}
            </p>
          </div>
        </motion.section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• WHAT YOU'LL CULTIVATE â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• COURSE STRUCTURE â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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
              {modules.length} modules Â· {totalUnits} units Â· {totalXP} total XP
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
                const isComplete = modDone === mod.units.length && mod.units.length > 0;
                const isActive   = true;

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
                                  âœ“ Complete
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-black mb-1 tracking-tight" style={{ color: '#0a1a12', fontFamily: "'Poppins', sans-serif" }}>
                              {mod.title}
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

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• BOTTOM CTA â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <motion.section
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9 }}
          className="mb-24 rounded-[36px] p-12 lg:p-16 text-center relative overflow-hidden"
          style={glassAccent}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(15,122,85,0.12) 0%, transparent 60%)' }} />
          {progressPct === 100 ? (
            <>
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
                <Trophy className="w-14 h-14 mx-auto mb-6 text-yellow-500" style={{ opacity: 0.95 }} />
              </motion.div>
              <h3 className="text-4xl font-black mb-4 tracking-tight"
                style={{ color: '#0a1a12', fontFamily: "'Poppins', sans-serif" }}>
                Congratulations!
              </h3>
              <p className="mb-10 max-w-md mx-auto text-base leading-relaxed" style={{ color: '#0f7a55' }}>
                You have completed all {modules.length} modules, earned {totalXP} XP, and successfully unlocked your{' '}
                <strong>{(path as any).certificate ?? 'Nirvaha Certificate'}</strong>.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setCertModalOpen(true)}
                  className="flex items-center gap-2.5 px-9 py-4 rounded-full font-bold text-sm tracking-wider"
                  style={{
                    background: 'linear-gradient(135deg, #0f7a55, #1a9c6d)',
                    color: '#fff',
                    boxShadow: '0 0 30px rgba(15,122,85,0.45)',
                    letterSpacing: '0.05em',
                  }}
                >
                  <Trophy className="w-4 h-4 text-white animate-bounce" />
                  View Certificate
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
            </>
          ) : (
            <>
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
                <Trophy className="w-14 h-14 mx-auto mb-6" style={{ color: '#0f7a55', opacity: 0.85 }} />
              </motion.div>
              <h3 className="text-4xl font-black mb-4 tracking-tight"
                style={{ color: '#0a1a12', fontFamily: "'Poppins', sans-serif" }}>
                Ready to Begin?
              </h3>
              <p className="mb-10 max-w-md mx-auto text-base leading-relaxed" style={{ color: '#0f7a55' }}>
                Complete all {modules.length} modules, earn {totalXP} XP, and receive your{' '}
                <strong>{(path as any).certificate ?? 'Nirvaha Certificate'}</strong>.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {enrolled ? (
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
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    disabled={enrolling}
                    onClick={handleEnrollClick}
                    className="flex items-center gap-2.5 px-9 py-4 rounded-full font-bold text-sm tracking-wider disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, #0f7a55, #1a9c6d)',
                      color: '#fff',
                      boxShadow: '0 0 30px rgba(15,122,85,0.45)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <PlayCircle className="w-4 h-4" />
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </motion.button>
                )}
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
            </>
          )}
        </motion.section>

      </div>

      {/* â”€â”€ Premium Footer â”€â”€ */}
      <footer className="relative bg-[#040706] text-emerald-100/70 py-16 px-6 lg:px-20 border-t border-emerald-900/40 overflow-hidden mt-0">
        {/* Glow effects */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[100px]" />
          <div className="absolute top-0 right-1/4 w-[300px] h-[300px] rounded-full bg-emerald-500/3 blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-2 flex flex-col items-start pr-0 lg:pr-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">ðŸŒ¿</span>
              <span className="text-lg font-black text-white uppercase tracking-wider font-sans">Nirvaha Academy</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-4 leading-tight font-sans">
              Keep Learning. Keep Growing.
            </h3>
            <p className="text-emerald-100/60 text-[13.5px] leading-relaxed mb-6 font-light font-sans">
              Embark on structured learning paths designed to nurture emotional intelligence, strategic clarity, and focused mindfulness. Build lasting habits and practical capabilities.
            </p>
            <button
              onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate('/learn'); }}
              className="inline-flex items-center gap-2 bg-[#0f7a55] hover:bg-[#0b5e41] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-full shadow-[0_4px_14px_rgba(15,122,85,0.25)] transition-all font-sans"
            >
              Explore More Programs
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Column 1: Learning Paths */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-6 pb-2 border-b border-emerald-900/50 font-sans">
              Learning Paths
            </h4>
            <ul className="space-y-3.5 text-sm font-light font-sans">
              {[
                { label: 'Clear Communication', path: '/learn/foundations-of-clear-communication' },
                { label: 'Decision Clarity',    path: '/learn/decision-clarity-strategic-thinking' },
                { label: 'Digital Mindfulness', path: '/learn/digital-mindfulness-modern-life-balance' },
              ].map(link => (
                <li key={link.label}>
                  <button
                    onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate(link.path); }}
                    className="text-emerald-100/60 hover:text-emerald-300 transition-colors text-[13px] font-medium text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-6 pb-2 border-b border-emerald-900/50 font-sans">
              Resources
            </h4>
            <ul className="space-y-3.5 text-sm font-light font-sans">
              {[
                { label: 'Success Stories',    path: '/stories' },
                { label: 'Inner Journey',      path: '/journey/anxiety' },
                { label: 'Temple of Balance',  path: '/temple-of-balance' },
              ].map(link => (
                <li key={link.label}>
                  <button
                    onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate(link.path); }}
                    className="text-emerald-100/60 hover:text-emerald-300 transition-colors text-[13px] font-medium text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>


          {/* Column 3: Follow Us */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-6 pb-2 border-b border-emerald-900/50 font-sans">
              Follow Us
            </h4>
            <div className="flex flex-col gap-4">
              <a
                href="https://www.linkedin.com/in/esaieshwar/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#0077B5]/10 border border-[#0077B5]/25 group-hover:bg-[#0077B5]/20 group-hover:border-[#0077B5]/50 transition-all">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0077B5">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <span className="text-[13px] font-medium text-emerald-100/60 group-hover:text-emerald-300 transition-colors">LinkedIn</span>
              </a>
              <a
                href="https://www.instagram.com/saieshwar_universe_/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#E1306C]/10 border border-[#E1306C]/25 group-hover:bg-[#E1306C]/20 group-hover:border-[#E1306C]/50 transition-all">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="url(#ig-grad-path)">
                    <defs>
                      <linearGradient id="ig-grad-path" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f09433"/>
                        <stop offset="25%" stopColor="#e6683c"/>
                        <stop offset="50%" stopColor="#dc2743"/>
                        <stop offset="75%" stopColor="#cc2366"/>
                        <stop offset="100%" stopColor="#bc1888"/>
                      </linearGradient>
                    </defs>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </div>
                <span className="text-[13px] font-medium text-emerald-100/60 group-hover:text-emerald-300 transition-colors">Instagram</span>
              </a>
            </div>
          </div>
        </div>


        {/* Footer Bottom */}
        <div className="relative z-10 pt-8 border-t border-emerald-900/40 flex flex-col md:flex-row items-center justify-between gap-4 font-sans">
          <p className="text-[12px] text-emerald-100/30 font-medium text-center md:text-left">
            Â© 2026 Nirvaha Academy â€¢ Learn with Clarity â€¢ Grow with Purpose
          </p>
          <div className="flex gap-6 text-[12px] text-emerald-100/30 font-medium">
            <a href="#privacy" className="hover:text-emerald-100/60 transition-colors">Privacy Policy</a>
            <a href="#terms"   className="hover:text-emerald-100/60 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        certificateImage={PATH_CERTIFICATES[path.id] ?? '/CERTIFICATE1.png'}
        courseTitle={path.title}
      />

      {/* Enrollment Form Modal */}
      <EnrollmentFormModal
        open={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        courseId={pathId || ''}
        courseTitle={path.title}
        onEnrolled={() => {
          setEnrollModalOpen(false);
          // navigate to course player after enrollment
          setTimeout(() => navigate(`/learn/${pathId}/play`), 300);
        }}
      />
    </div>
  );
};

export default LearningPathPage;
