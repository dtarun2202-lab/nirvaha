const express = require('express');
const Sound = require('../models/Sound');

const router = express.Router();

// Get all sounds
router.get('/', async (req, res) => {
  try {
    const sounds = await Sound.find().sort({ createdAt: -1 }).lean();
    res.json(
      sounds.map((item) => ({
        id: item.id,
        title: item.title,
        artist: item.artist || '',
        frequency: item.frequency || '',
        duration: item.duration,
        category: item.category || '',
        description: item.description || '',
        status: item.status || 'Draft',
        thumbnailUrl: item.thumbnailUrl || '',
        bannerUrl: item.bannerUrl || '',
        audioUrl: item.audioUrl || '',
        mood: Array.isArray(item.mood) ? item.mood : [],
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new sound
router.post('/', async (req, res) => {
  const {
    title,
    artist,
    frequency,
    duration,
    category,
    description,
    status,
    thumbnailUrl,
    audioUrl,
    bannerUrl,
    mood,
  } = req.body || {};

  if (!title || typeof duration !== 'number') {
    return res.status(400).json({ error: 'title and duration are required' });
  }

  try {
    const created = await Sound.create({
      title,
      artist: artist || '',
      frequency: frequency || '',
      duration,
      category: category || '',
      description: description || '',
      status: status || 'Draft',
      thumbnailUrl: thumbnailUrl || '',
      audioUrl: audioUrl || '',
      bannerUrl: bannerUrl || '',
      mood: Array.isArray(mood) ? mood : [],
    });

    res.status(201).json({
      id: created.id,
      title: created.title,
      artist: created.artist || '',
      frequency: created.frequency || '',
      duration: created.duration,
      category: created.category || '',
      description: created.description || '',
      status: created.status || 'Draft',
      thumbnailUrl: created.thumbnailUrl || '',
      bannerUrl: created.bannerUrl || '',
      audioUrl: created.audioUrl || '',
      mood: Array.isArray(created.mood) ? created.mood : [],
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update sound
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    title,
    artist,
    frequency,
    duration,
    category,
    description,
    status,
    thumbnailUrl,
    audioUrl,
    bannerUrl,
    mood,
  } = req.body || {};

  try {
    const updated = await Sound.findOneAndUpdate(
      { id },
      {
        ...(title !== undefined ? { title } : {}),
        ...(artist !== undefined ? { artist } : {}),
        ...(frequency !== undefined ? { frequency } : {}),
        ...(typeof duration === 'number' ? { duration } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(thumbnailUrl !== undefined ? { thumbnailUrl } : {}),
        ...(audioUrl !== undefined ? { audioUrl } : {}),
        ...(bannerUrl !== undefined ? { bannerUrl } : {}),
        ...(mood !== undefined ? { mood: Array.isArray(mood) ? mood : [] } : {}),
      },
      { new: true, runValidators: true, timestamps: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'sound not found' });
    }

    res.json({
      id: updated.id,
      title: updated.title,
      artist: updated.artist || '',
      frequency: updated.frequency || '',
      duration: updated.duration,
      category: updated.category || '',
      description: updated.description || '',
      status: updated.status || 'Draft',
      thumbnailUrl: updated.thumbnailUrl || '',
      bannerUrl: updated.bannerUrl || '',
      audioUrl: updated.audioUrl || '',
      mood: Array.isArray(updated.mood) ? updated.mood : [],
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete sound
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Sound.deleteOne({ id });
    if (deleted.deletedCount === 0) {
      return res.status(404).json({ error: 'sound not found' });
    }
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
