const mongoose = require('mongoose');

const soundCardSchema = new mongoose.Schema(
  {
    collectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'SoundCollection', default: null },
    collectionSlug: { type: String, default: '' }, // 'meditation' | 'sleep' | 'focus' | 'nature'
    moodSlug: { type: String, default: '' },        // 'stress' | 'anxiety' | 'sleep-issues' | 'focus' | 'emotional-balance'
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    artist: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    audioUrl: { type: String, default: '' },
    frequency: { type: String, default: '' },
    tag: { type: String, default: '' },
    duration: { type: String, default: '' },
    category: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Draft'], default: 'Draft' },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SoundCard', soundCardSchema);
