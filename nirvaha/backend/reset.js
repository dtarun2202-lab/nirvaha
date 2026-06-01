require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function resetPassword() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  
  const hashedPassword = await bcrypt.hash('sathvika123', 10);
  
  const result = await db.collection('users').updateOne(
    { email: 'gayarsathvika@gmail.com' },
    { $set: { password: hashedPassword, updatedAt: new Date() } }
  );
  
  console.log(result.modifiedCount > 0 ? 'Password reset!' : 'User not found');
  await mongoose.disconnect();
  process.exit(0);
}

resetPassword();
