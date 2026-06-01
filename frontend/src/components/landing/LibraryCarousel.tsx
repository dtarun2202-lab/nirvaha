import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import DecorativeShapes from './DecorativeShapes';
import BACKEND_CONFIG from '../../config/backend';

const defaultLibraryItems = [
    { 
        id: "agni-the-sacred-fire",
        title: "Agni - The Sacred Fire", 
        category: "Transformation", 
        image: "/agni.png", 
        duration: "15 min",
        story: "Agni is the element of transformation.\nIt burns away the impurities of the ego.\nIn its light, we find the path to our true self.\nThe fire of awareness illuminates the dark corners of the mind."
    },
    { 
        id: "dharma-the-righteous-path",
        title: "Dharma - The Righteous Path", 
        category: "Purpose", 
        image: "/dharma.png", 
        duration: "Series",
        story: "Dharma is the moral order of the universe.\nIt is the duty that aligns us with our highest purpose.\nWhen we follow our dharma, we find effortless peace.\nLiving in harmony with truth is the ultimate goal."
    },
    { 
        id: "indriya-nigraha-sensory-control",
        title: "Indriya Nigraha - Sensory Control", 
        category: "Senses", 
        image: "/indriya.png", 
        duration: "10 min",
        story: "Master the senses to master the mind.\nIndriya Nigraha is the art of conscious withdrawal.\nNot through suppression, but through deep understanding.\nWhen the senses turn inward, the soul finds its home."
    },
    { 
        id: "manas-shuddhi-mental-clarity",
        title: "Manas Shuddhi - Mental Clarity", 
        category: "Mind", 
        image: "/manas.png", 
        duration: "20 min",
        story: "Purifying the mind is like cleaning a temple.\nRemove the dust of desire and the smoke of anger.\nOnly a pure heart can hold the divine flame,\nradiating peace to every corner of existence."
    },
    { 
        id: "jawaharlal-nehru-visionary-wisdom",
        title: "Jawaharlal Nehru - Visionary Wisdom", 
        category: "Wisdom", 
        image: "/nehru.png", 
        duration: "Lecture",
        story: "Wisdom is the ability to see the unity in diversity.\nLeadership is the service of the human spirit.\nThrough education and self-reflection, we build a better world.\nThe mind that is open to truth is the mind that is free."
    },
    { 
        id: "samarth-ramdas-path-of-devotion",
        title: "Samarth Ramdas - Path of Devotion", 
        category: "Devotion", 
        image: "/ramdas.png", 
        duration: "Music",
        story: "Devotion to the master is the bridge to the infinite.\nThrough surrender, the disciple becomes one with the light.\nChant the names of the divine to quiet the restless heart.\nIn the service of the master, we find the highest joy."
    },
    { 
        id: "sadvritta-ethical-living",
        title: "Sadvritta - Ethical Living", 
        category: "Ethics", 
        image: "/sadvritta.png", 
        duration: "Practice",
        story: "Right conduct is the foundation of a spiritual life.\nTreat all beings with compassion and kindness.\nIntegrity in thought, word, and deed brings lasting harmony.\nYour actions are the seeds of your future destiny."
    },
    { 
        id: "saradhi-the-divine-guide",
        title: "Saradhi - The Divine Guide", 
        category: "Guidance", 
        image: "/saradhi.png", 
        duration: "Journey",
        story: "The guide is the lighthouse in the storm of existence.\nFollowing the lead of wisdom brings us to the shore of truth.\nSurrender the reins of your life to the master within.\nEvery step taken in trust is a step closer to liberation."
    },
    { 
        id: "vyayama-sacred-movement",
        title: "Vyayama - Sacred Movement", 
        category: "Discipline", 
        image: "/vyayama.png", 
        duration: "Movement",
        story: "The body is the temple of the living soul.\nThrough discipline and movement, we prepare for stillness.\nStrength and flexibility are the tools of the spiritual warrior.\nHonoring the body is honoring the creation itself."
    },
];

const LibraryCarousel: React.FC = () => {
    const navigate = useNavigate();
    const [libraryItems, setLibraryItems] = useState(defaultLibraryItems);

    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/content/landing_library`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.value) {
                        const parsed = JSON.parse(data.value);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            // Merge with default items to ensure stories or other missing fields are present
                            const merged = defaultLibraryItems.map(def => {
                                const saved = parsed.find((p: any) => p.title === def.title);
                                return saved ? { ...def, ...saved } : def;
                            });
                            setLibraryItems(merged);
                            return;
                        }
                    }
                }
            } catch (err) {
                console.warn("Failed to fetch library from backend, trying localStorage", err);
            }

            // Fallback to localStorage
            const savedLibrary = localStorage.getItem("nirvaha_library");
            if (savedLibrary) {
                try {
                    const parsed = JSON.parse(savedLibrary);
                    const merged = defaultLibraryItems.map(def => {
                        const saved = parsed.find((p: any) => p.title === def.title);
                        return saved ? { ...def, ...saved } : def;
                    });
                    setLibraryItems(merged);
                } catch (e) {
                    console.error("Failed to load library items from localStorage", e);
                    setLibraryItems(defaultLibraryItems);
                }
            }
        };

        fetchLibrary();
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
                .carousel-track-1:hover, .carousel-track-2:hover {
                    animation-play-state: paused;
                }
            `}</style>

            {/* Row 1 */}
            <div className="flex gap-6 mb-6 w-full overflow-hidden">
                <div className="flex gap-6 pl-4 carousel-track-1 w-max">
                    {[...libraryItems, ...libraryItems].map((item, idx) => (
                        <motion.div
                            key={`r1-${idx}`}
                            whileHover={{ scale: 1.02, y: -5 }}
                            transition={{ duration: 0.3 }}
                            className="relative flex-shrink-0 w-[425px] h-[225px] rounded-2xl overflow-hidden shadow-md cursor-pointer group"
                            onClick={() => navigate(`/library/${item.id}`)}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e2e8f0/1a5d47?text=Nirvaha' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h3 className="text-white text-xl font-bold mb-1" style={{ fontFamily: "'Cinzel', serif" }}>{item.title}</h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">{item.category}</span>
                                    <span className="w-1 h-1 bg-white/40 rounded-full" />
                                    <span className="text-white/80 text-xs">{item.duration}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Row 2 */}
            <div className="flex gap-6 w-full overflow-hidden">
                <div className="flex gap-6 pl-4 carousel-track-2 w-max">
                    {[...libraryItems].reverse().concat([...libraryItems].reverse()).map((item, idx) => (
                        <motion.div
                            key={`r2-${idx}`}
                            whileHover={{ scale: 1.02, y: -5 }}
                            transition={{ duration: 0.3 }}
                            className="relative flex-shrink-0 w-[425px] h-[225px] rounded-2xl overflow-hidden shadow-md cursor-pointer group"
                            onClick={() => navigate(`/library/${item.id}`)}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e2e8f0/1a5d47?text=Nirvaha' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h3 className="text-white text-xl font-bold mb-1" style={{ fontFamily: "'Cinzel', serif" }}>{item.title}</h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">{item.category}</span>
                                    <span className="w-1 h-1 bg-white/40 rounded-full" />
                                    <span className="text-white/80 text-xs">{item.duration}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>



        </section>
    );
};

export default LibraryCarousel;
