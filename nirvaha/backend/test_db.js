const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SuccessStory = require('./models/SuccessStory');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const stories = await SuccessStory.find().sort({ createdAt: -1 }).limit(1);
  console.log(JSON.stringify(stories[0], null, 2));
  process.exit(0);
}).catch(console.error);
