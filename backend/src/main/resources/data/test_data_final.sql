-- ============================================
-- 师生匹配系统 - 最终测试数据脚本
-- 根据实际数据库表结构生成
-- ============================================

-- 1. 查看现有的用户 ID（用于匹配）
-- SELECT id, username, role FROM users;
-- 角色：1=教师，2=学生，3=家长

-- 2. 插入测试匹配记录（使用现有的用户 ID）
-- 状态码：0-待确认，1-待家长确认，2-已匹配，3-已拒绝

-- 先清空现有匹配记录（可选）
-- DELETE FROM teacher_student_matches;

-- 获取教师和学生 ID（从现有数据）
SET @teacher1 = (SELECT id FROM users WHERE role = 1 LIMIT 1);
SET @teacher2 = (SELECT id FROM users WHERE role = 1 LIMIT 1 OFFSET 1);
SET @teacher3 = (SELECT id FROM users WHERE role = 1 LIMIT 1 OFFSET 2);

SET @student1 = (SELECT id FROM users WHERE role = 2 LIMIT 1);
SET @student2 = (SELECT id FROM users WHERE role = 2 LIMIT 1 OFFSET 1);
SET @student3 = (SELECT id FROM users WHERE role = 2 LIMIT 1 OFFSET 2);
SET @student4 = (SELECT id FROM users WHERE role = 2 LIMIT 1 OFFSET 3);
SET @student5 = (SELECT id FROM users WHERE role = 2 LIMIT 1 OFFSET 4);

-- 验证获取到的 ID
SELECT 
    @teacher1 AS teacher1_id, 
    @teacher2 AS teacher2_id, 
    @teacher3 AS teacher3_id,
    @student1 AS student1_id, 
    @student2 AS student2_id, 
    @student3 AS student3_id,
    @student4 AS student4_id, 
    @student5 AS student5_id;

-- 插入 12 条测试匹配记录
INSERT INTO teacher_student_matches (
    id, student_id, teacher_id, requester_type, 
    status, request_message, 
    student_confirm, teacher_confirm, parent_confirm, 
    created_at, updated_at, deleted
) VALUES
-- 状态 2：已匹配（成功）- 5 条
(2041436800000000001, @student1, @teacher1, 'student', 
 2, 'Hope to improve math grades', 
 1, 1, 1, 
 DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY), 0),

(2041436800000000002, @student2, @teacher2, 'student', 
 2, 'Want to improve English speaking', 
 1, 1, 1, 
 DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY), 0),

(2041436800000000003, @student3, @teacher3, 'teacher', 
 2, 'Physics is very important for you', 
 1, 1, 1, 
 DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), 0),

(2041436800000000004, @student4, @teacher1, 'teacher', 
 2, 'Math foundation needs strengthening', 
 1, 1, 1, 
 DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 0),

(2041436800000000005, @student5, @teacher2, 'student', 
 2, 'English learning is fun', 
 1, 1, 1, 
 DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 0),

-- 状态 0：待确认 - 3 条
(2041436800000000006, @student1, @teacher2, 'student', 
 0, 'Also want to learn English', 
 1, 0, 0, 
 DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 0),

(2041436800000000007, @student2, @teacher1, 'teacher', 
 0, 'Your math needs improvement', 
 0, 1, 0, 
 DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 0),

(2041436800000000008, @student3, @teacher2, 'student', 
 0, 'Interested in English too', 
 1, 0, 0, 
 NOW(), NOW(), 0),

-- 状态 1：待家长确认 - 2 条
(2041436800000000009, @student4, @teacher3, 'teacher', 
 1, 'Physics experiments are interesting', 
 1, 1, 0, 
 DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 0),

(2041436800000000010, @student5, @teacher3, 'student', 
 1, 'Want to learn physics knowledge', 
 1, 1, 0, 
 DATE_SUB(NOW(), INTERVAL 2 DAY), NOW(), 0),

-- 状态 3：已拒绝 - 2 条
(2041436800000000011, @student1, @teacher3, 'teacher', 
 3, 'Physics basic training', 
 2, 1, 0, 
 DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY), 0),

(2041436800000000012, @student2, @teacher3, 'student', 
 3, 'Want to study physics', 
 1, 2, 0, 
 DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), 0);

-- 验证插入结果
SELECT '=== Insert completed! ===' AS result;

-- 查看所有匹配记录
SELECT 
    id,
    student_id,
    teacher_id,
    requester_type,
    status,
    LEFT(request_message, 30) AS message_preview,
    student_confirm,
    teacher_confirm,
    parent_confirm,
    created_at
FROM teacher_student_matches
ORDER BY created_at DESC;

-- 查看统计数据
SELECT '=== Global Statistics ===' AS result;
SELECT 
    COUNT(*) AS totalMatches,
    SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS successfulMatches,
    SUM(CASE WHEN status IN (0, 1) THEN 1 ELSE 0 END) AS pendingMatches,
    SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS rejectedMatches,
    CONCAT(ROUND(SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2), '%') AS successRate
FROM teacher_student_matches
WHERE deleted = 0;

-- 按教师统计
SELECT '=== Statistics by Teacher ===' AS result;
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

-- 按学生统计
SELECT '=== Statistics by Student ===' AS result;
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
