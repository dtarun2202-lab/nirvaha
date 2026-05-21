const CompanionApplication = require('../models/CompanionApplication');
const User = require('../models/User');

function normalizeStatus(status) {
  return String(status || '').trim().toLowerCase();
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function findUserForCompanionSync({ email, name }) {
  const emailLower = normalizeEmail(email);
  if (emailLower) {
    let user = await User.findOne({ email: emailLower });
    if (!user) {
      user = await User.findOne({
        email: { $regex: new RegExp(`^${escapeRegex(email)}$`, 'i') },
      });
    }
    if (user) return user;
  }

  if (name) {
    const escaped = escapeRegex(name.trim());
    const user = await User.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${escaped}$`, 'i') } },
        { name: name.trim() },
      ],
    });
    if (user) return user;
  }

  return null;
}

/**
 * Resolve companion approval from CompanionApplication (email + display name).
 */
async function getCompanionStatusForUser({ email, name }) {
  if (!email && !name) {
    return { isApprovedCompanion: false, companionStatus: null, companionId: null };
  }

  const emailLower = normalizeEmail(email);
  let app = null;

  if (emailLower) {
    app = await CompanionApplication.findOne({ email: emailLower }).lean();
    if (!app) {
      app = await CompanionApplication.findOne({
        email: { $regex: new RegExp(`^${escapeRegex(email)}$`, 'i') },
      }).lean();
    }
  }

  if (!app && name) {
    const escaped = escapeRegex(name.trim());
    app = await CompanionApplication.findOne({
      $or: [
        { fullName: { $regex: new RegExp(`^${escaped}$`, 'i') } },
        { fullName: name.trim() },
      ],
    }).lean();
  }

  if (!app) {
    return { isApprovedCompanion: false, companionStatus: null, companionId: null };
  }

  const statusNorm = normalizeStatus(app.status);
  const isApproved = statusNorm === 'approved';
  return {
    isApprovedCompanion: isApproved,
    companionStatus: isApproved ? 'approved' : (app.status || 'pending'),
    companionId: app.id,
  };
}

/**
 * Persist companion approval onto the User document (source of truth for /api/auth/user).
 */
async function persistCompanionApprovalToUser(email, companionMeta, options = {}) {
  const meta = companionMeta || {
    isApprovedCompanion: false,
    companionStatus: null,
    companionId: null,
  };

  const user = await findUserForCompanionSync({
    email: email || options.fallbackEmail,
    name: options.fallbackName,
  });

  if (!user) {
    console.warn(
      `[companion-sync] No User account found for application email="${email}" name="${options.fallbackName || ''}". ` +
        'User must register with the same email as the companion application.'
    );
    return meta;
  }

  const isApproved = meta.isApprovedCompanion === true;
  const companionStatus = isApproved ? 'approved' : (meta.companionStatus || null);

  await User.findOneAndUpdate(
    { id: user.id },
    {
      $set: {
        isApprovedCompanion: isApproved,
        companionStatus,
        companionId: meta.companionId || null,
      },
    },
    { new: true }
  );

  console.log(
    `[companion-sync] Updated user ${user.email} → isApprovedCompanion=${isApproved} companionStatus=${companionStatus}`
  );

  return {
    isApprovedCompanion: isApproved,
    companionStatus,
    companionId: meta.companionId || null,
  };
}

/**
 * Load from application, persist to User, return canonical auth fields.
 */
async function resolveAndPersistCompanionForUser({ email, name }) {
  const fromApplication = await getCompanionStatusForUser({ email, name });
  return persistCompanionApprovalToUser(email, fromApplication, { fallbackName: name });
}

/**
 * Backfill: sync every approved CompanionApplication → matching User document.
 */
async function syncAllApprovedCompanionsToUsers() {
  const approvedApps = await CompanionApplication.find({
    status: { $regex: /^approved$/i },
  }).lean();

  let synced = 0;
  for (const app of approvedApps) {
    await persistCompanionApprovalToUser(
      app.email,
      {
        isApprovedCompanion: true,
        companionStatus: 'approved',
        companionId: app.id,
      },
      { fallbackName: app.fullName }
    );
    synced += 1;
  }

  console.log(`[companion-sync] Backfilled ${synced} approved companion application(s) to User records`);
  return synced;
}

module.exports = {
  getCompanionStatusForUser,
  persistCompanionApprovalToUser,
  resolveAndPersistCompanionForUser,
  syncAllApprovedCompanionsToUsers,
  normalizeStatus,
  normalizeEmail,
};
