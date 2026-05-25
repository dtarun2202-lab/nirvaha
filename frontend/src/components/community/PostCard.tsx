import React, { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal, Award, Bookmark, Flag, Link } from "lucide-react";
import type { Post, Comment } from "./communityData";
import BACKEND_CONFIG from "../../config/backend";

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

  const handleShare = async () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    onToast("Link copied to clipboard 🙏");
    try {
      await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/posts/${post.id}/share`, {
        method: "POST"
      });
    } catch (e) {
      console.error("Failed to share", e);
    }
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

  const [isExpanded, setIsExpanded] = useState(false);
  const cleanTitle = (post.title || "").trim();
  const cleanBody = (post.body || "").trim();
  
  const norm = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normTitle = norm(cleanTitle);
  const normBodyPrefix = norm(cleanBody.slice(0, Math.max(cleanTitle.length + 10, 100)));
  const isTitleSimilarToBody = 
    normTitle.length > 0 && 
    (normBodyPrefix.includes(normTitle) || normTitle.includes(normBodyPrefix.slice(0, normTitle.length)));

  const needsTruncation = cleanBody.length > 180;
  const displayBody = isExpanded ? cleanBody : (needsTruncation ? `${cleanBody.slice(0, 160)}...` : cleanBody);
  const totalComments = post.comments.length;

  return (
    <article className="bg-white/40 border border-white/50 backdrop-blur-xl rounded-[32px] p-5 shadow-[0_8px_32px_rgba(31,38,135,0.02)] hover:shadow-[0_8px_32px_rgba(22,163,74,0.08)] hover:border-emerald-100/60 transition-all duration-500 hover:translate-y-[-2px] relative overflow-hidden group">
      <header className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <button onClick={() => onProfileClick(post)} className="relative flex-shrink-0 group">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden group-hover:shadow-md transition-shadow"
              style={{ background: post.avatarColor }}
            >
              {post.avatarUrl
                ? <img src={post.avatarUrl} alt={post.userName} className="w-full h-full object-cover" />
                : post.userInitial}
            </div>
            {post.isOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#16a34a] rounded-full border-2 border-white" />
            )}
          </button>

          {/* Name & Role & Time */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span 
                onClick={() => onProfileClick(post)} 
                className="text-[14px] font-extrabold text-[#0f172a] hover:text-[#16a34a] transition-colors cursor-pointer"
              >
                {post.userName}
              </span>
              {post.isCertified && (
                <Award className="w-3.5 h-3.5 text-[#16a34a] fill-[#16a34a]/10" title="Certified Wellness Guide" />
              )}
              <span className="text-[10px] font-bold text-[#15803d] bg-[#f0fdf4] border border-[#dcfce7] rounded-full px-1.5 py-0.5">
                {post.userRole}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-semibold mt-0.5">{timeLabel}</p>
          </div>
        </div>

        {/* Action / Menu Trigger */}
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={() => setShowMenu(v => !v)}
            className="p-1.5 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-7 z-30 bg-white border border-gray-100 rounded-xl shadow-lg w-36 py-1 text-[11px] font-bold text-gray-700 overflow-hidden">
              <button onClick={handleSave} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#f0fdf4] transition-colors">
                <Bookmark className="w-3.5 h-3.5 text-[#16a34a]" /> Save Post
              </button>
              <button onClick={handleCopyLink} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#f0fdf4] transition-colors">
                <Link className="w-3.5 h-3.5 text-[#16a34a]" /> Copy Link
              </button>
              <div className="h-px bg-gray-100 my-0.5"></div>
              <button onClick={handleReport} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 transition-colors">
                <Flag className="w-3.5 h-3.5" /> Report
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Content Area */}
      <div className="pl-[52px] -mt-1">
        {!isTitleSimilarToBody && cleanTitle && (
          <h4 className="text-[14.5px] font-extrabold text-[#0f172a] leading-snug tracking-tight mb-1">{cleanTitle}</h4>
        )}
        <p className="text-[14px] text-[#334155] leading-relaxed whitespace-pre-wrap">
          {displayBody}
          {needsTruncation && (
            <button
              onClick={() => setIsExpanded(v => !v)}
              className="text-[12px] font-bold text-[#16a34a] hover:text-[#15803d] transition-colors ml-1 focus:outline-none"
            >
              {isExpanded ? "Show Less" : "Read More"}
            </button>
          )}
        </p>

        {/* Action bar */}
        <footer className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-gray-500 text-[13px] font-bold">
          <div className="flex items-center gap-3">
            {/* Like */}
            <button
              onClick={handleLike}
              style={{ transform: likeAnim ? "scale(1.15)" : "scale(1)", transition: "transform 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-300 ${post.liked ? "bg-[#f0fdf4] text-[#16a34a]" : "hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <Heart className={`w-4 h-4 ${post.liked ? "fill-[#16a34a] text-[#16a34a]" : ""}`} />
              <span>{post.likes}</span>
            </button>

            {/* Comment */}
            <button
              onClick={() => setShowComments(v => !v)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-300 ${showComments ? "bg-gray-50 text-gray-900" : "hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <MessageCircle className={`w-4 h-4 ${showComments ? "text-gray-900 fill-gray-900/5" : ""}`} />
              <span>{totalComments}</span>
            </button>
          </div>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-300 text-gray-400 group/share"
          >
            <Share2 className="w-4 h-4 group-hover/share:scale-110 group-hover/share:text-emerald-600 transition-transform" />
            <span>{post.shares || 0}</span>
          </button>
        </footer>

        {/* Inline comment section */}
        {showComments && (
          <div className="mt-3 border-t border-gray-100 pt-3 space-y-2.5">
            {post.comments.map((c: Comment) => (
              <div key={c.id} className="flex items-start gap-2">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-sm"
                  style={{ background: c.avatarColor }}
                >
                  {c.userInitial}
                </div>
                <div className="bg-[#f8fafc] rounded-xl rounded-tl-sm px-3 py-1.5 flex-1 shadow-sm border border-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-extrabold text-[#0f172a]">{c.userName}</span>
                    <span className="text-[10px] font-semibold text-gray-400">{formatTime(c.createdAt)}</span>
                  </div>
                  <p className="text-[13px] text-[#334155] mt-0.5 leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))}

            {/* New comment input */}
            <div className="flex items-center gap-2.5 mt-3 pt-1">
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-sm"
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
                  className="w-full text-[13px] font-medium bg-[#f8fafc] border border-gray-200 rounded-full pl-3.5 pr-16 py-2 outline-none focus:bg-white focus:border-[#16a34a] focus:ring-4 focus:ring-[#16a34a]/5 text-[#0f172a] placeholder-[#94a3b8] transition-all duration-300"
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#16a34a] text-white text-[11px] font-bold rounded-full disabled:opacity-50 disabled:bg-[#94a3b8] hover:bg-[#15803d] transition-colors shadow-sm"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
