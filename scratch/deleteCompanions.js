const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env variables
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const CompanionApplication = require('../backend/models/CompanionApplication');
const User = require('../backend/models/User');

const dbUri = process.env.MONGODB_URI;
if (!dbUri) {
  console.error("MONGODB_URI is not defined in env!");
  process.exit(1);
}

mongoose.connect(dbUri)
  .then(async () => {
    console.log("Connected to MongoDB database.");

    // Names to remove
    const names = [
      "Samanuri Lakshmi Priya",
      "Lakshmi Priya"
    ];

    console.log("Searching for companion applications with names:", names);
    const applications = await CompanionApplication.find({
      fullName: { $in: names }
    });

    console.log(`Found ${applications.length} matching applications.`);

    for (const app of applications) {
      console.log(`\nProcessing application: ${app.fullName} (${app.email})`);
      
      // Update corresponding User document
      const user = await User.findOne({ email: app.email });
      if (user) {
        console.log(`Found associated user: ${user.name} (${user.email}). Resetting companion flags.`);
        user.isApprovedCompanion = false;
        user.companionStatus = undefined; // Or 'pending' / null
        user.companionId = undefined;
        await user.save();
        console.log("✓ User document updated.");
      } else {
        console.log("No associated user found by email.");
      }

      // Delete the companion application
      const deleteResult = await CompanionApplication.deleteOne({ _id: app._id });
      console.log(`✓ Deleted CompanionApplication. Deleted count: ${deleteResult.deletedCount}`);
    }

    console.log("\nFinished processing all matching records.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Database error:", err);
    process.exit(1);
  });
