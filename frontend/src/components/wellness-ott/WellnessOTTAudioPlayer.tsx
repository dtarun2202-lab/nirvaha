import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  X,
  Heart,
  Repeat,
  Repeat2,
  ChevronDown,
  BookOpen,
} from 'lucide-react';
import { useWellnessOTT } from '../../contexts/WellnessOTTContext';

interface ContinueListeningItem {
  seriesId: string;
  episodeId: string;
  progress: number;
  timestamp: number;
  seriesTitle: string;
  episodeTitle: string;
  thumbnail: string;
}

export default function WellnessOTTAudioPlayer() {
  const { sessions: wellnessSessions } = useWellnessOTT();
  const { seriesId, episodeId } = useParams<{
    seriesId: string;
    episodeId: string;
  }>();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);

  // States
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [isFavorited, setIsFavorited] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [nextEpisodeCountdown, setNextEpisodeCountdown] = useState(0);
  const [showNextEpisodeOverlay, setShowNextEpisodeOverlay] = useState(false);
  const [showUpNextPopUp, setShowUpNextPopUp] = useState(false);

  const isFadingOutRef = useRef(false);
  const isFadingInRef = useRef(false);

  // Slug-friendly Series Lookup: match ID or slugified title (e.g., 'morning-calm')
  const series = useMemo(() => {
    return wellnessSessions.find(v => {
      const slug = v.title.toLowerCase().replace(/ /g, '-');
      return v.id === seriesId || slug === seriesId;
    }) || wellnessSessions[0];
  }, [seriesId, wellnessSessions]);

  const currentEpisode = useMemo(() => {
    if (series.type === 'Film' || episodeId === 'film') {
      return {
        id: 'film',
        title: series.title,
        duration: series.duration,
        thumbnail: series.thumbnail,
        description: series.description,
        videoUrl: series.audioSource || '/audio/meditation/Indoor-Calm-Meditation.mp3',
      };
    }
    if (!series.seasons || !episodeId) return null;
    const normalizedEpId = episodeId.replace('episode-', '');
    for (const season of series.seasons) {
      const episode = season.episodes.find(e => e.id === normalizedEpId || e.id === episodeId);
      if (episode) return episode;
    }
    return series.seasons[0]?.episodes[0] || null;
  }, [series, episodeId]);

  const nextEpisode = useMemo(() => {
    if (!series.seasons || !currentEpisode || currentEpisode.id === 'film') return null;

    let foundCurrent = false;
    for (const season of series.seasons) {
      for (const episode of season.episodes) {
        if (foundCurrent) return episode;
        if (episode.id === currentEpisode.id) {
          foundCurrent = true;
        }
      }
    }
    return null;
  }, [series, currentEpisode]);

  const previousEpisode = useMemo(() => {
    if (!series.seasons || !currentEpisode || currentEpisode.id === 'film') return null;

    let prev = null;
    for (const season of series.seasons) {
      for (const episode of season.episodes) {
        if (episode.id === currentEpisode.id) {
          return prev;
        }
        prev = episode;
      }
    }
    return null;
  }, [series, currentEpisode]);

  // Handle audio metadata
  const fadeAudio = useCallback((from: number, to: number, durationMs: number) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const startTime = performance.now();
    
    const animateFade = (currentTimeMs: number) => {
      const elapsed = currentTimeMs - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      
      const currentVol = from + (to - from) * progress;
      audio.volume = currentVol;
      
      if (progress < 1) {
        requestAnimationFrame(animateFade);
      }
    };
    
    requestAnimationFrame(animateFade);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      // Set volume immediately to current volume setting
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      const currTime = audioRef.current.currentTime;
      const audioDuration = audioRef.current.duration;
      setCurrentTime(currTime);
      
      const remaining = audioDuration - currTime;
      
      if (nextEpisode) {
        if (remaining <= 10 && remaining > 0) {
          setShowUpNextPopUp(true);
        } else {
          setShowUpNextPopUp(false);
        }

        if (remaining <= 2 && remaining > 0) {
          if (!isFadingOutRef.current) {
            isFadingOutRef.current = true;
            fadeAudio(audioRef.current.volume, 0, 2000);
          }
        } else {
          isFadingOutRef.current = false;
        }
      }

      // Save progress
      const progress = (currTime / audioDuration) * 100;
      const continueItem: ContinueListeningItem = {
        seriesId: series.id,
        episodeId: currentEpisode?.id || '',
        progress,
        timestamp: Date.now(),
        seriesTitle: series.title,
        episodeTitle: currentEpisode?.title || '',
        thumbnail: series.thumbnail,
      };
      
      // Update localStorage
      const saved = localStorage.getItem('continueListening');
      let items: ContinueListeningItem[] = [];
      if (saved) {
        try {
          items = JSON.parse(saved);
        } catch (e) {
          items = [];
        }
      }
      
      const filteredItems = items.filter(
        item => !(item.seriesId === series.id && item.episodeId === currentEpisode?.id)
      );
      filteredItems.push(continueItem);
      localStorage.setItem('continueListening', JSON.stringify(filteredItems));
    }
  }, [series, currentEpisode, nextEpisode, fadeAudio]);

  const handleEnded = useCallback(() => {
    setShowUpNextPopUp(false);
    if (nextEpisode && repeatMode !== 'one') {
      setShowNextEpisodeOverlay(true);
      setNextEpisodeCountdown(5);
    } else if (!nextEpisode && repeatMode !== 'one') {
      navigate(`/wellness-ott`);
    }
  }, [nextEpisode, repeatMode, navigate]);

  // Auto-play next episode countdown
  useEffect(() => {
    if (!showNextEpisodeOverlay) return;

    const timer = setInterval(() => {
      setNextEpisodeCountdown(prev => {
        if (prev <= 1) {
          playNextEpisode();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showNextEpisodeOverlay]);

  const playNextEpisode = useCallback(() => {
    if (nextEpisode) {
      isFadingOutRef.current = false;
      isFadingInRef.current = false;
      navigate(`/wellness-ott/player/${series.id}/${nextEpisode.id}`);
      setShowNextEpisodeOverlay(false);
      setNextEpisodeCountdown(0);
      setShowUpNextPopUp(false);
    }
  }, [nextEpisode, series.id, navigate]);

  const handlePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Ensure volume is set before playing
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.play().catch(e => console.log("Audio play error:", e));
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, volume, isMuted]);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;
    audio.play()
      .then(() => setIsPlaying(true))
      .catch((e) => console.log('WellnessOTTAudioPlayer autoplay blocked:', e));
  }, [currentEpisode]);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
    }
  };

  const handleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
      } else {
        audioRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const handleRepeatClick = () => {
    const nextMode: 'off' | 'all' | 'one' = 
      repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off';
    setRepeatMode(nextMode);
    if (audioRef.current) {
      audioRef.current.loop = nextMode === 'one' || nextMode === 'all';
    }
  };

  const handleSkipPrevious = () => {
    if (currentTime > 5) {
      handleSeek(0);
    } else if (previousEpisode) {
      navigate(`/wellness-ott/player/${series.id}/${previousEpisode.id}`);
    } else {
      navigate(-1);
    }
  };

  const handleSkipNext = () => {
    if (nextEpisode) {
      navigate(`/wellness-ott/player/${series.id}/${nextEpisode.id}`);
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentEpisode) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-16 w-16 bg-[#2ed899]/20 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* Dynamic Background Image with soft cinematic zoom */}
      <motion.div 
        className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden"
        style={{
          backgroundImage: `url(${currentEpisode.thumbnail || series.thumbnail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        animate={{
          scale: [1.02, 1.10, 1.02],
        }}
        transition={{
          duration: 35,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Central Breathing Ambient Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-[#2ed899]/10 blur-[100px] pointer-events-none z-[2]"
        animate={{
          scale: [1, 1.15, 1],
          opacity: isPlaying ? [0.4, 0.75, 0.4] : [0.3, 0.45, 0.3],
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Floating light particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[3]">
        {[
          { x1: '10%', y1: '20%', x2: '35%', y2: '50%', x3: '15%', y3: '10%', scale: 0.9, delay: 0, gradient: 'from-[#2ed899]/12 to-transparent' },
          { x1: '80%', y1: '15%', x2: '60%', y2: '45%', x3: '75%', y3: '20%', scale: 1.3, delay: 2, gradient: 'from-blue-500/10 to-transparent' },
          { x1: '20%', y1: '75%', x2: '45%', y2: '80%', x3: '30%', y3: '65%', scale: 0.7, delay: 4, gradient: 'from-purple-500/10 to-transparent' },
          { x1: '70%', y1: '80%', x2: '50%', y2: '55%', x3: '65%', y3: '85%', scale: 1.1, delay: 1, gradient: 'from-amber-500/8 to-transparent' },
          { x1: '50%', y1: '30%', x2: '75%', y2: '15%', x3: '60%', y3: '40%', scale: 0.8, delay: 3, gradient: 'from-[#2ed899]/10 to-transparent' },
          { x1: '90%', y1: '90%', x2: '75%', y2: '70%', x3: '85%', y3: '95%', scale: 0.6, delay: 5, gradient: 'from-teal-500/10 to-transparent' },
        ].map((p, idx) => (
          <motion.div
            key={idx}
            className={`absolute w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${p.gradient} blur-xl`}
            initial={{
              left: p.x1,
              top: p.y1,
              scale: p.scale,
              opacity: 0.05,
            }}
            animate={{
              left: [p.x1, p.x2, p.x3, p.x1],
              top: [p.y1, p.y2, p.y3, p.y1],
              opacity: [0.08, 0.35, 0.18, 0.08],
            }}
            transition={{
              duration: 28 + idx * 4,
              ease: "easeInOut",
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Subtle cinematic gradient and glassmorphic blur overlays */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[7px] z-[4] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/80 z-[4] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60 z-[4] pointer-events-none" />

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={encodeURI(currentEpisode.videoUrl || '/audio/meditation/Indoor-Calm-Meditation.mp3')}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlayCapture={() => setIsPlaying(true)}
        onPauseCapture={() => setIsPlaying(false)}
        crossOrigin="anonymous"
      />

      {/* Main Content */}
      <motion.div
        className="relative z-20 w-full h-full flex flex-col items-center justify-center px-6 md:px-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 md:p-8 z-30">
          <motion.button
            onClick={() => navigate(-1)}
            className="p-2 md:p-3 hover:bg-white/10 rounded-lg transition-colors duration-300 backdrop-blur-md"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </motion.button>

          <motion.button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 md:p-3 hover:bg-white/10 rounded-lg transition-colors duration-300 backdrop-blur-md"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </motion.button>
        </div>

        {/* Episode Information */}
        <motion.div
          className="text-center mb-8 md:mb-12 max-w-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-xs md:text-sm font-black tracking-widest uppercase text-[#2ed899] bg-[#2ed899]/10 border border-[#2ed899]/30 px-3 py-1 rounded-full">
              {series.category}
            </span>
            {series.isOriginal && (
              <span className="text-xs md:text-sm font-black tracking-widest uppercase text-white/70 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                Nirvaha Original
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">
            {series.title}
          </h1>
          <p className="text-xl md:text-2xl text-[#2ed899] mb-4 font-bold">
            {currentEpisode.title}
          </p>
          <p className="text-sm md:text-base text-white/60 leading-relaxed max-w-lg mx-auto">
            {currentEpisode.description}
          </p>
        </motion.div>

        {/* Progress Bar (Native seekable input) */}
        <motion.div
          className="w-full max-w-md md:max-w-2xl mb-6 md:mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={e => handleSeek(parseFloat(e.target.value))}
            className="w-full h-1.5 md:h-2 rounded-full cursor-pointer appearance-none outline-none transition-all duration-300 accent-[#2ed899]"
            style={{
              background: `linear-gradient(to right, #2ed899 0%, #2ed899 ${
                duration > 0 ? (currentTime / duration) * 100 : 0
              }%, rgba(255,255,255,0.1) ${
                duration > 0 ? (currentTime / duration) * 100 : 0
              }%, rgba(255,255,255,0.1) 100%)`,
            }}
          />

          {/* Time Display */}
          <div className="flex items-center justify-between mt-3 text-xs md:text-sm font-semibold text-white/60">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </motion.div>

        {/* Control Buttons */}
        <motion.div
          className="flex items-center justify-center gap-4 md:gap-6 mb-8 md:mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Favorite Button */}
          <motion.button
            onClick={() => setIsFavorited(!isFavorited)}
            className="p-3 md:p-4 hover:bg-white/10 rounded-full transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart
              className={`w-5 h-5 md:w-6 md:h-6 transition-colors ${
                isFavorited ? 'text-[#2ed899] fill-[#2ed899]' : 'text-white/60'
              }`}
            />
          </motion.button>

          {/* Skip Previous */}
          <motion.button
            onClick={handleSkipPrevious}
            className="p-3 md:p-4 hover:bg-white/10 rounded-full transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={previousEpisode ? `Previous: ${previousEpisode.title}` : 'Restart'}
          >
            <SkipBack className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </motion.button>

          {/* Play/Pause Button */}
          <motion.button
            onClick={handlePlayPause}
            className="p-6 md:p-8 bg-[#2ed899] hover:bg-[#24c281] text-black rounded-full transition-all duration-300 shadow-lg hover:shadow-[0_0_40px_rgba(46,216,153,0.4)]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 md:w-10 md:h-10 fill-current" />
            ) : (
              <Play className="w-8 h-8 md:w-10 md:h-10 fill-current" />
            )}
          </motion.button>

          {/* Skip Next */}
          <motion.button
            onClick={handleSkipNext}
            disabled={!nextEpisode}
            className="p-3 md:p-4 hover:bg-white/10 rounded-full transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            whileHover={{ scale: nextEpisode ? 1.1 : 1 }}
            whileTap={{ scale: nextEpisode ? 0.95 : 1 }}
            title={nextEpisode ? `Next: ${nextEpisode.title}` : ''}
          >
            <SkipForward className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </motion.button>

          {/* Repeat Button */}
          <motion.button
            onClick={handleRepeatClick}
            className={`p-3 md:p-4 rounded-full transition-all duration-300 relative ${
              repeatMode !== 'off'
                ? 'bg-[#2ed899]/20 text-[#2ed899]'
                : 'hover:bg-white/10 text-white/60'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {repeatMode === 'one' ? (
              <>
                <Repeat2 className="w-5 h-5 md:w-6 md:h-6" />
                <span className="absolute bottom-1 right-1 text-[10px] font-black">1</span>
              </>
            ) : (
              <Repeat className="w-5 h-5 md:w-6 md:h-6" />
            )}
          </motion.button>
        </motion.div>

        {/* Bottom Controls */}
        <motion.div
          className="flex items-center justify-center gap-4 md:gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={handleMute}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5 md:w-6 md:h-6 text-white/60" />
              ) : (
                <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-white/60" />
              )}
            </motion.button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={e => handleVolumeChange(parseFloat(e.target.value))}
              className="w-20 md:w-32 h-1 bg-white/10 rounded-full cursor-pointer"
              style={{
                background: `linear-gradient(to right, #2ed899 0%, #2ed899 ${
                  (isMuted ? 0 : volume) * 100
                }%, rgba(255,255,255,0.1) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) 100%)`,
              }}
            />
          </div>

          {/* Speed Control */}
          <div className="relative">
            <motion.button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="px-3 md:px-4 py-2 text-xs md:text-sm font-black text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {playbackSpeed}x
            </motion.button>

            <AnimatePresence>
              {showSpeedMenu && (
                <motion.div
                  className="absolute bottom-full mb-2 right-0 bg-black/90 border border-white/10 rounded-lg overflow-hidden backdrop-blur-lg"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      className={`block w-full px-4 py-2 text-sm font-semibold text-left transition-colors ${
                        playbackSpeed === speed
                          ? 'bg-[#2ed899]/20 text-[#2ed899]'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Next Episode Overlay */}
      <AnimatePresence>
        {showNextEpisodeOverlay && nextEpisode && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-gradient-to-br from-[#0c0c0c] to-black border border-[#2ed899]/30 rounded-2xl p-8 md:p-10 max-w-md text-center shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-black text-white mb-2">
                Next Episode
              </h3>
              <p className="text-lg text-white/70 mb-6">{nextEpisode.title}</p>

              <div className="flex items-center justify-center mb-8">
                <div className="relative w-32 h-32">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="2"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#2ed899"
                      strokeWidth="2"
                      strokeDasharray={`${(nextEpisodeCountdown / 5) * 282.7} 282.7`}
                      animate={{
                        strokeDasharray: [
                          `${(nextEpisodeCountdown / 5) * 282.7} 282.7`,
                        ],
                      }}
                      transition={{ duration: 1, ease: 'linear' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-black text-[#2ed899]">
                      {nextEpisodeCountdown}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowNextEpisodeOverlay(false)}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-black rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={playNextEpisode}
                  className="flex-1 px-6 py-3 bg-[#2ed899] hover:bg-[#24c281] text-black font-black rounded-lg transition-all duration-300"
                >
                  Play Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

      {/* Up Next Pop-up */}
      <AnimatePresence>
        {showUpNextPopUp && nextEpisode && (
          <motion.div
            className="fixed bottom-8 right-8 z-[60] bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-black/90 hover:border-white/20 transition-all shadow-2xl"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            onClick={playNextEpisode}
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
              <img src={nextEpisode.thumbnail} alt={nextEpisode.title} className="w-full h-full object-cover" />
            </div>
            <div className="pr-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#2ed899] mb-1">Up Next</div>
              <div className="text-sm font-bold text-white mb-0.5">{nextEpisode.title}</div>
              <div className="text-xs text-white/50 font-medium">Starts in {Math.max(0, Math.ceil(duration - currentTime))}s...</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-2">
              <Play className="w-4 h-4 text-white fill-current translate-x-0.5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

        {showDetails && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              className="bg-gradient-to-br from-[#0c0c0c] to-black border border-[#2ed899]/20 rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl relative"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white/70 hover:text-white" />
              </button>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black tracking-widest uppercase text-[#2ed899] bg-[#2ed899]/10 border border-[#2ed899]/30 px-3 py-1 rounded-full">
                  {series.category}
                </span>
                <span className="text-[10px] font-black tracking-widest uppercase text-white/50 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  {series.rating}
                </span>
              </div>
              
              <h3 className="text-2xl font-black text-white mb-1">
                {series.title}
              </h3>
              <p className="text-sm font-semibold text-[#2ed899] mb-4">
                {currentEpisode.title}
              </p>
              
              <div className="space-y-4 text-sm text-white/70 leading-relaxed max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <h4 className="text-xs font-black uppercase text-white/40 tracking-wider mb-1">Episode Description</h4>
                  <p>{currentEpisode.description}</p>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-white/40 tracking-wider mb-1">Series Description</h4>
                  <p>{series.description}</p>
                </div>
                {series.tags && series.tags.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black uppercase text-white/40 tracking-wider mb-1.5">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {series.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold text-white/60 bg-[#2ed899]/5 border border-white/10 px-2.5 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
