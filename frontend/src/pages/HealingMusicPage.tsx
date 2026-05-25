import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Sparkles, RefreshCw, Layers, Compass, Play, Square, Award } from 'lucide-react';

/* ─── Web Audio Engine ────────────────────────────────────────────────── */

interface SoundEngineState {
  activeVoices: Record<number, {
    oscs: OscillatorNode[];
    gain: GainNode;
    lfo: OscillatorNode;
    lfoGain: GainNode;
  }>;
}

const engine: SoundEngineState = {
  activeVoices: {},
};

let _audioCtx: AudioContext | null = null;
let _masterGain: GainNode | null = null;

const playSynthesizedSound = (
  ctx: AudioContext,
  sound: { id: number; frequency: number; category: string; name: string },
  masterVolume: number,
  deepResonance: boolean
): { oscs: OscillatorNode[]; gain: GainNode; lfo: OscillatorNode; lfoGain: GainNode } => {
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  const oscs: OscillatorNode[] = [];

  // Setup LFO
  lfo.frequency.setValueAtTime(4.0 + Math.random() * 2.0, ctx.currentTime);
  lfoGain.gain.setValueAtTime(deepResonance ? 10 : 3.0, ctx.currentTime);
  lfo.connect(lfoGain);

  filter.type = 'lowpass';
  filter.Q.setValueAtTime(1.0, ctx.currentTime);

  // Per-voice envelope target. Final audible level is controlled by a global master gain
  // so keep per-voice gain around 0.85 for a full, rich sound.
  const baseVol = 0.85; // Rich per-voice volume
  const volValue = baseVol;

  // Custom synthesizers for each of the 24 sounds
  switch (sound.id) {
    // ─── Vedic Chants ──────────────────────────────────────────
    case 1: { // Cosmic OM Chant (136.1 Hz) - Deep Male Choir Formant
      filter.frequency.setValueAtTime(300, ctx.currentTime);
      
      const sub = ctx.createOscillator();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(sound.frequency, ctx.currentTime);
      lfoGain.connect(sub.frequency);
      
      const tri = ctx.createOscillator();
      tri.type = 'triangle';
      tri.frequency.setValueAtTime(sound.frequency * 2.0, ctx.currentTime);
      lfoGain.connect(tri.frequency);

      const f1 = ctx.createBiquadFilter();
      f1.type = 'bandpass';
      f1.frequency.setValueAtTime(570, ctx.currentTime);
      f1.Q.setValueAtTime(8, ctx.currentTime);

      sub.connect(filter);
      tri.connect(f1);
      f1.connect(filter);

      oscs.push(sub, tri);
      break;
    }
    case 2: { // Gayatri Resonance (216.0 Hz) - Radiant Solar Choir
      filter.frequency.setValueAtTime(600, ctx.currentTime);
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(sound.frequency, ctx.currentTime);
      
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(sound.frequency * 1.5, ctx.currentTime);

      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);

      osc1.connect(filter);
      osc2.connect(filter);
      oscs.push(osc1, osc2);
      break;
    }
    case 3: { // Soma Lunar Nectar (288.0 Hz) - Calming Lunar Pad
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(sound.frequency, ctx.currentTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(sound.frequency * 2.0, ctx.currentTime);

      const filterLfo = ctx.createOscillator();
      filterLfo.frequency.setValueAtTime(0.2, ctx.currentTime);
      const filterLfoGain = ctx.createGain();
      filterLfoGain.gain.setValueAtTime(300, ctx.currentTime);
      filterLfo.connect(filterLfoGain);
      filterLfoGain.connect(filter.frequency);
      filterLfo.start();
      oscs.push(filterLfo as any);

      osc1.connect(filter);
      osc2.connect(filter);
      oscs.push(osc1, osc2);
      break;
    }
    case 4: { // Agni Fire Hymn (162.0 Hz) - Warm Sawtooth & Crackle
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(sound.frequency, ctx.currentTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(sound.frequency * 3.0, ctx.currentTime);

      const crackleGain = ctx.createGain();
      crackleGain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc2.connect(crackleGain);
      crackleGain.connect(filter);

      osc1.connect(filter);
      oscs.push(osc1, osc2);
      break;
    }
    case 5: { // Rudra Shield (108.0 Hz) - Powerful Bass Field
      filter.frequency.setValueAtTime(250, ctx.currentTime);
      const osc1 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(sound.frequency, ctx.currentTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(sound.frequency * 1.008, ctx.currentTime);

      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);

      osc1.connect(filter);
      osc2.connect(filter);
      oscs.push(osc1, osc2);
      break;
    }
    case 6: { // Peace Chant (192.0 Hz) - Ethereal Soft Vowels
      filter.frequency.setValueAtTime(900, ctx.currentTime);
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(sound.frequency, ctx.currentTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(sound.frequency * 4.0, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      oscs.push(osc1, osc2);
      break;
    }

    // ─── Solfeggio Frequencies ────────────────────────────────
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12: { // Chime / Ethereal stacks for Solfeggios
      filter.frequency.setValueAtTime(sound.frequency * 3.0, ctx.currentTime);
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(sound.frequency, ctx.currentTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(sound.frequency * 1.004, ctx.currentTime);

      const chime = ctx.createOscillator();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(sound.frequency * 3.0, ctx.currentTime);
      const chimeGain = ctx.createGain();
      chimeGain.gain.setValueAtTime(0.12, ctx.currentTime);
      chime.connect(chimeGain);
      chimeGain.connect(filter);
      oscs.push(chime);

      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);

      osc1.connect(filter);
      osc2.connect(filter);
      oscs.push(osc1, osc2);
      break;
    }

    // ─── Ancient Instruments ──────────────────────────────────
    case 13: { // Nada Brahma Veena (256.0 Hz) - Plucked String
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(sound.frequency, ctx.currentTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(sound.frequency * 2.0, ctx.currentTime);
      
      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc2.connect(subGain);
      subGain.connect(filter);

      lfoGain.connect(osc1.frequency);

      osc1.connect(filter);
      oscs.push(osc1, osc2);
      break;
    }
    case 14: { // Bansuri Breath (320.0 Hz) - Bamboo Flute
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(sound.frequency, ctx.currentTime);
      filter.Q.setValueAtTime(4.0, ctx.currentTime);

      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(sound.frequency, ctx.currentTime);

      const fluteLfo = ctx.createOscillator();
      fluteLfo.frequency.setValueAtTime(5.8, ctx.currentTime);
      const fluteLfoGain = ctx.createGain();
      fluteLfoGain.gain.setValueAtTime(6.0, ctx.currentTime);
      fluteLfo.connect(fluteLfoGain);
      fluteLfoGain.connect(osc1.frequency);
      fluteLfo.start();
      oscs.push(fluteLfo as any);

      osc1.connect(filter);
      oscs.push(osc1);
      break;
    }
    case 15: { // Dhvani Metal Bowl (144.0 Hz) - Tibetan Singing Bowl
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      const ratios = [1.0, 2.76, 5.40, 8.93];
      ratios.forEach((r, idx) => {
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(sound.frequency * r, ctx.currentTime);
        
        const individualLfoGain = ctx.createGain();
        individualLfoGain.gain.setValueAtTime(1.8 / (idx + 1), ctx.currentTime);
        lfo.connect(individualLfoGain);
        individualLfoGain.connect(o.frequency);
        
        const overtoneGain = ctx.createGain();
        overtoneGain.gain.setValueAtTime(0.35 / (idx + 1), ctx.currentTime);
        o.connect(overtoneGain);
        overtoneGain.connect(filter);
        oscs.push(o);
      });
      break;
    }
    case 16: { // Shankha Conch (220.0 Hz) - Shell Horn
      filter.frequency.setValueAtTime(600, ctx.currentTime);
      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(sound.frequency, ctx.currentTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(sound.frequency * 1.5, ctx.currentTime);
      
      const conchGain = ctx.createGain();
      conchGain.gain.setValueAtTime(0.25, ctx.currentTime);
      osc2.connect(conchGain);
      conchGain.connect(filter);

      osc1.connect(filter);
      oscs.push(osc1, osc2);
      break;
    }
    case 17: { // Temple Bell Echo (512.0 Hz) - Echo Bell strike
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      const ratios = [1.0, 1.9, 2.8, 4.1];
      ratios.forEach((r, idx) => {
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(sound.frequency * r, ctx.currentTime);
        
        const overtoneGain = ctx.createGain();
        overtoneGain.gain.setValueAtTime(0.3 / (idx + 1), ctx.currentTime);
        o.connect(overtoneGain);
        overtoneGain.connect(filter);
        oscs.push(o);
      });
      break;
    }
    case 18: { // Rudra Damaru Pulse (120.0 Hz) - Primal Drum Pulse
      filter.frequency.setValueAtTime(180, ctx.currentTime);
      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(sound.frequency, ctx.currentTime);

      osc1.frequency.setValueAtTime(sound.frequency * 2.0, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(sound.frequency, ctx.currentTime + 0.15);

      osc1.connect(filter);
      oscs.push(osc1);
      break;
    }

    // ─── Cosmic Frequencies ───────────────────────────────────
    case 19:
    case 20: { // Cosmic Crown/Third Eye frequencies
      filter.frequency.setValueAtTime(2000, ctx.currentTime);
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(sound.frequency, ctx.currentTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(sound.frequency * 1.002, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      oscs.push(osc1, osc2);
      break;
    }
    case 21: { // Golden Ratio (432 Hz)
      filter.frequency.setValueAtTime(900, ctx.currentTime);
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(432.0, ctx.currentTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(432.0 * 1.5, ctx.currentTime);
      
      const ratioGain = ctx.createGain();
      ratioGain.gain.setValueAtTime(0.12, ctx.currentTime);
      osc2.connect(ratioGain);
      ratioGain.connect(filter);

      osc1.connect(filter);
      oscs.push(osc1, osc2);
      break;
    }
    case 22: { // Schumann Earth Pulse (250.56 Hz)
      filter.frequency.setValueAtTime(150, ctx.currentTime);
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(78.3, ctx.currentTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(156.6, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      oscs.push(osc1, osc2);
      break;
    }
    case 23: { // Solar Flare Winds (333 Hz)
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(500, ctx.currentTime);
      filter.Q.setValueAtTime(1.0, ctx.currentTime);

      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(sound.frequency, ctx.currentTime);

      const windLfo = ctx.createOscillator();
      windLfo.frequency.setValueAtTime(0.1, ctx.currentTime);
      const windLfoGain = ctx.createGain();
      windLfoGain.gain.setValueAtTime(250, ctx.currentTime);
      windLfo.connect(windLfoGain);
      windLfoGain.connect(filter.frequency);
      windLfo.start();
      oscs.push(windLfo as any);

      osc1.connect(filter);
      oscs.push(osc1);
      break;
    }
    case 24: { // Void Resonance (480 Hz)
      filter.frequency.setValueAtTime(200, ctx.currentTime);
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(60.0, ctx.currentTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(120.0, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      oscs.push(osc1, osc2);
      break;
    }
  }

  // Amplitude settings (shorter attack envelope for quicker audibility)
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volValue, ctx.currentTime + 0.25);

  filter.connect(gain);
  // Connect per-voice gain to global master gain when available for centralized control
  if (_masterGain) {
    gain.connect(_masterGain);
  } else {
    gain.connect(ctx.destination);
  }

  oscs.forEach(o => {
    if (o.start && typeof o.start === 'function') {
      try {
        o.start();
      } catch (e) {}
    }
  });
  lfo.start();

  return { oscs, gain, lfo, lfoGain };
};

/* ─── 24 Vedic and Ancient Sounds Data ─────────────────────────────── */

interface HealingSound {
  id: number;
  name: string;
  sanskrit: string;
  category: 'Vedic Chants' | 'Solfeggio' | 'Ancient Instruments' | 'Cosmic Frequencies';
  frequency: number;
  desc: string;
  color: string;
  glow: string;
  shapeClass: string;
  icon: string;
  oscType: 'sine' | 'triangle' | 'sawtooth';
}

const HEALING_SOUNDS: HealingSound[] = [
  // Vedic Chants
  {
    id: 1,
    name: "Cosmic OM Chant",
    sanskrit: "Pranava OM",
    category: "Vedic Chants",
    frequency: 136.1, // Cosmic OM frequency
    desc: "The universal seed syllable. Deeply grounding and aligning with the cosmic cycle.",
    color: "#EF4444", // Red
    glow: "rgba(239,68,68,0.5)",
    shapeClass: "rounded-full", // Circle
    icon: "🕉️",
    oscType: "sine"
  },
  {
    id: 2,
    name: "Gayatri Resonance",
    sanskrit: "Savitr Mantra",
    category: "Vedic Chants",
    frequency: 216.0,
    desc: "Vedic chant of light and intellect. Stimulates spiritual wisdom and clarity.",
    color: "#F97316", // Orange
    glow: "rgba(249,115,22,0.5)",
    shapeClass: "rounded-[40px_10px_40px_10px]", // Leaf
    icon: "🌅",
    oscType: "triangle"
  },
  {
    id: 3,
    name: "Soma Lunar Nectar",
    sanskrit: "Soma Rasa",
    category: "Vedic Chants",
    frequency: 288.0,
    desc: "Ancient lunar chant for deep cellular rejuvenation and calming the nervous system.",
    color: "#FBBF24", // Yellow/Amber
    glow: "rgba(251,191,36,0.5)",
    shapeClass: "rounded-[50%_50%_50%_50%/_20%_80%_20%_80%]", // Almond / Drop
    icon: "🌙",
    oscType: "sine"
  },
  {
    id: 4,
    name: "Agni Fire Hymn",
    sanskrit: "Agni Sukta",
    category: "Vedic Chants",
    frequency: 162.0,
    desc: "First Sukta of Rig Veda. Ignites the inner fire of digestion, vital heat, and will.",
    color: "#EF4444",
    glow: "rgba(239,68,68,0.5)",
    shapeClass: "rounded-[24px_24px_0_0] h-12 w-12", // Dome / Flame
    icon: "🔥",
    oscType: "triangle"
  },
  {
    id: 5,
    name: "Rudra Shield",
    sanskrit: "Rudra Kavacham",
    category: "Vedic Chants",
    frequency: 108.0,
    desc: "Ancient Vedic sound code for clearing fear, negative fields, and building unshakeable shield.",
    color: "#EA580C",
    glow: "rgba(234,88,12,0.5)",
    shapeClass: "rounded-tr-[45px] rounded-bl-[45px] rounded-tl-lg rounded-br-lg", // Shield
    icon: "🔱",
    oscType: "triangle"
  },
  {
    id: 6,
    name: "Peace Chant",
    sanskrit: "Shanti Mantra",
    category: "Vedic Chants",
    frequency: 192.0,
    desc: "Universal Vedic invocation for inner harmony, external peace, and clearing blockages.",
    color: "#10B981",
    glow: "rgba(16,185,129,0.5)",
    shapeClass: "rounded-[60%_40%_30%_70%/_60%_30%_70%_40%]", // Asymmetric blob
    icon: "🌸",
    oscType: "sine"
  },

  // Solfeggio Frequencies
  {
    id: 7,
    name: "Liberation Frequency",
    sanskrit: "396 Hz UT Solfeggio",
    category: "Solfeggio",
    frequency: 396.0,
    desc: "UT frequency. Releases guilt, shame, fear, and anchors securely into the earth.",
    color: "#DC2626",
    glow: "rgba(220,38,38,0.5)",
    shapeClass: "rounded-2xl", // Rounded square
    icon: "🔒",
    oscType: "sine"
  },
  {
    id: 8,
    name: "Undoing Situations",
    sanskrit: "417 Hz RE Solfeggio",
    category: "Solfeggio",
    frequency: 417.0,
    desc: "RE frequency. Facilitates emotional healing, cleanses negative memories, and initiates change.",
    color: "#F97316",
    glow: "rgba(249,115,22,0.5)",
    shapeClass: "rounded-[35px_15px_35px_15px]", // Beautiful double petal
    icon: "🌊",
    oscType: "sine"
  },
  {
    id: 9,
    name: "Miracle Frequency",
    sanskrit: "528 Hz MI Solfeggio",
    category: "Solfeggio",
    frequency: 528.0,
    desc: "MI frequency (Miracle). Promotes transformation, cellular DNA repair, and bursts of joy.",
    color: "#D97706",
    glow: "rgba(217,119,6,0.5)",
    shapeClass: "rounded-[50%_50%_0_0]", // Temple dome
    icon: "✨",
    oscType: "sine"
  },
  {
    id: 10,
    name: "Harmonizing Relations",
    sanskrit: "639 Hz FA Solfeggio",
    category: "Solfeggio",
    frequency: 639.0,
    desc: "FA frequency. Enhances compassion, harmonizes relationships, and builds loving connection.",
    color: "#16A34A",
    glow: "rgba(22,163,74,0.5)",
    shapeClass: "rounded-[50%_50%_50%_50%/_60%_60%_40%_40%]", // Heartlike oval
    icon: "💚",
    oscType: "sine"
  },
  {
    id: 11,
    name: "Expression Frequency",
    sanskrit: "741 Hz SOL Solfeggio",
    category: "Solfeggio",
    frequency: 741.0,
    desc: "SOL frequency. Clears toxins, purifies cells from radiation, and opens authentic expression.",
    color: "#2563EB",
    glow: "rgba(37,99,235,0.5)",
    shapeClass: "rounded-[15px_35px_15px_35px]", // Pointed speech bubble
    icon: "🗣️",
    oscType: "sine"
  },
  {
    id: 12,
    name: "Awakening Intuition",
    sanskrit: "852 Hz LA Solfeggio",
    category: "Solfeggio",
    frequency: 852.0,
    desc: "LA frequency. Clears mental fog, raises intuition, and connects to the spiritual self.",
    color: "#4F46E5",
    glow: "rgba(79,70,229,0.5)",
    shapeClass: "rounded-[50%_50%_50%_50%/_40%_40%_60%_60%]", // Teardrop / Rain drop
    icon: "👁️",
    oscType: "sine"
  },

  // Ancient Instruments
  {
    id: 13,
    name: "Nada Brahma Veena",
    sanskrit: "Saraswati Veena",
    category: "Ancient Instruments",
    frequency: 256.0,
    desc: "Primordial string frequency. Restores creative intellect and balances brain hemispheres.",
    color: "#8B5CF6",
    glow: "rgba(139,92,246,0.5)",
    shapeClass: "rounded-[35%_65%_35%_65%/_65%_35%_65%_35%]", // Instrument body
    icon: "🎻",
    oscType: "triangle"
  },
  {
    id: 14,
    name: "Bansuri Breath",
    sanskrit: "Venu Flute",
    category: "Ancient Instruments",
    frequency: 320.0,
    desc: "Serene bamboo flute resonance. Transports to deep forests of absolute calm and peace.",
    color: "#059669",
    glow: "rgba(5,150,105,0.5)",
    shapeClass: "rounded-full w-20 h-10 flex items-center justify-center", // Horizontal pill
    icon: "🎋",
    oscType: "sine"
  },
  {
    id: 15,
    name: "Dhvani Metal Bowl",
    sanskrit: "Tibetan Bell Sound",
    category: "Ancient Instruments",
    frequency: 144.0,
    desc: "Heavy metal singing bowl vibration. Purges negative environment and grounds the body.",
    color: "#4B5563",
    glow: "rgba(75,85,99,0.5)",
    shapeClass: "rounded-[50%_50%_25%_25%/_50%_50%_50%_50%]", // Bowl
    icon: "🥣",
    oscType: "sine"
  },
  {
    id: 16,
    name: "Shankha Conch",
    sanskrit: "Conch Awakening",
    category: "Ancient Instruments",
    frequency: 220.0,
    desc: "Sacred shell horn. Dissipates negative obstacles, evil forces, and wakes solar energy.",
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.5)",
    shapeClass: "rounded-[90%_10%_90%_10%/_90%_10%_90%_10%]", // Shell spiral
    icon: "🐚",
    oscType: "triangle"
  },
  {
    id: 17,
    name: "Temple Bell Echo",
    sanskrit: "Ghanta Vibration",
    category: "Ancient Instruments",
    frequency: 512.0,
    desc: "High clarity bronze temple bell echo. Captures raw attention and induces present focus.",
    color: "#3B82F6",
    glow: "rgba(59,130,246,0.5)",
    shapeClass: "rounded-[25px_25px_5px_5px]", // Bell shape
    icon: "🔔",
    oscType: "sine"
  },
  {
    id: 18,
    name: "Rudra Damaru Pulse",
    sanskrit: "Shiva Heartbeat",
    category: "Ancient Instruments",
    frequency: 120.0,
    desc: "Rhythmic dual drum beat of Shiva. Evokes primal energy and cellular activity.",
    color: "#78350F",
    glow: "rgba(120,53,15,0.5)",
    shapeClass: "rounded-[0_100%_0_100%/_100%_0_100%_0]", // Hourglass infinity
    icon: "🥁",
    oscType: "triangle"
  },

  // Cosmic Frequencies
  {
    id: 19,
    name: "Divine Union",
    sanskrit: "963 Hz Cosmic Crown",
    category: "Cosmic Frequencies",
    frequency: 963.0,
    desc: "Crown crown Solfeggio. Awakens divine connection, universal oneness, and spiritual ecstasy.",
    color: "#6D28D9",
    glow: "rgba(109,40,217,0.5)",
    shapeClass: "rounded-[35%_65%_35%_65%/_35%_65%_35%_65%]", // Portal star
    icon: "👑",
    oscType: "sine"
  },
  {
    id: 20,
    name: "Pineal Awakener",
    sanskrit: "936 Hz Third Eye",
    category: "Cosmic Frequencies",
    frequency: 936.0,
    desc: "High frequency pineal gland stimulator. Unlocks lucid dreaming and astral resonance.",
    color: "#4338CA",
    glow: "rgba(67,56,202,0.5)",
    shapeClass: "rounded-[50%_0_50%_0]", // Horizontal eye
    icon: "🌌",
    oscType: "sine"
  },
  {
    id: 21,
    name: "Golden Ratio Sol",
    sanskrit: "432 Hz Nature Scale",
    category: "Cosmic Frequencies",
    frequency: 432.0,
    desc: "Natural universe tuning scale. Deeply therapeutic, syncing body with the mathematics of life.",
    color: "#047857",
    glow: "rgba(4,120,87,0.5)",
    shapeClass: "rounded-[30px] border-r-8 border-[#047857]", // Fibonacci shell spiral
    icon: "🌀",
    oscType: "sine"
  },
  {
    id: 22,
    name: "Schumann Resonance",
    sanskrit: "7.83 Hz Earth Pulse",
    category: "Cosmic Frequencies",
    frequency: 250.56, // Pitch scale representation (7.83 * 32)
    desc: "Acoustic translation of the Earth's electromagnetic heartbeat. Grounds and centers nervous system.",
    color: "#065F46",
    glow: "rgba(6,95,70,0.5)",
    shapeClass: "rounded-lg border-2 border-dashed border-[#065F46]", // Earth shield
    icon: "🌍",
    oscType: "sine"
  },
  {
    id: 23,
    name: "Solar Flare Winds",
    sanskrit: "333 Hz Surya Scale",
    category: "Cosmic Frequencies",
    frequency: 333.0,
    desc: "Vibrant solar heat radiation frequency. Awakens absolute warmth, confidence, and expansion.",
    color: "#B45309",
    glow: "rgba(180,83,9,0.5)",
    shapeClass: "rounded-[30%_70%_70%_30%/_50%_60%_40%_50%]", // Pulsating sun blob
    icon: "☀️",
    oscType: "sine"
  },
  {
    id: 24,
    name: "Silence of the Void",
    sanskrit: "480 Hz Sunya Void",
    category: "Cosmic Frequencies",
    frequency: 480.0,
    desc: "Primordial sound of infinite silence. Facilitates absolute meditation and ego dissolution.",
    color: "#1E293B",
    glow: "rgba(30,41,59,0.5)",
    shapeClass: "rounded-[0px_45px_0px_45px]", // Cosmic portal door
    icon: "🕳️",
    oscType: "sine"
  }
];

export default function HealingMusicPage() {
  const navigate = useNavigate();
  const [playingIds, setPlayingIds] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [masterVolume, setMasterVolume] = useState<number>(50); // 0-100
  const [mixerMode, setMixerMode] = useState<boolean>(true); // Play multiple sounds at once!
  const [zenPoints, setZenPoints] = useState<number>(0);
  const [listenerLevel, setListenerLevel] = useState<string>("Novice Meditator");
  const [deepResonance, setDeepResonance] = useState<boolean>(false);

  // Playback timer for gamified Points
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playingIds.length > 0) {
      interval = setInterval(() => {
        setZenPoints((prev) => {
          const next = prev + 5 * playingIds.length;
          // Gamified level titles
          if (next >= 1000) setListenerLevel("Nirvana Sovereign 👑");
          else if (next >= 500) setListenerLevel("Kundalini Master 🧘‍♂️");
          else if (next >= 250) setListenerLevel("Sound Guru 🔔");
          else if (next >= 100) setListenerLevel("Mindful Practitioner ✨");
          return next;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [playingIds]);

  // Handle master volume changes
  useEffect(() => {
    // Update global master gain instead of mutating each voice gain.
    if (_masterGain && _audioCtx) {
      try {
        _masterGain.gain.setValueAtTime(masterVolume / 100, _audioCtx.currentTime);
      } catch (e) {}
    }
  }, [masterVolume]);

  // Handle deep resonance toggle
  useEffect(() => {
    if (_audioCtx && _audioCtx.state === 'running') {
      Object.keys(engine.activeVoices).forEach((key) => {
        const id = parseInt(key);
        const voice = engine.activeVoices[id];
        if (voice && voice.lfoGain) {
          voice.lfoGain.gain.setValueAtTime(deepResonance ? 10 : 3.0, _audioCtx!.currentTime);
        }
      });
    }
  }, [deepResonance]);

  const toggleSound = useCallback((sound: HealingSound) => {
    if (!_audioCtx) {
      _audioCtx = new AudioContext();
      // create and attach a master gain node for global volume control
      try {
        _masterGain = _audioCtx.createGain();
        _masterGain.gain.setValueAtTime(masterVolume / 100, _audioCtx.currentTime);
        _masterGain.connect(_audioCtx.destination);
      } catch (e) {
        _masterGain = null;
      }
    }
    const ctx = _audioCtx;
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }

    const isPlaying = playingIds.includes(sound.id);

    if (isPlaying) {
      // STOP SOUND
      const voice = engine.activeVoices[sound.id];
      if (voice) {
        voice.gain.gain.setValueAtTime(voice.gain.gain.value, ctx.currentTime);
        voice.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        
        const idToClean = sound.id;
        setTimeout(() => {
          try {
            voice.oscs.forEach(o => {
              if (o.stop && typeof o.stop === 'function') o.stop();
              o.disconnect();
            });
            voice.lfo.stop();
            voice.lfo.disconnect();
            delete engine.activeVoices[idToClean];
          } catch (e) {}
        }, 550);
      }
      setPlayingIds((prev) => prev.filter((id) => id !== sound.id));
    } else {
      // PLAY SOUND
      if (!mixerMode) {
        Object.keys(engine.activeVoices).forEach((key) => {
          const otherId = parseInt(key);
          const voice = engine.activeVoices[otherId];
          if (voice && ctx) {
            try {
              voice.gain.gain.setValueAtTime(voice.gain.gain.value, ctx.currentTime);
              voice.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
              setTimeout(() => {
                try {
                  voice.oscs.forEach(o => {
                    if (o.stop && typeof o.stop === 'function') o.stop();
                    o.disconnect();
                  });
                  voice.lfo.stop();
                  voice.lfo.disconnect();
                } catch (e) {}
              }, 450);
            } catch (e) {}
            delete engine.activeVoices[otherId];
          }
        });
        setPlayingIds([sound.id]);
      } else {
        setPlayingIds((prev) => [...prev, sound.id]);
      }

      const voice = playSynthesizedSound(ctx, sound, masterVolume, deepResonance);
      engine.activeVoices[sound.id] = voice;
    }
  }, [playingIds, mixerMode, masterVolume, deepResonance]);

  const stopAllSounds = useCallback(() => {
    Object.keys(engine.activeVoices).forEach((key) => {
      const id = parseInt(key);
      const voice = engine.activeVoices[id];
      if (voice && _audioCtx) {
        try {
          voice.gain.gain.setValueAtTime(voice.gain.gain.value, _audioCtx.currentTime);
          voice.gain.gain.linearRampToValueAtTime(0, _audioCtx.currentTime + 0.5);
          setTimeout(() => {
            try {
              voice.oscs.forEach(o => {
                if (o.stop && typeof o.stop === 'function') o.stop();
                o.disconnect();
              });
              voice.lfo.stop();
              voice.lfo.disconnect();
            } catch (e) {}
          }, 550);
        } catch (e) {}
      }
    });
    engine.activeVoices = {};
    setPlayingIds([]);
  }, []);

  const randomizeMix = useCallback(() => {
    stopAllSounds();
    const categories = ['Vedic Chants', 'Solfeggio', 'Ancient Instruments', 'Cosmic Frequencies'];
    const selected: HealingSound[] = [];
    
    categories.forEach(cat => {
      const catSounds = HEALING_SOUNDS.filter(s => s.category === cat);
      const randomSound = catSounds[Math.floor(Math.random() * catSounds.length)];
      if (randomSound) selected.push(randomSound);
    });

    selected.slice(0, 3).forEach(sound => {
      toggleSound(sound);
    });
  }, [stopAllSounds, toggleSound]);

  // Clean up sounds on unmount
  useEffect(() => {
    return () => {
      Object.keys(engine.activeVoices).forEach((key) => {
        const id = parseInt(key);
        const voice = engine.activeVoices[id];
        if (voice) {
          try {
            voice.oscs.forEach(o => {
              if (o.stop && typeof o.stop === 'function') o.stop();
              o.disconnect();
            });
            voice.lfo.stop();
            voice.lfo.disconnect();
          } catch (e) {}
        }
      });
      engine.activeVoices = {};
      // Close audio context and clear master gain to release resources
      try {
        if (_audioCtx) {
          _audioCtx.close();
        }
      } catch (e) {}
      _audioCtx = null;
      _masterGain = null;
    };
  }, []);

  const categories = ['All', 'Vedic Chants', 'Solfeggio', 'Ancient Instruments', 'Cosmic Frequencies'];
  const filteredSounds = activeCategory === 'All' 
    ? HEALING_SOUNDS 
    : HEALING_SOUNDS.filter(s => s.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-[#060a08] overflow-x-hidden text-white py-24 px-6 md:px-12" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Dynamic ambient orb matching playing sound */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {playingIds.map((id, index) => {
          const sound = HEALING_SOUNDS.find(s => s.id === id);
          if (!sound) return null;
          return (
            <motion.div
              key={id}
              className="absolute rounded-full blur-[140px] opacity-[0.08]"
              style={{
                width: 500,
                height: 500,
                backgroundColor: sound.color,
                left: index % 2 === 0 ? '5%' : '60%',
                top: index % 2 === 0 ? '15%' : '50%',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.06, 0.12, 0.06]
              }}
              transition={{
                duration: 6 + index * 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Back Button */}
        <motion.button
          onClick={() => { stopAllSounds(); navigate('/chakra-experience'); }}
          className="mb-8 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white/70 border border-white/10 hover:border-white/20 hover:text-white transition-all bg-black/35 backdrop-blur-md"
          whileHover={{ scale: 1.04, x: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to 7 Chakras
        </motion.button>

        {/* Gamified Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#10B981]/15 text-[#10B981] shadow-lg shadow-[#10B981]/10">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </span>
              <span className="text-[#10B981] font-extrabold tracking-[0.2em] text-xs uppercase">
                Sacred Nada Resonance
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white" style={{ fontFamily: "'Cinzel', serif" }}>
              Healing Music
            </h1>
            <p className="text-white/50 text-base md:text-lg max-w-2xl leading-relaxed">
              Unlock cosmic vibrations and ancient Vedic chants. Engage with our gamified 
              soundboard to blend frequencies, Repair your cells, and expand your Zen energy.
            </p>
          </div>

          {/* Gamified Stats Block */}
          <div className="lg:col-span-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-[#10B981]/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#10B981]/5 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#10B981]" />
                <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Zen Rank</span>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 bg-[#10B981]/25 text-[#34D399] rounded-full border border-[#10B981]/20">
                {listenerLevel}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-[#10B981] bg-clip-text text-transparent">
                {zenPoints} <span className="text-sm font-semibold text-[#10B981]">Z-Energy</span>
              </div>
              <p className="text-white/30 text-[10px] font-medium leading-normal">
                {playingIds.length > 0 
                  ? `Pumping +${5 * playingIds.length} Z-Energy every 3 seconds from active sound layers.` 
                  : "Start a vibration below to harvest cosmic Zen Energy."}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Mixer Panel */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[28px] p-6 md:p-8 mb-10 backdrop-blur-2xl">
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center justify-between">
            {/* Active Sound / Spinning Mandala */}
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
                {/* Mandala Background Ring */}
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-dashed border-[#10B981]/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                />
                {/* Interactive Center Core */}
                <motion.div
                  className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#10B981] to-[#3B82F6] flex items-center justify-center shadow-lg cursor-pointer"
                  animate={playingIds.length > 0 ? {
                    scale: [1, 1.15, 1],
                    boxShadow: [
                      "0 0 20px rgba(16,185,129,0.3)",
                      "0 0 40px rgba(59,130,246,0.6)",
                      "0 0 20px rgba(16,185,129,0.3)"
                    ]
                  } : { scale: 1 }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Compass className={`w-6 h-6 text-white ${playingIds.length > 0 ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                </motion.div>
              </div>

              <div>
                <h3 className="font-extrabold text-white text-lg">Resonance Mixer</h3>
                <p className="text-white/40 text-xs mt-1">
                  {playingIds.length > 0 
                    ? `Blending ${playingIds.length} overlapping frequency layers in real-time.` 
                    : "Tap below to begin generating high-fidelity meditative hums."}
                </p>
              </div>
            </div>

            {/* Quick Mixer Controls */}
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
              {/* Master Volume */}
              <div className="flex items-center gap-3 bg-black/25 px-4 py-2.5 rounded-full border border-white/5">
                {masterVolume === 0 ? <VolumeX className="w-4 h-4 text-white/50" /> : <Volume2 className="w-4 h-4 text-[#10B981]" />}
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={masterVolume} 
                  onChange={(e) => setMasterVolume(parseInt(e.target.value))}
                  className="w-20 md:w-28 accent-[#10B981] h-1 bg-white/20 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-semibold text-white/60 w-6 text-right">{masterVolume}%</span>
              </div>

              {/* Toggle Deepen Vibrato */}
              <motion.button
                onClick={() => setDeepResonance(!deepResonance)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-2 ${
                  deepResonance 
                    ? 'bg-[#10B981] text-white border-[#10B981] shadow-lg shadow-[#10B981]/25' 
                    : 'bg-white/5 text-white/70 border-white/10 hover:border-white/20'
                }`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Layers className="w-3.5 h-3.5" />
                Deep Resonance LFO
              </motion.button>

              {/* Dynamic Mixer Play Mode */}
              <motion.button
                onClick={() => setMixerMode(!mixerMode)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all ${
                  mixerMode 
                    ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-[#10B981] border-[#10B981]/30' 
                    : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20'
                }`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                {mixerMode ? "Mode: Polyphonic (Mixer)" : "Mode: Monophonic (Single)"}
              </motion.button>

              {/* Harmony Randomizer */}
              <motion.button
                onClick={randomizeMix}
                className="px-4 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 border border-transparent shadow-md hover:shadow-emerald-500/20 flex items-center gap-2"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Harmonize
              </motion.button>

              {/* Stop All */}
              {playingIds.length > 0 && (
                <motion.button
                  onClick={stopAllSounds}
                  className="px-4 py-2.5 rounded-full text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/15 flex items-center gap-1.5"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Square className="w-3 h-3 fill-white" />
                  Mute All
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 border-b border-white/5">
          {categories.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-all border ${
                activeCategory === cat 
                  ? 'bg-white text-black border-white' 
                  : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20'
              }`}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* ─── 24 UNIQUE SHAPED Meditative Sounds Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSounds.map((sound, index) => {
            const isPlaying = playingIds.includes(sound.id);

            return (
              <motion.div
                key={sound.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
                className="group relative flex flex-col justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md shadow-lg hover:shadow-2xl hover:border-white/15 transition-all duration-500 overflow-hidden cursor-pointer select-none"
                onClick={() => toggleSound(sound)}
              >
                {/* Background soft color glow */}
                <div 
                  className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-3xl opacity-20 pointer-events-none group-hover:scale-150 transition-transform duration-500" 
                  style={{ backgroundColor: sound.color }}
                />

                <div className="space-y-4 pointer-events-none">
                  {/* Top Row: Unique Shape Button + Category */}
                  <div className="flex items-center justify-between">
                    {/* UNIQUE SHAPED PLAY BUTTON */}
                    <div className="relative">
                      {/* Active outer pulse rings */}
                      <AnimatePresence>
                        {isPlaying && (
                          <>
                            <motion.div
                              className="absolute inset-0 rounded-full blur-sm pointer-events-none"
                              style={{ background: sound.color, opacity: 0.3 }}
                              animate={{ scale: [1, 1.4, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                            <motion.div
                              className={`absolute -inset-2 pointer-events-none border-2 border-[#10B981]/40 ${sound.shapeClass}`}
                              animate={{ scale: [1, 1.15, 1], opacity: [0.8, 0, 0.8] }}
                              transition={{ duration: 2.5, repeat: Infinity }}
                            />
                          </>
                        )}
                      </AnimatePresence>

                      <motion.div
                        className={`relative z-10 w-14 h-14 bg-gradient-to-tr from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/15 text-xl flex items-center justify-center shadow-lg transition-transform duration-500 ${sound.shapeClass}`}
                        style={isPlaying ? {
                          background: `linear-gradient(135deg, ${sound.color}, #000)`,
                          borderColor: sound.color,
                          boxShadow: `0 0 20px ${sound.glow}`
                        } : {}}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className={`block transition-transform duration-500 ${isPlaying ? 'scale-105' : 'group-hover:rotate-12'}`}>
                          {sound.icon}
                        </span>
                      </motion.div>
                    </div>

                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                      {sound.category}
                    </span>
                  </div>

                  {/* Sound Info */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                      {sound.name}
                    </h3>
                    <p className="text-xs font-semibold tracking-wide" style={{ color: sound.color }}>
                      {sound.sanskrit} · {sound.frequency} Hz
                    </p>
                  </div>

                  {/* Sound Description */}
                  <p className="text-white/40 text-xs font-medium leading-relaxed">
                    {sound.desc}
                  </p>
                </div>

                {/* Playback indicator footer */}
                <div className="mt-5 pt-4 border-t border-white/[0.03] flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-white/30 tracking-wider">
                    {isPlaying ? "Vibrating Now" : "Ready to play"}
                  </span>
                  
                  {isPlaying ? (
                    <div className="flex items-end gap-[3px] h-3">
                      {[0, 1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          className="w-[2.5px] rounded-full"
                          style={{ backgroundColor: sound.color }}
                          animate={{ height: ['4px', '14px', '6px', '14px', '4px'] }}
                          transition={{ duration: 1 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
                        />
                      ))}
                    </div>
                  ) : (
                    <Play className="w-3.5 h-3.5 text-white/30 group-hover:text-[#10B981] group-hover:translate-x-0.5 transition-all duration-300" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Footer closing notice */}
        <div className="mt-16 text-center text-white/20 text-xs font-medium">
          NIRVAHA NADA YOGA · HOLOGRAPHIC SOUND EMBODIMENT · {new Date().getFullYear()}
        </div>

      </div>
    </div>
  );
}
