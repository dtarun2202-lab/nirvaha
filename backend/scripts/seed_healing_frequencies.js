/**
 * seed_healing_frequencies.js
 *
 * Seeds the 15 static fallback Healing Frequencies cards into MongoDB.
 * - Matches the exact content shown on the frontend (STATIC_FALLBACK_SOUNDS).
 * - Skips any card whose (title + moodSlug) combination already exists.
 * - Safe to re-run: idempotent.
 * - Does NOT touch any admin-created records or other collections.
 *
 * Run from the backend directory:
 *   node scripts/seed_healing_frequencies.js
 */

'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const SoundCard = require('../models/SoundCard');

// ─── Exact 15 fallback cards from SoundHealingPage.tsx ───────────────────────
const SEED_CARDS = [
  // ── Stress (moodSlug: "stress") ──────────────────────────────────────────
  {
    moodSlug:     'stress',
    title:        'Ocean Waves Calm',
    description:  'Gentle ocean sounds to wash away stress',
    category:     'Nature',
    frequency:    '528 Hz',
    duration:     '15:00',
    coverImage:   '/sound/ocean_waves.png',
    audioUrl:     '/audio/stress/Ocean-Waves-Calm.mp3',
    displayOrder: 0,
  },
  {
    moodSlug:     'stress',
    title:        'Forest Rain',
    description:  'Peaceful rainfall in ancient forest',
    category:     'Nature',
    frequency:    '432 Hz',
    duration:     '20:00',
    coverImage:   '/sound/forest_ambience.png',
    audioUrl:     '/audio/stress/Gentle-Rain-Drops.mp3',
    displayOrder: 1,
  },
  {
    moodSlug:     'stress',
    title:        'Tibetan Bowls',
    description:  'Sacred healing vibrations',
    category:     'Bowl Therapy',
    frequency:    '432 Hz',
    duration:     '15:30',
    coverImage:   '/tibetan.jpg',
    audioUrl:     '/audio/stress/Tibetan-Bowls.mp3',
    displayOrder: 2,
  },

  // ── Anxiety (moodSlug: "anxiety") ────────────────────────────────────────
  {
    moodSlug:     'anxiety',
    title:        'Gentle Rain Drops',
    description:  'Soft rainfall for deep calm',
    category:     'Nature',
    frequency:    '528 Hz',
    duration:     '25:00',
    coverImage:   'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=400&fit=crop&auto=format',
    audioUrl:     '/audio/anxiety/Gentle-Rain-Drops.mp3',
    displayOrder: 0,
  },
  {
    moodSlug:     'anxiety',
    title:        'Misty Forest Stream',
    description:  'Flowing water through peaceful woods',
    category:     'Nature',
    frequency:    '432 Hz',
    duration:     '30:00',
    coverImage:   'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop&auto=format',
    audioUrl:     '/audio/anxiety/Misty-Forest-Stream.mp3',
    displayOrder: 1,
  },
  {
    moodSlug:     'anxiety',
    title:        'Soft Meadow Breeze',
    description:  'Gentle wind through calm meadows',
    category:     'Nature',
    frequency:    '396 Hz',
    duration:     '22:00',
    coverImage:   '/breeze.webp',
    audioUrl:     '/audio/anxiety/Soft-Meadow-Breeze.mp3',
    displayOrder: 2,
  },

  // ── Sleep Issues (moodSlug: "sleep-issues") ──────────────────────────────
  {
    moodSlug:     'sleep-issues',
    title:        'Night Ocean Waves',
    description:  'Deep ocean sounds for restful sleep',
    category:     'Sleep',
    frequency:    '528 Hz',
    duration:     '60:00',
    coverImage:   'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&auto=format',
    audioUrl:     '/audio/sleep/Night-Ocean-Waves.mp3',
    displayOrder: 0,
  },
  {
    moodSlug:     'sleep-issues',
    title:        'Starlit Delta Waves',
    description:  'Sleep-inducing frequencies under stars',
    category:     'Binaural',
    frequency:    '1-4 Hz',
    duration:     '45:00',
    coverImage:   'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop&auto=format',
    audioUrl:     '/audio/sleep/Starlit-Delta-Waves.mp3',
    displayOrder: 1,
  },
  {
    moodSlug:     'sleep-issues',
    title:        'Moonlight Lullaby',
    description:  'Soft tones for deep rest',
    category:     'Ambient',
    frequency:    '432 Hz',
    duration:     '40:00',
    coverImage:   '/moon.jpeg',
    audioUrl:     '/audio/sleep/Moonlight-Lullaby.mp3',
    displayOrder: 2,
  },

  // ── Focus (moodSlug: "focus") ────────────────────────────────────────────
  {
    moodSlug:     'focus',
    title:        'Clear Mind Frequencies',
    description:  'Pure tones for concentration',
    category:     'Binaural',
    frequency:    '8-12 Hz',
    duration:     '25:00',
    coverImage:   '/Clear Mind Frequencies.jpg',
    audioUrl:     '/audio/focus/Clear-Mind-Frequencies.mp3',
    displayOrder: 0,
  },
  {
    moodSlug:     'focus',
    title:        'Minimal Nature Sounds',
    description:  'Clean audio for mental clarity',
    category:     'Ambient',
    frequency:    '528 Hz',
    duration:     '20:00',
    coverImage:   '/nature.jpg',
    audioUrl:     '/audio/focus/Minimal-Nature-Sounds.mp3',
    displayOrder: 1,
  },
  {
    moodSlug:     'focus',
    title:        'Productivity Flow',
    description:  'Subtle background for deep work',
    category:     'Focus',
    frequency:    '40 Hz',
    duration:     '30:00',
    coverImage:   '/Productivity Flow.jpg',
    audioUrl:     '/audio/focus/Productivity-Flow.mp3',
    displayOrder: 2,
  },

  // ── Emotional Balance (moodSlug: "emotional-balance") ────────────────────
  {
    moodSlug:     'emotional-balance',
    title:        'Chakra Harmony',
    description:  'Balance all energy centers',
    category:     'Chakra Healing',
    frequency:    '852 Hz',
    duration:     '22:30',
    coverImage:   '/sound/chakra_tuning.png',
    audioUrl:     '/audio/emotional/Chakra-Harmony.mp3',
    displayOrder: 0,
  },
  {
    moodSlug:     'emotional-balance',
    title:        'Sacred Geometry',
    description:  'Harmonic frequencies',
    category:     'Crystal Therapy',
    frequency:    '741 Hz',
    duration:     '25:00',
    coverImage:   '/geometry.webp',
    audioUrl:     '/audio/emotional/Sacred-Geometry.mp3',
    displayOrder: 1,
  },
  {
    moodSlug:     'emotional-balance',
    title:        'Healing Bowls',
    description:  'Tibetan healing vibrations',
    category:     'Bowl Therapy',
    frequency:    '432 Hz',
    duration:     '18:00',
    coverImage:   '/healing.jpg',
    audioUrl:     '/audio/anxiety/Healing-Bowls.mp3',
    displayOrder: 2,
  },
];

// ─── Seed logic ───────────────────────────────────────────────────────────────
async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌  MONGODB_URI not found in .env');
    process.exit(1);
  }

  console.log('🔌  Connecting to MongoDB…');
  await mongoose.connect(uri);
  console.log('✅  Connected.\n');

  let inserted = 0;
  let skipped  = 0;

  for (const card of SEED_CARDS) {
    const exists = await SoundCard.findOne({
      title:    card.title,
      moodSlug: card.moodSlug,
    }).lean();

    if (exists) {
      console.log(`⏭   SKIP  [${card.moodSlug}] "${card.title}" — already exists`);
      skipped++;
    } else {
      await SoundCard.create({
        ...card,
        collectionId:   null,
        collectionSlug: '',
        artist:         '',
        tag:            '',
        status:         'Active',
      });
      console.log(`✅  INSERT [${card.moodSlug}] "${card.title}"`);
      inserted++;
    }
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`  Inserted : ${inserted}`);
  console.log(`  Skipped  : ${skipped}`);
  console.log(`  Total    : ${SEED_CARDS.length}`);
  console.log(`─────────────────────────────────────────`);

  // ── Verification: print counts per moodSlug ──────────────────────────────
  console.log('\n📊  Verification — card counts per category:\n');
  const slugs = ['stress', 'anxiety', 'sleep-issues', 'focus', 'emotional-balance'];
  for (const slug of slugs) {
    const docs = await SoundCard.find({ moodSlug: slug, status: 'Active' })
      .sort({ displayOrder: 1 })
      .lean();
    console.log(`  ${slug.padEnd(20)} → ${docs.length} card(s)`);
    docs.forEach((d, i) => console.log(`    ${i + 1}. ${d.title}`));
  }

  console.log('\n✅  Seed complete.\n');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});
