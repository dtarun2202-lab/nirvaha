const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const companionApplicationSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    title: { type: String, required: true },
    bio: { type: String, required: true },
    experience: { type: String, default: '' },
    location: { type: String, default: '' },
    languages: { type: String, default: '' },
    specialties: { type: String, default: '' },
    certifications: { type: String, default: '' },
    hourlyRate: { type: Number, default: 0 },
    callRate: { type: Number, default: 0 },
    availability: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    website: { type: String, default: '' },
    socialLinks: { type: String, default: '' },
    whyJoin: { type: String, default: '' },
    status: { type: String, default: 'pending' },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CompanionApplication', companionApplicationSchema);
