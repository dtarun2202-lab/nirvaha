/**
 * update_seeded_images.js
 *
 * Updates the coverImage field ONLY for 3 seeded SoundCard records.
 * No other fields are touched. Safe to re-run (idempotent).
 *
 * Cards updated:
 *   stress       — Forest Rain
 *   anxiety      — Gentle Rain Drops
 *   focus        — Minimal Nature Sounds
 */

'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const SoundCard = require('../models/SoundCard');

const UPDATES = [
  {
    _id:      '6a1c1308050dac7dae0321c9',
    moodSlug: 'stress',
    title:    'Forest Rain',
    newImage: '/images/Forest Rain.jpg',
  },
  {
    _id:      '6a1c130a050dac7dae0321cf',
    moodSlug: 'anxiety',
    title:    'Gentle Rain Drops',
    newImage: '/images/Gentle Rain Drops.jpg',
  },
  {
    _id:      '6a1c130c050dac7dae0321e4',
    moodSlug: 'focus',
    title:    'Minimal Nature Sounds',
    newImage: '/images/Minimal Nature Sounds.jpg',
  },
];

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('❌  MONGODB_URI not found'); process.exit(1); }

  console.log('🔌  Connecting to MongoDB…');
  await mongoose.connect(uri);
  console.log('✅  Connected.\n');

  for (const u of UPDATES) {
    const result = await SoundCard.findOneAndUpdate(
      { _id: u._id, moodSlug: u.moodSlug, title: u.title },
      { $set: { coverImage: u.newImage } },
      { new: true }
    ).lean();

    if (result) {
      console.log(`✅  Updated [${u.moodSlug}] "${u.title}"`);
      console.log(`     coverImage → ${result.coverImage}`);
    } else {
      console.log(`⚠️   Not found: [${u.moodSlug}] "${u.title}" (_id: ${u._id})`);
    }
  }

  // Verification read
  console.log('\n📊  Verification:\n');
  for (const u of UPDATES) {
    const doc = await SoundCard.findById(u._id).select('title moodSlug coverImage').lean();
    if (doc) {
      console.log(`  [${doc.moodSlug}] "${doc.title}"`);
      console.log(`    coverImage: ${doc.coverImage}`);
    }
  }

  console.log('\n✅  Done.\n');
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('❌  Error:', err.message);
  process.exit(1);
});
