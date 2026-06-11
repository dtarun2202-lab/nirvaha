import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Lock, Eye, EyeOff, Check, 
  Sparkles, Chrome, ShieldCheck, Zap, Globe
} from "lucide-react";
import BACKEND_CONFIG from "../../config/backend";
import "./Signup.css";
import { useAuth } from "../../contexts/AuthContext";

const CultureCollageContent = () => (
  <div className="flex flex-col gap-10 pb-12 pt-32 px-12">
    <div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-sm shadow-sm shadow-emerald-950/20">
        <Sparkles size={13} className="animate-pulse" />
        <span>Cultural Heritage</span>
      </div>

      <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-white leading-[1.15] mb-5 font-serif">
        Embrace Ancient <br />
        <span className="relative inline-block mt-1">
          <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 drop-shadow-[0_0_25px_rgba(52,211,153,0.25)]">
            Wisdom
          </span>
        </span>
      </h1>

      <p className="text-zinc-300 text-[1.05rem] leading-relaxed opacity-90 font-light">
        Nirvaha brings the profound depths of Indian cultural heritage into your modern life. Our philosophy is rooted in thousands of years of Vedic traditions, designed to restore your inner balance.
      </p>
    </div>
    
    {/* Collage Grid 1 */}
    <div className="grid grid-cols-2 gap-4">
      <img src="/temple of balance.png" alt="Temple" className="rounded-2xl object-cover h-48 w-full shadow-lg border border-white/10" />
      <img src="/spiritual_bg.png" alt="Spiritual" className="rounded-2xl object-cover h-48 w-full shadow-lg border border-white/10 translate-y-6" />
    </div>
    
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm mt-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      <h3 className="font-bold text-lg mb-2 text-emerald-100 flex items-center gap-2">
        <ShieldCheck size={18} className="text-emerald-400" /> Yoga & Meditation
      </h3>
      <p className="text-sm text-zinc-300 font-light leading-relaxed">
        Experience inner tranquility through authentic practices designed to balance your chakras and align your spirit.
      </p>
    </div>
    
    {/* Collage Grid 2 */}
    <div className="grid grid-cols-2 gap-4 mt-4">
      <img src="/yoga-meditation.jpg" alt="Meditation" className="rounded-2xl object-cover h-56 w-full shadow-lg border border-white/10 -translate-y-4" />
      <img src="/retreats-hero.png" alt="Retreats" className="rounded-2xl object-cover h-40 w-full shadow-lg border border-white/10" />
    </div>

    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      <h3 className="font-bold text-lg mb-2 text-emerald-100 flex items-center gap-2">
        <Globe size={18} className="text-emerald-400" /> Global Community
      </h3>
      <p className="text-sm text-zinc-300 font-light leading-relaxed">
        Connect with seekers and practitioners worldwide, fostering a collective consciousness rooted in mindfulness and spiritual growth.
      </p>
    </div>
    
    {/* Single Image */}
    <img src="/spiritual.png" alt="Spiritual Growth" className="rounded-2xl object-cover h-64 w-full mt-2 shadow-lg border border-white/10" />
    
    <p className="text-sm text-emerald-300/80 font-light italic text-center py-6">
      "The journey of a thousand miles begins with a single step."
    </p>
    
    {/* Footer Brand copyright */}
    <div className="text-xs text-zinc-500 font-light tracking-wide text-center">
      © 2026 Nirvaha Inc. All rights reserved.
    </div>
  </div>
);

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signupWithEmail } = useAuth();
  
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
      await signupWithEmail(formData.name, formData.email, formData.password);
      alert("Registration Successful ✅ Welcome to Nirvaha!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error creating account");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants for staggered load-in
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] }
    }
  };

  return (
    <div className="signup-container lg:grid lg:grid-cols-12 min-h-screen lg:h-screen bg-[#FAF9F6] font-sans selection:bg-emerald-100 selection:text-emerald-900 lg:overflow-hidden">
      
      {/* Left Section: Scroll Info & Culture Collage */}
      <div className="signup-visual-side lg:col-span-5 relative hidden lg:flex flex-col bg-gradient-to-br from-[#062118] via-[#0d2f23] to-[#030f0b] text-white overflow-hidden shadow-2xl h-screen">
        
        {/* Animated Ambient Light/Glow Circles */}
        <motion.div 
          animate={{ x: [0, 20, -15, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" 
        />
        <motion.div 
          animate={{ x: [0, -30, 25, 0], y: [0, 40, -15, 0], scale: [1, 0.9, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 w-[450px] h-[450px] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" 
        />

        {/* Ambient Subtle Particle Effect Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

        {/* Endless Scrollable Content Container */}
        <div className="relative z-10 w-full h-full overflow-hidden">
            {/* Fixed Brand Header */}
            <div className="absolute top-12 left-12 z-50 flex items-center gap-3.5 bg-black/10 p-2 pr-5 rounded-2xl backdrop-blur-sm border border-white/5">
              <div className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shadow-lg shadow-black/10">
                <img src="/logo.png" alt="Nirvaha" className="w-7 h-7 object-contain" />
              </div>
              <span className="font-serif tracking-widest text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-100 to-zinc-300 drop-shadow-md">
                NIRVAHA
              </span>
            </div>
            
            {/* Infinite Scrolling Wrapper */}
            <motion.div 
              animate={{ y: ["0%", "-50%"] }}
              transition={{ duration: 45, ease: "linear", repeat: Infinity }}
              className="flex flex-col w-full h-fit"
            >
              <CultureCollageContent />
              <CultureCollageContent />
            </motion.div>
        </div>
      </div>

      {/* Right Section: Form */}
      <div className="signup-form-side lg:col-span-7 flex items-start justify-center p-6 md:p-12 lg:p-16 overflow-y-auto h-full lg:h-screen custom-scrollbar">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[500px] bg-white border border-zinc-100/90 shadow-[0_20px_50px_rgba(0,0,0,0.03)] rounded-3xl p-8 md:p-11 hover:shadow-[0_30px_70px_rgba(0,0,0,0.05)] transition-shadow duration-500 my-auto"
        >
          {/* Brand header for mobile layout */}
          <div className="flex lg:hidden items-center justify-center gap-2.5 mb-8">
            <img src="/logo.png" alt="Nirvaha" className="w-8 h-8 object-contain" />
            <span className="font-serif tracking-widest text-lg font-bold text-zinc-800">
              NIRVAHA
            </span>
          </div>

          <div className="form-header text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight mb-2.5 font-serif">
              Create an Account
            </h2>
            <p className="text-zinc-500 text-sm font-light">
              Already have a Nirvaha account?{" "}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold underline underline-offset-4 decoration-emerald-600/30 hover:decoration-emerald-700/80 transition-all">
                Sign In
              </Link>
            </p>
          </div>

          {/* Actual Signup Form */}
          <form onSubmit={handleSubmit} className="actual-form flex flex-col gap-4">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-4"
            >
              
              {/* Full Name input */}
              <motion.div variants={itemVariants} className="input-field-group flex flex-col">
                <label className="text-[0.68rem] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 ml-0.5">
                  Full Name
                </label>
                <div className="relative flex items-center group">
                  <User size={18} className="absolute left-3.5 text-zinc-400 group-focus-within:text-emerald-600 transition-colors" />
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50/50 border border-zinc-200/80 rounded-xl text-zinc-800 placeholder-zinc-400 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all duration-200"
                    required
                  />
                  {formData.name.trim().length >= 2 && (
                    <Check size={16} className="absolute right-3.5 text-emerald-500 animate-fade-in" />
                  )}
                </div>
              </motion.div>

              {/* Email input */}
              <motion.div variants={itemVariants} className="input-field-group flex flex-col">
                <label className="text-[0.68rem] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 ml-0.5">
                  Email Address
                </label>
                <div className="relative flex items-center group">
                  <Mail size={18} className="absolute left-3.5 text-zinc-400 group-focus-within:text-emerald-600 transition-colors" />
                  <input 
                    type="email" 
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50/50 border border-zinc-200/80 rounded-xl text-zinc-800 placeholder-zinc-400 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all duration-200"
                    required
                  />
                  {validations.email && (
                    <Check size={16} className="absolute right-3.5 text-emerald-500 animate-fade-in" />
                  )}
                </div>
              </motion.div>

              {/* Password input */}
              <motion.div variants={itemVariants} className="input-field-group flex flex-col">
                <label className="text-[0.68rem] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 ml-0.5">
                  Password
                </label>
                <div className="relative flex items-center group">
                  <Lock size={18} className="absolute left-3.5 text-zinc-400 group-focus-within:text-emerald-600 transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-11 py-3 bg-zinc-50/50 border border-zinc-200/80 rounded-xl text-zinc-800 placeholder-zinc-400 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all duration-200"
                    required
                  />
                  <button 
                    type="button" 
                    className="absolute right-3.5 text-zinc-400 hover:text-zinc-600 transition-colors active:scale-95"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* Advanced Strength Indicator */}
                <div className="strength-indicator flex flex-col mt-2 gap-1 px-0.5">
                  <div className="flex justify-between items-center text-[0.68rem] text-zinc-400">
                    <span>Password Strength</span>
                    <span className="font-semibold text-zinc-500">
                      {passwordStrength === 0 && "Empty"}
                      {passwordStrength === 25 && "Weak ⚠️"}
                      {passwordStrength === 50 && "Fair 😐"}
                      {passwordStrength === 75 && "Good 👍"}
                      {passwordStrength === 100 && "Strong 💪"}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full mt-1">
                    <div className="h-full rounded-full transition-all duration-300" style={{ background: passwordStrength >= 25 ? '#ef4444' : '#f1f5f9' }}></div>
                    <div className="h-full rounded-full transition-all duration-300" style={{ background: passwordStrength >= 50 ? '#f59e0b' : '#f1f5f9' }}></div>
                    <div className="h-full rounded-full transition-all duration-300" style={{ background: passwordStrength >= 75 ? '#10b981' : '#f1f5f9' }}></div>
                    <div className="h-full rounded-full transition-all duration-300" style={{ background: passwordStrength >= 100 ? '#10b981' : '#f1f5f9' }}></div>
                  </div>
                </div>
              </motion.div>

              {/* Confirm Password input */}
              <motion.div variants={itemVariants} className="input-field-group flex flex-col">
                <label className="text-[0.68rem] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 ml-0.5">
                  Confirm Password
                </label>
                <div className="relative flex items-center group">
                  <Lock size={18} className="absolute left-3.5 text-zinc-400 group-focus-within:text-emerald-600 transition-colors" />
                  <input 
                    type="password" 
                    name="confirmPassword"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50/50 border border-zinc-200/80 rounded-xl text-zinc-800 placeholder-zinc-400 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all duration-200"
                    required
                  />
                  {validations.match && formData.confirmPassword !== "" && (
                    <Check size={16} className="absolute right-3.5 text-emerald-500 animate-fade-in" />
                  )}
                </div>
              </motion.div>

              {/* Terms checkbox */}
              <motion.div variants={itemVariants} className="form-terms flex items-start gap-3 mt-1.5 ml-0.5">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="w-[17px] h-[17px] mt-0.5 accent-emerald-600 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  required 
                />
                <label htmlFor="terms" className="text-zinc-500 text-xs md:text-sm font-light leading-relaxed cursor-pointer select-none">
                  I agree to the{" "}
                  <Link to="/terms" className="text-emerald-600 hover:text-emerald-700 font-semibold underline underline-offset-4 decoration-emerald-600/30 hover:decoration-emerald-700/80 transition-all">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-emerald-600 hover:text-emerald-700 font-semibold underline underline-offset-4 decoration-emerald-600/30 hover:decoration-emerald-700/80 transition-all">
                    Privacy Policy
                  </Link>.
                </label>
              </motion.div>

              {/* Submit CTA Button */}
              <motion.div variants={itemVariants} className="mt-3.5">
                <button 
                  type="submit" 
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold text-sm rounded-xl shadow-[0_4px_25px_rgba(16,185,129,0.2)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.35)] transition-all duration-300 active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create My Free Account"}
                </button>
              </motion.div>

            </motion.div>
          </form>

          {/* Footer note */}
          <div className="form-footer mt-8 pt-6 border-t border-zinc-100 text-center">
            <p className="text-[0.68rem] text-zinc-400 font-light leading-relaxed">
              By signing up, you agree to receive emotional wellness insights and updates from Nirvaha. You can unsubscribe at any time.
            </p>
          </div>

        </motion.div>
      </div>

    </div>
  );
};

export default Signup;
