import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuitConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const QuitConfirmationModal: React.FC<QuitConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative bg-[#111111] border border-zinc-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
                    >
                        <h3 className="text-2xl font-serif text-white mb-3" style={{ fontFamily: "'Cinzel', serif" }}>Quit Game?</h3>
                        <p className="text-zinc-400 mb-8 text-sm leading-relaxed font-sans">
                            Are you sure you want to return to the Arcade? Any current progress will be lost.
                        </p>
                        <div className="flex gap-4 w-full">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium transition-colors shadow-[0_0_15px_rgba(225,29,72,0.3)]"
                            >
                                Quit
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
