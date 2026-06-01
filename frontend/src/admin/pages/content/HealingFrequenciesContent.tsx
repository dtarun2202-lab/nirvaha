import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search, Plus, X, Image as ImageIcon, Loader2, CheckCircle, AlertCircle,
  Pencil, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Music, Copy,
  Headphones, Layers, Tag, ChevronDown, ChevronRight,
} from "lucide-react";
import BACKEND_CONFIG from "@/config/backend";

const BASE = BACKEND_CONFIG.API_BASE_URL;

type ToastType = "success" | "error";
interface Toast { id: number; msg: string; type: ToastType; }
interface MoodCategory { _id?: string; name: string; icon: string; isActive: boolean; displayOrder: number; }
interface SoundCollection { _id?: string; name: string; icon: string; description: string; isActive: boolean; displayOrder: number; cardCount?: number; }
interface SoundCard {
  _id?: string; collectionId?: string; collectionSlug?: string; moodSlug?: string;
  title: string; artist: string; description: string;
  coverImage: string; audioUrl: string; frequency: string; tag: string;
  duration: string; category: string; status: "Active" | "Draft"; displayOrder: number;
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} style={{ animation: "hfSlideIn 0.3s ease" }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto
            ${t.type === "success" ? "bg-[#A8E6CF] text-[#1a5c3a] border border-[#74c69d]" : "bg-red-100 text-red-700 border border-red-300"}`}>
          {t.type === "success" ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {t.msg}
          <button onClick={() => onRemove(t.id)} className="ml-2 opacity-60 hover:opacity-100"><X className="w-3 h-3" /></button>
        </div>
      ))}
    </div>
  );
}

function ImageDropZone({ file, previewUrl, onFile, label = "Upload image" }: { file: File | null; previewUrl?: string; onFile: (f: File | null) => void; label?: string; }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = file ? URL.createObjectURL(file) : previewUrl;
  return (
    <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
      onClick={() => inputRef.current?.click()}
      className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-2 p-4 min-h-[100px]
        ${dragging ? "border-[#52b788] bg-[#d8f3dc]" : "border-[#b7e4c7] bg-[#f0fff4] hover:border-[#74c69d] hover:bg-[#e8f5e9]"}`}>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => onFile(e.target.files?.[0] || null)} />
      {preview ? <img src={preview} alt="preview" className="w-full h-24 object-cover rounded-lg" />
        : <><ImageIcon className="w-6 h-6 text-[#74c69d]" /><p className="text-xs text-[#52b788] font-medium text-center">{label}</p><p className="text-[10px] text-[#95d5b2]">drag & drop or click</p></>}
      {(file || preview) && (
        <button onClick={e => { e.stopPropagation(); onFile(null); }}
          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/80 flex items-center justify-center text-red-400 hover:text-red-600 shadow">
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

function AudioDropZone({ file, existingUrl, onFile }: { file: File | null; existingUrl?: string; onFile: (f: File | null) => void; }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
      onClick={() => inputRef.current?.click()}
      className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-2 p-4 min-h-[80px]
        ${dragging ? "border-[#52b788] bg-[#d8f3dc]" : "border-[#b7e4c7] bg-[#f0fff4] hover:border-[#74c69d] hover:bg-[#e8f5e9]"}`}>
      <input ref={inputRef} type="file" accept="audio/*" className="hidden" onChange={e => onFile(e.target.files?.[0] || null)} />
      {file ? <div className="flex items-center gap-2 text-[#2d6a4f] text-xs font-medium"><Music className="w-4 h-4 flex-shrink-0" /><span className="truncate max-w-[180px]">{file.name}</span></div>
        : existingUrl ? <div className="flex items-center gap-2 text-[#2d6a4f] text-xs font-medium"><Music className="w-4 h-4 flex-shrink-0" /><span className="truncate max-w-[180px]">Audio uploaded</span></div>
        : <><Music className="w-6 h-6 text-[#74c69d]" /><p className="text-xs text-[#52b788] font-medium">Upload audio file</p><p className="text-[10px] text-[#95d5b2]">MP3, WAV, OGG</p></>}
      {(file || existingUrl) && (
        <button onClick={e => { e.stopPropagation(); onFile(null); }}
          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/80 flex items-center justify-center text-red-400 hover:text-red-600 shadow">
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border
      ${active ? "bg-[#d8f3dc] text-[#1b4332] border-[#95d5b2]" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-[#52b788]" : "bg-gray-400"}`} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function ConfirmDeleteModal({ open, title, onConfirm, onCancel }: { open: boolean; title: string; onConfirm: () => void; onCancel: () => void; }) {
  if (!open) return null;
  return (
    <div className="hf-overlay" onClick={onCancel}>
      <div className="hf-modal hf-modal-anim" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#d8f3dc]" style={{ background: "linear-gradient(135deg,#A8E6CF33,#DCEDC122)" }}>
          <div className="flex items-center gap-3"><AlertCircle className="w-5 h-5 text-red-500" /><h2 className="text-base font-bold text-[#1b4332]">Confirm Delete</h2></div>
          <button onClick={onCancel} className="w-8 h-8 rounded-full flex items-center justify-center text-[#74c69d] hover:bg-[#d8f3dc] transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-6 py-5"><p className="text-sm text-[#2d6a4f]">Delete <strong>&quot;{title}&quot;</strong>? This cannot be undone.</p></div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#b7e4c7]" style={{ background: "linear-gradient(135deg,#DCEDC1,#A8E6CF22)" }}>
          <button className="hf-btn-outline" onClick={onCancel}>Cancel</button>
          <button className="hf-btn-primary" style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)" }} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

async function uploadFile(file: File, field: "image" | "audio"): Promise<string> {
  const fd = new FormData();
  if (field === "audio") {
    fd.append("audio", file);
    const res = await fetch(`${BASE}/api/upload/media`, { method: "POST", body: fd });
    if (!res.ok) throw new Error("Audio upload failed");
    const data = await res.json();
    return data.audioUrl || "";
  } else {
    fd.append("file", file); // /api/upload uses upload.single("file")
    const res = await fetch(`${BASE}/api/upload`, { method: "POST", body: fd });
    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json();
    return data.url ? `${BASE}${data.url}` : "";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SEEDED_IDS — _id values of the 15 default frontend cards seeded into the DB.
// These cards are hidden from the admin table but remain available in the
// Replace Existing Card dropdown and on the frontend.
// Source: scripts/read_seeded_ids.js (read-only query, no writes).
// ─────────────────────────────────────────────────────────────────────────────
const SEEDED_IDS = new Set([
  // ── Mood Category seeded cards (15) ──────────────────────────────────────
  '6a1c1307050dac7dae0321c6', // stress — Ocean Waves Calm
  '6a1c1308050dac7dae0321c9', // stress — Forest Rain
  '6a1c1309050dac7dae0321cc', // stress — Tibetan Bowls
  '6a1c130a050dac7dae0321cf', // anxiety — Gentle Rain Drops
  '6a1c130a050dac7dae0321d2', // anxiety — Misty Forest Stream
  '6a1c130b050dac7dae0321d5', // anxiety — Soft Meadow Breeze
  '6a1c130b050dac7dae0321d8', // sleep-issues — Night Ocean Waves
  '6a1c130c050dac7dae0321db', // sleep-issues — Starlit Delta Waves
  '6a1c130c050dac7dae0321de', // sleep-issues — Moonlight Lullaby
  '6a1c130c050dac7dae0321e1', // focus — Clear Mind Frequencies
  '6a1c130c050dac7dae0321e4', // focus — Minimal Nature Sounds
  '6a1c130c050dac7dae0321e7', // focus — Productivity Flow
  '6a1c130d050dac7dae0321ea', // emotional-balance — Chakra Harmony
  '6a1c130d050dac7dae0321ed', // emotional-balance — Sacred Geometry
  '6a1c130d050dac7dae0321f0', // emotional-balance — Healing Bowls
  // ── Collection seeded cards (12) ─────────────────────────────────────────
  '6a1c264824a2f7828734906c', // meditation [0] — Meditation at Sunrise
  '6a1c264824a2f7828734906d', // meditation [1] — Indoor Calm Meditation
  '6a1c264824a2f7828734906e', // meditation [2] — Nature Meditation
  '6a1c264824a2f78287349071', // sleep [0] — Cozy Bed
  '6a1c264824a2f78287349072', // sleep [1] — Window Night Sky View
  '6a1c264824a2f78287349073', // sleep [2] — Peaceful Sleeping Scene
  '6a1c264824a2f78287349076', // focus [0] — Productivity Flow
  '6a1c264824a2f78287349077', // focus [1] — Clear Mind Frequencies
  '6a1c264824a2f78287349078', // focus [2] — Minimal Nature Sounds
  '6a1c264924a2f7828734907b', // nature [0] — Ocean Waves Calm
  '6a1c264924a2f7828734907c', // nature [1] — Forest Rain
  '6a1c264924a2f7828734907d', // nature [2] — Gentle Rain Drops
]);

// ─────────────────────────────────────────────────────────────────────────────
// MOOD CATEGORIES PANEL — 5 fixed folders, Manage Cards per category
// ─────────────────────────────────────────────────────────────────────────────

const FIXED_MOOD_CATEGORIES = [
  { slug: "stress",            name: "Stress",            category: "Stress"            },
  { slug: "anxiety",           name: "Anxiety",           category: "Anxiety"           },
  { slug: "sleep-issues",      name: "Sleep Issues",      category: "Sleep Issues"      },
  { slug: "focus",             name: "Focus",             category: "Focus"             },
  { slug: "emotional-balance", name: "Emotional Balance", category: "Emotional Balance" },
];

function MoodCategoriesPanel({ addToast }: { addToast: (m: string, t?: ToastType) => void }) {
  const [cardCounts, setCardCounts] = useState<Record<string, number>>({});
  const [openMood, setOpenMood] = useState<{ name: string; slug: string; category: string } | null>(null);

  useEffect(() => {
    FIXED_MOOD_CATEGORIES.forEach(async mood => {
      try {
        const res = await fetch(`${BASE}/api/healing-frequencies/cards/all?moodSlug=${mood.slug}`);
        const data = await res.json();
        setCardCounts(prev => ({ ...prev, [mood.slug]: (data.cards || []).length }));
      } catch { /* ignore */ }
    });
  }, []);

  const refreshCount = (slug: string) => {
    fetch(`${BASE}/api/healing-frequencies/cards/all?moodSlug=${slug}`)
      .then(r => r.json())
      .then(d => setCardCounts(prev => ({ ...prev, [slug]: (d.cards || []).length })))
      .catch(() => {});
  };

  if (openMood) {
    return (
      <MoodCardsPanel
        moodName={openMood.name}
        moodSlug={openMood.slug}
        moodCategory={openMood.category}
        addToast={addToast}
        onBack={() => { refreshCount(openMood.slug); setOpenMood(null); }}
      />
    );
  }

  return (
    <div>
      <div className="hf-card mx-4 sm:mx-0 mb-4 p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#e8f5e9" }}>
            <Tag className="w-5 h-5" style={{ color: "#52b788" }} />
          </div>
          <h2 className="text-lg font-bold text-[#1b4332]">Mood Categories</h2>
        </div>
      </div>
      <div className="hf-card mx-4 sm:mx-0 overflow-hidden">
        <div className="hf-table-wrap">
          <table className="hf-table w-full text-sm">
            <thead>
              <tr style={{ background: "linear-gradient(135deg,#A8E6CF,#DCEDC1)" }}>
                {["Category Name", "Sound Cards", "Display Order", "Manage Cards", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-4 text-xs font-bold text-[#1b4332] uppercase tracking-wider border-b border-[#b7e4c7] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FIXED_MOOD_CATEGORIES.map((mood, i) => (
                <tr key={mood.slug} className="hf-row border-b border-[#d8f3dc]"
                  style={{ background: i % 2 === 0 ? "rgba(240,255,244,0.8)" : "rgba(220,237,193,0.35)" }}>
                  <td className="px-4 py-3"><span className="font-semibold text-[#1b4332]">{mood.name}</span></td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-[#2d6a4f] font-semibold text-sm">
                      <Music className="w-3.5 h-3.5" />{cardCounts[mood.slug] ?? 0} cards
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#d8f3dc] text-[#1b4332] font-bold text-sm border border-[#b7e4c7]">{i + 1}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setOpenMood({ name: mood.name, slug: mood.slug, category: mood.category })}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border-2 border-[#52b788] text-[#1b4332] bg-[#d8f3dc] hover:bg-[#A8E6CF] transition-all hover:scale-105 whitespace-nowrap"
                    >
                      <Music className="w-3.5 h-3.5" /> Manage Cards
                    </button>
                  </td>
                  <td className="px-4 py-3"><span className="text-xs text-[#95d5b2] italic">Fixed folder</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-[#d8f3dc] flex items-center justify-between" style={{ background: "rgba(240,255,244,0.6)" }}>
            <span className="text-xs text-[#74c69d] font-medium">5 mood categories total</span>
            <Tag className="w-4 h-4 text-[#95d5b2]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOOD CARDS PANEL — sound cards inside a mood category
// ─────────────────────────────────────────────────────────────────────────────
function MoodCardsPanel({ moodName, moodSlug, moodCategory, addToast, onBack }: {
  moodName: string; moodSlug: string; moodCategory: string;
  addToast: (m: string, t?: ToastType) => void; onBack: () => void;
}) {
  const [cards, setCards] = useState<SoundCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debSearch, setDebSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  // Content Action — only relevant when opening the modal for a new card (not editing)
  const [contentAction, setContentAction] = useState<"add" | "replace">("add");
  const [replaceTargetId, setReplaceTargetId] = useState<string>("");
  const [selected, setSelected] = useState<SoundCard | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrlInput, setAudioUrlInput] = useState("");
  const [useAudioUrl, setUseAudioUrl] = useState(false);

  const emptyForm = (): Omit<SoundCard, "_id" | "displayOrder"> => ({
    moodSlug, collectionId: undefined, collectionSlug: undefined,
    title: "", artist: "", description: "", coverImage: "",
    audioUrl: "", frequency: "", tag: "", duration: "",
    category: moodCategory, status: "Draft",
  });
  const [form, setForm] = useState<Omit<SoundCard, "_id" | "displayOrder">>(emptyForm());

  useEffect(() => { const t = setTimeout(() => setDebSearch(search), 300); return () => clearTimeout(t); }, [search]);

  const load = useCallback(async (q?: string) => {
    setLoading(true);
    try {
      const url = `${BASE}/api/healing-frequencies/cards/all?moodSlug=${moodSlug}${q ? `&search=${encodeURIComponent(q)}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      setCards(data.cards || []);
    } catch { addToast("Failed to load cards", "error"); }
    finally { setLoading(false); }
  }, [moodSlug, addToast]);

  useEffect(() => { load(debSearch); }, [debSearch, load]);

  const resetForm = () => { setForm(emptyForm()); setImageFile(null); setAudioFile(null); setAudioUrlInput(""); setUseAudioUrl(false); };

  // Open modal for adding a new card
  const openAdd = () => {
    setSelected(null);
    setContentAction("add");
    setReplaceTargetId("");
    resetForm();
    setIsModalOpen(true);
  };

  // Open modal for editing an existing card
  const openEdit = (c: SoundCard) => {
    setSelected(c);
    setForm({ moodSlug: c.moodSlug || moodSlug, collectionId: undefined, collectionSlug: undefined, title: c.title, artist: c.artist || "", description: c.description, coverImage: c.coverImage, audioUrl: c.audioUrl, frequency: c.frequency, tag: c.tag, duration: c.duration, category: c.category || moodCategory, status: c.status });
    setImageFile(null); setAudioFile(null);
    setUseAudioUrl(!!c.audioUrl); setAudioUrlInput(c.audioUrl || "");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { addToast("Title is required", "error"); return; }
    if (!selected && contentAction === "replace" && !replaceTargetId) {
      addToast("Please select a card to replace", "error"); return;
    }
    setIsSaving(true);
    try {
      let coverImage = form.coverImage;
      let audioUrl = useAudioUrl ? audioUrlInput : form.audioUrl;
      if (imageFile) coverImage = await uploadFile(imageFile, "image");
      if (audioFile && !useAudioUrl) audioUrl = await uploadFile(audioFile, "audio");
      const payload = { ...form, moodSlug, coverImage, audioUrl };

      if (selected) {
        // Normal edit — update the selected card
        const res = await fetch(`${BASE}/api/healing-frequencies/cards/${selected._id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).message || "Update failed");
        await load(debSearch); setIsModalOpen(false);
        addToast("Card updated ✓");
      } else if (contentAction === "replace") {
        // Replace existing card in-place — preserves its displayOrder/position
        const res = await fetch(`${BASE}/api/healing-frequencies/cards/${replaceTargetId}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).message || "Replace failed");
        await load(debSearch); setIsModalOpen(false);
        addToast("Card replaced ✓");
      } else {
        // Add new card
        const res = await fetch(`${BASE}/api/healing-frequencies/cards`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).message || "Save failed");
        await load(debSearch); setIsModalOpen(false);
        addToast("Card added ✓");
      }
    } catch (e) { addToast((e as Error).message, "error"); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async () => {
    if (!selected?._id) return;
    try {
      await fetch(`${BASE}/api/healing-frequencies/cards/${selected._id}`, { method: "DELETE" });
      await load(debSearch); setIsDeleteOpen(false); addToast("Card deleted");
    } catch { addToast("Delete failed", "error"); }
  };

  const handleMove = async (i: number, dir: "up" | "down") => {
    if ((dir === "up" && i === 0) || (dir === "down" && i === cards.length - 1)) return;
    const next = [...cards]; const si = dir === "up" ? i - 1 : i + 1;
    [next[i], next[si]] = [next[si], next[i]]; setCards(next);
    try {
      await fetch(`${BASE}/api/healing-frequencies/cards/reorder`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: next.map(c => c._id) }),
      });
      addToast("Order updated");
    } catch { load(debSearch); }
  };

  return (
    <div>
      <div className="hf-card mx-4 sm:mx-0 mb-4 p-5">
        <button onClick={onBack} className="flex items-center gap-2 text-[#52b788] hover:text-[#2d6a4f] text-sm font-semibold mb-4 transition-colors">
          <ChevronDown className="w-4 h-4 rotate-90" /> Back to Mood Categories
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#e8f5e9" }}>
              <Tag className="w-5 h-5" style={{ color: "#52b788" }} />
            </div>
            <h2 className="text-lg font-bold text-[#1b4332]">{moodName}</h2>
          </div>
          {/* Single entry-point — Add/Replace is chosen inside the modal */}
          <button className="hf-btn-primary self-start sm:self-auto" onClick={openAdd}>
            <Plus className="w-4 h-4" /> Add Sound Card
          </button>
        </div>
        <div className="hf-search-wrap">
          <Search className="hf-search-icon w-4 h-4" />
          <input className="hf-search-input" placeholder="Search sound cards..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="hf-card mx-4 sm:mx-0 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3"><Loader2 className="w-8 h-8 text-[#52b788] animate-spin" /><p className="text-sm font-semibold text-[#1b4332]">Loading cards...</p></div>
        ) : (() => {
          // adminCards: seeded default cards hidden — used only for the table.
          // The full `cards` array (including seeded) is kept for the Replace dropdown.
          const adminCards = cards.filter(c => !SEEDED_IDS.has(String(c._id)));
          return adminCards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "#e8f5e9" }}><Music className="w-9 h-9" style={{ color: "#74c69d" }} /></div>
              <div>
                <p className="text-base font-bold text-[#1b4332] mb-1">No Admin Cards Found</p>
                <p className="text-sm text-[#40916c] max-w-xs">No admin-created cards in {moodName} yet. Add your first card.</p>
              </div>
            </div>
          ) : (
            <div className="hf-table-wrap">
              <table className="hf-table w-full text-sm">
                <thead>
                  <tr style={{ background: "linear-gradient(135deg,#A8E6CF,#DCEDC1)" }}>
                    {["Preview", "Title", "Category", "Frequency", "Duration", "Status", "Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-4 text-xs font-bold text-[#1b4332] uppercase tracking-wider border-b border-[#b7e4c7] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {adminCards.map((c, i) => (
                    <tr key={c._id || i} className="hf-row border-b border-[#d8f3dc]" style={{ background: i % 2 === 0 ? "rgba(240,255,244,0.8)" : "rgba(220,237,193,0.35)" }}>
                      <td className="px-4 py-3">
                        {c.coverImage
                          ? <img src={c.coverImage} alt={c.title} className="w-14 h-14 rounded-xl object-cover border-2 border-[#b7e4c7] shadow-sm" style={{ minWidth: 56 }} />
                          : <div className="w-14 h-14 rounded-xl border-2 border-dashed border-[#b7e4c7] flex items-center justify-center bg-[#f0fff4]"><ImageIcon className="w-5 h-5 text-[#95d5b2]" /></div>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-[#1b4332]">{c.title}</span>
                        {c.audioUrl && <audio controls src={c.audioUrl} className="mt-1 h-6 w-32" style={{ accentColor: "#52b788" }} />}
                      </td>
                      <td className="px-4 py-3"><span className="text-[#2d6a4f] text-xs font-medium">{c.category || "—"}</span></td>
                      <td className="px-4 py-3"><span className="text-[#2d6a4f] text-xs font-medium">{c.frequency || "—"}</span></td>
                      <td className="px-4 py-3"><span className="text-[#2d6a4f] text-xs font-medium">{c.duration || "—"}</span></td>
                      <td className="px-4 py-3"><StatusBadge active={c.status === "Active"} /></td>
                      <td className="px-4 py-3">
                        <div className="hf-actions flex items-center gap-1.5 flex-wrap">
                          <button onClick={() => openEdit(c)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#95d5b2] text-[#2d6a4f] hover:bg-[#A8E6CF] transition-all hover:scale-105"><Pencil className="w-3 h-3" /> Edit</button>
                          <button onClick={() => { setSelected(c); setIsDeleteOpen(true); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition-all hover:scale-105"><Trash2 className="w-3 h-3" /> Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-3 border-t border-[#d8f3dc] flex items-center justify-between" style={{ background: "rgba(240,255,244,0.6)" }}>
                <span className="text-xs text-[#74c69d] font-medium">{adminCards.length} admin card{adminCards.length !== 1 ? "s" : ""}{debSearch ? " found" : " total"}</span>
                <Music className="w-4 h-4 text-[#95d5b2]" />
              </div>
            </div>
          );
        })()}
      </div>
      {isModalOpen && (
        <div className="hf-overlay" onClick={() => !isSaving && setIsModalOpen(false)}>
          <div className="hf-modal hf-modal-anim" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#d8f3dc]" style={{ background: "linear-gradient(135deg,#A8E6CF33,#DCEDC122)" }}>
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-[#52b788]" />
                <h2 className="text-base font-bold text-[#1b4332]">
                  {selected
                    ? "Edit Sound Card"
                    : contentAction === "replace"
                      ? `Replace Existing Card — ${moodName}`
                      : `Add New Card — ${moodName}`}
                </h2>
              </div>
              <button onClick={() => !isSaving && setIsModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#74c69d] hover:bg-[#d8f3dc] transition-colors"><X className="w-4 h-4" /></button>
            </div>

            {/* Form body */}
            <div className="px-6 py-5 space-y-5">

              {/* ── Content Action (only shown when adding, not editing) ── */}
              {!selected && (
                <div>
                  <label className="hf-label">Content Action</label>
                  <div className="flex gap-3 mb-1">
                    <button
                      type="button"
                      onClick={() => { setContentAction("add"); setReplaceTargetId(""); resetForm(); }}
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

                  {/* Replace target dropdown — only cards from this mood category */}
                  {contentAction === "replace" && (
                    <div className="mt-3">
                      <label className="hf-label">Select Card to Replace</label>
                      <select
                        className="hf-select"
                        value={replaceTargetId}
                        onChange={e => {
                          const id = e.target.value;
                          setReplaceTargetId(id);
                          // Pre-fill form with the selected card's existing data
                          const target = cards.find(c => c._id === id);
                          if (target) {
                            setForm({
                              moodSlug: target.moodSlug || moodSlug,
                              collectionId: undefined,
                              collectionSlug: undefined,
                              title: target.title,
                              artist: target.artist || "",
                              description: target.description,
                              coverImage: target.coverImage,
                              audioUrl: target.audioUrl,
                              frequency: target.frequency,
                              tag: target.tag,
                              duration: target.duration,
                              category: target.category || moodCategory,
                              status: target.status,
                            });
                            setImageFile(null);
                            setAudioFile(null);
                            setUseAudioUrl(!!target.audioUrl);
                            setAudioUrlInput(target.audioUrl || "");
                          }
                        }}
                      >
                        <option value="">— Choose a card to replace —</option>
                        {cards.map(c => (
                          <option key={c._id} value={c._id}>{c.title}</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-[#95d5b2] mt-1">
                        Only cards from <strong>{moodName}</strong> are shown. The selected card will be updated in-place, preserving its position.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Card Information */}
              <div>
                <p className="text-xs font-bold text-[#52b788] uppercase tracking-widest mb-3 pb-1 border-b border-[#d8f3dc]">Card Information</p>
                <div className="space-y-3">
                  <div><label className="hf-label">Title *</label><input className="hf-input" placeholder="e.g. Ocean Waves Calm" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
                  <div><label className="hf-label">Description</label><textarea className="hf-input" rows={2} style={{ resize: "none" }} placeholder="Brief description..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="hf-label">Frequency (Hz)</label><input className="hf-input" placeholder="e.g. 432 Hz" value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))} /></div>
                    <div><label className="hf-label">Duration</label><input className="hf-input" placeholder="e.g. 15:00" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="hf-label">Category</label><input className="hf-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Stress Relief" /></div>
                    <div>
                      <label className="hf-label">Status</label>
                      <select className="hf-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as "Active" | "Draft" }))}>
                        <option value="Draft">Draft</option>
                        <option value="Active">Active</option>
                      </select>
                    </div>
                  </div>
                  <div><label className="hf-label">Tag</label><input className="hf-input" placeholder="e.g. calm, relax" value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} /></div>
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <p className="text-xs font-bold text-[#52b788] uppercase tracking-widest mb-3 pb-1 border-b border-[#d8f3dc]">Cover Image</p>
                <ImageDropZone file={imageFile} previewUrl={form.coverImage || undefined} onFile={f => { setImageFile(f); if (!f) setForm(p => ({ ...p, coverImage: "" })); }} label="Upload cover image" />
              </div>

              {/* Audio */}
              <div>
                <p className="text-xs font-bold text-[#52b788] uppercase tracking-widest mb-3 pb-1 border-b border-[#d8f3dc]">Audio</p>
                <div className="flex items-center gap-3 mb-3">
                  <button onClick={() => setUseAudioUrl(false)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${!useAudioUrl ? "bg-[#52b788] text-white border-[#52b788]" : "border-[#b7e4c7] text-[#2d6a4f] hover:bg-[#d8f3dc]"}`}>Upload File</button>
                  <button onClick={() => setUseAudioUrl(true)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${useAudioUrl ? "bg-[#52b788] text-white border-[#52b788]" : "border-[#b7e4c7] text-[#2d6a4f] hover:bg-[#d8f3dc]"}`}>Audio URL</button>
                </div>
                {useAudioUrl
                  ? <input className="hf-input" placeholder="https://..." value={audioUrlInput} onChange={e => setAudioUrlInput(e.target.value)} />
                  : <AudioDropZone file={audioFile} existingUrl={form.audioUrl || undefined} onFile={f => { setAudioFile(f); if (!f) setForm(p => ({ ...p, audioUrl: "" })); }} />}
                {(form.audioUrl || audioUrlInput) && !audioFile && (
                  <audio controls src={useAudioUrl ? audioUrlInput : form.audioUrl} className="mt-2 w-full h-8" style={{ accentColor: "#52b788" }} />
                )}
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#b7e4c7]" style={{ background: "linear-gradient(135deg,#DCEDC1,#A8E6CF22)" }}>
              <button className="hf-btn-outline" onClick={() => setIsModalOpen(false)} disabled={isSaving}>Cancel</button>
              <button className="hf-btn-primary" onClick={handleSave} disabled={isSaving}>
                {isSaving
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  : selected
                    ? "Update Card"
                    : contentAction === "replace"
                      ? "Replace Card"
                      : "Save Card"}
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDeleteModal open={isDeleteOpen} title={selected?.title || ""} onConfirm={handleDelete} onCancel={() => setIsDeleteOpen(false)} />
    </div>
  );
}

function SoundCardsPanel({ collectionName, collectionId, collectionSlug, collectionCategory, moodCategories, addToast, onBack }: {
  collectionName: string; collectionId?: string; collectionSlug?: string; collectionCategory?: string;
  moodCategories: MoodCategory[];
  addToast: (m: string, t?: ToastType) => void; onBack: () => void;
}) {
  const [cards, setCards] = useState<SoundCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debSearch, setDebSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  // Content Action — only relevant when opening the modal for a new card (not editing)
  const [contentAction, setContentAction] = useState<"add" | "replace">("add");
  const [replaceTargetId, setReplaceTargetId] = useState<string>("");
  const [selected, setSelected] = useState<SoundCard | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrlInput, setAudioUrlInput] = useState("");
  const [useAudioUrl, setUseAudioUrl] = useState(false);

  const emptyForm = (): Omit<SoundCard, "_id" | "displayOrder"> => ({
    collectionId: collectionId || undefined,
    collectionSlug: collectionSlug || undefined,
    title: "", artist: "", description: "", coverImage: "",
    audioUrl: "", frequency: "", tag: "", duration: "",
    category: collectionCategory || "", status: "Draft",
  });
  const [form, setForm] = useState<Omit<SoundCard, "_id" | "displayOrder">>(emptyForm());

  useEffect(() => { const t = setTimeout(() => setDebSearch(search), 300); return () => clearTimeout(t); }, [search]);

  const load = useCallback(async (q?: string) => {
    setLoading(true);
    try {
      const param = collectionSlug ? `collectionSlug=${collectionSlug}` : `collectionId=${collectionId}`;
      const url = `${BASE}/api/healing-frequencies/cards/all?${param}${q ? `&search=${encodeURIComponent(q)}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      setCards(data.cards || []);
    } catch { addToast("Failed to load cards", "error"); }
    finally { setLoading(false); }
  }, [collectionId, collectionSlug, addToast]);

  useEffect(() => { load(debSearch); }, [debSearch, load]);

  const resetForm = () => { setForm(emptyForm()); setImageFile(null); setAudioFile(null); setAudioUrlInput(""); setUseAudioUrl(false); };

  // Open modal for adding a new card (or replacing an existing one)
  const openAdd = () => {
    setSelected(null);
    setContentAction("add");
    setReplaceTargetId("");
    resetForm();
    setIsModalOpen(true);
  };
  const openEdit = (c: SoundCard) => {
    setSelected(c);
    setForm({ collectionId: c.collectionId, collectionSlug: c.collectionSlug, title: c.title, artist: c.artist || "", description: c.description, coverImage: c.coverImage, audioUrl: c.audioUrl, frequency: c.frequency, tag: c.tag, duration: c.duration, category: c.category, status: c.status });
    setImageFile(null); setAudioFile(null);
    setUseAudioUrl(!!c.audioUrl); setAudioUrlInput(c.audioUrl || "");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { addToast("Title is required", "error"); return; }
    if (!selected && contentAction === "replace" && !replaceTargetId) {
      addToast("Please select a card to replace", "error"); return;
    }
    setIsSaving(true);
    try {
      let coverImage = form.coverImage;
      let audioUrl = useAudioUrl ? audioUrlInput : form.audioUrl;
      if (imageFile) coverImage = await uploadFile(imageFile, "image");
      if (audioFile && !useAudioUrl) audioUrl = await uploadFile(audioFile, "audio");
      const payload = { ...form, coverImage, audioUrl };

      if (selected) {
        // Normal edit — update the selected card
        const res = await fetch(`${BASE}/api/healing-frequencies/cards/${selected._id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).message || "Update failed");
        await load(debSearch); setIsModalOpen(false);
        addToast("Card updated ✓");
      } else if (contentAction === "replace") {
        // Replace existing card in-place — preserves its displayOrder/position
        const res = await fetch(`${BASE}/api/healing-frequencies/cards/${replaceTargetId}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).message || "Replace failed");
        await load(debSearch); setIsModalOpen(false);
        addToast("Card replaced ✓");
      } else {
        // Add new card
        const res = await fetch(`${BASE}/api/healing-frequencies/cards`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).message || "Save failed");
        await load(debSearch); setIsModalOpen(false);
        addToast("Card added ✓");
      }
    } catch (e) { addToast((e as Error).message, "error"); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async () => {
    if (!selected?._id) return;
    try {
      await fetch(`${BASE}/api/healing-frequencies/cards/${selected._id}`, { method: "DELETE" });
      await load(debSearch); setIsDeleteOpen(false); addToast("Card deleted");
    } catch { addToast("Delete failed", "error"); }
  };

  const handleDuplicate = async (c: SoundCard) => {
    if (!c._id) return;
    try {
      await fetch(`${BASE}/api/healing-frequencies/cards/${c._id}/duplicate`, { method: "POST" });
      await load(debSearch); addToast("Card duplicated \u2713");
    } catch { addToast("Duplicate failed", "error"); }
  };

  const handleToggle = async (c: SoundCard) => {
    if (!c._id) return;
    const newStatus = c.status === "Active" ? "Draft" : "Active";
    try {
      await fetch(`${BASE}/api/healing-frequencies/cards/${c._id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setCards(p => p.map(x => x._id === c._id ? { ...x, status: newStatus } : x));
      addToast(`Card ${newStatus === "Active" ? "activated" : "deactivated"}`);
    } catch { addToast("Toggle failed", "error"); }
  };

  const handleMove = async (i: number, dir: "up" | "down") => {
    if ((dir === "up" && i === 0) || (dir === "down" && i === cards.length - 1)) return;
    const next = [...cards]; const si = dir === "up" ? i - 1 : i + 1;
    [next[i], next[si]] = [next[si], next[i]]; setCards(next);
    try {
      await fetch(`${BASE}/api/healing-frequencies/cards/reorder`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: next.map(c => c._id) }),
      });
      addToast("Order updated");
    } catch { load(debSearch); }
  };

  const allCategories = [
    ...moodCategories.map(c => c.name),
    "Meditation", "Sleep", "Focus", "Nature", "Binaural", "Ambient", "Bowl Therapy",
    "Stress Relief", "Anxiety", "Sleep Issues", "Emotional Balance",
  ].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div>
      <div className="hf-card mx-4 sm:mx-0 mb-4 p-5">
        <button onClick={onBack} className="flex items-center gap-2 text-[#52b788] hover:text-[#2d6a4f] text-sm font-semibold mb-4 transition-colors">
          <ChevronDown className="w-4 h-4 rotate-90" /> Back to Collections
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#e8f5e9" }}>
              <Music className="w-5 h-5" style={{ color: "#52b788" }} />
            </div>
            <h2 className="text-lg font-bold text-[#1b4332]">{collectionName}</h2>
          </div>
          <button className="hf-btn-primary self-start sm:self-auto" onClick={openAdd}><Plus className="w-4 h-4" /> Add Sound Card</button>
        </div>
        <div className="hf-search-wrap">
          <Search className="hf-search-icon w-4 h-4" />
          <input className="hf-search-input" placeholder="Search sound cards..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="hf-card mx-4 sm:mx-0 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3"><Loader2 className="w-8 h-8 text-[#52b788] animate-spin" /><p className="text-sm font-semibold text-[#1b4332]">Loading cards...</p></div>
        ) : (() => {
          // adminCards: seeded default cards hidden — used only for the table.
          // The full `cards` array (including seeded) is kept for the Replace dropdown.
          const adminCards = cards.filter(c => !SEEDED_IDS.has(String(c._id)));
          return adminCards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "#e8f5e9" }}>
                <Music className="w-9 h-9" style={{ color: "#74c69d" }} />
              </div>
              <div>
                <p className="text-base font-bold text-[#1b4332] mb-1">No Admin Cards Found</p>
                <p className="text-sm text-[#40916c] max-w-xs">No admin-created cards in {collectionName} yet. Add your first card.</p>
              </div>
            </div>
          ) : (
            <div className="hf-table-wrap">
              <table className="hf-table w-full text-sm">
                <thead>
                  <tr style={{ background: "linear-gradient(135deg,#A8E6CF,#DCEDC1)" }}>
                    {["Preview", "Title", "Category", "Frequency", "Duration", "Status", "Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-4 text-xs font-bold text-[#1b4332] uppercase tracking-wider border-b border-[#b7e4c7] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {adminCards.map((c, i) => (
                    <tr key={c._id || i} className="hf-row border-b border-[#d8f3dc]" style={{ background: i % 2 === 0 ? "rgba(240,255,244,0.8)" : "rgba(220,237,193,0.35)" }}>
                      <td className="px-4 py-3">
                        {c.coverImage
                          ? <img src={c.coverImage} alt={c.title} className="w-14 h-14 rounded-xl object-cover border-2 border-[#b7e4c7] shadow-sm" style={{ minWidth: 56 }} />
                          : <div className="w-14 h-14 rounded-xl border-2 border-dashed border-[#b7e4c7] flex items-center justify-center bg-[#f0fff4]"><ImageIcon className="w-5 h-5 text-[#95d5b2]" /></div>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-[#1b4332]">{c.title}</span>
                        {c.artist && <p className="text-xs text-[#74c69d] mt-0.5">{c.artist}</p>}
                        {c.audioUrl && <audio controls src={c.audioUrl} className="mt-1 h-6 w-32" style={{ accentColor: "#52b788" }} />}
                      </td>
                      <td className="px-4 py-3"><span className="text-[#2d6a4f] text-xs font-medium">{c.category || "—"}</span></td>
                      <td className="px-4 py-3"><span className="text-[#2d6a4f] text-xs font-medium">{c.frequency || "—"}</span></td>
                      <td className="px-4 py-3"><span className="text-[#2d6a4f] text-xs font-medium">{c.duration || "—"}</span></td>
                      <td className="px-4 py-3"><StatusBadge active={c.status === "Active"} /></td>
                      <td className="px-4 py-3">
                        <div className="hf-actions flex items-center gap-1.5 flex-wrap">
                          <button onClick={() => openEdit(c)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#95d5b2] text-[#2d6a4f] hover:bg-[#A8E6CF] transition-all hover:scale-105"><Pencil className="w-3 h-3" /> Edit</button>
                          <button onClick={() => { setSelected(c); setIsDeleteOpen(true); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition-all hover:scale-105"><Trash2 className="w-3 h-3" /> Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-3 border-t border-[#d8f3dc] flex items-center justify-between" style={{ background: "rgba(240,255,244,0.6)" }}>
                <span className="text-xs text-[#74c69d] font-medium">{adminCards.length} admin card{adminCards.length !== 1 ? "s" : ""}{debSearch ? " found" : " total"}</span>
                <Music className="w-4 h-4 text-[#95d5b2]" />
              </div>
            </div>
          );
        })()}
      </div>

      {/* Sound Card Modal */}
      {isModalOpen && (
        <div className="hf-overlay" onClick={() => !isSaving && setIsModalOpen(false)}>
          <div className="hf-modal hf-modal-anim" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#d8f3dc]" style={{ background: "linear-gradient(135deg,#A8E6CF33,#DCEDC122)" }}>
              <div className="flex items-center gap-3"><Music className="w-5 h-5 text-[#52b788]" /><h2 className="text-base font-bold text-[#1b4332]">
                  {selected
                    ? "Edit Sound Card"
                    : contentAction === "replace"
                      ? `Replace Existing Card — ${collectionName}`
                      : `Add New Card — ${collectionName}`}
                </h2></div>
              <button onClick={() => !isSaving && setIsModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#74c69d] hover:bg-[#d8f3dc] transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="px-6 py-5 space-y-5">

              {/* ── Content Action (only shown when adding, not editing) ── */}
              {!selected && (
                <div>
                  <label className="hf-label">Content Action</label>
                  <div className="flex gap-3 mb-1">
                    <button
                      type="button"
                      onClick={() => { setContentAction("add"); setReplaceTargetId(""); resetForm(); }}
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

                  {/* Replace target dropdown — only cards from this collection */}
                  {contentAction === "replace" && (
                    <div className="mt-3">
                      <label className="hf-label">Select Card to Replace</label>
                      <select
                        className="hf-select"
                        value={replaceTargetId}
                        onChange={e => {
                          const id = e.target.value;
                          setReplaceTargetId(id);
                          // Pre-fill form with the selected card's existing data
                          const target = cards.find(c => c._id === id);
                          if (target) {
                            setForm({
                              collectionId: target.collectionId,
                              collectionSlug: target.collectionSlug,
                              title: target.title,
                              artist: target.artist || "",
                              description: target.description,
                              coverImage: target.coverImage,
                              audioUrl: target.audioUrl,
                              frequency: target.frequency,
                              tag: target.tag,
                              duration: target.duration,
                              category: target.category,
                              status: target.status,
                            });
                            setImageFile(null);
                            setAudioFile(null);
                            setUseAudioUrl(!!target.audioUrl);
                            setAudioUrlInput(target.audioUrl || "");
                          }
                        }}
                      >
                        <option value="">— Choose a card to replace —</option>
                        {cards.map(c => (
                          <option key={c._id} value={c._id}>{c.title}</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-[#95d5b2] mt-1">
                        Only cards from <strong>{collectionName}</strong> are shown. The selected card will be updated in-place, preserving its position.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <p className="text-xs font-bold text-[#52b788] uppercase tracking-widest mb-3 pb-1 border-b border-[#d8f3dc]">Card Information</p>
                <div className="space-y-3">
                  <div><label className="hf-label">Title *</label><input className="hf-input" placeholder="e.g. Ocean Waves Calm" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
                  <div><label className="hf-label">Artist Name</label><input className="hf-input" placeholder="e.g. Sacred Sounds Collective" value={form.artist || ""} onChange={e => setForm(f => ({ ...f, artist: e.target.value }))} /></div>
                  <div><label className="hf-label">Description</label><textarea className="hf-input" rows={2} style={{ resize: "none" }} placeholder="Brief description..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="hf-label">Frequency (Hz)</label><input className="hf-input" placeholder="e.g. 432 Hz" value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))} /></div>
                    <div><label className="hf-label">Duration</label><input className="hf-input" placeholder="e.g. 15:00" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="hf-label">Category</label>
                      <select className="hf-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                        <option value="">Select category</option>
                        {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="hf-label">Status</label>
                      <select className="hf-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as "Active" | "Draft" }))}>
                        <option value="Draft">Draft</option><option value="Active">Active</option>
                      </select>
                    </div>
                  </div>
                  <div><label className="hf-label">Tag</label><input className="hf-input" placeholder="e.g. stress, sleep, focus" value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} /></div>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-[#52b788] uppercase tracking-widest mb-3 pb-1 border-b border-[#d8f3dc]">Cover Image</p>
                <ImageDropZone file={imageFile} previewUrl={form.coverImage || undefined} onFile={f => { setImageFile(f); if (!f) setForm(p => ({ ...p, coverImage: "" })); }} label="Upload cover image" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#52b788] uppercase tracking-widest mb-3 pb-1 border-b border-[#d8f3dc]">Audio</p>
                <div className="flex items-center gap-3 mb-3">
                  <button onClick={() => setUseAudioUrl(false)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${!useAudioUrl ? "bg-[#52b788] text-white border-[#52b788]" : "border-[#b7e4c7] text-[#2d6a4f] hover:bg-[#d8f3dc]"}`}>Upload File</button>
                  <button onClick={() => setUseAudioUrl(true)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${useAudioUrl ? "bg-[#52b788] text-white border-[#52b788]" : "border-[#b7e4c7] text-[#2d6a4f] hover:bg-[#d8f3dc]"}`}>Audio URL</button>
                </div>
                {useAudioUrl
                  ? <input className="hf-input" placeholder="https://..." value={audioUrlInput} onChange={e => setAudioUrlInput(e.target.value)} />
                  : <AudioDropZone file={audioFile} existingUrl={form.audioUrl || undefined} onFile={f => { setAudioFile(f); if (!f) setForm(p => ({ ...p, audioUrl: "" })); }} />}
                {(form.audioUrl || audioUrlInput) && !audioFile && (
                  <audio controls src={useAudioUrl ? audioUrlInput : form.audioUrl} className="mt-2 w-full h-8" style={{ accentColor: "#52b788" }} />
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#b7e4c7]" style={{ background: "linear-gradient(135deg,#DCEDC1,#A8E6CF22)" }}>
              <button className="hf-btn-outline" onClick={() => setIsModalOpen(false)} disabled={isSaving}>Cancel</button>
              <button className="hf-btn-primary" onClick={handleSave} disabled={isSaving}>{isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : selected ? "Update Card" : contentAction === "replace" ? "Replace Card" : "Save Card"}</button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDeleteModal open={isDeleteOpen} title={selected?.title || ""} onConfirm={handleDelete} onCancel={() => setIsDeleteOpen(false)} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COLLECTIONS PANEL — 4 fixed folders, no Add Collection, Manage Cards column
// ─────────────────────────────────────────────────────────────────────────────

// Fixed collection folders — always present, never added/removed
const FIXED_COLLECTIONS = [
  { slug: "meditation", name: "Meditation Journey", category: "Meditation" },
  { slug: "sleep",      name: "Sleep Therapy",      category: "Sleep"      },
  { slug: "focus",      name: "Focus Boost",         category: "Focus"      },
  { slug: "nature",     name: "Nature Sounds",       category: "Nature"     },
];

function CollectionsPanel({ moodCategories, addToast }: { moodCategories: MoodCategory[]; addToast: (m: string, t?: ToastType) => void }) {
  const [cardCounts, setCardCounts] = useState<Record<string, number>>({});
  const [openCollection, setOpenCollection] = useState<{ name: string; slug: string; category: string } | null>(null);

  // Load card counts for each fixed collection
  useEffect(() => {
    FIXED_COLLECTIONS.forEach(async col => {
      try {
        const res = await fetch(`${BASE}/api/healing-frequencies/cards/all?collectionSlug=${col.slug}`);
        const data = await res.json();
        setCardCounts(prev => ({ ...prev, [col.slug]: (data.cards || []).length }));
      } catch { /* ignore */ }
    });
  }, []);

  if (openCollection) {
    return (
      <SoundCardsPanel
        collectionName={openCollection.name}
        collectionSlug={openCollection.slug}
        collectionCategory={openCollection.category}
        moodCategories={moodCategories}
        addToast={addToast}
        onBack={() => {
          setOpenCollection(null);
          // Refresh card count for this collection
          fetch(`${BASE}/api/healing-frequencies/cards/all?collectionSlug=${openCollection.slug}`)
            .then(r => r.json())
            .then(d => setCardCounts(prev => ({ ...prev, [openCollection.slug]: (d.cards || []).length })))
            .catch(() => {});
        }}
      />
    );
  }

  return (
    <div>
      {/* Header card — no Add Collection button */}
      <div className="hf-card mx-4 sm:mx-0 mb-4 p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#e8f5e9" }}>
            <Layers className="w-5 h-5" style={{ color: "#52b788" }} />
          </div>
          <h2 className="text-lg font-bold text-[#1b4332]">Collections</h2>
        </div>
      </div>

      {/* Table card */}
      <div className="hf-card mx-4 sm:mx-0 overflow-hidden">
        <div className="hf-table-wrap">
          <table className="hf-table w-full text-sm">
            <thead>
              <tr style={{ background: "linear-gradient(135deg,#A8E6CF,#DCEDC1)" }}>
                {["Collection Name", "Category", "Sound Cards", "Display Order", "Manage Cards", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-4 text-xs font-bold text-[#1b4332] uppercase tracking-wider border-b border-[#b7e4c7] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FIXED_COLLECTIONS.map((col, i) => (
                <tr key={col.slug} className="hf-row border-b border-[#d8f3dc]"
                  style={{ background: i % 2 === 0 ? "rgba(240,255,244,0.8)" : "rgba(220,237,193,0.35)" }}>

                  {/* Collection Name */}
                  <td className="px-4 py-3">
                    <span className="font-semibold text-[#1b4332]">{col.name}</span>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#d8f3dc] text-[#1b4332] border border-[#95d5b2]">
                      {col.category}
                    </span>
                  </td>

                  {/* Sound Cards count */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-[#2d6a4f] font-semibold text-sm">
                      <Music className="w-3.5 h-3.5" />
                      {cardCounts[col.slug] ?? 0} cards
                    </span>
                  </td>

                  {/* Display Order */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#d8f3dc] text-[#1b4332] font-bold text-sm border border-[#b7e4c7]">
                      {i + 1}
                    </span>
                  </td>

                  {/* Manage Cards — dedicated column */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setOpenCollection({ name: col.name, slug: col.slug, category: col.category })}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border-2 border-[#52b788] text-[#1b4332] bg-[#d8f3dc] hover:bg-[#A8E6CF] transition-all hover:scale-105 whitespace-nowrap"
                    >
                      <Music className="w-3.5 h-3.5" /> Manage Cards
                    </button>
                  </td>

                  {/* Actions — Edit / Delete (no-op for fixed folders, shown greyed) */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-[#95d5b2] italic">Fixed folder</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-[#d8f3dc] flex items-center justify-between" style={{ background: "rgba(240,255,244,0.6)" }}>
            <span className="text-xs text-[#74c69d] font-medium">4 collections total</span>
            <Layers className="w-4 h-4 text-[#95d5b2]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
type ActiveTab = "mood" | "collections";

export function HealingFrequenciesContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("mood");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [moodCategories, setMoodCategories] = useState<MoodCategory[]>([]);

  const addToast = useCallback((msg: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  useEffect(() => {
    fetch(`${BASE}/api/healing-frequencies/mood-categories/all`)
      .then(r => r.json())
      .then(d => setMoodCategories(d.categories || []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#F0FFF4" }}>
      <ToastContainer toasts={toasts} onRemove={id => setToasts(p => p.filter(t => t.id !== id))} />

      <style>{`
        @keyframes hfSlideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes hfFadeUp  { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        .hf-modal-anim { animation: hfFadeUp 0.28s cubic-bezier(0.34,1.56,0.64,1); }
        .hf-row { transition: background 0.15s; }
        .hf-row:hover { background: #d8f3dc !important; }
        .hf-row:hover .hf-actions { opacity:1; }
        .hf-actions { opacity:0.6; transition: opacity 0.15s; }
        .hf-btn-primary { background:linear-gradient(135deg,#52b788,#40916c); color:#fff; border:none; border-radius:10px; padding:9px 20px; font-weight:600; font-size:0.875rem; cursor:pointer; display:flex; align-items:center; gap:6px; transition:transform 0.15s,box-shadow 0.15s; box-shadow:0 2px 8px rgba(82,183,136,0.3); white-space:nowrap; }
        .hf-btn-primary:hover { transform:scale(1.04); box-shadow:0 4px 16px rgba(82,183,136,0.45); }
        .hf-btn-primary:disabled { opacity:0.6; transform:none; cursor:not-allowed; }
        .hf-btn-outline { background:rgba(255,255,255,0.6); color:#2d6a4f; border:1.5px solid #b7e4c7; border-radius:10px; padding:8px 18px; font-weight:500; font-size:0.875rem; cursor:pointer; transition:all 0.15s; }
        .hf-btn-outline:hover { background:#d8f3dc; border-color:#74c69d; }
        .hf-input { width:100%; border:1.5px solid #b7e4c7; border-radius:12px; padding:9px 12px; font-size:0.875rem; background:rgba(255,255,255,0.7); color:#1b4332; outline:none; transition:border-color 0.2s,box-shadow 0.2s; }
        .hf-input:focus { border-color:#52b788; box-shadow:0 0 0 3px rgba(82,183,136,0.18); background:#fff; }
        .hf-select { width:100%; border:1.5px solid #b7e4c7; border-radius:12px; padding:9px 12px; font-size:0.875rem; background:rgba(255,255,255,0.7); color:#1b4332; outline:none; cursor:pointer; transition:border-color 0.2s; }
        .hf-select:focus { border-color:#52b788; box-shadow:0 0 0 3px rgba(82,183,136,0.18); }
        .hf-label { font-size:0.78rem; font-weight:600; color:#2d6a4f; margin-bottom:5px; display:block; letter-spacing:0.02em; }
        .hf-card { background:rgba(255,255,255,0.55); backdrop-filter:blur(8px); border-radius:16px; box-shadow:0 2px 16px rgba(82,183,136,0.12); border:1px solid #b7e4c7; }
        .hf-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.35); backdrop-filter:blur(4px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:16px; }
        .hf-modal { background:linear-gradient(160deg,#f0fff4 0%,#e8f5e9 100%); border-radius:20px; width:100%; max-width:640px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,0.18); border:1px solid #b7e4c7; }
        .hf-search-wrap { position:relative; }
        .hf-search-input { width:100%; border:2px solid #95d5b2; border-radius:14px; padding:11px 16px 11px 44px; font-size:0.9rem; background:rgba(255,255,255,0.75); color:#1b4332; outline:none; transition:border-color 0.2s,box-shadow 0.25s; box-shadow:0 2px 10px rgba(82,183,136,0.1); }
        .hf-search-input::placeholder { color:#95d5b2; }
        .hf-search-input:focus { border-color:#52b788; box-shadow:0 0 0 4px rgba(82,183,136,0.18); background:#fff; }
        .hf-search-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#74c69d; pointer-events:none; }
        .hf-tab { padding:10px 20px; border-radius:12px; font-size:0.875rem; font-weight:600; cursor:pointer; transition:all 0.18s; border:1.5px solid transparent; white-space:nowrap; }
        .hf-tab-active { background:linear-gradient(135deg,#52b788,#40916c); color:#fff; box-shadow:0 2px 10px rgba(82,183,136,0.35); }
        .hf-tab-inactive { background:rgba(255,255,255,0.6); color:#2d6a4f; border-color:#b7e4c7; }
        .hf-tab-inactive:hover { background:#d8f3dc; border-color:#74c69d; }
        @media (max-width:768px) { .hf-table-wrap { overflow-x:auto; -webkit-overflow-scrolling:touch; } }
      `}</style>

      {/* Page header */}
      <div className="hf-card mx-4 sm:mx-6 mt-6 mb-4 p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#e8f5e9" }}>
            <Headphones className="w-5 h-5" style={{ color: "#52b788" }} />
          </div>
          <h1 className="text-lg font-bold text-[#1b4332]">Healing Frequencies</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className={`hf-tab ${activeTab === "mood" ? "hf-tab-active" : "hf-tab-inactive"}`} onClick={() => setActiveTab("mood")}>
            <span className="flex items-center gap-2"><Tag className="w-4 h-4" /> Mood Categories</span>
          </button>
          <button className={`hf-tab ${activeTab === "collections" ? "hf-tab-active" : "hf-tab-inactive"}`} onClick={() => setActiveTab("collections")}>
            <span className="flex items-center gap-2"><Layers className="w-4 h-4" /> Collections &amp; Sound Cards</span>
          </button>
        </div>
      </div>

      <div className="mx-4 sm:mx-6 mb-6">
        {activeTab === "mood" && <MoodCategoriesPanel addToast={addToast} />}
        {activeTab === "collections" && <CollectionsPanel moodCategories={moodCategories} addToast={addToast} />}
      </div>
    </div>
  );
}

export default HealingFrequenciesContent;
