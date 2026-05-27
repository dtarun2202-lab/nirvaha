import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Wind, 
  Bell, 
  Mountain, 
  Leaf, 
  Disc, 
  Waves, 
  Flame, 
  Activity,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SOUNDS = [
  { id: 'om_chant', name: 'OM Chant', path: '/audio/emotional/Chakra-Harmony.mp3', icon: Sparkles },
  { id: 'flute_meditation', name: 'Flute Meditation', path: '/audio/meditation/Meditation-at-Sunrise.mp3', icon: Wind },
  { id: 'temple_bells', name: 'Temple Bells', path: '/audio/meditation/Sacred-Sound-Bath.mp3', icon: Bell },
  { id: 'himalayan_ambience', name: 'Himalayan Ambience', path: '/audio/anxiety/Soft-Meadow-Breeze.mp3', icon: Mountain },
  { id: 'nature_healing', name: 'Nature Healing', path: '/audio/focus/Minimal-Nature-Sounds.mp3', icon: Leaf },
  { id: 'singing_bowl', name: 'Singing Bowl', path: '/audio/meditation/Tibetan-Bowl-Journey.mp3', icon: Disc },
  { id: 'water_ambience', name: 'Water Ambience', path: '/audio/stress/Ocean-Waves-Calm.mp3', icon: Waves },
  { id: 'ancient_mantra', name: 'Ancient Mantra', path: '/audio/emotional/Sacred-Geometry.mp3', icon: Flame },
  { id: 'deep_meditation_hum', name: 'Deep Med Hum', path: '/audio/sleep-delta.mp3', icon: Activity }
];
import BACKEND_CONFIG from '@/config/backend';

interface Retreat {
  _id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  externalLink: string;
  buttonLabel: string;
  displayOrder: number;
}

export const WellnessRetreats = () => {
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activePopupRetreatId, setActivePopupRetreatId] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<{ retreatId: string; soundId: string } | null>(null);
  const [hoveredSoundName, setHoveredSoundName] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRetreatId, setModalRetreatId] = useState<string | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  const playingRetreat = playingAudio?.retreatId || null;

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.sound-popup-container') && !target.closest('.sound-toggle-btn')) {
        setActivePopupRetreatId(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    const fetchRetreats = async () => {
      try {
        const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/wellness-retreats`);
        if (response.ok) {
          const data = await response.json();
          setRetreats(data.retreats || []);
        }
      } catch (error) {
        console.error('Error fetching retreats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRetreats();
  }, []);

  const updateScrollButtons = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    updateScrollButtons();
    return () => el.removeEventListener('scroll', updateScrollButtons);
  }, [retreats]);

  const playSound = (retreatId: string, sound: typeof SOUNDS[0]) => {
    if (playingAudio && playingAudio.retreatId === retreatId && playingAudio.soundId === sound.id) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
      setPlayingAudio(null);
      return;
    }

    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }

    const audio = new Audio(sound.path);
    audio.loop = true;
    audio.volume = 0.8;
    audio.play().catch((err) => {
      console.warn("Audio playback failed:", err);
    });

    activeAudioRef.current = audio;
    setPlayingAudio({ retreatId, soundId: sound.id });
  };

  useEffect(() => {
    return () => {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.clientWidth * 0.45;
      const offset = direction === 'left' ? -cardWidth : cardWidth;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-[#F5F0E8] min-h-[40vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#1a5d47] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-medium tracking-wide text-sm">Discovering retreats...</p>
        </div>
      </section>
    );
  }

  if (retreats.length === 0) return null;

  return (
    <section className="bg-[#F7F3EC] py-16 md:py-24 overflow-hidden relative">

      {/* Soft background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #d4e9d8 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #e8f5e1 0%, transparent 40%)`
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12">

        {/* ── Centered Section Header ── */}
        <motion.div
          className="text-center mb-4 md:mb-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[#1a5d47] text-xs font-bold uppercase tracking-[0.25em] mb-4">
            Nirvaha Escapes
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] tracking-tight mb-5 leading-tight"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Find your next Retreat
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Join real people who create real connections. Experience meditation, yoga, and
            wellness in extraordinary locations worldwide.
          </p>
        </motion.div>

        {/* ── Slider Controls Row ── */}
        <div className="flex items-center justify-end mb-2 gap-3">
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 ${
              canScrollLeft
                ? 'border-[#1a5d47] text-[#1a5d47] hover:bg-[#1a5d47] hover:text-white'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 ${
              canScrollRight
                ? 'border-[#1a5d47] text-[#1a5d47] hover:bg-[#1a5d47] hover:text-white'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* ── Horizontal Card Scroller ── */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory cursor-grab active:cursor-grabbing pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {retreats.map((retreat, idx) => (
            <motion.div
              key={retreat._id}
              className="flex-shrink-0 snap-start"
              style={{ width: 'clamp(280px, 42vw, 560px)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: idx * 0.08, duration: 0.55 }}
            >
              <div
                className="group block relative rounded-[20px] overflow-hidden bg-gray-100 shadow-md hover:shadow-2xl transition-all duration-500 cursor-default"
              >
                {/* Image */}
                <div 
                  className={`aspect-[4/3] relative overflow-hidden ${idx === 0 ? 'cursor-pointer' : ''}`}
                  onClick={() => {
                    if (idx === 0) {
                      setModalRetreatId(retreat._id);
                      setIsModalOpen(true);
                    }
                  }}
                >
                  <img
                    src={retreat.image}
                    alt={retreat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Dark gradient overlay — bottom half */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Audio Playback Toggle Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActivePopupRetreatId(activePopupRetreatId === retreat._id ? null : retreat._id);
                    }}
                    className={`sound-toggle-btn absolute top-4 left-4 p-2.5 rounded-full backdrop-blur-md shadow-md border transition-all duration-300 z-20 ${
                      playingRetreat === retreat._id
                        ? "bg-[#1a5d47] border-[#1a5d47] text-white hover:bg-[#154b39] scale-110"
                        : "bg-white/70 border-teal-100/50 text-[#1a5d47] hover:bg-white/90 hover:scale-105"
                    }`}
                    aria-label={playingRetreat === retreat._id ? "Stop Audio" : "Play Ambient Sound"}
                  >
                    {playingRetreat === retreat._id ? (
                      <div className="flex items-center gap-1">
                        <Volume2 className="w-4 h-4 animate-pulse text-white" />
                        <span className="flex items-end gap-0.5 h-3 px-0.5 text-white">
                          <span className="w-0.5 bg-current animate-bounce h-2" style={{ animationDelay: '0.1s', animationDuration: '0.6s' }}></span>
                          <span className="w-0.5 bg-current animate-bounce h-3" style={{ animationDelay: '0.2s', animationDuration: '0.4s' }}></span>
                          <span className="w-0.5 bg-current animate-bounce h-1.5" style={{ animationDelay: '0.3s', animationDuration: '0.5s' }}></span>
                        </span>
                      </div>
                    ) : (
                      <VolumeX className="w-4 h-4 text-[#1a5d47]/80" />
                    )}
                  </button>

                  {/* 9-Sound Dropdown Menu */}
                  <AnimatePresence>
                    {activePopupRetreatId === retreat._id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="sound-popup-container absolute top-14 left-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-2 border border-emerald-100/50 z-30 flex flex-col w-36 pointer-events-auto"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <div className="text-[9px] font-bold text-emerald-800 text-center mb-1.5 tracking-wider uppercase truncate h-3.5 border-b border-emerald-100/30 pb-0.5">
                          {hoveredSoundName || 
                           (playingAudio?.retreatId === retreat._id 
                              ? SOUNDS.find(s => s.id === playingAudio?.soundId)?.name 
                              : null) || 
                           'Select Sound'}
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {SOUNDS.map((sound) => {
                            const isSoundPlaying = playingAudio?.retreatId === retreat._id && playingAudio?.soundId === sound.id;
                            const SoundIcon = sound.icon;
                            return (
                              <button
                                key={sound.id}
                                onMouseEnter={() => setHoveredSoundName(sound.name)}
                                onMouseLeave={() => setHoveredSoundName(null)}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  playSound(retreat._id, sound);
                                }}
                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                  isSoundPlaying
                                    ? 'bg-[#1a5d47] text-white shadow-sm ring-2 ring-emerald-200 scale-105'
                                    : 'bg-emerald-50/60 text-emerald-800 hover:bg-[#1a5d47]/20 hover:scale-105 active:scale-95'
                                }`}
                                title={sound.name}
                              >
                                <SoundIcon className="w-4.5 h-4.5" />
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Category label at BOTTOM of image */}
                  <div className="absolute bottom-0 left-0 right-0 px-6 py-5">
                    <span className="block text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                      {retreat.category}
                    </span>
                    <h3 className="text-white text-xl md:text-2xl font-bold leading-snug tracking-tight">
                      {retreat.title}
                    </h3>
                  </div>

                  {/* Arrow icon top-right on hover */}
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/0 group-hover:bg-white/90 flex items-center justify-center transition-all duration-300 scale-75 group-hover:scale-100">
                    <ArrowUpRight className="w-4 h-4 text-[#1a5d47] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Card Footer – description + CTA */}
                {(retreat.description || retreat.buttonLabel) && (
                  <div className="bg-white px-6 py-5 flex items-center justify-between gap-4">
                    {retreat.description && (
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">
                        {retreat.description}
                      </p>
                    )}
                    <a
                      onClick={(e) => e.stopPropagation()}
                      href={retreat.externalLink || '#'}
                      target={retreat.externalLink ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="flex-shrink-0 inline-flex items-center gap-1.5 text-[#1a5d47] font-semibold text-xs uppercase tracking-widest border border-[#1a5d47]/30 rounded-full px-4 py-2 group-hover:bg-[#1a5d47] group-hover:text-white group-hover:border-transparent hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap cursor-pointer"
                    >
                      {retreat.buttonLabel || 'Explore'}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Centered Sound Sanctuary Modal */}
      <AnimatePresence>
        {isModalOpen && modalRetreatId && (() => {
          const retreat = retreats.find(r => r._id === modalRetreatId);
          if (!retreat) return null;
          const isRetreatPlaying = playingAudio?.retreatId === retreat._id;
          const activeSoundObj = isRetreatPlaying ? SOUNDS.find(s => s.id === playingAudio?.soundId) : null;
          const displayText = hoveredSoundName || activeSoundObj?.name || 'Sanctuary Ambient Selector';

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-emerald-100/50 max-w-sm w-full relative flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-emerald-800/60 hover:text-emerald-950 hover:bg-emerald-50 p-2 rounded-full transition-all duration-200"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Modal Title / Subtitle */}
                <div className="text-center mb-6 mt-2">
                  <span className="text-[10px] font-bold text-[#1a5d47] uppercase tracking-[0.2em] block mb-1">
                    Vedic Sound Sanctuary
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight leading-tight px-6 truncate max-w-[280px]">
                    {retreat.title}
                  </h3>
                  <div className="text-xs text-gray-500 font-medium tracking-wide mt-2 h-4 uppercase text-[#1a5d47]/80">
                    {displayText}
                  </div>
                </div>

                {/* 3x3 circular buttons grid */}
                <div className="grid grid-cols-3 gap-4 justify-items-center w-full px-2">
                  {SOUNDS.map((sound) => {
                    const isSoundPlaying = playingAudio?.retreatId === retreat._id && playingAudio?.soundId === sound.id;
                    const SoundIcon = sound.icon;
                    return (
                      <div key={sound.id} className="flex flex-col items-center gap-1.5 animate-fade-in">
                        <button
                          onClick={() => playSound(retreat._id, sound)}
                          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer ${
                            isSoundPlaying
                              ? 'bg-[#1a5d47] text-white ring-4 ring-emerald-100 scale-105 shadow-emerald-700/20'
                              : 'bg-emerald-50/70 text-[#1a5d47] hover:bg-[#1a5d47] hover:text-white hover:scale-105 active:scale-95'
                          }`}
                          onMouseEnter={() => setHoveredSoundName(sound.name)}
                          onMouseLeave={() => setHoveredSoundName(null)}
                          title={sound.name}
                        >
                          <SoundIcon className="w-6 h-6" />
                        </button>
                        <span className="text-[9px] font-medium text-gray-400 text-center truncate max-w-[70px]">
                          {sound.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
};
