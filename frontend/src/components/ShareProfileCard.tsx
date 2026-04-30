import { motion, AnimatePresence } from "motion/react";
import { X, Download, Link, Award, Clock, Brain, Check } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";

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

export function ShareProfileCard({
  isOpen,
  onClose,
  userName,
  userTitle,
  userEmail,
  userLocation,
  stats,
}: ShareProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const downloadCard = async () => {
    if (cardRef.current) {
      try {
        // Hide buttons temporarily for cleaner capture
        const buttons = cardRef.current.querySelector('.action-buttons') as HTMLElement;
        const closeBtn = cardRef.current.querySelector('.close-btn') as HTMLElement;
        if (buttons) buttons.style.display = 'none';
        if (closeBtn) closeBtn.style.display = 'none';

        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: "#F0FDF4",
          scale: 4,
          useCORS: true,
          logging: false,
        });

        if (buttons) buttons.style.display = 'flex';
        if (closeBtn) closeBtn.style.display = 'flex';

        const link = document.createElement("a");
        link.download = `nirvaha-profile-${userName.replace(/\s+/g, "-")}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (error) {
        console.error("Error generating image:", error);
      }
    }
  };

  const copyProfileLink = () => {
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const StatCounter = ({ value }: { value: number }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 0;
      const end = value;
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / end));
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= end) clearInterval(timer);
      }, stepTime > 0 ? stepTime : 20);
      
      return () => clearInterval(timer);
    }, [value]);

    return <>{count}</>;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#064E3B]/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative max-w-[460px] w-full z-10"
          >
            {/* Profile Card Container (The one that gets captured) */}
            <div 
              ref={cardRef}
              className="bg-white rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden border border-green-50 relative transition-all duration-500"
            >
              <div className="bg-gradient-to-br from-[#F4FBF7] via-white to-[#E8F5EE] px-6 py-7 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-green-100/30 rounded-full blur-3xl -mr-32 -mt-32 opacity-60 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-50/50 rounded-full blur-2xl -ml-24 -mb-24 opacity-40 pointer-events-none" />
                
                {/* Close Button Inside */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="close-btn absolute top-5 right-5 w-8 h-8 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center text-gray-500 transition-colors z-20"
                >
                  <X className="w-4 h-4" />
                </motion.button>

                {/* Branding */}
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#2D6A4F] rounded-full flex items-center justify-center shadow-sm">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[#1B4332] font-semibold tracking-wide text-base uppercase">Nirvaha</span>
                  </div>
                  <div className="text-[10px] font-medium text-[#2D6A4F]/50 uppercase tracking-[0.15em] pr-10">Identity • Flow</div>
                </div>

                {/* Profile Identity */}
                <div className="mb-8 relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-[64px] h-[64px] rounded-full shrink-0 bg-gradient-to-br from-[#52B788] to-[#2D6A4F] flex items-center justify-center text-white text-[20px] font-bold shadow-md">
                      {userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <h2 className="text-[#1B4332] text-xl font-bold tracking-tight mb-0.5">{userName}</h2>
                      <p className="text-[#2D6A4F] font-medium opacity-70 text-[13px]">{userTitle}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <div className="px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-full text-[#2D6A4F] text-[12px] font-medium shadow-sm flex items-center gap-1.5">
                      <span className="opacity-60 text-xs">📍</span> {userLocation}
                    </div>
                    <div className="px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-full text-[#2D6A4F] text-[12px] font-medium shadow-sm flex items-center gap-1.5 truncate max-w-[200px]">
                      <span className="opacity-60 text-xs">✉️</span> {userEmail}
                    </div>
                  </div>
                </div>

                {/* Stats Bento Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                  <div className="bg-white/70 border border-white rounded-[16px] p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center">
                        <Award className="w-3.5 h-3.5 text-[#2D6A4F]" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#2D6A4F]/60 uppercase tracking-widest">Streak</span>
                    </div>
                    <div className="text-xl font-semibold text-[#1B4332] tabular-nums">{stats.streak} <span className="text-[12px] font-medium opacity-50 capitalize tracking-normal">Days</span></div>
                  </div>
                  
                  <div className="bg-white/70 border border-white rounded-[16px] p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center">
                        <Clock className="w-3.5 h-3.5 text-[#2D6A4F]" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#2D6A4F]/60 uppercase tracking-widest">Sessions</span>
                    </div>
                    <div className="text-xl font-semibold text-[#1B4332] tabular-nums">{stats.sessions} <span className="text-[12px] font-medium opacity-50 capitalize tracking-normal">Total</span></div>
                  </div>

                  <div className="bg-white/70 border border-white rounded-[16px] p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                        <Brain className="w-3.5 h-3.5 text-[#2D6A4F]" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#2D6A4F]/60 uppercase tracking-widest">Meditation</span>
                    </div>
                    <div className="text-xl font-semibold text-[#1B4332] tabular-nums">{stats.meditationMinutes} <span className="text-[12px] font-medium opacity-50 capitalize tracking-normal">Mins</span></div>
                  </div>

                  <div className="bg-white/70 border border-white rounded-[16px] p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center">
                        <Brain className="w-3.5 h-3.5 text-[#2D6A4F]" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#2D6A4F]/60 uppercase tracking-widest">Sound</span>
                    </div>
                    <div className="text-xl font-semibold text-[#1B4332] tabular-nums">{stats.soundMinutes} <span className="text-[12px] font-medium opacity-50 capitalize tracking-normal">Mins</span></div>
                  </div>
                </div>

                <div className="bg-[#F0FDF4] border border-green-100 rounded-[16px] p-5 shadow-sm text-[#1B4332] relative overflow-hidden mb-8">
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <div className="text-[12px] font-semibold text-[#2D6A4F]/60 uppercase tracking-widest mb-1">Wellness Score</div>
                      <div className="text-3xl font-semibold tracking-tight">
                        <StatCounter value={stats.wellnessScore} />
                        <span className="text-sm font-medium opacity-40 ml-1">/100</span>
                      </div>
                    </div>
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm"
                    >
                      <Brain className="w-5 h-5 text-[#2D6A4F]" />
                    </motion.div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="action-buttons flex gap-3 relative z-10 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.01, backgroundColor: "#f9fafb" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={downloadCard}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-[#2D6A4F] rounded-[14px] font-medium text-[14px] shadow-sm border border-gray-100 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.01, backgroundColor: "#1B4332" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={copyProfileLink}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2D6A4F] text-white rounded-[14px] font-medium text-[14px] shadow-sm transition-all"
                  >
                    {copyFeedback ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Link className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
