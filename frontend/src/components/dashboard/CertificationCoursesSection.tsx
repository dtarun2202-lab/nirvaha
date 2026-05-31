import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const courses = [
    {
        id: "mindfulness-meditation-certification",
        title: "Mindfulness Meditation Certification",
        desc: "Learn the art and science of mindfulness meditation and become a certified instructor.",
        feel: "Calm & Focused",
        image: "/NA01.png",
        bgColor: "bg-gradient-to-br from-[#f2f7eb] to-[#e6f0de]"
    },
    {
        id: "emotional-intelligence-mastery",
        title: "Emotional Intelligence Mastery",
        desc: "Deep dive into emotional intelligence with practical tools and certification.",
        feel: "Empowered & Aware",
        image: "/NA02.png",
        bgColor: "bg-gradient-to-br from-[#fde68a] to-[#f59e0b]"
    },
    {
        id: "holistic-wellness-coach",
        title: "Holistic Wellness Coach",
        desc: "Comprehensive training to guide others on their holistic wellness journey.",
        feel: "Balanced & Inspired",
        image: "/NA03.png",
        bgColor: "bg-gradient-to-br from-[#a7f3d0] to-[#34d399]"
    },
    {
        id: "spiritual-counseling-program",
        title: "Spiritual Counseling Program",
        desc: "Integrate ancient wisdom and modern psychology for spiritual counseling.",
        feel: "Connected & Uplifted",
        image: "/NA04.png",
        bgColor: "bg-gradient-to-br from-[#e0e7ff] to-[#818cf8]"
    }
];

const CertificationCoursesSection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="py-24 relative overflow-hidden bg-[#fafafa]">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-3xl md:text-5xl font-bold text-[#0F131A] mb-6 tracking-tight uppercase"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        NIRVAHA ACADEMY <span className="text-[#1a5d47]">CERTIFICATION COURSES</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-[#595e67] text-lg max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        Unlock your potential with our expert-led, accredited programs designed for personal and professional growth.
                    </motion.p>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-16">
                    {courses.map((course, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                            whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                            className={`flex flex-col sm:flex-row rounded-[24px] overflow-hidden shadow-lg border border-white/20 transition-all duration-300 ${course.bgColor}`}
                        >
                            {/* Image Half */}
                            <div className="w-full sm:w-2/5 h-48 sm:h-auto shrink-0 relative overflow-hidden">
                                <img 
                                    src={course.image} 
                                    alt={course.title}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                />
                            </div>

                            {/* Content Half */}
                            <div className="p-6 sm:p-8 flex flex-col justify-center flex-1">
                                <h3 className="text-xl md:text-2xl font-bold text-[#0c141d] mb-3 leading-snug">
                                    {course.title}
                                </h3>
                                <p className="text-[#0c141d]/80 text-sm md:text-base leading-relaxed mb-6 font-medium">
                                    {course.desc}
                                </p>
                                <div className="mt-auto inline-flex items-center gap-2 bg-black/10 backdrop-blur-sm px-4 py-2 rounded-full w-fit">
                                    <Clock className="w-4 h-4 text-[#0c141d]/80" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#0c141d]/80">
                                        COURSE FEEL: {course.feel}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Action Button */}
                <div className="text-center">
                    <motion.button
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { navigate('/certifications'); window.scrollTo({ top: 0, behavior: 'instant' }); }}
                        className="bg-[#1a5d47] text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-[#124233] transition-colors relative z-20 text-lg"
                    >
                        Explore More Courses
                    </motion.button>
                </div>

            </div>
        </section>
    );
};

export default CertificationCoursesSection;
