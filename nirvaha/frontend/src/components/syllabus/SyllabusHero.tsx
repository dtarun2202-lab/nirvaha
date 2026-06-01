import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pathway } from '../../data/pathwaysData';
import { PlayCircle, ShieldCheck, Clock, Users, Star } from 'lucide-react';
import axios from 'axios';
import { BACKEND_CONFIG } from '../../config/backend';

interface SyllabusHeroProps {
    pathway: Pathway;
    onStart: () => void;
    isEnrolled: boolean;
}

const SyllabusHero: React.FC<SyllabusHeroProps> = ({ pathway, onStart, isEnrolled }) => {
    const [studentCount, setStudentCount] = useState<number>(0);

    useEffect(() => {
        const fetchStudentCount = async () => {
            try {
                const res = await axios.get(`${BACKEND_CONFIG.API_BASE_URL}/api/users/pathway/${pathway.id}/students`);
                setStudentCount(res.data.count);
            } catch (err) {
                console.error("Failed to fetch student count", err);
            }
        };
        fetchStudentCount();
    }, [pathway.id]);

    return (
        <section className="relative w-full min-h-[90vh] py-24 flex items-center justify-center overflow-hidden mt-12 rounded-3xl border border-white/5">
            {/* Background Image with Deep Gradient */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={pathway.image} 
                    alt={pathway.title}
                    className="w-full h-full object-cover opacity-40 grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#050705]/80 via-[#050705]/50 to-[#050705]" />
            </div>

            <div className="relative z-20 max-w-5xl mx-auto px-6 text-center space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <div className="flex items-center justify-center gap-3">
                        <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">
                            Deep Dive Syllabus
                        </span>
                    </div>
                    
                    <h1 
                        className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-white drop-shadow-2xl"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        {pathway.title}
                    </h1>

                    <p className="text-xl md:text-2xl text-white/50 font-light max-w-3xl mx-auto leading-relaxed italic">
                        "{pathway.desc}"
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 py-12 border-y border-white/5"
                >
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 flex items-center justify-center gap-2">
                            <Clock size={12} className="text-emerald-500" /> Duration
                        </p>
                        <p className="text-xl font-bold text-white/90">{pathway.duration}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 flex items-center justify-center gap-2">
                            <ShieldCheck size={12} className="text-emerald-500" /> Level
                        </p>
                        <p className="text-xl font-bold text-white/90">{pathway.level}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 flex items-center justify-center gap-2">
                            <Users size={12} className="text-emerald-500" /> Students
                        </p>
                        <p className="text-xl font-bold text-white/90">{studentCount.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 flex items-center justify-center gap-2">
                            <Star size={12} className="text-emerald-500" /> Rating
                        </p>
                        <p className="text-xl font-bold text-white/90">4.9/5</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col items-center gap-6 pt-8"
                >
                    <button 
                        onClick={onStart}
                        className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-10 py-5 rounded-full hover:bg-white hover:text-black hover:scale-105 transition-all group pointer-events-auto"
                    >
                        <PlayCircle className="w-6 h-6 text-emerald-400 group-hover:text-black" />
                        <span className="text-sm font-bold uppercase tracking-widest">
                            {isEnrolled ? "Continue Your Journey" : "Start Your Journey"}
                        </span>
                    </button>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 animate-bounce">Scroll to Explore Curriculum</p>
                </motion.div>
            </div>

            {/* Atmosphere overlay */}
            <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#050705] to-transparent z-0 pointer-events-none" />
        </section>
    );
};

export default SyllabusHero;
