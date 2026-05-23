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
function ctx(): AudioContext {
  if (!_ctx) _ctx = new AudioContext();
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
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
  g.connect(dest ?? ac.destination); T(g); return g;
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
  w.connect(dest ?? ac.destination);
  T(d1); T(d2); T(f); T(w);
  return d1; // send audio here
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
     Deep masculine monk. Very low (65–110 Hz). Sawtooth for richness.
     Tight short reverb (temple room). Slow stately chant rhythm.
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  // LAM bija chant — deep 82 Hz, slow 0.38 Hz gate, AH→MM
  '1-0': (ac) => {
    const rv = Reverb(ac, 0.18, 0.25, 0.35);       // tight temple reverb
    ChantGated(ac, 82, 'sawtooth', F_AH, 0.22, 8, 0.38, 0.65, rv, 4.8, 3);
    // nasal MM undertone throughout
    Voice(ac, 82, 'sine', F_MM, 0.06, 8, 2, 2.5, rv, 3, 1);
    // sub-bass pulse
    const sub = O(ac, 'sine', 41, 8);
    const sg = G(ac, 0.08, 2, 2, 8, rv); sub.connect(sg);
  },

  // Tibetan monk low hum — 65 Hz drone, pure and sustained, no gate
  '1-1': (ac) => {
    const rv = Reverb(ac, 0.22, 0.28, 0.4);
    Voice(ac, 65, 'sawtooth', F_AH, 0.2, 8, 2, 2.5, rv, 3.5, 2);
    Voice(ac, 65, 'sine', F_MM, 0.08, 8, 2, 2.5, rv, 3, 1);
    // Octave above, softer
    Voice(ac, 130, 'triangle', F_AH, 0.05, 8, 2.5, 2.5, rv, 4, 1.5);
    TempleBell(ac, 55, 0.06, 8, rv);
  },

  // Earthy bass vibration — 55 Hz with slow tremolo, very primal
  '1-2': (ac) => {
    const rv = Reverb(ac, 0.25, 0.3, 0.4);
    const o = O(ac, 'sine', 55, 8);
    LFO(ac, 0.9, 18, o.frequency, 8);              // slow tremolo
    const g = G(ac, 0.22, 2, 2, 8, rv); o.connect(g);
    const o2 = O(ac, 'triangle', 110, 8);
    LFO(ac, 0.9, 9, o2.frequency, 8);
    const g2 = G(ac, 0.1, 2.5, 2, 8, rv); o2.connect(g2);
    Voice(ac, 82, 'sawtooth', F_AH, 0.06, 8, 3, 2.5, rv, 2.5, 4);
  },

  // Grounding temple chant — 110 Hz monk choir (2 deep voices)
  '1-3': (ac) => {
    const rv = Reverb(ac, 0.2, 0.26, 0.38);
    [-12, 0, +8].forEach((det, i) => {
      const o = O(ac, 'sawtooth', 110, 8);
      o.detune.value = det;
      LFO(ac, 4.2 + i * 0.3, 2, o.frequency, 8);
      F_AH.forEach(f => {
        const bp = BP(ac, f.f, f.q);
        const gn = G(ac, 0.07 * f.g, 1.5 + i * 0.2, 2.5, 8, rv);
        o.connect(bp); bp.connect(gn);
      });
    });
    TempleBell(ac, 82, 0.08, 8, rv);
  },

  // Slow deep spiritual hum — 82 Hz OM sweep with long nasal tail
  '1-4': (ac) => {
    const rv = Reverb(ac, 0.28, 0.32, 0.45);
    OmSweep(ac, 82, 'sawtooth', F_AH, F_MM, 0.22, 8, rv, 3.5, 2.5);
    // Sub rumble
    const s = O(ac, 'sine', 41, 8);
    const sg = G(ac, 0.1, 2.5, 2.5, 8, rv); s.connect(sg);
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     2 · SVADHISHTHANA — VAM
     Soft flowing feminine. 130–196 Hz. Triangle wave (softer).
     Longer wetter reverb (cave by water). Gentle flowing rhythm.
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  // VAM bija — 175 Hz triangle, gentle 0.35 Hz gate, flowing
  '2-0': (ac) => {
    const rv = Reverb(ac, 0.38, 0.35, 0.55);       // longer, wetter
    ChantGated(ac, 175, 'triangle', F_AH, 0.2, 8, 0.35, 0.7, rv, 5.5, 2.5);
    WaterShimmer(ac, 0.03, 8, rv);
    const sub = O(ac, 'sine', 87, 8);
    const sg = G(ac, 0.05, 2, 2, 8, rv); sub.connect(sg);
  },

  // Soft feminine spiritual chant — 196 Hz, pure sustained, no gate
  '2-1': (ac) => {
    const rv = Reverb(ac, 0.42, 0.38, 0.58);
    Voice(ac, 196, 'triangle', F_AH, 0.18, 8, 2.5, 2.5, rv, 5.8, 2);
    Voice(ac, 196, 'sine', F_OO, 0.06, 8, 3, 2.5, rv, 5, 1.5);
    WaterShimmer(ac, 0.04, 8, rv);
  },

  // Water flow mantra — 165 Hz with water LFO texture, OM sweep
  '2-2': (ac) => {
    const rv = Reverb(ac, 0.45, 0.4, 0.6);
    OmSweep(ac, 165, 'triangle', F_OO, F_MM, 0.18, 8, rv, 5.2, 2);
    WaterShimmer(ac, 0.05, 8, rv);
  },

  // Emotional healing — 196 Hz binaural (4.5 Hz theta beat)
  '2-3': (ac) => {
    const rv = Reverb(ac, 0.4, 0.35, 0.55);
    Voice(ac, 196, 'triangle', F_AH, 0.17, 8, 2, 2.5, rv, 5.5, 2.2);
    Voice(ac, 196 + 4.5, 'triangle', F_AH, 0.17, 8, 2, 2.5, rv, 5.5, 2.2); // beat
    Voice(ac, 98, 'sine', F_OO, 0.06, 8, 2.5, 2.5, rv, 4, 1.5);
    WaterShimmer(ac, 0.025, 8, rv);
  },

  // Orange chakra vocal meditation — 220 Hz ascending VAM choir
  '2-4': (ac) => {
    const rv = Reverb(ac, 0.4, 0.38, 0.56);
    [0, -10, +9].forEach((det, i) => {
      const o = O(ac, 'triangle', 220, 8);
      o.detune.value = det;
      LFO(ac, 5.2 + i * 0.3, 1.8, o.frequency, 8);
      F_AH.forEach(f => {
        const bp = BP(ac, f.f, f.q);
        const gn = G(ac, 0.065 * f.g, 1.8 + i * 0.2, 2.5, 8, rv);
        o.connect(bp); bp.connect(gn);
      });
    });
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     3 · MANIPURA — RAM
     Strong confident. 220–262 Hz. Sawtooth (bright, assertive).
     Shorter drier reverb (stone hall). Energetic faster rhythm 0.55 Hz.
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  // RAM bija — 220 Hz sawtooth, fast 0.55 Hz gate, bright AH
  '3-0': (ac) => {
    const rv = Reverb(ac, 0.14, 0.22, 0.3);        // tight stone hall
    ChantGated(ac, 220, 'sawtooth', F_AH, 0.22, 8, 0.55, 0.6, rv, 5.8, 3.5);
    SolarShimmer(ac, 220, 0.03, 8, rv);
  },

  // Energetic fire mantra — 247 Hz staccato bursts + shimmer
  '3-1': (ac) => {
    const rv = Reverb(ac, 0.12, 0.2, 0.28);
    ChantGated(ac, 247, 'sawtooth', F_AH, 0.2, 8, 0.7, 0.5, rv, 6, 4); // faster, shorter duty
    SolarShimmer(ac, 247, 0.04, 8, rv);
  },

  // Warrior monk meditation — 262 Hz sustained powerful chant
  '3-2': (ac) => {
    const rv = Reverb(ac, 0.16, 0.23, 0.32);
    Voice(ac, 262, 'sawtooth', F_AH, 0.22, 8, 1.5, 2.5, rv, 6.2, 4);
    // Octave below for depth
    Voice(ac, 131, 'sawtooth', F_AH, 0.07, 8, 2, 2.5, rv, 5.5, 3);
    SolarShimmer(ac, 131, 0.02, 8, rv);
  },

  // Golden solar chanting — 220 Hz with harmonic shimmer, no gate
  '3-3': (ac) => {
    const rv = Reverb(ac, 0.15, 0.22, 0.3);
    OmSweep(ac, 220, 'sawtooth', F_AH, F_MM, 0.2, 8, rv, 6, 4);
    SolarShimmer(ac, 220, 0.05, 8, rv);
  },

  // Motivational spiritual hum — 196 Hz rising to 262 Hz
  '3-4': (ac) => {
    const rv = Reverb(ac, 0.14, 0.2, 0.28);
    const o = O(ac, 'sawtooth', 196, 8);
    o.frequency.setValueAtTime(196, ac.currentTime + 1);
    o.frequency.exponentialRampToValueAtTime(262, ac.currentTime + 6.5);
    LFO(ac, 6, 4, o.frequency, 8);
    F_AH.forEach(f => {
      const bp = BP(ac, f.f, f.q);
      const gn = G(ac, 0.2 * f.g, 1, 2, 8, rv);
      o.connect(bp); bp.connect(gn);
    });
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     4 · ANAHATA — YAM
     Warm loving choir. 246–330 Hz. Multiple blended voices.
     Warm lush reverb (cathedral). Slow gentle pulse 0.32 Hz.
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  // YAM bija — 246 Hz, 3-voice warm choir, slow 0.32 Hz gate
  '4-0': (ac) => {
    const rv = Reverb(ac, 0.45, 0.42, 0.6);        // cathedral warmth
    [0, -7, +11].forEach((det, i) => {
      const o = O(ac, 'triangle', 246, 8);
      o.detune.value = det;
      LFO(ac, 4.8 + i * 0.25, 2, o.frequency, 8);
      const gate = ac.createGain(); gate.gain.value = 0; T(gate);
      F_AH.forEach(f => {
        const bp = BP(ac, f.f, f.q);
        const gn = G(ac, 0.07 * f.g, 1.5 + i * 0.15, 2, 8, rv);
        o.connect(bp); bp.connect(gate); gate.connect(gn);
      });
      // pulse
      const t0 = ac.currentTime + 0.8;
      const period = 1 / 0.32;
      for (let k = 0; k < 3; k++) {
        const s = t0 + k * period;
        gate.gain.setValueAtTime(0, s);
        gate.gain.linearRampToValueAtTime(1, s + 0.08);
        gate.gain.setValueAtTime(1, s + period * 0.7);
        gate.gain.linearRampToValueAtTime(0, s + period * 0.88);
      }
    });
    HeartPad(ac, 123, 0.04, 8, rv);
  },

  // Heart choir — 5 voices, open AH, no gating, pure sustained
  '4-1': (ac) => {
    const rv = Reverb(ac, 0.5, 0.44, 0.65);
    [-15, -7, 0, +9, +16].forEach((det, i) => {
      const o = O(ac, 'triangle', 294, 8);
      o.detune.value = det;
      LFO(ac, 4.5 + i * 0.2, 1.8, o.frequency, 8);
      F_AH.forEach(f => {
        const bp = BP(ac, f.f, f.q);
        const gn = G(ac, 0.044 * f.g, 1.8 + i * 0.15, 2.5, 8, rv);
        o.connect(bp); bp.connect(gn);
      });
    });
    HeartPad(ac, 147, 0.05, 8, rv);
  },

  // Healing chorus — 330 Hz 4-voice choir with warm pad
  '4-2': (ac) => {
    const rv = Reverb(ac, 0.48, 0.42, 0.62);
    [-9, 0, +8, +17].forEach((det, i) => {
      const o = O(ac, 'triangle', 330, 8);
      o.detune.value = det;
      LFO(ac, 4.6 + i * 0.22, 2, o.frequency, 8);
      F_OH.forEach(f => {
        const bp = BP(ac, f.f, f.q);
        const gn = G(ac, 0.052 * f.g, 2 + i * 0.18, 2.5, 8, rv);
        o.connect(bp); bp.connect(gn);
      });
    });
    HeartPad(ac, 165, 0.05, 8, rv);
  },

  // Compassion meditation — 277 Hz binaural (3.5 Hz theta) + choir
  '4-3': (ac) => {
    const rv = Reverb(ac, 0.5, 0.44, 0.62);
    Voice(ac, 277, 'triangle', F_AH, 0.17, 8, 2, 2.5, rv, 5, 2);
    Voice(ac, 277 + 3.5, 'triangle', F_AH, 0.17, 8, 2, 2.5, rv, 5, 2);
    HeartPad(ac, 138, 0.04, 8, rv);
  },

  // Peaceful green mantra — YAM OM sweep, choir-like
  '4-4': (ac) => {
    const rv = Reverb(ac, 0.5, 0.45, 0.65);
    OmSweep(ac, 246, 'triangle', F_AH, F_MM, 0.2, 8, rv, 5, 2);
    [0, +12].forEach((det, i) => {
      const o = O(ac, 'triangle', 246, 8);
      o.detune.value = det;
      LFO(ac, 4.8, 2, o.frequency, 8);
      F_MM.forEach(f => {
        const bp = BP(ac, f.f, f.q);
        const gn = G(ac, 0.04 * f.g, 2 + i * 0.3, 2.5, 8, rv);
        o.connect(bp); bp.connect(gn);
      });
    });
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     5 · VISHUDDHA — HAM
     Clear airy. 294–392 Hz. Mix of triangle + breath noise.
     Echo-heavy reverb (open sky). Moderate 0.45 Hz rhythm.
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  // HAM bija — 294 Hz triangle, airy 0.45 Hz gate + breath
  '5-0': (ac) => {
    const rv = Reverb(ac, 0.55, 0.45, 0.65);       // long echo sky
    ChantGated(ac, 294, 'triangle', F_AH, 0.18, 8, 0.45, 0.65, rv, 5.5, 2.5);
    BreathLayer(ac, 0.04, 8, rv);
  },

  // Echo throat resonance — 330 Hz, long tail, formant EE
  '5-1': (ac) => {
    const rv = Reverb(ac, 0.65, 0.48, 0.7);
    Voice(ac, 330, 'triangle', F_EE, 0.16, 8, 2, 2.5, rv, 6, 2.5);
    BreathLayer(ac, 0.05, 8, rv);
    const echo2 = Reverb(ac, 0.8, 0.3, 0.2); // second echo
    Voice(ac, 330, 'sine', F_EE, 0.06, 8, 2.5, 2.5, echo2, 5.5, 2);
  },

  // Ether spiritual chant — 370 Hz open formant OO, very airy
  '5-2': (ac) => {
    const rv = Reverb(ac, 0.6, 0.46, 0.68);
    Voice(ac, 370, 'triangle', F_OO, 0.16, 8, 2, 2.5, rv, 5.8, 2.5);
    BreathLayer(ac, 0.06, 8, rv);
    Voice(ac, 185, 'sine', F_OO, 0.04, 8, 3, 2.5, rv, 5, 1.5);
  },

  // Vocal clarity meditation — 294 Hz OM sweep with echo
  '5-3': (ac) => {
    const rv = Reverb(ac, 0.58, 0.44, 0.66);
    OmSweep(ac, 294, 'triangle', F_AH, F_MM, 0.18, 8, rv, 5.5, 2.5);
    BreathLayer(ac, 0.035, 8, rv);
  },

  // Blue chakra humming — 349 Hz with airy texture, slow vibrato
  '5-4': (ac) => {
    const rv = Reverb(ac, 0.55, 0.44, 0.65);
    Voice(ac, 349, 'triangle', F_AH, 0.14, 8, 2.5, 3, rv, 4.8, 2);
    Voice(ac, 349, 'sine', F_MM, 0.06, 8, 3, 2.5, rv, 4.5, 1.8);
    BreathLayer(ac, 0.04, 8, rv);
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     6 · AJNA — OM
     Deep layered mysterious. USES 136 Hz (OM frequency) as base.
     Very dense reverb (infinite cave). Slow 0.28 Hz sustained.
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  // OM mantra — 136.1 Hz (OM tuning), full OH→MM sweep, multi-layer
  '6-0': (ac) => {
    const rv = Reverb(ac, 0.55, 0.48, 0.7);        // deep cave
    OmSweep(ac, 136.1, 'sawtooth', F_OH, F_MM, 0.22, 8, rv, 4.5, 2);
    // octave above, softer
    OmSweep(ac, 272.2, 'triangle', F_OH, F_MM, 0.06, 8, rv, 4.8, 2);
    CosmicShimmer(ac, 136.1, 0.03, 8, rv);
  },

  // Third eye meditation — 288 Hz theta pulse (slow 0.28 gate)
  '6-1': (ac) => {
    const rv = Reverb(ac, 0.6, 0.5, 0.72);
    ChantGated(ac, 288, 'sawtooth', F_OH, 0.18, 8, 0.28, 0.8, rv, 4.5, 2); // very slow sacred pulse
    CosmicShimmer(ac, 144, 0.04, 8, rv);
    Voice(ac, 72, 'sine', F_MM, 0.06, 8, 2.5, 2.5, rv, 3, 1);
  },

  // Deep meditation humming — 216 Hz layered drone, mystical
  '6-2': (ac) => {
    const rv = Reverb(ac, 0.58, 0.5, 0.7);
    // 3 octave stack: 54, 108, 216 Hz
    [54, 108, 216].forEach((hz, i) => {
      Voice(ac, hz, i < 2 ? 'sine' : 'sawtooth', F_OH, 0.12 / (i + 1), 8, 2, 2.5, rv, 3.5 + i * 0.3, 1.5);
    });
    CosmicShimmer(ac, 216, 0.04, 8, rv);
  },

  // Pineal awakening — 180 Hz 4-voice choir, low mystical
  '6-3': (ac) => {
    const rv = Reverb(ac, 0.6, 0.5, 0.72);
    [-14, -5, 0, +9].forEach((det, i) => {
      const o = O(ac, 'sawtooth', 180, 8);
      o.detune.value = det;
      LFO(ac, 4 + i * 0.28, 1.8, o.frequency, 8);
      F_OH.forEach(f => {
        const bp = BP(ac, f.f, f.q);
        const gn = G(ac, 0.058 * f.g, 2 + i * 0.2, 2.5, 8, rv);
        o.connect(bp); bp.connect(gn);
      });
    });
    CosmicShimmer(ac, 180, 0.035, 8, rv);
  },

  // Indigo spiritual resonance — 136 Hz binaural (6 Hz theta) + deep OM
  '6-4': (ac) => {
    const rv = Reverb(ac, 0.62, 0.5, 0.74);
    Voice(ac, 136.1, 'sawtooth', F_OH, 0.18, 8, 2, 2.5, rv, 4.2, 2);
    Voice(ac, 136.1 + 6, 'sawtooth', F_OH, 0.18, 8, 2, 2.5, rv, 4.2, 2);
    Voice(ac, 68, 'sine', F_MM, 0.06, 8, 2.5, 2.5, rv, 3, 1);
    CosmicShimmer(ac, 136, 0.035, 8, rv);
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     7 · SAHASRARA — AUM
     Ethereal transcendent. 396–528 Hz. Pure sine (heavenly).
     Vast shimmering reverb (infinite sky). Very soft, slow 0.25 Hz.
     AUM = full AH→OO→MM sweep.
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  // Silent AUM — 396 Hz, AH→OO→MM three-phase sweep, very soft
  '7-0': (ac) => {
    const rv = Reverb(ac, 0.7, 0.52, 0.8);         // vast infinite reverb
    // AUM = AH → OO → MM morphing over 8s
    const o = O(ac, 'sine', 396, 8);
    LFO(ac, 5, 1.5, o.frequency, 8);
    const f1 = BP(ac, 730, 9);   // AH F1 → OO F1 → MM F1
    f1.frequency.setValueAtTime(730, ac.currentTime);
    f1.frequency.linearRampToValueAtTime(300, ac.currentTime + 3.5); // AH→OO
    f1.frequency.linearRampToValueAtTime(250, ac.currentTime + 6);   // OO→MM
    const f2 = BP(ac, 1090, 10); // AH F2 → OO F2 → MM F2
    f2.frequency.setValueAtTime(1090, ac.currentTime);
    f2.frequency.linearRampToValueAtTime(870, ac.currentTime + 3.5);
    f2.frequency.linearRampToValueAtTime(2500, ac.currentTime + 6);  // nasal
    const g1 = G(ac, 0.2, 1.5, 2.5, 8, rv);
    const g2 = G(ac, 0.08, 1.5, 2.5, 8, rv);
    o.connect(f1); f1.connect(g1);
    o.connect(f2); f2.connect(g2);
    const sub = O(ac, 'sine', 198, 8);
    const sg = G(ac, 0.08, 2, 3, 8, rv); sub.connect(sg);
  },

  // Angelic choir — 440 Hz, 5 close voices, EE + AH blend
  '7-1': (ac) => {
    const rv = Reverb(ac, 0.72, 0.52, 0.82);
    [-14, -6, 0, +7, +14].forEach((det, i) => {
      const o = O(ac, 'sine', 440, 8);
      o.detune.value = det;
      LFO(ac, 5 + i * 0.18, 1.5, o.frequency, 8);
      F_OO.forEach(f => {
        const bp = BP(ac, f.f + i * 8, f.q);
        const gn = G(ac, 0.038 * f.g, 2 + i * 0.12, 2.8, 8, rv);
        o.connect(bp); bp.connect(gn);
      });
    });
    CrownBowl(ac, 440, 0.04, 8, rv);
  },

  // Cosmic divine hum — 528 Hz (love frequency), slow pure hum
  '7-2': (ac) => {
    const rv = Reverb(ac, 0.7, 0.52, 0.8);
    Voice(ac, 528, 'sine', F_OO, 0.15, 8, 2.5, 3, rv, 5, 1.2);
    Voice(ac, 264, 'sine', F_MM, 0.06, 8, 3, 3, rv, 4.5, 1);
    CrownBowl(ac, 528, 0.05, 8, rv);
  },

  // Enlightenment mantra — 432 Hz (sacred tuning) choir + bowl
  '7-3': (ac) => {
    const rv = Reverb(ac, 0.72, 0.52, 0.82);
    CrownBowl(ac, 432, 0.1, 8, rv);
    [-8, 0, +8].forEach((det, i) => {
      const o = O(ac, 'sine', 432, 8);
      o.detune.value = det;
      LFO(ac, 4.8 + i * 0.2, 1.2, o.frequency, 8);
      F_OO.forEach(f => {
        const bp = BP(ac, f.f, f.q);
        const gn = G(ac, 0.04 * f.g, 2.5 + i * 0.2, 3, 8, rv);
        o.connect(bp); bp.connect(gn);
      });
    });
  },

  // Celestial transcendence — 396 Hz binaural (3 Hz delta) + angelic
  '7-4': (ac) => {
    const rv = Reverb(ac, 0.75, 0.55, 0.85);
    Voice(ac, 396, 'sine', F_OO, 0.14, 8, 2.5, 3, rv, 4.8, 1.2);
    Voice(ac, 396 + 3, 'sine', F_OO, 0.14, 8, 2.5, 3, rv, 4.8, 1.2); // 3 Hz delta beat
    CrownBowl(ac, 396, 0.06, 8, rv);
    CosmicShimmer(ac, 396, 0.02, 8, rv);
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
