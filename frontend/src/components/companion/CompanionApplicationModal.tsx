import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import { createCompanionApplication } from "@/lib/companionApi";
import BACKEND_CONFIG from "@/config/backend";

interface CompanionApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompanionApplicationModal({ isOpen, onClose }: CompanionApplicationModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    location: "",
    title: "",
    experience: "",
    languages: "",
    bio: "",
    availability: "",
    hourlyRate: "",
    callRate: "",
    idProofUrl: "",
    certificatesUrl: "",
    whyJoin: "Passionate about spiritual wellness",
    specialties: "Wellness, Healing",
  });

  const [idFile, setIdFile] = useState<File | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "id" | "cert") => {
    if (e.target.files && e.target.files[0]) {
      if (type === "id") setIdFile(e.target.files[0]);
      if (type === "cert") setCertFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || BACKEND_CONFIG.API_BASE_URL || "http://localhost:5000";
    const res = await fetch(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      body: data,
    });
    if (!res.ok) throw new Error("File upload failed");
    const json = await res.json();
    return json.url;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      setUploading(true);

      let idUrl = formData.idProofUrl;
      let certUrl = formData.certificatesUrl;

      if (idFile) idUrl = await uploadFile(idFile);
      if (certFile) certUrl = await uploadFile(certFile);

      setUploading(false);

      const payload = {
        ...formData,
        age: Number(formData.age) || 0,
        hourlyRate: Number(formData.hourlyRate) || 0,
        callRate: Number(formData.callRate) || 0,
        idProofUrl: idUrl,
        certificatesUrl: certUrl,
      };

      const result = await createCompanionApplication(payload);
      localStorage.setItem("nirvaha_companion_application_id", result.id);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit application");
      setUploading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-emerald-950/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-emerald-50 flex justify-between items-center bg-emerald-50/30">
          <div>
            <h2 className="text-2xl font-bold text-emerald-950">Apply as a Companion</h2>
            <p className="text-emerald-700/70 text-sm">Join our network of spiritual guides</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-emerald-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-emerald-900" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-emerald-200">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-950 mb-2">Application Submitted!</h3>
              <p className="text-emerald-700/70 max-w-md mb-8">
                Your application has been submitted successfully. Our team will review your profile soon.
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-emerald-900 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-800 transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        step >= s ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      {s}
                    </div>
                    {s < 4 && (
                      <div
                        className={`h-1 w-12 sm:w-24 mx-2 rounded-full ${
                          step > s ? "bg-emerald-600" : "bg-emerald-100"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Form Steps */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="text-lg font-bold text-emerald-950 mb-4">Personal Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-emerald-800 mb-1">Full Name</label>
                      <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:border-emerald-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-emerald-800 mb-1">Email</label>
                      <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:border-emerald-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-emerald-800 mb-1">Phone Number</label>
                      <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:border-emerald-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-emerald-800 mb-1">Age</label>
                      <input name="age" type="number" value={formData.age} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:border-emerald-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-emerald-800 mb-1">Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:border-emerald-500 outline-none">
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-emerald-800 mb-1">Location</label>
                      <input name="location" value={formData.location} onChange={handleInputChange} placeholder="City, Country" className="w-full p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:border-emerald-500 outline-none" />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="text-lg font-bold text-emerald-950 mb-4">Professional Details</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-emerald-800 mb-1">Area of Expertise / Title</label>
                      <input name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Yoga Instructor, Energy Healer" className="w-full p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:border-emerald-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-emerald-800 mb-1">Years of Experience</label>
                        <input name="experience" value={formData.experience} onChange={handleInputChange} placeholder="e.g. 5 Years" className="w-full p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:border-emerald-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-emerald-800 mb-1">Languages Known</label>
                        <input name="languages" value={formData.languages} onChange={handleInputChange} placeholder="English, Hindi" className="w-full p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:border-emerald-500 outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-emerald-800 mb-1">Short Bio</label>
                      <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={3} placeholder="Tell us about yourself and your journey..." className="w-full p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:border-emerald-500 outline-none resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-emerald-800 mb-1">Why do you want to become a companion?</label>
                      <textarea name="whyJoin" value={formData.whyJoin} onChange={handleInputChange} rows={3} placeholder="Share your motivation for joining our network..." className="w-full p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:border-emerald-500 outline-none resize-none" />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="text-lg font-bold text-emerald-950 mb-4">Availability & Pricing</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-emerald-800 mb-1">Available Timings</label>
                      <input name="availability" value={formData.availability} onChange={handleInputChange} placeholder="e.g. Mon-Fri, 10 AM - 5 PM" className="w-full p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:border-emerald-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-emerald-800 mb-1">Chat Session Charge (₹/hr)</label>
                        <input name="callRate" type="number" value={formData.callRate} onChange={handleInputChange} placeholder="500" className="w-full p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:border-emerald-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-emerald-800 mb-1">Video Session Charge (₹/hr)</label>
                        <input name="hourlyRate" type="number" value={formData.hourlyRate} onChange={handleInputChange} placeholder="1000" className="w-full p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:border-emerald-500 outline-none" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="text-lg font-bold text-emerald-950 mb-4">Document Verification (Optional)</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-emerald-800 mb-2">Upload Resume</label>
                      <div className="relative border-2 border-dashed border-emerald-200 rounded-xl p-6 text-center hover:bg-emerald-50/50 transition-colors">
                        <input type="file" accept="application/pdf,.doc,.docx" onChange={(e) => handleFileChange(e, "id")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-emerald-800">
                          {idFile ? idFile.name : "Click or drag to upload Resume"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-emerald-800 mb-2">Upload Portfolio / Certifications</label>
                      <div className="relative border-2 border-dashed border-emerald-200 rounded-xl p-6 text-center hover:bg-emerald-50/50 transition-colors">
                        <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, "cert")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-emerald-800">
                          {certFile ? certFile.name : "Click or drag to upload Portfolio"}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {!success && (
          <div className="p-6 border-t border-emerald-50 bg-gray-50 flex justify-between items-center">
            <button
              onClick={() => setStep(step > 1 ? step - 1 : 1)}
              className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 ${
                step === 1 ? "opacity-0 pointer-events-none" : "text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 bg-emerald-900 text-white rounded-xl font-bold shadow-md hover:bg-emerald-800 transition-colors flex items-center gap-2"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || uploading}
                className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-500 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting || uploading ? "Submitting..." : "Submit Application"} <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
