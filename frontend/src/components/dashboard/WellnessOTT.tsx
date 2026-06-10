import { motion, AnimatePresence } from 'motion/react';
import { Play } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useWellnessOTT } from '../../contexts/WellnessOTTContext';

export const WellnessOTT = () => {
    const { sessions: videos } = useWellnessOTT();
    const navigate = useNavigate();
    const handleCardClick = (e: React.MouseEvent, item: any) => {
        e.preventDefault();
        e.stopPropagation();
        // Navigate immediately — all animation is handled inside NirvahaStreamIntro
        navigate(`/wellness-ott-intro?seriesId=${item.id}`, {
            state: {
                thumbnail: item.thumbnail,
                title: item.title,
                category: item.category,
            }
        });
    };

    const handleViewMore = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigate('/wellness-ott-intro');
    };

    return (
        <section className="min-h-screen flex flex-col justify-center py-8 bg-[#EEF7F1] overflow-hidden relative">
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

        </section>
    );
};
