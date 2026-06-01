import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Pathway } from '../../data/pathwaysData';
import { Trophy, Download as DownloadIcon, CheckCircle2, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import html2canvas from 'html2canvas';

interface CertificateRevealProps {
    pathway: Pathway;
    onClose: () => void;
}

const CertificateReveal: React.FC<CertificateRevealProps> = ({ pathway, onClose }) => {
    const { user } = useAuth();
    const certRef = useRef<HTMLDivElement>(null);
    const completionDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const serialNumber = `NV-${Date.now().toString(36).toUpperCase().slice(-6)}-${pathway.id.slice(0,3).toUpperCase()}`;

    const handleDownload = async () => {
        if (!certRef.current) return;
        try {
            const canvas = await html2canvas(certRef.current, {
                scale: 3,
                backgroundColor: '#0a0c0a',
                useCORS: true,
                logging: false,
            });
            const link = document.createElement('a');
            link.download = `${(user?.name || 'Certificate').replace(/\s+/g, '_')}_${pathway.title.replace(/\s+/g, '_')}_Nirvaha.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error('Certificate download failed:', err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-[#050705] flex flex-col items-center justify-center p-6 overflow-y-auto"
        >
            {/* Golden Atmosphere */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-amber-900/10 rounded-full blur-[150px]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
            </div>

            <div className="relative z-10 w-full max-w-4xl text-center">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                    className="mb-12"
                >
                    <motion.div
                        animate={{ boxShadow: ["0 0 20px rgba(251,191,36,0)", "0 0 60px rgba(251,191,36,0.3)", "0 0 20px rgba(251,191,36,0)"] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="inline-block p-6 rounded-full bg-amber-500/10 text-amber-400 mb-8"
                    >
                        <Trophy size={48} className="drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, letterSpacing: "0.1em" }}
                        animate={{ opacity: 1, letterSpacing: "0.2em" }}
                        transition={{ duration: 2, delay: 0.8 }}
                        className="text-4xl md:text-6xl font-serif text-white/90 mb-4 italic tracking-wide"
                    >
                        Journey Complete
                    </motion.h1>
                    <p className="text-white/30 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto italic font-serif">
                        "You have walked the path with intention. May this clarity guide your steps forward."
                    </p>
                </motion.div>

                {/* The Downloadable Certificate Card */}
                <motion.div
                    initial={{ opacity: 0, rotateY: 30, scale: 0.9, filter: "blur(10px)" }}
                    animate={{ opacity: 1, rotateY: 0, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 2, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative group perspective-1000 mb-12"
                >
                    <div className="absolute -inset-10 bg-amber-500/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    {/* This div is captured by html2canvas */}
                    <div
                        ref={certRef}
                        className="relative bg-[#0a0c0a] border border-amber-500/30 rounded-[2rem] overflow-hidden"
                        style={{ fontFamily: "'Georgia', serif" }}
                    >
                        {/* Top gold border strip */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-amber-500/80 to-transparent" />

                        <div className="p-12 md:p-16">
                            {/* Corner ornaments */}
                            <div className="absolute top-6 left-6 w-24 h-24 border-l-2 border-t-2 border-amber-500/20 rounded-tl-2xl pointer-events-none" />
                            <div className="absolute top-6 right-6 w-24 h-24 border-r-2 border-t-2 border-amber-500/20 rounded-tr-2xl pointer-events-none" />
                            <div className="absolute bottom-6 left-6 w-24 h-24 border-l-2 border-b-2 border-amber-500/20 rounded-bl-2xl pointer-events-none" />
                            <div className="absolute bottom-6 right-6 w-24 h-24 border-r-2 border-b-2 border-amber-500/20 rounded-br-2xl pointer-events-none" />

                            <div className="relative z-10 space-y-8 text-center">
                                {/* Logo & Issuer */}
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 opacity-70">
                                        <img src="/logo.png" alt="Nirvaha" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <p className="text-amber-500/50 text-[9px] uppercase tracking-[0.6em] font-bold">Nirvaha Academy</p>
                                        <div className="w-20 h-[1px] bg-amber-500/20 mx-auto mt-2" />
                                    </div>
                                </div>

                                {/* Main Title */}
                                <div className="space-y-2">
                                    <p className="text-white/25 text-sm italic tracking-wide">Certificate of Completion</p>
                                    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent mx-auto" />
                                </div>

                                {/* Recipient */}
                                <div className="space-y-2 py-4">
                                    <p className="text-white/30 text-xs uppercase tracking-[0.4em]">This is to proudly certify that</p>
                                    <h2 className="text-4xl md:text-5xl text-amber-400/90 italic tracking-wide" style={{ fontFamily: "'Georgia', serif" }}>
                                        {user?.name || 'Valued Seeker'}
                                    </h2>
                                    <p className="text-white/25 text-xs uppercase tracking-[0.3em]">has successfully completed the sacred discipline of</p>
                                </div>

                                {/* Course Name */}
                                <div className="py-4 px-8 border border-amber-500/10 rounded-2xl bg-amber-500/5 mx-auto max-w-lg">
                                    <h3 className="text-2xl md:text-3xl text-white/80 tracking-wide font-serif">{pathway.title}</h3>
                                    <p className="text-white/20 text-xs mt-2 uppercase tracking-[0.3em]">{pathway.duration} · {pathway.level}</p>
                                </div>

                                {/* Stars */}
                                <div className="flex justify-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className="text-amber-500/40 fill-amber-500/40" />
                                    ))}
                                </div>

                                {/* Footer Row */}
                                <div className="grid grid-cols-3 gap-8 pt-6 border-t border-white/5">
                                    <div className="text-left space-y-1">
                                        <p className="text-[8px] uppercase tracking-widest text-white/20 font-bold">Lead Instructor</p>
                                        <p className="text-sm text-white/60 italic font-serif">{pathway.instructor}</p>
                                        <div className="w-full h-[1px] bg-white/10 mt-2" />
                                    </div>
                                    <div className="text-center space-y-1 flex flex-col items-center">
                                        {/* Official Seal */}
                                        <div className="w-16 h-16 rounded-full border-2 border-amber-500/20 flex items-center justify-center">
                                            <div className="w-12 h-12 rounded-full border border-amber-500/15 flex items-center justify-center text-[7px] uppercase tracking-[0.15em] font-bold text-amber-500/40 text-center leading-tight">
                                                Official<br />Seal
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-[8px] uppercase tracking-widest text-white/20 font-bold">Date of Completion</p>
                                        <p className="text-sm text-white/60 font-serif italic">{completionDate}</p>
                                        <div className="w-full h-[1px] bg-white/10 mt-2" />
                                    </div>
                                </div>

                                {/* Serial */}
                                <p className="text-[9px] text-white/10 uppercase tracking-[0.4em] font-mono pt-2">{serialNumber}</p>
                            </div>
                        </div>

                        {/* Bottom gold border strip */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-amber-500/80 to-transparent" />
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.2 }}
                    className="flex flex-wrap items-center justify-center gap-6"
                >
                    <button
                        onClick={handleDownload}
                        className="px-10 py-4 bg-amber-500 text-black rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(251,191,36,0.15)] flex items-center gap-3 uppercase tracking-widest"
                    >
                        <DownloadIcon size={18} /> Download Certificate
                    </button>
                    <button
                        onClick={onClose}
                        className="px-10 py-4 border border-white/10 text-white/50 rounded-full font-bold text-sm hover:bg-white/5 hover:border-white/20 transition-all active:scale-95 flex items-center gap-3 uppercase tracking-widest"
                    >
                        Return to Pathways <CheckCircle2 size={18} className="opacity-40" />
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default CertificateReveal;
