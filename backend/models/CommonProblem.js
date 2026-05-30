const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

const problemDropdownSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const commonProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  bgColor: {
    type: String,
    required: true
  },
  borderColor: {
    type: String,
    required: true
  },
  hoverBg: {
    type: String,
    required: true
  },
  activeBg: {
    type: String,
    required: true
  },
  gradientFrom: {
    type: String,
    required: true
  },
  gradientTo: {
    type: String,
    required: true
  },
  accentColor: {
    type: String,
    required: true
  },
  accentLight: {
    type: String,
    required: true
  },
  modalGradient: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  solutions: [{
    type: String
  }],
  recommendations: [recommendationSchema],
  dropdownSectionTitle: {
    type: String,
    default: 'Why the mind keeps repeating'
  },
  dropdowns: [problemDropdownSchema],
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

module.exports = mongoose.model('CommonProblem', commonProblemSchema);
