import { motion, AnimatePresence } from "motion/react";
import { X, Check, Linkedin, Instagram } from "lucide-react";
import { useState, useEffect } from "react";

interface ShareProfileCardProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userTitle: string;
  userEmail: string;
  userLocation: string;
  stats: {
    sessions: number;
    streak: number;
    totalTime: string;
    wellnessScore: number;
    meditationMinutes: number;
    soundMinutes: number;
  };
}

// ── Animated counter ──────────────────────────────────────────────────────
const StatCounter = ({ value, duration = 1600 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!value || value <= 0) { setCount(0); return; }
    let start = 0;
    const stepTime = Math.max(8, Math.floor(duration / value));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= value) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);
  return <>{count}</>;
};

// ── Particle config ───────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  angle: (i / 24) * 360,
  dist: 70 + Math.random() * 50,
  size: 3 + Math.random() * 4,
  color: ["#52B788", "#2D6A4F", "#74C69D", "#1B4332", "#95D5B2", "#B7E4C7"][i % 6],
  delay: Math.random() * 0.12,
}));

const SYMBOLS = ["✦", "◆", "✧", "✦", "◆", "✧", "✦"];

export function ShareProfileCard({
  isOpen, onClose, userName, userTitle, userEmail, userLocation, stats,
}: ShareProfileCardProps) {
  const [shareFeedback, setShareFeedback] = useState<"none" | "linkedin" | "instagram">("none");
  const [burstDone, setBurstDone] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBurstDone(false);
      const t = setTimeout(() => setBurstDone(true), 800);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const shareOnLinkedIn = async () => {
    const shareUrl = window.location.href;
    const text = `${userName}'s Nirvaha wellness profile`;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
    await navigator.clipboard.writeText(`${text} - ${shareUrl}`);
    setShareFeedback("linkedin");
    setTimeout(() => setShareFeedback("none"), 2000);
  };

  const shareOnInstagram = async () => {
    const shareText = `${userName}'s Nirvaha wellness profile: ${window.location.href}`;
    await navigator.clipboard.writeText(shareText);
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    setShareFeedback("instagram");
    setTimeout(() => setShareFeedback("none"), 2000);
  };

  const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const score = Math.min(100, stats.wellnessScore);
  const statItems = [
    { label: "Streak", value: stats.streak, unit: "days" },
    { label: "Sessions", value: stats.sessions, unit: "total" },
    { label: "Meditation", value: stats.meditationMinutes, unit: "mins" },
    { label: "Sound healing", value: stats.soundMinutes, unit: "mins" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-lg"
          />

          {/* ── Burst effects (centered) ── */}
          {!burstDone && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              {/* Ripple rings */}
              {[0, 1, 2].map(i => (
                <motion.div key={`ring-${i}`}
                  initial={{ scale: 0.2, opacity: 0.9 }}
                  animate={{ scale: 4 + i, opacity: 0 }}
                  transition={{ duration: 0.65, delay: i * 0.13, ease: "easeOut" }}
                  className="absolute w-20 h-20 rounded-full border-2 border-[#52B788]"
                />
              ))}
              {/* Particles */}
              {PARTICLES.map(p => (
                <motion.div key={`p-${p.id}`}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{
                    x: Math.cos((p.angle * Math.PI) / 180) * p.dist,
                    y: Math.sin((p.angle * Math.PI) / 180) * p.dist,
                    scale: 0, opacity: 0,
                  }}
                  transition={{ duration: 0.6, delay: p.delay, ease: "easeOut" }}
                  style={{ width: p.size, height: p.size, background: p.color, borderRadius: "50%", position: "absolute" }}
                />
              ))}
              {/* Floating symbols */}
              {SYMBOLS.map((sym, i) => (
                <motion.span key={`sym-${i}`}
                  initial={{ y: 0, x: (i - 3) * 32, opacity: 1, scale: 1.2 }}
                  animate={{ y: -130 - i * 12, opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.85, delay: 0.04 + i * 0.07, ease: "easeOut" }}
                  className="absolute text-[#52B788] font-black text-xl select-none"
                >
                  {sym}
                </motion.span>
              ))}
            </div>
          )}

          {/* ── Card ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.65, y: 50, rotateX: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", stiffness: 280, damping: 22, mass: 0.85 }}
            className="relative max-w-[640px] w-full z-30"
            style={{ perspective: 1000 }}
          >
            <div className="rounded-[32px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.4)]">

              {/* ── Top hero band ── */}
              <div className="relative bg-gradient-to-br from-[#E7F9EF] via-[#D0F2DF] to-[#BFEACF] px-8 pt-8 pb-8 overflow-hidden">
                {/* Decorative orbs */}
                <motion.div
                  animate={{ x: [0, 14, 0], y: [0, -10, 0], opacity: [0.25, 0.45, 0.25] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-300/35 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{ x: [0, -12, 0], y: [0, 8, 0], opacity: [0.2, 0.35, 0.2] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-8 -left-8 w-36 h-36 bg-lime-200/35 rounded-full blur-2xl"
                />
                <motion.div
                  animate={{ opacity: [0.15, 0.32, 0.15] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.22),transparent_45%)]"
                />

                {/* Close */}
                <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="close-btn absolute top-5 right-5 w-9 h-9 bg-[#0F5132]/85 hover:bg-[#0B3D2E] rounded-full flex items-center justify-center text-white z-20 transition-colors border border-white/30 shadow-md">
                  <X className="w-4 h-4" />
                </motion.button>

                {/* Avatar + name */}
                <div className="flex items-start gap-4 relative z-10 mt-4 bg-white/38 backdrop-blur-[2px] rounded-[22px] p-4 border border-white/55 shadow-[0_8px_26px_rgba(22,101,52,0.12)]">
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.25, type: "spring", stiffness: 320, damping: 18 }}
                    className="relative"
                  >
                    <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-[#22C55E] via-[#16A34A] to-[#0F766E] flex items-center justify-center text-white text-2xl font-black shadow-xl border-2 border-white/70">
                      {initials}
                    </div>
                    {/* Online dot */}
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#22C55E] rounded-full border-2 border-[#0F766E]" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="min-w-0 flex-1"
                  >
                    <h2 className="text-[#0B3D2E] font-black text-[34px] sm:text-[38px] tracking-[-0.02em] leading-[1.15] mb-1 break-words">{userName}</h2>
                    <p className="text-[#145A43] text-[15px] leading-6 font-semibold mb-3 break-words">{userTitle}</p>
                    <div className="flex flex-wrap gap-2 pr-2">
                      <span className="text-[11px] text-[#1B5E48] bg-white/60 px-2.5 py-1 rounded-full border border-emerald-200/80">📍 {userLocation}</span>
                      <span className="text-[11px] text-[#1B5E48] bg-white/60 px-2.5 py-1 rounded-full truncate max-w-[220px] border border-emerald-200/80">✉️ {userEmail}</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* ── Stats section ── */}
              <div className="bg-gradient-to-b from-[#F6FFFA] to-[#EAF8F0] px-8 py-7">

                {/* 4 stat tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
                  {statItems.map(({ label, value, unit }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 20, scale: 0.88 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.35 + i * 0.08, type: "spring", stiffness: 260, damping: 20 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="bg-white rounded-[20px] p-4 shadow-[0_8px_24px_rgba(22,101,52,0.08)] border border-emerald-100/70 text-center"
                    >
                      <div className="text-[#0E3D2D] font-black text-3xl leading-none tabular-nums mt-1">
                        <StatCounter value={value} />
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2">{unit}</div>
                      <div className="text-[11px] text-gray-600 font-semibold mt-1">{label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Wellness score — hero row */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, type: "spring" }}
                  className="bg-gradient-to-r from-[#166534] via-[#15803D] to-[#0F766E] rounded-[24px] p-6 mb-6 relative overflow-hidden shadow-[0_14px_34px_rgba(21,128,61,0.32)]"
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest mb-1">Wellness Score</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-white font-black text-4xl tabular-nums">
                          <StatCounter value={score} duration={2000} />
                        </span>
                        <span className="text-white/40 text-sm font-bold">/100</span>
                      </div>
                    </div>
                    {/* Circular progress */}
                    <div className="relative w-16 h-16">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                        <motion.circle cx="32" cy="32" r="26" fill="none" stroke="#A7F3D0" strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 26}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - score / 100) }}
                          transition={{ delay: 0.8, duration: 1.4, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-emerald-100">
                        {score}%
                      </div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ delay: 0.85, duration: 1.3, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-emerald-200 to-lime-200 rounded-full"
                    />
                  </div>
                  <motion.div
                    className="absolute inset-y-0 -left-20 w-20 bg-white/20 blur-md"
                    animate={{ x: [0, 560] }}
                    transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
                  />
                </motion.div>

                {/* Action buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 }}
                  className="action-buttons grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={shareOnLinkedIn}
                    className="flex items-center justify-center gap-2 py-3.5 bg-[#0A66C2] text-white rounded-[16px] font-bold text-sm shadow-sm transition-all">
                    <AnimatePresence mode="wait">
                      {shareFeedback === "linkedin" ? (
                        <motion.span key="ln-ok" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-2">
                          <Check className="w-4 h-4" /> Copied + Opened
                        </motion.span>
                      ) : (
                        <motion.span key="ln" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-2">
                          <Linkedin className="w-4 h-4" /> LinkedIn
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={shareOnInstagram}
                    className="flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-white rounded-[16px] font-bold text-sm shadow-sm transition-all">
                    <AnimatePresence mode="wait">
                      {shareFeedback === "instagram" ? (
                        <motion.span key="ig-ok" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-2">
                          <Check className="w-4 h-4" /> Copied + Opened
                        </motion.span>
                      ) : (
                        <motion.span key="ig" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-2">
                          <Instagram className="w-4 h-4" /> Instagram
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
