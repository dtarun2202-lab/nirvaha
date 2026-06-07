import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ── Floating cards ── */
const CARDS = [
    {
        src: '/CFIR1.png', alt: 'Meditation stillness',
        posClass: 'top-[14%] left-[12%] lg:left-[16%] xl:left-[19%]',
        w: 'w-[190px] lg:w-[215px]', h: 'h-[255px] lg:h-[285px]',
        rotate: '-4deg', z: 20, floatDur: 5, floatAmt: 12, floatDelay: 0, px: 1.1, py: 0.9,
    },
    {
        src: '/CFIR2.png', alt: 'Journaling reflection',
        posClass: 'top-[42%] left-[7%] lg:left-[10%] xl:left-[13%]',
        w: 'w-[190px] lg:w-[215px]', h: 'h-[255px] lg:h-[285px]',
        rotate: '3deg', z: 10, floatDur: 6.5, floatAmt: 16, floatDelay: 0.7, px: 0.7, py: 1.1,
    },
    {
        src: '/CFIR3.png', alt: 'Calm nature',
        posClass: 'top-[68%] left-[12%] lg:left-[16%] xl:left-[19%]',
        w: 'w-[190px] lg:w-[215px]', h: 'h-[255px] lg:h-[285px]',
        rotate: '-2.5deg', z: 20, floatDur: 4.5, floatAmt: 10, floatDelay: 1.3, px: 1.3, py: 0.6,
    },
    {
        src: '/CFIR4.png', alt: 'Glowing nature',
        posClass: 'top-[14%] right-[12%] lg:right-[16%] xl:right-[19%]',
        w: 'w-[190px] lg:w-[215px]', h: 'h-[255px] lg:h-[285px]',
        rotate: '5deg', z: 10, floatDur: 5.5, floatAmt: 14, floatDelay: 0.3, px: -1.0, py: 0.8,
    },
    {
        src: '/CFIR5.png', alt: 'Reflective portrait',
        posClass: 'top-[40%] right-[7%] lg:right-[10%] xl:right-[13%]',
        w: 'w-[190px] lg:w-[215px]', h: 'h-[255px] lg:h-[285px]',
        rotate: '-4deg', z: 20, floatDur: 6, floatAmt: 18, floatDelay: 1.0, px: -0.7, py: 1.2,
    },
    {
        src: '/CFIR6.png', alt: 'Wellness cinematic',
        posClass: 'top-[66%] right-[12%] lg:right-[16%] xl:right-[19%]',
        w: 'w-[190px] lg:w-[215px]', h: 'h-[255px] lg:h-[285px]',
        rotate: '3deg', z: 10, floatDur: 4, floatAmt: 12, floatDelay: 0.5, px: -1.2, py: 0.7,
    },
];



/* ── Floating Card component ── */
const FloatingCard: React.FC<{
    card: typeof CARDS[0];
    smoothX: ReturnType<typeof useSpring>;
    smoothY: ReturnType<typeof useSpring>;
    index: number;
}> = ({ card, smoothX, smoothY, index }) => {
    const xOffset = useTransform(smoothX, v => v * card.px);
    const yOffset = useTransform(smoothY, v => v * card.py);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.1 * index, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`absolute ${card.posClass}`}
            style={{ zIndex: card.z, x: xOffset, y: yOffset }}
        >
            <motion.div
                animate={{ y: [0, -card.floatAmt, 0], rotate: [-0.3, 0.3, -0.3] }}
                transition={{ duration: card.floatDur, delay: card.floatDelay, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.05, zIndex: 40 }}
                className={`${card.w} ${card.h} rounded-[24px] overflow-hidden shadow-[0_20px_55px_rgba(0,0,0,0.15)] border border-white/60 cursor-pointer relative`}
                style={{ rotate: card.rotate }}
            >
                <img src={card.src} alt={card.alt} className="w-full h-full object-cover" draggable={false} />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/8 pointer-events-none" />
            </motion.div>
        </motion.div>
    );
};

/* ══════════════════════════════════════════════════ */
const CertificationsPage: React.FC = () => {
    // Ensure the page starts at the top when navigated to
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    const navigate = useNavigate();
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const smoothX = useSpring(rawX, { stiffness: 35, damping: 18 });
    const smoothY = useSpring(rawY, { stiffness: 35, damping: 18 });

    const sectionRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!sectionRef.current) return;
            const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
            rawX.set((e.clientX - left - width / 2) / 28);
            rawY.set((e.clientY - top - height / 2) / 28);
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    return (
        <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>

            {/* ── Back to Home ── */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onClick={() => navigate('/')}
                className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-emerald-100 shadow-md hover:shadow-lg hover:bg-emerald-50 transition-all group"
            >
                <ChevronLeft className="w-4 h-4 text-emerald-700 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-[11px] font-semibold tracking-widest text-[#0b1310] uppercase">Back</span>
            </motion.button>

            {/* ══ HERO ══ */}
            <section
                ref={sectionRef}
                className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16 lg:pt-36"
            >
                {/* Ambient glows */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                    <div className="absolute -top-20 -left-20 w-[450px] h-[450px] rounded-full bg-emerald-200/20 blur-[100px]" />
                    <div className="absolute -bottom-20 -right-20 w-[420px] h-[420px] rounded-full bg-emerald-300/15 blur-[120px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-teal-100/10 blur-[140px]" />
                </div>

                {/* Floating image cards */}
                <div className="absolute inset-0 z-10 pointer-events-none hidden lg:block">
                    {CARDS.map((card, i) => (
                        <FloatingCard key={card.src} card={card} smoothX={smoothX} smoothY={smoothY} index={i} />
                    ))}
                </div>

                {/* Center text block */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.3, delay: 0.5 }}
                    className="relative z-30 flex flex-col items-center text-center px-6 max-w-xl mx-auto"
                >
                    {/* Pill + tagline */}
                    <div className="flex flex-col items-center gap-[6px] mb-8">
                        <div className="px-5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-emerald-200/80 shadow-sm flex items-center gap-2">
                            <span className="w-[6px] h-[6px] rounded-full bg-emerald-500" />
                            <span className="text-[9px] font-bold tracking-[0.22em] text-[#0d1a14] uppercase">
                                Nirvaha — Certified to Transform
                            </span>
                            <span className="w-[6px] h-[6px] rounded-full bg-emerald-500" />
                        </div>
                        <p className="text-[#5c6b62] text-[11px] font-medium tracking-wide">
                            A premium cinematic experience for an emotionally immersive certification journey.
                        </p>
                    </div>

                    {/* Main headline */}
                    <div className="leading-[0.85] tracking-tight mb-8 select-none">
                        {['CERTIFIED', 'FOR', 'INNER', 'GROWTH'].map((word, i) => (
                            <motion.div
                                key={word}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.65, delay: 0.6 + i * 0.09 }}
                                className={`text-[3.2rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem] xl:text-[7.2rem] font-black uppercase ${
                                    word === 'FOR' ? 'text-[#0f7a55]' : 'text-[#0b1310]'
                                }`}
                            >
                                {word}
                            </motion.div>
                        ))}
                    </div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.9, delay: 1.1 }}
                        className="text-[#5c6b62] text-[13px] leading-[1.65] font-light mb-8 text-center max-w-[420px]"
                    >
                        Discover emotionally grounded certifications<br />
                        designed to nurture clarity, reflection and transformation.
                    </motion.p>

                    {/* CTA */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/learn')}
                        className="bg-[#1a5d47] hover:bg-[#124233] text-white px-9 py-3.5 rounded-full font-bold text-[10px] tracking-[0.24em] uppercase shadow-xl transition-colors"
                    >
                        EXPLORE CERTIFICATIONS
                    </motion.button>
                </motion.div>

            </section>

            {/* ══ DESIGNED FOR EMOTIONAL BALANCE ══ */}
            <section className="relative w-full bg-white overflow-hidden py-32 px-6 lg:px-20 min-h-[700px] flex items-center">
                {/* Subtle leaf watermark */}
                <div className="absolute bottom-0 left-1/4 opacity-[0.03] pointer-events-none select-none text-[480px] leading-none">
                    🌿
                </div>

                <div className="relative max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-28">

                    {/* ── LEFT: Text ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="flex-1 min-w-0"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border border-[#0f7a55]/20 bg-emerald-50/60 backdrop-blur-sm">
                            <span className="text-base">🌿</span>
                            <span className="text-[9px] font-black tracking-[0.28em] text-[#0b4d35] uppercase">
                                Signature Certification Collection
                            </span>
                        </div>

                        {/* Heading */}
                        <h2 className="font-black text-[#0b1310] leading-[1.02] mb-8"
                            style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(2.6rem, 5vw, 4.4rem)' }}>
                            Designed for<br />
                            Emotional Balance<br />
                            <span className="text-[#0f7a55]">&amp; Conscious</span><br />
                            <span className="text-[#0f7a55]">Growth.</span>
                        </h2>

                        {/* Description */}
                        <p className="text-[#3d5249] text-[15px] leading-[1.85] font-normal mb-12 max-w-[480px]">
Discover emotionally grounded certifications designed to nurture
                            clarity, reflection, awareness, and meaningful personal transformation.
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-4">
                            {[
                                { value: '10', label: 'Certifications' },
                                { value: '6–10 wks', label: 'Duration' },
                                { value: '∞', label: 'Lifetime Access' },
                            ].map(stat => (
                                <div key={stat.label}
                                    className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-emerald-50/30 backdrop-blur-sm border border-emerald-100/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                                    <span className="text-[#0b1310] font-black text-[15px]">{stat.value}</span>
                                    <span className="text-[10px] font-bold tracking-[0.18em] text-[#5c6b62] uppercase">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── RIGHT: Single Image (IMAGEEEE.png) ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.0, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="flex-1 flex items-center justify-center w-full"
                    >
                        <motion.div
                            animate={{ y: [0, -12, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-full max-w-[620px] rounded-[36px] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.18)] border-[6px] border-white/80 bg-white"
                        >
                            <img
                                src="/IMAGEEEE.png"
                                alt="Designed for Emotional Balance"
                                className="w-full h-full object-cover select-none"
                                draggable={false}
                            />
                        </motion.div>
                    </motion.div>

                </div>
            </section>

            {/* ══ THE NIRVAHA ADVANTAGE ══ */}
            <section className="relative w-full bg-white py-24 px-4 lg:px-10 overflow-hidden">
                <div className="relative max-w-7xl mx-auto w-full">

                    {/* Section Header */}
                    <div className="mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="font-black text-[#0b1310] tracking-tight mb-4"
                            style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(2.2rem, 4.5vw, 3rem)' }}
                        >
                            THE NIRVAHA ADVANTAGE
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.15 }}
                            className="text-[#3d5249]/90 text-sm md:text-base font-normal max-w-xl leading-relaxed"
                        >
                            Your journey to inner mastery, global recognition, and real transformation.
                        </motion.p>
                    </div>

                    {/* Cards Container – 3-column grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {[
                            {
                                title: "The Nirvaha seal of excellence:",
                                desc: "Backed by the globally trusted Nirvaha name, you carry our seal of excellence – assuring clients and communities of your quality, commitment, and transformational capability.",
                                image: "/advantage1.png"
                            },
                            {
                                title: "Rooted in real results:",
                                desc: "Nirvaha has guided thousands of individuals toward lasting emotional balance and conscious living. Learn from tested, impactful methodologies that create measurable change in real lives.",
                                image: "/advantage2.png"
                            },
                            {
                                title: "Ancient wisdom, modern science:",
                                desc: "Our curriculum weaves Vedic philosophy, Ayurvedic principles, and contemplative traditions with cutting-edge neuroscience and evidence-based psychology for a truly holistic education.",
                                image: "/advantage3.png"
                            },

                        ].map((advantage, index) => (
                            <motion.div
                                key={advantage.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                                whileHover={{ y: -6 }}
                                className="group flex flex-col bg-[#f4f7f5]/70 backdrop-blur-md rounded-[28px] overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.03)] border border-[#0f7a55]/8 hover:shadow-[0_24px_60px_rgba(15,122,85,0.08)] hover:border-[#0f7a55]/20 transition-all duration-500"
                            >
                                {/* Top: Image */}
                                <div className="w-full h-[200px] relative overflow-hidden flex-shrink-0">
                                    <img
                                        src={advantage.image}
                                        alt={advantage.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        draggable={false}
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                                </div>

                                {/* Bottom: Content */}
                                <div className="flex flex-col flex-1 p-6">
                                    <h3 className="font-bold text-[#0b1310] text-[16px] mb-3 leading-snug flex items-start gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#0f7a55]/70 flex-shrink-0 mt-1.5" />
                                        {advantage.title}
                                    </h3>
                                    <p className="text-[#3d5249] text-[13px] leading-[1.8] font-light">
                                        {advantage.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </section>

            {/* ══ FREQUENTLY ASKED QUESTIONS ══ */}
            <section className="relative w-full bg-white py-28 px-6 lg:px-16 border-t border-slate-100 overflow-hidden">
                <div className="relative max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-16 lg:gap-24">

                    {/* Left Column: Heading and description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-[38%] flex flex-col"
                    >
                        <h2 className="font-black text-[#0b1310] tracking-tight leading-[1.1] mb-6"
                            style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(2.2rem, 4.5vw, 3rem)' }}>
                            Frequently<br />
                            asked questions
                        </h2>
                        <p className="text-[#3d5249]/90 text-[14px] md:text-[15px] leading-[1.8] font-normal mb-6">
                            Browse answers to your questions about program access, certifications, and the Nirvaha journey.
                        </p>
                        <p className="text-[#3d5249]/90 text-[14px] md:text-[15px] leading-[1.8] font-normal">
                            Need more help?{" "}
                            <a
                                href="mailto:hello@nirvaha.org"
                                className="text-[#0f7a55] font-semibold underline underline-offset-4 hover:text-[#0b5e41] transition-colors"
                            >
                                hello@nirvaha.org
                            </a>{" "}
                            and we'll get back to you ASAP.
                        </p>
                    </motion.div>

                    {/* Right Column: Accordion */}
                    <div className="flex-1 flex flex-col">
                        {[
                            {
                                q: "How much does a Nirvaha certification cost?",
                                a: "Our certification programs range from $499 to $1,299, depending on the specialization, duration, and whether you opt for live cohort mentoring. We also offer flexible monthly installment plans to support your journey."
                            },
                            {
                                q: "Is it worth getting a wellness certification?",
                                a: "Absolutely. A professional certification from Nirvaha establishes your credibility, equips you with scientifically backed methodologies and Vedic wisdom, and demonstrates your commitment to quality. It prepares you to confidently guide clients and organizations toward emotional stability and resilience."
                            },
                            {
                                q: "How long does it take to complete a certification?",
                                a: "Most of our programs are designed to be completed in 6 to 10 weeks of self-paced study with 3–5 hours of engagement per week. However, you can study entirely on your own schedule as there are no hard deadlines."
                            },
                            {
                                q: "Are Nirvaha certifications globally recognised?",
                                a: "Yes, Nirvaha certifications are respected by leading wellness organizations, holistic centers, and corporate wellness initiatives worldwide. We adhere to high standards of contemplative education and evidence-based coaching protocols."
                            },
                            {
                                q: "What type of certification is most in demand?",
                                a: "Currently, our 'Emotional Balance & Cognitive Wellness' and 'Mindfulness & Conscious Leadership' certifications are in exceptionally high demand, driven by corporate needs for emotional intelligence and stress-resilience mentors."
                            },
                            {
                                q: "Can I practice without a certification?",
                                a: "While basic coaching can be practiced without formal credentials in some regions, having a Nirvaha certification gives you essential diagnostic tools, safety frameworks, and a globally recognized seal that builds instant trust with prospective clients."
                            },
                            {
                                q: "Do I get lifetime access to course materials?",
                                a: "Yes, you receive lifetime access to all core course curriculum, video lectures, workbooks, template resources, and any future curriculum updates automatically, along with access to our global alumni network."
                            }
                        ].map((faq, index) => {
                            const isOpen = activeFaq === index;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-40px" }}
                                    transition={{ duration: 0.6, delay: index * 0.05 }}
                                    className="border-b border-[#0b1310]/10 last:border-0"
                                >
                                    <button
                                        onClick={() => setActiveFaq(isOpen ? null : index)}
                                        className="w-full py-6 flex items-start gap-4 text-left group"
                                    >
                                        {/* Dynamic Plus/Minus Icon */}
                                        <span className="text-[20px] font-light leading-none text-[#3d5249] group-hover:text-[#0f7a55] transition-colors mt-0.5 select-none w-4 flex justify-center">
                                            {isOpen ? "−" : "+"}
                                        </span>
                                        <span className="flex-1 font-bold text-[#0b1310] text-[15px] md:text-[16.5px] leading-snug group-hover:text-[#0f7a55] transition-colors">
                                            {faq.q}
                                        </span>
                                    </button>

                                    {/* Smooth accordion body */}
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            height: isOpen ? "auto" : 0,
                                            opacity: isOpen ? 1 : 0
                                        }}
                                        transition={{ duration: 0.35, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pl-8 pb-6 pr-4 text-[#3d5249] text-[13.5px] md:text-[14.5px] leading-[1.75] font-light">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>

                </div>
            </section>

        </div>
    );
};

export default CertificationsPage;
