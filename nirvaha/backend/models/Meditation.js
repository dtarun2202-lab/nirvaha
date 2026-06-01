const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const meditationSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    title: { type: String, required: true },
    duration: { type: Number, required: true },
    level: { type: String, default: '' },
    category: { type: String, default: '' },
    description: { type: String, default: '' },
    status: { type: String, default: 'Draft' },
    thumbnailUrl: { type: String, default: '' },
    bannerUrl: { type: String, default: '' },
    audioUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Meditation', meditationSchema);
