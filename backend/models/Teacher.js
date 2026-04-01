const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  education: {
    type: String,
    required: true
  },
  experience: {
    type: String
  },
  specialties: {
    type: [String]
  },
  availability: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Teacher', teacherSchema);
