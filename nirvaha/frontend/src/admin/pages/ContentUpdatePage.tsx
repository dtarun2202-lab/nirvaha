import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Save } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import BACKEND_CONFIG from "@/config/backend";

type Pillar = {
  id: string;
  title: string;
  desc: string;
  image: string;
};

type LibraryItem = {
  title: string;
  category: string;
  image: string;
  duration: string;
};

type Goal = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  desc: string;
};

export function ContentUpdatePage() {
  // What is Nirvaha sections
  const [pillars, setPillars] = useState<Pillar[]>([
    {
      id: "01",
      title: "Systemic Diagnostics",
      desc: "We analyze your organizational pulse through confidential, culturally-aware assessments to identify latent stressors.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "02",
      title: "Scalable Protocols",
      desc: "Deployment of curated wellness frameworks that adapt to team size, location, and operational intensity.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "03",
      title: "Leadership Synergy",
      desc: "Equipping managers with high-EQ toolkits to foster psychological safety and resilient decision-making.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "04",
      title: "Cultural Integration",
      desc: "Weaving emotional intelligence into the daily fabric of operations, transforming wellness from a perk to a practice.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "05",
      title: "Impact & ROI",
      desc: "Real-time analytics measuring engagement, retention shifts, and emotional capital growth.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
    },
  ]);

  // Library items
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([
    { title: "Meditation", category: "Mindfulness", image: "/services/meditation.png", duration: "10 min" },
    { title: "Sleep Stories", category: "Rest", image: "/services/sound_healing.png", duration: "25 min" },
    { title: "Ancient Wisdom", category: "Philosophy", image: "/Book.png", duration: "Series" },
    { title: "Breathwork", category: "Practice", image: "/services/BF.png", duration: "5 min" },
    { title: "Sound Healing", category: "Therapy", image: "/services/sound_healing.png", duration: "45 min" },
    { title: "Zen Chat", category: "AI Companion", image: "/services/zenchat.png", duration: "Unlimited" },
  ]);

  // Why Ancient Wisdom goals
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: "INNER PEACE",
      subtitle: "I'm looking to find",
      image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=800&auto=format&fit=crop",
      desc: "Calm the mind and soothe the soul through mindful meditation and breathwork.",
    },
    {
      id: 2,
      title: "EMOTIONAL HEALING",
      subtitle: "I'm looking for",
      image: "https://images.unsplash.com/photo-1499209974431-2761386a123d?q=80&w=800&auto=format&fit=crop",
      desc: "Process emotions and find balance with ancient healing practices.",
    },
    {
      id: 3,
      title: "PHYSICAL VITALITY",
      subtitle: "I'm looking to boost",
      image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=800&auto=format&fit=crop",
      desc: "Energize the body and spirit with holistic wellness techniques.",
    },
    {
      id: 4,
      title: "SPIRITUAL CONNECTION",
      subtitle: "I'm looking for a",
      image: "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=800&auto=format&fit=crop",
      desc: "Deepen connection to self and universe through sacred wisdom.",
    },
    {
      id: 5,
      title: "STRESS RELIEF",
      subtitle: "I'm seeking",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop",
      desc: "Release tension and restore harmony with proven relaxation methods.",
    },
  ]);

  const apiBaseUrl = BACKEND_CONFIG.API_BASE_URL;

  // Load from backend on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/content`);
        if (!response.ok) return;
        const data = await response.json();

        if (data.landing_pillars?.value) {
          try {
            setPillars(JSON.parse(data.landing_pillars.value));
          } catch (e) {
            console.error("Failed to parse pillars", e);
          }
        }
        if (data.landing_library?.value) {
          try {
            setLibraryItems(JSON.parse(data.landing_library.value));
          } catch (e) {
            console.error("Failed to parse library", e);
          }
        }
        if (data.landing_goals?.value) {
          try {
            setGoals(JSON.parse(data.landing_goals.value));
          } catch (e) {
            console.error("Failed to parse goals", e);
          }
        }
      } catch (error) {
        console.error("Failed to fetch landing content", error);
      }
    };
    fetchContent();
  }, [apiBaseUrl]);

  // Save to backend
  const saveContent = async (key: string, value: any, sectionName: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/content/${key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: JSON.stringify(value),
          type: "json",
          section: "landing",
          description: `Landing page ${sectionName} section content`,
        }),
      });

      if (response.ok) {
        toast.success(`${sectionName} saved successfully!`);
      } else {
        toast.error(`Failed to save ${sectionName}`);
      }
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      toast.error(`Error saving ${sectionName}`);
    }
  };

  const savePillars = () => saveContent("landing_pillars", pillars, "What is Nirvaha sections");
  const saveLibraryItems = () => saveContent("landing_library", libraryItems, "Explore Our Learning sections");
  const saveGoals = () => saveContent("landing_goals", goals, "Why Ancient Wisdom? sections");

  // Pillar handlers
  const updatePillar = (id: string, field: string, value: string) => {
    setPillars(
      pillars.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  const deletePillar = (id: string) => {
    if (pillars.length > 1) {
      setPillars(pillars.filter((p) => p.id !== id));
    } else {
      alert("You must keep at least one pillar");
    }
  };

  const addPillar = () => {
    const newId = (Math.max(...pillars.map((p) => parseInt(p.id))) + 1).toString().padStart(2, "0");
    setPillars([
      ...pillars,
      {
        id: newId,
        title: "New Pillar",
        desc: "Description here",
        image: "https://placehold.co/600x400/e2e8f0/1a5d47?text=New+Pillar",
      },
    ]);
  };

  // Library handlers
  const updateLibraryItem = (index: number, field: string, value: string) => {
    const updated = [...libraryItems];
    updated[index] = { ...updated[index], [field]: value };
    setLibraryItems(updated);
  };

  const deleteLibraryItem = (index: number) => {
    if (libraryItems.length > 1) {
      setLibraryItems(libraryItems.filter((_, i) => i !== index));
    } else {
      alert("You must keep at least one library item");
    }
  };

  const addLibraryItem = () => {
    setLibraryItems([
      ...libraryItems,
      {
        title: "New Item",
        category: "Category",
        image: "https://placehold.co/600x400/e2e8f0/1a5d47?text=New+Item",
        duration: "Duration",
      },
    ]);
  };

  // Goal handlers
  const updateGoal = (
    id: number,
    field: keyof Goal,
    value: string | number
  ) => {
    setGoals(
      goals.map((goal) => (goal.id === id ? { ...goal, [field]: value } : goal))
    );
  };

  const deleteGoal = (id: number) => {
    if (goals.length > 1) {
      setGoals(goals.filter((goal) => goal.id !== id));
    } else {
      alert("You must keep at least one goal");
    }
  };

  const addGoal = () => {
    const newId = Math.max(...goals.map((g) => g.id), 0) + 1;
    setGoals([
      ...goals,
      {
        id: newId,
        title: "New Goal",
        subtitle: "I'm looking to find",
        image: "https://placehold.co/600x400/e2e8f0/1a5d47?text=New+Goal",
        desc: "Goal description",
      },
    ]);
  };

  return (
    <div className="min-h-screen -m-6 p-6" style={{ background: "#F0FFF4" }}>
      <style>{`
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        .med-card { background:rgba(255,255,255,0.55); backdrop-filter:blur(8px); border-radius:16px; box-shadow:0 2px 16px rgba(82,183,136,0.12); border:1px solid #b7e4c7; }
        .med-btn-primary { background: linear-gradient(135deg,#52b788,#40916c); color:#fff; border:none; border-radius:10px; padding:9px 20px; font-weight:600; font-size:0.875rem; cursor:pointer; display:flex; align-items:center; gap:6px; transition:transform 0.15s,box-shadow 0.15s; box-shadow:0 2px 8px rgba(82,183,136,0.3); white-space:nowrap; }
        .med-btn-primary:hover { transform:scale(1.04); box-shadow:0 4px 16px rgba(82,183,136,0.45); }
        .med-btn-outline { background:rgba(255,255,255,0.6); color:#2d6a4f; border:1.5px solid #b7e4c7; border-radius:10px; padding:8px 18px; font-weight:500; font-size:0.875rem; cursor:pointer; transition:all 0.15s; }
        .med-btn-outline:hover { background:#d8f3dc; border-color:#74c69d; }
        .med-input { width:100%; border:1.5px solid #b7e4c7; border-radius:12px; padding:9px 12px; font-size:0.875rem; background:rgba(255,255,255,0.7); color:#1b4332; outline:none; transition:border-color 0.2s,box-shadow 0.2s,transform 0.15s; }
        .med-input:focus { border-color:#52b788; box-shadow:0 0 0 3px rgba(82,183,136,0.18); transform:scale(1.005); background:#fff; }
        .med-label { font-size:0.78rem; font-weight:600; color:#2d6a4f; margin-bottom:5px; display:block; letter-spacing:0.02em; }
        .med-tab-trigger { border-radius:10px !important; transition:all 0.2s; }
        .med-tab-trigger[data-state='active'] { background:#52b788 !important; color:white !important; box-shadow:0 4px 12px rgba(82,183,136,0.3) !important; }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="med-card p-6 mb-8">
          <div className="flex items-center gap-3">
            <Plus className="w-8 h-8 text-[#2d6a4f]" />
            <div>
              <h1 className="text-2xl font-bold text-[#1b4332]">Landing Page Content Management</h1>
              <p className="text-sm text-[#74c69d]">Update images, titles, and descriptions for all landing page sections</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="pillars" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 p-1.5 bg-[#d8f3dc] rounded-2xl h-auto">
            <TabsTrigger value="pillars" className="med-tab-trigger py-3 text-sm font-bold text-[#2d6a4f]">
              What is Nirvaha (5 Pillars)
            </TabsTrigger>
            <TabsTrigger value="library" className="med-tab-trigger py-3 text-sm font-bold text-[#2d6a4f]">
              Explore Our Learning (Library)
            </TabsTrigger>
            <TabsTrigger value="goals" className="med-tab-trigger py-3 text-sm font-bold text-[#2d6a4f]">
              Why Ancient Wisdom (Goals)
            </TabsTrigger>
          </TabsList>

        {/* What is Nirvaha Section */}
        <TabsContent value="pillars" className="space-y-6">
          <div className="space-y-4 mb-6">
            {pillars.map((pillar) => (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="med-card p-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#1b4332]">Pillar {pillar.id}</h3>
                    <button
                      onClick={() => deletePillar(pillar.id)}
                      className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Image Preview */}
                    <div className="space-y-3">
                      <label className="med-label">Image URL</label>
                      <img
                        src={pillar.image}
                        alt={pillar.title}
                        className="w-full h-48 object-cover rounded-xl border border-[#b7e4c7] shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/600x400/e2e8f0/1a5d47?text=Image";
                        }}
                      />
                      <input
                        type="text"
                        value={pillar.image}
                        onChange={(e) => updatePillar(pillar.id, "image", e.target.value)}
                        className="med-input"
                        placeholder="Image URL"
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <div>
                        <label className="med-label">Title</label>
                        <input
                          type="text"
                          value={pillar.title}
                          onChange={(e) => updatePillar(pillar.id, "title", e.target.value)}
                          className="med-input"
                          placeholder="Pillar title"
                        />
                      </div>

                      <div>
                        <label className="med-label">Description</label>
                        <textarea
                          value={pillar.desc}
                          onChange={(e) => updatePillar(pillar.id, "desc", e.target.value)}
                          rows={4}
                          className="med-input resize-none"
                          placeholder="Pillar description"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={addPillar}
              className="med-btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Pillar
            </button>
            <button
              onClick={savePillars}
              className="med-btn-outline"
            >
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </button>
          </div>
        </TabsContent>

        {/* Explore Our Learning Section */}
        <TabsContent value="library" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {libraryItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="med-card p-4 space-y-4 relative overflow-hidden group">
                  <button
                    onClick={() => deleteLibraryItem(index)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1.5 rounded-full bg-white/50 hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Image Preview */}
                  <div className="space-y-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-40 object-cover rounded-xl border border-[#b7e4c7] shadow-inner"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/400x300/e2e8f0/1a5d47?text=Item";
                      }}
                    />
                    <input
                      type="text"
                      value={item.image}
                      onChange={(e) => updateLibraryItem(index, "image", e.target.value)}
                      className="med-input text-xs"
                      placeholder="Image URL"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <div>
                      <label className="med-label">Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateLibraryItem(index, "title", e.target.value)}
                        className="med-input"
                        placeholder="Item title"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="med-label">Category</label>
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => updateLibraryItem(index, "category", e.target.value)}
                          className="med-input text-xs"
                          placeholder="Category"
                        />
                      </div>
                      <div>
                        <label className="med-label">Duration</label>
                        <input
                          type="text"
                          value={item.duration}
                          onChange={(e) => updateLibraryItem(index, "duration", e.target.value)}
                          className="med-input text-xs"
                          placeholder="Duration"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={addLibraryItem}
              className="med-btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Item
            </button>
            <button
              onClick={saveLibraryItems}
              className="med-btn-outline"
            >
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </button>
          </div>
        </TabsContent>

        {/* Why Ancient Wisdom Goals Section */}
        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="med-card p-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#1b4332]">Goal {goal.id}</h3>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Image Preview */}
                    <div className="space-y-3">
                      <label className="med-label">Image URL</label>
                      <img
                        src={goal.image}
                        alt={goal.title}
                        className="w-full h-48 object-cover rounded-xl border border-[#b7e4c7] shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/600x400/e2e8f0/1a5d47?text=Image";
                        }}
                      />
                      <input
                        type="text"
                        value={goal.image}
                        onChange={(e) => updateGoal(goal.id, "image", e.target.value)}
                        className="med-input"
                        placeholder="Image URL"
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <div>
                        <label className="med-label">Title</label>
                        <input
                          type="text"
                          value={goal.title}
                          onChange={(e) => updateGoal(goal.id, "title", e.target.value)}
                          className="med-input"
                          placeholder="Goal title"
                        />
                      </div>

                      <div>
                        <label className="med-label">Subtitle</label>
                        <input
                          type="text"
                          value={goal.subtitle}
                          onChange={(e) => updateGoal(goal.id, "subtitle", e.target.value)}
                          className="med-input"
                          placeholder="Goal subtitle"
                        />
                      </div>

                      <div>
                        <label className="med-label">Description</label>
                        <textarea
                          value={goal.desc}
                          onChange={(e) => updateGoal(goal.id, "desc", e.target.value)}
                          rows={3}
                          className="med-input resize-none"
                          placeholder="Goal description"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={addGoal}
              className="med-btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Goal
            </button>
            <button
              onClick={saveGoals}
              className="med-btn-outline"
            >
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </button>
          </div>
        </TabsContent>      </Tabs>
      </div>
    </div>
  );
}