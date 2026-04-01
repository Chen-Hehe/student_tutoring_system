const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

// 加载环境变量
dotenv.config();

// 导入数据库连接
const connectDatabase = require('./config/database');

// 导入路由
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const chatRoutes = require('./routes/chat');
const resourceRoutes = require('./routes/resources');
const matchRoutes = require('./routes/matches');
const psychologicalRoutes = require('./routes/psychological');
const uploadRoutes = require('./routes/upload');

// 初始化 Express 应用
const app = express();

// 创建 HTTP 服务器
const server = http.createServer(app);

// 初始化 Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// 中间件
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 连接数据库
connectDatabase();

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/psychological', psychologicalRoutes);
app.use('/api/upload', uploadRoutes);

// 静态文件服务（上传的文件）
app.use('/uploads', express.static('uploads'));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '乡村助学平台 API 运行正常',
    timestamp: new Date().toISOString()
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '路由不存在'
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Socket.IO 连接处理
io.on('connection', (socket) => {
  console.log('客户端连接:', socket.id);

  // 用户上线
  socket.on('user-online', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`用户 ${userId} 上线`);
  });

  // 加入聊天室（两人聊天室）
  socket.on('join-chat', (userId1, userId2) => {
    const chatRoomId = [userId1, userId2].sort().join('_');
    socket.join(chatRoomId);
    console.log(`用户 ${socket.id} 加入聊天室 ${chatRoomId}`);
  });

  // 发送消息（通过 Socket.IO）
  socket.on('send-message', async (data) => {
    // data 应该包含：sender, receiver, message, type 等
    const chatRoomId = [data.sender, data.receiver].sort().join('_');
    io.to(chatRoomId).emit('receive-message', data);
  });

  // 输入状态
  socket.on('typing', (data) => {
    const chatRoomId = [data.sender, data.receiver].sort().join('_');
    socket.to(chatRoomId).emit('user-typing', {
      userId: data.sender,
      userName: data.userName
    });
  });

  socket.on('stop-typing', (data) => {
    const chatRoomId = [data.sender, data.receiver].sort().join('_');
    socket.to(chatRoomId).emit('user-stop-typing', {
      userId: data.sender
    });
  });

  // 用户下线
  socket.on('disconnect', () => {
    console.log('客户端断开连接:', socket.id);
  });
});

// 将 io 实例暴露给应用
app.set('io', io);

// 启动服务器
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║           乡村助学平台 - 后端服务                       ║
╠════════════════════════════════════════════════════════╣
║  服务器运行在：http://localhost:${PORT}                   ║
║  环境：${process.env.NODE_ENV || 'development'}                              ║
║  Socket.IO: 已启用                                      ║
╚════════════════════════════════════════════════════════╝
  `);
});

module.exports = { app, io };
