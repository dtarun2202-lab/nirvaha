const express = require('express');
const Pose = require('../models/Pose');

const router = express.Router();

// Get all poses (with optional search)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search && search.trim()) {
      const term = search.trim();
      query = {
        $or: [
          { name: { $regex: term, $options: 'i' } },
          { sanskritName: { $regex: term, $options: 'i' } },
          { category: { $regex: term, $options: 'i' } },
          { shortCaption: { $regex: term, $options: 'i' } },
        ],
      };
    }

    const poses = await Pose.find(query).sort({ position: 1, createdAt: -1 }).lean();
    const BASE = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5001}`;
    const toAbsolute = (url) => {
      if (!url) return '';
      if (url.startsWith('http')) return url;
      return `${BASE}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    res.json(
      poses.map((p) => ({
        id: p.id,
        name: p.name,
        sanskritName: p.sanskritName || '',
        poseNumber: p.poseNumber || 0,
        category: p.category || '',
        shortCaption: p.shortCaption || '',
        shortIntro: p.shortIntro || '',
        spiritualEssence: p.spiritualEssence || '',
        ancientOrigin: p.ancientOrigin || '',
        mentalBenefits: Array.isArray(p.mentalBenefits) ? p.mentalBenefits : [],
        physicalBenefits: Array.isArray(p.physicalBenefits) ? p.physicalBenefits : [],
        chakraName: p.chakraName || '',
        chakraDescription: p.chakraDescription || '',
        imageUrl: toAbsolute(p.imageUrl || ''),
        set: p.set || 'Set 1',
        position: p.position || 0,
        status: p.status || 'Draft',
        show: !!p.show,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create pose
router.post('/', async (req, res) => {
  const {
    name,
    sanskritName,
    poseNumber,
    category,
    shortCaption,
    shortIntro,
    spiritualEssence,
    ancientOrigin,
    mentalBenefits,
    physicalBenefits,
    chakraName,
    chakraDescription,
    imageUrl,
    set,
    position,
    status,
    show,
  } = req.body || {};

  if (!name) return res.status(400).json({ error: 'name is required' });

  try {
    const created = await Pose.create({
      name,
      sanskritName: sanskritName || '',
      poseNumber: poseNumber || 0,
      category: category || '',
      shortCaption: shortCaption || '',
      shortIntro: shortIntro || '',
      spiritualEssence: spiritualEssence || '',
      ancientOrigin: ancientOrigin || '',
      mentalBenefits: Array.isArray(mentalBenefits) ? mentalBenefits : [],
      physicalBenefits: Array.isArray(physicalBenefits) ? physicalBenefits : [],
      chakraName: chakraName || '',
      chakraDescription: chakraDescription || '',
      imageUrl: imageUrl || '',
      set: set || 'Set 1',
      position: position || 0,
      status: status || 'Draft',
      show: show !== undefined ? !!show : true,
    });

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update pose
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const body = req.body || {};
  try {
    const updated = await Pose.findOneAndUpdate({ id }, body, { new: true, runValidators: true, timestamps: true });
    if (!updated) return res.status(404).json({ error: 'pose not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete pose
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Pose.deleteOne({ id });
    if (deleted.deletedCount === 0) return res.status(404).json({ error: 'pose not found' });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
