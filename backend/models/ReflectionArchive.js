const mongoose = require('mongoose');

const reflectionArchiveSchema = new mongoose.Schema(
  {
    originalReflectionId: { type: mongoose.Schema.Types.ObjectId, index: true, unique: true },
    userId: { type: String, index: true },
    message: { type: String, required: true },
    reply: { type: String, required: true },
    timestamp: { type: Date, required: true },
    archivedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ReflectionArchive', reflectionArchiveSchema);
