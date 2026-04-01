const mongoose = require('mongoose');

const teacherStudentMatchSchema = new mongoose.Schema({
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
  requesterType: {
    type: String,
    enum: ['student', 'teacher'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'awaiting_parent_confirm', 'matched', 'rejected', 'completed'],
    default: 'pending'
  },
  requestMessage: {
    type: String
  },
  studentConfirm: {
    type: Boolean,
    default: false
  },
  parentConfirm: {
    type: Boolean,
    default: false
  },
  teacherConfirm: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TeacherStudentMatch', teacherStudentMatchSchema);
