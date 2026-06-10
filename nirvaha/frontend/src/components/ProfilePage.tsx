import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  Award,
  Clock,
  Heart,
  Zap,
  Target,
  BarChart3,
  Brain,
  Wind,
  Sun,
  Moon,
  Settings,
  Bell,
  Shield,
  CreditCard,
  User,
  Mail,
  MapPin,
  Edit2,
  Download,
  Share2,
  ChevronRight,
  Sparkles,
  Users,
  Calendar as CalendarIcon,
  BarChart2,
  ClipboardList,
  CheckCircle,
  Video,
  Check,
  Loader2,
  Lock,
  Trash2,
  Volume2,
  Key,
  X,
} from "lucide-react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShareProfileCard } from "./ShareProfileCard";
import { MeditationSessionModal } from "./MeditationSessionModal";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";
import { useSocket } from "../contexts/SocketContext";
import { useTranslation } from "react-i18next";
import type { AppLanguage, ThemeMode } from "../types/settings";
import { useProfileSync } from "../hooks/useProfileSync";
import { InitialsAvatar } from "./ui/InitialsAvatar";
import BACKEND_CONFIG from "../config/backend";
import html2canvas from "html2canvas";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const DAILY_QUOTES = [
  "Peace begins with a slow breath and a quiet mind.",
  "Small mindful moments create lasting inner peace.",
  "Stillness is not empty—it is full of answers.",
  "Return to your breath; it always knows the way home.",
  "Gentle awareness is enough for today.",
  "What you practice grows—choose calm, often.",
  "Let the mind soften; you do not have to fix everything at once.",
  "Each exhale is permission to release what you no longer need.",
  "Presence is the simplest form of self-care.",
  "You are allowed to move slowly and still be progressing.",
  "Quiet the noise; listen for what feels true beneath it.",
  "Compassion toward yourself is a skill—keep training it.",
  "The body relaxes when the mind stops rushing ahead.",
  "One mindful minute can reshape the tone of your whole day.",
  "Healing is rarely loud; it often arrives in gentle layers.",
  "Notice without judgment—that is where freedom starts.",
  "Rest is not a reward; it is part of the path.",
  "Return again and again; consistency is kindness.",
  "You do not need a perfect practice—only a sincere one.",
  "Let today be enough, exactly as it is.",
  "Soft attention is stronger than harsh discipline.",
  "The breath you take now is already a fresh beginning.",
  "Walk gently through your thoughts—they are visitors, not verdicts.",
  "Ease is not laziness; it is intelligent pacing.",
  "When the world feels loud, anchor in one quiet sensation.",
  "Progress in mindfulness is measured in return, not perfection.",
  "Let kindness toward yourself be the background music of your day.",
  "A calm heart listens better than a hurried mind.",
  "You can begin again in every breath—no permission slip required.",
  "Still water reflects clearly; give your mind a moment to settle.",
  "Honor small wins; they stack into steady transformation.",
  "What you repeat shapes you—repeat peace when you can.",
  "There is wisdom in pausing before you answer—inside or out.",
  "Your nervous system learns safety through patient repetition.",
  "Let go of the scoreboard; stay with the practice.",
  "Breathing slower is sometimes the bravest thing you can do.",
];

function getLocalDateKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Mood labels aligned with Emotional Landscape UI (order matters for display). */
const EMOTIONAL_MOOD_LABELS = ["Peaceful", "Calm", "Focused", "Relaxed", "Energized"] as const;
type EmotionalMoodLabel = (typeof EMOTIONAL_MOOD_LABELS)[number];

function parseSessionTime(entry: Record<string, unknown>): number {
  const raw = entry.completedAt ?? entry.date ?? entry.createdAt ?? entry.timestamp;
  if (raw == null) return Date.now();
  const t = new Date(String(raw)).getTime();
  return Number.isFinite(t) ? t : Date.now();
}

function sessionWeightMinutes(entry: Record<string, unknown>): number {
  const d = Number(entry.duration);
  if (Number.isFinite(d) && d > 0) return Math.min(d, 240);
  return 1;
}

/** Monday = 0 … Sunday = 6 (same indexing as backend `stats.weeklyMinutes`). */
function mondayIndexFromDate(d: Date): number {
  return (d.getDay() + 6) % 7;
}

/** Practice minutes per weekday for the current calendar week, from session history (local). */
function buildWeeklyPracticeFromHistory(history: Record<string, unknown>[]): number[] {
  const week = [0, 0, 0, 0, 0, 0, 0];
  const now = new Date();
  const start = new Date(now);
  const dow = start.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  start.setDate(start.getDate() + mondayOffset);
  start.setHours(0, 0, 0, 0);
  const endMs = start.getTime() + 7 * 86400000;

  for (const e of history) {
    const t = parseSessionTime(e);
    if (t < start.getTime() || t >= endMs) continue;
    const idx = mondayIndexFromDate(new Date(t));
    week[idx] += sessionWeightMinutes(e);
  }
  return week;
}

/**
 * One mood bucket per session — uses sessionType, stored `type` (sound category or meditation tag),
 * and title keywords so percentages track real behavior (breath → Calm, sleep → Relaxed/Peaceful, etc.).
 */
function classifySessionToMood(entry: Record<string, unknown>): EmotionalMoodLabel {
  const title = String(entry.title ?? "").toLowerCase();
  const sessionType = String(entry.sessionType ?? "").toLowerCase();
  const type = String(entry.type ?? "").toLowerCase();
  const blob = `${title} ${sessionType} ${type}`;

  if (
    sessionType === "breath" ||
    /\b(pranayama|breathwork|breathing exercise|breath work|box breath|ujjayi|nadi|4-7-8|equal breath|calm breath)\b/.test(blob)
  ) {
    return "Calm";
  }
  if (/\bbreathing\b/.test(title) && !/\b(sleep|night|bedtime|insomnia)\b/.test(blob)) {
    return "Calm";
  }

  if (sessionType === "sound") {
    const sleepish =
      /\bsleep\b/.test(type) ||
      /\b(sleep|insomnia|bedtime|night rest|delta wave|yoga nidra|deep rest)\b/.test(title) ||
      (/\bbinaural\b/.test(type) && /\b(sleep|delta|rest|insomnia)\b/.test(title));
    if (sleepish) {
      return /\b(lullaby|peaceful sleep|gentle dream|soft sleep|calm night|serene night)\b/.test(title) ? "Peaceful" : "Relaxed";
    }

    const focusish =
      /\b(focus|productivity|work|study|concentration)\b/.test(type) ||
      (/\bbinaural\b/.test(type) && /\b(focus|alpha|beta|work|study|concentrat)\b/.test(title)) ||
      /\b(focus|study|work mode|deep work|concentrat)\b/.test(title);
    if (focusish) return "Focused";

    const energyish =
      /\b(chakra|crystal|energy|power|boost|vitality)\b/.test(type) ||
      /\b(energ|morning boost|active|power up|528 hz|wake up|kundalini)\b/.test(title);
    if (energyish) return "Energized";

    if (/\b(stress|anxiety|tension|overwhelm)\b/.test(type) || /\b(stress|anxiety|relief|reset)\b/.test(title)) {
      return "Calm";
    }
    if (/\b(nature|ambient|ocean|rain|forest|bowl|healing|relaxation)\b/.test(type)) {
      return "Peaceful";
    }
    if (/\b(meditation)\b/.test(type) && !/\b(sleep|focus)\b/.test(title)) return "Peaceful";

    if (/\b(focus|study|work)\b/.test(title)) return "Focused";
    if (/\b(sleep|night|bedtime|delta)\b/.test(title)) return "Relaxed";
    if (/\b(energ|chakra|crystal)\b/.test(title)) return "Energized";
    return "Peaceful";
  }

  if (/\bsleep\b/.test(type) || /\b(sleep|body scan|yoga nidra|bedtime|night meditation)\b/.test(blob)) {
    return "Relaxed";
  }
  if (/\bfocus\b/.test(type) || /\b(focus|concentrat|vipassana|attention|study)\b/.test(blob)) {
    return "Focused";
  }
  if (/\b(energ|power|active|kundalini)\b/.test(type) || /\b(energ|morning flow|power)\b/.test(blob)) {
    return "Energized";
  }
  if (/\bcalm\b/.test(type) || /\b(calm|stillness|gentle|soft)\b/.test(blob)) return "Calm";
  if (/\b(mindful|meditat|peace|serene|loving.kindness)\b/.test(blob)) return "Peaceful";

  return "Peaceful";
}

function buildEmotionalLandscapeAnalytics(
  history: Record<string, unknown>[],
  weeklyMinutes: number[],
  streak: number
) {
  const now = Date.now();
  const windowMs = 90 * 86400000;
  const inWindow = history.filter((e) => now - parseSessionTime(e) <= windowMs);

  const scores: Record<EmotionalMoodLabel, number> = {
    Peaceful: 0,
    Calm: 0,
    Focused: 0,
    Relaxed: 0,
    Energized: 0,
  };
  for (const entry of inWindow) {
    const label = classifySessionToMood(entry);
    scores[label] += sessionWeightMinutes(entry);
  }

  const total = EMOTIONAL_MOOD_LABELS.reduce((s, k) => s + scores[k], 0);
  const rawPct: Record<EmotionalMoodLabel, number> = { Peaceful: 0, Calm: 0, Focused: 0, Relaxed: 0, Energized: 0 };
  if (total > 0) {
    let allocated = 0;
    EMOTIONAL_MOOD_LABELS.forEach((k) => {
      const v = Math.round((100 * scores[k]) / total);
      rawPct[k] = v;
      allocated += v;
    });
    const drift = 100 - allocated;
    if (drift !== 0) {
      const richest = EMOTIONAL_MOOD_LABELS.reduce((a, b) => (scores[b] > scores[a] ? b : a));
      rawPct[richest] = Math.max(0, rawPct[richest] + drift);
    }
  }

  let dominant: EmotionalMoodLabel = "Peaceful";
  let maxScore = -1;
  for (const k of EMOTIONAL_MOOD_LABELS) {
    if (scores[k] > maxScore) {
      maxScore = scores[k];
      dominant = k;
    }
  }

  const daysActive = weeklyMinutes.filter((m) => m > 0).length;
  const totalWeekly = weeklyMinutes.reduce((a, b) => a + b, 0);
  const sessionsLast14 = inWindow.filter((e) => now - parseSessionTime(e) <= 14 * 86400000).length;
  const windowSessions = inWindow.length;
  // Blend weekly spread, streak, volume, and recent session count so the index moves with real activity
  // (avoids a “stuck” low % when you already have many sessions but uneven weekly bars).
  const emotionalConsistencyScore = Math.round(
    Math.min(
      100,
      (daysActive / 7) * 22 +
        Math.min(streak / 14, 1) * 24 +
        Math.min(totalWeekly / 100, 1) * 18 +
        Math.min(sessionsLast14 / 20, 1) * 18 +
        Math.min(windowSessions / 30, 1) * 18
    )
  );

  const moodsTouched = EMOTIONAL_MOOD_LABELS.filter((k) => scores[k] > 0).length;

  const moodMixFingerprint = `${inWindow.length}-${Math.round(total)}-${dominant}-${EMOTIONAL_MOOD_LABELS.map((k) => rawPct[k]).join(".")}`;

  return {
    scores,
    percentages: rawPct,
    dominantLabel: dominant,
    sessionsInWindow: inWindow.length,
    emotionalConsistencyScore,
    moodsTouched,
    moodMixFingerprint,
  };
}

/** Prefer the source with more sessions (then fresher totals) so UI updates after refreshProfile(). */
function pickSessionHistory(profileHist: unknown, userHist: unknown): Record<string, unknown>[] {
  const p = Array.isArray(profileHist) ? (profileHist as Record<string, unknown>[]) : [];
  const u = Array.isArray(userHist) ? (userHist as Record<string, unknown>[]) : [];
  if (u.length > p.length) return u;
  if (p.length > u.length) return p;
  return u.length > 0 ? u : p;
}

function mergeStatsForDisplay(profileStats: unknown, userStats: unknown): Record<string, unknown> {
  const p = (profileStats && typeof profileStats === "object" ? profileStats : {}) as Record<string, unknown>;
  const u = (userStats && typeof userStats === "object" ? userStats : {}) as Record<string, unknown>;
  const pS = Number(p.sessionsPlayed ?? 0);
  const uS = Number(u.sessionsPlayed ?? 0);
  const pM = Number(p.totalMinutes ?? 0);
  const uM = Number(u.totalMinutes ?? 0);
  
  const merged = uS > pS || (uS === pS && uM >= pM) ? { ...p, ...u } : { ...u, ...p };
  
  const finalSessions = Number(merged.sessionsPlayed ?? 0);
  if (finalSessions === 0) {
    merged.sessionsPlayed = 0;
    merged.streak = 0;
    merged.totalMinutes = 0;
    merged.wellnessScore = 50;
  }
  
  return merged;
}

export function ProfilePage() {
  const { user: authUser, loading: authLoading, syncUserFromServer, refreshProfile, setCurrentUser } = useAuth();

  // Load user from latest source: auth context OR localStorage("user")
  const user = useMemo(() => {
    if (authUser) return authUser;
    const localUserRaw = localStorage.getItem("user");
    if (localUserRaw) {
      try {
        return JSON.parse(localUserRaw);
      } catch (e) {
        console.error("Error parsing local user:", e);
      }
    }
    return null;
  }, [authUser]);

  const { socket } = useSocket();
  const { getWeeklyData, getTodayMinutes } = useProfileSync();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const location = useLocation();

  // Listen to URL query params to auto-open settings/notifications/privacy
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const openParam = params.get("open");
    if (openParam === "settings") {
      setIsSettingsOpen(true);
      setIsNotificationsOpen(false);
      setIsPrivacyOpen(false);
    } else if (openParam === "notifications") {
      setIsNotificationsOpen(true);
      setIsSettingsOpen(false);
      setIsPrivacyOpen(false);
    } else if (openParam === "privacy") {
      setIsPrivacyOpen(true);
      setIsSettingsOpen(false);
      setIsNotificationsOpen(false);
    }
  }, [location]);

  // Refresh profile on mount to ensure we have the absolute latest backend data
  // (e.g. companion approval status) instead of stale localStorage cache.
  useEffect(() => {
    refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const StatCounter = ({ value }: { value: number }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      if (!value || value <= 0) {
        setCount(0);
        return;
      }
      let start = 0;
      const end = value;
      const duration = 1500;
      const stepTime = Math.max(10, Math.floor(duration / end));

      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= end) clearInterval(timer);
      }, stepTime);

      return () => clearInterval(timer);
    }, [value]);
    return <>{count}</>;
  };
  
  const [profileData, setProfileData] = useState<any>(null);
  const { t } = useTranslation();
  const {
    settings,
    isSaving: isSavingSettings,
    setTheme,
    setLanguage,
    setNotificationToggle,
    setPrivacyToggle,
    deleteAccount,
    clearChatHistory,
    blockedUsersCount,
  } = useSettings();
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const showSaveFeedback = (message: string) => {
    setSaveMessage(message);
    setTimeout(() => setSaveMessage(null), 3000);
  };
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordStatus({ success: false, message: "All fields are required" });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordStatus({ success: false, message: "Password must be at least 6 characters long" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ success: false, message: "New passwords do not match" });
      return;
    }

    setIsChangingPassword(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        setPasswordStatus({ success: false, message: data.error || "Failed to change password" });
      } else {
        setPasswordStatus({ success: true, message: "Password changed successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setPasswordStatus({ success: false, message: "An error occurred. Please try again." });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const profileRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [userBookings, setUserBookings] = useState<any[]>([]);

  // ── Companion Mode Switch (TEMPORARY OVERRIDE FOR VERIFICATION) ───

  // Force-enable companion UI to verify runtime user object
  const canAccessCompanionMode = true;

  const isUserApprovedCompanion = canAccessCompanionMode;

  const CompanionModeSwitch = () => {
    return (
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2.5 bg-white/60 backdrop-blur-md border border-emerald-200/60 rounded-2xl px-4 py-2.5 shadow-sm"
      >
        <Users className="w-4 h-4 text-[#2D6A4F]" />
        <span className="text-sm font-bold text-[#1B4332] select-none">As a Companion</span>
        {/* Toggle switch */}
        <button
          id="companion-mode-toggle"
          role="switch"
          aria-checked={isCompanionModeEnabled}
          onClick={handleCompanionToggle}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:ring-offset-1 ${
            isCompanionModeEnabled
              ? 'bg-[#2D6A4F] border-[#2D6A4F]'
              : 'bg-gray-200 border-gray-200'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out ${
              isCompanionModeEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </motion.div>
    );
  };

  const [isCompanionModeEnabled, setIsCompanionModeEnabled] = useState(false);
  const [companionBookings, setCompanionBookings] = useState<any[]>([]);
  const [companionBookingsLoading, setCompanionBookingsLoading] = useState(false);
  const [markingCompleted, setMarkingCompleted] = useState<string | null>(null);

  const fetchMySessions = useCallback(async () => {
    if (!user?.email) return;
    try {
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/bookings`);
      if (!response.ok) {
        console.warn('[PROFILE] Failed to fetch my sessions:', response.status);
        setUserBookings([]);
        return;
      }
      const data = await response.json();
      const allBookings = Array.isArray(data) ? data : [];
      const mySessions = allBookings.filter(
        (b: any) =>
          (b.userEmail && b.userEmail.toLowerCase() === user.email.toLowerCase()) ||
          (b.email && b.email.toLowerCase() === user.email.toLowerCase())
      );
      setUserBookings(mySessions);
    } catch (error) {
      console.error('[PROFILE] Error fetching my sessions:', error);
      setUserBookings([]);
    }
  }, [user?.email]);

  // Fetch approved bookings where logged-in companion is assigned
  const fetchCompanionBookings = useCallback(async () => {
    if (!user?.email && !user?.name) return;
    setCompanionBookingsLoading(true);
    try {
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/bookings`);
      if (!response.ok) {
        setCompanionBookings([]);
        return;
      }
      const data = await response.json();
      const allBookings = Array.isArray(data) ? data : [];
      const approved = allBookings.filter((b: any) => {
        return (
          b.status === "Session Confirmed" &&
          (b.companionName === user?.name || b.companionEmail === user?.email)
        );
      });
      setCompanionBookings(approved);
    } catch (err) {
      console.error('[PROFILE] Error fetching companion bookings:', err);
      setCompanionBookings([]);
    } finally {
      setCompanionBookingsLoading(false);
    }
  }, [user?.email, user?.name]);

  // Mark a booking as completed
  const handleMarkCompleted = async (bookingId: string) => {
    setMarkingCompleted(bookingId);
    try {
      const idField = bookingId;
      const response = await fetch(
        `${BACKEND_CONFIG.API_BASE_URL}/api/bookings/${idField}/status`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Completed' }),
        }
      );
      if (response.ok) {
        setCompanionBookings((prev) =>
          prev.map((b) =>
            (b.id === bookingId || b._id === bookingId)
              ? { ...b, status: 'Completed' }
              : b
          )
        );
      }
    } catch (err) {
      console.error('[PROFILE] Mark completed error:', err);
    } finally {
      setMarkingCompleted(null);
    }
  };

  // Toggle companion mode: fetch bookings when switching on
  const handleCompanionToggle = () => {
    const next = !isCompanionModeEnabled;
    setIsCompanionModeEnabled(next);
    if (next && isUserApprovedCompanion) {
      fetchCompanionBookings();
    }
  };

  useEffect(() => {
    if (!socket || !user?.email) return;

    const handleBookingUpdated = (updatedBooking: any) => {
      const isUserBooking =
        (updatedBooking.userEmail && updatedBooking.userEmail.toLowerCase() === user.email.toLowerCase()) ||
        (updatedBooking.email && updatedBooking.email.toLowerCase() === user.email.toLowerCase());

      if (isUserBooking) {
        setUserBookings((prev) => {
          const matchIndex = prev.findIndex((b) => (b.id === updatedBooking.id || b._id === updatedBooking._id || b.id === updatedBooking._id));
          if (matchIndex !== -1) {
            const updated = [...prev];
            updated[matchIndex] = {
              ...updated[matchIndex],
              ...updatedBooking,
              id: updatedBooking.id || updatedBooking._id,
            };
            return updated;
          } else {
            return [
              {
                ...updatedBooking,
                id: updatedBooking.id || updatedBooking._id,
              },
              ...prev,
            ];
          }
        });
      }
    };

    socket.on("booking-updated", handleBookingUpdated);
    return () => {
      socket.off("booking-updated", handleBookingUpdated);
    };
  }, [socket, user?.email]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.email) return;
      try {
        setSessionsLoading(true);
        await fetchMySessions();
      } catch (error) {
        console.error("[PROFILE] Failed to load sessions:", error);
      } finally {
        setSessionsLoading(false);
      }
    };

    fetchBookings();
  }, [user?.email, fetchMySessions]);

  useEffect(() => {
    if (authLoading) return;
    void syncUserFromServer();
  }, [authLoading, syncUserFromServer]);

  useEffect(() => {
    if (!socket || !user?.email) return;

    const handleCompanionStatusUpdated = (payload: {
      email?: string;
      status?: string;
      isApprovedCompanion?: boolean;
    }) => {
      const payloadEmail = (payload.email || "").toLowerCase();
      const myEmail = user.email.toLowerCase();
      if (payloadEmail && payloadEmail !== myEmail) return;

      void syncUserFromServer();
    };

    socket.on("request-status-updated", handleCompanionStatusUpdated);
    return () => {
      socket.off("request-status-updated", handleCompanionStatusUpdated);
    };
  }, [socket, user?.email, syncUserFromServer]);


  const availableMoods = [
    { icon: Sun, label: "Peaceful", color: "from-[#52B788] to-[#2D6A4F]" },
    { icon: Wind, label: "Calm", color: "from-[#40916C] to-[#2D6A4F]" },
    { icon: Target, label: "Focused", color: "from-[#2D6A4F] to-[#1B4332]" },
    { icon: Moon, label: "Relaxed", color: "from-[#74C69D] to-[#40916C]" },
    { icon: Zap, label: "Energized", color: "from-[#95D5B2] to-[#52B788]" },
  ];

  const [selectedMood, setSelectedMood] = useState(availableMoods[0]);
  const [isGoodDay, setIsGoodDay] = useState(false);
  const [activeSession] = useState<any>(null);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [quoteDayKey, setQuoteDayKey] = useState(() => getLocalDateKey());
  useEffect(() => {
    const id = window.setInterval(() => {
      const next = getLocalDateKey();
      setQuoteDayKey((prev) => (prev !== next ? next : prev));
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const dailyQuote = useMemo(() => {
    const [y, mon, day] = quoteDayKey.split("-").map(Number);
    const utcNoon = Date.UTC(y, mon - 1, day, 12, 0, 0);
    const dayOrdinal = Math.floor(utcNoon / 86400000);
    const idx = dayOrdinal % DAILY_QUOTES.length;
    return { quote: DAILY_QUOTES[idx], key: quoteDayKey };
  }, [quoteDayKey]);

  const stats = useMemo(
    () => mergeStatsForDisplay(profileData?.stats, user?.stats) as Record<string, unknown> & {
      weeklyMinutes?: number[];
      sessionsPlayed?: number;
      streak?: number;
      totalMinutes?: number;
      wellnessScore?: number;
    },
    [profileData?.stats, user?.stats]
  );
  const todayPracticeTime = useMemo(() => {
    const sessionHistoryList = pickSessionHistory(
      profileData?.sessionHistory,
      (user as { sessionHistory?: Record<string, unknown>[] } | null)?.sessionHistory
    );
    const now = new Date();
    const todayDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    console.log('DEBUG: todayDateStr:', todayDateStr);
    console.log('DEBUG: sessionHistoryList:', sessionHistoryList);
    const todaySessions = sessionHistoryList.filter((session) => {
      const date = session.date;

      // Use date field if available (new format), otherwise fall back to completedAt (old format)
      if (date) {
        return String(date) === todayDateStr;
      }
      const completedAt = session.completedAt;
      if (!completedAt) return false;
      const completedAtDate = new Date(String(completedAt));
      const completedAtDateStr = `${completedAtDate.getFullYear()}-${String(completedAtDate.getMonth() + 1).padStart(2, '0')}-${String(completedAtDate.getDate()).padStart(2, '0')}`;
      return completedAtDateStr === todayDateStr;
    });
    const totalMinutes = todaySessions.reduce((sum, session) => {
      const duration = Number(session.duration);
      return sum + (Number.isFinite(duration) && duration > 0 ? duration : 0);
    }, 0);
    return totalMinutes;
  }, [profileData?.sessionHistory, user]);
  const weeklyMinutes = useMemo(() => {
    const w = stats.weeklyMinutes;
    if (Array.isArray(w) && w.length >= 7) {
      return w.slice(0, 7).map((x) => (Number(x) > 0 ? Number(x) : 0));
    }
    return [0, 0, 0, 0, 0, 0, 0];
  }, [
    Array.isArray(stats.weeklyMinutes) && stats.weeklyMinutes.length >= 7
      ? stats.weeklyMinutes.slice(0, 7).join(",")
      : "__empty__",
  ]);

  const displayBio = profileData?.bio || user?.bio || "🌿 You're building consistency — keep going.";
  const displayLocation = (profileData?.location || user?.location || "Hyderabad, India");
  const weeklyData = [
    { day: "Mon", minutes: weeklyMinutes[0] },
    { day: "Tue", minutes: weeklyMinutes[1] },
    { day: "Wed", minutes: weeklyMinutes[2] },
    { day: "Thu", minutes: weeklyMinutes[3] },
    { day: "Fri", minutes: weeklyMinutes[4] },
    { day: "Sat", minutes: weeklyMinutes[5] },
    { day: "Sun", minutes: weeklyMinutes[6] },
  ];

  const weeklySyncData = getWeeklyData();
  const totalWeeklyMinutes = weeklySyncData.totalWeeklyMinutes;
  const averageDailyMinutes = Math.round(totalWeeklyMinutes / 7);
  const mostActiveDay = weeklySyncData.mostActiveDay;

  /** Y-axis ceiling with headroom so bars are not glued to the top; ticks stay readable */
  const maxDayMinutes = weeklyData.reduce((acc, d) => Math.max(acc, d.minutes), 0);
  const weeklyChartYMax =
    maxDayMinutes <= 0 ? 30 : Math.max(15, Math.ceil((maxDayMinutes * 1.22) / 5) * 5);

  const sessionHistoryList = useMemo(
    () =>
      pickSessionHistory(
        profileData?.sessionHistory,
        (user as { sessionHistory?: Record<string, unknown>[] } | null)?.sessionHistory
      ),
    [profileData?.sessionHistory, user]
  );

  const weeklyPracticeFromHistory = useMemo(
    () => buildWeeklyPracticeFromHistory(sessionHistoryList),
    [sessionHistoryList]
  );

  const moodHistory = useMemo(() => {
    const sumFromHist = weeklyPracticeFromHistory.reduce((a, b) => a + b, 0);
    const levels = sumFromHist > 0 ? weeklyPracticeFromHistory : weeklyMinutes;
    return [
      { day: "M", level: levels[0] },
      { day: "T", level: levels[1] },
      { day: "W", level: levels[2] },
      { day: "T", level: levels[3] },
      { day: "F", level: levels[4] },
      { day: "S", level: levels[5] },
      { day: "S", level: levels[6] },
    ];
  }, [weeklyPracticeFromHistory, weeklyMinutes]);

  const mostActiveEmotionalDay = useMemo(() => {
    if (!moodHistory.some((m) => m.level > 0)) return "No activity yet";
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const bestIdx = moodHistory.reduce(
      (bestI, m, i, arr) => (m.level > arr[bestI].level ? i : bestI),
      0
    );
    return dayNames[bestIdx];
  }, [moodHistory]);

  const { profileMeditationMinutes, profileSoundMinutes } = useMemo(() => {
    if ((stats.sessionsPlayed ?? 0) === 0 || sessionHistoryList.length === 0) {
      return {
        profileMeditationMinutes: 0,
        profileSoundMinutes: 0,
      };
    }
    let medMins = 0;
    let soundMins = 0;
    for (const e of sessionHistoryList) {
      const st = String(e.sessionType ?? "").toLowerCase();
      const typ = String(e.type ?? "").toLowerCase();
      const mins = Math.max(0, Number(e.duration) || 0);
      const isSound =
        st === "sound" ||
        typ.includes("sound healing") ||
        typ.includes("sound_healing");
      if (isSound) soundMins += mins;
      else medMins += mins;
    }
    const totalCat = medMins + soundMins;
    const totalMinutesAgg = Number(stats.totalMinutes) || 0;
    return {
      profileMeditationMinutes: totalCat <= 0 ? totalMinutesAgg : medMins,
      profileSoundMinutes: soundMins,
    };
  }, [sessionHistoryList, stats.totalMinutes, stats.sessionsPlayed]);

  const emotionalLandscape = useMemo(
    () => buildEmotionalLandscapeAnalytics(sessionHistoryList, weeklyMinutes, stats.streak ?? 0),
    [sessionHistoryList, weeklyMinutes, stats.streak]
  );

  const sessionHistoryLenRef = useRef(0);
  useEffect(() => {
    const len = sessionHistoryList.length;
    const win = emotionalLandscape.sessionsInWindow;
    if (win === 0) {
      sessionHistoryLenRef.current = len;
      return;
    }
    const mood = availableMoods.find((m) => m.label === emotionalLandscape.dominantLabel);
    if (!mood) return;
    const prevLen = sessionHistoryLenRef.current;
    if (prevLen === 0 || len > prevLen) {
      setSelectedMood(mood);
    }
    sessionHistoryLenRef.current = len;
  }, [
    sessionHistoryList.length,
    emotionalLandscape.dominantLabel,
    emotionalLandscape.sessionsInWindow,
  ]);

  const triggerPngDownload = (canvas: HTMLCanvasElement, filename: string) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          return;
        }
        try {
          const link = document.createElement("a");
          link.download = filename;
          link.href = canvas.toDataURL("image/png");
          document.body.appendChild(link);
          link.click();
          link.remove();
        } catch {
          /* ignore */
        }
      },
      "image/png",
      1
    );
  };

  const handleDownload = async () => {
    const element = chartRef.current || profileRef.current;
    if (!element) return;
    try {
      if ("fonts" in document) {
        await (document as Document & { fonts: FontFaceSet }).fonts.ready;
      }
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#F0FDF4",
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY,
      });
      triggerPngDownload(canvas, `nirvaha-practice-report-${new Date().toISOString().slice(0, 10)}.png`);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const shareBtnRef = useRef<HTMLButtonElement>(null);
  const [shareBurst, setShareBurst] = useState(false);

  const handleShare = () => {
    setShareBurst(true);
    setTimeout(() => {
      setShareBurst(false);
      setIsShareModalOpen(true);
    }, 600);
  };

  useEffect(() => {
    if (!user?.id) {
      setProfileData(null);
      return;
    }
    setProfileData(null); // Reset immediately on user change to prevent previous user data leak

    const loadProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const profRes = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/users/profile?userId=${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (profRes.ok) {
          const data = await profRes.json();
          const fetchedUser = data.user || data;
          setProfileData(fetchedUser);
          setCurrentUser(fetchedUser);
          localStorage.setItem("user", JSON.stringify(fetchedUser));
          const histLen = Array.isArray(fetchedUser.sessionHistory) ? fetchedUser.sessionHistory.length : 0;
          if (histLen === 0 && fetchedUser.currentMood) {
            const mood = availableMoods.find((m) => m.label === fetchedUser.currentMood);
            if (mood) setSelectedMood(mood);
          }
        }
      } catch (e) { console.error('👤 Profile: Load failed', e); }
    };

    const doDailyCheckin = async () => {
      const token = localStorage.getItem('token');
      try {
        await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/profile/daily-checkin`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ userId: user.id })
        });
      } catch (e) { console.error('Daily checkin failed', e); }
    };

    loadProfile();
    doDailyCheckin();
  }, [user?.id]);

  // Handle Mood Update
  const handleMoodSelect = async (mood: any) => {
    setSelectedMood(mood);
    const token = localStorage.getItem('token');
    const uid = user?.id;
    if (!uid) return;
    try {
      await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/profile/mood`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ userId: uid, mood: mood.label })
      });
    } catch (err) { console.error("Mood update failed:", err); }
  };

  // Socket listener for real-time updates
  useEffect(() => {
    if (!socket) return;
    
    const handleUpdate = async (data: any) => {
      if (data.userId === user?.id) {
        setProfileData((prev: any) => ({
          ...(prev || {}),
          stats: data.stats,
          sessionHistory: data.sessionHistory
        }));
        void refreshProfile();
      }
    };

    socket.on("profile_updated", handleUpdate);
    return () => { socket.off("profile_updated", handleUpdate); };
  }, [socket, user?.id, refreshProfile]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-green-100 flex flex-col gap-1"
        >
          <p className="text-xs font-black text-green-600 uppercase tracking-[0.15em]">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#1B4332]">{payload[0].value}</span>
            <span className="text-sm font-bold text-gray-500">mins</span>
          </div>
          <p className="text-xs text-gray-500 font-medium">Minutes this day</p>
        </motion.div>
      );
    }
    return null;
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/20 to-gray-50/20 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6" ref={profileRef}>
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-[40px] p-10 shadow-2xl border border-white/40 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#2D6A4F]/5 rounded-full blur-2xl -ml-24 -mb-24" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-10">
              <motion.div whileHover={{ scale: 1.05 }} style={{ boxShadow: "0 20px 60px rgba(45, 106, 79, 0.35)" }}>
                <InitialsAvatar
                  name={user?.name || profileData?.name || "Guest"}
                  size="profile"
                  className="shadow-2xl"
                />
              </motion.div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-[#1B4332] mb-2 font-black tracking-tight">{user?.name || profileData?.name || "Gayar Sathvika"}</h1>
                    <p className="text-[#2D6A4F] font-medium mb-4 italic">🌿 “You’re building consistency — keep going.”</p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-sm text-[#1B4332]/70 font-semibold bg-white/40 px-3 py-1.5 rounded-full border border-white/50">
                        <Mail className="w-4 h-4" />
                        {user?.email || "user@example.com"}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#1B4332]/70 font-semibold bg-white/40 px-3 py-1.5 rounded-full border border-white/50">
                        <MapPin className="w-4 h-4" />
                        {displayLocation}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                      {/* As a Companion toggle — TEMPORARILY rendered unconditionally for verification */}
                      <CompanionModeSwitch />

                    <div className="relative">
                      {/* Burst rings on click */}
                      <AnimatePresence>
                        {shareBurst && [0,1,2].map(i => (
                          <motion.div key={i}
                            initial={{ scale: 0.5, opacity: 0.8 }}
                            animate={{ scale: 3 + i, opacity: 0 }}
                            exit={{}}
                            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                            className="absolute inset-0 rounded-2xl border-2 border-[#52B788] pointer-events-none"
                          />
                        ))}
                        {shareBurst && Array.from({length: 16}).map((_, i) => (
                          <motion.div key={`sp-${i}`}
                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                            animate={{
                              x: Math.cos((i/16)*Math.PI*2) * (50 + Math.random()*30),
                              y: Math.sin((i/16)*Math.PI*2) * (50 + Math.random()*30),
                              opacity: 0, scale: 0
                            }}
                            transition={{ duration: 0.55, delay: i*0.02, ease: "easeOut" }}
                            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full pointer-events-none"
                            style={{ background: ["#52B788","#2D6A4F","#74C69D","#95D5B2"][i%4] }}
                          />
                        ))}
                      </AnimatePresence>
                      <motion.button
                        ref={shareBtnRef}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={handleShare}
                        disabled={shareBurst}
                        className="relative px-6 py-3 bg-[#1B4332] text-white rounded-2xl shadow-lg flex items-center gap-2 font-bold transition-all"
                      >
                        <motion.div animate={shareBurst ? { rotate: 360, scale: 1.3 } : { rotate: 0, scale: 1 }} transition={{ duration: 0.5 }}>
                          <Share2 className="w-5 h-5" />
                        </motion.div>
                        Share
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 mt-6">
                  <div className="bg-white/60 backdrop-blur-md rounded-3xl p-5 border border-white/60 shadow-sm text-center">
                    <div className="text-3xl font-black text-[#1B4332] mb-0.5 tracking-tighter">{profileMeditationMinutes}</div>
                    <div className="text-[10px] text-[#2D6A4F] font-black uppercase tracking-widest">Meditation mins</div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 border border-[#95D5B2]/50 shadow-sm text-center ring-1 ring-[#52B788]/15">
                    <div className="text-3xl font-black text-[#1B4332] mb-0.5 tracking-tighter">{profileSoundMinutes}</div>
                    <div className="text-[10px] text-[#2D6A4F] font-black uppercase tracking-widest">Sound healing mins</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-md rounded-3xl p-5 border border-white/60 shadow-sm text-center">
                    <div className="text-3xl font-black text-[#1B4332] mb-0.5 tracking-tighter">{stats.streak ?? 0}</div>
                    <div className="text-[10px] text-[#2D6A4F] font-black uppercase tracking-widest">Day Streak</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-md rounded-3xl p-5 border border-white/60 shadow-sm text-center">
                    <div className="text-3xl font-black text-[#1B4332] mb-0.5 tracking-tighter">{stats.sessionsPlayed ?? 0}</div>
                    <div className="text-[10px] text-[#2D6A4F] font-black uppercase tracking-widest">Total Sessions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>



        {/* Dashboard Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Streak Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -8 }}
            className="bg-white rounded-[32px] p-6 shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden group transition-all"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#f0fdf4] flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#16a34a]" />
                </div>
              </div>
              <h4 className="text-[#0f172a] font-semibold mb-1">Meditation Streak</h4>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-5xl font-bold text-[#1B4332]"><StatCounter value={stats.streak || 0} /></span>
                <span className="text-xl text-[#6b7280]">days</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#52B788]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, ((stats.streak || 0) / 30) * 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <p className="text-xs text-[#6b7280] mt-2">Goal: 30 days • Best streak: {stats.streak ?? 0}</p>
            </div>
          </motion.div>

          {/* Today's Practice Time Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="bg-white/80 backdrop-blur-xl rounded-[32px] p-6 shadow-xl border border-gray-200/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#f0fdf4] flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#16a34a]" />
              </div>
              <TrendingUp className="w-6 h-6 text-[#16a34a]/40" />
            </div>
            <h5 className="text-gray-800 mb-1">Practice Time (today)</h5>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-bold text-[#1B4332]"><StatCounter value={Number(todayPracticeTime) || 0} /></span>
              <span className="text-xl text-[#6b7280]">mins</span>
            </div>
            <p className="text-sm text-[#6b7280]">Today's mindfulness journey</p>
          </motion.div>

          {/* Today's Sessions Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -8 }}
            className="bg-white/80 backdrop-blur-xl rounded-[32px] p-6 shadow-xl border border-gray-200/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#f0fdf4] flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[#16a34a]" />
              </div>
              <div className="px-3 py-1 bg-green-100 rounded-full text-xs text-green-700 font-bold">
                +{stats.sessionsPlayed || 0}
              </div>
            </div>
            <h5 className="text-gray-800 mb-1">Total Sessions</h5>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-bold text-[#1B4332]"><StatCounter value={stats.sessionsPlayed || 0} /></span>
              <span className="text-xl text-[#6b7280]">completed</span>
            </div>
            <p className="text-sm text-[#6b7280]">All-time wellness sessions</p>
          </motion.div>

          {/* Wellness Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-gradient-to-br from-[#A8E6CF] to-[#56AB91] rounded-[32px] p-7 shadow-2xl shadow-[#56AB91]/30 text-white overflow-hidden relative border-4 border-white/20"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-6">
                <Brain className="w-10 h-10" />
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30">
                  <span className="text-2xl font-black"><StatCounter value={stats.wellnessScore || 0} /></span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full w-fit">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <p className="text-xs font-bold">Elite Consistency</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid — natural heights; chart has fixed vertical space */}
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
          {/* Mood Sphere - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ y: -2 }}
            className="relative flex flex-col gap-3 rounded-2xl border border-emerald-100/70 bg-gradient-to-b from-white via-[#fbfffc] to-[#f4fbf7] p-4 sm:p-5 shadow-[0_12px_36px_-20px_rgba(15,81,50,0.14)] overflow-hidden"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-200/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-14 -left-8 h-32 w-32 rounded-full bg-teal-100/25 blur-2xl" />

            {/* Header */}
            <div className="relative z-10 flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <h3 className="text-[#0f2f22] text-base sm:text-lg font-bold tracking-tight">Emotional Landscape</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-snug max-w-[24rem]">
                  {emotionalLandscape.sessionsInWindow > 0
                    ? `Your last ${emotionalLandscape.sessionsInWindow} session${emotionalLandscape.sessionsInWindow === 1 ? "" : "s"} (90 days), weighted by time.`
                    : "Log meditations or sound sessions to see your mood mix here."}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800 shadow-sm">
                    {(Number(stats.streak) || 0) > 0 ? `🔥 ${Number(stats.streak) || 0} day streak` : "Start a streak"}
                  </span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setIsGoodDay(!isGoodDay)}
                className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all ${
                  isGoodDay
                    ? "border-emerald-600 bg-emerald-700 text-white shadow-md"
                    : "border-emerald-100 bg-white text-emerald-600 shadow-sm hover:bg-emerald-50"
                }`}
                aria-label="Mark a good day"
              >
                <Heart className={`h-4 w-4 ${isGoodDay ? "fill-current" : ""}`} />
              </motion.button>
            </div>

            {/* Hero: preview + leading tone */}
            <div className="relative z-10 flex flex-col items-center gap-2.5 sm:flex-row sm:items-center sm:justify-center sm:gap-4 py-0">
              <motion.div
                key={selectedMood.label}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className={`relative flex h-[5.5rem] w-[5.5rem] sm:h-24 sm:w-24 flex-col items-center justify-center rounded-full bg-gradient-to-br ${selectedMood.color} text-white shadow-[0_8px_28px_-6px_rgba(27,67,50,0.4)] ring-2 ring-white/90 ${
                  emotionalLandscape.sessionsInWindow > 0 && emotionalLandscape.dominantLabel === selectedMood.label
                    ? "ring-offset-1 ring-offset-[#f4fbf7] ring-emerald-300/80"
                    : ""
                }`}
              >
                <selectedMood.icon className="h-7 w-7 opacity-95 drop-shadow-sm" />
                <span className="mt-0.5 text-[10px] font-bold tracking-wide text-white/95">{selectedMood.label}</span>
              </motion.div>
              {emotionalLandscape.sessionsInWindow > 0 ? (
                <div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-0.5">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-600/80">Leading tone</span>
                  <p className="text-lg sm:text-xl font-bold tracking-tight text-[#143d32]">
                    {emotionalLandscape.dominantLabel}
                    <span className="ml-1.5 text-base font-semibold text-emerald-700">
                      {emotionalLandscape.percentages[emotionalLandscape.dominantLabel]}%
                    </span>
                  </p>
                  <p className="max-w-[13rem] text-[10px] leading-snug text-slate-500">
                    Tap a mood below. Check-in saves to your profile.
                  </p>
                </div>
              ) : (
                <p className="max-w-xs text-center text-xs text-slate-500 sm:text-left">Practice once to unlock your landscape.</p>
              )}
            </div>

            {/* Week rhythm */}
            <div className="relative z-10 rounded-xl border border-emerald-100/60 bg-white/70 px-3 py-2 backdrop-blur-sm">
              <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-400">This week</p>
              <div className="flex h-10 items-end justify-center gap-1 sm:gap-1.5">
                {(() => {
                  const maxLevel = Math.max(...moodHistory.map((m) => m.level), 1);
                  return moodHistory.map((item, i) => {
                    const barHeight = Math.max(4, (item.level / maxLevel) * 32);
                    return (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: barHeight }}
                          transition={{ duration: 0.65, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                          className="w-2 sm:w-2.5 rounded-full bg-gradient-to-t from-emerald-800 to-emerald-400 opacity-90"
                          style={{ height: barHeight }}
                        />
                        <span className="text-[9px] font-semibold text-slate-400">{item.day}</span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Consistency */}
            <div className="relative z-10 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <span className="text-xs font-semibold text-slate-700">Consistency</span>
                <motion.span
                  key={emotionalLandscape.emotionalConsistencyScore}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-bold tabular-nums text-emerald-800"
                >
                  {emotionalLandscape.emotionalConsistencyScore}%
                </motion.span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${emotionalLandscape.emotionalConsistencyScore}%` }}
                  transition={{ duration: 1.1, delay: 0.2, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-700"
                />
              </div>
              <p className="mt-1.5 text-[10px] leading-snug text-slate-500">
                <span className="font-semibold text-slate-600">Mix:</span>{" "}
                {emotionalLandscape.dominantLabel} ({emotionalLandscape.percentages[emotionalLandscape.dominantLabel]}%)
                {selectedMood.label !== emotionalLandscape.dominantLabel && (
                  <>
                    {" "}
                    <span className="text-slate-300">·</span> viewing {selectedMood.label} (
                    {emotionalLandscape.percentages[selectedMood.label as EmotionalMoodLabel]}%)
                  </>
                )}
                <span className="text-slate-300"> · </span>
                <span className="font-semibold text-slate-600">Best day:</span> {mostActiveEmotionalDay}
              </p>
            </div>

            {/* Mood chips */}
            <div className="relative z-10 grid grid-cols-5 gap-1 sm:gap-1.5">
              {availableMoods.map((mood, i) => {
                const pct = emotionalLandscape.percentages[mood.label as EmotionalMoodLabel];
                const isDominant = emotionalLandscape.dominantLabel === mood.label;
                const isSelected = selectedMood.label === mood.label;
                return (
                  <motion.button
                    key={mood.label}
                    type="button"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.04 }}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMoodSelect(mood)}
                    title={`${mood.label}: ${pct}% of recent practice`}
                    className={`relative flex min-h-[4.25rem] flex-col items-center justify-center gap-0.5 rounded-xl border px-1 py-1.5 text-center transition-all ${
                      isSelected
                        ? "border-transparent bg-gradient-to-br from-[#1B4332] to-[#2d6a4f] text-white shadow-md shadow-emerald-900/12"
                        : isDominant
                          ? "border-emerald-200/90 bg-emerald-50/90 text-[#143d32] shadow-sm"
                          : "border-slate-100 bg-white/90 text-slate-700 shadow-sm hover:border-emerald-200 hover:bg-emerald-50/40"
                    } ${isDominant && !isSelected ? "pl-2 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:rounded-full before:bg-emerald-500 before:content-['']" : ""}`}
                  >
                    {isDominant && emotionalLandscape.sessionsInWindow > 0 && !isSelected && (
                      <span className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.25)]" aria-hidden />
                    )}
                    <mood.icon
                      className={`h-4 w-4 ${isSelected ? "text-white" : isDominant ? "text-emerald-700" : "text-emerald-600/70"}`}
                    />
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wide leading-tight ${isSelected ? "text-white/95" : "text-slate-700"}`}
                    >
                      {mood.label}
                    </span>
                    <motion.span
                      key={`${emotionalLandscape.moodMixFingerprint}-${mood.label}-${pct}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`text-[10px] font-bold tabular-nums ${isSelected ? "text-emerald-100" : "text-emerald-800/90"}`}
                    >
                      {pct}%
                    </motion.span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Weekly Activity Chart — beside Emotional Landscape */}
          <motion.div
          ref={chartRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          whileHover={{ y: -2 }}
          className="relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-lg"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-full blur-2xl opacity-35 pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 shrink-0">
            <h3 className="text-base font-black tracking-tight text-[#1B4332] sm:text-lg">Weekly Practice Flow</h3>
            <p className="mt-0.5 text-xs font-medium leading-snug text-[#2D6A4F]/80">Minutes per day. Left numbers are minutes (0–{weeklyChartYMax}).</p>
          </div>

          {/* Fixed chart height: bars are not overstretched; Y ticks stay in view */}
          <div className="relative z-10 h-72 w-full rounded-xl border border-gray-50 bg-white/60 px-2 pb-1 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 8, right: 8, left: 4, bottom: 6 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#52B788" />
                    <stop offset="100%" stopColor="#2D6A4F" />
                  </linearGradient>
                  <linearGradient id="activeBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#74C69D" />
                    <stop offset="100%" stopColor="#1B4332" />
                  </linearGradient>
                  <linearGradient id="emptyBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d1fae5" />
                    <stop offset="100%" stopColor="#a7f3d0" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(45,106,79,0.06)" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#1B4332", fontSize: 12, fontWeight: 700 }}
                  dy={8}
                />
                <YAxis
                  domain={[0, weeklyChartYMax]}
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  width={46}
                  tick={{ fill: "#2D6A4F", fontSize: 12, fontWeight: 600 }}
                  tickMargin={8}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(45, 106, 79, 0.05)', radius: 16 }}
                />
                <Bar
                  dataKey="minutes"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                  barSize={18}
                  animationDuration={900}
                  animationBegin={120}
                  minPointSize={2}
                >
                  {weeklyData.map((entry, index) => {
                    const isToday = index === (new Date().getDay() + 6) % 7;
                    const isEmpty = entry.minutes === 0;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={isEmpty ? 'url(#emptyBarGradient)' : isToday ? 'url(#activeBarGradient)' : 'url(#barGradient)'}
                        style={{ filter: isToday && !isEmpty ? 'drop-shadow(0 0 8px rgba(45,106,79,0.35))' : 'none', opacity: isEmpty ? 0.35 : 1 }}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Wellness Insights */}
          <div className="relative z-10 shrink-0 rounded-xl border border-green-100 bg-gradient-to-r from-[#f0fdf4] to-[#dcfce7] p-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-[#2D6A4F]" />
              <span className="text-xs font-black uppercase tracking-wide text-[#2D6A4F]">Insights</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {totalWeeklyMinutes === 0 ? (
                <p className="col-span-3 text-xs font-medium leading-snug text-[#2D6A4F]/80">Start a session to see insights.</p>
              ) : (
                [
                  totalWeeklyMinutes >= 60 ? `${totalWeeklyMinutes} mins — great!` : `${totalWeeklyMinutes} mins this week`,
                  mostActiveDay !== 'No activity yet' ? `Best: ${mostActiveDay}` : 'Log time for best day',
                  (stats.streak ?? 0) >= 3 ? `${stats.streak}d streak 🔥` : averageDailyMinutes >= 10 ? `~${averageDailyMinutes}m/day` : 'Daily = streak',
                ].map((text, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.08 }}
                    className="rounded-lg bg-white/90 px-2 py-2 text-xs font-semibold leading-snug text-[#1B4332]">
                    {text}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
        </div>

        {/* Quote of the Day — above Account Settings / Subscription */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 1.15, ease: "easeOut" }}
          className="mt-8 mb-8 rounded-[28px] border border-emerald-100/90 bg-gradient-to-br from-[#f9fdfb] via-[#f0fdf4] to-[#ecfdf5] px-6 py-6 md:px-8 md:py-7 shadow-[0_14px_44px_rgba(27,67,50,0.07)]"
        >
          <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-[#2D6A4F]/65 mb-2">
            Daily mindfulness reflection
          </p>
          <h3 className="text-[#1B4332] font-black text-lg md:text-xl tracking-tight mb-4">
            Quote of the Day
          </h3>
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={dailyQuote.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="m-0 pl-4 border-l-2 border-[#52B788]/45 text-[#234e3c] text-base md:text-lg font-medium leading-relaxed"
            >
              <span className="italic">&ldquo;{dailyQuote.quote}&rdquo;</span>
            </motion.blockquote>
          </AnimatePresence>
          <p className="mt-4 text-xs text-[#2D6A4F]/55 font-medium">
            Today&apos;s calm thought
          </p>
          {/* My Sessions section removed: functionality moved to CompanionPage */}
        </motion.section>

        {/* Recommended For You Section */}
        {/* Settings Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Account Settings */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="bg-white/80 backdrop-blur-xl rounded-[32px] p-6 shadow-xl border border-gray-200/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#f0fdf4] rounded-2xl flex items-center justify-center border border-[#dcfce7]">
                <Settings className="w-6 h-6 text-[#16a34a]" />
              </div>
              <h4 className="text-gray-800">Account Settings</h4>
            </div>

            <div className="space-y-4">
              <motion.button
                onClick={() => setIsSettingsOpen(true)}
                whileHover={{ x: 4 }}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800">Preferences & Settings</span>
                </div>
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>

              <motion.button
                onClick={() => setIsNotificationsOpen(true)}
                whileHover={{ x: 4 }}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800">Notifications</span>
                </div>
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>

              <motion.button
                onClick={() => setIsPrivacyOpen(true)}
                whileHover={{ x: 4 }}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800">Privacy & Security</span>
                </div>
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
            </div>
          </motion.div>

          {/* Subscription */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] rounded-[32px] p-6 shadow-xl text-white"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white">Subscription</h4>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-100 text-sm mb-2">Current Plan</p>
                <p className="text-2xl text-white mb-1">Premium Annual</p>
                <p className="text-gray-100 text-sm">Renews on Jan 15, 2025</p>
              </div>

              <div className="h-px bg-white/20 my-4" />

              <div className="flex items-center justify-between">
                <span className="text-gray-100">Next billing</span>
                <span className="text-white">$99.99</span>
              </div>

              <motion.button
                onClick={() => {
                  alert("Redirecting to Subscription Management...");
                  // window.location.href = "/subscription"; // ready for real backend routing later
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-white/20 backdrop-blur-xl text-white rounded-2xl hover:bg-white/30 transition-all mt-4"
              >
                Manage Subscription
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* ── Approved Companion Bookings Section ── */}
        <AnimatePresence>
          {isCompanionModeEnabled && isUserApprovedCompanion && (
            <motion.section
              key="companion-bookings"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="mt-10"
            >
              {/* Section header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] rounded-2xl flex items-center justify-center shadow-md">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[#1B4332] font-black text-xl tracking-tight">Your Approved Bookings</h3>
                  <p className="text-[#2D6A4F]/70 text-sm font-medium">Sessions confirmed by admin for you to host</p>
                </div>
                <motion.button
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.35 }}
                  onClick={fetchCompanionBookings}
                  className="ml-auto p-2 rounded-xl bg-[#f0fdf4] border border-emerald-100 text-[#2D6A4F] hover:bg-emerald-50 transition-colors"
                  title="Refresh bookings"
                >
                  <Loader2
                    className={`w-4 h-4 ${
                      companionBookingsLoading ? 'animate-spin' : ''
                    }`}
                  />
                </motion.button>
              </div>

              {/* Loading state */}
              {companionBookingsLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#52B788] animate-spin" />
                  <span className="ml-3 text-[#2D6A4F] font-medium">Loading your bookings…</span>
                </div>
              )}

              {/* Empty state */}
              {!companionBookingsLoading && companionBookings.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-[28px] border border-emerald-100/80 bg-gradient-to-br from-[#f9fdfb] via-[#f0fdf4] to-[#ecfdf5] px-8 py-12 text-center shadow-sm"
                >
                  <CalendarIcon className="w-12 h-12 text-[#52B788]/50 mx-auto mb-4" />
                  <p className="text-[#1B4332] font-bold text-lg mb-1">No approved sessions yet.</p>
                  <p className="text-[#2D6A4F]/60 text-sm">
                    Once a user books a session and admin confirms it for you, it will appear here.
                  </p>
                </motion.div>
              )}

              {/* Booking cards */}
              {!companionBookingsLoading && companionBookings.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {companionBookings.map((booking: any, idx: number) => {
                    const bookingId = booking.id || booking._id;
                    const isCompleted = booking.status === 'Completed';
                    const isMarkingThis = markingCompleted === bookingId;

                    return (
                      <motion.div
                        key={bookingId || idx}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.06, duration: 0.35 }}
                        className={`relative rounded-[24px] border ${
                          isCompleted
                            ? 'border-emerald-200 bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7]'
                            : 'border-emerald-100 bg-white'
                        } p-5 shadow-md hover:shadow-lg transition-shadow overflow-hidden`}
                      >
                        {/* Status badge */}
                        <span
                          className={`absolute top-4 right-4 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {isCompleted ? 'Completed' : booking.status}
                        </span>

                        {/* Companion name (the guide) */}
                        <p className="text-[#1B4332] font-black text-base mb-3 pr-20 leading-tight">
                          {booking.companionName || user?.name || '—'}
                        </p>

                        {/* Session info */}
                        <div className="space-y-1.5 mb-4">
                          <div className="flex items-center gap-2">
                            <ClipboardList className="w-3.5 h-3.5 text-[#52B788] shrink-0" />
                            <span className="text-[#1B4332] text-sm font-semibold truncate">
                              {booking.sessionType || booking.type || 'Session'}
                            </span>
                          </div>
                          {booking.date && (
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-3.5 h-3.5 text-[#52B788] shrink-0" />
                              <span className="text-[#2D6A4F]/80 text-sm font-medium">{booking.date}</span>
                            </div>
                          )}
                          {booking.time && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-[#52B788] shrink-0" />
                              <span className="text-[#2D6A4F]/80 text-sm font-medium">{booking.time}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-[#52B788] shrink-0" />
                            <span className="text-[#2D6A4F]/80 text-sm font-semibold">
                              User: {booking.userName || booking.userEmail || booking.email || 'User'}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        {!isCompleted && (
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => alert('Join Session link will be provided by admin or via your meeting platform.')}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-[#2D6A4F] to-[#1B4332] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                            >
                              <Video className="w-3.5 h-3.5" />
                              Join Session
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              disabled={isMarkingThis}
                              onClick={() => handleMarkCompleted(bookingId)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-all disabled:opacity-60"
                            >
                              {isMarkingThis ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                              Mark Completed
                            </motion.button>
                          </div>
                        )}

                        {isCompleted && (
                          <div className="flex items-center gap-2 text-emerald-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-bold">Session completed</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Settings & Preferences Modals */}
      <AnimatePresence>
        {/* Account Settings (Preferences) Modal */}
        {isSettingsOpen && (
          <div className="fixed inset-0 bg-black/65 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: "spring", duration: 0.45 }}
              className="bg-white rounded-[32px] p-8 shadow-2xl border border-emerald-100/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-8 border-b border-emerald-100/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100/50">
                    <Settings className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#1B4332] tracking-tight">{t("settings.accountPreferences")}</h3>
                    <p className="text-xs text-teal-600 font-medium">Manage theme, language, and system controls</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Theme & Language */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-emerald-50/20 p-6 rounded-3xl border border-emerald-100/20">
                  {/* Theme */}
                  <div>
                    <label className="block">
                      <p className="text-[#1B4332] font-bold text-sm mb-1.5">{t("settings.themeMode")}</p>
                      <p className="text-gray-500 text-xs mb-3">Adjust the visual style of your workspace</p>
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold text-sm cursor-pointer"
                      value={settings.theme}
                      onChange={(e) => void setTheme(e.target.value as ThemeMode)}
                    >
                      <option value="light">☀️ Light Theme</option>
                      <option value="dark">🌙 Dark Theme</option>
                      <option value="system">🖥️ System Default</option>
                    </select>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block">
                      <p className="text-[#1B4332] font-bold text-sm mb-1.5">{t("settings.appLanguage")}</p>
                      <p className="text-gray-500 text-xs mb-3">Choose your preferred display language</p>
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold text-sm cursor-pointer"
                      value={settings.language}
                      onChange={(e) => void setLanguage(e.target.value as AppLanguage)}
                    >
                      <option value="en">🇺🇸 English</option>
                      <option value="hi">🇮🇳 Hindi (हिन्दी)</option>
                      <option value="te">🇮🇳 Telugu (తెలుగు)</option>
                      <option value="kn">🇮🇳 Kannada (ಕನ್ನಡ)</option>
                    </select>
                  </div>
                </div>

                {/* Account Details Quick View */}
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4">
                  <InitialsAvatar name={user?.name || "Guest"} size="lg" />
                  <div>
                    <p className="text-[#1B4332] font-black text-base">{user?.name || "Guest"}</p>
                    <p className="text-xs text-gray-500 font-semibold truncate">{user?.email || "No email registered"}</p>
                  </div>
                  <span className="ml-auto px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full tracking-wider">
                    {user?.role || "User"}
                  </span>
                </div>

                {/* Save & Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-emerald-100/40">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => showSaveFeedback(t("settings.saved"))}
                    disabled={isSavingSettings}
                    className="flex-1 py-3 bg-[#2D6A4F] text-white rounded-2xl shadow-lg shadow-emerald-900/10 hover:bg-[#1B4332] transition-colors font-bold text-sm disabled:opacity-60"
                  >
                    {isSavingSettings ? t("common.loading") : t("settings.savePreferences")}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsSettingsOpen(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-2xl hover:bg-gray-200 transition-colors font-bold text-sm"
                  >
                    Cancel
                  </motion.button>
                </div>

                {saveMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-center text-sm font-bold rounded-xl"
                  >
                    {saveMessage}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Notifications Modal */}
        {isNotificationsOpen && (
          <div className="fixed inset-0 bg-black/65 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: "spring", duration: 0.45 }}
              className="bg-white rounded-[32px] p-8 shadow-2xl border border-emerald-100/50 max-w-xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-8 border-b border-emerald-100/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100/50">
                    <Bell className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#1B4332] tracking-tight">{t("settings.notifications")}</h3>
                    <p className="text-xs text-teal-600 font-medium">Control what alerts and reminders you receive</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Toggles Container */}
              <div className="space-y-4">
                <div className="bg-emerald-50/20 p-2 rounded-[28px] border border-emerald-100/25 space-y-1">
                  
                  {/* Toggle 1: Community Posts */}
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-emerald-100/10 hover:shadow-md transition-shadow">
                    <div className="flex-1 pr-4">
                      <p className="text-[#1B4332] font-bold text-sm mb-0.5">Community post notifications</p>
                      <p className="text-gray-500 text-[11px] leading-relaxed">Alerts when community members post new content or updates</p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={settings.notifications.communityPosts}
                      onClick={() => void setNotificationToggle("communityPosts", !settings.notifications.communityPosts)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                        settings.notifications.communityPosts ? "bg-[#2D6A4F] border-[#2D6A4F]" : "bg-gray-200 border-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out ${
                          settings.notifications.communityPosts ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle 2: Likes & Comments */}
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-emerald-100/10 hover:shadow-md transition-shadow">
                    <div className="flex-1 pr-4">
                      <p className="text-[#1B4332] font-bold text-sm mb-0.5">Likes & comments notifications</p>
                      <p className="text-gray-500 text-[11px] leading-relaxed">Instantly know when someone likes or comments on your posts</p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={settings.notifications.likesComments}
                      onClick={() => void setNotificationToggle("likesComments", !settings.notifications.likesComments)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                        settings.notifications.likesComments ? "bg-[#2D6A4F] border-[#2D6A4F]" : "bg-gray-200 border-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out ${
                          settings.notifications.likesComments ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle 3: Mentor/Community Reply */}
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-emerald-100/10 hover:shadow-md transition-shadow">
                    <div className="flex-1 pr-4">
                      <p className="text-[#1B4332] font-bold text-sm mb-0.5">Mentor & community replies</p>
                      <p className="text-gray-500 text-[11px] leading-relaxed">Get notified when a mentor or member replies directly to you</p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={settings.notifications.mentorReplies}
                      onClick={() => void setNotificationToggle("mentorReplies", !settings.notifications.mentorReplies)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                        settings.notifications.mentorReplies ? "bg-[#2D6A4F] border-[#2D6A4F]" : "bg-gray-200 border-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out ${
                          settings.notifications.mentorReplies ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle 4: Daily Wellness Reminders */}
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-emerald-100/10 hover:shadow-md transition-shadow">
                    <div className="flex-1 pr-4">
                      <p className="text-[#1B4332] font-bold text-sm mb-0.5">Daily wellness reminders</p>
                      <p className="text-gray-500 text-[11px] leading-relaxed">Daily calm thought, breathing prompts, and mindful check-ins</p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={settings.notifications.dailyWellness}
                      onClick={() => void setNotificationToggle("dailyWellness", !settings.notifications.dailyWellness)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                        settings.notifications.dailyWellness ? "bg-[#2D6A4F] border-[#2D6A4F]" : "bg-gray-200 border-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out ${
                          settings.notifications.dailyWellness ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle 5: Sound & Vibration Toggle */}
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-emerald-100/10 hover:shadow-md transition-shadow">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4 text-emerald-600" />
                        <p className="text-[#1B4332] font-bold text-sm">Sound & vibration toggle</p>
                      </div>
                      <p className="text-gray-500 text-[11px] leading-relaxed">Play gentle notification bells and soft device haptics</p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={settings.notifications.soundVibration}
                      onClick={() => void setNotificationToggle("soundVibration", !settings.notifications.soundVibration)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                        settings.notifications.soundVibration ? "bg-[#2D6A4F] border-[#2D6A4F]" : "bg-gray-200 border-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out ${
                          settings.notifications.soundVibration ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                </div>

                {/* Footer Buttons */}
                <div className="flex gap-4 pt-4 border-t border-emerald-100/40 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => showSaveFeedback(t("settings.notificationsSaved"))}
                    disabled={isSavingSettings}
                    className="flex-1 py-3 bg-[#2D6A4F] text-white rounded-2xl shadow-lg shadow-emerald-900/10 hover:bg-[#1B4332] transition-colors font-bold text-sm disabled:opacity-60"
                  >
                    {isSavingSettings ? t("common.loading") : t("common.save")}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsNotificationsOpen(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-2xl hover:bg-gray-200 transition-colors font-bold text-sm"
                  >
                    Close
                  </motion.button>
                </div>

                {saveMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-center text-sm font-bold rounded-xl"
                  >
                    {saveMessage}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Privacy & Security Modal */}
        {isPrivacyOpen && (
          <div className="fixed inset-0 bg-black/65 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: "spring", duration: 0.45 }}
              className="bg-white rounded-[32px] p-8 shadow-2xl border border-emerald-100/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6 border-b border-emerald-100/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100/50">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#1B4332] tracking-tight">{t("settings.privacySecurity")}</h3>
                    <p className="text-xs text-teal-600 font-medium">Protect your personal data and account access</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPrivacyOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-6">
                
                {/* ── Privacy Settings Section ── */}
                <div className="bg-emerald-50/20 p-6 rounded-3xl border border-emerald-100/25">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[#1B4332] font-extrabold text-sm uppercase tracking-wider">Privacy Settings</h4>
                    {/* Settings Shortcut Link */}
                    <button
                      onClick={() => {
                        setIsPrivacyOpen(false);
                        setIsSettingsOpen(true);
                      }}
                      className="flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-extrabold bg-emerald-100/60 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-all"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Open Account Settings
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Public/Private profile toggle */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-800 font-bold text-sm">Private Profile</p>
                        <p className="text-gray-500 text-xs">Only approved friends and companions can view your stats</p>
                      </div>
                      <button
                        role="switch"
                        aria-checked={settings.privacy.privateProfile}
                        onClick={() => void setPrivacyToggle("privateProfile", !settings.privacy.privateProfile)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                          settings.privacy.privateProfile ? "bg-[#2D6A4F] border-[#2D6A4F]" : "bg-gray-200 border-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out ${
                            settings.privacy.privateProfile ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Hide activity status */}
                    <div className="flex items-center justify-between border-t border-emerald-100/10 pt-4">
                      <div>
                        <p className="text-gray-800 font-bold text-sm">Hide Activity Status</p>
                        <p className="text-gray-500 text-xs">Hide when you are actively breathing or meditating</p>
                      </div>
                      <button
                        role="switch"
                        aria-checked={settings.privacy.hideActivityStatus}
                        onClick={() => void setPrivacyToggle("hideActivityStatus", !settings.privacy.hideActivityStatus)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                          settings.privacy.hideActivityStatus ? "bg-[#2D6A4F] border-[#2D6A4F]" : "bg-gray-200 border-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out ${
                            settings.privacy.hideActivityStatus ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── Block & Report Section ── */}
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-[#1B4332] font-extrabold text-sm mb-1">Block / Report Users</h4>
                    <p className="text-gray-500 text-xs">Restrict who can see and comment on your posts</p>
                  </div>
                  <button
                    onClick={() => alert(`Blocked users registry — ${blockedUsersCount} blocked user(s).`)}
                    className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    Manage Registry ({blockedUsersCount})
                  </button>
                </div>

                {/* ── Change Password Form ── */}
                <form onSubmit={handleChangePassword} className="bg-white p-6 rounded-3xl border border-gray-200/50 space-y-4">
                  <div className="flex items-center gap-2 mb-2 border-b border-gray-100 pb-2">
                    <Key className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-[#1B4332] font-black text-sm">Change Password</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 text-xs font-bold mb-1.5">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-xs font-bold mb-1.5">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
                        placeholder="Min 6 chars"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-xs font-bold mb-1.5">Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    {passwordStatus && (
                      <p className={`text-xs font-bold ${passwordStatus.success ? "text-emerald-600" : "text-rose-600"}`}>
                        {passwordStatus.message}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="ml-auto px-4 py-2.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-60"
                    >
                      {isChangingPassword && <Loader2 className="w-3 h-3 animate-spin" />}
                      Update Password
                    </button>
                  </div>
                </form>

                {/* ── Dangerous Zone Actions ── */}
                <div className="bg-rose-50/20 p-6 rounded-3xl border border-rose-100/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Clear Chat History */}
                  <div className="bg-white p-4 rounded-2xl border border-rose-100/25 flex flex-col justify-between">
                    <div>
                      <p className="text-gray-800 font-bold text-xs mb-1">Clear AI Chat History</p>
                      <p className="text-gray-500 text-[10px] leading-relaxed mb-3">Instantly erase all message history with the AI Guide from this device</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const confirmClear = window.confirm("Are you sure you want to permanently clear all local chat history with the AI Guide?");
                        if (confirmClear) {
                          clearChatHistory(user?.id);
                          alert("AI chat history erased successfully!");
                        }
                      }}
                      className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all border border-rose-100"
                    >
                      Clear History
                    </button>
                  </div>

                  {/* Delete Account */}
                  <div className="bg-white p-4 rounded-2xl border border-rose-100/25 flex flex-col justify-between">
                    <div>
                      <p className="text-rose-800 font-bold text-xs mb-1 flex items-center gap-1">
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        Delete Account
                      </p>
                      <p className="text-gray-500 text-[10px] leading-relaxed mb-3">Permanently delete your profile, stats, streak history and bookings</p>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        const confirmDelete = window.confirm("⚠️ WARNING: Deleting your account is permanent. All your progress and data will be destroyed. Do you wish to continue?");
                        if (confirmDelete) {
                          try {
                            await deleteAccount();
                          } catch {
                            alert("Failed to delete account. Please try again or contact support.");
                          }
                        }
                      }}
                      className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md shadow-rose-900/10"
                    >
                      Delete Account
                    </button>
                  </div>

                </div>

                {/* ── Privacy Policy & Data Settings ── */}
                <div className="p-4 bg-gray-50 rounded-2xl text-[10px] text-gray-500 leading-relaxed border border-gray-100 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-teal-600/70 shrink-0" />
                  <p>
                    We protect your personal data in accordance with our <strong>Privacy Policy</strong>. We use end-to-end encryption for AI chat logs and your health records are completely private.
                  </p>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Profile Modal */}
      <ShareProfileCard
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        userName={user?.name || "Gayar Sathvika"}
        userTitle={displayBio}
        userEmail={user?.email || ""}
        userLocation={displayLocation}
        stats={{
          sessions: stats.sessionsPlayed || 0,
          streak: stats.streak || 0,
          totalTime: `${Math.round((stats.totalMinutes || 0) / 60)}hrs`,
          wellnessScore: stats.wellnessScore || 50,
          meditationMinutes: profileMeditationMinutes,
          soundMinutes: profileSoundMinutes,
        }}
      />
      <MeditationSessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        session={activeSession}
      />
    </div>
  );
}


