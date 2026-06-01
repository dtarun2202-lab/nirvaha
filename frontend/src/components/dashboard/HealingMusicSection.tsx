import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Sparkles, RefreshCw, Layers, Compass, Play, Square, Award, ChevronLeft, ChevronRight, X } from 'lucide-react';

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

  const baseVol = 0.55; // High base volume for full beautiful sound!
  const volValue = (masterVolume / 100) * baseVol;

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

  // Amplitude settings (attack envelope)
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volValue, ctx.currentTime + 0.8);

  filter.connect(gain);
  gain.connect(ctx.destination);

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
  color: string; // Tailored color matching the sound vibe
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
    frequency: 136.1,
    desc: "The universal seed syllable. Deeply grounding and aligning with the cosmic cycle.",
    color: "#DC2626", // Red
    glow: "rgba(220,38,38,0.35)",
    shapeClass: "rounded-full",
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
    color: "#EA580C", // Orange
    glow: "rgba(234,88,12,0.35)",
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
    color: "#CA8A04", // Yellow/Amber
    glow: "rgba(202,138,4,0.35)",
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
    color: "#E11D48", // Rose/Crimson
    glow: "rgba(225,29,72,0.35)",
    shapeClass: "rounded-[24px_24px_0_0]", // Flame dome
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
    color: "#D97706",
    glow: "rgba(217,119,6,0.35)",
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
    color: "#16A34A", // Emerald
    glow: "rgba(22,163,74,0.35)",
    shapeClass: "rounded-[60%_40%_30%_70%/_60%_30%_70%_40%]", // Organic pebble
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
    color: "#B91C1C",
    glow: "rgba(185,28,28,0.35)",
    shapeClass: "rounded-2xl",
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
    color: "#C2410C",
    glow: "rgba(194,65,12,0.35)",
    shapeClass: "rounded-[35px_15px_35px_15px]", // Petal
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
    color: "#A16207",
    glow: "rgba(161,98,7,0.35)",
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
    color: "#047857",
    glow: "rgba(4,120,87,0.35)",
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
    color: "#1D4ED8",
    glow: "rgba(29,78,216,0.35)",
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
    color: "#4338CA",
    glow: "rgba(67,56,202,0.35)",
    shapeClass: "rounded-[50%_50%_50%_50%/_40%_40%_60%_60%]", // Teardrop
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
    color: "#6D28D9",
    glow: "rgba(109,40,217,0.35)",
    shapeClass: "rounded-[35px_65%_35%_65%/_65%_35%_65%_35%]",
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
    color: "#065F46",
    glow: "rgba(6,95,70,0.35)",
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
    color: "#374151",
    glow: "rgba(55,65,81,0.35)",
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
    color: "#D97706",
    glow: "rgba(217,119,6,0.35)",
    shapeClass: "rounded-[90%_10%_90%_10%/_90%_10%_90%_10%]", // Conch spiral
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
    color: "#1D4ED8",
    glow: "rgba(29,78,216,0.35)",
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
    glow: "rgba(120,53,15,0.35)",
    shapeClass: "rounded-[0_100%_0_100%/_100%_0_100%_0]", // Hourglass
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
    color: "#5B21B6",
    glow: "rgba(91,33,182,0.35)",
    shapeClass: "rounded-[35%_65%_35%_65%/_35%_65%_35%_65%]", // Star
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
    color: "#3730A3",
    glow: "rgba(55,48,163,0.35)",
    shapeClass: "rounded-[50%_0_50%_0]", // Eye
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
    color: "#065F46",
    glow: "rgba(6,95,70,0.35)",
    shapeClass: "rounded-[30px] border-r-8 border-[#065F46]", // Fibonacci spiral
    icon: "🌀",
    oscType: "sine"
  },
  {
    id: 22,
    name: "Schumann Resonance",
    sanskrit: "7.83 Hz Earth Pulse",
    category: "Cosmic Frequencies",
    frequency: 250.56, // Audible scaled representation
    desc: "Acoustic translation of the Earth's electromagnetic heartbeat. Grounds and centers nervous system.",
    color: "#064E3B",
    glow: "rgba(6,78,59,0.35)",
    shapeClass: "rounded-lg border-2 border-dashed border-[#064E3B]",
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
    color: "#92400E",
    glow: "rgba(146,64,14,0.35)",
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
    glow: "rgba(30,41,59,0.35)",
    shapeClass: "rounded-[0px_45px_0px_45px]", // Portal door
    icon: "🕳️",
    oscType: "sine"
  }
];

export function HealingMusicSection() {
  const [playingIds, setPlayingIds] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [masterVolume, setMasterVolume] = useState<number>(50);
  const [mixerMode, setMixerMode] = useState<boolean>(true);
  const [zenPoints, setZenPoints] = useState<number>(0);
  const [listenerLevel, setListenerLevel] = useState<string>("Novice Meditator");
  const [deepResonance, setDeepResonance] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  // Gamified points calculator
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playingIds.length > 0) {
      interval = setInterval(() => {
        setZenPoints((prev) => {
          const next = prev + 5 * playingIds.length;
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

  // Master volume effect
  useEffect(() => {
    if (engine.audioCtx && engine.audioCtx.state === 'running') {
      Object.keys(engine.activeVoices).forEach((key) => {
        const id = parseInt(key);
        const voice = engine.activeVoices[id];
        if (voice && voice.gain) {
          const baseSound = HEALING_SOUNDS.find(s => s.id === id);
          const maxVol = baseSound?.category === 'Vedic Chants' ? 0.15 : 0.22;
          voice.gain.gain.setValueAtTime((masterVolume / 100) * maxVol, engine.audioCtx.currentTime);
        }
      });
    }
  }, [masterVolume]);

  // LFO Deep Resonance effect
  useEffect(() => {
    if (engine.audioCtx && engine.audioCtx.state === 'running') {
      Object.keys(engine.activeVoices).forEach((key) => {
        const id = parseInt(key);
        const voice = engine.activeVoices[id];
        if (voice && voice.lfoGain) {
          voice.lfoGain.gain.setValueAtTime(deepResonance ? 8 : 2.5, engine.audioCtx.currentTime);
        }
      });
    }
  }, [deepResonance]);

  const toggleSound = useCallback((sound: HealingSound) => {
    if (!_audioCtx) {
      _audioCtx = new AudioContext();
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
        // Stop all other active sounds first
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

  // Cleanup on destroy
  useEffect(() => {
    return () => {
      Object.keys(engine.activeVoices).forEach((key) => {
        const id = parseInt(key);
        const voice = engine.activeVoices[id];
        if (voice) {
          try {
            voice.oscs.forEach(o => {
              o.stop();
              o.disconnect();
            });
            voice.lfo.stop();
            voice.lfo.disconnect();
          } catch (e) {}
        }
      });
      engine.activeVoices = {};
    };
  }, []);

  const categories = ['All', 'Vedic Chants', 'Solfeggio', 'Ancient Instruments', 'Cosmic Frequencies'];
  const filteredSounds = activeCategory === 'All' 
    ? HEALING_SOUNDS 
    : HEALING_SOUNDS.filter(s => s.category === activeCategory);

  return (
    <section id="healing-music-section" className="py-16 md:py-24 bg-[#E4EFE8] relative overflow-hidden">
      {/* Subtle Dot Grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #1a5d47 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Dynamic ambient color glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {playingIds.map((id, index) => {
          const sound = HEALING_SOUNDS.find(s => s.id === id);
          if (!sound) return null;
          return (
            <motion.div
              key={id}
              className="absolute rounded-full blur-[140px] opacity-[0.06]"
              style={{
                width: 400,
                height: 400,
                backgroundColor: sound.color,
                left: index % 2 === 0 ? '5%' : '65%',
                top: index % 2 === 0 ? '20%' : '60%',
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.04, 0.08, 0.04]
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

      <div className="max-w-[1440px] mx-auto px-6 md:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1a5d47]/10 text-[#1a5d47]">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              </span>
              <span className="text-[#1a5d47] font-bold tracking-widest text-[10px] uppercase underline underline-offset-4 decoration-1">
                Primordial Resonance
              </span>
            </div>
            <div className="flex items-center gap-4">
              <h2 className="text-4xl md:text-5xl font-bold text-[#0F131A] tracking-tight" style={{ fontFamily: "'Cinzel', serif" }}>
                Healing Music
              </h2>
              <svg className="w-16 h-8 text-[#1a5d47]" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
                <motion.path 
                  d="M0,10 Q10,0 20,10 T40,10 T60,10 T80,10 T100,10"
                  animate={{ d: ["M0,10 Q10,20 20,10 T40,10 T60,10 T80,10 T100,10", "M0,10 Q10,0 20,10 T40,10 T60,10 T80,10 T100,10"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
              Unlock cosmic vibrations and ancient Vedic chants. Engage with our gamified 
              soundboard to blend frequencies, Repair your cells, and expand your Zen energy directly in your dashboard.
            </p>
          </div>

          {/* Gamified Rank Badge */}
          <div className="lg:col-span-4 bg-white/40 border border-white/60 rounded-3xl p-5 flex flex-col justify-between shadow-md relative overflow-hidden group hover:border-[#1a5d47]/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#1a5d47]" />
                <span className="text-[#0f131a]/40 text-[10px] font-bold uppercase tracking-wider">Zen Rank</span>
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-[#1a5d47]/10 text-[#1a5d47] rounded-full border border-[#1a5d47]/10">
                {listenerLevel}
              </span>
            </div>

            <div className="space-y-0.5">
              <div className="text-2xl font-extrabold tracking-tight text-[#0F131A]">
                {zenPoints} <span className="text-xs font-semibold text-[#1a5d47]">Z-Energy</span>
              </div>
              <p className="text-gray-400 text-[10px] font-medium leading-normal">
                {playingIds.length > 0 
                  ? `Pumping +${5 * playingIds.length} Z-Energy from active sound layers.` 
                  : "Start a vibration below to harvest Zen Energy."}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Mixer Control Strip */}
        <div className="bg-[#d1ecd8]/70 border border-[#1a5d47]/20 rounded-[24px] p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Spinning Mandala / Play Button for Carousel */}
            <div className="flex items-center gap-5 w-full lg:w-auto">
              <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-dashed border-[#1a5d47]/20 pointer-events-none"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1a5d47] to-teal-500 flex items-center justify-center shadow-md cursor-pointer z-10"
                  onClick={() => {
                    const sound = filteredSounds[carouselIndex] || filteredSounds[0];
                    if (sound) toggleSound(sound);
                  }}
                  animate={(filteredSounds[carouselIndex] && playingIds.includes(filteredSounds[carouselIndex].id)) ? {
                    scale: [1, 1.15, 1],
                    boxShadow: [
                      "0 0 10px rgba(26,93,71,0.2)",
                      "0 0 24px rgba(26,93,71,0.4)",
                      "0 0 10px rgba(26,93,71,0.2)"
                    ]
                  } : { scale: 1 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {(filteredSounds[carouselIndex] && playingIds.includes(filteredSounds[carouselIndex].id)) ? (
                    <Square className="w-4 h-4 text-white fill-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  )}
                </motion.div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-[#0F131A] text-base">Nada Soundbox</h3>
                  <div className="flex items-center gap-0.5 ml-1">
                    <button 
                      onClick={() => setCarouselIndex(prev => (prev === 0 ? Math.max(0, filteredSounds.length - 1) : prev - 1))}
                      className="p-1 hover:bg-[#1a5d47]/10 rounded-full text-gray-400 hover:text-[#1a5d47] transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setCarouselIndex(prev => (prev === filteredSounds.length - 1 ? 0 : prev + 1))}
                      className="p-1 hover:bg-[#1a5d47]/10 rounded-full text-gray-400 hover:text-[#1a5d47] transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {filteredSounds[carouselIndex] ? (
                  <>
                    <p className="text-[#1a5d47] font-bold text-xs mt-0.5">
                      {filteredSounds[carouselIndex].name} <span className="text-gray-400 font-normal">· {filteredSounds[carouselIndex].frequency} Hz</span>
                    </p>
                    <p className="text-gray-500 text-[10px] mt-0.5 truncate max-w-[200px] sm:max-w-[250px]">
                      {filteredSounds[carouselIndex].desc}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500 text-xs mt-0.5">Select a sound...</p>
                )}
              </div>
            </div>

            {/* Mixer Controls */}
            <div className="flex flex-wrap items-center gap-3.5 w-full lg:w-auto justify-end">
              {/* Master Volume */}
              <div className="flex items-center gap-2.5 bg-white/60 px-3.5 py-2 rounded-full border border-white/80">
                {masterVolume === 0 ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-[#1a5d47]" />}
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={masterVolume} 
                  onChange={(e) => setMasterVolume(parseInt(e.target.value))}
                  className="w-20 md:w-24 accent-[#1a5d47] h-1 bg-[#1a5d47]/20 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] font-bold text-gray-500 w-6 text-right">{masterVolume}%</span>
              </div>

              {/* LFO toggle */}
              <motion.button
                onClick={() => setDeepResonance(!deepResonance)}
                className={`px-3.5 py-2.5 rounded-full text-[10px] font-bold border transition-all flex items-center gap-1.5 ${
                  deepResonance 
                    ? 'bg-[#1a5d47] text-white border-[#1a5d47] shadow-sm' 
                    : 'bg-white/60 text-gray-600 border-white/80 hover:bg-white/80'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Layers className="w-3 h-3" />
                LFO Beats
              </motion.button>

              {/* Mixer poly/mono mode toggle */}
              <motion.button
                onClick={() => setMixerMode(!mixerMode)}
                className={`px-3.5 py-2.5 rounded-full text-[10px] font-bold border transition-all ${
                  mixerMode 
                    ? 'bg-[#1a5d47]/10 text-[#1a5d47] border-[#1a5d47]/20' 
                    : 'bg-white/60 text-gray-500 border-white/80'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {mixerMode ? "Poly (Mixer)" : "Mono (Single)"}
              </motion.button>

              {/* Harmony Randomizer */}
              <motion.button
                onClick={randomizeMix}
                className="px-4 py-2.5 rounded-full text-[10px] font-extrabold text-white bg-[#1a5d47] hover:bg-[#113d2f] border border-transparent shadow-sm flex items-center gap-1.5"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <RefreshCw className="w-3 h-3" />
                Harmonize
              </motion.button>

              {/* Mute All */}
              {playingIds.length > 0 && (
                <motion.button
                  onClick={stopAllSounds}
                  className="px-4 py-2.5 rounded-full text-[10px] font-extrabold text-white bg-rose-600 hover:bg-rose-700 shadow-md flex items-center gap-1.5"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Square className="w-2.5 h-2.5 fill-white" />
                  Mute All
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 border-b border-[#1a5d47]/10">
          {categories.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-[11px] font-bold tracking-wider whitespace-nowrap transition-all border ${
                activeCategory === cat 
                  ? 'bg-[#1a5d47] text-white border-[#1a5d47]' 
                  : 'bg-white/40 text-gray-500 border-white/80 hover:bg-white/60 hover:text-gray-700'
              }`}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* ─── 4 Curated Meditative Sounds Grid (Dashboard) ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredSounds.slice(0, 4).map((sound, index) => {
            const isPlaying = playingIds.includes(sound.id);

            return (
              <motion.div
                key={sound.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
                className="group relative flex flex-col justify-between p-5 bg-[#d1ecd8]/50 border border-[#1a5d47]/10 rounded-2xl shadow-sm hover:shadow-lg hover:border-[#1a5d47]/30 hover:bg-[#d1ecd8]/80 transition-all duration-300 overflow-hidden cursor-pointer select-none"
                onClick={() => toggleSound(sound)}
              >
                <div className="space-y-3.5 pointer-events-none">
                  {/* Top Row: Unique Shape Button + Category */}
                  <div className="flex items-center justify-between">
                    {/* UNIQUE SHAPED PLAY BUTTON */}
                    <div className="relative">
                      {/* Active outer pulse ring */}
                      <AnimatePresence>
                        {isPlaying && (
                          <>
                            <motion.div
                              className="absolute inset-0 rounded-full blur-sm pointer-events-none"
                              style={{ background: sound.color, opacity: 0.25 }}
                              animate={{ scale: [1, 1.35, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                            <motion.div
                              className={`absolute -inset-1.5 pointer-events-none border border-[#1a5d47]/30 ${sound.shapeClass}`}
                              animate={{ scale: [1, 1.12, 1], opacity: [0.8, 0, 0.8] }}
                              transition={{ duration: 2.5, repeat: Infinity }}
                            />
                          </>
                        )}
                      </AnimatePresence>

                      <motion.div
                        className={`relative z-10 w-11 h-11 bg-white/80 border border-white text-base flex items-center justify-center shadow-sm ${sound.shapeClass}`}
                        style={isPlaying ? {
                          background: `linear-gradient(135deg, ${sound.color}, #000)`,
                          borderColor: sound.color,
                          boxShadow: `0 0 12px ${sound.glow}`
                        } : {}}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className={`block transition-transform duration-500 ${isPlaying ? 'scale-105' : 'group-hover:rotate-12'}`}>
                          {sound.icon}
                        </span>
                      </motion.div>
                    </div>

                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      {sound.category}
                    </span>
                  </div>

                  {/* Sound Info */}
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-[#0F131A] tracking-tight leading-snug">
                      {sound.name}
                    </h3>
                    <p className="text-[10px] font-bold tracking-wide" style={{ color: sound.color }}>
                      {sound.sanskrit} · {sound.frequency} Hz
                    </p>
                  </div>

                  {/* Sound Description */}
                  <p className="text-gray-400 text-xs leading-normal">
                    {sound.desc}
                  </p>
                </div>

                {/* Playback footer */}
                <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">
                    {isPlaying ? "Playing" : "Select"}
                  </span>
                  
                  {isPlaying ? (
                    <div className="flex items-end gap-[2px] h-2.5">
                      {[0, 1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          className="w-[2px] rounded-full"
                          style={{ backgroundColor: sound.color }}
                          animate={{ height: ['3px', '10px', '5px', '10px', '3px'] }}
                          transition={{ duration: 1 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
                        />
                      ))}
                    </div>
                  ) : (
                    <Play className="w-3 h-3 text-gray-300 group-hover:text-[#1a5d47] group-hover:translate-x-0.5 transition-all duration-300" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View More Button */}
        {filteredSounds.length > 4 && (
          <div className="flex justify-center mt-10">
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-full font-bold text-white bg-[#1a5d47] hover:bg-[#113d2f] shadow-lg flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Layers className="w-4 h-4" />
              Explore Full Library ({filteredSounds.length} sounds)
            </motion.button>
          </div>
        )}

      </div>

      {/* ─── Full Library Popup Modal ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-[#EAF7EF]/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
            
            <motion.div
              className="relative w-full max-w-7xl h-[90vh] bg-[#E4EFE8] rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-white/20"
              initial={{ y: 50, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 20, scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {/* Modal Header */}
              <div className="flex flex-wrap gap-4 items-center justify-between p-6 md:px-10 border-b border-[#1a5d47]/10 bg-white/60">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#1a5d47]/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#1a5d47]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#0F131A] font-['Cinzel']">Complete Sound Library</h2>
                    <p className="text-sm text-gray-500 font-medium">Discover {filteredSounds.length} sacred frequencies</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 rounded-full hover:bg-gray-200 text-gray-600 transition-colors self-start md:self-auto"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content - Scrollable Grid */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 relative hide-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 pb-20">
                  {filteredSounds.map((sound, index) => {
                    const isPlaying = playingIds.includes(sound.id);
                    return (
                      <motion.div
                        key={sound.id}
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-20px' }}
                        transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
                        className="group relative flex flex-col justify-between p-5 bg-[#d1ecd8]/50 border border-[#1a5d47]/10 rounded-2xl shadow-sm hover:shadow-lg hover:border-[#1a5d47]/30 hover:bg-[#d1ecd8]/80 transition-all duration-300 overflow-hidden cursor-pointer select-none"
                        onClick={() => toggleSound(sound)}
                      >
                        <div className="space-y-3.5 pointer-events-none">
                          <div className="flex items-center justify-between">
                            <div className="relative">
                              <AnimatePresence>
                                {isPlaying && (
                                  <>
                                    <motion.div
                                      className="absolute inset-0 rounded-full blur-sm pointer-events-none"
                                      style={{ background: sound.color, opacity: 0.25 }}
                                      animate={{ scale: [1, 1.35, 1] }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    <motion.div
                                      className={`absolute -inset-1.5 pointer-events-none border border-[#1a5d47]/30 ${sound.shapeClass}`}
                                      animate={{ scale: [1, 1.12, 1], opacity: [0.8, 0, 0.8] }}
                                      transition={{ duration: 2.5, repeat: Infinity }}
                                    />
                                  </>
                                )}
                              </AnimatePresence>
                              <motion.div
                                className={`relative z-10 w-11 h-11 bg-white/80 border border-white text-base flex items-center justify-center shadow-sm ${sound.shapeClass}`}
                                style={isPlaying ? { background: `linear-gradient(135deg, ${sound.color}, #000)`, borderColor: sound.color, boxShadow: `0 0 12px ${sound.glow}` } : {}}
                                whileHover={{ scale: 1.06 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <span className={`block transition-transform duration-500 ${isPlaying ? 'scale-105' : 'group-hover:rotate-12'}`}>{sound.icon}</span>
                              </motion.div>
                            </div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{sound.category}</span>
                          </div>
                          <div className="space-y-0.5">
                            <h3 className="text-sm font-bold text-[#0F131A] tracking-tight leading-snug">{sound.name}</h3>
                            <p className="text-[10px] font-bold tracking-wide" style={{ color: sound.color }}>{sound.sanskrit} · {sound.frequency} Hz</p>
                          </div>
                          <p className="text-gray-500 text-xs leading-normal">{sound.desc}</p>
                        </div>
                        <div className="mt-4 pt-3.5 border-t border-[#1a5d47]/10 flex items-center justify-between">
                          <span className="text-[9px] font-bold uppercase text-gray-500 tracking-wider">{isPlaying ? "Playing" : "Select"}</span>
                          {isPlaying ? (
                            <div className="flex items-end gap-[2px] h-2.5">
                              {[0, 1, 2, 3].map((i) => (
                                <motion.div key={i} className="w-[2px] rounded-full" style={{ backgroundColor: sound.color }} animate={{ height: ['3px', '10px', '5px', '10px', '3px'] }} transition={{ duration: 1 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }} />
                              ))}
                            </div>
                          ) : (
                            <Play className="w-3 h-3 text-gray-400 group-hover:text-[#1a5d47] group-hover:translate-x-0.5 transition-all duration-300" />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
