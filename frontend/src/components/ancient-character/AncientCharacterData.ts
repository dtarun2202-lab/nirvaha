export type CharacterId = 'rama' | 'krishna' | 'hanuman' | 'arjuna' | 'sita' | 'karna';

export interface Archetype {
    id: CharacterId;
    name: string;
    label: string;
    description: string;
    qualities: string[];
    growth: string[];
    colors: {
        primary: string;
        secondary: string;
        gradient: string;
    };
    image?: string;
}

export const ARCHETYPES: Record<CharacterId, Archetype> = {
    rama: {
        id: 'rama',
        name: 'Rama',
        label: 'The Righteous Leader',
        description: 'You carry a strong sense of duty and maintain composure even in the most challenging situations. Your choices are guided by deeply held principles and a responsibility to others.',
        qualities: ['Disciplined', 'Responsible', 'Composed', 'Duty-led', 'Steady'],
        growth: ['Allow yourself to ask for help', 'Balance duty with personal joy', 'Accept imperfection in others'],
        colors: {
            primary: '#D4AF37', // Deep gold
            secondary: '#B8860B',
            gradient: 'from-[#D4AF37] to-[#B8860B]'
        },
        image: '/ram.jpg'
    },
    krishna: {
        id: 'krishna',
        name: 'Krishna',
        label: 'The Wise Strategist',
        description: 'You possess a calm, analytical mind capable of seeing the bigger picture. You navigate life with emotional intelligence, adaptability, and a profound understanding of human nature.',
        qualities: ['Wise', 'Strategic', 'Emotionally intelligent', 'Adaptive', 'Insightful'],
        growth: ['Ensure your strategies align with empathy', 'Avoid over-analyzing simple moments', 'Share your wisdom without overwhelming'],
        colors: {
            primary: '#1E3A8A', // Deep blue
            secondary: '#312E81', // Indigo
            gradient: 'from-[#1E3A8A] to-[#312E81]'
        },
        image: '/human krishna.png'
    },
    hanuman: {
        id: 'hanuman',
        name: 'Hanuman',
        label: 'The Devoted Warrior',
        description: 'You are marked by immense inner strength and unwavering loyalty. You find purpose in service and tackle obstacles with a courageous, humble spirit.',
        qualities: ['Courageous', 'Devoted', 'Humble', 'Strong', 'Service-oriented'],
        growth: ['Recognize your own needs', 'Practice stillness alongside action', 'Channel your immense energy carefully'],
        colors: {
            primary: '#EA580C', // Deep orange
            secondary: '#C2410C', // Saffron
            gradient: 'from-[#EA580C] to-[#C2410C]'
        },
        image: '/hanuman.jpg'
    },
    arjuna: {
        id: 'arjuna',
        name: 'Arjuna',
        label: 'The Focused Achiever',
        description: 'You are driven by a deep desire for excellence and growth. Highly skilled and ambitious, you focus intensely on your goals but also possess the capacity for deep self-reflection.',
        qualities: ['Focused', 'Ambitious', 'Skilled', 'Disciplined', 'Growth-driven'],
        growth: ['Don’t let ambition overshadow connection', 'Embrace doubt as part of learning', 'Find peace in the present moment'],
        colors: {
            primary: '#059669', // Forest green
            secondary: '#047857', // Emerald
            gradient: 'from-[#059669] to-[#047857]'
        },
        image: '/arjuna.jpg'
    },
    sita: {
        id: 'sita',
        name: 'Sita',
        label: 'The Resilient Soul',
        description: 'You hold a quiet, unshakeable power within. Graceful under pressure and emotionally profound, your resilience comes from a pure intention and an enduring spirit.',
        qualities: ['Graceful', 'Resilient', 'Emotionally strong', 'Pure in intention', 'Quietly powerful'],
        growth: ['Set firm boundaries', 'Speak your needs loudly', 'Acknowledge your own strength openly'],
        colors: {
            primary: '#BE123C', // Rose gold / soft crimson
            secondary: '#9F1239',
            gradient: 'from-[#BE123C] to-[#9F1239]'
        },
        image: '/sita.jpg'
    },
    karna: {
        id: 'karna',
        name: 'Karna',
        label: 'The Loyal Warrior',
        description: 'You possess a dignified, proud spirit marked by extraordinary generosity and fierce loyalty. You persevere through unfair circumstances with unmatched inner resolve.',
        qualities: ['Loyal', 'Generous', 'Persevering', 'Dignified', 'Proud'],
        growth: ['Learn to let go of past grievances', 'Ensure your loyalty is placed wisely', 'Allow yourself to be vulnerable'],
        colors: {
            primary: '#B45309', // Bronze
            secondary: '#92400E', // Copper
            gradient: 'from-[#B45309] to-[#92400E]'
        },
        image: '/karna.jpg'
    }
};

export interface QuizOption {
    text: string;
    points: Partial<Record<CharacterId, number>>;
}

export interface QuizQuestion {
    id: string;
    text: string;
    options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        id: 'pressure',
        text: 'When responsibility becomes heavy, what feels most natural?',
        options: [
            { text: 'I embrace it entirely; it is my duty to hold things together.', points: { rama: 3, sita: 1 } },
            { text: 'I analyze the burden and find a smarter way to distribute the weight.', points: { krishna: 3, arjuna: 1 } },
            { text: 'I focus completely on the task, blocking out the noise until it is done.', points: { arjuna: 3, hanuman: 1 } },
            { text: 'I endure it quietly, drawing on my inner emotional reserves.', points: { sita: 3, karna: 1 } }
        ]
    },
    {
        id: 'conflict',
        text: 'When conflict appears, how do you usually respond?',
        options: [
            { text: 'I step up to resolve it fairly, ensuring rules and respect are maintained.', points: { rama: 3, karna: 1 } },
            { text: 'I look for the deeper motivations at play and strategize an optimal outcome.', points: { krishna: 3, sita: 1 } },
            { text: 'I confront it directly and fiercely if it threatens those I care about.', points: { hanuman: 3, karna: 2 } },
            { text: 'I assess my own capability to handle it and prepare myself to win the argument.', points: { arjuna: 3, krishna: 1 } }
        ]
    },
    {
        id: 'strength',
        text: 'What kind of strength do you value most?',
        options: [
            { text: 'The strength to remain pure and unbroken despite immense hardship.', points: { sita: 3, rama: 1 } },
            { text: 'The strength of an adaptive mind that can out-think any problem.', points: { krishna: 3, arjuna: 1 } },
            { text: 'The strength to stay loyal to your word, even when it costs you heavily.', points: { karna: 3, hanuman: 1 } },
            { text: 'The strength of discipline, mastering a skill until you are the best at it.', points: { arjuna: 3, rama: 1 } }
        ]
    },
    {
        id: 'loyalty',
        text: 'How do you define true loyalty?',
        options: [
            { text: 'Standing by someone because they supported you when no one else did.', points: { karna: 3, hanuman: 1 } },
            { text: 'Dedicating your entire being to a cause or person greater than yourself.', points: { hanuman: 3, sita: 1 } },
            { text: 'Upholding your promises and principles, even when it is incredibly difficult.', points: { rama: 3, karna: 1 } },
            { text: 'Guiding those you care about toward their highest potential, even if it requires tough love.', points: { krishna: 3, arjuna: 1 } }
        ]
    },
    {
        id: 'ambition',
        text: 'When you set your sights on a major goal, what drives you?',
        options: [
            { text: 'The desire to prove my worth and overcome any limitations placed upon me.', points: { karna: 3, arjuna: 1 } },
            { text: 'The pursuit of excellence and the need to fully master my craft.', points: { arjuna: 3, hanuman: 1 } },
            { text: 'The responsibility I feel to lead by example and establish order.', points: { rama: 3, krishna: 1 } },
            { text: 'The inner calling to serve a purpose that elevates everyone involved.', points: { hanuman: 3, sita: 1 } }
        ]
    },
    {
        id: 'emotion',
        text: 'How do you handle deep sorrow or disappointment?',
        options: [
            { text: 'I maintain my composure outwardly to keep others feeling secure.', points: { rama: 3, sita: 1 } },
            { text: 'I absorb it, letting it deepen my empathy and inner fortitude.', points: { sita: 3, karna: 1 } },
            { text: 'I observe the emotion detachedly, knowing it is just a passing phase of life.', points: { krishna: 3, arjuna: 1 } },
            { text: 'I channel the pain into determination, using it as fuel to push forward.', points: { karna: 3, arjuna: 2 } }
        ]
    },
    {
        id: 'leadership',
        text: 'If you are forced to lead a group through a crisis, what is your approach?',
        options: [
            { text: 'I take the front line, protecting them through sheer willpower and action.', points: { hanuman: 3, karna: 1 } },
            { text: 'I set a flawless moral example so they feel safe following my lead.', points: { rama: 3, sita: 1 } },
            { text: 'I analyze everyone’s strengths and position them where they can succeed.', points: { krishna: 3, arjuna: 1 } },
            { text: 'I focus on being the most capable person in the room, inspiring them through competence.', points: { arjuna: 3, hanuman: 1 } }
        ]
    },
    {
        id: 'fairness',
        text: 'When you witness something deeply unfair, what is your instinct?',
        options: [
            { text: 'I feel a strong surge of righteous anger and the need to correct it immediately.', points: { hanuman: 3, karna: 2 } },
            { text: 'I look for a strategic way to turn the tables and restore balance long-term.', points: { krishna: 3, rama: 1 } },
            { text: 'I rely on my inner dignity to rise above it, refusing to let it break my spirit.', points: { sita: 3, karna: 1 } },
            { text: 'I remember the times I was treated unfairly and vow to support the underdog.', points: { karna: 3, hanuman: 1 } }
        ]
    },
    {
        id: 'wisdom',
        text: 'Where do you believe true wisdom comes from?',
        options: [
            { text: 'From adhering to universal truths and fulfilling your daily duties faithfully.', points: { rama: 3, sita: 1 } },
            { text: 'From an expansive, playful understanding of the grand game of life.', points: { krishna: 3, hanuman: 1 } },
            { text: 'From the quiet resilience built after surviving the hardest trials.', points: { sita: 3, karna: 1 } },
            { text: 'From relentless practice, self-reflection, and asking the right questions.', points: { arjuna: 3, krishna: 1 } }
        ]
    },
    {
        id: 'legacy',
        text: 'How do you want to be remembered?',
        options: [
            { text: 'As someone who always did what was right, regardless of the personal cost.', points: { rama: 3, sita: 1 } },
            { text: 'As a visionary who guided others through the complexities of life.', points: { krishna: 3, arjuna: 1 } },
            { text: 'As a fiercely loyal friend who never backed down or gave up.', points: { karna: 3, hanuman: 2 } },
            { text: 'As an unstoppable force of dedication who served with absolute humility.', points: { hanuman: 3, rama: 1 } }
        ]
    }
];
