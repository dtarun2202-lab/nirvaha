const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    quote: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    imageName: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    badge: {
      type: String,
      default: 'TRANSFORMATION'
    },
    bgColor: {
      type: String,
      default: 'bg-white'
    },
    textColor: {
      type: String,
      default: 'text-[#1a5d47]'
    },
    type: {
      type: String,
      enum: ['featured', 'small'],
      default: 'featured'
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
