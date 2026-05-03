import React from "react";
import { TrendingUp, BadgeCheck, Plus } from "lucide-react";

interface Mentor {
  id: string;
  name: string;
  role?: string;
  specialty: string;
  experience?: string;
  verified?: boolean;
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

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
          {mentors.map((m) => {
            const avatarSrc = m.avatarUrl || m.avatar;
            return (
              <div key={m.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-emerald-100 bg-emerald-50 flex items-center justify-center">
                      {avatarSrc ? (
                        <img src={avatarSrc} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-emerald-700 font-bold text-sm">
                          {m.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    {m.verified && (
                      <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                        <BadgeCheck className="w-3.5 h-3.5 text-[#16a34a] fill-emerald-50" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="text-xs font-bold text-gray-900 truncate">{m.name}</h5>
                      <span className="text-[10px] font-medium text-[#16a34a] bg-emerald-50 px-1.5 py-0.5 rounded">
                        {m.experience}
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold text-emerald-700 mt-0.5 uppercase tracking-wider">
                      {m.role}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5 italic truncate">
                      {m.specialty}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => onFollow(m.id)}
                    className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg transition-all ${
                      m.followed
                        ? "bg-gray-100 text-gray-500"
                        : "bg-[#16a34a] text-white hover:shadow-md hover:bg-[#15803d]"
                    }`}
                  >
                    {m.followed ? "Following" : "Follow"}
                  </button>
                  <button
                    onClick={() => onViewProfile(m)}
                    className="px-3 py-1.5 text-[11px] font-bold text-gray-600 border border-gray-100 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Profile
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
