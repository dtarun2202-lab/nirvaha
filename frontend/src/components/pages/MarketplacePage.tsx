import { motion } from "motion/react";
import {
  ShoppingBag,
  BookOpen,
  Star,
  Heart,
  Clock,
  Users,
  Truck,
  Shield,
  Search,
  Award,
  MapPin,
  CalendarRange,
  Plus,
  ListChecks,
  ShoppingCart,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BACKEND_CONFIG from "@/config/backend";
import io from "socket.io-client";
import AddItemModal from "../marketplace/AddItemModal";
import CheckoutModal from "../marketplace/CheckoutModal";
import { SessionRegistrationModal } from "../marketplace/SessionRegistrationModal";
import type { SessionRegistration } from "../marketplace/SessionRegistrationModal";
import { RetreatRegistrationModal } from "../marketplace/RetreatRegistrationModal";
import { MySessionsDrawer } from "../marketplace/MySessionsDrawer";
import { ItemDetailModal } from "../marketplace/ItemDetailModal";
import type { DetailItem } from "../marketplace/ItemDetailModal";
import { CartDrawer } from "../marketplace/CartDrawer";
import type { CartItem } from "../marketplace/CartDrawer";

type MarketplaceItem = {
  id: string;
  requestId: string;
  type: "session" | "retreat" | "product"
  status: "active" | "completed";
  data: any;
};

type SessionCard = {
  id?: string;
  approvedId?: string;
  title: string;
  host: string;
  schedule: string;
  duration: string;
  attendees: string;
  rating: number;
  price: string;
  image: string;
  color: string;
  topics: string[];
};

type RetreatCard = {
  id?: string;
  approvedId?: string;
  title: string;
  guide: string;
  location: string;
  dates: string;
  capacity: string;
  rating: number;
  price: string;
  image: string;
  color: string;
  highlights: string[];
  description?: string;
  accommodation?: string;
  activities?: string[];
  mealsIncluded?: string;
  servicesIncluded?: string;
  features?: string[];
  duration?: string;
};

type ProductCard = {
  id?: string;
  approvedId?: string;
  name: string;
  description: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  color: string;
  inStock: boolean;
  benefits?: string[];
  ingredients?: string;
  usage?: string;
};

export function MarketplacePage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
  useState<"sessions" | "retreats" | "products">("sessions");

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedAddType, setSelectedAddType] = useState<
    "session" | "retreat" | "product"
  >("session");
  const [approvedItems, setApprovedItems] = useState<MarketplaceItem[]>([]);

  const { user } = useAuth();
  const apiBaseUrl = BACKEND_CONFIG.API_BASE_URL;

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<{
    name: string;
    price: string | number;
    image: string;
    type: 'product' | 'session' | 'retreat';
    id?: string;
  } | null>(null);

  // Session registration state
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionCard | null>(null);
  const [isRetreatRegModalOpen, setIsRetreatRegModalOpen] = useState(false);
  const [selectedRetreat, setSelectedRetreat] = useState<RetreatCard | null>(null);
  const [mySessionsOpen, setMySessionsOpen] = useState(false);

  // Detail modal state
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<DetailItem | null>(null);

  // Cart state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartStorageKey = user?.email ? `nirvaha_cart_${user.email}` : "nirvaha_cart_guest";
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
    } catch {
      return [];
    }
  });
  const [cartCount, setCartCount] = useState(0);

  // Sync state whenever the storage key changes (e.g. login/logout)
  useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
      setCartItems(items);
      setCartCount(items.reduce((acc: any, item: any) => acc + item.quantity, 0));
    } catch {
      setCartItems([]);
      setCartCount(0);
    }
  }, [cartStorageKey]);

  // Unified update helper to prevent React double-render race conditions
  const updateCart = (newItems: CartItem[]) => {
    setCartItems(newItems);
    localStorage.setItem(cartStorageKey, JSON.stringify(newItems));
    setCartCount(newItems.reduce((acc, item) => acc + item.quantity, 0));
  };
  
  // User-specific storage key
  const storageKey = user?.email ? `nirvaha_my_sessions_${user.email}` : "nirvaha_my_sessions_guest";

  const [myRegistrations, setMyRegistrations] = useState<SessionRegistration[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch { return []; }
  });

  // Re-sync My Sessions when admin approves/rejects (same tab or cross-tab)
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const updated = JSON.parse(localStorage.getItem(storageKey) || "[]");
        setMyRegistrations(updated);
      } catch { /* ignore */ }
    };
    // Same-tab: dispatched by admin updateStatus
    window.addEventListener("nirvaha-session-status-updated", syncFromStorage);
    // Cross-tab: storage event
    window.addEventListener("storage", (e) => {
      if (e.key === storageKey) syncFromStorage();
    });
    return () => {
      window.removeEventListener("nirvaha-session-status-updated", syncFromStorage);
    };
  }, [storageKey]);

  const DEFAULT_SESSION_IMAGE =
    "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600";
  const DEFAULT_RETREAT_IMAGE =
    "https://images.unsplash.com/photo-1523419400524-33de15b45d5b?w=600";
  const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=1200&q=80";

  const loadApprovedItems = async () => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/marketplace/items?status=active`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch marketplace items");
      }
      const data = await response.json();
      setApprovedItems(Array.isArray(data) ? data : []);

      // If user is logged in, fetch their bookings to sync status
      if (user?.email) {
        try {
          const bRes = await fetch(`${apiBaseUrl}/api/bookings/user/${user.email}`);
          if (bRes.ok) {
            const bookings = await bRes.json();
            const normalized = bookings
              .filter((b: any) => b.type === "session" || b.type === "retreat" || b.type === "product")
              .map((b: any) => {
                const matchingItem = data.find((s: any) => s.id === b.itemId || s._id === b.itemId || s.requestId === b.itemId);
                const sData = matchingItem?.data || {};
                
                const sDate = b.date || sData.date || sData.startDate;
                const sTime = sData.startTime || "";
                const sZone = sData.timeZone || "";

                if (b.type === "product") {
                  return {
                    id: b.id,
                    sessionTitle: b.itemName || sData.title || sData.name || "Wellness Product",
                    sessionId: b.itemId,
                    userName: b.userName,
                    email: b.email,
                    phone: b.phone,
                    message: b.message,
                    wellnessGoal: b.wellnessGoal,
                    status: b.status || "pending",
                    createdAt: b.createdAt,
                    schedule: `Qty: ${b.quantity || 1} • Total: ₹${b.price || 0}`,
                    host: `${b.deliveryStatus || "Processing"}`,
                    image: b.image || sData.image || DEFAULT_PRODUCT_IMAGE,
                    type: "product"
                  };
                } else if (b.type === "retreat") {
                  return {
                    id: b.id,
                    sessionTitle: b.itemName || sData.title || sData.name || "Wellness Retreat",
                    sessionId: b.itemId,
                    userName: b.userName,
                    email: b.email,
                    phone: b.phone,
                    message: b.message,
                    wellnessGoal: b.wellnessGoal,
                    status: b.status === "upcoming" ? "approved" : b.status,
                    createdAt: b.createdAt,
                    schedule: sDate || "Schedule Pending",
                    host: b.host || sData.instructor || sData.host || "Lead Guide",
                    image: b.image || sData.image || DEFAULT_RETREAT_IMAGE,
                    type: "retreat"
                  };
                } else {
                  return {
                    id: b.id,
                    sessionTitle: b.itemName || sData.title || sData.name || "Untitled Session",
                    sessionId: b.itemId,
                    userName: b.userName,
                    email: b.email,
                    phone: b.phone,
                    message: b.message,
                    wellnessGoal: b.wellnessGoal,
                    status: b.status === "upcoming" ? "approved" : b.status,
                    createdAt: b.createdAt,
                    schedule: sDate ? (sTime ? `${sDate} ${sTime} ${sZone}` : sDate) : "Schedule Pending",
                    host: b.host || sData.instructor || sData.host || "Instructor",
                    image: b.image || sData.image || DEFAULT_SESSION_IMAGE,
                    type: "session"
                  };
                }
              });
            
            // Merge with local storage (backend takes precedence for status)
            const local: any[] = JSON.parse(localStorage.getItem(storageKey) || "[]");
            const merged = [...normalized];
            const normalizedIds = new Set(normalized.map((n: any) => n.id));
            
            local.forEach(l => {
              if (!normalizedIds.has(l.id)) {
                if (!l.type || l.type === "session" || l.type === "retreat" || l.type === "product") {
                  merged.push(l);
                }
              }
            });
            
            setMyRegistrations(merged);
            localStorage.setItem(storageKey, JSON.stringify(merged));
          }
        } catch (err) {
          console.error("Failed to sync bookings:", err);
        }
      }
    } catch (error) {
      console.error("Failed to load marketplace items:", error);
      setApprovedItems([]);
    }
  };

  const handleCompleteItem = async (itemId: string) => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/marketplace/items/${itemId}/complete`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completedBy: "admin" }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to complete item");
      }
      setApprovedItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Failed to complete marketplace item:", error);
      alert("Failed to mark as completed. Please try again.");
    }
  };

  const parsePrice = (value: string | number) => {
    if (typeof value === "number") return value;
    const parsed = value.toString().replace(/[^0-9.]/g, "");
    return Number(parsed) || 0;
  };

  const createBooking = async (bookingData: Record<string, any>) => {
    const payload = {
      ...bookingData,
      userName: bookingData.userName || user?.name || "Guest",
      email: bookingData.email || user?.email || "",
      type: bookingData.type || "session",
      status:
        bookingData.status ||
        (bookingData.type === "product" ? "completed" : "upcoming"),
      createdAt: new Date(),
    };

    const response = await fetch(`${apiBaseUrl}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error || errorBody.message || "Booking failed");
    }

    return await response.json();
  };

  const handleProductPurchase = (product: ProductCard) => {
    setCheckoutItem({
      id: product.id || product.approvedId,
      name: product.name,
      price: product.price,
      image: product.image,
      type: 'product'
    });
    setIsCheckoutOpen(true);
  };

  const handleRetreatRequest = (retreat: RetreatCard) => {
    setSelectedRetreat(retreat);
    setIsRetreatRegModalOpen(true);
  };

  const handleSessionRegister = (session: SessionCard) => {
    setSelectedSession(session);
    setIsRegModalOpen(true);
  };

  // Open detail popup
  const openDetail = (item: DetailItem) => {
    setDetailItem(item);
    setIsDetailOpen(true);
  };

  // From detail popup CTA
  const handleDetailAddToCart = (product: any) => {
    const pId = product.id || product.approvedId || String(Math.random());
    const existing = cartItems.find(item => item.id === pId);
    let newItems;
    if (existing) {
      newItems = cartItems.map(item =>
        item.id === pId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newItems = [
        ...cartItems,
        {
          id: pId,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        }
      ];
    }
    updateCart(newItems);
    setIsDetailOpen(false);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id);
      return;
    }
    const newItems = cartItems.map(item => (item.id === id ? { ...item, quantity: newQty } : item));
    updateCart(newItems);
  };

  const handleRemoveCartItem = (id: string) => {
    const newItems = cartItems.filter(item => item.id !== id);
    updateCart(newItems);
  };

  const handleCartContinueCheckout = () => {
    if (cartItems.length === 0) return;

    const firstItem = cartItems[0];
    const combinedName = cartItems.length === 1
      ? firstItem.name
      : `${firstItem.name} + ${cartItems.length - 1} more`;

    const subtotal = cartItems.reduce((acc, item) => {
      const priceNum = typeof item.price === 'number'
        ? item.price
        : parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
      return acc + priceNum * item.quantity;
    }, 0);

    setCheckoutItem({
      id: 'cart_multiple',
      name: combinedName,
      price: subtotal,
      image: firstItem.image,
      type: 'product'
    });

    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleDetailRegisterSession = (session: any) => {
    handleSessionRegister(session as SessionCard);
  };
  const handleDetailRequestRetreat = (retreat: any) => {
    handleRetreatRequest(retreat as RetreatCard);
  };

  const handleRegistered = (reg: SessionRegistration) => {
    setMyRegistrations(prev => [reg, ...prev]);
  };

  const onConfirmCheckout = async (checkoutDetails: any) => {
    if (!checkoutItem) return;

    try {
      await createBooking({
        itemId: checkoutItem.id || `${checkoutItem.type}-${checkoutItem.name}`,
        itemName: checkoutItem.name,
        type: checkoutItem.type,
        price: checkoutDetails.totalPrice,
        platform: checkoutItem.type === 'product' ? 'Online' : 'In-Person',
        date: new Date().toISOString(),
        quantity: checkoutDetails.quantity,
        paymentStatus: checkoutItem.type === 'product' ? 'Paid' : 'Pending',
        deliveryStatus: checkoutItem.type === 'product' ? 'Processing' : 'N/A',
        shippingDetails: {
          fullName: checkoutDetails.fullName,
          street: checkoutDetails.street,
          city: checkoutDetails.city,
          zipCode: checkoutDetails.zipCode
        },
        paymentMethod: checkoutDetails.paymentMethod
      });
      
      // If checkout was from cart, empty the cart
      if (checkoutItem.id === 'cart_multiple') {
        setCartItems([]);
      }
      // success animation is handled within the modal step 3
    } catch (error: any) {
      console.error("Booking confirmation failed:", error);
      throw error; // Re-throw to be caught by modal's error handler
    }
  };

  useEffect(() => {
    loadApprovedItems();

    const socket = io(BACKEND_CONFIG.SOCKET_BASE_URL);
    socket.on("marketplace-item-created", loadApprovedItems);
    socket.on("marketplace-item-completed", loadApprovedItems);
    socket.on("booking-updated", loadApprovedItems);

    const handleFocus = () => loadApprovedItems();
    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handleFocus);

    return () => {
      socket.disconnect();
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handleFocus);
    };
  }, [user?.email]);

  const sessions: SessionCard[] = [];

  const retreats: RetreatCard[] = [];

  const products: ProductCard[] = [];

  const approvedSessions: SessionCard[] = approvedItems
    .filter((item) => item.type === "session")
    .map((item) => ({
      id: item.id,
      approvedId: item.id,
      title: item.data?.title || "Untitled Session",
      host: item.data?.host || "Host",
      schedule: `${item.data?.startDate || "TBD"} ${item.data?.startTime || ""} ${item.data?.timeZone || ""}`.trim(),
      duration: item.data?.duration ? `${item.data.duration} min` : "TBD",
      attendees: "New",
      rating: 5.0,
      price: item.data?.isPaid ? `₹${item.data?.price || ""}` : "Free",
      image: item.data?.image || DEFAULT_SESSION_IMAGE,
      color: "from-emerald-400 to-teal-500",
      topics: [item.data?.platform, item.data?.timeZone].filter(Boolean),
    }));

    const fallbackSessions: SessionCard[] = [
  {
    title: "Guided Meditation",
    host: "Anita Sharma",
    schedule: "Today 6 PM IST",
    duration: "45 min",
    attendees: "120 joined",
    rating: 4.8,
    price: "₹299",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200", // meditation
    color: "from-emerald-400 to-teal-500",
    topics: ["Zoom", "IST"],
  },
  {
    title: "Breathwork Healing",
    host: "Rahul Dev",
    schedule: "Tomorrow 7 AM IST",
    duration: "30 min",
    attendees: "80 joined",
    rating: 4.7,
    price: "Free",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200", // breathing yoga
    color: "from-emerald-400 to-teal-500",
    topics: ["Google Meet", "IST"],
  },
  {
    title: "Yoga Flow Basics",
    host: "Neha Kapoor",
    schedule: "Sat 8 AM IST",
    duration: "60 min",
    attendees: "150 joined",
    rating: 4.9,
    price: "₹199",
    image:
      "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=1200", // yoga
    color: "from-emerald-400 to-teal-500",
    topics: ["Zoom", "Beginner"],
  },
  {
    title: "Mindfulness Session",
    host: "Arjun Mehta",
    schedule: "Sun 5 PM IST",
    duration: "40 min",
    attendees: "95 joined",
    rating: 4.6,
    price: "₹149",
    image:
      "https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=1200", // calm nature
    color: "from-emerald-400 to-teal-500",
    topics: ["Live", "Relaxation"],
  },
];

  const approvedRetreats: RetreatCard[] = approvedItems
    .filter((item) => item.type === "retreat")
    .map((item) => {
      // Calculate duration in days
      let durationStr = "5 Days / 4 Nights";
      if (item.data?.startDate && item.data?.endDate) {
        try {
          const start = new Date(item.data.startDate);
          const end = new Date(item.data.endDate);
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          durationStr = `${diffDays} Days / ${diffDays - 1} Nights`;
        } catch {}
      }
      return {
        id: item.id,
        approvedId: item.id,
        title: item.data?.title || "Untitled Retreat",
        guide: item.data?.facilitator || "Facilitator",
        location: item.data?.location || "Location TBD",
        dates: `${item.data?.startDate || "TBD"} - ${item.data?.endDate || "TBD"}`,
        capacity: item.data?.capacity || "Capacity TBD",
        rating: 5.0,
        price: item.data?.isPaid ? `₹${item.data?.price || ""}` : "Free",
        image: DEFAULT_RETREAT_IMAGE,
        color: "from-emerald-400 to-teal-500",
        highlights: [item.data?.accommodation, item.data?.pricingTier].filter(Boolean),
        description: item.data?.description || "A deep, transformative retreat experience designed to help you reconnect with nature, align your energy center, and achieve deep mental clarity.",
        accommodation: item.data?.accommodation || "Eco-Resort Shared Ashram / Premium Cottages",
        activities: ["Silent Meditation", "Pranayama Breathwork", "Hatha Yoga", "Forest Bathing", "Sacred Sound Healing"],
        mealsIncluded: "Organic Sattvic Vegetarian Cuisine (Breakfast, Lunch, & Dinner)",
        servicesIncluded: item.data?.pricingTier || "All-inclusive lodging, access to natural steam baths, daily workbook",
        features: [
          "Personalized holistic wellness consultation",
          "Access to natural hot springs & sauna",
          "Guided mindful journaling materials",
          "Roundtrip retreat shuttle pickup"
        ],
        duration: durationStr,
      };
    });

   const fallbackRetreats: RetreatCard[] = [
  {
    title: "Himalayan Yoga Retreat",
    guide: "Sadhguru Team",
    location: "Rishikesh",
    dates: "12 Aug - 18 Aug",
    capacity: "20 spots",
    rating: 4.9,
    price: "₹12,999",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200", // himalayas
    color: "from-emerald-400 to-teal-500",
    highlights: ["Stay Included", "Veg Meals"],
    description: "Reclaim your inner balance in the spiritual heart of the Himalayas. Experience intensive daily yoga sadhana, deep breathwork sessions, and holy Ganga river dipping.",
    duration: "7 Days / 6 Nights",
    accommodation: "Traditional Himalayan Ashram (Riverview Cottages)",
    activities: ["Hatha Yoga Flow", "Holy Ganga Bathing", "Silent Meditation", "Pranayama Breathwork", "Spiritual Satsangs"],
    mealsIncluded: "Organic Sattvic Vegetarian Cuisine (Breakfast, Lunch, & Dinner)",
    servicesIncluded: "Himalayan guide fee, group transfer from Dehradun airport, herbal teas, meditation mat & journal",
    features: [
      "Personalized yoga consultation with spiritual gurus",
      "Immersive nature bathing beside running creeks",
      "Access to natural stream water pool",
      "Daily group chanting & sound immersion"
    ]
  },
  {
    title: "Beach Meditation Retreat",
    guide: "Inner Peace Org",
    location: "Goa",
    dates: "5 Sept - 10 Sept",
    capacity: "15 spots",
    rating: 4.8,
    price: "₹9,999",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200", // beach
    color: "from-emerald-400 to-teal-500",
    highlights: ["Ocean View", "Yoga Sessions"],
    description: "Immerse yourself in gentle sea waves, white sand, and daily mindfulness meditation on the peaceful coast of Goa. Designed to heal, recharge, and renew.",
    duration: "6 Days / 5 Nights",
    accommodation: "Eco-Friendly Beachfront Luxury Cabins",
    activities: ["Oceanfront Sunrise Yoga", "Zen Silent Walk", "Chakra Sound Healing", "Evening Sunset Meditation", "Therapeutic Massage"],
    mealsIncluded: "Nutritious Plant-Based Meals & Fresh Detox Juices",
    servicesIncluded: "Daily wellness coaching, full access to resort spa, transport from Dabolim airport, organic skin products",
    features: [
      "Private beach access and silent coastal walks",
      "Rejuvenating full body Ayurvedic oil massage",
      "Sunset sound healing & fire ceremony",
      "Personalized nutrition planning consultation"
    ]
  },
  {
    title: "Forest Healing Retreat",
    guide: "Nature Souls",
    location: "Coorg",
    dates: "20 Sept - 25 Sept",
    capacity: "12 spots",
    rating: 4.7,
    price: "₹8,999",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200", // forest
    color: "from-emerald-400 to-teal-500",
    highlights: ["Nature Walks", "Detox"],
    description: "Unplug entirely and heal under the canopy of ancient forests in Coorg. Experience forest bathing, organic detoxification, and deep energetic alignment.",
    duration: "6 Days / 5 Nights",
    accommodation: "Premium Luxury Treehouses & Eco-Cabins",
    activities: ["Forest Bathing (Shinrin-yoku)", "Pranayama Breathwork", "Zen Herbal Tea Ceremony", "Mindful Wildlife Hikes", "Tuning Fork Therapy"],
    mealsIncluded: "Raw & Organic Farm-To-Table Detox Cuisine",
    servicesIncluded: "Wilderness expert fee, botanical field workbook, organic insect repellent, standard airport transfer",
    features: [
      "Immersive wildlife and rare tree canopy exploration",
      "Therapeutic forest stream bathing",
      "Natural hot clay detoxifying mask therapy",
      "Daily sound vibration tuning fork session"
    ]
  },
  {
    title: "Luxury Wellness Retreat",
    guide: "Zen Escape",
    location: "Kerala",
    dates: "1 Oct - 6 Oct",
    capacity: "10 spots",
    rating: 4.9,
    price: "₹15,999",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200", // resort spa
    color: "from-emerald-400 to-teal-500",
    highlights: ["Spa", "Ayurveda"],
    description: "Indulge in authentic traditional Ayurveda treatments, luxury spa pampering, and gentle meditation in the lush, serene backwaters of Kerala.",
    duration: "6 Days / 5 Nights",
    accommodation: "Five-Star Heritage Wellness Backwater Resort",
    activities: ["Ayurvedic Yoga Sadhana", "Abhyanga Oil Therapy", "Guided Backwater Kayak", "Trataka Candle Meditation", "Mindful Eating Workshop"],
    mealsIncluded: "Tailored Ayurvedic Diet (Sattvic Vegetarian Cuisine)",
    servicesIncluded: "In-house Ayurvedic doctor consultation, daily 60-min spa massage, Kochi airport transport",
    features: [
      "One-on-one consultation with certified Ayurvedic doctor",
      "Daily backwater boat cruise & silent canoeing",
      "Personalized herbal wellness tea blends",
      "Shanta copper pot oil head therapy session"
    ]
  },
];
  
  const approvedProducts: ProductCard[] = approvedItems
     .filter((item) => item.type === "product")
     .map((item) => ({
       id: item.id,
       approvedId: item.id,
       name: item.data?.name || "Product",
       description: item.data?.description || "A premium, high-grade wellness product sourced ethically and crafted to align your energy and nurture your body.",
       price: `₹${item.data?.price || 0}`,
       rating: 4.5,
       reviews: 10,
       image: item.data?.images
         ? item.data.images.split(",")[0]
         : DEFAULT_PRODUCT_IMAGE,
       category: item.data?.category || "Other",
       color: "from-emerald-400 to-teal-500",
       inStock: item.data?.stockAvailability !== "Out of Stock",
       ingredients: item.data?.ingredients || "100% Organic & Sustainably Sourced",
       usage: item.data?.usageInstructions || "Use daily as part of your morning wellness routine.",
       benefits: [
         "100% organic, vegan & cruelty-free",
         "Sustainably packaged and ethically sourced",
         "Lab-tested for purity and potency",
         "Designed by certified wellness specialists",
       ],
     }));

     // Fallback static products (for UI display if backend is empty)
    const fallbackProducts: ProductCard[] = [
  {
    name: "Healing Crystal Kit",
    description: "Enhance your meditation and space harmony with this hand-selected, ethically sourced set of high-vibration healing crystals. Perfect for cleansing and energy alignment.",
    price: "₹999",
    rating: 4.8,
    reviews: 120,
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200",
    category: "Spiritual",
    color: "from-emerald-400 to-teal-500",
    inStock: true,
    ingredients: "7 Ethically Sourced raw and tumbled chakra stones (Amethyst, Rose Quartz, Clear Quartz, Citrine, Lapis Lazuli, Carnelian, Jasper).",
    usage: "Place around your yoga mat during practice, or hold gently during silent meditation.",
    benefits: [
      "Ethically and sustainably mined",
      "Cleansed with organic sound & sage",
      "Includes elegant storage pouch",
      "Comes with detailed instruction card"
    ]
  },
  {
    name: "Aroma Therapy Oil",
    description: "A restorative blend of organic essential oils formulated to immediately calm the nervous system, reduce sensory overload, and induce deep state relaxation.",
    price: "₹499",
    rating: 4.6,
    reviews: 80,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200",
    category: "Wellness",
    color: "from-emerald-400 to-teal-500",
    inStock: true,
    ingredients: "Pure Lavandula Angustifolia (Lavender), Boswellia Carterii (Frankincense), and organic Simmondsia Chinensis (Jojoba) carrier oil.",
    usage: "Gently apply 2-3 drops to pulse points (wrists, temples) or add to your aroma diffuser.",
    benefits: [
      "100% therapeutic grade essential oils",
      "Zero synthetic fragrances or fillers",
      "Eco-friendly cobalt glass roll-on",
      "Hand-blended in small batches"
    ]
  },
  {
    name: "Yoga Mat Premium",
    description: "Experience unparalleled grip, superior joint cushioning, and absolute stability during your asanas with this premium eco-friendly wellness yoga mat.",
    price: "₹799",
    rating: 4.7,
    reviews: 60,
    image: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=1200",
    category: "Fitness",
    color: "from-emerald-400 to-teal-500",
    inStock: true,
    ingredients: "Sustainably harvested natural tree rubber and premium non-toxic eco-polyurethane.",
    usage: "Wipe down with a damp cloth after each yoga or floor meditation session.",
    benefits: [
      "100% biodegradable tree rubber",
      "Superior non-slip grip wet or dry",
      "Optimized 5mm thickness for joints",
      "Free of toxic PVC and plasticizers"
    ]
  },
  {
    name: "Herbal Tea Pack",
    description: "A delicate, cleansing herbal tea blend formulated by wellness specialists to naturally detoxify the body, promote metabolic balance, and calm the digestive system.",
    price: "₹299",
    rating: 4.5,
    reviews: 40,
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200",
    category: "Wellness",
    color: "from-emerald-400 to-teal-500",
    inStock: true,
    ingredients: "Organic dried Chamomile flowers, Lemongrass, Ginger root, Peppermint leaves, and Fennel seeds.",
    usage: "Steep 1 tea pyramid in 200ml of boiling water for 5-7 minutes. Enjoy warm before sleeping.",
    benefits: [
      "All-natural organic wellness blend",
      "100% caffeine-free & sugar-free",
      "Biodegradable cornstarch tea pyramids",
      "Packed in reusable airtight tin"
    ]
  },
];


  const sessionCards =
  approvedSessions.length > 0 ? approvedSessions : fallbackSessions;
  const retreatCards =
  approvedRetreats.length > 0 ? approvedRetreats : fallbackRetreats;
  const productCards =
  approvedProducts.length > 0 ? approvedProducts : fallbackProducts;

  console.log("Approved Items:", approvedItems);
  console.log("Sessions:", sessionCards);
  console.log("Retreats:", retreatCards);
  console.log("Products:", productCards);
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#eef4f1] text-slate-900">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row gap-4 mb-12 md:items-center"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white/80 backdrop-blur-xl rounded-[24px] border border-emerald-200/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-teal-800 placeholder:text-teal-400"
            />
          </div>
          <div className="flex gap-3">
            {/* My Bookings/Sessions button */}
            {(activeTab === "sessions" || activeTab === "retreats") && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMySessionsOpen(true)}
                className="px-5 py-4 bg-white/80 backdrop-blur-xl rounded-[24px] border border-emerald-200/30 shadow-lg text-teal-800 flex items-center gap-2 hover:bg-emerald-50 transition-colors relative"
              >
                <ListChecks className="w-5 h-5" />
                {activeTab === "sessions" ? "My Sessions" : "My Bookings"}
                {myRegistrations.filter(r => activeTab === "sessions" ? (r.type === "session" || !r.type) : r.type === "retreat").length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {myRegistrations.filter(r => activeTab === "sessions" ? (r.type === "session" || !r.type) : r.type === "retreat").length}
                  </span>
                )}
              </motion.button>
            )}
            {/* Cart button — only on Products tab */}
            {activeTab === "products" && (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMySessionsOpen(true)}
                  className="px-5 py-4 bg-white/80 backdrop-blur-xl rounded-[24px] border border-emerald-200/30 shadow-lg text-teal-800 flex items-center gap-2 hover:bg-emerald-50 transition-colors relative"
                >
                  <ListChecks className="w-5 h-5" />
                  My Orders
                  {myRegistrations.filter(r => r.type === "product").length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {myRegistrations.filter(r => r.type === "product").length}
                    </span>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsCartOpen(true)}
                  className="px-5 py-4 bg-white/80 backdrop-blur-xl rounded-[24px] border border-emerald-200/30 shadow-lg text-teal-800 flex items-center gap-2 hover:bg-emerald-50 transition-colors relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </motion.button>
              </>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedAddType(activeTab === "retreats" ? "retreat" : "session");
                setIsAddOpen(true);
              }}
              className="px-6 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-[24px] shadow-lg flex items-center gap-2 hover:from-teal-600 hover:to-emerald-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add
            </motion.button>

          </div>
        </motion.div>

        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-10"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-2 shadow-xl border border-emerald-200/30 inline-flex gap-2">
    
            <button
              onClick={() => {
                setActiveTab("sessions");
                
             }}
             className={`px-6 py-3 rounded-[20px] flex items-center gap-2 ${
               activeTab === "sessions"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                : "text-teal-700 hover:bg-emerald-50"
             }`}
           >
             <BookOpen className="w-4 h-4" />
             Sessions
           </button>

            <button
              onClick={() => {
                setActiveTab("retreats");
                
              }}
              className={`px-6 py-3 rounded-[20px] flex items-center gap-2 ${
                activeTab === "retreats"
                 ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                 : "text-teal-700 hover:bg-emerald-50"
              }`}
            >
              <MapPin className="w-4 h-4" />
              Retreats
              </button>

              <button
                onClick={() => {
                  setActiveTab("products");
                  
                }}
                className={`px-6 py-3 rounded-[20px] flex items-center gap-2 ${
                  activeTab === "products"
                   ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                   : "text-teal-700 hover:bg-emerald-50"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                Products
            </button>
          </div>
      </motion.div>
       
       
        {/* Dynamic Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-6"
        >
          
          {activeTab === "sessions" && (
            <div className="grid md:grid-cols-[55%_45%] rounded-[32px] overflow-hidden shadow-xl bg-white h-[550px] hover:shadow-2xl transition-all duration-300 ease-in-out">
              <div className="relative bg-[#D6EEE9] flex flex-col justify-center h-full px-16 py-20">
                <div className="max-w-[520px]">
                  <p className="text-xs uppercase tracking-widest mb-4 text-teal-700 font-semibold">Wellness Sessions</p>
                  <h2 className="text-6xl font-bold leading-tight mb-6 text-[#0B3B36]">Guided Meditation Live</h2>
                  <p className="text-xl text-[#215B55] opacity-90 leading-relaxed">Heal stress and calm your mind with guided sessions.</p>
                </div>
              </div>
              <div className="relative bg-emerald-50">
                <img
                  src="/session.png"
                  alt="Guided Meditation"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === "retreats" && (
            <div className="grid md:grid-cols-[55%_45%] rounded-[32px] overflow-hidden shadow-xl bg-white h-[550px] hover:shadow-2xl transition-all duration-300 ease-in-out">
              <div className="relative bg-[#D6EEE9] flex flex-col justify-center h-full px-16 py-20">
                <div className="max-w-[520px]">
                  <p className="text-xs uppercase tracking-widest mb-4 text-teal-700 font-semibold">Retreats</p>
                  <h2 className="text-6xl font-bold leading-tight mb-6 text-[#0B3B36]">Escape Into Nature</h2>
                  <p className="text-xl text-[#215B55] opacity-90 leading-relaxed">Reconnect with nature, mindfulness, and inner peace.</p>
                </div>
              </div>
              <div className="relative bg-emerald-50">
                <img
                  src="/retreats.png"
                  alt="Escape Into Nature"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
          {activeTab === "products" && (
            <div className="grid md:grid-cols-[55%_45%] rounded-[32px] overflow-hidden shadow-xl bg-white h-[550px] hover:shadow-2xl transition-all duration-300 ease-in-out">
              <div className="relative bg-[#D6EEE9] flex flex-col justify-center h-full px-16 py-20">
                <div className="max-w-[520px]">
                  <p className="text-xs uppercase tracking-widest mb-4 text-teal-700 font-semibold">Products</p>
                  <h2 className="text-6xl font-bold leading-tight mb-6 text-[#0B3B36]">Explore Wellness Products</h2>
                  <p className="text-xl text-[#215B55] opacity-90 leading-relaxed">Shop crystals, oils, and wellness essentials for your journey.</p>
                </div>
              </div>
              <div className="relative bg-emerald-50">
                <img
                  src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200"
                  alt="Explore Wellness Products"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

            </motion.div>

            <div className="mt-12"></div>
      {/* Products Section */}
      {activeTab === "products" && (
        <div className="mt-10 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productCards
              .filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((product, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => openDetail({ ...product, type: 'product' } as any)}
                  className="group bg-white rounded-[24px] border border-[#eaf4f0] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {/* Image */}
                  <div className="p-4 bg-gray-50/50">
                    <div className="relative h-32 rounded-2xl overflow-hidden bg-white shadow-sm border border-emerald-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-[#0a2e1f] font-bold text-base truncate flex-1">{product.name}</h4>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-[11px] font-bold text-[#1a3d2f]">{product.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-[12px] text-[#6a8c7a] line-clamp-2 mb-4 font-medium leading-relaxed">
                      {product.description}
                    </p>

                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-[#9abba8] uppercase tracking-widest">Price</span>
                          <span className="text-lg font-extrabold text-[#0a2e1f]">{product.price}</span>
                        </div>
                        {product.inStock ? (
                          <span className="text-[10px] font-bold text-[#3db87a] bg-[#effef5] px-2 py-0.5 rounded-md uppercase tracking-wider">In Stock</span>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-400 bg-rose-50 px-2 py-0.5 rounded-md uppercase tracking-wider">Sold Out</span>
                        )}
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail({ ...product, type: 'product' } as any);
                        }}
                        className="w-full py-3 bg-[#0a2e1f] text-white text-[13px] font-bold rounded-xl shadow-lg shadow-emerald-900/10 hover:bg-[#0d3b28] transition-colors flex items-center justify-center gap-2"
                      >
                        Book Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Sessions Grid */}
      {activeTab === "sessions" && (
        <div className="mt-10 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sessionCards
              .filter((session) =>
                session.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((session, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => openDetail({ ...session, type: 'session' } as any)}
                  className="group bg-white rounded-[24px] border border-[#eaf4f0] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <div className="p-4 bg-gray-50/50">
                    <div className="relative h-32 rounded-2xl overflow-hidden bg-white shadow-sm border border-emerald-50">
                      <img
                        src={session.image}
                        alt={session.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-[#0a2e1f] font-bold text-base truncate mb-0.5">{session.title}</h3>
                    <p className="text-[11px] text-[#6a8c7a] font-bold uppercase tracking-wider mb-3">by {session.host}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {session.topics.slice(0, 2).map((topic, j) => (
                        <span key={j} className="px-2 py-0.5 bg-[#f0f7f4] text-[#2d6a4f] text-[10px] font-bold rounded-md border border-[#dceae2]">
                          {topic}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-2 mb-5">
                      <div className="flex items-center gap-2 text-[12px] font-semibold text-[#4a7c65]">
                        <Clock className="w-3.5 h-3.5" />
                        {session.duration}
                      </div>
                      <div className="flex items-center gap-2 text-[12px] font-semibold text-[#4a7c65]">
                        <CalendarRange className="w-3.5 h-3.5" />
                        <span className="truncate">{session.schedule}</span>
                      </div>
                    </div>

                    <div className="mt-auto space-y-4">
                      <div className="flex items-baseline justify-between pt-3 border-t border-[#f0f4f2]">
                        <span className="text-[10px] font-bold text-[#9abba8] uppercase tracking-widest">Pricing</span>
                        <span className="text-lg font-extrabold text-[#0a2e1f]">{session.price}</span>
                      </div>

                      {session.approvedId ? (
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => { e.stopPropagation(); handleCompleteItem(session.approvedId || ""); }}
                          className="w-full py-3 bg-rose-500 text-white text-[13px] font-bold rounded-xl shadow-lg shadow-rose-900/10 hover:bg-rose-600 transition-colors"
                        >
                          Mark Completed
                        </motion.button>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => { e.stopPropagation(); openDetail({ ...session, type: 'session' } as any); }}
                          className="w-full py-3 bg-[#0a2e1f] text-white text-[13px] font-bold rounded-xl shadow-lg shadow-emerald-900/10 hover:bg-[#0d3b28] transition-colors"
                        >
                          View Details
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Retreats Grid */}
      {activeTab === "retreats" && (
        <div className="mt-10 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {retreatCards
              .filter((retreat) =>
                retreat.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((retreat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => openDetail({ ...retreat, type: 'retreat' } as any)}
                  className="group bg-white rounded-[24px] border border-[#eaf4f0] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <div className="p-4 bg-gray-50/50">
                    <div className="relative h-32 rounded-2xl overflow-hidden bg-white shadow-sm border border-emerald-50">
                      <img
                        src={retreat.image}
                        alt={retreat.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-0.5">
                      <h3 className="text-[#0a2e1f] font-bold text-base truncate flex-1">{retreat.title}</h3>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-[11px] font-bold text-[#1a3d2f]">{retreat.rating}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#6a8c7a] font-bold uppercase tracking-wider mb-4">Led by {retreat.guide}</p>

                    <div className="space-y-2 mb-5">
                      <div className="flex items-center gap-2 text-[12px] font-semibold text-[#4a7c65]">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{retreat.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] font-semibold text-[#4a7c65]">
                        <CalendarRange className="w-3.5 h-3.5" />
                        <span className="truncate">{retreat.dates}</span>
                      </div>
                    </div>

                    <div className="mt-auto space-y-4">
                      <div className="flex items-baseline justify-between pt-3 border-t border-[#f0f4f2]">
                        <span className="text-[10px] font-bold text-[#9abba8] uppercase tracking-widest">Fee</span>
                        <span className="text-lg font-extrabold text-[#0a2e1f]">{retreat.price}</span>
                      </div>

                      {retreat.approvedId ? (
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => { e.stopPropagation(); handleCompleteItem(retreat.approvedId || ""); }}
                          className="w-full py-3 bg-rose-500 text-white text-[13px] font-bold rounded-xl shadow-lg shadow-rose-900/10 hover:bg-rose-600 transition-colors"
                        >
                          Mark Completed
                        </motion.button>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => { e.stopPropagation(); openDetail({ ...retreat, type: 'retreat' } as any); }}
                          className="w-full py-3 bg-[#0a2e1f] text-white text-[13px] font-bold rounded-xl shadow-lg shadow-emerald-900/10 hover:bg-[#0d3b28] transition-colors"
                        >
                          Request Spot
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}


        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          <div className="flex items-center gap-4 p-6 bg-white/80 backdrop-blur-xl rounded-[32px] shadow-lg border border-emerald-200/30">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h5 className="text-teal-800 mb-1">Secure Payment</h5>
              <p className="text-sm text-teal-600">100% protected transactions</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 bg-white/80 backdrop-blur-xl rounded-[32px] shadow-lg border border-emerald-200/30">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div>
              <h5 className="text-teal-800 mb-1">Quality Guaranteed</h5>
              <p className="text-sm text-teal-600">Curated by experts</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 bg-white/80 backdrop-blur-xl rounded-[32px] shadow-lg border border-emerald-200/30">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h5 className="text-teal-800 mb-1">Fast Delivery</h5>
              <p className="text-sm text-teal-600">Free shipping over $50</p>
            </div>
          </div>
        </motion.div>

        {isAddOpen && (
          <AddItemModal
            onClose={() => setIsAddOpen(false)}
            selectedAddType={selectedAddType}
            setSelectedAddType={setSelectedAddType}
          />
        )}

        {/* Detail popup (Unstop-style) */}
        <ItemDetailModal
          isOpen={isDetailOpen}
          onClose={() => { setIsDetailOpen(false); setDetailItem(null); }}
          item={detailItem}
          onAddToCart={handleDetailAddToCart}
          onRegisterSession={handleDetailRegisterSession}
          onRequestRetreat={handleDetailRequestRetreat}
        />

        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => {
            setIsCheckoutOpen(false);
            setCheckoutItem(null);
          }}
          item={checkoutItem}
          onConfirm={onConfirmCheckout}
        />

        <SessionRegistrationModal
          isOpen={isRegModalOpen}
          onClose={() => { setIsRegModalOpen(false); setSelectedSession(null); }}
          session={selectedSession}
          onRegistered={handleRegistered}
        />

        <RetreatRegistrationModal
          isOpen={isRetreatRegModalOpen}
          onClose={() => { setIsRetreatRegModalOpen(false); setSelectedRetreat(null); }}
          retreat={selectedRetreat}
          onRegistered={handleRegistered}
        />

        <MySessionsDrawer
          isOpen={mySessionsOpen}
          onClose={() => setMySessionsOpen(false)}
          registrations={myRegistrations.filter(r => 
            activeTab === "sessions" 
              ? (r.type === "session" || !r.type) 
              : activeTab === "retreats"
                ? r.type === "retreat"
                : r.type === "product"
          )}
        />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onContinueCheckout={handleCartContinueCheckout}
          onStartShopping={() => {
            setIsCartOpen(false);
            setActiveTab("products");
          }}
        />
      </div>
    </div>
  );
}
