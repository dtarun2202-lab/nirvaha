import React from 'react';
import { Link } from 'react-router-dom';

const notes = [
    {
        id: 1,
        quote: "Breathe. You are exactly where you need to be.",
        chant: "Cosmic OM Chant",
        link: "/healing-music",
        author: "Aisha Patel",
        avatar: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=150&auto=format&fit=crop"
    },
    {
        id: 2,
        quote: "Stillness is where healing begins.",
        chant: "Gayatri Resonance",
        link: "/healing-music",
        author: "Arjun Verma",
        avatar: "/arjun verma.png"
    },
    {
        id: 3,
        quote: "Let go of what no longer serves you.",
        chant: "Soma Lunar Nectar",
        link: "/healing-music",
        author: "Rohan Sharma",
        avatar: "/rohan.jpg"
    },
    {
        id: 4,
        quote: "Every breath is a new beginning.",
        chant: "Brahma Nada",
        link: "/healing-music",
        author: "Aditya Rao",
        avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=150&auto=format&fit=crop"
    },
    {
        id: 5,
        quote: "Your peace is your power.",
        chant: "Maha Mrityunjaya",
        link: "/healing-music",
        author: "Priya Desai",
        avatar: "/priya.jpg"
    },
    {
        id: 6,
        quote: "Find beauty in the present moment.",
        chant: "Anahata Heart Frequency",
        link: "/healing-music",
        author: "Kavya Iyer",
        avatar: "/kavya.png"
    }
];

export const InspirationalQuotes = () => {
    const gradients = [
        'linear-gradient(135deg, #f0fdf4, #dcfce7)',
        'linear-gradient(135deg, #fefce8, #f0fdf4)',
        'linear-gradient(135deg, #f0fdfa, #dcfce7)'
    ];

    return (
       <section 
           className="min-h-screen flex flex-col justify-center py-16 md:py-24 bg-[#f0f5f0] relative overflow-hidden"
           style={{
               backgroundImage: 'radial-gradient(circle, #86c58640 1px, transparent 1px)',
               backgroundSize: '24px 24px'
           }}
       >
            {/* Container Wrapper */}
            <div className="max-w-7xl mx-auto px-6 w-full">
                {/* Left Aligned Header Section */}
                <div className="text-left mb-12 md:mb-16 space-y-4">
                    <div className="flex items-center justify-start gap-2 mb-4">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1a5d47]/10 text-[#1a5d47]">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
                        </span>
                        <span className="text-[#1a5d47] font-bold tracking-widest text-[10px] uppercase underline underline-offset-4 decoration-1">Wisdom Daily</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0F131A] tracking-wide"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Daily Inspiration</h2>
                    <p className="text-[#5f6f65] text-sm md:text-base max-w-2xl break-words"
                       style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        <strong>The Nirvaha Circle:</strong> Discover wisdom to guide your journey</p>
                </div>

                {/* Notes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 pb-12">
                    {notes.map((note, idx) => (
                        <div 
                            key={note.id} 
                            className="flex flex-col items-center group"
                        >
                            {/* Speech Bubble Wrapper for Hover */}
                            <div 
                                className="transition-all duration-300 group-hover:-translate-y-[6px] w-full flex flex-col items-center"
                                style={{
                                    boxShadow: '0 0 0 transparent' // initial
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,100,0,0.12)'}
                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                            >
                                {/* Speech Bubble */}
                                <div 
                                    className="relative mb-3 flex flex-col items-center justify-center shadow-sm w-full max-w-[280px] overflow-hidden"
                                    style={{
                                        background: gradients[idx % 3],
                                        border: '1px solid rgba(134,197,134,0.4)',
                                        borderRadius: '18px',
                                        padding: '14px 16px',
                                        backdropFilter: 'blur(10px)',
                                    }}
                                >
                                    {/* Watermark SVG */}
                                    <div className="absolute -bottom-4 -right-4 opacity-[0.06] pointer-events-none">
                                        <svg width="64" height="64" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            {Array.from({ length: 12 }).map((_, i) => (
                                                <path
                                                    key={i}
                                                    d="M100 20C120 40 140 70 100 100C60 70 80 40 100 20Z"
                                                    fill="#1a3d2b"
                                                    transform={`rotate(${i * 30} 100 100)`}
                                                />
                                            ))}
                                            <circle cx="100" cy="100" r="70" stroke="#1a3d2b" strokeWidth="2" fill="none" />
                                        </svg>
                                    </div>

                                    <p className="text-[#1a3d2b] italic text-center text-sm md:text-base mb-3 leading-relaxed relative z-10" style={{ fontFamily: "'Cinzel', serif" }}>
                                        "{note.quote}"
                                    </p>
                                    <Link 
                                        to={note.link}
                                        className="bg-[#e8f5e9] text-[#2e7d32] text-[10px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border border-[#c8e6c9] hover:bg-[#c8e6c9] transition-colors cursor-pointer relative z-10"
                                        style={{ boxShadow: '0 0 12px rgba(134,197,134,0.5)' }}
                                    >
                                        <span>🎵</span> {note.chant}
                                    </Link>
                                    {/* Speech Bubble Tail */}
                                    <div 
                                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 transform"
                                        style={{
                                            background: gradients[idx % 3],
                                            borderRight: '1px solid rgba(134,197,134,0.4)',
                                            borderBottom: '1px solid rgba(134,197,134,0.4)',
                                            backdropFilter: 'blur(10px)',
                                        }}
                                    ></div>
                                </div>
                                
                                {/* Avatar & Username (Clickable) */}
                                <Link to={`/inspiration-story/${note.id}`} className="flex flex-col items-center gap-1 z-10 cursor-pointer group/avatar">
                                    <div className="relative">
                                        <img 
                                            src={note.avatar} 
                                            alt={note.author} 
                                            className="w-12 h-12 rounded-full object-cover transition-transform group-hover/avatar:scale-110" 
                                            style={{
                                                border: '3px solid #86c586',
                                                outline: '2px solid #c8e6c9',
                                                outlineOffset: '3px'
                                            }}
                                        />
                                        <div className="absolute inset-0 rounded-full bg-black/0 group-hover/avatar:bg-black/10 transition-colors"></div>
                                    </div>
                                    <span className="text-[10px] text-[#5f6f65] font-medium tracking-wide mt-2 group-hover/avatar:text-[#2e7d32] transition-colors">
                                        {note.author}
                                    </span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
