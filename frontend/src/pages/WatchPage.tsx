import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, ArrowLeft, Volume2, VolumeX, Maximize2, SkipForward, RotateCcw, Subtitles, Settings, Sparkles, AlertCircle } from 'lucide-react';
import { useEffect, useState, useRef, useMemo } from 'react';
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

export default function WatchPage() {
    const { seriesId, episodeId } = useParams();
    const navigate = useNavigate();
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);

    // Playback States
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Next Episode Countdown States
    const [showNextEpisodeOverlay, setShowNextEpisodeOverlay] = useState(false);
    const [nextEpisodeCountdown, setNextEpisodeCountdown] = useState(10);
    const countdownTimerRef = useRef<any>(null);

    // Slug-friendly Series Lookup: match ID or slugified title (e.g., 'morning-calm')
    const session = useMemo(() => {
        return videos.find(v => {
            const slug = v.title.toLowerCase().replace(/ /g, '-');
            return v.id === seriesId || slug === seriesId;
        }) || videos[0];
    }, [seriesId]);

    const isFilm = useMemo(() => {
        return episodeId === 'film' || session.type === 'Film';
    }, [episodeId, session]);

    // Slug-friendly Episode Lookup: match ID, 'episode-X', or standard slug replacement
    const episode = useMemo(() => {
        if (isFilm) {
            return {
                id: 'film',
                title: session.title,
                duration: session.duration,
                thumbnail: session.thumbnail,
                description: session.description,
                videoUrl: "https://vjs.zencdn.net/v/oceans.mp4"
            };
        }

        if (!episodeId) return null;
        const normalizedEpId = episodeId.replace('episode-', '');

        if (session.seasons) {
            for (const season of session.seasons) {
                const ep = season.episodes.find(e => e.id === normalizedEpId || e.id === episodeId);
                if (ep) return ep;
            }
        }

        // Fallback to first episode
        return session.seasons?.[0]?.episodes?.[0] || null;
    }, [session, episodeId, isFilm]);

    // Helper to build perfect SEO/slug URL formats
    const getWatchUrl = (s: WellnessSession, ep: Episode) => {
        const sSlug = s.title.toLowerCase().replace(/ /g, '-');
        return `/watch/${sSlug}/episode-${ep.id}`;
    };

    // Next Episode Identification logic
    const nextEpisode = useMemo(() => {
        if (isFilm || !session.seasons || !episode) return null;

        for (let sIdx = 0; sIdx < session.seasons.length; sIdx++) {
            const season = session.seasons[sIdx];
            const epIdx = season.episodes.findIndex(e => e.id === episode.id);
            
            if (epIdx !== -1) {
                if (epIdx + 1 < season.episodes.length) {
                    return {
                        episode: season.episodes[epIdx + 1],
                        seasonNum: season.seasonNumber
                    };
                }
                if (sIdx + 1 < session.seasons.length) {
                    const nextSeason = session.seasons[sIdx + 1];
                    if (nextSeason.episodes.length > 0) {
                        return {
                            episode: nextSeason.episodes[0],
                            seasonNum: nextSeason.seasonNumber
                        };
                    }
                }
            }
        }
        return null;
    }, [session, episode, isFilm]);

    const activeSeasonNum = useMemo(() => {
        if (isFilm || !session.seasons || !episode) return 1;
        for (const season of session.seasons) {
            const hasEp = season.episodes.some(e => e.id === episode.id);
            if (hasEp) return season.seasonNumber;
        }
        return 1;
    }, [session, episode, isFilm]);

    // Formatted time outputs
    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Sync subtitles timeline
    const activeSubtitle = useMemo(() => {
        if (!subtitlesEnabled) return "";
        const t = Math.floor(currentTime);

        const subtitles: { [key: number]: string } = {
            0: "[ Gentle singing bowls begin to sound ]",
            3: "Welcome to Nirvaha Guided Transformation.",
            7: "Begin by settling into a comfortable physical posture...",
            11: "Gently soften your shoulders, release your jaw.",
            15: "Take a deep, cleansing inhalation through your nose...",
            20: "Hold it at the top... feel the fullness of light...",
            24: "And slowly, completely exhale. Release all muscle tension.",
            28: "[ Soft ocean waves crash in the background ]",
            33: "With every single breath, align yourself to the present moment.",
            38: "Observe how your belly rises and falls naturally.",
            43: "There is nowhere to go, nothing to fix.",
            47: "You are perfectly safe. You are completely at peace.",
            52: "Let the soundscapes wash over your mental chatter.",
            57: "Inhale peace... Exhale stress...",
            62: "[ Continuous healing frequencies humming ]",
        };

        const times = Object.keys(subtitles).map(Number).sort((a, b) => b - a);
        for (const start of times) {
            if (t >= start) {
                if (t < start + 5) {
                    return subtitles[start];
                }
                break;
            }
        }
        return "";
    }, [currentTime, subtitlesEnabled]);

    // Playback events
    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play().catch(e => console.log(e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const skipTime = (amount: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.max(
                0, 
                Math.min(videoRef.current.duration, videoRef.current.currentTime + amount)
            );
        }
    };

    // Keyboard handlers
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                handlePlayPause();
            } else if (e.code === 'ArrowRight') {
                skipTime(10);
            } else if (e.code === 'ArrowLeft') {
                skipTime(-10);
            } else if (e.code === 'KeyF') {
                toggleFullscreen();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying]);

    // Inactivity timers for overlay panel
    const controlsTimeoutRef = useRef<any>(null);
    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying && !showSpeedMenu) {
                setShowControls(false);
            }
        }, 3000);
    };

    useEffect(() => {
        return () => {
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        };
    }, []);

    // Time update and continue watching saving
    const handleTimeUpdate = () => {
        if (!videoRef.current || !episode) return;
        
        const curr = videoRef.current.currentTime;
        const dur = videoRef.current.duration;
        
        setCurrentTime(curr);
        if (dur) {
            const perc = (curr / dur) * 100;
            setProgress(perc);

            // Save continue watching items
            const cwItem: ContinueWatchingItem = {
                seriesId: session.id,
                episodeId: episode.id,
                progress: perc,
                timestamp: Date.now(),
                seriesTitle: session.title,
                episodeTitle: episode.title,
                thumbnail: episode.thumbnail || session.thumbnail
            };

            const existingData = localStorage.getItem("ott_continue_watching");
            let cwList: ContinueWatchingItem[] = [];
            if (existingData) {
                try {
                    cwList = JSON.parse(existingData);
                } catch (e) {}
            }

            cwList = cwList.filter(x => x.seriesId !== session.id);
            if (perc < 98) {
                cwList.unshift(cwItem);
            }
            localStorage.setItem("ott_continue_watching", JSON.stringify(cwList));

            // Trigger countdown screen in the last 10 seconds of episode
            const timeLeft = dur - curr;
            if (nextEpisode && timeLeft <= 10 && !showNextEpisodeOverlay) {
                setShowNextEpisodeOverlay(true);
                setNextEpisodeCountdown(10);
            }
        }
    };

    // Countdown ring timer
    useEffect(() => {
        if (showNextEpisodeOverlay && nextEpisodeCountdown > 0) {
            countdownTimerRef.current = setTimeout(() => {
                setNextEpisodeCountdown(prev => prev - 1);
            }, 1000);
        } else if (showNextEpisodeOverlay && nextEpisodeCountdown === 0) {
            playNextEpisode();
        }

        return () => {
            if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
        };
    }, [showNextEpisodeOverlay, nextEpisodeCountdown]);

    const playNextEpisode = () => {
        if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
        setShowNextEpisodeOverlay(false);
        if (nextEpisode) {
            const nextUrl = getWatchUrl(session, nextEpisode.episode);
            navigate(nextUrl);
            setProgress(0);
            setCurrentTime(0);
            setIsPlaying(true);
        }
    };

    // Fullscreen toggles
    const toggleFullscreen = () => {
        if (!playerContainerRef.current) return;
        if (!document.fullscreenElement) {
            playerContainerRef.current.requestFullscreen().catch(err => console.log(err));
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Seekbars clicks
    const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (videoRef.current && duration) {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = e.clientX - rect.left;
            const percentage = clickPos / rect.width;
            videoRef.current.currentTime = percentage * duration;
        }
    };

    // Volume adjustment
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = parseFloat(e.target.value);
        setVolume(v);
        setIsMuted(v === 0);
        if (videoRef.current) {
            videoRef.current.volume = v;
            videoRef.current.muted = v === 0;
        }
    };

    const toggleMute = () => {
        const nextMute = !isMuted;
        setIsMuted(nextMute);
        if (videoRef.current) {
            videoRef.current.muted = nextMute;
        }
    };

    const handleSpeedChange = (speed: number) => {
        setPlaybackSpeed(speed);
        setShowSpeedMenu(false);
        if (videoRef.current) {
            videoRef.current.playbackRate = speed;
        }
    };

    useEffect(() => {
        setIsPlaying(true);
        setShowNextEpisodeOverlay(false);
        if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    }, [episodeId, seriesId]);

    if (!episode) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center">
                <AlertCircle className="w-14 h-14 text-rose-500 mb-4 animate-bounce" />
                <h2 className="text-xl font-bold">Session Content Not Found</h2>
                <button onClick={() => navigate(-1)} className="mt-4 bg-[#2ed899] text-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold">Go Back</button>
            </div>
        );
    }

    return (
        <div 
            ref={playerContainerRef}
            onMouseMove={handleMouseMove}
            className="fixed inset-0 z-[300] bg-[#020202] text-white overflow-hidden flex items-center justify-center select-none"
        >
            {/* Fullscreen Blurred Ambient Background */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
                <img 
                    src={episode.thumbnail || session.banner} 
                    alt="" 
                    className="w-full h-full object-cover blur-3xl opacity-35 scale-110 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/45 to-black/95" />
            </div>

            {/* Video Player */}
            <video
                ref={videoRef}
                src={episode.videoUrl}
                autoPlay
                className="absolute inset-0 w-full h-full object-cover z-10"
                onClick={handlePlayPause}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => {
                    if (videoRef.current) {
                        setDuration(videoRef.current.duration);
                        setIsPlaying(true);
                    }
                }}
                key={episode.videoUrl}
            />

            {/* Backlights overlay grids */}
            <div className="absolute inset-0 bg-[#2ed899]/2 opacity-[0.01] mix-blend-screen pointer-events-none z-10" />

            {/* Subtitles rendering */}
            {activeSubtitle && (
                <div className="absolute bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 z-20 max-w-[85%] text-center pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={activeSubtitle}
                        className="bg-black/70 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/5 text-sm md:text-lg font-medium tracking-wide text-white drop-shadow-lg"
                    >
                        {activeSubtitle}
                    </motion.div>
                </div>
            )}

            {/* Full Screen Controls Overlay */}
            <AnimatePresence>
                {showControls && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 z-30 flex flex-col justify-between p-6 md:p-8"
                    >
                        {/* Top Action Panel (Display Episode Title, Duration, and Description beautifully!) */}
                        <div className="flex justify-between items-start z-40 bg-gradient-to-b from-black/95 to-transparent p-5 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <div className="flex items-start gap-4">
                                <button 
                                    onClick={() => navigate(`/wellness-ott/series/${session.id}`)}
                                    className="w-11 h-11 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all hover:scale-105 mt-1"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div className="flex flex-col max-w-xl">
                                    <span className="text-[10px] text-[#2ed899] font-black uppercase tracking-widest">
                                        {session.title} {isFilm ? '' : `• Season ${activeSeasonNum}`}
                                    </span>
                                    <h2 className="font-extrabold text-base md:text-xl leading-tight mt-1 text-white">
                                        {isFilm ? 'Featured Film' : episode.title}
                                    </h2>
                                    <p className="text-white/50 text-xs mt-2 line-clamp-2 leading-relaxed hidden sm:block">
                                        {episode.description}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-[10px] text-white/40 font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase tracking-wider">
                                    Duration: {episode.duration}
                                </span>
                                <span className="text-[10px] bg-[#2ed899]/15 text-[#2ed899] border border-[#2ed899]/30 px-3 py-1 rounded-full font-black tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_12px_rgba(46,216,153,0.2)]">
                                    <Sparkles className="w-3.5 h-3.5" /> Nirvaha Cinema
                                </span>
                            </div>
                        </div>

                        {/* Centered Large Play Action Button */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="w-20 h-20 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-[#2ed899] hover:text-black pointer-events-auto hover:border-[#2ed899] hover:shadow-[0_0_30px_rgba(46,216,153,0.45)] transition-all transform scale-100"
                                onClick={handlePlayPause}
                            >
                                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                            </motion.button>
                        </div>

                        {/* Bottom Play Control Console */}
                        <div className="w-full flex flex-col gap-4 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-4 md:p-6 rounded-2xl border border-white/5 backdrop-blur-sm z-40">
                            
                            {/* Seekbar and drag markers */}
                            <div className="flex items-center gap-4 text-xs font-bold font-mono">
                                <span>{formatTime(currentTime)}</span>
                                
                                <div 
                                    onClick={handleProgressBarClick}
                                    className="flex-1 h-2 bg-white/15 rounded-full cursor-pointer relative overflow-hidden group"
                                >
                                    <div 
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#1a5d47] to-[#2ed899] rounded-full transition-all duration-100 ease-linear"
                                        style={{ width: `${progress}%` }}
                                    >
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_8px_rgba(46,216,153,0.8)]" />
                                    </div>
                                </div>
                                
                                <span>{formatTime(duration)}</span>
                            </div>

                            {/* Control button list */}
                            <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center gap-6">
                                    <button onClick={() => skipTime(-10)} className="text-white/80 hover:text-white transition-colors" title="Rewind 10s">
                                        <RotateCcw className="w-5 h-5" />
                                    </button>

                                    <button onClick={handlePlayPause} className="text-white/90 hover:text-[#2ed899] transition-colors" title={isPlaying ? "Pause" : "Play"}>
                                        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                                    </button>

                                    <button onClick={() => skipTime(10)} className="text-white/80 hover:text-white transition-colors" title="Forward 10s">
                                        <SkipForward className="w-5 h-5" />
                                    </button>

                                    {/* Netflix-style Manual NEXT EPISODE Skip Button */}
                                    {nextEpisode && (
                                        <button 
                                            onClick={playNextEpisode}
                                            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white/80 hover:text-[#2ed899] transition-all ml-2 border border-white/20 rounded-lg px-3 py-1.5 bg-white/5 hover:border-[#2ed899]/30"
                                            title="Next Episode"
                                        >
                                            <SkipForward className="w-4 h-4" /> Next Episode
                                        </button>
                                    )}

                                    {/* Volume controller */}
                                    <div className="flex items-center gap-2 group/volume ml-2">
                                        <button onClick={toggleMute} className="text-white/80 hover:text-white transition-colors">
                                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                        </button>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="1" 
                                            step="0.05"
                                            value={isMuted ? 0 : volume}
                                            onChange={handleVolumeChange}
                                            className="w-0 group-hover/volume:w-20 transition-all duration-300 h-1 accent-[#2ed899] bg-white/20 rounded-full cursor-pointer appearance-none outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 relative">
                                    <button 
                                        onClick={() => setSubtitlesEnabled(!subtitlesEnabled)} 
                                        className={`transition-colors ${subtitlesEnabled ? 'text-[#2ed899]' : 'text-white/50 hover:text-white'}`}
                                        title="Subtitles Toggle"
                                    >
                                        <Subtitles className="w-5 h-5" />
                                    </button>

                                    {/* Speed rates */}
                                    <div className="relative">
                                        <button 
                                            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                                            className="text-xs font-black uppercase tracking-wider text-white/80 hover:text-white flex items-center gap-1 border border-white/20 rounded-lg px-2.5 py-1 bg-white/5"
                                        >
                                            <Settings className="w-3.5 h-3.5" /> {playbackSpeed}x
                                        </button>

                                        <AnimatePresence>
                                            {showSpeedMenu && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute bottom-10 right-0 w-28 bg-[#0c0c0c] border border-white/10 rounded-xl overflow-hidden p-1 shadow-2xl z-50"
                                                >
                                                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                                                        <button
                                                            key={speed}
                                                            onClick={() => handleSpeedChange(speed)}
                                                            className={`w-full px-3 py-1.5 rounded-lg text-left text-xs font-bold uppercase transition-colors ${
                                                                playbackSpeed === speed ? 'bg-[#2ed899] text-black' : 'text-white/60 hover:text-white hover:bg-white/5'
                                                            }`}
                                                        >
                                                            {speed === 1 ? 'Normal' : `${speed}x`}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <button onClick={toggleFullscreen} className="text-white/80 hover:text-white transition-colors" title="Toggle Fullscreen">
                                        <Maximize2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Immersive Auto-Next Countdown overlay card */}
            <AnimatePresence>
                {showNextEpisodeOverlay && nextEpisode && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 z-[250] bg-black/95 backdrop-blur-2xl flex items-center justify-center"
                    >
                        <div className="max-w-md w-full px-6 text-center flex flex-col items-center">
                            
                            <div className="relative w-72 aspect-video rounded-2xl overflow-hidden border border-[#2ed899]/30 shadow-[0_0_30px_rgba(46,216,153,0.15)] mb-8">
                                <img src={nextEpisode.episode.thumbnail} alt={nextEpisode.episode.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-4 text-left">
                                    <span className="text-[10px] text-[#2ed899] font-black uppercase tracking-widest">Next Up • Season {nextEpisode.seasonNum}</span>
                                    <h4 className="font-extrabold text-white text-base mt-0.5 leading-snug">{nextEpisode.episode.title}</h4>
                                    <span className="text-[10px] text-white/50 font-bold mt-0.5">{nextEpisode.episode.duration}</span>
                                </div>
                            </div>

                            <h3 className="text-xl md:text-2xl font-black mb-1 uppercase tracking-wider">Next Episode starts in</h3>
                            
                            {/* SVG Ring */}
                            <div className="relative w-28 h-28 my-6 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle 
                                        cx="56" 
                                        cy="56" 
                                        r="45" 
                                        stroke="#113d2f" 
                                        strokeWidth="5" 
                                        fill="transparent" 
                                    />
                                    <motion.circle 
                                        cx="56" 
                                        cy="56" 
                                        r="45" 
                                        stroke="#2ed899" 
                                        strokeWidth="6" 
                                        fill="transparent" 
                                        strokeDasharray={282}
                                        initial={{ strokeDashoffset: 0 }}
                                        animate={{ strokeDashoffset: (282 * (10 - nextEpisodeCountdown)) / 10 }}
                                        transition={{ duration: 1, ease: "linear" }}
                                    />
                                </svg>
                                <span className="absolute text-3xl font-mono font-black text-[#2ed899]">
                                    {nextEpisodeCountdown}
                                </span>
                            </div>

                            <div className="flex gap-4 w-full mt-4">
                                <button 
                                    onClick={playNextEpisode}
                                    className="flex-1 bg-[#2ed899] hover:bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(46,216,153,0.3)] transition-colors"
                                >
                                    Play Now
                                </button>
                                <button 
                                    onClick={() => setShowNextEpisodeOverlay(false)}
                                    className="flex-1 bg-white/10 hover:bg-white/15 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
