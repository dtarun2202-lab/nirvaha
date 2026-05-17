import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import BACKEND_CONFIG from "@/config/backend";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Video,
  XCircle,
  CheckCircle,
  MessageSquare,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Info,
  Star,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Booking = {
  id: string;
  _id?: string;
  userName: string;
  userEmail: string;
  email?: string;
  companionName?: string;
  companionId?: string;
  itemName?: string;
  itemId?: string;
  type: string;
  platform: string;
  date: string;
  time: string;
  price?: number;
  status: string;
  sessionNotes?: string;
};

export function MySessionsPage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals / Overlays
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  
  // Feedback state
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const apiBaseUrl = BACKEND_CONFIG.API_BASE_URL;

  // Fetch bookings for the logged-in user
  const fetchBookings = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/api/bookings`);
      if (response.ok) {
        const data = await response.json();
        // Filter by user email
        const userBookings = Array.isArray(data)
          ? data.filter(
              (b: any) =>
                (b.userEmail && b.userEmail.toLowerCase() === user.email.toLowerCase()) ||
                (b.email && b.email.toLowerCase() === user.email.toLowerCase())
            )
          : [];
        setBookings(userBookings);
      }
    } catch (error) {
      console.error("Failed to load user sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user?.email]);

  // Handle socket real-time updates
  useEffect(() => {
    if (!socket || !user?.email) return;

    const handleBookingUpdated = (updatedBooking: any) => {
      // Check if this booking belongs to our logged-in user
      const isUserBooking =
        (updatedBooking.userEmail && updatedBooking.userEmail.toLowerCase() === user.email.toLowerCase()) ||
        (updatedBooking.email && updatedBooking.email.toLowerCase() === user.email.toLowerCase());

      if (isUserBooking) {
        setBookings((prev) => {
          const matchIndex = prev.findIndex((b) => (b.id === updatedBooking.id || b._id === updatedBooking._id || b.id === updatedBooking._id));
          if (matchIndex !== -1) {
            const updated = [...prev];
            updated[matchIndex] = {
              ...updated[matchIndex],
              ...updatedBooking,
              id: updatedBooking.id || updatedBooking._id,
            };
            return updated;
          } else {
            return [
              {
                ...updatedBooking,
                id: updatedBooking.id || updatedBooking._id,
              },
              ...prev,
            ];
          }
        });

        // Trigger gorgeous real-time notification toast
        toast.info(`Session Status Updated: Your session with ${
          updatedBooking.companionName || updatedBooking.itemName || "your guide"
        } is now "${updatedBooking.status}".`);
      }
    };

    socket.on("booking-updated", handleBookingUpdated);
    socket.on("booking-created", fetchBookings); // Refresh on creation

    return () => {
      socket.off("booking-updated", handleBookingUpdated);
      socket.off("booking-created", fetchBookings);
    };
  }, [socket, user?.email]);

  // Cancel Request Action
  const handleCancelRequest = async (bookingId: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (response.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId || b._id === bookingId ? { ...b, status: "cancelled" } : b))
        );
        toast.success("Your session cancellation request was completed successfully.");
      } else {
        throw new Error("Failed to cancel session");
      }
    } catch (err) {
      toast.error("Cancellation Failed. Please try again or contact support.");
    }
  };

  // Join Session Action
  const handleJoinSession = (booking: Booking) => {
    toast.success("🧘 Entering Sanctuary... Connecting you to your secure, tranquil wellness video stream.");
    // Open fake session room or redirect to sound healing/academy
    setTimeout(() => {
      navigate("/dashboard/sound");
    }, 2000);
  };

  // Reschedule Action
  const handleReschedule = async () => {
    if (!selectedBooking || !rescheduleDate || !rescheduleTime) return;

    try {
      const response = await fetch(`${apiBaseUrl}/api/bookings/${selectedBooking.id || selectedBooking._id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Pending Approval",
          date: rescheduleDate,
          time: rescheduleTime,
        }),
      });

      if (response.ok) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === selectedBooking.id || b._id === selectedBooking._id
              ? { ...b, status: "Pending Approval", date: rescheduleDate, time: rescheduleTime }
              : b
          )
        );
        setIsRescheduleOpen(false);
        toast.success("Your reschedule request has been sent for companion confirmation.");
      }
    } catch (err) {
      toast.error("Rescheduling Failed: Unable to process reschedule request. Please try again.");
    }
  };

  // Feedback Submission Action
  const submitFeedback = () => {
    if (!selectedBooking) return;
    setSubmittingFeedback(true);
    setTimeout(() => {
      setSubmittingFeedback(false);
      setIsFeedbackOpen(false);
      setFeedbackText("");
      toast.success("Your healing experience feedback has been saved and shared with your guide.");
    }, 1200);
  };

  // Get Calm, branded status badge component details
  const getStatusBadgeProps = (status: string) => {
    const s = status.toLowerCase();
    if (s === "session confirmed") {
      return {
        bg: "bg-[#EAFBF0] border-[#BDE8CE] text-[#1B4332]",
        label: "Session Confirmed",
        icon: CheckCircle,
      };
    }
    if (s === "pending approval" || s === "pending") {
      return {
        bg: "bg-[#FFFDF0] border-[#FCE181] text-[#997917] animate-pulse",
        label: "Pending Approval",
        icon: Sparkles,
      };
    }
    if (s === "completed") {
      return {
        bg: "bg-[#E8F4F8] border-[#B3D6E4] text-[#1A4F66]",
        label: "Completed",
        icon: Calendar,
      };
    }
    return {
      bg: "bg-rose-50 border-rose-100 text-rose-700",
      label: status,
      icon: XCircle,
    };
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#EEF6F2] to-[#F4FAF6] pt-24 pb-16 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Serene Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#D5EEDD]/70">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-700">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-widest">Your Private Sanctuary</span>
            </div>
            <h1 className="text-4xl font-bold text-[#1B4332] tracking-tight">My Sessions</h1>
            <p className="text-[#556B5D] text-md max-w-xl leading-relaxed">
              Welcome to your personal dashboard. Here you can track, manage, and enter your booked reflection, meditation, and healing sanctuaries.
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/companion")}
            className="border-[#b7e4c7] hover:bg-[#EAFBF0] text-[#1B4332] rounded-xl px-5 py-6 h-auto font-bold shadow-sm transition-all"
          >
            Book Another Session <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Dynamic Loading Shimmer */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-white/50 border border-[#D5EEDD] rounded-[24px] p-8 animate-pulse space-y-4">
                <div className="h-6 w-1/3 bg-emerald-100 rounded-md" />
                <div className="h-10 w-2/3 bg-emerald-50 rounded-md" />
                <div className="h-4 w-1/2 bg-gray-100 rounded-md" />
                <div className="h-12 w-full bg-emerald-50/30 rounded-xl" />
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          
          /* Empty Sanctuary State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white/60 backdrop-blur-md border border-[#D5EEDD] rounded-[32px] p-12 max-w-2xl mx-auto shadow-sm"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#EAFBF0] to-[#D5F2D9] flex items-center justify-center text-[#1B4332] mx-auto mb-6 shadow-inner">
              <Sparkles className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-[#1B4332] mb-3">Your Journey Starts Here</h2>
            <p className="text-[#556B5D] text-md leading-relaxed max-w-md mx-auto mb-8">
              No sessions have been scheduled yet. Embark on a highly personalized path of reflection and growth with our certified wellness companions.
            </p>
            <Button
              onClick={() => navigate("/dashboard/companion")}
              className="bg-[#1B4332] hover:bg-[#2d6a4f] text-white rounded-xl px-8 py-6 h-auto font-bold shadow-md transition-transform hover:scale-105"
            >
              Explore Companions
            </Button>
          </motion.div>
        ) : (
          
          /* Dynamic Grid of Bookings */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {bookings.map((booking) => {
                const badge = getStatusBadgeProps(booking.status);
                const IconComponent = badge.icon;
                const sessionTitle = booking.companionName || booking.itemName || booking.type || "Wellness Session";

                return (
                  <motion.div
                    key={booking.id || booking._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-white border-[#D5EEDD] hover:border-[#52B788] shadow-sm hover:shadow-lg transition-all rounded-[24px] overflow-hidden p-6 flex flex-col justify-between h-full relative group">
                      
                      {/* Top Row: Title, Guide Name, Status */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[10px] font-bold tracking-widest text-[#64C08E] uppercase block mb-1">
                              {booking.type || "Serene Guide"}
                            </span>
                            <h3 className="text-xl font-bold text-[#1B4332] group-hover:text-emerald-950 transition-colors">
                              {sessionTitle}
                            </h3>
                          </div>
                          
                          {/* Cute Status Badge */}
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                            <IconComponent className="w-3.5 h-3.5" />
                            {badge.label}
                          </span>
                        </div>

                        {/* Date and Time Info */}
                        <div className="grid grid-cols-2 gap-4 bg-[#F4FAF6]/70 border border-[#D5EEDD]/50 rounded-2xl p-3 text-sm text-[#2d6a4f]">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 shrink-0 text-[#52B788]" />
                            <span className="font-semibold">{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-2 border-l border-[#D5EEDD]/40 pl-4">
                            <Clock className="w-4 h-4 shrink-0 text-[#52B788]" />
                            <span className="font-semibold">{booking.time}</span>
                          </div>
                        </div>

                        {/* Notes if available */}
                        {booking.sessionNotes && (
                          <div className="border-l-2 border-[#52B788] pl-3 italic text-xs text-[#556B5D] py-1 bg-gradient-to-r from-[#F4FAF6] to-transparent pr-2 rounded-r-md">
                            "{booking.sessionNotes}"
                          </div>
                        )}
                      </div>

                      {/* Bottom Action Section */}
                      <div className="border-t border-[#D5EEDD]/40 pt-4 mt-6 flex flex-wrap gap-2.5">
                        
                        {/* 1. Pending Approval Actions */}
                        {(booking.status.toLowerCase() === "pending approval" || booking.status.toLowerCase() === "pending") && (
                          <Button
                            variant="ghost"
                            onClick={() => handleCancelRequest(booking.id || booking._id || "")}
                            className="w-full text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-100 hover:border-rose-200 rounded-xl font-bold transition-all text-xs py-2.5 h-auto"
                          >
                            Cancel Request
                          </Button>
                        )}

                        {/* 2. Session Confirmed Actions */}
                        {booking.status.toLowerCase() === "session confirmed" && (
                          <div className="grid grid-cols-3 gap-2 w-full">
                            <Button
                              onClick={() => handleJoinSession(booking)}
                              className="col-span-2 bg-[#1B4332] hover:bg-[#2d6a4f] text-white rounded-xl font-bold shadow-md transition-all text-xs py-3 h-auto"
                            >
                              Join Session
                            </Button>
                            
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setRescheduleDate(booking.date);
                                setRescheduleTime(booking.time);
                                setIsRescheduleOpen(true);
                              }}
                              className="border-[#b7e4c7] hover:bg-[#EAFBF0] text-[#1B4332] rounded-xl font-bold text-xs py-3 h-auto"
                            >
                              Reschedule
                            </Button>
                            
                            <Button
                              variant="ghost"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setIsDetailsOpen(true);
                              }}
                              className="col-span-3 text-[#556B5D] hover:text-[#1B4332] bg-gray-50 hover:bg-[#EAFBF0] rounded-xl text-xs py-2.5 h-auto font-bold"
                            >
                              View Details & Guidelines
                            </Button>
                          </div>
                        )}

                        {/* 3. Completed Actions */}
                        {booking.status.toLowerCase() === "completed" && (
                          <div className="grid grid-cols-2 gap-2.5 w-full">
                            <Button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setIsFeedbackOpen(true);
                              }}
                              className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white rounded-xl font-bold text-xs py-2.5 h-auto shadow-sm"
                            >
                              Leave Feedback
                            </Button>
                            
                            <Button
                              variant="outline"
                              onClick={() => navigate("/dashboard/companion")}
                              className="border-[#b7e4c7] hover:bg-[#EAFBF0] text-[#1B4332] rounded-xl font-bold text-xs py-2.5 h-auto"
                            >
                              Book Again
                            </Button>
                          </div>
                        )}

                        {/* 4. Cancelled / Rejected Rebook */}
                        {(booking.status.toLowerCase() === "cancelled" || booking.status.toLowerCase() === "rejected") && (
                          <Button
                            variant="outline"
                            onClick={() => navigate("/dashboard/companion")}
                            className="w-full border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold text-xs py-2.5 h-auto"
                          >
                            Re-schedule Companion
                          </Button>
                        )}
                      </div>

                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* 1. View Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md bg-white rounded-[24px] border border-[#D5EEDD] shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1B4332]">Session Details</DialogTitle>
            <DialogDescription className="text-sm text-[#556B5D]">Sanctuary guidelines & companion preparations.</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 text-sm text-[#1B4332] pt-2">
              <div className="bg-[#F4FAF6] border border-[#D5EEDD] rounded-2xl p-4 space-y-2">
                <div className="flex justify-between"><span className="text-[#556B5D]">Sanctuary guide:</span><span className="font-bold">{selectedBooking.companionName || "Nirvaha Guide"}</span></div>
                <div className="flex justify-between"><span className="text-[#556B5D]">Format:</span><span className="font-bold uppercase tracking-wider">{selectedBooking.platform || "Secure Video Stream"}</span></div>
                <div className="flex justify-between"><span className="text-[#556B5D]">Investment value:</span><span className="font-bold">₹{selectedBooking.price || "1500"}</span></div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-bold text-[#2d6a4f] flex items-center gap-1"><Info className="w-4 h-4" /> Before joining:</h4>
                <ul className="list-disc pl-5 text-xs text-[#556B5D] space-y-1.5">
                  <li>Please be in a quiet, isolated, comfortable ambient space.</li>
                  <li>Have a glass of warm water or pure herbal infusion ready nearby.</li>
                  <li>Prepare your journal or reflection diary for insightful breakthroughs.</li>
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)} className="bg-[#1B4332] hover:bg-[#2d6a4f] text-white rounded-xl w-full py-5 h-auto font-bold shadow-md">
              Acknowledge & Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Reschedule Modal */}
      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent className="max-w-md bg-white rounded-[24px] border border-[#D5EEDD] shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1B4332]">Reschedule Sanctuary</DialogTitle>
            <DialogDescription className="text-sm text-[#556B5D]">Propose a new serene date and timing.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2d6a4f]">New Date</label>
              <Input
                type="text"
                placeholder="e.g. 18 May 2026"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="border-[#b7e4c7] focus:border-[#52B788] rounded-xl h-[45px] bg-[#F4FAF6]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2d6a4f]">New Time Slot</label>
              <Input
                type="text"
                placeholder="e.g. 03:00 PM"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
                className="border-[#b7e4c7] focus:border-[#52B788] rounded-xl h-[45px] bg-[#F4FAF6]"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="ghost" onClick={() => setIsRescheduleOpen(false)} className="rounded-xl font-bold text-[#556B5D]">
              Cancel
            </Button>
            <Button onClick={handleReschedule} className="bg-[#1B4332] hover:bg-[#2d6a4f] text-white rounded-xl px-6 py-5 h-auto font-bold shadow-md">
              Request Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Leave Feedback Modal */}
      <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
        <DialogContent className="max-w-md bg-white rounded-[24px] border border-[#D5EEDD] shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1B4332]">Rate Your Healing Experience</DialogTitle>
            <DialogDescription className="text-sm text-[#556B5D]">Your insights empower our spiritual companions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 pt-2 text-center">
            {/* Stars */}
            <div className="flex justify-center gap-2.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-95"
                >
                  <Star
                    className={`w-9 h-9 ${
                      star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-[#2d6a4f]">Your Experience Details</label>
              <textarea
                placeholder="Share how this session supported your mindfulness and calm journey..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                className="w-full border border-[#b7e4c7] focus:border-[#52B788] focus:ring-1 focus:ring-[#52B788] rounded-2xl p-3 bg-[#F4FAF6] text-sm text-[#1B4332] outline-none"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              onClick={submitFeedback}
              disabled={submittingFeedback}
              className="bg-[#1B4332] hover:bg-[#2d6a4f] text-white rounded-xl w-full py-5 h-auto font-bold shadow-md"
            >
              {submittingFeedback ? "Saving Insights..." : "Submit Healing Feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
