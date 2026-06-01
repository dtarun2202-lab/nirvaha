// Login.tsx
import React, { useState } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import BACKEND_CONFIG from "../../config/backend";
import { motion } from "motion/react";
import {
  Mail,
  Lock,
  Sparkles,
  Github,
} from "lucide-react";

interface UserData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const defaultValues: UserData = {
    email: "",
    password: "",
  };

  const [userData, setUserData] = useState<UserData>(defaultValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginWithEmail, loginWithGoogle, loginWithGithub } = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      await loginWithEmail(userData.email, userData.password);

      const storedUserRaw = localStorage.getItem("user");
      const user = storedUserRaw ? JSON.parse(storedUserRaw) : null;

      // After successful login, redirect based on user role
      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        const redirectUrl = sessionStorage.getItem("redirectUrl");
        if (redirectUrl) {
          sessionStorage.removeItem("redirectUrl");
          navigate(redirectUrl);
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error logging in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await loginWithGoogle();

      const storedUserRaw = localStorage.getItem("user");
      const user = storedUserRaw ? JSON.parse(storedUserRaw) : null;

      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        const redirectUrl = sessionStorage.getItem("redirectUrl");
        if (redirectUrl) {
          sessionStorage.removeItem("redirectUrl");
          navigate(redirectUrl);
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await loginWithGithub();

      const storedUserRaw = localStorage.getItem("user");
      const user = storedUserRaw ? JSON.parse(storedUserRaw) : null;

      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        const redirectUrl = sessionStorage.getItem("redirectUrl");
        if (redirectUrl) {
          sessionStorage.removeItem("redirectUrl");
          navigate(redirectUrl);
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "GitHub login failed");
    } finally {
      setLoading(false);
    }
  };

  // Login page images from public/login page images/ directory - encode spaces so browser can load
  const loginFolder = '/login page images/';
  const loginFiles = ['lo1.webp',
    'lo2.webp',
    'lo3.webp',
    'lo4.webp',
    'lo5.webp',
    'lo6.webp',
    'lo7.webp',
    'lo8.webp',
    'lo9.webp',
    'lo10.webp',
    'lo11.webp',
    'lo12.webp',
    'lo13.webp',
    'lo14.webp',
    'lo15.webp',
    'lo16.webp',
    'lo17.webp',
    'lo18.webp',
    'lo19.webp',
    'lo20.webp',
    'lo21.webp',
    'lo22.webp',
    'lo23.webp',
    'lo24.webp',
    'lo25.webp',
    'lo26.webp',
    'lo27.webp',
    'lo28.webp',
    'lo29.webp',
    'lo30.webp',
    'lo31.webp',
    'lo32.webp',
    'lo33.webp',
    'lo34.webp',
    'lo35.webp',
    'lo36.webp',
    'lo37.webp',
    'lo38.webp',
  ];

  const loginImages = loginFiles.map((f) => encodeURI(loginFolder + f));


  return (
    <div className="login-container">
      {/* Logo */}
      <div className="logo-container">
        <a href="/" className="inline-block">
          <img
            src="/logo.png"
            alt="Nirvaha Logo"
            className="h-16 w-16 object-contain rounded-xl cursor-pointer drop-shadow-lg transition-all duration-300 hover:scale-110"
          />
        </a>
      </div>

      {/* Masonry Background Grid */}
      <div className="login-grid">
        {(() => {
          const tiles = [];
          const usedPositions = new Set();
          
          // Helper to check if a space is occupied
          const isOccupied = (col, row, w, h) => {
            for (let r = row; r < row + h; r++) {
              for (let c = col; c < col + w; c++) {
                if (usedPositions.has(`${c},${r}`)) return true;
              }
            }
            return false;
          };

          // Helper to mark space as occupied
          const occupy = (col, row, w, h) => {
            for (let r = row; r < row + h; r++) {
              for (let c = col; c < col + w; c++) {
                usedPositions.add(`${c},${r}`);
              }
            }
          };

          // Grid dimensions (approximate)
          const totalCols = 20;
          const totalRows = 30;
          
          // Define the center "Dead Zone" (where the login card sits)
          const isDeadZone = (c, r) => {
            return c >= 7 && c <= 13 && r >= 6 && r <= 18;
          };

          const tileSizes = [
            { w: 2, h: 2 }, // Small
            { w: 3, h: 3 }, // Medium
            { w: 4, h: 2 }, // Wide
            { w: 2, h: 4 }, // Tall
            { w: 4, h: 4 }, // Large
          ];

          let imgCounter = 0;

          for (let r = 0; r < totalRows; r++) {
            for (let c = 0; c < totalCols; c++) {
              if (usedPositions.has(`${c},${r}`)) continue;
              if (isDeadZone(c, r)) continue;

              let size = tileSizes[Math.floor(Math.random() * tileSizes.length)];
              if (c + size.w > totalCols) size = { w: totalCols - c, h: size.h };
              if (r + size.h > totalRows) size = { w: size.w, h: totalRows - r };
              
              if (isOccupied(c, r, size.w, size.h) || isDeadZone(c + Math.floor(size.w/2), r + Math.floor(size.h/2))) {
                if (!isOccupied(c, r, 1, 1)) {
                   size = { w: 1, h: 1 };
                } else {
                  continue;
                }
              }

              occupy(c, r, size.w, size.h);
              const imgIndex = imgCounter % loginImages.length;
              imgCounter++;

              tiles.push(
                <div
                  key={`${c}-${r}`}
                  className="login-tile"
                  style={{
                    gridColumn: `span ${size.w}`,
                    gridRow: `span ${size.h}`,
                  }}
                >
                  <img
                    src={loginImages[imgIndex]}
                    alt={`Background ${imgIndex}`}
                    loading="lazy"
                  />
                </div>
              );
            }
          }

          return tiles;
        })()}
      </div>

      {/* Deep Warm Overlay */}
      <div className="login-overlay" />

      {/* Login Card */}
      <motion.div
        className="login-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="text-center mb-8">
          <motion.img
            src="/logo.png"
            alt="Nirvaha Logo"
            className="h-20 w-20 mx-auto mb-4 object-contain drop-shadow-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
          <h1 className="text-4xl font-bold mb-3 login-title">
            Nirvaha
          </h1>
          <p className="text-sm login-subtitle">
            Begin your journey to timeless wellness
          </p>
        </div>

        {/* Social Logins */}
        <div className="social-auth-grid grid grid-cols-2 gap-3.5 mb-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2.5 px-4 py-3 border border-emerald-200/50 rounded-xl bg-white/80 hover:bg-white text-emerald-800 font-semibold text-xs md:text-sm transition-all duration-200 shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={handleGithubLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2.5 px-4 py-3 border border-emerald-200/50 rounded-xl bg-white/80 hover:bg-white text-emerald-800 font-semibold text-xs md:text-sm transition-all duration-200 shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            <Github size={17} className="text-emerald-800" />
            <span>GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="form-divider flex items-center text-center mb-6">
          <div className="flex-grow border-t border-emerald-200/30"></div>
          <span className="px-4 text-[0.68rem] text-emerald-800/60 font-bold uppercase tracking-[0.15em]">
            or login with email
          </span>
          <div className="flex-grow border-t border-emerald-200/30"></div>
        </div>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="space-y-1">
            <label className="text-xs font-semibold ml-1 text-emerald-800 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600/60" />
              <input
                type="email"
                placeholder="you@example.com"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 rounded-xl ancient-input focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold ml-1 text-emerald-800 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600/60" />
              <input
                type="password"
                placeholder="••••••••"
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                className="w-full pl-11 pr-4 py-3 rounded-xl ancient-input focus:outline-none"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl btn-ancient disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span className="font-semibold uppercase tracking-widest text-sm">Enter the Sanctuary</span>
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-emerald-100 text-center">
          <p className="text-xs text-emerald-800/50 mb-4">New to Nirvaha?</p>
          <button
            onClick={() => navigate("/signup")}
            className="text-sm font-bold text-emerald-600 hover:text-emerald-800 transition-colors flex items-center justify-center gap-2 mx-auto group"
          >
            Create Your Account
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </motion.div>

      {/* Bottom Footer */}
      <div className="absolute bottom-6 left-0 right-0 z-10 text-center">
        <div className="flex items-center justify-center gap-6 text-[10px] uppercase tracking-[0.2em] text-emerald-100/60 font-bold">
          <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
          <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
          <a href="#" className="hover:text-emerald-400 transition-colors">Support</a>
        </div>
      </div>
    </div>
  );

};

export default Login;
