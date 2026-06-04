import React, { useEffect, useRef, createContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  ChevronDown,
  Search,
} from "lucide-react";

import { HeaderNirvahaRectContext } from '../../contexts/HeaderContext';
import { pathwaysData } from '../../data/pathwaysData';

interface HeaderProps {
  onNirvahaClick?: () => void;
  logoSrc?: string;
  logoAlt?: string;
}

const Header: React.FC<HeaderProps> = ({ onNirvahaClick, logoSrc = '/logo.png', logoAlt = 'Nirvaha Logo' }) => {
  const [nirvahaRect, setNirvahaRect] = useState<DOMRect | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  // We'll attach this ref to the logo text container to calculate rect if needed by other components
  const nirvahaRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  const [featuresMenuOpen, setFeaturesMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search functionality state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchablePages = [
    { name: "Home / Landing", path: "/" },
    { name: "Nirvaha Academy / Pathways", path: "/pathways" },
    { name: "Stories & Testimonials", path: "/stories" },
    { name: "Breathing Exercise", path: "/breathing" },
    { name: "Chakra Experience", path: "/chakra-experience" },
    { name: "Healing Music Frequencies", path: "/healing-music" },
    { name: "Meditation Space", path: "/dashboard/meditation" },
    { name: "Sound Healing Space", path: "/dashboard/sound" },
    { name: "AI Guide Chat", path: "/dashboard/chatbot" },
    { name: "Community Forum", path: "/dashboard/community" },
    { name: "Marketplace Hub", path: "/dashboard/marketplace" },
    { name: "Companion Mentorship", path: "/dashboard/companion" },
  ];

  const filteredPages = searchQuery.trim() === "" ? [] : searchablePages.filter(page =>
    page.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPathways = searchQuery.trim() === "" ? [] : pathwaysData.filter(pathway =>
    pathway.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pathway.desc.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  useEffect(() => {
    const updateRect = () => {
      if (nirvahaRef.current) {
        const rect = nirvahaRef.current.getBoundingClientRect();
        setNirvahaRect(rect);
      }
    };
    updateRect();
    window.addEventListener('resize', updateRect);
    // Also update on scroll as position might change
    window.addEventListener('scroll', updateRect);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogoClick = () => {
    if (onNirvahaClick) {
      onNirvahaClick();
    } else {
      navigate('/');
    }
  };

  const featureItems = [
    { id: "certification", label: "Nirvaha Certification Courses", path: "/pathways" },
    { id: "meditation", label: "Meditation", path: "/dashboard/meditation" },
    { id: "sound", label: "Sound Healing", path: "/dashboard/sound" },
    { id: "chatbot", label: "AI Guide", path: "/dashboard/chatbot" },
    { id: "community", label: "Community", path: "/dashboard/community" },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setFeaturesMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <HeaderNirvahaRectContext.Provider value={nirvahaRect}>
      <header
        ref={headerRef}
        className="absolute top-0 left-0 right-0 z-50 transition-colors duration-500"
        style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
      >
        <div className="container mx-auto px-6 lg:px-12 max-w-[1800px]">
          <div className="flex items-center justify-between h-16 lg:h-24">
            {/* Logo Section (Left) */}
            <div className="flex-shrink-0">
              <button
                onClick={handleLogoClick}
                className="flex items-center gap-3 focus:outline-none transition-all duration-300 hover:scale-105"
                aria-label="Go to home page"
              >
                <img
                  src={logoSrc}
                  alt={logoAlt}
                  className="h-14 w-auto sm:h-16 sm:w-auto object-contain"
                  style={{
                    filter: 'drop-shadow(0px 4px 12px rgba(16, 185, 129, 0.22))'
                  }}
                />
                {/* Text removed as requested */}
              </button>
            </div>

            {/* Desktop Navigation (Center) */}
            <div className="hidden lg:flex flex-1 justify-center items-center gap-4">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigate('/')}
                className="flex items-center gap-2 px-4 py-2 text-black/70 hover:text-black transition-all"
              >
                <span className="text-lg font-bold uppercase tracking-wider">Home</span>
              </motion.button>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigate('/pathways')}
                className="flex items-center gap-2 px-4 py-2 text-black/70 hover:text-black transition-all"
              >
                <span className="text-lg font-bold uppercase tracking-wider">Academy</span>
              </motion.button>

              {/* Features Dropdown */}
              <div className="relative">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFeaturesMenuOpen(!featuresMenuOpen)}
                  onMouseEnter={() => setFeaturesMenuOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-black/70 hover:text-black transition-all"
                >
                  <span className="text-lg font-bold uppercase tracking-wider">Features</span>
                  <ChevronDown className="w-4 h-4" />
                </motion.button>

                <AnimatePresence>
                  {featuresMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onMouseLeave={() => setFeaturesMenuOpen(false)}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                    >
                      {featureItems.map((item, index) => (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleNavigate(item.path)}
                          className="w-full flex items-center justify-start gap-3 px-6 py-4 text-white/70 hover:text-white hover:bg-white/10 transition-all text-left"
                        >
                          <span className="text-lg font-semibold">{item.label}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigate('/dashboard/marketplace')}
                className="flex items-center gap-2 px-4 py-2 text-black/70 hover:text-black transition-all"
              >
                <span className="text-lg font-bold uppercase tracking-wider">Marketplace</span>
              </motion.button>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigate('/dashboard/companion')}
                className="flex items-center gap-2 px-4 py-2 text-black/70 hover:text-black transition-all"
              >
                <span className="text-lg font-bold uppercase tracking-wider">Companion</span>
              </motion.button>
            </div>

            {/* Right side search & auth buttons */}
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">


              {/* Existing Auth Buttons */}
              {user ? (
                <Link
                  to="/dashboard/overview"
                  className="px-8 py-2.5 rounded-full text-white font-bold text-base hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 border border-emerald-400/30 bg-emerald-600/80 backdrop-blur-sm shadow-lg"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-6 py-2.5 rounded-full text-emerald-950 font-bold text-base hover:bg-emerald-50/50 transition-all duration-300 border border-transparent hover:border-emerald-100 backdrop-blur-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="group relative px-8 py-3 rounded-full text-white font-bold text-base overflow-hidden transition-all duration-300 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 blur-sm group-hover:bg-white/40 transition-all" />
                    <span className="relative z-10 drop-shadow-md">Get Started</span>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-black/60 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">

                <button
                  onClick={() => handleNavigate('/')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl"
                >
                  <span className="font-semibold drop-shadow-sm">Home</span>
                </button>

                <button
                  onClick={() => handleNavigate('/pathways')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl"
                >
                  <span className="font-semibold drop-shadow-sm">Academy</span>
                </button>

                <div className="space-y-2">
                  <div className="px-4 text-xs font-semibold text-emerald-200/50 uppercase tracking-wider">Features</div>
                  {featureItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.path)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl pl-8"
                    >
                      <span className="font-semibold drop-shadow-sm">{item.label}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleNavigate('/dashboard/marketplace')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl"
                >
                  <span className="font-semibold drop-shadow-sm">Marketplace</span>
                </button>

                <button
                  onClick={() => handleNavigate('/dashboard/companion')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl"
                >
                  <span className="font-semibold drop-shadow-sm">Companion</span>
                </button>

                <div className="pt-4 mt-4 border-t border-white/10 flex flex-col gap-3">
                  {user ? (
                    <button
                      onClick={() => handleNavigate('/dashboard/overview')}
                      className="w-full py-3 rounded-xl text-white font-semibold bg-emerald-600/80"
                    >
                      Dashboard
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleNavigate('/login')}
                        className="w-full py-3 rounded-xl text-white font-semibold dropdown-shadow-sm hover:bg-white/10"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => handleNavigate('/signup')}
                        className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-emerald-500 to-teal-500"
                      >
                        Get Started
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </HeaderNirvahaRectContext.Provider>
  );
};

export default Header;