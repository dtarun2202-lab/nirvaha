import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Lock, Eye, EyeOff, Check, 
  ChevronRight, Sparkles, Chrome, Github, ShieldCheck, Zap, Globe
} from "lucide-react";
import BACKEND_CONFIG from "../../config/backend";
import "./Signup.css";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
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
      if (!res.ok) throw new Error(data.message || data.error || "Registration failed");

      alert("Registration Successful ✅ Please login to continue.");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error creating account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Left Section: Visual & Value Prop */}
      <div className="signup-visual-side">
        <div className="visual-content">
          <div className="brand-logo">
            <img src="/logo.png" alt="Nirvaha" className="w-12 h-12" />
            <span className="brand-name">Nirvaha</span>
          </div>
          
          <div className="value-props">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="visual-title"
            >
              Start your journey to <br/> <span>Inner Balance</span>
            </motion.h1>
            <p className="visual-desc">
              Join thousands of seekers finding peace through ancient wisdom and modern AI.
            </p>
            
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon"><ShieldCheck size={20} /></div>
                <div>
                  <h4>Secure & Private</h4>
                  <p>Your spiritual journey is personal and safe with us.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Zap size={20} /></div>
                <div>
                  <h4>AI-Powered Insights</h4>
                  <p>Real-time guidance tailored to your emotional state.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Globe size={20} /></div>
                <div>
                  <h4>Global Community</h4>
                  <p>Connect with healers and practitioners worldwide.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="visual-footer">
            <p>© 2024 Nirvaha Inc. All rights reserved.</p>
          </div>
        </div>
        {/* Abstract Background Elements */}
        <div className="abstract-glow-1"></div>
        <div className="abstract-glow-2"></div>
      </div>

      {/* Right Section: Form */}
      <div className="signup-form-side">
        <div className="form-wrapper">
          <div className="form-header">
            <h2>Create an Account</h2>
            <p>Already have a Nirvaha account? <Link to="/login" className="login-link-inline">Sign In</Link></p>
          </div>

          <div className="social-auth-grid">
            <button className="social-auth-btn">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" alt="Google" width="18" />
              <span>Google</span>
            </button>
            <button className="social-auth-btn">
              <Github size={18} />
              <span>GitHub</span>
            </button>
          </div>

          <div className="form-divider">
            <span>or sign up with email</span>
          </div>

          <form onSubmit={handleSubmit} className="actual-form">
            <div className="input-field">
              <label>Full Name</label>
              <div className="input-control">
                <User size={18} className="field-icon" />
                <input 
                  type="text" 
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-field">
              <label>Email Address</label>
              <div className="input-control">
                <Mail size={18} className="field-icon" />
                <input 
                  type="email" 
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-field">
              <label>Password</label>
              <div className="input-control">
                <Lock size={18} className="field-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button" 
                  className="pass-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="strength-indicator">
                <div className={`strength-segment ${passwordStrength >= 25 ? 'active' : ''}`} style={{ background: passwordStrength >= 25 ? '#ef4444' : '' }}></div>
                <div className={`strength-segment ${passwordStrength >= 50 ? 'active' : ''}`} style={{ background: passwordStrength >= 50 ? '#f59e0b' : '' }}></div>
                <div className={`strength-segment ${passwordStrength >= 75 ? 'active' : ''}`} style={{ background: passwordStrength >= 75 ? '#10b981' : '' }}></div>
                <div className={`strength-segment ${passwordStrength >= 100 ? 'active' : ''}`} style={{ background: passwordStrength >= 100 ? '#1a5d47' : '' }}></div>
              </div>
            </div>

            <div className="input-field">
              <label>Confirm Password</label>
              <div className="input-control">
                <Lock size={18} className="field-icon" />
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-terms">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
              </label>
            </div>

            <button type="submit" className="submit-auth-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create My Free Account"}
            </button>
          </form>

          <div className="form-footer">
            <p>By signing up, you agree to receive updates from Nirvaha. You can unsubscribe at any time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
