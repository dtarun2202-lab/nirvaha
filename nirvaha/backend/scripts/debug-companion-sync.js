require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const CompanionApplication = require('../models/CompanionApplication');
const { resolveAndPersistCompanionForUser } = require('../utils/companionStatus');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const approved = await CompanionApplication.find({
    status: { $regex: /^approved$/i },
  }).lean();

  console.log('\n=== APPROVED APPLICATIONS ===');
  for (const a of approved) {
    console.log({ id: a.id, email: a.email, fullName: a.fullName, status: a.status });
  }

  console.log('\n=== USERS WITH COMPANION FLAGS ===');
  const usersWithFlags = await User.find({
    $or: [{ isApprovedCompanion: true }, { companionStatus: 'approved' }],
  })
    .select('id email name isApprovedCompanion companionStatus companionId')
    .lean();
  console.log(usersWithFlags);

  console.log('\n=== ALL USERS (email + flags) ===');
  const allUsers = await User.find({})
    .select('email name isApprovedCompanion companionStatus')
    .lean();
  for (const u of allUsers) {
    console.log(u);
  }

  for (const app of approved) {
    const email = (app.email || '').trim().toLowerCase();
    const user = await User.findOne({
      $or: [
        { email },
        { email: { $regex: new RegExp(`^${(app.email || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
      ],
    }).lean();
    console.log('\n--- Match for application', app.email, '---');
    console.log('User found:', user ? { email: user.email, isApprovedCompanion: user.isApprovedCompanion, companionStatus: user.companionStatus } : 'NONE');
    if (user) {
      const resolved = await resolveAndPersistCompanionForUser({ email: user.email, name: user.name });
      console.log('After resolveAndPersist:', resolved);
      const refreshed = await User.findOne({ id: user.id }).lean();
      console.log('User after sync:', { isApprovedCompanion: refreshed.isApprovedCompanion, companionStatus: refreshed.companionStatus });
    }
  }

  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
