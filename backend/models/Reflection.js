const mongoose = require('mongoose');

const reflectionSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true }, // Optional: link to user id if logged in
    message: { type: String, required: true },
    reply: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reflection', reflectionSchema);
