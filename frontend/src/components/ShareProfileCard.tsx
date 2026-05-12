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
    { label: "Streak",       value: stats.streak,            unit: "days"  },
    { label: "Sessions",     value: stats.sessions,          unit: "total" },
    { label: "Meditation",   value: stats.meditationMinutes, unit: "mins"  },
    { label: "Sound Healing",value: stats.soundMinutes,      unit: "mins"  },
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
            className="relative max-w-[640px] w-full z-30 max-h-[92vh] overflow-y-auto"
            style={{ perspective: 1000, scrollbarWidth: "none" }}
          >
            <div className="rounded-[28px] overflow-hidden shadow-[0_36px_90px_rgba(0,0,0,0.45)]">

              {/* ── Hero banner — deep forest green ── */}
              <div className="relative overflow-hidden"
                style={{ background: "linear-gradient(145deg, #0B3D2E 0%, #0F5132 45%, #145A3C 100%)" }}>

                {/* Soft radial glow */}
                <motion.div
                  animate={{ opacity: [0.18, 0.32, 0.18] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 70% 0%, rgba(82,183,136,0.28) 0%, transparent 60%)" }}
                />
                <motion.div
                  animate={{ opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full blur-3xl pointer-events-none"
                  style={{ background: "rgba(116,198,157,0.2)" }}
                />

                {/* Close */}
                <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white z-20"
                  style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <X className="w-3.5 h-3.5" />
                </motion.button>

                {/* Nirvaha wordmark */}
                <div className="absolute top-4 left-5 z-10">
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase"
                    style={{ color: "rgba(149,213,178,0.7)", fontFamily: "'Cinzel', serif" }}>
                    Nirvaha
                  </span>
                </div>

                {/* Avatar + identity */}
                <div className="relative z-10 px-7 pt-12 pb-7">
                  <div className="flex items-center gap-5">
                    {/* Avatar */}
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 18 }}
                      className="relative flex-shrink-0"
                    >
                      {/* Outer ring */}
                      <div className="absolute -inset-1.5 rounded-[22px] opacity-50"
                        style={{ background: "linear-gradient(135deg, #52B788, #2D6A4F)" }} />
                      <div className="relative w-[80px] h-[80px] rounded-[18px] flex items-center justify-center text-white text-2xl font-black shadow-xl"
                        style={{ background: "linear-gradient(145deg, #1B4332, #0B3D2E)", border: "2px solid rgba(82,183,136,0.5)" }}>
                        {initials}
                      </div>
                      {/* Active dot */}
                      <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2.2, repeat: Infinity }}
                        className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2"
                        style={{ background: "#52B788", borderColor: "#0B3D2E" }} />
                    </motion.div>

                    {/* Name / title / meta */}
                    <motion.div
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.28, type: "spring" }}
                      className="flex-1 min-w-0"
                    >
                      <h2 className="font-black text-[26px] sm:text-[30px] tracking-tight leading-tight break-words mb-1"
                        style={{ color: "#E8F5EE", fontFamily: "'Playfair Display', serif" }}>
                        {userName}
                      </h2>
                      <p className="text-[13px] font-medium leading-snug break-words mb-2.5"
                        style={{ color: "rgba(149,213,178,0.85)" }}>
                        {userTitle}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {userLocation && (
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-medium"
                            style={{ background: "rgba(82,183,136,0.15)", color: "rgba(149,213,178,0.9)", border: "1px solid rgba(82,183,136,0.25)" }}>
                            📍 {userLocation}
                          </span>
                        )}
                        {userEmail && (
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-medium truncate max-w-[200px]"
                            style={{ background: "rgba(82,183,136,0.15)", color: "rgba(149,213,178,0.9)", border: "1px solid rgba(82,183,136,0.25)" }}>
                            ✉️ {userEmail}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Divider */}
                  <div className="mt-6 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(82,183,136,0.3), transparent)" }} />
                </div>
              </div>

              {/* ── Stats body — clean white ── */}
              <div className="bg-white px-7 py-6">

                {/* 4 stat tiles — uniform white cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {statItems.map(({ label, value, unit }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 18, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.07, type: "spring", stiffness: 260, damping: 20 }}
                      whileHover={{ y: -3, scale: 1.02 }}
                      className="rounded-2xl p-4 text-center"
                      style={{
                        background: "#F8FBF9",
                        border: "1px solid rgba(82,183,136,0.18)",
                        boxShadow: "0 2px 12px rgba(20,90,50,0.06)",
                      }}
                    >
                      <div className="font-black text-[28px] leading-none tabular-nums" style={{ color: "#0B3D2E" }}>
                        <StatCounter value={value} />
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-widest mt-1.5" style={{ color: "#52B788" }}>{unit}</div>
                      <div className="text-[10px] font-semibold mt-1 leading-tight" style={{ color: "#4B5563" }}>{label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Wellness score — forest green panel */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, type: "spring" }}
                  className="rounded-2xl p-5 mb-5 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #0B3D2E 0%, #145A3C 55%, #1A6B47 100%)",
                    boxShadow: "0 10px 30px rgba(11,61,46,0.3)",
                  }}
                >
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-y-0 -left-20 w-20 blur-lg pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)" }}
                    animate={{ x: [0, 620] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
                  />

                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-[9px] font-black uppercase tracking-[0.22em] mb-1"
                        style={{ color: "rgba(149,213,178,0.7)" }}>
                        Wellness Score
                      </p>
                      <div className="flex items-baseline gap-1.5 mb-3">
                        <span className="font-black text-[48px] leading-none tabular-nums" style={{ color: "#E8F5EE" }}>
                          <StatCounter value={score} duration={2000} />
                        </span>
                        <span className="text-base font-bold" style={{ color: "rgba(255,255,255,0.25)" }}>/100</span>
                      </div>
                      {/* Progress bar */}
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ delay: 0.8, duration: 1.4, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ background: "linear-gradient(90deg, #52B788, #95D5B2)" }}
                        />
                      </div>
                    </div>

                    {/* Circular ring */}
                    <div className="relative w-[72px] h-[72px] flex-shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
                        <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                        <motion.circle cx="36" cy="36" r="28" fill="none"
                          stroke="#74C69D" strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - score / 100) }}
                          transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[12px] font-black leading-none" style={{ color: "#E8F5EE" }}>{score}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Share buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={shareOnLinkedIn}
                    className="flex items-center justify-center gap-2.5 py-3.5 text-white rounded-2xl font-bold text-sm"
                    style={{ background: "linear-gradient(135deg, #0A66C2, #004182)", boxShadow: "0 4px 16px rgba(10,102,194,0.3)" }}
                  >
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

                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={shareOnInstagram}
                    className="flex items-center justify-center gap-2.5 py-3.5 text-white rounded-2xl font-bold text-sm"
                    style={{ background: "linear-gradient(135deg, #833AB4, #E1306C 55%, #F77737)", boxShadow: "0 4px 16px rgba(225,48,108,0.25)" }}
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
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
