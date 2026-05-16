export interface WellnessSession {
    id: string;
    title: string;
    category: string;
    mood: string[];
    tags: string[];
    duration: string;
    thumbnail: string;
    audioSource: string;
    description: string;
    match: string;
    year: string;
    rating: string;
    type: 'Series' | 'Film';
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
        audioSource: "/audio/meditation.mp3",
        description: "Start your day with clarity and intention. A gentle awakening for the mind and body.",
        match: "98% Match",
        year: "2026",
        rating: "TV-G",
        type: 'Series'
    },
    {
        id: "2",
        title: "Deep Sleep Guide",
        category: "Sleep",
        mood: ["Relaxed", "Sleepy"],
        tags: ["Sleep", "Relaxation", "Rest"],
        duration: "45 min",
        thumbnail: "https://images.squarespace-cdn.com/content/v1/57b5ef68c534a5cc06edc769/b50a955f-e95f-42c1-beb6-4e74d753bfbb/restorative+yoga",
        audioSource: "/audio/sleep.mp3",
        description: "Drift into a restorative, deep slumber. Let go of the day's tension and embrace the night.",
        match: "95% Match",
        year: "2026",
        rating: "TV-PG",
        type: 'Film'
    },
    {
        id: "3",
        title: "Anxiety Relief",
        category: "Stress",
        mood: ["Relieved", "Grounded"],
        tags: ["Anxiety", "Calm", "Grounding"],
        duration: "20 min",
        thumbnail: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/stress.mp3",
        description: "Ground yourself in the present moment. A powerful tool to dissolve overwhelming thoughts.",
        match: "99% Match",
        year: "2025",
        rating: "TV-14",
        type: 'Series'
    },
    {
        id: "4",
        title: "Focus Flow",
        category: "Productivity",
        mood: ["Focused", "Energized"],
        tags: ["Work", "Study", "Flow"],
        duration: "30 min",
        thumbnail: "https://lonestarneurology.net/wp-content/uploads/2025/08/3-Mental-Clarity-and-Cognitive-Function-from-Yoga.jpg",
        audioSource: "/audio/focus.mp3",
        description: "Sharpen your concentration and unlock deep work states with precision-engineered audio.",
        match: "92% Match",
        year: "2026",
        rating: "TV-G",
        type: 'Series'
    },
    {
        id: "5",
        title: "Chakra Balance",
        category: "Energy",
        mood: ["Energized", "Balanced"],
        tags: ["Energy", "Balance", "Vitality"],
        duration: "15 min",
        thumbnail: "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/energy.mp3",
        description: "Realign your core energy centers. Experience a revitalizing surge of inner vitality.",
        match: "88% Match",
        year: "2024",
        rating: "TV-PG",
        type: 'Film'
    },
    {
        id: "6",
        title: "Breathwork Basics",
        category: "Meditation",
        mood: ["Calm", "Relaxed"],
        tags: ["Breath", "Beginner", "Relaxation"],
        duration: "12 min",
        thumbnail: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/meditation.mp3",
        description: "Master the fundamentals of conscious breathing. A perfect starting point for mindfulness.",
        match: "96% Match",
        year: "2025",
        rating: "TV-G",
        type: 'Series'
    },
    {
        id: "7",
        title: "Midday Reset",
        category: "Stress",
        mood: ["Relieved", "Energized"],
        tags: ["Work", "Quick", "Reset"],
        duration: "8 min",
        thumbnail: "https://images.unsplash.com/photo-1524863479829-916d8e77f114?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/stress.mp3",
        description: "A quick recalibration for your busy day. Release accumulated tension in minutes.",
        match: "91% Match",
        year: "2026",
        rating: "TV-PG",
        type: 'Film'
    },
    {
        id: "8",
        title: "Sleep Story: The Forest",
        category: "Sleep",
        mood: ["Sleepy", "Imaginative"],
        tags: ["Story", "Nature", "Sleep"],
        duration: "35 min",
        thumbnail: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/sleep.mp3",
        description: "Wander through an enchanted woodland as you gently transition into deep, peaceful sleep.",
        match: "94% Match",
        year: "2025",
        rating: "TV-PG",
        type: 'Film'
    },
    {
        id: "9",
        title: "Creative Spark",
        category: "Productivity",
        mood: ["Inspired", "Focused"],
        tags: ["Creativity", "Focus", "Art"],
        duration: "25 min",
        thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/focus.mp3",
        description: "Stimulate your imagination and bypass creative blocks with this guided ambient journey.",
        match: "89% Match",
        year: "2026",
        rating: "TV-G",
        type: 'Series'
    },
    {
        id: "10",
        title: "Morning Movement",
        category: "Energy",
        mood: ["Energized", "Awake"],
        tags: ["Morning", "Movement", "Vitality"],
        duration: "20 min",
        thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2400&auto=format&fit=crop",
        audioSource: "/audio/energy.mp3",
        description: "Wake up your body with gentle, energizing stretches and breath alignment.",
        match: "97% Match",
        year: "2026",
        rating: "TV-PG",
        type: 'Series'
    }
];
