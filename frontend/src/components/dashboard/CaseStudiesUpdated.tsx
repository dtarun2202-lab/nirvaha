import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Quote } from 'lucide-react';

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

export const CaseStudies = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/success-stories/display?limit=20', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Failed to fetch stories');
      
      const data = await response.json();
      setStories(data.stories || []);
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError('Failed to load stories');
      // Fallback to default stories
      setStories(getDefaultStories());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultStories = (): Story[] => {
    return [
      {
        _id: '1',
        title: 'From Burnout to Balance in 21 Days',
        description: 'Professional transformation through guided meditation',
        quote: '"The guided meditation protocols didn\'t just help me sleep; they helped me rediscover the joy in my work."',
        image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1200&auto=format&fit=crop',
        category: 'FEATURED TRANSFORMATION',
        userName: 'Rohit K.',
        location: 'Software Engineer, Hyderabad',
        rating: 5,
        badge: 'FEATURED TRANSFORMATION',
        bgColor: 'bg-white',
        textColor: 'text-[#0F131A]',
        type: 'featured'
      },
      {
        _id: '2',
        title: 'Overcoming Anxiety Through Sound',
        description: 'Personal Growth',
        quote: '"The binaural beats and ancient chanting modules provided a sanctuary I didn\'t know I needed."',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop',
        category: 'Personal Growth',
        userName: 'Marcus J.',
        location: 'Tech Professional',
        rating: 5,
        badge: 'PERSONAL GROWTH',
        bgColor: 'bg-white',
        textColor: 'text-[#1a5d47]',
        type: 'small'
      },
      {
        _id: '3',
        title: 'Chronic Pain Relief via Ayurvedic Wisdom',
        description: 'Health Mastery',
        quote: 'Reversing years of back pain through consistent yoga nidra and herbal guidance.',
        image: 'https://images.unsplash.com/photo-1506790881129-a9674e44b2ab?q=80&w=600&auto=format&fit=crop',
        category: 'Health Mastery',
        userName: 'Sarah P.',
        location: 'Wellness Coach',
        rating: 5,
        badge: 'HEALTH MASTERY',
        bgColor: 'bg-[#1a5d47]',
        textColor: 'text-white',
        type: 'small'
      }
    ];
  };

  if (loading) {
    return (
      <section className="min-h-screen flex flex-col justify-center py-8 bg-[#EEF7F1] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#1a5d47] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#1a5d47] font-semibold">Loading success stories...</p>
          </div>
        </div>
      </section>
    );
  }

  const featuredStory = stories.find(s => s.type === 'featured') || stories[0];
  const smallStories = stories.filter(s => s.type === 'small' || s !== featuredStory).slice(0, 2);

  return (
    <section className="min-h-screen flex flex-col justify-center py-8 bg-[#EEF7F1] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="max-w-2xl self-center">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex -space-x-1.5 mr-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full border border-white overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span 
                className="text-[#1a5d47] font-bold tracking-widest text-[10px] uppercase"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                5000+ Lives Transformed
              </span>
            </div>
            <h2 
              className="text-3xl md:text-4xl font-bold text-[#0F131A]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Success Stories
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Real people, real transformations. See how Nirvaha is changing lives through the power of ancient wisdom and modern science.
            </p>
          </div>
          <button className="group flex items-center gap-2 text-[#1a5d47] font-semibold hover:text-[#113d2f] transition-all duration-300 pb-1">
            <span className="border-b-2 border-transparent group-hover:border-[#1a5d47] transition-all duration-300">View More</span>
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {/* Stories Grid */}
        {featuredStory && (
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Featured Case Study - Left */}
            <div
              className="lg:col-span-7 group relative h-full min-h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl bg-white cursor-pointer"
              onClick={() =>
                window.open("https://www.mindful.org/category/meditation/", "_blank")
              }
            >
              <img
                src={featuredStory.image}
                alt={featuredStory.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

              <div className="absolute top-8 left-8">
                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-bold tracking-[0.2em] uppercase border border-white/20">
                  {featuredStory.badge}
                </span>
              </div>

              <div className="absolute bottom-10 left-10 right-10">
                <div className="flex gap-1 mb-4">
                  {Array(featuredStory.rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                  {featuredStory.title}
                </h3>
                <p className="text-gray-200 text-lg mb-6 line-clamp-2 max-w-xl">
                  {featuredStory.quote}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white/30 overflow-hidden shadow-lg bg-white/10 flex items-center justify-center text-white font-bold">
                    {featuredStory.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-bold">{featuredStory.userName}</p>
                    <p className="text-white/60 text-xs tracking-wider uppercase">{featuredStory.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Smaller Case Studies - Right */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              {smallStories.map((story) => (
                <div
                  key={story._id}
                  onClick={() =>
                    window.open(
                      "https://www.youtube.com/results?search_query=anxiety+sound+healing",
                      "_blank"
                    )
                  }
                  className={`flex-1 ${story.bgColor} p-8 rounded-[2rem] border ${story.bgColor === 'bg-white' ? 'border-gray-100' : 'border-[#2a7d67]'} shadow-xl hover:shadow-2xl transition-all duration-500 group relative overflow-hidden cursor-pointer`}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Quote className="w-20 h-20 text-[#1a5d47]" />
                  </div>
                  <span className={`${story.textColor} font-bold text-xs tracking-widest uppercase mb-4 block`}>
                    {story.category}
                  </span>
                  <h3 className={`text-2xl font-bold ${story.textColor} mb-4`}>
                    {story.title}
                  </h3>
                  <p className={`${story.bgColor === 'bg-white' ? 'text-gray-600' : 'text-emerald-50/80'} mb-6 flex-grow italic`}>
                    {story.quote}
                  </p>
                  <div className={`flex justify-between items-center pt-6 border-t ${story.bgColor === 'bg-white' ? 'border-gray-50' : 'border-white/10'} mt-auto`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${story.bgColor === 'bg-white' ? 'bg-emerald-50' : 'bg-white/10'} flex items-center justify-center ${story.textColor} font-bold`}>
                        {story.userName.charAt(0)}
                      </div>
                      <p className={`${story.textColor} font-bold text-sm`}>{story.userName}</p>
                    </div>
                    <ArrowRight className={`w-5 h-5 ${story.textColor} group-hover:translate-x-2 transition-transform`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 font-semibold">{error}</p>
          </div>
        )}
      </div>
    </section>
  );
};
