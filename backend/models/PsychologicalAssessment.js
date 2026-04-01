const mongoose = require('mongoose');

const psychologicalAssessmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  assessor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessmentDate: {
    type: Date,
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  comments: {
    type: String
  },
  recommendations: {
    type: [String]
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'reviewed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PsychologicalAssessment', psychologicalAssessmentSchema);
