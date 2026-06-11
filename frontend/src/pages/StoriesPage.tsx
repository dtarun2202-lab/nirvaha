import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Heart, Moon, Sun, Wind } from 'lucide-react';
import StoryCard from '../components/landing/StoryCard';
import SEOHead from '../components/common/SEOHead';
import { storiesData as richStoriesData } from '../data/storiesData';
import { DashboardFooter } from '../components/dashboard/DashboardFooter';



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
        <>
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
                            {richStoriesData.map((story) => (
                                <StoryCard 
                                    key={story.id}
                                    title={story.title}
                                    description={story.description}
                                    image={story.image}
                                    onClick={() => navigate(`/story/${story.id}`)}
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


            
            {/* Soft decorative blur circles */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-100/50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        </div>

        {/* Footer */}
        <DashboardFooter />
        </>
    );
};

export default StoriesPage;
