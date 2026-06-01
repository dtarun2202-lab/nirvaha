import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Upload, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BACKEND_CONFIG from '@/config/backend';

interface Story {
  _id?: string;
  category: string;
  title: string;
  description: string;
  authorName: string;
  authorRole: string;
  location: string;
  image: string;
  featured: boolean;
  theme: 'light' | 'dark';
  order?: number;
}

const DEFAULT_STORY: Story = {
  category: 'Personal Growth',
  title: '',
  description: '',
  authorName: '',
  authorRole: '',
  location: '',
  image: '',
  featured: false,
  theme: 'light'
};

export function SuccessStoriesManager() {
  const [stories, setStories] = useState<Story[]>([]);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formError, setFormError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/success-stories`);
      
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
    setPreviewImage('');
    setImageFile(null);
    setFormError('');
    setShowModal(true);
  };

  const handleEditStory = (story: Story) => {
    setEditingStory(story);
    setPreviewImage(story.image);
    setImageFile(null);
    setFormError('');
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
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveStory = async () => {
    if (!editingStory) return;
    
    // Validation
    if (!editingStory.title.trim() || !editingStory.description.trim() || !editingStory.authorName.trim()) {
      setFormError('Title, Description, and Author Name are required fields.');
      return;
    }

    if (!editingStory.image && !imageFile) {
        setFormError('An image must be uploaded.');
        return;
    }
    
    setFormError('');
    setIsSaving(true);

    try {
      let finalImageUrl = editingStory.image;

      // 1. Upload the image file first if a new one was selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadRes = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: formData
        });

        if (!uploadRes.ok) {
          throw new Error('Failed to upload image file');
        }

        const uploadData = await uploadRes.json();
        finalImageUrl = `${BACKEND_CONFIG.API_BASE_URL}${uploadData.url}`;
      }

      // 2. Save the story data
      const storyToSave = {
        ...editingStory,
        image: finalImageUrl
      };

      const method = storyToSave._id ? 'PUT' : 'POST';
      const url = storyToSave._id ? `${BACKEND_CONFIG.API_BASE_URL}/api/success-stories/${storyToSave._id}` : `${BACKEND_CONFIG.API_BASE_URL}/api/success-stories`;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storyToSave)
      });
      
      if (response.ok) {
        fetchStories();
        setShowModal(false);
        setEditingStory(null);
        setImageFile(null);
        setSaveMessage({ type: 'success', text: 'Story saved successfully' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        const errorData = await response.json().catch(() => null);
        setSaveMessage({ type: 'error', text: errorData?.message || 'Failed to save story' });
        setFormError(errorData?.message || 'Failed to save story to database.');
      }
    } catch (error: any) {
      console.error('Error saving story:', error);
      setFormError(error.message || 'Error processing request');
    } finally {
      setIsSaving(false);
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
                  <div className="w-full md:w-40 h-40 flex-shrink-0 overflow-hidden bg-gray-200">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {story.featured && (
                            <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded uppercase tracking-wider">
                            ⭐ Featured
                            </span>
                        )}
                        <span className="text-xs font-bold text-[#1a5d47] uppercase tracking-wider">{story.theme}</span>
                        <span className="text-xs text-gray-500">{story.category}</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#0F131A] mb-1">{story.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-1">{story.description}</p>
                      <p className="text-sm font-semibold text-[#1a5d47]">
                        {story.authorName} {story.authorRole && `• ${story.authorRole}`} {story.location && `• ${story.location}`}
                      </p>
                    </div>
                  </div>
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
              <div className="sticky top-0 bg-gradient-to-r from-[#1a5d47] to-[#2a7d67] text-white p-6 flex justify-between items-center z-10">
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

              <div className="p-6 space-y-6">
                {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                        {formError}
                    </div>
                )}

                {/* Media Section */}
                <div>
                  <h3 className="text-lg font-bold border-b pb-2 mb-4">Media</h3>
                  <label className="block text-sm font-bold text-[#0F131A] mb-3">Upload Image *</label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-[#1a5d47] rounded-lg cursor-pointer hover:bg-[#1a5d47]/5 transition-all overflow-hidden relative group">
                        {previewImage ? (
                          <>
                            <img src={previewImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Upload className="w-6 h-6 text-white mb-2" />
                              <span className="text-sm text-white font-medium">Click to change image</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-6 h-6 text-[#1a5d47] mb-2" />
                            <span className="text-sm text-gray-600">Click to upload image</span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Story Details */}
                <div>
                    <h3 className="text-lg font-bold border-b pb-2 mb-4">Story Details</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-bold text-[#0F131A] mb-2">Category</label>
                        <input
                        type="text"
                        value={editingStory.category}
                        onChange={(e) => setEditingStory({ ...editingStory, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                        placeholder="e.g., Personal Growth"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#0F131A] mb-2">Title *</label>
                        <input
                        type="text"
                        value={editingStory.title}
                        onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                        placeholder="Enter story title"
                        />
                    </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#0F131A] mb-2">Description / Quote *</label>
                        <textarea
                            value={editingStory.description}
                            onChange={(e) => setEditingStory({ ...editingStory, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                            placeholder="Enter the testimonial, quote, or full description"
                        />
                    </div>
                </div>

                {/* Author Details */}
                <div>
                    <h3 className="text-lg font-bold border-b pb-2 mb-4">Author Details</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-[#0F131A] mb-2">Author Name *</label>
                        <input
                        type="text"
                        value={editingStory.authorName}
                        onChange={(e) => setEditingStory({ ...editingStory, authorName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                        placeholder="User's name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#0F131A] mb-2">Author Role</label>
                        <input
                        type="text"
                        value={editingStory.authorRole}
                        onChange={(e) => setEditingStory({ ...editingStory, authorRole: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                        placeholder="e.g., Software Engineer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#0F131A] mb-2">Location</label>
                        <input
                        type="text"
                        value={editingStory.location}
                        onChange={(e) => setEditingStory({ ...editingStory, location: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                        placeholder="e.g., Bangalore"
                        />
                    </div>
                    </div>
                </div>

                {/* Display Options */}
                <div>
                    <h3 className="text-lg font-bold border-b pb-2 mb-4">Display Options</h3>
                    <div className="flex flex-col gap-4">
                        <label className="flex items-center gap-3 cursor-pointer p-4 border rounded-lg hover:bg-gray-50">
                            <input 
                                type="checkbox" 
                                checked={editingStory.featured}
                                onChange={(e) => setEditingStory({ ...editingStory, featured: e.target.checked })}
                                className="w-5 h-5 text-[#1a5d47] rounded focus:ring-[#1a5d47]"
                            />
                            <div>
                                <p className="font-bold text-[#0F131A]">Featured Story</p>
                                <p className="text-sm text-gray-500">If checked, this story will render in the large left card on the dashboard.</p>
                            </div>
                        </label>
                        
                        <div>
                            <label className="block text-sm font-bold text-[#0F131A] mb-2">Card Theme</label>
                            <select
                                value={editingStory.theme}
                                onChange={(e) => setEditingStory({ ...editingStory, theme: e.target.value as 'light' | 'dark' })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                            >
                                <option value="light">Light Theme (White Background)</option>
                                <option value="dark">Dark Theme (Teal Background)</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Applies only to non-featured (small) cards.</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-6 border-t">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveStory}
                    disabled={isSaving}
                    className={`flex-1 flex items-center justify-center gap-2 ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1a5d47] hover:bg-[#113d2f]'} text-white py-3 rounded-lg font-semibold transition-all`}
                  >
                    <Save className="w-5 h-5" /> {isSaving ? 'Saving...' : 'Save Story'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(false)}
                    disabled={isSaving}
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
