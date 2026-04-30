const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const bookingSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4 },
    itemId: String,
    userName: String,
    email: String,
    type: String,
    price: Number,
    status: { type: String, default: 'pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
