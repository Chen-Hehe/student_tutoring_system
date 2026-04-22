-- ============================================
-- 验证测试数据
-- ============================================

-- 1. 查看匹配记录总数
SELECT '=== 匹配记录总数 ===' AS result;
SELECT COUNT(*) AS total_count FROM teacher_student_matches WHERE deleted = 0;

-- 2. 按状态分组统计
SELECT '=== 按状态统计 ===' AS result;
SELECT 
    status,
    CASE status 
        WHEN 0 THEN '待确认'
        WHEN 1 THEN '待家长确认'
        WHEN 2 THEN '已匹配'
        WHEN 3 THEN '已拒绝'
        ELSE '未知'
    END AS status_name,
    COUNT(*) AS count
FROM teacher_student_matches
WHERE deleted = 0
GROUP BY status
ORDER BY status;

-- 3. 全局统计
SELECT '=== 全局统计 ===' AS result;
SELECT 
    COUNT(*) AS totalMatches,
    SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS successfulMatches,
    SUM(CASE WHEN status IN (0, 1) THEN 1 ELSE 0 END) AS pendingMatches,
    SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS rejectedMatches,
    CONCAT(ROUND(SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2), '%') AS successRate
FROM teacher_student_matches
WHERE deleted = 0;

-- 4. 按教师统计
SELECT '=== 按教师统计 ===' AS result;
SELECT 
    t.id AS teacher_id,
    t.name AS teacher_name,
    COUNT(*) AS totalMatches,
    SUM(CASE WHEN m.status = 2 THEN 1 ELSE 0 END) AS successfulMatches,
    SUM(CASE WHEN m.status IN (0, 1) THEN 1 ELSE 0 END) AS pendingMatches,
    SUM(CASE WHEN m.status = 3 THEN 1 ELSE 0 END) AS rejectedMatches,
    CONCAT(ROUND(SUM(CASE WHEN m.status = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2), '%') AS successRate
FROM teacher_student_matches m
JOIN teachers t ON m.teacher_id = t.id
WHERE m.deleted = 0
GROUP BY t.id, t.name;

-- 5. 按学生统计
SELECT '=== 按学生统计 ===' AS result;
SELECT 
    s.id AS student_id,
    s.name AS student_name,
    COUNT(*) AS totalMatches,
    SUM(CASE WHEN m.status = 2 THEN 1 ELSE 0 END) AS successfulMatches,
    SUM(CASE WHEN m.status IN (0, 1) THEN 1 ELSE 0 END) AS pendingMatches,
    SUM(CASE WHEN m.status = 3 THEN 1 ELSE 0 END) AS rejectedMatches,
    CONCAT(ROUND(SUM(CASE WHEN m.status = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2), '%') AS successRate
FROM teacher_student_matches m
JOIN students s ON m.student_id = s.id
WHERE m.deleted = 0
GROUP BY s.id, s.name;

-- 6. 查看详细匹配列表
SELECT '=== 匹配详情 ===' AS result;
SELECT 
    m.id,
    s.name AS student_name,
    t.name AS teacher_name,
    m.requester_type,
    m.status,
    CASE m.status 
        WHEN 0 THEN '待确认'
        WHEN 1 THEN '待家长确认'
        WHEN 2 THEN '已匹配'
        WHEN 3 THEN '已拒绝'
        ELSE '未知'
    END AS status_name,
    LEFT(m.request_message, 30) AS message,
    m.created_at
FROM teacher_student_matches m
JOIN students s ON m.student_id = s.id
JOIN teachers t ON m.teacher_id = t.id
WHERE m.deleted = 0
ORDER BY m.created_at DESC;
