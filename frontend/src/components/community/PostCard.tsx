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
  if (m < 1) return "Just now";
  if (m < 60) return `${m} min${m === 1 ? '' : 's'} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? '' : 's'} ago`;
}

export default function PostCard({ post, currentUser, onLike, onComment, onProfileClick, onToast }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [timeLabel, setTimeLabel] = useState(() => formatTime(post.timestampValue));
  const menuRef = useRef<HTMLDivElement>(null);

  // Auto-update timestamp every 30 seconds
  useEffect(() => {
    setTimeLabel(formatTime(post.timestampValue));
    const interval = setInterval(() => {
      setTimeLabel(formatTime(post.timestampValue));
    }, 30000);
    return () => clearInterval(interval);
  }, [post.timestampValue]);

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
    <article className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(22,163,74,0.08)] hover:border-emerald-100/50 transition-all duration-300">
      <header className="flex items-start gap-4 mb-1">
        {/* Avatar */}
        <button onClick={() => onProfileClick(post)} className="relative flex-shrink-0 group">
          <div
            className="w-12 h-12 rounded-[16px] flex items-center justify-center text-white font-bold text-lg shadow-sm overflow-hidden group-hover:shadow-md transition-shadow"
            style={{ background: post.avatarColor }}
          >
            {post.avatarUrl
              ? <img src={post.avatarUrl} alt={post.userName} className="w-full h-full object-cover" />
              : post.userInitial}
          </div>
          {post.isOnline && (
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#16a34a] rounded-full border-2 border-white" />
          )}
        </button>

        <div className="flex-1 min-w-0 pt-0.5">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-[15px] font-bold text-[#0f172a] leading-tight line-clamp-1">{post.title}</h3>
              <p className="text-[13px] text-[#64748b] mt-1 font-medium flex items-center flex-wrap gap-x-1.5 gap-y-0.5">
                <span className="text-[#15803d]">{post.userName}</span> 
                <span className="opacity-40 text-[10px]">•</span> 
                <span>{post.userRole}</span> 
                <span className="opacity-40 text-[10px]">•</span> 
                <span>{timeLabel}</span>
              </p>
            </div>
            {/* ··· menu */}
            <div className="relative flex-shrink-0" ref={menuRef}>
              <button
                onClick={() => setShowMenu(v => !v)}
                className="p-1.5 rounded-xl hover:bg-[#f8fafc] text-[#94a3b8] hover:text-[#0f172a] transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-9 z-30 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-44 py-1.5 text-[13px] font-medium text-[#1e293b] overflow-hidden">
                  <button onClick={handleSave} className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#f0fdf4] transition-colors">
                    <Bookmark className="w-4 h-4 text-[#16a34a]" /> Save Post
                  </button>
                  <button onClick={handleCopyLink} className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#f0fdf4] transition-colors">
                    <Link className="w-4 h-4 text-[#16a34a]" /> Copy Link
                  </button>
                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                  <button onClick={handleReport} className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors">
                    <Flag className="w-4 h-4" /> Report
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Body */}
          <p className="text-[14px] text-[#334155] mt-3 line-clamp-3 leading-[1.6] whitespace-pre-wrap">
            {post.body}
          </p>

          {/* Action bar */}
          <footer className="mt-4 flex items-center gap-2 text-[#64748b]">
            {/* Like */}
            <button
              onClick={handleLike}
              style={{ transform: likeAnim ? "scale(1.15)" : "scale(1)", transition: "transform 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${post.liked ? "bg-[#f0fdf4] text-[#16a34a]" : "hover:bg-[#f8fafc] hover:text-[#0f172a]"}`}
            >
              <Heart className={`w-[18px] h-[18px] ${post.liked ? "fill-[#16a34a] text-[#16a34a]" : ""}`} />
              <span className="text-[13px] font-bold">{post.likes}</span>
            </button>

            {/* Comment */}
            <button
              onClick={() => setShowComments(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${showComments ? "bg-[#f8fafc] text-[#0f172a]" : "hover:bg-[#f8fafc] hover:text-[#0f172a]"}`}
            >
              <MessageCircle className={`w-[18px] h-[18px] ${showComments ? "text-[#0f172a] fill-[#0f172a]/5" : ""}`} />
              <span className="text-[13px] font-bold">{totalComments}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-[#f8fafc] hover:text-[#0f172a] transition-all duration-300"
            >
              <Share2 className="w-[18px] h-[18px]" />
              <span className="text-[13px] font-bold">Share</span>
            </button>
          </footer>

          {/* Inline comment section */}
          {showComments && (
            <div className="mt-4 border-t border-gray-100 pt-4 space-y-3">
              {post.comments.map((c: Comment) => (
                <div key={c.id} className="flex items-start gap-2.5">
                  <div
                    className="w-8 h-8 rounded-[10px] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm"
                    style={{ background: c.avatarColor }}
                  >
                    {c.userInitial}
                  </div>
                  <div className="bg-[#f8fafc] rounded-2xl rounded-tl-sm px-4 py-2.5 flex-1 shadow-sm border border-gray-50">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-[#0f172a]">{c.userName}</span>
                      <span className="text-[11px] font-medium text-[#94a3b8]">{formatTime(c.createdAt)}</span>
                    </div>
                    <p className="text-[13px] text-[#334155] mt-1 leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}

              {/* New comment input */}
              <div className="flex items-center gap-3 mt-4 pt-1">
                <div
                  className="w-8 h-8 rounded-[10px] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm"
                  style={{ background: currentUser.avatarColor }}
                >
                  {currentUser.initial}
                </div>
                <div className="flex-1 relative">
                  <input
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleComment()}
                    placeholder="Add a mindful thought..."
                    className="w-full text-[13px] font-medium bg-[#f8fafc] border border-gray-200 rounded-full pl-4 pr-20 py-2.5 outline-none focus:bg-white focus:border-[#16a34a] focus:ring-4 focus:ring-[#16a34a]/10 text-[#0f172a] placeholder-[#94a3b8] transition-all duration-300"
                  />
                  <button
                    onClick={handleComment}
                    disabled={!commentText.trim()}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#16a34a] text-white text-[12px] font-bold rounded-full disabled:opacity-50 disabled:bg-[#94a3b8] hover:bg-[#15803d] transition-colors shadow-sm"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </article>
  );
}
