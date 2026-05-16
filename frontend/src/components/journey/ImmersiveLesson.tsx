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
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black overflow-hidden flex flex-col"
        >
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#050705]" />
                {/* Floating ambient light */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                        x: [0, 50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px]"
                />
                <motion.div 
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        opacity: [0.05, 0.15, 0.05],
                        x: [0, -40, 0],
                        y: [0, 60, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-teal-900/10 rounded-full blur-[150px]"
                />
            </div>

            {/* Top Minimal UI */}
            <nav className="relative z-20 flex justify-between items-center p-8 md:p-12">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-3 text-white/40 hover:text-white transition-all group"
                >
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5">
                        <ChevronLeft size={20} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Exit Session</span>
                </button>

                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 text-white/60">
                        <Timer size={18} className="text-emerald-500" />
                        <span className="text-lg font-mono tracking-tighter">{formatTime(timeLeft)}</span>
                    </div>
                    <button 
                        onClick={() => setShowCompanion(!showCompanion)}
                        className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${showCompanion ? 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'border-white/10 text-white/60 hover:bg-white/5'}`}
                    >
                        <MessageCircle size={20} />
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                    {!isBreathing ? (
                        <motion.div 
                            key="content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-12"
                        >
                            <div className="space-y-4">
                                <motion.span 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-emerald-500 text-xs font-bold uppercase tracking-[0.4em]"
                                >
                                    Module 0{lessonIndex + 1}
                                </motion.span>
                                <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight">
                                    {lesson.title}
                                </h2>
                            </div>

                            <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto">
                                {lesson.description}
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-6 pt-8">
                                <button 
                                    onClick={() => setIsBreathing(true)}
                                    className="px-10 py-5 bg-white text-black rounded-full font-bold text-lg flex items-center gap-3 hover:scale-105 transition-transform shadow-xl"
                                >
                                    <Wind size={20} /> Begin Breathwork
                                </button>
                                <button 
                                    onClick={onComplete}
                                    className="px-10 py-5 border border-white/20 text-white rounded-full font-bold text-lg flex items-center gap-3 hover:bg-white/5 transition-all"
                                >
                                    Skip to Reflection <ArrowRight size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="breathing"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center space-y-16"
                        >
                            <div className="relative">
                                {/* Breathing Circle */}
                                <motion.div 
                                    animate={{ 
                                        scale: [1, 1.8, 1],
                                        opacity: [0.3, 0.1, 0.3]
                                    }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-48 h-48 rounded-full border-2 border-emerald-500/30"
                                />
                                <motion.div 
                                    animate={{ 
                                        scale: [1, 1.5, 1],
                                    }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 m-auto w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/40 to-teal-500/20 blur-xl"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.span 
                                        animate={{ 
                                            opacity: [0, 1, 0]
                                        }}
                                        transition={{ duration: 8, repeat: Infinity, times: [0, 0.5, 1] }}
                                        className="text-white text-2xl font-light tracking-widest"
                                    >
                                        Inhale
                                    </motion.span>
                                    <motion.span 
                                        animate={{ 
                                            opacity: [0, 1, 0]
                                        }}
                                        transition={{ duration: 8, repeat: Infinity, times: [0.5, 0.75, 1], delay: 4 }}
                                        className="absolute text-white text-2xl font-light tracking-widest"
                                    >
                                        Exhale
                                    </motion.span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-serif text-white/80">Follow the rhythm of the light.</h3>
                                <button 
                                    onClick={() => setIsBreathing(false)}
                                    className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest pt-4"
                                >
                                    End Breathwork
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Floating Micro-text */}
            <div className="absolute inset-0 pointer-events-none z-10">
                <motion.div 
                    animate={{ 
                        y: [-20, 20, -20],
                        opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-[20%] right-[15%] flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-emerald-400"
                >
                    <Sparkles size={10} /> Release judgment
                </motion.div>
                <motion.div 
                    animate={{ 
                        y: [20, -20, 20],
                        opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{ duration: 12, repeat: Infinity }}
                    className="absolute bottom-[15%] left-[10%] flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-teal-400"
                >
                    <Wind size={10} /> Find your center
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
