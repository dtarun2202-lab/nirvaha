import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import SplitDoorAnimation from './SplitDoorAnimation';
import { useAuth } from '../../contexts/AuthContext';

const GoldenShowcase: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isRevealed, setIsRevealed] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slideData = [
    {
      image: "/image 01.png",
      title: "About Us",
      subtitle: "Ancient Wisdom, Modern Science",
      desc: "Nirvaha is more than a platform—it's a sanctuary where timeless spiritual practices meet modern tools to find your inner balance.",
      btn: "Read Our Stories",
      route: "/stories"
    },
    {
      image: "/image 02.png",
      title: "Our Vision",
      subtitle: "Neuroscience Meets Spirit",
      desc: "We leverage cutting-edge tech to quantify spiritual growth, making the intangible measurable for modern seekers.",
      btn: "Explore Tech",
      route: "/certifications"
    },
    {
      image: "/image 03.png",
      subtitle: "Personalized AI Guidance",
      title: "AI Guide",
      desc: "Experience the convergence of technology and tranquility with an AI guide that learns and grows with your spirit.",
      btn: "Meet Your Guide",
      route: "/dashboard/chatbot"
    },
    {
      image: "/image 04.png",
      title: "Harmony",
      subtitle: "A Sanctuary for the Soul",
      desc: "Find your center in a chaotic world. Our guided sessions are designed to align your mind, body, and breath.",
      btn: "Start Healing",
      route: "/dashboard/meditation"
    },
    {
      image: "/image 05.png",
      title: "Growth",
      subtitle: "The Power of Together",
      desc: "Join a global circle of seekers and healers. Together, we create a resonance that heals the world.",
      btn: "Join the Circle",
      route: "/dashboard/community"
    }
  ];

  useEffect(() => {
    if (!isRevealed) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideData.length);
    }, 3000); // 3 seconds per slide
    return () => clearInterval(timer);
  }, [isRevealed, slideData.length]);

  return (
    <section 
      onClick={() => !isRevealed && setIsRevealed(true)}
      className={`relative w-full overflow-hidden bg-gradient-to-b from-[#eaf5ef] to-[#d0ebd9] flex items-center justify-center min-h-[80vh] py-20 px-4 transition-colors ${!isRevealed ? 'cursor-pointer' : ''}`}
    >
      {/* Gentle Floating Particles (Background) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-white/40 blur-[2px]"
            style={{
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -100],
              x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>

      <SplitDoorAnimation isOpen={isRevealed} onDoorOpen={() => setIsRevealed(true)} />

      {/* Main Content Layout */}
      <div className="relative z-20 w-full h-full max-w-[1700px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 min-h-[80vh] py-12 px-6 lg:px-16">
        
        {/* Left Side: Image Slideshow */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ 
            opacity: isRevealed ? 1 : 0, 
            x: isRevealed ? 0 : -50,
            pointerEvents: isRevealed ? "auto" : "none"
          }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 1.5 }}
          className="flex-1 w-full lg:w-1/2 aspect-[4/3] lg:aspect-video rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative border-4 border-white/80"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide}
              src={slideData[currentSlide].image}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          
          {/* Elegant Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#1a442f]/20 via-transparent to-transparent pointer-events-none" />
          
          {/* Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-30">
            {slideData.map((_, idx) => (
              <motion.div 
                key={idx}
                animate={{ 
                  width: idx === currentSlide ? 32 : 8,
                  backgroundColor: idx === currentSlide ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.4)"
                }}
                className="h-2 rounded-full transition-all duration-500"
              />
            ))}
          </div>
        </motion.div>

        {/* Right Side: Dynamic Content */}
        <div className="flex-1 flex flex-col items-center text-center max-w-2xl px-4 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20, filter: "blur(5px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -20, filter: "blur(5px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <h2 
                className="text-6xl sm:text-7xl lg:text-8xl font-black text-[#1a442f] mb-6 tracking-tighter leading-none drop-shadow-sm" 
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {slideData[currentSlide].title}
              </h2>
              <div className="w-40 h-2 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)] mb-10" />

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-emerald-700 mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {slideData[currentSlide].subtitle}
              </h3>
              <p className="text-lg sm:text-xl lg:text-2xl text-[#2a5940]/80 leading-relaxed mb-16 italic font-light" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {slideData[currentSlide].desc}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const targetRoute = slideData[currentSlide].route;
                  
                  // Check if this route requires protection (most of these do, like dashboard)
                  // For safety, we can just protect all of them since the user requested these specific buttons.
                  if (!user && targetRoute.startsWith('/dashboard')) {
                    sessionStorage.setItem("redirectUrl", targetRoute);
                    navigate("/login");
                  } else {
                    navigate(targetRoute);
                  }
                }}
                className="group relative px-12 py-5 rounded-full bg-[#1a442f] text-white font-black text-2xl overflow-hidden border border-[#23583e] transition-all duration-500 shadow-2xl hover:shadow-[0_20px_40px_rgba(26,68,47,0.4)] hover:-translate-y-1"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <span className="relative z-10 transition-colors group-hover:text-white">{slideData[currentSlide].btn}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default GoldenShowcase;


