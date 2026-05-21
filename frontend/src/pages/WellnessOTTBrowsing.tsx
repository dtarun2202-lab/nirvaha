import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ArrowLeft, Search, Bell, User, Info, X, Clock, PlayCircle, Settings, LogOut, CheckCircle, Pause, Volume2, Sparkles, Tv, ListPlus, ChevronRight } from 'lucide-react';
import { wellnessSessions, WellnessSession, Episode } from '../data/wellnessSessions';

// Interface for continue watching
interface ContinueWatchingItem {
    seriesId: string;
    episodeId: string;
    progress: number; // percentage
    timestamp: number;
    seriesTitle: string;
    episodeTitle: string;
    thumbnail: string;
}

const SessionRow = ({ 
    title, 
    sessions, 
    isOriginals = false 
}: { 
    title: string; 
    sessions: WellnessSession[]; 
    isOriginals?: boolean;
}) => {
    const navigate = useNavigate();
    
    if (sessions.length === 0) return null;

    return (
        <div className="relative z-20 mb-10 md:mb-14 px-6 md:px-12">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 tracking-wide text-white/90 flex items-center gap-2">
                {isOriginals && <span className="text-xs bg-[#2ed899]/10 text-[#2ed899] border border-[#2ed899]/30 px-2 py-0.5 rounded font-black tracking-widest uppercase">Nirvaha Original</span>}
                {title}
            </h3>
            
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x hide-scrollbar">
                <AnimatePresence mode="popLayout">
                    {sessions.map((item, idx) => {
                        const hasSeasons = item.seasons && item.seasons.length > 0;
                        const firstEpisode = hasSeasons ? item.seasons![0].episodes[0] : null;

                        return (
                            <motion.div
                                layout
                                key={`${title}-${item.id}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                onClick={() => navigate(`/wellness-ott/series/${item.id}`)}
                                className={`group relative flex-none rounded-xl overflow-hidden cursor-pointer bg-[#0c0c0c] border border-white/5 shadow-2xl snap-start transition-all duration-500 hover:border-[#2ed899]/30 hover:shadow-[0_0_30px_rgba(46,216,153,0.15)] ${
                                    isOriginals 
                                        ? 'w-[200px] md:w-[240px] aspect-[2/3]' 
                                        : 'w-[280px] md:w-[340px] aspect-video'
                                }`}
                            >
                                {/* Thumbnail */}
                                <img 
                                    src={item.thumbnail} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                />

                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                                {/* Content Details (Fades in on Hover / Shows subtly) */}
                                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5 z-10">
                                    <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                                        
                                        <div className="flex items-center gap-2 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#2ed899] bg-[#2ed899]/10 px-2 py-0.5 rounded border border-[#2ed899]/20">
                                                {item.category}
                                            </span>
                                            {item.type === 'Series' && (
                                                <span className="text-[10px] uppercase font-bold tracking-widest text-white/60 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                                    Series
                                                </span>
                                            )}
                                        </div>

                                        <h4 className="font-extrabold text-white text-base md:text-lg leading-tight mb-1 group-hover:text-[#2ed899] transition-colors">
                                            {item.title}
                                        </h4>

                                        {/* Subtitle / Season Details */}
                                        <div className="flex items-center gap-3 text-xs text-white/50 group-hover:text-white/70 transition-colors">
                                            <span className="text-[#2ed899] font-black">{item.match}</span>
                                            <span>{item.year}</span>
                                            {hasSeasons && (
                                                <span>
                                                    {item.seasons?.length} {item.seasons?.length === 1 ? 'Season' : 'Seasons'}
                                                </span>
                                            )}
                                        </div>

                                        {/* Short Description visible on hover for landscape cards */}
                                        {!isOriginals && (
                                            <p className="text-[11px] text-white/40 mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-normal">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Custom Floating Play Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                    <div 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (hasSeasons && firstEpisode) {
                                                const sSlug = item.title.toLowerCase().replace(/ /g, '-');
                                                navigate(`/wellness-ott/player/${sSlug}/episode-${firstEpisode.id}`);
                                            } else {
                                                navigate(`/wellness-ott/series/${item.id}`);
                                            }
                                        }}
                                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-300 hover:bg-[#2ed899] group-hover:shadow-[0_0_20px_rgba(46,216,153,0.5)]"
                                    >
                                        <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                                    </div>
                                </div>

                                {/* Dynamic Hover Outlines */}
                                <div className="absolute inset-0 border-[2px] border-transparent group-hover:border-[#2ed899]/30 transition-colors duration-500 rounded-xl pointer-events-none" />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default function WellnessOTTBrowsing() {
    const navigate = useNavigate();

    // States
    const [activeTab, setActiveTab] = useState<'Home' | 'Series' | 'Films' | 'New & Popular'>('Home');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [continueWatchingList, setContinueWatchingList] = useState<ContinueWatchingItem[]>([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        // Load Continue Watching lists
        const cwData = localStorage.getItem("ott_continue_watching");
        if (cwData) {
            try {
                const parsed = JSON.parse(cwData) as ContinueWatchingItem[];
                // Sort by recency
                parsed.sort((a, b) => b.timestamp - a.timestamp);
                setContinueWatchingList(parsed);
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    // Tab Filtering
    const displayedSessions = useMemo(() => {
        if (activeTab === 'Series') return wellnessSessions.filter(s => s.type === 'Series');
        if (activeTab === 'Films') return wellnessSessions.filter(s => s.type === 'Film');
        if (activeTab === 'New & Popular') return [...wellnessSessions].sort((a, b) => parseInt(b.match) - parseInt(a.match));
        return wellnessSessions;
    }, [activeTab]);

    const featured = displayedSessions[0] || wellnessSessions[0];
    
    // Dynamic Categorizations
    const originals = useMemo(() => wellnessSessions.filter(s => s.isOriginal), []);
    const trending = useMemo(() => [...displayedSessions].sort((a, b) => parseInt(b.match) - parseInt(a.match)).slice(0, 6), [displayedSessions]);
    const sleepSessions = useMemo(() => displayedSessions.filter(s => s.category === "Sleep Stories" || s.mood.includes("Sleepy")), [displayedSessions]);
    const anxietySessions = useMemo(() => displayedSessions.filter(s => s.category === "Anxiety Relief" || s.mood.includes("Relieved")), [displayedSessions]);
    const meditationSessions = useMemo(() => displayedSessions.filter(s => s.category === "Meditation" || s.category === "Breathwork"), [displayedSessions]);
    const recommended = useMemo(() => [...displayedSessions].reverse().slice(0, 6), [displayedSessions]);

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
        { id: 1, text: "New Episode added to anxiety relief series", time: "2h ago", icon: <Bell className="w-4 h-4 text-[#2ed899]" /> },
        { id: 2, text: "Welcome to our premium wellness OTT platform!", time: "5h ago", icon: <Sparkles className="w-4 h-4 text-[#2ed899]" /> },
        { id: 3, text: "Pick up right where you left off on Focus Flow", time: "1d ago", icon: <PlayCircle className="w-4 h-4 text-[#2ed899]" /> },
    ];

    const handleClearContinueWatching = (e: React.MouseEvent, seriesId: string) => {
        e.stopPropagation();
        const updated = continueWatchingList.filter(item => item.seriesId !== seriesId);
        setContinueWatchingList(updated);
        localStorage.setItem("ott_continue_watching", JSON.stringify(updated));
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-[#1a5d47] selection:text-white pb-24">
            
            {/* OTT Dynamic Navigation Bar */}
            <div className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-[#050505] via-[#050505]/75 to-transparent py-5 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
                <div className="flex items-center gap-8">
                    <button 
                        onClick={() => navigate('/dashboard')} 
                        className="flex items-center gap-2 group text-white/80 hover:text-[#2ed899] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden md:inline font-bold text-xs tracking-widest uppercase">Dashboard</span>
                    </button>
                    
                    <h1 
                        className="text-2xl md:text-3xl font-extrabold tracking-[0.2em] text-[#2ed899] cursor-pointer hover:opacity-90 transition-opacity" 
                        onClick={() => { setActiveTab('Home'); navigate('/wellness-ott'); }} 
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        NIRVAHA
                    </h1>
                    
                    <div className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-white/70 ml-6 relative">
                        {navItems.map(item => (
                            <span 
                                key={item}
                                onClick={() => setActiveTab(item as any)}
                                className={`cursor-pointer transition-colors relative pb-1 ${activeTab === item ? 'text-white font-black' : 'hover:text-white'}`}
                            >
                                {item}
                                {activeTab === item && (
                                    <motion.div 
                                        layoutId="navbar-indicator" 
                                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#2ed899] shadow-[0_0_12px_rgba(46,216,153,0.8)] rounded-full" 
                                    />
                                )}
                            </span>
                        ))}
                        <span 
                            onClick={() => navigate('/wellness-ott/library')} 
                            className="cursor-pointer hover:text-white transition-colors pb-1 border-b-[2px] border-transparent"
                        >
                            My List
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-5 md:gap-7 relative">
                    <div className="relative flex items-center">
                        <Search 
                            onClick={() => setIsSearchOpen(true)}
                            className="w-5 h-5 text-white/80 hover:text-[#2ed899] hover:drop-shadow-[0_0_8px_rgba(46,216,153,0.8)] cursor-pointer transition-all hover:scale-110" 
                        />
                    </div>
                    
                    {/* Notifications Panel */}
                    <div className="relative">
                        <Bell 
                            onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}
                            className={`w-5 h-5 cursor-pointer transition-all hover:scale-110 ${isNotificationsOpen ? 'text-[#2ed899]' : 'text-white/80 hover:text-white'}`} 
                        />
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#2ed899] rounded-full border-[1.5px] border-[#050505] shadow-[0_0_6px_rgba(46,216,153,0.8)] animate-pulse" />
                    </div>

                    {/* Profile Dropdown */}
                    <div 
                        onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }}
                        className={`w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1a5d47] to-[#2ed899]/50 flex items-center justify-center cursor-pointer overflow-hidden border transition-all ${
                            isProfileOpen ? 'border-[#2ed899] shadow-[0_0_15px_rgba(46,216,153,0.4)] scale-95' : 'border-white/10 hover:border-[#2ed899]/40'
                        }`}
                    >
                        <User className="w-5 h-5 text-white" />
                    </div>

                    {/* Notifications Modal */}
                    <AnimatePresence>
                        {isNotificationsOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="absolute top-14 right-12 w-80 bg-[#070809]/95 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(46,216,153,0.05)] z-50 p-2"
                            >
                                <div className="px-4 py-3 border-b border-white/5 mb-1 flex items-center justify-between">
                                    <h4 className="font-extrabold text-white text-xs uppercase tracking-widest">Notifications</h4>
                                    <span className="text-[10px] bg-[#2ed899]/10 text-[#2ed899] px-2 py-0.5 rounded font-bold">New</span>
                                </div>
                                <div className="flex flex-col max-h-[360px] overflow-y-auto hide-scrollbar">
                                    {notifications.map(note => (
                                        <div key={note.id} className="flex items-start gap-3.5 px-4 py-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
                                            <div className="mt-0.5 w-7 h-7 rounded-full bg-[#1a5d47]/20 flex items-center justify-center group-hover:bg-[#1a5d47]/40 transition-colors">
                                                {note.icon}
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <span className="text-xs font-bold text-white/95 leading-snug group-hover:text-white transition-colors">{note.text}</span>
                                                <span className="text-[10px] text-white/40 mt-1 font-semibold">{note.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Profile Modal */}
                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="absolute top-14 right-0 w-64 bg-[#070809]/95 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.9)] z-50 p-2"
                            >
                                <div className="px-4 py-4 border-b border-white/5 flex items-center gap-3.5 bg-white/5 rounded-xl mb-1">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a5d47] to-[#2ed899] flex items-center justify-center shadow-md">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-extrabold text-sm text-white">Nirvaha Member</span>
                                        <span className="text-[10px] uppercase tracking-widest text-[#2ed899] font-black mt-0.5">Premium Access</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 py-1">
                                    <button onClick={() => { setIsProfileOpen(false); navigate('/wellness-ott/library'); }} className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                                        <Tv className="w-4 h-4 text-[#2ed899]" /> My Library
                                    </button>
                                    <button onClick={() => { setIsProfileOpen(false); setActiveTab('New & Popular'); }} className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                                        <Sparkles className="w-4 h-4 text-[#2ed899]" /> Trending Now
                                    </button>
                                    <div className="h-px bg-white/5 my-1" />
                                    <button className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                                        <Settings className="w-4 h-4" /> Settings
                                    </button>
                                    <button onClick={() => navigate('/login')} className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors">
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Glassmorphic Search Fullscreen Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[200] bg-[#050505]/98 backdrop-blur-3xl flex flex-col pt-32 px-6 md:px-12 lg:px-24 overflow-y-auto hide-scrollbar"
                    >
                        <button 
                            onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                            className="absolute top-10 right-10 w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-all hover:scale-105"
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
                                    placeholder="Search series, category, moods..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent text-3xl md:text-5xl lg:text-6xl font-light text-white placeholder-white/20 border-b border-white/10 pb-4 md:pb-6 pl-14 md:pl-20 focus:outline-none focus:border-[#2ed899] transition-colors tracking-tight font-['Cinzel']"
                                />
                            </motion.div>

                            {searchQuery && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                    <AnimatePresence mode="popLayout">
                                        {searchResults.map((item, idx) => (
                                            <motion.div
                                                layout
                                                key={item.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                                onClick={() => { setIsSearchOpen(false); navigate(`/wellness-ott/series/${item.id}`); }}
                                                className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer bg-[#0c0c0c] border border-white/5 hover:border-[#2ed899]/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(46,216,153,0.1)]"
                                            >
                                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                                        <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-4 left-4 right-4 z-10">
                                                    <span className="text-[9px] uppercase font-black tracking-widest text-[#2ed899] bg-[#2ed899]/10 px-2 py-0.5 rounded border border-[#2ed899]/20">{item.category}</span>
                                                    <h4 className="font-extrabold text-white text-sm md:text-base mt-2 truncate">{item.title}</h4>
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
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
                                            <p className="text-white/60 text-xl font-medium">No series found matching "{searchQuery}"</p>
                                            <p className="text-white/40 mt-2 text-sm font-semibold">Try searching for "Sleep Stories", "Meditation", or "Breathwork"</p>
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Massive Cinematic Hero Banner */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={featured.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative h-[85vh] min-h-[550px] w-full cursor-pointer mb-8 md:mb-12" 
                    onClick={() => navigate(`/wellness-ott/series/${featured.id}`)}
                >
                    <div className="absolute inset-0 w-full h-full">
                        <motion.img 
                            key={featured.banner}
                            initial={{ scale: 1.05 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            src={featured.banner} 
                            alt={featured.title} 
                            className="w-full h-full object-cover object-center" 
                        />
                    </div>
                    {/* Immersive radial and linear gradients for that cinema room feel */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#050505]/40 to-[#050505] z-10" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#1a5d47]/20 to-transparent z-10 mix-blend-screen pointer-events-none" />
                    
                    <div className="absolute bottom-16 md:bottom-28 left-6 md:left-12 lg:left-16 z-20 max-w-2xl">
                        <motion.div 
                            key={featured.title}
                            initial={{ y: 40, opacity: 0 }} 
                            animate={{ y: 0, opacity: 1 }} 
                            transition={{ duration: 0.9, delay: 0.2 }}
                        >
                            <div className="flex items-center gap-2.5 mb-4">
                                {featured.isOriginal && (
                                    <span className="bg-[#2ed899]/15 text-[#2ed899] text-[10px] font-black px-2.5 py-0.5 rounded border border-[#2ed899]/30 uppercase tracking-widest shadow-[0_0_15px_rgba(46,216,153,0.3)]">
                                        Nirvaha Original
                                    </span>
                                )}
                                <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded border border-white/20 uppercase tracking-wider">
                                    {featured.category}
                                </span>
                            </div>
                            
                            <h2 
                                className="text-5xl md:text-7xl lg:text-8xl font-black mb-5 tracking-tight leading-none text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]" 
                                style={{ fontFamily: "'Cinzel', serif" }}
                            >
                                {featured.title}
                            </h2>
                            
                            <div className="flex items-center gap-4 text-xs md:text-sm font-semibold mb-6 text-white/80">
                                <span className="text-[#2ed899] font-black">{featured.match}</span>
                                <span className="border border-white/30 px-2 py-0.5 rounded text-[10px] font-black">{featured.rating}</span>
                                <span>{featured.duration}</span>
                                {featured.seasons && (
                                    <span className="text-[#2ed899] font-bold">
                                        {featured.seasons.length} {featured.seasons.length === 1 ? 'Season' : 'Seasons'}
                                    </span>
                                )}
                            </div>

                            <p className="text-white/60 text-sm md:text-base leading-relaxed font-medium mb-8 max-w-xl line-clamp-3">
                                {featured.description}
                            </p>

                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const firstEp = featured.seasons?.[0]?.episodes?.[0];
                                        if (firstEp) {
                                            const sSlug = featured.title.toLowerCase().replace(/ /g, '-');
                                            navigate(`/wellness-ott/player/${sSlug}/episode-${firstEp.id}`);
                                        } else {
                                            navigate(`/wellness-ott/series/${featured.id}`);
                                        }
                                    }}
                                    className="flex items-center gap-3 bg-white text-black px-7 md:px-9 py-3 md:py-4 rounded-xl font-extrabold text-sm uppercase tracking-widest hover:bg-[#2ed899] hover:text-black transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(46,216,153,0.4)]"
                                >
                                    <Play className="w-5 h-5 fill-black ml-0.5" /> Play Episode 1
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); navigate(`/wellness-ott/series/${featured.id}`); }}
                                    className="flex items-center gap-3 bg-white/10 backdrop-blur-xl text-white border border-white/20 px-7 md:px-9 py-3 md:py-4 rounded-xl font-extrabold text-sm uppercase tracking-widest hover:bg-white/20 hover:border-white/30 transition-all"
                                >
                                    <Info className="w-5 h-5" /> More Details
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Horizontal Rows */}
            <div className="relative space-y-6 md:space-y-10">

                {/* Continue Watching (Dynamically Loaded from localStorage) */}
                {continueWatchingList.length > 0 && (
                    <div className="relative z-20 mb-10 md:mb-14 px-6 md:px-12">
                        <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 tracking-wide text-white/90 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[#2ed899]" />
                            Continue Watching
                        </h3>
                        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x hide-scrollbar">
                            {continueWatchingList.map((item, idx) => (
                                <motion.div
                                    key={`cw-${item.seriesId}`}
                                    onClick={() => navigate(`/wellness-ott/player/${item.seriesId}/${item.episodeId}`)}
                                    className="group relative flex-none w-[260px] md:w-[320px] aspect-video rounded-xl overflow-hidden cursor-pointer bg-[#0c0c0c] border border-white/5 shadow-2xl snap-start transition-all hover:border-[#2ed899]/30"
                                >
                                    <img src={item.thumbnail} alt={item.episodeTitle} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" />
                                    
                                    {/* Bottom Progress Bar */}
                                    <div className="absolute bottom-0 left-0 w-full h-[5px] bg-white/20 z-20">
                                        <div 
                                            className="h-full bg-gradient-to-r from-[#1a5d47] to-[#2ed899]" 
                                            style={{ width: `${item.progress}%` }} 
                                        />
                                    </div>

                                    {/* Clear/Delete Continue Watching Button */}
                                    <button 
                                        onClick={(e) => handleClearContinueWatching(e, item.seriesId)}
                                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/50 hover:text-rose-400 hover:bg-black/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-30"
                                        title="Remove"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    {/* Content Details */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-4 z-10">
                                        <span className="text-[10px] text-[#2ed899] font-black uppercase tracking-widest">{item.seriesTitle}</span>
                                        <h4 className="font-extrabold text-white text-sm mt-0.5 leading-tight truncate">{item.episodeTitle}</h4>
                                        <span className="text-[10px] text-white/50 font-bold mt-1">Remaining: {100 - Math.round(item.progress)}%</span>
                                    </div>
                                    
                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl">
                                            <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Branded Nirvaha Originals Section (Aspect 2/3 Portrait Cards!) */}
                <SessionRow title="Nirvaha Originals" sessions={originals} isOriginals={true} />

                {/* Content categories split as horizontal rows */}
                <SessionRow title="Trending Wellness Series" sessions={trending} />
                <SessionRow title="Meditation & Mindfulness" sessions={meditationSessions} />
                <SessionRow title="Sleep & Rest Stories" sessions={sleepSessions} />
                <SessionRow title="Anxiety Recovery Programs" sessions={anxietySessions} />
                <SessionRow title="Recommended For You" sessions={recommended} />

            </div>

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
