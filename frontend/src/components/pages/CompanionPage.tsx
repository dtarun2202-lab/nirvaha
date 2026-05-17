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
                                : "bg-white/50 border-gray-100 hover:border-emerald-100 text-emerald-950/70"
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
                            : "bg-white/50 border-gray-100 text-emerald-900/70 hover:border-emerald-100"
                          }`}
                        >
                          ₹ Low to High
                        </button>
                        <button
                          onClick={() => setPriceSort(priceSort === "high-to-low" ? "none" : "high-to-low")}
                          className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                            priceSort === "high-to-low"
                            ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                            : "bg-white/50 border-gray-100 text-emerald-900/70 hover:border-emerald-100"
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
                                : "bg-white/50 border-gray-100 hover:border-emerald-100 text-emerald-950/70"
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
                                ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm" 
                                : "bg-white/50 border-gray-100 hover:border-emerald-100 text-emerald-950/70"
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
                                ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm" 
                                : "bg-white/50 border-gray-100 hover:border-emerald-100 text-emerald-950/70"
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
                                ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm" 
                                : "bg-white/50 border-gray-100 hover:border-emerald-100 text-emerald-950/70"
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
                                ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm shadow-emerald-100" 
                                : "bg-white/50 border-gray-100 hover:border-emerald-100 text-emerald-950/70"
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
                                ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm" 
                                : "bg-white/50 border-gray-100 hover:border-emerald-100 text-emerald-950/70"
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
                            <h3 className="text-2xl font-black text-emerald-950 mb-1">{companion.name}</h3>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-emerald-100">
                              <Sparkles className="w-3 h-3" />
                              {companion.category}
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 text-center mb-8">
                          <p className="text-emerald-800/70 text-sm leading-relaxed mb-6 italic line-clamp-2">"{companion.bio}"</p>
                          <div className="flex flex-wrap justify-center gap-2 mb-4">
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
                        <p className="text-teal-800 italic font-medium">"{selectedCompanion.quote}"</p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-semibold text-teal-800 mb-2">About</h4>
                      <p className="text-sm text-teal-700 leading-relaxed">{selectedCompanion.fullAbout || selectedCompanion.bio}</p>
                    </div>

                    {selectedCompanion.experience && selectedCompanion.experience.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-teal-800 mb-2">Experience</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {selectedCompanion.experience.map((exp: string, idx: number) => (
                            <li key={idx} className="text-sm text-teal-700">{exp}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedCompanion.sessionStyle && selectedCompanion.sessionStyle.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-teal-800 mb-2">Session Style</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {selectedCompanion.sessionStyle.map((style: string, idx: number) => (
                            <li key={idx} className="text-sm text-teal-700">{style}</li>
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
                        <div className="flex items-center gap-2 text-sm text-teal-700">
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


