import { motion } from "motion/react";
import { ChevronDown, Sparkles } from "lucide-react";
import { SpiritualOrb } from "./SpiritualOrb";
import { SacredGeometry } from "./SacredGeometry";
import heroBg from "../assets/meditation/hero.png";

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/45"></div>

      {/* Ambient Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-1/4 -right-48 w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Sacred Geometry */}
      <SacredGeometry />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Left Transparent Glass Box */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 rounded-full border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-green-300" />
              <span className="text-sm text-white tracking-wide">
                The Future of Spiritual Wellness
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              NIRVAHA
            </h1>

            <p className="mt-3 text-xl md:text-2xl text-green-200 font-medium">
              Harmony of Mind
            </p>

            {/* Subtitle */}
            <p className="mt-6 text-gray-200 text-base md:text-lg leading-relaxed max-w-xl">
              Embark on a transformative journey through AI-guided meditation,
              sacred sound healing, and ancient wisdom crafted for modern life.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-xl transition">
                Begin Your Journey
              </button>

              <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full border border-white/30 hover:bg-white/30 transition">
                Explore Features
              </button>
            </div>
          </motion.div>

          {/* Right Orb */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex justify-center"
          >
            <SpiritualOrb />
          </motion.div>

        </div>
      </div>

      {/* Scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-center">
        <p className="text-sm mb-2">Discover More</p>
        <ChevronDown className="mx-auto animate-bounce" />
      </div>
    </section>
  );
}