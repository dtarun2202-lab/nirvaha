const mongoose = require('mongoose');

const wellnessRetreatSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  externalLink: {
    type: String,
    default: ''
  },
  buttonLabel: {
    type: String,
    default: 'Explore'
  },
  displayOrder: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WellnessRetreat', wellnessRetreatSchema);
