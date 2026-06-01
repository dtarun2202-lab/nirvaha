import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Plus, ArrowLeft, Info, X, Check, Library, Sparkles, AlertCircle, Tv, Calendar, Tag } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { wellnessSessions as videos, WellnessSession, Episode, Season } from '../data/wellnessSessions';

interface ContinueWatchingItem {
    seriesId: string;
    episodeId: string;
    progress: number;
    timestamp: number;
    seriesTitle: string;
    episodeTitle: string;
    thumbnail: string;
}

export default function WellnessOTTDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [isSaved, setIsSaved] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [activeSeasonNum, setActiveSeasonNum] = useState<number>(1);
    const [continueWatchingList, setContinueWatchingList] = useState<ContinueWatchingItem[]>([]);

    // Scroll to top and load saved status + progress records
    useEffect(() => {
        window.scrollTo(0, 0);
        const savedSessions = JSON.parse(localStorage.getItem('savedOTTSessions') || '[]');
        setIsSaved(savedSessions.some((s: any) => s.id === id));

        // Load continue watching list for progress rendering
        const cwData = localStorage.getItem("ott_continue_watching");
        if (cwData) {
            try {
                setContinueWatchingList(JSON.parse(cwData));
            } catch (e) {
                console.error(e);
            }
        }
    }, [id]);

    const session = useMemo(() => {
        return videos.find(v => v.id === id) || videos[0];
    }, [id]);

    // Active season structure
    const activeSeason = useMemo(() => {
        if (!session.seasons || session.seasons.length === 0) return null;
        return session.seasons.find(s => s.seasonNumber === activeSeasonNum) || session.seasons[0];
    }, [session, activeSeasonNum]);

    // Default to the first season on session change
    useEffect(() => {
        if (session.seasons && session.seasons.length > 0) {
            setActiveSeasonNum(session.seasons[0].seasonNumber);
        }
    }, [session]);

    // Dynamic 'More Like This' logic
    const displayRecommended = useMemo(() => {
        const recommended = videos.filter(v => v.id !== session.id);
        const matchCategory = recommended.filter(v => v.category === session.category);
        return matchCategory.length > 0 ? matchCategory : recommended.slice(0, 6);
    }, [session]);

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

    // Helper to get continue watching progress for a specific episode
    const getEpisodeProgress = (episodeId: string) => {
        const cwItem = continueWatchingList.find(
            item => item.seriesId === session.id && item.episodeId === episodeId
        );
        return cwItem ? cwItem.progress : 0;
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-[#1a5d47] selection:text-white pb-24">
            
            {/* Header / Back Action Bar */}
            <div className="fixed top-0 left-0 w-full p-6 md:p-10 z-[100] bg-gradient-to-b from-[#050505]/95 via-[#050505]/60 to-transparent pointer-events-none flex justify-between items-center">
                <button 
                    onClick={() => navigate('/wellness-ott')}
                    className="flex items-center gap-2 text-white/80 hover:text-[#2ed899] transition-all group pointer-events-auto"
                >
                    <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1.5 transition-transform" />
                    <span className="font-extrabold tracking-widest text-xs uppercase">Back to Browse</span>
                </button>
                
                <button 
                    onClick={() => navigate('/wellness-ott/library')}
                    className="flex items-center gap-2 text-white/80 hover:text-[#2ed899] transition-all group pointer-events-auto bg-[#070809]/80 backdrop-blur-xl border border-white/10 hover:border-[#2ed899]/50 px-5 py-2.5 rounded-2xl shadow-xl"
                >
                    <Library className="w-4 h-4 text-[#2ed899]" />
                    <span className="font-bold tracking-widest text-xs uppercase hidden sm:block">My List</span>
                </button>
            </div>

            {/* Immersive Cinematic Split-Grid Hero Section */}
            <div className="relative h-[85vh] min-h-[600px] w-full flex items-end">
                {/* Hero Background Image with glowing ambient filters */}
                <motion.div 
                    initial={{ scale: 1.05, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    <img 
                        src={session.banner || session.thumbnail} 
                        alt={session.title} 
                        className="w-full h-full object-cover object-center"
                    />
                </motion.div>

                {/* Dense High-End Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent z-10" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#050505]/40 to-[#050505] z-10" />
                
                {/* Emerald Ambient Lighting */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1a5d47]/20 to-transparent z-10 mix-blend-screen pointer-events-none" />

                {/* Hero Details Grid */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-16 lg:p-24 max-w-[1440px] mx-auto w-full">
                    <motion.div 
                        initial={{ y: 35, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="max-w-3xl"
                    >
                        {/* Netflix-style badges */}
                        <div className="flex items-center gap-3.5 text-xs md:text-sm font-semibold mb-4 text-white/80">
                            {session.isOriginal && (
                                <span className="bg-[#2ed899]/15 text-[#2ed899] text-[10px] font-black px-2 py-0.5 rounded border border-[#2ed899]/30 uppercase tracking-widest shadow-[0_0_10px_rgba(46,216,153,0.2)]">
                                    Original
                                </span>
                            )}
                            <span className="text-[#2ed899] font-black">{session.match}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {session.year}</span>
                            <span className="border border-white/30 px-2 py-0.5 rounded text-[10px] font-black bg-white/5">{session.rating}</span>
                            <span>{session.duration}</span>
                        </div>

                        <h1 
                            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-5 leading-none text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            {session.title}
                        </h1>

                        <p className="text-base md:text-lg text-white/70 font-medium leading-relaxed mb-8 max-w-2xl drop-shadow-md">
                            {session.description}
                        </p>

                        {/* Action Triggers */}
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <button 
                                onClick={() => {
                                    const sSlug = session.title.toLowerCase().replace(/ /g, '-');
                                    if (session.seasons && session.seasons.length > 0) {
                                        const firstEp = session.seasons[0].episodes[0];
                                        navigate(`/watch/${sSlug}/episode-${firstEp.id}`);
                                    } else {
                                        // Film format triggers standard player
                                        navigate(`/watch/${sSlug}/film`);
                                    }
                                }}
                                className="flex items-center gap-3 bg-[#2ed899] text-black px-8 py-3.5 md:py-4 rounded-xl font-extrabold text-sm uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(46,216,153,0.3)] hover:shadow-2xl"
                            >
                                <Play className="w-5 h-5 fill-black ml-0.5" /> 
                                {session.type === 'Series' ? 'Play Episode 1' : 'Play Full Film'}
                            </button>
                            
                            <button 
                                onClick={handleWatchLater}
                                className={`flex items-center gap-3 backdrop-blur-md border px-8 py-3.5 md:py-4 rounded-xl font-extrabold text-sm uppercase tracking-widest transition-all ${
                                    isSaved 
                                        ? 'bg-[#1a5d47]/20 border-[#2ed899]/40 text-[#2ed899] shadow-[0_0_15px_rgba(46,216,153,0.2)] hover:bg-[#1a5d47]/35' 
                                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                }`}
                            >
                                {isSaved ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                {isSaved ? "Saved to List" : "Add to List"}
                            </button>
                        </div>

                        {/* Category & Tags */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white/40 text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Category & Tags:</span>
                            <span className="text-sm font-bold text-[#2ed899] bg-[#2ed899]/10 px-2.5 py-0.5 rounded border border-[#2ed899]/20">{session.category}</span>
                            {session.tags.map((tag, idx) => (
                                <span key={idx} className="text-sm font-semibold text-white/60 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full hover:text-white transition-colors cursor-pointer">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Interactive Details / Episode Listing Section */}
            <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 py-12 relative z-20 bg-gradient-to-b from-transparent to-[#050505]">
                
                {session.type === 'Series' && session.seasons && session.seasons.length > 0 ? (
                    <div>
                        {/* Seasons Selector / Switcher */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-5 gap-6">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-extrabold tracking-wide text-white">Episodes</h3>
                                <p className="text-white/40 text-sm mt-1 font-semibold">Select difficulty level and watch your wellness sessions sequentially.</p>
                            </div>
                            
                            {/* Season tab selection pills */}
                            <div className="flex gap-2.5 p-1 bg-white/5 rounded-2xl border border-white/10">
                                {session.seasons.map(szn => (
                                    <button
                                        key={szn.seasonNumber}
                                        onClick={() => setActiveSeasonNum(szn.seasonNumber)}
                                        className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                            activeSeasonNum === szn.seasonNumber
                                                ? 'bg-[#2ed899] text-black shadow-[0_0_15px_rgba(46,216,153,0.3)]'
                                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        Season {szn.seasonNumber} ({szn.level})
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Episodes Grid Card Layout */}
                        {activeSeason && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AnimatePresence mode="wait">
                                    {activeSeason.episodes.map((episode, idx) => {
                                        const progress = getEpisodeProgress(episode.id);

                                        return (
                                            <motion.div
                                                key={episode.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                                onClick={() => {
                                                    const sSlug = session.title.toLowerCase().replace(/ /g, '-');
                                                    navigate(`/watch/${sSlug}/episode-${episode.id}`);
                                                }}
                                                className="group relative bg-[#0c0c0c] border border-white/5 hover:border-[#2ed899]/30 rounded-2xl p-4 flex gap-4 cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(46,216,153,0.1)] hover:-translate-y-1"
                                            >
                                                {/* Left Episode Thumbnail */}
                                                <div className="relative w-[130px] md:w-[170px] aspect-video rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                                                    <img 
                                                        src={episode.thumbnail} 
                                                        alt={episode.title} 
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    
                                                    {/* Custom Play Button Overlay */}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                        <div className="w-9 h-9 bg-[#2ed899] rounded-full flex items-center justify-center shadow-lg">
                                                            <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                                                        </div>
                                                    </div>

                                                    {/* Progress bar overlay if playing */}
                                                    {progress > 0 && (
                                                        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-white/20">
                                                            <div 
                                                                className="h-full bg-gradient-to-r from-[#1a5d47] to-[#2ed899]" 
                                                                style={{ width: `${progress}%` }} 
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Right Episode description */}
                                                <div className="flex flex-col flex-1 justify-center min-w-0">
                                                    <div className="flex items-center justify-between mb-1.5 gap-2">
                                                        <h4 className="font-extrabold text-sm md:text-base text-white group-hover:text-[#2ed899] transition-colors truncate">
                                                            {idx + 1}. {episode.title}
                                                        </h4>
                                                        <span className="text-[10px] md:text-xs font-extrabold text-[#2ed899] bg-[#2ed899]/10 px-2 py-0.5 rounded flex-shrink-0">
                                                            {episode.duration}
                                                        </span>
                                                    </div>
                                                    
                                                    <p className="text-[11px] md:text-xs text-white/50 line-clamp-2 leading-relaxed">
                                                        {episode.description}
                                                    </p>

                                                    {progress > 0 && (
                                                        <span className="text-[9px] text-white/40 mt-2 font-bold uppercase tracking-wider">
                                                            Played: {Math.round(progress)}%
                                                        </span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                ) : (
                    // Film Format Details
                    <div className="border border-white/5 rounded-3xl p-6 md:p-10 bg-[#0c0c0c] flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        <div className="relative w-full md:w-[360px] aspect-video rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 group cursor-pointer"
                             onClick={() => {
                                 const sSlug = session.title.toLowerCase().replace(/ /g, '-');
                                 navigate(`/watch/${sSlug}/film`);
                             }}>
                            <img src={session.thumbnail} alt={session.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <div className="w-14 h-14 bg-[#2ed899] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(46,216,153,0.5)] transform scale-90 group-hover:scale-100 transition-transform">
                                    <Play className="w-6 h-6 text-black fill-black ml-0.5" />
                                </div>
                            </div>
                        </div>

                        <div className="flex-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#2ed899] bg-[#2ed899]/10 px-3 py-1 rounded border border-[#2ed899]/20">Featured Film</span>
                            <h3 className="text-2xl md:text-3xl font-extrabold mt-3.5 mb-2.5 text-white">{session.title}</h3>
                            <p className="text-white/60 text-sm md:text-base leading-relaxed mb-6 font-medium">{session.description}</p>
                            
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => {
                                        const sSlug = session.title.toLowerCase().replace(/ /g, '-');
                                        navigate(`/watch/${sSlug}/film`);
                                    }}
                                    className="bg-white hover:bg-[#2ed899] text-black px-6 py-3 rounded-xl font-extrabold text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
                                >
                                    <Play className="w-4 h-4 fill-black" /> Play Film
                                </button>
                                <button 
                                    onClick={handleWatchLater}
                                    className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3 rounded-xl font-extrabold text-xs uppercase tracking-widest transition-colors"
                                >
                                    {isSaved ? "Saved to List" : "Add to List"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* More Like This (Related spiritual Originals) */}
                <div className="mt-16 md:mt-24">
                    <h3 className="text-xl md:text-2xl font-bold mb-6 tracking-wide flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#2ed899]" />
                        More Like This
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {displayRecommended.map((rec, idx) => (
                            <motion.div
                                layout
                                key={rec.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => navigate(`/wellness-ott/series/${rec.id}`)}
                                className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer bg-[#0c0c0c] border border-white/5 hover:border-[#2ed899]/30 transition-all duration-300 hover:shadow-[0_0_25px_rgba(46,216,153,0.1)]"
                            >
                                <img 
                                    src={rec.thumbnail} 
                                    alt={rec.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent flex flex-col justify-end p-4 z-10">
                                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <span className="text-[9px] uppercase font-black tracking-widest text-[#2ed899] bg-[#2ed899]/10 px-2 py-0.5 rounded border border-[#2ed899]/20">{rec.category}</span>
                                        <h4 className="font-extrabold text-sm text-white mt-1.5 leading-snug truncate">{rec.title}</h4>
                                        <div className="text-[10px] text-white/50 font-bold mt-0.5">{rec.duration}</div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 border-[2px] border-transparent group-hover:border-[#2ed899]/30 transition-colors duration-300 rounded-xl pointer-events-none" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Premium Saved Toast Overlay */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[120] flex items-center gap-3 bg-[#070809]/95 backdrop-blur-2xl border border-[#2ed899]/30 px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(46,216,153,0.15)]"
                    >
                        <div className="w-8 h-8 rounded-full bg-[#1a5d47]/30 flex items-center justify-center border border-[#2ed899]/50">
                            <Check className="w-4 h-4 text-[#2ed899]" />
                        </div>
                        <span className="text-xs md:text-sm font-bold tracking-wider text-white">SUCCESSFULLY SAVED TO YOUR LIST</span>
                        <button 
                            onClick={() => navigate('/wellness-ott/library')}
                            className="ml-2 text-xs font-black uppercase text-[#2ed899] hover:text-white underline underline-offset-2 transition-colors"
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
