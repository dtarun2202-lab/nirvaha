import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { pathwaysData, Pathway } from '../data/pathwaysData';
import SyllabusHero from '../components/syllabus/SyllabusHero';
import WhatYouWillLearn from '../components/syllabus/WhatYouWillLearn';
import CurriculumTimeline from '../components/syllabus/CurriculumTimeline';
import CertificatePreviewSection from '../components/syllabus/CertificatePreviewSection';
import SyllabusFooter from '../components/syllabus/SyllabusFooter';
import SEOHead from '../components/common/SEOHead';

const SyllabusPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    const pathway: Pathway | undefined = pathwaysData.find(p => p.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!pathway) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">Pathway not found.</div>;
    }

    return (
        <div className="min-h-screen bg-[#050705] text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden">
            <SEOHead 
                title={`${pathway.title} Syllabus | Nirvaha`}
                description={`Explore the comprehensive curriculum for the ${pathway.title} certification journey.`}
            />

            {/* Sticky Minimal Nav */}
            <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-6 py-4 md:px-12 md:py-6 flex items-center justify-between ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-3 md:py-4' : ''}`}>
                <button 
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-3 text-white/60 hover:text-white transition-all"
                >
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5 transition-all">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] hidden md:block">Back to Detail</span>
                </button>

                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-500/80">Premium Certification</span>
                </div>

                <button 
                    onClick={() => navigate(`/pathways/${id}/journey`)}
                    className="px-6 py-2 bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-emerald-400 hover:scale-105 transition-all"
                >
                    Enroll Now
                </button>
            </nav>

            {/* Atmosphere & Particles */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-950/20 rounded-full blur-[200px] -mr-96 -mt-96 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-teal-950/10 rounded-full blur-[150px] -ml-48 -mb-48" />
                
                {/* Micro Particles */}
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: Math.random() * 1000, y: Math.random() * 1000 }}
                        animate={{ 
                            y: [null, '-100vh'],
                            opacity: [0, 0.3, 0]
                        }}
                        transition={{ 
                            duration: 10 + Math.random() * 20, 
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute w-1 h-1 bg-emerald-400/20 rounded-full"
                    />
                ))}
            </div>

            <main className="relative z-10">
                <SyllabusHero pathway={pathway} onStart={() => navigate(`/pathways/${id}/journey`)} />
                
                <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-32 py-32">
                    <WhatYouWillLearn />
                    <CurriculumTimeline pathway={pathway} />
                    <CertificatePreviewSection pathway={pathway} />
                    <SyllabusFooter pathway={pathway} />
                </div>
            </main>
        </div>
    );
};

export default SyllabusPage;
