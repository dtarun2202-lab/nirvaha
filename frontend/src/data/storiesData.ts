export interface StoryInsight {
    title: string;
    description: string;
}

export interface StoryContentBlock {
    type: 'paragraph' | 'quote' | 'highlight';
    content: string;
    author?: string; // For quotes
}

export interface Story {
    id: string;
    title: string;
    subtitle: string;
    description: string; // Brief for card
    image: string; // The hero image
    author: string;
    date: string;
    readTime: string;
    heroQuote: string; // Main quote displayed prominently
    contentBlocks: StoryContentBlock[];
    insights: StoryInsight[];
}

export const storiesData: Story[] = [
    {
        id: "the-path-to-stillness",
        title: "The Path to Stillness",
        subtitle: "How a high-stress tech executive found balance through daily guided meditation.",
        description: "How a high-stress tech executive found balance through daily guided meditation and ancient breathwork techniques. 'Nirvaha didn't just change my routine; it changed my perspective on life.'",
        image: "/story1.png",
        author: "Sarah Jenkins",
        date: "October 12, 2023",
        readTime: "5 min read",
        heroQuote: "I was running a marathon with no finish line. Nirvaha taught me how to finally stand still.",
        contentBlocks: [
            {
                type: "paragraph",
                content: "For over a decade, Sarah Jenkins lived life in the fast lane. As a senior executive at a leading tech firm, her days were dictated by back-to-back meetings, endless email threads, and the constant pressure to deliver quarterly results. The concept of 'downtime' was entirely foreign to her. Sleep became a luxury, and burnout was worn like a badge of honor."
            },
            {
                type: "paragraph",
                content: "The breaking point came during a routine product launch. A minor setback triggered a massive panic attack. It was then that Sarah realized her current trajectory was unsustainable. She needed a profound shift, not just a weekend getaway."
            },
            {
                type: "highlight",
                content: "Enter Nirvaha. Initially skeptical of 'ancient wisdom' platforms, Sarah decided to give the guided meditation sessions a try, committing to just 15 minutes a morning."
            },
            {
                type: "paragraph",
                content: "The transformation wasn't instantaneous, but it was deeply foundational. Through consistent practice of Pranayama (breathwork) and Dhyana (meditation), Sarah learned to detach her self-worth from her productivity output. She began to observe her stressful thoughts without being consumed by them."
            },
            {
                type: "quote",
                content: "Nirvaha didn't just change my routine; it changed my perspective on life. I learned that true leadership requires inner stillness, not just constant motion.",
                author: "Sarah Jenkins"
            },
            {
                type: "paragraph",
                content: "Today, Sarah continues to lead her team, but the frantic energy has been replaced with a grounded presence. She has integrated mindful pauses into her daily schedule and encourages her entire department to prioritize emotional well-being over relentless hustle."
            }
        ],
        insights: [
            {
                title: "Redefining Productivity",
                description: "Learning that taking time to pause and center oneself actually increases long-term efficiency and creativity."
            },
            {
                title: "The Power of Breath",
                description: "Using ancient Pranayama techniques to regulate the nervous system during high-stress corporate environments."
            },
            {
                title: "Detachment from Outcomes",
                description: "Practicing the Gita's philosophy of acting with focus while remaining unattached to the immediate results."
            }
        ]
    },
    {
        id: "echoes-of-healing",
        title: "Echoes of Healing",
        subtitle: "A journey into sound healing that resolved years of profound insomnia.",
        description: "A journey into sound healing that resolved years of insomnia. 'The resonance of the bowls felt like they were vibrating through my very soul, clearing blocks I never knew I had.'",
        image: "/story2.png",
        author: "Marcus Thorne",
        date: "November 05, 2023",
        readTime: "7 min read",
        heroQuote: "The resonance of the bowls felt like they were vibrating through my very soul.",
        contentBlocks: [
            {
                type: "paragraph",
                content: "Marcus had not slept a full night in four years. After a severe car accident, physical therapy healed his bones, but the trauma lingered in his nervous system. Traditional sleep aids offered only groggy, restless nights, and cognitive behavioral therapy seemed to only scratch the surface of his anxiety."
            },
            {
                type: "paragraph",
                content: "Desperate for relief, Marcus discovered Nirvaha's dedicated sound healing library. The idea that specific frequencies could alter brainwave states seemed like science fiction, but he was willing to try anything."
            },
            {
                type: "highlight",
                content: "The first session was a revelation. Lying in the dark, listening to the deep, resonant frequencies of Tibetan singing bowls and precisely tuned binaural beats, Marcus felt a physical release of tension he didn't realize he was holding."
            },
            {
                type: "paragraph",
                content: "Sound healing works on the principle of entrainment, where the brain's electromagnetic frequencies begin to synchronize with the external sound. For Marcus, the low frequencies slowly guided his hyperactive Beta brainwaves down into the deeply relaxing Theta state."
            },
            {
                type: "quote",
                content: "I didn't just fall asleep; I sank into a profound state of rest. It was the first time in years my body felt safe enough to let go.",
                author: "Marcus Thorne"
            },
            {
                type: "paragraph",
                content: "Six months later, Marcus's insomnia is a thing of the past. He uses the Nirvaha soundscapes nightly, treating the auditory experience not as a medical intervention, but as a sacred ritual of self-care and profound healing."
            }
        ],
        insights: [
            {
                title: "Somatic Healing",
                description: "Understanding that trauma is stored in the body, and physical frequencies can help dislodge deep-seated tension."
            },
            {
                title: "Brainwave Entrainment",
                description: "Using specific audio frequencies to naturally guide the brain from anxious states into restorative sleep cycles."
            },
            {
                title: "Ritualizing Rest",
                description: "Transforming the stressful act of 'trying to sleep' into a welcoming nightly ceremony of sound."
            }
        ]
    },
    {
        id: "community-resilience",
        title: "Community Resilience",
        subtitle: "Finding a tribe in a lonely world. Discover how our community circles foster deep connection.",
        description: "Finding a tribe in a lonely world. Discover how our community circles foster deep connection and emotional safety for those navigating grief and loss.",
        image: "/story3.png",
        author: "Elena Rodriguez",
        date: "January 22, 2024",
        readTime: "6 min read",
        heroQuote: "Grief is a heavy stone. You don't have to carry it alone.",
        contentBlocks: [
            {
                type: "paragraph",
                content: "When Elena lost her partner of 20 years, the world stopped making sense. The initial outpouring of support from friends slowly dwindled, leaving her isolated in a quiet house. Society expected her to 'move on,' but her grief was an ocean she felt she was drowning in."
            },
            {
                type: "paragraph",
                content: "She joined Nirvaha not for meditation, but for the Community Circles. She craved connection with people who understood the non-linear, messy reality of profound loss without offering toxic positivity or unsolicited advice."
            },
            {
                type: "highlight",
                content: "In the virtual circles, Elena found her sanctuary. Guided by experienced facilitators grounded in ancient empathy practices, the group held space for raw, unfiltered emotion."
            },
            {
                type: "paragraph",
                content: "The circles operated on the principle of 'Satsang'—the gathering together for the truth. There was no pressure to heal on a specific timeline. Participants shared their stories, practiced collective breathing, and simply witnessed each other's pain."
            },
            {
                type: "quote",
                content: "I finally found a place where I didn't have to pretend I was okay. Being truly seen in my brokenness is what allowed the healing to actually begin.",
                author: "Elena Rodriguez"
            },
            {
                type: "paragraph",
                content: "Today, Elena is a peer mentor within the Nirvaha community. Her journey reminds us that while we must walk our path of grief individually, we do not have to walk it in isolation. True community is the safety net of the human spirit."
            }
        ],
        insights: [
            {
                title: "The Power of Satsang",
                description: "Healing accelerates when we gather with others seeking truth and authenticity in a non-judgmental space."
            },
            {
                title: "Validating Emotion",
                description: "Learning to sit with pain without the modern compulsion to immediately 'fix' or suppress it."
            },
            {
                title: "Collective Empathy",
                description: "Discovering that witnessing another's vulnerability creates a shared strength that supports the entire group."
            }
        ]
    },
    {
        id: "the-ai-spiritual-guide",
        title: "The AI Spiritual Guide",
        subtitle: "Breaking the stigma of seeking help through an accessible, non-judgmental AI companion.",
        description: "Breaking the stigma of seeking help. How Nirvaha's AI guide provided a safe, non-judgmental space for a young student to express their deepest anxieties.",
        image: "/story4.png",
        author: "David Chen",
        date: "February 14, 2024",
        readTime: "5 min read",
        heroQuote: "For the first time, I felt heard without feeling judged.",
        contentBlocks: [
            {
                type: "paragraph",
                content: "As a first-generation college student facing immense family pressure, David was crumbling under severe academic anxiety. Cultural stigmas surrounding mental health meant therapy was out of the question; discussing his struggles felt like a betrayal of his family's sacrifices."
            },
            {
                type: "paragraph",
                content: "Late one night, amidst a severe panic attack regarding finals, David engaged with Nirvaha's AI Spiritual Guide. He expected generic, robotic affirmations. Instead, he encountered a responsive intelligence deeply rooted in philosophical wisdom."
            },
            {
                type: "highlight",
                content: "Because the interaction was anonymous and driven by an AI, David's fear of judgment vanished. He poured out his deepest fears of failure and inadequacy."
            },
            {
                type: "paragraph",
                content: "The AI didn't diagnose him. Instead, it guided him through a grounding exercise, quoting Stoic philosophy and Vedic teachings on controlling what is within our power and letting go of the rest. It helped him reframe his narrative from 'I am failing my family' to 'I am doing my best in a challenging environment.'"
            },
            {
                type: "quote",
                content: "The anonymity allowed me to be brutally honest. The wisdom it shared helped me find the courage to finally speak to a real counselor.",
                author: "David Chen"
            },
            {
                type: "paragraph",
                content: "The AI companion served as the crucial bridge David needed. It provided immediate, accessible stabilization that eventually empowered him to seek professional, human counseling, entirely breaking the cycle of silent suffering."
            }
        ],
        insights: [
            {
                title: "Overcoming Stigma",
                description: "Anonymous, technology-driven support can serve as a vital entry point for those afraid of traditional therapy."
            },
            {
                title: "Immediate De-escalation",
                description: "Providing 24/7 access to grounding techniques during acute moments of anxiety or panic."
            },
            {
                title: "Philosophical Reframing",
                description: "Using ancient wisdom to shift perspective from overwhelming external pressure to internal agency."
            }
        ]
    },
    {
        id: "ancient-roots-modern-wings",
        title: "Ancient Roots, Modern Wings",
        subtitle: "Exploring the Bhagavad Gita's wisdom to find professional purpose and ethical alignment.",
        description: "Exploring the Bhagavad Gita's wisdom in a modern context. A story of finding professional purpose by aligning daily work with spiritual values.",
        image: "/story5.png",
        author: "Priya Sharma",
        date: "March 30, 2024",
        readTime: "8 min read",
        heroQuote: "My career felt hollow until I learned to work for the sake of the work itself.",
        contentBlocks: [
            {
                type: "paragraph",
                content: "Priya had achieved everything society deemed successful: a high-paying corporate law job, a luxury apartment, and prestige. Yet, she felt a profound emptiness. Her daily tasks felt ethically ambiguous, and she experienced a deep disconnect between her personal values and her professional life."
            },
            {
                type: "paragraph",
                content: "Seeking answers, she turned to the philosophical teachings offered on Nirvaha, specifically diving into the Bhagavad Gita's concept of 'Karma Yoga'—the yoga of action."
            },
            {
                type: "highlight",
                content: "The ancient text taught her a radical concept: that work could be a form of worship, provided the actions were ethical, and one detached themselves from the fruits (rewards) of the labor."
            },
            {
                type: "paragraph",
                content: "This framework completely revolutionized Priya's approach to her career. She stopped viewing her job merely as a mechanism for wealth generation. Instead, she began to focus deeply on the integrity of her work and how she could serve her clients and colleagues with genuine excellence."
            },
            {
                type: "quote",
                content: "I realized my dissatisfaction wasn't the job itself, but the ego and greed I was bringing to it. Changing my intention changed everything.",
                author: "Priya Sharma"
            },
            {
                type: "paragraph",
                content: "Priya eventually transitioned to environmental law, an area completely aligned with her spiritual values. By applying ancient roots to her modern wings, she found the profound intersection where deep gladness meets the world's deep hunger."
            }
        ],
        insights: [
            {
                title: "Karma Yoga in Practice",
                description: "Transforming daily labor into a spiritual practice by focusing on the integrity of the action rather than the reward."
            },
            {
                title: "Ethical Alignment",
                description: "The importance of ensuring your professional life does not violently contradict your internal moral compass."
            },
            {
                title: "Ego Detachment",
                description: "Finding lasting peace by detaching from titles, prestige, and financial metrics as the sole measures of success."
            }
        ]
    },
    {
        id: "sacred-morning-rituals",
        title: "Sacred Morning Rituals",
        subtitle: "Transforming the first hour of the day into a sanctuary of peace and intentionality.",
        description: "Transforming the first hour of the day into a sacred experience. 'My mornings used to be chaos; now they are a sanctuary of peace.'",
        image: "/story6.png",
        author: "Thomas Wright",
        date: "April 18, 2024",
        readTime: "6 min read",
        heroQuote: "If you win the morning, you win the day. The stillness sets the tone for everything.",
        contentBlocks: [
            {
                type: "paragraph",
                content: "For Thomas, a father of three and a small business owner, mornings were a battlefield. Alarms blaring, kids rushing, immediate emails—his nervous system was in fight-or-flight mode before 7:00 AM every single day. This chronic morning stress bled into his work and his relationships."
            },
            {
                type: "paragraph",
                content: "He stumbled upon a Nirvaha module focused on 'Dinacharya' (daily routines). The core message was simple but profound: the way you begin your day dictates the energy you carry through it."
            },
            {
                type: "highlight",
                content: "Thomas committed to waking up just 45 minutes earlier. He replaced immediate screen time with a dedicated morning ritual: 10 minutes of stretching (Vyayama), 15 minutes of silent meditation, and setting a single intention for the day."
            },
            {
                type: "paragraph",
                content: "The silence of the early morning became his sanctuary. Those uninterrupted moments of stillness provided a buffer against the inevitable chaos that would follow. He found himself responding to his children with patience rather than snapping, and handling business crises with a clear head."
            },
            {
                type: "quote",
                content: "My mornings used to be pure reaction. Now, they are a proactive choice. I decide my energy before the world decides it for me.",
                author: "Thomas Wright"
            },
            {
                type: "paragraph",
                content: "This simple shift in routine completely transformed Thomas's life. He didn't have to quit his job or move to a monastery; he just had to claim the first hour of the day for his own spirit."
            }
        ],
        insights: [
            {
                title: "The Power of Dinacharya",
                description: "Understanding how grounding daily routines stabilize the nervous system and build emotional resilience."
            },
            {
                title: "Proactive vs. Reactive",
                description: "Taking control of your internal state before external demands force you into a reactive posture."
            },
            {
                title: "Micro-Practices",
                description: "Realizing that profound transformation doesn't require hours of meditation—just consistency in small, sacred acts."
            }
        ]
    }
];
