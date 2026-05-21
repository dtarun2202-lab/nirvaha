import { motion } from 'motion/react';

interface AudioWaveformProps {
  isPlaying: boolean;
}

export default function AudioWaveform({ isPlaying }: AudioWaveformProps) {
  const bars = Array.from({ length: 20 });

  return (
    <div className="flex items-end justify-center gap-1.5 h-16">
      {bars.map((_, idx) => (
        <motion.div
          key={idx}
          className="w-1.5 md:w-2 bg-gradient-to-t from-[#2ed899] to-[#1ab87e] rounded-full"
          animate={{
            height: isPlaying ? [8, 24, 8] : 8,
          }}
          transition={{
            duration: 0.6,
            repeat: isPlaying ? Infinity : 0,
            delay: idx * 0.06,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
