const ChatRecord = require('../models/ChatRecord');

// @desc    获取与某用户的聊天记录
// @route   GET /api/chat/:userId
// @access  Private
exports.getChatHistory = async (req, res) => {
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
      records: records.reverse(),
      currentPage: page
    });
  } catch (error) {
    console.error('获取聊天记录错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    获取所有聊天对象列表
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
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
};

// @desc    发送消息
// @route   POST /api/chat/send
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message, type = 'text', fileUrl } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({ message: '请提供接收者 ID 和消息内容' });
    }

    const chatRecord = await ChatRecord.create({
      sender: req.user.id,
      receiver: receiverId,
      message,
      type,
      fileUrl: fileUrl || null
    });

    // 填充发送者和接收者信息
    const populatedRecord = await ChatRecord.findById(chatRecord._id)
      .populate('sender', 'name username avatar role')
      .populate('receiver', 'name username avatar role');

    // 通过 Socket.IO 发送实时消息（如果可用）
    if (req.app.get('io')) {
      const io = req.app.get('io');
      const chatRoomId = [req.user.id, receiverId].sort().join('_');
      io.to(chatRoomId).emit('receive-message', populatedRecord);
    }

    res.status(201).json({
      success: true,
      record: populatedRecord
    });
  } catch (error) {
    console.error('发送消息错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    标记消息为已读
// @route   PUT /api/chat/:userId/read
// @access  Private
exports.markAsRead = async (req, res) => {
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
};

// @desc    删除消息
// @route   DELETE /api/chat/:messageId
// @access  Private
exports.deleteMessage = async (req, res) => {
  try {
    const chatRecord = await ChatRecord.findById(req.params.messageId);

    if (!chatRecord) {
      return res.status(404).json({ message: '消息不存在' });
    }

    // 只有发送者可以删除自己的消息
    if (chatRecord.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: '无权删除此消息' });
    }

    await chatRecord.deleteOne();

    res.json({
      success: true,
      message: '消息已删除'
    });
  } catch (error) {
    console.error('删除消息错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};
