const express = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { sendSessionConfirmationEmail, sendSessionRejectedEmail } = require('../utils/email');

const router = express.Router();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Helper: Safely resolve a user/companion reference to a valid
// MongoDB ObjectId. Returns null if unresolvable (mock/demo IDs).
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function safeResolveObjectId(reference) {
  if (!reference || String(reference).trim() === '') return null;
  // Already a valid 24-char hex ObjectId
  if (mongoose.Types.ObjectId.isValid(reference) && String(reference).match(/^[0-9a-fA-F]{24}$/)) {
    return new mongoose.Types.ObjectId(reference);
  }
  // Try looking up by custom uuid `id` field on the User collection
  try {
    const lookup = await User.findOne({ id: reference }).select('_id').lean();
    return lookup?._id || null;
  } catch {
    return null;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Helper: Sanitize a booking payload so that userId and
// companionId are either valid ObjectIds or completely removed.
// Invalid/mock IDs are preserved in legacyUserId / legacyCompanionId.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function sanitizeBookingPayload(payload) {
  // --- userId ---
  const rawUserId = payload.userId;
  delete payload.userId; // always delete first to prevent BSON crash
  if (rawUserId && String(rawUserId).trim() !== '') {
    const resolved = await safeResolveObjectId(rawUserId);
    if (resolved) {
      payload.userId = resolved;
    } else {
      payload.legacyUserId = String(rawUserId);
    }
  }

  // --- companionId ---
  const rawCompanionId = payload.companionId;
  delete payload.companionId; // always delete first to prevent BSON crash
  if (rawCompanionId && String(rawCompanionId).trim() !== '') {
    const resolved = await safeResolveObjectId(rawCompanionId);
    if (resolved) {
      payload.companionId = resolved;
    } else {
      payload.legacyCompanionId = String(rawCompanionId);
    }
  }

  return payload;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// POST /  —  Create new booking (crash-proof)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/', async (req, res) => {
  try {
    // --- Force sanitization of IDs before creating a booking ---
    // Capture incoming IDs
    const incomingUserId = req.body.userId;
    const incomingCompanionId = req.body.companionId;
    // Remove raw ID fields to avoid Mongoose CastError
    delete req.body.userId;
    delete req.body.companionId;

    // Re‑add only valid ObjectIds or store as legacy fields
    if (incomingUserId && String(incomingUserId).trim() !== '') {
      if (mongoose.Types.ObjectId.isValid(incomingUserId)) {
        req.body.userId = incomingUserId;
      } else {
        req.body.legacyUserId = incomingUserId;
      }
    }
    if (incomingCompanionId && String(incomingCompanionId).trim() !== '') {
      if (mongoose.Types.ObjectId.isValid(incomingCompanionId)) {
        req.body.companionId = incomingCompanionId;
      } else {
        req.body.legacyCompanionId = incomingCompanionId;
      }
    }

    const isProduct = req.body.type === 'product' || req.body.type === 'Product';
    // Build the payload (now safe) – note that userId/companionId fields are already sanitized
    const bookingPayload = {
      ...req.body,
      status: req.body.status || (isProduct ? 'completed' : 'Pending'),
      sessionType: req.body.sessionType || req.body.type || '',
      assignedAt: req.body.assignedAt ? new Date(req.body.assignedAt) : undefined,
      createdAt: new Date(),
      id: req.body.id || uuidv4(),
    };
    console.log('FINAL SANITIZED BOOKING PAYLOAD:', bookingPayload);

    // Create the booking document in MongoDB
    const booking = await Booking.create(bookingPayload);

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.emit('booking-created', booking);
    }
    
    console.log(`✅ [BOOKING] Created: id="${booking.id}", userId=${booking.userId || booking.legacyUserId || 'none'}, companionId=${booking.companionId || booking.legacyCompanionId || 'none'}`);

    // Respond to client
    res.json({
      success: true,
      message: 'Booking Created',
      data: booking,
    });
    return; // prevent fall‑through
  } catch (error) {
    console.error('❌ [BOOKING] Create error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PUT /:id/status  —  Update booking status (admin, crash-proof)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, companionId } = req.body;

    console.log(`📋 [BOOKING] Status update request: id="${id}", status="${status}", companionId="${companionId}"`);

    // Safely build query — avoid Mongoose CastError when id is a UUID (not a valid ObjectId)
    const orConditions = [{ id: id }];
    if (mongoose.Types.ObjectId.isValid(id) && String(id).match(/^[0-9a-fA-F]{24}$/)) {
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
    
    // ✅ Safely resolve companionId assignment
    if (companionId) {
      const resolvedCompanionId = await safeResolveObjectId(companionId);
      if (resolvedCompanionId) {
        booking.companionId = resolvedCompanionId;
        booking.assignedAt = booking.assignedAt || new Date();
        console.log(`✅ [BOOKING] Assigned to companion MongoDB _id: ${booking.companionId}`);
      } else {
        booking.legacyCompanionId = String(companionId);
        booking.companionId = undefined;
        console.warn(`⚠️  [BOOKING] Companion user not found for: ${companionId}, saving as legacyCompanionId`);
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

    // Trigger confirmation email when status transitions to "Session Confirmed" or "Approved"
    if ((status === 'Session Confirmed' || status === 'Approved') && oldStatus !== 'Session Confirmed' && oldStatus !== 'Approved') {
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PUT /:id  —  Update booking (general, crash-proof)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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

    // ✅ Sanitize any incoming companionId/userId in the update body
    const updateBody = { ...req.body };
    if (updateBody.companionId) {
      const resolved = await safeResolveObjectId(updateBody.companionId);
      if (resolved) {
        updateBody.companionId = resolved;
      } else {
        updateBody.legacyCompanionId = String(updateBody.companionId);
        delete updateBody.companionId;
      }
    }
    if (updateBody.userId) {
      const resolved = await safeResolveObjectId(updateBody.userId);
      if (resolved) {
        updateBody.userId = resolved;
      } else {
        updateBody.legacyUserId = String(updateBody.userId);
        delete updateBody.userId;
      }
    }

    Object.assign(booking, updateBody);
    await booking.save();

    // Emit update event
    const io = req.app.get('io');
    if (io) {
      io.emit('booking-updated', booking);
    }

    if ((booking.status === 'Session Confirmed' || booking.status === 'Approved') && oldStatus !== 'Session Confirmed' && oldStatus !== 'Approved') {
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
    console.error('❌ [BOOKING] Update error:', error.message);
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
    if (io) {
      io.emit('booking-deleted', { id: id });
    }

    res.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
