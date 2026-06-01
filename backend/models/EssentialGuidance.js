const mongoose = require('mongoose');

const essentialGuidanceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Guidance content steps (up to 5)
    step1: { type: String, default: '' },
    step2: { type: String, default: '' },
    step3: { type: String, default: '' },
    step4: { type: String, default: '' },
    step5: { type: String, default: '' },
    // Quote section
    quoteText: { type: String, default: '' },
    breathingPattern: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EssentialGuidance', essentialGuidanceSchema);
