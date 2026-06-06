import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, ExternalLink, Music } from 'lucide-react';

// ---------------------------------------------------------------------------
// Data – each card has 3 thematically related sounds
// ---------------------------------------------------------------------------
const ADS_DATA = [
  {
    id: 1,
    image: "/about/ADS/vedic chants.png",
    link: "https://www.jiosaavn.com/album/powerful-vedic-chants/A3owXFDaI4Q_",
    alt: "Vedic Chants",
    description: "Powerful Vedic Chants by Priests of Kashi — sacred suktas on JioSaavn.",
    theme: "Sacred Vedic Frequencies",
    accent: "#C4A35A",
    accentDim: "rgba(196,163,90,0.15)",
    sounds: [
      {
        id: "v1",
        label: "Purush Sukta",
        icon: "🕉️",
        description: "Ancient Vedic hymn for cosmic consciousness",
        url: "/audio/stress/Tibetan-Bowls.mp3",
      },
      {
        id: "v2",
        label: "Mahamrityunjay Mantra",
        icon: "🧘",
        description: "The great liberation mantra for healing",
        url: "/audio/meditation/Sacred-Sound-Bath.mp3",
      },
      {
        id: "v3",
        label: "Shanti Sukta",
        icon: "🕊️",
        description: "Powerful Sanskrit chants for universal peace",
        url: "/audio/meditation/Crystal-Frequency-Healing.mp3",
      },
    ],
    delay: 0,
  },
  {
    id: 2,
    image: "/about/ADS/med spotify.png",
    link: "https://www.jiosaavn.com/album/peace-of-mind/ZMr0o3I8EuQ_",
    alt: "JioSaavn Meditation",
    description: "Peace of Mind by Peaceful Music Orchestra — calming meditation on JioSaavn.",
    theme: "Mindful Soundscapes",
    accent: "#7A9384",
    accentDim: "rgba(122,147,132,0.15)",
    sounds: [
      {
        id: "m1",
        label: "Peace of Mind",
        icon: "🌿",
        description: "Peaceful Music Orchestra · Peace of Mind · JioSaavn",
        url: "/audio/meditation/Nature-Meditation.mp3",
      },
      {
        id: "m2",
        label: "Nirvana — Meditation Music",
        icon: "🧘",
        description: "Peaceful Music Orchestra · Peace of Mind · JioSaavn",
        url: "/audio/meditation/Deep-Breath-Meditation.mp3",
      },
      {
        id: "m3",
        label: "Ambient for Inner Peace",
        icon: "🌙",
        description: "Peaceful Music Orchestra · Peace of Mind · JioSaavn",
        url: "/audio/meditation/Yoga-Nidra-Flow.mp3",
      },
    ],
    delay: 1.5,
  },
];

// ---------------------------------------------------------------------------
// Sub-component: animated waveform bars
// ---------------------------------------------------------------------------
const WaveformBars = ({ color }: { color: string }) => {
  const delays = [0.1, 0.4, 0.2, 0.7, 0.3, 0.6, 0.15, 0.5, 0.25, 0.45];
  return (
    <div className="flex items-end gap-[3px] h-8">
      {delays.map((d, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full"
          style={{ backgroundColor: color, height: "4px" }}
          animate={{ height: ["4px", "28px", "4px"] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: d }}
        />
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export const TrustedNetwork = () => {
  const [openAdId, setOpenAdId] = useState<number | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialise single shared audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;

    const handleEnded = () => setPlayingTrackId(null);
    audioRef.current.addEventListener("ended", handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleEnded);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Stop audio and reset when modal closes
  useEffect(() => {
    if (openAdId === null && audioRef.current) {
      audioRef.current.pause();
      setPlayingTrackId(null);
    }
  }, [openAdId]);

  const handleTrackClick = (trackId: string, url: string) => {
    if (!audioRef.current) return;

    if (playingTrackId === trackId) {
      // Same track — toggle
      if (audioRef.current.paused) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
        setPlayingTrackId(null);
      }
    } else {
      // New track — switch
      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
      setPlayingTrackId(trackId);
    }
  };

  const openAd = ADS_DATA.find((a) => a.id === openAdId) ?? null;

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Full-screen modal                                                   */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {openAd && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(5,12,9,0.88)", backdropFilter: "blur(14px)" }}
            onClick={() => setOpenAdId(null)}
          >
            <motion.div
              key="modal-card"
              initial={{ scale: 0.88, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="relative w-full max-w-lg rounded-[2rem] overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #0F1F17 0%, #091510 100%)",
                border: `1px solid ${openAd.accent}33`,
                boxShadow: `0 40px 80px rgba(0,0,0,0.7), 0 0 60px ${openAd.accentDim}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Ambient glow top */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ background: openAd.accent }}
              />

              {/* Header image strip */}
              <div className="relative w-full h-44 overflow-hidden">
                <img
                  src={openAd.image}
                  alt={openAd.alt}
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.55) saturate(1.2)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#091510]" />

                {/* Theme label */}
                <div className="absolute bottom-4 left-6">
                  <span
                    className="text-xs font-semibold tracking-[0.18em] uppercase px-3 py-1 rounded-full"
                    style={{ background: `${openAd.accent}22`, color: openAd.accent, border: `1px solid ${openAd.accent}44` }}
                  >
                    {openAd.theme}
                  </span>
                </div>

                {/* Close button */}
                <button
                  onClick={() => setOpenAdId(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.12)" }}
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Modal body */}
              <div className="px-6 pb-6 pt-4">
                <h3 className="text-xl font-['Cinzel'] text-white mb-1">{openAd.alt}</h3>
                <p className="text-sm mb-6" style={{ color: openAd.accent + "bb" }}>
                  {openAd.description}
                </p>

                {/* 3D Soundboard Buttons Grid (Myinstants Style) */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 justify-items-center mb-4 pt-2">
                  {openAd.sounds.map((track) => {
                    const isPlaying = playingTrackId === track.id;
                    return (
                      <div key={track.id} className="flex flex-col items-center w-full max-w-[100px]">
                        {/* 3D Button Container */}
                        <div className="relative h-20 flex items-center justify-center">
                          {/* Pulsing ring behind button when playing */}
                          {isPlaying && (
                            <>
                              <motion.div
                                className="absolute inset-[-6px] rounded-full border border-dashed opacity-60 pointer-events-none"
                                style={{ borderColor: openAd.accent }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                              />
                              <motion.div
                                className="absolute inset-0 rounded-full blur-md opacity-40 pointer-events-none"
                                style={{ background: openAd.accent }}
                                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                              />
                            </>
                          )}

                          {/* The 3D Button */}
                          <motion.button
                            onClick={() => handleTrackClick(track.id, track.url)}
                            whileHover={{ scale: isPlaying ? 1 : 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            animate={{
                              y: isPlaying ? 6 : 0,
                              boxShadow: isPlaying
                                ? `0 2px 0 rgba(0,0,0,0.8), inset 0 2px 4px rgba(0,0,0,0.5)`
                                : `0 8px 0 rgba(0,0,0,0.6), inset 0 4px 6px rgba(255,255,255,0.3), inset 0 -4px 6px rgba(0,0,0,0.3)`,
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center cursor-pointer relative overflow-hidden select-none outline-none focus:outline-none"
                            style={{
                              background: `linear-gradient(135deg, ${openAd.accent} 0%, ${openAd.accent}dd 60%, ${openAd.accent}aa 100%)`,
                            }}
                            aria-label={`Play ${track.label}`}
                          >
                            {/* Shiny gloss overlay */}
                            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent rounded-t-full pointer-events-none" />
                            
                            {/* Emoji Icon */}
                            <span className="text-xl sm:text-2xl filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)] select-none">
                              {track.icon}
                            </span>
                          </motion.button>
                        </div>

                        {/* Labels */}
                        <span className="text-[11px] font-semibold text-[#FAFAF8] mt-2 tracking-wide text-center truncate w-full px-1">
                          {track.label}
                        </span>
                        <span className="text-[9px] text-[#A8C7B4] opacity-75 mt-0.5 text-center leading-tight line-clamp-2 px-0.5">
                          {track.description}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Now Playing visualizer bar */}
                <AnimatePresence>
                  {playingTrackId && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: 10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: 10 }}
                      className="mt-2 mb-4 p-3 rounded-2xl flex items-center justify-between border backdrop-blur-md overflow-hidden"
                      style={{
                        background: `${openAd.accent}12`,
                        borderColor: `${openAd.accent}33`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl select-none">
                          {openAd.sounds.find((s) => s.id === playingTrackId)?.icon}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: openAd.accent }}>
                            Now Playing
                          </span>
                          <span className="text-xs font-semibold text-white truncate max-w-[180px]">
                            {openAd.sounds.find((s) => s.id === playingTrackId)?.label}
                          </span>
                        </div>
                      </div>
                      <WaveformBars color={openAd.accent} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* External link CTA */}
                <a
                  href={openAd.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:opacity-90 hover:scale-[1.01]"
                  style={{
                    background: `linear-gradient(135deg, ${openAd.accent}cc, ${openAd.accent}88)`,
                    color: "#0F1F17",
                  }}
                >
                  <Music className="w-4 h-4" />
                  Stream Full Session
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* Section                                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative w-full bg-gradient-to-br from-[#1A2F24] to-[#0A1410] py-24 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7A9384] rounded-full mix-blend-screen filter blur-[128px] opacity-10 animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#4A6155] rounded-full mix-blend-screen filter blur-[128px] opacity-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-['Cinzel'] text-[#FAFAF8] mb-4 tracking-wide">
              Trusted Network
            </h2>
            <div className="w-16 h-1 bg-[#7A9384] mx-auto rounded-full mb-6 opacity-50" />
            <p className="text-[#A8C7B4] max-w-2xl mx-auto text-lg font-light">
              Discover premium offerings and experiences from our trusted partners.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
            {ADS_DATA.map((ad) => (
              <motion.div
                key={ad.id}
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: ad.delay,
                }}
                className="w-full max-w-md"
              >
                {/* Card — outer is NOT a link; image click opens modal */}
                <div className="block relative group rounded-[2rem] overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-4 transition-all duration-500 hover:bg-white/10 hover:border-white/20 shadow-2xl hover:shadow-[0_0_40px_rgba(122,147,132,0.3)]">

                  {/* Clickable image — opens modal */}
                  <button
                    type="button"
                    onClick={() => setOpenAdId(ad.id)}
                    className="relative w-full rounded-2xl overflow-hidden aspect-[1.4/1] cursor-pointer block focus:outline-none"
                    aria-label={`Preview sounds for ${ad.alt}`}
                  >
                    <img
                      src={ad.image}
                      alt={ad.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Hover play icon */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300"
                        style={{ background: `${ad.accent}ee` }}
                      >
                        <Play className="w-6 h-6 ml-1" />
                      </div>
                    </div>

                    {/* "3 Sounds" badge */}
                    <div
                      className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{
                        background: "rgba(0,0,0,0.55)",
                        color: ad.accent,
                        border: `1px solid ${ad.accent}44`,
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      3 Sounds
                    </div>
                  </button>

                  {/* Card footer */}
                  <div className="mt-6 mb-2 flex items-center justify-between px-4 gap-4">
                    <div className="flex flex-col">
                      <span className="text-[#FAFAF8] font-['Cinzel'] text-xl tracking-wide mb-1">{ad.alt}</span>
                      <span className="text-[#A8C7B4] font-sans text-sm font-light leading-relaxed">{ad.description}</span>
                    </div>
                    <a
                      href={ad.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#7A9384] transition-colors duration-300 flex-shrink-0"
                      aria-label={`Open ${ad.alt}`}
                    >
                      <ExternalLink className="w-4 h-4 text-white" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
