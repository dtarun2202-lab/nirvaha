const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const bookingSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4 },
    itemId: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null },
    legacyUserId: { type: String, default: null },
    userName: String,
    userEmail: String,
    email: String,
    phone: String,
    sessionNotes: String,
    type: String,
    sessionType: String,
    price: Number,
    status: { type: String, default: 'pending' },
    assignedAt: Date,
    date: String,
    time: String,
    platform: String,
    companionName: String,
    companionId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null },
    legacyCompanionId: { type: String, default: null },
    itemName: String,
    quantity: { type: Number, default: 1 },
    paymentStatus: { type: String, default: 'Pending' },
    deliveryStatus: { type: String, default: 'Processing' },
    shippingDetails: {
      fullName: String,
      street: String,
      city: String,
      zipCode: String
    },
    paymentMethod: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
