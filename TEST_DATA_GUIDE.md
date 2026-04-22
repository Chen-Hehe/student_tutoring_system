# 测试数据生成指南

## 目的
测试"匹配数据统计功能"是否成功实现。

---

## 方法一：使用 SQL 脚本（推荐）

### 1. 执行 SQL 脚本

```bash
# 连接到 MySQL
mysql -u root -p8022 tutoring

# 执行测试数据脚本
source D:\app_extension\cursor_projects\student_tutoring_system\backend\src\main\resources\data\test_match_data.sql
```

或者使用 MySQL Workbench / Navicat 等工具直接执行 `test_match_data.sql` 文件。

### 2. 预期统计数据

**全局统计：**
- 总匹配数：12
- 已匹配成功：5
- 待确认：5（3 条 status=0 + 2 条 status=1）
- 已拒绝：2
- **成功率：41.67%**

**按教师统计（张老师 teacher_id=2041436700118394881）：**
- 总匹配数：3
- 已匹配成功：2
- 待确认：1
- 已拒绝：0
- **成功率：66.67%**

**按学生统计（小明 student_id=2041436713062017026）：**
- 总匹配数：3
- 已匹配成功：1
- 待确认：1
- 已拒绝：1
- **成功率：33.33%**

---

## 方法二：使用 API 测试（Postman/curl）

### 1. 全局统计接口

```bash
curl -X GET "http://localhost:8080/api/matches/statistics"
```

**预期响应：**
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "totalMatches": 12,
    "successfulMatches": 5,
    "pendingMatches": 5,
    "rejectedMatches": 2,
    "successRate": "41.67%",
    "teacherId": null,
    "studentId": null
  }
}
```

### 2. 按教师统计接口

```bash
curl -X GET "http://localhost:8080/api/matches/statistics?teacherId=2041436700118394881"
```

**预期响应：**
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "totalMatches": 3,
    "successfulMatches": 2,
    "pendingMatches": 1,
    "rejectedMatches": 0,
    "successRate": "66.67%",
    "teacherId": 2041436700118394881,
    "studentId": null
  }
}
```

### 3. 按学生统计接口

```bash
curl -X GET "http://localhost:8080/api/matches/statistics?studentId=2041436713062017026"
```

**预期响应：**
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "totalMatches": 3,
    "successfulMatches": 1,
    "pendingMatches": 1,
    "rejectedMatches": 1,
    "successRate": "33.33%",
    "teacherId": null,
    "studentId": 2041436713062017026
  }
}
```

---

## 方法三：前端 Dashboard 测试

### 1. Admin 端测试

1. 访问：`http://localhost:3001/login`
2. 登录管理员账号
3. 进入 Dashboard 页面
4. 查看"匹配统计卡片"区域

**应该显示：**
- 总匹配数：12
- 已匹配成功：5
- 待确认：5
- 成功率：41.67%

### 2. Teacher 端测试

1. 访问：`http://localhost:3002/login`
2. 登录教师账号（teacher_zhang）
3. 进入 Dashboard 页面
4. 查看统计卡片

**应该显示：**
- 总匹配数：3
- 待处理请求：1
- 进行中辅导：2
- 成功率：66.67%

---

## 测试数据说明

### 用户账号

| 角色 | 用户名 | 密码 | 用户 ID |
|------|--------|------|--------|
| 教师 | teacher_zhang | 123456 | 2041436600118394881 |
| 教师 | teacher_wang | 123456 | 2041436600118394882 |
| 教师 | teacher_li | 123456 | 2041436600118394883 |
| 学生 | student_ming | 123456 | 2041436613062017026 |
| 学生 | student_hong | 123456 | 2041436613062017027 |
| 学生 | student_gang | 123456 | 2041436613062017028 |
| 学生 | student_fang | 123456 | 2041436613062017029 |
| 学生 | student_qiang | 123456 | 2041436613062017030 |

### 匹配记录分布

| Match ID | 学生 | 教师 | 状态 | 说明 |
|----------|------|------|------|------|
| 001 | 小明 | 张老师 | 2-已匹配 | 学生发起 |
| 002 | 小红 | 王老师 | 2-已匹配 | 学生发起 |
| 003 | 小刚 | 李老师 | 2-已匹配 | 教师发起 |
| 004 | 小芳 | 张老师 | 2-已匹配 | 教师发起 |
| 005 | 小强 | 王老师 | 2-已匹配 | 学生发起 |
| 006 | 小明 | 王老师 | 0-待确认 | 学生发起，待教师确认 |
| 007 | 小红 | 张老师 | 0-待确认 | 教师发起，待学生确认 |
| 008 | 小刚 | 王老师 | 0-待确认 | 学生发起，待教师确认 |
| 009 | 小芳 | 李老师 | 1-待家长确认 | 教师发起，已确认，待家长 |
| 010 | 小强 | 李老师 | 1-待家长确认 | 学生发起，已确认，待家长 |
| 011 | 小明 | 李老师 | 3-已拒绝 | 学生拒绝 |
| 012 | 小红 | 李老师 | 3-已拒绝 | 教师拒绝 |

---

## 验证 SQL 查询

在 MySQL 中执行以下查询验证数据：

```sql
-- 全局统计
SELECT 
    COUNT(*) AS totalMatches,
    SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS successfulMatches,
    SUM(CASE WHEN status IN (0, 1) THEN 1 ELSE 0 END) AS pendingMatches,
    SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS rejectedMatches
FROM teacher_student_matches
WHERE deleted = 0;

-- 按教师统计
SELECT 
    teacher_id,
    COUNT(*) AS total,
    SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS success,
    SUM(CASE WHEN status IN (0, 1) THEN 1 ELSE 0 END) AS pending,
    SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS rejected
FROM teacher_student_matches
WHERE deleted = 0
GROUP BY teacher_id;

-- 按学生统计
SELECT 
    student_id,
    COUNT(*) AS total,
    SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS success,
    SUM(CASE WHEN status IN (0, 1) THEN 1 ELSE 0 END) AS pending,
    SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS rejected
FROM teacher_student_matches
WHERE deleted = 0
GROUP BY student_id;
```

---

## 常见问题排查

### 问题 1：接口返回 401 未授权
**解决：** 确保后端 JWT 配置正确，或者在请求头中添加 Token：
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" "http://localhost:8080/api/matches/statistics"
```

### 问题 2：统计数据为 0
**解决：** 检查 SQL 脚本是否成功执行，确认 `teacher_student_matches` 表中有数据。

### 问题 3：成功率计算错误
**解决：** 检查 `MatchStatisticsDTO.calculateSuccessRate()` 方法，确保分母不为 0。

---

## 清理测试数据

如果需要清理测试数据，执行：

```sql
-- 删除匹配记录
DELETE FROM teacher_student_matches WHERE id >= 2041436800000000001;

-- 删除学生信息
DELETE FROM student WHERE id >= 2041436713062017026;

-- 删除教师信息
DELETE FROM teacher WHERE id >= 2041436700118394881;

-- 删除用户信息
DELETE FROM users WHERE id >= 2041436600118394881;
```

---

## 完成时间
2026-04-23
