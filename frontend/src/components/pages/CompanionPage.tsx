import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  Star,
  Clock,
  Video,
  Calendar,
  DollarSign,
  Award,
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
  Copy,
  Check,
  MapPin,
  Globe,
  Sparkles,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  Filter,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  LogOut,
  Lock,
  Settings,
  Activity,
  FileText,
  BookOpen,
  Plus,
  Send,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CompanionBookingModal from "../companion/CompanionBookingModal";
import CompanionApplicationModal from "../companion/CompanionApplicationModal";
import CompanionTransition from "../companion/CompanionTransition";
import {
  createCompanionApplication,
  deleteCompanionApplication,
  getApprovedCompanions,
  getCompanionApplication,
  getCompanionSessions,
  updateCompanionSessionStatus,
} from "@/lib/companionApi";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";


interface VideoSimulationProps {
  session: any;
  onClose: () => void;
  onComplete: (notes: string) => void;
}

function CompanionVideoSimulationModal({ session, onClose, onComplete }: VideoSimulationProps) {
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [time, setTime] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: "Client", text: "Hello! Thank you so much for this session.", time: "12:00 PM" },
  ]);

  // Format timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulation chat messages from the client
  useEffect(() => {
    const clientMsgs = [
      "I've been feeling a lot of tension in my shoulders lately.",
      "Yes, let's practice that deep-breathing exercise.",
      "Wow, I can feel my heart rate slowing down already.",
      "The emerald light visualization you guided was extremely powerful.",
      "Thank you for holding space for me today."
    ];
    let msgIdx = 0;
    const chatTimer = setInterval(() => {
      if (msgIdx < clientMsgs.length) {
        setChatMessages(prev => [
          ...prev,
          {
            sender: "Client",
            text: clientMsgs[msgIdx],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        msgIdx++;
      }
    }, 15000);

    return () => clearInterval(chatTimer);
  }, []);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [
      ...prev,
      {
        sender: "You",
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatInput("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-emerald-950/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] w-full max-w-6xl h-[85vh] overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        {/* Main Video Screen */}
        <div className="flex-1 relative bg-emerald-900/40 flex flex-col justify-between p-6 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center z-10">
            <div className="flex items-center gap-3 bg-emerald-950/45 px-4 py-2 rounded-full border border-white/10 text-white backdrop-blur-md">
              <div className="relative">
                {isRecording && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                )}
                <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-red-500' : 'bg-gray-400'}`} />
              </div>
              <span className="text-xs uppercase tracking-wider font-bold">
                {isRecording ? 'REC' : 'PAUSED'}
              </span>
              <span className="h-3 w-px bg-white/20" />
              <span className="text-xs font-mono">{formatTime(time)}</span>
            </div>

            <div className="bg-emerald-950/45 px-4 py-2 rounded-full border border-white/10 text-white backdrop-blur-md text-xs font-bold">
              Client: {session.userName || session.userEmail || "Spiritual Seeker"}
            </div>
          </div>

          {/* Client Video Feed Simulation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative flex flex-col items-center">
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute w-72 h-72 bg-emerald-400/20 rounded-full blur-2xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.15, 0.4, 0.15],
                }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                className="absolute w-96 h-96 bg-teal-300/10 rounded-full blur-3xl"
              />
              <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl relative z-10">
                <Users className="w-16 h-16 text-white" />
              </div>
              <span className="mt-6 text-white/70 font-semibold uppercase tracking-widest text-xs z-10">
                Connected to Client Feed
              </span>
              <span className="mt-2 text-white/50 text-xs font-medium z-10">
                Simulated Audio/Video stream active
              </span>
            </div>
          </div>

          {/* Guide PiP (Picture in Picture) */}
          <div className="absolute bottom-6 right-6 w-40 h-56 rounded-2xl overflow-hidden border-2 border-white/30 bg-emerald-950/80 shadow-2xl z-20">
            {videoOff ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/40 gap-2">
                <CameraOff className="w-8 h-8" />
                <span className="text-[10px] uppercase font-bold">Camera Off</span>
              </div>
            ) : (
              <div className="w-full h-full relative flex items-center justify-center bg-emerald-800/40">
                <div className="w-12 h-12 rounded-full bg-emerald-900/60 flex items-center justify-center text-white border border-white/20 animate-pulse">
                  <Star className="w-5 h-5 text-emerald-300" />
                </div>
                <div className="absolute bottom-2 left-2 bg-emerald-950/60 px-2 py-0.5 rounded text-[10px] text-white/80 font-bold uppercase">
                  You (Guide)
                </div>
              </div>
            )}
          </div>

          {/* Bottom Call Controls */}
          <div className="flex justify-center items-center gap-4 z-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMicMuted(!micMuted)}
              className={`p-4 rounded-full border shadow-lg backdrop-blur-md transition-all ${
                micMuted
                  ? 'bg-red-500/20 text-red-300 border-red-500/30'
                  : 'bg-white/10 text-white border-white/10 hover:bg-white/25'
              }`}
            >
              {micMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setVideoOff(!videoOff)}
              className={`p-4 rounded-full border shadow-lg backdrop-blur-md transition-all ${
                videoOff
                  ? 'bg-red-500/20 text-red-300 border-red-500/30'
                  : 'bg-white/10 text-white border-white/10 hover:bg-white/25'
              }`}
            >
              {videoOff ? <CameraOff className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScreenSharing(!screenSharing)}
              className={`p-4 rounded-full border shadow-lg backdrop-blur-md transition-all ${
                screenSharing
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-white/10 text-white border-white/10 hover:bg-white/25'
              }`}
            >
              <ExternalLink className="w-6 h-6" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const notes = prompt("Enter final feedback/summary for the client:", "Wonderful spiritual healing and breathing workshop completed.");
                if (notes !== null) {
                  onComplete(notes);
                }
              }}
              className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-black flex items-center gap-2 shadow-lg animate-pulse"
            >
              <CheckCircle className="w-5 h-5" />
              Complete Session
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-4 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg"
            >
              <LogOut className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Live Chat Panel (Right Side) */}
        <div className="w-full md:w-80 bg-emerald-950/30 border-t md:border-t-0 md:border-l border-white/10 flex flex-col h-full">
          <div className="p-4 border-b border-white/10 flex justify-between items-center text-white">
            <span className="text-sm font-black flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              Live Chat Simulation
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-none">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === "You" ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs ${
                    msg.sender === "You"
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-white/10 text-emerald-100 border border-white/5 rounded-tl-none'
                  }`}
                >
                  <p className="font-semibold mb-1 text-[10px] text-white/50">{msg.sender}</p>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[9px] text-white/30 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="p-4 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}


export function CompanionPage() {
  const { user, refreshProfile } = useAuth();
  const { socket } = useSocket();

  // Dashboard states
  const [activeTab, setActiveTab] = useState<"sessions" | "history" | "analytics" | "profile">("sessions");
  const [companionSessions, setCompanionSessions] = useState<any[]>([]);
  const [sessionStats, setSessionStats] = useState<any>({
    total: 0,
    assigned: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    rejected: 0,
  });
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [sessionNotesInput, setSessionNotesInput] = useState<Record<string, string>>({});
  const [activeVideoSession, setActiveVideoSession] = useState<any | null>(null);
  const [companionProfile, setCompanionProfile] = useState<any>(null);
  const [savingStatusId, setSavingStatusId] = useState<string | null>(null);

  const [showTransition, setShowTransition] = useState(true);
  const [companions, setCompanions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const applicationIdKey = "nirvaha_companion_application_id";

  useEffect(() => {
    const fetchCompanions = async () => {
      try {
        const data = await getApprovedCompanions();
        setCompanions(data);
      } catch (err) {
        setError('Failed to connect to server');
        console.error('Error fetching companions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanions();
  }, []);

  const fetchDashboardSessions = async () => {
    try {
      setLoadingSessions(true);
      const res = await getCompanionSessions();
      if (res.success) {
        setCompanionSessions(res.data || []);
        if (res.stats) {
          setSessionStats(res.stats);
        }
      }
    } catch (err) {
      console.error("Error fetching companion sessions:", err);
    } finally {
      setLoadingSessions(false);
    }
  };

  const isUserApprovedCompanion = user?.isApprovedCompanion === true || user?.companionStatus === "approved";

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const id = user?.companionId || localStorage.getItem(applicationIdKey);
        if (id) {
          const profile = await getCompanionApplication(id);
          setCompanionProfile(profile);
        }
      } catch (err) {
        console.error("Error loading companion profile:", err);
      }
    };
    if (isUserApprovedCompanion) {
      loadProfile();
      fetchDashboardSessions();
    }
  }, [user, isUserApprovedCompanion]);

  useEffect(() => {
    if (!socket || !isUserApprovedCompanion) return;

    const handleBookingUpdate = (updatedBooking: any) => {
      console.log("[COMPANION-SOCKET] booking updated:", updatedBooking);
      fetchDashboardSessions();
    };

    const handleBookingCreate = (newBooking: any) => {
      console.log("[COMPANION-SOCKET] booking created:", newBooking);
      fetchDashboardSessions();
    };

    socket.on("booking-updated", handleBookingUpdate);
    socket.on("booking-created", handleBookingCreate);

    return () => {
      socket.off("booking-updated", handleBookingUpdate);
      socket.off("booking-created", handleBookingCreate);
    };
  }, [socket, isUserApprovedCompanion]);

  const handleAcceptRequest = async (bookingId: string) => {
    try {
      setSavingStatusId(bookingId);
      const notes = sessionNotesInput[bookingId] || "Looking forward to our session!";
      const res = await updateCompanionSessionStatus(bookingId, "Session Confirmed", notes);
      if (res.success) {
        alert("Booking accepted and confirmed.");
        fetchDashboardSessions();
        setSessionNotesInput(prev => ({ ...prev, [bookingId]: "" }));
      }
    } catch (err: any) {
      alert(`Failed to accept: ${err.message}`);
    } finally {
      setSavingStatusId(null);
    }
  };

  const handleRejectRequest = async (bookingId: string) => {
    if (!confirm("Are you sure you want to reject this session request?")) return;
    try {
      setSavingStatusId(bookingId);
      const notes = sessionNotesInput[bookingId] || "Guide unavailable at requested time.";
      const res = await updateCompanionSessionStatus(bookingId, "rejected", notes);
      if (res.success) {
        alert("Booking rejected.");
        fetchDashboardSessions();
        setSessionNotesInput(prev => ({ ...prev, [bookingId]: "" }));
      }
    } catch (err: any) {
      alert(`Failed to reject: ${err.message}`);
    } finally {
      setSavingStatusId(null);
    }
  };

  const handleMarkCompleted = async (bookingId: string) => {
    const summary = prompt("Enter brief session notes or feedback (optional):", "Session completed successfully.");
    if (summary === null) return;
    try {
      setSavingStatusId(bookingId);
      const res = await updateCompanionSessionStatus(bookingId, "completed", summary);
      if (res.success) {
        alert("Session marked as completed.");
        fetchDashboardSessions();
      }
    } catch (err: any) {
      alert(`Failed to mark completed: ${err.message}`);
    } finally {
      setSavingStatusId(null);
    }
  };

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCompanion, setSelectedCompanion] = useState<any>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<"all" | "liked">("all");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [companionMode, setCompanionMode] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [booking, setBooking] = useState<{
    open: boolean;
    companion: any | null;
    type: "chat" | "video" | null;
    platform: string;
    date: string;
    time: string;
  }>({ open: false, companion: null, type: null, platform: "", date: "", time: "" });

  // Check if user has already applied and if approved
  useEffect(() => {
    let isMounted = true;
    const loadStatus = async () => {
      try {
        const applicationId = localStorage.getItem(applicationIdKey);
        if (!applicationId) {
          if (isMounted) {
            setHasApplied(false);
            setIsApproved(false);
          }
          return;
        }

        if (isMounted) setHasApplied(true);
        const application = await getCompanionApplication(applicationId);
        if (isMounted) setIsApproved(application.status === "approved");
      } catch {
        if (isMounted) {
          setHasApplied(false);
          setIsApproved(false);
        }
      }
    };

    loadStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  // Poll for approval status changes every 2 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const applicationId = localStorage.getItem(applicationIdKey);
        if (!applicationId) return;
        const application = await getCompanionApplication(applicationId);
        setIsApproved(application.status === "approved");
      } catch {
        setIsApproved(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const copyProfileLink = (id: string) => {
    const link = `https://nirvaha.app/companion/${id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Load/save liked companions
  useEffect(() => {
    try {
      const raw = localStorage.getItem("nirvaha_liked_companions");
      if (raw) setLikedIds(JSON.parse(raw));
    } catch { }
  }, []);

  const saveLiked = (next: string[]) => {
    setLikedIds(next);
    try {
      localStorage.setItem("nirvaha_liked_companions", JSON.stringify(next));
    } catch { }
  };

  const toggleLike = (id: string) => {
    const next = likedIds.includes(id)
      ? likedIds.filter((x) => x !== id)
      : [id, ...likedIds];
    saveLiked(next);
  };

  const filteredCompanions = useMemo(
    () => (filter === "liked" ? companions.filter((c) => likedIds.includes(c.id)) : companions),
    [filter, companions, likedIds]
  );

  const companionPalette = [
    "from-emerald-400 to-teal-400",
    "from-lime-400 to-emerald-400",
    "from-cyan-400 to-emerald-500",
    "from-teal-500 to-emerald-600",
  ];

  // Booking helpers
  const openBooking = (companion: any, type: "chat" | "video") => {
    setBooking({ open: true, companion, type, platform: "", date: "", time: "" });
  };

  const submitBooking = () => {
    if (!booking.open || !booking.companion || !booking.type || !booking.platform || !booking.date || !booking.time) return;
    const record = {
      id: crypto.randomUUID?.() || `${Date.now()}`,
      companionId: booking.companion.id,
      companionName: booking.companion.name,
      type: booking.type,
      platform: booking.platform,
      date: booking.date,
      time: booking.time,
      createdAt: Date.now(),
    };
    try {
      const raw = localStorage.getItem("nirvaha_bookings");
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(record);
      localStorage.setItem("nirvaha_bookings", JSON.stringify(arr));
    } catch { }
    setBooking({ open: false, companion: null, type: null, platform: "", date: "", time: "" });
    alert("Booking requested successfully. You'll receive details soon.");
  };

  const handleBookingSubmit = async (formData: any) => {
    try {
      // Mock submission for now
      alert('Booking request received! We will contact you soon.');
      setIsBookingOpen(false);
    } catch (error) {
      alert('Failed to submit booking. Please try again.');
    }
  };

  const handleCancelApplication = async () => {
    if (!confirm('Are you sure you want to cancel your application?')) return;
    try {
      const applicationId = localStorage.getItem(applicationIdKey);
      if (applicationId) {
        await deleteCompanionApplication(applicationId);
      }
      localStorage.removeItem(applicationIdKey);
      setHasApplied(false);
      setIsApproved(false);
      alert('Application cancelled successfully.');
    } catch {
      alert('Failed to cancel application. Please try again.');
    }
  };

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  // Advanced Filter States
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceSort, setPriceSort] = useState<"none" | "low-to-high" | "high-to-low">("none");
  const [priceRanges, setPriceRanges] = useState<string[]>([]); // "under1000", "1000-2000", "above2000"
  const [availabilities, setAvailabilities] = useState<string[]>([]); // "morning", "afternoon", "evening", "night", "today", "week"
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]); // "beginner", "3plus", "5plus", "10plus"
  const [minRating, setMinRating] = useState<number | null>(null); // 4, 4.5, 5
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]); // "English", "Hindi", "Telugu", "Malayalam"

  const categories = [
    { id: "All", label: "All", icon: Sparkles },
    { id: "Meditation", label: "Meditation 🧘", icon: Heart },
    { id: "Counseling", label: "Counseling 💬", icon: MessageCircle },
    { id: "Healing", label: "Healing 🌿", icon: Sparkles },
    { id: "Spiritual", label: "Spiritual Guidance 🕉️", icon: Award },
  ];

  const companionsList = [
    {
      id: "c1",
      name: "Aisha Mehta",
      category: "Meditation",
      title: "Meditation Guide",
      bio: "Helping you find calm through guided meditation and mindfulness techniques.",
      fullAbout: "Aisha Mehta is a mindfulness and meditation guide focused on helping individuals reconnect with inner calm through breathwork, grounding techniques, and emotional awareness practices. Her sessions are designed for people experiencing stress, burnout, overthinking, or emotional exhaustion.",
      experience: ["5+ years guiding meditation and mindfulness sessions", "Conducted 120+ personalized wellness sessions", "Specialized in guided relaxation and emotional balance"],
      sessionStyle: ["Breath-focused meditation", "Calm grounding exercises", "Emotional clarity practices", "Gentle mindfulness coaching"],
      languages: ["English", "Hindi"],
      specialties: ["Calm", "Focus", "Balance", "Stress Relief"],
      availability: "Mon – Sat • 9 AM – 7 PM",
      quote: "Stillness is not emptiness. It is where clarity begins.",
      rating: 4.8,
      sessions: 120,
      price: "₹800",
      hourlyRate: "₹800",
      callRate: "₹400",
      avatar: "/aisha mehta.png",
      energyTags: ["Calm", "Focus", "Balance"],
      color: "from-emerald-400 to-teal-400",
      experienceYears: 5,
      availabilitySlots: ["morning", "afternoon", "evening"]
    },
    {
      id: "c2",
      name: "Arjun Verma",
      category: "Counseling",
      title: "Counseling Expert",
      bio: "Navigating life's complexities with compassion and structured guidance.",
      fullAbout: "Arjun Verma provides compassionate emotional guidance and structured counseling support for individuals navigating anxiety, life transitions, relationship stress, and emotional confusion. His approach combines empathy with practical clarity.",
      experience: ["8+ years in emotional wellness support", "210+ guided counseling sessions", "Focused on emotional resilience and self-growth"],
      sessionStyle: ["Reflective conversations", "Structured emotional guidance", "Confidence-building sessions", "Personal growth mapping"],
      languages: ["English", "Hindi", "Telugu"],
      specialties: ["Clarity", "Support", "Growth", "Emotional Healing"],
      availability: "Mon – Sun • 10 AM – 9 PM",
      quote: "Healing begins when your thoughts finally feel heard.",
      rating: 4.9,
      sessions: 210,
      price: "₹1200",
      hourlyRate: "₹1200",
      callRate: "₹600",
      avatar: "/arjun verma.png",
      energyTags: ["Clarity", "Support", "Growth"],
      color: "from-blue-400 to-indigo-400",
      experienceYears: 8,
      availabilitySlots: ["morning", "afternoon", "evening"]
    },
    {
      id: "c3",
      name: "Kavya Nair",
      category: "Healing",
      title: "Energy Healer",
      bio: "Restoring balance to your mind, body, and spirit through ancient healing arts.",
      fullAbout: "Kavya Nair specializes in holistic healing practices rooted in emotional restoration, body awareness, and energy alignment. Her sessions aim to restore peace, reduce emotional heaviness, and create a sense of inner harmony.",
      experience: ["6+ years in holistic wellness", "95+ healing sessions conducted", "Expertise in energy balancing and emotional restoration"],
      sessionStyle: ["Energy healing", "Emotional release practices", "Aura cleansing sessions", "Mind-body relaxation guidance"],
      languages: ["English", "Malayalam", "Hindi"],
      specialties: ["Restoration", "Peace", "Aura", "Emotional Balance"],
      availability: "Tue – Sun • 11 AM – 6 PM",
      quote: "Your energy speaks long before your words do.",
      rating: 4.7,
      sessions: 95,
      price: "₹1500",
      hourlyRate: "₹1500",
      callRate: "₹750",
      avatar: "/kavya.png",
      energyTags: ["Restoration", "Peace", "Aura"],
      color: "from-amber-400 to-orange-400",
      experienceYears: 6,
      availabilitySlots: ["afternoon", "evening"]
    },
    {
      id: "c4",
      name: "Swami Aarav",
      category: "Spiritual",
      title: "Spiritual Guide",
      bio: "Guiding seekers on the path of self-discovery and spiritual awakening.",
      fullAbout: "Swami Aarav offers spiritual reflection and inner-awareness guidance for seekers exploring meaning, stillness, purpose, and self-understanding. His sessions are calm, reflective, and rooted in conscious living rather than rigid belief systems.",
      experience: ["15+ years guiding spiritual reflection sessions", "500+ one-on-one guidance interactions", "Focused on mindfulness, awareness, and self-discovery"],
      sessionStyle: ["Reflective conversations", "Awareness practices", "Conscious living guidance", "Inner stillness exploration"],
      languages: ["English", "Sanskrit", "Hindi", "Malayalam"],
      specialties: ["Awakening", "Wisdom", "Zen", "Inner Clarity"],
      availability: "Daily • 6 AM – 11 AM",
      quote: "The quieter the mind becomes, the clearer life feels.",
      rating: 5.0,
      sessions: 500,
      price: "₹2000",
      hourlyRate: "₹2000",
      callRate: "₹1000",
      avatar: "/swami.png",
      energyTags: ["Awakening", "Wisdom", "Zen"],
      color: "from-purple-400 to-pink-400",
      experienceYears: 15,
      availabilitySlots: ["morning"]
    },
    {
      id: "c5",
      name: "Riya Kapoor",
      category: "Meditation",
      title: "Mindfulness Coach",
      bio: "Deepening your inner silence through traditional Zen meditation practices.",
      fullAbout: "Riya Kapoor combines mindful movement, breath awareness, and emotional grounding to help individuals reconnect with themselves physically and emotionally. Her sessions are uplifting, calming, and beginner-friendly.",
      experience: ["4+ years in yoga and mindfulness coaching", "Guided wellness routines for stress reduction and self-care", "Focused on emotional wellness through movement"],
      sessionStyle: ["Guided yoga flows", "Breathwork sessions", "Relaxation and posture awareness", "Beginner wellness coaching"],
      languages: ["English", "Hindi", "Telugu"],
      specialties: ["Flexibility", "Calm", "Energy", "Self-Care"],
      availability: "Mon – Fri • 7 AM – 5 PM",
      quote: "Movement becomes healing when done with awareness.",
      rating: 4.9,
      sessions: 180,
      price: "₹900",
      hourlyRate: "₹900",
      callRate: "₹450",
      avatar: "/riya.png",
      energyTags: ["Silence", "Presence", "Flow"],
      color: "from-teal-400 to-cyan-400",
      experienceYears: 4,
      availabilitySlots: ["morning", "afternoon"]
    }
  ];

  const hasActiveFilters = 
    selectedCategories.length > 0 ||
    priceSort !== "none" ||
    priceRanges.length > 0 ||
    availabilities.length > 0 ||
    selectedExperience.length > 0 ||
    minRating !== null ||
    selectedLanguages.length > 0;

  const activeFiltersCount = 
    (selectedCategories.length > 0 ? 1 : 0) +
    (priceSort !== "none" ? 1 : 0) +
    (priceRanges.length > 0 ? 1 : 0) +
    (availabilities.length > 0 ? 1 : 0) +
    (selectedExperience.length > 0 ? 1 : 0) +
    (minRating !== null ? 1 : 0) +
    (selectedLanguages.length > 0 ? 1 : 0);

  const filteredItems = useMemo(() => {
    let result = [...companionsList];

    // 1. Category Filter
    if (selectedCategories.length > 0) {
      result = result.filter(c => {
        // Normalize "Spiritual" vs "Spiritual Guidance" category naming
        const checkCategory = c.category === "Spiritual" ? "Spiritual" : c.category;
        return selectedCategories.includes(checkCategory);
      });
    }

    // 2. Price Tier Range Filter
    if (priceRanges.length > 0) {
      result = result.filter(c => {
        const numericPrice = parseInt(c.price.replace("₹", "")) || 0;
        return priceRanges.some(range => {
          if (range === "under1000") return numericPrice < 1000;
          if (range === "1000-2000") return numericPrice >= 1000 && numericPrice <= 2000;
          if (range === "above2000") return numericPrice > 2000;
          return true;
        });
      });
    }

    // 3. Availability Filter
    if (availabilities.length > 0) {
      result = result.filter(c => {
        const slots = c.availabilitySlots || [];
        return availabilities.some(avail => {
          if (["morning", "afternoon", "evening", "night"].includes(avail)) {
            return slots.includes(avail);
          }
          if (avail === "today") {
            // Static mock logic: Swami Aarav and Aisha Mehta are available today
            return ["c1", "c4"].includes(c.id);
          }
          if (avail === "week") {
            return true; // All are available this week
          }
          return true;
        });
      });
    }

    // 4. Experience Filter
    if (selectedExperience.length > 0) {
      result = result.filter(c => {
        const expYrs = c.experienceYears || 0;
        return selectedExperience.some(exp => {
          if (exp === "beginner") return expYrs < 3;
          if (exp === "3plus") return expYrs >= 3;
          if (exp === "5plus") return expYrs >= 5;
          if (exp === "10plus") return expYrs >= 10;
          return true;
        });
      });
    }

    // 5. Rating Filter
    if (minRating !== null) {
      result = result.filter(c => c.rating >= minRating);
    }

    // 6. Language Filter
    if (selectedLanguages.length > 0) {
      result = result.filter(c => {
        const langs = c.languages || [];
        return selectedLanguages.some(lang => langs.includes(lang));
      });
    }

    // 7. Price Sorting
    if (priceSort === "low-to-high") {
      result.sort((a, b) => {
        const priceA = parseInt(a.price.replace("₹", "")) || 0;
        const priceB = parseInt(b.price.replace("₹", "")) || 0;
        return priceA - priceB;
      });
    } else if (priceSort === "high-to-low") {
      result.sort((a, b) => {
        const priceA = parseInt(a.price.replace("₹", "")) || 0;
        const priceB = parseInt(b.price.replace("₹", "")) || 0;
        return priceB - priceA;
      });
    }

    return result;
  }, [
    companionsList,
    selectedCategories,
    priceRanges,
    availabilities,
    selectedExperience,
    minRating,
    selectedLanguages,
    priceSort
  ]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showTransition && (
          <CompanionTransition onComplete={() => setShowTransition(false)} />
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: showTransition ? 0 : 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen pt-24 pb-16 relative overflow-hidden bg-gradient-to-br from-[#f0f9f6] via-[#ffffff] to-[#f4fbf9]"
      >
        {/* Subtle Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-emerald-100 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-teal-100 rounded-full blur-[100px]"
          />
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 relative z-10">
          
          {isUserApprovedCompanion ? (
            /* =========================================================================
               APPROVED COMPANION WORKSPACE (Unified Dashboard)
               ========================================================================= */
            <div className="space-y-8 text-[#1b4332]">
              {/* Header Banner */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 rounded-[32px] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl"
              >
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3.5 py-1 bg-emerald-400/20 text-emerald-300 text-xs font-black uppercase tracking-wider rounded-full border border-emerald-400/30 backdrop-blur-md">
                        Verified Guide Workspace
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 font-bold text-xs bg-black/20 px-2.5 py-1 rounded-full border border-white/5">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{companionProfile?.rating || 4.9}</span>
                      </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                      Welcome, {companionProfile?.name || user?.name || "Spiritual Guide"}
                    </h1>
                    <p className="text-emerald-200/80 text-sm md:text-base font-medium max-w-2xl">
                      {companionProfile?.bio || "Holding space for healing, mindfulness, and conscious transformation."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveTab("profile")}
                      className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-2xl text-sm transition-all flex items-center gap-2 backdrop-blur-md"
                    >
                      <Settings className="w-4 h-4" />
                      Manage Profile
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveTab("sessions")}
                      className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold rounded-2xl text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      View Schedule
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  {
                    title: "Pending Requests",
                    value: companionSessions.filter(s => s.status?.toLowerCase().includes("pending")).length,
                    icon: AlertCircle,
                    color: "from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-500/20",
                    pulse: companionSessions.filter(s => s.status?.toLowerCase().includes("pending")).length > 0,
                  },
                  {
                    title: "Upcoming Sessions",
                    value: companionSessions.filter(s => s.status === "Session Confirmed" || s.status === "approved").length,
                    icon: Calendar,
                    color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-500/20",
                    pulse: false,
                  },
                  {
                    title: "Completed",
                    value: companionSessions.filter(s => s.status === "completed").length,
                    icon: CheckCircle,
                    color: "from-blue-500/10 to-cyan-500/10 text-blue-600 border-blue-500/20",
                    pulse: false,
                  },
                  {
                    title: "Estimated Earnings",
                    value: `₹${(companionSessions.filter(s => s.status === "completed").length * (parseInt(companionProfile?.hourlyRate?.replace(/[^\d]/g, "")) || 1000)) + 4500}`,
                    icon: DollarSign,
                    color: "from-teal-500/10 to-emerald-500/10 text-teal-600 border-teal-500/20",
                    pulse: false,
                  },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={i}
                      className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-emerald-100/50 shadow-xl shadow-emerald-900/5 flex items-center justify-between group hover:border-emerald-200 transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-black uppercase tracking-wider text-emerald-800/40">{stat.title}</p>
                        <p className="text-2xl md:text-3xl font-black text-emerald-955">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} border flex items-center justify-center relative`}>
                        {stat.pulse && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-ping" />
                        )}
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Workspace Navigation Tabs */}
              <div className="flex border-b border-emerald-100 overflow-x-auto pb-px scrollbar-none gap-2">
                {[
                  { id: "sessions", label: "Active Sessions & Requests", icon: Calendar },
                  { id: "history", label: "History Log", icon: FileText },
                  { id: "analytics", label: "Analytics & Trends", icon: TrendingUp },
                  { id: "profile", label: "Public Profile Card", icon: Users },
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-6 py-4 font-black text-sm flex items-center gap-2.5 transition-all border-b-2 whitespace-nowrap ${
                        isActive
                          ? "border-[#1B4332] text-[#1B4332]"
                          : "border-transparent text-emerald-800/60 hover:text-emerald-800 hover:border-emerald-200"
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Panels */}
              <div className="min-h-[400px]">
                {activeTab === "sessions" && (
                  <div className="space-y-8">
                    {/* Pending Requests Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        <h2 className="text-2xl font-black tracking-tight text-emerald-955">Pending Requests ({companionSessions.filter(s => s.status?.toLowerCase().includes("pending")).length})</h2>
                      </div>

                      {companionSessions.filter(s => s.status?.toLowerCase().includes("pending")).length === 0 ? (
                        <div className="text-center py-12 bg-white/40 rounded-3xl border border-dashed border-emerald-100 flex flex-col items-center">
                          <Users className="w-8 h-8 text-emerald-300 mb-2" />
                          <p className="text-emerald-805/40 font-bold">No pending booking requests at this time.</p>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                          {companionSessions.filter(s => s.status?.toLowerCase().includes("pending")).map((session) => (
                            <motion.div
                              key={session._id || session.id}
                              layout
                              className="bg-white rounded-3xl p-6 border border-emerald-50 shadow-xl flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h3 className="text-lg font-black text-[#1b4332]">{session.userName || "Spiritual Seeker"}</h3>
                                    <p className="text-xs text-emerald-600 font-bold">{session.userEmail}</p>
                                  </div>
                                  <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase tracking-wider rounded-full">
                                    Pending Review
                                  </span>
                                </div>

                                <div className="space-y-3 mb-6 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/50">
                                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800/70">
                                    <Calendar className="w-4 h-4 text-emerald-500" />
                                    <span>Date: {session.date}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800/70">
                                    <Clock className="w-4 h-4 text-emerald-500" />
                                    <span>Time: {session.time}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800/70">
                                    <Video className="w-4 h-4 text-emerald-500" />
                                    <span>Type: {session.type === "chat" ? "💬 Chat Session" : "🎥 Video Call"} ({session.platform})</span>
                                  </div>
                                  {session.notes && (
                                    <div className="pt-2 border-t border-emerald-100 text-xs text-emerald-800/60 leading-relaxed italic">
                                      "{session.notes}"
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-4">
                                <textarea
                                  placeholder="Add custom onboarding message or guidelines..."
                                  value={sessionNotesInput[session._id || session.id] || ""}
                                  onChange={(e) => setSessionNotesInput(prev => ({ ...prev, [session._id || session.id]: e.target.value }))}
                                  className="w-full bg-emerald-50/20 border border-emerald-100 rounded-2xl px-4 py-3 text-xs text-emerald-955 placeholder-emerald-805/40 focus:outline-none focus:border-emerald-500"
                                  rows={2}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                  <button
                                    onClick={() => handleRejectRequest(session._id || session.id)}
                                    disabled={savingStatusId === (session._id || session.id)}
                                    className="py-3 border-2 border-rose-100 hover:border-rose-300 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-black transition-colors"
                                  >
                                    Reject Request
                                  </button>
                                  <button
                                    onClick={() => handleAcceptRequest(session._id || session.id)}
                                    disabled={savingStatusId === (session._id || session.id)}
                                    className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-500/10 transition-colors"
                                  >
                                    Accept & Confirm
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Upcoming Sessions Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <h2 className="text-2xl font-black tracking-tight text-emerald-955">Upcoming Confirmed Sessions ({companionSessions.filter(s => s.status === "Session Confirmed" || s.status === "approved").length})</h2>
                      </div>

                      {companionSessions.filter(s => s.status === "Session Confirmed" || s.status === "approved").length === 0 ? (
                        <div className="text-center py-12 bg-white/40 rounded-3xl border border-dashed border-emerald-100 flex flex-col items-center">
                          <Calendar className="w-8 h-8 text-emerald-300 mb-2" />
                          <p className="text-emerald-805/40 font-bold">No upcoming sessions scheduled yet.</p>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                          {companionSessions.filter(s => s.status === "Session Confirmed" || s.status === "approved").map((session) => (
                            <motion.div
                              key={session._id || session.id}
                              layout
                              className="bg-white rounded-3xl p-6 border border-emerald-50 shadow-xl flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h3 className="text-lg font-black text-[#1b4332]">{session.userName || "Spiritual Seeker"}</h3>
                                    <p className="text-xs text-emerald-600 font-bold">{session.userEmail}</p>
                                  </div>
                                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider rounded-full">
                                    Confirmed
                                  </span>
                                </div>

                                <div className="space-y-3 mb-6 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/50">
                                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800/70">
                                    <Calendar className="w-4 h-4 text-emerald-500" />
                                    <span>Date: {session.date}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800/70">
                                    <Clock className="w-4 h-4 text-emerald-500" />
                                    <span>Time: {session.time}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800/70">
                                    <Video className="w-4 h-4 text-emerald-500" />
                                    <span>Type: {session.type === "chat" ? "💬 Chat Session" : "🎥 Video Call"} ({session.platform})</span>
                                  </div>
                                  {session.sessionNotes && (
                                    <div className="pt-2 border-t border-emerald-100 text-xs text-emerald-800/60 leading-relaxed italic">
                                      Guide Notes: "{session.sessionNotes}"
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <button
                                  onClick={() => handleMarkCompleted(session._id || session.id)}
                                  disabled={savingStatusId === (session._id || session.id)}
                                  className="py-3 border-2 border-emerald-100 hover:border-emerald-300 text-emerald-700 rounded-xl text-xs font-black transition-colors"
                                >
                                  Mark Completed
                                </button>
                                <button
                                  onClick={() => setActiveVideoSession(session)}
                                  className="py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 transition-all"
                                >
                                  <Video className="w-4 h-4" />
                                  Start Video Session
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "history" && (
                  <div className="bg-white rounded-[32px] p-6 md:p-8 border border-emerald-50 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-black text-emerald-955">Session History Archive</h2>
                    </div>

                    {companionSessions.filter(s => s.status === "completed" || s.status === "rejected").length === 0 ? (
                      <div className="text-center py-20 flex flex-col items-center">
                        <FileText className="w-12 h-12 text-emerald-200 mb-4" />
                        <p className="text-xl text-emerald-805/40 font-bold">Your session history is currently empty.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-emerald-50 text-emerald-800/40 text-xs font-black uppercase tracking-wider">
                              <th className="py-4">Client</th>
                              <th className="py-4">Type</th>
                              <th className="py-4">Date/Time</th>
                              <th className="py-4">Status</th>
                              <th className="py-4">Feedback / Notes</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-emerald-50 text-sm font-semibold text-emerald-955">
                            {companionSessions
                              .filter(s => s.status === "completed" || s.status === "rejected")
                              .map((session) => (
                                <tr key={session._id || session.id} className="hover:bg-emerald-50/20 transition-colors">
                                  <td className="py-4 pr-4">
                                    <div className="font-bold">{session.userName || "Spiritual Seeker"}</div>
                                    <div className="text-xs text-emerald-800/50 font-normal">{session.userEmail}</div>
                                  </td>
                                  <td className="py-4">
                                    <span className="capitalize">{session.type} ({session.platform})</span>
                                  </td>
                                  <td className="py-4">
                                    <div>{session.date}</div>
                                    <div className="text-xs text-emerald-800/50 font-normal">{session.time}</div>
                                  </td>
                                  <td className="py-4">
                                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${
                                      session.status === "completed"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-rose-50 text-rose-700 border-rose-200"
                                    }`}>
                                      {session.status}
                                    </span>
                                  </td>
                                  <td className="py-4 max-w-xs text-xs text-emerald-800/60 leading-relaxed italic">
                                    {session.sessionNotes || "No notes logged."}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "analytics" && (
                  <div className="space-y-8">
                    <div className="grid lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 bg-white rounded-[32px] p-6 md:p-8 border border-emerald-50 shadow-2xl">
                        <h3 className="text-lg font-black text-emerald-955 mb-6 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-emerald-600" />
                          Practice Earnings Trend (Weekly)
                        </h3>
                        <div className="h-80 w-full font-sans text-xs">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                              { day: "Mon", earnings: 2400, hours: 3 },
                              { day: "Tue", earnings: 3600, hours: 4.5 },
                              { day: "Wed", earnings: 1800, hours: 2.25 },
                              { day: "Thu", earnings: 4800, hours: 6 },
                              { day: "Fri", earnings: 6000, hours: 7.5 },
                              { day: "Sat", earnings: 7200, hours: 9 },
                              { day: "Sun", earnings: 5400, hours: 6.75 },
                            ]}>
                              <defs>
                                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdf4" />
                              <XAxis dataKey="day" stroke="#1b4332" />
                              <YAxis stroke="#1b4332" tickFormatter={(v) => `₹${v}`} />
                              <Tooltip formatter={(value) => [`₹${value}`, "Earnings"]} />
                              <Area type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="bg-white rounded-[32px] p-6 md:p-8 border border-emerald-50 shadow-2xl flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-black text-emerald-955 mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-emerald-600" />
                            Session Breakdown
                          </h3>
                          <div className="h-64 w-full text-xs">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[
                                { name: "Pending", count: companionSessions.filter(s => s.status?.toLowerCase().includes("pending")).length },
                                { name: "Confirmed", count: companionSessions.filter(s => s.status === "Session Confirmed" || s.status === "approved").length },
                                { name: "Completed", count: companionSessions.filter(s => s.status === "completed").length },
                                { name: "Rejected", count: companionSessions.filter(s => s.status === "rejected").length },
                              ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdf4" />
                                <XAxis dataKey="name" stroke="#1b4332" />
                                <YAxis stroke="#1b4332" allowDecimals={false} />
                                <Tooltip formatter={(value) => [value, "Count"]} />
                                <Bar dataKey="count" fill="#14b8a6" radius={[8, 8, 0, 0]}>
                                  {[
                                    <Cell key="cell-0" fill="#f59e0b" />,
                                    <Cell key="cell-1" fill="#10b981" />,
                                    <Cell key="cell-2" fill="#3b82f6" />,
                                    <Cell key="cell-3" fill="#ef4444" />,
                                  ]}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-emerald-50 text-xs text-emerald-805/50 leading-relaxed font-bold text-center">
                          Breakdown of all registered practice sessions inside Nirvaha.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "profile" && (
                  <div className="bg-white rounded-[40px] p-6 md:p-10 border border-emerald-50 shadow-2xl text-[#1b4332]">
                    <div className="flex flex-col lg:flex-row gap-10 items-start">
                      <div className="w-full lg:w-1/3 flex flex-col items-center">
                        <div className="relative w-48 h-48 mb-6">
                          <img
                            src={companionProfile?.avatar || "/swami.png"}
                            alt={companionProfile?.name || "Avatar"}
                            className="w-full h-full object-cover rounded-[32px] border-4 border-emerald-100 shadow-2xl"
                          />
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center text-white">
                            <Check className="w-4 h-4" />
                          </div>
                        </div>

                        <h3 className="text-2xl font-black text-emerald-955 text-center mb-1">
                          {companionProfile?.name || "Your Name"}
                        </h3>
                        <p className="text-sm font-bold text-emerald-600 mb-4 uppercase tracking-wider">
                          {companionProfile?.title || companionProfile?.category || "Spiritual Guide"}
                        </p>

                        <div className="w-full grid grid-cols-2 gap-3 py-4 border-t border-b border-emerald-50 mb-6">
                          <div className="text-center">
                            <p className="text-[10px] font-black uppercase text-emerald-800/40">Hourly Rate</p>
                            <p className="text-base font-bold text-emerald-955">{companionProfile?.hourlyRate || "₹1000"}</p>
                          </div>
                          <div className="text-center border-l border-emerald-50">
                            <p className="text-[10px] font-black uppercase text-emerald-800/40">Per Call Rate</p>
                            <p className="text-base font-bold text-emerald-955">{companionProfile?.callRate || "₹500"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800/70">
                          <MapPin className="w-4 h-4 text-emerald-500" />
                          <span>{companionProfile?.location || "India"}</span>
                        </div>
                      </div>

                      <div className="w-full lg:w-2/3 space-y-6">
                        <div>
                          <h4 className="text-sm font-black uppercase tracking-wider text-emerald-855 mb-2">Expert Bio & Guidelines</h4>
                          <p className="text-sm leading-relaxed text-emerald-800/70 bg-emerald-50/20 p-5 rounded-2xl border border-emerald-50">
                            {companionProfile?.fullAbout || companionProfile?.bio || "No expanded bio provided."}
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-black uppercase tracking-wider text-emerald-855 mb-3">Guiding Specialties</h4>
                            <div className="flex flex-wrap gap-2">
                              {companionProfile?.specialties?.map((tag: string, i: number) => (
                                <span key={i} className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                                  {tag}
                                </span>
                              )) || <span className="text-xs text-emerald-800/40">No specialties listed.</span>}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-black uppercase tracking-wider text-emerald-855 mb-3">Spoken Languages</h4>
                            <div className="flex flex-wrap gap-2">
                              {companionProfile?.languages?.map((lang: string, i: number) => (
                                <span key={i} className="px-3.5 py-1.5 bg-teal-50 text-teal-700 text-xs font-bold rounded-full border border-teal-100">
                                  {lang}
                                </span>
                              )) || <span className="text-xs text-emerald-800/40">No languages listed.</span>}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-black uppercase tracking-wider text-emerald-855 mb-3">Guiding Schedule</h4>
                          <div className="flex items-center gap-2 text-sm text-emerald-800 font-bold bg-lime-50/30 px-4 py-3.5 rounded-2xl border border-lime-100/50">
                            <Clock className="w-5 h-5 text-emerald-500" />
                            <span>{companionProfile?.availability || "Mon – Sat • 9 AM – 6 PM"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* =========================================================================
               STANDARD ONBOARDING / BROWSING STATE
               ========================================================================= */
            <>
              {/* Onboarding Notification Widgets */}
              {user?.companionStatus === "pending" || (hasApplied && !isApproved) ? (
                <motion.div
                  initial={{ opacity: 0, y: -25 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-10 p-6 md:p-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-[32px] shadow-lg text-[#1b4332]"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 border border-amber-200">
                        <Clock className="w-6 h-6 animate-spin" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-[#1b4332] mb-1">Application Under Review ⏳</h3>
                        <p className="text-xs md:text-sm text-emerald-800/70 max-w-xl font-medium leading-relaxed">
                          Thank you for applying to be a Spiritual Guide on Nirvaha! Our administrators are currently reviewing your qualifications and bio. You will gain full access to the interactive Companion Workspace once approved.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleCancelApplication}
                      className="px-5 py-3 border-2 border-amber-250 hover:bg-amber-100/50 text-amber-805 font-extrabold rounded-2xl text-xs tracking-wide uppercase transition-colors"
                    >
                      Cancel Application
                    </button>
                  </div>
                </motion.div>
              ) : user?.companionStatus === "rejected" ? (
                <motion.div
                  initial={{ opacity: 0, y: -25 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-10 p-6 md:p-8 bg-gradient-to-r from-rose-50 to-red-50 border-2 border-rose-200 rounded-[32px] shadow-lg text-[#1b4332]"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 border border-rose-200">
                        <XCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-[#1b4332] mb-1">Application Declined ❌</h3>
                        <p className="text-xs md:text-sm text-emerald-800/70 max-w-xl font-medium leading-relaxed">
                          Unfortunately, your application to guide seekers on Nirvaha could not be approved at this time. Feel free to reach out to our support team for constructive feedback, or submit a revised application later.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2.5">
                      <button
                        onClick={handleCancelApplication}
                        className="px-5 py-3 border-2 border-rose-250 hover:bg-rose-100/50 text-rose-805 font-extrabold rounded-2xl text-xs tracking-wide uppercase transition-colors"
                      >
                        Clear Status
                      </button>
                      <button
                        onClick={() => setIsApplicationModalOpen(true)}
                        className="px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-2xl text-xs tracking-wide uppercase shadow-lg shadow-rose-600/10 transition-colors"
                      >
                        Re-apply Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : null}

              {/* Original Search Guide Directory UI */}
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight text-emerald-955 font-black">
                  Find Your Perfect <br/>
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Spiritual Guide</span>
                </h1>
                <p className="max-w-3xl mx-auto text-xl text-emerald-800/70 mb-10 leading-relaxed font-medium">
                  Book 1-on-1 sessions with experienced spiritual teachers, meditation
                  guides, and wellness coaches. Pay per hour or per call.
                </p>

                {/* Interactive CTA Section */}
                <div className="mt-16 flex flex-col items-center justify-center gap-6 w-full max-w-4xl mx-auto relative z-10">
                  <div className="grid md:grid-cols-2 gap-6 w-full">
                    {/* Primary CTA: Book a Session */}
                    <motion.div
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedCompanion(null);
                        setIsBookingOpen(true);
                      }}
                      className="bg-emerald-900 rounded-[32px] p-8 cursor-pointer shadow-2xl shadow-emerald-900/20 relative overflow-hidden group text-left"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-bl-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-800/50 rounded-tr-full -translate-x-5 translate-y-5" />
                      
                      <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex items-start justify-between mb-8">
                          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <Heart className="w-7 h-7 text-emerald-300 group-hover:text-white transition-colors" />
                          </div>
                          <Sparkles className="w-6 h-6 text-emerald-400/50 group-hover:text-emerald-300 animate-pulse" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Book a Healing Session</h3>
                          <p className="text-emerald-100/70 font-medium line-clamp-2">Connect with experienced guides for personalized wellness & spiritual support.</p>
                          <div className="mt-6 flex items-center text-emerald-300 font-bold group-hover:text-white transition-colors gap-2 text-sm uppercase tracking-wider">
                            Find a Guide <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Secondary CTA: Apply as a Companion */}
                    <motion.div
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsApplicationModalOpen(true)}
                      className="bg-white/70 backdrop-blur-xl border border-white rounded-[32px] p-8 cursor-pointer shadow-xl shadow-emerald-900/5 relative overflow-hidden group text-left"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-0 right-0 w-40 h-40 bg-teal-100/40 rounded-full blur-3xl group-hover:bg-teal-200/40 transition-colors duration-500 pointer-events-none" />
                      
                      <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex items-start justify-between mb-8">
                          <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center">
                            <Users className="w-7 h-7" />
                          </div>
                          <TrendingUp className="w-6 h-6 text-emerald-500/30 group-hover:text-emerald-500 animate-pulse" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-emerald-950 mb-2 tracking-tight">Apply as a Companion</h3>
                          <p className="text-emerald-800/60 font-medium line-clamp-2">Share your spiritual wisdom, lead guided sessions, and earn on Nirvaha.</p>
                          <div className="mt-6 flex items-center text-emerald-700 font-bold group-hover:text-emerald-900 transition-colors gap-2 text-sm uppercase tracking-wider">
                            Apply Now <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="mt-4 flex flex-col items-center">
                    <p className="text-emerald-805/60 text-sm font-medium tracking-wide">
                      Choose your journey — receive healing or help others heal.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Category Selection & Advanced Filter Toggle */}
              <div className="flex flex-col gap-6 mb-16">
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {categories.map((cat) => {
                    const isCatSelected = cat.id === "All"
                      ? selectedCategories.length === 0
                      : selectedCategories.includes(cat.id);
                    return (
                      <motion.button
                        key={cat.id}
                        layout
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (cat.id === "All") {
                            setSelectedCategories([]);
                          } else {
                            setSelectedCategories([cat.id]);
                          }
                        }}
                        className={`px-8 py-4 rounded-full flex items-center gap-3 transition-all duration-300 font-bold border-2 ${
                          isCatSelected 
                          ? "bg-[#1B4332] border-[#1B4332] text-white shadow-xl shadow-[#1B4332]/20" 
                          : "bg-white border-emerald-100 text-emerald-800 hover:border-emerald-300 hover:bg-emerald-50/50"
                        }`}
                      >
                        {cat.label}
                      </motion.button>
                    );
                  })}

                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className={`px-8 py-4 rounded-full flex items-center gap-3 transition-all duration-300 font-bold border-2 ${
                      isFiltersOpen || hasActiveFilters
                      ? "bg-[#52B788] border-[#52B788] text-white shadow-xl shadow-[#52B788]/20"
                      : "bg-white border-emerald-100 text-emerald-800 hover:border-emerald-300"
                    }`}
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                    Advanced Filters
                    {hasActiveFilters && (
                      <span className="bg-emerald-800 text-white text-xs px-2.5 py-0.5 rounded-full font-extrabold shadow-sm animate-pulse">
                        {activeFiltersCount}
                      </span>
                    )}
                  </motion.button>
                </div>

                {/* Collapsible Advanced Filters Section */}
                <AnimatePresence>
                  {isFiltersOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden w-full max-w-6xl mx-auto"
                    >
                      <div className="bg-white/70 backdrop-blur-xl border border-emerald-100/80 rounded-[32px] p-6 sm:p-8 mt-2 shadow-2xl shadow-emerald-900/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-[#1b4332] relative">
                        
                        {/* 1. Category Filter Column */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800/60 mb-2">Category Filters</h4>
                          <div className="flex flex-col gap-2">
                            {["Meditation", "Counseling", "Healing", "Spiritual"].map((catName) => {
                              const actualLabel = catName === "Spiritual" ? "Spiritual Guidance 🕉️" : catName;
                              const isChecked = selectedCategories.includes(catName);
                              return (
                                <button
                                  key={catName}
                                  onClick={() => {
                                    setSelectedCategories(prev => 
                                      prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
                                    );
                                  }}
                                  className={`flex items-center justify-between px-4 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                                    isChecked 
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm shadow-emerald-100" 
                                    : "bg-white/50 border-gray-100 hover:border-emerald-100 text-emerald-955/70"
                                  }`}
                                >
                                  <span>{actualLabel}</span>
                                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${isChecked ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300"}`}>
                                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2. Price / Rate Filters Column */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800/60 mb-2">Price & Sorting</h4>
                          
                          {/* Sort Toggle */}
                          <div className="flex gap-2 mb-3">
                            <button
                              onClick={() => setPriceSort(priceSort === "low-to-high" ? "none" : "low-to-high")}
                              className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                                priceSort === "low-to-high"
                                ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                                : "bg-white/50 border-gray-100 text-emerald-955/70 hover:border-emerald-100"
                              }`}
                            >
                              ₹ Low to High
                            </button>
                            <button
                              onClick={() => setPriceSort(priceSort === "high-to-low" ? "none" : "high-to-low")}
                              className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                                priceSort === "high-to-low"
                                ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                                : "bg-white/50 border-gray-100 text-emerald-955/70 hover:border-emerald-100"
                              }`}
                            >
                              ₹ High to Low
                            </button>
                          </div>

                          <div className="flex flex-col gap-2">
                            {[
                              { id: "under1000", label: "Under ₹1000" },
                              { id: "1000-2000", label: "₹1000 – ₹2000" },
                              { id: "above2000", label: "Above ₹2000" }
                            ].map((range) => {
                              const isChecked = priceRanges.includes(range.id);
                              return (
                                <button
                                  key={range.id}
                                  onClick={() => {
                                    setPriceRanges(prev => 
                                      prev.includes(range.id) ? prev.filter(r => r !== range.id) : [...prev, range.id]
                                    );
                                  }}
                                  className={`flex items-center justify-between px-4 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                                    isChecked 
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm" 
                                    : "bg-white/50 border-gray-100 hover:border-emerald-100 text-emerald-955/70"
                                  }`}
                                >
                                  <span>{range.label}</span>
                                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${isChecked ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300"}`}>
                                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 3. Availability / Time Filters Column */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800/60 mb-2">Availability & Time</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: "morning", label: "🌅 Morning" },
                              { id: "afternoon", label: "☀️ Afternoon" },
                              { id: "evening", label: "🌙 Evening" },
                              { id: "night", label: "🌌 Night" }
                            ].map((slot) => {
                              const isChecked = availabilities.includes(slot.id);
                              return (
                                <button
                                  key={slot.id}
                                  onClick={() => {
                                    setAvailabilities(prev => 
                                      prev.includes(slot.id) ? prev.filter(a => a !== slot.id) : [...prev, slot.id]
                                    );
                                  }}
                                  className={`py-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                                    isChecked 
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-850 shadow-sm" 
                                    : "bg-white/50 border-gray-100 hover:border-emerald-100 text-emerald-955/70"
                                  }`}
                                >
                                  {slot.label}
                                </button>
                              );
                            })}
                          </div>
                          <div className="flex flex-col gap-2 mt-2">
                            {[
                              { id: "today", label: "Available Today ⚡" },
                              { id: "week", label: "Available This Week 📅" }
                            ].map((dayOption) => {
                              const isChecked = availabilities.includes(dayOption.id);
                              return (
                                <button
                                  key={dayOption.id}
                                  onClick={() => {
                                      setAvailabilities(prev => 
                                        prev.includes(dayOption.id) ? prev.filter(a => a !== dayOption.id) : [...prev, dayOption.id]
                                      );
                                  }}
                                  className={`flex items-center justify-between px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
                                    isChecked 
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-850 shadow-sm" 
                                    : "bg-white/50 border-gray-100 hover:border-emerald-100 text-emerald-955/70"
                                  }`}
                                >
                                  <span>{dayOption.label}</span>
                                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${isChecked ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300"}`}>
                                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 4. Experience Filters Column */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800/60 mb-2">Experience Level</h4>
                          <div className="flex flex-col gap-2">
                            {[
                              { id: "beginner", label: "Beginner Friendly (< 3 Yrs)" },
                              { id: "3plus", label: "3+ Years Experience" },
                              { id: "5plus", label: "5+ Years Experience" },
                              { id: "10plus", label: "10+ Years Experience" }
                            ].map((exp) => {
                              const isChecked = selectedExperience.includes(exp.id);
                              return (
                                <button
                                  key={exp.id}
                                  onClick={() => {
                                    setSelectedExperience(prev => 
                                      prev.includes(exp.id) ? prev.filter(e => e !== exp.id) : [...prev, exp.id]
                                    );
                                  }}
                                  className={`flex items-center justify-between px-4 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                                    isChecked 
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-850 shadow-sm" 
                                    : "bg-white/50 border-gray-100 hover:border-emerald-100 text-emerald-955/70"
                                  }`}
                                >
                                  <span>{exp.label}</span>
                                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${isChecked ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300"}`}>
                                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 5. Rating Filters Column */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800/60 mb-2">Ratings & Feedback</h4>
                          <div className="flex flex-col gap-2">
                            {[
                              { id: 4, label: "4.0 ★ & Above" },
                              { id: 4.5, label: "4.5 ★ & Above" },
                              { id: 5, label: "5.0 ★ Rated Only" }
                            ].map((ratingOption) => {
                              const isSelected = minRating === ratingOption.id;
                              return (
                                <button
                                  key={ratingOption.id}
                                  onClick={() => {
                                    setMinRating(minRating === ratingOption.id ? null : ratingOption.id);
                                  }}
                                  className={`flex items-center justify-between px-4 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                                    isSelected 
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-850 shadow-sm shadow-emerald-100" 
                                    : "bg-white/50 border-gray-100 hover:border-emerald-100 text-emerald-955/70"
                                  }`}
                                >
                                  <span className="flex items-center gap-1">
                                    {ratingOption.label}
                                  </span>
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300"}`}>
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 6. Language Filters Column */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800/60 mb-2">Fluent Languages</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {["English", "Hindi", "Telugu", "Malayalam"].map((lang) => {
                              const isChecked = selectedLanguages.includes(lang);
                              return (
                                <button
                                  key={lang}
                                  onClick={() => {
                                    setSelectedLanguages(prev => 
                                      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
                                    );
                                  }}
                                  className={`py-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                                    isChecked 
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-855 shadow-sm" 
                                    : "bg-white/50 border-gray-100 hover:border-emerald-100 text-emerald-955/70"
                                  }`}
                                >
                                  {lang}
                                </button>
                              );
                            })}
                          </div>
                          
                          {/* Clear Filters Action Row */}
                          <div className="pt-4 flex justify-end">
                            <button
                              onClick={() => {
                                setSelectedCategories([]);
                                setPriceSort("none");
                                setPriceRanges([]);
                                setAvailabilities([]);
                                setSelectedExperience([]);
                                setMinRating(null);
                                setSelectedLanguages([]);
                              }}
                              className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Clear All Filters
                            </button>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Grid Section */}
              <div className="relative min-h-[600px]">
                <AnimatePresence mode="wait">
                  {filteredItems.length === 0 ? (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center py-20 flex flex-col items-center w-full col-span-full"
                    >
                      <div className="w-24 h-24 bg-emerald-50 rounded-[40px] flex items-center justify-center mb-8 border border-emerald-100">
                        <Sparkles className="w-10 h-10 text-emerald-300" />
                      </div>
                      <h2 className="text-4xl font-bold text-[#1B4332] mb-4">No guides match your active filters 🌿</h2>
                      <p className="text-xl text-emerald-800/60 max-w-lg mx-auto mb-10">Try relaxing your search terms or clear your filters to explore our full network of spiritual guides.</p>
                      <button 
                        onClick={() => {
                          setSelectedCategories([]);
                          setPriceSort("none");
                          setPriceRanges([]);
                          setAvailabilities([]);
                          setSelectedExperience([]);
                          setMinRating(null);
                          setSelectedLanguages([]);
                        }}
                        className="px-10 py-4 bg-[#1B4332] hover:bg-emerald-900 text-white rounded-2xl font-bold shadow-lg transition-all flex items-center gap-2 mx-auto"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Clear All Filters
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key={selectedCategories.join("-") || "all"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                      {filteredItems.map((companion) => (
                        <motion.div
                          key={companion.id}
                          layout
                          whileHover={{ y: -12 }}
                          className="bg-white rounded-[48px] p-8 border border-emerald-50 shadow-2xl shadow-emerald-900/5 flex flex-col group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/10 via-transparent to-teal-50/10 pointer-events-none" />
                          <div className="relative mb-8 flex flex-col items-center text-center">
                            <div className="relative w-32 h-32 mb-6">
                              <div className={`absolute inset-0 bg-gradient-to-tr ${companion.color} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl z-10">
                                <img src={companion.avatar} alt={companion.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              </div>
                              <div className="absolute bottom-1 right-3 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full z-20" />
                            </div>
                            <div className="z-10">
                              <h3 className="text-2xl font-black text-emerald-955 mb-1">{companion.name}</h3>
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-emerald-100">
                                <Sparkles className="w-3 h-3" />
                                {companion.category}
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 text-center mb-8">
                            <p className="text-emerald-800/70 text-sm leading-relaxed mb-6 italic line-clamp-2">"{companion.bio}"</p>
                            <div className="flex flex-wrap justify-center gap-2 mb-4 font-semibold">
                              {companion.energyTags.map((tag) => (
                                <span key={tag} className="px-4 py-1.5 bg-white border border-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full shadow-sm">{tag}</span>
                              ))}
                            </div>

                            <motion.button
                              onClick={() => setSelectedCompanion(companion)}
                              whileHover={{ x: 5 }}
                              className="inline-flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-500 transition-colors mb-6 group/link"
                            >
                              View Full Profile <ChevronRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                            </motion.button>
                            <div className="grid grid-cols-3 gap-2 py-4 bg-emerald-50/40 rounded-3xl border border-emerald-50">
                              <div className="flex flex-col items-center border-r border-emerald-100">
                                <div className="flex items-center gap-1 mb-0.5">
                                  <Star className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                                  <span className="text-xs font-black text-emerald-955">{companion.rating}</span>
                                </div>
                                <span className="text-[8px] uppercase tracking-tighter font-bold text-emerald-805/40 text-center">Rating</span>
                              </div>
                              <div className="flex flex-col items-center border-r border-emerald-100">
                                <span className="text-xs font-black text-emerald-955 mb-0.5">{companion.sessions}+</span>
                                <span className="text-[8px] uppercase tracking-tighter font-bold text-emerald-805/40 text-center">Sessions</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-xs font-black text-emerald-900 mb-0.5">{companion.price}</span>
                                <span className="text-[8px] uppercase tracking-tighter font-bold text-emerald-805/40 text-center">Per Hour</span>
                              </div>
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedCompanion(companion);
                              setIsBookingOpen(true);
                            }}
                            className="w-full py-4 bg-emerald-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-900/10 hover:shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 group/btn"
                          >
                            Book Session Now
                            <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                          </motion.button>
                          <div className="absolute inset-0 border-2 border-emerald-500/0 group-hover:border-emerald-500/10 rounded-[48px] transition-colors pointer-events-none" />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}

        </div>

        {/* Enhanced 24/7 Connect Button */}
        <motion.div 
          className="fixed bottom-10 right-10 z-40"
          initial={{ x: 100 }}
          animate={{ x: 0 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsConnectModalOpen(true)}
            className="px-8 py-5 bg-emerald-900 text-white rounded-full shadow-2xl flex items-center gap-3 font-bold border-4 border-white"
          >
            <Clock className="w-6 h-6 animate-pulse" />
            24/7 Connect
          </motion.button>
        </motion.div>

        {/* Connect Modal Overlay */}
        <AnimatePresence>
          {isConnectModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-emerald-950/40 backdrop-blur-md flex items-center justify-center p-6"
              onClick={() => setIsConnectModalOpen(false)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl text-center"
              >
                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <MessageCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-emerald-955 mb-4">Instantly connect</h2>
                <p className="text-emerald-800/60 mb-10">Available guides are ready to support you right now.</p>
                
                <div className="grid gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-5 bg-emerald-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Chat Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-5 bg-emerald-50 text-emerald-900 rounded-2xl font-bold flex items-center justify-center gap-3"
                  >
                    <Phone className="w-5 h-5" />
                    Talk Now
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Modal */}
        {selectedCompanion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCompanion(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col"
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedCompanion(null)}
                className="absolute top-6 right-6 z-50 w-10 h-10 bg-emerald-50 text-emerald-900 rounded-full flex items-center justify-center hover:bg-emerald-100 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-emerald-50 p-8 sm:p-10">
                {/* Avatar positioned prominently */}
                <div className="mb-8 flex justify-center">
                  <div className="inline-block relative">
                    <img
                      src={selectedCompanion.avatar || selectedCompanion.profileImage || "/meditation/wellness1.jpeg"}
                      alt={selectedCompanion.name}
                      className="w-40 h-40 sm:w-48 sm:h-48 rounded-[2rem] shadow-2xl object-cover border-4 border-white bg-white"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full shadow-lg" />
                  </div>
                </div>

                <div className="mb-8 text-center">
                  <h2 className="text-3xl sm:text-4xl font-black text-teal-950 mb-2">
                    {selectedCompanion.name}
                  </h2>
                  <p className="text-teal-600 font-bold mb-4 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {selectedCompanion.title}
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-lime-50 rounded-lg border border-lime-100">
                      <Star className="w-4 h-4 fill-lime-500 text-lime-500" />
                      <span className="text-teal-900 font-black">
                        {selectedCompanion.rating ?? 4.8}
                      </span>
                      <span className="text-teal-600/70 font-medium">
                        ({selectedCompanion.reviews ?? 0} reviews)
                      </span>
                    </div>
                    
                    {selectedCompanion.location && (
                      <div className="flex items-center gap-2 text-teal-700 font-bold">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        {selectedCompanion.location}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Quote */}
                  {selectedCompanion.quote && (
                    <div className="p-4 bg-teal-50 border-l-4 border-teal-500 rounded-r-xl">
                      <p className="text-teal-805 italic font-medium">"{selectedCompanion.quote}"</p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-semibold text-teal-800 mb-2">About</h4>
                    <p className="text-sm text-teal-750 leading-relaxed">{selectedCompanion.fullAbout || selectedCompanion.bio}</p>
                  </div>

                  {selectedCompanion.experience && selectedCompanion.experience.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-teal-800 mb-2">Experience</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedCompanion.experience.map((exp: string, idx: number) => (
                          <li key={idx} className="text-sm text-teal-750">{exp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedCompanion.sessionStyle && selectedCompanion.sessionStyle.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-teal-800 mb-2">Session Style</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedCompanion.sessionStyle.map((style: string, idx: number) => (
                          <li key={idx} className="text-sm text-teal-750">{style}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-semibold text-teal-800 mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {(selectedCompanion.specialties || []).map(
                        (specialty: string, j: number) => (
                          <span
                            key={j}
                            className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium"
                          >
                            {specialty}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-teal-800 mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {(selectedCompanion.languages || []).map(
                        (language: string, j: number) => (
                          <span
                            key={j}
                            className="px-3 py-1 bg-teal-100 text-teal-700 text-xs rounded-full font-medium"
                          >
                            {language}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {selectedCompanion.availability && (
                    <div>
                      <h4 className="text-sm font-semibold text-teal-800 mb-2">Availability</h4>
                      <div className="flex items-center gap-2 text-sm text-teal-750">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        <span>{selectedCompanion.availability}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 mt-6 mb-6">
                  <h4 className="text-sm font-semibold text-teal-800 mb-3">Booking Options</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-teal-600">Hourly Rate</p>
                          <p className="text-lg font-bold text-teal-800">
                            {selectedCompanion.hourlyRate}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openBooking(selectedCompanion, 'chat')}
                        className={`w-full py-2 bg-gradient-to-r ${selectedCompanion.color} text-white rounded-lg text-sm font-semibold`}
                      >
                        Book Chat
                      </motion.button>
                    </div>

                    <div className="bg-white rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                          <Phone className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-teal-600">Per Call</p>
                          <p className="text-lg font-bold text-teal-800">
                            {selectedCompanion.callRate}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openBooking(selectedCompanion, 'video')}
                        className={`w-full py-2 bg-gradient-to-r ${selectedCompanion.color} text-white rounded-lg text-sm font-semibold`}
                      >
                        Book Video
                      </motion.button>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => copyProfileLink(selectedCompanion.id)}
                  className="w-full py-3 bg-white border-2 border-emerald-200 rounded-2xl text-teal-800 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  {copiedId === selectedCompanion.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      Profile Link Copied!
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Share Profile Card
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Booking Modal */}
        {booking.open && booking.companion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBooking({ open: false, companion: null, type: null, platform: "", date: "", time: "" })}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[32px] max-w-lg w-full shadow-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <img src={booking.companion.avatar} alt={booking.companion.name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="text-teal-800 font-bold">Book {booking.companion.name}</h4>
                  <p className="text-sm text-teal-600">{booking.type === 'chat' ? 'Chat Session' : 'Video Call'}</p>
                </div>
              </div>

              {/* Platform selection */}
              <div className="mb-4">
                <p className="text-sm text-teal-700 mb-2">Choose Platform</p>
                <div className="grid grid-cols-2 gap-2">
                  {(booking.type === 'chat'
                    ? ['In-App Chat', 'WhatsApp', 'Telegram', 'Signal']
                    : ['Google Meet', 'Zoom', 'Microsoft Teams'])
                    .map((p) => (
                      <button
                        key={p}
                        onClick={() => setBooking({ ...booking, platform: p })}
                        className={`px-3 py-2 rounded-xl border text-sm font-semibold transition-all ${booking.platform === p ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent' : 'bg-white border-emerald-200 text-teal-800 hover:bg-emerald-50'}`}
                      >
                        {p}
                      </button>
                    ))}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-sm text-teal-700 mb-1">Date</p>
                  <input
                    type="date"
                    value={booking.date}
                    onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-teal-800 bg-white"
                  />
                </div>
                <div>
                  <p className="text-sm text-teal-700 mb-1">Time</p>
                  <input
                    type="time"
                    value={booking.time}
                    onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-teal-800 bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setBooking({ open: false, companion: null, type: null, platform: '', date: '', time: '' })}
                  className="flex-1 px-4 py-3 rounded-xl border border-emerald-200 text-teal-800 hover:bg-emerald-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={submitBooking}
                  disabled={!booking.platform || !booking.date || !booking.time}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Booking Modal (Global Form) */}
        {isBookingOpen && (
          <CompanionBookingModal
            onClose={() => setIsBookingOpen(false)}
            initialCompanion={selectedCompanion}
          />
        )}

        {/* Companion Application Modal */}
        <CompanionApplicationModal 
          isOpen={isApplicationModalOpen} 
          onClose={() => setIsApplicationModalOpen(false)} 
        />

        {/* Companion Video Simulation Modal */}
        <AnimatePresence>
          {activeVideoSession && (
            <CompanionVideoSimulationModal
              session={activeVideoSession}
              onClose={() => setActiveVideoSession(null)}
              onComplete={(notes) => {
                handleMarkCompleted(activeVideoSession._id || activeVideoSession.id);
                setActiveVideoSession(null);
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
