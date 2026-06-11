import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, Sparkles, CheckCircle2, Eye, EyeOff, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEnrollment } from '../hooks/useEnrollment';
import BACKEND_CONFIG from '../config/backend';

interface EnrollmentFormModalProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  onEnrolled?: () => void;
}

type Step = 'form' | 'loading' | 'success';

export const EnrollmentFormModal: React.FC<EnrollmentFormModalProps> = ({
  open,
  onClose,
  courseId,
  courseTitle,
  onEnrolled,
}) => {
  const { login } = useAuth();
  const { enroll } = useEnrollment();

  const [step, setStep] = useState<Step>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'register' | 'login'>('register');

  // Reset state on open
  useEffect(() => {
    if (open) {
      setStep('form');
      setName('');
      setEmail('');
      setPassword('');
      setError(null);
      setMode('register');
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'register' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setStep('loading');

    try {
      let token: string;
      let userData: any;

      if (mode === 'register') {
        // Register new user
        const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
        });

        const data = await res.json();
        if (!res.ok) {
          // If user exists, suggest login mode
          if (res.status === 400 && data.error?.includes('already exists')) {
            setMode('login');
            setStep('form');
            setError('This email is already registered. Please log in instead.');
            return;
          }
          throw new Error(data.error || 'Registration failed. Please try again.');
        }

        token = data.token;
        userData = data.user;
      } else {
        // Login existing user
        const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Invalid email or password.');
        }

        token = data.token;
        userData = data.user;
      }

      // Log the user in
      localStorage.setItem('token', token);
      login(userData, token);

      // Now enroll in the course
      await enroll(courseId);

      setStep('success');
      setTimeout(() => {
        onEnrolled?.();
        onClose();
      }, 2200);
    } catch (err: any) {
      setStep('form');
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(4, 20, 12, 0.75)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #ffffff 0%, #f7fffe 100%)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(15,122,85,0.12)',
            }}
          >
            {/* Top accent bar */}
            <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #0f7a55, #34d399, #0f7a55)' }} />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-emerald-50 text-[#5c7868]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {/* ── SUCCESS ── */}
                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-6 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                      className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                      style={{ background: 'linear-gradient(135deg, #0f7a55, #1a9c6d)', boxShadow: '0 0 40px rgba(15,122,85,0.4)' }}
                    >
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-2xl font-black text-[#0a1a12] mb-2">You're Enrolled! 🎉</h2>
                    <p className="text-[#5c7868] font-medium text-sm mb-1">
                      Welcome to <span className="font-bold text-[#0f7a55]">{courseTitle}</span>
                    </p>
                    <p className="text-xs text-[#9ca3af]">Redirecting you to the course…</p>
                  </motion.div>
                )}

                {/* ── LOADING ── */}
                {step === 'loading' && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-[#0f7a55] mb-4"
                    />
                    <p className="font-bold text-[#0a1a12]">Setting things up…</p>
                    <p className="text-sm text-[#9ca3af] mt-1">Creating your account and enrolling</p>
                  </motion.div>
                )}

                {/* ── FORM ── */}
                {step === 'form' && (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #0f7a55, #1a9c6d)' }}>
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-[#0a1a12] leading-tight">
                          {mode === 'register' ? 'Enroll in Course' : 'Login to Enroll'}
                        </h2>
                        <p className="text-xs text-[#5c7868] font-medium mt-0.5 truncate max-w-[240px]" title={courseTitle}>
                          {courseTitle}
                        </p>
                      </div>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
                          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626' }}
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name (register only) */}
                      {mode === 'register' && (
                        <div>
                          <label className="block text-xs font-bold text-[#2d6a4f] mb-1.5 uppercase tracking-wider">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                            <input
                              type="text"
                              value={name}
                              onChange={e => setName(e.target.value)}
                              placeholder="Your full name"
                              autoComplete="name"
                              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium text-[#0a1a12] placeholder-[#b0c4bb] outline-none transition-all"
                              style={{
                                background: '#f7fffe',
                                border: '1.5px solid #d1f0e0',
                              }}
                              onFocus={e => (e.target.style.borderColor = '#0f7a55')}
                              onBlur={e => (e.target.style.borderColor = '#d1f0e0')}
                            />
                          </div>
                        </div>
                      )}

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold text-[#2d6a4f] mb-1.5 uppercase tracking-wider">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                          <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            autoComplete="email"
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium text-[#0a1a12] placeholder-[#b0c4bb] outline-none transition-all"
                            style={{ background: '#f7fffe', border: '1.5px solid #d1f0e0' }}
                            onFocus={e => (e.target.style.borderColor = '#0f7a55')}
                            onBlur={e => (e.target.style.borderColor = '#d1f0e0')}
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-xs font-bold text-[#2d6a4f] mb-1.5 uppercase tracking-wider">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder={mode === 'register' ? 'Min. 6 characters' : 'Your password'}
                            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                            className="w-full pl-10 pr-11 py-3 rounded-xl text-sm font-medium text-[#0a1a12] placeholder-[#b0c4bb] outline-none transition-all"
                            style={{ background: '#f7fffe', border: '1.5px solid #d1f0e0' }}
                            onFocus={e => (e.target.style.borderColor = '#0f7a55')}
                            onBlur={e => (e.target.style.borderColor = '#d1f0e0')}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(v => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#0f7a55] transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Submit button */}
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-black text-sm tracking-wider text-white mt-2"
                        style={{
                          background: 'linear-gradient(135deg, #0f7a55 0%, #1a9c6d 100%)',
                          boxShadow: '0 6px 20px rgba(15,122,85,0.35)',
                          letterSpacing: '0.06em',
                        }}
                      >
                        <Sparkles className="w-4 h-4" />
                        {mode === 'register' ? 'Create Account & Enroll' : 'Login & Enroll'}
                      </motion.button>
                    </form>

                    {/* Toggle register/login */}
                    <div className="mt-5 text-center">
                      <span className="text-xs text-[#9ca3af]">
                        {mode === 'register' ? 'Already have an account? ' : "Don't have an account? "}
                      </span>
                      <button
                        type="button"
                        onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError(null); }}
                        className="text-xs font-bold text-[#0f7a55] hover:text-[#0b5e41] transition-colors underline underline-offset-2"
                      >
                        {mode === 'register' ? 'Login instead' : 'Register instead'}
                      </button>
                    </div>

                    {/* Privacy note */}
                    <p className="mt-4 text-center text-[10px] text-[#b0c4bb] leading-relaxed">
                      By enrolling, you agree to Nirvaha's learning terms. Your data is secure and never shared.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
