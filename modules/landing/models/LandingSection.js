const mongoose = require('mongoose');

const LandingContentItemSchema = new mongoose.Schema({
  type: { type: String, enum: ['testimonial', 'faq', 'feature', 'certification'], required: true },
  title: { type: String },
  description: { type: String },
  buttonText: { type: String },
  imageUrl: { type: String },
  order: { type: Number, default: 0 },
  // Additional fields specific to content type can be added later
});

const LandingSectionSchema = new mongoose.Schema({
  identifier: { type: String, required: true, unique: true }, // e.g., 'hero', 'features', etc.
  title: { type: String, required: true },
  description: { type: String },
  buttonText: { type: String },
  imageUrl: { type: String },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  contents: [LandingContentItemSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

LandingSectionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('LandingSection', LandingSectionSchema);
