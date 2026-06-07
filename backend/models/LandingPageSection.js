const mongoose = require('mongoose');

const LandingPageSectionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  visible: { type: Boolean, default: true },
});

module.exports = mongoose.model('LandingPageSection', LandingPageSectionSchema);
