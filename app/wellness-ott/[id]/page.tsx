"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Plus, Share2, X, Volume2 } from 'lucide-react';

const sessionData: Record<string, any> = {
    "1": {
        title: "Morning Calm",
        category: "Meditation",
        duration: "10 min",
        match: "98% Match",
        year: "2024",
        emotionalDescription: "Immerse yourself in a transformative journey that dissolves stress and awakens a profound sense of inner tranquility. This cinematic experience weaves ancient soundscapes with modern mindfulness, guiding you toward ultimate mental clarity.",
        tags: ["Mindfulness", "Anxiety Relief", "Deep Sleep", "Sound Healing"],
        heroImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop",
        audioSource: "/audio/meditation.mp3"
    },
    "2": {
        title: "Deep Sleep Guide",
        category: "Sleep",
        duration: "45 min",
        match: "99% Match",
        year: "2024",
        emotionalDescription: "Drift away into a restorative slumber. This soothing guided session is designed to quiet a racing mind and ease your body into deep, healing relaxation.",
        tags: ["Sleep", "Relaxation", "Healing", "Rest"],
        heroImage: "https://images.squarespace-cdn.com/content/v1/57b5ef68c534a5cc06edc769/b50a955f-e95f-42c1-beb6-4e74d753bfbb/restorative+yoga",
        audioSource: "/audio/sleep.mp3"
    },
    "3": {
        title: "Anxiety Relief",
        category: "Stress",
        duration: "20 min",
        match: "95% Match",
        year: "2024",
        emotionalDescription: "Release built-up tension and anxiety. Let this calm session ground your thoughts and bring immediate relief to your nervous system.",
        tags: ["Anxiety Relief", "Stress Management", "Mindfulness"],
        heroImage: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=2000&auto=format&fit=crop",
        audioSource: "/audio/stress.mp3"
    },
    "4": {
        title: "Focus Flow",
        category: "Productivity",
        duration: "30 min",
        match: "92% Match",
        year: "2024",
        emotionalDescription: "Enhance your mental clarity and focus. This dynamic audio experience sharpens your attention for deep work and creative problem solving.",
        tags: ["Productivity", "Focus", "Clarity", "Energy"],
        heroImage: "https://lonestarneurology.net/wp-content/uploads/2025/08/3-Mental-Clarity-and-Cognitive-Function-from-Yoga.jpg",
        audioSource: "/audio/focus.mp3"
    },
    "5": {
        title: "Chakra Balance",
        category: "Energy",
        duration: "15 min",
        match: "90% Match",
        year: "2024",
        emotionalDescription: "Realign your energy centers. Experience a revitalizing flow of energy that brings balance and harmony to your body, mind, and spirit.",
        tags: ["Energy", "Healing", "Balance", "Spiritual"],
        heroImage: "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=2000&auto=format&fit=crop",
        audioSource: "/audio/energy.mp3"
    }
};

const fallbackContent = {
    title: "Awaken Your Inner Peace",
    category: "Guided Meditation",
    duration: "45 min",
    match: "98% Match",
    year: "2024",
    emotionalDescription: "Immerse yourself in a transformative journey that dissolves stress and awakens a profound sense of inner tranquility. This cinematic experience weaves ancient soundscapes with modern mindfulness, guiding you toward ultimate mental clarity.",
    tags: ["Mindfulness", "Anxiety Relief", "Deep Sleep", "Sound Healing"],
    heroImage: "https://images.unsplash.com/photo-1518241353330-0f7941c2d1b5?q=80&w=2000&auto=format&fit=crop",
    audioSource: "/audio/meditation.mp3"
};

export default function WellnessOTTDetail({ params }: { params: { id: string } }) {
  const content = sessionData[params?.id] || fallbackContent;

  const recommendedSessions = [
    { id: 1, title: "Breathwork for Focus", duration: "15 min", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop" },
    { id: 2, title: "Deep Theta Healing", duration: "60 min", img: "https://images.unsplash.com/photo-1528319725582-ddc096101511?w=500&auto=format&fit=crop" },
    { id: 3, title: "Morning Activation", duration: "20 min", img: "https://images.unsplash.com/photo-1554244033-0c4a7fb4880f?w=500&auto=format&fit=crop" },
    { id: 4, title: "Sleep Sanctuary", duration: "45 min", img: "https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?w=500&auto=format&fit=crop" },
  ];

  // Audio Player State
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [durationStr, setDurationStr] = useState("0:00");

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setCurrentTime(formatTime(current));
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDurationStr(formatTime(audioRef.current.duration));
    }
  };

  const togglePlay = () => {
    if (!showPlayer) {
      setShowPlayer(true);
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bar = e.currentTarget;
      const rect = bar.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const percentage = clickPosition / rect.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden relative pb-24">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={content.audioSource}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Hero Banner Section */}
      <div className="relative w-full h-[85vh] lg:h-[90vh]">
        {/* Background Image with Gradient Overlays */}
        <div className="absolute inset-0 w-full h-full">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${content.heroImage})` }}
          />
          {/* Cinematic vignette and bottom fade to dark */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
          {/* Emerald Glow Accent */}
          <div className="absolute top-1/4 -left-1/4 w-[50vw] h-[50vw] bg-emerald-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-end h-full px-6 pb-24 md:px-16 lg:px-24 md:pb-32 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Metadata row */}
            <div className="flex items-center space-x-4 mb-4 text-sm md:text-base font-medium">
              <span className="text-emerald-400 font-semibold">{content.match}</span>
              <span className="text-gray-300">{content.year}</span>
              <span className="px-2 py-0.5 border border-gray-600 rounded text-gray-300 text-xs font-bold">HD</span>
              <span className="text-gray-300">{content.duration}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight drop-shadow-2xl text-white">
              {content.title}
            </h1>

            {/* Emotional Description */}
            <p className="max-w-2xl text-lg md:text-xl text-gray-300 mb-8 leading-relaxed drop-shadow-md">
              {content.emotionalDescription}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <motion.button 
                onClick={togglePlay}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-md font-bold text-lg hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black" />}
                {isPlaying ? "Pause Session" : "Play Session"}
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-gray-500/30 backdrop-blur-md text-white border border-gray-500/50 px-8 py-3.5 rounded-md font-bold text-lg hover:bg-gray-500/50 transition-colors"
              >
                <Plus className="w-6 h-6" />
                Save to List
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3.5 rounded-full border border-gray-500/50 bg-gray-500/30 backdrop-blur-md hover:bg-gray-500/50 transition-colors"
              >
                <Share2 className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            {/* Tags / Info */}
            <div className="flex flex-col gap-3 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Category:</span>
                <span className="text-white hover:text-emerald-400 transition-colors cursor-pointer">{content.category}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-gray-400">Wellness Tags:</span>
                {content.tags.map((tag, i) => (
                  <React.Fragment key={tag}>
                    <span className="text-white hover:text-emerald-400 transition-colors cursor-pointer">{tag}</span>
                    {i < content.tags.length - 1 && <span className="text-gray-600">•</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recommended Sessions Row */}
      <div className="relative z-20 px-6 md:px-16 lg:px-24 pb-20 -mt-8">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
          Recommended for You
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {recommendedSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className="relative group cursor-pointer aspect-video rounded-md overflow-hidden bg-gray-800 shadow-xl"
            >
              <img 
                src={session.img} 
                alt={session.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h4 className="text-white font-bold text-lg">{session.title}</h4>
                <div className="flex items-center gap-2 text-emerald-400 text-sm mt-1 font-medium">
                  <Play className="w-3 h-3 fill-emerald-400" />
                  {session.duration}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Audio Player */}
      <AnimatePresence>
        {showPlayer && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed bottom-0 left-0 w-full z-50 bg-[#0f0f0f]/90 backdrop-blur-xl border-t border-gray-800/60 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
          >
            {/* Emerald glow line on top of player */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            
            <div className="max-w-7xl mx-auto px-6 lg:px-24 py-4 flex flex-col md:flex-row items-center gap-6">
              
              {/* Player Info */}
              <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
                <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 relative">
                  <img src={content.heroImage} alt="thumbnail" className="w-full h-full object-cover" />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-emerald-900/40 mix-blend-overlay flex items-center justify-center">
                      <div className="w-full h-full bg-emerald-500/20 animate-pulse" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <h4 className="text-white font-semibold text-sm md:text-base leading-tight">{content.title}</h4>
                  <p className="text-emerald-400 text-xs mt-0.5">{content.category}</p>
                </div>
              </div>

              {/* Controls & Progress */}
              <div className="flex flex-col items-center flex-[2] w-full gap-2">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 text-black fill-black" /> : <Play className="w-5 h-5 text-black fill-black ml-1" />}
                  </button>
                </div>

                <div className="flex items-center w-full gap-3 text-xs text-gray-400 font-medium">
                  <span>{currentTime}</span>
                  <div 
                    className="flex-1 h-1.5 bg-gray-800 rounded-full cursor-pointer relative overflow-hidden group"
                    onClick={handleProgressBarClick}
                  >
                    <div 
                      className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
                    </div>
                  </div>
                  <span>{durationStr}</span>
                </div>
              </div>

              {/* Extra Controls */}
              <div className="flex-1 flex justify-end items-center gap-4 hidden md:flex">
                <Volume2 className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <button 
                  onClick={() => {
                    setShowPlayer(false);
                    if (audioRef.current) {
                      audioRef.current.pause();
                      setIsPlaying(false);
                    }
                  }}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
