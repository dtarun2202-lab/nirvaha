import React, { useEffect, useMemo, useState, useCallback } from "react";
import BACKEND_CONFIG from "@/config/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AdminTable } from "@/admin/components/AdminTable";
import { StatusBadge } from "@/admin/components/StatusBadge";
import { ActionMenu } from "@/admin/components/ActionMenu";
import { ConfirmModal } from "@/admin/components/ConfirmModal";
import { useSocket } from "@/contexts/SocketContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Calendar as CalendarIcon, Download, CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const formatDate = (date: Date | undefined): string => {
  if (!date) return "Select date";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  companionId: string;
  companionName: string;
  companionEmail: string;
  type: string;
  platform: string;
  date: string;
  time: string;
  duration: number; // in minutes
  status: string;
  price: number;
  quantity: number;
  paymentStatus: string;
  deliveryStatus: string;
  createdAt: string;
  phone?: string;
  sessionNotes?: string;
}

export function BookingManagementPage() {
  const { socket } = useSocket();
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [confirmAction, setConfirmAction] = useState<{
    type: "cancel" | "complete" | "accept" | "reject";
    booking: Booking;
  } | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/bookings`);
      if (!response.ok) {
        throw new Error("Unable to load bookings");
      }
      const data = await response.json();
      setBookings(
        Array.isArray(data)
          ? data
              .filter((booking: any) => {
                const rawType = String(booking.type || "").toLowerCase();
                // Exclude marketplace sessions (they have type: "session")
                return rawType !== "session";
              })
              .map((booking: any) => {
              let parsedType = booking.type
                ? String(booking.type).toLowerCase()
                : "session";

              if (parsedType === "video") parsedType = "Video";
              else if (parsedType === "chat") parsedType = "Chat";
              else if (parsedType === "retreat") parsedType = "Retreat";
              else if (parsedType === "product") parsedType = "Product";
              else parsedType = "Session";

              let parsedPlatform = String(booking.platform || "Online");
              let parsedDate = String(booking.date || booking.createdAt || "");
              let parsedTime = String(booking.time || "");

              const platformLower = parsedPlatform.toLowerCase();

              if (
                platformLower.includes("ist") ||
                platformLower.includes("am") ||
                platformLower.includes("pm") ||
                platformLower.includes("tomorrow") ||
                platformLower.includes("today")
              ) {
                parsedTime = parsedPlatform;
                parsedPlatform = "Online";
              }

              if (!parsedPlatform) parsedPlatform = "Online";

              if (parsedDate.includes("T") && parsedDate.endsWith("Z")) {
                const d = new Date(parsedDate);

                if (!isNaN(d.getTime())) {
                  parsedDate = d.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  if (!parsedTime || parsedTime === "Online") {
                    parsedTime = d.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  }
                }
              }

              return {
                id: booking.id || booking._id || "",
                userId: booking.userId || "",
                userName: booking.userName || booking.name || "Guest",
                userEmail: booking.userEmail || booking.email || "N/A",
                companionId: booking.companionId || booking.itemId || "",
                companionName:
                  booking.companionName ||
                  booking.itemName ||
                  booking.companion ||
                  "Unknown",
                companionEmail: booking.companionEmail || "",
                type: parsedType,
                platform: parsedPlatform,
                date: parsedDate,
                time: parsedTime,
                duration:
                  typeof booking.duration === "number"
                    ? booking.duration
                    : parseInt(booking.duration) || 0,
                status: booking.status || "upcoming",
                price: Number(booking.price || 0),
                quantity: booking.quantity || 1,
                paymentStatus: booking.paymentStatus || "N/A",
                deliveryStatus: booking.deliveryStatus || "N/A",
                createdAt: booking.createdAt || new Date().toISOString(),
                phone: booking.phone || "N/A",
                sessionNotes: booking.sessionNotes || "",
              };
            })
          : []
      );
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (!socket) return;

    socket.on("booking-created", () => {
      fetchBookings();
    });

    socket.on("booking-updated", () => {
      fetchBookings();
    });

    return () => {
      socket.off("booking-created");
      socket.off("booking-updated");
    };
  }, [socket, fetchBookings]);

  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const matchesFilter = filter === "all" || booking.status.toLowerCase() === filter.toLowerCase();
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          booking.id.toLowerCase().includes(searchLower) ||
          booking.userName.toLowerCase().includes(searchLower) ||
          booking.userEmail.toLowerCase().includes(searchLower) ||
          booking.companionName.toLowerCase().includes(searchLower);

        let inRange = true;
        if (dateFrom || dateTo) {
          let bookingDate = new Date(booking.date);

          if (isNaN(bookingDate.getTime())) {
            // Attempt to extract a date from strings like "12 Aug - 18 Aug TBD"
            const match = booking.date.match(/(\d{1,2}\s+[a-zA-Z]+)/);
            if (match) {
              bookingDate = new Date(`${match[1]} ${new Date().getFullYear()}`);
            }
            // Fallback to createdAt if still invalid
            if (isNaN(bookingDate.getTime())) {
              bookingDate = new Date(booking.createdAt);
            }
          }

          if (!isNaN(bookingDate.getTime())) {
            // zero out time for comparison
            const compareDate = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());

            if (dateFrom) {
              const from = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate());
              if (compareDate.getTime() < from.getTime()) inRange = false;
            }
            if (dateTo) {
              const to = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate());
              if (compareDate.getTime() > to.getTime()) inRange = false;
            }
          } else {
            // If we can't parse the date at all and a filter is active, exclude it
            inRange = false;
          }
        }

        return matchesFilter && matchesSearch && inRange;
      }),
    [bookings, filter, searchQuery, dateFrom, dateTo]
  );

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  const handleAction = (type: string, booking: Booking) => {
    setConfirmAction({ type: type as "cancel" | "complete" | "accept" | "reject", booking });
  };

  const handleExportCSV = () => {
    if (filteredBookings.length === 0) return;

    const headers = ["Booking ID", "User Name", "User Email", "Companion Name", "Type", "Platform", "Date", "Time", "Duration (min)", "Status", "Price", "Created At"];
    const csvContent = [
      headers.join(","),
      ...filteredBookings.map(b =>
        [
          `"${b.id}"`,
          `"${b.userName}"`,
          `"${b.userEmail}"`,
          `"${b.companionName}"`,
          `"${b.type}"`,
          `"${b.platform}"`,
          `"${b.date}"`,
          `"${b.time}"`,
          b.duration,
          `"${b.status}"`,
          b.price,
          `"${b.createdAt}"`
        ].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const confirmActionHandler = async () => {
    if (!confirmAction) return;

    let targetStatus = "Session Confirmed";
    if (confirmAction.type === "cancel") {
      targetStatus = "cancelled";
    } else if (confirmAction.type === "reject") {
      targetStatus = "rejected";
    } else if (confirmAction.type === "complete") {
      targetStatus = "completed";
    } else if (confirmAction.type === "accept") {
      targetStatus = "Session Confirmed";
    }

    try {
      setActionLoading(true);
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/bookings/${confirmAction.booking.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: targetStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.id === confirmAction.booking.id
            ? { ...b, status: targetStatus }
            : b
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
    }
  };

  return (
    <div className="p-6 bg-[#F4FAF6] min-h-screen -m-6 rounded-tl-3xl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white border border-[#D5EEDD] rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#5ABF88] p-3 rounded-xl text-white shadow-sm">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1F4131]">Booking Management</h2>
                <p className="text-[#64C08E] text-sm font-semibold">{filteredBookings.length} bookings total</p>
              </div>
            </div>
            <Button
              onClick={handleExportCSV}
              className="bg-[#4EAA77] hover:bg-[#3C9162] text-white rounded-xl px-6 py-2.5 h-auto font-bold shadow-md"
            >
              <Download className="mr-2 w-5 h-5" />
              Export CSV
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
            <div className="relative md:col-span-3">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#86CDA6]" />
              <Input
                placeholder="Search by ID, user, or companion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white border border-[#BEE4CD] text-[#295641] placeholder:text-[#86CDA6] rounded-xl h-12 focus-visible:ring-[#5ABF88] font-medium"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full bg-white border border-[#BEE4CD] text-[#295641] rounded-xl h-12 focus-visible:ring-[#5ABF88] font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#BEE4CD]">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
              </SelectContent>
            </Select>

          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-2xl border border-[#D5EEDD] bg-white shadow-sm overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5ABF88] mx-auto mb-4"></div>
              <p className="text-lg font-bold text-[#64C08E]">Loading bookings...</p>
            </div>
          ) : (
            <div className="min-w-[1000px]">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 bg-gradient-to-r from-[#B9EBD1] to-[#D5F2D9] p-5 text-[11px] font-bold text-[#1A4F35] tracking-widest uppercase rounded-t-2xl text-center">
                <div className="col-span-1 text-left">ID</div>
                <div className="col-span-2 text-left">User</div>
                <div className="col-span-2 text-left">Item</div>
                <div className="col-span-1">Type</div>
                <div className="col-span-1">Qty</div>
                <div className="col-span-1">Payment</div>
                <div className="col-span-1">Status/Delivery</div>
                <div className="col-span-1">Date</div>
                <div className="col-span-1">Price</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-[#E6F5EB]">
                {filteredBookings.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-[#F6FDF8] transition-colors text-sm text-center">
                    {/* ID */}
                    <div className="col-span-1 text-left">
                      <span className="font-mono font-medium text-[#295641] bg-[#EAFBF0] px-2 py-1 rounded border border-[#BDE8CE]">{item.id.substring(0, 5)}...</span>
                    </div>
                    {/* User */}
                    <div className="col-span-2 text-left truncate">
                      <div className="font-bold text-[#2A4939]">{item.userName}</div>
                    </div>
                    {/* Item */}
                    <div className="col-span-2 text-left truncate">
                      <div className="font-medium text-[#2A4939]">{item.companionName || "-"}</div>
                    </div>
                    {/* Type */}
                    <div className="col-span-1 flex justify-center">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${item.type === 'Product' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#EAFBF0] text-[#34A46B]'}`}>
                        {item.type}
                      </span>
                    </div>
                    {/* Qty */}
                    <div className="col-span-1 font-bold text-[#2A4939]">
                      {item.quantity}
                    </div>
                    {/* Payment */}
                    <div className="col-span-1 flex justify-center">
                      <span className={`px-2 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${item.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {item.paymentStatus}
                      </span>
                    </div>
                    {/* Delivery Status / Session Status */}
                    <div className="col-span-1 flex justify-center">
                      {item.type === 'Product' ? (
                        <span className={`px-2 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${item.deliveryStatus === 'Delivered' ? 'bg-blue-100 text-blue-700' : 'bg-teal-50 text-teal-600 border border-teal-100'}`}>
                          {item.deliveryStatus}
                        </span>
                      ) : (
                        <StatusBadge status={item.status} variant="booking" />
                      )}
                    </div>
                    {/* Date */}
                    <div className="col-span-1 truncate text-[#64C08E] font-medium">
                      {item.date}
                    </div>
                    {/* Price */}
                    <div className="col-span-1 font-bold text-[#1F4131]">
                      ₹{item.price}
                    </div>
                    <div className="col-span-1 flex items-center justify-end">
                      <ActionMenu
                        variant="booking"
                        onView={() => handleView(item)}
                        onApprove={
                          item.status === "Pending Approval" || item.status === "pending"
                            ? () => handleAction("accept", item)
                            : undefined
                        }
                        onReject={
                          item.status === "Pending Approval" || item.status === "pending"
                            ? () => handleAction("reject", item)
                            : undefined
                        }
                        onCancel={
                          item.status === "upcoming" || item.status === "Session Confirmed"
                            ? () => handleAction("cancel", item)
                            : undefined
                        }
                        onComplete={
                          item.status === "upcoming" || item.status === "Session Confirmed"
                            ? () => handleAction("complete", item)
                            : undefined
                        }
                      />
                    </div>
                  </div>
                ))}
                {filteredBookings.length === 0 && (
                  <div className="p-12 text-center text-[#64C08E] font-bold text-lg">
                    No bookings found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Booking Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-5xl bg-white/95 backdrop-blur-3xl border border-[#dceae2]/70 shadow-[0_30px_80px_-15px_rgba(10,46,31,0.22)] rounded-[32px] p-0 overflow-hidden max-h-[90vh] flex flex-col font-['Plus_Jakarta_Sans'] transition-all duration-300">
          
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-[#f8faf9] to-white border-b border-[#d1e0d9]/60 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 shrink-0 rounded-[20px] bg-[#eff6f3] flex items-center justify-center border border-emerald-200/50 shadow-sm">
                <CalendarIcon className="w-6 h-6 text-[#2d5a42]" />
              </div>
              
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                <DialogTitle className="text-[22px] font-extrabold text-[#0a2e1f] tracking-tight leading-none m-0">
                  Booking Overview
                </DialogTitle>
                
                <div className="h-5 w-px bg-[#d1e0d9] hidden sm:block"></div>
                
                <DialogDescription className="text-[11px] text-[#7a9c8a] font-black uppercase tracking-widest m-0 flex items-center gap-2 whitespace-nowrap">
                  <span>ID:</span>
                  <span className="font-mono text-[#2d5a42] bg-[#eff6f3] px-2.5 py-1 rounded-md border border-[#d1e0d9]/60">
                    {selectedBooking?.id}
                  </span>
                </DialogDescription>

                {/* Custom Status Badge Next to ID */}
                {selectedBooking && (
                  <div className="flex items-center gap-3 shrink-0 ml-1">
                    {(() => {
                      const norm = (selectedBooking.status || "").toLowerCase();
                      if (norm === "pending" || norm === "pending approval") {
                        return (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#fffbeb] text-[#92400e] border border-[#fde68a] shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Review Required
                          </span>
                        );
                      } else if (norm === "approved" || norm === "upcoming" || norm === "session confirmed") {
                        return (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#d6eee9] text-[#0a2e1f] border border-[#b8d8d1] shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Approved & Active
                          </span>
                        );
                      } else if (norm === "completed") {
                        return (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#e7f5ef] text-[#065f46] border border-[#34d399]/40 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                            Fully Completed
                          </span>
                        );
                      } else if (norm === "cancelled" || norm === "rejected") {
                        return (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Cancelled
                          </span>
                        );
                      } else {
                        return (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-700 border border-gray-200 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                            {selectedBooking.status}
                          </span>
                        );
                      }
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Main Body */}
          {selectedBooking && (
            <div className="flex-1 px-8 py-8 overflow-y-auto space-y-6 custom-modal-scrollbar" style={{ maxHeight: "calc(90vh - 160px)" }}>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* LEFT COLUMN: User Info & Payment Details */}
                <div className="md:col-span-6 space-y-6">
                  
                  {/* User Information Card */}
                  <div className="bg-[#f8faf9]/80 backdrop-blur-md p-6 rounded-[24px] border border-[#dceae2]/70 shadow-[0_8px_30px_rgb(0,0,0,0.015)] relative overflow-hidden group hover:border-[#b8d8d1] transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <h3 className="font-extrabold text-[12px] uppercase tracking-widest text-[#0a2e1f] mb-5 flex items-center gap-2.5">
                      <span className="bg-[#eff6f3] p-1.5 rounded-lg text-[#2d5a42] border border-[#dceae2]/50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      </span>
                      User Information
                    </h3>
                    
                    <div className="space-y-4 text-[13px]">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#96b0a4]">Full Name</span>
                          <span className="text-[#0a2e1f] font-extrabold mt-1 text-[14px]">{selectedBooking.userName}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#96b0a4]">User Type</span>
                          <span className="text-[#2d5a42] font-semibold mt-1">
                            {selectedBooking.userEmail === 'guest@nirvaha.com' ? 'Walk-in Guest' : 'Registered Member'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#96b0a4]">Email Address</span>
                        <span className="text-[#0a2e1f] font-bold mt-1 break-all">{selectedBooking.userEmail}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#96b0a4]">Contact Phone</span>
                          <span className="text-[#0a2e1f] font-bold mt-1">
                            {selectedBooking.phone && selectedBooking.phone !== "N/A" ? selectedBooking.phone : "+91 98480 22338"}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#96b0a4]">Primary Goal</span>
                          <span className="text-[#2d5a42] font-semibold mt-1">Stress & Sleep Support</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Companion Information (Render only if session/retreat has companion name or exists) */}
                  {selectedBooking.type !== "Product" && (
                    <div className="bg-[#f8faf9]/80 backdrop-blur-md p-6 rounded-[24px] border border-[#dceae2]/70 shadow-[0_8px_30px_rgb(0,0,0,0.015)] relative overflow-hidden group hover:border-[#b8d8d1] transition-all duration-300">
                      <h3 className="font-extrabold text-[12px] uppercase tracking-widest text-[#0a2e1f] mb-5 flex items-center gap-2.5">
                        <span className="bg-[#eff6f3] p-1.5 rounded-lg text-[#2d5a42] border border-[#dceae2]/50">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </span>
                        Companion Information
                      </h3>
                      
                      <div className="space-y-4 text-[13px]">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#96b0a4]">Companion Name</span>
                            <span className="text-[#0a2e1f] font-extrabold mt-1 text-[14px]">
                              {selectedBooking.companionName || "No companion assigned"}
                            </span>
                          </div>
                          {selectedBooking.companionEmail && (
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#96b0a4]">Companion Email</span>
                              <span className="text-[#2d5a42] font-semibold mt-1 break-all">{selectedBooking.companionEmail}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Details Card */}
                  <div className="bg-[#f8faf9]/80 backdrop-blur-md p-6 rounded-[24px] border border-[#dceae2]/70 shadow-[0_8px_30px_rgb(0,0,0,0.015)] relative overflow-hidden group hover:border-[#b8d8d1] transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <h3 className="font-extrabold text-[12px] uppercase tracking-widest text-[#0a2e1f] mb-5 flex items-center gap-2.5">
                      <span className="bg-[#eff6f3] p-1.5 rounded-lg text-[#2d5a42] border border-[#dceae2]/50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                      </span>
                      Payment Details
                    </h3>
                    
                    <div className="space-y-4 text-[13px]">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#96b0a4]">Unit Price</span>
                          <span className="text-[#0a2e1f] font-bold mt-1">₹{selectedBooking.price}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#96b0a4]">Quantity</span>
                          <span className="text-[#0a2e1f] font-bold mt-1">{selectedBooking.quantity || 1}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#d1e0d9]/40 flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#96b0a4]">Total Amount</span>
                          <span className="text-[#0a2e1f] text-[22px] font-black mt-0.5">₹{(selectedBooking.price || 0) * (selectedBooking.quantity || 1)}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#96b0a4] mb-1.5">Payment Status</span>
                          {(() => {
                            const norm = (selectedBooking.paymentStatus || "").toLowerCase();
                            if (norm === "paid") {
                              return (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#d6eee9] text-[#0a2e1f] border border-[#b8d8d1]">
                                  Paid ✓
                                </span>
                              );
                            } else {
                              return (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200">
                                  {selectedBooking.paymentStatus || "Pending"}
                                </span>
                              );
                            }
                          })()}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#96b0a4]">Payment Method</span>
                          <span className="text-[#2d5a42] font-semibold mt-1">UPI QR Code</span>
                        </div>
                        {selectedBooking.type === "Product" && (
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#96b0a4]">Delivery Status</span>
                            <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-black uppercase text-[#2d9f68]">
                              🚚 {selectedBooking.deliveryStatus || "Processing"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                </div>

                {/* RIGHT COLUMN: Booking Information & Timeline */}
                <div className="md:col-span-6 space-y-6">
                  
                  {/* Booking Specifications Card */}
                  <div className="bg-[#f8faf9]/80 backdrop-blur-md p-6 rounded-[24px] border border-[#dceae2]/70 shadow-[0_8px_30px_rgb(0,0,0,0.015)] relative overflow-hidden group hover:border-[#b8d8d1] transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <h3 className="font-extrabold text-[12px] uppercase tracking-widest text-[#0a2e1f] mb-5 flex items-center gap-2.5">
                      <span className="bg-[#eff6f3] p-1.5 rounded-lg text-[#2d5a42] border border-[#dceae2]/50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
                      </span>
                      Booking Information
                    </h3>

                    <div className="space-y-4 text-[13px]">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#96b0a4]">Reserved Item / Companion</span>
                        <span className="text-[#0a2e1f] font-extrabold mt-1 text-[16px] leading-tight">
                          {selectedBooking.companionName}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#96b0a4] mb-1.5">Booking Type</span>
                          <span className={`inline-flex w-fit px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest border shadow-sm ${selectedBooking.type === 'video' ? 'bg-[#f0f9f4] text-[#2d9f68] border-[#c2e5d3]' : selectedBooking.type === 'chat' ? 'bg-[#f0f7ff] text-[#3b82f6] border-[#bfdbfe]' : selectedBooking.type === 'retreat' ? 'bg-[#fffbf0] text-[#b4890c] border-[#fde68a]' : 'bg-[#fbf7ff] text-[#9333ea] border-[#e9d5ff]'}`}>
                            {selectedBooking.type}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#96b0a4] mb-1.5">Access Platform</span>
                          <span className="w-fit text-[#4a7c65] font-semibold bg-white px-2 py-0.5 rounded-md border border-[#dceae2] shadow-sm text-[11px] capitalize">
                            {selectedBooking.platform || "Online"}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#d1e0d9]/40 grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#96b0a4]">Scheduled Date</span>
                          <span className="text-[#0a2e1f] font-bold mt-1">{selectedBooking.date}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#96b0a4]">Scheduled Time</span>
                          <span className="text-[#2d5a42] font-semibold mt-1">{selectedBooking.time}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#96b0a4]">Session Duration</span>
                          <span className="text-[#0a2e1f] font-bold mt-1">{selectedBooking.duration || 60} minutes</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#96b0a4]">Timezone</span>
                          <span className="text-[#2d5a42] font-semibold mt-1">Indian Standard Time (IST)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Session Notes Card */}
                  {selectedBooking.sessionNotes && selectedBooking.sessionNotes !== "" && (
                    <div className="bg-[#f8faf9]/80 backdrop-blur-md p-6 rounded-[24px] border border-[#dceae2]/70 shadow-[0_8px_30px_rgb(0,0,0,0.015)] relative overflow-hidden group hover:border-[#b8d8d1] transition-all duration-300">
                      <h3 className="font-extrabold text-[12px] uppercase tracking-widest text-[#0a2e1f] mb-3 flex items-center gap-2.5">
                        <span className="bg-[#eff6f3] p-1.5 rounded-lg text-[#2d5a42] border border-[#dceae2]/50">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </span>
                        Session Notes / Message
                      </h3>
                      <p className="text-teal-900/80 italic text-[13px] bg-white/60 p-4 rounded-xl border border-[#dceae2] font-medium leading-relaxed">
                        "{selectedBooking.sessionNotes}"
                      </p>
                    </div>
                  )}

                  {/* Dynamic Status Progress Timeline */}
                  <div className="bg-[#f8faf9]/80 backdrop-blur-md p-6 rounded-[24px] border border-[#dceae2]/70 shadow-[0_8px_30px_rgb(0,0,0,0.015)] relative overflow-hidden group hover:border-[#b8d8d1] transition-all duration-300">
                    <h3 className="font-extrabold text-[12px] uppercase tracking-widest text-[#0a2e1f] mb-5 flex items-center gap-2.5">
                      <span className="bg-[#eff6f3] p-1.5 rounded-lg text-[#2d5a42] border border-[#dceae2]/50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                      </span>
                      Tracking Timeline
                    </h3>

                    <div className="relative pl-6 border-l border-emerald-200/60 ml-3 space-y-5 text-[13px]">
                      
                      {/* Step 1 */}
                      <div className="relative">
                        <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm flex items-center justify-center" />
                        <div className="flex flex-col">
                          <span className="font-bold text-[#0a2e1f]">Booking Registered</span>
                          <span className="text-[10px] text-[#7a9c8a] mt-0.5 font-bold uppercase tracking-wide">
                            {new Date(selectedBooking.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>

                      {/* Step 2 (Conditional) */}
                      <div className="relative">
                        <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${selectedBooking.status === 'completed' || selectedBooking.status === 'upcoming' || selectedBooking.status === 'Session Confirmed' ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                        <div className="flex flex-col">
                          <span className="font-bold text-[#0a2e1f]">
                            {selectedBooking.status === 'pending' || selectedBooking.status === 'Pending Approval' ? 'Verification in Progress' : 'Approved by Concierge'}
                          </span>
                          <span className="text-[11px] text-[#6a8c7a] mt-0.5 font-medium">
                            {selectedBooking.status === 'pending' || selectedBooking.status === 'Pending Approval'
                              ? 'Admin approval is requested to confirm availability.' 
                              : 'Spot successfully reserved & verified.'}
                          </span>
                        </div>
                      </div>

                      {/* Step 3 (Completed) */}
                      {selectedBooking.status === 'completed' && (
                        <div className="relative">
                          <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 border-4 border-white shadow-sm flex items-center justify-center" />
                          <div className="flex flex-col">
                            <span className="font-bold text-[#065f46]">Fully Completed</span>
                            <span className="text-[11px] text-[#6a8c7a] mt-0.5 font-medium">
                              Wellness session has finished and reports logged.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* Footer Actions */}
          <div className="bg-[#f8faf9] border-t border-[#dceae2]/70 px-8 py-5">
             <DialogFooter className="flex w-full justify-between sm:justify-between items-center gap-4">
               
               {/* Left Side: Close */}
               <Button 
                  variant="outline" 
                  onClick={() => setIsViewModalOpen(false)}
                  className="bg-white border-[#dceae2] text-[#4a7c65] hover:bg-[#f0f9f4] hover:text-[#1a3d2f] font-bold rounded-full px-8 h-12 shadow-sm transition-all hover:scale-102 active:scale-98"
               >
                 Close
               </Button>
               
               {/* Right Side: Admin Operations */}
               <div className="flex gap-3">
                 {(selectedBooking?.status === "Pending Approval" || selectedBooking?.status === "pending") && (
                   <>
                     <Button
                       onClick={() => {
                         setIsViewModalOpen(false);
                         handleAction("reject", selectedBooking);
                       }}
                       className="bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 font-bold rounded-full px-6 h-12 shadow-sm transition-all hover:scale-102 active:scale-98"
                     >
                       Reject Session
                     </Button>
                     <Button
                       className="bg-[#4EAA77] hover:bg-[#3C9162] text-white font-bold rounded-full px-8 h-12 shadow-md hover:shadow-[0_0_20px_rgba(90,191,136,0.3)] transition-all duration-300 hover:scale-102 active:scale-98"
                       onClick={() => {
                         setIsViewModalOpen(false);
                         handleAction("accept", selectedBooking);
                       }}
                     >
                       Accept Session
                     </Button>
                   </>
                 )}
                 {(selectedBooking?.status === "upcoming" || selectedBooking?.status === "Session Confirmed") && (
                   <>
                     <Button
                       onClick={() => {
                         setIsViewModalOpen(false);
                         handleAction("cancel", selectedBooking);
                       }}
                       className="bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 font-bold rounded-full px-6 h-12 shadow-sm transition-all hover:scale-102 active:scale-98"
                     >
                       Cancel Booking
                     </Button>
                     <Button
                       className="bg-gradient-to-r from-[#0a2e1f] to-[#124530] hover:from-[#0d3b28] hover:to-[#165a3f] text-white font-bold rounded-full px-8 h-12 shadow-md hover:shadow-[0_0_20px_rgba(90,191,136,0.3)] transition-all duration-300 hover:scale-102 active:scale-98"
                       onClick={() => {
                         setIsViewModalOpen(false);
                         handleAction("complete", selectedBooking);
                       }}
                     >
                       Mark Completed
                     </Button>
                   </>
                 )}
               </div>
               
             </DialogFooter>
          </div>
          
          {/* Custom Inner Thin Scrollbar Styles */}
          <style>{`
            .custom-modal-scrollbar::-webkit-scrollbar {
              width: 5px;
            }
            .custom-modal-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-modal-scrollbar::-webkit-scrollbar-thumb {
              background: #e1ede6;
              border-radius: 10px;
            }
            .custom-modal-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #d1e0d7;
            }
          `}</style>
        </DialogContent>
      </Dialog>

      {/* Confirm Modal */}
      <ConfirmModal
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={
          confirmAction
            ? confirmAction.type === "accept"
              ? "Accept Session Booking"
              : confirmAction.type === "reject"
              ? "Reject Session Booking"
              : `${confirmAction.type.charAt(0).toUpperCase()}${confirmAction.type.slice(1)} Booking`
            : "Confirm"
        }
        description={
          confirmAction
            ? `Are you sure you want to ${
                confirmAction.type === "accept"
                  ? "accept"
                  : confirmAction.type === "reject"
                  ? "reject"
                  : confirmAction.type
              } booking ${confirmAction.booking.id}?`
            : ""
        }
        confirmText={
          confirmAction?.type === "complete"
            ? "Mark Completed"
            : confirmAction?.type === "accept"
            ? "Accept Session"
            : confirmAction?.type === "reject"
            ? "Reject Session"
            : confirmAction?.type === "cancel"
            ? "Cancel Booking"
            : "Confirm"
        }
        onConfirm={confirmActionHandler}
        variant={confirmAction?.type === "cancel" || confirmAction?.type === "reject" ? "destructive" : "default"}
      />
    </div>
  );
}
