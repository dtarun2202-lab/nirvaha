import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameLoaderWrapperProps {
    children: React.ReactNode;
    title: string;
    themeColor: string;
}

export const GameLoaderWrapper: React.FC<GameLoaderWrapperProps> = ({ children, title, themeColor }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // 2 second loading screen
        
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <AnimatePresence>
                {isLoading && (
                    <motion.div 
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
                    >
                        {/* Background subtle glow */}
                        <div 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[100px] opacity-20"
                            style={{ backgroundColor: themeColor }}
                        />
                        
                        <div className="relative z-10 flex flex-col items-center">
                            {/* Spinning/Pulsing Logo */}
                            <motion.div 
                                className="w-28 h-28 mb-8"
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <img 
                                    src="/logo-transparent.png" 
                                    alt="Loading" 
                                    className="w-full h-full object-contain"
                                    style={{ 
                                        filter: 'brightness(0) invert(1) opacity(0.8)' // Make it white/silvery
                                    }} 
                                />
                            </motion.div>
                            
                            <motion.h2 
                                className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-[0.2em] text-center uppercase"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                {title}
                            </motion.h2>

                            <p className="text-gray-500 tracking-widest text-xs uppercase mb-8">
                                Initializing Experience
                            </p>
                            
                            <div className="w-48 h-1 rounded-full overflow-hidden bg-white/10 relative">
                                <motion.div 
                                    className="absolute top-0 left-0 h-full rounded-full"
                                    style={{ backgroundColor: themeColor }}
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                style={{
                    height: isLoading ? '100vh' : 'auto',
                    overflow: isLoading ? 'hidden' : 'visible'
                }}
            >
                {children}
            </motion.div>
        </>
    );
};
