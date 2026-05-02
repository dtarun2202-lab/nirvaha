import React, { useEffect, useState, useCallback } from "react";

import { useNavigate, useLocation } from "react-router-dom";



type Phase = "inhale" | "hold" | "exhale" | "rest";



interface PhaseConfig {

  label: string;

  duration: number; // seconds

  scale: number;

  color: string;

  instruction: string;

}



const PHASES: PhaseConfig[] = [

  { label: "Inhale",  duration: 4, scale: 1.45, color: "#52b788", instruction: "Breathe in slowly through your nose" },

  { label: "Hold",    duration: 4, scale: 1.45, color: "#40916c", instruction: "Hold gently — stay still"             },

  { label: "Exhale",  duration: 6, scale: 0.75, color: "#74c69d", instruction: "Release slowly through your mouth"   },

  { label: "Rest",    duration: 2, scale: 0.75, color: "#95d5b2", instruction: "Pause before the next breath"        },

];



const TOTAL_SECONDS = 5 * 60; // 5-minute session



export default function BreathingPage() {

  const navigate = useNavigate();

  const location = useLocation();

  const sessionTitle = (location.state as any)?.title || "Breathing Session";



  const [started, setStarted] = useState(false);

  const [phaseIdx, setPhaseIdx] = useState(0);

  const [phaseElapsed, setPhaseElapsed] = useState(0);

  const [totalElapsed, setTotalElapsed] = useState(0);

  const [done, setDone] = useState(false);

  const [cycleCount, setCycleCount] = useState(0);



  const phase = PHASES[phaseIdx];

  const phaseProgress = phaseElapsed / phase.duration;

  const totalProgress = Math.min(totalElapsed / TOTAL_SECONDS, 1);

  const remaining = TOTAL_SECONDS - totalElapsed;

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");

  const ss = String(remaining % 60).padStart(2, "0");



  // Tick every second

  useEffect(() => {

    if (!started || done) return;

    const t = setInterval(() => {

      setPhaseElapsed(prev => {

        const next = prev + 1;

        if (next >= phase.duration) {

          setPhaseIdx(pi => {

            const nextPi = (pi + 1) % PHASES.length;

            if (nextPi === 0) setCycleCount(c => c + 1);

            return nextPi;

          });

          return 0;

        }

        return next;

      });

      setTotalElapsed(prev => {

        const next = prev + 1;

        if (next >= TOTAL_SECONDS) { setDone(true); }

        return next;

      });

    }, 1000);

    return () => clearInterval(t);

  }, [started, done, phase.duration]);



  const circumference = 2 * Math.PI * 110; // r=110 (kept for progress ring)



  // Ring spin speeds sync with phase — inhale slow, exhale fast

  const ringSpeed = phase.label === "Inhale" ? [8, 13, 18] : phase.label === "Exhale" ? [4, 7, 10] : [6, 10, 14];



  return (

    <div style={{

      minHeight: "100vh",

      background: "radial-gradient(ellipse at top left, #0d2b1a 0%, #071a0f 50%, #030e08 100%)",

      display: "flex",

      flexDirection: "column",

      alignItems: "center",

      justifyContent: "center",

      fontFamily: "'Poppins', sans-serif",

      position: "relative",

      overflow: "hidden",

    }}>



      <style>{`

        @keyframes spin-cw  { from { transform: translate(-50%,-50%) rotate(0deg);   } to { transform: translate(-50%,-50%) rotate(360deg);  } }

        @keyframes spin-ccw { from { transform: translate(-50%,-50%) rotate(0deg);   } to { transform: translate(-50%,-50%) rotate(-360deg); } }

        @keyframes orbitDot {

          from { transform: rotate(0deg)   translateX(90px) rotate(0deg);   }

          to   { transform: rotate(360deg) translateX(90px) rotate(-360deg); }

        }

        @keyframes orbitDot2 {

          from { transform: rotate(180deg) translateX(75px) rotate(-180deg); }

          to   { transform: rotate(540deg) translateX(75px) rotate(-540deg); }

        }

        @keyframes breathePulse {

          0%,100% { box-shadow: 0 0 0 0 rgba(82,183,136,0.3), 0 0 30px rgba(82,183,136,0.15); }

          50%      { box-shadow: 0 0 0 14px rgba(82,183,136,0.08), 0 0 50px rgba(82,183,136,0.25); }

        }

        @keyframes moveStars1 { from { transform: translateY(0) translateX(0); } to { transform: translateY(-600px) translateX(-100px); } }

        @keyframes moveStars2 { from { transform: translateY(0) translateX(0); } to { transform: translateY(-400px) translateX(120px); } }

        @keyframes floatOrb   { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-40px) scale(1.08); } }

        @keyframes twinkle    { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }

        .cosmic-stars-1 {

          position: absolute; inset: 0; pointer-events: none;

          background-image:

            radial-gradient(1.5px 1.5px at 8%  12%, rgba(168,230,207,0.9), transparent),

            radial-gradient(1px   1px   at 22% 35%, rgba(255,255,255,0.7), transparent),

            radial-gradient(2px   2px   at 38% 8%,  rgba(149,213,178,0.8), transparent),

            radial-gradient(1px   1px   at 55% 55%, rgba(255,255,255,0.6), transparent),

            radial-gradient(1.5px 1.5px at 70% 20%, rgba(168,230,207,0.9), transparent),

            radial-gradient(1px   1px   at 82% 70%, rgba(255,255,255,0.5), transparent),

            radial-gradient(2px   2px   at 15% 75%, rgba(116,198,157,0.7), transparent),

            radial-gradient(1px   1px   at 90% 40%, rgba(255,255,255,0.6), transparent),

            radial-gradient(1.5px 1.5px at 45% 88%, rgba(168,230,207,0.8), transparent),

            radial-gradient(1px   1px   at 60% 95%, rgba(255,255,255,0.5), transparent),

            radial-gradient(2px   2px   at 30% 60%, rgba(149,213,178,0.6), transparent),

            radial-gradient(1px   1px   at 75% 85%, rgba(255,255,255,0.7), transparent),

            radial-gradient(1.5px 1.5px at 5%  50%, rgba(168,230,207,0.7), transparent),

            radial-gradient(1px   1px   at 95% 15%, rgba(255,255,255,0.6), transparent),

            radial-gradient(2px   2px   at 50% 30%, rgba(116,198,157,0.5), transparent);

          background-size: 600px 600px;

          animation: moveStars1 80s linear infinite;

          opacity: 0.7;

        }

        .cosmic-stars-2 {

          position: absolute; inset: 0; pointer-events: none;

          background-image:

            radial-gradient(3px 3px at 18% 22%, rgba(168,230,207,0.6), transparent),

            radial-gradient(2px 2px at 65% 10%, rgba(212,160,23,0.5),   transparent),

            radial-gradient(3px 3px at 40% 65%, rgba(149,213,178,0.5), transparent),

            radial-gradient(2px 2px at 85% 50%, rgba(168,230,207,0.6), transparent),

            radial-gradient(3px 3px at 10% 90%, rgba(116,198,157,0.4), transparent),

            radial-gradient(2px 2px at 55% 78%, rgba(212,160,23,0.4),   transparent);

          background-size: 800px 800px;

          animation: moveStars2 120s linear infinite reverse;

          opacity: 0.5;

        }

        .cosmic-orb-1 {

          position: absolute; width: 340px; height: 340px; border-radius: 50%;

          background: radial-gradient(circle, rgba(82,183,136,0.12) 0%, transparent 70%);

          top: -80px; left: -80px; pointer-events: none;

          animation: floatOrb 18s ease-in-out infinite;

        }

        .cosmic-orb-2 {

          position: absolute; width: 280px; height: 280px; border-radius: 50%;

          background: radial-gradient(circle, rgba(64,145,108,0.10) 0%, transparent 70%);

          bottom: -60px; right: -60px; pointer-events: none;

          animation: floatOrb 24s ease-in-out infinite reverse;

        }

        .cosmic-orb-3 {

          position: absolute; width: 180px; height: 180px; border-radius: 50%;

          background: radial-gradient(circle, rgba(212,160,23,0.07) 0%, transparent 70%);

          top: 40%; right: 8%; pointer-events: none;

          animation: floatOrb 14s ease-in-out infinite;

        }

        /* Planets */

        .planet { position: absolute; border-radius: 50%; filter: blur(3px); pointer-events: none; }

        .planet1 {

          width: 200px; height: 200px; opacity: 0.35;

          background: radial-gradient(circle at 35% 35%, #6ec6a8, #1b4332 60%, transparent);

          top: 6%; left: 4%;

          animation: floatOrb 22s ease-in-out infinite;

          box-shadow: 0 0 40px rgba(110,198,168,0.2);

        }

        .planet2 {

          width: 140px; height: 140px; opacity: 0.28;

          background: radial-gradient(circle at 40% 30%, #52b788, #0d2b1a 65%, transparent);

          bottom: 8%; right: 6%;

          animation: floatOrb 28s ease-in-out infinite reverse;

          box-shadow: 0 0 30px rgba(82,183,136,0.18);

        }

        .planet3 {

          width: 80px; height: 80px; opacity: 0.40;

          background: radial-gradient(circle at 40% 35%, #d4a017, #5a3800 60%, transparent);

          top: 58%; left: 8%;

          animation: floatOrb 16s ease-in-out infinite;

          box-shadow: 0 0 20px rgba(212,160,23,0.25);

        }

        .breathing-content { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; }

      `}</style>



      {/* Cosmic layers */}

      <div className="cosmic-stars-1" />

      <div className="cosmic-stars-2" />

      <div className="cosmic-orb-1" />

      <div className="cosmic-orb-2" />

      <div className="cosmic-orb-3" />

      {/* Planets */}

      <div className="planet planet1" />

      <div className="planet planet2" />

      <div className="planet planet3" />



      {/* All content above cosmic bg */}

      <div className="breathing-content" style={{ width: "100%", alignItems: "center" }}>



      {/* Back button — fixed position above cosmic layers */}

      <button onClick={() => navigate(-1)} style={{

        position: "fixed", top: "24px", left: "24px", zIndex: 10,

        background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)",

        border: "1px solid rgba(168,230,207,0.25)", borderRadius: "50px",

        padding: "8px 18px", fontSize: "0.8rem", fontWeight: 600,

        color: "#A8E6CF", cursor: "pointer",

        display: "flex", alignItems: "center", gap: "6px",

        transition: "background 0.2s",

      }}>

        ← Back

      </button>



      {/* Session title */}

      <p style={{ fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#74c69d", marginBottom: "6px", fontWeight: 600 }}>

        Guided Breathing

      </p>

      <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "#e8f5e9", margin: "0 0 40px", textAlign: "center", padding: "0 16px" }}>

        {sessionTitle}

      </h1>



      {/* Orbital breathing animation */}

      <div style={{ position: "relative", width: "clamp(240px, 32vw, 380px)", height: "clamp(240px, 32vw, 380px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: !started ? "pointer" : "default" }}

        onClick={() => !started && setStarted(true)}>



        {/* Ring 1 — innermost 70%, clockwise */}

        <div style={{

          position: "absolute", borderRadius: "50%",

          width: "70%", height: "70%",

          border: `2px solid ${phase.color}55`,

          top: "50%", left: "50%",

          animation: `spin-cw ${ringSpeed[0]}s linear infinite`,

          transition: "border-color 1.5s ease",

        }}>

          {/* Dot on ring 1 */}

          <div style={{

            position: "absolute", top: "-6px", left: "50%",

            width: "12px", height: "12px", borderRadius: "50%",

            background: "#52b788",

            boxShadow: "0 0 10px #52b788, 0 0 20px rgba(82,183,136,0.5)",

            transform: "translateX(-50%)",

          }} />

        </div>



        {/* Ring 2 — middle 85%, counter-clockwise */}

        <div style={{

          position: "absolute", borderRadius: "50%",

          width: "85%", height: "85%",

          border: `1.5px solid ${phase.color}33`,

          top: "50%", left: "50%",

          animation: `spin-ccw ${ringSpeed[1]}s linear infinite`,

          transition: "border-color 1.5s ease",

        }}>

          {/* Golden dot on ring 2 */}

          <div style={{

            position: "absolute", top: "-7px", left: "50%",

            width: "14px", height: "14px", borderRadius: "50%",

            background: "linear-gradient(135deg, #d4a017, #f0c040)",

            boxShadow: "0 0 12px rgba(212,160,23,0.8), 0 0 24px rgba(212,160,23,0.4)",

            transform: "translateX(-50%)",

          }} />

        </div>



        {/* Ring 3 — outermost 100%, clockwise slow */}

        <div style={{

          position: "absolute", borderRadius: "50%",

          width: "100%", height: "100%",

          border: `1px solid ${phase.color}22`,

          top: "50%", left: "50%",

          animation: `spin-cw ${ringSpeed[2]}s linear infinite`,

          transition: "border-color 1.5s ease",

        }}>

          {/* Small mint dot on ring 3 */}

          <div style={{

            position: "absolute", top: "-5px", left: "50%",

            width: "10px", height: "10px", borderRadius: "50%",

            background: "#95d5b2",

            boxShadow: "0 0 8px rgba(149,213,178,0.7)",

            transform: "translateX(-50%)",

          }} />

        </div>



        {/* Center circle — 45% of container */}

        <div style={{

          width: "45%", height: "45%", borderRadius: "50%",

          background: `linear-gradient(135deg, ${phase.color}dd, #40916c)`,

          display: "flex", flexDirection: "column",

          alignItems: "center", justifyContent: "center",

          transform: started ? `scale(${phase.scale})` : "scale(1)",

          transition: `transform ${phase.duration}s cubic-bezier(0.45,0,0.55,1), background 1.5s ease`,

          animation: started ? "breathePulse 4s ease-in-out infinite" : "none",

          zIndex: 10,

        }}>

          <span style={{ fontSize: "clamp(0.85rem, 2vw, 1.1rem)", fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>

            {done ? "✓" : started ? phase.label : "Tap"}

          </span>

          {started && !done && (

            <span style={{ fontSize: "clamp(0.6rem, 1.2vw, 0.75rem)", color: "rgba(255,255,255,0.85)", marginTop: "2px" }}>

              {phase.duration - phaseElapsed}s

            </span>

          )}

        </div>

      </div>



      {/* Instruction text */}

      <p style={{ marginTop: "32px", fontSize: "0.88rem", color: "#95d5b2", fontWeight: 500, textAlign: "center", minHeight: "22px", transition: "opacity 0.5s", padding: "0 24px" }}>

        {done ? "Session complete. Well done 🌿" : started ? phase.instruction : "Tap the circle to begin"}

      </p>



      {/* Timer + cycles */}

      {started && !done && (

        <div style={{ display: "flex", gap: "32px", marginTop: "24px", alignItems: "center" }}>

          <div style={{ textAlign: "center" }}>

            <p style={{ fontSize: "1.8rem", fontWeight: 700, color: "#e8f5e9", margin: 0, fontFamily: "'Cinzel', serif" }}>{mm}:{ss}</p>

            <p style={{ fontSize: "0.65rem", color: "#74c69d", margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>Remaining</p>

          </div>

          <div style={{ width: "1px", height: "36px", background: "rgba(168,230,207,0.2)" }} />

          <div style={{ textAlign: "center" }}>

            <p style={{ fontSize: "1.8rem", fontWeight: 700, color: "#e8f5e9", margin: 0, fontFamily: "'Cinzel', serif" }}>{cycleCount}</p>

            <p style={{ fontSize: "0.65rem", color: "#74c69d", margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>Cycles</p>

          </div>

        </div>

      )}



      {/* Overall progress bar */}

      {started && (

        <div style={{ width: "240px", height: "3px", background: "rgba(168,230,207,0.12)", borderRadius: "4px", marginTop: "20px", overflow: "hidden" }}>

          <div style={{ height: "100%", background: "linear-gradient(90deg, #52b788, #A8E6CF)", borderRadius: "4px", width: `${totalProgress * 100}%`, transition: "width 1s linear" }} />

        </div>

      )}



      {/* Done — restart or exit */}

      {done && (

        <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>

          <button onClick={() => { setDone(false); setStarted(false); setPhaseIdx(0); setPhaseElapsed(0); setTotalElapsed(0); setCycleCount(0); }}

            style={{ background: "linear-gradient(135deg,#52b788,#40916c)", color: "#fff", border: "none", borderRadius: "50px", padding: "10px 24px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 14px rgba(82,183,136,0.4)" }}>

            Restart

          </button>

          <button onClick={() => navigate(-1)}

            style={{ background: "rgba(255,255,255,0.08)", color: "#A8E6CF", border: "1px solid rgba(168,230,207,0.25)", borderRadius: "50px", padding: "10px 24px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>

            Exit

          </button>

        </div>

      )}



      </div>{/* end breathing-content */}

    </div>

  );

}

