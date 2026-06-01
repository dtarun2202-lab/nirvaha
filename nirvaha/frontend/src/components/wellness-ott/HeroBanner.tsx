import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Zap, Info, Volume2, VolumeX, X, Music, Brain, Heart, Sparkles, Clock } from 'lucide-react';
import { WellnessSession } from '../../data/wellnessSessions';

// Detailed scientific theory & sound frequencies data for wellness session categories
const sessionTheory: Record<string, { theory: string; soundInfo: string; benefits: string[]; technique: string }> = {
  'Meditation': {
    theory: 'Meditation practice cultivates mindfulness by restructuring neural connectivity, specifically reducing activity in the Default Mode Network (DMN) associated with rumination, while thickening the prefrontal cortex to improve focus and emotional balance.',
    soundInfo: 'Entrained with 10Hz Alpha binaural beats and 432Hz ambient harmonic drones. This combination synchronizes brain hemisphere activity, encouraging a relaxed yet alert state perfect for mental rejuvenation.',
    benefits: ['Lowers cortisol production', 'Reduces active neural chatter', 'Enhances emotional balance'],
    technique: 'Breath anchoring & sound wave synchronization'
  },
  'Sleep Stories': {
    theory: 'Sleep stories utilize passive auditory processing to guide the brain from beta alertness down into delta wave sleep. By focusing on a slow, descriptive narrative, the cognitive load is reduced, bypassing insomnia-inducing anxiety loops.',
    soundInfo: 'Engineered with slow-decay delta frequencies (1.5Hz to 3Hz) beneath a rich, low-frequency vocal mix. Layered pink noise simulating rainfall masks ambient sound fluctuations to prevent sleep disruption.',
    benefits: ['Shortens sleep latency', 'Deepens restorative slow-wave sleep', 'Promotes autonomic nervous system reset'],
    technique: 'Continuous low-frequency acoustic pacing'
  },
  'Anxiety Relief': {
    theory: 'Anxiety states result from amygdala hyper-reactivity. Somatic and vagal nerve activation techniques are used to trigger the parasympathetic nervous system, signaling safety directly to the heart and viscera.',
    soundInfo: 'Anchored by 528Hz Solfeggio soundscapes, traditionally called the frequency of cellular transformation, mixed with a steady 60 BPM human heartbeat simulator to naturally slow user pulse through entrainment.',
    benefits: ['Deactivates sympathetic response', 'Lowers elevated heart rate', 'Stabilizes shallow respiration'],
    technique: 'Heartbeat synchronization & acoustic grounding'
  },
  'Focus Training': {
    theory: 'Flow state occurs during transient hypofrontality, where the analytical brain shuts down for pure concentration. Auditory cues train attention networks to block external sensory distractions.',
    soundInfo: 'Features 14-20Hz Beta wave isochronic tones layered with brown noise. Periodic 40Hz Gamma bursts stimulate neurotransmitter release associated with mental sharpness and high-level comprehension.',
    benefits: ['Extends attention span', 'Filters ambient auditory distractions', 'Accelerates cognitive processing speed'],
    technique: 'Isochronic beta wave entrainment'
  },
  'Spiritual Guidance': {
    theory: 'Energetic centers correlate directly with major physiological nerve plexuses along the spinal column. Stimulating these areas through harmonic tuning balances endocrine activity and local bio-magnetic field emissions.',
    soundInfo: 'Precisely calibrated Solfeggio frequencies ranging from 396Hz (Root stabilization) to 852Hz (Intuitive awareness). The pure sine waves correspond to chakra resonances, promoting block removal.',
    benefits: ['Re-establishes bio-energetic balance', 'Relieves localized physical tension', 'Harmonizes endocrine system output'],
    technique: 'Multi-frequency Solfeggio vibrational alignment'
  },
  'Breathwork': {
    theory: 'Rhythmic breath modification directly controls carbon dioxide levels in the bloodstream, altering blood pH and triggering immediate shifts in autonomic nervous system tone (parasympathetic dominance).',
    soundInfo: 'Acoustic guiding clicks and pacing guides set at a 4-4-4-4 rhythm. Ambient tones swell on inhalation and dissolve on exhalation, creating an intuitive spatial audio guide.',
    benefits: ['Optimizes cellular oxygenation', 'Improves heart rate variability (HRV)', 'Systematically reduces physical stress'],
    technique: 'Vagal-toning ratio breathwork guides'
  },
  'Inner Peace': {
    theory: 'Equanimity training involves observing sensory experiences without reaction. By using acoustic pillars as a neutral observation focus, the mind practices detachment from emotional triggers.',
    soundInfo: 'Calming 639Hz Solfeggio tones promoting connection and balance. Combined with spatial forest recordings and wind instruments that evoke spaciousness and psychological tranquility.',
    benefits: ['Reduces reactivity to stressors', 'Fosters self-acceptance', 'Creates baseline emotional stability'],
    technique: 'Auditory spaciousness meditation'
  },
  'Emotional Healing': {
    theory: 'Emotional burnout results in adrenal exhaustion. Direct somatosensory healing requires steady, safe soundscapes that do not trigger alarm responses, allowing the central nervous system to recharge.',
    soundInfo: 'Tuned to 174Hz (the natural anesthetic sound frequency) to alleviate somatic stress, paired with minimal synthesizer pads that swell slowly over 10-second intervals to encourage deep respiration.',
    benefits: ['Rebuilds nervous system reserves', 'Releases micro-tensions in muscles', 'Soothes chronic fight-or-flight strain'],
    technique: 'Somatic frequency relaxation'
  },
  'Yoga Programs': {
    theory: 'Movement-synchronized breathing links motor-cortex pathways to autonomous relaxation systems. Synchronizing action to auditory patterns stabilizes heart rate and optimizes coordination.',
    soundInfo: 'Immersive tanpura drones (C# resonance) combined with slow tempo sitar compositions. The harmonic resonance aligns movement transitions and keeps concentration internal.',
    benefits: ['Lowers physical muscle tension', 'Enhances physical mindfulness', 'Supports fluid movement patterns'],
    technique: 'Drone-led movement coordination'
  }
};

const defaultTheory = {
  theory: 'This session uses advanced somatic and mindfulness principles to help reset your mind-body state, utilizing neuro-acoustic stimulation to lower stress and restore internal homeostasis.',
  soundInfo: 'Features calibrated ambient frequencies and wave-pacing audio patterns engineered to guide brainwave states and encourage physical restoration.',
  benefits: ['Fosters mind-body connection', 'Promotes somatic relaxation', 'Helps quiet mental noise'],
  technique: 'Guided acoustic sensory integration'
};

interface HeroBannerProps {
  series: WellnessSession;
}

export default function HeroBanner({ series }: HeroBannerProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const firstEpisode = series.seasons?.[0]?.episodes?.[0];
  const theory = sessionTheory[series.category] || defaultTheory;

  useEffect(() => {
    // Reset video state when series changes
    setShowVideo(false);
    
    // Autoplay video preview after 1.5 seconds delay
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [series.id]);

  const handlePlay = () => {
    navigate(`/wellness-ott/series/${series.id}`);
  };

  const handleViewSeries = () => {
    setShowMoreInfo(true);
  };

  return (
    <div
      className="relative w-full h-screen md:h-[80vh] lg:h-screen overflow-hidden bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image / Autoplay Video Preview */}
      <div className="absolute inset-0 w-full h-full">
        {/* Background Image with parallax effect */}
        <motion.div
          className="absolute inset-0 w-full h-full z-0"
          animate={{
            scale: isHovered ? 1.03 : 1,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <img
            src={series.banner}
            alt={series.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Video Preview */}
        <AnimatePresence>
          {showVideo && (
            <motion.video
              ref={videoRef}
              key={series.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full object-cover z-10"
              src="/hero_cinematic.mp4"
              autoPlay
              loop
              muted={isMuted}
              playsInline
            />
          )}
        </AnimatePresence>
      </div>

      {/* Dark gradient overlays for readability and premium feel */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20" />
      
      {/* Radial glow effect */}
      <div className="absolute inset-0 bg-radial-gradient from-[#2ed899]/5 to-transparent z-20" />

      {/* Content */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-center items-start z-30 p-6 md:p-12 lg:p-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            className="flex items-center gap-2 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {series.isOriginal && (
              <span className="inline-flex items-center gap-2 bg-[#2ed899]/10 border border-[#2ed899]/30 rounded-full px-4 py-2 text-xs font-black tracking-widest uppercase text-[#2ed899] shadow-[0_0_15px_rgba(46,216,153,0.2)]">
                <Zap className="w-4 h-4 fill-current" />
                Nirvaha Original
              </span>
            )}
            <span className="text-xs font-black tracking-widest uppercase text-white/70 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              {series.category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {series.title}
          </motion.h1>

          {/* Metadata */}
          <motion.div
            className="flex flex-wrap items-center gap-4 mb-6 text-sm md:text-base font-semibold text-white/90"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <span className="text-[#2ed899] font-black">{series.match}</span>
            <span className="text-white/60">•</span>
            <span className="text-white/60">{series.year}</span>
            <span className="text-white/60">•</span>
            <span className="border border-white/30 px-2 py-0.5 rounded text-[10px] font-black text-white bg-black/20">
              {series.rating}
            </span>
            {series.seasons && series.seasons.length > 0 && (
              <>
                <span className="text-white/60">•</span>
                <span className="text-[#2ed899] font-bold">
                  {series.seasons.length} {series.seasons.length === 1 ? 'Season' : 'Seasons'}
                </span>
              </>
            )}
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-base md:text-lg text-white/70 mb-12 max-w-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
            style={{ lineHeight: '1.9' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {series.description}
          </motion.p>

          {/* Mood Tags */}
          {series.mood && series.mood.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-2 mb-16"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {series.mood.map(tag => (
                <span
                  key={tag}
                  className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:border-[#2ed899]/50 hover:text-[#2ed899]/90 hover:bg-white/10 transition-all cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col md:flex-row gap-4 items-start md:items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {/* Play Button */}
            <button
              onClick={handlePlay}
              className="group relative px-8 md:px-10 py-3.5 md:py-4 bg-white text-black hover:bg-[#2ed899] font-black text-sm uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(46,216,153,0.5)] hover:scale-105 flex items-center gap-3"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
              <span>Play Session</span>
            </button>

            {/* More Info Button */}
            <button
              onClick={handleViewSeries}
              className="px-8 md:px-10 py-3.5 md:py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all duration-300 backdrop-blur-md flex items-center gap-3"
            >
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Mute/Unmute Controls */}
      {showVideo && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="absolute bottom-24 right-6 md:right-12 lg:right-16 z-40 p-3 rounded-full border border-white/30 bg-black/40 hover:bg-black/60 text-white hover:border-white transition-all backdrop-blur-md"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </motion.button>
      )}

      {/* Floating elements for cinematic feel */}
      <motion.div
        className="absolute top-20 right-10 w-40 h-40 bg-[#2ed899]/10 rounded-full blur-3xl opacity-20 pointer-events-none"
        animate={{
          y: isHovered ? -20 : 0,
          x: isHovered ? 20 : 0,
        }}
        transition={{ duration: 0.6 }}
      />
      <motion.div
        className="absolute bottom-20 left-1/4 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl opacity-10 pointer-events-none"
        animate={{
          y: isHovered ? 30 : 0,
          x: isHovered ? -30 : 0,
        }}
        transition={{ duration: 0.8 }}
      />

      {/* More Info Modal Overlay - Theory & Sounds */}
      <AnimatePresence>
        {showMoreInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setShowMoreInfo(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-gradient-to-b from-[#111c16] to-[#0a0f0d] border border-[#2ed899]/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowMoreInfo(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title Section */}
              <div className="mb-6">
                <span className="text-xs font-bold tracking-widest uppercase text-[#2ed899] bg-[#2ed899]/10 border border-[#2ed899]/30 rounded-full px-3.5 py-1.5 inline-block mb-3">
                  {series.category}
                </span>
                <h2 className="text-3xl font-black text-white" style={{ fontFamily: "'Cinzel', serif" }}>
                  {series.title}
                </h2>
              </div>

              <div className="space-y-6">
                {/* Session Theory */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Brain className="w-5 h-5 text-[#2ed899]" />
                    <h3 className="text-base font-black uppercase tracking-wider text-white">Scientific Theory</h3>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {theory.theory}
                  </p>
                </div>

                {/* Sound & Frequencies */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Music className="w-5 h-5 text-[#2ed899]" />
                    <h3 className="text-base font-black uppercase tracking-wider text-white">Sound Properties & Frequencies</h3>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {theory.soundInfo}
                  </p>
                </div>

                {/* Technique Used */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-5 h-5 text-[#2ed899]" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#2ed899]">Technique Applied</h4>
                  </div>
                  <p className="text-sm font-semibold text-white/95">
                    {theory.technique}
                  </p>
                </div>

                {/* Key Benefits */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Heart className="w-5 h-5 text-[#2ed899]" />
                    <h3 className="text-base font-black uppercase tracking-wider text-white">Key Benefits</h3>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {theory.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 rounded-lg px-3.5 py-2.5 text-sm text-white/85">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2ed899]" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
