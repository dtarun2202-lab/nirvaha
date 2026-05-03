import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ListChecks, Lightbulb, Play } from 'lucide-react';
import { journeyData } from '../data/journeyData';
import DecorativeShapes from '../components/landing/DecorativeShapes';

const JourneyPage: React.FC = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();
    
    const data = topicId ? (journeyData as any)[topicId] : null;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8faf9]">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Topic Not Found</h1>
                    <button 
                        onClick={() => navigate('/')}
                        className="text-emerald-600 font-medium hover:underline flex items-center gap-2 justify-center"
                    >
                        <ArrowLeft size={18} /> Back to Library
                    </button>
                </div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <div className="min-h-screen bg-[#f8faf9] relative overflow-hidden pb-24">
            <DecorativeShapes variant={1} />
            
            {/* Navigation Header */}
            <nav className="relative z-20 px-6 py-8 max-w-7xl mx-auto">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-emerald-800 font-medium group transition-all"
                >
                    <div className="p-2 bg-white rounded-full shadow-sm group-hover:bg-emerald-50 transition-colors">
                        <ArrowLeft size={20} />
                    </div>
                    <span>Back to Journey</span>
                </button>
            </nav>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-4xl mx-auto px-6 relative z-10"
            >
                {/* Hero Section */}
                <motion.div variants={itemVariants} className="text-center mb-16">
                    <div className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                        {data.subtitle}
                    </div>
                    <h1 
                        className="text-4xl md:text-7xl font-bold text-[#0F131A] mb-8 leading-tight"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        {data.title}
                    </h1>
                    <div className="w-24 h-2 bg-emerald-500 mx-auto rounded-full mb-12" />
                </motion.div>

                {/* Featured Image */}
                <motion.div 
                    variants={itemVariants}
                    className="relative rounded-[3rem] overflow-hidden shadow-2xl mb-20 aspect-video md:aspect-[21/9]"
                >
                    <img 
                        src={data.image} 
                        alt={data.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </motion.div>

                {/* Main Content Sections */}
                <div className="space-y-20">
                    {/* Extended Content */}
                    <motion.section variants={itemVariants} className="bg-white/50 backdrop-blur-xl p-10 md:p-14 rounded-[2.5rem] border border-white/40 shadow-xl">
                        <h2 className="text-2xl font-bold text-[#0F131A] mb-6 flex items-center gap-3">
                            <Lightbulb className="text-emerald-500" /> The Essence
                        </h2>
                        <p className="text-xl text-[#595e67] leading-relaxed font-light italic">
                            {data.extendedContent}
                        </p>
                    </motion.section>

                    {/* Benefits Grid */}
                    <motion.section variants={itemVariants}>
                        <h2 className="text-2xl font-bold text-[#0F131A] mb-8 flex items-center gap-3">
                            <CheckCircle2 className="text-emerald-500" /> Key Benefits
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.benefits.map((benefit: string, idx: number) => (
                                <div key={idx} className="flex gap-4 p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex-shrink-0 mt-1 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                    </div>
                                    <p className="text-[#4a5568] font-medium">{benefit}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Practice Steps */}
                    <motion.section variants={itemVariants} className="bg-[#1a5d47] text-white p-10 md:p-14 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                        <h2 className="text-2xl font-bold mb-10 flex items-center gap-3 relative z-10 text-emerald-200">
                            <ListChecks size={28} /> Practice Steps
                        </h2>
                        <div className="space-y-8 relative z-10">
                            {data.practiceSteps.map((step: string, idx: number) => (
                                <div key={idx} className="flex gap-6">
                                    <div className="text-4xl font-black text-emerald-400/30 font-sans">{idx + 1}</div>
                                    <p className="text-lg text-emerald-50 leading-relaxed pt-1">{step}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Tips for Daily Life */}
                    <motion.section variants={itemVariants}>
                        <div className="bg-white p-10 md:p-14 rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <h2 className="text-2xl font-bold text-[#0F131A] mb-8 flex items-center gap-3">
                                <Sparkles className="text-emerald-500" /> Daily Life Tips
                            </h2>
                            <ul className="space-y-6">
                                {data.tips.map((tip: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-4">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-3 flex-shrink-0" />
                                        <p className="text-[#595e67] text-lg">{tip}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.section>

                    {/* CTA Section */}
                    <motion.section variants={itemVariants} className="text-center py-12">
                        <button 
                            className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-full font-bold text-xl shadow-xl hover:bg-emerald-700 hover:shadow-emerald-200/50 transition-all transform hover:-translate-y-1 active:scale-95 group"
                        >
                            <Play className="fill-white" /> Start Guided Practice
                        </button>
                    </motion.section>
                </div>
            </motion.div>

            {/* Floating Elements Animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div 
                    animate={{ 
                        y: [0, -20, 0],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute top-[20%] right-[10%] w-64 h-64 bg-emerald-200 rounded-full blur-[120px]"
                />
                <motion.div 
                    animate={{ 
                        y: [0, 20, 0],
                        opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{ duration: 7, repeat: Infinity }}
                    className="absolute bottom-[20%] left-[5%] w-96 h-96 bg-teal-200 rounded-full blur-[150px]"
                />
            </div>
        </div>
    );
};

const Sparkles = ({ className, size = 24 }: { className?: string, size?: number }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
    </svg>
);

export default JourneyPage;
