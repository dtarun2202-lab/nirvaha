import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/meditation-poses.css';

interface MeditationPose {
  id: number;
  name: string;
  image: string;
  description: string;
}

const meditationPoses: MeditationPose[] = [
  {
    id: 1,
    name: "Lotus Pose",
    image: "🧘‍♀️",
    description: "Classic seated meditation position for focus"
  },
  {
    id: 2,
    name: "Mountain Pose",
    image: "🏔️", 
    description: "Standing meditation for grounding and stability"
  },
  {
    id: 3,
    name: "Child's Pose",
    image: "🙏",
    description: "Restorative position for relaxation"
  },
  {
    id: 4,
    name: "Easy Pose",
    image: "🧘‍♂️",
    description: "Comfortable seated position for beginners"
  },
  {
    id: 5,
    name: "Kneeling Pose",
    image: "⚡",
    description: "Upright kneeling for better posture"
  },
  {
    id: 6,
    name: "Relaxation Pose",
    image: "😌",
    description: "Lying position for deep relaxation"
  },
  {
    id: 7,
    name: "Half Lotus",
    image: "🪷",
    description: "Modified lotus for comfort"
  },
  {
    id: 8,
    name: "Sitting Pose",
    image: "🕯️",
    description: "Simple sitting meditation position"
  }
];

const MeditationPosesCircle: React.FC = () => {
  const [dimensions, setDimensions] = useState({
    radius: 180,
    centerSize: 120
  });
  const [selectedPose, setSelectedPose] = useState<MeditationPose | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      const isMobile = window.innerWidth < 768;
      setDimensions({
        radius: isMobile ? 130 : 170, // Reduced radius to keep cards closer
        centerSize: isMobile ? 100 : 140
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { radius, centerSize } = dimensions;

  return (
    <section className="relative min-h-screen overflow-hidden">
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
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-green-800/30 to-emerald-900/40" />
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 z-10">
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 md:w-2 md:h-2 bg-green-300/60 rounded-full float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              x: [-5, 5, -5],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-20 py-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4 drop-shadow-lg">
            Meditation Poses
          </h2>
          <p className="text-lg text-green-100 max-w-2xl mx-auto drop-shadow-md">
            Discover effective postures that promote relaxation, focus, and mental well-being
          </p>
        </motion.div>

        {/* Circular Layout Container */}
        <div className="relative flex items-center justify-center min-h-[600px] md:min-h-[700px] meditation-circle-container">
          {/* Glowing Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-80 h-80 md:w-96 md:h-96 border border-green-300/60 rounded-full pulse-ring"
              animate={{ rotate: 360 }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute w-64 h-64 md:w-80 md:h-80 border border-emerald-300/50 rounded-full pulse-ring"
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute w-48 h-48 md:w-64 md:h-64 border border-green-200/40 rounded-full pulse-ring"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Center Meditation Icon */}
          <motion.div
            className="relative z-10 flex items-center justify-center breathe-animation"
          >
            <div 
              className="bg-gradient-to-br from-green-50 via-green-100 to-green-200 rounded-full meditation-glow flex items-center justify-center border-4 border-green-200/80 shadow-2xl"
              style={{ width: `${centerSize}px`, height: `${centerSize}px` }}
            >
              {/* Meditation Icon */}
              <motion.div
                className="text-5xl md:text-7xl text-green-800"
                animate={{
                  rotate: [0, 3, -3, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🧘‍♀️
              </motion.div>
            </div>
            
            {/* Center Glow Effect */}
            <div className="absolute inset-0 bg-gradient-radial from-green-400/40 via-emerald-300/30 to-transparent rounded-full blur-2xl" />
          </motion.div>

          {/* Rotating Pose Cards */}
          <div className="absolute inset-0 flex items-center justify-center">
            {meditationPoses.map((pose, index) => {
              const angle = (index * 360) / meditationPoses.length;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;

              return (
                <motion.div
                  key={pose.id}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: [
                      Math.cos(((angle + 0) * Math.PI) / 180) * radius,
                      Math.cos(((angle + 90) * Math.PI) / 180) * radius,
                      Math.cos(((angle + 180) * Math.PI) / 180) * radius,
                      Math.cos(((angle + 270) * Math.PI) / 180) * radius,
                      Math.cos(((angle + 360) * Math.PI) / 180) * radius,
                    ],
                    y: [
                      Math.sin(((angle + 0) * Math.PI) / 180) * radius,
                      Math.sin(((angle + 90) * Math.PI) / 180) * radius,
                      Math.sin(((angle + 180) * Math.PI) / 180) * radius,
                      Math.sin(((angle + 270) * Math.PI) / 180) * radius,
                      Math.sin(((angle + 360) * Math.PI) / 180) * radius,
                    ],
                  }}
                  transition={{
                    duration: 120,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                    <motion.div
                      className="group cursor-pointer"
                      style={{ transform: 'translate(-50%, -50%)' }}
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPose(pose)}
                      animate={{
                        y: [0, -8, 0],
                      }}
                      transition={{
                        y: {
                          duration: 3 + index * 0.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                        hover: { duration: 0.3 },
                      }}
                    >
                      {/* Card */}
                      <div className="w-28 h-28 md:w-36 md:h-36 bg-green-100/80 backdrop-blur-md rounded-full meditation-card border-2 border-green-300/70 flex flex-col items-center justify-center p-3 shadow-xl">
                        {/* Pose Icon */}
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-50 via-green-100 to-green-200 rounded-full flex items-center justify-center mb-1 shadow-inner">
                          <span className="text-3xl md:text-5xl">
                            {pose.image}
                          </span>
                        </div>
                      </div>
                      
                      {/* Floating Label */}
                      <motion.div
                        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                      >
                        <div className="bg-green-100/90 backdrop-blur-md px-3 py-1 rounded-full shadow-lg border border-green-300/60">
                          <p className="text-xs font-medium text-green-800 whitespace-nowrap">
                            {pose.name}
                          </p>
                        </div>
                      </motion.div>

                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-radial from-green-300/20 via-transparent to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                    </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-green-100 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Each pose represents a pathway to better mental health. Allow the gentle movement 
            to guide your focus as you explore these positions that have been 
            proven effective for cultivating inner peace and reducing stress.
          </p>
        </motion.div>
      </div>

      {/* Selected Pose Modal */}
      {selectedPose && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPose(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-green-100/90 backdrop-blur-md rounded-2xl p-8 max-w-md w-full shadow-2xl border border-green-300/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">{selectedPose.image}</div>
              <h3 className="text-2xl font-light text-green-800 mb-2">
                {selectedPose.name}
              </h3>
              <p className="text-green-700 mb-6">
                {selectedPose.description}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPose(null)}
                className="px-6 py-2 bg-gradient-to-r from-green-300 to-green-400 text-green-800 rounded-full font-medium hover:shadow-lg transition-all duration-300"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default MeditationPosesCircle;
