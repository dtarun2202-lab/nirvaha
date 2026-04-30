const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    type: {
      type: String,
      enum: ['text', 'image', 'html', 'json', 'number'],
      default: 'text',
    },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    section: { type: String, required: true, index: true },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Content', contentSchema);
