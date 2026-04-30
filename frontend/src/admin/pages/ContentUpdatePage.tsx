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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Landing Page Content Management</h1>
        <p className="text-gray-700">
          Update images, titles, and descriptions for all landing page sections
        </p>
      </div>

      <Tabs defaultValue="pillars" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="pillars" className="text-base">
            What is Nirvaha (5 Pillars)
          </TabsTrigger>
          <TabsTrigger value="library" className="text-base">
            Explore Our Learning (Library)
          </TabsTrigger>
          <TabsTrigger value="goals" className="text-base">
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
                <Card className="bg-white border-emerald-200 p-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-black">Pillar {pillar.id}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePillar(pillar.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Image Preview */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Image URL</label>
                      <img
                        src={pillar.image}
                        alt={pillar.title}
                        className="w-full h-48 object-cover rounded-lg border border-gray-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/600x400/e2e8f0/1a5d47?text=Image";
                        }}
                      />
                      <input
                        type="text"
                        value={pillar.image}
                        onChange={(e) => updatePillar(pillar.id, "image", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                        placeholder="Image URL"
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Title</label>
                        <input
                          type="text"
                          value={pillar.title}
                          onChange={(e) => updatePillar(pillar.id, "title", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Pillar title"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Description</label>
                        <textarea
                          value={pillar.desc}
                          onChange={(e) => updatePillar(pillar.id, "desc", e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                          placeholder="Pillar description"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={addPillar}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Pillar
            </Button>
            <Button
              onClick={savePillars}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </Button>
          </div>
        </TabsContent>

        {/* Explore Our Learning Section */}
        <TabsContent value="library" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {libraryItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-white border-emerald-200 p-4 space-y-4 relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteLibraryItem(index)}
                    className="absolute top-2 right-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  {/* Image Preview */}
                  <div className="space-y-2">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-40 object-cover rounded-lg border border-gray-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/400x300/e2e8f0/1a5d47?text=Item";
                      }}
                    />
                    <input
                      type="text"
                      value={item.image}
                      onChange={(e) => updateLibraryItem(index, "image", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Image URL"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1">Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateLibraryItem(index, "title", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Item title"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1">Category</label>
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => updateLibraryItem(index, "category", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Category"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1">Duration</label>
                      <input
                        type="text"
                        value={item.duration}
                        onChange={(e) => updateLibraryItem(index, "duration", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Duration"
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={addLibraryItem}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Item
            </Button>
            <Button
              onClick={saveLibraryItems}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </Button>
          </div>
        </TabsContent>

        {/* Why Ancient Wisdom Goals Section */}
        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-white border-emerald-200 p-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-black">Goal {goal.id}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteGoal(goal.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Image Preview */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Image URL</label>
                      <img
                        src={goal.image}
                        alt={goal.title}
                        className="w-full h-48 object-cover rounded-lg border border-gray-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/600x400/e2e8f0/1a5d47?text=Image";
                        }}
                      />
                      <input
                        type="text"
                        value={goal.image}
                        onChange={(e) => updateGoal(goal.id, "image", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                        placeholder="Image URL"
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Title</label>
                        <input
                          type="text"
                          value={goal.title}
                          onChange={(e) => updateGoal(goal.id, "title", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Goal title"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Subtitle</label>
                        <input
                          type="text"
                          value={goal.subtitle}
                          onChange={(e) => updateGoal(goal.id, "subtitle", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Goal subtitle"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Description</label>
                        <textarea
                          value={goal.desc}
                          onChange={(e) => updateGoal(goal.id, "desc", e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                          placeholder="Goal description"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={addGoal}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Goal
            </Button>
            <Button
              onClick={saveGoals}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </Button>
          </div>
        </TabsContent>      </Tabs>
    </div>
  );
}