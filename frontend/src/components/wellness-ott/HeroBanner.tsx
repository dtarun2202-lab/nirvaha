import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Zap, Info, Volume2, VolumeX } from 'lucide-react';
import { WellnessSession } from '../../data/wellnessSessions';

interface HeroBannerProps {
  series: WellnessSession;
}

export default function HeroBanner({ series }: HeroBannerProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const firstEpisode = series.seasons?.[0]?.episodes?.[0];

  useEffect(() => {
    // Reset video state when series changes
    setShowVideo(false);
    
    // Autoplay video preview after 1.5 seconds delay
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [series.id]);

  const handlePlay = () => {
    if (firstEpisode && series.seasons) {
      navigate(`/wellness-ott/player/${series.id}/${firstEpisode.id}`);
    } else {
      navigate(`/wellness-ott/series/${series.id}`);
    }
  };

  const handleViewSeries = () => {
    navigate(`/wellness-ott/series/${series.id}`);
  };

  return (
    <div
      className="relative w-full h-screen md:h-[80vh] lg:h-screen overflow-hidden bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image / Autoplay Video Preview */}
      <div className="absolute inset-0 w-full h-full">
        {/* Background Image with parallax effect */}
        <motion.div
          className="absolute inset-0 w-full h-full z-0"
          animate={{
            scale: isHovered ? 1.03 : 1,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <img
            src={series.banner}
            alt={series.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Video Preview */}
        <AnimatePresence>
          {showVideo && (
            <motion.video
              ref={videoRef}
              key={series.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full object-cover z-10"
              src="/hero_cinematic.mp4"
              autoPlay
              loop
              muted={isMuted}
              playsInline
            />
          )}
        </AnimatePresence>
      </div>

      {/* Dark gradient overlays for readability and premium feel */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20" />
      
      {/* Radial glow effect */}
      <div className="absolute inset-0 bg-radial-gradient from-[#2ed899]/5 to-transparent z-20" />

      {/* Content */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-center items-start z-30 p-6 md:p-12 lg:p-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            className="flex items-center gap-2 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {series.isOriginal && (
              <span className="inline-flex items-center gap-2 bg-[#2ed899]/10 border border-[#2ed899]/30 rounded-full px-4 py-2 text-xs font-black tracking-widest uppercase text-[#2ed899] shadow-[0_0_15px_rgba(46,216,153,0.2)]">
                <Zap className="w-4 h-4 fill-current" />
                Nirvaha Original
              </span>
            )}
            <span className="text-xs font-black tracking-widest uppercase text-white/70 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              {series.category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {series.title}
          </motion.h1>

          {/* Metadata */}
          <motion.div
            className="flex flex-wrap items-center gap-4 mb-6 text-sm md:text-base font-semibold text-white/90"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <span className="text-[#2ed899] font-black">{series.match}</span>
            <span className="text-white/60">•</span>
            <span className="text-white/60">{series.year}</span>
            <span className="text-white/60">•</span>
            <span className="border border-white/30 px-2 py-0.5 rounded text-[10px] font-black text-white bg-black/20">
              {series.rating}
            </span>
            {series.seasons && series.seasons.length > 0 && (
              <>
                <span className="text-white/60">•</span>
                <span className="text-[#2ed899] font-bold">
                  {series.seasons.length} {series.seasons.length === 1 ? 'Season' : 'Seasons'}
                </span>
              </>
            )}
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-base md:text-lg text-white/70 mb-8 max-w-xl leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {series.description}
          </motion.p>

          {/* Mood Tags */}
          {series.mood && series.mood.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-2 mb-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {series.mood.map(tag => (
                <span
                  key={tag}
                  className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:border-[#2ed899]/50 hover:text-[#2ed899]/90 hover:bg-white/10 transition-all cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col md:flex-row gap-4 items-start md:items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {/* Play Button */}
            <button
              onClick={handlePlay}
              className="group relative px-8 md:px-10 py-3.5 md:py-4 bg-white text-black hover:bg-[#2ed899] font-black text-sm uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(46,216,153,0.5)] hover:scale-105 flex items-center gap-3"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
              <span>Play Session</span>
            </button>

            {/* More Info Button */}
            <button
              onClick={handleViewSeries}
              className="px-8 md:px-10 py-3.5 md:py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all duration-300 backdrop-blur-md flex items-center gap-3"
            >
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Mute/Unmute Controls */}
      {showVideo && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="absolute bottom-24 right-6 md:right-12 lg:right-16 z-40 p-3 rounded-full border border-white/30 bg-black/40 hover:bg-black/60 text-white hover:border-white transition-all backdrop-blur-md"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </motion.button>
      )}

      {/* Floating elements for cinematic feel */}
      <motion.div
        className="absolute top-20 right-10 w-40 h-40 bg-[#2ed899]/10 rounded-full blur-3xl opacity-20 pointer-events-none"
        animate={{
          y: isHovered ? -20 : 0,
          x: isHovered ? 20 : 0,
        }}
        transition={{ duration: 0.6 }}
      />
      <motion.div
        className="absolute bottom-20 left-1/4 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl opacity-10 pointer-events-none"
        animate={{
          y: isHovered ? 30 : 0,
          x: isHovered ? -30 : 0,
        }}
        transition={{ duration: 0.8 }}
      />
    </div>
  );
}
