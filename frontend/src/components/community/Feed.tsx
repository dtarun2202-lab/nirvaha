import React, { useState, useEffect, useCallback } from "react";
import BACKEND_CONFIG from "../../config/backend";
import PostCard from "./PostCard";
import type { Post, Comment } from "./communityData";
import { motion, AnimatePresence } from "framer-motion";
import MemoryMatch from "./MemoryMatch";

interface FeedProps {
  posts: Post[];
  filter: string;
  searchQuery: string;
  hashtagFilter: string;
  hashtagTotal?: number | null;
  currentUser: { name: string; initial: string; avatarColor: string };
  onPostsChange: (posts: Post[]) => void;
  onToast: (msg: string) => void;
  onProfileClick: (post: Post) => void;
}

export default function Feed({
  posts,
  filter,
  searchQuery,
  hashtagFilter,
  hashtagTotal,
  currentUser,
  onPostsChange,
  onToast,
  onProfileClick,
}: FeedProps) {

  const handleLike = useCallback(async (id: string) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    const isLiking = !post.liked;

    // Optimistic update
    onPostsChange(posts.map(p =>
      p.id === id
        ? { ...p, liked: isLiking, likes: isLiking ? p.likes + 1 : p.likes - 1 }
        : p
    ));

    try {
      await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/posts/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: isLiking })
      });
    } catch (e) {
      console.error(e);
      onToast("Failed to update like");
    }
  }, [posts, onPostsChange, onToast]);

  const handleComment = useCallback(async (id: string, text: string) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      userId: "current",
      userName: currentUser.name,
      userInitial: currentUser.initial,
      avatarColor: currentUser.avatarColor,
      text,
      createdAt: Date.now(),
    };
    
    // Optimistic update
    onPostsChange(posts.map(p =>
      p.id === id ? { ...p, comments: [...p.comments, newComment] } : p
    ));

    try {
      await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/posts/${id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "current",
          userName: currentUser.name,
          userInitial: currentUser.initial,
          avatarColor: currentUser.avatarColor,
          text
        })
      });
    } catch (e) {
      console.error(e);
      onToast("Failed to add comment");
    }
  }, [posts, onPostsChange, currentUser, onToast]);

  // ── Apply filters ────────────────────────────────────────
  let visible = [...posts];

  // NOTE: Hashtag filtering, search, and sorting are all handled by the backend API.
  // Feed just renders whatever posts are passed in.

  if (filter === "Games") {
    return <MemoryMatch currentUser={currentUser} />;
  }

  // ── Header label ─────────────────────────────────────────
  let headerLabel = "Latest Moments";
  let headerRight = `${visible.length} posts`;

  if (hashtagFilter) {
    headerLabel = `Tagged ${hashtagFilter}`;
    const count = hashtagTotal ?? visible.length;
    headerRight = `${count} post${count !== 1 ? "s" : ""}`;
  } else if (searchQuery.trim()) {
    headerLabel = `Results for "${searchQuery.trim()}"`;
    headerRight = `${visible.length} found`;
  } else if (filter === "Popular") {
    headerLabel = "Most Popular";
    headerRight = "Top liked";
  } else if (filter === "Mindfulness") {
    headerLabel = "Mindfulness Space";
    headerRight = `${visible.length} moments`;
  } else if (filter === "Healing") {
    headerLabel = "Healing Space";
    headerRight = `${visible.length} moments`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wide opacity-80">{headerLabel}</h3>
        <span className="text-[13px] font-medium text-[#64748b] bg-white/60 px-3 py-1 rounded-full">{headerRight}</span>
      </div>

      <div className="space-y-5">
        {visible.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100 border-dashed"
          >
            <div className="w-20 h-20 mb-5 rounded-full bg-emerald-50 flex items-center justify-center shadow-sm">
              <svg className="w-10 h-10 text-[#16a34a] opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-[17px] font-bold text-[#0f172a] mb-2">No active wellness moments</h3>
            <p className="text-[14px] text-[#64748b] max-w-[280px] leading-relaxed">
              {filter === "Popular" ? "There are no highly liked posts right now." : 
               filter === "Mindfulness" ? "No mindfulness posts right now. Take a deep breath and share your practice 🌿" :
               filter === "Healing" ? "No healing posts right now. Take small steps and share your journey 💚" :
               searchQuery.trim() ? `We couldn't find any moments for "${searchQuery.trim()}".` :
               hashtagFilter ? `No active posts tagged with ${hashtagFilter} today.` :
               "The community is quiet right now. Be the first to share today's journey."}
            </p>
          </motion.div>
        )}
        <AnimatePresence mode="popLayout">
          {visible.map(post => (
            <motion.div
              key={(post as any)._id || post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <PostCard
                post={post}
                currentUser={currentUser}
                onLike={() => handleLike(post.id)}
                onComment={(text) => handleComment(post.id, text)}
                onProfileClick={onProfileClick}
                onToast={onToast}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
