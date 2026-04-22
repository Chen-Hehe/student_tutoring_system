# 一键测试 - 3 步完成 🦞

## 步骤 1：执行 SQL 脚本

在 MySQL 中执行：
```sql
source D:/app_extension/cursor_projects/student_tutoring_system/backend/src/main/resources/data/quick_insert.sql
```

或者复制粘贴以下内容到 MySQL 执行：

```sql
SET @t1 = (SELECT id FROM users WHERE role = 1 LIMIT 1);
SET @t2 = (SELECT id FROM users WHERE role = 1 LIMIT 1 OFFSET 1);
SET @s1 = (SELECT id FROM users WHERE role = 2 LIMIT 1);
SET @s2 = (SELECT id FROM users WHERE role = 2 LIMIT 1 OFFSET 1);
SET @s3 = (SELECT id FROM users WHERE role = 2 LIMIT 1 OFFSET 2);

INSERT INTO teacher_student_matches (id, student_id, teacher_id, requester_type, status, request_message, student_confirm, teacher_confirm, parent_confirm, created_at, updated_at, deleted) VALUES 
(2041436800000000001, @s1, @t1, 'student', 2, 'Math', 1, 1, 1, NOW(), NOW(), 0),
(2041436800000000002, @s2, @t2, 'student', 2, 'English', 1, 1, 1, NOW(), NOW(), 0),
(2041436800000000003, @s3, @t1, 'teacher', 2, 'Physics', 1, 1, 1, NOW(), NOW(), 0),
(2041436800000000004, @s1, @t2, 'teacher', 2, 'Science', 1, 1, 1, NOW(), NOW(), 0),
(2041436800000000005, @s2, @t1, 'student', 2, 'Chemistry', 1, 1, 1, NOW(), NOW(), 0),
(2041436800000000006, @s3, @t2, 'student', 0, 'Bio', 1, 0, 0, NOW(), NOW(), 0),
(2041436800000000007, @s1, @t1, 'teacher', 0, 'Geo', 0, 1, 0, NOW(), NOW(), 0),
(2041436800000000008, @s2, @t2, 'student', 0, 'Hist', 1, 0, 0, NOW(), NOW(), 0),
(2041436800000000009, @s3, @t1, 'teacher', 1, 'Art', 1, 1, 0, NOW(), NOW(), 0),
(2041436800000000010, @s1, @t2, 'student', 1, 'Music', 1, 1, 0, NOW(), NOW(), 0),
(2041436800000000011, @s2, @t1, 'teacher', 3, 'PE', 2, 1, 0, NOW(), NOW(), 0),
(2041436800000000012, @s3, @t2, 'student', 3, 'Comp', 1, 2, 0, NOW(), NOW(), 0);

SELECT COUNT(*) AS total_matches FROM teacher_student_matches;
```

---

## 步骤 2：测试 API

```bash
# 全局统计
curl http://localhost:8080/api/matches/statistics

# 按教师统计（替换为你的教师 ID）
curl "http://localhost:8080/api/matches/statistics?teacherId=[你的教师 ID]"

# 按学生统计（替换为你的学生 ID）
curl "http://localhost:8080/api/matches/statistics?studentId=[你的学生 ID]"
```

---

## 步骤 3：查看前端

- **Admin Dashboard**: http://localhost:3001
- **Teacher Dashboard**: http://localhost:3002

---

## 预期结果

**全局统计：**
- 总匹配数：12
- 成功：5
- 待确认：5
- 已拒绝：2
- 成功率：41.67%

---

## 如果报错

**错误：Column 'request_message' too long**
```sql
-- 修改字段长度
ALTER TABLE teacher_student_matches MODIFY request_message VARCHAR(500);
```

**错误：ID 重复**
```sql
-- 先清空数据
DELETE FROM teacher_student_matches;
-- 重新执行插入
```
