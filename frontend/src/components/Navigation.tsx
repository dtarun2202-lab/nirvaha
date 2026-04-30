import { motion } from "motion/react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Navigation({ currentPage, onNavigate }: { currentPage: string; onNavigate?: (page: string) => void }) {
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresMenuOpen, setFeaturesMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Visibility logic
  const [isVisible, setIsVisible] = useState(true);
  const [isHoveredAtTop, setIsHoveredAtTop] = useState(false);
  const [isForceHidden, setIsForceHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Listen for custom toggle events from other pages
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
      
      // Hide navbar completely after hero section (adjust threshold as needed)
      if (currentScrollY > 600) { // Hero section height threshold
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Only reveal if mouse is over the top bar area AND we're in hero section
      if (e.clientY <= 80 && window.scrollY <= 600) {
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

  // Broadcast menu state for other components (like ChatbotPage)
  useEffect(() => {
    const isAnyMenuOpen = featuresMenuOpen || profileMenuOpen;
    window.dispatchEvent(new CustomEvent('nirvaha-menu-open', { detail: { isOpen: isAnyMenuOpen } }));
  }, [featuresMenuOpen, profileMenuOpen]);

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      // Use React Router navigation
      switch (page) {
        case 'home':
          navigate('/dashboard/overview');
          break;
        case 'overview':
          navigate('/dashboard/overview');
          break;
        case 'meditation':
          navigate('/dashboard/meditation');
          break;
        case 'sound':
          navigate('/dashboard/sound');
          break;
        case 'chatbot':
          navigate('/dashboard/chatbot');
          break;
        case 'community':
          navigate('/dashboard/community');
          break;
        case 'marketplace':
          navigate('/dashboard/marketplace');
          break;
        case 'companion':
          navigate('/dashboard/companion');
          break;
        case 'profile':
          navigate('/dashboard/profile');
          break;
        default:
          navigate(`/dashboard/${page}`);
      }
    }
    setMobileMenuOpen(false);
    setFeaturesMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const featureItems = [
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
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 border-b shadow-sm transition-all duration-300"
        style={{
          backgroundColor: 'white',
          borderColor: 'rgba(229, 231, 235, 0.5)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => handleNavigate("home")}
            >
              <img
                src="/logo.png"
                alt="Nirvaha Logo"
                className="w-14 h-14 rounded-lg object-contain drop-shadow-lg"
              />
              <div>
                <h3 className="bg-gradient-to-r from-green-700 to-green-800 bg-clip-text text-transparent font-semibold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  NIRVAHA
                </h3>
                <p className="text-xs text-green-600" style={{ fontFamily: "'Poppins', sans-serif" }}>Harmony of Mind</p>
              </div>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Home */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigate("home")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl transition-all ${currentPage === "home"
                  ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                  : "text-green-700 hover:bg-green-50"
                  }`}
              >

                <span className="text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Home</span>
              </motion.button>

              {/* Features Dropdown */}
              <div className="relative">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFeaturesMenuOpen(!featuresMenuOpen)}
                  onMouseEnter={() => setFeaturesMenuOpen(true)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl transition-all ${["meditation", "sound", "chatbot", "community"].includes(currentPage)
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                    : "text-green-700 hover:bg-green-50"
                    }`}
                >

                  <span className="text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Features</span>
                  <ChevronDown className="w-4 h-4" />
                </motion.button>

                {featuresMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseLeave={() => setFeaturesMenuOpen(false)}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
                  >
                    {featureItems.map((item, index) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 4, backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                        onClick={() => {
                          handleNavigate(item.id);
                          setFeaturesMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-6 py-3 transition-all ${currentPage === item.id
                          ? "bg-green-50 text-green-700"
                          : "text-green-700"
                          }`}
                      >

                        <span style={{ fontFamily: "'Poppins', sans-serif" }}>{item.label}</span>
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl transition-all ${currentPage === "marketplace"
                  ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                  : "text-green-700 hover:bg-green-50"
                  }`}
              >

                <span className="text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Marketplace</span>
              </motion.button>

              {/* Companion */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigate("companion")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl transition-all ${currentPage === "companion"
                  ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                  : "text-green-700 hover:bg-green-50"
                  }`}
              >

                <span className="text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Companion</span>
              </motion.button>
            </div>

            {/* Profile Dropdown (Desktop) */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  onMouseEnter={() => setProfileMenuOpen(true)}
                  className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 rounded-2xl hover:shadow-lg transition-all"
                >
                  <div className="w-7 h-7 rounded-xl bg-gray-400 flex items-center justify-center text-white shadow-md">
                    <span className="text-sm">{user?.name?.charAt(0).toUpperCase() || '🧘'}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>{user?.name || 'Guest'}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </motion.button>

                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseLeave={() => setProfileMenuOpen(false)}
                    className="absolute top-full right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-200">
                      <p className="text-gray-800 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{user?.name || 'Guest User'}</p>
                      <p className="text-sm text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>{user?.email || 'No email'}</p>
                    </div>

                    <motion.button
                      whileHover={{ x: 4, backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                      onClick={() => {
                        handleNavigate("profile");
                        setProfileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-6 py-3 text-gray-700 transition-all ${currentPage === "profile" ? "bg-gray-50 text-gray-700" : ""
                        }`}
                    >

                      <span style={{ fontFamily: "'Poppins', sans-serif" }}>My Profile</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ x: 4, backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                      className="w-full flex items-center gap-3 px-6 py-3 text-gray-700 transition-all"
                    >

                      <span style={{ fontFamily: "'Poppins', sans-serif" }}>Settings</span>
                    </motion.button>

                    <div className="border-t border-gray-200">
                      <motion.button
                        whileHover={{ x: 4, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                        onClick={() => {
                          handleLogout();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-6 py-3 text-rose-600 transition-all"
                      >

                        <span style={{ fontFamily: "'Poppins', sans-serif" }}>Sign Out</span>
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
              className="lg:hidden w-8 h-8 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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
          className="fixed top-[76px] left-0 right-0 z-40 lg:hidden bg-white border-b border-gray-200 shadow-xl max-h-[calc(100vh-76px)] overflow-y-auto"
        >
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-2">
            {/* Profile Section */}
            <div className="mb-4 p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gray-400 flex items-center justify-center text-white shadow-md">
                  <span className="text-2xl">{user?.name?.charAt(0).toUpperCase() || '🧘'}</span>
                </div>
                <div>
                  <p className="text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>{user?.name || 'Guest User'}</p>
                  <p className="text-sm text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>View Profile</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  handleNavigate("profile");
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-white rounded-xl text-gray-800 text-sm"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Go to Profile
              </motion.button>
            </div>

            {/* Home */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                handleNavigate("home");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${currentPage === "home"
                ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                : "text-green-700 hover:bg-green-50"
                }`}
            >

              <span style={{ fontFamily: "'Poppins', sans-serif" }}>Home</span>
            </motion.button>

            {/* Features */}
            <div className="space-y-2">
              <div className="px-4 py-2 text-sm text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>Features</div>
              {featureItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${currentPage === item.id
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                    : "text-green-700 hover:bg-green-50"
                    }`}
                >

                  <span style={{ fontFamily: "'Poppins', sans-serif" }}>{item.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Marketplace */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                handleNavigate("marketplace");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${currentPage === "marketplace"
                ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                : "text-green-700 hover:bg-green-50"
                }`}
            >

              <span style={{ fontFamily: "'Poppins', sans-serif" }}>Marketplace</span>
            </motion.button>

            {/* Companion */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                handleNavigate("companion");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${currentPage === "companion"
                ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                : "text-green-700 hover:bg-green-50"
                }`}
            >

              <span style={{ fontFamily: "'Poppins', sans-serif" }}>Companion</span>
            </motion.button>

            {/* Sign Out */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-600 hover:bg-rose-50 transition-all"
            >

              <span style={{ fontFamily: "'Poppins', sans-serif" }}>Sign Out</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </>
  );
}