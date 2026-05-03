import React, { useEffect, useState, useCallback } from "react";
import BACKEND_CONFIG from "@/config/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AdminTable } from "@/admin/components/AdminTable";
import { ActionMenu } from "@/admin/components/ActionMenu";
import { Search, Mail, Building, Clock, RotateCw, Trash2, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmModal } from "@/admin/components/ConfirmModal";
import { toast } from "react-toastify";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  createdAt: string;
}

export function ContactManagementPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<ContactMessage | null>(null);

  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/contact/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch messages");
      
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchMessages();
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/contact/admin/${deleteConfirm._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessages(prev => prev.filter(m => m._id !== deleteConfirm._id));
        toast.success("Message deleted");
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete message");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    m.message.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    (m.company && m.company.toLowerCase().includes(debouncedQuery.toLowerCase()))
  );

  const columns = [
    {
      key: "date",
      header: "Date",
      render: (item: ContactMessage) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          {new Date(item.createdAt).toLocaleDateString()}
        </div>
      )
    },
    {
      key: "name",
      header: "Sender",
      render: (item: ContactMessage) => (
        <div>
          <div className="font-semibold text-black">{item.name}</div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <Mail className="w-3 h-3" /> {item.email}
          </div>
        </div>
      )
    },
    {
      key: "company",
      header: "Organization",
      render: (item: ContactMessage) => (
        <div className="flex items-center gap-1 text-gray-700">
          <Building className="w-4 h-4 text-emerald-500" />
          {item.company || "Personal Inquiry"}
        </div>
      )
    },
    {
      key: "message",
      header: "Message Snippet",
      render: (item: ContactMessage) => (
        <div className="max-w-xs truncate text-gray-600">
          {item.message}
        </div>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: ContactMessage) => (
        <div className="flex gap-2">
          <button 
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#95d5b2] text-[#2d6a4f] hover:bg-[#A8E6CF] transition-all hover:scale-105 flex items-center gap-1"
            onClick={() => {
              setSelectedMessage(item);
              setIsViewModalOpen(true);
            }}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            View
          </button>
          <button 
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-rose-200 text-rose-500 hover:bg-rose-50 transition-all hover:scale-105"
            onClick={() => setDeleteConfirm(item)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

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
        .med-search-input::placeholder { color:#95d5b2; transition: opacity 0.3s; }
        .med-search-input:focus::placeholder { opacity: 0.5; }
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
            <div className="p-3 bg-emerald-100 rounded-2xl">
              <Mail className="w-8 h-8 text-[#2d6a4f]" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[#1b4332]">Inquiries & Leads</h1>
                <span className="med-badge-count">{filteredMessages.length} Messages</span>
              </div>
              <p className="text-sm text-[#74c69d]">Manage submissions from the landing page and contact forms</p>
            </div>
          </div>
          <button
            className="med-btn-primary"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        <div className="med-card p-6">
          <div className="med-search-wrap">
            <Search className="med-search-icon w-6 h-6" />
            <input
              className="med-search-input"
              placeholder="Search inquiries by name, email, or content..."
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
        </div>

        <div className="med-card overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#52b788] mx-auto mb-4"></div>
              <p className="text-[#2d6a4f] font-medium">Synchronizing with server...</p>
            </div>
          ) : (
            <AdminTable data={filteredMessages} columns={columns} emptyMessage="No inquiries found matching your search" />
          )}
        </div>

      {/* View Message Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
            <DialogDescription>
              Received on {selectedMessage && new Date(selectedMessage.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-emerald-50 p-4 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Sender</p>
                  <p className="font-semibold text-black">{selectedMessage.name}</p>
                  <p className="text-sm text-gray-600">{selectedMessage.email}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Organization</p>
                  <p className="font-semibold text-black">{selectedMessage.company || "Not Specified"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">Message</p>
                <div className="bg-white border border-emerald-100 p-4 rounded-xl text-gray-700 whitespace-pre-wrap leading-relaxed shadow-inner">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
            <Button className="bg-emerald-600 text-white">Reply via Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmModal
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        title="Delete Inquiry?"
        description={`Are you sure you want to remove the message from ${deleteConfirm?.name}? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        variant="destructive"
      />
      </div>
    </div>
  );
}
