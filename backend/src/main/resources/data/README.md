# 测试数据脚本说明

## 问题诊断

如果你的数据库是旧版本，可能缺少某些字段或表。请按以下步骤操作：

### 步骤 1：检查表结构

在 MySQL 中执行：
```sql
source D:/app_extension/cursor_projects/student_tutoring_system/backend/src/main/resources/data/check_table_structure.sql
```

或者手动执行：
```sql
DESC teacher_student_matches;
SHOW TABLES;
```

### 步骤 2：根据表结构选择脚本

**如果 `teacher_student_matches` 表有 `status` 字段：**
```sql
source D:/app_extension/cursor_projects/student_tutoring_system/backend/src/main/resources/data/test_match_data_simple.sql
```

**如果表结构完全不同：**
请执行以下步骤手动创建测试数据。

---

## 手动创建测试数据（最可靠）

### 1. 查看当前的表结构
```sql
DESC teacher_student_matches;
```

### 2. 查看现有的用户 ID
```sql
-- 查看所有用户
SELECT id, username, name, role FROM users;

-- 角色说明：1=教师，2=学生，3=家长，4=管理员
```

### 3. 插入匹配记录（根据你的表结构调整）

```sql
-- 示例：插入一条 status=2 的匹配记录
INSERT INTO teacher_student_matches (
    id, student_id, teacher_id, requester_type, 
    status, request_message, 
    student_confirm, teacher_confirm, parent_confirm, 
    created_at, updated_at, deleted
) VALUES (
    2041436800000000001, 
    [学生 ID], 
    [教师 ID], 
    'student', 
    2, 
    'Test message', 
    1, 1, 1, 
    NOW(), NOW(), 0
);
```

### 4. 验证统计数据
```sql
SELECT 
    COUNT(*) AS totalMatches,
    SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS successfulMatches,
    SUM(CASE WHEN status IN (0, 1) THEN 1 ELSE 0 END) AS pendingMatches,
    SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS rejectedMatches,
    CONCAT(ROUND(SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2), '%') AS successRate
FROM teacher_student_matches
WHERE deleted = 0;
```

---

## 快速测试（如果已有用户数据）

假设你已经有用户数据，执行以下 SQL 创建测试匹配：

```sql
-- 获取第一个教师和第一个学生的 ID
SET @teacher_id = (SELECT id FROM users WHERE role = 1 LIMIT 1);
SET @student_id = (SELECT id FROM users WHERE role = 2 LIMIT 1);

-- 插入 5 条成功匹配
INSERT INTO teacher_student_matches (
    id, student_id, teacher_id, requester_type, status, 
    request_message, student_confirm, teacher_confirm, parent_confirm, 
    created_at, updated_at, deleted
) VALUES 
(2041436800000000001, @student_id, @teacher_id, 'student', 2, 
 'Test 1', 1, 1, 1, NOW(), NOW(), 0),
(2041436800000000002, @student_id, @teacher_id, 'teacher', 2, 
 'Test 2', 1, 1, 1, NOW(), NOW(), 0);

-- 插入 2 条待确认
INSERT INTO teacher_student_matches (
    id, student_id, teacher_id, requester_type, status, 
    request_message, student_confirm, teacher_confirm, parent_confirm, 
    created_at, updated_at, deleted
) VALUES 
(2041436800000000003, @student_id, @teacher_id, 'student', 0, 
 'Test 3', 1, 0, 0, NOW(), NOW(), 0);

-- 插入 1 条已拒绝
INSERT INTO teacher_student_matches (
    id, student_id, teacher_id, requester_type, status, 
    request_message, student_confirm, teacher_confirm, parent_confirm, 
    created_at, updated_at, deleted
) VALUES 
(2041436800000000004, @student_id, @teacher_id, 'teacher', 3, 
 'Test 4', 1, 2, 0, NOW(), NOW(), 0);

-- 验证
SELECT * FROM teacher_student_matches;
```

---

## 如果 request_message 字段长度问题

如果插入时报 `Data too long for column 'request_message'`，修改为短消息：

```sql
-- 使用英文短消息
INSERT INTO teacher_student_matches (... request_message, ...) 
VALUES (..., 'Math help', ...);

-- 或者检查字段长度
DESC teacher_student_matches;
-- 如果是 VARCHAR(50)，修改为 VARCHAR(500)
ALTER TABLE teacher_student_matches MODIFY request_message VARCHAR(500);
```

---

## 测试 API

数据插入后，测试统计接口：

```bash
curl http://localhost:8080/api/matches/statistics
```

---

## 需要帮助？

如果以上都不行，请提供：
1. `DESC teacher_student_matches;` 的输出
2. `SELECT COUNT(*) FROM users;` 的输出
3. 现有的用户 ID 列表

这样可以生成完全匹配你数据库的测试数据。
