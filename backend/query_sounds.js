const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Sound = require('./models/Sound');
const SoundCard = require('./models/SoundCard');

async function main() {
  const uri = process.env.MONGODB_URI;
  console.log('Connecting to:', uri);
  await mongoose.connect(uri);
  console.log('Connected.');

  console.log('\n--- SOUNDS (from Sound model used in DynamicSoundSessions) ---');
  const sounds = await Sound.find().lean();
  console.log(`Found ${sounds.length} sounds.`);
  sounds.forEach((s, i) => {
    console.log(`${i+1}. Title: "${s.title}"`);
    console.log(`   Artist: "${s.artist}"`);
    console.log(`   Category: "${s.category}"`);
    console.log(`   Frequency: "${s.frequency}"`);
    console.log(`   AudioUrl: "${s.audioUrl}"`);
    console.log(`   Mood tags:`, s.mood);
  });

  console.log('\n--- SOUND CARDS (from SoundCard model used in Collections/Feelings) ---');
  const cards = await SoundCard.find().lean();
  console.log(`Found ${cards.length} cards.`);
  cards.forEach((c, i) => {
    console.log(`${i+1}. Title: "${c.title}"`);
    console.log(`   MoodSlug: "${c.moodSlug}"`);
    console.log(`   CollectionSlug: "${c.collectionSlug}"`);
    console.log(`   AudioUrl: "${c.audioUrl}"`);
  });

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
