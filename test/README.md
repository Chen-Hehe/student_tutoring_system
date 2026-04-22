# 测试数据指南

## 目录说明

本目录包含匹配统计功能的测试数据和测试脚本。

---

## 文件清单

| 文件 | 作用 |
|------|------|
| `insert_test_data.sql` | 测试数据插入脚本（执行此文件） |
| `verify_data.sql` | 数据验证脚本 |
| `api_test.sh` | API 测试脚本（curl） |
| `README.md` | 本说明文件 |

---

## 快速开始

### 步骤 1：插入测试数据

在 MySQL 命令行中执行：

```sql
source D:/app_extension/cursor_projects/student_tutoring_system/test/insert_test_data.sql
```

或者复制粘贴 `insert_test_data.sql` 的内容到 MySQL 客户端执行。

### 步骤 2：验证数据

执行后会自动显示统计数据：

```
=== 全局统计 ===
+--------------+-------------------+----------------+-----------------+-------------+
| totalMatches | successfulMatches | pendingMatches | rejectedMatches | successRate |
+--------------+-------------------+----------------+-----------------+-------------+
| 12           | 5                 | 5              | 2               | 41.67%      |
+--------------+-------------------+----------------+-----------------+-------------+
```

### 步骤 3：测试 API

```bash
# 全局统计
curl http://localhost:8080/api/matches/statistics

# 教师视角（替换为你的教师 ID）
curl "http://localhost:8080/api/matches/statistics?teacherId=你的教师 ID"

# 学生视角（替换为你的学生 ID）
curl "http://localhost:8080/api/matches/statistics?studentId=你的学生 ID"
```

### 步骤 4：查看前端

- **Admin Dashboard**: http://localhost:3001
- **Teacher Dashboard**: http://localhost:3002

---

## 测试数据说明

### 数据分布

| 状态 | 数量 | 说明 |
|------|------|------|
| 0 - 待确认 | 3 条 | 等待对方确认 |
| 1 - 待家长确认 | 2 条 | 等待家长确认 |
| 2 - 已匹配 | 5 条 | 匹配成功 |
| 3 - 已拒绝 | 2 条 | 匹配失败 |

### 预期统计

- **总匹配数**: 12
- **成功匹配**: 5
- **待确认**: 5
- **已拒绝**: 2
- **成功率**: 41.67%

---

## 常见问题

### 问题 1：外键约束错误

**错误信息：**
```
ERROR 1452 (23000): Cannot add or update a child row: 
a foreign key constraint fails (tutoring.teacher_student_matches, 
CONSTRAINT teacher_student_matches_ibfk_1 FOREIGN KEY (student_id) 
REFERENCES students (id))
```

**原因：** `teacher_student_matches` 表的 `student_id` 和 `teacher_id` 必须引用 `students` 和 `teachers` 表中已存在的 ID。

**解决方法：**
1. 确保 `students` 和 `teachers` 表中有数据
2. 脚本会自动获取现有的学生和教师 ID

### 问题 2：ID 重复错误

**错误信息：**
```
ERROR 1062 (23000): Duplicate entry '2041436800000000001' for key 'PRIMARY'
```

**原因：** 测试数据 ID 已存在。

**解决方法：**
```sql
-- 清空测试数据
DELETE FROM teacher_student_matches WHERE id >= 2041436800000000001;

-- 重新执行插入脚本
source D:/app_extension/cursor_projects/student_tutoring_system/test/insert_test_data.sql
```

### 问题 3：字符集错误

**错误信息：**
```
ERROR 1366 (HY000): Incorrect string value: '\xE4\xB8\xAD\xE6\x96\x87'
```

**原因：** 中文字符集不匹配。

**解决方法：** 测试数据使用英文短消息，避免字符集问题。

---

## 清理测试数据

```sql
-- 删除所有测试数据
DELETE FROM teacher_student_matches WHERE id >= 2041436800000000001;

-- 验证是否清空
SELECT COUNT(*) FROM teacher_student_matches;
```

---

## API 测试用例

### 用例 1：全局统计

**请求：**
```bash
curl http://localhost:8080/api/matches/statistics
```

**预期响应：**
```json
{
  "code": 200,
  "data": {
    "totalMatches": 12,
    "successfulMatches": 5,
    "pendingMatches": 5,
    "rejectedMatches": 2,
    "successRate": "41.67%"
  }
}
```

### 用例 2：按教师统计

**请求：**
```bash
curl "http://localhost:8080/api/matches/statistics?teacherId=[教师 ID]"
```

**预期：** 返回该教师的个人统计数据

### 用例 3：按学生统计

**请求：**
```bash
curl "http://localhost:8080/api/matches/statistics?studentId=[学生 ID]"
```

**预期：** 返回该学生的个人统计数据

---

## 相关文档

- [匹配统计功能说明](../docs/匹配统计功能说明.md)

---

## 更新日期

2026-04-23
