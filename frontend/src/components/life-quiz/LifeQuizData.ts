export type Dimension = 'judgment' | 'integrity' | 'emotionalBalance' | 'responsibility' | 'compassion' | 'foresight';

export interface Option {
    text: string;
    scores: Partial<Record<Dimension, number>>;
}

export interface Question {
    id: number;
    scenario: string;
    options: Option[];
}

export const SCORING_DIMENSIONS: { id: Dimension; label: string; description: string }[] = [
    { id: 'judgment', label: 'Judgment', description: 'The ability to make considered decisions or come to sensible conclusions.' },
    { id: 'integrity', label: 'Integrity', description: 'The quality of being honest and having strong moral principles.' },
    { id: 'emotionalBalance', label: 'Emotional Balance', description: 'The ability to manage emotions and remain calm under pressure.' },
    { id: 'responsibility', label: 'Responsibility', description: 'Taking ownership of your actions and duties towards others.' },
    { id: 'compassion', label: 'Compassion', description: 'Sympathetic pity and concern for the sufferings or misfortunes of others.' },
    { id: 'foresight', label: 'Foresight', description: 'The ability to predict or the action of predicting what will happen or be needed in the future.' }
];

export const LIFE_QUIZ_QUESTIONS: Question[] = [
    {
        id: 1,
        scenario: "You worked hard on a task, but someone else gets public credit. What feels like the strongest response?",
        options: [
            { text: "Immediately correct the speaker publicly to claim your credit.", scores: { integrity: 4, emotionalBalance: 1, judgment: 2 } },
            { text: "Say nothing, assuming the truth will eventually come out.", scores: { emotionalBalance: 5, foresight: 2, judgment: 3 } },
            { text: "Speak privately to the person who took credit to clarify roles for the future.", scores: { judgment: 10, emotionalBalance: 9, foresight: 8 } },
            { text: "Complain to your peers about the unfairness to build an alliance.", scores: { emotionalBalance: 1, judgment: 1, integrity: 2 } }
        ]
    },
    {
        id: 2,
        scenario: "You notice you were severely undercharged by a struggling local business for a large order. What do you do?",
        options: [
            { text: "Return immediately and pay the difference.", scores: { integrity: 10, compassion: 8, responsibility: 9 } },
            { text: "Keep the money, but promise yourself to tip them heavily next time.", scores: { compassion: 4, judgment: 3, integrity: 2 } },
            { text: "Consider it a lucky break; business is about profits.", scores: { integrity: 1, compassion: 1, foresight: 2 } },
            { text: "Call them later and ask if their accounts are short.", scores: { integrity: 7, judgment: 6, responsibility: 5 } }
        ]
    },
    {
        id: 3,
        scenario: "A family member has a sudden non-life-threatening emergency right as you are about to present a massive project at work.",
        options: [
            { text: "Drop everything immediately and rush to your family.", scores: { compassion: 10, responsibility: 6, judgment: 4 } },
            { text: "Delegate the presentation to a trusted colleague and leave.", scores: { judgment: 10, responsibility: 9, emotionalBalance: 8 } },
            { text: "Do the presentation quickly, then leave immediately after.", scores: { responsibility: 8, emotionalBalance: 7, compassion: 5 } },
            { text: "Ignore the call until the presentation is completely finished.", scores: { responsibility: 5, compassion: 1, judgment: 3 } }
        ]
    },
    {
        id: 4,
        scenario: "A close friend confesses they made a significant ethical mistake at work. They ask you to keep it secret.",
        options: [
            { text: "Agree to keep the secret unconditionally to support them.", scores: { compassion: 8, integrity: 3, judgment: 4 } },
            { text: "Report them anonymously to protect the company.", scores: { integrity: 9, compassion: 1, emotionalBalance: 5 } },
            { text: "Urge them to confess, offering to support them through the fallout.", scores: { judgment: 10, integrity: 9, compassion: 9, foresight: 8 } },
            { text: "Distance yourself from the friend to avoid being implicated.", scores: { foresight: 6, compassion: 2, integrity: 5 } }
        ]
    },
    {
        id: 5,
        scenario: "Your team is pressured to cut corners to meet an unrealistic deadline set by leadership.",
        options: [
            { text: "Cut the corners. Leadership takes the ultimate responsibility.", scores: { responsibility: 2, integrity: 3, judgment: 4 } },
            { text: "Push back immediately, explaining the long-term risks of poor quality.", scores: { integrity: 10, foresight: 10, judgment: 9 } },
            { text: "Work extreme overtime to try and meet the deadline perfectly.", scores: { responsibility: 8, emotionalBalance: 2, judgment: 4 } },
            { text: "Quietly deliver the flawed product and plan to fix it later.", scores: { foresight: 4, integrity: 4, judgment: 3 } }
        ]
    },
    {
        id: 6,
        scenario: "Someone aggressively cuts you off in traffic, almost causing an accident, and flips you off.",
        options: [
            { text: "Honk loudly and tailgate them to teach them a lesson.", scores: { emotionalBalance: 1, judgment: 1, responsibility: 1 } },
            { text: "Take a deep breath, slow down, and create distance.", scores: { emotionalBalance: 10, judgment: 10, foresight: 8 } },
            { text: "Curse them out from inside your car to vent the anger.", scores: { emotionalBalance: 5, judgment: 6 } },
            { text: "Speed up and try to get a picture of their license plate.", scores: { responsibility: 4, emotionalBalance: 3, judgment: 3 } }
        ]
    },
    {
        id: 7,
        scenario: "You discover a major flaw in your own work right before a high-stakes launch. Nobody else knows.",
        options: [
            { text: "Halt the launch, admit the mistake, and propose a fix.", scores: { integrity: 10, responsibility: 10, emotionalBalance: 8 } },
            { text: "Let it launch and try to patch it quietly in the background.", scores: { integrity: 3, responsibility: 4, foresight: 3 } },
            { text: "Blame it on a systemic issue if it gets discovered.", scores: { integrity: 1, responsibility: 1, judgment: 2 } },
            { text: "Tell your manager privately, but let them make the call on launching.", scores: { responsibility: 7, integrity: 7, judgment: 7 } }
        ]
    },
    {
        id: 8,
        scenario: "You manage a highly productive employee who is exceptionally toxic and rude to the rest of the team.",
        options: [
            { text: "Ignore the behavior because their output is irreplaceable.", scores: { judgment: 2, compassion: 2, foresight: 1 } },
            { text: "Fire them immediately to protect the team culture.", scores: { emotionalBalance: 5, compassion: 7, foresight: 6 } },
            { text: "Give them a strict warning and a coaching plan, tying behavior to employment.", scores: { judgment: 10, leadership: 9, foresight: 9, responsibility: 9 } },
            { text: "Separate them from the team so they can work alone.", scores: { judgment: 5, compassion: 5, foresight: 4 } }
        ]
    },
    {
        id: 9,
        scenario: "You receive an unexpected and massive financial windfall (e.g., an inheritance).",
        options: [
            { text: "Immediately quit your job and upgrade your lifestyle.", scores: { foresight: 2, judgment: 2, emotionalBalance: 4 } },
            { text: "Invest it all in high-risk, high-reward ventures.", scores: { judgment: 3, foresight: 4, emotionalBalance: 5 } },
            { text: "Park it in a safe account and take months to plan a balanced strategy.", scores: { foresight: 10, judgment: 10, emotionalBalance: 9 } },
            { text: "Give it all away to charity because money changes people.", scores: { compassion: 10, judgment: 4, foresight: 4 } }
        ]
    },
    {
        id: 10,
        scenario: "A loved one asks your honest opinion on a creative project they poured their heart into. You think it's terrible.",
        options: [
            { text: "Tell them it's amazing to protect their feelings.", scores: { compassion: 8, integrity: 2, judgment: 4 } },
            { text: "Tell them bluntly that it's terrible and why.", scores: { integrity: 9, compassion: 2, emotionalBalance: 5 } },
            { text: "Praise their effort, but ask gentle questions to guide them to see the flaws.", scores: { judgment: 10, compassion: 9, emotionalBalance: 8 } },
            { text: "Avoid answering directly and change the subject.", scores: { judgment: 3, integrity: 3, emotionalBalance: 4 } }
        ]
    },
    {
        id: 11,
        scenario: "You must choose between a very high-paying job that makes you miserable, and a low-paying job you love.",
        options: [
            { text: "Take the high pay; money solves everything.", scores: { foresight: 4, judgment: 4, emotionalBalance: 3 } },
            { text: "Take the low pay; happiness is the only metric.", scores: { emotionalBalance: 8, foresight: 5, judgment: 6 } },
            { text: "Take the high pay temporarily to build a safety net, with a strict exit date.", scores: { judgment: 10, foresight: 10, emotionalBalance: 7 } },
            { text: "Refuse both and try to start your own business with zero capital.", scores: { judgment: 3, foresight: 3, responsibility: 4 } }
        ]
    },
    {
        id: 12,
        scenario: "You witness a retail worker being unfairly berated by a furious customer.",
        options: [
            { text: "Record it on your phone for social media.", scores: { compassion: 1, judgment: 2, responsibility: 1 } },
            { text: "Intervene aggressively, shouting back at the customer.", scores: { compassion: 6, emotionalBalance: 2, judgment: 3 } },
            { text: "Calmly step in to de-escalate the situation and support the worker.", scores: { compassion: 10, emotionalBalance: 10, judgment: 9 } },
            { text: "Walk away; it's not your business.", scores: { responsibility: 2, compassion: 2, judgment: 4 } }
        ]
    },
    {
        id: 13,
        scenario: "A trusted mentor suddenly gives you highly critical, negative feedback about your character.",
        options: [
            { text: "Become defensive and list reasons why they are wrong.", scores: { emotionalBalance: 2, judgment: 2, responsibility: 2 } },
            { text: "Cut ties with the mentor; you don't need negativity.", scores: { emotionalBalance: 3, judgment: 3, foresight: 2 } },
            { text: "Listen quietly, thank them, and take time to deeply reflect on it.", scores: { emotionalBalance: 10, judgment: 10, responsibility: 9 } },
            { text: "Agree completely and immediately spiral into self-doubt.", scores: { emotionalBalance: 2, judgment: 4, compassion: 4 } }
        ]
    },
    {
        id: 14,
        scenario: "You are completely overwhelmed with tasks and missing deadlines across the board.",
        options: [
            { text: "Communicate your overload to stakeholders, prioritize ruthlessly, and renegotiate deadlines.", scores: { responsibility: 10, judgment: 10, foresight: 9 } },
            { text: "Work through the night, sacrificing sleep and health to catch up.", scores: { responsibility: 7, emotionalBalance: 3, foresight: 4 } },
            { text: "Quietly ignore the less important tasks and hope nobody notices.", scores: { integrity: 3, responsibility: 2, judgment: 3 } },
            { text: "Freeze up and spend the day procrastinating out of anxiety.", scores: { emotionalBalance: 1, responsibility: 1, judgment: 2 } }
        ]
    },
    {
        id: 15,
        scenario: "A colleague takes credit for a minor idea of yours. It doesn't impact your career, but it stings.",
        options: [
            { text: "Let it go entirely; it's not worth the mental energy.", scores: { emotionalBalance: 9, judgment: 8, foresight: 7 } },
            { text: "Hold a grudge and subtly undermine them in the future.", scores: { emotionalBalance: 2, integrity: 2, judgment: 2 } },
            { text: "Bring it up formally to HR.", scores: { judgment: 3, emotionalBalance: 5, foresight: 4 } },
            { text: "Make a passive-aggressive joke about it in the next meeting.", scores: { emotionalBalance: 3, judgment: 2, integrity: 4 } }
        ]
    }
];
