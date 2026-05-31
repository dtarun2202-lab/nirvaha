const express = require('express');
const Yoga = require('../models/Yoga');

const router = express.Router();

// ── Shared helper: make relative /uploads/ paths absolute ──────────────────
const toAbsolute = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
    const BASE = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5001}`;
    return `${BASE}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  return url; // frontend public asset — return as-is
};

const formatYoga = (y) => ({
  id: y.id,
  name: y.name,
  difficulty: y.difficulty || 'Gentle',
  duration: y.duration || 0,
  youtubeUrl: y.youtubeUrl || '',
  imageUrl: toAbsolute(y.imageUrl || ''),
  status: y.status || 'Active',
  adminManaged: y.adminManaged || false,
  createdAt: y.createdAt,
  updatedAt: y.updatedAt,
});

// ── GET /api/yoga — all active records (used by frontend) ──────────────────
router.get('/', async (req, res) => {
  try {
    const yogas = await Yoga.find({}).sort({ createdAt: -1 }).lean();
    res.json(yogas.map(formatYoga));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── GET /api/yoga/admin — only admin-managed records (used by admin table) ─
router.get('/admin', async (req, res) => {
  try {
    const yogas = await Yoga.find({ adminManaged: true }).sort({ createdAt: -1 }).lean();
    res.json(yogas.map(formatYoga));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── POST /api/yoga — create new card (always admin-managed) ────────────────
router.post('/', async (req, res) => {
  try {
    const yoga = new Yoga({ ...req.body, adminManaged: true });
    await yoga.save();
    res.status(201).json(formatYoga(yoga.toObject()));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ── PUT /api/yoga/:id — update card (mark as admin-managed) ───────────────
router.put('/:id', async (req, res) => {
  try {
    const yoga = await Yoga.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, adminManaged: true },
      { new: true, runValidators: true }
    );
    if (!yoga) {
      return res.status(404).json({ error: 'Yoga not found' });
    }
    res.json(formatYoga(yoga.toObject()));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ── DELETE /api/yoga/:id ───────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const yoga = await Yoga.findOneAndDelete({ id: req.params.id });
    if (!yoga) {
      return res.status(404).json({ error: 'Yoga not found' });
    }
    res.json({ message: 'Yoga deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
