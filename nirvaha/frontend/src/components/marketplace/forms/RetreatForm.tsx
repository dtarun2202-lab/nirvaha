import React, { useState } from 'react';
import { motion } from 'motion/react';

interface RetreatFormProps {
  onSubmit: (formData: any) => void;
}

const RetreatForm: React.FC<RetreatFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    facilitator: '',
    location: '',
    startDate: '',
    endDate: '',
    accommodation: '',
    capacity: '',
    isPaid: false,
    price: '',
    pricingTier: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.facilitator.trim()) newErrors.facilitator = 'Facilitator/Guest details required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.accommodation.trim()) newErrors.accommodation = 'Accommodation details required';
    if (!formData.capacity.trim()) newErrors.capacity = 'Capacity is required';
    if (formData.isPaid && !formData.price.trim()) newErrors.price = 'Price is required for paid retreats';
    
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
      {/* Event Title */}
      <div>
        <label htmlFor="title" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
          Event Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Himalayan Meditation Retreat"
          className={`w-full px-5 py-3.5 border-2 rounded-[22px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
            errors.title ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
          }`}
          style={{ color: "#0f131a" }}
        />
        {errors.title && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
          Event Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the retreat experience and highlights..."
          rows={3}
          className={`w-full px-5 py-3.5 border-2 rounded-[22px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
            errors.description ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
          }`}
          style={{ color: "#0f131a" }}
        />
        {errors.description && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.description}</p>}
      </div>

      {/* Facilitator */}
      <div>
        <label htmlFor="facilitator" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
          Guest / Facilitator Details *
        </label>
        <textarea
          id="facilitator"
          name="facilitator"
          value={formData.facilitator}
          onChange={handleChange}
          placeholder="Name, bio, and background of the facilitator..."
          rows={2}
          className={`w-full px-5 py-3.5 border-2 rounded-[22px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
            errors.facilitator ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
          }`}
          style={{ color: "#0f131a" }}
        />
        {errors.facilitator && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.facilitator}</p>}
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
          Location *
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., Rishikesh, India"
          className={`w-full px-5 py-3.5 border-2 rounded-[22px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
            errors.location ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
          }`}
          style={{ color: "#0f131a" }}
        />
        {errors.location && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.location}</p>}
      </div>

      {/* Start and End Date */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label htmlFor="startDate" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
            Start Date *
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
            style={{ color: "#0f131a" }}
          />
          {errors.startDate && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.startDate}</p>}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
            End Date *
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`w-full px-5 py-3.5 border-2 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
              errors.endDate ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
            }`}
            style={{ color: "#0f131a" }}
          />
          {errors.endDate && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.endDate}</p>}
        </div>
      </div>

      {/* Accommodation */}
      <div>
        <label htmlFor="accommodation" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
          Accommodation Details *
        </label>
        <input
          type="text"
          id="accommodation"
          name="accommodation"
          value={formData.accommodation}
          onChange={handleChange}
          placeholder="e.g., Shared Ashram, Eco-resort, Villa Stay"
          className={`w-full px-5 py-3.5 border-2 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
            errors.accommodation ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
          }`}
          style={{ color: "#0f131a" }}
        />
        {errors.accommodation && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.accommodation}</p>}
      </div>

      {/* Capacity */}
      <div>
        <label htmlFor="capacity" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
          Capacity *
        </label>
        <input
          type="text"
          id="capacity"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          placeholder="e.g., 50 participants"
          className={`w-full px-5 py-3.5 border-2 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
            errors.capacity ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
          }`}
          style={{ color: "#0f131a" }}
        />
        {errors.capacity && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.capacity}</p>}
      </div>

      {/* Paid / Free Toggle */}
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
          Paid Retreat
        </label>
      </div>

      {/* Price (conditional) */}
      {formData.isPaid && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            <label htmlFor="price" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
              Price (INR ₹) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., 1299"
              step="0.01"
              className={`w-full px-5 py-3.5 border-2 rounded-[22px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
                errors.price ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
              }`}
              style={{ color: "#0f131a" }}
            />
            {errors.price && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.price}</p>}
          </div>

          <div>
            <label htmlFor="pricingTier" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
              Pricing Tiers (optional)
            </label>
            <textarea
              id="pricingTier"
              name="pricingTier"
              value={formData.pricingTier}
              onChange={handleChange}
              placeholder="e.g., Standard: ₹1299, Deluxe: ₹1799"
              rows={2}
              className="w-full px-5 py-3.5 border-2 border-[#D1FAE5] bg-[#F0F9F4] rounded-[22px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-[#1a5d47] transition-all"
              style={{ color: "#0f131a" }}
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-[#1a5d47] to-[#2d8a6a] text-white font-black uppercase tracking-[0.2em] rounded-[24px] shadow-xl shadow-emerald-900/10 hover:shadow-2xl hover:shadow-emerald-900/20 transition-all text-sm"
        >
          Publish Retreat
        </motion.button>
      </div>
    </form>
  );
};

export default RetreatForm;

