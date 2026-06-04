import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Gamepad2, Play, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
    {
        id: 'life-quiz',
        title: 'Understand Life',
        category: 'Judgment Assessment',
        description: 'Face realistic life situations, choose your response, and discover your true judgment score.',
        benefits: ['Official Certificate', 'Score out of 100'],
        image: '/understand-life.png',
        thumbnails: ['/NA01.png', '/NA02.png', '/NA03.png', '/NA04.png'],
        themeHex: '#D4AF37',
        themeDarkHex: '#B4952F',
        themeLightHex: '#F9F1D8'
    },
    {
        id: 'ancient-character',
        title: 'Check Your Ancient Character',
        category: 'Personality Quiz',
        description: 'Answer a few reflective questions to discover which ancient character qualities most reflect your present nature.',
        benefits: ['Downloadable Result Card', 'Resonance Percentage'],
        image: '/ancient character.png',
        thumbnails: ['/image 01.png', '/image 02.png', '/image 03.png', '/image 04.png'],
        themeHex: '#059669',
        themeDarkHex: '#047857',
        themeLightHex: '#D1FAE5'
    },
    {
        id: 'temple-of-balance',
        title: 'Temple of Balance',
        category: 'Strategy Puzzle',
        description: 'Place life tiles on a 5x5 grid to maintain harmony. Survive 12 turns without letting any life value collapse.',
        benefits: ['Strategic Thinking', 'Balance Assessment'],
        image: '/temple of balance.png',
        thumbnails: ['/story1.png', '/story2.png', '/story3.png', '/story4.png'],
        themeHex: '#B45309',
        themeDarkHex: '#92400E',
        themeLightHex: '#FEF3C7'
    },
    {
        id: 'add-your-autograph',
        title: 'Add Your Autograph',
        category: 'Personalization',
        description: 'Personalize beautifully crafted statement cards about ancient India with your own signature autograph.',
        benefits: ['Custom Design', 'Digital Heritage'],
        image: '/add your signature.png',
        thumbnails: ['/nirvaha1.png', '/nirvaha2.png', '/nirvaha3.png', '/nirvaha4.png'],
        themeHex: '#0f3460',
        themeDarkHex: '#0a2342',
        themeLightHex: '#E2E8F0'
    }
];

export const GamingHubSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isPaused, setIsPaused] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setDirection(1);
            setActiveIndex((prev) => (prev + 1) % features.length);
        }, 5000); // Swipe every 5 seconds

        return () => clearInterval(timer);
    }, [isPaused]);

    const handleNext = () => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % features.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
    };

    const activeFeature = features[activeIndex];

    return (
        <section className="pt-10 pb-20 relative overflow-hidden min-h-[700px] flex flex-col justify-center" style={{ backgroundColor: activeFeature.themeLightHex, transition: 'background-color 0.5s ease' }}>
            {/* Background Accents similar to Steam */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 w-full h-[500px] opacity-20" style={{ background: `linear-gradient(to bottom, ${activeFeature.themeHex}, transparent)` }} />
            </div>

            <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 w-full">
                
                {/* Main Section Header */}
                <div className="text-left mb-6">
                    <h2 
                        className="text-2xl md:text-4xl font-bold text-[#0F131A] mb-2 tracking-wide"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Gaming Hub
                    </h2>
                </div>

                {/* Sub-Header: "FEATURED & RECOMMENDED" */}
                <div className="mb-4">
                    <h3 className="text-[#166534] text-[14px] md:text-[16px] font-semibold tracking-[0.1em] uppercase drop-shadow-sm">
                        Featured & Recommended
                    </h3>
                </div>

                {/* Main Card Queue Container */}
                <div 
                    className="relative w-full mx-auto group perspective-[1000px]"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div 
                        className="flex bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02]"
                        style={{ boxShadow: `0 20px 40px -10px ${activeFeature.themeHex}40` }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="w-full flex flex-col md:flex-row cursor-pointer relative"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/${features[activeIndex].id}`);
                                }}
                            >
                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out z-20 pointer-events-none" />

                                {/* Left Side: Large Main Image */}
                                <div className="w-full md:w-[60%] relative aspect-[16/9] md:aspect-auto md:h-[480px] flex items-center justify-center p-6 md:p-10 overflow-hidden bg-white/40">
                                    <motion.img 
                                        src={features[activeIndex].image} 
                                        alt={features[activeIndex].title} 
                                        className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] relative z-10"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                    />
                                    {/* Decorative background circle */}
                                    <div 
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full blur-3xl pointer-events-none transition-colors duration-500" 
                                        style={{ backgroundColor: `${activeFeature.themeHex}20` }}
                                    />
                                </div>

                                {/* Right Side: Content Panel */}
                                <div className="w-full md:w-[40%] flex flex-col justify-between p-6 md:p-10 bg-white/40 border-l border-white/40 relative overflow-hidden backdrop-blur-xl">
                                    
                                    {/* Decorative Background Elements */}
                                    <div 
                                        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none opacity-20 transform translate-x-1/3 -translate-y-1/3 transition-colors duration-700"
                                        style={{ backgroundColor: activeFeature.themeHex }}
                                    />
                                    <div 
                                        className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-[60px] pointer-events-none opacity-20 transform -translate-x-1/3 translate-y-1/3 transition-colors duration-700"
                                        style={{ backgroundColor: activeFeature.themeDarkHex }}
                                    />
                                    
                                    {/* Subtle pattern overlay */}
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div>
                                        {/* Status Badge */}
                                        <div 
                                            className="inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1 rounded-full mb-4 border transition-colors duration-500"
                                            style={{ 
                                                backgroundColor: `${activeFeature.themeHex}15`, 
                                                color: activeFeature.themeHex,
                                                borderColor: `${activeFeature.themeHex}30` 
                                            }}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: activeFeature.themeHex }}></span>
                                            Now Available
                                        </div>

                                        {/* Title */}
                                        <div className="mb-4">
                                            <h3 className="text-3xl md:text-4xl font-black text-[#0a1f0f] leading-tight tracking-tight">
                                                {features[activeIndex].title}
                                            </h3>
                                        </div>
                                        
                                        {/* Short Info / Description */}
                                        <div className="mb-6">
                                            <p className="text-[#166534]/80 text-[15px] md:text-[16px] leading-relaxed line-clamp-4 font-medium">
                                                {features[activeIndex].description}
                                            </p>
                                        </div>
                                        
                                        {/* Benefits */}
                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {features[activeIndex].benefits.map((benefit, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className="bg-white text-[12px] font-semibold px-4 py-1.5 rounded-full shadow-sm border transition-colors duration-500"
                                                    style={{ color: activeFeature.themeDarkHex, borderColor: `${activeFeature.themeHex}30` }}
                                                >
                                                    {benefit}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price / Play section */}
                                    <div className="mt-auto">
                                        <div 
                                            className="flex items-center justify-between p-1 rounded-full shadow-lg group/btn transition-all duration-500 hover:shadow-xl"
                                            style={{ 
                                                background: `linear-gradient(to right, ${activeFeature.themeHex}, ${activeFeature.themeDarkHex})`,
                                                boxShadow: `0 10px 25px -5px ${activeFeature.themeHex}60`
                                            }}
                                        >
                                            <div className="text-white font-bold px-5 text-sm uppercase tracking-wider">
                                                Free to Play
                                            </div>
                                            <div 
                                                className="bg-white rounded-full px-6 py-2.5 font-bold text-sm flex items-center gap-2 transition-colors duration-300 group-hover/btn:bg-opacity-90"
                                                style={{ color: activeFeature.themeDarkHex }}
                                            >
                                                Start Now
                                                <ArrowRight className="w-4 h-4" strokeWidth={3} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    </div>

                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    
                    {/* Steam-style Next/Prev Buttons (Outside the box) */}
                    <div className="absolute -left-8 md:-left-12 top-[45%] -translate-y-1/2 z-20">
                        <button 
                            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                            className="w-10 h-16 flex items-center justify-center group opacity-50 hover:opacity-100 transition-opacity"
                        >
                            <div className="w-8 h-12 bg-[#166534]/10 group-hover:bg-gradient-to-r from-[#166534]/20 to-transparent flex items-center justify-center rounded-l">
                                <ChevronLeft className="w-8 h-8 text-[#166534] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                            </div>
                        </button>
                    </div>

                    <div className="absolute -right-8 md:-right-12 top-[45%] -translate-y-1/2 z-20">
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            className="w-10 h-16 flex items-center justify-center group opacity-50 hover:opacity-100 transition-opacity"
                        >
                            <div className="w-8 h-12 bg-[#166534]/10 group-hover:bg-gradient-to-l from-[#166534]/20 to-transparent flex items-center justify-center rounded-r">
                                <ChevronRight className="w-8 h-8 text-[#166534] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Queue Indicators (Rectangles at bottom) */}
                <div className="flex justify-center items-center gap-1.5 mt-6">
                    {features.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setDirection(idx > activeIndex ? 1 : -1);
                                setActiveIndex(idx);
                            }}
                            className={`h-[8px] rounded-full transition-all duration-300 ${
                                idx === activeIndex 
                                ? 'w-[32px]' 
                                : 'w-[12px] opacity-40 hover:opacity-80'
                            }`}
                            style={{ 
                                backgroundColor: idx === activeIndex ? activeFeature.themeHex : '#000000' 
                            }}
                            aria-label={`Go to item ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
