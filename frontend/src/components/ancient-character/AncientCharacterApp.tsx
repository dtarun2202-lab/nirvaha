import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, RotateCcw } from 'lucide-react';
import { QUIZ_QUESTIONS, QuizOption } from './AncientCharacterData';
import { calculateResult, generateDownloadCardSVG, QuizResult } from './AncientCharacterEngine';

type ScreenState = 'welcome' | 'question' | 'result';

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
            className="flex flex-col items-center justify-center min-h-[600px] text-center px-4"
        >
            <div className="w-24 h-24 mb-8 rounded-full border border-gray-700 flex items-center justify-center bg-gray-900/50 shadow-2xl">
                <div className="w-16 h-16 rounded-full border border-gray-600 flex items-center justify-center opacity-80">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif text-gray-100 mb-4 tracking-wide">
                Check Your<br/>Ancient Character
            </h1>
            
            <p className="text-xl text-gray-400 font-light tracking-widest mb-8 uppercase">
                A Reflective Character Quiz
            </p>
            
            <p className="text-gray-400 max-w-lg mx-auto mb-12 text-lg leading-relaxed">
                Answer a few questions to discover which ancient character qualities most reflect your present nature.
            </p>

            <button 
                onClick={handleStart}
                className="px-10 py-4 bg-gray-100 text-gray-900 rounded-full font-medium text-lg hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
                Start Quiz
            </button>
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

    const renderResult = () => {
        if (!result) return null;
        
        const { primaryMatch, secondaryMatch, matchPercentage } = result;

        return (
            <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-4xl mx-auto py-12 px-4 relative z-10"
            >
                {/* Optional Background Image for Character */}
                {primaryMatch.image && (
                    <div className="absolute inset-0 z-[-1] opacity-20 pointer-events-none rounded-3xl overflow-hidden mask-image-linear-gradient">
                        <img 
                            src={primaryMatch.image} 
                            alt={primaryMatch.name} 
                            className="w-full h-full object-cover mix-blend-overlay"
                        />
                        <div className="absolute inset-0 bg-black/60" />
                    </div>
                )}

                <div className="text-center mb-16 relative">
                    <p className="text-gray-400 tracking-widest uppercase mb-4">Your Character Match</p>
                    <h1 className="text-5xl md:text-7xl font-serif mb-6" style={{ color: primaryMatch.colors.primary }}>
                        {primaryMatch.name}
                    </h1>
                    <p className="text-2xl font-light text-gray-300 mb-8 tracking-wider">
                        {primaryMatch.label}
                    </p>
                    
                    <div className="inline-flex items-center justify-center px-6 py-2 rounded-full border" style={{ borderColor: primaryMatch.colors.primary, backgroundColor: `${primaryMatch.colors.primary}15` }}>
                        <span className="font-medium" style={{ color: primaryMatch.colors.primary }}>
                            {matchPercentage}% Resonance
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 mb-16">
                    <div>
                        <p className="text-xl text-gray-300 leading-relaxed mb-8">
                            You most strongly resonate with the path of {primaryMatch.name}. {primaryMatch.description}
                        </p>
                        
                        <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-4">Qualities You Reflect</h3>
                        <div className="flex flex-wrap gap-2 mb-8">
                            {primaryMatch.qualities.map(q => (
                                <span key={q} className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 text-sm">
                                    {q}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800">
                        <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-6">Path of Refinement</h3>
                        <ul className="space-y-4">
                            {primaryMatch.growth.map((g, i) => (
                                <li key={i} className="flex items-start text-gray-300">
                                    <span className="mr-3 mt-1" style={{ color: primaryMatch.colors.primary }}>❖</span>
                                    {g}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-12 pb-12 text-center">
                    <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">Secondary Resonance</p>
                    <p className="text-xl text-gray-400">
                        You also reflect the qualities of <span className="text-white">{secondaryMatch.name}</span>, {secondaryMatch.label.toLowerCase()}.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
                    <button 
                        onClick={handleDownload}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
                        style={{ backgroundImage: `linear-gradient(to right, ${primaryMatch.colors.primary}, ${primaryMatch.colors.secondary})` }}
                    >
                        <Download className="w-5 h-5" />
                        Download Card
                    </button>
                    
                    <button 
                        onClick={handleStart}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gray-900 text-gray-300 border border-gray-700 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Retake Quiz
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
