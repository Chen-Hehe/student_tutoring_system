# 快速开始 - 测试匹配统计功能 🦞

## 步骤 1：初始化测试数据

在 MySQL 中执行：

```sql
source D:/app_extension/cursor_projects/student_tutoring_system/test/init_test_data.sql
```

**这将：**
- ✅ 添加管理员账号（`admin / 123456`）
- ✅ 补充 students 和 teachers 表数据
- ✅ 验证所有数据

---

## 步骤 2：登录系统

### Admin Dashboard（管理员端）

1. 访问：http://localhost:3001
2. 登录：
   - **用户名**: `admin`
   - **密码**: `123456`
   - **角色**: 管理员
3. 查看 Dashboard 的匹配统计卡片

### Teacher Dashboard（教师端）

1. 访问：http://localhost:3002
2. 登录：
   - **用户名**: `teacher_zhang`
   - **密码**: `123456`
   - **角色**: 教师
3. 查看 Dashboard 的个人匹配统计

---

## 步骤 3：测试 API

### 全局统计（管理员视角）

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

### 按教师统计

```bash
curl "http://localhost:8080/api/matches/statistics?teacherId=2001"
```

**预期响应：**
```json
{
  "code": 200,
  "data": {
    "totalMatches": 3,
    "successfulMatches": 2,
    "pendingMatches": 1,
    "rejectedMatches": 0,
    "successRate": "66.67%"
  }
}
```

### 按学生统计

```bash
curl "http://localhost:8080/api/matches/statistics?studentId=3001"
```

**预期响应：**
```json
{
  "code": 200,
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

## 测试账号汇总

| 角色 | 用户名 | 密码 | 用户 ID | 前端地址 |
|------|--------|------|--------|----------|
| 管理员 | admin | 123456 | 4001 | http://localhost:3001 |
| 教师 | teacher_zhang | 123456 | 1001 | http://localhost:3002 |
| 教师 | teacher_li | 123456 | 1002 | http://localhost:3002 |
| 教师 | teacher_wang | 123456 | 1003 | http://localhost:3002 |
| 学生 | student_ming | 123456 | 2001 | http://localhost:3003 |
| 学生 | student_hua | 123456 | 2002 | http://localhost:3003 |
| 学生 | student_gang | 123456 | 2003 | http://localhost:3003 |
| 家长 | parent_chen | 123456 | 3001 | http://localhost:3004 |
| 家长 | parent_liu | 123456 | 3002 | http://localhost:3004 |

---

## 预期统计数据

### 全局统计（Admin 视角）

| 指标 | 数值 |
|------|------|
| 总匹配数 | 12 |
| 已匹配成功 | 5 |
| 待确认 | 5 |
| 已拒绝 | 2 |
| **成功率** | **41.67%** |

### 按教师统计

| 教师 ID | 总匹配 | 成功 | 待确认 | 已拒绝 | 成功率 |
|--------|--------|------|--------|--------|--------|
| 2001 | 3 | 2 | 1 | 0 | 66.67% |
| 2002 | 4 | 2 | 2 | 0 | 50.00% |
| 2003 | 5 | 1 | 2 | 2 | 20.00% |

### 按学生统计

| 学生 ID | 总匹配 | 成功 | 待确认 | 已拒绝 | 成功率 |
|--------|--------|------|--------|--------|--------|
| 3001 | 3 | 1 | 1 | 1 | 33.33% |
| 3002 | 3 | 1 | 1 | 1 | 33.33% |
| 3003 | 2 | 1 | 1 | 0 | 50.00% |
| 3004 | 2 | 1 | 1 | 0 | 50.00% |
| 3005 | 2 | 1 | 1 | 0 | 50.00% |

---

## 常见问题

### Q1: 403 Forbidden

**原因**: 未登录或 Token 过期

**解决**: 
1. 在前端登录获取 Token
2. 或直接在浏览器中访问 Dashboard

### Q2: 数据为 0

**原因**: 测试数据未导入

**解决**: 执行 `init_test_data.sql` 脚本

### Q3: 外键约束错误

**原因**: students/teachers 表无数据

**解决**: `init_test_data.sql` 会自动补充数据

---

## 相关文档

- [匹配统计功能说明](../docs/匹配统计功能说明.md)
- [测试数据指南](README.md)

---

**更新时间**: 2026-04-23
