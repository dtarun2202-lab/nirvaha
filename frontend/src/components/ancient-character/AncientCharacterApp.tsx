import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, RotateCcw, ChevronRight, Sparkles } from 'lucide-react';
import { QUIZ_QUESTIONS, QuizOption } from './AncientCharacterData';
import { calculateResult, generateDownloadCardSVG, QuizResult } from './AncientCharacterEngine';

type ScreenState = 'welcome' | 'question' | 'result';

const CollectibleCard = ({ result, accentColor }: { result: QuizResult, accentColor: string }) => {
    const { primaryMatch, matchPercentage } = result;
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
    const [isFlipped, setIsFlipped] = useState(false);
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isFlipped) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePos({ x, y });
    };
    
    const handleMouseLeave = () => {
        if (isFlipped) return;
        setMousePos({ x: 0.5, y: 0.5 });
    };

    const handleClick = () => {
        setIsFlipped(!isFlipped);
    };

    // Calculate rotation: max 8 degrees
    const tiltY = (mousePos.x - 0.5) * 16; 
    const tiltX = (0.5 - mousePos.y) * 16;
    
    const currentRotateY = isFlipped ? 180 : tiltY;
    const currentRotateX = isFlipped ? 0 : tiltX;

    return (
        <motion.div 
            className="w-[340px] h-[480px] relative cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            style={{
                perspective: '1000px',
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
        >
            <motion.div
                className="w-full h-full relative"
                animate={{
                    rotateX: currentRotateX,
                    rotateY: currentRotateY
                }}
                transition={{ 
                    type: 'spring', 
                    stiffness: isFlipped ? 100 : 300, 
                    damping: isFlipped ? 15 : 20 
                }}
                style={{
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* FRONT FACE */}
                <div 
                    className="absolute inset-0 w-full h-full rounded-[20px] flex flex-col justify-between p-6 overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, #1A0F00 0%, ${accentColor}33 50%, #0A0A0F 100%)`,
                        border: `1px solid ${accentColor}66`,
                        boxShadow: `0 0 40px ${accentColor}33, 0 40px 80px rgba(0,0,0,0.6)`,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                    }}
                >
                    {/* Sheen Effect */}
                    <motion.div 
                        className="absolute inset-0 z-0 pointer-events-none"
                        style={{
                            background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.3) 50%, transparent 80%)',
                            backgroundSize: '200% 200%'
                        }}
                        animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 6, ease: "linear" }}
                    />

                    {/* Top: Emblem */}
                    <div className="relative z-10 flex justify-center mt-4">
                        <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center border-2"
                             style={{ 
                                 background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
                                 borderColor: `${accentColor}80` 
                             }}>
                            <span className="text-4xl text-white font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                                {primaryMatch.name.charAt(0)}
                            </span>
                        </div>
                    </div>

                    {/* Middle: Details */}
                    <div className="relative z-10 text-center flex flex-col items-center">
                        <span className="text-[10px] text-gray-400 tracking-[2px] uppercase mb-2 font-bold">Check Your Ancient Character</span>
                        <h2 className="text-[32px] font-bold leading-none mb-2" style={{ color: accentColor, fontFamily: "'Cinzel', serif" }}>
                            {primaryMatch.name}
                        </h2>
                        <span className="text-[14px] text-white italic mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
                            {primaryMatch.label}
                        </span>
                        <div className="px-3 py-1 rounded-full border text-[11px] font-bold"
                             style={{ borderColor: accentColor, backgroundColor: `${accentColor}15`, color: accentColor }}>
                            {matchPercentage}% Resonance
                        </div>
                    </div>

                    {/* Bottom: Qualities & Footer */}
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="flex gap-2 mb-6">
                            {primaryMatch.qualities.slice(0, 3).map(q => (
                                <span key={q} className="text-[9px] px-2 py-1 rounded-full border uppercase font-bold"
                                      style={{ borderColor: `${accentColor}40`, backgroundColor: `${accentColor}15`, color: accentColor }}>
                                    {q}
                                </span>
                            ))}
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] text-gray-300 uppercase tracking-widest mb-1 font-bold">Certificate of Character Match</div>
                            <div className="text-[8px] text-gray-500 font-bold tracking-widest">
                                {new Date().toLocaleDateString()} • ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* BACK FACE */}
                <div 
                    className="absolute inset-0 w-full h-full rounded-[20px] overflow-hidden flex flex-col items-center justify-center"
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        border: `1px solid ${accentColor}66`,
                        boxShadow: `0 0 40px ${accentColor}33`,
                        background: '#0A0A0F'
                    }}
                >
                    {primaryMatch.image ? (
                        <img 
                            src={primaryMatch.image} 
                            alt={primaryMatch.name} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center border-2 mb-6"
                                 style={{ 
                                     background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
                                     borderColor: `${accentColor}80` 
                                 }}>
                                <span className="text-6xl text-white font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                                    {primaryMatch.name.charAt(0)}
                                </span>
                            </div>
                            <h2 className="text-[28px] font-bold" style={{ color: accentColor, fontFamily: "'Cinzel', serif" }}>
                                {primaryMatch.name}
                            </h2>
                            <p className="text-[#C4CDD6] text-sm mt-2">{primaryMatch.label}</p>
                        </div>
                    )}
                    
                    {primaryMatch.image && (
                        <>
                            <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to top, #0A0A0F 0%, transparent 40%)` }} />
                            <div className="absolute bottom-6 w-full text-center z-10 pointer-events-none">
                                <span className="text-[13px] font-bold uppercase tracking-[4px] text-white shadow-md">
                                    {primaryMatch.name}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export const AncientCharacterApp = () => {
    const [currentScreen, setCurrentScreen] = useState<ScreenState>('welcome');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<QuizOption[]>([]);
    const [result, setResult] = useState<QuizResult | null>(null);

    const handleStart = () => {
        setCurrentScreen('question');
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setResult(null);
    };

    const handleAnswerSelect = (option: QuizOption) => {
        const newAnswers = [...selectedAnswers, option];
        setSelectedAnswers(newAnswers);

        if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
            // Small delay to let user see their selection before advancing
            setTimeout(() => {
                setCurrentQuestionIndex(prev => prev + 1);
            }, 400);
        } else {
            // Calculate results
            const calculatedResult = calculateResult(newAnswers);
            setResult(calculatedResult);
            setTimeout(() => {
                setCurrentScreen('result');
            }, 600);
        }
    };

    const handleDownload = () => {
        if (!result) return;
        const dataUrl = generateDownloadCardSVG(result);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `my-ancient-character-${result.primaryMatch.id}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderWelcome = () => (
        <motion.div 
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-[800px] w-full text-center px-4 relative"
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0 pointer-events-none rounded-3xl overflow-hidden">
                <img 
                    src="/human krishna.png" 
                    alt="Ancient Character Background" 
                    className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 mb-8 rounded-full border border-gray-700 flex items-center justify-center bg-gray-900/80 shadow-2xl backdrop-blur-sm">
                    <div className="w-16 h-16 rounded-full border border-gray-500 flex items-center justify-center opacity-80">
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    </div>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-serif text-gray-100 mb-4 tracking-wide drop-shadow-xl">
                    Check Your<br/>Ancient Character
                </h1>
                
                <p className="text-xl text-gray-300 font-light tracking-widest mb-8 uppercase drop-shadow-md">
                    A Reflective Character Quiz
                </p>
                
                <p className="text-gray-300 max-w-lg mx-auto mb-12 text-lg leading-relaxed drop-shadow-md font-medium">
                    Answer a few questions to discover which ancient character qualities most reflect your present nature.
                </p>

                <button 
                    onClick={handleStart}
                    className="px-10 py-4 bg-gray-100 text-gray-900 rounded-full font-bold text-lg hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                >
                    Start Quiz
                </button>
            </div>
        </motion.div>
    );

    const renderQuestion = () => {
        const question = QUIZ_QUESTIONS[currentQuestionIndex];
        const progress = ((currentQuestionIndex) / QUIZ_QUESTIONS.length) * 100;

        return (
            <motion.div 
                key="question"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-2xl mx-auto py-12 px-4"
            >
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between text-sm text-gray-500 mb-3 tracking-widest uppercase">
                        <span>Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                    </div>
                    <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-gray-400"
                            initial={{ width: `${((currentQuestionIndex) / QUIZ_QUESTIONS.length) * 100}%` }}
                            animate={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-serif text-gray-100 mb-12 leading-tight">
                            {question.text}
                        </h2>

                        <div className="space-y-4">
                            {question.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswerSelect(option)}
                                    className="w-full text-left p-6 rounded-2xl border border-gray-800 bg-gray-900/40 hover:bg-gray-800/60 hover:border-gray-600 transition-all group text-gray-300 hover:text-white"
                                >
                                    <span className="block text-lg leading-relaxed">{option.text}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        );
    };

    const getAccentColor = (name: string, fallback: string) => {
        const map: Record<string, string> = {
            'Rama': '#C8A96E',
            'Krishna': '#6B8CFF',
            'Hanuman': '#FF8C42',
            'Arjuna': '#4CAF7D',
            'Sita': '#E8879C',
            'Karna': '#D4782A'
        };
        return map[name] || fallback;
    };

    const renderResult = () => {
        if (!result) return null;
        
        const { primaryMatch, secondaryMatch, matchPercentage } = result;
        const accentColor = getAccentColor(primaryMatch.name, primaryMatch.colors.primary);

        return (
            <motion.div 
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-[1024px] mx-auto py-[60px] px-[40px] relative z-10 bg-[#0A0A0F]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
            >
                {/* Subtle particle effect abstraction */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#C8A96E 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <div className="flex flex-col lg:flex-row gap-12 mb-16 relative z-10 items-start">
                    
                    {/* LEFT SIDE: Info & Details */}
                    <div className="flex-1 flex flex-col text-center lg:text-left items-center lg:items-start w-full">
                        
                        {/* CHARACTER REVEAL */}
                        <div className="mb-10 w-full">
                            <motion.p 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-[10px] tracking-[4px] uppercase font-bold mb-4" 
                                style={{ color: accentColor }}
                            >
                                Your Character Match
                            </motion.p>
                            <motion.h1 
                                initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.6 }}
                                className="text-[56px] md:text-[64px] font-bold mb-2 leading-none" 
                                style={{ fontFamily: "'Cinzel', serif", color: accentColor, textShadow: `0 0 40px ${accentColor}80` }}
                            >
                                {primaryMatch.name}
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                                className="text-[20px] text-[#C4CDD6] italic mb-6" style={{ fontFamily: "'Cinzel', serif" }}
                            >
                                {primaryMatch.label}
                            </motion.p>
                            
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
                                className="inline-flex items-center justify-center px-6 py-2 rounded-full border-[1.5px]" 
                                style={{ borderColor: accentColor, backgroundColor: `${accentColor}1A` }}
                            >
                                <span className="font-bold text-[13px]" style={{ color: accentColor }}>
                                    {matchPercentage}% Resonance
                                </span>
                            </motion.div>
                        </div>

                        {/* CHARACTER DETAILS */}
                        <div className="flex flex-col gap-6 w-full text-left">
                            <div className="bg-white/5 border border-white/10 rounded-[16px] p-6">
                                <p className="text-[15px] text-[#C4CDD6] leading-[1.8]">
                                    {primaryMatch.description}
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="text-[10px] tracking-[3px] uppercase font-bold mb-4" style={{ color: accentColor }}>
                                    Qualities You Reflect
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {primaryMatch.qualities.map((q, i) => (
                                        <motion.span 
                                            key={q}
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + (i * 0.1) }}
                                            className="px-4 py-1.5 rounded-full border text-[12px] font-semibold transition-colors hover:text-[#0A0A0F] cursor-default"
                                            style={{ 
                                                borderColor: `${accentColor}4D`, 
                                                backgroundColor: `${accentColor}1A`, 
                                                color: accentColor 
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = accentColor}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${accentColor}1A`}
                                        >
                                            {q}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="bg-white/5 border border-white/10 rounded-[16px] p-6 h-fit mt-2">
                                <h3 className="text-[10px] text-[#8892A4] tracking-[3px] uppercase mb-6 font-bold">
                                    Path of Refinement
                                </h3>
                                <ul className="space-y-3">
                                    {primaryMatch.growth.map((g, i) => (
                                        <li key={i} className="flex items-start text-[#E8E8E8] text-[14px] leading-[1.8] border-l-2 pl-[14px]" style={{ borderColor: `${accentColor}4D` }}>
                                            <ChevronRight className="w-4 h-4 mr-2 mt-[4px] shrink-0" style={{ color: accentColor }} />
                                            <span>{g}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Collectible Card Preview */}
                    <div className="flex flex-col items-center shrink-0 w-full lg:w-auto lg:sticky lg:top-8 mt-8 lg:mt-0">
                        <CollectibleCard result={result} accentColor={accentColor} />
                        
                        <div className="mt-6 text-center">
                            <p className="text-[11px] text-[#8892A4] italic mb-1">Your collectible result card</p>
                            <p className="text-[12px] text-gray-400 block sm:hidden">✨ Tap to see full card</p>
                            <p className="text-[12px] text-gray-400 hidden sm:block">↓ Download your card below</p>
                        </div>
                    </div>

                </div>

                {/* SECTION 4 — SECONDARY RESONANCE */}
                <div className="mb-16 relative z-10 max-w-2xl mx-auto">
                    <div className="border-t border-white/10 mb-8 w-1/2 mx-auto" />
                    <div className="bg-white/5 border border-white/10 rounded-[16px] p-[20px_28px] text-center flex flex-col items-center">
                        <h3 className="text-[10px] text-[#8892A4] tracking-[3px] uppercase mb-3 font-bold">
                            Secondary Resonance
                        </h3>
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-[40px] h-[40px] rounded-full border flex items-center justify-center bg-gray-900" style={{ borderColor: getAccentColor(secondaryMatch.name, secondaryMatch.colors.primary) }}>
                                <span className="text-xl text-white" style={{ fontFamily: "'Cinzel', serif" }}>{secondaryMatch.name.charAt(0)}</span>
                            </div>
                            <p className="text-[16px] text-white">
                                You also reflect the qualities of <span className="font-bold" style={{ color: getAccentColor(secondaryMatch.name, secondaryMatch.colors.primary) }}>{secondaryMatch.name}</span>, {secondaryMatch.label.toLowerCase()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* SECTION 5 — DOWNLOAD AREA */}
                <div className="w-[calc(100%+80px)] -ml-[40px] px-[40px] py-[40px] flex flex-col items-center relative z-10" style={{ background: 'linear-gradient(to bottom, transparent, #0D0D14)' }}>
                    <h2 className="text-[20px] text-white mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
                        Your card is ready to collect
                    </h2>
                    <p className="text-[13px] text-[#8892A4] mb-8">
                        Download and keep your character match forever.
                    </p>
                    
                    <motion.button 
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleDownload}
                        className="w-[280px] h-[56px] rounded-[50px] flex items-center justify-center gap-2 text-[#0A0A0F] text-[15px] font-bold mb-3 relative overflow-hidden group"
                        style={{ 
                            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                            boxShadow: `0 8px 32px ${accentColor}66`
                        }}
                    >
                        <motion.div 
                            className="absolute inset-0 z-0 pointer-events-none"
                            style={{
                                background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 50%, transparent 80%)',
                                backgroundSize: '200% 200%'
                            }}
                            animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4, ease: "linear" }}
                        />
                        <Sparkles className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Download Card</span>
                    </motion.button>
                    
                    <p className="text-[11px] text-[#8892A4] mb-8">
                        PNG format • Free to share
                    </p>
                    
                    <button 
                        onClick={handleStart}
                        className="text-[13px] text-[#8892A4] hover:underline flex items-center gap-2 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" /> Retake Quiz
                    </button>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-[800px] w-full bg-[#0a0a0a] rounded-3xl border border-gray-800 overflow-hidden relative shadow-2xl">
            {/* Very subtle ambient background effect */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                background: result ? `radial-gradient(circle at 50% 0%, ${result.primaryMatch.colors.primary}40 0%, transparent 70%)` : 'none'
            }} />
            
            <div className="relative z-10 w-full h-full flex items-center justify-center min-h-[800px]">
                <AnimatePresence mode="wait">
                    {currentScreen === 'welcome' && renderWelcome()}
                    {currentScreen === 'question' && renderQuestion()}
                    {currentScreen === 'result' && renderResult()}
                </AnimatePresence>
            </div>
        </div>
    );
};
