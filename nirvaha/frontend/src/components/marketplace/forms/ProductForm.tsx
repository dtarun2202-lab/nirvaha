import React, { useState } from 'react';
import { motion } from 'motion/react';

interface ProductFormProps {
  onSubmit: (formData: any) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    images: '',
    price: '',
    certification: '',
    manufacturingDetails: '',
    category: 'Other',
    stockAvailability: 'In Stock',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.images.trim()) newErrors.images = 'Image URL is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    
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
      {/* Product Name */}
      <div>
        <label htmlFor="name" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
          Product Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Crystal Healing Set"
          className={`w-full px-5 py-3.5 border-2 rounded-[22px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
            errors.name ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
          }`}
          style={{ color: "#0f131a" }}
        />
        {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.name}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the product features and benefits..."
          rows={3}
          className={`w-full px-5 py-3.5 border-2 rounded-[22px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
            errors.description ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
          }`}
          style={{ color: "#0f131a" }}
        />
        {errors.description && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.description}</p>}
      </div>

      {/* Images Upload */}
      <div>
        <label htmlFor="images" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
          Images Upload (URL) *
        </label>
        <input
          type="text"
          id="images"
          name="images"
          value={formData.images}
          onChange={handleChange}
          placeholder="Image URL or multiple URLs separated by commas"
          className={`w-full px-5 py-3.5 border-2 rounded-[22px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
            errors.images ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
          }`}
          style={{ color: "#0f131a" }}
        />
        {errors.images && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.images}</p>}
      </div>

      {/* Price */}
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
          placeholder="e.g., 899"
          className={`w-full px-5 py-3.5 border-2 rounded-[22px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
            errors.price ? 'border-red-400 bg-red-50' : 'border-[#D1FAE5] bg-[#F0F9F4] focus:border-[#1a5d47]'
          }`}
          style={{ color: "#0f131a" }}
        />
        {errors.price && <p className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase">{errors.price}</p>}
      </div>

      {/* Certification Details */}
      <div>
        <label htmlFor="certification" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
          Certification Details (optional)
        </label>
        <textarea
          id="certification"
          name="certification"
          value={formData.certification}
          onChange={handleChange}
          placeholder="e.g., Certified organic, Fair trade, etc."
          rows={2}
          className="w-full px-5 py-3.5 border-2 border-[#D1FAE5] bg-[#F0F9F4] rounded-[22px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-[#1a5d47] transition-all"
          style={{ color: "#0f131a" }}
        />
      </div>

      {/* Manufacturing Details */}
      <div>
        <label htmlFor="manufacturingDetails" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
          Manufacturing Details (optional)
        </label>
        <textarea
          id="manufacturingDetails"
          name="manufacturingDetails"
          value={formData.manufacturingDetails}
          onChange={handleChange}
          placeholder="e.g., Handcrafted in Bali, Eco-friendly materials..."
          rows={2}
          className="w-full px-5 py-3.5 border-2 border-[#D1FAE5] bg-[#F0F9F4] rounded-[22px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-[#1a5d47] transition-all"
          style={{ color: "#0f131a" }}
        />
      </div>

      {/* Category & Stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="category" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-5 py-3.5 border-2 border-[#D1FAE5] bg-[#F0F9F4] rounded-[22px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-[#1a5d47] transition-all appearance-none"
            style={{ color: "#0f131a" }}
          >
            <option value="Crystals">Crystals</option>
            <option value="Sound Healing">Sound Healing</option>
            <option value="Meditation">Meditation</option>
            <option value="Aromatherapy">Aromatherapy</option>
            <option value="Spiritual Tools">Spiritual Tools</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="stockAvailability" className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#1a5d47]/60 px-1">
            Availability
          </label>
          <select
            id="stockAvailability"
            name="stockAvailability"
            value={formData.stockAvailability}
            onChange={handleChange}
            className="w-full px-5 py-3.5 border-2 border-[#D1FAE5] bg-[#F0F9F4] rounded-[22px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-[#1a5d47] transition-all appearance-none"
            style={{ color: "#0f131a" }}
          >
            <option value="In Stock">In Stock</option>
            <option value="Limited Stock">Limited Stock</option>
            <option value="Pre-Order">Pre-Order</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-[#1a5d47] to-[#2d8a6a] text-white font-black uppercase tracking-[0.2em] rounded-[24px] shadow-xl shadow-emerald-900/10 hover:shadow-2xl hover:shadow-emerald-900/20 transition-all text-sm"
        >
          Publish Product
        </motion.button>
      </div>
    </form>
  );
};

export default ProductForm;

