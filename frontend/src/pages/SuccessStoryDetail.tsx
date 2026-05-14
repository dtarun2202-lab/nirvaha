import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Quote, MapPin, Tag } from 'lucide-react';
import BACKEND_CONFIG from '@/config/backend';

interface Story {
  _id: string;
  title: string;
  description: string;
  quote: string;
  image: string;
  category: string;
  userName: string;
  location: string;
  rating: number;
  badge: string;
  bgColor: string;
  textColor: string;
  type: 'featured' | 'small';
}

const FALLBACK_STORIES: Story[] = [
  {
    _id: "fallback-1",
    title: "From Burnout to Balance in 21 Days",
    description: "I was completely burnt out from working 80-hour weeks in the tech industry. I couldn't sleep, my anxiety was through the roof, and I had lost all motivation. Discovering Nirvaha's guided meditation protocols was a turning point. It didn't just help me sleep; it helped me rediscover the joy in my work and life. The structured 21-day program completely rewired my stress response. Now, I feel more resilient, focused, and genuinely happy.",
    quote: "The guided meditation protocols didn't just help me sleep; they helped me rediscover the joy in my work.",
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1200&auto=format&fit=crop",
    category: "Featured",
    userName: "Rohit K.",
    location: "Software Engineer, Hyderabad",
    rating: 5,
    badge: "Featured Transformation",
    bgColor: "bg-white",
    textColor: "text-[#1a5d47]",
    type: "featured",
  },
  {
    _id: "fallback-2",
    title: "Overcoming Anxiety Through Sound",
    description: "Anxiety had become my daily companion. I tried various therapies, but nothing seemed to provide lasting relief. Then I started using Nirvaha's sound healing modules. The binaural beats combined with ancient chanting created a sanctuary of peace I didn't know I needed. It's now an essential part of my morning routine, allowing me to start my day with clarity and calmness instead of dread.",
    quote: "The binaural beats and ancient chanting modules provided a sanctuary I didn't know I needed.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
    category: "Personal Growth",
    userName: "Marcus J.",
    location: "Teacher, London",
    rating: 5,
    badge: "",
    bgColor: "bg-white",
    textColor: "text-[#1a5d47]",
    type: "small",
  },
  {
    _id: "fallback-3",
    title: "Chronic Pain Relief via Ayurvedic Wisdom",
    description: "Living with chronic back pain for years was draining both physically and emotionally. I was skeptical about trying yet another program, but the combination of targeted yoga nidra and specific herbal guidance on Nirvaha caught my attention. Slowly, over three months, I began to notice a profound shift. The pain didn't just lessen; my entire body felt more aligned and energetic. It's been a true reversal of years of suffering.",
    quote: "Reversing years of back pain through consistent yoga nidra and herbal guidance.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
    category: "Health Mastery",
    userName: "Sarah P.",
    location: "Architect, New York",
    rating: 5,
    badge: "",
    bgColor: "bg-[#1a5d47]",
    textColor: "text-white",
    type: "small",
  }
];

export default function SuccessStoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchStory = async () => {
      try {
        setLoading(true);
        // First check fallbacks
        const fallback = FALLBACK_STORIES.find(s => s._id === id);
        if (fallback) {
          setStory(fallback);
          setLoading(false);
          return;
        }

        // Fetch from backend
        const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/success-stories`);
        const data = await response.json();
        
        if (data.stories && data.stories.length > 0) {
          const found = data.stories.find((s: Story) => s._id === id);
          if (found) {
            setStory(found);
          } else {
            // Not found, go back
            navigate(-1);
          }
        }
      } catch (error) {
        console.error("Failed to load success story", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EEF7F1] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#1a5d47] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[#1a5d47] font-semibold text-lg animate-pulse">Loading Story...</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-[#EEF7F1] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-bold text-[#0F131A] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>Story Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md">The transformation story you are looking for does not exist or has been removed.</p>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-[#1a5d47] hover:bg-[#113d2f] text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF7F1]">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full bg-[#1a5d47]">
        {story.image ? (
          <img 
            src={story.image} 
            alt={story.title} 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1a5d47] to-[#113d2f]"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#EEF7F1] via-black/40 to-black/20"></div>
        
        {/* Navigation */}
        <div className="absolute top-8 left-8 md:left-16 z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-5 py-2.5 rounded-full font-semibold transition-all border border-white/30 hover:border-white/50"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
        </div>

        <div className="absolute bottom-12 left-0 w-full px-6 md:px-16 z-10">
          <div className="max-w-5xl mx-auto">
            {story.badge && (
              <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold tracking-[0.2em] uppercase border border-white/30 mb-6">
                {story.badge}
              </span>
            )}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg" style={{ fontFamily: "'Cinzel', serif" }}>
              {story.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex gap-1">
                {[...Array(story.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400 drop-shadow-md" />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 opacity-80" />
                <span className="font-semibold tracking-wider uppercase text-sm">{story.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-6 md:px-16 py-16 -mt-8 relative z-20">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl border border-gray-100">
          <div className="grid md:grid-cols-12 gap-12">
            
            {/* Left Column: Testimonial & Details */}
            <div className="md:col-span-8 space-y-10">
              <div className="relative">
                <Quote className="absolute -top-8 -left-8 w-24 h-24 text-emerald-50 opacity-50 -z-10" />
                <h3 className="text-2xl md:text-3xl font-medium text-[#1a5d47] leading-relaxed italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  "{story.quote}"
                </h3>
              </div>

              <div className="prose prose-lg prose-emerald max-w-none">
                <h4 className="text-xl font-bold text-[#0F131A] mb-4 uppercase tracking-wide text-sm">Transformation Details</h4>
                <p className="text-gray-700 leading-loose whitespace-pre-line text-lg">
                  {story.description || "The transformation details for this story are being updated. Check back soon for the full journey of healing and growth."}
                </p>
              </div>
            </div>

            {/* Right Column: User Profile */}
            <div className="md:col-span-4">
              <div className="bg-[#EEF7F1] rounded-3xl p-8 border border-emerald-100 sticky top-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1a5d47] to-emerald-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-white mb-6">
                    {story.userName.charAt(0)}
                  </div>
                  <h4 className="text-2xl font-bold text-[#0F131A] mb-2">{story.userName}</h4>
                  
                  {story.location && (
                    <div className="flex items-center justify-center gap-2 text-gray-600 mb-6 bg-white px-4 py-2 rounded-full shadow-sm text-sm font-medium w-full">
                      <MapPin className="w-4 h-4 text-[#1a5d47]" />
                      <span>{story.location}</span>
                    </div>
                  )}

                  <div className="w-full h-px bg-emerald-200/50 mb-6"></div>
                  
                  <p className="text-sm text-gray-500 mb-6 italic">
                    This is a verified transformation story from the Nirvaha community.
                  </p>

                  <Link 
                    to="/dashboard/overview"
                    className="w-full block bg-[#1a5d47] hover:bg-[#113d2f] text-white py-3.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    Start Your Journey
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
