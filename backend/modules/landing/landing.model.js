const mongoose = require('mongoose');

const LandingSchema = new mongoose.Schema({
  hero: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    buttonText: { type: String, default: '' },
    imageUrl: { type: String, default: '' }
  },
  partners: [{
    name: String,
    logoUrl: String,
    websiteUrl: String
  }],
  pillars: [{
    title: String,
    description: String,
    order: Number
  }],
  library: [{
    title: String,
    category: String,
    duration: String,
    imageUrl: String
  }],
  goals: [{
    title: String,
    description: String,
    imageUrl: String
  }],
  courses: [{
    title: String,
    description: String,
    feeType: String,
    imageUrl: String
  }]
}, { 
  timestamps: true,
  // Ensure we only have one landing page document
  capped: false 
});

module.exports = mongoose.model('Landing', LandingSchema);
