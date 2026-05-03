import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const AboutSection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="relative py-24 bg-white overflow-hidden" id="about">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[#f0f9f4] skew-x-12 translate-x-1/4 pointer-events-none" />
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Visual Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full lg:w-1/2"
                    >
                        <div className="relative">
                            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000" 
                                    alt="About Nirvaha" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Floating Card */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="absolute -bottom-10 -right-10 bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-emerald-50 max-w-xs hidden md:block"
                            >
                                <div className="flex items-center gap-3 mb-4 text-[#1a5d47]">
                                    <Sparkles className="w-6 h-6" />
                                    <span className="font-bold tracking-wider text-sm uppercase">Our Purpose</span>
                                </div>
                                <p className="text-[#595e67] italic font-light leading-relaxed">
                                    "Healing is not just about the absence of pain, but the presence of peace and purpose."
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Text Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full lg:w-1/2"
                    >
                        <span className="text-[#1a5d47] font-bold tracking-[0.3em] uppercase text-sm mb-6 block">Our Journey</span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-[#0F131A] mb-8 leading-tight" style={{ fontFamily: "'Cinzel', serif" }}>
                            The Bridge Between <br/>
                            <span className="text-emerald-700">Tradition & Tech</span>
                        </h2>
                        <p className="text-lg text-[#595e67] mb-8 leading-relaxed font-light">
                            Nirvaha was born from a simple realization: the wisdom of the ancients holds the key to the stresses of the modern world. We've combined millennium-old spiritual practices with cutting-edge AI to create a sanctuary for your mind.
                        </p>
                        <p className="text-lg text-[#595e67] mb-12 leading-relaxed font-light">
                            Every soul has a story. Every journey is unique. Discover how Nirvaha has transformed lives through the voices of our community.
                        </p>

                        <motion.button
                            whileHover={{ 
                                scale: 1.05, 
                                boxShadow: "0 0 30px 5px rgba(26, 93, 71, 0.4)",
                                backgroundColor: "#1d6b52"
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/stories')}
                            className="group relative px-10 py-5 bg-[#1a5d47] text-white rounded-full overflow-hidden shadow-xl transition-all duration-300 flex items-center gap-4 border border-emerald-400/20"
                        >
                            <span className="text-lg font-bold tracking-wide relative z-10">Read Our Stories</span>
                            <ArrowRight className="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:translate-x-2" />
                            
                            {/* Animated Background Glow */}
                            <motion.div 
                                className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-white/10 to-emerald-500/0"
                                animate={{
                                    x: ['-100%', '100%'],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2,
                                    ease: "linear",
                                }}
                            />
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
