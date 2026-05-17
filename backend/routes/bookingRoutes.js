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

// Get bookings by user email
router.get('/user/:email', async (req, res) => {
  try {
    const data = await Booking.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Try finding by custom id first, then by MongoDB _id
    let booking = await Booking.findOne({ id: id });
    
    if (!booking && id.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Booking.findById(id);
    }

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    Object.assign(booking, req.body);
    await booking.save();

    // Emit update event
    const io = req.app.get('io');
    io.emit('booking-updated', booking);

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let booking = await Booking.findOneAndDelete({ id: id });
    
    if (!booking && id.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Booking.findByIdAndDelete(id);
    }

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const io = req.app.get('io');
    io.emit('booking-deleted', { id: id });

    res.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
