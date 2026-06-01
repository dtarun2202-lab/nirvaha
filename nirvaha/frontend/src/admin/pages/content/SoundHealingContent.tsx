import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { ConfirmModal } from "@/admin/components/ConfirmModal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Upload, X, Music, Image, CheckCircle, AlertCircle, Loader2, Hash } from "lucide-react";
import BACKEND_CONFIG from "@/config/backend";
import { createSound, deleteSound, getSounds, updateSound, type SoundItem } from "@/lib/contentApi";

// ── Toast ─────────────────────────────────────────────────────────────────
type ToastType = "success" | "error";
interface Toast { id: number; msg: string; type: ToastType; }

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto
            animate-[slideIn_0.3s_ease] transition-all
            ${t.type === "success" ? "bg-[#A8E6CF] text-[#1a5c3a] border border-[#74c69d]" : "bg-red-100 text-red-700 border border-red-300"}`}
        >
          {t.type === "success" ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {t.msg}
          <button onClick={() => onRemove(t.id)} className="ml-2 opacity-60 hover:opacity-100"><X className="w-3 h-3" /></button>
        </div>
      ))}
    </div>
  );
}

// ── Drag-drop upload zone ─────────────────────────────────────────────────
function DropZone({ accept, label, file, previewUrl, onFile }: {
  accept: string; label: string; file: File | null; previewUrl?: string; onFile: (f: File | null) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isImage = accept.includes("image");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  };

  const preview = file ? URL.createObjectURL(file) : previewUrl;

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-2 p-4 min-h-[100px]
        ${dragging ? "border-[#52b788] bg-[#d8f3dc]" : "border-[#b7e4c7] bg-[#f0fff4] hover:border-[#74c69d] hover:bg-[#e8f5e9]"}`}
    >
      <input ref={inputRef} type="file" accept={accept} className="hidden"
        onChange={e => onFile(e.target.files?.[0] || null)} />
      {isImage && preview ? (
        <img src={preview} alt="preview" className="w-full h-20 object-cover rounded-lg" />
      ) : file ? (
        <div className="flex items-center gap-2 text-[#2d6a4f] text-xs font-medium text-center">
          <Music className="w-4 h-4 flex-shrink-0" />
          <span className="truncate max-w-[120px]">{file.name}</span>
        </div>
      ) : (
        <>
          {isImage ? <Image className="w-6 h-6 text-[#74c69d]" /> : <Music className="w-6 h-6 text-[#74c69d]" />}
          <p className="text-xs text-[#52b788] font-medium text-center">{label}</p>
          <p className="text-[10px] text-[#95d5b2]">drag & drop or click</p>
        </>
      )}
      {(file || preview) && (
        <button onClick={e => { e.stopPropagation(); onFile(null); }}
          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/80 flex items-center justify-center text-red-400 hover:text-red-600 shadow">
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const active = status === "Active";
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold
      ${active ? "bg-[#d8f3dc] text-[#1b4332] border border-[#95d5b2]" : "bg-gray-100 text-gray-500 border border-gray-200"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-[#52b788]" : "bg-gray-400"}`} />
      {status}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export function SoundHealingContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSound, setSelectedSound] = useState<SoundItem | null>(null);
  const [sounds, setSounds] = useState<SoundItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [moodInput, setMoodInput] = useState("");
  const [formData, setFormData] = useState<Partial<SoundItem>>({
    title: "", artist: "", frequency: "", mood: [], duration: 0, category: "",
    description: "", status: "Active", thumbnailUrl: "", bannerUrl: "", audioUrl: "",
  });

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const addToast = useCallback((msg: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  useEffect(() => {
    getSounds()
      .then(data => { setSounds(data); })
      .catch(() => addToast("Failed to load sounds", "error"))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    if (!q) return sounds;
    return sounds.filter(s =>
      s.title.toLowerCase().includes(q) ||
      (s.category || "").toLowerCase().includes(q) ||
      (s.artist || "").toLowerCase().includes(q)
    );
  }, [sounds, debouncedQuery]);

  const openAdd = () => {
    setSelectedSound(null);
    setFormData({ title: "", artist: "", frequency: "", mood: [], duration: 0, category: "", description: "", status: "Active", thumbnailUrl: "", bannerUrl: "", audioUrl: "" });
    setThumbnailFile(null); setBannerFile(null); setAudioFile(null);
    setIsModalOpen(true);
  };

  const openEdit = (s: SoundItem) => {
    setSelectedSound(s);
    setFormData({ ...s });
    setThumbnailFile(null); setBannerFile(null); setAudioFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title?.trim()) { addToast("Title is required", "error"); return; }
    if (!Number.isFinite(formData.duration) || (formData.duration as number) <= 0) {
      addToast("Valid duration is required", "error"); return;
    }
    try {
      setIsUploading(true);
      const base = BACKEND_CONFIG.API_BASE_URL;

      let thumbnailUrl = formData.thumbnailUrl || "";
      let bannerUrl    = formData.bannerUrl    || "";
      let audioUrl     = formData.audioUrl     || "";

      if (thumbnailFile || bannerFile || audioFile) {
        const fd = new FormData();
        if (thumbnailFile) fd.append("thumbnail", thumbnailFile);
        if (bannerFile)    fd.append("banner",    bannerFile);
        if (audioFile)     fd.append("audio",     audioFile);

        const uploadRes = await fetch(`${base}/api/upload/media`, {
          method: "POST",
          body: fd,
        });

        if (!uploadRes.ok) {
          const err = await uploadRes.json().catch(() => ({}));
          throw new Error(err.error || "File upload failed");
        }

        const uploaded = await uploadRes.json();
        if (uploaded.thumbnailUrl) thumbnailUrl = uploaded.thumbnailUrl;
        if (uploaded.bannerUrl)    bannerUrl    = uploaded.bannerUrl;
        if (uploaded.audioUrl)     audioUrl     = uploaded.audioUrl;
      }

      const payload = {
        title:       formData.title!,
        artist:      formData.artist || "",
        frequency:   formData.frequency || "",
        mood:        formData.mood || [],
        duration:    formData.duration as number,
        category:    formData.category || "",
        description: formData.description || "",
        status:      (formData.status as SoundItem["status"]) || "Active",
        thumbnailUrl,
        bannerUrl,
        audioUrl,
      };

      if (selectedSound) {
        const updated = await updateSound(selectedSound.id, payload);
        setSounds(p => p.map(s => s.id === updated.id ? updated : s));
        addToast("Sound session updated ✓");
      } else {
        const created = await createSound(payload);
        setSounds(p => [created, ...p]);
        addToast("Sound session created ✓");
      }
      setIsModalOpen(false);
    } catch (e) {
      addToast((e as Error).message || "Save failed", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSound) return;
    try {
      await deleteSound(selectedSound.id);
      setSounds(p => p.filter(s => s.id !== selectedSound.id));
      setIsDeleteModalOpen(false);
      addToast("Sound session deleted");
    } catch (e) {
      addToast("Delete failed", "error");
    }
  };

  const addMood = () => {
    if (moodInput.trim() && !(formData.mood || []).includes(moodInput.trim())) {
      setFormData(p => ({
        ...p,
        mood: [...(p.mood || []), moodInput.trim()],
      }));
      setMoodInput("");
    }
  };

  const removeMood = (mood: string) => {
    setFormData(p => ({
      ...p,
      mood: (p.mood || []).filter(m => m !== mood),
    }));
  };

  return (
    <div className="min-h-screen" style={{ background: "#F0FFF4" }}>
      <ToastContainer toasts={toasts} onRemove={id => setToasts(p => p.filter(t => t.id !== id))} />

      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        .med-modal-anim { animation: fadeSlideUp 0.28s cubic-bezier(0.34,1.56,0.64,1); }
        .med-row:hover { background: #d8f3dc !important; }
        .med-btn-primary { background: linear-gradient(135deg,#52b788,#40916c); color:#fff; border:none; border-radius:10px; padding:9px 20px; font-weight:600; font-size:0.875rem; cursor:pointer; display:flex; align-items:center; gap:6px; transition:transform 0.15s,box-shadow 0.15s; box-shadow:0 2px 8px rgba(82,183,136,0.3); white-space:nowrap; }
        .med-btn-primary:hover { transform:scale(1.04); box-shadow:0 4px 16px rgba(82,183,136,0.45); }
        .med-btn-primary:disabled { opacity:0.6; transform:none; cursor:not-allowed; }
        .med-btn-outline { background:rgba(255,255,255,0.6); color:#2d6a4f; border:1.5px solid #b7e4c7; border-radius:10px; padding:8px 18px; font-weight:500; font-size:0.875rem; cursor:pointer; transition:all 0.15s; }
        .med-btn-outline:hover { background:#d8f3dc; border-color:#74c69d; }
        .med-input { width:100%; border:1.5px solid #b7e4c7; border-radius:12px; padding:9px 12px; font-size:0.875rem; background:rgba(255,255,255,0.7); color:#1b4332; outline:none; transition:border-color 0.2s,box-shadow 0.2s,transform 0.15s; }
        .med-input:focus { border-color:#52b788; box-shadow:0 0 0 3px rgba(82,183,136,0.18); transform:scale(1.005); background:#fff; }
        .med-select { width:100%; border:1.5px solid #b7e4c7; border-radius:12px; padding:9px 12px; font-size:0.875rem; background:rgba(255,255,255,0.7); color:#1b4332; outline:none; cursor:pointer; transition:border-color 0.2s; }
        .med-select:focus { border-color:#52b788; box-shadow:0 0 0 3px rgba(82,183,136,0.18); }
        .med-label { font-size:0.78rem; font-weight:600; color:#2d6a4f; margin-bottom:5px; display:block; letter-spacing:0.02em; }
        .med-card { background:rgba(255,255,255,0.55); backdrop-filter:blur(8px); border-radius:16px; box-shadow:0 2px 16px rgba(82,183,136,0.12); border:1px solid #b7e4c7; }
        .med-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.35); backdrop-filter:blur(4px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:16px; }
        .med-modal { background:linear-gradient(160deg,#f0fff4 0%,#e8f5e9 100%); border-radius:20px; width:100%; max-width:680px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,0.18); border:1px solid #b7e4c7; }
        .med-toggle { position:relative; display:inline-flex; align-items:center; cursor:pointer; }
        .med-toggle input { opacity:0; width:0; height:0; position:absolute; }
        .med-toggle-track { width:44px; height:24px; border-radius:12px; transition:background 0.2s; }
        .med-toggle-thumb { position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%; background:#fff; box-shadow:0 1px 4px rgba(0,0,0,0.2); transition:transform 0.2s; }
        .med-search-wrap { position:relative; width:100%; }
        .med-search-input { width:100%; border:2px solid #95d5b2; border-radius:14px; padding:13px 16px 13px 48px; font-size:1rem; background:rgba(255,255,255,0.75); color:#1b4332; outline:none; transition:border-color 0.2s,box-shadow 0.25s,transform 0.2s; box-shadow:0 2px 10px rgba(82,183,136,0.12); }
        .med-search-input::placeholder { color:#95d5b2; }
        .med-search-input:focus { border-color:#52b788; box-shadow:0 0 0 4px rgba(82,183,136,0.18), 0 4px 20px rgba(82,183,136,0.15); transform:scale(1.008); background:#fff; }
        .med-search-icon { position:absolute; left:15px; top:50%; transform:translateY(-50%); color:#74c69d; pointer-events:none; }
      `}</style>

      {/* Header */}
      <div className="med-card mx-6 mt-6 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Music className="w-6 h-6 text-[#2d6a4f]" />
            <div>
              <h1 className="text-lg font-bold text-[#1b4332]">Sound Healing Sessions</h1>
              <p className="text-xs text-[#74c69d]">{sounds.length} sessions total</p>
            </div>
          </div>
          <button className="med-btn-primary" onClick={openAdd}>
            <Plus className="w-4 h-4" /> Add Sound Healing
          </button>
        </div>
        <div className="med-search-wrap">
          <Search className="med-search-icon w-5 h-5" />
          <input
            className="med-search-input"
            placeholder="Search by title, artist or category..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="med-card mx-6 mt-4 mb-6 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-[#52b788] animate-spin" />
            <p className="text-sm font-semibold text-[#1b4332]">Loading sessions...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Music className="w-12 h-12 text-[#52b788]" />
            <p className="text-base font-bold text-[#1b4332]">No sessions found</p>
            <p className="text-sm text-[#40916c]">{debouncedQuery ? "Try a different search term" : "Click 'Add Sound Healing' to get started"}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "linear-gradient(135deg,#A8E6CF,#DCEDC1)" }}>
                {["Title", "Artist", "Frequency", "Duration", "Category", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-bold text-[#1b4332] uppercase tracking-wider border-b border-[#b7e4c7]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} className="med-row border-b border-[#d8f3dc] transition-colors"
                  style={{ background: i % 2 === 0 ? "rgba(240,255,244,0.8)" : "rgba(220,237,193,0.35)" }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {s.thumbnailUrl ? (
                        <img src={s.thumbnailUrl} alt="" className="w-9 h-9 rounded-lg object-cover border border-[#b7e4c7]" />
                      ) : (
                        <Music className="w-5 h-5 text-[#52b788]" />
                      )}
                      <span className="font-semibold text-[#1b4332] line-clamp-1">{s.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#2d6a4f]">{s.artist || "—"}</td>
                  <td className="px-5 py-3.5 font-mono text-[#40916c]">{s.frequency || "—"}</td>
                  <td className="px-5 py-3.5 text-[#2d6a4f] font-medium">{s.duration} min</td>
                  <td className="px-5 py-3.5 text-[#40916c]">{s.category || "—"}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={s.status} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(s)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#95d5b2] text-[#2d6a4f] hover:bg-[#A8E6CF] transition-all hover:scale-105">
                        Edit
                      </button>
                      <button onClick={() => { setSelectedSound(s); setIsDeleteModalOpen(true); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition-all hover:scale-105">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="med-overlay" onClick={() => !isUploading && setIsModalOpen(false)}>
          <div className="med-modal med-modal-anim" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#d8f3dc]" style={{ background: "linear-gradient(135deg,#A8E6CF33,#DCEDC122)" }}>
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-[#2d6a4f]" />
                <h2 className="text-base font-bold text-[#1b4332]">
                  {selectedSound ? "Edit Sound Healing" : "Add Sound Healing"}
                </h2>
              </div>
              <button onClick={() => !isUploading && setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#74c69d] hover:bg-[#d8f3dc] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="med-label">Title *</label>
                <input className="med-input" placeholder="e.g. Deep Forest Sound Bath"
                  value={formData.title || ""} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="med-label">Artist</label>
                  <input className="med-input" placeholder="Sacred Sounds Collective"
                    value={formData.artist || ""} onChange={e => setFormData(p => ({ ...p, artist: e.target.value }))} />
                </div>
                <div>
                  <label className="med-label">Frequency</label>
                  <input className="med-input" placeholder="e.g. 528 Hz"
                    value={formData.frequency || ""} onChange={e => setFormData(p => ({ ...p, frequency: e.target.value }))} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="med-label">Duration (minutes) *</label>
                  <input className="med-input" type="number" min={1} placeholder="20"
                    value={formData.duration || ""} onChange={e => setFormData(p => ({ ...p, duration: parseInt(e.target.value) || 0 }))} />
                </div>
                <div>
                  <label className="med-label">Category</label>
                  <input className="med-input" placeholder="Bowl Therapy, Nature"
                    value={formData.category || ""} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="med-label">Mood Tags</label>
                <div className="flex gap-2">
                  <input className="med-input" placeholder="Press Enter to add tag..."
                    value={moodInput} onChange={e => setMoodInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addMood())} />
                  <button className="med-btn-outline px-4" onClick={addMood}>Add</button>
                </div>
                {(formData.mood || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.mood!.map(m => (
                      <span key={m} className="px-3 py-1 rounded-full bg-[#d8f3dc] text-[#1b4332] text-xs font-bold border border-[#95d5b2] flex items-center gap-1">
                        <Hash className="w-3 h-3 opacity-50" />{m}
                        <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeMood(m)} />
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="med-label">Description</label>
                <textarea className="med-input resize-none" rows={3} placeholder="Describe this sound session..."
                  value={formData.description || ""} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} />
              </div>

              <div className="flex items-center gap-3">
                <label className="med-label !mb-0">Status:</label>
                <label className="med-toggle">
                  <input type="checkbox" checked={formData.status === "Active"}
                    onChange={e => setFormData(p => ({ ...p, status: e.target.checked ? "Active" : "Draft" }))} />
                  <div className="med-toggle-track" style={{ background: formData.status === "Active" ? "#52b788" : "#d1d5db" }}>
                    <div className="med-toggle-thumb" style={{ transform: formData.status === "Active" ? "translateX(20px)" : "translateX(0)" }} />
                  </div>
                </label>
                <span className={`text-sm font-semibold ${formData.status === "Active" ? "text-[#2d6a4f]" : "text-gray-400"}`}>
                  {formData.status === "Active" ? "Active" : "Draft"}
                </span>
              </div>

              {/* 3 Media Theme: Thumbnail, Banner, Audio */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="med-label">Thumbnail Image</label>
                  <DropZone accept="image/jpeg,image/png,image/webp" label="JPG / PNG thumbnail"
                    file={thumbnailFile} previewUrl={formData.thumbnailUrl}
                    onFile={f => { setThumbnailFile(f); if (!f) setFormData(p => ({ ...p, thumbnailUrl: "" })); }} />
                </div>
                <div>
                  <label className="med-label">Banner Image</label>
                  <DropZone accept="image/jpeg,image/png,image/webp" label="JPG / PNG banner"
                    file={bannerFile} previewUrl={formData.bannerUrl}
                    onFile={f => { setBannerFile(f); if (!f) setFormData(p => ({ ...p, bannerUrl: "" })); }} />
                </div>
              </div>
              <div>
                <label className="med-label">Audio File</label>
                <DropZone accept="audio/mpeg,audio/mp3,audio/wav" label="MP3 / WAV audio file"
                  file={audioFile} previewUrl={formData.audioUrl ? "existing" : undefined}
                  onFile={f => { setAudioFile(f); if (!f) setFormData(p => ({ ...p, audioUrl: "" })); }} />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#b7e4c7]" style={{ background: "linear-gradient(135deg,#DCEDC1,#A8E6CF22)" }}>
              <button className="med-btn-outline" onClick={() => setIsModalOpen(false)} disabled={isUploading}>Cancel</button>
              <button className="med-btn-primary" onClick={handleSave} disabled={isUploading}>
                {isUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : selectedSound ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Sound Healing"
        description={`Are you sure you want to delete "${selectedSound?.title}"? This cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
      />
    </div>
  );
}
