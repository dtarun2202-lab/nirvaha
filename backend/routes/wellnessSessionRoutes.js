const express = require('express');
const router = express.Router();
const WellnessSession = require('../models/WellnessSession');

// GET /api/wellness-sessions - Public endpoint (returns active sessions sorted by displayOrder)
router.get('/', async (req, res) => {
  try {
    const sessions = await WellnessSession.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
    
    // Normalize _id to id if frontend expects it
    const normalizedSessions = sessions.map(s => ({
      ...s,
      id: s.id || s._id.toString()
    }));

    res.json({
      success: true,
      sessions: normalizedSessions,
      count: normalizedSessions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions',
      error: error.message
    });
  }
});

// GET /api/wellness-sessions/all - Admin endpoint (returns all sessions sorted by displayOrder)
router.get('/all', async (req, res) => {
  try {
    const sessions = await WellnessSession.find()
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
    
    const normalizedSessions = sessions.map(s => ({
      ...s,
      id: s.id || s._id.toString()
    }));

    res.json({
      success: true,
      sessions: normalizedSessions,
      count: normalizedSessions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching all sessions',
      error: error.message
    });
  }
});

// GET /api/wellness-sessions/:id - Get single session
router.get('/:id', async (req, res) => {
  try {
    const session = await WellnessSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    res.json({
      success: true,
      session: {
        ...session.toObject(),
        id: session.id || session._id.toString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching session',
      error: error.message
    });
  }
});

// POST /api/wellness-sessions - Create new session
router.post('/', async (req, res) => {
  try {
    const {
      title,
      category,
      mood,
      tags,
      duration,
      thumbnail,
      banner,
      audioSource,
      description,
      match,
      year,
      rating,
      type,
      seasons,
      isOriginal
    } = req.body;

    if (!title || !category || !duration || !thumbnail || !banner || !description || !type) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, duration, thumbnail, banner, description, and type are required'
      });
    }

    const lastSession = await WellnessSession.findOne().sort({ displayOrder: -1 }).lean();
    const nextOrder = (lastSession?.displayOrder || 0) + 1;

    const session = new WellnessSession({
      title,
      category,
      mood: mood || [],
      tags: tags || [],
      duration,
      thumbnail,
      banner,
      audioSource: audioSource || '',
      description,
      match: match || '95% Match',
      year: year || '2026',
      rating: rating || 'TV-G',
      type,
      seasons: seasons || [],
      isOriginal: isOriginal || false,
      displayOrder: nextOrder,
      isActive: true
    });

    await session.save();

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      session: {
        ...session.toObject(),
        id: session.id || session._id.toString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating session',
      error: error.message
    });
  }
});

// PUT /api/wellness-sessions/:id - Update session
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    delete updates.createdAt;
    delete updates.updatedAt;

    const session = await WellnessSession.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      message: 'Session updated successfully',
      session: {
        ...session.toObject(),
        id: session.id || session._id.toString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating session',
      error: error.message
    });
  }
});

// DELETE /api/wellness-sessions/:id - Delete session permanently
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const session = await WellnessSession.findByIdAndDelete(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting session',
      error: error.message
    });
  }
});

// POST /api/wellness-sessions/reorder - Reorder sessions
router.post('/reorder', async (req, res) => {
  try {
    const { sessionIds } = req.body;

    if (!Array.isArray(sessionIds)) {
      return res.status(400).json({
        success: false,
        message: 'sessionIds must be an array'
      });
    }

    const updatePromises = sessionIds.map((item, index) => {
      const id = typeof item === 'string' ? item : (item.id || item._id);
      return WellnessSession.findByIdAndUpdate(id, { displayOrder: index, updatedAt: Date.now() });
    });

    await Promise.all(updatePromises);

    const sessions = await WellnessSession.find().sort({ displayOrder: 1 });

    res.json({
      success: true,
      message: 'Sessions reordered successfully',
      sessions: sessions.map(s => ({ ...s.toObject(), id: s.id || s._id.toString() }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reordering sessions',
      error: error.message
    });
  }
});

module.exports = router;
