import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Search, Plus, X, Image as ImageIcon, Loader2, CheckCircle,
  AlertCircle, Pencil, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Sparkles,
} from "lucide-react";
import BACKEND_CONFIG from "@/config/backend";

// ─── Types ────────────────────────────────────────────────────────────────────
type ToastType = "success" | "error";
interface Toast { id: number; msg: string; type: ToastType; }

interface GuidanceCard {
  _id?: string;
  title: string;
  image: string;
  displayOrder: number;
  isActive: boolean;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  step5: string;
  quoteText: string;
  breathingPattern: string;
}

const DEFAULT_CARD: GuidanceCard = {
  title: "", image: "", displayOrder: 0, isActive: true,
  step1: "", step2: "", step3: "", step4: "", step5: "",
  quoteText: "", breathingPattern: "",
};

// ─── Toast container ──────────────────────────────────────────────────────────
function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto transition-all
            ${t.type === "success"
              ? "bg-[#A8E6CF] text-[#1a5c3a] border border-[#74c69d]"
              : "bg-red-100 text-red-700 border border-red-300"}`}
          style={{ animation: "egSlideIn 0.3s ease" }}
        >
          {t.type === "success"
            ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {t.msg}
          <button onClick={() => onRemove(t.id)} className="ml-2 opacity-60 hover:opacity-100">
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Image drop-zone ──────────────────────────────────────────────────────────
function ImageDropZone({ file, previewUrl, onFile }: {
  file: File | null; previewUrl?: string; onFile: (f: File | null) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = file ? URL.createObjectURL(file) : previewUrl;

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
      onClick={() => inputRef.current?.click()}
      className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-2 p-4 min-h-[110px]
        ${dragging ? "border-[#52b788] bg-[#d8f3dc]" : "border-[#b7e4c7] bg-[#f0fff4] hover:border-[#74c69d] hover:bg-[#e8f5e9]"}`}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => onFile(e.target.files?.[0] || null)} />
      {preview ? (
        <img src={preview} alt="preview" className="w-full h-24 object-cover rounded-lg" />
      ) : (
        <>
          <ImageIcon className="w-7 h-7 text-[#74c69d]" />
          <p className="text-xs text-[#52b788] font-medium text-center">Upload guidance image</p>
          <p className="text-[10px] text-[#95d5b2]">drag & drop or click to browse</p>
        </>
      )}
      {(file || preview) && (
        <button
          onClick={e => { e.stopPropagation(); onFile(null); }}
          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/80 flex items-center justify-center text-red-400 hover:text-red-600 shadow"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmDeleteModal({ open, title, onConfirm, onCancel }: {
  open: boolean; title: string; onConfirm: () => void; onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="eg-overlay" onClick={onCancel}>
      <div className="eg-modal eg-modal-anim" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#d8f3dc]"
          style={{ background: "linear-gradient(135deg,#A8E6CF33,#DCEDC122)" }}>
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h2 className="text-base font-bold text-[#1b4332]">Delete Guidance Card</h2>
          </div>
          <button onClick={onCancel} className="w-8 h-8 rounded-full flex items-center justify-center text-[#74c69d] hover:bg-[#d8f3dc] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-[#2d6a4f]">Are you sure you want to delete <strong>"{title}"</strong>? This cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#b7e4c7]"
          style={{ background: "linear-gradient(135deg,#DCEDC1,#A8E6CF22)" }}>
          <button className="eg-btn-outline" onClick={onCancel}>Cancel</button>
          <button
            className="eg-btn-primary"
            style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)" }}
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function EssentialGuidanceManager() {
  const [cards, setCards] = useState<GuidanceCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selected, setSelected] = useState<GuidanceCard | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [form, setForm] = useState<GuidanceCard>({ ...DEFAULT_CARD });

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const addToast = useCallback((msg: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const fetchCards = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/essential-guidance/all`);
      if (!res.ok) { setCards([]); return; }
      const data = await res.json();
      setCards(data.cards || []);
    } catch {
      addToast("Failed to load guidance cards", "error");
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchCards(); }, [fetchCards]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter(c => c.title.toLowerCase().includes(q));
  }, [cards, debouncedSearch]);

  const openAdd = () => {
    setSelected(null);
    setForm({ ...DEFAULT_CARD });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEdit = (card: GuidanceCard) => {
    setSelected(card);
    setForm({ ...card });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { addToast("Guidance title is required", "error"); return; }
    if (!form.image && !imageFile) { addToast("A guidance image is required", "error"); return; }
    try {
      setIsUploading(true);
      let finalImageUrl = form.image || "";

      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/upload`, { method: "POST", body: fd });
        if (!res.ok) throw new Error("Image upload failed");
        const data = await res.json();
        finalImageUrl = `${BACKEND_CONFIG.API_BASE_URL}${data.url}`;
      }

      const payload = { ...form, image: finalImageUrl };
      const method = selected?._id ? "PUT" : "POST";
      const url = selected?._id
        ? `${BACKEND_CONFIG.API_BASE_URL}/api/essential-guidance/${selected._id}`
        : `${BACKEND_CONFIG.API_BASE_URL}/api/essential-guidance`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Save failed");
      }
      await fetchCards();
      setIsModalOpen(false);
      addToast(selected ? "Guidance card updated \u2713" : "Guidance card added \u2713");
    } catch (e) {
      addToast((e as Error).message || "Save failed", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selected?._id) return;
    try {
      await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/essential-guidance/${selected._id}`, { method: "DELETE" });
      await fetchCards();
      setIsDeleteModalOpen(false);
      addToast("Guidance card deleted");
    } catch {
      addToast("Delete failed", "error");
    }
  };

  const handleToggleActive = async (card: GuidanceCard) => {
    if (!card._id) return;
    try {
      const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/essential-guidance/${card._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !card.isActive }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      setCards(prev => prev.map(c => c._id === card._id ? { ...c, isActive: !c.isActive } : c));
      addToast(`Card ${!card.isActive ? "activated" : "deactivated"}`);
    } catch {
      addToast("Failed to update status", "error");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === cards.length - 1)) return;
    const newCards = [...cards];
    const swapIdx = direction === "up" ? index - 1 : index + 1;
    [newCards[index], newCards[swapIdx]] = [newCards[swapIdx], newCards[index]];
    setCards(newCards);
    try {
      await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/essential-guidance/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardIds: newCards.map(c => c._id) }),
      });
      addToast("Order updated");
    } catch {
      fetchCards();
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#F0FFF4" }}>
      <ToastContainer toasts={toasts} onRemove={id => setToasts(p => p.filter(t => t.id !== id))} />

      <style>{`
        @keyframes egSlideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes egFadeUp  { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        .eg-modal-anim { animation: egFadeUp 0.28s cubic-bezier(0.34,1.56,0.64,1); }
        .eg-row { transition: background 0.15s; }
        .eg-row:hover { background: #d8f3dc !important; }
        .eg-row:hover .eg-actions { opacity:1; }
        .eg-actions { opacity:0.6; transition: opacity 0.15s; }
        .eg-btn-primary { background:linear-gradient(135deg,#52b788,#40916c); color:#fff; border:none; border-radius:10px; padding:9px 20px; font-weight:600; font-size:0.875rem; cursor:pointer; display:flex; align-items:center; gap:6px; transition:transform 0.15s,box-shadow 0.15s; box-shadow:0 2px 8px rgba(82,183,136,0.3); white-space:nowrap; }
        .eg-btn-primary:hover { transform:scale(1.04); box-shadow:0 4px 16px rgba(82,183,136,0.45); }
        .eg-btn-primary:disabled { opacity:0.6; transform:none; cursor:not-allowed; }
        .eg-btn-outline { background:rgba(255,255,255,0.6); color:#2d6a4f; border:1.5px solid #b7e4c7; border-radius:10px; padding:8px 18px; font-weight:500; font-size:0.875rem; cursor:pointer; transition:all 0.15s; }
        .eg-btn-outline:hover { background:#d8f3dc; border-color:#74c69d; }
        .eg-input { width:100%; border:1.5px solid #b7e4c7; border-radius:12px; padding:9px 12px; font-size:0.875rem; background:rgba(255,255,255,0.7); color:#1b4332; outline:none; transition:border-color 0.2s,box-shadow 0.2s; }
        .eg-input:focus { border-color:#52b788; box-shadow:0 0 0 3px rgba(82,183,136,0.18); background:#fff; }
        .eg-textarea { width:100%; border:1.5px solid #b7e4c7; border-radius:12px; padding:9px 12px; font-size:0.875rem; background:rgba(255,255,255,0.7); color:#1b4332; outline:none; transition:border-color 0.2s,box-shadow 0.2s; resize:none; }
        .eg-textarea:focus { border-color:#52b788; box-shadow:0 0 0 3px rgba(82,183,136,0.18); background:#fff; }
        .eg-label { font-size:0.78rem; font-weight:600; color:#2d6a4f; margin-bottom:5px; display:block; letter-spacing:0.02em; }
        .eg-card { background:rgba(255,255,255,0.55); backdrop-filter:blur(8px); border-radius:16px; box-shadow:0 2px 16px rgba(82,183,136,0.12); border:1px solid #b7e4c7; }
        .eg-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.35); backdrop-filter:blur(4px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:16px; }
        .eg-modal { background:linear-gradient(160deg,#f0fff4 0%,#e8f5e9 100%); border-radius:20px; width:100%; max-width:640px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,0.18); border:1px solid #b7e4c7; }
        .eg-search-wrap { position:relative; }
        .eg-search-input { width:100%; border:2px solid #95d5b2; border-radius:14px; padding:11px 16px 11px 44px; font-size:0.9rem; background:rgba(255,255,255,0.75); color:#1b4332; outline:none; transition:border-color 0.2s,box-shadow 0.25s; box-shadow:0 2px 10px rgba(82,183,136,0.1); }
        .eg-search-input::placeholder { color:#95d5b2; }
        .eg-search-input:focus { border-color:#52b788; box-shadow:0 0 0 4px rgba(82,183,136,0.18); background:#fff; }
        .eg-search-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#74c69d; pointer-events:none; }
        .eg-step-num { width:22px; height:22px; border-radius:50%; background:rgba(82,183,136,0.15); color:#2d6a4f; font-size:0.7rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:10px; border:1px solid #b7e4c7; }
        @media (max-width: 768px) {
          .eg-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .eg-table th:nth-child(4), .eg-table td:nth-child(4) { display: none; }
        }
        @media (max-width: 540px) {
          .eg-table th:nth-child(3), .eg-table td:nth-child(3) { display: none; }
        }
      `}</style>

      {/* ── Header card ── */}
      <div className="eg-card mx-4 sm:mx-6 mt-6 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#e8f5e9" }}>
              <Sparkles className="w-5 h-5" style={{ color: "#52b788" }} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#1b4332]">Essential Guidance</h1>
              <p className="text-xs text-[#74c69d]">Manage meditation guidance cards and content</p>
            </div>
          </div>
          <button className="eg-btn-primary self-start sm:self-auto" onClick={openAdd}>
            <Plus className="w-4 h-4" /> Add New Guidance
          </button>
        </div>

        {/* Search */}
        <div className="eg-search-wrap">
          <Search className="eg-search-icon w-4 h-4" />
          <input
            className="eg-search-input"
            placeholder="Search Guidance Cards..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="eg-card mx-4 sm:mx-6 mt-4 mb-6 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-[#52b788] animate-spin" />
            <p className="text-sm font-semibold text-[#1b4332]">Loading guidance cards...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 px-6 text-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: "#e8f5e9" }}>
              <Sparkles className="w-10 h-10" style={{ color: "#74c69d" }} />
            </div>
            <div>
              <p className="text-base font-bold text-[#1b4332] mb-1">
                {debouncedSearch ? "No guidance cards found" : "No guidance cards yet"}
              </p>
              <p className="text-sm text-[#40916c] max-w-xs">
                {debouncedSearch ? "Try a different search term." : "Click 'Add New Guidance' to get started"}
              </p>
            </div>
          </div>
        ) : (
          <div className="eg-table-wrap">
            <table className="eg-table w-full text-sm">
              <thead>
                <tr style={{ background: "linear-gradient(135deg,#A8E6CF,#DCEDC1)" }}>
                  {["Preview", "Guidance Title", "Display Order", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-4 text-xs font-bold text-[#1b4332] uppercase tracking-wider border-b border-[#b7e4c7] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((card, i) => (
                  <tr
                    key={card._id || i}
                    className="eg-row border-b border-[#d8f3dc]"
                    style={{ background: i % 2 === 0 ? "rgba(240,255,244,0.8)" : "rgba(220,237,193,0.35)" }}
                  >
                    {/* Preview */}
                    <td className="px-4 py-3">
                      {card.image ? (
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-14 h-14 rounded-xl object-cover border-2 border-[#b7e4c7] shadow-sm"
                          style={{ minWidth: 56 }}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl border-2 border-dashed border-[#b7e4c7] flex items-center justify-center bg-[#f0fff4]">
                          <ImageIcon className="w-5 h-5 text-[#95d5b2]" />
                        </div>
                      )}
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3">
                      <span className="font-semibold text-[#1b4332]">{card.title}</span>
                      {card.breathingPattern && (
                        <p className="text-xs text-[#74c69d] mt-0.5">{card.breathingPattern}</p>
                      )}
                    </td>

                    {/* Display Order */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#d8f3dc] text-[#1b4332] font-bold text-sm border border-[#b7e4c7]">
                        {i + 1}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        card.isActive
                          ? "bg-[#d8f3dc] text-[#1b4332] border-[#95d5b2]"
                          : "bg-gray-100 text-gray-500 border-gray-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${card.isActive ? "bg-[#52b788]" : "bg-gray-400"}`} />
                        {card.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="eg-actions flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => openEdit(card)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#95d5b2] text-[#2d6a4f] hover:bg-[#A8E6CF] transition-all hover:scale-105"
                        >
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleToggleActive(card)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:scale-105 ${
                            card.isActive
                              ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                              : "border-[#95d5b2] text-[#2d6a4f] hover:bg-[#A8E6CF]"
                          }`}
                        >
                          {card.isActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          {card.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleMove(i, "up")}
                          disabled={i === 0}
                          className={`p-1.5 rounded-lg text-xs border transition-all hover:scale-105 ${
                            i === 0 ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-[#95d5b2] text-[#2d6a4f] hover:bg-[#A8E6CF]"
                          }`}
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMove(i, "down")}
                          disabled={i === cards.length - 1}
                          className={`p-1.5 rounded-lg text-xs border transition-all hover:scale-105 ${
                            i === cards.length - 1 ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-[#95d5b2] text-[#2d6a4f] hover:bg-[#A8E6CF]"
                          }`}
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => { setSelected(card); setIsDeleteModalOpen(true); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition-all hover:scale-105"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[#d8f3dc] flex items-center justify-between"
              style={{ background: "rgba(240,255,244,0.6)" }}>
              <span className="text-xs text-[#74c69d] font-medium">
                {filtered.length} card{filtered.length !== 1 ? "s" : ""}{debouncedSearch ? " found" : " total"}
              </span>
              <Sparkles className="w-4 h-4 text-[#95d5b2]" />
            </div>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {isModalOpen && (
        <div className="eg-overlay" onClick={() => !isUploading && setIsModalOpen(false)}>
          <div className="eg-modal eg-modal-anim" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b border-[#d8f3dc]"
              style={{ background: "linear-gradient(135deg,#A8E6CF33,#DCEDC122)" }}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#52b788]" />
                <h2 className="text-base font-bold text-[#1b4332]">
                  {selected ? "Edit Guidance Card" : "Add New Guidance Card"}
                </h2>
              </div>
              <button
                onClick={() => !isUploading && setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#74c69d] hover:bg-[#d8f3dc] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form body */}
            <div className="px-6 py-5 space-y-5">

              {/* ── Card Information ── */}
              <div>
                <p className="text-xs font-bold text-[#52b788] uppercase tracking-widest mb-3 pb-1 border-b border-[#d8f3dc]">
                  Card Information
                </p>

                {/* Title */}
                <div className="mb-4">
                  <label className="eg-label">Guidance Title *</label>
                  <input
                    className="eg-input"
                    placeholder="e.g. Start Small"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="eg-label">Guidance Image *</label>
                  <ImageDropZone
                    file={imageFile}
                    previewUrl={form.image || undefined}
                    onFile={f => {
                      setImageFile(f);
                      if (!f) setForm(prev => ({ ...prev, image: "" }));
                    }}
                  />
                </div>
              </div>

              {/* ── Guidance Content ── */}
              <div>
                <p className="text-xs font-bold text-[#52b788] uppercase tracking-widest mb-3 pb-1 border-b border-[#d8f3dc]">
                  Guidance Content
                </p>
                <div className="space-y-3">
                  {([1, 2, 3, 4, 5] as const).map(n => {
                    const key = `step${n}` as keyof GuidanceCard;
                    return (
                      <div key={n} className="flex items-start gap-3">
                        <span className="eg-step-num">{n}</span>
                        <input
                          className="eg-input"
                          placeholder={`Step ${n} description...`}
                          value={(form[key] as string) || ""}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Quote Section ── */}
              <div>
                <p className="text-xs font-bold text-[#52b788] uppercase tracking-widest mb-3 pb-1 border-b border-[#d8f3dc]">
                  Quote Section
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="eg-label">Quote Text</label>
                    <textarea
                      className="eg-textarea"
                      rows={2}
                      placeholder="e.g. A journey of a thousand miles begins with a single breath."
                      value={form.quoteText}
                      onChange={e => setForm(f => ({ ...f, quoteText: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="eg-label">Breathing Pattern</label>
                    <input
                      className="eg-input"
                      placeholder="e.g. Inhale 4 \u2022 Hold 2 \u2022 Exhale 6"
                      value={form.breathingPattern}
                      onChange={e => setForm(f => ({ ...f, breathingPattern: e.target.value }))}
                    />
                    <p className="text-[10px] text-[#95d5b2] mt-1">
                      Displayed as a breathing guide pill on the meditation page.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div
              className="flex justify-end gap-3 px-6 py-4 border-t border-[#b7e4c7]"
              style={{ background: "linear-gradient(135deg,#DCEDC1,#A8E6CF22)" }}
            >
              <button
                className="eg-btn-outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                className="eg-btn-primary"
                onClick={handleSave}
                disabled={isUploading}
              >
                {isUploading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  : selected ? "Update Card" : "Save Card"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm ── */}
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        title={selected?.title || ""}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}

export default EssentialGuidanceManager;
