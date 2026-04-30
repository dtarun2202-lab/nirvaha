import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  Clock, 
  Calendar as CalendarIcon, 
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Heart,
  MessageCircle,
  Video,
  Zap,
  CreditCard,
  Star,
  MapPin,
  ShieldCheck,
  Leaf
} from 'lucide-react';
import { Calendar } from '../ui/calendar';

interface Companion {
  id: string;
  name: string;
  category: string;
  title: string;
  bio: string;
  rating: number;
  sessions: number;
  price: string;
  avatar: string;
  energyTags: string[];
  color: string;
}

const mentors: Companion[] = [
  {
    id: "c1",
    name: "Ananya Sharma",
    category: "Meditation",
    title: "Mindfulness Expert",
    bio: "Helping you find calm through guided meditation.",
    rating: 4.8,
    sessions: 120,
    price: "₹800",
    avatar: "/meditation/wellness1.jpeg",
    energyTags: ["Calm", "Focus", "Balance"],
    color: "from-emerald-400 to-teal-400"
  },
  {
    id: "c2",
    name: "Rajesh Iyer",
    category: "Counseling",
    title: "Life Counselor",
    bio: "Navigating life's complexities with compassion.",
    rating: 4.9,
    sessions: 210,
    price: "₹1200",
    avatar: "/meditation/wellness2.jpeg",
    energyTags: ["Clarity", "Support", "Growth"],
    color: "from-blue-400 to-indigo-400"
  },
  {
    id: "c3",
    name: "Priya Das",
    category: "Healing",
    title: "Energy Healer",
    bio: "Restoring balance through ancient healing arts.",
    rating: 4.7,
    sessions: 95,
    price: "₹1500",
    avatar: "/meditation/wellness3.jpeg",
    energyTags: ["Restoration", "Peace", "Aura"],
    color: "from-amber-400 to-orange-400"
  },
  {
    id: "c4",
    name: "Swami Viveka",
    category: "Spiritual",
    title: "Spiritual Guide",
    bio: "Guiding seekers on the path of awakening.",
    rating: 5.0,
    sessions: 500,
    price: "₹2000",
    avatar: "/meditation/wellness4.jpeg",
    energyTags: ["Awakening", "Wisdom", "Zen"],
    color: "from-purple-400 to-pink-400"
  }
];

const sessionTypes = [
  { id: '30min', title: '30-Minute Session', description: 'Quick check-in & guidance', icon: MessageCircle, price: '₹500' },
  { id: '1hour', title: '1-Hour Deep Dive', description: 'Comprehensive healing session', icon: Heart, price: '₹1000' },
  { id: 'group', title: 'Group Session', description: 'Learn & grow with others', icon: User, price: '₹300' },
  { id: 'emergency', title: 'Emergency Support', description: 'Instant 1-on-1 priority call', icon: Zap, price: '₹1500' },
];

const timeSlots = [
  { id: 'm1', label: '09:00 AM', period: 'Morning' },
  { id: 'm2', label: '10:30 AM', period: 'Morning' },
  { id: 'm3', label: '11:45 AM', period: 'Morning' },
  { id: 'a1', label: '02:00 PM', period: 'Afternoon' },
  { id: 'a2', label: '03:30 PM', period: 'Afternoon' },
  { id: 'a3', label: '05:00 PM', period: 'Afternoon' },
  { id: 'e1', label: '07:30 PM', period: 'Evening' },
  { id: 'e2', label: '08:45 PM', period: 'Evening' },
];

interface CompanionBookingModalProps {
  onClose: () => void;
  initialCompanion?: Companion | null;
}

const CompanionBookingModal: React.FC<CompanionBookingModalProps> = ({
  onClose,
  initialCompanion,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(initialCompanion ? 2 : 1);
  const [bookingData, setBookingData] = useState({
    companion: initialCompanion || mentors[0],
    sessionType: sessionTypes[1],
    date: new Date(),
    timeSlot: timeSlots[3],
  });

  const totalSteps = 5;

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleEscape]);

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
    else {
      alert("Booking confirmed! Redirecting to payment...");
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-emerald-950/40 backdrop-blur-md p-4">
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] shadow-2xl w-full max-w-6xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
      >
        {/* Left Side - Visual Panel */}
        <div className="hidden md:flex w-1/3 relative bg-emerald-900 overflow-hidden p-12 flex-col justify-between text-white">
          <div className="absolute inset-0 z-0">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute -top-1/4 -right-1/4 w-full h-full bg-emerald-500 rounded-full blur-[100px]"
            />
            <motion.div 
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 12, repeat: Infinity }}
              className="absolute -bottom-1/4 -left-1/4 w-full h-full bg-teal-500 rounded-full blur-[100px]"
            />
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/20">
              <Leaf className="w-6 h-6 text-teal-300" />
            </div>
            <h3 className="text-3xl font-bold mb-4 leading-tight">Your Path to <br/>Inner Peace.</h3>
            <p className="text-teal-100/60 text-sm font-light tracking-wide italic">
              “The soul always knows what to do to heal itself. The challenge is to silence the mind.”
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-400">
                <img src={bookingData.companion.avatar} alt="Selected" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-teal-300 font-bold">Selected Mentor</p>
                <p className="text-sm font-bold">{bookingData.companion.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-teal-300 font-bold">Duration</p>
                <p className="text-sm font-bold">{bookingData.sessionType.title}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <p className="text-teal-100/60 text-xs">Total Exchange</p>
              <p className="text-xl font-black text-emerald-400">{bookingData.sessionType.price}</p>
            </div>
          </div>
        </div>

        {/* Right Side - Booking Area */}
        <div className="flex-1 bg-white p-8 md:p-12 overflow-y-auto relative flex flex-col min-h-0">
          <button
            onClick={onClose}
            className="absolute top-8 right-8 w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center hover:bg-emerald-100 transition-all text-emerald-800 z-50"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Progress Indicator */}
          <div className="mb-10 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-800/40">Step {currentStep} of {totalSteps}</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      currentStep === s ? 'w-6 bg-emerald-600' : currentStep > s ? 'bg-emerald-600/40' : 'bg-emerald-50'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="h-1 w-full bg-emerald-50 rounded-full overflow-hidden">
              <motion.div 
                initial={false}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                className="h-full bg-emerald-600 shadow-[0_0_10px_rgba(5,150,105,0.5)]"
              />
            </div>
          </div>

          {/* Steps Content */}
          <div className="flex-1 min-h-0">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-emerald-950 mb-2">Select your Companion 🌿</h2>
                    <p className="text-emerald-800/50">Choose a mentor who resonates with your energy.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mentors.map((m) => (
                      <motion.div
                        key={m.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setBookingData({ ...bookingData, companion: m })}
                        className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex gap-4 ${
                          bookingData.companion.id === m.id 
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-500/10' 
                          : 'border-emerald-50 hover:border-emerald-200'
                        }`}
                      >
                        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                          <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-emerald-950 truncate">{m.name}</h4>
                            <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-emerald-100">
                              <Star className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                              <span className="text-[10px] font-bold text-emerald-950">{m.rating}</span>
                            </div>
                          </div>
                          <p className="text-xs text-emerald-600 font-medium mb-2">{m.title}</p>
                          <p className="text-[10px] text-emerald-800/40 font-bold">{m.price} / session</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-emerald-950 mb-2">Session Type 🧘</h2>
                    <p className="text-emerald-800/50">Select the type of connection you need today.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sessionTypes.map((type) => (
                      <motion.div
                        key={type.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setBookingData({ ...bookingData, sessionType: type })}
                        className={`p-6 rounded-[32px] border-2 transition-all cursor-pointer ${
                          bookingData.sessionType.id === type.id 
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-lg' 
                          : 'border-emerald-50 hover:border-emerald-100'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                          bookingData.sessionType.id === type.id ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          <type.icon className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-emerald-950 mb-1">{type.title}</h4>
                        <p className="text-xs text-emerald-800/50 mb-4">{type.description}</p>
                        <p className="text-lg font-black text-emerald-600">{type.price}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-emerald-950 mb-2">Choose Date 📅</h2>
                    <p className="text-emerald-800/50">Pick a day that works best for your journey.</p>
                  </div>
                  <div className="flex justify-center bg-emerald-50/30 p-8 rounded-[40px] border border-emerald-50 shadow-inner">
                    <Calendar
                      mode="single"
                      selected={bookingData.date}
                      onSelect={(date) => date && setBookingData({ ...bookingData, date })}
                      className="rounded-3xl bg-white shadow-xl border-none p-6"
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-emerald-950 mb-2">Select Time Slot ⏰</h2>
                    <p className="text-emerald-800/50">Choose a moment of peace for your session.</p>
                  </div>
                  <div className="space-y-8">
                    {['Morning', 'Afternoon', 'Evening'].map((period) => (
                      <div key={period}>
                        <h4 className="text-[10px] uppercase tracking-widest font-black text-emerald-600 mb-4 ml-2">{period} Slots</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {timeSlots.filter(s => s.period === period).map((slot) => (
                            <motion.button
                              key={slot.id}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setBookingData({ ...bookingData, timeSlot: slot })}
                              className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                                bookingData.timeSlot.id === slot.id 
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200' 
                                : 'bg-white border-emerald-50 text-emerald-800 hover:border-emerald-200'
                              }`}
                            >
                              {slot.label}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-emerald-950 mb-2">Booking Summary ✨</h2>
                    <p className="text-emerald-800/50">Review your session details before confirming.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-emerald-50/50 p-6 rounded-[32px] border border-emerald-100">
                      <div className="flex items-center gap-4 mb-6">
                        <img src={bookingData.companion.avatar} alt="Mentor" className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md" />
                        <div>
                          <h4 className="text-xl font-bold text-emerald-950">{bookingData.companion.name}</h4>
                          <p className="text-emerald-600 font-medium">{bookingData.companion.title}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-emerald-50">
                          <p className="text-[10px] uppercase font-bold text-emerald-800/40 mb-1">Session</p>
                          <p className="font-bold text-emerald-950">{bookingData.sessionType.title}</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-emerald-50">
                          <p className="text-[10px] uppercase font-bold text-emerald-800/40 mb-1">Exchange</p>
                          <p className="font-bold text-emerald-950">{bookingData.sessionType.price}</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-emerald-50">
                          <p className="text-[10px] uppercase font-bold text-emerald-800/40 mb-1">Date</p>
                          <p className="font-bold text-emerald-950">{bookingData.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-emerald-50">
                          <p className="text-[10px] uppercase font-bold text-emerald-800/40 mb-1">Time</p>
                          <p className="font-bold text-emerald-950">{bookingData.timeSlot.label}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-xs">
                      <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                      <p>Your session is protected by Nirvaha's <strong>Safe Space Guarantee</strong>. Private, secure, and compassionate.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-10 pt-8 border-t border-emerald-50 flex-shrink-0">
            <button
              onClick={prevStep}
              className={`flex items-center gap-2 font-bold transition-all ${
                currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-emerald-800/40 hover:text-emerald-800'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextStep}
              className={`
                px-10 py-5 rounded-2xl font-bold shadow-xl transition-all flex items-center gap-3
                ${currentStep === totalSteps ? 'bg-emerald-900 text-white' : 'bg-emerald-600 text-white shadow-emerald-200'}
              `}
            >
              {currentStep === totalSteps ? (
                <>Confirm Booking <CreditCard className="w-5 h-5" /></>
              ) : (
                <>Continue <ChevronRight className="w-5 h-5" /></>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CompanionBookingModal;
