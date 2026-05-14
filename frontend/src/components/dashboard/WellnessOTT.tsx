import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const videos = [
    {
        title: "Morning Calm",
        category: "Meditation",
        duration: "10 min",
        thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop",
        audioSource: "/audio/meditation.mp3"
    },
    {
        title: "Deep Sleep Guide",
        category: "Sleep",
        duration: "45 min",
        thumbnail: "https://images.squarespace-cdn.com/content/v1/57b5ef68c534a5cc06edc769/b50a955f-e95f-42c1-beb6-4e74d753bfbb/restorative+yoga",
        audioSource: "/audio/sleep.mp3"
    },
    {
        title: "Anxiety Relief",
        category: "Stress",
        duration: "20 min",
        thumbnail: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=600&auto=format&fit=crop",
        audioSource: "/audio/stress.mp3"
    },
    {
        title: "Focus Flow",
        category: "Productivity",
        duration: "30 min",
        thumbnail: "https://lonestarneurology.net/wp-content/uploads/2025/08/3-Mental-Clarity-and-Cognitive-Function-from-Yoga.jpg",
        audioSource: "/audio/focus.mp3"
    },
    {
        title: "Chakra Balance",
        category: "Energy",
        duration: "15 min",
        thumbnail: "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=600&auto=format&fit=crop",
        audioSource: "/audio/energy.mp3"
    },
];

export const WellnessOTT = () => {
    const [activeAudioItem, setActiveAudioItem] = useState<any | null>(null);
    const [viewMoreOpen, setViewMoreOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Stop audio when closing modal
    useEffect(() => {
        if (!activeAudioItem && audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, [activeAudioItem]);

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(err => console.log("Play failed:", err));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleCardClick = (item: any) => {
        setActiveAudioItem(item);
        setIsPlaying(true);
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play().catch(err => {
                    console.log("Autoplay prevented:", err);
                    setIsPlaying(false);
                });
            }
        }, 100);
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
                        onClick={() => setViewMoreOpen(true)}
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
                    {videos.map((vid, idx) => (
                        <motion.div
                           key={idx}
                           onClick={() => handleCardClick(vid)}
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

            {/* Audio Mode: Immersive Floating Controls */}
            <AnimatePresence>
                {activeAudioItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="fixed inset-0 z-[110] bg-black"
                    >
                        {/* Audio Element */}
                        <audio 
                            ref={audioRef} 
                            src={activeAudioItem.audioSource} 
                            onEnded={() => setIsPlaying(false)}
                            className="hidden"
                        />

                        {/* Immersive Image Area */}
                        <img 
                            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2400&auto=format&fit=crop" 
                            alt="Peaceful Wellness View"
                            className="absolute inset-0 w-full h-full object-cover opacity-85"
                        />
                            
                        {/* Close Button */}
                        <button
                            onClick={() => setActiveAudioItem(null)}
                            className="absolute top-6 right-6 sm:top-10 sm:right-10 w-12 h-12 bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/90 hover:text-white transition-all z-20"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Floating Left Side Audio Controls */}
                        <div className="absolute bottom-8 left-6 sm:bottom-16 sm:left-16 z-20 flex items-center gap-5 bg-black/20 hover:bg-black/40 backdrop-blur-md pr-8 pl-3 py-3 rounded-full border border-white/10 transition-all shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                            {/* Minimal Play/Pause Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={togglePlay}
                                className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/90 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                            >
                                {isPlaying ? (
                                    <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
                                ) : (
                                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white ml-1" />
                                )}
                            </motion.button>
                            
                            {/* Track Info */}
                            <div className="flex flex-col">
                                <span className="text-white/90 text-sm font-semibold tracking-widest uppercase">
                                    {activeAudioItem.category}
                                </span>
                                <span className="text-white/60 text-xs mt-0.5 font-light tracking-wide hidden sm:block">
                                    {activeAudioItem.duration} • Cinematic Audio
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* View More Truly Full-Screen Image Modal (Image Only) */}
            <AnimatePresence>
                {viewMoreOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        onClick={() => setViewMoreOpen(false)}
                        className="fixed inset-0 z-[110] bg-black flex items-center justify-center"
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2400&auto=format&fit=crop" 
                            alt="Peaceful Wellness View"
                            className="absolute inset-0 w-full h-full object-cover opacity-85"
                        />
                        
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setViewMoreOpen(false);
                            }}
                            className="absolute top-8 right-8 w-12 h-12 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white/90 hover:text-white transition-colors z-20"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
