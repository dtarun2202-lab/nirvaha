/**
 * seed_yoga_originals.js
 * Restores the 9 original Yoga for Meditation cards to the database.
 * - Does NOT delete or overwrite any existing records.
 * - Skips insertion if a card with the same name already exists.
 * - Triangle Pose (or any other admin-added card) is left untouched.
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const Yoga = require('../models/Yoga');

const ORIGINAL_CARDS = [
  {
    name: 'Easy Pose (Sukhasana)',
    difficulty: 'Gentle',
    duration: 10,
    imageUrl: '/poses for medittaion/easy 1.jpg',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Easy+Pose+Sukhasana+beginner+5+minute+meditation+tutorial',
    status: 'Active',
  },
  {
    name: "Child's Pose (Balasana)",
    difficulty: 'Gentle',
    duration: 3,
    imageUrl: '/yoga poses/child pose.png',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Balasana+Child+Pose+beginner+short+guided+yoga+tutorial',
    status: 'Active',
  },
  {
    name: 'Thunderbolt Pose (Vajrasana)',
    difficulty: 'Gentle',
    duration: 10,
    imageUrl: '/poses for medittaion/thunder 3.png',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Vajrasana+Thunderbolt+Pose+beginner+10+minute+meditation+practice',
    status: 'Active',
  },
  {
    name: 'Perfect Pose (Siddhasana)',
    difficulty: 'Gentle',
    duration: 20,
    imageUrl: '/yoga poses/perfect pose.png',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Siddhasana+Perfect+Pose+5+minute+meditation+tutorial+beginner',
    status: 'Active',
  },
  {
    name: 'Seated Forward Fold (Paschimottanasana)',
    difficulty: 'Gentle',
    duration: 4,
    imageUrl: '/yoga for meditation/seated 2.png',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Paschimottanasana+Seated+Forward+Fold+beginner+short+guided+meditation+yoga',
    status: 'Active',
  },
  {
    name: 'Corpse Pose (Shavasana)',
    difficulty: 'Gentle',
    duration: 10,
    imageUrl: '/poses for medittaion/corpus 5.png',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Savasana+Corpse+Pose+10+minute+guided+relaxation+beginner+meditation',
    status: 'Active',
  },
  {
    name: 'Butterfly Pose (Baddha Konasana)',
    difficulty: 'Gentle',
    duration: 10,
    imageUrl: '/yoga poses/butterfly pose.png',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Butterfly+Pose+Baddha+Konasana+beginner+5+minute+guided+yoga+tutorial',
    status: 'Active',
  },
  {
    name: 'Half Spinal Twist (Ardha Matsyendrasana)',
    difficulty: 'Moderate',
    duration: 5,
    imageUrl: '/yoga poses/half.png',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Ardha+Matsyendrasana+Half+Spinal+Twist+beginner+10+minute+yoga+tutorial',
    status: 'Active',
  },
  {
    name: 'Tree Pose (Vrikshasana)',
    difficulty: 'Moderate',
    duration: 3,
    imageUrl: '/poses for medittaion/tree 7.png',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Tree+Pose+Vrikshasana+beginner+5+minute+balance+meditation+practice',
    status: 'Active',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  let inserted = 0;
  let skipped = 0;

  for (const card of ORIGINAL_CARDS) {
    const exists = await Yoga.findOne({ name: card.name });
    if (exists) {
      console.log(`  SKIP  (already exists): ${card.name}`);
      skipped++;
    } else {
      await Yoga.create(card);
      console.log(`  INSERT: ${card.name}`);
      inserted++;
    }
  }

  const total = await Yoga.countDocuments();
  console.log(`\nDone. Inserted: ${inserted} | Skipped: ${skipped} | Total in DB: ${total}`);

  // Print final state
  const all = await Yoga.find({}).sort({ createdAt: 1 }).lean();
  console.log('\nAll Yoga records now in DB:');
  all.forEach((y, i) => console.log(`  ${i + 1}. [${y.status}] ${y.name}`));

  await mongoose.disconnect();
}

seed().catch(e => { console.error(e.message); process.exit(1); });
