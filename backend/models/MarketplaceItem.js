const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const marketplaceItemSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    requestId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ['session', 'retreat', 'product'],
      required: true,
    },
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    approvedAt: { type: Date, default: null },
    approvedBy: { type: String, default: null },
    completedAt: { type: Date, default: null },
    completedBy: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MarketplaceItem', marketplaceItemSchema);
