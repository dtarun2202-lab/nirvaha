import React from 'react';

const quotes = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=600&auto=format&fit=crop",
        quote: "Peace comes from within. Do not seek it without.",
        author: "Buddha"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=600&auto=format&fit=crop",
        quote: "The only journey is the one within.",
        author: "Rainer Maria Rilke"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
        quote: "Quiet the mind, and the soul will speak.",
        author: "Ma Jaya Sati Bhagavati"
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop",
        quote: "The soul always knows what to do to heal itself. The challenge is to silence the mind.",
        author: "Caroline Myss"
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=600&auto=format&fit=crop",
        quote: "Look deep into nature, and then you will understand everything better.",
        author: "Albert Einstein"
    },
    {
        id: 6,
        image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=600&auto=format&fit=crop",
        quote: "The best way to find yourself is to lose yourself in the service of others.",
        author: "Mahatma Gandhi"
    },
    {
        id: 7,
        image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=600&auto=format&fit=crop",
        quote: "Happiness is not something readymade. It comes from your own actions.",
        author: "Dalai Lama"
    }
];

export const InspirationalQuotes = () => {
    return (
       <section className="min-h-screen flex flex-col justify-start py-16 md:py-24 bg-[#EEF7F1] relative overflow-hidden">
            {/* Container Wrapper */}
            <div className="max-w-7xl mx-auto px-6 w-full">
                {/* Centered Header Section */}
                <div className="text-center mb-12 md:mb-16 space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1a5d47]/10 text-[#1a5d47]">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
                        </span>
                        <span className="text-[#1a5d47] font-bold tracking-widest text-[10px] uppercase underline underline-offset-4 decoration-1">Wisdom Daily</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0F131A] tracking-wide"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Daily Inspiration</h2>
                    <p className="text-[#5f6f65] text-sm md:text-base max-w-2xl mx-auto break-words"
                       style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Discover wisdom to guide your journey</p>
                </div>

                {/* Horizontal Scrolling Layout */}
                <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
                    {quotes.map((item) => (
                      <div
                        key={item.id}
                        className="group min-w-[280px] h-[400px] cursor-pointer perspective-1000 flex-shrink-0"
                      >
                        <div className="relative w-full h-full duration-700 preserve-3d group-hover:my-rotate-y-180">

                          <div className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-white">
                            <img
                              src={item.image}
                              alt="Inspiration"
                              className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                            <div className="absolute bottom-6 left-0 right-0 text-center">
                              <span className="inline-block px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black tracking-[0.2em] text-white uppercase border border-white/20">
                                REVEAL WISDOM
                              </span>
                          </div>
                         </div>

                         <div className="absolute inset-0 backface-hidden my-rotate-y-180 bg-[#1a5d47] rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden">

                           <span className="text-7xl text-white/10">"</span>

                            <p className="text-lg md:text-xl text-white italic break-words">
                              {item.quote}
                           </p>

                           <div className="w-16 h-[1px] bg-white/20 my-4"></div>

                           <span className="text-[11px] text-emerald-200 uppercase tracking-[0.3em] font-bold break-words">
                             {item.author}
                          </span>

                        </div>
                      </div>
                    </div>
                    ))}
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .my-rotate-y-180 { transform: rotateY(180deg); }
                .group:hover .group-hover\\:my-rotate-y-180 { transform: rotateY(180deg); }
            `}</style>
        </section>
    );
};
