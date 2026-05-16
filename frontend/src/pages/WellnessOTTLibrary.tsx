import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ArrowLeft, Trash2 } from 'lucide-react';

export default function WellnessOTTLibrary() {
    const navigate = useNavigate();
    const [savedSessions, setSavedSessions] = useState<any[]>([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const saved = JSON.parse(localStorage.getItem('savedOTTSessions') || '[]');
        setSavedSessions(saved);
    }, []);

    const handleRemove = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const updated = savedSessions.filter(s => s.id !== id);
        setSavedSessions(updated);
        localStorage.setItem('savedOTTSessions', JSON.stringify(updated));
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-[#1a5d47] selection:text-white pb-20">
            {/* Navigation / Back Button */}
            <div className="fixed top-0 left-0 w-full p-6 md:p-10 z-[100] bg-gradient-to-b from-[#050505]/90 to-transparent pointer-events-none">
                <button 
                    onClick={() => navigate('/wellness-ott')}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group pointer-events-auto"
                >
                    <ArrowLeft className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold tracking-wider text-sm uppercase">Back to Browse</span>
                </button>
            </div>

            {/* Header */}
            <div className="pt-32 px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto relative z-10">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4"
                    style={{ fontFamily: "'Cinzel', serif" }}
                >
                    My Library
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-white/60 text-lg mb-12"
                >
                    Your saved sessions for inner peace and mindfulness.
                </motion.p>

                {/* Grid */}
                {savedSessions.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <Play className="w-8 h-8 text-white/20" />
                        </div>
                        <h3 className="text-2xl font-bold text-white/80 mb-2">Your library is empty</h3>
                        <p className="text-white/50 mb-8 max-w-md">Browse our collection of wellness sessions and add them to your library to access them quickly.</p>
                        <button 
                            onClick={() => navigate('/wellness-ott')}
                            className="bg-[#1a5d47] hover:bg-[#113d2f] text-white px-8 py-3 rounded font-bold transition-colors shadow-lg shadow-[#1a5d47]/20"
                        >
                            Explore Sessions
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {savedSessions.map((session, idx) => (
                                <motion.div
                                    key={session.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    className="group relative rounded-xl overflow-hidden bg-[#111] shadow-xl border border-white/5"
                                >
                                    <div 
                                        className="aspect-video relative cursor-pointer overflow-hidden"
                                        onClick={() => navigate(`/wellness-ott/${session.id}`)}
                                    >
                                        <img 
                                            src={session.thumbnail} 
                                            alt={session.title} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-[#2ed899] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(46,216,153,0.5)] transform scale-90 group-hover:scale-100 transition-transform">
                                                <Play className="w-5 h-5 text-black fill-black ml-1" />
                                            </div>
                                        </div>
                                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded text-xs font-bold text-[#2ed899]">
                                            {session.category}
                                        </div>
                                    </div>
                                    
                                    <div className="p-5 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold mb-1 tracking-tight group-hover:text-[#2ed899] transition-colors">{session.title}</h3>
                                            <div className="flex items-center gap-3 text-sm text-white/50 font-medium mb-4">
                                                <span>{session.duration}</span>
                                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                                <span className="text-[#2ed899]">{session.match}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-auto">
                                            <button 
                                                onClick={() => navigate(`/wellness-ott/${session.id}`)}
                                                className="text-sm font-bold text-white hover:text-[#2ed899] transition-colors flex items-center gap-2"
                                            >
                                                Continue <ArrowLeft className="w-4 h-4 rotate-180" />
                                            </button>
                                            
                                            <button 
                                                onClick={(e) => handleRemove(e, session.id)}
                                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-white/50 hover:text-red-500 transition-colors z-10"
                                                title="Remove from Library"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Emerald Glow Bottom Edge */}
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#1a5d47] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Subtle background glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#1a5d47]/5 blur-[150px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-[#1a5d47]/5 blur-[150px] rounded-full" />
            </div>
        </div>
    );
}
