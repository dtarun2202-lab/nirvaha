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
    <aside className="hidden lg:block w-72 sticky top-24 self-start space-y-6">

      {/* ── Header row ── */}
      <div className="flex items-center justify-between px-1">
        <div className="text-sm font-semibold text-[#0f172a] uppercase tracking-wide text-opacity-80 flex items-center gap-2">
          <TrendingUp className="w-[18px] h-[18px] text-[#16a34a]" />
          Trending
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-1.5 text-sm font-medium text-white bg-[#16a34a] hover:bg-[#15803d] px-4 py-2 rounded-full transition-all duration-300 hover:shadow-[0_4px_14px_rgba(22,163,74,0.3)] active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create
        </button>
      </div>

      {/* ── Trending tags ── */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <ol className="space-y-1">
          {trending.map((t, i) => {
            const isActive = activeHashtag === t.title;
            return (
              <li key={i}>
                <button
                  onClick={() => onTrendClick(t.title)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl transition-all duration-300 text-left group ${
                    isActive ? "bg-[#f0fdf4] shadow-[0_2px_10px_rgba(22,163,74,0.1)]" : "hover:bg-[#f8fafc]"
                   }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold w-4 ${isActive ? "text-[#16a34a]" : "text-[#94a3b8]"}`}>
                      {i + 1}
                    </span>
                    <span className={`text-sm font-medium transition-colors ${
                      isActive ? "text-[#16a34a]" : "text-[#1e293b] group-hover:text-[#16a34a]"
                    }`}>
                      {t.title}
                    </span>
                  </div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                    isActive
                      ? "bg-[#dcfce7] text-[#15803d]"
                      : "bg-[#f1f5f9] text-[#64748b]"
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
        <div className="flex items-center gap-2 mb-3 px-1">
          <BadgeCheck className="w-[18px] h-[18px] text-[#16a34a]" />
          <h4 className="text-sm font-semibold text-[#0f172a] uppercase tracking-wide text-opacity-80">Mentors</h4>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden divide-y divide-gray-50/50">
          {mentors.map((m) => {
            const avatarSrc = m.avatarUrl || m.avatar;
            return (
              <div key={m.id} className="p-4 hover:bg-[#f8fafc] transition-colors duration-300 group">
                <div className="flex items-start gap-3.5">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-[14px] overflow-hidden border border-emerald-50 bg-emerald-50/50 flex items-center justify-center shadow-sm">
                      {avatarSrc ? (
                        <img src={avatarSrc} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[#15803d] font-bold text-sm">
                          {(m.name || "M").charAt(0)}
                        </span>
                      )}
                    </div>
                    {m.verified && (
                      <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full p-0.5 shadow-sm">
                        <BadgeCheck className="w-[14px] h-[14px] text-[#16a34a] fill-emerald-50" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="text-[13px] font-bold text-[#0f172a] truncate">{m.name}</h5>
                      <span className="text-[10px] font-medium text-[#15803d] bg-[#f0fdf4] px-1.5 py-0.5 rounded-md whitespace-nowrap">
                        {m.experience}
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold text-[#16a34a] mt-0.5 uppercase tracking-wide">
                      {m.role}
                    </p>
                    <p className="text-[11px] text-[#64748b] mt-1 truncate">
                      {m.specialty}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-3.5 flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onFollow(m.id)}
                    className={`flex-1 text-[11px] font-bold py-2 rounded-xl transition-all duration-300 ${
                      m.followed
                        ? "bg-[#f1f5f9] text-[#64748b]"
                        : "bg-[#f0fdf4] text-[#16a34a] hover:bg-[#dcfce7] hover:shadow-[0_2px_8px_rgba(22,163,74,0.1)]"
                    }`}
                  >
                    {m.followed ? "Following" : "Follow"}
                  </button>
                  <button
                    onClick={() => onViewProfile(m)}
                    className="px-3 py-2 text-[11px] font-bold text-[#475569] border border-gray-100 rounded-xl hover:bg-white hover:shadow-sm hover:border-gray-200 transition-all duration-300"
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
