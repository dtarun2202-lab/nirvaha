import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Star, MapPin, Sparkles, Globe, Share2, ExternalLink, X, Award, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { pathwaysData } from '../../data/pathwaysData';
import { useLandingData } from '../../hooks/useLandingData';

const courses = [
    {
        id: "mindfulness-meditation-certification",
        title: "Mindfulness Meditation Certification",
        desc: "Learn the art and science of mindfulness meditation and become a certified instructor.",
        feel: "Calm & Focused",
        image: "/NA01.png",
        bgColor: "bg-[#f2f7ec]",
        instructor: {
            name: "Aisha Mehta",
            title: "Senior Meditation Guide",
            avatar: "https://i.pravatar.cc/150?img=32",
            bio: "Helping you find calm through guided meditation and mindfulness techniques rooted in ancient traditions.",
            experience: "12+ Years",
            certifications: "Certified MBSR Instructor, Vedic Meditation Master",
            expertise: "Mindfulness, Vipassana, Zen",
            coursesHandled: "Mindfulness Foundations, Advanced Meditation",
            rating: 4.8,
            reviewsCount: 124,
            socialLinks: "@aisha_meditates",
            website: "https://aishawellness.com"
        }
    },
    {
        id: "emotional-intelligence-mastery",
        title: "Emotional Intelligence Mastery",
        desc: "Deep dive into emotional intelligence with practical tools and certification.",
        feel: "Empowered & Aware",
        image: "/NA02.png",
        bgColor: "bg-[#fbbf24]",
        instructor: {
            name: "Arjun Verma",
            title: "Emotional Wellness Coach",
            avatar: "https://i.pravatar.cc/150?img=12",
            bio: "Navigating life's complexities with compassion and structured guidance for emotional resilience.",
            experience: "8+ Years",
            certifications: "EQ-i 2.0 Certified, Clinical Psychology Master",
            expertise: "Emotional Intelligence, CBT, NLP",
            coursesHandled: "EQ Mastery, Stress Management",
            rating: 4.9,
            reviewsCount: 210,
            socialLinks: "@arjun_eq",
            website: "https://arjunverma.com"
        }
    },
    {
        id: "holistic-wellness-coach",
        title: "Holistic Wellness Coach",
        desc: "Comprehensive training to guide others on their holistic wellness journey.",
        feel: "Balanced & Inspired",
        image: "/NA03.png",
        bgColor: "bg-[#a3b19b]",
        instructor: {
            name: "Kavya Nair",
            title: "Holistic Healing Expert",
            avatar: "https://i.pravatar.cc/150?img=44",
            bio: "Restoring balance to your mind, body, and spirit through ancient healing arts and modern nutrition.",
            experience: "10+ Years",
            certifications: "Ayurvedic Practitioner, RYT-500 Yoga Teacher",
            expertise: "Ayurveda, Yoga, Holistic Nutrition",
            coursesHandled: "Wellness Coaching, Ayurvedic Basics",
            rating: 4.7,
            reviewsCount: 95,
            socialLinks: "@kavya_healing",
            website: "https://kavyanair.com"
        }
    },
    {
        id: "spiritual-counseling-program",
        title: "Spiritual Counseling Program",
        desc: "Integrate ancient wisdom and modern psychology for spiritual counseling.",
        feel: "Connected & Uplifted",
        image: "/NA04.png",
        bgColor: "bg-[#a5b4fc]",
        instructor: {
            name: "Swami Aarav",
            title: "Spiritual Guide & Mentor",
            avatar: "https://i.pravatar.cc/150?img=53",
            bio: "Guiding seekers on the path of self-discovery and spiritual awakening through timeless wisdom.",
            experience: "20+ Years",
            certifications: "Vedanta Scholar, Spiritual Counseling PhD",
            expertise: "Vedanta, Spiritual Awakening, Inner Work",
            coursesHandled: "Spiritual Counseling, Self-Discovery",
            rating: 5.0,
            reviewsCount: 500,
            socialLinks: "@swami_aarav",
            website: "https://swamiaarav.com"
        }
    }
];

const CertificationCoursesSection: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { data: landingData } = useLandingData();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState<any | null>(null);

    const academyData = landingData?.academy;
    const displayCourses = (academyData?.courses && academyData.courses.length > 0) ? academyData.courses : courses;

    const handleExploreClick = () => {
        if (!user) {
            sessionStorage.setItem("redirectUrl", "/pathways");
            navigate('/login');
            return;
        }
        setIsTransitioning(true);
        setTimeout(() => {
            navigate('/pathways');
        }, 800);
    };

    return (
        <section className="py-24 relative overflow-hidden bg-[#fafafa]">
            {/* Background Decorative Shapes */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <svg className="absolute -top-12 -right-12 w-48 h-48 text-[#1a5d47] opacity-[0.03]" viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="50" cy="50" r="45" />
                </svg>
                <svg className="absolute top-1/2 -right-8 w-24 h-24 text-[#1a5d47] opacity-[0.03] rotate-45" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="10" y="10" width="80" height="80" rx="10" />
                </svg>
                <svg className="absolute bottom-10 left-10 w-32 h-32 text-[#1a5d47] opacity-[0.03]" viewBox="0 0 100 100" fill="currentColor">
                    <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
                </svg>
                <svg className="absolute -bottom-8 -left-8 w-40 h-40 text-[#1a5d47] opacity-[0.02]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="50" cy="50" r="45" />
                    <circle cx="50" cy="50" r="30" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-4xl md:text-5xl font-bold text-[#0F131A] mb-6 tracking-tight uppercase"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        {academyData?.title || "Nirvaha Academy Certification Pathways"}
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-[#595e67] text-lg max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        {academyData?.subtitle || "Unlock your potential with our expert-led, accredited programs designed for personal and professional growth."}
                    </motion.p>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
                    {courses.map((course, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                            whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                            onClick={() => {
                                if (!user) {
                                    navigate('/login');
                                } else {
                                    navigate(`/pathways/${course.id}`);
                                }
                            }}
                            className={`flex flex-col sm:flex-row rounded-2xl overflow-hidden shadow-lg border border-white/20 transition-all duration-300 cursor-pointer ${course.bgColor}`}
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
                                <h3 className="text-xl md:text-2xl font-bold text-[#0F131A] mb-3 leading-snug">
                                    {course.title}
                                </h3>
                                <p className="text-[#0F131A]/70 text-sm md:text-base leading-relaxed mb-6 font-medium">
                                    {course.desc}
                                </p>
                                <div className="mt-auto inline-flex items-center gap-2 bg-black/10 backdrop-blur-sm px-4 py-2 rounded-full w-fit">
                                    <Clock className="w-4 h-4 text-[#0F131A]/80" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#0F131A]/80">
                                        PATHWAY FEEL: {course.feel}
                                    </span>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedInstructor(course.instructor);
                                    }}
                                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0F131A] hover:text-[#1a5d47] transition-colors border-b border-[#0F131A]/20 pb-1 w-fit"
                                >
                                    <Star className="w-4 h-4 fill-[#1a5d47]/20" />
                                    View Instructor Profile
                                </motion.button>
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
                        onClick={handleExploreClick}
                        className="bg-[#2c3136] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-black transition-colors relative z-20"
                    >
                        {academyData?.exploreButtonText || "Explore More Pathways"}
                    </motion.button>
                </div>

            </div>

            {/* Instructor Profile Modal */}
            <AnimatePresence>
                {selectedInstructor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedInstructor(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[32px] max-w-2xl w-full overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative h-32 bg-gradient-to-r from-[#1a5d47] to-[#2d6a4f]">
                                <button 
                                    onClick={() => setSelectedInstructor(null)}
                                    className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="px-8 pb-10 -mt-16">
                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="relative shrink-0">
                                        <div className="absolute inset-0 bg-emerald-100 rounded-2xl rotate-6" />
                                        <img 
                                            src={selectedInstructor.avatar} 
                                            alt={selectedInstructor.name}
                                            className="relative w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                                        />
                                    </div>
                                    
                                    <div className="flex-1 pt-16 md:pt-0">
                                        <h2 className="text-3xl font-black text-[#0F131A] mb-1">
                                            {selectedInstructor.name}
                                        </h2>
                                        <p className="text-[#1a5d47] font-bold mb-6 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4" />
                                            {selectedInstructor.title}
                                        </p>
                                        
                                        <div className="flex flex-wrap items-center gap-6 text-sm mb-8">
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-100">
                                                <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                                                <span className="text-[#0F131A] font-black">
                                                    {selectedInstructor.rating}
                                                </span>
                                                <span className="text-[#0F131A]/60 font-medium">
                                                    ({selectedInstructor.reviewsCount} reviews)
                                                </span>
                                            </div>
                                            {selectedInstructor.experience && (
                                                <div className="flex items-center gap-2 text-[#0F131A]/70 font-bold">
                                                    <Award className="w-4 h-4 text-emerald-500" />
                                                    {selectedInstructor.experience} Experience
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="text-xs font-black text-[#0F131A]/40 uppercase tracking-[0.2em] mb-2">EXPERIENCE</h4>
                                                    <p className="text-sm text-[#0F131A]/80 font-medium">{selectedInstructor.experience || "Not specified"}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-black text-[#0F131A]/40 uppercase tracking-[0.2em] mb-2">CERTIFICATIONS</h4>
                                                    <p className="text-sm text-[#0F131A]/80 font-medium">{selectedInstructor.certifications || "Not specified"}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black text-[#0F131A]/40 uppercase tracking-[0.2em] mb-2">COURSES HANDLED</h4>
                                                <p className="text-sm text-[#0F131A]/80 font-medium">{selectedInstructor.coursesHandled || "All foundational wellness programs"}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="text-xs font-black text-[#0F131A]/40 uppercase tracking-[0.2em] mb-2">SPECIALTIES</h4>
                                                    <p className="text-sm text-[#0F131A]/80 font-medium">{selectedInstructor.expertise || "Holistic Wellness"}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-black text-[#0F131A]/40 uppercase tracking-[0.2em] mb-2">LANGUAGES</h4>
                                                    <p className="text-sm text-[#0F131A]/80 font-medium">English, Hindi, Sanskrit</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-emerald-100 flex flex-wrap gap-6">
                                            {selectedInstructor.website && (
                                                <a href={selectedInstructor.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-[#1a5d47] hover:underline">
                                                    <Globe className="w-4 h-4" /> Professional Site
                                                </a>
                                            )}
                                            {selectedInstructor.socialLinks && (
                                                <div className="flex items-center gap-2 text-sm font-bold text-[#1a5d47]">
                                                    <Share2 className="w-4 h-4" /> {selectedInstructor.socialLinks}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cinematic Portal Transition */}
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="fixed inset-0 z-[100] bg-[#0a0a0a]/90 flex flex-col items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="w-32 h-32 rounded-full bg-emerald-500/20 mix-blend-screen filter blur-[40px] animate-pulse"
                        ></motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-white text-3xl font-serif mt-8"
                        >
                            Entering Pathways...
                        </motion.h2>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default CertificationCoursesSection;
