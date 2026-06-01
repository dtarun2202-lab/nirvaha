const express = require('express');
const router = express.Router();
const MoodCategory = require('../models/MoodCategory');
const SoundCollection = require('../models/SoundCollection');
const SoundCard = require('../models/SoundCard');

// Default slugs that map to static frontend collections
const STATIC_SLUGS = ['meditation', 'sleep', 'focus', 'nature'];

// ─────────────────────────────────────────────────────────────────────────────
// MOOD CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

router.get('/mood-categories', async (req, res) => {
  try {
    const cats = await MoodCategory.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 }).lean();
    res.json({ success: true, categories: cats });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/mood-categories/all', async (req, res) => {
  try {
    const { search } = req.query;
    const q = search ? { name: { $regex: search, $options: 'i' } } : {};
    const cats = await MoodCategory.find(q).sort({ displayOrder: 1, createdAt: 1 }).lean();
    res.json({ success: true, categories: cats });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/mood-categories', async (req, res) => {
  try {
    const { name, icon } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    const last = await MoodCategory.findOne().sort({ displayOrder: -1 }).lean();
    const cat = await MoodCategory.create({ name, icon: icon || '', isActive: true, displayOrder: (last?.displayOrder ?? -1) + 1 });
    res.status(201).json({ success: true, category: cat });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/mood-categories/:id', async (req, res) => {
  try {
    const updates = { ...req.body }; delete updates.createdAt; delete updates.updatedAt;
    const cat = await MoodCategory.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!cat) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, category: cat });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/mood-categories/:id', async (req, res) => {
  try {
    const cat = await MoodCategory.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/mood-categories/reorder', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) return res.status(400).json({ success: false, message: 'ids must be array' });
    await Promise.all(ids.map((id, i) => MoodCategory.findByIdAndUpdate(id, { displayOrder: i })));
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// SOUND COLLECTIONS
// ─────────────────────────────────────────────────────────────────────────────

router.get('/collections', async (req, res) => {
  try {
    const cols = await SoundCollection.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 }).lean();
    const withCounts = await Promise.all(cols.map(async c => ({
      ...c,
      cardCount: await SoundCard.countDocuments({ collectionId: c._id, status: 'Active' }),
    })));
    res.json({ success: true, collections: withCounts });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/collections/all', async (req, res) => {
  try {
    const { search } = req.query;
    const q = search ? { name: { $regex: search, $options: 'i' } } : {};
    const cols = await SoundCollection.find(q).sort({ displayOrder: 1, createdAt: 1 }).lean();
    const withCounts = await Promise.all(cols.map(async c => ({
      ...c,
      cardCount: await SoundCard.countDocuments({ collectionId: c._id }),
    })));
    res.json({ success: true, collections: withCounts });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/collections', async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    const last = await SoundCollection.findOne().sort({ displayOrder: -1 }).lean();
    const col = await SoundCollection.create({ name, icon: icon || '', description: description || '', isActive: true, displayOrder: (last?.displayOrder ?? -1) + 1 });
    res.status(201).json({ success: true, collection: col });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/collections/:id', async (req, res) => {
  try {
    const updates = { ...req.body }; delete updates.createdAt; delete updates.updatedAt;
    const col = await SoundCollection.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!col) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, collection: col });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/collections/:id', async (req, res) => {
  try {
    const col = await SoundCollection.findByIdAndDelete(req.params.id);
    if (!col) return res.status(404).json({ success: false, message: 'Not found' });
    await SoundCard.deleteMany({ collectionId: req.params.id });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/collections/reorder', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) return res.status(400).json({ success: false, message: 'ids must be array' });
    await Promise.all(ids.map((id, i) => SoundCollection.findByIdAndUpdate(id, { displayOrder: i })));
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// SOUND CARDS
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/healing-frequencies/cards
// Supports: ?collectionSlug=<slug> | ?collectionId=<id> | ?moodSlug=<slug>
// With pagination: ?page=1&limit=6
router.get('/cards', async (req, res) => {
  try {
    const { collectionId, collectionSlug, moodSlug, page = 1, limit = 6 } = req.query;
    const q = { status: 'Active' };
    if (moodSlug) q.moodSlug = moodSlug;
    else if (collectionSlug) q.collectionSlug = collectionSlug;
    else if (collectionId) q.collectionId = collectionId;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [cards, total] = await Promise.all([
      SoundCard.find(q).sort({ displayOrder: 1, createdAt: 1 }).skip(skip).limit(parseInt(limit)).lean(),
      SoundCard.countDocuments(q),
    ]);
    res.json({ success: true, cards, total, page: parseInt(page), limit: parseInt(limit), hasMore: skip + cards.length < total });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// GET /api/healing-frequencies/cards/all — admin, all cards
router.get('/cards/all', async (req, res) => {
  try {
    const { collectionId, collectionSlug, moodSlug, search } = req.query;
    const q = {};
    if (moodSlug) q.moodSlug = moodSlug;
    else if (collectionSlug) q.collectionSlug = collectionSlug;
    else if (collectionId) q.collectionId = collectionId;
    if (search) q.title = { $regex: search, $options: 'i' };
    const cards = await SoundCard.find(q).sort({ displayOrder: 1, createdAt: 1 }).lean();
    res.json({ success: true, cards });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// POST /api/healing-frequencies/cards
router.post('/cards', async (req, res) => {
  try {
    const { collectionId, collectionSlug, moodSlug, title, description, artist, coverImage, audioUrl, frequency, tag, duration, category, status } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'title is required' });
    if (!collectionId && !collectionSlug && !moodSlug) return res.status(400).json({ success: false, message: 'collectionId, collectionSlug, or moodSlug is required' });

    // Build query for last card in this bucket
    const lastQ = moodSlug ? { moodSlug } : collectionSlug ? { collectionSlug } : { collectionId };
    const last = await SoundCard.findOne(lastQ).sort({ displayOrder: -1 }).lean();

    const card = await SoundCard.create({
      collectionId: collectionId || null,
      collectionSlug: collectionSlug || '',
      moodSlug: moodSlug || '',
      title, description: description || '', artist: artist || '',
      coverImage: coverImage || '', audioUrl: audioUrl || '',
      frequency: frequency || '', tag: tag || '',
      duration: duration || '', category: category || '',
      status: status || 'Draft',
      displayOrder: (last?.displayOrder ?? -1) + 1,
    });
    res.status(201).json({ success: true, card });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// POST /api/healing-frequencies/cards/:id/duplicate
router.post('/cards/:id/duplicate', async (req, res) => {
  try {
    const original = await SoundCard.findById(req.params.id).lean();
    if (!original) return res.status(404).json({ success: false, message: 'Not found' });
    const lastQ = original.collectionSlug ? { collectionSlug: original.collectionSlug } : { collectionId: original.collectionId };
    const last = await SoundCard.findOne(lastQ).sort({ displayOrder: -1 }).lean();
    const { _id, createdAt, updatedAt, ...rest } = original;
    const dup = await SoundCard.create({ ...rest, title: `${rest.title} (Copy)`, status: 'Draft', displayOrder: (last?.displayOrder ?? -1) + 1 });
    res.status(201).json({ success: true, card: dup });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// PUT /api/healing-frequencies/cards/:id
router.put('/cards/:id', async (req, res) => {
  try {
    const updates = { ...req.body }; delete updates.createdAt; delete updates.updatedAt;
    const card = await SoundCard.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!card) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, card });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// DELETE /api/healing-frequencies/cards/:id
router.delete('/cards/:id', async (req, res) => {
  try {
    const card = await SoundCard.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// POST /api/healing-frequencies/cards/reorder
router.post('/cards/reorder', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) return res.status(400).json({ success: false, message: 'ids must be array' });
    await Promise.all(ids.map((id, i) => SoundCard.findByIdAndUpdate(id, { displayOrder: i })));
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
