import { motion, AnimatePresence } from "motion/react";
import { X, Check, Linkedin, Instagram, MapPin, Mail, Flame, Brain, Music2, TrendingUp } from "lucide-react";
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

  // Stat tiles with icons
  const statItems = [
    { label: "Day Streak",   value: stats.streak,            unit: "days",  icon: <Flame   className="w-4 h-4" />, color: "#F97316", bg: "#FFF7ED", border: "#FED7AA" },
    { label: "Sessions",     value: stats.sessions,          unit: "total", icon: <TrendingUp className="w-4 h-4" />, color: "#0EA5E9", bg: "#F0F9FF", border: "#BAE6FD" },
    { label: "Meditation",   value: stats.meditationMinutes, unit: "mins",  icon: <Brain   className="w-4 h-4" />, color: "#8B5CF6", bg: "#F5F3FF", border: "#DDD6FE" },
    { label: "Sound Healing",value: stats.soundMinutes,      unit: "mins",  icon: <Music2  className="w-4 h-4" />, color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0" },
  ];

  // Score tier label
  const scoreTier = score >= 80 ? "Elite" : score >= 60 ? "Advanced" : score >= 40 ? "Growing" : "Beginner";
  const scoreTierColor = score >= 80 ? "#F59E0B" : score >= 60 ? "#10B981" : score >= 40 ? "#0EA5E9" : "#94A3B8";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-xl"
          />

          {/* ── Burst effects ── */}
          {!burstDone && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              {[0, 1, 2].map(i => (
                <motion.div key={`ring-${i}`}
                  initial={{ scale: 0.2, opacity: 0.9 }}
                  animate={{ scale: 4 + i, opacity: 0 }}
                  transition={{ duration: 0.65, delay: i * 0.13, ease: "easeOut" }}
                  className="absolute w-20 h-20 rounded-full border-2 border-[#52B788]"
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
            className="relative max-w-[660px] w-full z-30 max-h-[92vh] overflow-y-auto"
            style={{ perspective: 1000, scrollbarWidth: "none" }}
          >
            <div className="rounded-[28px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.55)]">

              {/* ── LinkedIn-style top banner ── */}
              <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0A66C2 0%, #004182 60%, #002D62 100%)" }}>
                {/* Subtle mesh pattern */}
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }}
                />
                {/* Glow orbs */}
                <motion.div animate={{ opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl"
                  style={{ background: "radial-gradient(circle, #38BDF8 0%, transparent 70%)" }}
                />
                <motion.div animate={{ opacity: [0.1, 0.22, 0.1] }} transition={{ duration: 5.5, repeat: Infinity }}
                  className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full blur-2xl"
                  style={{ background: "radial-gradient(circle, #818CF8 0%, transparent 70%)" }}
                />

                {/* Close button */}
                <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white z-20 transition-colors"
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
                  <X className="w-3.5 h-3.5" />
                </motion.button>

                {/* Nirvaha brand tag */}
                <div className="absolute top-4 left-5 flex items-center gap-1.5 z-10">
                  <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center">
                    <span className="text-white text-[9px] font-black">N</span>
                  </div>
                  <span className="text-white/70 text-[10px] font-semibold tracking-widest uppercase">Nirvaha</span>
                </div>

                {/* Profile hero */}
                <div className="relative z-10 px-6 pt-12 pb-6">
                  <div className="flex items-end gap-4">
                    {/* Avatar */}
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 18 }}
                      className="relative flex-shrink-0"
                    >
                      <div className="w-[88px] h-[88px] rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-2xl"
                        style={{ background: "linear-gradient(135deg, #22C55E, #0F766E)", border: "3px solid rgba(255,255,255,0.35)" }}>
                        {initials}
                      </div>
                      {/* Verified badge */}
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-[#0A66C2] border-2 border-white flex items-center justify-center shadow-md">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    </motion.div>

                    {/* Name + title */}
                    <motion.div
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.28, type: "spring" }}
                      className="flex-1 min-w-0 pb-1"
                    >
                      <h2 className="text-white font-black text-2xl sm:text-[28px] tracking-tight leading-tight break-words mb-0.5">
                        {userName}
                      </h2>
                      <p className="text-blue-200 text-[13px] font-medium leading-snug break-words mb-2">{userTitle}</p>
                      <div className="flex flex-wrap gap-2">
                        {userLocation && (
                          <span className="flex items-center gap-1 text-[11px] text-blue-100/80 font-medium">
                            <MapPin className="w-3 h-3" /> {userLocation}
                          </span>
                        )}
                        {userEmail && (
                          <span className="flex items-center gap-1 text-[11px] text-blue-100/80 font-medium truncate max-w-[200px]">
                            <Mail className="w-3 h-3" /> {userEmail}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Wellness tier badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold"
                    style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}
                  >
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: scoreTierColor }} />
                    <span style={{ color: scoreTierColor }}>{scoreTier} Wellness Practitioner</span>
                    <span className="text-white/40">·</span>
                    <span className="text-white/70">Nirvaha Certified</span>
                  </motion.div>
                </div>
              </div>

              {/* ── Stats body ── */}
              <div style={{ background: "linear-gradient(180deg, #F8FFFE 0%, #EEF9F4 100%)" }} className="px-6 py-6">

                {/* 4 stat tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {statItems.map(({ label, value, unit, icon, color, bg, border }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 18, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.07, type: "spring", stiffness: 260, damping: 20 }}
                      whileHover={{ y: -3, scale: 1.03 }}
                      className="rounded-2xl p-3.5 text-center"
                      style={{ background: bg, border: `1px solid ${border}`, boxShadow: `0 4px 16px ${color}18` }}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}18`, color }}>
                          {icon}
                        </div>
                      </div>
                      <div className="font-black text-2xl leading-none tabular-nums" style={{ color: "#0F172A" }}>
                        <StatCounter value={value} />
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-wider mt-1" style={{ color: `${color}99` }}>{unit}</div>
                      <div className="text-[10px] font-semibold mt-0.5 text-slate-500 leading-tight">{label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Wellness score hero */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.58, type: "spring" }}
                  className="rounded-2xl p-5 mb-5 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0C4A6E 100%)",
                    boxShadow: "0 12px 32px rgba(10,102,194,0.28)",
                  }}
                >
                  {/* Shimmer sweep */}
                  <motion.div
                    className="absolute inset-y-0 -left-24 w-24 blur-lg"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }}
                    animate={{ x: [0, 700] }}
                    transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                  />

                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-blue-300 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Overall Wellness Score</p>
                      <div className="flex items-baseline gap-1.5 mb-3">
                        <span className="text-white font-black text-5xl tabular-nums leading-none">
                          <StatCounter value={score} duration={2000} />
                        </span>
                        <span className="text-white/30 text-lg font-bold">/100</span>
                      </div>
                      {/* Segmented progress bar */}
                      <div className="flex gap-1">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="h-1.5 flex-1 rounded-full"
                            initial={{ opacity: 0.15 }}
                            animate={{ opacity: i < Math.round(score / 10) ? 1 : 0.15 }}
                            transition={{ delay: 0.9 + i * 0.06, duration: 0.3 }}
                            style={{
                              background: i < Math.round(score / 10)
                                ? `linear-gradient(90deg, #38BDF8, #34D399)`
                                : "rgba(255,255,255,0.1)"
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Circular ring */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
                        <motion.circle cx="40" cy="40" r="32" fill="none"
                          stroke="url(#scoreGrad)" strokeWidth="7"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 32}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - score / 100) }}
                          transition={{ delay: 0.75, duration: 1.5, ease: "easeOut" }}
                        />
                        <defs>
                          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#38BDF8" />
                            <stop offset="100%" stopColor="#34D399" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[11px] font-black text-white leading-none">{score}%</span>
                        <span className="text-[8px] text-blue-300 font-semibold mt-0.5">score</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Share buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.72 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {/* LinkedIn — primary CTA */}
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(10,102,194,0.45)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={shareOnLinkedIn}
                    className="relative flex items-center justify-center gap-2.5 py-3.5 text-white rounded-2xl font-bold text-sm overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #0A66C2 0%, #004182 100%)", boxShadow: "0 4px 18px rgba(10,102,194,0.35)" }}
                  >
                    {/* Shine */}
                    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                      style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)" }} />
                    <AnimatePresence mode="wait">
                      {shareFeedback === "linkedin" ? (
                        <motion.span key="ln-ok" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-2">
                          <Check className="w-4 h-4" /> Shared to LinkedIn
                        </motion.span>
                      ) : (
                        <motion.span key="ln" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-2">
                          <Linkedin className="w-4 h-4" /> Share on LinkedIn
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Instagram */}
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(225,48,108,0.35)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={shareOnInstagram}
                    className="flex items-center justify-center gap-2.5 py-3.5 text-white rounded-2xl font-bold text-sm"
                    style={{ background: "linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #F77737 100%)", boxShadow: "0 4px 18px rgba(225,48,108,0.28)" }}
                  >
                    <AnimatePresence mode="wait">
                      {shareFeedback === "instagram" ? (
                        <motion.span key="ig-ok" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-2">
                          <Check className="w-4 h-4" /> Copied + Opened
                        </motion.span>
                      ) : (
                        <motion.span key="ig" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-2">
                          <Instagram className="w-4 h-4" /> Share on Instagram
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>

                {/* Footer note */}
                <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
                  Sharing your wellness journey inspires others ✦
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
