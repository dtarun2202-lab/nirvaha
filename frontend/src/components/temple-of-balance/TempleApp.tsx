import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, HelpCircle } from 'lucide-react';
import { 
    LifeStats, BoardState, TileDef, FeedbackMessage, 
    INITIAL_STATS, MAX_TURNS, GameEvent 
} from './TempleData';
import { generateTurnOptions, processTurn, checkGameState } from './TempleEngine';
import { TempleBoard } from './TempleBoard';

type GameStatus = 'PLAYING' | 'WIN' | 'LOSE_STAT' | 'LOSE_STABILITY' | 'LOSE_IMBALANCE';

export const TempleApp = () => {
    // Game State
    const [stats, setStats] = useState<LifeStats>(INITIAL_STATS);
    const [board, setBoard] = useState<BoardState>(() => 
        Array(5).fill(null).map(() => Array(5).fill(null))
    );
    const [turn, setTurn] = useState<number>(1);
    const [status, setStatus] = useState<GameStatus>('PLAYING');
    
    // Turn State
    const [options, setOptions] = useState<TileDef[]>([]);
    const [selectedTile, setSelectedTile] = useState<TileDef | null>(null);
    const [feedbackLog, setFeedbackLog] = useState<FeedbackMessage[]>([]);
    const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
    const [showHelp, setShowHelp] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const feedbackEndRef = useRef<HTMLDivElement>(null);

    // Initialize game
    useEffect(() => {
        startNewGame();
    }, []);

    // Auto-scroll feedback
    useEffect(() => {
        if (feedbackEndRef.current) {
            feedbackEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [feedbackLog]);

    const startNewGame = () => {
        setStats({ ...INITIAL_STATS });
        setBoard(Array(5).fill(null).map(() => Array(5).fill(null)));
        setTurn(1);
        setStatus('PLAYING');
        setOptions(generateTurnOptions());
        setSelectedTile(null);
        setFeedbackLog([{ id: 'start', text: 'The Temple awakens. Seek balance.', type: 'neutral' }]);
        setCurrentEvent(null);
    };

    const handleCellClick = (x: number, y: number) => {
        if (status !== 'PLAYING' || !selectedTile) return;

        const { newStats, newBoard, event, feedback } = processTurn(stats, board, x, y, selectedTile, turn);
        
        setStats(newStats);
        setBoard(newBoard);
        setFeedbackLog(prev => [...prev, ...feedback]);
        setCurrentEvent(event);

        const newStatus = checkGameState(newStats, turn);
        setStatus(newStatus);

        if (newStatus === 'PLAYING') {
            setTurn(prev => prev + 1);
            setOptions(generateTurnOptions());
            setSelectedTile(null);
        }
    };

    const renderStatsBar = (label: string, value: number, colorClass: string) => (
        <div className="mb-4">
            <div className="flex justify-between text-xs font-bold tracking-widest uppercase mb-1">
                <span className="text-gray-400">{label}</span>
                <span className={value < 30 ? 'text-red-400' : 'text-gray-200'}>{value}</span>
            </div>
            <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden">
                <motion.div 
                    className={`h-full ${colorClass}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ type: "spring", stiffness: 60 }}
                />
            </div>
        </div>
    );

    const renderEndScreen = () => {
        const isWin = status === 'WIN';
        let reason = '';
        if (status === 'LOSE_STAT') reason = 'One of your core life values completely collapsed.';
        if (status === 'LOSE_STABILITY') reason = 'The temple lost all stability and crumbled.';
        if (status === 'LOSE_IMBALANCE') reason = 'Extreme imbalance tore the temple apart.';

        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            >
                <div className="max-w-md w-full bg-[#0A0A0A] border border-gray-800 rounded-3xl p-8 text-center shadow-2xl">
                    <h2 className={`text-4xl font-serif mb-4 ${isWin ? 'text-[#D4AF37]' : 'text-red-500'}`}>
                        {isWin ? 'Harmony Achieved' : 'Temple Collapsed'}
                    </h2>
                    
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        {isWin 
                            ? 'You successfully navigated 12 cycles, maintaining the delicate balance of your life.'
                            : reason
                        }
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                        <div className="bg-gray-900/50 p-4 rounded-xl">
                            <span className="text-gray-500 text-[10px] uppercase tracking-widest block mb-1">Final Stability</span>
                            <span className="text-xl text-white font-mono">{stats.stability}</span>
                        </div>
                        <div className="bg-gray-900/50 p-4 rounded-xl">
                            <span className="text-gray-500 text-[10px] uppercase tracking-widest block mb-1">Turns Survived</span>
                            <span className="text-xl text-white font-mono">{turn} / 12</span>
                        </div>
                    </div>

                    <button 
                        onClick={startNewGame}
                        className="w-full py-4 rounded-xl font-bold bg-white text-black hover:bg-gray-200 transition-colors"
                    >
                        Begin Anew
                    </button>
                </div>
            </motion.div>
        );
    };

    if (!hasStarted) {
        return (
            <div className="min-h-[800px] w-full bg-[#080808]/90 text-gray-200 rounded-3xl border border-gray-800 overflow-hidden relative flex flex-col items-center justify-center shadow-2xl font-sans p-8 backdrop-blur-md">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl w-full bg-[#0A0A0A] border border-gray-800 rounded-3xl p-10 shadow-2xl"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-serif text-[#D4AF37] mb-4 tracking-wide">Temple of Balance</h1>
                        <p className="text-gray-400 text-lg">A strategy puzzle game of life's essential pillars</p>
                    </div>

                    <div className="space-y-6 text-gray-300 mb-12 text-sm leading-relaxed">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 shrink-0 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-xl text-[#D4AF37]">1</div>
                            <div>
                                <h3 className="text-white font-bold mb-1 uppercase tracking-widest text-xs">The Goal</h3>
                                <p>Survive 12 cycles (turns) without letting your Core Stability or any of your 4 life values (Work, Rest, Relationships, Growth) reach zero.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 shrink-0 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-xl text-[#D4AF37]">2</div>
                            <div>
                                <h3 className="text-white font-bold mb-1 uppercase tracking-widest text-xs">Placement Matters</h3>
                                <p>Each turn, choose a tile and place it on the 5x5 board. Tiles placed in the <strong>Inner Ring</strong> (near the core) receive a 20% boost. Tiles on the <strong>Edges</strong> are reduced by 10%. <strong>Corners</strong> are highly volatile, magnifying all effects.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 shrink-0 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-xl text-[#D4AF37]">3</div>
                            <div>
                                <h3 className="text-white font-bold mb-1 uppercase tracking-widest text-xs">The Rules of Harmony</h3>
                                <p>
                                    • Connecting <strong>Work & Rest</strong> or <strong>Relationships & Growth</strong> grants bonus stability.<br/>
                                    • <span className="text-red-400">WARNING:</span> Connecting 3 or more of the same tile family causes <strong>Overload</strong> and drains your stability.<br/>
                                    • Surrounding the core with all 4 unique families grants a massive +15 Stability bonus.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setHasStarted(true)}
                        className="w-full py-5 rounded-xl font-bold bg-[#D4AF37] text-black hover:bg-[#FDE047] transition-colors text-lg tracking-wide uppercase"
                    >
                        Enter the Temple
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-[800px] w-full bg-[#080808] text-gray-200 rounded-3xl border border-gray-800 overflow-hidden relative flex flex-col md:flex-row shadow-2xl font-sans">
            
            {/* Top/Left Sidebar: Stats & Info */}
            <div className="w-full md:w-72 bg-[#0A0A0A] border-b md:border-b-0 md:border-r border-gray-800 flex flex-col">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-serif text-white tracking-wide">Temple of Balance</h1>
                        <p className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mt-1">Turn {Math.min(turn, 12)} / 12</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setShowHelp(true)} className="p-2 text-gray-500 hover:text-white transition-colors">
                            <HelpCircle className="w-4 h-4" />
                        </button>
                        <button onClick={startNewGame} className="p-2 text-gray-500 hover:text-white transition-colors" title="Reset">
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="p-6 flex-grow">
                    <h3 className="text-[10px] font-bold text-gray-600 tracking-[0.2em] uppercase mb-6">Life Values</h3>
                    {renderStatsBar('Work', stats.work, 'bg-amber-500')}
                    {renderStatsBar('Rest', stats.rest, 'bg-blue-500')}
                    {renderStatsBar('Relationships', stats.relationships, 'bg-rose-500')}
                    {renderStatsBar('Growth', stats.growth, 'bg-emerald-500')}
                    
                    <div className="mt-10">
                        <h3 className="text-[10px] font-bold text-gray-600 tracking-[0.2em] uppercase mb-4">Core Stability</h3>
                        <div className="relative h-12 bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                            <motion.div 
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-gray-700 to-gray-500"
                                animate={{ width: `${stats.stability}%` }}
                                transition={{ type: "spring", stiffness: 60 }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-mono text-lg font-bold text-white drop-shadow-md">{stats.stability}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Area: Board & Actions */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                <div className="flex-1 flex items-center justify-center p-4">
                    <TempleBoard 
                        board={board} 
                        onCellClick={handleCellClick}
                        canPlace={selectedTile !== null && status === 'PLAYING'}
                    />
                </div>

                {/* Bottom Panel: Tile Choices */}
                <div className="bg-[#0A0A0A] border-t border-gray-800 p-6 z-20">
                    <h3 className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-4 text-center">
                        {status === 'PLAYING' ? 'Select a tile to place' : 'Game Over'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        {status === 'PLAYING' && options.map((tile) => (
                            <button
                                key={tile.id}
                                onClick={() => setSelectedTile(tile)}
                                className={`
                                    p-4 rounded-xl border text-left transition-all duration-200 relative overflow-hidden
                                    ${selectedTile?.id === tile.id 
                                        ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-[0_0_15px_rgba(212,175,55,0.15)] scale-[1.02]' 
                                        : 'border-gray-800 bg-gray-900/50 hover:border-gray-600 hover:bg-gray-800'
                                    }
                                `}
                            >
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                                    {tile.family}
                                </span>
                                <h4 className="font-bold text-white mb-3">{tile.name}</h4>
                                
                                <div className="space-y-1">
                                    {Object.entries(tile.effects).map(([key, val]) => (
                                        <div key={key} className="flex justify-between text-xs">
                                            <span className="text-gray-500 capitalize">{key}</span>
                                            <span className={val > 0 ? 'text-green-400' : 'text-red-400'}>
                                                {val > 0 ? '+' : ''}{val}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Sidebar: Event Log (Desktop) / Bottom (Mobile) */}
            <div className="w-full md:w-80 bg-[#0A0A0A] border-t md:border-t-0 md:border-l border-gray-800 flex flex-col h-64 md:h-auto">
                <div className="p-6 border-b border-gray-800">
                    <h3 className="text-[10px] font-bold text-gray-600 tracking-[0.2em] uppercase">Chronicle</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs">
                    <AnimatePresence initial={false}>
                        {feedbackLog.map((log, i) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`
                                    p-3 rounded-lg border leading-relaxed
                                    ${log.type === 'positive' ? 'bg-green-900/20 border-green-500/30 text-green-300' : ''}
                                    ${log.type === 'negative' ? 'bg-red-900/20 border-red-500/30 text-red-300' : ''}
                                    ${log.type === 'event' ? 'bg-purple-900/20 border-purple-500/30 text-purple-300' : ''}
                                    ${log.type === 'insight' ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37] italic' : ''}
                                    ${log.type === 'neutral' ? 'bg-gray-900 border-gray-800 text-gray-400' : ''}
                                `}
                            >
                                {log.text}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={feedbackEndRef} />
                </div>
            </div>

            {/* End Screen Overlay */}
            {status !== 'PLAYING' && renderEndScreen()}

            {/* Help Modal Overlay */}
            <AnimatePresence>
                {showHelp && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setShowHelp(false)}
                    >
                        <div className="max-w-2xl w-full bg-[#0A0A0A] border border-gray-800 rounded-3xl p-8 max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                            <h2 className="text-2xl font-serif text-white mb-6">How to Play</h2>
                            <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
                                <p><strong>Goal:</strong> Survive 12 turns without letting any life value or your Core Stability reach 0.</p>
                                <p><strong>Turns:</strong> Each turn, select one of 3 tiles and place it on an empty space on the 5x5 board.</p>
                                <p><strong>Placement Matters:</strong> 
                                    <br/>• Inner Ring (around center): Boosts positive effects by 20%.
                                    <br/>• Edges: Reduces all effects by 10%.
                                    <br/>• Corners: Magnifies both positive and negative effects by 20%.
                                </p>
                                <p><strong>Adjacency Synergy:</strong> 
                                    <br/>• Connecting Work & Rest grants +5 Stability.
                                    <br/>• Connecting Relationships & Growth grants +3 to both.
                                </p>
                                <p><strong>Overload Penalty:</strong> Connecting 3 or more tiles of the same family causes strain and heavily damages Stability.</p>
                                <p><strong>Core Balance:</strong> Surrounding the center with all 4 unique families grants a massive +15 Stability bonus!</p>
                            </div>
                            <button onClick={() => setShowHelp(false)} className="mt-8 w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-colors">
                                Understood
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};
