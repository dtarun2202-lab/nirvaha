import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminTable } from "@/admin/components/AdminTable";
import { ConfirmModal } from "@/admin/components/ConfirmModal";
import { Search, CheckCircle, Trash2, RotateCw } from "lucide-react";
import io from "socket.io-client";
import { BACKEND_CONFIG } from "@/config/backend";

const MARKETPLACE_REQUESTS_KEY = "nirvaha_marketplace_requests";

type MarketplaceRequest = {
  id: string;
  type: "session" | "retreat" | "product";
  status: "pending" | "approved";
  data: any;
  createdAt: number;
};

export function MarketplaceManagementPage() {
  const [requests, setRequests] = useState<MarketplaceRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "delete";
    request: MarketplaceRequest;
  } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const normalizeRequest = (item: any): MarketplaceRequest | null => {
    if (!item || typeof item !== "object") return null;
    const type = item.type === "session" || item.type === "retreat" || item.type === "product"
      ? item.type
      : "session";
    const status = item.status === "approved" ? "approved" : "pending";
    const createdAt = typeof item.createdAt === "number" ? item.createdAt : Date.now();
    const id = typeof item.id === "string" ? item.id : `${Date.now()}-${Math.random()}`;
    const data = item.data && typeof item.data === "object" ? item.data : {};

    return { id, type, status, data, createdAt };
  };

  const loadRequests = async () => {
    try {
      console.log('📥 [ADMIN] Fetching requests from backend API...');
      
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/marketplace/requests`);
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      
      const backendRequests = await response.json();
      console.log('✅ [ADMIN] Fetched:', backendRequests.length, 'items from backend');
      
      // Also load from localStorage as fallback
      const raw = localStorage.getItem(MARKETPLACE_REQUESTS_KEY);
      const localRequests = raw ? JSON.parse(raw) : [];
      
      // Merge and deduplicate: backend data takes precedence
      const backendIds = new Set(backendRequests.map((r: any) => r.id));
      const merged = [
        ...backendRequests,
        ...localRequests.filter((r: any) => !backendIds.has(r.id))
      ];
      
      let normalized = merged
        .map(normalizeRequest)
        .filter(Boolean) as MarketplaceRequest[];
      
      if (normalized.length === 0) {
        // Add default mock data for demonstration if empty
        normalized = [
          {
            id: `req-${Date.now()}-1`,
            type: "session",
            status: "pending",
            data: { title: "Guided Meditation Live" },
            createdAt: Date.now() - 86400000 * 2,
          },
          {
            id: `req-${Date.now()}-2`,
            type: "product",
            status: "pending",
            data: { title: "Yoga Mat Premium" },
            createdAt: Date.now() - 86400000 * 5,
          },
          {
            id: `req-${Date.now()}-3`,
            type: "retreat",
            status: "pending",
            data: { title: "Bali Wellness Retreat" },
            createdAt: Date.now() - 86400000 * 10,
          }
        ];
        localStorage.setItem(MARKETPLACE_REQUESTS_KEY, JSON.stringify(normalized));
      }

      console.log('📊 [ADMIN] Normalized & merged:', normalized.length, 'requests');
      setRequests(normalized);
    } catch (error) {
      console.error('Failed to load marketplace requests:', error);
      
      // Fallback to localStorage if API fails
      try {
        const raw = localStorage.getItem(MARKETPLACE_REQUESTS_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        let normalized = Array.isArray(parsed)
          ? parsed.map(normalizeRequest).filter(Boolean) as MarketplaceRequest[]
          : [];
          
        if (normalized.length === 0) {
          // Add default mock data for demonstration if empty
          normalized = [
            {
              id: `req-${Date.now()}-1`,
              type: "session",
              status: "pending",
              data: { title: "Guided Meditation Live" },
              createdAt: Date.now() - 86400000 * 2,
            },
            {
              id: `req-${Date.now()}-2`,
              type: "product",
              status: "pending",
              data: { title: "Yoga Mat Premium" },
              createdAt: Date.now() - 86400000 * 5,
            },
            {
              id: `req-${Date.now()}-3`,
              type: "retreat",
              status: "pending",
              data: { title: "Bali Wellness Retreat" },
              createdAt: Date.now() - 86400000 * 10,
            }
          ];
          localStorage.setItem(MARKETPLACE_REQUESTS_KEY, JSON.stringify(normalized));
        }
        
        setRequests(normalized);
      } catch {
        setRequests([]);
      }
    }
  };

  const saveRequests = (next: MarketplaceRequest[]) => {
    setRequests(next);
    try {
      localStorage.setItem(MARKETPLACE_REQUESTS_KEY, JSON.stringify(next));
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('marketplace-updated'));
    } catch {
      // Ignore storage errors
    }
  };

  useEffect(() => {
    loadRequests();
    
    // Set up Socket.IO connection for real-time updates
    const socket = io(BACKEND_CONFIG.SOCKET_BASE_URL);
    
    socket.on("marketplace-new-request", () => {
      console.log("📨 [SOCKET] New marketplace request received");
      loadRequests();
    });
    
    socket.on("marketplace-request-approved", () => {
      console.log("✅ [SOCKET] Marketplace request approved");
      loadRequests();
    });
    
    socket.on("marketplace-request-deleted", () => {
      console.log("🗑️ [SOCKET] Marketplace request deleted");
      loadRequests();
    });
    
    // Set up polling to check for new requests (fallback)
    const interval = setInterval(() => {
      loadRequests();
    }, 5000); // Reduce to 5 seconds for better UX
    
    // Listen for storage changes from other tabs
    const handleStorage = () => loadRequests();
    window.addEventListener("storage", handleStorage);
    
    // Listen for custom event from same tab
    const handleCustomUpdate = () => loadRequests();
    window.addEventListener("marketplace-updated", handleCustomUpdate);

    // Listen for BroadcastChannel updates from other tabs/windows
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("nirvaha-marketplace");
      channel.onmessage = () => loadRequests();
    } catch {
      channel = null;
    }
    
    // Reload when page becomes visible (tab switching)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadRequests();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Reload on focus/pageshow to avoid stale data
    const handleFocus = () => loadRequests();
    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handleFocus);
    
    return () => {
      clearInterval(interval);
      socket.disconnect();
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("marketplace-updated", handleCustomUpdate);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handleFocus);
      if (channel) {
        channel.close();
      }
    };
  }, []);

  const handleApprove = async (request: MarketplaceRequest) => {
    try {
      console.log('🔄 [ADMIN] Approving request:', request.id);
      
      // Attempt backend API call
      try {
        await fetch(
          `${BACKEND_CONFIG.API_BASE_URL}/api/marketplace/requests/${request.id}/approve`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ approvedBy: "admin" }),
          }
        );
      } catch (err) {
        console.warn("Backend unavailable or failed, proceeding with local update", err);
      }

      console.log('✅ [ADMIN] Approved:', request.id);
      
      // Update local state
      const next: MarketplaceRequest[] = requests.map((item) =>
        item.id === request.id ? { ...item, status: "approved" as const } : item
      );
      saveRequests(next);
    } catch (error) {
      console.error('❌ [ADMIN] Failed to approve request:', error);
      alert("Failed to approve item. Please try again.");
    }
  };

  const handleDelete = async (request: MarketplaceRequest) => {
    try {
      console.log('🗑️ [ADMIN] Deleting request:', request.id);
      
      // Attempt backend API call
      try {
        await fetch(
          `${BACKEND_CONFIG.API_BASE_URL}/api/marketplace/requests/${request.id}`,
          { method: "DELETE" }
        );
      } catch (err) {
        console.warn("Backend unavailable or failed, proceeding with local update", err);
      }

      console.log('✅ [ADMIN] Deleted:', request.id);
      
      // Update local state
      const next = requests.filter((item) => item.id !== request.id);
      saveRequests(next);
    } catch (error) {
      console.error('❌ [ADMIN] Failed to delete request:', error);
      alert("Failed to delete item. Please try again.");
    }
  };

  const filteredRequests = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const filtered = requests.filter((item) => {
      const title = item.data?.title || item.data?.name || "";
      const type = typeof item.type === "string" ? item.type : "";
      return title.toLowerCase().includes(query) || type.includes(query);
    });
    return filtered;
  }, [requests, searchQuery]);

  const columns = [
    {
      key: "title",
      header: "Title",
      render: (item: MarketplaceRequest) => (
        <div>
          <div className="font-medium text-black">
            {item.data?.title || item.data?.name || "Untitled"}
          </div>
          <div className="text-sm text-gray-600">{item.type}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: MarketplaceRequest) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold border ${
            item.status === "approved"
              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
              : "bg-amber-100 text-amber-700 border-amber-200"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Submitted",
      render: (item: MarketplaceRequest) => (
        <span className="text-gray-700">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: MarketplaceRequest) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1"
            onClick={() => setConfirmAction({ type: "approve", request: item })}
            disabled={item.status === "approved"}
          >
            <CheckCircle className="w-4 h-4" />
            Accept
          </Button>
          <Button
            size="sm"
            className="bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-1"
            onClick={() => setConfirmAction({ type: "delete", request: item })}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    console.log('🔄 [ADMIN] Manual refresh triggered by user');
    loadRequests();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="p-6 bg-[#F4FAF6] min-h-screen -m-6 rounded-tl-3xl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white border border-[#D5EEDD] rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#5ABF88] p-3 rounded-xl text-white shadow-sm">
                 <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-2xl font-bold text-[#1F4131]">Marketplace Requests</h2>
                 <p className="text-[#64C08E] text-sm font-semibold">{filteredRequests.length} requests total</p>
              </div>
            </div>
            <Button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="bg-[#EAFBF0] hover:bg-[#D5EEDD] text-[#34A46B] border border-[#BDE8CE] rounded-xl px-6 py-2.5 h-auto font-bold shadow-sm flex items-center gap-2 transition-colors"
            >
              <RotateCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative mt-2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#86CDA6]" />
              <Input
                placeholder="Search by title or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white border border-[#BEE4CD] text-[#295641] placeholder:text-[#86CDA6] rounded-xl h-14 w-full focus-visible:ring-[#5ABF88] font-medium"
              />
          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-2xl border border-[#D5EEDD] bg-white overflow-hidden shadow-sm">
           {/* Table Header */}
           <div className="grid grid-cols-12 gap-4 bg-gradient-to-r from-[#B9EBD1] to-[#D5F2D9] p-5 text-xs font-bold text-[#1A4F35] tracking-widest uppercase">
              <div className="col-span-5 pl-2">Title</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3">Submitted</div>
              <div className="col-span-2 text-right pr-4">Actions</div>
           </div>

           {/* Table Body */}
           <div className="divide-y divide-[#E6F5EB]">
              {filteredRequests.map((item) => (
                 <div key={item.id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-[#F6FDF8] transition-colors">
                    <div className="col-span-5 flex items-center gap-4">
                       <div className="bg-[#E4F6EB] p-2.5 rounded-lg text-[#40B075] shrink-0">
                          <CheckCircle className="w-5 h-5" />
                       </div>
                       <div>
                         <div className="font-medium text-[#2A4939] text-[15px]">
                           {item.data?.title || item.data?.name || "Untitled"}
                         </div>
                         <div className="text-sm text-[#64C08E] font-medium capitalize">{item.type}</div>
                       </div>
                    </div>
                    <div className="col-span-2">
                       <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${item.status === 'approved' ? 'bg-[#EAFBF0] text-[#34A46B]' : 'bg-[#FAF2CD] text-[#9A7D11]'}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                       </span>
                    </div>
                    <div className="col-span-3 text-gray-500 font-semibold text-sm">
                       {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-3 pr-2">
                       <button 
                         onClick={() => setConfirmAction({ type: "approve", request: item })}
                         disabled={item.status === "approved"}
                         className="px-4 py-1.5 text-xs font-bold text-[#3FB878] border border-[#BDE8CE] rounded-lg hover:bg-[#E8F8EE] transition-colors bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                       >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Accept
                       </button>
                       <button 
                         onClick={() => setConfirmAction({ type: "delete", request: item })} 
                         className="px-4 py-1.5 text-xs font-bold text-[#E76E6E] border border-[#F8CACA] rounded-lg hover:bg-red-50 transition-colors bg-white shadow-sm flex items-center gap-1"
                       >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                       </button>
                    </div>
                 </div>
              ))}
              {filteredRequests.length === 0 && (
                 <div className="p-12 text-center text-[#64C08E] font-medium text-lg">
                    No marketplace requests yet
                 </div>
              )}
           </div>
        </div>
      </div>

      <ConfirmModal
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={
          confirmAction
            ? `${confirmAction.type === "approve" ? "Accept" : "Delete"} Request`
            : "Confirm"
        }
        description={
          confirmAction
            ? confirmAction.type === "approve"
              ? `Accept ${confirmAction.request.data?.title || confirmAction.request.data?.name || "this request"}?`
              : `Delete ${confirmAction.request.data?.title || confirmAction.request.data?.name || "this request"}?`
            : ""
        }
        confirmText={confirmAction?.type === "approve" ? "Accept" : "Delete"}
        onConfirm={() => {
          if (!confirmAction) return;
          if (confirmAction.type === "approve") {
            handleApprove(confirmAction.request);
          } else {
            handleDelete(confirmAction.request);
          }
          setConfirmAction(null);
        }}
      />
    </div>
  );
}
