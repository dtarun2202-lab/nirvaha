import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Share2, Download, ChevronRight, Search, X, ListPlus, Heart, Clock, Plus, Bookmark, Music, Hash } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import BACKEND_CONFIG from "../../config/backend";
import Iridescence from '../Iridescence';

const fallbackLibrary = [
  // Meditation Journey Collection
  {
    title: "Meditation at Sunrise",
    artist: "Sacred Sounds Collective",
    frequency: "432 Hz",
    duration: "15:30",
    category: "Meditation",
    description: "Begin your day with peaceful sunrise meditation sounds.",
    tags: ["meditation", "morning", "peace"],
    thumbnailUrl: "/images/Meditation at Sunrise.jpg",
    audioUrl: "/audio/meditation/Meditation-at-Sunrise.mp3"
  },
  {
    title: "Indoor Calm Meditation",
    artist: "Inner Peace Studio",
    frequency: "528 Hz",
    duration: "20:00",
    category: "Meditation",
    description: "Find tranquility in your indoor meditation practice.",
    tags: ["meditation", "calm", "mindful"],
    thumbnailUrl: "/images/Indoor Calm Meditation.jpg",
    audioUrl: "/audio/meditation/Indoor-Calm-Meditation.mp3"
  },
  {
    title: "Nature Meditation",
    artist: "Earth Harmony",
    frequency: "396 Hz",
    duration: "25:00",
    category: "Meditation",
    description: "Connect with nature through guided meditation sounds.",
    tags: ["meditation", "nature", "peace"],
    thumbnailUrl: "/images/Nature Meditation.jpg",
    audioUrl: "/audio/meditation/Nature-Meditation.mp3"
  },
  // Sleep Therapy Collection
  {
    title: "Cozy Bed",
    artist: "Sleep Sanctuary",
    frequency: "528 Hz",
    duration: "60:00",
    category: "Sleep",
    description: "Drift into peaceful sleep in your cozy sanctuary.",
    tags: ["sleep", "night", "deep"],
    thumbnailUrl: "/images/Cozy Bed.jpg",
    audioUrl: "/audio/sleep/Moonlight-Lullaby.mp3"
  },
  {
    title: "Window Night Sky View",
    artist: "Nocturnal Sounds",
    frequency: "432 Hz",
    duration: "45:00",
    category: "Sleep",
    description: "Gaze at the stars through your window as you drift to sleep.",
    tags: ["sleep", "night", "deep"],
    thumbnailUrl: "/images/Window Night Sky View.jpg",
    audioUrl: "/audio/sleep/Night-Ocean-Waves.mp3"
  },
  {
    title: "Peaceful Sleeping Scene",
    artist: "Dream Weavers",
    frequency: "396 Hz",
    duration: "50:00",
    category: "Sleep",
    description: "Create the perfect atmosphere for restful sleep.",
    tags: ["sleep", "night", "deep"],
    thumbnailUrl: "/images/Peaceful Sleeping Scene.jpeg",
    audioUrl: "/audio/sleep/Starlit-Delta-Waves.mp3"
  }
];

const fallbackImages = [
  "/sound/tibetan_bowls.png",
  "/sound/ocean_waves.png",
  "/sound/binaural_beats.png",
  "/sound/crystal_bowls.png",
  "/sound/forest_ambience.png",
  "/sound/chakra_tuning.png",
];

const sacredInstruments = [
  {
    id: 1,
    name: "Tibetan Singing Bowl",
    icon: "🎵",
    image: "/instruments/tibetan-bowl.jpg",
    history: "Tibetan singing bowls have been used for over 2,000 years in meditation and healing practices. Originally crafted by Tibetan monks, these bowls were made from seven sacred metals representing celestial bodies.",
    science: "The bowls produce harmonic overtones that synchronize brainwaves, promoting alpha and theta states associated with deep relaxation and meditation. Research shows they can reduce stress hormones and blood pressure.",
    benefits: "• Reduces stress and anxiety\n• Improves focus and clarity\n• Balances chakras and energy centers\n• Promotes deep meditation states\n• Enhances sleep quality"
  },
  {
    id: 2,
    name: "Crystal Singing Bowl",
    icon: "💎",
    image: "/instruments/crystal-bowl.jpg",
    history: "Crystal singing bowls emerged in the 1980s, crafted from pure quartz crystal. They were developed as a modern interpretation of traditional Tibetan bowls, harnessing the piezoelectric properties of quartz.",
    science: "Quartz crystal vibrates at specific frequencies that resonate with the human body's energy field. The pure tones help reorganize cellular structure and promote healing at a molecular level.",
    benefits: "• Clears energy blockages\n• Amplifies healing intentions\n• Purifies aura and chakras\n• Enhances spiritual connection\n• Promotes cellular regeneration"
  },
  {
    id: 3,
    name: "Sacred Flute",
    icon: "🪈",
    image: "/instruments/sacred-flute.jpg",
    history: "Sacred flutes have been used across cultures for millennia - from Native American ceremonies to Indian classical music. The breath-based instrument connects the player's life force with sound healing.",
    science: "Flute music activates the parasympathetic nervous system, lowering cortisol levels and promoting healing. The breath control required also increases oxygen flow and mindfulness.",
    benefits: "• Calms the nervous system\n• Improves respiratory function\n• Enhances emotional expression\n• Connects breath with sound\n• Promotes mindful awareness"
  },
  {
    id: 4,
    name: "Ceremonial Gong",
    icon: "🥇",
    image: "/instruments/gong.jpg",
    history: "Gongs originated in Asia over 4,000 years ago, used in religious ceremonies and healing rituals. They were considered sacred instruments capable of connecting earth and heaven through sound.",
    science: "Gong vibrations create a full spectrum of frequencies that can reset the nervous system. The complex harmonics help synchronize both brain hemispheres and promote neuroplasticity.",
    benefits: "• Releases emotional blockages\n• Resets nervous system\n• Promotes deep healing states\n• Enhances creativity\n• Facilitates spiritual awakening"
  },
  {
    id: 5,
    name: "Chimes & Bells",
    icon: "🔔",
    image: "/instruments/chimes.jpg",
    history: "Sacred chimes and bells have been used in temples and healing spaces for thousands of years. From Tibetan tingsha bells to wind chimes, they mark sacred moments and clear energy.",
    science: "High-frequency chime sounds stimulate the release of endorphins and activate the body's natural healing response. The clear tones help focus attention and quiet mental chatter.",
    benefits: "• Clears mental fog\n• Enhances concentration\n• Purifies space energy\n• Marks meditation transitions\n• Promotes mental clarity"
  }
];

export function SoundHealingPage() {
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [savedSongs, setSavedSongs] = useState<number[]>([]);
  const [nowPlaying, setNowPlaying] = useState<any | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<any | null>(null);
  const [volume, setVolume] = useState(75);
  const [savedTracks, setSavedTracks] = useState<any[]>([]);
  const [recentTracks, setRecentTracks] = useState<any[]>([]);
  const [soundLibrary, setSoundLibrary] = useState(fallbackLibrary);
  const [libraryLoading, setLibraryLoading] = useState(true);
  const [libraryError, setLibraryError] = useState<string | null>(null);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<any>(null); // Store clicked track data
  const [showInstrumentModal, setShowInstrumentModal] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState<any>(null);

  // Get recommended sounds based on feeling
  const getRecommendedSounds = (feeling: string) => {
    const recommendations = {
      stress: [
        { id: 1, title: "Ocean Waves Calm", description: "Gentle ocean sounds to wash away stress", category: "Nature", frequency: "528 Hz", duration: "15:00", image: "/sound/ocean_waves.png", audioUrl: "/audio/stress/Ocean-Waves-Calm.mp3", index: 1 },
        { id: 2, title: "Forest Rain", description: "Peaceful rainfall in ancient forest", category: "Nature", frequency: "432 Hz", duration: "20:00", image: "/sound/forest_ambience.png", audioUrl: "/audio/stress/Gentle-Rain-Drops.mp3", index: 4 },
        { id: 3, title: "Tibetan Bowls", description: "Sacred healing vibrations", category: "Bowl Therapy", frequency: "432 Hz", duration: "15:30", image: "/tibetan.jpg", audioUrl: "/audio/stress/Tibetan-Bowls.mp3", index: 0 }
      ],
      anxiety: [
        { id: 4, title: "Gentle Rain Drops", description: "Soft rainfall for deep calm", category: "Nature", frequency: "528 Hz", duration: "25:00", image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=400&fit=crop&auto=format", audioUrl: "/audio/anxiety/Gentle-Rain-Drops.mp3", index: 2 },
        { id: 5, title: "Misty Forest Stream", description: "Flowing water through peaceful woods", category: "Nature", frequency: "432 Hz", duration: "30:00", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop&auto=format", audioUrl: "/audio/anxiety/Misty-Forest-Stream.mp3", index: 3 },
        { id: 6, title: "Soft Meadow Breeze", description: "Gentle wind through calm meadows", category: "Nature", frequency: "396 Hz", duration: "22:00", image: "/breeze.webp", audioUrl: "/audio/anxiety/Soft-Meadow-Breeze.mp3", index: 4 }
      ],
      sleep: [
        { id: 7, title: "Night Ocean Waves", description: "Deep ocean sounds for restful sleep", category: "Sleep", frequency: "528 Hz", duration: "60:00", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&auto=format", audioUrl: "/audio/sleep/Night-Ocean-Waves.mp3", index: 1 },
        { id: 8, title: "Starlit Delta Waves", description: "Sleep-inducing frequencies under stars", category: "Binaural", frequency: "1-4 Hz", duration: "45:00", image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop&auto=format", audioUrl: "/audio/sleep/Starlit-Delta-Waves.mp3", index: 2 },
        { id: 9, title: "Moonlight Lullaby", description: "Soft tones for deep rest", category: "Ambient", frequency: "432 Hz", duration: "40:00", image: "/moon.jpeg", audioUrl: "/audio/sleep/Moonlight-Lullaby.mp3", index: 0 }
      ],
      focus: [
        { id: 10, title: "Clear Mind Frequencies", description: "Pure tones for concentration", category: "Binaural", frequency: "8-12 Hz", duration: "25:00", image: "/clear.jpg", audioUrl: "/audio/focus/Clear-Mind-Frequencies.mp3", index: 2 },
        { id: 11, title: "Minimal Nature Sounds", description: "Clean audio for mental clarity", category: "Ambient", frequency: "528 Hz", duration: "20:00", image: "/nature.jpg", audioUrl: "/audio/focus/Minimal-Nature-Sounds.mp3", index: 3 },
        { id: 12, title: "Productivity Flow", description: "Subtle background for deep work", category: "Focus", frequency: "40 Hz", duration: "30:00", image: "/work.jpg", audioUrl: "/audio/focus/Productivity-Flow.mp3", index: 4 }
      ],
      balance: [
        { id: 13, title: "Chakra Harmony", description: "Balance all energy centers", category: "Chakra Healing", frequency: "852 Hz", duration: "22:30", image: "/sound/chakra_tuning.png", audioUrl: "/audio/emotional/Chakra-Harmony.mp3", index: 5 },
        { id: 14, title: "Sacred Geometry", description: "Harmonic frequencies", category: "Crystal Therapy", frequency: "741 Hz", duration: "25:00", image: "/geometry.webp", audioUrl: "/audio/emotional/Sacred-Geometry.mp3", index: 3 },
        { id: 15, title: "Healing Bowls", description: "Tibetan healing vibrations", category: "Bowl Therapy", frequency: "432 Hz", duration: "18:00", image: "/healing.jpg", audioUrl: "/audio/anxiety/Healing-Bowls.mp3", index: 0 }
      ]
    };
    return recommendations[feeling as keyof typeof recommendations] || [];
  };

  // Collection data — defined before getFilteredTracks so they're in scope
  const sleepTherapyData = [
    {
      id: "sleep1",
      title: "Cozy Bed",
      artist: "Sleep Sanctuary",
      frequency: "528 Hz",
      duration: "60:00",
      category: "Sleep",
      description: "Drift into peaceful sleep in your cozy sanctuary.",
      tags: ["sleep", "night", "deep"],
      thumbnailUrl: "/assets/sleep/cozy-bed.jpg",
      audioUrl: "/audio/sleep/Moonlight-Lullaby.mp3"
    },
    {
      id: "sleep2",
      title: "Window Night Sky View",
      artist: "Nocturnal Sounds",
      frequency: "432 Hz",
      duration: "45:00",
      category: "Sleep",
      description: "Gaze at the stars through your window as you drift to sleep.",
      tags: ["sleep", "night", "deep"],
      thumbnailUrl: "/assets/sleep/window-night-sky.jpg",
      audioUrl: "/audio/sleep/Night-Ocean-Waves.mp3"
    },
    {
      id: "sleep3",
      title: "Peaceful Sleeping Scene",
      artist: "Dream Weavers",
      frequency: "396 Hz",
      duration: "50:00",
      category: "Sleep",
      description: "Create the perfect atmosphere for restful sleep.",
      tags: ["sleep", "night", "deep"],
      thumbnailUrl: "/assets/sleep/peaceful-sleep.jpg",
      audioUrl: "/audio/sleep/Starlit-Delta-Waves.mp3"
    }
  ];

  const focusBoostData = [
    {
      id: "focus1",
      title: "Productivity Flow",
      artist: "Deep Work Mode",
      frequency: "40 Hz",
      duration: "30:00",
      category: "Focus",
      description: "Enhance your productivity with focused work sounds.",
      tags: ["focus", "work", "study"],
      thumbnailUrl: "/images/Productivity Flow.jpg",
      audioUrl: "/audio/focus/Productivity-Flow.mp3"
    },
    {
      id: "focus2",
      title: "Clear Mind Frequencies",
      artist: "Mental Clarity",
      frequency: "8-12 Hz",
      duration: "25:00",
      category: "Focus",
      description: "Clear your mind with pure concentration frequencies.",
      tags: ["focus", "clarity", "brain"],
      thumbnailUrl: "/images/Clear Mind Frequencies.jpg",
      audioUrl: "/audio/focus/Clear-Mind-Frequencies.mp3"
    },
    {
      id: "focus3",
      title: "Minimal Nature Sounds",
      artist: "Distraction-Free",
      frequency: "528 Hz",
      duration: "20:00",
      category: "Focus",
      description: "Subtle nature sounds for enhanced mental clarity.",
      tags: ["focus", "minimal", "concentration"],
      thumbnailUrl: "/images/Minimal Nature Sounds.jpg",
      audioUrl: "/audio/focus/Minimal-Nature-Sounds.mp3"
    }
  ];

  const natureSoundsData = [
    {
      id: "nature1",
      title: "Ocean Waves Calm",
      artist: "Deep Relaxation",
      frequency: "528 Hz",
      duration: "15:00",
      category: "Nature",
      description: "Gentle ocean sounds to wash away stress.",
      tags: ["stress", "relax", "nature"],
      thumbnailUrl: "/images/Ocean Waves Calm.jpg",
      audioUrl: "/audio/stress/Ocean-Waves-Calm.mp3"
    },
    {
      id: "nature2",
      title: "Forest Rain",
      artist: "Nature Ambience",
      frequency: "432 Hz",
      duration: "20:00",
      category: "Nature",
      description: "Peaceful rainfall in ancient forest.",
      tags: ["stress", "rain", "relax"],
      thumbnailUrl: "/images/Forest Rain.jpg",
      audioUrl: "/audio/stress/Gentle-Rain-Drops.mp3"
    },
    {
      id: "nature3",
      title: "Gentle Rain Drops",
      artist: "Soothing Sleep",
      frequency: "528 Hz",
      duration: "25:00",
      category: "Nature",
      description: "Soft rainfall for deep calm.",
      tags: ["stress", "healing", "calm"],
      thumbnailUrl: "/images/Gentle Rain Drops.jpg",
      audioUrl: "/audio/anxiety/Gentle-Rain-Drops.mp3"
    }
  ];

  // Get filtered tracks based on active collection and search query
  const getFilteredTracks = () => {
    const query = searchQuery.toLowerCase().trim();

    if (query) {
      // Pool all tracks, deduplicate by title
      const allTracks = [
        ...soundLibrary,
        ...sleepTherapyData,
        ...focusBoostData,
        ...natureSoundsData,
      ];
      const seen = new Set<string>();
      const unique = allTracks.filter(t => {
        if (seen.has(t.title)) return false;
        seen.add(t.title);
        return true;
      });

      // Strict exact tag match only — no keyword expansion, no partial matching
      const results = unique.filter(track =>
        Array.isArray(track.tags) &&
        track.tags.some((tag: string) => tag.toLowerCase() === query)
      );

      return results.slice(0, 3);
    }

    // No search — apply collection filter
    if (activeCollection) {
      const collectionFilters: Record<string, () => any[]> = {
        'liked':      () => savedTracks,
        'recent':     () => recentTracks,
        'meditation': () => soundLibrary.filter(t => t.category === 'Meditation'),
        'sleep':      () => sleepTherapyData,
        'focus':      () => focusBoostData,
        'nature':     () => natureSoundsData,
      };
      return collectionFilters[activeCollection]?.() ?? soundLibrary;
    }

    return soundLibrary;
  };

  // Get related tracks by category
  const getRelatedTracks = (category: string, excludeIndex?: number) => {
    return soundLibrary
      .map((track, index) => ({ ...track, originalIndex: index }))
      .filter((track, index) => 
        track.category?.toLowerCase() === category.toLowerCase() && 
        index !== excludeIndex
      )
      .slice(0, 8); // Limit to 8 related tracks
  };

  // Hide navbar on scroll for Sound Healing page
  useEffect(() => {
    let lastScrollY = 0;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide navbar when scrolling down, show when scrolling up or at top
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down - hide navbar
        window.dispatchEvent(new CustomEvent('nirvaha-toggle-nav', { 
          detail: { hide: true } 
        }));
      } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
        // Scrolling up or at top - show navbar
        window.dispatchEvent(new CustomEvent('nirvaha-toggle-nav', { 
          detail: { hide: false } 
        }));
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup on unmount - restore navbar
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.dispatchEvent(new CustomEvent('nirvaha-toggle-nav', { 
        detail: { hide: false } 
      }));
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadLibrary = async () => {
      try {
        const sounds = await getSounds();
        if (!isMounted) return;
        if (!sounds || sounds.length === 0) {
          setSoundLibrary(fallbackLibrary);
          setLibraryError(null);
          return;
        }

        const mapped = sounds.map((sound) => ({
          title: sound.title,
          artist: sound.artist || "",
          frequency: sound.frequency || "",
          duration: `${sound.duration ?? 0}:00`,
          category: sound.category || "",
          description: sound.description || "",
          thumbnailUrl: sound.thumbnailUrl || "",
          bannerUrl: sound.bannerUrl || "",
          audioUrl: sound.audioUrl || "",
          tags: sound.mood || [], // Use mood array as tags, or empty array if not available
        }));
        setSoundLibrary(mapped);
        setLibraryError(null);
      } catch (error) {
        if (!isMounted) return;
        setLibraryError("Failed to load sound library");
        setSoundLibrary(fallbackLibrary);
      } finally {
        if (isMounted) setLibraryLoading(false);
      }
    };

    loadLibrary();
    return () => {
      isMounted = false;
    };
  }, []);

  const playlists = [
    // Quick Access Section
    { id: 'liked', name: 'Saved', songs: savedTracks, icon: '❤️', section: 'quick' },
    { id: 'recent', name: 'Recently Played', songs: recentTracks, icon: '⏱️', section: 'quick' },
    
    // Collections Section
    { id: 'meditation', name: 'Meditation Journey', songs: [0, 1, 2], icon: '📂', section: 'collections' },
    { id: 'sleep', name: 'Sleep Therapy', songs: [0, 1, 2], icon: '📂', section: 'collections' },
    { id: 'focus', name: 'Focus Boost', songs: [2, 10, 11], icon: '📂', section: 'collections' },
    { id: 'nature', name: 'Nature Sounds', songs: [1, 4, 6], icon: '📂', section: 'collections' },
  ];

  const handleSaveToggle = (track: any) => {
    if (!track) return;
    setSavedTracks(prev =>
      prev.some(t => t.title === track.title)
        ? prev.filter(t => t.title !== track.title)
        : [...prev, track]
    );
  };

  const isTrackSaved = (track: any) =>
    savedTracks.some(t => t.title === track?.title);

  useEffect(() => {
    if (nowPlaying !== null) {
      // nowPlaying is now a track object — no index-based localStorage needed
    }
  }, [nowPlaying]);

  const handlePlaylistClick = (playlistId: string) => {
    console.log('🎵 Collection clicked:', playlistId); // Debug log
    
    if (activeCollection === playlistId) {
      // If clicking the same collection, deselect it
      setActiveCollection(null);
      setSelectedPlaylist(null);
    } else {
      // FORCE RESET FIRST - Clear state completely for Sleep, Focus & Nature
      if (playlistId === 'sleep') {
        console.log('💤 FORCE RESET: Clearing state for Sleep Therapy');
        setActiveCollection(null); // Reset first
        setSelectedPlaylist(null);
        
        // DELAY to break React reuse
        setTimeout(() => {
          setActiveCollection('sleep');
          setSelectedPlaylist('sleep');
          console.log('💤 Sleep Therapy Data:', sleepTherapyData);
        }, 0);
      } else if (playlistId === 'focus') {
        console.log('🎯 FORCE RESET: Clearing state for Focus Boost');
        setActiveCollection(null); // Reset first
        setSelectedPlaylist(null);
        
        // DELAY to break React reuse
        setTimeout(() => {
          setActiveCollection('focus');
          setSelectedPlaylist('focus');
          console.log('🎯 Focus Boost Data:', focusBoostData);
        }, 0);
      } else if (playlistId === 'nature') {
        console.log('🌿 FORCE RESET: Clearing state for Nature Sounds');
        setActiveCollection(null); // Reset first
        setSelectedPlaylist(null);
        
        // DELAY to break React reuse
        setTimeout(() => {
          setActiveCollection('nature');
          setSelectedPlaylist('nature');
          console.log('🌿 Nature Sounds Data:', natureSoundsData);
        }, 0);
      } else {
        // Normal collection selection
        setActiveCollection(playlistId);
        setSelectedPlaylist(playlistId);
      }
    }
  };

  const handleCardClick = (track: any, source: string = "global") => {
    if (!track) return;

    // If source is 'all-sounds', we handle playback differently (e.g., local only)
    // and skip updating the global "Now Playing" panel as requested.
    if (source === "all-sounds") {
      console.log('[SoundHealing] Local playback triggered for:', track.title);
      // Logic for local playback could be added here if needed.
      // For now, we skip updating global state.
      return;
    }

    setSelectedTrack(track);
    setActiveCard(track);
    setNowPlaying(track);
    setPlayProgress(0);
    setCurrentTime(0);

    // Add to recently played — no duplicates, latest first, max 10
    setRecentTracks(prev => {
      const filtered = prev.filter(t => t.title !== track.title);
      return [track, ...filtered].slice(0, 10);
    });

    const audioSrc = track.audioUrl;
    console.log('[SoundHealing] Playing (Global):', track.title, '→', audioSrc);

    if (audioRef.current && audioSrc) {
      audioRef.current.src = audioSrc;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.error('[SoundHealing] Play error:', err));
      setIsPlaying(true);
    } else if (!audioSrc) {
      console.warn('[SoundHealing] No audioUrl on track:', track.title);
    }
  };

  const closeActiveCard = () => {
    setActiveCard(null);
  };

  const handleInstrumentClick = (instrument: any) => {
    setSelectedInstrument(instrument);
    setShowInstrumentModal(true);
  };

  const closeInstrumentModal = () => {
    setShowInstrumentModal(false);
    setSelectedInstrument(null);
  };

  // Handle keyboard events for modals
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showInstrumentModal) {
          closeInstrumentModal();
        }
      }
    };

    if (showInstrumentModal) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showInstrumentModal]);

  
  // nowPlaying is now a track object — no index-based init needed

  const currentTrack = selectedTrack || nowPlaying || soundLibrary[0];

  // Handle audio playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setPlayProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const handleEnded = async () => {
      setIsPlaying(false);
      setPlayProgress(0);
      
      // Log sound session if it was played for at least 1 minute
      if (duration >= 1 && user?.id) {
        try {
          const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/profile/log-sound-session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              duration: Math.round(duration)
            })
          });
          if (res.ok) {
            // Refresh profile data to update UI instantly
            window.location.reload(); // Simple refresh for now
          }
        } catch (err) {
          console.error("Failed to log sound session:", err);
        }
      }
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(err => console.log('Play error:', err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Audio is loaded directly in handleCardClick — no index-based effect needed

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const scrollHideClass = "scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #e6f4ea, #f5fbf7)' }}>
      {/* Neumorphism Button Styles */}
      <style>{`
        .neu-button {
          background: linear-gradient(145deg, #f0f9f0, #e8f5e8);
          border-radius: 50px;
          box-shadow: inset 4px 4px 10px #d4edd4, inset -4px -4px 10px #ffffff;
          color: #2d5a2d;
          cursor: pointer;
          font-size: 18px;
          padding: 15px 40px;
          transition: all 0.2s ease-in-out;
          border: 2px solid rgba(34, 139, 34, 0.2);
        }
        .neu-button:hover {
          box-shadow: inset 2px 2px 5px #d4edd4, inset -2px -2px 5px #ffffff, 2px 2px 5px #d4edd4, -2px -2px 5px #ffffff;
          background: linear-gradient(145deg, #edf7ed, #e0f2e0);
        }
        .neu-button:focus {
          outline: none;
          box-shadow: inset 2px 2px 5px #d4edd4, inset -2px -2px 5px #ffffff, 2px 2px 5px #d4edd4, -2px -2px 5px #ffffff;
        }

        /* Meditation Card Theme */
        .med-card-theme {
          position: relative;
          background: linear-gradient(135deg, rgba(232, 245, 233, 0.7) 0%, rgba(255, 255, 255, 0.9) 100%);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 24px;
          border: 1px solid rgba(82, 183, 136, 0.3);
          box-shadow: 0 8px 32px rgba(82, 183, 136, 0.1);
          transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: visible;
        }
        .med-card-theme:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(82, 183, 136, 0.6);
        }
        
        /* Glowing Animation */
        .med-card-theme::after {
          content: "";
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #a8e6cf, #dcedc1, #a8e6cf);
          border-radius: 26px;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.4s ease;
          filter: blur(15px);
        }
        .med-card-theme:hover::after {
          opacity: 0.6;
          animation: medGlow 3s infinite alternate;
        }
        @keyframes medGlow {
          0% { filter: blur(15px); opacity: 0.4; }
          100% { filter: blur(25px); opacity: 0.8; }
        }

        .med-card-theme-inner {
          padding: 30px 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 15px;
          position: relative;
          z-index: 1;
        }
        .med-card-theme-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #d8f3dc, #b7e4c7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1b4332;
          box-shadow: 0 4px 12px rgba(82, 183, 136, 0.2);
        }
        .med-card-theme-badge {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 5px 14px;
          border-radius: 50px;
          font-family: 'Poppins', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .badge-cat { background: #ffffff; color: #2d6a4f; border: 1px solid #d1f2d1; }
        .badge-freq { background: #2d6a4f; color: #ffffff; border: none; }
        
        .med-card-theme-title {
          font-family: 'Cinzel', serif;
          font-weight: 800;
          font-size: 1.25rem;
          color: #0d2b0d;
          margin: 0;
          line-height: 1.3;
        }
        .med-card-theme-desc {
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
          color: #2d4a2d;
          line-height: 1.7;
          margin: 0;
          flex: 1;
          opacity: 0.85;
        }
        .med-card-theme-dur {
          font-size: 0.8rem;
          font-weight: 600;
          color: #2d6a4f;
          font-family: 'Poppins', sans-serif;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .med-card-theme-btn {
          width: 100%;
          padding: 14px;
          border-radius: 50px;
          border: none;
          background: linear-gradient(135deg, #40916c, #1b4332);
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(27, 67, 50, 0.3);
          margin-top: 15px;
        }
        .med-card-theme-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(27, 67, 50, 0.4);
          filter: brightness(1.1);
        }
        .med-card-theme-btn:active {
          transform: scale(0.97);
        }
      `}</style>

      {/* Hidden Audio Element for Playback */}
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        onError={(e) => console.log('Audio error:', e)}
      />

      {/* Hero Section */}
      <div className="relative min-h-screen bg-cover bg-center overflow-hidden z-10">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/animation video.mp4"
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/10" />
        
        <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
          <div className="flex items-center min-h-[80vh]">
            
            {/* Left Content — full width */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 pl-10 sm:pl-16 lg:pl-20 max-w-3xl"
            >
              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6 max-w-4xl" style={{ fontFamily: "'Cinzel', serif", textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 4px 40px rgba(0,0,0,0.6)' }}>
                  Support Your Mind & Body with{' '}
                  <span className="text-green-300 whitespace-nowrap">
                    Sound Frequencies
                  </span>
                </h1>
              </motion.div>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const dashboardElement = document.querySelector('[data-dashboard-content]');
                    if (dashboardElement) {
                      dashboardElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Start Therapy
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* What are you feeling today? Section */}
      <div className="relative py-0 z-20" style={{ 
        background: 'linear-gradient(to bottom, rgba(230, 244, 234, 0.95), rgba(245, 251, 247, 1))',
        marginTop: '-40px',
        borderTopLeftRadius: '40px',
        borderTopRightRadius: '40px',
        paddingTop: '60px'
      }}>
        {/* Enhanced Animated Background */}
        <motion.div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(230, 244, 234, 0.95), rgba(245, 251, 247, 1))' }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            scale: [1, 1.02, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating particles effect */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundImage: [
              'radial-gradient(circle at 20% 80%, rgba(34, 139, 34, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(34, 139, 34, 0.08) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 40%, rgba(34, 139, 34, 0.08) 0%, transparent 50%), radial-gradient(circle at 60% 60%, rgba(34, 139, 34, 0.08) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 80%, rgba(34, 139, 34, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(34, 139, 34, 0.08) 0%, transparent 50%)'
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="relative z-10 container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
              What are you feeling today?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Choose what resonates with you right now, and we'll recommend the perfect sound therapy
            </p>
          </motion.div>

          {/* Feeling Chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            {[
              { id: 'stress', label: 'Stress' },
              { id: 'anxiety', label: 'Anxiety' },
              { id: 'sleep', label: 'Sleep Issues' },
              { id: 'focus', label: 'Focus' },
              { id: 'balance', label: 'Emotional Balance' }
            ].map((feeling, index) => (
              <motion.button
                key={feeling.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedFeeling(feeling.id)}
                className={`neu-button ${
                  selectedFeeling === feeling.id 
                    ? 'ring-4 ring-green-300/50' 
                    : ''
                }`}
                style={{ 
                  fontFamily: "'Poppins', sans-serif",
                  background: selectedFeeling === feeling.id 
                    ? 'linear-gradient(145deg, #d4f4d4, #c8f0c8)' 
                    : 'linear-gradient(145deg, #f0f9f0, #e8f5e8)',
                  color: selectedFeeling === feeling.id ? '#1a5a1a' : '#2d5a2d'
                }}
              >
                {feeling.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Recommended Sound Cards */}
          <AnimatePresence mode="wait">
            {selectedFeeling && (
              <motion.div
                key={selectedFeeling}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {getRecommendedSounds(selectedFeeling).map((sound, index) => (
                  <motion.div
                    key={sound.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50"
                    style={{ boxShadow: '0 8px 20px rgba(34, 139, 34, 0.08)' }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={sound.image}
                        alt={sound.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      
                      {/* Play Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCardClick(sound)}
                        className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl"
                      >
                        <Play className="w-5 h-5 text-gray-700 ml-0.5" fill="currentColor" />
                      </motion.button>

                      {/* Duration Badge */}
                      <div className="absolute top-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full">
                        <span className="text-white text-sm font-medium">{sound.duration}</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-800 mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                        {sound.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {sound.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {sound.category}
                        </span>
                        <span className="text-xs text-purple-600 font-medium">
                          {sound.frequency}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Existing Dashboard Content */}
      <div 
        className="relative min-h-screen z-30" 
        data-dashboard-content
        style={{ 
          background: 'linear-gradient(to bottom, rgba(230, 244, 234, 0.95), rgba(245, 251, 247, 1))',
          marginTop: '-40px',
          borderTopLeftRadius: '40px',
          borderTopRightRadius: '40px',
          paddingTop: '60px'
        }}
      >
        {/* Animated Background Shade */}
        <motion.div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(230, 244, 234, 0.95), rgba(245, 251, 247, 1))' }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-green-100/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-green-100/15 to-transparent rounded-full blur-3xl" />
      </div>

      {/* 3-Column Layout */}
      <div 
        className="relative flex min-h-screen px-0 gap-0 z-40 pt-0"
        style={{ background: 'linear-gradient(to bottom, rgba(230, 244, 234, 0.95), rgba(245, 251, 247, 1))' }}
      >

        {/* LEFT SIDEBAR - Classical Style */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={`hidden lg:flex lg:flex-col w-[280px] flex-shrink-0 sticky top-20 h-fit max-h-[calc(100vh-6rem)] ${scrollHideClass}`}
          style={{ zIndex: 35 }}
        >
          <div className="flex-1 bg-gradient-to-b from-green-50/30 to-white/95 backdrop-blur-xl rounded-2xl border border-green-200/40 shadow-sm overflow-hidden">
            {/* Library Header */}
            <div className="p-5 border-b border-green-200/60 bg-gradient-to-r from-green-100/30 to-green-50/30">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Cinzel', serif" }}>
                  Your Library
                </h2>
                <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Playlists */}
            <div className={`flex-1 overflow-y-auto p-3 ${scrollHideClass}`} style={{ maxHeight: 'calc(100vh - 12rem)' }}>
              {/* Quick Access Section */}
              {playlists.filter(playlist => playlist.section === 'quick').map((playlist, idx) => (
                <motion.div
                  key={playlist.id}
                  whileHover={{ x: 4 }}
                  onClick={() => handlePlaylistClick(playlist.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-2 ${activeCollection === playlist.id
                    ? 'bg-gray-100 border border-gray-300 shadow-sm'
                    : 'hover:bg-gray-50'
                    }`}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg">
                    {playlist.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${activeCollection === playlist.id ? 'text-green-800' : 'text-gray-800'}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {playlist.name}
                    </p>
                    <p className="text-xs text-gray-500">{playlist.songs.length} tracks</p>
                  </div>
                  {activeCollection === playlist.id && (
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                  )}
                </motion.div>
              ))}

              {/* Collections Section */}
              <div className="mt-6 mb-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  📂 Collections
                </h3>
                {playlists.filter(playlist => playlist.section === 'collections').map((playlist, idx) => (
                  <motion.div
                    key={playlist.id}
                    whileHover={{ x: 4 }}
                    onClick={() => handlePlaylistClick(playlist.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-1 ${activeCollection === playlist.id
                      ? 'bg-gray-100 border border-gray-300 shadow-sm'
                      : 'hover:bg-gray-50'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activeCollection === playlist.id 
                      ? 'bg-gradient-to-br from-gray-200 to-gray-300' 
                      : 'bg-gradient-to-br from-gray-100 to-gray-200'
                    }`}>
                      <span className="text-sm">📂</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${activeCollection === playlist.id ? 'text-green-800' : 'text-gray-800'}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {playlist.name}
                      </p>
                      <p className="text-xs text-gray-500">{playlist.songs.length} tracks</p>
                    </div>
                    {activeCollection === playlist.id && (
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CENTER CONTENT - Classical Cards */}
        <div 
          className={`flex-1 min-h-screen relative z-10 ${scrollHideClass}`}
          style={{ background: 'linear-gradient(to bottom, rgba(230, 244, 234, 0.95), rgba(245, 251, 247, 1))' }}
        >
          {/* Enhanced Animated Background for all content sections */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(230, 244, 234, 0.95), rgba(245, 251, 247, 1))' }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              opacity: [0.8, 1, 0.8],
              scale: [1, 1.01, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Subtle floating elements */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              backgroundImage: [
                'radial-gradient(circle at 10% 20%, rgba(34, 139, 34, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(34, 139, 34, 0.08) 0%, transparent 40%)',
                'radial-gradient(circle at 30% 70%, rgba(34, 139, 34, 0.08) 0%, transparent 40%), radial-gradient(circle at 70% 30%, rgba(34, 139, 34, 0.08) 0%, transparent 40%)',
                'radial-gradient(circle at 10% 20%, rgba(34, 139, 34, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(34, 139, 34, 0.08) 0%, transparent 40%)'
              ]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <div className={`h-full py-0 relative z-10 ${scrollHideClass}`}>
            {/* Hero Section */}
            <div className="px-6 pt-6 pb-0">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
                  Sound Healing Library
                </h1>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Discover ancient frequencies designed to restore balance and elevate consciousness
                </p>
              </motion.div>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search healing sounds..."
                  value={searchQuery}
                  onChange={(e) => {
                    const newQuery = e.target.value;
                    setSearchQuery(newQuery);
                    // Clear active collection when searching to show all results
                    if (newQuery.trim() && activeCollection) {
                      setActiveCollection(null);
                      setSelectedPlaylist(null);
                    }
                  }}
                  className={`w-full pl-12 pr-4 py-3 bg-white rounded-full text-gray-700 placeholder-gray-400 border transition-all ${
                    searchQuery.trim() 
                      ? 'border-green-300 focus:border-green-400 focus:ring-2 focus:ring-green-400' 
                      : 'border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-400'
                  } focus:outline-none shadow-sm`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Sacred Collection - Classical Cards */}
            <div className="px-6 mb-0">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Cinzel', serif" }}>
                    {searchQuery.trim() ? 
                      `Search Results` :
                      activeCollection ? 
                        `${playlists.find(p => p.id === activeCollection)?.name || 'Collection'}` : 
                        'Sacred Collection'
                    }
                  </h2>
                  <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {searchQuery.trim() ? 
                      `Top ${getFilteredTracks().length} results for "${searchQuery}"` :
                      activeCollection ? 
                        `${getFilteredTracks().length} tracks` :
                        `${soundLibrary.length} healing sounds`
                    }
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {activeCollection && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setActiveCollection(null);
                        setSelectedPlaylist(null);
                      }}
                      className="text-sm text-green-600 hover:text-green-700 font-medium px-3 py-1 rounded-full border border-green-300 hover:border-green-400 transition-all"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Clear Filter
                    </motion.button>
                  )}
                  <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    View all <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {getFilteredTracks().length === 0 ? (
                  <motion.div
                    key="no-results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="col-span-full flex flex-col items-center justify-center py-16 px-6"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                        No results found
                      </h3>
                      <p className="text-gray-600 max-w-md" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {searchQuery.trim() 
                          ? `No results found for "${searchQuery}". Try keywords like "calm", "sleep", "focus", or "rain".`
                          : activeCollection 
                            ? "No sounds in this collection yet. Explore other collections or add some sounds to your library."
                            : "No sounds available at the moment."
                        }
                      </p>
                      {searchQuery.trim() && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="mt-4 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-full text-sm font-medium transition-colors"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeCollection || 'all'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                  >
                    {getFilteredTracks().map((track, idx) => {
                      // FORCE UNIQUE KEY + CACHE BUSTING for Sleep, Focus & Nature
                      const uniqueKey = (searchQuery.trim())
                        ? `search-${track.id || track.title}-${idx}`
                        : (activeCollection === 'sleep' || activeCollection === 'focus' || activeCollection === 'nature') 
                        ? `${track.id || `${activeCollection}-${idx}`}-${activeCollection}` 
                        : `${activeCollection}-${idx}`;
                      
                      const imageUrl = track.thumbnailUrl || track.bannerUrl || track.image || fallbackImages[idx % fallbackImages.length];

                      return (
                    <motion.div
                      key={uniqueKey}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -6 }}
                      onClick={() => handleCardClick(track, "global")}
                      className="group bg-white rounded-2xl border border-gray-200/80 overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 relative"
                      style={{ boxShadow: '0 8px 20px rgba(34, 139, 34, 0.08)' }}
                    >
                    {/* Card Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={track.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Play Button */}
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        className="absolute bottom-4 right-4 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                      </motion.button>

                      {/* Duration Badge */}
                      <div className="absolute top-4 right-4 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-md">
                        <span className="text-white text-xs font-medium">{track.duration}</span>
                      </div>
                    </div>

                    {/* Card Content - Classical Style */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 mb-1 truncate" style={{ fontFamily: "'Cinzel', serif" }}>
                            {track.title}
                          </h3>
                          <p className="text-sm text-gray-500 truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {track.artist}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveToggle(track);
                          }}
                          className={`flex-shrink-0 p-2 rounded-full transition-colors ${isTrackSaved(track)
                            ? 'text-green-600 bg-green-50'
                            : 'text-gray-400 hover:text-green-500 hover:bg-green-50'
                            }`}
                        >
                          <Bookmark className={`w-5 h-5 ${isTrackSaved(track) ? 'fill-current' : ''}`} />
                        </motion.button>
                      </div>

                      {/* Classical Divider */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                        <span className="text-gray-400 text-xs">✦</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 font-medium px-2 py-1 bg-gray-50 rounded-full">
                            {track.category}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{track.frequency}</span>
                      </div>
                    </div>
                  </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>



          </div>
        </div>

        {/* RIGHT SIDEBAR - Now Playing */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={`hidden xl:flex xl:flex-col w-[300px] flex-shrink-0 sticky top-20 h-fit max-h-[calc(100vh-6rem)] ${scrollHideClass}`}
          style={{ zIndex: 35 }}
        >
          <div className="flex-1 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-green-200/60" style={{ background: 'linear-gradient(to bottom, rgba(230, 244, 234, 0.95), rgba(245, 251, 247, 1))' }}>
              <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Cinzel', serif" }}>
                Now Playing
              </h2>
            </div>

            <div className={`flex-1 overflow-y-auto p-5 ${scrollHideClass}`} style={{ maxHeight: 'calc(100vh - 12rem)' }}>
              {/* Album Art */}
              <div className="relative mb-5">
                <motion.img
                  key={currentTrack?.id || currentTrack?.title}
                  src={currentTrack?.thumbnailUrl || currentTrack?.image || '/sound/tibetan_bowls.png'}
                  alt={currentTrack?.title}
                  className="w-full aspect-square object-cover rounded-xl shadow-lg border border-gray-100"
                  animate={{ scale: isPlaying ? [1, 1.01, 1] : 1 }}
                  transition={{ duration: 3, repeat: isPlaying ? Infinity : 0 }}
                />
                {isPlaying && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-3 py-1.5 bg-green-600 rounded-full">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-white rounded-full"
                        animate={{ height: [4, 12, 4] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div className="text-center mb-5">
                <h3 className="font-bold text-xl text-gray-800 mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
                  {currentTrack?.title}
                </h3>
                <p className="text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>{currentTrack?.artist}</p>
              </div>

              {/* Classical Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                <span className="text-gray-500 text-sm">✦</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              </div>

              {/* Progress */}
              <div className="mb-5">
                <div 
                  className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2 cursor-pointer hover:h-2 transition-all"
                  onClick={(e) => {
                    if (!audioRef.current || !duration) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    audioRef.current.currentTime = percent * duration;
                  }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-600 to-green-600"
                    style={{ width: `${playProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 mb-5">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Shuffle className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-600 transition-colors">
                  <SkipBack className="w-5 h-5" fill="currentColor" />
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-600 rounded-full flex items-center justify-center shadow-lg"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" fill="white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                  )}
                </motion.button>
                <button className="p-2 text-gray-600 hover:text-gray-600 transition-colors">
                  <SkipForward className="w-5 h-5" fill="currentColor" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Repeat className="w-5 h-5" />
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3">
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  title={volume === 0 ? "Unmute" : "Mute"}
                  onClick={() => setVolume(v => v > 0 ? 0 : 75)}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1 h-1.5 accent-green-600 cursor-pointer"
                  style={{ accentColor: '#16a34a' }}
                />
                <span className="text-xs text-gray-400 w-7 text-right">{volume}%</span>
              </div>

              {/* Track Details */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Details</p>
                <p className="text-sm text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {currentTrack?.category} · {currentTrack?.frequency}
                </p>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {currentTrack?.description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      </div>

      {/* MODAL PLAYER */}
      <AnimatePresence>
        {activeCard !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            onClick={closeActiveCard}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-xl"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #e6f4ea, #f0faf2)' }}
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeActiveCard}
                className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-green-200/60 hover:bg-green-300/60 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-green-800" />
              </motion.button>

              <div className="p-8">
                {/* Album Art & Info */}
                <div className="flex items-start gap-6 mb-6">
                  {!activeCard?.isSoundHealing ? (
                    <motion.img
                      key={activeCard?.id || activeCard?.title}
                      src={activeCard?.thumbnailUrl || activeCard?.image}
                      alt={activeCard?.title || 'Track'}
                      className="w-40 h-40 rounded-2xl object-cover shadow-2xl border-2 border-white/20"
                      animate={{ scale: isPlaying ? [1, 1.02, 1] : 1 }}
                      transition={{ duration: 3, repeat: isPlaying ? Infinity : 0 }}
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-2xl border-2 border-white/20">
                      <Music className="w-16 h-16 text-green-700" />
                    </div>
                  )}
                  <div className="flex-1 pt-2">
                    <p className="text-green-700/70 text-xs uppercase tracking-widest mb-2">Now Playing</p>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
                      {activeCard?.title || 'Unknown Track'}
                    </h3>
                    <p className="text-gray-500 mb-4">{activeCard?.artist || 'Unknown Artist'}</p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-green-200/60 text-green-800 rounded-full text-xs">
                        {activeCard?.category || 'Music'}
                      </span>
                      <span className="px-3 py-1 bg-green-200/60 text-green-800 rounded-full text-xs">
                        {activeCard?.frequency || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="w-full h-1.5 bg-green-200 rounded-full overflow-hidden mb-2">
                    <motion.div
                      className="h-full bg-green-600"
                      style={{ width: `${playProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-5 mb-6">
                  <button className="p-2 text-green-600/60 hover:text-green-800 transition-colors">
                    <Shuffle className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-green-800 hover:scale-105 transition-transform">
                    <SkipBack className="w-6 h-6" fill="currentColor" />
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-xl"
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7 text-white" fill="currentColor" />
                    ) : (
                      <Play className="w-7 h-7 text-white ml-1" fill="currentColor" />
                    )}
                  </motion.button>
                  <button className="p-2 text-green-800 hover:scale-105 transition-transform">
                    <SkipForward className="w-6 h-6" fill="currentColor" />
                  </button>
                  <button className="p-2 text-green-600/60 hover:text-green-800 transition-colors">
                    <Repeat className="w-5 h-5" />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleSaveToggle(activeCard)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${isTrackSaved(activeCard)
                      ? 'bg-green-600 text-white'
                      : 'bg-green-200/60 text-green-800 hover:bg-green-300/60'
                      }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isTrackSaved(activeCard) ? 'fill-current' : ''}`} />
                    {isTrackSaved(activeCard) ? 'Saved' : 'Save'}
                  </motion.button>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-green-200/60 text-green-800 rounded-full text-sm font-medium hover:bg-green-300/60 transition-colors">
                    <ListPlus className="w-4 h-4" />
                    Add to Playlist
                  </button>
                  <button className="w-10 h-10 bg-green-200/60 rounded-full flex items-center justify-center text-green-800 hover:bg-green-300/60 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sacred Instruments Modal */}
      <AnimatePresence>
        {showInstrumentModal && selectedInstrument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeInstrumentModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden border border-green-200/60"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-8 bg-gradient-to-r from-green-100/80 to-green-50/60 border-b border-green-200/60">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeInstrumentModal}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors shadow-sm"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>

                <div className="flex items-center gap-6">
                  <div className="text-6xl">{selectedInstrument.icon}</div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                      {selectedInstrument.name}
                    </h2>
                    <p className="text-green-600 font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Sacred Sound Healing Instrument
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[60vh]">
                <div className="space-y-8">
                  {/* History Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">📜</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800" style={{ fontFamily: "'Cinzel', serif" }}>
                        History
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {selectedInstrument.history}
                    </p>
                  </motion.div>

                  {/* Divider */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />
                    <span className="text-green-400 text-sm">✦</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />
                  </div>

                  {/* Science Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">🔬</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800" style={{ fontFamily: "'Cinzel', serif" }}>
                        Science
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {selectedInstrument.science}
                    </p>
                  </motion.div>

                  {/* Divider */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />
                    <span className="text-green-400 text-sm">✦</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />
                  </div>

                  {/* Benefits Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">✨</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800" style={{ fontFamily: "'Cinzel', serif" }}>
                        Benefits
                      </h3>
                    </div>
                    <div className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {selectedInstrument.benefits.split('\n').map((benefit: string, idx: number) => (
                        <div key={idx} className="mb-2">
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sacred Instruments Section - Full Width */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full mt-[60px] py-16 px-6"
        style={{ 
          background: 'linear-gradient(to bottom, rgba(230, 244, 234, 0.95), rgba(245, 251, 247, 1))',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(34, 139, 34, 0.1)',
          marginTop: '-40px',
          borderTopLeftRadius: '40px',
          borderTopRightRadius: '40px',
          paddingTop: '100px'
        }}
      >
        {/* Add CSS for 3D flip effect */}
        <style>{`
          .transform-style-preserve-3d {
            transform-style: preserve-3d;
          }
          .backface-hidden {
            backface-visibility: hidden;
          }
          .rotate-y-180 {
            transform: rotateY(180deg);
          }
          .group:hover .group-hover\\:rotate-y-180 {
            transform: rotateY(180deg);
          }
        `}</style>
        
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
              Explore Sacred Instruments
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Discover the ancient wisdom and healing power of sacred sound instruments used for millennia in spiritual practices
            </p>
          </motion.div>

          {/* Instruments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {sacredInstruments.map((instrument, idx) => (
              <motion.div
                key={instrument.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 + 0.4 }}
                className="group relative cursor-pointer"
                style={{ aspectRatio: '4/5', perspective: '1000px' }}
                onClick={() => handleInstrumentClick(instrument)}
              >
                {/* Flip Container */}
                <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
                  
                  {/* Front Face */}
                  <div className="absolute inset-0 w-full h-full backface-hidden bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-violet-100/50">
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ 
                        backgroundImage: `url(${instrument.image})`,
                        filter: 'brightness(0.7) contrast(1.1)'
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      {/* Instrument Name */}
                      <h3 className="font-semibold text-white text-lg leading-tight text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {instrument.name}
                      </h3>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Back Face */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden shadow-lg border border-gray-200/60 p-6 flex flex-col justify-center">
                    {/* Icon */}
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-3 animate-pulse">
                        {instrument.icon}
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-bold text-gray-800 text-lg text-center mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
                      {instrument.name}
                    </h3>
                    
                    {/* Brief description */}
                    <p className="text-gray-600 text-sm text-center leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {instrument.history.split('.')[0]}.
                    </p>
                    
                    {/* Click hint */}
                    <div className="mt-4 text-center">
                      <span className="text-gray-600 text-xs font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Click to learn more
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* NEW SECTION: All Sound Healing Sessions (Dynamic) */}
      <section className="w-full py-16 px-6 relative z-10" style={{ background: 'linear-gradient(to bottom, rgba(245, 251, 247, 1), #e6f4ea)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
              All Sound Healing Sessions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Explore our full, dynamically updated library of sound therapy sessions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DynamicSoundSessions onPlay={handleCardClick} isTrackSaved={isTrackSaved} handleSaveToggle={handleSaveToggle} />
          </div>
        </div>
      </section>
    </div>
  );
}

function DynamicSoundSessions({ onPlay, isTrackSaved, handleSaveToggle }: { onPlay: (track: any, source: string) => void, isTrackSaved: (track: any) => boolean, handleSaveToggle: (track: any) => void }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_CONFIG.API_BASE_URL || 'http://localhost:5001'}/api/sounds`)
      .then(res => res.json())
      .then(data => {
        setSessions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch dynamic sounds:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="col-span-full text-center text-gray-500 font-medium py-10">Loading sessions...</p>;
  if (!sessions.length) return <p className="col-span-full text-center text-gray-500 font-medium py-10">No sound healing sessions found in the database.</p>;

  return (
    <>
      {sessions.map((sound: any, idx: number) => {
        const track = {
          ...sound,
          duration: sound.duration ? `${sound.duration}:00` : '15:00',
          artist: sound.artist || 'Sacred Sounds',
          category: sound.category || 'Therapy',
          frequency: sound.frequency || '432 Hz',
          mood: sound.mood || [],
          tags: sound.mood || [],
          isSoundHealing: true
        };
        
        const icons = [Music, Volume2, Hash, Play, Music, Volume2];
        const IconComponent = icons[idx % icons.length];

        return (
          <motion.div
            key={sound.id || sound._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="med-card-theme"
          >
            <div className="med-card-theme-inner">
              {/* Top Section */}
              <div className="flex justify-between items-start">
                <div className="med-card-theme-icon">
                  <IconComponent className="w-5 h-5" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveToggle(track);
                  }}
                  className={`p-2 rounded-full transition-colors ${isTrackSaved(track)
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-400 hover:text-green-500 hover:bg-green-50'
                    }`}
                >
                  <Bookmark className={`w-5 h-5 ${isTrackSaved(track) ? 'fill-current' : ''}`} />
                </motion.button>
              </div>

              {/* Title & Artist */}
              <div>
                <h3 className="med-card-theme-title">{sound.title}</h3>
                <p className="text-xs text-green-600 font-medium mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  By {track.artist}
                </p>
              </div>

              {/* Badges */}
              <div className="flex gap-2 mt-1">
                <span className="med-card-theme-badge badge-cat">{track.category}</span>
                <span className="med-card-theme-badge badge-freq">{track.frequency}</span>
              </div>

              {/* Description */}
              <p className="med-card-theme-desc line-clamp-3">
                {sound.description || 'Experience the therapeutic power of sound frequencies to balance your mind and spirit.'}
              </p>

              {/* Footer */}
              <div className="mt-auto">
                <p className="med-card-theme-dur">
                  <Clock className="w-4 h-4" />
                  {track.duration} session
                </p>
                <button 
                  className="med-card-theme-btn"
                  onClick={() => onPlay(track, "all-sounds")}
                >
                  Listen Now
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </>
  );
}
