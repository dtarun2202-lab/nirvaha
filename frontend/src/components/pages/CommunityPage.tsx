import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import LeftSidebar from "../community/LeftSidebar";
import SearchBar from "../community/SearchBar";
import Feed from "../community/Feed";
import RightSidebar from "../community/RightSidebar";
import type { Post } from "../community/communityData";
import { io } from "socket.io-client";

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-[#2D6A4F] text-white text-sm px-5 py-3 rounded-full shadow-xl"
    >
      {message}
    </motion.div>
  );
}

// ── Profile modal ────────────────────────────────────────────────────────────
function ProfileModal({ profile, onClose }: { profile: any; onClose: () => void }) {
  const [followed, setFollowed] = useState(profile.followed ?? false);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
        onClick={e => e.stopPropagation()}
        className="relative max-w-sm w-full bg-white rounded-3xl p-7 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500">
          <X className="w-4 h-4" />
        </button>

        <div className="text-center">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-[#52B788]/30 mx-auto mb-4">
            {profile.avatarUrl || profile.avatar
              ? <img src={profile.avatarUrl || profile.avatar} alt={profile.userName || profile.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold" style={{ background: profile.avatarColor || "#2D6A4F" }}>{profile.userInitial || (profile.name?.[0] ?? "?")}</div>
            }
          </div>

          <h3 className="text-xl font-bold text-[#0f172a]">{profile.userName || profile.name}</h3>
          <p className="text-sm text-[#6b7280] mt-1">{profile.userRole || profile.specialty}</p>

          {profile.bio && <p className="text-sm text-[#1e293b] mt-3 leading-relaxed">{profile.bio}</p>}

          {/* Stats */}
          <div className="flex justify-around mt-5 mb-5 bg-[#f6f7f8] rounded-2xl p-3">
            <div className="text-center">
              <p className="text-lg font-bold text-[#0f172a]">{profile.followers ?? 156}</p>
              <p className="text-xs text-[#6b7280]">Followers</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-lg font-bold text-[#0f172a]">{profile.posts ?? 23}</p>
              <p className="text-xs text-[#6b7280]">Posts</p>
            </div>
          </div>

          <button
            onClick={() => setFollowed(v => !v)}
            className={`w-full py-2.5 rounded-full font-semibold text-sm transition-all ${
              followed
                ? "bg-[#dcfce7] text-[#16a34a] border border-[#16a34a]"
                : "bg-[#2D6A4F] text-white hover:bg-[#1B4332]"
            }`}
          >
            {followed ? "Following" : "Follow"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Create Post Modal ────────────────────────────────────────────────────────
function CreateModal({
  currentUser,
  onClose,
  onSubmit,
}: {
  currentUser: { name: string; role: string; initial: string; avatarColor: string };
  onClose: () => void;
  onSubmit: (title: string, body: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const MAX = 500;

  const handleSubmit = () => {
    if (!title.trim() || !body.trim()) return;
    onSubmit(title.trim(), body.trim());
  };

  // Auto-detect hashtags in body
  const detectedTags = Array.from(body.matchAll(/#([a-zA-Z0-9_]+)/g)).map(m => m[1]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
        onClick={e => e.stopPropagation()}
        className="relative max-w-2xl w-full bg-white rounded-3xl p-8 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-6 right-6 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500">
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-xl font-bold text-[#0f172a] mb-5">Share Your Journey</h3>

        {/* Author row */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: currentUser.avatarColor }}>
            {currentUser.initial}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0f172a]">{currentUser.name}</p>
            <p className="text-xs text-[#6b7280]">{currentUser.role}</p>
          </div>
        </div>

        {/* Title */}
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Post title..."
          className="w-full border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] placeholder-[#9ca3af] focus:outline-none focus:border-[#52B788] mb-3"
        />

        {/* Body */}
        <div className="relative">
          <textarea
            value={body}
            onChange={e => setBody(e.target.value.slice(0, MAX))}
            placeholder="What's on your mind? Share your wellness journey, tips, or celebrations... Use #hashtags"
            rows={5}
            className="w-full border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm text-[#0f172a] placeholder-[#9ca3af] focus:outline-none focus:border-[#52B788] resize-none"
          />
          <span className={`absolute bottom-3 right-3 text-xs ${body.length >= MAX ? "text-red-400" : "text-[#9ca3af]"}`}>
            {body.length}/{MAX}
          </span>
        </div>

        {/* Detected hashtags */}
        {detectedTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {detectedTags.map((t, i) => (
              <span key={i} className="text-xs bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-2 py-0.5 rounded-full">#{t}</span>
            ))}
          </div>
        )}

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-full border border-gray-200 text-[#1e293b] text-sm hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !body.trim()}
            className="flex-1 py-2.5 rounded-full bg-[#2D6A4F] text-white text-sm font-semibold hover:bg-[#1B4332] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Post
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export function CommunityPage() {
  const { user } = useAuth();

  const currentUser = {
    name: user?.name || "Gayar Sathvika",
    role: user?.role || "Community Member",
    initial: (user?.name?.[0] || "G").toUpperCase(),
    avatarColor: "#2D6A4F",
  };

  const [posts, setPosts] = useState<Post[]>([]);
  const [trendingTags, setTrendingTags] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [filter, setFilter] = useState("Recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [hashtagFilter, setHashtagFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [profileModal, setProfileModal] = useState<any>(null);
  const [toast, setToast] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const showToast = (msg: string) => setToast(msg);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchMentors = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/profiles`);
      if (res.ok) setMentors(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchTrending = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/trending`);
      if (res.ok) setTrendingTags(await res.json());
    } catch (e) { console.error(e); }
  };

  // Data fetching & Socket.IO
  useEffect(() => {
    fetchMentors();
    
    const socket = io("http://localhost:5001");

    const loadPosts = async () => {
      setIsLoading(true);
      const typeParam = filter.toLowerCase();
      if (debouncedSearchQuery.trim()) {
        try {
          const res = await fetch(`http://localhost:5001/api/search?q=${encodeURIComponent(debouncedSearchQuery)}&type=${typeParam}`);
          if (res.ok) {
            const data = await res.json();
            setPosts(data.posts);
          }
        } catch (e) {}
      } else {
        try {
          const res = await fetch(`http://localhost:5001/api/posts?type=${typeParam}`);
          if (res.ok) setPosts(await res.json());
        } catch (e) { console.error(e); }
        await fetchTrending();
      }
      setIsLoading(false);
    };

    loadPosts();

    // Socket listeners
    socket.on("post_created", (newPost: Post) => {
      // Avoid duplicates if we also use optimistic UI
      setPosts(prev => {
        if (prev.find(p => p.id === newPost.id)) return prev;
        
        // If sorting by recent, add to top. If popular, it has 0 likes so add to bottom (or rely on full refresh)
        // For simplicity, always prepend or re-sort. Prepending is fine for real-time feel.
        return filter === "Popular" ? [...prev, newPost].sort((a,b) => b.likes - a.likes) : [newPost, ...prev];
      });
    });

    socket.on("post_updated", (updatedPost: Post) => {
      setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    });

    socket.on("trending_updated", () => {
      fetchTrending();
    });

    return () => {
      socket.disconnect();
    };
  }, [debouncedSearchQuery, filter]);

  // Clicking a hashtag toggles filter
  const handleTrendClick = (tag: string) => {
    setHashtagFilter(prev => prev === tag ? "" : tag);
    setFilter("Recent");
    setSearchQuery("");
  };

  // Left sidebar filter change clears hashtag/search
  const handleFilterChange = (f: string) => {
    setFilter(f);
    setHashtagFilter("");
    setSearchQuery("");
  };

  // Search clears hashtag filter
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q) setHashtagFilter("");
  };

  const handleCreatePost = async (title: string, body: string) => {
    const hashtags = Array.from(body.matchAll(/#([a-zA-Z0-9_]+)/g)).map(m => m[1].toLowerCase());
    try {
      const res = await fetch(`http://localhost:5001/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          userName: currentUser.name,
          userRole: currentUser.role,
          userInitial: currentUser.initial,
          avatarColor: currentUser.avatarColor,
          hashtags
        })
      });
      if (res.ok) {
        const newPost = await res.json();
        setPosts(prev => [newPost, ...prev]);
        setShowCreateModal(false);
        showToast("Post shared with the community 🌿");
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to create post. Please try again.");
    }
  };

  return (
    <div className="community-theme bg-[#f6f7f8] text-black min-h-screen pt-24 pb-16">
      <div className="w-full mx-0 px-0">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-6 px-6">

          {/* Left sidebar */}
          <aside className="hidden lg:block sticky top-24 self-start px-4 border-r border-black/10">
            <LeftSidebar active={filter} onSelect={handleFilterChange} />
          </aside>

          {/* Center feed */}
          <main className="space-y-4 col-span-12 lg:col-span-1">
            <SearchBar value={searchQuery} onChange={handleSearch} />
            <div className="w-full max-w-[760px] mx-auto">
              <div
                className="h-[calc(100vh-10rem)] overflow-y-scroll"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {isLoading ? (
                  <div className="flex flex-col space-y-4 items-center mt-10">
                    <div className="w-8 h-8 border-4 border-[#16a34a] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#6b7280] text-sm animate-pulse">Loading community feed...</p>
                  </div>
                ) : (
                  <Feed
                    posts={posts}
                    filter={filter}
                    searchQuery={debouncedSearchQuery}
                    hashtagFilter={hashtagFilter}
                    currentUser={currentUser}
                    onPostsChange={setPosts}
                    onToast={showToast}
                    onProfileClick={(p) => setProfileModal({
                      ...p,
                      avatar: p.avatarUrl,
                      followers: Math.floor(Math.random() * 5000),
                      posts: Math.floor(Math.random() * 200),
                      specialty: p.userRole,
                      bio: "Community Member"
                    })}
                  />
                )}
              </div>
            </div>
          </main>

          {/* Right sidebar */}
          <aside className="hidden lg:block sticky top-24 self-start px-4">
            <RightSidebar
              trending={trendingTags}
              mentors={mentors}
              activeHashtag={hashtagFilter}
              onCreate={() => setShowCreateModal(true)}
              onTrendClick={handleTrendClick}
              onFollow={(id) => setMentors(prev => prev.map(m => m.id === id ? { ...m, followed: !m.followed } : m))}
              onStar={(id) => setMentors(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m))}
              onViewProfile={setProfileModal}
            />
          </aside>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateModal
            currentUser={currentUser}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreatePost}
          />
        )}
        {profileModal && (
          <ProfileModal profile={profileModal} onClose={() => setProfileModal(null)} />
        )}
        {toast && <Toast key={toast + Date.now()} message={toast} onDone={() => setToast("")} />}
      </AnimatePresence>
    </div>
  );
}
