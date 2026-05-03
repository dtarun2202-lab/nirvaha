import React, { useState } from 'react';
import { motion } from 'motion/react';
import LibraryCard from './LibraryCard';
import LibraryModal from './LibraryModal';

const libraryTopics = [
    {
        id: 1,
        title: "Dhyana",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000",
        story: "Dhyana is the art of effortless awareness.\nIt is not a destination but the journey itself.\nWhen the mind becomes still like a mirror,\nthe universe reflects its true nature within you."
    },
    {
        id: 2,
        title: "Guru Bhakti",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000",
        story: "Devotion to the guide is the shortest path to truth.\nThe Guru is not a person, but a principle of light.\nIn the surrender of the ego,\nthe infinite wisdom of the master flows into the disciple."
    },
    {
        id: 3,
        title: "Manas Shuddhi",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1000",
        story: "Purifying the mind is like cleaning a temple.\nRemove the dust of desire and the smoke of anger.\nOnly a pure heart can hold the divine flame,\nradiating peace to every corner of existence."
    },
    {
        id: 4,
        title: "Seva",
        image: "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=1000",
        story: "Selfless service is the highest form of worship.\nTo see the divine in every suffering being\nand to offer one's hands for their comfort\nis the true meaning of a spiritual life."
    },
    {
        id: 5,
        title: "Vairagya",
        image: "https://images.unsplash.com/photo-1528319725582-ddc0b6aabc5e?auto=format&fit=crop&q=80&w=1000",
        story: "Detachment is not the absence of love,\nbut the presence of freedom.\nWhen you hold the world lightly,\nit can no longer bind you to its sorrows.\nYou remain in the world, but not of it."
    },
    {
        id: 6,
        title: "Satsang",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1000",
        story: "In the company of truth, the soul finds its home.\nGood company elevates the vibration of the spirit.\nLike a single lamp lighting a thousand others,\none realized soul can wake up entire generations."
    }
];

const LibrarySection: React.FC = () => {
    const [selectedTopic, setSelectedTopic] = useState<any>(null);

    return (
        <section className="py-24 bg-[#f8faf9] relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-100 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-100 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-emerald-700 font-bold tracking-[0.4em] uppercase text-sm mb-4 block"
                    >
                        Spiritual Treasury
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-6xl font-bold text-[#0F131A] mb-6"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Story Library
                    </motion.h2>
                    <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: 80 }}
                        viewport={{ once: true }}
                        className="h-1.5 bg-emerald-500 mx-auto rounded-full mb-8"
                    />
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-[#595e67] max-w-2xl mx-auto font-light"
                    >
                        Click on a path to reveal its hidden wisdom. <br/>
                        A collection of timeless stories for the modern soul.
                    </motion.p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    {libraryTopics.map((topic) => (
                        <LibraryCard 
                            key={topic.id}
                            title={topic.title}
                            image={topic.image}
                            onClick={() => setSelectedTopic(topic)}
                        />
                    ))}
                </motion.div>
            </div>

            <LibraryModal 
                isOpen={!!selectedTopic}
                onClose={() => setSelectedTopic(null)}
                title={selectedTopic?.title || ""}
                story={selectedTopic?.story || ""}
            />
        </section>
    );
};

export default LibrarySection;
