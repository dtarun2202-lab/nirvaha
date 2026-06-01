import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, X, Clock, BookOpen } from 'lucide-react';

interface ContinueListeningItem {
  seriesId: string;
  episodeId: string;
  progress: number;
  timestamp: number;
  seriesTitle: string;
  episodeTitle: string;
  thumbnail: string;
}

interface ContinueListeningSectionProps {
  items: ContinueListeningItem[];
}

export default function ContinueListeningSection({
  items,
}: ContinueListeningSectionProps) {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !items || items.length === 0) return null;

  // Get the most recent item
  const currentItem = items.sort(
    (a, b) => b.timestamp - a.timestamp
  )[0];

  const handleResume = () => {
    navigate(
      `/wellness-ott/player/${currentItem.seriesId}/${currentItem.episodeId}`
    );
  };

  return (
    <motion.div
      className="relative z-30 px-6 md:px-10 lg:px-16 mb-12 lg:mb-16"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#2ed899]/30 bg-gradient-to-r from-[#2ed899]/5 via-[#2ed899]/2 to-transparent backdrop-blur-lg shadow-2xl">
        {/* Background Blur Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#2ed899]/10 rounded-full blur-3xl opacity-30 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-stretch gap-4 md:gap-6 p-6 md:p-8">
          {/* Thumbnail */}
          <motion.div
            className="flex-shrink-0 w-full md:w-40 lg:w-48 rounded-xl overflow-hidden border border-white/10"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={currentItem.thumbnail}
              alt={currentItem.seriesTitle}
              className="w-full h-32 md:h-40 lg:h-48 object-cover"
            />
          </motion.div>

          {/* Content Details */}
          <div className="flex-1 flex flex-col justify-between min-h-32 md:min-h-40 lg:min-h-48">
            {/* Header */}
            <div>
              <motion.span
                className="inline-block text-xs font-black tracking-widest uppercase text-[#2ed899] bg-[#2ed899]/10 border border-[#2ed899]/30 px-3 py-1 rounded-full mb-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                Continue Listening
              </motion.span>

              <motion.h3
                className="text-xl md:text-2xl font-black text-white mb-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                {currentItem.seriesTitle}
              </motion.h3>

              <motion.p
                className="text-base md:text-lg text-white/70 mb-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {currentItem.episodeTitle}
              </motion.p>

              {/* Progress Bar */}
              <motion.div
                className="w-full bg-white/10 rounded-full h-2 overflow-hidden border border-white/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-[#2ed899] to-[#1ab87e]"
                  animate={{
                    width: `${currentItem.progress}%`,
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </motion.div>
            </div>

            {/* Footer with Metadata and Buttons */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs md:text-sm text-white/60 font-semibold">
                {Math.round(currentItem.progress)}% watched
              </span>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={handleResume}
                  className="flex items-center gap-2 px-6 md:px-8 py-2 md:py-3 bg-[#2ed899] hover:bg-[#24c281] text-black font-black text-sm md:text-base rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(46,216,153,0.4)]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume</span>
                </motion.button>

                <motion.button
                  onClick={() => setDismissed(true)}
                  className="p-2 md:p-3 hover:bg-white/10 rounded-lg transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Dismiss"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5 text-white/60 hover:text-white" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
