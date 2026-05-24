const express = require('express');
const router = express.Router();
const WellnessRetreat = require('../models/WellnessRetreat');

// GET /api/wellness-retreats - Public endpoint (returns active retreats sorted by displayOrder)
router.get('/', async (req, res) => {
  try {
    const retreats = await WellnessRetreat.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
    
    res.json({
      success: true,
      retreats: retreats,
      count: retreats.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching retreats',
      error: error.message
    });
  }
});

// GET /api/wellness-retreats/all - Admin endpoint (returns all retreats sorted by displayOrder)
router.get('/all', async (req, res) => {
  try {
    const retreats = await WellnessRetreat.find()
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
    
    res.json({
      success: true,
      retreats: retreats,
      count: retreats.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching all retreats',
      error: error.message
    });
  }
});

// GET /api/wellness-retreats/:id - Get single retreat
router.get('/:id', async (req, res) => {
  try {
    const retreat = await WellnessRetreat.findById(req.params.id);
    if (!retreat) {
      return res.status(404).json({
        success: false,
        message: 'Retreat not found'
      });
    }
    res.json({
      success: true,
      retreat: retreat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching retreat',
      error: error.message
    });
  }
});

// POST /api/wellness-retreats - Create new retreat
router.post('/', async (req, res) => {
  try {
    const { category, title, description, image, externalLink, buttonLabel } = req.body;

    if (!title || !description || !image || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, image, and category are required'
      });
    }

    // Get the highest displayOrder value to place at the end
    const lastRetreat = await WellnessRetreat.findOne().sort({ displayOrder: -1 }).lean();
    const nextOrder = (lastRetreat?.displayOrder || 0) + 1;

    const retreat = new WellnessRetreat({
      category,
      title,
      description,
      image,
      externalLink: externalLink || '',
      buttonLabel: buttonLabel || 'Explore',
      displayOrder: nextOrder,
      isActive: true
    });

    await retreat.save();

    res.status(201).json({
      success: true,
      message: 'Retreat created successfully',
      retreat: retreat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating retreat',
      error: error.message
    });
  }
});

// PUT /api/wellness-retreats/:id - Update retreat
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Do not allow updating timestamps directly
    delete updates.createdAt;
    delete updates.updatedAt;

    const retreat = await WellnessRetreat.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!retreat) {
      return res.status(404).json({
        success: false,
        message: 'Retreat not found'
      });
    }

    res.json({
      success: true,
      message: 'Retreat updated successfully',
      retreat: retreat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating retreat',
      error: error.message
    });
  }
});

// DELETE /api/wellness-retreats/:id - Delete retreat permanently
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const retreat = await WellnessRetreat.findByIdAndDelete(id);

    if (!retreat) {
      return res.status(404).json({
        success: false,
        message: 'Retreat not found'
      });
    }

    res.json({
      success: true,
      message: 'Retreat deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting retreat',
      error: error.message
    });
  }
});

// POST /api/wellness-retreats/reorder - Reorder retreats
router.post('/reorder', async (req, res) => {
  try {
    const { retreatIds } = req.body;

    if (!Array.isArray(retreatIds)) {
      return res.status(400).json({
        success: false,
        message: 'retreatIds must be an array'
      });
    }

    const updatePromises = retreatIds.map((item, index) => {
      const id = typeof item === 'string' ? item : (item.id || item._id);
      return WellnessRetreat.findByIdAndUpdate(id, { displayOrder: index, updatedAt: Date.now() });
    });

    await Promise.all(updatePromises);

    const retreats = await WellnessRetreat.find().sort({ displayOrder: 1 });

    res.json({
      success: true,
      message: 'Retreats reordered successfully',
      retreats: retreats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reordering retreats',
      error: error.message
    });
  }
});

module.exports = router;
