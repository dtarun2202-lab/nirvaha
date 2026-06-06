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
    description: "Experience the ancient resonance of powerful chants for deep healing.",
    theme: "Sacred Vedic Frequencies",
    accent: "#C4A35A",
    accentDim: "rgba(196,163,90,0.15)",
    sounds: [
      {
        id: "v1",
        label: "Temple Bells & Chimes",
        icon: "🔔",
        description: "Sacred temple bells and chime resonances",
        url: "/audio/stress/Tibetan-Bowls.mp3",
      },
      {
        id: "v2",
        label: "Om Mantra Resonance",
        icon: "🕉️",
        description: "Deep, resonant Om chanting sound bath",
        url: "/audio/meditation/Sacred-Sound-Bath.mp3",
      },
      {
        id: "v3",
        label: "Pranayama Breath Slokas",
        icon: "🧘",
        description: "Soothing pranayama breathing frequencies",
        url: "/audio/meditation/Deep-Breath-Meditation.mp3",
      },
    ],
    delay: 0,
  },
  {
    id: 2,
    image: "/about/ADS/med spotify.png",
    link: "https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u",
    alt: "Spotify Meditation",
    description: "Curated frequencies and guided journeys for your daily practice.",
    theme: "Mindful Soundscapes",
    accent: "#7A9384",
    accentDim: "rgba(122,147,132,0.15)",
    sounds: [
      {
        id: "m1",
        label: "Nature Meditation",
        icon: "🌿",
        description: "Soft forest sounds for mindful awareness",
        url: "/audio/meditation/Nature-Meditation.mp3",
      },
      {
        id: "m2",
        label: "Ocean Waves Calm",
        icon: "🌊",
        description: "Rhythmic ocean tides for deep relaxation",
        url: "/audio/stress/Ocean-Waves-Calm.mp3",
      },
      {
        id: "m3",
        label: "Deep Breath Meditation",
        icon: "🧘",
        description: "Pleasant and soothing breath-focused tones",
        url: "/audio/meditation/Deep-Breath-Meditation.mp3",
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

                {/* Track list */}
                <div className="flex flex-col gap-3">
                  {openAd.sounds.map((track) => {
                    const isPlaying = playingTrackId === track.id;
                    return (
                      <motion.button
                        key={track.id}
                        onClick={() => handleTrackClick(track.id, track.url)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full text-left flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden"
                        style={{
                          background: isPlaying ? `${openAd.accent}18` : "rgba(255,255,255,0.04)",
                          border: `1px solid ${isPlaying ? openAd.accent + "55" : "rgba(255,255,255,0.07)"}`,
                        }}
                      >
                        {/* Playing shimmer */}
                        {isPlaying && (
                          <motion.div
                            className="absolute inset-0 pointer-events-none"
                            animate={{ opacity: [0, 0.08, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{ background: `radial-gradient(ellipse at center, ${openAd.accent}, transparent)` }}
                          />
                        )}

                        {/* Icon / Play-Pause button */}
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-lg relative"
                          style={{
                            background: isPlaying ? openAd.accent + "33" : "rgba(255,255,255,0.06)",
                            border: `1px solid ${isPlaying ? openAd.accent + "66" : "rgba(255,255,255,0.08)"}`,
                          }}
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4" style={{ color: openAd.accent }} />
                          ) : (
                            <span className="text-base">{track.icon}</span>
                          )}
                        </div>

                        {/* Labels + waveform */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-semibold text-white truncate">{track.label}</span>
                            {isPlaying && (
                              <span
                                className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full flex-shrink-0"
                                style={{ background: openAd.accent + "22", color: openAd.accent }}
                              >
                                Now Playing
                              </span>
                            )}
                          </div>
                          {isPlaying ? (
                            <WaveformBars color={openAd.accent} />
                          ) : (
                            <span className="text-xs text-white/40">{track.description}</span>
                          )}
                        </div>

                        {/* Right play icon (when not playing) */}
                        {!isPlaying && (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: openAd.accent + "18" }}
                          >
                            <Play className="w-3 h-3 ml-0.5" style={{ color: openAd.accent }} />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

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
