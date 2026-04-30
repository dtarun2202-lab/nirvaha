import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, Pause, CheckCircle, Wind, Flame, Moon, Star, Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import BACKEND_CONFIG from "../config/backend";

interface MeditationSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: {
    title: string;
    duration: string;
    type: string;
    sessionType?: string;
    icon: any;
  } | null;
}

export function MeditationSessionModal({ isOpen, onClose, session }: MeditationSessionModalProps) {
  const { user, refreshProfile } = useAuth();
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");

  // Initialize session
  useEffect(() => {
    if (isOpen && session) {
      const durationSeconds = 60; // 1 minute for demo
      setTimeLeft(durationSeconds);
      setTotalDuration(durationSeconds);
      setIsPaused(false);
      setIsCompleted(false);
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsLoaded(false);
    }
  }, [isOpen, session]);

  // Breathing Phase Logic
  useEffect(() => {
    if (isOpen && !isPaused && !isCompleted && (session?.sessionType === "breath" || session?.title.includes("Breath"))) {
      const interval = setInterval(() => {
        setBreathPhase((prev) => {
          if (prev === "Inhale") return "Hold";
          if (prev === "Hold") return "Exhale";
          return "Inhale";
        });
      }, 4000); // 4 seconds per phase
      return () => clearInterval(interval);
    }
  }, [isOpen, isPaused, isCompleted, session]);

  // Timer logic
  useEffect(() => {
    let timer: any;
    if (isOpen && isLoaded && !isPaused && !isCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, isLoaded, isPaused, isCompleted, timeLeft]);

  // Handle completion
  useEffect(() => {
    if (isOpen && isLoaded && timeLeft === 0 && !isCompleted) {
      handleComplete();
    }
  }, [timeLeft, isOpen, isLoaded, isCompleted]);

  const handleComplete = async () => {
    if (!isLoaded || isCompleted) return;
    setIsCompleted(true);
    
    const sessionDuration = parseInt(session?.duration || "10");
    const sessionType = session?.sessionType || 'meditation';
    
    try {
      let apiUrl = `${BACKEND_CONFIG.API_BASE_URL}/api/profile/log-session`;
      
      // Use sound-specific endpoint for sound sessions (≥1 min)
      if (sessionType === 'sound' && sessionDuration >= 1) {
        apiUrl = `${BACKEND_CONFIG.API_BASE_URL}/api/profile/log-sound-session`;
      }
      
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          duration: sessionDuration,
          sessionType: sessionType
        })
      });
      if (res.ok) refreshProfile();
    } catch (err) {
      console.error("Failed to log session:", err);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;

  return (
    <AnimatePresence>
      {isOpen && session && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#064E3B]/20 backdrop-blur-xl"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-[32px] shadow-lg max-w-[520px] w-full overflow-hidden border border-white/40"
            style={{ background: "radial-gradient(circle at center, #F0FDF4 0%, #FFFFFF 100%)" }}
          >
            {/* Header Area */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-3 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/60 shadow-sm">
                <div className="w-6 h-6 bg-[#2D6A4F] rounded-lg flex items-center justify-center shadow-sm">
                  <session.icon className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="text-[#1B4332] text-xs font-black leading-tight">{session.title}</h4>
                  <p className="text-[8px] font-bold text-[#2D6A4F] uppercase tracking-widest opacity-60">Step 2 of 5</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 bg-white/60 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-500 border border-white/80 shadow-sm transition-all"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="p-8 pt-24 flex flex-col items-center">
              {isCompleted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-6"
                >
                  <div className="w-20 h-20 bg-[#F0FDF4] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-900/10">
                    <CheckCircle className="w-10 h-10 text-[#16a34a]" />
                  </div>
                  <h2 className="text-[#1B4332] text-xl font-black mb-1 tracking-tight">Well Done, {user?.name?.split(" ")[0]}!</h2>
                  <p className="text-[#2D6A4F] font-bold text-xs opacity-60 mb-6">You've successfully completed your mindfulness practice.</p>
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-[#1B4332] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all font-black text-sm"
                  >
                    Close Session
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* CENTRAL ANIMATION AREA */}
                  <div className="relative w-52 h-52 flex items-center justify-center mb-10">
                    {/* Progress Ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="104" cy="104" r="96"
                        className="stroke-[#2D6A4F]/5"
                        strokeWidth="4"
                        fill="none"
                      />
                      <motion.circle
                        cx="104" cy="104" r="96"
                        className="stroke-[#2D6A4F]"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray="603.19"
                        initial={{ strokeDashoffset: 603.19 }}
                        animate={{ strokeDashoffset: 603.19 - (603.19 * progress) / 100 }}
                        transition={{ duration: 1 }}
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* 1. Breathing Guide (Morning Breath Work) */}
                    {(session.sessionType === "breath" || session.title.includes("Breath")) && (
                      <div className="relative flex flex-col items-center">
                        <motion.div
                          animate={{
                            scale: isPaused ? 1 : breathPhase === "Inhale" ? 1.3 : breathPhase === "Hold" ? 1.3 : 1,
                            backgroundColor: breathPhase === "Inhale" ? "#52B788" : breathPhase === "Exhale" ? "#B7E4C7" : "#40916C"
                          }}
                          transition={{ duration: 4, ease: "easeInOut" }}
                          className="w-40 h-40 rounded-full shadow-lg flex flex-col items-center justify-center text-white relative z-10"
                        >
                          <Wind className="w-10 h-10 mb-1 opacity-80" />
                          <span className="text-sm font-black uppercase tracking-widest">{breathPhase}</span>
                          
                          {/* Inner Pulse */}
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-white/20"
                          />
                        </motion.div>
                        
                        {/* Glow Rings */}
                        <motion.div
                          animate={{ scale: breathPhase === "Inhale" ? 1.5 : 1.1, opacity: [0.1, 0.2, 0.1] }}
                          transition={{ duration: 4 }}
                          className="absolute w-40 h-40 rounded-full bg-[#52B788]/20 blur-lg"
                        />
                      </div>
                    )}

                    {/* 2. Chakra Alignment (Energy Flow) */}
                    {(session.sessionType === "chakra" || session.title.includes("Chakra")) && (
                      <div className="relative flex flex-col items-center justify-center w-full h-full">
                        {/* Rotating Aura */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="absolute w-48 h-48 border-2 border-dashed border-[#2D6A4F]/20 rounded-full"
                        />
                        
                        {/* Chakra Dots */}
                        <div className="flex flex-col gap-4 relative z-10">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <motion.div
                              key={i}
                              animate={{
                                opacity: isPaused ? 0.3 : [0.3, 1, 0.3],
                                scale: [1, 1.2, 1],
                                boxShadow: ["0 0 0px rgba(45, 106, 79, 0)", "0 0 20px rgba(45, 106, 79, 0.4)", "0 0 0px rgba(45, 106, 79, 0)"]
                              }}
                              transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                              className="w-4 h-4 rounded-full bg-[#2D6A4F]"
                            />
                          ))}
                        </div>
                        
                        {/* Rising Energy Effect */}
                        <motion.div
                          animate={{ y: [-40, -140], opacity: [0, 0.6, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          className="absolute bottom-20 w-1 h-20 bg-gradient-to-t from-transparent via-[#52B788] to-transparent blur-sm"
                        />
                      </div>
                    )}

                    {/* 3. Evening Relaxation (Sleep Mode) */}
                    {(session.sessionType === "relax" || session.title.includes("Relaxation")) && (
                      <div className="relative flex items-center justify-center w-full h-full">
                        {/* Particle Stars */}
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              y: [0, Math.random() * -100 - 50],
                              x: [0, (Math.random() - 0.5) * 100],
                              opacity: [0, 0.8, 0],
                              scale: [0, 1, 0]
                            }}
                            transition={{
                              duration: 5 + Math.random() * 3,
                              repeat: Infinity,
                              delay: i * 0.5
                            }}
                            className="absolute"
                          >
                            <Star className="w-3 h-3 text-[#2D6A4F] fill-[#2D6A4F] opacity-40" />
                          </motion.div>
                        ))}
                        
                        <motion.div
                          animate={{
                            scale: [1, 1.05, 1],
                            boxShadow: ["0 0 20px rgba(45, 106, 79, 0.1)", "0 0 40px rgba(45, 106, 79, 0.2)", "0 0 20px rgba(45, 106, 79, 0.1)"]
                          }}
                          transition={{ duration: 8, repeat: Infinity }}
                          className="w-36 h-36 bg-white border-2 border-[#2D6A4F]/10 rounded-full flex flex-col items-center justify-center text-[#2D6A4F] shadow-inner"
                        >
                          <Moon className="w-8 h-8 mb-1 opacity-60" />
                          <span className="text-[9px] font-black uppercase tracking-widest opacity-60 italic">Let go...</span>
                        </motion.div>
                      </div>
                    )}
                  </div>

                  {/* Timer & Controls */}
                  <div className="text-center">
                    <div className="text-6xl font-black text-[#1B4332] tabular-nums mb-4 tracking-tighter">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="bg-white/40 backdrop-blur-sm px-5 py-2 rounded-xl border border-white/60 shadow-sm mb-8 inline-block">
                      <p className="text-xs font-black text-[#2D6A4F] uppercase tracking-[0.2em]">
                        {isPaused ? "Paused" : 
                          (session.sessionType === "breath" || session.title.includes("Breath")) ? "Focus on your breath" :
                          (session.sessionType === "chakra" || session.title.includes("Chakra")) ? "Align your inner energy" :
                          "Release and find stillness"
                        }
                      </p>
                    </div>

                    <div className="flex items-center gap-3 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsPaused(!isPaused)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/40 transition-all ${
                          isPaused ? "bg-[#1B4332] text-white" : "bg-white/60 text-[#1B4332]"
                        }`}
                      >
                        {isPaused ? <Play className="w-6 h-6 ml-0.5" /> : <Pause className="w-6 h-6" />}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "#dcfce7" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="px-8 py-3 bg-green-50 text-green-700 rounded-xl font-black text-sm shadow-lg shadow-green-900/10 border border-green-100 transition-all"
                      >
                        End Session
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
