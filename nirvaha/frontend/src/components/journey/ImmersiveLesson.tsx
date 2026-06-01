import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pathway } from '../../data/pathwaysData';
import { 
    X, 
    MessageCircle, 
    Timer, 
    ArrowRight, 
    ChevronLeft,
    Wind,
    Sparkles
} from 'lucide-react';
import ReflectionCompanion from './ReflectionCompanion';

interface ImmersiveLessonProps {
    pathway: Pathway;
    lessonIndex: number;
    onComplete: () => void;
    onBack: () => void;
}

const ImmersiveLesson: React.FC<ImmersiveLessonProps> = ({ pathway, lessonIndex, onComplete, onBack }) => {
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes mock
    const [showCompanion, setShowCompanion] = useState(false);
    const [isBreathing, setIsBreathing] = useState(false);
    const lesson = pathway.timeline[lessonIndex];

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(40px)" }}
            className="fixed inset-0 z-50 bg-[#050705] overflow-hidden flex flex-col font-sans"
        >
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#050705]" />
                
                {/* Dynamic Ambient Light Pools */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.4, 1],
                        opacity: [0.1, 0.25, 0.1],
                        x: [0, 100, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[10%] w-[800px] h-[800px] bg-emerald-900/20 rounded-full blur-[160px]"
                />
                <motion.div 
                    animate={{ 
                        scale: [1.3, 1, 1.3],
                        opacity: [0.05, 0.15, 0.05],
                        x: [0, -80, 0],
                        y: [0, 100, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-10%] right-[5%] w-[900px] h-[900px] bg-teal-900/10 rounded-full blur-[180px]"
                />
                
                {/* Subtle Grain Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
            </div>

            {/* Top Minimal UI */}
            <nav className="relative z-50 flex justify-between items-center p-8 md:p-16">
                <motion.button 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={onBack}
                    className="flex items-center gap-4 text-white/20 hover:text-white transition-all group"
                >
                    <div className="w-12 h-12 rounded-full border border-white/[0.03] flex items-center justify-center group-hover:bg-white/5 group-hover:border-white/10 transition-all">
                        <ChevronLeft size={20} />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-white/10">Return to Path</span>
                        <span className="text-xs font-serif italic text-white/60 tracking-wide">{pathway.title}</span>
                    </div>
                </motion.button>

                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-10"
                >
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-emerald-500/20 mb-1">Time in Stillness</span>
                        <div className="flex items-center gap-3 text-white/40">
                            <span className="text-xl font-mono tracking-tighter tabular-nums">{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setShowCompanion(!showCompanion)}
                        className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-500 ${
                            showCompanion 
                            ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_40px_rgba(16,185,129,0.3)]' 
                            : 'border-white/5 bg-white/2 text-white/40 hover:text-white hover:border-white/20 hover:bg-white/5'
                        }`}
                    >
                        <MessageCircle size={24} />
                    </button>
                </motion.div>
            </nav>

            {/* Main Content Area */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto w-full">
                <AnimatePresence mode="wait">
                    {!isBreathing ? (
                        <motion.div 
                            key="content"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="space-y-16"
                        >
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex items-center justify-center gap-4"
                                >
                                    <div className="h-[1px] w-8 bg-emerald-500/10" />
                                    <span className="text-emerald-500/40 text-[9px] font-bold uppercase tracking-[0.6em]">
                                        Moment 0{lessonIndex + 1}
                                    </span>
                                    <div className="h-[1px] w-8 bg-emerald-500/10" />
                                </motion.div>
                                
                                <h2 className="text-5xl md:text-8xl font-serif text-white leading-tight tracking-tight px-4">
                                    {lesson.title}
                                </h2>
                            </div>

                            <p className="text-xl md:text-3xl text-white/40 font-serif italic leading-relaxed max-w-3xl mx-auto font-light">
                                {lesson.description}
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-8 pt-10">
                                <button 
                                    onClick={() => setIsBreathing(true)}
                                    className="group relative px-12 py-6 bg-white text-black rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.05)]"
                                >
                                    <div className="relative z-10 flex items-center gap-3">
                                        <Wind size={22} className="opacity-60" /> 
                                        Begin Stillness
                                    </div>
                                </button>
                                
                                <button 
                                    onClick={onComplete}
                                    className="px-12 py-6 border border-white/[0.05] text-white/30 rounded-full font-bold text-lg flex items-center gap-3 hover:bg-white/[0.02] hover:text-white transition-all active:scale-95"
                                >
                                    Record Reflection <ArrowRight size={22} className="opacity-40" />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="breathing"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.2 }}
                            className="flex flex-col items-center justify-center space-y-24 w-full"
                        >
                            <div className="relative flex items-center justify-center">
                                {/* Enhanced Breathing Orb */}
                                <motion.div 
                                    animate={{ 
                                        scale: [1, 2.2, 1],
                                        opacity: [0.2, 0.05, 0.2]
                                    }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute w-64 h-64 rounded-full border border-emerald-500/40 blur-[2px]"
                                />
                                <motion.div 
                                    animate={{ 
                                        scale: [1, 1.8, 1],
                                        opacity: [0.1, 0.02, 0.1]
                                    }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute w-64 h-64 rounded-full border border-teal-400/20"
                                />
                                
                                {/* Inner Core */}
                                <motion.div 
                                    animate={{ 
                                        scale: [1, 1.4, 1],
                                        boxShadow: [
                                            "0 0 40px rgba(16, 185, 129, 0.2)",
                                            "0 0 100px rgba(16, 185, 129, 0.4)",
                                            "0 0 40px rgba(16, 185, 129, 0.2)"
                                        ]
                                    }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative w-40 h-40 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-2xl"
                                >
                                    <div className="absolute inset-1 rounded-full bg-black/10 backdrop-blur-sm" />
                                    <div className="relative z-10 flex flex-col items-center">
                                        <AnimatePresence mode="wait">
                                            <motion.span 
                                                key="breathing-text"
                                                animate={{ 
                                                    opacity: [0, 1, 0]
                                                }}
                                                transition={{ duration: 8, repeat: Infinity, times: [0, 0.5, 1] }}
                                                className="text-white text-xl font-serif italic tracking-widest"
                                            >
                                                Expand
                                            </motion.span>
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="space-y-8 max-w-lg">
                                <h3 className="text-3xl font-serif text-white/80 leading-relaxed italic">
                                    Release the weight of the day.<br />
                                    <span className="text-emerald-400/60 not-italic uppercase text-[10px] tracking-[0.4em] font-bold">Sync with your internal rhythm</span>
                                </h3>
                                <button 
                                    onClick={() => setIsBreathing(false)}
                                    className="px-8 py-3 text-white/20 hover:text-emerald-400 transition-all text-[10px] font-bold uppercase tracking-[0.5em] border border-white/5 rounded-full hover:border-emerald-500/30"
                                >
                                    End Attunement
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Floating Inspirational Micro-text */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                <motion.div 
                    animate={{ 
                        y: [-40, 40, -40],
                        x: [-20, 20, -20],
                        opacity: [0, 0.2, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[25%] right-[15%] flex items-center gap-3 text-[9px] uppercase tracking-[0.5em] text-emerald-400"
                >
                    <Sparkles size={12} className="text-emerald-500/60" /> Awareness is freedom
                </motion.div>
                <motion.div 
                    animate={{ 
                        y: [40, -40, 40],
                        x: [20, -20, 20],
                        opacity: [0, 0.15, 0]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[20%] left-[12%] flex items-center gap-3 text-[9px] uppercase tracking-[0.5em] text-teal-400"
                >
                    <Wind size={12} className="text-teal-500/60" /> Breathe into the silence
                </motion.div>
            </div>

            {/* AI Reflection Panel */}
            <AnimatePresence>
                {showCompanion && (
                    <ReflectionCompanion 
                        onClose={() => setShowCompanion(false)} 
                        onComplete={onComplete}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ImmersiveLesson;
