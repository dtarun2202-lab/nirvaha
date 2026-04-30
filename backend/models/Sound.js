const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const soundSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    title: { type: String, required: true },
    artist: { type: String, default: '' },
    frequency: { type: String, default: '' },
    duration: { type: Number, required: true },
    category: { type: String, default: '' },
    description: { type: String, default: '' },
    status: { type: String, default: 'Draft' },
    thumbnailUrl: { type: String, default: '' },
    bannerUrl: { type: String, default: '' },
    audioUrl: { type: String, default: '' },
    mood: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sound', soundSchema);
