import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mic,
  Smile,
  Leaf,
  MessageSquare,
  Settings,
  User,
  Trash2,
  ChevronLeft,
  BrainCircuit
} from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TextType from "../TextType";
import { BACKEND_CONFIG } from "@/config/backend";
import { useAuth } from "@/contexts/AuthContext";

type Message = { type: "ai" | "user"; content: string; timestamp: string };
type Session = { id: string; title: string; messages: Message[]; createdAt: number; updatedAt: number };

export function ChatbotPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Persistent Storage
  const saveSessions = (next: Session[]) => {
    setSessions(next);
    localStorage.setItem("nirvaha_chat_v2", JSON.stringify(next));
  };

  // Logic: Start empty if requested
  const startNewChat = () => {
    const id = crypto.randomUUID?.() || `${Date.now()}`;
    const newSession: Session = {
      id,
      title: "New Reflection",
      messages: [], // Empty start
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveSessions([newSession, ...sessions]);
    setCurrentSessionId(id);
    setInputValue("");
  };

  const currentSession = useMemo(
    () => sessions.find((s) => s.id === currentSessionId) || null,
    [sessions, currentSessionId]
  );

  const messages = currentSession?.messages ?? [];

  useEffect(() => {
    const saved = localStorage.getItem("nirvaha_chat_v2");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length) {
        setSessions(parsed);
        setCurrentSessionId(parsed[0].id);
        return;
      }
    }
    startNewChat();
  }, []);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const generateAIResponse = (message: string): string => {
    const lower = message.toLowerCase();
    
    // Feature-specific responses
    if (lower.includes("meditat")) {
      return "Meditation is the heart of Nirvaha. You can explore our curated sessions in the Meditation section to find your inner calm. Would you like me to guide you through a simple breathing technique now? 🧘‍♀️";
    }
    if (lower.includes("sound") || lower.includes("music") || lower.includes("healing")) {
      return "Sound Healing uses vibrational frequencies to restore balance. Check out our All Sound Healing Sessions for a deep immersive experience. 🎵";
    }
    if (lower.includes("companion") || lower.includes("mentor") || lower.includes("expert")) {
      return "Our Nirvaha Companions are here for personalized support. You can browse through our mentors in the Companion section to find a guide that resonates with you. 🤝";
    }
    if (lower.includes("marketplace") || lower.includes("buy") || lower.includes("product")) {
      return "In the Nirvaha Marketplace, you'll find curated wellness products, from crystals to essential oils, all designed to support your spiritual practice. 🛍️";
    }
    if (lower.includes("community") || lower.includes("post") || lower.includes("share")) {
      return "The Nirvaha Community is a safe space to share your journey and connect with others. You can see what others are reflecting on in the Community feed. 🌿";
    }

    // Emotional responses
    if (lower.includes("stress") || lower.includes("overwhelm") || lower.includes("anxious")) {
      return "I hear you. Stress is your body asking for rest. Let's try a simple pause: inhale for 4 counts, hold for 4, exhale for 4. You are safe here. 🌬️";
    }
    
    if (lower.includes("sad") || lower.includes("lonely") || lower.includes("depress")) {
      return "I'm so sorry you're feeling this way. Remember that sadness is a visitor, not a resident. I'm here to listen. What's on your mind? 💙";
    }

    if (lower.includes("hello") || lower.includes("hi") || lower.includes("namaste")) {
      return "Namaste 🙏 I am your NIRVAHA AI spiritual guide. How are you feeling in this moment? I am here to support your reflection.";
    }

    // Default
    return "That's a deep reflection. I'm listening with an open heart. Can you tell me more about how that makes you feel? 🌿";
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
        const replyText = data.reply || generateAIResponse(sentMessage);
        
        const aiResponse: Message = {
          type: "ai",
          content: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

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
      const replyText = generateAIResponse(sentMessage);
      
      const aiResponse: Message = {
        type: "ai",
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

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
                  onClick={() => navigate('/dashboard/profile')}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 group"
                >
                  <User className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="text-sm font-medium">Personal Profile</span>
                </button>
                <button
                  onClick={() => navigate('/dashboard/overview')}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 group"
                >
                  <Settings className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="text-sm font-medium">Preferences</span>
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
                        }`}>
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
