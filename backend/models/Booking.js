const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const bookingSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4 },
    itemId: String,
    userId: String,
    userName: String,
    userEmail: String,
    email: String,
    phone: String,
    sessionNotes: String,
    type: String,
    price: Number,
    status: { type: String, default: 'pending' },
    date: String,
    time: String,
    platform: String,
    companionName: String,
    companionId: String,
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
