const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Booking = require('../models/Booking');

const router = express.Router();

// Create new booking
router.post('/', async (req, res) => {
  try {
    const bookingPayload = {
      ...req.body,
      status:
        req.body.status ||
        (req.body.type === 'product' ? 'completed' : 'upcoming'),
      createdAt: req.body.createdAt ? new Date(req.body.createdAt) : new Date(),
      id: req.body.id || uuidv4(),
    };

    const booking = await Booking.create(bookingPayload);
    
    // Emit real-time event
    const io = req.app.get('io');
    io.emit('booking-created', booking);
    
    res.json({
      success: true,
      message: 'Booking Created',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bookings (admin)
router.get('/', async (req, res) => {
  try {
    const data = await Booking.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
