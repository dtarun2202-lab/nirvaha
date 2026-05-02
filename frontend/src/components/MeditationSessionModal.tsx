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
      document.body.style.overflow = "hidden";
      const durationSeconds = 60; // 1 minute for demo
      setTimeLeft(durationSeconds);
      setTotalDuration(durationSeconds);
      setIsPaused(false);
      setIsCompleted(false);
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "unset";
      };
    } else {
      setIsLoaded(false);
      document.body.style.overflow = "unset";
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "radial-gradient(circle at center, #064E3B 0%, #022C22 100%)" }}
        >
          {/* Decorative background glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px]" />
          </div>

          {/* Close Button Top Right */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-lg transition-all hover:bg-white/20 z-50"
          >
            <X className="w-6 h-6" />
          </motion.button>

          {/* Header Area */}
          <div className="absolute top-8 left-8 flex items-center gap-4 z-20">
            <div className="w-12 h-12 bg-[#2D6A4F]/50 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
              <session.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-white text-xl font-black leading-tight">{session.title}</h4>
              <p className="text-xs font-bold text-green-300 uppercase tracking-widest opacity-80">Step 2 of 5</p>
            </div>
          </div>

          <div className="flex flex-col items-center w-full max-w-4xl px-6 relative z-10">
              {isCompleted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-6 text-white"
                >
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  </div>
                  <h2 className="text-white text-3xl font-black mb-2 tracking-tight">Well Done, {user?.name?.split(" ")[0]}!</h2>
                  <p className="text-green-200 font-bold text-sm opacity-80 mb-8">You've successfully completed your mindfulness practice.</p>
                  <button
                    onClick={onClose}
                    className="px-10 py-4 bg-white text-[#064E3B] rounded-2xl shadow-lg hover:shadow-xl transition-all font-black text-lg"
                  >
                    Close Session
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* CENTRAL ANIMATION AREA */}
                  <div className="relative w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[350px] md:h-[350px] flex items-center justify-center mb-8 md:mb-12">
                    {/* Progress Ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 500 500">
                      <circle
                        cx="250" cy="250" r="240"
                        className="stroke-white/10"
                        strokeWidth="8"
                        fill="none"
                      />
                      <motion.circle
                        cx="250" cy="250" r="240"
                        className="stroke-green-400"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray="1507.96"
                        initial={{ strokeDashoffset: 1507.96 }}
                        animate={{ strokeDashoffset: 1507.96 - (1507.96 * progress) / 100 }}
                        transition={{ duration: 1 }}
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* 1. Breathing Guide (Morning Breath Work) */}
                    {(session.sessionType === "breath" || session.title.includes("Breath")) && (
                      <div className="relative flex flex-col items-center justify-center w-full h-full">
                        <motion.div
                          animate={{
                            scale: isPaused ? 1 : breathPhase === "Inhale" ? 1.5 : breathPhase === "Hold" ? 1.5 : 1,
                            backgroundColor: breathPhase === "Inhale" ? "rgba(82, 183, 136, 0.9)" : breathPhase === "Exhale" ? "rgba(183, 228, 199, 0.8)" : "rgba(64, 145, 108, 0.9)"
                          }}
                          transition={{ duration: 4, ease: "easeInOut" }}
                          className="w-56 h-56 sm:w-72 sm:h-72 rounded-full shadow-2xl flex flex-col items-center justify-center text-white relative z-10 backdrop-blur-md border border-white/20"
                        >
                          <Wind className="w-16 h-16 sm:w-20 sm:h-20 mb-2 opacity-90" />
                          <span className="text-xl sm:text-2xl font-black uppercase tracking-[0.3em]">{breathPhase}</span>
                          
                          {/* Inner Pulse */}
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-white/20"
                          />
                        </motion.div>
                        
                        {/* Glow Rings */}
                        <motion.div
                          animate={{ scale: breathPhase === "Inhale" ? 2 : 1.2, opacity: [0.1, 0.3, 0.1] }}
                          transition={{ duration: 4 }}
                          className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-[#52B788]/30 blur-2xl"
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
                          className="absolute w-64 h-64 sm:w-80 sm:h-80 border-2 border-dashed border-white/20 rounded-full"
                        />
                        
                        {/* Chakra Dots */}
                        <div className="flex flex-col gap-6 relative z-10">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <motion.div
                              key={i}
                              animate={{
                                opacity: isPaused ? 0.3 : [0.3, 1, 0.3],
                                scale: [1, 1.5, 1],
                                boxShadow: ["0 0 0px rgba(255,255,255, 0)", "0 0 30px rgba(255,255,255, 0.6)", "0 0 0px rgba(255,255,255, 0)"]
                              }}
                              transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                              className="w-6 h-6 rounded-full bg-white"
                            />
                          ))}
                        </div>
                        
                        {/* Rising Energy Effect */}
                        <motion.div
                          animate={{ y: [-40, -200], opacity: [0, 0.8, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          className="absolute bottom-10 w-2 h-40 bg-gradient-to-t from-transparent via-green-400 to-transparent blur-md"
                        />
                      </div>
                    )}

                    {/* 3. Evening Relaxation (Sleep Mode) */}
                    {(session.sessionType === "relax" || session.title.includes("Relaxation")) && (
                      <div className="relative flex items-center justify-center w-full h-full">
                        {/* Particle Stars */}
                        {[...Array(20)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              y: [0, Math.random() * -200 - 100],
                              x: [0, (Math.random() - 0.5) * 200],
                              opacity: [0, 1, 0],
                              scale: [0, 1.5, 0]
                            }}
                            transition={{
                              duration: 5 + Math.random() * 3,
                              repeat: Infinity,
                              delay: i * 0.5
                            }}
                            className="absolute"
                          >
                            <Star className="w-4 h-4 text-white fill-white opacity-60" />
                          </motion.div>
                        ))}
                        
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            boxShadow: ["0 0 30px rgba(255,255,255, 0.1)", "0 0 60px rgba(255,255,255, 0.3)", "0 0 30px rgba(255,255,255, 0.1)"]
                          }}
                          transition={{ duration: 8, repeat: Infinity }}
                          className="w-48 h-48 sm:w-64 sm:h-64 bg-white/5 backdrop-blur-md border border-white/20 rounded-full flex flex-col items-center justify-center text-white shadow-2xl"
                        >
                          <Moon className="w-12 h-12 sm:w-16 sm:h-16 mb-2 opacity-80" />
                          <span className="text-sm sm:text-base font-black uppercase tracking-widest opacity-80 italic">Let go...</span>
                        </motion.div>
                      </div>
                    )}
                  </div>

                  <div className="text-center z-20">
                    <div className="text-5xl sm:text-6xl font-black text-white tabular-nums mb-4 tracking-tighter drop-shadow-lg">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-xl mb-10 inline-block">
                      <p className="text-sm sm:text-base font-black text-green-100 uppercase tracking-[0.3em]">
                        {isPaused ? "Paused" : 
                          (session.sessionType === "breath" || session.title.includes("Breath")) ? "Focus on your breath" :
                          (session.sessionType === "chakra" || session.title.includes("Chakra")) ? "Align your inner energy" :
                          "Release and find stillness"
                        }
                      </p>
                    </div>

                    <div className="flex items-center gap-4 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsPaused(!isPaused)}
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-md border transition-all ${
                          isPaused ? "bg-white text-[#064E3B] border-white" : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                        }`}
                      >
                        {isPaused ? <Play className="w-8 h-8 ml-1" /> : <Pause className="w-8 h-8" />}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="px-10 py-5 bg-white/10 text-white rounded-2xl font-black text-lg shadow-2xl backdrop-blur-md border border-white/20 transition-all hover:bg-white/20 hover:text-red-300"
                      >
                        End Session
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
      )}
    </AnimatePresence>
  );
}
