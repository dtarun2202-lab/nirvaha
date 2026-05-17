import React, { useState } from 'react';

interface SessionFormProps {
  onSubmit: (formData: any) => void;
}

const SessionForm: React.FC<SessionFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: '',
    platform: '',
    link: '',
    startDate: '',
    startTime: '',
    timeZone: '',
    duration: '',
    host: '',
    image: '',
    isPaid: false,
    price: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.summary.trim()) newErrors.summary = 'Summary is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.platform.trim()) newErrors.platform = 'Platform is required';
    if (!formData.link.trim()) newErrors.link = 'Joining link is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.timeZone.trim()) newErrors.timeZone = 'Time zone is required';
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
    if (!formData.host.trim()) newErrors.host = 'Host/facilitator is required';
    if (!formData.image.trim()) newErrors.image = 'Cover image URL is required';
    if (formData.isPaid && !formData.price.trim()) newErrors.price = 'Price is required for paid sessions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="title" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
            Session Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Live Breathwork Reset"
            className={`w-full px-5 py-3.5 border-2 rounded-[22px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
              errors.title ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
            }`}
            style={{ color: '#0f131a' }}
          />
          {errors.title && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="host" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
            Host / Facilitator *
          </label>
          <input
            type="text"
            id="host"
            name="host"
            value={formData.host}
            onChange={handleChange}
            placeholder="Name and role"
            className={`w-full px-5 py-3.5 border-2 rounded-[22px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
              errors.host ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
            }`}
            style={{ color: '#0f131a' }}
          />
          {errors.host && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.host}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="summary" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
          Short Summary *
        </label>
        <textarea
          id="summary"
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          rows={2}
          placeholder="A crisp two-line promise for the session"
          className={`w-full px-5 py-3.5 border-2 rounded-[22px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
            errors.summary ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
          }`}
          style={{ color: '#0f131a' }}
        />
        {errors.summary && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.summary}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
          Full Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="What participants will experience, format, what to prepare..."
          className={`w-full px-5 py-3.5 border-2 rounded-[22px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
            errors.description ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
          }`}
          style={{ color: '#0f131a' }}
        />
        {errors.description && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label htmlFor="platform" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
            Platform *
          </label>
          <input
            type="text"
            id="platform"
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            placeholder="Zoom, Google Meet, etc."
            className={`w-full px-5 py-3.5 border-2 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
              errors.platform ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
            }`}
            style={{ color: '#0f131a' }}
          />
          {errors.platform && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.platform}</p>}
        </div>

        <div>
          <label htmlFor="link" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
            Joining Link *
          </label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="Paste meeting URL"
            className={`w-full px-5 py-3.5 border-2 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
              errors.link ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
            }`}
            style={{ color: '#0f131a' }}
          />
          {errors.link && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.link}</p>}
        </div>

        <div>
          <label htmlFor="image" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
            Cover Image URL *
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Hero image URL"
            className={`w-full px-5 py-3.5 border-2 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
              errors.image ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
            }`}
            style={{ color: '#0f131a' }}
          />
          {errors.image && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.image}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div>
          <label htmlFor="startDate" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
            Date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`w-full px-5 py-3.5 border-2 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
              errors.startDate ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
            }`}
            style={{ color: '#0f131a' }}
          />
          {errors.startDate && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.startDate}</p>}
        </div>

        <div>
          <label htmlFor="startTime" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
            Start Time *
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className={`w-full px-5 py-3.5 border-2 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
              errors.startTime ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
            }`}
            style={{ color: '#0f131a' }}
          />
          {errors.startTime && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.startTime}</p>}
        </div>

        <div>
          <label htmlFor="timeZone" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
            Time Zone *
          </label>
          <input
            type="text"
            id="timeZone"
            name="timeZone"
            value={formData.timeZone}
            onChange={handleChange}
            placeholder="e.g., IST"
            className={`w-full px-5 py-3.5 border-2 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
              errors.timeZone ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
            }`}
            style={{ color: '#0f131a' }}
          />
          {errors.timeZone && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.timeZone}</p>}
        </div>

        <div>
          <label htmlFor="duration" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
            Duration *
          </label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g., 90m"
            className={`w-full px-5 py-3.5 border-2 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
              errors.duration ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
            }`}
            style={{ color: '#0f131a' }}
          />
          {errors.duration && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.duration}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4 p-5 rounded-[24px] border-2 border-[#D1FAE5] bg-[#F0F9F4]/50">
        <input
          type="checkbox"
          id="isPaid"
          name="isPaid"
          checked={formData.isPaid}
          onChange={handleChange}
          className="w-6 h-6 rounded-lg border-[#D1FAE5] text-[#1a5d47] focus:ring-[#1a5d47]"
        />
        <label htmlFor="isPaid" className="text-sm font-bold text-[#1a5d47] uppercase tracking-wider">
          This is a paid session
        </label>
      </div>

      {formData.isPaid && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <label htmlFor="price" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
            Price (INR ₹) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g., 499"
            className={`w-full px-5 py-3.5 border-2 rounded-[22px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
              errors.price ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
            }`}
            style={{ color: '#0f131a' }}
          />
          {errors.price && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.price}</p>}
        </div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-[#1a5d47] to-[#2d8a6a] text-white font-black uppercase tracking-[0.2em] rounded-[24px] shadow-xl shadow-emerald-900/10 hover:shadow-2xl hover:shadow-emerald-900/20 active:scale-[0.98] transition-all text-sm"
        >
          Publish Session
        </button>
      </div>
    </form>
  );
};

export default SessionForm;

