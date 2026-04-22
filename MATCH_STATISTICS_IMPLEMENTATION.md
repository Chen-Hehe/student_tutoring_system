# 匹配数据统计功能实现文档

## 概述

实现匹配数据统计功能，为 Admin、Teacher、Student 端提供实时统计面板，展示匹配成功率、待处理请求等关键指标。

---

## 后端实现

### 1. 新增文件

#### `MatchStatisticsDTO.java`
路径：`backend/src/main/java/com/tutoring/dto/MatchStatisticsDTO.java`

**字段说明：**
- `totalMatches`: 总匹配数
- `successfulMatches`: 已匹配成功数（status=2）
- `pendingMatches`: 待确认数（status=0 或 1）
- `rejectedMatches`: 已拒绝数（status=3）
- `successRate`: 成功率（百分比字符串，保留 2 位小数）
- `teacherId`: 可选，按教师筛选
- `studentId`: 可选，按学生筛选

**核心方法：**
```java
public void calculateSuccessRate() {
    // 计算成功率 = successfulMatches / totalMatches * 100%
}
```

---

### 2. 修改文件

#### `TeacherStudentMatchRepository.java`
路径：`backend/src/main/java/com/tutoring/repository/TeacherStudentMatchRepository.java`

**新增方法：**
```java
Map<String, Object> getMatchStatistics(
    @Param("teacherId") Long teacherId, 
    @Param("studentId") Long studentId
);
```

---

#### `TeacherStudentMatchMapper.xml`
路径：`backend/src/main/resources/mapper/TeacherStudentMatchMapper.xml`

**新增 SQL 查询：**
```xml
<select id="getMatchStatistics" resultType="java.util.HashMap">
    SELECT
        COUNT(*) AS totalMatches,
        SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS successfulMatches,
        SUM(CASE WHEN status IN (0, 1) THEN 1 ELSE 0 END) AS pendingMatches,
        SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS rejectedMatches
    FROM teacher_student_matches
    WHERE deleted = 0
    <if test="teacherId != null">
        AND teacher_id = #{teacherId}
    </if>
    <if test="studentId != null">
        AND student_id = #{studentId}
    </if>
</select>
```

---

#### `MatchService.java`
路径：`backend/src/main/java/com/tutoring/service/MatchService.java`

**新增方法：**
```java
public MatchStatisticsDTO getMatchStatistics(Long teacherId, Long studentId) {
    Map<String, Object> result = matchRepository.getMatchStatistics(teacherId, studentId);
    
    MatchStatisticsDTO dto = new MatchStatisticsDTO();
    dto.setTotalMatches(getLongValue(result, "totalMatches"));
    dto.setSuccessfulMatches(getLongValue(result, "successfulMatches"));
    dto.setPendingMatches(getLongValue(result, "pendingMatches"));
    dto.setRejectedMatches(getLongValue(result, "rejectedMatches"));
    
    // 计算成功率
    dto.calculateSuccessRate();
    
    return dto;
}
```

---

#### `MatchController.java`
路径：`backend/src/main/java/com/tutoring/controller/MatchController.java`

**新增接口：**
```java
/**
 * 获取匹配统计数据
 * 支持全局统计（Admin 视角）或按用户筛选（教师/学生视角）
 */
@GetMapping("/statistics")
public Result<MatchStatisticsDTO> getMatchStatistics(
        @RequestParam(required = false) Long teacherId,
        @RequestParam(required = false) Long studentId
) {
    MatchStatisticsDTO statistics = matchService.getMatchStatistics(teacherId, studentId);
    return Result.success(statistics);
}
```

---

## 前端实现

### 1. API 接口

#### Admin 端
文件：`admin-frontend/src/services/adminApi.js`

```javascript
getMatchStatistics: () => {
  return api.get('/matches/statistics')
}
```

#### Teacher 端
文件：`teacher-frontend/src/services/matchApi.js`

```javascript
getStatistics: (teacherId) => {
  return api.get('/matches/statistics', {
    params: { teacherId }
  })
}
```

---

### 2. Dashboard 组件

#### Admin Dashboard
文件：`admin-frontend/src/pages/Dashboard.jsx`

**新增统计卡片：**
- 总匹配数（蓝色）
- 已匹配成功（绿色）
- 待确认（橙色）
- 成功率（绿色，带 % 符号）

**调用方式：**
```javascript
const fetchMatchStatistics = async () => {
  const response = await adminAPI.getMatchStatistics()
  setMatchStats(response.data)
}
```

---

#### Teacher Dashboard
文件：`teacher-frontend/src/pages/Dashboard.jsx`

**修改统计卡片：**
- 总匹配数（替代原来的"辅导学生数"）
- 待处理请求
- 进行中辅导
- 成功率（新增）

**调用方式：**
```javascript
const loadDashboardData = async () => {
  // 加载匹配列表
  const result = await matchAPI.getTeacherMatches(currentUser.id)
  
  // 加载统计数据
  const statsResult = await matchAPI.getStatistics(currentUser.id)
  const statistics = statsResult.data
}
```

---

## REST API 接口文档

### GET /api/matches/statistics

**描述：** 获取匹配统计数据

**请求参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| teacherId | Long | 否 | 教师 ID（教师视角） |
| studentId | Long | 否 | 学生 ID（学生视角） |

**响应格式：**
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "totalMatches": 100,
    "successfulMatches": 65,
    "pendingMatches": 20,
    "rejectedMatches": 15,
    "successRate": "65.00%",
    "teacherId": null,
    "studentId": null
  }
}
```

**使用场景：**
1. **Admin 视角**：不传参数，获取全局统计
   ```
   GET /api/matches/statistics
   ```

2. **教师视角**：传入 teacherId
   ```
   GET /api/matches/statistics?teacherId=2041436600118394881
   ```

3. **学生视角**：传入 studentId
   ```
   GET /api/matches/statistics?studentId=2041436613062017026
   ```

---

## 状态码说明

| 状态码 | 说明 | 统计归类 |
|--------|------|----------|
| 0 | 待确认 | pendingMatches |
| 1 | 待家长确认 | pendingMatches |
| 2 | 已匹配 | successfulMatches |
| 3 | 已拒绝 | rejectedMatches |

---

## 测试步骤

### 1. 后端测试

```bash
# 启动后端服务
cd backend
mvn spring-boot:run
```

**测试接口：**
```bash
# 全局统计
curl http://localhost:8080/api/matches/statistics

# 教师视角统计
curl http://localhost:8080/api/matches/statistics?teacherId=2041436600118394881
```

### 2. 前端测试

**Admin 端：**
```bash
cd admin-frontend
npm run dev
```
访问 Dashboard 页面，查看匹配统计卡片。

**Teacher 端：**
```bash
cd teacher-frontend
npm run dev
```
访问 Dashboard 页面，查看个人匹配统计。

---

## 注意事项

1. **分母为 0 保护**：当 totalMatches=0 时，successRate 返回 "0.00%"
2. **数据精度**：成功率保留 2 位小数，使用 BigDecimal 计算
3. **逻辑删除**：统计查询包含 `deleted=0` 条件，不统计已删除记录
4. **权限控制**：当前接口未做权限校验，建议后续添加 JWT 验证
5. **性能优化**：大数据量时考虑添加缓存（Redis）

---

## 后续优化建议

1. **时间范围筛选**：支持按日/周/月统计
2. **趋势图表**：添加折线图展示匹配趋势
3. **科目分布**：按科目统计匹配数量
4. **缓存优化**：对统计数据添加 Redis 缓存，定时更新
5. **导出功能**：支持导出统计报表（Excel/PDF）

---

## 相关文件清单

### 后端
- ✅ `backend/src/main/java/com/tutoring/dto/MatchStatisticsDTO.java` (新建)
- ✅ `backend/src/main/java/com/tutoring/repository/TeacherStudentMatchRepository.java` (修改)
- ✅ `backend/src/main/resources/mapper/TeacherStudentMatchMapper.xml` (修改)
- ✅ `backend/src/main/java/com/tutoring/service/MatchService.java` (修改)
- ✅ `backend/src/main/java/com/tutoring/controller/MatchController.java` (修改)

### 前端
- ✅ `admin-frontend/src/services/adminApi.js` (修改)
- ✅ `admin-frontend/src/pages/Dashboard.jsx` (修改)
- ✅ `teacher-frontend/src/services/matchApi.js` (修改)
- ✅ `teacher-frontend/src/pages/Dashboard.jsx` (修改)

---

## 完成时间
2026-04-23
