import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const defaultPillars = [
    {
        id: "01",
        title: "Systemic Diagnostics",
        desc: "We analyze your organizational pulse through confidential, culturally-aware assessments to identify latent stressors.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "02",
        title: "Scalable Protocols",
        desc: "Deployment of curated wellness frameworks that adapt to team size, location, and operational intensity.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "03",
        title: "Leadership Synergy",
        desc: "Equipping managers with high-EQ toolkits to foster psychological safety and resilient decision-making.",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "04",
        title: "Cultural Integration",
        desc: "Weaving emotional intelligence into the daily fabric of operations, transforming wellness from a perk to a practice.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "05",
        title: "Impact & ROI",
        desc: "Real-time analytics measuring engagement, retention shifts, and emotional capital growth.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
    }
];

const WhatIsNirvaha: React.FC = () => {
    // Initialize as null so nothing is open by default
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [pillars, setPillars] = useState(defaultPillars);

    // Load pillars from localStorage
    useEffect(() => {
        const savedPillars = localStorage.getItem("nirvaha_pillars");
        if (savedPillars) {
            try {
                setPillars(JSON.parse(savedPillars));
            } catch (e) {
                console.error("Failed to load pillars from localStorage", e);
                setPillars(defaultPillars);
            }
        }
    }, []);

    return (
        <section className="relative w-full py-16 lg:py-24 bg-white overflow-hidden">

            {/* Decorative Background Shapes */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Top-left corner — lotus / circle */}
                <svg className="absolute -top-6 -left-8 w-36 h-36 text-[#1a5d47] opacity-[0.04]" viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="50" cy="50" r="45" />
                </svg>

                {/* Top-right — diamond */}
                <svg className="absolute top-10 right-6 w-20 h-20 text-[#1a5d47] opacity-[0.06] rotate-45" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="15" y="15" width="70" height="70" rx="8" />
                </svg>

                {/* Left edge mid — hexagon */}
                <svg className="absolute top-1/3 -left-4 w-28 h-28 text-[#1a5d47] opacity-[0.03]" viewBox="0 0 100 100" fill="currentColor">
                    <polygon points="50,3 93,25 93,75 50,97 7,75 7,25" />
                </svg>

                {/* Right edge mid — triangle */}
                <svg className="absolute top-[45%] -right-3 w-24 h-24 text-[#1a5d47] opacity-[0.05] rotate-12" viewBox="0 0 100 100" fill="currentColor">
                    <polygon points="50,10 90,85 10,85" />
                </svg>

                {/* Below card left — small circle */}
                <svg className="absolute bottom-16 left-[8%] w-14 h-14 text-[#1a5d47] opacity-[0.07]" viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="50" cy="50" r="40" />
                </svg>

                {/* Below card right — rounded square */}
                <svg className="absolute bottom-20 right-[10%] w-18 h-18 text-[#1a5d47] opacity-[0.05] -rotate-12" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="10" y="10" width="80" height="80" rx="20" />
                </svg>

                {/* Bottom-left corner — dots cluster */}
                <svg className="absolute -bottom-4 -left-6 w-32 h-32 text-[#1a5d47] opacity-[0.03]" viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="20" cy="20" r="8" />
                    <circle cx="50" cy="30" r="6" />
                    <circle cx="35" cy="55" r="10" />
                    <circle cx="70" cy="50" r="5" />
                </svg>

                {/* Bottom-right corner — ring */}
                <svg className="absolute -bottom-6 -right-8 w-40 h-40 text-[#1a5d47] opacity-[0.04]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                    <circle cx="50" cy="50" r="42" />
                    <circle cx="50" cy="50" r="28" />
                </svg>

                {/* Upper-center — small diamond */}
                <svg className="absolute top-20 left-[55%] w-10 h-10 text-[#1a5d47] opacity-[0.06] rotate-45" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="20" y="20" width="60" height="60" rx="6" />
                </svg>

                {/* Mid-left below header — leaf shape */}
                <svg className="absolute top-[28%] left-[15%] w-12 h-12 text-[#1a5d47] opacity-[0.05] rotate-[30deg]" viewBox="0 0 100 100" fill="currentColor">
                    <ellipse cx="50" cy="50" rx="20" ry="45" />
                </svg>
            </div>

            <div className="max-w-6xl mx-auto w-full px-2 sm:px-4 relative z-10">

                {/* Header */}
                <div className="mb-12 lg:mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-4xl sm:text-5xl lg:text-5xl font-bold text-[#0F131A] mb-4 tracking-tight"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        What is Nirvaha?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-[#595e67] max-w-2xl text-lg font-light tracking-wide font-sans"
                    >
                        Constructing the bridge between corporate performance and human well-being.
                    </motion.p>
                </div>

                {/* Unified Card Container - Side by Side, Attached */}
                <div className="flex flex-col lg:flex-row shadow-2xl rounded-3xl overflow-hidden min-h-[500px] border border-gray-100 items-stretch w-full">

                    {/* LEFT COLUMN: Dynamic Visual - Attached 50% width, matches height */}
                    <div className="relative w-full lg:w-1/2 bg-gray-900 overflow-hidden min-h-[300px]">
                        <AnimatePresence mode="popLayout">
                            {activeIndex !== null && (
                                <motion.img
                                    key={activeIndex}
                                    src={pillars[activeIndex].image}
                                    alt={pillars[activeIndex].title}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            )}

                            {/* Default Empty State when nothing hovered */}
                            {activeIndex === null && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="absolute inset-0 bg-[#0F131A] flex flex-col items-center justify-center p-10 text-center"
                                >
                                    <span className="text-white/20 text-5xl lg:text-9xl mb-4 opacity-10 font-bold">N</span>
                                    <h3 className="text-white/40 text-xl font-serif italic tracking-wider">Hover over a pillar to reveal insights</h3>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Subtle Overlay Gradient (Visual only, no text) */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    </div>

                    {/* RIGHT COLUMN: Interactive Accordion - Attached 50% width */}
                    <div
                        className="w-full lg:w-1/2 bg-[#fafafa] flex flex-col border-l border-gray-100"
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        {pillars.map((pillar, index) => {
                            const isActive = activeIndex === index;

                            return (
                                <div
                                    key={pillar.id}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    // Smooth CSS transition relative to motion
                                    className={`group relative flex-1 flex flex-col justify-center border-b border-gray-200 last:border-0 px-8 lg:px-10 py-6 cursor-pointer transition-all duration-700 ease-in-out 
                                        ${isActive ? 'bg-[#1a5d47]' : 'bg-[#fafafa] hover:bg-white'}`}
                                >
                                    <div className="flex items-center justify-between pointer-events-none">
                                        <h4 className={`text-xl font-medium transition-colors duration-500 delay-100 ${isActive ? 'text-white' : 'text-[#0F131A]/60'}`}>
                                            <span className={`text-sm font-mono mr-4 opacity-60 transition-colors duration-500 ${isActive ? 'text-[#4ade80]' : 'text-[#1a5d47]/60'}`}>
                                                {pillar.id}
                                            </span>
                                            {pillar.title}
                                        </h4>
                                        <motion.div
                                            animate={{
                                                rotate: isActive ? 90 : 0,
                                                color: isActive ? '#4ade80' : '#d1d5db',
                                                x: isActive ? 5 : 0
                                            }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </motion.div>
                                    </div>

                                    {/* Accordion Description - Very Smooth */}
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <p className="text-white/80 text-base leading-relaxed pl-10 pr-4 font-light">
                                                    {pillar.desc}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhatIsNirvaha;
