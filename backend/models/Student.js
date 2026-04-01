const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  school: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  learningNeeds: {
    type: String
  },
  psychologicalStatus: {
    type: String,
    enum: ['good', 'fair', 'needs_attention', 'needs_intervention'],
    default: 'good'
  },
  guardian: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
