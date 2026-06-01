import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  RefreshCw, 
  Layout, 
  Shield, 
  Settings, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Trash2,
  Image as ImageIcon,
  Type,
  ToggleLeft
} from 'lucide-react';
import BACKEND_CONFIG from '../../config/backend';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const SECTIONS: Section[] = [
  { id: 'hero', label: 'Hero Section', icon: <ImageIcon size={18} /> },
  { id: 'academy', label: 'Nirvaha Academy', icon: <CheckCircle2 size={18} /> },
  { id: 'stats', label: 'Trusted Stats', icon: <Plus size={18} /> },
  { id: 'wisdom', label: 'Ancient Wisdom', icon: <Type size={18} /> },
  { id: 'settings', label: 'Access Controls', icon: <Shield size={18} /> }
];

export function LandingManagementPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>(null);
  const [editingCourse, setEditingCourse] = useState<{ idx: number; data: any } | null>(null);

  useEffect(() => {
    fetchLandingData();
  }, []);

  const fetchLandingData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/landing`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch landing data:', error);
      toast.error('Failed to load landing page content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/admin/landing`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        toast.success('Landing page updated successfully!');
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const updateNestedField = (path: string, value: any) => {
    const newData = { ...data };
    const keys = path.split('.');
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setData(newData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Layout className="text-emerald-500" /> Landing Page CMS
          </h1>
          <p className="text-white/40 mt-1">Manage all public-facing content and access controls dynamically.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchLandingData}
            className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors"
          >
            <RefreshCw size={20} />
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
            Save All Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar Tabs */}
        <aside className="space-y-2">
          {SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${
                activeTab === section.id 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                : 'text-white/40 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              {section.icon}
              <span className="font-medium text-sm">{section.label}</span>
            </button>
          ))}
        </aside>

        {/* Content Editor */}
        <main className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12 min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              {/* Render editors based on tab */}
              {activeTab === 'hero' && (
                <div className="space-y-8">
                  <h3 className="text-xl font-bold text-white border-l-4 border-emerald-500 pl-4">Hero Section Content</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Headline</label>
                      <input 
                        type="text" 
                        value={data.hero?.title}
                        onChange={(e) => updateNestedField('hero.title', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500/50 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Button Label</label>
                      <input 
                        type="text" 
                        value={data.hero?.buttonText}
                        onChange={(e) => updateNestedField('hero.buttonText', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500/50 outline-none"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Sub-headline</label>
                      <textarea 
                        value={data.hero?.subtitle}
                        onChange={(e) => updateNestedField('hero.subtitle', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500/50 outline-none min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'academy' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white border-l-4 border-emerald-500 pl-4">Academy Section</h3>
                    <div className="flex items-center gap-3 p-2 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-xs text-white/40 font-bold px-2">LOGIN REQUIRED?</span>
                      <button 
                        onClick={() => updateNestedField('academy.isLoginRequired', !data.academy.isLoginRequired)}
                        className={`p-1 w-12 h-6 rounded-full transition-colors flex items-center ${data.academy.isLoginRequired ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${data.academy.isLoginRequired ? 'translate-x-7' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Title</label>
                      <input 
                        type="text" 
                        value={data.academy?.title}
                        onChange={(e) => updateNestedField('academy.title', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500/50 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Explore Button Text</label>
                      <input 
                        type="text" 
                        value={data.academy?.exploreButtonText}
                        onChange={(e) => updateNestedField('academy.exploreButtonText', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500/50 outline-none"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Subtitle</label>
                      <textarea 
                        value={data.academy?.subtitle}
                        onChange={(e) => updateNestedField('academy.subtitle', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500/50 outline-none h-20"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Academy Cards ( Teasers )</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.academy?.courses?.map((course: any, idx: number) => (
                        <div key={idx} className="p-4 bg-black/20 border border-white/5 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={course.image} className="w-10 h-10 rounded-lg object-cover" />
                            <div>
                                <span className="text-sm font-medium block">{course.title}</span>
                                <span className="text-[10px] text-white/40 uppercase font-black">Instructor: {course.instructor?.name || 'Not Set'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setEditingCourse({ idx, data: { ...course } })}
                                className="p-2 text-emerald-400/60 hover:text-emerald-400"
                            >
                                <Settings size={16} />
                            </button>
                            <button 
                                onClick={() => {
                                const newCourses = data.academy.courses.filter((_: any, i: number) => i !== idx);
                                updateNestedField('academy.courses', newCourses);
                                }}
                                className="p-2 text-red-400/60 hover:text-red-400"
                            >
                                <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                            const newCourse = {
                                id: `course-${Date.now()}`,
                                title: 'New Course',
                                description: '',
                                feel: '',
                                image: '',
                                bgColor: 'bg-emerald-50',
                                instructor: { name: '', title: '', avatar: '', bio: '', experience: '', certifications: '', coursesHandled: '', expertise: '', socialLinks: '', website: '', rating: 4.8, reviewsCount: 0 }
                            };
                            updateNestedField('academy.courses', [...(data.academy.courses || []), newCourse]);
                        }}
                        className="p-4 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white/30 hover:text-white transition-colors"
                      >
                        <Plus size={18} /> Add Teaser Card
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-12">
                  <h3 className="text-xl font-bold text-white border-l-4 border-emerald-500 pl-4">Global Site Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Take the site offline for updates.' },
                      { key: 'showCollaborators', label: 'Show Collaborators', desc: 'Toggle the collaborators section.' },
                      { key: 'showContactForm', label: 'Show Contact Form', desc: 'Toggle the contact us section.' }
                    ].map(setting => (
                      <div key={setting.key} className="p-6 bg-black/20 border border-white/5 rounded-3xl flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-bold text-white">{setting.label}</p>
                          <p className="text-xs text-white/30">{setting.desc}</p>
                        </div>
                        <button 
                          onClick={() => updateNestedField(`settings.${setting.key}`, !data.settings[setting.key])}
                          className={`p-1 w-12 h-6 rounded-full transition-colors flex items-center ${data.settings[setting.key] ? 'bg-emerald-500' : 'bg-white/10'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${data.settings[setting.key] ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Placeholder for other sections */}
              {['stats', 'wisdom'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <Settings className="text-white/10" size={64} />
                  <p className="text-white/40 max-w-xs">The editor for this section is being populated with your current component schemas.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Course Editor Modal */}
      <AnimatePresence>
        {editingCourse && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto"
            >
                <motion.div 
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-[#111] border border-white/10 rounded-[2.5rem] w-full max-w-4xl p-10 relative my-auto"
                >
                    <button 
                        onClick={() => setEditingCourse(null)}
                        className="absolute top-8 right-8 text-white/20 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Edit Academy Pathway</h2>
                            <p className="text-white/40 text-sm">Configure course details and instructor information.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Course Details */}
                        <div className="space-y-8">
                            <h3 className="text-sm font-black text-emerald-500 uppercase tracking-widest">COURSE INFO</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase">Course Title</label>
                                    <input 
                                        type="text" 
                                        value={editingCourse.data.title}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, data: { ...editingCourse.data, title: e.target.value } })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase">Pathway Feel (e.g. Calm & Focused)</label>
                                    <input 
                                        type="text" 
                                        value={editingCourse.data.feel}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, data: { ...editingCourse.data, feel: e.target.value } })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase">Image URL</label>
                                    <input 
                                        type="text" 
                                        value={editingCourse.data.image}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, data: { ...editingCourse.data, image: e.target.value } })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase">Background Color Class (Tailwind)</label>
                                    <input 
                                        type="text" 
                                        value={editingCourse.data.bgColor}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, data: { ...editingCourse.data, bgColor: e.target.value } })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Instructor Details */}
                        <div className="space-y-8">
                            <h3 className="text-sm font-black text-emerald-500 uppercase tracking-widest">INSTRUCTOR PROFILE</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase">Name</label>
                                    <input 
                                        type="text" 
                                        value={editingCourse.data.instructor?.name}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, data: { ...editingCourse.data, instructor: { ...editingCourse.data.instructor, name: e.target.value } } })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase">Title</label>
                                    <input 
                                        type="text" 
                                        value={editingCourse.data.instructor?.title}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, data: { ...editingCourse.data, instructor: { ...editingCourse.data.instructor, title: e.target.value } } })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase">Experience</label>
                                    <input 
                                        type="text" 
                                        value={editingCourse.data.instructor?.experience}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, data: { ...editingCourse.data, instructor: { ...editingCourse.data.instructor, experience: e.target.value } } })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase">Certifications</label>
                                    <input 
                                        type="text" 
                                        value={editingCourse.data.instructor?.certifications}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, data: { ...editingCourse.data, instructor: { ...editingCourse.data.instructor, certifications: e.target.value } } })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-xs font-bold text-white/40 uppercase">Courses Handled</label>
                                    <input 
                                        type="text" 
                                        value={editingCourse.data.instructor?.coursesHandled}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, data: { ...editingCourse.data, instructor: { ...editingCourse.data.instructor, coursesHandled: e.target.value } } })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-xs font-bold text-white/40 uppercase">Specialties</label>
                                    <input 
                                        type="text" 
                                        value={editingCourse.data.instructor?.expertise}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, data: { ...editingCourse.data, instructor: { ...editingCourse.data.instructor, expertise: e.target.value } } })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase">Social Link</label>
                                    <input 
                                        type="text" 
                                        value={editingCourse.data.instructor?.socialLinks}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, data: { ...editingCourse.data, instructor: { ...editingCourse.data.instructor, socialLinks: e.target.value } } })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase">Website URL</label>
                                    <input 
                                        type="text" 
                                        value={editingCourse.data.instructor?.website}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, data: { ...editingCourse.data, instructor: { ...editingCourse.data.instructor, website: e.target.value } } })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5 flex justify-end gap-4">
                        <button 
                            onClick={() => setEditingCourse(null)}
                            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => {
                                if (!editingCourse) return;
                                const newCourses = [...data.academy.courses];
                                newCourses[editingCourse.idx] = editingCourse.data;
                                updateNestedField('academy.courses', newCourses);
                                setEditingCourse(null);
                                toast.success('Course updated in staging. Remember to Save All Changes.');
                            }}
                            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-xl transition-all"
                        >
                            Confirm Updates
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
