import { motion, AnimatePresence } from "motion/react";
import { Loader2, CheckCircle2, X } from "lucide-react";
import { useState } from "react";
import BACKEND_CONFIG from "@/config/backend";
import { useAuth } from "@/contexts/AuthContext";

interface SessionRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: {
    id?: string;
    approvedId?: string;
    title: string;
    host: string;
    schedule: string;
    duration: string;
    price: string;
    image: string;
    topics: string[];
    rating?: number;
  } | null;
  onRegistered: (reg: SessionRegistration) => void;
}

export interface SessionRegistration {
  id: string;
  sessionTitle: string;
  sessionId: string;
  userName: string;
  email: string;
  phone: string;
  message: string;
  wellnessGoal: string;
  status: "pending" | "approved" | "rejected" | "completed";
  createdAt: string;
  schedule: string;
  host: string;
  image: string;
}

const WELLNESS_GOALS = [
  "Reduce stress & anxiety",
  "Improve sleep quality",
  "Build mindfulness habits",
  "Emotional healing & recovery",
  "Improve focus & clarity",
  "General wellness & relaxation",
];

export function SessionRegistrationModal({
  isOpen,
  onClose,
  session,
  onRegistered,
}: SessionRegistrationModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    message: "",
    wellnessGoal: WELLNESS_GOALS[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid";
    if (!form.phone.trim() || form.phone.length < 10) e.phone = "Invalid";
    if (!form.wellnessGoal) e.wellnessGoal = "Select one";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const registration: SessionRegistration & { type?: string } = {
        id: `reg-${Date.now()}`,
        sessionTitle: session?.title || "",
        sessionId: session?.id || session?.approvedId || `session-${session?.title}`,
        userName: form.fullName,
        email: form.email,
        phone: form.phone,
        message: form.message,
        wellnessGoal: form.wellnessGoal,
        status: "pending",
        createdAt: new Date().toISOString(),
        schedule: session?.schedule || "",
        host: session?.host || "",
        image: session?.image || "",
        type: "session",
      };
      try {
        await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/bookings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: registration.id,
            itemId: registration.sessionId,
            itemName: registration.sessionTitle,
            userName: form.fullName,
            email: form.email,
            type: "session",
            status: "pending",
            platform: "Google Meet",
            date: new Date().toISOString(),
            time: session?.duration || "TBD",
            phone: form.phone,
            message: form.message,
            wellnessGoal: form.wellnessGoal,
          }),
        });
      } catch (err) {
        console.error("Booking API fail:", err);
      }
      const storageKey = user?.email ? `nirvaha_my_sessions_${user.email}` : "nirvaha_my_sessions_guest";
      const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
      localStorage.setItem(storageKey, JSON.stringify([registration, ...existing]));
      setStep("success");
      onRegistered(registration);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("form");
    setForm({
      fullName: user?.name || "",
      email: user?.email || "",
      phone: "",
      message: "",
      wellnessGoal: WELLNESS_GOALS[0],
    });
    setErrors({});
    onClose();
  };

  if (!isOpen || !session) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{
          background: "rgba(10, 30, 20, 0.22)",
          backdropFilter: "blur(14px)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: "spring", damping: 28, stiffness: 400 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[480px] rounded-[32px] overflow-hidden bg-gradient-to-b from-[#f5faf8]/95 to-[#ebf5f1]/95 border border-[#cce6dc]/80 shadow-[0_30px_70px_-15px_rgba(0,35,20,0.22)] backdrop-blur-2xl flex flex-col max-h-[90vh]"
        >
          {step === "form" ? (
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Sticky Header */}
              <div className="sticky top-0 bg-gradient-to-b from-[#f5faf8] via-[#f5faf8]/95 to-transparent pt-9 pb-5 px-9 flex items-start justify-between z-10 border-b border-[#cce6dc]/40">
                <div>
                  <h2 className="text-[24px] font-black text-[#0a2e1f] tracking-tight leading-tight">
                    Reserve Your Spot
                  </h2>
                  <p className="text-[13px] text-[#4a7c65] mt-1 font-bold">
                    Enter details for your personalized session.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white/80 border border-[#cce6dc]/60 text-[#4a7c65] hover:bg-[#eef3f1] active:scale-95 transition-all shadow-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="flex-1 px-9 py-6 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#b5d6c9] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#9fc5b6]">
                
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Full Name" error={errors.fullName}>
                    <input
                      value={form.fullName}
                      onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                      placeholder="Name"
                      className={`w-full px-5 py-3.5 rounded-2xl outline-none transition-all text-[14px] font-bold text-[#0a2e1f] border shadow-sm ${
                        errors.fullName
                          ? "bg-rose-50 border-rose-100"
                          : "bg-white/80 border-[#d1e6dd] hover:border-[#8ec5ad] focus:border-[#3db87a] focus:bg-white"
                      }`}
                    />
                  </Field>
                  <Field label="Email Address" error={errors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="Email"
                      className={`w-full px-5 py-3.5 rounded-2xl outline-none transition-all text-[14px] font-bold text-[#0a2e1f] border shadow-sm ${
                        errors.email
                          ? "bg-rose-50 border-rose-100"
                          : "bg-white/80 border-[#d1e6dd] hover:border-[#8ec5ad] focus:border-[#3db87a] focus:bg-white"
                      }`}
                    />
                  </Field>
                </div>

                <Field label="Phone Number" error={errors.phone}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className={`w-full px-5 py-3.5 rounded-2xl outline-none transition-all text-[14px] font-bold text-[#0a2e1f] border shadow-sm ${
                      errors.phone
                        ? "bg-rose-50 border-rose-100"
                        : "bg-white/80 border-[#d1e6dd] hover:border-[#8ec5ad] focus:border-[#3db87a] focus:bg-white"
                    }`}
                  />
                </Field>

                {/* Grid goals selection */}
                <div className="space-y-3.5">
                  <p className="text-[11px] font-black text-[#0a2e1f] uppercase tracking-widest px-1">
                    Select Session Goal
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {WELLNESS_GOALS.map((g) => {
                      const active = form.wellnessGoal === g;
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, wellnessGoal: g }))}
                          className={`px-4 py-3 rounded-2xl text-[12px] font-bold text-left transition-all border outline-none group shadow-sm ${
                            active
                              ? "bg-gradient-to-r from-[#d2efe7] to-[#e4f6f1] border-[#addcd0] text-[#0a2e1f] shadow-[0_4px_12px_rgba(61,184,122,0.12)]"
                              : "bg-white/60 border-[#d1e6dd] hover:border-[#8ec5ad] text-[#2d5241] hover:bg-white/90"
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                  {errors.wellnessGoal && (
                    <p className="text-[11px] text-rose-500 font-bold uppercase px-1">{errors.wellnessGoal}</p>
                  )}
                </div>

                <Field label="Additional Note" sublabel="Optional">
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    rows={2}
                    placeholder="Share any specific requirements or health info..."
                    className="w-full px-5 py-3.5 rounded-2xl bg-white/80 border border-[#d1e6dd] hover:border-[#8ec5ad] focus:border-[#3db87a] focus:bg-white outline-none transition-all text-[14px] font-bold text-[#0a2e1f] resize-none shadow-sm"
                  />
                </Field>
              </div>

              {/* Sticky Fixed Footer */}
              <div className="sticky bottom-0 bg-gradient-to-t from-[#ebf5f1] via-[#ebf5f1]/95 to-transparent pt-4 pb-8 px-9 border-t border-[#cce6dc]/40 flex flex-col items-center shrink-0 z-10">
                <motion.button
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full h-[58px] rounded-full font-black text-[16px] transition-all flex items-center justify-center bg-[#0a2e1f] text-white shadow-[0_15px_30px_-5px_rgba(10,46,31,0.28)] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Confirm Registration"
                  )}
                </motion.button>
              </div>
            </div>
          ) : (
            // Zen Success Step
            <div className="relative flex flex-col items-center justify-center p-12 text-center bg-gradient-to-b from-[#f5faf8] to-white min-h-[420px]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-gradient-to-b from-[#e3f4ee] to-transparent rounded-full blur-[60px] -z-10" />
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 bg-gradient-to-tr from-[#d6eee9] to-[#edf7f5] rounded-3xl flex items-center justify-center mb-8 border border-[#b8d8d1] shadow-inner"
              >
                <CheckCircle2 className="w-8 h-8 text-[#2d5a42]" />
              </motion.div>

              <div className="space-y-3">
                <h3 className="text-[26px] font-black text-[#0a2e1f] tracking-tight leading-tight">
                  Spot Reserved
                </h3>
                <p className="text-[14px] text-[#5a7a6b] max-w-[280px] font-semibold leading-relaxed mx-auto">
                  Your registration for <span className="text-[#0a2e1f] font-extrabold">{session.title}</span> has been received!
                </p>
              </div>

              <div className="mt-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#edf6f2] border border-[#cce6dc] shadow-sm">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[11px] font-black text-[#0a2e1f] tracking-wider uppercase">
                  Awaiting Approval
                </span>
                <div className="w-px h-3 bg-[#cce6dc]" />
                <span className="text-[11px] text-[#4a7c65] font-bold">In My Sessions</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="mt-10 h-[56px] px-14 rounded-full font-black text-[14px] bg-[#0a2e1f] text-white shadow-[0_12px_24px_-5px_rgba(10,46,31,0.22)] transition-all"
              >
                Back to Marketplace
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Field({
  label,
  sublabel,
  error,
  children,
}: {
  label: string;
  sublabel?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 flex-1">
      <div className="flex items-baseline justify-between px-1">
        <p className="text-[10px] font-black text-[#0a2e1f] uppercase tracking-widest">{label}</p>
        {sublabel && (
          <p className="text-[9px] font-black text-[#3a614f] uppercase tracking-widest">{sublabel}</p>
        )}
      </div>
      {children}
      {error && (
        <p className="text-[10px] font-black text-rose-500 px-1 uppercase tracking-tight">
          {error}
        </p>
      )}
    </div>
  );
}
