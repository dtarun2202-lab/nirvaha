import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Save, X, Upload, ArrowUp, ArrowDown, Eye, EyeOff, HelpCircle, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BACKEND_CONFIG from '@/config/backend';

interface Recommendation {
  icon: string;
  text: string;
}

interface ProblemDropdown {
  title: string;
  description: string;
}

interface CommonProblemAdmin {
  _id?: string;
  title: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  hoverBg: string;
  activeBg: string;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  accentLight: string;
  modalGradient: string;
  image: string;
  description: string;
  solutions: string[];
  recommendations: Recommendation[];
  dropdownSectionTitle: string;
  dropdowns: ProblemDropdown[];
  displayOrder?: number;
  isActive: boolean;
}

const AVAILABLE_ICONS = [
  'Flame', 'Zap', 'Moon', 'Cloud', 'Activity', 'Users', 'Heart', 'Brain',
  'Sun', 'Star', 'Shield', 'Coffee', 'Eye', 'Frown', 'AlertTriangle', 'Droplets'
];

const RECOMMENDATION_ICONS = ['Clock', 'Headphones', 'MessageCircle', 'Calendar'];

// Predefined color presets
const COLOR_PRESETS = [
  {
    name: 'Amber (Burnout)',
    accentColor: '#D4A574',
    accentLight: '#F9F3E8',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    hoverBg: 'hover:bg-amber-50',
    activeBg: 'bg-amber-100',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-orange-400',
    modalGradient: 'from-amber-400 to-orange-400',
  },
  {
    name: 'Green (Stress)',
    accentColor: '#A8C99F',
    accentLight: '#F0F5ED',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    hoverBg: 'hover:bg-green-50',
    activeBg: 'bg-green-100',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-emerald-400',
    modalGradient: 'from-green-400 to-emerald-400',
  },
  {
    name: 'Slate (Sleep)',
    accentColor: '#9FA8BA',
    accentLight: '#F2F5FA',
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-300',
    hoverBg: 'hover:bg-slate-50',
    activeBg: 'bg-slate-200',
    gradientFrom: 'from-slate-600',
    gradientTo: 'to-blue-700',
    modalGradient: 'from-slate-700 to-blue-900',
  },
  {
    name: 'Purple (Anxiety)',
    accentColor: '#D8C5E5',
    accentLight: '#F7F3FC',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    hoverBg: 'hover:bg-purple-50',
    activeBg: 'bg-purple-100',
    gradientFrom: 'from-purple-400',
    gradientTo: 'to-indigo-500',
    modalGradient: 'from-purple-400 to-indigo-500',
  },
  {
    name: 'Rose (Mood)',
    accentColor: '#E5B8A8',
    accentLight: '#FAF0ED',
    color: 'text-rose-500',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    hoverBg: 'hover:bg-rose-50',
    activeBg: 'bg-rose-100',
    gradientFrom: 'from-rose-400',
    gradientTo: 'to-pink-400',
    modalGradient: 'from-rose-400 to-pink-400',
  },
  {
    name: 'Cyan (Connection)',
    accentColor: '#A8D4E0',
    accentLight: '#F0F8FB',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    hoverBg: 'hover:bg-cyan-50',
    activeBg: 'bg-cyan-100',
    gradientFrom: 'from-cyan-400',
    gradientTo: 'to-teal-500',
    modalGradient: 'from-cyan-400 to-teal-500',
  },
];

const DEFAULT_PROBLEM: CommonProblemAdmin = {
  title: '',
  icon: 'Flame',
  ...COLOR_PRESETS[0],
  image: '',
  description: '',
  solutions: [],
  recommendations: [],
  dropdownSectionTitle: 'Why the mind keeps repeating',
  dropdowns: [],
  isActive: true
};

export function CommonProblemsManagementPage() {
  const [problems, setProblems] = useState<CommonProblemAdmin[]>([]);
  const [editingProblem, setEditingProblem] = useState<CommonProblemAdmin | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [solutionInput, setSolutionInput] = useState('');
  const modalScrollRef = useRef<HTMLDivElement>(null);

  const triggerError = (msg: string) => {
    setFormError(msg);
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/common-problems/all`);
      if (!response.ok) {
        setProblems([]);
        return;
      }
      const data = await response.json();
      setProblems(data.problems || []);
    } catch (error) {
      console.error('Error fetching problems:', error);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProblem = () => {
    setEditingProblem({ ...DEFAULT_PROBLEM });
    setPreviewImage('');
    setImageFile(null);
    setFormError('');
    setSolutionInput('');
    setShowModal(true);
  };

  const handleEditProblem = (problem: CommonProblemAdmin) => {
    setEditingProblem({ ...problem });
    setPreviewImage(problem.image);
    setImageFile(null);
    setFormError('');
    setSolutionInput('');
    setShowModal(true);
  };

  const handleDeleteProblem = async (id?: string) => {
    if (!id || !confirm('Are you sure you want to permanently delete this problem?')) return;
    try {
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/common-problems/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchProblems();
        setSaveMessage({ type: 'success', text: 'Problem deleted successfully' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting problem:', error);
      setSaveMessage({ type: 'error', text: 'Failed to delete problem' });
    }
  };

  const handleToggleActive = async (problem: CommonProblemAdmin) => {
    if (!problem._id) return;
    try {
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/common-problems/${problem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !problem.isActive })
      });
      if (response.ok) {
        setProblems(prev => prev.map(p => p._id === problem._id ? { ...p, isActive: !p.isActive } : p));
        setSaveMessage({ type: 'success', text: `Problem ${!problem.isActive ? 'enabled' : 'disabled'} successfully` });
        setTimeout(() => setSaveMessage(null), 2000);
      } else {
        throw new Error('Failed to toggle status');
      }
    } catch (error) {
      console.error('Error toggling problem status:', error);
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

  const handleSaveProblem = async () => {
    if (!editingProblem) return;

    if (!editingProblem.title.trim() || !editingProblem.description.trim() || !editingProblem.accentColor || !editingProblem.accentLight) {
      triggerError('Title, description, accent color, and accent light are required.');
      return;
    }

    if (!editingProblem.image && !imageFile) {
      triggerError('An image is required.');
      return;
    }

    setFormError('');
    setIsSaving(true);

    try {
      let finalImageUrl = editingProblem.image;

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: formData
        });
        if (!uploadRes.ok) throw new Error('Failed to upload image file');
        const uploadData = await uploadRes.json();
        finalImageUrl = `${BACKEND_CONFIG.API_BASE_URL}${uploadData.url}`;
      }

      const problemToSave = {
        ...editingProblem,
        image: finalImageUrl
      };

      const method = problemToSave._id ? 'PUT' : 'POST';
      const url = problemToSave._id
        ? `${BACKEND_CONFIG.API_BASE_URL}/api/common-problems/${problemToSave._id}`
        : `${BACKEND_CONFIG.API_BASE_URL}/api/common-problems`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(problemToSave)
      });

      if (response.ok) {
        fetchProblems();
        setShowModal(false);
        setEditingProblem(null);
        setImageFile(null);
        setSaveMessage({ type: 'success', text: 'Problem saved successfully' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        let errMsg = 'Failed to save problem to database.';
        try {
          const clonedResponse = response.clone();
          const errorData = await clonedResponse.json();
          if (errorData?.message) errMsg = errorData.message;
        } catch (e) {}
        triggerError(errMsg);
      }
    } catch (error: any) {
      console.error('Error saving problem:', error);
      triggerError(error.message || 'Error processing request');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveProblem = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === problems.length - 1)
    ) return;

    const newProblems = [...problems];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newProblems[index], newProblems[swapIndex]] = [newProblems[swapIndex], newProblems[index]];
    setProblems(newProblems);

    try {
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/common-problems/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemIds: newProblems.map(p => p._id) })
      });
      if (response.ok) {
        setSaveMessage({ type: 'success', text: 'Order updated' });
        setTimeout(() => setSaveMessage(null), 2000);
      } else {
        throw new Error('Reordering failed');
      }
    } catch (error) {
      console.error('Error reordering problems:', error);
      fetchProblems();
    }
  };

  // Solutions management
  const addSolution = () => {
    if (!editingProblem || !solutionInput.trim()) return;
    setEditingProblem({
      ...editingProblem,
      solutions: [...editingProblem.solutions, solutionInput.trim()]
    });
    setSolutionInput('');
  };

  const removeSolution = (idx: number) => {
    if (!editingProblem) return;
    setEditingProblem({
      ...editingProblem,
      solutions: editingProblem.solutions.filter((_, i) => i !== idx)
    });
  };

  // Recommendations management
  const addRecommendation = () => {
    if (!editingProblem) return;
    setEditingProblem({
      ...editingProblem,
      recommendations: [...editingProblem.recommendations, { icon: 'Clock', text: '' }]
    });
  };

  const updateRecommendation = (idx: number, field: 'icon' | 'text', value: string) => {
    if (!editingProblem) return;
    const newRecs = [...editingProblem.recommendations];
    newRecs[idx] = { ...newRecs[idx], [field]: value };
    setEditingProblem({ ...editingProblem, recommendations: newRecs });
  };

  const removeRecommendation = (idx: number) => {
    if (!editingProblem) return;
    setEditingProblem({
      ...editingProblem,
      recommendations: editingProblem.recommendations.filter((_, i) => i !== idx)
    });
  };

  // Dropdowns management
  const addDropdown = () => {
    if (!editingProblem) return;
    setEditingProblem({
      ...editingProblem,
      dropdowns: [...editingProblem.dropdowns, { title: '', description: '' }]
    });
  };

  const updateDropdown = (idx: number, field: 'title' | 'description', value: string) => {
    if (!editingProblem) return;
    const newDropdowns = [...editingProblem.dropdowns];
    newDropdowns[idx] = { ...newDropdowns[idx], [field]: value };
    setEditingProblem({ ...editingProblem, dropdowns: newDropdowns });
  };

  const removeDropdown = (idx: number) => {
    if (!editingProblem) return;
    setEditingProblem({
      ...editingProblem,
      dropdowns: editingProblem.dropdowns.filter((_, i) => i !== idx)
    });
  };

  const applyColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    if (!editingProblem) return;
    setEditingProblem({
      ...editingProblem,
      accentColor: preset.accentColor,
      accentLight: preset.accentLight,
      color: preset.color,
      bgColor: preset.bgColor,
      borderColor: preset.borderColor,
      hoverBg: preset.hoverBg,
      activeBg: preset.activeBg,
      gradientFrom: preset.gradientFrom,
      gradientTo: preset.gradientTo,
      modalGradient: preset.modalGradient,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1a5d47] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1a5d47] font-semibold">Loading Common Problems...</p>
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
              Common Problems Manager
            </h1>
            <p className="text-gray-600 mt-2">
              {problems.length} problems • Manage wellness issues, solutions & recommendations
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddProblem}
            className="flex items-center gap-2 bg-[#1a5d47] hover:bg-[#113d2f] text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md"
          >
            <Plus className="w-5 h-5" /> Add Problem
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

        {problems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <HelpCircle className="w-16 h-16 text-[#1a5d47] mx-auto mb-4 opacity-40" />
            <p className="text-gray-600 text-lg mb-6">No common problems created yet</p>
            <button
              onClick={handleAddProblem}
              className="inline-flex items-center gap-2 bg-[#1a5d47] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#113d2f] transition-all shadow-md"
            >
              <Plus className="w-5 h-5" /> Create First Problem
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {problems.map((problem, idx) => (
              <motion.div
                key={problem._id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all border ${
                  problem.isActive ? 'border-transparent' : 'border-gray-200 opacity-75'
                }`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0 overflow-hidden bg-gray-200 relative">
                    <img
                      src={problem.image}
                      alt={problem.title}
                      className="w-full h-full object-cover"
                    />
                    {!problem.isActive && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="bg-red-500 text-white font-bold text-xs uppercase tracking-widest px-3 py-1 rounded shadow-sm">
                          Disabled
                        </span>
                      </div>
                    )}
                    {/* Accent color indicator */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ backgroundColor: problem.accentColor }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                          style={{ backgroundColor: problem.accentLight, color: problem.accentColor }}
                        >
                          {problem.icon}
                        </span>
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: problem.accentColor }}
                          title={`Accent: ${problem.accentColor}`}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-[#0F131A] mb-2">{problem.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{problem.description}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-4 text-xs font-medium text-gray-500 flex-wrap">
                      <span>{problem.solutions?.length || 0} solutions</span>
                      <span>•</span>
                      <span>{problem.recommendations?.length || 0} recommendations</span>
                      <span>•</span>
                      <span>{problem.dropdowns?.length || 0} dropdowns</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col justify-end md:justify-start gap-2 p-4 border-t md:border-t-0 md:border-l border-gray-100 bg-gray-50/50 flex-wrap">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleActive(problem)}
                      className={`p-2 rounded-lg transition-all border ${
                        problem.isActive
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200'
                          : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200'
                      }`}
                      title={problem.isActive ? 'Disable' : 'Enable'}
                    >
                      {problem.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditProblem(problem)}
                      className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMoveProblem(idx, 'up')}
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
                      onClick={() => handleMoveProblem(idx, 'down')}
                      disabled={idx === problems.length - 1}
                      className={`p-2 rounded-lg border transition-all ${
                        idx === problems.length - 1
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
                      onClick={() => problem._id && handleDeleteProblem(problem._id)}
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

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && editingProblem && (
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
              className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-8"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1a5d47] to-[#267f62] text-white p-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 animate-pulse" />
                  <h2 className="text-2xl font-bold">
                    {editingProblem._id ? 'Edit Problem' : 'Add Common Problem'}
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <div ref={modalScrollRef} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold">
                    {formError}
                  </div>
                )}

                {/* Image */}
                <div>
                  <h3 className="text-lg font-bold border-b pb-2 mb-4 text-[#1a5d47]">Problem Image</h3>
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
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>

                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-bold border-b pb-2 mb-4 text-[#1a5d47]">Problem Information</h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-[#0F131A] mb-2">Title *</label>
                        <input
                          type="text"
                          value={editingProblem.title}
                          onChange={(e) => setEditingProblem({ ...editingProblem, title: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                          placeholder="e.g., Burnout"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#0F131A] mb-2">Icon</label>
                        <select
                          value={editingProblem.icon}
                          onChange={(e) => setEditingProblem({ ...editingProblem, icon: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                        >
                          {AVAILABLE_ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#0F131A] mb-2">Description *</label>
                      <textarea
                        value={editingProblem.description}
                        onChange={(e) => setEditingProblem({ ...editingProblem, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                        placeholder="Describe this wellness problem..."
                      />
                    </div>
                  </div>
                </div>

                {/* Color Theme */}
                <div>
                  <div className="flex items-center gap-2 border-b pb-2 mb-4">
                    <Palette className="w-5 h-5 text-[#1a5d47]" />
                    <h3 className="text-lg font-bold text-[#1a5d47]">Color Theme</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">Select a preset or customize the accent colors:</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {COLOR_PRESETS.map(preset => (
                      <button
                        key={preset.name}
                        onClick={() => applyColorPreset(preset)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all hover:shadow-md ${
                          editingProblem.accentColor === preset.accentColor
                            ? 'border-[#1a5d47] bg-[#1a5d47]/5 ring-1 ring-[#1a5d47]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accentColor }} />
                        {preset.name}
                      </button>
                    ))}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#0F131A] mb-2">Accent Color *</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={editingProblem.accentColor}
                          onChange={(e) => setEditingProblem({ ...editingProblem, accentColor: e.target.value })}
                          className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={editingProblem.accentColor}
                          onChange={(e) => setEditingProblem({ ...editingProblem, accentColor: e.target.value })}
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#0F131A] mb-2">Accent Light *</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={editingProblem.accentLight}
                          onChange={(e) => setEditingProblem({ ...editingProblem, accentLight: e.target.value })}
                          className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={editingProblem.accentLight}
                          onChange={(e) => setEditingProblem({ ...editingProblem, accentLight: e.target.value })}
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Solutions */}
                <div>
                  <h3 className="text-lg font-bold border-b pb-2 mb-4 text-[#1a5d47]">Solutions (How We Help)</h3>
                  <div className="space-y-2 mb-3">
                    {editingProblem.solutions?.map((sol, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <span className="flex-1 text-sm font-medium text-gray-700">{sol}</span>
                        <button onClick={() => removeSolution(idx)} className="text-red-400 hover:text-red-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={solutionInput}
                      onChange={(e) => setSolutionInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addSolution()}
                      placeholder="Add a solution..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#1a5d47]"
                    />
                    <button onClick={addSolution} className="px-4 py-2 bg-[#1a5d47] text-white rounded-lg text-sm font-semibold hover:bg-[#113d2f]">
                      Add
                    </button>
                  </div>
                </div>

                {/* Recommendations (Quick Actions) */}
                <div>
                  <div className="flex items-center justify-between border-b pb-2 mb-4">
                    <h3 className="text-lg font-bold text-[#1a5d47]">Quick Actions (Recommendations)</h3>
                    <button onClick={addRecommendation} className="flex items-center gap-1 text-sm font-semibold text-[#1a5d47] hover:text-[#113d2f]">
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {editingProblem.recommendations?.map((rec, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                        <select
                          value={rec.icon}
                          onChange={(e) => updateRecommendation(idx, 'icon', e.target.value)}
                          className="w-36 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1a5d47]"
                        >
                          {RECOMMENDATION_ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                        </select>
                        <input
                          type="text"
                          value={rec.text}
                          onChange={(e) => updateRecommendation(idx, 'text', e.target.value)}
                          placeholder="Action text..."
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1a5d47]"
                        />
                        <button onClick={() => removeRecommendation(idx)} className="text-red-400 hover:text-red-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {editingProblem.recommendations?.length === 0 && (
                      <p className="text-sm text-gray-400 italic">No recommendations added yet.</p>
                    )}
                  </div>
                </div>

                {/* Dropdowns */}
                <div>
                  <div className="flex items-center justify-between border-b pb-2 mb-4">
                    <h3 className="text-lg font-bold text-[#1a5d47]">Mind Repeat Dropdowns</h3>
                    <button onClick={addDropdown} className="flex items-center gap-1 text-sm font-semibold text-[#1a5d47] hover:text-[#113d2f]">
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-[#0F131A] mb-2">Section Title</label>
                    <input
                      type="text"
                      value={editingProblem.dropdownSectionTitle}
                      onChange={(e) => setEditingProblem({ ...editingProblem, dropdownSectionTitle: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                    />
                  </div>
                  <div className="space-y-3">
                    {editingProblem.dropdowns?.map((dd, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3 space-y-2 relative">
                        <button onClick={() => removeDropdown(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">
                          <X className="w-4 h-4" />
                        </button>
                        <input
                          type="text"
                          value={dd.title}
                          onChange={(e) => updateDropdown(idx, 'title', e.target.value)}
                          placeholder="Dropdown title..."
                          className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1a5d47]"
                        />
                        <textarea
                          value={dd.description}
                          onChange={(e) => updateDropdown(idx, 'description', e.target.value)}
                          placeholder="Dropdown description..."
                          rows={2}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1a5d47]"
                        />
                      </div>
                    ))}
                    {editingProblem.dropdowns?.length === 0 && (
                      <p className="text-sm text-gray-400 italic">No dropdowns added yet.</p>
                    )}
                  </div>
                </div>

                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold">
                    {formError}
                  </div>
                )}

                {/* Footer */}
                <div className="flex gap-4 pt-6 border-t">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveProblem}
                    disabled={isSaving}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all text-white shadow ${
                      isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1a5d47] hover:bg-[#113d2f]'
                    }`}
                  >
                    <Save className="w-5 h-5" /> {isSaving ? 'Saving...' : 'Save Problem'}
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
