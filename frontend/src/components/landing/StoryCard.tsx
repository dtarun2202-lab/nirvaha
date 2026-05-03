import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface StoryCardProps {
    title: string;
    description: string;
    image?: string;
    onClick?: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ title, description, image, onClick }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ 
                scale: 1.03, 
                translateY: -5,
                boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.25)"
            }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            onClick={onClick}
            className="group relative bg-white/50 backdrop-blur-xl border border-emerald-100/30 rounded-[2.5rem] overflow-hidden shadow-sm cursor-pointer h-full flex flex-col transition-all duration-300 hover:border-emerald-200/50"
        >
            {/* Image Section */}
            <div className="relative h-64 w-full overflow-hidden bg-emerald-50">
                {image ? (
                    <img 
                        src={image} 
                        alt={title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                ) : null}
                {/* Fallback Gradient (shown if image is missing or fails to load) */}
                <div className={`absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50 to-white flex items-center justify-center ${image ? 'hidden' : ''}`}>
                    <Sparkles className="w-12 h-12 text-emerald-200" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Content Section */}
            <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-[#1a5d47] mb-3 group-hover:text-[#2c8d6d] transition-colors duration-300" style={{ fontFamily: "'Cinzel', serif" }}>
                    {title}
                </h3>
                <p className="text-[#595e67] text-base leading-relaxed line-clamp-4 font-sans font-light">
                    {description}
                </p>
                
                <div className="mt-auto pt-6 flex items-center text-[#1a5d47] font-semibold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    <span>Read More</span>
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-teal-400/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />
        </motion.div>
    );
};

export default StoryCard;
