import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pathway } from '../../data/pathwaysData';
import { ChevronDown, ChevronUp, PlayCircle, BookOpen, PenTool, CheckCircle2 } from 'lucide-react';

interface CurriculumTimelineProps {
    pathway: Pathway;
}

const CurriculumTimeline: React.FC<CurriculumTimelineProps> = ({ pathway }) => {
    const [expandedModule, setExpandedModule] = useState<number | null>(0);

    // Map real-time pathway timeline data to the curriculum display format
    const curriculumData = pathway.timeline.map((item, index) => ({
        module: `Module ${index + 1}`,
        title: item.title,
        desc: item.description,
        lessons: [
            "Introduction to " + item.title,
            "Core Principles & Practice",
            "Advanced Techniques",
            "Practical Integration"
        ],
        exercises: index === pathway.timeline.length - 1 ? "Final Capstone Project" : "Weekly Reflection & Practice",
        duration: `Week ${index + 1}`
    }));

    return (
        <section className="space-y-16">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-4">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.5em]"
                    >
                        The Path
                    </motion.span>
                    <h2 className="text-4xl md:text-6xl font-serif">Detailed Curriculum</h2>
                </div>
                <div className="flex items-center gap-4 text-white/30 text-xs font-bold uppercase tracking-widest pb-2">
                    <BookOpen size={16} /> {curriculumData.length} Modules Total
                </div>
            </div>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] bg-white/5 hidden md:block" />

                <div className="space-y-8 relative z-10">
                    {curriculumData.map((item, i) => (
                        <div key={i} className="group">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`relative p-8 md:p-12 rounded-[2.5rem] border transition-all duration-500 cursor-pointer ${
                                    expandedModule === i 
                                    ? 'bg-white/5 border-emerald-500/30' 
                                    : 'bg-transparent border-white/5 hover:border-white/10'
                                }`}
                                onClick={() => setExpandedModule(expandedModule === i ? null : i)}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start gap-8">
                                        <div className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                            expandedModule === i ? 'bg-emerald-500 text-black border-emerald-500' : 'border-white/10 text-white/20'
                                        }`}>
                                            <span className="text-xs font-black">{i + 1}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${expandedModule === i ? 'text-emerald-500' : 'text-white/30'}`}>
                                                    {item.module} — {item.duration}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-serif text-white/90">{item.title}</h3>
                                            <p className="text-white/40 font-light leading-relaxed max-w-2xl">{item.desc}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 ml-20 md:ml-0">
                                        <div className="text-right hidden md:block">
                                            <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Lessons</p>
                                            <p className="text-lg font-bold">{item.lessons.length}</p>
                                        </div>
                                        {expandedModule === i ? <ChevronUp className="text-emerald-500" /> : <ChevronDown className="text-white/20" />}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedModule === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-12 pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-12 ml-0 md:ml-20">
                                                <div className="space-y-6">
                                                    <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-500/60 flex items-center gap-2">
                                                        <PlayCircle size={14} /> Lesson Schedule
                                                    </h4>
                                                    <ul className="space-y-4">
                                                        {item.lessons.map((lesson, j) => (
                                                            <li key={j} className="flex items-center gap-4 group/item">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover/item:bg-emerald-500 transition-colors" />
                                                                <span className="text-white/70 font-light">{lesson}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="space-y-6">
                                                    <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-500/60 flex items-center gap-2">
                                                        <PenTool size={14} /> Practice & Exercises
                                                    </h4>
                                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                                        <p className="text-white/80 font-medium">{item.exercises}</p>
                                                        <div className="mt-4 flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest">
                                                            <CheckCircle2 size={12} className="text-emerald-500/50" /> Completion Required
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CurriculumTimeline;
