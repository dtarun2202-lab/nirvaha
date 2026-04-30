require('dotenv').config();
const mongoose = require('mongoose');

async function reset() {
  await mongoose.connect(process.env.MONGODB_URI);
  await mongoose.connection.collection('posts').drop().catch(e => console.log('posts drop:', e.message));
  await mongoose.connection.collection('mentorprofiles').drop().catch(e => console.log('mentors drop:', e.message));
  console.log('Collections dropped. Ready for re-seed.');
  process.exit(0);
}

reset();
