export interface ReferenceLink {
    title: string;
    url: string;
}

export interface LibraryItem {
    id: string;
    title: string;
    category: string;
    image: string;
    duration: string;
    story: string; // The short lines
    description: string; // Detailed paragraph
    whyTheyMatter: string;
    quotes: string[];
    impact: string[];
    referenceLinks: ReferenceLink[];
}

export const defaultLibraryItems: LibraryItem[] = [
    { 
        id: "agni-the-sacred-fire",
        title: "Agni - The Sacred Fire", 
        category: "Transformation", 
        image: "/agni.png", 
        duration: "15 min",
        story: "Agni is the element of transformation.\nIt burns away the impurities of the ego.\nIn its light, we find the path to our true self.\nThe fire of awareness illuminates the dark corners of the mind.",
        description: "Agni, the ancient Vedic deity of fire, represents the pure energy of transformation and illumination. Beyond the physical flame, Agni symbolizes the spiritual fire within—the light of consciousness that burns away ignorance and purifies the soul. In ancient texts, Agni is revered as the ultimate messenger between humanity and the divine, carrying our offerings and intentions to the higher realms.",
        whyTheyMatter: "Agni teaches us the necessity of destruction for the sake of rebirth. In our modern lives, embracing the fire of Agni means actively burning away old habits, toxic attachments, and limiting beliefs. It is the vital spark that initiates deep personal and spiritual transformation.",
        quotes: [
            "Fire is the test of gold; adversity, of strong men.",
            "That which is not purified by fire cannot hold the eternal light.",
            "Let the fire of awareness consume the darkness of ignorance."
        ],
        impact: [
            "Initiates deep personal transformation and emotional release.",
            "Cultivates inner resilience and mental clarity.",
            "Aids in overcoming stagnation and initiating new beginnings.",
            "Symbolizes the spark of life and consciousness in daily meditation."
        ],
        referenceLinks: [
            { title: "Vedic Significance of Agni", url: "#" },
            { title: "Fire Meditation Techniques", url: "#" }
        ]
    },
    { 
        id: "dharma-the-righteous-path",
        title: "Dharma - The Righteous Path", 
        category: "Purpose", 
        image: "/dharma.png", 
        duration: "Series",
        story: "Dharma is the moral order of the universe.\nIt is the duty that aligns us with our highest purpose.\nWhen we follow our dharma, we find effortless peace.\nLiving in harmony with truth is the ultimate goal.",
        description: "Dharma is a complex and multifaceted concept in ancient Indian philosophy, often translated as duty, righteousness, or moral order. It is the cosmic law that upholds the universe and the individual's role within it. Discovering one's Dharma means finding the unique purpose for which one was born, aligning personal actions with the greater good of society and the cosmos.",
        whyTheyMatter: "In a world often driven by chaotic desires and external validation, Dharma provides an unwavering inner compass. It matters because it shifts our focus from 'what do I want?' to 'what is my duty?' bringing profound meaning, stability, and lasting fulfillment to our actions.",
        quotes: [
            "Where there is Dharma, there is victory.",
            "Better is one's own Dharma, though imperfect, than the Dharma of another well performed.",
            "Dharma protects those who protect it."
        ],
        impact: [
            "Provides a clear sense of purpose and direction in life.",
            "Fosters ethical decision-making and integrity.",
            "Reduces existential anxiety by connecting the individual to a larger cosmic order.",
            "Encourages selfless service and harmonious community living."
        ],
        referenceLinks: [
            { title: "Understanding Dharma in the Bhagavad Gita", url: "#" },
            { title: "Finding Your Life's Purpose", url: "#" }
        ]
    },
    { 
        id: "indriya-nigraha-sensory-control",
        title: "Indriya Nigraha - Sensory Control", 
        category: "Senses", 
        image: "/indriya.jpg", 
        duration: "10 min",
        story: "Master the senses to master the mind.\nIndriya Nigraha is the art of conscious withdrawal.\nNot through suppression, but through deep understanding.\nWhen the senses turn inward, the soul finds its home.",
        description: "Indriya Nigraha translates to the mastery or withdrawal of the senses. Ancient yogis understood that the senses are like wild horses pulling the chariot of the mind in multiple directions. Indriya Nigraha is not about forceful suppression, but about developing the conscious ability to direct sensory energy inward, transitioning from external distraction to internal stillness (Pratyahara).",
        whyTheyMatter: "Today's digital age bombards our senses with unprecedented levels of stimulation, leading to anxiety, short attention spans, and chronic stress. Indriya Nigraha is the ultimate antidote, empowering us to reclaim our attention and preserve our mental energy.",
        quotes: [
            "When the senses are controlled, the mind becomes a clear mirror.",
            "He who conquers his senses is the greatest of warriors.",
            "The turtle withdraws its limbs; the wise withdraw their senses from the objects of desire."
        ],
        impact: [
            "Dramatically improves focus and concentration.",
            "Reduces anxiety caused by sensory overload.",
            "Conserves vital mental and physical energy (Prana).",
            "Prepares the mind for deep meditation (Dhyana)."
        ],
        referenceLinks: [
            { title: "Pratyahara: The Forgotten Limb of Yoga", url: "#" },
            { title: "Digital Detox and Sensory Mastery", url: "#" }
        ]
    },
    { 
        id: "manas-shuddhi-mental-clarity",
        title: "Manas Shuddhi - Mental Clarity", 
        category: "Mind", 
        image: "/manas.png", 
        duration: "20 min",
        story: "Purifying the mind is like cleaning a temple.\nRemove the dust of desire and the smoke of anger.\nOnly a pure heart can hold the divine flame,\nradiating peace to every corner of existence.",
        description: "Manas Shuddhi refers to the systematic purification of the mind. According to ancient wisdom, the mind accumulates 'impurities' (Mala) such as greed, anger, jealousy, and delusion through worldly interactions. Manas Shuddhi involves practices like self-reflection, chanting, and selfless service that cleanse the subconscious, allowing the true nature of the self—pure consciousness—to shine through.",
        whyTheyMatter: "A turbulent mind distorts reality, leading to suffering and poor decision-making. Manas Shuddhi is essential because true happiness and wisdom cannot take root in an unpurified mind. It is the foundation for any serious spiritual journey.",
        quotes: [
            "A pure mind sees the divine in all things.",
            "As a mirror reflects clearly when polished, the soul shines when the mind is purified.",
            "Purity of mind is the greatest wealth."
        ],
        impact: [
            "Enhances emotional stability and resilience.",
            "Clears subconscious blockages and past traumas.",
            "Fosters genuine compassion and loving-kindness.",
            "Creates the necessary inner environment for enlightenment."
        ],
        referenceLinks: [
            { title: "Techniques for Mental Purification", url: "#" },
            { title: "The Role of Sattva in Manas Shuddhi", url: "#" }
        ]
    },
    { 
        id: "jawaharlal-nehru-visionary-wisdom",
        title: "Jawaharlal Nehru - Visionary Wisdom", 
        category: "Wisdom", 
        image: "/nehru.png", 
        duration: "Lecture",
        story: "Wisdom is the ability to see the unity in diversity.\nLeadership is the service of the human spirit.\nThrough education and self-reflection, we build a better world.\nThe mind that is open to truth is the mind that is free.",
        description: "Jawaharlal Nehru, the first Prime Minister of independent India, was not just a political leader but a profound thinker, historian, and visionary. Deeply influenced by both Western liberalism and Eastern philosophy, Nehru's writings reflect a deep understanding of human history and the necessary evolution of consciousness. He championed scientific temper alongside cultural heritage.",
        whyTheyMatter: "Nehru's vision demonstrates how ancient philosophical roots can be harmonized with modern democratic and scientific ideals. His life's work reminds us that true leadership requires intellectual depth, a global perspective, and a commitment to the collective evolution of humanity.",
        quotes: [
            "Time is not measured by the passing of years but by what one does, what one feels, and what one achieves.",
            "Culture is the widening of the mind and of the spirit.",
            "Failure comes only when we forget our ideals and objectives and principles."
        ],
        impact: [
            "Inspires a balance between scientific reasoning and spiritual depth.",
            "Encourages continuous education and open-mindedness.",
            "Highlights the importance of unity and secularism in diverse societies.",
            "Provides a model for compassionate and visionary leadership."
        ],
        referenceLinks: [
            { title: "The Discovery of India - Excerpts", url: "#" },
            { title: "Nehru's Concept of Scientific Temper", url: "#" }
        ]
    },
    { 
        id: "samarth-ramdas-path-of-devotion",
        title: "Samarth Ramdas - Path of Devotion", 
        category: "Devotion", 
        image: "/ramdas.png", 
        duration: "Music",
        story: "Devotion to the master is the bridge to the infinite.\nThrough surrender, the disciple becomes one with the light.\nChant the names of the divine to quiet the restless heart.\nIn the service of the master, we find the highest joy.",
        description: "Samarth Ramdas was a revered 17th-century Indian saint, philosopher, and poet. Known for his unwavering devotion (Bhakti) to Lord Rama and his powerful spiritual discourses (Dasbodh), he emphasized the integration of spiritual practice with active, worldly duty. He was the spiritual guru of Chhatrapati Shivaji Maharaj, blending martial spirit with spiritual depth.",
        whyTheyMatter: "Samarth Ramdas breaks the stereotype that spirituality requires abandoning the world. He taught that active participation in society, fighting injustice, and maintaining absolute devotion to the Divine are all facets of a single, unified spiritual path.",
        quotes: [
            "God is realized through devotion, not by logical arguments.",
            "Strength is life; weakness is death. Build your inner strength.",
            "Let your actions speak the language of your devotion."
        ],
        impact: [
            "Promotes the integration of spirituality with daily responsibilities.",
            "Builds mental and physical fortitude.",
            "Inspires unwavering faith and devotion during challenging times.",
            "Teaches the value of a strong guru-disciple relationship."
        ],
        referenceLinks: [
            { title: "Teachings of Dasbodh", url: "#" },
            { title: "The Life of Samarth Ramdas", url: "#" }
        ]
    },
    { 
        id: "sadvritta-ethical-living",
        title: "Sadvritta - Ethical Living", 
        category: "Ethics", 
        image: "/sadvritta.png", 
        duration: "Practice",
        story: "Right conduct is the foundation of a spiritual life.\nTreat all beings with compassion and kindness.\nIntegrity in thought, word, and deed brings lasting harmony.\nYour actions are the seeds of your future destiny.",
        description: "Sadvritta is an ancient Ayurvedic and Yogic concept meaning 'noble conduct' or the 'rules of good living'. It outlines a comprehensive code of ethics that encompasses personal hygiene, social behavior, moral integrity, and psychological well-being. Sadvritta asserts that health and spiritual progress are impossible without a foundation of ethical living.",
        whyTheyMatter: "In a fast-paced world focused on personal gain, Sadvritta brings us back to the fundamentals of human decency. It teaches that our physical health, mental peace, and spiritual growth are directly tied to how we treat others and how honestly we live our lives.",
        quotes: [
            "Health is the byproduct of a life lived in truth.",
            "Do unto all creatures as you would have them do unto you.",
            "A mind at peace with its actions knows no disease."
        ],
        impact: [
            "Establishes a foundation for holistic health (body, mind, and spirit).",
            "Fosters harmonious and supportive social relationships.",
            "Prevents psychosomatic illnesses rooted in guilt or stress.",
            "Cultivates inner peace and self-respect."
        ],
        referenceLinks: [
            { title: "Ayurvedic Guide to Sadvritta", url: "#" },
            { title: "The Connection Between Ethics and Health", url: "#" }
        ]
    },
    { 
        id: "saradhi-the-divine-guide",
        title: "Saradhi - The Divine Guide", 
        category: "Guidance", 
        image: "/saradhi.jpg", 
        duration: "Journey",
        story: "The guide is the lighthouse in the storm of existence.\nFollowing the lead of wisdom brings us to the shore of truth.\nSurrender the reins of your life to the master within.\nEvery step taken in trust is a step closer to liberation.",
        description: "Saradhi literally means 'charioteer'. In the epic Mahabharata, Lord Krishna serves as the Saradhi to the warrior Arjuna, guiding him through the moral and physical battlefield of Kurukshetra. Symbolically, Saradhi represents the inner divine guide—the higher intellect or the soul—that steers the chariot of the body through the chaotic journey of life.",
        whyTheyMatter: "We all face moments of profound confusion and moral dilemmas. The concept of Saradhi reminds us that we are not alone. By surrendering the 'reins' of our ego to our higher, inner wisdom, we can navigate life's most difficult battles with grace and clarity.",
        quotes: [
            "Surrender the fruits of your actions to the divine charioteer.",
            "When the mind is confused, let the soul take the reins.",
            "The greatest journey is the one guided by inner light."
        ],
        impact: [
            "Encourages trust in the unfolding process of life.",
            "Helps overcome analysis paralysis and deep-seated fears.",
            "Teaches the profound practice of surrender (Ishvara Pranidhana).",
            "Awakens the inner voice of intuition and moral clarity."
        ],
        referenceLinks: [
            { title: "Symbolism of the Chariot in the Upanishads", url: "#" },
            { title: "Krishna as the Ultimate Guide", url: "#" }
        ]
    },
    { 
        id: "vyayama-sacred-movement",
        title: "Vyayama - Sacred Movement", 
        category: "Discipline", 
        image: "/vyayama.jpg", 
        duration: "Movement",
        story: "The body is the temple of the living soul.\nThrough discipline and movement, we prepare for stillness.\nStrength and flexibility are the tools of the spiritual warrior.\nHonoring the body is honoring the creation itself.",
        description: "Vyayama is the ancient Indian science of physical exercise and movement, deeply intertwined with Ayurveda and Yoga. Unlike modern fitness that often focuses solely on aesthetics, Vyayama views the body as a sacred vessel. Physical discipline, breath coordination, and mindful movement are utilized to balance the doshas, clear energetic channels (Nadis), and prepare the body to sit comfortably in deep meditation.",
        whyTheyMatter: "Physical stagnation leads to mental stagnation. Vyayama reminds us that spiritual growth cannot bypass the physical body. By treating exercise as a sacred duty rather than a chore, we honor our physical form and build the necessary vitality to pursue higher spiritual goals.",
        quotes: [
            "A strong body is the foundation of a stable mind.",
            "Movement is the song of the physical form.",
            "Through discipline of the flesh, the spirit is liberated."
        ],
        impact: [
            "Enhances physical strength, flexibility, and vitality.",
            "Improves the flow of Prana (life force) throughout the body.",
            "Releases stored physical trauma and emotional tension.",
            "Creates physical stability necessary for prolonged meditation."
        ],
        referenceLinks: [
            { title: "Ancient Indian Physical Culture", url: "#" },
            { title: "The Integration of Asana and Vyayama", url: "#" }
        ]
    },
    { 
        id: "satmya-holistic-adaptability",
        title: "Satmya - Holistic Adaptability", 
        category: "Adaptability", 
        image: "/satmya.jpg", 
        duration: "10 min",
        story: "Satmya is the art of adapting to one's environment.\nIt represents the body's natural resilience.\nThrough conscious habits, we build lasting vitality.\nHarmony with our surroundings brings enduring health.",
        description: "In Ayurveda, Satmya refers to suitability or habituation. It is the concept of adapting to one's environment, diet, and lifestyle to maintain equilibrium. Satmya recognizes that what is medicine for one may be poison for another, emphasizing the profound uniqueness of each individual's constitution and their deeply ingrained habits.",
        whyTheyMatter: "Modern life demands constant adaptation. Understanding Satmya empowers us to build deep resilience by recognizing what truly suits our unique mind-body complex, leading to sustainable health and an unshakeable sense of groundedness amidst constant change.",
        quotes: [
            "Adaptability is not imitation, but deep harmony with one's truth.",
            "That which brings joy and ease to the body naturally becomes Satmya.",
            "Resilience is born when we flow with nature rather than resist it."
        ],
        impact: [
            "Builds a highly resilient immune and nervous system.",
            "Reduces chronic stress caused by incompatible lifestyles.",
            "Fosters deep self-awareness and intuition.",
            "Promotes sustainable, long-term well-being."
        ],
        referenceLinks: [
            { title: "Understanding Satmya in Ayurveda", url: "#" },
            { title: "The Science of Biological Adaptability", url: "#" }
        ]
    },
    { 
        id: "bramhacharya-energy-mastery",
        title: "Bramhacharya - Energy Mastery", 
        category: "Discipline", 
        image: "/bramhacharya.jpg", 
        duration: "Series",
        story: "Bramhacharya is the preservation of vital energy.\nIt focuses the mind on higher spiritual goals.\nBy channeling our desires, we gain profound clarity.\nTrue power lies in self-mastery and inner focus.",
        description: "Often misunderstood merely as celibacy, Bramhacharya (literally 'behavior that leads to Brahman' or divine consciousness) is the yogic practice of right use of energy. It involves directing our vital life force (Prana) away from external sensory gratification and channeling it toward profound spiritual growth, creative expression, and inner healing.",
        whyTheyMatter: "In a world designed to drain our attention and vital energy, Bramhacharya is the ultimate practice of energetic sovereignty. It allows us to reclaim our power, focus our scattered minds, and channel our passions into fulfilling our highest potential.",
        quotes: [
            "Energy flows where intention goes.",
            "Mastery of the senses is the true wealth of a seeker.",
            "When the vital force is conserved, the mind becomes an instrument of genius."
        ],
        impact: [
            "Cultivates immense physical vitality and mental stamina.",
            "Transforms scattered desires into focused creative power.",
            "Deepens meditative states and spiritual insights.",
            "Promotes profound emotional stability."
        ],
        referenceLinks: [
            { title: "The True Meaning of Bramhacharya", url: "#" },
            { title: "Pranayama and Energy Conservation", url: "#" }
        ]
    },
    { 
        id: "dhinacharya-daily-routine",
        title: "Dhinacharya - Daily Routine", 
        category: "Lifestyle", 
        image: "/dhinacharya.jpg", 
        duration: "Practice",
        story: "Dhinacharya aligns our daily rhythm with nature.\nIt brings balance to body, mind, and spirit.\nA structured day builds a foundation for peace.\nSmall habits shape the trajectory of our lives.",
        description: "Dinacharya is the Ayurvedic concept of a daily routine designed to maintain physical and mental hygiene. By aligning our waking, eating, and sleeping habits with the natural cycles of the sun and the rhythms of nature, Dinacharya creates a predictable foundation that stabilizes the nervous system and optimizes biological functions.",
        whyTheyMatter: "An unpredictable lifestyle creates a chaotic mind. Dinacharya acts as an anchor. By grounding our days in healthy, consistent rituals, we eliminate decision fatigue, drastically reduce stress, and create the optimal environment for our bodies to heal and thrive.",
        quotes: [
            "We are what we repeatedly do. Excellence is not an act, but a habit.",
            "Align your rhythm with the sun, and the universe will align with you.",
            "The morning sets the tone for the symphony of the day."
        ],
        impact: [
            "Regulates circadian rhythms for optimal hormone balance.",
            "Improves digestion and metabolic efficiency.",
            "Significantly lowers daily anxiety and stress levels.",
            "Creates a strong foundation for spiritual practices."
        ],
        referenceLinks: [
            { title: "The Perfect Ayurvedic Morning Routine", url: "#" },
            { title: "Circadian Rhythms and Health", url: "#" }
        ]
    },
    { 
        id: "civilizational-wisdom",
        title: "Civilizational Wisdom", 
        category: "Heritage", 
        image: "/civilizational.jpg", 
        duration: "Lecture",
        story: "Our ancient civilization holds profound truths.\nPassed down through generations of seekers.\nDiscover the timeless wisdom that shapes our world.\nEmbracing our roots gives wings to our future.",
        description: "Civilizational Wisdom encompasses the collective spiritual, philosophical, and practical knowledge accumulated by humanity over millennia. In the context of the Vedic tradition, it is the unbroken transmission of understanding regarding the cosmos, human nature, and the ultimate reality. It is a vast reservoir of timeless principles that guide humanity through the ages.",
        whyTheyMatter: "To move forward with clarity, we must understand where we come from. Civilizational Wisdom provides a deeply rooted framework of values that protects us from the fleeting trends of modern society. It grounds our progress in timeless truths, ensuring that technological advancement is matched by spiritual maturity.",
        quotes: [
            "A civilization is built not on machines, but on the minds and hearts of its people.",
            "The roots of wisdom are bitter, but the fruit is sweet.",
            "To know your future, you must understand your past."
        ],
        impact: [
            "Fosters a deep sense of identity and cultural rootedness.",
            "Provides ethical frameworks for modern dilemmas.",
            "Connects the individual to a vast lineage of seekers.",
            "Inspires long-term, visionary thinking."
        ],
        referenceLinks: [
            { title: "Lessons from Ancient Civilizations", url: "#" },
            { title: "The Transmission of Vedic Knowledge", url: "#" }
        ]
    },
    { 
        id: "nidra-conscious-sleep",
        title: "Nidra - Conscious Sleep", 
        category: "Rest", 
        image: "/nidra.jpg", 
        duration: "30 min",
        story: "Nidra is not just rest, it is deep restoration.\nIn the silence of sleep, the soul is renewed.\nConscious relaxation heals the nervous system.\nAwaken refreshed and aligned with your true self.",
        description: "Yoga Nidra, or yogic sleep, is a state of consciousness between waking and sleeping. It is a powerful technique in which the practitioner learns to relax consciously. While the physical body rests deeply, the inner awareness remains awake, allowing for profound psychological, physical, and energetic healing at the deepest subconscious levels.",
        whyTheyMatter: "Chronic exhaustion is the epidemic of our era. Nidra is crucial because true rest is rarely achieved through ordinary sleep alone. Conscious rest unwinds deep-seated tensions, resets the nervous system, and provides an unparalleled sanctuary of peace in a hyper-stimulated world.",
        quotes: [
            "In the depths of stillness, the body remembers how to heal.",
            "True rest is not the absence of activity, but the presence of peace.",
            "Awake in the dream of life, asleep in the peace of the soul."
        ],
        impact: [
            "Dramatically reduces stress, anxiety, and PTSD symptoms.",
            "Improves the quality of natural sleep and combats insomnia.",
            "Enhances cognitive function and creative problem-solving.",
            "Facilitates deep emotional healing and subconscious reprogramming."
        ],
        referenceLinks: [
            { title: "The Science of Yoga Nidra", url: "#" },
            { title: "Deep Rest for the Modern Nervous System", url: "#" }
        ]
    },
    { 
        id: "ritucharya-seasonal-harmony",
        title: "Ritucharya - Seasonal Harmony", 
        category: "Nature", 
        image: "/ritucharya.jpg", 
        duration: "Series",
        story: "Ritucharya guides us through the cycles of nature.\nAdjusting to the seasons keeps the body in perfect harmony.\nAs the earth changes, so must our daily habits.\nEmbrace the natural flow to maintain vibrant health.",
        description: "Ritucharya translates to seasonal regimen. In Ayurveda, the changing of seasons (Ritus) profoundly impacts the human body and mind. Ritucharya is the practice of adjusting one's diet, daily routine, and lifestyle practices to harmonize with the shifting energies of nature, preventing seasonal diseases and maintaining continuous equilibrium.",
        whyTheyMatter: "Modern living often disconnects us from nature's cycles, leading to imbalances and seasonal illnesses. Ritucharya matters because it reinstates our intrinsic bond with the Earth. By adapting to the seasons, we harness nature's support rather than fighting against its currents, ensuring year-round vitality.",
        quotes: [
            "To be healthy is to flow seamlessly with the seasons of life.",
            "Nature never hurries, yet everything is accomplished.",
            "When we harmonize with the earth, the earth nourishes us."
        ],
        impact: [
            "Prevents seasonal allergies and boosts immune function.",
            "Optimizes digestion and energy levels throughout the year.",
            "Fosters a deep spiritual connection with the natural world.",
            "Promotes environmental mindfulness and sustainable living."
        ],
        referenceLinks: [
            { title: "Ayurvedic Guide to Seasonal Eating", url: "#" },
            { title: "Harmonizing with Nature's Rhythms", url: "#" }
        ]
    }
];
