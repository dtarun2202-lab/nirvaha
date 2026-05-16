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
        "title": "Mindfulness Meditation Certification",
        "desc": "An immersive journey designed to help you master mindfulness meditation certification and elevate your daily experience.",
        "feel": "Calm & Aligned",
        "image": "/CALM1.png",
        "bgColor": "bg-[#a3b19b]",
        "moods": [
            "Calm"
        ],
        "outcomes": [
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "5 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "6 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Priya Sharma",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "6 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Priya Sharma",
        "duration": "8 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Samuel Vance",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "4 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Priya Sharma",
        "duration": "9 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Marcus Thorne",
        "duration": "9 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "8 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
        "title": "Lifestyle Alignment Certification",
        "desc": "An immersive journey designed to help you master lifestyle alignment certification and elevate your daily experience.",
        "feel": "Balanced & Aligned",
        "image": "/balanced3.png",
        "bgColor": "bg-[#e0e7ff]",
        "moods": [
            "Balanced"
        ],
        "outcomes": [
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "11 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "8 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "6 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "11 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Marcus Thorne",
        "duration": "9 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Priya Sharma",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Samuel Vance",
        "duration": "4 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Priya Sharma",
        "duration": "9 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Marcus Thorne",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "11 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Samuel Vance",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Samuel Vance",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "8 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Samuel Vance",
        "duration": "11 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Samuel Vance",
        "duration": "8 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Priya Sharma",
        "duration": "6 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Samuel Vance",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Marcus Thorne",
        "duration": "11 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Marcus Thorne",
        "duration": "5 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Samuel Vance",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "8 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Priya Sharma",
        "duration": "5 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Marcus Thorne",
        "duration": "4 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Marcus Thorne",
        "duration": "4 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "5 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Marcus Thorne",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Alara Chen",
        "duration": "9 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "5 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "7 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Samuel Vance",
        "duration": "5 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Priya Sharma",
        "duration": "11 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Dr. Samuel Vance",
        "duration": "9 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Priya Sharma",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
            "Master the fundamental techniques to integrate this into your daily life.",
            "Understand the science and ancient philosophy behind the practice.",
            "Develop practical skills for immediate implementation.",
            "Build a sustainable personal routine for long-term growth."
        ],
        "instructor": "Elena Rodriguez",
        "duration": "10 Weeks",
        "level": "All Levels",
        "timeline": [
            {
                "title": "Module 1: Foundations",
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
