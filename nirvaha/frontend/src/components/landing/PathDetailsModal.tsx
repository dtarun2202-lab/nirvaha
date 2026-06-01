import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface PathDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: {
        subtitle: string;
        description: string;
        benefits: string[];
        features: string[];
        cta: string;
    };
}

const PathDetailsModal: React.FC<PathDetailsModalProps> = ({ isOpen, onClose, title, content }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative"
                    >
                        {/* Header Image/Pattern */}
                        <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600 relative overflow-hidden flex-shrink-0">
                            <div className="absolute inset-0 opacity-20">
                                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                                </svg>
                            </div>
                            <div className="absolute top-6 right-6 z-10">
                                <button 
                                    onClick={onClose}
                                    className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="absolute bottom-4 left-8">
                                <h2 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "'Cinzel', serif" }}>
                                    {title}
                                </h2>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-8 sm:p-10 scrollbar-thin scrollbar-thumb-emerald-100">
                            <div className="max-w-2xl mx-auto">
                                <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-4 uppercase tracking-widest text-sm">
                                    <Sparkles className="w-4 h-4" />
                                    {content.subtitle}
                                </div>
                                
                                <p className="text-xl text-gray-700 leading-relaxed mb-10 font-light">
                                    {content.description}
                                </p>

                                <div className="grid sm:grid-cols-2 gap-10">
                                    {/* Features */}
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Core Focus</h4>
                                        <ul className="space-y-4">
                                            {content.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-3 group">
                                                    <div className="mt-1 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                                                        <ArrowRight className="w-3 h-3 text-emerald-600" />
                                                    </div>
                                                    <span className="text-gray-600 font-medium">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Benefits */}
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Key Outcomes</h4>
                                        <ul className="space-y-4">
                                            {content.benefits.map((benefit, idx) => (
                                                <li key={idx} className="flex items-start gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                                    <span className="text-gray-600">{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer / CTA */}
                        <div className="p-8 border-t border-gray-50 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <p className="text-gray-500 text-sm font-medium italic">
                                Built for impact. Refined by wisdom.
                            </p>
                            <button
                                onClick={() => {
                                    onClose();
                                    // Pre-fill contact form
                                    const event = new CustomEvent('prefillContact', {
                                        detail: {
                                            message: `integrating Nirvaha into our ${title.toLowerCase()} program. We're specifically interested in ${content.features[0].toLowerCase()} and ${content.features[1].toLowerCase()}.`,
                                            step: 2 // Skip to company/message step? Or just keep it as is.
                                        }
                                    });
                                    window.dispatchEvent(event);

                                    // Scroll to contact form
                                    const contactSection = document.getElementById('contact');
                                    if (contactSection) {
                                        contactSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                                className="px-10 py-4 bg-emerald-900 text-white rounded-full font-bold shadow-xl hover:bg-emerald-800 transition-all flex items-center gap-3 group"
                            >
                                {content.cta}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PathDetailsModal;
