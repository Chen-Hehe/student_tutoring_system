# 学生端前端 - 乡村助学平台

基于 React + Ant Design + Redux Toolkit 的学生端前端应用。

## 技术栈

- **React 18** - UI 框架
- **Ant Design 5** - UI 组件库
- **Redux Toolkit** - 状态管理
- **React Router 6** - 路由管理
- **Axios** - HTTP 客户端
- **Vite** - 构建工具

## 功能模块

- 📊 **仪表盘** - 学习进度、课程统计、心理状态概览
- 👩‍🏫 **教师选择** - 浏览教师列表、发送辅导请求
- 💬 **聊天沟通** - 与辅导老师实时沟通
- 📚 **学习资源** - 浏览和下载学习资料
- ❤️ **心理支持** - 心情打卡、心理测评
- 🤖 **AI 推荐** - 个性化教师、资源、课程推荐
- 🤝 **匹配管理** - 查看辅导请求和匹配状态

## 快速开始

### 安装依赖

```bash
cd student-frontend
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3001

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
student-frontend/
├── src/
│   ├── components/          # 公共组件
│   │   └── Layout.jsx       # 主布局组件
│   ├── pages/               # 页面组件
│   │   ├── Login.jsx        # 登录页
│   │   ├── Register.jsx     # 注册页
│   │   ├── Dashboard.jsx    # 仪表盘
│   │   ├── TeacherSelection.jsx  # 教师选择
│   │   ├── Chat.jsx         # 聊天
│   │   ├── Resources.jsx    # 学习资源
│   │   ├── Psychological.jsx # 心理支持
│   │   ├── AIRecommendation.jsx # AI 推荐
│   │   └── Match.jsx        # 匹配管理
│   ├── services/            # API 服务
│   │   └── api.js           # Axios 配置
│   ├── store/               # Redux store
│   │   ├── index.js         # store 配置
│   │   └── slices/          # Redux slices
│   │       └── authSlice.js # 认证状态
│   ├── utils/               # 工具函数
│   ├── App.jsx              # 路由配置
│   ├── main.jsx             # 入口文件
│   └── index.css            # 全局样式
├── index.html
├── package.json
└── vite.config.js
```

## API 配置

在 `vite.config.js` 中配置了开发环境代理：

- `/api` → `http://localhost:8080` (后端服务)
- `/ws` → `http://localhost:8080` (WebSocket)

请确保后端服务在 8080 端口运行。

## 认证流程

1. 用户登录/注册
2. 获取 JWT token
3. Token 存储在 localStorage
4. 后续请求自动携带 Authorization header

## 注意事项

- 所有页面使用模拟数据，需要对接后端 API
- WebSocket 聊天功能需要后端支持 STOMP 协议
- 生产环境需要修改 API 基础 URL
