const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://nirvaha-admin:N1rv@h@2025@cluster0.yc9yl.mongodb.net/nirvaha?retryWrites=true&w=majority";

async function resetPassword() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Hash new password
    const hashedPassword = await bcrypt.hash('sathvika123', 10);
    
    // Update user password
    const result = await usersCollection.updateOne(
      { email: 'gayarsathvika@gmail.com' },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );
    
    if (result.modifiedCount > 0) {
      console.log("✓ Password reset successfully!");
      console.log("Email: gayarsathvika@gmail.com");
      console.log("Password: sathvika123");
    } else {
      console.log("No user found to update");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

resetPassword();