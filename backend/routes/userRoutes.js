const express = require('express');
const User = require('../models/User');
const router = express.Router();

// GET /api/users - Fetch all users sorted by latest
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error while fetching users' });
  }
});

// GET /api/profile - Fetch specific user profile
router.get('/profile', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
      stats: user.stats,
      bio: user.bio,
      location: user.location,
      avatar: user.avatar
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/profile/update - Update profile (bio, avatar, stats, etc)
router.post('/profile/update', async (req, res) => {
  try {
    const { userId, bio, location, avatar, stats } = req.body;
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (stats !== undefined) updateData.stats = stats;

    const user = await User.findOneAndUpdate(
      { id: userId },
      { $set: updateData },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('profile_updated', { userId, stats: user.stats, bio: user.bio, location: user.location });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
