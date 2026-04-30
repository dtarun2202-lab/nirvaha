const express = require('express');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Meditation = require('../models/Meditation');
const Sound = require('../models/Sound');

const router = express.Router();

// Get users for admin
router.get('/users', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('id name email role createdAt');

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const allBookings = await Booking.find();

    const activeSessions = allBookings.filter(
      (b) => ['session', 'video', 'chat'].includes(b.type) && ['upcoming', 'pending', 'in-progress'].includes(b.status)
    ).length;

    const totalBookings = allBookings.length;
    const revenue = allBookings.reduce(
      (sum, booking) => sum + Number(booking.price || 0),
      0
    );
    const totalProducts = allBookings.filter((b) => b.type === 'product').length;
    const totalRetreats = allBookings.filter((b) => b.type === 'retreat').length;

    res.json({
      totalUsers,
      activeSessions,
      revenue,
      totalBookings,
      totalProducts,
      totalRetreats,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Clear all data (development only)
router.post('/clear-data', async (req, res) => {
  try {
    await Meditation.deleteMany({});
    await Sound.deleteMany({});
    console.log('✓ MongoDB collections cleared');

    res.json({ message: 'All data cleared successfully', dataCleared: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;