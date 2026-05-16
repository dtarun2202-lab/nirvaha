import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface CinematicIntroProps {
    onComplete: () => void;
}

const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
        >
            {/* Atmospheric Background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-teal-900/10 rounded-full blur-[150px] animate-pulse delay-1000" />
                
                {/* Particles Effect (Simple CSS particles) */}
                <div className="absolute inset-0 opacity-30">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ 
                                x: Math.random() * window.innerWidth, 
                                y: Math.random() * window.innerHeight,
                                opacity: 0 
                            }}
                            animate={{ 
                                y: [null, Math.random() * -100],
                                opacity: [0, 1, 0]
                            }}
                            transition={{ 
                                duration: 3 + Math.random() * 4, 
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute w-1 h-1 bg-white rounded-full"
                        />
                    ))}
                </div>
            </div>

            {/* Elegant Typography */}
            <div className="relative z-10 text-center px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.8 }}
                    className="text-2xl md:text-4xl font-light tracking-[0.2em] text-emerald-100/80 mb-4 font-serif"
                >
                    NIRVAHA
                </motion.h2>
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.5, delay: 1.2, ease: "circOut" }}
                    className="w-24 h-[1px] bg-emerald-500/50 mx-auto mb-8"
                />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 2 }}
                    className="text-xl md:text-3xl font-serif italic text-white/90 max-w-2xl mx-auto leading-relaxed"
                >
                    “Your journey toward inner clarity begins now.”
                </motion.p>
                
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 3, delay: 3, repeat: Infinity }}
                    className="mt-16 text-[10px] uppercase tracking-[0.5em] text-emerald-400/40"
                >
                    Syncing with your intention...
                </motion.div>
            </div>

            {/* Soft Glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />
        </motion.div>
    );
};

export default CinematicIntro;
