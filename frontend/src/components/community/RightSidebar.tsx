import React from "react";
import { TrendingUp, BadgeCheck, Plus } from "lucide-react";

interface Mentor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  followers: number;
  posts: number;
  avatar?: string;
  avatarUrl?: string;
  avatarColor?: string;
  followed: boolean;
  starred: boolean;
}

interface TrendTag { title: string; count: string; }

interface Props {
  trending: TrendTag[];
  mentors: Mentor[];
  activeHashtag: string;
  onCreate: () => void;
  onTrendClick: (tag: string) => void;
  onFollow: (id: string) => void;
  onStar: (id: string) => void;
  onViewProfile: (mentor: Mentor) => void;
}

export default function RightSidebar({
  trending, mentors, activeHashtag,
  onCreate, onTrendClick, onFollow, onStar, onViewProfile,
}: Props) {
  return (
    <aside className="hidden lg:block w-72 sticky top-20 self-start space-y-4">

      {/* ── Header row ── */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-black flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#16a34a]" />
          Trending
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-1.5 text-sm text-white bg-[#16a34a] hover:bg-[#15803d] px-3 py-1.5 rounded-full transition-all hover:shadow-md active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" /> Create
        </button>
      </div>

      {/* ── Trending tags ── */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
        <ol className="space-y-0.5">
          {trending.map((t, i) => {
            const isActive = activeHashtag === t.title;
            return (
              <li key={i}>
                <button
                  onClick={() => onTrendClick(t.title)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-xl transition-all text-left group ${
                    isActive ? "bg-[#f0fdf4]" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-bold w-4 ${isActive ? "text-[#16a34a]" : "text-gray-400"}`}>
                      {i + 1}
                    </span>
                    <span className={`text-sm font-medium transition-colors ${
                      isActive ? "text-[#16a34a]" : "text-gray-800 group-hover:text-[#16a34a]"
                    }`}>
                      {t.title}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isActive
                      ? "bg-[#dcfce7] text-[#16a34a]"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {t.count}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* ── Certified Profiles ── */}
      <div>
        <div className="flex items-center gap-2 mb-2 px-1">
          <BadgeCheck className="w-4 h-4 text-[#16a34a]" />
          <h4 className="text-sm font-semibold text-black">Certified Profiles</h4>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {mentors.map((m, i) => {
            const avatarSrc = m.avatarUrl || m.avatar;
            const initials = m.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
            return (
              <div key={m.id}
                className={`flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors ${i < mentors.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-white text-xs font-bold border border-gray-200"
                  style={{ background: avatarSrc ? undefined : (m.avatarColor || "#2D6A4F") }}
                >
                  {avatarSrc
                    ? <img src={avatarSrc} alt={m.name} className="w-full h-full object-cover" />
                    : initials}
                </div>

                {/* Name + specialty */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-gray-900 truncate">{m.name}</span>
                    <BadgeCheck className="w-3 h-3 text-[#16a34a] flex-shrink-0" />
                  </div>
                  <p className="text-[11px] text-gray-400 truncate">{m.specialty}</p>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => onFollow(m.id)}
                    className={`text-[11px] px-2.5 py-1 rounded-full font-semibold transition-all active:scale-95 ${
                      m.followed
                        ? "bg-[#f0fdf4] text-[#16a34a] border border-[#86efac]"
                        : "bg-[#16a34a] text-white hover:bg-[#15803d]"
                    }`}
                  >
                    {m.followed ? "✓" : "+"}
                  </button>
                  <button
                    onClick={() => onViewProfile(m)}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-[#86efac] hover:text-[#16a34a] transition-all active:scale-95"
                  >
                    View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </aside>
  );
}
