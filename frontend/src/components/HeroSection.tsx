import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { ModernOrb } from "./ModernOrb";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/leaves.mp4" type="video/mp4" />
        </video>
        {/* Light Green Overlay for Theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/80 via-emerald-50/70 to-green-200/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-100/60 via-transparent to-green-50/50" />
      </div>
      {/* Ambient Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <motion.div
          className="absolute top-1/4 -left-48 w-96 h-96 bg-green-300/30 rounded-full blur-3xl"
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
          className="absolute bottom-1/4 -right-48 w-[500px] h-[500px] bg-emerald-200/25 rounded-full blur-3xl"
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
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
        <div className="flex flex-col items-center gap-12">
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-100/80 backdrop-blur-md rounded-full border border-green-300/60 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-green-700" />
            <span className="text-sm text-green-800 font-medium tracking-wide">
              The Future of Digital Wellness
            </span>
          </motion.div>

          {/* Modern 3D Orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="relative"
          >
            <ModernOrb />
          </motion.div>

          {/* Animated Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-4"
          >
            <h1 className="relative">
              <span className="block bg-gradient-to-r from-green-800 via-emerald-700 to-green-800 bg-clip-text text-transparent drop-shadow-lg text-6xl md:text-8xl font-light">
                NIRVAHA
              </span>
              <motion.span
                className="block mt-2 text-green-700 drop-shadow-md text-2xl md:text-3xl font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
              >
                Harmony of Mind
              </motion.span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="max-w-2xl mx-auto text-green-700 text-lg md:text-xl leading-relaxed drop-shadow-sm"
          >
            Embark on a transformative journey through AI-guided meditation, sound healing, and wellness practices. Experience the perfect union of technology and mental health.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full shadow-lg overflow-hidden border border-green-500/20"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 flex items-center gap-2 font-medium">
                Begin Your Journey
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
                style={{
                  boxShadow: "0 0 25px rgba(34, 197, 94, 0.5)",
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-green-200/70 backdrop-blur-md text-green-800 rounded-full border-2 border-green-300/70 hover:border-green-400/80 transition-all shadow-md hover:shadow-lg font-medium"
            >
              Explore Features
            </motion.button>
          </motion.div>

          {/* Floating Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-12"
          >
            {[
              { value: "50K+", label: "Active Users" },
              { value: "1M+", label: "Meditations" },
              { value: "4.9★", label: "User Rating" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center gap-1 px-6 py-3 bg-green-100/75 backdrop-blur-md rounded-2xl border border-green-300/50 shadow-lg"
              >
                <span className="bg-gradient-to-r from-green-700 to-green-800 bg-clip-text text-transparent text-2xl font-bold">
                  {stat.value}
                </span>
                <span className="text-sm text-green-800 font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-sm text-green-700 font-medium drop-shadow-sm">Discover More</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100/80 backdrop-blur-md border border-green-300/60 shadow-lg"
        >
          <ChevronDown className="w-5 h-5 text-green-700" />
        </motion.div>
      </motion.div>

      {/* Particle Field Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400/50 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </section>
  );
}
