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
  Filter,
  Search,
  Award,
  MapPin,
  CalendarRange,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BACKEND_CONFIG from "@/config/backend";
import io from "socket.io-client";
import AddItemModal from "../marketplace/AddItemModal";

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
  const [selectedProduct, setSelectedProduct] = useState<ProductCard | null>(null);
  const { user } = useAuth();
  const apiBaseUrl = BACKEND_CONFIG.API_BASE_URL;

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

  const handleProductPurchase = async (product: ProductCard) => {
    try {
      await createBooking({
        itemId: product.id || `product-${product.name}`,
        itemName: product.name,
        type: "product",
        price: parsePrice(product.price),
        platform: "Online",
        date: new Date().toISOString(),
      });
      alert("Purchase completed successfully!");
      setSelectedProduct(null);
    } catch (error: any) {
      console.error("Product purchase failed:", error);
      alert(error.message || "Failed to complete purchase. Please try again.");
    }
  };

  const handleRetreatRequest = async (retreat: RetreatCard) => {
    try {
      await createBooking({
        itemId: retreat.id || `retreat-${retreat.title}`,
        itemName: retreat.title,
        type: "retreat",
        price: parsePrice(retreat.price),
        platform: "Offline",
        date: retreat.dates,
        time: "TBD",
      });
      alert("Retreat booking requested successfully!");
    } catch (error: any) {
      console.error("Retreat request failed:", error);
      alert(error.message || "Failed to request retreat spot. Please try again.");
    }
  };

  const handleSessionBooking = async (session: SessionCard) => {
    try {
      await createBooking({
        itemId: session.id || `session-${session.title}`,
        itemName: session.title,
        type: "session",
        price: parsePrice(session.price),
        platform: session.schedule,
        date: new Date().toISOString(),
        time: session.duration,
      });
      alert("Session booked successfully!");
    } catch (error: any) {
      console.error("Session booking failed:", error);
      alert(error.message || "Failed to book session. Please try again.");
    }
  };

  useEffect(() => {
    loadApprovedItems();

    const socket = io(BACKEND_CONFIG.SOCKET_BASE_URL);
    socket.on("marketplace-item-created", loadApprovedItems);
    socket.on("marketplace-item-completed", loadApprovedItems);

    const handleFocus = () => loadApprovedItems();
    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handleFocus);

    return () => {
      socket.disconnect();
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handleFocus);
    };
  }, []);

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
    .map((item) => ({
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
    }));

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
  },
];
  
  const approvedProducts: ProductCard[] = approvedItems
     .filter((item) => item.type === "product")
     .map((item) => ({
       id: item.id,
       approvedId: item.id,
       name: item.data?.name || "Product",
       description: item.data?.description || "",
       price: `₹${item.data?.price || 0}`,
       rating: 4.5,
       reviews: 10,
       image: item.data?.images
         ? item.data.images.split(",")[0]
         : DEFAULT_PRODUCT_IMAGE,
       category: item.data?.category || "Other",
       color: "from-emerald-400 to-teal-500",
       inStock: item.data?.stockAvailability !== "Out of Stock",
     }));

     // Fallback static products (for UI display if backend is empty)
    const fallbackProducts: ProductCard[] = [
  {
    name: "Healing Crystal Kit",
    description: "Powerful crystals for energy healing and meditation.",
    price: "₹999",
    rating: 4.8,
    reviews: 120,
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200",
    category: "Spiritual",
    color: "from-emerald-400 to-teal-500",
    inStock: true,
  },
  {
    name: "Aroma Therapy Oil",
    description: "Relaxing essential oils for stress relief.",
    price: "₹499",
    rating: 4.6,
    reviews: 80,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200",
    category: "Wellness",
    color: "from-emerald-400 to-teal-500",
    inStock: true,
  },
  {
    name: "Yoga Mat Premium",
    description: "Comfortable non-slip yoga mat for daily practice.",
    price: "₹799",
    rating: 4.7,
    reviews: 60,
    image: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=1200",
    category: "Fitness",
    color: "from-emerald-400 to-teal-500",
    inStock: true,
  },
  {
    name: "Herbal Tea Pack",
    description: "Natural detox herbal tea for relaxation.",
    price: "₹299",
    rating: 4.5,
    reviews: 40,
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200",
    category: "Wellness",
    color: "from-emerald-400 to-teal-500",
    inStock: true,
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
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-4 bg-white/80 backdrop-blur-xl rounded-[24px] border border-emerald-200/30 shadow-lg text-teal-800 flex items-center gap-2 hover:bg-emerald-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
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
                setSelectedProduct(null); // 👈 add this
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
                setSelectedProduct(null); // 👈 add this
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
                  setSelectedProduct(null);
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
          
          {!selectedProduct && activeTab === "sessions" && (
            <div className="grid md:grid-cols-2 rounded-[36px] overflow-hidden shadow-2xl bg-white min-h-[604px] md:h-[684px]">
              <div className="p-10 md:p-14 bg-[#BFE3DC] flex flex-col justify-center">
                <p className="text-sm uppercase mb-3">Wellness Sessions</p>
                <h2 className="text-5xl font-bold mb-4">Guided Meditation Live</h2>
                <p className="mb-6">Heal stress and calm your mind.</p>
             </div>
             <img
               src="https://peacefulsoulquest.com/wp-content/uploads/2023/12/inner_peace-e1702828727196.webp"
               className="w-full h-full object-cover"
             />
           </div>
          )}

          {!selectedProduct && activeTab === "retreats" && (
            <div className="grid md:grid-cols-2 rounded-[36px] overflow-hidden shadow-2xl bg-white min-h-[604px] md:h-[684px]">
              <div className="p-10 md:p-14 bg-[#C7DFFF] flex flex-col justify-center">
                <p className="text-sm uppercase mb-3">Retreats</p>
                <h2 className="text-5xl font-bold mb-4">Escape Into Nature</h2>
                <p className="mb-6">Relax and reconnect.</p>
             </div>
             <img
               src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200"
               className="w-full h-full object-cover"
             />
           </div>
          )}
          {!selectedProduct && activeTab === "products" && (
             <div className="grid md:grid-cols-2 rounded-[36px] overflow-hidden shadow-2xl bg-white min-h-[604px] md:h-[684px]">
               <div className="p-10 md:p-14 bg-[#E0F7F4] flex flex-col justify-center">
                 <p className="text-sm uppercase mb-3">Products</p>
                 <h2 className="text-5xl font-bold mb-4">Explore Wellness Products</h2>
                 <p className="mb-6">Shop crystals, oils and more.</p>
               </div>
               <img
                 src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200"
                 className="w-full h-full object-cover"
               />
             </div>
            )}

            </motion.div>

            <div className="mt-12"></div>

           
            
      {/* Products Section */}
      {activeTab === "products" && (
        <div className="mt-10 mb-16">

         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {productCards
            .filter((product) =>
              product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((product, i) => {
              return (
                <motion.div
                  key={i}
                  onClick={() => setSelectedProduct(product)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8 }}
                  className="group relative h-full cursor-pointer"
                >
                  {/* Glow */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${product.color} rounded-[40px] blur-xl opacity-0 group-hover:opacity-30 transition-opacity`}
                 />

                 <div className="relative bg-white/90 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-xl border border-emerald-200/30 h-[500px] flex flex-col transition-all duration-300 group-hover:shadow-2xl">

                   <div className="relative h-[35%] min-h-[170px] overflow-hidden">
                     <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                   />

                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                   <div className="absolute top-4 right-4">
                     <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
                      > 
                        <Heart className="w-5 h-5 text-rose-500" />
                      </motion.button>
                    </div>

                    <div className="absolute bottom-4 left-4">
                      <span className="px-4 py-2 bg-white/90 text-teal-800 rounded-full text-sm shadow-lg">
                        {product.category}
                     </span>
                   </div>
                 </div>

                 <div className="p-6 flex-1 flex flex-col">
                   <h4 className="text-teal-800 mb-2 truncate">{product.name}</h4>

                   <p className="text-sm text-teal-600 mb-3">
                     {product.description.length > 120
                       ? `${product.description.slice(0, 120)}...`
                       : product.description}
                   </p>

                   <div className="flex items-center gap-2 mb-4">
                     <Star className="w-4 h-4 fill-lime-400 text-lime-400" />
                     <span className="text-teal-800">{product.rating}</span>
                     <span className="text-sm text-teal-600">
                       ({product.reviews} reviews)
                     </span>
                   </div>

                   <div className="mb-3">
                     {product.inStock ? (
                       <span className="text-emerald-600 text-sm">In Stock</span>
                     ) : (
                      <span className="text-rose-600 text-sm">Out of Stock</span>
                     )}
                   </div>

                   <div className="flex justify-between items-center mt-auto pt-4 border-t">
                     <span className="text-2xl text-teal-800">{product.price}</span>

                     <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={async (e) => {
                          e.stopPropagation();
                          await handleProductPurchase(product);
                        }}
                        className="px-5 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl"
                      >
                        Book Now
                     </motion.button>
                   </div>
                 </div>
               </div>
             </motion.div>
           );
         })}
       </div>
     </div>
   )}
        {/* Sessions Grid */}
        {activeTab === "sessions" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sessionCards
              .filter((session) =>
                session.title.toLowerCase().includes(searchTerm.toLowerCase())
             )
             .map((session, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative h-full"
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${session.color} rounded-[40px] blur-xl opacity-0 group-hover:opacity-30 transition-opacity`}
                />
                <div className="relative bg-white/90 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-xl border border-emerald-200/30 h-[500px] flex flex-col">
                  {/* Course Image */}
                  <div className="relative h-[35%] min-h-[170px] overflow-hidden">
                    <img
                      src={session.image}
                      alt={session.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Heart className="w-5 h-5 text-rose-500" />
                      </motion.button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span
                        className={`px-4 py-2 bg-gradient-to-r ${session.color} text-white rounded-full text-sm shadow-lg`}
                      >
                        Online Session
                      </span>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-6 flex-1 flex flex-col overflow-hidden">
                    <h3 className="text-teal-800 mb-2 truncate">{session.title}</h3>

                    <p className="text-sm text-teal-600 mb-3 truncate">
                      Host: {session.host}
                    </p>

                    <div className="flex items-center gap-4 mb-3 text-sm text-teal-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {session.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarRange className="w-4 h-4" />
                        {session.schedule}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-lime-400 text-lime-400" />
                        <span className="text-teal-800">{session.rating}</span>
                      </div>
                      <span className="text-sm text-teal-600">{session.attendees}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4 overflow-hidden">
                      {session.topics.map((topic, j) => (
                        <span
                          key={j}
                          className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-emerald-200/30 mt-auto min-h-[75px]">
                      <div>
                        <div className="text-2xl text-teal-800">
                          {session.price}
                        </div>
                      </div>
                      {session.approvedId ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCompleteItem(session.approvedId || "")}
                          className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-2xl shadow-lg"
                        >
                          Mark Completed
                        </motion.button>
                      ) : (
                       <motion.button
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={async () => {
                          await handleSessionBooking(session);
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl shadow-lg"
                      >
                        Join Today
                     </motion.button> 
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Retreats Grid */}
        {activeTab === "retreats" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {retreatCards
              .filter((retreat) =>
               retreat.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((retreat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative h-full"
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${retreat.color} rounded-[40px] blur-xl opacity-0 group-hover:opacity-30 transition-opacity`}
                />
                <div className="relative bg-white/90 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-xl border border-emerald-200/30 h-[500px] flex flex-col">
                  <div className="relative h-[35%] min-h-[170px] overflow-hidden">
                    <img
                      src={retreat.image}
                      alt={retreat.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Heart className="w-5 h-5 text-rose-500" />
                      </motion.button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span
                        className={`px-4 py-2 bg-gradient-to-r ${retreat.color} text-white rounded-full text-sm shadow-lg`}
                      >
                        Offline Retreat
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3 flex-1 flex flex-col overflow-hidden">
                    <div>
                      <h3 className="text-teal-800 mb-1 truncate">{retreat.title}</h3>
                      <p className="text-sm text-teal-600 truncate">Led by {retreat.guide}</p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-teal-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {retreat.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarRange className="w-4 h-4" />
                        {retreat.dates}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-teal-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {retreat.capacity}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-lime-400 text-lime-400" />
                        {retreat.rating}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 overflow-hidden">
                      {retreat.highlights.map((item, j) => (
                        <span
                          key={j}
                          className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-emerald-200/30 mt-auto min-h-[75px]">
                      <div>
                        <div className="text-2xl text-teal-800">{retreat.price}</div>
                      </div>
                      {retreat.approvedId ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCompleteItem(retreat.approvedId || "")}
                          className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-2xl shadow-lg"
                        >
                          Mark Completed
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={async () => {
                            await handleRetreatRequest(retreat);
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl shadow-lg"
                        >
                          Request Spot
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

       {/* Product Modal */}
       {activeTab === "products" && selectedProduct && (
         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
           <div className="bg-white rounded-3xl p-6 max-w-lg w-full relative">

             <button
               onClick={() => setSelectedProduct(null)}
               className="absolute top-4 right-4 text-xl"
              >
               ✕
             </button>

             <img
               src={selectedProduct.image}
               className="w-full h-80 object-cover rounded-2xl mb-4"
             />

             <h2 className="text-2xl font-bold mb-2">
               {selectedProduct.name}
             </h2>

             <p className="text-gray-600 mb-4">
               {selectedProduct.description}
             </p>

             <div className="text-xl font-semibold text-teal-700">
               {selectedProduct.price}
             </div>

             <button
               onClick={async () => {
                 await handleProductPurchase(selectedProduct);
               }}
               className="mt-4 w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl"
             >
               Buy Now
             </button>

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
      </div>
    </div>
  );
}
