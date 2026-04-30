import React from "react";
import { TrendingUp, Award, Star, Plus } from "lucide-react";

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
    <aside className="hidden lg:block w-72 sticky top-20 self-start">
      <div className="space-y-4">
        {/* Trending header + Create */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-black flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-600" />
            Trending
          </div>
          <button
            onClick={onCreate}
            className="flex items-center gap-1.5 text-sm text-white bg-[#16a34a] hover:bg-[#15803d] px-3 py-1 rounded-full transition-colors"
          >
            <Plus className="w-4 h-4" /> Create
          </button>
        </div>

        {/* Trending tags */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-200">
          <ol className="space-y-1">
            {trending.map((t, i) => {
              const isActive = activeHashtag === t.title;
              return (
                <li key={i} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-gray-600 font-semibold">{i + 1}</span>
                    <button
                      onClick={() => onTrendClick(t.title)}
                      className={`truncate text-sm text-left transition-colors ${
                        isActive
                          ? "text-[#16a34a] font-semibold"
                          : "text-black hover:text-[#16a34a]"
                      }`}
                    >
                      {t.title}
                    </button>
                  </div>
                  <span className="text-[#6b7280] text-xs">{t.count}</span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Certified Profiles */}
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-gray-600" />
            <h4 className="text-black font-semibold">Certified Profiles</h4>
          </div>

          <div className="space-y-2">
            {mentors.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                  {m.avatarUrl || m.avatar ? (
                    <img src={m.avatarUrl || m.avatar} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs" style={{ background: m.avatarColor || "#2D6A4F" }}>
                      {m.name?.[0] || "?"}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h5 className="text-sm text-black truncate">{m.name}</h5>
                    <button onClick={() => onStar(m.id)} className="flex-shrink-0">
                      <Star
                        className={`w-3 h-3 transition-colors ${
                          m.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400 hover:text-yellow-400"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="text-xs text-[#6b7280]">{m.specialty}</div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <button
                    onClick={() => onFollow(m.id)}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                      m.followed
                        ? "bg-[#dcfce7] text-[#16a34a] border border-[#16a34a] hover:bg-[#bbf7d0]"
                        : "bg-[#16a34a] text-white hover:bg-[#15803d]"
                    }`}
                  >
                    {m.followed ? "Following" : "Follow"}
                  </button>
                  <button
                    onClick={() => onViewProfile(m)}
                    className="text-xs text-[#6b7280] underline hover:text-[#2D6A4F]"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
