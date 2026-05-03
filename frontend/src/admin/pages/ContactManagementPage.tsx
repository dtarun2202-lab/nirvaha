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
      // Assuming a delete route exists or adding one if needed
      // For now, we'll just filter it out of the UI if no backend delete yet
      // but let's assume it's /api/contact/admin/:id
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
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.company && m.company.toLowerCase().includes(searchQuery.toLowerCase()))
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
          <Button 
            size="sm" 
            variant="outline" 
            className="border-emerald-200 hover:bg-emerald-50 text-emerald-700"
            onClick={() => {
              setSelectedMessage(item);
              setIsViewModalOpen(true);
            }}
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
            onClick={() => setDeleteConfirm(item)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Inquiries & Leads</h1>
          <p className="text-gray-700">Manage submissions from the landing page and contact forms</p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          <RotateCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card className="bg-white border-emerald-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search inquiries by name, email, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-emerald-200 text-black"
          />
        </div>
      </Card>

      <Card className="bg-white border-emerald-200">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading inquiries...</p>
          </div>
        ) : (
          <AdminTable data={filteredMessages} columns={columns} emptyMessage="No inquiries found" />
        )}
      </Card>

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
  );
}
