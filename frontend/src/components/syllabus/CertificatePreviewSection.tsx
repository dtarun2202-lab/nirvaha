import React from 'react';
import { motion } from 'framer-motion';
import { Pathway } from '../../data/pathwaysData';
import { Award, Sparkles, ShieldCheck } from 'lucide-react';

interface CertificatePreviewSectionProps {
    pathway: Pathway;
}

const CertificatePreviewSection: React.FC<CertificatePreviewSectionProps> = ({ pathway }) => {
    return (
        <section className="space-y-16">
            <div className="text-center space-y-4">
                <motion.span 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.5em]"
                >
                    The Recognition
                </motion.span>
                <h2 className="text-4xl md:text-6xl font-serif">Earn Your Accreditation</h2>
                <div className="w-24 h-[1px] bg-white/10 mx-auto mt-8" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-10"
                >
                    <div className="space-y-6">
                        <h3 className="text-3xl font-serif leading-tight">A hallmark of your commitment to inner transformation.</h3>
                        <p className="text-white/40 leading-relaxed text-lg font-light">
                            Upon successful completion of all modules and the final assessment, you will receive a digitally verifiable certification that acknowledges your mastery in {pathway.title}.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[
                            "Globally verifiable digital credentials",
                            "Official endorsement by Nirvaha faculty",
                            "Lifetime access to certificate alumni hub",
                            "Premium physical plaque (Optional)"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                    <ShieldCheck size={14} />
                                </div>
                                <span className="text-white/70 font-medium">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8">
                        <div className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/5 max-w-sm">
                            <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500">
                                <Award size={24} />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest text-white/30 font-bold">Credential Status</p>
                                <p className="text-white/90 font-bold italic">ISO 21001 Certified</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* The Certificate Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative group"
                >
                    {/* Glowing shadows */}
                    <div className="absolute inset-0 bg-amber-500/5 rounded-[2rem] blur-[80px] group-hover:bg-amber-500/10 transition-all duration-700" />
                    
                    <div className="relative bg-gradient-to-br from-white/10 to-white/5 border border-amber-500/30 p-1 md:p-2 rounded-[2rem] shadow-2xl overflow-hidden scale-90 md:scale-100 rotate-2 group-hover:rotate-0 transition-all duration-700">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-5 pointer-events-none" />
                        
                        <div className="bg-[#0c0d0c] p-10 md:p-14 rounded-[1.8rem] border border-amber-500/10 relative overflow-hidden text-center">
                            <div className="space-y-6 relative z-10">
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-amber-500/40 text-[8px] uppercase tracking-[0.6em] font-bold">Certification of Excellence</span>
                                    <div className="w-12 h-[1px] bg-amber-500/20" />
                                </div>

                                <div className="space-y-3">
                                    <p className="text-white/20 font-serif italic text-sm">Recognizing the Mastery of</p>
                                    <h2 className="text-3xl font-serif text-amber-500/80">Your Full Name</h2>
                                    <p className="text-white/20 font-serif italic text-sm">in the sacred discipline of</p>
                                    <h3 className="text-xl font-serif text-white/60 tracking-wide">{pathway.title}</h3>
                                </div>

                                <div className="pt-8 flex justify-between items-end opacity-40">
                                    <div className="text-left space-y-1">
                                        <p className="text-[6px] uppercase tracking-widest text-white/30 font-bold">Instructor</p>
                                        <p className="font-serif text-sm text-white/80">Dr. Alara Chen</p>
                                    </div>
                                    <div className="w-12 h-12 grayscale brightness-200">
                                        <img src="/logo.png" alt="Nirvaha" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-[6px] uppercase tracking-widest text-white/30 font-bold">Serial Number</p>
                                        <p className="font-serif text-[10px] text-white/80">NV-XXXXX-CLS</p>
                                    </div>
                                </div>
                            </div>

                            {/* Animated Sparkles */}
                            <div className="absolute inset-0 pointer-events-none">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                                        transition={{ duration: 3 + i, repeat: Infinity, delay: i }}
                                        className="absolute"
                                        style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                                    >
                                        <Sparkles className="text-amber-500/20" size={12} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Badge */}
                    <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 backdrop-blur-xl border border-amber-500/20 rounded-full flex flex-col items-center justify-center p-4 text-center shadow-2xl z-20"
                    >
                        <Award className="text-amber-500 mb-1" size={24} />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/80">Elite Credential</span>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default CertificatePreviewSection;
