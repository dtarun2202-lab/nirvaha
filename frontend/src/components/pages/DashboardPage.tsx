import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import heroBg from "../../assets/meditation/hero-bg1.jpg";
import heroBg1 from "../../assets/meditation/hero-bg.jpg";
import heroBg2 from "../../assets/meditation/hero-bg2.jpg";

import { FeaturesBentoGrid } from "../dashboard/FeaturesBentoGrid";
import { CommonProblems } from "../dashboard/CommonProblems";

import { TrustedNetwork } from "../dashboard/TrustedNetwork";
import { WellnessOTT } from "../dashboard/WellnessOTT";
import { GamingHubSection } from "../GamingHubSection";
import { ChakraSection } from "../dashboard/ChakraSection";
import { InspirationalQuotes } from "../dashboard/InspirationalQuotes";
import { CaseStudies } from "../dashboard/CaseStudies";
import { FAQSection } from "../dashboard/FAQSection";
import { DashboardFooter } from "../dashboard/DashboardFooter";

export function DashboardPage() {
  const location = useLocation();

  const [phraseIndex, setPhraseIndex] = useState(0);
  const phrases = ["center", "peace", "solution", "reason", "solution", "peace"];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get("scrollTo");
    if (scrollTo) {
      const timer = setTimeout(() => {
        const element = document.getElementById(scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.search]);

  return (
    <div className="w-full overflow-x-hidden bg-[#EEF6F2]">
      {/* Inline styles for background animations */}
      <style>
        {`
          @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spinReverseSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
          }
          @keyframes floatGentle {
            from { transform: translateY(0px); }
            to { transform: translateY(-18px); }
          }
          .animate-spin-slow {
            animation: spinSlow 30s linear infinite;
          }
          .animate-spin-reverse-slow {
            animation: spinReverseSlow 20s linear infinite;
          }
          .animate-float-gentle {
            animation: floatGentle 6s ease-in-out infinite alternate;
          }
          .animate-float-gentle-delay-1 {
            animation: floatGentle 6s ease-in-out 2s infinite alternate;
          }
          .animate-float-gentle-delay-2 {
            animation: floatGentle 6s ease-in-out 4s infinite alternate;
          }
        `}
      </style>

      {/* HERO SECTION */}
      <section className="min-h-screen overflow-hidden bg-[#FAFAF8] flex flex-col items-center justify-center gap-[24px] p-0 relative">
        
        {/* BACKGROUND DECORATIONS (z-0) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Large Centered Mandala Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.15] animate-spin-slow">
            <svg width="800" height="800" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {Array.from({ length: 12 }).map((_, i) => (
                <path
                  key={i}
                  d="M100 20C120 40 140 70 100 100C60 70 80 40 100 20Z"
                  fill="#7A9384"
                  transform={`rotate(${i * 30} 100 100)`}
                />
              ))}
              <circle cx="100" cy="100" r="70" stroke="#7A9384" strokeWidth="2" fill="none" />
              <circle cx="100" cy="100" r="50" stroke="#7A9384" strokeWidth="1" strokeDasharray="4 4" fill="none" />
            </svg>
          </div>

          {/* Smaller Top-Right Mandala Ring */}
          <div className="absolute -top-32 -right-32 opacity-[0.10] animate-spin-reverse-slow">
            <svg width="500" height="500" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {Array.from({ length: 8 }).map((_, i) => (
                <path
                  key={i}
                  d="M100 30C115 50 130 75 100 100C70 75 85 50 100 30Z"
                  stroke="#7A9384"
                  strokeWidth="1.5"
                  fill="none"
                  transform={`rotate(${i * 45} 100 100)`}
                />
              ))}
              <circle cx="100" cy="100" r="60" stroke="#7A9384" strokeWidth="1" fill="none" />
            </svg>
          </div>

          {/* Floating Petal 1 */}
          <div className="absolute top-[20%] left-[15%] opacity-[0.15] animate-float-gentle">
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 10C75 40 85 70 50 90C15 70 25 40 50 10Z" fill="#7A9384" transform="rotate(45 50 50)" />
            </svg>
          </div>

          {/* Floating Petal 2 */}
          <div className="absolute bottom-[25%] left-[20%] opacity-[0.15] animate-float-gentle-delay-1">
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 10C75 40 85 70 50 90C15 70 25 40 50 10Z" fill="#7A9384" transform="rotate(-30 50 50)" />
            </svg>
          </div>

          {/* Floating Petal 3 */}
          <div className="absolute top-[30%] right-[15%] opacity-[0.15] animate-float-gentle-delay-2">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 10C75 40 85 70 50 90C15 70 25 40 50 10Z" fill="#7A9384" transform="rotate(-15 50 50)" />
            </svg>
          </div>
        </div>

        {/* HERO CONTENT (z-10) */}
        <div className="flex flex-col items-center justify-center gap-[24px] relative z-10 w-full">
        {/* Logo Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex justify-center w-full m-0 p-0"
        >
          <img 
            src="/logo-transparent.png" 
            alt="Nirvaha Logo" 
            className="h-56 md:h-72 w-auto mx-auto"
          />
        </motion.div>

        {/* Clean Typography */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-7xl font-light text-[#5A7165] font-['Cinzel'] tracking-wide text-center flex flex-col md:flex-row items-center justify-center w-full max-w-5xl mx-auto"
        >
          <span className="whitespace-nowrap md:w-1/2 md:text-right md:pr-0 md:translate-x-12">Find your</span>
          <span className="text-[#3A5145] inline-flex justify-center md:justify-start md:w-1/2 md:pl-16 mt-2 md:mt-0">
            <AnimatePresence mode="wait">
              <motion.span
                key={phraseIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="inline-block whitespace-nowrap"
              >
                {phrases[phraseIndex]}.
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-lg md:text-xl text-[#7A9384] font-medium tracking-wide text-center max-w-xl"
        >
          Begin your journey to absolute calm and balanced living.
        </motion.p>

        {/* Single Premium CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          onClick={() => {
            const el = document.getElementById('start-practice');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-10 py-4 rounded-full bg-[#5A7165] text-[#FAFAF8] text-sm font-bold tracking-widest uppercase hover:bg-[#4A6155] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#5A7165]/20 flex items-center justify-center gap-3 group"
        >
          <span>Begin Practice</span>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="transition-transform duration-300 group-hover:translate-y-1"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </motion.button>

        </div>
        
      </section>

      {/* BELOW SECTIONS */}
      <div id="start-practice" className="bg-[#D7EDE3] py-12"></div>

      <FeaturesBentoGrid />
      <TrustedNetwork />
      <CommonProblems />

      <WellnessOTT />
      <div id="gaming-hub">
        <GamingHubSection />
      </div>
      <ChakraSection />
      <InspirationalQuotes />
      <CaseStudies />
      <FAQSection />
      <DashboardFooter />
    </div>
  );
}