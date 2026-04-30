const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://nirvaha-admin:N1rv@h@2025@cluster0.yc9yl.mongodb.net/nirvaha?retryWrites=true&w=majority";

async function createUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    // Check if user exists
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    const existingUser = await usersCollection.findOne({ email: 'gayarsathvika@gmail.com' });
    if (existingUser) {
      console.log("User already exists!");
      await mongoose.disconnect();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('sathvika123', 10);
    
    // Create user
    const newUser = {
      _id: new mongoose.Types.ObjectId(),
      id: uuidv4(),
      name: 'Sathvika',
      email: 'gayarsathvika@gmail.com',
      password: hashedPassword,
      role: 'user',
      profile: {
        mobile: '',
        age: '',
        gender: '',
        address: '',
        education: '',
        healthCondition: '',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await usersCollection.insertOne(newUser);
    console.log("✓ User created successfully!");
    console.log("Email: gayarsathvika@gmail.com");
    console.log("Password: sathvika123");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

createUser();