# 🦞 乡村助学平台 - 项目实现计划书

**项目名称：** Student Tutoring System（乡村助学平台）  
**技术栈：** Spring Boot 3.2.3 + React + MySQL + Redis + WebSocket  
**创建时间：** 2026-04-21  
**当前状态：** 基础架构已完成，进入功能完善阶段

---

## 📋 项目概述

### 系统架构
```
┌─────────────────────────────────────────────────────────────────┐
│                        前端层 (React + Vite)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ 学生端   │  │ 教师端   │  │ 家长端   │  │ 管理端   │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    后端层 (Spring Boot 3.2.3)                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Controller │  Service  │  Repository │  Entity  │  Util │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         WebSocket + Redis Pub/Sub (实时通信)              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      数据层 (MySQL + Redis)                       │
│  ┌──────────────────┐         ┌──────────────────┐              │
│  │   MySQL 数据库   │         │   Redis 缓存      │              │
│  │   - 用户数据     │         │   - 会话缓存      │              │
│  │   - 课程数据     │         │   - 消息队列      │              │
│  │   - 学习记录     │         │   - 实时推送      │              │
│  └──────────────────┘         └──────────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### 核心功能模块
| 模块 | 功能描述 | 优先级 |
|------|----------|--------|
| 用户系统 | 注册/登录/权限管理/JWT 认证 | P0 |
| 实时聊天 | WebSocket+Redis 消息推送 | P0 |
| 师生匹配 | AI 智能匹配 + 手动选择 | P0 |
| 心理辅导 | 心理测评 + 状态追踪 | P1 |
| 学习资源 | 资料上传/下载/分享 | P1 |
| 学习报告 | 学习进度追踪 + AI 分析 | P2 |
| 家长端 | 查看孩子学习情况 | P2 |
| 管理端 | 用户/内容/数据管理 | P2 |

---

## 🗂️ 数据库设计

### 核心表结构
```
users                    # 用户表 (所有角色的基础表)
├── id, username, password, role, name, email, phone
└── avatar, created_at, updated_at, deleted

students                 # 学生表
├── id, user_id, grade, school, class_name
└── learning_level, preferences

teachers                 # 教师表
├── id, user_id, subject, teaching_experience
├── qualifications, rating
└── availability_status

parents                  # 家长表
├── id, user_id, relation_to_child
└── contact_preferences

teacher_student_matches  # 师生匹配表
├── id, teacher_id, student_id, match_type
├── status, matched_at, started_at, ended_at
└── match_score, notes

chat_records             # 聊天记录表
├── id, sender_id, receiver_id, message
├── type, file_url, sent_at, is_read
└── deleted

psychological_statuses   # 心理状态表
├── id, student_id, emotion_status, social_status
├── stress_status, mental_status
└── created_at, updated_at

psychological_assessments # 心理测评表
├── id, status_id, assessment_type
├── percentage, level
└── created_at

learning_resources       # 学习资源表
├── id, uploader_id, title, description
├── file_url, file_type, subject
└── download_count, created_at

learning_reports         # 学习报告表
├── id, student_id, teacher_id
├── period, summary, progress
├── strengths, weaknesses, suggestions
└── created_at
```

---

## 📦 功能实现计划

### 阶段一：核心功能完善 (P0) - 预计 3-5 天

#### 1.1 用户系统 ✅ (已完成)
- [x] JWT 认证机制
- [x] 注册/登录接口
- [x] 角色权限控制
- [ ] 密码找回功能
- [ ] 个人信息编辑

#### 1.2 实时聊天系统 🔄 (部分完成)
- [x] WebSocket 连接管理
- [x] Redis Pub/Sub 消息推送
- [x] 聊天记录存储
- [x] 消息已读状态同步
- [ ] 文件/图片发送
- [ ] 消息撤回功能
- [ ] 离线消息推送

**当前问题：** 教师端消息接收延迟（昨日已修复 Redis 监听器配置）

#### 1.3 师生匹配系统 🔄 (部分完成)
- [x] 匹配请求接口
- [x] 手动选择教师
- [ ] AI 智能匹配算法
- [ ] 匹配历史记录
- [ ] 匹配评价系统

---

### 阶段二：学习功能 (P1) - 预计 5-7 天

#### 2.1 心理辅导系统 🔄 (部分完成)
- [x] 心理测评问卷
- [x] 心理状态展示
- [ ] AI 心理分析建议
- [ ] 预约心理咨询
- [ ] 心理状态趋势图

#### 2.2 学习资源管理 🔄 (部分完成)
- [x] 资源上传接口
- [x] 资源列表展示
- [ ] 资源分类/标签
- [ ] 资源搜索功能
- [ ] 下载统计
- [ ] 资源评价

#### 2.3 课程管理 (新增)
- [ ] 课程创建/编辑
- [ ] 课程表展示
- [ ] 预约/取消课程
- [ ] 课程提醒
- [ ] 课程回放

---

### 阶段三：数据分析 (P2) - 预计 3-5 天

#### 3.1 学习报告系统
- [ ] 学习进度追踪
- [ ] AI 学习分析
- [ ] 周报/月报生成
- [ ] 薄弱知识点识别
- [ ] 个性化学习建议

#### 3.2 数据统计看板
- [ ] 学生学习时长统计
- [ ] 教师授课统计
- [ ] 匹配成功率分析
- [ ] 用户活跃度分析

---

### 阶段四：家长端 + 管理端 (P2) - 预计 3-5 天

#### 4.1 家长端功能
- [ ] 绑定孩子账号
- [ ] 查看学习报告
- [ ] 查看聊天记录
- [ ] 与教师沟通
- [ ] 缴费/续费

#### 4.2 管理端功能
- [ ] 用户管理
- [ ] 内容审核
- [ ] 数据统计
- [ ] 系统配置
- [ ] 日志查看

---

## 🎯 前端页面清单

### 学生端 (student-frontend)
| 页面 | 状态 | 说明 |
|------|------|------|
| Login.jsx | ✅ | 登录页 |
| Register.jsx | ✅ | 注册页 |
| Dashboard.jsx | ✅ | 仪表盘 |
| Chat.jsx | ✅ | 聊天页 |
| Match.jsx | ✅ | 匹配页 |
| MatchManagement.jsx | ✅ | 匹配管理 |
| Psychological.jsx | ✅ | 心理测评 |
| Resources.jsx | ✅ | 学习资源 |
| TeacherSelection.jsx | ✅ | 选择教师 |
| AIRecommendation.jsx | ✅ | AI 推荐 |

### 教师端 (teacher-frontend)
| 页面 | 状态 | 说明 |
|------|------|------|
| Login.jsx | ✅ | 登录页 |
| Register.jsx | ✅ | 注册页 |
| Dashboard.jsx | ✅ | 仪表盘 |
| Chat.jsx | ✅ | 聊天页 |
| MatchManagement.jsx | ✅ | 匹配管理 |
| Psychological.jsx | ✅ | 心理查看 |
| Resources.jsx | ✅ | 学习资源 |
| StudentManagement.jsx | ✅ | 学生管理 |
| AIMatch.jsx | ✅ | AI 匹配 |

---

## 🐛 已知问题追踪

| 问题 | 优先级 | 状态 | 描述 |
|------|--------|------|------|
| 消息推送延迟 | P0 | 🔄 修复中 | 教师端无法实时接收消息（Redis 监听器配置问题） |
| 启动失败 | P0 | ✅ 已修复 | Git 合并冲突标记导致编译失败 |
| SQL 执行功能 | P1 | ⏳ 待实现 | 大模型只能说出 SQL 但无法执行 |

---

## 📅 开发日程建议

### Week 1 (04-21 ~ 04-27)
- [ ] 修复消息推送问题
- [ ] 完善聊天功能（文件发送、已读状态）
- [ ] 实现 AI 智能匹配算法
- [ ] 完善心理测评功能

### Week 2 (04-28 ~ 05-04)
- [ ] 学习资源管理完善
- [ ] 课程管理功能开发
- [ ] 学习报告系统开发
- [ ] 数据统计看板

### Week 3 (05-05 ~ 05-11)
- [ ] 家长端功能开发
- [ ] 管理端功能开发
- [ ] 系统测试与优化
- [ ] 文档完善

---

## 🔧 开发环境要求

### 后端
- Java 17+
- Maven 3.8+
- MySQL 8.0+
- Redis 6.0+
- Node.js 18+ (前端开发)

### 环境变量
```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tutoring
DB_USERNAME=root
DB_PASSWORD=your_password

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-secret-key-must-be-at-least-32-characters
```

---

## 📝 下一步行动

**立即可开始的任务：**

1. **修复消息推送问题** (P0)
   - 验证 Redis 监听器配置
   - 测试两端消息收发

2. **完善聊天功能** (P0)
   - 添加文件/图片发送
   - 实现消息已读状态

3. **AI 匹配算法** (P1)
   - 设计匹配规则
   - 实现匹配接口

---

** cc，请告诉我你想先从哪个模块开始？我建议先修复消息推送问题，然后完善聊天功能！** 🦞
