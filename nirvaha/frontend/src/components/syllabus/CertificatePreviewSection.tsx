import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pathway } from '../../data/pathwaysData';
import { Award, ShieldCheck, Download, Star, Trophy, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import html2canvas from 'html2canvas';

interface CertificatePreviewSectionProps {
    pathway: Pathway;
}

const CertificatePreviewSection: React.FC<CertificatePreviewSectionProps> = ({ pathway }) => {
    const { user } = useAuth();
    const certRef = useRef<HTMLDivElement>(null);
    const [showModal, setShowModal] = useState(false);
    const [downloading, setDownloading] = useState(false);

    // Determine if user has completed this pathway
    const progressData = user?.pathwayProgress?.[pathway.id];
    const completedLessons = progressData?.completedLessons?.length ?? 0;
    const totalLessons = pathway.timeline.length;
    const isCompleted = user && completedLessons >= totalLessons && totalLessons > 0;

    const completionDate = progressData?.lastAccessedAt
        ? new Date(progressData.lastAccessedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const serialNumber = `NV-${(user?.id || 'XXXXX').slice(-5).toUpperCase()}-${pathway.id.slice(0, 3).toUpperCase()}`;

    const handleDownload = async () => {
        if (!certRef.current) return;
        setDownloading(true);
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
        setDownloading(false);
    };

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

                    <div className="pt-4 space-y-4">
                        <div className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/5 max-w-sm">
                            <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500">
                                <Award size={24} />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest text-white/30 font-bold">Credential Status</p>
                                <p className="text-white/90 font-bold italic">ISO 21001 Certified</p>
                            </div>
                        </div>

                        {/* Download button — only shown when completed */}
                        {isCompleted && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-2"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <Trophy size={14} className="text-amber-400" />
                                    <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Pathway Complete!</span>
                                </div>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="flex items-center gap-3 px-8 py-4 bg-amber-500 text-black rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(251,191,36,0.2)] uppercase tracking-widest"
                                >
                                    <Download size={18} /> Download Your Certificate
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* The Certificate Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative group"
                >
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
                                    <h2 className="text-3xl font-serif text-amber-500/80">{isCompleted ? user?.name : 'Your Full Name'}</h2>
                                    <p className="text-white/20 font-serif italic text-sm">in the sacred discipline of</p>
                                    <h3 className="text-xl font-serif text-white/60 tracking-wide">{pathway.title}</h3>
                                </div>

                                <div className="pt-8 flex justify-between items-end opacity-40">
                                    <div className="text-left space-y-1">
                                        <p className="text-[6px] uppercase tracking-widest text-white/30 font-bold">Instructor</p>
                                        <p className="font-serif text-sm text-white/80">{pathway.instructor}</p>
                                    </div>
                                    <div className="w-12 h-12 grayscale brightness-200">
                                        <img src="/logo.png" alt="Nirvaha" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-[6px] uppercase tracking-widest text-white/30 font-bold">Serial Number</p>
                                        <p className="font-serif text-[10px] text-white/80">{serialNumber}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute inset-0 pointer-events-none">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                                        transition={{ duration: 3 + i, repeat: Infinity, delay: i }}
                                        className="absolute"
                                        style={{ top: `${[20, 60, 80][i]}%`, left: `${[80, 10, 50][i]}%` }}
                                    >
                                        <Star className="text-amber-500/20" size={12} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

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

            {/* Certificate Download Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="relative w-full max-w-3xl"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute -top-4 -right-4 z-10 w-10 h-10 bg-white/10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                            >
                                <X size={16} />
                            </button>

                            <p className="text-center text-white/40 text-xs uppercase tracking-[0.4em] mb-6">Preview & Download</p>

                            {/* Printable Certificate */}
                            <div
                                ref={certRef}
                                style={{ fontFamily: "'Georgia', serif", backgroundColor: '#0a0c0a' }}
                                className="rounded-[2rem] overflow-hidden border border-amber-500/30 shadow-2xl"
                            >
                                <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-amber-500/80 to-transparent" />
                                <div className="p-12 md:p-16 relative">
                                    {/* Corner ornaments */}
                                    <div className="absolute top-6 left-6 w-20 h-20 border-l-2 border-t-2 border-amber-500/20 rounded-tl-2xl" />
                                    <div className="absolute top-6 right-6 w-20 h-20 border-r-2 border-t-2 border-amber-500/20 rounded-tr-2xl" />
                                    <div className="absolute bottom-6 left-6 w-20 h-20 border-l-2 border-b-2 border-amber-500/20 rounded-bl-2xl" />
                                    <div className="absolute bottom-6 right-6 w-20 h-20 border-r-2 border-b-2 border-amber-500/20 rounded-br-2xl" />

                                    <div className="relative z-10 space-y-8 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-14 h-14 opacity-70">
                                                <img src="/logo.png" alt="Nirvaha" className="w-full h-full object-contain" />
                                            </div>
                                            <p className="text-amber-500/50 text-[9px] uppercase tracking-[0.6em] font-bold">Nirvaha Academy</p>
                                            <div className="w-16 h-[1px] bg-amber-500/20" />
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-white/25 text-sm italic">Certificate of Completion</p>
                                            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent mx-auto" />
                                        </div>

                                        <div className="space-y-2 py-4">
                                            <p className="text-white/30 text-xs uppercase tracking-[0.4em]">This is to proudly certify that</p>
                                            <h2 className="text-4xl md:text-5xl text-amber-400/90 italic tracking-wide">{user?.name || 'Valued Seeker'}</h2>
                                            <p className="text-white/25 text-xs uppercase tracking-[0.3em]">has successfully completed the sacred discipline of</p>
                                        </div>

                                        <div className="py-4 px-8 border border-amber-500/10 rounded-2xl bg-amber-500/5 mx-auto max-w-md">
                                            <h3 className="text-2xl md:text-3xl text-white/80 tracking-wide">{pathway.title}</h3>
                                            <p className="text-white/20 text-xs mt-2 uppercase tracking-[0.3em]">{pathway.duration} · {pathway.level}</p>
                                        </div>

                                        <div className="flex justify-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className="text-amber-500/40 fill-amber-500/40" />
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
                                            <div className="text-left space-y-1">
                                                <p className="text-[8px] uppercase tracking-widest text-white/20 font-bold">Lead Instructor</p>
                                                <p className="text-sm text-white/60 italic">{pathway.instructor}</p>
                                                <div className="w-full h-[1px] bg-white/10 mt-2" />
                                            </div>
                                            <div className="text-center flex flex-col items-center">
                                                <div className="w-14 h-14 rounded-full border-2 border-amber-500/20 flex items-center justify-center">
                                                    <div className="w-10 h-10 rounded-full border border-amber-500/15 flex items-center justify-center text-[7px] uppercase tracking-[0.1em] font-bold text-amber-500/40 text-center leading-tight">
                                                        Official<br />Seal
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <p className="text-[8px] uppercase tracking-widest text-white/20 font-bold">Date of Completion</p>
                                                <p className="text-sm text-white/60 italic">{completionDate}</p>
                                                <div className="w-full h-[1px] bg-white/10 mt-2" />
                                            </div>
                                        </div>

                                        <p className="text-[9px] text-white/10 uppercase tracking-[0.4em] font-mono pt-2">{serialNumber}</p>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-amber-500/80 to-transparent" />
                            </div>

                            {/* Download Action */}
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={handleDownload}
                                    disabled={downloading}
                                    className="flex items-center gap-3 px-10 py-4 bg-amber-500 text-black rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(251,191,36,0.2)] uppercase tracking-widest disabled:opacity-50 disabled:scale-100"
                                >
                                    <Download size={18} />
                                    {downloading ? 'Generating...' : 'Download as PNG'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default CertificatePreviewSection;
