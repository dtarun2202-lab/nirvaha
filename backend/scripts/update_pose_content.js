/**
 * update_pose_content.js
 * Improves the text quality of existing Pose Management records.
 * No new poses added. No fields added or removed. Content only.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Pose = require('../models/Pose');

const IMPROVED_CONTENT = {
  '7b468be8-b5dd-4590-a402-e53c7e01a8a2': {
    name: 'Mountain Pose',
    sanskritName: 'Tadasana',
    category: 'Foundation & Alignment',
    shortCaption: 'The root of all standing postures — stillness in full presence.',
    shortIntro:
      'Tadasana is the foundational standing posture of yoga. Deceptively simple, it asks the practitioner to stand with complete awareness — feet grounded, spine tall, breath steady. It is the starting point from which all other standing asanas arise.',
    spiritualEssence:
      'A mountain does not strive to stand — it simply is. Tadasana teaches the art of effortless presence: rooted in the earth, open to the sky, unmoved by what passes around it. In stillness, the practitioner discovers that true strength is quiet.',
    ancientOrigin:
      'Tadasana is described in the Hatha Yoga Pradipika and referenced across classical texts as the base posture for all standing practice. The name derives from the Sanskrit "tada" (mountain) and "asana" (seat or posture), reflecting the quality of stillness and solidity it cultivates.',
    mentalBenefits: [
      'Develops single-pointed awareness and present-moment focus.',
      'Reduces mental restlessness by anchoring attention in the body.',
      'Builds quiet confidence through conscious upright posture.',
    ],
    physicalBenefits: [
      'Corrects postural imbalances and spinal misalignment.',
      'Strengthens the arches of the feet, ankles, and leg muscles.',
      'Activates the core and improves overall body awareness.',
    ],
    chakraName: 'Root Chakra (Muladhara)',
    chakraDescription:
      'Tadasana directly activates Muladhara, the root chakra at the base of the spine. By pressing the feet firmly into the earth and drawing energy upward through the legs, the practitioner cultivates a sense of safety, stability, and belonging in the present moment.',
  },
};

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  let updated = 0;
  for (const [id, content] of Object.entries(IMPROVED_CONTENT)) {
    const result = await Pose.findOneAndUpdate(
      { id },
      { $set: content },
      { new: true }
    );
    if (result) {
      console.log(`Updated: ${result.name}`);
      updated++;
    } else {
      console.log(`Not found: ${id}`);
    }
  }

  console.log(`\nDone. ${updated} pose(s) updated.`);
  await mongoose.disconnect();
}

run().catch(e => { console.error(e.message); process.exit(1); });
