const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pose = require('./models/Pose');
const Yoga = require('./models/Yoga');

dotenv.config();

async function migrate() {
  if (!process.env.MONGODB_URI) {
    console.log("No MONGODB_URI set, skipping migration");
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for migration");
    
    const yogaPoses = await Pose.find({ category: 'Yoga for Meditation' });
    console.log(`Found ${yogaPoses.length} Yoga records in Pose collection`);
    
    let migratedCount = 0;
    for (const pose of yogaPoses) {
      const yoga = new Yoga({
        name: pose.name,
        difficulty: pose.sanskritName || 'Gentle',
        duration: pose.poseNumber || 10,
        youtubeUrl: pose.spiritualEssence || '',
        imageUrl: pose.imageUrl || '',
        status: pose.status || 'Active'
      });
      await yoga.save();
      await Pose.deleteOne({ _id: pose._id });
      migratedCount++;
    }
    
    console.log(`Successfully migrated ${migratedCount} records to Yoga collection`);
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    mongoose.connection.close();
  }
}

migrate();
