import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, BookOpen, ShieldCheck, Award, BatteryCharging, ArrowRight } from 'lucide-react';
import learningPathsData from '../data/learningPaths.json';
import { useAuth } from '../contexts/AuthContext';
import { useEnrollment } from '../hooks/useEnrollment';
import { EnrollmentFormModal } from '../components/EnrollmentFormModal';

const { learningPaths } = learningPathsData;

const PATH_IMAGES: Record<string, string> = {
  'foundations-of-clear-communication': '/CERTIFICATE4.png',
  'decision-clarity-strategic-thinking': '/CERTIFICATE2.png',
  'digital-mindfulness-modern-life-balance': '/CERTIFICATE3.png',
};

const LearningCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);
  const { user } = useAuth();
  const { enroll, isEnrolled } = useEnrollment();
  const [enrollingPathId, setEnrollingPathId] = useState<string | null>(null);
  const [enrollModal, setEnrollModal] = useState<{ open: boolean; pathId: string; title: string }>({
    open: false,
    pathId: '',
    title: '',
  });

  const isLoggedIn = !!user;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="relative min-h-screen text-[#0a1a12] bg-[#f8faf9] overflow-x-hidden font-sans">
      {/* ── Ambient background shapes ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-[0.06] blur-[120px]"
          style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }} />
        <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[100px]"
          style={{ background: 'radial-gradient(circle, #34d399 0%, transparent 70%)' }} />
      </div>

      {/* ── Top Navigation ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10">
        <button
          onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate('/certifications'); }}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700 hover:text-emerald-800 transition-colors duration-200 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Certifications
        </button>
      </div>

      {/* ── Hero Title ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0b1310] tracking-tight uppercase mb-4 leading-tight">
            Certification Programs
          </h1>
          <p className="text-sm md:text-base text-[#1a4a2e]/80 max-w-2xl mx-auto font-bold uppercase tracking-wider">
            Master clear communication, strategic thinking, and digital balance through structured learning
          </p>
        </motion.div>
      </section>

      {/* ── Course List ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 space-y-6 pb-24 lg:pb-32">
        <AnimatePresence mode="popLayout">
          {learningPaths.map((path, index) => {
            const pathImage = PATH_IMAGES[path.id] || '/learn1.png';
            const isHov = hovered === path.id;
            const enrolled = isEnrolled(path.id);

            return (
              <motion.div
                key={path.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
                onHoverStart={() => setHovered(path.id)}
                onHoverEnd={() => setHovered(null)}
                onClick={() => navigate(`/learn/${path.id}`)}
                className="group relative w-full rounded-3xl cursor-pointer flex flex-col lg:flex-row lg:h-[420px] shadow-xl hover:shadow-2xl transition-all duration-300 border border-emerald-100/50 bg-white/95 backdrop-blur-sm overflow-hidden"
                style={{
                  boxShadow: isHov
                    ? '0 25px 50px -12px rgba(16, 185, 129, 0.12), 0 0 30px rgba(16, 185, 129, 0.08)'
                    : '0 10px 30px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
                }}
              >
                {/* Left side fading image */}
                <div className="relative w-full lg:w-2/5 h-[240px] lg:h-full overflow-hidden flex-shrink-0 border-b lg:border-b-0 lg:border-r border-emerald-100/50">
                  <img
                    src={pathImage}
                    alt={path.title}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Right side content box */}
                <div className="relative z-20 w-full lg:w-3/5 p-6 lg:p-10 flex flex-col">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#0f7a55] bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100/80 shadow-sm">
                        <Award className="w-3.5 h-3.5" />
                        Certificate Available
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#0f7a55] bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100/80 shadow-sm">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Beginner Friendly
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#0f7a55] bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100/80 shadow-sm">
                        <BatteryCharging className="w-3.5 h-3.5" />
                        Progress Support
                      </span>
                    </div>

                    <h3 className="text-2xl lg:text-3xl font-black text-[#0a1a12] tracking-wide mb-3 leading-tight group-hover:text-[#0f7a55] transition-colors">
                      {path.title}
                    </h3>
                    <p className="text-sm lg:text-base text-[#3d5249]/80 leading-relaxed font-medium mb-5">
                      {path.description}
                    </p>

                    {/* Compact stats row */}
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#0f7a55] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        <BookOpen className="w-3 h-3" />
                        {path.modules ? path.modules.length : 5} Modules
                      </span>
                      <span className="text-[#3d5249]/40 font-bold text-sm">•</span>
                      <span className="text-[11px] font-bold text-[#3d5249]/70">20 Learning Units</span>
                      <span className="text-[#3d5249]/40 font-bold text-sm">•</span>
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#0f7a55]">
                        <Award className="w-3 h-3" />
                        Professional Certificate
                      </span>
                    </div>
                  </div>

                  {/* Button — pinned to bottom */}
                  <div className="flex items-center justify-start lg:justify-end gap-3 pt-6 mt-auto flex-wrap">
                    {/* View Course Details Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/learn/${path.id}`);
                      }}
                      className="bg-transparent border border-[#0f7a55] text-[#0f7a55] hover:bg-[#0f7a55]/5 text-xs font-black uppercase py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all font-sans"
                    >
                      View Details
                    </motion.button>

                    {/* Enrollment Status Button */}
                    {enrolled ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/learn/${path.id}`);
                        }}
                        className="bg-[#0f7a55] text-white hover:bg-[#0b5e41] text-xs font-black uppercase py-3 px-6 rounded-full shadow-[0_4px_14px_rgba(15,122,85,0.30)] flex items-center justify-center gap-2 transition-all font-sans"
                      >
                        Continue Learning
                        <ChevronLeft className="w-4 h-4 rotate-180" />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={enrollingPathId === path.id}
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!isLoggedIn) {
                            setEnrollModal({ open: true, pathId: path.id, title: path.title });
                          } else {
                            try {
                              setEnrollingPathId(path.id);
                              await enroll(path.id);
                            } catch (err) {
                              console.error(err);
                            } finally {
                              setEnrollingPathId(null);
                            }
                          }
                        }}
                        className="bg-[#0f7a55] text-white hover:bg-[#0b5e41] text-xs font-black uppercase py-3 px-6 rounded-full shadow-[0_4px_14px_rgba(15,122,85,0.30)] flex items-center justify-center gap-2 transition-all font-sans disabled:opacity-50"
                      >
                        {enrollingPathId === path.id ? 'Enrolling...' : 'Enroll Now'}
                        <ChevronLeft className="w-4 h-4 rotate-180" />
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Hover Accent Line */}
                <div className="absolute top-0 left-0 w-1.5 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {learningPaths.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 text-emerald-800/60 font-sans"
          >
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-bold">No pathways found.</p>
          </motion.div>
        )}
      </section>

      {/* ── Premium Learn Footer ── */}
      <footer className="relative bg-[#040706] text-emerald-100/70 py-16 px-6 lg:px-20 border-t border-emerald-900/40 overflow-hidden">
        {/* Glow effects inside footer */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[100px]" />
          <div className="absolute top-0 right-1/4 w-[300px] h-[300px] rounded-full bg-emerald-500/3 blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-2 flex flex-col items-start pr-0 lg:pr-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">🌿</span>
              <span className="text-lg font-black text-white uppercase tracking-wider font-sans">Nirvaha Academy</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-4 leading-tight font-sans">
              Keep Learning. Keep Growing.
            </h3>
            <p className="text-emerald-100/60 text-[13.5px] leading-relaxed mb-6 font-light font-sans">
              Embark on structured learning paths designed to nurture emotional intelligence, strategic clarity, and focused mindfulness. Build lasting habits and practical capabilities.
            </p>
            <button
              onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate('/certifications'); }}
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
                { label: 'Decision Clarity', path: '/learn/decision-clarity-strategic-thinking' },
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
                { label: 'Success Stories', path: '/stories' },
                { label: 'Inner Journey', path: '/journey/anxiety' },
                { label: 'Temple of Balance', path: '/temple-of-balance' },
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
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="url(#ig-grad)">
                    <defs>
                      <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
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
            © 2026 Nirvaha Academy • Learn with Clarity • Grow with Purpose
          </p>
          <div className="flex gap-6 text-[12px] text-emerald-100/30 font-medium">
            <a href="#privacy" className="hover:text-emerald-100/60 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-emerald-100/60 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Enrollment Form Modal */}
      <EnrollmentFormModal
        open={enrollModal.open}
        onClose={() => setEnrollModal(m => ({ ...m, open: false }))}
        courseId={enrollModal.pathId}
        courseTitle={enrollModal.title}
        onEnrolled={() => {
          setEnrollModal(m => ({ ...m, open: false }));
          // Navigate to course detail after enrollment
          setTimeout(() => navigate(`/learn/${enrollModal.pathId}`), 300);
        }}
      />
    </div>
  );
};

export default LearningCatalogPage;
