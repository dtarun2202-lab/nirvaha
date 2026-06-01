const express = require('express');
const router = express.Router();
const EssentialGuidance = require('../models/EssentialGuidance');

// GET /api/essential-guidance — public, returns active cards sorted by displayOrder
router.get('/', async (req, res) => {
  try {
    const cards = await EssentialGuidance.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();
    res.json({ success: true, cards, count: cards.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching guidance cards', error: error.message });
  }
});

// GET /api/essential-guidance/all — admin, returns all cards
router.get('/all', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search && search.trim()) {
      query = { title: { $regex: search.trim(), $options: 'i' } };
    }
    const cards = await EssentialGuidance.find(query)
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();
    res.json({ success: true, cards, count: cards.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching all guidance cards', error: error.message });
  }
});

// GET /api/essential-guidance/:id — single card
router.get('/:id', async (req, res) => {
  try {
    const card = await EssentialGuidance.findById(req.params.id);
    if (!card) return res.status(404).json({ success: false, message: 'Card not found' });
    res.json({ success: true, card });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching card', error: error.message });
  }
});

// POST /api/essential-guidance — create
router.post('/', async (req, res) => {
  try {
    const { title, image, step1, step2, step3, step4, step5, quoteText, breathingPattern } = req.body;

    if (!title || !image) {
      return res.status(400).json({ success: false, message: 'Title and image are required' });
    }

    const last = await EssentialGuidance.findOne().sort({ displayOrder: -1 }).lean();
    const nextOrder = (last?.displayOrder ?? -1) + 1;

    const card = new EssentialGuidance({
      title,
      image,
      displayOrder: nextOrder,
      isActive: true,
      step1: step1 || '',
      step2: step2 || '',
      step3: step3 || '',
      step4: step4 || '',
      step5: step5 || '',
      quoteText: quoteText || '',
      breathingPattern: breathingPattern || '',
    });

    await card.save();
    res.status(201).json({ success: true, message: 'Guidance card created successfully', card });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating guidance card', error: error.message });
  }
});

// PUT /api/essential-guidance/:id — update
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates.createdAt;
    delete updates.updatedAt;

    const card = await EssentialGuidance.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!card) return res.status(404).json({ success: false, message: 'Card not found' });
    res.json({ success: true, message: 'Guidance card updated successfully', card });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating guidance card', error: error.message });
  }
});

// DELETE /api/essential-guidance/:id — permanent delete
router.delete('/:id', async (req, res) => {
  try {
    const card = await EssentialGuidance.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).json({ success: false, message: 'Card not found' });
    res.json({ success: true, message: 'Guidance card deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting guidance card', error: error.message });
  }
});

// POST /api/essential-guidance/reorder — reorder cards
router.post('/reorder', async (req, res) => {
  try {
    const { cardIds } = req.body;
    if (!Array.isArray(cardIds)) {
      return res.status(400).json({ success: false, message: 'cardIds must be an array' });
    }

    const updatePromises = cardIds.map((id, index) =>
      EssentialGuidance.findByIdAndUpdate(id, { displayOrder: index, updatedAt: Date.now() })
    );
    await Promise.all(updatePromises);

    const cards = await EssentialGuidance.find().sort({ displayOrder: 1 });
    res.json({ success: true, message: 'Cards reordered successfully', cards });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error reordering cards', error: error.message });
  }
});

module.exports = router;
