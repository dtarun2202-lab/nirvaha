import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Volume2,
  Plus,
  CheckCircle,
  Share2,
  Clock,
  Sparkles,
  Library,
  Play,
} from 'lucide-react';
import { WellnessSession } from '../data/wellnessSessions';
import { useWellnessOTT } from '../contexts/WellnessOTTContext';

interface ContinueWatchingItem {
  seriesId: string;
  episodeId: string;
  progress: number;
  timestamp: number;
  seriesTitle: string;
  episodeTitle: string;
  thumbnail: string;
}

export default function SeriesDetailsPage() {
  const { sessions: wellnessSessions } = useWellnessOTT();
  const { seriesId } = useParams<{ seriesId: string }>();
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [expandedEpisode, setExpandedEpisode] = useState<string | null>(null);

  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [continueWatchingList, setContinueWatchingList] = useState<ContinueWatchingItem[]>([]);
  const [continueListeningList, setContinueListeningList] = useState<ContinueWatchingItem[]>([]);
  const [bgImage, setBgImage] = useState<string>('');

  const series = useMemo(() => {
    return wellnessSessions.find(s => {
      const slug = s.title.toLowerCase().replace(/ /g, '-');
      return s.id === seriesId || slug === seriesId;
    });
  }, [seriesId, wellnessSessions]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!series) return;

    setBgImage(series.banner || series.thumbnail);

    // Retrieve saved list status
    const savedSessions = JSON.parse(localStorage.getItem('savedOTTSessions') || '[]');
    setIsSaved(savedSessions.some((s: any) => s.id === series.id));

    // Load continue watching list for progress rendering
    const cwData = localStorage.getItem("ott_continue_watching");
    if (cwData) {
      try {
        setContinueWatchingList(JSON.parse(cwData));
      } catch (e) {
        console.error(e);
      }
    }

    // Load continue listening list for audio progress rendering
    const clData = localStorage.getItem("continueListening");
    if (clData) {
      try {
        setContinueListeningList(JSON.parse(clData));
      } catch (e) {
        console.error(e);
      }
    }
  }, [series, seriesId]);

  const displayRecommended = useMemo(() => {
    if (!series) return [];
    const recommended = wellnessSessions.filter(v => v.id !== series.id);
    const matchCategory = recommended.filter(v => v.category === series.category);
    return matchCategory.length > 0 ? matchCategory : recommended.slice(0, 4);
  }, [series, wellnessSessions]);

  if (!series) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-16 w-16 bg-[#2ed899]/20 rounded-full border border-[#2ed899]/40 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#2ed899]" />
          </div>
          <span className="text-white/60 text-sm tracking-widest uppercase font-bold">Loading Sanctuary...</span>
        </div>
      </div>
    );
  }

  const hasSeasons = series.seasons && series.seasons.length > 0;
  const currentSeason = hasSeasons ? series.seasons![selectedSeason] : null;
  const episodes = currentSeason?.episodes || [];

  const handleWatchLater = () => {
    const savedSessions = JSON.parse(localStorage.getItem('savedOTTSessions') || '[]');
    if (!isSaved) {
      savedSessions.push(series);
      localStorage.setItem('savedOTTSessions', JSON.stringify(savedSessions));
      setIsSaved(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } else {
      const newSessions = savedSessions.filter((s: any) => s.id !== series.id);
      localStorage.setItem('savedOTTSessions', JSON.stringify(newSessions));
      setIsSaved(false);
    }
  };

  const handlePlayMainSession = () => {
    const sSlug = series.title.toLowerCase().replace(/ /g, '-');
    if (series.type === 'Film') {
      navigate(`/wellness-ott/player/${sSlug}/film`);
    } else if (episodes.length > 0) {
      navigate(`/wellness-ott/player/${sSlug}/episode-${episodes[0].id}`);
    }
  };

  const getEpisodeProgress = (episodeId: string) => {
    const videoItem = continueWatchingList.find(
      item => item.seriesId === series.id && item.episodeId === episodeId
    );
    if (videoItem) return { progress: videoItem.progress, mode: 'video' };

    const audioItem = continueListeningList.find(
      item => item.seriesId === series.id && item.episodeId === episodeId
    );
    if (audioItem) return { progress: audioItem.progress, mode: 'audio' };

    return null;
  };

  return (
    <div className="min-h-screen bg-black/60 overflow-x-hidden relative text-white font-sans selection:bg-[#1a5d47] selection:text-white pb-24">
      {/* Full-screen fixed blurred cinematic background */}
      <div className="fixed inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <img
          src={bgImage}
          alt=""
          className="w-full h-full object-cover blur-3xl opacity-45 scale-110 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black/98" />
      </div>

      {/* Background Hero Banner */}
      <div className="absolute top-0 left-0 w-full h-[85vh] min-h-[600px] z-0 overflow-hidden">
        <img
          src={series.banner || series.thumbnail}
          alt={series.title}
          className="w-full h-full object-cover"
        />
        {/* Dark cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black z-5" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-5" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1a5d47]/20 to-transparent z-5 mix-blend-screen pointer-events-none" />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto w-full">
        {/* Navigation Action Bar */}
        <motion.div
          className="sticky top-0 z-40 flex items-center justify-between p-6 md:p-10 bg-gradient-to-b from-black/90 via-black/50 to-transparent backdrop-blur-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={() => navigate('/wellness-ott')}
            className="flex items-center gap-2 text-white/80 hover:text-[#2ed899] transition-all group"
          >
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1.5 transition-transform" />
            <span className="font-extrabold tracking-widest text-xs uppercase">Back to Browse</span>
          </button>
          
          <button 
            onClick={() => navigate('/wellness-ott/library')}
            className="flex items-center gap-2 text-white/80 hover:text-[#2ed899] transition-all group bg-black/60 backdrop-blur-md border border-white/10 hover:border-[#2ed899]/50 px-5 py-2 rounded-xl shadow-xl"
          >
            <Library className="w-4 h-4 text-[#2ed899]" />
            <span className="font-bold tracking-widest text-xs uppercase">My List</span>
          </button>
        </motion.div>

        {/* Hero Section details */}
        <motion.div
          className="px-6 md:px-16 lg:px-24 pt-16 md:pt-24 pb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="max-w-3xl">
            {/* Badge & Title */}
            <div className="flex items-center gap-2 mb-4">
              {series.isOriginal && (
                <span className="inline-flex items-center gap-2 bg-[#2ed899]/15 border border-[#2ed899]/35 rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest uppercase text-[#2ed899] shadow-[0_0_15px_rgba(46,216,153,0.15)]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Nirvaha Original
                </span>
              )}
              <span className="text-sm font-bold text-[#2ed899] bg-[#2ed899]/10 px-2.5 py-0.5 rounded border border-[#2ed899]/20 uppercase tracking-wide">
                {series.category}
              </span>
            </div>

            <h2 
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-5 leading-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {series.title}
            </h2>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm font-semibold text-white/80">
              <span className="text-[#2ed899] font-black">{series.match}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/60">{series.year}</span>
              <span className="text-white/40">•</span>
              <span className="border border-white/30 px-2 py-0.5 rounded text-[10px] font-black bg-white/5">{series.rating}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/60">{series.duration}</span>
              {hasSeasons && (
                <>
                  <span className="text-white/40">•</span>
                  <span className="text-white/60">
                    {series.seasons!.length}{' '}
                    {series.seasons!.length === 1 ? 'Season' : 'Seasons'}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-base md:text-lg text-white/70 font-medium leading-relaxed mb-8 max-w-2xl drop-shadow-md">
              {series.description}
            </p>

            {/* Mood Tags */}
            {series.mood && series.mood.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {series.mood.map(tag => (
                  <span
                    key={tag}
                    className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <button
                onClick={handlePlayMainSession}
                className="flex items-center justify-center gap-3 px-8 py-3.5 bg-[#2ed899] hover:bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(46,216,153,0.3)] hover:scale-105"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Play Session</span>
              </button>

              <button
                onClick={handleWatchLater}
                className={`flex items-center justify-center gap-3 px-8 py-3.5 border rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105 ${
                  isSaved
                    ? 'bg-[#1a5d47]/20 border-[#2ed899]/40 text-[#2ed899] shadow-[0_0_15px_rgba(46,216,153,0.2)]'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                {isSaved ? <CheckCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                <span>{isSaved ? 'Saved to List' : 'Add to List'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Interactive episodes section */}
        {hasSeasons && episodes.length > 0 && (
          <motion.div
            className="px-6 md:px-16 lg:px-24 py-12 bg-gradient-to-b from-transparent to-black"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Season Selector */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-5 gap-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-wide text-white">Episodes</h3>
                <p className="text-white/40 text-sm mt-1 font-semibold">Select difficulty level and watch your wellness sessions sequentially.</p>
              </div>

              {series.seasons!.length > 1 && (
                <div className="flex gap-2.5 p-1 bg-white/5 rounded-2xl border border-white/10">
                  {series.seasons!.map((season, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSeason(idx)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        selectedSeason === idx
                          ? 'bg-[#2ed899] text-black shadow-[0_0_15px_rgba(46,216,153,0.3)]'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Season {season.seasonNumber} ({season.level})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Episodes List Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {episodes.map((episode, idx) => {
                const progressInfo = getEpisodeProgress(episode.id);

                return (
                  <motion.div
                    key={episode.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="group"
                  >
                    <div
                      onClick={() => setExpandedEpisode(
                        expandedEpisode === episode.id ? null : episode.id
                      )}
                      onMouseEnter={() => setBgImage(episode.thumbnail)}
                      onMouseLeave={() => setBgImage(series.banner || series.thumbnail)}
                      className="w-full flex gap-4 md:gap-6 p-4 md:p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 hover:border-[#2ed899]/30 text-left cursor-pointer"
                    >
                      {/* Thumbnail with progress bar */}
                      <div className="relative flex-shrink-0 w-28 md:w-36 aspect-video rounded-xl overflow-hidden border border-white/10">
                        <img
                          src={episode.thumbnail}
                          alt={episode.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Custom Play overlay on hover */}
                        {/* Custom Play overlay on hover */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="w-9 h-9 bg-[#2ed899] rounded-full flex items-center justify-center shadow-lg">
                            <Play className="w-4 h-4 text-black fill-current" />
                          </div>
                        </div>
                        {/* Progress Bar */}
                        {progressInfo && progressInfo.progress > 0 && (
                          <div className="absolute bottom-0 left-0 w-full h-[4px] bg-white/20">
                            <div
                              className="h-full bg-gradient-to-r from-[#1a5d47] to-[#2ed899]"
                              style={{ width: `${progressInfo.progress}%` }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-black text-[#2ed899]">
                              Episode {idx + 1}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-white/50">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{episode.duration}</span>
                            </div>
                          </div>
                          <h4 className="text-base md:text-lg font-black text-white group-hover:text-[#2ed899] transition-colors truncate">
                            {episode.title}
                          </h4>
                          <p className="text-xs text-white/50 line-clamp-2 mt-1 leading-relaxed">
                            {episode.description}
                          </p>
                        </div>

                        {progressInfo && progressInfo.progress > 0 && (
                          <span className="text-[9px] text-[#2ed899] mt-2 font-bold uppercase tracking-wider block">
                            Listening Progress: {Math.round(progressInfo.progress)}%
                          </span>
                        )}
                      </div>

                      {/* Single Play Action Button */}
                      <div className="flex-shrink-0 flex items-center justify-center self-center z-10">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            const sSlug = series.title.toLowerCase().replace(/ /g, '-');
                            navigate(`/wellness-ott/player/${sSlug}/episode-${episode.id}`);
                          }}
                          className="p-3.5 bg-[#2ed899] hover:bg-white text-black rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(46,216,153,0.4)]"
                          title="Play Session"
                        >
                          <Play className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Drawer */}
                    <AnimatePresence>
                      {expandedEpisode === episode.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 bg-white/5 border border-white/10 border-t-0 rounded-b-2xl ml-4 mr-4">
                            <h5 className="font-black text-xs uppercase tracking-wider text-white/50 mb-2">
                              About this episode
                            </h5>
                            <p className="text-sm text-white/80 leading-relaxed">
                              {episode.description}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* More Like This Recommended Grid */}
            {displayRecommended.length > 0 && (
              <div className="mt-20 md:mt-24">
                <h3 className="text-xl md:text-2xl font-black mb-8 tracking-wide flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#2ed899]" />
                  More Like This
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {displayRecommended.map((rec) => (
                    <motion.div
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
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-4 z-10">
                        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <span className="text-[9px] uppercase font-black tracking-widest text-[#2ed899] bg-[#2ed899]/15 px-2 py-0.5 rounded border border-[#2ed899]/20">{rec.category}</span>
                          <h4 className="font-extrabold text-sm text-white mt-1.5 leading-snug truncate">{rec.title}</h4>
                          <div className="text-[10px] text-white/50 font-bold mt-0.5">{rec.duration}</div>
                        </div>
                      </div>
                      <div className="absolute inset-0 border-[2px] border-transparent group-hover:border-[#2ed899]/30 transition-colors duration-300 rounded-xl pointer-events-none" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
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
              <CheckCircle className="w-4 h-4 text-[#2ed899]" />
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
    </div>
  );
}
