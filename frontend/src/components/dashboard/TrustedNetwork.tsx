import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, ExternalLink, Music, Link, Share2 } from 'lucide-react';

// ---------------------------------------------------------------------------
// Data – each card has 9 unique thematically related sounds
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
        url: "/audio/anxiety-crystal-bowl.mp3",
      },
      {
        id: "v4",
        label: "Gayatri Mantra",
        icon: "☀️",
        description: "Sacred chant for wisdom and enlightenment",
        url: "/audio/meditation/Crystal-Frequency-Healing.mp3",
      },
      {
        id: "v5",
        label: "Rudra Chamakam",
        icon: "🔥",
        description: "Vedic hymn invoking cosmic energies",
        url: "/audio/emotional/Healing-Bowls.mp3",
      },
      {
        id: "v6",
        label: "Om Chanting",
        icon: "🕉️",
        description: "Primordial sound of the universe",
        url: "/audio/meditation/Indoor-Calm-Meditation.mp3",
      },
      {
        id: "v7",
        label: "Saraswati Vandana",
        icon: "🎶",
        description: "Prayer for knowledge and arts",
        url: "/audio/emotional/Chakra-Harmony.mp3",
      },
      {
        id: "v8",
        label: "Durga Suktam",
        icon: "🛡️",
        description: "Vedic prayer for protection and strength",
        url: "/audio/emotional/Sacred-Geometry.mp3",
      },
      {
        id: "v9",
        label: "Sacred Sound Bath",
        icon: "🥣",
        description: "Deep resonance healing bowl soundscape",
        url: "/audio/burnout-432hz.mp3",
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
        url: "/audio/sleep/Moonlight-Lullaby.mp3",
      },
      {
        id: "m4",
        label: "Deep Breath Meditation",
        icon: "💨",
        description: "Guided breathing rhythms for calm",
        url: "/audio/focus/Minimal-Nature-Sounds.mp3",
      },
      {
        id: "m5",
        label: "Sunrise Meditation",
        icon: "🌅",
        description: "Gentle music for morning awareness",
        url: "/audio/stress/Ocean-Waves-Calm.mp3",
      },
      {
        id: "m6",
        label: "Yoga Nidra Flow",
        icon: "🧘",
        description: "Deep relaxation and sleep meditation",
        url: "/audio/sleep/Starlit-Delta-Waves.mp3",
      },
      {
        id: "m7",
        label: "Forest Stream",
        icon: "🌲",
        description: "Nature sounds for mindfulness focus",
        url: "/audio/stress-nature.mp3",
      },
      {
        id: "m8",
        label: "Raindrops for Calm",
        icon: "🌧️",
        description: "Gentle rain sounds for stress relief",
        url: "/audio/stress/Gentle-Rain-Drops.mp3",
      },
      {
        id: "m9",
        label: "Soft Meadow Breeze",
        icon: "🍃",
        description: "Calm wind and nature ambiance",
        url: "/audio/anxiety/Soft-Meadow-Breeze.mp3",
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
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

  // Handle sound query param on load to auto-play shared sounds
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const soundParam = params.get("sound");
    if (soundParam) {
      const matchedCard = ADS_DATA.find((ad) => ad.sounds.some((s) => s.id === soundParam));
      if (matchedCard) {
        setOpenAdId(matchedCard.id);
        const matchedSound = matchedCard.sounds.find((s) => s.id === soundParam);
        if (matchedSound && audioRef.current) {
          audioRef.current.src = matchedSound.url;
          audioRef.current.currentTime = 0;
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.play().catch((err) => {
                console.log("Auto-play blocked by browser. Interaction needed:", err);
              });
            }
          }, 300);
          setPlayingTrackId(soundParam);
        }
      }
    }
  }, []);

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

  const handleCopyLink = (trackId: string, trackLabel: string) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?sound=${trackId}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setToastMessage(`Copied link for ${trackLabel}!`);
        setTimeout(() => setToastMessage(null), 2500);
      })
      .catch((err) => console.error("Failed to copy link:", err));
  };

  const handleShare = async (trackId: string, trackLabel: string) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?sound=${trackId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Listen to ${trackLabel} on Nirvaha`,
          text: `Check out this sound: ${trackLabel}`,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setToastMessage(`Link copied to clipboard for sharing!`);
      setTimeout(() => setToastMessage(null), 2500);
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
              className="relative w-full max-w-2xl rounded-[2rem] overflow-hidden"
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
              <div className="px-6 pb-6 pt-4 max-h-[calc(100vh-14rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                <h3 className="text-xl font-['Cinzel'] text-white mb-1">{openAd.alt}</h3>
                <p className="text-sm mb-6" style={{ color: openAd.accent + "bb" }}>
                  {openAd.description}
                </p>

                {/* 3D Soundboard Buttons Grid (Myinstants Style) */}
                <div className="grid grid-cols-3 gap-4 sm:gap-5 justify-items-center mb-4 pt-2">
                  {openAd.sounds.map((track) => {
                    const isPlaying = playingTrackId === track.id;
                    return (
                      <div key={track.id} className="flex flex-col items-center w-full max-w-[120px] mb-2">
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
                        <span className="text-[9px] text-[#A8C7B4] opacity-75 mt-0.5 text-center leading-tight line-clamp-2 px-0.5 h-6">
                          {track.description}
                        </span>

                        {/* Action Buttons (Share, Copy Link) */}
                        <div className="flex gap-1.5 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyLink(track.id, track.label);
                            }}
                            className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all active:scale-95"
                            title="Copy Link"
                            aria-label="Copy Link"
                          >
                            <Link className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(track.id, track.label);
                            }}
                            className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all active:scale-95"
                            title="Share Sound"
                            aria-label="Share Sound"
                          >
                            <Share2 className="w-3 h-3" />
                          </button>
                        </div>
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

              {/* Toast Notification */}
              <AnimatePresence>
                {toastMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-black/90 border border-white/20 text-white text-xs font-semibold shadow-2xl backdrop-blur-md pointer-events-none z-[10000] text-center whitespace-nowrap"
                  >
                    {toastMessage}
                  </motion.div>
                )}
              </AnimatePresence>
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

                    {/* "9 Sounds" badge */}
                    <div
                      className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{
                        background: "rgba(0,0,0,0.55)",
                        color: ad.accent,
                        border: `1px solid ${ad.accent}44`,
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      9 Sounds
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
