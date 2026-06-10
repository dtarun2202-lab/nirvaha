const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profile: {
      mobile: { type: String, default: '' },
      age: { type: String, default: '' },
      gender: { type: String, default: '' },
      address: { type: String, default: '' },
      education: { type: String, default: '' },
      healthCondition: { type: String, default: '' },
    },
    // Wellness stats
    stats: {
      sessionsPlayed: { type: Number, default: 0 },
      streak: { type: Number, default: 0 },
      totalMinutes: { type: Number, default: 0 },
      posts: { type: Number, default: 0 },
      followers: { type: Number, default: 0 },
      following: { type: Number, default: 0 },
      wellnessScore: { type: Number, default: 0 },
      lastPlayedDate: { type: String, default: null },
      weeklyMinutes: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
      activityLog: { type: [String], default: [] }, // Array of YYYY-MM-DD strings
    },
    bio: { type: String, default: 'Spiritual Seeker • Meditation Enthusiast' },
    location: { type: String, default: 'Hyderabad, India' },
    avatar: { type: String, default: '' },
    currentMood: { type: String, default: '' },
    sessionHistory: {
      type: [
        {
          title: { type: String, default: '' },
          duration: { type: Number, default: 1 },
          sessionType: { type: String, default: 'meditation' },
          type: { type: String, default: '' },
          completedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

    isApprovedCompanion: { type: Boolean, default: false },
    companionStatus: { type: String, default: null },
    companionId: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
