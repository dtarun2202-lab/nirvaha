import { motion } from "motion/react";
import {
  Activity,
  TrendingUp,
  Award,
  Clock,
  Heart,
  Zap,
  Target,
  Calendar,
  BarChart3,
  Brain,
  Wind,
  Sun,
  Moon,
  Flame,
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
  Sparkles,
  History,
  Smile,
  ChevronRight,
  Play,
} from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { ShareProfileCard } from "./ShareProfileCard";
import { MeditationSessionModal } from "./MeditationSessionModal";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";
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

export function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const { socket } = useSocket();
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [activeSession, setActiveSession] = useState<any>(null);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loadingRecs, setLoadingRecs] = useState(true);


  // Merge API data with auth user data — must be before moodHistory
  const stats = profileData?.stats || user?.stats || {};
  const weeklyMinutes = stats.weeklyMinutes || [0,0,0,0,0,0,0];

  const moodHistory = [
    { day: "M", level: weeklyMinutes[0] },
    { day: "T", level: weeklyMinutes[1] },
    { day: "W", level: weeklyMinutes[2] },
    { day: "T", level: weeklyMinutes[3] },
    { day: "F", level: weeklyMinutes[4] },
    { day: "S", level: weeklyMinutes[5] },
    { day: "S", level: weeklyMinutes[6] },
  ];
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

  const totalWeeklyMinutes = weeklyData.reduce((acc, curr) => acc + curr.minutes, 0);
  const averageDailyMinutes = Math.round(totalWeeklyMinutes / 7);

  const mostActiveDayIndex = weeklyData.reduce((maxIdx, curr, idx, arr) => curr.minutes > arr[maxIdx].minutes ? idx : maxIdx, 0);
  const mostActiveDay = totalWeeklyMinutes > 0 ? weeklyData[mostActiveDayIndex].day : "No activity yet";

  const handleDownload = async () => {
    const element = chartRef.current || profileRef.current;
    if (element) {
      try {
        const canvas = await html2canvas(element, {
          scale: 3,
          useCORS: true,
          backgroundColor: "#F0FDF4",
          logging: false,
          onclone: (clonedDoc) => {
            // Optional: Modify cloned DOM for better export look
            const el = clonedDoc.querySelector('[ref="chartRef"]') as HTMLElement;
            if (el) el.style.padding = "40px";
          }
        });
        const link = document.createElement("a");
        link.download = `nirvaha-practice-report-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (err) {
        console.error("Download failed:", err);
      }
    }
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      const token = localStorage.getItem('token');
      try {
        const [profRes, recRes] = await Promise.all([
          fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/users/profile?userId=${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/profile/recommendations?userId=${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        if (profRes.ok) {
          const data = await profRes.json();
          setProfileData(data);
          if (data.currentMood) {
            const mood = availableMoods.find(m => m.label === data.currentMood);
            if (mood) setSelectedMood(mood);
          }
        }
        if (recRes.ok) {
          const data = await recRes.json();
          setRecommendations(data);
        }
      } catch (e) { console.error('👤 Profile: Load failed', e); }
      finally { setLoadingRecs(false); }
    };
    loadProfile();
  }, [user?.id]);

  // Handle Mood Update
  const handleMoodSelect = async (mood: any) => {
    setSelectedMood(mood);
    const token = localStorage.getItem('token');
    try {
      await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/profile/mood`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ userId: user?.id, mood: mood.label })
      });
      // Refresh recommendations after mood change
      const recRes = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/profile/recommendations?userId=${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (recRes.ok) setRecommendations(await recRes.json());
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
        // Refresh recommendations on history update
        const token = localStorage.getItem('token');
        const recRes = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/profile/recommendations?userId=${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (recRes.ok) setRecommendations(await recRes.json());
      }
    };

    socket.on("profile_updated", handleUpdate);
    return () => { socket.off("profile_updated", handleUpdate); };
  }, [socket, user?.id]);


  const handleStartSession = (session: any) => {
    setActiveSession(session);
    setIsSessionModalOpen(true);
  };

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
          <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em]">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-[#1B4332]">{payload[0].value}</span>
            <span className="text-xs font-bold text-gray-500">mins</span>
          </div>
          <p className="text-[10px] text-gray-400 font-medium">Mindfulness Flow</p>
        </motion.div>
      );
    }
    return null;
  };

  // ── Curated Recommendations (Dynamic) ─────────────────────
  const recentSessions = useMemo(() => {
    const history = (profileData?.sessionHistory ?? (user as any)?.sessionHistory ?? []) as any[];
    // Get unique sessions by title, limit to 3
    const unique = [];
    const seen = new Set();
    for (const s of [...history].reverse()) {
      if (!seen.has(s.title)) {
        seen.add(s.title);
        unique.push(s);
      }
      if (unique.length >= 3) break;
    }
    return unique;
  }, [profileData, user]);

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
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShare}
                      className="px-6 py-3 bg-[#1B4332] text-white rounded-2xl shadow-lg flex items-center gap-2 font-bold hover:shadow-[#1B4332]/20 transition-all"
                    >
                      <Share2 className="w-5 h-5" />
                      Share
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownload}
                      className="px-6 py-3 bg-white text-[#1B4332] rounded-2xl shadow-lg flex items-center gap-2 font-bold border border-white/50 hover:bg-[#f0fdf4] transition-all"
                    >
                      <Download className="w-5 h-5" />
                      Export
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-6">
                  <div className="bg-white/60 backdrop-blur-md rounded-3xl p-5 border border-white/60 shadow-sm text-center">
                    <div className="text-3xl font-black text-[#1B4332] mb-0.5 tracking-tighter">{stats.totalMinutes ?? 0}</div>
                    <div className="text-[10px] text-[#2D6A4F] font-black uppercase tracking-widest">Total Minutes</div>
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
              <span className="text-5xl font-bold text-[#1B4332]"><StatCounter value={stats.todayPracticeTime || 0} /></span>
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
                +{stats.todaySessions || 0}
              </div>
            </div>
            <h5 className="text-gray-800 mb-1">Today's Sessions</h5>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-bold text-[#1B4332]"><StatCounter value={stats.todaySessions || 0} /></span>
              <span className="text-xl text-[#6b7280]">completed</span>
            </div>
            <p className="text-sm text-[#6b7280]">Today's mental gym results</p>
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

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Mood Sphere - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ y: -8 }}
            className="bg-white/80 backdrop-blur-xl rounded-[32px] p-6 shadow-xl border border-gray-200/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-gray-800 mb-1 text-base font-bold">Emotional Landscape</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#16a34a] bg-[#f0fdf4] px-2 py-0.5 rounded-full">
                    {stats.streak > 0 ? `${stats.streak} day streak` : 'No streak yet'}
                  </span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsGoodDay(!isGoodDay)}
                className={`p-2 rounded-xl transition-all ${isGoodDay ? "bg-[#2D6A4F] text-white shadow-lg" : "bg-[#f0fdf4] text-[#16a34a]"}`}
              >
                <Heart className={`w-5 h-5 ${isGoodDay ? "fill-current" : ""}`} />
              </motion.button>
            </div>

            <div className="flex flex-col items-center gap-4">
              {/* Mood Sphere — compact */}
              <motion.div
                key={selectedMood.label}
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className={`relative w-28 h-28 rounded-full bg-gradient-to-br ${selectedMood.color} flex flex-col items-center justify-center shadow-xl border-2 border-white/20`}
              >
                <selectedMood.icon className="w-9 h-9 text-white opacity-90" />
                <div className="text-white font-bold text-sm mt-1">{selectedMood.label}</div>
                <div className="absolute inset-0 rounded-full bg-[#52B788]/20 blur-2xl -z-10 animate-pulse" />
              </motion.div>

              {/* Mood bars */}
              <div className="flex items-end gap-2">
                {(() => {
                  const maxLevel = Math.max(...moodHistory.map(m => m.level), 1);
                  return moodHistory.map((item, i) => {
                    const barHeight = Math.max(4, (item.level / maxLevel) * 32);
                    return (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: barHeight }}
                          className="w-2 bg-[#2D6A4F] rounded-full"
                          style={{ height: barHeight }}
                        />
                        <span className="text-[9px] font-bold text-gray-400">{item.day}</span>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Consistency */}
              <div className="w-full bg-white/60 rounded-2xl p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Consistency Index</span>
                  <span className="text-xs font-bold text-[#2D6A4F]">{stats.wellnessScore ?? 0}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.wellnessScore ?? 0}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-[#52B788] to-[#2D6A4F]"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Feeling <span className="font-bold text-[#2D6A4F]">{selectedMood.label.toLowerCase()}</span> · Best day: <span className="font-bold text-[#2D6A4F]">{mostActiveDay}</span>
                </p>
              </div>

              {/* Mood selector */}
              <div className="grid grid-cols-5 gap-2 w-full">
                {availableMoods.map((mood) => (
                  <motion.button
                    key={mood.label}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleMoodSelect(mood)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all ${
                      selectedMood.label === mood.label
                        ? "bg-[#2D6A4F] text-white border-[#1B4332]"
                        : "bg-white border-gray-100 hover:border-[#52B788]"
                    }`}
                  >
                    <mood.icon className={`w-5 h-5 ${selectedMood.label === mood.label ? "text-white" : "text-[#2D6A4F]/60"}`} />
                    <span className="text-[7px] mt-1 font-bold uppercase">{mood.label}</span>
                  </motion.button>
                ))}
              </div>

            </div>
          </motion.div>

          {/* Weekly Activity Chart — beside Emotional Landscape */}
          <motion.div
          ref={chartRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-white/80 backdrop-blur-xl rounded-[32px] p-6 shadow-2xl border border-gray-200/30 relative overflow-hidden"
        >
          {/* Decorative Background Pattern */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-green-50 rounded-full blur-3xl -z-10 opacity-60" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8 relative z-10">
            <div>
              <h3 className="text-[#1B4332] font-black tracking-tight text-2xl mb-2">Weekly Practice Flow</h3>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-2xl border border-green-100">
                  <Clock className="w-4 h-4 text-[#2D6A4F]" />
                  <span className="text-sm font-bold text-[#2D6A4F]">{totalWeeklyMinutes} mins total</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-2xl border border-green-100">
                  <TrendingUp className="w-4 h-4 text-[#2D6A4F]" />
                  <span className="text-sm font-bold text-[#2D6A4F]">{averageDailyMinutes}m/day avg</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-2xl border border-green-100">
                  <Activity className="w-4 h-4 text-[#2D6A4F]" />
                  <span className="text-sm font-bold text-[#2D6A4F]">{stats.sessionsPlayed ?? 0} sessions</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-2xl border border-green-100">
                  <Award className="w-4 h-4 text-[#2D6A4F]" />
                  <span className="text-sm font-bold text-[#2D6A4F]">{stats.streak ?? 0} day streak</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Today's Effort</p>
                <div className="flex items-center justify-end gap-2 text-xl font-black text-[#1B4332]">
                  {weeklyData[(new Date().getDay() + 6) % 7].minutes} <span className="text-xs font-bold text-gray-400 uppercase">mins</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="px-6 py-3 bg-[#1B4332] text-white rounded-2xl shadow-xl shadow-green-900/20 flex items-center gap-2 font-bold transition-all"
              >
                <Download className="w-5 h-5" />
                Export Report
              </motion.button>
            </div>
          </div>

          {/* Chart */}
          <div className="h-72 w-full bg-white/40 rounded-[32px] p-6 border border-white/60 shadow-inner overflow-hidden mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
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
                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="rgba(45, 106, 79, 0.08)" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#2D6A4F', fontSize: 11, fontWeight: 900, opacity: 0.6 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#2D6A4F', fontSize: 10, fontWeight: 700, opacity: 0.4 }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(45, 106, 79, 0.05)', radius: 16 }}
                />
                <Bar
                  dataKey="minutes"
                  radius={[16, 16, 16, 16]}
                  barSize={44}
                  animationDuration={2000}
                  animationBegin={300}
                  minPointSize={4}
                >
                  {weeklyData.map((entry, index) => {
                    const isToday = index === (new Date().getDay() + 6) % 7;
                    const isEmpty = entry.minutes === 0;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={isEmpty ? 'url(#emptyBarGradient)' : isToday ? 'url(#activeBarGradient)' : 'url(#barGradient)'}
                        style={{ filter: isToday && !isEmpty ? 'drop-shadow(0 0 12px rgba(45,106,79,0.3))' : 'none', cursor: 'pointer', opacity: isEmpty ? 0.4 : 1 }}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* AI Wellness Insights */}
          <div className="bg-gradient-to-r from-[#f0fdf4] to-[#dcfce7] rounded-[24px] p-5 border border-green-100">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-[#2D6A4F]" />
              <span className="text-xs font-black text-[#2D6A4F] uppercase tracking-widest">Wellness Insights</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {totalWeeklyMinutes === 0 ? (
                <p className="text-sm text-[#2D6A4F]/70 col-span-3 font-medium">
                  Start your first mindfulness session to see your weekly wellness journey.
                </p>
              ) : (
                <>
                  <div className="bg-white/70 rounded-2xl px-4 py-3 text-sm text-[#1B4332] font-medium">
                    {totalWeeklyMinutes >= 60
                      ? `You practiced ${totalWeeklyMinutes} mins this week — great consistency!`
                      : `You've logged ${totalWeeklyMinutes} mins this week. Keep building the habit!`}
                  </div>
                  <div className="bg-white/70 rounded-2xl px-4 py-3 text-sm text-[#1B4332] font-medium">
                    {mostActiveDay !== 'No activity yet'
                      ? `Your best focus day was ${mostActiveDay}`
                      : 'Complete sessions to find your best day'}
                  </div>
                  <div className="bg-white/70 rounded-2xl px-4 py-3 text-sm text-[#1B4332] font-medium">
                    {(stats.streak ?? 0) >= 3
                      ? `${stats.streak} day streak — you're on a roll!`
                      : averageDailyMinutes >= 10
                      ? `Averaging ${averageDailyMinutes} mins/day — solid foundation`
                      : 'Practice daily to build your streak'}
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
        </div>

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
          sessions: stats.sessions || 0,
          streak: stats.streak || 0,
          totalTime: `${Math.round((stats.totalMinutes || 0) / 60)}hrs`,
          wellnessScore: stats.wellnessScore || 50,
          meditationMinutes: stats.meditationMinutes || 0,
          soundMinutes: stats.soundMinutes || 0,
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
