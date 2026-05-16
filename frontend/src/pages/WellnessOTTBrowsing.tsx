import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ArrowLeft, Search, Bell, User, Info, X, Clock, PlayCircle, Settings, LogOut, CheckCircle, Pause, Volume2 } from 'lucide-react';
import { wellnessSessions, WellnessSession } from '../data/wellnessSessions';

const SessionRow = ({ title, sessions }: { title: string, sessions: WellnessSession[] }) => {
    const navigate = useNavigate();
    
    if (sessions.length === 0) return null;

    return (
        <div className="relative z-20 mb-8 md:mb-12 px-6 md:px-12">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 tracking-wide text-white/90">{title}</h3>
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
                <AnimatePresence mode="popLayout">
                    {sessions.map((item, idx) => (
                        <motion.div
                            layout
                            key={`${title}-${item.id}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            onClick={() => navigate(`/wellness-ott/${item.id}`)}
                            className="group relative flex-none w-[280px] md:w-[320px] aspect-[16/9] rounded-md overflow-hidden cursor-pointer bg-[#111] shadow-xl snap-start"
                        >
                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h4 className="font-bold text-white text-base md:text-lg leading-tight mb-1">{item.title}</h4>
                                    <div className="flex items-center gap-3 text-xs">
                                        <span className="text-[#2ed899] font-bold">{item.match}</span>
                                        <span className="text-white/70">{item.duration}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#1a5d47] transition-colors duration-300 rounded-md pointer-events-none" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default function WellnessOTTBrowsing() {
    const navigate = useNavigate();

    // State
    const [activeTab, setActiveTab] = useState<'Home' | 'Series' | 'Films' | 'New & Popular'>('Home');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Audio Player State
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playingSession, setPlayingSession] = useState<WellnessSession | null>(null);
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

    const handlePlayPause = () => {
        if (!showPlayer) return;
        
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handlePlayHero = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (playingSession?.id !== featured.id) {
            setPlayingSession(featured);
            setProgress(0);
            setCurrentTime("0:00");
        }
        setShowPlayer(true);
        setIsPlaying(true);
        
        // Timeout to ensure audio element has src updated before playing
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
            }
        }, 100);
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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Tab Filtering
    const displayedSessions = useMemo(() => {
        if (activeTab === 'Series') return wellnessSessions.filter(s => s.type === 'Series');
        if (activeTab === 'Films') return wellnessSessions.filter(s => s.type === 'Film');
        if (activeTab === 'New & Popular') return [...wellnessSessions].sort((a, b) => parseInt(b.match) - parseInt(a.match));
        return wellnessSessions;
    }, [activeTab]);

    const featured = displayedSessions[0] || wellnessSessions[0];
    
    // Dynamic categorizations
    const trending = [...displayedSessions].sort((a, b) => parseInt(b.match) - parseInt(a.match)).slice(0, 5);
    const sleepSessions = displayedSessions.filter(s => s.category === "Sleep" || s.mood.includes("Sleepy"));
    const focusSessions = displayedSessions.filter(s => s.category === "Productivity" || s.mood.includes("Focused"));
    const stressRelief = displayedSessions.filter(s => s.category === "Stress" || s.mood.includes("Relieved"));
    const energyReset = displayedSessions.filter(s => s.category === "Energy" || s.mood.includes("Energized"));
    const recommended = [...displayedSessions].reverse().slice(0, 5);

    // Search Filtering
    const searchResults = useMemo(() => {
        if (!searchQuery) return [];
        const q = searchQuery.toLowerCase();
        return wellnessSessions.filter(s => 
            s.title.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q) ||
            s.tags.some(t => t.toLowerCase().includes(q)) ||
            s.mood.some(m => m.toLowerCase().includes(q))
        );
    }, [searchQuery]);

    // Mock Data
    const navItems = ['Home', 'Series', 'Films', 'New & Popular'];
    const notifications = [
        { id: 1, text: "New stress relief session added", time: "2h ago", icon: <Bell className="w-4 h-4 text-[#2ed899]" /> },
        { id: 2, text: "Your saved session is trending", time: "5h ago", icon: <CheckCircle className="w-4 h-4 text-[#2ed899]" /> },
        { id: 3, text: "Continue your Morning Calm journey", time: "1d ago", icon: <PlayCircle className="w-4 h-4 text-[#2ed899]" /> },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-[#1a5d47] selection:text-white pb-20">
            {/* Audio Element */}
            <audio
                ref={audioRef}
                src={playingSession?.audioSource}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />

            {/* OTT Navigation Bar */}
            <div className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-[#050505]/95 via-[#050505]/80 to-transparent py-6 px-6 md:px-12 flex justify-between items-center transition-all duration-300 pointer-events-none">
                <div className="flex items-center gap-8 pointer-events-auto">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 group hover:text-[#2ed899] transition-colors">
                        <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden md:inline font-semibold text-sm tracking-wider uppercase">Dashboard</span>
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-widest text-[#2ed899] cursor-pointer" onClick={() => setActiveTab('Home')} style={{ fontFamily: "'Cinzel', serif" }}>
                        NIRVAHA
                    </h1>
                    <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-white/70 ml-4 relative">
                        {navItems.map(item => (
                            <span 
                                key={item}
                                onClick={() => setActiveTab(item as any)}
                                className={`cursor-pointer transition-colors relative pb-1 ${activeTab === item ? 'text-white' : 'hover:text-white'}`}
                            >
                                {item}
                                {activeTab === item && (
                                    <motion.div layoutId="navbar-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2ed899] shadow-[0_0_10px_rgba(46,216,153,0.8)] rounded-full" />
                                )}
                            </span>
                        ))}
                        <span onClick={() => navigate('/wellness-ott/library')} className="cursor-pointer hover:text-white transition-colors pb-1 border-b-[2px] border-transparent">My List</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 md:gap-6 pointer-events-auto relative">
                    <Search 
                        onClick={() => setIsSearchOpen(true)}
                        className="w-5 h-5 text-white/80 hover:text-[#2ed899] hover:drop-shadow-[0_0_8px_rgba(46,216,153,0.8)] cursor-pointer transition-all hidden sm:block hover:scale-110" 
                    />
                    
                    {/* Notifications Toggle */}
                    <div className="relative">
                        <Bell 
                            onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}
                            className={`w-5 h-5 cursor-pointer transition-all hover:scale-110 ${isNotificationsOpen ? 'text-[#2ed899]' : 'text-white/80 hover:text-white'}`} 
                        />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#2ed899] rounded-full border-[1.5px] border-[#050505] shadow-[0_0_5px_rgba(46,216,153,0.8)]" />
                    </div>

                    {/* Profile Toggle */}
                    <div 
                        onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }}
                        className={`w-8 h-8 rounded bg-[#1a5d47] flex items-center justify-center cursor-pointer overflow-hidden border transition-colors ${isProfileOpen ? 'border-[#2ed899] shadow-[0_0_10px_rgba(46,216,153,0.5)]' : 'border-white/10 hover:border-[#2ed899]/50'}`}
                    >
                        <User className="w-5 h-5 text-white" />
                    </div>

                    {/* Notifications Dropdown Modal */}
                    <AnimatePresence>
                        {isNotificationsOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="absolute top-14 right-12 w-80 bg-[#050505]/95 backdrop-blur-2xl border border-[#2ed899]/20 rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(46,216,153,0.1)] z-50"
                            >
                                <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                                    <h4 className="font-bold text-white text-sm">Notifications</h4>
                                </div>
                                <div className="flex flex-col max-h-96 overflow-y-auto hide-scrollbar">
                                    {notifications.map(note => (
                                        <div key={note.id} className="flex items-start gap-4 px-4 py-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                                            <div className="mt-0.5 w-8 h-8 rounded-full bg-[#1a5d47]/20 flex items-center justify-center group-hover:bg-[#1a5d47]/50 group-hover:shadow-[0_0_10px_rgba(26,93,71,0.5)] transition-all">
                                                {note.icon}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-white/90 group-hover:text-white leading-tight">{note.text}</span>
                                                <span className="text-xs text-white/40 mt-1">{note.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Profile Dropdown Modal */}
                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="absolute top-14 right-0 w-64 bg-[#050505]/95 backdrop-blur-2xl border border-white/10 rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50"
                            >
                                <div className="px-4 py-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
                                    <div className="w-10 h-10 rounded bg-[#1a5d47] flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-white">Nirvaha Member</span>
                                        <span className="text-xs text-[#2ed899]">Premium</span>
                                    </div>
                                </div>
                                <div className="flex flex-col py-2">
                                    <button onClick={() => navigate('/wellness-ott/library')} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                                        <User className="w-4 h-4" /> My Library
                                    </button>
                                    <button className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                                        <Clock className="w-4 h-4" /> Recently Played
                                    </button>
                                    <button className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                                        <PlayCircle className="w-4 h-4" /> Continue Listening
                                    </button>
                                    <div className="h-px bg-white/10 my-2" />
                                    <button className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                                        <Settings className="w-4 h-4" /> Settings
                                    </button>
                                    <button className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/80 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Search Fullscreen Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[200] bg-[#050505]/95 backdrop-blur-2xl flex flex-col pt-32 px-6 md:px-12 lg:px-24 overflow-y-auto hide-scrollbar"
                    >
                        <button 
                            onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                            className="absolute top-10 right-10 w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        
                        <div className="max-w-5xl mx-auto w-full pb-20">
                            <motion.div 
                                initial={{ y: -30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                                className="relative mb-16"
                            >
                                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 text-[#2ed899] drop-shadow-[0_0_15px_rgba(46,216,153,0.6)]" />
                                <input 
                                    autoFocus
                                    type="text" 
                                    placeholder="Search titles, moods, categories..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent text-3xl md:text-5xl lg:text-6xl font-light text-white placeholder-white/20 border-b border-white/20 pb-4 md:pb-6 pl-14 md:pl-20 focus:outline-none focus:border-[#2ed899] transition-colors tracking-tight"
                                />
                            </motion.div>

                            {searchQuery && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                    <AnimatePresence mode="popLayout">
                                        {searchResults.map((item, idx) => (
                                            <motion.div
                                                layout
                                                key={item.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                                onClick={() => navigate(`/wellness-ott/${item.id}`)}
                                                className="group relative aspect-video rounded-lg overflow-hidden cursor-pointer bg-[#111] shadow-xl border border-white/5"
                                            >
                                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="w-12 h-12 bg-[#2ed899] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(46,216,153,0.5)] transform scale-90 group-hover:scale-100 transition-transform">
                                                        <Play className="w-5 h-5 text-black fill-black ml-1" />
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-3 left-3 right-3">
                                                    <h4 className="font-bold text-white text-sm md:text-base truncate drop-shadow-md">{item.title}</h4>
                                                    <div className="text-xs text-[#2ed899] font-medium">{item.category}</div>
                                                </div>
                                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#1a5d47] transition-colors duration-300 rounded-lg pointer-events-none" />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {searchResults.length === 0 && (
                                        <motion.div 
                                            initial={{ opacity: 0 }} 
                                            animate={{ opacity: 1 }} 
                                            className="col-span-full flex flex-col items-center justify-center py-20 text-center"
                                        >
                                            <Search className="w-16 h-16 text-white/10 mb-4" />
                                            <p className="text-white/60 text-xl font-medium">No sessions found for "{searchQuery}"</p>
                                            <p className="text-white/40 mt-2">Try searching for "Sleep", "Stress", or "Focus"</p>
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Featured Hero */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={featured.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative h-[75vh] min-h-[500px] w-full cursor-pointer mb-8 md:mb-16" 
                    onClick={() => navigate(`/wellness-ott/${featured.id}`)}
                >
                    <div className="absolute inset-0 w-full h-full">
                        <motion.img 
                            key={featured.thumbnail}
                            initial={{ scale: 1.05 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            src={featured.thumbnail} 
                            alt={featured.title} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#1a5d47]/20 to-transparent z-10 mix-blend-screen pointer-events-none" />
                    
                    <div className="absolute bottom-16 md:bottom-24 left-6 md:left-12 z-20 max-w-2xl">
                        <motion.div 
                            key={featured.title}
                            initial={{ y: 30, opacity: 0 }} 
                            animate={{ y: 0, opacity: 1 }} 
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                {featured.type === 'Series' && <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2 py-0.5 rounded border border-white/20 uppercase tracking-wider">Series</span>}
                                {featured.type === 'Film' && <span className="bg-[#1a5d47] text-white text-xs font-bold px-2 py-0.5 rounded border border-[#2ed899]/30 uppercase tracking-wider shadow-[0_0_10px_rgba(26,93,71,0.5)]">Film</span>}
                            </div>
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tighter" style={{ fontFamily: "'Cinzel', serif" }}>
                                {featured.title}
                            </h2>
                            <div className="flex items-center gap-4 text-xs md:text-sm font-semibold mb-6">
                                <span className="text-[#2ed899] font-bold">{featured.match}</span>
                                <span className="border border-white/40 px-2 py-0.5 rounded">{featured.rating}</span>
                                <span>{featured.duration}</span>
                                <span className="px-2 py-0.5 border border-gray-600 rounded text-gray-300 hidden sm:block">HD</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={handlePlayHero}
                                    className="flex items-center gap-2 bg-white text-black px-6 md:px-8 py-2.5 md:py-3.5 rounded font-bold hover:bg-white/90 transition-colors shadow-lg"
                                >
                                    {(isPlaying && playingSession?.id === featured.id) ? <Pause className="w-5 h-5 md:w-6 md:h-6 fill-black" /> : <Play className="w-5 h-5 md:w-6 md:h-6 fill-black" />} 
                                    {(isPlaying && playingSession?.id === featured.id) ? "Pause" : "Play"}
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); navigate(`/wellness-ott/${featured.id}`); }}
                                    className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 md:px-8 py-2.5 md:py-3.5 rounded font-bold hover:bg-white/30 hover:border-white/50 transition-colors"
                                >
                                    <Info className="w-5 h-5 md:w-6 md:h-6" /> More Info
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Dynamic Rows based on active tab */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    {activeTab === 'Home' && (
                        <>
                            <SessionRow title="Trending Now" sessions={trending} />
                            <SessionRow title="Sleep Sessions" sessions={sleepSessions} />
                            <SessionRow title="Focus & Clarity" sessions={focusSessions} />
                            <SessionRow title="Stress Relief" sessions={stressRelief} />
                            <SessionRow title="Energy Reset" sessions={energyReset} />
                            <SessionRow title="Recommended For You" sessions={recommended} />
                        </>
                    )}
                    
                    {activeTab === 'Series' && (
                        <>
                            <SessionRow title="Trending Series" sessions={trending} />
                            <SessionRow title="Productivity Series" sessions={focusSessions} />
                            <SessionRow title="Relaxation Series" sessions={stressRelief} />
                        </>
                    )}

                    {activeTab === 'Films' && (
                        <>
                            <SessionRow title="Featured Films" sessions={trending} />
                            <SessionRow title="Sleep Films" sessions={sleepSessions} />
                            <SessionRow title="Energy Films" sessions={energyReset} />
                        </>
                    )}

                    {activeTab === 'New & Popular' && (
                        <>
                            <SessionRow title="Top Matches" sessions={trending} />
                            <SessionRow title="Recently Added" sessions={recommended} />
                            <SessionRow title="Highest Rated" sessions={displayedSessions} />
                        </>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Floating Audio Player */}
            <AnimatePresence>
                {showPlayer && playingSession && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="fixed bottom-0 left-0 w-full z-[150] bg-[#050505]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]"
                    >
                        {/* Emerald glow line on top of player */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#2ed899]/50 to-transparent shadow-[0_0_15px_rgba(46,216,153,0.6)]" />
                        
                        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-4 flex flex-col md:flex-row items-center gap-6">
                            
                            {/* Player Info */}
                            <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
                                <div className="w-12 h-12 rounded-sm overflow-hidden flex-shrink-0 relative cursor-pointer" onClick={() => navigate(`/wellness-ott/${playingSession.id}`)}>
                                    <img src={playingSession.thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
                                    {isPlaying && (
                                        <div className="absolute inset-0 bg-[#1a5d47]/40 mix-blend-overlay flex items-center justify-center">
                                            <div className="w-full h-full bg-[#2ed899]/20 animate-pulse" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col cursor-pointer" onClick={() => navigate(`/wellness-ott/${playingSession.id}`)}>
                                    <h4 className="text-white font-bold text-sm md:text-base leading-tight hover:text-[#2ed899] transition-colors">{playingSession.title}</h4>
                                    <p className="text-[#2ed899] font-medium text-xs mt-0.5">{playingSession.category}</p>
                                </div>
                            </div>

                            {/* Controls & Progress */}
                            <div className="flex flex-col items-center flex-[2] w-full gap-2">
                                <div className="flex items-center gap-6">
                                    <button 
                                        onClick={handlePlayPause}
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
