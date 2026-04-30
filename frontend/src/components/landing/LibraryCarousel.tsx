import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import DecorativeShapes from './DecorativeShapes';

const defaultLibraryItems = [
    { title: "Agni", category: "Transformation", image: "/agni.png", duration: "15 min" },
    { title: "Dharma", category: "Purpose", image: "/dharma.png", duration: "Series" },
    { title: "Indriya", category: "Senses", image: "/indriya.png", duration: "10 min" },
    { title: "Manas", category: "Mind", image: "/manas.png", duration: "20 min" },
    { title: "Nehru", category: "Wisdom", image: "/nehru.png", duration: "Lecture" },
    { title: "Ramdas", category: "Devotion", image: "/ramdas.png", duration: "Music" },
    { title: "Sadvritta", category: "Ethics", image: "/sadvritta.png", duration: "Practice" },
    { title: "Saradhi", category: "Guidance", image: "/saradhi.png", duration: "Journey" },
    { title: "Vyayama", category: "Discipline", image: "/vyayama.png", duration: "Movement" },
];


const LibraryCarousel: React.FC = () => {
    const [libraryItems, setLibraryItems] = useState(defaultLibraryItems);

    // Load library items from localStorage
    useEffect(() => {
        const savedLibrary = localStorage.getItem("nirvaha_library");
        if (savedLibrary) {
            try {
                setLibraryItems(JSON.parse(savedLibrary));
            } catch (e) {
                console.error("Failed to load library items from localStorage", e);
                setLibraryItems(defaultLibraryItems);
            }
        }
    }, []);
    return (
        <section className="w-full pt-4 pb-12 bg-[#eaf5ef] overflow-hidden relative">
            <DecorativeShapes variant={4} />
            <div className="max-w-7xl pl-4 sm:pl-6 lg:pl-8 pr-4 mb-8 relative z-10">
                <div className="text-left">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F131A] mb-5 uppercase leading-tight"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        EXPLORE OUR VAST LIBRARY
                    </motion.h2>
                    <p className="text-lg sm:text-xl text-[#595e67] max-w-3xl leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300 }}>
                        Dive into a curated collection of ancient wisdom and modern practices designed for your inner journey.
                        <span className="font-medium text-[#1a5d47] ml-1">Discover your path inward.</span>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .carousel-track-1 {
                    animation: scroll 70s linear infinite;
                }
                .carousel-track-2 {
                    animation: scroll 50s linear infinite;
                }
            `}</style>

            {/* Row 1 */}
            <div className="flex gap-6 mb-6 w-full overflow-hidden">
                <div className="flex gap-6 pl-4 carousel-track-1 w-max">
                    {[...libraryItems, ...libraryItems].map((item, idx) => (
                        <div
                            key={`r1-${idx}`}
                            className="relative flex-shrink-0 w-[425px] h-[225px] rounded-2xl overflow-hidden shadow-md cursor-pointer group"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e2e8f0/1a5d47?text=Nirvaha' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent p-5 flex flex-col justify-end">
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Row 2 */}
            <div className="flex gap-6 w-full overflow-hidden">
                <div className="flex gap-6 pl-4 carousel-track-2 w-max">
                    {[...libraryItems].reverse().concat([...libraryItems].reverse()).map((item, idx) => (
                        <div
                            key={`r2-${idx}`}
                            className="relative flex-shrink-0 w-[425px] h-[225px] rounded-2xl overflow-hidden shadow-md cursor-pointer group"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e2e8f0/1a5d47?text=Nirvaha' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent p-5 flex flex-col justify-end">
                            </div>
                        </div>
                    ))}
                </div>
            </div>



        </section>
    );
};

export default LibraryCarousel;
