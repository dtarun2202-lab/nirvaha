const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  language: { type: String, enum: ['en', 'hi', 'te', 'kn'], default: 'en' },
  notifications: {
    enabled: { type: Boolean, default: true },
    types: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    communityPosts: { type: Boolean, default: true },
    likesComments: { type: Boolean, default: true },
    mentorReplies: { type: Boolean, default: true },
    dailyWellness: { type: Boolean, default: true },
    soundVibration: { type: Boolean, default: true }
  },
  privacy: {
    profileVisible: { type: Boolean, default: true },
    dataExportable: { type: Boolean, default: true },
    allowSearch: { type: Boolean, default: true },
    privateProfile: { type: Boolean, default: false },
    hideActivityStatus: { type: Boolean, default: false },
    blockedUsers: { type: [String], default: [] }
  },
  music: {
    enabled: { type: Boolean, default: false },
    volume: { type: Number, min: 0, max: 100, default: 50 }
  },
  chatbotPersona: {
    type: String,
    enum: ['Supportive', 'Emotional', 'Deep', 'default'],
    default: 'Supportive'
  },
  realtimeSync: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('UserSettings', userSettingsSchema);
