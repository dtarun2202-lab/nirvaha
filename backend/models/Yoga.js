const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const yogaSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    name: { type: String, required: true },
    difficulty: { type: String, default: 'Gentle' },
    duration: { type: Number, default: 0 },
    youtubeUrl: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    status: { type: String, default: 'Active' },
    // true = created/edited via admin panel; false = seeded default pose
    adminManaged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Yoga', yogaSchema);
