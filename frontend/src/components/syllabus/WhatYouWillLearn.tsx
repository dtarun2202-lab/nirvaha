import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Heart, Target, Lightbulb, Zap, Smile } from 'lucide-react';

const WhatYouWillLearn: React.FC = () => {
    const highlights = [
        {
            title: "Breath Awareness",
            desc: "Master ancient pranayama techniques for nervous system regulation.",
            icon: <Wind className="text-emerald-400" />,
            glow: "bg-emerald-500/10"
        },
        {
            title: "Emotional Grounding",
            desc: "Develop resilience against modern stressors using somatic reflection.",
            icon: <Heart className="text-pink-400" />,
            glow: "bg-pink-500/10"
        },
        {
            title: "Focus Restoration",
            desc: "Reclaim your cognitive clarity with focused attention training.",
            icon: <Target className="text-blue-400" />,
            glow: "bg-blue-500/10"
        },
        {
            title: "Reflection Practices",
            desc: "Internalize growth through guided introspective journaling.",
            icon: <Lightbulb className="text-amber-400" />,
            glow: "bg-amber-500/10"
        },
        {
            title: "Stress Regulation",
            desc: "Biology-backed methods to transition from fight-or-flight to flow.",
            icon: <Zap className="text-purple-400" />,
            glow: "bg-purple-500/10"
        },
        {
            title: "Mindful Living",
            desc: "Integrate presence into every micro-moment of your daily routine.",
            icon: <Smile className="text-teal-400" />,
            glow: "bg-teal-500/10"
        }
    ];

    return (
        <section className="space-y-16">
            <div className="text-center space-y-4">
                <motion.span 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.5em]"
                >
                    Core Competencies
                </motion.span>
                <h2 className="text-4xl md:text-6xl font-serif">What You'll Learn</h2>
                <div className="w-24 h-[1px] bg-white/10 mx-auto mt-8" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {highlights.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -10 }}
                        className="group relative p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] overflow-hidden transition-all hover:bg-white/10 hover:border-white/20"
                    >
                        <div className={`absolute -top-12 -right-12 w-32 h-32 ${item.glow} rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity`} />
                        
                        <div className="relative z-10 space-y-6">
                            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white/90">{item.title}</h3>
                            <p className="text-white/40 leading-relaxed font-light">
                                {item.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default WhatYouWillLearn;
