import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Quote, Info, Link as LinkIcon, CheckCircle } from 'lucide-react';
import { defaultLibraryItems, LibraryItem } from '../data/libraryData';

const LibraryDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const item: LibraryItem | undefined = defaultLibraryItems.find(i => i.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!item) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#1a1c1a]">
                <div className="text-center">
                    <h2 className="text-4xl text-[#d4af37] font-bold mb-4" style={{ fontFamily: "'Cinzel', serif" }}>Item Not Found</h2>
                    <button 
                        onClick={() => navigate('/')}
                        className="px-6 py-2 border border-[#d4af37] text-[#d4af37] rounded-full hover:bg-[#d4af37] hover:text-black transition-colors"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d1410] text-[#e8e6df] overflow-x-hidden selection:bg-[#d4af37] selection:text-black">
            
            {/* Ancient Theme Background Accents */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10"
                     style={{ background: 'radial-gradient(circle at center, #d4af37 0%, transparent 60%)', filter: 'blur(120px)' }} />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
            </div>

            {/* Navigation Bar */}
            <nav className="relative z-50 p-6 md:p-10 flex items-center justify-between max-w-7xl mx-auto">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 text-[#d4af37] hover:text-[#fff] transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold tracking-wider text-sm md:text-base" style={{ fontFamily: "'Cinzel', serif" }}>Back to Library</span>
                </button>
                <div className="hidden md:block text-[#8c8c88] text-sm tracking-[0.3em] uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
                    Wisdom Treasury
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pb-24">
                
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mt-4 md:mt-12">
                    
                    {/* Left Column: Image & Quick Stats */}
                    <motion.div 
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full lg:w-5/12 shrink-0 space-y-8"
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(212,175,55,0.15)] border border-[#d4af37]/20 bg-black/40">
                            <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-auto object-contain"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            
                            <div className="absolute bottom-0 left-0 w-full p-8 text-center">
                                <span className="inline-block px-4 py-1.5 rounded-full border border-[#d4af37]/50 bg-black/40 backdrop-blur-md text-[#d4af37] text-xs font-bold uppercase tracking-[0.2em] mb-4">
                                    {item.category}
                                </span>
                            </div>
                        </div>

                        {/* Story Short Lines (The old modal content) */}
                        <div className="p-8 rounded-3xl bg-[#141b16] border border-[#d4af37]/10 relative overflow-hidden group hover:border-[#d4af37]/30 transition-colors">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#d4af37] to-transparent opacity-50"></div>
                            <div className="space-y-4">
                                {item.story.split('\n').filter(l => l.trim()).map((line, idx) => (
                                    <p key={idx} className="text-[#a0a5a1] italic text-lg leading-relaxed font-light" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                        "{line}"
                                    </p>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Detailed Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="w-full lg:w-7/12"
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#f2efe9] mb-8 leading-tight tracking-wide drop-shadow-md" style={{ fontFamily: "'Cinzel', serif" }}>
                            {item.title}
                        </h1>

                        {/* Description */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <Info className="w-6 h-6 text-[#d4af37]" />
                                <h3 className="text-2xl font-bold text-[#d4af37] tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>The Essence</h3>
                            </div>
                            <p className="text-[#c1c6c2] text-lg md:text-xl leading-relaxed font-light" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                {item.description}
                            </p>
                        </div>

                        {/* Why They Matter */}
                        <div className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-[#1a231d] to-[#0d1410] border border-[#d4af37]/20 relative">
                            <div className="absolute -top-3 -right-3 text-[#d4af37]/10">
                                <SparkleIcon className="w-24 h-24" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#d4af37] mb-4 tracking-wider relative z-10" style={{ fontFamily: "'Cinzel', serif" }}>Why It Matters Today</h3>
                            <p className="text-[#c1c6c2] text-lg leading-relaxed relative z-10" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                {item.whyTheyMatter}
                            </p>
                        </div>

                        {/* Quotes */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <Quote className="w-6 h-6 text-[#d4af37]" />
                                <h3 className="text-2xl font-bold text-[#d4af37] tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Words of Wisdom</h3>
                            </div>
                            <div className="grid gap-6">
                                {item.quotes.map((quote, idx) => (
                                    <div key={idx} className="pl-6 border-l-2 border-[#d4af37]/40 py-2">
                                        <p className="text-[#e8e6df] text-xl font-light italic leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            "{quote}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Impact Points */}
                        <div className="mb-16">
                            <h3 className="text-2xl font-bold text-[#d4af37] mb-6 tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Profound Impact</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {item.impact.map((point, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-[#141b16] border border-[#d4af37]/10 hover:border-[#d4af37]/30 transition-colors">
                                        <CheckCircle className="w-6 h-6 text-[#d4af37] shrink-0 mt-0.5" />
                                        <span className="text-[#c1c6c2]" style={{ fontFamily: "'Poppins', sans-serif" }}>{point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>



                    </motion.div>
                </div>
            </main>
        </div>
    );
};

const SparkleIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 22C12 22 12 16 18 12C12 8 12 2 12 2C12 2 12 8 6 12C12 16 12 22 12 22Z" />
    </svg>
);

export default LibraryDetailPage;
