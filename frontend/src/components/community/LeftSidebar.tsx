import React, { useState } from "react";
import { Clock, Star, Gamepad, Menu, Flower, Sparkles } from "lucide-react";

export default function LeftSidebar({ active = "Recent", onSelect }: { active?: string; onSelect?: (key: string) => void }) {
  const [collapsed, setCollapsed] = useState(false);

  const sections = [
    { key: "Recent", icon: Clock },
    { key: "Popular", icon: Star },
    { key: "Mindfulness", icon: Flower },
    { key: "Healing", icon: Sparkles },
    { key: "Games", icon: Gamepad },
  ];

  return (
    <aside className="hidden lg:block w-56 sticky top-24 self-start">
      <div className="rounded-3xl p-4 bg-white/80 backdrop-blur-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4 px-2">
          <h4 className="text-[#0f172a] font-semibold text-sm tracking-wide uppercase text-opacity-80">Community</h4>
          <button aria-label="Toggle sidebar" onClick={() => setCollapsed((s) => !s)} className="p-2 rounded-xl hover:bg-black/5 transition-colors">
            <Menu className="w-4 h-4 text-[#64748b]" />
          </button>
        </div>

        <nav aria-label="Community navigation" className="space-y-1.5">
          {sections.map((s) => {
            const Icon = s.icon;
            const isActive = s.key === active;
            return (
              <button
                key={s.key}
                onClick={() => onSelect && onSelect(s.key)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left transition-all duration-300 focus:outline-none ${
                  isActive 
                    ? "bg-[#f0fdf4] text-[#16a34a] font-semibold shadow-[0_2px_10px_rgba(22,163,74,0.1)]" 
                    : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                <Icon className={`w-[18px] h-[18px] transition-colors duration-300 ${isActive ? "text-[#16a34a]" : "text-[#94a3b8]"}`} />
                <span className="truncate text-sm">{s.key}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
