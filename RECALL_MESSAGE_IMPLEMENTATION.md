# 消息撤回功能实现文档

**实现日期：** 2026-04-22  
**功能模块：** 实时聊天系统 - 消息撤回  
**优先级：** P0

---

## 📋 功能概述

允许用户在消息发送后 **2 分钟内** 撤回已发送的消息。撤回后，消息内容会被替换为"↩️ 消息已撤回"，双方都能看到撤回提示。

---

## 🔧 实现内容

### 后端修改 (Spring Boot)

#### 1. 数据库变更
**文件：** `database/recall_message_migration.sql`

新增字段：
- `recalled_at` - 消息撤回时间 (DATETIME)
- `recalled_by` - 撤回者 ID (BIGINT)

```sql
ALTER TABLE chat_records ADD COLUMN recalled_at DATETIME DEFAULT NULL;
ALTER TABLE chat_records ADD COLUMN recalled_by BIGINT DEFAULT NULL;
ALTER TABLE chat_records ADD INDEX idx_recalled_at (recalled_at);
```

#### 2. 实体类更新
**文件：** `backend/src/main/java/com/tutoring/entity/ChatRecord.java`

新增字段：
```java
@TableField("recalled_at")
private LocalDateTime recalledAt;

@TableField("recalled_by")
private Long recalledBy;
```

#### 3. DTO 更新
**文件：** `backend/src/main/java/com/tutoring/dto/ChatMessage.java`

新增字段：
```java
private Boolean isRecalled;
private LocalDateTime recalledAt;
private Long recalledBy;
```

#### 4. Service 层新增方法
**文件：** `backend/src/main/java/com/tutoring/service/ChatRecordService.java`

- `recallMessage(Long messageId, Long operatorId)` - 撤回消息
- `canRecall(ChatRecord record)` - 检查是否可撤回（2 分钟内）

#### 5. Controller 层新增接口
**文件：** `backend/src/main/java/com/tutoring/controller/ChatController.java`

**API 端点：**
```
POST /api/chat/recall/{messageId}
Header: X-User-Id: {当前用户 ID}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "撤回成功",
  "data": { ...ChatRecord }
}
```

**错误响应：**
- `404` - 消息不存在
- `400` - 超过撤回时限（2 分钟）
- `403` - 只有消息发送者才能撤回
- `500` - 撤回失败

---

### 前端修改 (React)

#### 1. API 服务更新
**文件：** `student-frontend/src/services/chatApi.js`  
**文件：** `teacher-frontend/src/services/chatApi.js`

新增方法：
```javascript
recallMessage: (messageId) => {
  return api.post(`/chat/recall/${messageId}`)
}
```

#### 2. 聊天页面更新
**文件：** `student-frontend/src/pages/Chat.jsx`  
**文件：** `teacher-frontend/src/pages/Chat.jsx`

**新增功能：**
- 右键点击自己发送的消息（2 分钟内）显示撤回按钮
- 撤回后消息显示为"↩️ 消息已撤回"
- 实时接收对方的撤回通知
- 撤回成功提示

**关键代码：**
```javascript
// 撤回消息处理
const recallMessage = async (messageId) => {
  await chatAPI.recallMessage(messageId)
  setMessages(prev => prev.map(msg => 
    msg.messageId === messageId
      ? { ...msg, isRecalled: true, recalledAt: ..., recalledBy: currentUser.id }
      : msg
  ))
}

// 检查是否可撤回（2 分钟内）
const canRecall = (msg) => {
  if (!msg.timestamp || msg.isRecalled) return false
  const diffMinutes = dayjs().diff(dayjs(msg.timestamp), 'minute')
  return diffMinutes <= 2
}
```

#### 3. WebSocket 消息处理
**新增：** 处理撤回通知（type=100）

```javascript
if (data.type === 100 || data.isRecalled) {
  setMessages(prev => prev.map(msg => 
    msg.messageId === data.messageId
      ? { ...msg, isRecalled: true, recalledAt: data.recalledAt }
      : msg
  ))
  antdMessage.success('对方撤回了一条消息')
}
```

---

## 🎯 使用流程

### 撤回自己的消息
1. 在聊天窗口中，**右键点击**自己发送的消息（2 分钟内）
2. 点击弹出的"撤回"按钮
3. 消息内容变为"↩️ 消息已撤回"
4. 对方实时收到撤回通知

### 收到对方的撤回
1. 对方撤回消息后，实时收到通知
2. 消息内容自动更新为"↩️ 消息已撤回"
3. 顶部显示提示"对方撤回了一条消息"

---

## ⚠️ 限制条件

1. **时间限制：** 仅支持撤回 2 分钟内发送的消息
2. **权限限制：** 只能撤回自己发送的消息
3. **状态限制：** 已撤回的消息不能再次撤回
4. **类型限制：** 支持文字、图片、语音所有消息类型

---

## 🧪 测试建议

### 后端测试
```bash
# 1. 编译后端
cd backend
mvn clean compile -DskipTests

# 2. 执行数据库迁移
mysql -u root -p tutoring < database/recall_message_migration.sql

# 3. 启动后端
mvn spring-boot:run
```

### 前端测试
```bash
# 1. 学生端
cd student-frontend
npm run dev

# 2. 教师端
cd teacher-frontend
npm run dev

# 3. 测试场景：
#    - 发送消息后立即撤回（应成功）
#    - 发送消息 3 分钟后尝试撤回（应失败，提示超时）
#    - 尝试撤回对方的消息（应失败，提示权限不足）
#    - 撤回后检查双方界面是否同步更新
```

---

## 📝 API 接口文档

### 撤回消息

**请求：**
```http
POST /api/chat/recall/{messageId}
Content-Type: application/json
X-User-Id: 123456
```

**成功响应 (200)：**
```json
{
  "code": 200,
  "message": "撤回成功",
  "data": {
    "id": 789,
    "senderId": 123456,
    "receiverId": 654321,
    "message": "原消息内容",
    "recalledAt": "2026-04-22 10:30:00",
    "recalledBy": 123456
  }
}
```

**失败响应 (400)：**
```json
{
  "code": 400,
  "message": "超过撤回时限（2 分钟）"
}
```

---

## 🔄 后续优化建议

1. **延长撤回时间：** 可根据需求调整为 5 分钟或更长
2. **撤回原因：** 支持用户选择或填写撤回原因
3. **撤回记录：** 在后台记录撤回日志供管理员查看
4. **批量撤回：** 支持一次性撤回多条消息
5. **撤回恢复：** 支持在一定时间内恢复已撤回的消息

---

## ✅ 完成清单

- [x] 数据库字段添加
- [x] 实体类更新
- [x] DTO 更新
- [x] Service 层实现
- [x] Controller 层实现
- [x] 学生端前端实现
- [x] 教师端前端实现
- [x] WebSocket 撤回通知
- [x] 右键菜单 UI
- [x] 撤回状态显示
- [ ] 家长端前端实现（如需要）
- [ ] 管理端前端实现（如需要）
- [ ] 单元测试
- [ ] 集成测试

---

**实现者：** 小龙虾 🦞  
**审核状态：** 待测试
