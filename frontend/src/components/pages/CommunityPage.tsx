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

  // Dedup by MongoDB _id (guaranteed unique) with id as fallback
  const dedup = (arr: Post[]): Post[] =>
    Array.from(new Map(arr.map(p => [(p as any)._id?.toString() || p.id, p])).values());

  // Normalize post — ensure id field is always set from _id or id
  const normalizePost = (p: any): Post => ({
    ...p,
    id: p.id || p._id?.toString(),
  });

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
      else if (filter === "All") params.set("sort", "all");
      else params.set("sort", "recent");
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (hashtagFilter.trim()) params.set("hashtag", hashtagFilter.trim());
      params.set("page", String(pageNum));
      params.set("limit", "20");

      const res = await fetch(`${API}/api/posts?${params}`);
      if (res.ok) {
        const data = await res.json();
        // Handle both old array response and new {posts, total} shape
        const incoming: Post[] = Array.isArray(data) ? data : (data.posts || []);
        const total: number = Array.isArray(data) ? incoming.length : (data.total || 0);

        const normalized = incoming.map(normalizePost);
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

  // ── Real-time socket events ──────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const matchId = (p: Post, id: string) =>
      p.id === id || (p as any)._id?.toString() === id;

    const onPostCreated = (raw: any) => {
      const post = normalizePost(raw);
      console.log('📥 Socket: Post created', post.id);
      setPosts(prev => dedup([post, ...prev]));
      fetchTrending();
    };

    const onPostLiked = ({ id, likes, liked }: { id: string; likes: number; liked: boolean }) => {
      setPosts(prev => prev.map(p => matchId(p, id) ? { ...p, likes, liked } : p));
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

    socket.on("postCreated", onPostCreated);
    socket.on("postLiked", onPostLiked);
    socket.on("commentAdded", onCommentAdded);
    socket.on("postDeleted", onPostDeleted);

    return () => {
      socket.off("postCreated", onPostCreated);
      socket.off("postLiked", onPostLiked);
      socket.off("commentAdded", onCommentAdded);
      socket.off("postDeleted", onPostDeleted);
    };
  }, [socket, filter]);

  // ── Polling fallback — re-fetch every 15s in case socket misses events ──
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPosts(1, false);
    }, 15000);
    return () => clearInterval(interval);
  }, [filter, searchQuery, hashtagFilter]);

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
      showToast("Your post contains inappropriate language. Please revise it.");
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
        // Fallback: If socket doesn't fire for us immediately, add manually.
        // The dedup logic will prevent duplicates if the socket event also arrives.
        setPosts(prev => dedup([newPost, ...prev]));
        showToast("Post shared! 🌿");
        fetchTrending();
      } else {
        throw new Error("Server error");
      }
    } catch {
      // Offline fallback only — socket won't fire so we add manually
      const fallback: Post = {
        id: `local-${Date.now()}`,
        ...payload,
        timestampValue: Date.now(),
        likes: 0,
        liked: false,
        comments: [],
        isCertified: false,
        isOnline: true,
      };
      setPosts(prev => dedup([fallback, ...prev]));
      showToast("Post shared (offline) 🌿");
    }
    setPostContent("");
    setTagSuggestions([]);
    setShowPostModal(false);
  };

  const handleProfileClick = (post: Post) => {
    setSelectedProfile(post);
    setShowProfileModal(true);
  };

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

  // Use real trending from backend only — no hardcoded fallback
  const displayTrending = trending;

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
                      onPostsChange={setPosts}
                      onToast={showToast}
                      onProfileClick={handleProfileClick}
                    />
                    {/* Load More */}
                    {hasMore && posts.length > 0 && (
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
