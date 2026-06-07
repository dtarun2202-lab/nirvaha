const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Content = require('../models/Content');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const key = 'landing_hero';
  const heroData = {
    title: "FIND YOUR",
    subtitle: "Experience the convergence of ancient wisdom and modern technology for your complete holistic healing journey.",
    buttonText: "Start Your Journey",
    imageUrl: "/LP.png"
  };
  
  const content = await Content.findOneAndUpdate(
    { key },
    {
      value: JSON.stringify(heroData),
      type: "json",
      section: "landing",
      description: "Landing Hero content"
    },
    { new: true, upsert: true }
  );
  
  console.log("Updated content in DB:", content);
  
  // Also clean up any other hero keys if they exist in other models
  // The backend uses a Landing model in modules/landing/landing.model.js
  try {
    const Landing = require('../modules/landing/landing.model');
    const landing = await Landing.findOneAndUpdate(
      {},
      {
        hero: {
          title: "FIND YOUR",
          subtitle: "Experience the convergence of ancient wisdom and modern technology for your complete holistic healing journey.",
          buttonText: "Start Your Journey",
          imageUrl: "LP.png"
        }
      },
      { new: true, upsert: true }
    );
    console.log("Updated Landing document in DB:", landing);
  } catch (err) {
    console.log("Landing module update skipped or not applicable:", err.message);
  }
  
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
