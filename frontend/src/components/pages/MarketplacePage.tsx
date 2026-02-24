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
import io from "socket.io-client";
import AddItemModal from "../marketplace/AddItemModal";

type MarketplaceItem = {
  id: string;
  requestId: string;
  type: "session" | "retreat" | "product";
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
  const [activeTab, setActiveTab] =
    useState<"sessions" | "retreats" | "products">("sessions");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedAddType, setSelectedAddType] = useState<
    "session" | "retreat" | "product"
  >("session");
  const [approvedItems, setApprovedItems] = useState<MarketplaceItem[]>([]);

  const DEFAULT_SESSION_IMAGE =
    "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600";
  const DEFAULT_RETREAT_IMAGE =
    "https://images.unsplash.com/photo-1523419400524-33de15b45d5b?w=600";
  const DEFAULT_PRODUCT_IMAGE =
    "https://images.unsplash.com/photo-1663899940872-6dba376bbfdb?w=600";

  const loadApprovedItems = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/marketplace/items?status=active",
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
        `http://localhost:5000/api/marketplace/items/${itemId}/complete`,
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

  useEffect(() => {
    loadApprovedItems();

    const socket = io("http://localhost:5000");
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

  const approvedProducts: ProductCard[] = approvedItems
    .filter((item) => item.type === "product")
    .map((item) => {
      const images = typeof item.data?.images === "string"
        ? item.data.images.split(",").map((img: string) => img.trim())
        : [];
      const image = images[0] || DEFAULT_PRODUCT_IMAGE;
      return {
        id: item.id,
        approvedId: item.id,
        name: item.data?.name || "Untitled Product",
        description: item.data?.description || "",
        price: item.data?.price ? `₹${item.data?.price}` : "Free",
        rating: 5.0,
        reviews: 0,
        image,
        category: item.data?.category || "Other",
        color: "from-emerald-400 to-teal-500",
        inStock: item.data?.stockAvailability !== "Out of Stock",
      };
    });

  const sessionCards = approvedSessions;
  const retreatCards = approvedRetreats;
  const productCards = approvedProducts;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-[#fdfcfb] via-[#f8f7f4] to-[#f5f4f1] text-slate-900">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-slate-900 text-6xl md:text-7xl font-extrabold mb-6">
            Marketplace
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-slate-700 leading-relaxed">
            <span className="block">
              "Sessions that meet you where you are, retreats that take you where you dream."
            </span>
            <span className="block">
              Curated journeys, soulful products, and the spaces between.
            </span>
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-2 shadow-xl border border-emerald-200/30 inline-flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("sessions")}
              className={`px-8 py-4 rounded-[24px] transition-all flex items-center gap-2 ${activeTab === "sessions"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : "text-teal-700 hover:bg-emerald-50"
                }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Sessions</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("retreats")}
              className={`px-8 py-4 rounded-[24px] transition-all flex items-center gap-2 ${activeTab === "retreats"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : "text-teal-700 hover:bg-emerald-50"
                }`}
            >
              <MapPin className="w-5 h-5" />
              <span>Retreats</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("products")}
              className={`px-8 py-4 rounded-[24px] transition-all flex items-center gap-2 ${activeTab === "products"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : "text-teal-700 hover:bg-emerald-50"
                }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Products</span>
            </motion.button>
          </div>
        </motion.div>

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
              className="w-full pl-14 pr-6 py-4 bg-white/80 backdrop-blur-xl rounded-[24px] border border-emerald-200/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-teal-800 placeholder:text-teal-400"
            />
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedAddType(activeTab === "products" ? "product" : activeTab === "retreats" ? "retreat" : "session");
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

        {/* Sessions Grid */}
        {activeTab === "sessions" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sessionCards.map((session, i) => (
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
                          className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl shadow-lg"
                        >
                          Join Live
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
            {retreatCards.map((retreat, i) => (
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

        {/* Products Grid */}
        {activeTab === "products" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productCards.map((product, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative h-full"
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${product.color} rounded-[40px] blur-xl opacity-0 group-hover:opacity-30 transition-opacity`}
                />
                <div className="relative bg-white/90 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-xl border border-emerald-200/30 h-[500px] flex flex-col">
                  {/* Product Image */}
                  <div className="relative h-[35%] min-h-[170px] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
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
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-xl text-teal-800 rounded-full text-sm shadow-lg">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex-1 flex flex-col overflow-hidden">
                    <h4 className="text-teal-800 mb-2 truncate">{product.name}</h4>

                    <p className="text-sm text-teal-600 mb-3 overflow-hidden">
                      {product.description.length > 120
                        ? `${product.description.slice(0, 120)}...`
                        : product.description}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-lime-400 text-lime-400" />
                        <span className="text-teal-800">{product.rating}</span>
                      </div>
                      <span className="text-sm text-teal-600">
                        ({product.reviews} reviews)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      {product.inStock ? (
                        <div className="flex items-center gap-2 text-sm text-emerald-600">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          In Stock
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-rose-600">
                          <div className="w-2 h-2 rounded-full bg-rose-500" />
                          Out of Stock
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-emerald-200/30 mt-auto min-h-[75px]">
                      <div>
                        <div className="text-2xl text-teal-800">
                          {product.price}
                        </div>
                      </div>
                      {product.approvedId ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCompleteItem(product.approvedId || "")}
                          className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-2xl shadow-lg"
                        >
                          Mark Completed
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl shadow-lg"
                        >
                          Book Now
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
