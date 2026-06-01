require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Yoga = require('../models/Yoga');

const SEEDED_IDS = [
  '860f485d-cc59-43a5-9d07-53669582271f', // Easy Pose
  '3a7b6574-db4a-4fae-a91c-b028e5c48ba0', // Child's Pose
  '354f60a6-82d4-48f9-b6da-6bc623d4e5b5', // Thunderbolt
  '31ebd7ae-bbd7-4ee0-938c-83a3945f45be', // Perfect Pose
  'e8cece2f-69a7-4e92-ba77-5085419a2351', // Seated Forward Fold
  'c1a1d38e-e30c-4191-baab-e0f962821328', // Corpse Pose
  'a7261bc1-5744-4528-88f3-393695846fc8', // Butterfly Pose
  '9cb20930-9e74-4dce-a1fa-3f24556e2ffb', // Half Spinal Twist
  '2fed8036-2047-4044-b6ee-13cc698e8ec8', // Tree Pose
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  // Triangle Pose — admin-created via admin panel
  const r1 = await Yoga.updateOne(
    { id: 'd5506130-d59a-49c8-ab3d-f65a71ce3563' },
    { adminManaged: true }
  );
  // 9 seeded defaults — not admin-managed
  const r2 = await Yoga.updateMany(
    { id: { $in: SEEDED_IDS } },
    { adminManaged: false }
  );

  console.log('Triangle Pose -> adminManaged:true  modified:', r1.modifiedCount);
  console.log('Seeded defaults -> adminManaged:false modified:', r2.modifiedCount);

  const all = await Yoga.find({}).sort({ createdAt: 1 }).lean();
  all.forEach(y => console.log(y.adminManaged ? '[ADMIN]' : '[seed] ', y.name));

  mongoose.disconnect();
}).catch(e => { console.error(e.message); process.exit(1); });
