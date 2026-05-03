import React from 'react';
import { motion } from 'motion/react';

interface LibraryCardProps {
    title: string;
    image: string;
    onClick: () => void;
}

const LibraryCard: React.FC<LibraryCardProps> = ({ title, image, onClick }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05, rotateZ: 1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="relative group cursor-pointer overflow-hidden rounded-[2rem] shadow-xl aspect-[4/3] w-full bg-emerald-50"
        >
            <img 
                src={image} 
                alt={title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=800' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
            
            <div className="absolute inset-0 flex flex-col justify-end p-8">
                <motion.h3 
                    className="text-2xl sm:text-3xl font-bold text-white tracking-wide"
                    style={{ fontFamily: "'Cinzel', serif" }}
                >
                    {title}
                </motion.h3>
                <div className="w-12 h-1 bg-emerald-400 mt-4 rounded-full transition-all duration-300 group-hover:w-24" />
            </div>
        </motion.div>
    );
};

export default LibraryCard;
