import { motion } from 'motion/react';
import { BoardState } from './TempleData';
import { CORE_X, CORE_Y } from './TempleEngine';

interface TempleBoardProps {
    board: BoardState;
    onCellClick: (x: number, y: number) => void;
    canPlace: boolean;
}

export const TempleBoard = ({ board, onCellClick, canPlace }: TempleBoardProps) => {
    
    const getFamilyColor = (family?: string) => {
        switch (family) {
            case 'Work': return 'text-amber-400 border-amber-500/50 bg-amber-900/20';
            case 'Rest': return 'text-blue-400 border-blue-500/50 bg-blue-900/20';
            case 'Relationships': return 'text-rose-400 border-rose-500/50 bg-rose-900/20';
            case 'Growth': return 'text-emerald-400 border-emerald-500/50 bg-emerald-900/20';
            default: return 'border-gray-800 bg-gray-900/30';
        }
    };

    return (
        <div className="relative aspect-square w-full max-w-[600px] mx-auto p-4 md:p-8">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,150,105,0.1)_0%,transparent_70%)] pointer-events-none" />

            <div className="grid grid-cols-5 grid-rows-5 gap-2 md:gap-4 h-full w-full relative z-10">
                {board.map((row, y) => (
                    row.map((cell, x) => {
                        const isCore = x === CORE_X && y === CORE_Y;
                        const isInnerRing = !isCore && (Math.abs(x - CORE_X) + Math.abs(y - CORE_Y)) === 1;
                        
                        return (
                            <motion.div
                                key={`${x}-${y}`}
                                onClick={() => {
                                    if (!isCore && !cell && canPlace) onCellClick(x, y);
                                }}
                                className={`
                                    relative rounded-xl md:rounded-2xl flex flex-col items-center justify-center
                                    transition-all duration-300
                                    ${isCore ? 'border-2 border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_30px_rgba(212,175,55,0.2)]' : ''}
                                    ${!isCore && !cell ? 'border border-gray-800/50 hover:border-gray-600 cursor-pointer bg-[#0A0A0A]' : ''}
                                    ${!isCore && !cell && !canPlace ? 'cursor-not-allowed opacity-50' : ''}
                                    ${cell ? `border flex flex-col p-2 text-center shadow-lg ${getFamilyColor(cell.tile.family)}` : ''}
                                `}
                                whileHover={!isCore && !cell && canPlace ? { scale: 0.95, backgroundColor: 'rgba(255,255,255,0.05)' } : {}}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: (x + y) * 0.05 }}
                            >
                                {isCore && (
                                    <div className="flex flex-col items-center justify-center h-full w-full">
                                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-[#D4AF37] flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                                            <div className="w-2 h-2 bg-[#D4AF37] rounded-full" />
                                        </div>
                                        <span className="text-[#D4AF37] text-[8px] md:text-xs tracking-widest uppercase mt-3 font-semibold">Core</span>
                                    </div>
                                )}

                                {cell && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center h-full w-full p-1"
                                    >
                                        <span className="text-[10px] md:text-xs font-bold leading-tight mb-1">{cell.tile.name}</span>
                                        <span className="text-[8px] md:text-[10px] opacity-70 tracking-wider uppercase">{cell.tile.family}</span>
                                    </motion.div>
                                )}

                                {/* Inner ring visual hint (very subtle) */}
                                {isInnerRing && !cell && (
                                    <div className="absolute inset-0 border border-[#D4AF37]/10 rounded-xl md:rounded-2xl pointer-events-none" />
                                )}
                            </motion.div>
                        );
                    })
                ))}
            </div>
        </div>
    );
};
