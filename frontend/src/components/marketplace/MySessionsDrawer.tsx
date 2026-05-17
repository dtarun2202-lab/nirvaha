import { motion, AnimatePresence } from "motion/react";
import { X, CalendarRange, CheckCircle, XCircle, BookOpen, Clock, Users } from "lucide-react";
import { useState } from "react";
import type { SessionRegistration } from "./SessionRegistrationModal";

interface MySessionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: SessionRegistration[];
}

const TABS = ["All", "Pending", "Approved", "Completed"] as const;
type Tab = (typeof TABS)[number];

export function MySessionsDrawer({ isOpen, onClose, registrations }: MySessionsDrawerProps) {
  const [activeTab, setActiveTab] = useState<Tab>("All");

  const isProduct = registrations.some(r => r.type === "product");
  const isRetreat = registrations.some(r => r.type === "retreat");
  const drawerTitle = isProduct ? "My Orders" : isRetreat ? "My Bookings" : "My Sessions";

  const getStatusConfig = (status: string, type?: string) => {
    if (type === "product") {
      switch(status) {
        case "pending":
          return { label: "Processing", pill: "bg-[#fffbeb] text-[#92400e] border-[#fde68a]" };
        case "upcoming":
        case "approved":
          return { label: "Shipped", pill: "bg-blue-50 text-blue-700 border-blue-200" };
        case "completed":
          return { label: "Delivered", pill: "bg-[#e7f5ef] text-[#065f46] border-[#34d399]/40" };
        case "cancelled":
        case "rejected":
          return { label: "Cancelled", pill: "bg-rose-50 text-rose-700 border-rose-200" };
        default:
          return { label: "Processing", pill: "bg-[#fffbeb] text-[#92400e] border-[#fde68a]" };
      }
    }

    // Default Sessions & Retreats
    switch(status) {
      case "pending":
        return { label: "Under Review", pill: "bg-[#fffbeb] text-[#92400e] border-[#fde68a]" };
      case "approved":
      case "upcoming":
        return { label: "Spot Confirmed", pill: "bg-[#d6eee9] text-[#0a2e1f] border-[#b8d8d1]" };
      case "rejected":
      case "cancelled":
        return { label: "Not Available", pill: "bg-rose-50 text-rose-700 border-rose-200" };
      case "completed":
        return { label: "Session Finished", pill: "bg-[#e7f5ef] text-[#065f46] border-[#34d399]/40" };
      default:
        return { label: "Under Review", pill: "bg-[#fffbeb] text-[#92400e] border-[#fde68a]" };
    }
  };

  const filtered = registrations.filter((r) => {
    if (activeTab === "All") return true;
    if (activeTab === "Pending") return r.status === "pending";
    if (activeTab === "Approved") return r.status === "approved" || r.status === "upcoming";
    if (activeTab === "Completed") return r.status === "completed";
    return true;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[250] bg-[#0a1f14]/10 backdrop-blur-md"
          />
          <motion.div
            initial={{ x: "100%", opacity: 0.9 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.9 }}
            transition={{ type: "spring", damping: 32, stiffness: 350 }}
            className="fixed right-0 top-0 bottom-0 z-[260] w-full max-w-md bg-[#f8faf9] shadow-[-20px_0_60px_rgba(0,40,20,0.08)] flex flex-col overflow-hidden border-l border-emerald-100/50"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {/* ══ Header ═══════════════════════════════════ */}
            <div className="relative px-8 pt-10 pb-6 bg-gradient-to-b from-white to-[#f8faf9] border-b border-emerald-100/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[18px] bg-emerald-100/50 flex items-center justify-center border border-emerald-200/30">
                    <CalendarRange className="w-6 h-6 text-[#0a2e1f]" />
                  </div>
                  <div>
                    <h2 className="text-[20px] font-extrabold text-[#0a2e1f] tracking-tight">{drawerTitle}</h2>
                    <p className="text-[12px] text-[#7a9c8a] font-bold uppercase tracking-widest mt-0.5">
                      {registrations.length} Item{registrations.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white hover:bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm transition-all hover:scale-105 active:scale-95"
                >
                  <X className="w-4 h-4 text-[#4a7c65]" />
                </button>
              </div>

              {/* ══ Tabs ══ */}
              <div className="flex gap-2 mt-8 p-1.5 bg-emerald-900/5 rounded-[20px] border border-emerald-100/30">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2.5 rounded-[15px] text-[13px] font-bold transition-all ${
                      activeTab === tab
                        ? "bg-white text-[#0a2e1f] shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-emerald-100/50"
                        : "text-[#6a8c7a] hover:text-[#0a2e1f] hover:bg-white/50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* ══ List ═══════════════════════════════════ */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 rounded-[24px] bg-white border border-emerald-100 flex items-center justify-center mb-6 shadow-sm"
                  >
                    <BookOpen className="w-10 h-10 text-emerald-200" />
                  </motion.div>
                  <p className="text-[#0a2e1f] font-extrabold text-lg">No {isProduct ? "orders" : "bookings"} yet</p>
                  <p className="text-[#6a8c7a] text-sm mt-2 max-w-[240px] font-medium leading-relaxed">
                    Your {isProduct ? "orders" : isRetreat ? "retreat bookings" : "sessions"} will appear here for easy tracking.
                  </p>
                </div>
              ) : (
                <div className="space-y-5 pb-10">
                  {filtered.map((reg, idx) => {
                    const cfg = getStatusConfig(reg.status, reg.type);
                    return (
                      <motion.div
                        key={reg.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group bg-white rounded-[20px] border border-[#d1e0d9] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                      >
                        <div className="p-6 space-y-5">
                          {/* Header with Title and Status */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-extrabold text-[#0a2e1f] text-[17px] leading-tight group-hover:text-emerald-900 transition-colors">
                                {reg.sessionTitle}
                              </h4>
                              <p className="text-[13px] text-[#6a8c7a] font-bold mt-1.5 flex items-center gap-1.5">
                                {reg.type === "product" ? (
                                  <>
                                    <Clock className="w-3.5 h-3.5 text-emerald-600/60" />
                                    <span>Status: <span className="text-[#0a2e1f]">{reg.host}</span></span>
                                  </>
                                ) : (
                                  <>
                                    <Users className="w-3.5 h-3.5 text-emerald-600/60" />
                                    <span>With <span className="text-[#0a2e1f]">{reg.host}</span></span>
                                  </>
                                )}
                              </p>
                            </div>
                            <div className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${cfg.pill} shadow-sm whitespace-nowrap`}>
                               <span className="uppercase tracking-[0.1em]">{cfg.label}</span>
                             </div>
                          </div>

                          {/* Details Row */}
                          <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#f8faf9] border border-[#d1e0d9]/60">
                              <CalendarRange className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-[12px] font-bold text-[#1a3d2f]">{reg.schedule || "TBD"}</span>
                            </div>
                            {reg.type !== "product" && (
                              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#f8faf9] border border-[#d1e0d9]/60">
                                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-[12px] font-bold text-[#1a3d2f]">IST</span>
                              </div>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="pt-4 border-t border-[#d1e0d9]/40 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-300" />
                              <span className="text-[10px] font-extrabold text-[#96b0a4] uppercase tracking-widest">
                                {reg.type === "product" ? "Purchased" : "Registered"} {new Date(reg.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e1ede6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1e0d7;
        }
      `}</style>
    </AnimatePresence>
  );
}
