/**
 * seed_collection_cards.js
 *
 * Seeds the 12 default Sound Healing Library collection cards into MongoDB.
 * These are the exact cards currently hardcoded in SoundHealingPage.tsx.
 *
 * Collections seeded:
 *   meditation  — Meditation Journey  (3 cards, displayOrder 0-2)
 *   sleep       — Sleep Therapy       (3 cards, displayOrder 0-2)
 *   focus       — Focus Boost         (3 cards, displayOrder 0-2)
 *   nature      — Nature Sounds       (3 cards, displayOrder 0-2)
 *
 * Safety:
 *   - Checks for existing cards per collectionSlug before inserting.
 *   - Skips a collection if it already has cards (idempotent).
 *   - Never touches moodSlug cards or Mood Categories records.
 *
 * Run once:  node backend/scripts/seed_collection_cards.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const SoundCard = require('../models/SoundCard');

const COLLECTION_CARDS = [
  // ── Meditation Journey ────────────────────────────────────────────────────
  {
    collectionSlug: 'meditation',
    moodSlug: '',
    title: 'Meditation at Sunrise',
    artist: 'Sacred Sounds Collective',
    description: 'Begin your day with peaceful sunrise meditation sounds.',
    coverImage: '/Meditation at Sunrise.png',
    audioUrl: '/audio/meditation/Meditation-at-Sunrise.mp3',
    frequency: '432 Hz',
    tag: 'meditation, morning, peace',
    duration: '15:30',
    category: 'Meditation',
    status: 'Active',
    displayOrder: 0,
  },
  {
    collectionSlug: 'meditation',
    moodSlug: '',
    title: 'Indoor Calm Meditation',
    artist: 'Inner Peace Studio',
    description: 'Find tranquility in your indoor meditation practice.',
    coverImage: '/Indoor Calm Meditation.png',
    audioUrl: '/audio/meditation/Indoor-Calm-Meditation.mp3',
    frequency: '528 Hz',
    tag: 'meditation, calm, mindful',
    duration: '20:00',
    category: 'Meditation',
    status: 'Active',
    displayOrder: 1,
  },
  {
    collectionSlug: 'meditation',
    moodSlug: '',
    title: 'Nature Meditation',
    artist: 'Earth Harmony',
    description: 'Connect with nature through guided meditation sounds.',
    coverImage: '/nature meditation.png',
    audioUrl: '/audio/meditation/Nature-Meditation.mp3',
    frequency: '396 Hz',
    tag: 'meditation, nature, peace',
    duration: '25:00',
    category: 'Meditation',
    status: 'Active',
    displayOrder: 2,
  },

  // ── Sleep Therapy ─────────────────────────────────────────────────────────
  {
    collectionSlug: 'sleep',
    moodSlug: '',
    title: 'Cozy Bed',
    artist: 'Sleep Sanctuary',
    description: 'Drift into peaceful sleep in your cozy sanctuary.',
    coverImage: '/cozy Bed.webp',
    audioUrl: '/audio/sleep/Moonlight-Lullaby.mp3',
    frequency: '528 Hz',
    tag: 'sleep, night, deep',
    duration: '60:00',
    category: 'Sleep',
    status: 'Active',
    displayOrder: 0,
  },
  {
    collectionSlug: 'sleep',
    moodSlug: '',
    title: 'Window Night Sky View',
    artist: 'Nocturnal Sounds',
    description: 'Gaze at the stars through your window as you drift to sleep.',
    coverImage: '/assets/sleep/window-night-sky.jpg',
    audioUrl: '/audio/sleep/Night-Ocean-Waves.mp3',
    frequency: '432 Hz',
    tag: 'sleep, night, deep',
    duration: '45:00',
    category: 'Sleep',
    status: 'Active',
    displayOrder: 1,
  },
  {
    collectionSlug: 'sleep',
    moodSlug: '',
    title: 'Peaceful Sleeping Scene',
    artist: 'Dream Weavers',
    description: 'Create the perfect atmosphere for restful sleep.',
    coverImage: '/peaceful sleeping .png',
    audioUrl: '/audio/sleep/Starlit-Delta-Waves.mp3',
    frequency: '396 Hz',
    tag: 'sleep, night, deep',
    duration: '50:00',
    category: 'Sleep',
    status: 'Active',
    displayOrder: 2,
  },

  // ── Focus Boost ───────────────────────────────────────────────────────────
  {
    collectionSlug: 'focus',
    moodSlug: '',
    title: 'Productivity Flow',
    artist: 'Deep Work Mode',
    description: 'Enhance your productivity with focused work sounds.',
    coverImage: '/Productivity Flow.jpg',
    audioUrl: '/audio/focus/Productivity-Flow.mp3',
    frequency: '40 Hz',
    tag: 'focus, work, study',
    duration: '30:00',
    category: 'Focus',
    status: 'Active',
    displayOrder: 0,
  },
  {
    collectionSlug: 'focus',
    moodSlug: '',
    title: 'Clear Mind Frequencies',
    artist: 'Mental Clarity',
    description: 'Clear your mind with pure concentration frequencies.',
    coverImage: '/Clear Mind Frequencies.jpg',
    audioUrl: '/audio/focus/Clear-Mind-Frequencies.mp3',
    frequency: '8-12 Hz',
    tag: 'focus, clarity, brain',
    duration: '25:00',
    category: 'Focus',
    status: 'Active',
    displayOrder: 1,
  },
  {
    collectionSlug: 'focus',
    moodSlug: '',
    title: 'Minimal Nature Sounds',
    artist: 'Distraction-Free',
    description: 'Subtle nature sounds for enhanced mental clarity.',
    coverImage: '/images/Minimal Nature Sounds.jpg',
    audioUrl: '/audio/focus/Minimal-Nature-Sounds.mp3',
    frequency: '528 Hz',
    tag: 'focus, minimal, concentration',
    duration: '20:00',
    category: 'Focus',
    status: 'Active',
    displayOrder: 2,
  },

  // ── Nature Sounds ─────────────────────────────────────────────────────────
  {
    collectionSlug: 'nature',
    moodSlug: '',
    title: 'Ocean Waves Calm',
    artist: 'Deep Relaxation',
    description: 'Gentle ocean sounds to wash away stress.',
    coverImage: '/images/Ocean Waves Calm.jpg',
    audioUrl: '/audio/stress/Ocean-Waves-Calm.mp3',
    frequency: '528 Hz',
    tag: 'stress, relax, nature',
    duration: '15:00',
    category: 'Nature',
    status: 'Active',
    displayOrder: 0,
  },
  {
    collectionSlug: 'nature',
    moodSlug: '',
    title: 'Forest Rain',
    artist: 'Nature Ambience',
    description: 'Peaceful rainfall in ancient forest.',
    coverImage: '/images/Forest Rain.jpg',
    audioUrl: '/audio/stress/Gentle-Rain-Drops.mp3',
    frequency: '432 Hz',
    tag: 'stress, rain, relax',
    duration: '20:00',
    category: 'Nature',
    status: 'Active',
    displayOrder: 1,
  },
  {
    collectionSlug: 'nature',
    moodSlug: '',
    title: 'Gentle Rain Drops',
    artist: 'Soothing Sleep',
    description: 'Soft rainfall for deep calm.',
    coverImage: '/images/Gentle Rain Drops.jpg',
    audioUrl: '/audio/anxiety/Gentle-Rain-Drops.mp3',
    frequency: '528 Hz',
    tag: 'stress, healing, calm',
    duration: '25:00',
    category: 'Nature',
    status: 'Active',
    displayOrder: 2,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const SLUGS = ['meditation', 'sleep', 'focus', 'nature'];
  const insertedIds = {};

  for (const slug of SLUGS) {
    // Safety check — skip if this collection already has cards
    const existing = await SoundCard.countDocuments({ collectionSlug: slug });
    if (existing > 0) {
      console.log(`[${slug}] Already has ${existing} card(s) — skipping.`);
      // Still read and report existing IDs
      const existingCards = await SoundCard.find({ collectionSlug: slug })
        .sort({ displayOrder: 1 })
        .lean();
      insertedIds[slug] = existingCards.map(c => ({ id: String(c._id), title: c.title, displayOrder: c.displayOrder }));
      continue;
    }

    const cards = COLLECTION_CARDS.filter(c => c.collectionSlug === slug);
    const result = await SoundCard.insertMany(cards, { ordered: true });
    insertedIds[slug] = result.map(c => ({ id: String(c._id), title: c.title, displayOrder: c.displayOrder }));
    console.log(`[${slug}] Inserted ${result.length} card(s)`);
  }

  console.log('\n══════════════════════════════════════════════════════');
  console.log('SEEDED COLLECTION CARD IDs — copy into SEEDED_IDS set');
  console.log('══════════════════════════════════════════════════════');
  for (const slug of SLUGS) {
    console.log(`\n  // ${slug}`);
    for (const { id, title, displayOrder } of insertedIds[slug]) {
      console.log(`  '${id}', // ${slug} [${displayOrder}] — ${title}`);
    }
  }

  console.log('\n══════════════════════════════════════════════════════');
  console.log('Verification — cards per collection:');
  for (const slug of SLUGS) {
    const count = await SoundCard.countDocuments({ collectionSlug: slug });
    console.log(`  [${slug}] ${count} card(s) in DB`);
  }

  await mongoose.disconnect();
  console.log('\nDone. Disconnected.');
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
