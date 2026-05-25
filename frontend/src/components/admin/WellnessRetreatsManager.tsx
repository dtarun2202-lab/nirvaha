import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Save, X, Upload, ArrowUp, ArrowDown, Eye, EyeOff, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BACKEND_CONFIG from '@/config/backend';

interface Retreat {
  _id?: string;
  category: string;
  title: string;
  description: string;
  image: string;
  externalLink: string;
  buttonLabel: string;
  displayOrder?: number;
  isActive: boolean;
}

const CATEGORIES = [
  'Health & Wellness Retreats',
  'Self Discovery Retreats',
  'Yoga Escapes',
  'Meditation Camps',
  'Spiritual Healing',
  'Sound Healing Experiences'
];

const DEFAULT_RETREAT: Retreat = {
  category: 'Health & Wellness Retreats',
  title: '',
  description: '',
  image: '',
  externalLink: '',
  buttonLabel: 'Explore',
  isActive: true
};

export function WellnessRetreatsManager() {
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [editingRetreat, setEditingRetreat] = useState<Retreat | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formError, setFormError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  const triggerError = (msg: string) => {
    setFormError(msg);
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetchRetreats();
  }, []);

  const fetchRetreats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/wellness-retreats/all`);
      
      if (!response.ok) {
        setRetreats([]);
        return;
      }
      
      const data = await response.json();
      setRetreats(data.retreats || []);
    } catch (error) {
      console.error('Error fetching retreats:', error);
      setRetreats([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRetreat = () => {
    setEditingRetreat({ ...DEFAULT_RETREAT });
    setPreviewImage('');
    setImageFile(null);
    setFormError('');
    setIsCustomCategory(false);
    setCustomCategory('');
    setShowModal(true);
  };

  const handleEditRetreat = (retreat: Retreat) => {
    setEditingRetreat(retreat);
    setPreviewImage(retreat.image);
    setImageFile(null);
    setFormError('');
    
    const isPredefined = CATEGORIES.includes(retreat.category);
    setIsCustomCategory(!isPredefined);
    if (!isPredefined) {
      setCustomCategory(retreat.category);
    } else {
      setCustomCategory('');
    }
    
    setShowModal(true);
  };

  const handleDeleteRetreat = async (id?: string) => {
    if (!id || !confirm('Are you sure you want to permanently delete this retreat?')) return;
    try {
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/wellness-retreats/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchRetreats();
        setSaveMessage({ type: 'success', text: 'Retreat deleted successfully' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting retreat:', error);
      setSaveMessage({ type: 'error', text: 'Failed to delete retreat' });
    }
  };

  const handleToggleActive = async (retreat: Retreat) => {
    if (!retreat._id) return;
    try {
      const updatedRetreat = { ...retreat, isActive: !retreat.isActive };
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/wellness-retreats/${retreat._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: updatedRetreat.isActive })
      });

      if (response.ok) {
        setRetreats(prev => prev.map(r => r._id === retreat._id ? { ...r, isActive: updatedRetreat.isActive } : r));
        setSaveMessage({ type: 'success', text: `Retreat ${updatedRetreat.isActive ? 'enabled' : 'disabled'} successfully` });
        setTimeout(() => setSaveMessage(null), 2000);
      } else {
        throw new Error('Failed to toggle status');
      }
    } catch (error) {
      console.error('Error toggling retreat status:', error);
      setSaveMessage({ type: 'error', text: 'Failed to update status' });
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

  const handleSaveRetreat = async () => {
    if (!editingRetreat) return;
    
    const finalCategory = isCustomCategory ? customCategory.trim() : editingRetreat.category;

    // Validation
    if (!editingRetreat.title.trim() || !editingRetreat.description.trim() || !finalCategory) {
      triggerError('Title, Subtitle/Description, and Category are required.');
      return;
    }

    if (!editingRetreat.image && !imageFile) {
      triggerError('An image is required.');
      return;
    }
    
    setFormError('');
    setIsSaving(true);

    try {
      let finalImageUrl = editingRetreat.image;

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

      // 2. Save the retreat data
      const retreatToSave = {
        ...editingRetreat,
        category: finalCategory,
        image: finalImageUrl
      };

      const method = retreatToSave._id ? 'PUT' : 'POST';
      const url = retreatToSave._id 
        ? `${BACKEND_CONFIG.API_BASE_URL}/api/wellness-retreats/${retreatToSave._id}` 
        : `${BACKEND_CONFIG.API_BASE_URL}/api/wellness-retreats`;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(retreatToSave)
      });
      
      if (response.ok) {
        fetchRetreats();
        setShowModal(false);
        setEditingRetreat(null);
        setImageFile(null);
        setSaveMessage({ type: 'success', text: 'Retreat saved successfully' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        let errMsg = 'Failed to save retreat to database.';
        try {
          // Clone the response so we can read it twice if needed
          const clonedResponse = response.clone();
          const errorData = await clonedResponse.json();
          if (errorData?.message) {
            errMsg = errorData.message;
            if (errorData.error) {
              errMsg += `: ${errorData.error}`;
            }
          }
        } catch (e) {
          try {
            const textData = await response.text();
            if (textData) {
              errMsg = `Server Error (${response.status}): ${textData.substring(0, 150)}`;
            }
          } catch (e2) {}
        }
        triggerError(errMsg);
      }
    } catch (error: any) {
      console.error('Error saving retreat:', error);
      triggerError(error.message || 'Error processing request');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveRetreat = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === retreats.length - 1)
    ) {
      return;
    }

    const newRetreats = [...retreats];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newRetreats[index], newRetreats[swapIndex]] = [newRetreats[swapIndex], newRetreats[index]];

    setRetreats(newRetreats);

    // Update order in backend
    try {
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/wellness-retreats/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          retreatIds: newRetreats.map(r => r._id)
        })
      });
      if (response.ok) {
        setSaveMessage({ type: 'success', text: 'Order updated' });
        setTimeout(() => setSaveMessage(null), 2000);
      } else {
        throw new Error('Reordering failed');
      }
    } catch (error) {
      console.error('Error reordering retreats:', error);
      fetchRetreats(); // Revert on error
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1a5d47] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1a5d47] font-semibold">Loading Wellness Retreats...</p>
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
              Wellness Retreats Manager
            </h1>
            <p className="text-gray-600 mt-2">
              {retreats.length} retreat cards • Manage dynamic wellness spaces, escapes & healing journeys
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddRetreat}
            className="flex items-center gap-2 bg-[#1a5d47] hover:bg-[#113d2f] text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md"
          >
            <Plus className="w-5 h-5" /> Add Retreat Card
          </motion.button>
        </div>

        <AnimatePresence>
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg font-semibold shadow-sm ${
                saveMessage.type === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}
            >
              {saveMessage.text}
            </motion.div>
          )}
        </AnimatePresence>

        {retreats.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <Compass className="w-16 h-16 text-[#1a5d47] mx-auto mb-4 opacity-40" />
            <p className="text-gray-600 text-lg mb-6">No retreat cards created yet</p>
            <button
              onClick={handleAddRetreat}
              className="inline-flex items-center gap-2 bg-[#1a5d47] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#113d2f] transition-all shadow-md"
            >
              <Plus className="w-5 h-5" /> Create First Retreat
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {retreats.map((retreat, idx) => (
              <motion.div
                key={retreat._id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all border ${
                  retreat.isActive ? 'border-transparent' : 'border-gray-200 opacity-75'
                }`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image container */}
                  <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0 overflow-hidden bg-gray-200 relative">
                    <img
                      src={retreat.image}
                      alt={retreat.title}
                      className="w-full h-full object-cover"
                    />
                    {!retreat.isActive && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="bg-red-500 text-white font-bold text-xs uppercase tracking-widest px-3 py-1 rounded shadow-sm">
                          Disabled
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-xs font-bold text-[#1a5d47] bg-[#1a5d47]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {retreat.category}
                        </span>
                        {retreat.externalLink && (
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded font-mono truncate max-w-[200px]">
                            {retreat.externalLink}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-[#0F131A] mb-2">{retreat.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{retreat.description}</p>
                    </div>

                    <div className="flex items-center gap-3 mt-4 text-xs font-medium text-gray-500">
                      <span>Button: <strong>{retreat.buttonLabel}</strong></span>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex md:flex-col justify-end md:justify-start gap-2 p-4 border-t md:border-t-0 md:border-l border-gray-100 bg-gray-50/50 flex-wrap">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleActive(retreat)}
                      className={`p-2 rounded-lg transition-all border ${
                        retreat.isActive
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200'
                          : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200'
                      }`}
                      title={retreat.isActive ? 'Disable card' : 'Enable card'}
                    >
                      {retreat.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditRetreat(retreat)}
                      className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMoveRetreat(idx, 'up')}
                      disabled={idx === 0}
                      className={`p-2 rounded-lg border transition-all ${
                        idx === 0
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed border-gray-200'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                      }`}
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMoveRetreat(idx, 'down')}
                      disabled={idx === retreats.length - 1}
                      className={`p-2 rounded-lg border transition-all ${
                        idx === retreats.length - 1
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed border-gray-200'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                      }`}
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => retreat._id && handleDeleteRetreat(retreat._id)}
                      className="p-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg transition-all"
                      title="Delete permanently"
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
        {showModal && editingRetreat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1a5d47] to-[#267f62] text-white p-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Compass className="w-6 h-6 animate-pulse" />
                  <h2 className="text-2xl font-bold">
                    {editingRetreat._id ? 'Edit Retreat Card' : 'Add Wellness Retreat Card'}
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form Body */}
              <div ref={modalScrollRef} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold">
                    {formError}
                  </div>
                )}

                {/* Media Section */}
                <div>
                  <h3 className="text-lg font-bold border-b pb-2 mb-4 text-[#1a5d47]">Retreat Thumbnail</h3>
                  <label className="block text-sm font-bold text-[#0F131A] mb-3">Upload Image *</label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-[#1a5d47] rounded-xl cursor-pointer hover:bg-[#1a5d47]/5 transition-all overflow-hidden relative group">
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
                            <Upload className="w-8 h-8 text-[#1a5d47] mb-2" />
                            <span className="text-sm text-gray-600 font-medium">Click to upload image</span>
                            <span className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 50MB</span>
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

                {/* Retreat Details */}
                <div>
                  <h3 className="text-lg font-bold border-b pb-2 mb-4 text-[#1a5d47]">Retreat Information</h3>
                  <div className="space-y-4">
                    {/* Category Select */}
                    <div>
                      <label className="block text-sm font-bold text-[#0F131A] mb-2">Category *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <select
                          value={isCustomCategory ? 'custom' : editingRetreat.category}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'custom') {
                              setIsCustomCategory(true);
                            } else {
                              setIsCustomCategory(false);
                              setEditingRetreat({ ...editingRetreat, category: val });
                            }
                          }}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                          <option value="custom">-- Custom Category (Enter below) --</option>
                        </select>

                        {isCustomCategory && (
                          <input
                            type="text"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47] animate-fadeIn"
                            placeholder="Enter custom category name"
                          />
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-bold text-[#0F131A] mb-2">Title *</label>
                      <input
                        type="text"
                        value={editingRetreat.title}
                        onChange={(e) => setEditingRetreat({ ...editingRetreat, title: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                        placeholder="e.g., Silent Forest Meditation Escapes"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-bold text-[#0F131A] mb-2">Subtitle / Short Description *</label>
                      <textarea
                        value={editingRetreat.description}
                        onChange={(e) => setEditingRetreat({ ...editingRetreat, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                        placeholder="Describe the healing journey or escape in a few sentences..."
                      />
                    </div>
                  </div>
                </div>

                {/* Navigation and Call to Action */}
                <div>
                  <h3 className="text-lg font-bold border-b pb-2 mb-4 text-[#1a5d47]">Links & Call to Action</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#0F131A] mb-2">External Link URL</label>
                      <input
                        type="text"
                        value={editingRetreat.externalLink}
                        onChange={(e) => setEditingRetreat({ ...editingRetreat, externalLink: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                        placeholder="e.g., https://example.com/retreat-booking"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#0F131A] mb-2">Button Label</label>
                      <input
                        type="text"
                        value={editingRetreat.buttonLabel}
                        onChange={(e) => setEditingRetreat({ ...editingRetreat, buttonLabel: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                        placeholder="e.g., Explore, View Retreat, Book Now"
                      />
                    </div>
                  </div>
                </div>

                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold animate-shake">
                    {formError}
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex gap-4 pt-6 border-t">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveRetreat}
                    disabled={isSaving}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all text-white shadow ${
                      isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1a5d47] hover:bg-[#113d2f]'
                    }`}
                  >
                    <Save className="w-5 h-5" /> {isSaving ? 'Saving...' : 'Save Retreat Card'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)}
                    disabled={isSaving}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-bold transition-all shadow"
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
