import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Quote, Sparkles, BookOpen, Clock, Calendar, Leaf, Heart, Star } from 'lucide-react';
import { storiesData, Story } from '../data/storiesData';
import SEOHead from '../components/common/SEOHead';

const StoryDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const story: Story | undefined = storiesData.find(s => s.id === id);

    useEffect(() => { window.scrollTo(0, 0); }, [id]);

    if (!story) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0f9f4]">
            <div className="text-center space-y-4">
                <h2 className="text-4xl text-[#1a5d47] font-bold" style={{ fontFamily: "'Cinzel', serif" }}>Story Not Found</h2>
                <button onClick={() => navigate('/stories')} className="px-6 py-3 bg-[#1a5d47] text-white rounded-full hover:bg-[#154b39] transition-all">Back to Stories</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f5fbf7] text-[#1a2e25] overflow-x-hidden selection:bg-emerald-200 selection:text-[#1a5d47]" style={{ fontFamily: "'Georgia', serif" }}>
            <SEOHead title={`${story.title} | Nirvaha Stories`} description={story.subtitle} />

            {/* Ambient background blobs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-emerald-100/60 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-[100px]" />
                <div className="absolute -bottom-40 right-1/3 w-[600px] h-[600px] bg-green-100/50 rounded-full blur-[120px]" />
                {/* Floating particles */}
                {[...Array(12)].map((_, i) => (
                    <motion.div key={i}
                        className="absolute w-1.5 h-1.5 rounded-full bg-emerald-300/40"
                        style={{ left: `${8 + i * 8}%`, top: `${15 + (i % 5) * 18}%` }}
                        animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 4 + i * 0.7, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
                    />
                ))}
            </div>

            {/* Sticky Nav */}
            <nav className="sticky top-0 z-50 px-6 md:px-12 py-5 flex items-center justify-between backdrop-blur-xl bg-[#f5fbf7]/80 border-b border-emerald-100/50">
                <motion.button
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
                    onClick={() => navigate('/stories')}
                    className="flex items-center gap-3 text-[#1a5d47] hover:text-[#2c8d6d] transition-colors group"
                >
                    <div className="w-9 h-9 rounded-full border border-[#1a5d47]/30 flex items-center justify-center group-hover:bg-[#1a5d47] group-hover:text-white transition-all">
                        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.3em] hidden md:block">Back to Stories</span>
                </motion.button>
                <div className="flex items-center gap-2 opacity-60">
                    <Leaf size={14} className="text-emerald-600" />
                    <span className="text-xs uppercase tracking-widest text-[#1a5d47] font-bold">Nirvaha Stories</span>
                </div>
            </nav>

            {/* Hero Banner */}
            <header ref={heroRef} className="relative w-full h-[75vh] min-h-[500px] overflow-hidden">
                <motion.div className="absolute inset-0" style={{ y: heroY }}>
                    <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                    {/* Strong dark overlay for legibility */}
                    <div className="absolute inset-0 bg-black/55" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#f5fbf7]" />
                </motion.div>

                {/* Hero text overlay */}
                <motion.div style={{ opacity: heroOpacity }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-white/15 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] text-white mb-8 shadow-sm"
                    >
                        <Sparkles size={10} /> Transformation Story
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6 max-w-5xl"
                        style={{ fontFamily: "'Cinzel', serif", textShadow: "0 4px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.7)" }}
                    >
                        {story.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-xl md:text-2xl text-white/80 font-light max-w-2xl leading-relaxed italic"
                        style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
                    >
                        {story.subtitle}
                    </motion.p>
                </motion.div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#f5fbf7] to-transparent z-10" />
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 pb-32 -mt-16">

                {/* Meta card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                    className="flex flex-wrap items-center justify-center gap-6 md:gap-10 bg-white/70 backdrop-blur-xl border border-emerald-100 rounded-3xl px-8 py-6 mb-16 shadow-[0_8px_40px_rgba(26,93,71,0.08)]"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-[#1a5d47] font-bold text-lg font-serif">{story.author.charAt(0)}</div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-[#1a5d47]/50 font-bold mb-0.5">Author</p>
                            <p className="text-sm font-bold text-[#1a2e25]">{story.author}</p>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-emerald-100 hidden md:block" />
                    <div className="flex items-center gap-2 text-[#595e67]">
                        <Calendar size={14} className="text-emerald-400" />
                        <span className="text-sm">{story.date}</span>
                    </div>
                    <div className="w-px h-8 bg-emerald-100 hidden md:block" />
                    <div className="flex items-center gap-2 text-[#595e67]">
                        <Clock size={14} className="text-emerald-400" />
                        <span className="text-sm">{story.readTime}</span>
                    </div>
                </motion.div>

                {/* Hero Quote Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative mb-20 p-10 md:p-14 rounded-[2.5rem] overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #1a5d47 0%, #2c8d6d 60%, #3aad87 100%)" }}
                >
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
                    <Quote className="w-12 h-12 text-white/20 mb-6 rotate-180" />
                    <p className="text-2xl md:text-3xl text-white/90 font-light italic leading-relaxed max-w-2xl" style={{ fontFamily: "'Georgia', serif" }}>
                        {story.heroQuote}
                    </p>
                    <div className="flex items-center gap-3 mt-8">
                        <div className="w-8 h-[1px] bg-white/40" />
                        <span className="text-white/50 text-xs uppercase tracking-widest font-bold">{story.author}</span>
                    </div>
                    {/* Glowing orb */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                </motion.div>

                {/* Story Purpose / Aim Label */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    className="flex items-center gap-3 mb-10"
                >
                    <div className="w-1 h-10 bg-gradient-to-b from-emerald-400 to-teal-300 rounded-full" />
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-[#1a5d47]/50 font-bold">The Journey</p>
                        <p className="text-sm text-[#1a5d47] font-medium">A story of healing, growth & transformation</p>
                    </div>
                </motion.div>

                {/* Content Blocks */}
                <article className="space-y-10 mb-20">
                    {story.contentBlocks.map((block, idx) => {
                        if (block.type === 'paragraph') return (
                            <motion.p key={idx}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ duration: 0.7, delay: idx * 0.05 }}
                                className="text-xl text-[#3a5046] leading-[1.9] font-light"
                            >{block.content}</motion.p>
                        );
                        if (block.type === 'highlight') return (
                            <motion.div key={idx}
                                initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }} transition={{ duration: 0.7 }}
                                className="relative my-10 pl-8 pr-6 py-8 bg-gradient-to-r from-emerald-50 to-teal-50/50 border-l-4 border-[#1a5d47] rounded-r-3xl"
                            >
                                <Sparkles className="absolute top-5 right-5 w-6 h-6 text-emerald-200" />
                                <p className="text-xl text-[#1a5d47] leading-relaxed font-medium italic">{block.content}</p>
                            </motion.div>
                        );
                        if (block.type === 'quote') return (
                            <motion.figure key={idx}
                                initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }} transition={{ duration: 0.8 }}
                                className="my-16 text-center bg-white/60 backdrop-blur-sm border border-emerald-100 rounded-[2rem] p-10 md:p-14 shadow-[0_4px_30px_rgba(26,93,71,0.06)]"
                            >
                                <Quote className="w-10 h-10 mx-auto text-emerald-200 mb-6 rotate-180" />
                                <blockquote className="text-2xl md:text-3xl text-[#0d2018] font-bold leading-snug mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
                                    "{block.content}"
                                </blockquote>
                                {block.author && <figcaption className="text-emerald-600 font-medium tracking-widest uppercase text-xs">— {block.author}</figcaption>}
                            </motion.figure>
                        );
                        return null;
                    })}
                </article>

                {/* Key Takeaways / Transformation Points */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.8 }}
                    className="mb-20"
                >
                    <div className="text-center mb-12">
                        <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-500 font-bold block mb-3">Transformation Points</span>
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-emerald-300" />
                            <BookOpen className="w-7 h-7 text-[#1a5d47]" />
                            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-emerald-300" />
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-[#0d2018]" style={{ fontFamily: "'Cinzel', serif" }}>Key Insights</h3>
                    </div>

                    <div className="space-y-5">
                        {story.insights.map((insight, idx) => (
                            <motion.div key={idx}
                                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }} transition={{ duration: 0.6, delay: idx * 0.12 }}
                                whileHover={{ x: 6, transition: { duration: 0.2 } }}
                                className="flex items-start gap-6 p-7 md:p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-emerald-100/80 hover:border-emerald-200 hover:shadow-[0_8px_30px_rgba(26,93,71,0.08)] transition-all duration-300 group cursor-default"
                            >
                                <div className="shrink-0 w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#1a5d47] font-bold text-lg group-hover:bg-[#1a5d47] group-hover:text-white group-hover:border-[#1a5d47] transition-all duration-300" style={{ fontFamily: "'Cinzel', serif" }}>
                                    {idx + 1}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-[#0d2018] mb-2 group-hover:text-[#1a5d47] transition-colors">{insight.title}</h4>
                                    <p className="text-[#595e67] leading-relaxed font-light">{insight.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Emotional Closing Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.9 }}
                    className="text-center py-16 px-8 rounded-[3rem] relative overflow-hidden"
                    style={{ background: "linear-gradient(160deg, #e8f7ef 0%, #d0ede0 50%, #e8f7ef 100%)" }}
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(26,93,71,0.04)_0%,transparent_70%)]" />
                    {/* Floating hearts */}
                    {[...Array(3)].map((_, i) => (
                        <motion.div key={i}
                            className="absolute"
                            style={{ left: `${20 + i * 30}%`, top: `${10 + i * 10}%` }}
                            animate={{ y: [0, -12, 0], opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.8 }}
                        >
                            <Heart size={i === 1 ? 20 : 14} className="text-emerald-300 fill-emerald-200" />
                        </motion.div>
                    ))}
                    <div className="relative z-10 space-y-4">
                        <div className="flex justify-center gap-2 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} className="text-amber-400 fill-amber-300" />
                            ))}
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.5em] text-[#1a5d47]/50 font-bold">Every Journey Matters</p>
                        <p className="text-2xl md:text-3xl text-[#1a2e25] font-light italic max-w-xl mx-auto leading-relaxed" style={{ fontFamily: "'Georgia', serif" }}>
                            "Your path to healing begins with a single conscious breath."
                        </p>
                        <p className="text-[#1a5d47]/60 text-sm uppercase tracking-widest font-medium mt-2">— The Nirvaha Way</p>
                    </div>
                </motion.div>

                {/* Back to Stories CTA */}
                <motion.div
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    className="text-center mt-20"
                >
                    <button
                        onClick={() => navigate('/stories')}
                        className="group inline-flex items-center gap-3 px-10 py-5 bg-[#1a5d47] text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#154b39] hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(26,93,71,0.25)]"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to All Stories
                    </button>
                </motion.div>
            </main>
        </div>
    );
};

export default StoryDetailPage;
