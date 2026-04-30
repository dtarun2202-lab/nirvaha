import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import BACKEND_CONFIG from "../../config/backend";

const EMOJIS = [
  "🌿", "🌸", "🦋", "🐢", "🌊", "⛰️", "🌈", "☀️",
  "🌙", "🕊️", "🍄", "🍃", "🌻", "🍎", "🍉", "🍒", "🍓", "🌺"
];

interface CardData {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface Stats {
  sessionsPlayed: number;
  bestScore: number | null; // Lowest moves
  currentStreak: number;
  lastPlayedDate: string | null;
}

export default function MemoryMatch({ currentUser }: { currentUser: any }) {
  const { user, updateStats } = useAuth();
  const [difficulty, setDifficulty] = useState<"4x4" | "6x6">("4x4");
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [stats, setStats] = useState<Stats>({
    sessionsPlayed: 0,
    bestScore: null,
    currentStreak: 0,
    lastPlayedDate: null
  });

  // Load stats on mount
  useEffect(() => {
    const saved = localStorage.getItem("nirvaha_memory_stats");
    if (saved) {
      setStats(JSON.parse(saved));
    }
    initGame("4x4");
  }, []);

  const initGame = useCallback((diff: "4x4" | "6x6") => {
    const pairsCount = diff === "4x4" ? 8 : 18;
    const selectedEmojis = EMOJIS.slice(0, pairsCount);
    const deck = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({
        id: idx,
        emoji,
        isFlipped: false,
        isMatched: false
      }));

    setDifficulty(diff);
    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setIsWon(false);
  }, []);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      
      if (newCards[first].emoji === newCards[second].emoji) {
        // Match!
        setTimeout(() => {
          setCards(prev => {
            const matched = [...prev];
            matched[first].isMatched = true;
            matched[second].isMatched = true;
            return matched;
          });
          setFlippedIndices([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => {
            const reset = [...prev];
            reset[first].isFlipped = false;
            reset[second].isFlipped = false;
            return reset;
          });
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  // Check win condition
  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched) && !isWon) {
      setIsWon(true);
      updateStatsOnWin();
    }
  }, [cards, isWon]);

  const updateStatsOnWin = async () => {
    // 1. Update localStorage-based stats (existing)
    setStats(prev => {
      const today = new Date().toISOString().split("T")[0];
      let newStreak = prev.currentStreak;

      if (prev.lastPlayedDate) {
        const lastDate = new Date(prev.lastPlayedDate);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) newStreak += 1;
        else if (diffDays > 1) newStreak = 1;
      } else {
        newStreak = 1;
      }

      const newStats = {
        sessionsPlayed: prev.sessionsPlayed + 1,
        bestScore: prev.bestScore ? Math.min(prev.bestScore, moves) : moves,
        currentStreak: newStreak,
        lastPlayedDate: today
      };
      localStorage.setItem("nirvaha_memory_stats", JSON.stringify(newStats));
      return newStats;
    });

    // 2. Persist to backend if user is logged in
    if (user?.id) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/profile/increment-game`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ userId: user.id, moves })
        });
        if (res.ok) {
          const data = await res.json();
          updateStats(data.stats);
        }
      } catch (e) {
        console.error("Failed to persist game stats:", e);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0f172a] flex items-center gap-2">
            🧠 Memory Match
          </h2>
          <p className="text-sm text-[#6b7280]">Train your mind, find the pairs.</p>
        </div>

        <div className="flex gap-4 items-center bg-[#f0fdf4] px-5 py-3 rounded-2xl border border-[#bbf7d0]">
          <div className="text-center">
            <p className="text-xs text-[#16a34a] font-bold uppercase tracking-wider">Sessions</p>
            <p className="text-xl font-bold text-[#14532d]">{stats.sessionsPlayed}</p>
          </div>
          <div className="w-px h-8 bg-[#16a34a]/20"></div>
          <div className="text-center">
            <p className="text-xs text-[#16a34a] font-bold uppercase tracking-wider">Best</p>
            <p className="text-xl font-bold text-[#14532d]">{stats.bestScore || "-"}</p>
          </div>
          <div className="w-px h-8 bg-[#16a34a]/20"></div>
          <div className="text-center">
            <p className="text-xs text-[#16a34a] font-bold uppercase tracking-wider">Streak</p>
            <p className="text-xl font-bold text-[#14532d] flex items-center justify-center gap-1">
              🔥 {stats.currentStreak}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-full">
          <button
            onClick={() => initGame("4x4")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${difficulty === "4x4" ? "bg-white text-[#0f172a] shadow-sm" : "text-[#6b7280] hover:text-[#0f172a]"}`}
          >
            Normal (4x4)
          </button>
          <button
            onClick={() => initGame("6x6")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${difficulty === "6x6" ? "bg-white text-[#0f172a] shadow-sm" : "text-[#6b7280] hover:text-[#0f172a]"}`}
          >
            Hard (6x6)
          </button>
        </div>
        <p className="text-sm font-semibold text-[#0f172a]">Moves: {moves}</p>
      </div>

      {/* Grid */}
      <div className="relative min-h-[400px]">
        <AnimatePresence>
          {isWon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl"
            >
              <div className="bg-white p-8 rounded-3xl shadow-2xl text-center border border-[#bbf7d0]">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-[#14532d] mb-2">You Won!</h3>
                <p className="text-[#16a34a] mb-6 font-medium">Completed in {moves} moves</p>
                <button
                  onClick={() => initGame(difficulty)}
                  className="bg-[#2D6A4F] text-white px-8 py-3 rounded-full font-bold hover:bg-[#1B4332] transition-colors shadow-lg"
                >
                  Play Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`grid gap-3 ${difficulty === "4x4" ? "grid-cols-4 max-w-md" : "grid-cols-6 max-w-2xl"} mx-auto`}>
          {cards.map((card, idx) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className="aspect-square relative cursor-pointer perspective-1000"
            >
              <motion.div
                className="w-full h-full relative preserve-3d"
                initial={false}
                animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front (Hidden state) */}
                <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#52B788] to-[#2D6A4F] rounded-xl shadow-md border border-[#40916C] flex items-center justify-center">
                  <span className="text-white/30 text-2xl font-bold">?</span>
                </div>

                {/* Back (Revealed state) */}
                <div 
                  className={`absolute inset-0 backface-hidden rounded-xl shadow-md flex items-center justify-center text-3xl sm:text-4xl border ${card.isMatched ? "bg-[#f0fdf4] border-[#bbf7d0]" : "bg-white border-gray-200"}`}
                  style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
                >
                  <motion.span
                    initial={false}
                    animate={card.isMatched ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {card.emoji}
                  </motion.span>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
