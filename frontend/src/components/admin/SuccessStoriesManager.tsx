import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Upload, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BACKEND_CONFIG from '@/config/backend';

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
  order?: number;
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

export function SuccessStoriesManager() {
  const [stories, setStories] = useState<Story[]>([]);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/success-stories`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        setStories([]);
        return;
      }
      
      const data = await response.json();
      setStories(data.stories || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setStories([]);
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
    if (!id || !confirm('Are you sure you want to delete this story?')) return;
    try {
      await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/success-stories/${id}`, { method: 'DELETE' });
      fetchStories();
      setSaveMessage({ type: 'success', text: 'Story deleted successfully' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error deleting story:', error);
      setSaveMessage({ type: 'error', text: 'Failed to delete story' });
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
      const url = editingStory._id ? `${BACKEND_CONFIG.API_BASE_URL}/api/success-stories/${editingStory._id}` : `${BACKEND_CONFIG.API_BASE_URL}/api/success-stories`;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStory)
      });
      
      if (response.ok) {
        fetchStories();
        setShowModal(false);
        setEditingStory(null);
        setSaveMessage({ type: 'success', text: 'Story saved successfully' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage({ type: 'error', text: 'Failed to save story' });
      }
    } catch (error) {
      console.error('Error saving story:', error);
      setSaveMessage({ type: 'error', text: 'Error saving story' });
    }
  };

  const handleMoveStory = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === stories.length - 1)
    ) {
      return;
    }

    const newStories = [...stories];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newStories[index], newStories[swapIndex]] = [newStories[swapIndex], newStories[index]];

    setStories(newStories);

    // Update order in backend
    try {
      await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/success-stories/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyIds: newStories.map((s, i) => ({ id: s._id, order: i }))
        })
      });
      setSaveMessage({ type: 'success', text: 'Order updated' });
      setTimeout(() => setSaveMessage(null), 2000);
    } catch (error) {
      console.error('Error reordering:', error);
      fetchStories(); // Revert on error
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1a5d47] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1a5d47] font-semibold">Loading Success Stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF7F1] p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#0F131A]" style={{ fontFamily: "'Cinzel', serif" }}>
              Success Stories Manager
            </h1>
            <p className="text-gray-600 mt-2">
              {stories.length} stories • Manage testimonials and transformations
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddStory}
            className="flex items-center gap-2 bg-[#1a5d47] hover:bg-[#113d2f] text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <Plus className="w-5 h-5" /> Add Story
          </motion.button>
        </div>

        {/* Status Message */}
        <AnimatePresence>
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg font-semibold ${
                saveMessage.type === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}
            >
              {saveMessage.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stories Grid */}
        {stories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <p className="text-gray-600 text-lg mb-4">No success stories yet</p>
            <button
              onClick={handleAddStory}
              className="inline-flex items-center gap-2 bg-[#1a5d47] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#113d2f] transition-all"
            >
              <Plus className="w-5 h-5" /> Create First Story
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {stories.map((story, idx) => (
              <motion.div
                key={story._id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="w-full md:w-40 h-40 flex-shrink-0 overflow-hidden bg-gray-200">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-[#1a5d47] uppercase tracking-wider">
                          {story.type === 'featured' ? '⭐ Featured' : 'Story'}
                        </span>
                        <span className="text-xs text-gray-500">{story.category}</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#0F131A] mb-1">{story.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-1">{story.quote}</p>
                      <p className="text-sm font-semibold text-[#1a5d47]">
                        {story.userName} • {story.location}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 p-4 border-t md:border-t-0 md:border-l border-gray-200">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEditStory(story)}
                      className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleMoveStory(idx, 'up')}
                      disabled={idx === 0}
                      className={`p-2 rounded-lg transition-all ${
                        idx === 0
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleMoveStory(idx, 'down')}
                      disabled={idx === stories.length - 1}
                      className={`p-2 rounded-lg transition-all ${
                        idx === stories.length - 1
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => story._id && handleDeleteStory(story._id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
                          <span className="text-sm text-gray-600">Click to upload image</span>
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
                      <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#0F131A] mb-2">Story Title *</label>
                    <input
                      type="text"
                      value={editingStory.title}
                      onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47] focus:ring-1 focus:ring-[#1a5d47]"
                      placeholder="Enter story title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F131A] mb-2">Category *</label>
                    <input
                      type="text"
                      value={editingStory.category}
                      onChange={(e) => setEditingStory({ ...editingStory, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47] focus:ring-1 focus:ring-[#1a5d47]"
                      placeholder="e.g., Personal Growth"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0F131A] mb-2">Testimonial/Quote *</label>
                  <textarea
                    value={editingStory.quote}
                    onChange={(e) => setEditingStory({ ...editingStory, quote: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47] focus:ring-1 focus:ring-[#1a5d47]"
                    placeholder="Enter the testimonial or quote"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#0F131A] mb-2">User Name *</label>
                    <input
                      type="text"
                      value={editingStory.userName}
                      onChange={(e) => setEditingStory({ ...editingStory, userName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47] focus:ring-1 focus:ring-[#1a5d47]"
                      placeholder="User's name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F131A] mb-2">Role/Location *</label>
                    <input
                      type="text"
                      value={editingStory.location}
                      onChange={(e) => setEditingStory({ ...editingStory, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47] focus:ring-1 focus:ring-[#1a5d47]"
                      placeholder="e.g., Software Engineer, Bangalore"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#0F131A] mb-2">Rating (Stars)</label>
                    <select
                      value={editingStory.rating}
                      onChange={(e) => setEditingStory({ ...editingStory, rating: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47] focus:ring-1 focus:ring-[#1a5d47]"
                    >
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F131A] mb-2">Type</label>
                    <select
                      value={editingStory.type}
                      onChange={(e) => setEditingStory({ ...editingStory, type: e.target.value as 'featured' | 'small' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47] focus:ring-1 focus:ring-[#1a5d47]"
                    >
                      <option value="featured">Featured (Large)</option>
                      <option value="small">Small (Card)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F131A] mb-2">Badge/Tag</label>
                    <input
                      type="text"
                      value={editingStory.badge}
                      onChange={(e) => setEditingStory({ ...editingStory, badge: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47] focus:ring-1 focus:ring-[#1a5d47]"
                      placeholder="e.g., TRANSFORMATION"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#0F131A] mb-2">Background Color (Tailwind)</label>
                    <select
                      value={editingStory.bgColor}
                      onChange={(e) => setEditingStory({ ...editingStory, bgColor: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47] focus:ring-1 focus:ring-[#1a5d47]"
                    >
                      <option value="bg-white">White</option>
                      <option value="bg-[#1a5d47]">Teal (Dark)</option>
                      <option value="bg-emerald-50">Light Teal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F131A] mb-2">Text Color (Tailwind)</label>
                    <select
                      value={editingStory.textColor}
                      onChange={(e) => setEditingStory({ ...editingStory, textColor: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47] focus:ring-1 focus:ring-[#1a5d47]"
                    >
                      <option value="text-[#0F131A]">Dark</option>
                      <option value="text-[#1a5d47]">Teal</option>
                      <option value="text-white">White</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveStory}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#1a5d47] hover:bg-[#113d2f] text-white py-3 rounded-lg font-semibold transition-all"
                  >
                    <Save className="w-5 h-5" /> Save Story
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
