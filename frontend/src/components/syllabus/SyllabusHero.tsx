import React from 'react';
import { motion } from 'framer-motion';
import { Pathway } from '../../data/pathwaysData';
import { PlayCircle, ShieldCheck, Clock, Users, Star } from 'lucide-react';

interface SyllabusHeroProps {
    pathway: Pathway;
    onStart: () => void;
}

const SyllabusHero: React.FC<SyllabusHeroProps> = ({ pathway, onStart }) => {
    return (
        <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Image with Deep Gradient */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={pathway.image} 
                    alt={pathway.title}
                    className="w-full h-full object-cover opacity-40 grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#050705]/50 via-[#050705] to-[#050705]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-12">
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
                        className="text-6xl md:text-9xl font-bold leading-tight text-white drop-shadow-2xl"
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
                        <p className="text-xl font-bold text-white/90">1,240+</p>
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
                        className="group relative px-12 py-5 bg-white text-black rounded-full font-bold text-lg flex items-center gap-3 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:scale-105 transition-all"
                    >
                        <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <span className="relative z-10 flex items-center gap-2 group-hover:text-black">
                            <PlayCircle size={24} /> Start Your Journey
                        </span>
                    </button>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 animate-bounce">Scroll to Explore Curriculum</p>
                </motion.div>
            </div>

            {/* Atmosphere overlay */}
            <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#050705] to-transparent z-10" />
        </section>
    );
};

export default SyllabusHero;
