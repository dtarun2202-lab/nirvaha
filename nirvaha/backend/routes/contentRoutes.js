const express = require('express');
const Content = require('../models/Content');

const router = express.Router();

// Get all content (public)
router.get('/', async (req, res) => {
  try {
    const { section } = req.query;
    const filter = section ? { section } : {};
    const content = await Content.find(filter).sort({ section: 1, key: 1 });

    const formatted = content.reduce((acc, item) => {
      acc[item.key] = {
        value: item.value,
        type: item.type,
        section: item.section,
        updatedAt: item.updatedAt,
      };
      return acc;
    }, {});

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get content by key (public)
router.get('/:key', async (req, res) => {
  try {
    const content = await Content.findOne({ key: req.params.key });
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all content items for admin
router.get('/admin/all', async (req, res) => {
  try {
    const content = await Content.find().sort({ section: 1, key: 1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update content (admin)
router.put('/:key', async (req, res) => {
  try {
    const { value, type, section, description } = req.body;

    const content = await Content.findOneAndUpdate(
      { key: req.params.key },
      {
        value,
        type: type || 'text',
        section: section || 'general',
        description,
      },
      { new: true, upsert: true }
    );

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('content-updated', {
      key: content.key,
      value: content.value,
      type: content.type,
      section: content.section,
      updatedAt: content.updatedAt,
    });

    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload image content
router.post('/upload', async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { key, section, description } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    const content = await Content.findOneAndUpdate(
      { key },
      {
        value: imageUrl,
        type: 'image',
        section: section || 'general',
        description,
      },
      { new: true, upsert: true }
    );

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('content-updated', {
      key: content.key,
      value: content.value,
      type: content.type,
      section: content.section,
      updatedAt: content.updatedAt,
    });

    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete content
router.delete('/:key', async (req, res) => {
  try {
    const content = await Content.findOneAndDelete({ key: req.params.key });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('content-deleted', { key: req.params.key });

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
