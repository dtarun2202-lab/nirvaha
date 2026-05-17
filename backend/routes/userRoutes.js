const express = require('express');
const User = require('../models/User');
const router = express.Router();

// GET /api/users - Fetch all users
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/pathway/:id/students - Fetch student count for a pathway
router.get('/pathway/:id/students', async (req, res) => {
  try {
    const pathwayId = req.params.id;
    const count = await User.countDocuments({ enrolledPathways: pathwayId });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/profile - Fetch user profile & stats
router.get("/profile", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Clean up any false streak if no actual activity exists
    const totalSessions = (user.stats?.sessionsPlayed || 0) + (user.sessionHistory || []).length;
    if (totalSessions === 0 && user.stats) {
      user.stats.streak = 0;
      user.stats.sessionsPlayed = 0;
      user.stats.totalMinutes = 0;
      user.stats.activityLog = [];
      await User.findOneAndUpdate(
        { id: userId },
        { 
          $set: { 
            'stats.streak': 0,
            'stats.sessionsPlayed': 0,
            'stats.totalMinutes': 0,
            'stats.activityLog': []
          } 
        }
      );
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/profile/update - Update profile data
router.post("/profile/update", async (req, res) => {
  try {
    const { userId, bio, location, avatar } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findOneAndUpdate(
      { id: userId },
      { $set: updateData },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
