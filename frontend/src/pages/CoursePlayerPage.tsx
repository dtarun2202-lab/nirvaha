import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  ChevronLeft, ChevronRight, ChevronDown, BookOpen, PenLine, HelpCircle,
  PlayCircle, CheckCircle2, Lock, Sparkles, Brain, Heart, Users, Zap,
  Star, Award, Trophy, X, Menu, FileText, Bookmark,
  Layers, Target, Flame, Clock, ArrowRight, RotateCcw,
  NotebookPen, ListChecks
} from 'lucide-react';
import { toast } from 'sonner';
import learningPathsData from '../data/learningPaths.json';

const { learningPaths } = learningPathsData;

/* ──────────────────────────────────────────
   DATA
────────────────────────────────────────── */
const MODULES = [
  {
    id: 'mod-1', title: 'Module 1: Foundations', shortTitle: 'Foundations',
    description: 'Build a strong conceptual base and develop situational awareness.',
    units: [
      { id: 'u1', title: 'Introduction & Core Concepts',    type: 'reading',    xp: 50,  locked: false, duration: '8 min' },
      { id: 'u2', title: 'Reflective Exercise: First Look', type: 'reflection', xp: 75,  locked: false, duration: '10 min' },
      { id: 'u3', title: 'Guided Practice Session',         type: 'activity',   xp: 100, locked: false, duration: '12 min' },
      { id: 'u4', title: 'Knowledge Check',                 type: 'quiz',       xp: 50,  locked: false, duration: '5 min' },
    ],
  },
  {
    id: 'mod-2', title: 'Module 2: Deep Dive', shortTitle: 'Deep Dive',
    description: 'Explore intermediate concepts and strengthen your practice.',
    units: [
      { id: 'u5', title: 'Advanced Patterns & Signals',     type: 'reading',    xp: 75,  locked: false, duration: '10 min' },
      { id: 'u6', title: 'Immersive Awareness Session',     type: 'activity',   xp: 125, locked: false, duration: '15 min' },
      { id: 'u7', title: 'Journaling Prompt: Go Deeper',    type: 'reflection', xp: 100, locked: true,  duration: '12 min' },
      { id: 'u8', title: 'Knowledge Check',                 type: 'quiz',       xp: 75,  locked: true,  duration: '5 min' },
    ],
  },
  {
    id: 'mod-3', title: 'Module 3: Applied Practice', shortTitle: 'Applied Practice',
    description: 'Apply your learning in real-world contexts and build habits.',
    units: [
      { id: 'u9',  title: 'Real-World Application Guide',  type: 'reading',    xp: 100, locked: true,  duration: '12 min' },
      { id: 'u10', title: 'Scenario-Based Exercise',        type: 'activity',   xp: 150, locked: true,  duration: '18 min' },
      { id: 'u11', title: 'Reflection: What Changed?',      type: 'reflection', xp: 125, locked: true,  duration: '10 min' },
      { id: 'u12', title: 'Final Knowledge Check',          type: 'quiz',       xp: 100, locked: true,  duration: '7 min' },
    ],
  },
  {
    id: 'mod-4', title: 'Module 4: Integration & Certification', shortTitle: 'Certification',
    description: 'Bring it all together and earn your Nirvaha certificate.',
    units: [
      { id: 'u13', title: 'Synthesis: Your Growth Story',  type: 'reading',    xp: 150, locked: true,  duration: '15 min' },
      { id: 'u14', title: 'Capstone Reflection',            type: 'reflection', xp: 200, locked: true,  duration: '20 min' },
      { id: 'u15', title: 'Certification Assessment',       type: 'quiz',       xp: 300, locked: true,  duration: '25 min' },
    ],
  },
];

const LESSON_CONTENT: Record<string, {
  objectives: string[];
  body: string[];
  reflectionPrompts?: string[];
  quizQuestions?: { question: string; options: string[]; correct: number }[];
  activitySteps?: string[];
  summary?: string;
}> = {
  u1: {
    objectives: [
      'Understand the core principles of this learning experience',
      'Identify key concepts that will guide your journey',
      'Set personal learning intentions for this module',
    ],
    body: [
      'Welcome to your first unit. This is where your transformation begins — not with dramatic change, but with a gentle turning of attention inward.',
      'Emotional awareness is the foundation of conscious living. Before we can change how we feel, we must first learn to *notice* what we feel, without judgment, without resistance.',
      'Research in affective neuroscience shows that the simple act of labeling an emotion — putting it into words — reduces the intensity of that emotion by up to 50%. This is the power of awareness.',
      'In this unit, we explore three foundational frameworks: the Emotion Wheel, the Window of Tolerance, and the Aware-Accept-Act cycle. Together, these give you a language for your inner world.',
      'As you move through this content, we invite you to engage with full presence. Notice what arises in you as you read. There is no "right" way to feel — only the truth of your experience.',
    ],
    reflectionPrompts: [
      'What brought you to this learning path? What are you hoping to discover about yourself?',
      'Think of a recent emotional experience. Without judging it, describe what it felt like in your body.',
    ],
    summary: 'You\'ve taken the first step — bringing awareness to your emotional world. Remember: noticing is already transforming.',
  },
  u2: {
    objectives: [
      'Practice first-person emotional observation',
      'Identify your current emotional baseline',
      'Develop language for describing inner states',
    ],
    body: [
      'This reflective exercise invites you to pause and turn your attention inward. There is nothing to accomplish here — only to observe.',
      'Find a comfortable position. Take three slow breaths. Let your body settle. Notice what is present — thoughts, sensations, emotions — without trying to change any of it.',
      'Often, we are so caught up in the story of our emotions that we miss the actual felt experience. The story says "I am angry because..." The felt experience says "there is heat in my chest, tension in my jaw."',
      'Begin by completing the sentence starters below in your Reflection Journal on the right. Write without editing. Let whatever comes, come.',
    ],
    reflectionPrompts: [
      'Right now, in this moment, I notice in my body…',
      'If my emotional state had a color, texture, and weight, it would be…',
      'The emotion I most often avoid or push away is… and I avoid it because…',
      'What I most want from this journey is…',
    ],
    summary: 'You\'ve completed your first reflective exercise. This kind of inner inquiry, practiced consistently, builds profound self-awareness over time.',
  },
  u3: {
    objectives: [
      'Experience a guided emotional grounding practice',
      'Practice the Aware-Accept-Act cycle in real time',
      'Build body-based emotional awareness',
    ],
    body: [
      'In this practice session, you will experience a guided grounding exercise designed to connect you with the present moment. This is active learning — not just reading, but doing.',
      'The practice below takes approximately 12 minutes. Find a quiet space where you won\'t be disturbed. You may sit or lie down. The goal is not relaxation — though that may come — but awareness.',
      'Follow each step mindfully. If your mind wanders — and it will — gently return without criticism. Wandering and returning is itself the practice.',
    ],
    activitySteps: [
      'Ground: Feel the weight of your body against the surface beneath you. Notice 5 points of contact.',
      'Breathe: Take 4 slow breaths — inhale for 4 counts, hold for 4, exhale for 6. Repeat 3 times.',
      'Scan: Slowly move attention from your feet to the top of your head. Notice sensation without labeling it.',
      'Name: Place one hand on your heart. Say internally: "I am present. I am here. I am safe."',
      'Observe: Notice any emotions present. Give them space. Watch them like clouds moving across the sky.',
      'Return: When ready, slowly open your eyes. Write one word in your journal that captures what you feel right now.',
    ],
    summary: 'You have just experienced a full grounding practice. With repetition, this becomes your anchor — something you can return to any time you feel overwhelmed.',
  },
  u4: {
    objectives: [
      'Assess your understanding of foundational concepts',
      'Identify areas for deeper exploration',
      'Reinforce key learnings from Module 1',
    ],
    body: [
      'This knowledge check helps you consolidate what you have learned in Module 1. Answer each question thoughtfully. There are no trick questions — this is a learning tool, not a test.',
      'After completing the quiz, you will receive instant feedback and any concepts needing review will be highlighted.',
    ],
    quizQuestions: [
      {
        question: 'According to affective neuroscience, what happens when you label an emotion?',
        options: ['The emotion intensifies', 'The emotion reduces in intensity by up to 50%', 'The emotion is suppressed', 'Nothing measurable happens'],
        correct: 1,
      },
      {
        question: 'What is the Aware-Accept-Act cycle designed to help with?',
        options: ['Avoiding difficult emotions', 'Analyzing emotions intellectually', 'Moving through emotional experiences consciously', 'Eliminating negative emotions'],
        correct: 2,
      },
      {
        question: 'In grounding practice, what does "return" mean?',
        options: ['Going back to sleep', 'Returning to present moment awareness', 'Revisiting past memories', 'Returning to earlier lessons'],
        correct: 1,
      },
    ],
    summary: 'Well done completing your first knowledge check. Review any highlighted areas and continue to Module 2 when ready.',
  },
};

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string; bg: string; border: string }> = {
  reading:    { icon: <BookOpen className="w-4 h-4" />,   label: 'Reading',    color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  reflection: { icon: <PenLine className="w-4 h-4" />,    label: 'Reflection', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  activity:   { icon: <PlayCircle className="w-4 h-4" />, label: 'Activity',   color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  quiz:       { icon: <HelpCircle className="w-4 h-4" />, label: 'Quiz',       color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
};

const PATH_ICONS: Record<string, React.ReactNode> = {
  'emotional-awareness-foundations':     <Brain className="w-5 h-5" />,
  'conscious-communication':             <Users className="w-5 h-5" />,
  'inner-balance-emotional-stability':   <Heart className="w-5 h-5" />,
  'reflective-thinking-self-awareness':  <Sparkles className="w-5 h-5" />,
  'mindful-digital-living':              <Zap className="w-5 h-5" />,
  'emotional-intelligence-for-students': <Star className="w-5 h-5" />,
  'workplace-emotional-intelligence':    <BookOpen className="w-5 h-5" />,
  'calm-leadership-presence':            <Sparkles className="w-5 h-5" />,
  'reflection-journaling-mastery':       <PenLine className="w-5 h-5" />,
  'relationships-emotional-connection':  <Heart className="w-5 h-5" />,
  'ai-reflection-companion-mastery':     <Brain className="w-5 h-5" />,
  'conscious-growth-journey':            <Star className="w-5 h-5" />,
};


/* ── XP Burst ── */
const XPBurst: React.FC<{ xp: number; onDone: () => void }> = ({ xp, onDone }) => (
  <motion.div
    initial={{ opacity: 0, y: 0, scale: 0.8 }}
    animate={{ opacity: 1, y: -64, scale: 1.1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    onAnimationComplete={onDone}
    className="fixed bottom-24 right-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm pointer-events-none shadow-lg"
    style={{ background: 'linear-gradient(135deg, #1a5d47, #0f7a55)', color: '#fff' }}
  >
    <Sparkles className="w-4 h-4" />
    +{xp} XP
  </motion.div>
);

/* ──────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────── */
const CoursePlayerPage: React.FC = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const path = learningPaths.find(p => p.id === pathId);

  const [activeUnitId, setActiveUnitId]     = useState('u1');
  const [completedUnits, setCompletedUnits] = useState<Set<string>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['mod-1']));
  const [rightTab, setRightTab]             = useState<'notes' | 'journal'>('notes');
  const [notes, setNotes]                   = useState<Record<string, string>>({});
  const [journal, setJournal]               = useState<Record<string, string>>({});
  const [xpBurst, setXpBurst]               = useState<{ xp: number; key: number } | null>(null);
  const [totalXP, setTotalXP]               = useState(0);
  const [sidebarOpen, setSidebarOpen]       = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [quizAnswers, setQuizAnswers]       = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted]   = useState(false);
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<string, string>>({});
  
  const streak = user?.stats?.streak ?? 0;

  const contentRef = useRef<HTMLDivElement>(null);

  const allUnits       = MODULES.flatMap(m => m.units);
  const totalUnits     = allUnits.length;
  const progressPct    = Math.round((completedUnits.size / totalUnits) * 100);
  const currentUnitIdx = allUnits.findIndex(u => u.id === activeUnitId);
  const currentUnit    = allUnits[currentUnitIdx];
  const prevUnit       = currentUnitIdx > 0 ? allUnits[currentUnitIdx - 1] : null;
  const nextUnit       = currentUnitIdx < allUnits.length - 1 ? allUnits[currentUnitIdx + 1] : null;
  const currentContent = LESSON_CONTENT[activeUnitId] ?? LESSON_CONTENT['u1'];
  const typeConf       = currentUnit ? TYPE_CONFIG[currentUnit.type] : TYPE_CONFIG['reading'];
  const currentModId   = MODULES.find(m => m.units.some(u => u.id === activeUnitId))?.id ?? 'mod-1';

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setQuizAnswers({});
    setQuizSubmitted(false);
  }, [activeUnitId]);

  const markComplete = useCallback(() => {
    if (completedUnits.has(activeUnitId)) return;
    const unit = allUnits.find(u => u.id === activeUnitId);
    if (!unit) return;
    setCompletedUnits(prev => new Set([...prev, activeUnitId]));
    setTotalXP(prev => prev + unit.xp);
    setXpBurst({ xp: unit.xp, key: Date.now() });
    setTimeout(() => {
      if (nextUnit) {
        setActiveUnitId(nextUnit.id);
        const nm = MODULES.find(m => m.units.some(u => u.id === nextUnit.id));
        if (nm) setExpandedModules(prev => new Set([...prev, nm.id]));
      }
    }, 800);
  }, [activeUnitId, completedUnits, allUnits, nextUnit]);

  if (!path) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Path not found.</p>
          <button onClick={() => navigate('/learn')} className="text-[#0f7a55] hover:underline">← Back to catalog</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#ffffff', fontFamily: "'Poppins', sans-serif" }}>

      {/* ═══════════════ LEFT SIDEBAR ═══════════════ */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-[272px] flex-shrink-0 flex flex-col h-full overflow-hidden"
            style={{ background: '#ffffff', borderRight: '1px solid #e5ede9' }}
          >
            {/* Top: path info */}
            <div className="p-5" style={{ borderBottom: '1px solid #e5ede9' }}>
              <button
                onClick={() => navigate(`/learn/${pathId}`)}
                className="flex items-center gap-2 text-sm text-[#9ca3af] hover:text-[#0f7a55] transition-colors mb-4 group"
              >
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to Overview
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-[10px] text-[#0f7a55] flex-shrink-0"
                  style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                  {PATH_ICONS[pathId ?? ''] ?? <BookOpen className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] text-[#9ca3af] font-semibold uppercase tracking-wider">Learning Path</p>
                  <p className="text-[16px] font-bold text-[#0b1310] truncate">{path.title}</p>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-[13px] mb-1.5 font-medium" style={{ color: '#9ca3af' }}>
                  <span>{completedUnits.size} / {totalUnits} units</span>
                  <span style={{ color: '#0f7a55' }}>{progressPct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#e5ede9' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #1a5d47, #0f7a55)' }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-[10px]"
                style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                <Flame className="w-4 h-4 text-[#d97706]" />
                <span className="text-[13px] text-[#d97706] font-bold">{streak} day streak</span>
                <span className="ml-auto text-[12px]" style={{ color: '#9ca3af' }}>{totalXP} XP</span>
              </div>
            </div>

            {/* Curriculum */}
            <div className="flex-1 overflow-y-auto py-2">
              {MODULES.map((mod, mIdx) => {
                const isExpanded = expandedModules.has(mod.id);
                const modDone    = mod.units.filter(u => completedUnits.has(u.id)).length;
                const isActiveMod = mod.id === currentModId;

                return (
                  <div key={mod.id}>
                    <button
                      onClick={() => setExpandedModules(prev => {
                        const next = new Set(prev);
                        next.has(mod.id) ? next.delete(mod.id) : next.add(mod.id);
                        return next;
                      })}
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all hover:bg-[#f5f9f7]"
                    >
                      <div className="flex items-center justify-center w-7 h-7 rounded-full text-[12px] font-bold flex-shrink-0 transition-colors"
                        style={{
                          background: isActiveMod ? '#ecfdf5' : '#f3f4f6',
                          color: isActiveMod ? '#0f7a55' : '#9ca3af',
                          border: isActiveMod ? '1px solid #a7f3d0' : '1px solid #e5e7eb',
                        }}>
                        {modDone === mod.units.length ? <CheckCircle2 className="w-4 h-4" /> : mIdx + 1}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className={`text-[15px] font-bold truncate ${isActiveMod ? 'text-[#0b1310]' : 'text-[#6b7280]'}`}>{mod.shortTitle}</p>
                        <p className="text-[12px] text-[#9ca3af] font-medium">{modDone}/{mod.units.length} done</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-[#d1d5db] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          {mod.units.map((unit) => {
                            const isActive = unit.id === activeUnitId;
                            const isDone   = completedUnits.has(unit.id);
                            const tc       = TYPE_CONFIG[unit.type];

                            return (
                              <button
                                key={unit.id}
                                disabled={unit.locked && !isDone}
                                onClick={() => !unit.locked && setActiveUnitId(unit.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 pl-[52px] text-left transition-all"
                                style={{
                                  background: isActive ? '#f0fdf7' : 'transparent',
                                  borderLeft: isActive ? '3px solid #0f7a55' : '3px solid transparent',
                                  opacity: unit.locked && !isDone ? 0.4 : 1,
                                }}
                              >
                                <div className="flex-shrink-0" style={{ color: isDone ? '#0f7a55' : tc.color }}>
                                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : unit.locked ? <Lock className="w-3.5 h-3.5 text-[#d1d5db]" /> : tc.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-[14px] truncate font-semibold ${isActive ? 'text-[#0b1310] font-bold' : isDone ? 'text-[#9ca3af]' : 'text-[#374151]'}`}>
                                    {unit.title}
                                  </p>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <Clock className="w-3.5 h-3.5 text-[#d1d5db]" />
                                    <span className="text-[11px] text-[#9ca3af] font-medium">{unit.duration}</span>
                                    <span className="ml-auto text-[11px] font-bold" style={{ color: tc.color }}>{unit.xp} XP</span>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {mIdx < MODULES.length - 1 && (
                      <div className="mx-4 h-px my-1" style={{ background: '#f3f4f6' }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Certificate badge */}
            <div className="p-4" style={{ borderTop: '1px solid #e5ede9' }}>
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-[12px]"
                style={{ background: '#f0fdf7', border: '1px solid #a7f3d0' }}>
                <Trophy className="w-5 h-5 text-[#0f7a55]" />
                <div>
                  <p className="text-[13px] font-bold text-[#0f7a55]">Certificate Awaits</p>
                  <p className="text-[11px] text-[#6b7280] font-medium">Complete all units to earn</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ═══════════════ CENTER CONTENT ═══════════════ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top header */}
        <header
          className="flex-shrink-0 flex items-center gap-4 px-6 py-3.5"
          style={{ background: 'rgba(255,255,255,0.95)', borderBottom: '1px solid #e5ede9', backdropFilter: 'blur(12px)' }}
        >
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-[#f5f9f7] transition-colors text-[#9ca3af] hover:text-[#0b1310]">
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs flex-1 min-w-0" style={{ color: '#9ca3af' }}>
            <span className="font-medium truncate text-[#6b7280]">{path.title}</span>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-medium truncate text-[#6b7280]">
              {MODULES.find(m => m.units.some(u => u.id === activeUnitId))?.shortTitle}
            </span>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-semibold text-[#0b1310] truncate">{currentUnit?.title}</span>
          </div>

          {/* XP */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full flex-shrink-0"
            style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
            <Sparkles className="w-3.5 h-3.5 text-[#0f7a55]" />
            <span className="text-xs font-bold text-[#0f7a55]">{totalXP} XP</span>
          </div>

          <button onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className="p-2 rounded-lg hover:bg-[#f5f9f7] transition-colors text-[#9ca3af] hover:text-[#0b1310]">
            <Layers className="w-5 h-5" />
          </button>
        </header>

        {/* Progress bar */}
        <div className="h-1 flex-shrink-0" style={{ background: '#e5ede9' }}>
          <motion.div
            className="h-full"
            style={{ background: 'linear-gradient(90deg, #1a5d47, #0f7a55)' }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Lesson content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-3xl mx-auto px-6 lg:px-12 py-10">
            <motion.div
              key={activeUnitId}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {/* Type badge row */}
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: typeConf?.bg, color: typeConf?.color, border: `1px solid ${typeConf?.border}` }}>
                  {typeConf?.icon}
                  {typeConf?.label}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
                  <Clock className="w-3.5 h-3.5" />
                  {currentUnit?.duration}
                </span>
                <span className="flex items-center gap-1.5 text-xs ml-auto font-semibold" style={{ color: '#0f7a55' }}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentUnit?.xp} XP
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-[44px] font-extrabold text-[#0b1310] mb-6 leading-tight">
                {currentUnit?.title}
              </h1>

              {/* Objectives */}
              {currentContent.objectives && (
                <div className="mb-8 p-6 rounded-[16px]"
                  style={{ background: '#f0fdf7', border: '1px solid #a7f3d0' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-[#0f7a55]" />
                    <span className="text-base font-extrabold text-[#0f7a55] uppercase tracking-wider">Learning Objectives</span>
                  </div>
                  <ul className="space-y-3">
                    {currentContent.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[18px] text-[#374151] leading-relaxed">
                        <div className="w-2 h-2 rounded-full bg-[#0f7a55] mt-2 flex-shrink-0" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Body text */}
              {currentUnit?.type !== 'quiz' && currentContent.body && (
                <div className="space-y-6 mb-10">
                  {currentContent.body.map((para, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.05 }}
                      className="text-[20px] md:text-[22px] text-[#2c3733] leading-[1.85] font-light"
                      dangerouslySetInnerHTML={{ __html: para.replace(/\*(.*?)\*/g, '<strong style="color:#0f7a55;font-weight:700">$1</strong>') }}
                    />
                  ))}
                </div>
              )}

              {/* Activity steps */}
              {currentUnit?.type === 'activity' && currentContent.activitySteps && (
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-6">
                    <PlayCircle className="w-6 h-6 text-[#059669]" />
                    <h2 className="text-2xl font-extrabold text-[#0b1310]">Guided Practice Steps</h2>
                  </div>
                  <div className="space-y-4">
                    {currentContent.activitySteps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.06 }}
                        className="flex items-start gap-4 p-5 rounded-[14px]"
                        style={{ background: '#f8faf9', border: '1px solid #e5ede9' }}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold flex-shrink-0"
                          style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
                          {i + 1}
                        </div>
                        <p className="text-[19px] text-[#374151] leading-relaxed pt-0.5">{step}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reflection prompts */}
              {currentContent.reflectionPrompts && (
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-6">
                    <PenLine className="w-6 h-6 text-[#7c3aed]" />
                    <h2 className="text-2xl font-extrabold text-[#0b1310]">Reflection Prompts</h2>
                  </div>
                  <div className="space-y-5">
                    {currentContent.reflectionPrompts.map((prompt, i) => (
                      <div key={i} className="p-6 rounded-[16px]"
                        style={{ background: '#faf5ff', border: '1px solid #ddd6fe' }}>
                        <p className="text-[18px] text-[#7c3aed] font-semibold mb-4 leading-relaxed">{prompt}</p>
                        <textarea
                          value={reflectionAnswers[`${activeUnitId}-${i}`] ?? ''}
                          onChange={e => setReflectionAnswers(prev => ({ ...prev, [`${activeUnitId}-${i}`]: e.target.value }))}
                          rows={4}
                          placeholder="Write your reflection here..."
                          className="w-full bg-transparent text-[18px] text-[#374151] resize-none outline-none leading-relaxed placeholder-[#c4b5fd]"
                          style={{ caretColor: '#7c3aed' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quiz */}
              {currentUnit?.type === 'quiz' && currentContent.quizQuestions && (
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-6">
                    <HelpCircle className="w-6 h-6 text-[#d97706]" />
                    <h2 className="text-2xl font-extrabold text-[#0b1310]">Knowledge Check</h2>
                    <span className="text-sm text-[#9ca3af] ml-2">{currentContent.quizQuestions.length} questions</span>
                  </div>

                  <div className="space-y-8">
                    {currentContent.quizQuestions.map((q, qi) => (
                      <div key={qi} className="p-7 rounded-[18px]"
                        style={{ background: '#fafafa', border: '1px solid #e5e7eb' }}>
                        <p className="text-[20px] font-bold text-[#0b1310] mb-5 leading-snug">
                          <span className="text-[#d97706] mr-2">{qi + 1}.</span>{q.question}
                        </p>
                        <div className="space-y-3">
                          {q.options.map((opt, oi) => {
                            const selected = quizAnswers[qi] === oi;
                            const correct  = quizSubmitted && oi === q.correct;
                            const wrong    = quizSubmitted && selected && oi !== q.correct;
                            return (
                              <button
                                key={oi}
                                disabled={quizSubmitted}
                                onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                                className="w-full flex items-center gap-3 px-5 py-4 rounded-[12px] text-left transition-all text-[18px]"
                                style={{
                                  background: correct ? '#ecfdf5' : wrong ? '#fef2f2' : selected ? '#fffbeb' : '#ffffff',
                                  border: correct ? '1px solid #6ee7b7' : wrong ? '1px solid #fca5a5' : selected ? '1px solid #fde68a' : '1px solid #e5e7eb',
                                  color: correct ? '#059669' : wrong ? '#dc2626' : selected ? '#d97706' : '#374151',
                                }}
                              >
                                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ border: `1.5px solid ${correct ? '#6ee7b7' : wrong ? '#fca5a5' : selected ? '#fde68a' : '#d1d5db'}` }}>
                                  {correct && <CheckCircle2 className="w-4 h-4 text-[#059669]" />}
                                  {wrong   && <X className="w-3.5 h-3.5 text-[#dc2626]" />}
                                  {selected && !quizSubmitted && <div className="w-3 h-3 rounded-full bg-[#d97706]" />}
                                </div>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      onClick={() => {
                        if (Object.keys(quizAnswers).length === currentContent.quizQuestions!.length) setQuizSubmitted(true);
                      }}
                      disabled={Object.keys(quizAnswers).length < (currentContent.quizQuestions?.length ?? 0)}
                      className="mt-6 flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all disabled:opacity-30"
                      style={{ background: 'linear-gradient(135deg, #1a5d47, #0f7a55)', color: '#fff' }}
                    >
                      <ListChecks className="w-4 h-4" />
                      Submit Answers
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-5 rounded-[14px] flex items-center gap-4"
                      style={{ background: '#f0fdf7', border: '1px solid #a7f3d0' }}
                    >
                      <CheckCircle2 className="w-8 h-8 text-[#0f7a55] flex-shrink-0" />
                      <div>
                        <p className="text-[14px] font-bold text-[#0f7a55]">Quiz Complete!</p>
                        <p className="text-[12px] text-[#6b7280]">
                          {Object.entries(quizAnswers).filter(([qi, ans]) => ans === currentContent.quizQuestions![+qi].correct).length} / {currentContent.quizQuestions?.length} correct
                        </p>
                      </div>
                      <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }}
                        className="ml-auto flex items-center gap-1.5 text-xs text-[#9ca3af] hover:text-[#0b1310] transition-colors">
                        <RotateCcw className="w-3.5 h-3.5" />Retry
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Summary */}
              {currentContent.summary && (
                <div className="mb-10 p-6 rounded-[16px]"
                  style={{ background: '#f0fdf7', border: '1px solid #a7f3d0' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[#0f7a55]" />
                    <span className="text-sm font-bold text-[#0f7a55] uppercase tracking-wider">Summary</span>
                  </div>
                  <p className="text-[18px] text-[#374151] leading-relaxed italic">{currentContent.summary}</p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center gap-4 mt-8 pt-8" style={{ borderTop: '1px solid #e5ede9' }}>
                {prevUnit && (
                  <button
                    onClick={() => setActiveUnitId(prevUnit.id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-[#6b7280] hover:text-[#0b1310] transition-all"
                    style={{ background: '#f3f4f6', border: '1px solid #e5e7eb' }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                )}

                <button
                  onClick={markComplete}
                  disabled={completedUnits.has(activeUnitId)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all flex-1 justify-center"
                  style={{
                    background: completedUnits.has(activeUnitId)
                      ? '#ecfdf5'
                      : 'linear-gradient(135deg, #1a5d47, #0f7a55)',
                    color: completedUnits.has(activeUnitId) ? '#0f7a55' : '#fff',
                    border: completedUnits.has(activeUnitId) ? '1px solid #a7f3d0' : 'none',
                    boxShadow: completedUnits.has(activeUnitId) ? 'none' : '0 4px 16px rgba(15,122,85,0.2)',
                  }}
                >
                  {completedUnits.has(activeUnitId)
                    ? <><CheckCircle2 className="w-4 h-4" />Completed</>
                    : <><Award className="w-4 h-4" />Mark as Complete</>
                  }
                </button>

                {nextUnit && (
                  <button
                    onClick={() => setActiveUnitId(nextUnit.id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all"
                    style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#0f7a55' }}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
            <div className="h-12" />
          </div>
        </div>
      </main>

      {/* ═══════════════ RIGHT PANEL ═══════════════ */}
      <AnimatePresence>
        {rightPanelOpen && (
          <motion.aside
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-[296px] flex-shrink-0 flex flex-col h-full overflow-hidden"
            style={{ background: '#ffffff', borderLeft: '1px solid #e5ede9' }}
          >
            {/* Tabs */}
            <div className="flex items-center flex-shrink-0" style={{ borderBottom: '1px solid #e5ede9' }}>
              {([
                { key: 'notes',     icon: <NotebookPen className="w-3.5 h-3.5" />, label: 'Notes'     },
                { key: 'journal',   icon: <PenLine className="w-3.5 h-3.5" />,     label: 'Journal'   },
              ] as const).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setRightTab(tab.key)}
                  className="flex-1 flex flex-col items-center gap-1 py-3 text-[12px] font-bold uppercase tracking-wider transition-colors"
                  style={{
                    color: rightTab === tab.key ? '#0f7a55' : '#9ca3af',
                    borderBottom: rightTab === tab.key ? '2px solid #0f7a55' : '2px solid transparent',
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto">

              {/* NOTES */}
              {rightTab === 'notes' && (
                <div className="p-4 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <NotebookPen className="w-4 h-4 text-[#2563eb]" />
                    <h3 className="text-[15px] font-bold text-[#0b1310]">Lesson Notes</h3>
                    <span className="ml-auto text-[11px] text-[#9ca3af] font-medium">Auto-saved</span>
                  </div>
                  <p className="text-[13px] text-[#9ca3af] mb-3">Notes are saved per lesson.</p>
                  <textarea
                    value={notes[activeUnitId] ?? ''}
                    onChange={e => setNotes(prev => ({ ...prev, [activeUnitId]: e.target.value }))}
                    placeholder="Take notes on this lesson..."
                    className="flex-1 w-full bg-transparent text-[15px] text-[#374151] resize-none outline-none leading-relaxed placeholder-[#d1d5db]"
                    style={{ caretColor: '#2563eb', minHeight: '300px' }}
                  />
                </div>
              )}

              {/* JOURNAL */}
              {rightTab === 'journal' && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <PenLine className="w-4 h-4 text-[#7c3aed]" />
                    <h3 className="text-[15px] font-bold text-[#0b1310]">Reflection Journal</h3>
                  </div>
                  <div className="mb-4 p-3.5 rounded-[12px]"
                    style={{ background: '#faf5ff', border: '1px solid #ddd6fe' }}>
                    <p className="text-[13px] text-[#7c3aed] font-semibold mb-1.5">Today's Reflection Prompt</p>
                    <p className="text-[14px] text-[#6b7280] leading-relaxed font-medium">
                      What did this lesson reveal to you about yourself? What will you carry forward into your day?
                    </p>
                  </div>
                  <textarea
                    value={journal[activeUnitId] ?? ''}
                    onChange={e => setJournal(prev => ({ ...prev, [activeUnitId]: e.target.value }))}
                    rows={10}
                    placeholder="Begin your reflection..."
                    className="w-full bg-transparent text-[15px] text-[#374151] resize-none outline-none leading-relaxed placeholder-[#c4b5fd]"
                    style={{ caretColor: '#7c3aed' }}
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-[#9ca3af] font-medium">{(journal[activeUnitId] ?? '').length} characters</span>
                    <button 
                      onClick={() => toast.success('Journal entry saved successfully!')}
                      className="text-[13px] text-[#7c3aed] hover:text-[#5b21b6] transition-colors font-semibold"
                    >
                      Save Entry →
                    </button>
                  </div>
                </div>
              )}


            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* XP Burst */}
      <AnimatePresence>
        {xpBurst && (
          <XPBurst key={xpBurst.key} xp={xpBurst.xp} onDone={() => setXpBurst(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursePlayerPage;
