const mongoose = require('mongoose');

const aiMatchSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  matchReason: {
    type: String,
    required: true
  },
  matchFactors: {
    subject: { type: Boolean, default: false },
    grade: { type: Boolean, default: false },
    learningStyle: { type: Boolean, default: false },
    availability: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AIMatch', aiMatchSchema);
