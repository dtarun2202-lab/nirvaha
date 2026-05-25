const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const postSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    userId: { type: String, default: 'anonymous' },
    userName: { type: String, required: true },
    userRole: { type: String, default: 'Community Member' },
    userInitial: { type: String, required: true },
    avatarColor: { type: String, default: '#2D6A4F' },
    timestampValue: { type: Number, default: () => Date.now() },
    title: { type: String, required: true },
    body: { type: String, required: true },
    hashtags: { type: [String], default: [] },
    likes: { type: Number, default: 0 },
    liked: { type: Boolean, default: false },
    comments: [
      {
        id: String,
        userId: String,
        userName: String,
        userInitial: String,
        avatarColor: String,
        text: String,
        createdAt: Number
      }
    ],
    isCertified: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: true },
    categories: { type: [String], default: [] },
    comments_count: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    content: { type: String },
    user_id: { type: String },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), index: { expires: '0d' } }
  },
  { timestamps: true }
);

postSchema.pre('save', function (next) {
  if (this.body && !this.content) {
    this.content = this.body;
  }
  if (this.userId && !this.user_id) {
    this.user_id = this.userId;
  }
  if (this.comments) {
    this.comments_count = this.comments.length;
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
