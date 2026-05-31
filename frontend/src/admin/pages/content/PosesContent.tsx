import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { ConfirmModal } from "@/admin/components/ConfirmModal";
import { Search, Plus, X, Image, CheckCircle, AlertCircle, Loader2, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import BACKEND_CONFIG from "@/config/backend";
import { createPose, deletePose, getPoses, updatePose, type PoseItem } from "@/lib/contentApi";

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

function DropZone({ accept, label, file, previewUrl, onFile }: {
  accept: string; label: string; file: File | null; previewUrl?: string; onFile: (f: File | null) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      {preview ? (
        <img src={preview} alt="preview" className="w-28 h-28 object-cover rounded-full" />
      ) : (
        <>
          <Image className="w-6 h-6 text-[#74c69d]" />
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

export function PosesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [setFilter, setSetFilter] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPose, setSelectedPose] = useState<PoseItem | null>(null);
  const [poses, setPoses] = useState<PoseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Partial<PoseItem>>({
    name: "", sanskritName: "", poseNumber: undefined, category: "", shortCaption: "", shortIntro: "",
    spiritualEssence: "", ancientOrigin: "", mentalBenefits: [], physicalBenefits: [], chakraName: "", chakraDescription: "",
    set: "Set 1", position: 1, status: "Active", imageUrl: "", show: true,
  });

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
    getPoses()
      .then(data => { setPoses(data); })
      .catch(() => addToast("Failed to load poses", "error"))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    if (!q) return poses;
    return poses.filter(p =>
      (p.name.toLowerCase().includes(q) ||
      (p.sanskritName || "").toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q) ||
      (p.shortCaption || "").toLowerCase().includes(q)) &&
      (categoryFilter ? p.category === categoryFilter : true) &&
      (setFilter ? (p.set || "Set 1") === setFilter : true)
    );
  }, [poses, debouncedQuery, categoryFilter, setFilter]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    poses.forEach(p => { if (p.category) set.add(p.category); });
    return Array.from(set).sort();
  }, [poses]);

  const sets = useMemo(() => {
    const s = new Set<string>();
    poses.forEach(p => s.add(p.set || 'Set 1'));
    return Array.from(s).sort();
  }, [poses]);

  const openAdd = () => {
    setSelectedPose(null);
    setFormData({ name: "", sanskritName: "", poseNumber: undefined, category: "", shortCaption: "", shortIntro: "",
      spiritualEssence: "", ancientOrigin: "", mentalBenefits: [], physicalBenefits: [], chakraName: "", chakraDescription: "",
      set: "Set 1", position: 1, status: "Active", imageUrl: "", show: true });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEdit = (p: PoseItem) => {
    setSelectedPose(p);
    setFormData({ ...p });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) { addToast("Pose name is required", "error"); return; }
    try {
      setIsUploading(true);
      const base = BACKEND_CONFIG.API_BASE_URL;
      let imageUrl = formData.imageUrl || "";

      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const uploadRes = await fetch(`${base}/api/upload/media`, { method: "POST", body: fd });
        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploaded = await uploadRes.json();
        if (uploaded.imageUrl) imageUrl = uploaded.imageUrl;
      }

      const payload = {
        name: formData.name!,
        sanskritName: formData.sanskritName || "",
        poseNumber: formData.poseNumber || 0,
        category: formData.category || "",
        shortCaption: formData.shortCaption || "",
        shortIntro: formData.shortIntro || "",
        spiritualEssence: formData.spiritualEssence || "",
        ancientOrigin: formData.ancientOrigin || "",
        mentalBenefits: (formData.mentalBenefits as string[]) || [],
        physicalBenefits: (formData.physicalBenefits as string[]) || [],
        chakraName: formData.chakraName || "",
        chakraDescription: formData.chakraDescription || "",
        imageUrl,
        set: (formData.set as PoseItem["set"]) || "Set 1",
        position: formData.position || 1,
        status: (formData.status as PoseItem["status"]) || "Active",
        show: formData.show ?? true,
      };

      if (selectedPose) {
        const updated = await updatePose(selectedPose.id, payload);
        setPoses(p => p.map(x => x.id === updated.id ? updated : x));
        addToast("Pose updated successfully ✓");
      } else {
        const created = await createPose(payload as any);
        setPoses(p => [created, ...p]);
        addToast("Pose created successfully ✓");
      }
      setIsModalOpen(false);
    } catch (e) {
      addToast((e as Error).message || "Save failed", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPose) return;
    try {
      await deletePose(selectedPose.id);
      setPoses(p => p.filter(x => x.id !== selectedPose.id));
      setIsDeleteModalOpen(false);
      addToast("Pose deleted");
    } catch (e) {
      addToast("Delete failed", "error");
    }
  };

  const movePosition = (id: string, dir: "up" | "down") => {
    setPoses(prev => {
      const idx = prev.findIndex(p => p.id === id);
      if (idx === -1) return prev;
      const newArr = [...prev];
      const swapIdx = dir === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= newArr.length) return prev;
      const tmp = newArr[swapIdx]; newArr[swapIdx] = newArr[idx]; newArr[idx] = tmp;
      return newArr.map((p, i) => ({ ...p, position: i + 1 }));
    });
  };

  return (
    <div className="min-h-screen" style={{ background: "#F0FFF4" }}>
      <ToastContainer toasts={toasts} onRemove={id => setToasts(p => p.filter(t => t.id !== id))} />

      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }

        /* Pose card + inputs */
        .pose-card { background:rgba(255,255,255,0.55); backdrop-filter:blur(8px); border-radius:16px; box-shadow:0 2px 16px rgba(82,183,136,0.12); border:1px solid #9fcaa8; }
        .pose-row:hover { background: #d8f3dc !important; }
        .pose-btn-primary { background: linear-gradient(135deg,#52b788,#40916c); color:#fff; border:none; border-radius:10px; padding:9px 20px; font-weight:600; font-size:0.875rem; cursor:pointer; display:flex; align-items:center; gap:6px; transition:transform 0.15s,box-shadow 0.15s; box-shadow:0 2px 8px rgba(82,183,136,0.3); }
        .pose-btn-primary:hover { transform:scale(1.04); box-shadow:0 4px 16px rgba(82,183,136,0.45); }
        .pose-input { width:100%; border:1.5px solid #9fcaa8; border-radius:12px; padding:9px 12px; font-size:0.875rem; background:rgba(255,255,255,0.7); color:#163f2e; outline:none; transition:border-color 0.2s,box-shadow 0.2s,transform 0.15s; }
        .pose-input:focus { border-color:#52b788; box-shadow:0 0 0 3px rgba(82,183,136,0.18); transform:scale(1.005); background:#fff; }

        /* Reuse meditation modal styles for premium popup */
        .med-modal-anim { animation: fadeSlideUp 0.28s cubic-bezier(0.34,1.56,0.64,1); }
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
        .med-modal { background:linear-gradient(160deg,#f0fff4 0%,#e8f5e9 100%); border-radius:20px; width:100%; max-width:760px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,0.18); border:1px solid #b7e4c7; }
        .med-toggle { position:relative; display:inline-flex; align-items:center; cursor:pointer; }
        .med-toggle input { opacity:0; width:0; height:0; position:absolute; }
        .med-toggle-track { width:44px; height:24px; border-radius:12px; transition:background 0.2s; }
        .med-toggle-thumb { position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%; background:#fff; box-shadow:0 1px 4px rgba(0,0,0,0.2); transition:transform 0.2s; }
        .med-search-wrap { position:relative; width:100%; }
        .med-search-input { width:100%; border:2px solid #95d5b2; border-radius:14px; padding:13px 16px 13px 48px; font-size:1rem; background:rgba(255,255,255,0.75); color:#1b4332; outline:none; transition:border-color 0.2s,box-shadow 0.25s,transform 0.2s; box-shadow:0 2px 10px rgba(82,183,136,0.12); }
        .med-search-input::placeholder { color:#95d5b2; }
        .med-search-input:focus { border-color:#52b788; box-shadow:0 0 0 4px rgba(82,183,136,0.18), 0 4px 20px rgba(82,183,136,0.15); transform:scale(1.008); background:#fff; }
        .med-search-icon { position:absolute; left:15px; top:50%; transform:translateY(-50%); color:#74c69d; pointer-events:none; }

        /* small responsive tweaks */
        @media (max-width:640px) {
          .med-modal { max-width:92%; }
          .pose-card { margin-left:12px; margin-right:12px; }
        }
        /* Search input + icon for Pose management */
        .pose-search-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#74c69d; pointer-events:none; }
        .pose-search-input { padding-left:48px; padding-top:12px; padding-bottom:12px; border-width:2px; border-color:#95d5b2; border-radius:14px; box-shadow:0 2px 10px rgba(82,183,136,0.12); }
      `}</style>

      <div className="pose-card mx-6 mt-6 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <ArrowUpDown className="w-6 h-6 text-[#2d6a4f]" />
            <div>
              <h1 className="text-lg font-bold text-[#1b4332]">Pose Management</h1>
              <p className="text-sm font-semibold text-[#2d6a4f]">{poses.length} poses total</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-[320px]">
              <Search className="pose-search-icon w-4 h-4" />
              <input className="pose-input pose-search-input" placeholder="Search poses, category or Sanskrit name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <select className="pose-input" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{width:140}}>
                <option value="">All categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="pose-input" value={setFilter} onChange={e => setSetFilter(e.target.value)} style={{width:110}}>
                <option value="">All sets</option>
                {sets.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button className="pose-btn-primary" onClick={openAdd}><Plus className="w-4 h-4" /> Add Pose</button>
          </div>
        </div>
      </div>

      <div className="pose-card mx-6 mt-4 mb-6 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-8 h-8 text-[#52b788] animate-spin" />
            <p className="text-sm font-semibold text-[#1b4332]">Loading poses...</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "linear-gradient(135deg,#A8E6CF,#DCEDC1)" }}>
                {["Preview","Name","Sanskrit","Category","Set","Position","Status","Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#163f2e] uppercase tracking-wider border-b border-[#9fcaa8]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12">
                    <div className="flex flex-col items-center gap-3">
                      {/* subtle illustration */}
                      <svg width="84" height="84" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="32" cy="32" r="32" fill="#F0FFF4" />
                        <path d="M32 18C28 22 24 22 20 24c4 2 6 6 12 6s8-4 12-6c-4-2-8-2-12-6z" fill="#9fcaa8" opacity="0.95"/>
                        <path d="M20 34c4-2 8-2 12 2s8 4 12 2c-4 0-8-2-12-6s-8-4-12-6c0 4 0 8 0 8z" fill="#74c69d" opacity="0.95"/>
                      </svg>
                      <p className="text-base font-bold text-[#1b4332]">No poses found</p>
                      <p className="text-sm text-[#2d6a4f]">{debouncedQuery ? "Try a different search term" : "Click 'Add Pose' to get started"}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr key={p.id} className="pose-row border-b border-[#d8f3dc] transition-colors" style={{ background: i % 2 === 0 ? "rgba(240,255,244,0.8)" : "rgba(220,237,193,0.35)" }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt="" className="w-12 h-12 rounded-full object-cover border border-[#9fcaa8]" />
                        ) : (
                          <Image className="w-6 h-6 text-[#52b788]" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><span className="font-semibold text-[#1b4332] line-clamp-1">{p.name}</span></td>
                    <td className="px-5 py-3.5 text-[#2d6a4f]">{p.sanskritName || "—"}</td>
                    <td className="px-5 py-3.5 text-[#40916c]">{p.category || "—"}</td>
                    <td className="px-5 py-3.5"><span className="px-2 py-1 rounded-full text-xs font-semibold border border-[#9fcaa8] bg-white">{p.set || "Set 1"}</span></td>
                    <td className="px-5 py-3.5">{p.position || i+1}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#95d5b2] text-[#2d6a4f] hover:bg-[#A8E6CF]">Edit</button>
                        <button onClick={() => { setSelectedPose(p); setIsDeleteModalOpen(true); }} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-500 hover:bg-red-50">Delete</button>
                        <button onClick={() => movePosition(p.id, "up")} className="px-2 py-1 rounded-lg text-xs border border-gray-200"><ChevronUp className="w-4 h-4" /></button>
                        <button onClick={() => movePosition(p.id, "down")} className="px-2 py-1 rounded-lg text-xs border border-gray-200"><ChevronDown className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="med-overlay" onClick={() => !isUploading && setIsModalOpen(false)}>
          <div className="med-modal med-modal-anim" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#d8f3dc]" style={{ background: "linear-gradient(135deg,#A8E6CF33,#DCEDC122)" }}>
              <div className="flex items-center gap-3">
                <Image className="w-5 h-5 text-[#2d6a4f]" />
                <h2 className="text-base font-bold text-[#1b4332]">{selectedPose ? "Edit Pose" : "Add New Pose"}</h2>
              </div>
              <button onClick={() => !isUploading && setIsModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#74c69d] hover:bg-[#d8f3dc]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="med-label">Pose Name *</label>
                  <input className="med-input" value={formData.name || ""} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="med-label">Sanskrit Name</label>
                  <input className="med-input" value={formData.sanskritName || ""} onChange={e => setFormData(p => ({ ...p, sanskritName: e.target.value }))} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="med-label">Pose Number</label>
                  <input className="med-input" type="number" value={formData.poseNumber || ""} onChange={e => setFormData(p => ({ ...p, poseNumber: parseInt(e.target.value) || undefined }))} />
                </div>
                <div>
                  <label className="med-label">Category</label>
                  <select className="med-select" value={formData.category || ""} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}>
                    <option value="">Select category</option>
                    {[
                      "Ancient Asanas",
                      "Poses for Meditation",
                      "Healing & Relaxation",
                      "Balance & Stability",
                    ].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="med-label">Card Position</label>
                  <input className="med-input" type="number" value={formData.position || 1} onChange={e => setFormData(p => ({ ...p, position: parseInt(e.target.value) || 1 }))} />
                </div>
              </div>

              <div>
                <label className="med-label">Short Caption</label>
                <input className="med-input" value={formData.shortCaption || ""} onChange={e => setFormData(p => ({ ...p, shortCaption: e.target.value }))} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="med-label">Pose Image</label>
                  <DropZone accept="image/jpeg,image/png,image/webp" label="JPG / PNG" file={imageFile} previewUrl={formData.imageUrl} onFile={f => { setImageFile(f); if (!f) setFormData(p => ({ ...p, imageUrl: "" })); }} />
                </div>
                <div>
                  <label className="med-label">Controls</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={formData.status === "Active"} onChange={e => setFormData(p => ({ ...p, status: e.target.checked ? "Active" : "Draft" }))} />
                      <span className="text-sm font-semibold">Active</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={formData.show ?? true} onChange={e => setFormData(p => ({ ...p, show: e.target.checked }))} />
                      <span className="text-sm font-semibold">Show on site</span>
                    </div>
                    <div>
                      <label className="med-label">Select Set</label>
                      <div className="flex items-center gap-3 mt-1">
                        <label className="inline-flex items-center gap-2"><input type="radio" name="set" checked={formData.set === "Set 1"} onChange={() => setFormData(p => ({ ...p, set: "Set 1" }))} /> Set 1</label>
                        <label className="inline-flex items-center gap-2"><input type="radio" name="set" checked={formData.set === "Set 2"} onChange={() => setFormData(p => ({ ...p, set: "Set 2" }))} /> Set 2</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="med-label">Short Intro</label>
                  <textarea className="med-input resize-none" rows={3} value={formData.shortIntro || ""} onChange={e => setFormData(p => ({ ...p, shortIntro: e.target.value }))} />
                </div>
                <div>
                  <label className="med-label">Spiritual Essence</label>
                  <textarea className="med-input resize-none" rows={3} value={formData.spiritualEssence || ""} onChange={e => setFormData(p => ({ ...p, spiritualEssence: e.target.value }))} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="med-label">Ancient Origin</label>
                  <textarea className="med-input resize-none" rows={3} value={formData.ancientOrigin || ""} onChange={e => setFormData(p => ({ ...p, ancientOrigin: e.target.value }))} />
                </div>
                <div>
                  <label className="med-label">Chakra & Energy</label>
                  <input className="med-input mb-2" placeholder="Chakra Name" value={formData.chakraName || ""} onChange={e => setFormData(p => ({ ...p, chakraName: e.target.value }))} />
                  <textarea className="med-input resize-none" rows={2} placeholder="Chakra description" value={formData.chakraDescription || ""} onChange={e => setFormData(p => ({ ...p, chakraDescription: e.target.value }))} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="med-label">Mental & Emotional Benefits</label>
                  <input className="med-input mb-2" placeholder="Benefit 1" value={(formData.mentalBenefits?.[0]) || ""} onChange={e => setFormData(p => ({ ...p, mentalBenefits: [e.target.value, p.mentalBenefits?.[1] || "", p.mentalBenefits?.[2] || ""] }))} />
                  <input className="med-input mb-2" placeholder="Benefit 2" value={(formData.mentalBenefits?.[1]) || ""} onChange={e => setFormData(p => ({ ...p, mentalBenefits: [p.mentalBenefits?.[0] || "", e.target.value, p.mentalBenefits?.[2] || ""] }))} />
                  <input className="med-input" placeholder="Benefit 3" value={(formData.mentalBenefits?.[2]) || ""} onChange={e => setFormData(p => ({ ...p, mentalBenefits: [p.mentalBenefits?.[0] || "", p.mentalBenefits?.[1] || "", e.target.value] }))} />
                </div>
                <div>
                  <label className="med-label">Physical Benefits</label>
                  <input className="med-input mb-2" placeholder="Benefit 1" value={(formData.physicalBenefits?.[0]) || ""} onChange={e => setFormData(p => ({ ...p, physicalBenefits: [e.target.value, p.physicalBenefits?.[1] || "", p.physicalBenefits?.[2] || ""] }))} />
                  <input className="med-input mb-2" placeholder="Benefit 2" value={(formData.physicalBenefits?.[1]) || ""} onChange={e => setFormData(p => ({ ...p, physicalBenefits: [p.physicalBenefits?.[0] || "", e.target.value, p.physicalBenefits?.[2] || ""] }))} />
                  <input className="med-input" placeholder="Benefit 3" value={(formData.physicalBenefits?.[2]) || ""} onChange={e => setFormData(p => ({ ...p, physicalBenefits: [p.physicalBenefits?.[0] || "", p.physicalBenefits?.[1] || "", e.target.value] }))} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#b7e4c7]" style={{ background: "linear-gradient(135deg,#DCEDC1,#A8E6CF22)" }}>
              <button className="med-btn-outline" onClick={() => setIsModalOpen(false)} disabled={isUploading}>Cancel</button>
              <button className="med-btn-primary" onClick={handleSave} disabled={isUploading}>{isUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : selectedPose ? "Update" : "Save Pose"}</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} title="Delete Pose" description={`Are you sure you want to delete "${selectedPose?.name}"? This cannot be undone.`} confirmText="Delete" onConfirm={handleDeleteConfirm} variant="destructive" />
    </div>
  );
}

export default PosesContent;
