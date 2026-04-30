const express = require('express');
const Meditation = require('../models/Meditation');

const router = express.Router();

// Get all meditations
router.get('/', async (req, res) => {
  try {
    const meditations = await Meditation.find().sort({ createdAt: -1 }).lean();
    res.json(
      meditations.map((item) => ({
        id: item.id,
        title: item.title,
        duration: item.duration,
        level: item.level || '',
        category: item.category || '',
        description: item.description || '',
        status: item.status || 'Draft',
        thumbnailUrl: item.thumbnailUrl || '',
        bannerUrl: item.bannerUrl || '',
        audioUrl: item.audioUrl || '',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new meditation
router.post('/', async (req, res) => {
  const {
    title,
    duration,
    level,
    category,
    description,
    status,
    thumbnailUrl,
    audioUrl,
    bannerUrl,
  } = req.body || {};

  if (!title || typeof duration !== 'number') {
    return res.status(400).json({ error: 'title and duration are required' });
  }

  try {
    const created = await Meditation.create({
      title,
      duration,
      level: level || '',
      category: category || '',
      description: description || '',
      status: status || 'Draft',
      thumbnailUrl: thumbnailUrl || '',
      audioUrl: audioUrl || '',
      bannerUrl: bannerUrl || '',
    });

    res.status(201).json({
      id: created.id,
      title: created.title,
      duration: created.duration,
      level: created.level || '',
      category: created.category || '',
      description: created.description || '',
      status: created.status || 'Draft',
      thumbnailUrl: created.thumbnailUrl || '',
      bannerUrl: created.bannerUrl || '',
      audioUrl: created.audioUrl || '',
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update meditation
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    title,
    duration,
    level,
    category,
    description,
    status,
    thumbnailUrl,
    audioUrl,
    bannerUrl,
  } = req.body || {};

  try {
    const updated = await Meditation.findOneAndUpdate(
      { id },
      {
        ...(title !== undefined ? { title } : {}),
        ...(typeof duration === 'number' ? { duration } : {}),
        ...(level !== undefined ? { level } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(thumbnailUrl !== undefined ? { thumbnailUrl } : {}),
        ...(audioUrl !== undefined ? { audioUrl } : {}),
        ...(bannerUrl !== undefined ? { bannerUrl } : {}),
      },
      { new: true, runValidators: true, timestamps: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'meditation not found' });
    }

    res.json({
      id: updated.id,
      title: updated.title,
      duration: updated.duration,
      level: updated.level || '',
      category: updated.category || '',
      description: updated.description || '',
      status: updated.status || 'Draft',
      thumbnailUrl: updated.thumbnailUrl || '',
      bannerUrl: updated.bannerUrl || '',
      audioUrl: updated.audioUrl || '',
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete meditation
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Meditation.deleteOne({ id });
    if (deleted.deletedCount === 0) {
      return res.status(404).json({ error: 'meditation not found' });
    }
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
