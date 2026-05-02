import React from "react";
import { motion } from "framer-motion";
import { X, Send } from "lucide-react";

interface CreatePostProps {
  postContent: string;
  setPostContent: (content: string) => void;
  tagSuggestions: string[];
  setTagSuggestions: (tags: string[]) => void;
  SUGGESTED_TAGS: string[];
  currentUser: { name: string; initial: string; avatarColor: string };
  user: any;
  onSubmit: () => void;
  onClose: () => void;
}

export default function CreatePost({
  postContent,
  setPostContent,
  tagSuggestions,
  setTagSuggestions,
  SUGGESTED_TAGS,
  currentUser,
  user,
  onSubmit,
  onClose,
}: CreatePostProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full bg-white rounded-[32px] p-8 shadow-2xl"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-teal-600"
        >
          <X className="w-6 h-6" />
        </motion.button>

        <h3 className="text-2xl text-emerald-800 mb-6">Share Your Journey</h3>

        <div className="flex items-start gap-4 mb-6">
          <div
            className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-emerald-300 flex-shrink-0 flex items-center justify-center text-white font-bold"
            style={{ background: currentUser.avatarColor }}
          >
            {currentUser.initial}
          </div>
          <div>
            <p className="text-teal-800 font-semibold">{currentUser.name}</p>
            <p className="text-sm text-teal-600">
              {user?.role || "Wellness Seeker"}
            </p>
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
                setTagSuggestions(
                  SUGGESTED_TAGS.filter((t) => t.toLowerCase().includes(q))
                );
              } else {
                setTagSuggestions([]);
              }
            }}
            placeholder="What's on your mind? Share your wellness journey, tips, or celebrations..."
            className="w-full h-40 p-4 rounded-2xl border border-emerald-200/50 focus:border-emerald-500 focus:outline-none resize-none text-teal-800 placeholder-teal-400"
          />
          {tagSuggestions.length > 0 && (
            <div className="absolute right-0 left-0 mt-2 max-w-md mx-auto bg-white border border-emerald-200 rounded-md shadow z-20 overflow-hidden">
              {tagSuggestions.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setPostContent(postContent.replace(/#([a-zA-Z0-9_]*)$/, t + " "));
                    setTagSuggestions([]);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-emerald-50"
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-full border border-emerald-300 text-teal-800 hover:bg-emerald-50 transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSubmit}
            disabled={!postContent.trim()}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Post
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
