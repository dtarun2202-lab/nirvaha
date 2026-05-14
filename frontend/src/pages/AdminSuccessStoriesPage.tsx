import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Upload, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Story {
  _id?: string;
  title: string;
  description: string;
  quote: string;
  image: string;
  imageName?: string;
  category: string;
  userName: string;
  location: string;
  rating: number;
  badge: string;
  bgColor: string;
  textColor: string;
  type: 'featured' | 'small';
}

const DEFAULT_STORY: Story = {
  title: 'Enter Story Title',
  description: 'Enter description or transformation details',
  quote: 'Enter inspirational quote',
  image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1200&auto=format&fit=crop',
  category: 'Personal Growth',
  userName: 'User Name',
  location: 'City, Role',
  rating: 5,
  badge: 'TRANSFORMATION',
  bgColor: 'bg-white',
  textColor: 'text-[#1a5d47]',
  type: 'featured'
};

export function AdminSuccessStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      // Replace with your backend API URL
      const response = await fetch('/api/success-stories', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setStories(data.stories || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
      // Set default stories if API fails
      setStories([
        {
          ...DEFAULT_STORY,
          title: 'From Burnout to Balance in 21 Days',
          quote: '"The guided meditation protocols didn\'t just help me sleep; they helped me rediscover the joy in my work."',
          userName: 'Rohit K.',
          location: 'Software Engineer, Hyderabad',
          type: 'featured'
        },
        {
          ...DEFAULT_STORY,
          title: 'Overcoming Anxiety Through Sound',
          description: 'Personal Growth',
          quote: '"The binaural beats and ancient chanting modules provided a sanctuary I didn\'t know I needed."',
          userName: 'Marcus J.',
          location: 'Tech Professional',
          bgColor: 'bg-white',
          type: 'small'
        },
        {
          ...DEFAULT_STORY,
          title: 'Chronic Pain Relief via Ayurvedic Wisdom',
          description: 'Health Mastery',
          quote: 'Reversing years of back pain through consistent yoga nidra and herbal guidance.',
          userName: 'Sarah P.',
          location: 'Wellness Coach',
          bgColor: 'bg-[#1a5d47]',
          textColor: 'text-white',
          type: 'small'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStory = () => {
    setEditingStory({ ...DEFAULT_STORY });
    setPreviewImage(DEFAULT_STORY.image);
    setImageFile(null);
    setShowModal(true);
  };

  const handleEditStory = (story: Story) => {
    setEditingStory(story);
    setPreviewImage(story.image);
    setImageFile(null);
    setShowModal(true);
  };

  const handleDeleteStory = async (id?: string) => {
    if (!id) return;
    try {
      await fetch(`/api/success-stories/${id}`, { method: 'DELETE' });
      fetchStories();
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        if (editingStory) {
          setEditingStory({ ...editingStory, image: reader.result as string, imageName: file.name });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveStory = async () => {
    if (!editingStory) return;
    
    try {
      const method = editingStory._id ? 'PUT' : 'POST';
      const url = editingStory._id ? `/api/success-stories/${editingStory._id}` : '/api/success-stories';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStory)
      });
      
      if (response.ok) {
        fetchStories();
        setShowModal(false);
        setEditingStory(null);
      }
    } catch (error) {
      console.error('Error saving story:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#EEF7F1]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1a5d47] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1a5d47] font-semibold">Loading Stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF7F1] p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-[#0F131A] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
              Success Stories Admin
            </h1>
            <p className="text-gray-600">Manage your success stories and testimonials</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddStory}
            className="flex items-center gap-2 bg-[#1a5d47] hover:bg-[#113d2f] text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <Plus className="w-5 h-5" /> Add New Story
          </motion.button>
        </div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {stories.map((story, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Image Preview */}
              <div className="relative h-40 overflow-hidden bg-gray-200">
                <img src={previewImage || story.image} alt={story.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEditStory(story)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => story._id && handleDeleteStory(story._id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-3">
                  <span className="text-xs font-bold text-[#1a5d47] uppercase tracking-wider">{story.category}</span>
                </div>
                <h3 className="text-lg font-bold text-[#0F131A] mb-2 line-clamp-2">{story.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{story.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1a5d47]/10 flex items-center justify-center text-[#1a5d47] text-xs font-bold">
                    {story.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0F131A]">{story.userName}</p>
                    <p className="text-xs text-gray-500">{story.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showModal && editingStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#1a5d47] to-[#2a7d67] text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {editingStory._id ? 'Edit Story' : 'Add New Story'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold text-[#0F131A] mb-3">Story Image</label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-[#1a5d47] rounded-lg cursor-pointer hover:bg-[#1a5d47]/5 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-6 h-6 text-[#1a5d47] mb-2" />
                          <span className="text-sm text-gray-600">Click to upload</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {previewImage && (
                      <div className="w-32 h-32 rounded-lg overflow-hidden">
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#0F131A] mb-2">Title</label>
                    <input
                      type="text"
                      value={editingStory.title}
                      onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F131A] mb-2">Category</label>
                    <input
                      type="text"
                      value={editingStory.category}
                      onChange={(e) => setEditingStory({ ...editingStory, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0F131A] mb-2">Quote/Description</label>
                  <textarea
                    value={editingStory.quote}
                    onChange={(e) => setEditingStory({ ...editingStory, quote: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#0F131A] mb-2">User Name</label>
                    <input
                      type="text"
                      value={editingStory.userName}
                      onChange={(e) => setEditingStory({ ...editingStory, userName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F131A] mb-2">Location/Role</label>
                    <input
                      type="text"
                      value={editingStory.location}
                      onChange={(e) => setEditingStory({ ...editingStory, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#0F131A] mb-2">Rating</label>
                    <select
                      value={editingStory.rating}
                      onChange={(e) => setEditingStory({ ...editingStory, rating: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                    >
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F131A] mb-2">Type</label>
                    <select
                      value={editingStory.type}
                      onChange={(e) => setEditingStory({ ...editingStory, type: e.target.value as 'featured' | 'small' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                    >
                      <option value="featured">Featured</option>
                      <option value="small">Small</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F131A] mb-2">Badge</label>
                    <input
                      type="text"
                      value={editingStory.badge}
                      onChange={(e) => setEditingStory({ ...editingStory, badge: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveStory}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#1a5d47] hover:bg-[#113d2f] text-white py-3 rounded-lg font-semibold transition-all"
                  >
                    <Save className="w-5 h-5" /> Save Changes
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-all"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
