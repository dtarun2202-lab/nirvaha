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
    ArrowLeft,
    Sparkles
} from 'lucide-react';

import EmotionalProgress from './EmotionalProgress';

import { useAuth } from '../../contexts/AuthContext';

interface JourneyDashboardProps {
    pathway: Pathway;
    onStartLesson: (index: number) => void;
    onExit: () => void;
}

const JourneyDashboard: React.FC<JourneyDashboardProps> = ({ pathway, onStartLesson, onExit }) => {
    const { user } = useAuth();
    
    // Get progress for this specific pathway
    const progressData = user?.pathwayProgress?.[pathway.id] || {
        completedLessons: [],
        startedAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString()
    };

    const userData = {
        name: user?.name || "Seeker",
        progress: pathway.timeline.length > 0 
            ? Math.round((progressData.completedLessons.length / pathway.timeline.length) * 100) 
            : 0,
        streak: user?.stats?.streak || 0,
        reflectionScore: user?.stats?.wellnessScore || 50,
        completedLessons: progressData.completedLessons
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full w-full bg-[#050705] overflow-y-auto custom-scrollbar selection:bg-emerald-500/30"
        >
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-950/10 rounded-full blur-[150px] -mr-96 -mt-96" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-950/5 rounded-full blur-[150px] -ml-48 -mb-48" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-[0.03]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12 pb-32">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
                    <div className="space-y-4">
                        <button 
                            onClick={onExit}
                            className="flex items-center gap-3 text-white/30 hover:text-emerald-400 transition-all group mb-4"
                        >
                            <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5">
                                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Return to Overview</span>
                        </button>
                        <div className="space-y-1">
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-6xl font-serif text-white tracking-tight"
                            >
                                How is your heart today, <span className="text-emerald-400 italic">{userData.name}?</span>
                            </motion.h1>
                            <p className="text-white/30 text-lg font-light tracking-wide italic">
                                “Quiet the mind, and the soul will speak.”
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-white/[0.01] backdrop-blur-3xl border border-white/[0.03] rounded-2xl p-5 flex items-center gap-5 group">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/5 flex items-center justify-center text-orange-400/60">
                                <Flame size={24} />
                            </div>
                            <div>
                                <p className="text-[9px] text-white/20 uppercase font-bold tracking-[0.2em] mb-0.5">Days in Presence</p>
                                <p className="text-2xl font-bold text-white/80">{userData.streak}</p>
                            </div>
                        </div>
                        <div className="bg-white/[0.01] backdrop-blur-3xl border border-white/[0.03] rounded-2xl p-5 flex items-center gap-5 group">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/5 flex items-center justify-center text-emerald-400/60">
                                <Target size={24} />
                            </div>
                            <div>
                                <p className="text-[9px] text-white/20 uppercase font-bold tracking-[0.2em] mb-0.5">Moments of Peace</p>
                                <p className="text-2xl font-bold text-white/80">{userData.reflectionScore}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Progress & Stats (4 cols) */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* Progress Ring Card */}
                        <div className="bg-gradient-to-br from-white/[0.02] to-transparent backdrop-blur-3xl border border-white/[0.03] rounded-[3rem] p-12 text-center relative overflow-hidden group">
                            <h3 className="text-[10px] font-bold mb-10 uppercase tracking-[0.4em] text-white/20">Your Progression</h3>
                            
                            <div className="relative w-56 h-56 mx-auto mb-10">
                                <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-[40px] opacity-20" />
                                
                                <svg className="w-full h-full transform -rotate-90 relative z-10">
                                    <circle
                                        cx="112" cy="112" r="100"
                                        className="stroke-white/[0.03] fill-none"
                                        strokeWidth="4"
                                    />
                                    <motion.circle
                                        cx="112" cy="112" r="100"
                                        className="stroke-emerald-400/40 fill-none"
                                        strokeWidth="4"
                                        strokeDasharray="628.32"
                                        initial={{ strokeDashoffset: 628.32 }}
                                        animate={{ strokeDashoffset: 628.32 * (1 - userData.progress / 100) }}
                                        transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                    <span className="text-6xl font-serif text-white/90 tracking-tighter">{userData.progress}<span className="text-2xl text-emerald-400/40">%</span></span>
                                    <span className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-bold mt-2">Harmonized</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => onStartLesson(userData.completedLessons.length)}
                                className="w-full py-5 bg-white/[0.05] border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 hover:border-emerald-500/20 transition-all active:scale-95 group/btn"
                            >
                                <span className="relative z-10">Begin Next Moment</span>
                            </button>
                        </div>



                        {/* Reflection Prompt Card */}
                        <div className="bg-white/2 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <LayoutDashboard size={40} className="text-emerald-500" />
                            </div>
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400/60 mb-6">Daily Reflection</h4>
                            <p className="text-white/90 text-2xl font-serif italic leading-relaxed mb-8">
                                "What space did you create for your soul today?"
                            </p>
                            <button className="group flex items-center gap-3 text-white/40 hover:text-white transition-colors text-[10px] uppercase tracking-[0.3em] font-bold">
                                Record Response 
                                <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all">
                                    <ChevronRight size={12} />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Right: Pathway Map (8 cols) */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-16 px-2">
                            <div>
                                <h2 className="text-3xl font-serif text-white/90">Your Journey Path</h2>
                                <p className="text-white/20 text-sm mt-1 italic">Gentle steps towards a more centered you.</p>
                            </div>
                            <div className="bg-white/[0.01] border border-white/[0.03] px-6 py-3 rounded-2xl flex items-center gap-4">
                                <Sparkles size={18} className="text-emerald-500/40" /> 
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                                    {userData.completedLessons.length} / {pathway.timeline.length} Chapters
                                </span>
                            </div>
                        </div>

                        <div className="relative space-y-8 pl-4 md:pl-0">
                            {/* Curved connector line (SVG) */}
                            <div className="absolute left-[2.4rem] top-10 bottom-10 w-[2px] bg-gradient-to-b from-emerald-500/40 via-white/5 to-white/5 hidden md:block" />

                            {pathway.timeline.map((step, idx) => {
                                const isCompleted = userData.completedLessons.includes(idx);
                                const isActive = idx === userData.completedLessons.length;
                                const isLocked = idx > userData.completedLessons.length;

                                return (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`relative flex flex-col md:flex-row items-center gap-8 p-1 rounded-[2.5rem] transition-all duration-700 ${
                                            isActive 
                                            ? 'bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 shadow-[0_20px_50px_rgba(16,185,129,0.05)]' 
                                            : 'bg-transparent'
                                        }`}
                                    >
                                        {/* Status Node */}
                                        <div className={`relative z-10 w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-2xl ${
                                            isCompleted 
                                            ? 'bg-emerald-500 text-black' 
                                            : isActive 
                                            ? 'bg-white text-black scale-110 shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
                                            : 'bg-white/5 text-white/20 border border-white/5'
                                        }`}>
                                            {isCompleted ? <Trophy size={28} /> : isLocked ? <Lock size={28} /> : <Play size={28} />}
                                            
                                            {/* Pulse effect for active */}
                                            {isActive && (
                                                <div className="absolute inset-0 rounded-3xl bg-white animate-ping opacity-20" />
                                            )}
                                        </div>

                                        <div className="flex-1 text-center md:text-left space-y-2">
                                            <div className="flex flex-col md:flex-row md:items-center gap-3">
                                                <span className={`text-[9px] font-bold uppercase tracking-[0.4em] ${isActive ? 'text-emerald-400' : 'text-white/10'}`}>
                                                    Moment 0{idx + 1}
                                                </span>
                                                {isActive && (
                                                    <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[8px] font-bold rounded-full uppercase tracking-[0.2em] w-fit mx-auto md:mx-0">
                                                        Currently Attuning
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className={`text-2xl font-serif ${isActive ? 'text-white' : 'text-white/40'}`}>{step.title}</h4>
                                            <p className={`text-sm font-light leading-relaxed max-w-lg ${isActive ? 'text-white/60' : 'text-white/20'}`}>
                                                {step.description}
                                            </p>
                                        </div>

                                        {!isLocked && (
                                            <button 
                                                onClick={() => onStartLesson(idx)}
                                                className={`px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all mb-4 md:mb-0 mr-0 md:mr-8 ${
                                                    isActive 
                                                    ? 'bg-white text-black hover:scale-105 shadow-xl' 
                                                    : 'border border-white/10 text-white/40 hover:text-white hover:bg-white/5'
                                                }`}
                                            >
                                                {isCompleted ? 'Revisit' : 'Enter'}
                                            </button>
                                        )}
                                        
                                        {isLocked && (
                                            <div className="px-10 py-4 mr-8 text-[10px] uppercase tracking-[0.2em] text-white/10 font-bold hidden md:block">
                                                Locked
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
