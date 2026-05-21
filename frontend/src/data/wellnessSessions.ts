export interface Episode {
    id: string;
    title: string;
    duration: string;
    thumbnail: string;
    description: string;
    videoUrl: string;
}

export interface Season {
    seasonNumber: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    episodes: Episode[];
}

export interface WellnessSession {
    id: string;
    title: string;
    category: string;
    mood: string[];
    tags: string[];
    duration: string;
    thumbnail: string;
    banner: string;
    audioSource: string; // Deprecated audio path fallback
    description: string;
    match: string;
    year: string;
    rating: string;
    type: 'Series' | 'Film';
    seasons?: Season[];
    isOriginal?: boolean;
}

export const wellnessSessions: WellnessSession[] = [
    {
        id: "1",
        title: "Morning Calm",
        category: "Meditation",
        mood: ["Calm", "Focused"],
        tags: ["Focus", "Morning", "Clarity"],
        duration: "10 min",
        thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2400&auto=format&fit=crop",
        banner: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/meditation.mp3",
        description: "Start your day with clarity and intention. A gentle awakening for the mind and body to optimize energy and presence.",
        match: "98% Match",
        year: "2026",
        rating: "TV-G",
        type: 'Series',
        isOriginal: true,
        seasons: [
            {
                seasonNumber: 1,
                level: 'Beginner',
                episodes: [
                    {
                        id: "1",
                        title: "Morning Awakening",
                        duration: "15 min",
                        thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop",
                        description: "Connect with your breath and set a strong positive intention for the day ahead.",
                        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4"
                    },
                    {
                        id: "2",
                        title: "Breath Reset",
                        duration: "20 min",
                        thumbnail: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop",
                        description: "Clear out stale energy with a dynamic deep breathing rhythm that resets the nervous system.",
                        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4"
                    },
                    {
                        id: "3",
                        title: "Mind Relaxation",
                        duration: "18 min",
                        thumbnail: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=600&auto=format&fit=crop",
                        description: "Settle into silent presence and release lingering mental worries or busy chatter.",
                        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4"
                    },
                    {
                        id: "4",
                        title: "Deep Sleep Recovery",
                        duration: "25 min",
                        thumbnail: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600&auto=format&fit=crop",
                        description: "A gentle wind-down session guiding your awareness into deeply restorative delta wave sleep.",
                        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4"
                    }
                ]
            },
            {
                seasonNumber: 2,
                level: 'Intermediate',
                episodes: [
                    {
                        id: "5",
                        title: "Vipassana Insight",
                        duration: "20 min",
                        thumbnail: "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=600&auto=format&fit=crop",
                        description: "Cultivate objective self-observation by noticing bodily sensations without attachment.",
                        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4"
                    },
                    {
                        id: "6",
                        title: "Somatic Grounding",
                        duration: "22 min",
                        thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
                        description: "Anchor your nervous system inside muscle contractions and breath holds to relieve heavy anxiety.",
                        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4"
                    }
                ]
            }
        ]
    },
    {
        id: "2",
        title: "Deep Sleep Guide",
        category: "Sleep Stories",
        mood: ["Relaxed", "Sleepy"],
        tags: ["Sleep", "Relaxation", "Rest"],
        duration: "45 min",
        thumbnail: "https://images.squarespace-cdn.com/content/v1/57b5ef68c534a5cc06edc769/b50a955f-e95f-42c1-beb6-4e74d753bfbb/restorative+yoga",
        banner: "https://images.squarespace-cdn.com/content/v1/57b5ef68c534a5cc06edc769/b50a955f-e95f-42c1-beb6-4e74d753bfbb/restorative+yoga",
        audioSource: "/audio/sleep.mp3",
        description: "Drift into a restorative, deep slumber. Let go of the day's tension and embrace the peaceful night.",
        match: "95% Match",
        year: "2026",
        rating: "TV-PG",
        type: 'Film'
    },
    {
        id: "3",
        title: "Anxiety Relief",
        category: "Anxiety Relief",
        mood: ["Relieved", "Grounded"],
        tags: ["Anxiety", "Calm", "Grounding"],
        duration: "20 min",
        thumbnail: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=2400&auto=format&fit=crop",
        banner: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/stress.mp3",
        description: "Ground yourself completely in the present moment. A powerful tool designed to dissolve overwhelming thoughts, panic, and fast heartbeats.",
        match: "99% Match",
        year: "2025",
        rating: "TV-14",
        type: 'Series',
        seasons: [
            {
                seasonNumber: 1,
                level: 'Beginner',
                episodes: [
                    {
                        id: "1",
                        title: "Calming the Storm",
                        duration: "15 min",
                        thumbnail: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=600&auto=format&fit=crop",
                        description: "A quick emergency anchor session to lower high levels of acute nervous adrenaline.",
                        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4"
                    },
                    {
                        id: "2",
                        title: "Somatic Calm Flow",
                        duration: "18 min",
                        thumbnail: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop",
                        description: "Gentle physical releases designed to open tightness in the chest, throat, and shoulders.",
                        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4"
                    },
                    {
                        id: "3",
                        title: "Heart-Mind Connection",
                        duration: "20 min",
                        thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop",
                        description: "Synchronize your breathing with positive heart affirmations to generate deep safety.",
                        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4"
                    },
                    {
                        id: "4",
                        title: "Grounded Presence",
                        duration: "22 min",
                        thumbnail: "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=600&auto=format&fit=crop",
                        description: "A meditation session engaging the 5-4-3-2-1 sensory technique for absolute presence.",
                        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4"
                    }
                ]
            }
        ]
    },
    {
        id: "4",
        title: "Focus Flow",
        category: "Focus Training",
        mood: ["Focused", "Energized"],
        tags: ["Work", "Study", "Flow"],
        duration: "30 min",
        thumbnail: "https://lonestarneurology.net/wp-content/uploads/2025/08/3-Mental-Clarity-and-Cognitive-Function-from-Yoga.jpg",
        banner: "https://lonestarneurology.net/wp-content/uploads/2025/08/3-Mental-Clarity-and-Cognitive-Function-from-Yoga.jpg",
        audioSource: "/audio/focus.mp3",
        description: "Sharpen your concentration and unlock deep work states. Experience absolute precision-engineered mindfulness designed for focus.",
        match: "92% Match",
        year: "2026",
        rating: "TV-G",
        type: 'Series',
        isOriginal: true,
        seasons: [
            {
                seasonNumber: 1,
                level: 'Beginner',
                episodes: [
                    {
                        id: "1",
                        title: "Entering Deep Work",
                        duration: "10 min",
                        thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
                        description: "Tune your focus to absolute stillness, blocking out exterior distractions.",
                        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4"
                    },
                    {
                        id: "2",
                        title: "Cognitive Ignition",
                        duration: "12 min",
                        thumbnail: "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=600&auto=format&fit=crop",
                        description: "Ignite mental sharpness with focused, rapid inhalation techniques.",
                        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4"
                    }
                ]
            }
        ]
    },
    {
        id: "5",
        title: "Chakra Balance",
        category: "Spiritual Guidance",
        mood: ["Energized", "Balanced"],
        tags: ["Energy", "Balance", "Vitality"],
        duration: "15 min",
        thumbnail: "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=2400&auto=format&fit=crop",
        banner: "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/energy.mp3",
        description: "Realign your core energetic centers. Experience a revitalizing surge of spiritual harmony and inner light.",
        match: "88% Match",
        year: "2024",
        rating: "TV-PG",
        type: 'Film'
    },
    {
        id: "6",
        title: "Breathwork Basics",
        category: "Breathwork",
        mood: ["Calm", "Relaxed"],
        tags: ["Breath", "Beginner", "Relaxation"],
        duration: "12 min",
        thumbnail: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2400&auto=format&fit=crop",
        banner: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/meditation.mp3",
        description: "Master the fundamentals of conscious breathing. The ultimate starting point to optimize parasympathetic health.",
        match: "96% Match",
        year: "2025",
        rating: "TV-G",
        type: 'Series',
        seasons: [
            {
                seasonNumber: 1,
                level: 'Beginner',
                episodes: [
                    {
                        id: "1",
                        title: "Diaphragmatic Breath",
                        duration: "12 min",
                        thumbnail: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop",
                        description: "Optimize belly expansion for maximum vagus nerve activation.",
                        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4"
                    },
                    {
                        id: "2",
                        title: "The Box Breath",
                        duration: "15 min",
                        thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop",
                        description: "A 4-4-4-4 holding sequence designed by Navy SEALs to secure complete stress regulation.",
                        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4"
                    }
                ]
            }
        ]
    },
    {
        id: "7",
        title: "Midday Reset",
        category: "Inner Peace",
        mood: ["Relieved", "Energized"],
        tags: ["Work", "Quick", "Reset"],
        duration: "8 min",
        thumbnail: "https://images.unsplash.com/photo-1524863479829-916d8e77f114?q=80&w=2400&auto=format&fit=crop",
        banner: "https://images.unsplash.com/photo-1524863479829-916d8e77f114?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/stress.mp3",
        description: "A quick physical recalibration. Release modern office fatigue and structural spine tension in minutes.",
        match: "91% Match",
        year: "2026",
        rating: "TV-PG",
        type: 'Film'
    },
    {
        id: "8",
        title: "Sleep Story: The Forest",
        category: "Sleep Stories",
        mood: ["Sleepy", "Imaginative"],
        tags: ["Story", "Nature", "Sleep"],
        duration: "35 min",
        thumbnail: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2400&auto=format&fit=crop",
        banner: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/sleep.mp3",
        description: "Wander through an ancient, mystical pine woodland. Drift off seamlessly under soft rain sounds.",
        match: "94% Match",
        year: "2025",
        rating: "TV-PG",
        type: 'Film',
        isOriginal: true
    },
    {
        id: "9",
        title: "Burnout Recovery",
        category: "Emotional Healing",
        mood: ["Inspired", "Focused"],
        tags: ["Creativity", "Focus", "Art"],
        duration: "25 min",
        thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2400&auto=format&fit=crop",
        banner: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/focus.mp3",
        description: "Stimulate nervous relaxation and gently heal deep professional exhaustion with somatic meditations.",
        match: "89% Match",
        year: "2026",
        rating: "TV-G",
        type: 'Series',
        seasons: [
            {
                seasonNumber: 1,
                level: 'Beginner',
                episodes: [
                    {
                        id: "1",
                        title: "Slowing the Engine",
                        duration: "18 min",
                        thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop",
                        description: "Understand the biological mechanisms of burnout and learn how to immediately downshift.",
                        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4"
                    },
                    {
                        id: "2",
                        title: "Deep Somatic Recharging",
                        duration: "22 min",
                        thumbnail: "https://images.unsplash.com/photo-1524863479829-916d8e77f114?q=80&w=600&auto=format&fit=crop",
                        description: "Re-ignite deep mitochondrial energy through targeted progressive physical relaxation.",
                        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4"
                    }
                ]
            }
        ]
    },
    {
        id: "10",
        title: "Morning Movement",
        category: "Yoga Programs",
        mood: ["Energized", "Awake"],
        tags: ["Morning", "Movement", "Vitality"],
        duration: "20 min",
        thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2400&auto=format&fit=crop",
        banner: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/energy.mp3",
        description: "Wake up your body with gentle, highly fluid Hatha yoga stretches and dynamic deep breath coordination.",
        match: "97% Match",
        year: "2026",
        rating: "TV-PG",
        type: 'Series',
        seasons: [
            {
                seasonNumber: 1,
                level: 'Beginner',
                episodes: [
                    {
                        id: "1",
                        title: "Spinal Mobilization",
                        duration: "15 min",
                        thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
                        description: "Flowing movements designed to decompress vertebrae and stimulate cerebrospinal fluid.",
                        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4"
                    },
                    {
                        id: "2",
                        title: "Sun Salutations",
                        duration: "20 min",
                        thumbnail: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop",
                        description: "A seamless dynamic sequence to activate core energy hubs and build early sweat.",
                        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4"
                    }
                ]
            }
        ]
    }
];
