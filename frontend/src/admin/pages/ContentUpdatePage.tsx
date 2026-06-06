import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Save, Upload, Image, RefreshCw, Layout, Users } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import BACKEND_CONFIG from "@/config/backend";

// ─── Types ────────────────────────────────────────────────────────────────────
type Pillar = { id: string; title: string; desc: string; image: string };
type LibraryItem = { title: string; category: string; image: string; duration: string };
type Goal = { id: number; title: string; subtitle: string; image: string; desc: string };
type StatItem = { value: string; label: string; icon?: string };
type HeroData = { title: string; subtitle: string; buttonText: string; imageUrl: string };
type CompanionConfig = {
  heroTitle: string; heroHighlight: string; heroSubtitle: string;
  ctaBookTitle: string; ctaBookDesc: string;
  ctaApplyTitle: string; ctaApplyDesc: string;
  footerTagline: string;
};

// ─── Image Upload Helper ───────────────────────────────────────────────────────
async function uploadImageFile(file: File, apiBaseUrl: string): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await fetch(`${apiBaseUrl}/api/upload`, { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      return `${apiBaseUrl}${data.url}`;
    }
    toast.error("Image upload failed");
    return null;
  } catch {
    toast.error("Image upload error");
    return null;
  }
}

// ─── ImageField Component ──────────────────────────────────────────────────────
function ImageField({
  value,
  onChange,
  apiBaseUrl,
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  apiBaseUrl: string;
  label?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImageFile(file, apiBaseUrl);
    if (url) onChange(url);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <label className="med-label">{label}</label>
      {value && (
        <img
          src={value}
          alt={label}
          className="w-full h-44 object-cover rounded-xl border border-[#b7e4c7] shadow-sm"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/600x400/e2e8f0/1a5d47?text=Image"; }}
        />
      )}
      <div className="flex gap-2 items-start">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="med-input flex-1"
          placeholder="Paste image URL or upload a file →"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="med-btn-primary shrink-0 !py-2.5"
          title="Upload image file"
        >
          {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function ContentUpdatePage() {
  const apiBaseUrl = BACKEND_CONFIG.API_BASE_URL;

  // ── Landing Page State ──
  const [heroData, setHeroData] = useState<HeroData>({
    title: "FIND YOUR",
    subtitle: "Experience the convergence of ancient wisdom and modern technology for your complete holistic healing journey.",
    buttonText: "Start Your Journey",
    imageUrl: "/landing-page.jpeg",
  });

  const [pillars, setPillars] = useState<Pillar[]>([
    { id: "01", title: "Systemic Diagnostics", desc: "We analyze your organizational pulse through confidential, culturally-aware assessments to identify latent stressors.", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop" },
    { id: "02", title: "Scalable Protocols", desc: "Deployment of curated wellness frameworks that adapt to team size, location, and operational intensity.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop" },
    { id: "03", title: "Leadership Synergy", desc: "Equipping managers with high-EQ toolkits to foster psychological safety and resilient decision-making.", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop" },
    { id: "04", title: "Cultural Integration", desc: "Weaving emotional intelligence into the daily fabric of operations, transforming wellness from a perk to a practice.", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop" },
    { id: "05", title: "Impact & ROI", desc: "Real-time analytics measuring engagement, retention shifts, and emotional capital growth.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop" },
  ]);

  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([
    { title: "Meditation", category: "Mindfulness", image: "/services/meditation.png", duration: "10 min" },
    { title: "Sleep Stories", category: "Rest", image: "/services/sound_healing.png", duration: "25 min" },
    { title: "Ancient Wisdom", category: "Philosophy", image: "/Book.png", duration: "Series" },
    { title: "Breathwork", category: "Practice", image: "/services/BF.png", duration: "5 min" },
    { title: "Sound Healing", category: "Therapy", image: "/services/sound_healing.png", duration: "45 min" },
    { title: "Zen Chat", category: "AI Companion", image: "/services/zenchat.png", duration: "Unlimited" },
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    { id: 1, title: "INNER PEACE", subtitle: "I'm looking to find", image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=800&auto=format&fit=crop", desc: "Calm the mind and soothe the soul through mindful meditation and breathwork." },
    { id: 2, title: "EMOTIONAL HEALING", subtitle: "I'm looking for", image: "https://images.unsplash.com/photo-1499209974431-2761386a123d?q=80&w=800&auto=format&fit=crop", desc: "Process emotions and find balance with ancient healing practices." },
    { id: 3, title: "PHYSICAL VITALITY", subtitle: "I'm looking to boost", image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=800&auto=format&fit=crop", desc: "Energize the body and spirit with holistic wellness techniques." },
    { id: 4, title: "SPIRITUAL CONNECTION", subtitle: "I'm looking for a", image: "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=800&auto=format&fit=crop", desc: "Deepen connection to self and universe through sacred wisdom." },
    { id: 5, title: "STRESS RELIEF", subtitle: "I'm seeking", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop", desc: "Release tension and restore harmony with proven relaxation methods." },
  ]);

  const [stats, setStats] = useState<StatItem[]>([
    { value: "50,000+", label: "Active Members", icon: "👥" },
    { value: "200+", label: "Expert Guides", icon: "🌟" },
    { value: "10,000+", label: "Sessions Completed", icon: "🧘" },
    { value: "4.9★", label: "Average Rating", icon: "⭐" },
  ]);

  // ── Companion Page State ──
  const [companionConfig, setCompanionConfig] = useState<CompanionConfig>({
    heroTitle: "Find Your Perfect",
    heroHighlight: "Spiritual Guide",
    heroSubtitle: "Book 1-on-1 sessions with experienced spiritual teachers, meditation guides, and wellness coaches. Pay per hour or per call.",
    ctaBookTitle: "Book a Healing Session",
    ctaBookDesc: "Connect with experienced guides for personalized wellness & spiritual support.",
    ctaApplyTitle: "Apply as a Companion",
    ctaApplyDesc: "Share your spiritual wisdom, lead guided sessions, and earn on Nirvaha.",
    footerTagline: "Choose your journey — receive healing or help others heal.",
  });

  // ── Active page tab ──
  const [activePage, setActivePage] = useState<"landing" | "companion">("landing");

  // ── Load from backend ──
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/content`);
        if (!response.ok) return;
        const data = await response.json();

        if (data.landing_hero?.value) {
          try { setHeroData(JSON.parse(data.landing_hero.value)); } catch {}
        }
        if (data.landing_pillars?.value) {
          try { setPillars(JSON.parse(data.landing_pillars.value)); } catch {}
        }
        if (data.landing_library?.value) {
          try { setLibraryItems(JSON.parse(data.landing_library.value)); } catch {}
        }
        if (data.landing_goals?.value) {
          try { setGoals(JSON.parse(data.landing_goals.value)); } catch {}
        }
        if (data.landing_stats?.value) {
          try { setStats(JSON.parse(data.landing_stats.value)); } catch {}
        }
        if (data.companion_page_config?.value) {
          try { setCompanionConfig(JSON.parse(data.companion_page_config.value)); } catch {}
        }
      } catch (error) {
        console.error("Failed to fetch page content", error);
      }
    };
    fetchContent();
  }, [apiBaseUrl]);

  // ── Generic save helper ──
  const saveContent = async (key: string, value: any, sectionName: string, section = "landing") => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/content/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: JSON.stringify(value),
          type: "json",
          section,
          description: `${sectionName} content`,
        }),
      });
      if (response.ok) {
        toast.success(`✅ ${sectionName} saved!`);
      } else {
        toast.error(`Failed to save ${sectionName}`);
      }
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      toast.error(`Error saving ${sectionName}`);
    }
  };

  // ── Save fns ──
  const saveHero     = () => saveContent("landing_hero",  heroData,        "Landing Hero");
  const savePillars  = () => saveContent("landing_pillars", pillars,       "What is Nirvaha Pillars");
  const saveLibrary  = () => saveContent("landing_library", libraryItems,  "Explore Library");
  const saveGoals    = () => saveContent("landing_goals",   goals,         "Ancient Wisdom Goals");
  const saveStats    = () => saveContent("landing_stats",   stats,         "Trusted Stats");
  const saveCompanionConfig = () => saveContent("companion_page_config", companionConfig, "Companion Page Config", "companion");

  // ── Pillar handlers ──
  const updatePillar  = (id: string, f: string, v: string) => setPillars(ps => ps.map(p => p.id === id ? { ...p, [f]: v } : p));
  const deletePillar  = (id: string) => pillars.length > 1 ? setPillars(ps => ps.filter(p => p.id !== id)) : alert("Keep at least one pillar");
  const addPillar     = () => { const nid = (Math.max(...pillars.map(p => parseInt(p.id))) + 1).toString().padStart(2, "0"); setPillars(ps => [...ps, { id: nid, title: "New Pillar", desc: "Description here", image: "" }]); };

  // ── Library handlers ──
  const updateLib = (i: number, f: string, v: string) => { const a = [...libraryItems]; a[i] = { ...a[i], [f]: v }; setLibraryItems(a); };
  const deleteLib = (i: number) => libraryItems.length > 1 ? setLibraryItems(l => l.filter((_, x) => x !== i)) : alert("Keep at least one item");
  const addLib    = () => setLibraryItems(l => [...l, { title: "New Item", category: "Category", image: "", duration: "Duration" }]);

  // ── Goal handlers ──
  const updateGoal = (id: number, f: keyof Goal, v: string | number) => setGoals(gs => gs.map(g => g.id === id ? { ...g, [f]: v } : g));
  const deleteGoal = (id: number) => goals.length > 1 ? setGoals(gs => gs.filter(g => g.id !== id)) : alert("Keep at least one goal");
  const addGoal    = () => { const nid = Math.max(...goals.map(g => g.id), 0) + 1; setGoals(gs => [...gs, { id: nid, title: "New Goal", subtitle: "I'm looking to find", image: "", desc: "Goal description" }]); };

  // ── Stat handlers ──
  const updateStat = (i: number, f: keyof StatItem, v: string) => { const a = [...stats]; a[i] = { ...a[i], [f]: v }; setStats(a); };
  const deleteStat = (i: number) => stats.length > 1 ? setStats(s => s.filter((_, x) => x !== i)) : alert("Keep at least one stat");
  const addStat    = () => setStats(s => [...s, { value: "0+", label: "New Metric", icon: "📊" }]);

  // ─────────────────────────── RENDER ───────────────────────────────────────
  return (
    <div className="min-h-screen -m-6 p-6" style={{ background: "#F0FFF4" }}>
      <style>{`
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        .med-card { background:rgba(255,255,255,0.6); backdrop-filter:blur(10px); border-radius:18px; box-shadow:0 2px 18px rgba(82,183,136,0.12); border:1px solid #b7e4c7; }
        .med-btn-primary { background:linear-gradient(135deg,#52b788,#40916c); color:#fff; border:none; border-radius:10px; padding:9px 20px; font-weight:700; font-size:0.875rem; cursor:pointer; display:flex; align-items:center; gap:6px; transition:transform 0.15s,box-shadow 0.15s; box-shadow:0 2px 8px rgba(82,183,136,0.3); white-space:nowrap; }
        .med-btn-primary:hover { transform:scale(1.04); box-shadow:0 4px 16px rgba(82,183,136,0.45); }
        .med-btn-primary:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
        .med-btn-outline { background:rgba(255,255,255,0.7); color:#2d6a4f; border:1.5px solid #b7e4c7; border-radius:10px; padding:8px 18px; font-weight:600; font-size:0.875rem; cursor:pointer; transition:all 0.15s; display:flex; align-items:center; gap:6px; white-space:nowrap; }
        .med-btn-outline:hover { background:#d8f3dc; border-color:#74c69d; }
        .med-input { width:100%; border:1.5px solid #b7e4c7; border-radius:12px; padding:9px 12px; font-size:0.875rem; background:rgba(255,255,255,0.8); color:#1b4332; outline:none; transition:border-color 0.2s,box-shadow 0.2s; }
        .med-input:focus { border-color:#52b788; box-shadow:0 0 0 3px rgba(82,183,136,0.18); background:#fff; }
        .med-label { font-size:0.78rem; font-weight:700; color:#2d6a4f; margin-bottom:5px; display:block; letter-spacing:0.03em; text-transform:uppercase; }
        .med-tab-trigger { border-radius:10px !important; transition:all 0.2s; font-weight:600; }
        .med-tab-trigger[data-state='active'] { background:#52b788 !important; color:white !important; box-shadow:0 4px 12px rgba(82,183,136,0.3) !important; }
        .page-tab-btn { padding:12px 28px; border-radius:14px; font-weight:800; font-size:0.9rem; cursor:pointer; transition:all 0.2s; border:2px solid transparent; display:flex; align-items:center; gap:8px; }
        .page-tab-btn.active { background:#1b4332; color:white; box-shadow:0 4px 20px rgba(27,67,50,0.25); }
        .page-tab-btn:not(.active) { background:rgba(255,255,255,0.7); color:#2d6a4f; border-color:#b7e4c7; }
        .page-tab-btn:not(.active):hover { background:#d8f3dc; border-color:#74c69d; }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Page Header ── */}
        <div className="med-card p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Layout className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#1b4332]">Page Content Management</h1>
                <p className="text-sm text-[#52b788] font-medium">Edit text, images, and sections across all public pages</p>
              </div>
            </div>
            {/* Page Selector */}
            <div className="flex gap-3">
              <button
                className={`page-tab-btn ${activePage === "landing" ? "active" : ""}`}
                onClick={() => setActivePage("landing")}
              >
                <Layout className="w-4 h-4" /> Landing Page
              </button>
              <button
                className={`page-tab-btn ${activePage === "companion" ? "active" : ""}`}
                onClick={() => setActivePage("companion")}
              >
                <Users className="w-4 h-4" /> Companion Page
              </button>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
             LANDING PAGE
        ══════════════════════════════════════════ */}
        {activePage === "landing" && (
          <Tabs defaultValue="hero" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 p-1.5 bg-[#d8f3dc] rounded-2xl h-auto gap-1">
              {["hero", "pillars", "library", "goals", "stats"].map(tab => (
                <TabsTrigger key={tab} value={tab} className="med-tab-trigger py-2.5 text-xs font-bold text-[#2d6a4f] capitalize">
                  {tab === "hero" ? "🏠 Hero" : tab === "pillars" ? "✨ Pillars" : tab === "library" ? "📚 Library" : tab === "goals" ? "🎯 Goals" : "📊 Stats"}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* ─── Hero Tab ─── */}
            <TabsContent value="hero" className="space-y-6">
              <div className="med-card p-6 space-y-6">
                <h2 className="text-lg font-black text-[#1b4332] flex items-center gap-2">🏠 Hero Section</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <div>
                      <label className="med-label">Hero Title</label>
                      <input type="text" value={heroData.title} onChange={e => setHeroData(h => ({ ...h, title: e.target.value }))} className="med-input" placeholder="e.g. FIND YOUR" />
                    </div>
                    <div>
                      <label className="med-label">Subtitle / Tagline</label>
                      <textarea value={heroData.subtitle} onChange={e => setHeroData(h => ({ ...h, subtitle: e.target.value }))} rows={4} className="med-input resize-none" placeholder="Hero subtitle text" />
                    </div>
                    <div>
                      <label className="med-label">Button Text</label>
                      <input type="text" value={heroData.buttonText} onChange={e => setHeroData(h => ({ ...h, buttonText: e.target.value }))} className="med-input" placeholder="e.g. Start Your Journey" />
                    </div>
                  </div>
                  <div>
                    <ImageField value={heroData.imageUrl} onChange={url => setHeroData(h => ({ ...h, imageUrl: url }))} apiBaseUrl={apiBaseUrl} label="Hero Background Image" />
                  </div>
                </div>
                <div className="flex gap-4 pt-2 border-t border-[#b7e4c7]">
                  <button onClick={saveHero} className="med-btn-primary"><Save className="w-4 h-4" /> Save Hero</button>
                </div>
              </div>
            </TabsContent>

            {/* ─── Pillars Tab ─── */}
            <TabsContent value="pillars" className="space-y-6">
              <div className="space-y-4">
                {pillars.map(pillar => (
                  <motion.div key={pillar.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="med-card p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-black text-[#1b4332]">Pillar {pillar.id}</h3>
                        <button onClick={() => deletePillar(pillar.id)} className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ImageField value={pillar.image} onChange={url => updatePillar(pillar.id, "image", url)} apiBaseUrl={apiBaseUrl} label="Pillar Image" />
                        <div className="space-y-4">
                          <div>
                            <label className="med-label">Title</label>
                            <input type="text" value={pillar.title} onChange={e => updatePillar(pillar.id, "title", e.target.value)} className="med-input" />
                          </div>
                          <div>
                            <label className="med-label">Description</label>
                            <textarea value={pillar.desc} onChange={e => updatePillar(pillar.id, "desc", e.target.value)} rows={4} className="med-input resize-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={addPillar} className="med-btn-primary"><Plus className="w-4 h-4" /> Add Pillar</button>
                <button onClick={savePillars} className="med-btn-outline"><Save className="w-4 h-4" /> Save All</button>
              </div>
            </TabsContent>

            {/* ─── Library Tab ─── */}
            <TabsContent value="library" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {libraryItems.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="med-card p-5 space-y-4 relative group">
                      <button onClick={() => deleteLib(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 p-1.5 rounded-full bg-white/60 hover:bg-white opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ImageField value={item.image} onChange={url => updateLib(i, "image", url)} apiBaseUrl={apiBaseUrl} label="Item Image" />
                      <div>
                        <label className="med-label">Title</label>
                        <input type="text" value={item.title} onChange={e => updateLib(i, "title", e.target.value)} className="med-input" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="med-label">Category</label>
                          <input type="text" value={item.category} onChange={e => updateLib(i, "category", e.target.value)} className="med-input text-xs" />
                        </div>
                        <div>
                          <label className="med-label">Duration</label>
                          <input type="text" value={item.duration} onChange={e => updateLib(i, "duration", e.target.value)} className="med-input text-xs" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={addLib} className="med-btn-primary"><Plus className="w-4 h-4" /> Add Item</button>
                <button onClick={saveLibrary} className="med-btn-outline"><Save className="w-4 h-4" /> Save All</button>
              </div>
            </TabsContent>

            {/* ─── Goals Tab ─── */}
            <TabsContent value="goals" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goals.map(goal => (
                  <motion.div key={goal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="med-card p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-black text-[#1b4332]">Goal {goal.id}</h3>
                        <button onClick={() => deleteGoal(goal.id)} className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <ImageField value={goal.image} onChange={url => updateGoal(goal.id, "image", url)} apiBaseUrl={apiBaseUrl} label="Goal Image" />
                        <div className="space-y-3">
                          <div>
                            <label className="med-label">Title</label>
                            <input type="text" value={goal.title} onChange={e => updateGoal(goal.id, "title", e.target.value)} className="med-input" />
                          </div>
                          <div>
                            <label className="med-label">Subtitle</label>
                            <input type="text" value={goal.subtitle} onChange={e => updateGoal(goal.id, "subtitle", e.target.value)} className="med-input" />
                          </div>
                          <div>
                            <label className="med-label">Description</label>
                            <textarea value={goal.desc} onChange={e => updateGoal(goal.id, "desc", e.target.value)} rows={3} className="med-input resize-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={addGoal} className="med-btn-primary"><Plus className="w-4 h-4" /> Add Goal</button>
                <button onClick={saveGoals} className="med-btn-outline"><Save className="w-4 h-4" /> Save All</button>
              </div>
            </TabsContent>

            {/* ─── Stats Tab ─── */}
            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {stats.map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="med-card p-6 space-y-4 relative group">
                      <button onClick={() => deleteStat(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 p-1.5 rounded-full bg-white/60 hover:bg-white opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="med-label">Icon / Emoji</label>
                          <input type="text" value={stat.icon || ""} onChange={e => updateStat(i, "icon", e.target.value)} className="med-input text-center text-xl" maxLength={4} />
                        </div>
                        <div>
                          <label className="med-label">Value</label>
                          <input type="text" value={stat.value} onChange={e => updateStat(i, "value", e.target.value)} className="med-input" placeholder="e.g. 50,000+" />
                        </div>
                        <div>
                          <label className="med-label">Label</label>
                          <input type="text" value={stat.label} onChange={e => updateStat(i, "label", e.target.value)} className="med-input" placeholder="e.g. Active Members" />
                        </div>
                      </div>
                      {/* Preview */}
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 flex items-center gap-4 border border-emerald-100">
                        <span className="text-3xl">{stat.icon}</span>
                        <div>
                          <p className="text-2xl font-black text-[#1b4332]">{stat.value}</p>
                          <p className="text-sm text-emerald-700 font-semibold">{stat.label}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={addStat} className="med-btn-primary"><Plus className="w-4 h-4" /> Add Stat</button>
                <button onClick={saveStats} className="med-btn-outline"><Save className="w-4 h-4" /> Save All</button>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* ══════════════════════════════════════════
             COMPANION PAGE
        ══════════════════════════════════════════ */}
        {activePage === "companion" && (
          <Tabs defaultValue="seeker" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 p-1.5 bg-[#d8f3dc] rounded-2xl h-auto gap-2">
              <TabsTrigger value="seeker" className="med-tab-trigger py-3 text-sm font-bold text-[#2d6a4f]">🧘 Seeker Hero Section</TabsTrigger>
              <TabsTrigger value="cta" className="med-tab-trigger py-3 text-sm font-bold text-[#2d6a4f]">🪄 CTA Cards</TabsTrigger>
            </TabsList>

            {/* ─── Seeker Hero ─── */}
            <TabsContent value="seeker" className="space-y-6">
              <div className="med-card p-6 space-y-6">
                <h2 className="text-lg font-black text-[#1b4332] flex items-center gap-2">🧘 Seeker Hero Text</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <div>
                      <label className="med-label">Hero Title (Line 1)</label>
                      <input type="text" value={companionConfig.heroTitle} onChange={e => setCompanionConfig(c => ({ ...c, heroTitle: e.target.value }))} className="med-input" placeholder="e.g. Find Your Perfect" />
                    </div>
                    <div>
                      <label className="med-label">Hero Highlight (Gradient Text)</label>
                      <input type="text" value={companionConfig.heroHighlight} onChange={e => setCompanionConfig(c => ({ ...c, heroHighlight: e.target.value }))} className="med-input" placeholder="e.g. Spiritual Guide" />
                    </div>
                    <div>
                      <label className="med-label">Hero Subtitle</label>
                      <textarea value={companionConfig.heroSubtitle} onChange={e => setCompanionConfig(c => ({ ...c, heroSubtitle: e.target.value }))} rows={4} className="med-input resize-none" />
                    </div>
                    <div>
                      <label className="med-label">Footer Tagline</label>
                      <input type="text" value={companionConfig.footerTagline} onChange={e => setCompanionConfig(c => ({ ...c, footerTagline: e.target.value }))} className="med-input" placeholder="e.g. Choose your journey…" />
                    </div>
                  </div>
                  {/* Live Preview */}
                  <div className="bg-gradient-to-br from-[#f0fdf6] via-white to-[#f0fdf6] rounded-2xl border border-emerald-100 p-6 flex flex-col items-center justify-center text-center gap-3 shadow-inner">
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">Live Preview</p>
                    <h2 className="text-3xl font-black text-[#1B4332] leading-tight">
                      {companionConfig.heroTitle}<br />
                      <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {companionConfig.heroHighlight}
                      </span>
                    </h2>
                    <p className="text-sm text-emerald-800/70 font-medium max-w-xs leading-relaxed">
                      {companionConfig.heroSubtitle}
                    </p>
                    <p className="text-xs text-emerald-600 italic mt-2">{companionConfig.footerTagline}</p>
                  </div>
                </div>
                <div className="flex gap-4 pt-2 border-t border-[#b7e4c7]">
                  <button onClick={saveCompanionConfig} className="med-btn-primary"><Save className="w-4 h-4" /> Save Hero Config</button>
                </div>
              </div>
            </TabsContent>

            {/* ─── CTA Cards ─── */}
            <TabsContent value="cta" className="space-y-6">
              {/* Book Card */}
              <div className="med-card p-6 space-y-5">
                <h3 className="text-base font-black text-[#1b4332] flex items-center gap-2">
                  <span className="w-8 h-8 bg-emerald-900 text-white rounded-lg flex items-center justify-center text-sm">1</span>
                  Book a Session Card (Dark)
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="med-label">Card Title</label>
                      <input type="text" value={companionConfig.ctaBookTitle} onChange={e => setCompanionConfig(c => ({ ...c, ctaBookTitle: e.target.value }))} className="med-input" />
                    </div>
                    <div>
                      <label className="med-label">Card Description</label>
                      <textarea value={companionConfig.ctaBookDesc} onChange={e => setCompanionConfig(c => ({ ...c, ctaBookDesc: e.target.value }))} rows={3} className="med-input resize-none" />
                    </div>
                  </div>
                  {/* Preview */}
                  <div className="bg-emerald-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 rounded-bl-full translate-x-8 -translate-y-8 pointer-events-none" />
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-3">Preview</p>
                    <h4 className="text-xl font-black mb-2">{companionConfig.ctaBookTitle}</h4>
                    <p className="text-emerald-100/70 text-sm font-medium">{companionConfig.ctaBookDesc}</p>
                    <div className="mt-4 text-emerald-300 font-bold text-xs uppercase tracking-wider">Find a Guide →</div>
                  </div>
                </div>
              </div>

              {/* Apply Card */}
              <div className="med-card p-6 space-y-5">
                <h3 className="text-base font-black text-[#1b4332] flex items-center gap-2">
                  <span className="w-8 h-8 bg-white border-2 border-emerald-200 text-emerald-800 rounded-lg flex items-center justify-center text-sm font-black">2</span>
                  Apply as a Companion Card (Light)
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="med-label">Card Title</label>
                      <input type="text" value={companionConfig.ctaApplyTitle} onChange={e => setCompanionConfig(c => ({ ...c, ctaApplyTitle: e.target.value }))} className="med-input" />
                    </div>
                    <div>
                      <label className="med-label">Card Description</label>
                      <textarea value={companionConfig.ctaApplyDesc} onChange={e => setCompanionConfig(c => ({ ...c, ctaApplyDesc: e.target.value }))} rows={3} className="med-input resize-none" />
                    </div>
                  </div>
                  {/* Preview */}
                  <div className="bg-white/80 border border-emerald-100 rounded-2xl p-6 text-[#1b4332] relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-100/40 rounded-full blur-2xl pointer-events-none" />
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-3">Preview</p>
                    <h4 className="text-xl font-black mb-2 text-emerald-950">{companionConfig.ctaApplyTitle}</h4>
                    <p className="text-emerald-800/60 text-sm font-medium">{companionConfig.ctaApplyDesc}</p>
                    <div className="mt-4 text-emerald-700 font-bold text-xs uppercase tracking-wider">Apply Now →</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={saveCompanionConfig} className="med-btn-primary"><Save className="w-4 h-4" /> Save CTA Cards</button>
              </div>
            </TabsContent>
          </Tabs>
        )}

      </div>
    </div>
  );
}