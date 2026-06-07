import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
}

const SYSTEM_PROMPT = `You are Nirvaha AI, a warm, empathetic wellness assistant for the Nirvaha platform. You speak gently, supportively, and with care. You help users understand Nirvaha's services and also provide thoughtful mental health tips.

## ABOUT NIRVAHA
Nirvaha is an AI-powered emotional healing platform that bridges corporate performance and human well-being. It combines ancient spiritual wisdom with modern therapy, meditation, and professional counseling to provide holistic healing for individuals and organizations.

## SERVICES & FEATURES

### 1. Wellness OTT (Audio Streaming)
- Netflix-inspired audio wellness streaming platform
- Categories: Guided Meditation, Sleep Stories, Stress Relief, Emotional Healing, Anxiety Relief
- Features: Cinematic hero banner, series rows, immersive audio player, continue listening, waveform visualizer
- Access at: /wellness-ott

### 2. Companion Mentorship
- Nirvaha Companions are certified wellness experts offering personalized guidance
- Users can browse companion profiles and book 1-on-1 sessions
- Access from the Dashboard → Companions section

### 3. AI Guide
- Available on every page as a floating chat widget
- Answers questions about Nirvaha and provides mental health support
- Available 24/7

### 4. Community Forum
- A safe space for users to share experiences and support each other

### 5. Marketplace Hub
- Curated wellness products: essential oils, grounding crystals, wellness journals

### 6. Guided Meditation & Sound Healing
- Structured guided paths for mindfulness, stress relief, and deep sleep
- Available from the Dashboard once logged in

### 7. Academy / Learning Pathways
- Structured educational content for personal growth

## PRICING
- Pricing depends on organization size and wellness protocols needed
- Contact the sales team via the platform for a customized plan
- Email: support@nirvaha.org

## MENTAL HEALTH TIPS

**Breathing:**
- Box breathing: inhale 4s, hold 4s, exhale 4s, hold 4s — repeat 4 times
- 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s — calms the nervous system

**Grounding (for anxiety):**
- 5-4-3-2-1 technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste

**Sleep:**
- Keep a consistent sleep schedule even on weekends
- Avoid screens 30 minutes before bed
- Try a sleep story from our Wellness OTT

**Stress Relief:**
- Take a 5-minute walk when overwhelmed
- Write down 3 things you are grateful for each day
- Progressive muscle relaxation: tense and release each muscle group

**Emotional Regulation:**
- Name your emotion — just labeling it reduces its intensity
- It is okay to not be okay — feelings are temporary
- Talk to someone you trust, or book a session with a Nirvaha Companion

**Daily Wellness:**
- Stay hydrated — even mild dehydration affects mood
- Sunlight in the morning regulates your circadian rhythm
- Limit news and social media if it causes anxiety

## RESPONSE GUIDELINES
- Keep responses concise (2-4 sentences)
- Be warm, never clinical or robotic
- If someone seems distressed, acknowledge their feelings first before giving tips
- Always mention relevant Nirvaha features when appropriate
- Never diagnose or replace professional help — encourage Companion sessions for deeper support
- If someone is in crisis, gently encourage them to seek professional help`;

const AIChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      text: 'Namaste 🙏 I am Nirvaha AI. How can I help you today? You can ask me about our platform, services, or if you just need a mental health tip.',
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getAIResponse = async (userText: string): Promise<string> => {
    try {
      const response = await fetch('/api/ai-guide/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          systemPrompt: SYSTEM_PROMPT,
        }),
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();
      return data.reply || "I'm having trouble connecting right now. Please try again in a moment.";
    } catch (err) {
      return getFallbackResponse(userText);
    }
  };

  const getFallbackResponse = (userText: string): string => {
    const lower = userText.toLowerCase();

    if (lower.includes('stress') || lower.includes('anxious') || lower.includes('anxiety') || lower.includes('overwhelm')) {
      return "I hear you. When stress hits, try box breathing: inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. Repeat 4 times. You might also find our Stress Relief series on Wellness OTT helpful 💚";
    }
    if (lower.includes('sleep') || lower.includes('insomnia') || lower.includes('tired')) {
      return "Sleep struggles are tough. Try keeping a consistent bedtime, avoid screens 30 minutes before bed, and explore our Sleep Stories on Wellness OTT 🌙";
    }
    if (lower.includes('sad') || lower.includes('depress') || lower.includes('lonely') || lower.includes('empty')) {
      return "I'm sorry you're feeling this way — your feelings are valid. Our Nirvaha Companions are certified wellness experts who offer personalized 1-on-1 support. Would you like to explore that? 💙";
    }
    if (lower.includes('meditat') || lower.includes('calm') || lower.includes('relax')) {
      return "Our Wellness OTT has guided meditation series for all levels. Head to /wellness-ott to explore. For a quick start, try belly breathing — breathe deep into your stomach, hold briefly, and exhale slowly 🧘";
    }
    if (lower.includes('companion') || lower.includes('mentor') || lower.includes('book')) {
      return "Nirvaha Companions are verified wellness experts ready to offer personalized guidance. Browse their profiles and book a session from Dashboard → Companions 🌿";
    }
    if (lower.includes('marketplace') || lower.includes('shop') || lower.includes('product')) {
      return "Our Marketplace has curated wellness products — essential oils, grounding crystals, wellness journals. Explore it from your Dashboard 🛍️";
    }
    if (lower.includes('price') || lower.includes('cost') || lower.includes('plan')) {
      return "Pricing is tailored to your organization's needs. Please contact our team via the Contact section or email support@nirvaha.org for a custom plan.";
    }
    if (lower.includes('what is nirvaha') || lower.includes('about')) {
      return "Nirvaha is an AI-powered emotional healing platform that blends ancient spiritual wisdom with modern therapy and meditation 🌱";
    }
    if (lower.includes('tip') || lower.includes('advice') || lower.includes('help me')) {
      return "Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. It brings you back to the present moment ✨";
    }
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('namaste')) {
      return "Namaste! 🙏 So glad you're here. How can I support you today?";
    }
    if (lower.includes('breath')) {
      return "Try 4-7-8 breathing: inhale for 4 seconds, hold for 7, exhale for 8. This calms anxiety almost immediately 🌬️";
    }

    return "Thank you for sharing that. I'm here to help — whether it's learning about Nirvaha's services or a gentle wellness tip. You can also book a session with one of our Companions for deeper support 💚";
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const responseText = await getAIResponse(userMessage.text);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      text: responseText,
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  const quickPrompts = [
    "I'm feeling stressed",
    "Tell me about Companions",
    "Give me a breathing tip",
    "What is Nirvaha?",
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[540px] max-h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-100"
            style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-700 to-[#1a5d47] p-4 flex items-center justify-between text-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Nirvaha AI</h3>
                  <p className="text-xs text-white/70">Always here for you</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.type === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-emerald-700" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.type === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-end gap-2 justify-start">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-emerald-700" />
                  </div>
                  <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2 bg-white flex-shrink-0">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInputValue(prompt)}
                    className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1.5 hover:bg-emerald-100 transition-colors font-medium"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="w-full bg-gray-100 text-sm text-emerald-700 placeholder-emerald-400 font-medium rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-1.5 p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:bg-emerald-700 transition-colors"
        style={{ filter: 'drop-shadow(0 10px 20px rgba(16,185,129,0.3))' }}
        aria-label="Toggle AI Assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageSquare className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};

export default AIChatbotWidget;
