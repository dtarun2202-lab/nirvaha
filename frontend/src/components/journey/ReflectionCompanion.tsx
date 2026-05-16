import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Heart, Brain, Moon } from 'lucide-react';

interface ReflectionCompanionProps {
    onClose: () => void;
    onComplete: () => void;
}

const ReflectionCompanion: React.FC<ReflectionCompanionProps> = ({ onClose, onComplete }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hello, I'm your reflection companion. How are you feeling after this session?" }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        
        const newMessages = [...messages, { role: 'user', text: input }];
        setMessages(newMessages);
        setInput('');

        // Mock AI response
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                text: "That's a meaningful observation. Noticing your internal state is the first step toward lasting clarity. Would you like to save this reflection to your journey map?" 
            }]);
        }, 1000);
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
                        <h3 className="font-bold text-white">Reflection Companion</h3>
                        <p className="text-[10px] uppercase tracking-widest text-emerald-500/60">AI Guided Awareness</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed ${
                            msg.role === 'user' 
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
                {[
                    { icon: <Heart size={14} />, label: "Grateful" },
                    { icon: <Brain size={14} />, label: "Focused" },
                    { icon: <Moon size={14} />, label: "Calm" }
                ].map((action, i) => (
                    <button key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 hover:bg-white/10 hover:text-white transition-all shrink-0">
                        {action.icon} {action.label}
                    </button>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-8 border-t border-white/5 bg-black/20">
                <div className="relative">
                    <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                        placeholder="Type your reflection..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-14 text-white text-sm focus:outline-none focus:border-emerald-500/50 resize-none h-24 transition-colors"
                    />
                    <button 
                        onClick={handleSend}
                        className="absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-emerald-500 text-black flex items-center justify-center hover:bg-emerald-400 transition-all shadow-lg active:scale-95"
                    >
                        <Send size={18} />
                    </button>
                </div>
                
                <button 
                    onClick={onComplete}
                    className="w-full mt-6 py-4 border border-emerald-500/30 text-emerald-400 rounded-2xl font-bold text-sm hover:bg-emerald-500/10 transition-all"
                >
                    Finish & Log Reflection
                </button>
            </div>
        </motion.div>
    );
};

export default ReflectionCompanion;
