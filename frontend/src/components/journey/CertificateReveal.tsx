import React from 'react';
import { motion } from 'framer-motion';
import { Pathway } from '../../data/pathwaysData';
import { 
    Award, 
    Download, 
    Share2, 
    X,
    CheckCircle2,
    Sparkles
} from 'lucide-react';

interface CertificateRevealProps {
    pathway: Pathway;
    onClose: () => void;
}

const CertificateReveal: React.FC<CertificateRevealProps> = ({ pathway, onClose }) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
        >
            {/* Dark Cinematic Backdrop */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" />

            {/* Glowing atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[180px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-4xl text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="mb-12"
                >
                    <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-8 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                        <Award size={48} />
                    </div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-4xl md:text-6xl font-serif text-white mb-4"
                    >
                        Pathway Complete
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-amber-500/60 uppercase tracking-[0.5em] text-xs font-bold"
                    >
                        Inner Clarity Achieved
                    </motion.p>
                </motion.div>

                {/* The Certificate Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="relative bg-gradient-to-br from-white/10 to-white/5 border border-amber-500/30 p-1 md:p-2 rounded-[2rem] shadow-2xl overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10 pointer-events-none" />
                    
                    <div className="bg-[#0c0d0c] p-12 md:p-20 rounded-[1.8rem] border border-amber-500/10 relative overflow-hidden">
                        {/* Certificate Flourishes */}
                        <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-amber-500/20 m-8 rounded-tl-3xl" />
                        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-amber-500/20 m-8 rounded-br-3xl" />
                        
                        <div className="relative z-10 space-y-10">
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-amber-500/40 text-[10px] uppercase tracking-[0.6em] font-bold">Official Certification</span>
                                <div className="w-16 h-[1px] bg-amber-500/20" />
                            </div>

                            <div className="space-y-4">
                                <p className="text-white/40 font-serif italic text-xl">This certifies that</p>
                                <h2 className="text-4xl md:text-5xl font-serif text-amber-500">Priya Sharma</h2>
                                <p className="text-white/40 font-serif italic text-xl">has successfully transcended through the</p>
                                <h3 className="text-2xl md:text-3xl font-serif text-white tracking-wide">{pathway.title}</h3>
                            </div>

                            <div className="pt-12 flex justify-between items-end">
                                <div className="text-left space-y-2">
                                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Authorized by</p>
                                    <p className="font-serif text-xl text-white/80 border-b border-white/10 pb-1">Dr. Alara Chen</p>
                                    <p className="text-[8px] uppercase tracking-widest text-emerald-500/50">Director of Wellness</p>
                                </div>
                                <div className="w-24 h-24 opacity-20 grayscale brightness-200">
                                    <img src="/logo.png" alt="Nirvaha" className="w-full h-full object-contain" />
                                </div>
                                <div className="text-right space-y-2">
                                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Date of Completion</p>
                                    <p className="font-serif text-xl text-white/80">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    <p className="text-[8px] uppercase tracking-widest text-amber-500/50">ID: NV-99283-CLS</p>
                                </div>
                            </div>
                        </div>

                        {/* Animated Sparkles */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ 
                                        opacity: [0, 1, 0],
                                        scale: [0.5, 1, 0.5]
                                    }}
                                    transition={{ duration: 3 + i, repeat: Infinity, delay: i }}
                                    className="absolute"
                                    style={{ 
                                        top: `${Math.random() * 100}%`, 
                                        left: `${Math.random() * 100}%` 
                                    }}
                                >
                                    <Sparkles className="text-amber-500/40" size={16} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3 }}
                    className="mt-12 flex items-center justify-center gap-6"
                >
                    <button className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform">
                        <Download size={20} /> Download PDF
                    </button>
                    <button className="flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-all">
                        <Share2 size={20} /> Share Achievement
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default CertificateReveal;
