# 消息撤回功能调试指南

**日期：** 2026-04-22  
**问题：** 撤回时提示"消息不存在"

---

## 🔍 问题分析

从日志看到：
```
SELECT ... FROM chat_records WHERE id=? AND deleted=0
==> Parameters: 2046782483265581000(Long)
<== Total: 0
```

**说明：** 查询返回 0 条记录，可能原因：

1. **消息 ID 不正确** - 前端传递的 `messageId` 与数据库中的 `id` 不匹配
2. **消息已被删除** - `deleted` 字段不是 0
3. **消息确实不存在** - 数据库中没有这条记录

---

## 🛠️ 调试步骤

### 步骤 1：检查数据库中的消息

```sql
USE tutoring;

-- 查看最新的 5 条消息
SELECT 
    id, 
    sender_id, 
    receiver_id, 
    LEFT(message, 50) AS message,
    sent_at,
    deleted,
    recalled_at,
    recalled_by
FROM chat_records 
ORDER BY id DESC 
LIMIT 10;
```

**检查要点：**
- 确认数据库中的 `id` 是否与前端传递的一致
- 确认 `deleted` 字段是否为 0

---

### 步骤 2：检查前端发送的消息对象

在浏览器控制台（F12）执行：

```javascript
// 在发送消息后，查看返回的消息对象
console.log('发送消息返回:', result.data)

// 在撤回前，查看消息列表中的对象
console.log('消息列表:', messages)
```

**预期结果：**
```javascript
{
  messageId: 2046782483265581000,  // 应该与数据库 id 一致
  senderId: 2001,
  message: "测试消息",
  ...
}
```

---

### 步骤 3：验证消息 ID 格式

**常见问题：** JavaScript 的 number 类型精度问题

JavaScript 中 `Number.MAX_SAFE_INTEGER = 9007199254740991`（约 9×10^15）

雪花算法生成的 ID 可能超过这个范围（如 `2046782483265581000`），导致精度丢失。

**解决方案：** 后端返回字符串格式的 ID

修改 `ChatMessage.java`：

```java
@JsonFormat(shape = JsonFormat.Shape.STRING)
private Long messageId;
```

或者前端使用 BigInt：

```javascript
const messageId = BigInt(msg.messageId).toString()
```

---

### 步骤 4：手动测试撤回 SQL

```sql
-- 替换 ID 为实际值
SET @test_id = 2046782483265581000;

-- 查询该消息
SELECT id, sender_id, deleted, recalled_at 
FROM chat_records 
WHERE id = @test_id;

-- 如果 deleted != 0，说明消息被逻辑删除了
-- 如果查询结果为空，说明 ID 不存在
```

---

## ✅ 解决方案

### 方案 A：检查消息是否真的存在

执行以下 SQL 确认：

```sql
SELECT COUNT(*) FROM chat_records WHERE id = 2046782483265581000;
```

如果返回 0，说明消息确实不存在，可能是：
- 前端传递的 ID 错误
- 消息没有被正确保存到数据库

---

### 方案 B：检查前端 messageId

在 `Chat.jsx` 的 `sendMessage` 函数后添加：

```javascript
const result = await chatAPI.sendMessage(...)
console.log('【DEBUG】发送消息返回:', result.data)
console.log('【DEBUG】messageId 类型:', typeof result.data.messageId)
console.log('【DEBUG】messageId 值:', result.data.messageId)
```

**预期：**
- `messageId` 应该是数字或字符串
- 应该与数据库中的 `id` 一致

---

### 方案 C：检查雪花算法 ID 生成

雪花算法生成的 ID 是 19 位数字，可能超出 JavaScript 的安全范围。

**后端返回时使用字符串：**

修改 `ChatController.java`：

```java
responseData.put("messageId", String.valueOf(messageDTO.getMessageId()));
```

**前端接收后保持字符串格式：**

```javascript
// 不要转换为 number
const messageId = result.data.messageId  // 保持字符串
```

---

## 🔧 快速验证脚本

```sql
-- 1. 查看最新消息及其状态
SELECT 
    id,
    sender_id,
    LEFT(message, 30) AS msg,
    sent_at,
    TIMESTAMPDIFF(MINUTE, sent_at, NOW()) AS minutes_ago,
    deleted,
    recalled_at
FROM chat_records 
ORDER BY id DESC 
LIMIT 5;

-- 2. 检查是否有 deleted != 0 的消息
SELECT COUNT(*) AS deleted_count 
FROM chat_records 
WHERE deleted != 0;

-- 3. 恢复被误删的消息（如果需要）
UPDATE chat_records 
SET deleted = 0 
WHERE id = 2046782483265581000;
```

---

## 📝 下次测试前

1. **确认数据库有测试消息：**
   ```sql
   SELECT COUNT(*) FROM chat_records;
   -- 应该 > 0
   ```

2. **确认消息的 deleted = 0：**
   ```sql
   SELECT id, deleted FROM chat_records ORDER BY id DESC LIMIT 1;
   ```

3. **清除 Redis 缓存：**
   ```bash
   redis-cli KEYS "chat:history:*" | xargs redis-cli DEL
   ```

4. **重启后端**

---

**最后更新：** 2026-04-22 10:53
