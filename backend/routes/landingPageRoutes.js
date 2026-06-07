// routes/landingPageRoutes.js
const express = require('express');
const LandingPageSection = require('../models/LandingPageSection');

const router = express.Router();

// Get all sections (admin)
router.get('/admin/sections', async (req, res) => {
  try {
    const sections = await LandingPageSection.find().sort({ id: 1 });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update visibility of a section
router.put('/admin/sections/:id', async (req, res) => {
  try {
    const { visible } = req.body;
    const section = await LandingPageSection.findOneAndUpdate(
      { id: req.params.id },
      { visible },
      { new: true, upsert: true }
    );
    // emit real-time update if needed
    const io = req.app.get('io');
    if (io) io.emit('landing-section-updated', { id: section.id, visible: section.visible });
    res.json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
