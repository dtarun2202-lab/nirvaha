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
} from "lucide-react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ShareProfileCard } from "./ShareProfileCard";
import { MeditationSessionModal } from "./MeditationSessionModal";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";
import { useProfileSync } from "../hooks/useProfileSync";
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
  const { user, loading: authLoading, syncUserFromServer, refreshProfile } = useAuth();
  const { socket } = useSocket();
  const { getWeeklyData, getTodayMinutes } = useProfileSync();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
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
  const [prefs, setPrefs] = useState({
    theme: "system" as "light" | "dark" | "system",
    language: "en" as "en" | "hi" | "te" | "kn",
    emailNotifications: true,
    pushNotifications: true,
    profileVisibility: "friends" as "public" | "friends" | "private",
    showOnlineStatus: true,
    dataSharing: false,
  });
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [companionBookings, setCompanionBookings] = useState<any[]>([]);
  const [activeSessionView, setActiveSessionView] = useState<'my-sessions' | 'as-companion'>('my-sessions');

  const isApprovedCompanion =
    user?.isApprovedCompanion === true ||
    user?.companionStatus === "approved";

  useEffect(() => {
    console.log("FULL USER:", user);
    console.log("logged-in email:", user?.email);
    console.log("isApprovedCompanion:", user?.isApprovedCompanion);
    console.log("companionStatus:", user?.companionStatus);
    console.log("computed isApprovedCompanion:", isApprovedCompanion);
    if (user?.email && !isApprovedCompanion) {
      console.warn(
        "[My Sessions] Switch hidden: log in with the SAME email used on the approved companion application."
      );
    }
  }, [user, isApprovedCompanion]);

  const showCompanionView = isApprovedCompanion && activeSessionView === "as-companion";

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

  const fetchCompanionSessions = useCallback(async () => {
    if (!user?.email || !isApprovedCompanion) {
      setCompanionBookings([]);
      return;
    }
    try {
      setSessionsLoading(true);
      console.log(`[PROFILE] Fetching companion sessions for ${user?.email}`);
      console.log(`  - isApprovedCompanion: ${isApprovedCompanion}`);
      console.log(`  - user._id: ${user?._id}`);
      console.log(`  - user.id: ${user?.id}`);

      const token = localStorage.getItem('token');
      const companionResponse = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/companion/sessions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!companionResponse.ok) {
        if (companionResponse.status === 403) {
          console.warn('[PROFILE] User is not an approved companion');
        } else {
          console.warn('[PROFILE] Failed to fetch companion sessions:', companionResponse.status);
        }
        setCompanionBookings([]);
        return;
      }

      const companionData = await companionResponse.json();
      console.log('[PROFILE] Companion sessions response:', companionData);
      setCompanionBookings(Array.isArray(companionData.data) ? companionData.data : []);
    } catch (error) {
      console.error('[PROFILE] Error fetching companion sessions:', error);
      setCompanionBookings([]);
    } finally {
      setSessionsLoading(false);
    }
  }, [user?.email, user?._id, isApprovedCompanion]);

  const companionSessionStats = useMemo(() => {
    const pending = companionBookings.filter((b) => {
      const s = (b.status || "").toLowerCase();
      return s.includes("pending") || s === "";
    }).length;
    const completed = companionBookings.filter(
      (b) => (b.status || "").toLowerCase() === "completed"
    ).length;
    const confirmed = companionBookings.filter(
      (b) => (b.status || "").toLowerCase() === "session confirmed"
    ).length;
    return {
      total: companionBookings.length,
      pending,
      completed,
      confirmed,
    };
  }, [companionBookings]);

  useEffect(() => {
    if (!isApprovedCompanion && activeSessionView === "as-companion") {
      setActiveSessionView("my-sessions");
    }
  }, [isApprovedCompanion, activeSessionView]);

  useEffect(() => {
    if (!socket || !user?.email) return;

    const handleBookingUpdated = (updatedBooking: any) => {
      console.log('[PROFILE-SOCKET] booking-updated event:', updatedBooking);
      
      const isUserBooking =
        (updatedBooking.userEmail && updatedBooking.userEmail.toLowerCase() === user.email.toLowerCase()) ||
        (updatedBooking.email && updatedBooking.email.toLowerCase() === user.email.toLowerCase());

      if (isUserBooking) {
        console.log('[PROFILE-SOCKET] Updating user booking:', updatedBooking.id);
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

      // Check if this is a companion session
      if (isApprovedCompanion) {
        console.log('[PROFILE-SOCKET] Checking if booking is for companion...');
        console.log(`  - companionId in booking: ${updatedBooking.companionId}`);
        console.log(`  - user._id: ${user?._id}`);
        console.log(`  - user.id: ${user?.id}`);
        
        const isCompanionBooking =
          (updatedBooking.companionId && (updatedBooking.companionId === user?._id || updatedBooking.companionId === user?.id)) ||
          (updatedBooking.companionName && user.name && updatedBooking.companionName.toLowerCase() === user.name.toLowerCase());

        if (isCompanionBooking) {
          console.log('[PROFILE-SOCKET] This is a companion session, updating companion bookings');
          setCompanionBookings((prev) => {
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
          fetchCompanionSessions();
        }
      }
    };

    socket.on("booking-updated", handleBookingUpdated);
    return () => {
      socket.off("booking-updated", handleBookingUpdated);
    };
  }, [socket, user?.email, user?.id, user?._id, user?.name, isApprovedCompanion, fetchCompanionSessions]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.email) return;
      try {
        setSessionsLoading(true);
        await fetchMySessions();

        if (isApprovedCompanion) {
          await fetchCompanionSessions();
        } else {
          console.log(`[PROFILE] Skipping companion sessions fetch - not approved`);
          setCompanionBookings([]);
        }
      } catch (error) {
        console.error("[PROFILE] Failed to load sessions:", error);
      } finally {
        setSessionsLoading(false);
      }
    };

    fetchBookings();
  }, [user?.email, user?.id, user?.name, isApprovedCompanion, activeSessionView, fetchCompanionSessions, fetchMySessions]);

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


  const getInitials = (name: string) => {
    if (!name) return "UN";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

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
          setProfileData(data);
          const histLen = Array.isArray(data.sessionHistory) ? data.sessionHistory.length : 0;
          if (histLen === 0 && data.currentMood) {
            const mood = availableMoods.find((m) => m.label === data.currentMood);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/users/profile/update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user?.id, avatar: base64 })
        });
        if (res.ok) {
          refreshProfile();
        }
      } catch (err) {
        console.error("Avatar update failed:", err);
      }
    };
    reader.readAsDataURL(file);
  };

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
              {/* Profile Avatar */}
              <div className="relative group">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-32 h-32 rounded-[32px] bg-gradient-to-br from-[#52B788] to-[#2D6A4F] flex items-center justify-center text-white shadow-2xl overflow-hidden relative"
                  style={{ boxShadow: "0 20px 60px rgba(45, 106, 79, 0.35)" }}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold tracking-tight">
                      {getInitials(user?.name || "User Name")}
                    </span>
                  )}
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#2D6A4F] rounded-2xl shadow-lg flex items-center justify-center text-white border-4 border-white z-20"
                >
                  <Edit2 className="w-5 h-5" />
                </motion.button>
              </div>

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
                  <div className="flex gap-4">
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
              <span className="text-5xl font-bold text-[#1B4332]"><StatCounter value={Number(stats.todayPracticeTime) || 0} /></span>
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
        </motion.section>

        {/* My Sessions Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 1.2, ease: "easeOut" }}
          className="mt-8 mb-8 bg-white rounded-[24px] p-6 shadow-sm border border-[#D5EEDD]"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#D5EEDD]/50">
            <div>
              <h3 className="text-xl font-bold text-[#1B4332]">My Sessions</h3>
              <p className="text-sm text-[#556B5D] mt-1">Track and manage your upcoming wellness sessions.</p>
            </div>
            {isApprovedCompanion && (
              <div
                className="relative flex shrink-0 items-center rounded-full border border-[#C3E6CC]/80 bg-[#EBF5EE]/90 p-1 shadow-[inset_0_1px_2px_rgba(27,67,50,0.06)]"
                role="tablist"
                aria-label="Session view"
              >
                <motion.div
                  layoutId="profile-sessions-segment"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute top-1 bottom-1 rounded-full bg-[#1B4332] shadow-[0_2px_8px_rgba(27,67,50,0.22)]"
                  style={{
                    width: "calc(50% - 4px)",
                    left: activeSessionView === "my-sessions" ? "4px" : "calc(50%)",
                  }}
                />
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeSessionView === "my-sessions"}
                  onClick={() => setActiveSessionView("my-sessions")}
                  className={`relative z-10 min-w-[7.5rem] rounded-full px-5 py-2 text-xs font-bold tracking-wide transition-colors duration-300 ${
                    activeSessionView === "my-sessions" ? "text-white" : "text-[#1B4332] hover:text-[#2D6A4F]"
                  }`}
                >
                  My Sessions
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeSessionView === "as-companion"}
                  onClick={() => setActiveSessionView("as-companion")}
                  className={`relative z-10 min-w-[7.5rem] rounded-full px-5 py-2 text-xs font-bold tracking-wide transition-colors duration-300 ${
                    activeSessionView === "as-companion" ? "text-white" : "text-[#1B4332] hover:text-[#2D6A4F]"
                  }`}
                >
                  As Companion
                </button>
              </div>
            )}
          </div>

          {isApprovedCompanion && showCompanionView && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {[
                { label: "Assigned", value: companionSessionStats.total, icon: ClipboardList },
                { label: "Pending", value: companionSessionStats.pending, icon: Clock },
                { label: "Confirmed", value: companionSessionStats.confirmed, icon: CheckCircle },
                { label: "Completed", value: companionSessionStats.completed, icon: BarChart2 },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[#D5EEDD]/80 bg-[#F4FAF6]/80 px-4 py-3"
                >
                  <div className="flex items-center gap-2 text-[#2D6A4F] mb-1">
                    <item.icon className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                  </div>
                  <p className="text-xl font-black text-[#1B4332] tabular-nums">{item.value}</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* Dynamic Loading Shimmer */}
          {sessionsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 bg-[#F4FAF6]/50 border border-[#D5EEDD] rounded-[20px] p-6 animate-pulse space-y-4">
                  <div className="h-5 w-1/3 bg-[#D5EEDD] rounded-md" />
                  <div className="h-8 w-2/3 bg-[#EBF5EE] rounded-md" />
                  <div className="h-3 w-1/2 bg-[#EBF5EE] rounded-md" />
                  <div className="h-10 w-full bg-[#D5EEDD]/50 rounded-xl mt-4" />
                </div>
              ))}
            </div>
          ) : showCompanionView ? (
            /* AS COMPANION VIEW — approved companions only */
            <AnimatePresence mode="wait">
              {companionBookings.length === 0 ? (
                <motion.div
                  key="companion-empty"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="text-center py-12 bg-[#F4FAF6] border border-[#D5EEDD] rounded-[24px] px-8"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#EAFBF0] to-[#D5F2D9] flex items-center justify-center text-[#1B4332] mx-auto mb-4 shadow-inner">
                    <Users className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-[#1B4332] mb-2">
                    No companion sessions assigned yet.
                  </h4>
                  <p className="text-sm text-[#556B5D] leading-relaxed max-w-md mx-auto">
                    Once users book sessions with you, they&apos;ll appear here.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="companion-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {companionBookings.map((booking) => (
                    <div key={booking.id || booking._id} className="bg-white border border-[#D5EEDD] hover:border-[#52B788] shadow-sm hover:shadow-md transition-all rounded-[20px] p-5 flex flex-col justify-between group relative overflow-hidden">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-bold tracking-widest text-[#64C08E] uppercase block mb-1">{booking.type || "Wellness Session"}</span>
                            <h4 className="text-base font-bold text-[#1B4332] line-clamp-1">{booking.userName || booking.userEmail || "Guest"}</h4>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                            (booking.status || "").toLowerCase() === "completed" ? "bg-[#E8F4F8] text-[#1A4F66]" :
                            (booking.status || "").toLowerCase().includes("pending") ? "bg-[#FFFDF0] text-[#997917]" :
                            "bg-[#EAFBF0] text-[#1B4332]"
                          }`}>
                            {booking.status || "Confirmed"}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 bg-[#F4FAF6]/70 border border-[#D5EEDD]/50 rounded-xl p-2.5 text-xs text-[#2d6a4f]">
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5 text-[#52B788]" />
                            <span className="font-semibold">{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5 border-l border-[#D5EEDD]/40 pl-4">
                            <Clock className="w-3.5 h-3.5 text-[#52B788]" />
                            <span className="font-semibold">{booking.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            /* MY SESSIONS VIEW */
            <AnimatePresence mode="wait">
              {userBookings.length === 0 ? (
                <motion.div
                  key="user-empty"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="text-center py-12 bg-[#F4FAF6] border border-[#D5EEDD] rounded-[24px] px-8"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#EAFBF0] to-[#D5F2D9] flex items-center justify-center text-[#1B4332] mx-auto mb-4 shadow-inner">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-[#1B4332] mb-2">Your Journey Starts Here</h4>
                  <p className="text-sm text-[#556B5D] leading-relaxed max-w-md mx-auto mb-6">
                    No sessions have been scheduled yet. Embark on a path of reflection and growth.
                  </p>
                  <button
                    onClick={() => navigate("/dashboard/companion")}
                    className="bg-[#1B4332] hover:bg-[#2d6a4f] text-white rounded-xl px-6 py-2.5 text-sm font-bold shadow-md transition-transform hover:scale-105"
                  >
                    Explore Companions
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="user-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {userBookings.map((booking) => {
                    const statusVal = (booking.status || "").toLowerCase();
                    const isApproved = statusVal === "session confirmed";
                    const isRejected = statusVal === "rejected";
                    const isPending = statusVal.includes("pending") || statusVal === "";
                    
                    const getStatusLabel = () => {
                      if (isApproved) return "Approved";
                      if (isRejected) return "Rejected";
                      if (isPending) return "Pending";
                      if (statusVal === "completed") return "Completed";
                      return booking.status;
                    };

                    const getStatusBadgeClass = () => {
                      if (isApproved) return "bg-[#EAFBF0] text-[#1B4332] border border-[#BDE8CE]";
                      if (isRejected) return "bg-rose-50 text-rose-700 border border-rose-100";
                      if (isPending) return "bg-[#FFFDF0] text-[#997917] border border-[#FCE181]";
                      if (statusVal === "completed") return "bg-[#E8F4F8] text-[#1A4F66] border border-[#B3D6E4]";
                      return "bg-gray-50 text-gray-700 border border-gray-200";
                    };

                    return (
                      <div key={booking.id || booking._id} className="bg-white border border-[#D5EEDD] hover:border-[#52B788] shadow-sm hover:shadow-md transition-all rounded-[20px] p-5 flex flex-col justify-between group relative overflow-hidden">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9px] font-bold tracking-widest text-[#64C08E] uppercase block mb-1">{booking.type || "Wellness Session"}</span>
                              <h4 className="text-base font-bold text-[#1B4332] line-clamp-1">{booking.companionName || booking.itemName || "Guide"}</h4>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${getStatusBadgeClass()}`}>
                              {getStatusLabel()}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 bg-[#F4FAF6]/70 border border-[#D5EEDD]/50 rounded-xl p-2.5 text-xs text-[#2d6a4f]">
                            <div className="flex items-center gap-1.5">
                              <CalendarIcon className="w-3.5 h-3.5 text-[#52B788]" />
                              <span className="font-semibold">{booking.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 border-l border-[#D5EEDD]/40 pl-4">
                              <Clock className="w-3.5 h-3.5 text-[#52B788]" />
                              <span className="font-semibold">{booking.time}</span>
                            </div>
                          </div>

                          {/* Session Details: platform & notes */}
                          {(booking.platform || booking.sessionNotes) && (
                            <div className="pt-2 text-xs space-y-1.5 border-t border-[#D5EEDD]/30">
                              {booking.platform && (
                                <p className="text-[#556B5D]">
                                  <span className="font-semibold text-[#2d6a4f]">Platform:</span> {booking.platform}
                                </p>
                              )}
                              {booking.sessionNotes && (
                                <p className="text-[#556B5D] bg-[#F4FAF6] p-2 rounded-lg border border-[#D5EEDD]/40 italic">
                                  "{booking.sessionNotes}"
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          )}
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
                onClick={() => alert("Opening Notifications")}
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
                onClick={() => alert("Opening Privacy & Security")}
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
      </div>

      {/* Preferences Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-[32px] p-8 shadow-2xl border border-gray-200/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="float-right text-gray-600 hover:text-gray-800 text-2xl font-bold leading-none"
            >
              ×
            </button>

            <h2 className="text-gray-800 mb-8">Preferences</h2>

            <div className="space-y-8">
              {/* Theme & Language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Theme */}
                <div>
                  <label className="block">
                    <p className="text-gray-800 font-semibold mb-2">Theme</p>
                    <p className="text-gray-600 text-sm mb-3">Choose light, dark or system</p>
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200/60 bg-white text-gray-800 focus:ring-2 focus:ring-gray-400 focus:border-gray-500"
                    value={prefs.theme}
                    onChange={(e) => setPrefs({ ...prefs, theme: e.target.value as "light" | "dark" | "system" })}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block">
                    <p className="text-gray-800 font-semibold mb-2">Language</p>
                    <p className="text-gray-600 text-sm mb-3">App display language</p>
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200/60 bg-white text-gray-800 focus:ring-2 focus:ring-gray-400 focus:border-gray-500"
                    value={prefs.language}
                    onChange={(e) => setPrefs({ ...prefs, language: e.target.value as "en" | "hi" | "te" | "kn" })}
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="te">Telugu</option>
                    <option value="kn">Kannada</option>
                  </select>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <h4 className="text-gray-800 font-semibold mb-4">Notifications</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <span className="text-gray-800">Email notifications</span>
                    <input
                      type="checkbox"
                      checked={prefs.emailNotifications}
                      onChange={(e) => setPrefs({ ...prefs, emailNotifications: e.target.checked })}
                      className="w-5 h-5 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <span className="text-gray-800">Push notifications</span>
                    <input
                      type="checkbox"
                      checked={prefs.pushNotifications}
                      onChange={(e) => setPrefs({ ...prefs, pushNotifications: e.target.checked })}
                      className="w-5 h-5 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Privacy */}
              <div>
                <h4 className="text-gray-800 font-semibold mb-4">Privacy</h4>
                <div className="space-y-3">
                  {/* Profile Visibility */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="block">
                      <p className="text-gray-800 font-medium mb-2">Profile visibility</p>
                    </label>
                    <select
                      className="w-full px-4 py-2 rounded-lg border border-gray-200/60 bg-white text-gray-800"
                      value={prefs.profileVisibility}
                      onChange={(e) => setPrefs({ ...prefs, profileVisibility: e.target.value as "public" | "friends" | "private" })}
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <span className="text-gray-800">Show online status</span>
                    <input
                      type="checkbox"
                      checked={prefs.showOnlineStatus}
                      onChange={(e) => setPrefs({ ...prefs, showOnlineStatus: e.target.checked })}
                      className="w-5 h-5 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <span className="text-gray-800">Allow anonymous data sharing</span>
                    <input
                      type="checkbox"
                      checked={prefs.dataSharing}
                      onChange={(e) => setPrefs({ ...prefs, dataSharing: e.target.checked })}
                      className="w-5 h-5 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200/30">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSaveMessage("Preferences saved");
                    setTimeout(() => setSaveMessage(null), 2000);
                  }}
                  className="flex-1 py-3 bg-[#2D6A4F] text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Save Changes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsSettingsOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Close
                </motion.button>
              </div>

              {saveMessage && (
                <div className="p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 text-center">
                  {saveMessage}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

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
