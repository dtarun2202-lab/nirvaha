import { motion, AnimatePresence } from "motion/react";
import { Mail, X, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { useState } from "react";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      // Reset after 3 seconds
      setTimeout(() => {
        handleReset();
      }, 3000);
    }, 1500);
  };

  const handleReset = () => {
    setEmail("");
    setIsSubmitted(false);
    setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleReset}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-md"
            >
              {/* Glowing Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-[32px] blur-2xl opacity-20"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Main Card */}
              <div className="relative bg-white/95 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl border border-emerald-200/30">
                {/* Close Button */}
                <button
                  onClick={handleReset}
                  className="absolute top-6 right-6 p-2 hover:bg-emerald-50 rounded-full transition-colors text-teal-600 hover:text-teal-800"
                >
                  <X className="w-5 h-5" />
                </button>

                {!isSubmitted ? (
                  <>
                    {/* Header */}
                    <div className="mb-8">
                      <motion.div
                        className="w-14 h-14 mb-4 rounded-[20px] bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg mx-auto"
                        animate={{
                          boxShadow: [
                            "0 0 20px rgba(34, 197, 94, 0.3)",
                            "0 0 40px rgba(34, 197, 94, 0.5)",
                            "0 0 20px rgba(34, 197, 94, 0.3)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Mail className="w-7 h-7 text-white" />
                      </motion.div>

                      <h2 className="text-center text-2xl font-bold text-emerald-800 mb-2">
                        Reset Your Password
                      </h2>
                      <p className="text-center text-teal-600 text-sm">
                        Enter your email address and we'll send you a link to reset your password
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Email Input */}
                      <div>
                        <label className="block text-sm text-teal-800 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
                          <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setError("");
                            }}
                            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-emerald-200/50 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-teal-800 placeholder:text-teal-400 transition-all"
                          />
                        </div>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 p-3 bg-red-50 border border-red-200/50 rounded-[16px]"
                        >
                          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                          <p className="text-sm text-red-600">{error}</p>
                        </motion.div>
                      )}

                      {/* Submit Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-[20px] shadow-xl hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-medium"
                      >
                        {isLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Send Reset Link
                          </>
                        )}
                      </motion.button>

                      {/* Back to Login */}
                      <button
                        type="button"
                        onClick={handleReset}
                        className="w-full py-3 text-teal-700 hover:text-teal-800 transition-colors font-medium"
                      >
                        Back to Login
                      </button>
                    </form>

                    {/* Footer Text */}
                    <p className="text-xs text-center text-teal-500 mt-6">
                      Need help?{" "}
                      <button className="text-emerald-600 hover:text-emerald-700 underline">
                        Contact Support
                      </button>
                    </p>
                  </>
                ) : (
                  <>
                    {/* Success State */}
                    <div className="text-center py-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 10,
                        }}
                        className="mb-6"
                      >
                        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
                      </motion.div>

                      <h3 className="text-2xl font-bold text-emerald-800 mb-3">
                        Check Your Email
                      </h3>
                      <p className="text-teal-600 mb-6">
                        We've sent a password reset link to{" "}
                        <span className="font-semibold text-teal-700">{email}</span>
                      </p>

                      <div className="bg-emerald-50 border border-emerald-200/50 rounded-[20px] p-4 mb-6">
                        <p className="text-sm text-emerald-700">
                          💡 The link will expire in 24 hours. If you don't see the email, check your spam folder.
                        </p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleReset}
                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-[20px] shadow-xl hover:shadow-2xl transition-all font-medium"
                      >
                        Done
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
