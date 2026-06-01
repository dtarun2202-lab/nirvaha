import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  Search, Plus, X, Image as ImageIcon, Loader2, CheckCircle,
  AlertCircle, Pencil, Trash2, ExternalLink, Wind,
} from "lucide-react";
import BACKEND_CONFIG from "@/config/backend";
import {
  getYogas, createYoga, updateYoga, deleteYoga, type YogaItem,
} from "@/lib/contentApi";
import { ConfirmModal } from "@/admin/components/ConfirmModal";

// ─── Types ────────────────────────────────────────────────────────────────────
type ToastType = "success" | "error";
interface Toast { id: number; msg: string; type: ToastType; }

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
          style={{ animation: "yogaSlideIn 0.3s ease" }}
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

// ─── Difficulty badge ─────────────────────────────────────────────────────────
function DifficultyBadge({ level }: { level: string }) {
  const map: Record<string, string> = {
    Gentle:   "bg-[#d8f3dc] text-[#1b4332] border-[#95d5b2]",
    Moderate: "bg-[#fff9c4] text-[#7b5e00] border-[#ffe082]",
    Intense:  "bg-[#fce4ec] text-[#880e4f] border-[#f48fb1]",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[level] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {level || "Gentle"}
    </span>
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
          <p className="text-xs text-[#52b788] font-medium text-center">Upload pose image</p>
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

// ─── Main component ───────────────────────────────────────────────────────────
export function YogaContent() {
  const [poses, setPoses] = useState<YogaItem[]>([]);       // all records — for Replace dropdown
  const [adminPoses, setAdminPoses] = useState<YogaItem[]>([]); // admin-managed only — for table
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selected, setSelected] = useState<YogaItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Content Action state — only relevant when opening the "Add New Pose" modal
  const [contentAction, setContentAction] = useState<"add" | "replace">("add");
  const [replaceTargetId, setReplaceTargetId] = useState<string>("");

  const [form, setForm] = useState({
    name: "",
    difficulty: "Gentle",
    duration: 10,
    youtube: "",
    imageUrl: "",
  });

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

  // Load poses — all records for Replace dropdown, admin-only for table
  useEffect(() => {
    Promise.all([
      getYogas(),                                          // all — Replace dropdown
      getYogas(true),                                      // admin-managed only — table
    ])
      .then(([all, admin]) => {
        setPoses(all);
        setAdminPoses(admin);
      })
      .catch(() => addToast("Failed to load poses", "error"))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return adminPoses;
    return adminPoses.filter(p =>
      (p.name || "").toLowerCase().includes(q)
    );
  }, [adminPoses, debouncedSearch]);

  const openAdd = () => {
    setSelected(null);
    setContentAction("add");
    setReplaceTargetId("");
    setForm({ name: "", difficulty: "Gentle", duration: 10, youtube: "", imageUrl: "" });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEdit = (p: YogaItem) => {
    setSelected(p);
    setForm({
      name: p.name || "",
      difficulty: p.difficulty || "Gentle",
      duration: p.duration || 10,
      youtube: p.youtubeUrl || "",
      imageUrl: p.imageUrl || "",
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { addToast("Pose name is required", "error"); return; }

    // Validate replace target when in replace mode (only for new-card flow)
    if (!selected && contentAction === "replace" && !replaceTargetId) {
      addToast("Please select a card to replace", "error");
      return;
    }

    try {
      setIsUploading(true);
      let imageUrl = form.imageUrl || "";

      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/upload/media`, {
          method: "POST",
          body: fd,
        });
        if (res.ok) {
          const data = await res.json();
          if (data.imageUrl) imageUrl = data.imageUrl;
        } else {
          throw new Error("Image upload failed");
        }
      }

      const payload = {
        name: form.name,
        difficulty: form.difficulty,
        duration: form.duration,
        youtubeUrl: form.youtube,
        imageUrl,
        status: "Active",
      };

      if (selected) {
        // ── Normal Edit flow (unchanged) ──
        const updated = await updateYoga(selected.id, payload);
        setPoses(p => p.map(x => x.id === updated.id ? updated : x));
        setAdminPoses(p => p.map(x => x.id === updated.id ? updated : x));
        addToast("Pose updated successfully ✓");
      } else if (contentAction === "replace") {
        // ── Replace Existing Card ──
        const updated = await updateYoga(replaceTargetId, payload);
        setPoses(p => p.map(x => x.id === updated.id ? updated : x));
        // Add to admin table if not already there (replacing a seeded card promotes it)
        setAdminPoses(p =>
          p.some(x => x.id === updated.id)
            ? p.map(x => x.id === updated.id ? updated : x)
            : [updated, ...p]
        );
        addToast("Card replaced successfully ✓");
      } else {
        // ── Add New Card ──
        const created = await createYoga(payload);
        setPoses(p => [created, ...p]);
        setAdminPoses(p => [created, ...p]);
        addToast("Pose added successfully ✓");
      }
      setIsModalOpen(false);
    } catch (e) {
      addToast((e as Error).message || "Save failed", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selected) return;
    try {
      await deleteYoga(selected.id);
      setPoses(p => p.filter(x => x.id !== selected.id));
      setAdminPoses(p => p.filter(x => x.id !== selected.id));
      setIsDeleteModalOpen(false);
      addToast("Pose deleted");
    } catch {
      addToast("Delete failed", "error");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#F0FFF4" }}>
      <ToastContainer toasts={toasts} onRemove={id => setToasts(p => p.filter(t => t.id !== id))} />

      <style>{`
        @keyframes yogaSlideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes yogaFadeUp  { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        .yoga-modal-anim { animation: yogaFadeUp 0.28s cubic-bezier(0.34,1.56,0.64,1); }
        .yoga-row { transition: background 0.15s; }
        .yoga-row:hover { background: #d8f3dc !important; }
        .yoga-row:hover .yoga-actions { opacity:1; }
        .yoga-actions { opacity:0.6; transition: opacity 0.15s; }
        .yoga-btn-primary { background:linear-gradient(135deg,#52b788,#40916c); color:#fff; border:none; border-radius:10px; padding:9px 20px; font-weight:600; font-size:0.875rem; cursor:pointer; display:flex; align-items:center; gap:6px; transition:transform 0.15s,box-shadow 0.15s; box-shadow:0 2px 8px rgba(82,183,136,0.3); white-space:nowrap; }
        .yoga-btn-primary:hover { transform:scale(1.04); box-shadow:0 4px 16px rgba(82,183,136,0.45); }
        .yoga-btn-primary:disabled { opacity:0.6; transform:none; cursor:not-allowed; }
        .yoga-btn-outline { background:rgba(255,255,255,0.6); color:#2d6a4f; border:1.5px solid #b7e4c7; border-radius:10px; padding:8px 18px; font-weight:500; font-size:0.875rem; cursor:pointer; transition:all 0.15s; }
        .yoga-btn-outline:hover { background:#d8f3dc; border-color:#74c69d; }
        .yoga-input { width:100%; border:1.5px solid #b7e4c7; border-radius:12px; padding:9px 12px; font-size:0.875rem; background:rgba(255,255,255,0.7); color:#1b4332; outline:none; transition:border-color 0.2s,box-shadow 0.2s; }
        .yoga-input:focus { border-color:#52b788; box-shadow:0 0 0 3px rgba(82,183,136,0.18); background:#fff; }
        .yoga-select { width:100%; border:1.5px solid #b7e4c7; border-radius:12px; padding:9px 12px; font-size:0.875rem; background:rgba(255,255,255,0.7); color:#1b4332; outline:none; cursor:pointer; transition:border-color 0.2s; }
        .yoga-select:focus { border-color:#52b788; box-shadow:0 0 0 3px rgba(82,183,136,0.18); }
        .yoga-label { font-size:0.78rem; font-weight:600; color:#2d6a4f; margin-bottom:5px; display:block; letter-spacing:0.02em; }
        .yoga-card { background:rgba(255,255,255,0.55); backdrop-filter:blur(8px); border-radius:16px; box-shadow:0 2px 16px rgba(82,183,136,0.12); border:1px solid #b7e4c7; }
        .yoga-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.35); backdrop-filter:blur(4px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:16px; }
        .yoga-modal { background:linear-gradient(160deg,#f0fff4 0%,#e8f5e9 100%); border-radius:20px; width:100%; max-width:640px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,0.18); border:1px solid #b7e4c7; }
        .yoga-search-wrap { position:relative; }
        .yoga-search-input { width:100%; border:2px solid #95d5b2; border-radius:14px; padding:11px 16px 11px 44px; font-size:0.9rem; background:rgba(255,255,255,0.75); color:#1b4332; outline:none; transition:border-color 0.2s,box-shadow 0.25s; box-shadow:0 2px 10px rgba(82,183,136,0.1); }
        .yoga-search-input::placeholder { color:#95d5b2; }
        .yoga-search-input:focus { border-color:#52b788; box-shadow:0 0 0 4px rgba(82,183,136,0.18); background:#fff; }
        .yoga-search-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#74c69d; pointer-events:none; }
        /* Responsive table */
        @media (max-width: 768px) {
          .yoga-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .yoga-table th:nth-child(4), .yoga-table td:nth-child(4) { display: none; }
        }
        @media (max-width: 540px) {
          .yoga-table th:nth-child(3), .yoga-table td:nth-child(3) { display: none; }
        }
      `}</style>

      {/* ── Header card ── */}
      <div className="yoga-card mx-4 sm:mx-6 mt-6 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "#e8f5e9" }}>
              <Wind className="w-5 h-5" style={{ color: "#52b788" }} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#1b4332]">Yoga for Meditation</h1>
              <p className="text-xs text-[#74c69d]">Manage yoga poses used for meditative practices</p>
            </div>
          </div>
          <button className="yoga-btn-primary self-start sm:self-auto" onClick={openAdd}>
            <Plus className="w-4 h-4" /> Add New Pose
          </button>
        </div>

        {/* Search */}
        <div className="yoga-search-wrap">
          <Search className="yoga-search-icon w-4 h-4" />
          <input
            className="yoga-search-input"
            placeholder="Search Poses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="yoga-card mx-4 sm:mx-6 mt-4 mb-6 overflow-hidden">
        {isLoading ? (
          /* Loading state */
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-[#52b788] animate-spin" />
            <p className="text-sm font-semibold text-[#1b4332]">Loading poses...</p>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 gap-4 px-6 text-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background: "#e8f5e9" }}>
              <Wind className="w-10 h-10" style={{ color: "#74c69d" }} />
            </div>
            <div>
              <p className="text-base font-bold text-[#1b4332] mb-1">
                {debouncedSearch ? "No poses found" : "No poses found"}
              </p>
              <p className="text-sm text-[#40916c] max-w-xs">
                {debouncedSearch
                  ? "Try a different search term or clear the search."
                  : "Click 'Add Pose' to get started"}
              </p>
            </div>

          </div>
        ) : (
          /* Table */
          <div className="yoga-table-wrap">
            <table className="yoga-table w-full text-sm">
              <thead>
                <tr style={{ background: "linear-gradient(135deg,#A8E6CF,#DCEDC1)" }}>
                  {["Preview", "Pose Name", "Difficulty", "Duration", "Actions"].map(h => (
                    <th key={h}
                      className="text-left px-4 py-4 text-xs font-bold text-[#1b4332] uppercase tracking-wider border-b border-[#b7e4c7] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    className="yoga-row border-b border-[#d8f3dc]"
                    style={{ background: i % 2 === 0 ? "rgba(240,255,244,0.8)" : "rgba(220,237,193,0.35)" }}
                  >
                    {/* Preview */}
                    <td className="px-4 py-3">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-14 h-14 rounded-xl object-cover border-2 border-[#b7e4c7] shadow-sm"
                          style={{ minWidth: 56 }}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl border-2 border-dashed border-[#b7e4c7] flex items-center justify-center bg-[#f0fff4]">
                          <ImageIcon className="w-5 h-5 text-[#95d5b2]" />
                        </div>
                      )}
                    </td>

                    {/* Pose Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1b4332]">{p.name}</span>
                        {p.youtubeUrl && (
                          <a
                            href={p.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="text-[#52b788] hover:text-[#40916c] transition-colors"
                            title="Open YouTube tutorial"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Difficulty */}
                    <td className="px-4 py-3">
                      <DifficultyBadge level={p.difficulty || "Gentle"} />
                    </td>

                    {/* Duration */}
                    <td className="px-4 py-3">
                      <span className="text-[#2d6a4f] font-medium">
                        {p.duration ? `${p.duration} min` : "—"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="yoga-actions flex items-center gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#95d5b2] text-[#2d6a4f] hover:bg-[#A8E6CF] transition-all hover:scale-105"
                        >
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => { setSelected(p); setIsDeleteModalOpen(true); }}
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

            {/* Row count footer */}
            <div className="px-5 py-3 border-t border-[#d8f3dc] flex items-center justify-between"
              style={{ background: "rgba(240,255,244,0.6)" }}>
              <span className="text-xs text-[#74c69d] font-medium">
                {filtered.length} pose{filtered.length !== 1 ? "s" : ""}{debouncedSearch ? " found" : " total"}
              </span>
              <Wind className="w-4 h-4 text-[#95d5b2]" />
            </div>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {isModalOpen && (
        <div className="yoga-overlay" onClick={() => !isUploading && setIsModalOpen(false)}>
          <div className="yoga-modal yoga-modal-anim" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b border-[#d8f3dc]"
              style={{ background: "linear-gradient(135deg,#A8E6CF33,#DCEDC122)" }}
            >
              <div className="flex items-center gap-3">
                <Wind className="w-5 h-5 text-[#52b788]" />
                <h2 className="text-base font-bold text-[#1b4332]">
                  {selected
                    ? "Edit Pose"
                    : contentAction === "replace"
                      ? "Replace Existing Card"
                      : "Add New Pose"}
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
            <div className="px-6 py-5 space-y-4">
              {/* ── Content Action (only shown when adding a new card, not editing) ── */}
              {!selected && (
                <div>
                  <label className="yoga-label">Content Action</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setContentAction("add"); setReplaceTargetId(""); }}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold border-2 transition-all duration-150
                        ${contentAction === "add"
                          ? "border-[#52b788] bg-[#d8f3dc] text-[#1b4332] shadow-sm"
                          : "border-[#b7e4c7] bg-white/60 text-[#40916c] hover:bg-[#e8f5e9]"}`}
                    >
                      ＋ Add New Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentAction("replace")}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold border-2 transition-all duration-150
                        ${contentAction === "replace"
                          ? "border-[#52b788] bg-[#d8f3dc] text-[#1b4332] shadow-sm"
                          : "border-[#b7e4c7] bg-white/60 text-[#40916c] hover:bg-[#e8f5e9]"}`}
                    >
                      ↺ Replace Existing Card
                    </button>
                  </div>

                  {/* Replace target dropdown */}
                  {contentAction === "replace" && (
                    <div className="mt-3">
                      <label className="yoga-label">Select Card to Replace</label>
                      <select
                        className="yoga-select"
                        value={replaceTargetId}
                        onChange={e => {
                          const id = e.target.value;
                          setReplaceTargetId(id);
                          // Pre-fill form with the selected card's data
                          const target = poses.find(p => p.id === id);
                          if (target) {
                            setForm({
                              name: target.name || "",
                              difficulty: target.difficulty || "Gentle",
                              duration: target.duration || 10,
                              youtube: target.youtubeUrl || "",
                              imageUrl: target.imageUrl || "",
                            });
                            setImageFile(null);
                          }
                        }}
                      >
                        <option value="">— Choose a card —</option>
                        {poses.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-[#95d5b2] mt-1">
                        Only the selected card will be updated. All other cards remain unchanged.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Pose Name */}
              <div>
                <label className="yoga-label">Pose Name *</label>
                <input
                  className="yoga-input"
                  placeholder="e.g. Butterfly Pose"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>

              {/* Difficulty + Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="yoga-label">Difficulty</label>
                  <select
                    className="yoga-select"
                    value={form.difficulty}
                    onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
                  >
                    <option>Gentle</option>
                    <option>Moderate</option>
                    <option>Intense</option>
                  </select>
                </div>
                <div>
                  <label className="yoga-label">Duration (minutes)</label>
                  <input
                    className="yoga-input"
                    type="number"
                    min={1}
                    placeholder="10"
                    value={form.duration}
                    onChange={e => setForm(f => ({ ...f, duration: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              {/* Pose Image */}
              <div>
                <label className="yoga-label">Pose Image</label>
                <ImageDropZone
                  file={imageFile}
                  previewUrl={form.imageUrl || undefined}
                  onFile={f => {
                    setImageFile(f);
                    if (!f) setForm(prev => ({ ...prev, imageUrl: "" }));
                  }}
                />
              </div>

              {/* YouTube Link */}
              <div>
                <label className="yoga-label">YouTube Tutorial Link</label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74c69d] pointer-events-none" />
                  <input
                    className="yoga-input"
                    style={{ paddingLeft: "2.25rem" }}
                    placeholder="https://youtube.com/watch?v=..."
                    value={form.youtube}
                    onChange={e => setForm(f => ({ ...f, youtube: e.target.value }))}
                  />
                </div>
                <p className="text-[10px] text-[#95d5b2] mt-1">
                  Clicking the pose card on the frontend will open this link.
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div
              className="flex justify-end gap-3 px-6 py-4 border-t border-[#b7e4c7]"
              style={{ background: "linear-gradient(135deg,#DCEDC1,#A8E6CF22)" }}
            >
              <button
                className="yoga-btn-outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                className="yoga-btn-primary"
                onClick={handleSave}
                disabled={isUploading}
              >
                {isUploading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  : selected
                    ? "Update Pose"
                    : contentAction === "replace"
                      ? "Replace Card"
                      : "Save Pose"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm ── */}
      <ConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Pose"
        description={`Are you sure you want to delete "${selected?.name}"? This cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
      />
    </div>
  );
}

export default YogaContent;
