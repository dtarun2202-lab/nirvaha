import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Quote, Sparkles, BookOpen, Clock, Calendar } from 'lucide-react';
import { storiesData, Story } from '../data/storiesData';
import SEOHead from '../components/common/SEOHead';

const StoryDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const story: Story | undefined = storiesData.find(s => s.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!story) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f0f9f4]">
                <div className="text-center">
                    <h2 className="text-4xl text-[#1a5d47] font-bold mb-4" style={{ fontFamily: "'Cinzel', serif" }}>Story Not Found</h2>
                    <button 
                        onClick={() => navigate('/stories')}
                        className="px-6 py-2 border border-[#1a5d47] text-[#1a5d47] rounded-full hover:bg-[#1a5d47] hover:text-white transition-colors"
                    >
                        Return to Stories
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] text-[#0F131A] overflow-x-hidden selection:bg-[#1a5d47] selection:text-white font-sans">
            <SEOHead 
                title={`${story.title} | Nirvaha Stories`}
                description={story.subtitle}
            />

            {/* Navigation Bar */}
            <nav className="relative z-50 p-6 md:p-10 flex items-center justify-between max-w-6xl mx-auto">
                <button 
                    onClick={() => navigate('/stories')}
                    className="flex items-center gap-3 text-[#1a5d47] hover:text-[#2c8d6d] transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold tracking-widest text-xs uppercase">All Stories</span>
                </button>
            </nav>

            {/* Hero Section */}
            <header className="relative w-full max-w-4xl mx-auto px-6 md:px-12 pt-8 pb-16 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-10 mx-auto w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl border-4 border-white/50 relative"
                >
                    <img 
                        src={story.image} 
                        alt={story.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10 pointer-events-none"></div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-[#0F131A]" style={{ fontFamily: "'Cinzel', serif" }}>
                        {story.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-[#595e67] font-light max-w-2xl mx-auto leading-relaxed">
                        {story.subtitle}
                    </p>
                </motion.div>
            </header>

            {/* Main Content Area */}
            <main className="relative z-20 w-full max-w-4xl mx-auto px-6 md:px-12 pb-24">
                <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-16 shadow-[0_20px_60px_-15px_rgba(26,93,71,0.05)] border border-emerald-50">
                    
                    {/* Author Meta */}
                    <div className="flex items-center gap-4 mb-16 pb-8 border-b border-gray-100">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl font-serif">
                            {story.author.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 tracking-wider uppercase font-semibold mb-1">Written By</p>
                            <p className="text-lg text-gray-900 font-medium">{story.author}</p>
                        </div>
                    </div>

                    {/* Content Blocks */}
                    <article className="space-y-10">
                        {story.contentBlocks.map((block, idx) => {
                            if (block.type === 'paragraph') {
                                return (
                                    <p key={idx} className="text-xl text-[#4a5056] leading-[1.8] font-light">
                                        {block.content}
                                    </p>
                                );
                            } else if (block.type === 'highlight') {
                                return (
                                    <div key={idx} className="my-12 p-8 md:p-10 bg-emerald-50/50 border-l-4 border-[#1a5d47] rounded-r-2xl relative">
                                        <Sparkles className="absolute top-6 right-6 w-8 h-8 text-emerald-200 opacity-50" />
                                        <p className="text-2xl text-[#1a5d47] leading-relaxed font-serif italic">
                                            {block.content}
                                        </p>
                                    </div>
                                );
                            } else if (block.type === 'quote') {
                                return (
                                    <figure key={idx} className="my-16 text-center">
                                        <Quote className="w-12 h-12 mx-auto text-emerald-200 mb-6 rotate-180" />
                                        <blockquote className="text-3xl md:text-4xl text-[#0F131A] font-bold leading-tight mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
                                            "{block.content}"
                                        </blockquote>
                                        {block.author && (
                                            <figcaption className="text-emerald-700 font-medium tracking-widest uppercase text-sm">
                                                — {block.author}
                                            </figcaption>
                                        )}
                                    </figure>
                                );
                            }
                            return null;
                        })}
                    </article>

                    {/* Insights Section */}
                    <div className="mt-20 pt-16 border-t border-gray-100/50">
                        <div className="text-center mb-12">
                            <BookOpen className="w-8 h-8 text-[#1a5d47] mx-auto mb-4 opacity-80" />
                            <h3 className="text-3xl font-bold text-[#0F131A] tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Key Insights</h3>
                            <div className="w-16 h-1 bg-emerald-200 mx-auto mt-6 rounded-full"></div>
                        </div>
                        
                        <div className="space-y-6">
                            {story.insights.map((insight, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ x: 5 }}
                                    className="flex items-start gap-6 p-6 md:p-8 rounded-2xl bg-white/50 border border-emerald-50 hover:bg-emerald-50/30 transition-colors group"
                                >
                                    <div className="w-12 h-12 shrink-0 rounded-full bg-emerald-100 flex items-center justify-center text-[#1a5d47] font-bold text-lg font-serif group-hover:bg-[#1a5d47] group-hover:text-white transition-colors">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-[#0F131A] mb-2">{insight.title}</h4>
                                        <p className="text-[#595e67] leading-relaxed font-light text-lg">{insight.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default StoryDetailPage;
