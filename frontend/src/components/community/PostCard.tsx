import React, { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal, Award, Bookmark, Flag, Link } from "lucide-react";
import type { Post, Comment } from "./communityData";

interface PostCardProps {
  post: Post;
  currentUser: { name: string; initial: string; avatarColor: string };
  onLike: () => void;
  onComment: (text: string) => void;
  onProfileClick: (post: Post) => void;
  onToast: (msg: string) => void;
}

function formatTime(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function PostCard({ post, currentUser, onLike, onComment, onProfileClick, onToast }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!showMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  const handleLike = () => {
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 200);
    onLike();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    onToast("Link copied to clipboard 🙏");
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    onComment(commentText.trim());
    setCommentText("");
  };

  const handleSave = () => {
    setShowMenu(false);
    onToast("Post saved! 🌿");
  };

  const handleCopyLink = () => {
    setShowMenu(false);
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    onToast("Link copied to clipboard 🙏");
  };

  const handleReport = () => {
    setShowMenu(false);
    onToast("Thank you for keeping Nirvaha safe 🙏");
  };

  const totalComments = post.comments.length;

  return (
    <article className="bg-white rounded-lg p-3 border border-[#e2e8f0] hover:shadow-md hover:border-[#52B788]/40 transition-all">
      <header className="flex items-start gap-3 mb-1">
        {/* Avatar */}
        <button onClick={() => onProfileClick(post)} className="relative flex-shrink-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm border-2 border-white shadow-sm overflow-hidden"
            style={{ background: post.avatarColor }}
          >
            {post.avatarUrl
              ? <img src={post.avatarUrl} alt={post.userName} className="w-full h-full object-cover" />
              : post.userInitial}
          </div>
          {post.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#52B788] rounded-full border-2 border-white" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-[#0f172a] leading-snug line-clamp-1">{post.title}</h3>
              <p className="text-xs text-[#6b7280] mt-0.5">
                {post.userName} · {post.userRole} · {formatTime(post.timestampValue)}
              </p>
            </div>
            {/* ··· menu */}
            <div className="relative flex-shrink-0" ref={menuRef}>
              <button
                onClick={() => setShowMenu(v => !v)}
                className="p-1 rounded hover:bg-black/5 text-[#6b7280]"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-7 z-30 bg-white border border-[#e2e8f0] rounded-xl shadow-lg w-40 py-1 text-sm text-[#1e293b]">
                  <button onClick={handleSave} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#f0fdf4]">
                    <Bookmark className="w-3.5 h-3.5 text-[#2D6A4F]" /> Save Post
                  </button>
                  <button onClick={handleCopyLink} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#f0fdf4]">
                    <Link className="w-3.5 h-3.5 text-[#2D6A4F]" /> Copy Link
                  </button>
                  <button onClick={handleReport} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-500">
                    <Flag className="w-3.5 h-3.5" /> Report
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Body */}
          <p className="text-sm text-[#1e293b] mt-2 line-clamp-2 leading-relaxed">{post.body}</p>

          {/* Action bar */}
          <footer className="mt-2 flex items-center gap-1 text-[#6b7280]">
            {/* Like */}
            <button
              onClick={handleLike}
              style={{ transform: likeAnim ? "scale(1.2)" : "scale(1)", transition: "transform 200ms ease" }}
              className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors ${post.liked ? "text-[#52B788]" : "hover:bg-black/5"}`}
            >
              <Heart className={`w-4 h-4 ${post.liked ? "fill-[#52B788] text-[#52B788]" : ""}`} />
              <span className="text-xs">{post.likes}</span>
            </button>

            {/* Comment */}
            <button
              onClick={() => setShowComments(v => !v)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors ${showComments ? "text-[#2D6A4F]" : "hover:bg-black/5"}`}
            >
              <MessageCircle className={`w-4 h-4 ${showComments ? "text-[#2D6A4F]" : ""}`} />
              <span className="text-xs">{totalComments}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-2 py-1 rounded-full hover:bg-black/5 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-xs">Share</span>
            </button>
          </footer>

          {/* Inline comment section */}
          {showComments && (
            <div className="mt-3 border-t border-[#e2e8f0] pt-3 space-y-2">
              {post.comments.map((c: Comment) => (
                <div key={c.id} className="flex items-start gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                    style={{ background: c.avatarColor }}
                  >
                    {c.userInitial}
                  </div>
                  <div className="bg-[#f6f7f8] rounded-xl px-3 py-2 flex-1">
                    <span className="text-xs font-semibold text-[#0f172a]">{c.userName}</span>
                    <span className="text-xs text-[#6b7280] ml-1">{formatTime(c.createdAt)}</span>
                    <p className="text-sm text-[#1e293b] mt-0.5">{c.text}</p>
                  </div>
                </div>
              ))}

              {/* New comment input */}
              <div className="flex items-center gap-2 mt-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                  style={{ background: currentUser.avatarColor }}
                >
                  {currentUser.initial}
                </div>
                <input
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleComment()}
                  placeholder="Write a comment..."
                  className="flex-1 text-sm border border-[#e2e8f0] rounded-full px-3 py-1.5 outline-none focus:border-[#52B788] text-[#1e293b] placeholder-[#9ca3af]"
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className="px-3 py-1.5 bg-[#2D6A4F] text-white text-xs rounded-full disabled:opacity-40 hover:bg-[#1B4332] transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </article>
  );
}
