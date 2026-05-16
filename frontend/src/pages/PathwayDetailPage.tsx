import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, ShieldCheck, GraduationCap, Users, PlayCircle, BookOpen, Star, Target } from 'lucide-react';
import { pathwaysData, Pathway } from '../data/pathwaysData';
import SEOHead from '../components/common/SEOHead';

const PathwayDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const pathway: Pathway | undefined = pathwaysData.find(p => p.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!pathway) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-3xl font-serif mb-4">Pathway Not Found</h2>
                    <button onClick={() => navigate('/pathways')} className="text-emerald-400 hover:text-emerald-300 underline">Return to Hub</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#1a5d47] selection:text-white font-sans overflow-x-hidden">
            <SEOHead 
                title={`${pathway.title} | Nirvaha Pathways`}
                description={pathway.desc}
            />

            {/* Back Navigation */}
            <nav className="fixed top-0 left-0 w-full z-50 p-6 md:p-8 flex items-center justify-between mix-blend-difference pointer-events-none">
                <button 
                    onClick={() => navigate('/pathways')}
                    className="pointer-events-auto flex items-center gap-3 text-white hover:text-emerald-300 transition-colors group bg-black/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold tracking-widest text-xs uppercase">All Pathways</span>
                </button>
            </nav>

            {/* Netflix-Style Cinematic Banner */}
            <header className="relative w-full h-[85vh] flex items-end pb-24">
                <div className="absolute inset-0">
                    <img 
                        src={pathway.image} 
                        alt={pathway.title}
                        className="w-full h-full object-cover"
                    />
                    {/* Multi-layered gradient for that cinematic fade into background */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent opacity-80"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-12 lg:items-end">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1"
                    >
                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5" /> Certification
                            </span>
                            <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" /> {pathway.duration}
                            </span>
                            <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <Target className="w-3.5 h-3.5" /> {pathway.level}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl" style={{ fontFamily: "'Cinzel', serif" }}>
                            {pathway.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl leading-relaxed mb-8">
                            {pathway.desc}
                        </p>

                        <div className="flex flex-wrap items-center gap-4">
                            <button 
                                onClick={() => navigate(`/pathways/${id}/journey`)}
                                className="bg-white text-black px-8 py-4 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
                            >
                                <PlayCircle className="w-6 h-6" /> Start Pathway
                            </button>
                            <button 
                                onClick={() => navigate(`/pathways/${id}/syllabus`)}
                                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-lg font-bold flex items-center gap-2 hover:bg-white/20 transition-colors"
                            >
                                <BookOpen className="w-6 h-6" /> View Syllabus
                            </button>
                        </div>
                    </motion.div>

                    {/* Stats Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full lg:w-80 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hidden md:block"
                    >
                        <h4 className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-6 border-b border-white/10 pb-4">Pathway Details</h4>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Instructor</p>
                                    <p className="font-medium">{pathway.instructor}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Cohort Size</p>
                                    <p className="font-medium">Intimate (Max 20)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                                    <Star className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Rating</p>
                                    <p className="font-medium">4.9/5 (120 Reviews)</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
                
                {/* Left Column: Outcomes */}
                <div className="lg:col-span-1 space-y-12">
                    <div>
                        <h3 className="text-2xl font-bold mb-6 font-serif">Learning Outcomes</h3>
                        <ul className="space-y-4">
                            {pathway.outcomes.map((outcome, idx) => (
                                <li key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed">{outcome}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Column: Glowing Timeline */}
                <div className="lg:col-span-2">
                    <h3 className="text-2xl font-bold mb-8 font-serif">Your Learning Journey</h3>
                    
                    <div className="relative border-l-2 border-white/10 ml-6 md:ml-8 space-y-12 pb-12">
                        {pathway.timeline.map((step, idx) => {
                            const isLast = idx === pathway.timeline.length - 1;
                            return (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    key={idx} 
                                    className="relative pl-10 md:pl-16 group"
                                >
                                    {/* Glowing Node */}
                                    <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-[#0a0a0a] z-10 transition-colors duration-300 ${isLast ? 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)]' : 'bg-emerald-500 group-hover:bg-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]'}`}></div>
                                    
                                    {/* Content Card */}
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-colors duration-300">
                                        <span className={`text-xs font-bold uppercase tracking-widest mb-2 block ${isLast ? 'text-amber-400' : 'text-emerald-400'}`}>
                                            {isLast ? 'Final Milestone' : `Step 0${idx + 1}`}
                                        </span>
                                        <h4 className="text-xl md:text-2xl font-bold mb-3 text-white">{step.title}</h4>
                                        <p className="text-gray-400 leading-relaxed font-light">{step.description}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

            </main>
        </div>
    );
};

export default PathwayDetailPage;
