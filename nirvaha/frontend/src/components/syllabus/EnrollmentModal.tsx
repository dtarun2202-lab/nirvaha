import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ArrowRight, ShieldCheck, Clock, Star } from 'lucide-react';
import { Pathway } from '../../data/pathwaysData';
import { enrollPathway } from '../../lib/userApi';
import { useAuth } from '../../contexts/AuthContext';

interface EnrollmentModalProps {
    pathway: Pathway;
    onClose: () => void;
    onSuccess: () => void;
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ pathway, onClose, onSuccess }) => {
    const { user, refreshProfile } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [intention, setIntention] = useState('');

    const handleEnroll = async () => {
        if (!user) {
            window.location.href = '/login';
            return;
        }

        setIsSubmitting(true);
        try {
            await enrollPathway(user.id, pathway.id);
            await refreshProfile();
            setIsSuccess(true);
            setTimeout(() => {
                onSuccess();
            }, 3000);
        } catch (error) {
            console.error("Enrollment failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-md"
        >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-4xl bg-[#0a0c0a] border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors z-20"
                >
                    <X size={24} />
                </button>

                {/* Left Side: Visual */}
                <div className="relative w-full md:w-2/5 h-48 md:h-auto overflow-hidden">
                    <img 
                        src={pathway.image} 
                        alt={pathway.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c0a] via-[#0a0c0a]/40 to-transparent" />
                    
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <div className="bg-emerald-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-4 shadow-xl">
                            Premium Access
                        </div>
                        <h2 className="text-3xl font-serif text-white">{pathway.title}</h2>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="flex-1 p-8 md:p-12 space-y-8 overflow-y-auto max-h-[80vh]">
                    {!isSuccess ? (
                        <>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white/90">Enrollment Form</h3>
                                <p className="text-white/40 text-sm">Please confirm your commitment to this journey.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Full Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="Your Name"
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-emerald-500/50 focus:outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Email Address</label>
                                    <input 
                                        type="email" 
                                        placeholder="your@email.com"
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-emerald-500/50 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Your Primary Intention</label>
                                <textarea 
                                    placeholder="What do you hope to achieve through this pathway?"
                                    value={intention}
                                    onChange={(e) => setIntention(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:border-emerald-500/50 focus:outline-none transition-colors h-32 resize-none"
                                />
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="flex items-center gap-3 text-white/40 text-xs">
                                    <ShieldCheck size={16} className="text-emerald-500" />
                                    <span>Lifetime access to all modules and alumni community</span>
                                </div>
                                <button 
                                    onClick={handleEnroll}
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-white text-black rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 shadow-xl"
                                >
                                    {isSubmitting ? "Processing..." : (
                                        <>Complete Enrollment <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                            <motion.div 
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", damping: 12 }}
                                className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center text-black shadow-[0_0_50px_rgba(16,185,129,0.3)]"
                            >
                                <CheckCircle size={48} />
                            </motion.div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-serif text-white tracking-tight">Enrolled Successfully</h3>
                                <p className="text-white/40 text-sm italic max-w-xs mx-auto">
                                    “The journey of a thousand miles begins with a single step.”
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default EnrollmentModal;
