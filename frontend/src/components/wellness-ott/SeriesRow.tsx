import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Clock, Sparkles } from 'lucide-react';
import { WellnessSession } from '../../data/wellnessSessions';

interface SeriesRowProps {
  title: string;
  sessions: WellnessSession[];
  isOriginals?: boolean;
}

export default function SeriesRow({
  title,
  sessions,
  isOriginals = false,
}: SeriesRowProps) {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (sessions.length === 0) return null;

  const handleSeriesClick = (seriesId: string) => {
    navigate(`/wellness-ott/series/${seriesId}`);
  };

  const handlePlayClick = (e: React.MouseEvent, seriesId: string) => {
    e.stopPropagation();
    const series = sessions.find(s => s.id === seriesId);
    if (series?.seasons?.[0]?.episodes?.[0]) {
      navigate(
        `/wellness-ott/player/${seriesId}/${series.seasons[0].episodes[0].id}`
      );
    }
  };

  return (
    <motion.div
      className="relative z-20 mb-10 lg:mb-14 px-6 md:px-10 lg:px-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      {/* Section Title */}
      <motion.h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-6 text-white tracking-tight flex items-center gap-3">
        <span>{title}</span>
        {isOriginals && (
          <span className="text-sm bg-[#2ed899]/10 text-[#2ed899] border border-[#2ed899]/30 px-3 py-1 rounded-full font-black tracking-widest uppercase">
            Originals
          </span>
        )}
      </motion.h2>

      {/* Scrollable Container */}
      <div className="relative group">
        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 md:pb-4 scroll-smooth snap-x snap-mandatory hide-scrollbar">
          <AnimatePresence mode="popLayout">
            {sessions.map((session, idx) => {
              const isHovered = hoveredId === session.id;
              const hasSeasons = session.seasons && session.seasons.length > 0;
              const firstEpisode = hasSeasons ? session.seasons![0].episodes[0] : null;

              return (
                <motion.div
                  key={session.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  onMouseEnter={() => setHoveredId(session.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handleSeriesClick(session.id)}
                  className={`group/card relative flex-none rounded-xl md:rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-br from-[#0c0c0c] to-black border border-white/5 shadow-xl transition-all duration-500 hover:border-[#2ed899]/50 hover:shadow-[0_0_40px_rgba(46,216,153,0.2)] snap-start ${
                    isOriginals
                      ? 'w-[200px] md:w-[240px] lg:w-[280px] aspect-[2/3]'
                      : 'w-[280px] md:w-[320px] lg:w-[380px] aspect-video'
                  }`}
                >
                  {/* Thumbnail Image */}
                  <motion.img
                    src={session.thumbnail}
                    alt={session.title}
                    className="w-full h-full object-cover"
                    animate={{
                      scale: isHovered ? 1.08 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Gradient Overlays */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
                    animate={{
                      opacity: isHovered ? 0.95 : 0.6,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"
                    animate={{
                      opacity: isHovered ? 1 : 0.4,
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Content Container */}
                  <motion.div
                    className="absolute inset-0 flex flex-col justify-between p-4 md:p-5 z-10"
                    animate={{
                      opacity: isHovered ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Top Section - Tags */}
                    <div className="flex items-start gap-2">
                      {session.isOriginal && (
                        <motion.span
                          className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-[#2ed899] bg-[#2ed899]/10 border border-[#2ed899]/30 px-2 py-1 rounded"
                          animate={{
                            y: isHovered ? 0 : 5,
                            opacity: isHovered ? 1 : 0.7,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          Original
                        </motion.span>
                      )}
                    </div>

                    {/* Bottom Section - Title and Controls */}
                    <div className="space-y-3">
                      {/* Title */}
                      <motion.div
                        animate={{
                          y: isHovered ? 0 : 8,
                          opacity: isHovered ? 1 : 0.9,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="font-black text-white text-sm md:text-base leading-tight mb-1 line-clamp-2 group-hover/card:text-[#2ed899] transition-colors">
                          {session.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {session.mood.slice(0, 2).map(mood => (
                            <span
                              key={mood}
                              className="text-[9px] md:text-[10px] uppercase font-bold text-white/60 bg-white/5 px-2 py-0.5 rounded"
                            >
                              {mood}
                            </span>
                          ))}
                        </div>
                      </motion.div>

                      {/* Metadata */}
                      <motion.div
                        className="flex items-center gap-2 text-white/60 text-xs md:text-sm"
                        animate={{
                          y: isHovered ? 0 : 8,
                          opacity: isHovered ? 1 : 0.7,
                        }}
                        transition={{ duration: 0.3, delay: 0.05 }}
                      >
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{session.duration}</span>
                        {hasSeasons && (
                          <>
                            <span className="text-white/40">•</span>
                            <span>
                              {session.seasons!.length}{' '}
                              {session.seasons!.length === 1 ? 'Season' : 'Seasons'}
                            </span>
                          </>
                        )}
                      </motion.div>

                      {/* Play Button */}
                      <motion.button
                        onClick={e => handlePlayClick(e, session.id)}
                        className="mt-3 w-full flex items-center justify-center gap-2 bg-[#2ed899]/80 hover:bg-[#2ed899] text-black font-black text-xs md:text-sm py-2 md:py-2.5 rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(46,216,153,0.4)]"
                        animate={{
                          y: isHovered ? 0 : 12,
                          opacity: isHovered ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                        <span>Play</span>
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Hover Glow Effect */}
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-[#2ed899]/20 via-transparent to-transparent pointer-events-none rounded-xl md:rounded-2xl"
                      animate={{
                        opacity: [0, 0.5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Fade overlays for infinite scroll feeling */}
        <div className="absolute top-0 left-0 w-8 md:w-16 h-full bg-gradient-to-r from-black via-black/20 to-transparent pointer-events-none z-30" />
        <div className="absolute top-0 right-0 w-8 md:w-16 h-full bg-gradient-to-l from-black via-black/20 to-transparent pointer-events-none z-30" />
      </div>
    </motion.div>
  );
}
