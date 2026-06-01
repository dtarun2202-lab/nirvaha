import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Globe from 'react-globe.gl';
import HandsOverlay from '../HandsOverlay';

const markers = [
  { lat: 19.0, lng: 72.8, label: "Mumbai", story: "Priya M. · Anxiety Relief · 30 days" },
  { lat: 28.6, lng: 77.1, label: "Delhi", story: "Rohit K. · Burnout Recovery · 21 days" },
  { lat: 51.5, lng: -0.12, label: "London", story: "Sarah L. · Sleep Healing · 14 days" },
  { lat: 40.7, lng: -74.0, label: "New York", story: "James R. · Stress Relief · 45 days" },
  { lat: 25.2, lng: 55.3, label: "Dubai", story: "Aisha K. · Spiritual Growth · 60 days" },
  { lat: 1.3, lng: 103.8, label: "Singapore", story: "Wei L. · Mental Clarity · 28 days" },
  { lat: -33.8, lng: 151.2, label: "Sydney", story: "Emma T. · Inner Peace · 35 days" },
  { lat: 43.6, lng: -79.3, label: "Toronto", story: "Marcus J. · Pain Relief · 60 days" },
  { lat: 12.9, lng: 77.5, label: "Bangalore", story: "Anika S. · Awakening · 90 days" },
  { lat: 52.3, lng: 4.9, label: "Amsterdam", story: "Lena V. · Sound Healing · 40 days" },
  { lat: 35.6, lng: 139.6, label: "Tokyo", story: "Kenji S. · Zen Focus · 21 days" },
  { lat: 48.8, lng: 2.3, label: "Paris", story: "Chloe D. · Emotional Balance · 30 days" },
  { lat: -33.9, lng: 18.4, label: "Cape Town", story: "Thabo M. · Grounding · 14 days" },
  { lat: -22.9, lng: -43.1, label: "Rio de Janeiro", story: "Isabella Costa · Joy Awakening · 45 days" },
  { lat: 37.7, lng: -122.4, label: "San Francisco", story: "David Chen · Tech Detox · 60 days" },
  { lat: 52.5, lng: 13.4, label: "Berlin", story: "Lukas B. · Mindful Living · 28 days" },
  { lat: 37.5, lng: 126.9, label: "Seoul", story: "Ji-Yoon P. · Deep Rest · 35 days" },
  { lat: -34.6, lng: -58.3, label: "Buenos Aires", story: "Mateo G. · Heart Healing · 90 days" },
  { lat: 19.4, lng: -99.1, label: "Mexico City", story: "Sofia R. · Vitality Boost · 40 days" },
  { lat: 41.0, lng: 28.9, label: "Istanbul", story: "Emre Y. · Inner Harmony · 21 days" },
  { lat: 34.0, lng: -118.2, label: "Los Angeles", story: "Mia W. · Creative Flow · 30 days" }
];

function LotusStat({ number, label, delay = 0 }: { number: string, label: string, delay?: number }) {
  const [bloomed, setBloomed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setBloomed(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const petals = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
      {/* Lotus SVG */}
      <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
        <svg viewBox="0 0 120 120" width="120" height="120">
          {/* 8 petals */}
          {petals.map((i) => (
            <ellipse
              key={i}
              cx="60" cy="60"
              rx="14" ry="36"
              fill="none"
              stroke="#86efac"
              strokeWidth="1.2"
              strokeOpacity={bloomed ? 0.7 : 0}
              transform={`rotate(${i * 45} 60 60) translate(0 -22)`}
              style={{
                transition: `stroke-opacity 0.4s ease ${i * 0.08 + delay/1000}s,
                             transform 0.5s ease ${i * 0.08 + delay/1000}s`,
                filter: 'drop-shadow(0 0 4px rgba(134,239,172,0.6))'
              }}
            />
          ))}
          {/* Inner filled petals */}
          {petals.map((i) => (
            <ellipse
              key={`fill-${i}`}
              cx="60" cy="60"
              rx="10" ry="28"
              fill="rgba(134,239,172,0.08)"
              transform={`rotate(${i * 45} 60 60) translate(0 -20)`}
              style={{
                opacity: bloomed ? 1 : 0,
                transition: `opacity 0.5s ease ${i * 0.1 + delay/1000}s`
              }}
            />
          ))}
          {/* Center glow circle */}
          <circle
            cx="60" cy="60" r="18"
            fill="rgba(134,239,172,0.12)"
            stroke="#86efac"
            strokeWidth="1.5"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(134,239,172,0.8))',
              opacity: bloomed ? 1 : 0,
              transition: `opacity 0.6s ease ${delay/1000 + 0.5}s`
            }}
          />
          {/* Tiny inner dot */}
          <circle cx="60" cy="60" r="5" fill="#86efac"
            style={{ filter: 'drop-shadow(0 0 6px #86efac)' }}
          />
        </svg>
      </div>

      {/* Stat text */}
      <div>
        <div style={{
          fontSize: '42px',
          fontWeight: '800',
          color: '#86efac',
          fontFamily: 'serif',
          lineHeight: 1,
          textShadow: '0 0 20px rgba(134,239,172,0.5)'
        }}>{number}</div>
        <div style={{
          fontSize: '11px',
          letterSpacing: '3px',
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
          marginTop: '6px',
          fontFamily: 'sans-serif'
        }}>{label}</div>
        {/* Glowing underline */}
        <div style={{
          width: bloomed ? '100%' : '0%',
          height: '1px',
          background: 'linear-gradient(to right, #86efac, transparent)',
          marginTop: '8px',
          transition: `width 0.8s ease ${delay/1000 + 0.6}s`,
          boxShadow: '0 0 8px rgba(134,239,172,0.5)'
        }} />
      </div>
    </div>
  );
}

function NirvahGlobe() {
    const globeRef = useRef<any>();
    const [globeSize, setGlobeSize] = useState(480);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setGlobeSize(340);
            } else {
                setGlobeSize(480);
            }
        };
        
        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (globeRef.current) {
            const controls = globeRef.current.controls();
            if (controls) {
                controls.autoRotate = true;
                controls.autoRotateSpeed = 0.6;
                controls.enableZoom = false;
            }
            globeRef.current.pointOfView({ lat: 20, lng: 78, altitude: 2 });
        }
    }, [globeSize]); // Re-run if size changes to ensure controls remain applied

    return (
        <div style={{ position: 'relative', width: 480, height: 480 }}>
            <Globe
                ref={globeRef}
                width={globeSize}
                height={globeSize}
                backgroundColor="rgba(0,0,0,0)"
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                pointsData={markers}
                pointLat="lat"
                pointLng="lng"
                pointColor={() => "#86efac"}
                pointAltitude={0.02}
                pointRadius={0.4}
                htmlElementsData={markers}
                htmlLat="lat"
                htmlLng="lng"
                htmlElement={(d: any) => {
                    const el = document.createElement('div');
                    el.innerHTML = `
                        <div style="
                            background: rgba(10,31,15,0.85);
                            border: 1px solid rgba(134,239,172,0.5);
                            border-radius: 8px;
                            padding: 4px 8px;
                            font-family: sans-serif;
                            color: white;
                            font-size: 10px;
                            white-space: nowrap;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                            backdrop-filter: blur(2px);
                            transform: translate(-50%, -100%);
                            margin-top: -6px;
                        ">
                            <b style="color:#86efac">📍 ${d.label}</b>
                        </div>
                    `;
                    return el;
                }}
                ringsData={markers}
                ringLat="lat"
                ringLng="lng"
                ringColor={() => "#86efac"}
                ringMaxRadius={4}
                ringPropagationSpeed={2}
                ringRepeatPeriod={800}
            />
            {/* <HandsOverlay /> */}
        </div>
    );
}

export const CaseStudies = () => {
    const navigate = useNavigate();

    return (
        <section 
            className="w-full relative overflow-hidden"
            style={{ 
                background: 'linear-gradient(135deg, #0a1f0f 0%, #0d2b14 50%, #081a0a 100%)',
                padding: '40px 60px'
            }}
        >
            <div className="max-w-[1200px] mx-auto w-full flex flex-col relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full mb-16">
                    {/* Left Side: Header & Globe */}
                    <div className="flex flex-col items-start text-left">
                        <div className="inline-block bg-[#86efac]/20 text-[#86efac] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-6 border border-[#86efac]/30">
                            🌍 GLOBAL IMPACT
                        </div>
                        <h2 
                            className="text-white text-[32px] font-bold mb-4 leading-tight"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            Lives Transformed Worldwide
                        </h2>
                        <p className="text-emerald-50/80 text-[14px] mb-8">
                            Real people, real healing, every corner of the world
                        </p>

                        {/* The 3D Globe */}
                        <div className="w-full flex justify-start">
                            <div style={{ position: 'relative', width: 'fit-content', perspective: '1000px' }}>
                                <style>
                                    {`
                                    @keyframes spinRing1 {
                                      from { transform: translate(-50%, -50%) rotateX(75deg) rotateZ(0deg); }
                                      to   { transform: translate(-50%, -50%) rotateX(75deg) rotateZ(360deg); }
                                    }
                                    @keyframes spinRing2 {
                                      from { transform: translate(-50%, -50%) rotateX(75deg) rotateZ(45deg); }
                                      to   { transform: translate(-50%, -50%) rotateX(75deg) rotateZ(405deg); }
                                    }
                                    @keyframes spinRing3 {
                                      from { transform: translate(-50%, -50%) rotateY(75deg) rotateZ(0deg); }
                                      to   { transform: translate(-50%, -50%) rotateY(75deg) rotateZ(-360deg); }
                                    }
                                    @keyframes spinRing4 {
                                      from { transform: translate(-50%, -50%) rotateX(70deg) rotateZ(20deg); }
                                      to   { transform: translate(-50%, -50%) rotateX(70deg) rotateZ(380deg); }
                                    }
                                    `}
                                </style>
                                
                                {/* Ring 1 - Horizontal */}
                                <div style={{
                                  position: 'absolute',
                                  zIndex: 5,
                                  top: '50%', left: '50%',
                                  transform: 'translate(-50%, -50%) rotateX(75deg)',
                                  width: '540px', height: '540px',
                                  borderRadius: '50%',
                                  border: '1.5px solid rgba(251,191,36,0.4)',
                                  boxShadow: '0 0 12px rgba(251,191,36,0.2), inset 0 0 12px rgba(251,191,36,0.1)',
                                  animation: 'spinRing1 12s linear infinite',
                                  pointerEvents: 'none',
                                }}>
                                  <div style={{
                                    position: 'absolute',
                                    width: '8px', height: '8px',
                                    borderRadius: '50%',
                                    background: '#fbbf24',
                                    boxShadow: '0 0 10px #fbbf24, 0 0 20px rgba(251,191,36,0.6)',
                                    top: '-4px',
                                    left: 'calc(50% - 4px)',
                                    pointerEvents: 'none',
                                  }} />
                                </div>

                                {/* Ring 2 - Tilted 45deg */}
                                <div style={{
                                  position: 'absolute',
                                  zIndex: 5,
                                  top: '50%', left: '50%',
                                  transform: 'translate(-50%, -50%) rotateX(75deg) rotateZ(45deg)',
                                  width: '580px', height: '580px',
                                  borderRadius: '50%',
                                  border: '1px solid rgba(251,191,36,0.25)',
                                  boxShadow: '0 0 10px rgba(251,191,36,0.15)',
                                  animation: 'spinRing2 18s linear infinite',
                                  pointerEvents: 'none',
                                }}>
                                  <div style={{
                                    position: 'absolute',
                                    width: '8px', height: '8px',
                                    borderRadius: '50%',
                                    background: '#fbbf24',
                                    boxShadow: '0 0 10px #fbbf24, 0 0 20px rgba(251,191,36,0.6)',
                                    top: '-4px',
                                    left: 'calc(50% - 4px)',
                                    pointerEvents: 'none',
                                  }} />
                                </div>

                                {/* Ring 3 - Vertical */}
                                <div style={{
                                  position: 'absolute',
                                  zIndex: 5,
                                  top: '50%', left: '50%',
                                  transform: 'translate(-50%, -50%) rotateY(75deg)',
                                  width: '500px', height: '500px',
                                  borderRadius: '50%',
                                  border: '1px solid rgba(251,191,36,0.3)',
                                  boxShadow: '0 0 14px rgba(251,191,36,0.2)',
                                  animation: 'spinRing3 15s linear infinite reverse',
                                  pointerEvents: 'none',
                                }}>
                                  <div style={{
                                    position: 'absolute',
                                    width: '8px', height: '8px',
                                    borderRadius: '50%',
                                    background: '#fbbf24',
                                    boxShadow: '0 0 10px #fbbf24, 0 0 20px rgba(251,191,36,0.6)',
                                    top: '-4px',
                                    left: 'calc(50% - 4px)',
                                    pointerEvents: 'none',
                                  }} />
                                </div>

                                {/* Ring 4 - Outermost glow ring */}
                                <div style={{
                                  position: 'absolute',
                                  zIndex: 5,
                                  top: '50%', left: '50%',
                                  transform: 'translate(-50%, -50%) rotateX(70deg) rotateZ(20deg)',
                                  width: '620px', height: '620px',
                                  borderRadius: '50%',
                                  border: '1px dashed rgba(251,191,36,0.15)',
                                  animation: 'spinRing4 25s linear infinite',
                                  pointerEvents: 'none',
                                }}>
                                  <div style={{
                                    position: 'absolute',
                                    width: '8px', height: '8px',
                                    borderRadius: '50%',
                                    background: '#fbbf24',
                                    boxShadow: '0 0 10px #fbbf24, 0 0 20px rgba(251,191,36,0.6)',
                                    top: '-4px',
                                    left: 'calc(50% - 4px)',
                                    pointerEvents: 'none',
                                  }} />
                                </div>

                                {/* Globe Container */}
                                <div style={{ position: 'relative', zIndex: 10 }}>
                                    <NirvahGlobe />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Stats */}
                    <div className="flex flex-col justify-center gap-[48px] lg:border-l lg:border-white/10 lg:pl-16 py-8 w-full max-w-sm">
                        <LotusStat number="5,284+" label="Lives Changed" delay={0} />
                        <LotusStat number="47" label="Countries Reached" delay={300} />
                        <LotusStat number="1.2M" label="Meditation Minutes" delay={600} />
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="w-full flex flex-col items-center">
                    <div className="w-full max-w-2xl h-[1px] mb-10" style={{ background: 'linear-gradient(90deg, transparent, rgba(134,239,172,0.5), transparent)', boxShadow: '0 0 10px rgba(134,239,172,0.5)' }}></div>
                    <p className="text-white/90 text-lg mb-6 font-medium tracking-wide text-center">
                        Join 5,000+ souls on their wellness journey
                    </p>
                    <button 
                        onClick={() => navigate('/signup')} 
                        className="bg-[#1a3d2b] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#112a1d] transition-all duration-300 flex items-center gap-2 border border-[#86efac]/30 hover:border-[#86efac]"
                        style={{ boxShadow: '0 4px 20px rgba(26,61,43,0.5), inset 0 0 0 1px rgba(134,239,172,0.1)' }}
                    >
                        Begin Your Journey <span>→</span>
                    </button>
                </div>
            </div>
        </section>
    );
};
