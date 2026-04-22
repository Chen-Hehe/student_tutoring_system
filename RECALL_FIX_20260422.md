# 消息撤回功能修复报告

**修复日期：** 2026-04-22  
**修复者：** 小龙虾 🦞

---

## 🐛 问题汇总

### 问题 1：messageId 为 undefined
**错误信息：**
```
POST http://localhost:8080/api/chat/recall/undefined 500
```

**原因：**
- 后端 `saveAndPushMessage` 返回的是 `ChatRecord` 实体，字段名是 `id`
- 前端期望的是 `messageId` 字段
- 字段名不匹配导致前端 `msg.messageId` 为 `undefined`

**修复：**
- 修改 `ChatController.sendMessage` 返回类型从 `Result<ChatRecord>` 改为 `Result<Map<String, Object>>`
- 使用 `convertToChatMessagePublic` 方法将 `ChatRecord` 转换为 DTO
- 确保返回的 JSON 中包含 `messageId` 字段

---

### 问题 2：已读状态不同步
**问题描述：** 刷新页面后才能更新已读状态

**原因：**
- `markAsRead` 方法只更新了数据库，没有推送已读状态给发送者
- 发送者的 WebSocket 没有收到已读通知

**修复：**
- 在 `ChatRecordService.markAsRead` 中添加 WebSocket 推送逻辑
- 发送 type=0 的已读通知给消息发送者
- 前端监听 type=0 的消息并更新 UI

---

### 问题 3：撤回通知缺少 isRecalled 字段
**原因：**
- 撤回通知的 `ChatMessage` 没有设置 `isRecalled` 字段
- 前端无法正确识别撤回状态

**修复：**
- 在撤回通知中明确设置 `recallNotification.setIsRecalled(true)`

---

## 📊 数据库字段说明

### 新增字段含义

| 字段名 | 类型 | 含义 | 示例 |
|--------|------|------|------|
| `recalled_at` | DATETIME | **消息撤回时间**<br>记录消息被撤回的具体时间<br>NULL 表示未撤回 | `2026-04-22 10:30:15` |
| `recalled_by` | BIGINT | **撤回者 ID**<br>执行撤回操作的用户的 ID<br>通常等于 senderId（只有发送者能撤回） | `123456` |

### 字段用途

**recalled_at（撤回时间）：**
- 用于判断消息是否已被撤回
- 用于显示撤回提示
- 用于日志和审计

**recalled_by（撤回者 ID）：**
- 用于记录是谁执行了撤回操作
- 支持未来可能的"管理员代撤回"功能
- 用于日志和审计

### 使用示例

```sql
-- 查询某条消息的撤回信息
SELECT id, message, recalled_at, recalled_by 
FROM chat_records 
WHERE id = 789;

-- 结果示例：
-- id=789, message="你好", recalled_at="2026-04-22 10:30:15", recalled_by=123456
-- 表示：用户 123456 在 10:30:15 撤回了这条消息
```

---

## ✅ 修复内容清单

### 后端修改

| 文件 | 修改内容 |
|------|----------|
| `ChatController.java` | 修改 sendMessage 返回类型为 `Result<Map>`，确保返回 `messageId` |
| `ChatRecordService.java` | 1. 添加 `convertToChatMessagePublic` 方法<br>2. 修复 `markAsRead` 添加 WebSocket 推送<br>3. 修复撤回通知添加 `isRecalled` 字段 |
| `ChatMessage.java` | 添加 `readerId` 字段用于已读通知 |

### 前端修改

| 文件 | 修改内容 |
|------|----------|
| `student-frontend/Chat.jsx` | 1. 修复 sendMessage 确保 `messageId` 正确传递<br>2. 修复 WebSocket 已读处理（type=0） |
| `teacher-frontend/Chat.jsx` | 同上 |

---

## 🧪 测试步骤

### 1. 执行数据库迁移（如果还没执行）
```bash
mysql -u root -p tutoring < database/recall_message_migration.sql
```

### 2. 重启后端
```bash
cd backend
mvn spring-boot:run
```

### 3. 重启前端
```bash
# 学生端
cd student-frontend
npm run dev

# 教师端
cd teacher-frontend
npm run dev
```

### 4. 测试场景

**场景 A：撤回功能**
1. 学生 A 发送消息给教师 B
2. 学生 A 右键点击自己发送的消息（2 分钟内）
3. 点击"撤回"按钮
4. ✅ 预期：消息变为"↩️ 消息已撤回"，教师 B 实时看到撤回提示

**场景 B：已读状态同步**
1. 学生 A 发送消息给教师 B
2. 教师 B 打开聊天窗口（自动标记为已读）
3. ✅ 预期：学生 A 的消息旁边实时显示"✓"（已读），无需刷新页面

**场景 C：超过撤回时限**
1. 等待消息发送超过 2 分钟
2. 右键点击消息
3. ✅ 预期：不显示撤回按钮，或点击后提示"超过撤回时限"

---

## 🔧 技术细节

### 消息类型定义

| Type | 含义 | 用途 |
|------|------|------|
| 0 | 已读通知 | 标记消息已读 |
| 1 | 文字消息 | 普通文本 |
| 2 | 图片消息 | 图片 |
| 3 | 语音消息 | 语音 |
| 100 | 撤回通知 | 消息被撤回 |

### WebSocket 消息格式

**已读通知：**
```json
{
  "type": 0,
  "readerId": 654321,
  "senderId": 123456,
  "receiverId": 123456
}
```

**撤回通知：**
```json
{
  "type": 100,
  "messageId": 789,
  "isRecalled": true,
  "recalledAt": "2026-04-22 10:30:15",
  "recalledBy": 123456,
  "senderId": 123456,
  "receiverId": 654321
}
```

---

## 📝 后续优化建议

1. **撤回时限可配置：** 将 2 分钟改为可配置参数
2. **撤回原因：** 支持用户选择撤回原因（发错了、不想发了等）
3. **撤回日志：** 记录所有撤回操作到日志表
4. **批量撤回：** 支持一键撤回多条消息
5. **撤回恢复：** 支持在特定时间内恢复已撤回的消息

---

**修复完成！** ✅  
请重新测试撤回功能和已读状态同步，应该都正常工作了。🦞
