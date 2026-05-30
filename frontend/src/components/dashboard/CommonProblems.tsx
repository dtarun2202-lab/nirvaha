import { motion, AnimatePresence } from 'motion/react';
import {
    Cloud, Moon, Zap, Activity, Users, Flame, X, Play, Headphones, MessageCircle,
    Calendar, Check, Pause, Send, Volume2, Clock, Heart, Brain, Sun, Star, Shield,
    Coffee, Eye, Frown, AlertTriangle, Droplets, type LucideIcon
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import BACKEND_CONFIG from '../../config/backend';

// Icon name string → Lucide component mapping
const ICON_MAP: Record<string, LucideIcon> = {
    Flame, Zap, Moon, Cloud, Activity, Users, Heart, Brain, Sun, Star, Shield,
    Coffee, Eye, Frown, AlertTriangle, Droplets, Clock, Headphones, MessageCircle, Calendar
};

const resolveIcon = (name: string): LucideIcon => ICON_MAP[name] || Flame;

const getProblemAudioSrc = (title: string) => {
    switch (title) {
        case "Burnout":
            return "/audio/burnout-432hz.mp3";
        case "Stress":
        case "Excess Stress":
            return "/audio/stress-nature.mp3";
        case "Sleep Issues":
            return "/audio/sleep-delta.mp3";
        case "High Anxiety":
            return "/audio/anxiety-crystal-bowl.mp3";
        case "Mood Swings":
            return "/audio/mood-heart-frequency.mp3";
        case "Feeling Isolated":
            return "/audio/isolated-sound-bath.mp3";
        default:
            return "/audio/burnout-432hz.mp3";
    }
};

// Static fallback data (used when API is unreachable)
const STATIC_PROBLEMS = [
    {
        title: "Burnout",
        icon: Flame,
        color: "text-amber-700",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        hoverBg: "hover:bg-amber-50",
        activeBg: "bg-amber-100",
        gradientFrom: "from-amber-500",
        gradientTo: "to-orange-400",
        accentColor: "#D4A574",
        accentLight: "#F9F3E8",
        modalGradient: "from-amber-400 to-orange-400",
        image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=600&h=400&fit=crop&q=80",
        description: "Feeling exhausted and overwhelmed from work or life demands?",
        solutions: ["Practice daily meditation", "Set healthy boundaries", "Take regular breaks", "Engage in sound healing"],
        recommendations: [
            { icon: Clock, text: "Burnout Rest Session" },
            { icon: Headphones, text: "Energy Reset Frequency" },
            { icon: MessageCircle, text: "Talk to Recovery Coach" },
            { icon: Calendar, text: "Book Rest Session" }
        ]
    },
    {
        title: "Stress",
        icon: Zap,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        hoverBg: "hover:bg-green-50",
        activeBg: "bg-green-100",
        gradientFrom: "from-green-500",
        gradientTo: "to-emerald-400",
        accentColor: "#A8C99F",
        accentLight: "#F0F5ED",
        modalGradient: "from-green-400 to-emerald-400",
        image: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=600&h=400&fit=crop&q=80",
        description: "Chronic stress can impact your health and productivity.",
        solutions: ["Breathing exercises", "Mindfulness practices", "Regular physical activity", "Connect with AI companion"],
        recommendations: [
            { icon: Clock, text: "Stress Relief Session" },
            { icon: Headphones, text: "Calming Nature Sounds" },
            { icon: MessageCircle, text: "Stress Management Tips" },
            { icon: Calendar, text: "Book Stress Session" }
        ]
    },
    {
        title: "Sleep Issues",
        icon: Moon,
        color: "text-slate-700",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-300",
        hoverBg: "hover:bg-slate-50",
        activeBg: "bg-slate-200",
        gradientFrom: "from-slate-600",
        gradientTo: "to-blue-700",
        accentColor: "#9FA8BA",
        accentLight: "#F2F5FA",
        modalGradient: "from-slate-700 to-blue-900",
        image: "https://images.unsplash.com/photo-1518281361980-b26bfd556770?w=600&h=400&fit=crop&q=80",
        description: "Quality sleep is essential for recovery and mental clarity.",
        solutions: ["Sleep meditation tracks", "Calming frequencies", "Evening routines", "Binaural beats"],
        recommendations: [
            { icon: Clock, text: "Deep Sleep Session" },
            { icon: Headphones, text: "Delta Wave Frequency" },
            { icon: MessageCircle, text: "Sleep Coach Chat" },
            { icon: Calendar, text: "Book Sleep Session" }
        ]
    },
    {
        title: "High Anxiety",
        icon: Cloud,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        hoverBg: "hover:bg-purple-50",
        activeBg: "bg-purple-100",
        gradientFrom: "from-purple-400",
        gradientTo: "to-indigo-500",
        accentColor: "#D8C5E5",
        accentLight: "#F7F3FC",
        modalGradient: "from-purple-400 to-indigo-500",
        image: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=600&h=400&fit=crop&q=80",
        description: "Anxiety can feel overwhelming, but you can find peace.",
        solutions: ["Guided anxiety relief", "Grounding techniques", "Crystal bowl therapy", "Community support"],
        recommendations: [
            { icon: Clock, text: "Anxiety Relief Session" },
            { icon: Headphones, text: "Grounding Frequency" },
            { icon: MessageCircle, text: "Talk to Anxiety Coach" },
            { icon: Calendar, text: "Book Grounding Session" }
        ]
    },
    {
        title: "Mood Swings",
        icon: Activity,
        color: "text-rose-500",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-200",
        hoverBg: "hover:bg-rose-50",
        activeBg: "bg-rose-100",
        gradientFrom: "from-rose-400",
        gradientTo: "to-pink-400",
        accentColor: "#E5B8A8",
        accentLight: "#FAF0ED",
        modalGradient: "from-rose-400 to-pink-400",
        image: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600&h=400&fit=crop&q=80",
        description: "Emotional fluctuations affect your daily life.",
        solutions: ["Chakra balancing", "Emotional regulation", "Journaling exercises", "Companion sessions"],
        recommendations: [
            { icon: Clock, text: "Mood Stabilization Session" },
            { icon: Headphones, text: "Heart Balance Frequency" },
            { icon: MessageCircle, text: "Emotional Regulation Tips" },
            { icon: Calendar, text: "Book Emotion Session" }
        ]
    },
    {
        title: "Feeling Isolated",
        icon: Users,
        color: "text-cyan-600",
        bgColor: "bg-cyan-50",
        borderColor: "border-cyan-200",
        hoverBg: "hover:bg-cyan-50",
        activeBg: "bg-cyan-100",
        gradientFrom: "from-cyan-400",
        gradientTo: "to-teal-500",
        accentColor: "#A8D4E0",
        accentLight: "#F0F8FB",
        modalGradient: "from-cyan-400 to-teal-500",
        image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&h=400&fit=crop&q=80",
        description: "Connection is a fundamental human need.",
        solutions: ["Join community groups", "Attend live sessions", "Connect with companions", "Group retreats"],
        recommendations: [
            { icon: Clock, text: "Connection Session" },
            { icon: Headphones, text: "Connection Healing Frequency" },
            { icon: MessageCircle, text: "Join Companion Chat" },
            { icon: Calendar, text: "Book Group Session" }
        ]
    },
];

export const CommonProblems = () => {
    const [modalProblem, setModalProblem] = useState<any | null>(null);
    const [activeActionModal, setActiveActionModal] = useState<string | null>(null);
    const problemAudioRef = useRef<HTMLAudioElement | null>(null);
    const [problems, setProblems] = useState<any[]>(STATIC_PROBLEMS);

    // Fetch dynamic problems from the API
    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/common-problems`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.problems?.length > 0) {
                        // Map DB data to component-compatible format
                        const mapped = data.problems.map((p: any) => ({
                            ...p,
                            icon: resolveIcon(p.icon),
                            recommendations: (p.recommendations || []).map((rec: any) => ({
                                ...rec,
                                icon: resolveIcon(rec.icon)
                            }))
                        }));
                        setProblems(mapped);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch common problems:", err);
                // Falls back to STATIC_PROBLEMS already in state
            }
        };
        fetchProblems();
    }, []);

    const handleProblemClick = (problem: any) => {
        // Stop any previous audio
        if (problemAudioRef.current) {
            problemAudioRef.current.pause();
            problemAudioRef.current.src = '';
            problemAudioRef.current = null;
        }
        // Don't auto-play - only set the modal
        setModalProblem(problem);
    };

    useEffect(() => {
        return () => {
            if (problemAudioRef.current) {
                problemAudioRef.current.pause();
                problemAudioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!modalProblem && problemAudioRef.current) {
            problemAudioRef.current.pause();
            problemAudioRef.current = null;
        }
    }, [modalProblem]);

    return (
       <section className="min-h-screen flex flex-col justify-center py-8 bg-[#EEF7F1] relative">
            <div className="w-full px-6 md:px-12 lg:px-20">
                <div className="text-center mb-8">
                    <motion.h2
                        className="text-2xl md:text-4xl font-bold text-[#0F131A] mb-2 tracking-wide"
                        style={{ fontFamily: "'Cinzel', serif" }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Most Common Problems
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {problems.map((p, idx) => (
                       <motion.div
                         key={idx}
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         transition={{ delay: idx * 0.1 }}
                         whileHover={{ scale: 1.02, y: -4 }}
                         whileTap={{ scale: 0.98 }}
                         onClick={() => handleProblemClick(p)}
                         className="group rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden bg-white hover:shadow-xl"
                         style={{
                            borderColor: '#E5E7EB'
                         }}
                         onMouseEnter={(e) => {
                            const elem = e.currentTarget as HTMLElement;
                            elem.style.borderColor = p.accentColor;
                            elem.style.boxShadow = `0 12px 24px ${p.accentColor}0A, 0 0 20px ${p.accentColor}08`;
                            const titleSpan = elem.querySelector('.problem-title') as HTMLElement;
                            if (titleSpan) titleSpan.style.color = p.accentColor;
                         }}
                         onMouseLeave={(e) => {
                            const elem = e.currentTarget as HTMLElement;
                            elem.style.borderColor = '#E5E7EB';
                            elem.style.boxShadow = 'none';
                            const titleSpan = elem.querySelector('.problem-title') as HTMLElement;
                            if (titleSpan) titleSpan.style.color = '';
                         }}
                        >
                         <img
                           src={p.image}
                           alt={p.title}
                           className="w-full h-40 object-cover"
                         />

                        <div className="flex items-center justify-center p-4 w-full">
                            <span className="problem-title text-lg font-semibold text-gray-900 transition-colors duration-300 text-center w-full block">
                              {p.title}
                            </span>
                        </div>
                     </motion.div>
                    ))}
                </div>
              </div>

            {/* Compact Rectangular Modal */}
            <AnimatePresence>
                {modalProblem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setModalProblem(null)}
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                            onClick={(e) => e.stopPropagation()}
                           className="relative bg-white rounded-2xl w-full max-w-[650px] max-h-[90vh] shadow-2xl flex flex-col overflow-hidden mx-auto"
                        >
                            {/* Header with gradient bar */}
                            <div className="h-3 min-h-[12px] w-full shrink-0" style={{
                                background: `linear-gradient(to right, ${modalProblem.accentColor}, ${modalProblem.accentColor}40)`,
                                boxShadow: `0 0 20px ${modalProblem.accentColor}10`
                            }} />

                            {/* X Close Button */}
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setModalProblem(null); }}
                                className="absolute top-5 right-5 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors z-[60] cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Title Section - fixed at top */}
                            <div className="px-6 pt-6 pb-2 shrink-0">
                                <h3
                                   className="text-2xl font-bold text-[#0F131A] tracking-wide"
                                   style={{ fontFamily: "'Cinzel', serif" }}
                                >
                                    {modalProblem.title}
                               </h3>
                                <p
                                  className="text-sm text-[#5f6f65] mt-1 leading-relaxed"
                                  style={{ fontFamily: "'Poppins', sans-serif" }}
                               >
                                  {modalProblem.description}
                               </p>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                {/* Solutions */}
                                <div className="mb-6">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                        How We Help
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {modalProblem.solutions.map((solution: string, sIdx: number) => (
                                            <div key={sIdx} className="flex items-center gap-2">
                                                <Check className="w-5 h-5" style={{ color: modalProblem.accentColor }} />
                                                <span className="text-sm text-gray-700 font-semibold">{solution}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recommendations Grid */}
                                <div className="mb-6">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                        Quick Actions
                                    </p>
                                    <div className="flex justify-center gap-6">
                                        {modalProblem.recommendations.map((rec: any, rIdx: number) => (
                                            <button
                                                key={rIdx}
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); setActiveActionModal(rec.text); }}
                                                className="w-28 h-28 flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
                                                style={{
                                                    backgroundColor: modalProblem.accentLight,
                                                    border: `1px solid ${modalProblem.accentColor}20`,
                                                    boxShadow: `0 0 12px ${modalProblem.accentColor}08`
                                                }}
                                            >
                                                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                                                    background: `linear-gradient(135deg, ${modalProblem.accentColor}, ${modalProblem.accentColor}80)`,
                                                    boxShadow: `0 0 15px ${modalProblem.accentColor}15`
                                                }}>
                                                    <rec.icon className="w-6 h-6 text-white" />
                                                </div>
                                                <span className="text-xs font-medium text-gray-700 text-center line-clamp-2">{rec.text}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* NEW DROPDOWN BOXES */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2" style={{
                                        borderBottomColor: `${modalProblem.accentColor}40`,
                                        borderBottomWidth: '2px'
                                    }}>
                                        Why the mind keeps repeating
                                  </h3>

                                  <div className="space-y-3">

                                    <details className="rounded-md bg-white px-4 py-3 transition-all" style={{
                                        borderWidth: '1px',
                                        borderColor: `${modalProblem.accentColor}20`
                                    }}>
                                        <summary className="cursor-pointer font-bold text-gray-800" style={{
                                            color: modalProblem.accentColor
                                        }}>
                                            The mind seeks closure
                                      </summary>
                                      <p className="mt-2 text-sm text-gray-700 font-semibold">
                                          Unfinished thoughts replay because the brain wants resolution.
                                      </p>
                                  </details>

                                  <details className="rounded-md bg-white px-4 py-3 transition-all" style={{
                                        borderWidth: '1px',
                                        borderColor: `${modalProblem.accentColor}20`
                                    }}>
                                      <summary className="cursor-pointer font-bold text-gray-800" style={{
                                            color: modalProblem.accentColor
                                        }}>
                                          Fear keeps loops alive
                                      </summary>
                                      <p className="mt-2 text-sm text-gray-700 font-semibold">
                                          Stress and fear keep repetitive thinking active.
                                      </p>
                                  </details>

                                  <details className="rounded-md bg-white px-4 py-3 transition-all" style={{
                                        borderWidth: '1px',
                                        borderColor: `${modalProblem.accentColor}20`
                                    }}>
                                      <summary className="cursor-pointer font-bold text-gray-800" style={{
                                            color: modalProblem.accentColor
                                        }}>
                                        Thinking vs Looping
                                      </summary>
                                      <p className="mt-2 text-sm text-gray-700 font-semibold">
                                          Thinking solves problems. Looping repeats without progress.
                                       </p>
                                  </details>

                                </div>
                            </div>
                            </div>

                            {/* Action Button - fixed at bottom, outside scrollable area */}
                            <div className="shrink-0 bg-white px-6 pt-4 pb-4 flex justify-center border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setModalProblem(null); }}
                                    className="px-12 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick Action Mini Modal Overlay */}
            <AnimatePresence>
                {activeActionModal && modalProblem && (
                    <ActionMiniModal 
                        actionName={activeActionModal} 
                        problemTitle={modalProblem.title}
                        onClose={() => setActiveActionModal(null)} 
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

const ActionMiniModal = ({ actionName, problemTitle, onClose }: { actionName: string, problemTitle: string, onClose: () => void }) => {
    // Mutually exclusive action type — priority: chat > booking > healing > meditation
    const getActionType = (): 'chat' | 'booking' | 'healing' | 'meditation' => {
        if (actionName.includes('Book')) return 'booking';
        if (actionName.includes('Rest Session') || actionName.includes('Relief Session') || actionName.includes('Sleep Session') || actionName.includes('Stabilization Session') || actionName.includes('Connection Session')) {
            return 'meditation';
        }
        if (actionName.includes('AI') || actionName.includes('Chat') || actionName.includes('Tips') || actionName.includes('Coach') || actionName.includes('Companion') || actionName.includes('Talk to') || actionName.includes('Join')) return 'chat';
        if (actionName.includes('Audio') || actionName.includes('Healing') || actionName.includes('Frequenc') || actionName.includes('Music') || actionName.includes('Sound') || actionName.includes('Bowl') || actionName.includes('Bath') || actionName.includes('Therapy')) return 'healing';
        if (actionName.includes('Meditation') || actionName.includes('Breathwork') || actionName.includes('Grounding') || actionName.includes('Exercise')) return 'meditation';
        return 'healing'; // safe fallback
    };
    const actionType = getActionType();
    
    const getAudioSrc = (title: string) => {
        switch(title) {
            case "Burnout": return "/audio/burnout-432hz.mp3";
            case "Stress":
            case "Excess Stress": return "/audio/stress-nature.mp3";
            case "Sleep Issues": return "/audio/sleep-delta.mp3";
            case "High Anxiety": return "/audio/anxiety-crystal-bowl.mp3";
            case "Mood Swings": return "/audio/mood-heart-frequency.mp3";
            case "Feeling Isolated": return "/audio/isolated-sound-bath.mp3";
            default: return "/audio/meditation/Indoor-Calm-Meditation.mp3";
        }
    };
    
    const audioSrc = getAudioSrc(problemTitle);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [chatMsg, setChatMsg] = useState('');

    useEffect(() => {
        if (actionType === 'healing') {
            setIsPlaying(true);
        }
    }, [actionType]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#0F131A]/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-[0_0_30px_rgba(26,93,71,0.15)] flex flex-col"
            >
                {actionType === 'meditation' && <MeditationVariant onClose={onClose} actionName={actionName} />}
                {actionType === 'healing' && <HealingVariant onClose={onClose} actionName={actionName} audioSrc={audioSrc} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />}
                {actionType === 'chat' && <ChatVariant onClose={onClose} chatMsg={chatMsg} setChatMsg={setChatMsg} actionName={actionName} problemTitle={problemTitle} />}
                {actionType === 'booking' && <BookingVariant onClose={onClose} actionName={actionName} problemTitle={problemTitle} />}
            </motion.div>
        </motion.div>
    )
}

const MeditationVariant = ({ onClose, actionName }: { onClose: () => void, actionName: string }) => {
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300);
    const { user, refreshProfile } = useAuth();
    const [hasLogged, setHasLogged] = useState(false);

    const handleStartSession = async () => {
        if (!hasLogged && user?.id) {
            setHasLogged(true);
            try {
                await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/profile/log-session`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('token')}` },
                    body: JSON.stringify({ userId: user.id, duration: 0, title: actionName, category: "Wellness" })
                });
                refreshProfile();
            } catch (e) {
                console.error(e);
            }
        }
        setIsActive(true);
    };

    const getMeditationDescription = (action: string) => {
        if(action.includes("Sleep")) return "A soothing 5-minute session to quiet the mind and prepare your body for deep, restorative rest.";
        if(action.includes("Anxiety") || action.includes("Grounding")) return "A 5-minute grounding practice to reconnect with the present moment and ease anxious thoughts.";
        if(action.includes("Mood") || action.includes("Stabilization") || action.includes("Chakra")) return "A 5-minute energetic alignment session to balance your emotions and stabilize your mood.";
        if(action.includes("Connection") || action.includes("Loving") || action.includes("Isolated")) return "A 5-minute compassion practice to foster a deep sense of connection and warmth within yourself.";
        if(action.includes("Stress") || action.includes("Breathwork")) return "A 5-minute guided breathwork session to instantly lower cortisol and calm the nervous system.";
        if(action.includes("Burnout") || action.includes("Rest")) return "A gentle 5-minute relaxation breathing exercise to soothe chronic fatigue and restore vitality.";
        return "A 5-minute guided session to instantly lower cortisol and calm the nervous system.";
    };

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        }
        if (timeLeft === 0 && isActive) {
            setIsActive(false);
            if (user?.id) {
                fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/profile/log-session`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('token')}` },
                    body: JSON.stringify({ userId: user.id, duration: 5, title: actionName, category: "Wellness" })
                }).then(res => {
                    if (res.ok) refreshProfile();
                }).catch(console.error);
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, actionName, user?.id, refreshProfile]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <>
            <div className="h-48 w-full relative">
                <img src="/nature.png" className="w-full h-full object-cover" alt="Meditation" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop"; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
                <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-[#1a5d47] hover:bg-white transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>
            <div className="p-6 pt-0 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full border-[3px] border-[#1a5d47]/20 flex items-center justify-center mb-4 relative">
                    <motion.div 
                        animate={isActive ? { scale: [1, 1.4, 1] } : { scale: 1 }} 
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full border-[3px] border-[#1a5d47] opacity-50"
                    />
                    <div className="text-[#1a5d47] font-bold text-xl" style={{ fontFamily: "'Cinzel', serif" }}>
                        {formatTime(timeLeft)}
                    </div>
                </div>
                <h3 className="text-xl font-bold text-[#0F131A] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>{actionName}</h3>
                <p className="text-sm text-[#5f6f65] mb-6">{getMeditationDescription(actionName)}</p>
                
                {!isActive ? (
                    <button onClick={handleStartSession} className="w-full py-3 rounded-xl bg-[#1a5d47] text-white font-semibold text-sm hover:bg-[#134233] transition-colors shadow-lg shadow-[#1a5d47]/30">
                        {timeLeft < 300 ? 'Resume Session' : 'Begin Session'}
                    </button>
                ) : (
                    <div className="flex gap-3 w-full">
                        <button onClick={() => setIsActive(false)} className="flex-1 py-3 rounded-xl bg-emerald-50 text-[#1a5d47] font-semibold text-sm hover:bg-emerald-100 transition-colors">
                            Pause
                        </button>
                        <button onClick={() => { setIsActive(false); setTimeLeft(300); onClose(); }} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50 transition-colors">
                            End Session
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

const HealingVariant = ({ onClose, isPlaying, setIsPlaying, actionName, audioSrc }: { onClose: () => void, isPlaying: boolean, setIsPlaying: any, actionName: string, audioSrc: string }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const { user, refreshProfile } = useAuth();
    const [hasLogged, setHasLogged] = useState(false);

    useEffect(() => {
        if (isPlaying && !hasLogged && user?.id) {
            setHasLogged(true);
            fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/profile/log-sound-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({ userId: user.id, duration: 0, title: actionName, category: "Wellness" })
            }).then(res => {
                if (res.ok) refreshProfile();
            }).catch(console.error);
        }
    }, [isPlaying, hasLogged, user?.id, actionName, refreshProfile]);

    const latestData = useRef({ user, actionName, refreshProfile, setIsPlaying });
    useEffect(() => {
        latestData.current = { user, actionName, refreshProfile, setIsPlaying };
    }, [user, actionName, refreshProfile, setIsPlaying]);

    useEffect(() => {
        const audio = new Audio(audioSrc);
        audioRef.current = audio;
        audio.volume = 1; // Set volume to maximum
        audio.crossOrigin = "anonymous";

        const handleMetadata = () => setDuration(audio.duration || 0);
        const handleTimeUpdate = () => setProgress(audio.currentTime || 0);
        const handleEnded = () => {
            const { user: u, actionName: a, refreshProfile: rp, setIsPlaying: sp } = latestData.current;
            sp(false);
            setProgress(0);
            if (u?.id) {
                fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/profile/log-sound-session`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('token')}` },
                    body: JSON.stringify({ userId: u.id, duration: Math.max(1, Math.round(audio.duration || 0) / 60), title: a, category: "Wellness" })
                }).then(res => {
                    if (res.ok) rp();
                }).catch(console.error);
            }
        };

        audio.addEventListener('loadedmetadata', handleMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        
        return () => {
            audio.removeEventListener('loadedmetadata', handleMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.pause();
            audio.src = "";
        };
    }, [audioSrc]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current?.play().catch(e => console.log(e));
        } else {
            audioRef.current?.pause();
        }
    }, [isPlaying]);

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="p-6 bg-[#EEF7F1]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#1a5d47]" style={{ fontFamily: "'Cinzel', serif" }}>Nirvaha Healing</h3>
                <button onClick={onClose} className="text-[#1a5d47]/60 hover:text-[#1a5d47]">
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-300 flex items-center justify-center mb-6 shadow-xl shadow-emerald-200">
                    <Headphones className="w-10 h-10 text-white" />
                </div>
                
                <p className="text-xs text-[#1a5d47] font-semibold tracking-wider uppercase mb-1">Ambient Session</p>
                <h4 className="text-lg font-bold text-[#0F131A] mb-6 text-center">{actionName}</h4>
                
                {/* Visualizer */}
                <div className="w-full flex items-end justify-center gap-1 h-12 mb-4">
                    {[...Array(20)].map((_, i) => (
                        <motion.div 
                            key={i}
                            animate={isPlaying ? { height: [10, Math.random() * 40 + 10, 10] } : { height: 10 }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                            className="w-1.5 bg-[#1a5d47]/40 rounded-full"
                            style={{ height: '10px' }}
                        />
                    ))}
                </div>

                {/* Progress */}
                <div className="w-full mb-6">
                    <div className="h-1.5 bg-gray-100 rounded-full w-full overflow-hidden mb-2">
                        <div className="h-full bg-[#1a5d47] transition-all duration-300" style={{ width: `${(progress / (duration || 1)) * 100}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                        <span>{formatTime(progress)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <button className="text-gray-400 hover:text-[#1a5d47]"><Volume2 className="w-5 h-5" /></button>
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-14 h-14 rounded-full bg-[#1a5d47] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-[#1a5d47]/30"
                    >
                        {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-1" />}
                    </button>
                    <button onClick={() => { setIsPlaying(false); setProgress(0); if(audioRef.current) audioRef.current.currentTime = 0; }} className="text-gray-400 hover:text-[#1a5d47]"><Clock className="w-5 h-5" /></button>
                </div>
            </div>
        </div>
    );
};

const ChatVariant = ({ onClose, chatMsg, setChatMsg, actionName, problemTitle }: { onClose: () => void, chatMsg: string, setChatMsg: any, actionName: string, problemTitle: string }) => {
    const { user } = useAuth();
    
    const getInitialMessage = (problem: string) => {
        switch (problem) {
            case "Burnout":
                return "I understand you're feeling burned out and exhausted. Let's talk about it. How are you holding up, and what is draining your energy the most today?";
            case "Stress":
                return "I notice you've been feeling overwhelmed by stress. Let's work through this together. What's weighing on your mind the most right now?";
            case "Sleep Issues":
                return "Struggling to rest? Quality sleep is so important for recovery. Let's review some gentle sleep hygiene tips. What's keeping you up at night?";
            case "High Anxiety":
                return "I'm here for you. Take a slow, deep breath with me. Anxiety can feel overwhelming, but you're safe in this moment. What is making you feel anxious right now?";
            case "Mood Swings":
                return "Emotional fluctuations can be exhausting. Tracking your emotions is a great first step. How are you feeling in your body right now?";
            case "Feeling Isolated":
                return "Welcome to your sanctuary space. You are not alone — connection is a fundamental human need. I'm here to support your journey. How are you feeling right now?";
            default:
                return "I'm here to support you on your wellness journey. How can I help you feel better today?";
        }
    };

    const [messages, setMessages] = useState([{ text: getInitialMessage(problemTitle), isAi: true }]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!chatMsg.trim()) return;
        const userText = chatMsg;
        setMessages(prev => [...prev, { text: userText, isAi: false }]);
        setChatMsg('');
        setIsTyping(true);

        try {
            const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/reflect`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userText, userId: user?.id, problemContext: problemTitle }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.reply) {
                    setIsTyping(false);
                    setMessages(prev => [...prev, { text: data.reply, isAi: true }]);
                    return;
                }
            }
            throw new Error("Failed to fetch reflection");
        } catch (error) {
            console.error("Companion Chat Error:", error);
            
            const responses = [
                "I hear you. Take a slow, deep breath. You are safe in this moment.",
                "It's completely okay to feel this way. Let's gently release that tension together.",
                "Thank you for sharing that with me. Grounding yourself for just 60 seconds can shift your energy."
            ];
            
            setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [...prev, { text: responses[Math.floor(Math.random() * responses.length)], isAi: true }]);
            }, 1500);
        }
    };

    return (
        <div className="flex flex-col h-[500px]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-[#0F131A]">{actionName}</h4>
                        <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Nirvaha AI Guide</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
                {messages.map((m, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.isAi ? 'bg-white border border-gray-100 text-[#5f6f65] rounded-tl-none self-start shadow-sm' : 'bg-[#1a5d47] text-white rounded-tr-none self-end shadow-md'}`}
                    >
                        {m.text}
                    </motion.div>
                ))}
                {isTyping && (
                    <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none self-start shadow-sm flex items-center gap-1 h-10">
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
                <div className="relative">
                    <input 
                        type="text" 
                        value={chatMsg}
                        onChange={(e) => setChatMsg(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your feelings..." 
                        className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-[#1a5d47] focus:ring-1 focus:ring-[#1a5d47] transition-all"
                    />
                    <button onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1a5d47] rounded-full flex items-center justify-center text-white hover:bg-[#134233]">
                        <Send className="w-4 h-4 ml-0.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const BookingVariant = ({ onClose, actionName, problemTitle }: { onClose: () => void, actionName: string, problemTitle: string }) => {
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const times = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"];

    const getBookingContent = (problem: string) => {
        switch (problem) {
            case "Burnout":
                return {
                    desc: "A restorative session to rebuild your energy reserves and prevent burnout relapse.",
                    name: "Dr. Sarah Jenkins",
                    title: "Burnout Recovery Specialist",
                    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
                };
            case "Stress":
                return {
                    desc: "Join a guided breathwork session to release physical and mental tension.",
                    name: "David Alura",
                    title: "Wellness Facilitator & Breathwork Guide",
                    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
                };
            case "Sleep Issues":
                return {
                    desc: "Develop a personalized evening routine for deep, restorative rest.",
                    name: "Dr. Elena Rostova",
                    title: "Sleep Recovery Specialist",
                    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop"
                };
            case "High Anxiety":
                return {
                    desc: "A safe, grounded support session to help you navigate anxiety.",
                    name: "Dr. Michael Chen",
                    title: "Grounding & Anxiety Support Mentor",
                    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop"
                };
            case "Mood Swings":
                return {
                    desc: "A reflective, balanced session to navigate emotional fluctuations.",
                    name: "Maya Lin",
                    title: "Emotional Wellness Mentor",
                    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop"
                };
            case "Feeling Isolated":
                return {
                    desc: "An emotionally warm, community-based gathering for shared connection.",
                    name: "James Holden",
                    title: "Community Circle Facilitator",
                    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
                };
            default:
                return {
                    desc: "Connect with a certified wellness mentor.",
                    name: "Dr. Sarah Jenkins",
                    title: "Holistic Therapist",
                    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
                };
        }
    };

    const bookingContent = getBookingContent(problemTitle);
    
    if (isConfirmed) {
        return (
            <div className="p-8 bg-white flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}
                    className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6"
                >
                    <Check className="w-10 h-10 text-[#1a5d47]" />
                </motion.div>
                <h3 className="text-2xl font-bold text-[#0F131A] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>Session Confirmed</h3>
                <p className="text-[#5f6f65] mb-8">Your session with {bookingContent.name} is booked for tomorrow at {selectedTime}. Check your email for the link.</p>
                <button onClick={onClose} className="w-full py-3 rounded-xl bg-[#1a5d47] text-white font-semibold text-sm hover:bg-[#134233] transition-colors shadow-lg shadow-[#1a5d47]/30">
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white h-full">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold text-[#0F131A] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>{actionName}</h3>
                    <p className="text-sm text-[#5f6f65]">{bookingContent.desc}</p>
                </div>
                <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700">
                    <X className="w-4 h-4" />
                </button>
            </div>
            
            <div className="bg-[#EEF7F1] border border-emerald-100 rounded-2xl p-4 flex gap-4 mb-6">
                <img src={bookingContent.image} className="w-16 h-16 rounded-xl object-cover shadow-sm" alt="Mentor" />
                <div>
                    <h4 className="font-semibold text-[#0F131A]">{bookingContent.name}</h4>
                    <p className="text-xs text-[#1a5d47] font-medium mb-1">{bookingContent.title}</p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <Calendar className="w-3 h-3" /> Tomorrow, Oct 24
                    </div>
                </div>
            </div>

            <p className="text-sm font-semibold text-gray-700 mb-3">Available Slots</p>
            <div className="grid grid-cols-3 gap-2 mb-8">
                {times.map(t => (
                    <button 
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`py-2 rounded-lg text-xs font-medium border transition-all ${selectedTime === t ? 'bg-[#1a5d47] text-white border-[#1a5d47] shadow-md shadow-[#1a5d47]/20' : 'bg-white text-gray-600 border-gray-200 hover:border-[#1a5d47] hover:text-[#1a5d47]'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <button 
                disabled={!selectedTime}
                onClick={() => setIsConfirmed(true)}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${selectedTime ? 'bg-[#1a5d47] text-white hover:bg-[#134233] shadow-lg shadow-[#1a5d47]/30' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
                Confirm Booking
            </button>
        </div>
    );
};
