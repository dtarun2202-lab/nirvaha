import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SlideData {
    image: string;
    subtitle: string;
    title: string;
    description: string;
    buttonText: string;
}

const slides: SlideData[] = [
    {
        image: "/image 01.png",
        subtitle: "The Foundation of Peace",
        title: "Ancient Wisdom",
        description: "Rooted in millennium-old spiritual traditions, we bring the calming essence of the ancients to your modern lifestyle.",
        buttonText: "Our Heritage"
    },
    {
        image: "/image 02.png",
        subtitle: "Neuroscience Meets Spirit",
        title: "Modern Science",
        description: "Our AI-driven approach leverages cutting-edge neuro-technology to quantify and enhance your emotional well-being.",
        buttonText: "Explore Tech"
    },
    {
        image: "/image 03.png",
        subtitle: "A Sanctuary for the Soul",
        title: "Inner Harmony",
        description: "Find your center in a chaotic world. Our guided sessions are designed to align your mind, body, and breath.",
        buttonText: "Start Healing"
    },
    {
        image: "/image 04.png",
        subtitle: "Personalized AI Guidance",
        title: "AI Sanctuary",
        description: "Experience the convergence of technology and tranquility with an AI guide that learns and grows with your spirit.",
        buttonText: "Meet Your Guide"
    },
    {
        image: "/image 05.png",
        subtitle: "The Power of Together",
        title: "Community",
        description: "Join a global circle of seekers and healers. Together, we create a resonance that heals the world.",
        buttonText: "Join the Circle"
    }
];

const AboutSection: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Auto-play effect: change slide every 3 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1);
        }, 3000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => (prevIndex + newDirection + slides.length) % slides.length);
    };

    const activeSlide = slides[currentIndex];

    return (
        <section className="relative py-20 lg:py-32 bg-[#eaf5ef] overflow-hidden" id="about">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    
                    {/* Visual Content: Image Slider */}
                    <div className="w-full lg:w-1/2 order-2 lg:order-1">
                        <div className="relative group">
                            {/* Image Container */}
                            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl bg-emerald-900/10 border-4 border-white">
                                <AnimatePresence initial={false} custom={direction} mode="wait">
                                    <motion.img
                                        key={currentIndex}
                                        src={activeSlide.image}
                                        initial={{ opacity: 0, x: direction > 0 ? 100 : -100, scale: 1.1 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: direction < 0 ? 100 : -100, scale: 0.9 }}
                                        transition={{ duration: 0.6, ease: "easeInOut" }}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        alt={activeSlide.title}
                                    />
                                </AnimatePresence>

                                {/* Perfectly Circular Button at Exact Center */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <AnimatePresence mode="wait">
                                        <motion.button
                                            key={`btn-${currentIndex}`}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                                            onClick={() => {
                                                let targetRoute = '/stories'; // Default
                                                if (activeSlide.buttonText === 'Explore Tech') targetRoute = '/certifications';
                                                if (activeSlide.buttonText === 'Meet Your Guide') targetRoute = '/dashboard/chatbot';
                                                if (activeSlide.buttonText === 'Start Healing') targetRoute = '/dashboard/meditation';
                                                if (activeSlide.buttonText === 'Join the Circle') targetRoute = '/dashboard/community';

                                                if (!user && targetRoute.startsWith('/dashboard')) {
                                                    sessionStorage.setItem("redirectUrl", targetRoute);
                                                    navigate("/login");
                                                } else {
                                                    navigate(targetRoute);
                                                }
                                            }}
                                            className="pointer-events-auto w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#1a5d47] text-white flex items-center justify-center text-center p-4 shadow-[0_0_40px_rgba(26,93,71,0.5)] border-2 border-white/30 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 group/btn"
                                        >
                                            <span className="text-sm sm:text-base font-black uppercase tracking-[0.2em] leading-tight text-white group-hover/btn:scale-110 transition-transform">
                                                {activeSlide.buttonText}
                                            </span>
                                            {/* Circular Glow Effect */}
                                            <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
                                        </motion.button>
                                    </AnimatePresence>
                                </div>

                                {/* Slider Navigation Dots */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                    {slides.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setDirection(i > currentIndex ? 1 : -1);
                                                setCurrentIndex(i);
                                            }}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                i === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                                            }`}
                                        />
                                    ))}
                                </div>

                                {/* Navigation Arrows */}
                                <button 
                                    onClick={() => paginate(-1)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button 
                                    onClick={() => paginate(1)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="w-full lg:w-1/2 order-1 lg:order-2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6"
                            >
                                <h2 className="text-5xl sm:text-7xl font-bold text-[#1a5d47] leading-none" style={{ fontFamily: "'Cinzel', serif" }}>
                                    {activeSlide.title}
                                </h2>
                                
                                <div className="h-1.5 w-24 bg-[#4ade80] rounded-full" />
                                
                                <h3 className="text-2xl sm:text-3xl font-bold text-[#1a5d47] tracking-tight">
                                    {activeSlide.subtitle}
                                </h3>
                                
                                <p className="text-lg text-[#595e67] italic font-light leading-relaxed max-w-xl">
                                    {activeSlide.description}
                                </p>

                                <div className="pt-6">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            let targetRoute = '/stories'; // Default
                                            if (activeSlide.buttonText === 'Explore Tech') targetRoute = '/certifications';
                                            if (activeSlide.buttonText === 'Meet Your Guide') targetRoute = '/dashboard/chatbot';
                                            if (activeSlide.buttonText === 'Start Healing') targetRoute = '/dashboard/meditation';
                                            if (activeSlide.buttonText === 'Join the Circle') targetRoute = '/dashboard/community';

                                            if (!user && targetRoute.startsWith('/dashboard')) {
                                                sessionStorage.setItem("redirectUrl", targetRoute);
                                                navigate("/login");
                                            } else {
                                                navigate(targetRoute);
                                            }
                                        }}
                                        className="px-10 py-4 bg-[#1a5d47] text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all"
                                    >
                                        {activeSlide.buttonText}
                                    </motion.button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
