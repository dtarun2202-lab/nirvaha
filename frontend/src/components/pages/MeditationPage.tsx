import React ,{ useState } from "react";

const heroImage = "/meditation/first.jpg";

const balasana = "/meditation/balasana.jpeg";
const ardha = "/meditation/ArdhaMatsyendrasana.jpeg";
const butterfly = "/meditation/ButterflyPose.jpeg";
const savasana = "/corpo.jpg";
const sukhasana = "/meditation/Sukhasana.jpeg";
const virkshana = "/tree.jpg";
const vajrasana = "/thunder.webp";
const siddhasana = "/meditation/siddhasana.jpeg";
const paschimottanasana = "/meditation/Paschimottanasana.jpeg";
const padmasana = "/lotus.png";




// Main Page Component
export default function MeditationGuide() {
  return (
    <div className="font-sans text-gray-700">
      <HeroSection />
      <MeditationImages />
      <MeditationPoses />
      <EssentialGuidance />
      <ConsultSection />
      <Footer />
    </div>
  );
}

// Hero Section
const HeroSection: React.FC = () => (
  <section className="relative h-screen min-h-[600px] overflow-hidden">
  <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
    <source src="/leaves.mp4" type="video/mp4" />
  </video>
  <div className="absolute inset-0 bg-black/20" />
  <div className="relative z-10 flex h-full min-h-[600px] flex-col items-center justify-center px-4 py-24 text-center">
    <h1 className="mb-6 max-w-4xl font-semibold leading-tight md:text-7xl text-5xl" style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: '0.04em', color: '#ffffff', textShadow: '0 2px 20px rgba(0,0,0,0.6), 0 4px 40px rgba(0,0,0,0.4)', fontStyle: 'italic' }}>
      Meet Your
      <span className="block mt-2" style={{ color: '#ffffff', fontFamily: "'Poppins', sans-serif" }}>
        Meditation Guide
      </span>
    </h1>
    <p className="mb-10 max-w-xl text-base text-white leading-relaxed tracking-wide" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300 }}>
      Ancient wisdom. Modern stillness. A path inward.
    </p>
    <a href="#consult" className="inline-block bg-white/10 backdrop-blur-sm border border-white/30 rounded-full px-8 py-3 text-white font-medium tracking-wide transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:scale-105" style={{ fontFamily: "'Poppins', sans-serif" }}>
      Begin
    </a>
  </div>
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
    <div className="h-10 w-6 rounded-full border border-white/30 p-1">
      <div className="h-2 w-1 animate-pulse rounded-full bg-white/40 mx-auto" />
    </div>
  </div>
</section>
);

const MeditationImages: React.FC = () => {
  const [selectedPose, setSelectedPose] = React.useState<number | null>(null);
  const [activeSession, setActiveSession] = React.useState<number | null>(null);

  const poses = [
    {
      src: "/meditation/wellness1.jpeg",
      label: "Easy Pose",
      sanskrit: "Sukhasana",
      num: "01",
      description: "A simple cross-legged seat that grounds the body and quiets the mind. Perfect for beginners entering the world of meditation.",
      benefits: ["Reduces stress and anxiety", "Improves posture and alignment", "Opens hips and groin", "Calms the nervous system"],
      steps: ["Sit on a mat with legs crossed", "Rest hands on knees, palms up", "Lengthen spine toward the sky", "Close eyes and breathe deeply for 5–20 min"],
      inhale: 4, hold: 0, exhale: 6, sessionText: "Relax and breathe gently",
      breathingTip: "Gentle nasal breathing with slow rhythm. Feel the cool air entering your nostrils and the warmth leaving.",
      postureGuide: "Sit comfortably with relaxed shoulders. Keep your spine tall but not rigid, resting hands on knees.",
      sessionInfo: "Beginner-friendly session for calmness. Ideal for setting a peaceful foundation for your day.",
      mindFocus: "Awareness of breath. Observe each cycle without judgment, simply noticing the rise and fall of your chest.",
      objectPosition: "center",
    },
    {
      src: "/meditation/wellness2.jpeg",
      label: "Cosmic Stillness",
      sanskrit: "Dhyana Mudra",
      num: "02",
      description: "A state of deep meditative absorption where the mind dissolves into pure awareness. The gateway to inner silence.",
      benefits: ["Deepens meditation practice", "Expands consciousness", "Releases mental chatter", "Connects to universal energy"],
      steps: ["Find a comfortable seated position", "Place hands in Dhyana Mudra on lap", "Soften gaze or close eyes", "Allow thoughts to pass like clouds"],
      inhale: 5, hold: 2, exhale: 7, sessionText: "Enter deep stillness",
      breathingTip: "Deep belly breathing. Imagine your breath expanding like the cosmos with every inhale and settling into stillness.",
      postureGuide: "Place your hands in the Dhyana Mudra on your lap. Let your chin tuck slightly to lengthen your neck.",
      sessionInfo: "Advanced practice for inner silence. A journey into the depths of pure awareness and universal connection.",
      mindFocus: "The space between thoughts. Direct your attention to the silent gap where one thought ends and the next begins.",
      objectPosition: "center",
    },
    {
      src: "/meditation/Vrikshasana.jpeg",
      label: "Thunderbolt Pose",
      sanskrit: "Vajrasana",
      num: "03",
      description: "A kneeling posture of diamond-like stability. Vajrasana is the only pose recommended after meals and builds an unshakeable foundation.",
      benefits: ["Aids digestion instantly", "Strengthens lower back", "Builds mental focus", "Grounds excess energy"],
      steps: ["Kneel on a soft mat", "Sit back onto your heels", "Keep spine tall and shoulders relaxed", "Rest hands on thighs and breathe"],
      inhale: 4, hold: 0, exhale: 4, sessionText: "Stabilize your posture",
      breathingTip: "Rhythmic and steady breathing. Focus on the stability of your breath, mirroring the unshakeable nature of a diamond.",
      postureGuide: "Kneel on your mat and sit back on your heels. Keep your spine perfectly upright to facilitate energy flow.",
      sessionInfo: "Grounding session for stability. Perfect after meals to aid digestion and center your wandering mind.",
      mindFocus: "Earth connection. Feel the weight of your body pressing into the heels, grounding your energy deep into the earth.",
      objectPosition: "center",
    },
    {
      src: "/lotus.png",
      label: "Lotus Pose",
      sanskrit: "Padmasana",
      num: "04",
      description: "The sacred lotus blooms from muddy waters — this pose symbolises spiritual awakening and is the crown jewel of meditation postures.",
      benefits: ["Activates root and sacral chakras", "Deepens breath capacity", "Promotes inner stillness", "Traditionally awakens Kundalini"],
      steps: ["Sit with legs extended", "Place right foot on left thigh", "Place left foot on right thigh", "Spine tall, hands in Chin Mudra"],
      inhale: 6, hold: 0, exhale: 6, sessionText: "Balance body and mind",
      breathingTip: "Lengthened exhales for balance. Inhale energy and exhale any remaining tension, keeping the rhythm circular.",
      postureGuide: "Cross your legs into a full lotus. Rest your hands in Chin Mudra, connecting thumb and index finger.",
      sessionInfo: "Balancing body and spirit. This sacred posture opens the heart and awakens the subtle energies within.",
      mindFocus: "Heart center. Visualize a glowing lotus at your chest, blooming with every breath you take.",
      objectPosition: "center",
    },
    {
      src: "/meditation/Savasana.jpeg",
      label: "Corpse Pose",
      sanskrit: "Savasana",
      num: "05",
      description: "The most important pose in yoga — complete surrender. Savasana integrates all practice and allows the body to absorb transformation.",
      benefits: ["Deep nervous system reset", "Reduces blood pressure", "Integrates meditation benefits", "Releases held tension completely"],
      steps: ["Lie flat on your back", "Let feet fall open naturally", "Arms slightly away from body", "Close eyes and release all effort"],
      inhale: 3, hold: 0, exhale: 7, sessionText: "Completely relax your body",
      breathingTip: "Effortless breathing. Let the body breathe itself without any control, like waves gently washing over a shore.",
      postureGuide: "Lie flat on your back with arms and legs spread wide. Surrender every muscle to the floor.",
      sessionInfo: "Deep relaxation and integration. Allow your nervous system to reset and absorb the benefits of practice.",
      mindFocus: "Total surrender. Imagine your body dissolving into the floor, leaving only a sense of weightless presence.",
      objectPosition: "center 80%",
    },
    {
      src: "/meditation/Padmasana.jpeg",
      label: "Zen Awareness",
      sanskrit: "Zazen",
      num: "06",
      description: "Seated awareness practice rooted in Zen tradition. Simply sitting with full presence — no goal, no destination, just this moment.",
      benefits: ["Cultivates pure presence", "Sharpens moment-to-moment awareness", "Reduces overthinking", "Builds equanimity"],
      steps: ["Sit in half or full lotus", "Eyes half-open, gaze downward", "Hands in cosmic mudra on lap", "Simply observe breath without control"],
      inhale: 4, hold: 1, exhale: 5, sessionText: "Stay present in the moment",
      breathingTip: "Natural, unforced breath. Observe the breath as it is, without trying to change its pace or depth.",
      postureGuide: "Sit with a straight back and half-open eyes. Gaze softly at the floor ahead of you, maintaining alert presence.",
      sessionInfo: "Cultivating pure presence. A practice of radical acceptance and observing the 'here and now' without filters.",
      mindFocus: "Bare attention. Witness your thoughts and sensations like passing clouds in a vast, empty sky.",
      objectPosition: "center",
    },
    {
      src: "/tree.jpg",
      label: "Tree Pose",
      sanskrit: "Vrikshasana",
      num: "07",
      description: "Stand rooted like an ancient tree. This balancing pose builds the one-pointed focus essential for deep meditation practice.",
      benefits: ["Improves balance and stability", "Builds laser-sharp concentration", "Strengthens legs and core", "Calms a scattered mind"],
      steps: ["Stand tall on one leg", "Place other foot on inner thigh", "Bring hands to prayer at heart", "Fix gaze on one still point"],
      inhale: 5, hold: 0, exhale: 5, sessionText: "Find balance and focus",
      breathingTip: "Balanced and focused breathing. Use your breath as an anchor to maintain stability in this vertical posture.",
      postureGuide: "Stand tall on one leg with the other foot against your inner thigh. Find a still point to fix your gaze.",
      sessionInfo: "Finding balance and focus. This session builds the one-pointed concentration needed for deep meditation.",
      mindFocus: "Rootedness. Visualize roots growing from your standing foot into the soil, providing unshakeable support.",
      objectPosition: "center",
    },
    {
      src: "/meditation/wellness12.jpeg",
      label: "Deep Dhyana",
      sanskrit: "Dhyana",
      num: "08",
      description: "The seventh limb of Patanjali's Ashtanga — unbroken flow of concentration. When meditation becomes effortless and continuous.",
      benefits: ["Transcends ordinary mind", "Accesses deep inner peace", "Dissolves ego boundaries", "Awakens higher consciousness"],
      steps: ["Establish comfortable seated pose", "Begin with 10 min of breath focus", "Allow concentration to deepen naturally", "Rest in pure awareness without effort"],
      inhale: 6, hold: 3, exhale: 8, sessionText: "Go deeper into meditation",
      breathingTip: "Subtle, refined breathing. As concentration deepens, let the breath become a fine whisper of light.",
      postureGuide: "Maintain a comfortable but alert seat. Keep your spine as a pillar of light, connecting earth and sky.",
      sessionInfo: "Transcending the ordinary mind. An effortless flow of concentration where observer and observed become one.",
      mindFocus: "Pure consciousness. Rest in the vast, luminous space of your own awareness, free from all labels.",
      objectPosition: "center",
    },
  ];

  const radius = 300;
  const cards = poses.map((pose, i) => {
    const angle = (i * 45) - 90;
    const rad = (angle * Math.PI) / 180;
    return { ...pose, x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
  });

  const selected = selectedPose !== null ? poses[selectedPose] : null;

  return (
    <section style={{ background: '#f8fafb', padding: '80px 0', overflow: 'hidden', position: 'relative' }}>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#2d6a4f', marginBottom: '12px', opacity: 0.8 }}>Ancient Asanas</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1e293b', margin: 0 }}>
            Poses for <span style={{ color: '#059669', fontStyle: 'italic' }}>Meditation</span>
          </h2>
          <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to right, transparent, #059669, transparent)', margin: '16px auto 0' }} />
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '12px', fontFamily: "'Poppins', sans-serif" }}>Click any pose to explore</p>
        </div>

        {/* Dark box wrapping only the radial layout */}
        <div style={{
          background: 'linear-gradient(135deg, #000000 0%, #020d0a 40%, #000d1a 100%)',
          borderRadius: '32px',
          padding: '40px 20px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,255,157,0.08)',
        }}>

          {/* Floating particles — inside the box only */}
          <div className="med-particles" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="med-particle" style={{ '--i': i } as React.CSSProperties} />
            ))}
          </div>

          {/* Radial layout */}
          <div className="med-radial-container">
          {/* Center tree */}
          <div className="med-center">
            <img src="/circle.jpg" alt="Meditation Tree" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} />
          </div>

          {/* Orbit wrapper */}
          <div className="med-orbit-wrapper">
            {cards.map((card, i) => (
              <div
                key={i}
                className="med-orbit-anchor"
                style={{ left: `calc(50% + ${card.x}px)`, top: `calc(50% + ${card.y}px)` }}
              >
                <div
                  className="med-circle-card"
                  onClick={() => setSelectedPose(i)}
                >
                  <div className="med-circle-img">
                    <img src={card.src} alt={card.label} />
                  </div>
                  <span className="med-circle-num">{card.num}</span>
                  <p className="med-circle-label">{card.label}</p>
                </div>
              </div>
            ))}
          </div>
          </div>{/* end med-radial-container */}
        </div>{/* end dark box */}
      </div>{/* end outer container */}

      {/* ── GLASSMORPHISM MODAL ── */}
      {selected !== null && (
        <div
          className="med-modal-overlay"
          onClick={() => setSelectedPose(null)}
        >
          <div
            className="med-modal"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button className="med-modal-close" onClick={() => setSelectedPose(null)}>✕</button>

            {/* Image */}
            <div className="med-modal-img-wrap">
              <img 
                src={selected.src} 
                alt={selected.label} 
                className="med-modal-img" 
                style={{ objectPosition: (selected as any).objectPosition || 'center' }}
              />
              <div className="med-modal-img-overlay" />
            </div>

            {/* Content */}
            <div className="med-modal-body">
              <div style={{ marginBottom: '16px' }}>
                <p style={{ color: '#16a34a', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: "'Cinzel', serif", margin: '0 0 6px' }}>{selected.sanskrit}</p>
                <h3 style={{ color: '#111827', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontFamily: "'Playfair Display', serif", fontWeight: 800, margin: 0 }}>{selected.label}</h3>
              </div>

              <p style={{ color: '#4b5563', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '20px', fontFamily: "'Poppins', sans-serif" }}>{selected.description}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                {/* Benefits */}
                <div>
                  <h4 style={{ color: '#16a34a', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Cinzel', serif", marginBottom: '10px' }}>Benefits</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selected.benefits.map((b, i) => (
                      <li key={i} style={{ color: '#374151', fontSize: '0.82rem', display: 'flex', gap: '8px', alignItems: 'flex-start', fontFamily: "'Poppins', sans-serif" }}>
                        <span style={{ color: '#22c55e', flexShrink: 0 }}>✦</span>{b}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Steps */}
                <div>
                  <h4 style={{ color: '#16a34a', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Cinzel', serif", marginBottom: '10px' }}>Steps</h4>
                  <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selected.steps.map((s, i) => (
                      <li key={i} style={{ color: '#374151', fontSize: '0.82rem', display: 'flex', gap: '8px', alignItems: 'flex-start', fontFamily: "'Poppins', sans-serif" }}>
                        <span style={{ color: '#22c55e', fontWeight: 700, flexShrink: 0, minWidth: '16px' }}>{i + 1}.</span>{s}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* CTA */}
              <button
                className="med-modal-btn"
                onClick={() => { setActiveSession(selectedPose); setSelectedPose(null); }}
              >
                ✦ Start Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MEDITATION SESSION SCREEN ── */}
      {activeSession !== null && (
        <MeditationSession
          pose={poses[activeSession]}
          onExit={() => setActiveSession(null)}
        />
      )}

      <style>{`
        /* ── Particles ── */
        .med-particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .med-particle {
          position: absolute;
          width: 3px; height: 3px;
          border-radius: 50%;
          background: #00ff9d;
          opacity: 0;
          animation: med-float calc(8s + var(--i, 0) * 1.2s) ease-in-out infinite;
          animation-delay: calc(var(--i, 0) * 0.6s);
          left: calc(var(--i, 0) * 5.8%);
          top: 100%;
          box-shadow: 0 0 6px #00ff9d;
        }
        @keyframes med-float {
          0%   { opacity: 0; transform: translateY(0) scale(1); }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.2; }
          100% { opacity: 0; transform: translateY(-110vh) scale(0.4); }
        }

        /* ── Radial layout ── */
        .med-radial-container {
          position: relative;
          width: 900px;
          height: 900px;
          margin: 0 auto;
        }
        .med-center {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 290px; height: 290px;
          border-radius: 50%;
          z-index: 10;
          animation: med-breathe 4s ease-in-out infinite;
          filter: drop-shadow(0 0 30px rgba(0,255,157,0.25));
        }
        @keyframes med-breathe {
          0%,100% { transform: translate(-50%,-50%) scale(1); }
          50%      { transform: translate(-50%,-50%) scale(1.04); }
        }
        .med-orbit-wrapper {
          position: absolute; inset: 0;
          animation: med-orbit 60s linear infinite;
        }
        @keyframes med-orbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .med-orbit-anchor {
          position: absolute;
          transform: translate(-50%, -50%);
        }
        .med-circle-card {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          cursor: pointer;
          animation: med-counter 60s linear infinite;
          transform-origin: center;
          transition: transform 0.3s ease;
        }
        @keyframes med-counter {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        .med-circle-img {
          width: 155px; height: 155px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid rgba(0,255,157,0.4);
          box-shadow: 0 0 0 0 rgba(0,255,157,0);
          transition: all 0.35s ease;
        }
        .med-circle-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .med-circle-card:hover .med-circle-img {
          transform: scale(1.1);
          border-color: #00ff9d;
          box-shadow: 0 0 0 4px rgba(0,255,157,0.25), 0 0 30px rgba(0,255,157,0.4);
        }
        .med-circle-card:hover .med-circle-img img { transform: scale(1.12); }
        .med-circle-num {
          font-family: 'Cinzel', serif;
          font-size: 0.65rem; font-weight: 700;
          color: #00ff9d; letter-spacing: 0.1em; margin: 0;
          text-shadow: 0 0 8px rgba(0,255,157,0.6);
        }
        .med-circle-label {
          font-family: 'Cinzel', serif;
          font-size: 0.65rem; font-weight: 600;
          color: #e2e8f0; text-align: center;
          max-width: 100px; margin: 0; line-height: 1.3;
          text-shadow: 0 1px 4px rgba(0,0,0,0.8);
        }

        /* ── Modal overlay ── */
        .med-modal-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(180, 220, 200, 0.35);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: med-fade-in 0.3s ease;
        }
        @keyframes med-fade-in { from { opacity: 0; } to { opacity: 1; } }

        /* ── Modal box ── */
        .med-modal {
          position: relative;
          width: 100%; max-width: 620px;
          max-height: 90vh;
          overflow-y: auto;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(34,197,94,0.18);
          box-shadow: 0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
          animation: med-scale-in 0.3s cubic-bezier(0.34,1.56,0.64,1);
          scrollbar-width: thin;
          scrollbar-color: rgba(34,197,94,0.3) transparent;
        }
        @keyframes med-scale-in {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        .med-modal::-webkit-scrollbar { width: 4px; }
        .med-modal::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.3); border-radius: 4px; }

        /* Close button */
        .med-modal-close {
          position: absolute; top: 14px; right: 14px; z-index: 10;
          width: 32px; height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.90);
          border: 1px solid rgba(0,0,0,0.10);
          color: #15803d;
          font-size: 0.8rem; font-weight: 700;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .med-modal-close:hover {
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.20);
          transform: scale(1.1);
        }

        /* Modal image */
        .med-modal-img-wrap {
          position: relative; width: 100%; height: 320px; overflow: hidden;
          border-radius: 24px 24px 0 0;
        }
        .med-modal-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s cubic-bezier(0.2, 0, 0.2, 1); }
        .med-modal-img-wrap:hover .med-modal-img { transform: scale(1.08); }
        .med-modal-img-overlay {
          display: none;
        }

        /* Modal body */
        .med-modal-body { padding: 20px 24px 24px; }

        /* CTA button */
        .med-modal-btn {
          width: 100%;
          padding: 14px;
          border-radius: 50px;
          border: none;
          background: linear-gradient(135deg, #4ade80, #22c55e);
          color: #ffffff;
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 0.08em;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 15px rgba(34,197,94,0.30);
        }
        .med-modal-btn:hover {
          box-shadow: 0 8px 22px rgba(34,197,94,0.42);
          transform: scale(1.02);
        }

        /* Mobile */
        @media (max-width: 960px) {
          .med-radial-container { width: 600px; height: 600px; }
          .med-center { width: 190px; height: 190px; }
          .med-circle-img { width: 105px; height: 105px; }
        }
        @media (max-width: 640px) {
          .med-radial-container { width: 360px; height: 360px; }
          .med-center { width: 100px; height: 100px; }
          .med-circle-img { width: 58px; height: 58px; }
          .med-circle-num, .med-circle-label { display: none; }
          .med-modal { max-width: 100%; }
          .med-modal-body { padding: 16px; }
          .med-modal-body > div:nth-child(4) { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
};



// ── Meditation Session Screen ──────────────────────────────────────────────
const MeditationSession: React.FC<{ pose: any; onExit: () => void }> = ({ pose, onExit }) => {
  const TOTAL = 5 * 60; // 5 minutes
  const [running, setRunning] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(TOTAL);
  const [phase, setPhase] = React.useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [phaseTime, setPhaseTime] = React.useState(0);
  const [done, setDone] = React.useState(false);

  // Stats for the Right Column
  const progressPercent = Math.round(((TOTAL - timeLeft) / TOTAL) * 100);
  const calmLevel = Math.min(100, 40 + Math.floor((TOTAL - timeLeft) / 5)); // Simulated steady increase

  // Main countdown
  React.useEffect(() => {
    if (!running || done) return;
    const t = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { clearInterval(t); setDone(true); setRunning(false); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, done]);

  // Breathing phase ticker
  React.useEffect(() => {
    if (!running || done) return;
    const t = setInterval(() => {
      setPhaseTime(p => {
        const next = p + 1;
        if (phase === 'inhale') {
          if (next >= pose.inhale) { setPhase(pose.hold > 0 ? 'hold' : 'exhale'); return 0; }
        } else if (phase === 'hold') {
          if (next >= pose.hold) { setPhase('exhale'); return 0; }
        } else {
          if (next >= pose.exhale) { setPhase('inhale'); return 0; }
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, done, phase, pose]);

  const reset = () => {
    setRunning(false); setTimeLeft(TOTAL);
    setPhase('inhale'); setPhaseTime(0); setDone(false);
  };

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');

  const phaseLabel = phase === 'inhale' ? 'Inhale' : phase === 'hold' ? 'Hold' : 'Exhale';
  const phaseDur   = phase === 'inhale' ? pose.inhale : phase === 'hold' ? pose.hold : pose.exhale;
  const phaseProgress = phaseDur > 0 ? (phaseTime / phaseDur) : 0;

  // Circle scale: inhale → grows, hold → stays big, exhale → shrinks
  const circleScale = phase === 'inhale'
    ? 1 + phaseProgress * 0.4
    : phase === 'hold'
    ? 1.4
    : 1.4 - phaseProgress * 0.4;

  const animDur = `1000ms`; // Smoother 1s updates

  return (
    <div className="msession-overlay">
      <div className="msession-particles" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="msession-particle" style={{ '--si': i } as React.CSSProperties} />
        ))}
      </div>

      <button className="msession-exit" onClick={onExit}>✕ Exit</button>

      <div className="msession-layout">
        {/* LEFT SIDE: GUIDANCE */}
        <aside className="msession-side msession-left">
          <div className="msession-panel msession-panel-animate" style={{ animationDelay: '0.2s' }}>
            <div className="msession-side-item">
              <span className="msession-side-label">Breathing Tip</span>
              <p className="msession-side-content">{pose.breathingTip}</p>
            </div>
            <div className="msession-divider" />
            <div className="msession-side-item">
              <span className="msession-side-label">Posture Guide</span>
              <p className="msession-side-content">{pose.postureGuide}</p>
            </div>
            <div className="msession-divider" />
            <div className="msession-side-item">
              <span className="msession-side-label">Session Info</span>
              <p className="msession-side-content">{pose.sessionInfo}</p>
            </div>
          </div>
        </aside>

        {/* CENTER: MAIN FOCUS */}
        <main className="msession-center">
          <div className="msession-circle-container">
             <svg className="msession-progress-ring" viewBox="0 0 200 200">
                <circle
                  className="msession-ring-bg"
                  cx="100" cy="100" r="90"
                />
                <circle
                  className="msession-ring-fill"
                  cx="100" cy="100" r="90"
                  style={{
                    strokeDasharray: 565,
                    strokeDashoffset: 565 - (565 * phaseProgress),
                    transition: 'stroke-dashoffset 1s linear'
                  }}
                />
             </svg>
             <div className="msession-circle-main" style={{ transform: `scale(${circleScale})`, transition: `transform ${animDur} ease-in-out` }}>
                {done ? (
                   <span className="msession-phase-text">Complete</span>
                ) : (
                   <span className="msession-phase-text">{running ? phaseLabel.toUpperCase() : 'READY'}</span>
                )}
             </div>
          </div>

          <div className="msession-timer">{mm}:{ss}</div>
          
          <div className="msession-patterns-text">
            <span style={{ color: phase === 'inhale' ? '#16a34a' : 'inherit', fontWeight: phase === 'inhale' ? 600 : 300 }}>Inhale</span> • 
            <span style={{ color: phase === 'hold' ? '#16a34a' : 'inherit', fontWeight: phase === 'hold' ? 600 : 300 }}>Hold</span> • 
            <span style={{ color: phase === 'exhale' ? '#16a34a' : 'inherit', fontWeight: phase === 'exhale' ? 600 : 300 }}>Exhale</span>
          </div>

          <div className="msession-controls">
            {done ? (
              <button className="msession-btn msession-btn-primary" onClick={reset}>↺ Restart</button>
            ) : (
              <>
                <button className="msession-btn msession-btn-primary" onClick={() => setRunning(r => !r)}>
                   {running ? '⏸ PAUSE' : '▶ START'}
                </button>
                <button className="msession-btn msession-btn-secondary" onClick={reset}>↺ RESET</button>
              </>
            )}
          </div>
        </main>

        {/* RIGHT SIDE: PROGRESS */}
        <aside className="msession-side msession-right">
          <div className="msession-panel msession-panel-animate" style={{ animationDelay: '0.4s' }}>
            <div className="msession-side-item">
              <span className="msession-side-label">Mind Focus</span>
              <p className="msession-side-content">{pose.mindFocus}</p>
            </div>
            <div className="msession-divider" />
            <div className="msession-side-item">
              <span className="msession-side-label">Calm Level</span>
              <div className="msession-progress-bar">
                <div className="msession-progress-fill" style={{ width: `${calmLevel}%` }} />
              </div>
              <p className="msession-side-content" style={{ marginTop: '8px' }}>{calmLevel}% Stable</p>
            </div>
            <div className="msession-divider" />
            <div className="msession-side-item" style={{ height: '70px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="msession-side-label">Progress</span>
              <p className="msession-side-content" style={{ fontSize: '1.4rem', color: '#16a34a', fontWeight: 600 }}>{progressPercent}%</p>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        .msession-overlay {
          position: fixed; inset: 0; z-index: 2000;
          background: linear-gradient(160deg, #e8f5e9 0%, #f0fdf4 40%, #dcfce7 70%, #f0fdf4 100%);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          animation: msession-in 0.8s ease;
          color: #14532d;
          padding: 20px;
        }
        @keyframes msession-in { from { opacity: 0; } to { opacity: 1; } }

        .msession-layout {
          display: grid;
          grid-template-columns: 280px 480px 280px;
          align-items: center;
          justify-content: center;
          gap: 20px;
          max-width: 1200px;
          width: 100%;
        }

        .msession-exit {
          position: absolute; top: 30px; right: 40px;
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(34,197,94,0.30);
          color: #15803d;
          padding: 8px 20px; border-radius: 50px;
          font-size: 0.75rem; cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
          letter-spacing: 0.05em;
          z-index: 10;
        }
        .msession-exit:hover { background: rgba(255,255,255,0.80); color: #14532d; border-color: rgba(34,197,94,0.5); }

        /* Panel Animation */
        @keyframes msession-panel-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msession-panel-animate {
          opacity: 0;
          animation: msession-panel-in 1.2s cubic-bezier(0.2, 0, 0.2, 1) forwards;
        }

        /* Side Panels */
        .msession-side { width: 100%; transition: transform 0.4s cubic-bezier(0.2, 0, 0.2, 1); }
        .msession-panel {
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(34,197,94,0.20);
          border-radius: 22px;
          padding: 36px 28px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          min-height: 420px;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(0,0,0,0.06), inset 0 0 12px rgba(34,197,94,0.04);
          transition: all 0.4s cubic-bezier(0.2, 0, 0.2, 1);
        }
        .msession-panel:hover {
          transform: scale(1.02);
          border-color: rgba(34,197,94,0.35);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08), inset 0 0 16px rgba(34,197,94,0.06);
        }
        .msession-left .msession-panel { text-align: left; }
        .msession-right .msession-panel { text-align: right; }

        .msession-side-item {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }
        .msession-divider {
          height: 1px;
          background: rgba(34,197,94,0.18);
          margin: 24px 0;
          width: 100%;
          flex-shrink: 0;
        }
        .msession-side-label {
          font-family: 'Cinzel', serif;
          font-size: 0.75rem;
          color: #16a34a;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          font-weight: 700;
        }
        .msession-side-content {
          font-family: 'Poppins', sans-serif;
          font-size: 0.95rem;
          color: #374151;
          line-height: 1.6;
          margin: 0;
        }

        /* Center Section */
        .msession-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 40px;
        }

        .msession-circle-container {
          position: relative;
          width: 380px;
          height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .msession-progress-ring {
          position: absolute;
          width: 100%; height: 100%;
          transform: rotate(-90deg);
        }
        .msession-ring-bg {
          fill: none;
          stroke: rgba(34,197,94,0.12);
          stroke-width: 3;
        }
        .msession-ring-fill {
          fill: none;
          stroke: #22c55e;
          stroke-width: 3;
          stroke-linecap: round;
          filter: drop-shadow(0 0 8px rgba(34,197,94,0.35));
        }

        .msession-circle-main {
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: rgba(255,255,255,0.50);
          border: 1px solid rgba(34,197,94,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 40px rgba(34,197,94,0.12), inset 0 0 24px rgba(34,197,94,0.06);
        }
        .msession-phase-text {
          font-family: 'Cinzel', serif;
          font-size: 1.4rem;
          color: #16a34a;
          letter-spacing: 0.2em;
          font-weight: 700;
        }

        .msession-timer {
          font-family: 'Cinzel', serif;
          font-size: 3.8rem;
          font-weight: 400;
          color: #14532d;
          letter-spacing: 0.05em;
        }

        .msession-patterns-text {
          font-family: 'Poppins', sans-serif;
          font-size: 1rem;
          color: rgba(21,128,61,0.45);
          letter-spacing: 0.15em;
          display: flex;
          gap: 20px; align-items: center;
          font-weight: 300;
        }

        .msession-controls {
          display: flex;
          gap: 20px;
        }
        .msession-btn {
          padding: 12px 48px;
          border-radius: 8px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid transparent;
          letter-spacing: 0.12em;
          background: transparent;
        }
        .msession-btn-primary {
          border-color: #22c55e;
          color: #15803d;
        }
        .msession-btn-primary:hover {
          background: rgba(34,197,94,0.10);
          transform: translateY(-1px);
        }
        .msession-btn-secondary {
          border-color: rgba(34,197,94,0.25);
          color: rgba(21,128,61,0.65);
        }
        .msession-btn-secondary:hover {
          border-color: rgba(34,197,94,0.45);
          color: #15803d;
          background: rgba(34,197,94,0.06);
        }

        .msession-progress-bar {
          width: 100%; height: 4px;
          background: rgba(34,197,94,0.12);
          border-radius: 4px;
          overflow: hidden;
        }
        .msession-progress-fill {
          height: 100%;
          background: #22c55e;
          box-shadow: 0 0 8px rgba(34,197,94,0.30);
        }

        /* Background Elements */
        .msession-particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .msession-particle {
          position: absolute;
          width: calc(8px + var(--si, 0) * 3px);
          height: calc(8px + var(--si, 0) * 3px);
          border-radius: 50%;
          background: rgba(34,197,94,0.12);
          border: 1px solid rgba(34,197,94,0.30);
          backdrop-filter: blur(2px);
          opacity: 0;
          left: calc(var(--si, 0) * 5.2%);
          top: 100%;
          animation: msession-float calc(10s + var(--si, 0) * 1.5s) ease-in-out infinite;
          animation-delay: calc(var(--si, 0) * 0.6s);
        }
        @keyframes msession-float {
          0%   { opacity: 0; transform: translateY(0) scale(1); }
          15%  { opacity: 0.7; }
          85%  { opacity: 0.25; transform: translateY(-95vh) scale(0.6); }
          100% { opacity: 0; transform: translateY(-110vh) scale(0.4); }
        }

        /* Mobile Adjustments */
        @media (max-width: 1024px) {
          .msession-overlay { padding: 40px 20px; overflow-y: auto; display: block; }
          .msession-layout {
            grid-template-columns: 1fr;
            gap: 40px;
            max-width: 500px;
            margin: 60px auto;
          }
          .msession-panel { min-height: auto; padding: 20px; text-align: center !important; }
          .msession-side-item { align-items: center; }
          .msession-circle-container { width: 300px; height: 300px; }
          .msession-circle-main { width: 200px; height: 200px; }
          .msession-timer { font-size: 3rem; }
          .msession-exit { top: 20px; right: 20px; }
        }
      `}</style>
    </div>
  );
};


// Meditation Poses Section
// =====================
// Meditation Poses
// =====================
const MeditationPoses: React.FC = () => {
  const [activePose, setActivePose] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const poses = [
    {
      id: 1,
      name: "Easy Pose (Sukhasana)",
      practiceLevel: "Beginner",
      intensity: "Gentle",
      duration: "5–20 minutes",
      glowColor: "#f59e0b",
      image: sukhasana,
      description: "A simple and comfortable seated posture ideal for beginners.",
      youtubeUrl: "https://www.youtube.com/results?search_query=Easy+Pose+Sukhasana+meditation",
      guidelines: ["Sit cross-legged comfortably", "Spine tall", "Relax shoulders", "Focus on breathing"],
      benefits: ["Reduces stress", "Improves focus", "Relaxes body"],
    },
    {
      id: 2,
      name: "Child's Pose (Balasana)",
      practiceLevel: "Beginner",
      intensity: "Gentle",
      duration: "1–5 minutes",
      glowColor: "#06b6d4",
      image: balasana,
      description: "A deeply calming pose that relaxes the spine and nervous system.",
      youtubeUrl: "https://www.youtube.com/results?search_query=Childs+Pose+Balasana+yoga",
      guidelines: ["Kneel on mat", "Fold forward", "Rest forehead down", "Arms relaxed"],
      benefits: ["Relieves tension", "Calms mind", "Reduces anxiety"],
    },
    {
      id: 3,
      name: "Thunderbolt Pose (Vajrasana)",
      practiceLevel: "Beginner",
      intensity: "Gentle",
      duration: "5–15 minutes",
      glowColor: "#8b5cf6",
      image: vajrasana,
      description: "A seated kneeling posture that aids digestion and promotes stillness for meditation.",
      youtubeUrl: "https://www.youtube.com/results?search_query=Vajrasana+Thunderbolt+Pose+yoga",
      guidelines: ["Kneel on the mat", "Sit back on heels", "Keep spine straight", "Hands on thighs"],
      benefits: ["Improves digestion", "Enhances focus", "Strengthens posture"],
      precautions: ["Avoid if knee pain", "Use cushion under ankles"],
    },
    {
      id: 4,
      name: "Perfect Pose (Siddhasana)",
      practiceLevel: "Intermediate",
      intensity: "Gentle",
      duration: "10–30 minutes",
      glowColor: "#ec4899",
      image: siddhasana,
      description: "A traditional meditation pose believed to awaken inner energy.",
      youtubeUrl: "https://www.youtube.com/results?search_query=Siddhasana+Perfect+Pose+yoga",
      guidelines: ["Sit with one heel at perineum", "Other foot placed above", "Spine upright", "Hands resting on knees"],
      benefits: ["Balances energy", "Improves concentration", "Stabilizes mind"],
      precautions: ["Avoid if hip stiffness"],
    },
    {
      id: 5,
      name: "Seated Forward Fold (Paschimottanasana)",
      practiceLevel: "Beginner",
      intensity: "Gentle",
      duration: "2–5 minutes",
      glowColor: "#22c55e",
      image: paschimottanasana,
      description: "A calming forward bend that relaxes the nervous system.",
      youtubeUrl: "https://www.youtube.com/results?search_query=Paschimottanasana+yoga",
      guidelines: ["Sit with legs extended", "Fold forward gently", "Relax head and neck", "Breathe deeply"],
      benefits: ["Calms nervous system", "Reduces anxiety", "Relieves fatigue"],
      precautions: ["Avoid deep stretch if back pain"],
    },
    {
      id: 6,
      name: "Corpse Pose (Shavasana)",
      practiceLevel: "Beginner",
      intensity: "Very Gentle",
      duration: "5–20 minutes",
      glowColor: "#f97316",
      image: savasana,
      description: "A deeply restorative posture for mindfulness and body awareness.",
      youtubeUrl: "https://www.youtube.com/results?search_query=Shavasana+Corpse+Pose+yoga",
      guidelines: ["Lie flat on back", "Arms relaxed by sides", "Eyes closed", "Observe breath"],
      benefits: ["Deep relaxation", "Reduces stress", "Improves awareness"],
      precautions: ["Use blanket if cold"],
    },
    {
      id: 7,
      name: "Butterfly Pose (Baddha Konasana)",
      practiceLevel: "Beginner",
      intensity: "Gentle",
      duration: "5–15 minutes",
      glowColor: "#e879f9",
      image: butterfly,
      description: "A relaxing seated pose that opens the hips and calms the nervous system, making it ideal before meditation.",
      youtubeUrl: "https://www.youtube.com/results?search_query=Baddha+Konasana+Butterfly+Pose+yoga",
      guidelines: ["Sit with spine straight", "Bring soles of feet together", "Hold feet and gently flap knees", "Breathe deeply and relax"],
      benefits: ["Opens hips", "Reduces stress", "Improves flexibility"],
      precautions: ["Avoid forcing knees down", "Use cushions under thighs if needed"],
    },
    {
      id: 8,
      name: "Half Spinal Twist (Ardha Matsyendrasana)",
      practiceLevel: "Intermediate",
      intensity: "Moderate",
      duration: "3–8 minutes",
      glowColor: "#ef4444",
      image: ardha,
      description: "A seated twisting posture that improves spinal flexibility and energizes the body while keeping the mind alert.",
      youtubeUrl: "https://www.youtube.com/results?search_query=Ardha+Matsyendrasana+yoga",
      guidelines: ["Sit with legs extended", "Bend one knee and place foot outside thigh", "Twist torso gently", "Keep spine upright"],
      benefits: ["Improves digestion", "Enhances spinal mobility", "Improves focus"],
      precautions: ["Avoid if severe back pain", "Twist gently without jerks"],
    },
    {
      id: 9,
      name: "Tree Pose (Vrikshasana)",
      practiceLevel: "Beginner",
      intensity: "Moderate",
      duration: "1–5 minutes",
      glowColor: "#38bdf8",
      image: virkshana,
      description: "A balancing pose that builds focus, stability, and mental clarity — excellent preparation for meditation.",
      youtubeUrl: "https://www.youtube.com/results?search_query=Tree+Pose+Vrikshasana+yoga",
      guidelines: ["Stand straight", "Place one foot on inner thigh or calf", "Hands in prayer position", "Fix gaze on one point"],
      benefits: ["Improves balance", "Builds concentration", "Strengthens legs"],
      precautions: ["Avoid if dizziness", "Use wall support if needed"],
    },
  ];

  return (
    <>
      <section className="py-12 bg-white">
        <div className="max-w-full mx-auto px-8">
          <div className="mb-16 text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-green-700/60 mb-3" style={{ fontFamily: "'Cinzel', serif" }}>Sacred Postures</p>
            <h2 className="text-4xl text-stone-800" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800 }}>
              Yoga for <span style={{ color: '#2d6a4f', fontStyle: 'italic' }}>Meditation</span>
            </h2>
            <div className="w-16 h-px bg-green-400/50 mx-auto mt-4" />
            <p className="text-stone-500 mt-4 text-sm tracking-wide" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300 }}>
              Click any pose to watch the tutorial on YouTube ↗
            </p>
          </div>

          <div className="slider" style={{ '--width': '280px', '--height': '400px', '--quantity': '9' } as React.CSSProperties}>
            <div className="list">
              {poses.map((pose) => {
                return (
                  <a
                    key={pose.id}
                    href={pose.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="item"
                    style={{ '--position': pose.id, textDecoration: 'none', display: 'block' } as React.CSSProperties}
                    onClick={() => console.log(`Opening: ${pose.name} → ${pose.youtubeUrl}`)}
                  >
                    <div className="yoga-card">
                      <img src={pose.image} alt={pose.name} style={{ objectPosition: pose.id === 6 ? 'right center' : 'center center' }} />
                      <div className="yoga-card-text">
                        <p className="tip">{pose.name}</p>
                        <p className="second-text">{pose.intensity} • {pose.duration}</p>
                      </div>
                      {/* YouTube play icon — bottom right */}
                      <div className="yoga-yt-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      <style>{`
        /* Slider */
        .slider {
          width: 100%;
          height: var(--height);
          overflow: hidden;
        }
        .slider .list {
          display: flex;
          width: 100%;
          min-width: calc(var(--width) * var(--quantity));
          position: relative;
          height: var(--height);
        }
        .slider .list .item {
          width: var(--width);
          height: var(--height);
          position: absolute;
          left: 100%;
          animation: autoRun 32s linear infinite;
          transition: filter 0.5s, transform 0.4s;
          animation-delay: calc((32s / var(--quantity)) * (var(--position) - 1) - 32s);
          cursor: pointer;
          padding: 0 8px;
          text-decoration: none;
        }
        @keyframes autoRun {
          from { left: 100%; }
          to { left: calc(var(--width) * -1); }
        }
        .slider:hover .item {
          animation-play-state: paused;
        }

        /* Yoga Card */
        .yoga-card {
          width: 100%;
          height: 100%;
          border-radius: 14px;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
          flex-direction: column;
          text-align: left;
          color: white;
          background: linear-gradient(135deg, #1a2e1a 0%, #0f1f0f 100%);
          box-shadow: 0 2px 16px rgba(80,50,10,0.2);
          transition: box-shadow 0.4s, filter 0.4s, transform 0.3s;
          border: 1px solid rgba(45,106,79,0.2);
        }

        .yoga-card.card-blurred {
          filter: none;
        }

        .yoga-card img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        .yoga-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(20, 12, 4, 0.88) 0%,
            rgba(20, 12, 4, 0.2) 40%,
            transparent 65%
          );
          border-radius: 14px;
          z-index: 0;
        }
        .yoga-card-text {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 2;
          padding: 16px 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .yoga-card .tip {
          font-size: 0.82em;
          font-weight: 600;
          letter-spacing: 0.02em;
          line-height: 1.3;
          color: #f5e6c8;
          font-family: 'Playfair Display', serif;
          text-shadow: 0 1px 6px rgba(0,0,0,0.9);
          margin: 0;
        }
        .yoga-card .second-text {
          font-size: 0.58em;
          font-weight: 400;
          letter-spacing: 0.1em;
          color: rgba(210,180,120,0.85);
          font-family: 'Cinzel', serif;
          text-shadow: 0 1px 4px rgba(0,0,0,0.9);
          text-transform: uppercase;
          margin: 0;
        }

        /* YouTube play icon — bottom right corner */
        .yoga-yt-icon {
          position: absolute;
          bottom: 10px; right: 10px;
          z-index: 3;
          width: 28px; height: 28px;
          border-radius: 6px;
          background: rgba(255,0,0,0.75);
          display: flex; align-items: center; justify-content: center;
          color: white;
          opacity: 0.55;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .yoga-card:hover .yoga-yt-icon {
          opacity: 1;
          transform: scale(1.12);
        }
        .yoga-card:hover img { transform: scale(1.06); }
        .yoga-card:hover { box-shadow: 0 6px 28px rgba(0,0,0,0.35); }
      `}</style>

      {/* Modal */}
      <YogaDetailModal
        pose={activePose}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
// =====================
// Yoga Detail Modal
// =====================
const YogaDetailModal = ({ pose, isOpen, onClose }: any) => {
  if (!isOpen || !pose) return null;

  const searchQuery = encodeURIComponent(`${pose.name} yoga tutorial`);
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="relative bg-white max-w-2xl w-full rounded-2xl overflow-y-auto max-h-[90vh]">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center text-sm font-bold hover:bg-black/60 transition"
        >
          ✕
        </button>

        {/* Full-width image */}
        <img
          src={pose.image}
          alt={pose.name}
          className="w-full"
          style={{ height: '320px', objectFit: 'contain', objectPosition: 'center center', borderRadius: '16px 16px 0 0', background: '#ffffff' }}
        />

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{pose.name}</h2>
          <p className="text-xs text-amber-700 uppercase tracking-widest mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
            {pose.intensity} · {pose.duration}
          </p>

          <p className="text-gray-600 mb-5 text-sm leading-relaxed">{pose.description}</p>

          <div className="grid grid-cols-2 gap-6 mb-5">
            <div>
              <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-stone-700">Steps</h4>
              <ul className="space-y-1">
                {pose.guidelines.map((step: string, i: number) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-amber-600 font-bold">{i + 1}.</span> {step}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-stone-700">Benefits</h4>
              <ul className="space-y-1">
                {pose.benefits.map((benefit: string) => (
                  <li key={benefit} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-amber-600">✓</span> {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* YouTube search button */}
          <a
            href={youtubeSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
            style={{ background: '#FF0000', fontFamily: "'Poppins', sans-serif" }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Watch {pose.name} Tutorial on YouTube
          </a>
        </div>
      </div>
    </div>
  );
};


// Essential Guidance Section
const EssentialGuidance: React.FC = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  
  const guidanceItems = [
    { icon: "🧘", title: "Start Small", description: "Begin with just 5 minutes daily. Consistency matters more than duration.", image: "/start small.jpg" },
    { icon: "🌅", title: "Morning Practice", description: "Early morning is ideal when the mind is fresh and distractions are minimal.", image: "/morning.jpg" },
    { icon: "🪷", title: "Create Sacred Space", description: "Designate a quiet corner for your practice.", image: "/sacred.jpg" },
    { icon: "📱", title: "Disconnect to Connect", description: "Put devices on silent for true stillness.", image: "/phonee.jpg" },
    { icon: "🌬️", title: "Breathe First", description: "Begin with deep breaths before meditation.", image: "/breath.jpg" },
    { icon: "❤️", title: "Be Patient", description: "Gently guide the mind back without judgment.", image: "/be.webp" },
  ];

  const handleCardClick = (title: string) => {
    setActiveCard(activeCard === title ? null : title);
  };

  return (
    <section className="essential-section relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="mb-14 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-green-200/80 mb-3" style={{ fontFamily: "'Cinzel', serif" }}>Timeless Principles</p>
          <h2 className="text-4xl" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, color: '#e8f5ee' }}>
            Essential <span style={{ color: '#64c896', fontStyle: 'italic' }}>Guidance</span>
          </h2>
          <div className="w-16 h-px bg-green-300/50 mx-auto mt-4" />
          <p className="text-green-100/90 mt-4 text-sm tracking-wide" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300 }}>
            Principles to deepen your meditation journey
          </p>
        </div>

        <div className="guidance-container">
          {guidanceItems.map((item) => (
            <div 
              key={item.title} 
              className={`guidance-card ${activeCard === item.title ? 'active' : ''}`}
              onClick={() => handleCardClick(item.title)}
            >
              {item.image ? (
                <div className="guidance-circle-img">
                  <img src={item.image} alt={item.title} />
                </div>
              ) : (
                <div className="guidance-icon">{item.icon}</div>
              )}
              <h3 className="guidance-title">{item.title}</h3>
              <p className="guidance-desc">{item.description}</p>
            </div>
          ))}
        </div>

        <style>{`
          .essential-section {
            background: linear-gradient(135deg, #1f3d2b, #2f5d44);
            padding: 80px 40px;
            border-radius: 24px;
            position: relative;
          }
          
          .essential-section::before {
            content: "";
            position: absolute;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(100,200,150,0.15), transparent);
            filter: blur(80px);
            animation: floatBg 10s infinite ease-in-out;
            top: -100px;
            right: -100px;
          }
          
          @keyframes floatBg {
            0%,100% { transform: translate(0,0); }
            50% { transform: translate(40px, -30px); }
          }
          
          .guidance-container {
            display: flex;
            gap: 14px;
            position: relative;
            z-index: 10;
          }
          
          .guidance-card {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(10px);
            border-radius: 18px;
            border: 1px solid rgba(255,255,255,0.1);
            transition: all 0.3s ease;
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 40px 20px;
            min-height: 300px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }
          
          .guidance-card:hover {
            transform: translateY(-8px) scale(1.03);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255,255,255,0.2);
            flex: 1.5;
          }
          
          .guidance-icon {
            font-size: 2.4rem;
            margin-bottom: 16px;
            line-height: 1;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
          }
          
          .guidance-circle-img {
            width: 130px;
            height: 130px;
            border-radius: 50%;
            overflow: hidden;
            margin-bottom: 18px;
            border: 2px solid rgba(255,255,255,0.2);
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            flex-shrink: 0;
            transition: all 0.3s ease;
          }
          
          .guidance-card:hover .guidance-circle-img {
            transform: scale(1.05);
            box-shadow: 0 12px 30px rgba(0,0,0,0.4);
          }
          
          .guidance-circle-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center center;
            display: block;
            color: transparent;
            transition: transform 0.3s ease;
          }
          
          .guidance-card:hover .guidance-circle-img img {
            transform: scale(1.1);
          }
          
          .guidance-title {
            font-family: 'Playfair Display', serif;
            font-size: 1.1rem;
            font-weight: 800;
            color: #ffffff;
            margin: 0 0 10px 0;
            line-height: 1.3;
            transition: all 0.3s ease;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .guidance-desc {
            font-family: 'Poppins', sans-serif;
            font-size: 0.78rem;
            font-weight: 300;
            color: #e8f5ee;
            line-height: 1.8;
            margin: 0;
            opacity: 0;
            max-height: 0;
            overflow: hidden;
            transition: opacity 0.5s ease, max-height 0.5s ease;
            text-shadow: 0 1px 2px rgba(0,0,0,0.1);
          }
          
          .guidance-card:hover .guidance-desc {
            opacity: 1;
            max-height: 120px;
          }
          
          .guidance-card:hover .guidance-title {
            color: #64c896;
            transform: translateY(-2px);
          }
          
          .guidance-card:active {
            transform: scale(0.97);
          }
          
          .guidance-card.active {
            background: linear-gradient(135deg, #a8d5ba, #7fbf9f);
            transform: scale(1.05);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            border-color: rgba(255,255,255,0.3);
          }
          
          .guidance-card.active::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 18px;
            background: radial-gradient(circle, rgba(255,255,255,0.2), transparent);
            opacity: 0.6;
            pointer-events: none;
          }
          
          .guidance-card.active .guidance-title {
            color: #1b4332;
            transform: translateY(-2px);
          }
          
          .guidance-card.active .guidance-desc {
            opacity: 1;
            max-height: 120px;
            color: #1a2e1a;
          }
          
          .guidance-card.active .guidance-circle-img {
            border-color: rgba(255,255,255,0.4);
            box-shadow: 0 12px 30px rgba(0,0,0,0.4);
          }
        `}</style>

      </div>
    </section>
  );
};

// Consult Section
const ConsultSection: React.FC = () => (
  <section id="consult" className="py-20 px-6 text-center" style={{ background: 'linear-gradient(135deg, #f0f9f0 0%, #ffffff 50%, #f0f9f0 100%)' }}>
    <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Cinzel', serif", color: '#1b4332' }}>Free of Charge</p>
    <h2 className="text-3xl mb-3" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, color: '#0d2b0d' }}>
      Consult Us for <span className="italic" style={{ color: '#2d6a4f' }}>Free Guidance</span>
    </h2>
    <div className="w-16 h-px bg-amber-600/50 mx-auto mb-6" />
    <p className="text-center max-w-xl mx-auto mb-10 text-sm leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400, color: '#2d4a2d' }}>
      Struggling with sleep, stress, anxiety, or focus? Our experts are here to help — at no cost.
    </p>
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {['Sleep Issues', 'Stress & Anxiety', 'Focus Problems', 'Emotional Balance', 'Spiritual Growth', 'Physical Tension'].map(item => (
        <span key={item} className="px-4 py-2 rounded-full text-xs tracking-widest uppercase border bg-white/70" style={{ fontFamily: "'Cinzel', serif", color: '#1b4332', borderColor: '#52b788' }}>{item}</span>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
      <a href="tel:+917780754541" className="p-8 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border bg-white/80 cursor-pointer group no-underline" style={{ borderColor: '#52b78855' }}>
        <h4 className="text-base font-medium mb-2 transition-colors" style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.1em', color: '#1a2e1a' }}>Call Us</h4>
        <p className="text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif", color: '#2d6a4f' }}>+91 77807 54541</p>
      </a>
      <div className="p-8 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border bg-white/80 cursor-pointer" style={{ borderColor: '#52b78855' }}>
        <h4 className="text-base font-medium mb-2" style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.1em', color: '#1a2e1a' }}>Live Chat</h4>
        <p className="text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif", color: '#2d6a4f' }}>We're here to guide you</p>
      </div>
      <a href="mailto:nirvaha6@gmail.com" className="p-8 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border bg-white/80 cursor-pointer no-underline" style={{ borderColor: '#52b78855' }}>
        <h4 className="text-base font-medium mb-2" style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.1em', color: '#1a2e1a' }}>Email Us</h4>
        <p className="text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif", color: '#2d6a4f' }}>nirvaha6@gmail.com</p>
      </a>
    </div>
    <p className="text-center text-xs mt-10 tracking-widest" style={{ fontFamily: "'Cinzel', serif", color: '#2d6a4f' }}>✦ 100% Free &nbsp;·&nbsp; No Obligations &nbsp;·&nbsp; Expert Guidance ✦</p>
  </section>
);

const ActionCard: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="p-8 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border bg-white/80 cursor-pointer group" style={{ borderColor: '#52b78855' }}>
    <h4 className="text-base font-medium mb-1 transition-colors" style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.1em', color: '#1a2e1a' }}>{title}</h4>
    <p className="text-xs" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400, color: '#2d6a4f' }}>{subtitle}</p>
  </div>
);

const Footer: React.FC = () => (
  <footer className="py-6 text-center text-xs text-stone-400 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200/30 tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>
    ॐ &nbsp; 2024 Nirvaha Meditation Guide &nbsp; ॐ
  </footer>
);
