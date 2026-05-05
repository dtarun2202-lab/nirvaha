import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface SlideData {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  accentColor: string;
}

const slides: SlideData[] = [
  {
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000",
    title: "Ancient Wisdom",
    description: "Discover the timeless practices of mindfulness and meditation passed down through generations.",
    buttonText: "Explore",
    accentColor: "#1a5d47"
  },
  {
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1000",
    title: "Modern Science",
    description: "Our platform integrates cutting-edge neuroscientific research with traditional spiritual methods.",
    buttonText: "Learn",
    accentColor: "#0f766e"
  },
  {
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&q=80&w=1000",
    title: "Inner Harmony",
    description: "Achieve complete holistic healing by aligning your mind, body, and spirit in the modern age.",
    buttonText: "Begin",
    accentColor: "#047857"
  }
];

const ResponsiveImageSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + slides.length) % slides.length);
  };

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 8000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const activeSlide = slides[currentIndex];

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-12 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Image Side */}
        <div className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/3] sm:aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/50 backdrop-blur-sm">
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={currentIndex}
                src={activeSlide.image}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5 }
                }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Circular Button at Center of Image */}
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <motion.button
                key={`btn-${currentIndex}`}
                initial={{ scale: 0, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.4, 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20 
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="pointer-events-auto w-24 h-24 sm:w-32 sm:h-32 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.4)] flex items-center justify-center text-white font-bold uppercase tracking-widest text-xs sm:text-sm border-2 border-white/30 backdrop-blur-md overflow-hidden group"
                style={{ backgroundColor: activeSlide.accentColor }}
              >
                <span className="relative z-10">{activeSlide.buttonText}</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </motion.button>
            </div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Navigation Controls */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(-1)}
              className="p-4 bg-white shadow-xl rounded-2xl text-emerald-900 hover:text-emerald-600 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <div className="flex gap-2">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex ? "w-8 bg-emerald-600" : "w-2 bg-emerald-200"
                  }`}
                />
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(1)}
              className="p-4 bg-white shadow-xl rounded-2xl text-emerald-900 hover:text-emerald-600 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Content Side */}
        <div className="order-1 lg:order-2 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 text-emerald-700 font-bold tracking-[0.3em] uppercase text-xs sm:text-sm">
                <Sparkles className="w-5 h-5" />
                <span>Nirvaha Journey</span>
              </div>
              
              <h2 
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 leading-[1.1]" 
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {activeSlide.title}
              </h2>
              
              <div className="w-20 h-1.5 rounded-full" style={{ backgroundColor: activeSlide.accentColor }} />
              
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light max-w-lg">
                {activeSlide.description}
              </p>

              <div className="pt-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  className="h-[1px] bg-slate-200"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default ResponsiveImageSlider;
