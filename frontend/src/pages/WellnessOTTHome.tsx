import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  ArrowLeft, 
  Search, 
  Bell, 
  User, 
  Info, 
  X, 
  Clock, 
  PlayCircle, 
  Settings, 
  LogOut, 
  Sparkles, 
  Tv, 
  Volume2
} from 'lucide-react';
import { WellnessSession } from '../data/wellnessSessions';
import { useWellnessOTT } from '../contexts/WellnessOTTContext';
import HeroBanner from '../components/wellness-ott/HeroBanner';

// Interface for unified continue watching
interface ContinueWatchingItem {
  seriesId: string;
  episodeId: string;
  progress: number; // percentage
  timestamp: number;
  seriesTitle: string;
  episodeTitle: string;
  thumbnail: string;
  mediaType?: 'video' | 'audio';
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
    <div className="relative z-20 mb-10 md:mb-14 px-6 md:px-12 lg:px-16">
      <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 tracking-wide text-white/90 flex items-center gap-2">
        {isOriginals && (
          <span className="text-[10px] bg-[#2ed899]/15 text-[#2ed899] border border-[#2ed899]/30 px-2.5 py-0.5 rounded font-black tracking-widest uppercase shadow-[0_0_15px_rgba(46,216,153,0.1)]">
            Nirvaha Original
          </span>
        )}
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
                    ? 'w-[180px] md:w-[220px] aspect-[2/3]' 
                    : 'w-[280px] md:w-[320px] aspect-video'
                }`}
              >
                {/* Thumbnail */}
                <img 
                  src={item.thumbnail} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  loading="lazy"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Content Details */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5 z-10">
                  <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[9px] uppercase font-black tracking-widest text-[#2ed899] bg-[#2ed899]/15 px-2 py-0.5 rounded border border-[#2ed899]/20">
                        {item.category}
                      </span>
                      {item.type === 'Series' && (
                        <span className="text-[9px] uppercase font-bold tracking-widest text-white/60 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                          Series
                        </span>
                      )}
                    </div>

                    <h4 className="font-extrabold text-white text-base md:text-lg leading-tight mb-1 group-hover:text-[#2ed899] transition-colors truncate">
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

                    {/* Short Description */}
                    {!isOriginals && (
                      <p className="text-[10px] text-white/40 mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-normal font-medium">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Floating Play Button Overlay */}
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

                {/* Hover Outlines */}
                <div className="absolute inset-0 border-[2px] border-transparent group-hover:border-[#2ed899]/30 transition-colors duration-500 rounded-xl pointer-events-none" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function WellnessOTTHome() {
  const navigate = useNavigate();
  const { sessions } = useWellnessOTT();

  // Navigation states
  const [activeTab, setActiveTab] = useState<'Home' | 'Series' | 'Films' | 'New & Popular'>('Home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [continueWatchingList, setContinueWatchingList] = useState<ContinueWatchingItem[]>([]);
  const [scrolled, setScrolled] = useState(false);

  // Handle header background alpha transition on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync / Load continue watching list (combining audio and video list)
  useEffect(() => {
    window.scrollTo(0, 0);
    loadContinueWatching();
  }, []);

  const loadContinueWatching = () => {
    // 1. Video Watch List
    const videoData = localStorage.getItem("ott_continue_watching");
    let videoList: ContinueWatchingItem[] = [];
    if (videoData) {
      try {
        videoList = JSON.parse(videoData) as ContinueWatchingItem[];
      } catch (e) {
        console.error("Failed to parse video progress list:", e);
      }
    }

    // 2. Audio Listening List
    const audioData = localStorage.getItem("continueListening");
    let audioList: ContinueWatchingItem[] = [];
    if (audioData) {
      try {
        audioList = JSON.parse(audioData) as ContinueWatchingItem[];
      } catch (e) {
        console.error("Failed to parse audio progress list:", e);
      }
    }

    // Combine them with uniqueness check
    const map = new Map<string, ContinueWatchingItem>();
    
    videoList.forEach(item => {
      const key = `${item.seriesId}-${item.episodeId}`;
      map.set(key, { ...item, mediaType: 'video' });
    });

    audioList.forEach(item => {
      const key = `${item.seriesId}-${item.episodeId}`;
      const existing = map.get(key);
      if (!existing || item.timestamp > existing.timestamp) {
        map.set(key, { ...item, mediaType: 'audio' });
      }
    });

    const combined = Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
    setContinueWatchingList(combined);
  };

  const handleClearContinueWatching = (e: React.MouseEvent, seriesId: string, episodeId: string) => {
    e.stopPropagation();
    
    const updated = continueWatchingList.filter(
      item => !(item.seriesId === seriesId && item.episodeId === episodeId)
    );
    setContinueWatchingList(updated);

    const videoCw = updated.filter(item => item.mediaType === 'video');
    const audioCw = updated.filter(item => item.mediaType === 'audio');

    localStorage.setItem("ott_continue_watching", JSON.stringify(videoCw.map(({ mediaType, ...rest }) => rest)));
    localStorage.setItem("continueListening", JSON.stringify(audioCw.map(({ mediaType, ...rest }) => rest)));
  };

  // Tab filter logic
  const filteredSessions = useMemo(() => {
    if (activeTab === 'Series') return sessions.filter(s => s.type === 'Series');
    if (activeTab === 'Films') return sessions.filter(s => s.type === 'Film');
    if (activeTab === 'New & Popular') {
      return [...sessions].sort((a, b) => parseInt(b.match) - parseInt(a.match));
    }
    return sessions;
  }, [sessions, activeTab]);

  // Featured Banner Pick
  const featured = useMemo(() => {
    return filteredSessions.find(s => s.isOriginal) || filteredSessions[0] || sessions[0];
  }, [sessions, filteredSessions]);

  // Search filter logic
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return sessions.filter(s => 
      s.title.toLowerCase().includes(query) ||
      s.category.toLowerCase().includes(query) ||
      s.tags.some(t => t.toLowerCase().includes(query)) ||
      s.mood.some(m => m.toLowerCase().includes(query))
    );
  }, [sessions, searchQuery]);

  // Dynamic lists
  const originals = useMemo(() => sessions.filter(s => s.isOriginal), [sessions]);
  const trending = useMemo(() => [...filteredSessions].sort((a, b) => parseInt(b.match) - parseInt(a.match)).slice(0, 6), [filteredSessions]);
  const meditationSessions = useMemo(() => filteredSessions.filter(s => s.category === "Meditation"), [filteredSessions]);
  const sleepSessions = useMemo(() => filteredSessions.filter(s => s.category === "Sleep Stories"), [filteredSessions]);
  const anxietySessions = useMemo(() => filteredSessions.filter(s => s.category === "Anxiety Relief"), [filteredSessions]);
  const recommended = useMemo(() => [...filteredSessions].reverse().slice(0, 6), [filteredSessions]);

  const navItems = ['Home', 'Series', 'Films', 'New & Popular'];
  const notifications = [
    { id: 1, text: "New Episode added to anxiety relief series", time: "2h ago", icon: <Bell className="w-4 h-4 text-[#2ed899]" /> },
    { id: 2, text: "Welcome to our premium wellness OTT platform!", time: "5h ago", icon: <Sparkles className="w-4 h-4 text-[#2ed899]" /> },
    { id: 3, text: "Pick up right where you left off on Focus Flow", time: "1d ago", icon: <PlayCircle className="w-4 h-4 text-[#2ed899]" /> },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-[#1a5d47] selection:text-white pb-24 relative">
      
      {/* Netflix-Style Glassmorphic Header */}
      <header className={`fixed top-0 left-0 w-full z-[9999] pointer-events-auto py-5 px-6 md:px-12 lg:px-16 flex justify-between items-center transition-all duration-500 ${
        scrolled ? 'bg-[#050505]/95 backdrop-blur-md border-b border-white/5 shadow-2xl' : 'bg-gradient-to-b from-[#050505] via-[#050505]/60 to-transparent'
      }`}>
        <div className="flex items-center gap-8">
          {/* Back to Dashboard */}
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-2 group text-white/80 hover:text-[#2ed899] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            <span className="hidden md:inline font-bold text-xs tracking-widest uppercase">Dashboard</span>
          </button>
          
          {/* Nirvaha Title Brand */}
          <h1 
            className="text-2xl md:text-3xl font-extrabold tracking-[0.2em] text-[#2ed899] cursor-pointer hover:opacity-90 transition-opacity" 
            onClick={() => { setActiveTab('Home'); navigate('/wellness-ott'); }} 
            style={{ fontFamily: "'Cinzel', serif", textShadow: '0 0 15px rgba(46,216,153,0.3)' }}
          >
            NIRVAHA
          </h1>
          
          {/* Navigation Links */}
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
        
        {/* Right Nav Options */}
        <div className="flex items-center gap-5 md:gap-7 relative z-50">
          {/* Search Trigger */}
          <button 
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="relative flex items-center p-1.5 focus:outline-none hover:scale-110 transition-transform cursor-pointer bg-transparent border-none"
          >
            <Search className="w-5 h-5 text-white/80 hover:text-[#2ed899] hover:drop-shadow-[0_0_8px_rgba(46,216,153,0.8)] transition-colors" />
          </button>
          
          {/* Notifications Dropdown Trigger */}
          <button 
            type="button"
            onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}
            className="relative p-1.5 focus:outline-none hover:scale-110 transition-transform cursor-pointer bg-transparent border-none"
          >
            <Bell className={`w-5 h-5 ${isNotificationsOpen ? 'text-[#2ed899]' : 'text-white/80 hover:text-white'} transition-colors`} />
            <div className="absolute top-1 right-1 w-2 h-2 bg-[#2ed899] rounded-full border border-[#050505] shadow-[0_0_6px_rgba(46,216,153,0.8)] animate-pulse" />
          </button>

          {/* Profile Dropdown Trigger */}
          <button 
            type="button"
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }}
            className={`w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1a5d47] to-[#2ed899]/50 flex items-center justify-center overflow-hidden border transition-all cursor-pointer ${
              isProfileOpen ? 'border-[#2ed899] shadow-[0_0_15px_rgba(46,216,153,0.4)] scale-95' : 'border-white/10 hover:border-[#2ed899]/45'
            }`}
          >
            <User className="w-5 h-5 text-white" />
          </button>
          
          {/* Notifications Panel Modal */}
          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute top-14 right-12 w-80 bg-[#070809]/95 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.95)] z-50 p-2 text-left"
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
 
          {/* Profile Dropdown Modal */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute top-14 right-0 w-64 bg-[#070809]/95 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.9)] z-50 p-2 text-left"
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
      </header>

      {/* Fullscreen overlay glassmorphic search panel */}
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
                          <span className="text-[9px] uppercase font-black tracking-widest text-[#2ed899] bg-[#2ed899]/15 px-2 py-0.5 rounded border border-[#2ed899]/20">{item.category}</span>
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
                      <p className="text-white/60 text-xl font-medium">No sessions found matching "{searchQuery}"</p>
                      <p className="text-white/40 mt-2 text-sm font-semibold">Try searching for "Sleep", "Meditation", or "Anxiety"</p>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Massive Cinematic Hero Banner with Autoplay */}
      <HeroBanner series={featured} />

      {/* Main Content Rows */}
      <div className="relative z-10 -mt-20 lg:-mt-32 pt-16 lg:pt-24 space-y-8 md:space-y-12">
        
        {/* Continue Watching Section */}
        {continueWatchingList.length > 0 && (
          <div className="relative z-20 mb-10 md:mb-14 px-6 md:px-12 lg:px-16">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 tracking-wide text-white/90 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#2ed899]" />
              Continue Watching
            </h3>
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x hide-scrollbar">
              {continueWatchingList.map((item, idx) => (
                <motion.div
                  key={`cw-${item.seriesId}-${item.episodeId}`}
                  onClick={() => {
                    navigate(`/wellness-ott/player/${item.seriesId}/${item.episodeId}`);
                  }}
                  className="group relative flex-none w-[260px] md:w-[320px] aspect-video rounded-xl overflow-hidden cursor-pointer bg-[#0c0c0c] border border-white/5 shadow-2xl snap-start transition-all hover:border-[#2ed899]/30"
                >
                  <img 
                    src={item.thumbnail} 
                    alt={item.episodeTitle} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" 
                  />
                  
                  {/* Bottom Progress Bar */}
                  <div className="absolute bottom-0 left-0 w-full h-[5px] bg-white/20 z-20">
                    <div 
                      className="h-full bg-gradient-to-r from-[#1a5d47] to-[#2ed899]" 
                      style={{ width: `${item.progress}%` }} 
                    />
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={(e) => handleClearContinueWatching(e, item.seriesId, item.episodeId)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/50 hover:text-rose-400 hover:bg-black/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-30"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Content Details */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-4 z-10">
                    <span className="text-[9px] text-[#2ed899] font-black uppercase tracking-widest">
                      {item.seriesTitle}
                    </span>
                    <h4 className="font-extrabold text-white text-sm mt-0.5 leading-tight truncate">
                      {item.episodeTitle}
                    </h4>
                    <span className="text-[9px] text-white/50 font-bold mt-1 uppercase tracking-wider">
                      {item.mediaType === 'audio' ? 'Audio Session' : 'Video Session'} • {100 - Math.round(item.progress)}% remaining
                    </span>
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

        {/* Horizontal Rows */}
        <div className="relative space-y-6 md:space-y-10">
          {/* Nirvaha Originals (aspect 2/3 portrait layout) */}
          <SessionRow title="Nirvaha Originals" sessions={originals} isOriginals={true} />

          {/* Landscape standard category rows */}
          <SessionRow title="Trending Wellness Series" sessions={trending} />
          <SessionRow title="Meditation & Mindfulness" sessions={meditationSessions} />
          <SessionRow title="Sleep & Rest Stories" sessions={sleepSessions} />
          <SessionRow title="Anxiety Recovery Programs" sessions={anxietySessions} />
          <SessionRow title="Recommended For You" sessions={recommended} />
        </div>
      </div>

      {/* Subtle background radial ambient glow */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-[#1a5d47]/5 via-transparent to-black z-0" />

      {/* Hide Scrollbars CSS */}
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
