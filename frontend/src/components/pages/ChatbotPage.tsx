import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mic,
  Leaf,
  MessageSquare,
  Settings,
  User,
  Trash2,
  ChevronLeft,
  BrainCircuit,
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
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
        saveSessions(backendSessions);
        setCurrentSessionId(backendSessions[0].id);
        setLastSyncLabel(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } finally {
      setIsSyncingHistory(false);
    }
  };

  // Logic: Start empty if requested
  const startNewChat = (customSessions?: Session[] | React.MouseEvent) => {
    const id = crypto.randomUUID?.() || `${Date.now()}`;
    const newSession: Session = {
      id,
      title: "New Reflection",
      messages: [], // Empty start
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const activeSessions = Array.isArray(customSessions) ? customSessions : sessions;
    saveSessions([newSession, ...activeSessions]);
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

  const handleExportHistory = async () => {
    if (!user?.id || user.id === 'anonymous') {
      toast.warning('Please log in to export your reflection history.');
      return;
    }

    setIsExportingHistory(true);
    try {
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/reflect/export?userId=${encodeURIComponent(user.id)}`);
      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Export request failed');
      }

      const downloadUrl = `${BACKEND_CONFIG.API_BASE_URL}${data.url}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = data.filename || `nirvaha-chat-backup-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Chat export downloaded');
    } catch (error) {
      console.error('Export history failed:', error);
      toast.error((error as Error).message || 'Unable to export history');
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
          saveSessions(backendSessions);
          setCurrentSessionId(backendSessions[0].id);
          return;
        }
      }

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.length) {
            setSessions(parsed);
            setCurrentSessionId(parsed[0].id);
            return;
          }
        } catch {
          localStorage.removeItem(key);
        }
      }

      // If no sessions, initialize with an empty reflection session
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
    const lower = message.toLowerCase();
    
    // Find last user topic if any
    const lastUserMsg = history.filter(m => m.type === "user").pop();
    const lastAiMsg = history.filter(m => m.type === "ai").pop();
    const lastUserContent = lastUserMsg ? lastUserMsg.content.toLowerCase() : "";

    let validation = "";
    let guidance = "";
    let reflectionQuestion = "";

    // Helper check to see if user is explicitly asking for tools, help, suggestions, etc.
    const isAskingForSuggestions = lower.includes("how") || lower.includes("tool") || lower.includes("suggest") || lower.includes("help") || lower.includes("do") || lower.includes("exercise") || lower.includes("recom");

    // 1. Emotion & Intent Matching
    if (lower.includes("stress") || lower.includes("overwhelm") || lower.includes("anxious") || lower.includes("panic")) {
      validation = "I hear the weight in your words. Feeling overwhelmed or stressed is a heavy burden, but it is also your mind asking for a gentle pause. Take a slow breath with me.";
      if (isAskingForSuggestions) {
        guidance = "If you feel ready to explore tools, our Meditation section offers Guided Breathwork sessions, and our Sound Healing frequencies are designed to help soothe the nervous system.";
      } else {
        guidance = "Allow yourself a moment to step back from all the demands. There is no need to resolve everything this very second. Let your shoulders drop and feel the ground beneath you.";
      }
      reflectionQuestion = "When you breathe in right now, where in your body do you feel the tension holding on?";
    } else if (lower.includes("sad") || lower.includes("lonely") || lower.includes("hurt") || lower.includes("cry") || lower.includes("grief") || lower.includes("depress")) {
      validation = "I am holding space for you. Sadness and grief are not signs of weakness, but visitors showing how deeply you care and feel. You do not have to carry this alone.";
      if (isAskingForSuggestions) {
        guidance = "If you feel you need deeper support, you can connect with our Nirvaha Companions for one-on-one personalized, compassionate guidance.";
      } else {
        guidance = "It is completely okay to not be okay right now. There is no rush to feel better. Let the feeling be, and treat yourself with absolute kindness.";
      }
      reflectionQuestion = "Would you like to sit with this feeling in silence for a moment, or is there a specific thought you want to express?";
    } else if (lower.includes("happy") || lower.includes("good") || lower.includes("great") || lower.includes("peaceful")) {
      validation = "What a beautiful space you are in. Celebrating moments of joy and peace is a wonderful way to ground them in your heart.";
      guidance = "Savoring these moments of clarity helps build a gentle inner sanctuary. You don't need to do anything to optimize or change it—just be fully present in this lightness.";
      reflectionQuestion = "What is one little thing that brought you this feeling of peace today?";
    } else if (lower.includes("meditat") || lower.includes("breath")) {
      validation = "Meditation is a gentle return to yourself. It is not about silencing the mind, but about listening to it with kindness.";
      guidance = "Our Meditation section offers structured guided paths for mindfulness, stress relief, and deep sleep. You can start with a short 5-minute session to ease in.";
      reflectionQuestion = "Have you meditated before, or are we beginning a new chapter together today?";
    } else if (lower.includes("sound") || lower.includes("healing") || lower.includes("music") || lower.includes("frequency")) {
      validation = "Sound has a beautiful way of bypassing the busy mind and speaking directly to our nervous system.";
      guidance = "In our Sound Healing library, you can tune into specific healing frequencies like 432Hz for grounding or 528Hz for relaxation.";
      reflectionQuestion = "Is there a particular sound or instrument, like singing bowls or rain, that helps you feel safe?";
    } else if (lower.includes("companion") || lower.includes("mentor") || lower.includes("expert") || lower.includes("guide")) {
      validation = "Seeking a mentor or companion is a courageous step on the path of self-discovery.";
      guidance = "Our Nirvaha Companions are wellness experts who offer personalized, compassionate guidance. You can browse through their profiles to find someone who resonates with you.";
      reflectionQuestion = "Are you looking for support with something specific, like anxiety, sleep, or daily mindfulness?";
    } else if (lower.includes("marketplace") || lower.includes("buy") || lower.includes("product")) {
      validation = "Creating a soothing physical space is a lovely way to support your inner wellness journey.";
      guidance = "In the Nirvaha Marketplace, you can find curated items like essential oils, grounding crystals, and wellness journals to complement your practice.";
      reflectionQuestion = "Are you looking for something to help with your physical space, or a gift for a loved one?";
    } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("namaste") || lower.includes("hey")) {
      validation = "Namaste 🙏 I am your NIRVAHA AI spiritual guide, here to listen and walk with you.";
      guidance = "I am here to offer a safe, quiet space for you to reflect, pause, or talk through whatever is on your mind.";
      reflectionQuestion = "How does your heart feel in this exact moment?";
    } else if (lower.includes("thank") || lower.includes("thanks")) {
      validation = "You are so welcome. Gratitude is a beautiful reflection of a warm heart.";
      guidance = "Remember, you can return to this space anytime you need to pause, breathe, or reflect.";
      reflectionQuestion = "Is there anything else you would like to reflect on before you move forward today?";
    } else {
      // Memory / Context fallbacks
      if (lastAiMsg && lastAiMsg.content.includes("where in your body")) {
        validation = "Thank you for bringing awareness to that part of your body. Sensing where tension lives is the first step toward releasing it.";
        guidance = "Allow yourself to imagine sending a warm, soft breath to that area, letting it soften with each exhale.";
        reflectionQuestion = "Would you like to try a short breathing pause together now?";
      } else if (lastAiMsg && lastAiMsg.content.includes("How does your heart feel")) {
        validation = "I hear you, and I honor whatever feeling you are sitting with right now. Every emotion has its own wisdom.";
        guidance = "There is no right or wrong way to feel. Just allowing yourself to be present is a profound form of self-care.";
        reflectionQuestion = "What feels like the most supportive thing for you right now?";
      } else {
        validation = "Thank you for sharing that reflection with me. Every thought and emotion is a stepping stone on your journey of self-discovery.";
        guidance = "I am here to listen and support you. You don't have to navigate these paths alone.";
        reflectionQuestion = "What is the primary feeling or thought that stays with you after sharing this?";
      }
    }

    if (guidance) {
      return `${validation}\n\n${guidance}\n\n${reflectionQuestion}`;
    }
    return `${validation}\n\n${reflectionQuestion}`;
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !currentSessionId) return;

    const userMsg: Message = {
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedSessions = sessions.map(s => {
      if (s.id === currentSessionId) {
        const isDefaultTitle = s.title === "New Reflection";
        return {
          ...s,
          title: isDefaultTitle ? inputValue.slice(0, 30) : s.title,
          messages: [...s.messages, userMsg],
          updatedAt: Date.now()
        };
      }
      return s;
    });

    saveSessions(updatedSessions);
    const sentMessage = inputValue;
    setInputValue("");
    setIsTyping(true);

    // Try backend first
    try {
      const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/reflect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: sentMessage, userId: user?.id }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.reply || generateAIResponse(sentMessage, messages);
        
        const aiResponse: Message = {
          type: "ai",
          content: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        // Empathetic timing delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const withAi = updatedSessions.map(s =>
          s.id === currentSessionId ? { ...s, messages: [...s.messages, aiResponse], updatedAt: Date.now() } : s
        );

        saveSessions(withAi);
      } else {
        throw new Error("Backend not responding");
      }
    } catch (error) {
      console.error("AI Reflection Error:", error);
      // Use frontend AI response system as fallback
      const replyText = generateAIResponse(sentMessage, messages);
      
      const aiResponse: Message = {
        type: "ai",
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      // Empathetic timing delay for fallback
      await new Promise(resolve => setTimeout(resolve, 1000));

      const withAi = updatedSessions.map(s =>
        s.id === currentSessionId ? { ...s, messages: [...s.messages, aiResponse], updatedAt: Date.now() } : s
      );

      saveSessions(withAi);
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
                    <div className="flex items-center gap-3 truncate">
                      <MessageSquare className="w-4 h-4 shrink-0 opacity-50" />
                      <span className="text-sm truncate font-medium">{s.title}</span>
                    </div>
                    <Trash2
                      onClick={(e) => deleteSession(s.id, e)}
                      className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity cursor-pointer"
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
                  <div className={`flex gap-4 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.type === 'ai' && (
                      <div className="w-8 h-8 rounded-lg bg-[#F0F7F4] flex items-center justify-center shrink-0 mt-1">
                        <BrainCircuit className="w-5 h-5 text-[#2D6A4F]" />
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                      <div className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.type === 'user'
                        ? 'bg-[#2D6A4F] text-white rounded-tr-none'
                        : 'bg-[#F8FAF9] text-[#1A2E2A] border border-gray-100 rounded-tl-none'
                        }`} style={{ whiteSpace: 'pre-line' }}>
                        {msg.content}
                      </div>
                      <span className={`text-[10px] font-semibold tracking-wider text-gray-400 px-1 uppercase ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#F0F7F4] flex items-center justify-center shrink-0">
                    <BrainCircuit className="w-5 h-5 text-[#2D6A4F]" />
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
