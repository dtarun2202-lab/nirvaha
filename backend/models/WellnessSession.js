const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  }
});

const seasonSchema = new mongoose.Schema({
  seasonNumber: {
    type: Number,
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  episodes: [episodeSchema]
});

const wellnessSessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  mood: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  duration: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  banner: {
    type: String,
    required: true
  },
  audioSource: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  match: {
    type: String,
    default: '95% Match'
  },
  year: {
    type: String,
    default: '2026'
  },
  rating: {
    type: String,
    default: 'TV-G'
  },
  type: {
    type: String,
    enum: ['Series', 'Film'],
    required: true
  },
  seasons: [seasonSchema],
  isOriginal: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WellnessSession', wellnessSessionSchema);
