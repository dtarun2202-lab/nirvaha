import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Heart, Brain, Moon } from 'lucide-react';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
}

interface ReflectionCompanionProps {
    onClose: () => void;
    onComplete: () => void;
}

const ReflectionCompanion: React.FC<ReflectionCompanionProps> = ({ onClose, onComplete }) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Welcome to this sacred space of reflection. How does your heart feel in this moment of stillness?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI Response
        setTimeout(() => {
            const aiMsg: Message = { 
                id: Date.now() + 1, 
                text: "That is a powerful observation. Notice how that feeling sits in your body right now. There is no need to change it—simply witness it.", 
                sender: 'ai' 
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 2000);
    };

    return (
        <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 w-full md:w-[450px] h-full bg-[#0a0c0a]/90 backdrop-blur-2xl border-l border-white/10 z-50 flex flex-col"
        >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white tracking-wide">Soul Guide</h3>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-emerald-500/40">Guided Awareness</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Chat Area */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar"
            >
                {messages.map((msg) => (
                    <motion.div 
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed ${
                            msg.sender === 'user' 
                            ? 'bg-emerald-500 text-black font-medium' 
                            : 'bg-white/5 text-white/80 border border-white/10'
                        }`}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="px-8 py-4 flex gap-3 overflow-x-auto no-scrollbar">
                {isTyping && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white/5 p-4 rounded-2xl flex gap-1">
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-8 bg-white/[0.02] border-t border-white/5">
                <div className="relative">
                    <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                        placeholder="Share what's on your heart..."
                        className="w-full bg-white/[0.03] border border-white/[0.05] rounded-3xl p-5 pr-16 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/20 transition-all resize-none min-h-[100px] text-sm"
                    />
                    <button 
                        onClick={handleSend}
                        className="absolute bottom-4 right-4 w-10 h-10 bg-white text-black rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl"
                    >
                        <Send size={18} />
                    </button>
                </div>
                
                <div className="mt-8 flex gap-4">
                    <button 
                        onClick={onComplete}
                        className="flex-1 py-4 bg-emerald-500/5 border border-emerald-500/10 text-emerald-400/80 rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-emerald-500/10 transition-all"
                    >
                        Seal this Moment
                    </button>
                    <button className="flex-1 py-4 bg-white/[0.01] border border-white/[0.03] text-white/20 rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] hover:text-white/40 hover:bg-white/[0.03] transition-all">
                        Remember this
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ReflectionCompanion;
