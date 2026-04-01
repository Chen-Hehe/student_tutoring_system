const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  relationship: {
    type: String,
    enum: ['father', 'mother', 'grandparent', 'other_guardian']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Parent', parentSchema);
