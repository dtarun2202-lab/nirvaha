const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const mentorProfileSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    specialty: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    avatarColor: { type: String, default: '#2D6A4F' },
    followers: { type: Number, default: 0 },
    posts: { type: Number, default: 0 },
    bio: { type: String, default: '' },
    followed: { type: Boolean, default: false },
    starred: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MentorProfile', mentorProfileSchema);
