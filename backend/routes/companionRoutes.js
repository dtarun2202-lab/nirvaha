const express = require('express');
const CompanionApplication = require('../models/CompanionApplication');
const { authenticateJWT } = require('../middleware/auth');
const {
  getCompanionStatusForUser,
  persistCompanionApprovalToUser,
  resolveAndPersistCompanionForUser,
  normalizeStatus,
} = require('../utils/companionStatus');

const router = express.Router();

// Helper functions
function splitList(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function toAdminCompanion(app) {
  return {
    id: app.id,
    name: app.fullName,
    email: app.email,
    expertise: app.title,
    specialties: splitList(app.specialties),
    languages: splitList(app.languages),
    rating: 0,
    status: app.status || 'pending',
    appliedDate: app.submittedAt
      ? new Date(app.submittedAt).toISOString().split('T')[0]
      : '',
    bio: app.bio || '',
    profileImage: app.profileImage || '',
    coverImage: app.coverImage || '',
    location: app.location || '',
    pricing: {
      chat: Number.isFinite(app.callRate) ? app.callRate : 0,
      video: Number.isFinite(app.hourlyRate) ? app.hourlyRate : 0,
    },
    availability: splitList(app.availability),
  };
}

function toPublicCompanion(app) {
  return {
    id: app.id,
    name: app.fullName,
    title: app.title,
    avatar: app.profileImage || '',
    coverImage: app.coverImage || '',
    availability: app.availability || 'Available',
    rating: 4.8,
    reviews: 0,
    sessions: 0,
    location: app.location || '',
    bio: app.bio || '',
    specialties: splitList(app.specialties),
    hourlyRate: app.hourlyRate || 0,
    callRate: app.callRate || 0,
  };
}

// Current user's companion application status (authenticated)
router.get('/me/status', authenticateJWT, async (req, res) => {
  try {
    const status = await resolveAndPersistCompanionForUser({
      email: req.user.email,
      name: req.user.name,
    });
    res.json({ success: true, ...status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all companion applications (admin)
router.get('/applications', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const applications = await CompanionApplication.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    res.json(applications.map(toAdminCompanion));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single companion application
router.get('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const application = await CompanionApplication.findOne({ id }).lean();
    if (!application) {
      return res.status(404).json({ error: 'application not found' });
    }
    res.json({
      id: application.id,
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      title: application.title,
      bio: application.bio,
      experience: application.experience,
      location: application.location,
      languages: application.languages,
      specialties: application.specialties,
      certifications: application.certifications,
      hourlyRate: application.hourlyRate,
      callRate: application.callRate,
      availability: application.availability,
      profileImage: application.profileImage,
      coverImage: application.coverImage,
      website: application.website,
      socialLinks: application.socialLinks,
      whyJoin: application.whyJoin,
      status: application.status,
      submittedAt: application.submittedAt,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new companion application
router.post('/applications', async (req, res) => {
  try {
    console.log('📥 Incoming Companion Application:', req.body);
    const payload = req.body || {};
    const requiredFields = [
      'fullName',
      'email',
      'phone',
      'title',
      'bio',
      'experience',
      'location',
      'languages',
      'specialties',
      'whyJoin',
    ];
    
    const missing = requiredFields.filter((field) => {
      const val = payload[field];
      return val === undefined || val === null || val === '';
    });

    // Check rates separately to allow 0
    if (payload.hourlyRate === undefined || payload.hourlyRate === null || payload.hourlyRate === '') missing.push('hourlyRate');
    if (payload.callRate === undefined || payload.callRate === null || payload.callRate === '') missing.push('callRate');

    if (missing.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missing.join(', ')}`,
        fields: missing,
      });
    }

    const application = await CompanionApplication.create({
      fullName: payload.fullName,
      email: String(payload.email || '').trim().toLowerCase(),
      phone: payload.phone,
      title: payload.title,
      bio: payload.bio,
      experience: payload.experience,
      location: payload.location,
      languages: payload.languages,
      specialties: payload.specialties,
      certifications: payload.certifications || '',
      hourlyRate: Number(payload.hourlyRate) || 0,
      callRate: Number(payload.callRate) || 0,
      availability: payload.availability || '',
      profileImage: payload.profileImage || '',
      coverImage: payload.coverImage || '',
      website: payload.website || '',
      socialLinks: payload.socialLinks || '',
      whyJoin: payload.whyJoin,
      status: 'pending',
      submittedAt: new Date(),
    });

    // Emit real-time event for admin
    const io = req.app.get('io');
    io.emit('new-companion-request', {
      id: application.id,
      fullName: application.fullName,
      email: application.email,
      title: application.title,
      status: application.status,
      submittedAt: application.submittedAt,
    });

    res.status(201).json({
      id: application.id,
      status: application.status,
      submittedAt: application.submittedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update companion application
router.put('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body || {};

    const updated = await CompanionApplication.findOneAndUpdate(
      { id },
      {
        ...(payload.fullName !== undefined ? { fullName: payload.fullName } : {}),
        ...(payload.name !== undefined ? { fullName: payload.name } : {}),
        ...(payload.email !== undefined ? { email: payload.email } : {}),
        ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
        ...(payload.title !== undefined ? { title: payload.title } : {}),
        ...(payload.expertise !== undefined ? { title: payload.expertise } : {}),
        ...(payload.bio !== undefined ? { bio: payload.bio } : {}),
        ...(payload.experience !== undefined
          ? { experience: payload.experience }
          : {}),
        ...(payload.location !== undefined ? { location: payload.location } : {}),
        ...(payload.languages !== undefined
          ? { languages: payload.languages }
          : {}),
        ...(payload.specialties !== undefined
          ? { specialties: payload.specialties }
          : {}),
        ...(payload.certifications !== undefined
          ? { certifications: payload.certifications }
          : {}),
        ...(payload.hourlyRate !== undefined
          ? { hourlyRate: Number(payload.hourlyRate) || 0 }
          : {}),
        ...(payload.callRate !== undefined
          ? { callRate: Number(payload.callRate) || 0 }
          : {}),
        ...(payload.pricingChat !== undefined
          ? { callRate: Number(payload.pricingChat) || 0 }
          : {}),
        ...(payload.pricingVideo !== undefined
          ? { hourlyRate: Number(payload.pricingVideo) || 0 }
          : {}),
        ...(payload.availability !== undefined
          ? { availability: payload.availability }
          : {}),
        ...(payload.profileImage !== undefined
          ? { profileImage: payload.profileImage }
          : {}),
        ...(payload.coverImage !== undefined
          ? { coverImage: payload.coverImage }
          : {}),
        ...(payload.website !== undefined ? { website: payload.website } : {}),
        ...(payload.socialLinks !== undefined
          ? { socialLinks: payload.socialLinks }
          : {}),
        ...(payload.whyJoin !== undefined ? { whyJoin: payload.whyJoin } : {}),
        ...(payload.status !== undefined ? { status: payload.status } : {}),
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'application not found' });
    }

    if (payload.status !== undefined) {
      const statusNorm = normalizeStatus(updated.status);
      await persistCompanionApprovalToUser(
        updated.email,
        {
          isApprovedCompanion: statusNorm === 'approved',
          companionStatus: statusNorm === 'approved' ? 'approved' : updated.status,
          companionId: updated.id,
        },
        { fallbackName: updated.fullName }
      );
    }

    res.json(toAdminCompanion(updated));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update companion application status
router.patch('/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};
    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const updated = await CompanionApplication.findOneAndUpdate(
      { id },
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'application not found' });
    }

    const statusNorm = normalizeStatus(updated.status);
    const isApproved = statusNorm === 'approved';
    await persistCompanionApprovalToUser(
      updated.email,
      {
        isApprovedCompanion: isApproved,
        companionStatus: isApproved ? 'approved' : updated.status,
        companionId: updated.id,
      },
      { fallbackName: updated.fullName }
    );

    // Emit real-time status update
    const io = req.app.get('io');
    io.emit('request-status-updated', {
      id: updated.id,
      status: updated.status,
      fullName: updated.fullName,
      email: updated.email,
      isApprovedCompanion: isApproved,
      companionStatus: isApproved ? 'approved' : updated.status,
      updatedAt: updated.updatedAt,
    });

    res.json(toAdminCompanion(updated));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete companion application
router.delete('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CompanionApplication.deleteOne({ id });
    if (deleted.deletedCount === 0) {
      return res.status(404).json({ error: 'application not found' });
    }
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Backfill approved companion flags onto User documents (admin / recovery)
router.post('/sync-users', async (req, res) => {
  try {
    const { syncAllApprovedCompanionsToUsers } = require('../utils/companionStatus');
    const count = await syncAllApprovedCompanionsToUsers();
    res.json({ success: true, synced: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get companion sessions (authenticated endpoint)
// Returns all sessions assigned to the logged-in companion
router.get('/sessions', authenticateJWT, async (req, res) => {
  try {
    const Booking = require('../models/Booking');

    const loggedInUser = req.user;
    
    if (!loggedInUser) {
      console.warn('[COMPANION-SESSIONS] Authenticated user is missing from request');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const isApprovedCompanion = loggedInUser.isApprovedCompanion === true || loggedInUser.companionStatus === 'approved';
    
    if (!isApprovedCompanion) {
      console.warn(`[COMPANION-SESSIONS] User is not an approved companion: ${loggedInUser.email}`);
      return res.status(403).json({ error: 'User is not an approved companion' });
    }
    
    console.log('Logged-in Companion:', loggedInUser._id);
    console.log('Logged-in Companion Email:', loggedInUser.email);

    const sessions = await Booking.find({
      companionId: loggedInUser._id,
      $or: [
        { sessionType: { $regex: /^(session|video|chat)$/i } },
        { type: { $regex: /^(session|video|chat)$/i } }
      ]
    })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Fetched Sessions: ${sessions.length}`);
    sessions.forEach((session, idx) => {
      console.log(`Session ${idx}:`, {
        id: session.id,
        companionId: session.companionId,
        status: session.status,
        type: session.type,
        sessionType: session.sessionType,
      });
    });
    
    console.log(`[COMPANION-SESSIONS] Found ${sessions.length} sessions for companion`);
    sessions.forEach((s, idx) => {
      console.log(`  [${idx}] id=${s.id}, companionId=${s.companionId}, status=${s.status}, type=${s.type}`);
    });
    
    // Count by status
    const stats = {
      total: sessions.length,
      assigned: sessions.length,
      pending: sessions.filter(s => !s.status || s.status.toLowerCase().includes('pending')).length,
      confirmed: sessions.filter(s => s.status && s.status.toLowerCase() === 'session confirmed').length,
      completed: sessions.filter(s => s.status && s.status.toLowerCase() === 'completed').length,
    };
    
    res.json({
      success: true,
      data: sessions,
      stats,
    });
  } catch (error) {
    console.error('[COMPANION-SESSIONS] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get approved companions for public view
router.get('/', async (req, res) => {
  try {
    const approved = await CompanionApplication.find({ status: 'approved' })
      .sort({ updatedAt: -1 })
      .lean();
    res.json({
      success: true,
      data: approved.map(toPublicCompanion),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
