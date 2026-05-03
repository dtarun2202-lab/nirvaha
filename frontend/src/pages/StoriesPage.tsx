import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Heart, Moon, Sun, Wind } from 'lucide-react';
import StoryCard from '../components/landing/StoryCard';
import SEOHead from '../components/common/SEOHead';

const storiesData = [
    {
        id: 1,
        title: "The Path to Stillness",
        description: "How a high-stress tech executive found balance through daily guided meditation and ancient breathwork techniques. 'Nirvaha didn't just change my routine; it changed my perspective on life.'",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200",
    },
    {
        id: 2,
        title: "Echoes of Healing",
        description: "A journey into sound healing that resolved years of insomnia. 'The resonance of the bowls felt like they were vibrating through my very soul, clearing blocks I never knew I had.'",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200",
    },
    {
        id: 3,
        title: "Community Resilience",
        description: "Finding a tribe in a lonely world. Discover how our community circles foster deep connection and emotional safety for those navigating grief and loss.",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200",
    },
    {
        id: 4,
        title: "The AI Spiritual Guide",
        description: "Breaking the stigma of seeking help. How Nirvaha's AI guide provided a safe, non-judgmental space for a young student to express their deepest anxieties.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    },
    {
        id: 5,
        title: "Ancient Roots, Modern Wings",
        description: "Exploring the Bhagavad Gita's wisdom in a modern context. A story of finding professional purpose by aligning daily work with spiritual values.",
        image: "https://images.unsplash.com/photo-1512236258305-32fb110fdb01?auto=format&fit=crop&q=80&w=1200",
    },
    {
        id: 6,
        title: "Sacred Morning Rituals",
        description: "Transforming the first hour of the day into a sacred experience. 'My mornings used to be chaos; now they are a sanctuary of peace.'",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200",
    }
];

const FloatingElement = ({ children, delay = 0, duration = 20, className = "" }) => (
    <motion.div
        animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            rotate: [0, 10, 0],
        }}
        transition={{
            duration: duration,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut",
        }}
        className={`absolute pointer-events-none opacity-[0.05] ${className}`}
    >
        {children}
    </motion.div>
);

const StoriesPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStory, setSelectedStory] = useState<any>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f4ea] to-[#d4ede4] relative overflow-hidden font-sans">
            <SEOHead 
                title="Our Stories | Nirvaha"
                description="Explore the transformative journeys of the Nirvaha community. Discover how ancient wisdom and modern science combine to heal lives."
            />

            {/* Background Animations */}
            <FloatingElement delay={0} className="top-20 left-20"><Wind size={120} /></FloatingElement>
            <FloatingElement delay={2} className="top-1/3 right-40"><Sparkles size={80} /></FloatingElement>
            <FloatingElement delay={4} className="bottom-20 left-1/4"><Heart size={60} /></FloatingElement>
            <FloatingElement delay={1} className="bottom-1/3 right-20"><Sun size={100} /></FloatingElement>

            {/* Content Wrapper */}
            <div className="container mx-auto px-6 py-12 relative z-10">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05, x: -5 }}
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-[#1a5d47] font-bold mb-12 hover:text-[#2c8d6d] transition-colors"
                >
                    <ArrowLeft size={24} />
                    <span className="uppercase tracking-widest text-sm">Back to Sanctuary</span>
                </motion.button>

                {/* Header */}
                <header className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-6xl sm:text-7xl font-bold text-[#0F131A] mb-6 tracking-tight" style={{ fontFamily: "'Cinzel', serif" }}>
                            Our Stories
                        </h1>
                        <div className="w-24 h-1.5 bg-[#1a5d47] mx-auto rounded-full mb-8" />
                        <p className="text-xl sm:text-2xl text-[#595e67] font-light tracking-wide max-w-2xl mx-auto">
                            Ancient Wisdom, Modern Science. <br/>
                            Real journeys of transformation and healing.
                        </p>
                    </motion.div>
                </header>

                {/* Loading State */}
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div 
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-40"
                        >
                            <motion.div 
                                animate={{ 
                                    rotate: 360,
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{ 
                                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                                }}
                                className="w-16 h-16 border-4 border-[#1a5d47]/20 border-t-[#1a5d47] rounded-full"
                            />
                            <p className="mt-6 text-[#1a5d47] font-medium tracking-widest uppercase text-xs">Gathering Wisdom...</p>
                        </motion.div>
                    ) : (
                        /* Stories Grid */
                        <motion.div
                            key="grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14"
                        >
                            {storiesData.map((story) => (
                                <StoryCard 
                                    key={story.id}
                                    title={story.title}
                                    description={story.description}
                                    image={story.image}
                                    onClick={() => setSelectedStory(story)}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Message */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 }}
                    className="text-center mt-32 mb-12"
                >
                    <p className="text-[#595e67] font-light italic text-lg max-w-xl mx-auto">
                        "Your journey is the destination. Every step taken in awareness is a victory of the spirit."
                    </p>
                    <div className="flex justify-center gap-6 mt-8 opacity-20">
                        <Moon size={24} />
                        <Sparkles size={24} />
                        <Sun size={24} />
                    </div>
                </motion.div>
            </div>

            {/* Detailed Story Modal */}
            <AnimatePresence>
                {selectedStory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/40"
                        onClick={() => setSelectedStory(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-[3rem] overflow-hidden max-w-4xl w-full max-h-[90vh] shadow-2xl relative flex flex-col md:flex-row"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button 
                                onClick={() => setSelectedStory(null)}
                                className="absolute top-6 right-6 z-10 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6 text-[#1a5d47]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Modal Image */}
                            <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden bg-emerald-50 relative">
                                <img 
                                    src={selectedStory.image} 
                                    alt={selectedStory.title} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50 to-white flex items-center justify-center hidden">
                                    <Sparkles className="w-20 h-20 text-emerald-200" />
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
                                <span className="text-emerald-600 font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Transformation Story</span>
                                <h2 className="text-3xl md:text-4xl font-bold text-[#0F131A] mb-6 leading-tight" style={{ fontFamily: "'Cinzel', serif" }}>
                                    {selectedStory.title}
                                </h2>
                                <div className="w-12 h-1 bg-emerald-500 rounded-full mb-8" />
                                <div className="prose prose-emerald">
                                    <p className="text-lg text-[#595e67] leading-relaxed font-light whitespace-pre-line">
                                        {selectedStory.description}
                                    </p>
                                    <p className="text-lg text-[#595e67] leading-relaxed font-light mt-4">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                    <p className="text-lg text-[#595e67] leading-relaxed font-light mt-4">
                                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </p>
                                </div>
                                
                                <button 
                                    onClick={() => setSelectedStory(null)}
                                    className="mt-10 px-8 py-4 bg-[#1a5d47] text-white rounded-full font-bold shadow-lg hover:bg-[#154b39] transition-all"
                                >
                                    Close Story
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Soft decorative blur circles */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-100/50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        </div>
    );
};

export default StoriesPage;
