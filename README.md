# 乡村助学平台 (Student Tutoring System)

乡村助学平台旨在为城里的教师和乡村的孩子们搭建一个教学辅导、心理教育的平台，解决教育公平问题，让农村孩子能够接受优质教育，并为留守儿童提供及时的心理干预。

## 项目结构

```
student_tutoring_system/
├── admin-frontend/          # 管理员端 React 前端 (端口 3001)
├── teacher-frontend/        # 教师端 React 前端 (端口 3002)
├── student-frontend/        # 学生端 React 前端 (端口 3003)
├── parent-frontend/         # 家长端 React 前端 (端口 3004)
├── backend/                 # Spring Boot 后端 (端口 8080)
├── database/                # 数据库相关文件
│   └── schema.sql          # 数据库表结构
└── 老师给的文件/             # 参考文档和 UI 设计稿
```

## 技术栈

### 前端 (四个独立的 React 项目)
- **框架**: React 18
- **UI 组件库**: Ant Design 5
- **状态管理**: Redux Toolkit
- **路由**: React Router 6
- **构建工具**: Vite 5
- **实时通信**: WebSocket (SockJS + STOMP)
- **HTTP 客户端**: Axios

### 后端
- **语言**: Java 17
- **框架**: Spring Boot 3.2
- **安全**: Spring Security + JWT
- **ORM**: MyBatis-Plus
- **数据库**: MySQL 8.0
- **缓存**: Redis
- **实时通信**: Spring WebSocket
- **对象存储**: 阿里云 OSS

## 快速开始

### 环境要求
- Node.js 18+
- Java 17+
- Maven 3.8+
- MySQL 8.0+
- Redis 6.0+

### 1. 数据库初始化

```bash
# 登录 MySQL
mysql -u root -p

# 执行 schema 文件
source database/schema.sql
```

### 2. 后端启动

```bash
cd backend

# 配置环境变量 (可选，默认值在 application.yml 中)
export DB_HOST=localhost
export DB_USERNAME=root
export DB_PASSWORD=your_password
export REDIS_HOST=localhost
export JWT_SECRET=your-secret-key

# 启动
mvn spring-boot:run
```

### 3. 前端启动

#### 管理员端
```bash
cd admin-frontend
npm install
npm run dev
# 访问 http://localhost:3001
```

#### 教师端
```bash
cd teacher-frontend
npm install
npm run dev
# 访问 http://localhost:3002
```

#### 学生端
```bash
cd student-frontend
npm install
npm run dev
# 访问 http://localhost:3003
```

#### 家长端
```bash
cd parent-frontend
npm install
npm run dev
# 访问 http://localhost:3004
```

## 数据模型

### 核心表
1. **users** - 用户表 (所有角色的基础信息)
2. **students** - 学生表
3. **teachers** - 教师表
4. **parents** - 家长表
5. **parent_student_relations** - 家长学生关联表
6. **chat_records** - 聊天记录表
7. **learning_resources** - 学习资源表
8. **psychological_assessments** - 心理评估表
9. **ai_matches** - AI 匹配记录表
10. **teacher_student_matches** - 师生匹配表

详细表结构请查看 `database/schema.sql`

## 核心功能

### 1. 用户认证与管理
- 角色注册和登录 (教师/学生/家长/管理员)
- JWT Token 认证
- 权限控制

### 2. 聊天沟通系统
- 实时文字聊天
- 图片/语音消息
- 消息历史记录
- WebSocket 长连接

### 3. 教学辅导功能
- 学习计划制定
- 作业布置与批改
- 学习进度跟踪

### 4. 心理教育功能
- 心理状态评估
- 心理辅导记录
- 心理干预建议

### 5. AI 智能匹配
- 基于学生需求匹配合适的教师
- 基于教师专长筛选目标学生
- 个性化学习推荐

### 6. 师生匹配系统
- 学生向老师发送辅导请求
- 老师向学生发送辅导邀请
- 家长确认学生的匹配请求
- 匹配状态管理和跟踪

## API 规范

### 统一返回格式
```json
{
  "code": 200,
  "message": "成功",
  "data": {...}
}
```

### 状态码
- `200` - 成功
- `400` - 请求参数错误
- `401` - 未登录
- `403` - 无权限
- `500` - 服务器错误

## 安全规范

- 所有密钥通过环境变量配置，禁止硬编码
- 密码使用 BCrypt 加密存储
- JWT Token 设置合理过期时间
- 敏感接口需要权限验证
- SQL 注入防护 (MyBatis-Plus 参数化查询)

## 开发计划

- [ ] 用户认证模块
- [ ] 聊天沟通模块
- [ ] 教学资源模块
- [ ] 心理评估模块
- [ ] AI 匹配模块
- [ ] 师生匹配模块
- [ ] 管理后台功能
- [ ] 测试与优化
- [ ] 部署上线

## 注意事项

1. 前端四个项目是独立的，需要分别安装依赖和启动
2. 后端需要配置正确的数据库和 Redis 连接信息
3. WebSocket 需要配置正确的代理 (开发环境已配置在 vite.config.js)
4. 生产环境需要配置阿里云 OSS 用于文件存储

## 联系方式

如有问题，请联系项目维护者。
