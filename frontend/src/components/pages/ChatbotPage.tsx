import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mic,
  Leaf,
  MessageCircle,
  MessageSquare,
  Settings,
  User,
  Trash2,
  ChevronLeft,
  X,
  Download,
  Loader2,
  Music,
  Volume2,
  VolumeX,
  ChevronDown
} from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";

import TextType from "../TextType";
import { BACKEND_CONFIG } from "@/config/backend";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import type { ChatbotPersona } from "@/types/settings";
import { toast } from "react-toastify";

type Message = { type: "ai" | "user"; content: string; timestamp: string };
type Session = { id: string; title: string; messages: Message[]; createdAt: number; updatedAt: number };

// Helper to format timestamps (ISO strings or epoch numbers) into user-friendly time
const formatFriendlyTimestamp = (timestamp: string | number | undefined): string => {
  if (!timestamp) return "";
  let date: Date;
  if (typeof timestamp === "number") {
    date = new Date(timestamp);
  } else {
    date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      // If it's already a formatted string, return it as fallback
      return timestamp;
    }
  }

  const now = new Date();
  
  // Format to local timezone time string, e.g. "10:50 PM"
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Check if it's today
  const isToday = now.toDateString() === date.toDateString();
  
  // Check if it's yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = yesterday.toDateString() === date.toDateString();

  if (isToday) {
    return `Today, ${timeStr}`;
  } else if (isYesterday) {
    return `Yesterday, ${timeStr}`;
  } else {
    // If older, display like: "May 31, 10:50 PM"
    const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return `${dateStr}, ${timeStr}`;
  }
};

export function ChatbotPage() {
  const { user, setCurrentUser } = useAuth();
  const { settings, setMusicEnabled, setChatbotPersona } = useSettings();
  const bgMusicEnabled = settings.music.enabled;
  const selectedPersona = settings.chatbotPersona as ChatbotPersona;
  // Profile modal states
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");

  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [isClearingHistory, setIsClearingHistory] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicTracks = [
    "/music/music 1.mp3",
    "/music/music 2.mp3",
    "/music/music 3.mp3",
    "/music/music 4.mp3",
    "/music/music 5.mp3",
  ];

  // Background music control
  const AMBIENT_MUSIC_VOLUME = 0.12;
  const MUSIC_FADE_DURATION_MS = 1400;

  const fadeAudio = (audio: HTMLAudioElement, targetVolume: number, duration: number) => {
    const startVolume = audio.volume;
    const change = targetVolume - startVolume;
    const startTime = Date.now();

    const fadeStep = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      audio.volume = Math.max(0, Math.min(1, startVolume + change * progress));

      if (progress < 1) {
        requestAnimationFrame(fadeStep);
      }
    };

    fadeStep();
  };

  const playRandomTrack = () => {
    const randomTrack = musicTracks[Math.floor(Math.random() * musicTracks.length)];
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = randomTrack;
      audioRef.current.loop = true;
      audioRef.current.volume = 0;
      audioRef.current.play().catch(() => {});
      fadeAudio(audioRef.current, AMBIENT_MUSIC_VOLUME, MUSIC_FADE_DURATION_MS);
    } else {
      const audio = new Audio(randomTrack);
      audio.volume = 0;
      audio.loop = true;
      audio.play().catch(() => {});
      fadeAudio(audio, AMBIENT_MUSIC_VOLUME, MUSIC_FADE_DURATION_MS);
      audioRef.current = audio;
    }
  };

  const stopMusic = () => {
    if (audioRef.current) {
      fadeAudio(audioRef.current, 0, MUSIC_FADE_DURATION_MS);
      window.setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }, MUSIC_FADE_DURATION_MS + 50);
    }
  };

  const toggleBgMusic = (enabled: boolean) => {
    void setMusicEnabled(enabled);
    if (enabled) {
      playRandomTrack();
    } else {
      stopMusic();
    }
  };

  const savePersona = (persona: ChatbotPersona) => {
    void setChatbotPersona(persona);
  };

  useEffect(() => {
    if (settings.music.enabled) {
      playRandomTrack();
    } else {
      stopMusic();
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [settings.music.enabled]);


  const initialMessage: Message = useMemo(
    () => ({
      type: "ai",
      content: "Namaste 🙏 I'm your NIRVAHA AI spiritual guide. How can I support your reflection today?",
      timestamp: new Date().toISOString(),
    }),
    []
  );

  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isExportingHistory, setIsExportingHistory] = useState(false);
  const [isSyncingHistory, setIsSyncingHistory] = useState(false);
  const [lastSyncLabel, setLastSyncLabel] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Helper to get storage key
  const getStorageKey = () => {
    return user?.id ? `nirvaha_chat_v2_${user.id}` : "nirvaha_chat_v2_anonymous";
  };

  // Persistent Storage
  const saveSessions = (next: Session[]) => {
    setSessions(next);
    localStorage.setItem(getStorageKey(), JSON.stringify(next));
  };

  const fetchBackendHistory = async () => {
    if (!user?.id || user.id === 'anonymous') return null;
    try {
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/reflect/history?userId=${encodeURIComponent(user.id)}`);
      if (!response.ok) {
        throw new Error('Unable to fetch backend history');
      }
      const data = await response.json();
      return Array.isArray(data.sessions) ? data.sessions as Session[] : [];
    } catch (error) {
      console.error('Backend reflection history error:', error);
      return null;
    }
  };

  const syncChatHistory = async () => {
    if (!user?.id || user.id === 'anonymous') return;
    setIsSyncingHistory(true);
    try {
      const backendSessions = await fetchBackendHistory();
      if (backendSessions && backendSessions.length) {
        // Merge without wiping local-only sessions (e.g. active New Reflection)
        setSessions(prev => {
          const backendIds = new Set(backendSessions.map((s: Session) => s.id));
          const localOnly = prev.filter(s => !backendIds.has(s.id));
          const merged = [...localOnly, ...backendSessions];
          localStorage.setItem(getStorageKey(), JSON.stringify(merged));
          return merged;
        });
        setLastSyncLabel(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        // Never touch currentSessionId during background sync
      }
    } finally {
      setIsSyncingHistory(false);
    }
  };

  // Logic: Start a new reflection — uses functional updater to avoid stale closure
  const startNewChat = (customSessions?: Session[] | React.MouseEvent) => {
    const id = crypto.randomUUID?.() || `${Date.now()}`;
    const newSession: Session = {
      id,
      title: "New Reflection",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    if (Array.isArray(customSessions)) {
      // Called programmatically with an explicit list (e.g. after clear)
      const next = [newSession, ...customSessions];
      setSessions(next);
      localStorage.setItem(getStorageKey(), JSON.stringify(next));
    } else {
      // Called from UI button — use functional updater so we always read latest state
      setSessions(prev => {
        const next = [newSession, ...prev];
        localStorage.setItem(getStorageKey(), JSON.stringify(next));
        return next;
      });
    }
    setCurrentSessionId(id);
    setInputValue("");
  };

  // Profile modal action handlers
  const handleClearHistory = async () => {
    setIsClearingHistory(true);
    try {
      if (user?.id && user.id !== 'anonymous') {
        const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/reflect/clear?userId=${encodeURIComponent(user.id)}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to clear backend history');
        }
      }

      const key = getStorageKey();
      localStorage.removeItem(key);
      setSessions([]);
      startNewChat([]);
      toast.success('Chat history cleared');
    } catch (error) {
      console.error('Clear history failed:', error);
      toast.error((error as Error).message || 'Unable to clear history right now');
    } finally {
      setIsClearingHistory(false);
      setIsPreferencesModalOpen(false);
    }
  };

  const handleExportHistory = () => {
    setIsExportingHistory(true);
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions, null, 2));
      const link = document.createElement('a');
      link.href = dataStr;
      link.download = `nirvaha-chat-backup-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Chat export downloaded successfully');
    } catch (error) {
      console.error('Export history failed:', error);
      toast.error('Unable to export history');
    } finally {
      setIsExportingHistory(false);
    }
  };

  const openProfileModal = () => {
    if (!user) {
      toast.warning("Please log in to manage your profile");
      return;
    }
    setProfileName(user.name || "");
    setProfileEmail(user.email || "");
    setIsProfileModalOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!profileName.trim() || !profileEmail.trim()) {
      toast.error("Display Name and Username/Email are required");
      return;
    }
    setIsSavingProfile(true);
    try {
      const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/users/profile/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          name: profileName.trim(),
          email: profileEmail.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        toast.success("Profile updated successfully! ✨");
        setIsProfileModalOpen(false);
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Save profile error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const currentSession = useMemo(
    () => sessions.find((s) => s.id === currentSessionId) || null,
    [sessions, currentSessionId]
  );

  const messages = currentSession?.messages ?? [];

  // Reload history when user logs in/out or switches accounts
  useEffect(() => {
    const loadHistory = async () => {
      const key = user?.id ? `nirvaha_chat_v2_${user.id}` : "nirvaha_chat_v2_anonymous";
      const saved = localStorage.getItem(key);

      if (user?.id && user.id !== 'anonymous') {
        const backendSessions = await fetchBackendHistory();
        if (backendSessions && backendSessions.length) {
          // Merge: keep any locally-created sessions (e.g. active New Reflection)
          // that don't exist in the backend list, then append backend sessions.
          setSessions(prev => {
            const backendIds = new Set(backendSessions.map((s: Session) => s.id));
            const localOnly = prev.filter(s => !backendIds.has(s.id));
            const merged = [...localOnly, ...backendSessions];
            localStorage.setItem(key, JSON.stringify(merged));
            return merged;
          });
          // Only set active session if nothing is selected yet
          setCurrentSessionId(prev => prev ?? backendSessions[0].id);
          return;
        }
      }

      if (saved) {
        try {
          const parsed: Session[] = JSON.parse(saved);
          if (parsed.length) {
            setSessions(parsed);
            setCurrentSessionId(prev => prev ?? parsed[0].id);
            return;
          }
        } catch {
          localStorage.removeItem(key);
        }
      }

      // No sessions anywhere — start fresh
      startNewChat([]);
    };

    loadHistory();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || user.id === 'anonymous') return;
    const intervalId = window.setInterval(() => {
      void syncChatHistory();
    }, 60000);
    return () => window.clearInterval(intervalId);
  }, [user?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const generateAIResponse = (message: string, history: Message[]): string => {
    const lower = message.trim().toLowerCase();
    const wordCount = message.trim().split(/\s+/).length;

    // ── Intent classification (mirrors backend logic) ──────────────────────
    const educationalPatterns: RegExp[] = [
      /^(what is|what are|what does|what do|what was|what were)\b/,
      /^(explain|describe|define|tell me about|how does|how do|how is|how are|why is|why are|why does|why do)\b/,
      /^(give me|show me|list|compare|difference between|pros and cons|advantages|disadvantages)\b/,
      /\b(algorithm|theorem|equation|formula|concept|theory|principle|law|model|architecture|protocol|framework|language|database|network|system|software|hardware|programming|coding|machine learning|deep learning|neural|ai|cloud|computing|data science|statistics|mathematics|physics|chemistry|biology|history|geography|economics|finance|accounting|marketing|management|engineering|science|technology)\b/,
      /\b(python|javascript|java|react|node|sql|html|css|api|rest|http|tcp|ip|dns|cpu|gpu|ram|linux|windows|docker|kubernetes|aws|azure|gcp)\b/,
      /\b(bayes|newton|einstein|darwin|calculus|algebra|geometry|trigonometry|probability|quantum|relativity|evolution|photosynthesis|mitosis|dna|rna|atom|molecule|ecosystem)\b/,
    ];
    const wellnessPatterns: RegExp[] = [
      /\b(feel|feeling|felt|emotion|emotional|mood|mental|anxiety|anxious|stress|stressed|depress|sad|lonely|hurt|grief|anger|angry|fear|scared|worry|worried|panic|overwhelm|burnout|exhausted|tired|sleep|insomnia|meditat|mindful|breath|chakra|healing|spiritual|soul|energy|aura|companion|therapy|therapist|counsel|self.worth|confidence|purpose|meaning|relationship|love|breakup|divorce|family|friend|conflict)\b/,
    ];
    const isWellness = wellnessPatterns.some(p => p.test(lower));
    const isEducational = !isWellness && educationalPatterns.some(p => p.test(lower));

    // ── Educational intent — answer the question directly ─────────────────
    if (isEducational) {
      const isDetailed = lower.includes("detail") || lower.includes("tell me more") || lower.includes("elaborate") || lower.includes("in depth");
      if (isDetailed) {
        return "My offline knowledge on this specific topic is limited, so for the most accurate and detailed explanation I'd recommend checking a trusted source like Wikipedia, Khan Academy, or the relevant documentation. Is there a particular aspect of this you'd like me to focus on?";
      }
      return "That's an interesting question. I can share a general overview, though for precise technical details a dedicated resource will serve you better. What specifically would you like to understand about this topic?";
    }

    // Detect response length intent (wellness only from here)
    const wantsDetailed = lower.includes("explain") || lower.includes("detail") || lower.includes("tell me more") || lower.includes("elaborate") || lower.includes("guide me") || lower.includes("step by step") || lower.includes("how do i") || lower.includes("what should i");
    const isShort = wordCount <= 6;

    // Context from conversation history
    const lastAiMsg = history.filter(m => m.type === "ai").pop();
    const recentUserMsgs = history.filter(m => m.type === "user").slice(-3).map(m => m.content.toLowerCase());

    // ── Greetings ──────────────────────────────────────────────────────────
    if (/^(hi|hello|hey|namaste|good morning|good evening|good afternoon|hola)\b/.test(lower)) {
      const greetings = [
        "Namaste. Good to have you here. What's on your mind today?",
        "Hello. This is your space to reflect, explore, or just think out loud. What would you like to talk about?",
        "Hey, glad you're here. How are you feeling right now?",
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // ── Gratitude ──────────────────────────────────────────────────────────
    if (lower.includes("thank") || lower.includes("thanks") || lower.includes("grateful")) {
      return "Glad this was helpful. Come back anytime you need a moment to think or reset. Take care of yourself.";
    }

    // ── Stress / Overwhelm / Anxiety / Panic ──────────────────────────────
    if (lower.includes("stress") || lower.includes("overwhelm") || lower.includes("anxious") || lower.includes("anxiety") || lower.includes("panic") || lower.includes("too much") || lower.includes("can't cope") || lower.includes("burnout")) {
      if (wantsDetailed) {
        return "Feeling overwhelmed often means your mind has been carrying more than it can comfortably manage. A good starting point is to slow your breathing — breathe in for four counts, hold for four, and exhale for six. This activates the part of your nervous system responsible for calm.\n\nFrom there, try writing down everything that feels urgent and pick just one thing to focus on today. The Guided Breathwork sessions in the Meditation section can also help reset your nervous system in as little as five minutes.\n\nBe patient with yourself. Clarity comes when the pressure eases, not before.";
      }
      if (isShort) {
        return "Feeling overwhelmed often means your mind has been carrying more than it can comfortably manage. Take a few slow breaths and focus on one thing at a time rather than everything at once. Small, steady steps create more clarity than trying to solve it all right now.";
      }
      return "Feeling overwhelmed often means your mind has been carrying more than it can comfortably manage. Take a few slow breaths and focus on one thing at a time rather than everything at once. Small, steady steps can create clarity and reduce pressure. Be gentle with yourself today.";
    }

    // ── Sadness / Grief / Loneliness / Depression ─────────────────────────
    if (lower.includes("sad") || lower.includes("lonely") || lower.includes("hurt") || lower.includes("cry") || lower.includes("grief") || lower.includes("depress") || lower.includes("empty") || lower.includes("numb") || lower.includes("lost") || lower.includes("hopeless")) {
      if (wantsDetailed) {
        return "Sadness and grief are not signs of weakness. They usually point to something you care about deeply, and that matters.\n\nWhen you're in this space, the most useful thing is often not to fix the feeling but to give it room. Try writing a few honest sentences in a journal, or simply sit quietly for a few minutes without trying to change how you feel.\n\nIf you'd like to talk to someone, the Nirvaha Companions section connects you with real people who offer one-on-one support. You don't have to work through this alone.";
      }
      if (isShort) {
        return "That kind of heaviness is real, and it's okay to feel it. You don't have to explain or justify it. Try to take things one slow, gentle breath at a time right now.";
      }
      return "Sadness often points to something that genuinely matters to you. You don't need to rush through it or make it go away. Giving yourself permission to feel it without judgment is already a meaningful step. Try writing a few thoughts down in a journal to help clear your mental space.";
    }

    // ── Anger / Frustration ───────────────────────────────────────────────
    if (lower.includes("angry") || lower.includes("anger") || lower.includes("frustrat") || lower.includes("furious") || lower.includes("irritat") || lower.includes("annoyed") || lower.includes("rage")) {
      if (isShort) {
        return "Anger usually points to a boundary that's been crossed or a need that hasn't been met. Take a few slow exhales to release the physical tension before addressing whatever triggered it.";
      }
      return "Anger is one of the more honest emotions — it usually signals that something important to you has been ignored or crossed. Before reacting, a few slow exhales can help shift you out of reaction mode. Giving yourself a quiet space to breathe first is a powerful next step.";
    }

    // ── Fear / Worry ──────────────────────────────────────────────────────
    if (lower.includes("fear") || lower.includes("afraid") || lower.includes("scared") || lower.includes("worry") || lower.includes("worried") || lower.includes("nervous") || lower.includes("dread")) {
      if (isShort) {
        return "Anxiety often pulls attention toward future uncertainties. Try bringing your focus back to the present moment through slow breathing or a short mindful pause. You don't need to solve everything right now.";
      }
      return "Anxiety often pulls attention toward future uncertainties. Try bringing your focus back to right now — notice five things around you, feel your feet on the floor, and take a slow breath. You don't need to solve everything at once. One step at a time is enough.";
    }

    // ── Joy / Happiness / Gratitude / Peace ───────────────────────────────
    if (lower.includes("happy") || lower.includes("joyful") || lower.includes("excited") || lower.includes("grateful") || lower.includes("content") || lower.includes("peaceful") || lower.includes("great") || lower.includes("wonderful") || lower.includes("amazing") || lower.includes("blessed")) {
      const joyResponses = [
        "That's good to hear. These moments are worth pausing on rather than rushing past. What's been contributing to this feeling?",
        "Glad to hear it. A little lightness goes a long way. What's been going well for you?",
        "That kind of peace is worth noticing. What brought you here today?",
      ];
      return joyResponses[Math.floor(Math.random() * joyResponses.length)];
    }

    // ── Sleep / Rest ──────────────────────────────────────────────────────
    if (lower.includes("sleep") || lower.includes("insomnia") || lower.includes("can't sleep") || lower.includes("tired") || lower.includes("exhausted") || lower.includes("rest")) {
      if (wantsDetailed) {
        return "When sleep feels out of reach, it usually means the nervous system hasn't had a chance to wind down. A few things that genuinely help: step away from screens 30 minutes before bed, keep the room cool and dark, and try a slow body scan starting from your feet and moving upward.\n\nThe Sound Healing section has a Sleep Therapy collection with delta wave frequencies designed to guide the brain into deep rest. Try listening to one of these tracks for 10 minutes tonight.";
      }
      return "When sleep feels out of reach, it usually means the nervous system is still running. Try dimming lights, stepping away from screens, and taking a few slow breaths before bed. A simple next step is to head to the Sound Healing section and play a relaxing delta wave frequency as you wind down.";
    }

    // ── Meditation / Breathwork ───────────────────────────────────────────
    if (lower.includes("meditat") || lower.includes("mindful") || lower.includes("breathwork") || lower.includes("breath") || lower.includes("breathing")) {
      if (wantsDetailed) {
        return "Meditation is simpler than most people think. You don't need to empty your mind — the practice is just noticing when your attention has wandered and gently bringing it back, without judgment. That moment of noticing is the meditation.\n\nThe Meditation section has guided sessions for every level, from 5-minute breathing exercises to longer immersive practices. Starting with just 5 minutes a day creates real changes in stress and focus within a couple of weeks. A good starting point is trying one of the short 5-minute exercises in the Meditation page.";
      }
      if (isShort) {
        return "Meditation is simply the practice of returning — to your breath, to the present moment, to yourself. Even one mindful breath counts. You can start by taking a slow inhale and counting to four, then exhaling for four.";
      }
      return "Meditation isn't about achieving a perfectly quiet mind. It's about learning to be present with whatever arises without being swept away by it. To begin, try a short guided breathing session on the Meditation page today.";
    }

    // ── Sound Healing / Frequencies / Music ──────────────────────────────
    if (lower.includes("sound healing") || lower.includes("frequency") || lower.includes("singing bowl") || lower.includes("binaural") || lower.includes("432") || lower.includes("528") || lower.includes("healing music")) {
      if (wantsDetailed) {
        return "Sound healing uses specific frequencies to influence brainwave states and the nervous system. Some common ones: 396Hz supports grounding and releasing fear, 432Hz promotes calm and clarity, 528Hz is associated with deep relaxation, and 639Hz supports heart-centered connection.\n\nThe Sound Healing library is organized by mood and intention, so you can choose based on how you're feeling. Tibetan singing bowls are particularly effective for nervous system regulation. Try selecting a singing bowl track on the Sound Healing page and letting the vibrations ground you.";
      }
      return "Specific sound frequencies can shift brainwave states, calm the nervous system, and support emotional release. A great next step is to visit the Sound Healing library and choose a calming frequency like 432Hz to begin.";
    }

    // ── General sound/music ───────────────────────────────────────────────
    if (lower.includes("music") || lower.includes("listen") || lower.includes("audio") || lower.includes("sound")) {
      return "Sound is one of the most direct ways to shift how you feel. The Sound Healing library has collections for every state, from energizing focus music to deeply calming sleep frequencies. Try exploring the library to find a track that matches your current mood.";
    }

    // ── Yoga / Movement / Body ────────────────────────────────────────────
    if (lower.includes("yoga") || lower.includes("movement") || lower.includes("body") || lower.includes("stretch") || lower.includes("exercise") || lower.includes("physical")) {
      return "Movement is one of the most effective ways to release stored tension and reconnect with yourself. Even 10 minutes of conscious movement, whether yoga, walking, or gentle stretching, can shift your energy noticeably. Try taking a short walk or doing a few light stretches to start.";
    }

    // ── Chakras / Energy / Spiritual ─────────────────────────────────────
    if (lower.includes("chakra") || lower.includes("energy") || lower.includes("spiritual") || lower.includes("soul") || lower.includes("spirit") || lower.includes("aura") || lower.includes("vibration") || lower.includes("consciousness")) {
      if (wantsDetailed) {
        return "The chakra system maps seven primary energy centers, each connected to different aspects of life. The root relates to safety and grounding, the sacral to creativity and emotion, the solar plexus to confidence and identity, the heart to love and connection, the throat to expression and truth, the third eye to intuition and clarity, and the crown to awareness and presence.\n\nThe Chakra Experience section offers sound frequencies and guided practices for each center. Try starting with a grounding Root Chakra track to build a sense of safety and presence.";
      }
      return "Our energy and emotional state are closely connected. When something feels blocked or off, it often reflects an imbalance in how we're relating to ourselves or the world around us. The Chakra Experience section uses sound frequencies and guided practices to help restore that inner alignment. A helpful first step is to focus on your Root Chakra to bring stability to your energy.";
    }

    // ── Companion / Mentor / Support ──────────────────────────────────────
    if (lower.includes("companion") || lower.includes("mentor") || lower.includes("therapist") || lower.includes("counselor") || lower.includes("someone to talk") || lower.includes("human support") || lower.includes("one on one")) {
      return "Reaching out for support is a practical and courageous step. The Nirvaha Companions section connects you with trained wellness guides who offer personalized one-on-one sessions. Try browsing their profiles to find a guide whose approach aligns with what you need today.";
    }

    // ── Purpose / Direction / Life questions ─────────────────────────────
    if (lower.includes("purpose") || lower.includes("meaning") || lower.includes("direction") || lower.includes("what am i doing") || lower.includes("lost") || lower.includes("confused") || lower.includes("don't know") || lower.includes("stuck")) {
      if (isShort) {
        return "Feeling uncertain about direction is often the beginning of a deeper search, not a sign that something is wrong. Try listing one or two small things that bring you simple joy today.";
      }
      return "Feeling without direction often means you've outgrown something but haven't yet found what comes next. Rather than searching for a grand answer, it can help to ask smaller questions: what feels alive in me right now, what drains me, or what would I do if I weren't afraid. Focus on one small choice that aligns with your values today.";
    }

    // ── Relationships ─────────────────────────────────────────────────────
    if (lower.includes("relationship") || lower.includes("partner") || lower.includes("family") || lower.includes("friend") || lower.includes("conflict") || lower.includes("argument") || lower.includes("breakup") || lower.includes("divorce") || lower.includes("love")) {
      if (isShort) {
        return "Relationships are often where our deepest growth happens. Give yourself space to breathe and process before trying to resolve any tension.";
      }
      return "Relationships tend to reflect both our strengths and the parts of ourselves still asking for attention. Whatever is arising right now, approaching it with curiosity rather than judgment, toward the other person and toward yourself, usually opens more space than trying to force a resolution. Take a step back and focus on grounding yourself first.";
    }

    // ── Self-worth / Confidence / Identity ───────────────────────────────
    if (lower.includes("confidence") || lower.includes("self-worth") || lower.includes("self esteem") || lower.includes("not good enough") || lower.includes("failure") || lower.includes("worthless") || lower.includes("insecure") || lower.includes("doubt")) {
      if (isShort) {
        return "The inner critic is rarely accurate. Try noting one small thing you did well today, or one quality you appreciate about yourself.";
      }
      return "The voice that says you're not enough is usually an old story, not a current truth. Self-worth isn't something you earn through achievement — it's something you return to by recognizing your value separate from what you do or produce. Practice breathing through the doubt and letting the criticism fade.";
    }

    // ── Gratitude practice ────────────────────────────────────────────────
    if (lower.includes("gratitude") || lower.includes("appreciate") || lower.includes("thankful") || lower.includes("bless")) {
      return "Gratitude doesn't deny difficulty — it trains the mind to notice what's also true alongside the hard things. Even naming three small things you appreciate each morning can shift your baseline mood over time. Try taking a moment to write down one small thing you're glad to have right now.";
    }

    // ── Journaling / Reflection ───────────────────────────────────────────
    if (lower.includes("journal") || lower.includes("reflect") || lower.includes("write") || lower.includes("diary")) {
      return "Writing externalizes what's swirling internally, giving it form and making it easier to work with. You don't need to write perfectly or at length — even a few honest sentences each day can create real clarity over time. Start by writing down three thoughts exactly as they appear in your mind.";
    }

    // ── Short / unclear input — context-aware fallback ────────────────────
    if (isShort) {
      const shortFallbacks = [
        "What's on your mind? I'm here.",
        "This space is yours. What would feel most helpful to explore today?",
        "Take your time. What's present for you right now?",
      ];
      return shortFallbacks[Math.floor(Math.random() * shortFallbacks.length)];
    }

    // ── Context-aware follow-up ───────────────────────────────────────────
    if (lastAiMsg) {
      const lastAi = lastAiMsg.content.toLowerCase();
      if (lastAi.includes("breath") || lastAi.includes("inhale") || lastAi.includes("exhale")) {
        return "Even a few conscious breaths create a real shift. Take a moment to notice any sensations in your body or shifts in your thoughts as you stay with this breath.";
      }
      if (lastAi.includes("what's") || lastAi.includes("what is") || lastAi.includes("how are")) {
        return "Every reflection, however small, is a step toward greater self-awareness. Allow yourself to rest in this awareness for a moment.";
      }
    }

    // ── General / open-ended fallback ─────────────────────────────────────
    const generalFallbacks = [
      "Whatever you're working through, you don't have to navigate it alone. Take a gentle breath and allow yourself to sit with this moment without pressure.",
      "Sometimes the most valuable thing is having a space to say what's true without it needing to be resolved immediately. Give yourself permission to just be present here.",
      "That's worth sitting with. Take a quiet breath and notice how it feels to let go of needing an immediate answer.",
    ];
    return generalFallbacks[Math.floor(Math.random() * generalFallbacks.length)];
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !currentSessionId) return;

    // Capture these synchronously before any async work
    const activeSessionId = currentSessionId;
    const sentMessage = inputValue.trim();

    const userMsg: Message = {
      type: "user",
      content: sentMessage,
      timestamp: new Date().toISOString(),
    };

    // Append user message using functional updater — always targets latest state
    setSessions(prev => {
      const next = prev.map(s => {
        if (s.id !== activeSessionId) return s;
        const isDefaultTitle = s.title === "New Reflection";
        return {
          ...s,
          title: isDefaultTitle ? sentMessage.slice(0, 30) : s.title,
          messages: [...s.messages, userMsg],
          updatedAt: Date.now(),
        };
      });
      localStorage.setItem(getStorageKey(), JSON.stringify(next));
      return next;
    });

    setInputValue("");
    setIsTyping(true);

    // Snapshot of messages for AI context (before the user message was appended)
    const contextMessages = messages;

    // Strip any markdown symbols before storing or displaying
    const stripMarkdown = (text: string): string =>
      text
        .replace(/^#{1,6}\s+/gm, '')           // headings: ## Title → Title
        .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1') // bold/italic: **text** → text
        .replace(/`{1,3}[^`]*`{1,3}/g, (m) =>   // inline/block code: keep content
          m.replace(/`/g, ''))
        .replace(/^[\s]*[-*•]\s+/gm, '')         // bullet points: - item → item
        .replace(/^\d+\.\s+/gm, (m, offset, str) => { // numbered lists: only strip if multi-line
          const lines = str.split('\n').filter((l: string) => /^\d+\.\s/.test(l.trim()));
          return lines.length > 1 ? '' : m;
        })
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links: [text](url) → text
        .replace(/_{1,2}([^_]+)_{1,2}/g, '$1')   // underscore italic/bold
        .replace(/\n{3,}/g, '\n\n')               // collapse excess blank lines
        .trim();

    const appendAiReply = (replyText: string) => {
      const aiResponse: Message = {
        type: "ai",
        content: stripMarkdown(replyText),
        timestamp: new Date().toISOString(),
      };
      // Use functional updater so we always append to the freshest state
      setSessions(prev => {
        const next = prev.map(s =>
          s.id === activeSessionId
            ? { ...s, messages: [...s.messages, aiResponse], updatedAt: Date.now() }
            : s
        );
        localStorage.setItem(getStorageKey(), JSON.stringify(next));
        return next;
      });
    };

    // Try backend first
    try {
      const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/reflect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: sentMessage,
          userId: user?.id,
          // Send last 6 messages (3 exchanges) so the backend has follow-up context
          recentMessages: contextMessages.slice(-6).map(m => ({ type: m.type, content: m.content })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.reply || generateAIResponse(sentMessage, contextMessages);
        await new Promise(resolve => setTimeout(resolve, 800));
        appendAiReply(replyText);
      } else {
        throw new Error("Backend not responding");
      }
    } catch (error) {
      console.error("AI Reflection Error:", error);
      const replyText = generateAIResponse(sentMessage, contextMessages);
      await new Promise(resolve => setTimeout(resolve, 1000));
      appendAiReply(replyText);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(prev => prev + (prev ? " " : "") + transcript);
      setIsListening(false);
    };

    recognition.start();
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = sessions.filter(s => s.id !== id);
    saveSessions(next);
    if (currentSessionId === id && next.length > 0) {
      setCurrentSessionId(next[0].id);
    } else if (next.length === 0) {
      startNewChat();
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-white" style={{ zIndex: 40, top: '64px' }}>
      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden relative text-[#1A2E2A]">
      {/* ChatGPT Style Sidebar - Minimal & Refined */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full flex flex-col border-r border-white/5 relative z-30 shadow-2xl"
            style={{ background: 'linear-gradient(180deg, #0C3B2E 0%, #05291F 100%)' }}
          >
            <div className="p-5 flex flex-col h-full">
              {/* NEW REFLECTION BUTTON */}
              <button
                onClick={startNewChat}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/15 transition-all mb-8 group border border-white/5"
              >
                <Leaf className="w-4 h-4 text-emerald-300 group-hover:text-emerald-200 transition-colors" />
                <span className="text-sm font-semibold tracking-wide">New Reflection</span>
              </button>

              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                <p className="text-[11px] font-bold tracking-[0.25em] text-white/40 uppercase px-3 mb-4 mt-2">History</p>
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSessionId(s.id)}
                    className={`w-full flex items-center justify-between group px-4 py-3 rounded-xl transition-all ${s.id === currentSessionId
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-white/60 hover:bg-white/5'
                      }`}
                  >
                    <div className="flex items-center gap-3 truncate flex-1 min-w-0">
                      <MessageSquare className="w-4 h-4 shrink-0 opacity-50" />
                      <div className="flex items-start truncate min-w-0 text-left">
                        <span className="text-sm truncate font-medium leading-tight">{s.title}</span>
                      </div>
                    </div>
                    <Trash2
                      onClick={(e) => deleteSession(s.id, e)}
                      className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity cursor-pointer ml-2"
                    />
                  </button>
                ))}
              </div>

              <div className="pt-6 border-t border-white/5 space-y-1.5">
                <button
                  onClick={openProfileModal}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 group"
                >
                  <User className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="text-sm font-medium">Personal Profile</span>
                </button>
                <button
                  onClick={() => setIsPreferencesModalOpen(true)}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 group"
                >
                  <Settings className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="text-sm font-medium">Preferences</span>
                  {bgMusicEnabled && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Music playing" />
                  )}
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Enhanced Glassmorphism Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #e8f5ee 0%, #f0faf4 40%, #e4f4ec 100%)' }} />

          {/* Ripple rings — breath pulsing from center */}
          {[1,2,3,4].map((i) => (
            <motion.div
              key={`ripple-${i}`}
              className="absolute rounded-full border border-emerald-300/25"
              style={{ left: '50%', top: '45%', translateX: '-50%', translateY: '-50%' }}
              animate={{ width: [60, 420], height: [60, 420], opacity: [0.5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeOut', delay: i * 1.25 }}
            />
          ))}

          {/* Orb glow — soft green radial orbs drifting */}
          <motion.div
            className="absolute w-80 h-80 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.18) 0%, transparent 70%)', top: '10%', left: '15%' }}
            animate={{ x: [0, 60, -30, 0], y: [0, -40, 60, 0], scale: [1, 1.2, 0.9, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-64 h-64 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 70%)', bottom: '20%', right: '10%' }}
            animate={{ x: [0, -50, 40, 0], y: [0, 50, -30, 0], scale: [1, 0.85, 1.15, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          />

          {/* Floating leaves — corners, CSS only no emojis */}
          {[0,1,2,3].map((i) => (
            <motion.div
              key={`leaf-${i}`}
              className="absolute rounded-full"
              style={{
                width: 8 + i * 2,
                height: 8 + i * 2,
                background: `rgba(52,211,153,${0.3 + i * 0.06})`,
                left: i % 2 === 0 ? `${8 + i * 6}%` : `${75 + i * 4}%`,
                top: i < 2 ? '8%' : '75%',
                filter: 'blur(1px)',
              }}
              animate={{
                y: [0, -18, 8, -12, 0],
                x: [0, 10, -6, 8, 0],
                scale: [1, 1.3, 0.8, 1.1, 1],
              }}
              transition={{ duration: 7 + i * 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 1.2 }}
            />
          ))}

          {/* Rising particles — green dots from bottom */}
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: 3 + (i % 3),
                height: 3 + (i % 3),
                background: `rgba(52,211,153,${0.25 + (i % 4) * 0.08})`,
                left: `${6 + i * 6.5}%`,
                bottom: '-8px',
              }}
              animate={{ y: [0, -(280 + i * 30)], opacity: [0, 0.7, 0] }}
              transition={{ duration: 8 + i * 0.6, repeat: Infinity, ease: 'easeOut', delay: i * 0.55 }}
            />
          ))}

          {/* Wave flow — bottom gentle water wave */}
          <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 100" preserveAspectRatio="none" style={{ height: 100 }}>
            <motion.path
              fill="rgba(52,211,153,0.18)"
              animate={{ d: [
                'M0,50 C360,90 720,10 1080,50 C1260,70 1380,30 1440,50 L1440,100 L0,100 Z',
                'M0,50 C360,10 720,90 1080,50 C1260,30 1380,70 1440,50 L1440,100 L0,100 Z',
                'M0,50 C360,90 720,10 1080,50 C1260,70 1380,30 1440,50 L1440,100 L0,100 Z',
              ]}}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.path
              fill="rgba(16,185,129,0.12)"
              animate={{ d: [
                'M0,65 C480,25 960,90 1440,65 L1440,100 L0,100 Z',
                'M0,65 C480,90 960,25 1440,65 L1440,100 L0,100 Z',
                'M0,65 C480,25 960,90 1440,65 L1440,100 L0,100 Z',
              ]}}
              transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
          </svg>
        </div>
        
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-4 top-4 z-40 p-1.5 hover:bg-gray-100 rounded-md text-gray-400 transition-colors"
          title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${!isSidebarOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Chat / Empty State Container */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center relative z-10 w-full"
        >
          {messages.length === 0 && !inputValue ? (
            /* EMPTY STATE */
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl px-6 py-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-12"
              >
                <h2 className="text-6xl font-bold mb-5 tracking-tight text-[#1A2E2A] flex justify-center whitespace-nowrap" style={{ 
                  fontFamily: "'Playfair Display', serif",
                  textShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}>
                  <TextType 
                    text={["Reconnect With Your Inner Self", "Pause and Reflect", "Begin Your Inner Journey", "Take a Breath and Reflect"]}
                    typingSpeed={80}
                    pauseDuration={3000}
                    showCursor
                    cursorCharacter="_"
                    loop={true}
                  />
                </h2>
                <div className="text-[#2D6A4F] font-semibold text-lg animate-pulse tracking-widest uppercase" style={{ fontSize: '13px' }}>
                  Start your reflection...
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
              >
                {[
                  { label: "Grounding Exercise", prompt: "I'm feeling a bit overwhelmed. Can you lead me through a quick grounding exercise?", desc: "Reset your nervous system" },
                  { label: "Stress Relief", prompt: "I've had a long day. What's a good way to release stress right now?", desc: "Release mental tension" },
                  { label: "Meditation Path", prompt: "I'm new to meditation. Where should I begin my journey today?", desc: "Start your practice" },
                  { label: "Talk to AI Guide", prompt: "I just need someone to talk to. How can we begin?", desc: "Personal reflection" }
                ].map((suggestion, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: i * 0.15, 
                      duration: 0.5,
                      ease: "circOut"
                    }}
                    whileHover={{ 
                      y: -2,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setInputValue(suggestion.prompt)}
                    className="group cursor-pointer"
                  >
                    <div className="relative p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 group-hover:text-emerald-700 transition-colors truncate">
                            {suggestion.label}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">
                            {suggestion.desc}
                          </p>
                        </div>
                        
                        {/* Simple arrow */}
                        <div className="flex-shrink-0 text-gray-400 group-hover:text-emerald-500 transition-colors">
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ) : (
            /* CHAT MODE */
            <div className="w-full max-w-3xl px-6 py-10 space-y-10">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex w-full ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-4 max-w-[75%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.type === 'ai' && (
                      <div className="w-8 h-8 rounded-lg bg-[#F0F7F4] flex items-center justify-center shrink-0 mt-1">
                        <MessageCircle className="w-5 h-5 text-[#2D6A4F]" />
                      </div>
                    )}
                    <div className={`flex flex-col gap-1.5 ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.type === 'user'
                        ? 'bg-[#2D6A4F] text-white rounded-tr-none'
                        : 'bg-[#F8FAF9] text-[#1A2E2A] border border-gray-100 rounded-tl-none'
                        }`} style={{ whiteSpace: 'pre-line' }}>
                        {msg.content}
                      </div>
                      <span className={`text-[10px] font-semibold tracking-wider text-gray-400 px-1 uppercase ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                        {formatFriendlyTimestamp(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#F0F7F4] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-[#2D6A4F]" />
                  </div>
                  <div className="bg-[#F8FAF9] border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-[#2D6A4F]/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#2D6A4F]/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#2D6A4F]/40 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center Bottom Input Area */}
        <div className="w-full shrink-0 max-w-2xl mx-auto p-4 pb-8 z-10">
          <div className="relative flex items-center bg-white rounded-full px-4 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-gray-100 focus-within:border-[#2D6A4F]/30 focus-within:ring-6 focus-within:ring-[#2D6A4F]/5 transition-all duration-500">
            <button 
              onClick={startNewChat}
              className="p-1.5 text-emerald-500 hover:text-emerald-600 transition-colors rounded-full hover:bg-emerald-50"
              title="New Reflection"
            >
              <Leaf className="w-4 h-4" />
            </button>

            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Start reflection..."
              className="flex-1 bg-transparent py-1.5 px-2 outline-none resize-none text-[14px] max-h-40 custom-scrollbar font-medium text-[#1A2E2A]"
              rows={1}
              style={{ height: 'auto' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
            />

            <div className="flex items-center gap-1 pr-1">
              <button
                onMouseDown={toggleListening}
                className={`p-1.5 rounded-lg transition-all ${isListening 
                  ? 'text-red-500 bg-red-50 animate-pulse' 
                  : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-50'
                }`}
                title={isListening ? "Listening..." : "Speak Reflection"}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className={`p-1.5 rounded-lg transition-all ${inputValue.trim()
                  ? 'text-emerald-500 hover:text-emerald-600'
                  : 'text-gray-300'
                  }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-center text-[#1A2E2A]/70 font-semibold tracking-wide">
             Your safe space for inner reflection • NIRVAHA AI
          </p>
        </div>
      </main>

      {/* Personal Profile Edit Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with modern blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute inset-0 bg-[#05291F]/40 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.45 }}
              className="relative w-full max-w-[380px] bg-white rounded-2xl shadow-[0_16px_48px_rgba(5,41,31,0.16)] border border-[#0C3B2E]/5 p-5 overflow-hidden z-10 text-[#1A2E2A]"
            >
              {/* Organic background accents */}
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#52B788]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-[#0C3B2E]/5 rounded-full blur-2xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Title */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-black text-[#0C3B2E] tracking-tight">Personal Profile</h3>
                <p className="text-[11px] font-semibold text-gray-400 mt-0.5">Manage your identity in Nirvaha</p>
              </div>

              <div className="flex flex-col items-center mb-4">
                <InitialsAvatar
                  name={profileName || user?.name}
                  size="2xl"
                  className="border-4 border-white shadow-[0_6px_20px_rgba(45,106,79,0.22)]"
                />
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0C3B2E]/60 uppercase tracking-wider mb-1.5 px-1">Display Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Enter display name"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold outline-none focus:border-[#2D6A4F] focus:ring-4 focus:ring-[#2D6A4F]/5 transition-all text-[#1A2E2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C3B2E]/60 uppercase tracking-wider mb-1.5 px-1">Username / Email</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="Enter username or email"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold outline-none focus:border-[#2D6A4F] focus:ring-4 focus:ring-[#2D6A4F]/5 transition-all text-[#1A2E2A]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  disabled={isSavingProfile}
                  className="flex-1 py-3 px-4 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSavingProfile}
                  className="flex-1 py-3 px-4 rounded-2xl bg-[#2D6A4F] hover:bg-[#1B4332] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none text-white text-sm font-bold shadow-lg shadow-[#2D6A4F]/20 flex items-center justify-center gap-2 transition-all"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ====== PREFERENCES MODAL ====== */}
      <AnimatePresence>
        {isPreferencesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreferencesModalOpen(false)}
              className="absolute inset-0 bg-[#05291F]/40 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", duration: 0.45 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-[0_12px_40px_rgba(5,41,31,0.12)] border border-[#0C3B2E]/5 p-5 overflow-hidden z-10 text-[#1A2E2A]"
            >
              {/* Decorative accents */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#52B788]/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#0C3B2E]/5 rounded-full blur-2xl pointer-events-none" />

              {/* Close */}
              <button
                onClick={() => setIsPreferencesModalOpen(false)}
                className="absolute top-3.5 right-3.5 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#0C3B2E]/5">
                <div className="w-9 h-9 rounded-xl bg-[#EAF5F0] flex items-center justify-center text-[#2D6A4F] shadow-sm">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#0C3B2E] tracking-tight">Preferences</h3>
                  <p className="text-[11px] font-semibold text-gray-400 mt-0.5">Personalize your reflection space</p>
                </div>
              </div>

              <div className="space-y-5">

                {/* ── Background Music Toggle ── */}
                <div className="flex items-center justify-between py-3 border-b border-[#0C3B2E]/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F0F7F4] flex items-center justify-center">
                      {bgMusicEnabled
                        ? <Volume2 className="w-4 h-4 text-[#2D6A4F]" />
                        : <VolumeX className="w-4 h-4 text-gray-400" />
                      }
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0C3B2E]">Background Music</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {bgMusicEnabled ? "Playing ambient wellness track" : "Music disabled"}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    id="pref-bgmusic-toggle"
                    onClick={() => toggleBgMusic(!bgMusicEnabled)}
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none ${
                      bgMusicEnabled ? 'bg-[#2D6A4F]' : 'bg-gray-200'
                    }`}
                  >
                    <motion.div
                      animate={{ x: bgMusicEnabled ? 22 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>

                {/* ── Persona Selector ── */}
                <div className="py-3.5 border-b border-[#0C3B2E]/5">
                  <label className="block text-[10px] font-bold text-[#0C3B2E]/50 uppercase tracking-widest mb-2 px-0.5">AI Persona</label>
                  <div className="relative">
                    <select
                      id="pref-persona-select"
                      value={selectedPersona}
                      onChange={(e) => savePersona(e.target.value as ChatbotPersona)}
                      className="w-full appearance-none px-4 py-2.5 pr-8 rounded-full border border-emerald-600/10 text-xs font-semibold outline-none focus:border-[#2D6A4F] focus:ring-4 focus:ring-[#2D6A4F]/5 transition-all text-[#1C332E] bg-[#F4F9F6] cursor-pointer"
                    >
                      <option value="Supportive">Supportive Persona</option>
                      <option value="Emotional">Emotional Persona</option>
                      <option value="Deep">Deep Wisdom Persona</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 px-0.5 leading-relaxed">
                    {selectedPersona === "Supportive" && "Your guide is warm and encouraging, offering gentle support."}
                    {selectedPersona === "Emotional" && "Your guide leads with deep empathy and compassionate presence."}
                    {selectedPersona === "Deep" && "Your guide offers philosophical, reflective wisdom for deeper inquiry."}
                  </p>
                </div>

                {/* ── Clear Chat History ── */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-xs font-bold text-gray-700">Clear chat history</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-normal">Delete all sessions permanently</p>
                  </div>
                  <button
                    id="pref-clear-history-btn"
                    onClick={handleClearHistory}
                    disabled={isClearingHistory}
                    className="px-3.5 py-1.5 rounded-full border border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 disabled:opacity-60 text-[10px] font-bold transition-all flex items-center gap-1 active:scale-[0.98]"
                  >
                    {isClearingHistory ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Clearing</>
                    ) : (
                      <><Trash2 className="w-3.5 h-3.5" /> Clear History</>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-[#0C3B2E]/5">
                  <div>
                    <p className="text-xs font-bold text-gray-700">Export chat backup</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-normal">Download your saved reflections from the backend</p>
                  </div>
                  <button
                    id="pref-export-history-btn"
                    onClick={handleExportHistory}
                    disabled={isExportingHistory}
                    className="px-3.5 py-1.5 rounded-full border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-700 disabled:opacity-60 text-[10px] font-bold transition-all flex items-center gap-1 active:scale-[0.98]"
                  >
                    {isExportingHistory ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Exporting</>
                    ) : (
                      <><Download className="w-3.5 h-3.5" /> Export</>
                    )}
                  </button>
                </div>

                {lastSyncLabel && (
                  <div className="text-[11px] text-gray-400 pt-2">
                    Synced with backend at {lastSyncLabel}
                  </div>
                )}

              </div>

              {/* Footer */}
              <div className="mt-6">
                <button
                  onClick={() => setIsPreferencesModalOpen(false)}
                  className="w-full py-2.5 px-4 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-[#2D6A4F]/15 transition-all"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>
      </div>
    </div>
  );
}
