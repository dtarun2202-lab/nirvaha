const express = require('express');
const User = require('../models/User');

const router = express.Router();

function mondayWeekIndex(d = new Date()) {
  return (d.getDay() + 6) % 7;
}

function computeStreak(activityLog) {
  const sortedDates = [...new Set(activityLog || [])].sort();
  if (sortedDates.length === 0) return 0;
  let streak = 1;
  for (let i = sortedDates.length - 1; i > 0; i--) {
    const diff =
      (new Date(sortedDates[i]) - new Date(sortedDates[i - 1])) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function wellnessFromStats(sessionsPlayed, streak, totalMinutes) {
  return Math.min(
    100,
    Math.round((sessionsPlayed || 0) * 2 + (streak || 0) * 5 + ((totalMinutes || 0) / 10))
  );
}

async function appendSessionAndStats(user, entry) {
  const mins = Math.max(1, Math.min(240, Math.round(Number(entry.duration) || 1)));
  const today = new Date().toISOString().split('T')[0];
  const activityLog = [...new Set([...(user.stats?.activityLog || []), today])];

  const streak = computeStreak(activityLog);
  const sessionsPlayed = (user.stats?.sessionsPlayed || 0) + 1;
  const totalMinutes = (user.stats?.totalMinutes || 0) + mins;
  const weeklyMinutes = [...(user.stats?.weeklyMinutes || [0, 0, 0, 0, 0, 0, 0])];
  const idx = mondayWeekIndex(new Date());
  weeklyMinutes[idx] = (weeklyMinutes[idx] || 0) + mins;
  const wellnessScore = wellnessFromStats(sessionsPlayed, streak, totalMinutes);

  const hist = [...(user.sessionHistory || []), entry];
  const sessionHistory = hist.length > 300 ? hist.slice(-300) : hist;

  const updated = await User.findOneAndUpdate(
    { id: user.id },
    {
      $set: {
        sessionHistory,
        'stats.sessionsPlayed': sessionsPlayed,
        'stats.streak': streak,
        'stats.totalMinutes': totalMinutes,
        'stats.weeklyMinutes': weeklyMinutes,
        'stats.activityLog': activityLog,
        'stats.lastPlayedDate': today,
        'stats.wellnessScore': wellnessScore,
      },
    },
    { new: true }
  );

  return updated;
}

// GET /api/profile?userId= — used by AuthContext.refreshProfile + ProfilePage
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const user = await User.findOne({ id: userId }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password: _pw, ...safe } = user;
    res.json(safe);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/profile/log-session
router.post('/log-session', async (req, res) => {
  try {
    const { userId, duration, sessionType, title, category } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const st = (sessionType || 'meditation').toLowerCase();
    const cat = category != null && String(category).trim() ? String(category).trim() : '';
    const entry = {
      title: title || (st === 'sound' ? 'Sound healing' : 'Meditation'),
      duration: Math.max(1, Math.round(Number(duration) || 1)),
      sessionType: st,
      type: st === 'sound' ? (cat || 'Sound Healing') : cat || 'Meditation',
      completedAt: new Date(),
    };

    const updated = await appendSessionAndStats(user, entry);
    const io = req.app.get('io');
    if (io) {
      io.emit('profile_updated', {
        userId: updated.id,
        stats: updated.stats,
        sessionHistory: updated.sessionHistory,
      });
    }
    res.json({ ok: true, stats: updated.stats, sessionHistory: updated.sessionHistory });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/profile/log-sound-session — same stats pipeline; tagged for Emotional Landscape
router.post('/log-sound-session', async (req, res) => {
  try {
    const { userId, duration, title, category } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const entry = {
      title: title || 'Sound healing',
      duration: Math.max(1, Math.round(Number(duration) || 1)),
      sessionType: 'sound',
      type: category || 'Sound Healing',
      completedAt: new Date(),
    };

    const updated = await appendSessionAndStats(user, entry);
    const io = req.app.get('io');
    if (io) {
      io.emit('profile_updated', {
        userId: updated.id,
        stats: updated.stats,
        sessionHistory: updated.sessionHistory,
      });
    }
    res.json({ ok: true, stats: updated.stats, sessionHistory: updated.sessionHistory });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/profile/mood
router.post('/mood', async (req, res) => {
  try {
    const { userId, mood } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const updated = await User.findOneAndUpdate(
      { id: userId },
      { $set: { currentMood: mood || '' } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json({ ok: true, currentMood: updated.currentMood });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/profile/recommendations?userId=
router.get('/recommendations', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    res.json({ sessions: [], tips: [], userId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/profile/increment-game — Memory Match etc.
router.post('/increment-game', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const today = new Date().toISOString().split('T')[0];
    const activityLog = [...new Set([...(user.stats?.activityLog || []), today])];
    const streak = computeStreak(activityLog);
    const newSessionsPlayed = (user.stats?.sessionsPlayed || 0) + 1;
    const wellnessScore = wellnessFromStats(
      newSessionsPlayed,
      streak,
      user.stats?.totalMinutes || 0
    );

    const updated = await User.findOneAndUpdate(
      { id: userId },
      {
        $set: {
          'stats.sessionsPlayed': newSessionsPlayed,
          'stats.streak': streak,
          'stats.activityLog': activityLog,
          'stats.lastPlayedDate': today,
          'stats.wellnessScore': wellnessScore,
        },
      },
      { new: true }
    );

    const io = req.app.get('io');
    if (io) {
      io.emit('profile_updated', {
        userId: updated.id,
        stats: updated.stats,
        sessionHistory: updated.sessionHistory || [],
      });
    }
    res.json({ success: true, stats: updated.stats });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/profile/daily-checkin — Automatically updates the user's daily streak
router.post('/daily-checkin', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const today = new Date().toISOString().split('T')[0];
    const activityLog = user.stats?.activityLog || [];
    
    if (!activityLog.includes(today)) {
      const newLog = [...new Set([...activityLog, today])].sort();
      const streak = computeStreak(newLog);
      
      const updated = await User.findOneAndUpdate(
        { id: userId },
        { 
          $set: { 
            'stats.activityLog': newLog,
            'stats.streak': streak,
            'stats.lastPlayedDate': today
          } 
        },
        { new: true }
      );
      
      const io = req.app.get('io');
      if (io) {
        io.emit('profile_updated', {
          userId: updated.id,
          stats: updated.stats,
          sessionHistory: updated.sessionHistory || [],
        });
      }
      return res.json({ success: true, stats: updated.stats });
    }
    
    res.json({ success: false, message: 'Already checked in today' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
