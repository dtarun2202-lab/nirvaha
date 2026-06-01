import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Save, X, Upload, ArrowUp, ArrowDown, Eye, EyeOff, Play, Film, Tv, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BACKEND_CONFIG from '@/config/backend';

interface Episode {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  description: string;
  videoUrl: string;
}

interface Season {
  seasonNumber: number;
  level: string;
  episodes: Episode[];
}

interface WellnessSessionAdmin {
  _id?: string;
  title: string;
  category: string;
  mood: string[];
  tags: string[];
  duration: string;
  thumbnail: string;
  banner: string;
  audioSource: string;
  description: string;
  match: string;
  year: string;
  rating: string;
  type: 'Series' | 'Film';
  seasons: Season[];
  isOriginal: boolean;
  displayOrder?: number;
  isActive: boolean;
}

const CATEGORIES = [
  'Meditation',
  'Sound Healing',
  'Breathwork',
  'Yoga',
  'Sleep',
  'Mindfulness',
  'Chakra',
  'Wellness'
];

const MOODS = ['Calm', 'Focus', 'Sleep', 'Energy', 'Healing', 'Relaxation', 'Peace', 'Joy'];

const DEFAULT_SESSION: WellnessSessionAdmin = {
  title: '',
  category: 'Meditation',
  mood: [],
  tags: [],
  duration: '',
  thumbnail: '',
  banner: '',
  audioSource: '',
  description: '',
  match: '95% Match',
  year: '2026',
  rating: 'TV-G',
  type: 'Series',
  seasons: [],
  isOriginal: false,
  isActive: true
};

const DEFAULT_EPISODE: Episode = {
  id: '',
  title: '',
  duration: '',
  thumbnail: '',
  description: '',
  videoUrl: ''
};

export function WellnessOTTManagementPage() {
  const [sessions, setSessions] = useState<WellnessSessionAdmin[]>([]);
  const [editingSession, setEditingSession] = useState<WellnessSessionAdmin | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewThumbnail, setPreviewThumbnail] = useState('');
  const [previewBanner, setPreviewBanner] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSeasons, setExpandedSeasons] = useState<Record<number, boolean>>({});
  const [moodInput, setMoodInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const modalScrollRef = useRef<HTMLDivElement>(null);

  const triggerError = (msg: string) => {
    setFormError(msg);
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/wellness-sessions/all`);
      if (!response.ok) {
        setSessions([]);
        return;
      }
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = () => {
    setEditingSession({ ...DEFAULT_SESSION });
    setPreviewThumbnail('');
    setPreviewBanner('');
    setThumbnailFile(null);
    setBannerFile(null);
    setFormError('');
    setExpandedSeasons({});
    setMoodInput('');
    setTagInput('');
    setShowModal(true);
  };

  const handleEditSession = (session: WellnessSessionAdmin) => {
    setEditingSession({ ...session });
    setPreviewThumbnail(session.thumbnail);
    setPreviewBanner(session.banner);
    setThumbnailFile(null);
    setBannerFile(null);
    setFormError('');
    setExpandedSeasons({});
    setMoodInput('');
    setTagInput('');
    setShowModal(true);
  };

  const handleDeleteSession = async (id?: string) => {
    if (!id || !confirm('Are you sure you want to permanently delete this session?')) return;
    try {
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/wellness-sessions/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchSessions();
        setSaveMessage({ type: 'success', text: 'Session deleted successfully' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      setSaveMessage({ type: 'error', text: 'Failed to delete session' });
    }
  };

  const handleToggleActive = async (session: WellnessSessionAdmin) => {
    if (!session._id) return;
    try {
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/wellness-sessions/${session._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !session.isActive })
      });
      if (response.ok) {
        setSessions(prev => prev.map(s => s._id === session._id ? { ...s, isActive: !s.isActive } : s));
        setSaveMessage({ type: 'success', text: `Session ${!session.isActive ? 'enabled' : 'disabled'} successfully` });
        setTimeout(() => setSaveMessage(null), 2000);
      } else {
        throw new Error('Failed to toggle status');
      }
    } catch (error) {
      console.error('Error toggling session status:', error);
      setSaveMessage({ type: 'error', text: 'Failed to update status' });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'thumbnail') {
          setThumbnailFile(file);
          setPreviewThumbnail(reader.result as string);
        } else {
          setBannerFile(file);
          setPreviewBanner(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const uploadRes = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData
    });
    if (!uploadRes.ok) throw new Error('Failed to upload file');
    const uploadData = await uploadRes.json();
    return `${BACKEND_CONFIG.API_BASE_URL}${uploadData.url}`;
  };

  const handleSaveSession = async () => {
    if (!editingSession) return;

    if (!editingSession.title.trim() || !editingSession.description.trim() || !editingSession.duration.trim() || !editingSession.category.trim()) {
      triggerError('Title, description, duration, and category are required.');
      return;
    }

    if (!editingSession.thumbnail && !thumbnailFile) {
      triggerError('A thumbnail image is required.');
      return;
    }

    if (!editingSession.banner && !bannerFile) {
      triggerError('A banner image is required.');
      return;
    }

    setFormError('');
    setIsSaving(true);

    try {
      let finalThumbnail = editingSession.thumbnail;
      let finalBanner = editingSession.banner;

      if (thumbnailFile) {
        finalThumbnail = await uploadFile(thumbnailFile);
      }
      if (bannerFile) {
        finalBanner = await uploadFile(bannerFile);
      }

      const sessionToSave = {
        ...editingSession,
        thumbnail: finalThumbnail,
        banner: finalBanner
      };

      const method = sessionToSave._id ? 'PUT' : 'POST';
      const url = sessionToSave._id
        ? `${BACKEND_CONFIG.API_BASE_URL}/api/wellness-sessions/${sessionToSave._id}`
        : `${BACKEND_CONFIG.API_BASE_URL}/api/wellness-sessions`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionToSave)
      });

      if (response.ok) {
        fetchSessions();
        setShowModal(false);
        setEditingSession(null);
        setThumbnailFile(null);
        setBannerFile(null);
        setSaveMessage({ type: 'success', text: 'Session saved successfully' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        let errMsg = 'Failed to save session to database.';
        try {
          const clonedResponse = response.clone();
          const errorData = await clonedResponse.json();
          if (errorData?.message) errMsg = errorData.message;
        } catch (e) {}
        triggerError(errMsg);
      }
    } catch (error: any) {
      console.error('Error saving session:', error);
      triggerError(error.message || 'Error processing request');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveSession = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sessions.length - 1)
    ) return;

    const newSessions = [...sessions];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newSessions[index], newSessions[swapIndex]] = [newSessions[swapIndex], newSessions[index]];
    setSessions(newSessions);

    try {
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/wellness-sessions/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionIds: newSessions.map(s => s._id) })
      });
      if (response.ok) {
        setSaveMessage({ type: 'success', text: 'Order updated' });
        setTimeout(() => setSaveMessage(null), 2000);
      } else {
        throw new Error('Reordering failed');
      }
    } catch (error) {
      console.error('Error reordering sessions:', error);
      fetchSessions();
    }
  };

  // Season and episode management
  const addSeason = () => {
    if (!editingSession) return;
    const nextNum = (editingSession.seasons?.length || 0) + 1;
    setEditingSession({
      ...editingSession,
      seasons: [...(editingSession.seasons || []), { seasonNumber: nextNum, level: 'Beginner', episodes: [] }]
    });
    setExpandedSeasons({ ...expandedSeasons, [nextNum - 1]: true });
  };

  const removeSeason = (seasonIdx: number) => {
    if (!editingSession) return;
    const newSeasons = editingSession.seasons.filter((_, i) => i !== seasonIdx);
    setEditingSession({ ...editingSession, seasons: newSeasons });
  };

  const updateSeason = (seasonIdx: number, field: string, value: any) => {
    if (!editingSession) return;
    const newSeasons = [...editingSession.seasons];
    newSeasons[seasonIdx] = { ...newSeasons[seasonIdx], [field]: value };
    setEditingSession({ ...editingSession, seasons: newSeasons });
  };

  const addEpisode = (seasonIdx: number) => {
    if (!editingSession) return;
    const newSeasons = [...editingSession.seasons];
    const epCount = newSeasons[seasonIdx].episodes.length;
    newSeasons[seasonIdx].episodes.push({
      ...DEFAULT_EPISODE,
      id: `s${newSeasons[seasonIdx].seasonNumber}-ep${epCount + 1}`
    });
    setEditingSession({ ...editingSession, seasons: newSeasons });
  };

  const removeEpisode = (seasonIdx: number, epIdx: number) => {
    if (!editingSession) return;
    const newSeasons = [...editingSession.seasons];
    newSeasons[seasonIdx].episodes = newSeasons[seasonIdx].episodes.filter((_, i) => i !== epIdx);
    setEditingSession({ ...editingSession, seasons: newSeasons });
  };

  const updateEpisode = (seasonIdx: number, epIdx: number, field: string, value: string) => {
    if (!editingSession) return;
    const newSeasons = [...editingSession.seasons];
    newSeasons[seasonIdx].episodes[epIdx] = { ...newSeasons[seasonIdx].episodes[epIdx], [field]: value };
    setEditingSession({ ...editingSession, seasons: newSeasons });
  };

  const addMood = () => {
    if (!editingSession || !moodInput.trim()) return;
    if (!editingSession.mood.includes(moodInput.trim())) {
      setEditingSession({ ...editingSession, mood: [...editingSession.mood, moodInput.trim()] });
    }
    setMoodInput('');
  };

  const removeMood = (mood: string) => {
    if (!editingSession) return;
    setEditingSession({ ...editingSession, mood: editingSession.mood.filter(m => m !== mood) });
  };

  const addTag = () => {
    if (!editingSession || !tagInput.trim()) return;
    if (!editingSession.tags.includes(tagInput.trim())) {
      setEditingSession({ ...editingSession, tags: [...editingSession.tags, tagInput.trim()] });
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    if (!editingSession) return;
    setEditingSession({ ...editingSession, tags: editingSession.tags.filter(t => t !== tag) });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1a5d47] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1a5d47] font-semibold">Loading Wellness OTT Sessions...</p>
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
              Wellness OTT Manager
            </h1>
            <p className="text-gray-600 mt-2">
              {sessions.length} sessions • Manage series, films, episodes & content
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddSession}
            className="flex items-center gap-2 bg-[#1a5d47] hover:bg-[#113d2f] text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md"
          >
            <Plus className="w-5 h-5" /> Add Session
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

        {sessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <Play className="w-16 h-16 text-[#1a5d47] mx-auto mb-4 opacity-40" />
            <p className="text-gray-600 text-lg mb-6">No OTT sessions created yet</p>
            <button
              onClick={handleAddSession}
              className="inline-flex items-center gap-2 bg-[#1a5d47] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#113d2f] transition-all shadow-md"
            >
              <Plus className="w-5 h-5" /> Create First Session
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, idx) => (
              <motion.div
                key={session._id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all border ${
                  session.isActive ? 'border-transparent' : 'border-gray-200 opacity-75'
                }`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Thumbnail */}
                  <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0 overflow-hidden bg-gray-200 relative">
                    <img
                      src={session.thumbnail}
                      alt={session.title}
                      className="w-full h-full object-cover"
                    />
                    {!session.isActive && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="bg-red-500 text-white font-bold text-xs uppercase tracking-widest px-3 py-1 rounded shadow-sm">
                          Disabled
                        </span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      {session.type === 'Series' ? (
                        <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Tv className="w-3 h-3" /> SERIES
                        </span>
                      ) : (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Film className="w-3 h-3" /> FILM
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-xs font-bold text-[#1a5d47] bg-[#1a5d47]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {session.category}
                        </span>
                        {session.isOriginal && (
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                            ORIGINAL
                          </span>
                        )}
                        <span className="text-xs text-gray-400">{session.duration} • {session.year} • {session.rating}</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#0F131A] mb-2">{session.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{session.description}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-4 text-xs font-medium text-gray-500 flex-wrap">
                      {session.type === 'Series' && (
                        <span>{session.seasons?.length || 0} seasons • {session.seasons?.reduce((acc, s) => acc + (s.episodes?.length || 0), 0) || 0} episodes</span>
                      )}
                      {session.mood?.length > 0 && (
                        <span className="text-gray-400">Moods: {session.mood.join(', ')}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col justify-end md:justify-start gap-2 p-4 border-t md:border-t-0 md:border-l border-gray-100 bg-gray-50/50 flex-wrap">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleActive(session)}
                      className={`p-2 rounded-lg transition-all border ${
                        session.isActive
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200'
                          : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200'
                      }`}
                      title={session.isActive ? 'Disable' : 'Enable'}
                    >
                      {session.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditSession(session)}
                      className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMoveSession(idx, 'up')}
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
                      onClick={() => handleMoveSession(idx, 'down')}
                      disabled={idx === sessions.length - 1}
                      className={`p-2 rounded-lg border transition-all ${
                        idx === sessions.length - 1
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
                      onClick={() => session._id && handleDeleteSession(session._id)}
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
        {showModal && editingSession && (
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
                  <Play className="w-6 h-6 animate-pulse" />
                  <h2 className="text-2xl font-bold">
                    {editingSession._id ? 'Edit Session' : 'Add OTT Session'}
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

                {/* Images */}
                <div>
                  <h3 className="text-lg font-bold border-b pb-2 mb-4 text-[#1a5d47]">Media</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Thumbnail */}
                    <div>
                      <label className="block text-sm font-bold text-[#0F131A] mb-2">Thumbnail *</label>
                      <label className="flex items-center justify-center w-full h-36 border-2 border-dashed border-[#1a5d47] rounded-xl cursor-pointer hover:bg-[#1a5d47]/5 transition-all overflow-hidden relative group">
                        {previewThumbnail ? (
                          <>
                            <img src={previewThumbnail} alt="Thumbnail" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Upload className="w-6 h-6 text-white mb-1" />
                              <span className="text-sm text-white font-medium">Change</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <Upload className="w-8 h-8 text-[#1a5d47] mb-1" />
                            <span className="text-sm text-gray-600 font-medium">Thumbnail</span>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'thumbnail')} className="hidden" />
                      </label>
                    </div>
                    {/* Banner */}
                    <div>
                      <label className="block text-sm font-bold text-[#0F131A] mb-2">Banner *</label>
                      <label className="flex items-center justify-center w-full h-36 border-2 border-dashed border-[#1a5d47] rounded-xl cursor-pointer hover:bg-[#1a5d47]/5 transition-all overflow-hidden relative group">
                        {previewBanner ? (
                          <>
                            <img src={previewBanner} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Upload className="w-6 h-6 text-white mb-1" />
                              <span className="text-sm text-white font-medium">Change</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <Upload className="w-8 h-8 text-[#1a5d47] mb-1" />
                            <span className="text-sm text-gray-600 font-medium">Banner</span>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-bold border-b pb-2 mb-4 text-[#1a5d47]">Session Information</h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-[#0F131A] mb-2">Title *</label>
                        <input
                          type="text"
                          value={editingSession.title}
                          onChange={(e) => setEditingSession({ ...editingSession, title: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                          placeholder="e.g., The Art of Deep Meditation"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#0F131A] mb-2">Category *</label>
                        <select
                          value={editingSession.category}
                          onChange={(e) => setEditingSession({ ...editingSession, category: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                        >
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#0F131A] mb-2">Description *</label>
                      <textarea
                        value={editingSession.description}
                        onChange={(e) => setEditingSession({ ...editingSession, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                        placeholder="Describe this wellness session..."
                      />
                    </div>

                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-[#0F131A] mb-2">Duration *</label>
                        <input
                          type="text"
                          value={editingSession.duration}
                          onChange={(e) => setEditingSession({ ...editingSession, duration: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                          placeholder="e.g., 3 Seasons"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#0F131A] mb-2">Type *</label>
                        <select
                          value={editingSession.type}
                          onChange={(e) => setEditingSession({ ...editingSession, type: e.target.value as 'Series' | 'Film' })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                        >
                          <option value="Series">Series</option>
                          <option value="Film">Film</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#0F131A] mb-2">Year</label>
                        <input
                          type="text"
                          value={editingSession.year}
                          onChange={(e) => setEditingSession({ ...editingSession, year: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#0F131A] mb-2">Rating</label>
                        <input
                          type="text"
                          value={editingSession.rating}
                          onChange={(e) => setEditingSession({ ...editingSession, rating: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-[#0F131A] mb-2">Match</label>
                        <input
                          type="text"
                          value={editingSession.match}
                          onChange={(e) => setEditingSession({ ...editingSession, match: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#0F131A] mb-2">Audio Source URL</label>
                        <input
                          type="text"
                          value={editingSession.audioSource}
                          onChange={(e) => setEditingSession({ ...editingSession, audioSource: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47]"
                          placeholder="URL for the audio file"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingSession.isOriginal}
                          onChange={(e) => setEditingSession({ ...editingSession, isOriginal: e.target.checked })}
                          className="w-4 h-4 text-[#1a5d47] border-gray-300 rounded focus:ring-[#1a5d47]"
                        />
                        <span className="text-sm font-semibold text-gray-700">Nirvaha Original</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Moods */}
                <div>
                  <h3 className="text-lg font-bold border-b pb-2 mb-4 text-[#1a5d47]">Moods & Tags</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-[#0F131A] mb-2">Moods</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editingSession.mood?.map(m => (
                          <span key={m} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            {m}
                            <button onClick={() => removeMood(m)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={moodInput}
                          onChange={(e) => setMoodInput(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47] text-sm"
                        >
                          <option value="">Select mood...</option>
                          {MOODS.filter(m => !editingSession.mood?.includes(m)).map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <button onClick={addMood} className="px-4 py-2 bg-[#1a5d47] text-white rounded-lg text-sm font-semibold hover:bg-[#113d2f]">
                          Add
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#0F131A] mb-2">Tags</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editingSession.tags?.map(t => (
                          <span key={t} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            {t}
                            <button onClick={() => removeTag(t)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addTag()}
                          placeholder="Add a tag..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a5d47] text-sm"
                        />
                        <button onClick={addTag} className="px-4 py-2 bg-[#1a5d47] text-white rounded-lg text-sm font-semibold hover:bg-[#113d2f]">
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seasons & Episodes - only for Series */}
                {editingSession.type === 'Series' && (
                  <div>
                    <div className="flex items-center justify-between border-b pb-2 mb-4">
                      <h3 className="text-lg font-bold text-[#1a5d47]">Seasons & Episodes</h3>
                      <button onClick={addSeason} className="flex items-center gap-1 text-sm font-semibold text-[#1a5d47] hover:text-[#113d2f]">
                        <Plus className="w-4 h-4" /> Add Season
                      </button>
                    </div>

                    {editingSession.seasons?.length === 0 && (
                      <p className="text-sm text-gray-400 italic">No seasons added yet. Click "Add Season" to create one.</p>
                    )}

                    <div className="space-y-4">
                      {editingSession.seasons?.map((season, sIdx) => (
                        <div key={sIdx} className="border border-gray-200 rounded-xl overflow-hidden">
                          <div
                            className="flex items-center justify-between bg-gray-50 px-4 py-3 cursor-pointer"
                            onClick={() => setExpandedSeasons({ ...expandedSeasons, [sIdx]: !expandedSeasons[sIdx] })}
                          >
                            <div className="flex items-center gap-2">
                              {expandedSeasons[sIdx] ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                              <span className="font-bold text-sm">Season {season.seasonNumber}</span>
                              <span className="text-xs text-gray-400">({season.episodes?.length || 0} episodes) • {season.level}</span>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); removeSeason(sIdx); }} className="text-red-400 hover:text-red-600" title="Remove season">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {expandedSeasons[sIdx] && (
                            <div className="p-4 space-y-4">
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-gray-500 mb-1">Season Number</label>
                                  <input
                                    type="number"
                                    value={season.seasonNumber}
                                    onChange={(e) => updateSeason(sIdx, 'seasonNumber', parseInt(e.target.value) || 1)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#1a5d47]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-gray-500 mb-1">Level</label>
                                  <select
                                    value={season.level}
                                    onChange={(e) => updateSeason(sIdx, 'level', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#1a5d47]"
                                  >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                  </select>
                                </div>
                              </div>

                              {/* Episodes list */}
                              <div className="space-y-3">
                                {season.episodes?.map((ep, epIdx) => (
                                  <div key={epIdx} className="bg-gray-50 rounded-lg p-3 space-y-2 relative">
                                    <button
                                      onClick={() => removeEpisode(sIdx, epIdx)}
                                      className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                                      title="Remove episode"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                    <div className="grid md:grid-cols-3 gap-2">
                                      <input
                                        type="text"
                                        value={ep.title}
                                        onChange={(e) => updateEpisode(sIdx, epIdx, 'title', e.target.value)}
                                        placeholder="Episode Title"
                                        className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1a5d47]"
                                      />
                                      <input
                                        type="text"
                                        value={ep.duration}
                                        onChange={(e) => updateEpisode(sIdx, epIdx, 'duration', e.target.value)}
                                        placeholder="Duration (e.g., 12:30)"
                                        className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1a5d47]"
                                      />
                                      <input
                                        type="text"
                                        value={ep.id}
                                        onChange={(e) => updateEpisode(sIdx, epIdx, 'id', e.target.value)}
                                        placeholder="Episode ID"
                                        className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1a5d47]"
                                      />
                                    </div>
                                    <input
                                      type="text"
                                      value={ep.description}
                                      onChange={(e) => updateEpisode(sIdx, epIdx, 'description', e.target.value)}
                                      placeholder="Episode Description"
                                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1a5d47]"
                                    />
                                    <div className="grid md:grid-cols-2 gap-2">
                                      <input
                                        type="text"
                                        value={ep.thumbnail}
                                        onChange={(e) => updateEpisode(sIdx, epIdx, 'thumbnail', e.target.value)}
                                        placeholder="Thumbnail URL"
                                        className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1a5d47]"
                                      />
                                      <input
                                        type="text"
                                        value={ep.videoUrl}
                                        onChange={(e) => updateEpisode(sIdx, epIdx, 'videoUrl', e.target.value)}
                                        placeholder="Video/Audio URL"
                                        className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1a5d47]"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <button
                                onClick={() => addEpisode(sIdx)}
                                className="flex items-center gap-1 text-sm font-semibold text-[#1a5d47] hover:text-[#113d2f] mt-2"
                              >
                                <Plus className="w-4 h-4" /> Add Episode
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                    onClick={handleSaveSession}
                    disabled={isSaving}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all text-white shadow ${
                      isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1a5d47] hover:bg-[#113d2f]'
                    }`}
                  >
                    <Save className="w-5 h-5" /> {isSaving ? 'Saving...' : 'Save Session'}
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
