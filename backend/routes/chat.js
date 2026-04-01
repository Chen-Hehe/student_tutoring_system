const express = require('express');
const router = express.Router();
const ChatRecord = require('../models/ChatRecord');
const { protect } = require('../middleware/auth');

// 所有路由都需要认证
router.use(protect);

// @desc    获取与某用户的聊天记录
// @route   GET /api/chat/:userId
// @access  Private
router.get('/:userId', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const records = await ChatRecord.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('sender', 'name username avatar role')
    .populate('receiver', 'name username avatar role');

    res.json({
      success: true,
      records: records.reverse(), // 按时间正序排列
      currentPage: page
    });
  } catch (error) {
    console.error('获取聊天记录错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// @desc    获取所有聊天对象列表
// @route   GET /api/chat/conversations
// @access  Private
router.get('/conversations/list', async (req, res) => {
  try {
    // 获取所有与当前用户有过聊天的用户
    const conversations = await ChatRecord.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user.id },
            { receiver: req.user.id }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user.id] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $last: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$receiver', req.user.id] },
                  { $eq: ['$isRead', false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      }
    ]).populate('_id', 'name username avatar role');

    res.json({
      success: true,
      conversations
    });
  } catch (error) {
    console.error('获取聊天列表错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// @desc    标记消息为已读
// @route   PUT /api/chat/:userId/read
// @access  Private
router.put('/:userId/read', async (req, res) => {
  try {
    await ChatRecord.updateMany(
      {
        sender: req.params.userId,
        receiver: req.user.id,
        isRead: false
      },
      { $set: { isRead: true } }
    );

    res.json({
      success: true,
      message: '消息已标记为已读'
    });
  } catch (error) {
    console.error('标记已读错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

module.exports = router;
