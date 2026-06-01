import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';

interface LibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    story: string;
}

const LibraryModal: React.FC<LibraryModalProps> = ({ isOpen, onClose, title, story }) => {
    
    // Split story into lines for staggered animation
    const lines = story.split('\n').filter(line => line.trim() !== '');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.1
            }
        }
    };

    const lineVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 backdrop-blur-md bg-black/60"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white/90 backdrop-blur-2xl border border-white/20 rounded-[3rem] overflow-hidden max-w-2xl w-full shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Decoration */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400" />
                        
                        {/* Close Button */}
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-full transition-all duration-300 z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-10 md:p-14">
                            <div className="flex items-center gap-3 mb-6">
                                <Sparkles className="text-emerald-500 w-6 h-6" />
                                <span className="text-emerald-600 font-bold tracking-[0.2em] uppercase text-xs">Wisdom Treasury</span>
                            </div>

                            <h2 
                                className="text-4xl md:text-5xl font-bold text-[#0F131A] mb-8 leading-tight"
                                style={{ fontFamily: "'Cinzel', serif" }}
                            >
                                {title}
                            </h2>

                            <div className="w-16 h-1.5 bg-emerald-500 rounded-full mb-10" />

                            {/* Text reveal area */}
                            <div 
                                className="relative min-h-[250px] cursor-default bg-emerald-50/30 rounded-2xl p-8 border border-emerald-100/50 transition-all duration-500"
                            >
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="space-y-6"
                                >
                                    {lines.map((line, index) => (
                                        <motion.p
                                            key={index}
                                            variants={lineVariants}
                                            className="text-lg md:text-xl text-[#595e67] leading-relaxed font-light italic"
                                        >
                                            {line}
                                        </motion.p>
                                    ))}
                                </motion.div>
                            </div>


                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LibraryModal;
