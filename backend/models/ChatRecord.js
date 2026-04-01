const mongoose = require('mongoose');

const chatRecordSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'voice', 'file'],
    default: 'text'
  },
  fileUrl: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 创建索引以优化查询
chatRecordSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

module.exports = mongoose.model('ChatRecord', chatRecordSchema);
