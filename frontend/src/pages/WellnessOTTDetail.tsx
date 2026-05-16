import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Plus, ArrowLeft, Info, X, Volume2, Check, Library } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { wellnessSessions as videos } from '../data/wellnessSessions';



export default function WellnessOTTDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [isSaved, setIsSaved] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Scroll to top and check saved status on mount/id change
    useEffect(() => {
        window.scrollTo(0, 0);
        const savedSessions = JSON.parse(localStorage.getItem('savedOTTSessions') || '[]');
        setIsSaved(savedSessions.some((s: any) => s.id === id));
    }, [id]);

    const [activeTag, setActiveTag] = useState<string | null>(null);

    const session = videos.find(v => v.id === id) || videos[0];
    
    // Dynamic 'More Like This' logic
    const recommended = videos.filter(v => v.id !== id);
    const filteredRecommended = activeTag 
        ? recommended.filter(v => v.tags.includes(activeTag))
        : recommended.filter(v => v.category === session.category || v.tags.some(t => session.tags.includes(t)));
    
    const displayRecommended = filteredRecommended.length > 0 ? filteredRecommended : recommended;

    // Audio Player State
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState("0:00");
    const [durationStr, setDurationStr] = useState("0:00");

    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds)) return "0:00";
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const duration = audioRef.current.duration;
            setCurrentTime(formatTime(current));
            if (duration) {
                setProgress((current / duration) * 100);
            }
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDurationStr(formatTime(audioRef.current.duration));
        }
    };

    const togglePlay = () => {
        if (!showPlayer) {
            setShowPlayer(true);
        }
        
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (audioRef.current) {
            const bar = e.currentTarget;
            const rect = bar.getBoundingClientRect();
            const clickPosition = e.clientX - rect.left;
            const percentage = clickPosition / rect.width;
            audioRef.current.currentTime = percentage * audioRef.current.duration;
        }
    };

    const handleWatchLater = () => {
        const savedSessions = JSON.parse(localStorage.getItem('savedOTTSessions') || '[]');
        if (!isSaved) {
            savedSessions.push(session);
            localStorage.setItem('savedOTTSessions', JSON.stringify(savedSessions));
            setIsSaved(true);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } else {
            const newSessions = savedSessions.filter((s: any) => s.id !== session.id);
            localStorage.setItem('savedOTTSessions', JSON.stringify(newSessions));
            setIsSaved(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-[#1a5d47] selection:text-white pb-20">
            {/* Audio Element */}
            <audio
                ref={audioRef}
                src={session.audioSource}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />

            {/* Navigation / Back Button */}
            <div className="fixed top-0 left-0 w-full p-6 md:p-10 z-[100] bg-gradient-to-b from-[#050505]/80 to-transparent pointer-events-none flex justify-between items-center">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group pointer-events-auto"
                >
                    <ArrowLeft className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold tracking-wider text-sm uppercase">Back</span>
                </button>
                
                <button 
                    onClick={() => navigate('/wellness-ott/library')}
                    className="flex items-center gap-2 text-white/80 hover:text-[#2ed899] transition-colors group pointer-events-auto bg-[#050505]/40 backdrop-blur-md border border-white/10 hover:border-[#2ed899]/50 px-4 py-2 rounded-full"
                >
                    <Library className="w-4 h-4" />
                    <span className="font-semibold tracking-wider text-xs uppercase hidden sm:block">My Library</span>
                </button>
            </div>

            {/* Hero Section */}
            <div className="relative h-[85vh] min-h-[600px] w-full">
                {/* Hero Background Image */}
                <motion.div 
                    initial={{ scale: 1.05, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    <img 
                        src={session.thumbnail} 
                        alt={session.title} 
                        className="w-full h-full object-cover object-center"
                    />
                </motion.div>

                {/* Gradients for OTT Feel */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent z-10" />
                
                {/* Subtle Emerald Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1a5d47]/20 to-transparent z-10 mix-blend-screen" />

                {/* Hero Content */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-16 lg:p-24 max-w-[1440px] mx-auto w-full">
                    <motion.div 
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        className="max-w-3xl"
                    >
                        {/* Netflix-style metadata row */}
                        <div className="flex items-center gap-4 text-sm md:text-base font-semibold tracking-wide mb-4 text-white/80">
                            <span className="text-[#2ed899] font-bold">{session.match}</span>
                            <span>{session.year}</span>
                            <span className="border border-white/40 px-2 py-0.5 rounded text-xs">{session.rating}</span>
                            <span>{session.duration}</span>
                        </div>

                        <h1 
                            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-none"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            {session.title}
                        </h1>

                        <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed mb-8 max-w-2xl drop-shadow-md">
                            {session.description}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <button 
                                onClick={togglePlay}
                                className="flex items-center gap-3 bg-white text-[#050505] px-8 py-3 md:py-4 rounded font-bold text-lg hover:bg-white/90 transition-colors"
                            >
                                {isPlaying ? <Pause className="w-6 h-6 fill-[#050505]" /> : <Play className="w-6 h-6 fill-[#050505]" />}
                                {isPlaying ? "Pause Session" : "Play Session"}
                            </button>
                            <button 
                                onClick={handleWatchLater}
                                className={`flex items-center gap-3 backdrop-blur-md border px-8 py-3 md:py-4 rounded font-bold text-lg transition-all ${
                                    isSaved 
                                        ? 'bg-[#1a5d47]/30 border-[#2ed899]/50 text-[#2ed899] shadow-[0_0_15px_rgba(46,216,153,0.3)] hover:bg-[#1a5d47]/50' 
                                        : 'bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50'
                                }`}
                            >
                                {isSaved ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                                {isSaved ? "Saved to Library" : "Watch Later"}
                            </button>
                            <button className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-colors group">
                                <Info className="w-6 h-6 text-white group-hover:text-[#2ed899] transition-colors" />
                            </button>
                        </div>

                        {/* Tags */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white/50 text-sm font-semibold mr-2 tracking-wider uppercase">Tags:</span>
                            {session.tags.map((tag, idx) => (
                                <span key={idx} className="flex items-center">
                                    <span 
                                        onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                                        className={`cursor-pointer text-sm font-medium transition-colors border-b border-transparent hover:border-current ${
                                            activeTag === tag ? 'text-[#2ed899] border-[#2ed899]' : 'text-white/80 hover:text-white'
                                        }`}
                                    >
                                        {tag}
                                    </span>
                                    {idx < session.tags.length - 1 ? <span className="mx-2 text-white/30">•</span> : ''}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Recommended Sessions Row */}
            <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 relative z-20 -mt-10 md:-mt-20">
                <motion.h3 
                    key={activeTag || 'default'}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xl md:text-2xl font-semibold mb-6 tracking-wide flex items-center gap-2"
                >
                    {activeTag ? `More in "${activeTag}"` : 'More Like This'}
                    {activeTag && (
                        <button 
                            onClick={() => setActiveTag(null)}
                            className="text-xs text-white/50 hover:text-white ml-2 border border-white/20 rounded px-2 py-0.5"
                        >
                            Clear
                        </button>
                    )}
                </motion.h3>
                
                <div className="flex gap-4 md:gap-6 overflow-x-auto pb-8 snap-x hide-scrollbar">
                    <AnimatePresence mode="popLayout">
                        {displayRecommended.map((rec, idx) => (
                            <motion.div
                                layout
                                key={rec.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            onClick={() => {
                                // If playing, pause current before navigating
                                if (isPlaying && audioRef.current) {
                                    audioRef.current.pause();
                                    setIsPlaying(false);
                                }
                                setShowPlayer(false);
                                navigate(`/wellness-ott/${rec.id}`);
                            }}
                            className="group relative flex-none w-[260px] md:w-[320px] aspect-video rounded-md overflow-hidden cursor-pointer snap-start bg-[#111]"
                        >
                            <img 
                                src={rec.thumbnail} 
                                alt={rec.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                            <Play className="w-4 h-4 text-[#050505] fill-[#050505] ml-0.5" />
                                        </div>
                                        <span className="text-[#2ed899] font-bold text-xs">{rec.match}</span>
                                        <span className="border border-white/40 px-1.5 py-0.5 rounded text-[10px]">{rec.rating}</span>
                                    </div>
                                    <h4 className="font-bold text-lg leading-tight mb-1">{rec.title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-white/70">
                                        <span>{rec.duration}</span>
                                        <span>•</span>
                                        <span>{rec.category}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Emerald Border on Hover */}
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#1a5d47] transition-colors duration-300 rounded-md pointer-events-none" />
                        </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Floating Audio Player */}
            <AnimatePresence>
                {showPlayer && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="fixed bottom-0 left-0 w-full z-[110] bg-[#050505]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]"
                    >
                        {/* Emerald glow line on top of player */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#2ed899]/50 to-transparent shadow-[0_0_15px_rgba(46,216,153,0.6)]" />
                        
                        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-4 flex flex-col md:flex-row items-center gap-6">
                            
                            {/* Player Info */}
                            <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
                                <div className="w-12 h-12 rounded-sm overflow-hidden flex-shrink-0 relative">
                                    <img src={session.thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
                                    {isPlaying && (
                                        <div className="absolute inset-0 bg-[#1a5d47]/40 mix-blend-overlay flex items-center justify-center">
                                            <div className="w-full h-full bg-[#2ed899]/20 animate-pulse" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="text-white font-bold text-sm md:text-base leading-tight">{session.title}</h4>
                                    <p className="text-[#2ed899] font-medium text-xs mt-0.5">{session.category}</p>
                                </div>
                            </div>

                            {/* Controls & Progress */}
                            <div className="flex flex-col items-center flex-[2] w-full gap-2">
                                <div className="flex items-center gap-6">
                                    <button 
                                        onClick={togglePlay}
                                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                                    >
                                        {isPlaying ? <Pause className="w-5 h-5 text-black fill-black" /> : <Play className="w-5 h-5 text-black fill-black ml-1" />}
                                    </button>
                                </div>

                                <div className="flex items-center w-full gap-4 text-xs text-white/50 font-medium">
                                    <span className="w-8 text-right">{currentTime}</span>
                                    <div 
                                        className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer relative overflow-hidden group"
                                        onClick={handleProgressBarClick}
                                    >
                                        <div 
                                            className="absolute top-0 left-0 h-full bg-[#2ed899] rounded-full transition-all duration-100 ease-linear relative"
                                            style={{ width: `${progress}%` }}
                                        >
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_5px_rgba(46,216,153,0.8)]" />
                                        </div>
                                    </div>
                                    <span className="w-8">{durationStr}</span>
                                </div>
                            </div>

                            {/* Extra Controls */}
                            <div className="flex-1 flex justify-end items-center gap-4 hidden md:flex">
                                <Volume2 className="w-5 h-5 text-white/50 hover:text-white cursor-pointer transition-colors" />
                                <button 
                                    onClick={() => {
                                        setShowPlayer(false);
                                        if (audioRef.current) {
                                            audioRef.current.pause();
                                            setIsPlaying(false);
                                        }
                                    }}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-white/50 hover:text-white" />
                                </button>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Premium Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[120] flex items-center gap-3 bg-[#050505]/90 backdrop-blur-xl border border-[#2ed899]/30 px-6 py-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(46,216,153,0.2)]"
                    >
                        <div className="w-8 h-8 rounded-full bg-[#1a5d47]/30 flex items-center justify-center border border-[#2ed899]/50">
                            <Check className="w-4 h-4 text-[#2ed899]" />
                        </div>
                        <span className="text-white font-medium tracking-wide">Saved to Your Library</span>
                        <button 
                            onClick={() => navigate('/wellness-ott/library')}
                            className="ml-2 text-xs font-bold text-[#2ed899] hover:text-white underline underline-offset-2 transition-colors pointer-events-auto"
                        >
                            View
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom CSS for hide-scrollbar */}
            <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </div>
    );
}
