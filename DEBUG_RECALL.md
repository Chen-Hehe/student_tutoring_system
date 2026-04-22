# 消息撤回功能调试指南

**日期：** 2026-04-22  
**问题：** 撤回后刷新页面消息恢复

---

## 🔍 问题诊断步骤

### 步骤 1：检查数据库表结构

执行以下 SQL 确认字段已添加：

```sql
USE tutoring;
DESC chat_records;
```

**预期结果：** 应该看到 `recalled_at` 和 `recalled_by` 字段

```
+-------------+--------------+------+-----+---------+-------+
| Field       | Type         | Null | Key | Default | Extra |
+-------------+--------------+------+-----+---------+-------+
| ...         | ...          | ...  | ... | ...     | ...   |
| recalled_at | datetime     | YES  |     | NULL    |       |
| recalled_by | bigint       | YES  |     | NULL    |       |
+-------------+--------------+------+-----+---------+-------+
```

**如果字段不存在，执行：**

```sql
ALTER TABLE chat_records ADD COLUMN recalled_at DATETIME DEFAULT NULL COMMENT '消息撤回时间';
ALTER TABLE chat_records ADD COLUMN recalled_by BIGINT DEFAULT NULL COMMENT '撤回者 ID';
ALTER TABLE chat_records ADD INDEX idx_recalled_at (recalled_at);
```

---

### 步骤 2：测试撤回功能

1. **发送一条测试消息**
   ```sql
   -- 查看最新消息
   SELECT id, sender_id, receiver_id, message, sent_at, recalled_at, recalled_by 
   FROM chat_records 
   ORDER BY id DESC 
   LIMIT 5;
   ```

2. **记录消息 ID**（假设是 `789`）

3. **手动测试撤回 SQL**
   ```sql
   -- 测试更新
   UPDATE chat_records 
   SET recalled_at = NOW(), recalled_by = 123456 
   WHERE id = 789;
   
   -- 验证更新
   SELECT id, recalled_at, recalled_by 
   FROM chat_records 
   WHERE id = 789;
   ```

**预期：** `recalled_at` 应该有值，`recalled_by` 应该是 `123456`

---

### 步骤 3：检查后端日志

重启后端后，执行撤回操作，查看日志：

**关键日志：**
```
ChatRecordService.recallMessage - 开始撤回消息：messageId=789, operatorId=123456
ChatRecordService.recallMessage - 查询结果：record=存在，senderId=123456, recalledAt=null
ChatRecordService.recallMessage - 准备更新数据库：recalledAt=2026-04-22T10:41:30, recalledBy=123456
ChatRecordService.recallMessage - 更新结果：affectedRows=1
ChatRecordService.recallMessage - 消息撤回成功，messageId=789
```

**如果看到 `affectedRows=0`：**
- 说明 `updateById` 没有生效
- 可能是 MyBatis-Plus 配置问题
- 需要使用 `update` 方法指定字段

---

### 步骤 4：检查前端控制台

**预期日志：**
```
【DEBUG】前端准备撤回消息，messageId: 789 type: number
【DEBUG】撤回成功，result: {code: 200, data: {...}}
```

**如果 `messageId` 是 `undefined`：**
- 说明消息对象的 `messageId` 字段没有正确设置
- 检查发送消息时的返回值

---

## 🐛 可能的问题及解决方案

### 问题 A：数据库字段不存在

**症状：** 撤回时后端报错 "Unknown column 'recalled_at'"

**解决：** 执行步骤 1 的 SQL 添加字段

---

### 问题 B：updateById 不生效

**症状：** 日志显示 `affectedRows=0`

**原因：** MyBatis-Plus 的 `updateById` 只更新**非 null 且值发生变化**的字段

**解决方案 1：** 使用 `UpdateWrapper` 强制更新

修改 `ChatRecordService.java`：

```java
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;

// 在 recallMessage 方法中替换 updateById：
UpdateWrapper<ChatRecord> wrapper = new UpdateWrapper<>();
wrapper.eq("id", messageId)
       .set("recalled_at", now)
       .set("recalled_by", operatorId);

int updateResult = chatRecordRepository.update(null, wrapper);
```

**解决方案 2：** 使用 `updateById` 但确保字段不为 null（已实现）

---

### 问题 C：缓存未清除

**症状：** 数据库已更新，但刷新页面后还是旧数据

**原因：** Redis 缓存未清除

**解决：** 检查 `clearCache` 方法是否被调用

```java
// 撤回成功后必须调用
clearCache(record.getSenderId(), record.getReceiverId());
```

**手动清除缓存：**
```bash
redis-cli
KEYS chat:history:*
DEL chat:history:123456:654321
DEL chat:history:654321:123456
```

---

### 问题 D：前端传递的 messageId 错误

**症状：** 后端日志显示 `messageId=undefined` 或 `messageId=null`

**解决：**

1. 检查发送消息时的返回值：
   ```javascript
   console.log('发送消息返回:', result.data)
   // 应该看到：{ messageId: 789, ... }
   ```

2. 检查消息列表中 msg 对象：
   ```javascript
   console.log('消息对象:', msg)
   // 应该看到：{ messageId: 789, ... }
   ```

---

## ✅ 完整测试流程

### 1. 准备环境
```bash
# 1. 确认数据库字段存在
mysql -u root -p tutoring -e "DESC chat_records;" | grep recalled

# 2. 清除 Redis 缓存
redis-cli KEYS "chat:history:*" | xargs redis-cli DEL

# 3. 重启后端
cd backend
mvn spring-boot:run
```

### 2. 发送测试消息
- 打开学生端，发送消息给教师端
- 记录消息 ID（从浏览器控制台或数据库）

### 3. 测试撤回
- 右键点击消息（2 分钟内）
- 点击"撤回"按钮
- 查看控制台日志

### 4. 验证结果
```sql
-- 检查数据库
SELECT id, message, recalled_at, recalled_by 
FROM chat_records 
ORDER BY id DESC 
LIMIT 1;

-- 预期：recalled_at 有值，recalled_by 有值
```

### 5. 刷新页面
- 刷新浏览器
- 消息应该仍然显示为"↩️ 消息已撤回"
- 如果恢复为原消息，说明缓存或数据库有问题

---

## 🔧 紧急修复方案

如果上述步骤都无法解决，使用这个强制更新版本：

### 修改 ChatRecordService.java

```java
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;

@Transactional(rollbackFor = Exception.class)
public ChatRecord recallMessage(Long messageId, Long operatorId) {
    log.info("开始撤回消息：messageId={}, operatorId={}", messageId, operatorId);
    
    // 查询消息
    ChatRecord record = chatRecordRepository.selectById(messageId);
    if (record == null) {
        throw new IllegalArgumentException("消息不存在");
    }
    
    // 验证权限
    if (!record.getSenderId().equals(operatorId)) {
        throw new IllegalArgumentException("只有发送者才能撤回");
    }
    
    // 检查时限
    if (!canRecall(record)) {
        throw new IllegalArgumentException("超过撤回时限");
    }
    
    // 强制更新（使用 UpdateWrapper）
    LocalDateTime now = LocalDateTime.now();
    UpdateWrapper<ChatRecord> wrapper = new UpdateWrapper<>();
    wrapper.eq("id", messageId)
           .set("recalled_at", now)
           .set("recalled_by", operatorId);
    
    int updateResult = chatRecordRepository.update(null, wrapper);
    log.info("更新结果：affectedRows={}", updateResult);
    
    if (updateResult == 0) {
        throw new RuntimeException("撤回失败");
    }
    
    // 清除缓存
    clearCache(record.getSenderId(), record.getReceiverId());
    
    // 重新查询以获取最新数据
    ChatRecord updatedRecord = chatRecordRepository.selectById(messageId);
    
    // 推送通知...
    return updatedRecord;
}
```

---

## 📞 需要帮助？

提供以下信息：

1. **数据库字段检查结果**
2. **后端完整日志**（从撤回开始到结束）
3. **前端控制台日志**
4. **撤回前后的 SQL 查询结果**

---

**最后更新：** 2026-04-22 10:41
