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
  Users,
  FileText,
  Heart as HeartIcon,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
      let start = 0;
      const end = value;
      const duration = 1500;
      const stepTime = Math.abs(Math.floor(duration / end));
      if (end === 0) return setCount(0);
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= end) clearInterval(timer);
      }, stepTime > 0 ? stepTime : 10);
      
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

  const moodHistory = [
    { day: "M", level: 80 },
    { day: "T", level: 65 },
    { day: "W", level: 90 },
    { day: "T", level: 75 },
    { day: "F", level: 85 },
    { day: "S", level: 95 },
    { day: "S", level: 88 },
  ];

  // Merge API data with auth user data
  const stats = profileData?.stats || {};
  const displayBio = profileData?.bio || user?.bio || "🌿 You're building consistency — keep going.";
  const displayLocation = (profileData?.location || user?.location || "Hyderabad, India").replace(/Mumbai/gi, "Hyderabad");
  const weeklyData = [
    { day: "Mon", minutes: stats.weeklyMinutes?.[0] || 12 },
    { day: "Tue", minutes: stats.weeklyMinutes?.[1] || 18 },
    { day: "Wed", minutes: stats.weeklyMinutes?.[2] || 25 },
    { day: "Thu", minutes: stats.weeklyMinutes?.[3] || 15 },
    { day: "Fri", minutes: stats.weeklyMinutes?.[4] || 30 },
    { day: "Sat", minutes: stats.weeklyMinutes?.[5] || 45 },
    { day: "Sun", minutes: stats.weeklyMinutes?.[6] || 20 },
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

  // Fetch live profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/profile?userId=${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) setProfileData(await res.json());
      } catch (e) { console.error(e); }
    };
    loadProfile();

    if (!socket) return;
    
    socket.on("profile_updated", (data: any) => {
      if (data.userId === user?.id) {
        setProfileData((prev: any) => prev ? { ...prev, stats: data.stats } : prev);
      }
    });

    return () => {
      socket.off("profile_updated");
    };
  }, [user?.id, socket]);

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
        const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/profile/update`, {
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

  const recommendations = [
    {
      title: "Morning Breath Work",
      type: "Pranayama",
      duration: "10 min",
      benefit: "Boost your energy and clarity to start the day right.",
      icon: Wind,
      iconBg: "bg-[#dcfce7]",
      iconColor: "text-[#16a34a]",
      sessionType: "breath",
    },
    {
      title: "Chakra Alignment",
      type: "Meditation",
      duration: "20 min",
      benefit: "Restore inner balance and harmonize your energy centers.",
      icon: Flame,
      iconBg: "bg-[#fef9c3]",
      iconColor: "text-[#ca8a04]",
      sessionType: "chakra",
    },
    {
      title: "Evening Relaxation",
      type: "Sound Healing",
      duration: "15 min",
      benefit: "Unwind deeply and prepare your mind for restful sleep.",
      icon: Moon,
      iconBg: "bg-[#ede9fe]",
      iconColor: "text-[#7c3aed]",
      sessionType: "relax",
    },
  ];

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
                    <h1 className="text-[#1B4332] mb-2 font-black tracking-tight">{user?.name || "Gayar Sathvika"}</h1>
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

                <div className="grid grid-cols-4 gap-4 mt-6">
                  <div className="bg-white/60 backdrop-blur-md rounded-3xl p-4 border border-white/60 shadow-sm text-center">
                    <div className="text-2xl font-black text-[#1B4332] mb-0.5 tracking-tighter">
                      <StatCounter value={stats.meditationMinutes ?? 0} />
                    </div>
                    <div className="text-[9px] text-[#2D6A4F] font-black uppercase tracking-widest">Meditation</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-md rounded-3xl p-4 border border-white/60 shadow-sm text-center">
                    <div className="text-2xl font-black text-[#1B4332] mb-0.5 tracking-tighter">
                      <StatCounter value={stats.posts ?? 0} />
                    </div>
                    <div className="text-[9px] text-[#2D6A4F] font-black uppercase tracking-widest">Posts</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-md rounded-3xl p-4 border border-white/60 shadow-sm text-center">
                    <div className="text-2xl font-black text-[#1B4332] mb-0.5 tracking-tighter">
                      <StatCounter value={stats.followers ?? 0} />
                    </div>
                    <div className="text-[9px] text-[#2D6A4F] font-black uppercase tracking-widest">Followers</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-md rounded-3xl p-4 border border-white/60 shadow-sm text-center">
                    <div className="text-2xl font-black text-[#1B4332] mb-0.5 tracking-tighter">
                      <StatCounter value={stats.wellnessScore ?? 50} />
                    </div>
                    <div className="text-[9px] text-[#2D6A4F] font-black uppercase tracking-widest">Wellness</div>
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
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Mood Sphere - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ y: -8 }}
            className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-[40px] p-8 shadow-xl border border-gray-200/30"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-gray-800 mb-1">Emotional Landscape</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#16a34a] bg-[#f0fdf4] px-2 py-0.5 rounded-full">+12% trend</span>
                  <p className="text-xs text-gray-600">Emotional stability this week</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsGoodDay(!isGoodDay)}
                className={`p-3 rounded-2xl transition-all ${isGoodDay ? "bg-[#2D6A4F] text-white shadow-lg" : "bg-[#f0fdf4] text-[#16a34a]"}`}
              >
                <Heart className={`w-6 h-6 ${isGoodDay ? "fill-current" : ""}`} />
              </motion.button>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center py-4">
              {/* Left: Main Visualization */}
              <div className="flex flex-col items-center">
                <motion.div
                  key={selectedMood.label}
                  animate={{ 
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 20px 50px rgba(45, 106, 79, 0.2)",
                      "0 20px 70px rgba(45, 106, 79, 0.4)",
                      "0 20px 50px rgba(45, 106, 79, 0.2)"
                    ]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className={`relative w-48 h-48 rounded-full bg-gradient-to-br ${selectedMood.color} flex flex-col items-center justify-center shadow-2xl z-10 border-4 border-white/20`}
                >
                  <div className="text-white mb-2">
                    <selectedMood.icon className="w-14 h-14 opacity-90" />
                  </div>
                  <div className="text-white font-bold text-xl tracking-tight">{selectedMood.label}</div>
                  <div className="absolute -bottom-6 bg-white px-5 py-2 rounded-full shadow-xl border border-gray-100 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#16a34a]" />
                    <span className="text-[11px] font-bold text-gray-800 uppercase tracking-wide">Growing Stability</span>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-[#52B788]/20 blur-3xl -z-10 animate-pulse" />
                </motion.div>
                
                {/* Mood History Dots */}
                <div className="mt-16 flex items-end gap-3">
                  {moodHistory.map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <motion.div 
                        initial={{ height: 0 }}
                        whileHover={{ scale: 1.4, backgroundColor: "#1B4332" }}
                        animate={{ height: item.level / 2.5 }}
                        className="w-2.5 bg-[#2D6A4F] rounded-full shadow-sm transition-colors cursor-pointer"
                      />
                      <span className="text-[10px] font-bold text-gray-400">{item.day}</span>
                    </div>
                  ))}
                  <div className="ml-3 text-[10px] font-bold text-[#2D6A4F] uppercase tracking-widest opacity-60">Wellness Flow</div>
                </div>
              </div>

              {/* Right: Selection & Summary */}
              <div>
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 shadow-sm mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-4 bg-[#2D6A4F] rounded-full" />
                    <h5 className="text-gray-800 text-sm font-bold uppercase tracking-wide">Wellness Insights</h5>
                  </div>
                  <div className="space-y-5">
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                      You've been feeling <span className="font-bold text-[#2D6A4F]">{selectedMood.label.toLowerCase()}</span> lately. 
                      Your practice is most consistent on <span className="font-bold text-[#2D6A4F]">{mostActiveDay}</span>. 
                      Keep nurturing your inner space!
                    </p>
                    
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Consistency Index</span>
                        <span className="text-xs font-bold text-[#2D6A4F]">94%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "94%" }}
                          transition={{ duration: 1, delay: 1 }}
                          className="h-full bg-gradient-to-r from-[#52B788] to-[#2D6A4F]" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Daily Reflection</p>
                  <div className="grid grid-cols-5 gap-3">
                    {availableMoods.map((mood) => (
                      <motion.button
                        key={mood.label}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedMood(mood)}
                        className={`aspect-square flex flex-col items-center justify-center rounded-2xl transition-all border-2 ${
                          selectedMood.label === mood.label 
                          ? "bg-[#2D6A4F] text-white shadow-xl border-[#1B4332]" 
                          : "bg-white border-gray-100 text-gray-500 hover:border-[#52B788] hover:text-[#2D6A4F] hover:shadow-md"
                        }`}
                      >
                        <mood.icon className={`w-6 h-6 ${selectedMood.label === mood.label ? "text-white" : "text-[#2D6A4F]/60"}`} />
                        <span className="text-[7px] mt-1.5 font-bold uppercase tracking-tight">{mood.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Calendar Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ y: -8 }}
            className="bg-white/80 backdrop-blur-xl rounded-[40px] p-8 shadow-xl border border-gray-200/30"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-gray-800">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
              <Calendar className="w-6 h-6 text-[#16a34a]" />
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div key={i} className="text-xs text-center text-gray-600 font-bold py-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => {
                const dayNum = i + 1;
                const today = new Date();
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                
                const hasSession = stats.activityLog?.includes(dateStr);
                const isToday = today.getDate() === dayNum;
                
                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.2 }}
                    className={`aspect-square flex items-center justify-center text-sm rounded-xl cursor-pointer transition-all ${
                      isToday
                        ? "bg-[#2D6A4F] text-white shadow-lg font-bold"
                        : hasSession
                        ? "bg-[#f0fdf4] text-[#16a34a] border border-[#dcfce7] font-semibold"
                        : "text-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    {dayNum}
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 text-xs pt-4 border-t border-gray-200/30">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#f0fdf4] border border-[#dcfce7]" />
                <span className="text-gray-600">Practiced</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#2D6A4F]" />
                <span className="text-gray-600">Today</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Weekly Activity Chart */}
        <motion.div
          ref={chartRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-white/80 backdrop-blur-xl rounded-[40px] p-10 shadow-2xl border border-gray-200/30 mb-8 relative overflow-hidden"
        >
          {/* Decorative Background Pattern */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-green-50 rounded-full blur-3xl -z-10 opacity-60" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 relative z-10">
            <div>
              <h3 className="text-[#1B4332] font-black tracking-tight text-2xl mb-2">Weekly Practice Flow</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-2xl border border-green-100">
                  <Clock className="w-4 h-4 text-[#2D6A4F]" />
                  <span className="text-sm font-bold text-[#2D6A4F]">{totalWeeklyMinutes} mins total</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-2xl border border-green-100">
                  <TrendingUp className="w-4 h-4 text-[#2D6A4F]" />
                  <span className="text-sm font-bold text-[#2D6A4F]">{averageDailyMinutes}m/day avg</span>
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

          <div className="h-80 w-full bg-white/40 rounded-[32px] p-6 border border-white/60 shadow-inner overflow-hidden">
            {totalWeeklyMinutes > 0 ? (
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
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="rgba(45, 106, 79, 0.1)" />
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
                    animationBegin={500}
                  >
                    {weeklyData.map((_, index) => {
                      const isToday = index === (new Date().getDay() + 6) % 7;
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={isToday ? 'url(#activeBarGradient)' : 'url(#barGradient)'}
                          className="transition-all duration-500 hover:opacity-80"
                          style={{
                            filter: isToday ? 'drop-shadow(0 0 12px rgba(45, 106, 79, 0.3))' : 'none',
                            cursor: 'pointer'
                          }}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#2D6A4F]/40 bg-gray-50/30 rounded-3xl border-2 border-dashed border-green-100">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <BarChart3 className="w-8 h-8 opacity-40" />
                </div>
                <h4 className="text-[#1B4332] font-black tracking-tight mb-2">No practice data yet</h4>
                <p className="text-sm font-medium opacity-60 mb-6">Start your first session to begin your flow</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStartSession(recommendations[0])}
                  className="px-6 py-2.5 bg-[#2D6A4F] text-white rounded-xl font-bold text-sm shadow-lg"
                >
                  Start First Session
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.h3
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-gray-800 mb-6"
        >
          Recommended for You
        </motion.h3>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {recommendations.map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 + i * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className={`w-14 h-14 mb-4 rounded-2xl ${rec.iconBg} flex items-center justify-center`}>
                <rec.icon className={`w-7 h-7 ${rec.iconColor}`} />
              </div>

              <h4 className="text-[#0f172a] font-bold mb-1">{rec.title}</h4>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-[#f0fdf4] text-[#16a34a] text-xs rounded-full font-medium border border-[#dcfce7]">
                  {rec.type}
                </span>
                <span className="text-xs text-[#6b7280]">{rec.duration}</span>
              </div>
              <p className="text-sm text-[#6b7280] mb-5">{rec.benefit}</p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStartSession(rec)}
                disabled={isSessionModalOpen}
                className={`w-full py-2.5 rounded-2xl font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
                  isSessionModalOpen && activeSession?.title === rec.title
                  ? "bg-gray-100 text-[#2D6A4F] cursor-default" 
                  : "bg-[#2D6A4F] text-white hover:bg-[#1B4332]"
                }`}
              >
                {isSessionModalOpen && activeSession?.title === rec.title ? (
                  <>
                    <Activity className="w-4 h-4 animate-pulse" />
                    In Progress...
                  </>
                ) : (
                  "Start Session"
                )}
              </motion.button>
            </motion.div>
          ))}
        </div>

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
