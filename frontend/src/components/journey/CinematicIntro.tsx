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
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050705] overflow-hidden"
        >
            {/* Atmospheric Background with shifting gradients */}
            <div className="absolute inset-0 z-0">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.15, 0.3, 0.15],
                        rotate: [0, 10, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-emerald-900/30 rounded-full blur-[160px]" 
                />
                <motion.div 
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        opacity: [0.1, 0.2, 0.1],
                        rotate: [0, -15, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] -right-[10%] w-[70%] h-[70%] bg-teal-900/20 rounded-full blur-[180px]" 
                />
                
                {/* Floating Micro-Particles */}
                <div className="absolute inset-0 opacity-40">
                    {[...Array(40)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ 
                                x: Math.random() * window.innerWidth, 
                                y: Math.random() * window.innerHeight,
                                opacity: 0,
                                scale: Math.random() * 0.5 + 0.5
                            }}
                            animate={{ 
                                y: [null, Math.random() * -200 - 100],
                                x: [null, (Math.random() - 0.5) * 100 + (Math.random() * 100)],
                                opacity: [0, 0.8, 0]
                            }}
                            transition={{ 
                                duration: 5 + Math.random() * 8, 
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: Math.random() * 5
                            }}
                            className="absolute w-0.5 h-0.5 bg-emerald-300 rounded-full shadow-[0_0_8px_rgba(110,231,183,0.8)]"
                        />
                    ))}
                </div>
            </div>

            {/* Elegant Typography Layer */}
            <div className="relative z-10 text-center px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                >
                    <span className="text-[10px] uppercase tracking-[0.8em] text-emerald-400/60 font-bold mb-8 block">
                        Nirvaha Presents
                    </span>
                    
                    <motion.h2
                        initial={{ opacity: 0, letterSpacing: "0.2em", scale: 0.95 }}
                        animate={{ opacity: 1, letterSpacing: "0.4em", scale: 1 }}
                        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                        className="text-3xl md:text-5xl lg:text-7xl font-light text-white mb-12"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        NIRVAHA
                    </motion.h2>

                    <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 0.4 }}
                        transition={{ duration: 2, delay: 1, ease: "circOut" }}
                        className="w-32 h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent mx-auto mb-12"
                    />

                    <div className="overflow-hidden">
                        <motion.p
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.8, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
                            className="text-2xl md:text-4xl font-serif italic text-white/90 leading-relaxed font-light"
                        >
                            “Your journey toward inner clarity begins now.”
                        </motion.p>
                    </div>
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.6, 0] }}
                    transition={{ duration: 4, delay: 3, repeat: Infinity }}
                    className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-full"
                >
                    <p className="text-[10px] uppercase tracking-[0.5em] text-emerald-400/40 font-medium">
                        Calibrating your atmosphere...
                    </p>
                </motion.div>
            </div>

            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none z-20" />
            <motion.div 
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 2, delay: 0.5 }}
                className="absolute inset-0 bg-black z-30 pointer-events-none"
            />
        </motion.div>
    );
};

export default CinematicIntro;
