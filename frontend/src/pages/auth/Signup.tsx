import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Lock, Eye, EyeOff, Check, 
  ChevronRight, Sparkles, Chrome, Github
} from "lucide-react";
import BACKEND_CONFIG from "../../config/backend";
import CosmicBackground from "../../components/auth/CosmicBackground";
import "./Signup.css";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  
  const illustrationImages = ["/stone.png", "/nature.png"];
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % illustrationImages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0); // 0 to 100
  const [validations, setValidations] = useState({
    name: false,
    email: false,
    password: false,
    match: false,
  });

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    if (formData.password.length >= 8) strength += 25;
    if (/[A-Z]/.test(formData.password)) strength += 25;
    if (/[0-9]/.test(formData.password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 25;
    setPasswordStrength(strength);

    setValidations(prev => ({
      ...prev,
      password: formData.password.length >= 8,
      match: formData.password !== "" && formData.password === formData.confirmPassword
    }));
  }, [formData.password, formData.confirmPassword]);

  // Email validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setValidations(prev => ({
      ...prev,
      email: emailRegex.test(formData.email)
    }));
  }, [formData.email]);

  // Name validation
  useEffect(() => {
    setValidations(prev => ({
      ...prev,
      name: formData.name.trim().length >= 2
    }));
  }, [formData.name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validations.name || !validations.email || !validations.password || !validations.match) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "user",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      navigate("/login");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error creating account");
    } finally {
      setLoading(false);
    }
  };

  const strengthColors = {
    0: "#e5e7eb",
    25: "#ef4444",
    50: "#f59e0b",
    75: "#10b981",
    100: "#2E8B57",
  };

  return (
    <div className="signup-page">
      <CosmicBackground />
      {/* Left Section - Rotating Illustrations */}
      <motion.div 
        className="left-section"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="illustration-container">
          <AnimatePresence mode="wait">
            <motion.img
              key={illustrationImages[currentImgIndex]}
              src={illustrationImages[currentImgIndex]}
              alt="Wellness Illustration"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Right Section - Signup Form */}
      <motion.div 
        className="right-section"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="signup-card">
          <div className="step-indicator">Step 1 of 2</div>
          <h1 className="signup-title">Join Nirvaha</h1>
          <p className="signup-subtitle">Start your journey to mindfulness today.</p>

          {/* Social Logins at the Top */}
          <div className="social-signup top">
            <button className="social-btn google">
              <Chrome size={18} color="#4285F4" />
              Continue with Google
            </button>
            <button className="social-btn github">
              <Github size={18} color="#000000" />
              Continue with GitHub
            </button>
            <div className="divider">
              <span className="divider-text">or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="What should we call you?"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {validations.name && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="validation-tick">
                    <Check size={14} />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {validations.email && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="validation-tick">
                    <Check size={14} />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {validations.password && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="validation-tick">
                    <Check size={14} />
                  </motion.div>
                )}
              </div>
              
              {/* Password Strength Meter */}
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill" 
                    style={{ 
                      width: `${passwordStrength}%`, 
                      backgroundColor: strengthColors[passwordStrength as keyof typeof strengthColors] 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat your password"
                  className="form-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {validations.match && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="validation-tick">
                    <Check size={14} />
                  </motion.div>
                )}
              </div>
            </div>

            <motion.button
              type="submit"
              className="cta-button"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading ? "Creating..." : "Start My Journey ✨"}
            </motion.button>
          </form>

          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
