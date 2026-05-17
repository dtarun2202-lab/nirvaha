import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Zap, Wind } from 'lucide-react';

interface EmotionalProgressProps {
    stats?: {
        weeklyMinutes?: number[];
        wellnessScore?: number;
    };
}

const EmotionalProgress: React.FC<EmotionalProgressProps> = ({ stats }) => {
    // Generate points from weeklyMinutes or fallback to default growth curve
    const defaultCalm = [45, 52, 48, 65, 70, 85, 92];
    const defaultFocus = [30, 45, 60, 55, 75, 80, 88];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const points = days.map((day, i) => {
        // If we have weeklyMinutes, use them to scale the calm/focus values
        const mins = stats?.weeklyMinutes?.[i] || 0;
        const multiplier = mins > 0 ? 1.2 : 1;
        
        return {
            day,
            calm: Math.min(100, (stats?.weeklyMinutes ? (mins * 5 + 30) : defaultCalm[i])),
            focus: Math.min(100, (stats?.weeklyMinutes ? (mins * 4 + 25) : defaultFocus[i]))
        };
    });

    const maxVal = 100;
    const height = 150;
    const width = 400;

    const getPath = (key: 'calm' | 'focus') => {
        return points.map((p, i) => {
            const x = (i / (points.length - 1)) * width;
            const y = height - (p[key] / maxVal) * height;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                <Activity size={40} className="text-emerald-500" />
            </div>

            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-8 flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-400" /> Emotional Growth
            </h3>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Calmness</p>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-emerald-400">{stats?.wellnessScore || 92}%</span>
                        <span className="text-[10px] text-emerald-500/60 font-bold">+12%</span>
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Focus</p>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-teal-400">{Math.max(0, (stats?.wellnessScore || 88) - 4)}%</span>
                        <span className="text-[10px] text-teal-500/60 font-bold">+8%</span>
                    </div>
                </div>
            </div>

            {/* SVG Graph */}
            <div className="relative h-[150px] w-full mb-6">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    {/* Calm Path */}
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        d={getPath('calm')}
                        fill="none"
                        stroke="url(#calmGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    {/* Focus Path */}
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                        d={getPath('focus')}
                        fill="none"
                        stroke="url(#focusGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />

                    <defs>
                        <linearGradient id="calmGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                        <linearGradient id="focusGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#2dd4bf" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div className="flex justify-between px-1">
                {points.map((p, i) => (
                    <span key={i} className="text-[8px] uppercase tracking-widest text-white/20 font-bold">{p.day}</span>
                ))}
            </div>

            {/* Atmosphere overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
        </div>
    );
};

export default EmotionalProgress;
