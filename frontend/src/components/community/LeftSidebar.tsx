import React, { useState } from "react";
import { Home, Clock, Star, Grid, Gamepad, Menu } from "lucide-react";

export default function LeftSidebar({ active = "Recent", onSelect }: { active?: string; onSelect?: (key: string) => void }) {
  const [collapsed, setCollapsed] = useState(false);

  const sections = [
    { key: "Recent", icon: Home },
    { key: "Popular", icon: Star },
    { key: "All", icon: Grid },
    { key: "Games", icon: Gamepad },
  ];

  return (
    <aside className="hidden lg:block w-48 sticky top-20 self-start">
      <div className="rounded-2xl p-2">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[#0f172a] font-semibold">Feed</h4>
          <button aria-label="Toggle sidebar" onClick={() => setCollapsed((s) => !s)} className="p-2 rounded hover:bg-black/5">
            <Menu className="w-4 h-4 text-[#374151]" />
          </button>
        </div>

        <div className="p-1">
          <nav aria-label="Community navigation" className="space-y-1">
            {sections.map((s) => {
              const Icon = s.icon;
              const isActive = s.key === active;
              return (
                <button
                  key={s.key}
                  onClick={() => onSelect && onSelect(s.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors focus:outline-none ${
                    isActive ? "bg-gray-100 text-[#0f172a] font-semibold" : "text-[#1e293b] hover:bg-black/5"
                  }`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-[#0f172a]" : "text-[#374151]"}`} />
                  <span className="truncate text-sm">{s.key}</span>
                </button>
              );
            })}
          </nav>


        </div>
      </div>
    </aside>
  );
}
