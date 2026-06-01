/**
 * Chakra Sound Engine v4 — Fully Distinct Per-Chakra Identity
 *
 * Each chakra has its OWN:
 *   - Fundamental pitch range (Root=65Hz, Crown=440Hz)
 *   - Voice character (deep/masculine → ethereal/feminine)
 *   - Vowel formant shape (LAM ≠ VAM ≠ RAM ≠ YAM ≠ HAM ≠ OM ≠ AUM)
 *   - Chant rhythm / gate speed
 *   - Reverb character (tight+dry → vast+wet)
 *   - Harmonic content (sawtooth → triangle → sine)
 *   - Unique texture layers
 */

/* ── core state ──────────────────────────────────────────────────────── */

let _ctx: AudioContext | null = null;
let _masterNode: AudioNode | null = null;

function ctx(): AudioContext {
  if (!_ctx) {
    _ctx = new AudioContext();
    _masterNode = null;
  }
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

function getMasterNode(ac: AudioContext): AudioNode {
  if (!_masterNode) {
    const masterGain = ac.createGain();
    masterGain.gain.value = 2.0; // Boost volume significantly
    
    const compressor = ac.createDynamicsCompressor();
    compressor.threshold.value = -12;
    compressor.knee.value = 30;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.05;
    compressor.release.value = 0.25;
    
    masterGain.connect(compressor);
    compressor.connect(ac.destination);
    _masterNode = masterGain;
  }
  return _masterNode;
}

let _stopFns: Array<() => void> = [];
let _activeTimers: number[] = [];
let _playingState: { chakraId: number; soundIndex: number } | null = null;
let _listeners: Array<() => void> = [];

export function subscribe(cb: () => void) {
  _listeners.push(cb);
  return () => { _listeners = _listeners.filter(c => c !== cb); };
}
function notify() { _listeners.forEach(c => c()); }
export function getPlayingState() { return _playingState; }

export function stopSound() {
  _activeTimers.forEach(t => clearTimeout(t));
  _activeTimers = [];
  _stopFns.forEach(fn => { try { fn(); } catch { /**/ } });
  _stopFns = [];
  _playingState = null;
  notify();
}

export function playSound(chakraId: number, soundIndex: number) {
  if (_playingState?.chakraId === chakraId && _playingState?.soundIndex === soundIndex) {
    stopSound(); return;
  }
  stopSound();
  const ac = ctx();
  _playingState = { chakraId, soundIndex };
  notify();
  const gen = MAP[`${chakraId}-${soundIndex}`];
  if (gen) gen(ac);
  const t = window.setTimeout(() => {
    _stopFns = []; _activeTimers = [];
    _playingState = null; notify();
  }, 8400);
  _activeTimers.push(t);
}

/* ═══════════════════════════════════════════════════════════════════════
   LOW-LEVEL PRIMITIVES
   ═══════════════════════════════════════════════════════════════════════ */

function T<N extends AudioNode>(n: N): N {
  _stopFns.push(() => { try { n.disconnect(); } catch {/**/ } });
  return n;
}
function stopOsc(o: OscillatorNode) {
  _stopFns.push(() => { try { o.stop(); } catch {/**/ } });
}
function stopSrc(s: AudioBufferSourceNode) {
  _stopFns.push(() => { try { s.stop(); } catch {/**/ } });
}

/** Oscillator — auto-tracked */
function O(ac: AudioContext, type: OscillatorType, hz: number, dur: number): OscillatorNode {
  const o = ac.createOscillator();
  o.type = type; o.frequency.value = hz;
  o.start(); o.stop(ac.currentTime + dur);
  T(o); stopOsc(o); return o;
}

/** GainNode with fade-in / sustain / fade-out */
function G(ac: AudioContext, vol: number, fi: number, fo: number, dur: number, dest?: AudioNode): GainNode {
  const g = ac.createGain(); const t = ac.currentTime;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + fi);
  g.gain.setValueAtTime(vol, t + dur - fo);
  g.gain.linearRampToValueAtTime(0, t + dur);
  g.connect(dest ?? getMasterNode(ac)); T(g); return g;
}

/** Constant DC gain offset (used to bias LFOs to unipolar) */
function DC(ac: AudioContext, val: number): AudioNode {
  const s = ac.createConstantSource(); s.offset.value = val;
  s.start(); T(s); return s;
}

/** BandPass filter */
function BP(ac: AudioContext, hz: number, q: number): BiquadFilterNode {
  const f = ac.createBiquadFilter();
  f.type = 'bandpass'; f.frequency.value = hz; f.Q.value = q;
  T(f); return f;
}

/** LowPass filter */
function LP(ac: AudioContext, hz: number, q = 1): BiquadFilterNode {
  const f = ac.createBiquadFilter();
  f.type = 'lowpass'; f.frequency.value = hz; f.Q.value = q;
  T(f); return f;
}

/** HighPass filter */
function HP(ac: AudioContext, hz: number): BiquadFilterNode {
  const f = ac.createBiquadFilter();
  f.type = 'highpass'; f.frequency.value = hz; T(f); return f;
}

/** LFO → AudioParam */
function LFO(ac: AudioContext, rate: number, amount: number, param: AudioParam, dur: number) {
  const l = O(ac, 'sine', rate, dur);
  const g = ac.createGain(); g.gain.value = amount;
  l.connect(g); g.connect(param); T(g);
}

/** White noise buffer source */
function Noise(ac: AudioContext, dur: number): AudioBufferSourceNode {
  const buf = ac.createBuffer(1, Math.ceil(ac.sampleRate * dur), ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const s = ac.createBufferSource(); s.buffer = buf;
  s.start(); s.stop(ac.currentTime + dur);
  T(s); stopSrc(s); return s;
}

/** Reverb using a chain of delay+feedback nodes */
function Reverb(ac: AudioContext, time: number, fb: number, wet: number, dest?: AudioNode): AudioNode {
  const d1 = ac.createDelay(); d1.delayTime.value = time;
  const d2 = ac.createDelay(); d2.delayTime.value = time * 0.7;
  const f = ac.createGain(); f.gain.value = fb;
  const w = ac.createGain(); w.gain.value = wet;
  d1.connect(d2); d2.connect(f); f.connect(d1); d1.connect(w);
  w.connect(dest ?? getMasterNode(ac));
  T(d1); T(d2); T(f); T(w);
  return d1; // send audio here
}

/** Lush chord pad using stacked detuned warm oscillators with LFO modulation */
function AmbientPad(
  ac: AudioContext,
  hz: number,
  vol: number,
  dur: number,
  dest: AudioNode,
  intervals = [1.0, 1.5, 2.0, 3.0]
) {
  const lp = LP(ac, hz * 4);
  const g = G(ac, vol, 2.5, 3.0, dur, dest);
  lp.connect(g);
  
  intervals.forEach((r, i) => {
    const o1 = O(ac, 'sine', hz * r, dur);
    const o2 = O(ac, 'triangle', hz * r * 1.005, dur);
    
    LFO(ac, 0.15 + i * 0.05, 1.5, o1.frequency, dur);
    LFO(ac, 0.2 + i * 0.04, 1.2, o2.frequency, dur);
    
    const v = ac.createGain();
    v.gain.value = 0.25;
    o1.connect(v);
    o2.connect(v);
    v.connect(lp);
    T(v);
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   VOCAL FORMANT TOOLKIT
   
   Bija mantra vowel formants (human vowel acoustics):
     AH (lAm, vAm, rAm, yAm, hAm):   F1=730, F2=1090, F3=2440
     oo (as in "hUm"):                  F1=300, F2=870,  F3=2240
     OH (start of Om):                  F1=570, F2=840,  F3=2410
     MM (nasal close, end of mantra):   F1=250, F2=2500 (nasal resonance)
     AW (awe, open back):               F1=600, F2=1000
   ═══════════════════════════════════════════════════════════════════════ */

interface Formant { f: number; q: number; g: number; }

const F_AH: Formant[] = [{ f: 730, q: 9, g: 1.0 }, { f: 1090, q: 10, g: 0.5 }, { f: 2440, q: 12, g: 0.12 }];
const F_OH: Formant[] = [{ f: 570, q: 10, g: 1.0 }, { f: 840, q: 12, g: 0.4 }, { f: 2410, q: 12, g: 0.08 }];
const F_MM: Formant[] = [{ f: 250, q: 6, g: 1.0 }, { f: 2500, q: 8, g: 0.15 }];
const F_OO: Formant[] = [{ f: 300, q: 12, g: 1.0 }, { f: 870, q: 12, g: 0.35 }, { f: 2240, q: 14, g: 0.07 }];
const F_EE: Formant[] = [{ f: 270, q: 8, g: 1.0 }, { f: 2290, q: 10, g: 0.7 }, { f: 3010, q: 12, g: 0.25 }];

/**
 * Core vocal voice: oscillator → parallel formant BPs → envelope → reverb
 */
function Voice(
  ac: AudioContext,
  hz: number,
  wave: OscillatorType,
  formants: Formant[],
  vol: number,
  dur: number,
  fi: number,
  fo: number,
  rev: AudioNode,
  vibRate = 5.2,
  vibAmt = 2.5,
) {
  const o = O(ac, wave, hz, dur);
  LFO(ac, vibRate, vibAmt, o.frequency, dur);
  formants.forEach(f => {
    const bp = BP(ac, f.f, f.q);
    const gn = G(ac, vol * f.g, fi, fo, dur, rev);
    o.connect(bp); bp.connect(gn);
  });
}

/**
 * Rhythmically-gated vocal chant — creates "LAM… LAM… LAM…" effect.
 * Gate rate controls how fast the chanting pulse repeats.
 */
function ChantGated(
  ac: AudioContext,
  hz: number,
  wave: OscillatorType,
  formants: Formant[],
  vol: number,
  dur: number,
  gateHz: number,     // chant repetition speed
  dutyOn: number,     // 0–1, how much of the period is voiced (0.6 = 60%)
  rev: AudioNode,
  vibRate = 5.2,
  vibAmt = 2.5,
) {
  const o = O(ac, wave, hz, dur);
  LFO(ac, vibRate, vibAmt, o.frequency, dur);

  // Overall shape
  const shapeGain = G(ac, 1, 1.0, 1.5, dur);

  formants.forEach(f => {
    const bp = BP(ac, f.f, f.q);
    const mixGain = ac.createGain();
    mixGain.gain.value = vol * f.g;
    o.connect(bp); bp.connect(mixGain); mixGain.connect(shapeGain);
    T(mixGain);
  });

  // Pulse gate
  const gate = ac.createGain(); gate.gain.value = 0; T(gate);
  shapeGain.connect(gate); gate.connect(rev);

  const period = 1 / gateHz;
  const t0 = ac.currentTime + 0.8; // small startup delay
  const cycles = Math.floor((dur - 0.8) * gateHz);
  for (let i = 0; i < cycles; i++) {
    const start = t0 + i * period;
    const onEnd = start + period * dutyOn;
    const offEnd = start + period;
    gate.gain.setValueAtTime(0, start);
    gate.gain.linearRampToValueAtTime(1, start + 0.05);     // quick attack
    gate.gain.setValueAtTime(1, onEnd - 0.08);
    gate.gain.linearRampToValueAtTime(0, onEnd);             // tail off
    gate.gain.setValueAtTime(0, offEnd);
  }
}

/**
 * OM / AUM sweep — formants morph from open vowel → nasal close.
 * startF: first vowel formants, endF: nasal close formants
 */
function OmSweep(
  ac: AudioContext,
  hz: number,
  wave: OscillatorType,
  startF: Formant[],
  endF: Formant[],
  vol: number,
  dur: number,
  rev: AudioNode,
  vibRate = 5,
  vibAmt = 2,
) {
  const o = O(ac, wave, hz, dur);
  LFO(ac, vibRate, vibAmt, o.frequency, dur);
  const t0 = ac.currentTime;
  const sweepStart = t0 + dur * 0.35;
  const sweepEnd   = t0 + dur * 0.65;

  // Blend start and end formants
  const maxLen = Math.max(startF.length, endF.length);
  for (let i = 0; i < maxLen; i++) {
    const s = startF[i] ?? endF[i];
    const e = endF[i] ?? startF[i];
    const bp = BP(ac, s.f, s.q);
    bp.frequency.setValueAtTime(s.f, t0);
    bp.frequency.setValueAtTime(s.f, sweepStart);
    bp.frequency.linearRampToValueAtTime(e.f, sweepEnd);

    const gv = Math.max(s.g, e.g);
    const gn = G(ac, vol * gv, 1.2, 2, dur, rev);
    o.connect(bp); bp.connect(gn);
  }

  // Sub sine for warmth
  const sub = O(ac, 'sine', hz, dur);
  const sg = G(ac, vol * 0.3, 1.5, 2, dur, rev);
  sub.connect(sg);
}

/* ═══════════════════════════════════════════════════════════════════════
   UNIQUE TEXTURE LAYERS PER CHAKRA
   ═══════════════════════════════════════════════════════════════════════ */

/** Root: deep temple bell tone */
function TempleBell(ac: AudioContext, hz: number, vol: number, dur: number, dest: AudioNode) {
  [1, 2.756, 5.404, 8.933].forEach((r, i) => {
    const o1 = O(ac, 'sine', hz * r, dur);
    const o2 = O(ac, 'sine', hz * r + 0.8 + i * 0.2, dur);
    const env = G(ac, vol / (i + 1) * 0.5, 0.01, 5, dur, dest);
    o1.connect(env); o2.connect(env);
  });
}

/** Sacral: flowing water shimmer (bandpass noise sweep) */
function WaterShimmer(ac: AudioContext, vol: number, dur: number, dest: AudioNode) {
  const n = Noise(ac, dur);
  const f = BP(ac, 1200, 3);
  LFO(ac, 0.4, 400, f.frequency, dur);
  const g = G(ac, vol, 2, 2, dur, dest);
  const hp = HP(ac, 400);
  n.connect(hp); hp.connect(f); f.connect(g);
}

/** Solar: bright harmonic shimmer */
function SolarShimmer(ac: AudioContext, hz: number, vol: number, dur: number, dest: AudioNode) {
  [1, 2, 3, 4, 5].forEach((r, i) => {
    const o = O(ac, 'sine', hz * r, dur);
    LFO(ac, 0.3 + i * 0.1, 0.5, o.frequency, dur);
    const g = G(ac, vol / (i + 1), 1.5, 2, dur, dest);
    o.connect(g);
  });
}

/** Heart: warm pad layer (multiple soft sines) */
function HeartPad(ac: AudioContext, hz: number, vol: number, dur: number, dest: AudioNode) {
  [1, 1.25, 1.5, 2].forEach((r, i) => {
    const o = O(ac, 'sine', hz * r, dur);
    LFO(ac, 0.2 + i * 0.07, 1.5, o.frequency, dur);
    const g = G(ac, vol / (i + 1), 2, 2, dur, dest);
    o.connect(g);
  });
}

/** Throat: airy breath layer */
function BreathLayer(ac: AudioContext, vol: number, dur: number, dest: AudioNode) {
  const n = Noise(ac, dur);
  const f = BP(ac, 3000, 2);
  LFO(ac, 0.6, 600, f.frequency, dur);
  const lp = LP(ac, 5000);
  const g = G(ac, vol, 2, 2, dur, dest);
  n.connect(f); f.connect(lp); lp.connect(g);
}

/** Third Eye: cosmic shimmer (very high sines) */
function CosmicShimmer(ac: AudioContext, hz: number, vol: number, dur: number, dest: AudioNode) {
  [1, 1.5, 2, 3].forEach((r, i) => {
    const o = O(ac, 'sine', hz * r, dur);
    LFO(ac, 0.15 + i * 0.08, 2, o.frequency, dur);
    const g = G(ac, vol / (i + 1), 2.5, 2.5, dur, dest);
    o.connect(g);
  });
}

/** Crown: singing bowl (high, ethereal) */
function CrownBowl(ac: AudioContext, hz: number, vol: number, dur: number, dest: AudioNode) {
  [1, 2.756, 5.404, 8.933, 13.3].forEach((r, i) => {
    const o1 = O(ac, 'sine', hz * r, dur);
    const o2 = O(ac, 'sine', hz * r + 1.5, dur);
    const g = G(ac, vol / (i + 1) * 0.4, 0.05, 3.5, dur, dest);
    o1.connect(g); o2.connect(g);
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   35 UNIQUE SOUNDS
   
   Pitch guide:
   Root:      65–110 Hz  (sub-bass / bass, very deep masculine)
   Sacral:    130–196 Hz (warm feminine range)
   Solar:     196–262 Hz (strong assertive mid-range)
   Heart:     246–330 Hz (warm choir range)
   Throat:    294–392 Hz (clear midrange–high)
   Third Eye: 136–288 Hz (dark layered, multiple octaves)
   Crown:     396–528 Hz (high, ethereal, transcendent)
   ═══════════════════════════════════════════════════════════════════════ */

type Gen = (ac: AudioContext) => void;

const MAP: Record<string, Gen> = {

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     1 · MULADHARA — LAM
     Deep grounding meditation soundscapes. 82 Hz base.
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  // LAM bija chant — deep 82 Hz chant + warm grounding pad
  '1-0': (ac) => {
    const rv = Reverb(ac, 0.35, 0.45, 0.55);
    ChantGated(ac, 82, 'triangle', F_AH, 0.2, 8, 0.35, 0.65, rv, 4.5, 2.5);
    AmbientPad(ac, 82, 0.12, 8, rv, [1.0, 1.5, 2.0]);
  },

  // Tibetan monk low hum — 65 Hz warm choral drone + singing bowls
  '1-1': (ac) => {
    const rv = Reverb(ac, 0.4, 0.45, 0.6);
    AmbientPad(ac, 65, 0.2, 8, rv, [1.0, 1.5, 2.0, 3.0]);
    TempleBell(ac, 65, 0.08, 8, rv);
  },

  // Earthy bass vibration — 55 Hz grounding sub hum + nature breeze
  '1-2': (ac) => {
    const rv = Reverb(ac, 0.45, 0.48, 0.65);
    AmbientPad(ac, 55, 0.22, 8, rv, [1.0, 1.5, 2.0]);
    Voice(ac, 82, 'triangle', F_MM, 0.1, 8, 2.5, 2.5, rv, 3, 1.5);
    BreathLayer(ac, 0.04, 8, rv);
  },

  // Grounding temple chant
  '1-3': (ac) => {
    const rv = Reverb(ac, 0.35, 0.4, 0.55);
    AmbientPad(ac, 110, 0.15, 8, rv, [1.0, 1.5, 2.0]);
    TempleBell(ac, 82, 0.06, 8, rv);
  },

  // Slow deep spiritual hum
  '1-4': (ac) => {
    const rv = Reverb(ac, 0.4, 0.45, 0.6);
    AmbientPad(ac, 82, 0.18, 8, rv, [0.5, 1.0, 1.5, 2.0]);
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     2 · SVADHISHTHANA — VAM
     Warm flowing feminine range. 130–196 Hz.
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  // VAM bija chant — gentle 175 Hz flowing chant + water shimmer
  '2-0': (ac) => {
    const rv = Reverb(ac, 0.45, 0.48, 0.65);
    ChantGated(ac, 175, 'triangle', F_AH, 0.18, 8, 0.32, 0.68, rv, 5.0, 2.0);
    WaterShimmer(ac, 0.06, 8, rv);
    AmbientPad(ac, 175, 0.1, 8, rv, [1.0, 1.5, 2.0]);
  },

  // Soft feminine spiritual chant — pure major-chord pad + water
  '2-1': (ac) => {
    const rv = Reverb(ac, 0.5, 0.5, 0.7);
    Voice(ac, 196, 'sine', F_AH, 0.18, 8, 2.5, 2.5, rv, 5.5, 2);
    AmbientPad(ac, 196, 0.14, 8, rv, [1.0, 1.25, 1.5, 2.0]);
    WaterShimmer(ac, 0.05, 8, rv);
  },

  // Water flow mantra — crystal bowl + gentle water stream
  '2-2': (ac) => {
    const rv = Reverb(ac, 0.55, 0.52, 0.75);
    OmSweep(ac, 165, 'sine', F_OO, F_MM, 0.15, 8, rv, 4.8, 1.8);
    TempleBell(ac, 165, 0.08, 8, rv);
    WaterShimmer(ac, 0.08, 8, rv);
  },

  // Emotional healing
  '2-3': (ac) => {
    const rv = Reverb(ac, 0.45, 0.45, 0.6);
    AmbientPad(ac, 196, 0.16, 8, rv, [1.0, 1.5, 2.0]);
    WaterShimmer(ac, 0.04, 8, rv);
  },

  // Orange chakra vocal meditation
  '2-4': (ac) => {
    const rv = Reverb(ac, 0.45, 0.45, 0.6);
    AmbientPad(ac, 220, 0.15, 8, rv, [1.0, 1.25, 1.5, 2.0]);
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     3 · MANIPURA — RAM
     Strong confident golden solar range. 220–262 Hz.
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  // RAM bija chant — warm golden gated chant + solar pad
  '3-0': (ac) => {
    const rv = Reverb(ac, 0.35, 0.42, 0.55);
    ChantGated(ac, 220, 'triangle', F_AH, 0.18, 8, 0.45, 0.62, rv, 5.2, 2.8);
    AmbientPad(ac, 220, 0.1, 8, rv, [1.0, 1.5, 2.0]);
  },

  // Energetic fire mantra — radiant major pad + solar shimmer
  '3-1': (ac) => {
    const rv = Reverb(ac, 0.38, 0.45, 0.58);
    AmbientPad(ac, 247, 0.16, 8, rv, [1.0, 1.25, 1.5, 2.0]);
    SolarShimmer(ac, 247, 0.05, 8, rv);
  },

  // Warrior monk meditation — sustained chant + deep low pad support
  '3-2': (ac) => {
    const rv = Reverb(ac, 0.4, 0.45, 0.6);
    Voice(ac, 262, 'triangle', F_AH, 0.16, 8, 2.0, 2.5, rv, 5.5, 3);
    AmbientPad(ac, 131, 0.15, 8, rv, [1.0, 1.5, 2.0]);
    SolarShimmer(ac, 131, 0.04, 8, rv);
  },

  // Golden solar chanting
  '3-3': (ac) => {
    const rv = Reverb(ac, 0.4, 0.42, 0.6);
    AmbientPad(ac, 220, 0.18, 8, rv, [1.0, 1.5, 2.0]);
  },

  // Motivational spiritual hum
  '3-4': (ac) => {
    const rv = Reverb(ac, 0.4, 0.42, 0.6);
    AmbientPad(ac, 196, 0.18, 8, rv, [1.0, 1.33, 1.5, 2.0]);
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     4 · ANAHATA — YAM
     Loving compassionate green heart range. 246–330 Hz.
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  // YAM bija chant — gated heart choir + warm loving pad
  '4-0': (ac) => {
    const rv = Reverb(ac, 0.55, 0.5, 0.72);
    ChantGated(ac, 246, 'sine', F_AH, 0.16, 8, 0.3, 0.7, rv, 4.8, 2.0);
    AmbientPad(ac, 246, 0.14, 8, rv, [1.0, 1.25, 1.5, 2.0]);
    HeartPad(ac, 123, 0.06, 8, rv);
  },

  // Heart choir resonance — rich celestial choir pad
  '4-1': (ac) => {
    const rv = Reverb(ac, 0.6, 0.52, 0.75);
    AmbientPad(ac, 294, 0.18, 8, rv, [1.0, 1.25, 1.5, 2.0, 3.0]);
    Voice(ac, 294, 'sine', F_AH, 0.12, 8, 2.5, 3.0, rv, 4.5, 1.8);
    HeartPad(ac, 147, 0.06, 8, rv);
  },

  // Healing compassion chorus — peaceful wind bells + suspended pad
  '4-2': (ac) => {
    const rv = Reverb(ac, 0.65, 0.55, 0.78);
    AmbientPad(ac, 330, 0.16, 8, rv, [1.0, 1.33, 1.5, 2.0]);
    TempleBell(ac, 330, 0.08, 8, rv);
    HeartPad(ac, 165, 0.05, 8, rv);
  },

  // Compassion meditation
  '4-3': (ac) => {
    const rv = Reverb(ac, 0.55, 0.5, 0.7);
    AmbientPad(ac, 277, 0.18, 8, rv, [1.0, 1.25, 1.5, 2.0]);
  },

  // Peaceful green mantra
  '4-4': (ac) => {
    const rv = Reverb(ac, 0.55, 0.5, 0.7);
    AmbientPad(ac, 246, 0.18, 8, rv, [1.0, 1.5, 2.0]);
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     5 · VISHUDDHA — HAM
     Clear expressive blue throat range. 294–392 Hz.
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  // HAM bija chant — gated throat voice + airy background breeze
  '5-0': (ac) => {
    const rv = Reverb(ac, 0.6, 0.52, 0.75);
    ChantGated(ac, 294, 'sine', F_AH, 0.15, 8, 0.35, 0.65, rv, 5.0, 2.2);
    AmbientPad(ac, 294, 0.12, 8, rv, [1.0, 1.5, 2.0]);
    BreathLayer(ac, 0.06, 8, rv);
  },

  // Throat echo resonance — spacious flute pad + voice resonance
  '5-1': (ac) => {
    const rv = Reverb(ac, 0.7, 0.55, 0.8);
    Voice(ac, 330, 'sine', F_EE, 0.14, 8, 2.5, 2.5, rv, 5.5, 2);
    AmbientPad(ac, 330, 0.14, 8, rv, [1.0, 1.5, 2.0, 3.0]);
    BreathLayer(ac, 0.08, 8, rv);
  },

  // Ether spiritual chant — deep ether drone + breath texture
  '5-2': (ac) => {
    const rv = Reverb(ac, 0.65, 0.52, 0.78);
    Voice(ac, 370, 'sine', F_OO, 0.14, 8, 2.5, 2.5, rv, 5.2, 2);
    AmbientPad(ac, 185, 0.16, 8, rv, [1.0, 1.5, 2.0]);
    BreathLayer(ac, 0.08, 8, rv);
  },

  // Vocal clarity meditation
  '5-3': (ac) => {
    const rv = Reverb(ac, 0.6, 0.5, 0.7);
    AmbientPad(ac, 294, 0.18, 8, rv, [1.0, 1.5, 2.0]);
  },

  // Blue chakra humming
  '5-4': (ac) => {
    const rv = Reverb(ac, 0.6, 0.5, 0.7);
    AmbientPad(ac, 349, 0.18, 8, rv, [1.0, 1.5, 2.0]);
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     6 · AJNA — OM
     Deep mystical third eye range. 136–288 Hz.
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  // OM sacred mantra — mystical OM sweep + high chime pad
  '6-0': (ac) => {
    const rv = Reverb(ac, 0.65, 0.54, 0.78);
    OmSweep(ac, 136.1, 'sine', F_OH, F_MM, 0.18, 8, rv, 4.5, 1.8);
    AmbientPad(ac, 136.1, 0.15, 8, rv, [1.0, 1.5, 2.0, 3.0]);
    CosmicShimmer(ac, 136.1, 0.04, 8, rv);
  },

  // Third eye theta pulse — true stereo theta binaural beat (4 Hz difference)
  '6-1': (ac) => {
    const rv = Reverb(ac, 0.7, 0.55, 0.8);
    const oL = O(ac, 'sine', 144, 8);
    const oR = O(ac, 'sine', 148, 8);
    const panL = ac.createStereoPanner ? ac.createStereoPanner() : null;
    const panR = ac.createStereoPanner ? ac.createStereoPanner() : null;
    if (panL && panR) {
      panL.pan.value = -1; panR.pan.value = 1;
      T(panL); T(panR);
    }
    const gL = G(ac, 0.15, 3, 3, 8, panL ?? rv);
    const gR = G(ac, 0.15, 3, 3, 8, panR ?? rv);
    oL.connect(gL); oR.connect(gR);
    if (panL && panR) {
      panL.connect(rv); panR.connect(rv);
    }
    AmbientPad(ac, 288, 0.12, 8, rv, [1.0, 1.5, 2.0]);
    CosmicShimmer(ac, 288, 0.03, 8, rv);
  },

  // Mystical deep humming — warm bass choir stacked pad
  '6-2': (ac) => {
    const rv = Reverb(ac, 0.68, 0.54, 0.78);
    AmbientPad(ac, 108, 0.2, 8, rv, [1.0, 1.5, 2.0, 3.0]);
    CosmicShimmer(ac, 216, 0.05, 8, rv);
  },

  // Pineal awakening
  '6-3': (ac) => {
    const rv = Reverb(ac, 0.65, 0.5, 0.75);
    AmbientPad(ac, 180, 0.18, 8, rv, [1.0, 1.5, 2.0]);
  },

  // Indigo spiritual resonance
  '6-4': (ac) => {
    const rv = Reverb(ac, 0.65, 0.5, 0.75);
    AmbientPad(ac, 136, 0.18, 8, rv, [1.0, 1.5, 2.0]);
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     7 · SAHASRARA — AUM
     Ethereal cosmic crown range. 396–528 Hz.
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  // AUM sacred meditation — celestial AUM sweep + crystal singing bowl
  '7-0': (ac) => {
    const rv = Reverb(ac, 0.75, 0.58, 0.85);
    OmSweep(ac, 396, 'sine', F_OO, F_MM, 0.15, 8, rv, 4.8, 1.5);
    AmbientPad(ac, 396, 0.12, 8, rv, [1.0, 1.5, 2.0]);
    CrownBowl(ac, 396, 0.08, 8, rv);
  },

  // Angelic choir EE-AH — shimmering major chord meditation pad
  '7-1': (ac) => {
    const rv = Reverb(ac, 0.8, 0.6, 0.9);
    AmbientPad(ac, 440, 0.18, 8, rv, [1.0, 1.25, 1.5, 2.0, 2.5]);
    CrownBowl(ac, 440, 0.06, 8, rv);
  },

  // Cosmic divine hum — 528 Hz crystal energy pad with lower sub harmonics
  '7-2': (ac) => {
    const rv = Reverb(ac, 0.78, 0.58, 0.88);
    AmbientPad(ac, 528, 0.15, 8, rv, [0.5, 1.0, 1.5, 2.0]);
    CrownBowl(ac, 528, 0.1, 8, rv);
  },

  // Enlightenment mantra
  '7-3': (ac) => {
    const rv = Reverb(ac, 0.75, 0.55, 0.8);
    AmbientPad(ac, 432, 0.18, 8, rv, [1.0, 1.5, 2.0]);
  },

  // Celestial transcendence
  '7-4': (ac) => {
    const rv = Reverb(ac, 0.75, 0.55, 0.8);
    AmbientPad(ac, 396, 0.18, 8, rv, [1.0, 1.5, 2.0]);
  },
};

/* ── UI metadata ─────────────────────────────────────────────────────── */

export interface ChakraSoundInfo { label: string; icon: string; }

export const CHAKRA_SOUNDS: Record<number, ChakraSoundInfo[]> = {
  1: [
    { label: 'LAM Bija Chant', icon: '🕉️' },
  ],
  2: [
    { label: 'VAM Bija Chant', icon: '🕉️' },
  ],
  3: [
    { label: 'RAM Bija Chant', icon: '🕉️' },
  ],
  4: [
    { label: 'YAM Bija Chant', icon: '🕉️' },
  ],
  5: [
    { label: 'HAM Bija Chant', icon: '🕉️' },
  ],
  6: [
    { label: 'OM Sacred Mantra', icon: '🕉️' },
  ],
  7: [
    { label: 'AUM Sacred Meditation', icon: '🕉️' },
  ],
};
