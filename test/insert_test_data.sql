-- ============================================
-- 师生匹配系统 - 测试数据插入脚本
-- 作用：生成匹配统计功能的测试数据
-- ============================================

-- 清空现有测试数据（可选，如果需要重新开始）
-- DELETE FROM teacher_student_matches WHERE id >= 2041436800000000001;

-- 1. 获取第一个教师和第一个学生的 ID（从 students 和 teachers 表）
SET @t1 = (SELECT id FROM teachers LIMIT 1);
SET @t2 = (SELECT id FROM teachers LIMIT 1 OFFSET 1);
SET @t3 = (SELECT id FROM teachers LIMIT 1 OFFSET 2);

SET @s1 = (SELECT id FROM students LIMIT 1);
SET @s2 = (SELECT id FROM students LIMIT 1 OFFSET 1);
SET @s3 = (SELECT id FROM students LIMIT 1 OFFSET 2);
SET @s4 = (SELECT id FROM students LIMIT 1 OFFSET 3);
SET @s5 = (SELECT id FROM students LIMIT 1 OFFSET 4);

-- 显示获取到的 ID（用于调试）
SELECT 
    @t1 AS teacher1_id, 
    @t2 AS teacher2_id, 
    @t3 AS teacher3_id,
    @s1 AS student1_id, 
    @s2 AS student2_id, 
    @s3 AS student3_id,
    @s4 AS student4_id, 
    @s5 AS student5_id;

-- 2. 插入 12 条测试匹配记录
-- 状态码说明：0-待确认，1-待家长确认，2-已匹配（成功），3-已拒绝

INSERT INTO teacher_student_matches (
    id, student_id, teacher_id, requester_type, 
    status, request_message, 
    student_confirm, teacher_confirm, parent_confirm, 
    created_at, updated_at, deleted
) VALUES
-- 状态 2：已匹配（成功）- 5 条
(2041436800000000001, @s1, @t1, 'student', 2, 'Math help', 1, 1, 1, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY), 0),
(2041436800000000002, @s2, @t2, 'student', 2, 'English help', 1, 1, 1, DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY), 0),
(2041436800000000003, @s3, @t3, 'teacher', 2, 'Physics help', 1, 1, 1, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), 0),
(2041436800000000004, @s4, @t1, 'teacher', 2, 'Science help', 1, 1, 1, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 0),
(2041436800000000005, @s5, @t2, 'student', 2, 'Chemistry help', 1, 1, 1, DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 0),

-- 状态 0：待确认 - 3 条
(2041436800000000006, @s1, @t2, 'student', 0, 'Bio help', 1, 0, 0, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 0),
(2041436800000000007, @s2, @t1, 'teacher', 0, 'Geo help', 0, 1, 0, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 0),
(2041436800000000008, @s3, @t2, 'student', 0, 'Hist help', 1, 0, 0, NOW(), NOW(), 0),

-- 状态 1：待家长确认 - 2 条
(2041436800000000009, @s4, @t3, 'teacher', 1, 'Art help', 1, 1, 0, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 0),
(2041436800000000010, @s5, @t3, 'student', 1, 'Music help', 1, 1, 0, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW(), 0),

-- 状态 3：已拒绝 - 2 条
(2041436800000000011, @s1, @t3, 'teacher', 3, 'PE help', 2, 1, 0, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY), 0),
(2041436800000000012, @s2, @t3, 'student', 3, 'Comp help', 1, 2, 0, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), 0);

-- 3. 验证插入结果
SELECT '=== 测试数据插入成功！===' AS result;

-- 查看所有匹配记录
SELECT 
    id,
    student_id,
    teacher_id,
    status,
    LEFT(request_message, 20) AS message,
    created_at
FROM teacher_student_matches
WHERE deleted = 0
ORDER BY created_at DESC;

-- 4. 查看全局统计数据
SELECT '=== 全局统计 ===' AS result;
SELECT 
    COUNT(*) AS totalMatches,
    SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS successfulMatches,
    SUM(CASE WHEN status IN (0, 1) THEN 1 ELSE 0 END) AS pendingMatches,
    SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS rejectedMatches,
    CONCAT(ROUND(SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2), '%') AS successRate
FROM teacher_student_matches
WHERE deleted = 0;

-- 5. 按教师统计
SELECT '=== 按教师统计 ===' AS result;
SELECT 
    teacher_id,
    COUNT(*) AS totalMatches,
    SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS successfulMatches,
    SUM(CASE WHEN status IN (0, 1) THEN 1 ELSE 0 END) AS pendingMatches,
    SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS rejectedMatches,
    CONCAT(ROUND(SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2), '%') AS successRate
FROM teacher_student_matches
WHERE deleted = 0
GROUP BY teacher_id;

-- 6. 按学生统计
SELECT '=== 按学生统计 ===' AS result;
SELECT 
    student_id,
    COUNT(*) AS totalMatches,
    SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS successfulMatches,
    SUM(CASE WHEN status IN (0, 1) THEN 1 ELSE 0 END) AS pendingMatches,
    SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS rejectedMatches,
    CONCAT(ROUND(SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2), '%') AS successRate
FROM teacher_student_matches
WHERE deleted = 0
GROUP BY student_id;
