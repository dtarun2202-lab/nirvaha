const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const poseSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    name: { type: String, required: true },
    sanskritName: { type: String, default: '' },
    poseNumber: { type: Number, default: 0 },
    category: { type: String, default: '' },
    shortCaption: { type: String, default: '' },
    shortIntro: { type: String, default: '' },
    spiritualEssence: { type: String, default: '' },
    ancientOrigin: { type: String, default: '' },
    mentalBenefits: { type: [String], default: [] },
    physicalBenefits: { type: [String], default: [] },
    chakraName: { type: String, default: '' },
    chakraDescription: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    set: { type: String, enum: ['Set 1', 'Set 2'], default: 'Set 1' },
    position: { type: Number, default: 0 },
    status: { type: String, default: 'Draft' },
    show: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pose', poseSchema);
