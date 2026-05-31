import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, BookOpen, Sparkles, Brain, Heart, Users, Zap, Star } from 'lucide-react';
import learningPathsData from '../data/learningPaths.json';

const { learningPaths } = learningPathsData;

const FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const PATH_IMAGES: Record<string, string> = {
  'emotional-awareness-foundations': '/learn1.png',
  'conscious-communication': '/learn2.png',
  'inner-balance-emotional-stability': '/learn3.png',
  'reflective-thinking-self-awareness': '/learn4.png',
  'mindful-digital-living': '/learn5.png',
  'emotional-intelligence-for-students': '/learn6.png',
  'workplace-emotional-intelligence': '/learn7.png',
  'calm-leadership-presence': '/learn8.png',
  'reflection-journaling-mastery': '/learn9.png',
  'relationships-emotional-connection': '/learn10.png',
  'ai-reflection-companion-mastery': '/learn11.png',
  'conscious-growth-journey': '/learn12.png',
};

const LearningCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const filtered = activeFilter === 'All'
    ? learningPaths
    : learningPaths.filter((p) => p.skillLevel === activeFilter);

  return (
    <div className="relative min-h-screen text-[#0b1310] bg-[#F3FAF7] pb-24 overflow-x-hidden font-sans">
      {/* ── Ambient background shapes ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.25] blur-[100px]"
          style={{ background: 'radial-gradient(circle, #a7f3d0 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] rounded-full opacity-[0.2] blur-[80px]"
          style={{ background: 'radial-gradient(circle, #86efac 0%, transparent 70%)' }} />
      </div>

      {/* ── Top Navigation ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10">
        <button
          onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate('/certifications'); }}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#0f7a55] hover:text-[#08432e] transition-colors duration-200 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Certifications
        </button>
      </div>

      {/* ── Hero Title ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1b4332] tracking-tight uppercase mb-4 leading-tight">
            Choose Your Certification
          </h1>
          <p className="text-sm md:text-base text-emerald-800/70 max-w-xl mx-auto font-bold uppercase tracking-wider">
            Structured emotional wellness pathways designed for personal expansion and wisdom
          </p>
        </motion.div>
      </section>

      {/* ── Filter pills ── */}
      <section id="catalog-grid" className="relative z-10 max-w-7xl mx-auto px-6 pb-12 flex justify-center">
        <div className="flex items-center gap-2 flex-wrap bg-white/40 backdrop-blur-md p-2 rounded-full border border-emerald-100/50 shadow-lg shadow-emerald-950/5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                activeFilter === f
                  ? 'bg-[#1b4332] text-white shadow-md shadow-[#1b4332]/10'
                  : 'text-emerald-700 hover:text-[#1b4332] hover:bg-emerald-50/50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* ── Wide row cards – ALL cards same style ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 space-y-10">
        <AnimatePresence mode="popLayout">
          {filtered.map((path, index) => {
            const pathImage = PATH_IMAGES[path.id] || '/learn1.png';
            const isHov = hovered === path.id;

            return (
              <motion.div
                key={path.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05, duration: 0.5, ease: 'easeOut' }}
                onHoverStart={() => setHovered(path.id)}
                onHoverEnd={() => setHovered(null)}
                onClick={() => navigate(`/learn/${path.id}`)}
                className="group relative w-full rounded-[28px] overflow-hidden cursor-pointer flex flex-col lg:flex-row min-h-[320px] shadow-2xl transition-all duration-300 border border-emerald-100/50 bg-[#163529]"
                style={{
                  boxShadow: isHov
                    ? '0 25px 50px -12px rgba(22, 53, 41, 0.25), 0 0 40px rgba(16, 185, 129, 0.1)'
                    : '0 20px 25px -5px rgba(22, 53, 41, 0.1), 0 8px 10px -6px rgba(22, 53, 41, 0.05)',
                }}
              >
                {/* Left side fading image */}
                <div className="absolute inset-0 w-full lg:w-[62%] h-full pointer-events-none overflow-hidden">
                  <img
                    src={pathImage}
                    alt={path.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Fading overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-transparent via-[#163529]/65 to-[#163529] z-10" />
                </div>

                {/* Left spacer for desktop */}
                <div className="hidden lg:block w-[45%]" />

                {/* Right side content box */}
                <div className="relative z-20 w-full lg:w-[55%] p-6 lg:p-8 flex items-center justify-center lg:justify-end">
                  <div className="bg-[#E2F5ED] rounded-[24px] p-6 lg:p-8 w-full max-w-[480px] flex flex-col justify-between shadow-xl border border-emerald-50/50 min-h-[220px]">
                    <div>
                      <h3 className="text-xl lg:text-2xl font-black text-[#1b4332] tracking-wide mb-1 leading-tight group-hover:text-emerald-800 transition-colors">
                        {path.title.replace(' Foundations', '').toUpperCase()}
                      </h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#52B788] block mb-3.5">
                        Certification
                      </span>
                      <p className="text-xs lg:text-sm text-[#2D6A4F] leading-relaxed font-medium mb-6">
                        {path.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#1b4332]/60 bg-[#D3EFE2] px-3.5 py-1.5 rounded-full border border-emerald-100/50">
                        {path.duration} • {path.skillLevel}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-[#21C55E] to-[#10B981] text-white hover:from-[#16A34A] hover:to-[#059669] text-xs font-black uppercase py-3.5 px-6 rounded-full shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5 transition-all"
                      >
                        Learn More
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Bottom neon accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-[#52B788] to-transparent" />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 text-emerald-800/40"
          >
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-bold">No pathways found matching your active filter.</p>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default LearningCatalogPage;
