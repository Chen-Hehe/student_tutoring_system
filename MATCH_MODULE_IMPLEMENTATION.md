# 匹配管理模块实现总结

## 📋 实现内容

### 1. DTO 类（数据传输对象）

#### MatchRequest.java
- 匹配请求 DTO
- 字段：studentId, teacherId, requesterType, requestMessage, subject

#### MatchResponse.java
- 匹配响应 DTO
- 包含完整的匹配信息（学生信息、教师信息、状态等）

#### AIRecommendationResponse.java
- AI 推荐响应 DTO
- 字段：学生信息、匹配分数、匹配原因

---

### 2. Repository 层（数据访问）

#### TeacherStudentMatchRepository.java
- 继承 MyBatis-Plus 的 BaseMapper
- 自定义查询方法：
  - `selectByTeacherId` - 查询教师的匹配列表
  - `selectByStudentId` - 查询学生的匹配列表
  - `selectPendingByTeacherId` - 查询待处理的匹配（教师）
  - `selectPendingByStudentId` - 查询待处理的匹配（学生）

#### StudentRepository.java
- 学生数据访问接口

#### TeacherRepository.java
- 教师数据访问接口

#### TeacherStudentMatchMapper.xml
- MyBatis XML 映射文件
- 实现自定义 SQL 查询

---

### 3. Service 层（业务逻辑）

#### MatchService.java
核心功能：

1. **getTeacherMatches(Long teacherId)**
   - 获取教师的匹配列表

2. **getStudentMatches(Long studentId)**
   - 获取学生的匹配列表

3. **createMatch(MatchRequest request)**
   - 创建匹配请求
   - 验证学生和教师是否存在
   - 检查是否已存在匹配

4. **sendInvitation(Long teacherId, Long studentId, String message)**
   - 教师主动发送辅导邀请

5. **acceptMatch(Long matchId, Long userId, String userType)**
   - 接受匹配请求
   - 支持学生/教师/家长三种角色
   - 自动更新匹配状态

6. **rejectMatch(Long matchId, Long userId, String userType)**
   - 拒绝匹配请求
   - 更新状态为已拒绝

7. **getTeacherRecommendations(Long teacherId)**
   - 获取 AI 推荐的学生列表
   - 基于科目匹配算法
   - 返回匹配分数和原因

8. **updateMatchStatus(TeacherStudentMatch match)**
   - 内部方法，自动更新匹配状态
   - 状态流转：0(待确认) → 1(待家长确认) → 2(已匹配) → 3(已拒绝)

---

### 4. Controller 层（REST API）

#### MatchController.java

| 端点 | 方法 | 描述 |
|------|------|------|
| `GET /api/matches/teacher/{teacherId}` | GET | 获取教师的匹配列表 |
| `GET /api/matches/student/{studentId}` | GET | 获取学生的匹配列表 |
| `POST /api/matches` | POST | 创建匹配请求 |
| `POST /api/matches/invite` | POST | 发送辅导邀请（教师主动） |
| `POST /api/matches/{matchId}/accept` | POST | 接受匹配请求 |
| `POST /api/matches/{matchId}/reject` | POST | 拒绝匹配请求 |
| `PUT /api/matches/{matchId}/status` | PUT | 更新匹配状态 |
| `GET /api/matches/{matchId}` | GET | 获取匹配详情 |
| `GET /api/matches/recommendations/teacher/{teacherId}` | GET | 获取 AI 推荐学生（教师视角） |
| `GET /api/matches/recommendations/student/{studentId}` | GET | 获取 AI 推荐教师（学生视角） |

---

## 🔄 匹配状态流转

```
状态码说明：
0 - 待确认
1 - 待家长确认
2 - 已匹配
3 - 已拒绝

确认状态：
0 - 未操作
1 - 已同意
2 - 已拒绝
```

### 状态流转逻辑

**学生发起的请求：**
```
创建 (status=0)
  → 教师确认 (teacherConfirm=1, status=1 待家长确认)
  → 家长确认 (parentConfirm=1, status=2 已匹配)
```

**教师发起的邀请：**
```
创建 (status=0)
  → 学生确认 (studentConfirm=1)
  → 家长确认 (parentConfirm=1, status=2 已匹配)
```

**任意一方拒绝：**
```
任何状态 → 任意 confirm=2 → status=3 已拒绝
```

---

## 🧪 测试数据

### 测试账号

**教师账号：**
- 用户名：teacher1
- 密码：123456
- 角色：1 (教师)
- 科目：数学

**学生账号：**
- 用户名：student1
- 密码：123456
- 角色：2 (学生)
- 年级：初一
- 学校：希望中学
- 学习需求：数学

---

## 📊 AI 匹配算法（简化版）

当前实现：
- 基础分数：50 分
- 科目匹配：+30 分（学生学习需求包含教师科目）
- 经验匹配：+20 分（教师经验包含学生年级）
- 总分 ≥ 60 分才会被推荐
- 最多返回 20 个推荐

---

## 🔧 配置说明

### 数据库表
- `teacher_student_matches` - 师生匹配表

### 依赖
- MyBatis-Plus (ORM)
- Spring Security (认证)
- JWT (Token 认证)

---

## 🚀 使用示例

### 1. 教师发送辅导邀请
```bash
POST http://localhost:8080/api/matches/invite
Content-Type: application/json
Authorization: Bearer {token}

{
  "teacherId": 2041436600118394881,
  "studentId": 2041436613062017026,
  "message": "你好，我是数学老师，看到你需要数学辅导，希望能帮助你。"
}
```

### 2. 学生接受匹配
```bash
POST http://localhost:8080/api/matches/{matchId}/accept
Content-Type: application/json
Authorization: Bearer {token}

{
  "userId": 2041436613062017026,
  "userType": "student"
}
```

### 3. 获取 AI 推荐
```bash
GET http://localhost:8080/api/matches/recommendations/teacher/{teacherId}
Authorization: Bearer {token}
```

---

## 📝 后续优化建议

1. **AI 匹配算法优化**
   - 引入更多匹配维度（地理位置、时间安排等）
   - 使用机器学习模型

2. **通知功能**
   - 匹配状态变更时发送通知
   - WebSocket 实时推送

3. **数据统计**
   - 匹配成功率统计
   - 教师/学生满意度调查

4. **权限控制**
   - 完善 RBAC 权限管理
   - 基于角色的接口访问控制

---

## ✅ 完成时间
2026-04-07
