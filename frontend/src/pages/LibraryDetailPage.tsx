import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Quote, BookOpen, CheckCircle, Sparkles, Flame, Star, Sun } from 'lucide-react';
import { defaultLibraryItems, LibraryItem } from '../data/libraryData';

const curatedImageSets: Record<string, string[]> = {
    'agni-the-sacred-fire': ['/agni1.png', '/agni2.png', '/agni3.png', '/agni4.png'],
    'manas-shuddhi-mental-clarity': ['/manas%20sudhi1.png', '/manas%20sudhi2.png', '/manas%20sudhi3.png', '/manas%20sudhi4.png'],
    'bramhacharya-energy-mastery': ['/brahma1.png', '/brahma2.png', '/brahma3.png', '/brahma4.png'],
    'dhinacharya-daily-routine': ['/dhinacharya1.png', '/dhinacharya2.png', '/dhinacharya3.png', '/dhinacharya4.png'],
    'indriya-nigraha-sensory-control': ['/swami1.png', '/swami2.png', '/swami3.png', '/swami4.png'],
    'saradhi-the-divine-guide': ['/pati1.png', '/pati2.png', '/pati3.png', '/pati4.png'],
    'vyayama-sacred-movement': ['/singh1.png', '/singh2.png', '/singh3.png', '/singh4.png'],
    'civilizational-wisdom': ['/BR1.png', '/BR2.png', '/BR3.png', '/BR4.png'],
    'ritucharya-seasonal-harmony': ['/sundar1.png', '/sundar2.png', '/sundar3.png', '/sundar4.png'],
    'satmya-holistic-adaptability': ['/tata1.png', '/tata2.png', '/tata3.png', '/tata4.png'],
    'nidra-conscious-sleep': ['/nidra1.png', '/nidra2.png', '/nidra3.png', '/nidra4.png'],
    'sadvritta-ethical-living': ['/sadvritta1.png', '/sadvritta2.png', '/sadvritta3.png', '/sadvritta4.png'],
    'lal-bahadur-shastri': ['/lal1.png', '/lal2.png', '/lal3.png', '/lal4.png'],
    'ratan-tata': ['/tata1.png', '/tata2.png', '/tata3.png', '/tata4.png'],
    'sundar-pichai': ['/sundar1.png', '/sundar2.png', '/sundar3.png', '/sundar4.png'],
    'chhatrapati-shivaji-maharaj': ['/pati1.png', '/pati2.png', '/pati3.png', '/pati4.png'],
    'milkha-singh': ['/singh1.png', '/singh2.png', '/singh3.png', '/singh4.png'],
    'swami-vivekananda': ['/swami1.png', '/swami2.png', '/swami3.png', '/swami4.png'],
    'dr-b-r-ambedkar': ['/BR1.png', '/BR2.png'],
};

const LibraryDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const item: LibraryItem | undefined = defaultLibraryItems.find(i => i.id === id);
    const curatedImages = item ? curatedImageSets[item.id] : undefined;

    useEffect(() => { window.scrollTo(0, 0); }, [id]);

    if (!item) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0d1410]">
            <div className="text-center space-y-4">
                <h2 className="text-4xl text-[#d4af37] font-bold" style={{ fontFamily: "'Cinzel', serif" }}>Item Not Found</h2>
                <button onClick={() => navigate(-1)} className="px-8 py-3 border border-[#d4af37] text-[#d4af37] rounded-full hover:bg-[#d4af37] hover:text-black transition-all">Back to Library</button>
            </div>
        </div>
    );

    const storyLines = item.story.split('\n').filter(l => l.trim());

    return (
        <div className="min-h-screen bg-[#0a0f0c] text-[#e8e6df] overflow-x-hidden selection:bg-[#d4af37]/30 selection:text-[#d4af37]">

            {/* Fixed ambient background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-[radial-gradient(circle,rgba(212,175,55,0.12)_0%,transparent_55%)] opacity-50 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f0c]/80 via-[#0a0f0c]/90 to-[#0a0f0c] z-0" />
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] bg-[#d4af37]/5 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
                {/* Floating gold particles */}
                {[...Array(10)].map((_, i) => (
                    <motion.div key={i}
                        className="absolute w-px h-px rounded-full bg-[#d4af37]"
                        style={{ left: `${10 + i * 9}%`, top: `${20 + (i % 4) * 20}%`, boxShadow: '0 0 6px 2px rgba(212,175,55,0.3)' }}
                        animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
                        transition={{ duration: 5 + i * 0.6, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
                    />
                ))}
            </div>

            {/* Sticky Nav */}
            <nav className="sticky top-0 z-50 px-6 md:px-12 py-5 flex items-center justify-between backdrop-blur-xl bg-[#0a0f0c]/80 border-b border-[#d4af37]/10">
                <motion.button
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 text-[#d4af37] hover:text-white transition-colors group"
                >
                    <div className="w-9 h-9 rounded-full border border-[#d4af37]/40 flex items-center justify-center group-hover:bg-[#d4af37] group-hover:border-[#d4af37] group-hover:text-black transition-all">
                        <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.3em] hidden md:block" style={{ fontFamily: "'Cinzel', serif" }}>Back to Library</span>
                </motion.button>
                <div className="flex items-center gap-2">
                    <Flame size={12} className="text-[#d4af37]/60" />
                    <span className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37]/50 font-bold hidden md:block" style={{ fontFamily: "'Cinzel', serif" }}>Wisdom Treasury</span>
                </div>
            </nav>

            {/* Typography-focused Hero (No Image) */}
            <header className="relative w-full min-h-[70vh] flex flex-col items-center justify-center text-center overflow-hidden px-6 pt-24 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22,1,0.36,1] }}
                    className="relative z-10 flex flex-col items-center max-w-4xl mx-auto"
                >
                    {/* Category badge */}
                    <motion.span initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/8 text-[10px] font-bold uppercase tracking-[0.5em] text-[#d4af37] mb-8"
                    >
                        <Sparkles size={10} /> {item.category} · {item.duration}
                    </motion.span>

                    {/* Title */}
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}
                        className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight mb-8"
                        style={{ fontFamily: "'Cinzel', serif", textShadow: '0 4px 24px rgba(212,175,55,0.2)' }}
                    >
                        {item.title}
                    </motion.h1>

                    {/* Gold divider */}
                    <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, delay: 0.4 }}
                        className="w-40 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37]/70 to-transparent mb-8"
                    />

                    {/* Subtitle */}
                    <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-lg md:text-xl text-[#a0a89e] leading-relaxed italic mb-10 max-w-2xl mx-auto"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Ancient wisdom meets modern understanding
                    </motion.p>

                    {/* Story first line preview */}
                    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.65 }}
                        className="text-lg text-[#c8b97a]/80 italic max-w-xl mx-auto"
                        style={{ fontFamily: "'Georgia', serif" }}
                    >
                        "{item.story.split('\n')[0].trim()}"
                    </motion.p>
                </motion.div>

                {/* Background glow centered behind text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)]" />
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 pb-32 -mt-10">

                {/* Ancient Verse / Story lines */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative mb-20 p-10 md:p-14 rounded-[2.5rem] border border-[#d4af37]/20 overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #1a1e1a 0%, #0f1610 100%)' }}
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#d4af37] via-[#d4af37]/40 to-transparent rounded-full" />
                    <div className="absolute -top-8 -right-8 w-32 h-32 text-[#d4af37]/5"><Sun size={128} /></div>
                    <p className="text-[9px] uppercase tracking-[0.5em] text-[#d4af37]/40 font-bold mb-8 pl-2" style={{ fontFamily: "'Cinzel', serif" }}>Ancient Verses</p>
                    <div className="space-y-4 pl-2">
                        {storyLines.map((line, i) => (
                            <motion.p key={i}
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                                className="text-xl md:text-2xl text-[#c8b97a] italic leading-relaxed font-light"
                                style={{ fontFamily: "'Georgia', serif" }}
                            >
                                {line}
                            </motion.p>
                        ))}
                    </div>
                </motion.div>

                {/* The Essence / Detailed Description */}
                <motion.section initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center">
                            <BookOpen size={14} className="text-[#d4af37]" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#d4af37] tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>The Essence</h2>
                    </div>
                    <p className="text-lg md:text-xl text-[#b0b8b3] leading-[1.9] font-light" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {item.description}
                    </p>
                </motion.section>

                {curatedImages?.length ? (
                    <motion.section initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-12">
                        <div className="mx-auto max-w-3xl grid gap-4 lg:grid-cols-2">
                            <div className="overflow-hidden rounded-[1.5rem] border border-[#d4af37]/10 bg-[#111713] h-[260px] sm:h-[300px]">
                                <img
                                    src={curatedImages[0]}
                                    alt={`${item.title} visual reference`}
                                    className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <div className="grid gap-4">
                                <div className="overflow-hidden rounded-[1.5rem] border border-[#d4af37]/10 bg-[#111713] h-[124px] sm:h-[150px]">
                                    <img
                                        src={curatedImages[1]}
                                        alt={`${item.title} detail image`}
                                        className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                                {curatedImages[2] && (
                                    <div className="overflow-hidden rounded-[1.5rem] border border-[#d4af37]/10 bg-[#111713] h-[124px] sm:h-[150px]">
                                        <img
                                            src={curatedImages[2]}
                                            alt={`${item.title} complementary image`}
                                            className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="mt-5 text-sm text-[#9ea694] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Curated visual reflections that deepen the narrative of {item.title}.
                        </p>
                    </motion.section>
                ) : null}

                {/* Impact Presentation */}
                <motion.section initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-16">
                    <div className="space-y-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center">
                                <CheckCircle size={18} className="text-[#d4af37]" />
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.5em] text-[#d4af37]/40 font-bold" style={{ fontFamily: "'Cinzel', serif" }}>Impact</p>
                                <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Cinzel', serif" }}>Impact in Focus</h2>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            {item.impact.map((impact, i) => (
                                <div key={i} className="rounded-3xl border border-[#d4af37]/10 bg-[#111713] p-6 text-[#c8c4b4] transition hover:border-[#d4af37]/25 hover:bg-[#141c16]">
                                    <p className="text-sm leading-relaxed font-light" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                        {impact}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Ancient Wisdom + Modern Interpretation */}
                <motion.section initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 rounded-3xl border border-[#d4af37]/15 bg-gradient-to-br from-[#161d17] to-[#0d1410] relative overflow-hidden group hover:border-[#d4af37]/30 transition-all">
                            <div className="absolute top-4 right-4 opacity-5 text-[#d4af37]"><Flame size={64} /></div>
                            <p className="text-[9px] uppercase tracking-[0.4em] text-[#d4af37]/50 font-bold mb-4" style={{ fontFamily: "'Cinzel', serif" }}>Ancient Wisdom</p>
                            <h3 className="text-lg font-bold text-[#c8b97a] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>Timeless Teaching</h3>
                            <p className="text-[#8a9490] leading-relaxed font-light text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                {storyLines[0]} The ancient sages encoded this wisdom across generations to guide the seeker toward liberation and inner peace.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl border border-emerald-800/30 bg-gradient-to-br from-[#0e1a12] to-[#0a0f0c] relative overflow-hidden group hover:border-emerald-700/40 transition-all">
                            <div className="absolute top-4 right-4 opacity-5 text-emerald-400"><Star size={64} /></div>
                            <p className="text-[9px] uppercase tracking-[0.4em] text-emerald-500/50 font-bold mb-4" style={{ fontFamily: "'Cinzel', serif" }}>Modern Application</p>
                            <h3 className="text-lg font-bold text-emerald-400/80 mb-4" style={{ fontFamily: "'Cinzel', serif" }}>Today's Relevance</h3>
                            <p className="text-[#8a9490] leading-relaxed font-light text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                {item.whyTheyMatter}
                            </p>
                        </div>
                    </div>
                </motion.section>

                {curatedImages?.length >= 4 ? (
                    <motion.section initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-12">
                        <div className="mx-auto max-w-3xl grid gap-4 md:grid-cols-2">
                            {curatedImages.slice(2, 4).map((src, i) => (
                                <div key={i} className="overflow-hidden rounded-[1.5rem] border border-[#d4af37]/10 bg-[#111713] h-[180px] sm:h-[200px]">
                                    <img
                                        src={src}
                                        alt={`${item.title} thematic image ${i + 3}`}
                                        className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="mt-5 text-sm text-[#9ea694] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            A second set of curated imagery bridges the wisdom of tradition and the practical power of awareness.
                        </p>
                    </motion.section>
                ) : null}

                {/* Quotes of Wisdom */}
                <motion.section initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <Quote size={18} className="text-[#d4af37]" />
                        <h2 className="text-2xl font-bold text-[#d4af37] tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Words of Wisdom</h2>
                    </div>
                    <div className="space-y-5">
                        {item.quotes.map((quote, i) => (
                            <motion.figure key={i}
                                initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="group flex gap-6 items-start p-7 rounded-2xl border border-[#d4af37]/10 bg-[#111713] hover:border-[#d4af37]/25 hover:bg-[#141c16] transition-all"
                            >
                                <span className="text-4xl text-[#d4af37]/20 font-serif leading-none mt-1 shrink-0 group-hover:text-[#d4af37]/40 transition-colors">"</span>
                                <blockquote className="text-lg md:text-xl text-[#c8c4b4] font-light italic leading-relaxed" style={{ fontFamily: "'Georgia', serif" }}>
                                    {quote}
                                </blockquote>
                            </motion.figure>
                        ))}
                    </div>
                </motion.section>

                {/* Reflection / Emotional highlight */}
                <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.9 }}
                    className="relative mb-20 p-12 md:p-16 rounded-[3rem] text-center overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #1c1600 0%, #1a1200 40%, #0e1a0e 100%)' }}
                >
                    <div className="absolute inset-0 border border-[#d4af37]/10 rounded-[3rem] pointer-events-none" />
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-40 bg-[#d4af37]/8 blur-[60px] rounded-full" />
                    {/* Gold stars */}
                    {[...Array(5)].map((_, i) => (
                        <motion.div key={i} className="absolute"
                            style={{ left: `${15 + i * 18}%`, top: `${12 + (i % 2) * 60}%` }}
                            animate={{ opacity: [0.1, 0.4, 0.1], scale: [0.8, 1.2, 0.8] }}
                            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.6 }}
                        >
                            <Star size={i === 2 ? 16 : 10} className="text-[#d4af37]/30 fill-[#d4af37]/20" />
                        </motion.div>
                    ))}
                    <div className="relative z-10 space-y-5">
                        <p className="text-[9px] uppercase tracking-[0.5em] text-[#d4af37]/40 font-bold" style={{ fontFamily: "'Cinzel', serif" }}>Reflection</p>
                        <Quote size={28} className="text-[#d4af37]/20 mx-auto" />
                        <p className="text-2xl md:text-3xl text-[#c8b97a] italic font-light leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: "'Georgia', serif" }}>
                            {item.quotes[0]}
                        </p>
                        <div className="w-16 h-[1px] bg-[#d4af37]/30 mx-auto" />
                        <p className="text-[#6a7a72] text-sm uppercase tracking-widest font-medium">Ancient Teaching · Nirvaha Library</p>
                    </div>
                </motion.div>

                {/* Back CTA */}
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="group inline-flex items-center gap-3 px-10 py-5 border border-[#d4af37]/40 text-[#d4af37] rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(212,175,55,0.1)]"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Library
                    </button>
                </motion.div>
            </main>
        </div>
    );
};

export default LibraryDetailPage;
