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
    const { id } = req.params;
    let request = await MarketplaceRequest.findOne({ id: id });
    if (!request && id.match(/^[0-9a-fA-F]{24}$/)) {
      request = await MarketplaceRequest.findById(id);
    }

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request.status = 'approved';
    request.approvedAt = new Date();
    request.approvedBy = req.body.approvedBy || 'admin';
    await request.save();

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
    const { id } = req.params;
    let request = await MarketplaceRequest.findOneAndDelete({ id: id });
    if (!request && id.match(/^[0-9a-fA-F]{24}$/)) {
      request = await MarketplaceRequest.findByIdAndDelete(id);
    }

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('marketplace-request-deleted', { id: id });

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
    const { id } = req.params;
    let item = await MarketplaceItem.findOne({ id: id });
    if (!item && id.match(/^[0-9a-fA-F]{24}$/)) {
      item = await MarketplaceItem.findById(id);
    }

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    item.status = 'completed';
    item.completedAt = new Date();
    item.completedBy = req.body.completedBy || 'admin';
    await item.save();

    const io = req.app.get('io');
    io.emit('marketplace-item-completed', { id: id });

    return res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all marketplace items (admin view)
router.get('/items/all', async (req, res) => {
  try {
    const items = await MarketplaceItem.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST direct marketplace item (admin only)
router.post('/items', async (req, res) => {
  try {
    const { type, status, data, approvedBy } = req.body;
    const item = new MarketplaceItem({
      requestId: req.body.requestId || `admin-${uuidv4()}`,
      type,
      status: status || 'active',
      data,
      approvedAt: new Date(),
      approvedBy: approvedBy || 'admin',
    });
    await item.save();
    return res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update marketplace item
router.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let item = await MarketplaceItem.findOne({ id: id });
    if (!item && id.match(/^[0-9a-fA-F]{24}$/)) {
      item = await MarketplaceItem.findById(id);
    }

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (req.body.status) item.status = req.body.status;
    if (req.body.data) item.data = { ...item.data, ...req.body.data };
    
    await item.save();
    return res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE marketplace item
router.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let item = await MarketplaceItem.findOneAndDelete({ id: id });
    if (!item && id.match(/^[0-9a-fA-F]{24}$/)) {
      item = await MarketplaceItem.findByIdAndDelete(id);
    }

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    return res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
