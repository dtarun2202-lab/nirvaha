import { motion, AnimatePresence } from "framer-motion";
import BACKEND_CONFIG from "../../config/backend";
import { X, Send } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import LeftSidebar from "../community/LeftSidebar";
import SearchBar from "../community/SearchBar";
import Feed from "../community/Feed";
import RightSidebar from "../community/RightSidebar";
import CreatePost from "../community/CreatePost";
import type { Post } from "../community/communityData";

const API = BACKEND_CONFIG.API_BASE_URL;

export function CommunityPage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [showPostModal, setShowPostModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [postContent, setPostContent] = useState("");
  const [filter, setFilter] = useState<string>("Recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [hashtagFilter, setHashtagFilter] = useState("");
  const [toast, setToast] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [trending, setTrending] = useState<{ title: string; count: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const [topMentors, setTopMentors] = useState([
    {
      id: "m1",
      name: "Aarav Mehta",
      role: "Meditation Coach",
      specialty: "Mindfulness & Stress Relief",
      experience: "6+ years",
      verified: true,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "Mindfulness & Stress Relief expert with 6+ years experience.",
      followers: 1200, posts: 24,
      followed: false, starred: false,
    },
    {
      id: "m2",
      name: "Meera Iyer",
      role: "Yoga & Breathwork Expert",
      specialty: "Pranayama & Relaxation",
      experience: "8+ years",
      verified: true,
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      bio: "Yoga & Breathwork expert with 8+ years experience.",
      followers: 2100, posts: 42,
      followed: false, starred: false,
    },
    {
      id: "m3",
      name: "Rahul Verma",
      role: "Sound Healing Practitioner",
      specialty: "Energy Healing",
      experience: "5+ years",
      verified: true,
      avatar: "https://randomuser.me/api/portraits/men/76.jpg",
      bio: "Sound Healing practitioner with 5+ years experience.",
      followers: 1500, posts: 18,
      followed: false, starred: false,
    },
  ]);

  // Dedup by MongoDB _id (guaranteed unique) with id as fallback
  const dedup = (arr: Post[]): Post[] =>
    Array.from(new Map(arr.map(p => [(p as any)._id?.toString() || p.id, p])).values());

  // Normalize post — ensure id field is always set from _id or id,
  // and compute per-user liked from likedBy array
  const normalizePost = (p: any): Post => {
    const likedBy: string[] = Array.isArray(p.likedBy) ? p.likedBy : [];
    return {
      ...p,
      id: p.id || p._id?.toString(),
      likedBy,
      likes: likedBy.length > 0 ? likedBy.length : (p.likes ?? 0),
      liked: user?.id ? likedBy.includes(user.id) : false,
    };
  };

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hashtagTotal, setHashtagTotal] = useState<number | null>(null);

  const SUGGESTED_TAGS = ["#happiness", "#habits", "#healing", "#meditation", "#soundhealing", "#wellness"];
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);

  const currentUser = {
    name: user?.name || "You",
    initial: (user?.name?.[0] || "Y").toUpperCase(),
    avatarColor: "#2D6A4F",
  };

  // ── Fetch posts ──────────────────────────────────────────────────────────
  const fetchPosts = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      const params = new URLSearchParams();
      if (filter === "Popular") params.set("sort", "popular");
      else params.set("sort", "recent");

      if (searchQuery.trim()) params.set("q", searchQuery.trim());

      // Mindfulness and Healing tabs use category-based filtering on the backend
      if (filter === "Mindfulness") {
        params.set("category", "mindfulness");
      } else if (filter === "Healing") {
        params.set("category", "healing");
      }

      // Hashtag filter (from clicking a trending tag)
      const currentHashtag = hashtagFilter.trim();
      if (currentHashtag && filter !== "Mindfulness" && filter !== "Healing") {
        params.set("hashtag", currentHashtag.startsWith("#") ? currentHashtag : `#${currentHashtag}`);
      }
      
      params.set("page", String(pageNum));
      params.set("limit", "20");

      const res = await fetch(`${API}/api/posts?${params}`);
      if (res.ok) {
        const data = await res.json();
        // Handle both old array response and new {posts, total} shape
        const incoming: Post[] = Array.isArray(data) ? data : (data.posts || []);
        const total: number = Array.isArray(data) ? incoming.length : (data.total || 0);

        let normalized = incoming.map(normalizePost);
        if (append) {
          setPosts(prev => dedup([...prev, ...normalized]));
        } else {
          setPosts(dedup(normalized));
        }
        setHasMore(incoming.length === 20);
        if (hashtagFilter) setHashtagTotal(total);
        else setHashtagTotal(null);
      }
    } catch (e) {
      console.error("Failed to fetch posts", e);
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch trending ───────────────────────────────────────────────────────
  const fetchTrending = async () => {
    try {
      const res = await fetch(`${API}/api/posts/trending`);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) setTrending(data);
      }
    } catch (e) {
      console.error("Failed to fetch trending", e);
    }
  };

  useEffect(() => { setPage(1); fetchPosts(1, false); }, [filter, searchQuery, hashtagFilter]);
  useEffect(() => { fetchTrending(); }, []);

  // Determine whether a newly socket-received post belongs in the current tab.
  // Relies entirely on the categories/hashtags the backend assigned — no keyword guessing.
  const shouldShowPost = (post: Post, currentFilter: string, currentTag: string) => {
    // Recent and Popular show all posts
    if (currentFilter === "Recent" || currentFilter === "All" || currentFilter === "Popular") return true;

    if (currentFilter === "Mindfulness") {
      return post.categories?.some((c) => c.toLowerCase() === "mindfulness") ?? false;
    }

    if (currentFilter === "Healing") {
      return post.categories?.some((c) => c.toLowerCase() === "healing") ?? false;
    }

    // Hashtag tab
    if (currentTag.trim()) {
      const clean = currentTag.toLowerCase().replace(/^#/, "");
      return post.hashtags?.some((t: string) => {
        const lt = t.toLowerCase().replace(/^#/, "");
        return lt === clean;
      }) ?? false;
    }

    return false;
  };

  // ── Real-time socket events ──────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const matchId = (p: Post, id: string) =>
      p.id === id || (p as any)._id?.toString() === id;

    const onPostCreated = (raw: any) => {
      const post = normalizePost(raw);
      console.log('📥 Socket: Post created', post.id);
      if (shouldShowPost(post, filter, hashtagFilter)) {
        setPosts(prev => dedup([post, ...prev]));
      }
      fetchTrending();
    };

    const onPostLiked = ({ id, likes, likedBy }: { id: string; likes: number; likedBy: string[] }) => {
      setPosts(prev => prev.map(p => {
        if (!matchId(p, id)) return p;
        const lb = Array.isArray(likedBy) ? likedBy : [];
        return {
          ...p,
          likes,
          likedBy: lb,
          liked: user?.id ? lb.includes(user.id) : false,
        };
      }));
    };

    const onCommentAdded = ({ postId, comment }: { postId: string; comment: any }) => {
      setPosts(prev => prev.map(p => {
        if (!matchId(p, postId)) return p;
        const exists = p.comments.some((c: any) => c.id === comment.id);
        if (exists) return p;
        return { ...p, comments: [...p.comments, comment] };
      }));
    };

    const onPostDeleted = ({ id }: { id: string }) => {
      setPosts(prev => prev.filter(p => !matchId(p, id)));
    };

    const onTrendingUpdated = (newTrending: any) => {
      console.log('📥 Socket: Trending updated', newTrending);
      if (newTrending && newTrending.length > 0) {
        setTrending(newTrending);
      }
    };

    const onPostShared = ({ id, shares }: { id: string; shares: number }) => {
      setPosts(prev => prev.map(p => matchId(p, id) ? { ...p, shares } : p));
    };

    socket.on("postCreated", onPostCreated);
    socket.on("postLiked", onPostLiked);
    socket.on("commentAdded", onCommentAdded);
    socket.on("postDeleted", onPostDeleted);
    socket.on("trendingUpdated", onTrendingUpdated);
    socket.on("postShared", onPostShared);

    return () => {
      socket.off("postCreated", onPostCreated);
      socket.off("postLiked", onPostLiked);
      socket.off("commentAdded", onCommentAdded);
      socket.off("postDeleted", onPostDeleted);
      socket.off("trendingUpdated", onTrendingUpdated);
      socket.off("postShared", onPostShared);
    };
  }, [socket, filter, hashtagFilter]);

  // ── Auto-remove expired posts from UI ────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setPosts(prev => prev.filter(p => !p.expiresAt || new Date(p.expiresAt).getTime() > now));
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Polling removed — relying purely on real-time WebSockets for a smooth, non-refreshing experience.

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ── Banned words filter ─────────────────────────────────────────────────
  const BANNED_WORDS = [
    "fuck", "shit", "bitch", "asshole", "bastard", "cunt", "dick", "pussy",
    "nigger", "nigga", "faggot", "retard", "whore", "slut", "motherfucker",
    "damn", "hell", "ass", "crap", "piss", "cock", "bollocks", "wanker",
  ];
  const containsBannedWord = (text: string): boolean => {
    const lower = text.toLowerCase();
    return BANNED_WORDS.some(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(lower);
    });
  };

  // ── Create post ──────────────────────────────────────────────────────────
  const handleCreatePost = async () => {
    if (!postContent.trim()) return;

    if (containsBannedWord(postContent)) {
      showToast("Your post contains inappropriate language. Please edit and try again.");
      return;
    }
    const hashtags = (postContent.match(/#[a-zA-Z0-9_]+/g) || []).map(t => t.toLowerCase());
    const payload = {
      userId: user?.id || "anonymous",
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
      const res = await fetch(`${API}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const newPost = await res.json();
        const post = normalizePost(newPost);
        // Fallback: If socket doesn't fire for us immediately, add manually if it matches our tab.
        // The dedup logic will prevent duplicates if the socket event also arrives.
        if (shouldShowPost(post, filter, hashtagFilter)) {
          setPosts(prev => dedup([post, ...prev]));
        }
        showToast("Post shared! 🌿");
        fetchTrending();
      } else {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData.error || "Failed to share post";
        showToast(errorMsg);
      }
    } catch (err) {
      // Network failure — show error, do not inject uncategorized local post
      showToast("Failed to share post. Please check your connection and try again.");
    }
    setPostContent("");
    setTagSuggestions([]);
    setShowPostModal(false);
  };

  const handleProfileClick = (post: Post) => {
    setSelectedProfile(post);
    setShowProfileModal(true);
  };

  // topMentors state moved up

  // Use real trending from backend only — no hardcoded fallback
  const displayTrending = trending;

  return (
    <div className="community-theme bg-[#fafaf9] text-[#0f172a] min-h-screen pt-28 pb-16 relative overflow-hidden">
      {/* Premium Background Orbs & Styles */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100vh) translateX(0) scale(0.5); opacity: 0; }
          10% { opacity: 0.15; }
          90% { opacity: 0.15; }
          100% { transform: translateY(-10vh) translateX(40px) scale(1.2); opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1) translate(0px, 0px); opacity: 0.3; }
          50% { transform: scale(1.08) translate(20px, -10px); opacity: 0.4; }
        }
        .particle {
          position: fixed;
          bottom: -80px;
          background: radial-gradient(circle, rgba(22,163,74,0.12) 0%, rgba(20,184,166,0) 75%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .orb-green {
          position: fixed;
          top: 10%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(167,243,208,0.4) 0%, rgba(250,250,249,0) 70%);
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
          animation: pulseGlow 20s infinite ease-in-out;
        }
        .orb-teal {
          position: fixed;
          bottom: 10%;
          right: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(204,251,241,0.4) 0%, rgba(250,250,249,0) 70%);
          border-radius: 50%;
          filter: blur(140px);
          pointer-events: none;
          z-index: 0;
          animation: pulseGlow 25s infinite ease-in-out alternate;
        }
      `}</style>
      
      <div className="orb-green animate-pulse" />
      <div className="orb-teal animate-pulse" />
      
      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(12)].map((_, i) => {
          const size = Math.random() * 80 + 40;
          const left = Math.random() * 100;
          const delay = Math.random() * 10;
          const duration = Math.random() * 12 + 12;
          return (
            <div
              key={i}
              className="particle"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                animation: `floatUp ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-white/90 backdrop-blur-xl text-[#16a34a] border border-[#16a34a]/20 px-6 py-3 rounded-full text-[14px] font-bold shadow-[0_8px_30px_rgb(22,163,74,0.12)]">
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
              {/* Hashtag filter header */}
              {hashtagFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between mb-3 px-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#16a34a]">{hashtagFilter}</span>
                    {hashtagTotal !== null && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {hashtagTotal} post{hashtagTotal !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setHashtagFilter("")}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Clear ✕
                  </button>
                </motion.div>
              )}

              <div
                className="h-[calc(100vh-6rem)] overflow-y-scroll hide-scrollbar"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
              >
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-6 h-6 border-2 border-[#16a34a] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <>
                    <Feed
                      posts={posts}
                      filter={filter}
                      searchQuery={searchQuery}
                      hashtagFilter={hashtagFilter}
                      hashtagTotal={hashtagTotal}
                      currentUser={currentUser}
                      currentUserId={user?.id || 'anonymous'}
                      onPostsChange={setPosts}
                      onToast={showToast}
                      onProfileClick={handleProfileClick}
                    />
                    {/* Load More */}
                    {filter !== "Games" && hasMore && posts.length > 0 && (
                      <div className="flex justify-center py-6">
                        <button
                          onClick={() => {
                            const next = page + 1;
                            setPage(next);
                            fetchPosts(next, true);
                          }}
                          className="px-6 py-2 text-sm font-medium text-[#16a34a] border border-[#16a34a] rounded-full hover:bg-[#f0fdf4] transition-all"
                        >
                          Load more
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </main>

          <aside className="hidden lg:block sticky top-24 self-start px-4">
            <RightSidebar
              trending={displayTrending}
              mentors={topMentors}
              activeHashtag={hashtagFilter}
              onCreate={() => setShowPostModal(true)}
              onTrendClick={(tag) => { setHashtagFilter(tag === hashtagFilter ? "" : tag); }}
              onFollow={(id) => setTopMentors(prev => prev.map(m => m.id === id ? { ...m, followed: !m.followed } : m))}
              onStar={(id) => setTopMentors(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m))}
              onViewProfile={(p) => {
                setSelectedProfile({
                  mentorId: p.id,
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
        <AnimatePresence>
          {showPostModal && (
            <CreatePost
              postContent={postContent}
              setPostContent={setPostContent}
              tagSuggestions={tagSuggestions}
              setTagSuggestions={setTagSuggestions}
              SUGGESTED_TAGS={SUGGESTED_TAGS}
              currentUser={currentUser}
              user={user}
              onSubmit={handleCreatePost}
              onClose={() => setShowPostModal(false)}
            />
          )}
        </AnimatePresence>

        {/* Profile Modal — compact */}
        {showProfileModal && selectedProfile && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowProfileModal(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Close */}
              <button onClick={() => setShowProfileModal(false)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-xs z-10">
                ✕
              </button>

              {/* Header strip */}
              <div className="h-16 bg-gradient-to-r from-emerald-400 to-teal-500" />

              {/* Avatar */}
              <div className="flex flex-col items-center -mt-8 px-5 pb-5">
                <div className="w-16 h-16 rounded-full border-4 border-white shadow overflow-hidden flex items-center justify-center text-white font-bold text-xl"
                  style={{ background: selectedProfile.avatarColor || "#2D6A4F" }}>
                  {selectedProfile.avatarUrl
                    ? <img src={selectedProfile.avatarUrl} alt={selectedProfile.userName} className="w-full h-full object-cover" />
                    : (selectedProfile.userInitial || selectedProfile.userName?.[0] || "?")}
                </div>
                <h3 className="mt-2 text-base font-bold text-gray-900">{selectedProfile.userName}</h3>
                <p className="text-xs text-[#16a34a] font-medium">{selectedProfile.userRole}</p>

                {selectedProfile.body && (
                  <p className="mt-3 text-xs text-gray-500 text-center line-clamp-3 leading-relaxed">{selectedProfile.body}</p>
                )}

                <motion.button whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    if (selectedProfile.mentorId) {
                      setTopMentors(prev => prev.map(m =>
                        m.id === selectedProfile.mentorId ? { ...m, followed: !m.followed } : m
                      ));
                      const isNowFollowed = !topMentors.find(m => m.id === selectedProfile.mentorId)?.followed;
                      showToast(isNowFollowed ? `Following ${selectedProfile.userName} 🌿` : `Unfollowed ${selectedProfile.userName}`);
                    }
                  }}
                  className={`mt-4 w-full py-2 text-sm font-semibold rounded-full transition-colors ${
                    topMentors.find(m => m.id === selectedProfile.mentorId)?.followed
                      ? "bg-[#f0fdf4] text-[#16a34a] border border-[#86efac] hover:bg-[#dcfce7]"
                      : "bg-[#16a34a] hover:bg-[#15803d] text-white"
                  }`}>
                  {topMentors.find(m => m.id === selectedProfile.mentorId)?.followed ? "✓ Following" : "Follow"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
