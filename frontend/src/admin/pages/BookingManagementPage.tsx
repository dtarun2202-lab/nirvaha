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
  type: "Chat" | "Video";
  platform: string;
  date: string;
  time: string;
  duration: number; // in minutes
  status: "upcoming" | "completed" | "cancelled" | "in-progress";
  price: number;
  createdAt: string;
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
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "cancel" | "complete";
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
          ? data.map((booking: any) => {
              let parsedType = booking.type ? String(booking.type).toLowerCase() : "session";
              if (parsedType === "video") parsedType = "Video";
              else if (parsedType === "chat") parsedType = "Chat";
              else if (parsedType === "retreat") parsedType = "Retreat";
              else if (parsedType === "product") parsedType = "Product";
              else parsedType = "Session";

              let parsedPlatform = String(booking.platform || "Online");
              let parsedDate = String(booking.date || booking.createdAt || "");
              let parsedTime = String(booking.time || "");

              // Fix messy data where platform contains the time
              const platformLower = parsedPlatform.toLowerCase();
              if (platformLower.includes("ist") || platformLower.includes("am") || platformLower.includes("pm") || platformLower.includes("tomorrow") || platformLower.includes("today")) {
                parsedTime = parsedPlatform;
                parsedPlatform = "Online";
              }
              if (!parsedPlatform) parsedPlatform = "Online";

              // Clean up ISO dates
              if (parsedDate.includes("T") && parsedDate.endsWith("Z")) {
                const d = new Date(parsedDate);
                if (!isNaN(d.getTime())) {
                  parsedDate = d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
                  if (!parsedTime || parsedTime === "Online") {
                    parsedTime = d.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
                  }
                }
              }

              return {
                id: booking.id || booking._id || "",
                userId: booking.userId || "",
                userName: booking.userName || booking.name || "Guest",
                userEmail: booking.userEmail || booking.email || "N/A",
                companionId: booking.companionId || booking.itemId || "",
                companionName: booking.companionName || booking.itemName || booking.companion || "Unknown",
                companionEmail: booking.companionEmail || "",
                type: parsedType,
                platform: parsedPlatform,
                date: parsedDate,
                time: parsedTime,
                duration: typeof booking.duration === "number" ? booking.duration : (parseInt(booking.duration) || 0),
                status: booking.status || "upcoming",
                price: Number(booking.price || 0),
                createdAt: booking.createdAt || new Date().toISOString(),
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

    return () => {
      socket.off("booking-created");
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
    setConfirmAction({ type: type as "cancel" | "complete", booking });
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

  const confirmActionHandler = () => {
    if (!confirmAction) return;
    setBookings((prev) =>
      prev.map((b) =>
        b.id === confirmAction.booking.id
          ? { ...b, status: confirmAction.type === "cancel" ? "cancelled" : "completed" }
          : b
      )
    );
    setConfirmAction(null);
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
            <div className="relative md:col-span-2">
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-medium bg-white border border-[#BEE4CD] text-[#295641] hover:bg-[#F6FDF8] rounded-xl h-12",
                    !dateFrom && "text-[#86CDA6]"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? (
                    dateTo ? `${formatDate(dateFrom)} - ${formatDate(dateTo)}` : formatDate(dateFrom)
                  ) : <span>Date Range</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white border-[#BEE4CD] rounded-xl">
                <div className="p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div>
                      <label className="text-sm font-bold text-[#1F4131] mb-2 block">From</label>
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        className="rounded-lg border border-[#D5EEDD]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-[#1F4131] mb-2 block">To</label>
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        className="rounded-lg border border-[#D5EEDD]"
                      />
                    </div>
                  </div>
                  {(dateFrom || dateTo) && (
                    <Button 
                      variant="outline" 
                      className="w-full text-[#E76E6E] hover:text-red-700 hover:bg-red-50 border-[#F8CACA] font-bold rounded-lg"
                      onClick={() => { setDateFrom(undefined); setDateTo(undefined); }}
                    >
                      Clear Dates
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
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
              <div className="grid grid-cols-12 gap-4 bg-gradient-to-r from-[#B9EBD1] to-[#D5F2D9] p-5 text-xs font-bold text-[#1A4F35] tracking-widest uppercase rounded-t-2xl">
                <div className="col-span-2 pl-2">Booking ID</div>
                <div className="col-span-2">User</div>
                <div className="col-span-2">Companion</div>
                <div className="col-span-2">Type / Platform</div>
                <div className="col-span-2">Date & Time</div>
                <div className="col-span-1">Price</div>
                <div className="col-span-1 text-right pr-4">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-[#E6F5EB]">
                {filteredBookings.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-[#F6FDF8] transition-colors">
                    {/* ID */}
                    <div className="col-span-2 pl-2">
                      <span className="font-mono text-xs font-medium text-[#295641] bg-[#EAFBF0] px-2 py-1 rounded border border-[#BDE8CE]">{item.id.substring(0, 8)}...</span>
                    </div>
                    {/* User */}
                    <div className="col-span-2">
                      <div className="font-medium text-[#2A4939] text-sm">{item.userName}</div>
                      <div className="text-xs text-[#64C08E] font-medium truncate" title={item.userEmail}>{item.userEmail}</div>
                    </div>
                    {/* Companion */}
                    <div className="col-span-2">
                      <div className="font-medium text-[#2A4939] text-sm">{item.companionName || "-"}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={item.status} variant="booking" />
                      </div>
                    </div>
                    {/* Type & Platform */}
                    <div className="col-span-2">
                       <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-1 ${item.type === 'video' ? 'bg-[#EAFBF0] text-[#34A46B]' : item.type === 'chat' ? 'bg-[#EBF5FF] text-[#3B82F6]' : item.type === 'retreat' ? 'bg-[#FAF2CD] text-[#9A7D11]' : 'bg-[#F3E8FF] text-[#9333EA]'}`}>
                          {item.type}
                       </span>
                       <div className="text-xs text-gray-500 font-semibold capitalize">{item.platform}</div>
                    </div>
                    {/* Date & Time */}
                    <div className="col-span-2">
                       <div className="font-medium text-[#2A4939] text-sm">{item.date}</div>
                       <div className="text-xs text-gray-500 font-semibold mt-1">
                         {item.time} {item.duration ? `(${item.duration} min)` : ''}
                       </div>
                    </div>
                    {/* Price */}
                    <div className="col-span-1 font-medium text-gray-800">
                      ₹{item.price}
                    </div>
                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-end pr-2">
                       <ActionMenu
                          variant="booking"
                          onView={() => handleView(item)}
                          onCancel={() => handleAction("cancel", item)}
                          onComplete={() => handleAction("complete", item)}
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
        <DialogContent className="max-w-2xl bg-[#F4FAF6] border-[#D5EEDD] rounded-3xl p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
          <div className="bg-gradient-to-r from-[#B9EBD1] to-[#D5F2D9] px-6 py-5 border-b border-[#A7E2C3]">
             <DialogHeader>
               <DialogTitle className="text-xl font-bold text-[#1F4131]">Booking Details</DialogTitle>
               <DialogDescription className="text-[#2A4939] font-medium text-xs font-mono bg-[#EAFBF0] self-start px-2 py-0.5 rounded border border-[#BDE8CE] mt-2">
                 ID: {selectedBooking?.id}
               </DialogDescription>
             </DialogHeader>
          </div>
          
          {selectedBooking && (
            <div className="px-6 py-5 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* User Information */}
                <div className="bg-white p-5 rounded-2xl border border-[#D5EEDD] shadow-sm">
                  <h3 className="font-bold text-[#1F4131] mb-3 flex items-center gap-2 border-b border-[#EAFBF0] pb-2">
                     <span className="bg-[#EAFBF0] p-1.5 rounded-lg text-[#34A46B]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                     </span>
                     User Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-bold text-[#2A4939] mr-1">Name:</span> <span className="text-[#329D66] font-medium">{selectedBooking.userName}</span></p>
                    <p><span className="font-bold text-[#2A4939] mr-1">Email:</span> <span className="text-[#329D66] font-medium break-all">{selectedBooking.userEmail}</span></p>
                    <p><span className="font-bold text-[#2A4939] mr-1">User ID:</span> <span className="text-[#329D66] font-medium font-mono text-xs">{selectedBooking.userId}</span></p>
                  </div>
                </div>

                {/* Companion Information */}
                <div className="bg-white p-5 rounded-2xl border border-[#D5EEDD] shadow-sm">
                  <h3 className="font-bold text-[#1F4131] mb-3 flex items-center gap-2 border-b border-[#EAFBF0] pb-2">
                     <span className="bg-[#EAFBF0] p-1.5 rounded-lg text-[#34A46B]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                     </span>
                     Companion Info
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-bold text-[#2A4939] mr-1">Name:</span> <span className="text-[#329D66] font-medium">{selectedBooking.companionName || "-"}</span></p>
                    {selectedBooking.companionEmail && (
                      <p><span className="font-bold text-[#2A4939] mr-1">Email:</span> <span className="text-[#329D66] font-medium break-all">{selectedBooking.companionEmail}</span></p>
                    )}
                    {selectedBooking.companionId && (
                      <p><span className="font-bold text-[#2A4939] mr-1">ID:</span> <span className="text-[#329D66] font-medium font-mono text-xs">{selectedBooking.companionId}</span></p>
                    )}
                  </div>
                </div>
              </div>

              {/* Session Details */}
              <div className="bg-white p-5 rounded-2xl border border-[#D5EEDD] shadow-sm">
                <h3 className="font-bold text-[#1F4131] mb-3 flex items-center gap-2 border-b border-[#EAFBF0] pb-2">
                   <span className="bg-[#EAFBF0] p-1.5 rounded-lg text-[#34A46B]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
                   </span>
                   Session Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                  <div className="space-y-3">
                    <div>
                      <p className="font-bold text-[#2A4939] text-xs uppercase tracking-wider mb-1">Type & Platform</p>
                      <div className="flex items-center gap-2">
                         <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${selectedBooking.type === 'video' ? 'bg-[#EAFBF0] text-[#34A46B]' : selectedBooking.type === 'chat' ? 'bg-[#EBF5FF] text-[#3B82F6]' : selectedBooking.type === 'retreat' ? 'bg-[#FAF2CD] text-[#9A7D11]' : 'bg-[#F3E8FF] text-[#9333EA]'}`}>
                            {selectedBooking.type}
                         </span>
                         <span className="text-[#64C08E] font-semibold bg-[#F6FDF8] px-2 py-0.5 rounded border border-[#EAFBF0] capitalize">{selectedBooking.platform}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-[#2A4939] text-xs uppercase tracking-wider mb-1">Price</p>
                      <p className="text-xl font-bold text-[#1F4131]">₹{selectedBooking.price}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="font-bold text-[#2A4939] text-xs uppercase tracking-wider mb-1">Date & Time</p>
                      <p className="text-[#329D66] font-bold">{selectedBooking.date}</p>
                      <p className="text-[#64C08E] font-medium text-xs mt-0.5">{selectedBooking.time}</p>
                    </div>
                    <div>
                      <p className="font-bold text-[#2A4939] text-xs uppercase tracking-wider mb-1">Duration</p>
                      <p className="text-[#329D66] font-medium">{selectedBooking.duration || 0} minutes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="flex items-center justify-between bg-[#F6FDF8] p-4 rounded-xl border border-[#D5EEDD]">
                <h3 className="font-bold text-[#2A4939]">Current Status</h3>
                <StatusBadge status={selectedBooking.status} variant="booking" />
              </div>
            </div>
          )}

          <div className="bg-white border-t border-[#D5EEDD] p-5">
             <DialogFooter className="flex w-full justify-between sm:justify-between items-center">
               <Button 
                  variant="outline" 
                  onClick={() => setIsViewModalOpen(false)}
                  className="bg-white border-[#BEE4CD] text-[#295641] hover:bg-[#F6FDF8] font-bold rounded-xl"
               >
                 Close
               </Button>
               <div className="flex gap-2">
                 {selectedBooking?.status === "upcoming" && (
                   <>
                     <Button
                       onClick={() => {
                         setIsViewModalOpen(false);
                         handleAction("cancel", selectedBooking);
                       }}
                       className="bg-white border border-[#F8CACA] text-[#E76E6E] hover:bg-red-50 hover:border-red-200 font-bold rounded-xl"
                     >
                       Cancel Booking
                     </Button>
                     <Button
                       className="bg-[#4EAA77] hover:bg-[#3C9162] text-white font-bold rounded-xl shadow-sm"
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
        </DialogContent>
      </Dialog>

      {/* Confirm Modal */}
      <ConfirmModal
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={
          confirmAction
            ? `${confirmAction.type.charAt(0).toUpperCase()}${confirmAction.type.slice(1)} Booking`
            : "Confirm"
        }
        description={
          confirmAction
            ? `Are you sure you want to ${confirmAction.type} booking ${confirmAction.booking.id}?`
            : ""
        }
        confirmText={confirmAction?.type === "complete" ? "Mark Completed" : "Confirm"}
        onConfirm={confirmActionHandler}
        variant={confirmAction?.type === "cancel" ? "destructive" : "default"}
      />
    </div>
  );
}

