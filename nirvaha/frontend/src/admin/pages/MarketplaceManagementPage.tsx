import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, XCircle, Eye, Search, RotateCw,
  Clock, Users, CalendarCheck, Inbox, X,
  Phone, Mail, User, Leaf, Target
} from "lucide-react";
import io from "socket.io-client";
import { BACKEND_CONFIG } from "@/config/backend";

// ─── Types ───────────────────────────────────────────────────────────────────

type RegStatus = "pending" | "approved" | "rejected" | "completed";

type SessionReg = {
  id: string;
  type: string;
  status: RegStatus;
  createdAt: number;
  source?: "request" | "booking";
  data: {
    title?: string;
    name?: string;
    userName?: string;
    email?: string;
    phone?: string;
    wellnessGoal?: string;
    message?: string;
    host?: string;
    schedule?: string;
    sessionType?: string;
    platform?: string;
    startDate?: string;
    startTime?: string;
    timeZone?: string;
    duration?: string;
  };
};

const STATUS_STYLES: Record<RegStatus, { label: string; pill: string; dot: string }> = {
  pending:   { label: "Review Required", pill: "bg-[#fffbeb] text-[#92400e] border-[#fde68a]",    dot: "bg-amber-400" },
  approved:  { label: "Approved & Active", pill: "bg-[#d6eee9] text-[#0a2e1f] border-[#b8d8d1]", dot: "bg-emerald-500" },
  rejected:  { label: "Not Approved",     pill: "bg-rose-50 text-rose-700 border-rose-200",      dot: "bg-rose-400" },
  completed: { label: "Fully Completed",  pill: "bg-[#e7f5ef] text-[#065f46] border-[#34d399]/40", dot: "bg-teal-500" },
};

const FILTER_TABS = ["All", "Pending", "Approved", "Rejected", "Completed"] as const;
type FilterTab = (typeof FILTER_TABS)[number];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalize(item: any): SessionReg | null {
  if (!item || typeof item !== "object") return null;
  const id = item.id || item._id?.toString() || item.requestId;
  if (!id) return null;

  // Map backend statuses to frontend RegStatus
  let status: RegStatus = "pending";
  const rawStatus = (item.status || "").toLowerCase();
  
  if (rawStatus === "approved" || rawStatus === "upcoming") status = "approved";
  else if (rawStatus === "rejected") status = "rejected";
  else if (rawStatus === "completed") status = "completed";
  else status = "pending";

  // Robust data merging: Look everywhere for registration fields
  const nestedData = item.data && typeof item.data === 'object' ? item.data : {};
  
  return {
    id,
    type: item.type ?? "session",
    status,
    createdAt: typeof item.createdAt === "number" ? item.createdAt : new Date(item.createdAt ?? Date.now()).getTime(),
    source: item.requestId ? "request" : "booking",
    data: {
      ...nestedData,
      ...item,
      phone: item.phone || nestedData.phone || nestedData.phoneNumber || item.phoneNumber,
      wellnessGoal: item.wellnessGoal || nestedData.wellnessGoal || nestedData.goal || item.goal,
      message: item.message || nestedData.message || nestedData.note || item.note,
      userName: item.userName || nestedData.userName || item.fullName || nestedData.fullName || item.name || nestedData.name,
    },
  };
}

function getTitle(r: SessionReg) { 
  return r.data.title ?? r.data.name ?? r.data.sessionTitle ?? r.data.itemName ?? "Untitled Session"; 
}
function getUserName(r: SessionReg) { 
  return r.data.userName ?? r.data.fullName ?? r.data.name ?? "—"; 
}
function getEmail(r: SessionReg) { 
  return r.data.email ?? r.data.userEmail ?? "—"; 
}
function getSchedule(r: SessionReg) {
  if (r.type === "retreat") {
    const start = r.data.startDate || "";
    const end = r.data.endDate || "";
    if (start && end) return `${start} – ${end}`;
    if (start) return `${start}`;
    return "";
  }

  const d = r.data.startDate || "";
  const t = r.data.startTime || "";
  const z = r.data.timeZone || "";
  
  if (!d && !t) return "";

  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    // Attempt to parse d. If it's "16 May", add current year.
    let parseable = d;
    if (d.split(" ").length === 2) {
       parseable = `${d} ${new Date().getFullYear()}`;
    }
    
    const sessionDate = new Date(parseable);
    sessionDate.setHours(0,0,0,0);
    
    if (isNaN(sessionDate.getTime())) return `${d} ${t} ${z}`.trim();

    const diffMs = sessionDate.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / 86400000);
    
    let dateStr = d;
    if (diffDays === 0) dateStr = "Today";
    else if (diffDays === 1) dateStr = "Tomorrow";
    else if (diffDays > 1 && diffDays < 7) {
      dateStr = sessionDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    } else if (d) {
      dateStr = sessionDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    }

    const timeStr = t ? ` • ${t}` : "";
    const zoneStr = z ? ` ${z}` : "";
    
    return `${dateStr}${timeStr}${zoneStr}`.trim();
  } catch {
    return `${d} ${t} ${z}`.trim();
  }
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({
  reg, onClose, onApprove, onReject,
}: {
  reg: SessionReg;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const st = STATUS_STYLES[reg.status];
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[300] flex items-center justify-center p-4"
        style={{ 
          background: "rgba(10, 30, 20, 0.12)", 
          backdropFilter: "blur(12px)",
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 15 }}
          transition={{ type: "spring", damping: 30, stiffness: 450 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[640px] rounded-[32px] overflow-hidden bg-[#f8faf9] shadow-[0_30px_70px_-15px_rgba(0,40,20,0.18)] flex flex-col"
        >
          {/* ══ Header ═══════════════════════════════════ */}
          <div className="px-8 pt-7 pb-5 bg-white border-b border-[#d1e0d9]">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#eff6f3] flex items-center justify-center border border-emerald-100/30">
                    <CalendarCheck className="w-5 h-5 text-[#2d5a42]" />
                  </div>
                  <div>
                    <h2 className="text-[20px] font-extrabold text-[#0a2e1f] tracking-tight leading-tight">{getTitle(reg)}</h2>
                    <p className="text-[11px] text-[#7a9c8a] font-bold uppercase tracking-widest mt-0.5">Registration Review</p>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-[#f5f8f6] text-[#4a7c65] text-sm font-bold hover:bg-[#eef3f1] transition-all hover:scale-110 active:scale-90 border border-emerald-50"
              >
                X
              </button>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[11px] font-extrabold border shadow-sm ${st.pill}`}>
                <span className={`w-2 h-2 rounded-full ${st.dot} ${reg.status === 'approved' ? 'animate-pulse' : ''}`} />
                <span className="uppercase tracking-[0.1em]">{st.label}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#96b0a4] bg-[#f8faf9] px-3.5 py-1.5 rounded-full border border-emerald-100/40">
                <Clock className="w-3 h-3" />
                <span>Submitted {new Date(reg.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
              </div>
            </div>
          </div>

          {/* ══ Content ═══════════════════════════════════ */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6" style={{ maxHeight: "calc(100vh - 280px)" }}>
            
            {/* Section: User Information */}
            <div className="space-y-3.5">
              <p className="text-[9px] font-extrabold text-[#96b0a4] uppercase tracking-[0.25em] px-1">Registrant Details</p>
              <div className="grid grid-cols-2 gap-3.5">
                <DetailBox label="Full Name" value={getUserName(reg)} icon={User} />
                <DetailBox label="Email Address" value={getEmail(reg)} icon={Mail} />
                <DetailBox label="Phone Number" value={reg.data.phone || reg.data.phoneNumber || reg.data.mobile || "—"} icon={Phone} />
                <DetailBox label="Wellness Goal" value={reg.data.wellnessGoal || reg.data.goal || reg.data.objective || "—"} icon={Target} />
              </div>
            </div>

            {/* Section: Session Logistics */}
            <div className="space-y-3.5">
              <p className="text-[9px] font-extrabold text-[#96b0a4] uppercase tracking-[0.25em] px-1">Session Logistics</p>
              <div className="grid grid-cols-2 gap-3.5">
                <DetailBox label="Lead Mentor" value={reg.data.host || "—"} icon={Users} />
                <DetailBox label="Scheduled Time" value={getSchedule(reg)} icon={Clock} />
                <DetailBox label="Platform" value={reg.data.platform || "Google Meet"} icon={CheckCircle} />
                <DetailBox label="Duration" value={reg.data.duration ? `${reg.data.duration} min` : "—"} icon={Clock} />
              </div>
            </div>

            {/* Section: Message */}
            {reg.data.message && (
              <div className="space-y-3">
                <p className="text-[9px] font-extrabold text-[#96b0a4] uppercase tracking-[0.25em] px-1">Personal Message</p>
                <div className="p-4 rounded-[20px] bg-white border border-[#d1e0d9] shadow-[0_4px_12px_rgba(0,40,20,0.04)]">
                  <p className="text-[13px] text-[#2d5a42] leading-relaxed font-medium italic">"{reg.data.message}"</p>
                </div>
              </div>
            )}
          </div>

          {/* ══ Actions ═══════════════════════════════════ */}
          <div className="px-8 py-6 bg-white border-t border-[#d1e0d9] flex gap-3">
            {reg.status === "pending" ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onApprove}
                  className="flex-[2] h-[56px] rounded-full font-bold text-[16px] bg-[#0a2e1f] text-white shadow-[0_10px_25px_-5px_rgba(10,46,31,0.25)] flex items-center justify-center gap-3 transition-all"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve Registration
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onReject}
                  className="flex-1 h-[56px] rounded-full font-bold text-[15px] bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100/50 transition-all"
                >
                  Reject
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full h-[56px] rounded-full font-bold text-[16px] bg-[#0a2e1f] text-white shadow-[0_10px_25px_-5px_rgba(10,46,31,0.25)] transition-all"
              >
                Close Review
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function DetailBox({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="p-3.5 rounded-[18px] bg-white border border-[#d1e0d9] shadow-[0_4px_12px_rgba(0,40,20,0.04)] flex items-center gap-4 group hover:border-[#b4c9bf] transition-all">
      <div className="shrink-0">
        <Icon className="w-4 h-4 text-[#5a8c72]" />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-bold text-[#96b0a4] uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-[14px] font-bold text-[#0a2e1f] truncate leading-tight">{value}</p>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon, title, children,
}: {
  icon: any; title: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-[24px] p-6 border border-emerald-100/40 shadow-[0_4px_15px_rgba(0,40,20,0.02)] space-y-4">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-8 h-8 rounded-[10px] bg-emerald-50 flex items-center justify-center border border-emerald-100/30">
          <Icon className="w-4 h-4 text-emerald-600" />
        </div>
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#7a9c8a]">{title}</span>
      </div>
      <div className="space-y-3.5">
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-0.5 border-b border-emerald-50/30 last:border-0 pb-2 last:pb-0">
      <span className="text-[12px] text-[#96b0a4] font-bold uppercase tracking-tight shrink-0 pt-0.5">{label}</span>
      <span className="text-[14px] text-[#0a2e1f] font-bold text-right leading-snug">{value}</span>
    </div>
  );
}


// ─── Main Page ────────────────────────────────────────────────────────────────

export function MarketplaceManagementPage() {
  const [regs, setRegs] = useState<SessionReg[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<FilterTab>("All");
  const [detail, setDetail] = useState<SessionReg | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Persist status changes across reloads so polling doesn't overwrite them
  const statusOverrides = useRef<Record<string, RegStatus>>({});

  // ── Load ──────────────────────────────────────────────────────────────────
  const load = async () => {
    try {
      const [bRes, mRes, iRes] = await Promise.allSettled([
        fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/bookings`),
        fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/marketplace/requests`),
        fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/marketplace/items?status=active`),
      ]);

      let rawItems: any[] = [];
      let availableItems: any[] = [];

      if (iRes.status === "fulfilled" && iRes.value.ok) {
        availableItems = await iRes.value.json();
      }

      if (bRes.status === "fulfilled" && bRes.value.ok) {
        const bookings = await bRes.value.json();
        rawItems.push(...(Array.isArray(bookings) ? bookings : []));
      }

      if (mRes.status === "fulfilled" && mRes.value.ok) {
        const requests = await mRes.value.json();
        rawItems.push(...(Array.isArray(requests) ? requests : []));
      }

      // Filter and normalize with enrichment
      const normalized = rawItems
        .map(normalize)
        .filter((r): r is SessionReg => r !== null && r.type === "session")
        .map(r => {
          // Find matching item in marketplace. The ID could be in .id or ._id or .requestId
          const sid = r.data.itemId || r.data.sessionId || r.id;
          const matchingItem = availableItems.find(i => 
            (i.id === sid || i._id === sid || i.requestId === sid)
          );
          
          if (matchingItem) {
            // Marketplace items store actual session data in .data
            const sData = matchingItem.data || {};
            return {
              ...r,
              data: {
                ...sData,
                ...r.data,
                // Ensure identity comes from master item if registration is thin
                title: r.data.title || r.data.itemName || sData.title || sData.name,
                host: r.data.host || sData.instructor || sData.host,
                // Support both 'date' and 'startDate' from the database
                schedule: sData.schedule || r.data.schedule || (sData.date ? `${sData.date} ${sData.startTime || ""}` : (sData.startDate ? `${sData.startDate} ${sData.startTime || ""}` : null)),
                platform: r.data.platform || sData.platform || "Google Meet",
                duration: r.data.duration || sData.duration,
                startDate: sData.date || sData.startDate || r.data.startDate,
                startTime: sData.startTime || r.data.startTime,
                endDate: sData.endDate || r.data.endDate,
                timeZone: sData.timeZone || r.data.timeZone,
              }
            };
          }
          return r;
        });

      // Apply status overrides (for immediate feedback before polling refreshes)
      const final = normalized.map(r => 
        statusOverrides.current[r.id] ? { ...r, status: statusOverrides.current[r.id] } : r
      );

      setRegs(final);
    } catch (e) {
      console.error("Load error:", e);
    }
  };

  useEffect(() => {
    load();
    const socket = io(BACKEND_CONFIG.SOCKET_BASE_URL);
    socket.on("marketplace-new-request", load);
    socket.on("marketplace-request-approved", load);
    socket.on("booking-created", load);
    // Increased to 60s to reduce visible flicker; overrides handle persistence
    const iv = setInterval(load, 60000);
    return () => { socket.disconnect(); clearInterval(iv); };
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────
  const updateStatus = async (id: string, status: RegStatus) => {
    // 1. Save to override map so future loads respect this decision
    statusOverrides.current[id] = status;

    // 2. Immediately update UI
    setRegs(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    if (detail?.id === id) setDetail(prev => prev ? { ...prev, status } : prev);

    const reg = regs.find(r => r.id === id);
    const email = reg ? getEmail(reg) : "";

    // 3. Update localStorage registrations (for My Sessions on user side)
    try {
      const storageKey = email && email !== "—" ? `nirvaha_my_sessions_${email}` : "nirvaha_my_sessions_guest";
      const local: any[] = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const updated = local.map((l: any) => l.id === id ? { ...l, status } : l);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      
      // Fallback for older generic keys
      const fallbackLocal: any[] = JSON.parse(localStorage.getItem("nirvaha_my_sessions") || "[]");
      if (fallbackLocal.length > 0) {
        const fallbackUpdated = fallbackLocal.map((l: any) => l.id === id ? { ...l, status } : l);
        localStorage.setItem("nirvaha_my_sessions", JSON.stringify(fallbackUpdated));
      }

      // Notify user-side components on the same tab
      window.dispatchEvent(new CustomEvent("nirvaha-session-status-updated", { detail: { id, status } }));
    } catch { /* ignore */ }

    // 4. Try backend
    try {
      const isBooking = reg?.source === "booking";
      
      if (isBooking) {
        // Update booking status
        await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/bookings/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: status === "approved" ? (reg.type === "retreat" ? "approved" : "upcoming") : status }),
        });
      } else {
        // Generic status update for other cases
        await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/marketplace/requests/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
      }
    } catch (err) {
      console.error("Backend status update failed:", err);
    }
  };

  const handleRefresh = () => { setRefreshing(true); load().finally(() => setTimeout(() => setRefreshing(false), 500)); };

  // ── Derived ───────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return regs.filter(r => {
      const matchTab = tab === "All" || r.status === tab.toLowerCase();
      const matchSearch = !q || getTitle(r).toLowerCase().includes(q) || getUserName(r).toLowerCase().includes(q) || getEmail(r).toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [regs, tab, search]);

  const counts = useMemo(() => ({
    pending:   regs.filter(r => r.status === "pending").length,
    approved:  regs.filter(r => r.status === "approved").length,
    completed: regs.filter(r => r.status === "completed").length,
    total:     regs.length,
  }), [regs]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#f7fdf9] to-[#edf7f2] p-6 -m-6 rounded-tl-3xl">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1a3d2f]">Session Registrations</h1>
            <p className="text-sm text-[#5a8c72] mt-0.5">Review and manage wellness session requests</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={handleRefresh}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#c8e6d4] rounded-2xl shadow-sm text-[#2d6a4f] text-sm font-semibold hover:bg-emerald-50 transition-all"
          >
            <RotateCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </motion.button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Pending Requests", value: counts.pending,   icon: Clock,        color: "from-amber-50 to-amber-100", ic: "text-amber-500" },
            { label: "Approved Today",   value: counts.approved,  icon: CheckCircle,  color: "from-emerald-50 to-emerald-100", ic: "text-emerald-500" },
            { label: "Upcoming Sessions",value: counts.approved,  icon: CalendarCheck,color: "from-teal-50 to-teal-100",    ic: "text-teal-500" },
            { label: "Total Registered", value: counts.total,     icon: Users,        color: "from-sage-50 to-[#e8f5ee]",  ic: "text-[#2d6a4f]" },
          ].map(c => (
            <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-2xl p-5 border border-white/60 shadow-sm`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{c.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{c.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center ${c.ic}`}>
                  <c.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter + Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#d5ead e] shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Tabs */}
          <div className="flex gap-1 flex-wrap">
            {FILTER_TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  tab === t
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                {t}
                {t !== "All" && (
                  <span className="ml-1.5 opacity-70">
                    ({regs.filter(r => r.status === t.toLowerCase()).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative sm:ml-auto sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7db99a]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name or session..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#c8e6d4] bg-[#f7fdf9] text-sm text-[#1a3d2f] placeholder:text-[#9dc9b4] focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-[#d5eade] shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gradient-to-r from-[#d4edde] to-[#e8f5ee] text-xs font-bold text-[#1a4d32] uppercase tracking-widest border-b border-[#c8e6d4]">
            <div className="col-span-3">Registrant</div>
            <div className="col-span-3">Session</div>
            <div className="col-span-2">Schedule</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right pr-2">Actions</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#edf7f2]">
            <AnimatePresence>
              {filtered.map(r => {
                const st = STATUS_STYLES[r.status];
                return (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#f4fbf6] transition-colors"
                  >
                    {/* Registrant */}
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-200 to-teal-300 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {getUserName(r)[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#1a3d2f] truncate">{getUserName(r)}</p>
                        <p className="text-xs text-gray-400 truncate">{getEmail(r)}</p>
                      </div>
                    </div>

                    {/* Session */}
                    <div className="col-span-3 min-w-0">
                      <p className="text-sm font-semibold text-[#1a3d2f] truncate">{getTitle(r)}</p>
                      {r.data.host && <p className="text-xs text-gray-400 truncate">with {r.data.host}</p>}
                      {r.data.wellnessGoal && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-medium rounded-full border border-emerald-100 truncate max-w-full">
                          {r.data.wellnessGoal}
                        </span>
                      )}
                    </div>

                    {/* Schedule */}
                    <div className="col-span-2">
                      <div className="space-y-1">
                        <p className="text-[13px] font-bold text-[#0a2e1f] leading-tight">
                          {getSchedule(r)}
                        </p>
                        <p className="text-[10px] text-[#7a9c8a] font-bold uppercase tracking-wider">
                          {r.type === 'retreat' ? 'Retreat' : 'Session'} Registration • {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${st.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${st.dot}`} />
                        {st.label}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setDetail(r)}
                        className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center transition-colors text-gray-500"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {r.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(r.id, "approved")}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(r.id, "rejected")}
                            className="px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-semibold hover:bg-rose-100 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                  <Inbox className="w-7 h-7 text-emerald-300" />
                </div>
                <p className="text-sm font-semibold text-gray-500">No registrations found</p>
                <p className="text-xs text-gray-400 mt-1">Try a different filter or search term</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <DetailModal
          reg={detail}
          onClose={() => setDetail(null)}
          onApprove={() => { updateStatus(detail.id, "approved"); setDetail(null); }}
          onReject={() => { updateStatus(detail.id, "rejected"); setDetail(null); }}
        />
      )}
    </div>
  );
}
