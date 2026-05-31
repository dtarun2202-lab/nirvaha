/**
 * read_seeded_ids.js  —  READ ONLY, no writes
 *
 * Retrieves the _id values of the 15 seeded Healing Frequencies cards.
 * Prints them grouped by moodSlug with title mapping.
 * Does not modify any records.
 */

'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const SoundCard = require('../models/SoundCard');

const SEEDED_TITLES_BY_SLUG = {
  'stress':            ['Ocean Waves Calm', 'Forest Rain', 'Tibetan Bowls'],
  'anxiety':           ['Gentle Rain Drops', 'Misty Forest Stream', 'Soft Meadow Breeze'],
  'sleep-issues':      ['Night Ocean Waves', 'Starlit Delta Waves', 'Moonlight Lullaby'],
  'focus':             ['Clear Mind Frequencies', 'Minimal Nature Sounds', 'Productivity Flow'],
  'emotional-balance': ['Chakra Harmony', 'Sacred Geometry', 'Healing Bowls'],
};

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('❌  MONGODB_URI not found'); process.exit(1); }

  console.log('🔌  Connecting to MongoDB (read-only)…');
  await mongoose.connect(uri);
  console.log('✅  Connected.\n');

  const allTitles = Object.values(SEEDED_TITLES_BY_SLUG).flat();

  const docs = await SoundCard.find({
    title: { $in: allTitles },
    moodSlug: { $in: Object.keys(SEEDED_TITLES_BY_SLUG) },
  })
    .sort({ moodSlug: 1, displayOrder: 1 })
    .select('_id title moodSlug displayOrder')
    .lean();

  console.log('─────────────────────────────────────────────────────────────');
  console.log('  Seeded card _id values (read-only)');
  console.log('─────────────────────────────────────────────────────────────\n');

  const idMap = [];

  for (const [slug, titles] of Object.entries(SEEDED_TITLES_BY_SLUG)) {
    console.log(`  [${slug}]`);
    for (const title of titles) {
      const doc = docs.find(d => d.moodSlug === slug && d.title === title);
      if (doc) {
        console.log(`    "${title}"`);
        console.log(`      _id: ${doc._id}`);
        idMap.push({ slug, title, _id: String(doc._id) });
      } else {
        console.log(`    "${title}"  ⚠️  NOT FOUND in database`);
      }
    }
    console.log();
  }

  // Print the exact SEEDED_IDS constant ready to paste
  console.log('─────────────────────────────────────────────────────────────');
  console.log('  SEEDED_IDS constant (copy-paste ready)');
  console.log('─────────────────────────────────────────────────────────────\n');
  console.log('const SEEDED_IDS = new Set([');
  for (const { slug, title, _id } of idMap) {
    console.log(`  '${_id}', // ${slug} — ${title}`);
  }
  console.log(']);\n');

  console.log(`Total found: ${idMap.length} / 15`);

  await mongoose.disconnect();
  console.log('\n✅  Done (no writes performed).');
}

run().catch(err => {
  console.error('❌  Error:', err.message);
  process.exit(1);
});
