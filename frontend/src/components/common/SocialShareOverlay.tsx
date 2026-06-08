import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Linkedin, X } from 'lucide-react';

interface SocialShareOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    shareUrl?: string; // Optional URL to share instead of file
    title?: string;
    description?: string;
}

export const SocialShareOverlay: React.FC<SocialShareOverlayProps> = ({ 
    isOpen, 
    onClose,
    shareUrl = "https://nirvaha.com",
    title = "Mention us on our socials",
    description = "Share your card and mention @Nirvaha so we can celebrate your journey with you!"
}) => {

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Nirvaha Card',
                    text: 'Check out my personalized card from Nirvaha!',
                    url: shareUrl,
                });
            } catch (error) {
                console.error('Error sharing natively:', error);
            }
        } else {
            alert('Your browser does not support native sharing. Please use the social buttons below.');
        }
    };

    const handleWhatsapp = () => {
        const text = encodeURIComponent("Check out my card from Nirvaha! " + shareUrl);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const handleLinkedin = () => {
        const url = encodeURIComponent(shareUrl);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    };

    const handleInstagram = () => {
        // Instagram doesn't have a direct web share intent for stories without a native app deep link
        // So we redirect to their profile page and assume the user will upload the saved image
        window.open(`https://instagram.com`, '_blank');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-3xl p-8 max-w-sm w-full shadow-[0_0_40px_rgba(212,175,55,0.15)] text-center overflow-hidden"
                    >
                        {/* decorative background glow */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#D4AF37]/20 blur-[50px] rounded-full pointer-events-none" />

                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors bg-gray-900/50 rounded-full"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                <polyline points="16 6 12 2 8 6"></polyline>
                                <line x1="12" y1="2" x2="12" y2="15"></line>
                            </svg>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">{title}</h3>
                        <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                            {description}
                        </p>

                        {/* Social Buttons */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <button 
                                onClick={handleWhatsapp}
                                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-[#25D366]/10 hover:border-[#25D366]/30 hover:text-[#25D366] transition-all group"
                            >
                                <svg className="w-6 h-6 fill-current text-gray-400 group-hover:text-[#25D366] transition-colors" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                                <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-300">WhatsApp</span>
                            </button>

                            <button 
                                onClick={handleInstagram}
                                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-[#E1306C]/10 hover:border-[#E1306C]/30 hover:text-[#E1306C] transition-all group"
                            >
                                <Instagram className="w-6 h-6 text-gray-400 group-hover:text-[#E1306C] transition-colors" />
                                <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-300">Story</span>
                            </button>

                            <button 
                                onClick={handleLinkedin}
                                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-[#0077B5]/10 hover:border-[#0077B5]/30 hover:text-[#0077B5] transition-all group"
                            >
                                <Linkedin className="w-6 h-6 text-gray-400 group-hover:text-[#0077B5] transition-colors" />
                                <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-300">LinkedIn</span>
                            </button>
                        </div>

                        {/* Native Share fallback */}
                        {navigator.share && (
                            <button 
                                onClick={handleNativeShare}
                                className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors"
                            >
                                Open Native Share Menu
                            </button>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
