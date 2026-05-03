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
import TextType from "../TextType";
import { BACKEND_CONFIG } from "@/config/backend";

type Message = { type: "ai" | "user"; content: string; timestamp: string };
type Session = { id: string; title: string; messages: Message[]; createdAt: number; updatedAt: number };

export function ChatbotPage() {
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
    const trimmed = message.trim();
    
    // Greeting responses
    if (lower.includes("hello") || lower.includes("hi") || lower.includes("namaste") || lower.includes("hey")) {
      return "Namaste 🙏 Welcome back. How are you feeling in this moment? I'm here to guide you.";
    }
    
    // Stress/overwhelm responses
    if (lower.includes("stress") || lower.includes("stressed") || lower.includes("overwhelm") || lower.includes("overwhelmed")) {
      return "I hear you. Stress is your body asking for rest. Let's try the 4-7-8 breath: inhale for 4 counts, hold for 7, exhale for 8. Repeat 3 times. How do you feel after? 🌬️";
    }
    
    // Anxiety responses
    if (lower.includes("anxious") || lower.includes("anxiety") || lower.includes("fear") || lower.includes("scared")) {
      return "Anxiety often lives in the future. Bring yourself back to this moment. Feel your feet on the floor. Take one slow breath. You are here, and you are okay. 🌸";
    }
    
    // Meditation responses
    if (lower.includes("meditat") || lower.includes("mindful") || lower.includes("focus")) {
      return "Meditation begins with one breath. Sit comfortably, close your eyes, and simply observe your breath without changing it. Start with just 5 minutes. 🧘‍♀️";
    }
    
    // Sleep responses
    if (lower.includes("sleep") || lower.includes("insomnia") || lower.includes("can't sleep")) {
      return "For better sleep, try yoga nidra — lie down, close your eyes, and slowly scan your body from toes to crown, releasing tension at each point. 🌙";
    }
    
    // Sadness responses
    if (lower.includes("sad") || lower.includes("sadness") || lower.includes("grief") || lower.includes("lonely")) {
      return "Sadness is a visitor, not a resident. Allow yourself to feel without judgment. What would comfort you right now? A warm drink? A gentle walk? 💙";
    }
    
    // Question responses
    if (trimmed.includes("?") || lower.includes("how") || lower.includes("what") || lower.includes("why")) {
      return "That's a thoughtful question. Let's explore this together. What aspects would you like to understand better? 🌿";
    }
    
    // Feeling/emotion responses
    if (lower.includes("feel") || lower.includes("feeling") || lower.includes("emotion")) {
      return "Feelings are our inner guidance system. What emotion are you noticing right now? There's no judgment here — only presence. 💙";
    }
    
    // Help responses
    if (lower.includes("help") || lower.includes("help me") || lower.includes("support")) {
      return "I'm here to support you. What would be most helpful right now: breathing exercises, meditation guidance, or just someone to listen? 🌿";
    }
    
    // Default responses
    const defaults = [
      "That's a meaningful reflection. Can you tell me more about what you're experiencing? I'm here to listen and guide. 🙏",
      "I hear you. Sometimes the most powerful thing we can do is simply pause and breathe. What does your body feel right now? 🌿",
      "Every feeling is valid. Let's explore this together — what would feel most supportive for you right now? 💙",
      "Thank you for sharing that with me. Your awareness is the first step toward healing. What would you like to explore next? 🕉️"
    ];
    
    return defaults[Math.floor(Math.random() * defaults.length)];
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

    // Try backend first, fallback to frontend AI
    try {
      const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: sentMessage }),
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
    } catch {
      // Use frontend AI response system
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
    <div className="flex h-screen overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        {/* Floating Animation Elements */}
        <motion.div 
          className="absolute top-20 left-20 w-32 h-32 bg-emerald-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-40 h-40 bg-teal-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-36 h-36 bg-cyan-200/15 rounded-full blur-3xl"
          animate={{
            x: [0, 25, -25, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 flex h-full w-full text-[#1A2E2A]">
      {/* ChatGPT Style Sidebar - Minimal & Refined */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full flex flex-col border-r border-white/5 relative z-30 shadow-2xl pt-20"
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
                <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 transition-all group">
                  <User className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="text-sm font-medium">Personal Profile</span>
                </button>
                <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 transition-all group">
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
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
          
          {/* Animated Aura Elements */}
          <motion.div 
            className="absolute w-64 h-64 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl"
            animate={{ 
              x: [0, 120, -60, 0], 
              y: [0, -80, 100, 0],
              scale: [1, 1.3, 0.8, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute w-48 h-48 bg-gradient-to-r from-cyan-200/25 to-blue-200/25 rounded-full blur-3xl"
            animate={{ 
              x: [0, -80, 60, 0], 
              y: [0, 60, -40, 0],
              scale: [1, 0.8, 1.2, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
        </div>
        
        {/* Chat Content */}
        <div className="relative z-10 flex-1 flex flex-col">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-1.5 hover:bg-gray-100 rounded-md text-gray-400 transition-colors"
          title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${!isSidebarOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Top Header - Simple */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-gray-50 bg-white/80 backdrop-blur-sm sticky top-0 z-20 relative">
          <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded-md bg-[#2D6A4F] flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-white" />
             </div>
             <h1 className="text-sm font-bold tracking-[0.2em] text-[#1A2E2A]">NIRVAHA</h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
             <User className="w-4 h-4 text-gray-400" />
          </div>
        </header>

        {/* Chat / Empty State Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center relative z-10">
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
                    text={["How are you feeling today?"]}
                    typingSpeed={80}
                    pauseDuration={3000}
                    showCursor
                    cursorCharacter="_"
                    loop={true}
                  />
                </h2>
                <div className="text-[#2D6A4F] font-semibold text-lg animate-pulse tracking-widest uppercase" style={{ fontSize: '13px' }}>
                  🌿 Start your reflection...
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
              >
                {[
                  { label: "🧘 Grounding Exercise", prompt: "I'm feeling a bit overwhelmed. Can you lead me through a quick grounding exercise?", desc: "Reset your nervous system" },
                  { label: "🌿 Stress Relief", prompt: "I've had a long day. What's a good way to release stress right now?", desc: "Release mental tension" },
                  { label: "✨ Meditation Path", prompt: "I'm new to meditation. Where should I begin my journey today?", desc: "Start your practice" },
                  { label: "💬 Talk to AI Guide", prompt: "I just need someone to talk to. How can we begin?", desc: "Personal reflection" }
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
                      {/* Content */}
                      <div className="flex items-center gap-3">
                        {/* Clean icon without emoji background issues */}
                        <div className="flex-shrink-0 text-lg">
                          {suggestion.label.split(' ')[0]}
                        </div>
                        
                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 group-hover:text-emerald-700 transition-colors truncate">
                            {suggestion.label.replace(/[^\w\s]/g, '').trim()}
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
              <div ref={scrollRef} />
            </div>
          )}
        </div>

        {/* Center Bottom Input Area */}
        <div className="w-full max-w-2xl mx-auto p-4 pb-8 relative z-10">
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
