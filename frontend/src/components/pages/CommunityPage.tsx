import { motion } from "motion/react";
import { X, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import LeftSidebar from "../community/LeftSidebar";
import SearchBar from "../community/SearchBar";
import Feed from "../community/Feed";
import RightSidebar from "../community/RightSidebar";
import type { Post } from "../community/communityData";

export function CommunityPage() {
  const { user } = useAuth();
  const [showPostModal, setShowPostModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [postContent, setPostContent] = useState("");
  const [filter, setFilter] = useState<string>("Recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [hashtagFilter, setHashtagFilter] = useState("");
  const [toast, setToast] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  const SUGGESTED_TAGS = ["#happiness", "#habits", "#healing", "#meditation", "#soundhealing", "#wellness"];
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);

  const currentUser = {
    name: user?.name || "You",
    initial: (user?.name?.[0] || "Y").toUpperCase(),
    avatarColor: "#2D6A4F",
  };

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const params = new URLSearchParams();
        if (filter === "Popular") params.set("sort", "popular");
        if (searchQuery.trim()) params.set("q", searchQuery.trim());
        const res = await fetch(`http://localhost:5001/api/posts?${params}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (e) {
        console.error("Failed to fetch posts", e);
      }
    };
    fetchPosts();
  }, [filter, searchQuery]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) return;
    const hashtags = (postContent.match(/#[a-zA-Z0-9_]+/g) || []).map(t => t.toLowerCase());
    const newPost = {
      userId: "current",
      userName: currentUser.name,
      userRole: (user as any)?.role || "Wellness Seeker",
      userInitial: currentUser.initial,
      avatarColor: currentUser.avatarColor,
      avatarUrl: (user as any)?.avatar || "",
      title: postContent.split("\n")[0].slice(0, 80),
      body: postContent,
      hashtags,
      isCertified: false,
      isOnline: true,
    };
    try {
      const res = await fetch("http://localhost:5001/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      if (res.ok) {
        const saved = await res.json();
        setPosts(prev => [saved, ...prev]);
        showToast("Post shared!");
      }
    } catch {
      // Optimistic fallback
      const fallback: Post = {
        id: `local-${Date.now()}`,
        ...newPost,
        timestampValue: Date.now(),
        likes: 0,
        liked: false,
        comments: [],
      };
      setPosts(prev => [fallback, ...prev]);
      showToast("Post shared (offline)");
    }
    setPostContent("");
    setShowPostModal(false);
  };

  const handleProfileClick = (post: Post) => {
    setSelectedProfile(post);
    setShowProfileModal(true);
  };

  const [topMentors, setTopMentors] = useState([
    {
      id: "m1", name: "Dr. Anjali Sharma", specialty: "Vedic Meditation",
      bio: "Certified Vedic meditation teacher with 15+ years experience.",
      followers: 2300, posts: 48,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
      followed: false, starred: false,
    },
    {
      id: "m2", name: "Master Li Wei", specialty: "Qi Gong & Energy",
      bio: "Qi Gong master and energy healing practitioner.",
      followers: 1800, posts: 32,
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
      followed: false, starred: false,
    },
    {
      id: "m3", name: "Elena Costa", specialty: "Sound Therapy",
      bio: "Sound therapist specializing in crystal bowl healing.",
      followers: 3100, posts: 61,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      followed: false, starred: false,
    },
  ]);

  return (
    <div className="community-theme bg-white text-black min-h-screen pt-24 pb-16">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-[#16a34a] text-white px-5 py-2 rounded-full text-sm shadow-lg">
          {toast}
        </div>
      )}

      <div className="w-full mx-0 px-0">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-6 px-6">
          <aside className="hidden lg:block sticky top-24 self-start px-4 border-r border-black/10">
            <LeftSidebar active={filter} onSelect={(k) => { setFilter(k); setHashtagFilter(""); }} />
          </aside>

          {/* Main Feed */}
          <main className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-[760px]">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </div>
            </div>

            <div className="w-full max-w-[760px] mx-auto">
              <div
                className="h-[calc(100vh-6rem)] overflow-y-scroll hide-scrollbar"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
              >
                <Feed
                  posts={posts}
                  filter={filter}
                  searchQuery={searchQuery}
                  hashtagFilter={hashtagFilter}
                  currentUser={currentUser}
                  onPostsChange={setPosts}
                  onToast={showToast}
                  onProfileClick={handleProfileClick}
                />
              </div>
            </div>
          </main>

          <aside className="hidden lg:block sticky top-24 self-start px-4">
            <RightSidebar
              trending={[
                { title: "#meditation", count: "1.2k" },
                { title: "#soundhealing", count: "890" },
                { title: "#wellness", count: "743" },
                { title: "#healing", count: "612" },
                { title: "#mindfulness", count: "534" },
              ]}
              mentors={topMentors}
              activeHashtag={hashtagFilter}
              onCreate={() => setShowPostModal(true)}
              onTrendClick={(tag) => { setHashtagFilter(tag === hashtagFilter ? "" : tag); }}
              onFollow={(id) => setTopMentors(prev => prev.map(m => m.id === id ? { ...m, followed: !m.followed } : m))}
              onStar={(id) => setTopMentors(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m))}
              onViewProfile={(p) => {
                setSelectedProfile({
                  userName: p.name, userRole: p.specialty,
                  avatarUrl: p.avatar, timestampValue: Date.now(),
                  body: p.bio, likes: p.followers, comments: [],
                });
                setShowProfileModal(true);
              }}
            />
          </aside>
        </div>

        {/* Create Post Modal */}
        {showPostModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowPostModal(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-white rounded-[32px] p-8 shadow-2xl"
            >
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                onClick={() => setShowPostModal(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-teal-600"
              >
                <X className="w-6 h-6" />
              </motion.button>

              <h3 className="text-2xl text-emerald-800 mb-6">Share Your Journey</h3>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-emerald-300 flex-shrink-0 flex items-center justify-center text-white font-bold"
                  style={{ background: currentUser.avatarColor }}>
                  {currentUser.initial}
                </div>
                <div>
                  <p className="text-teal-800 font-semibold">{currentUser.name}</p>
                  <p className="text-sm text-teal-600">{(user as any)?.role || "Wellness Seeker"}</p>
                </div>
              </div>

              <div className="relative">
                <textarea
                  value={postContent}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPostContent(v);
                    const m = v.match(/#([a-zA-Z0-9_]*)$/);
                    if (m) {
                      const q = m[1].toLowerCase();
                      setTagSuggestions(SUGGESTED_TAGS.filter(t => t.toLowerCase().includes(q)));
                    } else {
                      setTagSuggestions([]);
                    }
                  }}
                  placeholder="What's on your mind? Share your wellness journey, tips, or celebrations..."
                  className="w-full h-40 p-4 rounded-2xl border border-emerald-200/50 focus:border-emerald-500 focus:outline-none resize-none text-teal-800 placeholder-teal-400"
                />
                {tagSuggestions.length > 0 && (
                  <div className="absolute right-0 left-0 mt-2 max-w-md mx-auto bg-white border border-emerald-200 rounded-md shadow z-20 overflow-hidden">
                    {tagSuggestions.map(t => (
                      <button key={t} onClick={() => { setPostContent(postContent.replace(/#([a-zA-Z0-9_]*)$/, t + " ")); setTagSuggestions([]); }}
                        className="w-full text-left px-3 py-2 hover:bg-emerald-50">{t}</button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-6">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPostModal(false)}
                  className="flex-1 px-6 py-3 rounded-full border border-emerald-300 text-teal-800 hover:bg-emerald-50 transition-colors">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleCreatePost} disabled={!postContent.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Post
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Profile Modal */}
        {showProfileModal && selectedProfile && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowProfileModal(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-gradient-to-br from-white via-emerald-100 to-teal-200 rounded-[32px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileModal(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-teal-600 z-10">
                <X className="w-6 h-6" />
              </motion.button>

              <div className="text-center">
                <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-emerald-400 mx-auto mb-6 flex items-center justify-center"
                  style={{ background: selectedProfile.avatarColor || "#2D6A4F" }}>
                  {selectedProfile.avatarUrl
                    ? <img src={selectedProfile.avatarUrl} alt={selectedProfile.userName} className="w-full h-full object-cover" />
                    : <span className="text-white text-4xl font-bold">{selectedProfile.userInitial || selectedProfile.userName?.[0]}</span>
                  }
                </div>
                <h3 className="text-2xl text-emerald-800 font-bold mb-2">{selectedProfile.userName}</h3>
                <p className="text-teal-700 font-semibold mb-4">{selectedProfile.userRole}</p>

                <div className="flex justify-around gap-4 mb-6 bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-center">
                    <p className="text-2xl text-emerald-600 font-bold">{selectedProfile.likes || 0}</p>
                    <p className="text-xs text-teal-600">Likes</p>
                  </div>
                  <div className="w-px bg-emerald-300/30" />
                  <div className="text-center">
                    <p className="text-2xl text-emerald-600 font-bold">{selectedProfile.comments?.length || 0}</p>
                    <p className="text-xs text-teal-600">Comments</p>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 mb-6 text-left">
                  <p className="text-xs text-teal-600 font-semibold mb-2">Latest Post</p>
                  <p className="text-teal-800 text-sm leading-relaxed">{selectedProfile.body}</p>
                </div>

                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-semibold hover:shadow-lg transition-all">
                  Follow
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
