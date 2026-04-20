# 测试账号汇总 / Test Accounts

**更新日期：** 2026-04-20  
**所有账号默认密码：** `Test1234!`

---

## 📚 账号列表

### 👨‍🏫 教师账号 (Teacher) - 3 个

| 用户名 | 密码 | 姓名 | 科目 | 用户 ID |
|--------|------|------|------|--------|
| `teacher_zhang` | Test1234! | 张明华 | 数学 | 1001 |
| `teacher_li` | Test1234! | 李雅文 | 英语 | 1002 |
| `teacher_wang` | Test1234! | 王晓文 | 语文 | 1003 |

### 👨‍🎓 学生账号 (Student) - 5 个

| 用户名 | 密码 | 姓名 | 年级 | 用户 ID |
|--------|------|------|------|--------|
| `student_ming` | Test1234! | 陈明 | 初三 | 2001 |
| `student_hua` | Test1234! | 李华 | 初二 | 2002 |
| `student_gang` | Test1234! | 王刚 | 高一 | 2003 |
| `student_fang` | Test1234! | 刘芳 | 初一 | 2004 |
| `student_jun` | Test1234! | 赵军 | 初三 | 2005 |

### 👨‍👩‍👧 家长账号 (Parent) - 3 个

| 用户名 | 密码 | 姓名 | 关联学生 | 用户 ID |
|--------|------|------|----------|--------|
| `parent_chen` | Test1234! | 陈建国 | 陈明 (父子) | 3001 |
| `parent_liu` | Test1234! | 刘美丽 | 李华、刘芳 (母子/母女) | 3002 |
| `parent_zhao` | Test1234! | 赵志强 | 王刚、赵军 (父子) | 3003 |

---

## 💬 聊天功能测试场景

### 场景 1：小明 ↔ 张老师 (数学辅导)
**登录：** student_ming / Test1234! (学生端)  
**聊天对象：** 张老师 (ID: 1001)

已有 5 条聊天记录：
- 小明请教数学题
- 张老师指导二次函数解题思路

### 场景 2：小华 ↔ 李老师 (英语学习)
**登录：** student_hua / Test1234! (学生端)  
**聊天对象：** 李老师 (ID: 1002)

已有 3 条聊天记录：
- 小华咨询英语口语练习建议
- 李老师给出学习方法指导

### 场景 3：小刚 ↔ 王老师 (作文辅导)
**登录：** student_gang / Test1234! (学生端)  
**聊天对象：** 王老师 (ID: 1003)

已有 1 条聊天记录：
- 小刚询问作文开头写作技巧

---

## 🧪 快速测试步骤

### 1. 学生端测试
```
1. 访问 http://localhost:3003
2. 登录：student_ming / Test1234!
3. 进入聊天页面
4. 应该能看到与张老师的对话记录
5. 发送新消息测试实时通信
```

### 2. 教师端测试
```
1. 访问 http://localhost:3002
2. 登录：teacher_zhang / Test1234!
3. 进入聊天页面
4. 查看学生发来的消息
5. 回复消息测试
```

### 3. WebSocket 实时通信测试
```
1. 同时打开两个浏览器窗口
2. 窗口 A：学生端登录 student_ming
3. 窗口 B：教师端登录 teacher_zhang
4. 在一方发送消息
5. 观察另一方是否实时收到
```

---

## 📊 数据库验证

```sql
-- 查看所有测试账号
SELECT id, username, role, name FROM users 
WHERE id >= 1001 AND id <= 3003
ORDER BY role, id;

-- 查看测试聊天记录
SELECT cr.id, cr.sender_id, cr.receiver_id, cr.message, cr.is_read, cr.sent_at
FROM chat_records cr
WHERE cr.id >= 9001
ORDER BY cr.sent_at DESC;
```

---

## ⚠️ 注意事项

1. **密码说明：** 所有测试账号密码均为 `Test1234!`，已 BCrypt 加密存储
2. **数据隔离：** 测试数据与生产数据请分开
3. **清理数据：** 如需重置，执行 DELETE 语句后重新导入

---

## 🔧 常见问题

### Q: 登录失败？
A: 确认后端已正确配置环境变量并重启，检查数据库连接是否正常

### Q: 聊天消息不显示？
A: 检查 WebSocket 连接状态，确认后端 Redis 是否运行

### Q: 中文乱码？
A: 确保 MySQL 字符集为 utf8mb4，连接时指定 `--default-character-set=utf8mb4`
