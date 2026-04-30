const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const marketplaceRequestSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    type: {
      type: String,
      enum: ['session', 'retreat', 'product'],
      required: true,
    },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    userId: { type: String, default: '' },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    approvedAt: { type: Date, default: null },
    approvedBy: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MarketplaceRequest', marketplaceRequestSchema);
