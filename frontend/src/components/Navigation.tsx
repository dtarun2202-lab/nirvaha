import { motion } from "motion/react";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { InitialsAvatar } from "./ui/InitialsAvatar";
import { wellnessSessions } from "../data/wellnessSessions";

const SEARCH_PLACEHOLDERS = [
  "Search for 'gaming wellness'...",
  "Search for 'ott wellness'...",
  "Search for 'healing music'...",
  "Search for 'chakra experience'..."
];

export function Navigation({ currentPage, onNavigate }: { currentPage: string; onNavigate?: (page: string) => void }) {
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresMenuOpen, setFeaturesMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [placeholderText, setPlaceholderText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = SEARCH_PLACEHOLDERS[placeholderIndex];
    let typingSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && placeholderText === currentFullText) {
      typingSpeed = 2500;
    }

    const timer = setTimeout(() => {
      if (!isDeleting && placeholderText === currentFullText) {
        setIsDeleting(true);
      } else if (isDeleting && placeholderText === "") {
        setIsDeleting(false);
        setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
      } else {
        setPlaceholderText((prev) =>
          isDeleting
            ? currentFullText.substring(0, prev.length - 1)
            : currentFullText.substring(0, prev.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting, placeholderIndex]);

  type SearchRoute = {
    name: string;
    path: string;
    category: string;
    desc?: string;
  };

  const searchableRoutes: SearchRoute[] = [
    { name: "Home", path: "/", category: "Pages" as const },
    { name: "Academy", path: "/academy", category: "Pages" as const },
    { name: "Stories", path: "/stories", category: "Pages" as const },
    { name: "Overview", path: "/dashboard/overview", category: "Dashboard" as const },
    { name: "Meditation", path: "/dashboard/meditation", category: "Features" as const },
    { name: "Sound Healing", path: "/dashboard/sound", category: "Features" as const },
    { name: "AI Guide", path: "/dashboard/chatbot", category: "Features" as const },
    { name: "Community", path: "/dashboard/community", category: "Features" as const },
    { name: "Marketplace", path: "/dashboard/marketplace", category: "Dashboard" as const },
    { name: "Companion", path: "/dashboard/companion", category: "Dashboard" as const },
    { name: "My Profile", path: "/dashboard/profile", category: "Account" as const },
    { name: "Settings", path: "/dashboard/profile?open=settings", category: "Account" as const },
    { name: "Pathways", path: "/pathways", category: "Academy Pathways" as const },
    { name: "Chakra Experience", path: "/chakra-experience", category: "Academy Pathways" as const },
    { name: "Healing Music", path: "/healing-music", category: "Academy Pathways" as const },
    { name: "Wellness OTT", path: "/wellness-ott", category: "Features" as const, desc: "Watch wellness experiences on-demand." },
    { name: "OTT Wellness", path: "/wellness-ott", category: "Features" as const, desc: "Netflix-style wellness series and films." },
    { name: "Gaming Wellness Hub", path: "/dashboard/overview?scrollTo=gaming-hub", category: "Features" as const, desc: "Gamified wellness and interactive sessions." },
    { name: "Breathing", path: "/breathing", category: "Academy Pathways" as const },
    ...wellnessSessions.map((s) => ({
      name: s.title,
      path: `/wellness-ott/series/${s.id}`,
      category: "Wellness OTT",
      desc: s.description,
    })),
  ];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredRoutes =
    normalizedQuery === ""
      ? []
      : searchableRoutes
          .filter((r) => (r.name + " " + r.path).toLowerCase().includes(normalizedQuery))
          .slice(0, 10);

  const categoryOrder = ["Pages", "Dashboard", "Features", "Academy Pathways", "Wellness OTT", "Account"] as const;
  const routeCategories = categoryOrder.filter((cat) => filteredRoutes.some((r) => r.category === cat));

  const [isVisible, setIsVisible] = useState(true);
  const [isHoveredAtTop, setIsHoveredAtTop] = useState(false);
  const [isForceHidden, setIsForceHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleToggleNav = (e: any) => {
      if (e.detail?.hide !== undefined) {
        setIsForceHidden(e.detail.hide);
        setIsVisible(!e.detail.hide);
      }
    };

    window.addEventListener("nirvaha-toggle-nav", handleToggleNav);

    const handleScroll = () => {
      if (isForceHidden) return;
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 80) {
        setIsHoveredAtTop(true);
      } else {
        setIsHoveredAtTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("nirvaha-toggle-nav", handleToggleNav);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isForceHidden]);

  useEffect(() => {
    const isAnyMenuOpen = featuresMenuOpen || profileMenuOpen;
    window.dispatchEvent(new CustomEvent('nirvaha-menu-open', { detail: { isOpen: isAnyMenuOpen } }));
  }, [featuresMenuOpen, profileMenuOpen]);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      const insideDesktop = desktopSearchRef.current?.contains(e.target as Node);
      const insideMobile = mobileSearchRef.current?.contains(e.target as Node);
      if (!insideDesktop && !insideMobile) {
        setIsSearchOpen(false);
      }
    };
    const onDocKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onDocKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onDocKeyDown);
    };
  }, []);

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      switch (page) {
        case 'home': navigate('/dashboard/overview'); break;
        case 'overview': navigate('/dashboard/overview'); break;
        case 'meditation': navigate('/dashboard/meditation'); break;
        case 'sound': navigate('/dashboard/sound'); break;
        case 'chatbot': navigate('/dashboard/chatbot'); break;
        case 'community': navigate('/dashboard/community'); break;
        case 'marketplace': navigate('/dashboard/marketplace'); break;
        case 'companion': navigate('/dashboard/companion'); break;
        case 'gaming-hub': navigate('/dashboard/overview?scrollTo=gaming-hub'); break;
        case 'profile': navigate('/dashboard/profile'); break;
        case 'certification': navigate('/pathways'); break;
        default: navigate(`/dashboard/${page}`);
      }
    }
    setMobileMenuOpen(false);
    setFeaturesMenuOpen(false);
    setProfileMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const featureItems = [
    { id: "certification", label: "Nirvaha Certification" },
    { id: "meditation", label: "Meditation" },
    { id: "sound", label: "Sound Healing" },
    { id: "chatbot", label: "AI Guide" },
    { id: "community", label: "Community" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: (isVisible || isHoveredAtTop || featuresMenuOpen || profileMenuOpen || isSearchOpen) ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="absolute top-0 left-0 right-0 z-50 backdrop-blur-xl border-b shadow-lg transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(10, 61, 40, 0.95) 0%, rgba(6, 45, 30, 0.95) 100%)',
          borderColor: 'rgba(16, 185, 129, 0.2)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer relative h-12 w-24"
              whileHover={{ scale: 1.05 }}
              onClick={() => handleNavigate("home")}
            >
              <img
                src="/logo1.png"
                alt="Nirvaha Logo"
                className="h-24 w-auto object-contain absolute -left-6 top-1/2 -translate-y-1/2 max-w-none"
                style={{ filter: 'drop-shadow(0px 2px 8px rgba(16, 185, 129, 0.3))' }}
              />
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Home */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigate("home")}
                className={`flex items-center gap-2 px-4 py-2 transition-all ${
                  currentPage === "home" ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                <span className="text-sm font-bold uppercase tracking-wider">Home</span>
              </motion.button>

              {/* Features Dropdown */}
              <div className="relative">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFeaturesMenuOpen(!featuresMenuOpen)}
                  onMouseEnter={() => setFeaturesMenuOpen(true)}
                  className={`flex items-center gap-2 px-4 py-2 transition-all ${
                    ["meditation", "sound", "chatbot", "community"].includes(currentPage)
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <span className="text-sm font-bold uppercase tracking-wider">Features</span>
                  <ChevronDown className="w-4 h-4" />
                </motion.button>

                {featuresMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseLeave={() => setFeaturesMenuOpen(false)}
                    className="absolute top-full left-0 mt-2 w-64 backdrop-blur-xl rounded-3xl shadow-2xl border overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(10,61,40,0.97) 0%, rgba(6,45,30,0.97) 100%)',
                      borderColor: 'rgba(16,185,129,0.2)'
                    }}
                  >
                    {featureItems.map((item, index) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 4, backgroundColor: "rgba(16, 185, 129, 0.15)" }}
                        onClick={() => {
                          handleNavigate(item.id);
                          setFeaturesMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-start gap-3 px-6 py-3 transition-all text-left ${
                          currentPage === item.id ? "text-emerald-300" : "text-white/80"
                        }`}
                      >
                        <span>{item.label}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Marketplace */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigate("marketplace")}
                className={`flex items-center gap-2 px-4 py-2 transition-all ${
                  currentPage === "marketplace" ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                <span className="text-sm font-bold uppercase tracking-wider">Marketplace</span>
              </motion.button>

              {/* Companion */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigate("companion")}
                className={`flex items-center gap-2 px-4 py-2 transition-all ${
                  currentPage === "companion" ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                <span className="text-sm font-bold uppercase tracking-wider">Companion</span>
              </motion.button>

              {/* Gaming Hub */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigate("gaming-hub")}
                className={`flex items-center gap-2 px-4 py-2 transition-all ${
                  currentPage === "gaming-hub" ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                <span className="text-sm font-bold uppercase tracking-wider">Gaming Hub</span>
              </motion.button>
            </div>

            {/* Search + Profile (Desktop) */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Search bar */}
              <div ref={desktopSearchRef} className="relative">
                <div className="relative flex items-center border rounded-2xl py-1.5 px-3 w-72 transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    borderColor: 'rgba(255,255,255,0.2)'
                  }}
                >
                  <Search className="w-4 h-4 text-white/60 mr-2 flex-shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={placeholderText || "Search..."}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    className="w-full bg-transparent border-none outline-none text-white placeholder-white/40 text-xs font-semibold"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => {
                        setSearchQuery("");
                        requestAnimationFrame(() => searchInputRef.current?.focus());
                      }}
                      className="text-white/40 hover:text-white text-xs font-bold"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {isSearchOpen && normalizedQuery !== "" && (
                  <div className="absolute top-full right-0 mt-2 w-[26rem] backdrop-blur-xl rounded-3xl shadow-2xl border p-2 max-h-[350px] overflow-y-auto z-[70]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(10,61,40,0.97) 0%, rgba(6,45,30,0.97) 100%)',
                      borderColor: 'rgba(16,185,129,0.2)'
                    }}
                  >
                    {filteredRoutes.length === 0 ? (
                      <div className="text-center py-6 text-xs text-white/50 font-medium">
                        No results found for "{searchQuery}"
                      </div>
                    ) : (
                      <div className="space-y-3 p-1">
                        {routeCategories.map((cat) => (
                          <div key={cat}>
                            <div className="px-3 py-1 text-[10px] uppercase font-black text-emerald-400/60 tracking-wider">
                              {cat}
                            </div>
                            <div className="space-y-0.5 mt-1">
                              {filteredRoutes
                                .filter((r) => r.category === cat)
                                .map((r) => (
                                  <button
                                    key={r.path}
                                    onClick={() => {
                                      navigate(r.path);
                                      setIsSearchOpen(false);
                                      setSearchQuery("");
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:bg-emerald-500/20 hover:text-white transition-colors"
                                  >
                                    <div className="min-w-0">
                                      <div className="truncate">{r.name}</div>
                                      {r.desc && <div className="text-[10px] text-white/40 truncate mt-0.5">{r.desc}</div>}
                                    </div>
                                  </button>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative ml-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  onMouseEnter={() => setProfileMenuOpen(true)}
                  className="flex items-center gap-3 px-4 py-2 rounded-2xl hover:shadow-lg transition-all"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  <InitialsAvatar name={user?.name || "Guest"} size="sm" className="shadow-md" />
                  <ChevronDown className="w-4 h-4 text-white/60" />
                </motion.button>

                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseLeave={() => setProfileMenuOpen(false)}
                    className="absolute top-full right-0 mt-2 w-72 backdrop-blur-xl rounded-3xl shadow-2xl border overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(10,61,40,0.97) 0%, rgba(6,45,30,0.97) 100%)',
                      borderColor: 'rgba(16,185,129,0.2)'
                    }}
                  >
                    <div className="p-4 border-b" style={{ borderColor: 'rgba(16,185,129,0.15)' }}>
                      <p className="text-sm font-semibold text-white mb-0.5 truncate">{user?.name || 'Guest User'}</p>
                      <p className="text-xs text-white/50 truncate">{user?.email || 'No email'}</p>
                    </div>

                    <motion.button
                      whileHover={{ x: 4, backgroundColor: "rgba(16, 185, 129, 0.15)" }}
                      onClick={() => { handleNavigate("profile"); setProfileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-6 py-3 text-white/80 transition-all ${
                        currentPage === "profile" ? "text-emerald-300" : ""
                      }`}
                    >
                      <span>My Profile</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ x: 4, backgroundColor: "rgba(16, 185, 129, 0.15)" }}
                      onClick={() => {
                        if (onNavigate) { onNavigate("profile?open=settings"); }
                        else { navigate("/dashboard/profile?open=settings"); }
                        setProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-6 py-3 text-white/80 transition-all"
                    >
                      <span>Settings</span>
                    </motion.button>

                    <div className="border-t" style={{ borderColor: 'rgba(16,185,129,0.15)' }}>
                      <motion.button
                        whileHover={{ x: 4, backgroundColor: "rgba(239, 68, 68, 0.15)" }}
                        onClick={() => { handleLogout(); setProfileMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-6 py-3 text-rose-400 transition-all"
                      >
                        <span>Sign Out</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-2xl flex items-center justify-center text-white"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-[76px] left-0 right-0 z-40 lg:hidden backdrop-blur-xl border-b shadow-xl max-h-[calc(100vh-76px)] overflow-y-auto"
          style={{
            background: 'linear-gradient(135deg, rgba(10,61,40,0.97) 0%, rgba(6,45,30,0.97) 100%)',
            borderColor: 'rgba(16,185,129,0.2)'
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-2">
            {/* Mobile Search */}
            <div className="relative mb-4" ref={mobileSearchRef}>
              <div className="relative flex items-center border rounded-2xl py-2 px-4 w-full"
                style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)' }}
              >
                <Search className="w-4 h-4 text-white/60 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder={placeholderText || "Search..."}
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setIsSearchOpen(true); }}
                  onFocus={() => setIsSearchOpen(true)}
                  className="w-full bg-transparent border-none outline-none text-white placeholder-white/40 text-sm font-semibold"
                />
                {searchQuery && (
                  <button type="button" aria-label="Clear search" onClick={() => setSearchQuery("")} className="text-white/40 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {isSearchOpen && normalizedQuery !== "" && (
                <div className="mt-1 w-full border rounded-2xl shadow-xl p-2 max-h-[250px] overflow-y-auto z-50"
                  style={{
                    background: 'rgba(6,45,30,0.98)',
                    borderColor: 'rgba(16,185,129,0.2)'
                  }}
                >
                  {filteredRoutes.length === 0 ? (
                    <div className="text-center py-4 text-xs text-white/50">No results found</div>
                  ) : (
                    <div className="space-y-3 p-1">
                      {routeCategories.map((cat) => (
                        <div key={cat}>
                          <div className="px-3 py-1 text-[10px] uppercase font-black text-emerald-400/60 tracking-wider">{cat}</div>
                          <div className="space-y-0.5 mt-1">
                            {filteredRoutes.filter((r) => r.category === cat).map((r) => (
                              <button
                                key={r.path}
                                onClick={() => { navigate(r.path); setIsSearchOpen(false); setSearchQuery(""); setMobileMenuOpen(false); }}
                                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-white/80 hover:bg-emerald-500/20 hover:text-white transition-colors"
                              >
                                <div className="truncate">{r.name}</div>
                                {r.desc && <div className="text-[10px] text-white/40 truncate mt-0.5">{r.desc}</div>}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Section */}
            <div className="mb-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3 mb-3">
                <InitialsAvatar name={user?.name || "Guest"} size="lg" className="shadow-md" />
                <div>
                  <p className="text-white">{user?.name || 'Guest User'}</p>
                  <p className="text-sm text-white/50">View Profile</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { handleNavigate("profile"); setMobileMenuOpen(false); }}
                className="w-full py-2 rounded-xl text-white text-sm"
                style={{ background: 'rgba(16,185,129,0.2)' }}
              >
                Go to Profile
              </motion.button>
            </div>

            {/* Home */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { handleNavigate("home"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                currentPage === "home"
                  ? "bg-emerald-500/30 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>Home</span>
            </motion.button>

            {/* Features */}
            <div className="space-y-2">
              <div className="px-6 py-3 text-lg rounded-2xl text-white/50">Features</div>
              {featureItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { handleNavigate(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                    currentPage === item.id
                      ? "bg-emerald-500/30 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Marketplace */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { handleNavigate("marketplace"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                currentPage === "marketplace"
                  ? "bg-emerald-500/30 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>Marketplace</span>
            </motion.button>

            {/* Companion */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { handleNavigate("companion"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                currentPage === "companion"
                  ? "bg-emerald-500/30 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>Companion</span>
            </motion.button>

            {/* Gaming Hub */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { handleNavigate("gaming-hub"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                currentPage === "gaming-hub"
                  ? "bg-emerald-500/30 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>Gaming Hub</span>
            </motion.button>

            {/* Sign Out */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-400 hover:bg-rose-500/10 transition-all"
            >
              <span>Sign Out</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </>
  );
}