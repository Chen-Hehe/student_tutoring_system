const express = require('express');
const router = express.Router();
const {
  getChatHistory,
  getConversations,
  sendMessage,
  markAsRead,
  deleteMessage
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

// 所有路由都需要认证
router.use(protect);

// 获取聊天对象列表
router.get('/conversations', getConversations);

// 发送消息
router.post('/send', sendMessage);

// 获取聊天记录
router.get('/:userId', getChatHistory);

// 标记消息已读
router.put('/:userId/read', markAsRead);

// 删除消息
router.delete('/:messageId', deleteMessage);

module.exports = router;
