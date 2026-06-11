const express = require('express');
const User = require('../models/User');
const { resolveAndPersistCompanionForUser } = require('../utils/companionStatus');
const router = express.Router();
const UserSettings = require('../models/UserSettings');
const { authenticateJWT } = require('../middleware/auth');

// GET /api/users - Fetch all users
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    let query = User.find().sort({ createdAt: -1 });
    if (limit) {
      query = query.limit(limit);
    }
    const users = await query;
    const safeUsers = users.map(u => {
      const obj = u.toObject();
      delete obj.password;
      // If companion status or flag is active, represent role as companion if the role is user
      if ((obj.isApprovedCompanion || obj.companionStatus === 'approved') && obj.role === 'user') {
        obj.role = 'companion';
      }
      return obj;
    });
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/:id/role - Update user role
router.put('/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'companion', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      { $set: { role } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/:id/status - Update user status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended', 'banned', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      { $set: { status } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user });
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

    const companionInfo =
      user.isApprovedCompanion === true || user.companionStatus === 'approved'
        ? {
            isApprovedCompanion: user.isApprovedCompanion === true,
            companionStatus: user.companionStatus || null,
            companionId: user.companionId || null,
          }
        : await resolveAndPersistCompanionForUser({ email: user.email, name: user.name });

    const safeUser = {
      ...user.toObject(),
      isApprovedCompanion: companionInfo.isApprovedCompanion === true,
      companionStatus: companionInfo.companionStatus || null,
    };
    // remove sensitive/internal fields
    if (safeUser.password) delete safeUser.password;
    if (safeUser.__v) delete safeUser.__v;

    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/settings - Fetch current user's settings
router.get('/settings', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    let settings = await UserSettings.findOne({ userId });
    if (!settings) {
      // create default settings for user
      settings = new UserSettings({ userId });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const ALLOWED_SETTINGS_KEYS = [
  'theme', 'language', 'notifications', 'privacy', 'music', 'chatbotPersona', 'realtimeSync'
];

function pickAllowedSettings(body) {
  const update = {};
  for (const key of ALLOWED_SETTINGS_KEYS) {
    if (body[key] !== undefined) update[key] = body[key];
  }
  return update;
}

// PUT /api/users/settings - Update current user's settings (partial allowed)
router.put('/settings', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const update = pickAllowedSettings(req.body);
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: 'No valid settings fields provided' });
    }
    const settings = await UserSettings.findOneAndUpdate(
      { userId },
      { $set: update },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/users/account - Permanently delete user account and settings
router.delete('/account', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    await UserSettings.deleteOne({ userId });
    await User.findByIdAndDelete(userId);
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users/profile/update - Update profile data
router.post("/profile/update", async (req, res) => {
  try {
    const { userId, bio, location, avatar, name, email } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (name !== undefined) updateData.name = name;

    if (email !== undefined && email.trim() !== '') {
      // Verify email uniqueness
      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = await User.findOne({ email: normalizedEmail, id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ error: "This email/username is already registered to another account" });
      }
      updateData.email = normalizedEmail;
    }

    const user = await User.findOneAndUpdate(
      { id: userId },
      { $set: updateData },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    const safeUser = {
      ...user.toObject(),
      isApprovedCompanion: user.isApprovedCompanion === true,
      companionStatus: user.companionStatus || null,
    };
    if (safeUser.password) delete safeUser.password;
    if (safeUser.__v) delete safeUser.__v;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
