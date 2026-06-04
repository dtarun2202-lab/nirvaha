import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Download, RotateCcw, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { LIFE_QUIZ_QUESTIONS, SCORING_DIMENSIONS } from './LifeQuizData';
import { calculateLifeScore, generateCertificateSVG, ScoreResult } from './LifeQuizEngine';

type Screen = 'loading' | 'welcome' | 'instructions' | 'question' | 'result';

export const LifeQuizApp = () => {
    const [screen, setScreen] = useState<Screen>('loading');
    const [userName, setUserName] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>(Array(LIFE_QUIZ_QUESTIONS.length).fill(-1));
    const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);

    useEffect(() => {
        if (screen === 'loading') {
            const timer = setTimeout(() => {
                setScreen('welcome');
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [screen]);

    const startAssessment = () => {
        if (!userName.trim()) return;
        setScreen('instructions');
    };

    const beginQuestions = () => {
        setCurrentQuestionIndex(0);
        setAnswers(Array(LIFE_QUIZ_QUESTIONS.length).fill(-1));
        setScreen('question');
    };

    const handleAnswerSelect = (optionIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setAnswers(newAnswers);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < LIFE_QUIZ_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            const result = calculateLifeScore(answers);
            setScoreResult(result);
            setScreen('result');
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const restartAssessment = () => {
        setScreen('welcome');
        setUserName('');
        setAnswers(Array(LIFE_QUIZ_QUESTIONS.length).fill(-1));
        setScoreResult(null);
        setCurrentQuestionIndex(0);
    };

    const handleDownloadCertificate = () => {
        if (!scoreResult) return;
        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const id = 'LQ-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        const svgString = generateCertificateSVG(userName, scoreResult.totalScore, date, id);
        
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Nirvaha_Life_Certificate_${userName.replace(/\s+/g, '_')}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getDimensionLabel = (id: string) => {
        return SCORING_DIMENSIONS.find(d => d.id === id)?.label || id;
    };

    // Screens
    const renderLoading = () => (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center min-h-screen z-50 fixed inset-0 bg-[#0D1B0D]"
        >
            <motion.div
                animate={{ 
                    scale: [1, 1.03, 1],
                    opacity: [0.8, 1, 0.8]
                }}
                transition={{ 
                    duration: 2.5, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                }}
                className="w-full max-w-sm md:max-w-lg px-6 flex justify-center"
            >
                <img 
                    src="/yoga poses/understand-life  logo.jpg" 
                    alt="Loading Understand Life via Quiz..." 
                    className="w-full h-auto object-contain drop-shadow-[0_0_50px_rgba(212,175,55,0.3)]" 
                />
            </motion.div>
        </motion.div>
    );

    const renderWelcome = () => (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="flex flex-col md:flex-row items-center justify-center max-w-5xl mx-auto gap-8 md:gap-16 px-4"
        >
            <div className="flex-1 flex justify-center md:justify-end w-full">
                <img 
                    src="/yoga poses/understand-life  logo.jpg" 
                    alt="Understand Life via Quiz Logo" 
                    className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.2)]" 
                />
            </div>
            
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left w-full">
                {/* Screen reader text since logo contains the text */}
                <h1 className="sr-only">
                    Understand Life via Quiz
                </h1>
                <h2 className="text-xl text-[#D4AF37] mb-6 tracking-wide uppercase font-medium text-sm">
                    A Scenario-Based Life Assessment
                </h2>
                <p className="text-zinc-400 mb-10 leading-relaxed max-w-md">
                    Face realistic life situations, choose your response, and discover how strong your judgment is across six hidden dimensions of character.
                </p>
                
                <div className="w-full max-w-sm space-y-6">
                    <div className="text-left">
                        <label className="block text-zinc-500 text-xs font-bold uppercase mb-2 ml-1">Your Name</label>
                        <input 
                            type="text" 
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Enter your full name for the certificate"
                            className="w-full bg-[#111111] border border-zinc-800 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                        />
                    </div>
                    <button 
                        onClick={startAssessment}
                        disabled={!userName.trim()}
                        className="w-full bg-gradient-to-r from-[#1a3d2b] to-[#112a1d] border border-[#86efac]/30 hover:border-[#86efac] text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(26,61,43,0.4)]"
                    >
                        Start Assessment <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );

    const renderInstructions = () => (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
            className="max-w-2xl mx-auto bg-[#111111] border border-zinc-800 rounded-3xl p-10 md:p-14 shadow-2xl"
        >
            <h2 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: "'Cinzel', serif" }}>Before we begin...</h2>
            
            <ul className="space-y-6 mb-12 text-zinc-300">
                <li className="flex items-start gap-4">
                    <div className="mt-1 w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
                    <p>This is a <strong>scenario-based assessment</strong> containing {LIFE_QUIZ_QUESTIONS.length} situations.</p>
                </li>
                <li className="flex items-start gap-4">
                    <div className="mt-1 w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
                    <p>There are no factual "right" or "wrong" answers. Choose the response that feels most natural or correct to your personal judgment.</p>
                </li>
                <li className="flex items-start gap-4">
                    <div className="mt-1 w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
                    <p>The system calculates a comprehensive <strong>Life Score</strong> out of 100 based on six hidden dimensions.</p>
                </li>
                <li className="flex items-start gap-4">
                    <div className="mt-1 w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
                    <p>A passing score (≥ 75 with no critically weak areas) unlocks an official Certificate of Life Judgment.</p>
                </li>
            </ul>

            <button 
                onClick={beginQuestions}
                className="w-full bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
                I Understand, Begin <ChevronRight className="w-5 h-5" />
            </button>
        </motion.div>
    );

    const renderQuestion = () => {
        const question = LIFE_QUIZ_QUESTIONS[currentQuestionIndex];
        const hasAnswered = answers[currentQuestionIndex] !== -1;
        const progress = ((currentQuestionIndex + 1) / LIFE_QUIZ_QUESTIONS.length) * 100;

        return (
            <motion.div 
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="max-w-3xl mx-auto w-full"
            >
                {/* Progress Bar */}
                <div className="mb-10">
                    <div className="flex justify-between text-zinc-500 text-xs font-bold uppercase mb-3">
                        <span>Question {currentQuestionIndex + 1} of {LIFE_QUIZ_QUESTIONS.length}</span>
                        <span className="text-[#86efac]">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-[#1a3d2b] to-[#86efac] transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="bg-[#111111] border border-zinc-800 rounded-3xl p-8 md:p-12 mb-8 shadow-2xl relative overflow-hidden">
                    {/* Decorative subtle background elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#1a3d2b] opacity-10 blur-[100px] rounded-full pointer-events-none" />
                    
                    <h3 className="text-2xl md:text-3xl text-white font-medium leading-relaxed mb-10 relative z-10" style={{ fontFamily: "'Cinzel', serif" }}>
                        {question.scenario}
                    </h3>

                    <div className="space-y-4 relative z-10">
                        {question.options.map((opt, idx) => {
                            const isSelected = answers[currentQuestionIndex] === idx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswerSelect(idx)}
                                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                                        isSelected 
                                        ? 'bg-[#1a3d2b]/20 border-[#86efac] shadow-[0_0_15px_rgba(134,239,172,0.1)]' 
                                        : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                            isSelected ? 'border-[#86efac]' : 'border-zinc-600'
                                        }`}>
                                            {isSelected && <div className="w-3 h-3 rounded-full bg-[#86efac]" />}
                                        </div>
                                        <span className={`text-lg ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                                            {opt.text}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-between mt-4">
                    <button 
                        onClick={previousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className={`bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-8 py-4 rounded-xl transition-colors flex items-center gap-2 ${currentQuestionIndex === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                    >
                        <ChevronLeft className="w-5 h-5" /> Previous
                    </button>
                    
                    <button 
                        onClick={nextQuestion}
                        disabled={!hasAnswered}
                        className="bg-white hover:bg-zinc-200 text-black font-bold px-10 py-4 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {currentQuestionIndex === LIFE_QUIZ_QUESTIONS.length - 1 ? 'Finish Assessment' : 'Next Scenario'} 
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>
        );
    };

    const getScoreColor = (score: number) => {
        if (score >= 75) return '#00FF9C';
        if (score > 50) return '#FFB347';
        return '#FF4D6D';
    };

    const DIMENSION_META: Record<string, { icon: string, color: string }> = {
        judgment: { icon: '🧠', color: '#7C9EFF' },
        integrity: { icon: '⚖️', color: '#FFD700' },
        emotionalBalance: { icon: '💚', color: '#00FF9C' },
        responsibility: { icon: '🛡️', color: '#60A5FA' },
        compassion: { icon: '❤️', color: '#FB7185' },
        foresight: { icon: '🔭', color: '#B47FFF' }
    };

    const renderResult = () => {
        if (!scoreResult) return null;

        const mainColor = getScoreColor(scoreResult.totalScore);
        const radius = 140;
        const circumference = Math.PI * radius;
        const dashoffset = circumference - (scoreResult.totalScore / 100) * circumference;

        return (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="max-w-[720px] mx-auto w-full bg-[#0A0F0A] py-[60px] px-[40px] text-white flex flex-col items-center rounded-3xl border border-[#1A2A1A]"
            >
                {/* SECTION 1 — HEADER */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.0 }} className="text-center w-full mb-12">
                    <div className="text-[#00FF9C] text-[10px] tracking-[4px] uppercase font-bold mb-4">
                        Understand Life via Quiz
                    </div>
                    <h2 className="text-[32px] font-bold text-white mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                        Assessment Outcome
                    </h2>
                    <p className="text-[14px] text-[#8892A4]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Here is how your judgment was measured.
                    </p>
                </motion.div>

                {/* SECTION 2 — SPEEDOMETER GAUGE */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: 0.3 }}
                    className="relative w-[320px] h-[160px] mb-6 flex flex-col items-center"
                >
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 320 160">
                        {/* Track */}
                        <path 
                            d="M 20 160 A 140 140 0 0 1 300 160" 
                            fill="none" 
                            stroke="#1A2A1A" 
                            strokeWidth="16" 
                            strokeLinecap="round" 
                        />
                        {/* Fill */}
                        <motion.path 
                            d="M 20 160 A 140 140 0 0 1 300 160" 
                            fill="none" 
                            stroke={mainColor} 
                            strokeWidth="16" 
                            strokeLinecap="round" 
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: dashoffset }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                        />
                        
                        {/* Needle */}
                        <motion.g 
                            style={{ transformOrigin: '160px 160px' }}
                            initial={{ rotate: -90 }}
                            animate={{ rotate: -90 + (scoreResult.totalScore / 100) * 180 }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                        >
                            <line x1="160" y1="160" x2="160" y2="40" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="160" cy="160" r="4" fill="white" />
                        </motion.g>
                    </svg>

                    {/* Labels */}
                    <div className="absolute top-[160px] w-full flex justify-between px-2">
                        <span className="text-[11px] text-[#8892A4]">0</span>
                        <span className="text-[11px] text-[#8892A4] mt-[-165px]">50</span>
                        <span className="text-[11px] text-[#8892A4]">100</span>
                    </div>

                    {/* Center Score Display */}
                    <div className="absolute bottom-2 flex flex-col items-center">
                        <motion.div 
                            className="text-[56px] font-bold leading-none mb-1" 
                            style={{ fontFamily: "'Cinzel', serif", color: mainColor }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {scoreResult.totalScore}
                        </motion.div>
                        <div className="text-[11px] text-[#8892A4] tracking-[3px]">LIFE SCORE</div>
                    </div>
                </motion.div>

                {/* PASS/FAIL BADGE */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 1.8 }}
                    className="mb-14"
                >
                    {scoreResult.passed ? (
                        <div className="px-4 py-1.5 rounded-full bg-[#00FF9C15] border border-[#00FF9C] text-[#00FF9C] text-[12px] font-bold">
                            ✓ ASSESSMENT PASSED
                        </div>
                    ) : (
                        <div className="px-4 py-1.5 rounded-full bg-[#FF4D6D15] border border-[#FF4D6D] text-[#FF4D6D] text-[12px] font-bold">
                            KEEP GROWING
                        </div>
                    )}
                </motion.div>

                {/* SECTION 3 — 6 DIMENSION BARS */}
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 2.0 }}
                    className="w-full mb-12"
                >
                    <div className="text-[13px] text-[#8892A4] uppercase tracking-[2px] mb-[20px] font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Dimension Breakdown
                    </div>
                    
                    <div className="flex flex-col gap-[18px]">
                        {Object.entries(scoreResult.dimensions).sort((a,b) => b[1] - a[1]).map(([dimId, score], idx) => {
                            const meta = DIMENSION_META[dimId];
                            const label = getDimensionLabel(dimId);
                            // Top 2: green, Middle 2: amber, Bottom 2: red
                            let barColor = '#00FF9C';
                            if (idx >= 2 && idx <= 3) barColor = '#FFB347';
                            if (idx >= 4) barColor = '#FF4D6D';

                            return (
                                <div key={dimId} className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3 w-40 shrink-0">
                                        <div className="w-5 h-5 flex items-center justify-center rounded-full text-xs" style={{ backgroundColor: `${meta.color}20` }}>
                                            {meta.icon}
                                        </div>
                                        <span className="text-[14px] text-white font-semibold">{label}</span>
                                    </div>

                                    <div className="flex-1 mx-4 relative h-[6px] bg-[#1A2A1A] rounded-[50px] overflow-hidden">
                                        <motion.div 
                                            className="absolute top-0 left-0 h-full rounded-[50px]"
                                            style={{ backgroundColor: barColor }}
                                            initial={{ width: '0%' }}
                                            animate={{ width: `${score}%` }}
                                            transition={{ duration: 1.2, ease: "easeOut", delay: 2.0 + (idx * 0.1) }}
                                        />
                                    </div>

                                    <div className="text-[13px] text-[#8892A4] w-12 text-right shrink-0">
                                        {score}/100
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* SECTION 4 — STRONGEST & WEAKEST */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 2.5 }}
                    className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
                >
                    <div className="bg-[#00FF9C05] border border-[#00FF9C26] rounded-[16px] p-[20px]">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-[10px] text-[#00FF9C] tracking-[2px] uppercase font-bold">STRONGEST</span>
                            <span className="text-[#00FF9C] text-sm">🏆</span>
                        </div>
                        <div className="space-y-3">
                            {scoreResult.strongestDimensions.map(d => (
                                <div key={d} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#00FF9C]" />
                                    <span className="text-[13px] text-white flex-1">{getDimensionLabel(d)}</span>
                                    <span className="text-[13px] text-white font-bold">{scoreResult.dimensions[d]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-[#FFB34705] border border-[#FFB34726] rounded-[16px] p-[20px]">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-[10px] text-[#FFB347] tracking-[2px] uppercase font-bold">STRENGTHEN</span>
                            <span className="text-[#FFB347] text-sm">🎯</span>
                        </div>
                        <div className="space-y-3">
                            {scoreResult.weakestDimensions.map(d => (
                                <div key={d} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#FFB347]" />
                                    <span className="text-[13px] text-white flex-1">{getDimensionLabel(d)}</span>
                                    <span className="text-[13px] text-white font-bold">{scoreResult.dimensions[d]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* SECTION 5 — REFLECTION PARAGRAPH */}
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 2.8 }}
                    className="w-full bg-[#0D1F14] border border-[#1A2A1A] rounded-[16px] p-[24px_28px] mb-12 relative"
                >
                    <div className="absolute top-4 left-4 text-[#00FF9C] text-[32px] leading-none" style={{ fontFamily: "Georgia, serif" }}>"</div>
                    <p className="text-[15px] text-[#C4CDD6] leading-[1.8] text-center pt-2 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {scoreResult.passed 
                        ? "Your responses demonstrate a highly balanced approach to complex life scenarios. You show a strong capacity for considered judgment while maintaining integrity and compassion."
                        : "Your current profile shows specific areas where judgment or emotional balance could be strengthened. Life is a continuous learning process. Consider how different choices yield better long-term outcomes."}
                    </p>
                    <div className="text-center text-[12px] text-[#8892A4] italic">
                        Reflect. Grow. Return.
                    </div>
                </motion.div>

                {/* SECTION 6 — ACTION BUTTONS */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: 3.0 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-[16px] w-full"
                >
                    {scoreResult.passed ? (
                        <>
                            <button 
                                onClick={handleDownloadCertificate}
                                className="w-full sm:w-auto bg-[#00FF9C] text-[#0A0F0A] font-bold rounded-[50px] px-[36px] py-[14px] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,156,0.3)] transition-transform hover:scale-105"
                            >
                                <Download className="w-5 h-5" /> Download Certificate
                            </button>
                            <button 
                                onClick={restartAssessment}
                                className="w-full sm:w-auto bg-transparent border border-[#1A2A1A] text-[#8892A4] rounded-[50px] px-[36px] py-[14px] hover:border-[#8892A4] transition-colors"
                            >
                                Retake Assessment
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={restartAssessment}
                                className="w-full sm:w-auto bg-[#FFB347] text-[#0A0F0A] font-bold rounded-[50px] px-[36px] py-[14px] transition-transform hover:scale-105"
                            >
                                Retake Assessment
                            </button>
                            <button 
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} // Simple action for See Weak Areas
                                className="w-full sm:w-auto bg-transparent border border-[#FF4D6D30] text-[#FF4D6D] rounded-[50px] px-[36px] py-[14px] hover:bg-[#FF4D6D10] transition-colors"
                            >
                                See Weak Areas
                            </button>
                        </>
                    )}
                </motion.div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-[#0D1B0D] py-20 px-4 md:px-8 flex flex-col justify-center relative overflow-hidden font-sans">
            {/* Nirvaha Logo */}
            <div className="absolute top-6 right-6 md:top-8 md:right-12 z-50">
                <img 
                    src="/logo1.png" 
                    alt="Nirvaha" 
                    className="h-20 md:h-28 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity drop-shadow-[0_2px_15px_rgba(212,175,55,0.15)]" 
                />
            </div>

            {/* Global background effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1a3d2b] opacity-20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#D4AF37] opacity-5 blur-[150px] rounded-full pointer-events-none" />
            
            <AnimatePresence mode="wait">
                {screen === 'loading' && renderLoading()}
                {screen === 'welcome' && renderWelcome()}
                {screen === 'instructions' && renderInstructions()}
                {screen === 'question' && renderQuestion()}
                {screen === 'result' && renderResult()}
            </AnimatePresence>
        </div>
    );
};
