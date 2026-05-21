import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { wellnessSessions as videos } from '../../data/wellnessSessions';

export const WellnessOTT = () => {
    const navigate = useNavigate();
    const [isAnimating, setIsAnimating] = useState(false);
    const [viewMoreOpen, setViewMoreOpen] = useState(false);

    const handleCardClick = (e: React.MouseEvent, item: any) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAnimating(true);
        navigate(`/wellness-ott-intro?seriesId=${item.id}`, { replace: false });
    };

    const handleViewMore = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAnimating(true);
        navigate('/wellness-ott-intro', { replace: false });
    };

    return (
        <section className="flex flex-col justify-start pt-2 pb-8 bg-[#EEF7F1] overflow-hidden relative">
            <div className="max-w-[1440px] mx-auto px-6 md:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1a5d47]/10 text-[#1a5d47]">
                                <Play className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-[#1a5d47] font-bold tracking-widest text-[10px] uppercase underline underline-offset-4 decoration-1">Nirvaha Stream</span>
                        </div>
                        <h2
                            className="text-4xl md:text-5xl font-bold text-[#0F131A] tracking-tight mb-2"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            Wellness OTT
                        </h2>
                        <p className="text-gray-500 text-base font-medium tracking-tight">
                            Stream your path to peace.
                        </p>
                    </div>
                    <motion.button
                        onClick={handleViewMore}
                        className="group flex items-center gap-2 text-[#1a5d47] font-semibold hover:text-[#113d2f] transition-all duration-300 pb-1"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <span className="border-b-2 border-transparent group-hover:border-[#1a5d47] transition-all duration-300">View More</span>
                        <svg
                            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </motion.button>
                </div>

                {/* Video Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                    {videos.slice(0, 5).map((vid, idx) => (
                        <motion.div
                           key={idx}
                           onClick={(e) => handleCardClick(e, vid)}
                            className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-shadow duration-300"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            {/* Thumbnail */}
                            <div className="aspect-[4/5] relative overflow-hidden">
                                <img
                                    src={vid.thumbnail}
                                    alt={vid.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F131A]/80 via-transparent to-transparent opacity-80" />

                                {/* Play Button */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-14 h-14 bg-[#1a5d47] rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                                    </div>
                                </div>

                                {/* Category Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#1a5d47] text-xs font-semibold rounded-full">
                                        {vid.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3
                                    className="text-lg font-semibold text-[#0F131A] group-hover:text-[#1a5d47] transition-colors tracking-tight">
                                    {vid.title}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Fullscreen Cinematic Intro Animation */}
            <AnimatePresence>
                {isAnimating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
                    >
                        {/* Immersive dark overlay and Emerald glow atmosphere */}
                        <motion.div 
                            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a5d47]/20 via-[#050505] to-[#050505] opacity-80"
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.8 }}
                            transition={{ duration: 2.8, ease: "easeOut" }}
                        />

                        {/* Subtle floating particles */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {[...Array(15)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-[#2ed899] rounded-full blur-[1px]"
                                    initial={{ 
                                        left: `${Math.random() * 100}%`, 
                                        top: `${Math.random() * 100}%`,
                                        opacity: 0,
                                        scale: Math.random() * 1 + 0.5 
                                    }}
                                    animate={{ 
                                        top: `${Math.random() * 100 - 20}%`,
                                        opacity: [0, Math.random() * 0.5 + 0.2, 0],
                                    }}
                                    transition={{ 
                                        duration: Math.random() * 2 + 1.5, 
                                        ease: "linear",
                                    }}
                                />
                            ))}
                        </div>
                        
                        {/* Central cinematic text */}
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0, filter: 'blur(12px)' }}
                            animate={{ scale: 1.1, opacity: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 2.8, ease: [0.25, 0.1, 0.25, 1] }}
                            className="relative flex flex-col items-center justify-center z-10"
                        >
                            <motion.h1 
                                className="text-white font-medium text-5xl md:text-7xl mb-2 ml-4 uppercase tracking-widest"
                                initial={{ letterSpacing: '0em' }}
                                animate={{ letterSpacing: '0.2em' }}
                                transition={{ duration: 2.8, ease: "easeOut" }}
                                style={{ fontFamily: "'Cinzel', serif" }}
                            >
                                NIRVAHA
                            </motion.h1>
                            <motion.h2 
                                className="text-[#1a5d47] text-lg md:text-2xl font-light uppercase tracking-widest ml-3"
                                initial={{ letterSpacing: '0em', opacity: 0 }}
                                animate={{ letterSpacing: '0.4em', opacity: 1 }}
                                transition={{ duration: 2.4, delay: 0.4, ease: "easeOut" }}
                                style={{ textShadow: "0 0 20px rgba(26, 93, 71, 0.8)" }}
                            >
                                Wellness OTT
                            </motion.h2>
                        </motion.div>

                        {/* Cinematic glow pulse */}
                        <motion.div 
                            className="absolute w-[40vw] h-[40vw] min-w-[400px] min-h-[400px] bg-[#1a5d47] blur-[120px] rounded-full z-0 pointer-events-none"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: [0.8, 1.2, 1], opacity: [0, 0.15, 0.25] }}
                            transition={{ duration: 2.8, ease: "easeInOut" }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>



        </section>
    );
};
