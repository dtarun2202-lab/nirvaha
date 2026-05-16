import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pathway, pathwaysData } from '../../data/pathwaysData';
import { 
    Download, 
    ChevronDown, 
    ChevronUp, 
    Quote, 
    ArrowRight,
    MessageCircle,
    HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SyllabusFooterProps {
    pathway: Pathway;
}

const SyllabusFooter: React.FC<SyllabusFooterProps> = ({ pathway }) => {
    const navigate = useNavigate();
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const testimonials = [
        {
            name: "Sarah Jenkins",
            role: "Creative Director",
            text: "The mindfulness certification changed how I lead my team. It's not just a course; it's a profound shift in perspective.",
            avatar: "SJ"
        },
        {
            name: "David Chen",
            role: "Software Architect",
            text: "Focus restoration modules were a game-changer for my productivity and mental clarity in high-stress environments.",
            avatar: "DC"
        }
    ];

    const faqs = [
        {
            q: "Is this certification recognized by professional bodies?",
            a: "Yes, our certifications are accredited by the International Wellness Federation and meet ISO 21001 standards for educational organizations."
        },
        {
            q: "What is the expected time commitment per week?",
            a: "We recommend dedicating 3-5 hours per week for lessons, practice, and reflection to gain the maximum benefit from the journey."
        },
        {
            q: "Can I access the content after the 5-week program?",
            a: "Absolutely. Graduates receive lifetime access to all course materials and the Nirvaha alumni community hub."
        }
    ];

    const relatedPathways = pathwaysData
        .filter(p => p.id !== pathway.id)
        .slice(0, 2);

    return (
        <footer className="space-y-32">
            {/* Testimonials */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {testimonials.map((t, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] relative group overflow-hidden"
                    >
                        <Quote className="absolute top-8 right-8 text-emerald-500/10 w-20 h-20 -rotate-12 transition-transform group-hover:scale-110" />
                        <div className="relative z-10 space-y-8">
                            <p className="text-xl md:text-2xl font-serif text-white/80 leading-relaxed italic">"{t.text}"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                                    {t.avatar}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{t.name}</h4>
                                    <p className="text-xs text-white/40 uppercase tracking-widest">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* FAQ & Download */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div className="space-y-12">
                    <div className="space-y-4">
                        <h3 className="text-3xl font-serif flex items-center gap-3">
                            <HelpCircle className="text-emerald-500" /> Curated Inquiries
                        </h3>
                        <p className="text-white/40 font-light">Frequently asked questions about the certification journey.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border-b border-white/5">
                                <button 
                                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                                    className="w-full py-6 flex items-center justify-between text-left group"
                                >
                                    <span className={`text-lg transition-colors ${expandedFaq === i ? 'text-emerald-400' : 'text-white/70 group-hover:text-white'}`}>
                                        {faq.q}
                                    </span>
                                    {expandedFaq === i ? <ChevronUp size={20} className="text-emerald-500" /> : <ChevronDown size={20} className="text-white/20" />}
                                </button>
                                <AnimatePresence>
                                    {expandedFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="pb-8 text-white/40 leading-relaxed font-light">{faq.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/10 to-transparent p-12 rounded-[3rem] border border-emerald-500/20 flex flex-col items-center justify-center text-center space-y-8">
                    <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-emerald-500 shadow-2xl">
                        <Download size={40} />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-2xl font-serif">Comprehensive Prospectus</h4>
                        <p className="text-white/40 font-light px-8">Download the detailed 40-page syllabus including all reading lists and faculty bios.</p>
                    </div>
                    <button className="px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        Download Full Syllabus (PDF)
                    </button>
                </div>
            </section>

            {/* Related Pathways */}
            <section className="space-y-12">
                <div className="text-center space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500/60">Continue Exploring</span>
                    <h3 className="text-4xl font-serif">Alternative Paths</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {relatedPathways.map((p, i) => (
                        <div 
                            key={i}
                            onClick={() => navigate(`/pathways/${p.id}`)}
                            className="group relative h-80 rounded-[2.5rem] overflow-hidden cursor-pointer border border-white/5"
                        >
                            <img 
                                src={p.image} 
                                alt={p.title} 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            
                            <div className="absolute inset-0 p-10 flex flex-col justify-end space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">{p.level}</p>
                                    <h4 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">{p.title}</h4>
                                </div>
                                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                                    View Path <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Final Bottom Call to Action */}
            <section className="py-20 text-center border-t border-white/5">
                <p className="text-white/40 mb-8 font-light max-w-xl mx-auto">
                    Transform your understanding of internal clarity. Join a cohort of mindful seekers today.
                </p>
                <button 
                    onClick={() => navigate(`/pathways/${pathway.id}/journey`)}
                    className="flex items-center gap-3 mx-auto text-xl font-serif text-white hover:text-emerald-400 transition-colors group"
                >
                    Begin Enrollment <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </button>
            </section>
        </footer>
    );
};

export default SyllabusFooter;
