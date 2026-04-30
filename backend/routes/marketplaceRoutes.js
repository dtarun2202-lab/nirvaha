const express = require('express');
const { v4: uuidv4 } = require('uuid');
const MarketplaceRequest = require('../models/MarketplaceRequest');
const MarketplaceItem = require('../models/MarketplaceItem');

const router = express.Router();

// GET all marketplace requests (admin only)
router.get('/requests', async (req, res) => {
  try {
    const requests = await MarketplaceRequest.find().sort({ createdAt: -1 });
    return res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single marketplace request
router.get('/requests/:id', async (req, res) => {
  try {
    const request = await MarketplaceRequest.findOne({ id: req.params.id });
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    return res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new marketplace request
router.post('/requests', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (!type || !data) {
      return res.status(400).json({ error: 'Type and data are required' });
    }

    const request = new MarketplaceRequest({
      type,
      data,
      status: 'pending',
      userId: req.body.userId || '',
    });

    await request.save();

    // Emit real-time update to admin
    const io = req.app.get('io');
    io.emit('marketplace-new-request', request);

    return res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT approve marketplace request (admin only)
router.put('/requests/:id/approve', async (req, res) => {
  try {
    const request = await MarketplaceRequest.findOneAndUpdate(
      { id: req.params.id },
      {
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: req.body.approvedBy || 'admin',
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const existingItem = await MarketplaceItem.findOne({
      requestId: request.id,
    });
    if (!existingItem) {
      const item = new MarketplaceItem({
        requestId: request.id,
        type: request.type,
        status: 'active',
        data: request.data,
        approvedAt: request.approvedAt || new Date(),
        approvedBy: request.approvedBy || 'admin',
      });
      await item.save();
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('marketplace-request-approved', request);
    io.emit('marketplace-item-created', { requestId: request.id });

    return res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE marketplace request
router.delete('/requests/:id', async (req, res) => {
  try {
    const request = await MarketplaceRequest.findOneAndDelete({
      id: req.params.id,
    });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('marketplace-request-deleted', { id: req.params.id });

    return res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET approved marketplace items for user dashboard
router.get('/items', async (req, res) => {
  try {
    const status = req.query.status || 'active';

    const items = await MarketplaceItem.find({ status }).sort({
      createdAt: -1,
    });
    return res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT complete marketplace item (removes from user dashboard)
router.put('/items/:id/complete', async (req, res) => {
  try {
    const item = await MarketplaceItem.findOneAndUpdate(
      { id: req.params.id },
      {
        status: 'completed',
        completedAt: new Date(),
        completedBy: req.body.completedBy || 'admin',
      },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const io = req.app.get('io');
    io.emit('marketplace-item-completed', { id: req.params.id });

    return res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
