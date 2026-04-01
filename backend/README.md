# 乡村助学平台 - 后端服务

## 项目结构

```
backend/
├── config/
│   └── database.js          # MongoDB 数据库连接配置
├── models/
│   ├── User.js              # 用户模型
│   ├── Student.js           # 学生模型
│   ├── Teacher.js           # 教师模型
│   ├── Parent.js            # 家长模型
│   ├── ChatRecord.js        # 聊天记录模型
│   ├── LearningResource.js  # 学习资源模型
│   ├── PsychologicalAssessment.js  # 心理评估模型
│   ├── AIMatch.js           # AI 匹配记录模型
│   └── TeacherStudentMatch.js      # 师生匹配模型
├── routes/
│   ├── auth.js              # 认证路由
│   ├── users.js             # 用户管理路由
│   ├── chat.js              # 聊天路由
│   ├── resources.js         # 资源管理路由
│   └── matches.js           # 匹配管理路由
├── controllers/
│   ├── authController.js    # 认证控制器
│   └── userController.js    # 用户管理控制器
├── middleware/
│   └── auth.js              # JWT 认证中间件
├── .env.example             # 环境变量示例
├── .gitignore
├── package.json
└── server.js                # 服务器入口文件
```

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 服务器端口
PORT=3000

# MongoDB 连接字符串
MONGODB_URI=mongodb://localhost:27017/rural-education-platform

# JWT 密钥 (生产环境请修改为随机字符串)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# JWT 过期时间
JWT_EXPIRE=7d

# Socket.IO CORS 配置
CORS_ORIGIN=http://localhost:5173
```

### 3. 启动 MongoDB

确保本地 MongoDB 服务已启动：

```bash
# Windows (以管理员身份运行)
net start MongoDB

# 或使用 MongoDB Compass 连接
```

### 4. 启动服务器

开发模式（支持热重载）：

```bash
npm run dev
```

生产模式：

```bash
npm start
```

## API 文档

### 认证接口

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| POST | `/api/auth/register` | 用户注册 | 公开 |
| POST | `/api/auth/login` | 用户登录 | 公开 |
| GET | `/api/auth/me` | 获取当前用户信息 | 已登录 |
| PUT | `/api/auth/update` | 更新用户信息 | 已登录 |
| PUT | `/api/auth/change-password` | 修改密码 | 已登录 |

### 文件上传接口

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| POST | `/api/upload/:type` | 上传单个文件 | 已登录 |
| POST | `/api/upload/batch/:type` | 批量上传文件 | 已登录 |

type 可选值：`image`, `document`, `video`, `audio`

### 用户管理接口

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/api/users` | 获取所有用户 | 管理员 |
| GET | `/api/users/teachers` | 获取所有教师 | 公开 |
| GET | `/api/users/students` | 获取所有学生 | 教师/管理员 |
| GET | `/api/users/:id` | 获取单个用户 | 已登录 |
| PUT | `/api/users/:id` | 更新用户 | 管理员 |
| DELETE | `/api/users/:id` | 删除用户 | 管理员 |

### 聊天接口

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/api/chat/:userId` | 获取聊天记录 | 已登录 |
| GET | `/api/chat/conversations/list` | 获取聊天列表 | 已登录 |
| PUT | `/api/chat/:userId/read` | 标记消息已读 | 已登录 |

### 资源管理接口

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/api/resources` | 获取资源列表 | 公开 |
| GET | `/api/resources/:id` | 获取单个资源 | 公开 |
| POST | `/api/resources` | 创建资源 | 已登录 |
| PUT | `/api/resources/:id` | 更新资源 | 上传者/管理员 |
| DELETE | `/api/resources/:id` | 删除资源 | 上传者/管理员 |

### 匹配管理接口

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| POST | `/api/matches/request` | 创建匹配请求 | 已登录 |
| GET | `/api/matches` | 获取我的匹配列表 | 已登录 |
| PUT | `/api/matches/:id/confirm` | 确认匹配 | 已登录 |
| PUT | `/api/matches/:id/reject` | 拒绝匹配 | 已登录 |
| GET | `/api/matches/ai/recommend-teachers` | AI 推荐教师 | 学生 |
| GET | `/api/matches/ai/recommend-students` | AI 推荐学生 | 教师 |
| POST | `/api/matches/ai/run` | 执行 AI 匹配 | 管理员 |

### 心理评估接口

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| POST | `/api/psychological` | 创建心理评估 | 教师/管理员 |
| GET | `/api/psychological/student/:studentId` | 获取学生评估历史 | 已登录 |
| PUT | `/api/psychological/:id` | 更新心理评估 | 教师/管理员 |
| GET | `/api/psychological/attention/needed` | 获取需关注学生 | 教师/管理员 |

### 聊天接口（已更新）

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/api/chat/conversations` | 获取聊天列表 | 已登录 |
| POST | `/api/chat/send` | 发送消息 | 已登录 |
| GET | `/api/chat/:userId` | 获取聊天记录 | 已登录 |
| PUT | `/api/chat/:userId/read` | 标记消息已读 | 已登录 |
| DELETE | `/api/chat/:messageId` | 删除消息 | 已登录 |

## Socket.IO 实时通信

### 连接事件

```javascript
// 客户端连接
socket.on('connection', (socket) => {
  // 加入聊天室
  socket.on('join-chat', (chatRoomId) => {
    socket.join(chatRoomId);
  });

  // 发送消息
  socket.on('send-message', (data) => {
    io.to(data.chatRoomId).emit('receive-message', data);
  });

  // 输入状态
  socket.on('typing', (data) => {
    socket.to(data.chatRoomId).emit('user-typing', data);
  });
});
```

## 数据模型说明

### User (用户)
所有角色的基础用户信息，包含认证信息。

### Student (学生)
学生的详细信息，关联 User 模型。

### Teacher (教师)
教师的详细信息，包含科目、教育背景等。

### Parent (家长)
家长的详细信息，可关联多个学生。

### ChatRecord (聊天记录)
存储所有聊天消息，支持文字、图片、语音等类型。

### LearningResource (学习资源)
教学资料，支持文档、视频、音频等类型。

### PsychologicalAssessment (心理评估)
学生心理状态评估记录。

### AIMatch (AI 匹配)
AI 智能匹配推荐记录。

### TeacherStudentMatch (师生匹配)
师生匹配请求和状态管理。

## 开发注意事项

1. **密码加密**: 所有密码使用 bcryptjs 加密存储
2. **JWT 认证**: 使用 jsonwebtoken 进行身份验证
3. **CORS**: 已配置跨域，允许前端访问
4. **错误处理**: 统一的错误处理中间件
5. **环境变量**: 敏感信息通过环境变量管理

## 测试数据

使用种子脚本快速创建测试数据：

```bash
npm run seed
```

测试账号：
- 管理员：`admin / 123456`
- 教师：`teacher_zhang / 123456`, `teacher_li / 123456`
- 家长：`parent_wang / 123456`, `parent_chen / 123456`
- 学生：`student_xiaoming / 123456`, `student_xiaohong / 123456`

## 下一步

- [ ] 添加数据验证（express-validator）
- [ ] 添加单元测试
- [ ] 配置日志系统
- [ ] 添加 API 文档（Swagger）
- [ ] 实现邮件通知功能
- [ ] 添加数据备份功能
