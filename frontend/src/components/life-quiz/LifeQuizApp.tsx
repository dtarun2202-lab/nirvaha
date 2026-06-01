import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Download, RotateCcw, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { LIFE_QUIZ_QUESTIONS, SCORING_DIMENSIONS } from './LifeQuizData';
import { calculateLifeScore, generateCertificateSVG, ScoreResult } from './LifeQuizEngine';

type Screen = 'loading' | 'welcome' | 'instructions' | 'question' | 'result';

export const LifeQuizApp = () => {
    const [screen, setScreen] = useState<Screen>('loading');
    const [userName, setUserName] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>(Array(15).fill(-1));
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
        setAnswers(Array(15).fill(-1));
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

    const restartAssessment = () => {
        setScreen('welcome');
        setUserName('');
        setAnswers(Array(15).fill(-1));
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
            className="flex flex-col items-center justify-center max-w-xl mx-auto text-center"
        >
            <div className="mb-6 flex justify-center w-full">
                <img 
                    src="/yoga poses/understand-life  logo.jpg" 
                    alt="Understand Life via Quiz Logo" 
                    className="w-full max-w-sm md:max-w-md h-auto object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.2)]" 
                />
            </div>
            {/* Screen reader text since logo contains the text */}
            <h1 className="sr-only">
                Understand Life via Quiz
            </h1>
            <h2 className="text-xl text-[#D4AF37] mb-6 tracking-wide uppercase font-medium text-sm">
                A Scenario-Based Life Assessment
            </h2>
            <p className="text-zinc-400 mb-10 leading-relaxed">
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
                    <p>This is a <strong>scenario-based assessment</strong> containing 15 situations.</p>
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

                <div className="flex justify-end">
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

    const renderResult = () => {
        if (!scoreResult) return null;
        
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto w-full"
            >
                <div className="bg-[#111111] border border-zinc-800 rounded-3xl p-8 md:p-14 shadow-2xl text-center relative overflow-hidden">
                    
                    {/* Status Header */}
                    <div className="mb-10">
                        {scoreResult.passed ? (
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a3d2b]/30 border border-[#86efac]/30 text-[#86efac] font-bold text-sm tracking-widest uppercase mb-6">
                                <CheckCircle2 className="w-4 h-4" /> Passed Standard
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-900/30 border border-rose-500/30 text-rose-400 font-bold text-sm tracking-widest uppercase mb-6">
                                <AlertCircle className="w-4 h-4" /> Not Passed Yet
                            </div>
                        )}
                        <h2 className="text-3xl text-white font-bold" style={{ fontFamily: "'Cinzel', serif" }}>Assessment Outcome</h2>
                    </div>

                    {/* Score Display */}
                    <div className="relative w-64 h-64 mx-auto mb-10 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                            <circle cx="128" cy="128" r="120" fill="none" stroke="#27272a" strokeWidth="8" />
                            <circle 
                                cx="128" cy="128" r="120" 
                                fill="none" 
                                stroke={scoreResult.passed ? "#D4AF37" : "#f43f5e"} 
                                strokeWidth="8" 
                                strokeDasharray={2 * Math.PI * 120}
                                strokeDashoffset={2 * Math.PI * 120 * (1 - scoreResult.totalScore / 100)}
                                className="transition-all duration-1500 ease-out"
                            />
                        </svg>
                        <div className="text-center">
                            <div className="text-7xl font-bold text-white mb-2">{scoreResult.totalScore}</div>
                            <div className="text-zinc-500 text-sm uppercase tracking-widest font-bold">Life Score</div>
                        </div>
                    </div>

                    {/* Analysis Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-left">
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                            <h4 className="text-[#86efac] font-bold uppercase tracking-wider text-xs mb-4">Strongest Dimensions</h4>
                            <ul className="space-y-3">
                                {scoreResult.strongestDimensions.map(d => (
                                    <li key={d} className="flex justify-between items-center">
                                        <span className="text-white font-medium">{getDimensionLabel(d)}</span>
                                        <span className="text-zinc-500">{scoreResult.dimensions[d]}/100</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                            <h4 className="text-rose-400 font-bold uppercase tracking-wider text-xs mb-4">Areas to Strengthen</h4>
                            <ul className="space-y-3">
                                {scoreResult.weakestDimensions.map(d => (
                                    <li key={d} className="flex justify-between items-center">
                                        <span className="text-white font-medium">{getDimensionLabel(d)}</span>
                                        <span className="text-zinc-500">{scoreResult.dimensions[d]}/100</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Reflective Guidance */}
                    <div className="mb-12">
                        <p className="text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                            {scoreResult.passed 
                            ? "Your responses demonstrate a highly balanced approach to complex life scenarios. You show a strong capacity for considered judgment while maintaining integrity and compassion. Keep cultivating these dimensions."
                            : "Your current profile shows specific areas where judgment or emotional balance could be strengthened. Life is a continuous learning process. Reflect on the dimensions highlighted above and consider how different choices might yield better long-term outcomes."}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={restartAssessment}
                            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-white font-bold transition-colors flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="w-5 h-5" /> Retake Assessment
                        </button>
                        
                        {scoreResult.passed && (
                            <button 
                                onClick={handleDownloadCertificate}
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:opacity-90 text-black font-bold transition-opacity flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                            >
                                <Download className="w-5 h-5" /> Download Certificate
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-[#0D1B0D] py-20 px-4 md:px-8 flex flex-col justify-center relative overflow-hidden font-sans">
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
