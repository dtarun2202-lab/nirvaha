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
      (b) => {
        const typeLower = String(b.type || '').toLowerCase();
        const statusLower = String(b.status || '').toLowerCase();
        
        // Exclude products and retreats from being counted as active sessions
        if (typeLower === 'product' || typeLower === 'retreat') return false;
        
        // Include companion sessions, video/chat/audio sessions
        const isSession = typeLower.includes('session') || typeLower.includes('dive') || typeLower.includes('support') || ['video', 'chat', 'audio'].includes(typeLower);
        
        // Count upcoming, pending, in-progress, approved, and session confirmed as active
        const isActiveStatus = ['upcoming', 'pending', 'in-progress', 'session confirmed', 'pending approval', 'approved'].includes(statusLower);
        
        return isSession && isActiveStatus;
      }
    ).length;

    const totalBookings = allBookings.length;
    const revenue = allBookings.reduce(
      (sum, booking) => sum + Number(booking.price || 0) * Number(booking.quantity || 1),
      0
    );
    const totalProducts = allBookings.filter((b) => String(b.type || '').toLowerCase() === 'product').length;
    const totalRetreats = allBookings.filter((b) => String(b.type || '').toLowerCase() === 'retreat').length;

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