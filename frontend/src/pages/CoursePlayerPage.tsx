import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  ChevronLeft, ChevronRight, ChevronDown, BookOpen, PenLine, HelpCircle,
  PlayCircle, CheckCircle2, Lock, Sparkles, Brain, Users, Zap,
  Award, Trophy, X, Menu, FileText,
  Layers, Target, Flame, Clock, ArrowRight, RotateCcw,
  NotebookPen, ListChecks, Leaf
} from 'lucide-react';
import { toast } from 'sonner';
import learningPathsData from '../data/learningPaths.json';
import { CertificateModal } from '../components/CertificateModal';

const { learningPaths } = learningPathsData;

/* ──────────────────────────────────────────
   LESSON CONTENT — All 3 courses, all 15 lessons each
────────────────────────────────────────── */

type LessonContent = {
  objectives: string[];
  body: string[];
  keyTakeaways?: string[];
  practicalExercise?: string;
  reflectionPrompts?: string[];
  quizQuestions?: { question: string; options: string[]; correct: number }[];
  activitySteps?: string[];
  summary?: string;
};

// ════════════════════════════════════════
// COURSE 1: Foundations of Clear Communication
// ════════════════════════════════════════
const FCC_CONTENT: Record<string, LessonContent> = {
  // Module 1
  'fcc-1-1': {
    objectives: [
      'Understand why clear communication is a professional and personal advantage',
      'Recognize the most common barriers to clear communication',
      'Identify what it means to communicate with intention',
    ],
    body: [
      'Communication is the most used skill in human life — and often the least developed. We speak thousands of words every day, yet studies show that more than 70% of workplace misunderstandings stem from unclear or incomplete communication. Clarity is not a luxury. It is a necessity.',
      'When you communicate clearly, you save time. You prevent confusion. You build trust. The person on the receiving end does not have to guess your meaning, re-read your message three times, or ask follow-up questions just to understand what you need. Clear communication respects the time and intelligence of everyone involved.',
      'So what does clarity actually look like? It means knowing your *purpose* before you speak. It means organizing your thoughts before they leave your mouth. It means choosing words that your listener already understands, not words designed to impress or confuse.',
      'There are three fundamental barriers to clear communication. First, *assumption* — we assume the other person already knows the context, the background, or the reason. Second, *vagueness* — we use words like "soon," "later," or "someone" when we should be specific. Third, *emotional reactivity* — we speak from frustration or anxiety rather than from a calm and clear state of mind.',
      'Professional communicators are not born — they are built. Every great leader, negotiator, or teacher you admire developed communication skills through deliberate practice. This course gives you the framework, the tools, and the exercises to do exactly that. Start by deciding: I will communicate with purpose.',
    ],
    keyTakeaways: [
      'Clarity is a skill that can be learned and improved with practice',
      'Most misunderstandings come from assumption, vagueness, and emotional reactivity',
      'Clear communication respects both your time and your listener\'s time',
      'Purpose-driven communication begins before you speak',
    ],
    practicalExercise: 'Choose one recent conversation where a misunderstanding occurred. Write down: (1) What you meant to say, (2) What was actually understood, (3) Which of the three barriers — assumption, vagueness, or reactivity — caused the gap. This reflection will be your baseline for growth.',
    summary: 'Clarity in communication is not about being perfect — it is about being intentional. When you know why you are speaking and what you want the other person to understand, you have already done half the work.',
  },
  'fcc-1-2': {
    objectives: [
      'Understand why the pause before speaking is a professional superpower',
      'Learn to organize thoughts before expressing them',
      'Practice the Think-Structure-Speak framework',
    ],
    body: [
      'Most communication problems begin before a single word is spoken. They begin in the gap between thought and expression — the moment where we have not yet decided what we actually want to say, but say it anyway.',
      'Thinking before speaking is one of the most powerful communication habits you can develop. It signals to others that your words have weight. When you speak with deliberation, people listen differently. They sense that what you are about to say is worth hearing.',
      'The *Think-Structure-Speak* framework gives you a practical process. Step one: Think. Before responding, take a brief pause — even two or three seconds — and ask yourself: "What is the one thing I need the other person to understand?" Step two: Structure. Arrange your key point first, supporting detail second, and action or request third. Step three: Speak. Now deliver your message with that structure in place.',
      'This does not mean you become slow or robotic. It means your speech becomes *purposeful*. Over time, this thinking process becomes automatic. What once required a deliberate pause will become second nature, allowing you to communicate clearly even in fast-paced conversations.',
      'Consider the difference between these two responses to a question. Response A: "Well, I was thinking, you know, that maybe we could, I mean if the team is okay with it, kind of shift the deadline a little bit." Response B: "I recommend we extend the deadline by two days. Here is why — and here is how it benefits the project." Response B is not smarter. It is simply more organized. Anyone can do this.',
    ],
    keyTakeaways: [
      'A brief pause before speaking is a sign of confidence, not uncertainty',
      'The Think-Structure-Speak framework brings order to your message',
      'Lead with your main point, then provide supporting details',
      'Organized communication earns respect and trust',
    ],
    practicalExercise: 'For the next 24 hours, before every response in conversation, apply a 3-second internal pause. During that pause, identify one thing: what is the most important point you need to make? Deliver that first. Observe how others respond when you lead with clarity.',
    summary: 'Thinking before speaking is not hesitation — it is precision. When you structure your thoughts before expressing them, your communication becomes sharper, cleaner, and far more effective.',
  },
  'fcc-1-3': {
    objectives: [
      'Understand why simple language is more powerful than complex vocabulary',
      'Learn how to replace jargon with plain, direct language',
      'Practice translating complex ideas into accessible words',
    ],
    body: [
      'There is a widespread myth that using complex words, long sentences, and industry jargon makes you sound more intelligent and credible. Research consistently shows the opposite. Studies from Princeton University found that people who use simpler, more direct language are rated as *more* intelligent, not less.',
      'Simple language does not mean shallow thinking. It means respecting your audience enough to make your ideas accessible. When you force your listener to decode your language, you lose them — and with them, your message.',
      'The key principle is this: *use the simplest word that accurately conveys your meaning.* Instead of "utilize," say "use." Instead of "in the event that," say "if." Instead of "facilitate," say "help." Instead of "leverage," say "use" or "apply." These substitutions make your speech faster, clearer, and more believable.',
      'Jargon is another major barrier. Every industry has its own language, and within that industry it is efficient. But the moment you use jargon with someone outside your field, you create a wall. When in doubt, ask yourself: "If I explained this to a 12-year-old, what words would I use?" Those are often the right words for adult communication too.',
      'Hemingway, one of the most influential writers in history, built his reputation on simple language. Short words. Short sentences. No wasted words. His first drafts were often complex; his final drafts were stripped clean. Professional communicators follow the same principle — first get it out, then make it simple.',
    ],
    keyTakeaways: [
      'Simple language signals confidence and clarity, not weakness',
      'Replace jargon with plain language whenever communicating across knowledge gaps',
      'Lead with the clearest, most direct words available',
      'Editing for simplicity is a professional skill worth developing',
    ],
    practicalExercise: 'Take a recent email or message you sent and rewrite it using simpler words. Remove all jargon. Replace any phrase over five words with a phrase under three. Read both versions aloud. Notice which one sounds clearer and more confident. That is the version you should be sending.',
    summary: 'Simplicity is sophistication. The ability to take a complex idea and express it in plain language is one of the rarest and most powerful communication skills you can develop.',
  },
  'fcc-1-4': {
    objectives: [
      'Assess your understanding of Module 1 concepts',
      'Reinforce key ideas from the first three lessons',
      'Build confidence in applying clarity principles',
    ],
    body: [
      'This assessment covers the core concepts from Module 1: Foundations of Clear Communication. Answer each question carefully. After submission, you will receive instant feedback. Review any incorrect answers before moving to Module 2.',
    ],
    quizQuestions: [
      {
        question: 'Which of the following is NOT one of the three fundamental barriers to clear communication?',
        options: ['Assumption', 'Vagueness', 'Emotional reactivity', 'Speaking too slowly'],
        correct: 3,
      },
      {
        question: 'In the Think-Structure-Speak framework, what should come first when you speak?',
        options: ['Supporting details', 'Background context', 'Your main point', 'Your credentials'],
        correct: 2,
      },
      {
        question: 'Research shows that using simpler, more direct language makes you appear:',
        options: ['Less educated', 'More intelligent and credible', 'Less confident', 'More approachable but less professional'],
        correct: 1,
      },
    ],
    summary: 'Module 1 complete. You now understand why clarity matters, how to think before speaking, and why simple language is more powerful than complex vocabulary. Continue to Module 2 to build speaking confidence.',
  },

  // Module 2
  'fcc-2-1': {
    objectives: [
      'Understand the relationship between preparation and speaking confidence',
      'Learn why confidence is earned, not performed',
      'Build a pre-communication preparation habit',
    ],
    body: [
      'Confidence is not something you feel before you speak. It is something you build by preparing. Every speaker who walks into a room with calm, assured presence has done the work before entering that room. Confidence is the residue of preparation.',
      'When we speak without preparation, our brain is doing two jobs at once: creating content and delivering it simultaneously. This cognitive overload is what causes rambling, filler words, and losing the thread of thought mid-sentence. Preparation eliminates this. When you already know what you are going to say, your brain can focus entirely on *how* you are saying it.',
      'Preparation does not require hours of rehearsal. For most professional conversations, five minutes of intentional thinking is enough. Ask yourself three questions before any important communication: What is my objective? What are the two or three key points I need to make? What do I want the other person to do, feel, or understand when I finish?',
      'These three questions work for presentations, difficult conversations, emails, meetings, and interviews. They shift your mindset from reactive to intentional. You stop improvising under pressure and start communicating with purpose.',
      'One powerful preparation technique is *mental rehearsal*. Before a meeting or presentation, sit quietly and visualize the conversation. Imagine yourself speaking clearly, calmly, and confidently. Imagine the other person nodding, understanding, responding positively. Research on performance psychology shows that mental rehearsal activates the same neural pathways as actual practice — with remarkable results.',
    ],
    keyTakeaways: [
      'Confidence comes from preparation, not from personality or talent',
      'Preparation reduces cognitive overload and improves speech quality',
      'Three questions before every communication: objective, key points, desired outcome',
      'Mental rehearsal is a proven technique used by elite speakers and performers',
    ],
    practicalExercise: 'Before your next important conversation or meeting, spend five minutes answering these three questions in writing: (1) What is my goal? (2) What are my two most important points? (3) What do I want the other person to do or understand? Notice how much more confident and clear you feel when the conversation begins.',
    summary: 'Confidence is not a personality trait — it is a skill built through preparation. When you prepare, you speak better. When you speak better, you feel more confident. This cycle builds on itself.',
  },
  'fcc-2-2': {
    objectives: [
      'Understand how speaking pace affects clarity and credibility',
      'Learn techniques to slow down and articulate clearly',
      'Develop awareness of your own speaking rhythm',
    ],
    body: [
      'Speaking too fast is one of the most common communication habits that undermines clarity and credibility. When we are nervous, excited, or eager to prove ourselves, we speed up. Words run together. Sentences blur. The listener struggles to follow, and our message is lost.',
      'Speaking slowly and clearly signals confidence, control, and respect for the listener. It gives your audience time to process each idea before the next one arrives. It also gives you time to think. When you slow down, you give your brain a moment to choose better words, make stronger connections, and avoid the verbal stumbles that come from rushing.',
      'The ideal speaking pace for clear communication is *slower than you think you need to be.* Most speakers overestimate how slow they are actually speaking. Record yourself in a conversation and you will almost certainly find you are speaking faster than you realized.',
      'Pauses are as important as words. A one or two second pause between ideas is not awkward — it is powerful. It allows your listener to absorb what you just said before you move on. It signals that you are considered and deliberate. The greatest orators in history — from Lincoln to Churchill to Obama — all used strategic pauses to create emphasis and allow their words to land.',
      'Articulation is the physical discipline of speaking. It means opening your mouth more than feels necessary, enunciating each syllable with intention, and avoiding the lazy dropping of word endings. The word "going" should not become "gonna." The word "want to" should not become "wanna." These small differences cumulatively shape how professional you sound.',
    ],
    keyTakeaways: [
      'Speaking pace has a direct impact on how credible and confident you appear',
      'Strategic pauses are tools of emphasis, not signs of uncertainty',
      'Record yourself to discover your actual speaking pace',
      'Articulation — clear enunciation — is a learnable physical discipline',
    ],
    practicalExercise: 'Record a 90-second voice memo where you explain your job or a recent project as if to someone unfamiliar with your field. Play it back and count: how many times did you rush? How many words slurred together? Now re-record the same content, deliberately 30% slower. Compare the two. The second recording sounds far more authoritative.',
    summary: 'When you slow down, the quality of your communication goes up. Speaking clearly and at a measured pace is one of the fastest ways to be perceived as more credible, confident, and worth listening to.',
  },
  'fcc-2-3': {
    objectives: [
      'Understand the physiological and psychological roots of communication nervousness',
      'Learn evidence-based techniques to manage anxiety before and during speaking',
      'Reframe nervousness as energy that can serve your communication',
    ],
    body: [
      'Nervousness before speaking is nearly universal. Research consistently shows that public speaking ranks among the most common human fears — above heights, spiders, and financial loss. You are not alone, and you are not broken. Nervousness is simply your body preparing for something it perceives as important.',
      'When you feel nervous before speaking, your body releases adrenaline. Your heart rate increases, your palms may sweat, and your voice may tremble. These physiological responses evolved to help you perform under pressure — not to sabotage you. The key is to *redirect* this energy rather than fight it.',
      'The most powerful reframe for nervousness is this: rename it. Instead of telling yourself "I am nervous," say "I am excited." Stanford research shows that this simple reframe shifts your mindset from avoidance to engagement — from trying to calm down to channeling energy forward. These two states — nervousness and excitement — feel physiologically similar but lead to radically different performance outcomes.',
      'Breathwork is one of the fastest and most effective tools for managing nervousness. The 4-7-8 technique works reliably: inhale for 4 counts, hold for 7, exhale for 8. This activates the parasympathetic nervous system, slowing the heart rate and calming the stress response within seconds. Do this two or three times before entering a high-stakes conversation.',
      'Physical posture also affects confidence. Social psychologist Amy Cuddy\'s research on "power posing" found that expansive, open postures — standing tall, shoulders back, feet shoulder-width apart — can shift both your internal state and how others perceive you. Before a presentation or important conversation, take two minutes in a confident posture. You will feel measurably different.',
    ],
    keyTakeaways: [
      'Nervousness is a physiological response, not a character flaw',
      'Renaming nervousness as excitement produces measurably better performance',
      'The 4-7-8 breathing technique calms the nervous system rapidly',
      'Physical posture directly influences both your confidence and how others perceive you',
    ],
    practicalExercise: 'The next time you feel nervous before speaking, try this 90-second protocol: (1) Say to yourself: "I am excited, not nervous." (2) Take three 4-7-8 breaths. (3) Stand or sit with your spine straight, shoulders back, and chin slightly lifted. Notice the shift in your state before you begin speaking. Practice this until it becomes automatic.',
    summary: 'Nervousness is not your enemy — it is energy. With the right tools, you can redirect that energy into presence, enthusiasm, and impact. Managing nervousness is a learnable skill, not a fixed personality trait.',
  },
  'fcc-2-4': {
    objectives: [
      'Assess your understanding of Module 2 concepts',
      'Test your knowledge of preparation, pacing, and nervousness management',
    ],
    body: ['This assessment covers Module 2: Speaking with Confidence. Answer all three questions, then submit.'],
    quizQuestions: [
      {
        question: 'What is the most accurate description of where speaking confidence comes from?',
        options: ['Innate personality traits', 'Years of experience only', 'Preparation and intentional practice', 'Natural charisma'],
        correct: 2,
      },
      {
        question: 'What does research show about renaming nervousness as excitement?',
        options: ['It makes you appear less professional', 'It shifts mindset from avoidance to engagement and improves performance', 'It suppresses the feeling temporarily', 'It has no measurable effect'],
        correct: 1,
      },
      {
        question: 'Strategic pauses during speaking are best described as:',
        options: ['Signs of forgetting what to say', 'Tools for emphasis and allowing ideas to land', 'Signs of poor preparation', 'Interruptions in communication flow'],
        correct: 1,
      },
    ],
    summary: 'Module 2 complete. You now have practical tools for preparation, pacing, and managing nervousness. Move to Module 3 to develop your active listening skills.',
  },

  // Module 3
  'fcc-3-1': {
    objectives: [
      'Understand the fundamental difference between listening and hearing',
      'Recognize the habits that prevent true listening',
      'Develop the foundation for active, engaged listening',
    ],
    body: [
      'Hearing is passive. It is the physical act of sound waves reaching your ears. Listening is active. It is the conscious choice to understand what those sounds mean — not just the words, but the intention, emotion, and context behind them.',
      'Most people in conversation are not listening. They are waiting. They are preparing their response while the other person is still speaking. They are thinking about what happened earlier, what they need to do next, or how they disagree with what is being said. This is hearing without listening.',
      'The consequences of poor listening are enormous. Relationships erode because people feel unheard. Decisions are made based on incomplete understanding. Instructions are misinterpreted. Projects fail. Conflicts escalate. Most of these outcomes could be prevented with better listening.',
      'Active listening requires a deliberate choice at the start of every conversation: *I am going to understand before I respond.* This means your internal voice goes quiet. You are not composing your reply while the other person speaks. You are absorbing — the words, the tone, the pauses, the body language — all of it.',
      'One of the most powerful listening practices is *mirroring and reflecting*. After someone finishes a key point, briefly summarize what you heard: "So what I am hearing is..." or "It sounds like..." This does two things: it confirms you understood correctly, and it signals to the speaker that their words actually landed. The effect on the other person is immediate and powerful — they feel genuinely heard, and trust increases.',
    ],
    keyTakeaways: [
      'Hearing is passive; listening is an active and conscious choice',
      'Most people listen to reply, not to understand',
      'Active listening requires silencing your internal response-preparation voice',
      'Reflecting and summarizing confirms understanding and builds trust',
    ],
    practicalExercise: 'In your next important conversation, make one deliberate commitment: do not speak until the other person has completely finished their thought — not just their sentence, but their full idea. Wait two full seconds after they finish. Then reflect back what you heard before responding. Notice how the dynamic of the conversation changes.',
    summary: 'Listening is a skill, not a talent. When you choose to truly listen — not just wait to talk — the quality of every relationship, conversation, and outcome in your life improves dramatically.',
  },
  'fcc-3-2': {
    objectives: [
      'Understand why questions are the most powerful listening tool',
      'Learn the difference between closed, open, and clarifying questions',
      'Develop a habit of asking questions before making assumptions',
    ],
    body: [
      'The best communicators are often the best questioners. Questions signal interest, invite deeper sharing, and prevent the misunderstandings that come from assumption. Asking better questions is one of the highest-leverage skills you can develop.',
      'There are three types of questions worth mastering. *Closed questions* produce yes or no answers. "Did you finish the report?" These are efficient but limit depth. *Open questions* invite full responses. "What was most challenging about finishing the report?" These reveal thinking, context, and feeling. *Clarifying questions* dig below the surface. "When you say the timeline is tight, what specifically concerns you most?"',
      'Clarifying questions are particularly powerful in professional environments. They demonstrate that you are paying attention, that you take the other person seriously, and that you are not willing to act on incomplete information. They prevent costly errors that come from assuming you understand something when you do not.',
      'The art of sequencing questions matters as much as the questions themselves. Start broad and open, then move toward specificity. "Tell me about how that project has been going?" followed by "What has been the biggest obstacle?" followed by "And when that obstacle appeared, what options did you consider?" Each question builds on the last, taking the conversation progressively deeper.',
      'One common mistake is peppering someone with multiple questions at once: "What happened, why did that occur, and what did you do about it?" This overwhelms the listener and usually produces a shallow answer to whichever question felt easiest. Ask one question. Wait fully for the answer. Then ask the next.',
    ],
    keyTakeaways: [
      'Questions signal interest and prevent costly misunderstandings',
      'Open questions invite depth; clarifying questions prevent false assumption',
      'Sequence questions from broad to specific for deeper understanding',
      'Ask one question at a time and wait fully for the answer',
    ],
    practicalExercise: 'In your next five conversations today, challenge yourself to ask at least one open question and one clarifying question before giving your opinion or making any decision. Track the conversations. You will discover information you would have completely missed without those questions.',
    summary: 'Asking better questions is listening in action. When you ask rather than assume, you access information that transforms your understanding, your decisions, and your relationships.',
  },
  'fcc-3-3': {
    objectives: [
      'Understand why responding before fully understanding is a communication failure',
      'Learn a framework for ensuring comprehension before replying',
      'Practice the habit of understanding first in high-stakes conversations',
    ],
    body: [
      'There is a deeply ingrained habit in most conversations: responding before fully understanding. We hear enough to form an opinion, and we respond to that partial picture. The result is conversations that go in circles, conflicts that escalate unnecessarily, and decisions made on incomplete information.',
      'The principle of understanding before responding does not mean being passive or slow. It means being accurate. It means that your response, when it comes, is based on the actual full message — not on what you thought you heard, not on what you expected the person to say, and not on the emotional reaction you had to the first few words.',
      'The *WAIT* principle is useful here. WAIT stands for "Why Am I Talking?" It is a reminder to pause before contributing to a conversation and ask whether you have truly understood the situation. If the answer is no, your next step is to ask, listen, and clarify — not to offer your view.',
      'In high-stakes conversations — negotiations, difficult feedback sessions, conflict resolution — the discipline of understanding first is the difference between resolution and escalation. When people feel fully heard before any response is given, they become significantly more receptive to what you say next. This is not just psychology — it is practical strategy.',
      'Phrases that signal understanding before responding include: "Let me make sure I understand..." "Before I respond, let me reflect back what I heard..." "Can I ask a few questions before I share my perspective?" These simple phrases signal respect, demonstrate competence, and set the stage for a far more productive exchange.',
    ],
    keyTakeaways: [
      'Responding to partial understanding causes circular conversations and poor decisions',
      'The WAIT principle: ask yourself "Why Am I Talking?" before responding',
      'In high-stakes conversations, understanding first dramatically increases receptivity',
      'Signal phrases that demonstrate understanding build trust and authority',
    ],
    practicalExercise: 'Today, choose one conversation — a difficult topic, a complex request, or a tense interaction — and commit to asking at least two clarifying questions before offering any response or opinion. Use the phrase: "Before I respond, let me make sure I understand what you mean." Reflect on how different the outcome feels compared to your usual approach.',
    summary: 'Understanding before responding is one of the most powerful communication disciplines available. It costs you nothing but a few extra seconds, and it produces dramatically better outcomes in every context.',
  },
  'fcc-3-4': {
    objectives: ['Assess your understanding of Module 3: Active Listening concepts'],
    body: ['This assessment covers the key concepts from Module 3. Answer all questions, then submit for feedback.'],
    quizQuestions: [
      {
        question: 'What is the primary difference between listening and hearing?',
        options: ['Hearing involves understanding context; listening is passive', 'Listening is active and conscious; hearing is passive and physical', 'They are the same process', 'Listening is slower than hearing'],
        correct: 1,
      },
      {
        question: 'Which type of question invites the deepest and most complete response?',
        options: ['Closed questions', 'Leading questions', 'Open questions', 'Rhetorical questions'],
        correct: 2,
      },
      {
        question: 'What does the WAIT principle stand for?',
        options: ['Words Articulate Intelligent Thought', 'Why Am I Talking?', 'Wisdom Achieved In Time', 'Wait And Improve Tone'],
        correct: 1,
      },
    ],
    summary: 'Module 3 complete. Your listening skills are now grounded in a solid framework. Module 4 will apply these skills to professional communication contexts.',
  },

  // Module 4
  'fcc-4-1': {
    objectives: [
      'Learn the principles of professional, effective email communication',
      'Understand how to structure emails for clarity and action',
      'Develop habits that reduce email misunderstandings',
    ],
    body: [
      'Email is one of the primary tools of professional communication — and one of the most frequently misused. Poor emails waste time, create confusion, damage professional reputation, and delay outcomes. Mastering email communication is not optional; it is essential.',
      'Every professional email needs four elements. First, a *clear subject line* that tells the recipient exactly what the email is about. Not "Update" — but "Project X: Revised Deadline and Next Steps." Second, a *direct opening* that states the purpose within the first two sentences. Third, a *structured body* with no more than three key points, each in its own short paragraph. Fourth, a *specific call to action* — what do you need the recipient to do, by when?',
      'Length is one of the most common email errors. Professionals receive hundreds of emails per day. Long, unstructured emails get skimmed or ignored. If your email requires more than three short paragraphs, consider whether a meeting or call would be more appropriate. If email is necessary, use bullet points to make key information scannable.',
      'Tone is the invisible dimension of email communication. Because email lacks voice, facial expression, and body language, tone can easily be misread. A direct email can sound curt. A casual email can sound unprofessional. To calibrate tone, read your email aloud before sending. Ask yourself: "If I received this, how would I feel?" That audit catches most tone problems before they cause damage.',
      'The one-touch principle is a productivity and communication rule: handle each email once. Either respond immediately, delegate it, defer it to a specific time, or delete it. Do not read an email, feel uncertain, and leave it to revisit later without any action. This creates mental clutter and communication delays that erode professional relationships.',
    ],
    keyTakeaways: [
      'Every professional email needs a clear subject, direct opening, structured body, and specific call to action',
      'Keep emails short — use bullet points for scannability in longer messages',
      'Read emails aloud before sending to audit tone',
      'The one-touch principle: handle each email with a definitive action',
    ],
    practicalExercise: 'Review your last five sent emails. For each one, ask: (1) Is the subject line specific and clear? (2) Did I state my purpose in the first two sentences? (3) Is there a clear action I am asking for? Rewrite one email that failed these criteria. Compare the original and the revision — notice the difference in professionalism and clarity.',
    summary: 'Professional email communication is a disciplined craft. When you write with clarity, structure, and a specific call to action, you become someone whose emails get read, taken seriously, and acted upon.',
  },
  'fcc-4-2': {
    objectives: [
      'Learn how to communicate effectively in meetings',
      'Understand how to contribute with clarity and concision',
      'Develop the habit of purposeful meeting communication',
    ],
    body: [
      'Meetings are one of the most expensive forms of communication in any organization. When they are well-facilitated and clearly communicated, they drive alignment and decisions. When they are poorly handled, they are a massive drain of time, energy, and morale.',
      'Whether you are leading or attending a meeting, your communication choices significantly impact its quality. As a *participant*, the primary discipline is this: speak only when you have something meaningful to add, and be concise when you do. Long, rambling contributions in meetings are one of the most common professional credibility mistakes. People who speak with economy and clarity are remembered and respected.',
      'Before any meeting contribution, apply the *Point-Reason-Example* framework. Lead with your point, state your reason, and if needed, give one example. "I recommend we delay the launch by two weeks [point] because our testing data shows three unresolved issues [reason]. For example, the payment integration failed in 12% of test cases [example]." This structure takes less than 30 seconds and is far more powerful than a lengthy explanation.',
      'When you are leading a meeting, your most important job is clarity of purpose and ownership of decisions. Every meeting should begin with a stated objective: "The purpose of today\'s meeting is to decide X" or "We are here to align on Y." Without this, meetings drift. Every meeting should end with documented actions, owners, and deadlines.',
      'Asking for the floor in meetings is also a communication skill. A simple "I\'d like to add something here" or "Can I respond to that?" is far more effective than talking over someone or waiting so long that the moment passes. Assertive, not aggressive. Timely, not interruptive.',
    ],
    keyTakeaways: [
      'In meetings, quality of contribution matters more than quantity of words',
      'The Point-Reason-Example framework makes meeting contributions crisp and memorable',
      'Every meeting should start with a clear objective and end with documented actions',
      'Assertive meeting participation requires timing, brevity, and relevance',
    ],
    practicalExercise: 'In your next three meetings, apply the Point-Reason-Example framework to every verbal contribution you make. Before speaking, mentally complete this sentence: "My point is ___. My reason is ___. My example is ___." Deliver only what is necessary. Observe how colleagues respond to your contributions differently.',
    summary: 'Meeting communication is a professional skill that can be learned. When you speak with clarity, structure, and purpose in meetings, you build a reputation as someone worth listening to.',
  },
  'fcc-4-3': {
    objectives: [
      'Understand the core principles of professional workplace communication',
      'Learn how to navigate difficult conversations professionally',
      'Develop standards for cross-functional and hierarchical communication',
    ],
    body: [
      'Workplace communication is more complex than most other contexts because it involves hierarchy, relationships, performance stakes, and organizational culture all at once. The professional who can communicate effectively across all these dimensions has a significant career advantage.',
      'The foundation of effective workplace communication is *clarity of expectation*. Many workplace conflicts and failures can be traced back to ambiguous expectations — someone thought they were responsible for something, someone else also thought they were responsible, and no one confirmed it. When giving instructions or assigning tasks, always specify: what needs to be done, to what standard, by when, and who is responsible.',
      'Upward communication — speaking to your manager or leadership — requires a different approach than peer or downward communication. Be concise. Lead with conclusions, not process. "The project is on track and will deliver by Friday" is more useful to a leader than "We had some challenges last week but we resolved them and now we are moving ahead." Leaders want outcomes and flags, not detailed narratives.',
      'Difficult workplace conversations — feedback, disagreement, boundary-setting — are unavoidable. The professionals who avoid them create bigger problems later. The framework for difficult conversations: (1) Choose the right time and place — private, unhurried. (2) Start with shared purpose: "I want to talk about this because I care about our work together." (3) Describe behavior specifically, not character generally. (4) State impact. (5) Listen. (6) Agree on a path forward.',
      'Professional communication also means knowing when to go to a person directly rather than involving others unnecessarily. Speaking to someone about a concern before escalating it to a third party is not only more respectful — it is more effective. It demonstrates maturity, preserves relationships, and often resolves the issue far faster.',
    ],
    keyTakeaways: [
      'Clarity of expectation prevents most workplace communication failures',
      'Upward communication should lead with conclusions and outcomes, not process',
      'Difficult conversations are unavoidable — avoidance creates larger problems',
      'Always address concerns directly before involving third parties',
    ],
    practicalExercise: 'Identify one conversation you have been avoiding in your professional environment — a piece of feedback you need to give, a boundary you need to set, or a misunderstanding you need to clear. This week, schedule that conversation using the five-step framework: shared purpose, specific behavior, impact, listening, path forward.',
    summary: 'Workplace communication mastery requires adapting your style, managing difficult conversations proactively, and setting clear expectations at every level. These skills separate good professionals from exceptional ones.',
  },
  'fcc-4-4': {
    objectives: ['Assess your understanding of Module 4: Professional Communication'],
    body: ['This assessment covers email, meeting, and workplace communication. Answer all questions, then submit.'],
    quizQuestions: [
      {
        question: 'What is the most important element every professional email must include?',
        options: ['A formal greeting', 'A clear call to action', 'A lengthy explanation of context', 'A CC to the manager'],
        correct: 1,
      },
      {
        question: 'In the Point-Reason-Example framework, what comes first?',
        options: ['The example', 'The background', 'The point', 'The reason'],
        correct: 2,
      },
      {
        question: 'When communicating upward to leadership, you should:',
        options: ['Provide full context before conclusions', 'Lead with conclusions and outcomes', 'Wait to be asked before sharing information', 'Use formal language exclusively'],
        correct: 1,
      },
    ],
    summary: 'Module 4 complete. You now have a professional toolkit for email, meeting, and workplace communication. Final module ahead: presenting ideas clearly.',
  },

  // Module 5
  'fcc-5-1': {
    objectives: [
      'Learn how to structure a presentation for maximum clarity and impact',
      'Understand the three-part framework that works for any presentation',
      'Develop the habit of audience-centered structure',
    ],
    body: [
      'A presentation without structure is not a presentation — it is a stream of consciousness. No matter how important your content, if it is not organized, your audience cannot follow it, remember it, or act on it. Structure is the backbone of any effective presentation.',
      'The most reliable presentation structure follows three stages. First, *Tell them what you are going to tell them.* This is your opening — state the topic, why it matters, and what they will leave with. Second, *Tell them.* This is the body — present your key points in a logical sequence, no more than three main ideas per presentation. Third, *Tell them what you told them.* This is your close — summarize the key takeaways and state a clear next step or call to action.',
      'Every strong presentation also answers one implicit question that your audience is always asking: "Why should I care?" This is the "so what" of your presentation. If you can answer that question within the first 60 seconds, you have your audience\'s attention. If you cannot, you are losing them while they wonder why they are there.',
      'The *PREP* framework is another reliable structure for shorter presentations and verbal explanations. Point: state your position. Reason: explain why. Example: illustrate with a specific case or data point. Point again: restate your position as a conclusion. This four-step framework works for two-minute briefings, five-minute presentations, and 30-minute workshops.',
      'Slide decks — when used — should support your message, not contain it. Each slide should have one idea, minimal text, and a visual that reinforces the point. If you find yourself reading off your slides, your slides have too much text. Your audience should be listening to you, not reading your slides.',
    ],
    keyTakeaways: [
      'Structure is not optional — it is what makes content followable and memorable',
      'The three-part structure: tell them what you will say, say it, tell them what you said',
      'Answer the "so what" question within the first 60 seconds',
      'The PREP framework works for any length of verbal presentation',
    ],
    practicalExercise: 'Design a 5-minute presentation on a topic you know well — a project, a hobby, or a professional skill. Using the three-part structure: (1) Write a 30-second opening that states the topic and why it matters. (2) Identify exactly three key points. (3) Write a 30-second close that summarizes and ends with a clear takeaway. Practice delivering it aloud.',
    summary: 'Structure is the silent framework that transforms information into communication. When your presentation has a clear shape, your audience can follow, absorb, and remember what you are saying.',
  },
  'fcc-5-2': {
    objectives: [
      'Learn techniques for making complex ideas accessible to any audience',
      'Understand how analogies, examples, and chunking improve comprehension',
      'Develop the skill of translating expertise into clarity',
    ],
    body: [
      'The mark of true expertise is not the ability to make something sound complex — it is the ability to make something complex sound simple. If you cannot explain your idea to someone unfamiliar with your field, your understanding of it is incomplete.',
      'The most powerful tool for explaining complex ideas is the *analogy*. An analogy creates a bridge between something your audience already understands and the new concept you are introducing. "Think of a firewall like a security guard for your computer network — it checks every person coming in and decides whether they are authorized to enter." The audience does not need to understand firewalls to grasp this. They understand security guards.',
      'Concrete examples are equally essential. Abstract ideas — strategy, vision, culture, efficiency — become meaningful when illustrated with specific, real-world cases. "When I say efficiency, here is what I mean: our team reduced report preparation time from four hours to 45 minutes by eliminating one unnecessary approval step." Abstract becomes concrete. Vague becomes specific.',
      '*Chunking* is the technique of breaking a complex idea into smaller, digestible pieces and presenting them sequentially. Instead of explaining the entire system at once, explain layer by layer. "First, let me explain what the problem is. Then, I will show you how our solution addresses it. Finally, I will tell you what you need to do to implement it." Each chunk is manageable; together they form the full picture.',
      'One final principle: *know your audience deeply.* What do they already understand? What vocabulary do they use? What do they care about? What is their relationship to this topic? The answers determine how technical your language can be, how much context you need to provide, and which analogies will land. Audience-centered communication always outperforms content-centered communication.',
    ],
    keyTakeaways: [
      'Analogies create bridges between what is known and what is new',
      'Concrete examples make abstract concepts real and memorable',
      'Chunking breaks complex ideas into manageable, sequential pieces',
      'Deep audience knowledge determines the right language, level, and approach',
    ],
    practicalExercise: 'Choose one complex idea from your professional field. Write a 150-word explanation of it as if explaining to a talented teenager with no background in your field. Use at least one analogy, one concrete example, and no jargon. Read it aloud. If a teenager would understand it, a professional audience will too.',
    summary: 'Explaining complex ideas simply is a rare and powerful skill. When you master it, you become the person who makes the complicated accessible, the technical understandable, and the important actionable.',
  },
  'fcc-5-3': {
    objectives: [
      'Learn techniques for capturing and maintaining audience attention',
      'Understand how to create connection during a presentation',
      'Develop the presence and energy that makes communication memorable',
    ],
    body: [
      'A presentation delivered to an unengaged audience is not a presentation — it is a monologue. Engagement is not something your audience owes you. It is something you earn through deliberate choices about how you show up, how you structure your content, and how you connect with the people in front of you.',
      'The most effective engagement tool is the *story*. Human brains are wired for narrative. Stories activate emotion, memory, and attention in ways that data and information alone cannot. Every presentation benefits from at least one story — a real situation, a specific person, a challenge faced and navigated. Stories make abstract concepts personal and make presenters human.',
      'Audience interaction is another powerful engagement tool. Questions — rhetorical or direct — pull people back into the room. "How many of you have experienced this?" or "What would you do in this situation?" creates participation. When people participate, even mentally, they are engaged. When they are engaged, they remember.',
      'Physical presence matters enormously. Eye contact is the most powerful connection tool a presenter has. Look at individuals, not crowds. Hold eye contact for three to five seconds per person. This creates genuine connection and makes each person feel seen. Movement — walking toward the audience, changing position in the room — adds energy and holds visual attention.',
      'Energy is contagious. If you bring genuine enthusiasm for your topic, the audience feels it. If you are going through the motions, the audience feels that too. Before you present, ask yourself: "What excites me most about this topic? What do I genuinely want this audience to take away?" Let that energy drive your delivery. Authenticity is the most engaging quality a presenter can have.',
    ],
    keyTakeaways: [
      'Engagement must be earned through deliberate choices, not assumed as given',
      'Stories activate emotion and memory more powerfully than data alone',
      'Eye contact — with individuals, not the room — creates genuine connection',
      'Authentic enthusiasm for your topic is the most engaging quality you can bring',
    ],
    practicalExercise: 'For your next presentation or explanation, prepare one story — real and specific — that illustrates your key message. It should be no more than 90 seconds long and should feature a specific person, a specific challenge, and a specific outcome. Practice telling it until it feels natural and genuine, not rehearsed.',
    summary: 'Engagement is not a trick — it is a commitment. When you bring authentic energy, tell human stories, and create genuine eye contact, you transform a presentation from information delivery into genuine communication.',
  },
  'fcc-5-4': {
    objectives: ['Complete the final assessment for Course 1: Foundations of Clear Communication'],
    body: ['This final assessment covers all five modules of the course. Upon completion, you will have earned your Foundations of Clear Communication Certificate.'],
    quizQuestions: [
      {
        question: 'Which of the following best describes the purpose of the Think-Structure-Speak framework?',
        options: ['To slow down speaking permanently', 'To organize thoughts before speaking for clearer delivery', 'To eliminate emotional content from communication', 'To replace listening with thinking'],
        correct: 1,
      },
      {
        question: 'What does the "so what" question in presentation design refer to?',
        options: ['A summary at the end of a presentation', 'The reason the audience should care, stated within the first 60 seconds', 'A way to dismiss audience questions', 'The conclusion of the presentation'],
        correct: 1,
      },
      {
        question: 'Which engagement tool activates emotion and memory more powerfully than data alone?',
        options: ['Complex statistics', 'Slide decks', 'Stories', 'Formal vocabulary'],
        correct: 2,
      },
    ],
    summary: 'Congratulations — you have completed the Foundations of Clear Communication program. You now have a comprehensive toolkit covering clarity, confidence, listening, professional communication, and presentation skills. Your certificate is ready.',
  },
};

// ════════════════════════════════════════
// COURSE 2: Decision Clarity & Strategic Thinking
// ════════════════════════════════════════
const DCST_CONTENT: Record<string, LessonContent> = {
  // Module 1
  'dcst-1-1': {
    objectives: [
      'Understand the difference between reactive thinking and clear, deliberate thinking',
      'Identify the conditions that trigger reactive decision-making',
      'Build awareness of your own thinking patterns',
    ],
    body: [
      'Most human decisions are made reactively. We feel something — urgency, fear, excitement, irritation — and we act on that feeling. The action feels like a decision, but it is really a reaction dressed in decision-making clothes. The consequences of this pattern range from minor regret to serious, lasting damage.',
      'Reactive thinking is fast. It is automatic. It is driven by the emotional brain — the amygdala — which is designed to respond to perceived threats quickly. This served our ancestors well when the threat was physical. In modern professional and personal life, the same mechanism causes us to send angry emails, make hasty commitments, and shut down conversations before they could be productive.',
      'Clear thinking requires a different process. It is slower. It is deliberate. It engages the prefrontal cortex — the part of the brain responsible for reason, planning, and consequence evaluation. The challenge is that the emotional brain fires much faster than the rational brain. By the time your reasoning kicks in, your reaction may already have occurred.',
      'The solution is *space* — a deliberate pause between stimulus and response. Viktor Frankl famously said: "Between stimulus and response there is a space. In that space is our power to choose our response. In our response lies our growth and freedom." That space does not appear automatically. You must create it intentionally, especially in high-emotion situations.',
      'The most reliable way to create that space is to name what is happening: "I notice I am feeling urgent/frustrated/excited right now." Naming an emotion activates the prefrontal cortex and momentarily reduces the intensity of the emotional response. You then have a fraction more time to choose — rather than react.',
    ],
    keyTakeaways: [
      'Reactive thinking is emotional and automatic; clear thinking is deliberate and rational',
      'The space between stimulus and response is where decision quality is determined',
      'Naming emotions activates the rational brain and reduces reactive impulse',
      'Building awareness of your own triggers is the first step to clearer thinking',
    ],
    practicalExercise: 'For the next three days, keep a brief decision log. Each time you make a significant decision or respond to a high-stakes situation, note: (1) What triggered the response? (2) Did you pause before acting? (3) Was the response reactive or deliberate? Review the log at the end of three days and identify your most common reactive triggers.',
    summary: 'The difference between reactive and clear thinking is not intelligence — it is awareness and practice. Every time you create space between stimulus and response, you are building the habit of clear thinking.',
  },
  'dcst-1-2': {
    objectives: [
      'Learn how to define the actual problem before attempting to solve it',
      'Understand why most people solve the wrong problem',
      'Develop the skill of problem diagnosis before solution',
    ],
    body: [
      'There is a principle in engineering and design called "the problem statement problem." It states that most failures in problem-solving occur not because the solution was wrong, but because the wrong problem was being solved. This is more common than it seems and more costly than most people realize.',
      'When a problem appears, our instinct is to solve it. Immediately. We jump to solutions — changes, fixes, interventions — before we have genuinely understood what is causing the problem. The result: we apply the right solution to the wrong problem. The symptom improves temporarily. The underlying issue persists.',
      'The diagnostic question that changes everything is: "What is actually happening?" Not "what should I do?" but "what is really going on here?" This question invites investigation rather than reaction. It slows the problem-solving process just enough to ensure you are working on the right thing.',
      'A powerful tool for identifying the real problem is the *Five Whys* technique, developed by Sakichi Toyoda and popularized by Toyota\'s production system. When a problem occurs, ask "Why?" Record the answer. Then ask "Why?" again about that answer. Repeat five times. By the fifth Why, you have usually reached the root cause rather than the surface symptom.',
      'Example: A team consistently misses deadlines. Why? Because tasks take longer than estimated. Why? Because scope is unclear at the start of projects. Why? Because requirements are not finalized before work begins. Why? Because stakeholders are not engaged early in the process. Why? Because there is no formal stakeholder engagement protocol. The real problem is not "people are slow" — it is "we lack a process." Completely different solution.',
    ],
    keyTakeaways: [
      'Most problem-solving fails because the wrong problem is being solved',
      'Ask "What is actually happening?" before asking "What should I do?"',
      'The Five Whys technique reveals root causes beneath surface symptoms',
      'A precisely defined problem is already halfway solved',
    ],
    practicalExercise: 'Identify one recurring problem in your life or work — something that keeps happening despite your efforts to fix it. Apply the Five Whys technique: state the problem, ask "Why is this happening?" five consecutive times, recording each answer. By the fifth iteration, you should have reached a root cause you had not previously considered. What new solution does this reveal?',
    summary: 'The real problem is rarely the visible problem. Developing the habit of diagnosing before prescribing — of asking Why multiple times before deciding What — produces solutions that actually work.',
  },
  'dcst-1-3': {
    objectives: [
      'Learn to evaluate consequences before making decisions',
      'Understand second and third-order consequences',
      'Develop a future-thinking habit for better decision quality',
    ],
    body: [
      'Every decision has consequences. First-order consequences are the immediate, obvious, intended outcomes. Second-order consequences are what happens as a result of those first-order outcomes. Third-order consequences are what happens after that. Most people only think about first-order consequences. This is one of the most costly thinking errors in decision-making.',
      'Consider a simple example: You decide to cut costs by reducing staff. First-order consequence: payroll decreases. Second-order consequence: remaining staff are overworked, morale falls, quality deteriorates. Third-order consequence: key employees leave, clients are lost, revenue drops more than the cost savings. The decision that looked smart at first-order thinking was disastrous at third-order thinking.',
      'Thinking about consequences does not require perfect prediction. It requires the discipline of asking "And then what?" multiple times before committing to a course of action. This simple question extends your thinking horizon beyond the immediate and reveals patterns that would otherwise remain invisible until it is too late.',
      'Time perspective is also crucial. Short-term thinking asks: "What will this look like in the next few days or weeks?" Long-term thinking asks: "What will this look like in six months? In two years? In ten years?" Many decisions that feel comfortable in the short-term create significant long-term problems. Many decisions that feel difficult in the short-term create significant long-term advantages.',
      'The "future self" framework is useful here. Before a major decision, ask: "How will my future self, looking back at this moment, evaluate this choice?" This perspective shift changes the emotional weighting of the decision. It de-emphasizes immediate comfort and emphasizes long-term alignment — which consistently leads to better decisions.',
    ],
    keyTakeaways: [
      'Second and third-order consequences determine the true impact of any decision',
      'Ask "And then what?" repeatedly before committing to any course of action',
      'Long-term perspective consistently produces better decisions than short-term comfort',
      'The future self framework shifts emotional weighting toward meaningful outcomes',
    ],
    practicalExercise: 'Choose one significant decision you are currently facing. On a piece of paper, map it out in three columns: First-order consequences (immediate outcomes), Second-order consequences (results of those outcomes), Third-order consequences (results of those results). Then ask: "How does this look to my future self in two years?" Use this map to inform your decision.',
    summary: 'Consequence thinking is the habit of looking further ahead than feels natural. When you train yourself to see second and third-order effects, your decisions become demonstrably better — and your future reflects it.',
  },
  'dcst-1-4': {
    objectives: ['Assess your understanding of Module 1: Understanding Clear Thinking'],
    body: ['Answer all questions and submit for feedback.'],
    quizQuestions: [
      {
        question: 'What is the primary difference between reactive thinking and clear thinking?',
        options: ['Reactive thinking is slower and more deliberate', 'Clear thinking is emotional and fast; reactive thinking is rational', 'Reactive thinking is driven by emotion; clear thinking is deliberate and rational', 'They are the same cognitive process'],
        correct: 2,
      },
      {
        question: 'What does the Five Whys technique help you identify?',
        options: ['The five most important decisions you need to make', 'The root cause of a problem rather than its surface symptom', 'Five alternative solutions to a problem', 'Five stakeholders involved in a decision'],
        correct: 1,
      },
      {
        question: 'What are "second-order consequences" in decision-making?',
        options: ['The second decision you need to make', 'The outcomes that result from the first-order outcomes of a decision', 'Minor consequences not worth considering', 'Consequences that happen immediately'],
        correct: 1,
      },
    ],
    summary: 'Module 1 complete. You understand reactive vs. clear thinking, root cause analysis, and consequence mapping. Module 2 introduces structured decision-making frameworks.',
  },

  // Module 2
  'dcst-2-1': {
    objectives: [
      'Learn how to define a decision with precision before evaluating options',
      'Understand why ambiguous decision framing leads to poor choices',
      'Develop a habit of decision definition as the first step of any major choice',
    ],
    body: [
      'Before you can make a good decision, you must know exactly what you are deciding. This sounds obvious but is rarely practiced. Most decisions are made with fuzzy, undefined parameters — which makes it impossible to evaluate options fairly or know when a decision has been successfully made.',
      'A well-defined decision has four components. First, the *decision statement*: a clear, specific sentence describing what exactly is being decided. Not "What should we do about marketing?" but "Should we increase our digital advertising budget by 20% for Q3, and if so, which channels should we prioritize?" The precision transforms a vague deliberation into a solvable problem.',
      'Second, the *decision criteria*: the standards against which you will evaluate options. What matters most? Cost? Speed? Risk level? Alignment with strategy? Quality? These criteria should be defined before options are evaluated — not after. If you define criteria after seeing options, you unconsciously reverse-engineer them to justify the option you already prefer.',
      'Third, the *constraints*: the non-negotiable limits within which the decision must be made. Time, budget, legal requirements, resource availability. These are not criteria to weigh — they are filters. Options that violate constraints are automatically eliminated.',
      'Fourth, the *decision maker*: who has authority to make this decision? In group settings, ambiguous decision authority is one of the most common causes of poor outcomes. The RACI model — Responsible, Accountable, Consulted, Informed — is a useful framework for clarifying who decides, who inputs, and who is simply notified.',
    ],
    keyTakeaways: [
      'A precisely defined decision statement transforms vagueness into a solvable problem',
      'Decision criteria must be established before options are evaluated to avoid bias',
      'Constraints are non-negotiable filters, not criteria to weigh',
      'Ambiguous decision authority is a major cause of poor group decisions',
    ],
    practicalExercise: 'Take one decision you are currently facing and write a full decision definition: (1) Decision statement (specific, one sentence), (2) Three most important criteria for evaluating options, (3) Non-negotiable constraints, (4) Who makes the final call. Review this definition before evaluating any options. Notice how much clearer the path becomes.',
    summary: 'Defining a decision before deciding is the first discipline of clear thinking. When you know precisely what you are deciding and by what criteria, the path to a good decision becomes dramatically clearer.',
  },
  'dcst-2-2': {
    objectives: [
      'Learn how to systematically generate and evaluate options',
      'Understand why expanding the option space improves decision quality',
      'Avoid the binary thinking trap that limits decision potential',
    ],
    body: [
      'One of the most consistent findings in decision science is that people generate far too few options before deciding. The average decision-maker considers just two alternatives: the obvious choice and one other. This is almost always insufficient. The best decision is rarely among the first two options you consider.',
      'The first discipline in option generation is *resisting premature closure* — the tendency to settle on an option before adequately exploring the space. When you feel you have found "the answer" within the first five minutes of deliberation, that is usually a sign that you have not thought broadly enough. Force yourself to generate at least three or four genuine alternatives before evaluating any.',
      'One powerful technique for expanding options is the "multiverse" approach: ask "In a parallel world where my first choice is not available, what would I do?" This question forces new thinking paths. Another is the "opposite" approach: identify what you absolutely would not do, and then ask what the reasons for avoiding it might actually reveal about what you value.',
      'Evaluation — once options are defined — should be done systematically against the criteria you established in the decision definition phase. A simple decision matrix works well: list options as rows, criteria as columns, score each option against each criterion (1-5), weight criteria by importance, calculate weighted scores. The matrix does not make the decision for you, but it makes your thinking visible, testable, and defensible.',
      'One important caution: do not confuse the most familiar option with the best option. Familiarity creates false comfort. The option you have used before feels safer precisely because it is known — not necessarily because it is superior. New options should always be evaluated against criteria, not against comfort level.',
    ],
    keyTakeaways: [
      'Most people generate too few options — force at least three or four alternatives before evaluating',
      'Resist premature closure: the best answer is rarely among the first two options',
      'Decision matrices make evaluation visible, structured, and defensible',
      'Familiarity is not a criterion — separate comfort from quality in evaluation',
    ],
    practicalExercise: 'For your current or next significant decision, generate at least five distinct options before evaluating any. Use the "multiverse" question for options three, four, and five: "If my top choice were not available, what would I do?" Then create a simple decision matrix: rate each option against your top three criteria. Which option scores highest? Does that surprise you?',
    summary: 'The breadth of your option space determines the ceiling of your decision quality. When you resist settling early and deliberately expand your alternatives, you access choices you would have otherwise never considered.',
  },
  'dcst-2-3': {
    objectives: [
      'Learn how to evaluate risk and reward across decision options',
      'Understand asymmetric risk and how to identify it',
      'Develop a consistent framework for risk assessment',
    ],
    body: [
      'Every decision involves risk. The question is never "can I avoid risk?" but "which risks am I willing to take, and are the potential rewards worth them?" People who make excellent decisions over time are not those who avoid risk — they are those who accurately assess it.',
      'The fundamental risk-reward analysis asks two questions for every option: "What is the best realistic outcome if this works?" and "What is the worst realistic outcome if it does not?" The ratio between these two answers is the risk-reward profile of that option. An option with a moderate upside and a catastrophic downside has a poor risk-reward profile regardless of how likely success seems.',
      'Asymmetric risk is the concept that deserves particular attention. Asymmetric downside risk means: if this goes wrong, the consequences are severe and potentially irreversible. When any option has asymmetric downside risk, it should be weighted heavily against even if the probability of failure seems low. The irreversibility is the key factor — you cannot unscramble certain eggs.',
      'Probability calibration is another critical skill. Most people are poorly calibrated in their probability estimates — they are overconfident that good outcomes will occur and underestimate the likelihood of problems. Research by Kahneman, Tversky, and others consistently shows that humans overestimate their control over outcomes and underestimate variance. Adding a "pre-mortem" to your analysis helps: imagine the option has failed spectacularly — what most likely caused it? This exercise surfaces risks you would otherwise miss.',
      'Finally, consider the *reversibility* of each option. If a decision can be reversed or corrected easily, the cost of a wrong choice is low, and you should lean toward decisive action. If a decision cannot be easily reversed, it deserves proportionally more deliberation. Jeff Bezos famously categorized decisions as "two-way doors" (reversible) and "one-way doors" (irreversible) — applying different levels of rigor to each.',
    ],
    keyTakeaways: [
      'Good decision-makers assess risk accurately, not avoid it entirely',
      'Asymmetric downside risk deserves heavy weighting even at low probability',
      'Pre-mortem analysis reveals risks that forward-looking analysis misses',
      'Reversible decisions warrant action; irreversible decisions warrant deep deliberation',
    ],
    practicalExercise: 'For one current decision, conduct a pre-mortem analysis: imagine you chose this option and it failed completely two years from now. Write a 150-word narrative of how and why it failed. What specific risks does this reveal? Now evaluate: are these risks manageable or potentially irreversible? Use this assessment to adjust how much weight you give this option.',
    summary: 'Risk assessment is not pessimism — it is realism in service of better decisions. When you accurately map the risk-reward landscape, you make choices that are genuinely informed rather than optimistically assumed.',
  },
  'dcst-2-4': {
    objectives: ['Assess your understanding of Module 2: Decision-Making Frameworks'],
    body: ['Answer all questions and submit for feedback.'],
    quizQuestions: [
      {
        question: 'Why should decision criteria be established before evaluating options?',
        options: ['To make the process faster', 'To avoid unconsciously reverse-engineering criteria to justify a preferred option', 'To reduce the number of options considered', 'To involve fewer people in the decision'],
        correct: 1,
      },
      {
        question: 'What does "asymmetric risk" refer to in decision-making?',
        options: ['Risks that only affect one side of a negotiation', 'When the downside is potentially severe and irreversible while the upside is limited', 'When risk is distributed unequally among team members', 'Risks that occur in one direction only'],
        correct: 1,
      },
      {
        question: 'What is a pre-mortem analysis?',
        options: ['Reviewing a past decision\'s outcomes', 'Imagining an option has already failed and identifying what caused it', 'Evaluating risks before they occur in real-time', 'A final review before submitting a decision'],
        correct: 1,
      },
    ],
    summary: 'Module 2 complete. You now have structured frameworks for defining decisions, generating options, and evaluating risk and reward. Module 3 introduces strategic thinking.',
  },

  // Module 3
  'dcst-3-1': {
    objectives: [
      'Understand the fundamental difference between short-term and long-term thinking',
      'Recognize how short-term bias affects decision quality',
      'Develop a practice of long-term perspective in daily decisions',
    ],
    body: [
      'Human brains are naturally wired for short-term thinking. In evolutionary terms, immediate threats required immediate responses. Long-term planning was a luxury. Today, that same short-term bias operates in a world that rewards long-term thinking — creating a persistent mismatch between how our brains are wired and what produces good outcomes.',
      'Short-term thinking optimizes for immediate comfort, quick wins, and visible results. It avoids the discomfort of delay, the uncertainty of compound investment, and the discipline of deferred gratification. The consequences accumulate invisibly until they become visible crises: financial instability, deteriorating health, eroded relationships, underdeveloped skills.',
      'Long-term thinking operates on a different time horizon. It asks: "What will serve me — and the people and systems I am part of — in three years? In five? In ten?" These questions shift the criteria for decision-making away from "what feels best now" toward "what is actually best." The discipline required is significant. The results are proportional.',
      'One of the most practical tools for developing long-term thinking is the *10-10-10* framework, introduced by Suzy Welch. Before any significant decision, ask: "How will I feel about this choice in 10 minutes? In 10 months? In 10 years?" Decisions that feel comfortable at 10 minutes but regrettable at 10 months and 10 years are short-term choices with long-term costs. Decisions that feel difficult at 10 minutes but rewarding at 10 months and 10 years are long-term investments worth making.',
      'Organizations that outperform over decades consistently prioritize long-term value over short-term metrics. Amazon famously told shareholders in its first letter that it would sacrifice short-term profitability to build long-term infrastructure. That commitment produced one of the most valuable companies in history. The same principle applies to careers, relationships, health, and skills.',
    ],
    keyTakeaways: [
      'Short-term bias is hardwired — long-term thinking requires deliberate practice',
      'The 10-10-10 framework shifts perspective across three time horizons simultaneously',
      'Short-term comfort and long-term optimization often point in opposite directions',
      'Organizational and personal excellence are built on long-term thinking disciplines',
    ],
    practicalExercise: 'Apply the 10-10-10 framework to one decision you are facing. Write your answers to: (1) How will I feel about this in 10 minutes? (2) How will I feel in 10 months? (3) How will I feel in 10 years? If the answers diverge significantly — especially if 10 minutes looks better but 10 years looks worse — treat that divergence as a signal. What does it tell you?',
    summary: 'Long-term thinking is a discipline that must be practiced against the natural pull of short-term comfort. When you consistently apply it, your decisions — and their outcomes — reflect that investment.',
  },
  'dcst-3-2': {
    objectives: [
      'Learn principles and frameworks for effective prioritization',
      'Understand the difference between urgency and importance',
      'Develop a system for focusing energy on what matters most',
    ],
    body: [
      'Prioritization is not simply organizing a to-do list. It is the strategic discipline of deciding what matters most, what can wait, and what should be eliminated entirely. Done well, prioritization multiplies your effectiveness. Done poorly, it leaves you busy with low-value activities while high-value outcomes wait indefinitely.',
      'The most widely used prioritization framework is the *Eisenhower Matrix*, named after President Dwight D. Eisenhower who described his most effective time management principle. The matrix divides activities into four quadrants based on two dimensions: urgency (does it need immediate attention?) and importance (does it meaningfully contribute to your goals?).',
      'Quadrant 1: Urgent and Important — crises, deadlines, emergencies. These must be done now. Quadrant 2: Not Urgent but Important — strategic planning, skill development, relationship building, health. These are where your highest leverage lies and are chronically neglected. Quadrant 3: Urgent but Not Important — many meetings, most interruptions, some emails. These should be delegated. Quadrant 4: Not Urgent and Not Important — time-wasting activities. These should be eliminated.',
      'Most people spend the majority of their time in Quadrant 1 (firefighting) and Quadrant 3 (responding to others\' urgencies). The result is reactive, exhausted, and low-impact work. The highest performers spend deliberate, protected time in Quadrant 2 — working on what matters before it becomes urgent.',
      'Prioritization also requires the discipline of saying no. Every yes to one activity is a no to another. When your calendar fills with Quadrant 3 activities, there is no room for Quadrant 2 investment. Protecting Quadrant 2 time requires explicitly declining or delegating non-important urgent requests — a skill that requires both judgment and confidence.',
    ],
    keyTakeaways: [
      'Prioritization is a strategic discipline, not a to-do list exercise',
      'The Eisenhower Matrix distinguishes urgency from importance across four quadrants',
      'Quadrant 2 — not urgent but important — is where highest leverage work lives',
      'Every yes is a no to something else; protecting important time requires saying no',
    ],
    practicalExercise: 'List every task or activity on your current plate. Place each in one of the four Eisenhower quadrants. Count how many items fall in each quadrant. Now ask: (1) What can I delegate from Quadrant 3? (2) What can I eliminate from Quadrant 4? (3) What Quadrant 2 activities am I currently neglecting? Block two hours this week for Quadrant 2 work.',
    summary: 'Prioritization is the skill that separates productivity from busyness. When you consistently focus on what is important — not just what is urgent — your work and your life reflect a fundamentally different level of intentionality.',
  },
  'dcst-3-3': {
    objectives: [
      'Learn the foundations of forward planning for professional and personal outcomes',
      'Understand how to work backward from a desired outcome',
      'Develop a planning discipline that makes strategy actionable',
    ],
    body: [
      'Planning ahead is not optimism — it is engineering. It is the discipline of envisioning a desired future state and reverse-engineering the steps required to produce it. People who plan consistently outperform those who do not, not because they predict the future accurately, but because their plans create direction, surface obstacles early, and allow for course correction.',
      'The most effective planning methodology is *backward planning* — also called reverse engineering or beginning with the end in mind. Start by defining the desired outcome precisely: not "I want to improve professionally" but "By December 31st, I will have completed three speaking engagements and received measurable feedback on my communication skills." Then work backward: What needs to happen in Q4? Q3? Q2? This month? This week? Today?',
      'Planning without milestones is aspiration, not strategy. Milestones are interim checkpoints that confirm progress and signal when course correction is needed. They should be specific, time-bound, and measurable. "Progress is going well" is not a milestone. "By March 15th, the first draft is complete and reviewed by two stakeholders" is a milestone.',
      'Scenario planning is the advanced form of planning ahead. Instead of planning one path forward, you develop two or three scenarios — a baseline scenario, an optimistic scenario, and a challenging scenario — and prepare responses to each. This does not mean predicting which will occur. It means being ready when circumstances shift, which they inevitably will.',
      'The planning paradox: plans rarely survive contact with reality unchanged. This does not make planning futile — it makes adaptation possible. A plan gives you a baseline from which to measure deviation. Without a plan, there is no deviation — only chaos. The discipline of planning creates the structure within which intelligent adaptation can occur.',
    ],
    keyTakeaways: [
      'Backward planning — starting with the end and working backward — produces the most actionable plans',
      'Milestones convert aspirations into measurable, time-bound checkpoints',
      'Scenario planning prepares you for change without requiring accurate prediction',
      'Plans are baselines for adaptation, not rigid commitments — the value is in the planning process itself',
    ],
    practicalExercise: 'Choose one goal you want to achieve in the next 90 days. Define it precisely. Then use backward planning: work from the 90-day mark backward to today, identifying every major milestone required. Create a timeline with at least four specific milestones. Now ask: "If this went better than expected, what would the optimistic scenario look like? If this got harder, what is the challenging scenario and how would I adapt?"',
    summary: 'Planning ahead transforms intention into strategy. When you work backward from clear outcomes and build milestones as checkpoints, you create a roadmap that guides action even when circumstances change.',
  },
  'dcst-3-4': {
    objectives: ['Assess your understanding of Module 3: Strategic Thinking'],
    body: ['Answer all questions and submit for feedback.'],
    quizQuestions: [
      {
        question: 'What does the 10-10-10 framework help you evaluate?',
        options: ['Ten decision alternatives at once', 'How you will feel about a decision in 10 minutes, 10 months, and 10 years', 'Ten risk factors of a major decision', 'A decision-making process with ten steps'],
        correct: 1,
      },
      {
        question: 'In the Eisenhower Matrix, which quadrant represents the highest-leverage work?',
        options: ['Urgent and Important', 'Not Urgent and Not Important', 'Not Urgent but Important', 'Urgent but Not Important'],
        correct: 2,
      },
      {
        question: 'What is backward planning?',
        options: ['Reviewing past decisions for learning', 'Starting with a desired future outcome and working backward to identify required steps', 'Planning for worst-case scenarios only', 'Reversing a decision after it has been made'],
        correct: 1,
      },
    ],
    summary: 'Module 3 complete. Long-term thinking, prioritization, and planning ahead are now part of your strategic toolkit. Module 4 addresses cognitive biases that undermine clear decisions.',
  },

  // Module 4 & 5 placeholders follow same pattern
  'dcst-4-1': {
    objectives: ['Recognize how emotions distort decision-making', 'Learn tools to separate emotion from evaluation'],
    body: [
      'Emotions are not enemies of good decision-making — unexamined emotions are. Research by neuroscientist Antonio Damasio shows that completely emotion-free decisions are actually worse, because emotions carry important information about our values and priorities. The problem arises when emotions hijack the process rather than inform it.',
      'The most dangerous emotional states for decision-making are high arousal states: anger, excitement, anxiety, and grief. In these states, the brain\'s threat-detection and reward-seeking systems are dominant, and the prefrontal cortex — responsible for rational evaluation — is functionally impaired. Making major decisions in these states reliably produces regret.',
      'The discipline of emotional decision-making has one primary rule: never make a significant, irreversible decision in a high-arousal emotional state. The feelings that make immediate action feel urgent are precisely the feelings that make good decisions least likely. When you feel a strong emotional pull toward immediate action, that feeling is a signal to wait — not a reason to proceed.',
      'Sleep is one of the most reliable decision quality enhancers available. Research consistently shows that sleeping on a decision — even for one night — produces measurably different and generally better choices. The brain continues processing during sleep, and the emotional intensity of the previous day diminishes, allowing clearer evaluation. "Sleep on it" is evidence-based advice.',
      'The tool that most reliably separates emotion from evaluation is writing. Write out the decision, your options, and your emotional state. Then set it aside for a defined period — an hour, a day, a weekend — and revisit it with fresh eyes. What you wrote reveals the emotional coloring. The fresh read reveals what the rational brain would choose.',
    ],
    keyTakeaways: [
      'Emotions carry information — unexamined emotions distort decisions',
      'Never make significant irreversible decisions in high-arousal emotional states',
      'Sleeping on decisions is evidence-based, not procrastination',
      'Writing out decisions externalizes and reveals emotional biases',
    ],
    practicalExercise: 'Identify a decision you made in the last month that you now question. Reconstruct your emotional state at the time of the decision. Were you excited, anxious, frustrated, or pressured? How did that state affect the choice you made? What would you decide now, with a calmer and clearer mind? Use this reflection to identify your personal emotional decision-making vulnerabilities.',
    summary: 'Emotional intelligence in decision-making is not suppressing emotions — it is knowing when they are informing you versus when they are distorting you. The discipline of waiting is the most powerful antidote.',
  },
  'dcst-4-2': {
    objectives: ['Understand what confirmation bias is and how it distorts evaluation', 'Learn strategies for seeking disconfirming information'],
    body: [
      'Confirmation bias is the tendency to seek, interpret, and remember information in a way that confirms what we already believe or want to believe. It is one of the most pervasive and consequential cognitive biases in human decision-making, and it operates almost entirely outside our awareness.',
      'The mechanics are straightforward: once you form a preliminary preference or belief, your brain begins filtering incoming information through that preference. Evidence that supports it feels compelling and clear. Evidence that contradicts it feels weak or irrelevant. Over time, your confidence in the original belief increases — not because you have found more evidence, but because you have filtered out the evidence against it.',
      'Confirmation bias is especially dangerous in high-stakes decisions because the higher our emotional investment in an outcome, the stronger the bias operates. We want a candidate to be right for the role, so we notice their strengths and discount their weaknesses. We want an investment to perform, so we focus on the optimistic forecasts and minimize the bearish signals.',
      'The antidote to confirmation bias is *active search for disconfirming information*. Before finalizing any significant decision, explicitly ask: "What would I need to see to change my mind?" Then go look for it. Read the opposing argument. Talk to someone who disagrees with your preferred option. If you cannot find any disconfirming information — if everything you encounter seems to support your view — you are almost certainly inside a confirmation bubble.',
      'The practice of "steel-manning" is particularly valuable. Steel-manning is the opposite of straw-manning: instead of creating the weakest version of the opposing argument, you construct the strongest version. You argue for the opposite position as compellingly as you can. If you cannot make a strong case for the other side, you have not understood it well enough to make an informed decision.',
    ],
    keyTakeaways: [
      'Confirmation bias filters information to support existing beliefs — largely unconsciously',
      'Emotional investment in an outcome amplifies confirmation bias',
      'Actively seek disconfirming information before finalizing significant decisions',
      'Steel-manning — making the strongest case for the opposition — builds genuine understanding',
    ],
    practicalExercise: 'Choose a belief or preference you hold with confidence. Spend 30 minutes actively seeking the strongest possible arguments against it. Do not look for weak objections — find the best counterarguments available. After the exercise: Has your confidence changed? Have you updated your view? What did the exercise reveal about your information environment?',
    summary: 'Confirmation bias is not a character flaw — it is a feature of human cognition. Knowing it exists and building systematic habits to counteract it is the mark of a genuinely clear thinker.',
  },
  'dcst-4-3': {
    objectives: ['Understand what overthinking is and why it impairs decision quality', 'Learn strategies for making decisions without paralysis'],
    body: [
      'Overthinking is the cognitive trap of processing a decision far beyond the point where additional thinking produces additional clarity. Past a certain threshold, more thinking does not produce better decisions — it produces anxiety, exhaustion, and paralysis. The challenge is that the threshold is invisible from inside the process.',
      'Research by psychologist Barry Schwartz — articulated in The Paradox of Choice — shows that more options and more deliberation correlate with lower satisfaction with outcomes. Maximizers (those who try to find the objectively best option) consistently report lower wellbeing than satisficers (those who look for "good enough"). The pursuit of perfect information and the perfect choice is itself a barrier to good decisions.',
      'One root cause of overthinking is perfectionism — the belief that a wrong decision is worse than no decision at all. This belief is almost always false. A wrong decision can be corrected, learned from, and reversed in most cases. No decision allows situations to deteriorate passively while maintaining the illusion that you still have options. Inaction is itself a choice, with its own consequences.',
      'The most practical antidote to overthinking is *time-boxing your deliberation*. Before starting to evaluate a decision, decide how much time it deserves. A minor operational decision: 10 minutes. A moderate professional decision: one week. A major life decision: one month. When the time box expires, you commit. This forces prioritization of your thinking time and prevents indefinite loops.',
      'The "good enough" standard — borrowed from satisficing theory — is another powerful tool. Define in advance what "good enough" looks like for this decision. Once you identify an option that meets that standard, commit. Continuing to search for something better almost always costs more in time, energy, and opportunity than the marginal improvement could possibly provide.',
    ],
    keyTakeaways: [
      'Overthinking does not improve decisions — past a threshold, it impairs them',
      'Inaction is itself a decision with consequences — it is not a safe default',
      'Time-boxing deliberation prevents indefinite loops and forces commitment',
      'The satisficing standard — "good enough" — consistently outperforms maximizing in wellbeing and efficiency',
    ],
    practicalExercise: 'Identify a decision you have been overthinking. First, define "good enough" for this decision — what would an acceptable outcome look like? Second, set a specific deadline for making the decision (no more than 72 hours from now). Third, identify which of the current options meets the "good enough" standard. Commit to that option before your deadline. Reflect on how it feels to have decided.',
    summary: 'Overthinking is the enemy of action and often masquerades as thoroughness. The discipline of time-boxing and the practice of satisficing frees you from paralysis and restores decision momentum.',
  },
  'dcst-4-4': {
    objectives: ['Assess your understanding of Module 4: Avoiding Cognitive Mistakes'],
    body: ['Answer all questions and submit for feedback.'],
    quizQuestions: [
      {
        question: 'What is the primary problem with making important decisions in high-arousal emotional states?',
        options: ['Decisions made quickly tend to be worse', 'The prefrontal cortex is functionally impaired, reducing rational evaluation', 'Emotions always lead to wrong decisions', 'High-arousal states reduce creativity'],
        correct: 1,
      },
      {
        question: 'What does "steel-manning" an opposing argument mean?',
        options: ['Finding the weakest version of an opposing view to dismiss it', 'Constructing the strongest possible version of the opposing argument', 'Using physical metaphors in debate', 'Delegating difficult arguments to others'],
        correct: 1,
      },
      {
        question: 'What is the "satisficing" approach to decisions?',
        options: ['Always seeking the mathematically optimal choice', 'Making no decision until perfect information is available', 'Choosing an option that meets a "good enough" standard and committing', 'Satisfying the needs of all stakeholders equally'],
        correct: 2,
      },
    ],
    summary: 'Module 4 complete. You now understand how to recognize and manage emotional decisions, confirmation bias, and overthinking. Final module: Problem Solving and Execution.',
  },

  'dcst-5-1': {
    objectives: ['Learn how to decompose complex problems into solvable steps', 'Understand the power of structured problem decomposition'],
    body: [
      'Every complex problem, when examined closely, is a collection of simpler problems. The skill of breaking problems into steps — also called problem decomposition — is the foundation of effective problem-solving in every professional domain.',
      'The first step in decomposition is to clearly state the problem in a single sentence. Not the symptoms. Not the causes. The problem itself. "Our customer retention rate has fallen from 85% to 72% over 18 months." This specificity makes the problem concrete and measurable.',
      'Then ask: "What are the component parts of this problem?" A retention problem might decompose into: product satisfaction issues, customer service failures, competitive alternatives, pricing misalignment, and communication gaps. Each of these is now a smaller, more tractable problem with its own causes and solutions.',
      'Decomposition also reveals which components are within your control and which are not. Separating controllable from uncontrollable factors prevents wasted energy on unchangeable conditions and focuses effort where it can actually make a difference.',
      'The *MECE* principle (Mutually Exclusive, Collectively Exhaustive) from McKinsey consulting provides a useful standard for decomposition. Your components should be MECE: no overlap between categories, and together they should cover the entire problem space. If components overlap or leave gaps, your decomposition is incomplete and will lead to incomplete solutions.',
    ],
    keyTakeaways: [
      'Complex problems are collections of simpler problems — decompose before solving',
      'State the problem specifically and measurably before beginning decomposition',
      'Separate controllable from uncontrollable factors to focus effort effectively',
      'MECE decomposition — mutually exclusive, collectively exhaustive — ensures complete analysis',
    ],
    practicalExercise: 'Take one complex problem from your life or work. Write it in one specific, measurable sentence. Then decompose it into at least four distinct component problems. For each component, ask: "Is this within my control?" and "What are the two or three most likely causes?" You now have a map of the problem space — the precondition for solving it effectively.',
    summary: 'Problems that feel overwhelming in their entirety become manageable when broken into components. Decomposition is not just an analytical tool — it is a psychological intervention that makes action possible.',
  },
  'dcst-5-2': {
    objectives: ['Learn how to translate decisions into specific, executable action plans', 'Understand the elements of an effective action plan'],
    body: [
      'A decision without an action plan is an intention. Intentions do not produce results — actions do. The gap between deciding and doing is where most initiatives fail, most goals go unmet, and most good ideas die. Bridging that gap requires a structured action plan.',
      'An effective action plan has five elements. First, *specific actions* — not "work on the project" but "complete the competitive analysis section of the proposal." Second, *owners* — every action has one person responsible for it. When everyone is responsible, no one is. Third, *deadlines* — specific dates, not "soon" or "by end of month." Fourth, *resources* — what does this action require in terms of time, budget, tools, or support? Fifth, *success criteria* — how will you know this action has been completed to the right standard?',
      'The implementation intention is a research-backed technique for dramatically increasing follow-through. Instead of stating a goal, you state it as an if-then plan: "When [situation], I will [action]." Studies by psychologist Peter Gollwitzer found that implementation intentions increase goal achievement by 200-300% compared to goal-setting alone. "I will complete the competitive analysis" becomes "When I sit down at my desk on Tuesday morning, the first thing I will do is open the competitive analysis document and work on it for 90 minutes before checking email."',
      'Accountability structures multiply action plan effectiveness. Telling someone else your commitment creates social accountability. Weekly check-ins — even brief — create review pressure. Public commitments are more likely to be kept than private ones. The accountability partner does not need to supervise your work; they simply need to know you committed.',
      'Progress tracking is the final element. Without tracking, there is no way to know whether you are on course. Tracking does not need to be complex — a simple checklist, a weekly review, or a progress chart is sufficient. The act of measuring creates momentum: completion feels satisfying and drives further action.',
    ],
    keyTakeaways: [
      'Every action must have a specific owner, deadline, and success criteria',
      'Implementation intentions — if-then plans — increase follow-through by 200-300%',
      'Accountability structures, even simple ones, dramatically increase completion rates',
      'Progress tracking creates momentum and provides early warning of deviation',
    ],
    practicalExercise: 'Take one of your current goals and convert it into a full action plan: List every specific action, assign an owner (even if it is all you), set a deadline for each, identify required resources, and define what "done" looks like. Then convert your first action into an implementation intention: "When [situation], I will [specific action]." Commit to beginning within the next 48 hours.',
    summary: 'An action plan transforms a decision into a system. When you specify who does what, by when, with what resources, and to what standard, execution becomes inevitable rather than aspirational.',
  },
  'dcst-5-3': {
    objectives: ['Learn how to evaluate outcomes for learning and improvement', 'Develop a structured after-action review practice'],
    body: [
      'Most people make a decision, implement it, experience the outcome, and move on. The learning that outcomes could generate — the insight that would make the next decision better — is left on the table. Reviewing outcomes is the discipline that converts experience into expertise.',
      'The military\'s After Action Review (AAR) is one of the most effective outcome review processes ever developed. It asks four questions: What was planned? What actually happened? Why was there a difference? What will we do differently next time? These four questions, applied honestly, produce profound learning from every significant outcome — success and failure alike.',
      'Outcome reviews require psychological safety — the willingness to examine what went wrong without judgment or blame. The most common barrier to honest outcome review is ego protection: we attribute successes to our skill and failures to external circumstances. This attribution error prevents learning and ensures the same mistakes recur.',
      'Regular review cadences build reflection into practice. Weekly: what did I decide and how is it playing out? Monthly: what are the patterns in my decisions and outcomes over the past 30 days? Quarterly: what decisions most significantly shaped this quarter, and what do they reveal about my decision-making tendencies? These reviews, kept brief and consistent, compound into significant self-knowledge over time.',
      'The goal of outcome review is not to be harder on yourself — it is to be more accurate. The most successful people in any field have a distinctive relationship with failure: they treat it as data, not verdict. Each failed decision is information about the world, about their own cognitive patterns, and about what to change. This orientation toward learning converts even poor decisions into long-term assets.',
    ],
    keyTakeaways: [
      'Outcome review converts experience into expertise — skipping it leaves learning on the table',
      'The After Action Review: planned vs. actual, why the difference, what to change',
      'Honest review requires confronting attribution error — our tendency to blame externals for failures',
      'Regular review cadences compound into significant self-knowledge over time',
    ],
    practicalExercise: 'Conduct a personal After Action Review for one significant decision or project from the past three months. Answer all four questions in writing: (1) What was planned? (2) What actually happened? (3) Why was there a difference? (4) What will I do differently next time? Be rigorously honest, particularly in question 3. What does this reveal about your decision-making tendencies?',
    summary: 'Reviewing outcomes is how experience becomes wisdom. Without deliberate reflection, we repeat the same patterns in different disguises. With it, we compound our judgment and become progressively better at the decisions that shape our lives.',
  },
  'dcst-5-4': {
    objectives: ['Complete the final assessment for Course 2: Decision Clarity & Strategic Thinking'],
    body: ['This final assessment covers all five modules. Completion earns your Decision Clarity & Strategic Thinking Certificate.'],
    quizQuestions: [
      {
        question: 'What does the MECE principle in problem decomposition stand for?',
        options: ['Most Effective Cognitive Evaluation', 'Mutually Exclusive, Collectively Exhaustive', 'Multiple Ends, Centralized Execution', 'Managed Evidence for Clear Evaluation'],
        correct: 1,
      },
      {
        question: 'Research by Peter Gollwitzer found that implementation intentions increase goal achievement by approximately:',
        options: ['10-20%', '50-75%', '200-300%', 'They have no significant effect'],
        correct: 2,
      },
      {
        question: 'What is the primary purpose of an After Action Review?',
        options: ['To assign blame for failures', 'To document outcomes for compliance purposes', 'To convert experience into learning by examining planned vs. actual outcomes', 'To celebrate successes and reward the team'],
        correct: 2,
      },
    ],
    summary: 'Congratulations — you have completed Decision Clarity & Strategic Thinking. You now have a comprehensive decision-making system covering clear thinking, frameworks, strategy, bias management, and execution. Your certificate is ready.',
  },
};

// ════════════════════════════════════════
// COURSE 3: Digital Mindfulness & Modern Life Balance
// ════════════════════════════════════════
const DMML_CONTENT: Record<string, LessonContent> = {
  'dmml-1-1': {
    objectives: ['Understand the mechanisms that make digital distraction so pervasive', 'Recognize how technology is designed to capture and hold attention'],
    body: [
      'Digital distraction is not an accident. It is the product of sophisticated engineering designed by teams of behavioral psychologists and product designers to maximize the time you spend on digital platforms. Understanding this design intent is the first step to reclaiming control of your attention.',
      'Social media platforms, messaging apps, and video services are built around a concept called *variable reward schedules* — the same mechanism that makes slot machines so addictive. Every time you pull to refresh or scroll your feed, you receive an unpredictable reward: sometimes something interesting, sometimes nothing. This unpredictability makes the behavior compulsive. Your brain keeps seeking the next reward.',
      'Notification systems are another deliberately engineered attention capture mechanism. Each notification creates a micro-interruption — a ping, a badge, a banner — that hijacks your attention and redirects it to the platform. Research shows that after a digital interruption, the average person takes 23 minutes and 15 seconds to return to their original task. For someone with 50 notifications per day, this represents hours of fragmented, low-quality work.',
      'The *attention economy* is the framework that makes sense of this. In an economy where the commodity being sold is human attention, your time and focus are the product. Advertisers pay for access to your attention. Platforms earn revenue by holding your attention as long and as often as possible. Your focus has been converted into a commercial resource — without your explicit consent.',
      'Awareness of these mechanisms is not meant to induce cynicism — it is meant to restore agency. When you understand why your phone feels impossible to put down, you can make conscious choices about how you engage with technology instead of being unconsciously managed by it.',
    ],
    keyTakeaways: [
      'Digital distraction is the product of deliberate behavioral engineering, not personal weakness',
      'Variable reward schedules make digital scrolling compulsively hard to stop',
      'The average recovery time after a digital interruption is over 23 minutes',
      'Understanding the attention economy restores agency over your own focus',
    ],
    practicalExercise: 'For one full day, track every time you reach for your phone without a specific intention. Keep a tally. At the end of the day, calculate approximately how many minutes each mindless check cost you (including the time to refocus afterward). What does the total represent in your day? This single exercise creates powerful awareness that motivates change.',
    summary: 'Digital distraction is a systemic design challenge, not a personal failing. When you understand the mechanisms behind it, you reclaim the ability to make conscious choices about your attention — the most valuable resource you possess.',
  },
  'dmml-1-2': {
    objectives: ['Understand why multitasking is neurologically impossible', 'Recognize the performance cost of task-switching', 'Develop a single-tasking mindset'],
    body: [
      'Multitasking is one of the most persistent and costly myths in modern productivity culture. We believe we are doing multiple things simultaneously. What we are actually doing is switching rapidly between tasks — and paying a performance penalty every time we switch.',
      'Neuroscientists are clear: the human brain cannot perform two cognitively demanding tasks simultaneously. What appears to be multitasking is sequential task-switching — the brain rapidly toggling between contexts. Each switch has a cost. Researchers call this the *switch cost* or *attention residue*. When you move from Task A to Task B, part of your attention remains on Task A, impairing your performance on Task B.',
      'The performance impact is significant. A University of Michigan study found that multitasking reduces productivity by up to 40%. A study by the Institute of Psychiatry found that the IQ deficit produced by multitasking is greater than that produced by smoking marijuana. These are not small effects — they represent fundamental cognitive impairment.',
      'The digital environment is designed to encourage multitasking. Multiple browser tabs, simultaneous messaging and document editing, podcasts while writing — each of these is a form of task-switching that degrades the quality of every task involved. The work feels done. The thinking behind the work is shallow.',
      'The alternative is *single-tasking*: deliberately giving your full, undivided attention to one task until it is complete or until a planned stopping point. This requires closing other tabs, silencing notifications, and defending your focus from internal impulses as much as external interruptions. The results — in depth, quality, and actual completion — are consistently superior to multitasking.',
    ],
    keyTakeaways: [
      'Multitasking is neurologically impossible — what we call multitasking is costly task-switching',
      'Each switch carries an attention residue that impairs performance on the new task',
      'Task-switching reduces productivity by up to 40% and significantly impairs cognitive quality',
      'Single-tasking produces deeper, higher-quality work than any form of parallel processing',
    ],
    practicalExercise: 'Block one 90-minute period tomorrow for single-tasking. One task. No notifications. No other tabs. No checking messages. Work on this one task for 90 uninterrupted minutes. At the end, evaluate: How much did you accomplish compared to what you typically do in 90 distracted minutes? What was the quality difference? This single experiment tends to convert people to single-tasking permanently.',
    summary: 'Multitasking is not a skill — it is a habit with significant hidden costs. When you commit to single-tasking, you do not slow down. You produce more, at higher quality, with less mental exhaustion.',
  },
  'dmml-1-3': {
    objectives: ['Understand attention as a finite and depletable resource', 'Learn how digital consumption patterns drain attentional capacity', 'Develop practices to conserve and restore attention'],
    body: [
      'Attention is the most fundamental cognitive resource you possess. Every conscious activity requires it. And like all resources, it is finite. The model of *ego depletion* — developed by psychologist Roy Baumeister — demonstrates that mental resources, including focused attention, deplete with use and must be replenished with rest.',
      'Digital consumption is one of the most attention-intensive activities most people engage in. Every piece of content processed requires attentional resources: visual scanning, information evaluation, emotional response, memory encoding. Hours of social media, news, and content consumption drain these resources — often without producing anything of value in return.',
      'The phenomenon of *continuous partial attention* — described by tech researcher Linda Stone — is the habitual state most heavy digital users operate in. Rather than giving anything their full attention, they maintain a state of semi-awareness across multiple streams simultaneously. The phone is on the table during a meeting. The email is open in the background during deep work. This state is characterized by persistent low-level alertness that prevents deep focus and accumulates fatigue.',
      'Attentional restoration theory, developed by Rachel and Stephen Kaplan, shows that natural environments — trees, water, open sky — restore depleted attention in ways that digital environments do not. Time in nature is not an indulgence for the privileged; it is a neurological necessity for sustained cognitive performance. Twenty minutes in a natural environment produces measurable restoration of attentional capacity.',
      'Rest is equally important. Sleep is the primary mechanism through which the brain clears metabolic waste, consolidates memory, and restores attentional reserves. Research by Matthew Walker shows that even one night of inadequate sleep reduces cognitive performance to a level equivalent to moderate intoxication. Protecting sleep is protecting your capacity to think clearly.',
    ],
    keyTakeaways: [
      'Attention is finite and depletes with use — it must be actively protected and restored',
      'Continuous partial attention is a chronic state of semi-focus that prevents deep work and accumulates cognitive fatigue',
      'Twenty minutes in natural environments measurably restores depleted attention',
      'Sleep is the primary attentional restoration mechanism — protecting sleep is a cognitive performance strategy',
    ],
    practicalExercise: 'Conduct an attention audit for one week. Each evening, rate your attentional quality that day on a scale of 1-10. Note: hours of sleep the previous night, total screen time, time spent in natural environments, and whether you practiced any form of single-tasking. At the end of the week, identify the variables that most strongly correlate with high attentional quality. These are your personal attention-restoration levers.',
    summary: 'Attention is the currency of cognitive performance. When you understand it as a limited resource — depletable and restorable — you begin making different choices about how you spend and replenish it each day.',
  },
  'dmml-1-4': {
    objectives: ['Assess your understanding of Module 1: Understanding Digital Distraction'],
    body: ['Answer all questions and submit for feedback.'],
    quizQuestions: [
      {
        question: 'Why are social media platforms deliberately designed with variable reward schedules?',
        options: ['To improve user experience', 'To make scrolling behavior compulsive by providing unpredictable rewards', 'To reduce screen time for user wellbeing', 'To organize content more effectively'],
        correct: 1,
      },
      {
        question: 'Research shows that after a digital interruption, the average recovery time to return fully to the original task is approximately:',
        options: ['2-3 minutes', '5-10 minutes', '23 minutes', '45 minutes'],
        correct: 2,
      },
      {
        question: 'What is "continuous partial attention"?',
        options: ['A technique for effective multitasking', 'The state of maintaining semi-awareness across multiple digital streams simultaneously', 'A type of focused work session', 'Checking notifications only once per hour'],
        correct: 1,
      },
    ],
    summary: 'Module 1 complete. You now understand the engineered nature of digital distraction, the myth of multitasking, and the finite nature of attention. Module 2 addresses practical screen-time management.',
  },

  'dmml-2-1': {
    objectives: ['Develop awareness of how digital time is actually spent', 'Learn to use data-driven tracking to reveal unconscious usage patterns'],
    body: [
      'The first step in managing screen time is knowing how you actually spend it — not how you think you spend it, and not how you would like to spend it. Most people dramatically underestimate their digital usage. Research consistently finds that self-reported screen time is 50-100% lower than actual measured usage.',
      'Every major smartphone platform — iOS Screen Time, Android Digital Wellbeing — provides detailed data on usage patterns. Total daily screen time. Breakdown by app and category. Number of pickups per day. Number of notifications received. These numbers are often surprising and almost always motivating when confronted honestly.',
      'The goal of tracking is not guilt — it is clarity. Awareness without judgment. When you see that you spent three hours on social media on Tuesday, the question is not "what is wrong with me?" The question is "Is this how I want to be spending three hours?" That re-framing converts data into agency.',
      'Weekly reviews of digital usage, even brief ones, create ongoing awareness that prevents the gradual re-accumulation of screen time after initial reductions. The review does not need to be extensive: five minutes looking at the week\'s data and identifying one adjustment for the following week is sufficient.',
      'Digital journaling is a complementary practice: each evening, note how your screen time felt — whether it was intentional or reactive, whether it served you or drained you. This qualitative layer adds meaning to the quantitative data and identifies the specific contexts in which unconscious usage occurs.',
    ],
    keyTakeaways: [
      'Self-reported screen time is typically 50-100% lower than actual measured usage',
      'Platform tools provide objective data that reveals unconscious usage patterns',
      'Awareness without judgment — not guilt — is the goal of tracking',
      'Brief weekly reviews prevent gradual re-accumulation of screen time after reductions',
    ],
    practicalExercise: 'Today, access the screen time data on your primary device. Record the total daily average, the top three apps by usage time, and the number of pickups per day. Compare this to what you would have estimated without looking. Identify one specific usage pattern — one app or context — that most surprises you. That surprise is the beginning of change.',
    summary: 'You cannot manage what you do not measure. Screen time data makes the invisible visible and converts vague concern about digital habits into specific, actionable information.',
  },
  'dmml-2-2': {
    objectives: ['Learn practical techniques for creating healthy boundaries around screen time', 'Develop personalized boundaries that match your values and goals'],
    body: [
      'A boundary is a defined limit that protects something you value. Screen-time boundaries protect your attention, relationships, sleep, and mental wellbeing from the expanding demands of the digital environment. Like all boundaries, they must be consciously set, communicated where necessary, and actively maintained.',
      'The most effective screen-time boundaries are *time-based* or *space-based* or both. Time-based boundaries define when you use technology: "No screens in the first hour after waking." "No devices after 9pm." "Phone-free from dinner until bedtime." Space-based boundaries define where: "No phones in the bedroom." "No screens at the dining table." "Phone in a drawer during work sessions."',
      'The power of space-based boundaries lies in the friction they create. Research shows that the mere presence of a smartphone on a desk — even face down, even silent — reduces available cognitive capacity. Removing the device from the environment removes the temptation entirely, which is far more effective than relying on willpower to resist an ever-present trigger.',
      'Charging your phone outside the bedroom is consistently rated as one of the highest-impact digital boundaries available. It removes the last check before sleeping and the first check upon waking — two high-risk moments for unconscious digital consumption. An alarm clock used for its intended purpose replaces the phone\'s role.',
      'Boundaries with others also matter. Communicating your boundaries — "I don\'t respond to messages after 8pm" or "I\'m unavailable by phone during deep work sessions" — manages expectations and removes the social pressure that often drives reactive checking. Most people respond positively to clearly communicated boundaries; the anxiety about setting them is usually greater than the reality.',
    ],
    keyTakeaways: [
      'Screen-time boundaries can be time-based, space-based, or both — and each is effective',
      'The mere presence of a smartphone reduces cognitive capacity even when not in use',
      'Removing devices from environments is more effective than relying on willpower',
      'Communicating boundaries to others manages expectations and removes social pressure for reactive checking',
    ],
    practicalExercise: 'Choose two screen-time boundaries to implement this week — one time-based and one space-based. Write them as specific commitments: "No screens before 7:30am" and "Phone charges in the kitchen, not the bedroom." Tell one person about each commitment for accountability. Track whether you maintained each boundary daily for seven days. Reflect on the impact at the end of the week.',
    summary: 'Screen-time boundaries are not restrictions — they are commitments to what you value more than unlimited digital access. When clearly defined and consistently maintained, they create space for what matters most.',
  },
  'dmml-2-3': {
    objectives: ['Learn how to shift from reactive technology use to intentional engagement', 'Develop a technology relationship based on conscious choice'],
    body: [
      'Most digital technology use is reactive — driven by habit, boredom, social pressure, or the engineered pull of the platform itself. Intentional technology use is fundamentally different: it begins with a question. "What do I want to accomplish with this tool, right now, for this defined period of time?"',
      'The *before-use intention* is one of the most practical tools for shifting from reactive to intentional technology use. Before opening an app or website, pause for three seconds and state your purpose: "I am opening email to respond to the two urgent messages from this morning. I will spend 20 minutes on this." Then execute exactly that — and close when the intention is complete.',
      'Scheduled technology use is another powerful practice. Instead of checking email continuously throughout the day, schedule two or three defined email windows. Instead of having messaging apps open all day, check and respond in batches at specific times. This batching approach dramatically reduces the cognitive fragmentation of continuous checking while maintaining responsiveness.',
      'Digital minimalism, articulated by computer scientist Cal Newport, is the philosophy that technology should serve your values and goals — and that any technology that does not clearly do this should be removed. This is not about using less technology for its own sake. It is about curating your digital environment so that every tool in it has a clear, deliberate purpose in your life.',
      'The question that drives digital minimalism is simple: "What is the highest-quality way for me to use technology to achieve my goals?" This question reveals which tools are genuinely valuable and which are habitual filler. The filler, once identified, is surprisingly easy to reduce or eliminate — especially when its cost in attention and time becomes visible.',
    ],
    keyTakeaways: [
      'Intentional technology use begins with a question: what do I want to accomplish, right now, for how long?',
      'The before-use intention reduces reactive use and creates purposeful engagement',
      'Batching digital tasks reduces cognitive fragmentation from continuous checking',
      'Digital minimalism asks: does this technology clearly serve my values and goals?',
    ],
    practicalExercise: 'For three consecutive days, apply the before-use intention to every technology session. Before opening any app or browser, write (or think) your specific intention and time limit. After the session, note whether you stayed intentional or drifted into reactive use. At the end of three days, identify which contexts most trigger reactive use. These are the specific situations where stronger boundaries or alternatives are needed.',
    summary: 'The shift from reactive to intentional technology use is one of the most significant improvements available in modern life. When your digital engagement is purposeful, the same technology that drains you becomes a genuinely useful tool.',
  },
  'dmml-2-4': {
    objectives: ['Assess your understanding of Module 2: Managing Screen Time Intentionally'],
    body: ['Answer all questions and submit.'],
    quizQuestions: [
      {
        question: 'Why are space-based boundaries (removing devices from certain environments) more effective than willpower-based approaches?',
        options: ['They cost less money', 'They eliminate the trigger entirely rather than requiring ongoing resistance', 'They work better for specific personality types', 'They have no effect on actual usage'],
        correct: 1,
      },
      {
        question: 'What is the core principle behind the "before-use intention" practice?',
        options: ['Setting an alarm before using your phone', 'Stating a specific purpose and time limit before engaging with technology', 'Asking someone for permission before checking your phone', 'Reviewing your screen time before each session'],
        correct: 1,
      },
      {
        question: 'Digital minimalism asks which primary question about technology?',
        options: ['How expensive is this technology?', 'How popular is this technology?', 'Does this technology clearly serve my values and goals?', 'How much time should I spend on this technology?'],
        correct: 2,
      },
    ],
    summary: 'Module 2 complete. You now have practical tools for tracking usage, setting boundaries, and shifting to intentional technology engagement. Module 3 addresses rebuilding deep focus and concentration.',
  },

  'dmml-3-1': {
    objectives: ['Understand the principles of deep focus and why they are increasingly rare', 'Learn the conditions required for deep cognitive work'],
    body: [
      'Deep focus is the ability to perform cognitively demanding tasks — writing, analysis, design, complex problem-solving — with sustained, undivided attention and without distraction. It produces the highest-quality work of which a mind is capable. And in a world of digital fragmentation, it has become increasingly rare — which means it has become increasingly valuable.',
      'Cal Newport, in his foundational work "Deep Work," defines it as "professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit." The opposite — shallow work — is work performed in a distracted state. Shallow work produces quantity. Deep work produces quality, insight, and genuine value.',
      'Deep focus has three prerequisites. First, *time blocks* — extended, uninterrupted periods dedicated to a single demanding task. Most cognitively complex work requires at least 90-minute blocks to reach a state of deep engagement; anything shorter rarely reaches that depth. Second, *environment design* — a physical or digital environment deliberately configured to minimize interruption. Third, *ritual* — consistent habits that signal to the brain that deep work is beginning.',
      'Flow states — the deep engagement described by psychologist Mihaly Csikszentmihalyi — occur naturally during deep work when skill level matches challenge level appropriately. These states are characterized by total absorption, effortless focus, and profound satisfaction. They represent the peak of human cognitive experience — and they are entirely incompatible with the fragmented, distracted digital environment most people work in.',
      'Building deep focus capacity is a skill that develops with practice and atrophies with neglect. If you have spent years working in a fragmented, high-interruption environment, your capacity for sustained attention has likely diminished. It can be rebuilt — but it requires deliberate, consistent practice, starting with shorter blocks and extending them as capacity grows.',
    ],
    keyTakeaways: [
      'Deep focus is increasingly rare in the digital age — making it increasingly valuable',
      'Deep work requires time blocks, environment design, and consistent ritual',
      'Flow states occur naturally in conditions of deep focus — they are incompatible with distraction',
      'Attentional capacity is a trainable skill that builds with practice and atrophies with neglect',
    ],
    practicalExercise: 'Schedule one deep work session this week: a minimum of 90 minutes, one demanding task, no notifications, no other tabs, phone in another room. Design the environment before starting — clear your desk, close irrelevant programs, set a clear start and end time. Afterward, record: how long before you felt genuinely absorbed? What was your output quality compared to fragmented work sessions? What would it mean for your work if you had three such sessions per week?',
    summary: 'Deep focus is not a luxury — it is the source of your most valuable work. Protecting and developing this capacity is one of the highest-leverage investments you can make in your professional and creative life.',
  },
  'dmml-3-2': {
    objectives: ['Identify the primary sources of interruption in your environment', 'Learn strategies for reducing interruptions systematically'],
    body: [
      'Interruptions destroy deep focus. Not just the time of the interruption itself — but the 23 minutes of recovery time afterward. For most knowledge workers, the working day is a sequence of interrupted half-tasks rather than sustained deep work. The source of most interruptions is not other people — it is technology, and it can be managed.',
      'The most impactful single change for reducing interruptions is *notification management*. The default setting on most devices and apps is maximum notification intensity. Every message, post, and update triggers an interruption. Moving to a curated notification system — where only truly time-sensitive communications can interrupt — eliminates the majority of digital interruptions without meaningful loss of responsiveness.',
      'Batch communication is the complementary strategy: instead of responding to messages as they arrive, process communication in defined windows. This removes the implicit expectation — and the anxious monitoring it produces — that you are always immediately available. Most communication that feels urgent in the moment can wait 2-4 hours without any real consequence.',
      'The physical environment also generates interruptions. Open-plan offices — despite their popularity — are research-demonstrated destroyers of deep work. When deep work is required, environmental relocation is often necessary: a quiet room, a library, a home office. The signal is clear — when your current environment is producing interruptions faster than you can manage them, the environment needs to change.',
      'Internal interruptions are equally important to address. The impulse to check email, switch tasks, or google a passing thought is not external — it is a habit generated within your own mind. The tool for managing internal interruptions is a *capture system*: a simple notepad where you write down any non-urgent thought that arises during deep work, then return to your task. The thought is preserved; the interruption is prevented.',
    ],
    keyTakeaways: [
      'Notification management is the highest-impact single action for reducing digital interruptions',
      'Batch communication removes the anxious monitoring that generates constant checking',
      'Environmental relocation is often necessary when the current environment is fundamentally incompatible with deep work',
      'A capture system manages internal interruptions without losing the thoughts they carry',
    ],
    practicalExercise: 'Conduct a 24-hour interruption audit. Every time something interrupts your focus — a notification, a colleague, an internal impulse, an environmental distraction — record what it was. At the end of 24 hours, categorize and count: what are your top three interruption sources? For each, identify one specific change you can implement this week to reduce it. Focus on the highest-frequency source first.',
    summary: 'Interruptions are not inevitable — they are the product of default settings, unmanaged environments, and undisciplined habits. When you systematically reduce them, the quality and depth of your work transforms.',
  },
  'dmml-3-3': {
    objectives: ['Learn evidence-based techniques for building sustained concentration', 'Develop a personal practice for strengthening attentional capacity'],
    body: [
      'Concentration is a skill. Like any skill, it can be developed through deliberate practice, strengthened through consistent use, and weakened through neglect. The fragmented digital environment most people inhabit is an environment of constant concentration degradation. Rebuilding it requires deliberate counter-practice.',
      'The *Pomodoro Technique*, developed by Francesco Cirillo, provides a practical scaffold for building concentration. Work with complete focus for 25 minutes, then take a 5-minute break. After four cycles, take a longer 20-30 minute break. This structured rhythm trains the brain to sustain focus for defined intervals, prevents the chronic fatigue that comes from pushing through exhaustion, and creates a measurable unit of work that supports progress tracking.',
      'Meditation is the most direct training available for concentration. Specifically, *focused attention meditation* — bringing your attention to a single object (typically the breath), noticing when it wanders, and returning it without self-criticism — is functionally identical to the skill of maintaining focus during work. Research consistently shows that even brief, regular meditation practice (10-15 minutes per day) produces measurable improvements in attention, working memory, and cognitive flexibility.',
      'Physical exercise has a powerful and often underutilized effect on concentration. Aerobic exercise increases production of BDNF (Brain-Derived Neurotrophic Factor) — sometimes called "fertilizer for the brain." Even a 20-minute walk before a deep work session measurably improves the focus quality of the session that follows. This is not merely correlation — the neurological mechanism is well understood.',
      'The progression for building concentration is simple but requires patience. Start with 25-minute focused blocks and protect them completely. After two weeks of consistency, extend to 45-minute blocks. After another two weeks, try 60 or 90-minute blocks. The key is consistency of practice, not the length of individual sessions. A 25-minute daily practice for a month produces far greater gains than a single 4-hour deep work marathon.',
    ],
    keyTakeaways: [
      'Concentration is a trainable skill that builds with deliberate practice',
      'The Pomodoro Technique provides a structured rhythm for developing sustained focus',
      'Focused attention meditation directly trains the cognitive skill of maintaining attention',
      'Even 20 minutes of aerobic exercise before focused work measurably improves concentration quality',
    ],
    practicalExercise: 'For the next 14 days, commit to one daily concentration-building practice. Choose one: (1) Daily 25-minute Pomodoro session (one complete, protected, single-task block), (2) 10-minute focused attention meditation before work, or (3) A 20-minute walk before your most cognitively demanding task. Practice the same one consistently for 14 days. Track your perceived focus quality each day on a 1-10 scale. Review the trend.',
    summary: 'Concentration is built through daily practice, not through willpower. When you train it deliberately — with structure, consistency, and patience — your capacity for deep, meaningful work grows in ways that transform both output and satisfaction.',
  },
  'dmml-3-4': {
    objectives: ['Assess your understanding of Module 3: Attention & Focus Recovery'],
    body: ['Answer all questions and submit.'],
    quizQuestions: [
      {
        question: 'What are the three prerequisites for deep focus identified in this module?',
        options: ['Silence, darkness, and solitude', 'Time blocks, environment design, and consistent ritual', 'Coffee, a deadline, and a quiet room', 'Motivation, skill, and time'],
        correct: 1,
      },
      {
        question: 'What is a "capture system" used for in attention management?',
        options: ['Recording all notifications received during work', 'Writing down non-urgent thoughts that arise during deep work so you can return without losing them', 'Capturing focus time on a timer', 'Documenting interruptions from colleagues'],
        correct: 1,
      },
      {
        question: 'What neurological substance does aerobic exercise increase, contributing to improved focus?',
        options: ['Serotonin only', 'Cortisol', 'BDNF — Brain-Derived Neurotrophic Factor', 'Adrenaline'],
        correct: 2,
      },
    ],
    summary: 'Module 3 complete. Deep focus principles, interruption reduction, and concentration-building practices now form your focus recovery toolkit. Module 4 addresses healthy digital habits.',
  },

  'dmml-4-1': {
    objectives: ['Develop a deliberate system for managing notifications', 'Understand the difference between notification types and their appropriate handling'],
    body: [
      'The average smartphone user receives 63-80 notifications per day. Each is an interruption. Each carries an implicit demand for attention. Each one, responded to or not, leaves a trace of attentional residue that fragments the flow of focused work and presence. Managing notifications is not a preference — it is a cognitive performance necessity.',
      'The first principle of notification management is *ruthless curation*. The default setting on every app is "notify me of everything." This is designed to maximize platform engagement, not to serve your wellbeing. Go through every notification-enabled app and ask: "Do I need to know about this instantly?" For most apps, the answer is no. Turn off all notifications that do not require immediate response.',
      'Create three categories for your notifications. Category 1: *Always on* — direct communication from key contacts, security alerts, genuinely time-sensitive professional messages. Category 2: *Batched* — most messaging apps, email, non-urgent platform updates. These you check on schedule, not in real-time. Category 3: *Off entirely* — social media, promotional content, app engagement prompts, news. These have no legitimate claim on your immediate attention.',
      'Do Not Disturb modes are powerful tools that most people underutilize. Scheduling DND for deep work blocks, evening hours, and sleep removes the choice from the moment — you do not have to decide to ignore a notification; it simply does not arrive. This prevention-based approach consistently outperforms willpower-based resistance.',
      'Communicate your notification approach to those who regularly contact you. "I check messages three times per day — at 9am, 1pm, and 5pm. For urgent matters, please call." This simple communication manages expectations and largely eliminates the anxiety — for you and for them — that comes from less-than-immediate responsiveness.',
    ],
    keyTakeaways: [
      'The average user receives 63-80 notifications daily — each is an interruption with attentional cost',
      'Default notification settings maximize platform engagement, not your wellbeing — audit and curate',
      'Three-category notification system: always on, batched, and off entirely',
      'Communicating your response schedule to key contacts manages expectations and reduces anxiety for both parties',
    ],
    practicalExercise: 'Spend 30 minutes today conducting a notification audit on your primary device. Review every app with notification access. Categorize each as: (1) Keep on (genuinely urgent need), (2) Batch (turn off, check on schedule), or (3) Turn off entirely. Implement the changes. For the next seven days, track whether any truly important communication was missed. Almost certainly, none will be.',
    summary: 'Notification management is not about being less responsive — it is about being more intentional about when and how you engage. A curated notification environment is one of the simplest and most powerful digital wellbeing interventions available.',
  },
  'dmml-4-2': {
    objectives: ['Understand the value of device-free time and spaces', 'Design personal device-free routines that restore presence and wellbeing'],
    body: [
      'There is growing scientific evidence that humans need significant periods completely free of digital devices — not just for productivity, but for psychological health, social connection, and cognitive restoration. Device-free routines are not a rejection of technology; they are an affirmation of what matters more.',
      'The *morning hour* is one of the highest-value device-free zones available. The first 60 minutes after waking are neurologically distinct — the brain is in a transitional state between sleep and full waking, creative and open, not yet filled with the day\'s agenda. Introducing a device immediately fills this window with others\' inputs, social comparison, and reactive information. Protecting it with device-free time — movement, journaling, quiet reflection, reading physical books — tends to produce remarkable improvements in mood, clarity, and intentionality.',
      'Meals are another natural device-free context. Eating with a device present consistently degrades both the meal experience and the social connection it could involve. Research shows that families who eat together without devices report stronger bonds, better communication, and better emotional regulation in children. The device-free meal table is a simple but profound practice.',
      'Walking — for transportation, exercise, or simply for its own sake — is increasingly colonized by device use. Earphones in, phone out, scrolling while moving. The device-free walk restores something important: unstructured time for mental processing, creative thinking, and sensory awareness. Many of history\'s great thinkers — from Aristotle to Darwin to Beethoven — maintained deliberate walking practices as cognitive tools.',
      'Device-free social time — conversations, shared activities, leisure — produces measurably stronger relationships and greater wellbeing than digitally mediated social time. When a device is present during social interaction, research shows that both parties report lower connection quality and less trust — even if the device is never actually used. Physical absence of devices is necessary for full social presence.',
    ],
    keyTakeaways: [
      'The first hour after waking is a high-value device-free window for clarity and intentionality',
      'Device-free meals strengthen family and social bonds and improve communication',
      'Device-free walks provide unstructured time for mental processing and creative thinking',
      'Physical device absence — not just silence or face-down placement — is required for full social presence',
    ],
    practicalExercise: 'Design two new device-free routines to implement this week: one in the morning (first 30-60 minutes after waking) and one social (at least one meal or one social activity per day). Write them as specific commitments — not "I will try to have less screen time" but "From 6:30 to 7:30am each day, I will not touch my phone. All family dinners this week will be device-free." After seven days, reflect on what changed.',
    summary: 'Device-free routines are acts of presence — commitments to being fully in the time and place and with the people you are with. They are among the most human things you can do in the digital age.',
  },
  'dmml-4-3': {
    objectives: ['Understand the scientific relationship between screen exposure and sleep quality', 'Learn practical strategies for protecting sleep from digital interference'],
    body: [
      'Sleep is the single most important health behavior available to humans. It affects cognitive function, immune health, emotional regulation, physical performance, and longevity — more than any other lifestyle factor. And digital technology has become one of the primary disruptors of sleep quality in the modern world.',
      'The primary mechanism of digital sleep disruption is *blue light emission*. Screens — phones, tablets, computers, televisions — emit significant blue light wavelengths. Blue light suppresses melatonin production — the hormone that signals the brain to prepare for sleep. Research shows that two hours of screen exposure before bed suppresses melatonin by up to 22%, delaying sleep onset and reducing deep sleep quality.',
      'The second mechanism is *cognitive and emotional stimulation*. Content consumed before sleep — news, social media, email, engaging videos — activates the sympathetic nervous system (the stress response) and fills the mind with unresolved cognitive loops. This stimulation is the opposite of what the brain needs to transition to sleep: a gradual de-escalation of arousal.',
      'The third mechanism is *device presence in the sleep environment*. Even when not in use, a phone within reach creates micro-arousals — small awakenings in response to the possibility of a notification. Research shows that having a phone in the bedroom reduces sleep quality even when it is on silent and face down. Removing it from the bedroom entirely produces measurable sleep improvement.',
      'The *digital sunset* is the practice of ending screen use 60-90 minutes before sleep. During this window, alternatives include physical books, light conversation, gentle movement, journaling, or quiet music. This transition period allows cortisol levels to fall, melatonin to rise, and the mind to process the day\'s events sufficiently to release them rather than carry them into sleep.',
    ],
    keyTakeaways: [
      'Blue light from screens suppresses melatonin production by up to 22%, delaying sleep onset',
      'Content consumed before sleep activates the stress response — the opposite of sleep preparation',
      'Phone presence in the bedroom reduces sleep quality even when silent and face down',
      'A 60-90 minute digital sunset dramatically improves sleep onset and quality',
    ],
    practicalExercise: 'For seven consecutive nights, implement a digital sunset: no screens of any kind for 60 minutes before your intended sleep time. Remove your phone from the bedroom and charge it in another room. Use a traditional alarm clock for waking. After seven days, compare your sleep quality, morning energy, and mood to the week prior. The results of this single change are typically striking enough to make it permanent.',
    summary: 'Protecting sleep from digital interference is one of the highest-leverage wellbeing choices available. When sleep improves, every other dimension of cognitive and physical performance improves with it.',
  },
  'dmml-4-4': {
    objectives: ['Assess your understanding of Module 4: Building Healthy Digital Habits'],
    body: ['Answer all questions and submit.'],
    quizQuestions: [
      {
        question: 'What is the primary neurological mechanism by which screen use before bed disrupts sleep?',
        options: ['It increases cortisol to wake the brain', 'Blue light suppresses melatonin production, delaying sleep onset', 'Screen brightness overstimulates the eyes', 'It causes the brain to expect entertainment before sleep'],
        correct: 1,
      },
      {
        question: 'What does research show about having a phone present in the bedroom, even on silent and face down?',
        options: ['It has no measurable effect on sleep', 'It creates micro-arousals and reduces sleep quality', 'It actually improves sleep by providing comfort', 'It only affects sleep if notifications are received'],
        correct: 1,
      },
      {
        question: 'How long before sleep should the "digital sunset" ideally begin?',
        options: ['15-30 minutes', '60-90 minutes', '30-45 minutes', 'Immediately before getting into bed'],
        correct: 1,
      },
    ],
    summary: 'Module 4 complete. Notification management, device-free routines, and sleep protection are now part of your healthy digital habits toolkit. Final module: creating a sustainable balanced lifestyle.',
  },

  'dmml-5-1': {
    objectives: ['Understand how to intentionally design the balance between online and offline life', 'Learn to evaluate digital activities against offline alternatives'],
    body: [
      'The question of online-offline balance is not "how much should I use technology?" It is "what does a genuinely good life look like for me, and how does my technology use serve or undermine it?" This reframing converts a productivity conversation into a values conversation — which is where the most sustainable change originates.',
      'Most people\'s online-offline balance has evolved by default rather than design. Technology expanded into the available space, filling gaps that were previously occupied by rest, relationship, creativity, and embodied experience. Reclaiming balance requires intentional design — not passive reduction of screen time, but deliberate cultivation of offline activities that represent genuine alternatives.',
      'The concept of *offline anchors* is useful here. These are regular, recurring activities that take place entirely offline and provide meaning, connection, or restoration: family meals, physical exercise, creative hobbies, in-person social gatherings, time in nature, reading physical books. Offline anchors are not the absence of technology — they are affirmative commitments to activities that technology cannot replicate.',
      'Online activities vary widely in their value and in their contribution to wellbeing. Active, intentional online engagement — creating, learning, genuine connection — tends to contribute positively to wellbeing. Passive, reactive consumption — endless scrolling, comparison-driven browsing, outrage media — consistently correlates with lower wellbeing, higher anxiety, and reduced life satisfaction. The quality of online engagement matters as much as the quantity.',
      'Weekly life design is a practical tool for maintaining intentional balance. Each Sunday, plan the coming week with explicit attention to offline anchors: which days will include exercise? Which meals will be device-free? When will in-person social connection occur? When will nature time happen? Planning offline activities with the same intention as digital commitments ensures they actually occur rather than being continuously displaced by digital defaults.',
    ],
    keyTakeaways: [
      'Online-offline balance is a values question, not merely a time management question',
      'Offline anchors are deliberate commitments to meaningful activities that technology cannot replicate',
      'Active online engagement contributes to wellbeing; passive consumption consistently undermines it',
      'Planning offline activities intentionally prevents them from being displaced by digital defaults',
    ],
    practicalExercise: 'Design your ideal week. On a physical piece of paper, map out seven days. First, place your offline anchors — exercise, device-free meals, social connection, nature time, creative pursuits. Then, around those anchors, identify specific, intentional windows for technology use. Notice how different this design feels from your current default week. Implement as much of it as possible in the coming week.',
    summary: 'Online-offline balance is not achieved by accident — it is designed on purpose. When you lead with what you value offline and let technology fill the remaining space intentionally, life feels fundamentally different.',
  },
  'dmml-5-2': {
    objectives: ['Learn how to use technology in ways that enhance rather than diminish life quality', 'Develop criteria for evaluating technology\'s role in your life'],
    body: [
      'Meaningful technology use is not about using less technology — it is about using the right technology, for the right purposes, in the right amounts, at the right times. This distinction matters because technology, used intentionally, is genuinely one of the most powerful tools for human flourishing ever created.',
      'The framework for evaluating meaningful technology use has three questions. First: "Does this technology help me accomplish something I value?" Learning, creating, staying connected to people who matter, building a business, managing health — these are genuine values that technology can serve. Second: "Is this the best way to achieve this purpose?" Sometimes technology is the best tool. Sometimes a phone call, a walk, or a book would serve the purpose better. Third: "What is the real cost of this use in time, attention, and wellbeing?"',
      'Technology for learning has never been more powerful. Online education platforms, research databases, expert communities, and professional development tools give individuals access to knowledge and skills that previous generations could not have imagined. Used with intention and discipline, this represents one of the greatest human capability expansions in history.',
      'Technology for genuine connection — maintaining relationships across distance, coordinating care for family members, staying involved in communities — is similarly meaningful. The distinction between meaningful connection technology and social comparison technology is important: the former serves relationships, the latter primarily serves platforms.',
      'Technology for creative expression — writing, design, music production, video creation, coding — amplifies human creative capacity in extraordinary ways. Using technology to make, build, and express tends to produce wellbeing; using technology primarily to consume tends to drain it. A useful heuristic: end each week by noting the ratio of creation to consumption in your digital life. That ratio reflects a great deal about the quality of your technology relationship.',
    ],
    keyTakeaways: [
      'Meaningful technology use serves specific values — learning, genuine connection, creation, capability building',
      'Three evaluation questions: Does it serve something I value? Is it the best method? What is the real cost?',
      'Creation vs. consumption ratio is a powerful heuristic for evaluating technology quality',
      'Technology for learning and skilled creation tends to enhance wellbeing; passive consumption tends to diminish it',
    ],
    practicalExercise: 'Review the past seven days of technology use. Categorize each significant block of digital time as either: (1) Meaningful — served a specific value (learning, creation, genuine connection, important communication), or (2) Unconscious — habitual, reactive, or primarily passive consumption. Calculate the ratio. Set a specific goal for improving that ratio in the coming week by adding one meaningful use and reducing one unconscious use.',
    summary: 'Technology is a tool, and like all tools, its value depends entirely on the wisdom with which it is used. When you apply it to what genuinely matters, it amplifies your capacity for a life well-lived.',
  },
  'dmml-5-3': {
    objectives: ['Integrate all course learnings into a coherent, sustainable digital lifestyle', 'Create a personal digital wellness plan for long-term balance'],
    body: [
      'Sustainable digital lifestyle design is not a destination — it is an ongoing practice of adjustment, reflection, and recommitment. The digital environment is constantly changing, new platforms emerge, and the pressures of professional and social life continuously test the boundaries we create. What makes a digital lifestyle sustainable is not rigidity — it is a clear set of values and the skills to realign with them when drift occurs.',
      'Drift is inevitable. You will have weeks when your screen time spikes, when device-free routines slip, when you find yourself in a notification spiral you thought you had resolved. This is not failure — it is the nature of practice in a dynamic environment. The difference between those who build lasting digital health and those who do not is not avoiding drift. It is recovering from it without self-criticism and returning to intentional practice.',
      'A personal digital wellness plan synthesizes the practices from this course into a coherent system. It includes: a core set of non-negotiables (the two or three boundaries you protect regardless of circumstances), a weekly rhythm of device-free anchors, a notification configuration that reflects your values, a daily practice for attention restoration (meditation, exercise, nature time), and a monthly review of digital usage patterns.',
      'Social infrastructure matters enormously for sustainability. Digital lifestyle changes are harder to maintain in isolation. Shared commitments — a partner, family, or community that holds similar values around technology — create the social context within which individual practices become easier to sustain. Sharing your intentions, involving others in device-free times, and participating in communities of people committed to digital mindfulness all significantly increase sustainability.',
      'The measure of success in this journey is not total screen time — it is the quality of your attention, the depth of your relationships, the creativity in your work, and the presence you bring to the moments of your life. When technology serves these things, it is serving you well. When it systematically undermines them, it needs to be managed differently. You now have the knowledge and tools to make that judgment and act on it.',
    ],
    keyTakeaways: [
      'Sustainable digital lifestyle is an ongoing practice, not a destination — drift is normal and manageable',
      'A personal digital wellness plan integrates non-negotiables, weekly rhythms, notification design, attention practices, and monthly review',
      'Social infrastructure — shared commitments with others — significantly increases individual sustainability',
      'Success is measured not by screen time but by attention quality, relationship depth, and life presence',
    ],
    practicalExercise: 'Write your Personal Digital Wellness Plan. Include: (1) Your two non-negotiable digital boundaries. (2) Your three weekly offline anchors. (3) Your notification configuration (what stays on, what is batched, what is off). (4) Your daily attention-restoration practice. (5) Your monthly review commitment (when and what you will review). Share this plan with at least one person who will support it. Review it in 30 days.',
    summary: 'A sustainable digital lifestyle is a conscious design choice renewed daily. You now have the framework, the practices, and the understanding to make technology your tool — not your master. The balance you create from here is yours to design.',
  },
  'dmml-5-4': {
    objectives: ['Complete the final assessment for Course 3: Digital Mindfulness & Modern Life Balance'],
    body: ['This final assessment covers all five modules. Completion earns your Digital Mindfulness & Modern Life Balance Certificate.'],
    quizQuestions: [
      {
        question: 'What is the primary mechanism through which variable reward schedules make digital scrolling compulsive?',
        options: ['They always deliver interesting content', 'The unpredictable nature of rewards drives continued behavior seeking the next reward', 'They limit the amount of time you can spend on a platform', 'They create a fear of missing out'],
        correct: 1,
      },
      {
        question: 'What does the creation-to-consumption ratio reflect about your digital life?',
        options: ['How much content you produce versus how much you consume — an indicator of technology quality', 'The ratio of paid to free apps you use', 'How many platforms you create accounts on', 'The time spent creating files versus reading them'],
        correct: 0,
      },
      {
        question: 'According to this course, what is the most accurate measure of success in building a sustainable digital lifestyle?',
        options: ['Total daily screen time under two hours', 'Number of apps deleted from your phone', 'Quality of attention, depth of relationships, and presence in life', 'Frequency of device-free days'],
        correct: 2,
      },
    ],
    summary: 'Congratulations — you have completed Digital Mindfulness & Modern Life Balance. You now have a comprehensive understanding of digital distraction, practical screen-time management, attention recovery, healthy digital habits, and sustainable lifestyle design. Your certificate is ready.',
  },
};

// Master content lookup — keyed by unit ID
const ALL_LESSON_CONTENT: Record<string, LessonContent> = {
  ...FCC_CONTENT,
  ...DCST_CONTENT,
  ...DMML_CONTENT,
};

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string; bg: string; border: string }> = {
  reading:     { icon: <BookOpen className="w-4 h-4" />,   label: 'Reading',    color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  reflection:  { icon: <PenLine className="w-4 h-4" />,    label: 'Reflection', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  activity:    { icon: <PlayCircle className="w-4 h-4" />, label: 'Activity',   color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  quiz:        { icon: <HelpCircle className="w-4 h-4" />, label: 'Assessment', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  mindfulness: { icon: <Leaf className="w-4 h-4" />,       label: 'Practice',   color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
};

const PATH_ICONS: Record<string, React.ReactNode> = {
  'foundations-of-clear-communication':      <Users className="w-5 h-5" />,
  'decision-clarity-strategic-thinking':     <Brain className="w-5 h-5" />,
  'digital-mindfulness-modern-life-balance': <Leaf className="w-5 h-5" />,
};

const PATH_CERTIFICATES: Record<string, string> = {
  'foundations-of-clear-communication':      '/CERTIFICATE1.png',
  'decision-clarity-strategic-thinking':     '/CERTIFICATE2.png',
  'digital-mindfulness-modern-life-balance': '/CERTIFICATE3.png',
};

/* ── XP Burst ── */
const XPBurst: React.FC<{ xp: number; onDone: () => void }> = ({ xp, onDone }) => (
  <motion.div
    initial={{ opacity: 0, y: 0, scale: 0.8 }}
    animate={{ opacity: 1, y: -64, scale: 1.1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    onAnimationComplete={onDone}
    className="fixed bottom-24 right-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm pointer-events-none shadow-lg"
    style={{ background: 'linear-gradient(135deg, #1a5d47, #0f7a55)', color: '#fff' }}
  >
    <Sparkles className="w-4 h-4" />
    +{xp} XP
  </motion.div>
);

/* ──────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────── */
const CoursePlayerPage: React.FC = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Enrollment Gate check
  useEffect(() => {
    if (loading) return;

    const token = localStorage.getItem("token");
    if (!token || !user) {
      toast.error("Please login and enroll in this course first to access lessons.");
      navigate(`/learn/${pathId}`);
      return;
    }

    const enrolled = user.enrolledCourses?.some(e => e.courseId === pathId);
    if (!enrolled) {
      toast.error("Please enroll in this course first to access lessons.");
      navigate(`/learn/${pathId}`);
      return;
    }
  }, [user, loading, pathId, navigate]);

  const path = learningPaths.find(p => p.id === pathId);

  // Build modules from JSON data
  const MODULES = (path?.modules ?? []) as Array<{
    id: string;
    title: string;
    description: string;
    units: Array<{ id: string; title: string; type: string; xp: number; locked: boolean }>;
  }>;

  const MODULES_WITH_DURATION = MODULES.map(mod => ({
    ...mod,
    shortTitle: mod.title.replace(/^Module \d+:\s*/, ''),
    units: mod.units.map(u => ({ ...u, duration: u.type === 'quiz' ? '5 min' : u.type === 'mindfulness' ? '10 min' : '8 min' })),
  }));

  const allUnits = MODULES_WITH_DURATION.flatMap(m => m.units);
  const firstUnitId = allUnits[0]?.id ?? '';

  const [activeUnitId, setActiveUnitId]     = useState(firstUnitId);
  const [completedUnits, setCompletedUnits] = useState<Set<string>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set([MODULES_WITH_DURATION[0]?.id ?? '']));
  const [rightTab, setRightTab]             = useState<'notes' | 'journal'>('notes');
  const [notes, setNotes]                   = useState<Record<string, string>>({});
  const [journal, setJournal]               = useState<Record<string, string>>({});
  const [xpBurst, setXpBurst]               = useState<{ xp: number; key: number } | null>(null);
  const [totalXP, setTotalXP]               = useState(0);
  const [sidebarOpen, setSidebarOpen]       = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [quizAnswers, setQuizAnswers]       = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted]   = useState(false);
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<string, string>>({});
  const [certModalOpen, setCertModalOpen]   = useState(false);

  const streak = user?.stats?.streak ?? 0;
  const contentRef = useRef<HTMLDivElement>(null);

  const totalUnits     = allUnits.length;
  const progressPct    = totalUnits > 0 ? Math.round((completedUnits.size / totalUnits) * 100) : 0;
  const currentUnitIdx = allUnits.findIndex(u => u.id === activeUnitId);
  const currentUnit    = allUnits[currentUnitIdx];
  const prevUnit       = currentUnitIdx > 0 ? allUnits[currentUnitIdx - 1] : null;
  const nextUnit       = currentUnitIdx < allUnits.length - 1 ? allUnits[currentUnitIdx + 1] : null;
  const currentContent = ALL_LESSON_CONTENT[activeUnitId] ?? { objectives: [], body: ['Content coming soon.'], summary: '' };
  const typeConf       = currentUnit ? (TYPE_CONFIG[currentUnit.type] ?? TYPE_CONFIG['reading']) : TYPE_CONFIG['reading'];
  const currentModId   = MODULES_WITH_DURATION.find(m => m.units.some(u => u.id === activeUnitId))?.id ?? '';

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setQuizAnswers({});
    setQuizSubmitted(false);
  }, [activeUnitId]);

  const markComplete = useCallback(() => {
    if (completedUnits.has(activeUnitId)) return;
    const unit = allUnits.find(u => u.id === activeUnitId);
    if (!unit) return;
    
    const newCompleted = new Set([...completedUnits, activeUnitId]);
    setCompletedUnits(newCompleted);
    setTotalXP(prev => prev + unit.xp);
    setXpBurst({ xp: unit.xp, key: Date.now() });

    const isNowAllComplete = allUnits.every(u => newCompleted.has(u.id));

    setTimeout(() => {
      if (nextUnit) {
        setActiveUnitId(nextUnit.id);
        const nm = MODULES_WITH_DURATION.find(m => m.units.some(u => u.id === nextUnit.id));
        if (nm) setExpandedModules(prev => new Set([...prev, nm.id]));
      } else if (isNowAllComplete) {
        setCertModalOpen(true);
      }
    }, 800);
  }, [activeUnitId, completedUnits, allUnits, nextUnit]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-bold uppercase tracking-wider text-xs">Synchronizing Sanctuary...</p>
        </div>
      </div>
    );
  }

  if (!path || MODULES_WITH_DURATION.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Path not found.</p>
          <button onClick={() => navigate('/learn')} className="text-[#0f7a55] hover:underline">← Back to catalog</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#ffffff', fontFamily: "'Poppins', sans-serif" }}>

      {/* ═══════════════ LEFT SIDEBAR ═══════════════ */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-[272px] flex-shrink-0 flex flex-col h-full overflow-hidden"
            style={{ background: '#ffffff', borderRight: '1px solid #e5ede9' }}
          >
            {/* Top: path info */}
            <div className="p-5" style={{ borderBottom: '1px solid #e5ede9' }}>
              <button
                onClick={() => navigate(`/learn/${pathId}`)}
                className="flex items-center gap-2 text-sm text-[#9ca3af] hover:text-[#0f7a55] transition-colors mb-4 group"
              >
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to Overview
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-[10px] text-[#0f7a55] flex-shrink-0"
                  style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                  {PATH_ICONS[pathId ?? ''] ?? <BookOpen className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] text-[#9ca3af] font-semibold uppercase tracking-wider">Learning Path</p>
                  <p className="text-[16px] font-bold text-[#0b1310] truncate">{path.title}</p>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-[13px] mb-1.5 font-medium" style={{ color: '#9ca3af' }}>
                  <span>{completedUnits.size} / {totalUnits} units</span>
                  <span style={{ color: '#0f7a55' }}>{progressPct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#e5ede9' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #1a5d47, #0f7a55)' }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-[10px]"
                style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                <Flame className="w-4 h-4 text-[#d97706]" />
                <span className="text-[13px] text-[#d97706] font-bold">{streak} day streak</span>
                <span className="ml-auto text-[12px]" style={{ color: '#9ca3af' }}>{totalXP} XP</span>
              </div>
            </div>

            {/* Curriculum */}
            <div className="flex-1 overflow-y-auto py-2">
              {MODULES_WITH_DURATION.map((mod, mIdx) => {
                const isExpanded  = expandedModules.has(mod.id);
                const modDone     = mod.units.filter(u => completedUnits.has(u.id)).length;
                const isActiveMod = mod.id === currentModId;

                return (
                  <div key={mod.id}>
                    <button
                      onClick={() => setExpandedModules(prev => {
                        const next = new Set(prev);
                        next.has(mod.id) ? next.delete(mod.id) : next.add(mod.id);
                        return next;
                      })}
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all hover:bg-[#f5f9f7]"
                    >
                      <div className="flex items-center justify-center w-7 h-7 rounded-full text-[12px] font-bold flex-shrink-0 transition-colors"
                        style={{
                          background: isActiveMod ? '#ecfdf5' : '#f3f4f6',
                          color: isActiveMod ? '#0f7a55' : '#9ca3af',
                          border: isActiveMod ? '1px solid #a7f3d0' : '1px solid #e5e7eb',
                        }}>
                        {modDone === mod.units.length ? <CheckCircle2 className="w-4 h-4" /> : mIdx + 1}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className={`text-[15px] font-bold truncate ${isActiveMod ? 'text-[#0b1310]' : 'text-[#6b7280]'}`}>{mod.shortTitle}</p>
                        <p className="text-[12px] text-[#9ca3af] font-medium">{modDone}/{mod.units.length} done</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-[#d1d5db] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          {mod.units.map((unit) => {
                            const isActive = unit.id === activeUnitId;
                            const isDone   = completedUnits.has(unit.id);
                            const tc       = TYPE_CONFIG[unit.type] ?? TYPE_CONFIG['reading'];

                            return (
                              <button
                                key={unit.id}
                                disabled={unit.locked && !isDone}
                                onClick={() => !unit.locked && setActiveUnitId(unit.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 pl-[52px] text-left transition-all"
                                style={{
                                  background: isActive ? '#f0fdf7' : 'transparent',
                                  borderLeft: isActive ? '3px solid #0f7a55' : '3px solid transparent',
                                  opacity: unit.locked && !isDone ? 0.4 : 1,
                                }}
                              >
                                <div className="flex-shrink-0" style={{ color: isDone ? '#0f7a55' : tc.color }}>
                                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : unit.locked ? <Lock className="w-3.5 h-3.5 text-[#d1d5db]" /> : tc.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-[14px] truncate font-semibold ${isActive ? 'text-[#0b1310] font-bold' : isDone ? 'text-[#9ca3af]' : 'text-[#374151]'}`}>
                                    {unit.title}
                                  </p>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <Clock className="w-3.5 h-3.5 text-[#d1d5db]" />
                                    <span className="text-[11px] text-[#9ca3af] font-medium">{unit.duration}</span>
                                    <span className="ml-auto text-[11px] font-bold" style={{ color: tc.color }}>{unit.xp} XP</span>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {mIdx < MODULES_WITH_DURATION.length - 1 && (
                      <div className="mx-4 h-px my-1" style={{ background: '#f3f4f6' }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Certificate badge */}
            <div className="p-4" style={{ borderTop: '1px solid #e5ede9' }}>
              {progressPct === 100 ? (
                <button
                  onClick={() => setCertModalOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[12px] text-left transition-all hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #0f7a55, #1a9c6d)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(15,122,85,0.25)',
                  }}
                >
                  <Trophy className="w-5 h-5 text-white flex-shrink-0 animate-bounce" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-white">Certificate Unlocked!</p>
                    <p className="text-[11px] text-emerald-100 font-medium truncate">Click to view & download</p>
                  </div>
                </button>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3.5 rounded-[12px]"
                  style={{ background: '#f0fdf7', border: '1px solid #a7f3d0' }}>
                  <Trophy className="w-5 h-5 text-[#0f7a55]" />
                  <div>
                    <p className="text-[13px] font-bold text-[#0f7a55]">Certificate Awaits</p>
                    <p className="text-[11px] text-[#6b7280] font-medium">Complete all units to earn</p>
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ═══════════════ CENTER CONTENT ═══════════════ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top header */}
        <header
          className="flex-shrink-0 flex items-center gap-4 px-6 py-3.5"
          style={{ background: 'rgba(255,255,255,0.95)', borderBottom: '1px solid #e5ede9', backdropFilter: 'blur(12px)' }}
        >
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-[#f5f9f7] transition-colors text-[#9ca3af] hover:text-[#0b1310]">
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs flex-1 min-w-0" style={{ color: '#9ca3af' }}>
            <span className="font-medium truncate text-[#6b7280]">{path.title}</span>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-medium truncate text-[#6b7280]">
              {MODULES_WITH_DURATION.find(m => m.units.some(u => u.id === activeUnitId))?.shortTitle}
            </span>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-semibold text-[#0b1310] truncate">{currentUnit?.title}</span>
          </div>

          {/* XP */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full flex-shrink-0"
            style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
            <Sparkles className="w-3.5 h-3.5 text-[#0f7a55]" />
            <span className="text-xs font-bold text-[#0f7a55]">{totalXP} XP</span>
          </div>

          <button onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className="p-2 rounded-lg hover:bg-[#f5f9f7] transition-colors text-[#9ca3af] hover:text-[#0b1310]">
            <Layers className="w-5 h-5" />
          </button>
        </header>

        {/* Progress bar */}
        <div className="h-1 flex-shrink-0" style={{ background: '#e5ede9' }}>
          <motion.div
            className="h-full"
            style={{ background: 'linear-gradient(90deg, #1a5d47, #0f7a55)' }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Lesson content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-3xl mx-auto px-6 lg:px-12 py-10">
            <motion.div
              key={activeUnitId}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {/* Type badge row */}
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: typeConf?.bg, color: typeConf?.color, border: `1px solid ${typeConf?.border}` }}>
                  {typeConf?.icon}
                  {typeConf?.label}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
                  <Clock className="w-3.5 h-3.5" />
                  {currentUnit?.duration}
                </span>
                <span className="flex items-center gap-1.5 text-xs ml-auto font-semibold" style={{ color: '#0f7a55' }}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentUnit?.xp} XP
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-[44px] font-extrabold text-[#0b1310] mb-6 leading-tight">
                {currentUnit?.title}
              </h1>

              {/* Objectives */}
              {currentContent.objectives && currentContent.objectives.length > 0 && (
                <div className="mb-8 p-6 rounded-[16px]"
                  style={{ background: '#f0fdf7', border: '1px solid #a7f3d0' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-[#0f7a55]" />
                    <span className="text-base font-extrabold text-[#0f7a55] uppercase tracking-wider">Learning Objectives</span>
                  </div>
                  <ul className="space-y-3">
                    {currentContent.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[18px] text-[#374151] leading-relaxed">
                        <div className="w-2 h-2 rounded-full bg-[#0f7a55] mt-2 flex-shrink-0" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Body text */}
              {currentUnit?.type !== 'quiz' && currentContent.body && (
                <div className="space-y-6 mb-10">
                  {currentContent.body.map((para, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.05 }}
                      className="text-[20px] md:text-[22px] text-[#2c3733] leading-[1.85] font-light"
                      dangerouslySetInnerHTML={{ __html: para.replace(/\*(.*?)\*/g, '<strong style="color:#0f7a55;font-weight:700">$1</strong>') }}
                    />
                  ))}
                </div>
              )}

              {/* Key Takeaways */}
              {currentUnit?.type !== 'quiz' && currentContent.keyTakeaways && currentContent.keyTakeaways.length > 0 && (
                <div className="mb-10 p-6 rounded-[16px]" style={{ background: '#fafafa', border: '1px solid #e5e7eb' }}>
                  <div className="flex items-center gap-2 mb-5">
                    <ListChecks className="w-5 h-5 text-[#0f7a55]" />
                    <h2 className="text-xl font-extrabold text-[#0b1310]">Key Takeaways</h2>
                  </div>
                  <ul className="space-y-3">
                    {currentContent.keyTakeaways.map((t, i) => (
                      <li key={i} className="flex items-start gap-3 text-[18px] text-[#374151] leading-relaxed">
                        <CheckCircle2 className="w-5 h-5 text-[#0f7a55] flex-shrink-0 mt-0.5" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Practical Exercise */}
              {currentUnit?.type !== 'quiz' && currentContent.practicalExercise && (
                <div className="mb-10 p-6 rounded-[16px]" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <PlayCircle className="w-5 h-5 text-[#2563eb]" />
                    <h2 className="text-xl font-extrabold text-[#2563eb]">Practical Exercise</h2>
                  </div>
                  <p className="text-[18px] text-[#374151] leading-relaxed">{currentContent.practicalExercise}</p>
                </div>
              )}

              {/* Activity steps (fallback) */}
              {currentContent.activitySteps && (
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-6">
                    <PlayCircle className="w-6 h-6 text-[#059669]" />
                    <h2 className="text-2xl font-extrabold text-[#0b1310]">Practice Steps</h2>
                  </div>
                  <div className="space-y-4">
                    {currentContent.activitySteps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.06 }}
                        className="flex items-start gap-4 p-5 rounded-[14px]"
                        style={{ background: '#f8faf9', border: '1px solid #e5ede9' }}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold flex-shrink-0"
                          style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
                          {i + 1}
                        </div>
                        <p className="text-[19px] text-[#374151] leading-relaxed pt-0.5">{step}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reflection prompts */}
              {currentContent.reflectionPrompts && (
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-6">
                    <PenLine className="w-6 h-6 text-[#7c3aed]" />
                    <h2 className="text-2xl font-extrabold text-[#0b1310]">Reflection Questions</h2>
                  </div>
                  <div className="space-y-5">
                    {currentContent.reflectionPrompts.map((prompt, i) => (
                      <div key={i} className="p-6 rounded-[16px]"
                        style={{ background: '#faf5ff', border: '1px solid #ddd6fe' }}>
                        <p className="text-[18px] text-[#7c3aed] font-semibold mb-4 leading-relaxed">{prompt}</p>
                        <textarea
                          value={reflectionAnswers[`${activeUnitId}-${i}`] ?? ''}
                          onChange={e => setReflectionAnswers(prev => ({ ...prev, [`${activeUnitId}-${i}`]: e.target.value }))}
                          rows={4}
                          placeholder="Write your reflection here..."
                          className="w-full bg-transparent text-[18px] text-[#374151] resize-none outline-none leading-relaxed placeholder-[#c4b5fd]"
                          style={{ caretColor: '#7c3aed' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quiz */}
              {currentUnit?.type === 'quiz' && currentContent.quizQuestions && (
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-6">
                    <HelpCircle className="w-6 h-6 text-[#d97706]" />
                    <h2 className="text-2xl font-extrabold text-[#0b1310]">Knowledge Check</h2>
                    <span className="text-sm text-[#9ca3af] ml-2">{currentContent.quizQuestions.length} questions</span>
                  </div>

                  <div className="space-y-8">
                    {currentContent.quizQuestions.map((q, qi) => (
                      <div key={qi} className="p-7 rounded-[18px]"
                        style={{ background: '#fafafa', border: '1px solid #e5e7eb' }}>
                        <p className="text-[20px] font-bold text-[#0b1310] mb-5 leading-snug">
                          <span className="text-[#d97706] mr-2">{qi + 1}.</span>{q.question}
                        </p>
                        <div className="space-y-3">
                          {q.options.map((opt, oi) => {
                            const selected = quizAnswers[qi] === oi;
                            const correct  = quizSubmitted && oi === q.correct;
                            const wrong    = quizSubmitted && selected && oi !== q.correct;
                            return (
                              <button
                                key={oi}
                                disabled={quizSubmitted}
                                onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                                className="w-full flex items-center gap-3 px-5 py-4 rounded-[12px] text-left transition-all text-[18px]"
                                style={{
                                  background: correct ? '#ecfdf5' : wrong ? '#fef2f2' : selected ? '#fffbeb' : '#ffffff',
                                  border: correct ? '1px solid #6ee7b7' : wrong ? '1px solid #fca5a5' : selected ? '1px solid #fde68a' : '1px solid #e5e7eb',
                                  color: correct ? '#059669' : wrong ? '#dc2626' : selected ? '#d97706' : '#374151',
                                }}
                              >
                                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ border: `1.5px solid ${correct ? '#6ee7b7' : wrong ? '#fca5a5' : selected ? '#fde68a' : '#d1d5db'}` }}>
                                  {correct && <CheckCircle2 className="w-4 h-4 text-[#059669]" />}
                                  {wrong   && <X className="w-3.5 h-3.5 text-[#dc2626]" />}
                                  {selected && !quizSubmitted && <div className="w-3 h-3 rounded-full bg-[#d97706]" />}
                                </div>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      onClick={() => {
                        if (Object.keys(quizAnswers).length === currentContent.quizQuestions!.length) setQuizSubmitted(true);
                      }}
                      disabled={Object.keys(quizAnswers).length < (currentContent.quizQuestions?.length ?? 0)}
                      className="mt-6 flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all disabled:opacity-30"
                      style={{ background: 'linear-gradient(135deg, #1a5d47, #0f7a55)', color: '#fff' }}
                    >
                      <ListChecks className="w-4 h-4" />
                      Submit Answers
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-5 rounded-[14px] flex items-center gap-4"
                      style={{ background: '#f0fdf7', border: '1px solid #a7f3d0' }}
                    >
                      <CheckCircle2 className="w-8 h-8 text-[#0f7a55] flex-shrink-0" />
                      <div>
                        <p className="text-[14px] font-bold text-[#0f7a55]">Assessment Complete!</p>
                        <p className="text-[12px] text-[#6b7280]">
                          {Object.entries(quizAnswers).filter(([qi, ans]) => ans === currentContent.quizQuestions![+qi].correct).length} / {currentContent.quizQuestions?.length} correct
                        </p>
                      </div>
                      <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }}
                        className="ml-auto flex items-center gap-1.5 text-xs text-[#9ca3af] hover:text-[#0b1310] transition-colors">
                        <RotateCcw className="w-3.5 h-3.5" />Retry
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Summary */}
              {currentContent.summary && (
                <div className="mb-10 p-6 rounded-[16px]"
                  style={{ background: '#f0fdf7', border: '1px solid #a7f3d0' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[#0f7a55]" />
                    <span className="text-sm font-bold text-[#0f7a55] uppercase tracking-wider">Summary</span>
                  </div>
                  <p className="text-[18px] text-[#374151] leading-relaxed italic">{currentContent.summary}</p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center gap-4 mt-8 pt-8" style={{ borderTop: '1px solid #e5ede9' }}>
                {prevUnit && (
                  <button
                    onClick={() => setActiveUnitId(prevUnit.id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-[#6b7280] hover:text-[#0b1310] transition-all"
                    style={{ background: '#f3f4f6', border: '1px solid #e5e7eb' }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                )}

                <button
                  onClick={markComplete}
                  disabled={completedUnits.has(activeUnitId)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all flex-1 justify-center"
                  style={{
                    background: completedUnits.has(activeUnitId) ? '#ecfdf5' : 'linear-gradient(135deg, #1a5d47, #0f7a55)',
                    color: completedUnits.has(activeUnitId) ? '#0f7a55' : '#fff',
                    border: completedUnits.has(activeUnitId) ? '1px solid #a7f3d0' : 'none',
                    boxShadow: completedUnits.has(activeUnitId) ? 'none' : '0 4px 16px rgba(15,122,85,0.2)',
                  }}
                >
                  {completedUnits.has(activeUnitId)
                    ? <><CheckCircle2 className="w-4 h-4" />Completed</>
                    : <><Award className="w-4 h-4" />Mark as Complete</>
                  }
                </button>

                {nextUnit && (
                  <button
                    onClick={() => setActiveUnitId(nextUnit.id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all"
                    style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#0f7a55' }}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
            <div className="h-12" />
          </div>
        </div>
      </main>

      {/* ═══════════════ RIGHT PANEL ═══════════════ */}
      <AnimatePresence>
        {rightPanelOpen && (
          <motion.aside
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-[296px] flex-shrink-0 flex flex-col h-full overflow-hidden"
            style={{ background: '#ffffff', borderLeft: '1px solid #e5ede9' }}
          >
            {/* Tabs */}
            <div className="flex items-center flex-shrink-0" style={{ borderBottom: '1px solid #e5ede9' }}>
              {([
                { key: 'notes',   icon: <NotebookPen className="w-3.5 h-3.5" />, label: 'Notes'   },
                { key: 'journal', icon: <PenLine className="w-3.5 h-3.5" />,     label: 'Journal' },
              ] as const).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setRightTab(tab.key)}
                  className="flex-1 flex flex-col items-center gap-1 py-3 text-[12px] font-bold uppercase tracking-wider transition-colors"
                  style={{
                    color: rightTab === tab.key ? '#0f7a55' : '#9ca3af',
                    borderBottom: rightTab === tab.key ? '2px solid #0f7a55' : '2px solid transparent',
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto">

              {/* NOTES */}
              {rightTab === 'notes' && (
                <div className="p-4 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <NotebookPen className="w-4 h-4 text-[#2563eb]" />
                    <h3 className="text-[15px] font-bold text-[#0b1310]">Lesson Notes</h3>
                    <span className="ml-auto text-[11px] text-[#9ca3af] font-medium">Auto-saved</span>
                  </div>
                  <p className="text-[13px] text-[#9ca3af] mb-3">Notes are saved per lesson.</p>
                  <textarea
                    value={notes[activeUnitId] ?? ''}
                    onChange={e => setNotes(prev => ({ ...prev, [activeUnitId]: e.target.value }))}
                    placeholder="Take notes on this lesson..."
                    className="flex-1 w-full bg-transparent text-[15px] text-[#374151] resize-none outline-none leading-relaxed placeholder-[#d1d5db]"
                    style={{ caretColor: '#2563eb', minHeight: '300px' }}
                  />
                </div>
              )}

              {/* JOURNAL */}
              {rightTab === 'journal' && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <PenLine className="w-4 h-4 text-[#7c3aed]" />
                    <h3 className="text-[15px] font-bold text-[#0b1310]">Reflection Journal</h3>
                  </div>
                  <div className="mb-4 p-3.5 rounded-[12px]"
                    style={{ background: '#faf5ff', border: '1px solid #ddd6fe' }}>
                    <p className="text-[13px] text-[#7c3aed] font-semibold mb-1.5">Today's Reflection Prompt</p>
                    <p className="text-[14px] text-[#6b7280] leading-relaxed font-medium">
                      What did this lesson reveal to you? What specific action will you take from what you learned today?
                    </p>
                  </div>
                  <textarea
                    value={journal[activeUnitId] ?? ''}
                    onChange={e => setJournal(prev => ({ ...prev, [activeUnitId]: e.target.value }))}
                    rows={10}
                    placeholder="Begin your reflection..."
                    className="w-full bg-transparent text-[15px] text-[#374151] resize-none outline-none leading-relaxed placeholder-[#c4b5fd]"
                    style={{ caretColor: '#7c3aed' }}
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-[#9ca3af] font-medium">{(journal[activeUnitId] ?? '').length} characters</span>
                    <button
                      onClick={() => toast.success('Journal entry saved successfully!')}
                      className="text-[13px] text-[#7c3aed] hover:text-[#5b21b6] transition-colors font-semibold"
                    >
                      Save Entry →
                    </button>
                  </div>
                </div>
              )}

            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* XP Burst */}
      <AnimatePresence>
        {xpBurst && (
          <XPBurst key={xpBurst.key} xp={xpBurst.xp} onDone={() => setXpBurst(null)} />
        )}
      </AnimatePresence>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        certificateImage={PATH_CERTIFICATES[pathId ?? ''] ?? '/CERTIFICATE1.png'}
        courseTitle={path.title}
      />
    </div>
  );
};

export default CoursePlayerPage;
