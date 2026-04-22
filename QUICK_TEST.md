# 快速测试指南 🦞

## 步骤 1：导入测试数据

### 方式 A：使用 MySQL 命令行
```bash
# 打开命令行，执行：
mysql -u root -p tutoring
# 输入密码后，执行：
source D:/app_extension/cursor_projects/student_tutoring_system/backend/src/main/resources/data/test_match_data.sql
```

### 方式 B：使用 MySQL Workbench / Navicat
1. 打开 MySQL Workbench 或 Navicat
2. 连接到数据库 `tutoring`
3. 打开文件：`backend/src/main/resources/data/test_match_data.sql`
4. 执行 SQL 脚本

### 方式 C：直接在数据库查询验证
如果已经有数据，可以直接测试 API。

---

## 步骤 2：测试 API 接口

### 测试 1：全局统计
```bash
curl http://localhost:8080/api/matches/statistics
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
    "successRate": "41.67%"
  }
}
```

### 测试 2：按教师统计
```bash
curl "http://localhost:8080/api/matches/statistics?teacherId=2041436700118394881"
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
    "successRate": "66.67%"
  }
}
```

### 测试 3：按学生统计
```bash
curl "http://localhost:8080/api/matches/statistics?studentId=2041436713062017026"
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
    "successRate": "33.33%"
  }
}
```

---

## 步骤 3：前端测试

### Admin Dashboard
1. 访问：http://localhost:3001
2. 登录管理员账号
3. 查看 Dashboard 的匹配统计卡片

### Teacher Dashboard
1. 访问：http://localhost:3002
2. 登录：teacher_zhang / 123456
3. 查看 Dashboard 的统计卡片

---

## 快速验证 SQL

在 MySQL 中执行：
```sql
-- 查看统计数据
SELECT 
    COUNT(*) AS 总匹配数,
    SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS 成功数,
    SUM(CASE WHEN status IN (0, 1) THEN 1 ELSE 0 END) AS 待确认数,
    SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS 已拒绝数
FROM teacher_student_matches
WHERE deleted = 0;
```

---

## 如果数据库密码不对

修改 `application.yml` 中的密码，或者用正确的密码执行：
```bash
mysql -u root -p[你的密码] tutoring < test_match_data.sql
```
