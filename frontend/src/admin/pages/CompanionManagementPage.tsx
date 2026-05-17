import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  deleteCompanionApplication,
  getCompanionApplications,
  updateCompanionApplication,
  updateCompanionStatus,
} from "@/lib/companionApi";
import { AdminTable } from "@/admin/components/AdminTable";
import { StatusBadge } from "@/admin/components/StatusBadge";
import { ConfirmModal } from "@/admin/components/ConfirmModal";
import { useSocket } from "@/contexts/SocketContext";
import BACKEND_CONFIG from "@/config/backend";
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
import { Search, Star, CheckCircle, XCircle, Trash2, Pencil, RotateCw } from "lucide-react";

interface Companion {
  id: string;
  name: string;
  email: string;
  expertise: string;
  specialties: string[];
  languages: string[];
  rating: number;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  bio: string;
  profileImage?: string;
  coverImage?: string;
  location?: string;
  pricing: {
    chat: number;
    video: number;
  };
  availability: string[];
}

const INITIAL_COMPANIONS: Companion[] = [];

export function CompanionManagementPage() {
  const { socket } = useSocket();
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [companions, setCompanions] = useState<Companion[]>(INITIAL_COMPANIONS);
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<{
    id: string;
    name: string;
    email: string;
    expertise: string;
    bio: string;
    specialties: string;
    languages: string;
    status: Companion["status"];
    pricingChat: number;
    pricingVideo: number;
    availability: string;
    profileImage?: string;
    coverImage?: string;
    location?: string;
  } | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "reject" | "delete";
    companion: Companion;
  } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [companionBookings, setCompanionBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const loadApplications = async () => {
    try {
      const applications = await getCompanionApplications("all");
      setCompanions([...applications, ...INITIAL_COMPANIONS]);
    } catch (error) {
      console.error('❌ [ADMIN-COMPANION] Failed to load:', error);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("new-companion-request", () => {
      loadApplications();
    });

    return () => {
      socket.off("new-companion-request");
    };
  }, [socket]);

  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredCompanions = useMemo(
    () =>
      companions.filter((companion) => {
        const matchesFilter = filter === "all" || companion.status === filter;
        const matchesSearch =
          companion.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          companion.expertise.toLowerCase().includes(debouncedQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      }),
    [companions, filter, debouncedQuery]
  );

  const handleView = async (companion: Companion) => {
    setSelectedCompanion(companion);
    setIsViewModalOpen(true);
    setBookingsLoading(true);
    setCompanionBookings([]);
    try {
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/bookings`);
      if (response.ok) {
        const bookingsData = await response.json();
        const filtered = Array.isArray(bookingsData)
          ? bookingsData.filter((booking: any) => {
              const matchesName = booking.companionName && booking.companionName.toLowerCase() === companion.name.toLowerCase();
              const matchesId = booking.companionId === companion.id || booking.itemId === companion.id;
              return matchesName || matchesId;
            })
          : [];
        setCompanionBookings(filtered);
      }
    } catch (err) {
      console.error("Error loading companion bookings:", err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleEdit = (companion: Companion) => {
    setEditForm({
      id: companion.id,
      name: companion.name,
      email: companion.email,
      expertise: companion.expertise,
      bio: companion.bio,
      specialties: companion.specialties.join(", "),
      languages: companion.languages.join(", "),
      status: companion.status,
      pricingChat: companion.pricing.chat,
      pricingVideo: companion.pricing.video,
      availability: companion.availability.join(", "),
      profileImage: (companion as any).profileImage || "",
      coverImage: (companion as any).coverImage || "",
      location: (companion as any).location || "",
    });
    setIsEditModalOpen(true);
  };

  const openConfirm = (type: "approve" | "reject" | "delete", companion: Companion) => {
    setConfirmAction({ type, companion });
  };

  const confirmActionHandler = async () => {
    if (!confirmAction) return;
    try {
      if (confirmAction.type === "delete") {
        await deleteCompanionApplication(confirmAction.companion.id);
        setCompanions((prev) => prev.filter((c) => c.id !== confirmAction.companion.id));
      } else {
        const status = confirmAction.type === "approve" ? "approved" : "rejected";
        const updated = await updateCompanionStatus(confirmAction.companion.id, status);
        setCompanions((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      }
    } catch (error) {
      console.error('Failed to update companion application:', error);
    } finally {
      setConfirmAction(null);
    }
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (item: Companion) => (
        <div>
          <div className="font-medium text-black">{item.name}</div>
          <div className="text-sm text-gray-700">{item.email}</div>
        </div>
      ),
    },
    {
      key: "expertise",
      header: "Expertise",
    },
    {
      key: "rating",
      header: "Rating",
      render: (item: Companion) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-black">{item.rating}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Companion) => <StatusBadge status={item.status} variant="companion" />,
    },
    {
      key: "appliedDate",
      header: "Applied Date",
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: Companion) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all hover:scale-105"
            onClick={() => handleView(item)}
            title="View companion details & bookings"
          >
            View
          </button>
          <button
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#95d5b2] text-[#2d6a4f] hover:bg-[#A8E6CF] transition-all hover:scale-105"
            onClick={() => handleEdit(item)}
            title="Edit companion details"
          >
            Edit
          </button>
          <button
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#b7e4c7] bg-[#d8f3dc] text-[#1b4332] hover:bg-[#b7e4c7] transition-all hover:scale-105 flex items-center gap-1"
            onClick={() => openConfirm("approve", item)}
            disabled={item.status === "approved"}
            title="Approve companion application"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Approve
          </button>
          <button
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-200 text-amber-600 hover:bg-amber-50 transition-all hover:scale-105 flex items-center gap-1"
            onClick={() => openConfirm("reject", item)}
            disabled={item.status === "rejected"}
            title="Reject companion application"
          >
            <XCircle className="w-3.5 h-3.5" />
            Reject
          </button>
          <button
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-rose-200 text-rose-500 hover:bg-rose-50 transition-all hover:scale-105 flex items-center gap-1"
            onClick={() => openConfirm("delete", item)}
            title="Remove companion"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
        </div>
      ),
    },
  ];

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    console.log('🔄 [ADMIN] Manual refresh triggered');
    loadApplications();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="min-h-screen -m-6 p-6" style={{ background: "#F0FFF4" }}>
      <style>{`
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes bounce-slow { 0%, 100% { transform:translateY(-50%) scale(1); } 50% { transform:translateY(-65%) scale(1.1); } }
        .med-card { background:rgba(255,255,255,0.55); backdrop-filter:blur(8px); border-radius:16px; box-shadow:0 2px 16px rgba(82,183,136,0.12); border:1px solid #b7e4c7; }
        .med-btn-primary { background: linear-gradient(135deg,#52b788,#40916c); color:#fff; border:none; border-radius:10px; padding:9px 20px; font-weight:600; font-size:0.875rem; cursor:pointer; display:flex; align-items:center; gap:6px; transition:transform 0.15s,box-shadow 0.15s; box-shadow:0 2px 8px rgba(82,183,136,0.3); white-space:nowrap; }
        .med-btn-primary:hover { transform:scale(1.04); box-shadow:0 4px 16px rgba(82,183,136,0.45); }
        .med-btn-primary:disabled { opacity:0.6; transform:none; cursor:not-allowed; }
        .med-search-wrap { position:relative; width:100%; transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .med-search-wrap:focus-within { transform: scale(1.01); }
        .med-search-input { width:100%; border:2px solid #95d5b2; border-radius:18px; padding:15px 48px 15px 52px; font-size:1.05rem; background:rgba(255,255,255,0.8); color:#1b4332; outline:none; transition:all 0.3s; box-shadow:0 4px 12px rgba(82,183,136,0.08); }
        .med-search-input::placeholder { color:#95d5b2; }
        .med-search-input:focus { border-color:#52b788; box-shadow:0 0 0 5px rgba(82,183,136,0.15), 0 8px 30px rgba(82,183,136,0.12); background:#fff; }
        .med-search-icon { position:absolute; left:18px; top:50%; transform:translateY(-50%); color:#52b788; transition: all 0.3s; }
        .med-search-wrap:focus-within .med-search-icon { animation: bounce-slow 1s infinite ease-in-out; color: #40916c; }
        .med-clear-btn { position:absolute; right:15px; top:50%; transform:translateY(-50%); color:#95d5b2; cursor:pointer; padding:5px; border-radius:50%; transition:all 0.2s; }
        .med-clear-btn:hover { background:rgba(82,183,136,0.1); color:#52b788; transform:translateY(-50%) rotate(90deg); }
        .med-row:hover { background: #d8f3dc !important; }
        .med-badge-count { background:#52b788; color:white; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:700; }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8 text-[#2d6a4f]" />
            <div>
              <h1 className="text-2xl font-bold text-[#1b4332]">Companion Management</h1>
              <p className="text-sm text-[#74c69d]">Approve, reject, and manage companion applications</p>
            </div>
          </div>
          <button
            className="med-btn-primary"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        <div className="med-card p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="med-search-wrap flex-1">
              <Search className="med-search-icon w-6 h-6" />
              <input
                className="med-search-input"
                placeholder="Search by name or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="med-clear-btn"
                  onClick={() => setSearchQuery("")}
                  title="Clear search"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="w-full md:w-[200px]">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full bg-white/70 border-[#b7e4c7] text-[#1b4332] rounded-xl h-[50px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#b7e4c7]">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="med-card overflow-hidden">
          <AdminTable 
            data={filteredCompanions} 
            columns={columns} 
            onRowClick={handleView}
            emptyMessage="No companions found" 
          />
        </div>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCompanion?.name}'s Profile</DialogTitle>
            <DialogDescription>Complete companion application details</DialogDescription>
          </DialogHeader>
          {selectedCompanion && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Bio</h3>
                <p className="text-sm text-gray-600">{selectedCompanion.bio}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCompanion.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCompanion.languages.map((lang, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Chat Session</p>
                    <p className="text-lg font-semibold">₹{selectedCompanion.pricing.chat}/hr</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Video Session</p>
                    <p className="text-lg font-semibold">₹{selectedCompanion.pricing.video}/hr</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Availability</h3>
                <p className="text-sm text-gray-600">{selectedCompanion.availability.join(", ")}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedCompanion.status} variant="companion" />
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{selectedCompanion.rating}</span>
                </div>
              </div>

              {/* Companion Bookings Section */}
              <div className="border-t border-[#b7e4c7] pt-4 mt-6">
                <h3 className="font-bold text-[#1b4332] text-md mb-3">Sessions & Bookings</h3>
                {bookingsLoading ? (
                  <p className="text-sm text-[#40916c] animate-pulse">Loading bookings...</p>
                ) : companionBookings.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No session bookings recorded for this companion yet.</p>
                ) : (
                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                    {companionBookings.map((booking: any) => {
                      let parsedDate = String(booking.date || booking.createdAt || "");
                      if (parsedDate.includes("T") && parsedDate.endsWith("Z")) {
                        const d = new Date(parsedDate);
                        if (!isNaN(d.getTime())) {
                          parsedDate = d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
                        }
                      }
                      return (
                        <div key={booking.id || booking._id} className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 flex justify-between items-center text-sm">
                          <div>
                            <div className="font-semibold text-[#1b4332]">{booking.userName || 'Guest'}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{parsedDate} • {booking.time || 'N/A'} ({booking.platform || 'Video'})</div>
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <span className="text-xs font-bold text-[#2d6a4f] bg-emerald-100/70 px-2 py-0.5 rounded-full uppercase tracking-wider">{booking.status}</span>
                            <span className="text-xs font-bold text-gray-700">₹{booking.price || '1500'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            {selectedCompanion?.status === "pending" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    openConfirm("reject", selectedCompanion);
                  }}
                >
                  Reject
                </Button>
                <Button
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    openConfirm("approve", selectedCompanion);
                  }}
                >
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Companion</DialogTitle>
            <DialogDescription>Update companion profile details</DialogDescription>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Name</label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Expertise</label>
                  <Input
                    value={editForm.expertise}
                    onChange={(e) => setEditForm({ ...editForm, expertise: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Bio</label>
                <Input
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Specialties</label>
                  <Input
                    value={editForm.specialties}
                    onChange={(e) => setEditForm({ ...editForm, specialties: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Languages</label>
                  <Input
                    value={editForm.languages}
                    onChange={(e) => setEditForm({ ...editForm, languages: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Chat Price</label>
                  <Input
                    type="number"
                    value={editForm.pricingChat}
                    onChange={(e) =>
                      setEditForm({ ...editForm, pricingChat: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Video Price</label>
                  <Input
                    type="number"
                    value={editForm.pricingVideo}
                    onChange={(e) =>
                      setEditForm({ ...editForm, pricingVideo: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Availability</label>
                <Input
                  value={editForm.availability}
                  onChange={(e) => setEditForm({ ...editForm, availability: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <Select
                    value={editForm.status}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, status: value as Companion["status"] })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">pending</SelectItem>
                      <SelectItem value="approved">approved</SelectItem>
                      <SelectItem value="rejected">rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Location</label>
                  <Input
                    value={editForm.location || ""}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              onClick={async () => {
                if (!editForm) return;
                try {
                  const updated = await updateCompanionApplication(editForm.id, {
                    name: editForm.name,
                    email: editForm.email,
                    expertise: editForm.expertise,
                    bio: editForm.bio,
                    specialties: editForm.specialties,
                    languages: editForm.languages,
                    pricingChat: editForm.pricingChat,
                    pricingVideo: editForm.pricingVideo,
                    availability: editForm.availability,
                    status: editForm.status,
                    location: editForm.location,
                    profileImage: editForm.profileImage,
                    coverImage: editForm.coverImage,
                  });

                  setCompanions((prev) =>
                    prev.map((item) => (item.id === updated.id ? updated : item))
                  );
                  setIsEditModalOpen(false);
                } catch (error) {
                  console.error('Failed to update companion data:', error);
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={
          confirmAction
            ? `${confirmAction.type.charAt(0).toUpperCase()}${confirmAction.type.slice(1)} Companion`
            : "Confirm"
        }
        description={
          confirmAction
            ? confirmAction.type === "delete"
              ? `Are you sure you want to delete ${confirmAction.companion.name}?`
              : `Are you sure you want to ${confirmAction.type} ${confirmAction.companion.name}?`
            : ""
        }
        confirmText={
          confirmAction?.type === "approve"
            ? "Approve"
            : confirmAction?.type === "reject"
              ? "Reject"
              : "Delete"
        }
        onConfirm={confirmActionHandler}
        variant={confirmAction?.type === "delete" || confirmAction?.type === "reject" ? "destructive" : "default"}
      />
      </div>
    </div>
  );
}


