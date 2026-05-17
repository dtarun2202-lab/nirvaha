export interface PathwayTimelineStep {
    title: string;
    description: string;
}

export interface Pathway {
    id: string;
    title: string;
    desc: string;
    feel: string;
    image: string;
    bgColor: string;
    moods: string[];
    outcomes: string[];
    timeline: PathwayTimelineStep[];
    instructor: string;
    duration: string;
    level: string;
}

export const pathwaysData: Pathway[] = [
    {
        "id": "mindfulness-meditation-certification",
        "title": "Mindfulness Journey",
        "desc": "An immersive path designed to help you master mindfulness and elevate your daily experience.",
        "feel": "Calm & Aligned",
        "image": "/CALM1.png",
        "bgColor": "bg-[#a3b19b]",
        "moods": [
            "Calm"
        ],
        "outcomes": [
            "Achieve consistent present-moment awareness in high-stress environments.",
            "Deconstruct the mental narratives that fuel chronic anxiety.",
            "Cultivate a deep, non-judgmental relationship with your internal state.",
            "Establish a lifetime anchor for mental stability and emotional peace."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "5 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "breath-awareness-foundations",
        "title": "Breath Awareness Foundations",
        "desc": "An immersive journey designed to help you master breath awareness foundations and elevate your daily experience.",
        "feel": "Calm & Aligned",
        "image": "/CALM2.png",
        "bgColor": "bg-[#e0e7ff]",
        "moods": [
            "Calm"
        ],
        "outcomes": [
            "Unlock the full capacity of your respiratory system for vitality.",
            "Regulate your autonomic nervous system through conscious breathing.",
            "Master specialized techniques for instant focus and energy shifts.",
            "Use the breath as a bridge to deep meditative states."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "6 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "deep-relaxation-practices",
        "title": "Deep Relaxation Practices",
        "desc": "An immersive journey designed to help you master deep relaxation practices and elevate your daily experience.",
        "feel": "Calm & Aligned",
        "image": "/CALM3.png",
        "bgColor": "bg-[#f2f7ec]",
        "moods": [
            "Calm"
        ],
        "outcomes": [
            "Master the art of 'active rest' to recover from mental fatigue.",
            "Implement progressive relaxation to dissolve physical tension.",
            "Understand the biofeedback loops of deep cellular recovery.",
            "Create a sanctuary of stillness within your daily schedule."
        ],
        "instructor": "Priya Sharma",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "silent-reflection-journey",
        "title": "Silent Reflection Journey",
        "desc": "An immersive journey designed to help you master silent reflection journey and elevate your daily experience.",
        "feel": "Calm & Aligned",
        "image": "/CALM4.png",
        "bgColor": "bg-[#e0e7ff]",
        "moods": [
            "Calm"
        ],
        "outcomes": [
            "Cultivate the discipline of silence to amplify inner intuition.",
            "Navigate the internal landscape without external distractions.",
            "Develop a profound sense of self-reliance and mental independence.",
            "Listen to the subtle wisdom of the soul that noise drowns out."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "emotional-reset-program",
        "title": "Emotional Reset Program",
        "desc": "An immersive journey designed to help you master emotional reset program and elevate your daily experience.",
        "feel": "Calm & Aligned",
        "image": "/CALM5.png",
        "bgColor": "bg-[#f2f7ec]",
        "moods": [
            "Calm"
        ],
        "outcomes": [
            "Identify and neutralize emotional triggers before they escalate.",
            "Reset your emotional baseline after periods of intense stress.",
            "Cultivate emotional agility to navigate complex life changes.",
            "Build a resilient heart that processes rather than represses."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "6 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "sleep-nervous-system-balance",
        "title": "Sleep & Nervous System Balance",
        "desc": "An immersive journey designed to help you master sleep & nervous system balance and elevate your daily experience.",
        "feel": "Calm & Aligned",
        "image": "/CALM6.png",
        "bgColor": "bg-[#f2f7ec]",
        "moods": [
            "Calm"
        ],
        "outcomes": [
            "Optimize your circadian rhythm for natural, restorative sleep.",
            "Balance your nervous system to exit 'fight or flight' mode.",
            "Master evening rituals that signal safety and rest to the brain.",
            "Wake up with sustained energy and natural cognitive clarity."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "cognitive-clarity-training",
        "title": "Cognitive Clarity Training",
        "desc": "An immersive journey designed to help you master cognitive clarity training and elevate your daily experience.",
        "feel": "Focused & Aligned",
        "image": "/FOCUSED1.png",
        "bgColor": "bg-[#f2f7ec]",
        "moods": [
            "Focused"
        ],
        "outcomes": [
            "Dissolve mental fog to achieve razor-sharp cognitive focus.",
            "Optimize decision-making processes under high-pressure conditions.",
            "Increase your mental processing speed and information retention.",
            "Develop the clarity needed to see through complex life problems."
        ],
        "instructor": "Priya Sharma",
        "duration": "8 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "attention-mastery-program",
        "title": "Attention Mastery Program",
        "desc": "An immersive journey designed to help you master attention mastery program and elevate your daily experience.",
        "feel": "Focused & Aligned",
        "image": "/FOCUSED2.png",
        "bgColor": "bg-[#a3b19b]",
        "moods": [
            "Focused"
        ],
        "outcomes": [
            "Extend your focus span through neuroplasticity-based training.",
            "Master the 'Flow State' on demand for peak productivity.",
            "Minimize the cognitive cost of task-switching and distractions.",
            "Gain absolute command over where your attention resides."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "deep-work-discipline",
        "title": "Deep Work & Discipline",
        "desc": "An immersive journey designed to help you master deep work & discipline and elevate your daily experience.",
        "feel": "Focused & Aligned",
        "image": "/FOCUSED3.png",
        "bgColor": "bg-[#a3b19b]",
        "moods": [
            "Focused"
        ],
        "outcomes": [
            "Develop the mental stamina for 4+ hours of uninterrupted work.",
            "Build self-discipline that bypasses the need for motivation.",
            "Create an environment and mindset that repels distractions.",
            "Master the psychology of deep focus in a shallow world."
        ],
        "instructor": "Dr. Samuel Vance",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "mental-performance-optimization",
        "title": "Mental Performance Optimization",
        "desc": "An immersive journey designed to help you master mental performance optimization and elevate your daily experience.",
        "feel": "Focused & Aligned",
        "image": "/FOCUSED4.png",
        "bgColor": "bg-[#e0e7ff]",
        "moods": [
            "Focused"
        ],
        "outcomes": [
            "Harness the neurobiology of peak mental performance.",
            "Optimize your brain chemistry through lifestyle and mindset.",
            "Eliminate cognitive waste and energy leaks in your routine.",
            "Achieve a state of 'effortless high-performance' daily."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "productivity-without-burnout",
        "title": "Productivity Without Burnout",
        "desc": "An immersive journey designed to help you master productivity without burnout and elevate your daily experience.",
        "feel": "Focused & Aligned",
        "image": "/FOCUSED5.png",
        "bgColor": "bg-[#a5b4fc]",
        "moods": [
            "Focused"
        ],
        "outcomes": [
            "Establish a high-output routine that protects your mental energy.",
            "Identify and dismantle the early warning signs of chronic burnout.",
            "Master the art of 'active recovery' to sustain long-term performance.",
            "Align your professional goals with your personal well-being."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "4 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "focus-restoration-techniques",
        "title": "Focus Restoration Techniques",
        "desc": "An immersive journey designed to help you master focus restoration techniques and elevate your daily experience.",
        "feel": "Focused & Aligned",
        "image": "/FOCUSED6.png",
        "bgColor": "bg-[#e0e7ff]",
        "moods": [
            "Focused"
        ],
        "outcomes": [
            "Master Attention Restoration Theory (ART) to recover from focus fatigue.",
            "Implement digital boundaries that protect your cognitive space.",
            "Use sensory-based techniques to ground your focus instantly.",
            "Build a lifestyle that naturally fosters deep concentration."
        ],
        "instructor": "Priya Sharma",
        "duration": "9 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "holistic-wellness-coach",
        "title": "Holistic Wellness Coach",
        "desc": "An immersive journey designed to help you master holistic wellness coach and elevate your daily experience.",
        "feel": "Balanced & Aligned",
        "image": "/balanced1.png",
        "bgColor": "bg-[#a5b4fc]",
        "moods": [
            "Balanced"
        ],
        "outcomes": [
            "Design a holistic lifestyle that supports mental and physical vitality.",
            "Integrate movement, nutrition, and mindset into a unified practice.",
            "Develop the skills to guide others toward their wellness potential.",
            "Master the bio-psychosocial model of personal health."
        ],
        "instructor": "Marcus Thorne",
        "duration": "9 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "mind-body-harmony-program",
        "title": "Mind-Body Harmony Program",
        "desc": "An immersive journey designed to help you master mind-body harmony program and elevate your daily experience.",
        "feel": "Balanced & Aligned",
        "image": "/balanced2.png",
        "bgColor": "bg-[#fecdd3]",
        "moods": [
            "Balanced"
        ],
        "outcomes": [
            "Synchronize your physical sensations with your mental state.",
            "Master somatic techniques to release stored stress and tension.",
            "Develop a deep intuitive sense of your body's needs.",
            "Achieve a state of total alignment between mind and form."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "8 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "lifestyle-alignment-certification",
        "title": "Lifestyle Alignment Journey",
        "desc": "An immersive path designed to help you master lifestyle alignment and elevate your daily experience.",
        "feel": "Balanced & Aligned",
        "image": "/balanced3.png",
        "bgColor": "bg-[#e0e7ff]",
        "moods": [
            "Balanced"
        ],
        "outcomes": [
            "Architect your daily habits to reflect your highest values.",
            "Design your environment to make healthy choices effortless.",
            "Master the psychology of long-term behavioral change.",
            "Achieve a life that feels authentic, intentional, and aligned."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "11 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "emotional-stability-framework",
        "title": "Emotional Stability Framework",
        "desc": "An immersive journey designed to help you master emotional stability framework and elevate your daily experience.",
        "feel": "Balanced & Aligned",
        "image": "/balanced4.png",
        "bgColor": "bg-[#a3b19b]",
        "moods": [
            "Balanced"
        ],
        "outcomes": [
            "Develop a robust toolkit for managing intense emotional states.",
            "Master distress tolerance techniques for life's difficult moments.",
            "Build psychological flexibility to adapt to internal and external stress.",
            "Establish a core sense of stability that isn't shaken by external events."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "energy-balance-training",
        "title": "Energy Balance Training",
        "desc": "An immersive journey designed to help you master energy balance training and elevate your daily experience.",
        "feel": "Balanced & Aligned",
        "image": "/balanced5.png",
        "bgColor": "bg-[#f2f7ec]",
        "moods": [
            "Balanced"
        ],
        "outcomes": [
            "Identify and eliminate the 'energy leaks' in your mental routine.",
            "Master bioenergetic practices for sustained daily vitality.",
            "Balance your output with deep, restorative energy management.",
            "Achieve a consistent state of high-vibrancy living."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "8 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "daily-rhythm-optimization",
        "title": "Daily Rhythm Optimization",
        "desc": "An immersive journey designed to help you master daily rhythm optimization and elevate your daily experience.",
        "feel": "Balanced & Aligned",
        "image": "/balanced6.png",
        "bgColor": "bg-[#a3b19b]",
        "moods": [
            "Balanced"
        ],
        "outcomes": [
            "Align your schedule with your natural circadian and ultradian rhythms.",
            "Master the science of morning and evening ritual architecture.",
            "Design a daily flow that maximizes focus and minimizes friction.",
            "Live in sync with your body's internal clock for peak health."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "6 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "conscious-communication-mastery",
        "title": "Conscious Communication Mastery",
        "desc": "An immersive journey designed to help you master conscious communication mastery and elevate your daily experience.",
        "feel": "Connected & Aligned",
        "image": "/connected1.png",
        "bgColor": "bg-[#fbbf24]",
        "moods": [
            "Connected"
        ],
        "outcomes": [
            "Master Non-Violent Communication (NVC) for authentic expression.",
            "Navigate difficult conversations with grace and clarity.",
            "Develop the ability to listen with full presence and empathy.",
            "Build relationships based on radical honesty and mutual respect."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "11 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "relationship-awareness-program",
        "title": "Relationship Awareness Program",
        "desc": "An immersive journey designed to help you master relationship awareness program and elevate your daily experience.",
        "feel": "Connected & Aligned",
        "image": "/connected2.png",
        "bgColor": "bg-[#fecdd3]",
        "moods": [
            "Connected"
        ],
        "outcomes": [
            "Understand your attachment style and how it shapes your connections.",
            "Establish healthy boundaries that foster intimacy and safety.",
            "Master the tools for deep interpersonal connection and growth.",
            "Build a more conscious, loving relationship with yourself and others."
        ],
        "instructor": "Marcus Thorne",
        "duration": "9 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "empathy-listening-skills",
        "title": "Empathy & Listening Skills",
        "desc": "An immersive journey designed to help you master empathy & listening skills and elevate your daily experience.",
        "feel": "Connected & Aligned",
        "image": "/connected3.png",
        "bgColor": "bg-[#a5b4fc]",
        "moods": [
            "Connected"
        ],
        "outcomes": [
            "Master the art of 'holding space' for others through deep listening.",
            "Develop the empathic resonance needed for true connection.",
            "Validate others' experiences without losing your own perspective.",
            "Use the heart as your primary tool for understanding the world."
        ],
        "instructor": "Priya Sharma",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "human-connection-dynamics",
        "title": "Human Connection Dynamics",
        "desc": "An immersive journey designed to help you master human connection dynamics and elevate your daily experience.",
        "feel": "Connected & Aligned",
        "image": "/connected4.png",
        "bgColor": "bg-[#a3b19b]",
        "moods": [
            "Connected"
        ],
        "outcomes": [
            "Master the psychology of social intelligence and tribal connection.",
            "Navigate complex social dynamics with ease and authenticity.",
            "Develop the vulnerability needed to build lasting human bonds.",
            "Understand the hidden currents that drive human interaction."
        ],
        "instructor": "Dr. Samuel Vance",
        "duration": "4 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "compassionate-leadership",
        "title": "Compassionate Leadership",
        "desc": "An immersive journey designed to help you master compassionate leadership and elevate your daily experience.",
        "feel": "Connected & Aligned",
        "image": "/connected5.png",
        "bgColor": "bg-[#fecdd3]",
        "moods": [
            "Connected"
        ],
        "outcomes": [
            "Lead with empathy to create high-trust, high-performance cultures.",
            "Master the art of servant leadership for meaningful impact.",
            "Build psychological safety within groups and organizations.",
            "Inspire others through compassionate and authentic presence."
        ],
        "instructor": "Priya Sharma",
        "duration": "9 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "group-healing-facilitation",
        "title": "Group Healing Facilitation",
        "desc": "An immersive journey designed to help you master group healing facilitation and elevate your daily experience.",
        "feel": "Connected & Aligned",
        "image": "/connected6.png",
        "bgColor": "bg-[#e0e7ff]",
        "moods": [
            "Connected"
        ],
        "outcomes": [
            "Master the skills needed to facilitate collective healing and growth.",
            "Hold safe and sacred space for diverse groups of people.",
            "Understand the dynamics of group resonance and collective flow.",
            "Guide communities through transformative shared experiences."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "self-worth-rebuilding-program",
        "title": "Self-Worth Rebuilding Program",
        "desc": "An immersive journey designed to help you master self-worth rebuilding program and elevate your daily experience.",
        "feel": "Confident & Aligned",
        "image": "/confident1.png",
        "bgColor": "bg-[#fbbf24]",
        "moods": [
            "Confident"
        ],
        "outcomes": [
            "Identify and dismantle the core beliefs that limit your self-worth.",
            "Cultivate radical self-acceptance and compassionate self-talk.",
            "Overcome imposter syndrome through authentic self-recognition.",
            "Build an unshakeable foundation of inner value and confidence."
        ],
        "instructor": "Marcus Thorne",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "public-presence-expression",
        "title": "Public Presence & Expression",
        "desc": "An immersive journey designed to help you master public presence & expression and elevate your daily experience.",
        "feel": "Confident & Aligned",
        "image": "/confident2.png",
        "bgColor": "bg-[#a5b4fc]",
        "moods": [
            "Confident"
        ],
        "outcomes": [
            "Master the art of authentic presence and public expression.",
            "Overcome stage fright by grounding your voice in your truth.",
            "Develop the impactful communication skills needed for leadership.",
            "Express your ideas with clarity, passion, and unshakeable confidence."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "11 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "emotional-resilience-certification",
        "title": "Emotional Resilience Certification",
        "desc": "An immersive journey designed to help you master emotional resilience certification and elevate your daily experience.",
        "feel": "Confident & Aligned",
        "image": "/confident3.png",
        "bgColor": "bg-[#a5b4fc]",
        "moods": [
            "Confident"
        ],
        "outcomes": [
            "Build the mental toughness needed to bounce back from any setback.",
            "Master adversity training to find strength in life's challenges.",
            "Cultivate an optimistic and proactive mindset during crisis.",
            "Develop a resilient heart that thrives under pressure."
        ],
        "instructor": "Dr. Samuel Vance",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "fearless-communication-training",
        "title": "Fearless Communication Training",
        "desc": "An immersive journey designed to help you master fearless communication training and elevate your daily experience.",
        "feel": "Confident & Aligned",
        "image": "/confident4.png",
        "bgColor": "bg-[#fbbf24]",
        "moods": [
            "Confident"
        ],
        "outcomes": [
            "Navigate the most difficult conversations with total fearlessness.",
            "Master assertive speaking without losing your compassionate edge.",
            "Practice radical honesty to build high-trust connections.",
            "Empower your voice to speak your truth in any situation."
        ],
        "instructor": "Dr. Samuel Vance",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "inner-strength-development",
        "title": "Inner Strength Development",
        "desc": "An immersive journey designed to help you master inner strength development and elevate your daily experience.",
        "feel": "Confident & Aligned",
        "image": "/confident5.png",
        "bgColor": "bg-[#a3b19b]",
        "moods": [
            "Confident"
        ],
        "outcomes": [
            "Develop an inner core of strength that isn't dependent on external validation.",
            "Master the resilience training needed for long-term emotional stability.",
            "Align your inner world with a deep sense of purpose and mission.",
            "Build the mental fortitude to lead yourself and others with integrity."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "8 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "personal-identity-alignment",
        "title": "Personal Identity Alignment",
        "desc": "An immersive journey designed to help you master personal identity alignment and elevate your daily experience.",
        "feel": "Confident & Aligned",
        "image": "/confident6.png",
        "bgColor": "bg-[#f2f7ec]",
        "moods": [
            "Confident"
        ],
        "outcomes": [
            "Deconstruct the social masks that hide your authentic self.",
            "Align your daily actions with your core identity and values.",
            "Master the art of 'Identity Shifting' for personal transformation.",
            "Live with a profound sense of self-congruence and integrity."
        ],
        "instructor": "Dr. Samuel Vance",
        "duration": "11 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "ancient-wisdom-integration",
        "title": "Ancient Wisdom Integration",
        "desc": "An immersive journey designed to help you master ancient wisdom integration and elevate your daily experience.",
        "feel": "Grounded & Aligned",
        "image": "/ground1.png",
        "bgColor": "bg-[#fecdd3]",
        "moods": [
            "Grounded"
        ],
        "outcomes": [
            "Integrate the core tenets of Stoicism and Taoism into modern life.",
            "Apply Vedic principles to achieve mental and emotional balance.",
            "Understand the perennial truths that have guided humanity for millennia.",
            "Bridge the gap between ancient ritual and contemporary reality."
        ],
        "instructor": "Dr. Samuel Vance",
        "duration": "8 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "nature-based-reflection-practices",
        "title": "Nature-Based Reflection Practices",
        "desc": "An immersive journey designed to help you master nature-based reflection practices and elevate your daily experience.",
        "feel": "Grounded & Aligned",
        "image": "/ground2.png",
        "bgColor": "bg-[#fbbf24]",
        "moods": [
            "Grounded"
        ],
        "outcomes": [
            "Harness the psychological benefits of 'Biophilia' and nature immersion.",
            "Practice advanced reflection techniques in natural environments.",
            "Align your personal energy with the seasonal and lunar cycles.",
            "Develop a deep, restorative connection with the living world."
        ],
        "instructor": "Priya Sharma",
        "duration": "6 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "rooted-living-certification",
        "title": "Rooted Living Certification",
        "desc": "An immersive journey designed to help you master rooted living certification and elevate your daily experience.",
        "feel": "Grounded & Aligned",
        "image": "/ground3.png",
        "bgColor": "bg-[#a3b19b]",
        "moods": [
            "Grounded"
        ],
        "outcomes": [
            "Create a life foundation that provides absolute emotional stability.",
            "Design your home and lifestyle as a sanctuary for the soul.",
            "Connect with your lineage and 'roots' to find personal strength.",
            "Master the art of grounded, sustainable, and intentional living."
        ],
        "instructor": "Dr. Samuel Vance",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "stillness-stability-training",
        "title": "Stillness & Stability Training",
        "desc": "An immersive journey designed to help you master stillness & stability training and elevate your daily experience.",
        "feel": "Grounded & Aligned",
        "image": "/ground4.png",
        "bgColor": "bg-[#f2f7ec]",
        "moods": [
            "Grounded"
        ],
        "outcomes": [
            "Cultivate 'The Eye of the Storm'—perfect peace amidst chaos.",
            "Master physical stillness to mirror and influence mental stability.",
            "Develop the equanimity needed to handle life's extreme highs and lows.",
            "Establish a core of stability that is unshakeable by external events."
        ],
        "instructor": "Marcus Thorne",
        "duration": "11 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "stress-recovery-systems",
        "title": "Stress Recovery Systems",
        "desc": "An immersive journey designed to help you master stress recovery systems and elevate your daily experience.",
        "feel": "Grounded & Aligned",
        "image": "/ground5.png",
        "bgColor": "bg-[#fecdd3]",
        "moods": [
            "Grounded"
        ],
        "outcomes": [
            "Master the biological protocols for clearing chronic cortisol.",
            "Implement a 'Stress-Recovery Cycle' into your daily workflow.",
            "Use somatic release techniques to clear physical stress memory.",
            "Achieve a state of high-resilience and rapid mental recovery."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "conscious-breathing-journey",
        "title": "Conscious Breathing Journey",
        "desc": "An immersive journey designed to help you master conscious breathing journey and elevate your daily experience.",
        "feel": "Grounded & Aligned",
        "image": "/ground6.png",
        "bgColor": "bg-[#e0e7ff]",
        "moods": [
            "Grounded"
        ],
        "outcomes": [
            "Master advanced Pranayama for energy movement and focus.",
            "Use the breath as a direct dial to your state of consciousness.",
            "Navigate your internal landscape through breath-based inquiry.",
            "Achieve a state of physiological and energetic mastery."
        ],
        "instructor": "Marcus Thorne",
        "duration": "5 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "creative-awareness-program",
        "title": "Creative Awareness Program",
        "desc": "An immersive journey designed to help you master creative awareness program and elevate your daily experience.",
        "feel": "Inspired & Aligned",
        "image": "/inspired1.png",
        "bgColor": "bg-[#fecdd3]",
        "moods": [
            "Inspired"
        ],
        "outcomes": [
            "Unlock your natural creative flow by removing mental barriers.",
            "Master divergent thinking techniques for innovative problem solving.",
            "Use mindfulness to access the deeper layers of your creative soul.",
            "Turn self-awareness into a primary source of creative inspiration."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "purpose-discovery-pathway",
        "title": "Purpose Discovery Pathway",
        "desc": "An immersive journey designed to help you master purpose discovery pathway and elevate your daily experience.",
        "feel": "Inspired & Aligned",
        "image": "/inspired2.png",
        "bgColor": "bg-[#a3b19b]",
        "moods": [
            "Inspired"
        ],
        "outcomes": [
            "Identify your 'Ikigai'—the intersection of passion, skill, and need.",
            "Map out your life's purpose through deep, guided self-inquiry.",
            "Align your daily mission with your long-term soul's purpose.",
            "Gain absolute clarity on the impact you are meant to make."
        ],
        "instructor": "Dr. Samuel Vance",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "vision-meaning-workshop",
        "title": "Vision & Meaning Workshop",
        "desc": "An immersive journey designed to help you master vision & meaning workshop and elevate your daily experience.",
        "feel": "Inspired & Aligned",
        "image": "/inspired3.png",
        "bgColor": "bg-[#fecdd3]",
        "moods": [
            "Inspired"
        ],
        "outcomes": [
            "Craft a compelling vision for your life's legacy and impact.",
            "Find deep meaning in your current circumstances and challenges.",
            "Use symbolic meaning to enrich your daily experiences.",
            "Build a life that is defined by significance rather than success."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "reflective-creativity-training",
        "title": "Reflective Creativity Training",
        "desc": "An immersive journey designed to help you master reflective creativity training and elevate your daily experience.",
        "feel": "Inspired & Aligned",
        "image": "/inspired4.png",
        "bgColor": "bg-[#a3b19b]",
        "moods": [
            "Inspired"
        ],
        "outcomes": [
            "Merge introspective practices with your creative expression.",
            "Learn to 'listen' to your creative intuition with full presence.",
            "Develop a reflective workflow that prevents creative burnout.",
            "Express the subtle layers of your soul through your unique craft."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "8 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "inspired-living-certification",
        "title": "Inspired Living Certification",
        "desc": "An immersive journey designed to help you master inspired living certification and elevate your daily experience.",
        "feel": "Inspired & Aligned",
        "image": "/inspired5.png",
        "bgColor": "bg-[#fbbf24]",
        "moods": [
            "Inspired"
        ],
        "outcomes": [
            "Master the daily rituals that maintain a high-vibrancy state.",
            "Cultivate consistent inspiration that isn't dependent on mood.",
            "Build a life that serves as a source of light for others.",
            "Achieve a state of soulful living that celebrates every moment."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "personal-growth-accelerator",
        "title": "Personal Growth Accelerator",
        "desc": "An immersive journey designed to help you master personal growth accelerator and elevate your daily experience.",
        "feel": "Inspired & Aligned",
        "image": "/inspired6.png",
        "bgColor": "bg-[#f2f7ec]",
        "moods": [
            "Inspired"
        ],
        "outcomes": [
            "Leverage neuroplasticity for rapid personal and professional growth.",
            "Master high-speed learning and skill acquisition techniques.",
            "Implement habit stacking for compound personal improvement.",
            "Achieve quantum shifts in your mindset and capabilities."
        ],
        "instructor": "Priya Sharma",
        "duration": "5 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "positive-energy-cultivation",
        "title": "Positive Energy Cultivation",
        "desc": "An immersive journey designed to help you master positive energy cultivation and elevate your daily experience.",
        "feel": "Uplifted & Aligned",
        "image": "/up1.png",
        "bgColor": "bg-[#fbbf24]",
        "moods": [
            "Uplifted"
        ],
        "outcomes": [
            "Cultivate joy as a deliberate skill rather than a random emotion.",
            "Master the science of positive affect and emotional radiance.",
            "Elevate your energetic frequency through targeted mental shifts.",
            "Develop a presence that naturally uplifts everyone around you."
        ],
        "instructor": "Marcus Thorne",
        "duration": "4 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "joy-gratitude-practices",
        "title": "Joy & Gratitude Practices",
        "desc": "An immersive journey designed to help you master joy & gratitude practices and elevate your daily experience.",
        "feel": "Uplifted & Aligned",
        "image": "/up2.png",
        "bgColor": "bg-[#fecdd3]",
        "moods": [
            "Uplifted"
        ],
        "outcomes": [
            "Rewire your brain for happiness through radical gratitude.",
            "Master the art of 'Savoring' to extract more joy from life.",
            "Identify and dismantle the 'negativity bias' in your perception.",
            "Establish a permanent state of deep appreciation for existence."
        ],
        "instructor": "Marcus Thorne",
        "duration": "4 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "emotional-renewal-journey",
        "title": "Emotional Renewal Journey",
        "desc": "An immersive journey designed to help you master emotional renewal journey and elevate your daily experience.",
        "feel": "Uplifted & Aligned",
        "image": "/up3.png",
        "bgColor": "bg-[#a5b4fc]",
        "moods": [
            "Uplifted"
        ],
        "outcomes": [
            "Clear past emotional baggage to create space for new growth.",
            "Master the protocols for deep emotional heart-healing.",
            "Emerge from life's challenges with a fresh, renewed perspective.",
            "Achieve a state of emotional purity and radiant optimism."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "5 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "inner-light-activation",
        "title": "Inner Light Activation",
        "desc": "An immersive journey designed to help you master inner light activation and elevate your daily experience.",
        "feel": "Uplifted & Aligned",
        "image": "/up4.png",
        "bgColor": "bg-[#f2f7ec]",
        "moods": [
            "Uplifted"
        ],
        "outcomes": [
            "Identify and amplify your unique 'Inner Light' and vitality.",
            "Master spiritual-emotional practices that radiate from within.",
            "Align your internal spark with your external daily actions.",
            "Live as a beacon of positivity and clarity in a complex world."
        ],
        "instructor": "Marcus Thorne",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "happiness-psychology-basics",
        "title": "Happiness Psychology Basics",
        "desc": "An immersive journey designed to help you master happiness psychology basics and elevate your daily experience.",
        "feel": "Uplifted & Aligned",
        "image": "/up5.png",
        "bgColor": "bg-[#a5b4fc]",
        "moods": [
            "Uplifted"
        ],
        "outcomes": [
            "Master the core frameworks of Positive Psychology.",
            "Differentiate between hedonic pleasure and eudaimonic well-being.",
            "Implement science-backed strategies for lasting life satisfaction.",
            "Understand the psychological architecture of a happy life."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "9 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "mindset-elevation-program",
        "title": "Mindset Elevation Program",
        "desc": "An immersive journey designed to help you master mindset elevation program and elevate your daily experience.",
        "feel": "Uplifted & Aligned",
        "image": "/up6.png",
        "bgColor": "bg-[#a3b19b]",
        "moods": [
            "Uplifted"
        ],
        "outcomes": [
            "Overcome the limiting narratives that hold back your potential.",
            "Master a Growth Mindset that sees every challenge as fuel.",
            "Elevate your mental perspective to see new levels of possibility.",
            "Adopt the empowering beliefs of high-performing, happy individuals."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "5 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "emotional-intelligence-mastery",
        "title": "Emotional Intelligence Mastery",
        "desc": "An immersive journey designed to help you master emotional intelligence mastery and elevate your daily experience.",
        "feel": "Aware & Aligned",
        "image": "/aware1.png",
        "bgColor": "bg-[#fbbf24]",
        "moods": [
            "Aware"
        ],
        "outcomes": [
            "Master the core components of high Emotional Intelligence (EQ).",
            "Develop the self-regulation needed to handle complex social situations.",
            "Cultivate deep empathy and social awareness in your daily interactions.",
            "Master the art of emotional literacy and authentic expression."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "self-awareness-deep-dive",
        "title": "Self-Awareness Deep Dive",
        "desc": "An immersive journey designed to help you master self-awareness deep dive and elevate your daily experience.",
        "feel": "Aware & Aligned",
        "image": "/aware2.png",
        "bgColor": "bg-[#f2f7ec]",
        "moods": [
            "Aware"
        ],
        "outcomes": [
            "Identify and integrate your psychological 'Shadow' and blind spots.",
            "Master the art of radical self-honesty and introspective inquiry.",
            "Understand the hidden patterns that drive your behavior and reactions.",
            "Achieve a state of profound and unshakeable self-knowledge."
        ],
        "instructor": "Dr. Samuel Vance",
        "duration": "5 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "reflective-thinking-framework",
        "title": "Reflective Thinking Framework",
        "desc": "An immersive journey designed to help you master reflective thinking framework and elevate your daily experience.",
        "feel": "Aware & Aligned",
        "image": "/aware3.png",
        "bgColor": "bg-[#f2f7ec]",
        "moods": [
            "Aware"
        ],
        "outcomes": [
            "Master the frameworks of critical and meta-cognitive reflection.",
            "Identify and neutralize cognitive biases in your thinking process.",
            "Develop the ability to observe your thoughts with objective clarity.",
            "Build a mental framework for wisdom-based problem solving."
        ],
        "instructor": "Priya Sharma",
        "duration": "11 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "conscious-decision-making",
        "title": "Conscious Decision-Making",
        "desc": "An immersive journey designed to help you master conscious decision-making and elevate your daily experience.",
        "feel": "Aware & Aligned",
        "image": "/aware4.png",
        "bgColor": "bg-[#f2f7ec]",
        "moods": [
            "Aware"
        ],
        "outcomes": [
            "Balance intuitive wisdom with analytical reasoning for better choices.",
            "Make decisions that are perfectly aligned with your core values.",
            "Identify and avoid impulsive or fear-based decision patterns.",
            "Achieve total clarity and confidence in your life's major choices."
        ],
        "instructor": "Dr. Samuel Vance",
        "duration": "9 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "awareness-presence-certification",
        "title": "Awareness & Presence Certification",
        "desc": "An immersive journey designed to help you master awareness & presence certification and elevate your daily experience.",
        "feel": "Aware & Aligned",
        "image": "/aware5.png",
        "bgColor": "bg-[#a3b19b]",
        "moods": [
            "Aware"
        ],
        "outcomes": [
            "Master advanced mindfulness and non-dual awareness practices.",
            "Achieve a state of consistent presence in every area of life.",
            "Deconstruct the barriers between 'self' and 'experience'.",
            "Establish a permanent anchor in the peace of the present moment."
        ],
        "instructor": "Priya Sharma",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    },
    {
        "id": "human-behavior-understanding-program",
        "title": "Human Behavior Understanding Program",
        "desc": "An immersive journey designed to help you master human behavior understanding program and elevate your daily experience.",
        "feel": "Aware & Aligned",
        "image": "/aware6.png",
        "bgColor": "bg-[#e0e7ff]",
        "moods": [
            "Aware"
        ],
        "outcomes": [
            "Understand the psychological currents that drive human behavior.",
            "Identify and anticipate behavioral patterns in yourself and others.",
            "Develop a compassionate and objective perspective on human interaction.",
            "Master the social intelligence needed to lead and connect effectively."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Chapter 1: Foundations",
                "description": "Exploring the core concepts and establishing a baseline."
            },
            {
                "title": "Reflection Practice",
                "description": "Guided journaling and introspective exercises."
            },
            {
                "title": "Guided Session",
                "description": "Immersive audio/video guided experience."
            },
            {
                "title": "Applied Exercises",
                "description": "Integrating the practice into your real-world scenarios."
            },
            {
                "title": "Final Integration",
                "description": "Review and establishing long-term habits."
            }
        ]
    }
];
