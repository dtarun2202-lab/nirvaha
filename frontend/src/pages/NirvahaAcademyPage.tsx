import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { DashboardFooter } from '../components/dashboard/DashboardFooter';

// --- Programs Data ---
const programs = [
    {
        title: 'Entrepreneurial Decision Intelligence',
        description: 'Decision strategies and judgment frameworks for founders and innovators.',
        cta: 'Learn More',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
        feel: 'Strategic & Visionary',
    },
    {
        title: 'Cognitive & Decision Making in AI Systems',
        description: 'Human-AI interaction and advanced decision processes.',
        cta: 'Learn More',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80',
        feel: 'Analytical & Innovative',
    },
    {
        title: 'Attention Dynamics & Thinking Discipline',
        description: 'Focus management and cognitive control techniques.',
        cta: 'Learn More',
        image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=600&q=80',
        feel: 'Focused & Mindful',
    },
    {
        title: 'Verbal Clarity & Professional Communication',
        description: 'Effective communication and strategic interaction skills.',
        cta: 'Learn More',
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80',
        feel: 'Articulate & Confident',
    },
];

const programCardStyles = [
    'bg-gradient-to-br from-[#e0f7fa] to-[#fffde4]',
    'bg-gradient-to-br from-[#fceabb] to-[#f8b500]/30',
    'bg-gradient-to-br from-[#f8ffae] to-[#43cea2]/30',
    'bg-gradient-to-br from-[#e0c3fc] to-[#8ec5fc]/40',
];

// --- Impact Skills ---
const impactSkills = [
    {
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 text-[#1a5d47]">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
                <path d="M24 14l4 6h-8l4-6z M18 26h12 M20 30h8 M24 34v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="16" cy="18" r="2" stroke="currentColor" strokeWidth="1" />
                <circle cx="32" cy="18" r="2" stroke="currentColor" strokeWidth="1" />
                <line x1="18" y1="18" x2="22" y2="16" stroke="currentColor" strokeWidth="1" />
                <line x1="30" y1="18" x2="26" y2="16" stroke="currentColor" strokeWidth="1" />
            </svg>
        ),
        label: 'Structured Reasoning',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80',
    },
    {
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 text-[#1a5d47]">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
                <rect x="18" y="14" width="3" height="20" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="23" y="18" width="3" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="28" y="10" width="3" height="24" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        ),
        label: 'Bias Awareness',
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80',
    },
    {
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 text-[#1a5d47]">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="24" cy="20" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M18 34c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="24" cy="20" r="2" fill="currentColor" />
            </svg>
        ),
        label: 'Attention Control',
        image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=400&q=80',
    },
    {
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 text-[#1a5d47]">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14 28h6l2-4 4 8 4-12 3 8h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        label: 'Clear Communication',
        image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=400&q=80',
    },
];


// --- Tags ---
const tags = ['Skill-Focused', 'Assessment-Based', 'Industry Relevant', 'No Prior Expertise Needed'];

const NirvahaAcademyPage: React.FC = () => {
    

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <Navigation currentPage="academy" />

            {/* ===== HERO SECTION ===== */}
            <section className="relative overflow-hidden bg-white border-b border-gray-100">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Left */}
                        <div className="flex-1">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7 }}
                                className="text-4xl sm:text-5xl lg:text-[3.2rem] font-bold text-[#0F131A] mb-4 leading-tight"
                                style={{ fontFamily: "'Cinzel', serif" }}
                            >
                                Nirvaha Academy
                            </motion.h1>
                            <motion.h2
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                                className="text-xl sm:text-2xl font-semibold text-[#0F131A] mb-4"
                            >
                                Mental Performance & Reasoning Certifications
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="text-[#595e67] text-base sm:text-lg mb-8 leading-relaxed font-light"
                            >
                                Programs to enhance reasoning clarity, attention stability, and professional thinking for modern decision environments.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                                className="flex flex-wrap gap-4"
                            >
                                <a
                                    href="#programs"
                                    className="px-7 py-3 rounded-lg bg-[#1a5d47] text-white font-semibold text-sm shadow hover:bg-[#174c39] transition-all"
                                >
                                    Explore Programs
                                </a>
                                <a
                                    href="#impact"
                                    className="px-7 py-3 rounded-lg bg-white text-[#0F131A] font-semibold text-sm border border-gray-300 hover:border-[#1a5d47] hover:text-[#1a5d47] transition-all"
                                >
                                    View Certification Framework
                                </a>
                            </motion.div>
                        </div>
                        {/* Right — Hero Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="flex-1 flex items-center justify-center"
                        >
                            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-[#e2e8f0]">
                                <motion.img
                                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80"
                                    alt="Nirvaha Academy - students collaborating"
                                    className="w-full h-72 sm:h-96 object-cover"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                        (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Nirvaha+Academy&background=1a5d47&color=ffffff&bold=true&size=600';
                                    }}
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a5d47]/30 to-transparent pointer-events-none" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== TAGS BAR ===== */}
            <section className="border-b border-gray-100 bg-white">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
                        {tags.map((tag, i) => (
                            <span key={i} className="text-sm text-[#595e67] font-medium tracking-wide">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== OUR PROGRAMS ===== */}
            <section id="programs" className="bg-white py-16 lg:py-24">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.7 }}
                        className="text-3xl sm:text-4xl font-bold text-[#0F131A] mb-12"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Our Programs
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                        {programs.map((program, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: false, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                                whileHover={{ scale: 1.03, y: -4 }}
                                className={`relative group rounded-xl border border-[#e2e8f0] flex flex-col sm:flex-row items-stretch overflow-hidden shadow-lg ${programCardStyles[idx % programCardStyles.length]}`}
                                style={{ minHeight: 200 }}
                            >
                                {/* Image holder */}
                                <div className="sm:w-2/5 w-full h-44 sm:h-auto flex items-center justify-center bg-white/30 overflow-hidden">
                                    <motion.img
                                        src={program.image}
                                        alt={program.title}
                                        className="object-cover w-full h-full"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(program.title)}&background=ffffff&color=1a5d47&bold=true&size=300`;
                                        }}
                                    />
                                </div>
                                {/* Content */}
                                <div className="flex-1 p-5 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-semibold text-[#1a5d47] mb-2 drop-shadow-sm">
                                            {program.title}
                                        </h3>
                                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                                            {program.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#e0f7fa] to-[#1a5d47]/20 text-[#1a5d47] border border-[#1a5d47]/30">
                                            <svg className="w-4 h-4 mr-1 text-[#1a5d47]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l2 2" /></svg>
                                            <span className="uppercase tracking-wide">Feel:</span>&nbsp;{program.feel}
                                        </span>
                                    </div>
                                </div>
                                {/* Hover CTA overlay */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="opacity-0 group-hover:opacity-100 pointer-events-auto flex items-center justify-center transition-all duration-300 w-full h-full">
                                        <div className="backdrop-blur-md bg-white/60 rounded-2xl flex items-center justify-center w-full h-full absolute z-0 transition-all duration-300" />
                                        <button className="relative z-10 px-8 py-3 rounded-full bg-white/80 backdrop-blur-lg text-[#1a5d47] text-lg font-bold shadow-2xl border border-[#1a5d47]/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1a5d47]/50 hover:bg-gradient-to-r hover:from-[#06beb6] hover:to-[#48b1f3] hover:text-white hover:border-transparent">
                                            {program.cta} <ArrowRight className="w-4 h-4 inline ml-1" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== DIVIDER ===== */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <hr className="border-gray-200" />
            </div>

            {/* ===== WHY NIRVAHA ACADEMY EXISTS ===== */}
            <section className="bg-white py-16 lg:py-20">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                        {/* Left image */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.7 }}
                            className="flex-1 w-full"
                        >
                            <div className="rounded-2xl overflow-hidden shadow-xl border border-[#e2e8f0] bg-gradient-to-br from-[#e0f7fa]/40 to-[#f8ffae]/30">
                                <motion.img
                                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80"
                                    alt="Professional thinking and reasoning"
                                    className="w-full h-56 sm:h-72 object-cover"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                        (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Why+Academy&background=1a5d47&color=ffffff&bold=true&size=500';
                                    }}
                                />
                            </div>
                        </motion.div>
                        {/* Right text */}
                        <div className="flex-1 text-center lg:text-left">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false }}
                                transition={{ duration: 0.7 }}
                                className="text-3xl sm:text-4xl font-bold text-[#0F131A] mb-5"
                                style={{ fontFamily: "'Cinzel', serif" }}
                            >
                                Why Nirvaha Academy Exists
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 14 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false }}
                                transition={{ duration: 0.7, delay: 0.15 }}
                                className="text-[#595e67] text-base sm:text-lg font-light leading-relaxed"
                            >
                                Building the core thinking skills essential for navigating complexity, distraction, and uncertainty in today's work environment.
                            </motion.p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== DIVIDER ===== */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <hr className="border-gray-200" />
            </div>

            {/* ===== DESIGNED FOR PROFESSIONAL IMPACT ===== */}
            <section id="impact" className="bg-white py-16 lg:py-20">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.7 }}
                        className="text-3xl sm:text-4xl font-bold text-[#0F131A] mb-4"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Designed for Professional Impact
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-[#595e67] text-base sm:text-lg max-w-3xl mx-auto mb-14 font-light leading-relaxed"
                    >
                        Certifications to enhance structured thinking, bias awareness, and communication precision.
                    </motion.p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {impactSkills.map((skill, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false }}
                                transition={{ duration: 0.5, delay: idx * 0.12 }}
                                whileHover={{ y: -6, scale: 1.03 }}
                                className="flex flex-col items-center gap-3 group"
                            >
                                <div className="relative w-full rounded-xl overflow-hidden shadow-md border border-[#e2e8f0] bg-white">
                                    <motion.img
                                        src={skill.image}
                                        alt={skill.label}
                                        className="w-full h-36 sm:h-44 object-cover"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(skill.label)}&background=1a5d47&color=ffffff&bold=true&size=300`;
                                        }}
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F131A]/50 to-transparent pointer-events-none" />
                                    {/* Icon badge */}
                                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                                        {skill.icon}
                                    </div>
                                </div>
                                <span className="text-sm text-[#0F131A] font-medium text-center leading-snug">
                                    {skill.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CONTACT / QUERIES ===== */}
            <section className="bg-[#f7fafc] py-16 lg:py-20 border-t border-gray-100">
                <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.7 }}
                        className="text-3xl sm:text-4xl font-bold text-[#0F131A] mb-4 text-center"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Questions or Queries?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-[#595e67] text-base sm:text-lg text-center max-w-2xl mx-auto font-light"
                    >
                        If you'd like to learn more about a program, have specific queries, or need help choosing the right certification, reach out — we're here to help.
                    </motion.p>

                    <form className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Your name"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#1a5d47]/30 outline-none"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#1a5d47]/30 outline-none"
                        />
                        <textarea
                            name="message"
                            placeholder="How can we help?"
                            rows={5}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#1a5d47]/30 outline-none resize-none"
                        />
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => window.location.href = 'mailto:hello@nirvaha.org'}
                                className="px-6 py-3 rounded-lg bg-[#1a5d47] text-white font-semibold shadow hover:bg-[#174c39] transition-all"
                            >
                                Contact Us
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <DashboardFooter />
        </div>
    );
};

export default NirvahaAcademyPage;
