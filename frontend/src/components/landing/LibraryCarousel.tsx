import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import DecorativeShapes from './DecorativeShapes';

const defaultLibraryItems = [
    { 
        id: "agni-the-sacred-fire",
        title: "Agni - The Sacred Fire", 
        category: "Transformation", 
        image: "/agni.jpg", 
        duration: "15 min",
        story: "Agni is the element of transformation.\nIt burns away the impurities of the ego.\nIn its light, we find the path to our true self.\nThe fire of awareness illuminates the dark corners of the mind."
    },
    { 
        id: "sadvritta-ethical-living",
        title: "Sadvritta - Ethical Living", 
        category: "Ethics", 
        image: "/sadvrita.jpg", 
        duration: "Practice",
        story: "Right conduct is the foundation of a spiritual life.\nTreat all beings with compassion and kindness.\nIntegrity in thought, word, and deed brings lasting harmony.\nYour actions are the seeds of your future destiny."
    },
    { 
        id: "satmya-holistic-adaptability",
        title: "Satmya - Holistic Adaptability", 
        category: "Adaptability", 
        image: "/satmya.jpg", 
        duration: "10 min",
        story: "Satmya is the art of adapting to one's environment.\nIt represents the body's natural resilience.\nThrough conscious habits, we build lasting vitality.\nHarmony with our surroundings brings enduring health."
    },
    { 
        id: "bramhacharya-energy-mastery",
        title: "Bramhacharya - Energy Mastery", 
        category: "Discipline", 
        image: "/bramhacharya.jpg", 
        duration: "Series",
        story: "Bramhacharya is the preservation of vital energy.\nIt focuses the mind on higher spiritual goals.\nBy channeling our desires, we gain profound clarity.\nTrue power lies in self-mastery and inner focus."
    },
    { 
        id: "dhinacharya-daily-routine",
        title: "Dhinacharya - Daily Routine", 
        category: "Lifestyle", 
        image: "/dhinacharya.jpg", 
        duration: "Practice",
        story: "Dhinacharya aligns our daily rhythm with nature.\nIt brings balance to body, mind, and spirit.\nA structured day builds a foundation for peace.\nSmall habits shape the trajectory of our lives."
    },
    { 
        id: "manas-shuddhi-mental-clarity",
        title: "Manas Shuddhi - Mental Clarity", 
        category: "Mind", 
        image: "/manas shuddhi.jpg", 
        duration: "20 min",
        story: "Purifying the mind is like cleaning a temple.\nRemove the dust of desire and the smoke of anger.\nOnly a pure heart can hold the divine flame,\nradiating peace to every corner of existence."
    },
    { 
        id: "saradhi-the-divine-guide",
        title: "Saradhi - The Divine Guide", 
        category: "Guidance", 
        image: "/saradhi.jpg", 
        duration: "Journey",
        story: "The guide is the lighthouse in the storm of existence.\nFollowing the lead of wisdom brings us to the shore of truth.\nSurrender the reins of your life to the master within.\nEvery step taken in trust is a step closer to liberation."
    },
    { 
        id: "vyayama-sacred-movement",
        title: "Vyayama - Sacred Movement", 
        category: "Discipline", 
        image: "/vyayama.jpg", 
        duration: "Movement",
        story: "The body is the temple of the living soul.\nThrough discipline and movement, we prepare for stillness.\nStrength and flexibility are the tools of the spiritual warrior.\nHonoring the body is honoring the creation itself."
    },
    { 
        id: "indriya-nigraha-sensory-control",
        title: "Indriya Nigraha - Sensory Control", 
        category: "Senses", 
        image: "/indriya.jpg", 
        duration: "10 min",
        story: "Master the senses to master the mind.\nIndriya Nigraha is the art of conscious withdrawal.\nNot through suppression, but through deep understanding.\nWhen the senses turn inward, the soul finds its home."
    },
    { 
        id: "civilizational-wisdom",
        title: "Civilizational Wisdom", 
        category: "Heritage", 
        image: "/civilizational.jpg", 
        duration: "Lecture",
        story: "Our ancient civilization holds profound truths.\nPassed down through generations of seekers.\nDiscover the timeless wisdom that shapes our world.\nEmbracing our roots gives wings to our future."
    },
    { 
        id: "nidra-conscious-sleep",
        title: "Nidra - Conscious Sleep", 
        category: "Rest", 
        image: "/nidra.jpg", 
        duration: "30 min",
        story: "Nidra is not just rest, it is deep restoration.\nIn the silence of sleep, the soul is renewed.\nConscious relaxation heals the nervous system.\nAwaken refreshed and aligned with your true self."
    },
    { 
        id: "ritucharya-seasonal-harmony",
        title: "Ritucharya - Seasonal Harmony", 
        category: "Nature", 
        image: "/ritucharya.jpg", 
        duration: "Series",
        story: "Ritucharya is the wisdom of seasonal living.\nAdapting to nature's cycles brings robust health.\nAs the earth shifts, so must our practices.\nFlowing with the seasons is the secret to longevity."
    }
];


const LibraryCarousel: React.FC = () => {
    const navigate = useNavigate();
    const [libraryItems, setLibraryItems] = useState(defaultLibraryItems);

    // Load library items from localStorage
    useEffect(() => {
        const savedLibrary = localStorage.getItem("nirvaha_library");
        if (savedLibrary) {
            try {
                const parsed = JSON.parse(savedLibrary);
                // Merge with default items to ensure stories are present
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
                @keyframes scroll-reverse {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
                .carousel-track-1 {
                    animation: scroll-reverse 50s linear infinite;
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
                    {[...libraryItems.slice(0, 6), ...libraryItems.slice(0, 6)].map((item, idx) => (
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
                    {[...libraryItems.slice(6, 12), ...libraryItems.slice(6, 12)].map((item, idx) => (
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
