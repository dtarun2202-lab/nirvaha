import { motion, AnimatePresence } from "motion/react";
import { X, Check, Linkedin, Instagram, MapPin, Mail, Flame, Sparkles, Clock, Music2, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { getInitials } from "@/lib/getInitials";

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
  color: ["#86EFAC", "#6EE7B7", "#A7F3D0", "#BBF7D0", "#D1FAE5", "#ECFDF5"][i % 6],
  delay: Math.random() * 0.12,
}));

const SYMBOLS = ["✦", "◆", "✧", "✦", "◆", "✧", "✦"];

// ── Stat card icon map ────────────────────────────────────────────────────
const statConfig = [
  {
    label: "Days Streak",
    unit: "days",
    icon: Flame,
    gradient: "from-orange-50 to-amber-50",
    iconBg: "from-orange-200 to-amber-200",
    iconColor: "text-orange-600",
    valueColor: "text-orange-700",
    unitColor: "text-orange-500",
    labelColor: "text-orange-800",
    border: "border-orange-200",
  },
  {
    label: "Total Sessions",
    unit: "total",
    icon: Sparkles,
    gradient: "from-violet-50 to-purple-50",
    iconBg: "from-violet-200 to-purple-200",
    iconColor: "text-violet-600",
    valueColor: "text-violet-700",
    unitColor: "text-violet-500",
    labelColor: "text-violet-800",
    border: "border-violet-200",
  },
  {
    label: "Meditation",
    unit: "mins",
    icon: Clock,
    gradient: "from-emerald-50 to-teal-50",
    iconBg: "from-emerald-200 to-teal-200",
    iconColor: "text-emerald-700",
    valueColor: "text-emerald-800",
    unitColor: "text-emerald-600",
    labelColor: "text-emerald-900",
    border: "border-emerald-200",
  },
  {
    label: "Sound Healing",
    unit: "mins",
    icon: Music2,
    gradient: "from-sky-50 to-cyan-50",
    iconBg: "from-sky-200 to-cyan-200",
    iconColor: "text-sky-600",
    valueColor: "text-sky-700",
    unitColor: "text-sky-500",
    labelColor: "text-sky-800",
    border: "border-sky-200",
  },
];

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
    window.open("https://www.instagram.com/saieshwar_universe_/", "_blank", "noopener,noreferrer");
    setShareFeedback("instagram");
    setTimeout(() => setShareFeedback("none"), 2000);
  };

  const initials = getInitials(userName);
  const score = Math.min(100, stats.wellnessScore);
  const statValues = [stats.streak, stats.sessions, stats.meditationMinutes, stats.soundMinutes];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/30 backdrop-blur-xl"
          />

          {/* ── Burst effects ── */}
          {!burstDone && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              {[0, 1, 2].map(i => (
                <motion.div key={`ring-${i}`}
                  initial={{ scale: 0.2, opacity: 0.7 }}
                  animate={{ scale: 4 + i, opacity: 0 }}
                  transition={{ duration: 0.65, delay: i * 0.13, ease: "easeOut" }}
                  className="absolute w-20 h-20 rounded-full border-2 border-emerald-300"
                />
              ))}
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
              {SYMBOLS.map((sym, i) => (
                <motion.span key={`sym-${i}`}
                  initial={{ y: 0, x: (i - 3) * 32, opacity: 1, scale: 1.2 }}
                  animate={{ y: -130 - i * 12, opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.85, delay: 0.04 + i * 0.07, ease: "easeOut" }}
                  className="absolute text-emerald-400 font-black text-xl select-none"
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
            {/* Outer glow ring */}
            <div className="absolute -inset-[1px] rounded-[34px] bg-gradient-to-br from-emerald-200 via-teal-100 to-lime-200 opacity-70 blur-[2px]" />

            <div className="relative rounded-[32px] overflow-hidden shadow-[0_24px_64px_rgba(16,185,129,0.15),0_8px_32px_rgba(0,0,0,0.08)] bg-white">

              {/* ── Top hero band ── */}
              <div className="relative bg-gradient-to-br from-[#F0FDF8] via-[#ECFDF5] to-[#F0FFF4] px-7 pt-7 pb-7 overflow-hidden">

                {/* Decorative orbs */}
                <motion.div
                  animate={{ x: [0, 14, 0], y: [0, -10, 0], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-12 -right-12 w-52 h-52 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none"
                />
                <motion.div
                  animate={{ x: [0, -10, 0], y: [0, 8, 0], opacity: [0.2, 0.38, 0.2] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-200/35 rounded-full blur-2xl pointer-events-none"
                />
                <motion.div
                  animate={{ opacity: [0.12, 0.25, 0.12] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-lime-100/50 rounded-full blur-3xl pointer-events-none"
                />

                {/* Nirvaha brand tag */}
                <div className="flex items-center justify-between mb-5 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-1.5 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-bold text-emerald-800 tracking-wide uppercase">Nirvaha Wellness</span>
                  </motion.div>

                  {/* Close — minimal glass control */}
                  <motion.button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    initial={{ opacity: 0.92 }}
                    whileHover={{
                      scale: 1.045,
                      opacity: 1,
                      transition: { type: "spring", stiffness: 400, damping: 26 },
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ opacity: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }}
                    className="relative z-20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/55 bg-white/20 text-emerald-900/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-md transition-[box-shadow,background-color,border-color,color] duration-300 ease-out hover:border-emerald-100/70 hover:bg-emerald-50/35 hover:text-emerald-900/70 hover:shadow-[0_0_0_1px_rgba(167,243,208,0.28),0_4px_20px_rgba(16,185,129,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200/60"
                  >
                    <X className="h-[13px] w-[13px]" strokeWidth={1.15} strokeLinecap="round" aria-hidden />
                  </motion.button>
                </div>

                {/* Avatar + name card */}
                <div className="flex items-start gap-4 relative z-10 bg-white/60 backdrop-blur-md rounded-[22px] p-4 border border-white/80 shadow-[0_4px_20px_rgba(16,185,129,0.08)]">

                  {/* Avatar */}
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.25, type: "spring", stiffness: 320, damping: 18 }}
                    className="relative flex-shrink-0"
                  >
                    <div className="w-[72px] h-[72px] rounded-[20px] bg-gradient-to-br from-emerald-300 via-teal-300 to-cyan-300 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-emerald-200/60 border-2 border-white">
                      {initials}
                    </div>
                    {/* Online dot */}
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm"
                    />
                  </motion.div>

                  {/* Name & info */}
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="min-w-0 flex-1"
                  >
                    <h2 className="text-gray-800 font-black text-[28px] sm:text-[32px] tracking-[-0.02em] leading-[1.15] mb-0.5 break-words">
                      {userName}
                    </h2>
                    <p className="text-emerald-600 text-[13px] leading-5 font-semibold mb-3 break-words">
                      {userTitle}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-600 bg-white/80 px-2.5 py-1 rounded-full border border-gray-200 shadow-sm font-medium">
                        <MapPin className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        {userLocation}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-600 bg-white/80 px-2.5 py-1 rounded-full border border-gray-200 shadow-sm font-medium truncate max-w-[200px]">
                        <Mail className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        {userEmail}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-emerald-100 to-transparent mx-7" />

              {/* ── Stats + Score section ── */}
              <div className="bg-gradient-to-b from-white to-[#F8FFFE] px-7 py-6">

                {/* Section label */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 mb-4"
                >
                  Wellness Journey
                </motion.p>

                {/* 4 stat tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {statConfig.map(({ label, unit, icon: Icon, gradient, iconBg, iconColor, valueColor, unitColor, labelColor, border }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 18, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.38 + i * 0.08, type: "spring", stiffness: 260, damping: 20 }}
                      whileHover={{ y: -3, scale: 1.03, transition: { duration: 0.2 } }}
                      className={`bg-gradient-to-br ${gradient} rounded-[18px] p-3.5 border ${border} shadow-sm text-center cursor-default`}
                    >
                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-[10px] bg-gradient-to-br ${iconBg} flex items-center justify-center mx-auto mb-2.5 shadow-sm`}>
                        <Icon className={`w-4 h-4 ${iconColor}`} />
                      </div>
                      {/* Value */}
                      <div className={`${valueColor} font-black text-2xl leading-none tabular-nums`}>
                        <StatCounter value={statValues[i]} />
                      </div>
                      {/* Unit */}
                      <div className={`text-[9px] ${unitColor} font-bold uppercase tracking-wider mt-1`}>{unit}</div>
                      {/* Label */}
                      <div className={`text-[10px] ${labelColor} font-semibold mt-0.5 leading-tight`}>{label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Wellness score card */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, type: "spring" }}
                  className="relative rounded-[22px] overflow-hidden mb-5"
                >
                  {/* Light gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(110,231,183,0.3),transparent_60%)]" />
                  <div className="absolute inset-[1px] rounded-[21px] border border-emerald-100/80" />

                  <div className="relative z-10 p-5 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-3.5 h-3.5 text-emerald-600" />
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-700">Wellness Score</p>
                      </div>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-gray-800 font-black text-4xl tabular-nums">
                          <StatCounter value={score} duration={2000} />
                        </span>
                        <span className="text-gray-500 text-sm font-bold">/100</span>
                      </div>
                      {/* Progress bar */}
                      <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ delay: 0.85, duration: 1.3, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full relative overflow-hidden"
                        >
                          {/* Shimmer */}
                          <motion.div
                            className="absolute inset-y-0 -left-8 w-8 bg-white/40 blur-sm skew-x-12"
                            animate={{ x: [0, 300] }}
                            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                          />
                        </motion.div>
                      </div>
                    </div>

                    {/* Circular progress */}
                    <div className="relative w-[68px] h-[68px] flex-shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 68 68">
                        <circle cx="34" cy="34" r="28" fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth="6" />
                        <motion.circle
                          cx="34" cy="34" r="28" fill="none"
                          stroke="url(#scoreGrad)"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - score / 100) }}
                          transition={{ delay: 0.8, duration: 1.4, ease: "easeOut" }}
                        />
                        <defs>
                          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#34D399" />
                            <stop offset="100%" stopColor="#06B6D4" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[11px] font-black text-emerald-700">{score}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Action buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.78 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {/* LinkedIn */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={shareOnLinkedIn}
                    className="relative flex items-center justify-center gap-2.5 py-3.5 rounded-[16px] font-bold text-sm overflow-hidden transition-all shadow-sm shadow-blue-100 border border-blue-200"
                    style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #EFF6FF 100%)" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 hover:opacity-100 transition-opacity" />
                    <AnimatePresence mode="wait">
                      {shareFeedback === "linkedin" ? (
                        <motion.span key="ln-ok" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-2 text-blue-700 relative z-10">
                          <Check className="w-4 h-4" /> Copied + Opened
                        </motion.span>
                      ) : (
                        <motion.span key="ln" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-2 text-blue-700 relative z-10">
                          <Linkedin className="w-4 h-4" /> Share on LinkedIn
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Instagram */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={shareOnInstagram}
                    className="relative flex items-center justify-center gap-2.5 py-3.5 rounded-[16px] font-bold text-sm overflow-hidden transition-all shadow-sm shadow-pink-100 border border-pink-200"
                    style={{ background: "linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 50%, #FDF2F8 100%)" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/5 to-pink-500/0 opacity-0 hover:opacity-100 transition-opacity" />
                    <AnimatePresence mode="wait">
                      {shareFeedback === "instagram" ? (
                        <motion.span key="ig-ok" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-2 text-pink-600 relative z-10">
                          <Check className="w-4 h-4" /> Copied + Opened
                        </motion.span>
                      ) : (
                        <motion.span key="ig" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-2 text-pink-600 relative z-10">
                          <Instagram className="w-4 h-4" /> Share on Instagram
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>

                {/* Footer note */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-center text-[10px] text-gray-500 mt-4 font-medium"
                >
                  ✦ Your wellness journey, beautifully shared
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
