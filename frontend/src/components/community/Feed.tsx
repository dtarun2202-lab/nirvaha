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
  currentUserId: string;
  onPostsChange: (posts: Post[] | ((prev: Post[]) => Post[])) => void;
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
  currentUserId,
  onPostsChange,
  onToast,
  onProfileClick,
}: FeedProps) {

  const handleLike = useCallback(async (id: string) => {
    // Use functional updater to always operate on the latest posts state,
    // avoiding stale closure issues when socket events fire concurrently.
    let previousPosts: Post[] = [];

    onPostsChange(prev => {
      previousPosts = prev;
      const post = prev.find(p => p.id === id);
      if (!post) return prev;

      const likedBy = post.likedBy ?? [];
      const alreadyLiked = likedBy.includes(currentUserId);
      const newLikedBy = alreadyLiked
        ? likedBy.filter(uid => uid !== currentUserId)
        : [...likedBy, currentUserId];

      return prev.map(p =>
        p.id === id
          ? { ...p, likedBy: newLikedBy, likes: newLikedBy.length, liked: newLikedBy.includes(currentUserId) }
          : p
      );
    });

    try {
      await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/posts/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });
    } catch (e) {
      console.error(e);
      onToast("Failed to update like");
      // Revert to the snapshot captured before the optimistic update
      if (previousPosts.length > 0) onPostsChange(() => previousPosts);
    }
  }, [currentUserId, onPostsChange, onToast]);

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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white/40 backdrop-blur-xl rounded-[32px] border border-white/50 shadow-[0_8px_32px_rgba(31,38,135,0.03)]"
          >
            <h3 className="text-xl font-black text-[#0f172a] mb-2 tracking-tight">No posts yet</h3>
            <p className="text-[14px] text-[#64748b] max-w-[280px] leading-relaxed font-medium">
              Be the first to share something 🌱
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
