import React ,{ useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BACKEND_CONFIG from "../../config/backend";

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
      <MeditationSessions />
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
  const [currentSet, setCurrentSet] = React.useState<0 | 1>(0);
  const [transitioning, setTransitioning] = React.useState(false);

  const switchSet = (next: 0 | 1) => {
    if (transitioning || next === currentSet) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentSet(next);
      setTransitioning(false);
    }, 320);
  };

  const posesSet1 = [
    {
      src: "/poses for medittaion/easy 1.jpg",
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
      essence: "The gateway pose — where stillness begins and the inner journey unfolds. Sukhasana invites the wandering mind home.",
      origin: "Rooted in the Hatha Yoga Pradipika (15th century), Sukhasana is the foundational seat prescribed for all beginners entering the path of Dhyana.",
      mentalBenefits: ["Quiets mental chatter and restless thoughts", "Cultivates patience and inner acceptance", "Reduces anxiety and emotional reactivity"],
      physicalBenefits: ["Gently opens hip flexors and inner groin", "Lengthens the spine and improves posture", "Relieves mild knee and ankle tension"],
      chakra: "Muladhara (Root Chakra) — grounds scattered energy, builds a sense of safety and belonging in the present moment.",
      breathingTechnique: "Sama Vritti (Equal Breathing) — inhale for 4 counts, exhale for 4 counts. Let the breath become a gentle tide.",
      bestTime: "Early morning at sunrise or just before sleep. Practice on an empty stomach for deepest benefit.",
      beginnerTip: "Place a folded blanket under your hips to ease lower back strain. Start with just 5 minutes and gradually extend.",
    },
    {
      src: "/poses for medittaion/cosmic 2.png",
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
      essence: "A dissolution of self into the infinite — where the meditator, the act of meditation, and the object of focus become one luminous whole.",
      origin: "Described in the Yoga Sutras of Patanjali as Samadhi — the eighth and final limb of Ashtanga Yoga, attained through sustained Dhyana practice.",
      mentalBenefits: ["Dissolves the boundary between self and universe", "Releases deep-seated mental conditioning", "Awakens intuition and inner knowing"],
      physicalBenefits: ["Lowers cortisol and blood pressure significantly", "Activates the parasympathetic nervous system", "Reduces chronic fatigue and mental exhaustion"],
      chakra: "Sahasrara (Crown Chakra) — opens the thousand-petalled lotus at the crown, connecting individual consciousness to universal awareness.",
      breathingTechnique: "Nadi Shodhana (Alternate Nostril) — 5 counts inhale, 2 hold, 7 exhale. Balances solar and lunar energy channels.",
      bestTime: "Brahma Muhurta — 90 minutes before sunrise. The veil between inner and outer worlds is thinnest at this sacred hour.",
      beginnerTip: "Begin with 10 minutes of breath observation before attempting this state. Do not force stillness — simply allow it to arise.",
    },
    {
      src: "/poses for medittaion/thunder 3.png",
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
      essence: "Named after Vajra — the indestructible thunderbolt of Indra. This pose forges the practitioner into an immovable pillar of awareness.",
      origin: "Prescribed in both the Hatha Yoga Pradipika and Ayurvedic texts as the only asana safe to practice immediately after eating, aiding the digestive fire (Agni).",
      mentalBenefits: ["Builds unwavering mental concentration", "Dissolves restlessness and scattered thinking", "Cultivates inner discipline and willpower"],
      physicalBenefits: ["Stimulates digestive organs and relieves bloating", "Strengthens the lumbar spine and pelvic floor", "Improves circulation in the lower limbs"],
      chakra: "Manipura (Solar Plexus Chakra) — ignites the inner fire of transformation, willpower, and personal strength.",
      breathingTechnique: "Kapalabhati (Skull-Shining Breath) — rhythmic forceful exhales to stoke digestive fire, followed by natural inhales.",
      bestTime: "After meals for digestion, or morning for grounding. Hold for 5–15 minutes to receive full benefit.",
      beginnerTip: "Place a rolled blanket between your thighs and calves if knees feel pressure. Gradually increase sitting duration over weeks.",
    },
    {
      src: "/poses for medittaion/lotus 4.png",
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
      essence: "The lotus rises pure from muddy waters — a living symbol of the soul's journey from ignorance to enlightenment, from suffering to liberation.",
      origin: "Revered across Hindu, Buddhist, and Jain traditions for over 3,000 years. Depicted in ancient Vedic texts as the supreme seat of the gods and enlightened masters.",
      mentalBenefits: ["Awakens Kundalini energy through the central channel", "Induces profound states of meditative absorption", "Cultivates equanimity and spiritual clarity"],
      physicalBenefits: ["Opens hip joints and sacroiliac region deeply", "Strengthens the spine and core musculature", "Stimulates the abdominal organs and improves circulation"],
      chakra: "Anahata (Heart Chakra) & Svadhisthana (Sacral Chakra) — opens the heart to unconditional love while awakening creative life force.",
      breathingTechnique: "Ujjayi (Victorious Breath) — gentle constriction of the throat creates an oceanic sound, deepening focus and extending the breath cycle.",
      bestTime: "Dawn or dusk — the transitional hours when solar and lunar energies are in perfect balance. Ideal for extended meditation.",
      beginnerTip: "Practice Half Lotus (one foot on opposite thigh) for several months before attempting full Padmasana. Never force the knees.",
    },
    {
      src: "/poses for medittaion/corpus 5.png",
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
      essence: "A conscious rehearsal of death and rebirth — the ego dissolves, the body rests, and the spirit remembers its boundless nature.",
      origin: "Described in the Hatha Yoga Pradipika as the remover of fatigue and the giver of rest to the mind. Considered the most difficult pose to master due to the art of conscious surrender.",
      mentalBenefits: ["Triggers the relaxation response in the nervous system", "Releases unconscious muscular and emotional holding", "Integrates the benefits of all preceding practice"],
      physicalBenefits: ["Lowers blood pressure and heart rate measurably", "Reduces cortisol and inflammatory markers", "Allows cellular repair and deep tissue recovery"],
      chakra: "All seven chakras — Savasana allows prana to flow freely through every energy center, harmonizing the entire subtle body.",
      breathingTechnique: "Natural Breath (Svabhavika Pranayama) — no control, no effort. Simply witness the breath as it breathes itself in complete surrender.",
      bestTime: "At the close of every yoga or meditation session. Also deeply restorative during afternoon fatigue or before sleep.",
      beginnerTip: "Cover yourself with a light blanket to prevent chilling. Use an eye pillow to deepen the sense of withdrawal from the outer world.",
    },
    {
      src: "/poses for medittaion/zen 6.png",
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
      essence: "Just sitting — Shikantaza. No goal, no attainment, no path. The practice itself is the destination, and this moment is already complete.",
      origin: "Transmitted by Bodhidharma from India to China in the 5th century CE, Zazen became the heart of Zen Buddhism. Dogen Zenji formalized it in 13th century Japan as the direct expression of enlightenment.",
      mentalBenefits: ["Dissolves the compulsive need to achieve or become", "Sharpens bare attention to the present moment", "Cultivates radical acceptance of what is"],
      physicalBenefits: ["Regulates the autonomic nervous system", "Improves spinal alignment and core stability", "Reduces tension headaches and jaw clenching"],
      chakra: "Ajna (Third Eye Chakra) — the half-open downward gaze activates the inner witness, the silent observer behind all experience.",
      breathingTechnique: "Shizen Kokyu (Natural Breath) — breathe from the hara (lower abdomen), 4 counts in, 1 hold, 5 counts out. Let breath anchor awareness.",
      bestTime: "Early morning before the mind fills with the day's concerns. Traditionally practiced facing a wall to minimize distraction.",
      beginnerTip: "Use a zafu (round cushion) to elevate the hips above the knees. Begin with 10-minute sits and add 5 minutes each week.",
    },
    {
      src: "/poses for medittaion/tree 7.png",
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
      essence: "The tree does not struggle to stand — it simply is. Vrikshasana teaches the meditator to be fully present, rooted in stillness while remaining open to the sky.",
      origin: "One of the oldest standing asanas, depicted in ancient temple carvings across India. Referenced in the Gheranda Samhita as a posture that develops steadiness of body and mind.",
      mentalBenefits: ["Develops Dharana (one-pointed concentration)", "Builds mental resilience and emotional steadiness", "Reduces anxiety through focused present-moment awareness"],
      physicalBenefits: ["Strengthens ankles, calves, and stabilizing muscles", "Improves proprioception and neuromuscular coordination", "Opens the hip of the raised leg, releasing stored tension"],
      chakra: "Muladhara (Root) & Anahata (Heart) — grounds energy through the standing foot while opening the heart through raised arms in prayer.",
      breathingTechnique: "Sama Vritti (Equal Breath) — 5 counts inhale, 5 counts exhale. The symmetry of breath mirrors the symmetry of balance in the pose.",
      bestTime: "Morning practice to set a tone of focus and groundedness for the day. Hold each side for 1–3 minutes.",
      beginnerTip: "Place the raised foot on the calf (never the knee joint) if the inner thigh is not yet accessible. Use a wall for support initially.",
    },
    {
      src: "/poses for medittaion/deep 8.png",
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
      essence: "Dhyana is not something you do — it is something that happens when all doing ceases. The river of awareness flows unbroken, effortless, and luminous.",
      origin: "The seventh of Patanjali's eight limbs of yoga, Dhyana is the sustained, uninterrupted flow of attention toward a single object — the bridge between concentration (Dharana) and liberation (Samadhi).",
      mentalBenefits: ["Dissolves the observer-observed duality", "Accesses theta and delta brainwave states naturally", "Permanently reduces baseline anxiety and reactivity"],
      physicalBenefits: ["Measurably reduces inflammatory biomarkers", "Lowers resting heart rate and blood pressure long-term", "Enhances immune function and cellular regeneration"],
      chakra: "Sahasrara (Crown) & Ajna (Third Eye) — the upper chakras open like a lotus in full bloom, receiving the light of pure consciousness.",
      breathingTechnique: "Kevala Kumbhaka (Spontaneous Breath Retention) — as Dhyana deepens, the breath naturally suspends. Do not force; allow this to arise organically.",
      bestTime: "After 20–30 minutes of pranayama practice. The mind is most receptive to deep meditation when the breath has been refined and steadied.",
      beginnerTip: "Use a mantra or trataka (candle gazing) as an anchor for the first 6 months. Dhyana arises naturally from consistent Dharana practice.",
    },
  ];

  const posesSet2 = [
    {
      src: "/yoga for meditation/bound. 1.png",
      label: "Bound Angle Pose",
      sanskrit: "Baddha Konasana",
      num: "01",
      description: "A deeply opening seated posture that releases the hips and inner thighs, preparing the body for extended meditation.",
      benefits: ["Opens hips and groin deeply", "Stimulates abdominal organs", "Relieves mild depression", "Soothes menstrual discomfort"],
      steps: ["Sit tall, bring soles of feet together", "Let knees fall open to sides", "Hold feet with both hands", "Breathe and gently fold forward"],
      inhale: 4, hold: 0, exhale: 6, sessionText: "Open and release",
      breathingTip: "Slow exhales to deepen the hip opening. Let each breath release tension from the inner thighs.",
      postureGuide: "Keep spine long. Do not force knees down — let gravity do the work over time.",
      sessionInfo: "Hip-opening session for emotional release. Stored tension in the hips dissolves with patient practice.",
      mindFocus: "Surrender. With each exhale, release the need to control and allow the body to open naturally.",
      objectPosition: "center",
      essence: "The butterfly rests with wings open — Baddha Konasana teaches the art of yielding, of opening without force, of trusting the process of unfolding.",
      origin: "Described in the Hatha Yoga Pradipika as a destroyer of disease. Traditionally practiced by cobblers in India for hours daily, earning it the name 'Cobbler's Pose'.",
      mentalBenefits: ["Releases emotional tension stored in the hips", "Cultivates patience and non-striving", "Reduces anxiety and mild depression"],
      physicalBenefits: ["Deeply opens hip flexors and inner groin", "Stimulates kidneys, bladder, and prostate", "Improves circulation in the lower body"],
      chakra: "Svadhisthana (Sacral Chakra) — unlocks creative energy, emotional fluidity, and the capacity for joy and pleasure.",
      breathingTechnique: "Dirgha (Three-Part Breath) — fill belly, ribs, then chest on inhale. Release chest, ribs, belly on exhale. 4 counts each.",
      bestTime: "Evening practice to release the day's accumulated tension. Also excellent before seated meditation to open the hips.",
      beginnerTip: "Sit on a folded blanket to tilt the pelvis forward. Place blocks under both knees for support if hips are tight.",
    },
    {
      src: "/yoga for meditation/seated 2.png",
      label: "Seated Meditation",
      sanskrit: "Sukhasana Dhyana",
      num: "02",
      description: "The quintessential meditation seat — simple, stable, and open. The foundation from which all inner journeys begin.",
      benefits: ["Establishes meditation posture", "Calms the nervous system", "Improves spinal alignment", "Deepens breath awareness"],
      steps: ["Sit cross-legged on a cushion", "Rest hands on knees in Jnana Mudra", "Lengthen spine on each inhale", "Soften face and jaw completely"],
      inhale: 5, hold: 1, exhale: 6, sessionText: "Settle into stillness",
      breathingTip: "Natural rhythmic breathing. Allow the breath to find its own pace without interference.",
      postureGuide: "Alternate which leg is in front each session. Keep ears over shoulders, chin slightly tucked.",
      sessionInfo: "Foundation meditation session. The simplest and most accessible entry point into formal practice.",
      mindFocus: "The present moment. Simply notice what is here — sounds, sensations, the breath — without labeling or judging.",
      objectPosition: "center",
      essence: "In the simplicity of sitting, everything is found. Sukhasana Dhyana is the reminder that the path inward requires no special equipment — only willingness.",
      origin: "The most ancient of all meditation postures, depicted in Indus Valley seals dating to 2500 BCE. The universal human posture of contemplation across all traditions.",
      mentalBenefits: ["Establishes a consistent meditation anchor", "Reduces mental fragmentation and distraction", "Builds the habit of present-moment awareness"],
      physicalBenefits: ["Improves posture and spinal health over time", "Reduces lower back tension with consistent practice", "Regulates breathing patterns and lung capacity"],
      chakra: "Muladhara (Root) — the grounded seat activates the foundation chakra, creating safety and stability for the inner journey.",
      breathingTechnique: "Anuloma Viloma (Natural Alternate Nostril) — breathe naturally, noticing which nostril is dominant. Simply observe without control.",
      bestTime: "Same time daily to build a consistent practice. Morning is ideal — the mind is clearest before the day's demands arise.",
      beginnerTip: "Set a gentle timer for 10 minutes. When the mind wanders, simply return to the breath without self-criticism. This returning is the practice.",
    },
    {
      src: "/yoga for meditation/staff 3.png",
      label: "Staff Pose",
      sanskrit: "Dandasana",
      num: "03",
      description: "The foundational seated posture — a staff of awareness. Dandasana builds the spinal strength that supports all seated meditation.",
      benefits: ["Strengthens spine and core", "Improves posture", "Stretches shoulders and chest", "Calms the mind through alignment"],
      steps: ["Sit with legs extended forward", "Press thighs and heels into floor", "Sit tall, spine like a staff", "Flex feet, hands beside hips"],
      inhale: 4, hold: 2, exhale: 4, sessionText: "Align and strengthen",
      breathingTip: "Steady equal breathing. Each inhale lengthens the spine; each exhale roots the sitting bones deeper.",
      postureGuide: "Engage the core gently. Do not lock the knees. Keep the spine vertical, not leaning back.",
      sessionInfo: "Alignment session for spinal health. A strong spine is the foundation of a strong meditation practice.",
      mindFocus: "Vertical alignment. Feel the spine as a channel of energy connecting earth below to sky above.",
      objectPosition: "center",
      essence: "The staff is both a support and a symbol of authority. Dandasana teaches the meditator to be their own support — upright, dignified, and self-reliant.",
      origin: "Referenced in the Yoga Sutras as the basis for all seated asanas. The name Danda means 'staff' or 'rod' — symbolizing the spine as the axis of the body.",
      mentalBenefits: ["Cultivates mental uprightness and dignity", "Builds discipline through simple sustained effort", "Improves focus through physical alignment"],
      physicalBenefits: ["Strengthens the erector spinae and core muscles", "Stretches the hamstrings and calves", "Improves kidney and liver function through compression"],
      chakra: "Manipura (Solar Plexus) — the engaged core activates personal power, discipline, and the fire of transformation.",
      breathingTechnique: "Sama Vritti (Box Breathing) — 4 counts inhale, 2 hold, 4 exhale, 2 hold. Creates mental steadiness matching physical alignment.",
      bestTime: "Morning practice to set a tone of uprightness for the day. Hold for 1–3 minutes as a preparatory pose.",
      beginnerTip: "Sit on a folded blanket if hamstrings are tight. Slightly bend the knees if the lower back rounds. Alignment matters more than straight legs.",
    },
    {
      src: "/yoga for meditation/cow 4.png",
      label: "Cow Face Pose",
      sanskrit: "Gomukhasana",
      num: "04",
      description: "A deep hip and shoulder opener that releases the body's most stubborn tension, creating space for profound stillness.",
      benefits: ["Opens hips and shoulders simultaneously", "Relieves chronic tension", "Improves posture", "Deepens breath capacity"],
      steps: ["Stack knees on top of each other", "Sit between the heels", "Reach one arm up, one behind back", "Clasp hands or use a strap"],
      inhale: 5, hold: 0, exhale: 7, sessionText: "Release deep tension",
      breathingTip: "Long slow exhales to release shoulder and hip tension. Breathe into the areas of resistance.",
      postureGuide: "Keep the spine tall. Do not collapse the chest. Work both sides equally for balance.",
      sessionInfo: "Deep release session for chronic tension. Gomukhasana reaches the places where stress hides most deeply.",
      mindFocus: "Acceptance of resistance. Notice where the body holds tension and breathe into it with compassion rather than force.",
      objectPosition: "center",
      essence: "Named for the shape of a cow's face — wide at the hips, narrow at the knees. Gomukhasana teaches us to find grace in asymmetry and peace in discomfort.",
      origin: "One of the 84 classical asanas described in the Hatha Yoga Pradipika. Traditionally used to open the body before pranayama and meditation practice.",
      mentalBenefits: ["Releases emotional armoring in shoulders and hips", "Cultivates equanimity in the face of discomfort", "Builds patience and non-reactivity"],
      physicalBenefits: ["Deeply stretches hip rotators and IT band", "Opens chest and shoulder girdle", "Relieves chronic lower back and sacral tension"],
      chakra: "Anahata (Heart Chakra) — the chest opening releases grief and emotional holding, allowing the heart to breathe freely.",
      breathingTechnique: "Viloma (Interrupted Breath) — pause briefly mid-inhale and mid-exhale. This deepens awareness of the breath's journey through the body.",
      bestTime: "Evening to release the day's accumulated physical and emotional tension. Hold each side for 2–5 minutes.",
      beginnerTip: "Use a yoga strap between the hands if they cannot clasp. Sit on a block if the hips are uneven. Never force the shoulder joint.",
    },
    {
      src: "/yoga for meditation/camel 5.png",
      label: "Camel Pose",
      sanskrit: "Ustrasana",
      num: "05",
      description: "A powerful heart-opening backbend that awakens courage, vulnerability, and the expansive energy of the chest and throat.",
      benefits: ["Opens heart and chest fully", "Strengthens spine", "Stimulates nervous system", "Releases deep emotional holding"],
      steps: ["Kneel with hips over knees", "Place hands on lower back", "Lift chest and arch back gently", "Reach for heels if accessible"],
      inhale: 5, hold: 2, exhale: 6, sessionText: "Open your heart",
      breathingTip: "Expansive inhales to lift and open the chest. Exhale to deepen the backbend without collapsing.",
      postureGuide: "Keep thighs vertical. Do not compress the lower back — lengthen before bending. Tuck chin slightly.",
      sessionInfo: "Heart-opening session for courage and vulnerability. Ustrasana invites you to face the world with an open chest.",
      mindFocus: "Openness. Feel the front of the body expanding with each breath, creating space for new possibilities.",
      objectPosition: "center",
      essence: "The camel carries its sustenance within — Ustrasana teaches us that our greatest resource is the open heart, always available, always nourishing.",
      origin: "A classical backbend from the Hatha tradition, Ustrasana is used in Kundalini yoga to activate the heart center and stimulate the thymus gland for immunity.",
      mentalBenefits: ["Releases fear and emotional armoring around the heart", "Cultivates courage and vulnerability", "Combats depression through chest opening"],
      physicalBenefits: ["Stretches the entire front body from ankles to throat", "Strengthens the back muscles and spine", "Stimulates the thyroid and parathyroid glands"],
      chakra: "Anahata (Heart) & Vishuddha (Throat) — opens both the heart to love and the throat to authentic expression.",
      breathingTechnique: "Bhramari (Humming Bee Breath) — after the pose, hum on the exhale. The vibration soothes the nervous system activated by the backbend.",
      bestTime: "Mid-morning when energy is rising. Always follow with a forward fold to neutralize the spine.",
      beginnerTip: "Keep hands on lower back rather than reaching for heels. Tuck toes under to raise the heels if needed. Never rush into deep backbends.",
    },
    {
      src: "/yoga for meditation/cobra 6.png",
      label: "Cobra Pose",
      sanskrit: "Bhujangasana",
      num: "06",
      description: "The cobra rises with awareness — this gentle backbend awakens the spine, stimulates the heart, and builds the energy for meditation.",
      benefits: ["Strengthens spine and back muscles", "Opens chest and lungs", "Stimulates digestive organs", "Energizes the body gently"],
      steps: ["Lie face down, hands under shoulders", "Press tops of feet into mat", "Inhale and lift chest off floor", "Keep elbows slightly bent, shoulders down"],
      inhale: 5, hold: 1, exhale: 5, sessionText: "Rise with awareness",
      breathingTip: "Inhale to rise, exhale to hold. Feel the breath expanding the chest and ribcage with each cycle.",
      postureGuide: "Do not straighten arms fully. Keep the pubic bone on the mat. Shoulders away from ears.",
      sessionInfo: "Energizing session for the spine. Bhujangasana awakens the dormant energy of the back body.",
      mindFocus: "Rising awareness. Like the cobra lifting its hood, feel your consciousness rising from the base of the spine upward.",
      objectPosition: "center",
      essence: "The cobra does not rush its rise — it moves with deliberate, fluid awareness. Bhujangasana teaches the meditator to awaken gradually, with grace.",
      origin: "One of the most ancient asanas, depicted in 2nd century CE texts. In Kundalini tradition, Bhujangasana is used to awaken the serpent energy (Kundalini) at the base of the spine.",
      mentalBenefits: ["Combats fatigue and mild depression", "Builds confidence and sense of personal power", "Awakens alertness without agitation"],
      physicalBenefits: ["Strengthens the entire posterior chain", "Opens the chest and increases lung capacity", "Stimulates the kidneys and adrenal glands"],
      chakra: "Manipura (Solar Plexus) & Anahata (Heart) — activates personal power while simultaneously opening the heart.",
      breathingTechnique: "Surya Bhedana (Right Nostril Breathing) — inhale through right nostril only. Activates solar energy, warming and energizing the body.",
      bestTime: "Morning practice to energize the body and spine for the day. Excellent as preparation before seated meditation.",
      beginnerTip: "Keep the lift low — even 2 inches off the mat is sufficient. Focus on length rather than height. Never strain the lower back.",
    },
    {
      src: "/yoga for meditation/boat 7.png",
      label: "Boat Pose",
      sanskrit: "Navasana",
      num: "07",
      description: "Balance on the waters of the mind — Navasana builds the core strength and mental fortitude that sustains long meditation practice.",
      benefits: ["Strengthens core and hip flexors", "Builds mental determination", "Improves balance", "Stimulates digestive fire"],
      steps: ["Sit with knees bent, feet flat", "Lean back slightly, lift feet", "Extend arms forward parallel to floor", "Straighten legs to form a V-shape"],
      inhale: 4, hold: 3, exhale: 5, sessionText: "Find your center",
      breathingTip: "Steady breath despite the challenge. The ability to breathe calmly under effort is the essence of pranayama.",
      postureGuide: "Keep the spine long, not rounded. Engage the lower belly. Gaze forward or at the toes.",
      sessionInfo: "Core strength session for mental fortitude. The physical challenge of Navasana mirrors the mental challenge of sustained meditation.",
      mindFocus: "Steadiness under pressure. Notice the mind's urge to give up and choose to stay one more breath.",
      objectPosition: "center",
      essence: "The boat navigates turbulent waters by staying centered — Navasana teaches the meditator to find stillness at the core even when the surface of the mind is stormy.",
      origin: "Referenced in classical Hatha texts as a strengthening pose for the digestive fire (Agni). In modern practice, it is the cornerstone of core-strengthening sequences.",
      mentalBenefits: ["Builds mental determination and willpower", "Develops the capacity to stay present under discomfort", "Cultivates confidence through physical challenge"],
      physicalBenefits: ["Strengthens the transverse abdominis and hip flexors", "Stimulates the kidneys, thyroid, and intestines", "Improves balance and proprioception"],
      chakra: "Manipura (Solar Plexus) — the engaged core directly activates the seat of personal power, will, and transformation.",
      breathingTechnique: "Kumbhaka (Breath Retention) — hold the breath briefly at the top of the inhale while in the pose. Builds internal heat and concentration.",
      bestTime: "Morning or midday when energy is available. Never practice on a full stomach. Hold for 5 breaths, rest, repeat 3 times.",
      beginnerTip: "Keep knees bent and hold the backs of the thighs for support. Focus on a long spine over straight legs. Build duration gradually.",
    },
    {
      src: "/yoga for meditation/seated twist 8.png",
      label: "Seated Twist",
      sanskrit: "Ardha Matsyendrasana",
      num: "08",
      description: "The spine is wrung like a cloth — releasing toxins, awakening energy, and creating the clarity needed for deep meditation.",
      benefits: ["Detoxifies digestive organs", "Increases spinal mobility", "Stimulates nervous system", "Improves focus and alertness"],
      steps: ["Sit with legs extended", "Bend right knee, place foot outside left thigh", "Inhale to lengthen spine", "Exhale and twist right, left elbow outside right knee"],
      inhale: 4, hold: 1, exhale: 6, sessionText: "Wring and release",
      breathingTip: "Inhale to lengthen before twisting. Exhale to deepen the twist. Never force — let the breath guide the rotation.",
      postureGuide: "Twist from the base of the spine upward. Keep both sitting bones grounded. Look over the back shoulder.",
      sessionInfo: "Detoxifying session for clarity. Twists compress and release the organs, flushing toxins and awakening energy.",
      mindFocus: "Release of the old. As you twist, visualize releasing stagnant thoughts, emotions, and patterns that no longer serve.",
      objectPosition: "center",
      essence: "Named after the sage Matsyendra, who received the secrets of yoga from Shiva himself. This twist is said to awaken the dormant wisdom within the spine.",
      origin: "One of the original 84 asanas described by Matsyendranath, founder of the Natha tradition. Considered essential for maintaining spinal health and pranic flow.",
      mentalBenefits: ["Clears mental fog and improves cognitive clarity", "Releases emotional stagnation held in the torso", "Awakens alertness and fresh perspective"],
      physicalBenefits: ["Massages and detoxifies the liver, kidneys, and spleen", "Increases rotational mobility of the thoracic spine", "Relieves lower back pain and sciatica"],
      chakra: "Manipura (Solar Plexus) & Anahata (Heart) — the twist activates digestive fire while the rotation opens the heart to new perspectives.",
      breathingTechnique: "Anuloma Viloma (Alternate Nostril) — after the twist, practice 5 rounds to balance the energy channels activated by the rotation.",
      bestTime: "Morning to stimulate digestion and awaken the spine. Practice both sides equally, holding each for 5–10 breaths.",
      beginnerTip: "Keep the bottom leg extended if stacking the knees is uncomfortable. Use the hand on the floor behind you for support rather than forcing the twist.",
    },
  ];

  const poses = currentSet === 0 ? posesSet1 : posesSet2;

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

          {/* Back button */}
          <button
            className="med-nav-btn med-nav-back"
            onClick={() => switchSet(0)}
            disabled={currentSet === 0 || transitioning}
            aria-label="Previous pose set"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          {/* Next button */}
          <button
            className="med-nav-btn med-nav-next"
            onClick={() => switchSet(1)}
            disabled={currentSet === 1 || transitioning}
            aria-label="Next pose set"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          {/* Set indicator dots */}
          <div className="med-set-dots">
            <span className={`med-set-dot${currentSet === 0 ? ' med-set-dot-active' : ''}`} onClick={() => switchSet(0)} />
            <span className={`med-set-dot${currentSet === 1 ? ' med-set-dot-active' : ''}`} onClick={() => switchSet(1)} />
          </div>

          {/* Radial layout */}
          <div className="med-radial-container" style={{ opacity: transitioning ? 0 : 1, transform: transitioning ? 'scale(0.97)' : 'scale(1)', transition: 'opacity 0.32s ease, transform 0.32s ease' }}>
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
                    <img key={`${currentSet}-${i}`} src={card.src} alt={card.label} />
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

      {/* ── LUXURY GLASSMORPHISM MODAL ── */}
      {selected !== null && (
        <div className="med-modal-overlay" onClick={() => setSelectedPose(null)}>
          <div className="med-modal" onClick={e => e.stopPropagation()}>

            {/* Ambient glow orbs */}
            <div className="med-orb med-orb-1" />
            <div className="med-orb med-orb-2" />

            {/* Close */}
            <button className="med-modal-close" onClick={() => setSelectedPose(null)}>✕</button>

            {/* ── HEADER ── */}
            <div className="med-modal-header">
              <p className="med-modal-num-label">{(selected as any).num}</p>
              <p className="med-modal-sanskrit">{selected.sanskrit}</p>
              <h3 className="med-modal-title">{selected.label}</h3>
              <div className="med-title-rule" />
            </div>

            {/* ── BODY ── */}
            <div className="med-modal-body">

              {/* Row 1: Essence + Origin */}
              <div className="med-row-2">
                <div className="med-glass-card">
                  <p className="med-card-heading">Spiritual Essence</p>
                  <div className="med-card-rule" />
                  <p className="med-card-text">{(selected as any).essence}</p>
                </div>
                <div className="med-glass-card">
                  <p className="med-card-heading">Ancient Origin</p>
                  <div className="med-card-rule" />
                  <p className="med-card-text">{(selected as any).origin}</p>
                </div>
              </div>

              {/* Row 2: Benefits */}
              <div className="med-row-2">
                <div className="med-glass-card">
                  <p className="med-card-heading">Mental & Emotional</p>
                  <div className="med-card-rule" />
                  <ul className="med-list">
                    {(selected as any).mentalBenefits.map((b: string, i: number) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
                <div className="med-glass-card">
                  <p className="med-card-heading">Physical Benefits</p>
                  <div className="med-card-rule" />
                  <ul className="med-list">
                    {(selected as any).physicalBenefits.map((b: string, i: number) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Row 3: Chakra full-width */}
              <div className="med-glass-card med-card-wide">
                <p className="med-card-heading">Chakra & Energy Connection</p>
                <div className="med-card-rule" />
                <p className="med-card-text">{(selected as any).chakra}</p>
              </div>

              {/* Row 4: Breathing + Best Time */}
              <div className="med-row-2">
                <div className="med-glass-card">
                  <p className="med-card-heading">Breathing Technique</p>
                  <div className="med-card-rule" />
                  <p className="med-card-text">{(selected as any).breathingTechnique}</p>
                </div>
                <div className="med-glass-card">
                  <p className="med-card-heading">Best Practice Time</p>
                  <div className="med-card-rule" />
                  <p className="med-card-text">{(selected as any).bestTime}</p>
                </div>
              </div>

              {/* Row 5: Beginner Guidance full-width */}
              <div className="med-glass-card med-card-wide med-card-beginner">
                <p className="med-card-heading">Beginner Guidance</p>
                <div className="med-card-rule" />
                <p className="med-card-text">{(selected as any).beginnerTip}</p>
              </div>

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

        /* ── Nav buttons ── */
        .med-nav-btn {
          position: absolute;
          top: 50%; transform: translateY(-50%);
          z-index: 20;
          width: 44px; height: 44px;
          border-radius: 50%;
          background: rgba(0, 255, 157, 0.07);
          border: 1px solid rgba(0, 255, 157, 0.25);
          color: rgba(0, 255, 157, 0.80);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease, transform 0.25s ease, opacity 0.25s ease;
          backdrop-filter: blur(8px);
        }
        .med-nav-btn:hover:not(:disabled) {
          background: rgba(0, 255, 157, 0.16);
          border-color: rgba(0, 255, 157, 0.55);
          color: #00ff9d;
          transform: translateY(-50%) scale(1.10);
        }
        .med-nav-btn:disabled {
          opacity: 0.22;
          cursor: default;
        }
        .med-nav-back { left: 16px; }
        .med-nav-next { right: 16px; }

        /* Set indicator dots */
        .med-set-dots {
          position: absolute;
          bottom: 18px; left: 50%;
          transform: translateX(-50%);
          display: flex; gap: 8px;
          z-index: 20;
        }
        .med-set-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: rgba(0, 255, 157, 0.20);
          border: 1px solid rgba(0, 255, 157, 0.30);
          cursor: pointer;
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .med-set-dot-active {
          background: rgba(0, 255, 157, 0.75);
          border-color: #00ff9d;
          transform: scale(1.25);
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
          will-change: transform;
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
          will-change: transform;
          transform-origin: center;
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
          transition: border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease;
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

        /* ══════════════════════════════════════
           LIGHT GLASSMORPHISM MODAL
        ══════════════════════════════════════ */

        /* Overlay — soft sage mist */
        .med-modal-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(8, 24, 14, 0.60);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: med-fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes med-fade-in {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to   { opacity: 1; backdrop-filter: blur(24px); }
        }

        /* Modal container — light sage glass */
        .med-modal {
          position: relative;
          width: 100%;
          max-width: 820px;
          max-height: 88vh;
          overflow-y: auto;
          overflow-x: hidden;
          border-radius: 26px;
          background: linear-gradient(145deg, rgba(180, 230, 205, 0.88) 0%, rgba(155, 215, 185, 0.84) 100%);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.55);
          box-shadow:
            0 2px 0 rgba(255, 255, 255, 0.70) inset,
            0 28px 70px rgba(0, 0, 0, 0.28),
            0 0 0 1px rgba(134, 200, 160, 0.18);
          animation: med-scale-in 0.65s cubic-bezier(0.16, 1, 0.3, 1);
          scrollbar-width: thin;
          scrollbar-color: rgba(60, 140, 90, 0.30) transparent;
        }
        @keyframes med-scale-in {
          0%   { opacity: 0; transform: scale(0.90) translateY(28px); box-shadow: 0 0 0 rgba(134,210,166,0), 0 8px 20px rgba(0,0,0,0.15); }
          60%  { opacity: 1; }
          100% { opacity: 1; transform: scale(1) translateY(0); box-shadow: 0 2px 0 rgba(255,255,255,0.70) inset, 0 28px 70px rgba(0,0,0,0.28), 0 0 0 1px rgba(134,200,160,0.18); }
        }
        .med-modal::-webkit-scrollbar { width: 3px; }
        .med-modal::-webkit-scrollbar-thumb { background: rgba(60,140,90,0.30); border-radius: 4px; }

        /* Ambient orbs — soft sage bloom */
        .med-orb {
          position: absolute; border-radius: 50%;
          pointer-events: none; z-index: 0;
        }
        .med-orb-1 {
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(134, 210, 166, 0.22) 0%, transparent 65%);
          top: -140px; right: -100px;
          filter: blur(55px);
        }
        .med-orb-2 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(180, 230, 200, 0.18) 0%, transparent 65%);
          bottom: -80px; left: -60px;
          filter: blur(55px);
        }

        /* Close button */
        .med-modal-close {
          position: absolute; top: 18px; right: 18px; z-index: 20;
          width: 30px; height: 30px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.50);
          border: 1px solid rgba(134, 200, 160, 0.30);
          color: rgba(30, 90, 55, 0.70);
          font-size: 0.65rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.22s ease;
          backdrop-filter: blur(8px);
        }
        .med-modal-close:hover {
          background: rgba(134, 210, 166, 0.30);
          border-color: rgba(60, 160, 100, 0.50);
          color: rgba(20, 70, 40, 1);
          transform: rotate(90deg);
        }

        /* ── Header ── */
        .med-modal-header {
          position: relative; z-index: 2;
          padding: 46px 52px 30px;
          text-align: center;
          border-bottom: 1px solid rgba(30, 120, 70, 0.20);
        }
        .med-modal-num-label {
          font-family: 'Cinzel', serif;
          font-size: 0.6rem; letter-spacing: 0.55em;
          text-transform: uppercase;
          color: #1a6b3a;
          margin: 0 0 10px;
          font-weight: 600;
        }
        .med-modal-sanskrit {
          font-family: 'Cinzel', serif;
          font-size: 0.72rem; letter-spacing: 0.42em;
          text-transform: uppercase;
          color: #145c30;
          margin: 0 0 14px;
          font-weight: 700;
        }
        .med-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.9rem, 4vw, 2.6rem);
          font-weight: 800;
          font-style: italic;
          color: #0a2414;
          margin: 0;
          letter-spacing: 0.01em;
          line-height: 1.15;
        }
        .med-title-rule {
          width: 44px; height: 1px;
          background: linear-gradient(to right, transparent, rgba(20, 100, 55, 0.50), transparent);
          margin: 22px auto 0;
        }

        /* ── Body ── */
        .med-modal-body {
          position: relative; z-index: 2;
          padding: 28px 32px 38px;
          display: flex; flex-direction: column; gap: 12px;
        }

        /* Two-column row */
        .med-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* Glass card — solid white with green tint */
        .med-glass-card {
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(60, 160, 100, 0.22);
          border-radius: 18px;
          padding: 22px 24px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 2px 16px rgba(20, 90, 50, 0.10), 0 1px 0 rgba(255,255,255,0.90) inset;
          transition: background 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease;
        }
        .med-glass-card:hover {
          background: rgba(255, 255, 255, 0.88);
          border-color: rgba(40, 150, 85, 0.38);
          box-shadow: 0 6px 24px rgba(20, 90, 50, 0.14), 0 0 0 1px rgba(60, 170, 100, 0.18), 0 1px 0 rgba(255,255,255,1) inset;
        }
        .med-card-wide { grid-column: 1 / -1; }
        .med-card-beginner {
          background: rgba(210, 245, 225, 0.80);
          border-color: rgba(40, 150, 85, 0.28);
        }

        /* Card heading */
        .med-card-heading {
          font-family: 'Cinzel', serif;
          font-size: 0.6rem;
          letter-spacing: 0.30em;
          text-transform: uppercase;
          color: #0e4d26;
          margin: 0 0 10px;
          font-weight: 700;
        }
        .med-card-rule {
          width: 24px; height: 1px;
          background: rgba(20, 110, 60, 0.40);
          margin-bottom: 13px;
        }

        /* Card text */
        .med-card-text {
          font-family: 'Poppins', sans-serif;
          font-size: 0.84rem;
          line-height: 1.80;
          color: #0d2b18;
          margin: 0;
          font-weight: 500;
        }

        /* List */
        .med-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 10px;
        }
        .med-list li {
          font-family: 'Poppins', sans-serif;
          font-size: 0.82rem;
          line-height: 1.55;
          color: #0d2b18;
          font-weight: 500;
          padding-left: 16px;
          position: relative;
        }
        .med-list li::before {
          content: '';
          position: absolute; left: 0; top: 7px;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #1a7a42;
          box-shadow: 0 0 6px rgba(26, 122, 66, 0.40);
        }

        /* Mobile */
        @media (max-width: 640px) {
          .med-modal { border-radius: 20px; }
          .med-modal-header { padding: 36px 24px 22px; }
          .med-modal-body { padding: 20px 20px 28px; gap: 10px; }
          .med-row-2 { grid-template-columns: 1fr; }
          .med-modal-title { font-size: 1.7rem; }
        }

        /* ── Radial layout responsive ── */
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

// ── Breathing Modal ────────────────────────────────────────────────────────
const BreathingModal: React.FC<{ title: string; audioUrl?: string; onClose: () => void }> = ({ title, audioUrl, onClose }) => {
  type Phase = { label: string; duration: number; scale: number; color: string; hint: string };
  const PHASES: Phase[] = [
    { label: 'Inhale',  duration: 4, scale: 1.4,  color: '#52b788', hint: 'Breathe in slowly' },
    { label: 'Hold',    duration: 4, scale: 1.4,  color: '#40916c', hint: 'Hold gently'        },
    { label: 'Exhale',  duration: 6, scale: 0.75, color: '#74c69d', hint: 'Release slowly'     },
    { label: 'Rest',    duration: 2, scale: 0.75, color: '#95d5b2', hint: 'Pause...'            },
  ];
  const TOTAL = 5 * 60;
  const [started, setStarted] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const [cycles, setCycles] = useState(0);
  const phase = PHASES[phaseIdx];
  const ringSpeed = phase.label === 'Inhale' ? [8,13,18] : phase.label === 'Exhale' ? [4,7,10] : [6,10,14];
  const mm = String(Math.floor((TOTAL - totalElapsed) / 60)).padStart(2,'0');
  const ss = String((TOTAL - totalElapsed) % 60).padStart(2,'0');

  // Audio playback
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.loop = true;
      audio.volume = 0.5;
      audioRef.current = audio;
      audio.play().catch(() => {}); // autoplay may be blocked until user interaction
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    if (!started || done) return;
    const t = setInterval(() => {
      setPhaseElapsed(p => {
        const n = p + 1;
        if (n >= phase.duration) {
          setPhaseIdx(pi => { const np = (pi+1)%PHASES.length; if(np===0) setCycles(c=>c+1); return np; });
          return 0;
        }
        return n;
      });
      setTotalElapsed(p => { const n=p+1; if(n>=TOTAL){setDone(true);} return n; });
    }, 1000);
    return () => clearInterval(t);
  }, [started, done, phase.duration]);

  const reset = () => { setStarted(false); setPhaseIdx(0); setPhaseElapsed(0); setTotalElapsed(0); setDone(false); setCycles(0); };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
      animation: 'bm-fade 0.3s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'radial-gradient(ellipse at top, #0d2b1a 0%, #071a0f 60%, #030e08 100%)',
        borderRadius: '24px', width: '100%', maxWidth: '480px',
        padding: '32px 24px 28px', position: 'relative',
        animation: 'bm-pop 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        border: '1px solid rgba(82,183,136,0.2)',
        overflow: 'hidden',
      }}>
        <style>{`
          @keyframes bm-fade { from{opacity:0} to{opacity:1} }
          @keyframes bm-pop  { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
          @keyframes bm-spin-cw  { from{transform:translate(-50%,-50%) rotate(0deg)}   to{transform:translate(-50%,-50%) rotate(360deg)} }
          @keyframes bm-spin-ccw { from{transform:translate(-50%,-50%) rotate(0deg)}   to{transform:translate(-50%,-50%) rotate(-360deg)} }
          @keyframes bm-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(82,183,136,0.3)} 50%{box-shadow:0 0 0 12px rgba(82,183,136,0.08)} }
          @keyframes bm-star1 { from{transform:translateY(0) translateX(0)} to{transform:translateY(-400px) translateX(-60px)} }
          @keyframes bm-star2 { from{transform:translateY(0)} to{transform:translateY(-300px) translateX(80px)} }
          @keyframes bm-float { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-25px)} }
          .bm-stars1 { position:absolute;inset:0;pointer-events:none;
            background-image:radial-gradient(1.5px 1.5px at 10% 15%,rgba(168,230,207,0.8),transparent),radial-gradient(1px 1px at 30% 40%,rgba(255,255,255,0.6),transparent),radial-gradient(2px 2px at 55% 10%,rgba(149,213,178,0.7),transparent),radial-gradient(1px 1px at 75% 60%,rgba(255,255,255,0.5),transparent),radial-gradient(1.5px 1.5px at 85% 25%,rgba(168,230,207,0.8),transparent),radial-gradient(1px 1px at 20% 80%,rgba(255,255,255,0.6),transparent),radial-gradient(2px 2px at 90% 75%,rgba(116,198,157,0.6),transparent),radial-gradient(1px 1px at 45% 90%,rgba(255,255,255,0.5),transparent);
            background-size:400px 400px; animation:bm-star1 60s linear infinite; opacity:0.7; }
          .bm-stars2 { position:absolute;inset:0;pointer-events:none;
            background-image:radial-gradient(2px 2px at 25% 20%,rgba(168,230,207,0.5),transparent),radial-gradient(2px 2px at 70% 15%,rgba(212,160,23,0.4),transparent),radial-gradient(2px 2px at 50% 70%,rgba(149,213,178,0.4),transparent);
            background-size:500px 500px; animation:bm-star2 90s linear infinite reverse; opacity:0.5; }
          .bm-planet1 { position:absolute;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#6ec6a8,#1b4332 60%,transparent);top:-30px;left:-30px;filter:blur(3px);opacity:0.25;animation:bm-float 20s ease-in-out infinite;pointer-events:none; }
          .bm-planet2 { position:absolute;width:80px;height:80px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#d4a017,#5a3800 60%,transparent);bottom:-20px;right:-20px;filter:blur(2px);opacity:0.3;animation:bm-float 16s ease-in-out infinite reverse;pointer-events:none; }
        `}</style>

        {/* Cosmic bg */}
        <div className="bm-stars1" /><div className="bm-stars2" />
        <div className="bm-planet1" /><div className="bm-planet2" />

        {/* Close */}
        <button onClick={onClose} style={{ position:'absolute',top:'14px',right:'14px',zIndex:10,width:'30px',height:'30px',borderRadius:'50%',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(168,230,207,0.2)',color:'#A8E6CF',fontSize:'0.8rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>

        {/* Title */}
        <p style={{ textAlign:'center',fontSize:'0.65rem',letterSpacing:'0.25em',textTransform:'uppercase',color:'#74c69d',marginBottom:'4px',position:'relative',zIndex:1 }}>Guided Breathing</p>
        <h3 style={{ textAlign:'center',fontFamily:"'Playfair Display',serif",fontWeight:800,fontSize:'clamp(1rem,3vw,1.3rem)',color:'#e8f5e9',margin:'0 0 24px',position:'relative',zIndex:1 }}>{title}</h3>

        {/* Orbital */}
        <div onClick={() => {
          if (!started) {
            setStarted(true);
            // Start audio on user interaction (satisfies browser autoplay policy)
            if (audioRef.current && audioRef.current.paused) {
              audioRef.current.play().catch(() => {});
            }
          }
        }} style={{ position:'relative',width:'clamp(200px,50vw,260px)',height:'clamp(200px,50vw,260px)',margin:'0 auto',cursor:!started?'pointer':'default',zIndex:1 }}>
          {/* Ring 1 */}
          <div style={{ position:'absolute',borderRadius:'50%',width:'70%',height:'70%',border:`2px solid ${phase.color}55`,top:'50%',left:'50%',animation:`bm-spin-cw ${ringSpeed[0]}s linear infinite`,transition:'border-color 1.5s' }}>
            <div style={{ position:'absolute',top:'-5px',left:'50%',width:'10px',height:'10px',borderRadius:'50%',background:'#52b788',boxShadow:'0 0 8px #52b788',transform:'translateX(-50%)' }} />
          </div>
          {/* Ring 2 */}
          <div style={{ position:'absolute',borderRadius:'50%',width:'85%',height:'85%',border:`1.5px solid ${phase.color}33`,top:'50%',left:'50%',animation:`bm-spin-ccw ${ringSpeed[1]}s linear infinite`,transition:'border-color 1.5s' }}>
            <div style={{ position:'absolute',top:'-6px',left:'50%',width:'12px',height:'12px',borderRadius:'50%',background:'linear-gradient(135deg,#d4a017,#f0c040)',boxShadow:'0 0 10px rgba(212,160,23,0.8)',transform:'translateX(-50%)' }} />
          </div>
          {/* Ring 3 */}
          <div style={{ position:'absolute',borderRadius:'50%',width:'100%',height:'100%',border:`1px solid ${phase.color}22`,top:'50%',left:'50%',animation:`bm-spin-cw ${ringSpeed[2]}s linear infinite`,transition:'border-color 1.5s' }}>
            <div style={{ position:'absolute',top:'-4px',left:'50%',width:'8px',height:'8px',borderRadius:'50%',background:'#95d5b2',boxShadow:'0 0 6px rgba(149,213,178,0.7)',transform:'translateX(-50%)' }} />
          </div>
          {/* Center */}
          <div style={{ position:'absolute',top:'50%',left:'50%',transform:`translate(-50%,-50%) scale(${started ? phase.scale : 1})`,width:'45%',height:'45%',borderRadius:'50%',background:`linear-gradient(135deg,${phase.color}dd,#40916c)`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',transition:`transform ${phase.duration}s cubic-bezier(0.45,0,0.55,1), background 1.5s`,animation:started?'bm-pulse 4s ease-in-out infinite':'none',zIndex:10 }}>
            <span style={{ fontSize:'clamp(0.7rem,2vw,0.9rem)',fontWeight:700,color:'#fff',letterSpacing:'0.04em' }}>{done?'✓':started?phase.label:'Tap'}</span>
            {started && !done && <span style={{ fontSize:'0.6rem',color:'rgba(255,255,255,0.8)',marginTop:'2px' }}>{phase.duration - phaseElapsed}s</span>}
          </div>
        </div>

        {/* Hint */}
        <p style={{ textAlign:'center',fontSize:'0.8rem',color:'#95d5b2',marginTop:'16px',minHeight:'20px',position:'relative',zIndex:1 }}>
          {done ? 'Session complete 🌿' : started ? phase.hint : 'Tap the circle to begin'}
        </p>

        {/* Timer + cycles */}
        {started && !done && (
          <div style={{ display:'flex',justifyContent:'center',gap:'28px',marginTop:'14px',position:'relative',zIndex:1 }}>
            <div style={{ textAlign:'center' }}>
              <p style={{ fontFamily:"'Cinzel',serif",fontSize:'1.5rem',fontWeight:700,color:'#e8f5e9',margin:0 }}>{mm}:{ss}</p>
              <p style={{ fontSize:'0.6rem',color:'#74c69d',margin:0,letterSpacing:'0.1em',textTransform:'uppercase' }}>Remaining</p>
            </div>
            <div style={{ width:'1px',background:'rgba(168,230,207,0.15)' }} />
            <div style={{ textAlign:'center' }}>
              <p style={{ fontFamily:"'Cinzel',serif",fontSize:'1.5rem',fontWeight:700,color:'#e8f5e9',margin:0 }}>{cycles}</p>
              <p style={{ fontSize:'0.6rem',color:'#74c69d',margin:0,letterSpacing:'0.1em',textTransform:'uppercase' }}>Cycles</p>
            </div>
          </div>
        )}

        {/* Progress bar */}
        {started && (
          <div style={{ width:'200px',height:'3px',background:'rgba(168,230,207,0.1)',borderRadius:'4px',margin:'14px auto 0',overflow:'hidden',position:'relative',zIndex:1 }}>
            <div style={{ height:'100%',background:'linear-gradient(90deg,#52b788,#A8E6CF)',width:`${Math.min((totalElapsed/TOTAL)*100,100)}%`,transition:'width 1s linear' }} />
          </div>
        )}

        {/* Done buttons */}
        {done && (
          <div style={{ display:'flex',gap:'10px',justifyContent:'center',marginTop:'20px',position:'relative',zIndex:1 }}>
            <button onClick={reset} style={{ background:'linear-gradient(135deg,#52b788,#40916c)',color:'#fff',border:'none',borderRadius:'50px',padding:'9px 22px',fontSize:'0.8rem',fontWeight:600,cursor:'pointer',boxShadow:'0 4px 14px rgba(82,183,136,0.35)' }}>Restart</button>
            <button onClick={onClose} style={{ background:'rgba(255,255,255,0.08)',color:'#A8E6CF',border:'1px solid rgba(168,230,207,0.2)',borderRadius:'50px',padding:'9px 22px',fontSize:'0.8rem',fontWeight:600,cursor:'pointer' }}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Session Card Component ─────────────────────────────────────────────────
const SessionCard: React.FC<{ session: any; icon: string }> = ({ session, icon }) => {
  const [btnState, setBtnState] = useState<'idle' | 'starting'>('idle');
  const [showModal, setShowModal] = useState(false);

  const handleStart = () => {
    if (btnState !== 'idle') return;
    setBtnState('starting');
    setTimeout(() => { setBtnState('idle'); setShowModal(true); }, 500);
  };

  return (
    <>
      <style>{`
        .med-card {
          background: linear-gradient(145deg, #ffffff 0%, #f0fff4 100%);
          width: 100%; height: 100%; min-height: 240px;
          position: relative; display: flex; flex-direction: column;
          border-radius: 16px; box-shadow: 0 4px 20px rgba(82,183,136,0.08);
          overflow: visible; z-index: 0;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .med-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(82,183,136,0.14); }
        .med-card::before {
          content:""; position:absolute; z-index:-1; inset:-3px;
          background: linear-gradient(135deg,#d8f3dc,#b7e4c7,#95d5b2);
          border-radius:18px;
        }
        .med-card::after {
          content:""; position:absolute; z-index:-2; inset:-3px;
          background: linear-gradient(135deg,#d8f3dc,#b7e4c7,#95d5b2);
          border-radius:18px; filter:blur(14px); opacity:0; transition:opacity 0.4s;
        }
        .med-card:hover::after { animation: cardGlow 2.5s infinite forwards; }
        @keyframes cardGlow { 0%,100%{opacity:0.5} 50%{opacity:0.08} }
        .med-card-inner { position:relative; z-index:1; display:flex; flex-direction:column; flex:1; padding:18px; gap:10px; }
        .med-card-icon { font-size:1.2rem; opacity:0.7; transition:transform 0.2s; cursor:default; }
        .med-card:hover .med-card-icon { transform:scale(1.1); opacity:1; }
        .med-card-badge { font-size:0.62rem; font-weight:700; padding:3px 10px; border-radius:50px; font-family:'Poppins',sans-serif; }
        .med-card-badge.level { background:#DCEDC1; color:#1b4332; border:1px solid #b7e4c7; }
        .med-card-badge.cat   { background:#d8f3dc; color:#2d6a4f; border:1px solid #95d5b2; }
        .med-card-title { font-family:'Playfair Display',serif; font-weight:800; font-size:1rem; color:#111827; line-height:1.35; margin:0; }
        .med-card-desc  { font-family:'Poppins',sans-serif; font-size:0.75rem; color:#1f2937; line-height:1.65; margin:0; flex:1; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .med-card-dur   { font-size:0.7rem; color:#166534; font-family:'Poppins',sans-serif; font-weight:600; margin:0; }
        .med-card-btn {
          width:100%; padding:9px; border-radius:50px; border:none;
          font-size:0.78rem; font-weight:600; font-family:'Poppins',sans-serif;
          letter-spacing:0.04em; color:#fff; cursor:pointer;
          background:linear-gradient(135deg,#52b788,#40916c);
          box-shadow:0 3px 12px rgba(82,183,136,0.35); flex-shrink:0;
          transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
        }
        .med-card-btn:hover  { transform:scale(1.04); box-shadow:0 5px 18px rgba(82,183,136,0.5); }
        .med-card-btn:active { transform:scale(0.95); }
        .med-card-btn.starting { transform:scale(0.95); opacity:0.75; cursor:default; }
        @keyframes sc-pulse { 0%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(1.04)} }
      `}</style>

      <div className="med-card">
        <div className="med-card-inner">
          {/* Top row: badges + icon */}
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
            <div style={{ display:'flex', gap:'5px', flexWrap:'wrap', flex:1, marginRight:'8px' }}>
              {session.level    && <span className="med-card-badge level">{session.level}</span>}
              {session.category && <span className="med-card-badge cat">{session.category}</span>}
            </div>
            <span className="med-card-icon">{icon}</span>
          </div>
          <h3 className="med-card-title">{session.title}</h3>
          <p className="med-card-desc">{session.description || '\u00A0'}</p>
          <p className="med-card-dur">⏱ {session.duration} min</p>
          <button className={`med-card-btn${btnState==='starting'?' starting':''}`} onClick={handleStart}>
            {btnState === 'starting' ? 'Starting...' : 'Start Session'}
          </button>
        </div>
        {btnState === 'starting' && (
          <div style={{ position:'absolute',inset:0,borderRadius:'16px',border:'2px solid rgba(168,230,207,0.5)',animation:'sc-pulse 0.5s ease-out forwards',pointerEvents:'none',zIndex:2 }} />
        )}
      </div>

      {showModal && <BreathingModal title={session.title} audioUrl={session.audioUrl} onClose={() => setShowModal(false)} />}
    </>
  );
};
// ── Meditation Sessions (API + Search) ────────────────────────────────────
const MeditationSessions: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch active sessions from backend
  useEffect(() => {
    fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/meditations`)
      .then(res => res.json())
      .then(data => {
        // Show only Active sessions
        const active = Array.isArray(data) ? data.filter((s: any) => s.status === "Active") : [];
        setSessions(active);
      })
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  // Real-time filter on title, category, level (case-insensitive)
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter(s =>
      s.title?.toLowerCase().includes(q) ||
      s.category?.toLowerCase().includes(q) ||
      s.level?.toLowerCase().includes(q)
    );
  }, [sessions, searchQuery]);

  if (!loading && sessions.length === 0) return null;

  return (
    <section style={{ background: '#f8fafb', padding: '80px 0', opacity: 0, animation: 'sc-fadein 0.8s ease 0.2s forwards' }}>
      <style>{`@keyframes sc-fadein { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }`}</style>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#2d6a4f', marginBottom: '12px', opacity: 0.8 }}>
            Guided Library
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#1e293b', margin: 0 }}>
            Meditation <span style={{ color: '#059669', fontStyle: 'italic' }}>Sessions</span>
          </h2>
          <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to right, transparent, #059669, transparent)', margin: '16px auto 0' }} />
        </div>

        {/* Search bar — only shown when more than 3 sessions */}
        {sessions.length > 3 && (
        <div style={{ position: 'relative', maxWidth: '520px', margin: '0 auto 40px' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#74c69d', fontSize: '1.1rem', pointerEvents: 'none' }}>
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by title, category or level..."
            style={{
              width: '100%',
              padding: '13px 16px 13px 46px',
              borderRadius: '50px',
              border: '2px solid #b7e4c7',
              fontSize: '0.95rem',
              color: '#1b4332',
              background: '#fff',
              outline: 'none',
              boxShadow: '0 2px 12px rgba(82,183,136,0.12)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={e => { e.target.style.borderColor = '#52b788'; e.target.style.boxShadow = '0 0 0 4px rgba(82,183,136,0.15), 0 4px 16px rgba(82,183,136,0.12)'; }}
            onBlur={e => { e.target.style.borderColor = '#b7e4c7'; e.target.style.boxShadow = '0 2px 12px rgba(82,183,136,0.12)'; }}
          />
        </div>
        )}

        {/* Loading */}
        {loading && (
          <p style={{ textAlign: 'center', color: '#74c69d', fontFamily: "'Poppins', sans-serif", fontSize: '0.9rem' }}>
            Loading sessions...
          </p>
        )}

        {/* No results */}
        {!loading && filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: '#64748b', fontFamily: "'Poppins', sans-serif", fontSize: '0.9rem', padding: '40px 0' }}>
            No meditation sessions found
          </p>
        )}

        {/* Session cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px', alignItems: 'stretch', padding: '8px' }}>
          {filtered.map((session, idx) => {
            const icons = ['🧘', '🌿', '🪷', '🌬️', '✨', '🌙'];
            const icon = icons[idx % icons.length];
            return (
              <SessionCard key={session.id} session={session} icon={icon} />
            );
          })}
        </div>

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
