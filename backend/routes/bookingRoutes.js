const express = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { sendSessionConfirmationEmail, sendSessionRejectedEmail } = require('../utils/email');

const router = express.Router();

// Create new booking
router.post('/', async (req, res) => {
  try {
    const isProduct = req.body.type === 'product' || req.body.type === 'Product';

    const resolveUserReference = async (reference) => {
      if (!reference) return undefined;
      if (mongoose.Types.ObjectId.isValid(reference)) return mongoose.Types.ObjectId(reference);
      const lookup = await User.findOne({ id: reference }).select('_id').lean();
      return lookup?._id;
    };

    const bookingPayload = {
      ...req.body,
      status:
        req.body.status ||
        (isProduct ? 'completed' : 'Pending Approval'),
      sessionType: req.body.sessionType || req.body.type || '',
      assignedAt: req.body.assignedAt ? new Date(req.body.assignedAt) : undefined,
      createdAt: req.body.createdAt ? new Date(req.body.createdAt) : new Date(),
      id: req.body.id || uuidv4(),
    };

    if (req.body.userId) {
      const resolvedUserId = await resolveUserReference(req.body.userId);
      if (resolvedUserId) {
        bookingPayload.userId = resolvedUserId;
      } else {
        bookingPayload.legacyUserId = req.body.userId;
      }
    }

    if (req.body.companionId) {
      const resolvedCompanionId = await resolveUserReference(req.body.companionId);
      if (resolvedCompanionId) {
        bookingPayload.companionId = resolvedCompanionId;
      } else {
        bookingPayload.legacyCompanionId = req.body.companionId;
      }
    }

    const booking = await Booking.create(bookingPayload);
    
    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.emit('booking-created', booking);
    }
    
    res.json({
      success: true,
      message: 'Booking Created',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status (admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, companionId } = req.body;

    console.log(`📋 [BOOKING] Status update request: id="${id}", status="${status}", companionId="${companionId}"`);

    // Safely build query — avoid Mongoose CastError when id is a UUID (not a valid ObjectId)
    const mongoose = require('mongoose');
    const User = require('../models/User');
    const orConditions = [{ id: id }];
    if (mongoose.Types.ObjectId.isValid(id)) {
      orConditions.push({ _id: id });
    }

    const booking = await Booking.findOne({ $or: orConditions });

    if (!booking) {
      console.warn(`⚠️  [BOOKING] Not found: id="${id}"`);
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    console.log(`✅ [BOOKING] Found booking: ${booking.id}, current status: "${booking.status}"`);

    const oldStatus = booking.status;
    booking.status = status;
    if (req.body.date) booking.date = req.body.date;
    if (req.body.time) booking.time = req.body.time;
    if (req.body.sessionNotes) booking.sessionNotes = req.body.sessionNotes;
    
    if (companionId) {
      let resolvedCompanionId = null;
      if (mongoose.Types.ObjectId.isValid(companionId)) {
        resolvedCompanionId = companionId;
      } else {
        const companionUser = await User.findOne({ id: companionId }).select('_id').lean();
        resolvedCompanionId = companionUser?._id?.toString() || null;
      }

      if (resolvedCompanionId) {
        booking.companionId = mongoose.Types.ObjectId(resolvedCompanionId);
        booking.assignedAt = booking.assignedAt || new Date();
        console.log(`✅ [BOOKING] Assigned to companion MongoDB _id: ${booking.companionId}`);
      } else {
        booking.legacyCompanionId = companionId;
        console.warn(`⚠️  [BOOKING] Companion user not found for UUID: ${companionId}, saving legacy companionId`);
      }
    }

    if (req.body.sessionType) {
      booking.sessionType = req.body.sessionType;
    } else if (req.body.type) {
      booking.sessionType = req.body.type;
    }

    if (booking.companionId && !booking.assignedAt && String(status).toLowerCase().includes('confirmed')) {
      booking.assignedAt = new Date();
    }

    await booking.save();

    console.log(`✅ [BOOKING] Status updated: "${oldStatus}" → "${status}" (date: "${booking.date}", time: "${booking.time}", companionId: "${booking.companionId}")`);

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.emit('booking-updated', booking);
    }

    // Trigger confirmation email when status transitions to "Session Confirmed"
    if (status === 'Session Confirmed' && oldStatus !== 'Session Confirmed') {
      console.log(`📧 [BOOKING] Triggering confirmation email to: ${booking.userEmail || booking.email}`);
      try {
        await sendSessionConfirmationEmail(booking);
      } catch (emailError) {
        console.error('❌ Email trigger failure in route:', emailError.message);
      }
    } else if (status === 'rejected' && oldStatus !== 'rejected') {
      console.log(`📧 [BOOKING] Triggering rejection email to: ${booking.userEmail || booking.email}`);
      try {
        await sendSessionRejectedEmail(booking);
      } catch (emailError) {
        console.error('❌ Email trigger failure in route:', emailError.message);
      }
    }

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking,
    });
  } catch (error) {
    console.error('❌ [BOOKING] Status update error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get all bookings (admin)
router.get('/', async (req, res) => {
  try {
    const data = await Booking.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bookings by user email
router.get('/user/:email', async (req, res) => {
  try {
    const data = await Booking.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Try finding by custom id first, then by MongoDB _id
    let booking = await Booking.findOne({ id: id });
    
    if (!booking && id.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Booking.findById(id);
    }

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const oldStatus = booking.status;
    Object.assign(booking, req.body);
    await booking.save();

    // Emit update event
    const io = req.app.get('io');
    io.emit('booking-updated', booking);

    if (booking.status === 'Session Confirmed' && oldStatus !== 'Session Confirmed') {
      console.log(`📧 [BOOKING] Triggering confirmation email to: ${booking.userEmail || booking.email}`);
      try {
        await sendSessionConfirmationEmail(booking);
      } catch (emailError) {
        console.error('❌ Email trigger failure in route:', emailError.message);
      }
    } else if (booking.status === 'rejected' && oldStatus !== 'rejected') {
      console.log(`📧 [BOOKING] Triggering rejection email to: ${booking.userEmail || booking.email}`);
      try {
        await sendSessionRejectedEmail(booking);
      } catch (emailError) {
        console.error('❌ Email trigger failure in route:', emailError.message);
      }
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let booking = await Booking.findOneAndDelete({ id: id });
    
    if (!booking && id.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Booking.findByIdAndDelete(id);
    }

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const io = req.app.get('io');
    io.emit('booking-deleted', { id: id });

    res.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
