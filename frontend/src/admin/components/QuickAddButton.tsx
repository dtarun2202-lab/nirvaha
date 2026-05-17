import React, { useState } from "react";
import { 
  Plus, Calendar, ShoppingBag, MapPin, 
  ArrowRight, X, Sparkles, Target, Users 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BACKEND_CONFIG } from "@/config/backend";

type CreateType = "retreat" | "session" | "product" | null;

export function QuickAddButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<CreateType>(null);
  const [loading, setLoading] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: 0,
    stock: 0,
    startDate: "",
    endDate: "",
    startTime: "",
    timeZone: "IST",
    description: "",
    image: ""
  });

  const handleClose = () => {
    setIsOpen(false);
    setSelectedType(null);
    setFormData({
      title: "",
      category: "",
      price: 0,
      stock: 0,
      startDate: "",
      endDate: "",
      startTime: "",
      timeZone: "IST",
      description: "",
      image: ""
    });
  };

  const handleSubmit = async () => {
    if (!selectedType) return;
    setLoading(true);
    try {
      const body = {
        type: selectedType,
        status: "active",
        data: {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock)
        }
      };

      const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/marketplace/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        handleClose();
        // Trigger a global refresh if needed
        window.dispatchEvent(new CustomEvent("content-added", { detail: { type: selectedType } }));
      }
    } catch (e) {
      console.error("Quick add failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const OPTIONS = [
    { 
      id: "retreat", 
      label: "Retreat", 
      desc: "Wellness events & group travel", 
      icon: MapPin, 
      color: "from-emerald-400 to-emerald-600",
      bg: "bg-emerald-50"
    },
    { 
      id: "session", 
      label: "Session", 
      desc: "One-on-one or group healing", 
      icon: Calendar, 
      color: "from-teal-400 to-teal-600",
      bg: "bg-teal-50"
    },
    { 
      id: "product", 
      label: "Product", 
      desc: "Physical goods & essentials", 
      icon: ShoppingBag, 
      color: "from-sage-400 to-sage-600",
      bg: "bg-[#F4FAF6]"
    },
  ];

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-br from-[#1F4131] to-[#2D6A4F] hover:from-[#2D6A4F] hover:to-[#1F4131] text-white rounded-[16px] px-5 py-2.5 font-bold shadow-lg shadow-emerald-900/10 flex items-center gap-2 transition-all active:scale-95 border-none text-sm"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden lg:inline">Add Content</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg rounded-[35px] border border-white/40 shadow-2xl p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {!selectedType ? (
              <motion.div
                key="selection"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="p-8"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#E6F5EB] to-[#B9EBD1] text-[#1F4131] flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black text-[#1F4131] tracking-tight">Add Content</h2>
                  <p className="text-[#5a8c72] font-semibold text-xs mt-1.5 uppercase tracking-wider">Select Category</p>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedType(opt.id as CreateType)}
                      className="group flex items-center gap-5 p-4 rounded-[26px] bg-[#F8FDF9] border border-[#D5EEDD] hover:border-[#5ABF88] hover:bg-white transition-all text-left relative overflow-hidden shadow-sm hover:shadow-md"
                    >
                      <div className={`w-12 h-12 rounded-[18px] bg-gradient-to-br ${opt.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                        <opt.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[17px] font-bold text-[#1F4131] group-hover:text-[#2D6A4F] transition-colors leading-tight">{opt.label}</h3>
                        <p className="text-[13px] text-[#7a9c8a] font-medium opacity-80">{opt.desc}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <ArrowRight className="w-4 h-4 text-[#2D6A4F]" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="flex flex-col max-h-[88vh]"
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-br from-[#1F4131] via-[#2D6A4F] to-[#1A3D2F] p-8 text-white relative">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setSelectedType(null)}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all group"
                    >
                      <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    </button>
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                      {OPTIONS.find(o => o.id === selectedType)?.icon({ className: "w-5 h-5" })}
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-black uppercase tracking-[0.1em]">
                        New {selectedType}
                      </DialogTitle>
                      <p className="text-emerald-200/80 text-[10px] font-bold tracking-widest uppercase">Admin Flow</p>
                    </div>
                  </div>
                </div>

                {/* Form Body */}
                <div className="p-8 space-y-6 overflow-y-auto flex-1 bg-gradient-to-b from-[#F4FAF6]/40 to-white">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-[#64C08E] uppercase tracking-[0.2em] px-1">Title</label>
                      <Input 
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        placeholder={`Name of ${selectedType}`}
                        className="h-14 rounded-2xl border-[#D5EEDD] focus:ring-[#5ABF88] bg-white shadow-sm font-bold text-[#1F4131] px-5"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#64C08E] uppercase tracking-[0.2em] px-1">Category</label>
                      <Input 
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Wellness"
                        className="h-12 rounded-xl border-[#D5EEDD] focus:ring-[#5ABF88] bg-white shadow-sm font-bold text-[#1F4131]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#64C08E] uppercase tracking-[0.2em] px-1">Price (₹)</label>
                      <Input 
                        type="number"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="h-12 rounded-xl border-[#D5EEDD] focus:ring-[#5ABF88] bg-white shadow-sm font-bold text-[#1F4131]"
                      />
                    </div>

                    {selectedType === "product" && (
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-[#64C08E] uppercase tracking-[0.2em] px-1">Stock</label>
                        <Input 
                          type="number"
                          value={formData.stock}
                          onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                          className="h-12 rounded-xl border-[#D5EEDD] focus:ring-[#5ABF88] bg-white shadow-sm font-bold text-[#1F4131]"
                        />
                      </div>
                    )}

                    {selectedType === "retreat" && (
                      <div className="col-span-2 grid grid-cols-2 gap-4 p-5 rounded-2xl bg-[#E6F5EB]/40 border border-[#D5EEDD]">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#64C08E] uppercase tracking-[0.2em] px-1">Start</label>
                          <Input 
                            type="date"
                            value={formData.startDate}
                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                            className="h-12 rounded-xl border-[#D5EEDD] bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#64C08E] uppercase tracking-[0.2em] px-1">End</label>
                          <Input 
                            type="date"
                            value={formData.endDate}
                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                            className="h-12 rounded-xl border-[#D5EEDD] bg-white"
                          />
                        </div>
                      </div>
                    )}

                    {selectedType === "session" && (
                      <div className="col-span-2 grid grid-cols-2 gap-4 p-5 rounded-2xl bg-[#E6F5EB]/40 border border-[#D5EEDD]">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#64C08E] uppercase tracking-[0.2em] px-1">Date</label>
                          <Input 
                            type="date"
                            value={formData.startDate}
                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                            className="h-12 rounded-xl border-[#D5EEDD] bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#64C08E] uppercase tracking-[0.2em] px-1">Time</label>
                          <Input 
                            type="time"
                            value={formData.startTime}
                            onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                            className="h-12 rounded-xl border-[#D5EEDD] bg-white"
                          />
                        </div>
                      </div>
                    )}

                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-[#64C08E] uppercase tracking-[0.2em] px-1">Cover URL</label>
                      <Input 
                        value={formData.image}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                        placeholder="Image Link"
                        className="h-12 rounded-xl border-[#D5EEDD] bg-white"
                      />
                    </div>

                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-[#64C08E] uppercase tracking-[0.2em] px-1">Description</label>
                      <textarea 
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Description..."
                        className="w-full h-24 p-5 rounded-2xl border border-[#D5EEDD] focus:ring-2 focus:ring-[#5ABF88] bg-white shadow-sm text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-8 pt-0 flex gap-4 bg-white">
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedType(null)}
                    className="flex-1 h-14 rounded-2xl border border-[#E6F5EB] font-bold text-[#5a8c72] hover:bg-[#F4FAF6]"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-[1.5] h-14 rounded-2xl bg-gradient-to-r from-[#1F4131] to-[#2D6A4F] text-white font-black uppercase tracking-widest text-xs disabled:opacity-50"
                  >
                    {loading ? "..." : "Create"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
