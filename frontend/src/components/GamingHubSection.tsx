import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Gamepad2, Play, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
    {
        id: 'understand-life',
        title: 'Understand Life',
        category: 'Judgment Assessment',
        description: 'Face realistic life situations, choose your response, and discover your true judgment score.',
        benefits: ['Official Certificate', 'Score out of 100'],
        image: '/yoga poses/understand-life  logo.jpg',
        color: 'bg-[#D4AF37]',
        textGradient: 'from-[#D4AF37] to-[#B4952F]'
    },
    {
        id: 'ancient-character',
        title: 'Check Your Ancient Character',
        category: 'Personality Quiz',
        description: 'Answer a few reflective questions to discover which ancient character qualities most reflect your present nature.',
        benefits: ['Downloadable Result Card', 'Resonance Percentage'],
        image: '/ancient character.png',
        color: 'bg-[#059669]',
        textGradient: 'from-[#059669] to-[#047857]'
    },
    {
        id: 'temple-of-balance',
        title: 'Temple of Balance',
        category: 'Strategy Puzzle',
        description: 'Place life tiles on a 5x5 grid to maintain harmony. Survive 12 turns without letting any life value collapse.',
        benefits: ['Strategic Thinking', 'Balance Assessment'],
        image: '/temple of balance.png',
        color: 'bg-[#B45309]',
        textGradient: 'from-[#B45309] to-[#92400E]'
    },
    {
        id: 'add-your-autograph',
        title: 'Add Your Autograph',
        category: 'Personalization',
        description: 'Personalize beautifully crafted statement cards about ancient India with your own signature autograph.',
        benefits: ['Custom Design', 'Digital Heritage'],
        image: '/add your signature.png',
        color: 'bg-[#0f3460]',
        textGradient: 'from-[#0f3460] to-[#0a2342]'
    }
];

export const GamingHubSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const navigate = useNavigate();

    const handleNext = () => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % features.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
    };

    return (
        <section className="pt-10 pb-20 bg-[#F8FAFC] relative overflow-hidden min-h-[800px] flex flex-col justify-center">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#1a5d47]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 -left-20 w-[30rem] h-[30rem] bg-emerald-900/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1200px] mx-auto px-6 md:px-8 relative z-10 w-full">

                {/* Header */}
                <div className="flex flex-col items-center text-center mb-12">
                    <div className="flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white shadow-sm border border-gray-100">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#1a5d47]/10 text-[#1a5d47]">
                            <Gamepad2 className="w-3 h-3" />
                        </span>
                        <span className="text-[#1a5d47] font-bold tracking-widest text-[10px] uppercase">Nirvaha Arcade</span>
                    </div>
                    <h2
                        className="text-4xl md:text-5xl font-bold text-[#0F131A] tracking-tight mb-4"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Gamified Wellness Queue
                    </h2>
                    <p 
                        className="text-[#5f6f65] text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Discover interactive experiences designed to engage your mind, challenge your strategy, and restore your spirit.
                    </p>
                </div>

                {/* Main Card Queue Container */}
                <div className="relative h-[650px] md:h-[500px] w-full max-w-[1000px] mx-auto perspective-[1200px]">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={activeIndex}
                            custom={direction}
                            initial={{ 
                                opacity: 0, 
                                x: direction > 0 ? 150 : -150, 
                                scale: 0.85,
                                rotateY: direction > 0 ? -10 : 10,
                                z: -100
                            }}
                            animate={{ 
                                opacity: 1, 
                                x: 0, 
                                scale: 1,
                                rotateY: 0,
                                z: 0
                            }}
                            exit={{ 
                                opacity: 0, 
                                x: direction > 0 ? -150 : 150, 
                                scale: 0.85,
                                rotateY: direction > 0 ? 10 : -10,
                                z: -100
                            }}
                            transition={{ 
                                type: "spring", 
                                stiffness: 250, 
                                damping: 25,
                                mass: 0.8
                            }}
                            className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row bg-white cursor-pointer group"
                            onClick={handleNext}
                        >
                            {/* Left Side: Image */}
                            <div className="w-full md:w-1/2 relative h-[250px] md:h-full overflow-hidden">
                                <motion.img 
                                    src={features[activeIndex].image} 
                                    alt={features[activeIndex].title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
                                
                                <div className="absolute bottom-6 left-6 right-6 md:hidden">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-2 h-2 rounded-full ${features[activeIndex].color}`} />
                                        <span className="text-white font-bold text-[10px] tracking-widest uppercase">{features[activeIndex].category}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "'Cinzel', serif" }}>
                                        {features[activeIndex].title}
                                    </h3>
                                </div>
                            </div>

                            {/* Right Side: Content */}
                            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-8 md:p-12 relative bg-white">
                                {/* Desktop Title Area */}
                                <div className="hidden md:block mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`w-10 h-10 rounded-xl ${features[activeIndex].color} flex items-center justify-center text-white shadow-md`}>
                                            <Gamepad2 className="w-5 h-5" />
                                        </span>
                                        <span className="text-slate-500 font-bold text-xs tracking-[0.15em] uppercase">
                                            {features[activeIndex].category}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight" style={{ fontFamily: "'Cinzel', serif" }}>
                                        {features[activeIndex].title}
                                    </h3>
                                </div>
                                
                                <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8">
                                    {features[activeIndex].description}
                                </p>
                                
                                <div className="space-y-4 mb-10">
                                    {features[activeIndex].benefits.map((benefit, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-full ${features[activeIndex].color} bg-opacity-10 flex items-center justify-center`}>
                                                <Check className={`w-3.5 h-3.5`} style={{ color: features[activeIndex].color.replace('bg-', '') }} />
                                            </div>
                                            <span className="text-slate-700 font-medium">{benefit}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/${features[activeIndex].id}`);
                                        }}
                                        className={`
                                            w-full md:w-auto px-8 py-4 rounded-xl font-bold text-white shadow-lg 
                                            flex items-center justify-center gap-3 group/btn relative overflow-hidden
                                            ${features[activeIndex].color} hover:shadow-xl transition-all
                                        `}
                                    >
                                        <div className="absolute inset-0 bg-black/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                                        <span className="relative z-10 flex items-center gap-2">
                                            Play Now
                                            <div className="bg-white/20 p-1 rounded-full group-hover/btn:bg-white/30 transition-colors">
                                                <Play className="w-4 h-4 fill-current" />
                                            </div>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                    
                    {/* Steam-style Next/Prev Buttons */}
                    <div className="absolute -left-5 md:-left-8 top-1/2 -translate-y-1/2 z-20">
                        <button 
                            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                            className="w-10 h-10 md:w-14 md:h-14 bg-white/90 backdrop-blur-md shadow-xl rounded-full border border-gray-100 flex items-center justify-center text-slate-400 hover:text-[#1a5d47] hover:scale-110 transition-all cursor-pointer"
                        >
                            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                        </button>
                    </div>

                    <div className="absolute -right-5 md:-right-8 top-1/2 -translate-y-1/2 z-20">
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            className="w-10 h-10 md:w-14 md:h-14 bg-white/90 backdrop-blur-md shadow-xl rounded-full border border-gray-100 flex items-center justify-center text-slate-400 hover:text-[#1a5d47] hover:scale-110 transition-all cursor-pointer"
                        >
                            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                        </button>
                    </div>
                </div>

                {/* Queue Indicators */}
                <div className="flex justify-center items-center gap-3 mt-10">
                    {features.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setDirection(idx > activeIndex ? 1 : -1);
                                setActiveIndex(idx);
                            }}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                idx === activeIndex 
                                ? 'w-10 bg-[#1a5d47]' 
                                : 'w-2 bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to item ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
