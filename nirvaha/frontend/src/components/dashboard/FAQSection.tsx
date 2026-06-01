
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export const FAQSection = () => {
    const faqs = [
        {
            q: "Is Nirvaha suitable for beginners?",
            a: "Yes. Our paths are gentle and designed to welcome you exactly as you are, regardless of prior experience.",
            image: "/images/faq_beginners.png"
        },
        {
            q: "How does the AI Reflection Companion work?",
            a: "It acts as a secure, non-judgmental space. It listens to your thoughts and softly guides you toward emotional clarity.",
            image: "/images/faq_ai_companion.png"
        },
        {
            q: "Is Nirvaha a therapy platform?",
            a: "No. We are a supportive wellness space meant for mindfulness and emotional reflection, not a replacement for clinical therapy.",
            image: "/images/faq_therapy_ancient.png"
        },
        {
            q: "Can I use Nirvaha during stressful moments?",
            a: "Absolutely. We offer immediate grounding techniques and emergency calm modules to help you navigate sudden overwhelm.",
            image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=800&auto=format&fit=crop"
        },
        {
            q: "Are conversations private?",
            a: "Yes. Your emotional space is entirely your own. All reflections are strictly confidential and securely encrypted.",
            image: "/images/faq_privacy.png"
        },
        {
            q: "How long are wellness sessions?",
            a: "Sessions adapt to your needs. Choose from a quick 3-minute breathwork reset to a deep 45-minute guided release.",
            image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop"
        }
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-8 bg-[#EEF7F1] overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 md:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1a5d47]/10 text-[#1a5d47]">
                                <HelpCircle className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-[#1a5d47] font-bold tracking-widest text-[10px] uppercase underline underline-offset-4 decoration-1">Support Center</span>
                        </div>
                        <h2 className="text-3xl font-bold text-[#0F131A] tracking-tight mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                            Clarity in Every Breath
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Everything you need to know about starting your journey.
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* Left Side - Dynamic Image Container - COMPACT */}
                    <div className="lg:col-span-5 relative h-[500px] overflow-hidden hidden lg:block">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={openIndex !== null ? faqs[openIndex].image : 'default'}
                                src={openIndex !== null ? faqs[openIndex].image : faqs[0].image}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.8, ease: "circOut" }}
                                className="absolute inset-0 w-full h-full object-cover rounded-xl"
                                alt="FAQ Visual"
                            />
                        </AnimatePresence>
                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Right Side - Accordion - COMPACT FONT SIZES */}
                    <div className="lg:col-span-7 divide-y divide-gray-100">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="group bg-transparent transition-all duration-300 overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                    className="w-full flex items-center justify-between py-6 text-left focus:outline-none"
                                >
                                    <span className={`font-semibold text-base md:text-lg tracking-tight transition-all duration-300 ${openIndex === idx ? 'text-[#1a5d47] pl-1' : 'text-[#0F131A] group-hover:text-[#1a5d47]/80'
                                        }`}>
                                        {faq.q}
                                    </span>
                                    <div className={`p-1.5 rounded-full transition-all duration-300 ${openIndex === idx
                                        ? 'bg-[#1a5d47]/10 text-[#1a5d47] rotate-0'
                                        : 'bg-transparent text-gray-300 group-hover:text-gray-500'
                                        }`}>
                                        {openIndex === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-4 h-4" />}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {openIndex === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-6 pl-1 text-gray-500 text-sm leading-relaxed max-w-xl">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
