import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Music, PlayCircle, Heart, Sparkles, MessageCircle, Send, ThumbsUp, CornerDownRight } from 'lucide-react';
import { DashboardFooter } from '../components/dashboard/DashboardFooter';

const stories = {
    "1": {
        name: "Aisha Patel",
        avatar: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=150&auto=format&fit=crop",
        quote: "Breathe. You are exactly where you need to be.",
        title: "Finding My Breath After Burnout",
        trauma: "For years, I worked 80-hour weeks in corporate finance. I thought the chest tightness and sleepless nights were just the price of success. It wasn't until I had a full-blown panic attack in a meeting that I realized I had completely lost touch with myself.",
        nirvahaHelp: "Nirvaha became my sanctuary. Instead of doom-scrolling before bed, I started using the structured meditation pathways. It taught me how to sit with my anxiety instead of running from it. The gamified wellness tracking gave me the same dopamine hit my work used to, but for my health.",
        favorites: {
            chant: "Cosmic OM Chant",
            music: "432Hz Deep Sleep Frequencies",
            feature: "Daily Wellness Check-ins"
        },
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop"
    },
    "2": {
        name: "Arjun Verma",
        avatar: "/arjun verma.png",
        quote: "Stillness is where healing begins.",
        title: "Rebuilding After Loss",
        trauma: "After losing my father unexpectedly, grief completely consumed me. I isolated myself from friends and fell into a deep depression. I couldn't find the energy to talk to anyone, not even therapists.",
        nirvahaHelp: "The anonymity and gentle pace of Nirvaha saved me. I started with just 5 minutes of listening to the Healing Music engine. Slowly, I joined the anonymous Community circles. Hearing others share their grief without judgment made me realize I wasn't alone. Nirvaha held space for me when I couldn't hold it for myself.",
        favorites: {
            chant: "Gayatri Resonance",
            music: "Solfeggio 528Hz (Miracle Tone)",
            feature: "Anonymous Community Circles"
        },
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop"
    },
    "3": {
        name: "Rohan Sharma",
        avatar: "/rohan.jpg",
        quote: "Let go of what no longer serves you.",
        title: "Overcoming Imposter Syndrome",
        trauma: "Despite a successful career in tech, I suffered from crippling imposter syndrome. I was constantly anxious that I would be 'found out.' This led to severe digestive issues and chronic insomnia.",
        nirvahaHelp: "Nirvaha's Vedic wisdom modules shifted my perspective entirely. The teachings on detachment and Karma Yoga helped me separate my self-worth from my productivity. The Chakra Healing section specifically helped me ground my root chakra, easing my anxiety.",
        favorites: {
            chant: "Soma Lunar Nectar",
            music: "Root Chakra Singing Bowls",
            feature: "Vedic Wisdom Library"
        },
        image: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=1200&auto=format&fit=crop"
    },
    "4": {
        name: "Aditya Rao",
        avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=150&auto=format&fit=crop",
        quote: "Every breath is a new beginning.",
        title: "Recovering from Addiction",
        trauma: "I struggled with substance abuse for the better part of my twenties. Even after getting clean, the mental noise and cravings were deafening. I needed a way to rewire my brain.",
        nirvahaHelp: "Nirvaha's interactive breathing exercises became my emergency brake. Whenever a craving hit, I would open the app and do a 4-7-8 breathing cycle. The visual cues and calming audio anchored me in the present. It gave me the tools to regulate my nervous system autonomously.",
        favorites: {
            chant: "Brahma Nada",
            music: "Binaural Beats for Focus",
            feature: "Pranayama Breathing Tool"
        },
        image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1200&auto=format&fit=crop"
    },
    "5": {
        name: "Priya Desai",
        avatar: "/priya.jpg",
        quote: "Your peace is your power.",
        title: "Healing from a Toxic Relationship",
        trauma: "Leaving a narcissist left me with zero self-esteem and complex PTSD. My mind was constantly racing, replaying conversations. I couldn't trust my own judgment anymore.",
        nirvahaHelp: "Nirvaha's affirmations and AI companion guided me back to myself. The AI companion never judged; it just offered gentle, CBT-based reflections that helped me untangle my thoughts. The daily inspirational quotes were the first positive things I read every morning.",
        favorites: {
            chant: "Maha Mrityunjaya",
            music: "Heart Chakra Flute",
            feature: "AI Wellness Companion"
        },
        image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=1200&auto=format&fit=crop"
    },
    "6": {
        name: "Kavya Iyer",
        avatar: "/kavya.png",
        quote: "Find beauty in the present moment.",
        title: "Navigating Chronic Illness",
        trauma: "Being diagnosed with an autoimmune disease at 25 felt like a death sentence to my old life. The physical pain was secondary to the anger and resentment I felt toward my own body.",
        nirvahaHelp: "Through Nirvaha's Sound Healing, I learned to send love to the parts of my body that were hurting, rather than hating them. The Wellness OTT section gave me access to incredible documentaries about mind-body healing that completely shifted my paradigm.",
        favorites: {
            chant: "Anahata Heart Frequency",
            music: "Cellular Healing Frequencies",
            feature: "Wellness OTT Documentaries"
        },
        image: "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?q=80&w=1200&auto=format&fit=crop"
    }
};

export default function InspirationStoryPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const story = id ? stories[id as keyof typeof stories] : null;
    
    // Comments State
    interface Reply {
        id: string;
        user: string;
        avatar: string;
        text: string;
        time: string;
    }
    
    interface Comment {
        id: string;
        user: string;
        avatar: string;
        text: string;
        time: string;
        likes: number;
        isLiked: boolean;
        replies: Reply[];
    }

    const [comments, setComments] = useState<Comment[]>([
        {
            id: 'c1',
            user: 'Anonymous',
            avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=e8f5e9',
            text: 'I felt every single word of this. Thank you for sharing your truth; it makes me feel so much less alone.',
            time: '2 hours ago',
            likes: 12,
            isLiked: false,
            replies: [
                {
                    id: 'r1',
                    user: 'Sarah M.',
                    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=e8f5e9',
                    text: 'Same here. We are all in this together.',
                    time: '1 hour ago'
                }
            ]
        },
        {
            id: 'c2',
            user: 'David K.',
            avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=David&backgroundColor=e8f5e9',
            text: 'This is exactly why I love Nirvaha. The tools are great, but hearing real stories of healing is what keeps me going.',
            time: '5 hours ago',
            likes: 8,
            isLiked: false,
            replies: []
        }
    ]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        
        const comment: Comment = {
            id: Date.now().toString(),
            user: 'You',
            avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=You&backgroundColor=c8e6c9',
            text: newComment,
            time: 'Just now',
            likes: 0,
            isLiked: false,
            replies: []
        };
        
        setComments([comment, ...comments]);
        setNewComment('');
    };

    const handleToggleLike = (commentId: string) => {
        setComments(comments.map(c => {
            if (c.id === commentId) {
                return {
                    ...c,
                    isLiked: !c.isLiked,
                    likes: c.isLiked ? c.likes - 1 : c.likes + 1
                };
            }
            return c;
        }));
    };

    const handleAddReply = (commentId: string) => {
        if (!replyText.trim()) return;

        const reply: Reply = {
            id: Date.now().toString(),
            user: 'You',
            avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=You&backgroundColor=c8e6c9',
            text: replyText,
            time: 'Just now'
        };

        setComments(comments.map(c => {
            if (c.id === commentId) {
                return {
                    ...c,
                    replies: [...c.replies, reply]
                };
            }
            return c;
        }));

        setReplyingTo(null);
        setReplyText('');
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!story) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
                <h1 className="text-2xl text-[#1a5d47]">Story not found.</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAF8]">
            {/* Header / Hero */}
            <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img src={story.image} alt={story.title} className="absolute inset-0 w-full h-full object-cover" />
                
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-16 max-w-5xl mx-auto w-full">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 w-fit transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
                        {story.title}
                    </h1>
                    <div className="flex items-center gap-4">
                        <img src={story.avatar} alt={story.name} className="w-12 h-12 rounded-full border-2 border-white/50 object-cover" />
                        <div>
                            <p className="text-white font-medium">{story.name}</p>
                            <p className="text-white/70 text-sm italic">"{story.quote}"</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    
                    {/* Main Story Column */}
                    <div className="md:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold text-[#1a3d2b] mb-4 flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
                                <span className="text-[#86c586]">✧</span> The Struggle
                            </h2>
                            <p className="text-[#5f6f65] leading-relaxed text-lg whitespace-pre-line">
                                {story.trauma}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[#1a3d2b] mb-4 flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
                                <span className="text-[#86c586]">✧</span> Finding Nirvaha
                            </h2>
                            <p className="text-[#5f6f65] leading-relaxed text-lg whitespace-pre-line">
                                {story.nirvahaHelp}
                            </p>
                        </section>
                    </div>

                    {/* Sidebar / Favorites */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-[#f0f5f0] rounded-2xl p-6 border border-[#c8e6c9]">
                            <h3 className="text-lg font-bold text-[#1a5d47] mb-6 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-[#86c586]" /> My Favorites
                            </h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#7a9384] mb-2">Favorite Chant</p>
                                    <Link to="/healing-music" className="group flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-transparent hover:border-[#86c586] transition-all">
                                        <div className="w-8 h-8 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#2e7d32]">
                                            <Music className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium text-[#1a3d2b] group-hover:text-[#2e7d32] transition-colors">{story.favorites.chant}</span>
                                    </Link>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#7a9384] mb-2">Healing Music</p>
                                    <Link to="/healing-music" className="group flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-transparent hover:border-[#86c586] transition-all">
                                        <div className="w-8 h-8 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#2e7d32]">
                                            <PlayCircle className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium text-[#1a3d2b] group-hover:text-[#2e7d32] transition-colors">{story.favorites.music}</span>
                                    </Link>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#7a9384] mb-2">Top Feature</p>
                                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
                                        <div className="w-8 h-8 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#2e7d32]">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium text-[#1a3d2b]">{story.favorites.feature}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comment Section */}
                <div className="mt-16 pt-12 border-t border-[#c8e6c9]/50 max-w-3xl">
                    <h3 className="text-2xl font-bold text-[#1a3d2b] mb-8 flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
                        <MessageCircle className="w-6 h-6 text-[#86c586]" /> Community Reflections ({comments.length})
                    </h3>

                    {/* Add Comment Form */}
                    <form onSubmit={handleAddComment} className="mb-10 flex gap-4">
                        <img 
                            src="https://api.dicebear.com/7.x/notionists/svg?seed=You&backgroundColor=c8e6c9" 
                            alt="Your Avatar" 
                            className="w-10 h-10 rounded-full border border-[#86c586]" 
                        />
                        <div className="flex-1 relative">
                            <textarea 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts or relate to this story..."
                                className="w-full bg-white border border-[#c8e6c9] rounded-2xl p-4 pr-14 text-sm text-[#1a3d2b] focus:outline-none focus:ring-2 focus:ring-[#86c586] focus:border-transparent resize-none h-[80px]"
                            />
                            <button 
                                type="submit"
                                disabled={!newComment.trim()}
                                className="absolute bottom-3 right-3 p-2 bg-[#1a5d47] text-white rounded-xl hover:bg-[#113d2f] disabled:opacity-50 disabled:hover:bg-[#1a5d47] transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-6">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-4 group">
                                <img 
                                    src={comment.avatar} 
                                    alt={comment.user} 
                                    className="w-10 h-10 rounded-full border border-[#c8e6c9] mt-1" 
                                />
                                <div className="flex-1">
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-[#c8e6c9]/40 shadow-sm transition-shadow group-hover:shadow-md">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-[#1a3d2b] text-sm">{comment.user}</span>
                                            <span className="text-xs text-[#7a9384]">{comment.time}</span>
                                        </div>
                                        <p className="text-sm text-[#5f6f65] leading-relaxed">
                                            {comment.text}
                                        </p>
                                    </div>
                                    
                                    {/* Actions (Like / Reply) */}
                                    <div className="flex items-center gap-4 mt-2 ml-2">
                                        <button 
                                            onClick={() => handleToggleLike(comment.id)}
                                            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${comment.isLiked ? 'text-[#1a5d47]' : 'text-[#7a9384] hover:text-[#1a5d47]'}`}
                                        >
                                            <ThumbsUp className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-[#1a5d47]' : ''}`} />
                                            {comment.likes > 0 && comment.likes}
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setReplyingTo(replyingTo === comment.id ? null : comment.id);
                                                setReplyText('');
                                            }}
                                            className="text-xs font-semibold text-[#7a9384] hover:text-[#1a5d47] transition-colors"
                                        >
                                            Reply
                                        </button>
                                    </div>

                                    {/* Reply Input Box */}
                                    {replyingTo === comment.id && (
                                        <div className="mt-3 flex gap-3 ml-2">
                                            <img 
                                                src="https://api.dicebear.com/7.x/notionists/svg?seed=You&backgroundColor=c8e6c9" 
                                                alt="Your Avatar" 
                                                className="w-8 h-8 rounded-full border border-[#86c586]" 
                                            />
                                            <div className="flex-1 relative">
                                                <input 
                                                    type="text"
                                                    autoFocus
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleAddReply(comment.id);
                                                    }}
                                                    placeholder="Write a reply..."
                                                    className="w-full bg-white border border-[#c8e6c9] rounded-xl py-2 pl-3 pr-10 text-sm text-[#1a3d2b] focus:outline-none focus:ring-2 focus:ring-[#86c586]"
                                                />
                                                <button 
                                                    onClick={() => handleAddReply(comment.id)}
                                                    disabled={!replyText.trim()}
                                                    className="absolute top-1/2 -translate-y-1/2 right-2 text-[#1a5d47] disabled:opacity-50 hover:text-[#113d2f]"
                                                >
                                                    <Send className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Nested Replies */}
                                    {comment.replies.length > 0 && (
                                        <div className="mt-4 space-y-4">
                                            {comment.replies.map(reply => (
                                                <div key={reply.id} className="flex gap-3 relative">
                                                    <div className="absolute -left-6 top-4 w-4 border-b-2 border-l-2 border-[#c8e6c9] rounded-bl-lg h-full -z-10"></div>
                                                    <img 
                                                        src={reply.avatar} 
                                                        alt={reply.user} 
                                                        className="w-8 h-8 rounded-full border border-[#c8e6c9]" 
                                                    />
                                                    <div className="flex-1 bg-[#f0f5f0]/50 p-3 rounded-2xl rounded-tl-none border border-[#c8e6c9]/30">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="font-bold text-[#1a3d2b] text-xs">{reply.user}</span>
                                                            <span className="text-[10px] text-[#7a9384]">{reply.time}</span>
                                                        </div>
                                                        <p className="text-sm text-[#5f6f65] leading-relaxed">
                                                            {reply.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <DashboardFooter />
        </div>
    );
}
