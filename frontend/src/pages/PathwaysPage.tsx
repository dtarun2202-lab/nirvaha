import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, Search, Sparkles, Filter, ShieldCheck, ArrowRight } from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import { pathwaysData, Pathway } from '../data/pathwaysData';

const MOODS = ['All', 'Calm', 'Focused', 'Balanced', 'Connected', 'Confident', 'Grounded', 'Inspired', 'Uplifted', 'Aware'];

const PathwaysPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedMood, setSelectedMood] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const filteredPathways = pathwaysData.filter(pathway => {
        const matchesMood = selectedMood === 'All' || pathway.moods.includes(selectedMood);
        const matchesSearch = pathway.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              pathway.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesMood && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#1a5d47] selection:text-white font-sans overflow-x-hidden">
            <SEOHead 
                title="Pathways | Nirvaha Academy"
                description="Expand Awareness Through Modern Learning. Discover immersive pathways for emotional intelligence, mindfulness, and holistic wellness."
            />

            {/* Cinematic Hero */}
            <header className="relative w-full pt-32 pb-24 md:pt-48 md:pb-32 px-6 flex flex-col items-center justify-center text-center overflow-hidden min-h-[70vh]">
                {/* Ambient Background Elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1a5d47] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse-slow"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#fbbf24] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs uppercase tracking-[0.2em] font-medium text-emerald-100">Nirvaha Academy</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] tracking-tight" style={{ fontFamily: "'Cinzel', serif" }}>
                            Expand Awareness<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-white to-emerald-200">Through Modern Learning</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto mt-8">
                            Immersive, expert-led pathways designed to bridge ancient wisdom with your daily reality.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="mt-12 max-w-xl mx-auto relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-500/0 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-50"></div>
                        <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-xl transition-all focus-within:bg-white/10 focus-within:border-emerald-500/50">
                            <Search className="w-6 h-6 text-gray-400 ml-4" />
                            <input 
                                type="text"
                                placeholder="Search pathways, topics, or feelings..."
                                className="w-full bg-transparent border-none outline-none text-white px-4 py-3 placeholder-gray-500 font-light"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Mood Discovery Section */}
            <section className="py-12 border-y border-white/5 bg-white/[0.02] backdrop-blur-md relative z-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <h3 className="text-2xl font-serif text-white mb-2">How do you want to feel today?</h3>
                            <p className="text-gray-400 text-sm">Select a state to discover your recommended pathway.</p>
                        </div>
                        <Filter className="w-6 h-6 text-gray-500 hidden md:block" />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {MOODS.map(mood => (
                            <button
                                key={mood}
                                onClick={() => setSelectedMood(mood)}
                                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                                    selectedMood === mood 
                                        ? 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                                        : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                                }`}
                            >
                                {mood}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pathways Grid */}
            <main className="py-24 max-w-7xl mx-auto px-6 relative z-10">
                <AnimatePresence mode="popLayout">
                    {filteredPathways.length > 0 ? (
                        <motion.div 
                            layout
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                        >
                            {filteredPathways.map((pathway, idx) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4 }}
                                    key={pathway.id}
                                    onClick={() => navigate(`/pathways/${pathway.id}`)}
                                    className="group cursor-pointer relative rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] flex flex-col md:flex-row h-full"
                                >
                                    {/* Image Side */}
                                    <div className="w-full md:w-[40%] h-64 md:h-auto relative overflow-hidden">
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                                        <img 
                                            src={pathway.image} 
                                            alt={pathway.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {/* Floating Badge */}
                                        <div className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-[10px] uppercase tracking-wider text-white font-bold">{pathway.duration}</span>
                                        </div>
                                    </div>

                                    {/* Content Side */}
                                    <div className="p-8 flex flex-col flex-1 relative">
                                        <div className="absolute top-8 right-8 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-500 transition-all duration-300">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                        
                                        <div className="mb-4 inline-flex items-center gap-1.5">
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                            <span className="text-xs uppercase tracking-widest text-emerald-500 font-semibold">{pathway.level}</span>
                                        </div>
                                        
                                        <h3 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-emerald-300 transition-colors">
                                            {pathway.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-1">
                                            {pathway.desc}
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {pathway.moods.map(mood => (
                                                <span key={mood} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                                                    {mood}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-32"
                        >
                            <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-serif text-white mb-2">No pathways found</h3>
                            <p className="text-gray-400">Try adjusting your mood or search terms.</p>
                            <button 
                                onClick={() => { setSearchQuery(''); setSelectedMood('All'); }}
                                className="mt-6 text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
                            >
                                Clear all filters
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default PathwaysPage;
