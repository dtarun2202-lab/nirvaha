import React from 'react';
import { motion } from 'framer-motion';
import { Pathway } from '../../data/pathwaysData';
import { 
    LayoutDashboard, 
    Flame, 
    Target, 
    ChevronRight, 
    Lock, 
    Play, 
    Trophy,
    ArrowLeft
} from 'lucide-react';

interface JourneyDashboardProps {
    pathway: Pathway;
    onStartLesson: (index: number) => void;
    onExit: () => void;
}

const JourneyDashboard: React.FC<JourneyDashboardProps> = ({ pathway, onStartLesson, onExit }) => {
    // Mock user data for the dashboard
    const userData = {
        name: "Priya",
        progress: 35,
        streak: 12,
        reflectionScore: 88,
        completedLessons: [0] // Mocking the first lesson as completed
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full bg-[#050705] overflow-y-auto custom-scrollbar"
        >
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-950/20 rounded-full blur-[150px] -mr-96 -mt-96" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-950/10 rounded-full blur-[150px] -ml-48 -mb-48" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <div>
                        <button 
                            onClick={onExit}
                            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-6 group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs uppercase tracking-widest font-bold">Back to Detail</span>
                        </button>
                        <motion.h1 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-3xl md:text-5xl font-serif text-white/90"
                        >
                            Welcome back, <span className="text-emerald-400">{userData.name}</span>
                        </motion.h1>
                        <p className="text-white/50 mt-2 font-light">Your focus today is deepening your mindfulness practice.</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
                                <Flame size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-white/40 uppercase font-bold tracking-widest">Streak</p>
                                <p className="text-xl font-bold">{userData.streak} Days</p>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                <Target size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-white/40 uppercase font-bold tracking-widest">Focus</p>
                                <p className="text-xl font-bold">{userData.reflectionScore}%</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Progress & Stats */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Progress Ring Card */}
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            <h3 className="text-lg font-bold mb-8 uppercase tracking-[0.2em] text-white/60">Your Progression</h3>
                            
                            <div className="relative w-48 h-48 mx-auto mb-8">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="96" cy="96" r="88"
                                        className="stroke-white/5 fill-none"
                                        strokeWidth="8"
                                    />
                                    <motion.circle
                                        cx="96" cy="96" r="88"
                                        className="stroke-emerald-500 fill-none"
                                        strokeWidth="8"
                                        strokeDasharray="552.92"
                                        initial={{ strokeDashoffset: 552.92 }}
                                        animate={{ strokeDashoffset: 552.92 * (1 - userData.progress / 100) }}
                                        transition={{ duration: 2, ease: "easeOut" }}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black text-white">{userData.progress}%</span>
                                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Complete</span>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95">
                                Continue Journey
                            </button>
                        </div>

                        {/* Reflection Prompt Card */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-4">Daily Reflection</h4>
                            <p className="text-white/80 text-lg font-light leading-relaxed mb-6">
                                "What space did you create for yourself today?"
                            </p>
                            <button className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                                Record Answer <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Right: Pathway Map */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-serif text-white/90">Pathway Progression</h2>
                            <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
                                <Trophy size={14} className="text-emerald-500" /> 
                                {userData.completedLessons.length} / {pathway.timeline.length} Modules
                            </div>
                        </div>

                        <div className="space-y-6">
                            {pathway.timeline.map((step, idx) => {
                                const isCompleted = userData.completedLessons.includes(idx);
                                const isActive = idx === userData.completedLessons.length;
                                const isLocked = idx > userData.completedLessons.length;

                                return (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`relative group p-6 rounded-[2rem] border transition-all duration-500 ${
                                            isActive 
                                            ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]' 
                                            : isLocked 
                                            ? 'bg-white/2 border-white/5 opacity-50' 
                                            : 'bg-white/5 border-white/10'
                                        }`}
                                    >
                                        <div className="flex items-center gap-6">
                                            {/* Status Icon */}
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                                                isCompleted 
                                                ? 'bg-emerald-500 text-black' 
                                                : isActive 
                                                ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' 
                                                : 'bg-white/5 text-white/20'
                                            }`}>
                                                {isCompleted ? <Trophy size={24} /> : isLocked ? <Lock size={24} /> : <Play size={24} />}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-emerald-400' : 'text-white/30'}`}>
                                                        Module 0{idx + 1}
                                                    </span>
                                                    {isActive && <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-bold rounded uppercase tracking-widest">Active</span>}
                                                </div>
                                                <h4 className="text-xl font-bold text-white/90">{step.title}</h4>
                                                <p className="text-sm text-white/40 mt-1 line-clamp-1">{step.description}</p>
                                            </div>

                                            {!isLocked && (
                                                <button 
                                                    onClick={() => onStartLesson(idx)}
                                                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                                                        isActive 
                                                        ? 'bg-white text-black hover:scale-105' 
                                                        : 'border border-white/10 text-white hover:bg-white/5'
                                                    }`}
                                                >
                                                    {isCompleted ? 'Review' : 'Start'}
                                                </button>
                                            )}
                                        </div>

                                        {/* Connector line */}
                                        {idx < pathway.timeline.length - 1 && (
                                            <div className="absolute left-[3.25rem] -bottom-6 w-[2px] h-6 bg-white/5">
                                                <motion.div 
                                                    initial={{ height: 0 }}
                                                    animate={{ height: isCompleted ? '100%' : '0%' }}
                                                    className="w-full bg-emerald-500/30"
                                                />
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default JourneyDashboard;
