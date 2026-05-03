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
} from "@/lib/companionApi";

export function CompanionPage() {
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

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

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
      rating: 4.8,
      sessions: 120,
      price: "₹800",
      avatar: "/aisha mehta.png",
      energyTags: ["Calm", "Focus", "Balance"],
      color: "from-emerald-400 to-teal-400"
    },
    {
      id: "c2",
      name: "Arjun Verma",
      category: "Counseling",
      title: "Counseling Expert",
      bio: "Navigating life's complexities with compassion and structured guidance.",
      rating: 4.9,
      sessions: 210,
      price: "₹1200",
      avatar: "/arjun verma.png",
      energyTags: ["Clarity", "Support", "Growth"],
      color: "from-blue-400 to-indigo-400"
    },
    {
      id: "c3",
      name: "Kavya Nair",
      category: "Healing",
      title: "Energy Healer",
      bio: "Restoring balance to your mind, body, and spirit through ancient healing arts.",
      rating: 4.7,
      sessions: 95,
      price: "₹1500",
      avatar: "/kavya.png",
      energyTags: ["Restoration", "Peace", "Aura"],
      color: "from-amber-400 to-orange-400"
    },
    {
      id: "c4",
      name: "Swami Aarav",
      category: "Spiritual",
      title: "Spiritual Guide",
      bio: "Guiding seekers on the path of self-discovery and spiritual awakening.",
      rating: 5.0,
      sessions: 500,
      price: "₹2000",
      avatar: "/swami.png",
      energyTags: ["Awakening", "Wisdom", "Zen"],
      color: "from-purple-400 to-pink-400"
    },
    {
      id: "c5",
      name: "Riya Kapoor",
      category: "Meditation",
      title: "Mindfulness Coach",
      bio: "Deepening your inner silence through traditional Zen meditation practices.",
      rating: 4.9,
      sessions: 180,
      price: "₹900",
      avatar: "/riya.png",
      energyTags: ["Silence", "Presence", "Flow"],
      color: "from-teal-400 to-cyan-400"
    }
  ];

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return companionsList;
    return companionsList.filter(c => c.category === selectedCategory);
  }, [selectedCategory]);


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
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight text-emerald-950">
              Find Your Perfect <br/>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Spiritual Guide</span>
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-emerald-800/70 mb-10 leading-relaxed">
              Book 1-on-1 sessions with experienced spiritual teachers, meditation
              guides, and wellness coaches. Pay per hour or per call.
            </p>

            {/* Trust Info Bar */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-8 py-4 px-8 bg-white/40 backdrop-blur-md rounded-full border border-emerald-100/50 shadow-sm max-w-fit mx-auto"
            >
              <div className="flex items-center gap-2 text-emerald-800/80 text-sm font-medium">
                <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                <span>500+ sessions completed</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-emerald-200" />
              <div className="flex items-center gap-2 text-emerald-800/80 text-sm font-medium">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Verified companions</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-emerald-200" />
              <div className="flex items-center gap-2 text-emerald-800/80 text-sm font-medium">
                <Heart className="w-4 h-4 text-emerald-500" />
                <span>Safe & private conversations</span>
              </div>
            </motion.div>

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
                      <div className="w-14 h-14 bg-emerald-100/80 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <Users className="w-7 h-7 text-emerald-700" />
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-150 transition-transform" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-emerald-950 mb-2 tracking-tight">Apply as a Companion</h3>
                      <p className="text-emerald-800/60 font-medium line-clamp-2">Join our network of healers and share your expertise with our growing community.</p>
                      <div className="mt-6 flex items-center text-emerald-700 font-bold gap-2 text-sm uppercase tracking-wider">
                        Join the Network <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="mt-4 flex flex-col items-center">
                <p className="text-emerald-800/60 text-sm font-medium tracking-wide">
                  Choose your journey — receive healing or help others heal.
                </p>
                {hasApplied && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold shadow-sm"
                  >
                    You have an active application
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>


          {/* Category Selection */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                layout
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-8 py-4 rounded-full flex items-center gap-3 transition-all duration-300 font-bold border-2 ${
                  selectedCategory === cat.id 
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-200" 
                  : "bg-white border-emerald-100 text-emerald-800 hover:border-emerald-300 hover:bg-emerald-50/50"
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>

          {/* Main Marketplace Area */}
          <div className="relative min-h-[600px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full mb-6"
                />
                <p className="text-emerald-800/40 font-bold animate-pulse">Gathering spiritual guides...</p>
              </div>
            ) : companionMode ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-4xl font-bold mb-10 text-emerald-950">Your Upcoming Sessions</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(() => {
                    try {
                      const bookingsRaw = localStorage.getItem('nirvaha_bookings');
                      const bookings = bookingsRaw ? JSON.parse(bookingsRaw) : [];
                      if (bookings.length === 0) {
                        return (
                          <div className="col-span-full text-center py-20 bg-white/40 rounded-[40px] border-2 border-dashed border-emerald-100">
                            <Calendar className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
                            <p className="text-xl text-emerald-800/60 font-medium">
                              No sessions scheduled yet.
                            </p>
                          </div>
                        );
                      }
                      return bookings.map((booking: any, idx: number) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-[32px] p-8 border border-emerald-50 shadow-xl"
                        >
                          <div className="flex items-start justify-between mb-6">
                            <div>
                              <h3 className="text-xl font-bold text-emerald-950 mb-1">{booking.companionName}</h3>
                              <p className="text-emerald-600 font-medium">{booking.type === 'chat' ? 'Chat Session' : 'Video Call'}</p>
                            </div>
                          </div>
                          <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-emerald-800/70">
                              <Calendar className="w-5 h-5 text-emerald-500" />
                              <span className="font-medium">{booking.date}</span>
                            </div>
                            <div className="flex items-center gap-3 text-emerald-800/70">
                              <Clock className="w-5 h-5 text-emerald-500" />
                              <span className="font-medium">{booking.time}</span>
                            </div>
                          </div>
                          <button className="w-full py-4 bg-emerald-900 text-white rounded-2xl font-bold shadow-lg">Join Now</button>
                        </motion.div>
                      ));
                    } catch { return null; }
                  })()}
                </div>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                {filteredItems.length === 0 ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-20 flex flex-col items-center"
                  >
                    <div className="w-24 h-24 bg-emerald-50 rounded-[40px] flex items-center justify-center mb-8 border border-emerald-100">
                      <Sparkles className="w-10 h-10 text-emerald-300" />
                    </div>
                    <h2 className="text-4xl font-bold text-emerald-950 mb-4">No {selectedCategory.toLowerCase()} guides available right now 🌿</h2>
                    <p className="text-xl text-emerald-800/50 max-w-lg mx-auto mb-10">Try another category or connect instantly with our available guides through 24/7 support.</p>
                    <button 
                      onClick={() => setSelectedCategory("All")}
                      className="px-10 py-4 bg-emerald-900 text-white rounded-2xl font-bold shadow-lg"
                    >
                      View All Guides
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key={selectedCategory}
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
                            <h3 className="text-2xl font-black text-emerald-950 mb-1">{companion.name}</h3>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-emerald-100">
                              <Sparkles className="w-3 h-3" />
                              {companion.category}
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 text-center mb-8">
                          <p className="text-emerald-800/70 text-sm leading-relaxed mb-6 italic line-clamp-2">"{companion.bio}"</p>
                          <div className="flex flex-wrap justify-center gap-2 mb-6">
                            {companion.energyTags.map((tag) => (
                              <span key={tag} className="px-4 py-1.5 bg-white border border-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full shadow-sm">{tag}</span>
                            ))}
                          </div>
                          <div className="grid grid-cols-3 gap-2 py-4 bg-emerald-50/40 rounded-3xl border border-emerald-50">
                            <div className="flex flex-col items-center border-r border-emerald-100">
                              <div className="flex items-center gap-1 mb-0.5">
                                <Star className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                                <span className="text-xs font-black text-emerald-950">{companion.rating}</span>
                              </div>
                              <span className="text-[8px] uppercase tracking-tighter font-bold text-emerald-800/40 text-center">Rating</span>
                            </div>
                            <div className="flex flex-col items-center border-r border-emerald-100">
                              <span className="text-xs font-black text-emerald-950 mb-0.5">{companion.sessions}+</span>
                              <span className="text-[8px] uppercase tracking-tighter font-bold text-emerald-800/40 text-center">Sessions</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-xs font-black text-emerald-900 mb-0.5">{companion.price}</span>
                              <span className="text-[8px] uppercase tracking-tighter font-bold text-emerald-800/40 text-center">Per Hour</span>
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
            )}
          </div>

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
                <h2 className="text-3xl font-bold text-emerald-950 mb-4">Instantly connect</h2>
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
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            >
              {/* Modal Cover */}
              <div className="relative h-40 rounded-t-3xl overflow-hidden flex-shrink-0">
                <img
                  src={selectedCompanion.coverImage || "/meditation/wellness2.jpeg"}
                  alt={selectedCompanion.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedCompanion(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg"
                >
                  <svg
                    className="w-5 h-5 text-teal-800"
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
              </div>

              {/* Modal Content */}
              <div className="p-0">
                {/* Avatar positioned at left bottom of banner - NO additional cover image */}
                {/* Avatar positioned with proper spacing */}
                <div className="px-8 -mt-12 mb-4 relative z-20">
                  <div className="inline-block relative">
                    <img
                      src={selectedCompanion.avatar || selectedCompanion.profileImage || "/meditation/wellness1.jpeg"}
                      alt={selectedCompanion.name}
                      className="w-28 h-28 rounded-2xl shadow-2xl object-cover border-4 border-white bg-white"
                    />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full shadow-lg" />
                  </div>
                </div>

                <div className="px-8 pb-8 max-h-[60vh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-emerald-50">
                  {/* Profile Info */}
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-teal-950 mb-1">
                      {selectedCompanion.name}
                    </h2>
                    <p className="text-teal-600 font-bold mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {selectedCompanion.title}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm">
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

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-teal-800 mb-2">About</h4>
                      <p className="text-sm text-teal-700">{selectedCompanion.bio}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-teal-800 mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {(selectedCompanion.specialties || []).map(
                          (specialty: string, j: number) => (
                            <span
                              key={j}
                              className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full"
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
                              className="px-3 py-1 bg-teal-100 text-teal-700 text-xs rounded-full"
                            >
                              {language}
                            </span>
                          )
                        )}
                      </div>
                    </div>
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
                  <h4 className="text-teal-800">Book {booking.companion.name}</h4>
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
                        className={`px-3 py-2 rounded-xl border text-sm ${booking.platform === p ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent' : 'bg-white border-emerald-200 text-teal-800 hover:bg-emerald-50'}`}
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
                  className="flex-1 px-4 py-3 rounded-xl border border-emerald-200 text-teal-800 hover:bg-emerald-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitBooking}
                  disabled={!booking.platform || !booking.date || !booking.time}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
      </motion.div>
    </>
  );
}


