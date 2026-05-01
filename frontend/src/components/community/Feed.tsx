import React, { useState, useEffect, useCallback } from "react";
import PostCard from "./PostCard";
import type { Post, Comment } from "./communityData";
import { motion, AnimatePresence } from "framer-motion";
import MemoryMatch from "./MemoryMatch";

interface FeedProps {
  posts: Post[];
  filter: string;
  searchQuery: string;
  hashtagFilter: string;
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
      await fetch(`http://localhost:5001/api/posts/${id}/like`, {
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
      await fetch(`http://localhost:5001/api/posts/${id}/comment`, {
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

  // Hashtag filter (from right sidebar trending click)
  if (hashtagFilter) {
    const tag = hashtagFilter.replace("#", "").toLowerCase();
    visible = visible.filter(p =>
      p.hashtags.some(h => h.toLowerCase() === tag) ||
      p.body.toLowerCase().includes(tag) ||
      p.title.toLowerCase().includes(tag)
    );
  }

  // NOTE: Search query and Popular sorting are now completely handled by the backend API.

  // ── Header label ─────────────────────────────────────────
  let headerLabel = "Latest Posts";
  let headerRight = `${visible.length} posts`;

  if (filter === "Games") {
    return <MemoryMatch currentUser={currentUser} />;
  }

  if (hashtagFilter) {
    headerLabel = `Posts tagged ${hashtagFilter}`;
    headerRight = `${visible.length} post${visible.length !== 1 ? "s" : ""}`;
  } else if (searchQuery.trim()) {
    headerLabel = `Results for "${searchQuery.trim()}"`;
    headerRight = `${visible.length} found`;
  } else if (filter === "Popular") {
    headerLabel = "Most Popular";
    headerRight = "Top liked";
  } else if (filter === "All") {
    headerLabel = "All Posts";
    headerRight = `${visible.length} total`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#0f172a]">{headerLabel}</h3>
        <span className="text-xs text-[#6b7280]">{headerRight}</span>
      </div>

      <div className="space-y-4">
        {visible.length === 0 && (
          <div className="text-center py-12 text-[#6b7280]">
            {filter === "Popular"
              ? <><p className="text-base font-medium text-[#0f172a]">No popular posts yet 🌱</p><p className="text-sm mt-1">Posts with 50+ likes will appear here.</p></>
              : searchQuery.trim()
              ? <><p className="text-base font-medium text-[#0f172a]">No posts found for "{searchQuery.trim()}" 🙏</p><p className="text-sm mt-1">Try a different keyword or browse all posts.</p></>
              : <p className="text-sm">No posts here yet.</p>
            }
          </div>
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
