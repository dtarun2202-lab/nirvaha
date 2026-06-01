const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    authorName: {
      type: String,
      required: true
    },
    authorRole: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      required: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    order: {
      type: Number,
      default: 0
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('SuccessStory', successStorySchema);
