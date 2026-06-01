import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="mb-4 relative w-full">
      <label className="sr-only">Search posts, tags, or people</label>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="w-4 h-4 text-gray-500" />
      </div>
      <input
        aria-label="Search posts, tags, or people"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search posts, tags, or people"
        className="community-search-glow w-full rounded-full pl-10 pr-10 py-3 border border-gray-200 bg-white text-black placeholder-black/40 focus:outline-none"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <style>{`
        @keyframes search-glow-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(22,163,74,0), 0 0 8px 2px rgba(22,163,74,0.10); border-color: #d1fae5; }
          50%       { box-shadow: 0 0 0 4px rgba(22,163,74,0.10), 0 0 18px 6px rgba(22,163,74,0.18); border-color: #6ee7b7; }
        }
        .community-search-glow {
          animation: search-glow-pulse 2.8s ease-in-out infinite;
          transition: box-shadow 0.3s, border-color 0.3s;
        }
        .community-search-glow:focus {
          animation: none;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.25), 0 0 20px 6px rgba(22,163,74,0.15);
          border-color: #16a34a;
        }
      `}</style>
    </div>
  );
}
